WIDTH = 640;
HEIGHT = 400;
TITLE = "Firefly Flash";

function draw() {
  // The sky: deep blue at the top, fading to purple at the bottom.
  screen.fill("#0d0a24", "#3a2b6e");

  // The moon.
  screen.circle(446, 74, 40, "#fff4cf");

  // A few stars.
  screen.circle(80, 60, 2, "white");
  screen.circle(200, 110, 1.5, "white");
  screen.circle(330, 40, 2, "white");
  screen.circle(590, 170, 1.5, "white");

  // Hills: giant circles whose middles are below the bottom of the screen,
  // so only their tops poke up.
  screen.circle(120, 470, 160, "#231d57");
  screen.circle(520, 480, 190, "#231d57");

  // The ground in front of everything.
  screen.rect(0, 350, WIDTH, 50, "#1b1846");
}
