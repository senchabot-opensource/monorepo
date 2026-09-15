import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DISPLAY_DURATION, MAX_VISIBLE } from '#/lib/alert-config';
import { useAlertQueue } from './use-alert-queue';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const addFollows = (addAlert: ReturnType<typeof useAlertQueue>['addAlert'], count: number) => {
  act(() => {
    for (let i = 0; i < count; i++) {
      addAlert('follow', { name: `follower${i}`, platform: 'kick' });
    }
  });
};

describe('useAlertQueue', () => {
  it('shows up to MAX_VISIBLE alerts and queues the rest', () => {
    const { result } = renderHook(() => useAlertQueue());
    addFollows(result.current.addAlert, MAX_VISIBLE + 3);
    expect(result.current.visibleAlerts.map((a) => a.data.name)).toEqual(
      ['follower0', 'follower1', 'follower2', 'follower3', 'follower4'],
    );
  });

  it('removes alerts that came from the queue too, so a burst drains', () => {
    const { result } = renderHook(() => useAlertQueue());
    addFollows(result.current.addAlert, MAX_VISIBLE * 2);

    act(() => vi.advanceTimersByTime(DISPLAY_DURATION));
    expect(result.current.visibleAlerts.map((a) => a.data.name)).toEqual(
      ['follower5', 'follower6', 'follower7', 'follower8', 'follower9'],
    );

    act(() => vi.advanceTimersByTime(DISPLAY_DURATION));
    expect(result.current.visibleAlerts).toEqual([]);

    addFollows(result.current.addAlert, 1);
    expect(result.current.visibleAlerts.map((a) => a.data.name)).toEqual(['follower0']);
  });

  it('keeps arrival order through the queue, each alert shown once', () => {
    const { result } = renderHook(() => useAlertQueue());
    const seen: string[] = [];
    const record = () => {
      for (const alert of result.current.visibleAlerts) {
        if (!seen.includes(alert.data.name)) seen.push(alert.data.name);
      }
    };
    addFollows(result.current.addAlert, 12);
    record();
    for (let i = 0; i < 4; i++) {
      act(() => vi.advanceTimersByTime(DISPLAY_DURATION));
      record();
    }
    expect(seen).toEqual(Array.from({ length: 12 }, (_, i) => `follower${i}`));
    expect(result.current.visibleAlerts).toEqual([]);
  });

  it('gives every alert its full time on screen, queued ones too', () => {
    const { result } = renderHook(() => useAlertQueue());
    addFollows(result.current.addAlert, MAX_VISIBLE + 1);
    act(() => vi.advanceTimersByTime(DISPLAY_DURATION));
    const promoted = result.current.visibleAlerts.map((a) => a.data.name);
    expect(promoted).toEqual(['follower5']);
    act(() => vi.advanceTimersByTime(DISPLAY_DURATION - 1));
    expect(result.current.visibleAlerts.map((a) => a.data.name)).toEqual(['follower5']);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.visibleAlerts).toEqual([]);
  });

  it('takes new alerts while a burst drains, without losing any', () => {
    const { result } = renderHook(() => useAlertQueue());
    addFollows(result.current.addAlert, 7);
    act(() => vi.advanceTimersByTime(1000));
    act(() => result.current.addAlert('sub', { name: 'late', platform: 'kick' }));
    act(() => vi.advanceTimersByTime(DISPLAY_DURATION - 1000));
    expect(result.current.visibleAlerts.map((a) => a.data.name)).toEqual([
      'follower5',
      'follower6',
      'late',
    ]);
    act(() => vi.advanceTimersByTime(DISPLAY_DURATION));
    expect(result.current.visibleAlerts).toEqual([]);
  });

  it('leaves no timers behind when unmounted', () => {
    const { result, unmount } = renderHook(() => useAlertQueue());
    addFollows(result.current.addAlert, MAX_VISIBLE + 2);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
