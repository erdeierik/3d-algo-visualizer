import { describe, expect, it } from 'vitest';
import { SIZE_RANGE, randomUniqueValues, valueMaxFor } from './sessionStore';

describe('valueMaxFor', () => {
  it('kis fáknál marad az 1..99 tartomány', () => {
    expect(valueMaxFor(5)).toBe(99);
    expect(valueMaxFor(30)).toBe(99);
  });

  it('nagy fáknál a mérettel nő', () => {
    expect(valueMaxFor(100)).toBe(200);
  });
});

describe('randomUniqueValues', () => {
  it('a legnagyobb fa-méretnél is véget ér, egyedi értékekkel a tartományon belül', () => {
    const [, maxSize] = SIZE_RANGE.tree;
    const values = randomUniqueValues(maxSize);
    expect(values).toHaveLength(maxSize);
    expect(new Set(values).size).toBe(maxSize);
    for (const value of values) {
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(valueMaxFor(maxSize));
    }
  });

  it('lehetetlen kérésre hibát dob végtelen ciklus helyett', () => {
    expect(() => randomUniqueValues(100, 99)).toThrow(RangeError);
  });
});
