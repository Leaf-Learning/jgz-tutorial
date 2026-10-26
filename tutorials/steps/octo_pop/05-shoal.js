// Octo Pop, made with js-game-zero.
// Type the words to pop the bubbles before they float away!

WIDTH = 720;
HEIGHT = 480;
TITLE = "Octo Pop";

// Tuning: change these to change how the game feels.
const SURFACE_Y = 74; // a bubble that floats above this line has escaped
const SPAWN_Y = 380; // new bubbles appear here, right above the sand
const LETTER_WIDTH = 17; // pixels between the letters inside a bubble
const BUBBLE_PADDING = 44; // extra bubble width around the letters
const WOBBLE = 10; // how far bubbles sway from side to side
const BUBBLE_SPEED = 28; // pixels per second
const SPAWN_EVERY = 3.6; // seconds between new bubbles
const WORDS = ["cat", "sun", "fish", "crab", "wave", "pearl", "moon", "bell"];

const INK = "#2a2140"; // dark plum, for words and outlines

const OCTOPUS_Y = 372; // where Octo's middle sits, on the sea floor
const octopus = new Actor("octopus_idle", { center: [WIDTH / 2, OCTOPUS_Y] });

let bubbles = []; // every bubble floating in the sea
let spawnTimer = 0; // seconds until the next bubble appears
let time = 0; // seconds since the game began, for waves and sways

// ---------- Bubbles ----------

// A bubble is an Actor with a word stuck on it. Longer words, bigger bubbles.
function makeBubble(word) {
  const diameter = word.length * LETTER_WIDTH + BUBBLE_PADDING;
  const margin = diameter / 2 + WOBBLE;
  const bubble = new Actor("bubble", {
    center: [randomInt(margin, WIDTH - margin), SPAWN_Y],
    width: diameter,
  });
  bubble.word = word;
  bubble.startX = bubble.x; // the sway happens around this spot
  bubble.phase = Math.random() * 6; // so the bubbles don't all sway together
  return bubble;
}

function moveBubble(bubble, dt) {
  bubble.y -= BUBBLE_SPEED * dt;
  bubble.x = bubble.startX + WOBBLE * Math.sin(time * 2 + bubble.phase);
}

function update(dt) {
  time += dt;

  for (const bubble of bubbles) {
    moveBubble(bubble, dt);
  }
  bubbles = bubbles.filter((bubble) => bubble.y > SURFACE_Y);

  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    bubbles.push(makeBubble(randomChoice(WORDS)));
    spawnTimer = SPAWN_EVERY;
  }
}

// ---------- Drawing ----------

function write(text, x, y, size, color) {
  screen.draw.text(text, {
    center: [x, y],
    size: size,
    color: color,
    fontname: "fredoka",
    shadow: [0, 2],
    shadowColor: rgb(42, 33, 64, 70),
  });
}

function drawSea() {
  screen.fill("#4fc3e8", "#123a6b");
  screen.blit("surface", [0, 0]);
  screen.blit("seabed", [0, HEIGHT - 130]);
  octopus.draw();
}

// Draws a bubble's word one letter at a time.
function drawWord(bubble) {
  const width = bubble.word.length * LETTER_WIDTH; // how wide the whole word is
  const left = bubble.x - width / 2 + LETTER_WIDTH / 2; // the middle of letter 0
  for (let i = 0; i < bubble.word.length; i++) {
    write(bubble.word[i], left + i * LETTER_WIDTH, bubble.y, 26, INK);
  }
}

function drawBubbles() {
  for (const bubble of bubbles) {
    bubble.draw();
    drawWord(bubble);
  }
}

function draw() {
  drawSea();
  drawBubbles();
}
