import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeWebSocket } from '#/test/browser';
import { kickEmoteUrl, sevenTvEmoteUrl, twitchEmoteUrl } from './emote-utils';
import { EmoteWall } from './emote-wall';

const sevenTv = vi.hoisted(() => ({ map: new Map<string, string>() }));
vi.mock('#/features/widgets/chat-widget/use-7tv-emotes', () => ({
  use7tvEmotes: (channel: string | null) => (channel ? sevenTv.map : new Map()),
}));

const socket = (host: string) => {
  const found = [...FakeWebSocket.instances].reverse().find((ws) => ws.url.includes(host));
  if (!found) throw new Error(`no ${host} socket`);
  return found;
};
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));

let seq = 0;
/** A Twitch chat line from `user`; `emotes` is the IRC tag, `badges` e.g. "subscriber/3". */
const twitchLine = (user: string, text: string, emotes = '', badges = '') =>
  `@badges=${badges};display-name=${user};emotes=${emotes};id=m${++seq};room-id=1;tmi-sent-ts=${Date.now()} :${user.toLowerCase()}!x@x.tmi.twitch.tv PRIVMSG #streamer :${text}`;
const say = (user: string, text: string, emotes = '', badges = '') =>
  act(() => socket('twitch').receive(twitchLine(user, text, emotes, badges)));
const kickSay = (user: string, content: string, badges: { type: string; count?: number }[] = []) =>
  act(() =>
    socket('pusher').receive(
      JSON.stringify({
        event: 'App\\Events\\ChatMessageEvent',
        channel: 'chatrooms.42.v2',
        data: JSON.stringify({
          id: `k${++seq}`,
          content,
          type: 'message',
          created_at: new Date().toISOString(),
          sender: { username: user, identity: { badges } },
        }),
      }),
    ),
  );
const images = () => [...document.querySelectorAll('img')].map((img) => img.getAttribute('src'));
const KAPPA = twitchEmoteUrl('25');

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'debug').mockImplementation(() => {});
  sevenTv.map = new Map();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const mount = (props: Partial<React.ComponentProps<typeof EmoteWall>> = {}) => {
  const view = render(<EmoteWall twitchChannel="streamer" {...props} />);
  act(() => socket('twitch').open());
  return view;
};

describe('EmoteWall', () => {
  it('pops every emote of a row of three only with the spam check off', () => {
    const { unmount } = mount();
    say('Alice', 'Kappa Kappa Kappa', '25:0-4,6-10,12-16');
    expect(images()).toEqual([]);
    unmount();
    mount({ spamBlock: false });
    say('Alice', 'Kappa Kappa Kappa', '25:0-4,6-10,12-16');
    expect(images()).toEqual([KAPPA, KAPPA, KAPPA]);
  });

  it('skips a normal message and keeps its emotes when Show All Emotes is on', () => {
    const { unmount } = mount();
    say('Alice', 'hello Kappa', '25:6-10');
    expect(images()).toEqual([]);
    unmount();
    mount({ showAllEmotes: true });
    say('Alice', 'hello Kappa', '25:6-10');
    expect(images()).toEqual([KAPPA]);
  });

  it("blocks a chatter's third message with the same emote in 10 seconds", () => {
    mount({ durationSec: 30, maxEmotes: 120 });
    say('Alice', 'Kappa', '25:0-4');
    say('Alice', 'Kappa', '25:0-4');
    say('Alice', 'Kappa', '25:0-4');
    expect(images()).toHaveLength(2);
    // Someone else isn't held to Alice's count.
    say('Bob', 'Kappa', '25:0-4');
    expect(images()).toHaveLength(3);
  });

  it('lets repeats through with the spam check off', () => {
    mount({ spamBlock: false, durationSec: 30, maxEmotes: 120 });
    for (let i = 0; i < 6; i++) say('Alice', 'Kappa', '25:0-4');
    expect(images()).toHaveLength(6);
  });

  it('never has more emotes on screen than the maximum', () => {
    mount({ maxEmotes: 4, durationSec: 30 });
    for (let i = 0; i < 5; i++) say(`User${i}`, 'Kappa Kappa', '25:0-4,6-10');
    expect(images()).toHaveLength(4);
  });

  it('clears calm emotes after their duration, twice as long for subs when on', () => {
    mount({ durationSec: 2, subDurationX2: true });
    say('Viewer', 'Kappa', '25:0-4');
    say('Subbed', 'Kappa', '25:0-4', 'subscriber/6');
    expect(images()).toHaveLength(2);
    wait(2000 + 200);
    expect(images()).toHaveLength(1);
    wait(2000);
    expect(images()).toHaveLength(0);
  });

  it('only takes subscribers with Subscribers Only on', () => {
    mount({ subsOnly: true });
    say('Viewer', 'Kappa', '25:0-4');
    say('Mod', 'Kappa', '25:0-4', 'moderator/1');
    expect(images()).toEqual([]);
    say('Founder', 'Kappa', '25:0-4', 'founder/0');
    expect(images()).toEqual([KAPPA]);
  });

  it('shows an emote in hype mode once two chatters send it', () => {
    mount({ hypeMode: true });
    say('Alice', 'Kappa', '25:0-4');
    expect(images()).toEqual([]);
    say('Bob', 'Kappa', '25:0-4');
    expect(images()).toEqual([KAPPA]);
    say('Carol', 'Kappa', '25:0-4');
    expect(images()).toEqual([KAPPA]);
  });

  it('reads Kick emote-only messages', () => {
    render(<EmoteWall kickChatroomId="42" />);
    act(() => socket('pusher').open());
    kickSay('fan', '[emote:37226:KEKW] [emote:39261:KEKLEO]');
    kickSay('fan2', 'lol [emote:37226:KEKW]');
    expect(images()).toEqual([kickEmoteUrl('37226'), kickEmoteUrl('39261')]);
  });

  it("uses the Twitch channel's 7TV emotes in Kick chat too", () => {
    sevenTv.map = new Map([['PEPE', 's1']]);
    render(<EmoteWall twitchChannel="streamer" kickChatroomId="42" />);
    act(() => socket('pusher').open());
    kickSay('fan', 'PEPE [emote:1:x]');
    expect(images()).toEqual([sevenTvEmoteUrl('s1'), kickEmoteUrl('1')]);
  });

  it("doesn't take a 7TV row that ends in text as emote-only", () => {
    sevenTv.map = new Map([['KEKW', 's2']]);
    mount();
    say('Alice', 'KEKW KEKW KEKW KEKW KEKW KEKW that was funny');
    expect(images()).toEqual([]);
  });

  it('leaves no timers or sockets behind when removed', () => {
    const { unmount } = mount({ mode: 'calm' });
    const twitch = socket('twitch');
    say('Alice', 'Kappa', '25:0-4');
    unmount();
    expect(twitch.readyState).toBe(FakeWebSocket.CLOSED);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['chaos', 'bounce'] as const)('removes %s emotes once they are done', (mode) => {
    mount({ mode, durationSec: 2 });
    say('Alice', 'Kappa', '25:0-4');
    expect(images()).toHaveLength(1);
    wait(2000 + 1000);
    expect(images()).toHaveLength(0);
  });
});
