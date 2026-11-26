// Photo editor + face texture.
// The photo's 478 face landmarks are found automatically (MediaPipe, on-device) and
// the photo is warped triangle-by-triangle onto the 3D head's own landmark layout,
// so eyes, nose, mouth and jaw sit exactly on the model's features.
// Manual dragging still works as a fallback. Nothing ever leaves the browser.
import { detectFace, similarity, warpTriangles, featherPolygon, FACE_OVAL, loadLandmarker } from './facefit.js';

const W = 500, ASPECT = 0.714, H = Math.round(W / ASPECT); // editor = physical aspect of the face box
const K = 2; // compose at 2x editor resolution

export async function loadImageFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    // downscale huge phone photos so everything stays fast
    const max = 1600;
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function preloadFaceDetector() { return loadLandmarker().catch(() => null); }

export class PhotoEditor {
  constructor(canvas, meta) {
    this.canvas = canvas;
    canvas.width = W; canvas.height = H;
    this.ctx = canvas.getContext('2d');
    this.img = null;
    this.detected = null;  // landmarks found by the detector (photo px)
    this.photoLm = null;   // landmarks used for fitting (detected, or derived from the pins)
    this.mode = 'none';    // 'auto' (detector) | 'pins' (4 pins placed by hand) | 'none'
    this.pins = null;      // { le, re, mouth, chin } in photo px
    this.t = { x: W / 2, y: H / 2, s: 1, r: 0 }; // how the photo is shown in the editor
    this.pointers = new Map();
    this.dragPin = null;
    this.onstatus = () => {};
    this.setMeta(meta);
    this.bind();
  }

  get auto() { return this.mode === 'auto'; }
  get fitted() { return this.mode !== 'none' && !!this.photoLm && !!this.mesh; }

  setMeta(meta) {
    this.meta = meta;
    this.lm = meta.face;
    this.mesh = meta.mesh;
    if (this.mode === 'pins') this.updateFromPins();
    if (this.mode === 'auto') this.t = this.fitT();
    this.draw();
  }

  async setImage(img) {
    this.img = img;
    this.detected = this.photoLm = this.pins = null;
    this.mode = 'none';
    // first guess: face roughly centred
    const lm = this.lm;
    const faceH = (lm.chinY - lm.eyeY) * 2.3 * H;
    this.t = { x: W / 2, y: H * ((lm.eyeY + lm.chinY) / 2 - 0.04), s: Math.max(faceH / (img.height * 0.55), (W * 0.9) / img.width), r: 0 };
    this.draw();
    this.onstatus('detecting');
    let done;
    this.detecting = new Promise((r) => { done = r; });
    try {
      const pts = await detectFace(img);
      if (this.img !== img) return;
      if (pts) {
        this.detected = pts;
        if (this.mode !== 'pins') {   // the player may already be placing pins by hand
          this.photoLm = pts;
          this.mode = 'auto';
          this.t = this.fitT();
          this.onstatus('auto');
        }
      } else if (this.mode !== 'pins') this.startPins('noface');
    } catch (e) {
      console.warn('face detection failed', e);
      if (this.img === img && this.mode !== 'pins') this.startPins('nodetector');
    }
    if (this.img === img) this.detecting = null;
    done();
    this.draw();
  }

  // ------------------------------------------------------------ fitting
  tmplPt(name) {
    const P = this.mesh.pts, avg = (...ix) => [ix.reduce((a, i) => a + P[i][0], 0) / ix.length, ix.reduce((a, i) => a + P[i][1], 0) / ix.length];
    return { le: avg(33, 133), re: avg(362, 263), mouth: avg(13, 14), chin: avg(152) }[name];
  }

  // similarity placement (photo px -> editor px) that best matches the template
  fitT() {
    const dst = this.mesh.pts.map((p) => [p[0] * W, p[1] * H]);
    const [a, b, tx, ty] = similarity(this.photoLm, dst);
    const cx = this.img.width / 2, cy = this.img.height / 2;
    return { s: Math.hypot(a, b), r: Math.atan2(b, a), x: a * cx - b * cy + tx, y: b * cx + a * cy + ty };
  }

