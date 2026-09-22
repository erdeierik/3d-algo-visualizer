// src/themes/living-tree/Edge.tsx
import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';
import { BARK_COLOR } from './palette';
import type { EdgeProps } from '../types';

const UP = new Vector3(0, 1, 0);

export function LivingTreeEdge({ from, to }: EdgeProps) {
  // a cylinder alapból Y mentén áll: elforgatjuk a from → to irányba, és a hosszára skálázzuk
  const { position, quaternion, length } = useMemo(() => {
    const start = new Vector3(from.x, from.y, 0);
    const end = new Vector3(to.x, to.y, 0);
    const direction = new Vector3().subVectors(end, start);
    const length = direction.length();

    return {
      position: new Vector3().addVectors(start, end).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(UP, direction.normalize()),
      length,
    };
  }, [from.x, from.y, to.x, to.y]);

  return (
    <mesh position={position} quaternion={quaternion} scale={[1, length, 1]}>
      <cylinderGeometry args={[0.055, 0.095, 1, 7]} />
      <meshStandardMaterial color={BARK_COLOR} roughness={0.9} />
    </mesh>
  );
}
