WIDTH = 640;
HEIGHT = 400;
TITLE = "Tiny Garden";

// Every flower you can grow is one line of data:
//   name   what it's called
//   image  its picture once it has bloomed
//   cost   coins to unlock its seeds (0 means you start with them)
//   grow   seconds of watered growing before it blooms
//   price  coins you get for selling one flower
const SEEDS = [
  { name: "Daisy", image: "daisy", cost: 0, grow: 4, price: 3 },
  { name: "Tulip", image: "tulip", cost: 25, grow: 7, price: 7 },
  { name: "Sunflower", image: "sunflower", cost: 100, grow: 11, price: 15 },
  { name: "Rose", image: "rose", cost: 300, grow: 16, price: 32 },
  { name: "Moonbloom", image: "moonbloom", cost: 800, grow: 22, price: 70 },
];

// Tuning: change these to change how the garden feels.
const WATER_TIME = 5; // seconds of growing that one watering gives a plant
const CLOUD_SPEED = 14; // pixels per second
const COLUMNS = 4; // how many plots across...
const ROWS = 2; // ...and how many down
const GARDEN_LEFT = 20; // where the top-left plot sits
const GARDEN_TOP = 128;
const PLOT_STEP_X = 108; // distance from one plot to the next, across...
const PLOT_STEP_Y = 90; // ...and down
const SHELF_TOP = 312; // the seed shelf fills the bottom of the window
const SLOT_LEFT = 19; // where the first seed packet sits
const SLOT_TOP = 320;
const SLOT_STEP = 122; // distance from one packet to the next

// A plant's pictures as it grows, from newly planted to nearly in bloom.
const STAGES = ["seed", "sprout", "bud"];

let time = 0; // seconds since the game started, for wobbling and glowing
let cloudX = 40; // where the cloud is, across
let coins = 0;
let basket = []; // the flowers you've picked, as positions in SEEDS
let selected = 0; // the seed packet you'll plant, as a position in SEEDS
let owned = []; // which seeds you've unlocked: true or false for each flower
let message = ""; // a few words at the top of the window...
let messageTime = 0; // ...and how many seconds are left to show them
let plots = [];
let slots = [];

const stall = new Actor("stall", { midBottom: [548, 302] });

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

// Makes one seed packet for every flower in SEEDS.
function makeSlots() {
  for (let i = 0; i < SEEDS.length; i++) {
    const slot = new Actor("packet", {
      topLeft: [SLOT_LEFT + i * SLOT_STEP, SLOT_TOP],
    });
    // A small copy of the flower's picture to sit on the packet, in its
    // middle (slot.x) and near its top.
    slot.icon = new Actor(SEEDS[i].image, {
      center: [slot.x, SLOT_TOP + 20],
      scale: 0.45,
    });
    slots.push(slot);
  }
}

// Seeds that cost nothing start unlocked. The rest have to be bought.
function makeOwned() {
  for (const seed of SEEDS) {
    owned.push(seed.cost === 0);
  }
}

// Shows a few words at the top of the window for a moment.
function say(words) {
  message = words;
  messageTime = 2.5;
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

// Picks a bloomed flower and puts it in the basket.
function pickFlower(plot) {
  basket.push(plot.seed);
  plot.state = "empty";
  plot.wet = 0;
}

// A click on a plot does a different job depending on what the plot is up to.
function tendPlot(plot) {
  if (plot.state === "empty") {
    plantSeed(plot);
  } else if (plot.state === "growing") {
    waterPlot(plot);
  } else if (plot.state === "ready") {
    pickFlower(plot);
  }
}

// Sells every flower in the basket, adding up what each one is worth.
function sellBasket() {
  if (basket.length === 0) {
    say("Pick some flowers to sell first!");
    return;
  }
  let total = 0;
  for (const kind of basket) {
    total += SEEDS[kind].price;
  }
  coins += total;
  basket = [];
  say(`Sold for ${total} coins!`);
}

// Chooses a seed packet to plant. If you haven't unlocked it yet, this
// buys it, as long as you have enough coins.
function chooseSeed(index) {
  const seed = SEEDS[index];
  if (owned[index]) {
    selected = index;
  } else if (coins >= seed.cost) {
    coins -= seed.cost;
    owned[index] = true;
    selected = index;
    say(`${seed.name} seeds unlocked!`);
    if (!owned.includes(false)) {
      say("Every flower unlocked. Garden complete!");
    }
  } else {
    say(`${seed.name} seeds cost ${seed.cost} coins.`);
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
  messageTime -= dt;

  for (const plot of plots) {
    growPlot(plot, dt);
  }
}

function onMouseDown(pos, button) {
  if (button !== mouse.LEFT) return; // the scroll wheel counts as a button too
  for (const plot of plots) {
    if (plot.touches(pos)) tendPlot(plot);
  }
  if (stall.touches(pos)) sellBasket();
  for (let i = 0; i < slots.length; i++) {
    if (slots[i].touches(pos)) chooseSeed(i);
  }
}

// ---------- Drawing ----------

function write(text, x, y, size, color) {
  screen.draw.text(text, {
    center: [x, y],
    size: size,
    color: color || "#2a2140",
    fontname: "fredoka",
    shadow: [0, 2],
    shadowColor: "white",
  });
}

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

  if (plot.state === "ready") {
    // A soft glow says "pick me!"
    const pulse = 30 + 3 * Math.sin(time * 5 + plot.left);
    screen.circle(plot.x, plot.top + 34, pulse, rgb(255, 240, 160, 90));
  }
  screen.blit(plantImage(plot), [plot.left + 8, plot.top - 16]);
  if (plot.state === "growing" && plot.wet <= 0) {
    // A thirsty raindrop bobs above the plant.
    const wobble = 3 * Math.sin(time * 6 + plot.left);
    screen.blit("drop", [plot.left + 66, plot.top + 2 + wobble]);
  }
}

function drawStall() {
  stall.draw();
  if (basket.length > 0) {
    write("Sell here!", stall.x, stall.top - 8 + 3 * Math.sin(time * 6), 18);
  }
}

function drawShelf() {
  screen.rect(0, SHELF_TOP, WIDTH, HEIGHT - SHELF_TOP, "#f1d9a8");
  screen.rect(0, SHELF_TOP, WIDTH, 5, "#d9b374");
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const seed = SEEDS[i];
    slot.image = i === selected ? "packet_on" : "packet";
    // Seeds you haven't unlocked yet look faded.
    slot.icon.opacity = owned[i] ? 1 : 0.4;
    slot.draw();
    slot.icon.draw();
    write(seed.name, slot.x, slot.bottom - 27, 15);
    if (owned[i]) {
      write(`sells for ${seed.price}`, slot.x, slot.bottom - 11, 13);
    } else {
      screen.blit("coin", [slot.x - 32, slot.bottom - 24]);
      write(`${seed.cost}`, slot.x + 10, slot.bottom - 11, 15, "#c4572e");
    }
  }
}

function drawHud() {
  screen.blit("basket", [14, 6]);
  write(`x ${basket.length}`, 74, 24, 22);
  screen.blit("coin", [132, 10]);
  write(`${coins}`, 184, 24, 24);
  if (messageTime > 0) write(message, 400, 24, 20);
}

function draw() {
  drawBackground();
  for (const plot of plots) {
    drawPlot(plot);
  }
  drawStall();
  drawShelf();
  drawHud();
}

makePlots();
makeSlots();
makeOwned();
