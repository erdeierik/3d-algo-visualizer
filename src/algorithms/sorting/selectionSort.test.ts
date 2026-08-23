import { describe, expect, it } from 'vitest';
import { selectionSort } from './selectionSort';

describe('selectionSort', () => {
  it('helyesen rendez egy kevert tömböt', () => {
    const result = selectionSort([5, 3, 1, 4, 2]);
    const last = result[result.length - 1];
    expect(last.array).toEqual([1, 2, 3, 4, 5]);
    expect(last.kind).toBe('done');
  });

  it('nem mutálja az eredeti bemenetet', () => {
    const input = [3, 1, 2];
    selectionSort(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it('üres és egyelemű tömböt is helyesen kezel', () => {
    const emptySteps = selectionSort([]);
    expect(emptySteps[emptySteps.length - 1].array).toEqual([]);

    const singleSteps = selectionSort([9]);
    expect(singleSteps[singleSteps.length - 1].array).toEqual([9]);
  });

  it('az összehasonlítások száma n*(n-1)/2, a cserék száma legfeljebb n-1', () => {
    const n = 5;
    const result = selectionSort([5, 3, 1, 4, 2]);
    const last = result[result.length - 1];
    expect(last.stats.comparisons).toBe((n * (n - 1)) / 2);
    expect(last.stats.operations).toBeLessThanOrEqual(n - 1);
  });

  it('már rendezett tömbnél nem hajt végre cserét', () => {
    const result = selectionSort([1, 2, 3, 4]);
    expect(result[result.length - 1].stats.operations).toBe(0);
  });
});
