import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeWebSocket } from '#/test/browser';
import { button, en, inLocale, textbox } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const TOOL = '/tools/chat-reader';

beforeEach(() => {
  // Chat clients log their connection state, and lookups fail without a network.
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // Unmount while console is still muted: the chat client logs its disconnect.
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const twitchSocket = () => {
  const sockets = FakeWebSocket.instances.filter((ws) =>
    ws.url.startsWith('wss://irc-ws.chat.twitch'),
  );
  const socket = sockets[sockets.length - 1];
  if (!socket) throw new Error('The reader never connected to Twitch chat');
  return socket;
};

/** Lets queued rows reach the screen; the reader renders chat in 100ms batches. */
const flush = () => act(() => vi.advanceTimersByTime(150));

function say(name: string, text: string, id: string) {
  const login = name.toLowerCase();
  act(() =>
    twitchSocket().receive(
      `@display-name=${name};id=${id};tmi-sent-ts=${Date.now()} :${login}!${login}@${login}.tmi.twitch.tv PRIVMSG #streamer :${text}\r\n`,
    ),
  );
}

const log = () => screen.getByRole('log');

describe('Chat Reader', () => {
  it.each([
    'en',
    'tr',
  ] as const)('shows the chat, marks a drop in it and counts down to the next try (%s)', async (locale) => {
    const t = inLocale(locale);
    await renderRoute(`${TOOL}?twitch=streamer&lang=${locale}`);
    vi.useFakeTimers();
    expect(screen.getByText(t('chatReader.statusConnecting'))).toBeTruthy();

    act(() => twitchSocket().open());
    say('Viewer', 'hello there', 'm1');
    flush();
    expect(screen.getByText(t('chatReader.statusConnected'))).toBeTruthy();
    expect(log().textContent).toContain(
      t('chatReader.eventConnected', { platform: 'Twitch', channel: 'streamer' }),
    );
    expect(log().textContent).toContain('Viewer');
    expect(log().textContent).toContain('hello there');

    act(() => twitchSocket().onclose?.(new CloseEvent('close')));
    flush();
    expect(screen.getByText(t('chatReader.statusReconnecting'))).toBeTruthy();
    expect(log().textContent).toContain(t('chatReader.eventDisconnected', { platform: 'Twitch' }));
    // First retry after 1s; 150ms of it already went by.
    expect(
      screen.getByText(t('chatReader.retryIn', { platform: 'Twitch', seconds: 1 })),
    ).toBeTruthy();

    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.getByText(t('chatReader.retrying', { platform: 'Twitch' }))).toBeTruthy();
    act(() => vi.advanceTimersByTime(2_000));
    act(() => twitchSocket().open());
    flush();
    expect(screen.queryByText(t('chatReader.retryNow'))).toBeNull();
    expect(log().textContent).toContain(
      t('chatReader.eventReconnected', {
        platform: 'Twitch',
        duration: t('chatReader.durationSeconds', { seconds: 3 }),
      }),
    );
    // The earlier message is still there: nothing needed a refresh.
    expect(log().textContent).toContain('hello there');
  });

  it('retries at once when asked', async () => {
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    act(() => twitchSocket().open());
    act(() => twitchSocket().onclose?.(new CloseEvent('close')));
    const sockets = FakeWebSocket.instances.length;
    fireEvent.click(button(en('chatReader.retryNow')));
    expect(FakeWebSocket.instances).toHaveLength(sockets + 1);
  });

  it('keeps a deleted message, marked as deleted', async () => {
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    vi.useFakeTimers();
    act(() => twitchSocket().open());
    say('Spammer', 'buy followers', 'bad-1');
    act(() =>
      twitchSocket().receive(
        '@login=spammer;target-msg-id=bad-1 :tmi.twitch.tv CLEARMSG #streamer :buy followers\r\n',
      ),
    );
    flush();
    expect(log().textContent).toContain('buy followers');
    expect(screen.getByText(en('chatReader.deleted'))).toBeTruthy();
  });

  it('says so while the browser is offline, and logs it', async () => {
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    vi.useFakeTimers();
    act(() => twitchSocket().open());
    act(() => window.dispatchEvent(new Event('offline')));
    flush();
    expect(screen.getByText(en('chatReader.networkOffline'))).toBeTruthy();
    expect(log().textContent).toContain(en('chatReader.eventNetworkLost'));

    act(() => window.dispatchEvent(new Event('online')));
    flush();
    expect(screen.queryByText(en('chatReader.networkOffline'))).toBeNull();
    expect(log().textContent).toContain(en('chatReader.eventNetworkBack'));
  });

  it('still has the chat after a refresh, and can clear it', async () => {
    const user = setupUser();
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    act(() => twitchSocket().open());
    say('Viewer', 'remember me', 'm1');
    cleanup();

    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    expect(log().textContent).toContain('remember me');
    expect(log().textContent).toContain(en('chatReader.eventResumed', { time: '' }).trim());

    await user.click(button(en('chatReader.clear')));
    await user.click(button(en('chatReader.clearConfirm')));
    expect(log().textContent).not.toContain('remember me');
  });

  it('keeps the newest rows in view when the dock gets shorter', async () => {
    const observers: { callback: ResizeObserverCallback; targets: Element[] }[] = [];
    vi.stubGlobal(
      'ResizeObserver',
      class {
        targets: Element[] = [];
        constructor(callback: ResizeObserverCallback) {
          observers.push({ callback, targets: this.targets });
        }
        observe(target: Element) {
          this.targets.push(target);
        }
        unobserve() {}
        disconnect() {}
      },
    );
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    const list = log();
    Object.defineProperty(list, 'scrollHeight', { configurable: true, value: 900 });
    list.scrollTop = 500;

    // Only the dock's own box changed size.
    for (const { callback, targets } of observers) {
      if (targets.includes(list)) callback([], {} as ResizeObserver);
    }
    expect(list.scrollTop).toBe(900);
    vi.unstubAllGlobals();
  });

  it('says so when the Kick channel does not exist', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 404 }));
    await renderRoute(`${TOOL}?kick=nobody&lang=en`);
    await act(async () => {});
    expect(screen.getByText(en('chatReader.notFound'))).toBeTruthy();
  });

  it('keeps looking up a Kick channel while kick.com fails, then reads its chat', async () => {
    const kickApi = vi.fn(async (): Promise<Response> => {
      throw new TypeError('Failed to fetch');
    });
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) =>
      String(input).startsWith('https://kick.com/') ? kickApi() : new Response('{}', { status: 500 }),
    );
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await renderRoute(`${TOOL}?kick=streamer&lang=en`);
    await act(async () => {});
    // A failed lookup is not a missing channel.
    expect(screen.queryByText(en('chatReader.notFound'))).toBeNull();
    expect(screen.getByText(en('chatReader.statusConnecting'))).toBeTruthy();

    kickApi.mockImplementation(async () =>
      Response.json({ id: 1, user_id: 2, chatroom: { id: 668 } }),
    );
    await act(async () => vi.advanceTimersByTime(5_000));
    expect(FakeWebSocket.instances.some((ws) => ws.url.startsWith('wss://ws-us2.pusher.com'))).toBe(
      true,
    );
  });

  it('marks every message of a banned or timed-out user, found by login', async () => {
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    vi.useFakeTimers();
    act(() => twitchSocket().open());
    act(() =>
      twitchSocket().receive(
        `@display-name=お命頂戴;id=j1 :oinotityoudai!oinotityoudai@oinotityoudai.tmi.twitch.tv PRIVMSG #streamer :first\r\n` +
          `@display-name=お命頂戴;id=j2 :oinotityoudai!oinotityoudai@oinotityoudai.tmi.twitch.tv PRIVMSG #streamer :second\r\n`,
      ),
    );
    say('Viewer', 'still here', 'v1');
    act(() =>
      twitchSocket().receive(
        '@ban-duration=600;target-user-id=1 :tmi.twitch.tv CLEARCHAT #streamer :oinotityoudai\r\n',
      ),
    );
    flush();
    expect(screen.getAllByText(en('chatReader.deleted'))).toHaveLength(2);
    expect(log().textContent).toContain('still here');
  });

  it('logs a /clear but keeps the messages to read', async () => {
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    vi.useFakeTimers();
    act(() => twitchSocket().open());
    say('Viewer', 'before the clear', 'c1');
    act(() => twitchSocket().receive(':tmi.twitch.tv CLEARCHAT #streamer\r\n'));
    flush();
    expect(log().textContent).toContain('before the clear');
    expect(log().textContent).toContain(en('chatReader.eventChatCleared', { platform: 'Twitch' }));
  });

  it('hides bots and commands when the link says so', async () => {
    await renderRoute(`${TOOL}?twitch=streamer&hideBots=true&hideCommands=true&lang=en`);
    vi.useFakeTimers();
    act(() => twitchSocket().open());
    say('Nightbot', 'follow the rules', 'b1');
    say('Viewer', '!discord', 'b2');
    say('Viewer', 'a real message', 'b3');
    flush();
    expect(log().textContent).not.toContain('follow the rules');
    expect(log().textContent).not.toContain('!discord');
    expect(log().textContent).toContain('a real message');
  });

  it('joins the channel lowercased and shows it that way', async () => {
    await renderRoute(`${TOOL}?twitch=%20StreamER%20&lang=en`);
    act(() => twitchSocket().open());
    expect(twitchSocket().sent).toContain('JOIN #streamer');
    expect(screen.getByText('streamer')).toBeTruthy();
  });

  it.each([
    'twitch=streamer&hideBots=%5B%5D&badges=%7B&sevenTv=null&highlights=1%2C2',
    'twitch=123456&kick=true',
    'twitch=&kick=',
    'twitch=streamer&twitch=other',
  ])('opens with a link carrying %s', async (query) => {
    await renderRoute(`${TOOL}?${query}&lang=en`);
    expect(log()).toBeTruthy();
  });

  it('says a channel is missing when the link has none', async () => {
    await renderRoute(`${TOOL}?twitch=%20&lang=en`);
    expect(screen.getByText(en('chatReader.noChannel'))).toBeTruthy();
    expect(FakeWebSocket.instances).toHaveLength(0);
  });

  it('opens with an empty chat when the saved history or settings are unreadable', async () => {
    localStorage.setItem('chat-reader:streamer|', '{"savedAt":1,"entries":[null,{"at":"x"}]}');
    localStorage.setItem('chat-reader:prefs', '{"fontSize":99,"showTime":"yes"}');
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    expect(log().style.fontSize).toBe('15px');
    expect(screen.getByText(en('chatReader.empty', { channels: 'streamer' }))).toBeTruthy();
  });

  it('remembers the text size and the times toggle', async () => {
    const user = setupUser();
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    act(() => twitchSocket().open());
    say('Viewer', 'hello', 'p1');
    await act(async () => new Promise((resolve) => setTimeout(resolve, 150)));
    expect(log().querySelectorAll('time')).toHaveLength(2);

    await user.click(button(en('chatReader.fontLarger')));
    await user.click(button(en('chatReader.timestamps')));
    expect(log().style.fontSize).toBe('16px');
    // The event row keeps its time; the message row loses it.
    expect(log().querySelectorAll('time')).toHaveLength(1);
    cleanup();

    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    expect(log().style.fontSize).toBe('16px');
    expect(button(en('chatReader.timestamps')).getAttribute('aria-pressed')).toBe('false');
  });

  it('keeps a deleted message marked after a refresh', async () => {
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    act(() => twitchSocket().open());
    say('Spammer', 'buy followers', 'bad-1');
    act(() =>
      twitchSocket().receive(
        '@target-msg-id=bad-1 :tmi.twitch.tv CLEARMSG #streamer :buy followers\r\n',
      ),
    );
    cleanup();

    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    expect(log().textContent).toContain('buy followers');
    expect(screen.getByText(en('chatReader.deleted'))).toBeTruthy();
  });

  it('asks twice before clearing, and the second click expires', async () => {
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    vi.useFakeTimers();
    act(() => twitchSocket().open());
    say('Viewer', 'keep me', 'k1');
    flush();
    fireEvent.click(button(en('chatReader.clear')));
    act(() => vi.advanceTimersByTime(3_000));
    fireEvent.click(button(en('chatReader.clear')));
    expect(log().textContent).toContain('keep me');
    fireEvent.click(button(en('chatReader.clearConfirm')));
    expect(log().textContent).not.toContain('keep me');
  });

  it('counts new messages while scrolled up and goes back to them on request', async () => {
    await renderRoute(`${TOOL}?twitch=streamer&lang=en`);
    vi.useFakeTimers();
    act(() => twitchSocket().open());
    say('Viewer', 'one', 's1');
    flush();
    const list = log();
    let scrollHeight = 1000;
    Object.defineProperty(list, 'scrollHeight', { configurable: true, get: () => scrollHeight });
    Object.defineProperty(list, 'clientHeight', { configurable: true, value: 300 });
    act(() => {
      list.scrollTop = 200;
      fireEvent.scroll(list);
    });
    expect(button(en('chatReader.backToLive'))).toBeTruthy();

    say('Viewer', 'two', 's2');
    say('Viewer', 'three', 's3');
    scrollHeight = 1200;
    flush();
    // Scrolled up, the list stays where the reader left it.
    expect(list.scrollTop).toBe(200);
    fireEvent.click(button(en('chatReader.newMessages', { count: 2 })));
    expect(list.scrollTop).toBe(1200);
    expect(screen.queryByText(en('chatReader.backToLive'))).toBeNull();
  });

  it('shows which platform each message came from when it reads both', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) =>
      String(input).startsWith('https://kick.com/')
        ? Response.json({ id: 1, user_id: 2, chatroom: { id: 668 } })
        : new Response('{}', { status: 503 }),
    );
    await renderRoute(`${TOOL}?twitch=streamer&kick=streamer&lang=en`);
    await act(async () => {});
    const kick = FakeWebSocket.instances.find((ws) => ws.url.startsWith('wss://ws-us2.pusher.com'));
    if (!kick) throw new Error('The reader never connected to Kick chat');
    vi.useFakeTimers();
    act(() => kick.open());
    expect(kick.sent).toContain(
      JSON.stringify({ event: 'pusher:subscribe', data: { channel: 'chatrooms.668.v2' } }),
    );
    act(() =>
      kick.receive(
        JSON.stringify({
          event: 'App\\Events\\ChatMessageEvent',
          data: JSON.stringify({
            id: 'k1',
            content: 'from kick',
            type: 'message',
            created_at: '2026-09-15T17:43:13+00:00',
            sender: { username: 'Liliuy_56', identity: { color: '#FF2C56', badges: [] } },
          }),
        }),
      ),
    );
    act(() =>
      kick.receive(
        JSON.stringify({
          event: 'App\\Events\\UserBannedEvent',
          data: JSON.stringify({ user: { id: 7, username: 'Liliuy_56', slug: 'liliuy-56' } }),
        }),
      ),
    );
    flush();
    expect(log().textContent).toContain('from kick');
    expect(screen.getByText(en('chatReader.deleted'))).toBeTruthy();
  });

  it('is opened from the Chat Box setup with the chat settings', async () => {
    const user = setupUser();
    await renderRoute('/setup/chat-widget');
    expect(screen.getByText(en('chatWidget.openReader'), { selector: 'button' })).toBeTruthy();

    await user.type(textbox(en('common.twitchChannel')), 'Streamer');
    const link = screen.getByText(en('chatWidget.openReader'), { selector: 'a' });
    expect(link.getAttribute('href')).toBe(
      'http://localhost:3000/tools/chat-reader?twitch=streamer&lang=en',
    );
  });
});
