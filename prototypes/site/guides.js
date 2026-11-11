// Guides and articles: books on a shelf. Point at one and it comes off the shelf to show its cover.
import { THREE, stage, canvasTexture, lerp } from './stage.js';

export default function guides(canvas, items, ui) {
  const s = stage(canvas, { fov: 30, shadows: true, bloom: [0.16, 0.5, 0.92], exposure: 1.15 });
  const { scene, camera } = s;
  camera.position.set(0.4, 2.5, 13.5);
  camera.lookAt(1.3, 1.25, 0);

  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x1a120c, 0.85));
  const lamp = new THREE.SpotLight(0xffe2ba, 560, 40, 0.6, 0.7, 1.4);
  lamp.position.set(-4, 8.5, 8);
  lamp.target.position.set(0.5, 1, 0);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(2048, 2048);
  lamp.shadow.bias = -0.0004;
  scene.add(lamp, lamp.target);
  const wood = new THREE.MeshStandardMaterial({ color: 0x4a2f1c, roughness: 0.6 });
  const plank = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.26, 2.6), wood);
  plank.position.x = 1.2;
  plank.receiveShadow = plank.castShadow = true;
  scene.add(plank);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshStandardMaterial({ color: 0x10131a, roughness: 0.95 }));
  back.position.set(0, 4, -1.4);
  back.receiveShadow = true;
  scene.add(back);
  const end = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.5, 1.6), new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.3, metalness: 0.9 }));
  end.position.set(-2.25, 0.88, 0);
  end.castShadow = true;
  scene.add(end);

  const page = new THREE.MeshStandardMaterial({ color: 0xf1e9d6, roughness: 0.9 });
  const wrap = (g, text, x, y, width, line) => {
    let row = '';
    for (const wd of text.split(' ')) {
      if (g.measureText(`${row}${wd}`).width > width && row) { g.fillText(row.trim(), x, y); row = ''; y += line; }
      row += `${wd} `;
    }
    g.fillText(row.trim(), x, y);
    return y + line;
  };
  let x = -1.9;
  const books = items.map((it, i) => {
    const thick = it.link ? 0.56 + (i % 2) * 0.12 : 0.4, tall = it.link ? 2.75 - (i % 2) * 0.2 : 2.35, deep = 1.75;
    const cover = canvasTexture(512, 720, (g, w, h) => {
      g.fillStyle = it.hue; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, 0, 26, h);
      g.fillStyle = 'rgba(255,255,255,.92)'; g.font = '600 24px "Segoe UI", Arial'; g.fillText(it.kind.toUpperCase(), 58, 90);
      g.fillStyle = '#fff'; g.font = '700 50px Georgia, serif';
      const y = wrap(g, it.title, 58, 170, w - 100, 58);
      g.font = '400 26px "Segoe UI", Arial'; g.fillStyle = 'rgba(255,255,255,.9)';
      wrap(g, it.blurb, 58, y + 26, w - 110, 36);
      g.font = '700 28px "Segoe UI", Arial'; g.fillStyle = '#fff'; g.fillText(it.link ? 'Open ↗' : 'Not written yet', 58, h - 60);
    });
    const spine = canvasTexture(128, 720, (g, w, h) => {
      g.fillStyle = it.hue; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(0, 0, w, 40); g.fillRect(0, h - 40, w, 40);
      g.save(); g.translate(w / 2 + 14, 70); g.rotate(Math.PI / 2);
      g.fillStyle = '#fff'; g.font = '700 40px Georgia, serif';
      let label = it.short ?? it.title;
      while (g.measureText(label).width > h - 150) label = `${label.slice(0, -2)}…`;
      g.fillText(label, 0, 0);
      g.restore();
    });
    const side = (map) => new THREE.MeshStandardMaterial({ map, roughness: 0.55, transparent: !it.link, opacity: it.link ? 1 : 0.55 });
    const plain = new THREE.MeshStandardMaterial({ color: it.hue, roughness: 0.6, transparent: !it.link, opacity: it.link ? 1 : 0.4 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(thick, tall, deep), [side(cover), plain, page, page, side(spine), page]);
    mesh.castShadow = !!it.link;
    mesh.receiveShadow = true;
    const home = new THREE.Vector3(x + thick / 2, 0.13 + tall / 2, it.link ? 0 : -0.15);
    x += thick + 0.07;
    mesh.position.copy(home);
    mesh.userData.book = i;
    scene.add(mesh);
    return { it, mesh, home, out: 0 };
  });

  let hovered = -1, forced = -1;
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
  canvas.addEventListener('click', () => { if (hovered >= 0 && books[hovered].it.link) window.open(books[hovered].it.link, '_blank', 'noopener'); });
  s.onTick((t, dt) => {
    hovered = -1;
    if (s.pointer.inside) {
      mouse.set(s.pointer.x, s.pointer.y);
      ray.setFromCamera(mouse, camera);
      const hit = ray.intersectObjects(books.map((b) => b.mesh), false)[0];
      if (hit) hovered = hit.object.userData.book;
    }
    const lead = hovered >= 0 ? hovered : forced;
    canvas.style.cursor = hovered >= 0 && books[hovered].it.link ? 'pointer' : 'default';
    ui.onHover(lead);
    for (const [i, b] of books.entries()) {
      b.out = lerp(b.out, i === lead ? 1 : 0, 1 - Math.pow(0.002, dt));
      b.mesh.position.set(b.home.x - b.out * 0.9, b.home.y + b.out * 0.12, b.home.z + b.out * 1.7);
      b.mesh.rotation.y = -b.out * 0.9;
    }
  });
  return { show: (i) => { forced = i; } };
}
