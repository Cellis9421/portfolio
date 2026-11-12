// The march: one figure per era, drawn in points, each standing a little straighter than the last.
// At the head of the timeline they stand in a row. Scroll, and the row closes up into one walker whose
// posture and colour follow the era in view. A companion joins it in the assistant era, and a crew in the last.
import { THREE, stage, glow, tier, calm, clamp, lerp, ease } from './stage.js';

const J = 18;
const PELVIS = 0, CHEST = 1, NECK = 2, HEAD = 3, ELB_L = 4, HAND_L = 5, ELB_R = 6, HAND_R = 7, KNEE_L = 8, FOOT_L = 9, TOE_L = 10, KNEE_R = 11, FOOT_R = 12, TOE_R = 13, SH_L = 14, SH_R = 15, HIP_L = 16, HIP_R = 17;
// A body is capsules between joints: from, to, the radius at each end, and its share of the points.
const BONES = [
  [HEAD, HEAD, 0.14, 0.14, 0.13], [NECK, HEAD, 0.07, 0.07, 0.02],
  [PELVIS, CHEST, 0.165, 0.2, 0.2], [CHEST, NECK, 0.2, 0.1, 0.07], [SH_L, SH_R, 0.09, 0.09, 0.03], [HIP_L, HIP_R, 0.12, 0.12, 0.04],
  [SH_L, ELB_L, 0.075, 0.062, 0.045], [ELB_L, HAND_L, 0.058, 0.045, 0.04], [HAND_L, HAND_L, 0.055, 0.055, 0.012],
  [SH_R, ELB_R, 0.075, 0.062, 0.045], [ELB_R, HAND_R, 0.058, 0.045, 0.04], [HAND_R, HAND_R, 0.055, 0.055, 0.012],
  [HIP_L, KNEE_L, 0.105, 0.08, 0.075], [KNEE_L, FOOT_L, 0.075, 0.05, 0.06], [FOOT_L, TOE_L, 0.05, 0.035, 0.02],
  [HIP_R, KNEE_R, 0.105, 0.08, 0.075], [KNEE_R, FOOT_R, 0.075, 0.05, 0.06], [FOOT_R, TOE_R, 0.05, 0.035, 0.02],
];
// How the body is held, from the first era to the last. Each row is one thing, changing.
const POSE = {
  lean: [1.2, 0.92, 0.62, 0.36, 0.17, 0.05],     // the spine, in radians off upright
  squat: [0.78, 0.62, 0.44, 0.27, 0.13, 0.04],   // the thigh held forward; the knee folds twice that
  size: [0.78, 0.84, 0.9, 0.95, 1.0, 1.04],
  reach: [1.42, 1.3, 1.15, 1.06, 1.0, 1.0],      // the length of the arms
  ground: [1, 0.62, 0.12, 0, 0, 0],              // how much the hands walk on the ground
  bulk: [1.3, 1.22, 1.12, 1.05, 1.0, 0.96],
  shag: [1, 0.8, 0.55, 0.35, 0.2, 0.12],
  stride: [0.26, 0.3, 0.36, 0.42, 0.46, 0.5],
};
const at = (row, u) => { const x = clamp(u, 0, 1) * (row.length - 1), i = Math.min(row.length - 2, Math.floor(x)); return lerp(row[i], row[i + 1], x - i); };

