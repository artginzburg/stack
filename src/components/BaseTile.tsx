import { Triplet, useBox } from '@react-three/cannon';
import { Mesh } from 'three';

import { getBaseTileColor } from '../shared/colors';

export function BaseTile() {
  const boxArgs: Triplet = [
    100,
    520, // 500
    100,
  ];

  const [ref] = useBox<Mesh>(() => ({
    position: [
      0,
      -265, // -245
      0,
    ],
    type: 'Static',
    args: boxArgs,
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={boxArgs} />
      <meshPhongMaterial color={getBaseTileColor(0)} />
    </mesh>
  );
}
