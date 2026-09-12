import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useId, useMemo, useState } from 'react';
import { CopyUrlField } from '#/components/copy-url-field';
import { ExternalIcon } from '#/components/icons';
import { SetupShell } from '#/components/setup-shell';
import { SettingsGroup } from '#/components/ui/settings-group';
import { TextField } from '#/components/ui/text-field';
import { type CommandUser, summarizeCommandUsers } from '#/features/tools/command-users';
import {
  CommandUsersField,
  PLATFORM_LABELS,
  PlatformDot,
} from '#/features/tools/command-users-field';
import {
  buildObsBridgeParams,
  DEFAULT_OBS_COMMANDS,
  OBS_COMMAND_KEYS,
  type ObsBridgeCustomCommands,
  type ObsCommandKey,
} from '#/features/tools/obs-bridge-config';
import { ObsCommandList } from '#/features/tools/obs-command-list';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

const WIDGET = getWidget('obs-bridge');

const FAQ: FaqEntry[] = [
  ['obsBridge.faq1Q', 'obsBridge.faq1A'],
  ['obsBridge.faq2Q', 'obsBridge.faq2A'],
  ['obsBridge.faq3Q', 'obsBridge.faq3A'],
];

export const Route = createFileRoute('/{-$locale}/setup/obs-bridge')({
  head: ({ params }) =>
    getSetupPageHead('obs-bridge', getParamsLocale(params), {
      breadcrumb: 'obsBridge.breadcrumb',
      faq: FAQ,
    }),
  component: ObsBridgeSetup,
});

const COMMAND_TIPS: Partial<Record<ObsCommandKey, TranslationKey>> = {
  cmdScene: 'obsBridge.sceneTip',
  cmdBrb: 'obsBridge.brbTip',
  cmdBack: 'obsBridge.backTip',
};

// Mobile: scene on its own row, then pairs. sm and up: scene / brb / back, then the stream and
// record pairs.
const COMMAND_CELLS: Record<ObsCommandKey, string> = {
  cmdScene: 'col-span-2',
  cmdBrb: 'sm:col-span-2',
  cmdBack: 'sm:col-span-2',
  cmdStartStream: 'sm:col-span-3',
  cmdStopStream: 'sm:col-span-3',
  cmdStartRecord: 'sm:col-span-3',
  cmdStopRecord: 'sm:col-span-3',
};

const SUMMARY_HEADING = 'mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300';
const SUMMARY_WARNING =
  'rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs leading-relaxed text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300';

