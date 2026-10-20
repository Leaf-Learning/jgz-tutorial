WIDTH = 720;
HEIGHT = 480;
TITLE = "Planet Putt";

const ball = new Actor("ball", { center: [110, 300] });
ball.vx = 150; // velocity: pixels per second to the right...
ball.vy = -60; // ...and down. A negative number means up!

// The starry sky is made once, then drawn every frame.
const STAR_COUNT = 90;
const stars = [];
for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: randomInt(0, WIDTH),
    y: randomInt(0, HEIGHT),
    size: randomChoice([1, 1, 1, 1.5, 2, 3]),
  });
}

// Click to put the ball somewhere else. It keeps its velocity.
function onMouseDown(pos) {
  ball.pos = pos;
}

function update(dt) {
  // Velocity changes the position, a little every frame.
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
}

function draw() {
  screen.fill("#0d0b24", "#251b52");
  drawSky();
  ball.draw();
}

function drawSky() {
  for (const star of stars) {
    screen.draw.filledCircle([star.x, star.y], star.size, "#fff8e1");
  }
}
