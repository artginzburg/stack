# stack

Just saw [KonradLinkowski/Stack](https://github.com/KonradLinkowski/Stack), and decided to rewrite it from Three.js to React Three Fiber. As you see, it did not go quite well. Ok, it's my first try at games, and the first glance at 3D from a dev's perspective (tried 3ds Max before, that's all).

## Enhancements

- Shadows. The lighting needs to be fixed, but it is a good feature.
- Added a service worker and manifest.json. Really hoping that this will run offline like an App Store app.
- Auto-play. It is a dev-only feature that makes the game play itself, with some level of error if required. Essentially, this is an automatic test.
- `pointerDown` instead of `click` event to play. Because that's how it worked in the original game.
- Adapt game size to the user's screen (only based on screen width for now).
- Physics for cut off tiles.

## Plans

- Eliminate all `useRef()`s.
- Use auto-play like a real test — speed it up, add to `npm test`, plus CI.

> And everything else that Konrad pointed out in Todo, of course.
