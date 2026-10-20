WIDTH = 640;
HEIGHT = 400;
TITLE = "Firefly Flash";

// Each night, some fireflies come out and you must light up enough of them
// with ONE click. Later nights have more fireflies but need a bigger chain.
const NIGHTS = [
  { fireflies: 10, goal: 3 },
  { fireflies: 14, goal: 4 },
  { fireflies: 18, goal: 7 },
  { fireflies: 22, goal: 10 },
  { fireflies: 26, goal: 12 },
  { fireflies: 30, goal: 18 },
  { fireflies: 35, goal: 23 },
  { fireflies: 40, goal: 30 },
];

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
const jar = new Actor("jar", { center: [WIDTH - 34, 36] });

let state = "title"; // "title", "aiming", "chain", "won", "lost" or "finished"
let night = 0; // which night we're on, counting from 0
let fireflies = [];
let spark = null; // the flash from your click, once you've clicked
let lit = 0; // fireflies lit up so far tonight
let time = 0; // seconds since the game started, for twinkling
let introTimer = 0; // counts down while "Night 3" shows at the start of a night
let bestNight = storage.get("bestNight") ?? 0;

let stars = [];
for (let i = 0; i < 70; i++) {
  stars.push({
    x: randomInt(0, WIDTH),
    y: randomInt(0, HEIGHT - 110),
    size: randomChoice([1, 1, 1.5, 2]),
    twinkle: Math.random() * 6,
  });
}

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

function fillSky(count) {
  fireflies = [];
  for (let i = 0; i < count; i++) {
    fireflies.push(makeFirefly());
  }
}

function startNight() {
  fillSky(NIGHTS[night].fireflies);
  spark = null;
  lit = 0;
  introTimer = 2.5;
  state = "aiming";
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

function anyFlashing() {
  for (const fly of fireflies) {
    if (fly.state === "flashing") return true;
  }
  return false;
}

// Plays notes one after another. clock.schedule runs a function later:
// note 0 straight away, note 1 after 0.15 seconds, and so on.
function playTune(notes) {
  for (let i = 0; i < notes.length; i++) {
    clock.schedule(() => tone.play(notes[i], 0.3, { volume: 0.25 }), i * 0.15);
  }
}

function endNight() {
  if (lit >= NIGHTS[night].goal) {
    if (night === NIGHTS.length - 1) {
      state = "finished"; // that was the last night!
    } else {
      state = "won";
    }
    if (night + 1 > bestNight) {
      bestNight = night + 1;
      storage.set("bestNight", bestNight);
    }
    playTune(["C5", "E5", "G5", "C6"]);
  } else {
    state = "lost";
    playTune(["E4", "C4"]);
  }
}

function update(dt) {
  time += dt;
  introTimer -= dt;
  for (const fly of fireflies) {
    moveFirefly(fly, dt);
  }
  if (state !== "chain") return;

  if (spark) {
    spark.age += dt;
    spark.radius = flashRadius(spark.age);
    if (spark.age > FLASH_TIME) spark = null;
  }
  for (const fly of fireflies) {
    if (fly.state === "drifting" && touchesLight(fly)) startFlash(fly);
  }
  // The night ends once every light has gone out.
  if (!spark && !anyFlashing()) endNight();
}

function onMouseDown(pos, button) {
  if (button !== mouse.LEFT) return; // the scroll wheel counts as a button too
  if (state === "title" || state === "finished") {
    night = 0;
    startNight();
  } else if (state === "aiming") {
    spark = { x: pos[0], y: pos[1], age: 0, radius: 0 };
    state = "chain";
    tone.play("C4", 0.3, { volume: 0.3 });
  } else if (state === "won") {
    night += 1;
    startNight();
  } else if (state === "lost") {
    startNight();
  }
}

// ---------- Drawing ----------

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

function write(text, x, y, size, color) {
  screen.draw.text(text, {
    center: [x, y],
    size: size,
    color: color,
    fontname: "fredoka",
    shadow: [0, 2],
    shadowColor: "#120d2e",
  });
}

function drawHud() {
  const goal = NIGHTS[night].goal;
  write(`Night ${night + 1}`, 62, 30, 26, "white");
  // The jar fills with light as you get closer to tonight's goal.
  const fullness = Math.min(1, lit / goal);
  screen.circle(jar.x, jar.y + 6, 4 + 14 * fullness, rgb(255, 230, 110, 170));
  jar.draw();
  write(
    `${lit} / ${goal}`,
    WIDTH - 98,
    38,
    26,
    lit >= goal ? "#ffd34d" : "white",
  );
}

function drawMessages() {
  const middle = WIDTH / 2;
  if (state === "title") {
    write("Firefly Flash", middle, 140, 60, "#ffd34d");
    write(
      "One click. One flash. Start a chain reaction!",
      middle,
      196,
      20,
      "white",
    );
    write("Click to start", middle, 250, 26, "#7cf0c5");
    if (bestNight > 0)
      write(
        `Best: ${bestNight} of ${NIGHTS.length} nights`,
        middle,
        290,
        18,
        "#b9b2e3",
      );
  } else if (state === "aiming") {
    // A ring that shows how far your flash will reach.
    screen.draw.circle(mouse.pos, FLASH_SIZE, rgb(140, 255, 214, 110), 2);
    if (introTimer > 0) {
      write(`Night ${night + 1}`, middle, 150, 52, "#ffd34d");
      write(
        `Light up ${NIGHTS[night].goal} of ${NIGHTS[night].fireflies} fireflies`,
        middle,
        200,
        24,
        "white",
      );
    } else {
      write(
        "Click to send out a flash of light!",
        middle,
        HEIGHT - 24,
        18,
        "#b9b2e3",
      );
    }
  } else if (state === "won") {
    write("Beautiful!", middle, 150, 54, "#ffd34d");
    write(`You lit up ${lit} fireflies`, middle, 202, 24, "white");
    write("Click for the next night", middle, 248, 22, "#7cf0c5");
  } else if (state === "lost") {
    write("So close!", middle, 150, 54, "#ff9ecf");
    write(
      `${lit} lit — you needed ${NIGHTS[night].goal}`,
      middle,
      202,
      24,
      "white",
    );
    write("Click to try again", middle, 248, 22, "#7cf0c5");
  } else if (state === "finished") {
    write("Every night is glowing!", middle, 150, 46, "#ffd34d");
    write(`You lit up all ${NIGHTS.length} nights`, middle, 202, 24, "white");
    write("Click to play again", middle, 248, 22, "#7cf0c5");
  }
}

function draw() {
  drawSky();
  drawFireflies();
  if (state !== "title") drawHud();
  drawMessages();
}

// Some fireflies to watch on the title screen.
fillSky(12);
