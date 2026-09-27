import { useEffect } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useSettingsStore } from '../store/settingsStore';
import { playStepSound, setMasterLevel } from './engine';
import { pickSoundStep } from './pickSoundStep';

/**
 * A hang egyetlen React-kapcsolódási pontja. Mindkét feliratkozás ZUSTAND TRANZIENS
 * (store.subscribe egy useEffect-en belül), tehát NULLA újrarenderelést okoz — a hívó
 * App.tsx ma sem renderelődik újra lejátszás közben, és ez így is marad.
 */
export function useStepSound(): void {
  useEffect(() => {
    const { volume, muted } = useSettingsStore.getState();
    setMasterLevel(volume, muted);

    return useSettingsStore.subscribe((state) => {
      setMasterLevel(state.volume, state.muted);
    });
  }, []);

  useEffect(() => {
    return usePlayerStore.subscribe((state, prev) => {
      if (state.steps !== prev.steps) return; // új adat betöltése: néma
      if (state.currentStepIndex <= prev.currentStepIndex) return; // stepBack / reset: néma

      // összevont képkockában több lépés is lefuthatott: a legfontosabb szóljon (fazis-12 3.4)
      const step = pickSoundStep(state.steps, prev.currentStepIndex, state.currentStepIndex);
      if (step) playStepSound(step.kind);
    });
  }, []);
}
