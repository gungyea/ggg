// Procedural textures (no image downloads needed — works offline / behind firewalls)
import * as THREE from 'three';

function canvas(w, h = w) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

// tileable value noise
function noiseField(size, cells, seed = 1) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const grid = Array.from({ length: cells * cells }, rnd);
  const g = (x, y) => grid[((y % cells + cells) % cells) * cells + ((x % cells + cells) % cells)];
  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const fx = x / size * cells, fy = y / size * cells;
    const ix = Math.floor(fx), iy = Math.floor(fy);
    const tx = fx - ix, ty = fy - iy;
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    const a = g(ix, iy), b = g(ix + 1, iy), c = g(ix, iy + 1), d = g(ix + 1, iy + 1);
    out[y * size + x] = a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  }
  return out;
}

function heightToNormal(h, size, strength) {
  const c = canvas(size);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  const at = (x, y) => h[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
    const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
    const l = Math.hypot(dx, dy, 1);
    const i = (y * size + x) * 4;
    img.data[i] = (-dx / l * 0.5 + 0.5) * 255;
    img.data[i + 1] = (dy / l * 0.5 + 0.5) * 255;
    img.data[i + 2] = (1 / l * 0.5 + 0.5) * 255;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function skinNormal() {
  const S = 512;
  const n1 = noiseField(S, 64, 3), n2 = noiseField(S, 128, 7), n3 = noiseField(S, 16, 11);
  const h = new Float32Array(S * S);
  for (let i = 0; i < h.length; i++) {
    const pore = n2[i] < 0.18 ? -(0.18 - n2[i]) * 4 : 0;
    h[i] = n1[i] * 0.5 + n3[i] * 0.6 + pore;
  }
  const t = heightToNormal(h, S, 2.2);
  t.repeat.set(10, 10);
  return t;
}

export function fabricNormal(kind = 'knit') {
  const S = 256;
  const h = new Float32Array(S * S);
  const n = noiseField(S, 32, 5);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    let v;
    if (kind === 'denim') v = Math.sin((x + y) / S * Math.PI * 2 * 24) * 0.5 + Math.sin(x / S * Math.PI * 2 * 64) * 0.2;
    else v = Math.abs(Math.sin(x / S * Math.PI * 2 * 32)) * 0.6 + Math.abs(Math.sin(y / S * Math.PI * 2 * 48)) * 0.4;
    h[y * S + x] = v + n[y * S + x] * 0.6;
  }
  const t = heightToNormal(h, S, 1.4);
  t.repeat.set(kind === 'denim' ? 8 : 10, kind === 'denim' ? 8 : 10);
  return t;
}

export function woodFloor() {
  const W = 1024, c = canvas(W), ctx = c.getContext('2d');
  const planks = 8;
  const n = noiseField(W, 8, 21);
  for (let p = 0; p < planks; p++) {
    const y0 = p * W / planks;
    const base = 0.75 + ((p * 37) % 7) / 30;
    const off = (p * 311) % W;
    for (let x = 0; x < W; x += 2) {
      const grain = Math.sin((x + off) * 0.03 + Math.sin((x + off) * 0.004) * 6) * 0.06 + n[((p * 97) % W) * W + x] * 0.1;
      const k = base + grain;
      ctx.fillStyle = `rgb(${(150 * k) | 0},${(104 * k) | 0},${(68 * k) | 0})`;
      ctx.fillRect(x, y0, 2, W / planks);
    }
    ctx.fillStyle = 'rgba(30,18,10,0.6)';
    ctx.fillRect(0, y0, W, 3);
    ctx.fillRect(((p * 523) % W), y0, 3, W / planks);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  t.anisotropy = 8;
  return t;
}

export function wallTexture() {
  const W = 512, c = canvas(W), ctx = c.getContext('2d');
  const n = noiseField(W, 32, 9), m = noiseField(W, 128, 2);
  const img = ctx.createImageData(W, W);
  for (let i = 0; i < W * W; i++) {
    const k = 0.9 + n[i] * 0.07 + m[i] * 0.05;
    img.data[i * 4] = 205 * k; img.data[i * 4 + 1] = 200 * k; img.data[i * 4 + 2] = 192 * k; img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 2);
  return t;
}

// splat stamps (tomato / cream / egg)
export function splatCanvas(color, size = 256, seed = Math.random() * 1000) {
  const c = canvas(size), ctx = c.getContext('2d');
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  ctx.fillStyle = color;
  ctx.translate(size / 2, size / 2);
  ctx.beginPath();
  const pts = 18;
  for (let i = 0; i <= pts; i++) {
    const a = i / pts * Math.PI * 2;
    const r = size * (0.22 + rnd() * 0.12);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.fill();
  for (let i = 0; i < 12; i++) {
    const a = rnd() * Math.PI * 2, r = size * (0.25 + rnd() * 0.2);
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r, Math.sin(a) * r, size * (0.02 + rnd() * 0.04), 0, Math.PI * 2);
    ctx.fill();
  }
  // glossy highlight
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath();
  ctx.ellipse(-size * 0.06, -size * 0.07, size * 0.08, size * 0.04, -0.5, 0, Math.PI * 2);
  ctx.fill();
  return c;
}
