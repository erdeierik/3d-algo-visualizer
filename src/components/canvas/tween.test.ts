import { describe, expect, it } from 'vitest';
import { easeInOutCubic, restartTiming, tweenAlpha, tweenProgress, type TweenTiming } from './tween';

describe('easeInOutCubic', () => {
  it('a végpontokat és a felezőpontot megtartja', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(1)).toBe(1);
  });

  it('monoton nő', () => {
    let prev = -1;
    for (let t = 0; t <= 1; t += 0.05) {
      const value = easeInOutCubic(t);
      expect(value).toBeGreaterThanOrEqual(prev);
      prev = value;
    }
  });
});

describe('tweenProgress', () => {
  it('0 hosszú tween azonnal kész', () => {
    expect(tweenProgress(0, 0)).toBe(1);
  });

  it('a túlfutást és a negatív időt clampeli', () => {
    expect(tweenProgress(500, 300)).toBe(1);
    expect(tweenProgress(-10, 300)).toBe(0);
  });
});

describe('tweenAlpha / restartTiming', () => {
  it('a kezdést egy képkockával visszadátumozza', () => {
    const timing: TweenTiming = { start: 0, duration: 0 };
    restartTiming(timing, 1000, 0.016, 300);
    expect(timing.start).toBeCloseTo(984);
    expect(timing.duration).toBe(300);
  });

  it('a képkockánál rövidebb tween az első képkockában célba ér', () => {
    const timing: TweenTiming = { start: 0, duration: 0 };
    restartTiming(timing, 1000, 1 / 60, 7.5); // 100×
    expect(tweenAlpha(timing, 1000, true)).toBe(1);
  });

  it('a visszadátumozás legfeljebb 250 ms', () => {
    const timing: TweenTiming = { start: 0, duration: 0 };
    restartTiming(timing, 10_000, 5, 300); // 5 s-os akadás
    expect(timing.start).toBe(9750);
  });

  it('animate = false esetén azonnal 1', () => {
    const timing: TweenTiming = { start: 1000, duration: 300 };
    expect(tweenAlpha(timing, 1000, false)).toBe(1);
  });
});
