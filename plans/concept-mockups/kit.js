// Shared helpers for the concept mockups. Rough on purpose: primitives, light and bloom,
// enough to judge a look. Nothing here is meant to survive into the real site.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export { THREE };

/** Seeded random, so a scene looks the same on every load. */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function stage(o) {
  if (o.light) document.body.classList.add('light');
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = o.neutral ? THREE.NeutralToneMapping : THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = o.exposure ?? 1;
  document.getElementById('stage').appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(o.bg ?? 0x000000);
  if (o.fog) scene.fog = new THREE.FogExp2(o.fog[0], o.fog[1]);

  const camera = new THREE.PerspectiveCamera(o.fov ?? 35, innerWidth / innerHeight, 0.1, 800);
  camera.position.set(...o.cam);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...(o.target ?? [0, 0, 0]));
  controls.enableDamping = true;
  controls.update();

  const target = new THREE.WebGLRenderTarget(innerWidth * dpr, innerHeight * dpr, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  const b = o.bloom ?? [0.6, 0.6, 0.85];
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), b[0], b[1], b[2]));
  composer.addPass(new OutputPass());

  const labels = [];
  const ticks = [];
  const v = new THREE.Vector3();

  function label(text, pos, cls = '') {
    const el = document.createElement('div');
    el.className = `label ${cls}`;
    el.innerHTML = text;
    document.getElementById('labels').appendChild(el);
    const entry = { el, pos: new THREE.Vector3(...pos) };
    labels.push(entry);
    return entry;
  }

  function hud(html) {
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    const el = wrap.firstElementChild;
    document.getElementById('hud').appendChild(el);
    return el;
  }

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
  });

  const clock = new THREE.Clock();
  let frames = 0;
  function frame() {
    const t = clock.getElapsedTime();
    for (const f of ticks) f(t);
    controls.update();
    composer.render();
    for (const L of labels) {
      v.copy(L.pos).project(camera);
      const seen = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05;
      L.el.style.display = seen ? '' : 'none';
      L.el.style.left = `${(v.x * 0.5 + 0.5) * innerWidth}px`;
      L.el.style.top = `${(-v.y * 0.5 + 0.5) * innerHeight}px`;
    }
    if (++frames === 5) window.__ready = true;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return { scene, camera, renderer, controls, label, hud, onTick: (f) => ticks.push(f) };
}

/** Soft studio reflections for metal and glass. */
export function env(s, intensity = 1) {
  const pm = new THREE.PMREMGenerator(s.renderer);
  s.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  s.scene.environmentIntensity = intensity;
}

export function sun(scene, color, intensity, pos, size = 30) {
  const l = new THREE.DirectionalLight(color, intensity);
  l.position.set(...pos);
  l.castShadow = true;
  l.shadow.mapSize.set(2048, 2048);
  const c = l.shadow.camera;
  c.left = -size; c.right = size; c.top = size; c.bottom = -size; c.near = 0.5; c.far = 260;
  l.shadow.bias = -0.0004;
  l.shadow.normalBias = 0.03;
  scene.add(l);
  return l;
}

export const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0, ...o });
export const lit = (color, k = 2, o = {}) => new THREE.MeshStandardMaterial({ color: 0x000000, emissive: color, emissiveIntensity: k, ...o });

function place(parent, mesh, pos, o) {
  mesh.position.set(...pos);
  mesh.castShadow = o.cast ?? true;
  mesh.receiveShadow = o.receive ?? true;
  if (o.rot) mesh.rotation.set(...o.rot);
  parent.add(mesh);
  return mesh;
}

export const box = (parent, size, pos, material, o = {}) => place(parent, new THREE.Mesh(new THREE.BoxGeometry(...size), material), pos, o);
export const cyl = (parent, rTop, rBot, h, pos, material, o = {}) =>
  place(parent, new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, o.seg ?? 28), material), pos, o);
export const ball = (parent, r, pos, material, o = {}) => place(parent, new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), material), pos, o);

export function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** A glowing flat screen drawn with the 2D canvas. `boost` above 1 feeds the bloom. */
export function screen(parent, w, h, pos, draw, o = {}) {
  const px = o.px ?? 512;
  const material = new THREE.MeshBasicMaterial({ map: canvasTex(px, Math.round((px * h) / w), draw), transparent: !!o.transparent, side: o.side ?? THREE.FrontSide });
  material.color.setScalar(o.boost ?? 1.25);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  m.position.set(...pos);
  if (o.rot) m.rotation.set(...o.rot);
  parent.add(m);
  return m;
}

export function tube(parent, pts, r, material, seg = 240) {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, seg, r, 10, false), material);
  mesh.castShadow = true;
  parent.add(mesh);
  return { mesh, curve };
}

export function line(parent, pts, color, o = {}) {
  const geo = new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(...p)));
  const material = o.dashed
    ? new THREE.LineDashedMaterial({ color, dashSize: o.dashed, gapSize: o.dashed * 0.7, transparent: true, opacity: o.opacity ?? 1 })
    : new THREE.LineBasicMaterial({ color, transparent: true, opacity: o.opacity ?? 1 });
  const l = new THREE.Line(geo, material);
  if (o.dashed) l.computeLineDistances();
  parent.add(l);
  return l;
}

/** Cheap value noise, enough for terrain. */
export function noise2(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const h = (i, j) => { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s); };
  const u = xf * xf * (3 - 2 * xf), w = yf * yf * (3 - 2 * yf);
  return h(xi, yi) * (1 - u) * (1 - w) + h(xi + 1, yi) * u * (1 - w) + h(xi, yi + 1) * (1 - u) * w + h(xi + 1, yi + 1) * u * w;
}

export function fbm(x, y, octaves = 4) {
  let sum = 0, amp = 0.5, f = 1;
  for (let i = 0; i < octaves; i++) { sum += amp * noise2(x * f, y * f); amp *= 0.5; f *= 2; }
  return sum;
}
