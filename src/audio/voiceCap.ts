export interface TimedVoice {
  startedAt: number;
}

/**
 * Melyik szóló hangokat kell elvenni, hogy az ÚJ hangnak legyen helye a `cap` méretű
 * keretben. A legrégebbieket adja vissza, kezdési idő szerint növekvő sorrendben;
 * ha van szabad hely, üres tömböt.
 */
export function selectVoicesToRelease<T extends TimedVoice>(active: T[], cap: number): T[] {
  const overflow = active.length - cap + 1;
  if (overflow <= 0) return [];
  return [...active].sort((a, b) => a.startedAt - b.startedAt).slice(0, overflow);
}
