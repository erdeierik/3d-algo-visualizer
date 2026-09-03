import { usePlayerStore } from '../../store/playerStore';
import { useCurrentDefinition } from '../../store/sessionStore';
import styles from './PseudocodePanel.module.css';

export function PseudocodePanel() {
  const step = usePlayerStore((s) => s.steps[s.currentStepIndex]);
  const def = useCurrentDefinition();

  return (
    <div>
      <p className={styles.heading}>Pseudocode</p>
      <ol className={styles.code}>
        {def.pseudocode.map((line, index) => (
          <li key={index} className={step?.pseudocodeLine === index ? styles.active : undefined}>
            {line}
          </li>
        ))}
      </ol>
    </div>
  );
}
