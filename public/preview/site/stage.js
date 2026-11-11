// One small WebGL stage per section. It draws only while its canvas is on screen, picks how
// much to draw from the machine it is on, and trades sharpness for frame rate when frames run long.
import * as THREE from 'three';

export { THREE };
export const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp = THREE.MathUtils.clamp, lerp = THREE.MathUtils.lerp;
export const ease = (x) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };
/** Yield to the page between heavy steps, so building a scene never locks scrolling. */
export const breathe = () => new Promise((r) => setTimeout(r));

// A phone, or a machine with few cores or little memory, gets the light tier.
const weak = matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) < 700 || (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory || 8) <= 4;
export const tier = new URLSearchParams(location.search).get('tier') ?? (weak ? 'low' : (navigator.hardwareConcurrency || 4) >= 12 ? 'high' : 'mid');
const CAP = { high: 2, mid: 1.5, low: 1.25 }[tier] ?? 1.5;

export function stage(canvas, o = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: tier !== 'low', powerPreference: 'high-performance' });
  renderer.toneMapping = o.tone ?? THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = o.exposure ?? 1;
  if (o.shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(o.bg ?? 0x0a0c11);
  if (o.fog) scene.fog = new THREE.FogExp2(o.fog[0], o.fog[1]);
  const camera = new THREE.PerspectiveCamera(o.fov ?? 35, 1, 0.1, 400);

  const ticks = [], sizes = [];
  let seen = false, running = false, last = 0, time = 0, frames = 0, scale = 1, cost = 16, slow = 0, quick = 0;
  function fit() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, CAP) * scale);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    for (const f of sizes) f(w, h);
  }
  function frame(now) {
    if (!seen) { running = false; return; }
    const dt = Math.min(0.1, (now - last) / 1000 || 0);
    last = now;
    time += Math.min(dt, 0.05);
    for (const f of ticks) f(time, Math.min(dt, 0.05));
    renderer.render(scene, camera);
    if (++frames === 4) canvas.dataset.ready = '1';
    if (frames > 20) {  // three slow seconds soften the picture; a long quick spell sharpens it again
      cost += (dt * 1000 - cost) * 0.05;
      if (cost > 24) { quick = 0; if (++slow > 45 && scale > 0.55) { scale = Math.max(0.55, scale * 0.85); slow = 0; cost = 16; fit(); } }
      else if (cost < 13) { slow = 0; if (++quick > 240 && scale < 1) { scale = Math.min(1, scale / 0.9); quick = 0; fit(); } }
      else { slow = 0; quick = 0; }
    }
    requestAnimationFrame(frame);
  }
  new IntersectionObserver(([e]) => {
    seen = e.isIntersecting;
    if (seen && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }, { rootMargin: '80px' }).observe(canvas);
  new ResizeObserver(fit).observe(canvas);
  fit();
  // Once the caller has filled the scene, build its shaders in the background, so the first frame does not stall on them.
  setTimeout(() => renderer.compileAsync(scene, camera).catch(() => {}));

  // pointer, in the canvas's own -1..1 space
  const pointer = { x: 0, y: 0, inside: false };
  const place = (e) => { const r = canvas.getBoundingClientRect(); pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1; pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1; pointer.inside = true; };
  canvas.addEventListener('pointermove', place);
  canvas.addEventListener('pointerdown', place);
  canvas.addEventListener('pointerleave', () => { pointer.inside = false; });

  const v = new THREE.Vector3();
  /** Where a world point lands on the canvas, in CSS pixels, and how deep it is. */
  const project = (world) => {
    v.copy(world).project(camera);
    return { x: (v.x * 0.5 + 0.5) * canvas.clientWidth, y: (-v.y * 0.5 + 0.5) * canvas.clientHeight, z: v.z };
  };
  return { renderer, scene, camera, canvas, pointer, project, onTick: (f) => ticks.push(f), onSize: (f) => { sizes.push(f); f(canvas.clientWidth, canvas.clientHeight); } };
}

export function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.userData = { g, w, h };
  return t;
}

/** A soft round glow, for anything that should look lit without a blur pass over the whole frame. */
let glowMap = null;
export function glow(colour, size, opacity = 0.6) {
  glowMap ??= canvasTexture(128, 128, (g) => { const k = g.createRadialGradient(64, 64, 0, 64, 64, 64); k.addColorStop(0, 'rgba(255,255,255,1)'); k.addColorStop(0.28, 'rgba(255,255,255,.34)'); k.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = k; g.fillRect(0, 0, 128, 128); });
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: colour, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }));
  sprite.scale.setScalar(size);
  return sprite;
}
