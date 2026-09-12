import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { z } from 'zod';
import { ChevronDownIcon } from '#/components/icons';
import { PANEL_CLASS } from '#/components/setup-shell';
import { SiteFooter } from '#/components/site-footer';
import { SiteHeader } from '#/components/site-header';
import { INPUT_CLASS } from '#/components/ui/text-field';
import {
  type CommandUser,
  formatCommandUsers,
  parseCommandUsers,
  resolveCommandUsers,
} from '#/features/tools/command-users';
import { CommandUsersField, PlatformDot } from '#/features/tools/command-users-field';
import { resolveObsCommands } from '#/features/tools/obs-bridge-config';
import { ObsCommandList } from '#/features/tools/obs-command-list';
import { type ObsStatus, useChat } from '#/features/tools/use-chat';
import { useI18n } from '#/lib/i18n';
import { getKickChannelInfo } from '#/lib/kick';

const searchSchema = z.object({
  mainScene: z.string().default('Main Scene'),
  brbScene: z.string().default('BRB Scene'),
  twitch: z.string().optional(),
  kick: z.string().optional(),
  obsWebsocketUrl: z.string().optional(),
  obsWebsocketPassword: z.string().optional(),
  commandUser: z.string().optional(),
  cmdBrb: z.string().optional(),
  cmdBack: z.string().optional(),
  cmdStartStream: z.string().optional(),
  cmdStopStream: z.string().optional(),
  cmdStartRecord: z.string().optional(),
  cmdStopRecord: z.string().optional(),
  cmdScene: z.string().optional(),
  lang: z.string().optional(),
});

