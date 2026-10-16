import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FakeWebSocket } from '#/test/browser';
import { type Follow, readFollowToken, useFollows } from './use-follows';

const senchabot = () => FakeWebSocket.instances.filter((ws) => ws.url.includes('follower-goal'));
const follow = (user: string, platform: string) =>
  act(() =>
    senchabot()
      .at(-1)
      ?.receive(JSON.stringify({ type: 'follow', user, platform })),
  );

describe('readFollowToken', () => {
  it('reads the token from a Follower Goal URL, or takes one pasted on its own', () => {
    expect(
      readFollowToken(
        ' https://extensions.senchabot.com/widgets/follower-goal?twitch=streamer&token=abc123 ',
      ),
    ).toBe('abc123');
    expect(readFollowToken('abc123')).toBe('abc123');
  });

  it('finds none in a URL without one, in words or in nothing', () => {
    expect(readFollowToken('https://extensions.senchabot.com/widgets/follower-goal')).toBeNull();
    expect(readFollowToken('my token is here')).toBeNull();
    expect(readFollowToken('   ')).toBeNull();
  });
});

describe('useFollows', () => {
  it('passes on Twitch and Kick follows from the Senchabot connection, and no YouTube ones', () => {
    const follows: Follow[] = [];
    const view = renderHook(() => useFollows('abc123', 'streamer', true, (f) => follows.push(f)));
    expect(senchabot()).toHaveLength(1);
    const url = new URL(senchabot()[0].url);
    expect(url.searchParams.get('token')).toBe('abc123');
    expect(url.searchParams.get('channel')).toBe('streamer');

    follow('NewFan', 'twitch');
    follow('KickFan', 'kick');
    follow('TubeFan', 'youtube');
    expect(follows).toEqual([
      { kind: 'follow', platform: 'twitch', name: 'NewFan' },
      { kind: 'follow', platform: 'kick', name: 'KickFan' },
    ]);

    view.unmount();
    expect(senchabot()[0].readyState).toBe(FakeWebSocket.CLOSED);
  });

  it('connects to nothing without a token, or while switched off', () => {
    const onFollow = vi.fn();
    renderHook(() => useFollows('', 'streamer', true, onFollow));
    renderHook(() => useFollows('abc123', 'streamer', false, onFollow));
    expect(senchabot()).toHaveLength(0);
  });
});
