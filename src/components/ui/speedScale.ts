/**
 * Logaritmikus sebesség-csúszka (fazis-12 5.): a 0..SLIDER_MAX pozícióból
 * speed = MIN_SPEED · RANGE^p. A lassú sebességek finoman állíthatók maradnak, a 100× is elérhető.
 */
export const MIN_SPEED = 0.5;
export const MAX_SPEED = 100;
export const SLIDER_MAX = 1000;
const RANGE = MAX_SPEED / MIN_SPEED;

/** Kerek értékek: < 2 → 0,1-es; < 10 → 0,5-ös; < 20 → 1-es; felette 5-ös lépés. */
export function niceSpeed(raw: number): number {
  const step = raw < 2 ? 0.1 : raw < 10 ? 0.5 : raw < 20 ? 1 : 5;
  const clamped = Math.min(MAX_SPEED, Math.max(MIN_SPEED, Math.round(raw / step) * step));
  return Number(clamped.toFixed(1)); // 0.30000000000000004 → 0.3
}

export function toSpeed(position: number): number {
  return niceSpeed(MIN_SPEED * RANGE ** (position / SLIDER_MAX));
}

export function toPosition(speed: number): number {
  return Math.round((Math.log(speed / MIN_SPEED) / Math.log(RANGE)) * SLIDER_MAX);
}