function ObsBridgeSetup() {
  const { t } = useI18n();
  const id = useId();
  const [twitch, setTwitch] = useState('');
  const [kick, setKick] = useState('');
  const [commandUsers, setCommandUsers] = useState<CommandUser[]>([]);
  const [commands, setCommands] = useState<ObsBridgeCustomCommands>({});
  const [obsWebsocketUrl, setObsWebsocketUrl] = useState('');
  const [obsWebsocketPassword, setObsWebsocketPassword] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const platforms = { twitch: Boolean(twitch.trim()), kick: Boolean(kick.trim()) };
  const hasChannel = platforms.twitch || platforms.kick;

  const toolUrl = useMemo(() => {
    if (!mounted || (!twitch.trim() && !kick.trim())) return '';
    const params = buildObsBridgeParams({
      twitch,
      kick,
      commandUsers,
      commands,
      obsWebsocketUrl,
      obsWebsocketPassword,
    });
    return `${window.location.origin}${WIDGET.widgetPath}?${params.toString()}`;
  }, [mounted, twitch, kick, commandUsers, commands, obsWebsocketUrl, obsWebsocketPassword]);

  const users = summarizeCommandUsers(commandUsers, platforms);
  const notListening = (['twitch', 'kick'] as const)
    .map((platform) => ({
      platform,
      names: users.notListening.filter((u) => u.platform === platform).map((u) => u.name),
    }))
    .filter((group) => group.names.length > 0);

  const settingsPanel = (
    <>
      <SettingsGroup title={t('obsBridge.sectionChannels')}>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label={t('common.twitchChannel')}
            tip={t('common.channelTip')}
            value={twitch}
            onChange={setTwitch}
            placeholder={t('common.channelPlaceholder')}
            autoComplete="off"
            spellCheck={false}
          />
          <TextField
            label={t('common.kickChannel')}
            tip={t('common.channelTip')}
            value={kick}
            onChange={setKick}
            placeholder={t('common.channelPlaceholder')}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('obsBridge.sectionUsers')}>
        <CommandUsersField
          users={commandUsers}
          onChange={setCommandUsers}
          platforms={platforms}
          label={t('obsBridge.usersLabel')}
          tip={t('obsBridge.usersTip')}
        />
      </SettingsGroup>

      <SettingsGroup title={t('obsBridge.sectionCommands')}>
        <p className="text-xs leading-relaxed text-zinc-500">{t('obsBridge.commandsHint')}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
          {OBS_COMMAND_KEYS.map((key) => {
            const tip = COMMAND_TIPS[key];
            return (
              <div key={key} className={COMMAND_CELLS[key]}>
                <TextField
                  label={t(`obsBridge.label.${key}`)}
                  tip={tip && t(tip)}
                  value={commands[key] ?? ''}
                  onChange={(value) => setCommands((current) => ({ ...current, [key]: value }))}
                  placeholder={DEFAULT_OBS_COMMANDS[key]}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            );
          })}
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('obsBridge.sectionConnection')}>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label={t('obsBridge.wsUrl')}
            tip={t('obsBridge.wsUrlTip')}
            value={obsWebsocketUrl}
            onChange={setObsWebsocketUrl}
            placeholder={t('obsBridge.wsUrlPlaceholder')}
            autoComplete="off"
            spellCheck={false}
          />
          <TextField
            type="password"
            label={t('obsBridge.wsPassword')}
            tip={t('obsBridge.wsPasswordTip')}
            value={obsWebsocketPassword}
            onChange={setObsWebsocketPassword}
            placeholder={t('obsBridge.wsPasswordPlaceholder')}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </SettingsGroup>
    </>
  );

  const summary = (
    <div className="h-full space-y-5 overflow-y-auto p-1">
      <section aria-labelledby={`${id}-summary-commands`}>
        <h3 id={`${id}-summary-commands`} className={SUMMARY_HEADING}>
          {t('obsBridge.summaryCommands')}
        </h3>
        <ObsCommandList commands={commands} />
      </section>

      <section aria-labelledby={`${id}-summary-users`} className="space-y-2">
        <h3 id={`${id}-summary-users`} className={SUMMARY_HEADING}>
          {t('obsBridge.summaryUsers')}
        </h3>
        {users.active.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {users.active.map((user) => (
              <li
                key={`${user.platform}:${user.name}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <PlatformDot platform={user.platform} />
                {user.name}
              </li>
            ))}
          </ul>
        )}
        {commandUsers.length === 0 && (
          <p className={SUMMARY_WARNING}>{t('obsBridge.summaryNobody')}</p>
        )}
        {hasChannel &&
          notListening.map((group) => (
            <p key={group.platform} className={SUMMARY_WARNING}>
              {t('obsBridge.summaryNotListening', {
                platform: PLATFORM_LABELS[group.platform],
                names: group.names.join(', '),
              })}
            </p>
          ))}
      </section>

      <section aria-labelledby={`${id}-summary-channels`}>
        <h3 id={`${id}-summary-channels`} className={SUMMARY_HEADING}>
          {t('obsBridge.summaryChannels')}
        </h3>
        {hasChannel ? (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-800 dark:text-zinc-200">
            {(['twitch', 'kick'] as const)
              .filter((platform) => platforms[platform])
              .map((platform) => (
                <li key={platform} className="inline-flex items-center gap-1.5">
                  <PlatformDot platform={platform} />
                  <span className="break-all font-medium">
                    {(platform === 'twitch' ? twitch : kick).trim().toLowerCase()}
                  </span>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-xs text-zinc-500">{t('obsBridge.summaryNoChannel')}</p>
        )}
      </section>
    </div>
  );

  const openTool = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {toolUrl ? (
        <a
          href={toolUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-zinc-900"
        >
          {t('obsBridge.openTool')}
          <ExternalIcon className="size-4 text-zinc-500" />
          <span className="sr-only"> {t('common.newTab')}</span>
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-900 opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        >
          {t('obsBridge.openTool')}
          <ExternalIcon className="size-4 text-zinc-500" />
        </button>
      )}
      <p className="min-w-0 flex-1 text-xs leading-relaxed text-zinc-500">
        {toolUrl ? t('obsBridge.openToolHint') : t('obsBridge.summaryNoChannel')}
      </p>
    </div>
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('obsBridge.title')}
      settings={settingsPanel}
      previewTitle={t('obsBridge.previewTitle')}
      previewTip={t('obsBridge.previewTip')}
      preview={summary}
      previewFooter={openTool}
      urlField={
        <CopyUrlField
          url={toolUrl}
          label={t('common.toolUrl')}
          tip={t('obsBridge.toolUrlTip')}
          hint={t('obsBridge.toolUrlHint')}
          nextSteps={[t('obsBridge.nextOpen'), t('obsBridge.nextKeepOpen')]}
        />
      }
      intro={t('obsBridge.intro')}
      guideSteps={[
        'obsBridge.guideStep1',
        'obsBridge.guideStep2',
        'obsBridge.guideStep3',
        'obsBridge.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
