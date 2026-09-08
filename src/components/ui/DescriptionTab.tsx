import { useCurrentDefinition } from '../../store/sessionStore';
import type { AlgorithmDescription } from '../../algorithms/types';
import styles from './TabPanel.module.css';

const BLOCKS: { key: keyof AlgorithmDescription; label: string }[] = [
  { key: 'howItWorks', label: 'How it works' },
  { key: 'whenToUse', label: 'When to use it' },
  { key: 'watchOut', label: 'Watch out' },
];

export function DescriptionTab() {
  const { description } = useCurrentDefinition();

  return (
    <div className={styles.scroll}>
      {BLOCKS.map(({ key, label }) => (
        <section key={key} className={styles.block}>
          <p className={styles.blockLabel}>{label}</p>
          <p className={styles.prose}>{description[key]}</p>
        </section>
      ))}
    </div>
  );
}