  /** switch to hand-placed pins: 2 eyes, mouth, chin. Works with any face shape. */
  startPins(reason = 'pins') {
    if (!this.img || !this.mesh) return;
    if (this.detected) {
      const D = this.detected, avg = (...ix) => [ix.reduce((a, i) => a + D[i][0], 0) / ix.length, ix.reduce((a, i) => a + D[i][1], 0) / ix.length];
      this.pins = { le: avg(33, 133), re: avg(362, 263), mouth: avg(13, 14), chin: D[152] };
    } else {
      this.pins = {};
      for (const k of ['le', 're', 'mouth', 'chin']) { const t = this.tmplPt(k); this.pins[k] = this.fromEditor([t[0] * W, t[1] * H]); }
    }
    this.mode = 'pins';
    this.updateFromPins();
    this.onstatus(reason);
    this.draw();
  }

  // the 4 pins drive a smooth (thin-plate spline) mapping template -> photo for all 478 points
  updateFromPins() {
    if (!this.pins || !this.mesh) return;
    const names = ['le', 're', 'mouth', 'chin'];
    const src = names.map((k) => this.tmplPt(k)), dst = names.map((k) => this.pins[k]);
    const f = thinPlate(src, dst);
    this.photoLm = this.mesh.pts.map((p) => f(p[0], p[1]));
  }

  enableAuto() {
    if (!this.detected) return;
    this.photoLm = this.detected;
    this.mode = 'auto';
    this.t = this.fitT();
    this.draw();
    this.onstatus('auto');
  }

  manualEdit() { if (this.mode === 'auto') this.startPins('pins'); }

  /** the photo's landmarks as face-box fractions (similarity placement only), or null */
  fitLandmarks() {
    if (!this.fitted) return null;
    const t = this.fitT();
    return this.photoLm.map((p) => { const e = this.toEditor(p, t); return [e[0] / W, e[1] / H]; });
  }

