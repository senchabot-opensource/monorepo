import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_POLL_SETTINGS, type PollSettings } from '#/lib/poll-url';
import { FakeWebSocket } from '#/test/browser';
import { renderWithProviders } from '#/test/render';
import { PollWidget } from './poll-widget';
import { storageKey } from './use-poll';

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock('#/lib/kick', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/lib/kick')>()),
  getKickChannelInfo: kickLookup,
}));

const KICK_42 = { chatroomId: '42', channelId: '7', userId: null, subscriberBadges: [] };

// The newest one: an unanswered connect or heartbeat makes the client swap in a new socket.
const socket = (host: string) => {
  const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes(host));
  if (!found) throw new Error(`no ${host} socket`);
  return found;
};
const receive = (host: string, data: string) => act(() => socket(host).receive(data));
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));
// Votes are drawn in batches, so let one go by.
const settle = () => wait(200);
// The widget needs the locale provider for its words.
const render = (ui: React.ReactNode) => renderWithProviders(ui, '/widgets/poll');
const card = () => screen.queryByTestId('poll-card');
const shown = () => card()?.textContent ?? '';
const phase = () => screen.getByTestId('poll').dataset.phase;

const { platforms: _, ...DEFAULTS } = DEFAULT_POLL_SETTINGS;
const settings = (overrides: Partial<PollSettings> = {}) => ({ ...DEFAULTS, ...overrides });

const say = (login: string, text: string, badges = '') =>
  receive(
    'twitch',
    `@badges=${badges};display-name=${login};room-id=1 :${login}!${login}@${login}.tmi.twitch.tv PRIVMSG #streamer :${text}`,
  );
