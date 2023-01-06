import { Triplet, useBox } from '@react-three/cannon';
import { Mesh, Vector2, Vector3 } from 'three';

export interface TileProps {
  position: Vector3;
  size: Vector2;
  index: number;
}
export function ReactTile({ position, size, index }: TileProps) {
  const height = 10;

  const boxArgs: Triplet = [size.x, height, size.y];

  const [ref] = useBox<Mesh>(() => ({
    position: [position.x, index * height, position.z],
    type: 'Static',
    args: boxArgs,
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <meshPhongMaterial color={`hsl(${index * 5}, 50%, 50%)`} />
      <boxGeometry args={boxArgs} />
    </mesh>
  );
}
