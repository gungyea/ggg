# 08 — Render & Export (Editor + FFmpeg)

Sources: `packages/docs/docs/getting-started/rendering/{index.mdx,video.mdx,image-sequence.mdx}`, `packages/docs/docs/getting-started/{presentation.mdx,logging.mdx}`, `packages/core/src/app/{Renderer,Exporter,ImageExporter}.ts`, `packages/ffmpeg/{client,server}/*`, `packages/vite-plugin/src/partials/exporter.ts`.

## 1. Editor render flow

1. `npm start` -> `http://localhost:9000`
2. Left panel: pick project + scenes (checkboxes = included in render).
3. Right panel — Video Settings:
   - `Background: Color | null` (static; per-scene animated bg via `view.fill()`)
   - `Range: [start, end]` seconds
   - `Resolution: Vector2` e.g. `1920x1080` (no auto-scale)
   - `Frame rate: 24 | 30 | 60` (resilient — engine keeps timing)
   - `Scale: number` (scales coords; use <1 for fast preview, 1 for final)
   - `Color space: sRGB | DCI-P3`
   - `Audio offset: sec`
   - `Exporter: Image sequence | Video (FFmpeg)`
4. `RENDER` -> writes to `output/`. `ABORT` cancels. Camera icon = still frame -> `output/still/<project>/000123.png`.
5. `RENDER dropdown -> PRESENT` for slide decks (`beginSlide`).

`Renderer.render(settings)` internally: `PlaybackManager.recalculate + reset` -> per-frame `Stage.render(scene)` -> `Exporter.handleFrame(canvas)` -> `stop(result)`.

## 2. Exporters

### Video (FFmpeg) — for .mp4

Requires (default ON in bootstrap):

```bash
npm i @motion-canvas/ffmpeg
```

```ts
// vite.config.ts
import ffmpeg from '@motion-canvas/ffmpeg';
export default defineConfig({plugins: [motionCanvas(), ffmpeg()]});
```

Exporter meta (`FFmpegExporterClient` id `@motion-canvas/ffmpeg`):

- `Include audio` — mixes `project.audio` + scene `sound()` + `Video` audio. Needs audio files present.
- `Fast start` — web streaming flag (`-movflags faststart`).
- `Audio sample rate` — default 48k.

Output: `output/<project>/<project>.mp4` (h264 + aac). Bridge spawns real `ffmpeg` via `fluent-ffmpeg` + `ffmpeg-ffprobe-static` (`FFmpegBridge.ts`, `ImageStream.ts`).

### Image sequence — for frames

Built-in, no install. Options:

- `File type: PNG | JPEG | WebP` (browser-dependent)
- `Quality: 0..100` (100 = lossless where supported)
- `Group by scene: bool`

Output: `output/<project>/<frame>.png` (`000000.png` ...). Assemble externally or via ffmpeg manually.

Still frame: `renderFrame(time)` single PNG for thumbnails.

## 3. Logging / debugging renders

```ts
import {useLogger, useScene} from '@motion-canvas/core';
useLogger().info('rendering beat 1');
console.log(useScene().time()); // current time
```

Logs appear in editor console + terminal. See `logging.mdx`.

## 4. Headless / CI (advanced)

No official `motion-canvas render` CLI in v3.17 — rendering is driven by editor websocket (`motion-canvas:export`). For CI: run `vite build` then Playwright against editor with `?render` automation, or use community `mc-render` wrappers. Prefer manual `RENDER` for skill v1; document headless only if user explicitly needs CI.

## 5. AI checklist

- [ ] `ffmpeg()` in vite plugins if mp4 requested
- [ ] Scenes checked in left panel, `Range` covers all `waitFor`/tweens
- [ ] `FPS` 30 for explainers, 60 for smooth physics
- [ ] `Scale` 1 for final, 0.5 for draft preview
- [ ] `Include audio` ON if `audio`/`sound()` used
- [ ] Output path `output/<project>.mp4` exists after RENDER