  // ------------------------------------------------------------ input
  bind() {
    const c = this.canvas;
    const pos = (e) => {
      const r = c.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
    };
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      const p = pos(e);
      this.pointers.set(e.pointerId, p);
      this.dragPin = null;
      if (this.mode === 'pins' && this.pointers.size === 1) {
        let best = 30 * this.pxScale();
        for (const [k, v] of Object.entries(this.pins)) {
          const q = this.toEditor(v), d = Math.hypot(q[0] - p.x, q[1] - p.y);
          if (d < best) { best = d; this.dragPin = k; }
        }
      }
    });
    c.addEventListener('pointermove', (e) => {
      if (!this.pointers.has(e.pointerId) || !this.img) return;
      const prev = this.pointers.get(e.pointerId);
      const p = pos(e);
      if (Math.hypot(p.x - prev.x, p.y - prev.y) < 0.5) return;
      this.manualEdit();
      if (this.dragPin) {
        this.pins[this.dragPin] = this.fromEditor([p.x, p.y]);
        this.updateFromPins();
      } else if (this.pointers.size === 1) {
        this.t.x += p.x - prev.x; this.t.y += p.y - prev.y;
      } else if (this.pointers.size === 2) {
        const entries = [...this.pointers.entries()];
        const [a0, b0] = entries.map(([, v]) => v);
        const [a, b] = entries.map(([id, v]) => (id === e.pointerId ? p : v));
        const d0 = Math.hypot(b0.x - a0.x, b0.y - a0.y), d1 = Math.hypot(b.x - a.x, b.y - a.y);
        if (d0 > 5) this.t.s *= d1 / d0;
        this.t.r += Math.atan2(b.y - a.y, b.x - a.x) - Math.atan2(b0.y - a0.y, b0.x - a0.x);
        this.t.x += ((a.x + b.x) - (a0.x + b0.x)) / 2;
        this.t.y += ((a.y + b.y) - (a0.y + b0.y)) / 2;
      }
      this.pointers.set(e.pointerId, p);
      this.draw();
    });
    const up = (e) => { this.pointers.delete(e.pointerId); this.dragPin = null; this.draw(); };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.manualEdit();
      this.t.s *= Math.exp(-e.deltaY * 0.0015);
      this.draw();
    }, { passive: false });
  }

  // editor px per screen px (pins and labels keep a finger-friendly size)
  pxScale() { const r = this.canvas.getBoundingClientRect(); return r.width ? W / r.width : 1; }

  zoom(k) { this.manualEdit(); this.t.s *= k; this.draw(); }
  rotate(a) { this.manualEdit(); this.t.r += a; this.draw(); }

  drawPhoto(ctx, scale = 1, t = this.t) {
    if (!this.img) return;
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(t.x, t.y);
    ctx.rotate(t.r);
    ctx.scale(t.s, t.s);
    ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
    ctx.restore();
  }

  // photo px <-> editor px
  toEditor(p, t = this.t) {
    const { x, y, s, r } = t, cx = this.img.width / 2, cy = this.img.height / 2;
    const dx = (p[0] - cx) * s, dy = (p[1] - cy) * s;
    return [x + dx * Math.cos(r) - dy * Math.sin(r), y + dx * Math.sin(r) + dy * Math.cos(r)];
  }
  fromEditor(q, t = this.t) {
    const { x, y, s, r } = t, cx = this.img.width / 2, cy = this.img.height / 2;
    const dx = q[0] - x, dy = q[1] - y;
    return [cx + (dx * Math.cos(r) + dy * Math.sin(r)) / s, cy + (-dx * Math.sin(r) + dy * Math.cos(r)) / s];
  }

  oval() {
    const lm = this.lm;
    const span = lm.chinY - lm.eyeY;
    let x0 = lm.eyeLX - 0.32 * (lm.eyeRX - lm.eyeLX), x1 = lm.eyeRX + 0.32 * (lm.eyeRX - lm.eyeLX);
    if (this.mesh) {
      const xs = FACE_OVAL.map((i) => this.mesh.pts[i][0]);
      x0 = Math.min(...xs); x1 = Math.max(...xs);
    }
    const top = lm.eyeY - span * 1.25, bottom = lm.chinY + 0.012;
    return { cx: (x0 + x1) / 2 * W, cy: (top + bottom) / 2 * H, rx: (x1 - x0) / 2 * W * 1.02, ry: (bottom - top) / 2 * H, top, bottom };
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = '#1a1b1f';
    ctx.fillRect(0, 0, W, H);
    if (this.mode === 'pins' && this.img) {
      // the photo as-is, with 4 pins to drag onto the eyes, mouth and chin
      this.drawPhoto(ctx);
      const label = { le: '눈', re: '눈', mouth: '입', chin: '턱' };
      const u = this.pxScale(), R = 13 * u;
      ctx.save();
      ctx.font = `bold ${Math.round(13 * u)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      const q = Object.fromEntries(Object.entries(this.pins).map(([k, v]) => [k, this.toEditor(v)]));
      ctx.strokeStyle = 'rgba(255,211,77,0.6)'; ctx.lineWidth = 1.2 * u; ctx.setLineDash([4 * u, 4 * u]);
      ctx.beginPath(); ctx.moveTo(...q.le); ctx.lineTo(...q.re); ctx.moveTo((q.le[0] + q.re[0]) / 2, (q.le[1] + q.re[1]) / 2); ctx.lineTo(...q.mouth); ctx.lineTo(...q.chin); ctx.stroke();
      ctx.setLineDash([]);
      for (const [k, [x, y]] of Object.entries(q)) {
        const on = this.dragPin === k;
        ctx.fillStyle = on ? 'rgba(255,90,54,0.35)' : 'rgba(255,211,77,0.25)';
        ctx.strokeStyle = on ? '#ff5a36' : '#ffd34d'; ctx.lineWidth = 2 * u;
        ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.lineWidth = 1.5 * u;
        ctx.beginPath(); ctx.moveTo(x - R * 0.45, y); ctx.lineTo(x + R * 0.45, y); ctx.moveTo(x, y - R * 0.45); ctx.lineTo(x, y + R * 0.45); ctx.stroke();
        ctx.fillStyle = '#ffd34d';
        ctx.strokeStyle = 'rgba(0,0,0,0.75)'; ctx.lineWidth = 3 * u;
        ctx.strokeText(label[k], x, y - R - 5 * u); ctx.fillText(label[k], x, y - R - 5 * u);
      }
      ctx.restore();
      // live preview of the result in the corner
      if (this.fitted) {
        const pw = W * 0.3, ph = H * 0.3;
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(W - pw - 12, H - ph - 12, pw + 8, ph + 8);
        ctx.drawImage(this.composeFront(1), W - pw - 8, H - ph - 8, pw, ph);
        ctx.fillStyle = '#fff'; ctx.font = `bold ${Math.round(11 * this.pxScale())}px system-ui, sans-serif`; ctx.textAlign = 'center';
        ctx.fillText('미리보기', W - pw / 2 - 8, H - ph - 18);
        ctx.restore();
      }
      return;
    }
    if (this.fitted && this.img) ctx.drawImage(this.composeFront(1), 0, 0);   // auto: the real result
    else this.drawPhoto(ctx);
    const o = this.oval();
    ctx.save();
    ctx.fillStyle = 'rgba(10,10,14,0.55)';
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.ellipse(o.cx, o.cy, o.rx, o.ry, 0, 0, Math.PI * 2);
    ctx.fill('evenodd');
    ctx.strokeStyle = this.fitted ? 'rgba(90,230,140,0.9)' : 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath(); ctx.ellipse(o.cx, o.cy, o.rx, o.ry, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  // the front half of the face texture at `scale` x editor size (photo only, transparent elsewhere)
  composeFront(scale = K) {
    const VW = W * scale, VH = H * scale;
    const o = this.oval();
    const t = this.fitted ? this.fitT() : this.t;
    // 1) whole photo, placed by the similarity transform, inside a soft oval (forehead/hairline/cheeks)
    const base = document.createElement('canvas');
    base.width = VW; base.height = VH;
    const bc = base.getContext('2d');
    this.drawPhoto(bc, scale, t);
    bc.globalCompositeOperation = 'destination-in';
    bc.save();
    bc.scale(scale, scale);
    bc.translate(o.cx, o.cy);
    bc.scale(o.rx / o.ry, 1);
    const rg = bc.createRadialGradient(0, 0, o.ry * 0.8, 0, 0, o.ry * 1.02);
    rg.addColorStop(0, '#000'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    bc.fillStyle = rg;
    bc.fillRect(-o.ry * 2, -o.ry * 2, o.ry * 4, o.ry * 4);
    bc.restore();
    bc.globalCompositeOperation = 'source-over';

    // 2) the face itself, warped onto the model's features
    if (this.fitted) {
      const dst = this.mesh.pts.map((p) => [p[0] * VW, p[1] * VH]);
      const face = document.createElement('canvas');
      face.width = VW; face.height = VH;
      const fc = face.getContext('2d');
      warpTriangles(fc, this.img, this.photoLm, dst, this.mesh.tri);
      const mask = document.createElement('canvas');
      mask.width = VW; mask.height = VH;
      featherPolygon(mask.getContext('2d'), FACE_OVAL.map((i) => dst[i]), 0.07);
      fc.globalCompositeOperation = 'destination-in';
      fc.drawImage(mask, 0, 0);
      bc.drawImage(face, 0, 0);
    }
    return base;
  }

  // ------------------------------------------------------------ face texture
  /** returns { canvas, skin, hair }. hairOverride: css colour, 'bald', or null (auto) */
  compose(size = 1024, hairOverride = null) {
    const lm = this.lm, o = this.oval();
    const span = lm.chinY - lm.eyeY;
    const front = this.img ? this.composeFront(K) : null;
    const VW = W * K, VH = H * K;
    const fctx = front && front.getContext('2d', { willReadFrequently: true });

    const sample = (fx, fy, r = 7) => {
      if (!fctx) return null;
      const x = Math.round(fx * VW), y = Math.round(fy * VH);
      const d = fctx.getImageData(Math.max(0, x - r), Math.max(0, y - r), r * 2, r * 2).data;
      let R = 0, G = 0, B = 0, n = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 230) { R += d[i]; G += d[i + 1]; B += d[i + 2]; n++; }
      return n > 10 ? [R / n, G / n, B / n] : null;
    };
    // skin: cheeks, forehead, chin, nose bridge — median per channel ignores shadows/glasses
    const spots = this.mesh
      ? [50, 280, 151, 205, 425, 9, 199, 101, 330].map((i) => this.mesh.pts[i])
      : [[lm.eyeLX, lm.eyeY + span * 0.38], [lm.eyeRX, lm.eyeY + span * 0.38], [0.5, lm.eyeY - span * 0.4]];
    const pts = spots.map(([x, y]) => sample(x, y)).filter(Boolean);
    let skin = [214, 168, 140];
    if (pts.length >= 3) skin = [0, 1, 2].map((k) => pts.map((p) => p[k]).sort((a, b) => a - b)[Math.floor(pts.length / 2)]);
    // the neck/body is usually a bit darker than the lit cheeks: blend in the lower jaw
    if (this.mesh) {
      const jaw = [207, 427, 192, 416, 214, 434].map((i) => sample(...this.mesh.pts[i])).filter(Boolean);
      if (jaw.length >= 3) {
        const jm = [0, 1, 2].map((k) => jaw.map((p) => p[k]).sort((a, b) => a - b)[Math.floor(jaw.length / 2)]);
        skin = skin.map((v, k) => (v * 0.4 + jm[k] * 0.6) * 0.96);
      }
    }

    // hair: darkest spot near the top of the oval, if clearly darker than skin
    let hairS = null;
    for (const fx of [0.38, 0.5, 0.62]) for (let fy = o.top + 0.02; fy < lm.eyeY - span * 0.55; fy += 0.025) {
      const c = sample(fx, fy, 8);
      if (c && (!hairS || luminance(c) < luminance(hairS))) hairS = c;
    }
    let hair = hairS && luminance(hairS) < luminance(skin) * 0.75 ? hairS : [38, 30, 26];
    if (hairOverride === 'bald') hair = skin;
    else if (hairOverride) hair = parseHex(hairOverride);

    const out = document.createElement('canvas');
    out.width = size * 2; out.height = size;   // left: front of head, right: back of head
    const ctx = out.getContext('2d');
    const css = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
    ctx.fillStyle = css(skin);
    ctx.fillRect(0, 0, size * 2, size);
    const Y = (f) => f * size;

    // front half: hair above the brow line, fading out towards the temples
    let g = ctx.createLinearGradient(0, 0, 0, Y(lm.eyeY - span * 0.15));
    g.addColorStop(0, css(hair)); g.addColorStop(0.6, css(hair)); g.addColorStop(1, css(hair, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, Y(lm.eyeY));
    // sides of the head (above the ears) are hair too, matching the back half
    for (const [x0, x1] of [[0, 0.2], [1, 0.8]]) {
      const hg = ctx.createLinearGradient(x0 * size, 0, x1 * size, 0);
      hg.addColorStop(0, css(hair)); hg.addColorStop(0.5, css(hair)); hg.addColorStop(1, css(hair, 0));
      ctx.fillStyle = hg;
      ctx.fillRect(Math.min(x0, x1) * size, 0, 0.2 * size, Y(lm.eyeY + span * 0.7));
    }

    // back half: hair down to the nape, skin on the ears
    const napeY = lm.eyeY + span * 0.7;
    g = ctx.createLinearGradient(0, Y(napeY - 0.06), 0, Y(napeY + 0.02));
    g.addColorStop(0, css(hair)); g.addColorStop(1, css(hair, 0));
    ctx.fillStyle = css(hair);
    ctx.fillRect(size, 0, size, Y(napeY - 0.06));
    ctx.fillStyle = g;
    ctx.fillRect(size, Y(napeY - 0.06), size, Y(0.08));
    const ear = (cx, rx) => {
      const cy = Y(lm.eyeY + span * 0.25), ry = Y(span * 0.5);
      ctx.save(); ctx.translate(cx, cy); ctx.scale(rx / ry, 1);
      const rg = ctx.createRadialGradient(0, 0, ry * 0.55, 0, 0, ry);
      rg.addColorStop(0, css(skin)); rg.addColorStop(1, css(skin, 0));
      ctx.fillStyle = rg; ctx.fillRect(-ry, -ry, ry * 2, ry * 2);
      ctx.restore();
    };
    ear(size * 1.04, size * 0.1); ear(size * 1.96, size * 0.1); // back
    ear(0, size * 0.12); ear(size, size * 0.12);                 // front edges, so the seam matches

    if (front) ctx.drawImage(front, 0, 0, VW, VH, 0, 0, size, size);
    else drawDefaultFace(ctx, size, lm, this.mesh);
    return { canvas: out, skin: css(skin), hair: css(hair) };
  }
}

// thin-plate spline through control points src -> dst (2D), returns f(x, y) -> [x', y']
function thinPlate(src, dst) {
  const n = src.length, N = n + 3;
  const U = (r2) => (r2 < 1e-12 ? 0 : r2 * Math.log(r2) * 0.5);
  const A = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) A[i][j] = U((src[i][0] - src[j][0]) ** 2 + (src[i][1] - src[j][1]) ** 2);
    A[i][i] += 1e-6;
    A[i][n] = A[n][i] = 1; A[i][n + 1] = A[n + 1][i] = src[i][0]; A[i][n + 2] = A[n + 2][i] = src[i][1];
  }
  const solve = (b) => {
    const M = A.map((row, i) => [...row, b[i]]);
    for (let c = 0; c < N; c++) {
      let p = c; for (let r = c + 1; r < N; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      [M[c], M[p]] = [M[p], M[c]];
      for (let r = 0; r < N; r++) if (r !== c) { const k = M[r][c] / M[c][c]; for (let q = c; q <= N; q++) M[r][q] -= k * M[c][q]; }
    }
    return M.map((row, i) => row[N] / row[i]);
  };
  const wx = solve([...dst.map((d) => d[0]), 0, 0, 0]), wy = solve([...dst.map((d) => d[1]), 0, 0, 0]);
  return (x, y) => {
    let fx = wx[n] + wx[n + 1] * x + wx[n + 2] * y, fy = wy[n] + wy[n + 1] * x + wy[n + 2] * y;
    for (let i = 0; i < n; i++) { const u = U((x - src[i][0]) ** 2 + (y - src[i][1]) ** 2); fx += wx[i] * u; fy += wy[i] * u; }
    return [fx, fy];
  };
}

function luminance(c) { return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]; }
function parseHex(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

// a plain painted face for playing without a photo
function drawDefaultFace(ctx, size, lm, mesh) {
  const span = (lm.chinY - lm.eyeY) * size;
  const ey = lm.eyeY * size;
  ctx.save();
  for (const ex of [lm.eyeLX, lm.eyeRX]) {
    const x = ex * size;
    ctx.fillStyle = '#3b2a20';
    ctx.beginPath(); ctx.arc(x, ey, size * 0.018, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(x, ey, size * 0.009, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(58,42,34,0.85)'; ctx.lineWidth = size * 0.014; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - size * 0.06, ey - span * 0.16); ctx.quadraticCurveTo(x, ey - span * 0.23, x + size * 0.06, ey - span * 0.16); ctx.stroke();
  }
  // lips at the model's mouth
  const my = mesh ? mesh.pts[13][1] * size : ey + span * 0.62;
  ctx.strokeStyle = 'rgba(165,88,79,0.8)'; ctx.lineWidth = size * 0.012;
  ctx.beginPath(); ctx.moveTo(size * 0.44, my); ctx.quadraticCurveTo(size * 0.5, my + span * 0.03, size * 0.56, my); ctx.stroke();
  ctx.restore();
}
