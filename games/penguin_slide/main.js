WIDTH = 720;
HEIGHT = 480;
TITLE = "Penguin Slide";

// Tuning: change these to change how the game feels.
const TILE = 48; // every tile is a 48 × 48 square
const HUD_HEIGHT = 48; // the strip across the top for level, fish and moves
const SLIDE_TIME = 0.07; // seconds to slide across one tile
const SWIPE_DISTANCE = 24; // how far a drag must go to count as a swipe
const SNOWFLAKES = 45; // how many flakes drift down the screen
const FONT = "fredoka";

// Each level is a little map drawn with letters, one string per row:
//   #  rock (stops you)     .  slippery ice     *  snow (you stop ON it)
//   O  water hole (splash!) F  fish             P  where the penguin starts
// `par` is the fewest moves that eats every fish. A solver checked them all.
const LEVELS = [
  {
    name: "First Slide",
    par: 1,
    map: [
      "############",
      "#..........#",
      "#P........F#",
      "#..........#",
      "############",
    ],
  },
  {
    name: "Rock Stop",
    par: 2,
    map: [
      "##########",
      "#P.....#.#",
      "#........#",
      "#........#",
      "#.....F..#",
      "#........#",
      "##########",
    ],
  },
  {
    name: "Snow Day",
    par: 2,
    map: [
      "###########",
      "#....P....#",
      "#.........#",
      "#.........#",
      "#....*..F.#",
      "#.........#",
      "###########",
    ],
  },
  {
    name: "Mind the Hole",
    par: 3,
    map: [
      "###########",
      "#P....O..F#",
      "#.........#",
      "#.........#",
      "#.........#",
      "###########",
    ],
  },
  {
    name: "Fish Trio",
    par: 5,
    map: [
      "###########",
      "#..#.....P#",
      "#....F.#..#",
      "#.........#",
      "#.........#",
      "#F.F..#.###",
      "###########",
    ],
  },
  {
    name: "Snowy Maze",
    par: 7,
    map: [
      "############",
      "#..#.#.#F.##",
      "#.*........#",
      "##.......*.#",
      "#.#........#",
      "#......F..##",
      "#....P.*...#",
      "############",
    ],
  },
  {
    name: "Hole-y Moley",
    par: 8,
    map: [
      "############",
      "#...*..F...#",
      "#.O#F....O.#",
      "#.......O.##",
      "#.....#...##",
      "#.....O#...#",
      "#..P..*F.#.#",
      "############",
    ],
  },
  {
    name: "Grand Glacier",
    par: 11,
    map: [
      "##############",
      "###...F......#",
      "#.......F..*.#",
      "#.....O......#",
      "#O.#.*.#.O.P##",
      "#.#F.....F...#",
      "#............#",
      "#.###..*.O.#.#",
      "##############",
    ],
  },
];

// Game state
let state = "title"; // "title", "playing", "splash", "won" or "finished"
let levelIndex = 0;
let grid = []; // the current level's tiles: one array of letters per row
let fishes = []; // one Actor per fish, each with row, col and eaten added
let moves = 0;
let sliding = false;
let history = []; // snapshots taken before each move, for undo
let effects = []; // expanding rings: splashes, snow puffs, gulps
let snowflakes = [];
let time = 0; // seconds since the game started, for wiggles
let swipeStart = null;

// Progress survives closing the page: the furthest level reached, and the
// fewest moves used on each level (keyed by level number). clamp() keeps the
// saved level a real one, even if LEVELS has since got shorter.
let unlocked = clamp(storage.get("unlocked", 0), 0, LEVELS.length - 1);
let best = storage.get("best", {});
let chosen = unlocked; // the level picked on the title screen

const penguin = new Actor("penguin_down");
penguin.row = 0;
penguin.col = 0;

const igloo = new Actor("igloo", { midBottom: [600, 430] });

for (let i = 0; i < SNOWFLAKES; i++) {
  snowflakes.push({
    x: randomInt(0, WIDTH),
    y: randomInt(0, HEIGHT),
    size: randomInt(1, 3),
    speed: randomInt(18, 45),
  });
}

