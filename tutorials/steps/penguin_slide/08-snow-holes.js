WIDTH = 720;
HEIGHT = 480;
TITLE = "Penguin Slide";

const TILE = 48; // every tile is a 48 × 48 square
const SLIDE_TIME = 0.07; // seconds to slide across one tile
const FONT = "fredoka";

// The level, drawn with letters. Each string is one row of the rink:
//   #  rock (stops you)     .  slippery ice     *  snow (you stop ON it)
//   O  water hole (splash!) F  fish             P  where the penguin starts
const LEVEL = [
  "###########",
  "#P....O..F#",
  "#.........#",
  "#.........#",
  "#....*....#",
  "#.....F...#",
  "###########",
];

// Centre the rink: whatever space is left over is split between both sides.
const LEFT = (WIDTH - LEVEL[0].length * TILE) / 2;
const TOP = (HEIGHT - LEVEL.length * TILE) / 2;

let state = "playing"; // "playing", "splash" or "won"
let grid = []; // the level's tiles: one array of letters per row
let fishes = []; // one Actor per fish, each with row, col and eaten added
let moves = 0;
let sliding = false;
let effects = []; // expanding rings: splashes, snow puffs, gulps
let time = 0; // seconds since the game started, for wiggles

const penguin = new Actor("penguin_down");
penguin.row = 0;
penguin.col = 0;

// These turn a row or column into screen pixels (the middle of the tile).
function tileX(col) {
  return LEFT + col * TILE + TILE / 2;
}

function tileY(row) {
  return TOP + row * TILE + TILE / 2;
}

function tileAt(row, col) {
  return grid[row][col];
}

function loadLevel() {
  grid = [];
  fishes = [];
  for (let row = 0; row < LEVEL.length; row++) {
    const letters = LEVEL[row].split("");
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

loadLevel();

function restartLevel() {
  loadLevel();
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

function onKeyDown(key) {
  if (state !== "playing") return;
  if (key === keys.LEFT) slide(-1, 0);
  if (key === keys.RIGHT) slide(1, 0);
  if (key === keys.UP) slide(0, -1);
  if (key === keys.DOWN) slide(0, 1);
  if (key === keys.R) restartLevel();
}

function update(dt) {
  time += dt;
  if (sliding) eatFishUnderPenguin();
  for (const fish of fishes) {
    fish.angle = Math.sin(time * 5 + fish.col) * 12;
  }
  for (const effect of effects) effect.age += dt;
  effects = effects.filter((effect) => effect.age < 0.6);
}

function draw() {
  screen.fill("#bfe4fb", "#eaf6ff");
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const x = LEFT + col * TILE;
      const y = TOP + row * TILE;
      screen.blit("ice", [x, y]); // ice goes under everything
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
  screen.draw.text("Penguin Slide", {
    center: [WIDTH / 2, 36],
    fontname: FONT,
    size: 40,
    color: "#18324f",
  });
  screen.draw.text(`Moves: ${moves}`, {
    center: [WIDTH / 2, HEIGHT - 32],
    fontname: FONT,
    size: 24,
    color: "#2f5580",
  });
  if (state === "won") {
    screen.draw.filledRect([160, 190, 400, 100], "white");
    screen.draw.text("You ate every fish!", {
      center: [WIDTH / 2, 240],
      fontname: FONT,
      size: 36,
      color: "#ff8a3d",
    });
  }
}
