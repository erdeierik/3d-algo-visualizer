import { create } from 'zustand';
import { usePlayerStore } from './playerStore';
import { algorithmRegistry } from '../algorithms/registry';
import type { AlgorithmDefinition } from '../algorithms/types';

export const SIZE_RANGE: Record<AlgorithmDefinition['category'], [number, number]> = {
  sorting: [5, 100],
  tree: [5, 30],
};

function randomValues(count: number, max = 99): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * max) + 1);
}

function randomUniqueValues(count: number, max = 99): number[] {
  const values = new Set<number>();
  while (values.size < count) values.add(Math.floor(Math.random() * max) + 1);
  return Array.from(values);
}

function pickTarget(data: number[]): number {
  // 70%: a fában biztosan meglévő érték, 30%: valószínűleg hiányzó (a not-found ág is látszódjon)
  return Math.random() < 0.7
    ? data[Math.floor(Math.random() * data.length)]
    : Math.floor(Math.random() * 99) + 1;
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
    const data = def.category === 'tree' ? randomUniqueValues(dataSize) : randomValues(dataSize);
    const target = def.requiresTarget ? pickTarget(data) : null;
    set({ target });
    usePlayerStore
      .getState()
      .loadSteps(def.run(def.requiresTarget ? { insertionOrder: data, target } : data));
  },
}));

export function useCurrentDefinition(): AlgorithmDefinition {
  return getDefinition(useSessionStore((s) => s.selectedId));
}