// The board is centred in the space below the HUD, so smaller levels sit in
// the middle. These turn a row or column into screen pixels (tile centres).
function boardLeft() {
  return (WIDTH - grid[0].length * TILE) / 2;
}

function boardTop() {
  return HUD_HEIGHT + (HEIGHT - HUD_HEIGHT - grid.length * TILE) / 2;
}

function tileX(col) {
  return boardLeft() + col * TILE + TILE / 2;
}

function tileY(row) {
  return boardTop() + row * TILE + TILE / 2;
}

function tileAt(row, col) {
  return grid[row][col];
}

function loadLevel(index) {
  levelIndex = index;
  grid = [];
  fishes = [];
  const map = LEVELS[index].map;
  for (let row = 0; row < map.length; row++) {
    const letters = map[row].split("");
    for (let col = 0; col < letters.length; col++) {
      if (letters[col] === "P") {
        penguin.row = row;
        penguin.col = col;
        letters[col] = "."; // the penguin stands on plain ice
      } else if (letters[col] === "F") {
        const fish = new Actor("fish");
        fish.row = row;
        fish.col = col;
        fish.eaten = false;
        fishes.push(fish);
        letters[col] = ".";
      }
    }
    grid.push(letters);
  }
  // Pixel positions need the finished grid, because the board is centred.
  for (const fish of fishes) {
    fish.pos = [tileX(fish.col), tileY(fish.row)];
  }
  penguin.image = "penguin_down";
  penguin.pos = [tileX(penguin.col), tileY(penguin.row)];
  penguin.scale = 1;
  penguin.angle = 0;
  penguin.opacity = 1;
  moves = 0;
  history = [];
  effects = [];
  sliding = false;
  state = "playing";
}

function restartLevel() {
  loadLevel(levelIndex);
}

function fishLeft() {
  let count = 0;
  for (const fish of fishes) {
    if (!fish.eaten) count += 1;
  }
  return count;
}

function facing(dx, dy) {
  if (dx < 0) return "penguin_left";
  if (dx > 0) return "penguin_right";
  if (dy < 0) return "penguin_up";
  return "penguin_down";
}

function slide(dx, dy) {
  if (state !== "playing" || sliding) return;
  penguin.image = facing(dx, dy);

  // Follow the ice until the next tile is a rock, or we land on snow or in
  // a hole. This loop only does the thinking; animate() does the moving.
  let row = penguin.row;
  let col = penguin.col;
  while (tileAt(row + dy, col + dx) !== "#") {
    row += dy;
    col += dx;
    if (tileAt(row, col) === "*" || tileAt(row, col) === "O") break;
  }

  const distance = Math.abs(row - penguin.row) + Math.abs(col - penguin.col);
  if (distance === 0) {
    bonk(); // already squashed against a rock: no move
    return;
  }
  history.push(snapshot());
  moves += 1;
  penguin.row = row;
  penguin.col = col;
  sliding = true;
  tone.play("A5", 0.05, { waveform: "sine", volume: 0.08 });
  animate(penguin, {
    x: tileX(col),
    y: tileY(row),
    duration: distance * SLIDE_TIME,
    tween: "linear",
    onFinished: stopSliding,
  });
}

function stopSliding() {
  sliding = false;
  eatFishUnderPenguin(); // the last tile might hold a fish too
  const tile = tileAt(penguin.row, penguin.col);
  if (tile === "O") {
    fallIn();
    return;
  }
  if (tile === "*") {
    addRing(penguin.x, penguin.y + 12, [255, 255, 255]);
    tone.play("G3", 0.1, { waveform: "triangle", volume: 0.2 });
  } else {
    bonk();
  }
  if (fishLeft() === 0) winLevel();
}

// A squash-and-spring wobble, so stopping at a rock feels like a bump.
function bonk() {
  penguin.scale = 0.82;
  animate(penguin, { scale: 1, duration: 0.35, tween: "spring" });
  tone.play("C3", 0.08, { waveform: "square", volume: 0.12 });
}

