import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Color, type Group, type MeshStandardMaterial } from 'three';
import { useSettingsStore } from '../../store/settingsStore';
import { useTheme } from '../../themes/registry';
import type { Detail, VisualState } from '../../themes/types';

interface TreeNode3DProps {
  value: number;
  targetX: number;
  targetY: number;
  state: VisualState;
  detail: Detail;
}

export function TreeNode3D({ value, targetX, targetY, state, detail }: TreeNode3DProps) {
  const theme = useTheme();
  const showLabels = useSettingsStore((s) => s.showLabels);
  const animate = useSettingsStore((s) => s.animate);

  const groupRef = useRef<Group>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);

  const target = useMemo(() => new Color(theme.palette[state]), [theme, state]);

  useFrame((_, delta) => {
    const factor = animate ? Math.min(delta * 6, 1) : 1;
    const group = groupRef.current;
    if (group) {
      group.position.x += (targetX - group.position.x) * factor;
      group.position.y += (targetY - group.position.y) * factor;
    }
    materialRef.current?.color.copy(target);
  }, -1);

  return (
    <group ref={groupRef}>
      <theme.Node materialRef={materialRef} detail={detail} />
      {showLabels && (
        <Text position={[0, 0, 0.5]} fontSize={0.3} color={theme.labelColor}>
          {value}
        </Text>
      )}
    </group>
  );
}
