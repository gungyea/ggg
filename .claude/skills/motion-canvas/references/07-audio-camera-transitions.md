# 07 — Audio, Camera & Transitions

Sources: `packages/docs/docs/getting-started/{media.mdx,camera.mdx,transitions.mdx,presentation.mdx}`, `packages/core/src/scenes/Sounds.ts`, `packages/core/src/app/Project.ts`, `packages/core/src/transitions/*`, `packages/2d/src/lib/components/Camera.ts`.

## 1. Audio — global track

```ts
import {makeProject} from '@motion-canvas/core';
import music from './audio/bg-music.mp3';

export default makeProject({
  scenes: [...],
  audio: music, // single global bg track (URL or import)
});
```

- Set sync offset in editor Video Settings -> `Audio offset (sec)` or `SHIFT+drag` timeline. `audioOffset` in code is deprecated.
- Container/codec support follows browser MDN (mp3/wav/ogg). `bufferedAssets: /\.(wav|ogg)$/` controls streaming.
- FFmpeg export includes global audio only when exporter `Include audio` is ON.

## 2. Audio — per-scene SFX

```ts
import {sound} from '@motion-canvas/core';
import pop from './audio/pop.mp3';

export default makeScene2D(function* (view) {
  // ...
  sound(pop).trim(0, 2).gain(-3).playbackRate(1.2).play(0.5);
  // trim(start, dur?) | gain(db) | playbackRate(n) | play(delaySec?)
  yield* waitFor(1);
});
```

- `sound(file)` from `core/scenes/Sounds.ts`. Chainable, plays immediately on `play()`.
- Voice-over sync pattern: place `waitUntil('vo-beat-1')` markers, align SFX just before marker, retime in editor without code change.

## 3. Camera

Wrap scene content. Pass-through until animated.

```tsx
import {Camera} from '@motion-canvas/2d';

export default makeScene2D(function* (view) {
  const camera = createRef<Camera>();
  view.add(
    <Camera ref={camera}>
      <Rect size={400} fill="#e13238" />
      <Circle x={600} size={200} fill="#38e16a" />
    </Camera>,
  );

  yield* camera().centerOn([600, 0], 1); // pan to circle
  yield* camera().zoom(2, 1).to(1, 1);   // punch in then out
  yield* camera().rotation(15, 1);
  yield* camera().reset(1);              // pos [0,0], zoom 1, rot 0
});
```

Rules:

- `position([x,y], dur)` pans raw; `centerOn(node | worldPos, dur)` pans to target (prefer).
- `zoom(n, dur)` chainable `.to()`. **Never touch `scale`.**
- `rotation(deg, dur)` orbits current center.
- `followCurve(curve, dur, easing)` glides along any `Curve` (e.g. `new QuadBezier(...)` + `linear`); curve need not be in scene.
- Press `0` in editor to refocus camera.

Multi-view (split-screen, same scene synced):

```tsx
const content = (
  <Node>
    <Rect size={300} fill="red" />
  </Node>
); // MUST be single Node, not <>

view.add(
  <>
    <Camera.Stage cameraRef={camA} scene={content} size={[960, 1080]} position={[-480, 0]} fill="#111" />
    <Camera.Stage cameraRef={camB} scene={content} size={[960, 1080]} position={[480, 0]} fill="#111" />
  </>,
);
yield* camA().zoom(2, 1); // independent per view
```

## 4. Transitions (between scenes)

Call at **start** of incoming scene, after `view.add()`:

```ts
import {fadeTransition, slideTransition, zoomInTransition, zoomOutTransition, waitTransition} from '@motion-canvas/core';

yield* fadeTransition(0.6);
yield* slideTransition('left', 0.6);
yield* zoomInTransition(0.6);
yield* zoomOutTransition(0.6);
yield* waitTransition(); // no visual, just wait
```

- `finishScene()` in outgoing scene triggers next transition early while current generator keeps running.
- Custom: `const end = useTransition(inCtx => ..., outCtx => ...); yield* all(...); end();`

## 5. AI recipes

- Establishing shot: `zoom(2).to(1)` + `centerOn(hero)` over 1.5s.
- Voice-over pan: `waitUntil('vo-next')` then `centerOn(nextDiagram, 0.8)`.
- Punch-in emphasis: `zoom(1.5, 0.3).to(1, 0.3)` around key number.
- Scene change: `fadeTransition(0.4)` default; `slideTransition` for sequential steps, `zoomIn` for detail dives.
