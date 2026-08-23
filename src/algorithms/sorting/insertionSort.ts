import type { SortStep, StepStats } from '../types';

export function insertionSort(input: number[]): SortStep[] {
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
  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    pushStep('set', [i], 1); // "key = array[i]" — kiválasztottuk a beillesztendő elemet

    while (j >= 0) {
      stats.comparisons++;
      pushStep('compare', [j, j + 1], 3);

      if (array[j] <= key) break;

      array[j + 1] = array[j];
      stats.operations++;
      pushStep('set', [j + 1], 4);
      j--;
    }

    array[j + 1] = key;
    pushStep('set', [j + 1], 6);
  }

  pushStep('done', [], 7);
  return steps;
}
