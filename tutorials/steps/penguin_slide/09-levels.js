WIDTH = 720;
HEIGHT = 480;
TITLE = "Penguin Slide";

// Tuning: change these to change how the game feels.
const TILE = 48; // every tile is a 48 × 48 square
const HUD_HEIGHT = 48; // the strip across the top for level, fish and moves
const SLIDE_TIME = 0.07; // seconds to slide across one tile
const FONT = "fredoka";

// Each level is a little map drawn with letters, one string per row:
//   #  rock (stops you)     .  slippery ice     *  snow (you stop ON it)
//   O  water hole (splash!) F  fish             P  where the penguin starts
// `par` is the fewest moves that eats every fish.
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
];

// Game state
let state = "playing"; // "playing", "splash", "won" or "finished"
let levelIndex = 0;
let grid = []; // the current level's tiles: one array of letters per row
let fishes = []; // one Actor per fish, each with row, col and eaten added
let moves = 0;
let sliding = false;
let effects = []; // expanding rings: splashes, snow puffs, gulps
let time = 0; // seconds since the game started, for wiggles

const penguin = new Actor("penguin_down");
penguin.row = 0;
penguin.col = 0;

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
  effects = [];
  sliding = false;
  state = "playing";
}

loadLevel(0);

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
}

function nextLevel() {
  if (levelIndex + 1 < LEVELS.length) {
    loadLevel(levelIndex + 1);
  } else {
    state = "finished";
    playNotes(["C5", "E5", "G5", "C6", "G5", "C6", "E6"], 0.12, "triangle");
  }
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
  if (state === "won") {
    if (go) nextLevel();
  } else if (state === "finished") {
    if (go) loadLevel(0);
  } else if (state === "playing") {
    if (key === keys.LEFT || key === keys.A) slide(-1, 0);
    if (key === keys.RIGHT || key === keys.D) slide(1, 0);
    if (key === keys.UP || key === keys.W) slide(0, -1);
    if (key === keys.DOWN || key === keys.S) slide(0, 1);
    if (key === keys.R) restartLevel();
  }
}

// ---- Update ----

function update(dt) {
  time += dt;
  if (sliding) eatFishUnderPenguin();
  for (const fish of fishes) {
    fish.angle = Math.sin(time * 5 + fish.col) * 12;
  }
  for (const effect of effects) effect.age += dt;
  effects = effects.filter((effect) => effect.age < 0.6);
}

// ---- Draw ----

function draw() {
  screen.fill("#bfe4fb", "#eaf6ff");
  drawBoard();
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
}

function drawPanel(title) {
  screen.draw.filledRect([0, 0, WIDTH, HEIGHT], rgb(24, 50, 79, 130));
  screen.draw.filledRect([170, 110, 380, 260], "white");
  screen.draw.rect([170, 110, 380, 260], "#18324f", 4);
  say(title, WIDTH / 2, 150, 36, "#18324f");
}

function drawWon() {
  drawPanel("Level complete!");
  const word = moves === 1 ? "move" : "moves";
  say(`${moves} ${word}`, WIDTH / 2, 230, 30, "#2f5580");
  say("Space for the next level", WIDTH / 2, 330, 20, "#2f86f6");
}

function drawFinished() {
  drawPanel("You ate every fish!");
  say("You're a true ice champion.", WIDTH / 2, 230, 22, "#2f5580");
  say("Space to play again", WIDTH / 2, 330, 20, "#2f86f6");
}
