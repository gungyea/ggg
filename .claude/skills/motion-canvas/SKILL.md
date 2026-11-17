---
name: motion-canvas
description: Programmatic vector animation with Motion Canvas (TypeScript + generators). Use when scaffolding a Motion Canvas project, writing makeScene2D scenes, animating 2D nodes (Rect, Circle, Txt, Code, Latex, Img, Video, Layout, Camera), composing flow with yield*, wiring signals and tweening, syncing audio/voice-over, or rendering to MP4 via FFmpeg. Covers project bootstrap, scene patterns, signals, refs, layout, text/code/latex, shapes, media, camera, transitions, rendering and troubleshooting.
license: MIT
compatibility: node >= 18, vite ^4, typescript ^5, @motion-canvas/core ^3, @motion-canvas/2d ^3, @motion-canvas/ffmpeg
metadata:
  author: motion-canvas-skill
  version: "3.17"
  scope: 2d-animation
  platforms: [claude-code, cursor, antigravity, zed, opencode, windsurf, copilot, skills.sh]
---

# Motion Canvas Skill

Motion Canvas is two things:

1. A **TypeScript library** that programs animations with **generator functions** (`function*` + `yield*`).
2. An **editor** (Vite + `localhost:9000`) that gives real-time preview, timeline, and Render/export.

It is purpose-built for **informative vector animations**: explainer videos, code visualizations, math animations, product demos synced to voice-over. It is **not** a non-linear video editor.

This skill works identically in Claude Code, Cursor, Antigravity, Zed, Opencode, Windsurf, Copilot, and any `SKILL.md`-compatible agent. Copy this whole folder to your agent's skill dir, e.g. `~/.claude/skills/motion-canvas`, `.cursor/skills/motion-canvas`, `.agents/skills/motion-canvas`, `.opencode/skills/motion-canvas`.

## When to use / when NOT to use

Use when the user asks to:

- `create / scaffold / init` a Motion Canvas video project
- `animate / make a scene` with `makeScene2D`, shapes, text, code, latex, diagrams
- `tween / move / fade / stagger / spring` anything over time
- `visualize code / algorithm / math formula` with `Code` or `Latex`
- `add image / video / audio / voice-over` to a scene
- `pan / zoom camera`, add `transitions` between scenes, make `slides / presentation`
- `render / export mp4 / png sequence / still frame`

Do NOT use for: Premiere-style timeline splicing, webcam editing, DOM web apps, Three.js 3D scenes, Manim Python scenes. If asked for Manim, say so and stop.

## Golden rules (read this before writing any code)

1. **Every scene is a generator.** `export default makeScene2D(function* (view) { ... })`. Plain `function` never animates.
2. **Every animation must be `yield*`-ed.** `yield* rect().scale(2, 1)` plays. `rect().scale(2, 1)` without `yield*` only schedules and is skipped. `yield` (no star) = wait exactly one frame.
3. **Scene imports need `?scene`.** `import example from './scenes/example?scene'` then `makeProject({scenes: [example]})`. Without `?scene` HMR/meta breaks.
4. **Animate via refs, never by re-creating JSX.** `const r = createRef<Rect>(); view.add(<Rect ref={r} .../>); yield* r().opacity(0, 1).to(1, 1)`.
5. **Parallel = `all()`, serial = successive `yield*` / `sequence()`.** `yield* all(a().x(100,1), b().fill('red',1))` runs together. Two `yield*` lines run one-after-other.
6. **Props are signals.** Any prop accepts `value | (() => value)`. Use `() =>` for live binding: `<Circle width={() => radius() * 200} />`.
7. **Background is `view.fill()`, not CSS.** Static default comes from Video Settings, but per-scene animated bg is `view.fill('#0a0a0a'); yield* view.fill('#111111', 1)`.
8. **Origin is scene-center.** `x: 0, y: 0` = center. `+x` right, `+y` down. Parent-relative.
9. **Never use React hooks.** No `useState/useEffect`. Custom JSX runtime only — `new Circle({})` under the hood. Use `createSignal/createRef/createEffect` from `@motion-canvas/core`.
10. **Never touch `Camera.scale`.** Use `camera().zoom(n, dur)`, `centerOn()`, `reset()`. Never animate `Video.playbackRate` reactively.

