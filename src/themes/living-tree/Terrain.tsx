// src/themes/living-tree/Terrain.tsx
import { useMemo } from 'react';
import { BackSide } from 'three';
import { SPACING } from '../../components/canvas/contentBounds';
import { makeGroundTexture, makeShadowTexture, makeSkyTexture } from '../shared/textures';
import { useProceduralTexture } from '../shared/useProceduralTexture';
import { InstancedScatter } from './InstancedScatter';
import { GROUND_COLORS, HORIZON, ZENITH } from './palette';
import type { ContentBounds } from '../types';
import type { ScatterItem } from '../shared/scatter';

const SHADOW_LIFT = 0.015; // z-fighting ellen: az árnyék épp a talaj fölött van

/** Ég-kupola: BackSide gömb, gradiens-textúrával. Köd nélkül, különben elnyelné a saját ege. */
export function SkyDome() {
  const map = useProceduralTexture(() => makeSkyTexture(ZENITH, HORIZON));

  return (
    <mesh>
      <sphereGeometry args={[150, 24, 16]} />
      <meshBasicMaterial
        map={map ?? undefined}
        color={map ? '#ffffff' : HORIZON}
        side={BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

/** Talaj: mintázott textúra, nem lapos szín — a PoC leglátványosabb javítása (5.2). */
export function Ground({ size }: { size: number }) {
  const map = useProceduralTexture(() => makeGroundTexture(GROUND_COLORS));

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[size, size]} />
      <meshLambertMaterial map={map ?? undefined} color={map ? '#ffffff' : GROUND_COLORS[0]} />
    </mesh>
  );
}

interface ContactShadowsProps {
  bounds: ContentBounds;
  category: 'sorting' | 'tree';
}

/** Fake kontaktárnyék — a DECOR groupban, hogy a kamera-keretet ne befolyásolja (terv 7.1). */
export function ContactShadows({ bounds, category }: ContactShadowsProps) {
  const map = useProceduralTexture(makeShadowTexture);

  const items = useMemo<ScatterItem[]>(() => {
    if (category !== 'sorting') return [];
    // a SortBar pozíciója index * SPACING, a decor pedig a scene gyökerében ül,
    // sortingban viszont a contentOffsetY = 0, tehát a két koordináta-rendszer egybeesik
    return Array.from({ length: bounds.count }, (_, index) => ({
      x: index * SPACING,
      y: 0,
      z: 0,
      rotationY: 0,
      scale: 1,
      phase: 0,
      variant: 0,
      jitter: 0,
    }));
  }, [category, bounds.count]);

  if (category === 'tree') {
    const centerX = (bounds.min.x + bounds.max.x) / 2;
    const width = Math.max(14, (bounds.max.x - bounds.min.x) * 1.1);
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, SHADOW_LIFT, 0]}>
        <planeGeometry args={[width, 7.5]} />
        <meshBasicMaterial map={map ?? undefined} transparent depthWrite={false} />
      </mesh>
    );
  }

  return (
    <InstancedScatter items={items} sway={false} tiltX={-Math.PI / 2} liftY={SHADOW_LIFT}>
      <planeGeometry args={[1.8, 1.8]} />
      <meshBasicMaterial map={map ?? undefined} transparent depthWrite={false} />
    </InstancedScatter>
  );
}