function eatFishUnderPenguin() {
  for (const fish of fishes) {
    if (!fish.eaten && penguin.touches(fish.pos)) {
      fish.eaten = true;
      addRing(fish.x, fish.y, [255, 170, 100]);
      playNotes(["E5", "A5"], 0.06, "square");
    }
  }
}

function fallIn() {
  state = "splash";
  addRing(penguin.x, penguin.y, [90, 170, 240]);
  addRing(penguin.x, penguin.y, [180, 225, 255]);
  playNotes(["E4", "C4", "A3", "F3"], 0.08, "sine");
  animate(penguin, {
    scale: 0.1,
    opacity: 0,
    angle: 360,
    duration: 0.6,
    tween: "easeIn",
  });
  clock.schedule(restartLevel, 1.2);
}

function winLevel() {
  state = "won";
  penguin.image = "penguin_happy";
  playNotes(["C5", "E5", "G5", "C6"], 0.1, "triangle");
  const previous = best[levelIndex];
  if (previous === undefined || moves < previous) {
    best[levelIndex] = moves;
    storage.set("best", best);
  }
  if (levelIndex + 1 > unlocked && levelIndex + 1 < LEVELS.length) {
    unlocked = levelIndex + 1;
    storage.set("unlocked", unlocked);
  }
}

function nextLevel() {
  if (levelIndex + 1 < LEVELS.length) {
    loadLevel(levelIndex + 1);
    chosen = levelIndex;
  } else {
    state = "finished";
    playNotes(["C5", "E5", "G5", "C6", "G5", "C6", "E6"], 0.12, "triangle");
  }
}

function starsFor(movesUsed, par) {
  if (movesUsed <= par) return 3;
  if (movesUsed <= Math.ceil(par * 1.5)) return 2;
  return 1;
}

function totalStars() {
  let total = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (best[i] !== undefined) total += starsFor(best[i], LEVELS[i].par);
  }
  return total;
}

// Undo works by remembering everything a move can change, before it happens.
function snapshot() {
  const eaten = [];
  for (const fish of fishes) eaten.push(fish.eaten);
  return { row: penguin.row, col: penguin.col, eaten: eaten, moves: moves };
}

function undo() {
  if (state !== "playing" || sliding || history.length === 0) return;
  const last = history.pop();
  penguin.row = last.row;
  penguin.col = last.col;
  penguin.pos = [tileX(last.col), tileY(last.row)];
  for (let i = 0; i < fishes.length; i++) {
    fishes[i].eaten = last.eaten[i];
  }
  moves = last.moves;
  tone.play("E4", 0.08, { waveform: "triangle", volume: 0.15 });
}

function playNotes(notes, gap, waveform) {
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    clock.schedule(
      () => tone.play(note, 0.14, { waveform: waveform, volume: 0.18 }),
      i * gap,
    );
  }
}

function addRing(x, y, color) {
  effects.push({ x: x, y: y, color: color, age: 0 });
}

// ---- Input ----

function onKeyDown(key) {
  const go = key === keys.SPACE || key === keys.RETURN;
  if (state === "title") {
    if (key === keys.LEFT || key === keys.A) chosen = Math.max(0, chosen - 1);
    if (key === keys.RIGHT || key === keys.D) {
      chosen = Math.min(unlocked, chosen + 1);
    }
    if (go) loadLevel(chosen);
  } else if (state === "won") {
    if (go) nextLevel();
  } else if (state === "finished") {
    if (go) state = "title";
  } else if (state === "playing") {
    if (key === keys.LEFT || key === keys.A) slide(-1, 0);
    if (key === keys.RIGHT || key === keys.D) slide(1, 0);
    if (key === keys.UP || key === keys.W) slide(0, -1);
    if (key === keys.DOWN || key === keys.S) slide(0, 1);
    if (key === keys.Z) undo();
    if (key === keys.R) restartLevel();
    if (key === keys.ESCAPE) state = "title";
  }
}

