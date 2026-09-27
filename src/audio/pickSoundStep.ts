import type { Step } from '../algorithms/types';
import { soundFor } from './soundMap';

/**
 * Nagyobb szám = fontosabb. A néma lépések (compare, visit) nem versenyeznek: egy
 * [swap, compare] kötegben a swap szól, nem a csend (fazis-12 3.4).
 */
const PRIORITY: Partial<Record<Step['kind'], number>> = {
  done: 3,
  found: 3,
  'not-found': 3,
  'sorted-marker': 2,
  insert: 2,
  delete: 2,
  swap: 1,
  set: 1,
  'rebalance-pointer': 1,
};

/**
 * Egy képkockában összevont lépések (fromIndex, toIndex] közül a legfontosabb hangot adó;
 * egyenlőségnél a későbbi. Egylépéses kötegnél (kézi ⏭, 60 lépés/mp alatt) maga az a lépés.
 */
export function pickSoundStep(steps: Step[], fromIndex: number, toIndex: number): Step | null {
  let best: Step | null = null;
  let bestPriority = -1;
  for (let i = fromIndex + 1; i <= toIndex; i++) {
    const step = steps[i];
    if (!step || !soundFor(step.kind)) continue;
    const priority = PRIORITY[step.kind] ?? 0;
    if (priority >= bestPriority) {
      best = step;
      bestPriority = priority;
    }
  }
  return best;
}
