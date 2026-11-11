// Wires the page: loads the data, and starts each section's scene the first time it comes near the screen.
import { HUE } from './projects.js';

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const near = (node, fn) => { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); fn(); } }, { rootMargin: '400px' }); io.observe(node); };
const data = await (await fetch('./data.json')).json();
const demo = (window.__demo = {});
const capOf = Object.fromEntries(data.caps.map((c) => [c.id, c]));

// ------------------------------------------------------------ about
near($('#about'), async () => {
  (await import('./hero.js')).default($('#about canvas'), [...document.querySelectorAll('#about .moon')]);
});

// ------------------------------------------------------------ shipped: the projects, filed by what they prove
const state = { cap: null };
const match = (p) => !state.cap || p.caps.includes(state.cap);
let gallery = null, line = null;
const chips = $('#shipped .chips'), card = $('#shipped .detail');
function refresh() {
  chips.innerHTML = '';
  [{ id: null, name: 'Everything' }, ...data.caps].forEach((c) => {
    const b = el('button', 'chip', c.name);
    b.setAttribute('aria-pressed', String(state.cap === c.id));
    if (c.hue) b.style.setProperty('--hue', c.hue);
    b.addEventListener('click', () => { state.cap = c.id; refresh(); });
    chips.appendChild(b);
  });
  const shown = data.projects.filter(match).length;
  $('#shipped .count').textContent = state.cap ? `${shown} of ${data.projects.length} show ${capOf[state.cap].role.toLowerCase()}` : `${shown} things shipped`;
  gallery?.filter(match);
  if (card.dataset.id && !match(data.projects[card.dataset.id])) card.hidden = true;
}
function show(p) {
  card.dataset.id = p.id;
  card.style.setProperty('--hue', HUE[p.group]);
  card.innerHTML = `<button class="x" aria-label="Close">×</button>
    <p class="kicker">${p.group}</p><h3>${p.title}</h3>
    ${p.proof ? `<p class="proof">${p.proof}.</p>` : ''}<p>${p.description}</p>
    <div class="tags">${p.caps.map((id) => `<button class="tag cap" data-id="${id}" style="--hue:${capOf[id].hue}">${capOf[id].name}</button>`).join('')}</div>
    <p class="made">Built with ${p.tags.join(', ')}.</p>
    <div class="go">${p.view ? `<a class="btn main" href="${p.view}" target="_blank" rel="noopener">Open it live ↗</a>` : ''}${p.code ? `<a class="btn" href="${p.code}" target="_blank" rel="noopener">Read the code ↗</a>` : ''}${!p.view && !p.code ? '<span class="quiet">Internal work. No public link.</span>' : ''}</div>`;
  card.hidden = false;
  $('.x', card).addEventListener('click', () => { card.hidden = true; });
  card.querySelectorAll('.cap').forEach((b) => b.addEventListener('click', () => { state.cap = b.dataset.id; refresh(); }));
}
refresh();
near($('#shipped'), async () => {
  gallery = (await import('./projects.js')).default($('#shipped canvas'), data.projects, { onPick: show });
  gallery.filter(match);
  $('#shipped .prev').addEventListener('click', () => gallery.step(-1));
  $('#shipped .next').addEventListener('click', () => gallery.step(1));
  demo.pick = (id) => gallery.pick(id);
});
function toShipped(cap, id) {
  state.cap = cap;
  refresh();
  $('#shipped').scrollIntoView({ behavior: 'smooth' });
  if (id !== undefined) setTimeout(() => gallery?.pick(id), 700);
}

// ------------------------------------------------------------ how I ship: the six capabilities, with the proof for each
const how = $('#how .panel');
function capPanel(c) {
  if (!c) {
    how.innerHTML = `<h3>Six gates, in the order work moves</h3>
      <p>A piece of work is planned, built, tested, held to a standard, released and then run. Languages and tools are how each gate gets done. They are not the point.</p>
      <p class="quiet">Pick a gate to see the proof.</p>`;
    return;
  }
  const used = data.projects.filter((p) => p.caps.includes(c.id));
  how.innerHTML = `<p class="kicker" style="color:${c.hue}">${c.role}</p><h3>${c.name}</h3><p>${c.line}</p>
    <ul class="proofs">${c.evidence.map((e) => `<li style="--hue:${c.hue}">${e}</li>`).join('')}</ul>
    <p class="made">Done with ${c.tools.join(', ')}.</p>
    <button class="btn main" id="see">See the ${used.length} projects that show it ↑</button>`;
  $('#see').addEventListener('click', () => toShipped(c.id));
}
capPanel(null);
near($('#how'), async () => {
  line = (await import('./ship.js')).default($('#how canvas'), $('#how .labels'), data.caps, { onPick: capPanel });
  demo.cap = (id) => line.choose(id);
});

