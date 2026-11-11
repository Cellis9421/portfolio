// Copies the prototypes that are meant to be looked at into public/preview/, which the
// site's build publishes as calvinellis.io/preview/. The copies are generated: edit the
// files under prototypes/, then run this again.
// Run from the repo root: node prototypes/publish.mjs
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'public', 'preview');
// Only what the page needs to run. Capture scripts, stills and build tools stay behind.
const FILES = {
  site: ['index.html', 'main.js', 'stage.js', 'hero.js', 'projects.js', 'skills.js', 'guides.js', 'data.json'],
  'career-tree': ['index.html'],
};

rmSync(out, { recursive: true, force: true });
let count = 0;
for (const [folder, files] of Object.entries(FILES)) {
  mkdirSync(join(out, folder), { recursive: true });
  for (const file of files) { cpSync(join(here, folder, file), join(out, folder, file)); count++; }
}
writeFileSync(join(out, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=site/"><title>Portfolio prototype</title></head>
<body><p><a href="site/">Open the prototype</a></p></body></html>
`);
console.log(`[publish] ${count + 1} files written to public/preview/`);
