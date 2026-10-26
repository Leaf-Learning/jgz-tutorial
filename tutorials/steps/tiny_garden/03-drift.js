WIDTH = 640;
HEIGHT = 400;
TITLE = "Tiny Garden";

// Tuning: change these to change how the garden feels.
const CLOUD_SPEED = 14; // pixels per second

let cloudX = 40; // where the cloud is, across

// ---------- The game loop ----------

function update(dt) {
  cloudX += CLOUD_SPEED * dt;
  if (cloudX > WIDTH) cloudX = -100; // off the right edge: back to the left
}

// ---------- Drawing ----------

function drawBackground() {
  screen.fill("#aee6ff", "#e9f9ff");
  // The sun: a soft glow, then the sun itself.
  screen.circle(560, 50, 56, rgb(255, 236, 160, 70));
  screen.circle(560, 50, 38, "#ffd34d");
  screen.blit("cloud", [cloudX, 36]);
  screen.blit("hills", [0, 44]);
  screen.rect(0, 144, WIDTH, 256, "#9bd160");
}

function draw() {
  drawBackground();
}
