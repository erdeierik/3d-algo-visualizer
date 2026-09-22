// src/themes/living-tree/Pollen.tsx
import { useMemo, useRef } from 'react';
import { BufferAttribute, type Points } from 'three';
import { driftY, POLLEN_CEILING, windBend } from '../shared/ambient';
import { useAmbientMotion } from '../shared/Decor';
import { scatter } from '../shared/scatter';
import { makeStarTexture } from '../shared/textures';
import { useProceduralTexture } from '../shared/useProceduralTexture';

export function Pollen({ radius, count }: { radius: number; count: number }) {
  const pointsRef = useRef<Points>(null);
  // ugyanaz a kör-textúra, mint a Cosmos csillagainál — külön példányban (fazis-11-1 4.)
  const map = useProceduralTexture(makeStarTexture);

  const items = useMemo(
    () => scatter({ count, rMin: radius * 0.15, rMax: radius * 1.2, seed: 5150 }),
    [count, radius],
  );

  const positions = useMemo(() => {
    const array = new Float32Array(items.length * 3);
    items.forEach((item, i) => {
      array[i * 3] = item.x;
      array[i * 3 + 1] = item.jitter * POLLEN_CEILING; // induláskor a levegőben szétszórva
      array[i * 3 + 2] = item.z;
    });
    return array;
  }, [items]);

  useAmbientMotion((elapsed, delta) => {
    const attribute = pointsRef.current?.geometry.getAttribute('position') as
      | BufferAttribute
      | undefined;
    if (!attribute) return;

    items.forEach((item, i) => {
      attribute.setY(i, driftY(attribute.getY(i), delta));
      attribute.setX(i, item.x + windBend(elapsed, item.phase) * 2.4);
      attribute.setZ(i, item.z + windBend(elapsed, item.phase * 1.3) * 1.6);
    });
    attribute.needsUpdate = true;
  });

  if (items.length === 0) return null;

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry key={items.length}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={map ?? undefined}
        color="#f4f0c8"
        size={0.13}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}
