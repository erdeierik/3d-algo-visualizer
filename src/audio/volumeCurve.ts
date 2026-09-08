/**
 * A csúszka 0..1 értékéből a master gain amplitúdója.
 *
 * A hangosságérzet nem az amplitúdóval, hanem nagyjából annak hatványával arányos: a
 * feleakkora hangosságérzet kb. −10 dB, nem −6 dB. A négyzetes görbe (`v²`) 50%-on −12 dB-t
 * ad, ami közel esik ehhez — így a csúszka a teljes hosszában érdemben szabályoz, nem csak
 * az alsó negyedében.
 */
export function volumeToGain(volume: number): number {
  if (!Number.isFinite(volume) || volume <= 0) return 0;
  if (volume >= 1) return 1;
  return volume * volume;
}
