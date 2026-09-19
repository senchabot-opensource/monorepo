import type React from 'react';
import { parseTwitchEmoteRanges } from '#/lib/twitch-emotes';
import type { ChatMessagesType } from './chat-messages';
import { KickBadge } from './kick-badges';
import type { EmoteMap } from './use-channel-emotes';

// Message pieces shared by the chat overlay and the Chat Reader tool.

const renderTwitchEmotes = (text: string, emotesTag?: string) => {
  const ranges = parseTwitchEmoteRanges(emotesTag);
  if (ranges.length === 0) return text;

  const chars = [...text];
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const range of ranges) {
    if (range.start > lastIndex) {
      elements.push(chars.slice(lastIndex, range.start).join(''));
    }
    elements.push(
      <img
        key={`${range.id}-${range.start}`}
        src={`https://static-cdn.jtvnw.net/emoticons/v2/${range.id}/default/dark/1.0`}
        alt="emote"
        decoding="async"
        className="inline-block h-[1em] w-auto mx-0.5 align-middle object-contain"
      />,
    );
    lastIndex = range.end + 1;
  }

  if (lastIndex < chars.length) {
    elements.push(chars.slice(lastIndex).join(''));
  }

  return elements;
};

export const parseEmotes = (text: string, platform: 'twitch' | 'kick', emotes?: string) => {
  if (platform === 'kick') {
    const kickEmoteRegex = /\[emote:(\d+):([\w\d\-_]+)\]/g;

    return text.split(kickEmoteRegex).map((part, index) => {
      if (index % 3 === 1) {
        const id = part;
        return (
          <img
            key={`${id}-${index.toString()}`}
            src={`https://files.kick.com/emotes/${id}/fullsize`}
            alt="emote"
            decoding="async"
            className="inline-block h-[1em] w-[1em] mx-1 align-middle object-contain"
          />
        );
      }
      if (index % 3 === 2) return null;
      return part;
    });
  }

  if (platform === 'twitch') {
    return renderTwitchEmotes(text, emotes);
  }

  return text;
};

// 7TV, BTTV and FFZ emotes are plain words in the text, matched against the channel's emote map.
export const renderThirdPartyEmotes = (nodes: React.ReactNode, emoteMap: EmoteMap): React.ReactNode[] => {
  if (emoteMap.size === 0) {
    return Array.isArray(nodes) ? nodes : [nodes];
  }

  const result: React.ReactNode[] = [];
  const input = Array.isArray(nodes) ? nodes : [nodes];
  let keyIndex = 0;

  for (const node of input) {
    if (typeof node !== 'string') {
      result.push(node);
      continue;
    }

    // Split by whitespace so only exact full words match emotes
    const parts = node.split(/(\s+)/);

    for (const part of parts) {
      if (part === '') continue;
      const emoteUrl = emoteMap.get(part);
      if (emoteUrl) {
        result.push(
          <img
            key={`emote-${keyIndex++}`}
            src={emoteUrl}
            alt={part}
            decoding="async"
            className="inline-block h-[1em] w-auto mx-0.5 align-middle object-contain"
          />,
        );
      } else {
        result.push(part);
      }
    }
  }

  return result;
};

const FALLBACK_TWITCH_BADGES: Record<string, string> = {
  broadcaster: 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1',
  moderator: 'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1',
  vip: 'https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/1',
  subscriber: 'https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/1',
  bot: 'https://static-cdn.jtvnw.net/badges/v1/3ffa9565-c35b-4cad-800b-041e60659cf2/1',
  staff: 'https://static-cdn.jtvnw.net/badges/v1/d97c37bd-a6f5-4c38-8f57-4e4bef88af34/1',
  admin: 'https://static-cdn.jtvnw.net/badges/v1/9ef7e029-4cdf-4d4d-a0d5-e2b3fb2583fe/1',
  founder: 'https://static-cdn.jtvnw.net/badges/v1/511b78a9-ab37-472f-9569-457753bbe7d3/1',
  'sub-gifter': 'https://static-cdn.jtvnw.net/badges/v1/a5ef6c17-2e5b-4d8f-9b80-2779fd722414/1',
  bits: 'https://static-cdn.jtvnw.net/badges/v1/73b5c3fb-24f9-4a82-a852-2f475b59411c/1',
  premium: 'https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1',
  partner: 'https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1',
  turbo: 'https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/1',
  global_mod: 'https://static-cdn.jtvnw.net/badges/v1/9384c43e-4ce7-4e94-b2a1-b93656896eba/1',
  artist: 'https://static-cdn.jtvnw.net/badges/v1/4300a897-03dc-4e83-8c0e-c332fee7057f/1',
  ambassador: 'https://static-cdn.jtvnw.net/badges/v1/2cbc339f-34f4-488a-ae51-efdf74f4e323/1',
};

export type KickSubBadges = {
  months?: number;
  badge_image?: { src?: string };
}[];

export function MessageBadges({
  msg,
  twitchBadgeMap,
  kickSubBadges,
}: {
  msg: ChatMessagesType;
  twitchBadgeMap: Map<string, string> | null | undefined;
  kickSubBadges: KickSubBadges;
}) {
  if (!msg.badges || msg.badges.length === 0) return null;
  return (
    <span className="inline-flex shrink-0 items-center gap-1 align-middle select-none">
      {msg.badges.map((badge, idx) => {
        const isTwitch = msg.platform === 'twitch';
        if (!isTwitch) {
          return (
            <span key={`${msg.id}-badge-${idx}`} title={badge} className="inline-flex items-center">
              <KickBadge type={badge} subBadges={kickSubBadges} className="inline-block h-[1em] w-[1em] object-contain" />
            </span>
          );
        }
        const imageUrl =
          twitchBadgeMap?.get(badge) ?? FALLBACK_TWITCH_BADGES[badge.toLowerCase().split('/')[0]];
        if (!imageUrl) return null;
        return (
          <span key={`${msg.id}-badge-${idx}`} title={badge} className="inline-flex items-center">
            <img
              src={imageUrl}
              alt={badge}
              title={badge}
              decoding="async"
              className="inline-block h-[1em] w-[1em] object-contain"
            />
          </span>
        );
      })}
    </span>
  );
}

// Both viewBoxes are cropped horizontally to the glyph's own bounds: the stock 24x24 boxes pad
// Twitch 3 units but Kick only 1.33, so Kick sat visibly further left and closer to the badges.
export function TwitchIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block h-[1.15em] w-auto ${className ?? ''}`}
      viewBox="3 0 18.006 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M4.265 3L3 6.236v13.223h4.502V21l2.531.85l2.392-2.391h3.658l4.923-4.924V3zm15.052 10.691l-2.813 2.814h-4.502l-2.391 2.391v-2.391H5.813V4.688h13.504zm-2.812-5.767v4.923h-1.688V7.924zm-4.502 0v4.923h-1.688V7.924z"
      />
    </svg>
  );
}

export function KickIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      viewBox="1.333 0 21.334 24"
      fill="currentColor"
      className={`inline-block h-[1em] w-auto ${className ?? ''}`}
      {...props}
    >
      <title>Kick</title>
      <path d="M1.333 0h8v5.333H12V2.667h2.667V0h8v8H20v2.667h-2.667v2.666H20V16h2.667v8h-8v-2.667H12v-2.666H9.333V24h-8Z" />
    </svg>
  );
}

export function PlatformIcon({ platform }: { platform: 'twitch' | 'kick' }) {
  if (platform === 'twitch') {
    return <TwitchIcon />;
  }

  return <KickIcon />;
}
