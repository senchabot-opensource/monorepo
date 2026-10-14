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
import { DurationField } from '#/components/ui/duration-field';
import { FieldLabel } from '#/components/ui/field-label';
import { SegmentedControl } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS, TextField } from '#/components/ui/text-field';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import { COMMAND } from '#/features/widgets/event-list/event-list-state';
import { PREVIEW_CHANNEL, type PreviewMessage } from '#/features/widgets/event-list/use-event-list';
import { hueFor, PLATFORM_COLORS } from '#/features/widgets/overlay-style';
import type { SubathonEvent, SubathonPlatform } from '#/features/widgets/subathon/subathon-events';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import {
  buildEventListPreviewUrl,
  buildEventListUrl,
  DEFAULT_EVENT_LIST_SETTINGS,
  EVENT_KINDS,
  EVENT_LIST_COLORS,
  EVENT_LIST_NEWEST,
  type EventListSettings,
  eventListStage,
  MAX_FADE_SECONDS,
  MAX_MIN_BITS,
  MAX_MIN_RAID,
  MAX_ROWS,
  MIN_ROWS,
  parseEventListUrl,
  TITLE_MAX_LENGTH,
} from '#/lib/event-list-url';
import { useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/event-list')({
  head: ({ params }) =>
    getSetupPageHead('event-list', getParamsLocale(params), {
      breadcrumb: 'eventList.breadcrumb',
      faq: FAQ,
    }),
  component: EventListSetup,
});

const WIDGET = getWidget('event-list');

const FAQ: FaqEntry[] = [
  ['eventList.faq1Q', 'eventList.faq1A'],
  ['eventList.faq2Q', 'eventList.faq2A'],
  ['eventList.faq3Q', 'eventList.faq3A'],
  ['eventList.faq4Q', 'eventList.faq4A'],
];

