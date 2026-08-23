import type { SortStep, StepStats } from '../types';

export function bubbleSort(input: number[]): SortStep[] {
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
    for (let j = 0; j < n - 1 - i; j++) {
      stats.comparisons++;
      pushStep('compare', [j, j + 1], 2);

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        stats.operations++;
        pushStep('swap', [j, j + 1], 3);
      }
    }
    pushStep('sorted-marker', [n - 1 - i], 4);
  }

  pushStep('done', [], 5);
  return steps;
}
