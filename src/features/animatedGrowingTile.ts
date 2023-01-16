import { useRef } from 'react';

import { TileProps } from '../components/Tile';

import type { Vector2 } from 'three';

//* This feature needs a refactor, since some properties can be reused from `features/combos.ts` logic, and the performance could use an improve too.

const animatedGrowingTileConfig = {
  duration: 400,
} as const;

export function getAnimatedTileAddedPosition(
  addedPositionSign: 1 | 0 | -1 | undefined,
  sizeDifference: ReturnType<typeof useTileGrowingAnimation>['sizeDifference'],
  addedSize: React.MutableRefObject<{ x: number; y: number }>,
) {
  if (!sizeDifference) {
    return {
      x: 0,
      y: 0,
    };
  }

  const invertedAddedPositionSign = addedPositionSign ? addedPositionSign * -1 : NaN;

  const x = (sizeDifference.x / 2 - addedSize.current.x / 2) * invertedAddedPositionSign;
  const y = (sizeDifference.y / 2 - addedSize.current.y / 2) * invertedAddedPositionSign;

  return {
    x,
    y,
  };
}

export function getAnimatedTileSize(
  shouldAnimate: boolean,
  prevSize: TileProps['size'] | undefined,
  addedSize: React.MutableRefObject<{ x: number; y: number }>,
) {
  if (!shouldAnimate || !prevSize) return undefined;

  return {
    x: prevSize.x + addedSize.current.x,
    y: prevSize.y + addedSize.current.y,
  };
}

export function useTileGrowingAnimation({
  createdAt,
  prevSize,
  size,
  addedPositionSign,
}: {
  createdAt: AnimatedTileProps['createdAt'];
  prevSize: TileProps['size'] | undefined;
  size: TileProps['size'];
  addedPositionSign: AnimatedTileProps['addedPositionSign'];
}) {
  const addedSize = useRef({
    x: 0,
    y: 0,
  });

  let shouldAnimate = false;
  let sizeDifference: Vector2 | undefined = undefined;
  if (addedPositionSign === 0 || addedPositionSign === undefined) {
    return {
      shouldAnimate,
      addedSize,
      sizeDifference,
    };
  }
  if (createdAt) {
    const elapsed = Date.now() - createdAt;
    if (elapsed < animatedGrowingTileConfig.duration) {
      shouldAnimate = true;
      if (shouldAnimate && prevSize) {
        sizeDifference = size.clone().sub(prevSize);
        const isSizeDifferencePositive = sizeDifference.x > 0 || sizeDifference.y > 0;
        if (isSizeDifferencePositive) {
          shouldAnimate = true;
          const howMuchOfTheAnimationPassed = elapsed / animatedGrowingTileConfig.duration;
          const axisThatGrew = sizeDifference.x > 0 ? 'x' : 'y';
          addedSize.current[axisThatGrew] = howMuchOfTheAnimationPassed * sizeDifference.length();
        } else {
          shouldAnimate = false;
        }
      }
    } else {
      shouldAnimate = false;
    }
  }

  return {
    shouldAnimate,
    addedSize,
    sizeDifference,
  };
}

export interface AnimatedTileProps {
  /** serves as a starting point for the animation, if exists. */
  createdAt?: number;
  /** needed to determine the animation origin (or direction) */
  addedPositionSign?: 1 | 0 | -1;
}
