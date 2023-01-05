import { useFrame } from '@react-three/fiber';

import { FadingTile } from '../classes/FadingTile';
import { PerfectEffect } from '../classes/PerfectEffect';
import { Tile } from '../classes/Tile';

export function FrameController({
  cubes,
  effects,
}: {
  cubes: (Tile | FadingTile)[];
  effects: PerfectEffect[];
}) {
  useFrame((state, delta) => {
    cubes.forEach((cube) => {
      if (cube instanceof FadingTile) {
        cube.update(delta);
      }
    });
    effects.forEach((effect) => {
      effect.update(delta);
    });
  });

  return null;
}
