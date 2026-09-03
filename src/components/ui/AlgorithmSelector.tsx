import { useEffect, useRef, useState } from 'react';
import { algorithmRegistry } from '../../algorithms/registry';
import { useSessionStore } from '../../store/sessionStore';
import styles from './AlgorithmSelector.module.css';

const GROUPS = [
  { label: 'Sorting', items: algorithmRegistry.filter((a) => a.category === 'sorting') },
  { label: 'Tree (BST)', items: algorithmRegistry.filter((a) => a.category === 'tree') },
];

export function AlgorithmSelector() {
  const selectedId = useSessionStore((s) => s.selectedId);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = algorithmRegistry.find((a) => a.id === selectedId) ?? algorithmRegistry[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function choose(id: string) {
    useSessionStore.getState().selectAlgorithm(id);
    setOpen(false);
  }

  return (
    <div className={styles.wrapper} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {current.displayName}
        <span className={styles.chevron} aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className={styles.listbox} role="menu">
          {GROUPS.map((group) => (
            <div key={group.label} role="group" aria-label={group.label}>
              <p className={styles.groupLabel}>{group.label}</p>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  className={item.id === selectedId ? styles.optionActive : styles.option}
                  onClick={() => choose(item.id)}
                >
                  {item.displayName}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
