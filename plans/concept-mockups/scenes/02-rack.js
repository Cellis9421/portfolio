// 2. The rack: every project is a module, skills are patch cables, the years are a step sequencer.
import { THREE, stage, env, rng, std, lit, box, cyl, ball, screen, sun } from '../kit.js';

export default function () {
  const s = stage({ bg: 0x0b0c0f, fog: [0x0b0c0f, 0.005], cam: [-6.5, 7.4, 29.5], target: [0.2, 5.0, 0], fov: 30, bloom: [0.3, 0.5, 0.88], exposure: 1.0 });
  const { scene } = s;
  env(s, 0.9);
  const R = rng(17);

  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x0b0c10, 0.55));
  sun(scene, 0xfff1e0, 1.25, [-8, 16, 20], 22);
  box(scene, [90, 50, 0.3], [0, 10, -1.6], std(0x15171c, { roughness: 0.9 }), { cast: false });
  box(scene, [60, 0.5, 14], [0, -1.6, 2], std(0x3a2618, { roughness: 0.6 }));

  const W = 22, rows = [8.3, 5.3, 2.3];
  const walnut = std(0x5a3a22, { roughness: 0.55 });
  for (const x of [-W / 2 - 0.3, W / 2 + 0.3]) box(scene, [0.6, 11.7, 1.9], [x, 4.5, -0.35], walnut);
  box(scene, [W, 11.5, 0.2], [0, 4.5, -1.05], std(0x08090b));
  const alu = std(0xaab0ba, { roughness: 0.35, metalness: 0.9 });
  for (const y of [9.8, 6.8, 3.8, 0.8, -1.12]) box(scene, [W, 0.14, 0.3], [0, y, 0.02], alu);

  const knob = (x, y, r, c) => {
    cyl(scene, r, r * 1.1, 0.28, [x, y, 0.24], std(c, { roughness: 0.4 }), { rot: [Math.PI / 2, 0, 0] });
    box(scene, [0.035, r * 0.75, 0.02], [x, y + r * 0.5, 0.39], std(c === 0xf2ead8 ? 0x222222 : 0xffffff), { cast: false });
  };
  const jack = (x, y) => {
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.04, 8, 20), alu);
    t.position.set(x, y, 0.14);
    scene.add(t);
    cyl(scene, 0.065, 0.065, 0.05, [x, y, 0.13], std(0x040404), { rot: [Math.PI / 2, 0, 0], cast: false });
    return [x, y];
  };
  const panel = (x, y, w, c) => {
    box(scene, [w - 0.05, 2.82, 0.12], [x + w / 2, y, 0.06], std(c, { roughness: 0.5, metalness: 0.35 }));
    for (const dx of [0.14, w - 0.14]) for (const dy of [-1.28, 1.28]) cyl(scene, 0.045, 0.045, 0.03, [x + dx, y + dy, 0.13], alu, { rot: [Math.PI / 2, 0, 0], cast: false });
  };

  const names = ['Enterprise hub', 'API client generator', 'Dynamic forms', 'Multi-tenancy', 'Checkout', 'Virtual labs', 'Dashboards', 'Marketing site',
    'Webflow migration', 'E-commerce site', 'Reporting server', 'Diagnostics', 'Catalog sync', 'Accessibility', 'Demo mocks', 'Sales demos', 'Forums', 'Onboarding'];
  const hues = ['#39d0ff', '#58f29b', '#ffc24a', '#ff6b5e', '#b78cff'];
  const face = (title, hue, kind) => (g, w, h) => {
    g.fillStyle = '#050b12'; g.fillRect(0, 0, w, h);
    g.fillStyle = hue; g.font = `bold ${Math.round(h * 0.2)}px "Segoe UI", Arial`; g.fillText(title, 10, h * 0.26, w - 20);
    g.strokeStyle = hue; g.lineWidth = 3;
    if (kind % 2) { g.beginPath(); for (let i = 0; i <= 16; i++) { const y = h * (0.9 - (0.15 + R() * 0.4)); if (i) g.lineTo(10 + i * ((w - 20) / 16), y); else g.moveTo(10, y); } g.stroke(); }
    else for (let i = 0; i < 9; i++) { const b = (0.15 + R() * 0.4) * h; g.fillRect(10 + i * ((w - 20) / 9), h * 0.92 - b, (w - 20) / 9 - 4, b); }
  };
  const colors = [0x1c1e24, 0x262a33, 0xd8d0bc, 0x1c1e24, 0x1f5a56, 0x262a33, 0xb5562a, 0x1c1e24, 0x24305a];
  const targets = [];
  let n = 0, firstProject = null, blanks = null;

  rows.forEach((y, r) => {
    let x = -W / 2;
    if (r === 0) {
      // the master module: who this is
      panel(x, y, 5.2, 0xf2ead8);
      screen(scene, 4.6, 1.45, [x + 2.6, y + 0.52, 0.125], (g, w, h) => {
        g.fillStyle = '#0c0a06'; g.fillRect(0, 0, w, h);
        g.fillStyle = '#ffb454'; g.font = 'bold 74px "Segoe UI", Arial'; g.fillText('CALVIN ELLIS', 22, 86);
        g.fillStyle = '#f2ead8'; g.font = '30px "Segoe UI", Arial'; g.fillText('principal software engineer', 24, 134);
        g.fillStyle = '#9c9480'; g.font = '24px Consolas, monospace'; g.fillText('15 years · front end · back end · infra · agents', 24, 176);
      }, { px: 640, boost: 1.1 });
      knob(x + 0.9, y - 0.75, 0.3, 0x1c1e24); knob(x + 2.0, y - 0.75, 0.2, 0x1c1e24); knob(x + 2.8, y - 0.75, 0.2, 0x1c1e24);
      jack(x + 3.8, y - 0.75); jack(x + 4.5, y - 0.75);
      ball(scene, 0.07, [x + 4.8, y + 1.25, 0.14], lit(0xff4d4d, 3), { cast: false });
      s.label('Who: the master module', [x + 2.6, y + 1.5, 0.3]);
      x += 5.2;
      // skills: where every cable starts
      panel(x, y, 3.2, 0x1c1e24);
      const sk = ['TypeScript', 'Python', 'Shopify', 'Java', 'Go and infra'];
      screen(scene, 2.0, 2.5, [x + 2.0, y, 0.125], (g, w, h) => {
        g.fillStyle = '#1c1e24'; g.fillRect(0, 0, w, h);
        g.font = 'bold 30px "Segoe UI", Arial';
        sk.forEach((t, i) => { g.fillStyle = hues[i]; g.fillText(t, 6, 44 + i * (h / 5.15)); });
      }, { px: 256, boost: 0.95 });
      sk.forEach((t, i) => targets.push({ skill: i, at: jack(x + 0.55, y + 1.0 - i * 0.5) }));
      s.label('Skills are cables. Pull one and its projects light.', [x + 1.6, y + 1.5, 0.3]);
      x += 3.2;
    }
    const widths = [2.2, 1.7, 2.6, 2.2];
    while (x < W / 2 - 0.2) {
      let w = widths[n % 4];
      const left = W / 2 - x;
      if (left - w < 1.5) w = left;
      const blank = r === 2 && left <= 4.6;
      panel(x, y, w, blank ? 0x9aa0aa : colors[n % colors.length]);
      if (blank) {
        if (!blanks) blanks = [x + w / 2, y];
      } else {
        const hue = hues[n % 5], dark = colors[n % colors.length] !== 0xd8d0bc;
        screen(scene, w - 0.42, 0.95, [x + w / 2, y + 0.78, 0.125], face(names[n % names.length], hue, n), { px: 256, boost: 1.1 });
        const k = w > 2 ? 3 : 2;
        for (let i = 0; i < k; i++) knob(x + (w * (i + 0.5)) / k, y - 0.25, 0.2, dark ? 0xf2ead8 : 0x1c1e24);
        const spot = [];
        for (let i = 0; i < k; i++) spot.push(jack(x + (w * (i + 0.5)) / k, y - 1.02));
        ball(scene, 0.06, [x + w - 0.3, y + 0.16, 0.14], lit(new THREE.Color(hue), 2.6), { cast: false });
        targets.push({ module: n, at: spot[0], alt: spot[spot.length - 1], cx: x + w / 2, y, w });
        n++;
      }
      x += w;
    }
  });

  // patch cables: each skill runs to the modules built with it
  const mods = targets.filter((t) => t.module !== undefined);
  targets.filter((t) => t.skill !== undefined).forEach((src) => {
    const hue = new THREE.Color(hues[src.skill]);
    for (let k = 0; k < 3; k++) {
      const m = mods[Math.floor(R() * mods.length)], to = k % 2 ? m.alt : m.at;
      const a = new THREE.Vector3(src.at[0], src.at[1], 0.3), b = new THREE.Vector3(to[0], to[1], 0.3);
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.y = Math.min(a.y, b.y) - 1.2 - R() * 1.6;
      mid.z = 1.5 + R() * 1.2;
      const hot = src.skill === 0;
      const cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 48, 0.06, 8), hot ? lit(hue, 1.5) : std(hue, { roughness: 0.45 }));
      cable.castShadow = true;
      scene.add(cable);
      for (const p of [a, b]) cyl(scene, 0.09, 0.09, 0.3, [p.x, p.y, 0.3], std(0x15171c, { metalness: 0.6, roughness: 0.4 }), { rot: [Math.PI / 2, 0, 0] });
      if (hot) {
        const glow = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(m.w - 0.02, 2.86, 0.16)), new THREE.LineBasicMaterial({ color: hue }));
        glow.position.set(m.cx, m.y, 0.07);
        scene.add(glow);
      }
    }
  });
  const pm = mods.filter((m) => m.y === rows[1])[3];
  if (pm) firstProject = [pm.cx, pm.y];
  if (firstProject) s.label('Projects: one module each. The screen is the live app ↗', [firstProject[0], firstProject[1] + 1.5, 0.3], 'hot');
  if (blanks) s.label('blank panels · room for the next one', [blanks[0] + 1.2, blanks[1] + 1.5, 0.3]);

  // the sequencer: one step a year, the playhead on 2019
  box(scene, [W - 0.05, 1.75, 0.12], [0, -0.16, 0.06], std(0x15171c, { roughness: 0.5, metalness: 0.4 }));
  const era = (y) => (y < 2012 ? 0x5fae6a : y < 2017 ? 0xd9a441 : y < 2022 ? 0xd86a3a : y < 2026 ? 0x4f8fd9 : 0x9a6fe0);
  const sx = (i) => -W / 2 + 2.2 + i * ((W - 3.4) / 17);
  for (let i = 0; i < 18; i++) {
    const year = 2009 + i, on = year === 2019;
    box(scene, [0.78, 0.78, 0.18], [sx(i), -0.32, 0.17], on ? lit(0xffffff, 1.7) : lit(era(year), 0.55));
    ball(scene, 0.055, [sx(i), 0.25, 0.14], lit(on ? 0xffffff : era(year), on ? 3 : 1.2), { cast: false });
  }
  screen(scene, W - 3.4 + 0.9, 0.3, [(sx(0) + sx(17)) / 2, 0.52, 0.125], (g, w, h) => {
    g.fillStyle = '#15171c'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#c9ced6'; g.font = `bold ${Math.round(h * 0.7)}px Consolas, monospace`; g.textAlign = 'center';
    for (let i = 0; i < 18; i++) g.fillText(`'${String(9 + i).padStart(2, '0')}`, (w * (0.45 + i * ((W - 3.4) / 17))) / (W - 3.4 + 0.9), h * 0.8);
  }, { px: 2048, boost: 0.95 });
  cyl(scene, 0.34, 0.34, 0.2, [-W / 2 + 0.85, -0.2, 0.2], lit(0x58f29b, 1.6), { rot: [Math.PI / 2, 0, 0] });
  s.label('Timeline: one step a year. Press play and hear it.', [sx(10), 0.75, 0.4], 'hot');

  s.hud(`<div class="panel mono" style="right:26px;bottom:40px;font-size:13px"><span style="color:#58f29b">▶</span> 2019 · 4 modules playing · ♪ on</div>`);
}
