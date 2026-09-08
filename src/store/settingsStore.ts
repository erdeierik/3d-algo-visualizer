import { create } from 'zustand';
import type { Quality, ThemeId } from '../themes/types';
import {
  STORAGE_KEY,
  defaultSettings,
  parseSettings,
  serializeSettings,
  type Settings,
} from './settingsSchema';

interface SettingsActions {
  setTheme: (theme: ThemeId) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setShowLabels: (showLabels: boolean) => void;
  setAnimate: (animate: boolean) => void;
  setQuality: (quality: Quality) => void;
  resetToDefaults: () => void;
}

export type SettingsState = Settings & SettingsActions;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function readStored(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // privát ablak, letiltott site data
  }
}

function writeStored(settings: Settings): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeSettings(settings));
  } catch {
    /* kvótatúllépés vagy letiltott tárolás — a perzisztencia néma marad */
  }
}

function clearStored(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* néma */
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  function update(patch: Partial<Settings>): void {
    set(patch);
    const { theme, volume, muted, showLabels, animate, quality } = get();
    writeStored({ theme, volume, muted, showLabels, animate, quality });
  }

  return {
    ...parseSettings(readStored(), defaultSettings(prefersReducedMotion())),

    setTheme: (theme) => update({ theme }),
    setVolume: (volume) => update({ volume }),
    setMuted: (muted) => update({ muted }),
    setShowLabels: (showLabels) => update({ showLabels }),
    setAnimate: (animate) => update({ animate }),
    setQuality: (quality) => update({ quality }),

    resetToDefaults: () => {
      clearStored();
      set(defaultSettings(prefersReducedMotion()));
    },
  };
});
