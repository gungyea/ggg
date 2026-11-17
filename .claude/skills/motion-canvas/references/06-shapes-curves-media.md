# 06 — Shapes, Curves & Media (Img/Video)

Sources: `packages/docs/docs/components/{bezier.mdx,path.mdx,spline.mdx}`, `packages/docs/docs/getting-started/{media.mdx,effects.mdx}`, `packages/docs/docs/advanced/filters-and-effects.mdx`, `packages/2d/src/lib/components/{Line,Bezier,Curve,Spline,Path,Polygon,SVG,Icon,Grid,Img,Video}.ts`.

## 1. Primitives

```tsx
import {Rect, Circle, Polygon, Line} from '@motion-canvas/2d';

<Rect size={[400, 200]} radius={20} fill="#e13238" stroke="#fff" lineWidth={4} />
<Circle size={240} fill="#38e16a" />
<Polygon sides={6} size={240} fill="#e6a700" rotation={30} />
<Line points={[[-200, 0], [0, -100], [200, 0]]} stroke="#fff" lineWidth={6} radius={12} endArrow arrowSize={16} />
```

Draw-on animation:

```ts
yield* line().end(0, 0.6).to(1, 1); // grow from start
yield* line().start(0, 0.5).to(0.5, 0.5); // trim head
```

## 2. Bezier / Curve / Spline / Path / SVG

```tsx
import {CubicBezier, QuadBezier, Spline, Path, Knot} from '@motion-canvas/2d';

// explicit control points:
<QuadBezier p0={[-200, 100]} p1={[0, -200]} p2={[200, 100]} stroke="#fff" lineWidth={6} />
<CubicBezier p0={[-200,0]} p1={[-100,-200]} p2={[100,200]} p3={[200,0]} stroke="#e13238" lineWidth={8} />

// smooth through points:
<Spline points={[[-200,0], [-50,-150], [100,50], [250,-50]]} stroke="#38e16a" lineWidth={6} />
// with explicit knots (handles):
<Spline knots={[new Knot([-200,0]), new Knot([200,0])]} stroke="#fff" lineWidth={6} />

// SVG path data:
<Path data="M -200 0 L 0 -100 L 200 0 Z" stroke="#e6a700" lineWidth={6} fill="rgba(230,167,0,0.2)" />
```

- All curves share `CurveProps`: `start/end (0..1)`, `startOffset/endOffset`, `startArrow/endArrow`, `arrowSize`, `closed`.
- `Spline` interpolates smoothly; `Path` takes raw SVG `d`.
- `SVG` node loads external `.svg` file; `Icon` renders Material Symbols by name; `Grid` draws graph-paper background.
- Camera `followCurve(curve, dur)` accepts any `Curve` (need not be in scene).

Graph-axes recipe: `Grid` + two `Line` axes + `Spline` data line + `Txt` labels in `Layout`.

## 3. Img

```tsx
import {Img} from '@motion-canvas/2d';
import logo from '../../public/logo.png';

view.add(<Img src={logo} size={[400, 400]} radius={24} />);
```

- `Img extends Rect`: `src: string | null`, `alpha` (image-only opacity, not fill/children), `smoothing` (false = pixelated).
- No `size` -> `desiredSize` = natural image size.
- `getColorAtPoint()`, `radius` rounding, pooled loading with `?asset-hash`, HMR via `motion-canvas:assets`.
- Remote images need `proxy: true` in vite config or CORS headers; prefer local `public/`.

## 4. Video

```tsx
import {Video} from '@motion-canvas/2d';
import clip from '../../public/clip.mp4';

export default makeScene2D(function* (view) {
  const vid = createRef<Video>();
  view.add(<Video ref={vid} src={clip} size={[1280, 720]} radius={24} />);
  vid().play();
  yield* vid().scale(1.2, 1);
  yield* waitFor(3);
  vid().pause();
});
```

- `Video extends Rect`: same `src/alpha/smoothing` + `loop=false`, `playbackRate=1`, `time`, `play: boolean`.
- Control: `play()`, `pause()`, `isPlaying()`, `getCurrentTime()`, `getDuration()`, `completion = time/duration`, `curveCompletion()`.
- `playbackRate` is **not reactive** — set once, do not tween.
- Video audio is mixed on FFmpeg export when `Include audio` is ON.
- `desiredSize` = `videoWidth/Height` if no `size`.

## 5. Visual filters & effects

```tsx
import {blur, brightness, contrast, saturate} from '@motion-canvas/2d';
// declarative:
<Rect filters={[blur(8), brightness(1.2)]} />
// imperative (auto-creates filter if missing):
yield* node().filters.blur(0, 0.5).to(12, 0.5);
```

- Order matters. Filters auto-enable `cache`; manual `compositeOperation` (`source-in`, `destination-out`, etc.) needs explicit ancestor `cache={true}` + `cachePadding`.
- Signal effects (`createEffect/createDeferredEffect`) are reactivity helpers, not visual — don't confuse.

## 6. AI rules

- Diagrams: `Line` + `endArrow` for arrows, `Spline` for graphs, `Path` for custom icons.
- Always set `lineWidth` >= 4 at 1080p, `arrowSize` 12-20.
- Images/video: keep under `public/`, import relatively, set explicit `size` to avoid layout jump.
- Animate `end()` for draw-on reveals, `opacity/scale` for entrances — never animate `points` array directly (tween each point signal if morphing).
