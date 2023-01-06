import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import { Box3, Mesh, Vector2, Vector3 } from 'three';

import { PerfectEffectProps, PerfectEffects } from './PerfectEffect';
import { BaseTile } from './BaseTile';
import { CameraController } from './CameraController';
import { DirLight } from './DirLight';
import { MovingTile } from './MovingTile';
import { ReactTile, TileProps } from './Tile';
import { FadingTiles } from './FadingTile';
import { round } from '../tools/round';
import { Physics } from '@react-three/cannon';
import { Score } from './Score';
import { Greeting } from './Greeting';

export function Game({ autoplay }: { autoplay?: boolean }) {
  const debug = window.location.search.includes('debug');

  const [index, setIndex] = useState(0);
  const defaultPreviousTile: Pick<TileProps, 'position' | 'size'> = useMemo(
    () => ({
      size: new Vector2(100, 100),
      position: new Vector3(),
    }),
    [],
  );
  const [staticTiles, setStaticTiles] = useState<TileProps[]>([]);
  const [fadingTiles, setFadingTiles] = useState<TileProps[]>([]);
  const [effects, setEffects] = useState<PerfectEffectProps[]>([]);

  const movingTileMeshRef = useRef<Mesh>(null);

  const previousTile = staticTiles.at(-1) ?? defaultPreviousTile;

  function cutBox() {
    if (!movingTileMeshRef.current) return;

    // calculate previous and current tiles centers
    const currentTile = new Box3().setFromObject(movingTileMeshRef.current);
    const currentCenter = new Vector3();
    movingTileMeshRef.current.localToWorld(currentCenter);
    currentTile.getCenter(currentCenter);

    // get vectors difference
    const diff = currentCenter.clone().sub(previousTile.position);

    const absDiffX = round(Math.abs(diff.x), 14); // JS messes up floating point calculation, which results in `x` or `z` being e.g. 3.552713678800501e-15 instead of 0. If it is not zero when it should be, the box will spawn in a physically impossible position and start glitching, or spawn one-sided. That's why I'm rounding to a precision that a human would not distinguish, but which rounds values really close to 0 to plain 0.
    const absDiffZ = round(Math.abs(diff.z), 14);

    const newSize = previousTile.size.clone();
    newSize.x -= absDiffX;
    newSize.y -= absDiffZ;

    if (newSize.x < 0 || newSize.y < 0) {
      reset();
      return;
    }

    // calculate absolute error
    const errorX = absDiffX / previousTile.size.x;
    const errorZ = absDiffZ / previousTile.size.y;

    // if error is less than arbitrary epsilon than don't cut the tile at all
    const eps = 0.05;
    if (errorX <= eps && errorZ <= eps) {
      diff.x = 0;
      diff.z = 0;
      newSize.x += absDiffX;
      newSize.y += absDiffZ;

      spawnEffect(previousTile.position, previousTile.size);
    } else {
      const cutSizeX = previousTile.size.x - newSize.x;
      const cutSizeZ = previousTile.size.y - newSize.y;

      const signX = currentCenter.x - previousTile.position.x < 0 ? -1 : 1;
      const signZ = currentCenter.z - previousTile.position.z < 0 ? -1 : 1;

      const position = new Vector3(
        cutSizeX ? currentCenter.x + (signX * newSize.x) / 2 : previousTile.position.x,
        previousTile.position.y + 10,
        cutSizeZ ? currentCenter.z + (signZ * newSize.y) / 2 : previousTile.position.z,
      );

      setFadingTiles((prev) => [
        ...prev,
        // Cut tile
        {
          position,
          size: new Vector2(cutSizeX || previousTile.size.x, cutSizeZ || previousTile.size.y),
          index,
        },
      ]);
    }

    const newCenter = new Vector3(
      previousTile.position.x + diff.x / 2,
      previousTile.position.y + 10,
      previousTile.position.z + diff.z / 2,
    );

    setStaticTiles((prev) => [
      ...prev,
      {
        position: newCenter,
        size: newSize,
        index,
      },
    ]);
  }

  function moveUp() {
    setIndex((prev) => prev + 1);
  }

  function spawnEffect(position: Vector3, size: Vector2) {
    setEffects((prev) => [
      ...prev,
      {
        position,
        size,
        materialOpacity: 1,
      },
    ]);
  }

  function reset() {
    setIndex(-1);
    setFadingTiles([]);
    setStaticTiles([]);
  }

  return (
    <div style={{ height: '100vh', background: '#000' }}>
      <Greeting index={index} />
      <Score index={index} />
      <Canvas
        camera={{
          fov: 25, // 45
          near: 1,
          far: 2000,
          position: [-250, 250, -250],
        }}
        orthographic
        // dpr={0.7}
        {...(autoplay
          ? {
              onClick: () => {
                cutBox();
                moveUp();
              },
            }
          : {
              onPointerDown: () => {
                cutBox();
                moveUp();
              },
            })}
        shadows="basic"
      >
        <CameraController previousTile={previousTile} />
        <ambientLight color="#ccc" intensity={0.4} />
        <DirLight />
        <MovingTile
          size={[100, 100]}
          index={index}
          movingTileMeshRef={movingTileMeshRef}
          previousTile={previousTile}
          autoplay={autoplay}
          lastCube={staticTiles.at(-1)}
        />
        <Physics gravity={[0, -400, 0]}>
          <BaseTile />
          {staticTiles.map((tile) => (
            <ReactTile key={tile.index} {...tile} />
          ))}
          <FadingTiles fadingTiles={fadingTiles} />
        </Physics>
        <PerfectEffects effects={effects} setEffects={setEffects} />
        {debug && <OrbitControls target={previousTile.position} />}
      </Canvas>
    </div>
  );
}
