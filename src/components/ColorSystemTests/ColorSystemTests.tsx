import { useEffect, useState } from 'react';

const lightIntensity = 4;
const saturationIntensity = 4;
const hueChange = 5;

export function ColorSystemTests() {
  const [tiles, setTiles] = useState<Tile[]>([
    { color: getRandomColor(), applier: getRandomApplier() },
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

  return `hsl(0, ${finalSaturation}%, ${finalLightness}%)`;
}

function TileRenderer({ tile }: { tile: Tile }) {
  return (
    <div
      style={{
        width: '100%',
        height: '40px',
        background: tile.color,
      }}
    />
  );
}

function newTile(prev: Tile): Tile {
  // first check that the prev color is not on the limit
  const prevColor = prev.color;
  const prevLightness = getLightness(prevColor);
  const prevSaturation = getSaturation(prevColor);

  const tooLight = prevLightness > 60;
  const tooDark = prevLightness < 30;
  const tooSaturated = prevSaturation > 70;
  const tooDesaturated = prevSaturation < 25;

  if (tooLight || tooDark || tooSaturated || tooDesaturated) {
    // we need to create a new pattern

    // 1. 50% chance to rotate hue, +5 or -5
    const hueApplier = Math.random() > 0.5 ? hueChange : 0;
    const newHue = rotateHue(prevColor, hueApplier);

    let lightApplier = getLightness(prev.applier);
    if (tooLight) lightApplier = -lightIntensity;
    else if (tooDark) lightApplier = lightIntensity;
    // const newLightness = lighten(prevColor, lightApplier);

    let saturationApplier = getSaturation(prev.applier);
    if (tooSaturated) saturationApplier = -saturationIntensity;
    else if (tooDesaturated) saturationApplier = saturationIntensity;
    // const newSaturation = saturate(prevColor, saturationApplier);

    return {
      color: `hsl(${newHue}, ${prevSaturation + saturationApplier}%, ${
        prevLightness + lightApplier
      }%)`,
      applier: `hsl(${
        Math.random() > 0.7 ? hueChange : 0
      }, ${saturationApplier}%, ${lightApplier}%)`,
    };
  } else {
    // we can continue the pattern
    const nextColor = mixColorWithDifference(prevColor, prev.applier);
    return { color: nextColor, applier: prev.applier };
  }
}

interface Tile {
  color: string;
  applier: string;
}

function mixColorWithDifference(color: string, applier: string): string {
  // color = hsl(0, 50%, 50%)
  // difference = hsl(0, +5%, -5%)

  const colorHue = color.split(',')[0];
  const colorSaturation = color.split(',')[1];
  const colorLightness = color.split(',')[2];

  const differenceHue = applier.split(',')[0];
  const differenceSaturation = applier.split(',')[1];
  const differenceLightness = applier.split(',')[2];

  const newHue = parseInt(colorHue.slice(4)) + parseInt(differenceHue.slice(4));
  const newSaturation =
    parseInt(colorSaturation.slice(0, -1)) + parseInt(differenceSaturation.slice(0, -1));
  const newLightness =
    parseInt(colorLightness.slice(0, -1)) + parseInt(differenceLightness.slice(0, -1));

  return `hsl(${newHue}, ${newSaturation}%, ${newLightness}%)`;
}

function getLightness(color: string) {
  const lightness = color.split(',')[2];
  return parseInt(lightness.slice(0, -1));
}

function getSaturation(color: string) {
  const saturation = color.split(',')[1];
  return parseInt(saturation.slice(0, -1));
}

function rotateHue(color: string, rotation: number) {
  const hue = color.split(',')[0];
  const newHue = parseInt(hue.slice(4)) + rotation;
  return newHue;
}

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 100);
  const lightness = Math.floor(Math.random() * 100);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