function EventListSetup() {
  const { t, locale } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  const [settings, setSettings] = useState(DEFAULT_EVENT_LIST_SETTINGS);
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const nextPlatform = useRef<SubathonPlatform>('twitch');
  const id = useId();

  const update = <K extends keyof EventListSettings>(key: K, value: EventListSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));

  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted
    ? buildEventListUrl(origin, settings, twitchChannel, kickChannel, locale)
    : '';
  const previewUrl = mounted ? buildEventListPreviewUrl(origin, settings, locale, previewId) : '';

  const stage = eventListStage(settings.rows);

  const applyWidgetUrl = (text: string) => {
    const parsed = parseEventListUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  const countField = (
    key: 'rows' | 'minBits' | 'minRaid',
    label: string,
    tip: string,
    min: number,
    max: number,
  ) => (
    <div>
      <FieldLabel htmlFor={`${id}-${key}`} tip={tip}>
        {label}
      </FieldLabel>
      <CountField
        id={`${id}-${key}`}
        value={settings[key]}
        onChange={(value) => update(key, value)}
        min={min}
        max={max}
      />
    </div>
  );

  const eventsTab = (
    <SettingsGroup title={t('eventList.sectionEvents')} hideTitle>
      <div className="space-y-2">
        {EVENT_KINDS.map((kind) => (
          <Switch
            key={kind}
            label={t(`eventList.kinds.${kind}`)}
            checked={settings.kinds[kind]}
            onChange={(value) => update('kinds', { ...settings.kinds, [kind]: value })}
          />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {countField('minBits', t('eventList.minBits'), t('eventList.minBitsTip'), 1, MAX_MIN_BITS)}
        {countField('minRaid', t('eventList.minRaid'), t('eventList.minRaidTip'), 1, MAX_MIN_RAID)}
      </div>
      <p className={`${HINT_CLASS} mt-0`}>{t('eventList.kindsHint')}</p>
    </SettingsGroup>
  );

  const appearanceTab = (
    <SettingsGroup title={t('common.sectionAppearance')} hideTitle>
      <PresetField value={settings.preset} onChange={(value) => update('preset', value)} />
      {isClassic(settings.preset) && (
        <div>
          <FieldLabel id={`${id}-color`}>{t('common.setup.color')}</FieldLabel>
          <ColorSwatches
            labelledBy={`${id}-color`}
            value={settings.color}
            onChange={(value) => update('color', value)}
            options={EVENT_LIST_COLORS.map((color) => ({
              value: color,
              label:
                color === 'platform'
                  ? t('streamAlerts.colors.platform')
                  : t(`subathon.colors.${color}`),
              background:
                color === 'platform'
                  ? `linear-gradient(135deg, ${PLATFORM_COLORS.twitch} 50%, ${PLATFORM_COLORS.kick} 50%)`
                  : `hsl(${hueFor(color, 1)} 85% 52%)`,
            }))}
          />
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {countField('rows', t('eventList.rows'), t('eventList.rowsTip'), MIN_ROWS, MAX_ROWS)}
        <div>
          <FieldLabel id={`${id}-newest`} tip={t('eventList.newestTip')}>
            {t('eventList.newest')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-newest`}
            value={settings.newest}
            onChange={(value) => update('newest', value)}
            options={EVENT_LIST_NEWEST.map((value) => ({
              value,
              label: t(`eventList.newestOptions.${value}`),
            }))}
          />
        </div>
      </div>
      <div>
        <FieldLabel id={`${id}-fade`} tip={t('eventList.fadeTip')}>
          {t('eventList.fade')}
        </FieldLabel>
        <DurationField
          labelledBy={`${id}-fade`}
          value={settings.fade}
          onChange={(value) => update('fade', value)}
          units={['m', 's']}
          unitLabels={[t('goal.unitMinutes'), t('goal.unitSeconds')]}
          max={MAX_FADE_SECONDS}
        />
        {settings.fade === 0 && <p className={HINT_CLASS}>{t('eventList.fadeOff')}</p>}
      </div>
      <TextField
        label={t('common.setup.titleLabel')}
        tip={t('eventList.titleTip')}
        value={settings.title}
        onChange={(value) => update('title', value)}
        placeholder={t('goal.titlePlaceholder')}
        maxLength={TITLE_MAX_LENGTH}
        spellCheck={false}
      />
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

  // With both platforms on, test events take turns, so both platforms' rows get shown.
  const testPlatform = (): SubathonPlatform => {
    if (settings.platforms !== 'both') return settings.platforms === 'kick' ? 'kick' : 'twitch';
    const platform = nextPlatform.current;
    nextPlatform.current = platform === 'twitch' ? 'kick' : 'twitch';
    return platform;
  };
  const name = t('goal.testViewer');
  const tests: { label: string; event: () => SubathonEvent }[] = [
    {
      label: t('eventList.testSub'),
      event: () => ({ kind: 'sub', platform: testPlatform(), name, tier: 1, months: 1 }),
    },
    {
      label: t('eventList.testResub'),
      event: () => ({ kind: 'sub', platform: testPlatform(), name, tier: 1, months: 6 }),
    },
    {
      label: t('eventList.testGift'),
      event: () => ({ kind: 'gift', platform: testPlatform(), name, tier: 1, count: 5 }),
    },
    {
      label: t('eventList.testBits'),
      event: () => ({ kind: 'bits', platform: testPlatform(), name, amount: 500 }),
    },
    {
      label: t('eventList.testRaid'),
      event: () => ({ kind: 'raid', platform: testPlatform(), name, viewers: 42 }),
    },
  ];

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('eventList.title')}
      settingsPinned={channelGroup}
      settingsTabs={[
        { id: 'events', label: t('eventList.sectionEvents'), content: eventsTab },
        { id: 'appearance', label: t('common.sectionAppearance'), content: appearanceTab },
      ]}
      previewTitle={t('eventList.previewTitle')}
      previewTip={t('eventList.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame src={previewUrl} title={t('eventList.previewIframeTitle')} canvas={stage} />
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
      intro={t('eventList.intro')}
      aboutExtra={
        <ChatCommandsCard
          title={t('eventList.sectionCommands')}
          intro={t('eventList.commandsIntro')}
          commands={[{ usage: `${COMMAND} clear`, action: t('eventList.cmdClear') }]}
        />
      }
      guideTitle={t('common.setup.guideTitle')}
      guideSteps={[
        'common.setup.guideAddSource',
        'common.setup.guidePaste',
        'eventList.guideStep3',
        'eventList.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
