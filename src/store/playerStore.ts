import { create } from 'zustand';
import type { Step } from '../algorithms/types';

interface PlayerState {
  steps: Step[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  loadSteps: (steps: Step[]) => void;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBack: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

let intervalId: ReturnType<typeof setInterval> | null = null;

function stopInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  function advanceStep() {
    const { steps, currentStepIndex } = get();
    if (currentStepIndex >= steps.length - 1) return;

    const nextIndex = currentStepIndex + 1;
    set({ currentStepIndex: nextIndex });

    if (nextIndex >= steps.length - 1) {
      stopInterval();
      set({ isPlaying: false });
    }
  }

  function startInterval() {
    stopInterval();
    intervalId = setInterval(advanceStep, 1000 / get().speed);
  }

  return {
    steps: [],
    currentStepIndex: 0,
    isPlaying: false,
    speed: 2,

    loadSteps: (steps) => {
      stopInterval();
      set({ steps, currentStepIndex: 0, isPlaying: false });
    },

    play: () => {
      const { steps, currentStepIndex } = get();
      if (steps.length === 0 || currentStepIndex >= steps.length - 1) return;
      set({ isPlaying: true });
      startInterval();
    },

    pause: () => {
      stopInterval();
      set({ isPlaying: false });
    },

    stepForward: () => {
      stopInterval();
      set({ isPlaying: false });
      advanceStep();
    },

    stepBack: () => {
      stopInterval();
      const { currentStepIndex } = get();
      if (currentStepIndex <= 0) {
        set({ isPlaying: false });
        return;
      }
      set({ currentStepIndex: currentStepIndex - 1, isPlaying: false });
    },

    reset: () => {
      stopInterval();
      set({ currentStepIndex: 0, isPlaying: false });
    },

    setSpeed: (speed) => {
      set({ speed });
      if (get().isPlaying) startInterval();
    },
  };
});
