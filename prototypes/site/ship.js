// How I ship: work moves down a line through six gates, one per capability. Each gate lights as a piece of work clears it.
import { THREE, stage, glow, tier, calm, lerp, ease } from './stage.js';

export default function ship(canvas, layer, caps, ui) {
  const s = stage(canvas, { fov: 35 });
  const { scene, camera } = s;
  const n = caps.length, at = caps.map(() => new THREE.Vector3()), ends = [new THREE.Vector3(), new THREE.Vector3()];
  let wide = true, chosen = -1, over = -1;

  const rail = new THREE.Line(new THREE.BufferGeometry().setFromPoints([ends[0], ends[1]]), new THREE.LineBasicMaterial({ color: 0x3a4a6e }));
  scene.add(rail);
  const gates = caps.map((c, i) => {
    const hue = new THREE.Color(c.hue);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.05, 12, 56), new THREE.MeshBasicMaterial({ color: hue }));
    const halo = glow(c.hue, 3.4, 0.22);
    const g = new THREE.Group();
    g.add(ring, halo);
    scene.add(g);
    const el = document.createElement('button');
    el.className = 'stop';
    el.style.setProperty('--hue', c.hue);
    el.innerHTML = `<b>${c.name}</b><span>${c.role}</span>`;
    el.addEventListener('click', () => choose(chosen === i ? -1 : i));
    el.addEventListener('pointerenter', () => { over = i; });
    el.addEventListener('pointerleave', () => { if (over === i) over = -1; });
    layer.appendChild(el);
    return { g, ring, halo, hue, el, flash: 0, state: '' };
  });

  // pieces of work: small cards that start plain and turn green as they clear each gate
  const count = tier === 'low' ? 7 : 11, plain = new THREE.Color(0xdfe6f5), done = new THREE.Color(0x7ef0c0);
  const cardGeo = new THREE.BoxGeometry(0.44, 0.3, 0.06);
  const work = Array.from({ length: count }, (_, k) => {
    const mesh = new THREE.Mesh(cardGeo, new THREE.MeshBasicMaterial({ color: plain.clone() }));
    mesh.add(glow(0xbfd4ff, 0.9, 0.35));
    scene.add(mesh);
    return { mesh, u: (k / count) * (n + 1), speed: 0.3 + (k % 4) * 0.035, last: -1 };
  });

  function choose(i) {
    chosen = i;
    ui.onPick(i >= 0 ? caps[i] : null);
  }
  const P = (k) => (k <= 0 ? ends[0] : k > n ? ends[1] : at[k - 1]);  // start, the six gates, the way out
  s.onSize((w, h) => {
    wide = w / h > 1.25;
    const gap = wide ? 2.1 : 2.25;
    caps.forEach((_, i) => { const k = i - (n - 1) / 2; if (wide) at[i].set(k * gap - 2.55, 0.2, 0); else at[i].set(-1.9, -k * gap, 0); });
    const dir = wide ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, -1, 0);
    ends[0].copy(at[0]).addScaledVector(dir, wide ? -1.5 : -2.2);
    ends[1].copy(at[n - 1]).addScaledVector(dir, wide ? 1.5 : 2.2);
    rail.geometry.setFromPoints([ends[0], ends[1]]);
    gates.forEach((gt, i) => { gt.g.position.copy(at[i]); gt.ring.rotation.set(wide ? 0 : Math.PI / 2, wide ? Math.PI / 2 : 0, 0); });
    camera.position.set(wide ? 0 : 0.6, wide ? 1.6 : 0, wide ? 15 : 23);
    camera.lookAt(wide ? 0 : 0.6, 0, 0);
  });

  const tmp = new THREE.Vector3();
  s.onTick((t, dt) => {
    const lit = over >= 0 ? over : chosen;
    for (const w of work) {
      w.u += dt * w.speed * (calm ? 0.4 : 1);
      if (w.u >= n + 1) { w.u -= n + 1; w.last = -1; }
      const k = Math.floor(w.u), f = w.u - k;
      w.mesh.position.lerpVectors(P(k), P(k + 1), ease(f));
      w.mesh.position.z = 0.02;
      if (k !== w.last) { w.last = k; if (k >= 1 && k <= n) gates[k - 1].flash = 1; }
      w.mesh.material.color.copy(plain).lerp(done, Math.min(1, k / n));
      const edge = k === 0 ? ease(f * 2) : k === n ? 1 - ease(f) : 1;  // fade in at the start, out past the last gate
      w.mesh.scale.setScalar(Math.max(0.01, edge));
      w.mesh.rotation.z = wide ? 0 : Math.PI / 2;
    }
    gates.forEach((gt, i) => {
      gt.flash = Math.max(0, gt.flash - dt * 1.6);
      const state = lit < 0 ? '' : i === lit ? 'on' : 'dim';
      if (state !== gt.state) { gt.state = state; gt.el.dataset.state = state; }
      gt.ring.scale.setScalar(lerp(gt.ring.scale.x, (state === 'on' ? 1.22 : 1) + gt.flash * 0.16, 0.2));
      gt.ring.material.color.copy(gt.hue).multiplyScalar(state === 'dim' ? 0.4 : 1 + gt.flash * 0.5);
      gt.halo.material.opacity = (state === 'dim' ? 0.08 : state === 'on' ? 0.5 : 0.22) + gt.flash * 0.4;
      tmp.copy(at[i]);
      if (wide) tmp.y -= 1.25; else tmp.x += 1.25;  // the label sits under the gate, or beside it on a phone
      const p = s.project(tmp);
      gt.el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) translate(${wide ? '-50%, 0' : '0, -50%'})`;
    });
  });
  return { choose: (id) => choose(caps.findIndex((c) => c.id === id)) };
}
