// 6. The trail: a dawn hike, a camp per era, the summit as the contact page.
import { THREE, stage, rng, std, lit, box, cyl, ball, canvasTex, fbm, sun } from '../kit.js';

export default function () {
  const s = stage({ bg: 0xf0a988, fog: [0xf2a98a, 0.0105], cam: [-11, 8, 54], target: [1, 12.6, -4], fov: 38, bloom: [0.32, 0.7, 0.86], exposure: 1.05 });
  const { scene } = s;
  const R = rng(3);

  scene.background = canvasTex(16, 512, (g, w, h) => {
    const k = g.createLinearGradient(0, 0, 0, h);
    k.addColorStop(0, '#141a45'); k.addColorStop(0.3, '#4a3b7c'); k.addColorStop(0.52, '#b0608a'); k.addColorStop(0.68, '#f4996f'); k.addColorStop(0.8, '#ffd0a0'); k.addColorStop(1, '#ffe2bd');
    g.fillStyle = k; g.fillRect(0, 0, w, h);
  });

  scene.add(new THREE.HemisphereLight(0x9aa6ff, 0x4a3344, 0.95));
  sun(scene, 0xffb580, 3.2, [38, 20, -34], 70);
  const disc = new THREE.Mesh(new THREE.SphereGeometry(7, 32, 20), new THREE.MeshBasicMaterial({ color: 0xffd9a8, fog: false }));
  disc.material.color.multiplyScalar(2.4);
  disc.position.set(62, 13, -130);
  scene.add(disc);

  // the mountain
  const Hgt = (x, z) => {
    const d2 = (x * 0.85) ** 2 + (z + 6) ** 2;
    const peak = 19 * Math.exp(-d2 / 210) + 7 * Math.exp(-d2 / 26);
    const ridges = 7 * Math.exp(-((x + 24) ** 2 + (z + 14) ** 2) / 160) + 9 * Math.exp(-((x - 27) ** 2 + (z + 20) ** 2) / 190);
    const rough = (fbm(x * 0.13 + 5, z * 0.13 + 9) - 0.47) * 6 * (0.3 + Math.min(1, peak / 12));
    return peak + ridges + rough;
  };
  const geo = new THREE.PlaneGeometry(190, 150, 240, 190);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position, col = new Float32Array(pos.count * 3), c = new THREE.Color();
  const forest = new THREE.Color(0x2c4a3c), meadow = new THREE.Color(0x58704a), rock = new THREE.Color(0x75697a), snow = new THREE.Color(0xf6efe8);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), y = Hgt(x, z);
    pos.setY(i, y);
    const j = fbm(x * 0.4, z * 0.4, 2) * 3;
    if (y + j > 19) c.copy(snow);
    else if (y + j > 10.5) c.copy(rock).lerp(snow, Math.max(0, (y + j - 15.5) / 6));
    else if (y + j > 5) c.copy(meadow).lerp(rock, (y + j - 5) / 5.5);
    else c.copy(forest).lerp(meadow, Math.max(0, (y + j) / 5));
    col.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const land = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }));
  land.receiveShadow = true;
  land.castShadow = true;
  scene.add(land);

  const pine = new THREE.InstancedMesh(new THREE.ConeGeometry(0.5, 1.9, 6), std(0x1d382e, { roughness: 1, flatShading: true }), 1400);
  const d = new THREE.Object3D();
  let n = 0;
  for (let i = 0; i < 9000 && n < 1400; i++) {
    const x = (R() - 0.5) * 150, z = (R() - 0.5) * 100 + 4, y = Hgt(x, z);
    if (y > 8.5 || R() < 0.35) continue;
    const k = 0.6 + R() * 0.9;
    d.position.set(x, y + 0.8 * k, z);
    d.scale.set(k, k, k);
    d.updateMatrix();
    pine.setMatrixAt(n++, d.matrix);
  }
  pine.count = n;
  pine.castShadow = true;
  scene.add(pine);

  // the trail: switchbacks that tighten toward the summit
  const at = (u) => {
    const x = Math.sin(u * 3.1 * Math.PI) * 17 * (1 - u) ** 0.75 - 3 * (1 - u), z = 30 - u * 36;
    return new THREE.Vector3(x, Hgt(x, z) + 0.45, z);
  };
  const pts = [];
  for (let i = 0; i <= 260; i++) pts.push(at(i / 260));
  const path = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 520, 0.14, 8, false), lit(0xffe6b0, 1.05));
  scene.add(path);

  const camps = [[0.06, '2009 · Game bots'], [0.3, '2012 · Client sites'], [0.52, '2017 · E-commerce'], [0.76, '2022 · Cybrary']];
  camps.forEach(([u, name]) => {
    const p = at(u);
    const tent = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.2, 4), new THREE.MeshStandardMaterial({ color: 0xff8a3c, emissive: 0xff7a2a, emissiveIntensity: 1.1, flatShading: true }));
    tent.position.set(p.x + 0.9, p.y + 0.35, p.z);
    tent.rotation.y = 0.5;
    tent.castShadow = true;
    scene.add(tent);
    const fire = new THREE.PointLight(0xffa24a, 40, 12, 2);
    fire.position.set(p.x, p.y + 0.8, p.z + 0.6);
    scene.add(fire);
    ball(scene, 0.16, [p.x - 0.2, p.y + 0.05, p.z + 0.7], lit(0xffc06a, 5), { cast: false });
    s.label(name, [p.x + 0.9, p.y + 1.2, p.z]);
  });

  // summit: a flag, a beacon and the register to sign
  const top = at(1);
  cyl(scene, 0.05, 0.05, 2.6, [top.x, top.y + 1.2, top.z], std(0xe8e8e8), { seg: 8 });
  box(scene, [1.2, 0.7, 0.04], [top.x + 0.62, top.y + 2.1, top.z], lit(0xff4d4d, 1.4), { cast: false });
  const beacon = cyl(scene, 0.5, 0.5, 30, [top.x, top.y + 15, top.z], new THREE.MeshBasicMaterial({ color: 0xfff0d0, transparent: true, opacity: 0.16, depthWrite: false, fog: false }), { cast: false, receive: false });
  beacon.material.color.multiplyScalar(1.6);
  s.label('Summit · now. Sign the register to get in touch.', [top.x, top.y + 3, top.z], 'hot');

  // the visitor, part way up
  const me = at(0.6);
  const hiker = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.5, 4, 10), std(0x2f6fed, { roughness: 0.6 }));
  hiker.position.set(me.x, me.y + 0.5, me.z);
  hiker.castShadow = true;
  scene.add(hiker);
  ball(scene, 0.18, [me.x, me.y + 1.05, me.z], std(0xf2c9a0));
  box(scene, [0.3, 0.42, 0.2], [me.x, me.y + 0.62, me.z + 0.24], std(0xd84f2a));
  ball(scene, 0.07, [me.x, me.y + 1.1, me.z - 0.17], lit(0xffffff, 6), { cast: false });
  s.label('you · 60% of the way', [me.x, me.y + 1.5, me.z]);

  s.hud(`<div class="panel" style="left:28px;bottom:44px;width:250px;font-size:13px">
    <div style="display:flex;justify-content:space-between"><b>Elevation</b><span>2017 → 2022</span></div>
    <div style="height:6px;border-radius:3px;background:rgba(255,255,255,.16);margin:8px 0"><div style="width:60%;height:100%;border-radius:3px;background:#ffb454"></div></div>
    <span class="dim">Scroll to climb. The light turns from dawn to full sun on the way up.</span></div>`);
}
