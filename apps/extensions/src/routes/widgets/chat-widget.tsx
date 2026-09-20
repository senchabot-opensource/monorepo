import { useLiveQuery } from '@tanstack/react-db';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';
import { z } from 'zod';
import type { ChatMessagesType } from '#/features/widgets/chat-widget/chat-messages';
import { chatMessagesCollection } from '#/features/widgets/chat-widget/chat-messages';
import {
  getHighlightColors,
  getHighlightKind,
  type HighlightKind,
} from '#/features/widgets/chat-widget/highlights';
import { Frame, panelStyle } from '#/features/presets/frame';
import { rgba, type Skin, skinFor } from '#/features/presets/skin';
import { isHiddenMessage } from '#/features/widgets/chat-widget/message-filters';
import {
  type KickSubBadges,
  MessageBadges,
  PlatformIcon,
  parseEmotes,
  renderThirdPartyEmotes,
} from '#/features/widgets/chat-widget/message-parts';
import { type EmoteMap, useChannelEmotes } from '#/features/widgets/chat-widget/use-channel-emotes';
import { useTwitchBadges } from '#/features/widgets/chat-widget/use-badges';
import { useMockChat } from '#/features/widgets/chat-widget/use-mock-chat';
import { useUnifiedChat } from '#/features/widgets/chat-widget/use-unified-chat';
import {
  defaultFonts,
  type Font,
  FONT_CHOICES,
  type FONTS,
  parseHighlights,
} from '#/features/widgets/chat-widget/widget-settings';
import { useKickChannel } from '#/hooks/use-kick-channel';
import { clampedNumber } from '#/lib/url-params';
import { useT } from '#/lib/i18n';
import { getAccessibleColor } from '#/features/widgets/chat-widget/color-utils';

const DEFAULT_TTL_MS = 30_000;
// Must cover the 1s `now` tick, otherwise a row can expire without ever getting its fade-out class.
const EXIT_MS = 1_000;
const SHIFT_MS = 400;
// Busy chat speeds animations up so each one finishes before the next message lands: full speed
// when messages are SPEED_BASE_GAP_MS or more apart, scaled down with the gap, never below MIN_SPEED.
const SPEED_BASE_GAP_MS = 500;
const MIN_SPEED = 0.35;

const getReceivedAtMs = (msg: ChatMessagesType) =>
  msg.receivedAt?.getTime() ?? msg.timestamp.getTime();

const getAnimationSpeeds = (messages: ChatMessagesType[]) => {
  const speeds = new Map<string, number>();
  messages.forEach((msg, i) => {
    const gap = i > 0 ? getReceivedAtMs(msg) - getReceivedAtMs(messages[i - 1]) : Infinity;
    speeds.set(msg.id, Math.min(1, Math.max(MIN_SPEED, gap / SPEED_BASE_GAP_MS)));
  });
  return speeds;
};

const searchSchema = z.object({
  twitch: z.string().optional(),
  kick: z.string().optional(),
  // Unknown ids fall back to the classic look in skinFor.
  preset: z.string().optional(),
  sevenTv: z.coerce.boolean().optional().default(true),
  bttv: z.coerce.boolean().optional().default(true),
  ffz: z.coerce.boolean().optional().default(true),
  badges: z.coerce.boolean().optional().default(true),
  // Hand-edited values must never throw: that shows an error screen in OBS.
  fontSize: z.coerce.number().catch(18),
  background: z.coerce.boolean().optional(),
  itemBackground: z.coerce.boolean().optional(),
  boldUsernames: z.coerce.boolean().optional(),
  boldMessages: z.coerce.boolean().optional(),
  bgOpacity: clampedNumber(0, 1, 0.5),
  platformAccent: z.coerce.boolean().optional(),
  orientation: z.enum(['vertical', 'horizontal']).catch('vertical'),
  platformDisplay: z.enum(['name', 'icon', 'none']).catch('icon'),
  timestamp: z.coerce.boolean().optional(),
  keep: z.coerce.boolean().optional(),
  // Seconds a message stays; `keep` wins over it.
  duration: clampedNumber(1, Number.POSITIVE_INFINITY, undefined),
  hideBots: z.coerce.boolean().optional(),
  hideCommands: z.coerce.boolean().optional(),
  highlights: z.string().optional(),
  // Left open: what a missing font means depends on whether a preset is on, so it is resolved
  // in the component instead of here. `presetName`/`presetMessage` are the preset's own two.
  font: z.enum(FONT_CHOICES).optional().catch(undefined),
  userFont: z.enum(FONT_CHOICES).optional().catch(undefined),
  layout: z.enum(['inline', 'stacked', 'card', 'compact']).catch('inline'),
  mock: z.coerce.boolean().optional(),
  mockRate: clampedNumber(0.1, 50, undefined),
  animation: z
    .enum(['slide', 'smooth', 'pop', 'bounce', 'stagger', 'fade', 'typing', 'none'])
    .catch('slide'),
});

