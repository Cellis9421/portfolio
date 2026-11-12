// Builds data.json for the prototype from the site's own config files, so the prototype
// and the live site tell the same story. The page is organised by how the work gets done,
// not by language or by feature.
// Run from the repo root: node prototypes/site/build-data.mjs
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');

/** The config files are plain object literals behind a type annotation. Strip the TypeScript and evaluate. */
function load(file, name) {
  const src = readFileSync(join(root, 'src', 'configs', file), 'utf8')
    .replace(/^import .*$/gm, '')
    .replace(new RegExp(`const ${name}: \\w+\\[\\] =`), 'return')
    .replace(new RegExp(`export default ${name};`), '');
  return new Function(src)();
}

// The loop: five stations in the order work goes round them. The last feeds the first.
// `agents` and `me` say who does what. `evidence` is facts the current site already states.
const CAPS = [
  { id: 'plan', name: 'Plan', role: 'From what production says', hue: '#b78cff',
    line: 'Decide what is worth building next, from evidence, and write it down so an agent can run with it.',
    agents: 'Read the code and the telemetry first, then break the brief into pieces small enough to ship.',
    me: 'I choose what goes round the loop, and write the brief: the outcome, the limits, and how we will know it worked.',
    evidence: ['Ran cross-team projects at Cybrary, often as the technical project manager.', 'Led engineering strategy and the team at Stove & Grill Parts as revenue grew from $1M to $10M.',
      'Wrote the migration plan and the test plan for moving checkout from Chargebee to Paddle.'],
    tools: ['Jira', 'Trello', 'Confluence', 'Miro'] },
  { id: 'build', name: 'Build', role: 'Test first', hue: '#5cc8ff',
    line: 'Test-driven. The failing test is written before the code, so every change arrives with its own proof.',
    agents: 'Write the failing test, then the code that passes it, then tidy. One piece of work, one branch.',
    me: 'Hands off. The rules they build by are written down before they start, and I answer only what they cannot decide.',
    evidence: ['A form system that ships with 65 tests and 100% coverage.', 'API clients generated from OpenAPI specs, so a backend change reaches the front-end types on its own.',
      'The app runs in the browser against deterministic mocked APIs, with no backend.'],
    tools: ['TypeScript', 'Next.js', 'React', 'Zod', 'Mock Service Worker'] },
  { id: 'assure', name: 'Assure', role: 'End to end, in staging', hue: '#ffd54a',
    line: 'Prove it does the thing it is supposed to do, end to end, in a safe copy of production before it goes near the real one.',
    agents: 'Run the end-to-end tests against staging, and fix what fails before anyone else sees it.',
    me: 'I own the standard: what has to be true before anything ships.',
    evidence: ['Took an e-commerce platform to WCAG 2.2 AA: a full audit, the fixes, and a plan to stay compliant.', 'Configurable role-based access across multi-tenant teams.',
      'A marketing site that holds 90+ Lighthouse scores.'],
    tools: ['WAVE', 'Lighthouse', 'RBAC'] },
  { id: 'release', name: 'Release', role: 'CI/CD', hue: '#ff8f3a',
    line: 'Make shipping boring: green checks merge it, and a merge deploys it.',
    agents: 'Nobody presses a button. The pipeline does it, the same way every time.',
    me: 'Hands off. What counts as green was decided long before.',
    evidence: ['Built CI/CD pipelines that deploy every service and site at Stove & Grill Parts.', 'Scripts that keep code and CMS in step, cutting 95% of manual Contentful setup.',
      'This page deploys on every merge, in about two minutes.'],
    tools: ['GitHub Actions', 'Cloud Run', 'Cloud Scheduler', 'Vercel'] },
  { id: 'run', name: 'Run', role: 'Observability', hue: '#ff6b8a',
    line: 'Watch it in production. What the telemetry says becomes the next plan, and the loop closes.',
    agents: 'Turn telemetry and alerts from production into new work, already sorted.',
    me: 'I read what production says, and choose what goes round next.',
    evidence: ['A monitoring server that watches prices, stock and order status, and says what to fix.', 'Sync services moving catalog, stock and sales between six sales channels.',
      'Reports delivered as CSV, PDF, email and Google Sheets.'],
    tools: ['GCP', 'Shopify', 'Finale Inventory'] },
];

