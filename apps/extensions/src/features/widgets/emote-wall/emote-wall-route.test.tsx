import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute } from '#/test/render';

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const emotes = () => document.querySelectorAll('img');

describe('/widgets/emote-wall', () => {
  it.each([
    'mock=true&size=abc&duration=-5&max=1e9&mode=zoom&sevenTv=nope',
    'mock=true&size=&duration=&max=&mode=&subsOnly=&hypeMode=null&spamBlock=0',
    'mock=true&size=[1]&duration={}&max=%22x%22&mode=123&twitch=',
    'mock=1&size=Infinity&duration=NaN&max=-Infinity',
  ])('still plays its demo with garbage params: %s', async (query) => {
    await renderRoute(`/widgets/emote-wall?${query}`);
    await act(async () => vi.advanceTimersByTime(3000));
    expect(emotes().length).toBeGreaterThan(0);
    for (const img of emotes()) {
      const size = Number.parseFloat(img.style.width);
      expect(size).toBeGreaterThanOrEqual(32 * 0.8 - 1);
      expect(size).toBeLessThanOrEqual(256 * 1.3 + 1);
    }
  });

  it('keeps a digits-only channel name as text', async () => {
    await renderRoute('/widgets/emote-wall?twitch=123456');
    const { FakeWebSocket } = await import('#/test/browser');
    expect(FakeWebSocket.instances.some((ws) => ws.url.includes('twitch'))).toBe(true);
    expect(emotes()).toHaveLength(0);
  });
});
