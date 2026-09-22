// src/themes/living-tree/InstancedScatter.tsx
import { useCallback, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import { Object3D, type InstancedMesh } from 'three';
import { windBend } from '../shared/ambient';
import { useAmbientMotion } from '../shared/Decor';
import type { ScatterItem } from '../shared/scatter';

interface InstancedScatterProps {
  items: ScatterItem[];
  /** Szélben hajlik-e. A távoli fasor nem — az úgyis a ködben áll, csak terhelés lenne. */
  sway: boolean;
  /** A geometria origója középen van: ennyivel emeljük meg, a példány scale-jével szorozva. */
  liftY?: number;
  /** Fix előforgatás X-en — a talajra fektetett árnyék-quadhoz −π/2. */
  tiltX?: number;
  /** A geometria és az anyag JSX-ben — így egy komponens szolgálja ki mind a hat mezőt. */
  children: ReactNode;
}

export function InstancedScatter({
  items,
  sway,
  liftY = 0,
  tiltX = 0,
  children,
}: InstancedScatterProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  const compose = useCallback(
    (elapsed: number) => {
      const mesh = meshRef.current;
      if (!mesh) return;

      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        const bend = sway ? windBend(elapsed, item.phase) : 0;
        dummy.position.set(item.x, item.y + liftY * item.scale, item.z);
        dummy.rotation.set(tiltX + bend, item.rotationY, bend * 0.6);
        dummy.scale.setScalar(item.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
    },
    [items, sway, liftY, tiltX, dummy],
  );

  // az InstancedMesh nullmátrixokkal jön létre: az első kompozíció mount után KÖTELEZŐ,
  // különben animate = false mellett üres maradna a mező
  useLayoutEffect(() => compose(0), [compose]);

  useAmbientMotion(compose, () => compose(0));

  if (items.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, items.length]}
      frustumCulled={false}
    >
      {children}
    </instancedMesh>
  );
}
