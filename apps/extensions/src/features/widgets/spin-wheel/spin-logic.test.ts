import { describe, expect, it } from 'vitest';
import {
  assignColors,
  buildSpin,
  MAX_LABEL_LENGTH,
  MAX_SLICES,
  MAX_WEIGHT,
  parseOptions,
  parseWeightedLabel,
  shuffleLines,
  sliceAtAngle,
} from './spin-logic';

describe('parseOptions', () => {
  it('takes one slice per non-empty line', () => {
    expect(parseOptions('Zelda\n\n  Mario  \n\nTetris\n')).toEqual(['Zelda', 'Mario', 'Tetris']);
  });

  it('returns an empty list for blank input', () => {
    expect(parseOptions('\n   \n')).toEqual([]);
  });

  it('keeps duplicates: every line is one slice', () => {
    expect(parseOptions('a\na')).toEqual(['a', 'a']);
  });

  it(`caps the list at ${MAX_SLICES} slices`, () => {
    const text = Array.from({ length: MAX_SLICES + 10 }, (_, i) => `opt ${i}`).join('\n');
    const parsed = parseOptions(text);
    expect(parsed).toHaveLength(MAX_SLICES);
    expect(parsed[0]).toBe('opt 0');
  });

  it(`truncates labels past ${MAX_LABEL_LENGTH} characters`, () => {
    const parsed = parseOptions('x'.repeat(MAX_LABEL_LENGTH + 50));
    expect(parsed[0]?.length).toBeLessThanOrEqual(MAX_LABEL_LENGTH);
  });
});

describe('parseWeightedLabel', () => {
  it('reads a leading Nx prefix as extra slices', () => {
    expect(parseWeightedLabel('2x Tetris')).toEqual({ label: 'Tetris', weight: 2 });
    expect(parseWeightedLabel('10x Zelda')).toEqual({ label: 'Zelda', weight: 10 });
    expect(parseWeightedLabel('3X Mario')).toEqual({ label: 'Mario', weight: 3 });
  });

  it(`caps the weight at ${MAX_WEIGHT}`, () => {
    expect(parseWeightedLabel('999x Tetris')).toEqual({ label: 'Tetris', weight: MAX_WEIGHT });
  });

  it('leaves anything else a literal one-slice label', () => {
    expect(parseWeightedLabel('Tetris')).toEqual({ label: 'Tetris', weight: 1 });
    expect(parseWeightedLabel('2x')).toEqual({ label: '2x', weight: 1 });
    expect(parseWeightedLabel('0x Tetris')).toEqual({ label: '0x Tetris', weight: 1 });
    expect(parseWeightedLabel('2x4 lumber')).toEqual({ label: '2x4 lumber', weight: 1 });
    expect(parseWeightedLabel('2xTetris')).toEqual({ label: '2xTetris', weight: 1 });
  });
});

describe('assignColors', () => {
  it('cycles the palette across slices', () => {
    const slices = assignColors(['a', 'b', 'c']);
    expect(slices.map((s) => s.color)).toEqual(['#FF4500', '#9146FF', '#00D4AA']);
    expect(slices[0]).toMatchObject({ id: 0, label: 'a' });
  });

  it('expands a weighted line into same-labeled slices', () => {
    const slices = assignColors(['2x Tetris', 'Zelda']);
    expect(slices.map((s) => s.label)).toEqual(['Tetris', 'Tetris', 'Zelda']);
    expect(slices.map((s) => s.id)).toEqual([0, 1, 2]);
  });

  it(`holds at most ${MAX_SLICES} slices`, () => {
    const slices = assignColors(['99x Tetris', 'Zelda']);
    expect(slices).toHaveLength(MAX_SLICES);
    expect(slices.filter((s) => s.label === 'Tetris')).toHaveLength(99);
    expect(slices.at(-1)?.label).toBe('Zelda');
  });
});

describe('sliceAtAngle and buildSpin', () => {
  it('lands the top pointer inside the picked slice', () => {
    for (const count of [2, 3, 5, 8, 12]) {
      for (let attempt = 0; attempt < 25; attempt++) {
        const spin = buildSpin(
          attempt * 137.5,
          count,
          () => attempt % count,
          () => (attempt * 0.37) % 1,
        );
        expect(spin).not.toBeNull();
        expect(sliceAtAngle(spin?.targetAngle ?? 0, count)).toBe(attempt % count);
      }
    }
  });

  it('always spins forward with several full turns', () => {
    const spin = buildSpin(
      10,
      4,
      () => 2,
      () => 0.5,
    );
    expect(spin?.targetAngle ?? 0).toBeGreaterThan(10 + 5 * 360);
    expect(spin?.durationMs).toBe(6000);
  });

  it('needs at least two slices', () => {
    expect(buildSpin(0, 0)).toBeNull();
    expect(buildSpin(0, 1)).toBeNull();
  });
});

describe('shuffleLines', () => {
  it('keeps every line without mutating the input', () => {
    const input = ['a', 'b', 'c', 'd'];
    const shuffled = shuffleLines(input, () => 0.9);
    expect([...shuffled].sort()).toEqual(['a', 'b', 'c', 'd']);
    expect(input).toEqual(['a', 'b', 'c', 'd']);
  });
});
