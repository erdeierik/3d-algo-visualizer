import type { Step } from '../algorithms/types';
import { MASTER, soundFor } from './soundMap';
import { selectVoicesToRelease } from './voiceCap';
import { volumeToGain } from './volumeCurve';

interface Voice {
  startedAt: number;
  osc: OscillatorNode;
  gain: GainNode;
}

const ATTACK = 0.008; // 8 ms felfutás
const STEAL_RELEASE = 0.015; // 15 ms lecsengés az elvett hangnak (elvágva kattanna)
const SILENT = 0.0001; // az exponenciális rámpa nem mehet 0-ra

let ctx: AudioContext | null = null;
let busIn: DynamicsCompressorNode | null = null;
let master: GainNode | null = null;
let voices: Voice[] = [];
let volume = 0;
let muted = false;

function buildGraph(): void {
  if (!ctx) return;

  // hangok -> limiter -> master gain -> hangszóró
  // A limiter SZÁNDÉKOSAN a hangerő-szabályzó ELŐTT van: így mindig ugyanazt a teljes szintű
  // jelet látja, a kompresszió mértéke független a csúszka állásától, tehát a hangerő már
  // csak hangerő — a hangszín nem változik vele.
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -10;
  limiter.knee.value = 10;
  limiter.ratio.value = 12;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.12;

  const gain = ctx.createGain();
  gain.gain.value = MASTER.volume * volumeToGain(volume);

  limiter.connect(gain);
  gain.connect(ctx.destination);
  busIn = limiter;
  master = gain;
}

/** Felhasználói gesztusból hívandó (Play, Step forward): létrehozza vagy feloldja a contextet. */
export function unlockAudio(): void {
  if (typeof window === 'undefined') return;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext;
      if (!Ctor) return;
      ctx = new Ctor();
      buildGraph();
    }
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    ctx = null;
    busIn = null;
    master = null;
  }
}

/** A settingsStore változására hívva: a master gain egyetlen helyen állítódik. */
export function setMasterLevel(nextVolume: number, nextMuted: boolean): void {
  volume = nextVolume;
  muted = nextMuted;
  if (ctx && master) {
    master.gain.setTargetAtTime(MASTER.volume * volumeToGain(volume), ctx.currentTime, 0.02);
  }
}

function fadeOut(voice: Voice, at: number, duration: number): void {
  voice.gain.gain.cancelScheduledValues(at);
  voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, SILENT), at);
  voice.gain.gain.exponentialRampToValueAtTime(SILENT, at + duration);
  voice.osc.stop(at + duration);
}

export function playStepSound(kind: Step['kind']): void {
  const spec = soundFor(kind);
  if (!spec || muted || volume <= 0) return;
  if (!ctx || !busIn || ctx.state !== 'running') return; // még nem volt gesztus

  try {
    const now = ctx.currentTime;

    const stolen = selectVoicesToRelease(voices, MASTER.voiceCap);
    for (const voice of stolen) fadeOut(voice, now, STEAL_RELEASE);
    if (stolen.length > 0) voices = voices.filter((v) => !stolen.includes(v));

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = spec.type;
    osc.frequency.value = spec.frequency;

    gain.gain.setValueAtTime(SILENT, now);
    gain.gain.exponentialRampToValueAtTime(spec.volume, now + ATTACK);
    gain.gain.exponentialRampToValueAtTime(SILENT, now + spec.duration);

    osc.connect(gain);
    gain.connect(busIn);
    osc.start(now);
    osc.stop(now + spec.duration);

    const voice: Voice = { startedAt: now, osc, gain };
    voices.push(voice);
    osc.onended = () => {
      voices = voices.filter((v) => v !== voice);
      gain.disconnect();
    };
  } catch {
    /* a hang sosem akaszthatja meg a lejátszást */
  }
}
