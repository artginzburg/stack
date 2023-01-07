import { useFrame } from '@react-three/fiber';
import { DoubleSide, Vector2, Vector3 } from 'three';

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
                materialOpacity: effect.materialOpacity - delta * 0.7,
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
  const borderWidth = 5;
  const addedSize = borderWidth * 2;

  if (materialOpacity <= 0) {
    return null;
  }

  return (
    <mesh position={[position.x, position.y - borderWidth, position.z]} rotation-x={Math.PI / 2}>
      <planeGeometry args={[size.x + addedSize, size.y + addedSize]} />
      <meshBasicMaterial color="#fff" side={DoubleSide} transparent opacity={materialOpacity} />
    </mesh>
  );
}
