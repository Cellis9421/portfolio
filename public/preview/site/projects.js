// Shipped: a curved wall of screens, one per body of work, with their real screenshots, over a dark glass floor.
import { THREE, stage, tier, canvasTexture, clamp, lerp } from './stage.js';

export const HUE = { Cybrary: '#5cc8ff', 'Stove & Grill Parts': '#ff8f3a', Personal: '#b78cff' };

export default function projects(canvas, list, ui) {
  const s = stage(canvas, { fov: 34, fog: [0x0a0c11, 0.022], tone: THREE.NoToneMapping });
  const { scene, camera } = s;
  const RAD = 15, STEP = 0.214, W = 2.95, H = 2.03, ROWS = [1.16, -1.16], FLOOR = -2.5;
  camera.position.set(0, 0.2, -RAD + 13.4);
  camera.lookAt(0, 0.75, -RAD);

  const SIZE = tier === 'low' ? [480, 330] : [640, 440];
  const cols = Math.ceil(list.length / 2), angleOf = (col) => (col - (cols - 1) / 2) * STEP;
  const wall = new THREE.Group();
  scene.add(wall);

  function paint(tex, p, img) {
    const { g } = tex.userData, w = 640, h = 440, top = 330, hue = HUE[p.group];
    g.setTransform(tex.userData.w / 640, 0, 0, tex.userData.h / 440, 0, 0);
    g.clearRect(0, 0, w, h);
    g.save();
    g.beginPath(); g.roundRect(3, 3, w - 6, h - 6, 28); g.clip();
    g.fillStyle = '#131824'; g.fillRect(0, 0, w, h);
    if (img) {
      const k = Math.max(w / img.width, top / img.height);
      g.drawImage(img, 0, 0, w / k, top / k, 0, 0, w, top);
    } else {
      const bg = g.createLinearGradient(0, 0, w, top);
      bg.addColorStop(0, '#1a2233'); bg.addColorStop(1, hue);
      g.fillStyle = bg; g.fillRect(0, 0, w, top);
      // no screenshot to wait for: the cover is the claim itself, set large
      g.fillStyle = 'rgba(10, 12, 17, .45)'; g.fillRect(0, 0, w, top);
      g.fillStyle = '#fff'; g.font = '600 38px Georgia, "Times New Roman", serif';
      const lines = [];
      for (const word of (p.shot ? '' : p.proof ?? p.title).split(' ')) {
        const last = lines[lines.length - 1];
        if (last !== undefined && g.measureText(`${last} ${word}`).width < w - 96) lines[lines.length - 1] = `${last} ${word}`; else lines.push(word);
      }
      lines.slice(0, 5).forEach((ln, k) => g.fillText(ln, 48, top / 2 - (Math.min(lines.length, 5) - 1) * 24 + k * 48 + 12));
    }
    g.fillStyle = '#131824'; g.fillRect(0, top, w, h - top);
    g.fillStyle = hue; g.fillRect(0, top, w, 5);
    g.fillStyle = '#fff';
    let title = p.title, px = 31;
    g.font = `700 ${px}px "Segoe UI", Arial`;
    while (g.measureText(title).width > w - 60 && px > 25) g.font = `700 ${--px}px "Segoe UI", Arial`;   // shrink first, then cut
    while (g.measureText(title).width > w - 60 && title.length > 4) title = `${title.slice(0, -2).trimEnd()}…`;
    g.fillText(title, 28, top + 50);
    g.fillStyle = hue; g.beginPath(); g.arc(36, top + 82, 6, 0, 7); g.fill();
    g.fillStyle = '#9aa6bd'; g.font = '500 21px "Segoe UI", Arial';
    let under = p.shot ? (p.proof ?? p.group) : p.group;
    while (g.measureText(under).width > w - 84 && under.length > 4) under = `${under.slice(0, -2).trimEnd()}…`;
    g.fillText(under, 52, top + 89);
    g.restore();
    const sheen = g.createLinearGradient(0, 0, w * 0.7, top);  // light catching the glass
    sheen.addColorStop(0, 'rgba(255,255,255,.16)'); sheen.addColorStop(0.45, 'rgba(255,255,255,0)');
    g.save(); g.beginPath(); g.roundRect(3, 3, w - 6, top, [28, 28, 0, 0]); g.clip(); g.fillStyle = sheen; g.fillRect(0, 0, w, top); g.restore();
    g.strokeStyle = 'rgba(255,255,255,.2)'; g.lineWidth = 3;
    g.beginPath(); g.roundRect(3, 3, w - 6, h - 6, 28); g.stroke();
    tex.needsUpdate = true;
  }

  const geo = new THREE.PlaneGeometry(W, H), rimGeo = new THREE.PlaneGeometry(W + 0.12, H + 0.12);
  const cards = list.map((p, i) => {
    const col = Math.floor(i / 2), row = i % 2, a = angleOf(col);
    const tex = canvasTexture(SIZE[0], SIZE[1], () => {});
    paint(tex, p, null);
    const mat = new THREE.MeshBasicMaterial({ map: tex, alphaTest: 0.5, alphaToCoverage: true });
    const mesh = new THREE.Mesh(geo, mat);
    const pivot = new THREE.Group();
    pivot.rotation.y = -a;
    mesh.position.set(0, ROWS[row], -RAD);
    const rim = new THREE.Mesh(rimGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(HUE[p.group]).multiplyScalar(1.5) }));
    rim.position.set(0, ROWS[row], -RAD - 0.03);
    rim.visible = false;
    const echo = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.15, depthWrite: false, side: THREE.DoubleSide }));
    echo.position.set(0, 2 * FLOOR - ROWS[row], -RAD);
    echo.scale.y = -1;
    pivot.add(mesh, rim, echo);
    wall.add(pivot);
    mesh.userData.card = i;
    return { p, col, row, a, mesh, rim, echo, mat, tex, lift: 0, shown: 1 };
  });
  // Load the screenshots two at a time, nearest the middle first, decoding off the main thread.
  const queue = cards.filter((c) => c.p.shot).sort((x, y) => Math.abs(x.a) - Math.abs(y.a));
  const next = async () => {
    const c = queue.shift();
    if (!c) return;
    try { paint(c.tex, c.p, await createImageBitmap(await (await fetch(`assets/shots/${c.p.shot.replace('.png', '.webp')}`)).blob())); } catch { /* the drawn cover stays */ }
    next();
  };
  next(); next();
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 60), new THREE.MeshBasicMaterial({ color: 0x0a0c11, transparent: true, opacity: 0.55 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, FLOOR, -RAD);
  scene.add(floor);

  let rot = 0, want = 0, vel = 0, drag = null, hovered = -1, picked = -1, keep = () => true;
  const ends = () => { const on = cards.filter((c) => keep(c.p)); return on.length ? [Math.min(...on.map((c) => c.a)), Math.max(...on.map((c) => c.a))] : [angleOf(0), angleOf(cols - 1)]; };
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
  canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, rot: want, moved: false, t: performance.now() }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 5) drag.moved = true;
    const next = drag.rot - dx * 0.0032;
    vel = next - want;
    want = next;
  });
  canvas.addEventListener('pointerup', () => {
    if (drag && !drag.moved && hovered >= 0) pick(hovered);
    if (drag?.moved) want += vel * 6;
    drag = null;
  });
  canvas.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) { e.preventDefault(); want += (e.deltaX || e.deltaY) * 0.0012; } }, { passive: false });
  canvas.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'Enter' && hovered >= 0) pick(hovered);
  });
  function step(n) { want = angleOf(clamp(Math.round(want / STEP + (cols - 1) / 2) + n, 0, cols - 1)); }
  function pick(i) {
    picked = i;
    if (i >= 0) { want = cards[i].a; ui.onPick(cards[i].p); }
  }

  s.onTick((t, dt) => {
    const [lo, hi] = ends();
    if (!drag) {
      want = clamp(want, lo - 0.02, hi + 0.02);
      const snap = angleOf(Math.round(want / STEP + (cols - 1) / 2));
      want = lerp(want, snap, 1 - Math.pow(0.02, dt));
    } else want = clamp(want, lo - 0.25, hi + 0.25);
    rot = lerp(rot, want, 1 - Math.pow(0.0008, dt));
    wall.rotation.y = rot;

    hovered = -1;
    if (s.pointer.inside && !drag?.moved) {
      mouse.set(s.pointer.x, s.pointer.y);
      ray.setFromCamera(mouse, camera);
      const hit = ray.intersectObjects(cards.filter((c) => keep(c.p)).map((c) => c.mesh), false)[0];
      if (hit) hovered = hit.object.userData.card;
    }
    canvas.style.cursor = drag?.moved ? 'grabbing' : hovered >= 0 ? 'pointer' : 'grab';
    for (const [i, c] of cards.entries()) {
      const on = keep(c.p), hot = i === hovered || i === picked;
      c.lift = lerp(c.lift, hot && on ? 1 : 0, 1 - Math.pow(0.001, dt));
      c.shown = lerp(c.shown, on ? 1 : 0.13, 1 - Math.pow(0.002, dt));
      c.mesh.position.z = -RAD + c.lift * 0.75;
      c.mesh.scale.setScalar(1 + c.lift * 0.07);
      c.mat.color.setScalar(c.shown * (1 + c.lift * 0.12));
      c.echo.material.opacity = 0.15 * c.shown;
      c.rim.visible = i === picked;
      c.rim.position.z = c.mesh.position.z - 0.03;
      c.rim.scale.copy(c.mesh.scale);
    }
  });

  return {
    step,
    pick: (id) => pick(cards.findIndex((c) => c.p.id === id)),
    filter(fn) {
      keep = fn ?? (() => true);
      if (picked >= 0 && !keep(cards[picked].p)) picked = -1;
      const first = cards.find((c) => keep(c.p));
      if (first) want = first.a;
      return cards.filter((c) => keep(c.p)).length;
    },
  };
}
