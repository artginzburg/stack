import { Triplet, useBox } from '@react-three/cannon';
import { Mesh } from 'three';

import { useTheme } from '../contexts/ThemeContext';
import { config } from '../shared/constants';

export function BaseTile() {
  const { theme } = useTheme();

  const boxArgs: Triplet = [
    100,
    530 - config.tileHeight, // 500
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
      <meshPhongMaterial color={theme.tile(-1)} />
    </mesh>
  );
}
