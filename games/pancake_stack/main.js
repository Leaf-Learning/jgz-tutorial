WIDTH = 720;
HEIGHT = 480;
TITLE = "Pancake Stack";

// Tuning: change these numbers to change how the game feels.
const FLOOR = 455; // the y of the ground under the bear's feet
const CHEF_SPEED = 460; // how fast the bear slides, in pixels per second
const EDGE = 60; // how close to the sides of the screen the bear can go
const CATCH_RANGE = 40; // how far off-centre a pancake can land and still stay on
const PLATE_DEPTH = 7; // how far below the top of the bear's picture the plate's surface is
const PANCAKE_HEIGHT = 13; // how much taller the stack gets with each pancake
const STACK_LIMIT = 10; // a stack this tall gets served to a customer
const SERVE_BONUS = 10; // bonus points for serving a stack
const WOBBLE = 0.6; // how much the stack sways: bigger means wobblier
const WOBBLE_SPEED = 3; // how fast the stack sways
const MAX_MISSES = 3; // miss this many pancakes and it's game over

// The pancake pictures: every new pancake picks one of these at random.
const PANCAKE_PICTURES = ["pancake_plain", "pancake_berry", "pancake_choc"];

// A pentatonic scale: any of these notes sound nice together, so the
// stack plays a little tune as it climbs.
const NOTES = ["C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"];

// The kitchen gets busier as your score climbs. From `from` points onwards,
// a pancake falls `speed` pixels per second, and a new one comes every `gap`
// seconds. The list goes from calm to frantic.
const RUSHES = [
  { name: "Breakfast", from: 0, speed: 130, gap: 1.8 },
  { name: "Brunch", from: 25, speed: 165, gap: 1.5 },
  { name: "Lunch rush", from: 65, speed: 200, gap: 1.25 },
  { name: "Dinner rush", from: 105, speed: 235, gap: 1.05 },
  { name: "Midnight snack", from: 165, speed: 270, gap: 0.9 },
];

const chef = new Actor("bear_idle", { midBottom: [WIDTH / 2, FLOOR] });

// Four sleepy clouds drift across the sky.
const clouds = [];
for (let i = 0; i < 4; i++) {
  const cloud = new Actor("cloud", {
    center: [randomInt(0, WIDTH), randomInt(80, 200)],
  });
  cloud.scale = randomChoice([0.6, 0.8, 1]);
  cloud.speed = randomInt(8, 24); // pixels per second
  clouds.push(cloud);
}

let targetX = WIDTH / 2; // where the bear is heading
let score = 0; // points so far
let best = storage.get("best", 0); // the highest score, remembered between visits
let newBest = false; // did we beat it?
let falling = []; // the pancakes that are falling right now
let spawnTimer = 0; // counts down to the next pancake
let stack = []; // the pancakes on the plate, from the bottom up
let leaving = []; // served pancakes, flying away to the customer
let time = 0; // seconds since the game started
let misses = 0; // pancakes missed so far
let state = "title"; // "title", "playing" or "lost"
let faceTimer = 0; // counts down while the bear pulls a face
let activeRush = RUSHES[0]; // the rush we're in
let banner = ""; // a message that pops up for a moment
let bannerTimer = 0; // counts down while the banner shows

// ---------- The bear ----------

// Slides the bear towards the target, one frame's worth at a time.
function moveChef(dt) {
  if (keyboard.left || keyboard.a) targetX -= CHEF_SPEED * dt;
  if (keyboard.right || keyboard.d) targetX += CHEF_SPEED * dt;
  targetX = clamp(targetX, EDGE, WIDTH - EDGE);
  // Slide towards the target, but never further than the bear's speed allows.
  const maxStep = CHEF_SPEED * dt;
  chef.x += clamp(targetX - chef.x, -maxStep, maxStep);
}

// Point the bear at the pointer: a mouse, a finger or a pen.
function onMouseMove(pos) {
  targetX = pos[0];
}

function onMouseDown(pos, button) {
  if (button !== mouse.LEFT) return; // the scroll wheel counts as a button too
  targetX = pos[0];
  startIfWaiting();
}

// The clouds drift to the right, and come back round on the left.
function driftClouds(dt) {
  for (const cloud of clouds) {
    cloud.x += cloud.speed * dt;
    if (cloud.left > WIDTH) cloud.right = 0;
  }
}

// ---------- Pancakes ----------