type SiteFont = (typeof FONTS)[number];
type LayoutChoice = z.infer<typeof searchSchema>['layout'];
type AnimationChoice = z.infer<typeof searchSchema>['animation'];

const FONT_STACKS: Record<SiteFont, string> = {
  inter: '"Inter", ui-sans-serif, system-ui, sans-serif',
  roboto: '"Roboto", ui-sans-serif, system-ui, sans-serif',
  nunito: '"Nunito", ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  serif: '"Source Serif 4", ui-serif, Georgia, serif',
  system: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};

const FONT_GOOGLE_FAMILIES: Partial<Record<SiteFont, string>> = {
  inter: 'Inter:wght@400;500;600;700',
  roboto: 'Roboto:wght@400;500;700',
  nunito: 'Nunito:wght@400;600;800',
  mono: 'JetBrains+Mono:wght@400;500',
  serif: 'Source+Serif+4:wght@400;600',
};

/** The CSS stack for one font choice; a preset's own two need the skin, the rest are static. */
function fontStack(choice: Font, skin: Skin | null): string {
  if (choice === 'presetName') return skin ? skin.display : FONT_STACKS.inter;
  if (choice === 'presetMessage') return skin ? skin.body : FONT_STACKS.inter;
  return FONT_STACKS[choice];
}

// `box` is the card's own background and border; a preset draws its own box instead.
const LAYOUT_CLASSES: Record<
  LayoutChoice,
  { wrapper: string; box: string; header: string; meta: string; name: string; message: string }
> = {
  inline: {
    wrapper: 'leading-tight whitespace-pre-wrap wrap-break-word text-left',
    box: '',
    header: 'mb-0.5',
    meta: 'inline-flex items-center gap-1.5 mr-1.5 align-middle select-none',
    name: 'inline',
    message: 'inline',
  },
  stacked: {
    wrapper: 'grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-1.5 gap-y-0.5 text-left',
    box: '',
    // Same column as the name and message: the badges are right-aligned, so col 1's left edge
    // would leave the label floating out past them.
    header: 'col-start-2',
    meta: 'flex items-center justify-end gap-1.5 whitespace-nowrap min-w-[96px]',
    name: 'inline leading-none',
    message: 'block leading-snug col-start-2 wrap-break-word',
  },
  card: {
    wrapper:
      'px-3 py-2 text-left grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-1.5 gap-y-0.5',
    box: 'rounded-lg bg-black/40 border border-white/10 shadow-sm',
    header: 'col-start-2',
    meta: 'flex items-center justify-end gap-1.5 whitespace-nowrap min-w-[96px]',
    name: 'inline leading-none text-sm',
    message: 'block leading-snug col-start-2 wrap-break-word',
  },
  compact: {
    wrapper: 'leading-none whitespace-pre-wrap wrap-break-word text-left',
    box: '',
    header: 'mb-0.5',
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
  smooth: () => 'animate-chat-smooth-slide-in',
  pop: () => 'animate-chat-pop-in',
  bounce: () => 'animate-chat-bounce-in',
  stagger: () => 'animate-chat-stagger-meta',
  fade: () => 'animate-chat-fade-in',
  typing: () => 'animate-chat-fade-in',
  none: () => '',
};

const ANIMATION_MESSAGE_CLASSES: Record<AnimationChoice, string> = {
  slide: '',
  smooth: '',
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

function TypedContent({ nodes, speed }: { nodes: React.ReactNode[]; speed: number }) {
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
    const msPerUnit =
      speed * Math.min(TYPING_MS_PER_CHAR, TYPING_MAX_MS / Math.max(units.length, 1));
    const id = window.setInterval(() => {
      const next = Math.min(units.length, Math.ceil((performance.now() - start) / msPerUnit));
      setCount(next);
      if (next >= units.length) window.clearInterval(id);
    }, 30);
    return () => window.clearInterval(id);
  }, [units.length, speed]);

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

export const Route = createFileRoute('/widgets/chat-widget')({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  component: RouteComponent,
});

const NO_SUB_BADGES: KickSubBadges = [];

function HeaderIcon({ children, filled }: { children: React.ReactNode; filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="inline-block h-[1em] w-[1em] shrink-0"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? undefined : 'currentColor'}
      strokeWidth={2.5}
    >
      {children}
    </svg>
  );
}

