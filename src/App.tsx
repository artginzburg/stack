import { useState } from 'react';
import { useEventListener } from 'usehooks-ts';

import { Game } from './components/Game';

function App() {
  const [autoplay, setAutoplay] = useState(false);

  return (
    <>
      {process.env.NODE_ENV !== 'production' && <DevOnlyFeatures setAutoplay={setAutoplay} />}
      <Game autoplay={autoplay} />
    </>
  );
}

function DevOnlyFeatures({
  setAutoplay,
}: {
  setAutoplay: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEventListener('keydown', (event) => {
    if (event.code === 'KeyA') {
      setAutoplay((prev) => !prev);
    }
  });

  return null;
}

export default App;
