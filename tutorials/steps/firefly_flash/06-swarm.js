WIDTH = 640;
HEIGHT = 400;
TITLE = "Firefly Flash";

const COUNT = 12; // how many fireflies come out
const SKY_BOTTOM = HEIGHT - 70; // fireflies stay above the meadow
const EDGE = 16; // how close to the sides they fly before turning around
const MIN_SPEED = 25; // pixels per second
const MAX_SPEED = 60;

// A list of stars. Each star is an object: a bundle of named values.
let stars = [];
for (let i = 0; i < 70; i++) {
  stars.push({
    x: randomInt(0, WIDTH),
    y: randomInt(0, HEIGHT - 110),
    size: randomChoice([1, 1, 1.5, 2]),
  });
}

// Makes one new firefly somewhere random, flying in a random direction.
function makeFirefly() {
  return {
    x: randomInt(EDGE, WIDTH - EDGE),
    y: randomInt(60, SKY_BOTTOM),
    vx: randomChoice([-1, 1]) * randomInt(MIN_SPEED, MAX_SPEED),
    vy: randomChoice([-1, 1]) * randomInt(MIN_SPEED, MAX_SPEED),
  };
}

let fireflies = [];
for (let i = 0; i < COUNT; i++) {
  fireflies.push(makeFirefly());
}

function moveFirefly(fly, dt) {
  fly.x += fly.vx * dt;
  fly.y += fly.vy * dt;
  // Bounce off the edges of the sky. Math.abs makes a number positive,
  // so these always point the firefly back inside.
  if (fly.x < EDGE) fly.vx = Math.abs(fly.vx);
  if (fly.x > WIDTH - EDGE) fly.vx = -Math.abs(fly.vx);
  if (fly.y < EDGE + 30) fly.vy = Math.abs(fly.vy);
  if (fly.y > SKY_BOTTOM) fly.vy = -Math.abs(fly.vy);
}

function update(dt) {
  for (const fly of fireflies) {
    moveFirefly(fly, dt);
  }
}

function drawSky() {
  screen.fill("#0d0a24", "#3a2b6e");
  for (const star of stars) {
    screen.circle(star.x, star.y, star.size, "white");
  }
  screen.circle(446, 74, 40, "#fff4cf");
  screen.circle(120, 470, 160, "#231d57");
  screen.circle(520, 480, 190, "#231d57");
  screen.rect(0, 350, WIDTH, 50, "#1b1846");
}

function drawFirefly(fly) {
  screen.circle(fly.x, fly.y + 9, 16, rgb(255, 240, 140, 70)); // a soft glow
  screen.circle(fly.x, fly.y + 9, 8, "#f2eaa0"); // its tail
  screen.circle(fly.x, fly.y, 9, "#ff9f6e"); // its head
}

function draw() {
  drawSky();
  for (const fly of fireflies) {
    drawFirefly(fly);
  }
}
