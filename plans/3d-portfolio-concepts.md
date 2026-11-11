# 3D portfolio: concepts

Brainstorm for remaking calvinellis.io as a 3D experience. **The current direction is the
sectioned page**, a working prototype in [../prototypes/site/](../prototypes/site/), live at
<https://calvinellis.io/preview/site/>. It presents a product engineer: what shipped, how it
ships, and the agentic work, with languages in the small print. Round two, further down, is
six earlier ways to show a lot of projects. Its pictures are rough live mockups in three.js,
in [concept-mockups/](concept-mockups/).

- [The brief](#the-brief)
- [Product engineer](#product-engineer)
- [Ideas for showing the agentic work](#ideas-for-showing-the-agentic-work)
- [The sectioned page](#the-sectioned-page)
- [What was dropped](#what-was-dropped)
- [The four jobs](#the-four-jobs)
- [The six, side by side](#the-six-side-by-side)
- [Concepts](#concepts)
- [Recommendation](#recommendation)
- [Rules for whichever one wins](#rules-for-whichever-one-wins)
- [First milestone](#first-milestone)
- [What already exists](#what-already-exists)
- [Round one, set aside](#round-one-set-aside)
- [Repo gaps found while reading](#repo-gaps-found-while-reading)

## The brief

Owner, 2026-11-11, in the order he said it.

- **Projects come first.** There are a lot of them and the list keeps growing: many small
  standalone things, each hosted on its own and linked from here.
- **A work history timeline** sits somewhere in it.
- **It still answers two questions**: who is this, and what has he done.
- **Keep the current site's sections**, each as its own 3D piece. Projects are the biggest.
- **It must not freeze the browser, and it must work on a phone.**
- **A product engineer, not a list of languages.** See the next section.

## Product engineer

Owner, 2026-11-11, after the page was live. What it means to be a software engineer has
changed since the current site was written. Languages matter less. What matters is what
shipped, with examples, and the work round the code: CI/CD, quality assurance, testability,
maintainability and project management. Languages can be peppered in. He loved the text and
the direction, did not like the tree, and found the first screen on a phone underwhelming.

So the page is organised by six gates, in the order work moves through them. Every line of
proof under a gate is a fact the current site already states.

| Gate | What it shows | Proof it leads with |
|---|---|---|
| Plan | Project management | Cross-team projects run as technical project manager; the checkout migration plan |
| Build | Maintainability | Type-safe API clients generated from the spec; documentation people and agents can both read |
| Test | Testability | 65 tests at 100% coverage on the form system; the app running on mocked APIs |
| Assure | Quality assurance | WCAG 2.2 AA; a diagnostics server; role-based access |
| Release | CI/CD | Pipelines deploying every service; 95% of manual CMS setup removed |
| Run | Operations | Sync between six sales channels; scheduled reporting |

Each project is filed under the gates it shows, and its card leads with one line of proof.
The tools sit at the foot of a card as "Built with".

## Ideas for showing the agentic work

The owner asked for these. The first is built. The rest draw on work that is not public,
so they wait for his word.

1. **Receipts. Built.** The page lists the pull requests that built it, each with a written
   what, why and risk, and says an agent built it under his direction. Anyone can check it,
   because the repository is public.
2. **A replay of one real piece of work.** One ticket from brief to live: the brief, the
   agent's plan, the diff, the checks, the merge and the deploy, as a timeline to scrub. It
   shows the judgement, which a list of tools cannot.
3. **The numbers.** Work closed, changes merged, how often a gate caught something, and the
   time from ask to live. An employer reads a number first.
4. **The operating manual.** The rules, gates and budgets he gives his agents, as one short
   page beside the enablement guide. It shows he can make agents safe, not only fast.
5. **Small standalone products, each with its own receipts.** The many little things he wants
   to host, each carrying the same strip: what it is, how it was built, how long it took.
6. **A before and after.** One task done by hand and then with agents: time, defects, cost.

Ideas 2 to 4 need facts from his private projects. Nothing from them is on the page.

## The sectioned page

![The sections on a desktop](../prototypes/site/shots/sections.jpg)

| Section | What it does |
|---|---|
| About | Product engineer copy. A particle swarm that spells plan, build, test, ship, with the social links in orbit. On a phone it fills the first screen |
| Shipped | The 26 projects on a curved wall with their screenshots, filtered by gate. Each card leads with its proof |
| How I ship | Work moving down a line through the six gates. A gate opens its proof and the projects that show it |
| Working with agents | What he does with agents, and the receipts |
| Release history | The career as a commit graph: each job a tagged release, each thing shipped a commit |
| Writing | The guide as one book, and the blog's latest posts, as plain links |
| Closing | The swarm again, the way to get in touch, and the education |

The sections are independent, so one can be swapped without touching the rest. What is
real, what is placeholder, the measurements and what it still needs are in the
[prototype's README](../prototypes/site/README.md).

## What was dropped

- **The career tree, 2026-11-11.** One photographic tree that grew as the years were
  dragged, first as the whole site and then as the work history section. The owner really
  did not like it there. The release history replaced it. It is in git history at `beb13db`.
- **The skills globe, 2026-11-11.** Every language and tool as a dot. The gates replaced it,
  because languages are no longer the point.
- **The bookshelf, 2026-11-11.** Books on a wooden shelf that came off it when pointed at.
  The owner liked the idea, but it was poor on a phone and there were only two real things
  to put on it. One book and the blog's posts replaced it.
- **The plain education cards, 2026-11-11.** Three boxes at the foot. A closing section
  replaced them.
- **Photographic scenes.** The owner asked for the page to be super realistic while the tree
  was in it, and the tree and the shelf were rebuilt from photo scans. Both are gone, so
  every scene is drawn.

## The four jobs

Every concept below is judged on the same four things, and each mockup labels them.

| Job | The question it answers |
|---|---|
| **Who** | Who is this, in one look |
| **Timeline** | What happened when, across the four jobs since 2009 |
| **Projects** | What did he build. Room for dozens, and for the next small one |
| **Live** | Open the real thing, running on its own address |

One thread is worth keeping from round one. The work history has one idea in it three
times: game bots in 2009, sync services in 2017, agents now. Each is a thing built to do
the work on its own.

## The six, side by side

![All six concepts on one sheet](concept-mockups/shots/contact-sheet.jpg)

| # | Concept | Who | Timeline | A project is | Adding one costs |
|---|---|---|---|---|---|
| 1 | Growth rings | The whole slab | One ring a year | An inlay in its year's ring | One entry |
| 2 | The rack | The master module | A step sequencer, one step a year | A module with a live screen | One entry |
| 3 | The deck | The character sheet | One deal of the cards | A foil card | One entry |
| 4 | The cabinet of small things | The big box in the middle | Rows are years | A lit box with a tiny scene | One entry, plus a miniature when it earns one |
| 5 | The line map | The station every line ends at | Left to right | A station | One entry |
| 6 | The plot | The sign at the gate | Layers of ground | A plant | One entry |

## Concepts

### 1. Growth rings

![A slab of tree on a bench, glowing inlays set into its rings, a brass arm across it](concept-mockups/shots/01-rings.jpg)

- **The idea.** A slab cut from a tree. One ring a year, 2009 at the heart and this year
  at the bark. The four jobs are bands of colour in the grain. Every project is a glowing
  inlay set into the ring of the year it shipped.
- **How you move.** Zoom is the only control. Zoomed out it is one person. Closer, it is
  years. Closer, one inlay. Closer still, the inlay opens into the live thing.
- **Timeline.** Drag the brass arm inward and the tree un-grows to that year.
- **Why it fits.** Outer rings have more room, and recent years hold more small projects.
  The layout grows the way the work does. Empty sockets on the bark show what is next.
- **Risk.** Text on a circle is hard to read, so names only appear on zoom. A project is a
  dot until someone leans in.

### 2. The rack

![A wall of synth modules with small screens, patched together by coloured cables](concept-mockups/shots/02-rack.jpg)

- **The idea.** A modular synthesiser. Every project is a module with a small screen
  showing it running. Skills are patch cables: pull the TypeScript cable and every module
  it feeds lights up.
- **Timeline.** The bottom row is a step sequencer, one step a year. Press play and the
  playhead runs 2009 to now, lighting each year's modules and playing a note for each. The
  career becomes a loop you can hear.
- **Who.** The master module, top left: name, title and what the whole rack is for.
- **Why it fits.** A new project is a new module in a blank slot. A new skill is a new
  cable. Nothing else on the web looks like it.
- **Risk.** It may read as niche to someone who has never seen a synth. Module faces are
  small, so the screen has to carry the project.

### 3. The deck

![A felt table with foil cards laid out on five coloured mats and a character sheet](concept-mockups/shots/03-deck.jpg)

- **The idea.** Every project is a card with foil that catches the light as it tilts. One
  table deals the same cards four ways: Spread shows everything, Timeline lays them on a
  mat per job, Stacks sorts by skill, and Me flies them into the character sheet.
- **Who.** The character sheet: name, title, strengths as bars, the four jobs as
  campaigns.
- **Projects.** Flip a card for its story. Play opens the live thing. Big work is gold
  foil and a small standalone toy is a common card, so adding one takes a minute.
- **Why it fits.** It stays readable at a hundred projects, and sorting is a deal, not a
  menu.
- **Risk.** With weak motion it is a card grid. The foil, the physics and the deals have
  to be good.

### 4. The cabinet of small things

![A wooden wall cabinet of lit boxes, each holding a miniature scene, with a larger box in the middle](concept-mockups/shots/04-cabinet.jpg)

- **The idea.** A wall cabinet of lit boxes. Each box is one project as a tiny living
  scene: a stove with a fire for the parts store, a rack of blinking servers for the sync
  service. Lean in and the camera goes through the glass into the real thing.
- **Timeline.** Rows are years, newest on top, with a plate on the frame for each.
- **Who.** The big box in the middle: a desk, a figure and a nameplate.
- **Projects.** Dark boxes are reserved for the next ones. A project with no miniature yet
  gets a small screen showing its own front page, so adding one still costs one entry.
- **Why it fits.** The brief is a lot of little things, and this is a wall of little
  things. Every project is visible at once, with its own character.
- **Risk.** The charm depends on the miniatures. Each good one is a small modelling job.

### 5. The line map

![A model transit map on a pale table, coloured lines crossing at white stations](concept-mockups/shots/05-line-map.jpg)

- **The idea.** A transit map built as a model. Time runs left to right. Every line is a
  skill and every station is a project. Where lines cross, one project used them all. The
  jobs are zones shaded under the track.
- **How you move.** Board a train and ride one skill through every project that used it,
  in order. Step off at a station and it opens live.
- **Who.** The station at the right-hand edge, where every line ends.
- **Why it fits.** One picture shows skills, projects and years together, which a list
  cannot.
- **Risk.** It clutters past about forty stations, and it is the quietest of the six. The
  lines in the mockup are illustrative, not a record of each project's stack.

### 6. The plot

![A block of ground cut open, trees on top and roots reaching into coloured layers](concept-mockups/shots/06-plot.jpg)

- **The idea.** A block of ground cut open. Projects grow on top, sized by how much work
  they were. The jobs are the layers underneath, 2009 at the bottom. Each plant's roots
  reach down to the job that fed it.
- **Projects.** Small standalone things live under glass. Seedlings are what comes next.
- **Who.** The sign at the gate.
- **How you move.** Scroll lifts the block apart one layer at a time.
- **Risk.** Plants crowd and hide their names, so it is the weakest of the six at scale.

## Recommendation

**On hold.** The owner set a different direction after this was written: the sectioned
page. What follows was the pick among the six.

**Build 4, the cabinet.** Projects matter most in the brief, and it is the only concept
where every project is visible at once and looks like itself. It also has the strongest
single move: through the glass, into the running thing.

Borrow one idea from 3: let the cabinet re-shelve itself by year, by skill or by kind, the
way the deck re-deals.

**If the cost per project must be near zero, build 3, the deck.** A card needs only its
entry. **For the boldest look, build 1, growth rings.**

## Rules for whichever one wins

- **One file lists the projects.** Title, year, job, skills, weight, live address. Every
  view reads it, the plain page included. Adding a project is one entry.
- **Each small thing stands alone.** It is its own static site or service on its own
  address. The portfolio links to it, and can show it inside the scene: three.js
  `CSS3DRenderer` places a real page in 3D space.
- **The ten-second path.** Résumé, work history and contact are one click from the first
  frame and do not wait for the 3D to load. A recruiter in a hurry never has to play.
- **Real HTML underneath.** Every word lives in the page, not only in the canvas. The
  current site becomes the plain view. This keeps search results and WCAG 2.2 AA: a
  keyboard path through every stop, visible focus, text contrast, no meaning by colour alone.
- **Reduced motion.** `prefers-reduced-motion` gets stills and cuts in place of camera moves.
- **Static and free.** GitHub Pages, as now. No server and no model calls at run time.
- **Proposed budgets, to measure in the prototype.** Text readable before the 3D arrives.
  First scene under 5 MB, the rest loaded on demand. 60 frames a second on a desktop, a
  floor of 30 on a mid-range phone with a lower quality tier, and the plain view when
  WebGL is missing.
- **Stack.** React Three Fiber and drei on the Next.js and React already here. Three's
  WebGPU renderer with its WebGL 2 fallback. Models from Blender as glTF with meshopt
  geometry and KTX2 textures. Lighting baked offline so a phone pays for none.

## First milestone

It runs on localhost and can be looked at: the chosen home, a dozen real projects read
from the one file, and one that opens a real standalone thing. A frame rate read on a
phone comes before any more art.

## What already exists

Three well-known 3D portfolios set what people expect. None of the six repeats them.

- [Bruno Simon](https://bruno-simon.com/): you drive a small car around a world of projects.
- [Henry Heffernan](https://henryheffernan.com/): a 3D desk with a working operating system on the monitor.
- [Jesse Zhou](https://jesse-zhou.com/): a neon ramen shop you orbit and click into.

## Round one, set aside

Seven concepts, 2026-11-11. The owner did not love any of them. They toured a career, and
the brief is a project showcase. The scenes and their write-ups are in git history at
`4ffe8d6`.

![Round one, all seven on one sheet](concept-mockups/shots/round-1-contact-sheet.jpg)

A city that builds itself, a marble run through a career, one desk across five eras, a bot
that plays the site, an exploded PC, a mountain trail, and a control room.

## Repo gaps found while reading

Measured 2026-11-11. These land with the first prototype PR, not on their own.

- **No check runs on a pull request.** `deploy.yml` runs only on a push to `main`.
- **Auto-merge is off** in the repository settings.
- **`npm run lint` is dead.** It calls `next lint`, and Next 16.1.6 has no `lint` command.
- **Tooling pins lag the framework**: `eslint-config-next` 14.1.0 and `@types/react` 18
  beside Next 16 and React 19.
