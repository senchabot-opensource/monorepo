import { useLiveQuery } from '@tanstack/react-db';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';
import { z } from 'zod';
import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import { chatMessagesCollection } from '#/features/widgets/chat-widget/chat-messages';
import { KickBadge } from '#/features/widgets/chat-widget/kick-badges';
import { use7tvEmotes } from '#/features/widgets/chat-widget/use-7tv-emotes';
import { useTwitchBadges } from '#/features/widgets/chat-widget/use-badges';
import { useUnifiedChat } from '#/features/widgets/chat-widget/use-unified-chat';
import { getKickChannelInfo } from '#/lib/kick';
import { getAccessibleColor } from '#/features/widgets/chat-widget/color-utils';

const TTL_MS = 30_000;
// Must cover the 1s `now` tick, otherwise a row can expire without ever getting its fade-out class.
const EXIT_MS = 1_000;
const SHIFT_TRANSITION = 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';

const getReceivedAtMs = (msg: ChatMessagesType) =>
  msg.receivedAt?.getTime() ?? msg.timestamp.getTime();

type TwitchEmoteRange = { id: string; start: number; end: number };

const parseTwitchEmoteRanges = (emotesTag?: string): TwitchEmoteRange[] => {
  if (!emotesTag) return [];
  const ranges: TwitchEmoteRange[] = [];
  for (const part of emotesTag.split('/')) {
    const [id, positionsStr] = part.split(':');
    if (!id || !positionsStr) continue;
    for (const pos of positionsStr.split(',')) {
      const [startStr, endStr] = pos.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!Number.isNaN(start) && !Number.isNaN(end)) {
        ranges.push({ id, start, end });
      }
    }
  }
  return ranges.sort((a, b) => a.start - b.start);
};

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

