/**
 * Szélben hajlás: két összeadott szinusz, példányonként külön fázissal (temak-poc.md 5.3).
 * Egyetlen szinusz gépiesen szabályos lenne; a második, gyorsabb tag töri meg a ritmust.
 * A visszaadott érték radiánban értett elhajlás, |bend| <= 0.132.
 */
export function windBend(elapsed: number, phase: number): number {
  return Math.sin(elapsed * 1.05 + phase) * 0.1 + Math.sin(elapsed * 2.4 + phase * 1.7) * 0.032;
}

export const POLLEN_RISE = 0.24; // egység / másodperc
export const POLLEN_CEILING = 6.2;

/** Pollen-emelkedés; a plafon fölött a szem visszaesik a talajra — így a mező sosem ürül ki. */
export function driftY(y: number, delta: number): number {
  const next = y + POLLEN_RISE * delta;
  return next > POLLEN_CEILING ? 0 : next;
}
