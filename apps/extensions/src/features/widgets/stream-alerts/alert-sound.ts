import type { AlertKind, AlertTheme } from '#/lib/stream-alerts-url';

/** One note: pitch in Hz, when it starts and how long it rings, in seconds. */
type Note = [hz: number, at: number, length: number];

interface Voice {
  /** Oscillator shape per alert. */
  wave: Record<AlertKind, OscillatorType>;
  /** A second, quieter partial at this multiple of each note, for a bell's ring. */
  overtone?: number;
  /** Lowpass cutoff in Hz; lower sounds softer. */
  cutoff: number;
  motifs: Record<AlertKind, Note[]>;
}

// Short motifs per theme and alert, made at runtime so there are no sound files to license.
const VOICES: Record<AlertTheme, Voice> = {
  // Synth: a rising arpeggio for a sub, a sparkle for gifts, a coin for cheers, a fanfare for raids.
  neon: {
    wave: { sub: 'triangle', gift: 'triangle', bits: 'square', raid: 'sawtooth' },
    cutoff: 3200,
    motifs: {
      sub: [
        [659.3, 0, 0.5],
        [830.6, 0.08, 0.5],
        [987.8, 0.16, 0.5],
        [1318.5, 0.24, 0.9],
      ],
      gift: [
        [1046.5, 0, 0.3],
        [1318.5, 0.06, 0.3],
        [1568, 0.12, 0.3],
        [2093, 0.18, 0.4],
        [1568, 0.3, 0.8],
        [2637, 0.3, 0.8],
      ],
      bits: [
        [987.8, 0, 0.12],
        [1318.5, 0.09, 0.7],
      ],
      raid: [
        [392, 0, 0.25],
        [523.3, 0.14, 0.25],
        [659.3, 0.28, 0.25],
        [784, 0.42, 1.1],
        [392, 0.42, 1.1],
      ],
    },
  },
  // Bells on a pentatonic scale that ring out long, like a music box.
  celestial: {
    wave: { sub: 'sine', gift: 'sine', bits: 'sine', raid: 'sine' },
    overtone: 2.76,
    cutoff: 6000,
    motifs: {
      sub: [
        [1046.5, 0, 1.6],
        [1318.5, 0.14, 1.6],
        [1568, 0.28, 1.6],
        [2093, 0.42, 2.2],
      ],
      gift: [
        [1568, 0, 1.2],
        [1318.5, 0.08, 1.2],
        [2093, 0.16, 1.2],
        [1568, 0.24, 1.2],
        [2093, 0.32, 1.4],
        [2637, 0.4, 2],
      ],
      bits: [
        [2637, 0, 1.4],
        [1975.5, 0.16, 1.8],
      ],
      raid: [
        [523.3, 0, 1.2],
        [587.3, 0.06, 1.2],
        [659.3, 0.12, 1.2],
        [784, 0.18, 1.2],
        [880, 0.24, 1.2],
        [1046.5, 0.3, 1.4],
        [1174.7, 0.36, 1.4],
        [1318.5, 0.42, 2.2],
        [659.3, 0.42, 2.2],
      ],
    },
  },
};

let context: AudioContext | null = null;

/**
 * Plays the theme's motif for an alert at `volume` (0 to 1). OBS lets pages play sound without a
 * click; a normal browser tab stays silent until the page has been clicked.
 */
export function playAlertSound(theme: AlertTheme, kind: AlertKind, volume: number) {
  if (volume <= 0 || typeof AudioContext === 'undefined') return;
  context ??= new AudioContext();
  const ctx = context;
  if (ctx.state === 'suspended') void ctx.resume();
  const start = ctx.currentTime + 0.03;
  const voice = VOICES[theme];

  const master = ctx.createGain();
  master.gain.value = volume * 0.32;
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = voice.cutoff;
  tone.connect(master);
  master.connect(ctx.destination);
  // A short echo gives the notes some space.
  const echo = ctx.createDelay();
  echo.delayTime.value = 0.16;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.3;
  echo.connect(feedback).connect(echo);
  echo.connect(tone);

  let end = start;
  const ring = (hz: number, t: number, length: number, peak: number) => {
    const osc = ctx.createOscillator();
    osc.type = voice.wave[kind];
    osc.frequency.value = hz;
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, t);
    envelope.gain.linearRampToValueAtTime(peak, t + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.001, t + length);
    osc.connect(envelope);
    envelope.connect(tone);
    envelope.connect(echo);
    osc.start(t);
    osc.stop(t + length + 0.05);
    end = Math.max(end, t + length);
  };
  for (const [hz, at, length] of voice.motifs[kind]) {
    ring(hz, start + at, length, 0.5);
    // The overtone fades faster than the note, which is what makes it sound struck.
    if (voice.overtone) ring(hz * voice.overtone, start + at, length * 0.4, 0.12);
  }
  // Drops the echo loop once it has faded, so the nodes can be collected.
  window.setTimeout(() => master.disconnect(), (end - ctx.currentTime + 1.5) * 1000);
}
