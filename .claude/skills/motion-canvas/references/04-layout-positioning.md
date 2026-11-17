# 04 — Layout & Positioning

Sources: `packages/docs/docs/getting-started/{layouts.mdx,positioning.mdx,hierarchy.mdx}`, `packages/2d/src/lib/components/{Node,Layout,Rect,Circle,Shape,Curve}.ts`.

## 1. Coordinate system

- Origin `x:0, y:0` = **center of parent** (scene-center for top-level).
- `+x` right, `+y` **down** (canvas convention).
- All placement parent-relative. `position: [x, y]`, or `x`, `y` separately.
- World helpers: `absolutePosition()`, `absoluteScale()`, `absoluteRotation()`, matrices `localToWorld()`, `worldToLocal()`, `localToParent()`, `parentToWorld()`.

```ts
const world = Vector2.zero.transformAsPoint(node.localToWorld());
```

## 2. Base NodeProps (everything inherits)

```tsx
<Node
  x={100} y={-50} position={[100, -50]}
  rotation={45}            // degrees
  scale={2} scaleX={1} scaleY={2}
  skew={0} skewX={0} skewY={0}
  zIndex={1}
  opacity={0.8}
  cache={true} cachePadding={20} // required for some composites/filters
  compositeOperation="source-over"
  shadowColor="#000" shadowBlur={20} shadowOffset={[0,4]}
  filters={[blur(8)]}      // see advanced filters doc
  shaders={...}            // experimental
/>
```

Children / hierarchy:

```tsx
view.add(<Node><Rect /><Txt>Hello</Txt></Node>);
node.add(<Rect />);
node.insert(<Rect />, 0);
node.removeChildren();
node.moveUp() / moveDown() / moveToTop() / moveToBottom();
node.reparent(newParent);
view.findAll(is(Rect)); // query
```

`Node` without layout = pure group/filter wrapper (flex ignores it, useful for grouping + caching).

## 3. Layout (Yoga flex)

`Layout` enables flexbox. Nested `Layout` = flex child; set `layout={false}` to opt out.

```tsx
import {Layout, Rect} from '@motion-canvas/2d';

view.add(
  <Layout direction="row" gap={40} padding={40} alignItems="center" justifyContent="center">
    <Rect size={120} fill="#e13238" />
    <Rect size={120} fill="#e6a700" />
    <Rect size={120} fill="#38e16a" />
  </Layout>,
);
```

Full flex props:

- `direction: 'row' | 'column'` (default row)
- `justifyContent, alignContent: 'start'|'center'|'end'|'space-between'|...`
- `alignItems, alignSelf`
- `gap, rowGap, columnGap: Length`
- `grow, shrink: number`, `basis: FlexBasis`, `wrap`
- `width, height: Length` (`'50%'`, `320`, etc.), `size: PossibleVector2<Length>` shortcut, `ratio`, `maxWidth/Height`, `minWidth/Height`
- `margin, marginTop/Bottom/Left/Right`, `padding, paddingTop/Bottom/Left/Right: PossibleSpacing`
- `clip: boolean` — clip children to rounded rect
- `layout: boolean` — `true` creates new flex root

Offset/cardinal shortcuts (override `position`):

```tsx
<Rect offset={[100, 0]} />
<Rect topLeft={[0,0]} /> {/* top, bottom, left, right, middle, topLeft, topRight, bottomLeft, bottomRight */}
```

Font defaults cascade from `Layout` to `Txt` children: `fontFamily, fontSize, fontWeight, fontStyle, lineHeight, letterSpacing, textWrap, textAlign, textDirection`.

Responsive row example:

```tsx
<Layout direction="row" gap={20} padding={20} width={1200}>
  <Rect grow={1} height={200} fill="#222" radius={16} />
  <Rect grow={2} height={200} fill="#333" radius={16} />
</Layout>
```

## 4. Shape / Curve props

`ShapeProps` adds paint:

```tsx
fill="#e13238" stroke="#fff" lineWidth={4}
lineJoin="round" lineCap="round" lineDash={[12,8]} lineDashOffset={0}
strokeFirst={true} antialiased={true}
```

`CurveProps` adds path animation:

```tsx
closed={true} start={0} end={1} startOffset={0} endOffset={0}
startArrow={true} endArrow={true} arrowSize={16}
```

Animate draw-on: `yield* line().end(0, 1).to(1, 1)` or `arrowSize(0,0.5).to(16,0.5)`.

## 5. Rect / Circle / Polygon specifics

```tsx
<Rect size={[400,200]} radius={[10,30]} smoothCorners cornerSharpness={0.6} fill="#e13238" />
<Circle size={320} fill="lightseagreen" />              {/* ellipse via width!=height */}
<Circle size={300} startAngle={0} endAngle={180} closed fill="#e6a700" /> {/* half-disc */}
<Polygon sides={6} size={300} fill="#38e16a" rotation={30} />
```

- `radius: PossibleSpacing` — `[10]`, `[10,30]`, `[10,20,30]`, `[10,20,30,40]` corners.
- `smoothCorners` = Apple-style squircle.
- Circle sector needs `closed` to fill wedge.

## 6. AI layout rules

- Use `Layout` for rows/cols/cards/grids, absolute `x/y` for hero diagrams.
- Prefer `gap` over manual `x` offsets for lists.
- Set explicit `width/height` on cards, `grow` for fluid splits.
- Center-screen default needs no positioning; offset with `x/y` only when composing multi-element scenes.
- For overlays (bbox highlight over Code), use absolute `position` + `getSelectionBBox` (see 05).
