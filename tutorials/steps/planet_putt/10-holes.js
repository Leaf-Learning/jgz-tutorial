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

// Each hole is plain data: where you tee off, where the wormhole is, and
// the planets in the way. Add your own!
const HOLES = [
  {
    name: "First Putt",
    par: 2,
    tee: [110, 300],
    hole: [600, 260],
    planets: [{ x: 360, y: 120, radius: 40, kind: "pink" }],
  },
  {
    name: "Around the Bend",
    par: 3,
    tee: [100, 240],
    hole: [620, 240],
    planets: [{ x: 360, y: 250, radius: 70, kind: "blue" }],
  },
  {
    name: "Twin Moons",
    par: 2,
    tee: [90, 400],
    hole: [630, 90],
    planets: [
      { x: 300, y: 170, radius: 46, kind: "green" },
      { x: 430, y: 330, radius: 46, kind: "pink" },
    ],
  },
  {
    name: "Ring Road",
    par: 2,
    tee: [90, 90],
    hole: [470, 410],
    planets: [{ x: 420, y: 230, radius: 80, kind: "ringed" }],
  },
  {
    name: "The Long Way",
    par: 2,
    tee: [110, 400],
    hole: [140, 90],
    planets: [
      { x: 240, y: 240, radius: 60, kind: "purple" },
      { x: 520, y: 200, radius: 50, kind: "blue" },
    ],
  },
  {
    name: "Grand Tour",
    par: 3,
    tee: [80, 240],
    hole: [650, 400],
    planets: [
      { x: 250, y: 130, radius: 48, kind: "ringed" },
      { x: 330, y: 360, radius: 52, kind: "green" },
      { x: 530, y: 250, radius: 58, kind: "purple" },
    ],
  },
];

const SCORE_NAMES = {
  "-3": "Albatross!",
  "-2": "Eagle!",
  "-1": "Birdie!",
  0: "Par",
  1: "Bogey",
  2: "Double bogey",
};

const ball = new Actor("ball", { center: [0, 0] });
ball.vx = 0;
ball.vy = 0;
ball.stillTime = 0;
const wormhole = new Actor("wormhole", { center: [0, 0] });
const flag = new Actor("flag", { anchor: [6, "bottom"], pos: [0, 0] });

// What the game is doing: "aiming", "flying", "sinking", "holeDone"
// or "scorecard".
let state = "aiming";
let holeIndex = 0;
let planets = [];
let hole = { x: 0, y: 0 };
let strokes = 0;
let scores = []; // strokes taken on each finished hole
let shotFrom = [0, 0]; // where the last shot was taken, for lost balls
let dragStart = null; // where the pointer went down while aiming
let dragNow = null;
let predicted = []; // dots showing where the ball will go
let leftover = 0; // time waiting to be turned into physics steps
let message = "";
let messageTime = 0;
let bestTotal = storage.get("bestTotal", null);
let newBest = false;

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

function startHole(index) {
  holeIndex = index;
  const data = HOLES[index];
  planets = [];
  for (const p of data.planets) {
    planets.push(makePlanet(p.x, p.y, p.radius, p.kind));
  }
  hole = { x: data.hole[0], y: data.hole[1] };
  wormhole.pos = data.hole;
  flag.pos = data.hole;
  strokes = 0;
  placeBall(data.tee);
  state = "aiming";
  showMessage("Hole " + (index + 1) + ": " + data.name);
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

function startGame() {
  scores = [];
  newBest = false;
  startHole(0);
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
  scores.push(strokes);
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

function nextHole() {
  if (holeIndex + 1 < HOLES.length) {
    startHole(holeIndex + 1);
  } else {
    showScorecard();
  }
}

function showScorecard() {
  state = "scorecard";
  const total = totalStrokes();
  if (bestTotal === null || total < bestTotal) {
    bestTotal = total;
    newBest = true;
    storage.set("bestTotal", total);
  }
}

function totalStrokes() {
  let total = 0;
  for (const score of scores) total += score;
  return total;
}

function totalPar() {
  let total = 0;
  for (const data of HOLES) total += data.par;
  return total;
}

// ---- Input ----

function onMouseDown(pos, button) {
  if (button !== mouse.LEFT) return; // the scroll wheel counts as a button too
  if (state === "scorecard") {
    startGame();
  } else if (state === "holeDone") {
    nextHole();
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

function onKeyDown(key) {
  if (key === keys.R && (state === "aiming" || state === "flying")) {
    dragStart = null;
    startHole(holeIndex);
  }
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
  if (state === "scorecard") drawScorecard();
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
  const data = HOLES[holeIndex];
  const holeText = "Hole " + (holeIndex + 1) + " of " + HOLES.length;
  write(holeText, 16, 12, 22, "white", "topLeft");
  write("Par " + data.par, 16, 38, 18, LILAC, "topLeft");
  write("Strokes: " + strokes, WIDTH - 16, 12, 22, GOLD, "topRight");
  if (messageTime > 0) write(message, MIDDLE, 14, 24, "white");
  if (state === "aiming" && !dragStart && strokes === 0 && holeIndex === 0) {
    const tip = "Press anywhere, pull back, and let go!";
    write(tip, MIDDLE, HEIGHT - 40, 20, "#c9bfff");
  }
}

function drawPanel(height) {
  const top = HEIGHT / 2 - height / 2;
  screen.draw.filledRect([0, 0, WIDTH, HEIGHT], rgb(13, 11, 36, 150));
  screen.draw.filledRect([MIDDLE - 230, top, 460, height], "#1d1840");
  return top;
}

function drawHoleDone() {
  const data = HOLES[holeIndex];
  const top = drawPanel(190);
  let name = SCORE_NAMES[strokes - data.par] || "+" + (strokes - data.par);
  if (strokes === 1) name = "Hole in one!";
  write(name, MIDDLE, top + 26, 46, GOLD);
  const word = strokes === 1 ? " stroke" : " strokes";
  const summary = strokes + word + " on a par " + data.par;
  write(summary, MIDDLE, top + 90, 24, "white");
  const last = holeIndex === HOLES.length - 1;
  const next = last ? "Click for your scorecard" : "Click for the next hole";
  write(next, MIDDLE, top + 138, 20, CYAN);
}

function drawScorecard() {
  const top = drawPanel(300);
  const left = MIDDLE - 190;
  write("Scorecard", MIDDLE, top + 20, 40, GOLD);
  write("Hole", left, top + 84, 18, LILAC, "topLeft");
  write("Par", left, top + 112, 18, LILAC, "topLeft");
  write("You", left, top + 140, 18, LILAC, "topLeft");
  for (let i = 0; i < HOLES.length; i++) {
    const x = left + 90 + i * 46;
    const good = scores[i] <= HOLES[i].par;
    write(i + 1, x, top + 84, 18, LILAC);
    write(HOLES[i].par, x, top + 112, 18, "white");
    write(scores[i], x, top + 140, 18, good ? "#7cf0c5" : "#ff9ecf");
  }
  const total = "Total: " + totalStrokes() + "  (par " + totalPar() + ")";
  write(total, MIDDLE, top + 186, 26, "white");
  const best = newBest ? "A new best score!" : "Best: " + bestTotal;
  write(best, MIDDLE, top + 222, 20, GOLD);
  write("Click to play again", MIDDLE, top + 256, 18, CYAN);
}

startGame();
