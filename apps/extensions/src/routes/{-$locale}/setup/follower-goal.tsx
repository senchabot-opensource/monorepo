import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useEffect, useId, useRef, useState } from 'react';
import { z } from 'zod';
import { ChannelFields, type ChannelPlatforms } from '#/components/channel-fields';
import { ChatCommandsCard } from '#/components/chat-commands-card';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { TestButtons } from '#/components/test-buttons';
import { ColorSwatches } from '#/components/ui/color-swatches';
import { CountField } from '#/components/ui/count-field';
import { DurationField } from '#/components/ui/duration-field';
import { FieldLabel } from '#/components/ui/field-label';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS, TextField } from '#/components/ui/text-field';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import {
  type ChannelEmote,
  loadChannelEmotes,
} from '#/features/widgets/countdown/countdown-emotes';
import { EmotePicker } from '#/features/widgets/countdown/emote-picker';
import {
  FOLLOWER_GOAL_COMMAND,
  type FollowerPreviewMessage,
  PREVIEW_CHANNEL,
} from '#/features/widgets/follower-goal/use-follower-goal';
import { hueFor } from '#/features/widgets/overlay-style';
import type { SubathonPlatform } from '#/features/widgets/subathon/subathon-events';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import {
  buildFollowerGoalPreviewUrl,
  buildFollowerGoalUrl,
  DEFAULT_FOLLOWER_GOAL_SETTINGS,
  FOLLOWER_GOAL_COLORS,
  FOLLOWER_GOAL_ENDS,
  type FollowerGoalEnd,
  type FollowerGoalSettings,
  type FollowerGoalStyle,
  ICON_MAX_LENGTH,
  MAX_END_HOLD_SECONDS,
  MAX_FOLLOWER_GOAL_COUNT,
  parseFollowerGoalUrl,
  TITLE_MAX_LENGTH,
} from '#/lib/follower-goal-url';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { resolveDashboardFollowerGoalUrl } from '#/lib/links';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

const setupSearchSchema = z.object({
  twitch: z.string().optional(),
  kick: z.string().optional(),
  token: z.string().optional(),
});

export const Route = createFileRoute('/{-$locale}/setup/follower-goal')({
  validateSearch: (search) => setupSearchSchema.parse(search),
  head: ({ params }) =>
    getSetupPageHead('follower-goal', getParamsLocale(params), {
      breadcrumb: 'followerGoal.breadcrumb',
      faq: FAQ,
    }),
  component: FollowerGoalSetup,
});

const WIDGET = getWidget('follower-goal');
const CANVAS = WIDGET.sourceSize ?? { width: 800, height: 260 };

const FAQ: FaqEntry[] = [
  ['followerGoal.faq1Q', 'followerGoal.faq1A'],
  ['followerGoal.faq2Q', 'followerGoal.faq2A'],
  ['followerGoal.faq3Q', 'followerGoal.faq3A'],
];

const COMMANDS: { usage: string; action: TranslationKey }[] = [
  { usage: `${FOLLOWER_GOAL_COMMAND} add 3`, action: 'followerGoal.cmdAdd' },
  { usage: `${FOLLOWER_GOAL_COMMAND} remove 1`, action: 'followerGoal.cmdRemove' },
  { usage: `${FOLLOWER_GOAL_COMMAND} set 25`, action: 'followerGoal.cmdSet' },
  { usage: `${FOLLOWER_GOAL_COMMAND} reset`, action: 'followerGoal.cmdReset' },
];

