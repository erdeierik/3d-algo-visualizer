import { SimpleBar } from './Bar';
import { SimpleEdge } from './Edge';
import { SimpleEnvironment } from './Environment';
import { SimpleNode } from './Node';
import { BACKGROUND, HUD, LABEL_COLOR, SIMPLE_PALETTE } from './palette';
import type { SceneTheme } from '../types';

export const simpleTheme: SceneTheme = {
  id: 'simple',
  displayName: 'Simple',
  blurb: 'A plain dark studio with nothing in it but the data.',

  background: BACKGROUND,
  labelColor: LABEL_COLOR,
  palette: SIMPLE_PALETTE,
  hud: HUD,

  contentOffsetY: () => 0,

  Environment: SimpleEnvironment,
  Bar: SimpleBar,
  Node: SimpleNode,
  Edge: SimpleEdge,
};