// Makes a pancake above the top of the screen, somewhere across.
function makePancake() {
  const newPancake = new Actor(randomChoice(PANCAKE_PICTURES), {
    center: [randomInt(EDGE, WIDTH - EDGE), -30],
  });
  newPancake.state = "falling"; // then "landed" or "missed"
  newPancake.speed = activeRush.speed; // how fast this one falls
  return newPancake;
}

// The y of the top of the stack, where the next pancake will land.
function stackTop() {
  return chef.top + PLATE_DEPTH - stack.length * PANCAKE_HEIGHT;
}

// How far the pancake at this height in the stack is swaying sideways right
// now. The higher up it is, the further it swings.
function sway(index) {
  return Math.sin(time * WOBBLE_SPEED) * WOBBLE * index * index;
}

// The x where the next pancake would land: the middle of the top of the stack.
function topX() {
  return chef.x + sway(stack.length);
}

// Puts every pancake of the stack in place, on top of the plate.
function placeStack() {
  for (let i = 0; i < stack.length; i++) {
    const pancake = stack[i];
    pancake.x = chef.x + sway(i) + pancake.offset;
    pancake.bottom = chef.top + PLATE_DEPTH - i * PANCAKE_HEIGHT;
  }
}

// A full stack is served to a hungry customer: bonus points and a fresh plate!
function serveStack() {
  score += SERVE_BONUS;
  announce(`Order up! +${SERVE_BONUS}`);
  tone.play("C6", 0.8, { volume: 0.25 });
  // The pancakes float up and fade away, off to the customer.
  for (const pancake of stack) {
    animate(pancake, {
      y: pancake.y - 160,
      opacity: 0,
      duration: 0.9,
      tween: "easeIn",
    });
    leaving.push(pancake);
  }
  clock.schedule(() => {
    leaving = [];
  }, 1);
  stack = [];
}

// A pancake lands on the plate!
function landPancake(pancake) {
  pancake.state = "landed";
  // It lands off-centre, then slides into place as it squashes down.
  pancake.offset = pancake.x - topX();
  pancake.scale = 1.3;
  animate(pancake, { scale: 1, offset: 0, duration: 0.35, tween: "bounceEnd" });
  chef.image = "bear_happy";
  faceTimer = 0.5;
  stack.push(pancake);
  score += 1;
  const note = NOTES[(stack.length - 1) % NOTES.length];
  tone.play(note, 0.25, { waveform: "triangle", volume: 0.3 });
  if (stack.length >= STACK_LIMIT) serveStack();
  updateRush();
}

// A pancake sails past the plate and is lost.
function missPancake(pancake) {
  pancake.state = "missed";
  misses += 1;
  tone.play("C3", 0.25, { waveform: "square", volume: 0.2 });
  chef.image = "bear_ouch";
  faceTimer = 0.6;
  if (misses >= MAX_MISSES) endGame();
}

// Which rush are we in? The last one whose `from` we've reached.
function currentRush() {
  let rush = RUSHES[0];
  for (const candidate of RUSHES) {
    if (score >= candidate.from) rush = candidate;
  }
  return rush;
}

// Pops up a message in the middle of the screen for a moment.
function announce(message) {
  banner = message;
  bannerTimer = 2;
}

// If we have reached a busier rush, say so!
function updateRush() {
  if (currentRush() !== activeRush) {
    activeRush = currentRush();
    announce(`${activeRush.name}!`);
  }
}

// Counts down, and when it reaches zero a new pancake starts falling.
function spawnPancakes(dt) {
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    falling.push(makePancake());
    spawnTimer = activeRush.gap;
  }
}

// Drops every pancake a little, and decides what happens when one reaches the
// top of the stack: it lands if it's over the plate, and is missed if not.
function movePancakes(dt) {
  const stillFalling = [];
  for (const pancake of falling) {
    pancake.y += pancake.speed * dt;
    if (pancake.state === "falling" && pancake.bottom >= stackTop()) {
      if (Math.abs(pancake.x - topX()) < CATCH_RANGE) {
        landPancake(pancake);
      } else {
        missPancake(pancake);
      }
    }
    // Keep it in the list, unless it landed or fell off the bottom.
    if (pancake.state !== "landed" && pancake.y < HEIGHT + 30) {
      stillFalling.push(pancake);
    }
  }
  falling = stillFalling;
}

// ---------- Starting and ending ----------

