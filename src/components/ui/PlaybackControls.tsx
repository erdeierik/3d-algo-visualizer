import { usePlayerStore } from '../../store/playerStore';

export function PlaybackControls() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentStepIndex = usePlayerStore((s) => s.currentStepIndex);
  const stepsLength = usePlayerStore((s) => s.steps.length);
  const speed = usePlayerStore((s) => s.speed);

  const atStart = currentStepIndex <= 0;
  const atEnd = stepsLength === 0 || currentStepIndex >= stepsLength - 1;

  return (
    <div>
      <button type="button" onClick={() => usePlayerStore.getState().stepBack()} disabled={atStart}>
        ⏮
      </button>
      <button
        type="button"
        onClick={() => (isPlaying ? usePlayerStore.getState().pause() : usePlayerStore.getState().play())}
        disabled={atEnd && !isPlaying}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button type="button" onClick={() => usePlayerStore.getState().stepForward()} disabled={atEnd}>
        ⏭
      </button>
      <button type="button" onClick={() => usePlayerStore.getState().reset()}>
        Reset
      </button>
      <label>
        Speed: {speed}/s
        <input
          type="range"
          min={0.5}
          max={10}
          step={0.5}
          value={speed}
          onChange={(e) => usePlayerStore.getState().setSpeed(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
