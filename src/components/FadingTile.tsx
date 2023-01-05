import { useFrame } from '@react-three/fiber';

import type { TileProps } from './Tile';

export interface FadingTileProps extends TileProps {
  materialOpacity: number;
  timer: number;
}

export function FadingTiles({
  fadingTiles,
  setFadingTiles,
}: {
  fadingTiles: FadingTileProps[];
  setFadingTiles: React.Dispatch<React.SetStateAction<FadingTileProps[]>>;
}) {
  const animationTime = 0.3;

  const ease = (t: number) => t * t * (3.0 - 2.0 * t);

  useFrame((state, delta) => {
    setFadingTiles((prev) =>
      prev
        .map((fadingTile) =>
          fadingTile.materialOpacity < 0.05
            ? (null as any)
            : {
                ...fadingTile,
                ...(fadingTile.timer < animationTime
                  ? {
                      materialOpacity: 1 - ease(fadingTile.timer / animationTime),
                      timer: fadingTile.timer + delta,
                    }
                  : undefined),
              },
        )
        .filter(Boolean),
    );
  });

  return (
    <>
      {fadingTiles.map((fadingTile) => (
        <ReactFadingTile key={fadingTile.index} {...fadingTile} />
      ))}
    </>
  );
}

function ReactFadingTile({ position, size, index, materialOpacity }: FadingTileProps) {
  /** @todo exclude from here, duplicated value. */
  const height = 10;

  return (
    <mesh position={[position.x, index * height, position.z]}>
      <meshPhongMaterial
        color={`hsl(${index * 5}, 50%, 50%)`}
        transparent
        opacity={materialOpacity}
      />
      <boxGeometry args={[size.x, height, size.y]} />
    </mesh>
  );
}