// Shipped: a dozen bodies of work, in plain words. The site's config lists 26 feature-level projects,
// which is too fine a grain for this page, so each entry here names the config projects it stands for.
// `history` marks one that comes from the work history, not the project list.
const SHIPPED = [
  { title: 'A training platform for whole companies', group: 'Cybrary', caps: ['build', 'assure'], shot: 'cybrary_dashboard_hub.png',
    proof: 'Manage people, assign learning, read the results',
    description: 'The dashboard a team owner works in: manage users, assign learning and view reports across several products. Teams sit inside groups inside organisations, each with its own roles, permissions and licences.',
    from: ['Enterprise Hub Platform', 'Enterprise Dashboards', 'Multi-Tenancy'], tags: ['Next.js', 'TypeScript', 'Material-UI', 'TanStack Query'], links: [['Open it live', 'https://app.cybrary.it/']] },
  { title: 'Courses with hands-on labs', group: 'Cybrary', caps: ['build', 'run'], shot: 'cybrary_immersive.png',
    proof: 'Video, quizzes and live virtual labs',
    description: 'The learning experience itself: video and text lessons, assessments and hands-on virtual labs, with progress tracking, certificates and recommendations. Onboarding, profiles and forums sit round it.',
    from: ['Immersive LX', 'User Profiles', 'Forums', 'Guided Onboarding'], tags: ['React', 'TypeScript'], links: [['Open it live', 'https://app.cybrary.it/']] },
  { title: 'A marketing site the marketers run', group: 'Cybrary', caps: ['plan', 'build', 'assure', 'release'], shot: null,
    proof: '35+ building blocks, 90+ Lighthouse scores, and 1,000+ pages moved over by script',
    description: 'The marketing site rebuilt on a headless CMS, so pages are assembled from blocks without an engineer. Scripts keep the code and the CMS in step, which removed 95% of the manual setup, and moved 1,000+ pages and images off Webflow with the URLs kept.',
    from: ['Marketing Website (Headless CMS)', 'Contentful Automation Scripts', 'Webflow Migration (1000+ Pages)'], tags: ['Next.js', 'Contentful', 'TypeScript'], links: [] },
  { title: 'A demo mode for sales', group: 'Cybrary', caps: ['build', 'plan'], shot: 'cybrary_sales_demo.png',
    proof: 'Any role, report or tool, on data that never changes',
    description: 'A way for sales to show the product to a prospect: any access level, the reporting and the team tools. It runs in the browser on mocked APIs with deterministic data, while the real clients and queries stay intact underneath.',
    from: ['Sales Demos', 'Demo Mocks (MSW)'], tags: ['Mock Service Worker', 'TanStack Query', 'TypeScript'], links: [] },
  { title: 'Building blocks for a product team', group: 'Cybrary', caps: ['build'], shot: null,
    proof: 'Type-safe API clients, and a form system with 65 tests and 100% coverage',
    description: 'The shared pieces other engineers build on. API clients are generated from the OpenAPI specs, so a backend change reaches the front-end types on its own. Forms are built from JSON config and Zod schemas, with 22+ field types, accessible to WCAG AA.',
    from: ['Type-Safe API Client Generator', 'Dynamic Form System'], tags: ['OpenAPI', 'TypeScript', 'Zod', 'React Hook Form'], links: [] },
  { title: 'An online store that grew tenfold', group: 'Stove & Grill Parts', caps: ['build', 'assure', 'run'], shot: 'sgpfl_homepage.png',
    proof: 'From $1M to $10M, accessible to WCAG 2.2 AA',
    description: "A custom storefront on Shopify's checkout, with a funnel that cuts wrong orders and product pages built to convert. It was audited and fixed to WCAG 2.2 AA, with a plan to stay there.",
    from: ['E-commerce Website', 'Accessibility Compliance'], tags: ['Shopify', 'Liquid', 'WCAG 2.2 AA'], links: [['Open it live', 'https://pellet-stove-parts-4less.com/']] },
  { title: 'Reports the business runs on', group: 'Stove & Grill Parts', caps: ['run', 'release'], shot: 'sgpfl_ac2_reports.png',
    proof: 'CSV, PDF, email and Google Sheets, on a schedule',
    description: 'A reporting server that pulls from Shopify, the inventory system and other services, with filtering, sorting and custom formulas. Reports arrive by email, by download or straight into Google Sheets.',
    from: ['Reporting Server'], tags: ['GCP', 'Cloud Run', 'Shopify', 'Finale Inventory'], links: [] },
  { title: 'Monitoring that catches it first', group: 'Stove & Grill Parts', caps: ['run', 'assure'], shot: 'sgpfl_ac2_diagnostics.png',
    proof: 'Flags price, stock and order problems to fix',
    description: 'A monitoring server for the health of the catalog. It checks prices, stock levels and order status, and surfaces each problem in a way that is easy to fix.',
    from: ['Diagnostics Server'], tags: ['GCP', 'Cloud Run', 'Shopify'], links: [] },
  { title: 'Six sales channels kept in step', group: 'Stove & Grill Parts', caps: ['run', 'release'], shot: null, history: true,
    proof: 'Catalog, stock and sales moving between six channels',
    description: 'Sync services that move the catalog, the inventory and the sales between Shopify, Amazon, Walmart, eBay, Etsy and Google.',
    from: [], tags: ['Shopify', 'Amazon', 'Walmart', 'eBay', 'Etsy', 'Google'], links: [] },
  { title: 'Catalog and warehouse tools', group: 'Stove & Grill Parts', caps: ['build', 'run'], shot: 'sgpfl_ac2_app.png',
    proof: 'One editor over two systems. Labels, pick to print',
    description: 'A product editor that extends catalog data held in two systems, and a label server that takes a product pick to a printed shelf label in the warehouse.',
    from: ['CMS', 'Label Generation Server'], tags: ['Shopify', 'Finale Inventory', 'GCP'], links: [] },
  { title: 'Side projects', group: 'Personal', caps: ['build'], shot: 'paint_it.png',
    proof: 'A Discord bot and an art app, on generative AI',
    description: 'A Discord bot that generates text and images, an app that makes art from a prompt, a process manager that restarts what crashes, and a site builder that works from one JSON file.',
    from: ['Discord AI Bot', 'pAInt it', 'Process Manager', 'Website Builder'], tags: ['Python', 'OpenAI', 'Next.js'],
    links: [['The bot', 'https://github.com/Cellis9421/discord-ai-bot']] },
  { title: 'This portfolio', group: 'Personal', caps: ['release', 'build'], shot: 'portfolio.png',
    proof: 'Open source, static, and live on every merge',
    description: 'The site you are on: static, open source and deployed on every merge. The page you are reading was built by an AI agent under direction, one pull request at a time.',
    from: ['My Portfolio'], tags: ['Next.js', 'TypeScript', 'three.js'], links: [['Read the code', 'https://github.com/Cellis9421/portfolio']] },
];
// In the config, on purpose not on the page. A feature, not a body of work.
const LEFT_OUT = ['User Checkout'];