export const Route = createFileRoute('/tools/obs-bridge')({
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

const STATUS_STYLES: Record<ObsStatus, { dot: string; text: string }> = {
  connecting: {
    dot: 'bg-zinc-400 motion-safe:animate-pulse',
    text: 'text-zinc-600 dark:text-zinc-400',
  },
  connected: { dot: 'bg-green-500', text: 'text-green-700 dark:text-green-400' },
  disconnected: { dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400' },
  failed: { dot: 'bg-red-500', text: 'text-red-700 dark:text-red-400' },
};

const HEADING_CLASS = 'text-sm font-semibold text-zinc-900 dark:text-white';
const WARNING_CLASS =
  'rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs leading-relaxed text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300';
const SMALL_BUTTON =
  'rounded px-2 py-0.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-default';

function Card({ children, label }: { children: ReactNode; label: string }) {
  return (
    <section aria-label={label} className={`${PANEL_CLASS} space-y-3 p-4`}>
      {children}
    </section>
  );
}

function SceneList({
  scenes,
  mainScene,
  brbScene,
  onSetMain,
  onSetBrb,
}: {
  scenes: string[];
  mainScene: string;
  brbScene: string;
  onSetMain: (name: string) => void;
  onSetBrb: (name: string) => void;
}) {
  const { t } = useI18n();
  return (
    <ul className="max-h-64 space-y-1 overflow-y-auto">
      {scenes.map((name) => {
        const isMain = name === mainScene;
        const isBrb = name === brbScene;
        return (
          <li
            key={name}
            className={`flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 ${
              isMain
                ? 'border-green-500/50 bg-green-500/10'
                : isBrb
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40'
            }`}
          >
            <span className="min-w-0 truncate text-sm text-zinc-800 dark:text-zinc-200">
              {name}
            </span>
            <span className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => onSetMain(name)}
                disabled={isMain}
                aria-pressed={isMain}
                aria-label={t('obsBridge.tool.setMain', { scene: name })}
                className={`${SMALL_BUTTON} ${
                  isMain
                    ? 'bg-green-600 text-white'
                    : 'bg-green-600/10 text-green-700 hover:bg-green-600/20 dark:text-green-400'
                }`}
              >
                {t('obsBridge.tool.main')}
              </button>
              <button
                type="button"
                onClick={() => onSetBrb(name)}
                disabled={isBrb}
                aria-pressed={isBrb}
                aria-label={t('obsBridge.tool.setBrb', { scene: name })}
                className={`${SMALL_BUTTON} ${
                  isBrb
                    ? 'bg-amber-500 text-zinc-950'
                    : 'bg-amber-500/15 text-amber-800 hover:bg-amber-500/25 dark:text-amber-300'
                }`}
              >
                {t('obsBridge.tool.brb')}
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const COPIED_MS = 2000;

/** Copies the page's own URL, which is where scene picks and user changes are saved. */
function CopyCurrentUrl() {
  const { t } = useI18n();
  const id = useId();
  const [copied, setCopied] = useState(false);
  const [manualUrl, setManualUrl] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copy = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard access can be blocked (permissions, some embedded browsers): copy by hand.
      setManualUrl(url);
      return;
    }
    setManualUrl(null);
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={copy}
        aria-describedby={`${id}-hint`}
        className="inline-flex h-9 w-full items-center justify-center rounded-md bg-green-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
      >
        {copied ? t('common.copied') : t('obsBridge.tool.copyUrl')}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t('common.copied') : ''}
      </span>
      <p id={`${id}-hint`} className="text-xs leading-relaxed text-zinc-500">
        {t('obsBridge.tool.copyUrlHint')}
      </p>
      {manualUrl && (
        <div className="space-y-1">
          <label htmlFor={`${id}-manual`} className="block text-xs text-red-700 dark:text-red-400">
            {t('obsBridge.tool.copyUrlManual')}
          </label>
          <input
            id={`${id}-manual`}
            type="text"
            readOnly
            value={manualUrl}
            onFocus={(e) => e.currentTarget.select()}
            className={INPUT_CLASS}
          />
        </div>
      )}
    </div>
  );
}

function RouteComponent() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { kick } = Route.useLoaderData();

  const [scenes, setScenes] = useState<string[]>([]);
  const [status, setStatus] = useState<ObsStatus>('connecting');
  const connected = status === 'connected';
  const scenesLoaded = connected && scenes.length > 0;
  const mainPicked = scenes.includes(search.mainScene);
  const brbPicked = scenes.includes(search.brbScene);

  const commandUsers = useMemo(() => parseCommandUsers(search.commandUser), [search.commandUser]);
  const twitchChannel = search.twitch?.trim() ?? '';
  const kickChannel = search.kick?.trim() ?? '';
  const hasTwitch = Boolean(twitchChannel);
  const hasKick = Boolean(kickChannel);
  const platforms = { twitch: hasTwitch, kick: hasKick };
  const allowedCommandUsers = useMemo(
    () => resolveCommandUsers(commandUsers, { twitch: hasTwitch, kick: hasKick }).allowed,
    [commandUsers, hasTwitch, hasKick],
  );

  const commands = useMemo(
    () =>
      resolveObsCommands({
        cmdBrb: search.cmdBrb,
        cmdBack: search.cmdBack,
        cmdStartStream: search.cmdStartStream,
        cmdStopStream: search.cmdStopStream,
        cmdStartRecord: search.cmdStartRecord,
        cmdStopRecord: search.cmdStopRecord,
        cmdScene: search.cmdScene,
      }),
    [
      search.cmdBrb,
      search.cmdBack,
      search.cmdStartStream,
      search.cmdStopStream,
      search.cmdStartRecord,
      search.cmdStopRecord,
      search.cmdScene,
    ],
  );

  const onScenes = useCallback((list: string[]) => setScenes(list), []);
  const onStatus = useCallback((next: ObsStatus) => setStatus(next), []);

  useChat(
    search.mainScene,
    search.brbScene,
    search.twitch,
    kick,
    search.obsWebsocketUrl,
    search.obsWebsocketPassword,
    allowedCommandUsers,
    onScenes,
    onStatus,
    commands,
  );

  const updateSearch = (patch: Partial<typeof search>) =>
    navigate({ to: '.', search: { ...search, ...patch }, replace: true });

  const setCommandUsers = (users: CommandUser[]) =>
    updateSearch({ commandUser: formatCommandUsers(users) });

  const sceneWarning = !scenesLoaded
    ? null
    : !mainPicked && !brbPicked
      ? t('obsBridge.tool.assignMainBrbWarning', { brb: commands.cmdBrb, back: commands.cmdBack })
      : !mainPicked
        ? t('obsBridge.tool.assignMainWarning', { back: commands.cmdBack })
        : !brbPicked
          ? t('obsBridge.tool.assignBrbWarning', { brb: commands.cmdBrb })
          : null;

  const sceneValue = (name: string, picked: boolean) =>
    scenesLoaded && !picked ? (
      <span className="text-red-700 dark:text-red-400">{t('obsBridge.tool.notSelected')}</span>
    ) : (
      <span className="text-zinc-900 dark:text-white">{name}</span>
    );

  // Site chrome only belongs on the real page, not when another page frames the tool.
  const embedded = window.self !== window.top;

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {!embedded && (
        <SiteHeader variant="compact" title={t('obsBridge.tool.title')} widgetId="obs-bridge" />
      )}
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-md flex-1 space-y-3 px-4 pt-2 pb-8 focus:outline-none"
      >
        <Card label={t('obsBridge.tool.connection')}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {t('obsBridge.tool.connection')}
            </span>
            <span
              aria-live="polite"
              className={`inline-flex items-center gap-1.5 text-right text-sm font-medium ${STATUS_STYLES[status].text}`}
            >
              <span
                aria-hidden="true"
                className={`size-2 shrink-0 rounded-full ${STATUS_STYLES[status].dot}`}
              />
              {t(`obsBridge.tool.status.${status}`)}
            </span>
          </div>
          {status === 'failed' && (
            <p className="text-xs leading-relaxed text-zinc-500">
              {t('obsBridge.tool.failedHint')}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
            <span className="text-zinc-600 dark:text-zinc-400">
              {t('obsBridge.summaryChannels')}
            </span>
            {hasTwitch || hasKick ? (
              (['twitch', 'kick'] as const)
                .filter((platform) => platforms[platform])
                .map((platform) => (
                  <span key={platform} className="inline-flex min-w-0 items-center gap-1.5">
                    <PlatformDot platform={platform} />
                    <span className="break-all font-medium">
                      {(platform === 'twitch' ? twitchChannel : kickChannel).toLowerCase()}
                    </span>
                  </span>
                ))
            ) : (
              <span className="text-xs text-red-700 dark:text-red-400">
                {t('obsBridge.summaryNoChannel')}
              </span>
            )}
          </div>
        </Card>

        <Card label={t('obsBridge.tool.scenesTitle')}>
          <h2 className={HEADING_CLASS}>
            {scenesLoaded
              ? t('obsBridge.tool.scenes', { count: scenes.length })
              : t('obsBridge.tool.scenesTitle')}
          </h2>
          {sceneWarning && <p className={WARNING_CLASS}>{sceneWarning}</p>}
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
            <dt className="text-zinc-600 dark:text-zinc-400">{t('obsBridge.tool.mainScene')}</dt>
            <dd className="truncate text-right font-medium">
              {sceneValue(search.mainScene, mainPicked)}
            </dd>
            <dt className="text-zinc-600 dark:text-zinc-400">{t('obsBridge.tool.brbScene')}</dt>
            <dd className="truncate text-right font-medium">
              {sceneValue(search.brbScene, brbPicked)}
            </dd>
          </dl>
          {scenesLoaded ? (
            <SceneList
              scenes={scenes}
              mainScene={search.mainScene}
              brbScene={search.brbScene}
              onSetMain={(name) => updateSearch({ mainScene: name })}
              onSetBrb={(name) => updateSearch({ brbScene: name })}
            />
          ) : (
            <p className="text-xs text-zinc-500">
              {connected ? t('obsBridge.tool.fetchingScenes') : t('obsBridge.tool.scenesOffline')}
            </p>
          )}
          <p className="text-xs leading-relaxed text-zinc-500">
            {t('obsBridge.tool.sceneHint', {
              command: `${commands.cmdScene} ${t('obsBridge.sceneArg')}`,
            })}
          </p>
        </Card>

        <Card label={t('obsBridge.sectionUsers')}>
          <CommandUsersField
            users={commandUsers}
            onChange={setCommandUsers}
            platforms={platforms}
            label={t('obsBridge.tool.usersCount', { count: commandUsers.length })}
            tip={t('obsBridge.usersTip')}
          />
        </Card>

        <Card label={t('obsBridge.tool.copyUrl')}>
          <CopyCurrentUrl />
        </Card>

        <details className={`${PANEL_CLASS} group`}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 [&::-webkit-details-marker]:hidden">
            <h2 className={HEADING_CLASS}>{t('obsBridge.tool.commands')}</h2>
            <ChevronDownIcon className="size-4 shrink-0 text-zinc-500 transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-4 pb-4">
            <ObsCommandList commands={commands} />
          </div>
        </details>

        <p className="text-center text-xs text-zinc-500">{t('obsBridge.tool.footer')}</p>
      </main>
      {!embedded && <SiteFooter />}
    </div>
  );
}
