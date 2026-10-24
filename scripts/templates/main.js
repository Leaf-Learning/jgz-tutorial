// {{TITLE}}, made with js-game-zero.

WIDTH = 640;
HEIGHT = 400;
TITLE = "{{TITLE}}";

function draw() {
  screen.fill("#2d2758", "#15122d");
  screen.draw.text("{{TITLE}}", {
    center: [WIDTH / 2, HEIGHT / 2],
    size: 56,
    color: "white",
    fontname: "fredoka",
  });
}
