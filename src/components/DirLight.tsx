import { useThree } from '@react-three/fiber';
import { useState } from 'react';
import { Object3D } from 'three';

import { magicValues } from '../shared/constants';

import type { PreviousTile } from './types';

export function DirLight({ previousTile }: { previousTile: PreviousTile }) {
  //* Uncomment the ref (also lower in code) and the helper to debug lighting.
  // const lightCameraRef = useRef<OrthographicCamera>(null);
  // useHelper(lightCameraRef as any, CameraHelper);

  const d = 150;

  const camera = useThree((state) => state.camera);

  const [lightTarget] = useState(() => new Object3D());

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
        position={[-50, 50 + 10, 50]}
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
