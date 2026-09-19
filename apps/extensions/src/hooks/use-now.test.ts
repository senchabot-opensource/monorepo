import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { secondsLeft, useNow } from './use-now';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useNow', () => {
  it('ticks only while active', () => {
    vi.setSystemTime(1_000_000);
    const { result, rerender } = renderHook(({ active }) => useNow(active), {
      initialProps: { active: false },
    });
    act(() => vi.advanceTimersByTime(2_000));
    expect(result.current).toBe(1_000_000);
    rerender({ active: true });
    expect(result.current).toBe(1_002_000);
    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe(1_002_500);
  });

  it('counts whole seconds down, never below 1', () => {
    expect(secondsLeft(10_000, 7_100)).toBe(3);
    expect(secondsLeft(10_000, 10_000)).toBe(1);
    expect(secondsLeft(10_000, 12_000)).toBe(1);
  });
});
