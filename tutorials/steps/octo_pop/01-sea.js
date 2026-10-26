// Octo Pop, made with js-game-zero.
// Type the words to pop the bubbles before they float away!

WIDTH = 720;
HEIGHT = 480;
TITLE = "Octo Pop";

function draw() {
  // The sea: light blue at the top, deep blue at the bottom.
  screen.fill("#4fc3e8", "#123a6b");
  // The sandy floor.
  screen.rect(0, HEIGHT - 70, WIDTH, 70, "#f6dfa8");
  // A bubble with a word inside it.
  screen.circle(360, 230, 56, "#f6fdff");
  screen.draw.circle([360, 230], 56, "#2a2140", 3);
  screen.text("octopus", 322, 218, "#2a2140", 24);
}
