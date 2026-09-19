import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeWebSocket } from '#/test/browser';
import { SubSproutWidget } from './sub-sprout-widget';

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
const pusher = (channel: string, event: string, data: unknown) =>
  act(() =>
    socket('pusher').receive(JSON.stringify({ event, channel, data: JSON.stringify(data) })),
  );
const irc = (line: string) => act(() => socket('twitch').receive(line));
const grow = (subs: number) => act(() => vi.advanceTimersByTime(subs * 800));

const notice = (tags: string) => `@${tags};room-id=1 :tmi.twitch.tv USERNOTICE #streamer`;
const SUB = notice('display-name=Subber;login=subber;msg-id=sub;msg-param-sub-plan=1000');
const RESUB = notice(
  'display-name=Old;login=old;msg-id=resub;msg-param-cumulative-months=5;msg-param-sub-plan=Prime',
);
const MYSTERY = (count: number) =>
  notice(
    `display-name=Gifter;login=gifter;msg-id=submysterygift;msg-param-community-gift-id=9;msg-param-mass-gift-count=${count};msg-param-sub-plan=1000`,
  );
const BUNDLED = (to: string) =>
  notice(
    `display-name=Gifter;login=gifter;msg-id=subgift;msg-param-community-gift-id=9;msg-param-recipient-user-name=${to};msg-param-sub-plan=1000`,
  );
const SAYS = (login: string, tags: string, text: string) =>
  `@${tags};display-name=${login};room-id=1 :${login}!${login}@${login}.tmi.twitch.tv PRIVMSG #streamer :${text}`;

async function renderTwitch(props: Partial<Parameters<typeof SubSproutWidget>[0]> = {}) {
  const view = render(
    <SubSproutWidget twitchChannel="streamer" variety="rose" potLabel countFx={false} {...props} />,
  );
  // tmi.js is loaded on demand.
  await vi.waitFor(() => socket('twitch'));
  act(() => socket('twitch').open());
  return view;
}

