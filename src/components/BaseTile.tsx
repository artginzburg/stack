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
    // TODO think about adding `frustumCulled={false}` to this mesh. Otherwise, it gets clipped of at the bottom, after the zoom out is activated. P.S. Actually, why don't we just set it to false only when the game is ended and zoomed out? Perfect.
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={boxArgs} />
      <meshPhongMaterial color={theme.tile(-1)} />
    </mesh>
  );
}
