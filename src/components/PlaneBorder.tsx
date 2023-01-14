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

  return (
    <>
      <Plane
        {...props}
        args={[width + borderWidth * 2, borderWidth]}
        position={[
          positionAsTuple[0],
          positionAsTuple[1],
          positionAsTuple[2] + height / 2 + borderWidth / 2,
        ]}
      >
        {children}
      </Plane>
      <Plane
        {...props}
        args={[width + borderWidth * 2, borderWidth]}
        position={[
          positionAsTuple[0],
          positionAsTuple[1],
          positionAsTuple[2] - height / 2 - borderWidth / 2,
        ]}
      >
        {children}
      </Plane>
      <Plane
        {...props}
        args={[borderWidth, height]}
        position={[
          positionAsTuple[0] + width / 2 + borderWidth / 2,
          positionAsTuple[1],
          positionAsTuple[2],
        ]}
      >
        {children}
      </Plane>
      <Plane
        {...props}
        args={[borderWidth, height]}
        position={[
          positionAsTuple[0] - width / 2 - borderWidth / 2,
          positionAsTuple[1],
          positionAsTuple[2],
        ]}
      >
        {children}
      </Plane>
    </>
  );
}
