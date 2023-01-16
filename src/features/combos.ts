import { axis2ToAxis3, toVector2 } from '../tools/vectorConversion';

import type { TileProps } from '../components/Tile';
import type { PreviousTile } from '../components/types';

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

export function getNewSizeAndPositionOnComboStreak(
  defaultPreviousTile: PreviousTile,
  newStaticTile: TileProps,
): Pick<TileProps, 'size' | 'position' | 'addedPositionSign'> {
  //* 1. Determine which direction should we increase size to: x-, x+, y-, y+.
  //* 2. Determine how much space does this direction have left.
  //* 3. Add this space to the size, or the minimum bonus if it's smaller than leftover space.
  //* 4. Add half the bonus size to position taking direction sign (-/+) into account.

  const direction = determineDirectionOfSizeIncrease(newStaticTile);

  const { distanceToBoundary } = determineDistanceToBoundaryByDirection(direction, newStaticTile);

  const { addedSize, sizeWithBonus } = addBonusToSize(
    direction,
    distanceToBoundary,
    newStaticTile,
    defaultPreviousTile,
  );

  const { correctedPosition } = correctPositionForSizeBonus(direction, addedSize, newStaticTile);

  return {
    size: sizeWithBonus,
    position: correctedPosition,
    addedPositionSign: direction.sign,
  };
}

function determineDirectionOfSizeIncrease(newStaticTile: TileProps) {
  const smallerSide = `${newStaticTile.size.x < newStaticTile.size.y ? 'x' : 'y'}` as const;
  const smallerSideIn3d = axis2ToAxis3(smallerSide);

  const directionSign = Math.sign(newStaticTile.position[smallerSideIn3d] * -1);
  const directionSignString = `${directionSign > 0 ? '+' : '-'}` as const;

  const directionString = `${smallerSide}${directionSignString}` as const;

  const direction = {
    axis: smallerSide,
    sign: directionSign,
    signString: directionSignString,
    string: directionString,
    toString: () => directionString,
  };

  return direction;
}

/** @returns the absolute distance to boundary. */
function determineDistanceToBoundaryByDirection(
  direction: ReturnType<typeof determineDirectionOfSizeIncrease>,
  newStaticTile: TileProps,
) {
  const positionBoundary = {
    min: -100,
    max: 100,
  } as const;

  const relevantBoundary =
    direction.signString === '+' ? positionBoundary.max : positionBoundary.min;

  const relevantSize = newStaticTile.size[direction.axis];

  /** This is not the final distance! It does not take position into account yet. */
  const relevantDistanceToBoundaryOnlyCalculatedBySize = Math.abs(
    direction.signString === '+'
      ? relevantBoundary - relevantSize
      : relevantBoundary + relevantSize,
  );

  const newStaticTilePositionAsVector2 = toVector2(newStaticTile.position);

  const relevantPosition = newStaticTilePositionAsVector2[direction.axis];

  const distanceToBoundaryInTheOppositeDirection = Math.abs(
    relevantPosition + (relevantDistanceToBoundaryOnlyCalculatedBySize / 2) * direction.sign,
  );
  // /** Useful for debugging. */
  // const isTileTouchingABoundaryOnDirectionAxis =
  //   relevantPositionMinusDistanceToBoundaryOnlyBySize === 0;

  const distanceToBoundary =
    relevantDistanceToBoundaryOnlyCalculatedBySize - distanceToBoundaryInTheOppositeDirection;

  return {
    /** Sometimes it can be negative, which means that JS messed up the floating point calculation. It's almost unnoticeable, hence OK for now. */
    distanceToBoundary,
  };
}

function addBonusToSize(
  direction: ReturnType<typeof determineDirectionOfSizeIncrease>,
  distanceToBoundary: ReturnType<
    typeof determineDistanceToBoundaryByDirection
  >['distanceToBoundary'],
  newStaticTile: TileProps,
  defaultPreviousTile: PreviousTile,
) {
  const sizeBonusOnComboStreak =
    defaultPreviousTile.size.x * ComboConfig.streak.sizeBonusPercentage;

  const sizeToAdd = Math.min(sizeBonusOnComboStreak, distanceToBoundary);

  const sizeWithBonus = newStaticTile.size.clone();

  sizeWithBonus[direction.axis] = sizeWithBonus[direction.axis] + sizeToAdd;

  return { addedSize: sizeToAdd, sizeWithBonus };
}

function correctPositionForSizeBonus(
  direction: ReturnType<typeof determineDirectionOfSizeIncrease>,
  addedSize: ReturnType<typeof addBonusToSize>['addedSize'],
  newStaticTile: TileProps,
) {
  const correctedPosition = newStaticTile.position.clone();
  const directionAxisIn3d = axis2ToAxis3(direction.axis);
  correctedPosition[directionAxisIn3d] =
    correctedPosition[directionAxisIn3d] + (addedSize / 2) * direction.sign;

  return {
    correctedPosition,
  };
}
