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
