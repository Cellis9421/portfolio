# Career tree prototype

One tree, one slider. Drag the years from 2009 to now and the tree grows from a seedling.
Each job is a side of the tree, each project is a glowing fruit, and the panel on the left
is the work history for the year under the handle. It answers the owner's reference: a
single living object, changed by one control, with real detail.

This is a first working pass in one file. It is not wired into the site. The
[sectioned page](../site/) frames it as its work history section, with `?embed=1`, which
hides the name and the project count and lets the framing page pause it off screen.

- [Look at it](#look-at-it)
- [How it works](#how-it-works)
- [What is placeholder](#what-is-placeholder)
- [What it still needs](#what-it-still-needs)
- [Retake the stills](#retake-the-stills)

## Look at it

![The tree in 2010, 2014, 2019 and now](shots/four-years.jpg)

The scrub from 2009 to now is [shots/scrub.webp](shots/scrub.webp).

It is live at <https://calvinellis.io/preview/career-tree/>, published by
`node prototypes/publish.mjs` (see [the sectioned page](../site/README.md)).

To run it locally, serve this folder and open it.

```bash
python -m http.server 4173 --directory prototypes/career-tree
```

Then open `http://localhost:4173/`. The page loads three.js from a CDN, so it needs a
network connection.

| Control | What it does |
|---|---|
| The slider | Sets the year. The tree, the light and the work history follow |
| The stops under it | Jump to a job |
| Play | Runs 2009 to now in about twenty seconds |
| Sound | Wind |
| Drag the scene | Walk round the tree |
| A fruit | Hover for its name, click for its card |
| All projects | The same projects as a plain list. Picking one turns the tree to face it |

## How it works

- **One number drives everything.** `g` runs from 0 in 2009 to 1 now. Growth, light, the
  camera, the fruit and the words all read it.
- **The tree is a skeleton.** Every branch has a bone at its base and a year it was born.
  Scaling a bone grows its whole subtree, so the young tree is the grown one with most of
  its bones still at zero. Wind is the same bones, turned a little.
- **Leaves ride their twig.** A leaf is skinned to the twig it sits on, so it arrives when
  the twig does. A new leaf opens pale, then settles.
- **It is built from photographs.** The leaves, the grass blades, the bark and the sky are
  free CC0 scans, cut down by `../build-assets.py`. The sky is a real meadow, already out of
  focus, and the sun in it is where the scene's light comes from. Light behind a leaf shines
  through it.
- **It sizes itself to the machine.** Three tiers set how many leaves and grass clumps are
  drawn, and resolution drops a step when frames run long. See the
  [sectioned page's README](../site/README.md#speed-and-phones).
- **Each job has a side.** Two limbs per job, the oldest lowest. The camera walks round
  as the years pass, so the job under the handle faces the visitor.
- **Fruit rides the wood.** A fruit is placed on the outermost leaf of a twig and follows
  that twig's bone. Before the twig exists it sits where the wood has got to.

## What is placeholder

- Project years, and the copy on every project card.
- The buttons on a card. They open nothing yet.
- The two "small thing" fruits at the top of the tree.

## What it still needs

- **Closer still to the reference.** The backdrop is out of focus, but the near grass is
  not: there is no depth of field pass, because it costs too much on a phone.
- **A real phone.** It has run on a desktop GPU and on an emulated phone, never a real one.
- **The real project file**, and a fruit that opens the live thing.
- **The plain page underneath**, reduced motion beyond a calmer wind, and a keyboard path
  to each fruit. The list and the slider are already real controls.

## Retake the stills

```bash
python prototypes/career-tree/shoot.py           # stills and the scrub
python prototypes/career-tree/shoot.py stills    # stills only
```

It needs `playwright` with its Chromium, and `Pillow`. It serves the folder itself, and
waits on real wall time because headless Chrome's virtual time budget skips WebGL frames.
