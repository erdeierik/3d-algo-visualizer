import { THEME_IDS, type Quality, type ThemeId } from '../themes/types';

export const STORAGE_KEY = 'algoviz.settings';
export const SCHEMA_VERSION = 1;

export interface Settings {
  theme: ThemeId;
  volume: number; // 0..1
  muted: boolean;
  showLabels: boolean;
  animate: boolean;
  quality: Quality;
}

/** A theme alapértéke a Fázis 11 zárásáig 'simple' — a 'cosmos' addig nem létezik. */
const BASE_DEFAULTS: Settings = {
  theme: 'simple',
  volume: 0.7,
  muted: false,
  showLabels: true,
  animate: true,
  quality: 'high',
};

function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && (THEME_IDS as readonly string[]).includes(value);
}

function isUnitRange(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
}

function isQuality(value: unknown): value is Quality {
  return value === 'low' || value === 'high';
}

/**
 * Az animate alapértéke a prefers-reduced-motion inverze — de csak az ALAPÉRTÉKE.
 * A felhasználói kapcsoló ezt utólag mindig felülírja (NFR-11 pontosítása).
 */
export function defaultSettings(prefersReducedMotion = false): Settings {
  return { ...BASE_DEFAULTS, animate: !prefersReducedMotion };
}

/** Mezőnkénti hibatűrő beolvasás: ami nem érvényes, az alapértékre esik (NFR-12). */
export function parseSettings(raw: string | null, defaults = defaultSettings()): Settings {
  let stored: Record<string, unknown> | null = null;

  try {
    const parsed: unknown = raw === null ? null : JSON.parse(raw);
    if (parsed !== null && typeof parsed === 'object') {
      const candidate = parsed as Record<string, unknown>;
      if (candidate.v === SCHEMA_VERSION) stored = candidate;
    }
  } catch {
    stored = null; // nem-JSON tartalom
  }

  if (stored === null) return { ...defaults };

  return {
    theme: isThemeId(stored.theme) ? stored.theme : defaults.theme,
    volume: isUnitRange(stored.volume) ? stored.volume : defaults.volume,
    muted: typeof stored.muted === 'boolean' ? stored.muted : defaults.muted,
    showLabels: typeof stored.showLabels === 'boolean' ? stored.showLabels : defaults.showLabels,
    animate: typeof stored.animate === 'boolean' ? stored.animate : defaults.animate,
    quality: isQuality(stored.quality) ? stored.quality : defaults.quality,
  };
}

export function serializeSettings(settings: Settings): string {
  return JSON.stringify({ v: SCHEMA_VERSION, ...settings });
}