const ReplyIcon = () => (
  <HeaderIcon>
    <path d="M15 10l5 5-5 5" />
    <path d="M4 4v7a4 4 0 0 0 4 4h12" />
  </HeaderIcon>
);

const MegaphoneIcon = () => (
  <HeaderIcon>
    <path d="M3 11l18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </HeaderIcon>
);

const SparkleIcon = () => (
  <HeaderIcon filled>
    <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
  </HeaderIcon>
);

function RouteComponent() {
  const search = Route.useSearch();
  // Looked up in the page, not a route loader, so a failed lookup is retried and never holds up
  // Twitch.
  const kick = useKickChannel(search.kick).channel;
  const kickSubBadges = kick?.subscriberBadges ?? NO_SUB_BADGES;
  const twitchBadgeMap = useTwitchBadges(search.twitch);

  // Decided by the link, so a Kick lookup that fails can't swap a streamer's chat for demo chat.
  const isMock = Boolean(search.mock || (!search.twitch && !search.kick?.trim()));

  const showPlatformIndicator = search.platformDisplay !== 'none';
  const skin = skinFor(search.preset);
  const fallback = defaultFonts(search.preset ?? '');
  const messageFont = search.font ?? fallback.font;
  // Before the username had its own font it followed the message font; classic URLs still do.
  const userFont = search.userFont ?? (skin ? fallback.userFont : messageFont);

  const emotes = useChannelEmotes(search.twitch, kick?.userId ?? null, {
    sevenTv: search.sevenTv,
    bttv: search.bttv,
    ffz: search.ffz,
  });

  // Mentions of these names get highlighted. A mock preview without channels mentions Senchabot.
  const channels = React.useMemo(() => {
    const names = [search.twitch, search.kick].filter((name): name is string => Boolean(name));
    return names.length > 0 || !isMock ? names : ['senchabot'];
  }, [search.twitch, search.kick, isMock]);
  const mockChannel = channels[0] ?? 'senchabot';
  const highlights = React.useMemo(
    () => new Set(parseHighlights(search.highlights)),
    [search.highlights],
  );

  useUnifiedChat(search.twitch, kick?.chatroomId);

  useMockChat(isMock, mockChannel, search.mockRate);

  const [now, setNow] = React.useState(() => Date.now());
  const listRef = React.useRef<HTMLDivElement>(null);
  const lastIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    // A preset's own fonts come from its stylesheet link below; these are the site fonts a
    // select can pick on top of it, so a preset can still need one.
    const families = [
      ...new Set(
        [userFont, messageFont]
          .map((choice) => FONT_GOOGLE_FAMILIES[choice as SiteFont])
          .filter((family) => family !== undefined),
      ),
    ];
    if (families.length === 0) {
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
    const nextHref = `https://fonts.googleapis.com/css2?${families
      .map((family) => `family=${family}`)
      .join('&')}&display=swap`;
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
  }, [userFont, messageFont]);

  const { data: messages } = useLiveQuery((q) =>
    q
      .from({ collection: chatMessagesCollection })
      .orderBy(({ collection }) => collection.receivedAt),
  );

  const ttlMs = search.duration ? search.duration * 1000 : DEFAULT_TTL_MS;
  const shownMessages = React.useMemo(() => {
    const filters = { hideBots: Boolean(search.hideBots), hideCommands: Boolean(search.hideCommands) };
    return messages.filter((msg) => !isHiddenMessage(msg, filters));
  }, [messages, search.hideBots, search.hideCommands]);
  const visibleMessages = search.keep
    ? shownMessages
    : shownMessages.filter((msg) => now - getReceivedAtMs(msg) < ttlMs);
  // `slide` is the original default and must look exactly as it always did, so the shift and
  // fade-out only come with the other animations.
  const animatesLayout = search.animation !== 'none' && search.animation !== 'slide';
  const fadeOut = !search.keep && animatesLayout;
  const speeds = React.useMemo(() => getAnimationSpeeds(shownMessages), [shownMessages]);

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
    if (!prevId || !last || prevId === lastIdRef.current || !animatesLayout) return;

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
    const shiftMs = Math.round(SHIFT_MS * (speeds.get(lastIdRef.current ?? '') ?? 1));
    list.style.transition = `transform ${shiftMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    list.style.transform = '';
  });

  const horizontal = search.orientation === 'horizontal';

  // Rows overflow toward the start edge, which is never scrollable, so clip instead of scroll:
  // a scrollable box would flash a scrollbar while the list is offset during the shift.
  // The list must not shrink: it would narrow to fit the screen while its unwrapping rows
  // spill past the end edge, hiding the newest messages.
  const background = skin
    ? rgba(skin.colors.panel2, search.bgOpacity)
    : `rgba(0, 0, 0, ${search.bgOpacity})`;
  return (
    <div
      className={`flex ${horizontal ? 'flex-row justify-end items-center min-w-full h-screen p-2' : 'flex-col justify-end h-screen w-full p-2.5'} overflow-clip text-white rounded-md`}
      data-preset={skin?.id}
      style={{
        fontSize: `${search.fontSize}px`,
        fontFamily: fontStack(messageFont, skin),
        backgroundColor: search.background ? background : 'transparent',
        ...(skin && { color: skin.text, fontSynthesis: 'none' }),
      }}
    >
      {/* React hoists it into <head>; only the URL knows the preset's fonts. */}
      {skin && <link rel="stylesheet" href={skin.fontHref} precedence="default" />}
      <div
        ref={listRef}
        className={`flex shrink-0 ${horizontal ? 'flex-row items-center space-x-3' : 'flex-col space-y-2'}`}
      >
        {visibleMessages.map((msg) => (
          <MessageRow
            key={msg.id}
            msg={msg}
            exiting={fadeOut && now - getReceivedAtMs(msg) >= ttlMs - EXIT_MS}
            speed={speeds.get(msg.id) ?? 1}
            layout={search.layout}
            animation={search.animation}
            orientation={search.orientation}
            showTimestamp={Boolean(search.timestamp)}
            showPlatformIndicator={showPlatformIndicator}
            platformDisplay={search.platformDisplay}
            twitchBadgeMap={twitchBadgeMap}
            kickSubBadges={kickSubBadges}
            emoteMap={emotes[msg.platform]}
            showBadges={Boolean(search.badges)}
            hasBackground={Boolean(search.background)}
            itemBackground={Boolean(search.itemBackground)}
            bgOpacity={search.bgOpacity}
            platformAccent={Boolean(search.platformAccent)}
            boldUsernames={Boolean(search.boldUsernames)}
            boldMessages={Boolean(search.boldMessages)}
            userFontFamily={fontStack(userFont, skin)}
            highlight={getHighlightKind(msg, channels, highlights)}
            showReply={highlights.has('reply')}
            skin={skin}
          />
        ))}
      </div>
    </div>
  );
}

type MessageRowProps = {
  msg: ChatMessagesType;
  exiting: boolean;
  speed: number;
  layout: LayoutChoice;
  animation: AnimationChoice;
  orientation: 'vertical' | 'horizontal';
  showTimestamp: boolean;
  showPlatformIndicator: boolean;
  platformDisplay: 'name' | 'icon' | 'none';
  twitchBadgeMap: Map<string, string> | null | undefined;
  kickSubBadges: KickSubBadges;
  emoteMap: EmoteMap;
  showBadges: boolean;
  hasBackground: boolean;
  itemBackground: boolean;
  bgOpacity: number;
  platformAccent: boolean;
  boldUsernames: boolean;
  boldMessages: boolean;
  userFontFamily: string;
  highlight: HighlightKind | null;
  showReply: boolean;
  skin: Skin | null;
};

const MessageRow = React.memo(function MessageRow({
  msg,
  exiting,
  speed,
  layout,
  animation,
  orientation,
  showTimestamp,
  showPlatformIndicator,
  platformDisplay,
  twitchBadgeMap,
  kickSubBadges,
  emoteMap,
  showBadges,
  hasBackground,
  itemBackground,
  bgOpacity,
  platformAccent,
  boldUsernames,
  boldMessages,
  userFontFamily,
  highlight,
  showReply,
  skin,
}: MessageRowProps) {
  const t = useT();
  // Frozen at mount: a moderator deleting the previous message would otherwise change this row's
  // speed mid-animation and make it jump (or un-type letters in typing mode).
  const [mountSpeed] = React.useState(speed);
  const classes = LAYOUT_CLASSES[layout];
  const animClass = exiting ? 'animate-chat-fade-out' : ANIMATION_CLASSES[animation](orientation);
  const messageAnimClass = ANIMATION_MESSAGE_CLASSES[animation];
  const compactSize = layout === 'compact' ? '0.875em' : undefined;
  const isInlineOrCompact = layout === 'inline' || layout === 'compact';
  // Card and item-background boxes already have horizontal padding; plain rows need room for the stripe.
  const boxed = itemBackground || layout === 'card';
  // A preset's box keeps the item background's opacity; a card without one is nearly solid.
  const presetBox =
    skin && boxed
      ? { radius: itemBackground ? 6 : 8, opacity: itemBackground ? bgOpacity : 0.85 }
      : null;
  const itemBgClass = presetBox
    ? `relative ${itemBackground ? 'px-2.5 py-1' : ''}`
    : itemBackground
      ? 'rounded-md border border-white/10 px-2.5 py-1'
      : '';
  const itemBgStyle: React.CSSProperties | undefined =
    skin && presetBox
      ? panelStyle(skin, presetBox.radius, 0.5, presetBox.opacity)
      : itemBackground
        ? { backgroundColor: `rgba(0, 0, 0, ${bgOpacity})` }
        : undefined;
  const [highlightFrom, highlightTo] = highlight
    ? getHighlightColors(highlight, msg.announcementColor)
    : [];
  let wrapperStyle: React.CSSProperties | undefined = itemBgStyle;
  if (highlightFrom && highlightTo) {
    // A solid bar plus a tint that fades out to the right: visible at a glance, but the text on
    // top keeps the contrast every other row has. The bar takes the platform stripe's place.
    wrapperStyle = {
      ...itemBgStyle,
      backgroundImage: `linear-gradient(${highlightFrom}, ${highlightTo}), linear-gradient(90deg, ${highlightFrom}29, ${highlightTo}0a)`,
      backgroundSize: '3px 100%, 100% 100%',
      backgroundRepeat: 'no-repeat',
      ...(boxed ? {} : { borderRadius: '0.375em', padding: '0.25em 0.5em 0.25em 0.75em' }),
    };
  } else if (platformAccent) {
    wrapperStyle = {
      ...itemBgStyle,
      borderLeft: `2px solid ${PLATFORM_COLORS[msg.platform]}`,
      paddingLeft: boxed ? undefined : '0.5em',
    };
  }
  const accessibleColor = React.useMemo(
    () => getAccessibleColor(msg.color, true) || msg.color || 'unset',
    [msg.color],
  );
  const hasAnyBackground = hasBackground || itemBackground;
  const hardShadow = skin?.shadow === 'hard' ? skin.textShadow : null;
  const shadowStyle =
    hardShadow ??
    (hasAnyBackground
      ? '1px 1px 1px rgba(0, 0, 0)'
      : '0 1px 1px #000, 1px 1px 1px rgba(0, 0, 0), 1px 1px 1px rgba(0, 0, 0)');
  const userNameStyle: React.CSSProperties = React.useMemo(
    () => ({
      color: accessibleColor,
      textShadow: hardShadow ?? '1px 1px 1px rgba(0, 0, 0)',
      fontSize: compactSize,
      fontWeight: boldUsernames ? 700 : undefined,
      // Presets switch synthesis off so a one-weight font isn't smeared, but a single-weight
      // preset font (Marcellus, Zen Antique, Jersey 10) then ignored this box entirely.
      fontSynthesis: boldUsernames ? 'weight' : undefined,
      fontFamily: userFontFamily,
    }),
    [accessibleColor, compactSize, boldUsernames, hardShadow, userFontFamily],
  );
  const messageStyle: React.CSSProperties = React.useMemo(
    () => ({
      textShadow: shadowStyle,
      fontSize: compactSize,
      fontWeight: boldMessages ? 600 : undefined,
      fontSynthesis: boldMessages ? 'weight' : undefined,
    }),
    [compactSize, boldMessages, shadowStyle],
  );

  const parsedContent = React.useMemo(
    () => renderThirdPartyEmotes(parseEmotes(msg.message, msg.platform, msg.emotes), emoteMap),
    [msg.message, msg.platform, msg.emotes, emoteMap],
  );
  const replyTo = showReply ? msg.replyTo : undefined;
  const replyContent = React.useMemo(
    () => (replyTo ? renderThirdPartyEmotes(parseEmotes(replyTo.message, msg.platform), emoteMap) : []),
    [replyTo, msg.platform, emoteMap],
  );

  const label =
    highlight === 'announcement'
      ? { icon: <MegaphoneIcon />, text: t('chatWidget.announcement') }
      : highlight === 'firstMessage'
        ? { icon: <SparkleIcon />, text: t('chatWidget.firstMessage') }
        : null;
  const headerNode = (label || replyTo) && (
    <div
      className={`${classes.header} text-[0.75em] leading-snug select-none`}
      style={{ textShadow: shadowStyle }}
    >
      {label && (
        <div
          className="flex items-center gap-1 font-semibold"
          style={{ color: getAccessibleColor(highlightFrom, true) }}
        >
          {label.icon}
          {label.text}
        </div>
      )}
      {replyTo && (
        // A shrink-to-fit horizontal row has no width to truncate against, so it gets a cap.
        <div
          className="flex min-w-0 items-center gap-1 text-white/60"
          style={{ maxWidth: orientation === 'horizontal' ? '24em' : undefined }}
        >
          <ReplyIcon />
          <span className="truncate">
            <span className="font-semibold">@{replyTo.user}</span>
            {replyTo.message && ': '}
            {replyContent}
          </span>
        </div>
      )}
    </div>
  );

  const badgesNode = showBadges && (
    <MessageBadges msg={msg} twitchBadgeMap={twitchBadgeMap} kickSubBadges={kickSubBadges} />
  );

  const timestampNode = showTimestamp && (
    <span className="text-zinc-400 text-xs" style={skin ? { color: skin.muted } : undefined}>
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
      {animation === 'typing' ? (
        <TypedContent nodes={parsedContent} speed={mountSpeed} />
      ) : (
        parsedContent
      )}
    </span>
  );

  return (
    <div
      data-msg-id={msg.id}
      className={`${classes.wrapper} ${skin ? '' : classes.box} ${itemBgClass} ${animClass} transform-gpu ${orientation === 'horizontal' ? 'flex-shrink-0' : ''}`}
      style={{ ...wrapperStyle, '--chat-speed': mountSpeed } as React.CSSProperties}
    >
      {headerNode}
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
      {skin && presetBox && <Frame skin={skin} radius={presetBox.radius} scale={0.5} />}
    </div>
  );
});
