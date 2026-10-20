WIDTH = 720;
HEIGHT = 480;
TITLE = "Planet Putt";

// How the universe behaves. Every one of these is fun to change!
const G = 240; // how strongly planets pull
const DRAG = 0.7; // "space dust": how quickly the ball slows down
const POWER = 4; // launch speed for each pixel you pull back
const MAX_SPEED = 500; // the hardest you can putt
const ART_RADIUS = 40; // the planet pictures are drawn with a radius of 40

// The game's colours.
const GOLD = "#ffd36e";
const PINK = "#ff6fb5";

const ball = new Actor("ball", { center: [110, 300] });
ball.vx = 0;
ball.vy = 0;

let planets = [];
let dragStart = null; // where the pointer went down while aiming
let dragNow = null;

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

// The launch velocity is the pull-back arrow, flipped and scaled up.
function launchVelocity() {
  let vx = (dragStart[0] - dragNow[0]) * POWER;
  let vy = (dragStart[1] - dragNow[1]) * POWER;
  const speed = Math.sqrt(vx * vx + vy * vy);
  if (speed > MAX_SPEED) {
    vx = (vx / speed) * MAX_SPEED;
    vy = (vy / speed) * MAX_SPEED;
  }
  return [vx, vy];
}

// ---- Input ----

function onMouseDown(pos, button) {
  if (button !== mouse.LEFT) return; // the scroll wheel counts as a button too
  dragStart = pos;
  dragNow = pos;
}

function onMouseMove(pos) {
  if (dragStart) dragNow = pos;
}

function onMouseUp(pos) {
  if (!dragStart) return;
  dragNow = pos;
  const velocity = launchVelocity();
  dragStart = null;
  ball.vx = velocity[0];
  ball.vy = velocity[1];
}

// ---- Update ----

function update(dt) {
  moveBall(ball, dt);
}

// ---- Draw ----

function draw() {
  screen.fill("#0d0b24", "#251b52");
  drawSky();
  for (const planet of planets) planet.actor.draw();
  ball.draw();
  drawAim();
}

function drawSky() {
  for (const star of stars) {
    screen.draw.filledCircle([star.x, star.y], star.size, "#fff8e1");
  }
}

function drawAim() {
  if (!dragStart) return;
  const velocity = launchVelocity();
  const tip = [ball.x + velocity[0] * 0.2, ball.y + velocity[1] * 0.2];
  const speed = Math.hypot(velocity[0], velocity[1]);
  const color = speed > MAX_SPEED * 0.9 ? PINK : GOLD;
  // The rubber band from where you pressed to where you are now.
  screen.draw.line(dragStart, dragNow, rgb(255, 255, 255, 60), 2);
  screen.draw.line(ball.pos, tip, color, 4);
  // An arrowhead: two short lines angled back from the tip.
  const back = Math.atan2(velocity[1], velocity[0]) + Math.PI;
  for (const turn of [-0.5, 0.5]) {
    const end = [
      tip[0] + Math.cos(back + turn) * 14,
      tip[1] + Math.sin(back + turn) * 14,
    ];
    screen.draw.line(tip, end, color, 4);
  }
}

// Set up a practice hole.
planets.push(makePlanet(360, 120, 40, "pink"));
