import { algorithmRegistry } from '../../algorithms/registry';
import { useSessionStore } from '../../store/sessionStore';

const SORTING = algorithmRegistry.filter((a) => a.category === 'sorting');
const TREE = algorithmRegistry.filter((a) => a.category === 'tree');

export function AlgorithmSelector() {
  const selectedId = useSessionStore((s) => s.selectedId);

  return (
    <select value={selectedId} onChange={(e) => useSessionStore.getState().selectAlgorithm(e.target.value)}>
      <optgroup label="Sorting">
        {SORTING.map((a) => (
          <option key={a.id} value={a.id}>
            {a.displayName}
          </option>
        ))}
      </optgroup>
      <optgroup label="Tree (BST)">
        {TREE.map((a) => (
          <option key={a.id} value={a.id}>
            {a.displayName}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
