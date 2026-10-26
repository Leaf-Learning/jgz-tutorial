// Octo Pop, made with js-game-zero.
// Type the words to pop the bubbles before they float away!

WIDTH = 720;
HEIGHT = 480;
TITLE = "Octo Pop";

// Every level is an object. Its words are ONE string with a space between
// the words (the game chops it up later). Don't use a word that is also the
// start of another word in the same level, or the short one always wins.
//   speed: how fast the bubbles float up, in pixels per second
//   every: seconds between new bubbles
//   goal: bubbles to pop to clear the level
const LEVELS = [
  {
    name: "The Shallows",
    words: "cat sun fish crab wave pearl moon bell",
    speed: 24,
    every: 3.6,
    goal: 6,
  },
  {
    name: "Coral Reef",
    words: "coral reef shark whale squid tide foam boat star kelp",
    speed: 30,
    every: 3.3,
    goal: 8,
  },
  {
    name: "Kelp Forest",
    words: "anchor turtle jelly pearl ripple seaweed dolphin lobster",
    speed: 34,
    every: 3,
    goal: 10,
  },
  {
    name: "Deep Blue",
    words: "octopus seahorse starfish plankton lantern",
    speed: 38,
    every: 3,
    goal: 10,
  },
  {
    name: "Treasure Trench",
    words: "treasure pirate captain compass mermaid trident diamond",
    speed: 46,
    every: 2.1,
    goal: 12,
  },
];

// Tuning: change these to change how the game feels.
const SURFACE_Y = 74; // a bubble that floats above this line has escaped
const SPAWN_Y = 380; // new bubbles appear here, right above the sand
const LETTER_WIDTH = 17; // pixels between the letters inside a bubble
const BUBBLE_PADDING = 44; // extra bubble width around the letters
const WOBBLE = 10; // how far bubbles sway from side to side
const POP_TIME = 0.25; // seconds a bubble takes to burst
const MAX_LIVES = 3; // bubbles you can lose before the level is lost

const ALPHABET = "abcdefghijklmnopqrstuvwxyz"; // the keys that count as typing

const INK = "#2a2140"; // dark plum, for words and outlines
const PINK = "#ff4f8b"; // letters you have already typed
const GOLD = "#ffd34d"; // the ring around bubbles that match your typing

const OCTOPUS_Y = 372; // where Octo's middle sits, on the sea floor
const octopus = new Actor("octopus_idle", { center: [WIDTH / 2, OCTOPUS_Y] });

let state = "playing"; // "playing", "won", "lost" or "finished"
let level = 0; // which level we're on, counting from 0
let bubbles = []; // every bubble floating in the sea
let typed = ""; // the letters you have typed so far
let score = 0;
let levelScore = 0; // the score when this level began
let popped = 0; // bubbles popped this level
let lives = MAX_LIVES;
let streak = 0; // words popped in a row without a typo
let spawnTimer = 0; // seconds until the next bubble appears
let introTimer = 0; // counts down while the level's name shows
let moodTimer = 0; // counts down while Octo shows a happy or ouch face
let time = 0; // seconds since the game began, for waves and sways

// ---------- Bubbles ----------

// A random word from this level that isn't already floating by. split chops
// one string into a list of words, cutting at every space.
function pickWord() {
  const words = LEVELS[level].words.split(" ");
  const fresh = [];
  for (const word of words) {
    if (word.length > 0 && !findBubble(word)) fresh.push(word);
  }
  if (fresh.length === 0) return randomChoice(words);
  return randomChoice(fresh);
}

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
  bubble.y -= LEVELS[level].speed * dt;
  bubble.x = bubble.startX + WOBBLE * Math.sin(time * 2 + bubble.phase);
  if (bubble.y < SURFACE_Y && !bubble.popping) escapeBubble(bubble);
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

  if (findBubble(typed + letter)) {
    typed += letter; // this letter carries on the word you were typing
  } else if (findBubble(letter)) {
    typed = letter; // it starts a different word, so switch to that one
  } else {
    mistake(); // no bubble starts with that
    return;
  }

  const bubble = findBubble(typed);
  if (bubble.word === typed) popBubble(bubble);
}

function mistake() {
  typed = "";
  streak = 0;
  setMood("octopus_ouch");
}

function popBubble(bubble) {
  burst(bubble);
  typed = "";
  popped += 1;
  streak += 1;
  score += bubble.word.length + streak; // longer words and streaks score more
  setMood("octopus_happy");
  if (popped >= LEVELS[level].goal) winLevel();
}

