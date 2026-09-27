/**
 * A bárok és csomópontok közös, rögzített hosszú tweenje (fazis-12 4.). A hosszt a lejátszó
 * adja (`playerStore.tweenMs`), így minden mozgás véget ér a következő lépés előtt.
 */

/** A backdate felső korlátja: akadás után se kezdődjön a tween túl régen „a múltban". */
const MAX_BACKDATE_MS = 250;

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** 0..1 közötti, easinggel torzított haladás; 0 hosszú tween azonnal kész. */
export function tweenProgress(elapsedMs: number, durationMs: number): number {
  if (durationMs <= 0) return 1;
  return easeInOutCubic(Math.min(Math.max(elapsedMs / durationMs, 0), 1));
}

export interface TweenTiming {
  /** ms, a useFrame órája szerint */
  start: number;
  /** ms; újracélzáskor rögzül, így egy későbbi tweenMs-váltás nem rántja meg a futó tweent */
  duration: number;
}

/** A haladás `now`-ban; `animate === false` esetén azonnal 1 (NFR-11). */
export function tweenAlpha(timing: TweenTiming, now: number, animate: boolean): number {
  return tweenProgress(now - timing.start, animate ? timing.duration : 0);
}

/**
 * Új tween indítása. A kezdés az előző képkocka idejére van visszadátumozva, mert a lépés az
 * azóta eltelt időben történt: így nincs „holt" első képkocka, és a képkockánál rövidebb tween
 * (50–100×) már az első képkockában célba ér (fazis-12 3.3).
 */
export function restartTiming(timing: TweenTiming, now: number, deltaSec: number, durationMs: number): void {
  timing.start = now - Math.min(deltaSec * 1000, MAX_BACKDATE_MS);
  timing.duration = durationMs;
}
