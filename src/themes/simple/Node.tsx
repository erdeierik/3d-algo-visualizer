import type { NodePartProps } from '../types';

export function SimpleNode({ materialRef }: NodePartProps) {
  return (
    <mesh>
      <sphereGeometry args={[0.4, 24, 24]} />
      <meshStandardMaterial ref={materialRef} />
    </mesh>
  );
}
