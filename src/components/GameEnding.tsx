import './Greeting/Greeting.css';

import { useReadLocalStorage } from 'usehooks-ts';

import { LocalStorageKeys } from '../shared/LocalStorageKeys';
import { sharedStyleProps } from './Greeting';

export function GameEnding({
  isStarted,
  isEnded,
  isHighScoreNew,
}: {
  isStarted: boolean;
  isEnded: boolean;
  isHighScoreNew: boolean;
}) {
  const highScore = useReadLocalStorage<number | null>(LocalStorageKeys.HighScore);

  if (!isStarted && !isEnded) return null;
  if (isStarted && !isEnded) return null;

  const className = ['greeting', isEnded ? null : 'fadeOut'].filter(Boolean).join(' ');

  return (
    <>
      <div
        className={className + ' tapOrClickBefore'}
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
      {isHighScoreNew || highScore ? (
        <div
          className={className}
          style={{
            ...sharedStyleProps,
            letterSpacing: 0,
            fontStretch: '100%',

            fontSize: '2rem',
            top: `${5 + 2 + 1}rem`, // `5 + 2` is `size + top` of Score.
          }}
        >
          {isHighScoreNew ? 'New high score!' : `Best: ${highScore}`}
        </div>
      ) : null}
    </>
  );
}
