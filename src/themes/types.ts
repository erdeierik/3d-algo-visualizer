export const THEME_IDS = ['simple', 'cosmos', 'living-tree'] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export type Quality = 'low' | 'high';
