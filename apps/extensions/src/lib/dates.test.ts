import { describe, expect, it } from 'vitest';
import { toUtcDate } from './dates';

describe('toUtcDate', () => {
  it('reads month-only and full dates at UTC midnight', () => {
    expect(toUtcDate('2026-04').toISOString()).toBe('2026-04-01T00:00:00.000Z');
    expect(toUtcDate('2026-04-11').toISOString()).toBe('2026-04-11T00:00:00.000Z');
  });
});
