import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import { Vector3 } from 'three';
import type { PreviousTile } from './types';

export function CameraController({
  previousTile,
  isEnded,
}: {
  previousTile: PreviousTile;
  isEnded: boolean;
}) {
  const skipFirst = 2;
  const skipFirstOffset = skipFirst * 10;

  // const [point, setPoint] = useState(new Vector3());
  const [start, setStart] = useState(new Vector3());
  const [destination, setDestination] = useState(new Vector3());
  const defaultOffset = useMemo(() => new Vector3(-250, 250, -250), []);
  const [offset] = useState(defaultOffset);
  const [timer, setTimer] = useState<number>(0);
  const [animationTime] = useState(0.5);

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

    const ease = (t: number) => t * t * (3.0 - 2.0 * t);
    if (timer < animationTime) {
      const change = ease(timer / animationTime);
      camera.position.lerpVectors(start, destination, change);
      setTimer((prev) => prev + delta);
    }
  });

  return null;
}
