import { describe, expect, it } from 'vitest';
import { selectVoicesToRelease } from './voiceCap';

function voices(...startedAt: number[]) {
  return startedAt.map((t) => ({ startedAt: t }));
}

describe('selectVoicesToRelease', () => {
  it('üres listából nem vesz el semmit', () => {
    expect(selectVoicesToRelease(voices(), 6)).toEqual([]);
  });

  it('a keret alatt nem vesz el semmit', () => {
    expect(selectVoicesToRelease(voices(1, 2, 3, 4, 5), 6)).toEqual([]);
  });

  it('betelt keretnél pontosan egyet vesz el, a legrégebbit', () => {
    const result = selectVoicesToRelease(voices(5, 1, 4, 2, 6, 3), 6);
    expect(result).toEqual([{ startedAt: 1 }]);
  });

  it('túlcsordulásnál annyit vesz el, hogy az új hang beférjen', () => {
    const result = selectVoicesToRelease(voices(9, 7, 8, 1, 2, 3, 4, 5), 6);
    expect(result).toEqual([{ startedAt: 1 }, { startedAt: 2 }, { startedAt: 3 }]);
  });

  it('nem rendezi át a bemeneti tömböt', () => {
    const input = voices(3, 1, 2);
    selectVoicesToRelease(input, 2);
    expect(input.map((v) => v.startedAt)).toEqual([3, 1, 2]);
  });
});
