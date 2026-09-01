import { useSessionStore, useCurrentDefinition, SIZE_RANGE } from '../../store/sessionStore';

export function DataControls() {
  const dataSize = useSessionStore((s) => s.dataSize);
  const [min, max] = SIZE_RANGE[useCurrentDefinition().category];

  return (
    <div>
      <label>
        Size: {dataSize}
        <input
          type="range"
          min={min}
          max={max}
          value={dataSize}
          onChange={(e) => useSessionStore.getState().setDataSize(Number(e.target.value))}
        />
      </label>
      <button type="button" onClick={() => useSessionStore.getState().generateData()}>
        Generate new data
      </button>
    </div>
  );
}
