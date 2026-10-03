export interface SpinSlice {
  id: number;
  label: string;
  color: string;
}

export interface SpinHistoryEntry {
  id: string;
  label: string;
  color: string;
  at: number;
}

export interface BuiltSpin {
  spinId: string;
  selectedIndex: number;
  targetAngle: number;
  durationMs: number;
}

export const MAX_SLICES = 100;
export const MAX_LABEL_LENGTH = 100;
/** A `Nx ` prefix past this still counts this much: the wheel holds MAX_SLICES slices. */
export const MAX_WEIGHT = 99;
export const SPIN_DURATION_MS = 6000;
export const FULL_TURNS = 5;

/** The gold preset's slice palette from the dashboard wheel. */
export const SLICE_COLORS = [
  '#FF4500',
  '#9146FF',
  '#00D4AA',
  '#FFD700',
  '#00BFFF',
  '#FF1493',
  '#10B981',
  '#8B5CF6',
];

/**
 * One slice per non-empty line, then. Leading/trailing space is trimmed, over-long
 * labels are cut, and anything past MAX_SLICES is dropped. A leading `Nx ` weight
 * stays on the line here; assignColors expands it into extra slices.
 */
export function parseOptions(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, MAX_SLICES)
    .map((line) =>
      line.length > MAX_LABEL_LENGTH ? `${line.slice(0, MAX_LABEL_LENGTH - 1)}…` : line,
    );
}

/**
 * Lines become wheel slices, colors cycling the palette by slice. A line with a
 * weight (`2x Tetris`) becomes that many same-labeled slices in a row, like
 * typing the line that often; the wheel holds MAX_SLICES slices at most.
 */
export function assignColors(labels: string[]): SpinSlice[] {
  const slices: SpinSlice[] = [];
  for (const raw of labels) {
    const { label, weight } = parseWeightedLabel(raw);
    for (let n = 0; n < weight && slices.length < MAX_SLICES; n++) {
      const id = slices.length;
      slices.push({ id, label, color: SLICE_COLORS[id % SLICE_COLORS.length] ?? '#3b82f6' });
    }
    if (slices.length >= MAX_SLICES) break;
  }
  return slices;
}

/**
 * A leading `Nx ` (case-insensitive, `2x Tetris`) counts the line N times, so that
 * option takes N slices and wins N times as often. Anything else stays a literal
 * label: `2x` alone, `0x Foo` and `2x4 lumber` are all one slice each.
 */
export function parseWeightedLabel(raw: string): { label: string; weight: number } {
  const match = /^(\d+)\s*x\s+(.+)$/i.exec(raw.trim());
  const count = match ? Number.parseInt(match[1] ?? '', 10) : Number.NaN;
  const label = (match?.[2] ?? '').trim();
  if (!match || !label || !Number.isFinite(count) || count < 1) return { label: raw, weight: 1 };
  return { label, weight: Math.min(MAX_WEIGHT, count) };
}

export function secureRandomIndex(length: number): number {
  if (length <= 0) return 0;
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return Math.floor(((buf[0] ?? 0) / 0x1_0000_0000) * length);
  }
  return Math.floor(Math.random() * length);
}

function makeSpinId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `spin-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

const norm360 = (angle: number) => ((angle % 360) + 360) % 360;

/**
 * Which slice sits under the fixed top pointer at a wheel rotation angle.
 * The canvas draws slice i at [i*s, (i+1)*s) in the rotated frame and the
 * pointer sits at screen angle 270deg (12 o'clock).
 */
export function sliceAtAngle(angle: number, sliceCount: number): number {
  if (sliceCount <= 0) return 0;
  const sliceDeg = 360 / sliceCount;
  const pointer = norm360(270 - norm360(angle));
  return Math.min(sliceCount - 1, Math.floor(pointer / sliceDeg));
}

/**
 * Builds a spin that lands on a securely picked slice. The pointer stops at a
 * random offset inside the winning slice (15%-85% across) so repeat spins
 * don't park at the same spot, after FULL_TURNS forward turns plus a random
 * extra turn for variety.
 */
export function buildSpin(
  currentAngle: number,
  sliceCount: number,
  pick: (length: number) => number = secureRandomIndex,
  random: () => number = Math.random,
): BuiltSpin | null {
  if (sliceCount < 2) return null;
  const selectedIndex = pick(sliceCount);
  const sliceDeg = 360 / sliceCount;
  const offsetInSlice = sliceDeg * (0.15 + random() * 0.7);
  const pointerTarget = norm360(selectedIndex * sliceDeg + offsetInSlice);
  const finalMod = norm360(270 - pointerTarget);
  const currentMod = norm360(currentAngle);
  const delta = norm360(finalMod - currentMod);
  // Whole extra turns only: a fractional turn would move the final rest angle
  // off the picked slice and the wheel would stop on the wrong option.
  const extraTurns = (FULL_TURNS + Math.floor(random() * 2)) * 360;
  return {
    spinId: makeSpinId(),
    selectedIndex,
    targetAngle: currentAngle + extraTurns + delta,
    durationMs: SPIN_DURATION_MS,
  };
}

/** Fisher-Yates shuffle that never mutates its input. */
export function shuffleLines(lines: string[], random: () => number = Math.random): string[] {
  const next = [...lines];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = next[i] ?? '';
    next[i] = next[j] ?? '';
    next[j] = a;
  }
  return next;
}
