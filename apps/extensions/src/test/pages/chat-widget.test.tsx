import { act, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chatMessagesCollection } from '#/features/widgets/chat-widget/chat-messages';
import { FakeWebSocket } from '#/test/browser';
import { renderRoute } from '#/test/render';

const OVERLAY = '/widgets/chat-widget';

beforeEach(() => {
  // Chat clients log their connection state, and emote and badge lookups fail without a network.
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'debug').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  // The collection outlives the page, as it would in one browser tab.
  for (const key of [...chatMessagesCollection.keys()]) chatMessagesCollection.delete(key);
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const socketTo = (host: string) => {
  const sockets = FakeWebSocket.instances.filter((ws) => ws.url.includes(host));
  const socket = sockets[sockets.length - 1];
  if (!socket) throw new Error(`The overlay never connected to ${host}`);
  return socket;
};
const twitch = () => socketTo('irc-ws.chat.twitch.tv');
const kick = () => socketTo('pusher.com');

let seq = 0;
function say(text: string, { name = 'Viewer', tags = '', id = `m${++seq}` } = {}) {
  const login = name.toLowerCase();
  act(() =>
    twitch().receive(
      `@badges=;color=#8A2BE2;display-name=${name};emotes=;id=${id};tmi-sent-ts=${Date.now()}${tags} :${login}!${login}@${login}.tmi.twitch.tv PRIVMSG #streamer :${text}\r\n`,
    ),
  );
}

function kickSay(text: string, name = 'KickViewer', id = `k${++seq}`) {
  act(() =>
    kick().receive(
      JSON.stringify({
        event: 'App\\Events\\ChatMessageEvent',
        channel: 'chatrooms.9.v2',
        data: JSON.stringify({
          id,
          chatroom_id: 9,
          content: text,
          type: 'message',
          created_at: new Date().toISOString(),
          sender: {
            id: 1,
            username: name,
            slug: name.toLowerCase(),
            identity: { color: '#72ACED', badges: [] },
          },
          metadata: {},
        }),
      }),
    ),
  );
}

const rows = () => [...document.querySelectorAll<HTMLElement>('[data-msg-id]')];
const texts = () => rows().map((row) => row.textContent?.trim());

async function openTwitch(query = '') {
  await renderRoute(`${OVERLAY}?twitch=streamer${query}`);
  act(() => twitch().open());
}

async function openKick(query = '') {
  vi.mocked(fetch).mockImplementation(async (url) =>
    String(url).startsWith('https://kick.com/api/v1/channels/')
      ? new Response(JSON.stringify({ id: 8, user_id: 7, chatroom: { id: 9 } }))
      : new Response('{}', { status: 503 }),
  );
  await renderRoute(`${OVERLAY}?kick=kicker${query}`);
  await act(async () => {});
  act(() => kick().open());
}

describe('Chat Box overlay', () => {
  it('shows Twitch chat as it arrives', async () => {
    await openTwitch();
    say('hello there');
    expect(texts()).toEqual(['Viewer: hello there']);
  });

  it('keeps the order messages arrived in, within one millisecond too', async () => {
    await openTwitch('&keep=true');
    vi.useFakeTimers({ now: Date.now() });
    const line = (id: string, text: string) =>
      `@display-name=Viewer;id=${id};tmi-sent-ts=1 :viewer!viewer@viewer.tmi.twitch.tv PRIVMSG #streamer :${text}\r\n`;
    // Twitch batches lines into one frame (76 of 7827 frames live); ids are random UUIDs.
    act(() => twitch().receive(line('f0', 'first') + line('a1', 'second') + line('c2', 'third')));
    act(() => twitch().receive(line('0b', 'fourth')));
    expect(texts()).toEqual(['Viewer: first', 'Viewer: second', 'Viewer: third', 'Viewer: fourth']);
  });

  it('shows a /me message without the ACTION wrapper', async () => {
    await openTwitch();
    say('\x01ACTION waves at chat\x01');
    expect(texts()).toEqual(['Viewer: waves at chat']);
  });

  it('draws the emotes of a /me message on the words they belong to', async () => {
    await openTwitch();
    say('\x01ACTION gg Kappa gg\x01', { tags: ';emotes=25:3-7' });
    const row = rows()[0];
    expect(row.textContent?.trim()).toBe('Viewer: gg  gg');
    expect(row.querySelector('img[src*="/emoticons/v2/25/"]')).not.toBeNull();
  });

  it('shows the full message a reply answers, "=" and all', async () => {
    await openTwitch('&highlights=reply');
    say('@Parent watch it', {
      tags: String.raw`;reply-parent-display-name=Parent;reply-parent-msg-body=link:\shttps://youtu.be/x?t=10;reply-parent-user-login=parent`,
    });
    expect(rows()[0].textContent).toContain('@Parent: link: https://youtu.be/x?t=10');
    expect(rows()[0].textContent).toContain('Viewer: watch it');
  });

  it('removes a timed-out Twitch user and a deleted message', async () => {
    await openTwitch();
    say('spam', { name: 'Spammer', id: 's1' });
    say('keep me', { id: 'k1' });
    say('delete me', { id: 'd1' });
    act(() =>
      twitch().receive('@target-user-id=2 :tmi.twitch.tv CLEARCHAT #streamer :spammer\r\n'),
    );
    act(() =>
      twitch().receive(
        '@login=viewer;target-msg-id=d1 :tmi.twitch.tv CLEARMSG #streamer :delete me\r\n',
      ),
    );
    expect(texts()).toEqual(['Viewer: keep me']);
  });

  it('hides commands and bots only when asked', async () => {
    await openTwitch('&hideCommands=true&hideBots=true');
    say('!uptime');
    say('  !discord');
    say('Live for 2 hours', { name: 'Nightbot' });
    say('beep', { name: 'SomeBot', tags: ';badges=bot-badge/1' });
    say('hi');
    expect(texts()).toEqual(['Viewer: hi']);
  });

  it('draws the text shadow the URL asks for, and the old one without it', async () => {
    const shadows = () =>
      [...rows()[0].querySelectorAll<HTMLElement>('*')]
        .map((el) => el.style.textShadow)
        .filter(Boolean);
    await openTwitch();
    say('hi');
    expect(shadows()).not.toHaveLength(0);
    expect(shadows().every((shadow) => shadow.includes('1px 1px 1px'))).toBe(true);
    cleanup();

    await openTwitch('&shadow=none');
    say('hi');
    expect(shadows()).not.toHaveLength(0);
    expect(shadows().every((shadow) => shadow === 'none')).toBe(true);
    cleanup();

    await openTwitch('&shadow=strong');
    say('hi');
    expect(shadows().every((shadow) => shadow.includes('0.06em'))).toBe(true);
  });

  it('lets every message through by default', async () => {
    await openTwitch();
    say('!uptime');
    say('Live for 2 hours', { name: 'Nightbot' });
    expect(texts()).toEqual(['Viewer: !uptime', 'Nightbot: Live for 2 hours']);
  });

  it('keeps the last 100 messages', async () => {
    await openTwitch('&keep=true');
    for (let i = 1; i <= 105; i++) say(`message ${i}`);
    expect(rows()).toHaveLength(100);
    expect(texts()[0]).toBe('Viewer: message 6');
    expect(texts().at(-1)).toBe('Viewer: message 105');
  });

  it('removes a message once its duration is up', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await openTwitch('&duration=10');
    say('short lived');
    await act(async () => vi.advanceTimersByTime(9_000));
    expect(texts()).toEqual(['Viewer: short lived']);
    await act(async () => vi.advanceTimersByTime(2_000));
    expect(texts()).toEqual([]);

    // A message after a quiet spell shows, with nothing old coming back. The socket answers the
    // heartbeat meanwhile.
    for (let i = 0; i < 6; i++) {
      await act(async () => vi.advanceTimersByTime(20_000));
      act(() => twitch().receive(':tmi.twitch.tv PONG tmi.twitch.tv :tmi.twitch.tv\r\n'));
    }
    say('back again');
    expect(texts()).toEqual(['Viewer: back again']);
    await act(async () => vi.advanceTimersByTime(11_000));
    expect(texts()).toEqual([]);
  });

  it('shows Kick chat, emotes and moderation', async () => {
    await openKick('&platformDisplay=none');
    kickSay('hi [emote:37227:LULW]', 'KickViewer', 'kv1');
    kickSay('bad', 'Troll', 'tr1');
    const img = rows()[0].querySelector('img');
    expect(img?.getAttribute('src')).toBe('https://files.kick.com/emotes/37227/fullsize');
    act(() =>
      kick().receive(
        JSON.stringify({
          event: 'App\\Events\\UserBannedEvent',
          channel: 'chatrooms.9.v2',
          data: JSON.stringify({
            id: 'b',
            user: { id: 2, username: 'Troll', slug: 'troll' },
            permanent: true,
          }),
        }),
      ),
    );
    expect(texts()).toEqual(['KickViewer: hi']);
  });

  it('hides Kick\'s own bots, which carry a Bot badge and an "@" name, with hideBots', async () => {
    await openKick('&platformDisplay=none&hideBots=true');
    act(() =>
      kick().receive(
        JSON.stringify({
          event: 'App\\Events\\ChatMessageEvent',
          channel: 'chatrooms.9.v2',
          data: JSON.stringify({
            id: 'bot1',
            chatroom_id: 9,
            content: 'Join the giveaway! https://example.test',
            type: 'message',
            created_at: new Date().toISOString(),
            sender: {
              id: 5,
              username: '@Kicklet',
              slug: '@kicklet',
              identity: {
                color: '#53FC18',
                badges: [
                  { type: 'bot', text: 'Bot' },
                  { type: 'verified', text: 'Verified channel' },
                ],
              },
            },
            metadata: {},
          }),
        }),
      ),
    );
    kickSay('hello', 'KickViewer', 'kv2');
    expect(texts()).toEqual(['KickViewer: hello']);
  });

  it.each([
    'fontSize=abc&bgOpacity=x&duration=-5&mockRate=zz',
    'animation=spin&layout=grid&orientation=diagonal&font=comic&platformDisplay=banner',
    'highlights=12345&sevenTv=nope&badges=0&keep=maybe',
  ])('still shows chat with garbage in the URL (%s)', async (query) => {
    await openTwitch(`&${query}`);
    say('still here');
    expect(texts()).toEqual(['Viewer: still here']);
  });

  it('reads a channel name made only of digits', async () => {
    await renderRoute(`${OVERLAY}?twitch=123456`);
    act(() => twitch().open());
    expect(twitch().sent).toContain('JOIN #123456');
  });
});
