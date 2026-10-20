WIDTH = 640;
HEIGHT = 400;
TITLE = "Firefly Flash";

// Where our firefly is. x and y are variables: names for values that can change.
let x = 200;
let y = 180;

// All the scenery, gathered into one function so draw() stays short.
function drawSky() {
  screen.fill("#0d0a24", "#3a2b6e");
  screen.circle(446, 74, 40, "#fff4cf");
  screen.circle(80, 60, 2, "white");
  screen.circle(200, 110, 1.5, "white");
  screen.circle(330, 40, 2, "white");
  screen.circle(590, 170, 1.5, "white");
  screen.circle(120, 470, 160, "#231d57");
  screen.circle(520, 480, 190, "#231d57");
  screen.rect(0, 350, WIDTH, 50, "#1b1846");
}

function draw() {
  drawSky();
  // A firefly. Every part is drawn relative to x and y, so it all moves together.
  screen.circle(x, y + 9, 16, rgb(255, 240, 140, 70)); // a soft glow
  screen.circle(x, y + 9, 8, "#f2eaa0"); // its tail
  screen.circle(x, y, 9, "#ff9f6e"); // its head
}
