// Release history: the career drawn as a commit graph. Each job is a tagged release, each thing shipped a commit on the line.
import { THREE, stage, glow, calm, clamp, lerp } from './stage.js';

const HUES = ['#7ef0c0', '#ffd54a', '#ff8f3a', '#5cc8ff', '#b78cff'];

export default function releases(canvas, layer, list, ui) {
  const s = stage(canvas, { fov: 35 });
  const { scene, camera } = s;
  const GAP = 1.15, first = list[0].year, now = new Date().getFullYear() + 0.6;
  const X = (year) => (year - first) * GAP;
  const stops = [...list.map((r) => X(r.year)), X(now)];  // every release, then today

  const line = (pts, colour, opacity = 1) => {
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: colour, transparent: opacity < 1, opacity }));
    scene.add(l);
    return l;
  };
  line([new THREE.Vector3(-1.5, 0, 0), new THREE.Vector3(X(now) + 1.5, 0, 0)], 0x5b6f9c);
  const grid = new THREE.GridHelper(80, 80, 0x1a2338, 0x121a2b);
  grid.position.set(X(now) / 2, -2.1, 0);
  scene.add(grid);

  // releases: a ring on the line, a tag above it
  const marks = list.map((r, i) => {
    const hue = HUES[i % HUES.length], g = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.07, 10, 40), new THREE.MeshBasicMaterial({ color: hue }));
    g.add(ring, glow(hue, 2.4, 0.4));
    g.position.set(stops[i], 0, 0);
    scene.add(g);
    line([new THREE.Vector3(stops[i], 0.34, 0), new THREE.Vector3(stops[i], 1.5, 0)], hue, 0.6);
    const el = document.createElement('button');
    el.className = 'tag-rel';
    el.style.setProperty('--hue', hue);
    el.innerHTML = `<b>${r.version}</b><span>${r.year}</span>`;
    el.addEventListener('click', () => { want = stops[i]; });
    layer.appendChild(el);
    // commits: one dot for every line of that job's release notes, spread to the next release
    const span = stops[i + 1] - stops[i];
    r.notes.forEach((_, k) => {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 8), new THREE.MeshBasicMaterial({ color: hue }));
      dot.position.set(stops[i] + ((k + 1) / (r.notes.length + 1)) * span, 0, 0);
      scene.add(dot);
    });
    return { g, ring, el, hue, state: '' };
  });
  // a side branch: the personal projects, forked off after the first job and merged back today
  const fork = stops[1] + 0.6, merge = X(now) - 0.5, lane = 1.05, side = [];
  for (let k = 0; k <= 40; k++) { const u = k / 40, x = lerp(fork, merge, u); side.push(new THREE.Vector3(x, lane * Math.min(1, Math.min(u, 1 - u) * 9), 0.0)); }
  line(side, 0x8a6bd0, 0.8);
  for (let k = 0; k < 5; k++) { const dot = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 8), new THREE.MeshBasicMaterial({ color: 0xb78cff })); dot.position.set(lerp(fork, merge, 0.2 + k * 0.15), lane, 0); scene.add(dot); }
  const head = new THREE.Group();
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff })), glow(0xffffff, 2.6, 0.55));
  head.position.set(X(now), 0, 0);
  scene.add(head);
  const pulse = glow(0xbfd4ff, 1.5, 0.7);
  scene.add(pulse);

  let at = stops[list.length - 1], want = at, drag = null, focus = -1, wide = true;
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, at: want }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => { if (drag) want = clamp(drag.at - (e.clientX - drag.x) * (wide ? 0.012 : 0.02), -0.5, X(now) + 0.5); });
  const drop = () => { drag = null; };
  canvas.addEventListener('pointerup', drop);
  canvas.addEventListener('pointercancel', drop);
  canvas.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
  function step(d) { want = stops[clamp(focus + d, 0, list.length - 1)]; }
  s.onSize((w, h) => { wide = w / h > 1.25; });

  const tmp = new THREE.Vector3();
  s.onTick((t, dt) => {
    at = lerp(at, want, 1 - Math.pow(0.002, dt));
    const shift = wide ? 2.6 : 0, dist = wide ? 12.5 : 15;
    camera.position.set(at + shift, 1.5, dist);
    camera.lookAt(at + shift, 0.35, 0);
    // the release in focus is the latest one at or before the middle of the view
    let near = 0;
    stops.slice(0, list.length).forEach((x, i) => { if (x <= at + 0.6) near = i; });
    if (near !== focus) { focus = near; ui.onFocus(list[near], near); }
    marks.forEach((m, i) => {
      const state = i === focus ? 'on' : '';
      if (state !== m.state) { m.state = state; m.el.dataset.state = state; }
      m.ring.scale.setScalar(lerp(m.ring.scale.x, i === focus ? 1.45 : 1, 0.15));
      const p = s.project(tmp.set(stops[i], 1.55, 0));
      m.el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) translate(-50%, -100%)`;
    });
    pulse.position.set(((t * (calm ? 0.6 : 1.8)) % (X(now) + 3)) - 1.5, 0, 0.05);
    head.scale.setScalar(1 + Math.sin(t * 2.2) * 0.12);
  });
  return { step, go: (i) => { want = stops[clamp(i, 0, list.length - 1)]; } };
}
