import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { usePlayerStore } from '../../store/playerStore';
import { computeTreeLayout } from '../../algorithms/tree/layout';
import { TreeNode3D } from './TreeNode3D';
import type { TreeStep } from '../../algorithms/types';

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
            color={isActive ? '#ecc94b' : '#4a5568'}
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