function onMouseDown(pos, button) {
  if (button !== mouse.LEFT) return; // the scroll wheel counts as a button too
  swipeStart = pos;
}

// A drag is a swipe: its longer side picks the direction. A short drag is a
// tap, which presses buttons and moves through the menus.
function onMouseUp(pos) {
  if (swipeStart === null) return;
  const dx = pos[0] - swipeStart[0];
  const dy = pos[1] - swipeStart[1];
  swipeStart = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_DISTANCE) {
    tap(pos);
  } else if (Math.abs(dx) > Math.abs(dy)) {
    slide(Math.sign(dx), 0);
  } else {
    slide(0, Math.sign(dy));
  }
}

function tap(pos) {
  if (state === "title") {
    if (pos[0] < 200) chosen = Math.max(0, chosen - 1);
    else if (pos[0] > WIDTH - 200) chosen = Math.min(unlocked, chosen + 1);
    else loadLevel(chosen);
  } else if (state === "won") {
    nextLevel();
  } else if (state === "finished") {
    state = "title";
  } else if (state === "playing" && pos[1] < HUD_HEIGHT) {
    if (pos[0] > WIDTH - 76) restartLevel();
    else if (pos[0] > WIDTH - 152) undo();
  }
}

// ---- Update ----

function update(dt) {
  time += dt;
  if (sliding) eatFishUnderPenguin();
  for (const fish of fishes) {
    fish.angle = Math.sin(time * 5 + fish.col) * 12;
  }
  for (const flake of snowflakes) {
    flake.y += flake.speed * dt;
    flake.x += Math.sin(time + flake.speed) * 10 * dt;
    if (flake.y > HEIGHT) {
      flake.y = -4;
      flake.x = randomInt(0, WIDTH);
    }
  }
  for (const effect of effects) effect.age += dt;
  effects = effects.filter((effect) => effect.age < 0.6);
}

// ---- Draw ----

function draw() {
  screen.fill("#bfe4fb", "#eaf6ff");
  if (state === "title") {
    drawTitle();
    drawSnow();
    return;
  }
  drawBoard();
  drawSnow();
  drawHud();
  if (state === "won") drawWon();
  if (state === "finished") drawFinished();
}

// Most text in the game is centred on a point, in the same rounded font.
function say(text, x, y, size, color) {
  screen.draw.text(text, {
    center: [x, y],
    fontname: FONT,
    size: size,
    color: color,
  });
}

function drawBoard() {
  const left = boardLeft();
  const top = boardTop();
  screen.draw.filledRect(
    [left + 6, top + 8, grid[0].length * TILE, grid.length * TILE],
    rgb(42, 33, 64, 40),
  );
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const x = left + col * TILE;
      const y = top + row * TILE;
      screen.blit("ice", [x, y]);
      const tile = grid[row][col];
      if (tile === "#") screen.blit("rock", [x, y]);
      if (tile === "*") screen.blit("snow", [x, y]);
      if (tile === "O") screen.blit("hole", [x, y]);
    }
  }
  for (const fish of fishes) {
    if (!fish.eaten) fish.draw();
  }
  penguin.draw();
  for (const effect of effects) {
    const fade = Math.round(255 * (1 - effect.age / 0.6));
    const color = rgb(effect.color[0], effect.color[1], effect.color[2], fade);
    screen.draw.circle([effect.x, effect.y], 8 + effect.age * 70, color, 3);
  }
  const below = HEIGHT - (top + grid.length * TILE);
  if (below >= 26 && state === "playing") {
    const hint = "Arrows or swipe to slide · Z undo · R restart";
    say(hint, WIDTH / 2, HEIGHT - below / 2, 16, "#557091");
  }
}

function drawHud() {
  const level = LEVELS[levelIndex];
  screen.draw.filledRect([0, 0, WIDTH, HUD_HEIGHT], "#18324f");
  screen.draw.text(`${levelIndex + 1}. ${level.name}`, {
    midLeft: [16, HUD_HEIGHT / 2],
    fontname: FONT,
    size: 22,
    color: "white",
  });
  screen.blit("fish", [262, 9]);
  say(`× ${fishLeft()}`, 326, HUD_HEIGHT / 2, 22, "#ffb27a");
  say(`Moves ${moves} · Par ${level.par}`, 470, HUD_HEIGHT / 2, 20, "#cfe8fb");
  drawButton("Undo", WIDTH - 114);
  drawButton("Reset", WIDTH - 40);
}

