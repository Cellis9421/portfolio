// 3. The deck: every project is a foil card, and one table deals them four ways.
import { THREE, stage, env, rng, std, box, canvasTex } from '../kit.js';

export default function () {
  const s = stage({ bg: 0x050c0a, fog: [0x050c0a, 0.006], cam: [-0.4, 23, 17.5], target: [-0.4, 0, 1.1], fov: 36, bloom: [0.16, 0.5, 0.93], exposure: 1.05 });
  const { scene } = s;
  env(s, 0.1);
  const R = rng(8);

  scene.add(new THREE.HemisphereLight(0xfff1dc, 0x06100c, 0.22));
  const lamp = new THREE.SpotLight(0xffe7c2, 560, 90, 0.72, 0.75, 1.3);
  lamp.position.set(-3, 30, 8);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(2048, 2048);
  lamp.shadow.bias = -0.0003;
  scene.add(lamp, lamp.target);
  box(scene, [120, 1, 90], [0, -0.5, 0], std(0x14503f, { roughness: 1 }), { cast: false });

  const eras = [
    { name: '2009 · Game bots', hue: '#2f7d48', mat: 0x1d5a3a },
    { name: '2012 · Client sites', hue: '#a9791c', mat: 0x6a5320 },
    { name: '2017 · Stove & Grill Parts', hue: '#b3471f', mat: 0x6e3520 },
    { name: '2022 · Cybrary', hue: '#2a5fb0', mat: 0x21406e },
    { name: 'Now', hue: '#6c44b8', mat: 0x43306e },
  ];
  const projects = [
    ['Gather bot', 0, 2009, 'Java', 1], ['Script engine', 0, 2011, 'Java', 0],
    ['Client sites', 1, 2012, 'PHP', 0], ['Custom CMS', 1, 2014, 'JavaScript', 1], ['CRM dashboards', 1, 2015, 'JavaScript', 0],
    ['E-commerce site', 2, 2017, 'Shopify', 2], ['Catalog sync', 2, 2018, 'Python', 2], ['Reporting server', 2, 2019, 'Python', 1],
    ['Diagnostics server', 2, 2020, 'Python', 1], ['Store CMS', 2, 2020, 'Shopify', 0], ['Accessibility', 2, 2021, 'WCAG 2.2', 1],
    ['Enterprise hub', 3, 2023, 'Next.js', 2], ['API client generator', 3, 2023, 'TypeScript', 1], ['Dynamic forms', 3, 2024, 'TypeScript', 0],
    ['Multi-tenancy', 3, 2024, 'React', 1], ['Checkout', 3, 2024, 'React', 0], ['Marketing site', 3, 2022, 'Next.js', 2], ['Demo mocks', 3, 2025, 'MSW', 0],
    ['Small thing 01', 4, 2026, 'Go', 0], ['Small thing 02', 4, 2026, 'TypeScript', 0], ['Small thing 03', 4, 2026, 'Python', 0], ['Small thing 04', 4, 2026, 'Go', 0],
  ];

  const art = (title, e, year, tag, rare, k) => canvasTex(300, 420, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#0f1626'); bg.addColorStop(1, eras[e].hue);
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(24, 104, w - 48, 180);
    g.fillStyle = 'rgba(255,255,255,.85)'; g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 5;
    if (k % 3 === 0) for (let i = 0; i < 7; i++) { const b = 30 + R() * 110; g.fillRect(40 + i * 32, 268 - b, 22, b); }
    else if (k % 3 === 1) { g.beginPath(); for (let i = 0; i <= 10; i++) { const y = 260 - R() * 130; if (i) g.lineTo(40 + i * 22, y); else g.moveTo(40, y); } g.stroke(); }
    else for (let i = 0; i < 16; i++) { g.beginPath(); g.arc(50 + R() * 200, 130 + R() * 130, 5 + R() * 13, 0, 7); g.globalAlpha = 0.4 + R() * 0.6; g.fill(); g.globalAlpha = 1; }
    g.fillStyle = '#fff'; g.font = 'bold 31px "Segoe UI", Arial';
    const words = title.split(' ');
    let line = '', y = 50;
    words.forEach((wd) => { if (g.measureText(`${line}${wd}`).width > w - 50 && line) { g.fillText(line.trim(), 24, y); line = ''; y += 34; } line += `${wd} `; });
    g.fillText(line.trim(), 24, y);
    g.font = '22px "Segoe UI", Arial'; g.fillStyle = 'rgba(255,255,255,.9)'; g.fillText(`${year} · ${tag}`, 24, 326);
    g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(24, 348, 118, 40);
    g.fillStyle = '#fff'; g.font = 'bold 20px "Segoe UI", Arial'; g.fillText('Play ↗', 50, 375);
    g.fillStyle = rare === 2 ? '#f5c451' : rare === 1 ? '#cfd6e2' : 'rgba(255,255,255,.6)'; g.fillText(rare === 2 ? '★★★' : rare === 1 ? '★★' : '★', w - 96, 375);
    g.lineWidth = 12; g.strokeStyle = rare === 2 ? '#f5c451' : rare === 1 ? '#cfd6e2' : 'rgba(255,255,255,.38)'; g.strokeRect(6, 6, w - 12, h - 12);
  });
  const back = canvasTex(300, 420, (g, w, h) => {
    g.fillStyle = '#0f1a33'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#33487a'; g.lineWidth = 3;
    for (let i = -h; i < w; i += 22) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke(); }
    g.strokeStyle = '#f5c451'; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28);
    g.fillStyle = '#f5c451'; g.font = 'bold 110px "Segoe UI", Arial'; g.textAlign = 'center'; g.fillText('CE', w / 2, h / 2 + 38);
  });
  const edge = std(0xf2ead8, { roughness: 0.8 }), backMat = std(0xffffff, { map: back, roughness: 0.5 });
  function card(tex, rare, pos, rot = [0, 0, 0], k = 1) {
    const top = rare === 2
      ? new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.2, metalness: 0.35, iridescence: 1, iridescenceIOR: 1.9, iridescenceThicknessRange: [180, 620], clearcoat: 1, envMapIntensity: 6 })
      : std(0xffffff, { map: tex, roughness: rare ? 0.35 : 0.6, metalness: rare ? 0.2 : 0 });
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.035, 2.27), [edge, edge, top, backMat, edge, edge]);
    m.position.set(...pos);
    m.rotation.set(...rot);
    m.scale.setScalar(k);
    m.castShadow = m.receiveShadow = true;
    scene.add(m);
    return m;
  }

  // Timeline deal: one mat per job, its cards fanned down it
  const mx = (e) => -4.7 + e * 3.95;
  eras.forEach((e, i) => {
    box(scene, [3.7, 0.03, 10.8], [mx(i), 0.015, 1.1], std(e.mat, { roughness: 0.95 }), { cast: false });
    s.label(e.name, [mx(i), 0.2, -4.6], 'plain');
  });
  const slot = [0, 0, 0, 0, 0];
  projects.forEach(([title, e, year, tag, rare], k) => {
    const j = slot[e]++;
    if (title === 'Reporting server') return;
    card(art(title, e, year, tag, rare, k), rare, [mx(e) + (j % 2 ? 0.86 : -0.86), 0.06 + j * 0.04, -2.75 + Math.floor(j / 2) * 1.5 + (j % 2) * 0.35], [0, (R() - 0.5) * 0.1, 0]);
  });

  // one card picked up and tilted to the light
  const hero = card(art('Reporting server', 2, 2019, 'Python', 2, 7), 2, [3.3, 3.6, 5.4], [0.62, -0.2, 0.1], 1.75);
  s.label('Projects: tilt for the foil, flip for the story, Play opens it live ↗', [3.9, 1.6, 8.3], 'hot');
  void hero;

  // the pile still to be dealt
  for (let i = 0; i < 16; i++) card(back, 0, [mx(4) + (R() - 0.5) * 0.08, 0.05 + i * 0.037, 4.7 + (R() - 0.5) * 0.08], [Math.PI, (R() - 0.5) * 0.12, 0]);
  s.label('next cards · add one in a minute', [mx(4), 1.0, 4.7]);

  // the character sheet: who this is
  const sheet = canvasTex(560, 760, (g, w, h) => {
    g.fillStyle = '#e6d8b6'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#b8892b'; g.lineWidth = 12; g.strokeRect(10, 10, w - 20, h - 20);
    g.fillStyle = '#2a2118'; g.beginPath(); g.arc(104, 112, 62, 0, 7); g.fill();
    g.fillStyle = '#f3ead6'; g.beginPath(); g.arc(104, 96, 22, 0, 7); g.fill(); g.beginPath(); g.arc(104, 152, 40, Math.PI, 0); g.fill();
    g.fillStyle = '#2a2118'; g.font = 'bold 50px "Segoe UI", Arial'; g.fillText('CALVIN ELLIS', 186, 98);
    g.font = '25px "Segoe UI", Arial'; g.fillText('Principal software engineer', 188, 136);
    g.fillStyle = '#7a6a4c'; g.fillText('Boston · 15 years · 40+ shipped', 188, 170);
    const stats = [['Front end', 0.95], ['Back end', 0.85], ['Infra and CI', 0.8], ['Agents and AI', 0.95], ['Mentoring', 0.9]];
    stats.forEach(([n, v], i) => {
      const y = 232 + i * 52;
      g.fillStyle = '#2a2118'; g.font = 'bold 24px "Segoe UI", Arial'; g.fillText(n, 40, y + 20);
      g.fillStyle = '#ddd0b2'; g.fillRect(226, y, 290, 24);
      g.fillStyle = '#b8892b'; g.fillRect(226, y, 290 * v, 24);
    });
    g.fillStyle = '#2a2118'; g.font = 'bold 26px "Segoe UI", Arial'; g.fillText('Campaigns', 40, 528);
    g.font = '23px "Segoe UI", Arial';
    ['2009  Game bots', '2012  Client sites and systems', '2017  Stove & Grill Parts, $1M to $10M', '2022  Cybrary, principal engineer'].forEach((t, i) => g.fillText(t, 40, 568 + i * 38));
    g.fillStyle = '#7a6a4c'; g.font = 'italic 21px "Segoe UI", Arial'; g.fillText('Deal “Me” and every card flies into this sheet.', 40, 728);
  });
  const sm = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.06, 7.6), [edge, edge, std(0xffffff, { map: sheet, roughness: 0.6 }), edge, edge, edge]);
  sm.position.set(-10.6, 0.05, 1.0);
  sm.rotation.y = 0.05;
  sm.castShadow = sm.receiveShadow = true;
  scene.add(sm);
  s.label('Who: the character sheet', [-10.6, 0.3, -3.0]);
  s.label('Timeline: one mat per job, cards in the order they shipped', [mx(0) + 0.6, 0.3, 5.2]);

  s.hud(`<div class="panel" style="left:50%;top:22px;transform:translateX(-50%);padding:8px 10px;font-size:14px">
    <span class="btn ghost">Spread</span><span class="btn">Timeline</span><span class="btn ghost">Stacks by skill</span><span class="btn ghost" style="margin-right:0">Me</span></div>`);
  s.hud(`<div class="panel" style="left:50%;bottom:36px;transform:translateX(-50%);font-size:14px">
    <b>One table, four deals.</b> The same cards slide into everything, by year, by skill, or into the sheet.</div>`);
}
