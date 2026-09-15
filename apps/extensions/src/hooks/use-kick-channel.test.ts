import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useKickChannel } from './use-kick-channel';

const found = (chatroom: number) =>
  new Response(JSON.stringify({ id: 1, user_id: 2, chatroom: { id: chatroom } }));

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const settle = () => act(async () => {});

describe('useKickChannel', () => {
  it('looks the channel up and stops once kick.com answers', async () => {
    vi.mocked(fetch).mockResolvedValue(found(9));
    const { result } = renderHook(() => useKickChannel(' streamer '));
    await settle();
    expect(result.current.channel?.chatroomId).toBe('9');
    await act(async () => vi.advanceTimersByTime(120_000));
    expect(fetch).toHaveBeenCalledOnce();
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe('https://kick.com/api/v1/channels/streamer');
  });

  it('keeps trying, slower each time, while kick.com fails, and says when it is not found', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response('{}', { status: 403 }))
      .mockResolvedValueOnce(new Response('{}', { status: 404 }))
      .mockResolvedValueOnce(found(9));
    const { result } = renderHook(() => useKickChannel('streamer'));
    await settle();
    expect(result.current).toEqual({ channel: null, notFound: false });
    await act(async () => vi.advanceTimersByTime(5_000));
    expect(result.current).toEqual({ channel: null, notFound: true });
    await act(async () => vi.advanceTimersByTime(14_000));
    expect(fetch).toHaveBeenCalledTimes(2);
    await act(async () => vi.advanceTimersByTime(1_000));
    expect(result.current.channel?.chatroomId).toBe('9');
    expect(result.current.notFound).toBe(false);
  });

  it('drops an answer for a name it no longer looks up', async () => {
    let answer: (r: Response) => void = () => {};
    vi.mocked(fetch)
      .mockReturnValueOnce(new Promise((resolve) => (answer = resolve)))
      .mockResolvedValueOnce(found(2));
    const { result, rerender } = renderHook(({ slug }) => useKickChannel(slug), {
      initialProps: { slug: 'first' },
    });
    rerender({ slug: 'second' });
    await settle();
    expect(result.current.channel?.chatroomId).toBe('2');
    await act(async () => answer(found(1)));
    expect(result.current.channel?.chatroomId).toBe('2');
  });

  it('looks nothing up without a name or while disabled, and stops retrying on unmount', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 503 }));
    renderHook(() => useKickChannel('  '));
    renderHook(() => useKickChannel('streamer', false));
    await settle();
    expect(fetch).not.toHaveBeenCalled();

    const { unmount } = renderHook(() => useKickChannel('streamer'));
    await settle();
    unmount();
    await act(async () => vi.advanceTimersByTime(300_000));
    expect(fetch).toHaveBeenCalledOnce();
  });
});
