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
const WATER_TIME = 5; // seconds of growing that one watering gives a plant
const CLOUD_SPEED = 14; // pixels per second
const COLUMNS = 4; // how many plots across...
const ROWS = 2; // ...and how many down
const GARDEN_LEFT = 20; // where the top-left plot sits
const GARDEN_TOP = 128;
const PLOT_STEP_X = 108; // distance from one plot to the next, across...
const PLOT_STEP_Y = 90; // ...and down

// A plant's pictures as it grows, from newly planted to nearly in bloom.
const STAGES = ["seed", "sprout", "bud"];

let time = 0; // seconds since the game started, for wobbling and glowing
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
      plot.state = "empty"; // "empty", "growing" or "ready"
      plot.seed = 0; // which flower is planted here, as a position in SEEDS
      plot.growth = 0; // seconds of watered growing so far
      plot.wet = 0; // seconds of water left
      plots.push(plot);
    }
  }
}

// ---------- What a click can do ----------

// Plants the chosen seed in an empty plot.
function plantSeed(plot) {
  plot.state = "growing";
  plot.seed = selected;
  plot.growth = 0;
  plot.wet = 0;
}

// Pours on water: the plant can grow for WATER_TIME more seconds.
function waterPlot(plot) {
  plot.wet = WATER_TIME;
}

// A click on a plot does a different job depending on what the plot is up to.
function tendPlot(plot) {
  if (plot.state === "empty") {
    plantSeed(plot);
  } else if (plot.state === "growing") {
    waterPlot(plot);
  }
}

// ---------- The game loop ----------

// A plant only grows while it has water, and it blooms when it has grown
// for as long as its seed needs.
function growPlot(plot, dt) {
  if (plot.state !== "growing") return;
  if (plot.wet <= 0) return; // thirsty: waiting for water
  plot.wet -= dt;
  plot.growth += dt;
  if (plot.growth >= SEEDS[plot.seed].grow) {
    plot.state = "ready";
  }
}

function update(dt) {
  time += dt;
  cloudX += CLOUD_SPEED * dt;
  if (cloudX > WIDTH) cloudX = -100; // off the right edge: back to the left

  for (const plot of plots) {
    growPlot(plot, dt);
  }
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

// Which picture a plant shows: a stage while it grows, then the flower.
function plantImage(plot) {
  const seed = SEEDS[plot.seed];
  if (plot.state === "ready") return seed.image;
  const progress = plot.growth / seed.grow; // 0 when planted, 1 when ready
  return STAGES[Math.floor(progress * STAGES.length)];
}

function drawPlot(plot) {
  // Watered soil goes darker.
  plot.image = plot.wet > 0 ? "soil_wet" : "soil_dry";
  plot.draw();
  if (plot.touches(mouse.pos)) screen.blit("soil_glow", [plot.left, plot.top]);
  if (plot.state === "empty") return;

  screen.blit(plantImage(plot), [plot.left + 8, plot.top - 16]);
  if (plot.state === "growing" && plot.wet <= 0) {
    // A thirsty raindrop bobs above the plant.
    const wobble = 3 * Math.sin(time * 6 + plot.left);
    screen.blit("drop", [plot.left + 66, plot.top + 2 + wobble]);
  }
}

function draw() {
  drawBackground();
  for (const plot of plots) {
    drawPlot(plot);
  }
}

makePlots();
