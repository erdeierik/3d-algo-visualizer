import { useMemo } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { SortBar } from './SortBar';
import type { SortStep } from '../../algorithms/types';
import type { Detail, VisualState } from '../../themes/types';
import { MAX_BAR_HEIGHT } from './contentBounds';

/** A LOD-küszöb a terv 6.2-ből; a végleges értéket a Fázis 11.5 FPS-mérése adja. */
const PLAIN_ABOVE = 30;

function barState(step: SortStep, index: number, sortedIndices: Set<number>): VisualState {
  if (step.activeIndices.includes(index)) return step.kind === 'swap' ? 'swap' : 'compare';
  return sortedIndices.has(index) || step.kind === 'done' ? 'sorted' : 'idle';
}

export function SortingScene() {
  const steps = usePlayerStore((s) => s.steps) as SortStep[];
  const currentStepIndex = usePlayerStore((s) => s.currentStepIndex);
  const step = steps[currentStepIndex];

  const sortedIndices = useMemo(() => {
    const acc = new Set<number>();
    for (let i = 0; i <= currentStepIndex; i++) {
      if (steps[i]?.kind === 'sorted-marker') {
        steps[i].activeIndices.forEach((idx) => acc.add(idx));
      }
    }
    return acc;
  }, [steps, currentStepIndex]);

  // a <Canvas> saját reconciler-gyökere miatt ez a komponens a playerStore-t a App-tól
  // függetlenül olvashatja újra — algoritmusváltáskor egy képkockányira TreeStep is becsúszhat
  if (!step || !Array.isArray(step.array)) return null;

  const maxValue = Math.max(...step.array);
  const detail: Detail = step.array.length > PLAIN_ABOVE ? 'plain' : 'rich';

  return (
    <>
      {step.array.map((value, index) => (
        <SortBar
          key={index}
          index={index}
          value={value}
          targetHeight={(value / maxValue) * MAX_BAR_HEIGHT}
          state={barState(step, index, sortedIndices)}
          detail={detail}
        />
      ))}
    </>
  );
}
