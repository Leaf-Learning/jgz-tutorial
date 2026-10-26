WIDTH = 720;
HEIGHT = 480;
TITLE = "Pancake Stack";

// Tuning: change these numbers to change how the game feels.
const FLOOR = 455; // the y of the ground under the bear's feet
const CHEF_SPEED = 460; // how fast the bear slides, in pixels per second
const EDGE = 60; // how close to the sides of the screen the bear can go

const chef = new Actor("bear_idle", { midBottom: [WIDTH / 2, FLOOR] });

let targetX = WIDTH / 2; // where the bear is heading

// ---------- The bear ----------

// update runs about 60 times a second. dt is how many seconds have
// passed since the last time.
function update(dt) {
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

function draw() {
  drawScenery();
  chef.draw();
}
