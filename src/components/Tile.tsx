import type { Vector2, Vector3 } from 'three';

export interface TileProps {
  position: Vector3;
  size: Vector2;
  index: number;
}
export function ReactTile({ position, size, index }: TileProps) {
  const height = 10;

  return (
    <mesh receiveShadow position={[position.x, index * height, position.z]}>
      <meshPhongMaterial color={`hsl(${index * 5}, 50%, 50%)`} />
      <boxGeometry args={[size.x, height, size.y]} />
    </mesh>
  );
}
