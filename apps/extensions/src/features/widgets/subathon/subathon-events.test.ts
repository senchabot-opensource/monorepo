import { describe, expect, it } from 'vitest';
import { parseIrcLine } from '#/lib/twitch';
import { createKickDedupe, kickEvent, kickSubathonChannels, twitchEvent } from './subathon-events';

// Lines and payloads captured from live Twitch IRC and Kick Pusher, names replaced.
const line = (raw: string) => {
  const parsed = parseIrcLine(raw);
  if (!parsed) throw new Error(`bad line: ${raw}`);
  return parsed;
};
const resub =
  '@badge-info=subscriber/4;badges=subscriber/3;display-name=Subber;login=subber;mod=0;msg-id=resub;msg-param-cumulative-months=4;msg-param-sub-plan=Prime;room-id=1 :tmi.twitch.tv USERNOTICE #channel :hi';
const mystery =
  '@display-name=Gifter;login=gifter;msg-id=submysterygift;msg-param-community-gift-id=6140022;msg-param-mass-gift-count=2;msg-param-sub-plan=1000;room-id=1 :tmi.twitch.tv USERNOTICE #channel';
const bundled = (recipient: string) =>
  `@display-name=Gifter;login=gifter;msg-id=subgift;msg-param-community-gift-id=6140022;msg-param-recipient-user-name=${recipient};msg-param-sub-plan=1000;room-id=1 :tmi.twitch.tv USERNOTICE #channel`;
const directGift =
  '@display-name=Gifter;login=gifter;msg-id=subgift;msg-param-recipient-user-name=lucky;msg-param-sub-plan=3000;room-id=1 :tmi.twitch.tv USERNOTICE #channel';

describe('twitchEvent', () => {
  it('reads a sub with its tier (Prime as Tier 1), months and message', () => {
    expect(twitchEvent(line(resub), new Map())).toEqual({
      kind: 'sub',
      platform: 'twitch',
      name: 'Subber',
      tier: 1,
      months: 4,
      message: 'hi',
    });
    const tier3 = resub.replace('msg-param-sub-plan=Prime', 'msg-param-sub-plan=3000');
    expect(twitchEvent(line(tier3), new Map())).toMatchObject({ kind: 'sub', tier: 3 });
  });

  it('counts a gift bundle once, not again for each recipient', () => {
    const bundles = new Map<string, number>();
    expect(twitchEvent(line(mystery), bundles)).toMatchObject({ kind: 'gift', count: 2 });
    expect(twitchEvent(line(bundled('a')), bundles)).toBeNull();
    expect(twitchEvent(line(bundled('b')), bundles)).toBeNull();
    expect(bundles.size).toBe(0);
  });

  it('counts a gift on its own when its bundle was never seen', () => {
    expect(twitchEvent(line(bundled('a')), new Map())).toMatchObject({ kind: 'gift', count: 1 });
    expect(twitchEvent(line(directGift), new Map())).toMatchObject({
      kind: 'gift',
      count: 1,
      tier: 3,
    });
  });

  it('reads Bits from a cheer', () => {
    const cheer =
      '@bits=250;display-name=Cheerer;login=cheerer;mod=0 :cheerer!cheerer@cheerer.tmi.twitch.tv PRIVMSG #channel :Cheer250 go';
    expect(twitchEvent(line(cheer), new Map())).toEqual({
      kind: 'bits',
      platform: 'twitch',
      name: 'Cheerer',
      amount: 250,
      message: 'Cheer250 go',
    });
  });

  it('reads a raid', () => {
    // Twitch's docs example; raids are rare enough that the live probe caught none.
    const raid =
      '@badge-info=;badges=turbo/1;color=#9ACD32;display-name=TestChannel;emotes=;id=3d830f12;login=testchannel;mod=0;msg-id=raid;msg-param-displayName=TestChannel;msg-param-login=testchannel;msg-param-viewerCount=15;room-id=33332222;subscriber=0;system-msg=15\\sraiders\\sfrom\\sTestChannel\\shave\\sjoined\\n!;tmi-sent-ts=1507246572675;turbo=1;user-id=123456;user-type= :tmi.twitch.tv USERNOTICE #othertestchannel';
    expect(twitchEvent(line(raid), new Map())).toEqual({
      kind: 'raid',
      platform: 'twitch',
      name: 'TestChannel',
      viewers: 15,
    });
  });

  it('takes commands from mods and the broadcaster only', () => {
    const say = (tags: string, text: string) =>
      line(`@${tags} :u!u@u.tmi.twitch.tv PRIVMSG #channel :${text}`);
    expect(twitchEvent(say('badges=moderator/1;mod=1', '!subathon add 5m'), new Map())).toEqual({
      kind: 'mod',
      platform: 'twitch',
      text: '!subathon add 5m',
    });
    expect(twitchEvent(say('badges=broadcaster/1;mod=0', '!goal set 20'), new Map())).toMatchObject(
      { text: '!goal set 20' },
    );
    expect(twitchEvent(say('badges=subscriber/1;mod=0', '!subathon add 5h'), new Map())).toBeNull();
    // Repeated through Chatterino, which adds " U+034F" to get past Twitch's duplicate block.
    expect(
      twitchEvent(say('badges=moderator/1;mod=1', '!subathon add 5m \u034F'), new Map()),
    ).toMatchObject({ text: '!subathon add 5m' });
    // A mod just chatting isn't a command for anyone.
    expect(twitchEvent(say('badges=moderator/1;mod=1', 'hello chat'), new Map())).toBeNull();
  });

  it("ignores a Shared Chat partner channel's cheers and mods", () => {
    const partner =
      '@badges=moderator/1;bits=500;mod=1;room-id=1;source-room-id=2 :u!u@u.tmi.twitch.tv PRIVMSG #channel :Cheer500';
    expect(twitchEvent(line(partner), new Map())).toBeNull();
    const own = partner.replace('source-room-id=2', 'source-room-id=1');
    expect(twitchEvent(line(own), new Map())).toMatchObject({ kind: 'bits', amount: 500 });
  });

  it('ignores other notices', () => {
    const milestone =
      '@display-name=Viewer;msg-id=viewermilestone;msg-param-value=5 :tmi.twitch.tv USERNOTICE #channel';
    expect(twitchEvent(line(milestone), new Map())).toBeNull();
  });
});