async function renderKick(props: Partial<Parameters<typeof SubSproutWidget>[0]> = {}) {
  const view = render(
    <SubSproutWidget kickChannel="streamer" variety="rose" potLabel countFx={false} {...props} />,
  );
  await act(async () => {});
  act(() => socket('pusher').open());
  return view;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(KICK_42);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('SubSproutWidget on Twitch', () => {
  it('grows one stage for a sub and one for a resub', async () => {
    const { container } = await renderTwitch();
    irc(SUB);
    irc(RESUB);
    grow(2);
    expect(container.textContent).toContain('2/10');
  });

  it('grows a gift bundle by its size, not again for each recipient', async () => {
    const { container } = await renderTwitch();
    irc(MYSTERY(3));
    irc([BUNDLED('a'), BUNDLED('b'), BUNDLED('c')].join('\r\n'));
    grow(6);
    expect(container.textContent).toContain('3/10');
  });

  it("grows on a mod's or the broadcaster's !grow, not a viewer's", async () => {
    const { container } = await renderTwitch();
    irc(SAYS('viewer', 'badges=subscriber/1;mod=0', '!grow'));
    irc(SAYS('vip', 'badges=vip/1;mod=0', '!grow'));
    grow(2);
    expect(container.textContent).toContain('0/10');
    irc(SAYS('mod', 'badges=moderator/1;mod=1', '!grow'));
    irc(SAYS('streamer', 'badges=broadcaster/1;mod=0', '!GROW'));
    grow(2);
    expect(container.textContent).toContain('2/10');
  });

  it('reads !grow as the first word on both platforms, words after it and all', async () => {
    const { container } = await renderTwitch({ kickChannel: 'streamer' });
    await act(async () => {});
    act(() => socket('pusher').open());
    irc(SAYS('mod', 'badges=moderator/1;mod=1', '!grow now please'));
    grow(1);
    expect(container.textContent).toContain('1/10');
    pusher('chatrooms.42.v2', 'App\\Events\\ChatMessageEvent', {
      content: '!grow now please',
      type: 'message',
      sender: { username: 'KickMod', identity: { badges: [{ type: 'moderator' }] } },
    });
    grow(1);
    expect(container.textContent).toContain('2/10');
    pusher('chatrooms.42.v2', 'App\\Events\\ChatMessageEvent', {
      content: '!growing',
      type: 'message',
      sender: { username: 'KickMod', identity: { badges: [{ type: 'moderator' }] } },
    });
    grow(1);
    expect(container.textContent).toContain('2/10');
  });

  it('queues subs that come faster than the plant grows', async () => {
    const { container } = await renderTwitch();
    for (let i = 0; i < 4; i++) irc(SUB);
    expect(container.textContent).toContain('1/10');
    grow(4);
    expect(container.textContent).toContain('4/10');
  });
});

describe('SubSproutWidget growth', () => {
  it('starts the next plant after the last stage', async () => {
    const { container } = await renderKick({ variety: 'pine', pick: 'cycle' });
    // Pine draws stages 0-4; the fifth sub starts the next plant in the list.
    for (let i = 0; i < 4; i++)
      pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: `v${i}` });
    grow(4);
    expect(container.textContent).toContain('4/5');
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'v5' });
    grow(1);
    expect(container.textContent).toContain('1/7');
  });

  it("grows the Classic Sprout's top leaf before it starts over", async () => {
    const { container } = await renderKick({ variety: 'classic' });
    const topLeaf = () => (container.querySelector('.leaf-4') as SVGGElement).style.transform;
    for (let i = 0; i < 8; i++)
      pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: `v${i}` });
    grow(8);
    expect(container.textContent).toContain('8/9');
    expect(topLeaf()).toBe('scale(0)');
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'v8' });
    grow(1);
    expect(container.textContent).toContain('9/9');
    expect(topLeaf()).toBe('scale(0.85)');
    pusher('chatrooms.42.v2', 'App\\Events\\SubscriptionEvent', { username: 'v9' });
    grow(1);
    expect(container.textContent).toContain('1/9');
  });

  it('grows a Kick gift once when Kick sends it twice', async () => {
    const { container } = await renderKick();
    const gift = {
      correlation_id: 'c-9',
      gifter_username: 'Gifter',
      gifted_usernames: ['a', 'b'],
      gifted_total: 2,
      chunk_details: null,
    };
    pusher('chatroom_42', 'GiftedSubscriptionsEvent', gift);
    pusher('chatroom_42', 'GiftedSubscriptionsEvent', gift);
    grow(4);
    expect(container.textContent).toContain('2/10');
  });

  it('does not grow for a Kick resub shared in chat, Kicks or a raid', async () => {
    const { container } = await renderKick();
    pusher('chatrooms.42.v2', 'App\\Events\\ChatMessageEvent', {
      content: '5 months!',
      type: 'celebration',
      sender: { username: 'Fan', identity: { badges: [] } },
      metadata: { celebration: { type: 'subscription_renewed', total_months: 5 } },
    });
    pusher('channel_7', 'KicksGifted', {
      gift_transaction_id: 't',
      sender: { username: 'K' },
      gift: { amount: 100 },
    });
    pusher('chatrooms.42.v2', 'App\\Events\\StreamHostEvent', {
      host_username: 'Raider',
      number_viewers: 20,
    });
    grow(3);
    expect(container.textContent).toContain('0/10');
  });

  it('shows the count effect for a gift by its size', async () => {
    const { container } = await renderKick({ countFx: true });
    pusher('chatroom_42', 'GiftedSubscriptionsEvent', {
      correlation_id: 'c-1',
      gifter_username: 'Gifter',
      gifted_usernames: ['a', 'b', 'c', 'd', 'e'],
      gifted_total: 5,
      chunk_details: null,
    });
    expect(container.querySelector('.fx-sub-count-text')?.textContent).toBe('x5');
  });
});

describe('SubSproutWidget cleanup', () => {
  it('closes the Kick socket and stops growing once it unmounts', async () => {
    const view = await renderKick();
    pusher('chatroom_42', 'GiftedSubscriptionsEvent', {
      correlation_id: 'c-2',
      gifter_username: 'Gifter',
      gifted_usernames: ['a', 'b', 'c'],
      gifted_total: 3,
      chunk_details: null,
    });
    view.unmount();
    expect(socket('pusher').readyState).toBe(FakeWebSocket.CLOSED);
    const sockets = FakeWebSocket.instances.length;
    act(() => vi.advanceTimersByTime(120_000));
    expect(FakeWebSocket.instances).toHaveLength(sockets);
  });

  it('closes the Twitch connection when it unmounts', async () => {
    const view = await renderTwitch();
    view.unmount();
    expect(socket('twitch').readyState).toBe(FakeWebSocket.CLOSED);
  });
});
