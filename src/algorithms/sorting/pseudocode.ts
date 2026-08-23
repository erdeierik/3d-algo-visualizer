export const bubbleSortPseudocode = [
  'for i from 0 to n - 2', // 0
  '  for j from 0 to n - 2 - i', // 1
  '    if array[j] > array[j+1]', // 2
  '      swap(array[j], array[j+1])', // 3
  '  mark array[n-1-i] as sorted', // 4
  'done', // 5
];

export const selectionSortPseudocode = [
  'for i from 0 to n - 2', // 0
  '  minIndex = i', // 1
  '  for j from i+1 to n-1', // 2
  '    if array[j] < array[minIndex]', // 3
  '      minIndex = j', // 4
  '  if minIndex != i: swap(array[i], array[minIndex])', // 5
  '  mark array[i] as sorted', // 6
  'done', // 7
];

export const insertionSortPseudocode = [
  'for i from 1 to n - 1', // 0
  '  key = array[i]', // 1
  '  j = i - 1', // 2
  '  while j >= 0 and array[j] > key', // 3
  '    array[j+1] = array[j]', // 4
  '    j = j - 1', // 5
  '  array[j+1] = key', // 6
  'done', // 7
];
