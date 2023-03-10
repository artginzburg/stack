import './Greeting/Greeting.css';

import { useReadLocalStorage } from 'usehooks-ts';

import { useTheme } from '../contexts/ThemeContext';
import { LocalStorageKeys } from '../shared/LocalStorageKeys';
import { tapOrClickBefore } from '../shared/texts';
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
  const { theme } = useTheme();

  const highScore = useReadLocalStorage<number | null>(LocalStorageKeys.HighScore);

  if (!isStarted && !isEnded) return null;
  if (isStarted && !isEnded) return null;

  const className = ['greeting', isEnded ? null : 'fadeOut'].filter(Boolean).join(' ');

  return (
    <>
      <div
        className={className}
        style={{
          ...sharedStyleProps,
          color: theme.lightElements,
          animationDuration: '0.25s',
          fontSize: '1rem',
          letterSpacing: 1,

          bottom: '4rem',
        }}
      >
        {tapOrClickBefore} to restart
      </div>
      {isHighScoreNew || highScore ? (
        <div
          className={className}
          style={{
            ...sharedStyleProps,
            color: theme.lightElements,
            letterSpacing: 0,

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
