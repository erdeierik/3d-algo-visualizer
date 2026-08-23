import { describe, expect, it } from 'vitest';
import { insertionSort } from './insertionSort';

describe('insertionSort', () => {
  it('helyesen rendez egy kevert tömböt', () => {
    const result = insertionSort([5, 3, 1, 4, 2]);
    const last = result[result.length - 1];
    expect(last.array).toEqual([1, 2, 3, 4, 5]);
    expect(last.kind).toBe('done');
  });

  it('nem mutálja az eredeti bemenetet', () => {
    const input = [3, 1, 2];
    insertionSort(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it('üres és egyelemű tömböt is helyesen kezel', () => {
    const emptySteps = insertionSort([]);
    expect(emptySteps[emptySteps.length - 1].array).toEqual([]);

    const singleSteps = insertionSort([9]);
    expect(singleSteps[singleSteps.length - 1].array).toEqual([9]);
  });

  it('legjobb esetben (már rendezett bemenet) n-1 összehasonlítás, 0 eltolás', () => {
    const n = 5;
    const result = insertionSort([1, 2, 3, 4, 5]);
    const last = result[result.length - 1];
    expect(last.stats.comparisons).toBe(n - 1);
    expect(last.stats.operations).toBe(0);
  });

  it('legrosszabb esetben (fordítva rendezett bemenet) n*(n-1)/2 összehasonlítás és eltolás', () => {
    const n = 5;
    const result = insertionSort([5, 4, 3, 2, 1]);
    const last = result[result.length - 1];
    const expected = (n * (n - 1)) / 2;
    expect(last.stats.comparisons).toBe(expected);
    expect(last.stats.operations).toBe(expected);
  });
});
