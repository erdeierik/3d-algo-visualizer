import { usePlayerStore } from '../../store/playerStore';
import { useCurrentDefinition } from '../../store/sessionStore';

export function StatsPanel() {
  const step = usePlayerStore((s) => s.steps[s.currentStepIndex]);
  const def = useCurrentDefinition();
  if (!step) return null;

  return (
    <dl>
      <dt>{def.statLabels.comparisons}</dt>
      <dd>{step.stats.comparisons}</dd>
      <dt>{def.statLabels.operations}</dt>
      <dd>{step.stats.operations}</dd>
    </dl>
  );
}
