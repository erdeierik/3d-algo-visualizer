import { useMemo } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { SortBar } from './SortBar';
import type { SortStep } from '../../algorithms/types';

const COLORS = {
  idle: '#4a5568',
  compare: '#ecc94b',
  swap: '#f56565',
  sorted: '#48bb78',
};

const MAX_BAR_HEIGHT = 6;

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

  if (!step) return null;

  const maxValue = Math.max(...step.array);

  return (
    <>
      {step.array.map((value, index) => {
        const isActive = step.activeIndices.includes(index);
        const color = isActive
          ? step.kind === 'swap'
            ? COLORS.swap
            : COLORS.compare
          : sortedIndices.has(index) || step.kind === 'done'
            ? COLORS.sorted
            : COLORS.idle;
        return (
          <SortBar
            key={index}
            index={index}
            value={value}
            targetHeight={(value / maxValue) * MAX_BAR_HEIGHT}
            color={color}
          />
        );
      })}
    </>
  );
}
