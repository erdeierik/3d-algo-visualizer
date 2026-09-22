import { useSettingsStore } from '../store/settingsStore';
import { simpleTheme } from './simple';
import type { SceneTheme, ThemeId } from './types';

export const themeRegistry: SceneTheme[] = [simpleTheme];

export function getTheme(id: ThemeId): SceneTheme {
  return themeRegistry.find((theme) => theme.id === id) ?? themeRegistry[0];
}

export function useTheme(): SceneTheme {
  return getTheme(useSettingsStore((s) => s.theme));
}
