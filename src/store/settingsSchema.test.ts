import { describe, expect, it } from 'vitest';
import {
  SCHEMA_VERSION,
  defaultSettings,
  parseSettings,
  serializeSettings,
  type Settings,
} from './settingsSchema';

const DEFAULTS = defaultSettings();

function stored(fields: Record<string, unknown>): string {
  return JSON.stringify({ v: SCHEMA_VERSION, ...fields });
}

describe('defaultSettings', () => {
  it('a theme alapértéke cosmos (a Fázis 11 zárásának korrekciója)', () => {
    expect(DEFAULTS.theme).toBe('cosmos');
  });

  it('az animate alapértéke a prefers-reduced-motion inverze', () => {
    expect(defaultSettings(false).animate).toBe(true);
    expect(defaultSettings(true).animate).toBe(false);
  });
});

describe('parseSettings — hibaágak', () => {
  it('hiányzó kulcs esetén alapértékre esik', () => {
    expect(parseSettings(null)).toEqual(DEFAULTS);
  });

  it('nem-JSON tartalom esetén alapértékre esik', () => {
    expect(parseSettings('{ nem json')).toEqual(DEFAULTS);
    expect(parseSettings('null')).toEqual(DEFAULTS);
  });

  it('rossz séma-verzió esetén az egész objektum elévül', () => {
    const raw = JSON.stringify({ v: 99, volume: 0.1, muted: true });
    expect(parseSettings(raw)).toEqual(DEFAULTS);
  });

  it('tartományon kívüli volume esetén csak az a mező esik alapértékre', () => {
    const result = parseSettings(stored({ volume: 4.2, muted: true }));
    expect(result.volume).toBe(DEFAULTS.volume);
    expect(result.muted).toBe(true);
  });

  it('nem szám volume és nem boolean kapcsoló esetén is mezőnként esik vissza', () => {
    const result = parseSettings(stored({ volume: '0.5', showLabels: 'igen', animate: 0 }));
    expect(result.volume).toBe(DEFAULTS.volume);
    expect(result.showLabels).toBe(DEFAULTS.showLabels);
    expect(result.animate).toBe(DEFAULTS.animate);
  });

  it('ismeretlen theme-id esetén alapértékre esik, az ismert cosmos viszont átmegy', () => {
    expect(parseSettings(stored({ theme: 'neon-city' })).theme).toBe(DEFAULTS.theme);
    expect(parseSettings(stored({ theme: 'cosmos' })).theme).toBe('cosmos');
  });

  it('érvénytelen quality esetén alapértékre esik', () => {
    expect(parseSettings(stored({ quality: 'ultra' })).quality).toBe(DEFAULTS.quality);
  });
});

describe('parseSettings — körbejárás', () => {
  it('a serializeSettings kimenetét változatlanul visszaadja', () => {
    const settings: Settings = {
      theme: 'living-tree',
      volume: 0.25,
      muted: true,
      showLabels: false,
      animate: false,
      quality: 'low',
    };
    expect(parseSettings(serializeSettings(settings))).toEqual(settings);
  });
});
