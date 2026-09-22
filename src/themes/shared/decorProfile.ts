import { useMemo } from 'react';
import type { ContentBounds, Quality } from '../types';

export const RADIUS_STEP = 4;

/**
 * A dekor csak NAGYSÁGRENDRE érzékeny, a nyers radius viszont minden fa-újragenerálásra más.
 * A felfelé kerekítés stabil kulcsot ad: azonos elemszám mellett a dekor nem épül újra.
 */
export function quantizeRadius(radius: number): number {
  return Math.max(RADIUS_STEP, Math.ceil(radius / RADIUS_STEP) * RADIUS_STEP);
}

export interface DecorProfile {
  radius: number;
  count: number;
  quality: Quality;
}

/** A dekor-építő useMemo-k EZT kapják dependency-nek, nem a bounds objektumot. */
export function useDecorProfile(bounds: ContentBounds, quality: Quality): DecorProfile {
  const radius = quantizeRadius(bounds.radius);
  return useMemo(() => ({ radius, count: bounds.count, quality }), [radius, bounds.count, quality]);
}
