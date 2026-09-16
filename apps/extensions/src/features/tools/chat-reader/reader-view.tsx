import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PLATFORM_LABELS } from '#/features/tools/command-users-field';
import type { ChatPlatform } from '#/features/tools/command-users';
import { getAccessibleColor } from '#/features/widgets/chat-widget/color-utils';
import {
  getHighlightColors,
  getHighlightKind,
  type HighlightKind,
} from '#/features/widgets/chat-widget/highlights';
import {
  type KickSubBadges,
  MessageBadges,
  PlatformIcon,
  parseEmotes,
  renderThirdPartyEmotes,
} from '#/features/widgets/chat-widget/message-parts';
import { isHiddenMessage } from '#/features/widgets/chat-widget/message-filters';
import type { EmoteMap } from '#/features/widgets/chat-widget/use-channel-emotes';
import type { Highlight } from '#/features/widgets/chat-widget/widget-settings';
import type { ChatConnectionStatus } from '#/lib/basechat';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import type { ReaderEntry, ReaderEvent } from './reader-log';

type Translate = ReturnType<typeof useI18n>['t'];

// Within this distance of the bottom the list counts as following the chat.
const PIN_THRESHOLD_PX = 40;

/** Date.now(), re-read every half second while `active`. */
function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

const secondsLeft = (retryAt: number, now: number) =>
  Math.max(1, Math.ceil((retryAt - now) / 1000));

