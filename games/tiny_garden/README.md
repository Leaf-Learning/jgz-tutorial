# Tiny Garden

A cosy garden game with no way to lose. Click an empty plot to plant a seed. A
thirsty raindrop appears, so click the plant again to water it: it only grows
while it has water. When a flower blooms it glows, and a click picks it into your
basket. Click the market stall to sell everything in the basket, then spend the
coins on rarer seeds from the shelf at the bottom: tulips, sunflowers, roses and
finally the moonbloom. Your garden is saved, so it's still there tomorrow.

**Controls:** click or tap. Plots do whatever the plant needs next (plant, water,
pick), the stall sells, and the seed packets choose (or buy) what you plant.

**Learn to build it:** [`tutorials/tiny-garden.html`](../../tutorials/tiny-garden.html)
walks a complete beginner through making this game from an empty screen.

## Run it

Play it from the hub: open [`tutorials/index.html`](../../tutorials/index.html) and press
**Play** on its card.

To test it, the jgz CLI runs it in headless Chromium. From the jgz-tutorial folder:

```sh
bun run jgz -- test games/tiny_garden
```

To keep building it outside this repo, use the js-game-zero sandbox, which runs from a
clone of its repository
([Getting started](https://github.com/Leaf-Learning/js-game-zero/blob/main/docs/getting-started.md)
says how). Make a blank game, paste `main.js` into the editor, and add `images/` and
`fonts/` from the Images and Fonts panels on the left.

## What's inside

| Path                | What it is                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `main.js`           | The whole game, written to be read by beginners.                                                  |
| `images/`           | The hand-made SVG art: plant stages, five flowers, soil, seed packets, the stall, coin and cloud. |
| `fonts/fredoka.ttf` | Fredoka SemiBold, under the SIL Open Font License (`FONT-LICENSE-OFL.txt`).                       |
| `tutorial.json`     | How the game appears on the tutorials hub and the play page.                                      |
