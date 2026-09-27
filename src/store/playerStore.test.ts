import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MANUAL_TWEEN_MS, tweenMsFor, usePlayerStore } from './playerStore';
import type { Step } from '../algorithms/types';

/**
 * Node-ban a lejátszó setTimeout(16)-os „képkockákkal" fut (playerStore.ts tartaléka). Az első
 * tick csak az órát indítja, és a lépés csak képkocka-határon jön, ezért az első lépésre két
 * képkockányi ráhagyás kell.
 */
const FRAME = 16;
const FIRST_STEP_SLACK = 2 * FRAME;

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
  usePlayerStore.setState({ steps: [], currentStepIndex: 0, isPlaying: false, speed: 2, tweenMs: MANUAL_TWEEN_MS });
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

    vi.advanceTimersByTime(500 - FRAME); // speed=2 -> 500ms/lépés, de még nem telt el
    expect(usePlayerStore.getState().currentStepIndex).toBe(0);

    vi.advanceTimersByTime(FRAME + FIRST_STEP_SLACK);
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
    vi.advanceTimersByTime(500 + FIRST_STEP_SLACK);
    expect(usePlayerStore.getState().currentStepIndex).toBe(1);

    usePlayerStore.getState().pause();
    vi.advanceTimersByTime(2000);
    expect(usePlayerStore.getState().currentStepIndex).toBe(1);
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('setSpeed lejátszás közben az új tempóval folytat, újraindítás nélkül', () => {
    usePlayerStore.getState().loadSteps(makeSteps(5));
    usePlayerStore.getState().play();
    usePlayerStore.getState().setSpeed(10); // 100ms/lépés

    vi.advanceTimersByTime(100 + FIRST_STEP_SLACK);
    expect(usePlayerStore.getState().currentStepIndex).toBe(1);
    vi.advanceTimersByTime(100);
    expect(usePlayerStore.getState().currentStepIndex).toBe(2);
  });

  it('100×-on egy képkocka több lépést is léptet, egyetlen store-frissítéssel', () => {
    usePlayerStore.getState().loadSteps(makeSteps(50));
    usePlayerStore.getState().setSpeed(100); // 10ms/lépés
    usePlayerStore.getState().play();
    vi.advanceTimersByTime(FRAME); // első tick: csak az óra indul

    let updates = 0;
    const unsubscribe = usePlayerStore.subscribe(() => updates++);

    vi.advanceTimersByTime(FRAME); // 16 ms → 1 lépés, 6 ms marad
    expect(usePlayerStore.getState().currentStepIndex).toBe(1);
    expect(updates).toBe(1);

    vi.advanceTimersByTime(FRAME); // 22 ms → 2 lépés egyszerre
    expect(usePlayerStore.getState().currentStepIndex).toBe(3);
    expect(updates).toBe(2);

    unsubscribe();
  });

  it('hosszú kimaradás után legfeljebb MAX_FRAME_MS-nyi lépést pótol', () => {
    usePlayerStore.getState().loadSteps(makeSteps(100));
    usePlayerStore.getState().setSpeed(10); // 100ms/lépés
    usePlayerStore.getState().play();
    vi.advanceTimersByTime(FRAME);

    vi.setSystemTime(Date.now() + 5000); // háttérfül: 5 s képkocka nélkül
    vi.advanceTimersByTime(FRAME);
    // 5 s-nyi (50) lépés helyett a 250 ms-os korlát szerint legfeljebb 2–3
    expect(usePlayerStore.getState().currentStepIndex).toBeLessThanOrEqual(3);
    expect(usePlayerStore.getState().currentStepIndex).toBeGreaterThan(0);
  });

  it('tweenMsFor: az intervallum 75%-a, legfeljebb 400 ms', () => {
    expect(tweenMsFor(0.5)).toBe(400);
    expect(tweenMsFor(2)).toBe(375);
    expect(tweenMsFor(10)).toBe(75);
    expect(tweenMsFor(100)).toBe(7.5);
  });

  it('automatikus lépés után a tweenMs a sebességből jön, kézi lépés után 300 ms', () => {
    usePlayerStore.getState().loadSteps(makeSteps(10));
    usePlayerStore.getState().setSpeed(10);
    usePlayerStore.getState().play();
    vi.advanceTimersByTime(100 + FIRST_STEP_SLACK);
    expect(usePlayerStore.getState().tweenMs).toBe(tweenMsFor(10));

    usePlayerStore.getState().stepForward();
    expect(usePlayerStore.getState().tweenMs).toBe(MANUAL_TWEEN_MS);
  });

  it('reset visszaállítja az indexet és leállítja a lejátszást', () => {
    usePlayerStore.getState().loadSteps(makeSteps(3));
    usePlayerStore.getState().play();
    vi.advanceTimersByTime(500 + FIRST_STEP_SLACK);
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
