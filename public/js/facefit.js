// Face landmark detection (MediaPipe, self-hosted) + piecewise-affine warp of the
// photo onto the 3D head's own landmark layout.

let landmarkerP = null;

export function loadLandmarker() {
  if (!landmarkerP) {
    landmarkerP = (async () => {
      const { FilesetResolver, FaceLandmarker } = await import('../vendor/mediapipe/vision_bundle.mjs');
      const base = new URL('../vendor/mediapipe/', import.meta.url).href;
      const fileset = await FilesetResolver.forVisionTasks(base + 'wasm');
      return FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: base + 'face_landmarker.task', delegate: 'CPU' },
        runningMode: 'IMAGE',
        numFaces: 1,
      });
    })();
    landmarkerP.catch(() => { landmarkerP = null; });
  }
  return landmarkerP;
}

/** returns 478 landmarks in image pixels, or null */
export async function detectFace(canvas) {
  const lm = await loadLandmarker();
  const res = lm.detect(canvas);
  if (!res.faceLandmarks || !res.faceLandmarks.length) return null;
  return res.faceLandmarks[0].map((p) => [p.x * canvas.width, p.y * canvas.height]);
}

// least-squares similarity transform src -> dst ([a,b,tx,ty]: x' = a x - b y + tx, y' = b x + a y + ty)
export function similarity(src, dst) {
  const n = src.length;
  let sx = 0, sy = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) { sx += src[i][0]; sy += src[i][1]; dx += dst[i][0]; dy += dst[i][1]; }
  sx /= n; sy /= n; dx /= n; dy /= n;
  let num1 = 0, num2 = 0, den = 0;
  for (let i = 0; i < n; i++) {
    const x = src[i][0] - sx, y = src[i][1] - sy, u = dst[i][0] - dx, v = dst[i][1] - dy;
    num1 += x * u + y * v; num2 += x * v - y * u; den += x * x + y * y;
  }
  const a = num1 / den, b = num2 / den;
  return [a, b, dx - (a * sx - b * sy), dy - (b * sx + a * sy)];
}

export const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377,
  152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

/**
 * Warp `img` so its landmarks `src` (px) land on `dst` (px in ctx space), triangle by triangle.
 */
export function warpTriangles(ctx, img, src, dst, tris) {
  for (const [i, j, k] of tris) {
    const s0 = src[i], s1 = src[j], s2 = src[k];
    let d0 = dst[i], d1 = dst[j], d2 = dst[k];
    // grow each destination triangle ~0.6px so neighbours overlap (no hairline seams)
    const cx = (d0[0] + d1[0] + d2[0]) / 3, cy = (d0[1] + d1[1] + d2[1]) / 3;
    const grow = (p) => { const vx = p[0] - cx, vy = p[1] - cy, l = Math.hypot(vx, vy) || 1; return [p[0] + vx / l * 0.6, p[1] + vy / l * 0.6]; };
    const g0 = grow(d0), g1 = grow(d1), g2 = grow(d2);
    // affine: src -> dst
    const den = (s1[0] - s0[0]) * (s2[1] - s0[1]) - (s2[0] - s0[0]) * (s1[1] - s0[1]);
    if (Math.abs(den) < 1e-6) continue;
    const a = ((d1[0] - d0[0]) * (s2[1] - s0[1]) - (d2[0] - d0[0]) * (s1[1] - s0[1])) / den;
    const c = ((d2[0] - d0[0]) * (s1[0] - s0[0]) - (d1[0] - d0[0]) * (s2[0] - s0[0])) / den;
    const b = ((d1[1] - d0[1]) * (s2[1] - s0[1]) - (d2[1] - d0[1]) * (s1[1] - s0[1])) / den;
    const d = ((d2[1] - d0[1]) * (s1[0] - s0[0]) - (d1[1] - d0[1]) * (s2[0] - s0[0])) / den;
    const e = d0[0] - a * s0[0] - c * s0[1];
    const f = d0[1] - b * s0[0] - d * s0[1];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(g0[0], g0[1]); ctx.lineTo(g1[0], g1[1]); ctx.lineTo(g2[0], g2[1]);
    ctx.closePath();
    ctx.clip();
    ctx.transform(a, b, c, d, e, f);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  }
}

/** soft-edged mask of a polygon (feather = fraction of size), drawn without ctx.filter (Safari) */
export function featherPolygon(ctx, pts, feather, steps = 14) {
  let cx = 0, cy = 0;
  for (const p of pts) { cx += p[0]; cy += p[1]; }
  cx /= pts.length; cy /= pts.length;
  ctx.save();
  // additive alpha: the inside sums to exactly 1, the rim ramps linearly to 0
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = `rgba(0,0,0,${1 / steps})`;
  for (let s = 0; s < steps; s++) {
    const k = 1 - feather * (s / (steps - 1));
    ctx.beginPath();
    pts.forEach((p, i) => {
      const x = cx + (p[0] - cx) * k, y = cy + (p[1] - cy) * k;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}
