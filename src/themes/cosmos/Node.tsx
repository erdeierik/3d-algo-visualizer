// src/themes/cosmos/Node.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, type MeshBasicMaterial } from 'three';
import { EMISSIVE_FACTOR } from './palette';
import type { NodePartProps } from '../types';

export function CosmosNode({ materialRef, detail }: NodePartProps) {
  const ringRef = useRef<MeshBasicMaterial>(null);

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;
    material.emissive.copy(material.color).multiplyScalar(EMISSIVE_FACTOR);
    // a gyűrű követi a csomópont állapotszínét; plain módban a ref null, ezért az opcionális hívás
    ringRef.current?.color.copy(material.color);
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.42, 24, 20]} />
        <meshStandardMaterial ref={materialRef} metalness={0.5} roughness={0.3} />
      </mesh>

      {detail === 'rich' && (
        <mesh rotation={[Math.PI / 2.35, 0, 0.4]}>
          <torusGeometry args={[0.72, 0.014, 8, 48]} />
          <meshBasicMaterial
            ref={ringRef}
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}
