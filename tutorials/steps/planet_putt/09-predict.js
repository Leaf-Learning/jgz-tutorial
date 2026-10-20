WIDTH = 720;
HEIGHT = 480;
TITLE = "Planet Putt";

// How the universe behaves. Every one of these is fun to change!
const STEP = 1 / 120; // the ball moves in tiny, equal steps of time
const G = 240; // how strongly planets pull
const DRAG = 0.7; // "space dust": how quickly the ball slows down
const POWER = 4; // launch speed for each pixel you pull back
const MAX_SPEED = 500; // the hardest you can putt
const BALL_RADIUS = 15;
const BOUNCE = 0.5; // how much speed survives a bounce off a planet
const GRIP = 0.85; // how much sliding speed survives touching a planet
const BONK_SPEED = 60; // hit a planet faster than this and it wobbles
const REST_SPEED = 18; // slower than this...
const REST_TIME = 0.3; // ...for this many seconds, and the ball has stopped
const HOLE_RADIUS = 18; // how close to the wormhole's middle counts as "in"
const LOST_MARGIN = 40; // how far off the screen counts as lost in space
const PREDICT_TIME = 1.5; // seconds of flight the dotted line shows
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
const wormhole = new Actor("wormhole", { center: [0, 0] });
const flag = new Actor("flag", { anchor: [6, "bottom"], pos: [0, 0] });

// What the game is doing: "aiming", "flying", "sinking" or "holeDone".
let state = "aiming";
let planets = [];
let hole = { x: 0, y: 0 };
let strokes = 0;
let shotFrom = [0, 0]; // where the last shot was taken, for lost balls
let dragStart = null; // where the pointer went down while aiming
let dragNow = null;
let predicted = []; // dots showing where the ball will go
let leftover = 0; // time waiting to be turned into physics steps
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

function startHole() {
  strokes = 0;
  placeBall([110, 300]);
  state = "aiming";
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
  ball.scale = 1;
  ball.angle = 0;
  ball.image = "ball";
}

function showMessage(text) {
  message = text;
  messageTime = 2;
}

// ---- Physics ----

// Moves a ball forward by one small step of time: planets pull it, space
// dust slows it, then it moves. Works on the real ball AND on the pretend
// ball the prediction line uses. Returns a planet it bonked into, if any.
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
  return bounceOffPlanets(body);
}

function bounceOffPlanets(body) {
  let bonked = null;
  for (const planet of planets) {
    const dx = body.x - planet.x;
    const dy = body.y - planet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const touching = planet.radius + BALL_RADIUS;
    if (distance >= touching || distance === 0) continue;
    // The "normal": an arrow 1 pixel long pointing straight out of the planet.
    const nx = dx / distance;
    const ny = dy / distance;
    // Put the ball back on the surface so it never sinks into the planet.
    body.x = planet.x + nx * touching;
    body.y = planet.y + ny * touching;
    // How fast the ball is moving out of the planet (negative = going in).
    const outward = body.vx * nx + body.vy * ny;
    if (outward < 0) {
      // Split the velocity into "sliding along the surface" and "going in".
      // Sliding keeps most of its speed; going in turns around, but softer.
      const slideX = body.vx - outward * nx;
      const slideY = body.vy - outward * ny;
      body.vx = slideX * GRIP - outward * BOUNCE * nx;
      body.vy = slideY * GRIP - outward * BOUNCE * ny;
      if (-outward > BONK_SPEED) bonked = planet;
    }
  }
  return bonked;
}

