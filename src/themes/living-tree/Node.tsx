// src/themes/living-tree/Node.tsx
import { BARK_COLOR } from './palette';
import type { NodePartProps } from '../types';

export function LivingTreeNode({ materialRef, detail }: NodePartProps) {
  return (
    <group>
      <mesh scale={[1, 0.92, 1]}>
        <sphereGeometry args={[0.38, 20, 16]} />
        <meshStandardMaterial ref={materialRef} roughness={0.55} />
      </mesh>

      {detail === 'rich' && (
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.03, 0.045, 0.2, 6]} />
          <meshStandardMaterial color={BARK_COLOR} roughness={0.9} />
        </mesh>
      )}
    </group>
  );
}
