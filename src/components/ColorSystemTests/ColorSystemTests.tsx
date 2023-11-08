import { useEffect, useState } from 'react';

import { HSLColor } from './classes/HSLColor';
import { Random } from './classes/Random';
import { chance } from './functions/chance';

const hslLimits = {
  saturation: {
    min: 10,
    max: 100,
  },
  lightness: {
    min: 5,
    max: 85,
  },
};

export function ColorSystemTests() {
  const [tiles, setTiles] = useState<TileColor[]>([getFirstTileColor()]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTiles((prev) => [...prev, getNextTileColor(prev.at(-1)!)]);
    }, 30);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        // gap: '10px',
        background: 'white',
        width: '100%',
        height: '60%',
      }}
    >
      <button
        style={{ width: '100%' }}
        onClick={() => {
          Array(5)
            .fill(1)
            .forEach(() => {
              setTiles((prev) => [...prev, getNextTileColor(prev.at(-1)!)]);
            });
        }}
      >
        Generate next
      </button>
      <button
        onClick={() => {
          setTiles((prev) => [prev.at(0)!]);
        }}
      >
        Clear
      </button>
      {tiles.map((tile, index) => (
        <TileRenderer tile={tile} key={index} />
      ))}
    </div>
  );
}

function TileRenderer({ tile }: { tile: TileColor }) {
  return (
    <div
      style={{
        width: '100%',
        height: '40px',
        background: tile.currentColor.toString(),
      }}
    />
  );
}

export function getFirstTileColor(): TileColor {
  const initialAndCurrent = getRandomColorWithinLimits(hslLimits);
  const target = getRandomColorWithinLimits(hslLimits);

  return {
    initialColor: initialAndCurrent,
    currentColor: initialAndCurrent,
    targetColor: target,
  };
}

const flipHue = new HSLColor(180, 0, 0);

export function getNextTileColor(prevTile: TileColor): TileColor {
  const nextCachedDifferenceStep =
    prevTile.cachedDifferenceStep ?? getNewCachedDifferenceStep(prevTile);

  const newTile: TileColor = {
    initialColor: prevTile.initialColor.clone(),
    currentColor: prevTile.currentColor.clone().add(nextCachedDifferenceStep),
    targetColor: prevTile.targetColor.clone(),
    cachedDifferenceStep: nextCachedDifferenceStep,
  };

  const reachedTarget = newTile.currentColor.clone().round().equals(newTile.targetColor);
  if (reachedTarget) {
    newTile.initialColor = newTile.currentColor;

    /** For some reason, this made the colors seemingly go into shuffle mode sometimes. Disabled for now. */
    const probabilityToJustFlipHueInsteadOfRandomizing = 0;

    newTile.targetColor = chance(probabilityToJustFlipHueInsteadOfRandomizing)
      ? newTile.targetColor.add(flipHue)
      : getRandomColorWithinLimits(hslLimits);

    newTile.cachedDifferenceStep = getNewCachedDifferenceStep(newTile);
  }

  return newTile;
}

function getNewCachedDifferenceStep(tile: TileColor): HSLColor {
  return tile.initialColor
    .clone()
    .difference(tile.targetColor)
    .divScalar(Random.getInRange(10, 30));
}

function getRandomColorWithinLimits(limits: typeof hslLimits) {
  const hue = Random.getFromZeroTo(360);
  const saturation = Random.getInRange(limits.saturation.min, limits.saturation.max);
  const lightness = Random.getInRange(limits.lightness.min, limits.lightness.max);
  return new HSLColor(hue, saturation, lightness);
}

export interface TileColor {
  initialColor: HSLColor;
  currentColor: HSLColor;
  targetColor: HSLColor;
  cachedDifferenceStep?: HSLColor;
}
