// Você não está sozinha — motion graphics de 90 s, 1920×1080, 30 fps.
//
// Regra central: todo o estado visual é uma função pura de t (segundos).
// renderFrame(t) recalcula tudo do zero e chama renderer.render uma única vez.
// Não há relógio, aleatoriedade nem estado carregado de um quadro para o outro;
// a variação entre elementos vem de fórmulas do índice i.

import * as THREE from 'three';

THREE.ColorManagement.enabled = false; // cores hex usadas como estão (sRGB direto)

// ════════════════════════════════════════════════════════════════════════
// Biblioteca de funções
// ════════════════════════════════════════════════════════════════════════
export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const local = (t, t0, d) => clamp01((t - t0) / d);
export const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOutExpo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const easeOutBack = (x, s = 1.70158) => {
  const c3 = s + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
};
export const spring = (x) => 1 - Math.exp(-6 * x) * Math.cos(12 * x);

// mix para números e vetores (arrays)
export const mix = (a, b, u) =>
  typeof a === 'number' ? a + (b - a) * u : a.map((v, k) => v + (b[k] - v) * u);

// Janela de visibilidade: sobe em f s a partir de tin, fica, desce em f s terminando em tout
export const win = (t, tin, tout, f) => Math.min(local(t, tin, f), 1 - local(t, tout - f, f));

// ── Cores: interpolação em OKLab ─────────────────────────────────────────
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const toSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
export function rgbToOklab([r, g, b]) {
  r = toLin(r); g = toLin(g); b = toLin(b);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
export function oklabToRgb([L, A, B]) {
  const l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3);
  const m = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3);
  const s = Math.pow(L - 0.0894841775 * A - 1.291485548 * B, 3);
  return [
    clamp01(toSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)),
    clamp01(toSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)),
    clamp01(toSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)),
  ];
}
export const hexRgb = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16) / 255);
export const mixColor = (ca, cb, u) =>
  u <= 0 ? ca : u >= 1 ? cb : oklabToRgb(mix(rgbToOklab(ca), rgbToOklab(cb), u));

