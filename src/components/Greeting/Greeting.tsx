import './Greeting.css';

export function Greeting({ index, isStarted }: { index: number; isStarted: boolean }) {
  if (isStarted) return null; // TODO make a fading out animation.
  if (index) return null;

  const headingTop = 5;
  const headingSize = 4;

  const sharedStyleProps: React.CSSProperties = {
    textAlign: 'center',
    width: '100%',

    color: 'white',
    fontWeight: 100,
    letterSpacing: 1,
    fontStretch: '120%',
    textTransform: 'uppercase',

    position: 'fixed',
  };

  return (
    <>
      <div
        className="greeting"
        style={{
          ...sharedStyleProps,
          fontSize: `${headingSize}rem`,
          top: `${headingTop}rem`,
        }}
      >
        stack
      </div>
      <div
        className="greeting"
        style={{
          ...sharedStyleProps,
          animationDelay: '0.2s',
          animationDuration: '0.25s',
          fontSize: '1rem',
          top: `${headingTop + headingSize + 2}rem`,
        }}
      >
        tap to start
      </div>
    </>
  );
}
