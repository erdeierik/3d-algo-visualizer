import { Vector3 } from 'three';
import { computeTreeLayout } from '../../algorithms/tree/layout';
import type { AlgorithmDefinition, SortStep, Step, TreeStep } from '../../algorithms/types';
import type { ContentBounds } from '../../themes/types';

export const SPACING = 1.2;
export const MAX_BAR_HEIGHT = 6;

const SORT_MARGIN = 0.6;
const BAR_TOP_MARGIN = 0.7;
const BAR_HALF_DEPTH = 0.5;
const NODE_MARGIN = 0.7; // a 0.4 sugarú gömb + 0.3 levegő

function emptyBounds(): ContentBounds {
  return { min: new Vector3(), max: new Vector3(), radius: 0, count: 0 };
}

function fromExtent(min: Vector3, max: Vector3, count: number): ContentBounds {
  return { min, max, radius: (max.x - min.x) / 2, count };
}

/** A bárok kerete: x = −0.6 … (n−1) × SPACING + 0.6, y = 0 … MAX_BAR_HEIGHT + 0.7 (terv 7.1). */
function sortingBounds(steps: SortStep[]): ContentBounds {
  const count = steps[0].array.length;
  if (count === 0) return emptyBounds();
  return fromExtent(
    new Vector3(-SORT_MARGIN, 0, -BAR_HALF_DEPTH),
    new Vector3((count - 1) * SPACING + SORT_MARGIN, MAX_BAR_HEIGHT + BAR_TOP_MARGIN, BAR_HALF_DEPTH),
    count,
  );
}

/** A fa kerete a VÉGÁLLAPOT layoutjából — így a kamera nem ugrál, miközben a fa nő. */
function treeBounds(steps: TreeStep[]): ContentBounds {
  const last = steps[steps.length - 1];
  const positions = Object.values(computeTreeLayout(last.nodes, last.rootId));
  if (positions.length === 0) return emptyBounds();

  const xs = positions.map((p) => p.x);
  const ys = positions.map((p) => p.y);

  return fromExtent(
    new Vector3(Math.min(...xs) - NODE_MARGIN, Math.min(...ys) - NODE_MARGIN, -NODE_MARGIN),
    new Vector3(Math.max(...xs) + NODE_MARGIN, Math.max(...ys) + NODE_MARGIN, NODE_MARGIN),
    positions.length,
  );
}

export function computeContentBounds(
  steps: Step[],
  category: AlgorithmDefinition['category'],
): ContentBounds {
  if (steps.length === 0) return emptyBounds();
  return category === 'tree'
    ? treeBounds(steps as TreeStep[])
    : sortingBounds(steps as SortStep[]);
}