const mod = (text: string) => say('mod', text, 'moderator/1');

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(KICK_42);
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('PollWidget', () => {
  it('shows nothing until a mod puts a poll up, then counts one vote per viewer', async () => {
    await render(<PollWidget twitchChannel="streamer" settings={settings()} />);
    act(() => socket('twitch').open());
    say('viewer', '!poll Best map? | Dust | Mirage');
    expect(card()).toBeNull();

    mod('!poll Best map? | Dust | Mirage | Inferno');
    expect(shown()).toContain('Best map?');
    expect(shown()).toContain('Type 1 to 3 in chat');
    say('a', '1');
    say('b', '2');
    say('c', 'mirage');
    say('c', '2');
    say('d', '4Head');
    await settle();
    expect(shown()).toContain('3 votes');
    expect(shown()).toMatch(/Dust1\s*33%/);
    expect(shown()).toMatch(/Mirage2\s*67%/);
  });

  it('lets viewers change their vote only when that is on', async () => {
    const { unmount } = await render(
      <PollWidget twitchChannel="streamer" settings={settings({ change: false })} />,
    );
    mod('!poll Q | A | B');
    say('a', '1');
    say('a', '2');
    await settle();
    expect(shown()).toMatch(/A1\s*100%/);
    unmount();
    localStorage.clear();

    await render(<PollWidget twitchChannel="streamer" settings={settings()} />);
    mod('!poll Q | A | B');
    say('a', '1');
    say('a', '2');
    // A typo keeps the vote the viewer had.
    say('a', '3');
    await settle();
    expect(shown()).toMatch(/B1\s*100%/);
  });

  it('takes late votes after the timer, then shows the winner and leaves', async () => {
    await render(
      <PollWidget
        twitchChannel="streamer"
        settings={settings({ duration: 60, delay: 5, hold: 30 })}
      />,
    );
    mod('!poll Q | A | B');
    expect(shown()).toContain('1:00');
    say('a', '1');
    await wait(60_000);
    expect(phase()).toBe('closing');
    expect(shown()).toContain('Last votes');
    say('b', '2');
    say('c', '2');
    await wait(5000);
    expect(phase()).toBe('results');
    expect(shown()).toContain('Winner: B');
    say('d', '1');
    await settle();
    expect(shown()).toContain('3 votes');
    await wait(30_000);
    expect(phase()).toBe('none');
    await wait(1000);
    expect(card()).toBeNull();
  });

  it('calls a tie a tie, and a poll without votes has no winner', async () => {
    await render(<PollWidget twitchChannel="streamer" settings={settings({ delay: 0 })} />);
    mod('!poll Q | A | B');
    say('a', '1');
    say('b', '2');
    mod('!poll end');
    await settle();
    expect(shown()).toContain("It's a tie!");
    mod('!poll Next? | C | D');
    mod('!poll end');
    expect(shown()).toContain('No votes');
  });

  it('runs a poll without a timer until a mod ends it, and extends a timed one', async () => {
    await render(<PollWidget twitchChannel="streamer" settings={settings({ duration: 0 })} />);
    mod('!poll Q | A | B');
    // Shorter than the chat heartbeat, which would swap the fake socket out.
    await wait(20_000);
    expect(phase()).toBe('open');
    expect(shown()).not.toMatch(/\d:\d\d/);
    mod('!poll 30s Q2 | A | B');
    mod('!poll extend 1m');
    expect(shown()).toContain('1:30');
    mod('!poll cancel');
    expect(phase()).toBe('none');
  });

  it('starts the ready-made poll, and makes yes/no polls from a question', async () => {
    await render(
      <PollWidget
        twitchChannel="streamer"
        settings={settings({ question: 'Next game?', options: ['Minecraft', 'Valorant'] })}
      />,
    );
    mod('!poll start');
    expect(shown()).toContain('Next game?');
    expect(shown()).toContain('Valorant');
    expect(shown()).toContain('Type 1 or 2 in chat');
    mod('!poll Ranked tonight?');
    expect(shown()).toContain('Ranked tonight?');
    expect(shown()).toMatch(/Yes.*No/);
  });

  it('takes a timed out viewer’s vote off', async () => {
    await render(<PollWidget twitchChannel="streamer" settings={settings()} />);
    mod('!poll Q | A | B');
    say('spammer', '1');
    say('b', '2');
    receive('twitch', '@room-id=1 :tmi.twitch.tv CLEARCHAT #streamer :spammer');
    await settle();
    expect(shown()).toContain('1 vote');
    expect(shown()).toMatch(/B1\s*100%/);
  });

  it('keeps subs-only polls to subs, and weights sub votes', async () => {
    const { unmount } = await render(
      <PollWidget twitchChannel="streamer" settings={settings({ subsOnly: true })} />,
    );
    mod('!poll Q | A | B');
    say('viewer', '1');
    say('sub', '2', 'subscriber/3');
    await settle();
    expect(shown()).toContain('Subs only');
    expect(shown()).toMatch(/B1\s*100%/);
    unmount();
    localStorage.clear();

    await render(<PollWidget twitchChannel="streamer" settings={settings({ subWeight: 2 })} />);
    mod('!poll Q | A | B');
    say('viewer', '1');
    say('sub', '2', 'subscriber/3');
    await settle();
    expect(shown()).toContain('Sub votes ×2');
    expect(shown()).toMatch(/A1\s*33%/);
    expect(shown()).toMatch(/B2\s*67%/);
  });

  it("counts a sub once in a subs-only poll, whatever weight the URL kept", async () => {
    await render(
      <PollWidget twitchChannel="streamer" settings={settings({ subsOnly: true, subWeight: 3 })} />,
    );
    mod('!poll Q | A | B');
    say('sub', '2', 'subscriber/3');
    await settle();
    expect(shown()).toMatch(/B1\s*100%/);
    expect(shown()).not.toContain('×3');
  });

  it('hides the bars until the end when asked', async () => {
    await render(
      <PollWidget twitchChannel="streamer" settings={settings({ blind: true, delay: 0 })} />,
    );
    mod('!poll Q | A | B');
    say('a', '2');
    await settle();
    expect(shown()).toContain('Results show when voting ends');
    expect(shown()).toContain('1 vote');
    expect(shown()).not.toContain('%');
    // No row flashes either, or chat would see where each vote went.
    expect(card()?.querySelector('[style*="cp-flash"]')).toBeNull();
    mod('!poll end');
    expect(shown()).toMatch(/B1\s*100%/);
  });

  it('saves the last votes when OBS closes the page', async () => {
    await render(<PollWidget twitchChannel="streamer" settings={settings()} />);
    mod('!poll Q | A | B');
    await wait(2000);
    say('a', '2');
    // Closing OBS unloads the page without unmounting React.
    act(() => window.dispatchEvent(new Event('pagehide')));
    expect(JSON.parse(localStorage.getItem(storageKey('streamer')) ?? 'null')).toMatchObject({
      votes: [['twitch:a', 1, 1]],
    });
  });

  it('keeps the poll and its votes through a reload', async () => {
    const { unmount } = await render(<PollWidget twitchChannel="streamer" settings={settings()} />);
    mod('!poll Q | A | B');
    say('a', '2');
    await settle();
    unmount();
    expect(JSON.parse(localStorage.getItem(storageKey('streamer')) ?? 'null')).toMatchObject({
      question: 'Q',
      votes: [['twitch:a', 1, 1]],
    });

    await render(<PollWidget twitchChannel="streamer" settings={settings()} />);
    expect(shown()).toMatch(/B1\s*100%/);
  });

  it('puts Twitch and Kick votes into one poll and shows each side', async () => {
    await render(
      <PollWidget twitchChannel="streamer" kickChannel="kicker" settings={settings()} />,
    );
    await act(async () => {});
    act(() => socket('pusher').open());
    mod('!poll Q | A | B');
    say('same_name', '1');
    const kick = (username: string, content: string) =>
      receive(
        'pusher',
        JSON.stringify({
          event: 'App\\Events\\ChatMessageEvent',
          channel: 'chatrooms.42.v2',
          data: JSON.stringify({
            content,
            type: 'message',
            sender: { username, identity: { badges: [] } },
          }),
        }),
      );
    kick('same_name', '2');
    kick('other', '!vote 2');
    await settle();
    expect(shown()).toContain('3 votes');
    expect(shown()).toMatch(/B2\s*67%/);
    // Twitch 1, Kick 2 beside the total.
    expect(shown()).toMatch(/123 votes$/);
  });
});
