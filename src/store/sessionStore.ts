import { create } from 'zustand';
import { usePlayerStore } from './playerStore';
import { algorithmRegistry } from '../algorithms/registry';
import type { AlgorithmDefinition } from '../algorithms/types';

export const SIZE_RANGE: Record<AlgorithmDefinition['category'], [number, number]> = {
  sorting: [5, 100],
  tree: [5, 100],
};

const DEFAULT_MAX_VALUE = 99;

/**
 * A fa értékei egyediek, ezért a tartománynak a mérettel nőnie kell: fix 1..99 mellett 100
 * csomópontnál a sorsolás sosem érne véget (fazis-12-tree-size-range.md).
 */
export function valueMaxFor(count: number): number {
  return Math.max(DEFAULT_MAX_VALUE, count * 2);
}

function randomValues(count: number, max = DEFAULT_MAX_VALUE): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * max) + 1);
}

export function randomUniqueValues(count: number, max = valueMaxFor(count)): number[] {
  // őrfeltétel: végtelen ciklus (fagyott oldal) helyett azonnali, látható hiba
  if (count > max) throw new RangeError(`${count} egyedi érték nem sorsolható az 1..${max} tartományból`);
  const values = new Set<number>();
  while (values.size < count) values.add(Math.floor(Math.random() * max) + 1);
  return Array.from(values);
}

function pickTarget(data: number[], max: number): number {
  // 70%: a fában biztosan meglévő érték, 30%: valószínűleg hiányzó (a not-found ág is látszódjon)
  return Math.random() < 0.7
    ? data[Math.floor(Math.random() * data.length)]
    : Math.floor(Math.random() * max) + 1;
}

function getDefinition(id: string): AlgorithmDefinition {
  return algorithmRegistry.find((a) => a.id === id) ?? algorithmRegistry[0];
}

interface SessionState {
  selectedId: string;
  dataSize: number;
  target: number | null;
  selectAlgorithm: (id: string) => void;
  setDataSize: (size: number) => void;
  generateData: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  selectedId: algorithmRegistry[0].id,
  dataSize: 9,
  target: null,

  selectAlgorithm: (id) => {
    const [min, max] = SIZE_RANGE[getDefinition(id).category];
    set({ selectedId: id, dataSize: Math.min(Math.max(get().dataSize, min), max) });
    get().generateData();
  },

  setDataSize: (size) => set({ dataSize: size }),

  generateData: () => {
    const { selectedId, dataSize } = get();
    const def = getDefinition(selectedId);
    const max = def.category === 'tree' ? valueMaxFor(dataSize) : DEFAULT_MAX_VALUE;
    const data = def.category === 'tree' ? randomUniqueValues(dataSize, max) : randomValues(dataSize, max);
    const target = def.requiresTarget ? pickTarget(data, max) : null;
    set({ target });
    usePlayerStore
      .getState()
      .loadSteps(def.run(def.requiresTarget ? { insertionOrder: data, target } : data));
  },
}));

export function useCurrentDefinition(): AlgorithmDefinition {
  return getDefinition(useSessionStore((s) => s.selectedId));
}
