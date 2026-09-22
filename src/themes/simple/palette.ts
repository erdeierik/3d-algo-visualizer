import type { HudStyle, VisualState } from '../types';

export const BACKGROUND = '#0f1115';
export const LABEL_COLOR = '#ffffff';
/** Sötét jelenet: a HUD a Fázis 5 óta segítség nélkül olvasható. */
export const HUD: HudStyle = { shadeTop: 'transparent', shadeBottom: 'transparent', halo: 'none' };
export const EDGE_COLOR = '#718096';

/** A mai SortingScene COLORS + TreeScene ACTIVE_COLOR értékei, egy az egyben. */
export const SIMPLE_PALETTE: Record<VisualState, string> = {
  idle: '#4a5568',
  compare: '#ecc94b',
  swap: '#f56565',
  sorted: '#48bb78',
  insert: '#48bb78',
  found: '#48bb78',
};
