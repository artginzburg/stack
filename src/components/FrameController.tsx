import { useFrame } from '@react-three/fiber';

import type { FadingTile } from '../classes/FadingTile';

export function FrameController({ cubes }: { cubes: FadingTile[] }) {
  useFrame((state, delta) => {
    cubes.forEach((cube) => {
      cube.update(delta);
    });
  });

  return null;
}
