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

function draw() {
  screen.fill("#bfe4fb", "#eaf6ff");
  for (let row = 0; row < LEVEL.length; row++) {
    for (let col = 0; col < LEVEL[row].length; col++) {
      const x = LEFT + col * TILE;
      const y = TOP + row * TILE;
      const letter = LEVEL[row][col];
      screen.blit("ice", [x, y]); // ice goes under everything
      if (letter === "#") screen.blit("rock", [x, y]);
      if (letter === "F") screen.blit("fish", [x + 4, y + 9]);
      if (letter === "P") screen.blit("penguin_down", [x, y]);
    }
  }
  screen.draw.text("Penguin Slide", {
    center: [WIDTH / 2, 36],
    fontname: FONT,
    size: 40,
    color: "#18324f",
  });
}
