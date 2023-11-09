import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm'; // changes from .cjs to .esm to prevent troubles with importing THREE from inside the module.

const ThreeStars = () => {
  const ref = useRef<THREE.Points>(null);

  const [sphere] = useState(
    () => random.inSphere(new Float32Array(100), { radius: 200 }) as Float32Array,
  );

  useFrame((state, delta) => {
    if (!ref.current) return;

    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  const cameraPosition = useThree((state) => state.camera.position);

  return (
    <group rotation={[0, 0, Math.PI / 4]} position={[0, cameraPosition.y - 350, 0]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        {/* <Point size={10} attach={'geometry'} /> */}

        {/* <boxGeometry args={[10, 30, 10]} /> */}
        {/* <PointMaterial
          transparent={true}
          color="#f6b4ff"
          size={10} // This was set to 0.013, which is a ridiculously low amount for the Stack coordinate space. This is why nothing was rendering.
          sizeAttenuation={true}
          depthWrite={false}
          // vertexColors
        /> */}
        <pointsMaterial
          color="#eee"
          size={5}
          sizeAttenuation={false}
          depthWrite={false}
          clipIntersection // for being the background-most layer
        />
      </Points>
    </group>
  );
};

export default ThreeStars;
