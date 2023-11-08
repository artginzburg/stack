import { Triplet, useBox } from '@react-three/cannon';
import { Mesh } from 'three';

import { config } from '../shared/constants';
import { TileColor } from './ColorSystemTests';

export function BaseTile({ tileColors }: { tileColors: TileColor[] }) {
  const initialBoxHeight = 530; // TODO set to 170 (config.tileHeight * 10) after the gradient is implemented, as it seems to be exactly the value used in the original game.

  const boxArgs: Triplet = [
    100,
    initialBoxHeight - config.tileHeight, // 500
    100,
  ];

  const [ref] = useBox<Mesh>(() => ({
    position: [
      0,
      -initialBoxHeight / 2, // -245
      0,
    ],
    type: 'Static',
    args: boxArgs,
  }));

  return (
    // TODO think about adding `frustumCulled={false}` to this mesh. Otherwise, it gets clipped of at the bottom, after the zoom out is activated. P.S. Actually, why don't we just set it to false only when the game is ended and zoomed out? Perfect.
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={boxArgs} />
      <meshPhongMaterial color={tileColors[0].currentColor.toString()} />
    </mesh>
  );
}
