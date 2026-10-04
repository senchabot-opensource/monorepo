import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChannelEmote } from '#/features/widgets/countdown/countdown-emotes';
import { FakeWebSocket } from '#/test/browser';
import { bttvEmoteUrl, kickEmoteUrl, sevenTvEmoteUrl, twitchEmoteUrl } from './emote-utils';
import { EmoteWall } from './emote-wall';

// Name -> image URL per platform, like the chat widget's merged provider map.
// lastProviders records what the wall asked for, so the toggle wiring is testable.
const channelEmotes = vi.hoisted(() => ({
  twitch: new Map<string, string>(),
  kick: new Map<string, string>(),
  lastProviders: null as null | { sevenTv: boolean; bttv: boolean; ffz: boolean },
}));
vi.mock('#/features/widgets/chat-widget/use-channel-emotes', () => ({
  useChannelEmotes: (
    _twitch: unknown,
    _kickUserId: unknown,
    providers: { sevenTv: boolean; bttv: boolean; ffz: boolean },
  ) => {
    channelEmotes.lastProviders = providers;
    return {
      twitch: channelEmotes.twitch,
      kick: channelEmotes.kick,
      youtube: new Map<string, string>(),
    };
  },
}));

const channelEmotesLoad = vi.hoisted(() => ({
  load: vi.fn(async (_twitch: string, _kick: string): Promise<ChannelEmote[]> => []),
}));
vi.mock('#/features/widgets/countdown/countdown-emotes', () => ({
  loadChannelEmotes: channelEmotesLoad.load,
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
  channelEmotes.twitch = new Map();
  channelEmotes.kick = new Map();
  channelEmotes.lastProviders = null;
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

  it("uses Kick's third-party emotes in Kick chat", () => {
    channelEmotes.kick = new Map([['PEPE', sevenTvEmoteUrl('s1')]]);
    render(<EmoteWall twitchChannel="streamer" kickChatroomId="42" />);
    act(() => socket('pusher').open());
    kickSay('fan', 'PEPE [emote:1:x]');
    expect(images()).toEqual([sevenTvEmoteUrl('s1'), kickEmoteUrl('1')]);
  });

  it('shows BTTV and FFZ emote-only rows on Twitch', () => {
    channelEmotes.twitch = new Map([
      [':tf:', bttvEmoteUrl('b1')],
      ['ZrehplaR', 'https://cdn.frankerfacez.com/emote/9/2'],
    ]);
    mount({ bttvEnabled: true, ffzEnabled: true });
    say('Alice', ':tf:');
    say('Bob', 'ZrehplaR ZrehplaR');
    say('Carol', 'Kappa :tf:', '25:0-4');
    expect(images()).toEqual([
      bttvEmoteUrl('b1'),
      'https://cdn.frankerfacez.com/emote/9/2',
      'https://cdn.frankerfacez.com/emote/9/2',
      twitchEmoteUrl('25'),
      bttvEmoteUrl('b1'),
    ]);
  });

  it('shows BTTV emotes in Kick chat from the Kick map', () => {
    channelEmotes.kick = new Map([[':tf:', bttvEmoteUrl('b1')]]);
    render(<EmoteWall kickChatroomId="42" bttvEnabled />);
    act(() => socket('pusher').open());
    kickSay('fan', ':tf:');
    expect(images()).toEqual([bttvEmoteUrl('b1')]);
  });

  it('asks the channel emote hook for exactly the ticked providers', () => {
    const { unmount } = mount();
    expect(channelEmotes.lastProviders).toEqual({ sevenTv: true, bttv: false, ffz: false });
    unmount();
    mount({ sevenTvEnabled: false, bttvEnabled: true, ffzEnabled: true });
    expect(channelEmotes.lastProviders).toEqual({ sevenTv: false, bttv: true, ffz: true });
  });

  it("doesn't take a 7TV row that ends in text as emote-only", () => {
    channelEmotes.twitch = new Map([['KEKW', sevenTvEmoteUrl('s2')]]);
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

  it.each(['chaos', 'bounce', 'glide', 'spin', 'burst'] as const)('removes %s emotes once they are done', (mode) => {
    mount({ mode, durationSec: 2 });
    say('Alice', 'Kappa', '25:0-4');
    expect(images()).toHaveLength(1);
    wait(2000 + 1000);
    expect(images()).toHaveLength(0);
  });

  it('mixes animations and clears them all in random mode', () => {
    mount({ mode: 'random', durationSec: 2, spamBlock: false });
    say('Alice', 'Kappa Kappa Kappa', '25:0-4,6-10,12-16');
    expect(images().length).toBeGreaterThan(0);
    wait(2000 + 1000);
    expect(images()).toHaveLength(0);
  });

  it('sways glide emotes side to side while they fall', () => {
    mount({ mode: 'glide' });
    say('Alice', 'Kappa', '25:0-4');
    const sway = document.querySelector('.emote-glide-sway') as HTMLElement | null;
    expect(sway).toBeTruthy();
    expect(sway?.style.animationDuration).toMatch(/^\d+ms$/);
    expect(sway?.style.getPropertyValue('--sway-x')).toMatch(/^\d+px$/);
  });

  it('fades spin emotes in, spins them, and fades them out in place', () => {
    mount({ mode: 'spin' });
    say('Alice', 'Kappa', '25:0-4');
    const faded = document.querySelector('.emote-wall-spin') as HTMLElement | null;
    expect(faded).toBeTruthy();
    expect(faded?.style.getPropertyValue('--spin')).toMatch(/^-?\d+deg$/);
  });

  it('bursts emotes on a canvas after they appear', () => {
    mount({ mode: 'burst' });
    say('Alice', 'Kappa', '25:0-4');
    expect(images()).toHaveLength(1);
    expect(document.querySelector('canvas')).toBeTruthy();
  });

  it('keeps burst emotes drifting until they pop mid-motion', () => {
    mount({ mode: 'burst' });
    say('Alice', 'Kappa', '25:0-4');
    wait(100);
    const wrapper = document.querySelector('canvas')?.parentElement as HTMLElement | null;
    expect(wrapper?.style.transform).toMatch(/^translate\(-?\d+px, -?\d+px\)$/);
    expect(wrapper?.style.transition).toMatch(/^transform \d+ms linear$/);
  });

  it('shows only the channels subscriber emotes with Sub Emotes Only on', async () => {
    channelEmotesLoad.load.mockResolvedValue([
      { name: 'SubWow', url: twitchEmoteUrl('12345'), thumb: twitchEmoteUrl('12345'), platform: 'twitch', provider: 'Twitch' },
      { name: 'KickSub', url: kickEmoteUrl('999'), thumb: kickEmoteUrl('999'), platform: 'kick', provider: 'Kick', subOnly: true },
      { name: 'KickFree', url: kickEmoteUrl('1000'), thumb: kickEmoteUrl('1000'), platform: 'kick', provider: 'Kick', subOnly: false },
    ]);
    channelEmotes.twitch = new Map([['KEKW', sevenTvEmoteUrl('s2')]]);
    mount({ subEmotes: true });
    await act(async () => {});
    say('Alice', 'Kappa', '25:0-4');
    say('Bob', 'SubWow', '12345:0-5');
    say('Carol', 'KEKW');
    expect(images()).toEqual([twitchEmoteUrl('12345')]);
  });

  it('shows only subscriber-only Kick emotes with Sub Emotes Only on', async () => {
    channelEmotesLoad.load.mockResolvedValue([
      { name: 'KickSub', url: kickEmoteUrl('999'), thumb: kickEmoteUrl('999'), platform: 'kick', provider: 'Kick', subOnly: true },
      { name: 'KickFree', url: kickEmoteUrl('1000'), thumb: kickEmoteUrl('1000'), platform: 'kick', provider: 'Kick', subOnly: false },
    ]);
    render(<EmoteWall kickChannel="kicker" kickChatroomId="42" subEmotes />);
    act(() => socket('pusher').open());
    await act(async () => {});
    kickSay('fan', '[emote:999:KickSub]');
    kickSay('fan2', '[emote:1000:KickFree]');
    expect(images()).toEqual([kickEmoteUrl('999')]);
  });

  it('shows new-format sub emotes with Sub Emotes Only on', async () => {
    const id = 'emotesv2_9563d7c198dd422e8253c38cb1249cdd';
    channelEmotesLoad.load.mockResolvedValue([
      { name: 'NewSub', url: twitchEmoteUrl(id), thumb: twitchEmoteUrl(id), platform: 'twitch', provider: 'Twitch' },
    ]);
    mount({ subEmotes: true });
    await act(async () => {});
    say('Alice', 'Kappa', '25:0-4');
    say('Bob', 'NewSub', `${id}:0-5`);
    expect(images()).toEqual([twitchEmoteUrl(id)]);
  });

  it('recovers a channel whose first lookup comes back empty', async () => {
    const twitchEntry = {
      name: 'SubWow',
      url: twitchEmoteUrl('12345'),
      thumb: twitchEmoteUrl('12345'),
      platform: 'twitch',
      provider: 'Twitch',
    } as const;
    const kickEntry = {
      name: 'KickSub',
      url: kickEmoteUrl('999'),
      thumb: kickEmoteUrl('999'),
      platform: 'kick',
      provider: 'Kick',
      subOnly: true,
    } as const;
    // Kick loads fine while Twitch comes back empty. The old single lookup
    // saw the non-empty combined set and never retried, so Twitch stayed
    // dark behind the Kick keys forever; per-channel loading recovers it.
    let twitchReady = false;
    channelEmotesLoad.load.mockImplementation(async (twitch: string, kick: string) => {
      if (twitch && kick) return [kickEntry];
      if (twitch) return twitchReady ? [twitchEntry] : [];
      return [kickEntry];
    });
    render(<EmoteWall twitchChannel="streamer" kickChannel="kicker" subEmotes />);
    act(() => socket('twitch').open());
    await act(async () => {});
    say('Bob', 'SubWow', '12345:0-5');
    expect(images()).toEqual([]);
    twitchReady = true;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    say('Bob', 'SubWow', '12345:0-5');
    expect(images()).toEqual([twitchEmoteUrl('12345')]);
  });
});
