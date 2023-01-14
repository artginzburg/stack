import { Vector2, Vector3 } from 'three';

import { TileProps } from '../components/Tile';
import { PreviousTile } from '../components/types';

export namespace ComboConfig {
  export const streak = {
    /** @default 7 */
    startAfter: 7,
    /** It seems that in the original game the bonus is not static. Check later. */
    sizeBonusPercentage: 0.2,
  } as const;
  export const effect = {
    /** @default 4 */
    startAt: 4,
    endAt: streak.startAfter,
  } as const;
}

/** @todo add animation of size increasing. */
export function getNewSizeAndPositionOnComboStreak(
  defaultPreviousTile: PreviousTile,
  newStaticTile: TileProps,
) {
  const sizeBonusOnComboStreak =
    defaultPreviousTile.size.x * ComboConfig.streak.sizeBonusPercentage;

  const smallerSide = newStaticTile.size.x < newStaticTile.size.y ? 'x' : 'y';
  const addedSize = new Vector2();
  addedSize[smallerSide] = sizeBonusOnComboStreak;
  const maxSize = defaultPreviousTile.size;
  const increasedSize = newStaticTile.size.clone().add(addedSize).min(maxSize);

  const addedPosition = new Vector3();

  const smallerSideIn3d = smallerSide === 'y' ? 'z' : smallerSide;

  /** Makes sure that the size is always extended towards the side that needs the additional size the most */
  const addedPositionSign = newStaticTile.position[smallerSideIn3d] > 0 ? -1 : 1;

  const wantToAddPosition = Math.abs(sizeBonusOnComboStreak / 2);
  const sizeActuallyIncreasedBy = newStaticTile.size.clone().sub(increasedSize);
  const canAddPosition = Math.abs(sizeActuallyIncreasedBy[smallerSide] / 2);

  addedPosition[smallerSideIn3d] = Math.min(wantToAddPosition, canAddPosition) * addedPositionSign;

  const correctedPosition = newStaticTile.position.clone().add(addedPosition);

  return {
    size: increasedSize,
    position: correctedPosition,
  };
}
