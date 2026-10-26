WIDTH = 640;
HEIGHT = 400;
TITLE = "Tiny Garden";

function draw() {
  screen.fill("#aee6ff", "#e9f9ff");
  // The sun: a soft glow, then the sun itself.
  screen.circle(560, 50, 56, rgb(255, 236, 160, 70));
  screen.circle(560, 50, 38, "#ffd34d");
  screen.rect(0, 144, WIDTH, 256, "#9bd160");
}
