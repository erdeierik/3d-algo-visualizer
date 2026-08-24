import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlayerStore } from './playerStore';
import type { Step } from '../algorithms/types';

function makeSteps(count: number): Step[] {
  return Array.from({ length: count }, (_, i) => ({
    stepIndex: i,
    pseudocodeLine: 0,
    stats: { comparisons: 0, operations: 0 },
    array: [],
    activeIndices: [],
    kind: 'compare',
  }));
}

beforeEach(() => {
  vi.useFakeTimers();
  usePlayerStore.getState().pause();
  usePlayerStore.setState({ steps: [], currentStepIndex: 0, isPlaying: false, speed: 2 });
});

afterEach(() => {
  usePlayerStore.getState().pause();
  vi.useRealTimers();
});

describe('usePlayerStore', () => {
  it('loadSteps betölti a lépéseket és nullázza az indexet', () => {
    usePlayerStore.getState().loadSteps(makeSteps(3));
    expect(usePlayerStore.getState().steps).toHaveLength(3);
    expect(usePlayerStore.getState().currentStepIndex).toBe(0);
  });

  it('stepForward eggyel előreléptet', () => {
    usePlayerStore.getState().loadSteps(makeSteps(3));
    usePlayerStore.getState().stepForward();
    expect(usePlayerStore.getState().currentStepIndex).toBe(1);
  });

  it('stepForward az utolsó lépésnél no-op', () => {
    usePlayerStore.getState().loadSteps(makeSteps(3));
    usePlayerStore.getState().stepForward();
    usePlayerStore.getState().stepForward();
    expect(usePlayerStore.getState().currentStepIndex).toBe(2);
    usePlayerStore.getState().stepForward();
    expect(usePlayerStore.getState().currentStepIndex).toBe(2);
  });

  it('stepBack a legelső lépésnél no-op', () => {
    usePlayerStore.getState().loadSteps(makeSteps(3));
    usePlayerStore.getState().stepBack();
    expect(usePlayerStore.getState().currentStepIndex).toBe(0);
  });

  it('stepBack eggyel visszaléptet', () => {
    usePlayerStore.getState().loadSteps(makeSteps(3));
    usePlayerStore.getState().stepForward();
    usePlayerStore.getState().stepForward();
    usePlayerStore.getState().stepBack();
    expect(usePlayerStore.getState().currentStepIndex).toBe(1);
  });

  it('play() üres steps mellett nem indít lejátszást', () => {
    usePlayerStore.getState().play();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('play() automatikusan léptet, és pontosan a végén áll meg', () => {
    usePlayerStore.getState().loadSteps(makeSteps(3));
    usePlayerStore.getState().play();
    expect(usePlayerStore.getState().isPlaying).toBe(true);

    vi.advanceTimersByTime(500); // speed=2 -> 500ms/lépés
    expect(usePlayerStore.getState().currentStepIndex).toBe(1);
    expect(usePlayerStore.getState().isPlaying).toBe(true);

    vi.advanceTimersByTime(500);
    expect(usePlayerStore.getState().currentStepIndex).toBe(2);
    expect(usePlayerStore.getState().isPlaying).toBe(false);

    vi.advanceTimersByTime(500); // már nincs mit léptetni
    expect(usePlayerStore.getState().currentStepIndex).toBe(2);
  });

  it('pause() leállítja az automatikus léptetést', () => {
    usePlayerStore.getState().loadSteps(makeSteps(5));
    usePlayerStore.getState().play();
    vi.advanceTimersByTime(500);
    expect(usePlayerStore.getState().currentStepIndex).toBe(1);

    usePlayerStore.getState().pause();
    vi.advanceTimersByTime(2000);
    expect(usePlayerStore.getState().currentStepIndex).toBe(1);
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('setSpeed lejátszás közben az új tempóval folytat', () => {
    usePlayerStore.getState().loadSteps(makeSteps(5));
    usePlayerStore.getState().play();
    usePlayerStore.getState().setSpeed(10); // 100ms/lépés

    vi.advanceTimersByTime(100);
    expect(usePlayerStore.getState().currentStepIndex).toBe(1);
    vi.advanceTimersByTime(100);
    expect(usePlayerStore.getState().currentStepIndex).toBe(2);
  });

  it('reset visszaállítja az indexet és leállítja a lejátszást', () => {
    usePlayerStore.getState().loadSteps(makeSteps(3));
    usePlayerStore.getState().play();
    vi.advanceTimersByTime(500);
    usePlayerStore.getState().reset();
    expect(usePlayerStore.getState().currentStepIndex).toBe(0);
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('manuális stepForward lejátszás közben leállítja az automatikus léptetést', () => {
    usePlayerStore.getState().loadSteps(makeSteps(5));
    usePlayerStore.getState().play();
    usePlayerStore.getState().stepForward();
    expect(usePlayerStore.getState().currentStepIndex).toBe(1);
    expect(usePlayerStore.getState().isPlaying).toBe(false);

    vi.advanceTimersByTime(2000); // ne induljon újra magától
    expect(usePlayerStore.getState().currentStepIndex).toBe(1);
  });
});
