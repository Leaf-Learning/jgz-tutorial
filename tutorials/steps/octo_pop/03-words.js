// Octo Pop, made with js-game-zero.
// Type the words to pop the bubbles before they float away!

WIDTH = 720;
HEIGHT = 480;
TITLE = "Octo Pop";

// Tuning: change these to change how the game feels.
const LETTER_WIDTH = 17; // pixels between the letters inside a bubble
const BUBBLE_PADDING = 44; // extra bubble width around the letters

const INK = "#2a2140"; // dark plum, for words and outlines

const OCTOPUS_Y = 372; // where Octo's middle sits, on the sea floor
const octopus = new Actor("octopus_idle", { center: [WIDTH / 2, OCTOPUS_Y] });
const bubble = new Actor("bubble", { center: [WIDTH / 2, 230] });
// A word is a string: some letters inside quote marks.
bubble.word = "octopus";
// A string knows its length. Longer words get bigger bubbles.
bubble.width = bubble.word.length * LETTER_WIDTH + BUBBLE_PADDING;

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

function draw() {
  drawSea();
  bubble.draw();
  drawWord(bubble);
}
