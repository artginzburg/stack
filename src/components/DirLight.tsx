import { useThree } from '@react-three/fiber';
import { useState } from 'react';
import { Object3D } from 'three';

import { config, magicValues } from '../shared/constants';

import type { PreviousTile } from './types';

export function DirLight({ previousTile }: { previousTile: PreviousTile }) {
  //* Uncomment the ref (also lower in code) and the helper to debug lighting.
  // const lightCameraRef = useRef<OrthographicCamera>(null);
  // useHelper(lightCameraRef as any, CameraHelper);

  const d = 150;

  const camera = useThree((state) => state.camera);

  const [lightTarget] = useState(() => new Object3D());

  /**
   * This corrects the shadow light Y position taking Tile Height into account, so that the lighting and shadows work the same for any Tile Height, like both 10 and 300.
   *
   * A magic value (by trial and error).
   *
   * Lighting was broken when changing tile height. What the hell needs to be done with light Y? For tile height 10, +10 works. For tile height 300, +50 works. Came up with (tileHeight - 10) / 7.25, but it works properly from 1 to 300 tileHeight, and breaks at around 450. But tile height will likely never be set to a value this big, so it's OK for now.
   */
  const addedShadowLightYPosition = (config.tileHeight - 10) / 7.25;

  return (
    <group
      position-y={Math.max(
        camera.position.y - 200 - magicValues.pointOfViewFix,
        previousTile.position.y,
      )} // using "previous tile position y" as minimum to not move camera on game end, when the scene zooms out.
    >
      <directionalLight
        color={'hsl(0.1, 10%, 95%)'}
        intensity={1}
        castShadow
        position={[-50, 50 + 10 + addedShadowLightYPosition, 50]}
        shadow-mapSize={[2048, 2048]}
        // shadow-bias={-0.0001} // this caused weird artifacts
        target={lightTarget}
      >
        <orthographicCamera
          // ref={lightCameraRef}
          attach="shadow-camera"
          args={[-d, d, d, -d]}
          far={500}
        />
      </directionalLight>
      <primitive object={lightTarget} position={[0, 0, 0]} />
      <directionalLight color="white" intensity={0.8} position={[-50, 50 + 30, 50]} />
    </group>
  );
}
