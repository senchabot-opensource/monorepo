import { act, cleanup, screen, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeWebSocket } from '#/test/browser';
import {
  button,
  combobox,
  en,
  inLocale,
  retype,
  section,
  segment,
  textbox,
  toggle,
} from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

// Confetti draws on a canvas, which jsdom doesn't have.
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const CHANNEL = 'senchabot-raffle-broadcast';

/** Same-browser BroadcastChannel: a message reaches every other instance with the same name. */
class FakeBroadcastChannel extends EventTarget {
  static open: FakeBroadcastChannel[] = [];
  static posted: { name: string; message: unknown }[] = [];

  constructor(readonly name: string) {
    super();
    FakeBroadcastChannel.open.push(this);
  }

  postMessage(message: unknown) {
    FakeBroadcastChannel.posted.push({ name: this.name, message });
    for (const other of FakeBroadcastChannel.open) {
      if (other !== this && other.name === this.name) {
        other.dispatchEvent(new MessageEvent('message', { data: message }));
      }
    }
  }

  close() {
    FakeBroadcastChannel.open = FakeBroadcastChannel.open.filter((c) => c !== this);
  }
}

beforeEach(() => {
  FakeBroadcastChannel.open = [];
  FakeBroadcastChannel.posted = [];
  vi.stubGlobal('BroadcastChannel', FakeBroadcastChannel);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function twitchChat() {
  const socket = FakeWebSocket.instances.find((ws) =>
    ws.url.startsWith('wss://irc-ws.chat.twitch'),
  );
  if (!socket) throw new Error('The raffle never connected to Twitch chat');
  return socket;
}

/** One Twitch IRC chat line from `login`, with optional badge tags. */
function say(login: string, text: string, tags: { badges?: string; badgeInfo?: string } = {}) {
  const display = login[0].toUpperCase() + login.slice(1);
  const line =
    `@badge-info=${tags.badgeInfo ?? ''};badges=${tags.badges ?? ''};display-name=${display}` +
    ` :${login}!${login}@${login}.tmi.twitch.tv PRIVMSG #streamer :${text}`;
  act(() => twitchChat().receive(`${line}\r\n`));
}

/** The entry list, whatever its "Entries (n)" heading counts. */
function entries(t = en) {
  const prefix = t('raffle.participants', { count: 0 }).replace('(0)', '');
  const heading = screen.getByText((text) => text.startsWith(prefix), { selector: 'h3' });
  return heading.closest('section') as HTMLElement;
}
const entryNames = (t = en) =>
  [...entries(t).querySelectorAll('li')].map((item) => item.querySelector('span')?.textContent);
const drawButton = () => screen.getByText(/^Draw /, { selector: 'button' }) as HTMLButtonElement;

async function startRaffle(user: UserEvent) {
  await user.click(button(en('raffle.startRaffle')));
  act(() => twitchChat().open());
}

describe('Raffle setup rules', () => {
  it('needs a channel and a keyword before it can start', async () => {
    const user = setupUser();
    await renderRoute('/setup/raffle');
    const start = button(en('raffle.startRaffle'));
    expect(start.disabled).toBe(true);
    expect(screen.getByText(en('raffle.statusNeedsSetup'))).toBeTruthy();

    await user.type(textbox(en('raffle.channelName')), 'streamer');
    expect(start.disabled).toBe(false);
    expect(screen.getByText(en('raffle.statusIdle'))).toBeTruthy();

    await retype(user, textbox(en('raffle.entryKeyword')), '');
    expect(start.disabled).toBe(true);
    await user.type(textbox(en('raffle.entryKeyword')), '!ticket');
    expect(start.disabled).toBe(false);
  });

  it('only enables the minimum sub months for a subscribers-only raffle', async () => {
    const user = setupUser();
    await renderRoute('/setup/raffle');
    const months = textbox(en('raffle.minSubMonths'));
    expect(months.disabled).toBe(true);
    await user.click(toggle(en('raffle.subscribersOnly')));
    expect(months.disabled).toBe(false);
    await user.click(toggle(en('raffle.subscribersOnly')));
    expect(months.disabled).toBe(true);
  });

  it('starts with the channel from the link', async () => {
    await renderRoute('/setup/raffle?channel=kicker&platform=kick');
    expect(textbox(en('raffle.channelName')).value).toBe('kicker');
    expect(segment(en('raffle.platform'), 'Kick').checked).toBe(true);
  });

  it('points the overlay URL at the winner overlay', async () => {
    await renderRoute('/setup/raffle');
    expect(textbox(en('raffle.overlayUrl')).value).toBe(
      'http://localhost:3000/widgets/raffle-overlay',
    );
  });
});

describe('Raffle flow', () => {
  it('collects entries from chat, skipping bots and other messages, and locks the rules', async () => {
    const user = setupUser();
    await renderRoute('/setup/raffle');
    await user.type(textbox(en('raffle.channelName')), 'Streamer');
    await startRaffle(user);

    expect(twitchChat().sent).toContain('JOIN #streamer');
    expect(screen.getByText(en('raffle.statusRunning', { keyword: '!join' }))).toBeTruthy();
    expect(screen.getByText(en('raffle.lockedTitle'))).toBeTruthy();
    expect(textbox(en('raffle.channelName')).disabled).toBe(true);
    expect(textbox(en('raffle.entryKeyword')).disabled).toBe(true);
    expect(segment(en('raffle.platform'), 'Kick').matches(':disabled')).toBe(true);
    expect(combobox(en('raffle.maxWinsPerUser')).disabled).toBe(true);
    expect(button(en('raffle.startRaffle')).disabled).toBe(true);

    say('alice', '!join');
    say('nightbot', '!join');
    say('bob', 'hello chat');
    say('carol', '!JOIN me please');
    say('alice', '!join');
    say('streamelements', '!join');

    expect(entryNames()).toEqual(['Alice', 'Carol']);
    expect(
      screen.getByText(en('raffle.participants', { count: 2 }), { selector: 'h3' }),
    ).toBeTruthy();

    await user.click(button(en('raffle.disqualify', { name: 'Carol' })));
    expect(entryNames()).toEqual(['Alice']);
  });

  it('keeps out non-subscribers and subscribers below the minimum months', async () => {
    const user = setupUser();
    await renderRoute('/setup/raffle');
    await user.type(textbox(en('raffle.channelName')), 'streamer');
    await user.click(toggle(en('raffle.subscribersOnly')));
    await retype(user, textbox(en('raffle.minSubMonths')), '3');
    await startRaffle(user);

    say('viewer', '!join');
    say('subby', '!join', { badgeInfo: 'subscriber/5', badges: 'subscriber/3' });
    say('newbie', '!join', { badgeInfo: 'subscriber/2', badges: 'subscriber/0' });
    say('founder', '!join', { badgeInfo: 'founder/8', badges: 'founder/0' });
    say('streamer', '!join', { badges: 'broadcaster/1' });

    expect(entryNames()).toEqual(['Subby', 'Founder']);
    expect(within(entries()).getByText(en('raffle.subMonthsShort', { months: 5 }))).toBeTruthy();
  });

  it('reads Kick chat through the channel chatroom', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) =>
      String(input) === 'https://kick.com/api/v1/channels/kicker'
        ? Response.json({ chatroom: { id: 42 } })
        : new Response('{}', { status: 404 }),
    );
    const user = setupUser();
    await renderRoute('/setup/raffle');
    await user.click(segment(en('raffle.platform'), 'Kick'));
    await user.type(textbox(en('raffle.channelName')), 'kicker');
    await user.click(button(en('raffle.startRaffle')));

    const pusher = await vi.waitFor(() => {
      const socket = FakeWebSocket.instances.find((ws) => ws.url.includes('pusher.com'));
      if (!socket) throw new Error('Not connected to Kick yet');
      return socket;
    });
    act(() => pusher.open());
    expect(JSON.parse(pusher.sent[0])).toEqual({
      event: 'pusher:subscribe',
      data: { channel: 'chatrooms.42.v2' },
    });

    const kickSay = (username: string, content: string, badges: object[] = []) =>
      act(() =>
        pusher.receive(
          JSON.stringify({
            event: 'App\\Events\\ChatMessageEvent',
            data: JSON.stringify({ sender: { username, identity: { badges } }, content }),
          }),
        ),
      );
    kickSay('KickFan', '!join', [{ type: 'subscriber', count: 4 }]);
    kickSay('BotRix', '!join');
    kickSay('Lurker', 'hi');

    expect(entryNames()).toEqual(['KickFan']);
    expect(within(entries()).getByText(en('raffle.subMonthsShort', { months: 4 }))).toBeTruthy();
  });

  it('locks Draw until the minimum duration, then draws a winner and sends it to the overlay', async () => {
    await renderRoute('/setup/raffle');
    vi.useFakeTimers();
    const user = setupUser({ advanceTimers: vi.advanceTimersByTime });
    await user.type(textbox(en('raffle.channelName')), 'streamer');
    await startRaffle(user);
    say('alice', '!join');
    say('bob', '!join');

    expect(drawButton().disabled).toBe(true);
    expect(drawButton().textContent).toBe(en('raffle.drawLocked', { seconds: 15 }));
    act(() => vi.advanceTimersByTime(10_000));
    expect(drawButton().textContent).toBe(en('raffle.drawLocked', { seconds: 5 }));
    act(() => vi.advanceTimersByTime(5_000));
    expect(drawButton().disabled).toBe(false);
    expect(drawButton().textContent).toBe(en('raffle.drawWinner', { count: 2 }));

    // The draw uses crypto randomness; pin it to the second entry.
    vi.spyOn(crypto, 'getRandomValues').mockImplementation((array) => {
      (array as Uint32Array)[0] = 0x8000_0000;
      return array;
    });
    await user.click(drawButton());

    expect(entryNames()).toEqual(['Alice']);
    const winners = section(en('raffle.winners', { count: 1 }));
    expect(within(winners).getByText('Bob')).toBeTruthy();
    expect(screen.getByText(en('raffle.lastWinner')).parentElement?.textContent).toContain('Bob');
    expect(drawButton().textContent).toBe(en('raffle.drawWinner', { count: 1 }));

    expect(FakeBroadcastChannel.posted).toHaveLength(1);
    const { name, message } = FakeBroadcastChannel.posted[0];
    expect(name).toBe(CHANNEL);
    expect(message).toEqual({
      type: 'raffle:winner',
      winner: {
        id: 'twitch-bob',
        username: 'bob',
        displayName: 'Bob',
        platform: 'twitch',
        subMonths: -1,
        timestamp: expect.any(Number),
        drawnAt: Date.now(),
      },
    });

    // A winner can't enter again with Max Wins Per Viewer at 1.
    say('bob', '!join');
    expect(entryNames()).toEqual(['Alice']);

    // The overlay, open in the same browser, shows exactly what was sent.
    vi.useRealTimers();
    cleanup();
    await renderRoute('/widgets/raffle-overlay');
    act(() => new FakeBroadcastChannel(CHANNEL).postMessage(message));
    expect(screen.getByText('Bob')).toBeTruthy();
    expect(screen.getByText(en('raffle.winner'))).toBeTruthy();
  });

  it('asks before clearing, in the page language', async () => {
    const t = inLocale('tr');
    const user = setupUser();
    await renderRoute('/tr/setup/raffle');
    await user.type(textbox(t('raffle.channelName')), 'streamer');
    await user.click(button(t('raffle.startRaffle')));
    act(() => twitchChat().open());
    say('alice', '!join');

    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    await user.click(button(t('raffle.resetEntries')));
    expect(confirm).toHaveBeenLastCalledWith(t('raffle.confirmResetEntries'));
    expect(t('raffle.confirmResetEntries')).not.toBe(en('raffle.confirmResetEntries'));
    expect(entryNames(t)).toEqual(['Alice']);

    // Starting over would drop the entries, so it asks first too.
    await user.click(button(t('raffle.stopRaffle')));
    await user.click(button(t('raffle.startRaffle')));
    expect(confirm).toHaveBeenLastCalledWith(t('raffle.confirmStart'));
    expect(screen.getByText(t('raffle.statusStopped'))).toBeTruthy();
    expect(entryNames(t)).toEqual(['Alice']);

    confirm.mockReturnValue(true);
    await user.click(button(t('raffle.resetAll')));
    expect(confirm).toHaveBeenLastCalledWith(t('raffle.confirmResetAll'));
    expect(t('raffle.confirmResetAll')).not.toBe(en('raffle.confirmResetAll'));
    expect(screen.getByText(t('raffle.statusIdle'))).toBeTruthy();
    expect(screen.queryByText(t('raffle.lockedTitle'))).toBeNull();
    expect(textbox(t('raffle.channelName')).disabled).toBe(false);
    expect(screen.getByText(t('raffle.noParticipants', { keyword: '!join' }))).toBeTruthy();
  });
});
