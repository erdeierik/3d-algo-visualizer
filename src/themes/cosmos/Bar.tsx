// src/themes/cosmos/Bar.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { EMISSIVE_FACTOR } from './palette';
import type { BarPartProps } from '../types';

export function CosmosBar({ heightRef, materialRef }: BarPartProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    const mesh = meshRef.current;
    if (mesh) {
      const height = heightRef.current; // a közös SortBar már frissítette (renderPriority = -1)
      mesh.scale.y = height;
      mesh.position.y = height / 2;
    }

    // a kiemelés nem csak színváltás, hanem SAJÁT FÉNY — sötét háttéren ez adja az izzást,
    // post-processing nélkül (temak-poc.md 3.)
    const material = materialRef.current;
    if (material) material.emissive.copy(material.color).multiplyScalar(EMISSIVE_FACTOR);
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.6, 1, 0.6]} />
      <meshStandardMaterial ref={materialRef} metalness={0.55} roughness={0.28} />
    </mesh>
  );
}
