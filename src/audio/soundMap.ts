import type { Step } from '../algorithms/types';

export interface SoundSpec {
  type: OscillatorType;
  frequency: number; // Hz
  duration: number; // s
  volume: number; // 0..1
}

export const MASTER = { volume: 0.9, voiceCap: 6 };

/**
 * A `Step Sound Lab` PoC-ban hangolt „Neutral UI” készlet.
 * A `compare` és a `visit` SZÁNDÉKOSAN hiányzik: ezek a leggyakoribb lépések, hangosítva
 * egyetlen zajmasszává állnának össze. Hiányzó bejegyzés = néma lépés, kivétel-lista nélkül.
 */
export const SOUND_MAP: Partial<Record<Step['kind'], SoundSpec>> = {
  swap: { type: 'triangle', frequency: 420, duration: 0.09, volume: 0.55 },
  set: { type: 'triangle', frequency: 340, duration: 0.08, volume: 0.45 },
  'sorted-marker': { type: 'sine', frequency: 660, duration: 0.14, volume: 0.5 },
  insert: { type: 'triangle', frequency: 523, duration: 0.1, volume: 0.55 },
  delete: { type: 'triangle', frequency: 247, duration: 0.13, volume: 0.55 },
  'rebalance-pointer': { type: 'sine', frequency: 311, duration: 0.08, volume: 0.4 },
  found: { type: 'sine', frequency: 784, duration: 0.22, volume: 0.65 },
  'not-found': { type: 'square', frequency: 175, duration: 0.26, volume: 0.45 },
  done: { type: 'sine', frequency: 880, duration: 0.34, volume: 0.6 },
};

export function soundFor(kind: Step['kind']): SoundSpec | undefined {
  return SOUND_MAP[kind];
}
