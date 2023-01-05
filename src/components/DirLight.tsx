import { useMemo } from 'react';
import { Vector3 } from 'three';

export function DirLight() {
  const d = 50;

  const dirLightPosition = useMemo(() => {
    const vector = new Vector3(-1, 1.75, -0.5);
    vector.multiplyScalar(30);
    return vector;
  }, []);

  return (
    <directionalLight
      color={'hsl(0.1, 10%, 95%)'}
      intensity={1}
      castShadow
      position={dirLightPosition}
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0001}
    >
      <orthographicCamera attach="shadow-camera" args={[-d, d, d, -d]} far={3500} />
    </directionalLight>
  );
}
