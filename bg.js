// Interactive neural-network background — Three.js, no build step.
// A rotating cloud of nodes connected by edges, with a parallax that
// follows the pointer. Tuned for legibility behind text and for perf.
import * as THREE from 'three';

const canvas = document.getElementById('bg-canvas');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer, scene, camera, group, points, lines, raf;
const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
let scrollY = 0;

const ACCENT = new THREE.Color('#2dd4bf');
const ACCENT2 = new THREE.Color('#5eead4');

function build() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2('#0a1413', 0.055);

  camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 17;

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  group = new THREE.Group();
  scene.add(group);

  // --- nodes: distributed in a rough sphere shell ---
  const COUNT = innerWidth < 720 ? 90 : 150;
  const RADIUS = 11;
  const verts = [];
  const nodes = [];
  for (let i = 0; i < COUNT; i++) {
    // fibonacci-ish sphere with jitter for an organic feel
    const phi = Math.acos(1 - 2 * (i + 0.5) / COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = RADIUS * (0.62 + Math.random() * 0.38);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    verts.push(x, y, z);
    nodes.push(new THREE.Vector3(x, y, z));
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  const sprite = nodeSprite();
  const pMat = new THREE.PointsMaterial({
    size: 0.42, map: sprite, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, color: ACCENT2, opacity: 0.9,
  });
  points = new THREE.Points(pGeo, pMat);
  group.add(points);

  // --- edges: connect each node to its nearest neighbours ---
  const linePos = [];
  const lineCol = [];
  const MAX_DIST = 4.6;
  for (let i = 0; i < nodes.length; i++) {
    let links = 0;
    for (let j = i + 1; j < nodes.length && links < 3; j++) {
      if (nodes[i].distanceTo(nodes[j]) < MAX_DIST) {
        linePos.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
        const c = ACCENT;
        lineCol.push(c.r, c.g, c.b, c.r, c.g, c.b);
        links++;
      }
    }
  }
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
  lGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineCol, 3));
  const lMat = new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.16,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  lines = new THREE.LineSegments(lGeo, lMat);
  group.add(lines);

  // a faint distant starfield for depth
  const starGeo = new THREE.BufferGeometry();
  const starVerts = [];
  for (let i = 0; i < 260; i++) {
    starVerts.push((Math.random() - 0.5) * 70, (Math.random() - 0.5) * 70, (Math.random() - 0.5) * 70 - 18);
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
    size: 0.07, color: '#3a6f68', transparent: true, opacity: 0.6,
  }));
  scene.add(stars);
}

// soft round dot texture for the nodes
function nodeSprite() {
  const s = 64;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(150,255,240,0.9)');
  g.addColorStop(1, 'rgba(45,212,191,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(cv);
  return tex;
}

let t = 0;
function animate() {
  raf = requestAnimationFrame(animate);
  t += 0.0016;

  pointer.x += (pointer.tx - pointer.x) * 0.05;
  pointer.y += (pointer.ty - pointer.y) * 0.05;

  if (group) {
    group.rotation.y = t * 0.9 + pointer.x * 0.5;
    group.rotation.x = Math.sin(t * 0.5) * 0.12 + pointer.y * 0.35;
    // gentle breathing scale
    const s = 1 + Math.sin(t * 1.4) * 0.015;
    group.scale.setScalar(s);
  }
  // scroll pushes the camera back a touch -> parallax depth
  camera.position.z = 17 + scrollY * 0.004;
  camera.position.y = -scrollY * 0.0015;

  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

function onPointer(e) {
  pointer.tx = (e.clientX / innerWidth - 0.5);
  pointer.ty = (e.clientY / innerHeight - 0.5);
}

try {
  build();
  addEventListener('resize', onResize, { passive: true });
  addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
  if (!reduce) {
    addEventListener('pointermove', onPointer, { passive: true });
    animate();
  } else {
    renderer.render(scene, camera); // single static frame
  }
  // pause rendering when tab hidden (battery / perf)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); }
    else if (!reduce) { animate(); }
  });
} catch (err) {
  // WebGL unavailable -> graceful fallback gradient
  console.warn('3D background disabled:', err);
  canvas.style.display = 'none';
  document.body.style.background =
    'radial-gradient(120% 80% at 70% 0%, #103330, #0a1413 60%)';
}
