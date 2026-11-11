// 6. The plot: a block of ground cut open. Projects grow on top, and the jobs are the layers they root in.
import { THREE, stage, rng, std, lit, box, cyl, ball, screen, sun, tube } from '../kit.js';

export default function () {
  const s = stage({ light: true, neutral: true, bg: 0xdcebf2, cam: [15.5, 10.5, 23], target: [0.4, 0.2, 0], fov: 30, bloom: [0.16, 0.45, 0.94], exposure: 0.92 });
  const { scene } = s;
  const R = rng(6);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8c9b0, 0.8));
  sun(scene, 0xfff1d6, 2.7, [-10, 22, 16], 24);
  box(scene, [160, 0.4, 120], [0, -7.2, 0], std(0xd3e3ea, { roughness: 1 }), { cast: false });

  const W = 17, D = 9.5;
  const layers = [
    { name: '2009 · Game bots', h: 1.25, hue: 0x4b3a33 },
    { name: '2012 · Client work', h: 1.25, hue: 0x76523c },
    { name: '2017 · Stove & Grill Parts', h: 1.55, hue: 0xa66d3c },
    { name: '2022 · Cybrary', h: 1.35, hue: 0xc59a5c },
  ];
  let y = -5.7;
  const mid = [];
  layers.forEach((l, i) => {
    box(scene, [W - (i % 2) * 0.12, l.h - 0.03, D - (i % 2) * 0.12], [0, y + l.h / 2, 0], std(l.hue, { roughness: 1 }));
    for (let k = 0; k < 9; k++) box(scene, [0.3 + R() * 0.7, 0.14 + R() * 0.2, 0.1], [(R() - 0.5) * (W - 1.5), y + 0.2 + R() * (l.h - 0.4), D / 2], std(new THREE.Color(l.hue).multiplyScalar(0.72), { roughness: 1 }), { cast: false });
    mid.push(y + l.h / 2);
    s.label(l.name, [-W / 2 + 2.4, y + l.h / 2 - 0.2, D / 2 + 0.05], 'plain');
    y += l.h;
  });
  box(scene, [W + 0.15, 0.5, D + 0.15], [0, y + 0.25, 0], std(0x6aa84f, { roughness: 1 }));
  const top = y + 0.5;
  s.label('Timeline: the layers. Dig to go back.', [-W / 2 + 2.6, mid[0] - 1.15, D / 2 + 0.05], 'hot');

  // things left in the ground where each job put them
  box(scene, [0.7, 0.55, 0.3], [3.4, mid[0], D / 2 + 0.05], std(0xcfc6ac));
  box(scene, [0.5, 0.38, 0.02], [3.4, mid[0], D / 2 + 0.21], lit(0x45ff78, 1.2), { cast: false });
  box(scene, [0.9, 0.06, 0.3], [5.6, mid[1], D / 2 + 0.05], std(0xc9ccd2, { metalness: 0.6, roughness: 0.4 }), { rot: [0, 0, 0.2] });
  box(scene, [0.6, 0.6, 0.3], [-0.6, mid[2] - 0.2, D / 2 + 0.05], std(0xb98a55, { roughness: 0.9 }), { rot: [0, 0, -0.15] });
  box(scene, [0.55, 0.7, 0.3], [6.4, mid[3], D / 2 + 0.05], std(0x1d2230, { metalness: 0.5, roughness: 0.4 }));

  // projects: a plant each, sized by how much work it was
  const leaf = [0x3f9a4e, 0x4bab57, 0x2f8a5a, 0x7bb661];
  function plant(x, z, k, depth, name, cls = 'plain') {
    cyl(scene, 0.07 * k, 0.11 * k, 0.9 * k, [x, top + 0.45 * k, z], std(0x7a4a2a), { seg: 8 });
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55 * k, 1), std(leaf[Math.floor(R() * 4)], { roughness: 0.9, flatShading: true }));
    crown.position.set(x, top + 1.15 * k, z);
    crown.castShadow = true;
    scene.add(crown);
    if (depth !== undefined) {
      const pts = [], end = mid[depth];
      for (let i = 0; i <= 8; i++) { const f = i / 8; pts.push([x + Math.sin(f * 5 + x) * 0.28 * (1 - f * 0.3), top - 0.45 - f * (top - 0.45 - end), D / 2 + 0.06]); }
      tube(scene, pts, 0.05, std(0xf1e4c8, { roughness: 0.8 }), 40);
      ball(scene, 0.15, [pts[8][0], end, D / 2 + 0.1], lit(0xffd27a, 1.8), { cast: false });
    }
    if (name) s.label(name, [x, top + 1.9 * k, z], cls);
  }
  plant(-6.2, 3.6, 1.0, 0, 'Gather bot');
  plant(-3.9, 3.7, 0.9, 1, 'Custom CMS');
  plant(-1.3, 3.5, 1.6, 2, 'Projects: E-commerce site · rooted in 2017 · opens live ↗', 'hot');
  plant(1.4, 3.8, 1.2, 2, 'Reporting server');
  plant(4.2, 3.6, 1.5, 3, 'Enterprise hub');
  plant(6.9, 3.7, 1.0, 3, 'API client generator');
  for (let i = 0; i < 16; i++) plant(-7.4 + R() * 14.8, -3.9 + R() * 5.6, 0.6 + R() * 0.9);

  // standalone things live under glass
  [[5.3, -3.3], [6.9, -2.8], [6.1, -1.7]].forEach(([x, z], i) => {
    box(scene, [0.5, 0.36, 0.06], [x, top + 0.32, z], std(0x15171c));
    box(scene, [0.42, 0.28, 0.02], [x, top + 0.32, z + 0.04], lit([0x39d0ff, 0xffc24a, 0x58f29b][i], 1.6), { cast: false });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.62, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0xd8f1ff, transparent: true, opacity: 0.28, roughness: 0.05 }));
    dome.position.set(x, top, z);
    scene.add(dome);
  });
  s.label('small standalone things live under glass', [6.1, top + 0.9, -2.8]);

  // seedlings: what comes next
  for (let i = 0; i < 6; i++) {
    const x = 3.2 + i * 0.75, z = 1.6 - (i % 2) * 0.5;
    cyl(scene, 0.03, 0.03, 0.3, [x, top + 0.15, z], std(0x4bab57), { seg: 6 });
    ball(scene, 0.1, [x + 0.08, top + 0.32, z], std(0x7bd66a, { roughness: 0.8 }));
    box(scene, [0.22, 0.14, 0.02], [x - 0.12, top + 0.12, z + 0.2], std(0xf5efe0), { cast: false });
  }
  s.label('seedlings · the next ones', [5.1, top + 0.5, 1.4]);

  // the sign: who this is
  for (const x of [-7.2, -5.0]) cyl(scene, 0.06, 0.06, 1.7, [x, top + 0.85, 4.3], std(0x6b3f1c), { seg: 8 });
  box(scene, [2.7, 0.95, 0.1], [-6.1, top + 1.5, 4.3], std(0x8a5a34, { roughness: 0.7 }));
  screen(scene, 2.56, 0.82, [-6.1, top + 1.5, 4.36], (g, w, h) => {
    g.fillStyle = '#f5efe0'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2a2118'; g.font = 'bold 60px "Segoe UI", Arial'; g.textAlign = 'center'; g.fillText('CALVIN ELLIS', w / 2, 74);
    g.font = '30px "Segoe UI", Arial'; g.fillText('everything I grew, and where', w / 2, 122);
  }, { px: 512, boost: 0.9 });
  s.label('Who: the sign at the gate', [-6.1, top + 2.1, 4.3]);

  s.hud(`<div class="panel" style="left:50%;bottom:34px;transform:translateX(-50%);font-size:14px">
    <b>Every project is rooted in the job that fed it.</b> Scroll lifts the block apart, one layer at a time.</div>`);
}
