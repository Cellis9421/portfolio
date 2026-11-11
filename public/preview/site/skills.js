// Skills: a globe of every skill the projects use. Size is how many projects use it, lines join skills used together.
import { THREE, stage, calm, clamp, lerp } from './stage.js';

export const KIND = { language: '#5cc8ff', framework: '#7ef0c0', platform: '#ff8f3a', ai: '#b78cff', practice: '#ffd54a' };

export default function skills(canvas, layer, list, links, ui) {
  const s = stage(canvas, { fov: 35, bloom: [0.3, 0.6, 0.55] });
  const { scene, camera } = s;
  camera.position.set(0, 0, 15.5);
  const globe = new THREE.Group();
  scene.add(globe);
  const RAD = 3.9, n = list.length;

  const nodes = list.map((sk, i) => {
    const y = 1 - (2 * (i + 0.5)) / n, k = Math.sqrt(1 - y * y), a = i * 2.39996;
    const at = new THREE.Vector3(Math.cos(a) * k, y, Math.sin(a) * k).multiplyScalar(RAD);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(KIND[sk.kind]) });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.055 + Math.min(sk.count, 9) * 0.022, 18, 12), mat);
    mesh.position.copy(at);
    globe.add(mesh);
    const el = document.createElement('button');
    el.className = 'skill';
    el.textContent = sk.name;
    el.style.fontSize = `${12 + Math.min(sk.count, 8) * 1.5}px`;
    el.style.setProperty('--hue', KIND[sk.kind]);
    layer.appendChild(el);
    return { sk, at, mesh, mat, el, near: new Set(), hue: new THREE.Color(KIND[sk.kind]) };
  });
  links.forEach(([a, b]) => { nodes[a].near.add(b); nodes[b].near.add(a); });

  const pos = new Float32Array(links.length * 6);
  links.forEach(([a, b], i) => { pos.set([...nodes[a].at.toArray(), ...nodes[b].at.toArray()], i * 6); });
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const web = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0x5c7fb8, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending, depthWrite: false }));
  globe.add(web);
  const hotGeo = new THREE.BufferGeometry();
  hotGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(links.length * 6), 3));
  const hot = new THREE.LineSegments(hotGeo, new THREE.LineBasicMaterial({ color: 0xbfd4ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
  globe.add(hot);
  const core = new THREE.Mesh(new THREE.SphereGeometry(RAD * 0.985, 48, 32), new THREE.MeshBasicMaterial({ color: 0x0a0c11, transparent: true, opacity: 0.55, depthWrite: false }));
  globe.add(core);
  core.renderOrder = -1;

  let yaw = 0.4, pitch = 0.15, toYaw = null, toPitch = 0, drag = null, over = -1, chosen = -1, lit = -2;
  function light(i) {
    if (i === lit) return;
    lit = i;
    const arr = hotGeo.attributes.position.array;
    let k = 0;
    if (i >= 0) links.forEach(([a, b]) => { if (a === i || b === i) { arr.set([...nodes[a].at.toArray(), ...nodes[b].at.toArray()], k); k += 6; } });
    hotGeo.setDrawRange(0, k / 3);
    hotGeo.attributes.position.needsUpdate = true;
    nodes.forEach((nd, j) => {
      const state = i < 0 ? '' : j === i ? 'on' : nd.near.has(i) ? 'near' : 'far';
      nd.el.dataset.state = state;
      nd.mat.color.copy(nd.hue).multiplyScalar(state === 'on' ? 1.7 : state === 'near' ? 1.15 : state === 'far' ? 0.3 : 0.9);
    });
  }
  function choose(i) {
    chosen = i;
    if (i >= 0) {
      const p = nodes[i].at;
      toYaw = -Math.atan2(p.x, p.z);
      toPitch = Math.atan2(p.y, Math.hypot(p.x, p.z));
      while (toYaw - yaw > Math.PI) toYaw -= Math.PI * 2;
      while (toYaw - yaw < -Math.PI) toYaw += Math.PI * 2;
    }
    ui.onPick(i >= 0 ? nodes[i].sk : null);
  }
  nodes.forEach((nd, i) => {
    nd.el.addEventListener('pointerenter', () => { over = i; });
    nd.el.addEventListener('pointerleave', () => { if (over === i) over = -1; });
    nd.el.addEventListener('focus', () => { over = i; });
    nd.el.addEventListener('blur', () => { if (over === i) over = -1; });
    nd.el.addEventListener('click', () => choose(chosen === i ? -1 : i));
  });
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, yaw, pitch }; toYaw = null; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => { if (drag) { yaw = drag.yaw + (e.clientX - drag.x) * 0.006; pitch = clamp(drag.pitch + (e.clientY - drag.y) * 0.006, -1.2, 1.2); } });
  canvas.addEventListener('pointerup', () => { drag = null; });

  let shift = 0;
  s.onSize((w, h) => { shift = w / h > 1.3 ? -2.3 : 0; globe.position.x = shift; globe.scale.setScalar(w / h > 1.3 ? 1 : 0.72); });

  const world = new THREE.Vector3();
  s.onTick((t, dt) => {
    if (toYaw !== null) { yaw = lerp(yaw, toYaw, 1 - Math.pow(0.004, dt)); pitch = lerp(pitch, toPitch, 1 - Math.pow(0.004, dt)); }
    else if (!drag && over < 0 && chosen < 0) yaw += dt * (calm ? 0.02 : 0.09);
    globe.rotation.set(pitch, yaw, 0);
    light(over >= 0 ? over : chosen);
    for (const nd of nodes) {
      world.copy(nd.at).applyEuler(globe.rotation);
      const front = world.z / RAD;
      world.multiplyScalar(globe.scale.x).add(globe.position);
      const p = s.project(world), state = nd.el.dataset.state;
      const fade = state === 'on' || state === 'near' ? 1 : clamp(0.16 + (front + 0.25) * 0.9, 0.1, 1) * (state === 'far' ? 0.35 : 1);
      nd.el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) translate(-50%, -150%) scale(${(0.82 + clamp(front, -1, 1) * 0.18).toFixed(3)})`;
      nd.el.style.opacity = fade.toFixed(2);
      nd.el.style.zIndex = String(Math.round(front * 100) + 100);
      nd.el.style.pointerEvents = front > -0.15 ? 'auto' : 'none';
    }
  });
  return { choose: (name) => choose(nodes.findIndex((nd) => nd.sk.name === name)) };
}
