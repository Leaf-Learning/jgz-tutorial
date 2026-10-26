WIDTH = 720;
HEIGHT = 480;
TITLE = "Pancake Stack";

// Tuning: change these numbers to change how the game feels.
const FLOOR = 455; // the y of the ground under the bear's feet
const CHEF_SPEED = 460; // how fast the bear slides, in pixels per second
const EDGE = 60; // how close to the sides of the screen the bear can go
const PANCAKE_SPEED = 140; // how fast pancakes fall, in pixels per second
const SPAWN_GAP = 1.4; // seconds between one pancake and the next
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

const chef = new Actor("bear_idle", { midBottom: [WIDTH / 2, FLOOR] });

let targetX = WIDTH / 2; // where the bear is heading
let score = 0; // points so far
let falling = []; // the pancakes that are falling right now
let spawnTimer = 0; // counts down to the next pancake
let stack = []; // the pancakes on the plate, from the bottom up
let time = 0; // seconds since the game started
let misses = 0; // pancakes missed so far
let state = "playing"; // "playing" or "lost"

// ---------- The bear ----------

// Slides the bear towards the target, one frame's worth at a time.
function moveChef(dt) {
  if (keyboard.left) targetX -= CHEF_SPEED * dt;
  if (keyboard.right) targetX += CHEF_SPEED * dt;
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

// ---------- Pancakes ----------

// Makes a pancake above the top of the screen, somewhere across.
function makePancake() {
  const newPancake = new Actor(randomChoice(PANCAKE_PICTURES), {
    center: [randomInt(EDGE, WIDTH - EDGE), -30],
  });
  newPancake.state = "falling"; // then "landed" or "missed"
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
    pancake.x = chef.x + sway(i);
    pancake.bottom = chef.top + PLATE_DEPTH - i * PANCAKE_HEIGHT;
  }
}

// A full stack is served to a hungry customer: bonus points and a fresh plate!
function serveStack() {
  score += SERVE_BONUS;
  stack = [];
}

// A pancake lands on the plate!
function landPancake(pancake) {
  pancake.state = "landed";
  stack.push(pancake);
  score += 1;
  const note = NOTES[(stack.length - 1) % NOTES.length];
  tone.play(note, 0.25, { waveform: "triangle", volume: 0.3 });
  if (stack.length >= STACK_LIMIT) serveStack();
}

// A pancake sails past the plate and is lost.
function missPancake(pancake) {
  pancake.state = "missed";
  misses += 1;
  tone.play("C3", 0.25, { waveform: "square", volume: 0.2 });
  if (misses >= MAX_MISSES) endGame();
}

// Counts down, and when it reaches zero a new pancake starts falling.
function spawnPancakes(dt) {
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    falling.push(makePancake());
    spawnTimer = SPAWN_GAP;
  }
}

// Drops every pancake a little, and decides what happens when one reaches the
// top of the stack: it lands if it's over the plate, and is missed if not.
function movePancakes(dt) {
  const stillFalling = [];
  for (const pancake of falling) {
    pancake.y += PANCAKE_SPEED * dt;
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
}

// The third miss ends the game.
function endGame() {
  state = "lost";
  falling = []; // whatever is still in the air is gone
  tone.play("G3", 0.5, { waveform: "sawtooth", volume: 0.2 });
}

// Starts a new game if we're waiting for a player to press something.
function startIfWaiting() {
  if (state === "lost") startGame();
}

function onKeyDown(key) {
  if (key === keys.SPACE || key === keys.RETURN) startIfWaiting();
}

// ---------- The game loop ----------

// Everything that changes, once per frame.
function update(dt) {
  time += dt;
  moveChef(dt);
  placeStack();
  if (state !== "playing") return;
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
  // One heart for each miss we can still afford, in a row along the right.
  for (let i = 0; i < MAX_MISSES; i++) {
    const picture = i < MAX_MISSES - misses ? "heart" : "heart_empty";
    screen.blit(picture, [WIDTH - 20 - (MAX_MISSES - i) * 40, 18]);
  }
}

function drawMessages() {
  const middle = WIDTH / 2;
  if (state === "lost") {
    screen.rect(0, 0, WIDTH, HEIGHT, rgb(42, 33, 64, 120));
    write("Oh crumbs!", middle, 130, 60, "#ffd34d");
    write(`You scored ${score}`, middle, 190, 28, "white");
    write("Click or press Space to play again", middle, 270, 22, "#fff3a8");
  }
}

function draw() {
  drawScenery();
  chef.draw();
  for (const pancake of stack) pancake.draw();
  for (const pancake of falling) pancake.draw();
  drawHud();
  drawMessages();
}