function FollowerGoalSetup() {
  const { t } = useI18n();
  const search = Route.useSearch();
  const [twitchChannel, setTwitchChannel] = useState(search.twitch ?? '');
  const [kickChannel, setKickChannel] = useState(search.kick ?? '');
  const [token, setToken] = useState(search.token ?? '');

  const initialPlatforms = (): ChannelPlatforms => {
    const hasTwitch = Boolean(search.twitch?.trim());
    const hasKick = Boolean(search.kick?.trim());
    if (hasTwitch && !hasKick) return 'twitch';
    if (!hasTwitch && hasKick) return 'kick';
    return 'both';
  };

  const [settings, setSettings] = useState<FollowerGoalSettings>(() => ({
    ...DEFAULT_FOLLOWER_GOAL_SETTINGS,
    platforms: initialPlatforms(),
  }));
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<FollowerPreviewMessage>(PREVIEW_CHANNEL);
  const nextPlatform = useRef<SubathonPlatform>('twitch');
  const id = useId();

  const hasConnectedChannel = Boolean(token.trim() && (twitchChannel.trim() || kickChannel.trim()));

  const update = <K extends keyof FollowerGoalSettings>(key: K, value: FollowerGoalSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));

  // The channel's own emotes for the picker, reloaded a moment after the channel boxes settle.
  const [emotes, setEmotes] = useState<ChannelEmote[] | null>(null);
  const [emotesLoading, setEmotesLoading] = useState(false);
  useEffect(() => {
    const twitch = twitchChannel.trim();
    const kick = kickChannel.trim();
    if (!twitch && !kick) {
      setEmotes(null);
      setEmotesLoading(false);
      return;
    }
    let live = true;
    setEmotesLoading(true);
    const timer = window.setTimeout(() => {
      loadChannelEmotes(twitch, kick).then((list) => {
        if (!live) return;
        setEmotes(list);
        setEmotesLoading(false);
      });
    }, 500);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [twitchChannel, kickChannel]);

  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl =
    mounted && hasConnectedChannel
      ? buildFollowerGoalUrl(origin, settings, twitchChannel, kickChannel, token)
      : '';
  const previewUrl = mounted ? buildFollowerGoalPreviewUrl(origin, settings, previewId) : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseFollowerGoalUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    setToken(parsed.token ?? '');
    return true;
  };

  const countField = (key: 'start' | 'target', label: TranslationKey, tip: TranslationKey) => (
    <div>
      <FieldLabel htmlFor={`${id}-${key}`} tip={t(tip)}>
        {t(label)}
      </FieldLabel>
      <CountField
        id={`${id}-${key}`}
        value={settings[key]}
        onChange={(value) => update(key, value)}
        min={key === 'target' ? 1 : 0}
        max={MAX_FOLLOWER_GOAL_COUNT}
      />
    </div>
  );

  const styleOptions: SegmentedOption<FollowerGoalStyle>[] = [
    { value: 'bar', label: t('followerGoal.styleBar') },
    { value: 'thin', label: t('followerGoal.styleThin') },
  ];

  const endOptions: SegmentedOption<FollowerGoalEnd>[] = FOLLOWER_GOAL_ENDS.map((end) => ({
    value: end,
    label: t(`followerGoal.ends.${end}`),
  }));

  const settingsPanel = (
    <>
      {!hasConnectedChannel && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <div className="font-semibold text-amber-950 dark:text-amber-100">
            {t('followerGoal.tokenNoticeTitle')}
          </div>
          <div className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-200/90">
            {t('followerGoal.tokenNoticeDesc')}
          </div>
          <a
            href={resolveDashboardFollowerGoalUrl()}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 self-start rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700 dark:bg-amber-400 dark:text-zinc-950 dark:hover:bg-amber-300"
          >
            {t('followerGoal.tokenNoticeButton')}
          </a>
        </div>
      )}

      {hasConnectedChannel && (
        <SettingsGroup title={t('common.sectionChannel')}>
          <ChannelFields
            platforms={settings.platforms}
            onPlatformsChange={(value) => update('platforms', value)}
            twitch={twitchChannel}
            onTwitchChange={setTwitchChannel}
            kick={kickChannel}
            onKickChange={setKickChannel}
            disabled={true}
          />
        </SettingsGroup>
      )}

      <SettingsGroup title={t('followerGoal.sectionGoal')}>
        <div className="grid gap-3 sm:grid-cols-2">
          {countField('start', 'followerGoal.start', 'followerGoal.startTip')}
          {countField('target', 'followerGoal.target', 'followerGoal.targetTip')}
        </div>
        <p className={`${HINT_CLASS} mt-0`}>{t('followerGoal.countsHint')}</p>
        <div>
          <FieldLabel id={`${id}-end`} tip={t('followerGoal.endTip')}>
            {t('followerGoal.end')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-end`}
            value={settings.end}
            onChange={(value) => update('end', value)}
            options={endOptions}
          />
        </div>
        {settings.end === 'hide' && (
          <div>
            <FieldLabel id={`${id}-endHold`} tip={t('followerGoal.endHoldTip')}>
              {t('followerGoal.endHold')}
            </FieldLabel>
            <DurationField
              labelledBy={`${id}-endHold`}
              value={settings.endHold}
              onChange={(value) => update('endHold', value)}
              units={['m', 's']}
              unitLabels={[t('followerGoal.unitMinutes'), t('followerGoal.unitSeconds')]}
              max={MAX_END_HOLD_SECONDS}
            />
            {settings.endHold === 0 && <p className={HINT_CLASS}>{t('followerGoal.endHoldOff')}</p>}
          </div>
        )}
      </SettingsGroup>

      <SettingsGroup title={t('common.sectionAppearance')}>
        <PresetField value={settings.preset} onChange={(value) => update('preset', value)} />
        <div>
          <FieldLabel id={`${id}-style`} tip={t('followerGoal.styleTip')}>
            {t('followerGoal.style')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-style`}
            value={settings.style}
            onChange={(value) => update('style', value)}
            options={styleOptions}
          />
        </div>
        {isClassic(settings.preset) && (
          <div>
            <FieldLabel id={`${id}-color`}>{t('followerGoal.color')}</FieldLabel>
            <ColorSwatches
              labelledBy={`${id}-color`}
              value={settings.color}
              onChange={(value) => update('color', value)}
              options={FOLLOWER_GOAL_COLORS.map((color) => ({
                value: color,
                label: t(`subathon.colors.${color}`),
                background: `hsl(${hueFor(color, 1)} 85% 52%)`,
              }))}
            />
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label={t('followerGoal.titleLabel')}
            tip={t('followerGoal.titleTip')}
            value={settings.title}
            onChange={(value) => update('title', value)}
            placeholder={t('followerGoal.titlePlaceholder')}
            maxLength={TITLE_MAX_LENGTH}
            spellCheck={false}
          />
          <TextField
            label={t('followerGoal.iconLabel')}
            tip={t('followerGoal.iconTip')}
            value={settings.icon}
            onChange={(value) => update('icon', value)}
            placeholder={t('followerGoal.iconPlaceholder')}
            maxLength={ICON_MAX_LENGTH}
          />
        </div>
        <div>
          <FieldLabel id={`${id}-emote`} tip={t('followerGoal.emoteTip')}>
            {t('followerGoal.emoteLabel')}
          </FieldLabel>
          {!twitchChannel.trim() && !kickChannel.trim() ? (
            <p className={HINT_CLASS}>{t('countdown.emoteNeedChannel')}</p>
          ) : emotesLoading || emotes === null ? (
            <EmotePicker
              labelledBy={`${id}-emote`}
              emotes={[]}
              value=""
              onChange={() => {}}
              disabled
              disabledLabel={t('countdown.emoteLoading')}
            />
          ) : emotes.length === 0 ? (
            <p className={HINT_CLASS}>{t('countdown.emoteEmpty')}</p>
          ) : (
            <EmotePicker
              labelledBy={`${id}-emote`}
              emotes={emotes}
              value={emotes.some((emote) => emote.url === settings.iconUrl) ? settings.iconUrl : ''}
              onChange={(value) => update('iconUrl', value)}
            />
          )}
        </div>
        <div className="flex flex-col justify-end">
          <Switch
            label={t('followerGoal.showPops')}
            tip={t('followerGoal.showPopsTip')}
            checked={settings.pops}
            onChange={(value) => update('pops', value)}
          />
        </div>
      </SettingsGroup>
    </>
  );

  // With both platforms on, test follows take turns between platforms
  const testPlatform = (): SubathonPlatform => {
    if (settings.platforms === 'twitch' || settings.platforms === 'kick') return settings.platforms;
    const platform = nextPlatform.current;
    nextPlatform.current = platform === 'twitch' ? 'kick' : 'twitch';
    return platform;
  };
  const name = t('followerGoal.testViewer');
  const testButtons = [
    {
      label: t('followerGoal.testFollow'),
      onClick: () => send({ type: 'follow', platform: testPlatform(), name }),
    },
    {
      label: t('followerGoal.testReach'),
      onClick: () => send({ type: 'reach' }),
    },
    {
      label: t('followerGoal.testReset'),
      onClick: () => send({ type: 'reset' }),
    },
  ];

  const commands = (
    <ChatCommandsCard
      title={t('followerGoal.sectionCommands')}
      intro={t('followerGoal.commandsIntro')}
      commands={COMMANDS.map((command) => ({ usage: command.usage, action: t(command.action) }))}
    />
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('followerGoal.title')}
      settings={settingsPanel}
      previewTitle={t('followerGoal.previewTitle')}
      previewTip={t('followerGoal.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame src={previewUrl} title={t('followerGoal.previewIframeTitle')} canvas={CANVAS} />
      }
      previewFooter={
        <TestButtons
          title={t('followerGoal.testTitle')}
          layout="three"
          buttons={testButtons}
        />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('followerGoal.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('followerGoal.browserSourceHintSize')}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('followerGoal.widgetUrlPlaceholder')}
          invalidMessage={t('followerGoal.widgetUrlInvalid')}
        />
      }
      intro={t('followerGoal.intro')}
      aboutExtra={commands}
      guideTitle={t('followerGoal.guideTitle')}
      guideSteps={[
        'followerGoal.guideStep1',
        'followerGoal.guideStep2',
        'followerGoal.guideStep3',
        'followerGoal.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
