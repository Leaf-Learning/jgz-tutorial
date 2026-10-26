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
const POP_TIME = 0.25; // seconds a bubble takes to burst
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
let score = 0;
let spawnTimer = 0; // seconds until the next bubble appears
let moodTimer = 0; // counts down while Octo shows a happy or ouch face
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
  bubble.popping = false;
  return bubble;
}

function moveBubble(bubble, dt) {
  bubble.y -= BUBBLE_SPEED * dt;
  bubble.x = bubble.startX + WOBBLE * Math.sin(time * 2 + bubble.phase);
  if (bubble.y < SURFACE_Y && !bubble.popping) burst(bubble);
}

// Makes a bubble swell up and fade away. Once it is invisible, update()
// drops it from the list.
function burst(bubble) {
  bubble.popping = true;
  animate(bubble, {
    scale: bubble.scale * 1.4,
    opacity: 0,
    duration: POP_TIME,
    tween: "easeOut",
  });
}

// The first bubble whose word starts with these letters, or null if none do.
function findBubble(letters) {
  for (const bubble of bubbles) {
    if (!bubble.popping && bubble.word.startsWith(letters)) {
      return bubble;
    }
  }
  return null;
}

// Does what you have typed match the start of this bubble's word?
function isLit(bubble) {
  return typed.length > 0 && !bubble.popping && bubble.word.startsWith(typed);
}

// ---------- Typing ----------

// Backspace: slice(0, -1) keeps everything except the last letter.
function eraseLetter() {
  typed = typed.slice(0, -1);
}

function typeLetter(letter) {
  if (!ALPHABET.includes(letter)) return;

  typed += letter;

  const bubble = findBubble(typed);
  if (bubble && bubble.word === typed) popBubble(bubble);
}

function popBubble(bubble) {
  burst(bubble);
  typed = "";
  score += bubble.word.length; // longer words score more
  setMood("octopus_happy");
}

// Gives Octo a happy or ouch face for a moment.
function setMood(image) {
  octopus.image = image;
  moodTimer = 0.6;
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
  moodTimer -= dt;
  if (moodTimer <= 0) octopus.image = "octopus_idle";

  for (const bubble of bubbles) {
    moveBubble(bubble, dt);
  }
  bubbles = bubbles.filter((bubble) => bubble.opacity > 0);

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
    if (!bubble.popping) drawWord(bubble);
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

function drawHud() {
  write(`Score ${score}`, 80, 24, 24, INK);
}

function draw() {
  drawSea();
  drawBubbles();
  drawHud();
  drawTray();
}
