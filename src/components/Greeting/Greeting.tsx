import './Greeting.css';

export function Greeting({ index, isStarted }: { index: number; isStarted: boolean }) {
  if (index > 2) return null;

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

  const className = ['greeting', isStarted || index ? 'fadeOut' : null].filter(Boolean).join(' ');

  return (
    <>
      <div
        className={className}
        style={{
          ...sharedStyleProps,
          fontSize: `${headingSize}rem`,
          top: `${headingTop}rem`,
        }}
      >
        stack
      </div>
      <div
        className={className}
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
