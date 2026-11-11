// Builds data.json for the prototype from the site's own config files, so the prototype
// and the live site tell the same story. The page is organised by what a product engineer
// does, not by language: every project is filed under the capabilities it shows.
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

// The six things the page is organised round, in the order work moves through them.
// Every line of evidence is a fact the current site already states.
const CAPS = [
  { id: 'plan', name: 'Plan', role: 'Project management', hue: '#b78cff',
    line: 'Decide what is worth building, cut it into pieces that can ship, and keep several teams pointed the same way.',
    evidence: ['Ran cross-team projects at Cybrary, often as the technical project manager.', 'Led engineering strategy and the team at Stove & Grill Parts as revenue grew from $1M to $10M.',
      'Wrote the migration plan and the test plan for moving checkout from Chargebee to Paddle.', 'Moved 1,000+ pages off Webflow with the URLs kept.'],
    tools: ['Jira', 'Trello', 'Confluence', 'Miro'] },
  { id: 'build', name: 'Build', role: 'Maintainability', hue: '#5cc8ff',
    line: 'Build it so the next person, or the next agent, can change it without fear.',
    evidence: ['Rewrote the Cybrary core application and its marketing site.', 'API clients generated from OpenAPI specs, so a backend change reaches the front-end types on its own.',
      'A form system driven by JSON config and Zod schemas, with 22+ field types.', 'Documented hundreds of workflows and systems, for faster onboarding and for agents to read.'],
    tools: ['TypeScript', 'Next.js', 'React', 'OpenAPI', 'Zod'] },
  { id: 'test', name: 'Test', role: 'Testability', hue: '#7ef0c0',
    line: 'Make it cheap to prove a change works before anyone else has to find out.',
    evidence: ['The form system ships with 65 tests and 100% coverage.', 'The app runs in the browser against deterministic mocked APIs, with no backend.',
      'Type-safe clients and query hooks stay intact under the mocks, so they exercise the real code path.'],
    tools: ['Mock Service Worker', 'TanStack Query', 'TypeScript'] },
  { id: 'assure', name: 'Assure', role: 'Quality assurance', hue: '#ffd54a',
    line: 'Hold a standard and keep holding it: accessibility, permissions, and data that stays right.',
    evidence: ['Took an e-commerce platform to WCAG 2.2 AA: a full audit, the fixes, and a plan to stay compliant.', 'A diagnostics server that watches prices, stock and order status, and says what to fix.',
      'Configurable role-based access across multi-tenant teams.', 'A marketing site that holds 90+ Lighthouse scores.'],
    tools: ['WAVE', 'Lighthouse', 'RBAC'] },
  { id: 'release', name: 'Release', role: 'CI/CD', hue: '#ff8f3a',
    line: 'Make shipping boring: a merge is a deploy, and nobody presses a button.',
    evidence: ['Built CI/CD pipelines that deploy every service and site at Stove & Grill Parts.', 'Scripts that keep code and CMS in step, cutting 95% of manual Contentful setup.',
      'Reporting, diagnostics and label services on Cloud Run, on a schedule.', 'This page deploys on every merge, in about two minutes.'],
    tools: ['GitHub Actions', 'Cloud Run', 'Cloud Scheduler', 'Vercel'] },
  { id: 'run', name: 'Run', role: 'Operations', hue: '#ff6b8a',
    line: 'Stay with it after launch: the data keeps moving and the cost stays sane.',
    evidence: ['Sync services moving catalog, stock and sales between six sales channels.', 'Reports delivered as CSV, PDF, email and Google Sheets.',
      'Ran a cloud-based virtual lab environment for hands-on training.', 'Reworked third-party tools for security, reliability and cost.'],
    tools: ['GCP', 'Shopify', 'Finale Inventory'] },
];