function inWormhole(body) {
  const dx = body.x - hole.x;
  const dy = body.y - hole.y;
  return Math.sqrt(dx * dx + dy * dy) < HOLE_RADIUS;
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

// Sees the future: flies a pretend ball with the very same moveBall the
// real ball uses, and drops a dot every few steps.
function predictPath(velocity) {
  const ghost = { x: ball.x, y: ball.y, vx: velocity[0], vy: velocity[1] };
  const dots = [];
  const steps = Math.round(PREDICT_TIME / STEP);
  for (let i = 1; i <= steps; i++) {
    moveBall(ghost, STEP);
    if (i % 6 === 0) dots.push([ghost.x, ghost.y]);
    if (inWormhole(ghost) || lostInSpace(ghost)) break;
  }
  return dots;
}

// ---- Game events ----

function shoot(velocity) {
  shotFrom = ball.pos;
  ball.vx = velocity[0];
  ball.vy = velocity[1];
  ball.stillTime = 0;
  strokes += 1;
  leftover = 0;
  state = "flying";
}

function bonk(planet) {
  // A squish, then a springy wobble back to normal size.
  const size = planet.radius / ART_RADIUS;
  planet.actor.scale = size * 0.88;
  animate(planet.actor, { scale: size, duration: 0.7, tween: "spring" });
  ball.image = "ball_ouch";
  clock.scheduleUnique(resetFace, 0.4);
}

function resetFace() {
  if (state === "flying" || state === "aiming") ball.image = "ball";
}

function sinkBall() {
  state = "sinking";
  ball.image = "ball_happy";
  animate(ball, {
    x: hole.x,
    y: hole.y,
    scale: 0.1,
    angle: ball.angle + 720,
    duration: 0.9,
    tween: "easeIn",
    onFinished: finishHole,
  });
}

function finishHole() {
  state = "holeDone";
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
  if (state === "holeDone") {
    startHole();
  } else if (state === "aiming") {
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
  predicted = [];
  // A tiny pull is probably a slip of the finger, so it doesn't count.
  if (Math.abs(velocity[0]) + Math.abs(velocity[1]) > 40) shoot(velocity);
}

// ---- Update ----

function update(dt) {
  wormhole.angle -= 120 * dt;
  messageTime -= dt;

  if (state === "aiming" && dragStart) {
    predicted = predictPath(launchVelocity());
  }

  if (state === "flying") {
    // Turn the frame's time into equal physics steps, so the real ball
    // follows exactly the path the prediction promised.
    leftover += dt;
    while (leftover >= STEP && state === "flying") {
      leftover -= STEP;
      const bonked = moveBall(ball, STEP);
      if (bonked) bonk(bonked);
      if (inWormhole(ball)) sinkBall();
      else if (lostInSpace(ball)) loseBall();
      else if (isResting(ball, STEP)) stopBall();
    }
  }
}

// ---- Draw ----

function draw() {
  screen.fill("#0d0b24", "#251b52");
  drawSky();
  for (const planet of planets) planet.actor.draw();
  flag.draw();
  wormhole.draw();
  drawPrediction();
  ball.draw();
  drawAim();
  drawHud();
  if (state === "holeDone") drawHoleDone();
}

function drawSky() {
  for (const star of stars) {
    screen.draw.filledCircle([star.x, star.y], star.size, "#fff8e1");
  }
}

function drawPrediction() {
  for (let i = 0; i < predicted.length; i++) {
    const fade = 1 - i / predicted.length;
    const dot = predicted[i];
    screen.draw.filledCircle(
      dot,
      1.5 + fade * 2.5,
      rgb(255, 255, 255, Math.round(70 + fade * 170)),
    );
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
  write("Strokes: " + strokes, WIDTH - 16, 12, 22, GOLD, "topRight");
  if (messageTime > 0) write(message, MIDDLE, 14, 24, "white");
}

function drawHoleDone() {
  screen.draw.filledRect([0, 0, WIDTH, HEIGHT], rgb(13, 11, 36, 150));
  write("In the hole!", MIDDLE, 160, 46, GOLD);
  const word = strokes === 1 ? " stroke" : " strokes";
  write(strokes + word, MIDDLE, 226, 24, "white");
  write("Click to play again", MIDDLE, 274, 20, CYAN);
}

// Set up a practice hole.
planets.push(makePlanet(360, 120, 40, "pink"));
hole = { x: 600, y: 260 };
wormhole.pos = [600, 260];
flag.pos = [600, 260];
startHole();
