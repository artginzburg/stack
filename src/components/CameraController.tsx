import { type RootState, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import { Vector3 } from 'three';
import { lerp } from 'three/src/math/MathUtils';

import { config, magicValues } from '../shared/constants';
import { easeInOutSineEaseOutCirc } from '../tools/easing';

import type { PreviousTile } from './types';

const cameraConfig: {
  /**
   * A math function for easing the camera animation. For a quick start, you can get them at https://easings.net
   *
   * I think `easeOutCirc` looks the most like the original game — quick and exponential at the start, but very "prolonged" and linear at the end. Though in the original, the start of the animation seems a little less sharp than in `easeOutCirc`. That's why I mixed with `easeInOutSine`. Looks a lot more like the original now.
   */
  easing: (x: number) => number;
  /** The animation duration */
  animationTime: number;
  /** Can't be changed at runtime. Intentionally: to not do almost any work if disabled. */
  startAppear: boolean;
} = {
  /** was just `ease = (t: number) => t * t * (3.0 - 2.0 * t)` in the first version of the remake */
  easing: easeInOutSineEaseOutCirc,
  /** was `0.5` in the first version of the remake */
  animationTime: 1.3,
  startAppear: true,
} as const;

export function CameraController({
  previousTile,
  isStarted,
  isEnded,
  index,
}: {
  previousTile: PreviousTile;
  isStarted: boolean;
  isEnded: boolean;
  index: number;
}) {
  const [destination, setDestination] = useState(new Vector3());

  useCameraZoomController({ isEnded, destination, index });

  useCameraPositionController({ previousTile, destination, setDestination, isStarted, isEnded });

  return null;
}

function useCameraZoomController({
  isEnded,
  destination,
  index,
}: {
  isEnded: boolean;
  destination: Vector3;
  index: number;
}) {
  const [initialViewportDistance, setInitialViewportDistance] = useState(0);

  const zoomOutTiming = 0.03;
  /** The minimum score to trigger a zoom out on game end (inclusive). `15` matches the original game. */
  const zoomOutMinimumScore = 15;

  useThree(({ camera, viewport, size }) => {
    if (initialViewportDistance === 0) {
      setInitialViewportDistance(viewport.distance);
    }

    if (isEnded) {
      if (index < zoomOutMinimumScore) return;
      // Zooming out

      const newZoom = initialViewportDistance / viewport.distance;
      camera.zoom = lerp(camera.zoom, newZoom, zoomOutTiming);

      const newCameraPosition = new Vector3(-250, destination.y - 150 / newZoom, -250);
      camera.position.lerp(newCameraPosition, zoomOutTiming / 2);

      camera.updateProjectionMatrix(); // is this line necessary? Seems like nothing changes without it.
      return;
    }

    const minimumZoom = 1;

    const breakRoundWidth = 10;
    const fineTunedWidthDivider = 750;

    const newZoom =
      Math.round((size.width / fineTunedWidthDivider) * breakRoundWidth) / breakRoundWidth +
      minimumZoom;

    const mobileBreakpoint = 700;
    const mobileMultiplier = 1.3;
    const desktopMultiplier = 1.5;

    const limitedZoom =
      newZoom * (size.width > mobileBreakpoint ? desktopMultiplier : mobileMultiplier);

    camera.zoom = limitedZoom;
    camera.updateProjectionMatrix();
  });
}

function useCameraPositionController({
  previousTile,
  destination,
  setDestination,
  isStarted,
  isEnded,
}: {
  previousTile: PreviousTile;
  destination: Vector3;
  setDestination: React.Dispatch<React.SetStateAction<Vector3>>;
  isStarted: boolean;
  isEnded: boolean;
}) {
  const skipFirst = 2;
  const skipFirstOffset = skipFirst * config.tileHeight;

  const [start, setStart] = useState(new Vector3());

  const magicTileHeightMultiplierForDefaultOffset = 2.5;
  const defaultOffset = useMemo(
    () =>
      new Vector3(
        -250,
        250 +
          magicValues.pointOfViewFix -
          config.tileHeight * magicTileHeightMultiplierForDefaultOffset +
          25,
        -250,
      ),
    [],
  );
  const [offset] = useState(defaultOffset);
  const [timer, setTimer] = useState<number>(0);
  const [animationTime] = useState(cameraConfig.animationTime);

  const camera = useThree((state) => state.camera);

  const { shouldStartAppear, onFrame: onFrameStartAppear } = useAppearAnimation({
    defaultOffset,
    skipFirstOffset,
    isStarted,
    timer,
    setTimer,
    camera,
  });

  useEffect(() => {
    if (shouldStartAppear) return;
    // Fires off on load, then with each cut tile, then on restart.

    const newPoint = new Vector3(0, previousTile.position.y, 0);
    setTimer(0);
    setStart(camera.position.clone());
    setDestination(newPoint.clone().add(offset));
  }, [camera, offset, previousTile.position.y, setDestination, shouldStartAppear]);

  useFrame((state, delta) => {
    if (onFrameStartAppear?.(delta)) return;

    if (isEnded) return; // When the game is ended, the zoom controller should take precedence over both the camera position and the zoom. Without this line, the zoom controller would not be able to update the camera position until `timer` reaches `animationTime`.

    if (previousTile.position.y < skipFirstOffset) {
      camera.position.y = defaultOffset.y + skipFirstOffset;
      return;
    }

    if (timer < animationTime) {
      const change = cameraConfig.easing(timer / animationTime);
      camera.position.lerpVectors(start, destination, change);
      setTimer((prev) => prev + delta);
    }
  });
}

function useAppearAnimation({
  defaultOffset,
  skipFirstOffset,
  isStarted,
  timer,
  setTimer,
  camera,
}: {
  defaultOffset: Vector3;
  skipFirstOffset: number;
  isStarted: boolean;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  camera: RootState['camera'];
}) {
  if (!cameraConfig.startAppear) {
    return {
      shouldStartAppear: undefined,
      onFrame: undefined,
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [shouldStartAppear, setShouldStartAppear] = useState(true);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const startAppearStartingPoint = useMemo(
    () => new Vector3(defaultOffset.x, 1000, defaultOffset.z),
    [defaultOffset.x, defaultOffset.z],
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const startAppearDestination = useMemo(
    () => defaultOffset.clone().add(new Vector3(0, skipFirstOffset, 0)),
    [defaultOffset, skipFirstOffset],
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!isStarted) {
      setShouldStartAppear(true);
    }
  }, [isStarted]);

  const onFrame = (delta: number): boolean => {
    if (!shouldStartAppear) return false;
    // Do appear.

    const startAppearDuration = 1;

    if (timer < startAppearDuration) {
      // Animate appear.
      const change = cameraConfig.easing(timer / startAppearDuration);
      camera.position.lerpVectors(startAppearStartingPoint, startAppearDestination, change);
      setTimer((prev) => prev + delta);
    } else {
      // Finish appear.
      setShouldStartAppear(false);
    }

    return true;
  };

  return {
    shouldStartAppear,
    onFrame,
  };
}
