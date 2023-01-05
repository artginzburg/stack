import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Box3, Mesh, Vector2, Vector3 } from 'three';

import { FadingTile } from '../classes/FadingTile';
import { PerfectEffect } from '../classes/PerfectEffect';
import { Tile } from '../classes/Tile';
import { BaseTile } from './BaseTile';
import { CameraController } from './CameraController';
import { DirLight } from './DirLight';
import { FrameController } from './FrameController';
import { MovingTile } from './MovingTile';

export function Game({ autoplay }: { autoplay?: boolean }) {
  const debug = window.location.search.includes('debug');

  const [score, setScore] = useState('0');
  const [index, setIndex] = useState(0);
  const [previousTile, setPreviousTile] = useState({
    size: new Vector2(100, 100),
    center: new Vector3(0, 0, 0),
  });
  const [cubes, setCubes] = useState<(Tile | FadingTile)[]>([]);
  const [effects, setEffects] = useState<PerfectEffect[]>([]);

  const movingTileMeshRef = useRef<Mesh>(null);

  function cutBox() {
    if (!movingTileMeshRef.current) return;

    // calculate previous and current tiles centers
    const currentTile = new Box3().setFromObject(movingTileMeshRef.current);
    const currentCenter = new Vector3();
    movingTileMeshRef.current.localToWorld(currentCenter);
    currentTile.getCenter(currentCenter);

    // get vectors difference
    const diff = currentCenter.clone().sub(previousTile.center);

    const absDiffX = Math.abs(diff.x);
    const absDiffZ = Math.abs(diff.z);

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

      spawnEffect(previousTile.center, previousTile.size);
    } else {
      const cutSizeX = previousTile.size.x - newSize.x;
      const cutSizeZ = previousTile.size.y - newSize.y;

      const signX = currentCenter.x - previousTile.center.x < 0 ? -1 : 1;
      const signZ = currentCenter.z - previousTile.center.y < 0 ? -1 : 1;

      const position = new Vector3(
        cutSizeX ? currentCenter.x + (signX * newSize.x) / 2 : previousTile.center.x,
        previousTile.center.y + 10,
        cutSizeZ ? currentCenter.z + (signZ * newSize.y) / 2 : previousTile.center.z,
      );

      const cutTile = new FadingTile(
        position,
        new Vector2(cutSizeX || previousTile.size.x, cutSizeZ || previousTile.size.y),
        index,
      );

      setCubes((prev) => [...prev, cutTile]);
    }

    const newCenter = new Vector3(
      previousTile.center.x + diff.x / 2,
      previousTile.center.y + 10,
      previousTile.center.z + diff.z / 2,
    );

    const newTile = new Tile(newCenter, newSize, index);

    setCubes((prev) => [...prev, newTile]);

    setPreviousTile({
      center: newCenter,
      size: newSize,
    });

    setScore(String(index + 1));
  }

  function moveUp() {
    setIndex((prev) => prev + 1);
  }

  function spawnEffect(position: Vector3, size: Vector2) {
    const plane = new PerfectEffect(position, size, () => {
      const newEffects = [...effects];
      newEffects.splice(newEffects.indexOf(plane, 1));
      setEffects(newEffects);
    });
    setEffects([...effects, plane]);
  }

  function reset() {
    setIndex(-1);
    setCubes([]);
    setPreviousTile({
      center: new Vector3(0, 0, 0),
      size: new Vector2(100, 100),
    });
    setScore(String(0));
  }

  return (
    <div style={{ height: '100vh', background: '#000' }}>
      <div
        style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '5rem',
          position: 'fixed',
          top: '2rem',
          width: '100%',
        }}
      >
        {score}
      </div>
      <Canvas
        camera={{
          fov: 25, // 45
          near: 1,
          far: 2000,
          position: [-250, 250, -250],
        }}
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
        <FrameController cubes={cubes} effects={effects} />
        <ambientLight color="#ccc" intensity={0.4} />
        <DirLight />
        <BaseTile />
        <MovingTile
          size={[100, 100]}
          index={index}
          movingTileMeshRef={movingTileMeshRef}
          previousTile={previousTile}
          autoplay={autoplay}
          lastCube={cubes.at(-1)}
        />
        {cubes.map((tile) => (
          <primitive key={tile.mesh.id} object={tile.mesh} />
        ))}
        {effects.map((plane) => (
          <primitive key={plane.mesh.id} object={plane.mesh} />
        ))}
        {debug && <OrbitControls target={previousTile.center} />}
      </Canvas>
    </div>
  );
}
