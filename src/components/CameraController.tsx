import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import { Vector3 } from 'three';

import { config, magicValues } from '../shared/constants';
import { easeOutCirc } from '../tools/easing';

import type { PreviousTile } from './types';

const cameraConfig: {
  /**
   * A math function for easing the camera animation. For a quick start, you can get them at https://easings.net
   *
   * I think `easeOutCirc` looks the most like the original game — quick and exponential at the start, but very "prolonged" and linear at the end. Though in the original, the start of the animation seems a little less sharp than in `easeOutCirc`.
   */
  easing: (x: number) => number;
  animationTime: number;
} = {
  /** was just `ease = (t: number) => t * t * (3.0 - 2.0 * t)` in the first version of the remake */
  easing: easeOutCirc,
  /** was `0.5` in the first version of the remake */
  animationTime: 0.8,
} as const;

export function CameraController({
  previousTile,
  isEnded,
}: {
  previousTile: PreviousTile;
  isEnded: boolean;
}) {
  const skipFirst = 2;
  const skipFirstOffset = skipFirst * config.tileHeight;

  // const [point, setPoint] = useState(new Vector3());
  const [start, setStart] = useState(new Vector3());
  const [destination, setDestination] = useState(new Vector3());
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

  const [initialViewportDistance, setInitialViewportDistance] = useState(0);

  const camera = useThree((state) => state.camera);

  useThree(({ camera, viewport, size }) => {
    if (initialViewportDistance === 0) {
      setInitialViewportDistance(viewport.distance);
    }

    if (isEnded) {
      const newZoom = initialViewportDistance / viewport.distance;
      camera.position.set(-250, destination.y - 150 / newZoom, -250);
      camera.zoom = newZoom;
      camera.updateProjectionMatrix();
      return;
    }

    const minimumZoom = 1;

    const breakRoundWidth = 3;
    const fineTunedWidthDivider = 800;

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

  useEffect(() => {
    const newPoint = new Vector3(0, previousTile.position.y, 0);
    // setPoint(newPoint);
    setTimer(0);
    setStart(camera.position.clone());
    setDestination(newPoint.clone().add(offset));
  }, [camera, offset, previousTile.position.y]);

  useFrame((state, delta) => {
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

  return null;
}
