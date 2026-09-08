import { useSettingsStore } from '../../store/settingsStore';
import type { Quality } from '../../themes/types';
import styles from './SettingsTab.module.css';

const QUALITIES: { id: Quality; label: string }[] = [
  { id: 'low', label: 'Low' },
  { id: 'high', label: 'High' },
];

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className={styles.row}>
      <span>{label}</span>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export function SettingsTab() {
  const volume = useSettingsStore((s) => s.volume);
  const muted = useSettingsStore((s) => s.muted);
  const showLabels = useSettingsStore((s) => s.showLabels);
  const animate = useSettingsStore((s) => s.animate);
  const quality = useSettingsStore((s) => s.quality);

  const percent = Math.round(volume * 100);

  return (
    <div>
      <label className={styles.row}>
        <span>Volume</span>
        <input
          className={styles.slider}
          type="range"
          min={0}
          max={100}
          value={percent}
          onChange={(e) => useSettingsStore.getState().setVolume(Number(e.target.value) / 100)}
        />
        <span className={styles.value}>{percent}</span>
      </label>

      <Toggle label="Mute" checked={muted} onChange={(v) => useSettingsStore.getState().setMuted(v)} />
      <Toggle
        label="Value labels"
        checked={showLabels}
        onChange={(v) => useSettingsStore.getState().setShowLabels(v)}
      />
      <Toggle
        label="Animation"
        checked={animate}
        onChange={(v) => useSettingsStore.getState().setAnimate(v)}
      />

      <div className={styles.row}>
        <span>Quality</span>
        <div className={styles.buttonPair}>
          {QUALITIES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={id === quality ? styles.qualityActive : styles.quality}
              onClick={() => useSettingsStore.getState().setQuality(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.note}>Settings are stored in your browser only.</p>
      <button
        type="button"
        className={styles.reset}
        onClick={() => useSettingsStore.getState().resetToDefaults()}
      >
        Reset to defaults
      </button>
    </div>
  );
}
