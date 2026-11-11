# Concept mockups

One rough three.js scene for each of the seven concepts in
[3d-portfolio-concepts.md](../3d-portfolio-concepts.md). They exist to judge a look and an
idea. They are built from boxes, light and bloom, and none of this code is meant to reach
the real site.

- [Look at them](#look-at-them)
- [Layout](#layout)
- [Retake the stills](#retake-the-stills)

## Look at them

The stills are in [shots/](shots/), with all seven on
[shots/contact-sheet.jpg](shots/contact-sheet.jpg).

To move around a scene, serve this folder and open it. The numbered links at the bottom
switch concept, and the mouse orbits.

```bash
python -m http.server 8080 --directory plans/concept-mockups
```

Then open `http://localhost:8080/?c=1`, with `c` from 1 to 7. The page loads three.js from
a CDN, so it needs a network connection. Opening `index.html` straight from disk does not
work, because the browser refuses module scripts from a `file:` address.

## Layout

| Path | What it is |
|---|---|
| `index.html` | The page: caption, labels, panels and the switcher |
| `kit.js` | Shared helpers: stage, bloom, lights, primitives, canvas screens, noise |
| `scenes/0N-<name>.js` | One concept each, exporting a single function |
| `shoot.py` | Captures the stills and builds the contact sheet |
| `shots/` | The captured stills |

## Retake the stills

```bash
python plans/concept-mockups/shoot.py        # all seven
python plans/concept-mockups/shoot.py 1 7    # only those two
```

It needs `playwright` with its Chromium, and `Pillow`. It serves the folder itself.

WebGL needs real wall time to draw. The script waits for the page's own `__ready` flag and
then sleeps. Headless Chrome's `--virtual-time-budget` skips the frames and gives a blank
canvas.
