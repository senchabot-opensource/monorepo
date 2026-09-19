import confetti from 'canvas-confetti';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type BurstOptions, useConfettiBurst } from './use-confetti-burst';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const OPTIONS: BurstOptions = { particleCount: 3 };
const FRAME_MS = 16;

beforeEach(() => {
  vi.useFakeTimers();
  vi.mocked(confetti).mockClear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useConfettiBurst', () => {
  it('fires from both sides every frame for 3 s', () => {
    const { result } = renderHook(() => useConfettiBurst(OPTIONS));
    act(() => result.current());
    act(() => vi.advanceTimersByTime(FRAME_MS));
    expect(confetti).toHaveBeenCalledTimes(2);
    act(() => vi.advanceTimersByTime(4000));
    const total = vi.mocked(confetti).mock.calls.length;
    act(() => vi.advanceTimersByTime(1000));
    expect(confetti).toHaveBeenCalledTimes(total);
  });

  it('replaces a running burst instead of doubling it', () => {
    const { result } = renderHook(() => useConfettiBurst(OPTIONS));
    act(() => result.current());
    act(() => vi.advanceTimersByTime(FRAME_MS));
    act(() => result.current());
    vi.mocked(confetti).mockClear();
    act(() => vi.advanceTimersByTime(FRAME_MS));
    expect(confetti).toHaveBeenCalledTimes(2);
  });

  it('stops when unmounted', () => {
    const { result, unmount } = renderHook(() => useConfettiBurst(OPTIONS));
    act(() => result.current());
    unmount();
    act(() => vi.advanceTimersByTime(1000));
    expect(confetti).not.toHaveBeenCalled();
  });
});
