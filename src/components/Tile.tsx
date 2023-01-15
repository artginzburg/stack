import { Triplet, useBox } from '@react-three/cannon';
import { useState } from 'react';
import { Mesh, Vector2, Vector3 } from 'three';

import { getTileColor } from '../shared/colors';
import { config } from '../shared/constants';

export interface TileProps {
  position: Vector3;
  size: Vector2;
  index: number;
}
export function ReactTile({ position, size, index }: TileProps) {
  if (process.env.NODE_ENV !== 'production') {
    // I know for sure that NODE_ENV is never going to change during one run of the game script, so it's OK to have a conditional hook:
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRunDevOnlyTestsForTile({ position, size, index });
  }

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

/** @todo exclude tests into a different file. */
function useRunDevOnlyTestsForTile({ index, ...tileProps }: TileProps) {
  const [testsAlreadyRan, setTestsAlreadyRan] = useState({
    testTilePosition: false,
  });

  if (testsAlreadyRan['testTilePosition']) return;
  try {
    testTilePosition(tileProps);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Warning at Tile ${index}`, error.message, error.cause);
    }
    setTestsAlreadyRan((prev) => ({ ...prev, testTilePosition: true }));
  }
}

/** This test is necessary because the new "Tile Growing" feature (a.k.a. "combo") makes a perfect example of position miscalculation. */
function testTilePosition({ size, position }: Pick<TileProps, 'position' | 'size'>) {
  if (size.x === 100 && size.y === 100) {
    if (position.x !== 0 || position.z !== 0) {
      throw new Error('Tile size and position mismatch', {
        cause: {
          expects: 'tile position to be 0 when size is 100',
          position,
        },
      });
    }
  }
}
