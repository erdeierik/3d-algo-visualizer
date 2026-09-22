import { useSettingsStore } from '../../store/settingsStore';
import { themeRegistry, useTheme } from '../../themes/registry';
import type { VisualState } from '../../themes/types';
import styles from './ThemeTab.module.css';

/** A négy leggyakoribb állapot — a gomb így meg is mutatja, mit választ a felhasználó. */
const SWATCH_STATES: VisualState[] = ['idle', 'compare', 'swap', 'sorted'];

export function ThemeTab() {
  // nem a settingsStore.theme-et olvassuk: a registry fallbackje ennél erősebb, és a
  // kijelölésnek azt kell mutatnia, ami ténylegesen renderelődik
  const activeId = useTheme().id;

  return (
    <div className={styles.list}>
      {themeRegistry.map((theme) => (
        <button
          key={theme.id}
          type="button"
          className={theme.id === activeId ? styles.optionActive : styles.option}
          aria-pressed={theme.id === activeId}
          onClick={() => useSettingsStore.getState().setTheme(theme.id)}
        >
          <span
            className={styles.swatches}
            style={{ background: theme.background }}
            aria-hidden="true"
          >
            {SWATCH_STATES.map((state) => (
              <span
                key={state}
                className={styles.swatch}
                style={{ background: theme.palette[state] }}
              />
            ))}
          </span>
          <span className={styles.name}>{theme.displayName}</span>
          <span className={styles.blurb}>{theme.blurb}</span>
        </button>
      ))}
    </div>
  );
}
