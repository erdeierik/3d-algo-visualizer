import type { StepStats, TreeNodeSnapshot, TreeStep } from '../types';

interface TreeState {
  nodes: Record<string, TreeNodeSnapshot>;
  rootId: string | null;
}

function cloneNodes(nodes: Record<string, TreeNodeSnapshot>): Record<string, TreeNodeSnapshot> {
  const copy: Record<string, TreeNodeSnapshot> = {};
  for (const id in nodes) {
    copy[id] = { ...nodes[id] };
  }
  return copy;
}

function insertOne(
  state: TreeState,
  value: number,
  makeId: () => string,
  stats: StepStats,
  pushStep: (kind: TreeStep['kind'], activeNodeIds: string[], pseudocodeLine: number) => void,
) {
  if (state.rootId === null) {
    const id = makeId();
    state.nodes[id] = { id, value, leftId: null, rightId: null };
    state.rootId = id;
    pushStep('insert', [id], 0);
    return;
  }

  let currentId = state.rootId;
  while (true) {
    const current = state.nodes[currentId];
    stats.comparisons++;
    pushStep('compare', [currentId], 3);

    if (value < current.value) {
      if (current.leftId === null) {
        const id = makeId();
        state.nodes[id] = { id, value, leftId: null, rightId: null };
        current.leftId = id;
        stats.operations++;
        pushStep('insert', [id], 4);
        return;
      }
      currentId = current.leftId;
    } else {
      if (current.rightId === null) {
        const id = makeId();
        state.nodes[id] = { id, value, leftId: null, rightId: null };
        current.rightId = id;
        stats.operations++;
        pushStep('insert', [id], 7);
        return;
      }
      currentId = current.rightId;
    }
  }
}

export function bstInsert(insertionOrder: number[]): TreeStep[] {
  const state: TreeState = { nodes: {}, rootId: null };
  const steps: TreeStep[] = [];
  const stats: StepStats = { comparisons: 0, operations: 0 };
  let stepIndex = 0;
  let idCounter = 0;
  const makeId = () => `node-${idCounter++}`;

  const pushStep = (kind: TreeStep['kind'], activeNodeIds: string[], pseudocodeLine: number) => {
    steps.push({
      stepIndex: stepIndex++,
      pseudocodeLine,
      stats: { ...stats },
      nodes: cloneNodes(state.nodes),
      rootId: state.rootId,
      activeNodeIds,
      kind,
    });
  };

  for (const value of insertionOrder) {
    insertOne(state, value, makeId, stats, pushStep);
  }

  pushStep('done', [], 9);
  return steps;
}

function buildTreeSilently(insertionOrder: number[]): TreeState {
  const state: TreeState = { nodes: {}, rootId: null };
  const stats: StepStats = { comparisons: 0, operations: 0 };
  let idCounter = 0;
  const makeId = () => `node-${idCounter++}`;
  const noop = () => {};

  for (const value of insertionOrder) {
    insertOne(state, value, makeId, stats, noop);
  }

  return state;
}

export function bstSearch(insertionOrder: number[], target: number): TreeStep[] {
  const state = buildTreeSilently(insertionOrder);
  const steps: TreeStep[] = [];
  const stats: StepStats = { comparisons: 0, operations: 0 };
  let stepIndex = 0;

  const pushStep = (kind: TreeStep['kind'], activeNodeIds: string[], pseudocodeLine: number) => {
    steps.push({
      stepIndex: stepIndex++,
      pseudocodeLine,
      stats: { ...stats },
      nodes: cloneNodes(state.nodes),
      rootId: state.rootId,
      activeNodeIds,
      kind,
    });
  };

  let currentId = state.rootId;
  while (currentId !== null) {
    const current = state.nodes[currentId];
    stats.comparisons++;
    pushStep('compare', [currentId], 2);

    if (target === current.value) {
      pushStep('found', [currentId], 2);
      return steps;
    }
    currentId = target < current.value ? current.leftId : current.rightId;
  }

  pushStep('not-found', [], 5);
  return steps;
}

