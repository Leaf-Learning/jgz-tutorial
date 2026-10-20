WIDTH = 720;
HEIGHT = 480;
TITLE = "Penguin Slide";

const TILE = 48; // every tile is a 48 × 48 square
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

// Waddle one tile, unless a rock is in the way.
function step(dx, dy) {
  penguin.image = facing(dx, dy);
  if (tileAt(penguin.row + dy, penguin.col + dx) === "#") return;
  penguin.row += dy;
  penguin.col += dx;
  penguin.pos = [tileX(penguin.col), tileY(penguin.row)];
}

function onKeyDown(key) {
  if (key === keys.LEFT) step(-1, 0);
  if (key === keys.RIGHT) step(1, 0);
  if (key === keys.UP) step(0, -1);
  if (key === keys.DOWN) step(0, 1);
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
}
