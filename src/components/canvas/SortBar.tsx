import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

const SPACING = 1.2;

interface SortBarProps {
  index: number;
  targetHeight: number;
  color: string;
}

export function SortBar({ index, targetHeight, color }: SortBarProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const factor = Math.min(delta * 6, 1);
    const current = meshRef.current.scale.y;
    meshRef.current.scale.y = current + (targetHeight - current) * factor;
    meshRef.current.position.y = meshRef.current.scale.y / 2;
  });

  return (
    <mesh ref={meshRef} position={[index * SPACING, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
