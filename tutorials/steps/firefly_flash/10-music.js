WIDTH = 640;
HEIGHT = 400;
TITLE = "Firefly Flash";

const COUNT = 20; // how many fireflies come out
const SKY_BOTTOM = HEIGHT - 70; // fireflies stay above the meadow
const EDGE = 16; // how close to the sides they fly before turning around
const MIN_SPEED = 25; // pixels per second
const MAX_SPEED = 60;
const FIREFLY_SIZE = 12; // a firefly's body is roughly this far across from its middle
const FLASH_SIZE = 44; // how far a flash of light reaches at its biggest
const GROW_TIME = 0.3; // seconds a flash takes to grow...
const GLOW_TIME = 1.4; // ...how long it then glows at full size...
const FADE_TIME = 0.5; // ...and how long it takes to shrink away.
const FLASH_TIME = GROW_TIME + GLOW_TIME + FADE_TIME;

// A pentatonic scale: any of these notes sound nice together, so a chain
// reaction plays a little tune.
const NOTES = ["C5", "D5", "E5", "G5", "A5", "C6", "D6", "E6", "G6", "A6"];

const moon = new Actor("moon", { center: [446, 74] });

let spark = null; // the flash from your click; null means "nothing yet"
let lit = 0; // how many fireflies have lit up
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

// Each firefly is an Actor: a picture with a position. Giving it a list of
// images makes it flip between them, like a flip book, so its wings flap.
function makeFirefly() {
  const fly = new Actor("firefly_1", {
    center: [randomInt(EDGE, WIDTH - EDGE), randomInt(60, SKY_BOTTOM)],
    images: ["firefly_1", "firefly_2"],
    fps: 12,
  });
  fly.vx = randomChoice([-1, 1]) * randomInt(MIN_SPEED, MAX_SPEED);
  fly.vy = randomChoice([-1, 1]) * randomInt(MIN_SPEED, MAX_SPEED);
  fly.state = "drifting"; // then "flashing", then "done"
  fly.age = 0; // seconds since it started flashing
  fly.radius = 0; // how far its flash reaches right now
  fly.twinkle = Math.random() * 6; // so the tail glows don't all pulse together
  return fly;
}

let fireflies = [];
for (let i = 0; i < COUNT; i++) {
  fireflies.push(makeFirefly());
}

// How big a flash is, `age` seconds after it starts: it grows, glows, then
// shrinks away to nothing.
function flashRadius(age) {
  if (age < GROW_TIME) {
    return FLASH_SIZE * (age / GROW_TIME);
  }
  if (age < GROW_TIME + GLOW_TIME) {
    return FLASH_SIZE;
  }
  const fading = (age - GROW_TIME - GLOW_TIME) / FADE_TIME;
  return Math.max(0, FLASH_SIZE * (1 - fading));
}

// The straight-line distance between two points (Pythagoras' theorem).
function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// Is this firefly inside any light: your spark, or another firefly's flash?
function touchesLight(fly) {
  if (
    spark &&
    distance(fly.x, fly.y, spark.x, spark.y) < spark.radius + FIREFLY_SIZE
  ) {
    return true;
  }
  for (const other of fireflies) {
    if (
      other.state === "flashing" &&
      distance(fly.x, fly.y, other.x, other.y) < other.radius + FIREFLY_SIZE
    ) {
      return true;
    }
  }
  return false;
}

function startFlash(fly) {
  fly.state = "flashing";
  fly.age = 0;
  fly.images = ["firefly_lit_1", "firefly_lit_2"];
  lit += 1;
  // Each new flash plays the next note up the scale. % wraps back to the
  // start when we run out of notes, like a clock going past 12.
  const note = NOTES[(lit - 1) % NOTES.length];
  tone.play(note, 0.4, { waveform: "triangle", volume: 0.25 });
}

// A firefly that has finished flashing floats up and fades away, home to bed.
function flyHome(fly) {
  fly.state = "done";
  animate(fly, { y: fly.y - 70, opacity: 0, duration: 1.4, tween: "easeIn" });
}

function moveFirefly(fly, dt) {
  if (fly.state === "drifting") {
    fly.x += fly.vx * dt;
    fly.y += fly.vy * dt;
    // Bounce off the edges of the sky. Math.abs makes a number positive,
    // so these always point the firefly back inside.
    if (fly.x < EDGE) fly.vx = Math.abs(fly.vx);
    if (fly.x > WIDTH - EDGE) fly.vx = -Math.abs(fly.vx);
    if (fly.y < EDGE + 30) fly.vy = Math.abs(fly.vy);
    if (fly.y > SKY_BOTTOM) fly.vy = -Math.abs(fly.vy);
  } else if (fly.state === "flashing") {
    fly.age += dt;
    fly.radius = flashRadius(fly.age);
    if (fly.age > FLASH_TIME) flyHome(fly);
  }
}

function update(dt) {
  time += dt;
  for (const fly of fireflies) {
    moveFirefly(fly, dt);
  }
  if (spark) {
    spark.age += dt;
    spark.radius = flashRadius(spark.age);
    if (spark.age > FLASH_TIME) spark = null;
  }
  for (const fly of fireflies) {
    if (fly.state === "drifting" && touchesLight(fly)) startFlash(fly);
  }
}

// The game calls this whenever you click (or tap). pos is where: [x, y].
function onMouseDown(pos) {
  spark = { x: pos[0], y: pos[1], age: 0, radius: 0 };
  tone.play("C4", 0.3, { volume: 0.3 });
}

// A soft pool of light: three see-through circles, biggest first, and an
// outline ring. Outlines live in screen.draw; screen.circle always fills.
function drawLight(x, y, radius, red, green, blue) {
  if (radius <= 0) return;
  screen.circle(x, y, radius, rgb(red, green, blue, 40));
  screen.circle(x, y, radius * 0.7, rgb(red, green, blue, 55));
  screen.circle(x, y, radius * 0.4, rgb(red, green, blue, 80));
  screen.draw.circle([x, y], radius, rgb(red, green, blue, 150), 2);
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
    if (fly.state === "drifting") {
      const pulse = 9 + 3 * Math.sin(time * 5 + fly.twinkle);
      screen.circle(fly.x, fly.y + 9, pulse, rgb(255, 240, 140, 60));
    } else if (fly.state === "flashing") {
      drawLight(fly.x, fly.y, fly.radius, 255, 226, 110);
    }
  }
  if (spark) drawLight(spark.x, spark.y, spark.radius, 140, 255, 214);
  for (const fly of fireflies) {
    fly.draw();
  }
}

function draw() {
  drawSky();
  drawFireflies();
  screen.text(`Lit: ${lit}`, 16, 14, "white", 26);
}
