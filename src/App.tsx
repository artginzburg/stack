import { Leva, useControls } from 'leva';
import { useEventListener } from 'usehooks-ts';

import { Game } from './components/Game';

function App() {
  const [{ autoplay }, set] = useControls(() => ({
    autoplay: false,
  }));

  const isNotProduction = process.env.NODE_ENV !== 'production';

  return (
    <>
      {isNotProduction && (
        <DevOnlyFeatures
          toggleAutoplay={() => {
            set({ autoplay: !autoplay });
          }}
        />
      )}
      <Leva
        collapsed
        neverHide // Using `neverHide` to prevent weird layout "jumps" due to `collapsed`
        hideCopyButton
        hidden={!isNotProduction}
      />
      <Game autoplay={autoplay} />
    </>
  );
}

function DevOnlyFeatures({ toggleAutoplay }: { toggleAutoplay: () => void }) {
  useEventListener('keydown', (event) => {
    if (
      event.code === 'KeyA' &&
      !(event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
    ) {
      toggleAutoplay();
    }
  });

  return null;
}

export default App;