const render7tvEmotes = (
  nodes: React.ReactNode,
  emoteMap: Map<string, string>,
): React.ReactNode[] => {
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
      const emoteId = emoteMap.get(part);
      if (emoteId) {
        result.push(
          <img
            key={`7tv-${emoteId}-${keyIndex++}`}
            src={`https://cdn.7tv.app/emote/${emoteId}/2x.webp`}
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

const searchSchema = z.object({
  twitch: z.string().optional(),
  kick: z.string().optional(),
  sevenTv: z.coerce.boolean().optional().default(true),
  badges: z.coerce.boolean().optional().default(true),
  fontSize: z.coerce.number().optional().default(18),
  background: z.coerce.boolean().optional(),
  itemBackground: z.coerce.boolean().optional(),
  boldUsernames: z.coerce.boolean().optional(),
  boldMessages: z.coerce.boolean().optional(),
  bgOpacity: z.coerce.number().min(0).max(1).optional().default(0.5),
  platformAccent: z.coerce.boolean().optional(),
  orientation: z.enum(['vertical', 'horizontal']).optional().default('vertical'),
  platformDisplay: z.enum(['name', 'icon']).optional().default('icon'),
  timestamp: z.coerce.boolean().optional(),
  keep: z.coerce.boolean().optional(),
  font: z
    .enum(['inter', 'roboto', 'nunito', 'mono', 'serif', 'system'])
    .optional()
    .default('inter'),
  layout: z.enum(['inline', 'stacked', 'card', 'compact']).optional().default('inline'),
  mock: z.coerce.boolean().optional(),
  animation: z
    .enum(['slide', 'pop', 'bounce', 'stagger', 'fade', 'typing', 'none'])
    .optional()
    .default('slide'),
});

type FontChoice = z.infer<typeof searchSchema>['font'];
type LayoutChoice = z.infer<typeof searchSchema>['layout'];
type AnimationChoice = z.infer<typeof searchSchema>['animation'];

const FONT_STACKS: Record<FontChoice, string> = {
  inter: '"Inter", ui-sans-serif, system-ui, sans-serif',
  roboto: '"Roboto", ui-sans-serif, system-ui, sans-serif',
  nunito: '"Nunito", ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  serif: '"Source Serif 4", ui-serif, Georgia, serif',
  system: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};

const FONT_GOOGLE_FAMILIES: Partial<Record<FontChoice, string>> = {
  inter: 'Inter:wght@400;500;600;700',
  roboto: 'Roboto:wght@400;500;700',
  nunito: 'Nunito:wght@400;600;800',
  mono: 'JetBrains+Mono:wght@400;500',
  serif: 'Source+Serif+4:wght@400;600',
};

const LAYOUT_CLASSES: Record<
  LayoutChoice,
  { wrapper: string; meta: string; name: string; message: string }
> = {
  inline: {
    wrapper: 'leading-tight whitespace-pre-wrap wrap-break-word text-left',
    meta: 'inline-flex items-center gap-1.5 mr-1.5 align-middle select-none',
    name: 'inline',
    message: 'inline',
  },
  stacked: {
    wrapper: 'grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-1.5 gap-y-0.5 text-left',
    meta: 'flex items-center justify-end gap-1.5 whitespace-nowrap min-w-[96px]',
    name: 'inline leading-none',
    message: 'block leading-snug col-start-2 wrap-break-word',
  },
  card: {
    wrapper:
      'rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-left shadow-sm grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-1.5 gap-y-0.5',
    meta: 'flex items-center justify-end gap-1.5 whitespace-nowrap min-w-[96px]',
    name: 'inline leading-none text-sm',
    message: 'block leading-snug col-start-2 wrap-break-word',
  },
  compact: {
    wrapper: 'leading-none whitespace-pre-wrap wrap-break-word text-left',
    meta: 'inline-flex items-center gap-1.5 mr-1.5 align-middle select-none',
    name: 'inline',
    message: 'inline',
  },
};

const ANIMATION_CLASSES: Record<
  AnimationChoice,
  (orientation: 'vertical' | 'horizontal') => string
> = {
  slide: () => 'animate-chat-slide-in',
  pop: () => 'animate-chat-pop-in',
  bounce: () => 'animate-chat-bounce-in',
  stagger: () => 'animate-chat-stagger-meta',
  fade: () => 'animate-chat-fade-in',
  typing: () => 'animate-chat-fade-in',
  none: () => '',
};

const ANIMATION_MESSAGE_CLASSES: Record<AnimationChoice, string> = {
  slide: '',
  pop: '',
  bounce: '',
  stagger: 'animate-chat-stagger-message',
  fade: '',
  typing: '',
  none: '',
};

const TYPING_MS_PER_CHAR = 35;
// Long messages type faster so no message takes longer than this to finish.
const TYPING_MAX_MS = 1_500;

// Grapheme clusters, so emoji like 🏴‍☠️ are never shown half-typed.
const splitGraphemes = (text: string): string[] =>
  typeof Intl.Segmenter === 'function'
    ? Array.from(
        new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text),
        (s) => s.segment,
      )
    : Array.from(text);

function TypedContent({ nodes }: { nodes: React.ReactNode[] }) {
  const units = React.useMemo(
    () =>
      nodes.flatMap((node) => {
        if (node == null || typeof node === 'boolean' || node === '') return [];
        return typeof node === 'string' ? splitGraphemes(node) : [node];
      }),
    [nodes],
  );
  const [count, setCount] = React.useState(0);
  // Kept across effect restarts so a late emote-map load doesn't retype the message from scratch.
  const startRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    startRef.current ??= performance.now();
    const start = startRef.current;
    const msPerUnit = Math.min(TYPING_MS_PER_CHAR, TYPING_MAX_MS / Math.max(units.length, 1));
    const id = window.setInterval(() => {
      const next = Math.min(units.length, Math.ceil((performance.now() - start) / msPerUnit));
      setCount(next);
      if (next >= units.length) window.clearInterval(id);
    }, 30);
    return () => window.clearInterval(id);
  }, [units.length]);

  if (count >= units.length) return <>{nodes}</>;

  const caretUnit = count > 0 ? units[count - 1] : null;
  // The untyped rest stays in the layout (just invisible) so the row has its final size from the
  // first frame; otherwise every wrapped line would push older rows up again.
  return (
    <>
      {units.slice(0, Math.max(count - 1, 0))}
      {typeof caretUnit === 'string' ? (
        <span className="chat-typing-caret">{caretUnit}</span>
      ) : (
        caretUnit
      )}
      <span style={{ visibility: 'hidden' }}>{units.slice(count)}</span>
    </>
  );
}

const PLATFORM_COLORS: Record<'twitch' | 'kick', string> = {
  twitch: '#9146FF',
  kick: '#53FC18',
};

const GOOGLE_FONTS_LINK_ID = 'chat-widget-google-fonts';
const GOOGLE_FONTS_PRECONNECT_ID = 'chat-widget-google-fonts-preconnect';

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

