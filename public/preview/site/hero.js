// About: a swarm of particles. Point at a link and the swarm spells it. The links are satellites round it.
import { THREE, stage, tier, glow, calm, clamp, lerp, ease } from './stage.js';

export default function hero(canvas, anchors, opts = {}) {
  const s = stage(canvas, { fov: 35 });
  const { scene, camera } = s;
  camera.position.set(0, 0, 14);

  let seedState = 7;
  const R = () => { seedState = (seedState + 0x6d2b79f5) >>> 0; let t = seedState; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  const N = Math.round((tier === 'low' ? 11000 : 26000) * (opts.share ?? 1));
  const A = new Float32Array(N * 3), B = new Float32Array(N * 3), seed = new Float32Array(N);
  for (let i = 0; i < N; i++) { seed[i] = R(); A.set([(R() - 0.5) * 30, (R() - 0.5) * 18, (R() - 0.5) * 12], i * 3); }

  const ball = (() => {
    const out = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const u = R() * 2 - 1, a = R() * 6.2832, k = Math.sqrt(1 - u * u), r = 3.2 * (R() < 0.82 ? 1 : 0.55 + R() * 0.4);
      out.set([r * k * Math.cos(a), r * u, r * k * Math.sin(a)], i * 3);
    }
    return out;
  })();
  const word = (text) => {
    const c = document.createElement('canvas');
    c.width = 1100; c.height = 300;
    const g = c.getContext('2d', { willReadFrequently: true });
    let px = 190;
    g.font = `800 ${px}px "Segoe UI", Arial, sans-serif`;
    px = Math.min(px, (px * 1020) / g.measureText(text).width);
    g.font = `800 ${px}px "Segoe UI", Arial, sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff';
    g.fillText(text, c.width / 2, c.height / 2 + 8);
    const img = g.getImageData(0, 0, c.width, c.height).data, hits = [];
    for (let y = 0; y < c.height; y += 3) for (let x = 0; x < c.width; x += 3) if (img[(y * c.width + x) * 4 + 3] > 120) hits.push(x, y);
    const out = new Float32Array(N * 3), k = (wide ? 8.4 : 6.3) / c.width;
    for (let i = 0; i < N; i++) {
      const j = Math.floor(R() * (hits.length / 2)) * 2;
      out.set([(hits[j] - c.width / 2 + (R() - 0.5) * 3) * k, -(hits[j + 1] - c.height / 2 + (R() - 0.5) * 3) * k, (R() - 0.5) * 0.5], i * 3);
    }
    return out;
  };
  B.set(ball);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  geo.setAttribute('aA', new THREE.BufferAttribute(A, 3));
  geo.setAttribute('aB', new THREE.BufferAttribute(B, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const uniforms = { uMix: { value: 0 }, uTime: { value: 0 }, uSize: { value: 60 }, uGain: { value: 0.55 }, uPointer: { value: new THREE.Vector3(99, 99, 0) } };
  const swarm = new THREE.Points(geo, new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute vec3 aA; attribute vec3 aB; attribute float aSeed;
      uniform float uMix, uTime, uSize; uniform vec3 uPointer;
      varying float vSeed;
      void main() {
        float m = smoothstep(0.0, 1.0, clamp(uMix * 1.4 - aSeed * 0.4, 0.0, 1.0));
        vec3 p = mix(aA, aB, m);
        p += 0.085 * vec3(sin(uTime * 0.9 + aSeed * 40.0 + p.y * 1.3), cos(uTime * 0.8 + aSeed * 31.0 + p.x * 1.1), sin(uTime * 0.7 + aSeed * 23.0));
        vec2 away = p.xy - uPointer.xy;
        p.xy += normalize(away + 1e-4) * 0.95 * exp(-dot(away, away) * 0.9);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * (0.55 + aSeed * 0.9) / -mv.z;
        vSeed = aSeed;
      }`,
    fragmentShader: `
      varying float vSeed; uniform float uGain;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.05, d);
        vec3 c = mix(vec3(0.36, 0.78, 1.0), vec3(0.72, 0.55, 1.0), vSeed);
        if (fract(vSeed * 17.0) > 0.93) c = vec3(1.0, 0.84, 0.29);
        gl_FragColor = vec4(c * a * uGain, a);
      }`,
  }));
  swarm.frustumCulled = false;
  const group = new THREE.Group();
  group.add(swarm);
  scene.add(group);

  // the links, as satellites
  const hues = [0x5cc8ff, 0xb78cff, 0xffd54a, 0x7ef0c0];
  const moons = anchors.map((el, j) => {
    const m = new THREE.Group();
    m.add(new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 14), new THREE.MeshBasicMaterial({ color: new THREE.Color(hues[j % 4]).multiplyScalar(1.6) })));
    m.add(glow(hues[j % 4], 1.5, 0.75));
    group.add(m);
    return { el, m, shape: null, phase: (j / anchors.length) * 6.2832 };
  });

  let to = ball, mixing = true, held = -1, back = 0, spin = 0, orbit = 0, wide = true;
  // Left alone, the swarm spells the loop a product engineer runs. It is the page's message, and a phone has no hover to find it.
  const loop = (opts.words ?? ['Plan', 'Build', 'Test', 'Ship']).map((w) => ({ w, shape: null }));
  let beat = 0, wait = opts.first ?? 2.4;
  function form(target) {
    if (target === to) return;
    const m = uniforms.uMix.value;
    for (let i = 0; i < N; i++) {
      const k = ease(clamp(m * 1.4 - seed[i] * 0.4, 0, 1)), j = i * 3;
      A[j] = lerp(A[j], B[j], k); A[j + 1] = lerp(A[j + 1], B[j + 1], k); A[j + 2] = lerp(A[j + 2], B[j + 2], k);
    }
    B.set(target);
    geo.attributes.aA.needsUpdate = geo.attributes.aB.needsUpdate = true;
    uniforms.uMix.value = 0;
    to = target;
    mixing = true;
  }
  moons.forEach((mn, j) => {
    const on = () => { held = j; clearTimeout(back); form(mn.shape ??= word(mn.el.dataset.word)); };
    const off = () => { held = -1; beat = 0; wait = 5; back = setTimeout(() => form(ball), 500); };
    mn.el.addEventListener('pointerenter', on); mn.el.addEventListener('focus', on);
    mn.el.addEventListener('pointerleave', off); mn.el.addEventListener('blur', off);
  });

  s.onSize((w, h) => {
    wide = w / h > 1.25;
    group.position.set(wide ? (opts.x ?? 3.6) : 0, wide ? 0 : (opts.y ?? -0.7), 0);
    group.scale.setScalar(wide ? 1 : clamp((w / h) * 1.25, 0.5, 1));
    uniforms.uSize.value = h * 0.075 * s.renderer.getPixelRatio() * (tier === 'low' ? 1.5 : 1) * (wide ? 1 : 0.5);
    uniforms.uGain.value = wide ? 0.55 : 0.34;
  });

  const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit = new THREE.Vector3(), tmp = new THREE.Vector3();
  s.onTick((t, dt) => {
    uniforms.uTime.value = t;
    if (mixing) { uniforms.uMix.value = Math.min(1, uniforms.uMix.value + dt / 1.5); if (uniforms.uMix.value >= 1) mixing = false; }
    const round = to === ball;
    if (round) spin += dt * (calm ? 0.04 : 0.16); else spin = lerp(spin, Math.round(spin / 6.2832) * 6.2832, 0.08);
    swarm.rotation.y = spin;
    swarm.rotation.x = round ? Math.sin(t * 0.21) * 0.18 : lerp(swarm.rotation.x, 0, 0.08);

    if (s.pointer.inside) {
      ray.setFromCamera(new THREE.Vector2(s.pointer.x, s.pointer.y), camera);
      if (ray.ray.intersectPlane(plane, hit)) uniforms.uPointer.value.copy(hit).sub(group.position).divideScalar(group.scale.x).applyAxisAngle(new THREE.Vector3(0, 1, 0), -spin);
    } else uniforms.uPointer.value.set(99, 99, 0);

    if (held < 0 && !calm) {
      wait -= dt;
      if (wait <= 0) {
        if (beat < loop.length) { const k = loop[beat++]; form(k.shape ??= word(k.w)); wait = opts.hold ?? 2.2; }
        else { beat = 0; form(ball); wait = 4.5; }
      }
    }
    if (held < 0) orbit += dt * (calm ? 0.05 : 0.2);
    moons.forEach((mn, j) => {
      const a = orbit + mn.phase;
      mn.m.position.set(Math.cos(a) * (wide ? 4.9 : 2.3), Math.sin(a + j * 1.3) * (wide ? 1.5 : 2.6), Math.sin(a) * (wide ? 2.6 : 1.5));
      const p = s.project(mn.m.getWorldPosition(tmp)), front = clamp(0.5 + mn.m.position.z / 5.2, 0, 1);
      mn.el.style.transform = `translate(${(wide ? p.x : clamp(p.x, 64, canvas.clientWidth - 64)).toFixed(1)}px, ${p.y.toFixed(1)}px) ${wide ? 'translate(18px, -50%)' : 'translate(-50%, -150%)'}`;
      mn.el.style.opacity = (0.55 + front * 0.45).toFixed(2);
      mn.m.scale.setScalar(j === held ? 1.6 : 1);
    });
  });
}
