import { type ReactNode, useEffect, useState } from 'react';
import type { ChatConnectionStatus } from '#/lib/basechat';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import type { ChatPlatform } from './command-users';
import { PLATFORM_LABELS, PlatformDot } from './command-users-field';
import type { ObsAction, ObsActivity, ObsState } from './use-chat';

/** obs-websocket-js connects here when the link has no WebSocket URL. */
export const DEFAULT_OBS_URL = 'ws://127.0.0.1:4455';

type Tone = 'neutral' | 'good' | 'warn' | 'bad';

const TONES: Record<Tone, { badge: string; dot: string }> = {
  neutral: {
    badge:
      'bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700',
    dot: 'bg-zinc-400 motion-safe:animate-pulse',
  },
  good: {
    badge:
      'bg-green-50 text-green-800 ring-green-200 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/30',
    dot: 'bg-green-500',
  },
  warn: {
    badge:
      'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
    dot: 'bg-amber-500',
  },
  bad: {
    badge:
      'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/30',
    dot: 'bg-red-500',
  },
};

/** Date.now(), re-read every half second while `active`, for the retry countdowns. */
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

function useTimeFormat(withSeconds: boolean) {
  const { locale } = useI18n();
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
  });
}

function StatusRow({
  label,
  badge,
  tone,
  live,
  children,
}: {
  label: ReactNode;
  badge: string;
  tone: Tone;
  /** Announces badge changes to screen readers; used for the OBS row only. */
  live?: boolean;
  children?: ReactNode;
}) {
  return (
    <li className="space-y-1.5 py-3 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2 text-sm font-medium">{label}</span>
        <span
          aria-live={live ? 'polite' : undefined}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${TONES[tone].badge}`}
        >
          <span aria-hidden="true" className={`size-1.5 rounded-full ${TONES[tone].dot}`} />
          {badge}
        </span>
      </div>
      {children}
    </li>
  );
}

const DETAIL_CLASS = 'text-xs leading-relaxed text-zinc-600 dark:text-zinc-400';

function obsFailureKey(state: ObsState, hasPassword: boolean): TranslationKey {
  if (state.status === 'disconnected') return 'obsBridge.tool.obsClosed';
  if (state.code === 4009) {
    return hasPassword ? 'obsBridge.tool.obsWrongPassword' : 'obsBridge.tool.obsNeedsPassword';
  }
  if (state.code === 1006 || (!state.code && !state.reason)) return 'obsBridge.tool.obsUnreachable';
  return 'obsBridge.tool.obsRefused';
}

function ObsRow({
  state,
  url,
  hasPassword,
  onRetryNow,
}: {
  state: ObsState;
  url: string;
  hasPassword: boolean;
  onRetryNow: () => void;
}) {
  const { t } = useI18n();
  const now = useNow(state.retryAt !== null);
  const time = useTimeFormat(false);
  const tone: Tone =
    state.status === 'connected'
      ? 'good'
      : state.status === 'connecting'
        ? 'neutral'
        : state.status === 'disconnected'
          ? 'warn'
          : 'bad';
  const failing = state.status === 'failed' || state.status === 'disconnected';

  return (
    <StatusRow label="OBS" badge={t(`obsBridge.tool.status.${state.status}`)} tone={tone} live>
      {state.status === 'connecting' && (
        <p className={DETAIL_CLASS}>{t('obsBridge.tool.obsConnecting', { url })}</p>
      )}
      {state.status === 'connected' && state.since !== null && (
        <p className={DETAIL_CLASS}>
          {t('obsBridge.tool.obsConnected', { url, time: time.format(state.since) })}
        </p>
      )}
      {failing && (
        <>
          <p className={DETAIL_CLASS}>
            {t(obsFailureKey(state, hasPassword), {
              url,
              reason: state.reason || String(state.code ?? ''),
            })}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-zinc-700 tabular-nums dark:text-zinc-300">
              {state.retryAt !== null
                ? t('obsBridge.tool.retryIn', {
                    seconds: secondsLeft(state.retryAt, now),
                    attempt: state.attempt + 1,
                  })
                : t('obsBridge.tool.retrying')}
            </p>
            <button
              type="button"
              onClick={onRetryNow}
              disabled={state.retryAt === null}
              className="rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              {t('obsBridge.tool.retryNow')}
            </button>
          </div>
        </>
      )}
    </StatusRow>
  );
}

function ChatRow({
  platform,
  channel,
  status,
  notFound,
}: {
  platform: ChatPlatform;
  channel: string;
  status: ChatConnectionStatus | undefined;
  notFound: boolean;
}) {
  const { t } = useI18n();
  const retryAt = status?.state === 'reconnecting' ? status.retryAt : null;
  const now = useNow(retryAt !== null);
  const label = (
    <>
      <PlatformDot platform={platform} decorative />
      <span>{PLATFORM_LABELS[platform]}</span>
      <span className="min-w-0 truncate font-normal text-zinc-500">{channel}</span>
    </>
  );

  if (notFound) {
    return (
      <StatusRow label={label} badge={t('obsBridge.tool.chatNotFound')} tone="bad">
        <p className={DETAIL_CLASS}>{t('obsBridge.tool.kickNotFound', { channel })}</p>
      </StatusRow>
    );
  }
  const state = status?.state ?? 'connecting';
  return (
    <StatusRow
      label={label}
      badge={t(`obsBridge.tool.chat.${state}`)}
      tone={state === 'connected' ? 'good' : state === 'reconnecting' ? 'warn' : 'neutral'}
    >
      {retryAt !== null && (
        <p className={DETAIL_CLASS}>
          {t('obsBridge.tool.chatRetryIn', { seconds: secondsLeft(retryAt, now) })}
        </p>
      )}
    </StatusRow>
  );
}

export function ConnectionsCard({
  obs,
  obsUrl,
  hasPassword,
  onRetryNow,
  channels,
  chatStatus,
  kickNotFound,
}: {
  obs: ObsState;
  obsUrl: string;
  hasPassword: boolean;
  onRetryNow: () => void;
  channels: Record<ChatPlatform, string>;
  chatStatus: Partial<Record<ChatPlatform, ChatConnectionStatus>>;
  kickNotFound: boolean;
}) {
  const { t } = useI18n();
  const platforms = (['twitch', 'kick'] as const).filter((platform) => channels[platform]);
  return (
    <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
      <ObsRow state={obs} url={obsUrl} hasPassword={hasPassword} onRetryNow={onRetryNow} />
      {platforms.map((platform) => (
        <ChatRow
          key={platform}
          platform={platform}
          channel={channels[platform]}
          status={chatStatus[platform]}
          notFound={platform === 'kick' && kickNotFound}
        />
      ))}
      {platforms.length === 0 && (
        <li className="py-3 last:pb-0 text-xs text-red-700 dark:text-red-400">
          {t('obsBridge.summaryNoChannel')}
        </li>
      )}
    </ul>
  );
}

const DONE_KEYS: Record<ObsAction, TranslationKey> = {
  scene: 'obsBridge.tool.activityScene',
  brb: 'obsBridge.tool.activityScene',
  back: 'obsBridge.tool.activityScene',
  startStream: 'obsBridge.tool.activityStartStream',
  stopStream: 'obsBridge.tool.activityStopStream',
  startRecord: 'obsBridge.tool.activityStartRecord',
  stopRecord: 'obsBridge.tool.activityStopRecord',
};

function outcomeText(t: ReturnType<typeof useI18n>['t'], outcome: ObsActivity['outcome']) {
  switch (outcome.kind) {
    case 'done':
      return t(DONE_KEYS[outcome.action], { scene: outcome.scene ?? '' });
    case 'noScene':
      return t('obsBridge.tool.activityNoScene', { query: outcome.query });
    case 'failed':
      return outcome.offline
        ? t('obsBridge.tool.activityOffline')
        : t('obsBridge.tool.activityFailed', { message: outcome.message });
  }
}

export function ActivityList({ activity }: { activity: ObsActivity[] }) {
  const { t } = useI18n();
  const time = useTimeFormat(true);
  if (activity.length === 0) {
    return <p className={DETAIL_CLASS}>{t('obsBridge.tool.activityEmpty')}</p>;
  }
  return (
    <ol className="max-h-72 space-y-2 overflow-y-auto">
      {activity.map((entry) => {
        const ok = entry.outcome.kind === 'done';
        return (
          <li key={entry.id} className="text-xs leading-relaxed">
            <div className="flex min-w-0 items-center gap-1.5">
              <time
                dateTime={new Date(entry.at).toISOString()}
                className="shrink-0 text-zinc-500 tabular-nums"
              >
                {time.format(entry.at)}
              </time>
              <PlatformDot platform={entry.platform} />
              <span className="min-w-0 truncate font-medium text-zinc-800 dark:text-zinc-200">
                {entry.user}
              </span>
              <code className="min-w-0 truncate rounded bg-zinc-100 px-1 py-px font-mono text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {entry.text}
              </code>
            </div>
            <p
              className={
                ok ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
              }
            >
              {ok ? '✓ ' : '✕ '}
              {outcomeText(t, entry.outcome)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