describe('kickSubathonChannels', () => {
  it('listens where kick.com gets subs, gifts and Kicks', () => {
    expect(kickSubathonChannels('42', '7')).toEqual([
      'chatrooms.42.v2',
      'chatroom_42',
      'channel_7',
    ]);
    expect(kickSubathonChannels('42', null)).toEqual(['chatrooms.42.v2', 'chatroom_42']);
  });
});

describe('kickEvent', () => {
  it('counts a sub once whichever of its two events arrives, or both', () => {
    const dedupe = createKickDedupe();
    const sub = kickEvent(
      'App\\Events\\SubscriptionEvent',
      { chatroom_id: 1, username: 'Viewer', months: 5 },
      dedupe,
      0,
    );
    expect(sub).toEqual({ kind: 'sub', platform: 'kick', name: 'Viewer', tier: 1, months: 5 });
    const pair = { user_ids: [9], username: 'viewer', channel_id: 7 };
    expect(kickEvent('App\\Events\\ChannelSubscriptionEvent', pair, dedupe, 500)).toBeNull();

    const onlyChannel = kickEvent(
      'App\\Events\\ChannelSubscriptionEvent',
      { user_ids: [8], username: 'Other', channel_id: 7 },
      dedupe,
      1000,
    );
    expect(onlyChannel).toMatchObject({ kind: 'sub', name: 'Other' });
  });

  it('passes the months on when they come second, as a repeat of the sub', () => {
    const dedupe = createKickDedupe();
    const channel = { user_ids: [9], username: 'Viewer', channel_id: 7 };
    expect(kickEvent('App\\Events\\ChannelSubscriptionEvent', channel, dedupe, 0)).toEqual({
      kind: 'sub',
      platform: 'kick',
      name: 'Viewer',
      tier: 1,
    });
    const withMonths = { chatroom_id: 1, username: 'Viewer', months: 19 };
    expect(kickEvent('App\\Events\\SubscriptionEvent', withMonths, dedupe, 300)).toMatchObject({
      kind: 'sub',
      months: 19,
      again: 'repeat',
    });
  });

  it('reads a resub shared in chat, with its months and text', () => {
    const celebration = {
      content: 'love it',
      type: 'celebration',
      sender: { username: 'Fan', identity: { badges: [{ type: 'subscriber', count: 19 }] } },
      metadata: { celebration: { type: 'subscription_renewed', total_months: 19 } },
    };
    expect(kickEvent('App\\Events\\ChatMessageEvent', celebration, createKickDedupe())).toEqual({
      kind: 'sub',
      platform: 'kick',
      name: 'Fan',
      tier: 1,
      months: 19,
      message: 'love it',
      again: 'shared',
    });
  });

  it('counts the same viewer again for a later sub', () => {
    const dedupe = createKickDedupe();
    const sub = { username: 'Viewer' };
    expect(kickEvent('App\\Events\\SubscriptionEvent', sub, dedupe, 0)).not.toBeNull();
    expect(kickEvent('App\\Events\\SubscriptionEvent', sub, dedupe, 120_000)).not.toBeNull();
  });

  it('counts a chunked gift once', () => {
    const dedupe = createKickDedupe();
    const chunk = (index: number) => ({
      gifter_username: 'Gifter',
      gifted_total: 150,
      gifted_usernames: ['a'],
      chunk_details: { correlation_id: 'c1', chunk_index: index, total_chunks: 2 },
    });
    expect(kickEvent('GiftedSubscriptionsEvent', chunk(0), dedupe)).toEqual({
      kind: 'gift',
      platform: 'kick',
      name: 'Gifter',
      count: 150,
      tier: 1,
    });
    expect(kickEvent('GiftedSubscriptionsEvent', chunk(1), dedupe)).toBeNull();
  });

  it('counts a repeated gift event once', () => {
    const dedupe = createKickDedupe();
    const gift = {
      gifter_username: 'G',
      gifted_usernames: ['a'],
      gifted_total: 1,
      chunk_details: null,
    };
    expect(kickEvent('GiftedSubscriptionsEvent', gift, dedupe, 0)).not.toBeNull();
    expect(kickEvent('GiftedSubscriptionsEvent', gift, dedupe, 2_000)).toBeNull();
    expect(kickEvent('GiftedSubscriptionsEvent', gift, dedupe, 30_000)).not.toBeNull();
  });

  it('reads Kicks and skips a repeated transaction', () => {
    const dedupe = createKickDedupe();
    const kicks = {
      gift_transaction_id: 'b25e2011',
      sender: { id: 1, username: 'Fan', username_color: '#E9113C' },
      gift: { gift_id: 'full_send', name: 'Full Send', amount: 100, type: 'BASIC', tier: 'BASIC' },
      created_at: '2026-09-13T22:13:52.656Z',
    };
    expect(kickEvent('KicksGifted', kicks, dedupe)).toEqual({
      kind: 'bits',
      platform: 'kick',
      name: 'Fan',
      amount: 100,
      message: '',
    });
    expect(kickEvent('KicksGifted', kicks, dedupe)).toBeNull();
    const withMessage = { ...kicks, gift_transaction_id: 'c0ffee', message: 'gg' };
    expect(kickEvent('KicksGifted', withMessage, dedupe)).toMatchObject({ message: 'gg' });
  });

  it('reads a raid from StreamHostEvent', () => {
    const host = {
      chatroom_id: 5,
      optional_message: '',
      number_viewers: 9,
      host_username: 'raider',
    };
    expect(kickEvent('App\\Events\\StreamHostEvent', host, createKickDedupe())).toEqual({
      kind: 'raid',
      platform: 'kick',
      name: 'raider',
      viewers: 9,
    });
  });

  it('takes commands from mods and the broadcaster only', () => {
    const message = (type: string) => ({
      content: '!subathon set 1h',
      sender: { username: 'u', identity: { badges: [{ type, text: type }] } },
    });
    expect(
      kickEvent('App\\Events\\ChatMessageEvent', message('moderator'), createKickDedupe()),
    ).toEqual({ kind: 'mod', platform: 'kick', text: '!subathon set 1h' });
    expect(
      kickEvent('App\\Events\\ChatMessageEvent', message('broadcaster'), createKickDedupe()),
    ).not.toBeNull();
    expect(
      kickEvent('App\\Events\\ChatMessageEvent', message('vip'), createKickDedupe()),
    ).toBeNull();
  });
});
