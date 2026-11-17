# Motion Canvas Skill (universal, for skills.sh)

Programmatic vector animation with [Motion Canvas](https://motion-canvas.io) (`v3.17`). Lets any `SKILL.md`-compatible AI agent scaffold projects, write `makeScene2D` scenes, animate 2D nodes, visualize code/math, sync audio, and render MP4 via FFmpeg.

Works in: Claude Code, Cursor, Antigravity, Zed, Opencode, Windsurf, Copilot, and any [skills.sh](https://skills.sh)-compatible platform.

## Contents

- `SKILL.md` — router + cheat-sheet (always loaded, ~380 lines)
- `references/01-bootstrap-project.md` — scaffold, vite.config, project.ts
- `references/02-scenes-flow.md` — generators, all/sequence/chain/loop, waitFor/waitUntil
- `references/03-signals-refs-tweening.md` — signals, 6 ref patterns, tween/ease/spring
- `references/04-layout-positioning.md` — Yoga flex, origin, Rect/Circle/Polygon
- `references/05-text-code-latex.md` — Txt, Code+selection, Latex groups
- `references/06-shapes-curves-media.md` — Line/Bezier/Spline/Path, Img/Video
- `references/07-audio-camera-transitions.md` — sound(), Camera, transitions
- `references/08-render-export.md` — Video Settings, FFmpeg vs PNG, output/
- `references/09-recipes.md` — 8 runnable scenes
- `references/10-troubleshooting.md` — 15 AI pitfalls
- `assets/` — copy-paste `project.ts`, `vite.config.ts`, `example-scene.tsx`
- `scripts/check-scene.mjs` — lint scenes before finishing

## Install

Copy this whole folder to your agent's skill dir:

```bash
# Claude Code
cp -r motion-canvas-skill ~/.claude/skills/motion-canvas

# Cursor / Antigravity
cp -r motion-canvas-skill .cursor/skills/motion-canvas
# or universal:
cp -r motion-canvas-skill .agents/skills/motion-canvas

# Zed
cp -r motion-canvas-skill ~/.config/zed/skills/motion-canvas

# Opencode
cp -r motion-canvas-skill .opencode/skills/motion-canvas
```

For skills.sh: push this repo/folder as-is — `SKILL.md` at root with `name`+`description` frontmatter is the listing entry.

## Validate

```bash
node scripts/check-scene.mjs assets/example-scene.tsx assets/project.ts.txt
```

## Sources

Distilled from Motion Canvas monorepo `v3.17`: `packages/docs`, `packages/core/src`, `packages/2d/src`, `packages/{template,create,examples,vite-plugin,ffmpeg}`.

License: MIT (skill text). Motion Canvas itself is MIT.
