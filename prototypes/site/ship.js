// How I ship: a loop, not a line. Work goes round five stations. At Build it laps a small ring twice,
// red then green, because the test is written first. From Run it comes back to Plan as telemetry.
// Small dots round a station are agents at work. A diamond marks where the owner steps in.
// The dashed box round Assure is staging: a safe copy, where it is proved end to end.
import { THREE, stage, glow, tier, calm, clamp, lerp, ease } from './stage.js';

const WORK = { plan: 3, build: 8, assure: 5, release: 2, run: 4 };   // how much of each station the agents do
const MINE = { plan: true, assure: true, run: true };                 // where the owner decides

export default function ship(canvas, layer, caps, ui, opts = {}) {
  const s = stage(canvas, { fov: 35 });
  const { scene, camera } = s;
  const n = caps.length, STEP = (Math.PI * 2) / n, TDD = 1.6, LAPS = 2, LEN = n + TDD;
  const buildAt = Math.max(0, caps.findIndex((c) => c.id === 'build')), stagingAt = caps.findIndex((c) => c.id === 'assure');
  const loop = new THREE.Group();
  scene.add(loop);
  let wide = true, RX = 4.2, RY = 2.9, miniR = 0.8, miniA = 0, chosen = -1, over = -1;
  const miniC = new THREE.Vector3(), tmp = new THREE.Vector3();
  const ang = (i) => Math.PI / 2 - i * STEP;                             // station i, clockwise from the top
  const on = (a, v) => v.set(Math.cos(a) * RX, Math.sin(a) * RY, 0);

  const ring = new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x3a4a6e }));
  const back = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineDashedMaterial({ color: caps[n - 1].hue, dashSize: 0.18, gapSize: 0.13 }));
  const mini = new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x6b7da8 }));
  const box = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([[-1, -1], [1, -1], [1, 1], [-1, 1]].flatMap(([x, y], k, all) => {
    const [nx, ny] = all[(k + 1) % 4];   // each side cut into steps, so the dashes run evenly
    return Array.from({ length: 8 }, (_, j) => new THREE.Vector3((x + (nx - x) * (j / 8)) * 0.84, (y + (ny - y) * (j / 8)) * 0.84, 0));
  })), new THREE.LineDashedMaterial({ color: caps[Math.max(0, stagingAt)].hue, dashSize: 0.12, gapSize: 0.1, transparent: true, opacity: 0.8 }));
  box.computeLineDistances();
  box.visible = stagingAt >= 0;
  loop.add(ring, back, mini, box);

  const stations = caps.map((c, i) => {
    const g = new THREE.Group(), hue = new THREE.Color(c.hue);
    const node = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.055, 10, 48), new THREE.MeshBasicMaterial({ color: hue }));
    const halo = glow(c.hue, 3.0, 0.24);
    g.add(node, halo);
    const crew = Math.ceil((WORK[c.id] ?? 3) * (tier === 'low' ? 0.6 : 1));
    const agents = Array.from({ length: crew }, (_, k) => { const a = glow(0xdfe8ff, 0.3, 0.95); g.add(a); return { a, r: 0.66 + (k % 3) * 0.15, sp: 1.2 + (k % 4) * 0.4, ph: k * 2.4 }; });
    let me = null;
    if (MINE[c.id]) {
      me = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      me.rotation.z = Math.PI / 4;
      g.add(me);
    }
    loop.add(g);
    const el = document.createElement('button');
    el.className = 'stop';
    el.style.setProperty('--hue', c.hue);
    el.innerHTML = `<b>${c.name}</b><span>${c.role}</span>`;
    el.addEventListener('click', () => choose(chosen === i ? -1 : i));
    el.addEventListener('pointerenter', () => { over = i; });
    el.addEventListener('pointerleave', () => { if (over === i) over = -1; });
    layer.appendChild(el);
    return { g, node, halo, agents, me, hue, el, flash: 0, state: '' };
  });
  const note = document.createElement('span');   // beside the little ring
  note.className = 'mini';
  note.innerHTML = '<i class="bad">test fails</i> → <i class="good">code passes</i> → tidy';
  const wire = document.createElement('span');   // on the way back from Run to Plan
  wire.className = 'mini';
  wire.innerHTML = '<i class="tele">telemetry</i> → the next plan';
  const hub = document.createElement('a');       // in the middle of the loop
  hub.className = 'hub';
  hub.href = opts.receipts ?? '#agents';
  hub.innerHTML = `<b>${opts.rounds ?? 0}</b><span>times round this loop<br>to build this page</span>`;
  layer.append(note, wire, hub);

  const count = tier === 'low' ? 5 : 7, plain = new THREE.Color(0xdfe6f5), red = new THREE.Color(0xff6b6b), green = new THREE.Color(0x7ef0c0);
  const cardGeo = new THREE.BoxGeometry(0.4, 0.27, 0.05);
  const work = Array.from({ length: count }, (_, k) => {
    const mesh = new THREE.Mesh(cardGeo, new THREE.MeshBasicMaterial({ color: plain.clone() }));
    const dots = [0, 1, 2, 3].map(() => { const d = glow(caps[n - 1].hue, 0.4, 0.95); loop.add(d); return d; });
    loop.add(mesh);
    return { mesh, dots, u: (k / count) * LEN, seg: -1 };
  });

  function choose(i) {
    chosen = i;
    ui.onPick(i >= 0 ? caps[i] : null);
  }
  s.onSize((w, h) => {
    wide = w / h > 1.25;
    RX = wide ? 4.0 : 1.95;
    RY = wide ? 2.9 : 3.1;
    loop.position.set(wide ? -2.9 : 0, wide ? -0.45 : -0.2, 0);
    loop.rotation.x = wide ? -0.4 : 0;   // tipped back on a desktop, so it reads as an orbit
    camera.position.set(0, 0, wide ? 15 : 15.4);
    camera.lookAt(0, 0, 0);
    const pts = [];
    for (let k = 0; k < 128; k++) pts.push(on((k / 128) * Math.PI * 2, new THREE.Vector3()));
    ring.geometry.setFromPoints(pts);
    const arc = [];
    for (let k = 0; k <= 32; k++) arc.push(on(ang(n - 1) - (k / 32) * STEP, new THREE.Vector3()).setZ(0.01));
    back.geometry.setFromPoints(arc);
    back.computeLineDistances();
    stations.forEach((st, i) => {
      on(ang(i), st.g.position);
      if (st.me) st.me.position.set(-Math.cos(ang(i)) * 0.82, -Math.sin(ang(i)) * 0.82, 0.02);   // the diamond sits inside the loop
    });
    if (stagingAt >= 0) on(ang(stagingAt), box.position).z = 0.005;
    // the little ring touches the big one at Build: hung outside it on a desktop, tucked inside on a phone
    const b = on(ang(buildAt), tmp.clone()), out = ang(buildAt) - 0.8;
    miniR = wide ? 0.85 : 0.6;
    if (wide) miniC.set(b.x + Math.cos(out) * miniR, b.y + Math.sin(out) * miniR, 0);
    else miniC.set(b.x - 0.42, b.y - 0.72, 0);
    const reach = Math.hypot(b.x - miniC.x, b.y - miniC.y);
    miniR = reach;
    miniA = Math.atan2(b.y - miniC.y, b.x - miniC.x);
    const lap = [];
    for (let k = 0; k < 48; k++) lap.push(new THREE.Vector3(miniC.x + Math.cos((k / 48) * Math.PI * 2) * miniR, miniC.y + Math.sin((k / 48) * Math.PI * 2) * miniR, 0));
    mini.geometry.setFromPoints(lap);
  });

  const spot = (local) => s.project(loop.localToWorld(tmp.copy(local)));
  const at = new THREE.Vector3();
  s.onTick((t, dt) => {
    const lit = over >= 0 ? over : chosen;
    for (const w of work) {
      w.u = (w.u + dt * 0.21 * (calm ? 0.4 : 1)) % LEN;
      let seg, f;
      if (w.u >= 1 && w.u < 1 + TDD) {                 // the test-first laps
        seg = 1; f = (w.u - 1) / TDD;
        const a = miniA - f * LAPS * Math.PI * 2;
        w.mesh.position.set(miniC.x + Math.cos(a) * miniR, miniC.y + Math.sin(a) * miniR, 0.03);
      } else {
        const v = w.u < 1 ? w.u : w.u - TDD, k = Math.min(n - 1, Math.floor(v));
        f = v - k;
        seg = k === 0 ? 0 : k + 1;                       // 0 plan to build, 2.. the arcs after the laps, n the way back
        on(ang(k) - STEP * ease(f), w.mesh.position).z = 0.03;
      }
      if (seg !== w.seg) {                                // a station lights as work reaches it
        w.seg = seg;
        const reached = seg === 0 ? 0 : seg === 1 ? buildAt : seg === 2 ? -1 : seg - 1;
        if (reached >= 0 && reached < n) stations[reached].flash = 1;
      }
      const home = seg === n;                             // the last arc: work comes back as telemetry
      w.mesh.visible = !home;
      if (seg === 0) w.mesh.material.color.copy(plain);
      else if (seg === 1) w.mesh.material.color.copy(f < 0.45 ? red : green);
      else w.mesh.material.color.copy(green);
      w.dots.forEach((d, j) => {
        d.visible = home;
        if (!home) return;
        const lag = clamp(f - j * 0.07, 0, 1);
        on(ang(n - 1) - STEP * ease(lag), d.position).z = 0.04;
        d.scale.setScalar(0.4 * (1 - lag * 0.6));
      });
    }
    stations.forEach((st, i) => {
      st.flash = Math.max(0, st.flash - dt * 1.5);
      const state = lit < 0 ? '' : i === lit ? 'on' : 'dim';
      if (state !== st.state) { st.state = state; st.el.dataset.state = state; }
      st.node.scale.setScalar(lerp(st.node.scale.x, (state === 'on' ? 1.3 : 1) + st.flash * 0.2, 0.2));
      st.node.material.color.copy(st.hue).multiplyScalar(state === 'dim' ? 0.6 : 1 + st.flash * 0.5);
      st.halo.material.opacity = (state === 'dim' ? 0.08 : state === 'on' ? 0.5 : 0.24) + st.flash * 0.4;
      st.agents.forEach((ag) => {
        const a = t * ag.sp * (calm ? 0.3 : 1) + ag.ph;
        ag.a.position.set(Math.cos(a) * ag.r, Math.sin(a) * ag.r * 0.8, 0.04);
        ag.a.material.opacity = state === 'dim' ? 0.25 : 0.95;
      });
      // the label sits above a station in the top half and below one in the bottom half; on a phone it leans in from the edge
      const a = ang(i), up = Math.sin(a) > 0.05;
      at.copy(st.g.position);
      at.x += Math.cos(a) * (wide ? 0.3 : -0.25);
      at.y += up ? 0.72 : i === stagingAt ? -1.0 : -0.72;
      const p = spot(at);
      st.el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) translate(-50%, ${up ? '-100%' : '0'})`;
    });
    const m = spot(at.set(miniC.x + 0.45, miniC.y - miniR - 0.22, 0));
    note.style.transform = `translate(${m.x.toFixed(1)}px, ${m.y.toFixed(1)}px) translate(-50%, 0)`;
    note.style.display = wide ? '' : 'none';
    // the telemetry label sits inside the loop, under the middle of the way back
    const mid = ang(n - 1) - STEP / 2, push = wide ? 0.76 : 0.6;
    const tl = spot(at.set(Math.cos(mid) * RX * push, Math.sin(mid) * RY * push, 0));
    wire.style.transform = `translate(${tl.x.toFixed(1)}px, ${tl.y.toFixed(1)}px) translate(${wide ? '-50%' : '-20%'}, -50%)`;
    const c = spot(at.set(0, wide ? -0.1 : -0.7, 0));
    hub.style.transform = `translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px) translate(-50%, -50%)`;
  });
  return { choose: (id) => choose(caps.findIndex((c) => c.id === id)) };
}
