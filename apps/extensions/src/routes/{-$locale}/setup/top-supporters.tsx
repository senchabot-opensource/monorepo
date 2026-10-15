import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useId, useRef, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { ChatCommandsCard } from '#/components/chat-commands-card';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { TestButtons } from '#/components/test-buttons';
import { ColorSwatches } from '#/components/ui/color-swatches';
import { CountField } from '#/components/ui/count-field';
import { FieldLabel } from '#/components/ui/field-label';
import { SegmentedControl } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { TextField } from '#/components/ui/text-field';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import { COMMAND } from '#/features/widgets/leaderboard/leaderboard-state';
import {
  PREVIEW_CHANNEL,
  type PreviewMessage,
} from '#/features/widgets/leaderboard/use-leaderboard';
import { hueFor } from '#/features/widgets/overlay-style';
import type { SubathonEvent, SubathonPlatform } from '#/features/widgets/subathon/subathon-events';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import {
  BOARDS,
  type Board,
  buildLeaderboardPreviewUrl,
  buildLeaderboardUrl,
  DEFAULT_LEADERBOARD_SETTINGS,
  LEADERBOARD_COLORS,
  type LeaderboardSettings,
  leaderboardStage,
  MAX_ROWS,
  MIN_ROWS,
  parseLeaderboardUrl,
  TITLE_MAX_LENGTH,
} from '#/lib/leaderboard-url';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/top-supporters')({
  head: ({ params }) =>
    getSetupPageHead('leaderboard', getParamsLocale(params), {
      breadcrumb: 'leaderboard.breadcrumb',
      faq: FAQ,
    }),
  component: LeaderboardSetup,
});

const WIDGET = getWidget('leaderboard');

const FAQ: FaqEntry[] = [
  ['leaderboard.faq1Q', 'leaderboard.faq1A'],
  ['leaderboard.faq2Q', 'leaderboard.faq2A'],
  ['leaderboard.faq3Q', 'leaderboard.faq3A'],
  ['leaderboard.faq4Q', 'leaderboard.faq4A'],
];

const DEFAULT_TITLES: Record<Board, TranslationKey> = {
  gifts: 'leaderboard.defaultTitles.gifts',
  cheers: 'leaderboard.defaultTitles.cheers',
  latest: 'leaderboard.defaultTitles.latest',
};

