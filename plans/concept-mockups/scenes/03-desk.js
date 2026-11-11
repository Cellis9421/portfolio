// 3. One desk, five eras: caught mid-turn, 2009 on the left and now on the right.
import { THREE, stage, rng, std, lit, box, cyl, ball, screen } from '../kit.js';

export default function () {
  const s = stage({ bg: 0x070605, fog: [0x070605, 0.016], cam: [0, 6.1, 18], target: [0, 3.7, 0], fov: 30, bloom: [0.38, 0.5, 0.86], exposure: 1.0 });
  const { scene } = s;
  const R = rng(5);

  scene.add(new THREE.HemisphereLight(0x8c9bff, 0x120c08, 0.22));
  const spot = new THREE.SpotLight(0xffe2b8, 460, 40, 0.62, 0.7, 1.6);
  spot.position.set(0, 15, 7);
  spot.target.position.set(0, 2.4, 0);
  spot.castShadow = true;
  spot.shadow.mapSize.set(2048, 2048);
  spot.shadow.bias = -0.0005;
  scene.add(spot, spot.target);

  box(scene, [80, 0.2, 60], [0, -0.1, 0], std(0x0f0c0a, { roughness: 0.45, metalness: 0.2 }), { cast: false });
  box(scene, [80, 30, 0.3], [0, 15, -4.2], std(0x17130f, { roughness: 0.95 }), { cast: false });

  // the desk
  const wood = std(0x6e4a2c, { roughness: 0.55 });
  const dark = std(0x2a1d12, { roughness: 0.6 });
  box(scene, [13, 0.32, 4.8], [0, 2.44, 0], wood);
  for (const x of [-6.1, 6.1]) for (const z of [-2, 2]) box(scene, [0.28, 2.3, 0.28], [x, 1.15, z], dark);
  box(scene, [2.4, 1.7, 4.2], [4.9, 1.45, 0], dark);

  // 2009, left: CRT, beige tower, a shelf of boxed games
  const beige = std(0xcfc6ac, { roughness: 0.85 });
  box(scene, [2.3, 1.95, 2.1], [-3.6, 3.58, -0.9], beige);
  box(scene, [1.2, 0.3, 1.2], [-3.6, 2.7, -0.9], beige);
  screen(scene, 1.8, 1.4, [-3.6, 3.62, 0.17], (g, w, h) => {
    g.fillStyle = '#031a08'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#45ff78'; g.font = 'bold 30px Consolas, monospace';
    ['> java GatherBot', '[ok] hooked client', '[ok] found node 3', 'gathering  41/99', 'banking    done', 'xp/hr      38,200', '> _'].forEach((t, i) => g.fillText(t, 26, 60 + i * 46));
    g.fillStyle = 'rgba(0,0,0,.28)';
    for (let y = 0; y < h; y += 5) g.fillRect(0, y, w, 2);
  }, { boost: 1.1 });
  const green = new THREE.PointLight(0x45ff78, 12, 9, 2);
  green.position.set(-3.6, 3.7, 1.6);
  scene.add(green);
  box(scene, [2.1, 0.14, 0.75], [-3.6, 2.67, 1.35], beige);
  box(scene, [0.34, 0.14, 0.5], [-2.1, 2.67, 1.4], beige);
  box(scene, [0.95, 2.1, 2.1], [-5.6, 3.65, -0.9], beige);
  box(scene, [0.5, 0.06, 0.02], [-5.6, 4.3, 0.16], std(0x8d8672), { cast: false });
  ball(scene, 0.04, [-5.85, 3.2, 0.17], lit(0x45ff78, 4), { cast: false });
  box(scene, [3.6, 0.1, 0.7], [-4.4, 7, -3.7], dark);
  [0xb23a48, 0x2d6a9f, 0xe0a030, 0x3f8f5a, 0x7a4fb5, 0xc65f2e].forEach((c, i) => box(scene, [0.26, 0.95, 0.6], [-5.8 + i * 0.36, 7.52, -3.7], std(c, { roughness: 0.6 })));
  s.label('2009 · CRT and bot scripts', [-4.3, 5.2, 0]);

  // now, right: thin monitors and a wall of agents
  const slate = std(0x15181f, { roughness: 0.35, metalness: 0.6 });
  const agent = (title, hue) => (g, w, h) => {
    g.fillStyle = '#060d16'; g.fillRect(0, 0, w, h);
    g.fillStyle = hue; g.fillRect(0, 0, w, 8);
    g.font = 'bold 24px Consolas, monospace'; g.fillText(title, 20, 46);
    g.font = '20px Consolas, monospace';
    const rows = ['✓ merged  checkout fix', '● testing  sync retry', '● building report view', '✓ shipped  a11y pass', '● reading  ticket 212', '✓ merged  cache key', '● writing  migration'];
    rows.forEach((t, i) => { g.fillStyle = t[0] === '✓' ? '#58f29b' : '#ffc24a'; g.fillText(t[0], 20, 92 + i * 34); g.fillStyle = '#b7c6dd'; g.fillText(t.slice(2), 46, 92 + i * 34); });
  };
  [[2.3, 0.32, 'worker 01', '#39d0ff'], [4.75, -0.32, 'worker 02', '#b78cff']].forEach(([x, ry, title, hue]) => {
    box(scene, [2.4, 1.45, 0.07], [x, 3.82, -1.05], slate, { rot: [0, ry, 0] });
    screen(scene, 2.28, 1.33, [x + Math.sin(ry) * 0.05, 3.82, -1.0], agent(title, hue), { rot: [0, ry, 0], boost: 1.08 });
    cyl(scene, 0.05, 0.05, 0.6, [x, 2.9, -1.15], slate);
    box(scene, [0.8, 0.04, 0.5], [x, 2.62, -1.15], slate);
  });
  box(scene, [2.3, 0.07, 0.72], [3.5, 2.64, 1.2], slate);
  box(scene, [2.3, 0.02, 0.05], [3.5, 2.69, 0.86], lit(0x39d0ff, 3), { cast: false });
  const cyan = new THREE.PointLight(0x4fc8ff, 34, 10, 2);
  cyan.position.set(3.5, 4, 1.4);
  scene.add(cyan);
  const tile = (hue, n) => (g, w, h) => {
    g.fillStyle = '#07101a'; g.fillRect(0, 0, w, h);
    g.fillStyle = hue; g.fillRect(0, 0, 10, h);
    g.font = 'bold 44px Consolas, monospace'; g.fillText(`agent ${n}`, 30, 62);
    g.fillStyle = '#8fa3c0'; [100, 130, 160].forEach((y, i) => g.fillRect(30, y, 150 + ((n * 37 + i * 61) % 180), 12));
  };
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
    const n = r * 6 + c + 3;
    screen(scene, 0.98, 0.52, [1.3 + c * 1.1, 6 + r * 0.66, -4.0], tile(['#39d0ff', '#58f29b', '#ffc24a', '#b78cff'][n % 4], n), { px: 256, boost: 0.95 });
  }
  s.label('Now · a wall of agents', [4.1, 8.3, -4]);

  // the seam: the desk rebuilding itself as the dial turns
  const seam = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 6.4), new THREE.MeshBasicMaterial({ color: 0xffb454 }));
  seam.material.color.multiplyScalar(1.25);
  seam.position.set(0, 5.6, 0.4);
  scene.add(seam);
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(5, 6.4), new THREE.MeshBasicMaterial({ color: 0xffb454, transparent: true, opacity: 0.03, side: THREE.DoubleSide, depthWrite: false }));
  sheet.rotation.y = Math.PI / 2;
  sheet.position.set(0, 5.6, 0);
  scene.add(sheet);
  const bits = [];
  for (let i = 0; i < 150; i++) {
    const k = 0.05 + R() * 0.16, hot = R() < 0.4;
    const m = box(scene, [k, k, k], [(R() - 0.5) * 2.6, 2.7 + R() * R() * 3.6, (R() - 0.5) * 3.6], hot ? lit(0xffb454, 1.5) : std(R() < 0.5 ? 0xcfc6ac : 0x15181f, { roughness: 0.6 }), { cast: !hot });
    m.rotation.set(R() * 3, R() * 3, R() * 3);
    bits.push({ m, y: m.position.y, ph: R() * 6 });
  }
  s.onTick((t) => bits.forEach((b) => { b.m.position.y = b.y + Math.sin(t * 0.8 + b.ph) * 0.07; b.m.rotation.y += 0.004; }));

  // the dial on the front edge of the desk
  screen(scene, 12.6, 0.9, [0, 1.84, 2.43], (g, w, h) => {
    g.fillStyle = '#1a120b'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#a8895f';
    for (let i = 0; i <= 96; i++) g.fillRect(100 + i * ((w - 200) / 96), 10, i % 24 === 0 ? 5 : 2, i % 24 === 0 ? 44 : 22);
    g.font = 'bold 50px "Segoe UI", Arial'; g.textAlign = 'center'; g.fillStyle = '#f1dcb8';
    ['2009', '2012', '2017', '2022', 'NOW'].forEach((y, i) => g.fillText(y, 100 + i * ((w - 200) / 4), h - 14));
  }, { px: 2048, boost: 1.0 });
  cyl(scene, 0.27, 0.27, 0.3, [0, 2.08, 2.6], std(0xd9a441, { roughness: 0.3, metalness: 0.9 }), { rot: [Math.PI / 2, 0, 0] });
  cyl(scene, 0.13, 0.13, 0.32, [0, 2.08, 2.62], lit(0xffb454, 1.8), { rot: [Math.PI / 2, 0, 0], cast: false });
  s.label('drag the dial · ← →', [1.9, 2.15, 2.7], 'hot plain');

  s.hud(`<div class="panel" style="left:50%;bottom:44px;transform:translateX(-50%);font-size:14px">
    Every object is something built that year. <b>Click one</b> and its case study opens on the screen.</div>`);
}
