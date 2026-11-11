// 5. The line map: a model railway map of the career. Lines are skills, stations are projects, left to right is time.
import { THREE, stage, std, box, cyl, screen, sun } from '../kit.js';

export default function () {
  const s = stage({ light: true, neutral: true, bg: 0xe9e3d6, cam: [0.3, 26.5, 21], target: [0.3, 0, 1.0], fov: 34, bloom: [0.12, 0.4, 0.96], exposure: 0.9 });
  const { scene } = s;

  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfc5b2, 0.75));
  sun(scene, 0xfff3e0, 2.4, [-10, 28, 14], 26);
  box(scene, [140, 1, 100], [0, -0.9, 0], std(0xe8e1d2, { roughness: 1 }), { cast: false });
  box(scene, [31, 0.5, 16], [0, -0.25, 0.4], std(0xfaf7f0, { roughness: 0.8 }));

  const X = (year) => -13.6 + (year - 2009) * 1.56;
  const zones = [[2009, 2012, 0xdff0db, 'Game bots'], [2012, 2017, 0xfbeecb, 'Client work'], [2017, 2022, 0xfcdcca, 'Stove & Grill Parts'], [2022, 2026, 0xd9e6fb, 'Cybrary'], [2026, 2026.9, 0xe9dcfb, 'Now']];
  zones.forEach(([a, b, c, name]) => {
    box(scene, [X(b) - X(a) - 0.08, 0.02, 15.2], [(X(a) + X(b)) / 2, 0.012, 0.4], std(c, { roughness: 1 }), { cast: false });
    s.label(name, [(X(a) + X(b)) / 2, 0.1, -6.6], 'plain');
  });
  screen(scene, X(2026.9) - X(2009) + 1.6, 0.7, [(X(2009) + X(2026.9)) / 2, 0.03, 7.6], (g, w, h) => {
    g.fillStyle = '#faf7f0'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2a2118'; g.font = `bold ${Math.round(h * 0.56)}px "Segoe UI", Arial`; g.textAlign = 'center';
    for (let y = 2009; y <= 2026; y++) { const x = ((X(y) - X(2009) + 0.8) / (X(2026.9) - X(2009) + 1.6)) * w; g.fillRect(x - 1, 0, 3, h * 0.2); g.fillText(String(y), x, h * 0.84); }
  }, { px: 4096, rot: [-Math.PI / 2, 0, 0], boost: 0.9 });

  const lines = [
    { name: 'Java', hue: 0xe4572e },
    { name: 'JavaScript and TypeScript', hue: 0x1f6feb },
    { name: 'Python', hue: 0x2da44e },
    { name: 'Shopify', hue: 0xf0a020 },
    { name: 'Infra and CI', hue: 0x8250df },
    { name: 'Go', hue: 0x12a3a3 },
  ];
  // name, year, lane, lines through it
  const stations = [
    ['Gather bot', 2009.6, -3.2, [0]], ['Script engine', 2011, -3.2, [0]],
    ['Client sites', 2012.6, 0.6, [1]], ['Custom CMS', 2014, -1.4, [0, 1]], ['CRM dashboards', 2015.5, 2.2, [1, 2]],
    ['E-commerce site', 2017.3, 4.2, [1, 3]], ['Catalog sync', 2018.4, 0.4, [2, 3, 4]], ['Reporting server', 2019.4, -3.0, [2, 4]],
    ['Diagnostics', 2020.4, 2.0, [1, 2]], ['Accessibility', 2021.3, 4.6, [1, 3]],
    ['Marketing site', 2022.7, -3.6, [1, 4]], ['Enterprise hub', 2023.6, 0.2, [1, 4]], ['API client generator', 2024.3, 3.4, [1, 5]],
    ['Demo mocks', 2024.9, -2.2, [1]], ['Small thing 01', 2025.6, 4.4, [2, 5]],
    ['NOW', 2026.5, 0.4, [1, 2, 4, 5]],
  ];
  const off = (i) => (i - 2.5) * 0.27;

  lines.forEach((ln, i) => {
    const m = std(ln.hue, { roughness: 0.45 });
    const stops = stations.filter((st) => st[3].includes(i));
    const pts = [];
    stops.forEach((st, k) => {
      const p = [X(st[1]), st[2] + off(i)];
      if (k) {
        const q = pts[pts.length - 1], dz = Math.abs(p[1] - q[1]);
        if (dz > 0.05 && p[0] - q[0] > dz + 0.2) pts.push([p[0] - dz, q[1]]);
      }
      pts.push(p);
    });
    for (let k = 0; k < pts.length - 1; k++) {
      const [ax, az] = pts[k], [bx, bz] = pts[k + 1], len = Math.hypot(bx - ax, bz - az);
      box(scene, [len, 0.16, 0.2], [(ax + bx) / 2, 0.11, (az + bz) / 2], m, { rot: [0, -Math.atan2(bz - az, bx - ax), 0] });
      cyl(scene, 0.1, 0.1, 0.16, [bx, 0.11, bz], m, { seg: 12 });
    }
    // a train part way along each line
    const seg = Math.max(0, Math.floor(pts.length * 0.55) - 1);
    if (pts.length > 1) {
      const [ax, az] = pts[seg], [bx, bz] = pts[seg + 1], f = 0.5;
      const train = box(scene, [0.95, 0.34, 0.3], [ax + (bx - ax) * f, 0.4, az + (bz - az) * f], std(ln.hue, { roughness: 0.3 }), { rot: [0, -Math.atan2(bz - az, bx - ax), 0] });
      box(train, [0.7, 0.12, 0.31], [0, 0.04, 0], std(0xffffff, { roughness: 0.2 }), { cast: false });
      if (i === 2) s.label('ride the Python line through every project that used it', [train.position.x, 0.8, train.position.z], 'hot');
    }
  });

  stations.forEach(([name, year, lane, through], k) => {
    const x = X(year), a = lane + off(Math.min(...through)), b = lane + off(Math.max(...through)), hub = name === 'NOW';
    const span = b - a + (hub ? 1.1 : 0.62), w = hub ? 1.1 : 0.62;
    box(scene, [w + 0.14, 0.14, span + 0.14], [x, 0.1, (a + b) / 2], std(0x2a2118, { roughness: 0.6 }));
    box(scene, [w, 0.18, span], [x, 0.11, (a + b) / 2], std(0xffffff, { roughness: 0.4 }));
    if (hub) s.label('Who: Calvin Ellis · where every line ends', [x, 0.5, a - 0.6], 'hot');
    else if (k % 2 === 0 || through.length > 1) s.label(name, [x, 0.4, a - 0.3], through.length > 2 ? '' : 'plain');
  });
  s.label('Projects: a station each. Step off and it opens live ↗', [X(2018.4), 0.5, 2.1]);
  s.label('Timeline: left to right, the jobs are zones', [X(2013.2), 0.3, 6.6]);

  s.hud(`<div class="panel" style="right:24px;top:22px;width:236px">
    <b>Lines are skills</b>
    ${lines.map((l) => `<div><span style="display:inline-block;width:26px;height:6px;border-radius:3px;vertical-align:middle;margin-right:8px;background:#${l.hue.toString(16).padStart(6, '0')}"></span>${l.name}</div>`).join('')}
    <div class="dim" style="margin-top:6px">Where lines cross, one project used them all.</div></div>`);
  s.hud(`<div class="panel" style="left:50%;bottom:34px;transform:translateX(-50%);font-size:14px">
    <b>One map answers who, when and what.</b> A new project is a new station. A new skill is a new line.</div>`);
}
