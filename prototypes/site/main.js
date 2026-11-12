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

// ------------------------------------------------------------ shipped: a dozen bodies of work, filed by the station they show
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
  $('#shipped .count').textContent = state.cap ? `${shown} of ${data.projects.length} show the ${capOf[state.cap].name.toLowerCase()} station` : `${shown} bodies of work`;
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
    <div class="go">${p.links.map(([label, url], i) => `<a class="btn${i ? '' : ' main'}" href="${url}" target="_blank" rel="noopener">${label} ↗</a>`).join('') || '<span class="quiet">Internal work. No public link.</span>'}</div>`;
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

// ------------------------------------------------------------ how I ship: the loop, with who does what at each station
const how = $('#how .panel');
function capPanel(c) {
  if (!c) {
    how.innerHTML = `<h3>One loop, five stations</h3>
      <p>Building starts with a failing test. Nothing is released until it passes end to end in staging. What production says comes back as the next plan.</p>
      <p class="quiet">Pick a station to see who does what, and the proof.</p>`;
    return;
  }
  const used = data.projects.filter((p) => p.caps.includes(c.id));
  how.innerHTML = `<p class="kicker" style="color:${c.hue}">${c.role}</p><h3>${c.name}</h3><p>${c.line}</p>
    <dl class="who"><div><dt><i class="dot"></i>Agents</dt><dd>${c.agents}</dd></div><div><dt><i class="gem"></i>Me</dt><dd>${c.me}</dd></div></dl>
    <ul class="proofs">${c.evidence.map((e) => `<li style="--hue:${c.hue}">${e}</li>`).join('')}</ul>
    <p class="made">Done with ${c.tools.join(', ')}.</p>
    <button class="btn main" id="see">See the ${used.length} bodies of work that show it ↓</button>`;
  $('#see').addEventListener('click', () => toShipped(c.id));
}
capPanel(null);
near($('#how'), async () => {
  line = (await import('./ship.js')).default($('#how canvas'), $('#how .labels'), data.caps, { onPick: capPanel }, { rounds: data.receipts.length });
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

// ------------------------------------------------------------ writing: the guide as a book, and the latest posts
$('#writing .list').innerHTML = data.posts.map((p) => `<a class="post" href="${p.url}" target="_blank" rel="noopener"><b>${p.title}</b><span>${p.when}</span><i aria-hidden="true">↗</i></a>`).join('');
if (matchMedia('(hover: hover)').matches) {  // with a mouse, the book turns to face the pointer
  const book = $('#writing .book');
  $('#writing').addEventListener('pointermove', (e) => {
    const r = book.getBoundingClientRect(), dx = (e.clientX - (r.left + r.width / 2)) / innerWidth, dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    book.style.setProperty('--ry', `${Math.max(-40, Math.min(10, -26 + dx * 60)).toFixed(1)}deg`);
    book.style.setProperty('--rx', `${Math.max(-8, Math.min(14, 5 - dy * 26)).toFixed(1)}deg`);
  });
  $('#writing').addEventListener('pointerleave', () => { book.style.removeProperty('--ry'); book.style.removeProperty('--rx'); });
}

// ------------------------------------------------------------ closing: the swarm again, and where he studied
$('#close .edu').innerHTML = `<p class="kicker">Education</p>${data.education.map((s) => `<div class="school"><h3>${s.institution}</h3><p class="where">${s.location}</p>
  <div class="fields">${s.fields.map((f) => `<span>${f}</span>`).join('')}</div></div>`).join('')}`;
near($('#close'), async () => {
  (await import('./hero.js')).default($('#close canvas'), [], { words: ["Let's talk"], hold: 3.4, first: 1.4, share: 0.6, x: 1.6, y: -0.9 });
});

// ------------------------------------------------------------ nav: mark the section in view
const tabs = [...document.querySelectorAll('nav a[href^="#"]')];
const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) tabs.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === `#${e.target.id}`));
}), { rootMargin: '-45% 0px -45% 0px' });
document.querySelectorAll('main > section').forEach((sec) => spy.observe(sec));
window.__loaded = true;
