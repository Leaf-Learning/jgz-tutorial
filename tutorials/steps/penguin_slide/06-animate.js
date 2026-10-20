WIDTH = 720;
HEIGHT = 480;
TITLE = "Penguin Slide";

const TILE = 48; // every tile is a 48 × 48 square
const SLIDE_TIME = 0.07; // seconds to slide across one tile
const FONT = "fredoka";

// The level, drawn with letters. Each string is one row of the rink:
//   #  rock     .  ice     F  fish     P  where the penguin starts
const LEVEL = [
  "##########",
  "#P.....#.#",
  "#........#",
  "#........#",
  "#.....F..#",
  "#........#",
  "##########",
];

// Centre the rink: whatever space is left over is split between both sides.
const LEFT = (WIDTH - LEVEL[0].length * TILE) / 2;
const TOP = (HEIGHT - LEVEL.length * TILE) / 2;

let grid = []; // the level's tiles: one array of letters per row
let moves = 0;
let sliding = false;

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
  for (let row = 0; row < LEVEL.length; row++) {
    const letters = LEVEL[row].split("");
    for (let col = 0; col < letters.length; col++) {
      if (letters[col] === "P") {
        penguin.row = row;
        penguin.col = col;
        letters[col] = "."; // the penguin stands on plain ice
      }
    }
    grid.push(letters);
  }
  penguin.pos = [tileX(penguin.col), tileY(penguin.row)];
}

loadLevel();

function facing(dx, dy) {
  if (dx < 0) return "penguin_left";
  if (dx > 0) return "penguin_right";
  if (dy < 0) return "penguin_up";
  return "penguin_down";
}

function slide(dx, dy) {
  if (sliding) return; // one slide at a time
  penguin.image = facing(dx, dy);

  // Follow the ice until the next tile is a rock. This loop only does the
  // thinking; animate() does the moving.
  let row = penguin.row;
  let col = penguin.col;
  while (tileAt(row + dy, col + dx) !== "#") {
    row += dy;
    col += dx;
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
  bonk();
}

// A squash-and-spring wobble, so stopping at a rock feels like a bump.
function bonk() {
  penguin.scale = 0.82;
  animate(penguin, { scale: 1, duration: 0.35, tween: "spring" });
  tone.play("C3", 0.08, { waveform: "square", volume: 0.12 });
}

function onKeyDown(key) {
  if (key === keys.LEFT) slide(-1, 0);
  if (key === keys.RIGHT) slide(1, 0);
  if (key === keys.UP) slide(0, -1);
  if (key === keys.DOWN) slide(0, 1);
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
      if (tile === "F") screen.blit("fish", [x + 4, y + 9]);
    }
  }
  penguin.draw();
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
}
