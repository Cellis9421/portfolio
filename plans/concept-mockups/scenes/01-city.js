// 1. The city that builds itself: night plot, one district per era, a crew that never stops.
import { THREE, stage, rng, std, lit, box, cyl, ball, canvasTex, screen, sun, line } from '../kit.js';

export default function () {
  const s = stage({ bg: 0x060a14, fog: [0x060a14, 0.0095], cam: [31, 27, 39], target: [-1, 2, -2], fov: 30, bloom: [0.42, 0.6, 0.78], exposure: 1.15 });
  const { scene } = s;
  const R = rng(11);

  scene.add(new THREE.HemisphereLight(0x6a86d8, 0x05070d, 0.6));
  sun(scene, 0x93a9ff, 0.9, [-18, 30, 12], 44);

  box(scene, [260, 0.2, 260], [0, -0.1, 0], std(0x0a1122, { roughness: 0.95 }), { cast: false });
  const grid = new THREE.GridHelper(180, 180, 0x1d2c50, 0x101a31);
  grid.position.y = 0.012;
  scene.add(grid);

  const windows = (warm) => canvasTex(64, 128, (g, w, h) => {
    g.fillStyle = '#000';
    g.fillRect(0, 0, w, h);
    for (let y = 5; y < h - 8; y += 12) for (let x = 5; x < w - 8; x += 12) {
      if (R() < 0.48) continue;
      g.fillStyle = warm ? (R() < 0.6 ? '#ffcf87' : '#ff9d4d') : (R() < 0.6 ? '#9fe0ff' : '#e6f7ff');
      g.fillRect(x, y, 7, 8);
    }
  });
  const texes = [windows(true), windows(false), windows(true), windows(false)];
  const roof = std(0x1a2440, { roughness: 0.6 });
  const wall = (i) => new THREE.MeshStandardMaterial({ color: 0x18223c, roughness: 0.7, emissive: 0xffffff, emissiveMap: texes[i % 4], emissiveIntensity: 1.15 });

  const eras = [
    { name: '2009 · Game bots', hue: 0x7cff8a, at: [-21, -3], done: 1 },
    { name: '2012 · Client sites', hue: 0xffd166, at: [-10, -15], done: 1 },
    { name: '2017 · E-commerce', hue: 0xff8a4c, at: [3, -17], done: 1, hot: true },
    { name: '2022 · Cybrary', hue: 0x66c7ff, at: [16, -9], done: 0.6 },
    { name: 'Now · Agents', hue: 0xc792ff, at: [18, 6], done: 0.18 },
  ];
  const depots = [[-36, 22], [-8, 34], [38, 22]];
  const workers = [];
  const carryMat = std(0xa9bde0, { roughness: 0.5 });

  function worker(from, to, hue, speed) {
    const g = new THREE.Group();
    ball(g, 0.23, [0, 0.3, 0], lit(hue, 2.3), { cast: false });
    const load = box(g, [0.36, 0.36, 0.36], [0, 0.85, 0], carryMat);
    scene.add(g);
    workers.push({ g, load, a: new THREE.Vector3(from[0], 0, from[1]), b: new THREE.Vector3(to[0], 0, to[1]), phase: R() * 2, speed });
    return g;
  }

  eras.forEach((e, idx) => {
    const g = new THREE.Group();
    g.position.set(e.at[0], 0, e.at[1]);
    scene.add(g);
    box(g, [10, 0.3, 10], [0, 0.15, 0], std(0x121a2e, { roughness: 0.8 }));
    const rim = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(10.1, 0.32, 10.1)), new THREE.LineBasicMaterial({ color: e.hue }));
    rim.position.y = 0.16;
    g.add(rim);
    let tallest = 2, k = 0;
    for (let ix = -1; ix <= 1; ix++) for (let iz = -1; iz <= 1; iz++) {
      const w = 1.7 + R() * 0.9, d = 1.7 + R() * 0.9, h = 1.6 + R() * R() * 7 + idx * 0.6;
      const x = ix * 3.1 + (R() - 0.5) * 0.5, z = iz * 3.1 + (R() - 0.5) * 0.5;
      const built = e.done >= 1 ? 1 : THREE.MathUtils.clamp((e.done - k / 9) * 3.5 + 0.35, 0, 1);
      k++;
      tallest = Math.max(tallest, h);
      if (built > 0.08) {
        const side = wall(k + idx);
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h * built, d), [side, side, roof, roof, side, side]);
        m.position.set(x, 0.3 + (h * built) / 2, z);
        m.castShadow = m.receiveShadow = true;
        g.add(m);
      }
      if (built < 1) {
        const ghost = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), new THREE.LineBasicMaterial({ color: e.hue, transparent: true, opacity: 0.8 }));
        ghost.position.set(x, 0.3 + h / 2, z);
        g.add(ghost);
      }
    }
    const glow = new THREE.PointLight(e.hue, (e.hot ? 190 : 70) * (0.35 + e.done), 24, 2);
    glow.position.set(0, 6, 0);
    g.add(glow);
    s.label(e.name, [e.at[0], e.done < 0.5 ? 3.2 : tallest + 2.2, e.at[1]], e.hot ? 'hot' : '');

    const crew = e.done >= 1 ? 5 : 16;
    for (let i = 0; i < crew; i++) {
      const d = depots[(idx + i) % depots.length];
      worker([d[0] + (R() - 0.5) * 6, d[1] + (R() - 0.5) * 6], [e.at[0] + (R() - 0.5) * 9, e.at[1] + (R() - 0.5) * 9], 0xffb454, 0.035 + R() * 0.03);
    }
    for (const d of depots) line(scene, [[d[0], 0.03, d[1]], [e.at[0], 0.03, e.at[1]]], 0x2a4174, { opacity: 0.55 });

  });

  // crane over the district still going up
  const crane = new THREE.Group();
  crane.position.set(21.5, 0, -13.5);
  scene.add(crane);
  const steel = std(0x33415f, { roughness: 0.5, metalness: 0.4 });
  box(crane, [0.5, 15, 0.5], [0, 7.5, 0], steel);
  box(crane, [0.35, 0.35, 11], [0, 14.6, 3.4], steel, { rot: [0, 0.55, 0] });
  ball(crane, 0.22, [0, 15.4, 0], lit(0xff4d4d, 4), { cast: false });
  line(crane, [[-3.4, 14.5, 6.2], [-3.4, 9.2, 6.2]], 0x9fb4d8, { opacity: 0.8 });
  box(crane, [1.6, 0.5, 1.6], [-3.4, 9, 6.2], std(0x8fa6cf, { roughness: 0.5 }));

  // the name going up on scaffolding, the last letters still outlines
  const signAt = [-6, 0, 5], yaw = Math.atan2(31, 39);
  const sign = new THREE.Group();
  sign.position.set(...signAt);
  sign.rotation.y = yaw;
  scene.add(sign);
  screen(sign, 19, 3.2, [0, 4.4, 0], (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.font = '800 132px "Segoe UI", Arial, sans-serif';
    g.textBaseline = 'middle';
    const text = 'CALVIN ELLIS';
    let x = 14;
    [...text].forEach((ch, i) => {
      if (i < 8) { g.fillStyle = '#ffffff'; g.fillText(ch, x, h / 2 + 6); }
      else { g.strokeStyle = '#ffb454'; g.lineWidth = 3; g.setLineDash([9, 7]); g.strokeText(ch, x, h / 2 + 6); }
      x += g.measureText(ch).width + 6;
    });
  }, { px: 1100, transparent: true, boost: 1.1, side: THREE.DoubleSide });
  for (let i = 0; i <= 6; i++) box(sign, [0.12, 6.4, 0.12], [-9.4 + i * 3.13, 3.2, -0.5], steel);
  for (const y of [2.5, 6.3]) box(sign, [19.2, 0.1, 0.1], [0, y, -0.5], steel);
  box(sign, [19.6, 0.16, 1.2], [0, 2.5, -0.1], std(0x26314d));
  for (const x of [3.2, 5.6, 8.1]) ball(sign, 0.2, [x, 2.9, 0.15], lit(0xffb454, 1.9), { cast: false });

  // the one lamp the plot starts with
  cyl(scene, 0.09, 0.12, 4.6, [-17, 2.3, 11], steel);
  ball(scene, 0.34, [-17, 4.8, 11], lit(0xffe2a8, 2.6), { cast: false });
  const lamp = new THREE.PointLight(0xffd9a0, 90, 26, 2);
  lamp.position.set(-17, 4.6, 11);
  scene.add(lamp);

  // the ticket: one worker, ringed, on its way to the district the visitor asked for
  const hot = eras[2];
  const runner = worker([-2, 13], [hot.at[0] - 1, hot.at[1] + 6], 0xffffff, 0);
  workers[workers.length - 1].phase = 0.42;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.75, 0.95, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
  ring.material.color.multiplyScalar(1.2);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.06;
  runner.add(ring);
  line(scene, [[-2, 0.08, 13], [hot.at[0] - 1, 0.08, hot.at[1] + 6]], 0xffffff, { dashed: 0.7, opacity: 0.9 });
  const tag = s.label('worker 07 · ticket 12', [0, 0, 0], 'hot');

  s.onTick((t) => {
    for (const w of workers) {
      const u = (t * w.speed + w.phase) % 2;
      const k = u < 1 ? u : 2 - u;
      w.g.position.lerpVectors(w.a, w.b, k);
      w.g.position.y = Math.abs(Math.sin(t * 6 + w.phase * 9)) * 0.08;
      w.load.visible = u < 1;
    }
    tag.pos.copy(runner.position).setY(1.4);
    ring.scale.setScalar(1 + Math.sin(t * 4) * 0.12);
  });

  s.hud(`<div class="panel mono" style="left:50%;bottom:58px;transform:translateX(-50%);min-width:470px;font-size:16px">
    <span style="color:#ffb454">ticket &gt;</span> show me the e-commerce work<span style="color:#ffb454">▍</span></div>`);
  s.hud(`<div class="panel" style="right:28px;top:24px;width:255px">
    <div style="font-size:11px;letter-spacing:.14em;color:#8fa3d0">TICKET 12</div>
    <div style="font-weight:700;font-size:16px;margin:2px 0 8px">Show the e-commerce work</div>
    <div><span style="color:#ffb454">●</span> claimed by worker 07</div>
    <div><span style="color:#7cff8a">●</span> walking to 2017, lights going up</div>
    <div class="dim" style="margin-top:8px">Crew of ${workers.length} · 2 districts still building</div></div>`);
}
