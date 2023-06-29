import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { statisticMethods, Statistic } from '../../features/stats';
import { resetButtonStyles, resetListStyles } from '../../tools/stylesToolkit';
import { sharedStyleProps } from '../Greeting';
import { ModalDefault } from '../ModalDefault';
import './ThisGameStats.css';

export function ThisGameStatsComponent({
  thisGameStats,
  globalStats,
  className,
}: AllStatisticsProps & Pick<Parameters<typeof ThisGameStatsOpenButton>[0], 'className'>) {
  const [isGameStatsOpened, setIsGameStatsOpened] = useState(false);

  return isGameStatsOpened ? (
    <ThisGameStatsModal
      setIsOpened={setIsGameStatsOpened}
      thisGameStats={thisGameStats}
      globalStats={globalStats}
    />
  ) : (
    <ThisGameStatsOpenButton
      className={className}
      onClick={() => {
        setIsGameStatsOpened(true);
      }}
    />
  );
}

function ThisGameStatsOpenButton({
  className,
  onClick,
}: {
  className: string;
  onClick: React.DOMAttributes<HTMLButtonElement>['onClick'];
}) {
  const { theme } = useTheme();

  const approximateButtonHeight = 1;
  const invisiblePaddingRem = approximateButtonHeight * 0.6; // Look at https://github.com/artginzburg/stack/issues/22#issue-1780014221 for the explanation on why 60%.

  const visualOffsetFromScreenEdge = 1;
  const leftAndBottom = `${visualOffsetFromScreenEdge - invisiblePaddingRem}rem`;

  return (
    <button
      className={className}
      onClick={onClick}
      style={{
        ...sharedStyleProps,
        ...resetButtonStyles,

        width: 'auto',

        left: leftAndBottom,
        bottom: leftAndBottom,

        padding: `${invisiblePaddingRem}rem`,
        // TODO? add padding-inline
      }}
    >
      <div
        className="viewStatsButton"
        style={{
          backgroundColor: theme.lightElements,
          color: theme.background(NaN),
          animationDuration: '0.25s',
          fontSize: '0.9rem',
          letterSpacing: 1,

          // #region copied from Greeting.css: `.links`
          padding: '0.1em 0.5em',
          borderRadius: '0.4em',
          // bottom: '1rem',
          // #endregion
        }}
      >
        stats
      </div>
    </button>
  );
}

function ThisGameStatsModal({
  thisGameStats,
  globalStats,
  ...props
}: Parameters<typeof ModalDefault>[0] & AllStatisticsProps) {
  const { theme } = useTheme();

  const statsMap: {
    title: string;
    thisGameValue: number;
    bestValue?: number;
    render?: (value: number) => string | number;
  }[] = [
    {
      title: 'Longest combo',
      thisGameValue: thisGameStats.longestCombo,
      bestValue: globalStats.longestCombo,
    },
    {
      title: 'Perfect percentage',
      thisGameValue: statisticMethods.getPerfectPercentage(thisGameStats),
      // bestValue: statisticMethods.getPerfectPercentage(globalStats),
      render: toPercentage,
    },
    {
      title: 'Avg. Error percentage',
      thisGameValue: thisGameStats.errorPercentageAverage,
      // bestValue: globalStats.errorPercentageAverage,
      render: toPercentage,
    },
    {
      title: 'Total games',
      thisGameValue: globalStats.gamesStarted,
    },
  ];

  return (
    <ModalDefault {...props}>
      <ul
        style={{
          ...resetListStyles,
          listStyleType: 'none',
          textAlign: 'initial',
          display: 'flex',
          flexDirection: 'column',
          rowGap: '0.9rem',
        }}
      >
        {statsMap.map(({ title, thisGameValue, bestValue, render }) => {
          /** @todo make this condition `thisGameValue > bestValue`. This is not possible right now because the stats collection works in such way that if `thisGameStats` value exceeds the one from `globalStats` — the one from `globalStats` will be overridden. How to implement: Make another Statistic storage, e.g. `lastGlobalStats`, which will only by updated on game start.  */
          const isRecord = bestValue !== undefined && thisGameValue === bestValue;

          return (
            <li key={title}>
              {title}:{' '}
              <span style={{ color: theme.tile(thisGameStats.totalScore) }}>
                {render?.(thisGameValue) ?? thisGameValue}
              </span>
              {isRecord ? <span style={{ color: 'rgb(255, 0, 98)' }}> Record!</span> : null}
              {bestValue && !isRecord ? (
                <span style={{ color: 'darkgray' }}>
                  {' '}
                  (Best: {render?.(bestValue) ?? bestValue})
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </ModalDefault>
  );
}

export interface AllStatisticsProps {
  thisGameStats: Statistic;
  globalStats: Statistic;
}

function toPercentage(coefficient: number, fractionDigits = 0) {
  return `${(coefficient * 10 ** 2).toFixed(fractionDigits)}%`;
}
