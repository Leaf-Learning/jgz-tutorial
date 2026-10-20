WIDTH = 720;
HEIGHT = 480;
TITLE = "Penguin Slide";

const TILE = 48; // every tile is a 48 × 48 square
const COLUMNS = 10;
const ROWS = 6;
const LEFT = 120; // where the grid's top-left corner sits on the screen
const TOP = 96;

function draw() {
  screen.fill("#bfe4fb", "#eaf6ff");
  // One loop for the rows, and inside it, one loop for the columns.
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const x = LEFT + col * TILE;
      const y = TOP + row * TILE;
      screen.rect(x + 1, y + 1, TILE - 2, TILE - 2, "#d3efff");
    }
  }
}