// Which capabilities each project shows, and the one fact that proves it. Facts come from the project's own description.
const FILE = {
  'Enterprise Hub Platform': [['build', 'assure'], 'One dashboard for team owners across several products, with role-based permissions'],
  'Type-Safe API Client Generator': [['build', 'test', 'release'], 'A backend schema change reaches the front-end types on its own'],
  'Dynamic Form System': [['build', 'test', 'assure'], '22+ field types, 65 tests, 100% coverage, WCAG AA'],
  'Multi-Tenancy': [['build'], 'Team selection that persists, validates and scopes every request'],
  'User Checkout': [['plan', 'test', 'release'], 'Payments moved from Chargebee to Paddle, with a migration plan and a test plan'],
  'Immersive LX': [['build', 'run'], 'Video, text, quizzes and hands-on labs for free, paid and enterprise learners'],
  'Enterprise Dashboards': [['build', 'assure'], 'Configurable role-based access and licence management'],
  'User Profiles': [['build'], 'Account settings, visibility and shareable progress'],
  Forums: [['build'], null],
  'Guided Onboarding': [['build', 'plan'], 'New users guided to the part of the product that fits them'],
  'Sales Demos': [['build', 'plan'], 'Sales can show any access level, the reports and the team tools'],
  'Demo Mocks (MSW)': [['test', 'build'], 'The app runs in the browser on deterministic mocked APIs'],
  'Marketing Website (Headless CMS)': [['build', 'assure', 'release'], '35+ reusable blocks and 90+ Lighthouse scores'],
  'Contentful Automation Scripts': [['release', 'build'], '95% of manual CMS setup removed'],
  'Webflow Migration (1000+ Pages)': [['plan', 'release'], '1,000+ pages and images moved by script, URLs kept'],
  'E-commerce Website': [['build', 'assure', 'run'], 'The store a business grew on, from $1M to $10M'],
  'Reporting Server': [['run', 'release'], 'Reports as CSV, PDF, email and Google Sheets, on a schedule'],
  'Diagnostics Server': [['assure', 'run'], 'Watches prices, stock and orders, and says what to fix'],
  CMS: [['build', 'run'], 'One editor over catalog data from two systems'],
  'Accessibility Compliance': [['assure', 'plan'], 'WCAG 2.2 AA: the audit, the fixes, and a plan to stay there'],
  'Label Generation Server': [['run', 'release'], 'From product pick to a printed shelf label'],
  'My Portfolio': [['release', 'build'], 'Static, open source, deploys on every merge'],
  'Discord AI Bot': [['build'], 'Text and image generation inside Discord'],
  'pAInt it': [['build'], 'Art from a text prompt'],
  'Process Manager': [['run'], 'Starts long-running processes and restarts the ones that crash'],
  'Website Builder': [['build'], 'A static site from one JSON file'],
};
const SHOTS = {
  'Enterprise Hub Platform': 'cybrary_dashboard_hub.png', 'User Checkout': 'cybrary_checkout.png', 'Immersive LX': 'cybrary_immersive.png',
  'Enterprise Dashboards': 'cybrary_dashboard.png', 'User Profiles': 'cybrary_profile.png', Forums: 'cybrary_forums.png',
  'Guided Onboarding': 'cybrary_onboarding.png', 'Sales Demos': 'cybrary_sales_demo.png', 'Demo Mocks (MSW)': 'cybrary_msw_demo.png',
  'E-commerce Website': 'sgpfl_homepage.png', 'Reporting Server': 'sgpfl_ac2_reports.png', 'Diagnostics Server': 'sgpfl_ac2_diagnostics.png',
  CMS: 'sgpfl_ac2_app.png', 'Accessibility Compliance': 'sgpfl_homepage_wave.png', 'Label Generation Server': 'sgpfl_label_pdf.png',
  'My Portfolio': 'portfolio.png', 'Discord AI Bot': 'discord_ai_bot.png', 'pAInt it': 'paint_it.png', 'Process Manager': 'process_manager.png',
  'Website Builder': 'website_builder.png',
};

const projects = load('PROJECTS.tsx', 'PROJECTS').map((p, id) => {
  const filed = FILE[p.title];
  if (!filed) throw new Error(`"${p.title}" is not filed under any capability. Add it to FILE.`);
  const group = p.subtitle.startsWith('Cybrary') ? 'Cybrary' : p.subtitle.startsWith('Stove') ? 'Stove & Grill Parts' : 'Personal';
  const shot = SHOTS[p.title];
  if (shot && !existsSync(join(root, 'public', 'img', 'screenshots', shot))) throw new Error(`missing screenshot ${shot}`);
  return { id, title: p.title, group, description: p.description, caps: filed[0], proof: filed[1], tags: p.tags ?? [], view: p.viewLink ?? null, code: p.codeLink ?? null, shot: shot ?? null };
});

// The career as releases, oldest first.
const short = (company) => company.replace(/\s*\(.*\)$/, '');
const releases = load('WORK_HISTORY.tsx', 'WORK_HISTORY').reverse().map((job, i) => ({
  version: `v${i + 1}.0`, year: Number(job.dates.match(/\d{4}/)[0]), title: job.title, org: short(job.company), dates: job.dates.replace('→', 'to'), notes: job.bullets,
}));

// Receipts: the pull requests that built this page. Kept from the last run when the GitHub CLI is not to hand.
let receipts = [];
try {
  const raw = execSync('gh pr list --repo Cellis9421/portfolio --state merged --limit 40 --json number,title,mergedAt', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  receipts = JSON.parse(raw).filter((pr) => pr.number >= 3).map((pr) => ({ number: pr.number, title: pr.title.replace(/^\w+: /, ''), kind: pr.title.split(':')[0], merged: pr.mergedAt.slice(0, 10) }));
} catch {
  try { receipts = JSON.parse(readFileSync(join(here, 'data.json'), 'utf8')).receipts ?? []; } catch { /* first run without the CLI: no receipts */ }
}

const education = load('EDUCATION.tsx', 'EDUCATION');

// The blog's latest posts, from its own feed. Kept from the last run when the feed cannot be reached.
let posts = [];
try {
  const feed = await (await fetch('https://blog.calvinellis.io/feeds/posts/default?alt=json&max-results=3')).json();
  posts = feed.feed.entry.map((e) => ({ title: e.title.$t, url: e.link.find((l) => l.rel === 'alternate').href,
    when: new Date(e.published.$t).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }));
} catch {
  try { posts = JSON.parse(readFileSync(join(here, 'data.json'), 'utf8')).posts ?? []; } catch { /* first run offline: no posts */ }
}

writeFileSync(join(here, 'data.json'), `${JSON.stringify({ caps: CAPS, projects, releases, receipts, education, posts }, null, 1)}\n`);
console.log(`[build-data] ${projects.length} projects, ${CAPS.length} capabilities, ${releases.length} releases, ${receipts.length} receipts, ${posts.length} posts`);