export function formatDuration(ms: number, t: Translate) {
  const total = Math.max(1, Math.round(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (hours > 0) return t('chatReader.durationHours', { hours, minutes });
  if (minutes > 0) return t('chatReader.durationMinutes', { minutes, seconds });
  return t('chatReader.durationSeconds', { seconds });
}

const PLATFORM_TEXT: Record<ChatPlatform, string> = {
  twitch: 'text-[#9146FF]',
  kick: 'text-green-600 dark:text-[#53FC18]',
};

const DOT: Record<ChatConnectionStatus['state'] | 'missing', string> = {
  connecting: 'bg-zinc-400 motion-safe:animate-pulse',
  connected: 'bg-green-500',
  reconnecting: 'bg-amber-500 motion-safe:animate-pulse',
  missing: 'bg-red-500',
};

const STATE_KEYS: Record<ChatConnectionStatus['state'], TranslationKey> = {
  connecting: 'chatReader.statusConnecting',
  connected: 'chatReader.statusConnected',
  reconnecting: 'chatReader.statusReconnecting',
};

export function StatusChips({
  channels,
  status,
  kickNotFound,
}: {
  channels: Partial<Record<ChatPlatform, string>>;
  status: Partial<Record<ChatPlatform, ChatConnectionStatus>>;
  kickNotFound: boolean;
}) {
  const { t } = useI18n();
  const platforms = (['twitch', 'kick'] as const).filter((platform) => channels[platform]);
  return (
    <ul className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5">
      {platforms.map((platform) => {
        const missing = platform === 'kick' && kickNotFound;
        const state = status[platform]?.state ?? 'connecting';
        const label = missing ? t('chatReader.notFound') : t(STATE_KEYS[state]);
        return (
          <li key={platform} className="flex min-w-0 items-center gap-2 text-sm">
            <span className={`inline-flex shrink-0 ${PLATFORM_TEXT[platform]}`}>
              <PlatformIcon platform={platform} />
            </span>
            <span className="min-w-0 truncate font-medium">{channels[platform]}</span>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${DOT[missing ? 'missing' : state]}`}
              />
              <span className="sr-only">{PLATFORM_LABELS[platform]}: </span>
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const NOTICE_BASE = 'flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-xs leading-relaxed';

/** What is wrong right now and when it fixes itself; nothing while all is well. */
export function ConnectionNotices({
  online,
  status,
  downSince,
  onRetryNow,
}: {
  online: boolean;
  status: Partial<Record<ChatPlatform, ChatConnectionStatus>>;
  downSince: Partial<Record<ChatPlatform, number>>;
  onRetryNow: (platform: ChatPlatform) => void;
}) {
  const { t } = useI18n();
  // A lost connection stays listed through its retries, including an attempt still running;
  // a first connect that fails shows up once it is waiting to retry.
  const down = (['twitch', 'kick'] as const).filter((platform) => {
    const state = status[platform]?.state;
    return state === 'reconnecting' || (downSince[platform] !== undefined && state !== 'connected');
  });
  const now = useNow(down.length > 0);

  if (!online) {
    return (
      <div aria-live="polite">
        <p
          className={`${NOTICE_BASE} border-b border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300`}
        >
          {t('chatReader.networkOffline')}
        </p>
      </div>
    );
  }

  return (
    <div aria-live="polite">
      {down.map((platform) => {
        const current = status[platform];
        const retryAt = current?.state === 'reconnecting' ? current.retryAt : null;
        const waiting = retryAt !== null && retryAt > now;
        return (
          <div
            key={platform}
            className={`${NOTICE_BASE} border-b border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200`}
          >
            <p className="min-w-0 flex-1 tabular-nums">
              {waiting
                ? t('chatReader.retryIn', {
                    platform: PLATFORM_LABELS[platform],
                    seconds: secondsLeft(retryAt, now),
                  })
                : t('chatReader.retrying', { platform: PLATFORM_LABELS[platform] })}
            </p>
            <button
              type="button"
              onClick={() => onRetryNow(platform)}
              disabled={!waiting}
              className="rounded-md border border-amber-300 bg-white px-2.5 py-1 font-semibold text-amber-900 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50 dark:border-amber-500/40 dark:bg-zinc-900 dark:text-amber-200 dark:hover:bg-zinc-800"
            >
              {t('chatReader.retryNow')}
            </button>
          </div>
        );
      })}
    </div>
  );
}

const TOOL_BUTTON =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-40 aria-pressed:bg-zinc-200 aria-pressed:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white dark:aria-pressed:bg-zinc-800 dark:aria-pressed:text-white';

export const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20, 22, 24, 28] as const;
const CLEAR_CONFIRM_MS = 3000;

function ToolIcon({ d }: { d: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export function ReaderToolbar({
  fontSize,
  onFontSize,
  showTime,
  onShowTime,
  onClear,
}: {
  fontSize: number;
  onFontSize: (size: number) => void;
  showTime: boolean;
  onShowTime: (show: boolean) => void;
  onClear: () => void;
}) {
  const { t } = useI18n();
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  const index = FONT_SIZES.indexOf(fontSize as (typeof FONT_SIZES)[number]);

  // Clearing can't be undone, so it takes a second click; no blocking confirm() in an OBS dock.
  const clear = () => {
    clearTimeout(timerRef.current);
    if (confirming) {
      setConfirming(false);
      onClear();
      return;
    }
    setConfirming(true);
    timerRef.current = setTimeout(() => setConfirming(false), CLEAR_CONFIRM_MS);
  };

  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button
        type="button"
        className={TOOL_BUTTON}
        onClick={() => onFontSize(FONT_SIZES[Math.max(0, index - 1)])}
        disabled={index <= 0}
        aria-label={t('chatReader.fontSmaller')}
        title={t('chatReader.fontSmaller')}
      >
        <span aria-hidden="true" className="text-xs font-bold">
          A-
        </span>
      </button>
      <button
        type="button"
        className={TOOL_BUTTON}
        onClick={() => onFontSize(FONT_SIZES[Math.min(FONT_SIZES.length - 1, index + 1)])}
        disabled={index >= FONT_SIZES.length - 1}
        aria-label={t('chatReader.fontLarger')}
        title={t('chatReader.fontLarger')}
      >
        <span aria-hidden="true" className="text-sm font-bold">
          A+
        </span>
      </button>
      <button
        type="button"
        className={TOOL_BUTTON}
        onClick={() => onShowTime(!showTime)}
        aria-pressed={showTime}
        aria-label={t('chatReader.timestamps')}
        title={t('chatReader.timestamps')}
      >
        <ToolIcon d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </button>
      <button
        type="button"
        className={`${TOOL_BUTTON} ${confirming ? 'w-auto px-2 text-xs font-semibold text-red-700 dark:text-red-400' : ''}`}
        onClick={clear}
        aria-label={confirming ? t('chatReader.clearConfirm') : t('chatReader.clear')}
        title={confirming ? t('chatReader.clearConfirm') : t('chatReader.clear')}
      >
        {confirming ? (
          t('chatReader.clearConfirm')
        ) : (
          <ToolIcon d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
        )}
      </button>
    </div>
  );
}

export type RowContext = {
  channels: string[];
  highlights: ReadonlySet<Highlight>;
  showTime: boolean;
  showBadges: boolean;
  showPlatform: boolean;
  isDark: boolean;
  emotes: Record<ChatPlatform, EmoteMap>;
  twitchBadgeMap: Map<string, string> | null | undefined;
  kickSubBadges: KickSubBadges;
  timeFormat: Intl.DateTimeFormat;
};

const HIGHLIGHT_LABELS: Partial<Record<HighlightKind, TranslationKey>> = {
  announcement: 'chatWidget.announcement',
  firstMessage: 'chatWidget.firstMessage',
};

const MessageRow = memo(function MessageRow({
  entry,
  ctx,
}: {
  entry: Extract<ReaderEntry, { type: 'message' }>;
  ctx: RowContext;
}) {
  const { t } = useI18n();
  const { msg, deleted } = entry;
  const emoteMap = ctx.emotes[msg.platform];
  const content = useMemo(
    () => renderThirdPartyEmotes(parseEmotes(msg.message, msg.platform, msg.emotes), emoteMap),
    [msg.message, msg.platform, msg.emotes, emoteMap],
  );
  const reply = ctx.highlights.has('reply') ? msg.replyTo : undefined;
  const highlight = getHighlightKind(msg, ctx.channels, ctx.highlights);
  const [from, to] = highlight ? getHighlightColors(highlight, msg.announcementColor) : [];
  const labelKey = highlight ? HIGHLIGHT_LABELS[highlight] : undefined;
  const nameColor = getAccessibleColor(msg.color, ctx.isDark);

  return (
    <div
      className="px-3 py-1 leading-snug [overflow-wrap:anywhere]"
      style={
        from && to
          ? {
              backgroundImage: `linear-gradient(${from}, ${to}), linear-gradient(90deg, ${from}26, ${to}08)`,
              backgroundSize: '3px 100%, 100% 100%',
              backgroundRepeat: 'no-repeat',
            }
          : undefined
      }
    >
      {labelKey && (
        <div
          className="text-[0.75em] font-semibold"
          style={{ color: getAccessibleColor(from, ctx.isDark) }}
        >
          {t(labelKey)}
        </div>
      )}
      {reply && (
        <div className="truncate text-[0.75em] text-zinc-500 dark:text-zinc-400">
          ↪ <span className="font-semibold">@{reply.user}</span>
          {reply.message && `: ${reply.message}`}
        </div>
      )}
      <div className={deleted ? 'opacity-50' : undefined}>
        {ctx.showTime && (
          <time
            dateTime={msg.timestamp.toISOString()}
            className="mr-1.5 align-middle text-[0.75em] text-zinc-500 tabular-nums"
          >
            {ctx.timeFormat.format(msg.timestamp)}
          </time>
        )}
        {ctx.showPlatform && (
          <span className={`mr-1.5 inline-flex align-middle ${PLATFORM_TEXT[msg.platform]}`}>
            <PlatformIcon platform={msg.platform} />
          </span>
        )}
        {ctx.showBadges && (
          <span className="mr-1">
            <MessageBadges
              msg={msg}
              twitchBadgeMap={ctx.twitchBadgeMap}
              kickSubBadges={ctx.kickSubBadges}
            />
          </span>
        )}
        <span className="font-semibold" style={nameColor ? { color: nameColor } : undefined}>
          {msg.user}
        </span>
        <span className="text-zinc-500">: </span>
        {/* The overlay's emotes are text-sized; up close they need to be larger to read, about
            as big as Twitch's own chat draws them. */}
        <span className={`[&_img]:h-[1.75em] [&_img]:w-auto ${deleted ? 'line-through' : ''}`}>
          {content}
        </span>
        {deleted && (
          <span className="ml-1.5 text-[0.75em] italic text-zinc-500">
            {t('chatReader.deleted')}
          </span>
        )}
      </div>
    </div>
  );
});

type EventTone = 'bad' | 'good' | 'muted';

const EVENT_TONES: Record<EventTone, string> = {
  bad: 'text-red-700 dark:text-red-400',
  good: 'text-green-700 dark:text-green-400',
  muted: 'text-zinc-500 dark:text-zinc-400',
};

function describeEvent(event: ReaderEvent, t: Translate, timeFormat: Intl.DateTimeFormat) {
  const platform = 'platform' in event ? PLATFORM_LABELS[event.platform] : '';
  switch (event.kind) {
    case 'connected':
      return {
        tone: 'good' as const,
        text: t('chatReader.eventConnected', { platform, channel: event.channel }),
      };
    case 'disconnected':
      return { tone: 'bad' as const, text: t('chatReader.eventDisconnected', { platform }) };
    case 'reconnected':
      return {
        tone: 'good' as const,
        text: t('chatReader.eventReconnected', {
          platform,
          duration: formatDuration(event.downMs, t),
        }),
      };
    case 'networkLost':
      return { tone: 'bad' as const, text: t('chatReader.eventNetworkLost') };
    case 'networkBack':
      return { tone: 'good' as const, text: t('chatReader.eventNetworkBack') };
    case 'chatCleared':
      return { tone: 'muted' as const, text: t('chatReader.eventChatCleared', { platform }) };
    case 'resumed':
      return {
        tone: 'muted' as const,
        text: t('chatReader.eventResumed', { time: timeFormat.format(event.savedAt) }),
      };
  }
}

const EventRow = memo(function EventRow({
  entry,
  timeFormat,
}: {
  entry: Extract<ReaderEntry, { type: 'event' }>;
  timeFormat: Intl.DateTimeFormat;
}) {
  const { t } = useI18n();
  const { tone, text } = describeEvent(entry.event, t, timeFormat);
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 text-[0.75em] font-medium ${EVENT_TONES[tone]}`}
    >
      <span aria-hidden="true" className="h-px min-w-3 flex-1 bg-current opacity-25" />
      <span className="min-w-0 text-center">
        {text}
        <time
          dateTime={new Date(entry.at).toISOString()}
          className="ml-1.5 font-normal text-zinc-500 tabular-nums"
        >
          {timeFormat.format(entry.at)}
        </time>
      </span>
      <span aria-hidden="true" className="h-px min-w-3 flex-1 bg-current opacity-25" />
    </div>
  );
});

export function MessageList({
  entries,
  ctx,
  hideBots,
  hideCommands,
  fontSize,
  label,
  empty,
}: {
  entries: ReaderEntry[];
  ctx: RowContext;
  hideBots: boolean;
  hideCommands: boolean;
  fontSize: number;
  label: string;
  empty: string;
}) {
  const { t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(true);
  const [pinned, setPinned] = useState(true);
  // Last row the reader saw before scrolling up; everything after it counts as new.
  const [seenKey, setSeenKey] = useState<string | null>(null);

  const visible = useMemo(() => {
    const filters = { hideBots, hideCommands };
    return entries.filter(
      (entry) => entry.type === 'event' || !isHiddenMessage(entry.msg, filters),
    );
  }, [entries, hideBots, hideCommands]);

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // After every render: new rows, a bigger font or the times toggle all grow the list.
  useLayoutEffect(() => {
    if (pinnedRef.current) scrollToBottom();
  });

  // Emotes and badges load after their row is placed and make it taller.
  useEffect(() => {
    const el = scrollRef.current;
    const content = contentRef.current;
    if (!el || !content) return;
    const observer = new ResizeObserver(() => {
      if (pinnedRef.current) el.scrollTop = el.scrollHeight;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const visibleRef = useRef(visible);
  visibleRef.current = visible;
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= PIN_THRESHOLD_PX;
    if (atBottom === pinnedRef.current) return;
    pinnedRef.current = atBottom;
    setPinned(atBottom);
    if (!atBottom) setSeenKey(visibleRef.current.at(-1)?.key ?? null);
  };

  const jumpToBottom = () => {
    pinnedRef.current = true;
    setPinned(true);
    scrollToBottom();
  };

  let newCount = 0;
  if (!pinned) {
    const seenIndex = visible.findIndex((entry) => entry.key === seenKey);
    for (let i = seenIndex + 1; i < visible.length; i++) {
      if (visible[i].type === 'message') newCount++;
    }
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        role="log"
        aria-live="off"
        aria-label={label}
        // Focusable so the list scrolls with the keyboard.
        // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region
        tabIndex={0}
        className="h-full overflow-y-auto overscroll-contain py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-500"
        style={{ fontSize: `${fontSize}px` }}
      >
        <div ref={contentRef}>
          {visible.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-zinc-500">{empty}</p>
          ) : (
            visible.map((entry) =>
              entry.type === 'message' ? (
                <MessageRow key={entry.key} entry={entry} ctx={ctx} />
              ) : (
                <EventRow key={entry.key} entry={entry} timeFormat={ctx.timeFormat} />
              ),
            )
          )}
        </div>
      </div>
      {!pinned && (
        <button
          type="button"
          onClick={jumpToBottom}
          className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-green-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
        >
          <span aria-hidden="true">↓</span>
          {newCount === 0
            ? t('chatReader.backToLive')
            : t(newCount === 1 ? 'chatReader.newMessage' : 'chatReader.newMessages', {
                count: newCount > 99 ? '99+' : newCount,
              })}
        </button>
      )}
    </div>
  );
}
