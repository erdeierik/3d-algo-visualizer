import { useEffect, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSettingsStore } from '../../store/settingsStore';

export const DECOR_GROUP_NAME = 'decor';

/**
 * Minden díszlet ezen belülre kerül (temak-poc.md 2.): csillagmező, ég, talaj, növényzet,
 * pollen, kontaktárnyék. A kamera-fit az analitikus ContentBounds-ból számol, tehát a dekor
 * a keretbe eleve nem szólhat bele — a group a SZERKEZETI határ, ami ezt láthatóvá teszi a
 * jelenetgráfban, és amihez az ambient mozgás szabálya köthető.
 */
export function Decor({ children }: { children: ReactNode }) {
  return <group name={DECOR_GROUP_NAME}>{children}</group>;
}

export type AmbientFrame = (elapsed: number, delta: number) => void;

/**
 * Dekor-mozgás egyetlen belépési ponttal (11.4).
 *
 * - `animate === true`  → minden képkockán meghívja az `onFrame`-et
 * - `animate === false` → EGYSZER meghívja a `rest`-et (alap-póz), utána nem csinál semmit
 *
 * A kikapcsolás tehát nem építi újra a jelenetet, csak visszakomponál — így a lejátszás nem
 * ugrik meg (temak-poc.md 5.3). A `prefers-reduced-motion` itt NEM szerepel: az csak az
 * `animate` ALAPÉRTÉKÉT adja a settingsStore-ban, a felhasználói kapcsoló mindig felülír
 * (04-terv-v2.md 1.2 / 06-review-v2.md 4.1).
 */
// eslint-disable-next-line react-refresh/only-export-components -- hook él a group mellett, ld. 9. szakasz indoklása
export function useAmbientMotion(onFrame: AmbientFrame, rest?: () => void): void {
  const animate = useSettingsStore((s) => s.animate);
  const settled = useRef(false);

  // váltásra újra „élesítünk": kikapcsoláskor egyszer alap-pózba állunk,
  // bekapcsoláskor a következő képkockától megy tovább a mozgás
  useEffect(() => {
    settled.current = false;
  }, [animate]);

  useFrame((state, delta) => {
    if (animate) {
      onFrame(state.clock.elapsedTime, delta);
      return;
    }
    if (settled.current) return;
    settled.current = true;
    rest?.();
  });
}
