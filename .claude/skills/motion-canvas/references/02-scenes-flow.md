# 02 — Scenes & Flow (generators)

Sources: `packages/docs/docs/getting-started/{flow.mdx,time-events.mdx,transitions.mdx,presentation.mdx}`, `packages/core/src/flow/{all,sequence,chain,loop,delay,any}.ts`, `packages/core/src/threading/{threads,spawn}.ts`, `packages/core/src/scenes/{Scene,GeneratorScene,Slides}.ts`, `packages/2d/src/lib/scenes/makeScene2D.ts`.

## 1. Scene shell

```tsx
import {makeScene2D, Rect} from '@motion-canvas/2d';
import {createRef, waitFor, waitUntil} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();
  view.add(<Rect ref={rect} size={320} radius={80} fill="#e13238" />);
  yield* waitUntil('rect');       // pause until timeline marker 'rect'
  yield* rect().scale(2, 1).to(1, 0.6);
  yield* waitFor(0.3);
});
```

- `makeScene2D(generator: (view: View2D) => ThreadGenerator)` returns scene description.
- `view` is `View2D` root (default 1920x1080). `view.add(node)`, `view.add([a, b])`, or `view.add(<>...</>)`.
- `view.add()` is sync; `yield view.add()` also allowed but idiomatic is sync + `yield*` animations after.
- Query: `view.findAll(...)`, `findFirst`, `findAncestor`, `is(Txt)` type guard. Mutate: `add/insert/remove/reparent/removeChildren/moveUp/Down/ToTop/ToBottom`.
- Always `function*`. `yield` = present one frame. `yield* task` = delegate to sub-generator / tween and wait for completion.

Custom generator functions:

```ts
import {ThreadGenerator} from '@motion-canvas/core';
import {Circle} from '@motion-canvas/2d';

function* flicker(circle: Circle): ThreadGenerator {
  circle.fill('red');
  yield; // one frame
  circle.fill('blue');
  yield;
  circle.fill('red');
  yield;
}

// in scene:
yield* flicker(myCircle());
```

## 2. Time: waitFor / waitUntil / slides

```ts
yield* waitFor(1);        // wait 1 second
yield* waitFor(0.6);
yield* waitUntil('label'); // pause until editor timeline marker 'label'
yield* waitUntil('part-2', 1); // optional timeout? prefer plain waitUntil('x')
```

- `waitUntil` markers appear in editor timeline, draggable, renameable. Use for voice-over sync points: `waitUntil('voice-intro-done')`.
- `useDuration('label')` returns duration helper for marker sections.
- Slides (presentations):

```ts
import {beginSlide} from '@motion-canvas/core';
yield* beginSlide('slide-1'); // pauses until SPACE / click in PRESENT mode
// ... animate slide 1 ...
yield* beginSlide('slide-2');
```

In editor: `RENDER dropdown -> PRESENT` gives slide panel + transport + fullscreen nav.

## 3. Parallel vs serial

Serial (default): successive `yield*` lines.

```ts
yield* rect().x(300, 1);
yield* rect().y(200, 1); // runs after x finishes
```

Parallel: `all()`.

```ts
import {all} from '@motion-canvas/core';
yield* all(
  rect().x(300, 1),
  rect().fill('#e6a700', 1),
);
```

Staggered serial with gap: `sequence()`.

```ts
import {sequence} from '@motion-canvas/core';
// 0.1s gap between each start:
yield* sequence(0.1, ...rects.map(r => r.fill('#e13238', 0.5)));
// no gap:
yield* sequence(...rects.map(r => r.scale(2, 0.5)));
```

Strict chain (one after other, same as serial but as single task): `chain()`.

```ts
import {chain} from '@motion-canvas/core';
yield* chain(rect().x(300, 1), rect().y(200, 1));
```

Delay start: `delay()`.

```ts
import {delay} from '@motion-canvas/core';
yield* all(
  delay(0.5, circle().scale(2, 0.5)),
  rect().opacity(1, 1),
);
```

Race (first to finish wins): `any()`.

```ts
import {any} from '@motion-canvas/core';
yield* any(rect().x(300, 2), circle().x(-300, 1)); // finishes when circle done
```

Loop:

```ts
import {loop} from '@motion-canvas/core';
yield* loop(3, function* () {
  yield* rect().x(300, 0.5).to(-300, 0.5);
});
// infinite with cancel:
import {spawn} from '@motion-canvas/core';
const task = yield loop(Infinity, function* () {
  yield* rect().rotation(90, 0.5);
});
// ... later:
cancel(task); // or task.cancel()
```

`loopFor(seconds, fn)` and `loopUntil(predicate, fn)` exist for time/condition loops.

Fork without waiting (concurrent fire-and-forget): `yield` without `*`, or `spawn()`.

```ts
// pattern A — fork all then wait:
for (const rect of rects) {
  yield rect.position.y(100, 1).to(-100, 2).to(0, 1); // NOTE: yield, not yield*
}
yield* waitFor(4);

// pattern B — collect then all:
const tasks = [];
for (const rect of rects) {
  tasks.push(rect.position.y(100, 1).to(-100, 2).to(0, 1));
}
yield* all(...tasks);

// pattern C — array map one-liner:
yield* all(...rects.map(r => r.position.y(100, 1).to(-100, 2).to(0, 1)));
```

Prefer C for AI-generated stagger grids.

## 4. Transitions between scenes

At the **start** of a scene file, after `view.add()`:

```ts
import {fadeTransition, slideTransition, zoomInTransition, zoomOutTransition} from '@motion-canvas/core';
yield* fadeTransition(0.6);
yield* slideTransition('left', 0.6); // Direction.Left also accepted
```

- `finishScene()` triggers next scene's transition early while current continues.
- Custom transition via `useTransition(inHook, outHook)` + `end()`.

## 5. Time events (editor-tweakable sections)

```ts
import {useTimeEvents} from '@motion-canvas/core';
// exposes named sections in timeline that editors can retime without code change
```

Use for client-editable pacing. See `time-events.mdx` for full API.

## 6. AI patterns

- Default to `all()` for 2-3 props on same node, successive `yield*` for story beats.
- Use `sequence(0.05, ...items.map(...))` for stagger entrances.
- Use `waitUntil('voice-<beat>')` markers whenever voice-over exists — lets human retime without code.
- Keep scenes 5-20s each; split long videos into multiple scene files, not one giant generator.
- End every scene with `yield* waitFor(0.5)` so last frame holds.