export function bstDelete(insertionOrder: number[], target: number): TreeStep[] {
  const state = buildTreeSilently(insertionOrder);
  const steps: TreeStep[] = [];
  const stats: StepStats = { comparisons: 0, operations: 0 };
  let stepIndex = 0;

  const pushStep = (kind: TreeStep['kind'], activeNodeIds: string[], pseudocodeLine: number) => {
    steps.push({
      stepIndex: stepIndex++,
      pseudocodeLine,
      stats: { ...stats },
      nodes: cloneNodes(state.nodes),
      rootId: state.rootId,
      activeNodeIds,
      kind,
    });
  };

  // 1. Megkeressük a törlendő csomópontot és a szülőjét.
  let parentId: string | null = null;
  let currentId = state.rootId;

  while (currentId !== null) {
    const current = state.nodes[currentId];
    stats.comparisons++;
    pushStep('compare', [currentId], 1);

    if (target === current.value) break;

    parentId = currentId;
    currentId = target < current.value ? current.leftId : current.rightId;
  }

  if (currentId === null) {
    pushStep('not-found', [], 5);
    return steps;
  }

  const targetNode = state.nodes[currentId];

  // 2. Két gyerek esetén: inorder utód keresése, érték átmásolása, utód törlése.
  if (targetNode.leftId !== null && targetNode.rightId !== null) {
    let successorParentId = currentId;
    let successorId = targetNode.rightId;

    while (state.nodes[successorId].leftId !== null) {
      stats.comparisons++;
      pushStep('compare', [successorId], 7);
      successorParentId = successorId;
      successorId = state.nodes[successorId].leftId!;
    }

    const successor = state.nodes[successorId];
    targetNode.value = successor.value;
    stats.operations++;
    pushStep('rebalance-pointer', [currentId, successorId], 8);

    const successorParent = state.nodes[successorParentId];
    if (successorParent.leftId === successorId) {
      successorParent.leftId = successor.rightId;
    } else {
      successorParent.rightId = successor.rightId;
    }
    delete state.nodes[successorId];
    stats.operations++;
    pushStep('delete', [successorParentId], 9);

    pushStep('done', [], 13);
    return steps;
  }

  // 3. Legfeljebb egy gyerek: a gyereket (vagy null-t) kötjük be a szülő helyére.
  const childId = targetNode.leftId ?? targetNode.rightId;

  if (parentId === null) {
    state.rootId = childId;
  } else {
    const parent = state.nodes[parentId];
    if (parent.leftId === currentId) {
      parent.leftId = childId;
    } else {
      parent.rightId = childId;
    }
  }
  delete state.nodes[currentId];
  stats.operations++;
  pushStep('delete', parentId ? [parentId] : [], 12);

  pushStep('done', [], 13);
  return steps;
}

export type TraversalOrder = 'inorder' | 'preorder' | 'postorder';

export function bstTraverse(insertionOrder: number[], order: TraversalOrder): TreeStep[] {
  const state = buildTreeSilently(insertionOrder);
  const steps: TreeStep[] = [];
  const stats: StepStats = { comparisons: 0, operations: 0 };
  let stepIndex = 0;

  const pushVisit = (nodeId: string, pseudocodeLine: number) => {
    stats.operations++;
    steps.push({
      stepIndex: stepIndex++,
      pseudocodeLine,
      stats: { ...stats },
      nodes: cloneNodes(state.nodes),
      rootId: state.rootId,
      activeNodeIds: [nodeId],
      kind: 'visit',
    });
  };

  const visit = (nodeId: string | null) => {
    if (nodeId === null) return;
    const node = state.nodes[nodeId];

    if (order === 'preorder') pushVisit(nodeId, 2);
    visit(node.leftId);
    if (order === 'inorder') pushVisit(nodeId, 3);
    visit(node.rightId);
    if (order === 'postorder') pushVisit(nodeId, 4);
  };

  visit(state.rootId);

  steps.push({
    stepIndex: stepIndex++,
    pseudocodeLine: 5,
    stats: { ...stats },
    nodes: cloneNodes(state.nodes),
    rootId: state.rootId,
    activeNodeIds: [],
    kind: 'done',
  });

  return steps;
}
