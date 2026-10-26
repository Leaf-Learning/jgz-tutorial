WIDTH = 640;
HEIGHT = 400;
TITLE = "Tiny Garden";

// Every flower you can grow is one line of data:
//   name   what it's called
//   image  its picture once it has bloomed
//   cost   coins to unlock its seeds (0 means you start with them)
//   grow   seconds of watered growing before it blooms
//   price  coins you get for selling one flower
const SEEDS = [{ name: "Daisy", image: "daisy", cost: 0, grow: 4, price: 3 }];

// Tuning: change these to change how the garden feels.
const CLOUD_SPEED = 14; // pixels per second
const COLUMNS = 4; // how many plots across...
const ROWS = 2; // ...and how many down
const GARDEN_LEFT = 20; // where the top-left plot sits
const GARDEN_TOP = 128;
const PLOT_STEP_X = 108; // distance from one plot to the next, across...
const PLOT_STEP_Y = 90; // ...and down

let cloudX = 40; // where the cloud is, across
let selected = 0; // the seed packet you'll plant, as a position in SEEDS
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
      plot.state = "empty"; // "empty" or "growing"
      plot.seed = 0; // which flower is planted here, as a position in SEEDS
      plots.push(plot);
    }
  }
}

// ---------- What a click can do ----------

// Plants the chosen seed in an empty plot.
function plantSeed(plot) {
  plot.state = "growing";
  plot.seed = selected;
}

// A click on a plot does a different job depending on what the plot is up to.
function tendPlot(plot) {
  if (plot.state === "empty") {
    plantSeed(plot);
  }
}

// ---------- The game loop ----------

function update(dt) {
  cloudX += CLOUD_SPEED * dt;
  if (cloudX > WIDTH) cloudX = -100; // off the right edge: back to the left
}

function onMouseDown(pos, button) {
  if (button !== mouse.LEFT) return; // the scroll wheel counts as a button too
  for (const plot of plots) {
    if (plot.touches(pos)) tendPlot(plot);
  }
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
  if (plot.state === "empty") return;

  screen.blit("seed", [plot.left + 8, plot.top - 16]);
}

function draw() {
  drawBackground();
  for (const plot of plots) {
    drawPlot(plot);
  }
}

makePlots();
