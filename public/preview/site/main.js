// Wires the page: loads the data, and starts each section's scene the first time it comes near the screen.
import { HUE } from './projects.js';
import { KIND } from './skills.js';

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const near = (node, fn) => { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); fn(); } }, { rootMargin: '400px' }); io.observe(node); };
const data = await (await fetch('./data.json')).json();
const demo = (window.__demo = {});

// ------------------------------------------------------------ about
near($('#about'), async () => {
  (await import('./hero.js')).default($('#about canvas'), [...document.querySelectorAll('#about .moon')]);
});

// ------------------------------------------------------------ projects
const state = { group: 'All', skill: null };
const groups = ['All', 'Cybrary', 'Stove & Grill Parts', 'Personal', 'AI'];
const match = (p) => (state.group === 'All' || (state.group === 'AI' ? p.tags.some((t) => ['AI', 'OpenAI', 'DALL-E'].includes(t)) : p.group === state.group)) && (!state.skill || p.tags.includes(state.skill));
let gallery = null, globe = null;
const chips = $('#projects .chips'), card = $('#projects .detail');
function refresh() {
  chips.innerHTML = '';
  groups.forEach((gname) => {
    const b = el('button', 'chip', gname);
    b.setAttribute('aria-pressed', String(state.group === gname));
    b.addEventListener('click', () => { state.group = gname; refresh(); });
    chips.appendChild(b);
  });
  if (state.skill) {
    const b = el('button', 'chip skill-chip', `Skill: ${state.skill} <span aria-hidden="true">×</span>`);
    b.setAttribute('aria-label', `Clear the ${state.skill} filter`);
    b.addEventListener('click', () => { state.skill = null; refresh(); });
    chips.appendChild(b);
  }
  const shown = data.projects.filter(match).length;
  $('#projects .count').textContent = shown === data.projects.length ? `${shown} projects` : `${shown} of ${data.projects.length} projects`;
  gallery?.filter(match);
  if (card.dataset.id && !match(data.projects[card.dataset.id])) card.hidden = true;
}
function show(p) {
  card.dataset.id = p.id;
  card.style.setProperty('--hue', HUE[p.group]);
  card.innerHTML = `<button class="x" aria-label="Close">×</button>
    <p class="kicker">${p.group}</p><h3>${p.title}</h3><p>${p.description}</p>
    <div class="tags">${p.tags.map((t) => `<button class="tag">${t}</button>`).join('')}</div>
    <div class="go">${p.view ? `<a class="btn main" href="${p.view}" target="_blank" rel="noopener">Open it live ↗</a>` : ''}${p.code ? `<a class="btn" href="${p.code}" target="_blank" rel="noopener">Read the code ↗</a>` : ''}${!p.view && !p.code ? '<span class="quiet">Internal work. No public link.</span>' : ''}</div>`;
  card.hidden = false;
  $('.x', card).addEventListener('click', () => { card.hidden = true; });
  card.querySelectorAll('.tag').forEach((b) => b.addEventListener('click', () => { state.skill = b.textContent; state.group = 'All'; refresh(); }));
}
refresh();
near($('#projects'), async () => {
  gallery = (await import('./projects.js')).default($('#projects canvas'), data.projects, { onPick: show });
  gallery.filter(match);
  $('#projects .prev').addEventListener('click', () => gallery.step(-1));
  $('#projects .next').addEventListener('click', () => gallery.step(1));
  demo.pick = (id) => gallery.pick(id);
});
function toProjects(skill, id) {
  state.skill = skill; state.group = 'All';
  refresh();
  $('#projects').scrollIntoView({ behavior: 'smooth' });
  if (id !== undefined) setTimeout(() => gallery?.pick(id), 700);
}

// ------------------------------------------------------------ skills
const about = $('#skills .panel');
const legend = Object.entries({ language: 'Languages', framework: 'Frameworks and libraries', platform: 'Platforms and services', ai: 'AI', practice: 'Practices and domains' })
  .map(([k, name]) => `<li><span style="background:${KIND[k]}"></span>${name}</li>`).join('');
function skillPanel(sk) {
  if (!sk) {
    about.innerHTML = `<h3>${data.skills.length} skills across ${data.projects.length} projects</h3>
      <p>Every skill here comes from a project above. A bigger dot is used in more projects, and a line joins two skills that were used together.</p>
      <ul class="legend">${legend}</ul><p class="quiet">Drag the globe. Pick a skill to see where it was used.</p>`;
    return;
  }
  const used = data.projects.filter((p) => p.tags.includes(sk.name));
  about.innerHTML = `<p class="kicker" style="color:${KIND[sk.kind]}">Skill</p><h3>${sk.name}</h3>
    <p>Used in <b>${used.length}</b> ${used.length === 1 ? 'project' : 'projects'}.</p>
    <ul class="used">${used.map((p) => `<li><button data-id="${p.id}"><span style="background:${HUE[p.group]}"></span>${p.title}</button></li>`).join('')}</ul>
    <button class="btn main" id="see">Show these in the gallery ↑</button>`;
  about.querySelectorAll('.used button').forEach((b) => b.addEventListener('click', () => toProjects(sk.name, Number(b.dataset.id))));
  $('#see').addEventListener('click', () => toProjects(sk.name));
}
skillPanel(null);
near($('#skills'), async () => {
  globe = (await import('./skills.js')).default($('#skills canvas'), $('#skills .labels'), data.skills, data.links, { onPick: skillPanel });
  demo.skill = (name) => globe.choose(name);
});

// ------------------------------------------------------------ work history: the career tree, in a frame that sleeps off screen
const frame = $('#work iframe');
near($('#work'), () => {
  frame.src = frame.dataset.src;
  let seen = false;
  const tell = () => frame.contentWindow?.postMessage(seen ? 'resume' : 'pause', '*');
  frame.addEventListener('load', tell);
  new IntersectionObserver(([e]) => { seen = e.isIntersecting; tell(); }, { rootMargin: '100px' }).observe(frame);
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
