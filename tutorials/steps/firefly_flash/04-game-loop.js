WIDTH = 640;
HEIGHT = 400;
TITLE = "Firefly Flash";

// Where our firefly is.
let x = 200;
let y = 180;
// How fast it flies, in pixels per second. A negative vy flies upward.
let vx = 50;
let vy = -30;

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

// update runs about 60 times a second, just before draw. dt is how many
// seconds have passed since last time (about 0.017).
function update(dt) {
  x += vx * dt;
  y += vy * dt;
}

function draw() {
  drawSky();
  // A firefly. Every part is drawn relative to x and y, so it all moves together.
  screen.circle(x, y + 9, 16, rgb(255, 240, 140, 70)); // a soft glow
  screen.circle(x, y + 9, 8, "#f2eaa0"); // its tail
  screen.circle(x, y, 9, "#ff9f6e"); // its head
}