function drawButton(label, centerX) {
  screen.draw.filledRect([centerX - 34, 9, 68, 30], "#2f5580");
  say(label, centerX, HUD_HEIGHT / 2, 16, "white");
}

function drawSnow() {
  for (const flake of snowflakes) {
    screen.circle(flake.x, flake.y, flake.size, rgb(255, 255, 255, 200));
  }
}

function drawStar(x, y, radius, filled) {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? radius : radius * 0.45; // alternate tip and dip
    points.push([x + Math.cos(angle) * r, y + Math.sin(angle) * r]);
  }
  screen.draw.filledPolygon(points, filled ? "#ffd34d" : "#c9d8e8");
  screen.draw.polygon(points, "#2a2140", 2);
}

function drawStars(x, y, radius, count) {
  for (let i = 0; i < 3; i++) {
    drawStar(x + (i - 1) * radius * 2.4, y, radius, i < count);
  }
}

function drawTitle() {
  screen.draw.text("Penguin Slide", {
    center: [WIDTH / 2, 92],
    fontname: FONT,
    size: 72,
    color: "white",
    outline: 4,
    outlineColor: "#18324f",
  });
  say("Slide on the ice. Eat every fish!", WIDTH / 2, 152, 24, "#2f5580");

  const level = LEVELS[chosen];
  say(`Level ${chosen + 1}: ${level.name}`, WIDTH / 2, 222, 30, "#18324f");
  if (chosen > 0) screen.triangle(150, 222, 172, 208, 172, 236, "#2f86f6");
  if (chosen < unlocked)
    screen.triangle(570, 222, 548, 208, 548, 236, "#2f86f6");
  const record = best[chosen];
  const stars = record === undefined ? 0 : starsFor(record, level.par);
  drawStars(WIDTH / 2, 268, 14, stars);

  for (let i = 0; i < 5; i++) screen.blit("ice", [240 + i * 48, 330]);
  screen.blit("rock", [240 + 4 * 48, 330]);
  screen.blit("fish", [300, 340]);
  penguin.image = "penguin_happy";
  penguin.pos = [264, 330 + Math.sin(time * 3) * 4];
  penguin.scale = 1.6;
  penguin.angle = 0;
  penguin.opacity = 1;
  penguin.draw();
  igloo.draw();
  if (Math.sin(time * 4) > -0.3) {
    say("Space or tap to play", WIDTH / 2, 440, 22, "#2f5580");
  }
}

function drawPanel(title) {
  screen.draw.filledRect([0, 0, WIDTH, HEIGHT], rgb(24, 50, 79, 130));
  screen.draw.filledRect([170, 110, 380, 260], "white");
  screen.draw.rect([170, 110, 380, 260], "#18324f", 4);
  say(title, WIDTH / 2, 150, 36, "#18324f");
}

function drawWon() {
  const par = LEVELS[levelIndex].par;
  const word = moves === 1 ? "move" : "moves";
  drawPanel("Level complete!");
  drawStars(WIDTH / 2, 215, 24, starsFor(moves, par));
  say(`${moves} ${word} · par ${par}`, WIDTH / 2, 275, 24, "#2f5580");
  say("Space or tap for the next level", WIDTH / 2, 330, 20, "#2f86f6");
}

function drawFinished() {
  drawPanel("You ate every fish!");
  const stars = `${totalStars()} of ${LEVELS.length * 3} stars`;
  say(stars, WIDTH / 2, 215, 30, "#ff8a3d");
  say("You're a true ice champion.", WIDTH / 2, 265, 22, "#2f5580");
  say("Space or tap for the title screen", WIDTH / 2, 330, 20, "#2f86f6");
}
