import { describe, expect, it } from 'vitest';
import { MAX_SPEED, MIN_SPEED, SLIDER_MAX, niceSpeed, toPosition, toSpeed } from './speedScale';

describe('speedScale', () => {
  it('a csúszka két vége 0,5× és 100×', () => {
    expect(toSpeed(0)).toBe(MIN_SPEED);
    expect(toSpeed(SLIDER_MAX)).toBe(MAX_SPEED);
  });

  it('oda-vissza stabil a kerek értékeken', () => {
    for (const speed of [0.5, 1, 2, 5, 10, 25, 50, 100]) {
      expect(toSpeed(toPosition(speed))).toBe(speed);
    }
  });

  it('kerek értékekre kerekít, lebegőpontos maradék nélkül', () => {
    expect(niceSpeed(0.2999)).toBe(0.5); // alsó korlát
    expect(niceSpeed(0.73)).toBe(0.7);
    expect(niceSpeed(1.26)).toBe(1.3);
    expect(niceSpeed(7.3)).toBe(7.5);
    expect(niceSpeed(13.4)).toBe(13);
    expect(niceSpeed(37)).toBe(35);
    expect(niceSpeed(140)).toBe(100); // felső korlát
  });

  it('a pozíció szerint monoton nő', () => {
    let prev = 0;
    for (let position = 0; position <= SLIDER_MAX; position += 10) {
      const speed = toSpeed(position);
      expect(speed).toBeGreaterThanOrEqual(prev);
      prev = speed;
    }
  });
});
