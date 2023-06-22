import './Greeting/Greeting.css';

import { useTheme } from '../contexts/ThemeContext';
import { tapOrClickBefore } from '../shared/texts';

import { sharedStyleProps } from './Greeting';

import { AllStatisticsProps, ThisGameStatsComponent } from './ThisGameStats/ThisGameStats';
import { GameEndingHighScore } from './GameEndingHighScore';

const configGameEnding = {
  showThisGameStats: true,
};

export function GameEnding({
  isStarted,
  isEnded,
  isHighScoreNew,
  thisGameStats,
  globalStats,
}: {
  isStarted: boolean;
  isEnded: boolean;
  isHighScoreNew: boolean;
} & AllStatisticsProps) {
  const { theme } = useTheme();

  if (!isStarted && !isEnded) return null;
  if (isStarted && !isEnded) return null;

  const className = ['greeting', isEnded ? null : 'fadeOut'].filter(Boolean).join(' ');

  return (
    <>
      {configGameEnding.showThisGameStats && (
        <ThisGameStatsComponent
          thisGameStats={thisGameStats}
          globalStats={globalStats}
          className={className}
        />
      )}
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
      <GameEndingHighScore isHighScoreNew={isHighScoreNew} className={className} />
    </>
  );
}
