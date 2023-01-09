import { Triplet, useBox } from '@react-three/cannon';
import { Mesh, Vector2, Vector3 } from 'three';

import { getTileColor } from '../shared/colors';
import { config } from '../shared/constants';

export interface TileProps {
  position: Vector3;
  size: Vector2;
  index: number;
}
export function ReactTile({ position, size, index }: TileProps) {
  const boxArgs: Triplet = [size.x, config.tileHeight, size.y];

  const [ref] = useBox<Mesh>(() => ({
    position: [position.x, index * config.tileHeight, position.z],
    type: 'Static',
    args: boxArgs,
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <meshPhongMaterial color={getTileColor(index)} />
      <boxGeometry args={boxArgs} />
    </mesh>
  );
}