If you violate 1-4, output is a frozen frame. Always re-check.

## Bootstrap (new project)

```bash
npm create motion-canvas@latest
# prompts: name, path, language: TS (choose TS), plugins: keep ffmpeg ON
cd <name>
npm install
npm start
# editor at http://localhost:9000
```

Resulting layout (see `references/01-bootstrap-project.md` + `assets/`):

```
my-video/
  vite.config.ts        # motionCanvas() + ffmpeg() plugins
  tsconfig.json
  src/
    project.ts          # makeProject({scenes: [...]})
    motion-canvas.d.ts
    scenes/
      example.tsx       # makeScene2D scene
  public/
  output/               # renders go here (gitignored)
```

`vite.config.ts` (copy from `assets/vite.config.ts.txt`):

```ts
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [motionCanvas(), ffmpeg()],
});
```

`src/project.ts` (copy from `assets/project.ts.txt`):

```ts
import {makeProject} from '@motion-canvas/core';
import example from './scenes/example?scene';

export default makeProject({
  scenes: [example],
});
```

`npm start` = `vite` dev + editor. `npm run build` = `tsc && vite build`.

> For full options (`project: string|string[]`, `output`, `bufferedAssets`, `editor`, `proxy`, `audio`, `variables`, `experimentalFeatures`): read `references/01-bootstrap-project.md`.

## Minimal working scene (copy-paste starter)

From `assets/example-scene.tsx`:

```tsx
import {Rect, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();

  view.fill('#0b0b0f'); // animatable background
  view.add(<Rect ref={rect} size={320} radius={80} fill={'#e13238'} />);

  yield* all(
    rect().scale(2, 1).to(1, 1),
    rect().fill('#e6a700', 1).to('#e13238', 1),
  );
  yield* waitFor(0.5);
});
```

Scene anatomy:

```tsx
import {Circle, Rect, Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, sequence, chain, loop, delay, waitFor, waitUntil, createRef, createSignal} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const ref = createRef<Rect>();
  view.add(<Rect ref={ref} size={200} fill="#e13238" />);
  yield* waitUntil('start');   // editable marker in editor timeline
  yield* ref().scale(2, 0.6).to(1, 0.6);
  yield* all(ref().x(300, 1), ref().rotation(90, 1));
  yield* waitFor(1);
});
```

## Cheat-sheet (imports + one-liners)

```ts
// flow
import {all, any, chain, sequence, loop, delay, spawn, waitFor, waitUntil, useDuration, beginSlide} from '@motion-canvas/core';
yield* waitFor(1);                 // wait 1s
yield* waitUntil('label');         // wait for timeline marker
yield* all(a().x(100,1), b().y(50,1)); // parallel
yield* sequence(0.1, ...rects.map(r => r.fill('red', 0.5))); // staggered serial with 0.1 gap
yield* chain(a().x(100,1), a().y(100,1)); // serial on same thread
yield* loop(3, function*(){ yield* a().x(100,0.5).to(-100,0.5); }); // repeat
yield* delay(0.5, a().opacity(1, 0.5)); // delayed start
```

```ts
// signals + refs + tweening
import {createSignal, createComputed, createEffect, createRef, makeRef, createRefArray, createRefMap, tween, map, easeInOutCubic, easeOutQuad, linear, spring, PlopSpring, SmoothSpring, DEFAULT, range} from '@motion-canvas/core';
const r = createSignal(3);
const area = createSignal(() => Math.PI * r() * r()); // computed
r(4);                    // set
yield* r(10, 1);         // tween to 10 over 1s
yield* r(4, 1).to(3, 1); // chained tween
yield* r(DEFAULT, 1);    // reset to initial
<Circle width={() => r() * 100} /> // reactive binding
yield* tween(1, v => circle().x(map(-300, 300, easeInOutCubic(v))));
yield* circle().position([300, -200], 1, easeInOutCubic);
yield* spring(PlopSpring, -400, 400, 1);
circle().save(); yield* circle().x(300, 1); yield* circle().restore(1);
```

