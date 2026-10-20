WIDTH = 640;
HEIGHT = 400;
TITLE = "Firefly Flash";

const COUNT = 12; // how many fireflies come out
const SKY_BOTTOM = HEIGHT - 70; // fireflies stay above the meadow
const EDGE = 16; // how close to the sides they fly before turning around
const MIN_SPEED = 25; // pixels per second
const MAX_SPEED = 60;

const moon = new Actor("moon", { center: [446, 74] });

let time = 0; // seconds since the game started, for twinkling

let stars = [];
for (let i = 0; i < 70; i++) {
  stars.push({
    x: randomInt(0, WIDTH),
    y: randomInt(0, HEIGHT - 110),
    size: randomChoice([1, 1, 1.5, 2]),
    twinkle: Math.random() * 6,
  });
}

// Each firefly is now an Actor: a picture with a position. Giving it a list
// of images makes it flip between them, like a flip book, so its wings flap.
function makeFirefly() {
  const fly = new Actor("firefly_1", {
    center: [randomInt(EDGE, WIDTH - EDGE), randomInt(60, SKY_BOTTOM)],
    images: ["firefly_1", "firefly_2"],
    fps: 12,
  });
  fly.vx = randomChoice([-1, 1]) * randomInt(MIN_SPEED, MAX_SPEED);
  fly.vy = randomChoice([-1, 1]) * randomInt(MIN_SPEED, MAX_SPEED);
  fly.twinkle = Math.random() * 6; // so the tail glows don't all pulse together
  return fly;
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
  time += dt;
  for (const fly of fireflies) {
    moveFirefly(fly, dt);
  }
}

function drawSky() {
  screen.fill("#0d0a24", "#3a2b6e");
  for (const star of stars) {
    // Math.sin swings smoothly between -1 and 1, so brightness goes up and down.
    const brightness = 150 + 100 * Math.sin(time * 2 + star.twinkle);
    screen.circle(
      star.x,
      star.y,
      star.size,
      rgb(255, 255, 255, Math.round(brightness)),
    );
  }
  screen.circle(436, 78, 72, rgb(255, 244, 207, 14));
  screen.circle(436, 78, 56, rgb(255, 244, 207, 22));
  moon.draw();
  screen.blit("meadow", [0, HEIGHT - 130]);
}

function drawFireflies() {
  for (const fly of fireflies) {
    const pulse = 9 + 3 * Math.sin(time * 5 + fly.twinkle);
    screen.circle(fly.x, fly.y + 9, pulse, rgb(255, 240, 140, 60));
  }
  for (const fly of fireflies) {
    fly.draw();
  }
}

function draw() {
  drawSky();
  drawFireflies();
}
