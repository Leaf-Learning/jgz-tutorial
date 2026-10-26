WIDTH = 720;
HEIGHT = 480;
TITLE = "Pancake Stack";

// Tuning: change these numbers to change how the game feels.
const FLOOR = 455; // the y of the ground under the bear's feet

const chef = new Actor("bear_idle", { midBottom: [WIDTH / 2, FLOOR] });

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
