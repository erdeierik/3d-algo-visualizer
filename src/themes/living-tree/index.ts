// src/themes/living-tree/index.ts
import { LivingTreeBar } from './Bar';
import { LivingTreeEdge } from './Edge';
import { LivingTreeEnvironment } from './Environment';
import { LivingTreeNode } from './Node';
import { HORIZON, HUD, LABEL_COLOR, LIVING_TREE_PALETTE, livingTreeOffsetY } from './palette';
import type { SceneTheme } from '../types';

export const livingTreeTheme: SceneTheme = {
  id: 'living-tree',
  displayName: 'Living Tree',
  blurb: 'A sunlit meadow where each state is a stage of ripeness.',

  background: HORIZON,
  labelColor: LABEL_COLOR,
  palette: LIVING_TREE_PALETTE,
  hud: HUD,

  contentOffsetY: livingTreeOffsetY,

  Environment: LivingTreeEnvironment,
  Bar: LivingTreeBar,
  Node: LivingTreeNode,
  Edge: LivingTreeEdge,
};
