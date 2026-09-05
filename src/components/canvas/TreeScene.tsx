import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { usePlayerStore } from '../../store/playerStore';
import { computeTreeLayout } from '../../algorithms/tree/layout';
import { TreeNode3D } from './TreeNode3D';
import type { TreeStep } from '../../algorithms/types';

const IDLE_COLOR = '#4a5568';

const ACTIVE_COLOR: Record<TreeStep['kind'], string> = {
  compare: '#ecc94b',
  visit: '#ecc94b',
  insert: '#48bb78',
  found: '#48bb78',
  delete: '#f56565',
  'rebalance-pointer': '#f56565',
  'not-found': IDLE_COLOR,
  done: IDLE_COLOR,
};

export function TreeScene() {
  const steps = usePlayerStore((s) => s.steps) as TreeStep[];
  const currentStepIndex = usePlayerStore((s) => s.currentStepIndex);
  const step = steps[currentStepIndex];

  const layout = useMemo(() => (step ? computeTreeLayout(step.nodes, step.rootId) : {}), [step]);

  if (!step) return null;

  return (
    <>
      {Object.values(step.nodes).map((node) => {
        const pos = layout[node.id];
        const isActive = step.activeNodeIds.includes(node.id);
        return (
          <TreeNode3D
            key={node.id}
            value={node.value}
            targetX={pos.x}
            targetY={pos.y}
            color={isActive ? ACTIVE_COLOR[step.kind] : IDLE_COLOR}
          />
        );
      })}
      {Object.values(step.nodes).flatMap((node) => {
        const from = layout[node.id];
        return [node.leftId, node.rightId]
          .filter((id): id is string => id !== null)
          .map((childId) => (
            <Line
              key={`${node.id}-${childId}`}
              points={[
                [from.x, from.y, 0],
                [layout[childId].x, layout[childId].y, 0],
              ]}
              color="#718096"
            />
          ));
      })}
    </>
  );
}
