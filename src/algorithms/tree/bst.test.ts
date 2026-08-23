import { describe, expect, it } from 'vitest';
import { bstInsert, bstSearch, bstDelete, bstTraverse } from './bst';
import type { TreeStep } from '../types';

function valuesOf(nodes: TreeStep['nodes']): number[] {
  return Object.values(nodes)
    .map((n) => n.value)
    .sort((a, b) => a - b);
}

describe('bstInsert', () => {
  it('helyesen épít fel egy fát, minden érték megjelenik', () => {
    const steps = bstInsert([5, 3, 8, 1, 4]);
    const last = steps[steps.length - 1];
    expect(valuesOf(last.nodes)).toEqual([1, 3, 4, 5, 8]);
  });

  it('a gyökér az első beszúrt érték', () => {
    const steps = bstInsert([5, 3, 8, 1, 4]);
    const last = steps[steps.length - 1];
    expect(last.nodes[last.rootId!].value).toBe(5);
  });

  it('nem mutálja az eredeti beszúrási sorrend tömböt', () => {
    const input = [5, 3, 8];
    bstInsert(input);
    expect(input).toEqual([5, 3, 8]);
  });

  it('üres bemenetre üres fát ad, egyetlen "done" lépéssel', () => {
    const steps = bstInsert([]);
    expect(steps.length).toBe(1);
    expect(steps[0].kind).toBe('done');
    expect(steps[0].rootId).toBeNull();
  });

  it('a stepIndex mezők 0-tól folyamatosan növekednek', () => {
    const steps = bstInsert([5, 3, 8, 1, 4]);
    steps.forEach((step, index) => expect(step.stepIndex).toBe(index));
  });
});

describe('bstSearch', () => {
  it('megtalálja a meglévő értéket', () => {
    const steps = bstSearch([5, 3, 8, 1, 4], 4);
    expect(steps[steps.length - 1].kind).toBe('found');
  });

  it('nem létező értékre "not-found"-dal zár', () => {
    const steps = bstSearch([5, 3, 8, 1, 4], 42);
    expect(steps[steps.length - 1].kind).toBe('not-found');
  });

  it('a gyökér értékét egyetlen összehasonlítással megtalálja', () => {
    const steps = bstSearch([5, 3, 8, 1, 4], 5);
    const last = steps[steps.length - 1];
    expect(last.stats.comparisons).toBe(1);
  });
});

describe('bstDelete', () => {
  const fullTree = [5, 3, 8, 1, 4, 7, 9];

  it('levél törlése csak azt az egy értéket veszi ki', () => {
    const steps = bstDelete(fullTree, 1);
    const last = steps[steps.length - 1];
    expect(valuesOf(last.nodes)).toEqual([3, 4, 5, 7, 8, 9]);
  });

  it('egygyerekes csomópont törlésekor a gyerek lép a helyére', () => {
    const steps = bstDelete([5, 3, 1], 3);
    const last = steps[steps.length - 1];
    const root = last.nodes[last.rootId!];
    expect(root.value).toBe(5);
    expect(last.nodes[root.leftId!].value).toBe(1);
  });

  it('kétgyerekes csomópont törlésekor az inorder utód kerül a helyére, a fa érvényes BST marad', () => {
    const steps = bstDelete(fullTree, 5);
    const last = steps[steps.length - 1];
    const root = last.nodes[last.rootId!];

    expect(root.value).toBe(7);
    expect(valuesOf(last.nodes)).toEqual([1, 3, 4, 7, 8, 9]);

    const inorderValues: number[] = [];
    const walk = (id: string | null) => {
      if (id === null) return;
      const node = last.nodes[id];
      walk(node.leftId);
      inorderValues.push(node.value);
      walk(node.rightId);
    };
    walk(last.rootId);
    expect(inorderValues).toEqual([1, 3, 4, 7, 8, 9]);
  });

  it('az egyetlen csomópont törlése üres fát eredményez', () => {
    const steps = bstDelete([5], 5);
    const last = steps[steps.length - 1];
    expect(last.rootId).toBeNull();
    expect(Object.keys(last.nodes)).toHaveLength(0);
  });

  it('nem létező érték törlésekor "not-found", a fa változatlan marad', () => {
    const steps = bstDelete(fullTree, 42);
    const last = steps[steps.length - 1];
    expect(last.kind).toBe('not-found');
    expect(valuesOf(last.nodes)).toEqual([1, 3, 4, 5, 7, 8, 9]);
  });
});

describe('bstTraverse', () => {
  const fullTree = [5, 3, 8, 1, 4, 7, 9];

  it('inorder bejárás növekvő érték-sorrendet ad', () => {
    const steps = bstTraverse(fullTree, 'inorder');
    const visited = steps
      .filter((step) => step.kind === 'visit')
      .map((step) => step.nodes[step.activeNodeIds[0]].value);
    expect(visited).toEqual([1, 3, 4, 5, 7, 8, 9]);
  });

  it('preorder bejárás a gyökérrel kezdődik', () => {
    const steps = bstTraverse(fullTree, 'preorder');
    const visited = steps
      .filter((step) => step.kind === 'visit')
      .map((step) => step.nodes[step.activeNodeIds[0]].value);
    expect(visited).toEqual([5, 3, 1, 4, 8, 7, 9]);
  });

  it('postorder bejárás a gyökérrel zárul', () => {
    const steps = bstTraverse(fullTree, 'postorder');
    const visited = steps
      .filter((step) => step.kind === 'visit')
      .map((step) => step.nodes[step.activeNodeIds[0]].value);
    expect(visited).toEqual([1, 4, 3, 7, 9, 8, 5]);
  });

  it('az operations a meglátogatott csomópontok számával egyezik, comparisons mindig 0', () => {
    const steps = bstTraverse(fullTree, 'inorder');
    const last = steps[steps.length - 1];
    expect(last.stats.operations).toBe(fullTree.length);
    expect(last.stats.comparisons).toBe(0);
  });
});
