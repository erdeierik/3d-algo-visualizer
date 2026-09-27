import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Color, type Group, type MeshStandardMaterial } from 'three';
import { usePlayerStore } from '../../store/playerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTheme } from '../../themes/registry';
import type { Detail, VisualState } from '../../themes/types';
import { restartTiming, tweenAlpha } from './tween';

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
  // x és y mindig együtt kap új célt, ezért közös az időzítésük; új csomópont a (0,0)-ból úszik be
  const positionTween = useRef({ fromX: 0, fromY: 0, toX: 0, toY: 0, start: 0, duration: 0 });
  const colorTween = useRef({ from: new Color(), to: new Color(), start: 0, duration: 0, key: '' });
  const materialRef = useRef<MeshStandardMaterial>(null);

  const target = useMemo(() => new Color(theme.palette[state]), [theme, state]);

  useFrame(({ clock }, delta) => {
    const now = clock.elapsedTime * 1000;

    const p = positionTween.current;
    if (p.toX !== targetX || p.toY !== targetY) {
      // a MOSTANI érték, nem a group.position — az az előző képkockáé (fazis-12 3.3)
      const alpha = tweenAlpha(p, now, animate);
      p.fromX += (p.toX - p.fromX) * alpha;
      p.fromY += (p.toY - p.fromY) * alpha;
      p.toX = targetX;
      p.toY = targetY;
      restartTiming(p, now, delta, usePlayerStore.getState().tweenMs);
    }
    const group = groupRef.current;
    if (group) {
      const alpha = tweenAlpha(p, now, animate);
      group.position.x = p.fromX + (p.toX - p.fromX) * alpha;
      group.position.y = p.fromY + (p.toY - p.fromY) * alpha;
    }

    const material = materialRef.current;
    const c = colorTween.current;
    const key = `${theme.id}:${state}`;
    if (material && c.key !== key) {
      if (c.key === '') c.from.copy(target); // mount: nem úszik be a material fehér alapszínéből
      else c.from.lerpColors(c.from, c.to, tweenAlpha(c, now, animate));
      c.to.copy(target);
      c.key = key;
      restartTiming(c, now, delta, usePlayerStore.getState().tweenMs);
    }
    material?.color.lerpColors(c.from, c.to, tweenAlpha(c, now, animate));
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
