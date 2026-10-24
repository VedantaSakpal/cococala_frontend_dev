/**
 * Coca-Cola 3D Can Experience using Three.js
 * Features:
 * - Procedural can lathe geometry with aluminum top, rim, pull-tab, rivet, and score line
 * - Dynamic PBR materials with studio reflection environment map
 * - Real-time texture canvas generator with signature dynamic wave ribbon and typography
 * - Multi-variant color/flavor switcher (Original Taste, Zero Sugar, Cherry)
 * - Inertial pointer drag controls, pause/play, and reset
 * - Scroll-linked parallax tilting & responsive auto-positioning
 */

(function () {
  const hero = document.getElementById('hero');
  const cv = document.getElementById('stage');
  if (!cv || !window.THREE) return;

  const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
  R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  R.outputEncoding = THREE.sRGBEncoding;

  const S = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  cam.position.set(0, 0, 11);

  // Studio HDR-style environment map using 2D canvas gradient & softboxes
  const ec = document.createElement('canvas');
  ec.width = 2048;
  ec.height = 1024;
  const x = ec.getContext('2d');
  let g = x.createLinearGradient(0, 0, 0, 1024);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.33, '#a3aab3');
  g.addColorStop(0.5, '#3b3e44');
  g.addColorStop(0.53, '#1a1b1e');
  g.addColorStop(1, '#4a2b25');
  x.fillStyle = g;
  x.fillRect(0, 0, 2048, 1024);

  function box(cx, w, y, hh, a) {
    const q = x.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
    q.addColorStop(0, 'rgba(255,255,255,0)');
    q.addColorStop(0.25, `rgba(255,255,255,${a})`);
    q.addColorStop(0.75, `rgba(255,255,255,${a})`);
    q.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = q;
    x.fillRect(cx - w / 2, y, w, hh);
  }
  box(300, 260, 120, 520, 1);
  box(760, 120, 160, 460, 0.9);
  box(1250, 330, 110, 540, 1);
  box(1700, 140, 150, 480, 0.85);
  box(1960, 200, 130, 500, 0.8);

  const et = new THREE.CanvasTexture(ec);
  et.mapping = THREE.EquirectangularReflectionMapping;
  const env = new THREE.PMREMGenerator(R).fromEquirectangular(et).texture;

  // Scene lighting
  S.add(new THREE.HemisphereLight(0xffffff, 0x3a0008, 0.35));
  const dl = new THREE.DirectionalLight(0xffffff, 1.1);
  dl.position.set(3, 5, 6);
  S.add(dl);
  const rl = new THREE.DirectionalLight(0xffb0a0, 0.8);
  rl.position.set(-5, 2, -4);
  S.add(rl);

  const can = new THREE.Group();
  const tilt = new THREE.Group();
  tilt.add(can);
  S.add(tilt);

  // Variants definition
  const V = [
    {
      n: 'Coca-Cola Original Taste',
      bg: '#d5000f',
      bg2: '#a3000c',
      acc: '#ffffff',
      sub: 'ORIGINAL TASTE',
      hero: '#d6000f'
    },
    {
      n: 'Coca-Cola Zero Sugar',
      bg: '#161617',
      bg2: '#050505',
      acc: '#e30613',
      sub: 'ZERO SUGAR',
      hero: '#17171a'
    },
    {
      n: 'Coca-Cola Cherry',
      bg: '#7d0a1f',
      bg2: '#52000f',
      acc: '#ffffff',
      sub: 'CHERRY TASTE',
      hero: '#8a0d25'
    }
  ];
  let cur = 0;

  // Procedural Can Label Texture Generator
  function mkTex(v) {
    v = v || V[cur];
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 1024;
    const t = c.getContext('2d');

    // Base can color gradient
    const gr = t.createLinearGradient(0, 0, 0, 1024);
    gr.addColorStop(0, v.bg2);
    gr.addColorStop(0.28, v.bg);
    gr.addColorStop(0.72, v.bg);
    gr.addColorStop(1, v.bg2);
    t.fillStyle = gr;
    t.fillRect(0, 0, 2048, 1024);

    // Dynamic wave ribbon
    const wv = (X, o) => 640 + 46 * Math.sin((X / 1024) * Math.PI * 2 + 0.6) + o;
    t.fillStyle = v.acc;
    t.beginPath();
    for (let X = 0; X <= 2048; X += 8) {
      X ? t.lineTo(X, wv(X, 0)) : t.moveTo(X, wv(X, 0));
    }
    for (let X = 2048; X >= 0; X -= 8) {
      t.lineTo(X, wv(X, 36 + 22 * Math.sin((X / 1024) * Math.PI * 4)));
    }
    t.closePath();
    t.fill();

    // Script Logo ("Coca-Cola") on front and back
    t.fillStyle = '#ffffff';
    t.font = 'normal 150px "Yellowtail", cursive';
    t.textAlign = 'center';
    t.textBaseline = 'middle';
    [512, 1536].forEach((px) => {
      t.save();
      t.translate(px, 420);
      t.rotate(-0.1);
      t.fillText('Coca-Cola', 0, 0);
      t.restore();
    });

    // Sub-title label ("ORIGINAL TASTE", "ZERO SUGAR", etc.)
    t.fillStyle = '#ffffff';
    t.font = '700 36px "Manrope", sans-serif';
    t.letterSpacing = '6px';
    t.textAlign = 'center';
    t.textBaseline = 'middle';
    [512, 1536].forEach((px) => {
      t.fillText(v.sub.split('').join(' '), px, 840);
    });

    const tx = new THREE.CanvasTexture(c);
    tx.encoding = THREE.sRGBEncoding;
    tx.anisotropy = 16;
    return tx;
  }

  // Geometry Curve Helpers
  const L = (a, b) => new THREE.Vector2(a, b);
  function sm(a, b, n) {
    return Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n;
      const s = t * t * (3 - 2 * t);
      return L(a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * t);
    });
  }

  const raw = [
    ...sm([0.86, -1.5], [1, -1.22], 14),
    ...sm([1, -1.22], [1, 1.18], 2).slice(1),
    ...sm([1, 1.18], [0.86, 1.6], 20).slice(1)
  ];
  const cum = [0];
  for (let i = 1; i < raw.length; i++) {
    cum.push(cum[i - 1] + raw[i].distanceTo(raw[i - 1]));
  }
  const NP = 150;
  const prof = [];
  for (let k = 0; k <= NP; k++) {
    const d = (cum[cum.length - 1] * k) / NP;
    let i = 1;
    while (i < cum.length - 1 && cum[i] < d) i++;
    const t = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    prof.push(raw[i - 1].clone().lerp(raw[i], t));
  }

  // Can Body Mesh with PBR Clearcoat
  const redMat = new THREE.MeshPhysicalMaterial({
    map: mkTex(),
    metalness: 0.55,
    roughness: 0.4,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    envMap: env,
    envMapIntensity: 1.15
  });
  can.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 128), redMat));

  // Aluminum Top & Bottom Geometry
  const aluMat = new THREE.MeshStandardMaterial({
    color: 0xdfe3e8,
    metalness: 1,
    roughness: 0.18,
    envMap: env,
    envMapIntensity: 1.2,
    side: THREE.DoubleSide
  });

  const botCurve = new THREE.SplineCurve([
    L(0, -1.58), L(0.3, -1.6), L(0.5, -1.66), L(0.6, -1.74), L(0.68, -1.77),
    L(0.75, -1.74), L(0.8, -1.66), L(0.84, -1.58), L(0.86, -1.5)
  ]).getPoints(60);

  const topCurve = new THREE.SplineCurve([
    L(0.86, 1.6), L(0.83, 1.68), L(0.79, 1.74), L(0.775, 1.78), L(0.8, 1.81),
    L(0.825, 1.835), L(0.8, 1.86), L(0.765, 1.855), L(0.745, 1.82), L(0.725, 1.76),
    L(0.69, 1.71), L(0.64, 1.68), L(0.3, 1.675), L(0, 1.675)
  ]).getPoints(90);

  can.add(
    new THREE.Mesh(new THREE.LatheGeometry(botCurve, 128), aluMat),
    new THREE.Mesh(new THREE.LatheGeometry(topCurve, 128), aluMat)
  );

  // Pull Tab & Score Line details
  function ell(rx, ry, hx, hy) {
    const s = new THREE.Shape();
    s.absellipse(0, 0, rx, ry, 0, Math.PI * 2, false);
    const q = new THREE.Path();
    q.absellipse(0, 0, hx, hy, 0, Math.PI * 2, true);
    s.holes.push(q);
    return s;
  }

  const scoreMesh = new THREE.Mesh(
    new THREE.ShapeGeometry(ell(0.46, 0.3, 0.41, 0.25)),
    new THREE.MeshStandardMaterial({ color: 0x4d5158, metalness: 0.9, roughness: 0.4, envMap: env })
  );
  scoreMesh.rotation.x = -Math.PI / 2;
  scoreMesh.position.set(0, 1.68, 0.22);
  can.add(scoreMesh);

  const tabMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(ell(0.2, 0.36, 0.12, 0.2), {
      depth: 0.03,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2,
      curveSegments: 32
    }),
    aluMat
  );
  tabMesh.rotation.x = -Math.PI / 2;
  tabMesh.position.set(0, 1.7, 0.3);
  can.add(tabMesh);

  const rivetMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 24), aluMat);
  rivetMesh.position.set(0, 1.7, -0.03);
  can.add(rivetMesh);

  // Interaction State
  let by = -0.6;
  let play = true;
  let vy = 0;
  let dragging = false;
  let lx = 0;
  let rot = 0;
  const TY = 0;
  tilt.rotation.x = TY;

  // Viewport calculation
  function size() {
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    if (w === 0 || h === 0) return;
    R.setSize(w, h, false);
    cam.aspect = w / h;
    const isMobile = window.innerWidth <= 860;
    const a = w / h;
    by = isMobile ? -0.15 : -0.6;
    let X = -0.1;
    let sc = 0.8;

    if (!isMobile) {
      const heading = document.querySelector('.hero h1');
      if (heading) {
        const hr = document.createRange();
        hr.selectNodeContents(heading);
        const tr = hr.getBoundingClientRect().right;
        const railEl = document.querySelector('.rail');
        const rl = railEl ? railEl.getBoundingClientRect().left : w - 80;
        const cr = cv.getBoundingClientRect();
        const gap = rl - tr;
        X = ((tr + gap * 0.53 - cr.left) / w - 0.5) * 5.485 * a;
        sc = Math.max(0.4, Math.min(1.02, (gap * 0.86) / ((2.25 * h) / 5.485)));
      }
    }
    tilt.position.set(X, by, 0);
    tilt.scale.setScalar(sc);
    cam.updateProjectionMatrix();
  }

  window.addEventListener('resize', size);
  setTimeout(size, 50);

  // Pointer drag events
  cv.addEventListener('pointerdown', (e) => {
    dragging = true;
    lx = e.clientX;
    cv.setPointerCapture(e.pointerId);
  });

  cv.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    vy = (e.clientX - lx) * 0.012;
    rot += vy;
    lx = e.clientX;
  });

  ['pointerup', 'pointercancel'].forEach((ev) => {
    cv.addEventListener(ev, () => {
      dragging = false;
    });
  });

  // Controls buttons
  const pauseBtn = document.getElementById('pause');
  if (pauseBtn) {
    pauseBtn.onclick = () => {
      play = !play;
      pauseBtn.setAttribute('aria-label', play ? 'Pause rotation' : 'Play rotation');
    };
  }

  const resetBtn = document.getElementById('reset');
  if (resetBtn) {
    resetBtn.onclick = () => {
      rot = 0;
      vy = 0;
      play = true;
    };
  }

  // Variant Swatches
  const swatches = document.querySelectorAll('.swatches button');
  const vname = document.getElementById('vname');

  function paint() {
    if (redMat.map) redMat.map.dispose();
    redMat.map = mkTex(V[cur]);
    redMat.needsUpdate = true;
  }

  swatches.forEach((btn, i) => {
    btn.onclick = () => {
      cur = i;
      paint();
      if (hero) hero.style.setProperty('--hero', V[i].hero);
      if (vname) vname.textContent = V[i].n;
      swatches.forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
    };
  });

  if (document.fonts) {
    document.fonts.load('150px "Yellowtail"').then(paint).catch(() => {});
    document.fonts.ready.then(size).catch(() => {});
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    play = false;
  }

  // Main Render Loop
  function loop() {
    requestAnimationFrame(loop);
    if (!dragging) {
      if (play) rot += 0.007;
      rot += vy;
      vy *= 0.93;
    }
    const heroH = hero ? hero.clientHeight : 800;
    const scrollP = Math.min(window.scrollY / heroH, 1);
    const easeScroll = scrollP * scrollP * (3 - 2 * scrollP);

    tilt.position.y = by - easeScroll * 1.1;
    tilt.rotation.x = TY + easeScroll * 0.7;
    tilt.rotation.z = -easeScroll * 0.3;
    can.rotation.y = rot + easeScroll * Math.PI * 1.2;

    R.render(S, cam);
  }
  loop();
})();