// The timeline: what he was doing, era by era, and what there was to do it with. `job` names the work
// history entry an era opens with, and its years are read from there. The two AI eras sit inside or after
// the last job, so they carry their own year: 2023 is his first public AI project, 2026 the public rule packs.
// Every line is a fact from the work history, the project list, his public GitHub or his blog.
const ERAS = [
  { job: 'Game Bot Developer', hue: '#9a7cf5', title: 'Bots that played the game', role: 'Game bot developer, independent',
    work: ['Wrote bots in Java that played video games on their own and finished long, multi-step tasks.', 'Ran scripts on top of the game client, or inside it, using reflection and injection.', 'Fed a bot its next move from outside APIs.'],
    side: [], tools: ['Java', 'Reflection', 'Injection', 'APIs'], shows: () => false, links: [] },
  { job: 'Contract Software Engineer', hue: '#a488ff', title: 'Systems for small businesses', role: 'Contract software engineer, independent',
    work: ['Built custom content systems and marketing automation for small businesses, to run their reporting, their tasks and their customer follow-up.', "Built web apps that tied in each client's CRM and analytics dashboards.", 'Chose the technology each business could afford to run.'],
    side: [], tools: [], shows: () => false, links: [] },
  { job: 'Lead Software Engineer', hue: '#8f9dff', title: 'A store that grew tenfold', role: 'Lead software engineer, Stove & Grill Parts For Less',
    work: ['Led the engineering as revenue grew from $1M to $10M a year.', 'Rewrote the store on Shopify, accessible to WCAG 2.2 AA.', 'Built sync services that moved catalog, stock and sales between Shopify, Amazon, Walmart, eBay, Etsy and Google.',
      'Built the reporting and diagnostics server the business ran on.', 'Put every service and site on automated deployment.'],
    side: [], tools: ['Shopify', 'Liquid', 'JavaScript', 'GitHub Actions', 'Cloud Run'], shows: (p) => p.group === 'Stove & Grill Parts', links: [] },
  { job: 'Principal Software Engineer', hue: '#6fb8ff', title: 'A platform for whole companies', role: 'Principal software engineer, Cybrary',
    work: ['Rewrote the marketing site and the core application in Next.js and TypeScript.', 'Built multi-tenancy, configurable role-based access, and a sales demo mode on mocked APIs.', 'Ran cross-team projects, often as the technical project manager.',
      'Kept a cloud-based virtual lab environment running.'],
    side: [], tools: ['Next.js', 'TypeScript', 'Vercel', 'Tailwind', 'Material UI', 'Mock Service Worker'], shows: (p) => p.group === 'Cybrary', links: [] },
  { year: 2023, years: '2023 onward', hue: '#5cc8ff', title: 'Code with an assistant', role: 'AI enablement, at Cybrary and on the side',
    work: ['Wrote the rules and the documentation that let a coding assistant understand a codebase before it changes it.', 'Organised and led company-wide AI enablement training.', 'Coached engineers one to one, finding where AI speeds each of them up.'],
    side: [{ text: 'A Discord bot that writes text and makes images.', url: 'https://github.com/Cellis9421/discord-ai-bot' }, { text: 'An app that makes art from a prompt.' }, { text: 'Wrote up what AI programming assistants are good at.', post: 'AI Programming Assistants' }],
    tools: ['Cursor', 'OpenAI', 'DALL-E', 'Confluence', 'Miro'], shows: (p) => p.title === 'Side projects', links: [] },
  { year: 2026, years: 'Now', hue: '#ffd54a', title: 'Agents write the code', role: 'Product engineer',
    work: ['Agents write the code and manage it. I decide what gets built, and what counts as done.', 'Wrote rule packs that tell coding agents how to work, and a command-line tool to manage them.', (d) => `Had an agent build this page: ${d.receipts} pull requests, each with a written what, why and risk.`],
    side: [], tools: ['AI agents', 'Rule packs', 'Pull requests', 'CI/CD'], shows: (p) => p.title === 'This portfolio',
    links: [['See how I ship ↓', '#how'], ['The receipts ↓', '#agents'], ['The rule packs ↗', 'https://github.com/Cellis9421/rule-manager']] },
];

