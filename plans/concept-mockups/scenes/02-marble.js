// 2. Marble run through a career: one track, five dioramas, a marble the scroll releases.
import { THREE, stage, env, std, lit, box, cyl, ball, screen, sun, tube } from '../kit.js';

export default function () {
  const s = stage({ light: true, neutral: true, bg: 0xe4cfae, fog: [0xe4cfae, 0.004], cam: [0.6, 6.6, 41], target: [0.6, 4.7, 0], fov: 32, bloom: [0.15, 0.5, 0.95], exposure: 0.82 });
  const { scene } = s;
  env(s, 0.7);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xc9ab7c, 0.6));
  sun(scene, 0xfff0d8, 2.9, [12, 26, 18], 30);
  box(scene, [140, 0.4, 60], [0, -3.2, 0], std(0xd6bd96, { roughness: 0.95 }), { cast: false });
  box(scene, [140, 60, 0.4], [0, 20, -9], std(0xe6d2b2, { roughness: 1 }), { cast: false });

  const wood = std(0xb5712c, { roughness: 0.6 });
  const woodDark = std(0x6b3f1c, { roughness: 0.7 });
  const brass = std(0xd9a441, { roughness: 0.28, metalness: 0.85 });
  const P = [0, 1, 2, 3, 4].map((i) => ({ x: -13.2 + i * 6.6, y: 8 - i * 2.1 }));
  const years = ['2009 · Game bots', '2012 · Client sites', '2017 · E-commerce', '2022 · Cybrary', 'Now · Agents'];

  P.forEach((p, i) => {
    box(scene, [6.2, 0.5, 4.6], [p.x, p.y - 0.25, 0], wood);
    box(scene, [6.4, 0.16, 4.8], [p.x, p.y - 0.58, 0], woodDark);
    cyl(scene, 0.32, 0.42, p.y + 2.5, [p.x, (p.y - 3.5) / 2 - 0.25, 0], woodDark);
    s.label(years[i], [p.x, p.y + 4.3, 0], i === 2 ? 'hot' : '');
  });

  // the track: a swoop in, a dip over each platform, a drop to the next
  const way = [[-19.6, 14.4, 0], [-17.7, 13.1, 0]];
  P.forEach((p) => way.push([p.x - 2.6, p.y + 3.05, 0], [p.x, p.y + 2.45, 0], [p.x + 2.6, p.y + 2.2, 0]));
  way.push([17.4, 0.5, 0], [19.3, -0.8, 0], [21, -1.5, 0]);
  const railA = tube(scene, way.map(([x, y]) => [x, y, 0.36]), 0.11, brass, 400);
  tube(scene, way.map(([x, y]) => [x, y, -0.36]), 0.11, brass, 400);
  const curve = new THREE.CatmullRomCurve3(way.map((p) => new THREE.Vector3(...p)));
  for (let u = 0.03; u < 0.99; u += 0.022) {
    const q = curve.getPointAt(u);
    box(scene, [0.12, 0.07, 0.95], [q.x, q.y - 0.12, 0], woodDark, { cast: false });
  }
  for (let u = 0.05; u < 0.98; u += 0.09) {
    const q = curve.getPointAt(u);
    const floor = P.reduce((f, p) => (Math.abs(q.x - p.x) < 3.1 ? p.y : f), -3);
    cyl(scene, 0.05, 0.05, q.y - floor - 0.1, [q.x, (q.y + floor) / 2 - 0.05, 0.36], brass);
  }
  void railA;

  // each drop between platforms is a run of stairs, and every stair is a note
  const notes = [0xe4572e, 0xf3a712, 0xf7dc4f, 0x76b041, 0x29a8ab, 0x3d6fd9];
  P.slice(0, 4).forEach((p) => {
    for (let k = 0; k < 6; k++) {
      const f = (k + 0.5) / 6;
      box(scene, [0.2, 0.14, 1.7], [p.x + 2.6 + f * 1.4, p.y + 2.02 - f * 1.25, 0], std(notes[k], { roughness: 0.4 }));
    }
  });
  s.label('every stair is a note', [P[2].x + 3.3, P[2].y + 2.1, 0]);

  // 2009: a beige CRT running a bot
  const beige = std(0xd8cfb6, { roughness: 0.8 });
  let p = P[0];
  box(scene, [1.5, 1.25, 1.3], [p.x - 1, p.y + 0.63, -1.1], beige);
  screen(scene, 1.15, 0.9, [p.x - 1, p.y + 0.68, -0.44], (g, w, h) => {
    g.fillStyle = '#04200b'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#4dff7c'; g.font = 'bold 44px Consolas, monospace';
    ['> run bot', '[ok] hooked', 'task 41/99'].forEach((t, i) => g.fillText(t, 26, 90 + i * 84));
  }, { boost: 1.3 });
  box(scene, [1.4, 0.1, 0.5], [p.x - 1, p.y + 0.05, 0.9], beige);
  box(scene, [0.7, 1.5, 1.4], [p.x + 1.2, p.y + 0.75, -1.1], beige);

  // 2012: a laptop with a client site on it
  p = P[1];
  const alu = std(0xc9ccd2, { roughness: 0.35, metalness: 0.7 });
  box(scene, [2, 0.1, 1.3], [p.x - 0.4, p.y + 0.05, -0.7], alu);
  box(scene, [2, 1.3, 0.08], [p.x - 0.4, p.y + 0.72, -1.42], alu, { rot: [-0.18, 0, 0] });
  screen(scene, 1.84, 1.14, [p.x - 0.4, p.y + 0.73, -1.36], (g, w, h) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2f6fed'; g.fillRect(0, 0, w, 56);
    g.fillStyle = '#1d2433'; g.fillRect(36, 96, 230, 26);
    g.fillStyle = '#c7cedb'; [150, 180, 210].forEach((y) => g.fillRect(36, y, 200, 12));
    g.fillStyle = '#2f6fed'; g.fillRect(36, 250, 110, 34);
    g.fillStyle = '#e8ecf4'; g.fillRect(300, 96, 176, 190);
  }, { rot: [-0.18, 0, 0], boost: 1.05 });
  cyl(scene, 0.22, 0.18, 0.5, [p.x + 1.6, p.y + 0.25, 0.9], std(0xffffff, { roughness: 0.3 }));

  // 2017: a conveyor of boxed parts and a counter climbing from 1M to 10M
  p = P[2];
  box(scene, [5, 0.3, 1.1], [p.x, p.y + 0.3, -1.2], std(0x2c2f36, { roughness: 0.5 }));
  for (let i = 0; i < 5; i++) box(scene, [0.62, 0.52 + (i % 2) * 0.18, 0.62], [p.x - 2 + i, p.y + 0.72 + (i % 2) * 0.09, -1.2], std(0xb98a55, { roughness: 0.9 }));
  for (const x of [-1.2, 1.2]) cyl(scene, 0.05, 0.05, 1.5, [p.x + x, p.y + 0.75, 1.5], woodDark);
  screen(scene, 3.1, 0.95, [p.x, p.y + 1.6, 1.52], (g, w, h) => {
    g.fillStyle = '#16120c'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#ffb02e'; g.font = 'bold 96px Consolas, monospace'; g.textBaseline = 'middle';
    g.fillText('$1M  ▸  $10M', 34, h / 2 + 4);
  }, { px: 720, boost: 1.5 });

  // 2022: racks and a lock
  p = P[3];
  for (let i = 0; i < 3; i++) {
    box(scene, [0.9, 1.9, 1], [p.x - 1.6 + i * 1.1, p.y + 0.95, -1.2], std(0x1d2230, { roughness: 0.4, metalness: 0.5 }));
    for (let k = 0; k < 6; k++) box(scene, [0.5, 0.05, 0.02], [p.x - 1.6 + i * 1.1, p.y + 0.35 + k * 0.27, -0.69], lit(k % 3 ? 0x39d0ff : 0x52ff9a, 2.5), { cast: false });
  }
  box(scene, [0.8, 0.62, 0.3], [p.x + 1.7, p.y + 0.31, 1], brass);
  const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.07, 12, 24, Math.PI), std(0xaab2c2, { roughness: 0.3, metalness: 0.9 }));
  shackle.position.set(p.x + 1.7, p.y + 0.62, 1);
  shackle.castShadow = true;
  scene.add(shackle);

  // now: a ring of small agents round a table
  p = P[4];
  cyl(scene, 1.25, 1.25, 0.14, [p.x, p.y + 0.6, -0.8], std(0x30343f, { roughness: 0.4 }));
  cyl(scene, 0.14, 0.2, 0.6, [p.x, p.y + 0.3, -0.8], std(0x30343f));
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    ball(scene, 0.2, [p.x + Math.cos(a) * 1.75, p.y + 0.36, -0.8 + Math.sin(a) * 1.3], lit([0x8a6bff, 0x39d0ff, 0xffb454][i % 3], 2.6), { cast: false });
  }
  ball(scene, 0.3, [p.x, p.y + 1.05, -0.8], lit(0xffffff, 1.6), { cast: false });

  // the marble, its trail, and a few the visitor dropped
  const glass = (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.06, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 });
  const marble = ball(scene, 0.58, [0, 0, 0], glass(0x1f6feb));
  const ghosts = [0, 1, 2, 3, 4].map((i) => ball(scene, 0.52 - i * 0.06, [0, 0, 0], new THREE.MeshBasicMaterial({ color: 0x1f6feb, transparent: true, opacity: 0.3 - i * 0.055 }), { cast: false, receive: false }));
  const extra = [[0.19, 0xe4572e], [0.335, 0x76b041], [0.71, 0xf3a712], [0.93, 0x8a6bff]].map(([u, c]) => ({ u, m: ball(scene, 0.4, [0, 0, 0], glass(c)) }));
  const put = (m, u, r) => { const q = curve.getPointAt(((u % 1) + 1) % 1); m.position.set(q.x, q.y + r + 0.02, 0); };
  const tag = s.label('you are here', [0, 0, 0], 'hot');

  s.onTick((t) => {
    const u = 0.455 + ((t * 0.012) % 0.5);
    put(marble, u, 0.58);
    ghosts.forEach((g, i) => put(g, u - (i + 1) * 0.007, 0.58));
    extra.forEach((e) => put(e.m, e.u + t * 0.004, 0.4));
    tag.pos.copy(marble.position).setY(marble.position.y + 0.75);
  });

  s.hud(`<div class="panel" style="left:50%;bottom:54px;transform:translateX(-50%);display:flex;gap:14px;align-items:center;font-size:15px">
    <span><b>Scroll</b> to roll the marble ↓</span><span class="btn">+ Drop a marble</span><span class="btn ghost">♪ Sound on</span></div>`);
}