// ------------------------------------------------------------ with agents: the receipts
const log = $('#agents .log');
log.innerHTML = data.receipts.map((r) => `<a href="https://github.com/Cellis9421/portfolio/pull/${r.number}" target="_blank" rel="noopener"><span class="n">#${r.number}</span><span class="k">${r.kind}</span><span class="t">${r.title}</span><span class="d">${r.merged}</span></a>`).join('');
$('#agents .tally').textContent = `${data.receipts.length} pull requests`;

// ------------------------------------------------------------ release history
const notes = $('#history .panel');
let graph = null;
function release(r, i) {
  notes.innerHTML = `<p class="kicker mono">${r.version} · ${r.dates}</p><h3>${r.title}</h3><p class="quiet">${r.org}</p>
    <ul class="changes">${r.notes.map((nt) => `<li>${nt}</li>`).join('')}</ul>
    <div class="go"><button class="btn" id="older" ${i === 0 ? 'disabled' : ''}>← Earlier</button><button class="btn" id="newer" ${i === data.releases.length - 1 ? 'disabled' : ''}>Later →</button></div>`;
  $('#older').addEventListener('click', () => graph?.step(-1));
  $('#newer').addEventListener('click', () => graph?.step(1));
}
release(data.releases[data.releases.length - 1], data.releases.length - 1);
near($('#history'), async () => {
  graph = (await import('./releases.js')).default($('#history canvas'), $('#history .labels'), data.releases, { onFocus: release });
  demo.release = (i) => graph.go(i);
});

// ------------------------------------------------------------ guides
const GUIDES = [
  { kind: 'Guide', title: 'Agentic Software Development Enablement Guide', short: 'Agentic Development Guide', blurb: 'A practical guide to enabling software teams with AI and agentic workflows.', hue: '#3b5bdb',
    link: 'https://www.notion.so/Agentic-Software-Development-Enablement-Guide-2c7965a5986780edb657fa92aab449fc?source=copy_link' },
  { kind: 'Blog', title: 'Engineering, AI and building in public', short: 'The Blog', blurb: 'Notes as I go, on engineering and on working with AI.', hue: '#c2410c', link: 'https://blog.calvinellis.io/' },
  { kind: 'Next', title: 'The next guide', short: 'Next guide', blurb: 'A slot on the shelf for the next one.', hue: '#5a6680', link: null },
  { kind: 'Next', title: 'The next article', short: 'Next article', blurb: 'A slot on the shelf for the next one.', hue: '#5a6680', link: null },
  { kind: 'Next', title: 'And the one after', short: 'And after', blurb: 'A slot on the shelf for the next one.', hue: '#5a6680', link: null },
];
const reading = $('#writing .reading');
GUIDES.filter((gd) => gd.link).forEach((gd, i) => {
  const a = el('a', 'read', `<span class="kicker" style="color:${i ? '#ff8f3a' : '#8aa2ff'}">${gd.kind}</span><b>${gd.title}</b><span>${gd.blurb}</span><span class="open">Open ↗</span>`);
  a.href = gd.link; a.target = '_blank'; a.rel = 'noopener';
  a.dataset.i = i;
  reading.appendChild(a);
});
near($('#writing'), async () => {
  const links = [...reading.querySelectorAll('.read')];
  const shelf = (await import('./guides.js')).default($('#writing canvas'), GUIDES, { onHover: (i) => links.forEach((a) => a.classList.toggle('on', Number(a.dataset.i) === i)) });
  links.forEach((a) => {
    a.addEventListener('pointerenter', () => shelf.show(Number(a.dataset.i)));
    a.addEventListener('pointerleave', () => shelf.show(-1));
    a.addEventListener('focus', () => shelf.show(Number(a.dataset.i)));
    a.addEventListener('blur', () => shelf.show(-1));
  });
  demo.book = (i) => shelf.show(i);
});

// ------------------------------------------------------------ nav: mark the section in view
const tabs = [...document.querySelectorAll('nav a[href^="#"]')];
const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) tabs.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === `#${e.target.id}`));
}), { rootMargin: '-45% 0px -45% 0px' });
document.querySelectorAll('main > section').forEach((sec) => spy.observe(sec));
window.__loaded = true;
