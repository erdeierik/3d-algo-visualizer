export interface StepStats {
  comparisons: number;
  operations: number;
}

export interface BaseStep {
  stepIndex: number;
  pseudocodeLine: number;
  stats: StepStats;
}

export interface SortStep extends BaseStep {
  array: number[];
  activeIndices: number[];
  kind: 'compare' | 'swap' | 'set' | 'sorted-marker' | 'done';
}

export interface TreeNodeSnapshot {
  id: string;
  value: number;
  leftId: string | null;
  rightId: string | null;
}

export interface TreeStep extends BaseStep {
  nodes: Record<string, TreeNodeSnapshot>;
  rootId: string | null;
  activeNodeIds: string[];
  kind:
    | 'compare'
    | 'visit'
    | 'insert'
    | 'delete'
    | 'rebalance-pointer'
    | 'found'
    | 'not-found'
    | 'done';
}

export type Step = SortStep | TreeStep;

export interface ComplexityInfo {
  time: { best: string; average: string; worst: string };
  space: string;
}

export interface AlgorithmDefinition {
  id: string;
  displayName: string;
  pseudocode: string[];
  statLabels: { comparisons: string; operations: string };
  complexity: ComplexityInfo;
  run: (input: unknown) => Step[];
}
