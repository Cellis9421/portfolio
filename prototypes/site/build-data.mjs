// Builds data.json for the prototype from the site's own config files, so the prototype
// and the live site show the same projects and the same work history.
// Run from the repo root: node prototypes/site/build-data.mjs
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

// Screenshots already in public/img/screenshots, matched to projects by hand.
const SHOTS = {
  'Enterprise Hub Platform': 'cybrary_dashboard_hub.png', 'User Checkout': 'cybrary_checkout.png', 'Immersive LX': 'cybrary_immersive.png',
  'Enterprise Dashboards': 'cybrary_dashboard.png', 'User Profiles': 'cybrary_profile.png', Forums: 'cybrary_forums.png',
  'Guided Onboarding': 'cybrary_onboarding.png', 'Sales Demos': 'cybrary_sales_demo.png', 'Demo Mocks (MSW)': 'cybrary_msw_demo.png',
  'E-commerce Website': 'sgpfl_homepage.png', 'Reporting Server': 'sgpfl_ac2_reports.png', 'Diagnostics Server': 'sgpfl_ac2_diagnostics.png',
  CMS: 'sgpfl_ac2_app.png', 'Accessibility Compliance': 'sgpfl_homepage_wave.png', 'Label Generation Server': 'sgpfl_label_pdf.png',
  'My Portfolio': 'portfolio.png', 'Discord AI Bot': 'discord_ai_bot.png', 'pAInt it': 'paint_it.png', 'Process Manager': 'process_manager.png',
  'Website Builder': 'website_builder.png',
};
const KINDS = {
  language: ['TypeScript', 'Python', 'PHP', 'Liquid', 'Java'],
  framework: ['Next.js', 'React', 'Material-UI', 'TailwindCSS', 'React Hook Form', 'Zod', 'TanStack Query', 'MSW', 'Context API', 'OpenAPI'],
  platform: ['Shopify', 'GCP', 'Contentful', 'Paddle', 'Chargebee', 'Finale Inventory', 'Google Sheets', 'Discord', 'Headless CMS', 'API'],
  ai: ['AI', 'OpenAI', 'DALL-E', 'Bot'],
};
const kindOf = (tag) => Object.keys(KINDS).find((k) => KINDS[k].includes(tag)) ?? 'practice';

const projects = load('PROJECTS.tsx', 'PROJECTS').map((p, id) => {
  const group = p.subtitle.startsWith('Cybrary') ? 'Cybrary' : p.subtitle.startsWith('Stove') ? 'Stove & Grill Parts' : 'Personal';
  const shot = SHOTS[p.title];
  if (shot && !existsSync(join(root, 'public', 'img', 'screenshots', shot))) throw new Error(`missing screenshot ${shot}`);
  return { id, title: p.title, group, description: p.description, tags: p.tags ?? [], view: p.viewLink ?? null, code: p.codeLink ?? null, shot: shot ?? null };
});

const count = new Map();
projects.forEach((p) => p.tags.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
const skills = [...count.keys()].map((name) => ({ name, count: count.get(name), kind: kindOf(name) }));
const at = new Map(skills.map((s, i) => [s.name, i]));
const pair = new Map();
projects.forEach((p) => p.tags.forEach((a, i) => p.tags.slice(i + 1).forEach((b) => {
  const key = [at.get(a), at.get(b)].sort((x, y) => x - y).join(',');
  pair.set(key, (pair.get(key) ?? 0) + 1);
})));
const links = [...pair].map(([key, weight]) => [...key.split(',').map(Number), weight]);

const work = load('WORK_HISTORY.tsx', 'WORK_HISTORY');
writeFileSync(join(here, 'data.json'), `${JSON.stringify({ projects, skills, links, work }, null, 1)}\n`);
console.log(`[build-data] ${projects.length} projects, ${skills.length} skills, ${links.length} links, ${work.length} jobs`);
