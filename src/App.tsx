import { Leva, useControls } from 'leva';
import { useDocumentTitle, useEventListener } from 'usehooks-ts';

import { Game } from './components/Game';
import { ThemeInitializer } from './contexts/ThemeContext';
import { getNonProductionDocumentTitle } from './shared/documentTitle';

function App() {
  const [{ autoplay }, set] = useControls(() => ({
    autoplay: false,
  }));

  const isNotProduction = process.env.NODE_ENV !== 'production';

  if (isNotProduction) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDocumentTitle(getNonProductionDocumentTitle());
  }

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
      <ThemeInitializer>
        <Game autoplay={autoplay} />
      </ThemeInitializer>
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
