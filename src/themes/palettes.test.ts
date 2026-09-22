import { describe, expect, it } from 'vitest';
import { VISUAL_STATES } from './types';
import { COSMOS_PALETTE, HUD as COSMOS_HUD } from './cosmos/palette';
import { HUD as LIVING_TREE_HUD, LIVING_TREE_PALETTE } from './living-tree/palette';
import { HUD as SIMPLE_HUD, SIMPLE_PALETTE } from './simple/palette';

const PALETTES: Record<string, Record<string, string>> = {
  simple: SIMPLE_PALETTE,
  cosmos: COSMOS_PALETTE,
  'living-tree': LIVING_TREE_PALETTE,
};

describe('téma-paletták teljessége', () => {
  for (const [id, palette] of Object.entries(PALETTES)) {
    it(`${id}: minden VisualState-hez ad érvényes színt`, () => {
      for (const state of VISUAL_STATES) {
        expect(palette[state]).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });
  }
});

const HUDS = { simple: SIMPLE_HUD, cosmos: COSMOS_HUD, 'living-tree': LIVING_TREE_HUD };

describe('téma HUD-stílusok', () => {
  for (const [id, hud] of Object.entries(HUDS)) {
    it(`${id}: a sötétítő tónusok és a halo nem üresek`, () => {
      for (const value of Object.values(hud)) {
        expect(value.trim()).not.toBe('');
      }
    });
  }

  it('a sötét témák HUD-ja semleges — a kinézetük nem változhat', () => {
    for (const hud of [SIMPLE_HUD, COSMOS_HUD]) {
      expect(hud).toEqual({ shadeTop: 'transparent', shadeBottom: 'transparent', halo: 'none' });
    }
  });
});