```tsx
// nodes (all props accept SignalValue = T | (() => T))
import {Node, View2D, Camera, Rect, Circle, Polygon, Line, Bezier, Spline, Path, Txt, Code, Latex, Img, Video, SVG, Icon, Grid, Layout} from '@motion-canvas/2d';
<Rect size={[400,200]} radius={20} fill="#e13238" stroke="#fff" lineWidth={4} />
<Circle size={320} fill="lightseagreen" />
<Layout direction="row" gap={40} padding={40} alignItems="center"><Rect size={100} fill="red" /><Rect size={100} fill="blue" /></Layout>
<Txt fontSize={64} fontWeight={700} fill="#fff">Hello</Txt>
<Line points={[[ -200,0],[0,-100],[200,0]]} stroke="#fff" lineWidth={6} endArrow />
```

For full prop tables, Code selection API, Latex groups, Img/Video, Camera, transitions: read the matching reference below. Do not guess props.

## Router — read only what you need

| Task | Read |
|---|---|
| Scaffold, `project.ts`, `vite.config`, multi-project, audio global, variables | `references/01-bootstrap-project.md` |
| Scene shell, `view.add`, `all/sequence/chain/loop/delay/spawn`, `waitFor/waitUntil/slides` | `references/02-scenes-flow.md` |
| `createSignal/computed/effect`, 6 ref patterns, `tween/map/ease/spring/save-restore` | `references/03-signals-refs-tweening.md` |
| Yoga layout, sizing, positioning, origin, world transforms | `references/04-layout-positioning.md` |
| `Txt`, `Code` + `selection/word/lines/find*`, `CODE` tag, `LezerHighlighter`, `Latex {{}}` | `references/05-text-code-latex.md` |
| `Line/Bezier/Spline/Path/SVG/Icon/Grid`, `Img/Video` play/pause | `references/06-shapes-curves-media.md` |
| Global audio, `sound().trim/gain`, `Camera centerOn/zoom/followCurve/Stage`, transitions | `references/07-audio-camera-transitions.md` |
| Video Settings, FFmpeg vs PNG sequence, `output/`, stills, PRESENT mode | `references/08-render-export.md` |
| 8 runnable recipes (stagger grid, signal-driven, code reveal, latex morph, camera pan...) | `references/09-recipes.md` |
| 15 pitfalls (frozen frame, `?scene`, React hooks, Camera scale...) | `references/10-troubleshooting.md` |

Rule: for any non-trivial video, read at least `02 + 03 + 09` before coding.

## Rendering (editor + FFmpeg)

1. `npm start` -> select project/scenes in left panel.
2. Video Settings (right panel): `Background, Range, Resolution (e.g. 1920x1080), FPS (30/60), Scale, ColorSpace (sRGB), Audio offset, Exporter`.
3. Exporter: `Video (FFmpeg)` for `.mp4` (needs `npm i @motion-canvas/ffmpeg` + `ffmpeg()` in vite plugins — default ON in bootstrap). `Image sequence` for `PNG/JPEG/WebP` frames.
4. Press `RENDER` -> `output/<project>/<project>.mp4`. `ABORT` cancels. Camera icon = still to `output/still/`.
5. Slides: `RENDER dropdown -> PRESENT` for `beginSlide()` navigation.

Details: `references/08-render-export.md`.

## Validation before you finish

- Run `node scripts/check-scene.mjs src/scenes/*.tsx` — must pass (catches missing `yield*`, missing `?scene`, `useState`, `Camera.scale`).
- Every scene file default-exports `makeScene2D(function* (view){...})` and every tween/flow is `yield*`-ed.
- `src/project.ts` imports scenes with `?scene` and lists them in `makeProject({scenes})`.
- `vite.config.ts` has both `motionCanvas()` and `ffmpeg()`.
- If you added audio, `makeProject({audio})` path exists and `Include audio` is ON in exporter.

## Sources

Distilled from Motion Canvas `v3.17` monorepo: `packages/docs/docs/{getting-started,components,advanced,migration}`, `packages/core/src/{app,flow,signals,tweening,scenes,threading,transitions}`, `packages/2d/src/lib/{components,scenes}`, `packages/{template,create/template-2d-ts,examples,vite-plugin,ffmpeg}`. See each reference header for exact source paths.
