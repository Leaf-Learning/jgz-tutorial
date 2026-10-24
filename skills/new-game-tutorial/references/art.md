# Cute art, in the house style

All art is hand-written SVG in `games/<id>/images/`. Open a few existing sprites before you start
(`games/penguin_slide/images/penguin_happy.svg`, `games/firefly_flash/images/firefly_1.svg`,
`games/planet_putt/images/ball_happy.svg`) and match them, so the new game looks like it belongs to
the same family.

## The style in one list

- **Chunky, round shapes:** big heads, short limbs, no sharp points except sparkles.
- **One outline colour, `#2a2140`** (a dark plum, never pure black), with round joins and caps:
  `stroke-linejoin="round" stroke-linecap="round"`. Outline width is about 5% of the sprite size:
  `2`–`2.5` on a 40–48px sprite, `3` on a 100px one, `1.2`–`1.6` for small details.
- **Faces on everything that's alive** (and many things that aren't: moons, planets, rocks):
  - Open eyes are `#2a2140` ellipses, taller than wide, each with a big white highlight dot up and
    to one side and a tiny one below.
  - Happy or sleepy eyes are upward arcs (`Q` curves, no fill).
  - Blush is two soft `#ff8fab` ellipses under the eyes, `opacity` 0.55–0.7.
  - Mouths are a small curve, or an open mouth filled `#2a2140` with a `#ff7aa2` tongue.
- **Soft shading:** a darker shade of the body colour as a crescent on the lower right (clip it to
  the body with a `clipPath`), and a white highlight ellipse up and to the left, rotated about −35°
  at `opacity` 0.3–0.5.
- **Ground shadow:** characters stand on a flat `#2a2140` ellipse at `opacity` 0.15.
- **Sparkles:** four-pointed stars in `#ffd34d`, for joy and magic.
- **Pastel but saturated colours:** warm yellows `#ffd34d` / `#ffe9a8`, orange `#ffa94d`, pinks
  `#ffc4e1` / `#ff7f9f`, lilac `#c9b8ff`, navy `#3d4d78`, leaf greens `#9bd160` / `#78ad42`, and
  near-white fills (`#fdfbff`, `#fbfcff`) instead of pure white bodies.

## Sizes and names

- **`width` and `height` are the size the game draws it at,** in game pixels. Sprites are 40–48px,
  grid tiles exactly the tile size (Penguin Slide uses 48), big props 90–140px, and backgrounds the
  width of the game. The `viewBox` can use any convenient units (`planet_putt/ball.svg` draws a
  32-unit viewBox at 40px).
- **Asset names** are lowercase, digits and underscores: `frog_idle.svg`, `fly_1.svg`. The engine
  refers to them without the extension (`new Actor("frog_idle")`).
- **Flip-book frames** are `name_1`, `name_2`, …, used as `{ images: ["fly_1", "fly_2"], fps: 12 }`.
  Two frames (wings up and down, a bob) is plenty.
- **Moods and directions** are separate files: `ball`, `ball_happy`, `ball_ouch`, or
  `penguin_left` / `_right` / `_up` / `_down`. Swapping `actor.image` is a great tutorial step.
- **Keep files small:** under 3KB for a sprite, under 20KB for a background. If a background has
  lots of repeated detail (grass, stars, flowers), generate the SVG with a short script and save the
  result. Don't commit the script unless it's useful later.

## Check it with your eyes

You can't judge art from its source. After drawing:

1. Render each sprite larger than life and look at it, along with a contact sheet of all the sprites
   side by side on the game's background colour. A Playwright page with `<img>` tags at 1× and 3×
   works well, or the page's art tray (`<div class="art-tray">`).
2. Then look at it in the running game (a jgz screenshot), at real size, against the real
   background. Check that faces read at 40px, that outlines don't turn into mush, and that the
   characters stand out from the background.
3. Fix and repeat. Expect two or three passes for the main character.

The hub card shows two to four of the sprites on the card background from `tutorial.json`. Place
them so the card looks like a little scene, and check it next to the other cards in a screenshot.
