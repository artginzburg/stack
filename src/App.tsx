// import './App.css';
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
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
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
