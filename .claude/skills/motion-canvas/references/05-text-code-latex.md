# 05 — Text, Code & LaTeX

Sources: `packages/docs/docs/components/{code/index.mdx,code/grammars.mdx,code-block.mdx,latex.mdx,custom-components.mdx}`, `packages/docs/docs/getting-started/layouts.mdx`, `packages/2d/src/lib/components/{Txt,Code,Latex}.ts`, `packages/examples/src/scenes/{code,code-block,tex}.tsx`.

## 1. Txt

```tsx
import {Txt} from '@motion-canvas/2d';

view.add(<Txt fontSize={64} fontWeight={700} fill="#ffffff">Hello world</Txt>);
// reactive:
view.add(<Txt text={() => `r = ${radius().toFixed(2)}`} />);
// explicit prop:
<Txt text="Hello" fontFamily="Inter" fontSize={48} lineHeight={72} letterSpacing={2} />
// shortcuts:
<Txt.b fontSize={48}>Bold</Txt.b>
<Txt.i>Hello italic</Txt.i>
```

- `children` or `text` both accepted; children can mix strings + nested `Txt/TxtLeaf`.
- Inherits font defaults from parent `Layout`, paint (`fill/stroke/lineWidth`) from `parentTxt()` if not set.
- Nested `Txt` is `inline` by default, `display:block` forces break.
- Tweenable text: `yield* txt().text('New', 0.5)` (tweenText handles size interpolation).

Custom fonts: see `docs/advanced/custom-font.mdx` — load via `FontFace` / Google Fonts link in `vite.config` + `fontFamily` name. Always set fallback.

## 2. Code (modern, use this — CodeBlock is deprecated)

Install highlighter once per project:

```bash
npm i @lezer/javascript
```

Setup (top of scene or shared module):

```ts
import {Code, LezerHighlighter} from '@motion-canvas/2d';
import {parser} from '@lezer/javascript';

Code.defaultHighlighter = new LezerHighlighter(parser);
// with JSX+TS dialect + custom theme:
// Code.defaultHighlighter = new LezerHighlighter(
//   parser.configure({dialect: 'jsx ts'}),
//   MyHighlightStyle,
// );
```

Basic usage with `CODE` template tag (reactive, nestable):

```tsx
import {Code, CODE, makeScene2D} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const code = createRef<Code>();
  const counter = Code.createSignal('let x = 0;');

  view.add(
    <Code
      ref={code}
      fontSize={36}
      code={CODE`let x = ${counter()};\nconsole.log(x);`}
    />,
  );

  yield* counter('let x = 42;', 1); // diff-tweened automatically
});
```

`CodeProps`: `code: PossibleCodeScope`, `selection: PossibleCodeSelection`, `highlighter`, `drawHooks` (experimental token hooks).

### Editing code over time

All on `code()` signal, all tweenable with duration:

```ts
yield* code().code('const y = 1;', 1);           // replace whole
yield* code().append('\nconsole.log(y);', 0.8);  // append
yield* code().prepend('// demo\n', 0.5);
yield* code().insert(12, '42', 0.5);             // at char offset
yield* code().replace(word(0, 4, 1), '99', 0.6); // range -> new
yield* code().remove(lines(2, 4), 0.6);
yield* code().edit(1)`old${insert('new')}more`;  // tagged template edit
```

`Code.createSignal(init, highlighter?)` stays reactive after edits — prefer over plain `createSignal` for code strings.

### Selections & ranges

`CodeRange = [[startLine, startCol], [endLine, endCol]]`, zero-based, col = left edge.

```ts
import {word, lines} from '@motion-canvas/2d';
// or: import {word, lines} from '@motion-canvas/core'; // both re-exported, prefer 2d

word(0, 4, 3);    // line 0, col 4, len 3
lines(2, 5);      // lines 2..5 (spreadable: ...lines(2,5))
code().findFirstRange('foo');
code().findAllRanges(/bar/g);
code().findLastRange('baz');

yield* code().selection(word(0, 4, 3), 0.5);
yield* code().selection([...lines(1, 3), word(4, 0, 5)], 0.8);
yield* code().selection([], 0.5); // or DEFAULT to clear
```

Overlay highlight box:

```ts
const bboxes = code().getSelectionBBox(word(0, 0, 5));
for (const box of bboxes) {
  view.add(<Rect position={box.position} size={box.size} stroke="#e6a700" lineWidth={3} radius={8} />);
}
```

Gotchas: Chromium pixel-snaps small text (jitter) — preview code scenes in Firefox for pixel-perfect. `drawHooks` needs `experimentalFeatures: true` in `makeProject`.

Legacy `CodeBlock` (`language, code, selection`, `range(sl,sc,el,ec)`) still works but docs mark deprecated — always use `Code` for new work.

## 3. LaTeX

```tsx
import {Latex} from '@motion-canvas/2d';

view.add(<Latex tex="E = mc^2" fill="#fff" fontSize={64} />);
// split into morphable groups:
view.add(<Latex tex={['a^2', '+', 'b^2']} fill="#fff" />);
// equivalent string form:
view.add(<Latex tex="{{a^2}} + {{b^2}}" fill="#fff" />);
```

- `tex: string | string[]`, `fill` required, `fontSize`.
- Array items or `{{...}}` groups = independently tweenable units.
- Morph: `yield* latex().tex(['x^2', '-', 'y^2'], 1)` — missing groups fade out, new fade in, common tween.
- Duplicate groups count separately and merge visually.
- Escaping: in TS string need double backslash `tex('{{\\frac{1}{2}}}')`; in JSX attr single is fine `tex="{{\frac{1}{2}}}"`.
- Join has **no separator**: `['\\Delta', 'y']` breaks as `\Deltay` — fix `['\\Delta', '{y}']` or `['\\Delta ', 'y']`.

KaTeX is bundled; no extra install. For live formula building, animate `tex()` between steps.

## 4. Custom text components

```tsx
import {makeRef, makeRefs} from '@motion-canvas/core';
function Caption({refs, children}: {refs: {bg: Rect; label: Txt}; children: string}) {
  return (
    <Rect ref={makeRef(refs, 'bg')} fill="#111" radius={12} padding={20}>
      <Txt ref={makeRef(refs, 'label')} fontSize={32} fill="#fff">{children}</Txt>
    </Rect>
  );
}
const cap = makeRefs<typeof Caption>();
view.add(<Caption refs={cap}>Step 1: init</Caption>);
yield* cap.label.text('Step 2: animate', 0.5);
```

See `components/custom-components.mdx` for prop typing with `ComponentProps`.

## 5. AI rules

- Code scenes: always set `Code.defaultHighlighter` first, else no colors.
- Use `CODE` tag for interpolated code, `Code.createSignal` for driver.
- Reveal pattern: `selection(findAllRanges(...))` + `append` line-by-line with `waitFor(0.3)` beats.
- Math: split formulas into groups from the start if you plan to morph.
- Keep `fontSize` 28-42 for Code, 48-96 for Txt hero, 56-80 for Latex.