/** Stand one figure: write its joints into `out` from `o`. `u` is how far along the eras it is, 0 to 1. Returns its bulk and shag. */
function stand(out, o, u, phase, x0) {
  const S = at(POSE.size, u), lean = at(POSE.lean, u), squat = at(POSE.squat, u), reach = at(POSE.reach, u), ground = at(POSE.ground, u), stride = at(POSE.stride, u), bulk = at(POSE.bulk, u);
  const put = (j, x, y, z) => { out[o + j * 3] = x; out[o + j * 3 + 1] = y; out[o + j * 3 + 2] = z; };
  // A leg, from a hip at the origin. An angle is measured off straight down, forward positive.
  const leg = (ph) => {
    const lift = Math.max(0, Math.cos(ph));   // the knee folds as the leg swings forward
    const th = squat + stride * Math.sin(ph), sh = th - (squat * 2 + 0.75 * lift * (0.4 + stride));
    const kx = 0.45 * S * Math.sin(th), ky = -0.45 * S * Math.cos(th);
    const ax = kx + 0.45 * S * Math.sin(sh), ay = ky - 0.45 * S * Math.cos(sh);
    return [kx, ky, ax, ay, ax + 0.2 * S * Math.cos(0.35 * lift), ay - 0.2 * S * Math.sin(0.35 * lift) - 0.025];
  };
  const L = leg(phase), R = leg(phase + Math.PI);
  const py = 0.06 * S - Math.min(L[3], R[3]);   // the lower ankle stands on the ground
  const cx = 0.42 * S * Math.sin(lean), cy = 0.42 * S * Math.cos(lean);
  const nx = cx + 0.2 * S * Math.sin(lean * 0.9), ny = cy + 0.2 * S * Math.cos(lean * 0.9);
  const hx = nx + 0.19 * S * Math.sin(lean * 0.72), hy = ny + 0.19 * S * Math.cos(lean * 0.72);
  const px = x0 - hx * 0.5;                      // centred between the hips and the head
  const sx = cx + 0.8 * (nx - cx), sy = cy + 0.8 * (ny - cy);
  const arm = (ph) => {
    const sw = Math.sin(ph), ua = 0.3 * S * reach, fa = 0.28 * S * reach;
    const up = lean * 0.3 + stride * 0.9 * sw, lo = up + 0.2 + 0.35 * Math.max(0, sw);
    let ex = sx + ua * Math.sin(up), ey = sy - ua * Math.cos(up), wx = ex + fa * Math.sin(lo), wy = ey - fa * Math.cos(lo);
    if (ground > 0) {   // the hands step like front feet
      const tx = sx + 0.14 * S + 0.2 * S * sw, ty = 0.05 + 0.09 * Math.max(0, Math.cos(ph)) - py;
      ex = lerp(ex, (sx + tx) / 2 - 0.06 * S, ground); ey = lerp(ey, (sy + ty) / 2, ground);
      wx = lerp(wx, tx, ground); wy = lerp(wy, ty, ground);
    }
    return [ex, ey, wx, wy];
  };
  const AL = arm(phase + Math.PI), AR = arm(phase), zs = 0.19 * S * bulk, zh = 0.1 * S * bulk;
  put(PELVIS, px, py, 0); put(CHEST, px + cx, py + cy, 0); put(NECK, px + nx, py + ny, 0); put(HEAD, px + hx, py + hy, 0);
  put(SH_L, px + sx, py + sy, zs); put(ELB_L, px + AL[0], py + AL[1], zs * 1.05); put(HAND_L, px + AL[2], py + AL[3], zs * 1.05);
  put(SH_R, px + sx, py + sy, -zs); put(ELB_R, px + AR[0], py + AR[1], -zs * 1.05); put(HAND_R, px + AR[2], py + AR[3], -zs * 1.05);
  put(HIP_L, px, py, zh); put(KNEE_L, px + L[0], py + L[1], zh); put(FOOT_L, px + L[2], py + L[3], zh); put(TOE_L, px + L[4], py + L[5], zh);
  put(HIP_R, px, py, -zh); put(KNEE_R, px + R[0], py + R[1], -zh); put(FOOT_R, px + R[2], py + R[3], -zh); put(TOE_R, px + R[4], py + R[5], -zh);
  return [S * bulk, at(POSE.shag, u)];
}

