import { Mesh } from 'three';

import { round } from '../../tools/round';

export function MovingTilePosition(movingTileMeshRef: React.RefObject<Mesh>) {
  return (
    <p style={{ position: 'fixed', top: 50, left: 20, color: 'white' }}>
      x: {movingTileMeshRef.current && round(movingTileMeshRef.current.position.x)} z:{' '}
      {movingTileMeshRef.current && round(movingTileMeshRef.current.position.z)}
    </p>
  );
}
