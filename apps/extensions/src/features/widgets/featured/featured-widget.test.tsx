import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_FEATURED_SETTINGS, type FeaturedSettings } from '#/lib/featured-url';
import { FakeWebSocket } from '#/test/browser';
import { renderWithProviders } from '#/test/render';
import { getAccessibleColor } from '../chat-widget/color-utils';
import { storageKey } from './featured-state';
import { FeaturedWidget } from './featured-widget';
import { PREVIEW_CHANNEL } from './use-featured';

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock('#/lib/kick', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/lib/kick')>()),
  getKickChannelInfo: kickLookup,
}));

const KICK_42 = { chatroomId: '42', channelId: '7', userId: '99', subscriberBadges: [] };

const socket = (host: string) => {
  const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes(host));
  if (!found) throw new Error(`no ${host} socket`);
  return found;
};

let ids = 0;
/** A Twitch chat line; `tags` adds to the default ones, e.g. ";color=#FF0000". */
const say = (name: string, text: string, tags = '') => {
  ids++;
  act(() =>
    socket('twitch').receive(
      `@badges=;display-name=${name};id=t${ids};room-id=1${tags} :${name.toLowerCase()}!x@x.tmi.twitch.tv PRIVMSG #streamer :${text}`,
    ),
  );
};
const modSays = (text: string) => say('Mod', text, ';badges=moderator/1;mod=1');
const twitchLine = (line: string) => act(() => socket('twitch').receive(line));

const kickEvent = (event: string, data: Record<string, unknown>) =>
  act(() =>
    socket('pusher').receive(
      JSON.stringify({ event, channel: 'chatrooms.42.v2', data: JSON.stringify(data) }),
    ),
  );
const kickSay = (name: string, content: string, identity: Record<string, unknown> = {}) => {
  ids++;
  kickEvent('App\\Events\\ChatMessageEvent', {
    id: `k${ids}`,
    type: 'message',
    content,
    sender: { username: name, identity: { badges: [], ...identity } },
  });
};

const card = () => screen.queryByTestId('featured-card');
const shownText = () => screen.getByTestId('featured-text').textContent;
const waitingText = () => screen.queryByTestId('featured-waiting')?.textContent ?? null;

const { platforms: _, ...DEFAULTS } = DEFAULT_FEATURED_SETTINGS;
const settings = (overrides: Partial<Omit<FeaturedSettings, 'platforms'>> = {}) => ({
  ...DEFAULTS,
  ...overrides,
});
const render = (ui: React.ReactNode) => renderWithProviders(ui, '/widgets/featured');

async function openTwitch(overrides: Partial<Omit<FeaturedSettings, 'platforms'>> = {}) {
  const result = await render(
    <FeaturedWidget twitchChannel="streamer" settings={settings(overrides)} />,
  );
  act(() => socket('twitch').open());
  return result;
}

async function openBoth() {
  await render(
    <FeaturedWidget twitchChannel="streamer" kickChannel="kicker" settings={settings()} />,
  );
  await act(async () => {});
  act(() => socket('twitch').open());
  act(() => socket('pusher').open());
}

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

