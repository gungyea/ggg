# 03 — Signals, Refs & Tweening

Sources: `packages/docs/docs/getting-started/{signals.mdx,tweening.mdx,references.mdx}`, `packages/core/src/signals/*`, `packages/core/src/tweening/*`, `packages/core/src/utils/createRef.ts`, `packages/examples/src/scenes/node-signal.tsx`.

## 1. Signals — the reactive primitive

Every node prop **is** a signal. `createSignal` creates standalone ones.

```ts
import {createSignal, DEFAULT} from '@motion-canvas/core';

const count = createSignal(0);
const radius = createSignal(3);

// 1. get (0 args):
const v = radius(); // 3

// 2. set (1 arg, sync, no animation):
radius(4);

// 3. tween (value + duration [+ ease], returns ThreadGenerator — must yield*):
yield* radius(10, 1);
yield* radius(4, 1).to(3, 1); // chained .to()
yield* radius(DEFAULT, 1);    // reset to initial (3)
```

Complex-type signals:

```ts
import {Vector2} from '@motion-canvas/core';
const pos = Vector2.createSignal([100, 200]);
const pos2 = Vector2.createSignal(Vector2.up);
```

Grabbing a prop signal from a node:

```tsx
const circle = <Circle />;
const fillSignal = circle.fill; // Signal<Color>
```

### Computed (derived) signals

Overload: `createSignal(() => ...)` = lazy + cached + auto-tracked.

```ts
const radius = createSignal(1);
const area = createSignal(() => Math.PI * radius() * radius());
area(); // computed on demand, cached until radius changes

const debug = createSignal(() => {
  console.log('recalculated');
  return radius() * 2;
});
```

- Only recalculates when a dependency (`radius()`) changes and someone reads `area()`.
- Prefer this over `createComputed` (both exist; `createSignal(fn)` is canonical in docs).

### Effects

```ts
import {createEffect, createDeferredEffect} from '@motion-canvas/core';
const stop = createEffect(() => {
  console.log('radius is', radius());
  // re-runs whenever radius() changes
});
stop(); // unsubscribe
// createDeferredEffect: same but coalesced to end-of-frame (better for layout writes)
```

Prefer passing `() =>` directly as prop (see §3) over manual effects.

## 2. Reactive props (SignalValue)

Every prop type is `SignalValue<T> = T | Signal<T> | (() => T)`.

```tsx
const radius = createSignal(3);

// static:
<Circle width={200} />
// live binding — updates whenever radius changes, no manual tween needed:
<Circle width={() => radius() * 200} />
<Txt text={() => `r = ${radius().toFixed(2)}`} x={() => radius() * 50} />
<Rect rotation={() => spin() * speed()} />
```

This is how you sync labels, counters, positions to one driver signal.

## 3. Refs — grabbing node instances

Raw variable (JSX creates instance immediately, valid but not preferred for animation):

```tsx
const circle = <Circle />;
view.add(circle);
yield* circle.scale(2, 0.3);
```

Callback ref:

```tsx
let circle: Circle;
view.add(<Circle ref={instance => { circle = instance; }} />);
```

`createRef` (preferred single):

```tsx
import {createRef} from '@motion-canvas/core';
const circle = createRef<Circle>();
view.add(<Circle ref={circle} />);
yield* circle().scale(2, 0.3); // call () to deref
```

`makeRef(obj, key)` — store into object/array slot:

```tsx
import {makeRef, range} from '@motion-canvas/core';
const state = {circle: null as Circle | null};
view.add(<Circle ref={makeRef(state, 'circle')} />);

const rects: Rect[] = [];
view.add(
  range(5).map(i => (
    <Rect ref={makeRef(rects, i)} width={100} height={100} x={-250 + 125 * i} fill="#88C0D0" radius={10} />
  )),
);
```

`createRefArray` — auto-append in loops:

```tsx
import {createRefArray, range} from '@motion-canvas/core';
const circles = createRefArray<Circle>();
view.add(<Layout>{range(10).map(() => <Circle ref={circles} />)}</Layout>);
// circles[i] available
```

`createRefMap` + `mapRefs`:

