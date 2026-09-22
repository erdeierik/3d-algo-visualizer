// src/themes/cosmos/palette.ts
import type { HudStyle, VisualState } from '../types';

export const BACKGROUND = '#05070f';
export const LABEL_COLOR = '#dbe7ff';
/** Sötét jelenet: a HUD a Fázis 5 óta segítség nélkül olvasható. */
export const HUD: HudStyle = { shadeTop: 'transparent', shadeBottom: 'transparent', halo: 'none' };
export const EDGE_COLOR = '#6f9dff';

/** A köd adja a mélységet — a háttérrel AZONOS színnel, hogy a távoli csillagok beleolvadjanak. */
export const FOG_DENSITY = 0.009;

/** A téma kulcs-trükkje: emissive = color × 0.42 minden képkockán (temak-poc.md 3.). */
export const EMISSIVE_FACTOR = 0.42;

export const COSMOS_PALETTE: Record<VisualState, string> = {
  idle: '#33507f',
  compare: '#ffd166',
  swap: '#ff6b6b',
  sorted: '#5ee7c0',
  insert: '#5ee7c0',
  found: '#5ee7c0',
};
