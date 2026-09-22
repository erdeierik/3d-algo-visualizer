import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Color, type Group, type MeshStandardMaterial } from 'three';
import { useSettingsStore } from '../../store/settingsStore';
import { useTheme } from '../../themes/registry';
import type { Detail, VisualState } from '../../themes/types';
import { SPACING } from './contentBounds';

const LABEL_GAP = 0.3;

interface SortBarProps {
  index: number;
  value: number;
  targetHeight: number;
  state: VisualState;
  detail: Detail;
}

export function SortBar({ index, value, targetHeight, state, detail }: SortBarProps) {
  const theme = useTheme();
  const showLabels = useSettingsStore((s) => s.showLabels);
  const animate = useSettingsStore((s) => s.animate);

  // a mai mesh.scale.y kezdőértéke 1 — a mount-beli látvány így marad azonos
  const heightRef = useRef(1);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const labelRef = useRef<Group>(null);

  const target = useMemo(() => new Color(theme.palette[state]), [theme, state]);

  useFrame((_, delta) => {
    const factor = animate ? Math.min(delta * 6, 1) : 1;
    heightRef.current += (targetHeight - heightRef.current) * factor;
    materialRef.current?.color.copy(target);
    if (labelRef.current) labelRef.current.position.y = heightRef.current + LABEL_GAP;
  }, -1);

  return (
    <group position={[index * SPACING, 0, 0]}>
      <theme.Bar heightRef={heightRef} materialRef={materialRef} detail={detail} />
      {showLabels && (
        <group ref={labelRef}>
          <Text fontSize={0.32} color={theme.labelColor} anchorX="center" anchorY="bottom">
            {value}
          </Text>
        </group>
      )}
    </group>
  );
}
