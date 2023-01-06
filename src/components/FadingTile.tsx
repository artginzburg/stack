import { Triplet, useBox } from '@react-three/cannon';
import { Mesh } from 'three';

import type { TileProps } from './Tile';

export function FadingTiles({ fadingTiles }: { fadingTiles: TileProps[] }) {
  return (
    <>
      {fadingTiles.map((fadingTile) => (
        <ReactFadingTile key={fadingTile.index} {...fadingTile} />
      ))}
    </>
  );
}

function ReactFadingTile({ position, size, index }: TileProps) {
  /** @todo exclude from here, duplicated value. */
  const height = 10;

  const boxArgs: Triplet = [size.x, height, size.y];

  const [ref] = useBox<Mesh>(() => ({
    mass: 10,
    position: [position.x, index * height, position.z],
    args: boxArgs,
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <meshPhongMaterial color={`hsl(${index * 5}, 50%, 50%)`} />
      <boxGeometry args={boxArgs} />
    </mesh>
  );
}
