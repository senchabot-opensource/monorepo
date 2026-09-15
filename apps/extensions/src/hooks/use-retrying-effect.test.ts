import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRetryingEffect } from './use-retrying-effect';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const settle = () => act(async () => {});

describe('useRetryingEffect', () => {
  it('runs again with a growing wait while the load asks for it', async () => {
    const results = [true, true, false];
    const load = vi.fn(async () => results.shift() ?? false);
    renderHook(() => useRetryingEffect(load, []));
    await settle();
    expect(load).toHaveBeenCalledTimes(1);
    await act(async () => vi.advanceTimersByTime(5_000));
    expect(load).toHaveBeenCalledTimes(2);
    await act(async () => vi.advanceTimersByTime(14_999));
    expect(load).toHaveBeenCalledTimes(2);
    await act(async () => vi.advanceTimersByTime(1));
    expect(load).toHaveBeenCalledTimes(3);
    await act(async () => vi.advanceTimersByTime(120_000));
    expect(load).toHaveBeenCalledTimes(3);
  });

  it('treats a load that throws as one to retry', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('boom')).mockResolvedValue(false);
    renderHook(() => useRetryingEffect(load, []));
    await settle();
    await act(async () => vi.advanceTimersByTime(5_000));
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('starts over when the deps change, and the old run knows it is stale', async () => {
    const seen: boolean[] = [];
    let release: () => void = () => {};
    const { rerender } = renderHook(
      ({ dep }) =>
        useRetryingEffect(
          async (isCurrent) => {
            if (dep === 1) await new Promise<void>((resolve) => (release = resolve));
            seen.push(isCurrent());
            return true;
          },
          [dep],
        ),
      { initialProps: { dep: 1 } },
    );
    rerender({ dep: 2 });
    await settle();
    await act(async () => release());
    expect(seen).toEqual([true, false]);
    // Only the current run schedules a retry.
    await act(async () => vi.advanceTimersByTime(5_000));
    expect(seen).toEqual([true, false, true]);
  });

  it('stops retrying on unmount', async () => {
    const load = vi.fn(async () => true);
    const { unmount } = renderHook(() => useRetryingEffect(load, []));
    await settle();
    unmount();
    await act(async () => vi.advanceTimersByTime(300_000));
    expect(load).toHaveBeenCalledOnce();
  });
});
