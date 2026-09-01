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
    statLabels: { comparisons: 'Összehasonlítások', operations: 'Cserék' },
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
    statLabels: { comparisons: 'Összehasonlítások', operations: 'Cserék' },
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
    statLabels: { comparisons: 'Összehasonlítások', operations: 'Eltolások' },
    complexity: {
      time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    run: (input) => insertionSort(input as number[]),
  },
  {
    id: 'bst-insert',
    displayName: 'BST beszúrás (Insert)',
    category: 'tree',
    requiresTarget: false,
    pseudocode: bstInsertPseudocode,
    statLabels: { comparisons: 'Összehasonlítások', operations: 'Beszúrások' },
    complexity: {
      time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      space: 'O(n)',
    },
    run: (input) => bstInsert(input as number[]),
  },
  {
    id: 'bst-search',
    displayName: 'BST keresés (Search)',
    category: 'tree',
    requiresTarget: true,
    pseudocode: bstSearchPseudocode,
    statLabels: { comparisons: 'Összehasonlítások', operations: 'Módosítások' },
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
    displayName: 'BST törlés (Delete)',
    category: 'tree',
    requiresTarget: true,
    pseudocode: bstDeletePseudocode,
    statLabels: { comparisons: 'Összehasonlítások', operations: 'Pointer-módosítások' },
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
    displayName: 'BST bejárás (Inorder)',
    category: 'tree',
    requiresTarget: false,
    pseudocode: bstTraversalPseudocode.inorder,
    statLabels: { comparisons: 'Összehasonlítások', operations: 'Meglátogatott csomópontok' },
    complexity: {
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(n)',
    },
    run: (input) => bstTraverse(input as number[], 'inorder'),
  },
  {
    id: 'bst-traversal-preorder',
    displayName: 'BST bejárás (Preorder)',
    category: 'tree',
    requiresTarget: false,
    pseudocode: bstTraversalPseudocode.preorder,
    statLabels: { comparisons: 'Összehasonlítások', operations: 'Meglátogatott csomópontok' },
    complexity: {
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(n)',
    },
    run: (input) => bstTraverse(input as number[], 'preorder'),
  },
  {
    id: 'bst-traversal-postorder',
    displayName: 'BST bejárás (Postorder)',
    category: 'tree',
    requiresTarget: false,
    pseudocode: bstTraversalPseudocode.postorder,
    statLabels: { comparisons: 'Összehasonlítások', operations: 'Meglátogatott csomópontok' },
    complexity: {
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(n)',
    },
    run: (input) => bstTraverse(input as number[], 'postorder'),
  },
];
