WIDTH = 720;
HEIGHT = 480;
TITLE = "Planet Putt";

// How the universe behaves. Every one of these is fun to change!
const G = 240; // how strongly planets pull
const DRAG = 0.7; // "space dust": how quickly the ball slows down
const POWER = 4; // launch speed for each pixel you pull back
const MAX_SPEED = 500; // the hardest you can putt
const REST_SPEED = 18; // slower than this...
const REST_TIME = 0.3; // ...for this many seconds, and the ball has stopped
const LOST_MARGIN = 40; // how far off the screen counts as lost in space
const ART_RADIUS = 40; // the planet pictures are drawn with a radius of 40

// The game's colours, and the middle of the screen, for writing words.
const GOLD = "#ffd36e";
const PINK = "#ff6fb5";
const CYAN = "#5ee0ff";
const LILAC = "#b9b0e8";
const MIDDLE = WIDTH / 2;

const ball = new Actor("ball", { center: [0, 0] });
ball.vx = 0;
ball.vy = 0;
ball.stillTime = 0;

// What the game is doing: "aiming" or "flying".
let state = "aiming";
let planets = [];
let strokes = 0;
let shotFrom = [0, 0]; // where the last shot was taken, for lost balls
let dragStart = null; // where the pointer went down while aiming
let dragNow = null;
let message = "";
let messageTime = 0;

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

function placeBall(pos) {
  ball.pos = pos;
  ball.vx = 0;
  ball.vy = 0;
  ball.stillTime = 0;
}

function showMessage(text) {
  message = text;
  messageTime = 2;
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

function lostInSpace(body) {
  return (
    body.x < -LOST_MARGIN ||
    body.x > WIDTH + LOST_MARGIN ||
    body.y < -LOST_MARGIN ||
    body.y > HEIGHT + LOST_MARGIN
  );
}

// The ball has stopped once it has been very slow for a little while.
function isResting(body, dt) {
  const speed = Math.sqrt(body.vx * body.vx + body.vy * body.vy);
  if (speed < REST_SPEED) body.stillTime += dt;
  else body.stillTime = 0;
  return body.stillTime >= REST_TIME;
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

// ---- Game events ----

function shoot(velocity) {
  shotFrom = ball.pos;
  ball.vx = velocity[0];
  ball.vy = velocity[1];
  ball.stillTime = 0;
  strokes += 1;
  state = "flying";
}

function loseBall() {
  strokes += 1; // a penalty stroke for losing the ball
  placeBall(shotFrom);
  state = "aiming";
  showMessage("Lost in space! +1 stroke");
}

function stopBall() {
  ball.vx = 0;
  ball.vy = 0;
  state = "aiming";
}

// ---- Input ----

function onMouseDown(pos, button) {
  if (button !== mouse.LEFT) return; // the scroll wheel counts as a button too
  if (state === "aiming") {
    dragStart = pos;
    dragNow = pos;
  }
}

function onMouseMove(pos) {
  if (dragStart) dragNow = pos;
}

function onMouseUp(pos) {
  if (!dragStart) return;
  dragNow = pos;
  const velocity = launchVelocity();
  dragStart = null;
  // A tiny pull is probably a slip of the finger, so it doesn't count.
  if (Math.abs(velocity[0]) + Math.abs(velocity[1]) > 40) shoot(velocity);
}

// ---- Update ----

function update(dt) {
  messageTime -= dt;

  if (state === "flying") {
    moveBall(ball, dt);
    if (lostInSpace(ball)) loseBall();
    else if (isResting(ball, dt)) stopBall();
  }
}

// ---- Draw ----

function draw() {
  screen.fill("#0d0b24", "#251b52");
  drawSky();
  for (const planet of planets) planet.actor.draw();
  ball.draw();
  drawAim();
  drawHud();
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

// Writes words on the screen. (x, y) is the middle of the top of the text,
// unless you name another anchor, like "topLeft" or "topRight".
function write(words, x, y, size, color, anchor) {
  const options = { size: size, color: color };
  options[anchor || "midTop"] = [x, y];
  screen.draw.text(String(words), options);
}

function drawHud() {
  if (messageTime > 0) write(message, MIDDLE, 14, 24, "white");
}

// Set up a practice hole.
planets.push(makePlanet(360, 120, 40, "pink"));
placeBall([110, 300]);
