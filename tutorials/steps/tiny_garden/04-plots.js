WIDTH = 640;
HEIGHT = 400;
TITLE = "Tiny Garden";

// Tuning: change these to change how the garden feels.
const CLOUD_SPEED = 14; // pixels per second
const COLUMNS = 4; // how many plots across...
const ROWS = 2; // ...and how many down
const GARDEN_LEFT = 20; // where the top-left plot sits
const GARDEN_TOP = 128;
const PLOT_STEP_X = 108; // distance from one plot to the next, across...
const PLOT_STEP_Y = 90; // ...and down

let cloudX = 40; // where the cloud is, across
let plots = [];

// Makes the grid of plots, row by row. Each plot is an Actor: a picture
// (the soil) that knows where it is.
function makePlots() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const plot = new Actor("soil_dry", {
        topLeft: [
          GARDEN_LEFT + col * PLOT_STEP_X,
          GARDEN_TOP + row * PLOT_STEP_Y,
        ],
      });
      plots.push(plot);
    }
  }
}

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

function drawPlot(plot) {
  plot.draw();
  if (plot.touches(mouse.pos)) screen.blit("soil_glow", [plot.left, plot.top]);
}

function draw() {
  drawBackground();
  for (const plot of plots) {
    drawPlot(plot);
  }
}

makePlots();
