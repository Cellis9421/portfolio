# Sectioned page prototype

The current site's sections, each rebuilt as its own 3D piece, on one scrolling page.
Projects get the most room. It reads the site's own project and work history config, so it
shows the real content. It is a prototype and is not wired into the site.

- [Look at it](#look-at-it)
- [The sections](#the-sections)
- [Layout](#layout)
- [What is real and what is placeholder](#what-is-real-and-what-is-placeholder)
- [What it still needs](#what-it-still-needs)
- [Rebuild the data and retake the stills](#rebuild-the-data-and-retake-the-stills)

## Look at it

![About, projects, skills, work history and guides](shots/sections.jpg)

It is live at <https://calvinellis.io/preview/site/>, unlinked and marked `noindex`. That
copy is `public/preview/`, written by `node prototypes/publish.mjs`. Edit the files here,
run that, and the next merge to `main` publishes it. Never edit `public/preview/` by hand.

To run it locally, serve the repo root, because the gallery reads the screenshots in
`public/`.

```bash
python -m http.server 4173
```

Then open `http://localhost:4173/prototypes/site/`. The page loads three.js from a CDN, so
it needs a network connection.

## The sections

| Section | The 3D piece | What you do with it |
|---|---|---|
| About | A swarm of particles, with the social links in orbit round it | Point at a link and the swarm spells it. The pointer pushes the swarm aside |
| Projects | A curved wall of project screens over a dark glass floor | Drag or use the arrows to browse, filter by job or skill, click one for its story and links |
| Skills | A globe of every skill the projects use | Drag it. Pick a skill to see its projects, then send that filter up to the gallery |
| Work history | The [career tree](../career-tree/), in a frame | Drag the years |
| Guides and articles | Books on a shelf | Point at one and it comes off the shelf to show its cover. Click to open it |
| Education and blog | Plain cards | Read |

The About copy is rewritten to lead with AI and agentic work. It uses only what the
current site already says.

## Layout

| Path | What it is |
|---|---|
| `index.html` | The page: every section's words and styles |
| `main.js` | Loads the data and starts each scene when its section comes near the screen |
| `stage.js` | One small WebGL stage per section. It draws only while its canvas is on screen |
| `hero.js`, `projects.js`, `skills.js`, `guides.js` | One scene each |
| `build-data.mjs` | Builds `data.json` from `src/configs/PROJECTS.tsx` and `WORK_HISTORY.tsx` |
| `data.json` | The built data, committed so the page runs without a build |
| `shoot.py`, `shots/` | The capture script and its stills |

## What is real and what is placeholder

- **Real:** all 26 projects with their descriptions, tags and links, the 64 skills and
  which projects share them, the 20 screenshots, the social links, the guide and the blog.
- **Matched by hand:** which screenshot belongs to which project, in `build-data.mjs`.
  Six projects have no screenshot and get a drawn cover.
- **Placeholder:** the three pale books on the shelf, and the years on the career tree's
  fruit.

## What it still needs

- The owner's read of each section. They are independent, so any one can be swapped.
- More detail in each scene. This pass proves the structure and the interactions.
- A frame rate on a phone, and a layout below about 980 pixels wide that has been looked at.
- The plain page underneath, a keyboard path into the gallery beyond the arrow keys, and
  reduced motion beyond slower spins.
- A move into the Next.js app once the sections are chosen.

## Rebuild the data and retake the stills

```bash
node prototypes/site/build-data.mjs      # after a change to the site's project or work config
python prototypes/site/shoot.py          # every section, and the sheet
python prototypes/site/shoot.py skills   # one section
```

The capture needs `playwright` with its Chromium, and `Pillow`. It serves the repo root
itself, and waits on real wall time because headless Chrome's virtual time budget skips
WebGL frames.
