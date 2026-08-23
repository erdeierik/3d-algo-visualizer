import { describe, expect, it } from 'vitest';
import { bubbleSort } from './bubbleSort';

describe('bubbleSort', () => {
  it('helyesen rendez egy kevert tömböt', () => {
    const result = bubbleSort([5, 3, 1, 4, 2]);
    const last = result[result.length - 1];
    expect(last.array).toEqual([1, 2, 3, 4, 5]);
    expect(last.kind).toBe('done');
  });

  it('nem mutálja az eredeti bemenetet', () => {
    const input = [3, 1, 2];
    bubbleSort(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it('üres és egyelemű tömböt is helyesen kezel', () => {
    const emptySteps = bubbleSort([]);
    expect(emptySteps[emptySteps.length - 1].array).toEqual([]);

    const singleSteps = bubbleSort([9]);
    expect(singleSteps[singleSteps.length - 1].array).toEqual([9]);
  });

  it('már rendezett tömbre nem hajt végre cserét', () => {
    const result = bubbleSort([1, 2, 3, 4]);
    const last = result[result.length - 1];
    expect(last.stats.operations).toBe(0);
  });

  it('az összehasonlítások száma n*(n-1)/2, a bemenet sorrendjétől függetlenül', () => {
    const n = 6;
    const expected = (n * (n - 1)) / 2;
    const ascending = bubbleSort([1, 2, 3, 4, 5, 6]);
    const descending = bubbleSort([6, 5, 4, 3, 2, 1]);
    expect(ascending[ascending.length - 1].stats.comparisons).toBe(expected);
    expect(descending[descending.length - 1].stats.comparisons).toBe(expected);
  });

  it('a stepIndex mezők 0-tól folyamatosan, hézagmentesen növekednek', () => {
    const result = bubbleSort([3, 1, 2]);
    result.forEach((step, index) => expect(step.stepIndex).toBe(index));
  });
});
