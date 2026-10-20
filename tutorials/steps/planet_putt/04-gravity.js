WIDTH = 720;
HEIGHT = 480;
TITLE = "Planet Putt";

// How the universe behaves. Every one of these is fun to change!
const G = 240; // how strongly planets pull
const DRAG = 0.7; // "space dust": how quickly the ball slows down
const ART_RADIUS = 40; // the planet pictures are drawn with a radius of 40

const ball = new Actor("ball", { center: [110, 300] });
ball.vx = 300;
ball.vy = -40;

let planets = [];
planets.push(makePlanet(380, 170, 60, "blue"));

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

// A planet is plain data for the physics, plus an Actor for its picture.
function makePlanet(x, y, radius, kind) {
  const actor = new Actor("planet_" + kind, { center: [x, y] });
  actor.scale = radius / ART_RADIUS;
  return {
    x: x,
    y: y,
    radius: radius,
    mass: radius * radius, // bigger planets pull harder
    actor: actor,
  };
}

// ---- Physics ----

// Moves a ball forward by one small step of time: planets pull it, space
// dust slows it, then it moves.
function moveBall(body, dt) {
  for (const planet of planets) {
    const dx = planet.x - body.x;
    const dy = planet.y - body.y;
    const distance = Math.max(Math.sqrt(dx * dx + dy * dy), planet.radius);
    const pull = (G * planet.mass) / (distance * distance);
    body.vx += (dx / distance) * pull * dt;
    body.vy += (dy / distance) * pull * dt;
  }
  body.vx -= body.vx * DRAG * dt;
  body.vy -= body.vy * DRAG * dt;
  body.x += body.vx * dt;
  body.y += body.vy * dt;
}

// Click to send the ball off again from wherever you click.
function onMouseDown(pos) {
  ball.pos = pos;
  ball.vx = 300;
  ball.vy = -40;
}

function update(dt) {
  moveBall(ball, dt);
}

function draw() {
  screen.fill("#0d0b24", "#251b52");
  drawSky();
  for (const planet of planets) planet.actor.draw();
  ball.draw();
}

function drawSky() {
  for (const star of stars) {
    screen.draw.filledCircle([star.x, star.y], star.size, "#fff8e1");
  }
}
