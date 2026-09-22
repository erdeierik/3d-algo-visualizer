import { useMemo } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { computeTreeLayout } from '../../algorithms/tree/layout';
import { useTheme } from '../../themes/registry';
import { TreeNode3D } from './TreeNode3D';
import type { TreeStep } from '../../algorithms/types';
import type { Detail, VisualState } from '../../themes/types';

/** A terv 4.5 táblája: 8 lépésfajta → 4 vizuális állapot. */
const ACTIVE_STATE: Record<TreeStep['kind'], VisualState> = {
  compare: 'compare',
  visit: 'compare',
  insert: 'insert',
  found: 'found',
  delete: 'swap',
  'rebalance-pointer': 'swap',
  'not-found': 'idle',
  done: 'idle',
};

const PLAIN_ABOVE = 20;

export function TreeScene() {
  const theme = useTheme();
  const steps = usePlayerStore((s) => s.steps) as TreeStep[];
  const currentStepIndex = usePlayerStore((s) => s.currentStepIndex);
  const step = steps[currentStepIndex];

  // a <Canvas> saját reconciler-gyökere miatt ez a komponens a playerStore-t a App-tól
  // függetlenül olvashatja újra — algoritmusváltáskor egy képkockányira SortStep is becsúszhat
  const isTreeStep = !!step && typeof step.nodes === 'object' && step.nodes !== null;

  const layout = useMemo(
    () => (isTreeStep ? computeTreeLayout(step.nodes, step.rootId) : {}),
    [step, isTreeStep],
  );

  if (!isTreeStep) return null;

  const detail: Detail = Object.keys(step.nodes).length > PLAIN_ABOVE ? 'plain' : 'rich';

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
            state={isActive ? ACTIVE_STATE[step.kind] : 'idle'}
            detail={detail}
          />
        );
      })}
      {Object.values(step.nodes).flatMap((node) => {
        const from = layout[node.id];
        return [node.leftId, node.rightId]
          .filter((id): id is string => id !== null)
          .map((childId) => (
            <theme.Edge key={`${node.id}-${childId}`} from={from} to={layout[childId]} />
          ));
      })}
    </>
  );
}
