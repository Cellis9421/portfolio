// One small WebGL stage per section. It only draws while its canvas is on screen.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export { THREE };
export const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp = THREE.MathUtils.clamp, lerp = THREE.MathUtils.lerp;
export const ease = (x) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };

export function stage(canvas, o = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !o.bloom, powerPreference: 'high-performance' });
  const dpr = Math.min(devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = o.tone ?? THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = o.exposure ?? 1;
  if (o.shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(o.bg ?? 0x0a0c11);
  if (o.fog) scene.fog = new THREE.FogExp2(o.fog[0], o.fog[1]);
  const camera = new THREE.PerspectiveCamera(o.fov ?? 35, 1, 0.1, 400);

  let composer = null;
  if (o.bloom) {
    composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 }));
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(4, 4), ...o.bloom));
    composer.addPass(new OutputPass());
  }

  const ticks = [], sizes = [];
  let seen = false, running = false, last = 0, time = 0, frames = 0;
  function fit() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    for (const f of sizes) f(w, h);
  }
  function frame(now) {
    if (!seen) { running = false; return; }
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    time += dt;
    for (const f of ticks) f(time, dt);
    if (composer) composer.render(); else renderer.render(scene, camera);
    if (++frames === 4) canvas.dataset.ready = '1';
    requestAnimationFrame(frame);
  }
  new IntersectionObserver(([e]) => {
    seen = e.isIntersecting;
    if (seen && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }, { rootMargin: '120px' }).observe(canvas);
  new ResizeObserver(fit).observe(canvas);
  fit();

  // pointer, in the canvas's own -1..1 space
  const pointer = { x: 0, y: 0, inside: false, down: false };
  const place = (e) => { const r = canvas.getBoundingClientRect(); pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1; pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1; };
  canvas.addEventListener('pointermove', (e) => { place(e); pointer.inside = true; });
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
  t.anisotropy = 8;
  t.userData = { g, w, h };
  return t;
}
