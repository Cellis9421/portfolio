// 4. The bot plays it for you: a small game world, a bot mid-quest, its script on the side.
import { THREE, stage, rng, std, lit, box, cyl, ball, sun } from '../kit.js';

export default function () {
  const s = stage({ light: true, bg: 0xbfe4f7, cam: [4.5, 31, 25], target: [4.5, 0, 0.8], fov: 30, bloom: [0.18, 0.4, 0.95], exposure: 1.05 });
  const { scene } = s;
  const R = rng(21);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8fb070, 1.05));
  sun(scene, 0xfff2d2, 2.5, [14, 26, 9], 26);

  const COLS = 20, ROWS = 14, T = 1.5;
  const X = (c) => (c - (COLS - 1) / 2) * T, Z = (r) => (r - (ROWS - 1) / 2) * T;
  const kind = Array.from({ length: ROWS }, () => Array(COLS).fill('grass'));
  const run = (c0, r0, c1, r1) => { for (let c = Math.min(c0, c1); c <= Math.max(c0, c1); c++) for (let r = Math.min(r0, r1); r <= Math.max(r0, r1); r++) kind[r][c] = 'path'; };
  run(3, 4, 3, 5); run(3, 5, 15, 5); run(9, 3, 9, 5); run(15, 5, 15, 9); run(6, 7, 15, 7); run(6, 7, 6, 9);
  [[10, 10], [11, 10], [12, 10], [10, 11], [11, 11], [12, 11], [11, 12]].forEach(([c, r]) => { kind[r][c] = 'water'; });

  box(scene, [COLS * T + 0.6, 1.4, ROWS * T + 0.6], [0, -1.0, 0], std(0x7a5a3c, { roughness: 0.9 }));
  const tiles = new THREE.InstancedMesh(new THREE.BoxGeometry(T - 0.05, 0.5, T - 0.05), std(0xffffff, { roughness: 0.9 }), COLS * ROWS);
  tiles.receiveShadow = true;
  const d = new THREE.Object3D(), col = new THREE.Color();
  let n = 0;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const k = kind[r][c];
    d.position.set(X(c), k === 'water' ? -0.42 : -0.25, Z(r));
    d.updateMatrix();
    tiles.setMatrixAt(n, d.matrix);
    col.set(k === 'path' ? ((r + c) % 2 ? 0xe8cf9a : 0xe1c58c) : k === 'water' ? ((r + c) % 2 ? 0x4aa8e8 : 0x58b4f0) : (r + c) % 2 ? 0x7cc462 : 0x86cf6b);
    tiles.setColorAt(n++, col);
  }
  scene.add(tiles);

  const quests = [
    { c: 3, r: 3, roof: 0x4fae5e, name: '2009 Game bots', done: true },
    { c: 9, r: 2, roof: 0xe0a030, name: '2012 Client sites', done: true },
    { c: 15, r: 4, roof: 0xd8573a, name: '2017 Stove & Grill Parts', now: true },
    { c: 15, r: 10, roof: 0x3d7fd9, name: '2022 Cybrary' },
    { c: 6, r: 10, roof: 0x8a5fd0, name: 'Now: agents' },
  ];
  const taken = new Set();
  quests.forEach((q) => {
    const x = X(q.c), z = Z(q.r);
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) taken.add(`${q.c + a},${q.r + b}`);
    box(scene, [2.2, 1.5, 2.1], [x, 0.75, z], std(0xf4ead8, { roughness: 0.8 }));
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.95, 1.25, 4), std(q.roof, { roughness: 0.7 }));
    roof.position.set(x, 2.1, z);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    scene.add(roof);
    box(scene, [0.5, 0.85, 0.08], [x, 0.43, z + 1.07], std(0x7a4a2a));
    s.label(`${q.done ? '✓' : q.now ? '!' : '·'} ${q.name}`, [x, 3.0, z], q.now ? 'hot' : '');
  });

  for (let i = 0, made = 0; i < 400 && made < 34; i++) {
    const c = Math.floor(R() * COLS), r = Math.floor(R() * ROWS);
    if (kind[r][c] !== 'grass' || taken.has(`${c},${r}`)) continue;
    taken.add(`${c},${r}`);
    made++;
    const x = X(c) + (R() - 0.5) * 0.4, z = Z(r) + (R() - 0.5) * 0.4, k = 0.8 + R() * 0.5;
    if (R() < 0.15) { ball(scene, 0.38 * k, [x, 0.2, z], std(0x9aa3ad, { roughness: 0.9, flatShading: true })); continue; }
    cyl(scene, 0.12 * k, 0.16 * k, 0.6 * k, [x, 0.3 * k, z], std(0x7a4a2a), { seg: 8 });
    const leaf = std(R() < 0.5 ? 0x3f9a4e : 0x4bab57, { roughness: 0.9, flatShading: true });
    const a = new THREE.Mesh(new THREE.ConeGeometry(0.62 * k, 1.1 * k, 7), leaf), b = new THREE.Mesh(new THREE.ConeGeometry(0.46 * k, 0.9 * k, 7), leaf);
    a.position.set(x, 1.05 * k, z); b.position.set(x, 1.65 * k, z);
    a.castShadow = b.castShadow = true;
    scene.add(a, b);
  }

  // the bot, on the road to quest three
  const bot = new THREE.Group();
  const at = { c: 11.4, r: 5 };
  bot.position.set(X(at.c), 0, Z(at.r));
  scene.add(bot);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.42, 6, 14), std(0x2f6fed, { roughness: 0.5 }));
  body.position.y = 0.52;
  body.castShadow = true;
  bot.add(body);
  ball(bot, 0.27, [0, 1.16, 0], std(0xf2c9a0, { roughness: 0.7 }));
  cyl(bot, 0.015, 0.015, 0.34, [0, 1.56, 0], std(0x333333), { seg: 6 });
  ball(bot, 0.07, [0, 1.76, 0], lit(0xffe14a, 3.5), { cast: false });
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.62, 36), new THREE.MeshBasicMaterial({ color: 0x1f6feb, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.03;
  bot.add(ring);
  s.label('bot · autopilot', [X(at.c), 2.0, Z(at.r)]);

  // what the bot plans to do next, drawn on the world
  const dot = new THREE.MeshBasicMaterial({ color: 0xffd21f });
  for (let c = at.c + 0.5; c <= 15; c += 0.42) ball(scene, 0.09, [X(c), 0.14, Z(5)], dot, { cast: false, receive: false });
  const goal = quests[2];
  const target = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.07, 10, 48), new THREE.MeshBasicMaterial({ color: 0xff3b30 }));
  target.rotation.x = Math.PI / 2;
  target.position.set(X(goal.c), 0.08, Z(goal.r));
  scene.add(target);
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.7, 4), new THREE.MeshBasicMaterial({ color: 0xff3b30 }));
  arrow.rotation.x = Math.PI;
  arrow.position.set(X(goal.c), 4.4, Z(goal.r));
  scene.add(arrow);
  s.onTick((t) => {
    target.scale.setScalar(1 + Math.sin(t * 3) * 0.06);
    arrow.position.y = 4.4 + Math.sin(t * 3) * 0.18;
    bot.position.y = Math.abs(Math.sin(t * 5)) * 0.07;
  });

  s.hud(`<div class="panel mono" style="right:26px;top:96px;width:318px;font-size:13.5px;line-height:1.75">
    <div style="display:flex;justify-content:space-between;font-family:Inter,'Segoe UI',sans-serif">
      <b style="font-size:15px">bot.script</b><span style="color:#1a8f3c;font-weight:700">● AUTOPILOT ON</span></div>
    <div style="margin-top:8px;color:#1a8f3c">1 ✓ quest("2009 Game bots")</div>
    <div style="color:#1a8f3c">2 ✓ quest("2012 Client sites")</div>
    <div style="background:#1f6feb;color:#fff;margin:2px -8px;padding:0 8px;border-radius:6px">3 ▶ quest("2017 Stove &amp; Grill")</div>
    <div class="dim">&nbsp;&nbsp;&nbsp;&nbsp;walking to the shop, 62%</div>
    <div>4 &nbsp; quest("2022 Cybrary")</div>
    <div>5 &nbsp; quest("Now: agents")</div>
    <div style="margin-top:12px;font-family:Inter,'Segoe UI',sans-serif"><span class="btn">Take the controls</span><span class="btn ghost">Edit script</span></div>
    <div class="dim" style="margin-top:10px;font-family:Inter,'Segoe UI',sans-serif;font-size:12px">Drag a line to reorder. The bot obeys.</div></div>`);
}
