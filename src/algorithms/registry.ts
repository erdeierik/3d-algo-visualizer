import type { AlgorithmDefinition } from './types';
import { bubbleSort } from './sorting/bubbleSort';
import { selectionSort } from './sorting/selectionSort';
import { insertionSort } from './sorting/insertionSort';
import {
  bubbleSortPseudocode,
  selectionSortPseudocode,
  insertionSortPseudocode,
} from './sorting/pseudocode';
import { bstInsert, bstSearch, bstDelete, bstTraverse } from './tree/bst';
import {
  bstInsertPseudocode,
  bstSearchPseudocode,
  bstDeletePseudocode,
  bstTraversalPseudocode,
} from './tree/pseudocode';

interface TreeSearchInput {
  insertionOrder: number[];
  target: number;
}

export const algorithmRegistry: AlgorithmDefinition[] = [
  {
    id: 'bubble-sort',
    displayName: 'Bubble Sort',
    category: 'sorting',
    requiresTarget: false,
    pseudocode: bubbleSortPseudocode,
    statLabels: { comparisons: 'Comparisons', operations: 'Swaps' },
    complexity: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    run: (input) => bubbleSort(input as number[]),
  },
  {
    id: 'selection-sort',
    displayName: 'Selection Sort',
    category: 'sorting',
    requiresTarget: false,
    pseudocode: selectionSortPseudocode,
    statLabels: { comparisons: 'Comparisons', operations: 'Swaps' },
    complexity: {
      time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    run: (input) => selectionSort(input as number[]),
  },
  {
    id: 'insertion-sort',
    displayName: 'Insertion Sort',
    category: 'sorting',
    requiresTarget: false,
    pseudocode: insertionSortPseudocode,
    statLabels: { comparisons: 'Comparisons', operations: 'Shifts' },
    complexity: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    run: (input) => insertionSort(input as number[]),
  },
  {
    id: 'bst-insert',
    displayName: 'BST Insert',
    category: 'tree',
    requiresTarget: false,
    pseudocode: bstInsertPseudocode,
    statLabels: { comparisons: 'Comparisons', operations: 'Insertions' },
    complexity: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(n)',
    },
    run: (input) => bstInsert(input as number[]),
  },
  {
    id: 'bst-search',
    displayName: 'BST Search',
    category: 'tree',
    requiresTarget: true,
    pseudocode: bstSearchPseudocode,
    statLabels: { comparisons: 'Comparisons' },
    complexity: {
      time: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(1)',
    },
    run: (input) => {
      const { insertionOrder, target } = input as TreeSearchInput;
      return bstSearch(insertionOrder, target);
    },
  },
  {
    id: 'bst-delete',
    displayName: 'BST Delete',
    category: 'tree',
    requiresTarget: true,
    pseudocode: bstDeletePseudocode,
    statLabels: { comparisons: 'Comparisons', operations: 'Pointer updates' },
    complexity: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(1)',
    },
    run: (input) => {
      const { insertionOrder, target } = input as TreeSearchInput;
      return bstDelete(insertionOrder, target);
    },
  },
  {
    id: 'bst-traversal-inorder',
    displayName: 'BST Traversal (Inorder)',
    category: 'tree',
    requiresTarget: false,
    pseudocode: bstTraversalPseudocode.inorder,
    statLabels: { comparisons: 'Comparisons', operations: 'Nodes visited' },
    complexity: {
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(n)',
    },
    run: (input) => bstTraverse(input as number[], 'inorder'),
  },
  {
    id: 'bst-traversal-preorder',
    displayName: 'BST Traversal (Preorder)',
    category: 'tree',
    requiresTarget: false,
    pseudocode: bstTraversalPseudocode.preorder,
    statLabels: { comparisons: 'Comparisons', operations: 'Nodes visited' },
    complexity: {
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(n)',
    },
    run: (input) => bstTraverse(input as number[], 'preorder'),
  },
  {
    id: 'bst-traversal-postorder',
    displayName: 'BST Traversal (Postorder)',
    category: 'tree',
    requiresTarget: false,
    pseudocode: bstTraversalPseudocode.postorder,
    statLabels: { comparisons: 'Comparisons', operations: 'Nodes visited' },
    complexity: {
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(n)',
    },
    run: (input) => bstTraverse(input as number[], 'postorder'),
  },
];
