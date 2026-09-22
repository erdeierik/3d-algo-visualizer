// src/themes/living-tree/palette.ts
import type { ContentBounds, HudStyle, VisualState } from '../types';

export const ZENITH = '#2f6fb0';
/** A horizont-sáv, a köd és a scene.background UGYANAZ a szín — így olvad bele minden. */
export const HORIZON = '#6fb3e6';
export const LABEL_COLOR = '#f4f1d6';
/**
 * Világos jelenet: a keret nélküli HUD alá él-sötétítés, a szövegre glória.
 * Mindkét tónus a mögötte álló jelenet-részből jön, különben szürke fátyolnak látszik:
 * fent a ZENITH sötétített kékje (ég), lent a talaj sötét foltjainak zöldje.
 */
export const HUD: HudStyle = {
  shadeTop: 'rgba(18, 44, 78, 0.5)',
  shadeBottom: 'rgba(22, 30, 16, 0.55)',
  halo: '0 1px 2px rgba(10, 14, 8, 0.85), 0 0 8px rgba(10, 14, 8, 0.5)',
};
export const BARK_COLOR = '#6b4f32';
export const KNOT_COLOR = '#5c6b3a';
export const GROUND_COLORS = ['#7d8a4e', '#6d7a43', '#8d9a5c'] as const;
export const FLOWER_COLORS = ['#e6cf46', '#d489b8', '#eef2ee'] as const;

/** Itt az állapot nem szín, hanem ÉRETTSÉG: éretlen zöld → sárguló → érett piros → arany. */
export const LIVING_TREE_PALETTE: Record<VisualState, string> = {
  idle: '#6f8f4a',
  compare: '#e0a52e',
  swap: '#c94f37',
  sorted: '#d6b939',
  insert: '#d6b939',
  found: '#d6b939',
};

/** A tartalom legalsó pontja ennyivel kerüljön a talaj (y = 0) fölé. */
const GROUND_CLEARANCE = 1.2;

/**
 * A fát a talaj FÖLÉ kell emelni: a computeTreeLayout a gyökeret y = 0-ra, a gyerekeket
 * negatív y-ra teszi, tehát talajos témában a fa fele a föld alá kerülne (temak-poc.md 6.2).
 * A PoC konstans TREE_LIFT = 5.6-ot használt; itt az eltolás a fa TÉNYLEGES mélységéből jön.
 * Sortingban a bounds.min.y = 0, tehát az eltolás 0 marad — a bárok már a talajon állnak.
 */
export function livingTreeOffsetY(bounds: ContentBounds): number {
  if (bounds.min.y >= 0) return 0;
  return GROUND_CLEARANCE - bounds.min.y;
}
