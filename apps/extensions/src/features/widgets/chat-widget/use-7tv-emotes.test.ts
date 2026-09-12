import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetch7tvEmotes } from './use-7tv-emotes';

const respond = (routes: Record<string, { status?: number; body?: unknown }>) => {
  const fetchMock = vi.fn(async (url: string) => {
    const route = Object.entries(routes).find(([prefix]) => url.startsWith(prefix))?.[1];
    if (!route) {
      return new Response('{}', { status: 404 });
    }
    return new Response(JSON.stringify(route.body ?? {}), { status: route.status ?? 200 });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetch7tvEmotes', () => {
  it("reads the active emote set of the channel's own 7TV account", async () => {
    const fetchMock = respond({
      'https://api.ivr.fi/v2/twitch/user?login=channel': { body: [{ id: '123', login: 'channel' }] },
      'https://7tv.io/v3/users/twitch/123': {
        body: {
          emote_set: {
            emotes: [
              { id: 'e1', name: 'catJAM' },
              { id: 'e2', name: '', data: { name: 'peepoHappy' } },
            ],
          },
        },
      },
    });

    const map = await fetch7tvEmotes(' Channel ');
    expect([...map]).toEqual([
      ['catJAM', 'e1'],
      ['peepoHappy', 'e2'],
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('returns no emotes when the channel has no 7TV account', async () => {
    respond({
      'https://api.ivr.fi/v2/twitch/user?login=channel': { body: [{ id: '123' }] },
      'https://7tv.io/v3/users/twitch/123': { status: 404, body: { error: 'user not found' } },
    });
    expect((await fetch7tvEmotes('channel')).size).toBe(0);
  });

  it('returns no emotes when the Twitch channel does not exist', async () => {
    const fetchMock = respond({ 'https://api.ivr.fi/v2/twitch/user?login=nobody': { body: [] } });
    expect((await fetch7tvEmotes('nobody')).size).toBe(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
