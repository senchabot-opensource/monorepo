import type { CountdownSound } from '#/lib/countdown-url';

/** Fixed playback level (0 to 1); the OBS mixer controls the rest. */
export const COUNTDOWN_SOUND_VOLUME = 0.5;

/** One note: pitch in Hz, when it starts and how long it rings, in seconds. */
type Note = [hz: number, at: number, length: number];

interface CountdownVoice {
  /** Oscillator shape for the motif. */
  wave: OscillatorType;
  /** A second, quieter partial at this multiple of each note, for a bell's ring. */
  overtone?: number;
  /** Lowpass cutoff in Hz; lower sounds softer. */
  cutoff: number;
  motif: Note[];
}

// Short motifs made at runtime so there are no sound files to license.
const VOICES: Record<Exclude<CountdownSound, 'off'>, CountdownVoice> = {
  // Warm rising arpeggio, like a meditation bell's friendlier cousin.
  chime: {
    wave: 'triangle',
    cutoff: 3200,
    motif: [
      [659.3, 0, 0.5],
      [830.6, 0.09, 0.5],
      [987.8, 0.18, 0.5],
      [1318.5, 0.27, 1.1],
    ],
  },
  // Long-ringing bells on a pentatonic scale, like a music box.
  bell: {
    wave: 'sine',
    overtone: 2.76,
    cutoff: 6000,
    motif: [
      [1046.5, 0, 1.8],
      [1318.5, 0.16, 1.8],
      [1568, 0.32, 2.2],
    ],
  },
  // Three beeps and a longer one, like a kitchen timer.
  digital: {
    wave: 'square',
    cutoff: 2500,
    motif: [
      [880, 0, 0.12],
      [880, 0.18, 0.12],
      [880, 0.36, 0.12],
      [1318.5, 0.54, 0.5],
    ],
  },
};

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null;
  try {
    context ??= new AudioContext();
    if (context.state === 'suspended') void context.resume();
    return context;
  } catch {
    return null;
  }
}

function perform(
  ctx: AudioContext,
  voice: Pick<CountdownVoice, 'wave' | 'overtone' | 'cutoff'>,
  notes: Note[],
  volume: number,
  peak: number,
) {
  const start = ctx.currentTime + 0.03;
  const master = ctx.createGain();
  master.gain.value = volume * 0.32;
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = voice.cutoff;
  tone.connect(master);
  master.connect(ctx.destination);

  let end = start;
  const ring = (hz: number, t: number, length: number, level: number) => {
    const osc = ctx.createOscillator();
    osc.type = voice.wave;
    osc.frequency.value = hz;
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, t);
    envelope.gain.linearRampToValueAtTime(level, t + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.001, t + length);
    osc.connect(envelope);
    envelope.connect(tone);
    osc.start(t);
    osc.stop(t + length + 0.05);
    end = Math.max(end, t + length);
  };
  for (const [hz, at, length] of notes) {
    ring(hz, start + at, length, peak);
    // The overtone fades faster than the note, which is what makes it sound struck.
    if (voice.overtone) ring(hz * voice.overtone, start + at, length * 0.4, peak * 0.24);
  }
  // Lets the nodes ring out, then drops them so they can be collected.
  window.setTimeout(() => master.disconnect(), (end - ctx.currentTime + 1.5) * 1000);
}

/**
 * Plays the pomodoro end motif at `volume` (0 to 1). OBS lets pages play sound without a
 * click; a normal browser tab stays silent until the page has been clicked.
 */
export function playCountdownSound(kind: Exclude<CountdownSound, 'off'>, volume: number) {
  if (volume <= 0) return;
  const ctx = getContext();
  if (!ctx) return;
  const voice = VOICES[kind];
  perform(ctx, voice, voice.motif, volume, 0.5);
}

/** A short tick for the last seconds before zero. */
export function playCountdownTick(volume: number) {
  if (volume <= 0) return;
  const ctx = getContext();
  if (!ctx) return;
  perform(ctx, { wave: 'sine', cutoff: 4000 }, [[1568, 0, 0.07]], volume, 0.3);
}
