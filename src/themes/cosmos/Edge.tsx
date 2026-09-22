// src/themes/cosmos/Edge.tsx
import { Line } from '@react-three/drei';
import { AdditiveBlending } from 'three';
import { EDGE_COLOR } from './palette';
import type { EdgeProps } from '../types';

export function CosmosEdge({ from, to }: EdgeProps) {
  return (
    <Line
      points={[
        [from.x, from.y, 0],
        [to.x, to.y, 0],
      ]}
      color={EDGE_COLOR}
      transparent
      opacity={0.75}
      blending={AdditiveBlending}
      depthWrite={false}
    />
  );
}
