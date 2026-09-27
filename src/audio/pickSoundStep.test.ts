import { describe, expect, it } from 'vitest';
import { pickSoundStep } from './pickSoundStep';
import type { SortStep, Step, TreeStep } from '../algorithms/types';

const base = { pseudocodeLine: 0, stats: { comparisons: 0, operations: 0 } };

function sortSteps(kinds: SortStep['kind'][]): Step[] {
  return kinds.map((kind, stepIndex) => ({ ...base, stepIndex, kind, array: [], activeIndices: [] }));
}

function treeSteps(kinds: TreeStep['kind'][]): Step[] {
  return kinds.map((kind, stepIndex) => ({ ...base, stepIndex, kind, nodes: {}, rootId: null, activeNodeIds: [] }));
}

describe('pickSoundStep', () => {
  it('[swap, compare] kötegben a swap szól, nem a csend', () => {
    const steps = sortSteps(['compare', 'swap', 'compare']);
    expect(pickSoundStep(steps, 0, 2)?.kind).toBe('swap');
  });

  it('a fontosabb hang nyer a későbbi, kevésbé fontos felett', () => {
    expect(pickSoundStep(treeSteps(['compare', 'delete', 'done']), 0, 2)?.kind).toBe('done');
    expect(pickSoundStep(sortSteps(['compare', 'sorted-marker', 'compare', 'swap']), 0, 3)?.kind).toBe(
      'sorted-marker',
    );
  });

  it('csak néma lépések esetén null', () => {
    expect(pickSoundStep(sortSteps(['swap', 'compare', 'compare']), 0, 2)).toBeNull();
    expect(pickSoundStep(treeSteps(['compare', 'visit']), 0, 1)).toBeNull();
  });

  it('egylépéses kötegben maga az a lépés (a mai viselkedés)', () => {
    const steps = sortSteps(['compare', 'swap']);
    expect(pickSoundStep(steps, 0, 1)).toBe(steps[1]);
  });

  it('azonos prioritásnál a későbbi lépés nyer', () => {
    const steps = sortSteps(['compare', 'swap', 'set']);
    expect(pickSoundStep(steps, 0, 2)).toBe(steps[2]);
  });
});
