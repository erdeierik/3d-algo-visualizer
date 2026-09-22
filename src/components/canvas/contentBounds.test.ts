import { describe, expect, it } from 'vitest';
import { MAX_BAR_HEIGHT, SPACING, computeContentBounds } from './contentBounds';
import type { SortStep, TreeStep } from '../../algorithms/types';

const STATS = { comparisons: 0, operations: 0 };

function sortStep(array: number[]): SortStep {
  return { stepIndex: 0, pseudocodeLine: 0, stats: STATS, array, activeIndices: [], kind: 'compare' };
}

/** b ← a → c, tehát inorder: b (x=0), a (x=1.5), c (x=3.0); y = 0 / −1.2 / −1.2 */
function treeStep(): TreeStep {
  return {
    stepIndex: 0,
    pseudocodeLine: 0,
    stats: STATS,
    rootId: 'a',
    activeNodeIds: [],
    kind: 'done',
    nodes: {
      a: { id: 'a', value: 5, leftId: 'b', rightId: 'c' },
      b: { id: 'b', value: 3, leftId: null, rightId: null },
      c: { id: 'c', value: 8, leftId: null, rightId: null },
    },
  };
}

describe('computeContentBounds — sorting', () => {
  it('a bársor 0-tól indul, nem középre igazított', () => {
    const bounds = computeContentBounds([sortStep([5, 3, 8, 1, 9])], 'sorting');
    expect(bounds.min.x).toBeCloseTo(-0.6);
    expect(bounds.max.x).toBeCloseTo(4 * SPACING + 0.6);
    expect(bounds.min.y).toBe(0);
    expect(bounds.max.y).toBeCloseTo(MAX_BAR_HEIGHT + 0.7);
    expect(bounds.radius).toBeCloseTo(3);
    expect(bounds.count).toBe(5);
  });
});

describe('computeContentBounds — fa', () => {
  it('a keret a végállapot layoutjából, node-margóval jön', () => {
    const bounds = computeContentBounds([treeStep()], 'tree');
    expect(bounds.min.x).toBeCloseTo(-0.7);
    expect(bounds.max.x).toBeCloseTo(3.7);
    expect(bounds.min.y).toBeCloseTo(-1.9);
    expect(bounds.max.y).toBeCloseTo(0.7);
    expect(bounds.count).toBe(3);
  });

  it('üres lépéslistára nulla keretet ad', () => {
    expect(computeContentBounds([], 'tree').count).toBe(0);
  });
});
