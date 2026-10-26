// Octo Pop, made with js-game-zero.
// Type the words to pop the bubbles before they float away!

WIDTH = 720;
HEIGHT = 480;
TITLE = "Octo Pop";

const INK = "#2a2140"; // dark plum, for words and outlines

const OCTOPUS_Y = 372; // where Octo's middle sits, on the sea floor
const octopus = new Actor("octopus_idle", { center: [WIDTH / 2, OCTOPUS_Y] });
const bubble = new Actor("bubble", { center: [WIDTH / 2, 230] });

function drawSea() {
  screen.fill("#4fc3e8", "#123a6b");
  screen.blit("surface", [0, 0]);
  screen.blit("seabed", [0, HEIGHT - 130]);
  octopus.draw();
}

function draw() {
  drawSea();
  bubble.draw();
  screen.text("octopus", 322, 218, INK, 24);
}
