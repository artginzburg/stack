import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { LocalStorageKeys } from '../shared/LocalStorageKeys';

const defaultStats = {
  errorPercentageAverage: 0,
  perfects: 0,
  cutTiles: 0,
  /** Consecutively executed perfect box drops. */
  currentCombo: 0,
  longestCombo: 0,
  totalScore: 0,
  gamesStarted: 0,
  gamesEnded: 0,
  /** Times the player has beaten his own best score. */
  beatenHighScore: 0,
};
export type Statistic = typeof defaultStats;

export const statisticMethods = {
  getUnfinishedGames(stats: Statistic) {
    return stats.gamesStarted - stats.gamesEnded;
  },
  getPerfectPercentage(stats: Statistic) {
    if (stats.totalScore === 0) return 0;

    return stats.perfects / stats.totalScore;
  },
};

export function useStatistics() {
  const [thisGameStats, setThisGameStats] = useState(defaultStats);
  const [globalStats, setGlobalStats] = useLocalStorage(LocalStorageKeys.Stats, defaultStats);

  const setAllStats: React.Dispatch<React.SetStateAction<Statistic>> = (setStateAction) => {
    setThisGameStats(setStateAction);
    setGlobalStats(setStateAction);
  };

  function resetThisGameStats() {
    setThisGameStats(defaultStats);
  }

  function updateAllStatsOnCutBox(errorPercentage: number, isConsideredPerfect: boolean) {
    setAllStats((prev) => {
      const newCombo = isConsideredPerfect ? prev.currentCombo + 1 : defaultStats.currentCombo;

      return {
        ...prev,
        errorPercentageAverage: (prev.errorPercentageAverage + errorPercentage) / 2,
        perfects: isConsideredPerfect ? prev.perfects + 1 : prev.perfects,
        cutTiles: isConsideredPerfect ? prev.cutTiles : prev.cutTiles + 1,
        currentCombo: newCombo,
        longestCombo: newCombo > prev.longestCombo ? newCombo : prev.longestCombo,
        totalScore: prev.totalScore + 1,
      };
    });
  }
  function updateAllStatsOnGameStart() {
    setAllStats((prev) => ({
      ...prev,
      gamesStarted: prev.gamesStarted + 1,
      currentCombo: defaultStats.currentCombo,
    }));
  }
  function updateAllStatsOnLose() {
    console.log('current', thisGameStats);
    console.log('global', globalStats);

    setAllStats((prev) => ({
      ...prev,
      currentCombo: defaultStats.currentCombo,
      errorPercentageAverage: (prev.errorPercentageAverage + 1) / 2,
      gamesEnded: prev.gamesEnded + 1,
    }));
  }
  function updateAllStatsOnBeatingHighScore() {
    setAllStats((prev) => ({ ...prev, beatenHighScore: prev.beatenHighScore + 1 }));
  }

  return {
    thisGameStats,
    // setThisGameStats,
    resetThisGameStats,

    globalStats,

    // setAllStats,
    updateAllStatsOnCutBox,
    updateAllStatsOnGameStart,
    updateAllStatsOnLose,
    updateAllStatsOnBeatingHighScore,
  };
}
