import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useEffect, useState } from 'react';
import { Mesh, Vector3 } from 'three';

import { getTileColor } from '../shared/colors';
import { config } from '../shared/constants';

import type { TileProps } from './Tile';
import type { PreviousTile } from './types';

export function MovingTile({
  index,
  movingTileMeshRef,
  previousTile,
  autoplay,
  lastCube,
  speedOfMovingTile,
}: {
  index: number;
  movingTileMeshRef: React.RefObject<Mesh>;
  previousTile: PreviousTile;
  autoplay: boolean | undefined;
  lastCube: TileProps | undefined;
  speedOfMovingTile: number;
}) {
  const { autoplayError } = useControls({
    /**
     * 0 — no error, will score more points than a human can wait to count.
     * 25 - will score ~8 points.
     * 50 - will score ~3 points.
     */
    autoplayError: {
      value: 0,
      step: 1,
    },
  });
  const defaultTileSize = 100;
  const startOffset = defaultTileSize + defaultTileSize / 4;
  const [direction, setDirection] = useState(-1);

  useFrame((state, delta) => {
    if (!movingTileMeshRef.current) return;

    const mesh = movingTileMeshRef.current;

    const axis = index % 2 === 0 ? 'x' : 'z';
    const addedPosition = delta * speedOfMovingTile;
    mesh.position[axis] += addedPosition * direction;

    if (autoplay) {
      if (lastCube) {
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

    if (Math.abs(mesh.position[axis]) >= startOffset) {
      setDirection((prev) => -prev);
      // Is this `mesh.position.clamp` call necessary? Seems to work the same way without it.
      mesh.position.clamp(
        new Vector3(-startOffset, Number.NEGATIVE_INFINITY, -startOffset),
        new Vector3(startOffset, Number.POSITIVE_INFINITY, startOffset),
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

    mesh.position.y = index * config.tileHeight;
    const even = index % 2 === 0;
    mesh.position.set(
      even ? startOffset : mesh.position.x,
      index * config.tileHeight,
      !even ? startOffset : mesh.position.z,
    );
  }, [index, movingTileMeshRef, previousTile.position.x, previousTile.position.z, startOffset]);

  return (
    <mesh ref={movingTileMeshRef} castShadow>
      <boxGeometry args={[previousTile.size.x, config.tileHeight, previousTile.size.y]} />
      <meshPhongMaterial color={getTileColor(index)} />
    </mesh>
  );
}

function nearlyEqual(a: number, b: number, epsilon: number) {
  const diff = Math.abs(a - b);

  return diff < epsilon;
}
