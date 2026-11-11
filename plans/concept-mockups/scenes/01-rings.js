// 1. Growth rings: a slab of tree, one ring a year, every project an inlay in the ring it shipped in.
import { THREE, stage, rng, std, lit, box, cyl, canvasTex, screen, tube } from '../kit.js';

export default function () {
  const s = stage({ bg: 0x0b0907, fog: [0x0b0907, 0.008], cam: [0.6, 27.5, 24.5], target: [0.2, 0.2, 1.4], fov: 32, bloom: [0.38, 0.55, 0.82], exposure: 1.12 });
  const { scene } = s;
  const R = rng(4);

  scene.add(new THREE.HemisphereLight(0xffe9cf, 0x120c08, 0.28));
  const key = new THREE.SpotLight(0xffe0b5, 760, 90, 0.55, 0.6, 1.4);
  key.position.set(-18, 24, 12);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0004;
  scene.add(key, key.target);
  const rim = new THREE.PointLight(0x6fb6ff, 260, 70, 2);
  rim.position.set(18, 9, -16);
  scene.add(rim);
  box(scene, [120, 1, 90], [0, -0.5, 0], std(0x2a1c12, { roughness: 0.62 }), { cast: false });

  const rad = (year) => 1.1 + (year - 2009) * 0.5;
  const eras = [
    { name: 'Game bots', from: 2009, to: 2012, hue: '#5fae6a', top: 1.2 },
    { name: 'Client sites', from: 2012, to: 2017, hue: '#d9a441', top: 1.02 },
    { name: 'Stove & Grill Parts', from: 2017, to: 2022, hue: '#d86a3a', top: 0.84 },
    { name: 'Cybrary', from: 2022, to: 2026, hue: '#4f8fd9', top: 0.66 },
    { name: 'Now', from: 2026, to: 2027, hue: '#9a6fe0', top: 0.5 },
  ];
  const RMAX = rad(2027);
  const topAt = (r) => (eras.find((e) => r <= rad(e.to)) ?? eras[4]).top;

  const wood = canvasTex(2048, 2048, (g, w) => {
    const c = w / 2, k = c / RMAX;
    g.fillStyle = '#c9a06a';
    g.fillRect(0, 0, w, w);
    const ring = (r, i) => {
      g.beginPath();
      for (let a = 0; a <= 360; a += 2) {
        const t = (a * Math.PI) / 180, rr = r * k + Math.sin(t * 3 + i) * 6 + Math.sin(t * 7 + i * 2.1) * 3;
        const x = c + Math.cos(t) * rr, y = c + Math.sin(t) * rr;
        if (a) g.lineTo(x, y); else g.moveTo(x, y);
      }
      g.closePath();
    };
    [...eras].reverse().forEach((e, i) => {
      ring(rad(e.to), i);
      g.globalAlpha = 1; g.fillStyle = '#c9a06a'; g.fill();
      g.globalAlpha = 0.3; g.fillStyle = e.hue; g.fill();
    });
    g.globalAlpha = 1;
    for (let y = 2009; y <= 2027; y++) {
      for (let f = 1; f < 5; f++) { ring(rad(y) - f * 0.1, y + f); g.strokeStyle = 'rgba(90,55,25,.22)'; g.lineWidth = 2; g.stroke(); }
      ring(rad(y), y);
      g.strokeStyle = 'rgba(70,38,16,.7)'; g.lineWidth = 5; g.stroke();
    }
    g.strokeStyle = 'rgba(50,28,14,.55)'; g.lineWidth = 4;
    for (const a of [0.9, 4.3]) { g.beginPath(); g.moveTo(c + Math.cos(a) * 30, c + Math.sin(a) * 30); g.lineTo(c + Math.cos(a + 0.05) * c * 0.98, c + Math.sin(a + 0.05) * c * 0.98); g.stroke(); }
    g.fillStyle = '#4a2c14'; g.beginPath(); g.arc(c, c, 16, 0, 7); g.fill();
  });

  cyl(scene, RMAX + 0.4, RMAX + 0.45, 0.42, [0, 0.21, 0], std(0x35251a, { roughness: 1 }), { seg: 96 });
  const side = std(0x8a6238, { roughness: 0.8 });
  eras.forEach((e) => {
    const t = wood.clone(), k = rad(e.to) / RMAX;
    t.repeat.set(k, k);
    t.offset.set((1 - k) / 2, (1 - k) / 2);
    t.needsUpdate = true;
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rad(e.to), rad(e.to), e.top, 128), [side, std(0xffffff, { map: t, roughness: 0.55 }), side]);
    m.position.y = e.top / 2;
    m.castShadow = m.receiveShadow = true;
    scene.add(m);
  });

  // inlays: one per project, in the ring of the year it shipped, coloured by its main skill
  const skills = [0x39d0ff, 0x58f29b, 0xffc24a, 0xff6b5e, 0xb78cff];
  const counts = [1, 1, 2, 2, 2, 2, 3, 2, 3, 4, 4, 4, 4, 5, 5, 6, 7, 5];
  counts.forEach((n, i) => {
    const year = 2009 + i, r = rad(year) + 0.25, y = topAt(r) + 0.04, a0 = R() * 6.28;
    for (let j = 0; j < n; j++) {
      const a = a0 + (j / n) * Math.PI * 2 + (R() - 0.5) * 0.25, big = R() < 0.22;
      cyl(scene, big ? 0.27 : 0.17, big ? 0.27 : 0.17, 0.09, [Math.cos(a) * r, y, Math.sin(a) * r], lit(skills[Math.floor(R() * skills.length)], 2.1), { seg: 6, cast: false });
    }
  });
  const edge = rad(2026) + 0.25;
  for (let j = 0; j < 7; j++) {
    const a = 0.75 + j * 0.2;
    const socket = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 8, 24), std(0x2a1a0e, { roughness: 0.9 }));
    socket.rotation.x = Math.PI / 2;
    socket.position.set(Math.cos(a) * edge, 0.52, Math.sin(a) * edge);
    scene.add(socket);
  }
  s.label('empty sockets · the next small things', [Math.cos(1.3) * edge, 0.6, Math.sin(1.3) * edge]);

  // the thread through all of it, poured in resin from the heart to the bark
  const vein = [];
  for (let r = 0.3; r <= RMAX; r += 0.4) { const a = 3.55 + Math.sin(r * 0.8) * 0.22; vein.push([Math.cos(a) * r, topAt(r) + 0.03, Math.sin(a) * r]); }
  for (let i = 0; i < vein.length - 1; i++) tube(scene, [vein[i], vein[i + 1]], 0.07, lit(0x2fe0c8, 1.5), 4);
  s.label('the thread: things that run on their own', [vein[14][0], 1.0, vein[14][2]]);

  // the brass arm reads the years off the radius and scrubs time when dragged
  const brass = std(0xd9a441, { roughness: 0.3, metalness: 0.9 });
  const arm = 0.36, len = RMAX + 1.5;
  box(scene, [len, 0.07, 0.2], [(Math.cos(arm) * len) / 2, 1.42, (Math.sin(arm) * len) / 2], brass, { rot: [0, -arm, 0] });
  cyl(scene, 0.34, 0.34, 0.3, [0, 1.4, 0], brass);
  cyl(scene, 0.3, 0.3, 0.2, [Math.cos(arm) * len, 1.44, Math.sin(arm) * len], lit(0xffb454, 1.8), { cast: false });
  for (const y of [2009, 2012, 2017, 2022, 2026]) s.label(String(y), [Math.cos(arm) * rad(y), 1.5, Math.sin(arm) * rad(y)], 'plain');
  s.label('Timeline: drag the arm and the tree un-grows', [Math.cos(arm) * len, 1.6, Math.sin(arm) * len], 'hot');
  eras.forEach((e) => {
    const r = (rad(e.from) + rad(e.to)) / 2, a = 4.05;
    s.label(e.name, [Math.cos(a) * r, e.top + 0.1, Math.sin(a) * r], 'plain');
  });

  // the loupe: zoom is the only control
  const lr = rad(2019) + 0.25, la = 1.78, lp = [Math.cos(la) * lr, 0.88, Math.sin(la) * lr];
  cyl(scene, 0.22, 0.22, 0.08, lp, lit(0xffc24a, 2.2), { seg: 6, cast: false });
  const loupe = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.08, 12, 48), brass);
  loupe.rotation.x = Math.PI / 2;
  loupe.position.set(lp[0], 1.75, lp[2]);
  loupe.castShadow = true;
  scene.add(loupe);
  cyl(scene, 0.93, 0.93, 0.03, [lp[0], 1.75, lp[2]], new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.2, roughness: 0.05 }), { cast: false, seg: 48 });
  cyl(scene, 0.09, 0.07, 2.1, [lp[0] - 1.75, 1.75, lp[2] + 0.75], brass, { rot: [0, 0.4, Math.PI / 2] });
  s.label('Projects: Reporting server · 2019 · zoom in and it opens live ↗', [lp[0], 2.0, lp[2]], 'hot');

  screen(scene, 5.6, 1.17, [-9.9, 0.03, 9.5], (g, w, h) => {
    g.fillStyle = '#1c130b'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#d9a441'; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16);
    g.fillStyle = '#f1dcb8'; g.font = 'bold 84px "Segoe UI", Arial'; g.fillText('CALVIN ELLIS', 40, 104);
    g.fillStyle = '#d9a441'; g.font = '38px "Segoe UI", Arial'; g.fillText('principal software engineer · 18 rings so far', 42, 168);
  }, { px: 1024, rot: [-Math.PI / 2, 0, 0], boost: 1.0 });
  s.label('Who: the whole slab. Zoom out and it is one person.', [-9.9, 0.3, 8.8]);

  s.hud(`<div class="panel" style="right:26px;top:24px;width:226px">
    <b>Light a skill</b>
    ${[['#39d0ff', 'TypeScript'], ['#58f29b', 'Python'], ['#ffc24a', 'Shopify'], ['#ff6b5e', 'Java'], ['#b78cff', 'Go and infra']].map(([c, n]) => `<div><span style="color:${c}">⬢</span> ${n}</div>`).join('')}</div>`);
  s.hud(`<div class="panel" style="left:50%;bottom:40px;transform:translateX(-50%);font-size:14px">
    <b>Zoom is the only control.</b> Person → years → project → the live thing, in one move.</div>`);
}
