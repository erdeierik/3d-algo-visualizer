import { describe, expect, it } from 'vitest';
import { MASTER, SOUND_MAP, soundFor } from './soundMap';
import type { Step } from '../algorithms/types';

/**
 * Minden `Step['kind']` pontosan egyszer. A `Record` kikényszeríti, hogy ha a union
 * később bővül, ez a tábla fordítási hibát adjon — ez fogja meg, ha egy új lépés-fajtához
 * elfelejtünk hangot rendelni (vagy tudatosan némának jelölni).
 */
const SHOULD_SOUND: Record<Step['kind'], boolean> = {
  compare: false,
  visit: false,
  swap: true,
  set: true,
  'sorted-marker': true,
  insert: true,
  delete: true,
  'rebalance-pointer': true,
  found: true,
  'not-found': true,
  done: true,
};

describe('SOUND_MAP', () => {
  it('a compare és a visit néma', () => {
    expect(soundFor('compare')).toBeUndefined();
    expect(soundFor('visit')).toBeUndefined();
  });

  it('pontosan a hangzó kind-okra van bejegyzés', () => {
    for (const kind of Object.keys(SHOULD_SOUND) as Step['kind'][]) {
      expect(soundFor(kind) !== undefined).toBe(SHOULD_SOUND[kind]);
    }
  });

  it('minden bejegyzés paraméterei érvényes tartományban vannak', () => {
    for (const spec of Object.values(SOUND_MAP)) {
      if (!spec) continue;
      expect(spec.frequency).toBeGreaterThan(0);
      expect(spec.duration).toBeGreaterThan(0.02);
      expect(spec.volume).toBeGreaterThan(0);
      expect(spec.volume).toBeLessThanOrEqual(1);
    }
  });

  it('a found és a not-found hallásra elkülönül', () => {
    expect(SOUND_MAP.found?.type).not.toBe(SOUND_MAP['not-found']?.type);
    expect(SOUND_MAP.found?.frequency).toBeGreaterThan(SOUND_MAP['not-found']?.frequency ?? 0);
  });

  it('a master paraméterek értelmes tartományban vannak', () => {
    expect(MASTER.volume).toBeGreaterThan(0);
    expect(MASTER.volume).toBeLessThanOrEqual(1);
    expect(MASTER.voiceCap).toBeGreaterThanOrEqual(2);
  });
});
