# From an idea to a teachable game

## What makes a good tutorial game

A beginner has to build the whole thing in about two hours and understand every line. So:

- **One screen, one verb.** Click, slide, aim, jump, catch, drag. The whole game is that verb
  meeting a few rules. No scrolling worlds or cameras.
- **Readable at a glance.** A first-timer gets the goal within ten seconds of pressing Play.
- **Short rounds and quick retries.** Losing costs seconds, not minutes.
- **Progression from data.** Levels as a list of objects or strings, or a difficulty number that
  rises. Adding a level should be a challenge the learner can do.
- **Juice that's cheap to code.** Squash-and-stretch with `animate`, a `tone.play` blip, a
  sparkle, a happy face swap. These make it feel finished, and each one is a small, satisfying step.
- **Cute characters with feelings.** Everything with a face reacts: happy, ouch, sleepy.

Steer away from: text input, free-form physics engines, networking, enemies with complex AI,
pixel-perfect collision, more than about four kinds of thing on screen, and anything needing
more than one key held at once. Cut ideas down to their core verb. "A farming RPG" becomes
"plant seeds on a grid and water them before they wilt".

## The design brief (show this to the user)

```
Name / pitch      Frog Feast: catch bugs with a stretchy tongue before the sun sets.
Core loop         Bugs fly by; click to shoot the tongue; caught bugs fill the belly meter.
Win / lose        Fill the meter before the timer runs out / the sun sets first.
Controls          Click or tap where the tongue should go.
Progression       5 evenings: more bugs, faster bugs, a "golden fly" bonus.
Concept ladder    1 pond (drawing) · 2 frog (variables) · 3 bugs fly (game loop, dt) ·
                  4 many bugs (lists, loops) · 5 click (input) · 6 tongue (animate) ·
                  7 catch (distance) · 8 timer & meter · 9 evenings (levels as data) ·
                  10 polish (title, sounds, saving)
New here          animate as a mechanic, timers; assumes nothing (first tutorial ok)
Art               frog_idle/frog_open/frog_happy, fly_1/fly_2, golden_fly, lily pads, pond bg
Theme             based on "night" (dusk pond), retuned to teal and peach
Size              ~350-line game, 10 steps, ~2 hours
```

## Concept ladders

Order ideas so each step needs only what came before, and something visible changes every step.
A good default ladder for a first tutorial:

1. **Drawing:** coordinates, `screen.fill`, shapes, colours, painting order
2. **Variables:** a thing's position in `let x`, constants in `const`
3. **The game loop:** `update(dt)` vs `draw()`, velocity, why `* dt`
4. **Decisions:** `if`, staying on screen, bouncing
5. **Many things:** objects `{ x, y }`, arrays, `for … of`, making things with a function
6. **Pictures:** Actors, images, flip-book frames, `animate`
7. **Input:** `onMouseDown` / `onKeyDown`, `mouse.pos`, `keyboard.left`
8. **Touching:** distance, `colliderect`, grid lookups
9. **Rules of the game:** score, timers, game states (`"title"`, `"playing"`, `"won"`), levels as data
10. **Polish:** title screen, sound with `tone.play`, saving with `storage`, fonts

Later tutorials can assume the basics and go deeper, as Penguin Slide (grids, `while`, undo
stacks) and Planet Putt (vectors, acceleration, prediction) do. Say what's assumed in the hero
("Best after Firefly Flash").

## What the existing tutorials already teach

| Tutorial                 | Big ideas                                                                                                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Firefly Flash (click)  | coordinates, painting order, variables, game loop & dt, `if` & bouncing, objects/arrays/loops, Actors & flip-books, clicks, distance & touching circles, `tone` & scales, game states, levels as data, `storage` |
| 2 Penguin Slide (keys)   | grids & nested loops, levels as strings, tiles from letters, `screen.blit`, keys & swipes, `while` loops, `animate` tweens, collecting, tile rules, level lists, undo stacks, stars & par           |
| 3 Planet Putt (drag)     | velocity vectors, acceleration & falling, gravity toward planets, direction & normalising, drag to aim, bouncing off circles, goals, predicting paths, holes as data, fixed-step physics            |

A new tutorial should bring something fresh: a different verb, a new kind of rule (timers,
spawning, chasing, matching, growing, rhythm), or a different structure (a sandbox, a toy, a
two-player hot-seat game).

## Size targets

| Thing                      | Target                                      |
| -------------------------- | ------------------------------------------- |
| Finished `main.js`         | 250–650 lines, mostly short functions, data and comments |
| Steps                      | 8–12, plus the final game                   |
| Time for the learner       | 90–120 minutes                              |
| Challenges                 | 1–2 per step, 12–20 in total                |
| Quizzes                    | about 1 per step                            |
| Widgets                    | 2–5                                         |
| Learn-cards / glossary     | 6 cards; 8–15 terms                         |
| Canvas size                | 640×400 or 720×480, landscape               |