describe('FeaturedWidget', () => {
  it('shows nothing until a mod features a message, then draws it like chat', async () => {
    await openTwitch();
    say('Alpha', 'hi Kappa there', ';badges=subscriber/12;color=#FF0000;emotes=25:3-7');
    expect(card()).toBeNull();
    say('Alpha', '!feature @alpha');
    expect(card()).toBeNull();

    modSays('!feature @Alpha');
    expect(card()?.dataset).toMatchObject({ kind: 'feature', platform: 'twitch' });
    expect(screen.queryByTestId('featured-label')).toBeNull();
    const name = screen.getByTestId('featured-name');
    expect(name.textContent).toBe('Alpha');
    expect(name.style.color).toBe(getAccessibleColor('#FF0000', true));
    expect(shownText()).toBe('hi  there');
    // Twitch emotes come sharp, at 3x.
    expect(card()?.querySelector('img[src$="/emoticons/v2/25/default/dark/3.0"]')).not.toBeNull();
    expect(card()?.querySelector('img[alt="subscriber/12"]')).not.toBeNull();
  });

  it('takes the message down on !feature, after its fade', async () => {
    await openTwitch();
    say('Alpha', 'hello');
    modSays('!feature alpha');
    modSays('!feature');
    expect(card()?.dataset.leaving).toBe('true');
    act(() => vi.advanceTimersByTime(400));
    expect(card()).toBeNull();
  });

  it('hides a message by itself after the hide timer', async () => {
    await openTwitch({ hide: 5 });
    say('Alpha', 'hello');
    modSays('!feature @alpha');
    act(() => vi.advanceTimersByTime(4900));
    expect(card()?.dataset.leaving).toBe('false');
    act(() => vi.advanceTimersByTime(500));
    expect(card()?.dataset.leaving).toBe('true');
    act(() => vi.advanceTimersByTime(400));
    expect(card()).toBeNull();
  });

  it('features a Kick viewer from Twitch, with Kick emotes and the newest of a shared name', async () => {
    await openBoth();
    say('Same', 'on twitch first');
    kickSay('Same', 'then kick [emote:37227:LULW]', {
      color: '#00FF00',
      badges: [{ type: 'subscriber', count: 3 }],
    });
    modSays('!feature @same');
    expect(card()?.dataset.platform).toBe('kick');
    expect(shownText()).toBe('then kick ');
    expect(
      card()?.querySelector('img[src="https://files.kick.com/emotes/37227/fullsize"]'),
    ).not.toBeNull();
    expect(screen.getByTestId('featured-name').style.color).toBe(
      getAccessibleColor('#00FF00', true),
    );
  });

  it('takes a featured message down when it is deleted or its viewer is banned', async () => {
    await openBoth();
    say('Alpha', 'oops');
    modSays('!feature @alpha');
    twitchLine(`@login=alpha;target-msg-id=t${ids - 1} :tmi.twitch.tv CLEARMSG #streamer :oops`);
    expect(card()?.dataset.leaving).toBe('true');

    kickSay('KickFan', 'hello');
    act(() => vi.advanceTimersByTime(400));
    modSays('!feature @kickfan');
    expect(card()?.dataset.leaving).toBe('false');
    kickEvent('App\\Events\\UserBannedEvent', { user: { username: 'KickFan' }, permanent: false });
    expect(card()?.dataset.leaving).toBe('true');
  });

  it('runs a Q&A: questions wait, a mod shows the next one with its label', async () => {
    await openTwitch();
    say('Alpha', '!q what game is next?');
    expect(card()).toBeNull();
    expect(waitingText()).toBe('1 question waiting');
    say('Beta', '!q coffee or tea?');
    expect(waitingText()).toBe('2 questions waiting');

    modSays('!q next');
    expect(card()?.dataset.kind).toBe('question');
    expect(screen.getByTestId('featured-label').textContent).toBe('Question');
    expect(screen.getByTestId('featured-name').textContent).toBe('Alpha');
    expect(shownText()).toBe('what game is next?');
    expect(waitingText()).toBe('1 question waiting');
    modSays('!q skip');
    expect(waitingText()).toBeNull();
    modSays('!q off');
    expect(card()?.dataset.leaving).toBe('true');
  });

  it('turns the waiting badge off with waiting=0, and !feature off in Q&A mode', async () => {
    await openTwitch({ mode: 'qa', waiting: false });
    say('Alpha', 'hello');
    say('Beta', '!q one');
    modSays('!feature @alpha');
    expect(card()).toBeNull();
    expect(waitingText()).toBeNull();
    modSays('!q next');
    expect(shownText()).toBe('one');
  });

  it('turns !q off in feature mode', async () => {
    await openTwitch({ mode: 'feature' });
    say('Alpha', '!q one');
    modSays('!q next');
    expect(waitingText()).toBeNull();
    expect(card()).toBeNull();
  });

  it('shows 7TV emotes from the channel', async () => {
    vi.mocked(fetch).mockImplementation(async (url) => {
      const href = String(url);
      if (href.startsWith('https://api.ivr.fi/v2/twitch/user')) {
        return new Response(JSON.stringify([{ id: '5' }]));
      }
      if (href === 'https://7tv.io/v3/users/twitch/5') {
        return new Response(
          JSON.stringify({ emote_set: { emotes: [{ id: 'cat', name: 'catJAM' }] } }),
        );
      }
      return new Response('{}', { status: 503 });
    });
    await openTwitch();
    await vi.waitFor(async () => {
      await act(async () => {});
      say('Alpha', 'vibing catJAM');
      modSays('!feature @alpha');
      expect(
        card()?.querySelector('img[src="https://cdn.7tv.app/emote/cat/2x.webp"]'),
      ).not.toBeNull();
    });
  });

  it('keeps the questions and what is up through a reload', async () => {
    const first = await openTwitch();
    say('Alpha', '!q one');
    say('Beta', '!q two');
    modSays('!q next');
    first.unmount();
    expect(
      JSON.parse(localStorage.getItem(storageKey('streamer', '')) ?? 'null').questions,
    ).toHaveLength(1);
    await render(<FeaturedWidget twitchChannel="streamer" settings={settings()} />);
    expect(shownText()).toBe('one');
    expect(waitingText()).toBe('1 question waiting');
  });

  it('plays a preview with no channel, and its setup page’s test commands', async () => {
    await render(<FeaturedWidget settings={settings()} simulate previewId="p1" />);
    expect(FakeWebSocket.instances).toHaveLength(0);
    expect(card()?.dataset.kind).toBe('feature');
    expect(waitingText()).toBe('3 questions waiting');
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.postMessage({ type: 'chat', preview: 'p1', text: '!q next', mod: true, name: 'Mod' });
    await vi.waitFor(() => expect(card()?.dataset.kind).toBe('question'));
    channel.postMessage({
      type: 'chat',
      preview: 'p1',
      text: 'test line',
      mod: false,
      name: 'You',
    });
    channel.postMessage({
      type: 'chat',
      preview: 'p1',
      text: '!feature @You',
      mod: true,
      name: 'Mod',
    });
    await vi.waitFor(() => expect(shownText()).toBe('test line'));
    channel.close();
  });

  it('plays only one platform’s chatters when the preview picks one', async () => {
    await render(
      <FeaturedWidget settings={settings({ mode: 'feature' })} simulate simPlatform="kick" />,
    );
    expect(card()?.dataset.platform).toBe('kick');
    for (let step = 0; step < 6; step++) {
      act(() => vi.advanceTimersByTime(3500));
      expect(card()?.dataset.platform ?? 'kick').toBe('kick');
    }
  });
});
