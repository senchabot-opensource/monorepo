import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_EMOTE_COMBO_SETTINGS, type EmoteComboSettings } from '#/lib/emote-combo-url';
import { FakeWebSocket } from '#/test/browser';
import { renderWithProviders } from '#/test/render';
import { FINALE_MS, storageKey } from './emote-combo-state';
import { bigEmoteUrl, EmoteComboWidget } from './emote-combo-widget';
import { PREVIEW_CHANNEL, SIM_BEST_COUNT } from './use-emote-combo';

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock('#/lib/kick', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/lib/kick')>()),
  getKickChannelInfo: kickLookup,
}));

const KICK_42 = { chatroomId: '42', channelId: '7', userId: null, subscriberBadges: [] };

const socket = (host: string) => {
  const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes(host));
  if (!found) throw new Error(`no ${host} socket`);
  return found;
};
/** A Twitch message; `emotes` is the IRC tag, e.g. "25:0-4" for a Kappa at the start. */
const say = (login: string, text: string, { emotes = '', badges = '' } = {}) =>
  act(() =>
    socket('twitch').receive(
      `@badges=${badges};display-name=${login};emotes=${emotes};room-id=1 :${login.toLowerCase()}!x@x.tmi.twitch.tv PRIVMSG #streamer :${text}`,
    ),
  );
const kickSays = (username: string, content: string, badges: { type: string }[] = []) =>
  act(() =>
    socket('pusher').receive(
      JSON.stringify({
        event: 'App\\Events\\ChatMessageEvent',
        channel: 'chatrooms.42.v2',
        data: JSON.stringify({
          type: 'message',
          content,
          sender: { username, identity: { badges } },
        }),
      }),
    ),
  );
const kappa = (login: string) => say(login, 'Kappa', { emotes: '25:0-4' });

const combo = () => screen.queryByTestId('combo');
const count = () => screen.queryByTestId('combo-count')?.textContent;
const bestCount = () => screen.queryByTestId('combo-best-count')?.textContent;

