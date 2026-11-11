// 5. The machine, exploded: a glass-sided PC pulled apart along one axis, a part per layer of the stack.
import { THREE, stage, env, std, lit, box, cyl, screen, sun, tube, line } from '../kit.js';

export default function () {
  const s = stage({ bg: 0x0a0b0f, fog: [0x0a0b0f, 0.008], cam: [12, 10.5, 23], target: [-0.7, 3.9, 0], fov: 28, bloom: [0.38, 0.55, 0.82], exposure: 1.15 });
  const { scene } = s;
  env(s, 1.1);

  scene.add(new THREE.HemisphereLight(0xbfd0ff, 0x1a1c24, 0.8));
  sun(scene, 0xffffff, 2.4, [10, 20, 16], 22);
  const rimA = new THREE.PointLight(0x39d0ff, 160, 60, 2);
  rimA.position.set(-16, 12, -10);
  const rimB = new THREE.PointLight(0xff4fd8, 130, 60, 2);
  rimB.position.set(16, 11, -12);
  scene.add(rimA, rimB);
  box(scene, [200, 0.2, 200], [0, -0.1, 0], std(0x0e1016, { roughness: 0.6, metalness: 0.3 }), { cast: false });

  const metal = std(0x7d8798, { roughness: 0.35, metalness: 0.85 });
  const black = std(0x343a47, { roughness: 0.45, metalness: 0.5 });
  const H = 6, D = 6.6, Y = 0.9 + H / 2;
  const ringGeo = (r) => new THREE.TorusGeometry(r, 0.045, 10, 48);
  function fan(x, y, z, r, hue) {
    cyl(scene, r, r, 0.14, [x, y, z], black, { rot: [0, 0, Math.PI / 2] });
    cyl(scene, r * 0.28, r * 0.28, 0.18, [x, y, z], metal, { rot: [0, 0, Math.PI / 2] });
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      box(scene, [0.03, r * 0.62, 0.2], [x + 0.06, y + Math.cos(a) * r * 0.55, z + Math.sin(a) * r * 0.55], metal, { rot: [a, 0, 0], cast: false });
    }
    const ring = new THREE.Mesh(ringGeo(r), lit(hue, 1.9));
    ring.position.set(x + 0.08, y, z);
    ring.rotation.y = Math.PI / 2;
    scene.add(ring);
  }

  // case shell, far left
  const cx = -10.2, W = 2.4;
  for (const y of [Y - H / 2, Y + H / 2]) for (const z of [-D / 2, D / 2]) box(scene, [W, 0.14, 0.14], [cx, y, z], metal);
  for (const x of [cx - W / 2, cx + W / 2]) for (const z of [-D / 2, D / 2]) box(scene, [0.14, H, 0.14], [x, Y, z], metal);
  for (const x of [cx - W / 2, cx + W / 2]) for (const y of [Y - H / 2, Y + H / 2]) box(scene, [0.14, 0.14, D], [x, y, 0], metal);
  box(scene, [0.06, H, D], [cx - W / 2, Y, 0], black);

  // power supply and drives
  const px = -6.6;
  box(scene, [1.9, 1.5, 2.8], [px, 1.65, 1.6], black);
  fan(px + 0.96, 1.65, 1.6, 0.6, 0xffb454);
  [[4.9, -1.5], [3.6, -1.5]].forEach(([y, z], i) => {
    box(scene, [0.16, 1.0, 1.7], [px + i * 0.5, y, z], std(0xb9c0cc, { roughness: 0.3, metalness: 0.9 }));
    box(scene, [0.02, 0.1, 1.1], [px + i * 0.5 + 0.09, y - 0.3, z], lit(0xffb454, 1.8), { cast: false });
  });
  box(scene, [0.7, 1.1, 1.6], [px, 5.6, 1.4], std(0x8f97a6, { roughness: 0.35, metalness: 0.85 }));

  // motherboard, with the processor and memory standing off it
  const mx = -3.2;
  box(scene, [0.14, 5.4, 5.8], [mx, Y + 0.1, 0], std(0x17352b, { roughness: 0.6 }));
  screen(scene, 5.8, 5.4, [mx + 0.08, Y + 0.1, 0], (g, w, h) => {
    g.fillStyle = '#123026'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#3fbf8f'; g.lineWidth = 3;
    for (let i = 0; i < 46; i++) {
      const x = 20 + ((i * 97) % (w - 40)), y = 20 + ((i * 53) % (h - 40));
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + 60, y); g.lineTo(x + 90, y + 30); g.lineTo(x + 90, y + 70); g.stroke();
      g.fillStyle = '#c9a23a'; g.fillRect(x - 3, y - 3, 6, 6);
    }
  }, { rot: [0, Math.PI / 2, 0], boost: 0.9 });
  const qx = -1.5;
  box(scene, [0.5, 1.25, 1.25], [qx, 5.0, -0.5], std(0xc3c9d4, { roughness: 0.25, metalness: 0.95 }));
  box(scene, [0.03, 0.62, 0.62], [qx + 0.27, 5.0, -0.5], lit(0x39d0ff, 2), { cast: false });
  for (let i = 0; i < 4; i++) {
    box(scene, [0.85, 2.1, 0.13], [qx + 0.05, 4.9, 1.35 + i * 0.34], black);
    box(scene, [0.1, 2.1, 0.15], [qx + 0.5, 4.9, 1.35 + i * 0.34], lit(new THREE.Color(0x39d0ff).lerp(new THREE.Color(0xff4fd8), i / 3), 1.8), { cast: false });
  }

  // graphics card
  const gx = 1.7;
  box(scene, [1.0, 1.5, 5.2], [gx, 2.5, 0], black);
  box(scene, [0.1, 0.1, 5.2], [gx + 0.48, 3.28, 0], lit(0xff4fd8, 1.8), { cast: false });
  [-1.7, 0, 1.7].forEach((z) => fan(gx + 0.5, 2.5, z, 0.62, 0xff4fd8));

  // cooling loop
  const kx = 5.0;
  box(scene, [0.5, 1.6, 5.6], [kx, 6.5, 0], black);
  [-1.85, 0, 1.85].forEach((z) => fan(kx + 0.26, 6.5, z, 0.7, 0x39d0ff));
  box(scene, [0.55, 1.0, 1.0], [kx, 5.0, -0.5], black);
  const pump = new THREE.Mesh(ringGeo(0.36), lit(0x39d0ff, 2));
  pump.position.set(kx + 0.29, 5.0, -0.5);
  pump.rotation.y = Math.PI / 2;
  scene.add(pump);
  const hose = lit(0x2fe0c8, 1.0);
  tube(scene, [[kx, 5.5, -0.75], [kx - 0.2, 6.0, -1.3], [kx, 6.4, -1.6], [kx, 6.5, -2.2]], 0.09, hose, 60);
  tube(scene, [[kx, 5.5, -0.25], [kx - 0.2, 5.9, 0.4], [kx, 6.2, 1.0], [kx, 6.5, 1.5]], 0.09, hose, 60);

  // glass side panel, nearest the camera
  const gl = 8.6;
  box(scene, [0.08, H, D], [gl, Y, 0], new THREE.MeshPhysicalMaterial({ color: 0xa8d4ff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.16 }), { cast: false });
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.08, H, D)), new THREE.LineBasicMaterial({ color: 0xcfe6ff, transparent: true, opacity: 0.75 }));
  edge.position.set(gl, Y, 0);
  scene.add(edge);

  // the axis everything slides along
  for (const y of [Y - H / 2, Y + H / 2]) for (const z of [-D / 2, D / 2]) line(scene, [[cx, y, z], [gl, y, z]], 0x39d0ff, { dashed: 0.3, opacity: 0.35 });

  s.label('<b>Power supply</b> · CI and infrastructure', [px + 0.3, 2.5, 1.6]);
  s.label('<b>Drives</b> · data sync', [px + 0.2, 6.3, -0.4]);
  s.label('<b>Processor</b> · services', [qx, 5.75, -0.5]);
  s.label('<b>Graphics card</b> · front ends', [gx, 3.4, 0], 'hot');
  s.label('<b>Cooling loop</b> · team work', [kx, 7.4, 0]);
  s.label('<b>Glass</b> · what the visitor sees', [gl, Y + H / 2 + 0.1, 1.5]);

  s.hud(`<div class="panel" style="left:50%;bottom:48px;transform:translateX(-50%);width:440px;font-size:14px">
    <div style="display:flex;justify-content:space-between"><span><b>Scroll</b> to pull it apart</span><span class="dim">64%</span></div>
    <div style="height:6px;border-radius:3px;background:rgba(255,255,255,.14);margin-top:8px"><div style="width:64%;height:100%;border-radius:3px;background:linear-gradient(90deg,#39d0ff,#ff4fd8)"></div></div></div>`);
  s.hud(`<div class="panel" style="right:28px;bottom:48px;text-align:center;width:120px">
    <div style="width:44px;height:44px;border-radius:50%;border:2px solid #39d0ff;margin:0 auto 6px;line-height:42px;font-size:20px;color:#39d0ff">⏻</div>
    <b>Power on</b><div class="dim" style="font-size:12px">boots to the résumé</div></div>`);
}
