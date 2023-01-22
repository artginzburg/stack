import { Triplet, useBox } from '@react-three/cannon';
import { Mesh } from 'three';

import { useTheme } from '../contexts/ThemeContext';
import { config } from '../shared/constants';

import type { TileProps } from './Tile';

const fallingTileConfig = {
  mass: 10,
} as const;

export function FadingTiles({ fadingTiles }: { fadingTiles: TileProps[] }) {
  return (
    <>
      {fadingTiles.map((fadingTile) => (
        <ReactFadingTile key={fadingTile.index} {...fadingTile} />
      ))}
    </>
  );
}

/** @todo rename to FallingTile, remove "React" from name. */
function ReactFadingTile({ position, size, index }: TileProps) {
  const { theme } = useTheme();

  /** @todo exclude from here, duplicated value. */
  const height = config.tileHeight;

  const boxArgs: Triplet = [size.x, height, size.y];

  const [ref] = useBox<Mesh>(() => ({
    mass: fallingTileConfig.mass,
    position: [position.x, index * height, position.z],
    args: boxArgs,
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <meshPhongMaterial color={theme.tile(index)} />
      <boxGeometry args={boxArgs} />
    </mesh>
  );
}
