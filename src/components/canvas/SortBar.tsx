import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { Group, Mesh } from 'three';

const SPACING = 1.2;
const LABEL_GAP = 0.3;

interface SortBarProps {
  index: number;
  value: number;
  targetHeight: number;
  color: string;
}

export function SortBar({ index, value, targetHeight, color }: SortBarProps) {
  const meshRef = useRef<Mesh>(null);
  const labelRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!meshRef.current || !labelRef.current) return;
    const factor = Math.min(delta * 6, 1);
    const current = meshRef.current.scale.y;
    const next = current + (targetHeight - current) * factor;
    meshRef.current.scale.y = next;
    meshRef.current.position.y = next / 2;
    labelRef.current.position.y = next + LABEL_GAP;
  });

  return (
    <group position={[index * SPACING, 0, 0]}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <group ref={labelRef}>
        <Text fontSize={0.32} color="white" anchorX="center" anchorY="bottom">
          {value}
        </Text>
      </group>
    </group>
  );
}
