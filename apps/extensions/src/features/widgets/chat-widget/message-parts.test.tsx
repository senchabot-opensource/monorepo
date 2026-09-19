import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ChatMessagesType } from './chat-messages';
import { MessageBadges, parseEmotes, renderThirdPartyEmotes } from './message-parts';

const html = (nodes: React.ReactNode) => render(<span>{nodes}</span>).container.firstElementChild;

const emoteIds = (nodes: React.ReactNode) =>
  [...(html(nodes)?.querySelectorAll('img') ?? [])].map((img) => img.getAttribute('src'));

describe('parseEmotes on Twitch', () => {
  it('counts positions in code points, so an emoji before an emote leaves it in place', () => {
    // Live: every one of 638 emote messages lined up with code points, 8 of them after emoji.
    const out = html(parseEmotes('😀 Kappa hi', 'twitch', '25:2-6'));
    expect(out?.textContent).toBe('😀  hi');
    expect(out?.querySelector('img')?.getAttribute('src')).toContain('/emoticons/v2/25/');
  });

  it('draws several emotes of several ids in text order', () => {
    const nodes = parseEmotes('Kappa x LUL y Kappa', 'twitch', '425618:8-10/25:0-4,14-18');
    expect(emoteIds(nodes).map((src) => src?.split('/')[5])).toEqual(['25', '425618', '25']);
    expect(html(nodes)?.textContent).toBe(' x  y ');
  });

  it('returns the text as it is without emotes or with a broken tag', () => {
    expect(parseEmotes('hi', 'twitch')).toBe('hi');
    expect(parseEmotes('hi', 'twitch', 'garbage')).toBe('hi');
    expect(parseEmotes('hi', 'twitch', '25:a-b')).toBe('hi');
  });

  it('keeps an emote at the very end and the very start', () => {
    expect(html(parseEmotes('Kappa', 'twitch', '25:0-4'))?.textContent).toBe('');
    expect(emoteIds(parseEmotes('a Kappa', 'twitch', '25:2-6'))).toHaveLength(1);
  });
});

describe('parseEmotes on Kick', () => {
  it('turns [emote:id:name] into the emote image and keeps the words around it', () => {
    const nodes = parseEmotes('hi [emote:37227:LULW] and [emote:3307478:confused-cat_2]', 'kick');
    expect(emoteIds(nodes)).toEqual([
      'https://files.kick.com/emotes/37227/fullsize',
      'https://files.kick.com/emotes/3307478/fullsize',
    ]);
    expect(html(nodes)?.textContent).toBe('hi  and ');
  });

  it('leaves text that only looks like an emote alone', () => {
    expect(html(parseEmotes('[emote:abc:x] [emote:1:]', 'kick'))?.textContent).toBe(
      '[emote:abc:x] [emote:1:]',
    );
  });
});

describe('renderThirdPartyEmotes', () => {
  const map = new Map([
    ['OMEGALUL', 'https://cdn.7tv.app/emote/1/2x.webp'],
    ['catJAM', 'https://cdn.7tv.app/emote/2/2x.webp'],
  ]);

  it('matches whole words only, keeping the spaces', () => {
    const nodes = renderThirdPartyEmotes('OMEGALUL  xcatJAM catJAM!', map);
    expect(emoteIds(nodes)).toEqual(['https://cdn.7tv.app/emote/1/2x.webp']);
    expect(html(nodes)?.textContent).toBe('  xcatJAM catJAM!');
  });

  it('looks inside the text between Twitch emotes and leaves their images be', () => {
    const nodes = renderThirdPartyEmotes(parseEmotes('Kappa catJAM', 'twitch', '25:0-4'), map);
    expect(emoteIds(nodes)).toHaveLength(2);
  });

  it('does not match a name inherited from Object', () => {
    expect(emoteIds(renderThirdPartyEmotes('constructor toString', map))).toEqual([]);
  });
});

describe('MessageBadges', () => {
  const msg = (platform: 'twitch' | 'kick', badges: string[]): ChatMessagesType => ({
    id: 'm',
    user: 'u',
    message: 'hi',
    platform,
    badges,
    timestamp: new Date(0),
    receivedAt: new Date(0),
  });

  it('prefers the channel badge image and falls back to the stock one', () => {
    const map = new Map([['subscriber/12', 'https://example.test/sub12.png']]);
    const { container } = render(
      <MessageBadges
        msg={msg('twitch', ['subscriber/12', 'moderator/1', 'mystery/1'])}
        twitchBadgeMap={map}
        kickSubBadges={[]}
      />,
    );
    const srcs = [...container.querySelectorAll('img')].map((img) => img.getAttribute('src'));
    expect(srcs[0]).toBe('https://example.test/sub12.png');
    expect(srcs[1]).toContain('3267646d');
    expect(srcs).toHaveLength(2);
  });

  it('picks the Kick subscriber badge for the months subscribed', () => {
    const subBadges = [
      { months: 1, badge_image: { src: 'https://example.test/1.png' } },
      { months: 6, badge_image: { src: 'https://example.test/6.png' } },
      { months: 12, badge_image: { src: 'https://example.test/12.png' } },
    ];
    const src = (badge: string) =>
      render(
        <MessageBadges
          msg={msg('kick', [badge])}
          twitchBadgeMap={null}
          kickSubBadges={subBadges}
        />,
      )
        .container.querySelector('img')
        ?.getAttribute('src');
    expect(src('subscriber/10')).toBe('https://example.test/6.png');
    expect(src('subscriber/12')).toBe('https://example.test/12.png');
    expect(src('subscriber/1')).toBe('https://example.test/1.png');
  });

  it('draws nothing for a message without badges', () => {
    expect(
      render(<MessageBadges msg={msg('kick', [])} twitchBadgeMap={null} kickSubBadges={[]} />)
        .container.innerHTML,
    ).toBe('');
  });
});