```tsx
import {createRefMap, all} from '@motion-canvas/core';
const labels = createRefMap<Txt>();
view.add(<><Txt ref={labels.a}>A</Txt><Txt ref={labels.b}>B</Txt></>);
yield* labels.a().text('A changes', 0.3);
if ('d' in labels) {
  yield* labels.d().text('D changes', 0.3); // `in` avoids auto-creating missing key
}
yield* all(...labels.mapRefs(l => l.fill('white', 0.3)));
```

`makeRefs` for typed custom components:

```tsx
import {makeRef, makeRefs} from '@motion-canvas/core';
function Label({refs, children}: {refs: {rect: Rect; text: Txt}; children: string}) {
  return (
    <Rect ref={makeRef(refs, 'rect')}>
      <Txt ref={makeRef(refs, 'text')}>{children}</Txt>
    </Rect>
  );
}
const label = makeRefs<typeof Label>();
view.add(<Label refs={label}>HELLO</Label>);
yield* label.rect.opacity(1, 0.3);
```

Rule: single animated node -> `createRef`. Grids/lists -> `makeRef` array or `createRefArray`. Named set -> `createRefMap`.

## 4. Tweening

### Low-level tween()

```ts
import {tween, map, easeInOutCubic} from '@motion-canvas/core';
yield* tween(2, value => {
  // value: 0 -> 1 over 2s
  circle().position.x(map(-300, 300, easeInOutCubic(value)));
});
```

### Shorthand: signal tween

```ts
yield* circle().x(300, 1); // (to, duration) — from = current, ease = easeInOutCubic default
yield* circle().x(300, 1).to(-300, 1); // chain
yield* circle().fill('#e13238', 1, easeOutQuad); // 3rd arg = easing
yield* circle().position([300, -200], 2, easeInOutCubic, Vector2.arcLerp); // 4th = interpolator
```

Equivalent long form for colors/vectors:

```ts
import {Color, Vector2} from '@motion-canvas/core';
yield* tween(2, value => {
  circle().fill(Color.lerp(new Color('#e6a700'), new Color('#e13238'), easeInOutCubic(value)));
});
```

### Easing + interpolation

```ts
import {easeInOutCubic, easeOutQuad, easeInOutQuad, easeOutExpo, linear, map} from '@motion-canvas/core';
map(-300, 300, easeInOutCubic(value));
// shortcut — easing fns accept (value, from, to):
easeInOutCubic(value, -300, 300);
```

- Timing fn: `(t: 0->1) => 0->1`. Write custom as plain JS fn.
- Numbers: `map(from, to, t)`. Colors/vectors: `Color.lerp(a, b, t)`, `Vector2.lerp / arcLerp`, all complex types expose static `lerp`.
- Default ease everywhere is `easeInOutCubic`.

### Springs (physics)

```ts
import {spring, PlopSpring, SmoothSpring} from '@motion-canvas/core';
yield* spring(PlopSpring, -400, 400, 1); // (desc, from, to, settleTolerance)
const MySpring = {mass: 0.04, stiffness: 10, damping: 0.7, initialVelocity: 8};
yield* circle().x(300, 1); // springs usually wrap tween() internally; use preset for pop
```

Finishes only when settled within tolerance (e.g. `1` = 1px). Use `PlopSpring` for playful pop, `SmoothSpring` for gentle settle.

### save / restore (state stack)

```ts
circle().save();
yield* circle().position([300, -200], 2);
yield* circle().restore(1); // (duration?, easing?) — tween back to saved
yield* circle().restore(1, linear);
// multiple save() push stack; restore() pops most recent; no-op if empty
```

Use for hover/spotlight excursions that must return exactly.

## 5. Common AI recipes

```ts
// stagger entrance:
yield* sequence(0.05, ...cards.map(c => c.opacity(1, 0.4).to(1, 0)));

// counter synced to bar:
const pct = createSignal(0);
view.add(<Txt text={() => `${Math.round(pct() * 100)}%`} />);
yield* all(pct(1, 2), bar().scale.x(1, 2));

// chained motion:
yield* circle().position.x(300, 1).to(-300, 1).to(0, 1);
```
