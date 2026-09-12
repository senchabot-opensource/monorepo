import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useChat } from './use-chat';

const { connect } = vi.hoisted(() => ({ connect: vi.fn() }));

// Like obs-websocket-js 5: a refused connect fires ConnectionClosed and then rejects, and
// disconnect() fires ConnectionClosed too.
vi.mock('obs-websocket-js', () => ({
  OBSWebSocket: class {
    private handlers = new Map<string, () => void>();
    on(event: string, handler: () => void) {
      this.handlers.set(event, handler);
    }
    async connect(...args: unknown[]) {
      connect(...args);
      this.handlers.get('ConnectionClosed')?.();
      throw new Error('connection refused');
    }
    async disconnect() {
      this.handlers.get('ConnectionClosed')?.();
    }
    async call() {}
  },
}));

beforeEach(() => {
  vi.useFakeTimers();
  connect.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useChat OBS connection', () => {
  it('retries once every 5s while OBS refuses the connection', async () => {
    renderHook(() => useChat('Main', 'BRB'));
    await vi.advanceTimersByTimeAsync(0);
    expect(connect).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(20_000);
    expect(connect).toHaveBeenCalledTimes(5);
  });

  it('stops retrying after unmount', async () => {
    const { unmount } = renderHook(() => useChat('Main', 'BRB'));
    await vi.advanceTimersByTimeAsync(0);
    unmount();

    await vi.advanceTimersByTimeAsync(20_000);
    expect(connect).toHaveBeenCalledTimes(1);
  });

  it('sends the password to the default URL when no URL is set', async () => {
    renderHook(() => useChat('Main', 'BRB', null, null, '', 'secret'));
    await vi.advanceTimersByTimeAsync(0);
    expect(connect).toHaveBeenCalledWith(undefined, 'secret');
  });

  it('sends the URL and password when both are set', async () => {
    renderHook(() => useChat('Main', 'BRB', null, null, 'ws://192.168.1.5:4455', 'secret'));
    await vi.advanceTimersByTimeAsync(0);
    expect(connect).toHaveBeenCalledWith('ws://192.168.1.5:4455', 'secret');
  });

  it('sends no password when none is set', async () => {
    renderHook(() => useChat('Main', 'BRB', null, null, null, undefined));
    await vi.advanceTimersByTimeAsync(0);
    expect(connect).toHaveBeenCalledWith(undefined, undefined);
  });

  it('reports the status through the callback instead of the DOM', async () => {
    const onStatus = vi.fn();
    renderHook(() =>
      useChat('Main', 'BRB', null, null, null, undefined, undefined, undefined, onStatus),
    );
    expect(onStatus).toHaveBeenCalledWith('connecting');
    await vi.advanceTimersByTimeAsync(0);
    expect(onStatus).toHaveBeenLastCalledWith('failed');
  });
});