const { platforms: _, ...DEFAULTS } = DEFAULT_EMOTE_COMBO_SETTINGS;
const settings = (overrides: Partial<Omit<EmoteComboSettings, 'platforms'>> = {}) => ({
  ...DEFAULTS,
  ...overrides,
});
const render = (ui: React.ReactNode) => renderWithProviders(ui, '/widgets/emote-combo');

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'debug').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(KICK_42);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('EmoteComboWidget', () => {
  it('shows a combo once enough chatters post the same emote, counting each once', async () => {
    await render(<EmoteComboWidget twitchChannel="streamer" settings={settings()} />);
    kappa('Ann');
    kappa('Ann');
    say('Nightbot', 'Kappa', { emotes: '25:0-4' });
    say('Bob', 'haha Kappa', { emotes: '25:5-9' });
    expect(combo()).toBeNull();
    kappa('Cem');
    expect(count()).toBe('×3');
    expect(screen.getByTestId('combo-emote').getAttribute('src')).toContain('/emoticons/v2/25/');
    expect(screen.getByTestId('combo-label').textContent).toBe('COMBO');
    kappa('Cem');
    kappa('Dee');
    expect(count()).toBe('×4');
  });

  it('counts Twitch and Kick chatters into one 7TV combo', async () => {
    globalThis.fetch = vi.fn(async (input: RequestInfo | URL) =>
      String(input).includes('7tv.io/v3/emote-sets/global')
        ? Response.json({ emotes: [{ id: 'pepe', name: 'PepePls' }] })
        : new Response('{}', { status: 404 }),
    ) as typeof fetch;
    await render(
      <EmoteComboWidget twitchChannel="streamer" kickChannel="kicker" settings={settings()} />,
    );
    await act(async () => {});
    await act(async () => {});
    act(() => socket('pusher').open());
    say('Ann', 'PepePls');
    kickSays('KickFan', 'PepePls PepePls');
    kickSays('Ann', 'so good PepePls');
    expect(count()).toBe('×3');
    expect(combo()?.dataset.emote).toBe('name:PepePls');
  });

  it('keeps Kick emotes apart by id', async () => {
    await render(<EmoteComboWidget kickChannel="kicker" settings={settings({ min: 2 })} />);
    await act(async () => {});
    act(() => socket('pusher').open());
    kickSays('a', '[emote:37226:KEKW]');
    kickSays('b', '[emote:39261:kkHuh]');
    expect(combo()).toBeNull();
    kickSays('c', '[emote:37226:KEKW] lol');
    expect(count()).toBe('×2');
    expect(combo()?.dataset.emote).toBe('kick:37226');
  });

  it('ends with the final count, keeps the best through a reload, and a mod resets it', async () => {
    const first = await render(<EmoteComboWidget twitchChannel="streamer" settings={settings()} />);
    for (const name of ['Ann', 'Bob', 'Cem', 'Dee']) kappa(name);
    expect(screen.getByTestId('combo-best').dataset.record).toBe('true');
    act(() => vi.advanceTimersByTime(8000));
    expect(combo()?.dataset.ended).toBe('true');
    expect(count()).toBe('×4');
    act(() => vi.advanceTimersByTime(FINALE_MS));
    expect(combo()).toBeNull();
    first.unmount();
    expect(JSON.parse(localStorage.getItem(storageKey('streamer')) ?? 'null').best.count).toBe(4);

    await render(<EmoteComboWidget twitchChannel="streamer" settings={settings()} />);
    for (const name of ['Eve', 'Fay', 'Gus']) kappa(name);
    expect(count()).toBe('×3');
    expect(bestCount()).toBe('×4');
    say('Viewer', '!combo reset');
    expect(bestCount()).toBe('×4');
    say('Mod', '!combo reset', { badges: 'moderator/1' });
    expect(screen.queryByTestId('combo-best')).toBeNull();
    kappa('Hal');
    expect(screen.getByTestId('combo-best').dataset.record).toBe('true');
  });

  it('hides the best combo with best=0 and takes a preset', async () => {
    await render(
      <EmoteComboWidget
        twitchChannel="streamer"
        settings={settings({ best: false, preset: 'rift' })}
      />,
    );
    for (const name of ['Ann', 'Bob', 'Cem']) kappa(name);
    expect(count()).toBe('×3');
    expect(screen.queryByTestId('combo-best')).toBeNull();
    expect(screen.getByTestId('emote-combo').dataset.preset).toBe('rift');
  });

  it('plays the preview without a channel, and its test buttons', async () => {
    await render(<EmoteComboWidget settings={settings()} simulate previewId="p1" />);
    expect(FakeWebSocket.instances).toHaveLength(0);
    expect(combo()).not.toBeNull();
    expect(bestCount()).toBe(`×${SIM_BEST_COUNT}`);
    const first = combo()?.dataset.emote;

    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    const send = (type: string) => channel.postMessage({ type, preview: 'p1' });
    send('start');
    await vi.waitFor(() => expect(combo()?.dataset.emote).not.toBe(first));
    expect(count()).toBe('×3');
    send('chatter');
    await vi.waitFor(() => expect(count()).toBe('×4'));
    send('reset');
    await vi.waitFor(() => expect(screen.queryByTestId('combo-best')).toBeNull());
    // The next chatter makes the combo on screen the new best.
    send('chatter');
    await vi.waitFor(() => expect(screen.getByTestId('combo-best').dataset.record).toBe('true'));
    channel.close();
  });

  it('keeps the preview going round after round', async () => {
    await render(<EmoteComboWidget settings={settings()} simulate />);
    const seen = new Set<string>();
    for (let i = 0; i < 120; i++) {
      act(() => vi.advanceTimersByTime(500));
      const emote = combo()?.dataset.emote;
      if (emote) seen.add(emote);
    }
    expect(seen.size).toBeGreaterThan(1);
  });
});

describe('bigEmoteUrl', () => {
  it('takes the large copy of 7TV and BTTV emotes and keeps every other URL', () => {
    expect(bigEmoteUrl('https://cdn.7tv.app/emote/01ABC/2x.webp')).toBe(
      'https://cdn.7tv.app/emote/01ABC/4x.webp',
    );
    expect(bigEmoteUrl('https://cdn.betterttv.net/emote/54fa/2x.webp')).toBe(
      'https://cdn.betterttv.net/emote/54fa/3x.webp',
    );
    for (const url of [
      'https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0',
      'https://files.kick.com/emotes/37226/fullsize',
      'https://cdn.frankerfacez.com/emote/9/2',
      'https://cdn.7tv.app/emote/01ABC/4x.webp',
    ]) {
      expect(bigEmoteUrl(url)).toBe(url);
    }
  });
});
