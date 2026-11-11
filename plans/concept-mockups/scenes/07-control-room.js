// 7. The control room: a wall of live projects and a table of systems with data moving as light.
import { THREE, stage, rng, std, lit, box, cyl, ball, screen, line } from '../kit.js';

export default function () {
  const s = stage({ bg: 0x04060b, fog: [0x04060b, 0.008], cam: [0, 7.6, 21], target: [0, 3.9, -3], fov: 40, bloom: [0.45, 0.6, 0.8], exposure: 1.1 });
  const { scene } = s;
  const R = rng(9);

  scene.add(new THREE.HemisphereLight(0x5f86ff, 0x05070c, 0.25));
  const over = new THREE.PointLight(0x49e6ff, 110, 40, 2);
  over.position.set(0, 9, 2);
  scene.add(over);
  box(scene, [120, 0.2, 120], [0, -0.1, 0], std(0x0a0e16, { roughness: 0.45, metalness: 0.6 }), { cast: false });

  // the wall
  const hues = ['#49e6ff', '#6dffa8', '#ff5fd2', '#ffc24a'];
  const names = ['Enterprise hub', 'API client generator', 'Dynamic forms', 'Multi-tenancy', 'Checkout', 'Virtual labs', 'Dashboards',
    'Marketing site', 'Webflow migration', 'E-commerce site', 'Reporting server', 'Diagnostics', 'Catalog sync', 'Accessibility'];
  const draw = (title, hue, type) => (g, w, h) => {
    g.fillStyle = '#06111b'; g.fillRect(0, 0, w, h);
    g.fillStyle = hue; g.fillRect(0, 0, w, 6);
    g.font = 'bold 30px "Segoe UI", Arial'; g.fillText(title, 22, 52);
    g.fillStyle = '#5d7391'; g.font = '18px "Segoe UI", Arial'; g.fillText('live', w - 62, 50);
    g.fillStyle = '#6dffa8'; g.beginPath(); g.arc(w - 78, 44, 6, 0, 7); g.fill();
    g.strokeStyle = hue; g.fillStyle = hue; g.lineWidth = 4;
    if (type === 0) {
      g.beginPath();
      for (let i = 0; i <= 24; i++) { const y = h - 50 - (0.25 + 0.5 * R() + i * 0.012) * (h - 150); i ? g.lineTo(24 + i * ((w - 48) / 24), y) : g.moveTo(24, y); }
      g.stroke();
    } else if (type === 1) {
      for (let i = 0; i < 12; i++) { const b = (0.2 + R() * 0.75) * (h - 140); g.fillRect(28 + i * ((w - 56) / 12), h - 40 - b, (w - 56) / 12 - 10, b); }
    } else if (type === 2) {
      g.font = '19px Consolas, monospace';
      for (let i = 0; i < 8; i++) { g.fillStyle = i % 3 ? '#9fb4cf' : hue; g.fillRect(28 + (i % 3) * 22, 86 + i * 25, 90 + R() * 300, 11); }
    } else {
      for (let i = 0; i < 40; i++) { g.globalAlpha = 0.35 + R() * 0.65; g.beginPath(); g.arc(30 + R() * (w - 60), 90 + R() * (h - 130), 3 + R() * 7, 0, 7); g.fill(); }
      g.globalAlpha = 1;
    }
  };
  const rad = 17, cz = 6, panes = [];
  for (let r = 0; r < 2; r++) for (let k = 0; k < 7; k++) {
    const a = (k - 3) * 0.285, i = r * 7 + k;
    const p = [Math.sin(a) * rad, 3.5 + r * 3.05, cz - Math.cos(a) * rad];
    box(scene, [4.6, 2.85, 0.12], [p[0] + Math.sin(a) * 0.12, p[1], p[2] - Math.cos(a) * 0.12], std(0x0c1119, { roughness: 0.4, metalness: 0.6 }), { rot: [0, -a, 0] });
    screen(scene, 4.4, 2.65, p, draw(names[i], hues[i % 4], (i * 3 + r) % 4), { rot: [0, -a, 0], boost: 1.12 });
    panes.push({ p, a });
  }
  for (const [x, hue] of [[-11, 0x49e6ff], [0, 0xff5fd2], [11, 0x6dffa8]]) {
    const wash = new THREE.PointLight(hue, 55, 24, 2);
    wash.position.set(x, 3.5, -6);
    scene.add(wash);
  }

  // the table and the map of systems above it
  const tz = 4;
  cyl(scene, 4.3, 4.6, 1.0, [0, 0.5, tz], std(0x0d121b, { roughness: 0.35, metalness: 0.7 }), { seg: 64 });
  const ringT = new THREE.Mesh(new THREE.TorusGeometry(4.3, 0.06, 10, 96), lit(0x49e6ff, 2));
  ringT.rotation.x = Math.PI / 2;
  ringT.position.set(0, 1.02, tz);
  scene.add(ringT);
  cyl(scene, 4.1, 4.1, 0.02, [0, 1.03, tz], new THREE.MeshBasicMaterial({ color: 0x49e6ff, transparent: true, opacity: 0.1 }), { seg: 64, cast: false });

  const hub = new THREE.Vector3(0, 3.4, tz);
  ball(scene, 0.42, hub.toArray(), lit(0xffffff, 1.4), { cast: false });
  s.label('Catalog', [hub.x, hub.y + 0.55, hub.z], 'plain');
  const systems = ['Shopify', 'Amazon', 'eBay', 'Walmart', 'Etsy', 'Google', 'Warehouse', 'Reports'];
  const flows = [];
  systems.forEach((name, i) => {
    const a = (i / systems.length) * Math.PI * 2 + 0.35;
    const p = new THREE.Vector3(Math.cos(a) * 3.3, 2.0 + (i % 3) * 0.75, tz + Math.sin(a) * 3.3);
    const hot = name === 'Amazon';
    ball(scene, hot ? 0.3 : 0.22, p.toArray(), lit(hot ? 0xffc24a : 0x49e6ff, 2), { cast: false });
    s.label(name, [p.x, p.y + 0.3, p.z], hot ? 'hot plain' : 'plain');
    const mid = hub.clone().add(p).multiplyScalar(0.5).setY(Math.max(hub.y, p.y) + 1.1);
    const arc = new THREE.QuadraticBezierCurve3(hub, mid, p);
    line(scene, arc.getPoints(40).map((q) => q.toArray()), hot ? 0xffc24a : 0x49e6ff, { opacity: 0.55 });
    for (let k = 0; k < 3; k++) flows.push({ arc, m: ball(scene, 0.07, [0, 0, 0], lit(hot ? 0xffe0a0 : 0xd8fbff, 2.6), { cast: false }), ph: k / 3 + R(), back: i % 2 });
    if (hot) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.03, 8, 40), lit(0xffc24a, 2.4));
      ring.position.copy(p);
      scene.add(ring);
      const pane = panes[12];
      line(scene, [p.toArray(), [pane.p[0], pane.p[1], pane.p[2] + 0.2]], 0xffc24a, { dashed: 0.35, opacity: 0.9 });
      const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4.7, 2.95, 0.05)), new THREE.LineBasicMaterial({ color: 0xffc24a }));
      frame.position.set(pane.p[0], pane.p[1], pane.p[2] + 0.1);
      frame.rotation.y = -pane.a;
      scene.add(frame);
      s.label('Catalog sync · flying in', [pane.p[0], pane.p[1] + 1.5, pane.p[2]], 'hot');
    }
  });
  s.onTick((t) => flows.forEach((f) => {
    const u = (t * 0.22 + f.ph) % 1;
    f.m.position.copy(f.arc.getPoint(f.back ? 1 - u : u));
  }));

  // consoles either side, to give the room a floor
  for (const x of [-9.5, 9.5]) {
    box(scene, [5, 1.1, 1.6], [x, 0.55, 7.5], std(0x0d121b, { roughness: 0.35, metalness: 0.7 }), { rot: [0, x > 0 ? -0.35 : 0.35, 0] });
    box(scene, [4.6, 0.04, 0.08], [x, 1.12, 7.0], lit(0x49e6ff, 3), { rot: [0, x > 0 ? -0.35 : 0.35, 0], cast: false });
  }

  s.hud(`<div class="panel" style="left:50%;bottom:44px;transform:translateX(-50%);font-size:14px">
    <b>Click a node.</b> The camera flies into its screen and the screen becomes the page.</div>`);
}