export const Route = createFileRoute('/widgets/chat-widget')({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    kick: search.kick,
  }),
  component: RouteComponent,
  loader: async ({ deps }) => {
    if (!deps.kick) {
      return { kick: null, kickSubBadges: [] };
    }

    const info = await getKickChannelInfo(deps.kick);
    return {
      kick: info.chatroomId,
      kickSubBadges: info.subscriberBadges || [],
    };
  },
});

function TwitchIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block h-[1.15em] w-[1.15em] ${className ?? ''}`}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M4.265 3L3 6.236v13.223h4.502V21l2.531.85l2.392-2.391h3.658l4.923-4.924V3zm15.052 10.691l-2.813 2.814h-4.502l-2.391 2.391v-2.391H5.813V4.688h13.504zm-2.812-5.767v4.923h-1.688V7.924zm-4.502 0v4.923h-1.688V7.924z"
      />
    </svg>
  );
}

function KickIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`inline-block h-[1.15em] w-[1.15em] ${className ?? ''}`}
      {...props}
    >
      <title>Kick</title>
      <path d="M1.333 0h8v5.333H12V2.667h2.667V0h8v8H20v2.667h-2.667v2.666H20V16h2.667v8h-8v-2.667H12v-2.666H9.333V24h-8Z" />
    </svg>
  );
}

function PlatformIcon({ platform }: { platform: 'twitch' | 'kick' }) {
  if (platform === 'twitch') {
    return <TwitchIcon />;
  }

  return <KickIcon />;
}

function RouteComponent() {
  const search = Route.useSearch();
  const { kick, kickSubBadges } = Route.useLoaderData();
  const twitchBadgeMap = useTwitchBadges(search.twitch);

  const isMock = Boolean(search.mock || (!search.twitch && !kick));

  const showPlatformIndicator = Boolean(
    (search.twitch && search.kick) ||
      isMock ||
      search.platformDisplay === 'name' ||
      search.platformDisplay === 'icon'
  );

  const sevenTvEmoteMap = use7tvEmotes(search.sevenTv ? search.twitch : null);

  useUnifiedChat(search.twitch, kick);

  React.useEffect(() => {
    if (!isMock) return;

    const mockMessagesData: Array<{
      user: string;
      color: string;
      platform: 'twitch' | 'kick';
      badges?: string[];
      message: string;
    }> = [
      {
        user: 'MonkeyDLuffy',
        color: '#FF4500',
        platform: 'twitch',
        badges: ['broadcaster'],
        message: 'GOMU GOMU NO... GG! 🍖🏴‍☠️',
      },
      {
        user: 'Goku',
        color: '#FFA500',
        platform: 'kick',
        badges: ['broadcaster'],
        message: 'That clutch power level is over 9000! 💥🔥',
      },
      {
        user: 'GojoSatoru',
        color: '#00BFFF',
        platform: 'twitch',
        badges: ['moderator', 'vip'],
        message: 'Throughout heaven and earth, this stream alone is honored 🤞✨',
      },
      {
        user: 'RoronoaZoro',
        color: '#22C55E',
        platform: 'kick',
        badges: ['subscriber'],
        message: 'Wait... which stream is this? I got lost again ⚔️🧭',
      },
      {
        user: 'NarutoUzumaki',
        color: '#FF8C00',
        platform: 'twitch',
        badges: ['vip', 'subscriber'],
        message: 'Believe it! Best stream on the platform dattebayo! 🍜🍥',
      },
      {
        user: 'Tanjiro',
        color: '#20B2AA',
        platform: 'kick',
        badges: ['subscriber'],
        message: 'Total Concentration... Gaming Breathing, First Form! 🌊⚔️',
      },
      {
        user: 'Frieren',
        color: '#E0E7FF',
        platform: 'twitch',
        badges: ['subscriber'],
        message: "I've been watching this stream for only 80 years, time flies 🪄⏳",
      },
      {
        user: 'AnyaForger',
        color: '#FF69B4',
        platform: 'kick',
        badges: ['vip'],
        message: 'WAKU WAKU!! Peanut power activated! 🥜✨',
      },
      {
        user: 'SungJinwoo',
        color: '#9333EA',
        platform: 'twitch',
        badges: ['broadcaster', 'subscriber'],
        message: 'Arise... and drop a follow! 👑🗡️',
      },
      {
        user: 'LeviAckerman',
        color: '#10B981',
        platform: 'twitch',
        badges: ['moderator'],
        message: 'Clean gameplay and incredible focus! ✨🎮',
      },
      {
        user: 'Nezuko',
        color: '#FF69B4',
        platform: 'kick',
        badges: ['moderator'],
        message: "Mmm-hmm! Let's go team! 🌸🎋",
      },
      {
        user: 'Killua',
        color: '#38BDF8',
        platform: 'twitch',
        badges: ['subscriber', 'vip'],
        message: 'Clip that lightning fast clutch right now! ⚡🐱',
      },
      {
        user: 'Denji',
        color: '#F59E0B',
        platform: 'kick',
        badges: ['subscriber'],
        message: "LET'S GOOOOO TOAST AND JAM ENERGY! 🍞✨",
      },
      {
        user: 'Chopper',
        color: '#38BDF8',
        platform: 'twitch',
        badges: ['vip'],
        message: 'Senchabot makes the stream so colorful and fun! 🌸🩺',
      },
      {
        user: 'Saitama',
        color: '#FACC15',
        platform: 'kick',
        badges: ['subscriber'],
        message: 'One punch victory! Just a gamer having fun 🥊🥚',
      },
      {
        user: 'Senchabot',
        color: '#00DB84',
        platform: 'twitch',
        badges: ['moderator'],
        message: '!uptime | Welcome friends to the stream! 🍵🚀',
      },
    ];

    let messageCounter = 0;
    const insertedIds: string[] = [];

    const insertNextMock = () => {
      const item = mockMessagesData[messageCounter % mockMessagesData.length];
      const id = `mock-${Date.now()}-${messageCounter}`;
      messageCounter++;
      insertedIds.push(id);

      chatMessagesCollection.insert({
        id,
        user: item.user,
        message: item.message,
        platform: item.platform,
        timestamp: new Date(),
        color: item.color,
        badges: item.badges,
        receivedAt: new Date(),
        userLower: item.user.toLowerCase(),
      });

      if (insertedIds.length > 20) {
        const oldestId = insertedIds.shift();
        if (oldestId) {
          chatMessagesCollection.delete(oldestId);
        }
      }
    };

    const firstTimer = setTimeout(insertNextMock, 400);
    const interval = setInterval(insertNextMock, 3000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
      for (const id of insertedIds) {
        chatMessagesCollection.delete(id);
      }
    };
  }, [isMock]);

  const [now, setNow] = React.useState(() => Date.now());
  const listRef = React.useRef<HTMLDivElement>(null);
  const lastIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const family = FONT_GOOGLE_FAMILIES[search.font];
    if (!family) {
      document.getElementById(GOOGLE_FONTS_LINK_ID)?.remove();
      document.getElementById(GOOGLE_FONTS_PRECONNECT_ID)?.remove();
      return;
    }
    let preconnect = document.getElementById(GOOGLE_FONTS_PRECONNECT_ID) as HTMLLinkElement | null;
    if (!preconnect) {
      preconnect = document.createElement('link');
      preconnect.id = GOOGLE_FONTS_PRECONNECT_ID;
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnect);
    }
    let link = document.getElementById(GOOGLE_FONTS_LINK_ID) as HTMLLinkElement | null;
    const nextHref = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
    if (!link) {
      link = document.createElement('link');
      link.id = GOOGLE_FONTS_LINK_ID;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (link.href !== nextHref) {
      link.href = nextHref;
    }
    return () => {
      document.getElementById(GOOGLE_FONTS_LINK_ID)?.remove();
      document.getElementById(GOOGLE_FONTS_PRECONNECT_ID)?.remove();
    };
  }, [search.font]);

  const { data: messages } = useLiveQuery((q) =>
    q
      .from({ collection: chatMessagesCollection })
      .orderBy(({ collection }) => collection.receivedAt),
  );

  const visibleMessages = search.keep
    ? messages
    : messages.filter((msg) => now - getReceivedAtMs(msg) < TTL_MS);
  const fadeOut = !search.keep && search.animation !== 'none';

  const hasVisibleMessages = visibleMessages.length > 0;

  React.useEffect(() => {
    if (search.keep || !hasVisibleMessages) {
      return;
    }

    setNow(Date.now());
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasVisibleMessages, search.keep]);

  // The list is anchored to the bottom (right when horizontal), so appending a row makes every
  // older row jump by its size. Offset the list back by that jump, then transition it to rest.
  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const horizontal = search.orientation === 'horizontal';
    // Measured from the new rows themselves rather than a stored position, so a late image load
    // that resized an older row is not replayed as a shift.
    const endOf = (el: HTMLElement) =>
      horizontal ? el.offsetLeft + el.offsetWidth : el.offsetTop + el.offsetHeight;

    const prevId = lastIdRef.current;
    const last = list.lastElementChild as HTMLElement | null;
    lastIdRef.current = last?.dataset.msgId ?? null;
    if (!prevId || !last || prevId === lastIdRef.current || search.animation === 'none') return;

    const prevEl = list.querySelector<HTMLElement>(`[data-msg-id="${CSS.escape(prevId)}"]`);
    if (!prevEl) return;
    const shift = endOf(last) - endOf(prevEl);
    if (shift <= 0) return;

    // Carry over what is left of a shift that is still running so back-to-back messages don't jump.
    const running = new DOMMatrixReadOnly(getComputedStyle(list).transform);
    const start = shift + (horizontal ? running.m41 : running.m42);
    list.style.transition = 'none';
    list.style.transform = horizontal ? `translateX(${start}px)` : `translateY(${start}px)`;
    void list.offsetWidth;
    list.style.transition = SHIFT_TRANSITION;
    list.style.transform = '';
  });

  const horizontal = search.orientation === 'horizontal';

  // Rows overflow toward the start edge, which is never scrollable, so clip instead of scroll:
  // a scrollable box would flash a scrollbar while the list is offset during the shift.
  return (
    <div
      className={`flex ${horizontal ? 'flex-row justify-end items-center min-w-full h-screen p-2' : 'flex-col justify-end h-screen w-full p-2.5'} overflow-clip text-white rounded-md`}
      style={{
        fontSize: `${search.fontSize}px`,
        fontFamily: FONT_STACKS[search.font],
        backgroundColor: search.background ? `rgba(0, 0, 0, ${search.bgOpacity})` : 'transparent',
      }}
    >
      <div
        ref={listRef}
        className={`flex ${horizontal ? 'flex-row items-center space-x-3' : 'flex-col space-y-2'}`}
      >
        {visibleMessages.map((msg) => (
          <MessageRow
            key={msg.id}
            msg={msg}
            exiting={fadeOut && now - getReceivedAtMs(msg) >= TTL_MS - EXIT_MS}
            layout={search.layout}
            animation={search.animation}
            orientation={search.orientation}
            showTimestamp={Boolean(search.timestamp)}
            showPlatformIndicator={showPlatformIndicator}
            platformDisplay={search.platformDisplay}
            twitchBadgeMap={twitchBadgeMap}
            kickSubBadges={kickSubBadges}
            sevenTvEmoteMap={sevenTvEmoteMap}
            showBadges={Boolean(search.badges)}
            hasBackground={Boolean(search.background)}
            itemBackground={Boolean(search.itemBackground)}
            bgOpacity={search.bgOpacity}
            platformAccent={Boolean(search.platformAccent)}
            boldUsernames={Boolean(search.boldUsernames)}
            boldMessages={Boolean(search.boldMessages)}
          />
        ))}
      </div>
    </div>
  );
}

type MessageRowProps = {
  msg: ChatMessagesType;
  exiting: boolean;
  layout: LayoutChoice;
  animation: AnimationChoice;
  orientation: 'vertical' | 'horizontal';
  showTimestamp: boolean;
  showPlatformIndicator: boolean;
  platformDisplay: 'name' | 'icon';
  twitchBadgeMap: Map<string, string> | null | undefined;
  kickSubBadges: {
    months?: number;
    badge_image?: { src?: string };
  }[];
  sevenTvEmoteMap: Map<string, string>;
  showBadges: boolean;
  hasBackground: boolean;
  itemBackground: boolean;
  bgOpacity: number;
  platformAccent: boolean;
  boldUsernames: boolean;
  boldMessages: boolean;
};

const MessageRow = React.memo(function MessageRow({
  msg,
  exiting,
  layout,
  animation,
  orientation,
  showTimestamp,
  showPlatformIndicator,
  platformDisplay,
  twitchBadgeMap,
  kickSubBadges,
  sevenTvEmoteMap,
  showBadges,
  hasBackground,
  itemBackground,
  bgOpacity,
  platformAccent,
  boldUsernames,
  boldMessages,
}: MessageRowProps) {
  const classes = LAYOUT_CLASSES[layout];
  const animClass = exiting ? 'animate-chat-fade-out' : ANIMATION_CLASSES[animation](orientation);
  const messageAnimClass = ANIMATION_MESSAGE_CLASSES[animation];
  const compactSize = layout === 'compact' ? '0.875em' : undefined;
  const isInlineOrCompact = layout === 'inline' || layout === 'compact';
  const itemBgClass = itemBackground
    ? 'rounded-md border border-white/10 px-2.5 py-1'
    : '';
  const itemBgStyle: React.CSSProperties | undefined = itemBackground
    ? { backgroundColor: `rgba(0, 0, 0, ${bgOpacity})` }
    : undefined;
  // Card and item-background boxes already have horizontal padding; plain rows need room for the stripe.
  const wrapperStyle: React.CSSProperties | undefined = platformAccent
    ? {
        ...itemBgStyle,
        borderLeft: `2px solid ${PLATFORM_COLORS[msg.platform]}`,
        paddingLeft: itemBackground || layout === 'card' ? undefined : '0.5em',
      }
    : itemBgStyle;
  const accessibleColor = React.useMemo(
    () => getAccessibleColor(msg.color, true) || msg.color || 'unset',
    [msg.color],
  );
  const hasAnyBackground = hasBackground || itemBackground;
  const shadowStyle = hasAnyBackground
    ? '1px 1px 1px rgba(0, 0, 0)'
    : '0 1px 1px #000, 1px 1px 1px rgba(0, 0, 0), 1px 1px 1px rgba(0, 0, 0)';
  const userNameStyle: React.CSSProperties = React.useMemo(
    () => ({
      color: accessibleColor,
      textShadow: '1px 1px 1px rgba(0, 0, 0)',
      fontSize: compactSize,
      fontWeight: boldUsernames ? 700 : undefined,
    }),
    [accessibleColor, compactSize, boldUsernames],
  );
  const messageStyle: React.CSSProperties = React.useMemo(
    () => ({
      textShadow: shadowStyle,
      fontSize: compactSize,
      fontWeight: boldMessages ? 600 : undefined,
    }),
    [compactSize, boldMessages],
  );

  const parsedContent = React.useMemo(
    () => render7tvEmotes(parseEmotes(msg.message, msg.platform, msg.emotes), sevenTvEmoteMap),
    [msg.message, msg.platform, msg.emotes, sevenTvEmoteMap],
  );

  const badgesNode = showBadges && msg.badges && msg.badges.length > 0 && (
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

  const timestampNode = showTimestamp && (
    <span className="text-zinc-400 text-xs">
      {msg.timestamp.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </span>
  );

  const platformNode = showPlatformIndicator && (
    <span
      className="inline-flex items-center data-[platform=twitch]:text-purple-500 data-[platform=kick]:text-green-500"
      data-platform={msg.platform}
    >
      {platformDisplay === 'icon' ? <PlatformIcon platform={msg.platform} /> : `[${msg.platform}]`}
    </span>
  );

  const userNameNode = (
    <span className={`${classes.name}`} style={userNameStyle}>
      {msg.user}:
    </span>
  );

  const messageNode = (
    <span className={`${classes.message} ${messageAnimClass}`} style={messageStyle}>
      {layout === 'inline' || layout === 'compact' ? ' ' : null}
      {animation === 'typing' ? <TypedContent nodes={parsedContent} /> : parsedContent}
    </span>
  );

  return (
    <div
      data-msg-id={msg.id}
      className={`${classes.wrapper} ${itemBgClass} ${animClass} transform-gpu ${orientation === 'horizontal' ? 'flex-shrink-0' : ''}`}
      style={wrapperStyle}
    >
      {isInlineOrCompact ? (
        <>
          <div className={classes.meta}>
            {timestampNode}
            {platformNode}
            {badgesNode}
          </div>
          <span>
            {userNameNode}
            {messageNode}
          </span>
        </>
      ) : (
        <>
          <div className={classes.meta}>
            {timestampNode}
            {platformNode}
            {badgesNode}
          </div>
          {userNameNode}
        </>
      )}
      {!isInlineOrCompact && messageNode}
    </div>
  );
});
