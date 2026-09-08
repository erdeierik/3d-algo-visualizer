import { describe, expect, it } from 'vitest';
import { volumeToGain } from './volumeCurve';

describe('volumeToGain', () => {
  it('a végpontokat pontosan tartja', () => {
    expect(volumeToGain(0)).toBe(0);
    expect(volumeToGain(1)).toBe(1);
  });

  it('szigorúan monoton növekvő', () => {
    for (let v = 0.1; v <= 1; v += 0.1) {
      expect(volumeToGain(v)).toBeGreaterThan(volumeToGain(v - 0.1));
    }
  });

  it('a középső állásban halkabb a lineárisnál (kb. −12 dB)', () => {
    const gain = volumeToGain(0.5);
    expect(gain).toBeLessThan(0.5);
    expect(20 * Math.log10(gain)).toBeCloseTo(-12, 0);
  });

  it('tartományon kívüli és értelmetlen értéket levág', () => {
    expect(volumeToGain(-0.5)).toBe(0);
    expect(volumeToGain(3)).toBe(1);
    expect(volumeToGain(Number.NaN)).toBe(0);
  });
});