function LeaderboardSetup() {
  const { t, locale } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  // The title starts in the page's language; it's always written to the URL.
  const [settings, setSettings] = useState<LeaderboardSettings>(() => ({
    ...DEFAULT_LEADERBOARD_SETTINGS,
    title: t(DEFAULT_TITLES.gifts),
  }));
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const nextPlatform = useRef<SubathonPlatform>('twitch');
  const id = useId();

  const update = <K extends keyof LeaderboardSettings>(key: K, value: LeaderboardSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));

  // A title left at the old board's default follows the board; a title of your own stays.
  const pickBoard = (board: Board) =>
    setSettings((current) => ({
      ...current,
      board,
      title:
        current.title === t(DEFAULT_TITLES[current.board])
          ? t(DEFAULT_TITLES[board])
          : current.title,
    }));

  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted
    ? buildLeaderboardUrl(origin, settings, twitchChannel, kickChannel, locale)
    : '';
  const previewUrl = mounted ? buildLeaderboardPreviewUrl(origin, settings, locale, previewId) : '';

  const stage = leaderboardStage(settings);

  const applyWidgetUrl = (text: string) => {
    const parsed = parseLeaderboardUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  const boardTab = (
    <SettingsGroup title={t('leaderboard.sectionBoard')} hideTitle>
      <div>
        <FieldLabel id={`${id}-board`} tip={t('leaderboard.boardTip')}>
          {t('leaderboard.board')}
        </FieldLabel>
        <SegmentedControl
          labelledBy={`${id}-board`}
          value={settings.board}
          onChange={pickBoard}
          options={BOARDS.map((board) => ({
            value: board,
            label: t(`leaderboard.boards.${board}`),
          }))}
        />
      </div>
      {settings.board !== 'latest' && (
        <div>
          <FieldLabel htmlFor={`${id}-rows`} tip={t('leaderboard.rowsTip')}>
            {t('leaderboard.rows')}
          </FieldLabel>
          <CountField
            id={`${id}-rows`}
            value={settings.rows}
            onChange={(value) => update('rows', value)}
            min={MIN_ROWS}
            max={MAX_ROWS}
          />
        </div>
      )}
      <TextField
        label={t('common.setup.titleLabel')}
        tip={t('leaderboard.titleTip')}
        value={settings.title}
        onChange={(value) => update('title', value)}
        placeholder={t('goal.titlePlaceholder')}
        maxLength={TITLE_MAX_LENGTH}
        spellCheck={false}
      />
    </SettingsGroup>
  );

  const appearanceTab = (
    <SettingsGroup title={t('common.sectionAppearance')} hideTitle>
      <PresetField
        value={settings.preset}
        onChange={(value) => update('preset', value)}
        fx={settings.fx}
        onFxChange={(on) => update('fx', on)}
        font={settings.font}
        onFontChange={(font) => update('font', font)}
      />
      {isClassic(settings.preset) && (
        <div>
          <FieldLabel id={`${id}-color`}>{t('common.setup.color')}</FieldLabel>
          <ColorSwatches
            labelledBy={`${id}-color`}
            value={settings.color}
            onChange={(value) => update('color', value)}
            options={LEADERBOARD_COLORS.map((color) => ({
              value: color,
              label: t(`subathon.colors.${color}`),
              background: `hsl(${hueFor(color, 1)} 85% 52%)`,
            }))}
          />
        </div>
      )}
    </SettingsGroup>
  );

  const channelGroup = (
    <SettingsGroup title={t('common.sectionChannel')}>
      <ChannelFields
        platforms={settings.platforms}
        onPlatformsChange={(value) => update('platforms', value)}
        twitch={twitchChannel}
        onTwitchChange={setTwitchChannel}
        kick={kickChannel}
        onKickChange={setKickChannel}
      />
    </SettingsGroup>
  );

  const testPlatform = (): SubathonPlatform => {
    if (settings.platforms !== 'both') return settings.platforms === 'kick' ? 'kick' : 'twitch';
    const platform = nextPlatform.current;
    nextPlatform.current = platform === 'twitch' ? 'kick' : 'twitch';
    return platform;
  };
  const name = t('goal.testViewer');
  const tests: { label: string; event: () => SubathonEvent }[] = [
    {
      label: t('eventList.testGift'),
      event: () => ({ kind: 'gift', platform: testPlatform(), name, tier: 1, count: 5 }),
    },
    {
      label: t('eventList.testBits'),
      event: () => ({ kind: 'bits', platform: testPlatform(), name, amount: 500 }),
    },
    {
      label: t('eventList.testSub'),
      event: () => ({ kind: 'sub', platform: testPlatform(), name, tier: 1, months: 1 }),
    },
    {
      label: t('eventList.testRaid'),
      event: () => ({ kind: 'raid', platform: testPlatform(), name, viewers: 42 }),
    },
  ];

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('leaderboard.title')}
      settingsPinned={channelGroup}
      settingsTabs={[
        { id: 'board', label: t('leaderboard.sectionBoard'), content: boardTab },
        { id: 'appearance', label: t('common.sectionAppearance'), content: appearanceTab },
      ]}
      previewTitle={t('leaderboard.previewTitle')}
      previewTip={t('leaderboard.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame src={previewUrl} title={t('leaderboard.previewIframeTitle')} canvas={stage} />
      }
      previewFooter={
        <TestButtons
          title={t('common.setup.testTitle')}
          layout="two-four"
          buttons={tests.map(({ label, event }) => ({
            label,
            onClick: () => send({ type: 'event', event: event() }),
          }))}
        />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('common.setup.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('common.setup.sizeHint', stage)}`}
          sourceSize={stage}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('common.setup.widgetUrlPlaceholder')}
          invalidMessage={t('common.setup.widgetUrlInvalid', { name: t(WIDGET.nameKey) })}
        />
      }
      intro={t('leaderboard.intro')}
      aboutExtra={
        <ChatCommandsCard
          title={t('leaderboard.sectionCommands')}
          intro={t('leaderboard.commandsIntro')}
          commands={[{ usage: `${COMMAND} reset`, action: t('leaderboard.cmdReset') }]}
        />
      }
      guideTitle={t('common.setup.guideTitle')}
      guideSteps={[
        'common.setup.guideAddSource',
        'common.setup.guidePaste',
        'leaderboard.guideStep3',
        'leaderboard.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
