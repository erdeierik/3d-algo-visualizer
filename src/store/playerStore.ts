import { create } from 'zustand';
import type { Step } from '../algorithms/types';

/** Kézi lépésnél (⏮/⏭, Restart, új adat) a tween hossza, a sebességtől függetlenül. */
export const MANUAL_TWEEN_MS = 300;
const MAX_TWEEN_MS = 400;
/** A tween a lépésköz ekkora része; a maradék a képkocka-kvantálás tartaléka (fazis-12 3.3). */
const TWEEN_SHARE = 0.75;
/** Háttérfül vagy akadás után ne zúduljon rá egyszerre sok lépés. */
const MAX_FRAME_MS = 250;

export function tweenMsFor(speed: number): number {
  return Math.min((TWEEN_SHARE * 1000) / speed, MAX_TWEEN_MS);
}

interface PlayerState {
  steps: Step[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  /** A legutóbbi lépésváltás animációjának hossza (ms); a jelenet újracélzáskor olvassa. */
  tweenMs: number;
  loadSteps: (steps: Step[]) => void;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBack: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

type FrameId = number | ReturnType<typeof setTimeout>;

// A tesztek Node-ban futnak, ott nincs requestAnimationFrame. A tartalék a setTimeout és a
// Date.now, mindkettőt a Vitest fake timere vezérli — ugyanaz a védekezés, mint a matchMedia-é (NFR-12).
function requestFrame(callback: (now: number) => void): FrameId {
  if (typeof requestAnimationFrame === 'function') return requestAnimationFrame(callback);
  return setTimeout(() => callback(Date.now()), 16);
}

function cancelFrame(id: FrameId) {
  if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(id as number);
  else clearTimeout(id as ReturnType<typeof setTimeout>);
}

let frameId: FrameId | null = null;
let lastTime: number | null = null;
let accumulator = 0;

function stopLoop() {
  if (frameId !== null) {
    cancelFrame(frameId);
    frameId = null;
  }
  lastTime = null;
  accumulator = 0;
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  function tick(now: number) {
    frameId = null;
    if (!get().isPlaying) return;

    if (lastTime !== null) accumulator += Math.min(now - lastTime, MAX_FRAME_MS);
    lastTime = now;

    const { speed, steps, currentStepIndex } = get();
    const interval = 1000 / speed;
    const count = Math.floor(accumulator / interval);
    if (count > 0) {
      accumulator -= count * interval;
      const lastIndex = steps.length - 1;
      const nextIndex = Math.min(currentStepIndex + count, lastIndex);
      // EGYETLEN set: a feliratkozók (jelenet, hang, panelek) képkockánként egyszer értesülnek,
      // a közbülső lépések nem kapnak saját animációt (fazis-12 3.2)
      set({ currentStepIndex: nextIndex, tweenMs: tweenMsFor(speed), isPlaying: nextIndex < lastIndex });
    }

    if (get().isPlaying) frameId = requestFrame(tick);
    else stopLoop();
  }

  return {
    steps: [],
    currentStepIndex: 0,
    isPlaying: false,
    speed: 2,
    tweenMs: MANUAL_TWEEN_MS,

    loadSteps: (steps) => {
      stopLoop();
      set({ steps, currentStepIndex: 0, isPlaying: false, tweenMs: MANUAL_TWEEN_MS });
    },

    play: () => {
      const { steps, currentStepIndex } = get();
      if (steps.length === 0 || currentStepIndex >= steps.length - 1) return;
      stopLoop();
      set({ isPlaying: true });
      frameId = requestFrame(tick);
    },

    pause: () => {
      stopLoop();
      set({ isPlaying: false });
    },

    stepForward: () => {
      stopLoop();
      const { steps, currentStepIndex } = get();
      if (currentStepIndex >= steps.length - 1) {
        set({ isPlaying: false });
        return;
      }
      set({ currentStepIndex: currentStepIndex + 1, isPlaying: false, tweenMs: MANUAL_TWEEN_MS });
    },

    stepBack: () => {
      stopLoop();
      const { currentStepIndex } = get();
      if (currentStepIndex <= 0) {
        set({ isPlaying: false });
        return;
      }
      set({ currentStepIndex: currentStepIndex - 1, isPlaying: false, tweenMs: MANUAL_TWEEN_MS });
    },

    reset: () => {
      stopLoop();
      set({ currentStepIndex: 0, isPlaying: false, tweenMs: MANUAL_TWEEN_MS });
    },

    // a sebesség minden képkockán újra kiolvasódik, az akkumulátor megmarad: nincs mit újraindítani
    setSpeed: (speed) => {
      set({ speed });
    },
  };
});
