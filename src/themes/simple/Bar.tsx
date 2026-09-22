import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import type { BarPartProps } from '../types';

export function SimpleBar({ heightRef, materialRef }: BarPartProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const height = heightRef.current; // a közös SortBar már frissítette (renderPriority = -1)
    mesh.scale.y = height;
    mesh.position.y = height / 2;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial ref={materialRef} />
    </mesh>
  );
}
