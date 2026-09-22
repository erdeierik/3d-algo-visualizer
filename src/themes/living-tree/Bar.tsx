// src/themes/living-tree/Bar.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import { KNOT_COLOR } from './palette';
import type { BarPartProps } from '../types';

/** A csomó-gyűrűk a magasság 28 / 57 / 86 %-án ülnek (temak-poc.md 3.). */
const KNOT_AT = [0.28, 0.57, 0.86];

export function LivingTreeBar({ heightRef, materialRef, detail }: BarPartProps) {
  const stalkRef = useRef<Mesh>(null);
  const knotRefs = useRef<(Mesh | null)[]>([]);

  useFrame(() => {
    const height = heightRef.current; // a közös SortBar már frissítette (renderPriority = -1)

    const stalk = stalkRef.current;
    if (stalk) {
      stalk.scale.y = height;
      stalk.position.y = height / 2;
    }

    // EZÉRT kell a heightRef és nem a targetHeight: a gyűrűk a PILLANATNYI magasságból
    // pozicionálódnak, különben az animáció közben leszakadnának a szárról (terv 4.2)
    KNOT_AT.forEach((ratio, i) => {
      const knot = knotRefs.current[i];
      if (knot) knot.position.y = height * ratio;
    });
  });

  return (
    <group>
      <mesh ref={stalkRef}>
        <cylinderGeometry args={[0.26, 0.3, 1, 12]} />
        <meshStandardMaterial ref={materialRef} roughness={0.8} />
      </mesh>

      {detail === 'rich' &&
        KNOT_AT.map((ratio, i) => (
          <mesh
            key={ratio}
            ref={(mesh) => {
              knotRefs.current[i] = mesh;
            }}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[0.28, 0.045, 6, 16]} />
            <meshStandardMaterial color={KNOT_COLOR} roughness={0.9} />
          </mesh>
        ))}
    </group>
  );
}
