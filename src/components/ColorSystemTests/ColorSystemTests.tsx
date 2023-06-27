import { useEffect, useState } from 'react';

import { HSLColor } from './classes/HSLColor';

const lightIntensity = 4;
const saturationIntensity = 4;
const hueChange = 5;

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
  const lightness = Math.random() > 0.5 ? lightIntensity : 0;
  const saturation =
    lightness === 0 ? saturationIntensity : Math.random() > 0.5 ? saturationIntensity : 0;
  const finalLightness = Math.random() > 0.5 ? lightness : -lightness;
  const finalSaturation = Math.random() > 0.5 ? saturation : -saturation;

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

function newTile(prev: Tile): Tile {
  // first check that the prev color is not on the limit
  const prevColor = prev.color;
  const prevLightness = prevColor.l;
  const prevSaturation = prevColor.s;

  const tooLight = prevLightness > 60;
  const tooDark = prevLightness < 30;
  const tooSaturated = prevSaturation > 70;
  const tooDesaturated = prevSaturation < 25;

  if (tooLight || tooDark || tooSaturated || tooDesaturated) {
    // we need to create a new pattern

    let lightApplier = prev.applier.l;
    if (tooLight) lightApplier = -lightIntensity;
    else if (tooDark) lightApplier = lightIntensity;

    let saturationApplier = prev.applier.s;
    if (tooSaturated) saturationApplier = -saturationIntensity;
    else if (tooDesaturated) saturationApplier = saturationIntensity;

    // 1. 50% chance to rotate hue, +5 or -5
    const hueApplier = Math.random() > 0.5 ? hueChange : 0;
    const newHue = prevColor.h + hueApplier;

    return {
      color: new HSLColor(newHue, prevSaturation + saturationApplier, prevLightness + lightApplier),
      applier: new HSLColor(Math.random() > 0.7 ? hueChange : 0, saturationApplier, lightApplier),
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