// Starts a fresh game.
function startGame() {
  score = 0;
  misses = 0;
  stack = [];
  falling = [];
  spawnTimer = 0;
  state = "playing";
  leaving = [];
  newBest = false;
  chef.image = "bear_idle";
  activeRush = RUSHES[0];
  announce(`${activeRush.name}!`);
}

// The third miss ends the game.
function endGame() {
  state = "lost";
  falling = []; // whatever is still in the air is gone
  newBest = score > best;
  if (newBest) {
    best = score;
    storage.set("best", best);
  }
  tone.play("G3", 0.5, { waveform: "sawtooth", volume: 0.2 });
}

// Starts a new game if we're waiting for a player to press something.
function startIfWaiting() {
  if (state === "title" || state === "lost") startGame();
}

function onKeyDown(key) {
  if (key === keys.SPACE || key === keys.RETURN) startIfWaiting();
}

// ---------- The game loop ----------

// Everything that changes, once per frame.
function update(dt) {
  time += dt;
  moveChef(dt);
  driftClouds(dt);
  placeStack();
  if (state !== "playing") return;
  bannerTimer -= dt;
  faceTimer -= dt;
  if (faceTimer <= 0) chef.image = "bear_idle";
  spawnPancakes(dt);
  movePancakes(dt);
}

// ---------- Drawing ----------

function drawScenery() {
  // The sky: blue at the top, fading to cream at the bottom.
  screen.fill("#8fd3ff", "#ffe9c7");

  // The sun.
  screen.circle(590, 96, 62, "#ffeaa0");
  screen.circle(590, 96, 46, "#ffd34d");

  // The clouds, in front of the sun.
  for (const cloud of clouds) cloud.draw();

  // Hills: giant circles whose middles are below the screen.
  screen.circle(130, 520, 190, "#bfe69a");
  screen.circle(560, 540, 210, "#a6d977");

  // The grass in front of everything.
  screen.rect(0, 420, WIDTH, 60, "#8cc65a");
  screen.rect(0, 462, WIDTH, 18, "#78ad42");
}

// Draws text in the game's rounded font, with a dark outline so it's readable.
function write(text, x, y, size, color) {
  screen.draw.text(text, {
    center: [x, y],
    size: size,
    color: color,
    fontname: "fredoka",
    outline: 3,
    outlineColor: "#2a2140",
  });
}

function drawHud() {
  write(`Score: ${score}`, 100, 34, 28, "white");
  write(activeRush.name, WIDTH / 2, 34, 22, "#fff3a8");
  // One heart for each miss we can still afford, in a row along the right.
  for (let i = 0; i < MAX_MISSES; i++) {
    const picture = i < MAX_MISSES - misses ? "heart" : "heart_empty";
    screen.blit(picture, [WIDTH - 20 - (MAX_MISSES - i) * 40, 18]);
  }
}

function drawMessages() {
  const middle = WIDTH / 2;
  if (state === "playing" && bannerTimer > 0) {
    write(banner, middle, 150, 54, "#ffd34d");
  }
  if (state === "title") {
    screen.rect(0, 0, WIDTH, HEIGHT, rgb(42, 33, 64, 90));
    write("Pancake Stack", middle, 92, 66, "#ffd34d");
    write(
      "Catch the pancakes. Miss three and it's over!",
      middle,
      148,
      22,
      "white",
    );
    write(
      "Arrow keys, or point with the mouse or a finger",
      middle,
      178,
      20,
      "#fff3a8",
    );
    if (best > 0) write(`Best: ${best}`, middle, 214, 22, "white");
    write("Click or press Space to start", middle, 306, 26, "#ffd34d");
  }
  if (state === "lost") {
    screen.rect(0, 0, WIDTH, HEIGHT, rgb(42, 33, 64, 120));
    write("Oh crumbs!", middle, 130, 60, "#ffd34d");
    write(`You scored ${score}`, middle, 190, 28, "white");
    if (newBest) write("A new best!", middle, 226, 24, "#ffd34d");
    else write(`Best: ${best}`, middle, 226, 22, "white");
    write("Click or press Space to play again", middle, 270, 22, "#fff3a8");
  }
}

function draw() {
  drawScenery();
  chef.draw();
  for (const pancake of stack) pancake.draw();
  for (const pancake of leaving) pancake.draw();
  for (const pancake of falling) pancake.draw();
  if (state !== "title") drawHud();
  drawMessages();
}
