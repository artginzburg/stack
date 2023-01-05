import { useFrame } from '@react-three/fiber';

import { FadingTile } from '../classes/FadingTile';
import { Tile } from '../classes/Tile';

export function FrameController({ cubes }: { cubes: (Tile | FadingTile)[] }) {
  useFrame((state, delta) => {
    cubes.forEach((cube) => {
      if (cube instanceof FadingTile) {
        cube.update(delta);
      }
    });
  });

  return null;
}
