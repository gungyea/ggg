import {Rect, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rect = createRef<Rect>();

  view.fill('#0b0b0f');
  view.add(<Rect ref={rect} size={320} radius={80} fill={'#e13238'} />);

  yield* all(
    rect().scale(2, 1).to(1, 1),
    rect().fill('#e6a700', 1).to('#e13238', 1),
  );
  yield* waitFor(0.5);
});
