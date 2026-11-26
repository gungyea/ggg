// Photo editor: the player lines up their photo with the 3D head's eyes and chin,
// then we compose the face texture. Nothing ever leaves the browser.

const W = 500, ASPECT = 0.714, H = Math.round(W / ASPECT); // editor = physical aspect of the face box

export async function loadImageFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    // downscale huge phone photos so everything stays fast
    const max = 1400;
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export class PhotoEditor {
  constructor(canvas, landmarks) {
    this.canvas = canvas;
    canvas.width = W; canvas.height = H;
    this.ctx = canvas.getContext('2d');
    this.lm = landmarks;
    this.img = null;
    this.t = { x: W / 2, y: H / 2, s: 1, r: 0 };
    this.pointers = new Map();
    this.bind();
    this.draw();
  }

  setLandmarks(lm) { this.lm = lm; this.draw(); }

  setImage(img) {
    this.img = img;
    // first guess: photo's face roughly centred and filling the oval
    const lm = this.lm;
    const faceH = (lm.chinY - lm.eyeY) * 2.3 * H;
    this.t = { x: W / 2, y: H * ((lm.eyeY + lm.chinY) / 2 - 0.04), s: faceH / (img.height * 0.55), r: 0 };
    this.t.s = Math.max(this.t.s, (W * 0.9) / img.width);
    this.draw();
  }

  bind() {
    const c = this.canvas;
    const pos = (e) => {
      const r = c.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
    };
    c.addEventListener('pointerdown', (e) => {
      c.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, pos(e));
      this.gesture = null;
    });
    c.addEventListener('pointermove', (e) => {
      if (!this.pointers.has(e.pointerId) || !this.img) return;
      const prev = this.pointers.get(e.pointerId);
      const p = pos(e);
      if (this.pointers.size === 1) {
        this.t.x += p.x - prev.x; this.t.y += p.y - prev.y;
      } else if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.entries()].map(([id, v]) => (id === e.pointerId ? p : v));
        const [a0, b0] = [...this.pointers.values()];
        const d0 = Math.hypot(b0.x - a0.x, b0.y - a0.y), d1 = Math.hypot(b.x - a.x, b.y - a.y);
        const ang0 = Math.atan2(b0.y - a0.y, b0.x - a0.x), ang1 = Math.atan2(b.y - a.y, b.x - a.x);
        if (d0 > 5) this.t.s *= d1 / d0;
        this.t.r += ang1 - ang0;
        this.t.x += ((a.x + b.x) - (a0.x + b0.x)) / 2;
        this.t.y += ((a.y + b.y) - (a0.y + b0.y)) / 2;
      }
      this.pointers.set(e.pointerId, p);
      this.draw();
      this.onchange && this.onchange();
    });
    const up = (e) => { this.pointers.delete(e.pointerId); };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.t.s *= Math.exp(-e.deltaY * 0.0015);
      this.draw();
    }, { passive: false });
  }

  zoom(k) { this.t.s *= k; this.draw(); }
  rotate(a) { this.t.r += a; this.draw(); }

  drawPhoto(ctx) {
    if (!this.img) return;
    ctx.save();
    ctx.translate(this.t.x, this.t.y);
    ctx.rotate(this.t.r);
    ctx.scale(this.t.s, this.t.s);
    ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
    ctx.restore();
  }

  oval() {
    const lm = this.lm;
    const span = lm.chinY - lm.eyeY;
    const top = lm.eyeY - span * 1.25, bottom = lm.chinY + 0.015;
    return { cx: 0.5 * W, cy: (top + bottom) / 2 * H, rx: (lm.eyeRX - lm.eyeLX) * 1.0 * W, ry: (bottom - top) / 2 * H, top, bottom };
  }

  draw() {
    const ctx = this.ctx, lm = this.lm;
    ctx.fillStyle = '#1a1b1f';
    ctx.fillRect(0, 0, W, H);
    this.drawPhoto(ctx);
    const o = this.oval();
    // dim outside the face oval
    ctx.save();
    ctx.fillStyle = 'rgba(10,10,14,0.55)';
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.ellipse(o.cx, o.cy, o.rx, o.ry, 0, 0, Math.PI * 2);
    ctx.fill('evenodd');
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath(); ctx.ellipse(o.cx, o.cy, o.rx, o.ry, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    // eye targets + chin line
    ctx.strokeStyle = '#ffd34d'; ctx.fillStyle = '#ffd34d';
    ctx.lineWidth = 2;
    for (const ex of [lm.eyeLX, lm.eyeRX]) {
      ctx.beginPath(); ctx.arc(ex * W, lm.eyeY * H, 13, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(ex * W, lm.eyeY * H, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.beginPath(); ctx.moveTo(o.cx - 60, lm.chinY * H); ctx.lineTo(o.cx + 60, lm.chinY * H); ctx.stroke();
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('눈', lm.eyeRX * W + 20, lm.eyeY * H + 5);
    ctx.fillText('턱', o.cx + 66, lm.chinY * H + 5);
    ctx.restore();
  }

  // ------------------------------------------------------------ face texture
  /** returns { canvas, skin, hair }. hairOverride: css colour, 'bald', or null (auto) */
  compose(size = 1024, hairOverride = null) {
    const view = document.createElement('canvas');
    view.width = W; view.height = H;
    const vctx = view.getContext('2d', { willReadFrequently: true });
    this.drawPhoto(vctx);
    const lm = this.lm, o = this.oval();
    const span = lm.chinY - lm.eyeY;

    const sample = (fx, fy, r = 6) => {
      const x = Math.round(fx * W), y = Math.round(fy * H);
      const d = vctx.getImageData(Math.max(0, x - r), Math.max(0, y - r), r * 2, r * 2).data;
      let R = 0, G = 0, B = 0, n = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200) { R += d[i]; G += d[i + 1]; B += d[i + 2]; n++; }
      return n ? [R / n, G / n, B / n] : null;
    };
    const pts = [
      sample(lm.eyeLX, lm.eyeY + span * 0.38), sample(lm.eyeRX, lm.eyeY + span * 0.38),
      sample(0.5, lm.eyeY - span * 0.4), sample(lm.eyeLX + 0.03, lm.eyeY + span * 0.25), sample(lm.eyeRX - 0.03, lm.eyeY + span * 0.25),
    ].filter(Boolean);
    let skin = [214, 168, 140];
    if (pts.length >= 3) {
      // median per channel = robust to a stray shadow or glasses
      skin = [0, 1, 2].map((k) => pts.map((p) => p[k]).sort((a, b) => a - b)[Math.floor(pts.length / 2)]);
    }
    // hair: just inside the top of the oval is usually hair; must be darker than skin
    let hairS = null;
    for (const fx of [0.38, 0.5, 0.62]) for (let fy = o.top + 0.02; fy < lm.eyeY - span * 0.5; fy += 0.025) {
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

    // --- front half: hair above the brow line, fading out towards the eyes (temples)
    let g = ctx.createLinearGradient(0, 0, 0, Y(lm.eyeY));
    g.addColorStop(0, css(hair)); g.addColorStop(0.55, css(hair)); g.addColorStop(1, css(hair, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, Y(lm.eyeY));

    // --- back half: hair down to the nape, skin on the ears
    const napeY = lm.eyeY + span * 0.8;
    g = ctx.createLinearGradient(0, Y(napeY - 0.06), 0, Y(napeY + 0.02));
    g.addColorStop(0, css(hair)); g.addColorStop(1, css(hair, 0));
    ctx.fillStyle = css(hair);
    ctx.fillRect(size, 0, size, Y(napeY - 0.06));
    ctx.fillStyle = g;
    ctx.fillRect(size, Y(napeY - 0.06), size, Y(0.08));
    for (const ex of [0.04, 0.96]) {
      const cx = size + ex * size, cy = Y(lm.eyeY + span * 0.3), rx = size * 0.1, ry = Y(span * 0.55);
      ctx.save(); ctx.translate(cx, cy); ctx.scale(rx / ry, 1);
      const rg = ctx.createRadialGradient(0, 0, ry * 0.55, 0, 0, ry);
      rg.addColorStop(0, css(skin)); rg.addColorStop(1, css(skin, 0));
      ctx.fillStyle = rg; ctx.fillRect(-ry, -ry, ry * 2, ry * 2);
      ctx.restore();
    }
    // same ears on the front half's far edges so the seam matches
    for (const ex of [0.0, 1.0]) {
      const cx = ex * size, cy = Y(lm.eyeY + span * 0.3), rx = size * 0.12, ry = Y(span * 0.55);
      ctx.save(); ctx.translate(cx, cy); ctx.scale(rx / ry, 1);
      const rg = ctx.createRadialGradient(0, 0, ry * 0.55, 0, 0, ry);
      rg.addColorStop(0, css(skin)); rg.addColorStop(1, css(skin, 0));
      ctx.fillStyle = rg; ctx.fillRect(-ry, -ry, ry * 2, ry * 2);
      ctx.restore();
    }

    if (this.img) {
      // photo inside a feathered oval
      const m = document.createElement('canvas');
      m.width = W; m.height = H;
      const mc = m.getContext('2d');
      mc.drawImage(view, 0, 0);
      mc.globalCompositeOperation = 'destination-in';
      mc.save();
      mc.translate(o.cx, o.cy);
      mc.scale(o.rx / o.ry, 1);
      const rg = mc.createRadialGradient(0, 0, o.ry * 0.78, 0, 0, o.ry * 1.02);
      rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
      mc.fillStyle = rg;
      mc.fillRect(-o.ry * 2, -o.ry * 2, o.ry * 4, o.ry * 4);
      mc.restore();
      ctx.drawImage(m, 0, 0, W, H, 0, 0, size, size);
    } else {
      drawDefaultFace(ctx, size, lm);
    }
    return { canvas: out, skin: css(skin), hair: css(hair) };
  }
}

function luminance(c) { return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]; }
function parseHex(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

// a plain painted face for playing without a photo
function drawDefaultFace(ctx, size, lm) {
  const span = (lm.chinY - lm.eyeY) * size;
  const ey = lm.eyeY * size;
  ctx.save();
  for (const ex of [lm.eyeLX, lm.eyeRX]) {
    const x = ex * size;
    ctx.fillStyle = '#f4efe9';
    ctx.beginPath(); ctx.ellipse(x, ey, size * 0.05, span * 0.07, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3b2a20';
    ctx.beginPath(); ctx.arc(x, ey, size * 0.022, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(x, ey, size * 0.011, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3a2a22'; ctx.lineWidth = size * 0.012; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - size * 0.06, ey - span * 0.22); ctx.quadraticCurveTo(x, ey - span * 0.3, x + size * 0.06, ey - span * 0.22); ctx.stroke();
  }
  ctx.strokeStyle = '#a5584f'; ctx.lineWidth = size * 0.014;
  const my = ey + span * 0.68;
  ctx.beginPath(); ctx.moveTo(size * 0.42, my); ctx.quadraticCurveTo(size * 0.5, my + span * 0.06, size * 0.58, my); ctx.stroke();
  ctx.restore();
}
