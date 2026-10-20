WIDTH = 720;
HEIGHT = 480;
TITLE = "Penguin Slide";

const TILE = 48; // every tile is a 48 × 48 square
const LEFT = 120; // where the grid's top-left corner sits on the screen
const TOP = 96;

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

function draw() {
  screen.fill("#bfe4fb", "#eaf6ff");
  for (let row = 0; row < LEVEL.length; row++) {
    for (let col = 0; col < LEVEL[row].length; col++) {
      const x = LEFT + col * TILE;
      const y = TOP + row * TILE;
      const letter = LEVEL[row][col];
      if (letter === "#") {
        screen.rect(x, y, TILE, TILE, "#8b92ba");
      } else {
        screen.rect(x, y, TILE, TILE, "#d3efff");
      }
      if (letter === "F") {
        screen.circle(x + TILE / 2, y + TILE / 2, 12, "#ffa266");
      }
      if (letter === "P") {
        screen.circle(x + TILE / 2, y + TILE / 2, 18, "#3d4d78");
      }
    }
  }
}
