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

const ALPHABET = "abcdefghijklmnopqrstuvwxyz"; // the keys that count as typing

const INK = "#2a2140"; // dark plum, for words and outlines
const PINK = "#ff4f8b"; // letters you have already typed
const GOLD = "#ffd34d"; // the ring around bubbles that match your typing

const OCTOPUS_Y = 372; // where Octo's middle sits, on the sea floor
const octopus = new Actor("octopus_idle", { center: [WIDTH / 2, OCTOPUS_Y] });

let bubbles = []; // every bubble floating in the sea
let typed = ""; // the letters you have typed so far
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

// Does what you have typed match the start of this bubble's word?
function isLit(bubble) {
  return typed.length > 0 && bubble.word.startsWith(typed);
}

// ---------- Typing ----------

// Backspace: slice(0, -1) keeps everything except the last letter.
function eraseLetter() {
  typed = typed.slice(0, -1);
}

function typeLetter(letter) {
  if (!ALPHABET.includes(letter)) return;

  typed += letter;
}

function onKeyDown(key, unicode, repeat) {
  if (key === keys.BACKSPACE) {
    eraseLetter();
  } else if (unicode.length === 1 && !repeat) {
    typeLetter(unicode.toLowerCase());
  }
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

// Draws a bubble's word one letter at a time. The letters you have already
// typed turn pink.
function drawWord(bubble) {
  const lit = isLit(bubble);
  const width = bubble.word.length * LETTER_WIDTH; // how wide the whole word is
  const left = bubble.x - width / 2 + LETTER_WIDTH / 2; // the middle of letter 0
  for (let i = 0; i < bubble.word.length; i++) {
    const done = lit && i < typed.length;
    const color = done ? PINK : INK;
    write(bubble.word[i], left + i * LETTER_WIDTH, bubble.y, 26, color);
  }
}

function drawBubbles() {
  for (const bubble of bubbles) {
    if (isLit(bubble)) {
      // A golden ring shows which bubbles match what you have typed.
      const ring = bubble.width / 2 + 5;
      screen.draw.circle([bubble.x, bubble.y], ring, GOLD, 4);
    }
    bubble.draw();
    drawWord(bubble);
  }
}

// The tray under Octo shows the letters you have typed.
function drawTray() {
  screen.blit("tray", [WIDTH / 2 - 150, HEIGHT - 66]);
  const middle = HEIGHT - 40;
  if (typed === "") {
    write("type the words!", WIDTH / 2, middle, 20, "#9a8fbd");
  } else {
    write(typed, WIDTH / 2, middle, 30, INK);
  }
}

function draw() {
  drawSea();
  drawBubbles();
  drawTray();
}
