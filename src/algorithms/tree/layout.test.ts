import { describe, expect, it } from 'vitest';
import { bstInsert } from './bst';
import { computeTreeLayout } from './layout';

describe('computeTreeLayout', () => {
  it('az x-koordináták inorder (növekvő érték) sorrendet követnek', () => {
    const steps = bstInsert([5, 3, 8, 1, 4, 7, 9]);
    const last = steps[steps.length - 1];
    const layout = computeTreeLayout(last.nodes, last.rootId);

    const sortedByX = Object.entries(layout)
      .sort((a, b) => a[1].x - b[1].x)
      .map(([id]) => last.nodes[id].value);

    expect(sortedByX).toEqual([1, 3, 4, 5, 7, 8, 9]);
  });

  it('a gyökér y-koordinátája 0, a mélyebb csomópontoké negatív', () => {
    const steps = bstInsert([5, 3, 8, 1, 4]);
    const last = steps[steps.length - 1];
    const layout = computeTreeLayout(last.nodes, last.rootId);

    // toBeCloseTo, nem toBe: depth=0-nál a -depth*VERTICAL_SPACING szorzás -0-t ad,
    // amit a toBe (Object.is alapú) szigorúan megkülönböztetne a 0-tól, holott
    // számítás szempontjából ugyanaz az érték.
    expect(layout[last.rootId!].y).toBeCloseTo(0);

    const leafId = Object.keys(last.nodes).find((id) => last.nodes[id].value === 1)!;
    expect(layout[leafId].y).toBeLessThan(0);
  });

  it('üres fára üres pozíció-listát ad', () => {
    const layout = computeTreeLayout({}, null);
    expect(Object.keys(layout)).toHaveLength(0);
  });
});
