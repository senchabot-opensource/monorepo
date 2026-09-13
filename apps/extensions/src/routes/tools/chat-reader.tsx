import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { SiteHeader } from '#/components/site-header';
import {
  ConnectionNotices,
  FONT_SIZES,
  MessageList,
  ReaderToolbar,
  type RowContext,
  StatusChips,
} from '#/features/tools/chat-reader/reader-view';
import { useChatReader } from '#/features/tools/chat-reader/use-chat-reader';
import { useTwitchBadges } from '#/features/widgets/chat-widget/use-badges';
import { useChannelEmotes } from '#/features/widgets/chat-widget/use-channel-emotes';
import { parseHighlights } from '#/features/widgets/chat-widget/widget-settings';
import { useI18n } from '#/lib/i18n';
import { getKickChannelInfo } from '#/lib/kick';
import { useTheme } from '#/lib/theme';

// The chat-related subset of the Chat Box widget's parameters, read the same way.
const searchSchema = z.object({
  twitch: z.string().optional(),
  kick: z.string().optional(),
  sevenTv: z.coerce.boolean().optional().default(true),
  bttv: z.coerce.boolean().optional().default(true),
  ffz: z.coerce.boolean().optional().default(true),
  badges: z.coerce.boolean().optional().default(true),
  hideBots: z.coerce.boolean().optional(),
  hideCommands: z.coerce.boolean().optional(),
  highlights: z.string().optional(),
  lang: z.string().optional(),
});

export const Route = createFileRoute('/tools/chat-reader')({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({ kick: search.kick?.trim() ?? '' }),
  loader: ({ deps }) => (deps.kick ? getKickChannelInfo(deps.kick) : null),
  component: ChatReaderPage,
});

const PREFS_KEY = 'chat-reader:prefs';
const DEFAULT_PREFS = { fontSize: 15, showTime: true };
type Prefs = typeof DEFAULT_PREFS;

function readPrefs(): Prefs {
  try {
    const saved = JSON.parse(window.localStorage.getItem(PREFS_KEY) ?? '{}') as Partial<Prefs>;
    return {
      fontSize: FONT_SIZES.includes(saved.fontSize as (typeof FONT_SIZES)[number])
        ? (saved.fontSize as number)
        : DEFAULT_PREFS.fontSize,
      showTime: typeof saved.showTime === 'boolean' ? saved.showTime : DEFAULT_PREFS.showTime,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function ChatReaderPage() {
  const { locale, t } = useI18n();
  const { theme } = useTheme();
  const search = Route.useSearch();
  const kickInfo = Route.useLoaderData();
  const twitchChannel = search.twitch?.trim().toLowerCase() ?? '';
  const kickSlug = search.kick?.trim().toLowerCase() ?? '';
  const kick = kickInfo?.chatroomId ? { slug: kickSlug, chatroomId: kickInfo.chatroomId } : null;

  const { entries, status, downSince, online, retryNow, clearHistory } = useChatReader({
    twitchChannel,
    kick,
  });

  const [prefs, setPrefs] = useState(readPrefs);
  useEffect(() => {
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      // localStorage unavailable
    }
  }, [prefs]);

  const twitchBadgeMap = useTwitchBadges(twitchChannel || null);
  const emotes = useChannelEmotes(twitchChannel || null, kickInfo?.userId ?? null, {
    sevenTv: search.sevenTv,
    bttv: search.bttv,
    ffz: search.ffz,
  });
  const highlights = useMemo(
    () => new Set(parseHighlights(search.highlights)),
    [search.highlights],
  );
  const timeFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }),
    [locale],
  );
  const channelNames = [twitchChannel, kickSlug].filter(Boolean);

  const ctx: RowContext = useMemo(
    () => ({
      channels: [twitchChannel, kickSlug].filter(Boolean),
      highlights,
      showTime: prefs.showTime,
      showBadges: search.badges,
      showPlatform: Boolean(twitchChannel && kickSlug),
      isDark: theme === 'dark',
      emotes,
      twitchBadgeMap,
      kickSubBadges: kickInfo?.subscriberBadges ?? [],
      timeFormat,
    }),
    [
      twitchChannel,
      kickSlug,
      highlights,
      prefs.showTime,
      search.badges,
      theme,
      emotes,
      twitchBadgeMap,
      kickInfo,
      timeFormat,
    ],
  );

  // Same rule as OBS Bridge: no header when another page frames the reader.
  const embedded = window.self !== window.top;

  return (
    <div className="flex h-dvh flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {!embedded && <SiteHeader variant="tool" title={t('chatReader.title')} widgetId="chat-box" />}
      <main
        id="main"
        className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-2 pb-2 sm:px-4 sm:pb-4"
      >
        <section
          aria-label={t('chatReader.title')}
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-3 border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
            <div className="min-w-0 flex-1">
              {channelNames.length > 0 ? (
                <StatusChips
                  channels={{ twitch: twitchChannel, kick: kickSlug }}
                  status={status}
                  kickNotFound={Boolean(kickSlug) && !kick}
                />
              ) : (
                <p className="text-sm text-red-700 dark:text-red-400">
                  {t('chatReader.noChannel')}
                </p>
              )}
            </div>
            <ReaderToolbar
              fontSize={prefs.fontSize}
              onFontSize={(fontSize) => setPrefs((current) => ({ ...current, fontSize }))}
              showTime={prefs.showTime}
              onShowTime={(showTime) => setPrefs((current) => ({ ...current, showTime }))}
              onClear={clearHistory}
            />
          </div>
          <ConnectionNotices
            online={online}
            status={status}
            downSince={downSince}
            onRetryNow={retryNow}
          />
          <MessageList
            entries={entries}
            ctx={ctx}
            hideBots={Boolean(search.hideBots)}
            hideCommands={Boolean(search.hideCommands)}
            fontSize={prefs.fontSize}
            label={t('chatReader.listLabel')}
            empty={
              channelNames.length > 0
                ? t('chatReader.empty', { channels: channelNames.join(', ') })
                : ''
            }
          />
        </section>
      </main>
    </div>
  );
}