const config = load('PROJECTS.tsx', 'PROJECTS').map((p) => p.title);
const placed = new Set([...SHIPPED.flatMap((sh) => sh.from), ...LEFT_OUT]);
for (const t of config) if (!placed.has(t)) throw new Error(`"${t}" is in the site's config but not placed. Add it to an entry's "from", or to LEFT_OUT.`);
for (const t of placed) if (!config.includes(t)) throw new Error(`"${t}" is named here but is not in the site's config.`);
const projects = SHIPPED.map((sh, id) => {
  if (sh.shot && !existsSync(join(root, 'public', 'img', 'screenshots', sh.shot))) throw new Error(`missing screenshot ${sh.shot}`);
  for (const c of sh.caps) if (!CAPS.some((cap) => cap.id === c)) throw new Error(`"${sh.title}" names a station that does not exist: ${c}`);
  return { id, title: sh.title, group: sh.group, proof: sh.proof, description: sh.description, caps: sh.caps, tags: sh.tags, links: sh.links, shot: sh.shot };
});

const jobs = load('WORK_HISTORY.tsx', 'WORK_HISTORY');
const education = load('EDUCATION.tsx', 'EDUCATION');
const last = () => { try { return JSON.parse(readFileSync(join(here, 'data.json'), 'utf8')); } catch { return {}; } };

