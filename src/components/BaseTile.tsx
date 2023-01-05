export function BaseTile() {
  return (
    <mesh
      position={[
        0,
        -265, // -245
        0,
      ]}
      receiveShadow
    >
      <boxGeometry
        args={[
          100,
          520, // 500
          100,
        ]}
      />
      <meshPhongMaterial color={`hsl(0, 50%, 50%)`} />
    </mesh>
  );
}
