export const bstInsertPseudocode = [
  'if tree is empty: root = new node', // 0
  'else: current = root', // 1
  '  while true:', // 2
  '    if value < current.value:', // 3
  '      if current.left is null: insert', // 4
  '      else: go left', // 5
  '    else:', // 6
  '      if current.right is null: insert', // 7
  '      else: go right', // 8
  'done', // 9
];

export const bstSearchPseudocode = [
  'current = root', // 0
  'while current is not null:', // 1
  '  if target == current.value: return found', // 2
  '  else if target < current.value: go left', // 3
  '  else: go right', // 4
  'return not found', // 5
];

export const bstDeletePseudocode = [
  'current = root, parent = null', // 0
  'while current is not null and current.value != target:', // 1
  '  parent = current', // 2
  '  if target < current.value: go left', // 3
  '  else: go right', // 4
  'if current is null: return not found', // 5
  'if current has two children:', // 6
  '  successor = min of right subtree', // 7
  '  copy successor.value into current', // 8
  '  remove successor from its parent', // 9
  'else:', // 10
  '  child = the existing subtree', // 11
  '  replace current with child', // 12
  'done', // 13
];

export const bstTraversalPseudocode: Record<'inorder' | 'preorder' | 'postorder', string[]> = {
  inorder: [
    'traverse(node):', // 0
    '  if node is null: return', // 1
    '  traverse(node.left)', // 2
    '  visit(node)', // 3
    '  traverse(node.right)', // 4
    'done', // 5
  ],
  preorder: [
    'traverse(node):', // 0
    '  if node is null: return', // 1
    '  visit(node)', // 2
    '  traverse(node.left)', // 3
    '  traverse(node.right)', // 4
    'done', // 5
  ],
  postorder: [
    'traverse(node):', // 0
    '  if node is null: return', // 1
    '  traverse(node.left)', // 2
    '  traverse(node.right)', // 3
    '  visit(node)', // 4
    'done', // 5
  ],
};
