// 4. The cabinet of small things: a wall of lit boxes, each a tiny living scene of one project.
import { THREE, stage, rng, std, lit, box, cyl, ball, screen } from '../kit.js';

export default function () {
  const s = stage({ bg: 0x0d0907, fog: [0x0d0907, 0.006], cam: [-5.5, 6.8, 28.5], target: [-0.9, 5.6, 0], fov: 30, bloom: [0.34, 0.5, 0.86], exposure: 1.12 });
  const { scene } = s;
  const R = rng(12);

  scene.add(new THREE.HemisphereLight(0xffe6c8, 0x0d0907, 0.28));
  const key = new THREE.SpotLight(0xffe2ba, 700, 90, 0.6, 0.7, 1.3);
  key.position.set(-6, 14, 30);
  key.target.position.set(0, 5.5, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0004;
  scene.add(key, key.target);
  box(scene, [120, 60, 0.4], [0, 14, -1.2], std(0x1d1612, { roughness: 0.95 }), { cast: false });
  box(scene, [120, 0.4, 40], [0, -0.2, 8], std(0x140e0a, { roughness: 0.7 }), { cast: false });

  const COLS = 9, ROWS = 4, CW = 2.35, CH = 2.5, D = 1.5, BASE = 0.7;
  const W = COLS * CW, H = ROWS * CH;
  const X = (c) => (c - (COLS - 1) / 2) * CW, Y = (r) => BASE + (ROWS - 1 - r) * CH + CH / 2;
  const big = (c, r) => c >= 3 && c <= 5 && r >= 1 && r <= 2;
  const walnut = std(0x5b3a22, { roughness: 0.55 }), shelf = std(0x4a2f1b, { roughness: 0.6 });
  const brass = std(0xd9a441, { roughness: 0.3, metalness: 0.9 });

  box(scene, [W + 0.5, 0.25, D + 0.1], [0, BASE - 0.12, 0], walnut);
  box(scene, [W + 0.5, 0.25, D + 0.1], [0, BASE + H + 0.12, 0], walnut);
  for (const x of [-W / 2 - 0.12, W / 2 + 0.12]) box(scene, [0.25, H + 0.5, D + 0.1], [x, BASE + H / 2, 0], walnut);
  box(scene, [W, H, 0.08], [0, BASE + H / 2, -D / 2], std(0x21160f));
  for (let c = 0; c < COLS - 1; c++) for (let r = 0; r < ROWS; r++) if (!(big(c, r) && big(c + 1, r))) box(scene, [0.1, CH, D], [X(c) + CW / 2, Y(r), 0], shelf);
  for (let r = 0; r < ROWS - 1; r++) for (let c = 0; c < COLS; c++) if (!(big(c, r) && big(c, r + 1))) box(scene, [CW, 0.1, D], [X(c), Y(r) - CH / 2, 0], shelf);

  // a dozen miniatures built from scraps; the real ones would each be modelled for their project
  const tiny = [
    (g) => { box(g, [1.3, 0.08, 0.6], [0, 0.55, 0], shelf); box(g, [0.85, 0.6, 0.06], [0, 1.0, -0.1], std(0x15171c)); box(g, [0.75, 0.5, 0.02], [0, 1.0, -0.06], lit(0x39d0ff, 1.3), { cast: false }); for (const x of [-0.55, 0.55]) box(g, [0.06, 0.55, 0.5], [x, 0.27, 0], shelf); },
    (g) => { box(g, [0.85, 0.9, 0.6], [0, 0.6, 0], std(0x17181b, { roughness: 0.5 })); box(g, [0.5, 0.36, 0.03], [0, 0.6, 0.31], lit(0xff7a2a, 2.2), { cast: false }); cyl(g, 0.1, 0.1, 1.0, [0.2, 1.5, -0.1], std(0x17181b)); for (const x of [-0.32, 0.32]) box(g, [0.08, 0.16, 0.5], [x, 0.08, 0], std(0x17181b)); },
    (g) => { box(g, [1.3, 0.85, 0.7], [0, 0.42, 0], std(0xf1e6cf)); box(g, [1.4, 0.1, 0.5], [0, 0.95, 0.3], std(0xc9402c), { rot: [0.35, 0, 0] }); box(g, [0.3, 0.5, 0.03], [-0.3, 0.25, 0.36], std(0x6b3f1c)); box(g, [0.45, 0.3, 0.03], [0.3, 0.45, 0.36], lit(0xffe2a8, 1.2), { cast: false }); },
    (g) => { for (const x of [-0.35, 0.35]) { box(g, [0.5, 1.4, 0.5], [x, 0.7, 0], std(0x1d2230, { metalness: 0.5, roughness: 0.4 })); for (let k = 0; k < 5; k++) box(g, [0.3, 0.04, 0.02], [x, 0.3 + k * 0.24, 0.26], lit(k % 2 ? 0x39d0ff : 0x58f29b, 2.2), { cast: false }); } },
    (g) => { box(g, [1.7, 0.16, 0.45], [0, 0.3, 0], std(0x2c2f36)); for (let i = 0; i < 3; i++) box(g, [0.34, 0.3, 0.34], [-0.55 + i * 0.55, 0.53, 0], std(0xb98a55, { roughness: 0.9 })); for (const x of [-0.7, 0.7]) box(g, [0.08, 0.3, 0.4], [x, 0.15, 0], std(0x2c2f36)); },
    (g) => { ball(g, 0.36, [0, 0.5, 0], std(0x2f6fed, { roughness: 0.4 })); ball(g, 0.09, [0.13, 0.58, 0.31], lit(0xffffff, 2), { cast: false }); ball(g, 0.09, [-0.13, 0.58, 0.31], lit(0xffffff, 2), { cast: false }); cyl(g, 0.02, 0.02, 0.4, [0, 1.0, 0], std(0x333333)); ball(g, 0.07, [0, 1.22, 0], lit(0xffe14a, 3), { cast: false }); },
    (g) => { [0.5, 0.9, 0.65, 1.2, 0.8].forEach((h, i) => box(g, [0.24, h, 0.24], [-0.6 + i * 0.3, h / 2, 0], std([0x39d0ff, 0x58f29b, 0xffc24a, 0xff6b5e, 0xb78cff][i], { roughness: 0.5 }))); },
    (g) => { cyl(g, 0.3, 0.22, 0.4, [0, 0.2, 0], std(0xb5562a)); ball(g, 0.45, [0, 0.85, 0], std(0x4bab57, { roughness: 0.9, flatShading: true })); ball(g, 0.28, [0.3, 1.15, 0], std(0x3f9a4e, { roughness: 0.9, flatShading: true })); },
    (g) => { cyl(g, 0.5, 0.5, 0.14, [-0.2, 0.75, 0], brass, { rot: [Math.PI / 2, 0, 0], seg: 10 }); cyl(g, 0.32, 0.32, 0.14, [0.45, 0.4, 0.05], std(0xaab0ba, { metalness: 0.9, roughness: 0.3 }), { rot: [Math.PI / 2, 0.3, 0], seg: 8 }); },
    (g) => { [[0xb23a48, 0], [0x2d6a9f, 0.15], [0xe0a030, -0.1], [0x3f8f5a, 0.08]].forEach(([c, a], i) => box(g, [1.0, 0.2, 0.7], [0, 0.1 + i * 0.2, 0], std(c, { roughness: 0.7 }), { rot: [0, a, 0] })); },
    (g) => { box(g, [0.75, 0.6, 0.3], [0, 0.3, 0], brass); const t = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.07, 10, 24, Math.PI), std(0xaab2c2, { metalness: 0.9, roughness: 0.3 })); t.position.set(0, 0.6, 0); t.castShadow = true; g.add(t); },
    (g) => { cyl(g, 0.06, 0.2, 0.5, [0, 0.25, 0], brass); const w = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 1), std(0x2f8fb8, { flatShading: true, roughness: 0.6 })); w.position.set(0, 0.95, 0); w.castShadow = true; g.add(w); },
  ];
  const walls = [0x1f5a56, 0xb5892b, 0x8f3f2b, 0x24305a, 0x5a6b2c, 0x6a3a6b, 0xcfc1a0, 0x2c4f7a];
  const empty = new Set(['6,0', '7,0', '8,0']);
  let k = 0;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (big(c, r)) continue;
    const gone = empty.has(`${c},${r}`), hue = walls[(k * 3 + r) % walls.length];
    box(scene, [CW - 0.1, CH - 0.1, 0.04], [X(c), Y(r), -D / 2 + 0.07], gone ? std(0x17100b) : new THREE.MeshStandardMaterial({ color: hue, emissive: hue, emissiveIntensity: 0.3, roughness: 0.9 }), { cast: false });
    if (gone) continue;
    box(scene, [CW - 0.6, 0.05, 0.08], [X(c), Y(r) + CH / 2 - 0.13, D / 2 - 0.22], lit(0xffe2b0, 1.9), { cast: false });
    const g = new THREE.Group();
    g.position.set(X(c), Y(r) - CH / 2 + 0.06, 0.05);
    const pick = c === 1 && r === 2 ? 1 : (k * 5 + r * 2) % tiny.length;
    tiny[pick](g);
    scene.add(g);
    box(scene, [0.9, 0.16, 0.02], [X(c), Y(r) - CH / 2 + 0.16, D / 2 + 0.01], brass, { cast: false });
    k++;
  }
  s.label('reserved · the next small things', [X(7), Y(0) + 0.2, D / 2]);

  // the one being looked at
  const hot = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(CW + 0.04, CH + 0.04, D + 0.1)), new THREE.LineBasicMaterial({ color: 0xffb454 }));
  hot.position.set(X(1), Y(2), 0.02);
  scene.add(hot);
  const fire = new THREE.PointLight(0xff8a3c, 26, 6, 2);
  fire.position.set(X(1), Y(2) - 0.4, 0.9);
  scene.add(fire);
  s.label('Projects: E-commerce site · lean in and it opens live ↗', [X(1), Y(2) + CH / 2, D / 2], 'hot');

  // the big box in the middle: who this is
  const bx = X(4), by = (Y(1) + Y(2)) / 2, floor = by - CH + 0.06;
  box(scene, [3 * CW - 0.1, 2 * CH - 0.1, 0.04], [bx, by, -D / 2 + 0.07], new THREE.MeshStandardMaterial({ color: 0x16443f, emissive: 0x16443f, emissiveIntensity: 0.45, roughness: 0.9 }), { cast: false });
  box(scene, [3 * CW - 0.8, 0.06, 0.1], [bx, by + CH - 0.14, D / 2 - 0.22], lit(0xffe2b0, 2), { cast: false });
  box(scene, [3.6, 0.12, 0.9], [bx, floor + 1.35, 0.1], shelf);
  for (const x of [-1.6, 1.6]) box(scene, [0.12, 1.35, 0.8], [bx + x, floor + 0.67, 0.1], shelf);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.7, 6, 14), std(0x2f6fed, { roughness: 0.6 }));
  body.position.set(bx - 0.5, floor + 2.0, -0.3);
  body.castShadow = true;
  scene.add(body);
  ball(scene, 0.36, [bx - 0.5, floor + 3.0, -0.3], std(0xf2c9a0, { roughness: 0.7 }));
  box(scene, [1.5, 1.0, 0.07], [bx + 0.7, floor + 2.05, 0.05], std(0x15171c), { rot: [0, -0.35, 0] });
  screen(scene, 1.36, 0.86, [bx + 0.72, floor + 2.05, 0.1], (g, w, h) => {
    g.fillStyle = '#06101a'; g.fillRect(0, 0, w, h);
    ['#39d0ff', '#58f29b', '#ffc24a', '#b78cff'].forEach((c, i) => { g.fillStyle = c; g.fillRect(20, 30 + i * 62, 180 + ((i * 97) % 220), 22); });
  }, { rot: [0, -0.35, 0], boost: 1.15 });
  cyl(scene, 0.03, 0.03, 1.0, [bx - 1.4, floor + 1.9, 0.2], brass);
  ball(scene, 0.16, [bx - 1.4, floor + 2.45, 0.2], lit(0xffe2a8, 2.6), { cast: false });
  const desk = new THREE.PointLight(0xffd9a0, 30, 7, 2);
  desk.position.set(bx - 1.2, floor + 2.5, 0.6);
  scene.add(desk);
  screen(scene, 4.6, 0.7, [bx, floor + 0.5, D / 2 + 0.02], (g, w, h) => {
    g.fillStyle = '#c8962f'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#231608'; g.font = 'bold 74px "Segoe UI", Arial'; g.textAlign = 'center'; g.fillText('CALVIN ELLIS', w / 2, 80);
    g.font = '30px "Segoe UI", Arial'; g.fillText('principal software engineer · 15 years', w / 2, 126);
  }, { px: 1024, boost: 0.9 });
  s.label('Who: the big box in the middle', [bx, by + CH, D / 2]);

  ['2026 · now', '2022 to 2025', '2017 to 2021', '2009 to 2016'].forEach((t, r) => s.label(t, [-W / 2 - 1.35, Y(r) - 0.25, D / 2], 'plain'));
  s.label('Timeline: rows are years, newest on top', [X(4), BASE + H + 0.35, D / 2]);
  void R;

  s.hud(`<div class="panel" style="left:50%;bottom:36px;transform:translateX(-50%);font-size:14px">
    <b>Every box is one project as a tiny living scene.</b> Lean in and the camera goes through the glass into the real thing.</div>`);
}
