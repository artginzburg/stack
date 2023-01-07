import { useFrame } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Mesh, Vector3 } from 'three';
import { getTileColor } from '../shared/colors';

import type { TileProps } from './Tile';
import type { PreviousTile } from './types';

export function MovingTile({
  index,
  movingTileMeshRef,
  previousTile,
  autoplay,
  lastCube,
}: {
  index: number;
  movingTileMeshRef: React.RefObject<Mesh>;
  previousTile: PreviousTile;
  autoplay: boolean | undefined;
  lastCube: TileProps | undefined;
}) {
  const height = 10;
  const startOffset = 100;
  const [direction, setDirection] = useState(-1);

  useFrame((state, delta) => {
    if (!movingTileMeshRef.current) return;

    const mesh = movingTileMeshRef.current;

    const axis = index % 2 === 0 ? 'x' : 'z';
    const addedPosition = delta * 150;
    mesh.position[axis] += addedPosition * direction;

    if (autoplay) {
      if (lastCube) {
        /**
         * 0 — no error, will score more points than a human can wait to count.
         * 25 - will score ~8 points.
         * 50 - will score ~3 points.
         */
        const autoplayError = 0;
        const autoplayEpsilon = Math.round(addedPosition) / 2 + 0.1;

        if (
          nearlyEqual(lastCube.position[axis], mesh.position[axis], autoplayEpsilon + autoplayError)
        ) {
          document.getElementsByTagName('canvas')[0].click();
        }
      } else {
        if (
          Math.round(mesh.position.x) === Math.round(previousTile.position.x) &&
          Math.round(mesh.position.z) === Math.round(previousTile.position.z)
        ) {
          document.getElementsByTagName('canvas')[0].click();
        }
      }
    }

    const sideOffset = startOffset / 4;
    const maxSidePosition = startOffset + sideOffset;

    if (Math.abs(mesh.position[axis]) >= maxSidePosition) {
      setDirection((prev) => -prev);
      // Is this `mesh.position.clamp` call necessary? Seems to work the same way without it.
      mesh.position.clamp(
        new Vector3(-maxSidePosition, Number.NEGATIVE_INFINITY, -maxSidePosition),
        new Vector3(maxSidePosition, Number.POSITIVE_INFINITY, maxSidePosition),
      );
    }
  });

  useEffect(() => {
    if (!movingTileMeshRef.current) return;

    const mesh = movingTileMeshRef.current;

    // Resize
    mesh.position.x = previousTile.position.x;
    mesh.position.z = previousTile.position.z;
    // End Resize.

    mesh.position.y = index * height;
    const even = index % 2 === 0;
    mesh.position.set(
      even ? startOffset : mesh.position.x,
      index * height,
      !even ? startOffset : mesh.position.z,
    );
  }, [
    index,
    movingTileMeshRef,
    previousTile.position.x,
    previousTile.position.z,
    previousTile.size.x,
    previousTile.size.y,
  ]);

  return (
    <mesh ref={movingTileMeshRef} castShadow>
      <boxGeometry args={[previousTile.size.x, height, previousTile.size.y]} />
      <meshPhongMaterial color={getTileColor(index)} />
    </mesh>
  );
}

function nearlyEqual(a: number, b: number, epsilon: number) {
  const diff = Math.abs(a - b);

  return diff < epsilon;
}
