import { usePlayerStore } from '../../store/playerStore';
import { useCurrentDefinition } from '../../store/sessionStore';

export function PseudocodePanel() {
  const step = usePlayerStore((s) => s.steps[s.currentStepIndex]);
  const def = useCurrentDefinition();

  return (
    <ol>
      {def.pseudocode.map((line, index) => (
        <li key={index} style={{ fontWeight: step?.pseudocodeLine === index ? 'bold' : 'normal' }}>
          {line}
        </li>
      ))}
    </ol>
  );
}
