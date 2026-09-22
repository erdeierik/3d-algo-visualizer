import { describe, expect, it } from 'vitest';
import { scatter } from './scatter';
import { driftY, POLLEN_CEILING, windBend } from './ambient';
import { quantizeRadius, RADIUS_STEP } from './decorProfile';

const RING = { count: 200, rMin: 10, rMax: 30, seed: 42 };

describe('scatter', () => {
  it('azonos seed mellett azonos mezőt ad', () => {
    expect(scatter(RING)).toEqual(scatter(RING));
  });

  it('eltérő seed mellett más mezőt ad', () => {
    expect(scatter(RING)).not.toEqual(scatter({ ...RING, seed: 43 }));
  });

  it('a vízszintes sugár a megadott tartományban marad', () => {
    for (const item of scatter(RING)) {
      const radius = Math.hypot(item.x, item.z);
      expect(radius).toBeGreaterThanOrEqual(RING.rMin - 1e-9);
      expect(radius).toBeLessThanOrEqual(RING.rMax + 1e-9);
      expect(item.y).toBe(0); // gyűrű-módban minden példány a talajon van
    }
  });

  it('gömbhéj-módban a lapítás korlátozza az Y-t', () => {
    for (const item of scatter({ ...RING, shell: true, flattenY: 0.55 })) {
      expect(Math.abs(item.y)).toBeLessThanOrEqual(RING.rMax * 0.55 + 1e-9);
    }
  });

  it('a fázisok szétszórtak — nem lengene együtt az egész mező', () => {
    const phases = new Set(scatter(RING).map((item) => item.phase));
    expect(phases.size).toBeGreaterThan(RING.count * 0.9);
  });
});

describe('windBend', () => {
  it('korlátos marad', () => {
    for (let t = 0; t < 40; t += 0.13) {
      expect(Math.abs(windBend(t, 1.7))).toBeLessThanOrEqual(0.132 + 1e-9);
    }
  });

  it('eltérő fázis eltérő elhajlást ad ugyanabban a pillanatban', () => {
    expect(windBend(3, 0)).not.toBeCloseTo(windBend(3, 1.9), 3);
  });
});

describe('driftY', () => {
  it('emelkedik, majd a plafon fölött visszaesik a talajra', () => {
    expect(driftY(1, 0.5)).toBeCloseTo(1.12, 5);
    expect(driftY(POLLEN_CEILING, 0.5)).toBe(0);
  });
});

describe('quantizeRadius', () => {
  it('felfelé kerekít a lépcsőre, és sosem ad 0-t', () => {
    expect(quantizeRadius(0)).toBe(RADIUS_STEP);
    expect(quantizeRadius(13)).toBe(16);
    expect(quantizeRadius(16)).toBe(16);
  });
});
