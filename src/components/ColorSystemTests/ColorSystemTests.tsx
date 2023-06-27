import { useEffect, useState } from 'react';

import { HSLColor } from './classes/HSLColor';

const changeIntensities = {
  hue: 5,
  saturation: 4,
  lightness: 4,
};

export function ColorSystemTests() {
  const [tiles, setTiles] = useState<Tile[]>([
    { color: HSLColor.getRandom(), applier: getRandomApplier() },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTiles((prev) => {
        const tile = newTile(prev.at(-1)!);

        return [...prev, tile];
      });
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
              setTiles((prev) => {
                const tile = newTile(prev.at(-1)!);

                return [...prev, tile];
              });
            });
        }}
      >
        Generate next
      </button>
      <button
        onClick={() => {
          setTiles((prev) => [prev.at(1)!]);
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

function getRandomApplier() {
  // return either 0, 5, 5 or 0, -5, -5 or 0, 5, 0 or 0, 0, 5 or 0, -5, 0 or 0, 0, -5
  const lightness = chance(0.5) ? changeIntensities.lightness : 0;
  const saturation =
    lightness === 0 ? changeIntensities.saturation : chance(0.5) ? changeIntensities.saturation : 0;
  const finalLightness = chance(0.5) ? lightness : -lightness;
  const finalSaturation = chance(0.5) ? saturation : -saturation;

  return new HSLColor(0, finalSaturation, finalLightness);
}

function TileRenderer({ tile }: { tile: Tile }) {
  return (
    <div
      style={{
        width: '100%',
        height: '40px',
        background: tile.color.toString(),
      }}
    />
  );
}

const hslLimits = {
  saturation: {
    min: 25,
    max: 70,
  },
  lightness: {
    min: 30,
    max: 60,
  },
};

function newTile(prev: Tile): Tile {
  // first check that the prev color is not on the limit
  const prevColor = prev.color;

  const tooLight = prevColor.l > hslLimits.lightness.max;
  const tooDark = prevColor.l < hslLimits.lightness.min;
  const tooSaturated = prevColor.s > hslLimits.saturation.max;
  const tooDesaturated = prevColor.s < hslLimits.saturation.min;

  if (tooLight || tooDark || tooSaturated || tooDesaturated) {
    // we need to create a new pattern
    const hueApplier = chance(0.5) ? changeIntensities.hue : 0;

    let saturationApplier = prev.applier.s;
    if (tooSaturated) saturationApplier = -changeIntensities.saturation;
    else if (tooDesaturated) saturationApplier = changeIntensities.saturation;

    let lightApplier = prev.applier.l;
    if (tooLight) lightApplier = -changeIntensities.lightness;
    else if (tooDark) lightApplier = changeIntensities.lightness;

    const colorModifier = new HSLColor(hueApplier, saturationApplier, lightApplier);

    return {
      color: prevColor.clone().add(colorModifier),
      applier: new HSLColor(
        chance(0.3) ? changeIntensities.hue : 0,
        saturationApplier,
        lightApplier,
      ),
    };
  } else {
    // we can continue the pattern
    const nextColor = prevColor.clone().add(prev.applier);
    return { color: nextColor, applier: prev.applier };
  }
}

interface Tile {
  color: HSLColor;
  applier: HSLColor;
}

function chance(probability: number) {
  return Math.random() < probability;
}
