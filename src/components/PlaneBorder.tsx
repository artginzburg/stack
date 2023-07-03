import { Plane } from '@react-three/drei';
import { Vector3Tuple } from 'three';

export function PlaneBorder({
  children,
  borderWidth,
  ...props
}: Parameters<typeof Plane>[0] & { borderWidth: number }) {
  const positionAsTuple = props.position as Vector3Tuple;

  const size = props.args;
  const width = size?.[0]!;
  const height = size?.[1]!;

  const argsForLeftAndRightPlanes: Parameters<typeof Plane>[0]['args'] = [
    width + borderWidth * 2,
    borderWidth,
  ];
  const argsForTopAndBottomPlanes: Parameters<typeof Plane>[0]['args'] = [borderWidth, height];

  /** Maybe it's actually right plane, not sure. */
  const positionZOfLeftPlane = height / 2 + borderWidth / 2;
  /** Maybe it's actually bottom plane, not sure. */
  const positionXOfTopPlane = width / 2 + borderWidth / 2;

  return (
    <group position={positionAsTuple}>
      <Plane {...props} args={argsForLeftAndRightPlanes} position={[0, 0, positionZOfLeftPlane]}>
        {children}
      </Plane>
      <Plane
        {...props}
        args={argsForLeftAndRightPlanes}
        position={[0, 0, positionZOfLeftPlane * -1]}
      >
        {children}
      </Plane>
      <Plane {...props} args={argsForTopAndBottomPlanes} position={[positionXOfTopPlane, 0, 0]}>
        {children}
      </Plane>
      <Plane
        {...props}
        args={argsForTopAndBottomPlanes}
        position={[positionXOfTopPlane * -1, 0, 0]}
      >
        {children}
      </Plane>
    </group>
  );
}
