import type { FC, RefObject } from 'react';
import type { MeshStandardMaterial, Vector3 } from 'three';

export const THEME_IDS = ['simple', 'cosmos', 'living-tree'] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export type Quality = 'low' | 'high';

export const VISUAL_STATES = ['idle', 'compare', 'swap', 'sorted', 'insert', 'found'] as const;

export type VisualState = (typeof VISUAL_STATES)[number];

export type Detail = 'rich' | 'plain';

export interface Vec2 {
  x: number;
  y: number;
}

/** A tartalom analitikusan számolt kerete — a contentOffsetY alkalmazása ELŐTTI koordinátákban. */
export interface ContentBounds {
  min: Vector3;
  max: Vector3;
  radius: number; // a vízszintes kiterjedés fele — ebből méretezi a dekor magát
  count: number; // elem- ill. csomópontszám — ebből jön a LOD
}

export interface EnvironmentProps {
  quality: Quality;
  bounds: ContentBounds;
  /** Sorting vagy fa jelenetet díszít-e — a kontaktárnyék elrendezése ettől függ. */
  category: 'sorting' | 'tree';
}

export interface BarPartProps {
  /** A közös SortBar által képkockánként frissített PILLANATNYI magasság. */
  heightRef: RefObject<number>;
  materialRef: RefObject<MeshStandardMaterial | null>;
  detail: Detail;
}

export interface NodePartProps {
  materialRef: RefObject<MeshStandardMaterial | null>;
  detail: Detail;
}

export interface EdgeProps {
  from: Vec2;
  to: Vec2;
}

/** A HTML-HUD olvashatósági segítsége az adott jelenet előtt. */
export interface HudStyle {
  /** Él-sötétítés a bal-felső zóna mögött (ott jellemzően ég van) — 'transparent' = nincs. */
  shadeTop: string;
  /** Él-sötétítés az alsó sáv mögött (ott jellemzően talaj van) — 'transparent' = nincs. */
  shadeBottom: string;
  /** text-shadow a keret nélküli HUD-szövegeken — 'none' = nincs. */
  halo: string;
}

export interface SceneTheme {
  id: ThemeId;
  displayName: string;
  blurb: string; // egysoros magyarázat a Theme fülön

  background: string;
  labelColor: string; // az érték-címkék színe ezen a háttéren
  palette: Record<VisualState, string>;
  hud: HudStyle;

  /** A tartalom Y-eltolása. Talajos témában a fa mélységéből számol; a simple 0-t ad. */
  contentOffsetY: (bounds: ContentBounds) => number;

  Environment: FC<EnvironmentProps>;
  Bar: FC<BarPartProps>;
  Node: FC<NodePartProps>;
  Edge: FC<EdgeProps>;
}