export default function march(canvas, layer, eras, ui) {
  const s = stage(canvas, { fov: 35 });
  const { scene, camera } = s;
  const n = eras.length, GAP = 1.15;

  let seedState = 11;
  const R = () => { seedState = (seedState + 0x6d2b79f5) >>> 0; let t = seedState; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  // Every figure gets the same number of points, each pinned to a place on one bone.
  const each = Math.round((tier === 'low' ? 10800 : 24000) / n), N = each * n;
  const share = BONES.reduce((sum, b) => sum + b[4], 0);
  const aBone = new Float32Array(N * 2), aT = new Float32Array(N), aOff = new Float32Array(N * 3), aWho = new Float32Array(N), aSeed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let pick = R() * share, b = BONES[0];
    for (const bone of BONES) { b = bone; if ((pick -= bone[4]) <= 0) break; }
    const t = R(), r = lerp(b[2], b[3], t) * Math.cbrt(R());   // evenly through a ball of the bone's radius
    const u = R() * 2 - 1, a = R() * 6.2832, k = Math.sqrt(1 - u * u);
    aBone.set([b[0], b[1]], i * 2); aT[i] = t; aWho[i] = i % n; aSeed[i] = R();
    aOff.set([r * k * Math.cos(a), r * u * (b[0] === HEAD ? 1.12 : 1), r * k * Math.sin(a)], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  geo.setAttribute('aBone', new THREE.BufferAttribute(aBone, 2));
  geo.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
  geo.setAttribute('aOff', new THREE.BufferAttribute(aOff, 3));
  geo.setAttribute('aWho', new THREE.BufferAttribute(aWho, 1));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));
  const joints = new Float32Array(n * J * 3), figs = new Float32Array(n * 4);
  const uniforms = { uJ: { value: joints }, uFig: { value: figs }, uTime: { value: 0 }, uSize: { value: 40 }, uGain: { value: 0.5 } };
  const body = new THREE.Points(geo, new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform vec3 uJ[${n * J}]; uniform vec4 uFig[${n}];   // per figure: thickness, how far along, shag, light
      uniform float uTime, uSize;
      attribute vec2 aBone; attribute float aT; attribute vec3 aOff; attribute float aWho; attribute float aSeed;
      varying float vSeed; varying float vAlong; varying float vLight;
      void main() {
        int who = int(aWho + 0.5), base = who * ${J};
        vec4 f = uFig[who];
        vec3 p = mix(uJ[base + int(aBone.x + 0.5)], uJ[base + int(aBone.y + 0.5)], aT) + aOff * f.x;
        p += (0.012 + 0.05 * f.z) * vec3(sin(uTime * 1.3 + aSeed * 40.0 + p.y * 5.0), cos(uTime * 1.1 + aSeed * 31.0 + p.x * 4.0), sin(uTime * 0.9 + aSeed * 23.0));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * (0.5 + aSeed * 0.9) / -mv.z;
        vSeed = aSeed; vAlong = f.y; vLight = f.w;
      }`,
    fragmentShader: `
      varying float vSeed; varying float vAlong; varying float vLight; uniform float uGain;
      void main() {
        float a = smoothstep(0.5, 0.05, length(gl_PointCoord - 0.5));
        vec3 early = mix(vec3(0.5, 0.34, 0.95), vec3(0.72, 0.5, 1.0), vSeed);   // violet at the start
        vec3 late = mix(vec3(0.36, 0.78, 1.0), vec3(0.78, 0.92, 1.0), vSeed);   // blue, near white, by the end
        vec3 c = mix(early, late, vAlong);
        if (fract(vSeed * 17.0) > mix(0.99, 0.9, vAlong)) c = vec3(1.0, 0.84, 0.29);
        gl_FragColor = vec4(c * a * uGain * vLight, a * vLight);
      }`,
  }));
  body.frustumCulled = false;
  scene.add(body);

  // the ground is a ruler that slides under the walker
  const rule = new THREE.Group(), marks = [];
  for (let k = -120; k <= 120; k++) marks.push(new THREE.Vector3(k * 0.5, 0, 0), new THREE.Vector3(k * 0.5, k % 4 === 0 ? -0.14 : -0.06, 0));
  rule.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(marks), new THREE.LineBasicMaterial({ color: 0x3a4a6e })));
  const floor = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-70, 0, 0), new THREE.Vector3(70, 0, 0)]), new THREE.LineBasicMaterial({ color: 0x4a5b82 }));
  scene.add(rule, floor);

  // Agents: one companion belongs to the era before last, the crew and its work to the last.
  const coreGeo = new THREE.SphereGeometry(0.028, 12, 8);
  const crew = Array.from({ length: tier === 'low' ? 6 : 9 }, (_, j) => {
    const dot = glow(j ? 0xdfe8ff : 0xffe9a8, j ? 0.2 : 0.26, 0);
    const core = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: j ? 0xeaf1ff : 0xfff0c2, transparent: true, opacity: 0 }));
    dot.add(core);
    core.scale.setScalar(1 / dot.scale.x);   // a sprite's scale reaches its children, so undo it
    scene.add(dot);
    return { dot, core, home: j ? n - 1 : n - 2, from: j ? n - 1.8 + j * 0.03 : n - 2.55, r: j ? 0.72 + (j % 4) * 0.14 : 0.62, sp: (j % 2 ? 1 : -1) * (0.7 + (j % 3) * 0.25), ph: j * 2.4, tip: 0.35 + (j % 3) * 0.22 };
  });
  const cardGeo = new THREE.BoxGeometry(0.17, 0.115, 0.02);
  const cards = [0, 1, 2].map((j) => {
    const mesh = new THREE.Mesh(cardGeo, new THREE.MeshBasicMaterial({ color: 0x7ef0c0, transparent: true, opacity: 0 }));
    scene.add(mesh);
    return { mesh, r: 0.9 + j * 0.16, sp: 0.5 + j * 0.17, ph: j * 2.3 };
  });

  // one label per era: under its figure in the row, then along the foot of the stage
  const pips = eras.map((e, i) => {
    const el = document.createElement('button');
    el.className = 'pip';
    el.style.setProperty('--hue', e.hue);
    el.textContent = e.year;
    el.setAttribute('aria-label', `${e.years}: ${e.title}`);
    el.addEventListener('click', () => ui.onGo(i));
    layer.appendChild(el);
    return el;
  });

  let want = -1, spread = 1, era = 0, travel = 0, lit = -2, far = 12, close = 4.7, wide = 1, tall = 1, dots = 40;
  s.onSize((w, h) => {
    wide = w; tall = h;
    const view = 2 * Math.tan((camera.fov * Math.PI) / 360), aspect = w / h;
    far = Math.max(4.8, ((n - 1) * GAP + 1.5) / (0.94 * view * aspect));   // the whole row fits across
    close = Math.max(4.7, 3.0 / (view * aspect));                         // one walker, and room for its crew
    dots = h * s.renderer.getPixelRatio() * (tier === 'low' ? 0.062 : 0.05);
  });

  const feet = new THREE.Vector3();
  s.onTick((t, dt) => {
    const k = 1 - Math.exp(-dt * 7), was = era;
    spread = lerp(spread, clamp(-want, 0, 1), k);
    era = lerp(era, clamp(want, 0, n - 1), k);
    travel += Math.abs(era - was) * 7;   // scrolling walks it on
    const row = ease(spread), phase = t * (calm ? 0.5 : 2.1) + travel * 2.2;
    uniforms.uTime.value = t;
    uniforms.uSize.value = dots * lerp(0.56, 1, row);
    for (let i = 0; i < n; i++) {
      const u = lerp(era, i, spread) / (n - 1);
      const [thick, shag] = stand(joints, i * J * 3, u, phase + i * 1.1 * row, (i - (n - 1) / 2) * GAP * row);
      figs.set([thick, u, shag, lerp(3.4 / n, 1, row)], i * 4);
    }
    rule.position.x = -((phase * 0.16) % 2);
    const d = lerp(close, far, row);
    camera.position.set(Math.sin(t * 0.23) * 0.3 * (calm ? 0 : 1) + (s.pointer.inside ? s.pointer.x * 0.4 : 0), lerp(1.02, 0.95, row), d);
    camera.lookAt(0, lerp(0.98, 0.8, row), 0);

    for (const c of crew) {
      const o = c.home * J * 3 + CHEST * 3, along = lerp(era, c.home, spread), a = t * c.sp * (calm ? 0.3 : 1) + c.ph;
      c.dot.position.set(joints[o] + Math.cos(a) * c.r, joints[o + 1] + 0.1 + Math.sin(a) * c.r * c.tip, Math.sin(a) * c.r * 0.7);
      c.dot.material.opacity = c.core.material.opacity = 0.95 * clamp((along - c.from) / 0.45, 0, 1);
      c.dot.visible = c.dot.material.opacity > 0.01;
    }
    const o = (n - 1) * J * 3 + CHEST * 3, done = clamp((lerp(era, n - 1, spread) - (n - 1.45)) / 0.4, 0, 1);
    for (const c of cards) {
      const a = -t * c.sp * (calm ? 0.3 : 1) + c.ph;
      c.mesh.position.set(joints[o] + Math.cos(a) * c.r, joints[o + 1] + 0.05 + Math.sin(a) * 0.22, Math.sin(a) * c.r * 0.75);
      c.mesh.material.opacity = 0.9 * done;
      c.mesh.visible = done > 0.01;
    }

    const now = spread > 0.5 ? -1 : Math.round(era);
    if (now !== lit) { lit = now; pips.forEach((el, i) => { el.dataset.on = String(i === now); }); }
    const step = Math.min(76, (wide - 68) / (n - 1));
    pips.forEach((el, i) => {
      const p = s.project(feet.set((i - (n - 1) / 2) * GAP * row, -0.34, 0));
      const x = lerp(wide / 2 + (i - (n - 1) / 2) * step, p.x, row), y = lerp(tall - 34, p.y, row);
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
    });
  });

  return { /** Where the reader is: -1 at the row, then 0 to the last era. */ set(p) { want = p; } };
}
