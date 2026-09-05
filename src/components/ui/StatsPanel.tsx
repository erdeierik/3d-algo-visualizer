import { usePlayerStore } from '../../store/playerStore';
import { useCurrentDefinition } from '../../store/sessionStore';
import styles from './StatsPanel.module.css';

export function StatsPanel() {
  const step = usePlayerStore((s) => s.steps[s.currentStepIndex]);
  const def = useCurrentDefinition();
  if (!step) return null;

  return (
    <dl className={styles.stats}>
      <div className={styles.stat}>
        <dt>{def.statLabels.comparisons}</dt>
        <dd>{step.stats.comparisons}</dd>
      </div>
      {def.statLabels.operations && (
        <div className={styles.stat}>
          <dt>{def.statLabels.operations}</dt>
          <dd>{step.stats.operations}</dd>
        </div>
      )}
      {(step.kind === 'found' || step.kind === 'not-found') && (
        <div className={styles.stat}>
          <dt>Result</dt>
          <dd>{step.kind === 'found' ? 'Found' : 'Not found'}</dd>
        </div>
      )}
    </dl>
  );
}
