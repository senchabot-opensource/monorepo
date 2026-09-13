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
});
