import { useSessionStore, useCurrentDefinition, SIZE_RANGE } from '../../store/sessionStore';
import styles from './DataControls.module.css';

export function DataControls() {
  const dataSize = useSessionStore((s) => s.dataSize);
  const target = useSessionStore((s) => s.target);
  const [min, max] = SIZE_RANGE[useCurrentDefinition().category];

  return (
    <div>
      <div className={styles.label}>
        <span>Size</span>
        <span>{dataSize}</span>
      </div>
      <input
        className={styles.slider}
        type="range"
        min={min}
        max={max}
        value={dataSize}
        onChange={(e) => useSessionStore.getState().setDataSize(Number(e.target.value))}
        onPointerUp={() => useSessionStore.getState().generateData()}
        onKeyUp={() => useSessionStore.getState().generateData()}
      />
      {target !== null && (
        <div className={styles.targetRow}>
          <span>Target</span>
          <span>{target}</span>
        </div>
      )}
      <button type="button" className={styles.generate} onClick={() => useSessionStore.getState().generateData()}>
        Generate new data
      </button>
    </div>
  );
}
