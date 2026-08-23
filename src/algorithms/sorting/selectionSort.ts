import type { SortStep, StepStats } from '../types';

export function selectionSort(input: number[]): SortStep[] {
  const array = [...input];
  const steps: SortStep[] = [];
  const stats: StepStats = { comparisons: 0, operations: 0 };
  let stepIndex = 0;

  const pushStep = (kind: SortStep['kind'], activeIndices: number[], pseudocodeLine: number) => {
    steps.push({
      stepIndex: stepIndex++,
      pseudocodeLine,
      stats: { ...stats },
      array: [...array],
      activeIndices,
      kind,
    });
  };

  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      stats.comparisons++;
      pushStep('compare', [j, minIndex], 3);

      if (array[j] < array[minIndex]) {
        minIndex = j;
        pushStep('set', [minIndex], 4);
      }
    }

    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      stats.operations++;
      pushStep('swap', [i, minIndex], 5);
    }
    pushStep('sorted-marker', [i], 6);
  }

  pushStep('done', [], 7);
  return steps;
}
