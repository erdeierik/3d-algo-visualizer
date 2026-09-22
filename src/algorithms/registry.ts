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
      time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
      space: 'O(1)',
    },
    description: {
      howItWorks:
        'Repeatedly walks the array, comparing each adjacent pair and swapping them when they are out of order. After each pass the largest remaining value has bubbled to its final position.',
      whenToUse:
        'Mainly for teaching and for very small arrays. The code is short, and each step only touches two neighboring values.',
      watchOut:
        'This version has no early exit, so it runs every pass even on sorted input: O(n²) comparisons in every case. On large inputs it is far slower than O(n log n) divide-and-conquer sorts.',
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
    description: {
      howItWorks:
        'Scans the unsorted remainder of the array for the smallest value and swaps it into the current position. The sorted prefix on the left grows by one element per pass.',
      whenToUse:
        'When writes are expensive. It does at most n−1 swaps, while bubble and insertion sort can move data O(n²) times.',
      watchOut:
        'It never checks whether the array is already sorted, so it always scans the whole unsorted part. A sorted input costs as many comparisons as a random one, O(n²) in every case.',
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
    description: {
      howItWorks:
        'Takes the next element and shifts every larger value of the sorted prefix one place to the right, then writes the element into the gap. Everything left of the cursor is always sorted.',
      whenToUse:
        'On small or nearly sorted arrays, where it runs in close to O(n) time. Divide-and-conquer sorts also use it as the base case for small subarrays.',
      watchOut:
        'Every comparison that finds a larger value is followed by a shift, so the work grows with how far each element has to move. On reversed input every element travels across the whole sorted prefix.',
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
    description: {
      howItWorks:
        'Starts at the root and compares the new value with each node on the way down, going left when it is smaller and right otherwise. When it reaches an empty slot, it links the new node there.',
      whenToUse:
        'When a collection has to stay ordered while new items keep arriving. Search, insert and delete all walk a single root-to-leaf path, so each costs O(height).',
      watchOut:
        'The insertion order decides the shape of the tree. Sorted input turns it into a linked list, and every operation then costs O(n). Self-balancing trees such as AVL and red-black trees avoid this.',
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
    description: {
      howItWorks:
        'Compares the target with the current node and follows one branch: left when the target is smaller, right when it is larger. Every comparison discards an entire subtree.',
      whenToUse:
        'When the data is already stored in a search tree. It needs no separate index, and unlike binary search over a sorted array, it stays fast while items are inserted and deleted.',
      watchOut:
        'The number of comparisons is at most the height of the tree. A balanced tree with n nodes is about log n tall, a degenerate one is n tall, and then a search may touch every node.',
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
    description: {
      howItWorks:
        'Finds the node, then handles three cases. A leaf is unlinked. A node with one child is replaced by that child. A node with two children takes the value of its in-order successor, and the successor is removed from its old place.',
      whenToUse:
        'When items have to be removed from an ordered collection without rebuilding it. The tree remains a valid BST after every deletion.',
      watchOut:
        'The two-child case is the easiest one to get wrong. Always using the successor also makes the tree lean to one side over many deletions.',
    },
    run: (input) => {
      const { insertionOrder, target } = input as TreeSearchInput;
      return bstDelete(insertionOrder, target);
    },
  },
  {
    id: 'bst-traversal-inorder',
    displayName: 'BST Traversal (In-order)',
    category: 'tree',
    requiresTarget: false,
    pseudocode: bstTraversalPseudocode.inorder,
    statLabels: { comparisons: 'Comparisons', operations: 'Nodes visited' },
    complexity: {
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(n)',
    },
    description: {
      howItWorks:
        'Recursively visits the left subtree, then the node itself, then the right subtree. In a binary search tree this yields the values in ascending order.',
      whenToUse:
        'When the elements are needed in sorted order: printing a sorted listing, verifying the BST invariant, or finding the k-th smallest value.',
      watchOut:
        'The output is sorted only because of the BST property. On an ordinary binary tree, in-order gives no particular order. The recursion goes as deep as the tree is tall.',
    },
    run: (input) => bstTraverse(input as number[], 'inorder'),
  },
  {
    id: 'bst-traversal-preorder',
    displayName: 'BST Traversal (Pre-order)',
    category: 'tree',
    requiresTarget: false,
    pseudocode: bstTraversalPseudocode.preorder,
    statLabels: { comparisons: 'Comparisons', operations: 'Nodes visited' },
    complexity: {
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(n)',
    },
    description: {
      howItWorks:
        'Visits the node first, then its left and right subtree, so every node is reported before any of its descendants.',
      whenToUse:
        'When the shape of the tree matters, for example when copying or serializing it. Inserting the values into an empty BST in pre-order rebuilds the same tree.',
      watchOut:
        'The output is not sorted. It is easy to mix up with in-order, since the two differ only in where the visit comes relative to the two recursive calls.',
    },
    run: (input) => bstTraverse(input as number[], 'preorder'),
  },
  {
    id: 'bst-traversal-postorder',
    displayName: 'BST Traversal (Post-order)',
    category: 'tree',
    requiresTarget: false,
    pseudocode: bstTraversalPseudocode.postorder,
    statLabels: { comparisons: 'Comparisons', operations: 'Nodes visited' },
    complexity: {
      time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      space: 'O(n)',
    },
    description: {
      howItWorks:
        'Visits both subtrees first and the node last, so a node is only reported once all of its descendants have been.',
      whenToUse:
        'When a node depends on its children: freeing or deleting a whole tree, computing subtree heights or sums, evaluating an expression tree.',
      watchOut:
        'The root is always reported last, and the first node reported is always a leaf. Like pre-order, the output is not sorted.',
    },
    run: (input) => bstTraverse(input as number[], 'postorder'),
  },
];
