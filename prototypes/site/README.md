# Sectioned page prototype

One scrolling page built round a timeline: what he was working on from 2009 to now, then
how he ships, the agentic work and what shipped. Each section is its own 3D piece. It
reads the site's own project and work history config, so the content is real. It is a
prototype and is not wired into the site.

- [Look at it](#look-at-it)
- [The sections](#the-sections)
- [The timeline](#the-timeline)
- [The loop](#the-loop)
- [Shipped is a dozen bodies of work](#shipped-is-a-dozen-bodies-of-work)
- [Speed and phones](#speed-and-phones)
- [Layout](#layout)
- [What is real and what is placeholder](#what-is-real-and-what-is-placeholder)
- [What it still needs](#what-it-still-needs)
- [Rebuild and retake](#rebuild-and-retake)

## Look at it

![The sections on a desktop](shots/sections.jpg)

![The sections on a phone](shots/phone.jpg)

It is live at <https://calvinellis.io/preview/site/>, unlinked and marked `noindex`. That
copy is `public/preview/`, written by `node prototypes/publish.mjs`. Edit the files here,
run that, and the next merge to `main` publishes it. Never edit `public/preview/` by hand.

To run it locally, serve the repo root and open `http://localhost:4173/prototypes/site/`.

```bash
python -m http.server 4173
```

## The sections

| Section | The 3D piece | What you do with it |
|---|---|---|
| About | A swarm of particles with seven bubbles in orbit: four shortcuts to sections and three social links | Left alone it spells plan, test, build, ship, learn. Point at a bubble and it spells that. On a phone it fills the first screen |
| Timeline | One figure per era, drawn in points, each standing straighter than the last. They stand in a row, then close up into one walker | Scroll. The walker stays in view and changes with the era whose card is passing. A year label jumps to its era |
| How I ship | Work going round a loop of five stations, with agents at each | Pick a station to see what the agents do there, what he does, and the proof. Then send that filter down to the gallery |
| Working with agents | None: words and a log | Read what he does with agents, and the pull requests that built this page |
| Shipped | A curved wall of 12 bodies of work, with their screenshots | Drag or use the arrows, filter by station, open one for its proof, story and links |
| Writing | One book for the guide, drawn in CSS 3D, and the blog's latest posts | Tap the book or a post. Each is a plain link, with no canvas, so it is effortless on a phone |
| Closing | The swarm again, spelling "Let's talk" | Get in touch, and see where he studied |

## The timeline

Owner, 2026-11-12: build the page round a timeline of what he was doing, from about 2010, in
the manner of the march of progress picture. It should show him solving problems with the
tools of each time, by hand and then with agents, without the page saying so in words.

`ERAS` in `build-data.mjs` holds six eras, oldest first.

| Era | Opens | Its facts come from |
|---|---|---|
| Bots that played the game | 2009 | Work history |
| Systems for small businesses | 2012 | Work history |
| A store that grew tenfold | 2017 | Work history, project list |
| A platform for whole companies | 2022 | Work history, project list |
| Code with an assistant | 2023 | Work history, his first public AI repository, the blog |
| Agents write the code | 2026 | His public rule packs for coding agents, this page's receipts |

- **An era that opens with a job reads its years from the work history**, and a job that
  opens no era fails the build.
- **A card has up to four parts**: working on, on the side, tools of the time, shipped then.
  A part with no fact behind it is left off, never filled in.
- **The walker is `march.js`.** A body is 18 joints and the capsules between them. Its points
  ride the joints in the shader, so a pose costs a few numbers a frame. `POSE` is the table of
  how the body is held from first era to last: lean, squat, reach, bulk, stride.
- **One companion joins in the assistant era, and a crew with its work in the last.** These
  are the same small lights that mean agents in the loop.
- **On a phone the walker is pinned across the top** and the cards pass under it.

## The loop

The page is organised by how the work gets done, not by language. Owner, 2026-11-12: how he
ships matters more than what shipped, and a line of gates was missing its feedback loop.
`build-data.mjs` holds the model: five stations, in the order work goes round them.

| Station | Shows | In the scene |
|---|---|---|
| Plan | Deciding what to build from what production says | Telemetry arrives here. The owner's diamond |
| Build | Test-driven development | Work laps a small ring twice, red then green, before it moves on |
| Assure | End-to-end tests in staging | A dashed box round the station. The owner's diamond |
| Release | CI/CD | No diamond: green checks merge it, and a merge deploys it |
| Run | Observability | Work leaves as telemetry, down a dashed line back to Plan. The owner's diamond |

- **Small dots round a station are agents at work.** A station's panel says what the agents
  do there and what the owner does.
- **A diamond marks where the owner steps in**: Plan, Assure and Run. Build and Release are
  hands off.
- **The number in the middle is the pull requests that built this page**, and links to them.
- **Every line of proof is a fact the current site already states.** Nothing is invented.
- **Tools appear last**, as "Built with" on a card and "Done with" under a station.

## Shipped is a dozen bodies of work

The site's config lists 26 projects at the grain of a feature: a checkout, a profile page.
Owner, 2026-11-12: far too granular. `SHIPPED` in `build-data.mjs` holds 12 entries in
plain words, and each names the config projects it stands for.

- **A config project that is neither placed nor in `LEFT_OUT` fails the build**, so a new
  one cannot be forgotten.
- **Folded in:** Multi-Tenancy, with the enterprise hub and the dashboards, into the
  training platform. User Profiles, Guided Onboarding and Forums into the courses. The
  Contentful scripts and the Webflow move into the marketing site.
- **Left out:** User Checkout.
- **One entry comes from the work history, not the project list**: the sync between six
  sales channels.
- **A card with no screenshot shows its claim, set large.**

## Speed and phones

The first version froze the owner's browser. Measured with headless Chromium on the desktop
GPU, scrolling through every section. The phone profile is a 390 by 844 touch screen with
the CPU slowed four times. It is an emulation, not a real phone.

| Measure | First version | Now |
|---|---|---|
| Desktop: longest main-thread stall | 609 ms | 300 ms |
| Phone profile: longest stall | 2,562 ms | 226 ms |
| Phone profile: stalls in total | 6,163 ms | 1,138 ms |
| Phone profile: lowest frame rate in any section | 16 | 58 |

The timeline's walker, measured the same way on 2026-11-12: 60 frames a second on the desktop
in every section, and 54 to 57 on the phone profile while the walker is in view. The longest
stall was 313 ms on the desktop and 537 ms on the phone profile, on a busy machine.

The loop replaced the line on 2026-11-12. On a busy machine, three rounds each, its settled
frame rate on the phone profile matched the line's: 59 against 59, 36 against 34, 60 against 54.

How it stays quick:

- **No blur pass.** Glows are sprites, and each canvas draws straight to the screen.
- **Three tiers.** `stage.js` picks `low`, `mid` or `high` from the pointer type, screen
  size, core count and memory. `?tier=low` forces one.
- **Sharpness gives way first.** When frames run long for a second or so, a scene lowers
  its resolution a step, and raises it again when frames are quick.
- **A scene starts when it is near and stops when it is off screen.**
- **Small files.** The gallery reads 20 screenshots cut to card size, 274 KB in place of
  4.5 MB, two at a time, decoded off the main thread.
- **Phones.** Below 900 pixels the words and the scene stack. A vertical swipe scrolls the
  page and a sideways one turns the scene.

## Layout

| Path | What it is |
|---|---|
| `index.html` | The page: every section's words and styles |
| `main.js` | Loads the data and starts each scene when its section comes near the screen |
| `stage.js` | One small WebGL stage per section, with the tiers and the resolution trade |
| `hero.js`, `march.js`, `ship.js`, `projects.js` | One scene each. `hero.js` also draws the closing section |
| `build-data.mjs` | Builds `data.json`: the eras, the loop's stations, the bodies of work filed under them, the receipts, the education and the blog's latest posts |
| `data.json` | The built data, committed so the page runs without a build |
| `assets/` | The gallery's screenshots, written by `../build-assets.py` |
| `shoot.py`, `shots/` | The capture script and its stills |

## What is real and what is placeholder

- **Real:** every line in an era, the proof under each station, the screenshots, the social
  links, the guide, the blog's latest posts read from its feed, the education, and the pull
  requests in the receipts.
- **Written by hand:** the 12 bodies of work, in `build-data.mjs`: the title, the line of
  proof, the story, the stations and the screenshot. Each is drawn from the config projects
  it names. So is what the agents and the owner do at each station.
- **Placeholder:** nothing. The shelf of pale placeholder books is gone.

## What it still needs

- The owner's read of each section. They are independent, so any one can be swapped.
- His own words for the timeline. Only he knows what he was doing on the side in each era,
  and what he built with from 2012 to 2017, where the work history names no tool. Those
  parts are left off until he says.
- His agentic work. The page says what he does with agents and shows this page's own
  receipts. His private projects are not on it. The ideas for showing them are in
  [the plan](../../plans/3d-portfolio-concepts.md#ideas-for-showing-the-agentic-work).
- A real phone. The phone numbers above come from an emulated one.
- The plain page underneath, and a move into the Next.js app once the sections are chosen.

## Rebuild and retake

```bash
node prototypes/site/build-data.mjs      # after a change to the site's config, or to refresh the receipts and the posts
python prototypes/build-assets.py        # the gallery's screenshots
python prototypes/site/shoot.py          # every section, and the sheet
python prototypes/site/shoot.py phone    # every section as a phone shows it
node prototypes/publish.mjs              # write the copy that the site publishes
```

The capture needs `playwright` with its Chromium, and `Pillow`. It serves the repo root
itself, and waits on real wall time because headless Chrome's virtual time budget skips
WebGL frames.
