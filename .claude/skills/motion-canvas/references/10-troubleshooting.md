# 10 — Troubleshooting (15 AI pitfalls)

Sources: collected from `packages/docs`, `packages/2d`, `packages/core` behavior + editor UX.

1. **Frozen frame / nothing moves** — forgot `yield*`. `rect().x(300,1)` without `yield*` schedules and skips. Fix: every tween/flow needs `yield*`. Run `scripts/check-scene.mjs`.

2. **Scene not listed / HMR broken** — forgot `?scene`. `import s from './scenes/a'` wrong. Fix: `import s from './scenes/a?scene'` + list in `makeProject({scenes:[s]})`.

3. **Used React hooks** — `useState/useEffect` do not exist in Motion Canvas JSX runtime. Fix: `createSignal/createRef/createEffect` from `@motion-canvas/core`.

4. **Called ref without `()`** — `circle.scale(...)` throws (ref object, not node). Fix: `circle().scale(...)`.

5. **Animated `Camera.scale`** — camera uses `zoom`, not `scale`. Fix: `camera().zoom(2,1)`, `centerOn()`, `reset()`.

6. **Tweened `Video.playbackRate`** — non-reactive, ignored. Fix: set once `playbackRate={1.2}`, animate `scale/opacity/time` instead.

7. **Background won't animate** — set `background` in Video Settings (static). Fix: animate `view.fill('#000',1)` per scene.

8. **Code has no colors** — forgot highlighter. Fix: `npm i @lezer/javascript` + `Code.defaultHighlighter = new LezerHighlighter(parser)` before `view.add(<Code/>)`.

9. **Code jitter in Chrome** — Chromium pixel-snaps small text. Fix: preview code scenes in Firefox; keep `fontSize >= 28`.

10. **LaTeX `\\Delta y` merged** — `['\\Delta','y']` joins with no separator -> `\Deltay`. Fix: `['\\Delta','{y}']` or trailing space.

11. **LaTeX backslash escaped wrong** — TS string needs `\\frac`, JSX attr needs `\frac`. Fix: `tex('{{\\frac{1}{2}}}')` in TS, `tex="{{\frac{1}{2}}}"` in JSX.

12. **Stagger runs serial not parallel** — used `sequence` when you meant `all`, or `yield*` in loop. Fix: `all(...items.map(...))` for parallel; `sequence(gap, ...)` for stagger; `yield` (no star) + final `waitFor` for fork pattern.

13. **MP4 has no audio** — `Include audio` OFF or `ffmpeg()` missing in vite plugins. Fix: `npm i @motion-canvas/ffmpeg`, add `ffmpeg()` to `vite.config.ts`, turn `Include audio` ON, check `project.audio` path exists.

14. **0-second video** — scene yields no time (only `view.add`, no `waitFor`/tween). Fix: end every scene with `yield* waitFor(0.5)` minimum.

15. **Layout ignores Node** — plain `Node` is not flex, only `Layout/Rect/Circle/Txt/...` participate. Fix: use `Layout` for rows/cols; `Node` only as group/filter wrapper. Set `layout={false}` to opt out, check `grow/shrink/gap` on flex parent not child.
