# 09 — Recipes (8 runnable scenes)

Sources adapted from `packages/examples/src/scenes/*`, `packages/template/src/scenes/example.tsx`. Each is a complete `src/scenes/*.tsx` file. Register in `src/project.ts` with `?scene`.

## R1. Quickstart pop (starter)

```tsx
import {Circle, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();
  view.fill('#0b0b0f');
  view.add(<Circle ref={circle} size={320} fill="#e13238" />);
  yield* all(
    circle().scale(2, 1).to(1, 1),
    circle().fill('#e6a700', 1).to('#e13238', 1),
  );
  yield* waitFor(0.5);
});
```

## R2. Stagger grid entrance

```tsx
import {Rect, Layout, makeScene2D} from '@motion-canvas/2d';
import {all, sequence, makeRef, range, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rects: Rect[] = [];
  view.add(
    <Layout direction="row" gap={20} justifyContent="center" alignItems="center">
      {range(5).map(i => (
        <Rect ref={makeRef(rects, i)} width={140} height={140} radius={20} fill="#333" opacity={0} y={80} />
      ))}
    </Layout>,
  );
  yield* sequence(
    0.08,
    ...rects.map(r => all(r.opacity(1, 0.4), r.position.y(0, 0.5), r.fill('#e13238', 0.5))),
  );
  yield* waitFor(0.5);
});
```

## R3. Signal-driven counter + bar

```tsx
import {Rect, Txt, Layout, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const pct = createSignal(0);
  const bar = createRef<Rect>();
  view.add(
    <Layout direction="column" gap={24} alignItems="center" justifyContent="center">
      <Txt fontSize={72} fontWeight={700} fill="#fff" text={() => `${Math.round(pct() * 100)}%`} />
      <Rect width={600} height={32} radius={16} fill="#222">
        <Rect ref={bar} width={() => pct() * 600} height={32} radius={16} fill="#38e16a" />
      </Rect>
    </Layout>,
  );
  yield* all(pct(1, 2), bar().scale.x(1, 0.1));
  yield* waitFor(0.5);
});
```

## R4. Code reveal with selection

```tsx
import {Code, CODE, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';
import {parser} from '@lezer/javascript';
import {LezerHighlighter} from '@motion-canvas/2d';

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeScene2D(function* (view) {
  const code = createRef<Code>();
  view.add(
    <Code ref={code} fontSize={32} code={CODE`function add(a, b) {\n  return a + b;\n}`} />,
  );
  yield* waitFor(0.5);
  yield* code().selection(code().findAllRanges(/a/g), 0.6);
  yield* code().append('\n\nadd(2, 3); // 5', 0.8);
  yield* code().selection([], 0.4);
  yield* waitFor(0.5);
});
```

## R5. LaTeX morph

```tsx
import {Latex, makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const eq = createRef<Latex>();
  view.add(<Latex ref={eq} tex={['a^2', '+', 'b^2']} fill="#fff" fontSize={80} />);
  yield* waitFor(0.8);
  yield* eq().tex(['a^2', '-', 'b^2'], 1);
  yield* waitFor(0.5);
});
```

Note: `createRef<Latex>()` import from core; `tex()` tween morphs groups.

## R6. Line draw-on diagram

```tsx
import {Line, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const line = createRef<Line>();
  view.add(
    <>
      <Line ref={line} points={[[-400, 200], [-100, -100], [200, 150], [400, -50]]} stroke="#38e16a" lineWidth={8} endArrow arrowSize={20} end={0} />
      <Txt y={300} fontSize={40} fill="#aaa">Revenue trend</Txt>
    </>,
  );
  yield* line().end(1, 2);
  yield* waitFor(0.5);
});
```

## R7. Camera pan + zoom

```tsx
import {Camera, Rect, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const camera = createRef<Camera>();
  view.add(
    <Camera ref={camera}>
      <Rect x={-500} size={300} fill="#e13238" radius={24} />
      <Circle x={500} size={300} fill="#38e16a" />
    </Camera>,
  );
  yield* waitFor(0.5);
  yield* camera().centerOn([500, 0], 1);
  yield* camera().zoom(1.8, 0.8).to(1, 0.8);
  yield* camera().reset(1);
});
```

## R8. Slides presentation

```tsx
import {Txt, makeScene2D} from '@motion-canvas/2d';
import {beginSlide, createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const title = createRef<Txt>();
  view.add(<Txt ref={title} fontSize={96} fontWeight={800} fill="#fff">Slide 1</Txt>);
  yield* title().opacity(1, 0.5);
  yield* beginSlide('slide-1');
  yield* title().text('Slide 2', 0.5);
  yield* beginSlide('slide-2');
});
```

Render via `RENDER dropdown -> PRESENT`, navigate with SPACE.
