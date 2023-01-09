import { useFrame } from '@react-three/fiber';
import { BackSide, Vector2, Vector3 } from 'three';

import { config } from '../shared/constants';

/** @todo easing for the effect fade out */
const perfectEffectConfig = {
  /** was `5` in the first version of the remake */
  borderWidth: 4,
  /** was `2` in the first version of the remake */
  animationSpeed: 0.7,
} as const;

export function PerfectEffects({
  effects,
  setEffects,
}: {
  effects: PerfectEffectProps[];
  setEffects: React.Dispatch<React.SetStateAction<PerfectEffectProps[]>>;
}) {
  useFrame((state, delta) => {
    setEffects((prev) =>
      prev
        .map((effect) =>
          effect.materialOpacity < 0
            ? (null as any)
            : {
                ...effect,
                materialOpacity:
                  effect.materialOpacity - delta * perfectEffectConfig.animationSpeed,
              },
        )
        .filter(Boolean),
    );
  });

  return (
    <>
      {effects.map((effect) => (
        <PerfectEffect key={effect.position.y} {...effect} />
      ))}
    </>
  );
}

export interface PerfectEffectProps {
  position: Vector3;
  size: Vector2;
  materialOpacity: number;
}
function PerfectEffect({ position, size, materialOpacity }: PerfectEffectProps) {
  const addedSize = perfectEffectConfig.borderWidth * 2;

  if (materialOpacity <= 0) {
    return null;
  }

  return (
    <mesh
      position={[position.x, position.y - config.tileHeight / 2, position.z]}
      rotation-x={Math.PI / 2}
    >
      <planeGeometry args={[size.x + addedSize, size.y + addedSize]} />
      <meshBasicMaterial color="#fff" side={BackSide} transparent opacity={materialOpacity} />
    </mesh>
  );
}
