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

// The pancake pictures: every new pancake picks one of these at random.
const PANCAKE_PICTURES = ["pancake_plain", "pancake_berry", "pancake_choc"];

const chef = new Actor("bear_idle", { midBottom: [WIDTH / 2, FLOOR] });

let targetX = WIDTH / 2; // where the bear is heading
let score = 0; // points so far
let falling = []; // the pancakes that are falling right now
let spawnTimer = 0; // counts down to the next pancake

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
  return chef.top + PLATE_DEPTH;
}

// A pancake lands on the plate!
function landPancake(pancake) {
  pancake.state = "landed";
  score += 1;
}

// A pancake sails past the plate and is lost.
function missPancake(pancake) {
  pancake.state = "missed";
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
      if (Math.abs(pancake.x - chef.x) < CATCH_RANGE) {
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

// ---------- The game loop ----------

// Everything that changes, once per frame.
function update(dt) {
  moveChef(dt);
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
}

function draw() {
  drawScenery();
  chef.draw();
  for (const pancake of falling) pancake.draw();
  drawHud();
}
