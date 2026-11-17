# 01 — Bootstrap & Project Config

Sources: `packages/create/index.js`, `packages/create/template-2d-ts/`, `packages/template/src/`, `packages/vite-plugin/src/main.ts`, `packages/core/src/app/Project.ts`, `packages/docs/docs/getting-started/{quickstart.mdx,configuration.mdx}`.

## 1. Scaffold

```bash
npm create motion-canvas@latest
# prompts:
#  name  -> my-video
#  path  -> ./my-video
#  language -> TypeScript (always choose TS for AI work; JS template exists but types help)
#  plugins -> keep ffmpeg ON (for mp4), core/image-sequence always ON
cd my-video
npm install
npm start   # vite + editor at http://localhost:9000
npm run build # tsc && vite build
```

Node >= 18, vite ^4, typescript ^5.2.

What the generator does (`packages/create/index.js`):

- copies `template-2d-ts/` to dest
- renames `gitignore` -> `.gitignore`
- generates `vite.config.ts` dynamically (not stored in template)
- pins `@motion-canvas/*` deps to creator version (e.g. `3.17.2`)
- drops `public/.gitkeep`

## 2. File layout

```
my-video/
  vite.config.ts
  package.json          # scripts: start/serve=vite, build=tsc && vite build
  tsconfig.json         # extends @motion-canvas/2d/tsconfig.project.json, include: ["src"]
  src/
    motion-canvas.d.ts  # /// <reference types="@motion-canvas/core/project" />
    project.ts          # makeProject({scenes})
    project.meta        # auto-generated, do not edit
    scenes/
      example.tsx
      example.meta      # auto-generated
  public/               # static assets served as /...
  output/               # renders, gitignored
```

`package.json` template:

```json
{
  "name": "my-video",
  "private": true,
  "version": "0.0.0",
  "scripts": {"start": "vite", "serve": "vite", "build": "tsc && vite build"},
  "dependencies": {"@motion-canvas/core": "*", "@motion-canvas/2d": "*"},
  "devDependencies": {
    "@motion-canvas/ui": "*",
    "@motion-canvas/vite-plugin": "*",
    "@motion-canvas/ffmpeg": "*",
    "typescript": "^5.2.2",
    "vite": "^4.0.0"
  }
}
```

## 3. vite.config.ts

Generated form — copy from `assets/vite.config.ts.txt`:

```ts
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [
    motionCanvas(),
    ffmpeg(),
  ],
});
```

`motionCanvas()` options (all optional):

```ts
motionCanvas({
  project: './src/project.ts', // string | string[] — array = multi-project selector in editor
  output: './output',          // renders -> [output]/[project]/[frame].[ext]
  bufferedAssets: /\.(wav|ogg)$/, // RegExp | false — streamed vs buffered
  editor: '@motion-canvas/ui', // custom editor override
  proxy: false, // true | {allowedMimeTypes: ['image/*','video/*'], allowListHosts: []} — for CORS images
})
```

Multi-project: `project: ['./src/project-a.ts', './src/project-b.ts']` gives dropdown in editor.

Linking local monorepo fork (advanced): use `file:../motion-canvas/packages/core` in deps + `server.fs.strict: false` in vite config so `/@fs/` styles load.

## 4. src/project.ts

```ts
import {makeProject} from '@motion-canvas/core';
import example from './scenes/example?scene';
import second from './scenes/second?scene';

export default makeProject({
  scenes: [example, second], // order = playback order
  // name: 'my-video',       // optional display name
  // audio: './global-music.mp3', // global bg track, see 07
  // variables: {title: 'Hello'}, // editor-tweakable project variables
  // plugins: [],            // runtime plugins
  // experimentalFeatures: false, // true enables Code drawHooks etc.
  // logger: ...,            // custom logger
});
```

Rules:

- `?scene` suffix **required** on every scene import. It wraps description + attaches `.meta` + HMR.
- `scenes` array order defines playback + transitions order.
- `audio` is URL/import string for global background track. Per-scene SFX use `sound()` (see 07).
- `variables` are shown in editor UI and readable via `useScene().variables`.
- `audioOffset` in `makeProject` is deprecated — set Audio offset in Video Settings instead.

## 5. src/scenes/*.tsx

Every scene file:

```tsx
import {makeScene2D} from '@motion-canvas/2d';
export default makeScene2D(function* (view) {
  // view: View2D, 1920x1080 default
});
```

- File must default-export `DescriptionOf<Scene2D>`.
- `view` is root `View2D`. Add children via `view.add(<Node/>)` or JSX fragment.
- Scene duration = total yielded time (`waitFor` + tweens). No explicit duration needed unless using `useDuration()` markers.

## 6. tsconfig + d.ts

`tsconfig.json`:

```json
{
  "extends": "@motion-canvas/2d/tsconfig.project.json",
  "include": ["src"]
}
```

`src/motion-canvas.d.ts`:

```ts
/// <reference types="@motion-canvas/core/project" />
```

This enables `?scene` imports + `CODE` tag types.

## 7. Editor basics

- `npm start` -> `http://localhost:9000`
- Left: project + scene list. Center: preview. Right: Video Settings. Bottom: timeline with `waitUntil`/`beginSlide` markers (draggable, editable).
- Editing code triggers Vite HMR — preview updates live, playback state preserved where possible.
- `output/` is written via exporter websocket (`motion-canvas:export`), opened via `/__open-output-path`.

## 8. AI checklist for new project

- [ ] `vite.config.ts` has `motionCanvas()` + `ffmpeg()`
- [ ] `src/project.ts` uses `?scene` imports + `makeProject({scenes})`
- [ ] `src/motion-canvas.d.ts` exists
- [ ] `npm install` then `npm start` reaches editor without TS errors
- [ ] At least one scene yields time (`waitFor` or tween), otherwise video is 0-length