// Trilha por keyframes [[t, valor], ...], cada trecho percorrido com easeInOutCubic
export function track(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let k = 0; k < keys.length - 1; k++) {
    const [t0, v0] = keys[k];
    const [t1, v1] = keys[k + 1];
    if (t < t1) return mix(v0, v1, easeInOutCubic((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
}

// Catmull-Rom uniforme
const cr = (p0, p1, p2, p3, u) => {
  const u2 = u * u, u3 = u2 * u;
  return p1.map((_, k) =>
    0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u2 +
      (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u3));
};

const DEG = Math.PI / 180;
const GOLDEN = 137.508 * DEG;

// ════════════════════════════════════════════════════════════════════════
// Constantes
// ════════════════════════════════════════════════════════════════════════
const W = 1920, H = 1080, FOV = 35, END = 90;
const PAL = {
  purple: '#4A1F70', lilac: '#EFE7F7', amber: '#F4B860', white: '#FFFFFF', ink: '#1F1A2E',
};
const RGB = Object.fromEntries(Object.entries(PAL).map(([k, v]) => [k, hexRgb(v)]));
const LAB = Object.fromEntries(Object.entries(RGB).map(([k, v]) => [k, rgbToOklab(v)]));
const TAN = Math.tan((FOV / 2) * DEG);

// ════════════════════════════════════════════════════════════════════════
// Renderer, cena, câmera
// ════════════════════════════════════════════════════════════════════════
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setClearColor(PAL.purple, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(FOV, W / H, 0.1, 600);
scene.add(camera);

scene.add(new THREE.AmbientLight(0xffffff, 1.6));
const sun = new THREE.DirectionalLight(0xffffff, 2.4);
sun.position.set(6, 10, 9);
scene.add(sun);

// Camada de texto presa à câmera (HUD): 1 unidade local = 1 pixel no plano z = -HUD_Z.
const HUD_Z = 20;
const HUD_K = (2 * HUD_Z * TAN) / H;
const hud = new THREE.Group();
hud.position.z = -HUD_Z;
hud.scale.setScalar(HUD_K);
camera.add(hud);

// Fundo: gradiente radial gerado uma vez, preso à câmera bem ao fundo.
{
  const cv = document.createElement('canvas');
  cv.width = 960; cv.height = 540;
  const g = cv.getContext('2d');
  const grad = g.createRadialGradient(480, 250, 40, 480, 270, 620);
  const css = (c) => `rgb(${c.map((v) => Math.round(v * 255)).join(',')})`;
  grad.addColorStop(0, css(mixColor(RGB.purple, RGB.lilac, 0.07)));
  grad.addColorStop(0.55, PAL.purple);
  grad.addColorStop(1, css(mixColor(RGB.purple, RGB.ink, 0.55)));
  g.fillStyle = grad;
  g.fillRect(0, 0, 960, 540);
  const tex = new THREE.CanvasTexture(cv);
  const bgH = 2 * 500 * TAN * 1.05;
  const bg = new THREE.Mesh(
    new THREE.PlaneGeometry(bgH * (W / H), bgH),
    new THREE.MeshBasicMaterial({ map: tex, depthTest: false, depthWrite: false }));
  bg.position.z = -500;
  bg.renderOrder = -100;
  camera.add(bg);
}

// ════════════════════════════════════════════════════════════════════════
// Câmera: Catmull-Rom por keyframes + órbita lenta
// ════════════════════════════════════════════════════════════════════════
const CARD_R = 14;                         // raio do arco dos cartões
const CARD_ANG = [-60, -20, 20, 60].map((a) => a * DEG);
const CARD_Y = [0, 1, 2, 3].map((k) => 0.45 * Math.sin(k * 1.7));
const CARD_DIST = 11;
const cardPos = (k) => [CARD_R * Math.sin(CARD_ANG[k]), CARD_Y[k], CARD_R * Math.cos(CARD_ANG[k])];
const cardCam = (k) => {
  const c = cardPos(k);
  const q = [c[0], c[1] + 0.45, c[2]];
  return { p: [q[0] + Math.sin(CARD_ANG[k]) * CARD_DIST, q[1], q[2] + Math.cos(CARD_ANG[k]) * CARD_DIST], q };
};
// Tempos em que a câmera fica parada diante de cada cartão (texto legível)
const CARD_HOLD = [[28.4, 32.45], [33.05, 34.45], [35.05, 36.45], [37.05, 37.8]];

const CAM = [
  { t: 0, hold: 0.6, p: [0, 0.6, 16], q: [0, 0, 0] },
  { t: 7.6, p: [0, 0, 30], q: [0, 0, 0] },
  { t: 13, p: [-2.5, 1.4, 30], q: [0.5, 0.3, 0] },
  { t: 18.4, p: [1.5, -0.8, 30.5], q: [0.5, 0, 0] },
  { t: 23.4, hold: 3.8, p: [-1.5, 1.2, 29], q: [0.5, 0, 0] },
  ...CARD_HOLD.map(([a, b], k) => ({ t: a, hold: b - a, ...cardCam(k) })),
  { t: 38.9, p: [0, 0.8, 32], q: [0, 0, 0] },
  { t: 41.5, p: [0.5, 1.0, 30], q: [0, 0.2, 0] },
  { t: 47, p: [2.2, 2.0, 30], q: [0, 0.3, 0] },
  { t: 54.5, p: [-1.2, 1.4, 30], q: [0, 0.2, 0] },
  { t: 62, p: [1.8, 2.6, 30.5], q: [0, 0.3, 0] },
  { t: 69.4, hold: 8.3, p: [0, 0, 30], q: [0, 0, 0] },
  { t: 84, p: [0, 0.4, 27], q: [0, 0, 0] },
  { t: 90, p: [0, 0, 23], q: [0, 0, 0] },
];

function cameraAt(t) {
  const n = CAM.length;
  let s = n - 1; // parâmetro contínuo sobre os índices dos keyframes
  for (let k = 0; k < n; k++) {
    const a = CAM[k].t, b = a + (CAM[k].hold || 0);
    if (t < a) { // entre k-1 (fim do hold) e k
      const k0 = k - 1, s0 = CAM[k0].t + (CAM[k0].hold || 0);
      s = k0 + easeInOutCubic(local(t, s0, a - s0));
      break;
    }
    if (t <= b) { s = k; break; }
  }
  const k = Math.min(Math.floor(s), n - 2), u = s - k;
  const P = (i) => CAM[Math.max(0, Math.min(n - 1, i))];
  const pos = cr(P(k - 1).p, P(k).p, P(k + 1).p, P(k + 2).p, u);
  const tgt = cr(P(k - 1).q, P(k).q, P(k + 1).q, P(k + 2).q, u);
  // órbita lenta somada: gira a posição em torno do alvo (eixo y)
  const a = 0.15 * Math.sin(0.2 * t);
  const dx = pos[0] - tgt[0], dz = pos[2] - tgt[2];
  pos[0] = tgt[0] + dx * Math.cos(a) + dz * Math.sin(a);
  pos[2] = tgt[2] - dx * Math.sin(a) + dz * Math.cos(a);
  return { pos, tgt };
}

// ════════════════════════════════════════════════════════════════════════
// Nuvem de pontos com morphing (4096 pontos, mesma ordem em todas as formas)
// ════════════════════════════════════════════════════════════════════════
const N = 4096;
const DIRS = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {          // esfera de Fibonacci (ângulo áureo)
  const y = 1 - (2 * (i + 0.5)) / N;
  const r = Math.sqrt(1 - y * y);
  const ph = i * GOLDEN;
  DIRS[i * 3] = r * Math.cos(ph);
  DIRS[i * 3 + 1] = y;
  DIRS[i * 3 + 2] = r * Math.sin(ph);
}

// distância da origem até a borda de um polígono 2D na direção (x, y)
function rayPoly(poly, x, y) {
  let best = Infinity;
  for (let k = 0; k < poly.length; k++) {
    const [ax, ay] = poly[k];
    const [bx, by] = poly[(k + 1) % poly.length];
    const ex = bx - ax, ey = by - ay;
    const den = x * ey - y * ex;
    if (Math.abs(den) < 1e-12) continue;
    const s = (ax * ey - ay * ex) / den;   // distância ao longo do raio
    const v = (ax * y - ay * x) / den;     // posição ao longo da aresta
    if (s > 0 && v >= 0 && v <= 1 && s < best) best = s;
  }
  return best;
}
// prisma: contorno 2D extrudado em z com meia-espessura T; direção → ponto na superfície
const prism = (poly, T, S) => (dx, dy, dz) => {
  const l2 = Math.hypot(dx, dy);
  const g2 = l2 > 1e-9 ? l2 / rayPoly(poly, dx / l2, dy / l2) : 0;
  const g = Math.max(g2, Math.abs(dz) / T);
  return [(dx / g) * S, (dy / g) * S, (dz / g) * S];
};
const quadBez = (p0, p1, p2, n) => Array.from({ length: n }, (_, k) => {
  const u = (k + 1) / n;
  return [0, 1].map((c) => (1 - u) * (1 - u) * p0[c] + 2 * (1 - u) * u * p1[c] + u * u * p2[c]);
});

const SHIELD_POLY = (() => {
  const top = [[-1, 0.95], [-0.5, 1.0], [0, 1.12], [0.5, 1.0], [1, 0.95]];
  const right = [[1, 0.2], ...quadBez([1, 0.2], [0.95, -0.75], [0, -1.3], 14)];
  const left = quadBez([0, -1.3], [-0.95, -0.75], [-1, 0.2], 14);
  return [...top, ...right, ...left.slice(0, -1), [-1, 0.2]];
})();
const HOUSE_POLY = [[-1, -0.95], [1, -0.95], [1, 0.25], [0, 1.15], [-1, 0.25]];
const HOUSE_S = 4.4;

const shapeFns = {
  sphere: (dx, dy, dz) => [dx * 5, dy * 5, dz * 5],
  cube: (dx, dy, dz) => {
    const m = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
    return [(dx / m) * 3.6, (dy / m) * 3.6, (dz / m) * 3.6];
  },
  shield: prism(SHIELD_POLY, 0.32, 4.4),
  house: prism(HOUSE_POLY, 0.85, HOUSE_S),
};

// Ícones de traço para o anel (unidades locais -1..1)
const closed = (pts) => [...pts, pts[0]];
const circ = (cx, cy, r, n = 28, a0 = 0, a1 = Math.PI * 2) =>
  Array.from({ length: n + 1 }, (_, k) => {
    const a = a0 + ((a1 - a0) * k) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
const rrect = (x0, y0, x1, y1, r) => {
  const p = [];
  const corner = (cx, cy, a0) => { for (let k = 0; k <= 6; k++) { const a = a0 + (k / 6) * (Math.PI / 2); p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
  corner(x1 - r, y0 + r, -Math.PI / 2); corner(x1 - r, y1 - r, 0);
  corner(x0 + r, y1 - r, Math.PI / 2); corner(x0 + r, y0 + r, Math.PI);
  return closed(p);
};
const ICONS = [
  [ // balão de mensagem
    [
      [-0.2, -0.42], [0.7, -0.42], [0.85, -0.38], [0.97, -0.25], [1, -0.12], [1, 0.52], [0.97, 0.66], [0.85, 0.78], [0.7, 0.82],
      [-0.7, 0.82], [-0.85, 0.78], [-0.97, 0.66], [-1, 0.52], [-1, -0.12], [-0.97, -0.25], [-0.85, -0.38], [-0.7, -0.42],
      [-0.55, -0.42], [-0.72, -0.98], [-0.2, -0.42]],
    circ(-0.45, 0.2, 0.1, 10), circ(0, 0.2, 0.1, 10), circ(0.45, 0.2, 0.1, 10),
  ],
  [ // caderno
    rrect(-0.62, -1, 0.82, 1, 0.12),
    ...[0.72, 0.36, 0, -0.36, -0.72].map((y) => circ(-0.62, y, 0.11, 10)),
    [[-0.25, 0.45], [0.55, 0.45]], [[-0.25, 0.1], [0.55, 0.1]], [[-0.25, -0.25], [0.55, -0.25]], [[-0.25, -0.6], [0.3, -0.6]],
  ],
  [ // pessoas
    circ(-0.42, 0.42, 0.3, 24), circ(-0.42, -0.85, 0.62, 20, 0, Math.PI), [[-1.04, -0.85], [0.2, -0.85]],
    circ(0.52, 0.5, 0.25, 22), [[0.36, -0.2], ...circ(0.52, -0.75, 0.5, 16, 1.25, 0)],
  ],
  [ // documento
    [[0.3, 1], [-0.75, 1], [-0.75, -1], [0.75, -1], [0.75, 0.55], [0.3, 1], [0.3, 0.55], [0.75, 0.55]],
    [[-0.45, 0.25], [0.45, 0.25]], [[-0.45, -0.05], [0.45, -0.05]], [[-0.45, -0.35], [0.45, -0.35]], [[-0.45, -0.65], [0.15, -0.65]],
  ],
];
const ICON_S = 1.45;
const ICON_POS = [[-9.1, 4.4], [9.1, 4.4], [-9.1, -4.4], [9.1, -4.4]];
const RING_A = 12.9, RING_B = 6.2;

function samplePaths(paths, count) {
  const segs = [];
  let L = 0;
  for (const p of paths) for (let k = 0; k < p.length - 1; k++) {
    const l = Math.hypot(p[k + 1][0] - p[k][0], p[k + 1][1] - p[k][1]);
    segs.push([p[k], p[k + 1], L, l]);
    L += l;
  }
  return Array.from({ length: count }, (_, j) => {
    const s = ((j + 0.5) / count) * L;
    let lo = 0;
    while (lo < segs.length - 1 && segs[lo][2] + segs[lo][3] < s) lo++;
    const [a, b, s0, l] = segs[lo];
    const u = l > 0 ? (s - s0) / l : 0;
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  });
}

// Papel de cada ponto no anel: -1 = elipse; 0..3 = ícone
const ROLE = new Int8Array(N);
const RING_TARGET = new Float32Array(N * 3);
{
  const iconIdx = [];
  for (let i = 0; i < N; i++) if (i % 10 < 3) ROLE[i] = -1; else iconIdx.push(i);
  const per = Math.ceil(iconIdx.length / 4);
  const samples = ICONS.map((paths, j) =>
    samplePaths(paths, Math.min(per, iconIdx.length - j * per)));
  iconIdx.forEach((i, k) => {
    const j = Math.floor(k / per), m = k - j * per;
    ROLE[i] = j;
    const [x, y] = samples[j][m];
    const off = 0.035 * Math.sin(i * 1.7);
    RING_TARGET[i * 3] = ICON_POS[j][0] + (x + off) * ICON_S;
    RING_TARGET[i * 3 + 1] = ICON_POS[j][1] + (y + off * 0.7) * ICON_S;
    RING_TARGET[i * 3 + 2] = 0.12 * Math.sin(i * 2.3);
  });
  for (let i = 0; i < N; i++) if (ROLE[i] === -1) {
    const a = i * GOLDEN;
    RING_TARGET[i * 3] = RING_A * Math.cos(a) * (1 + 0.012 * Math.sin(i * 1.7));
    RING_TARGET[i * 3 + 1] = RING_B * Math.sin(a) * (1 + 0.012 * Math.sin(i * 1.7));
    RING_TARGET[i * 3 + 2] = 0.5 * Math.sin(3 * a);
  }
}

const TARGETS = {};
for (const [name, fn] of Object.entries(shapeFns)) {
  const arr = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const p = fn(DIRS[i * 3], DIRS[i * 3 + 1], DIRS[i * 3 + 2]);
    if (name !== 'sphere') {
      p[0] += 0.05 * Math.sin(i * 1.7); p[1] += 0.05 * Math.sin(i * 2.3); p[2] += 0.05 * Math.sin(i * 3.1);
    }
    arr.set(p, i * 3);
  }
  TARGETS[name] = arr;
}
TARGETS.ring = RING_TARGET;

const MORPHS = [
  { t0: 9.0, d: 2.6, from: 'sphere', to: 'cube' },
  { t0: 18.2, d: 2.4, from: 'cube', to: 'shield' },
  { t0: 40.3, d: 2.4, from: 'shield', to: 'house' },
  { t0: 68.4, d: 2.3, from: 'house', to: 'ring' },
  { t0: 78.2, d: 2.6, from: 'ring', to: 'sphere' },
];
const LABEL_T = [69.7, 70.7, 71.7, 72.7];

const ptsGeo = new THREE.BufferGeometry();
const ptsPos = new Float32Array(N * 3);
const ptsCol = new Float32Array(N * 3);
const ptsSize = new Float32Array(N);
for (let i = 0; i < N; i++) ptsSize[i] = 0.105 + 0.035 * Math.sin(i * 1.7);
ptsGeo.setAttribute('position', new THREE.BufferAttribute(ptsPos, 3));
ptsGeo.setAttribute('color', new THREE.BufferAttribute(ptsCol, 3));
ptsGeo.setAttribute('psize', new THREE.BufferAttribute(ptsSize, 1));
const ptsMat = new THREE.ShaderMaterial({
  uniforms: { uScale: { value: H / (2 * TAN) }, uOpacity: { value: 1 }, uCenterZ: { value: -30 }, uRadius: { value: 5 } },
  vertexShader: `
    attribute vec3 color; attribute float psize;
    uniform float uScale, uCenterZ, uRadius;
    varying vec3 vColor; varying float vDepth;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = psize * uScale / -mv.z;
      vColor = color;
      vDepth = clamp((mv.z - (uCenterZ - uRadius)) / (2.0 * uRadius), 0.0, 1.0);
    }`,
  fragmentShader: `
    uniform float uOpacity;
    varying vec3 vColor; varying float vDepth;
    void main() {
      float r = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.3, r);
      gl_FragColor = vec4(vColor, a * uOpacity * mix(0.35, 1.0, vDepth));
    }`,
  transparent: true,
  depthWrite: false,
});
const points = new THREE.Points(ptsGeo, ptsMat);
points.frustumCulled = false;
const shapeGroup = new THREE.Group();
shapeGroup.add(points);
scene.add(shapeGroup);

const SHAPE_POS = [
  [0, [0, 0, 0]], [8.8, [0, 0, 0]], [11.4, [6.4, -0.6, 0]], [18.2, [6.4, -0.6, 0]], [20.6, [6.2, -0.2, 0]],
  [27.2, [6.2, -0.2, 0]], [28.6, [0, 0, -2]], [37.7, [0, 0, -2]], [39.0, [0, 0.4, 0]], [40.3, [0, 0.2, 0]],
  [42.7, [6.2, -0.4, 0]], [54.0, [6.2, -0.4, 0]], [55.2, [5.0, -0.9, 0]], [68.3, [5.0, -0.9, 0]],
  [70.7, [0, 0, 0]], [90, [0, 0, 0]],
];
const SHAPE_SCALE = [
  [0, 1], [8.8, 1], [11.4, 0.8], [18.2, 0.8], [20.6, 0.85], [27.2, 0.85], [28.6, 0.9], [40.3, 0.9], [42.7, 0.82],
  [54.0, 0.82], [55.2, 0.68], [68.3, 0.68], [70.7, 1], [78.2, 1], [80.8, 1.25], [86.4, 1.25], [87.6, 1.0],
];
const SHAPE_OP = [
  [0, 0], [1.2, 1], [27.2, 1], [28.6, 0.45], [37.6, 0.45], [38.4, 0.3], [40.3, 0.3], [41.5, 1],
  [78.2, 1], [80.5, 0.35], [81.0, 0.22], [86.4, 0.22], [87.4, 1],
];
const TAU = Math.PI * 2;
const SHAPE_RY = [
  [0, 0], [8, 1.2], [12, 2.6], [18, 4.2], [21, TAU], [27, TAU + 0.3], [33, TAU - 0.3], [40, TAU],
  [43, TAU - 0.45], [50, TAU - 0.25], [56, TAU - 0.5], [64, TAU - 0.3], [68.3, TAU - 0.2], [70.7, TAU],
  [77.6, TAU], [80, TAU + 0.5], [90, TAU + 2.2],
];
const SHAPE_RX = [[0, 0.25], [9, 0.25], [12, 0.5], [18, 0.45], [21, 0], [40, 0], [43, 0.12], [68.3, 0.1], [70.7, 0], [78, 0], [80, 0.2], [90, 0.2]];
// separação da casa em duas metades
const houseGap = (t) => 0.9 * easeInOutCubic(local(t, 44.4, 1.4)) * (1 - easeInOutCubic(local(t, 50.8, 1.4)));
const halfColor = (t) => local(t, 44.4, 0.8) * (1 - local(t, 68.4, 1.0));

function updatePoints(t) {
  let A = 'sphere', B = 'sphere', m = null;
  for (const mm of MORPHS) {
    if (t >= mm.t0 + mm.d) { A = B = mm.to; }
    else if (t >= mm.t0) { A = mm.from; B = mm.to; m = mm; }
  }
  const TA = TARGETS[A], TB = TARGETS[B];
  const gap = houseGap(t);
  const hc = halfColor(t);
  const hiIcon = LABEL_T.map((lt) => local(t, lt - 0.2, 0.5) * (1 - local(t, 78.2, 1.0)));
  const breath = (i) => 1 + 0.012 * Math.sin(1.1 * t + i * 0.035);
  const H_ = TARGETS.house;
  for (let i = 0; i < N; i++) {
    let u = 0;
    if (m) {
      const ph = 0.45 * (0.5 + 0.5 * Math.sin(i * 1.7));
      u = easeInOutCubic(local(t, m.t0 + ph, m.d - 0.45));
    }
    const b = breath(i);
    let x = mix(TA[i * 3], TB[i * 3], u) * b;
    const y = mix(TA[i * 3 + 1], TB[i * 3 + 1], u) * b;
    const z = mix(TA[i * 3 + 2], TB[i * 3 + 2], u) * b;
    const side = H_[i * 3] >= 0 ? 1 : -1;
    const hw = A === 'house' && B === 'house' ? 1 : A === 'house' ? 1 - u : B === 'house' ? u : 0;
    x += side * gap * hw;
    ptsPos[i * 3] = x; ptsPos[i * 3 + 1] = y; ptsPos[i * 3 + 2] = z;

    let c = i % 31 === 0 ? LAB.amber : LAB.lilac;
    let w = side > 0 ? hc : 0;
    if (ROLE[i] >= 0) w = Math.max(w, hiIcon[ROLE[i]]);
    const lab = w > 0 ? mix(c, LAB.amber, w) : c;
    const rgb = oklabToRgb(lab);
    ptsCol[i * 3] = rgb[0]; ptsCol[i * 3 + 1] = rgb[1]; ptsCol[i * 3 + 2] = rgb[2];
  }
  ptsGeo.attributes.position.needsUpdate = true;
  ptsGeo.attributes.color.needsUpdate = true;

  const p = track(t, SHAPE_POS);
  shapeGroup.position.set(p[0], p[1], p[2]);
  shapeGroup.scale.setScalar(track(t, SHAPE_SCALE));
  shapeGroup.rotation.set(track(t, SHAPE_RX), track(t, SHAPE_RY), 0, 'YXZ');
  ptsMat.uniforms.uOpacity.value = track(t, SHAPE_OP);
}

// ════════════════════════════════════════════════════════════════════════
// Tipografia: cada glifo é um plano 3D com textura gerada uma vez em canvas 2D
// ════════════════════════════════════════════════════════════════════════
const FONTS = {
  display: { family: '"Bricolage Grotesque"', weight: 800, F: 200 },
  body: { family: '"Source Sans 3"', weight: 600, F: 112 },
};
const fontStr = (f, px) => `${f.weight} ${px}px ${f.family}`;
const mctx = document.createElement('canvas').getContext('2d');
const measure = (fontKey, px, str) => { mctx.font = fontStr(FONTS[fontKey], px); return mctx.measureText(str).width; };
const PLANE = new THREE.PlaneGeometry(1, 1);
const glyphCache = new Map();
const CAP = 0.7;

function glyph(fontKey, ch, shadow) {
  const key = `${fontKey}|${shadow ? 1 : 0}|${ch}`;
  if (glyphCache.has(key)) return glyphCache.get(key);
  const f = FONTS[fontKey], F = f.F;
  mctx.font = fontStr(f, F);
  const m = mctx.measureText(ch);
  const pad = Math.ceil(F * (shadow ? 0.16 : 0.06));
  const left = Math.ceil(m.actualBoundingBoxLeft), right = Math.ceil(m.actualBoundingBoxRight);
  const asc = Math.ceil(m.actualBoundingBoxAscent), desc = Math.ceil(m.actualBoundingBoxDescent);
  const w = Math.max(1, left + right) + 2 * pad, h = Math.max(1, asc + desc) + 2 * pad;
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const ox = pad + left, oy = pad + asc;
  ctx.font = fontStr(f, F);
  ctx.fillStyle = '#fff';
  ctx.fillText(ch, ox, oy);
  const fill = ctx.getImageData(0, 0, w, h).data;
  let sh = null;
  if (shadow) {
    ctx.clearRect(0, 0, w, h);
    ctx.filter = `blur(${(F * 0.05).toFixed(2)}px)`;
    ctx.fillStyle = '#000';
    ctx.fillText(ch, ox, oy + F * 0.025);
    sh = ctx.getImageData(0, 0, w, h).data;
  }
  // textura com rgb "não-pré-multiplicado" limpo (sem franja escura nas bordas)
  const out = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const si = (y * w + x) * 4, di = ((h - 1 - y) * w + x) * 4;
    const a = fill[si + 3] / 255;
    const s = sh ? (sh[si + 3] / 255) * 0.6 : 0;
    const A = a + s * (1 - a);
    const v = A > 0 ? (sh ? a / A : 1) : 1;
    out[di] = out[di + 1] = out[di + 2] = Math.round(v * 255);
    out[di + 3] = Math.round(A * 255);
  }
  const tex = new THREE.DataTexture(out, w, h, THREE.RGBAFormat);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  const g = { tex, w: w / F, h: h / F, cx: (w / 2 - ox) / F, cy: (oy - h / 2) / F };
  glyphCache.set(key, g);
  return g;
}

function parseMarkup(text) {
  const out = [];
  let hi = false;
  for (const ch of text) { if (ch === '*') hi = !hi; else out.push({ ch, hi }); }
  return out;
}

const EXIT = 0.45;
const blocks = [];
const countWords = (s) => s.replace(/\*/g, '').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

class TextBlock {
  constructor(spec) {
    const s = (this.s = {
      font: 'body', size: 48, x: 0, y: 0, z: 0, align: 'left', maxWidth: 1e9, lineHeight: 1.18,
      color: PAL.white, hi: PAL.amber, anim: 'rise', shadow: true, depthTest: false, order: 20,
      parent: hud, tOut: END + 1, ...spec,
    });
    this.root = new THREE.Group();
    this.root.position.set(s.x, s.y, s.z);
    s.parent.add(this.root);
    this.colA = new THREE.Color(s.color);
    this.colB = new THREE.Color(s.hi);

    // quebra de linhas por largura medida
    const chars = parseMarkup(s.text);
    const paras = [[]];
    for (const c of chars) { if (c.ch === '\n') paras.push([]); else paras[paras.length - 1].push(c); }
    const lines = [];
    for (const para of paras) {
      const words = [];
      let cur = [];
      for (const c of para) { if (c.ch === ' ') { if (cur.length) words.push(cur); cur = []; } else cur.push(c); }
      if (cur.length) words.push(cur);
      let line = [];
      for (const wd of words) {
        const trial = line.length ? [...line, { ch: ' ', hi: false }, ...wd] : wd;
        if (line.length && measure(s.font, s.size, trial.map((c) => c.ch).join('')) > s.maxWidth) {
          lines.push(line); line = wd;
        } else line = trial;
      }
      lines.push(line);
    }
    this.lines = lines;
    const F = FONTS[s.font].F, k = s.size / F;
    this.letters = [];
    this.width = 0;
    let gi = 0, wordIdx = 0;
    lines.forEach((line, li) => {
      const str = line.map((c) => c.ch).join('');
      const lw = measure(s.font, F, str) * k;
      this.width = Math.max(this.width, lw);
      const x0 = s.align === 'center' ? -lw / 2 : s.align === 'right' ? -lw : 0;
      const base = -li * s.size * s.lineHeight;
      let iw = 0;
      line.forEach((c, ci) => {
        if (c.ch === ' ') { wordIdx++; iw = 0; return; }
        const x = x0 + measure(s.font, F, str.slice(0, ci)) * k;
        const adv = measure(s.font, F, c.ch) * k;
        const g = glyph(s.font, c.ch, s.shadow);
        const mat = new THREE.MeshBasicMaterial({
          map: g.tex, color: c.hi ? this.colB : this.colA, transparent: true,
          depthTest: s.depthTest, depthWrite: false,
        });
        const mesh = new THREE.Mesh(PLANE, mat);
        mesh.renderOrder = s.order;
        mesh.scale.set(g.w * s.size, g.h * s.size, 1);
        const xc = x + adv / 2, yc = base + (CAP * s.size) / 2;
        mesh.position.set(x + g.cx * s.size - xc, base + g.cy * s.size - yc, 0);
        const pivot = new THREE.Group();
        pivot.add(mesh);
        this.root.add(pivot);
        this.letters.push({ pivot, mesh, mat, xc, yc, i: gi++, word: wordIdx, iw: iw++, line: li, hi: c.hi });
      });
      wordIdx++;
    });
    this.height = lines.length * s.size * s.lineHeight;
    // centro de cada palavra (para o "pop")
    this.wordC = {};
    for (const L of this.letters) {
      const w = (this.wordC[L.word] ||= { x: 0, y: 0, n: 0 });
      w.x += L.xc; w.y += L.yc; w.n++;
    }
    for (const w of Object.values(this.wordC)) { w.x /= w.n; w.y /= w.n; }
    for (const L of this.letters) L.delay = this.delay(L);
    const lastIn = Math.max(...this.letters.map((L) => L.delay + this.dur()));
    this.holdStart = Math.max(lastIn, s.settle || 0);
    this.holdEnd = Math.min(s.tOut - EXIT, END);
    if (s.holdWindow) [this.holdStart, this.holdEnd] = s.holdWindow;
    this.words = countWords(s.text);
    blocks.push(this);
  }
  delay(L) {
    const s = this.s;
    switch (s.anim) {
      case 'rise': return s.tIn + Math.min(L.word * 0.05, 0.35) + Math.min(L.iw * 0.012, 0.12);
      case 'depth': return s.tIn + L.i * 0.035;
      case 'pop': return s.tIn + L.word * 0.09;
      default: return s.tIn;
    }
  }
  dur() {
    return { rise: 0.55, depth: 1.8, pop: 0.6, fade: 0.4 }[this.s.anim] || 0;
  }
  update(t) {
    const s = this.s;
    if (t < s.tIn || t > s.tOut) { this.root.visible = false; return; }
    this.root.visible = true;
    this.root.position.set(s.x, s.y, s.z);
    this.root.rotation.set(0, 0, 0);
    this.root.scale.setScalar(1);
    let gop = 1;
    if (s.group) gop = s.group(t, this.root, this);
    if (s.opacityFn) gop *= s.opacityFn(t);
    const ex = easeInOutCubic(local(t, s.tOut - EXIT, EXIT));
    for (const L of this.letters) {
      let px = 0, py = 0, pz = 0, rx = 0, ry = 0, sc = 1, op = 1;
      const d = L.delay;
      if (s.anim === 'rise') {
        const u = local(t, d, 0.55), e = easeOutExpo(u);
        py = -(1 - e) * 0.45 * s.size; pz = -(1 - e) * 260; rx = (1 - e) * 1.1; op = clamp01(u / 0.6);
      } else if (s.anim === 'depth') {
        const sp = spring(local(t, d, 1.8));
        const zu = 20 + 20 * (0.5 + 0.5 * Math.sin(L.i * 1.7));      // 20..40 unidades de profundidade
        pz = -(zu / HUD_K) * (1 - sp);
        const ang = L.i * GOLDEN, rad = 260 * (1 - sp);
        px = Math.cos(ang) * rad; py = Math.sin(ang) * rad;
        ry = (1 - sp) * 0.8 * Math.sin(L.i * 2.1);
        op = local(t, d, 0.45);
      } else if (s.anim === 'pop') {
        const u = local(t, d, 0.6);
        sc = Math.max(0, easeOutBack(u));
        const wc = this.wordC[L.word];
        px = (wc.x - L.xc) * (1 - sc); py = (wc.y - L.yc) * (1 - sc);
        op = local(t, d, 0.2);
      } else if (s.anim === 'fade') {
        op = local(t, d, 0.4);
      }
      op *= 1 - ex; py += ex * 24; pz -= ex * 120;
      L.pivot.position.set(L.xc + px, L.yc + py, pz);
      L.pivot.rotation.set(rx, ry, 0);
      L.pivot.scale.setScalar(sc);
      L.mat.opacity = op * gop;
      L.mesh.visible = L.mat.opacity > 0.003;
    }
  }
}
const T = (spec) => new TextBlock(spec);

// ════════════════════════════════════════════════════════════════════════
// Elementos auxiliares
// ════════════════════════════════════════════════════════════════════════
function canvasTex(w, h, draw) {
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  draw(cv.getContext('2d'));
  const tex = new THREE.CanvasTexture(cv);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return tex;
}
const updaters = [];

// Selo: pílula âmbar com ícone "círculo cortado" + texto
function makeSeal(text, x, y, tIn, tOut) {
  const size = 44;
  const b = T({
    text, font: 'body', size, x: x + 120, y, anim: 'none', tIn, tOut, settle: tIn + 0.6,
    group: (t, root) => {
      const u = local(t, tIn, 0.45);
      root.position.x = x; // origem do grupo no início da pílula
      root.scale.setScalar(mix(1.6, 1, easeOutBack(u)));
      slash.scale.x = 150 * easeInOutCubic(local(t, tIn + 0.35, 0.35));
      return local(t, tIn, 0.18);
    },
  });
  // reposiciona letras relativas à origem do grupo
  for (const L of b.letters) L.xc += 120;
  const pw = b.width + 170, ph = 96;
  const pill = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), new THREE.MeshBasicMaterial({
    map: canvasTex(Math.ceil(pw), ph, (g) => {
      g.fillStyle = 'rgba(31,26,46,0.35)';
      g.strokeStyle = PAL.amber; g.lineWidth = 5;
      g.beginPath(); g.roundRect(3, 3, pw - 6, ph - 6, (ph - 6) / 2); g.fill(); g.stroke();
      g.beginPath(); g.arc(62, ph / 2, 26, 0, TAU); g.lineWidth = 6; g.stroke();
    }),
    transparent: true, depthTest: false, depthWrite: false,
  }));
  pill.position.set(pw / 2, size * 0.35, -1);
  pill.renderOrder = 18;
  const slash = new THREE.Mesh(PLANE, new THREE.MeshBasicMaterial({ color: PAL.amber, transparent: true, depthTest: false, depthWrite: false }));
  slash.position.set(62, size * 0.35, 0);
  slash.rotation.z = -45 * DEG;
  slash.scale.set(1, 6, 1);
  slash.renderOrder = 19;
  b.root.add(pill, slash);
  updaters.push((t) => {
    const op = b.root.visible ? b.letters[0].mat.opacity : 0;
    pill.material.opacity = op; slash.material.opacity = op;
    slash.visible = slash.scale.x > 0.5;
  });
  return b;
}

// Cartões 3D em arco (cena 4)
const CARD_S = 0.0069; // unidades de mundo por "pixel" do cartão
const CARD_TEXTS = [
  'Afastar o agressor do lar, mesmo com o imóvel no nome dele',
  'Proibir contato e aproximação',
  'Tratamento obrigatório para álcool',
  'Tornozeleira eletrônica',
];
function makeCard(k) {
  const g = new THREE.Group();
  scene.add(g);
  const CW = 1300, CH = 780, R = 60;
  const shape = new THREE.Shape();
  shape.moveTo(-CW / 2 + R, -CH / 2);
  shape.lineTo(CW / 2 - R, -CH / 2); shape.quadraticCurveTo(CW / 2, -CH / 2, CW / 2, -CH / 2 + R);
  shape.lineTo(CW / 2, CH / 2 - R); shape.quadraticCurveTo(CW / 2, CH / 2, CW / 2 - R, CH / 2);
  shape.lineTo(-CW / 2 + R, CH / 2); shape.quadraticCurveTo(-CW / 2, CH / 2, -CW / 2, CH / 2 - R);
  shape.lineTo(-CW / 2, -CH / 2 + R); shape.quadraticCurveTo(-CW / 2, -CH / 2, -CW / 2 + R, -CH / 2);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 20, bevelEnabled: true, bevelThickness: 6, bevelSize: 6, bevelSegments: 2, curveSegments: 8 });
  geo.translate(0, 0, -26);
  const front = new THREE.MeshBasicMaterial({ color: PAL.white, transparent: true });
  const side = new THREE.MeshBasicMaterial({ color: '#B9A3D3', transparent: true });
  const mesh = new THREE.Mesh(geo, [front, side]);
  mesh.renderOrder = 1;
  const badge = new THREE.Mesh(new THREE.CircleGeometry(56, 48), new THREE.MeshBasicMaterial({ color: PAL.amber, transparent: true }));
  badge.position.set(-500, 250, 1);
  badge.renderOrder = 2;
  const accent = new THREE.Mesh(PLANE, new THREE.MeshBasicMaterial({ color: PAL.purple, transparent: true }));
  accent.position.set(-470, -300, 1); accent.scale.set(180, 10, 1); accent.renderOrder = 2;
  g.add(mesh, badge, accent);
  const op = (t) => easeInOutCubic(local(t, 27.3 + k * 0.12, 0.6)) * (1 - easeInOutCubic(local(t, 37.85, 0.45)));
  const hold = CARD_HOLD[k];
  const num = T({
    text: String(k + 1), font: 'display', size: 72, x: -500, y: 250 - 26, z: 3, align: 'center', color: PAL.ink,
    anim: 'none', shadow: false, depthTest: true, order: 3, parent: g, tIn: 27.2, tOut: 38.4,
    opacityFn: op, holdWindow: hold,
  });
  const txt = T({
    text: CARD_TEXTS[k], font: 'body', size: 64, x: -560, y: 110, z: 3, maxWidth: 1110, color: PAL.ink,
    anim: 'none', shadow: false, depthTest: true, order: 3, parent: g, tIn: 27.2, tOut: 38.4, lineHeight: 1.15,
    opacityFn: op, holdWindow: hold,
  });
  num.isCardNumber = true;
  updaters.push((t) => {
    const o = op(t);
    g.visible = o > 0.003;
    const e = easeOutExpo(local(t, 27.3 + k * 0.12, 0.9));
    const c = cardPos(k);
    g.position.set(c[0], c[1] - (1 - e) * 3, c[2]);
    g.rotation.set(-(1 - e) * 0.9, CARD_ANG[k], 0, 'YXZ');
    g.scale.setScalar(CARD_S);
    for (const m of [front, side, badge.material, accent.material]) m.opacity = o;
  });
  return { g, txt };
}

// Pilha de parcelas (cena 6): cubos com duas metades
const STACK_N = 9, STACK_X = 10.6, CUBE = 0.95, STEP = 1.0;
const stackBaseY = -0.9 + 0.68 * (-0.95 * HOUSE_S);
const halfGeo = new THREE.BoxGeometry(CUBE / 2 - 0.01, CUBE, CUBE);
const cubes = Array.from({ length: STACK_N }, (_, i) => {
  const g = new THREE.Group();
  const mL = new THREE.MeshStandardMaterial({ color: PAL.amber, roughness: 0.55, metalness: 0.0 });
  const mR = new THREE.MeshStandardMaterial({ color: PAL.amber, roughness: 0.55, metalness: 0.0 });
  const l = new THREE.Mesh(halfGeo, mL); l.position.x = -CUBE / 4;
  const r = new THREE.Mesh(halfGeo, mR); r.position.x = CUBE / 4;
  g.add(l, r);
  scene.add(g);
  return { g, mL };
});
function updateCubes(t) {
  cubes.forEach(({ g, mL }, i) => {
    const ti = 55.5 + i * 0.24;
    const x = local(t, ti, 0.9);
    const out = easeInOutCubic(local(t, 68.1 + i * 0.03, 0.5));
    const s = local(t, ti, 0.15) * (1 - out);
    g.visible = s > 0.001;
    const sp = spring(x);
    g.position.set(STACK_X + 0.06 * Math.sin(i * 2.3), stackBaseY + CUBE / 2 + i * STEP + (1 - sp) * 6, 0.06 * Math.sin(i * 1.7));
    g.rotation.set(0, 0.25 * Math.sin(i * 1.7) + (1 - sp) * 1.2, 0);
    g.scale.setScalar(Math.max(s, 0.001));
    const c = mixColor(RGB.amber, RGB.lilac, easeInOutCubic(local(t, 59.6 + i * 0.07, 0.5)));
    mL.color.setRGB(c[0], c[1], c[2]);
  });
}

// ════════════════════════════════════════════════════════════════════════
// Roteiro de textos
// ════════════════════════════════════════════════════════════════════════
const X0 = -820; // margem esquerda da coluna de texto

function buildScript() {
  // 1 · Abertura
  T({ text: 'Você não está sozinha.', font: 'display', size: 140, y: 40, align: 'center', maxWidth: 1500, anim: 'depth', tIn: 0.6, tOut: 7.6, lineHeight: 1.05 });

  // 2 · Violência psicológica é crime
  const WORDS = ['Humilhação', 'ameaça', 'controle', 'chantagem'];
  const SCAT = [[-520, 320], [-640, 140], [-470, -40], [-600, -220]];
  const wb = WORDS.map((w, i) => T({
    text: w, font: 'display', size: 76, align: 'center', color: PAL.lilac, anim: 'none',
    tIn: 8.6 + i * 0.6, tOut: 17.7, settle: 12.3,
  }));
  const gapW = 54;
  const total = wb.reduce((a, b) => a + b.width, 0) + gapW * (wb.length - 1);
  let acc = -total / 2;
  wb.forEach((b, i) => {
    const rowX = acc + b.width / 2; acc += b.width + gapW;
    const P = [SCAT[i][0], SCAT[i][1], -220 * (0.5 + 0.5 * Math.sin(i * 2.3))];
    const R = [rowX, 400, 0];
    const ry0 = 0.35 * Math.sin(i * 1.7 + 1), s0 = 1.3 + 0.15 * Math.sin(i * 1.3);
    b.s.group = (t, root) => {
      const tIn = b.s.tIn;
      const sc = easeOutBack(local(t, tIn, 0.6));
      const a = easeInOutCubic(local(t, 11.0 + i * 0.1, 0.9));
      const p = mix(P, R, a);
      root.position.set(p[0], p[1], p[2]);
      root.rotation.y = mix(ry0, 0, a);
      root.scale.setScalar(Math.max(sc, 0) * mix(s0, 1, a));
      return local(t, tIn, 0.25);
    };
  });
  T({ text: 'São violência.\nE são *crime*.', font: 'display', size: 100, x: X0, y: 190, tIn: 12.4, tOut: 17.7, lineHeight: 1.05 });
  T({ text: 'Art. 147-B do Código Penal · *6 meses a 2 anos*', font: 'body', size: 46, x: X0, y: -110, color: PAL.lilac, maxWidth: 950, tIn: 12.8, tOut: 17.7 });

  // 3 · Proteção imediata
  T({ text: 'A medida protetiva sai a partir do seu *relato*.', font: 'display', size: 76, x: X0, y: 330, maxWidth: 980, tIn: 19.0, tOut: 27.6, lineHeight: 1.08 });
  makeSeal('Sem lesão', X0, 20, 21.6, 27.6);
  makeSeal('Sem boletim', X0, -110, 22.8, 27.6);
  makeSeal('Sem processo aberto', X0, -240, 24.0, 27.6);

  // 4 · O que o juiz pode determinar
  T({ text: 'O que o juiz pode determinar', font: 'display', size: 54, x: X0, y: 440, color: PAL.lilac, tIn: 28.0, tOut: 38.0 });
  CARD_TEXTS.forEach((_, k) => makeCard(k));
  T({ text: '2 a 5 anos', font: 'display', size: 230, y: 60, align: 'center', color: PAL.amber, anim: 'pop', tIn: 38.0, tOut: 40.95 });
  T({ text: 'Descumprir a medida é crime.', font: 'display', size: 68, y: -110, align: 'center', tIn: 38.0, tOut: 40.95 });

  // 5 · A casa também é sua
  T({ text: 'União estável vale *sem papel*.', font: 'display', size: 66, x: X0, y: 360, maxWidth: 1150, tIn: 41.0, tOut: 50.6 });
  T({ text: 'Imóvel financiado no nome dele: você tem direito à *metade da entrada e das parcelas* pagas durante a união.', font: 'body', size: 50, x: X0, y: 220, maxWidth: 900, tIn: 42.4, tOut: 50.6 });
  T({ text: 'Ele não pode vender *sozinho*.', font: 'display', size: 66, x: X0, y: 360, maxWidth: 1150, tIn: 50.8, tOut: 55.0 });
  T({ text: 'Precisa sair? *Auxílio-aluguel por até 6 meses.*', font: 'body', size: 52, x: X0, y: 220, maxWidth: 900, tIn: 51.2, tOut: 55.0 });

  // 6 · E se ele parar de pagar?
  T({ text: 'E se ele parar de pagar?', font: 'display', size: 54, x: X0, y: 440, color: PAL.lilac, tIn: 54.9, tOut: 68.7 });
  T({ text: 'Peça pensão junto com a medida protetiva, num valor que *cubra a prestação*.', font: 'body', size: 50, x: X0, y: 320, maxWidth: 880, tIn: 55.1, tOut: 63.4 });
  T({ text: 'Pagou as parcelas? Guarde os comprovantes: há decisões garantindo o *reembolso da metade*.', font: 'body', size: 50, x: X0, y: 90, maxWidth: 880, tIn: 57.4, tOut: 63.4 });
  T({ text: 'Passar o financiamento para o seu nome exige *aprovação do banco*.', font: 'body', size: 50, x: X0, y: 320, maxWidth: 880, tIn: 63.6, tOut: 68.8 });
  T({ text: 'Peça por escrito.', font: 'display', size: 76, x: X0, y: 110, color: PAL.amber, tIn: 64.6, tOut: 68.7 });

  // 7 · Guarde provas, com segurança (rótulos no mundo, junto do anel)
  const WK = (2 * 30 * TAN) / H;
  const labels = new THREE.Group();
  labels.scale.setScalar(WK);
  scene.add(labels);
  updaters.push((t) => {
    labels.visible = t > 69 && t < 78.5;
  });
  const LABELS = ['Mensagens e áudios', 'Um diário com datas', 'Testemunhas', 'Documentos da casa'];
  LABELS.forEach((txt, j) => {
    const [ix, iy] = ICON_POS[j];
    T({ text: txt, font: 'body', size: 38, x: ix / WK, y: iy > 0 ? iy / WK + ICON_S / WK + 34 : iy / WK - ICON_S / WK - 52, align: 'center', parent: labels, tIn: LABEL_T[j], tOut: 77.7 });
  });
  T({ text: 'Guarde cópias\n*fora de casa.*', font: 'display', size: 70, y: 30, align: 'center', tIn: 73.8, tOut: 77.8, lineHeight: 1.08 });

  // 8 · Onde pedir ajuda
  T({ text: '190', font: 'display', size: 240, x: -440, y: 140, align: 'center', color: PAL.amber, anim: 'pop', tIn: 79.0, tOut: 86.6 });
  T({ text: 'risco imediato', font: 'body', size: 42, x: -440, y: 50, align: 'center', color: PAL.lilac, tIn: 79.3, tOut: 86.6 });
  T({ text: '180', font: 'display', size: 240, x: 440, y: 140, align: 'center', color: PAL.amber, anim: 'pop', tIn: 79.6, tOut: 86.6 });
  T({ text: 'Central de Atendimento à Mulher,\n24h e gratuita', font: 'body', size: 40, x: 440, y: 50, align: 'center', color: PAL.lilac, tIn: 79.9, tOut: 86.6 });
  T({
    text: 'Delegacia da Mulher\nDelegacia Online RS: *delegaciaonline.rs.gov.br/dol/delegaciadamulher*\nDefensoria Pública: *defensoria.rs.def.br*',
    font: 'body', size: 40, y: -150, align: 'center', tIn: 80.8, tOut: 86.6, lineHeight: 1.45,
  });
  T({ text: 'Material informativo, não substitui orientação jurídica. Informações de outubro de 2026.', font: 'body', size: 30, y: -470, align: 'center', color: PAL.lilac, anim: 'fade', tIn: 85.2 });
  T({ text: 'Você não está sozinha.', font: 'display', size: 130, y: 60, align: 'center', maxWidth: 1500, tIn: 86.8, lineHeight: 1.05 });
}

// ════════════════════════════════════════════════════════════════════════
// Quadro
// ════════════════════════════════════════════════════════════════════════
function frame(t) {
  const { pos, tgt } = cameraAt(t);
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(tgt[0], tgt[1], tgt[2]);
  camera.updateMatrixWorld(true);
  updatePoints(t);
  // profundidade do centro da forma em coordenadas de câmera (para o sombreamento dos pontos)
  const c = shapeGroup.position.clone().applyMatrix4(camera.matrixWorldInverse);
  ptsMat.uniforms.uCenterZ.value = c.z;
  ptsMat.uniforms.uRadius.value = 5 * shapeGroup.scale.x;
  updateCubes(t);
  for (const b of blocks) b.update(t);
  for (const u of updaters) u(t);
}

async function init() {
  await document.fonts.load('800 100px "Bricolage Grotesque"', 'Você não está sozinha');
  await document.fonts.load('600 100px "Source Sans 3"', 'Você não está sozinha');
  await document.fonts.ready;
  if (!document.fonts.check('800 100px "Bricolage Grotesque"') || !document.fonts.check('600 100px "Source Sans 3"')) {
    throw new Error('fontes não carregadas');
  }
  buildScript();
  window.renderFrame = (t) => {
    frame(t);
    renderer.render(scene, camera);
  };
  window.textReport = () => blocks.map((b) => ({
    text: b.s.text, words: b.words, holdStart: +b.holdStart.toFixed(3), holdEnd: +b.holdEnd.toFixed(3),
    need: +(b.words / 3).toFixed(3), card: !!b.s.holdWindow, number: !!b.isCardNumber,
  }));
  window.__ready = true;
}
init().catch((e) => { window.__error = String(e && e.stack || e); });
