import { Line } from '@react-three/drei';
import type { EdgeProps } from '../types';
import { EDGE_COLOR } from './palette';

export function SimpleEdge({ from, to }: EdgeProps) {
  return (
    <Line
      points={[
        [from.x, from.y, 0],
        [to.x, to.y, 0],
      ]}
      color={EDGE_COLOR}
    />
  );
}
