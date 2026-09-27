import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Color, type Group, type MeshStandardMaterial } from 'three';
import { usePlayerStore } from '../../store/playerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTheme } from '../../themes/registry';
import type { Detail, VisualState } from '../../themes/types';
import { SPACING } from './contentBounds';
import { restartTiming, tweenAlpha } from './tween';

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
  const heightTween = useRef({ from: 1, to: 1, start: 0, duration: 0 });
  const colorTween = useRef({ from: new Color(), to: new Color(), start: 0, duration: 0, key: '' });
  const materialRef = useRef<MeshStandardMaterial>(null);
  const labelRef = useRef<Group>(null);

  const target = useMemo(() => new Color(theme.palette[state]), [theme, state]);

  useFrame(({ clock }, delta) => {
    const now = clock.elapsedTime * 1000;

    const h = heightTween.current;
    if (h.to !== targetHeight) {
      // a MOSTANI érték, nem a heightRef — az az előző képkockáé (fazis-12 3.3)
      h.from += (h.to - h.from) * tweenAlpha(h, now, animate);
      h.to = targetHeight;
      restartTiming(h, now, delta, usePlayerStore.getState().tweenMs);
    }
    heightRef.current = h.from + (h.to - h.from) * tweenAlpha(h, now, animate);

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
