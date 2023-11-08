import { Triplet, useBox } from '@react-three/cannon';
import { Mesh } from 'three';

import { config } from '../shared/constants';

import type { TileProps } from './Tile';
import { TileColor } from './ColorSystemTests';

const fallingTileConfig = {
  mass: 10,
} as const;

export function FadingTiles({
  fadingTiles,
  tileColors,
}: { fadingTiles: TileProps[] } & { tileColors: TileColor[] }) {
  return (
    <>
      {fadingTiles.map((fadingTile) => (
        <ReactFadingTile
          key={fadingTile.index}
          color={tileColors[fadingTile.index + 1].currentColor.toString()}
          {...fadingTile}
        />
      ))}
    </>
  );
}

/** @todo rename to FallingTile, remove "React" from name. */
function ReactFadingTile({ position, size, index, color }: TileProps & { color: string }) {
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
      <meshPhongMaterial color={color} />
      <boxGeometry args={boxArgs} />
    </mesh>
  );
}
