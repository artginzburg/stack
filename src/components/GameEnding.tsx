import './Greeting/Greeting.css';
import { sharedStyleProps } from './Greeting';

export function GameEnding({ isStarted, isEnded }: { isStarted: boolean; isEnded: boolean }) {
  if (!isStarted && !isEnded) return null;
  if (isStarted && !isEnded) return null;

  const className = ['greeting', isEnded ? null : 'fadeOut', 'tapOrClickBefore']
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        className={className}
        style={{
          ...sharedStyleProps,
          animationDuration: '0.25s',
          fontSize: '1rem',

          bottom: '4rem',
        }}
      >
        {' '}
        to restart
      </div>
    </>
  );
}
