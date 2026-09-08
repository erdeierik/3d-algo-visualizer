import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { Mesh } from 'three';
import { useSettingsStore } from '../../store/settingsStore';

interface TreeNode3DProps {
  value: number;
  targetX: number;
  targetY: number;
  color: string;
}

export function TreeNode3D({ value, targetX, targetY, color }: TreeNode3DProps) {
  const meshRef = useRef<Mesh>(null);
  const showLabels = useSettingsStore((s) => s.showLabels);
  const animate = useSettingsStore((s) => s.animate);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const factor = animate ? Math.min(delta * 6, 1) : 1;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * factor;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * factor;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.4, 24, 24]} />
      <meshStandardMaterial color={color} />
      {showLabels && (
        <Text position={[0, 0, 0.5]} fontSize={0.3}>
          {value}
        </Text>
      )}
    </mesh>
  );
}
