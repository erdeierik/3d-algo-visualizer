import { CosmosBar } from './Bar';
import { CosmosEdge } from './Edge';
import { CosmosEnvironment } from './Environment';
import { CosmosNode } from './Node';
import { BACKGROUND, COSMOS_PALETTE, HUD, LABEL_COLOR } from './palette';
import type { SceneTheme } from '../types';

export const cosmosTheme: SceneTheme = {
  id: 'cosmos',
  displayName: 'Cosmos',
  blurb: 'Deep space, where the highlighted elements glow.',

  background: BACKGROUND,
  labelColor: LABEL_COLOR,
  palette: COSMOS_PALETTE,
  hud: HUD,

  // se talaj, se horizont: nincs mihez képest megemelni a fát
  contentOffsetY: () => 0,

  Environment: CosmosEnvironment,
  Bar: CosmosBar,
  Node: CosmosNode,
  Edge: CosmosEdge,
};