// Receipts: the pull requests that built this page. Kept from the last run when the GitHub CLI is not to hand.
let receipts = [];
try {
  const raw = execSync('gh pr list --repo Cellis9421/portfolio --state merged --limit 60 --json number,title,mergedAt', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  receipts = JSON.parse(raw).filter((pr) => pr.number >= 3).map((pr) => ({ number: pr.number, title: pr.title.replace(/^\w+: /, ''), kind: pr.title.split(':')[0], merged: pr.mergedAt.slice(0, 10) }));
} catch { receipts = last().receipts ?? []; }

// The blog's latest posts, from its own feed. Kept from the last run when the feed cannot be reached.
let posts = [];
try {
  const feed = await (await fetch('https://blog.calvinellis.io/feeds/posts/default?alt=json&max-results=3')).json();
  posts = feed.feed.entry.map((e) => ({ title: e.title.$t, url: e.link.find((l) => l.rel === 'alternate').href,
    when: new Date(e.published.$t).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }));
} catch { posts = last().posts ?? []; }

// The eras, oldest first. One that opens with a job takes its years from the work history, so the two cannot drift.
for (const job of jobs) if (!ERAS.some((e) => e.job === job.title)) throw new Error(`"${job.title}" is in the work history but opens no era.`);
const eras = ERAS.map((e) => {
  let { year, years } = e;
  if (e.job) {
    const job = jobs.find((j) => j.title === e.job);
    if (!job) throw new Error(`no "${e.job}" in the work history`);
    const [from, to] = job.dates.match(/\d{4}/g).map(Number);
    year = from; years = `${from} to ${to}`;
  }
  const side = e.side.map((sd) => ({ text: sd.text, url: sd.url ?? posts.find((p) => sd.post && p.title.startsWith(sd.post))?.url ?? null }));
  const work = e.work.map((w) => (typeof w === 'function' ? w({ receipts: receipts.length }) : w));
  return { year, years, hue: e.hue, title: e.title, role: e.role, work, side, tools: e.tools, shipped: projects.filter(e.shows).map((p) => p.id), links: e.links };
});
for (let i = 1; i < eras.length; i++) if (eras[i].year < eras[i - 1].year) throw new Error(`era "${eras[i].title}" starts before the one above it`);

writeFileSync(join(here, 'data.json'), `${JSON.stringify({ caps: CAPS, projects, eras, receipts, education, posts }, null, 1)}\n`);
console.log(`[build-data] ${eras.length} eras from ${jobs.length} jobs, ${projects.length} bodies of work from ${config.length} config projects, ${CAPS.length} stations, ${receipts.length} receipts, ${posts.length} posts`);