// A bubble that reaches the surface costs a life.
function escapeBubble(bubble) {
  burst(bubble);
  if (state !== "playing") return;
  lives -= 1;
  streak = 0;
  setMood("octopus_ouch");
  if (lives === 0) loseLevel();
}

// Gives Octo a happy or ouch face for a moment.
function setMood(image) {
  octopus.image = image;
  moodTimer = 0.6;
}

// ---------- Levels and states ----------

function startLevel() {
  bubbles = [];
  typed = "";
  popped = 0;
  lives = MAX_LIVES;
  streak = 0;
  spawnTimer = 0;
  introTimer = 2.2;
  levelScore = score;
  state = "playing";
}

function winLevel() {
  state = level === LEVELS.length - 1 ? "finished" : "won";
  typed = "";
}

function loseLevel() {
  state = "lost";
  typed = "";
}

// Enter, Space or a click moves on from the won, lost and finished screens.
function nextScreen() {
  if (state === "won") {
    level += 1;
  } else if (state === "lost") {
    score = levelScore; // try the level again with the score you had before
  } else {
    level = 0; // after the end of the game: start over
    score = 0;
  }
  startLevel();
}

function onKeyDown(key, unicode, repeat) {
  if (state === "playing") {
    if (key === keys.BACKSPACE) {
      eraseLetter();
    } else if (unicode.length === 1 && !repeat) {
      typeLetter(unicode.toLowerCase());
    }
  } else if (key === keys.RETURN || key === keys.SPACE) {
    nextScreen();
  }
}

function onMouseDown(pos, button) {
  if (button !== mouse.LEFT) return; // the scroll wheel counts as a button too
  if (state !== "playing") nextScreen();
}

function update(dt) {
  time += dt;
  introTimer -= dt;
  moodTimer -= dt;
  if (moodTimer <= 0) octopus.image = "octopus_idle";

  for (const bubble of bubbles) {
    moveBubble(bubble, dt);
  }
  bubbles = bubbles.filter((bubble) => bubble.opacity > 0);
  // If the bubble you were typing has gone, forget the letters.
  if (typed.length > 0 && !findBubble(typed)) typed = "";

  if (state === "playing") {
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      bubbles.push(makeBubble(pickWord()));
      spawnTimer = LEVELS[level].every;
    }
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
  const goal = LEVELS[level].goal;
  write(`Score ${score}`, 80, 24, 24, INK);
  write(`Level ${level + 1}: ${LEVELS[level].name}`, 330, 20, 20, INK);
  // One dot for each bubble you need to pop. They fill up as you go.
  for (let i = 0; i < goal; i++) {
    const x = 330 + (i - (goal - 1) / 2) * 16;
    screen.circle(x, 44, 6, i < popped ? PINK : "white");
    screen.draw.circle([x, 44], 6, INK, 2);
  }
  for (let i = 0; i < MAX_LIVES; i++) {
    screen.blit(i < lives ? "heart" : "heart_empty", [462 + i * 34, 10]);
  }
}

function drawMessages() {
  if (state === "playing") {
    if (introTimer > 0) {
      write(`Level ${level + 1}`, WIDTH / 2, 150, 54, GOLD);
      write(LEVELS[level].name, WIDTH / 2, 200, 28, "white");
    }
    return;
  }
  screen.rect(0, 0, WIDTH, HEIGHT, rgb(10, 28, 58, 150));
  const middle = WIDTH / 2;
  if (state === "won") {
    write("Level clear!", middle, 160, 56, GOLD);
    write(`Score ${score}`, middle, 215, 28, "white");
    write("Press Enter for the next level", middle, 268, 26, "#7cf0c5");
  } else if (state === "lost") {
    write("Oh no, they escaped!", middle, 160, 50, "#ff9ecf");
    write(`Score ${score}`, middle, 215, 28, "white");
    write("Press Enter to try again", middle, 268, 26, "#7cf0c5");
  } else if (state === "finished") {
    write("You popped the whole sea!", middle, 150, 46, GOLD);
    write(`Final score ${score}`, middle, 205, 30, "white");
    write("Press Enter to play again", middle, 296, 26, "#7cf0c5");
  }
}

function draw() {
  drawSea();
  drawBubbles();
  drawHud();
  drawTray();
  drawMessages();
}
