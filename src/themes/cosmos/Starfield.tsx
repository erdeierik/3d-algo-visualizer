// src/themes/cosmos/Starfield.tsx
import { useMemo, useRef } from 'react';
import { AdditiveBlending, Color, type Points } from 'three';
import { useAmbientMotion } from '../shared/Decor';
import { scatter } from '../shared/scatter';
import { makeStarTexture } from '../shared/textures';
import { useProceduralTexture } from '../shared/useProceduralTexture';
import type { Quality } from '../types';

/** A quality-kapcsoló érzékelhető különbsége (temak-poc.md 5.2). */
const STAR_COUNT: Record<Quality, number> = { high: 1800, low: 420 };

const SHELL_FLATTEN = 0.55; // a héj Y-ban lapított, különben gömbnek látszana
const SHELL_DEPTH = 2.7; // a külső sugár a belső ennyiszerese
const SPIN = 0.008; // rad / s — épp csak érzékelhető
const SEED = 20260911;

interface StarfieldProps {
  /** A héj BELSŐ sugara: max(26, bounds.radius × 1.6) — a hívó Environment számolja. */
  innerRadius: number;
  quality: Quality;
}

export function Starfield({ innerRadius, quality }: StarfieldProps) {
  const pointsRef = useRef<Points>(null);
  const map = useProceduralTexture(makeStarTexture);

  const { positions, colors, count } = useMemo(() => {
    const count = STAR_COUNT[quality];
    const items = scatter({
      count,
      rMin: innerRadius,
      rMax: innerRadius * SHELL_DEPTH,
      seed: SEED,
      shell: true,
      flattenY: SHELL_FLATTEN,
    });

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new Color();

    items.forEach((item, i) => {
      positions[i * 3] = item.x;
      positions[i * 3 + 1] = item.y;
      positions[i * 3 + 2] = item.z;

      // 74% hideg fehér / 19% arany / 7% vöröses (temak-poc.md 5.1)
      const cold = item.variant < 0.74;
      const gold = !cold && item.variant < 0.93;
      const hue = cold ? 0.58 : gold ? 0.11 : 0.03;
      const saturation = cold ? 0.16 : 0.55;

      // négyzetes fényerő-eloszlás → KEVÉS a fényes csillag, ahogy a valódi égen
      color.setHSL(hue, saturation, 0.32 + Math.pow(item.jitter, 2.2) * 0.66);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });

    return { positions, colors, count };
  }, [innerRadius, quality]);

  // csak a decor mozog (11.4); alap-pózba állítás nem kell, a mező a helyén marad
  useAmbientMotion((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * SPIN;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      {/* a key kényszeríti az új geometriát, ha a pontszám változik (quality-váltás) */}
      <bufferGeometry key={count}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={map ?? undefined}
        size={0.58}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        fog={false}
      />
    </points>
  );
}
