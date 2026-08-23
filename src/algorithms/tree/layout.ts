import type { TreeNodeSnapshot } from '../types';

export interface TreeLayoutPosition {
  x: number;
  y: number;
}

const HORIZONTAL_SPACING = 1.5;
const VERTICAL_SPACING = 1.2;

export function computeTreeLayout(
  nodes: Record<string, TreeNodeSnapshot>,
  rootId: string | null,
): Record<string, TreeLayoutPosition> {
  const positions: Record<string, TreeLayoutPosition> = {};
  let inorderCounter = 0;

  const visit = (nodeId: string | null, depth: number) => {
    if (nodeId === null) return;
    const node = nodes[nodeId];

    visit(node.leftId, depth + 1);

    positions[nodeId] = {
      x: inorderCounter * HORIZONTAL_SPACING,
      y: -depth * VERTICAL_SPACING,
    };
    inorderCounter++;

    visit(node.rightId, depth + 1);
  };

  visit(rootId, 0);
  return positions;
}
