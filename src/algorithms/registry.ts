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
    description: {
      howItWorks:
        'Repeatedly walks the array, comparing each adjacent pair and swapping them when they are out of order. After each pass the largest remaining value has bubbled to its final position.',
      whenToUse:
        'Only on small or nearly sorted arrays, where the early exit makes it competitive and its simplicity is worth more than its speed.',
      watchOut:
        'O(n²) comparisons in the average and worst case; on large inputs it is dramatically slower than the divide-and-conquer sorts.',
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
        'Scans the unsorted remainder of the array for the smallest value and swaps it into the current position. The sorted prefix on the left grows by exactly one element per pass.',
      whenToUse:
        'When writing is expensive: it performs at most n−1 swaps, far fewer than bubble or insertion sort move data.',
      watchOut:
        'It has no early exit, so an already sorted array costs exactly as much as a random one — O(n²) comparisons in every case.',
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
        'On small or nearly sorted arrays, and as the base case inside larger divide-and-conquer sorts — on almost sorted input it approaches O(n).',
      watchOut:
        'The shifts dominate the cost, not the comparisons: on reversed input every element has to travel across the whole prefix.',
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
        'Starts at the root and compares the new value with each node, descending left when it is smaller and right when it is larger, until it reaches an empty slot — and links the new node there.',
      whenToUse:
        'When a collection has to stay ordered while items keep arriving, and search, insert and delete should share the same root-to-leaf path.',
      watchOut:
        'Insertion order decides the shape. Sorted input degenerates the tree into a linked list where every operation costs O(n); self-balancing variants (AVL, red-black) exist to prevent exactly this.',
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
        'Whenever the data already lives in a search tree — it needs no separate index and, unlike binary search over an array, it stays fast while the collection is modified.',
      watchOut:
        'The cost is the height of the tree, not its size. On a degenerate tree the walk touches every node, and a failed search is never cheaper than a successful one.',
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
        'Finds the node, then handles three cases: a leaf is simply unlinked, a node with one child is replaced by that child, and a node with two children is overwritten by its in-order successor, which is then removed from its old place.',
      whenToUse:
        'When elements have to leave an ordered collection without rebuilding it — the tree is still a valid BST after every removal.',
      watchOut:
        'The two-child case is what breaks naive implementations. Always taking the successor also skews the tree slowly over many deletions.',
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
    description: {
      howItWorks:
        'Recursively visits the left subtree, then the node itself, then the right subtree. In a binary search tree this yields the values in ascending order.',
      whenToUse:
        'When the elements are needed in sorted order: printing a sorted listing, verifying the BST invariant, or finding the k-th smallest value.',
      watchOut:
        'The sorted output is a consequence of the BST property — on a general binary tree in-order carries no such meaning. Recursion depth equals the tree height.',
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
    description: {
      howItWorks:
        'Visits the node first, then its left and right subtree, so every node is reported before any of its descendants.',
      whenToUse:
        'When the structure itself matters: copying or serialising a tree, because re-inserting the values in pre-order rebuilds exactly the same shape.',
      watchOut:
        'The output is not sorted, and it is easy to confuse with in-order — the only difference is where the visit sits relative to the two recursive calls.',
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
    description: {
      howItWorks:
        'Visits both subtrees first and the node last, so a node is only reported once all of its descendants have been.',
      whenToUse:
        'When a node depends on its children: freeing or deleting a whole tree, computing subtree heights or sums, evaluating an expression tree.',
      watchOut:
        'The root comes last, so nothing is reported until the deepest leaf has been reached — and, like pre-order, the output is not sorted.',
    },
    run: (input) => bstTraverse(input as number[], 'postorder'),
  },
];
