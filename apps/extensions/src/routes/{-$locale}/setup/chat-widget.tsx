import { createFileRoute } from '@tanstack/react-router';
import { useDeferredValue, useEffect, useId, useMemo, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { FieldLabel } from '#/components/ui/field-label';
import { MultiSelect, type MultiSelectOption } from '#/components/ui/multi-select';
import { NumberField } from '#/components/ui/number-field';
import { RangeField } from '#/components/ui/range-field';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { Select, type SelectOption } from '#/components/ui/select';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { getHighlightSwatch } from '#/features/widgets/chat-widget/highlights';
import {
  type Animation,
  buildWidgetParams,
  DEFAULT_SETTINGS,
  DURATIONS,
  type Duration,
  type Font,
  type Highlight,
  type Layout,
  type Orientation,
  type PlatformDisplay,
  parseWidgetUrl,
  type Settings,
} from '#/features/widgets/chat-widget/widget-settings';
import { useI18n } from '#/lib/i18n';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/chat-widget')({
  head: () => getSetupPageHead('chat-box', { breadcrumb: 'chatWidget.breadcrumb', faq: FAQ }),
  component: ChatWidgetSetup,
});

// Messages per second for the mock preview only; index 0 keeps the widget's default mock pace.
const PREVIEW_RATES = [0.3, 0.5, 1, 2, 3, 5, 10, 15, 20];

const WIDGET = getWidget('chat-box');

const FAQ: FaqEntry[] = [
  ['chatWidget.faq1Q', 'chatWidget.faq1A'],
  ['chatWidget.faq2Q', 'chatWidget.faq2A'],
];

type EmoteProvider = 'sevenTv' | 'bttv' | 'ffz';

function ChatWidgetSetup() {
  const { locale, t } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [previewRateIndex, setPreviewRateIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const id = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const deferredTwitch = useDeferredValue(twitchChannel);
  const deferredKick = useDeferredValue(kickChannel);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const widgetUrl = useMemo(() => {
    if (!mounted) return '';
    const params = buildWidgetParams(settings, twitchChannel, kickChannel);
    if (!params.has('twitch') && !params.has('kick')) return '';
    return `${window.location.origin}/widgets/chat-widget?${params.toString()}`;
  }, [mounted, settings, twitchChannel, kickChannel]);

  const previewUrl = useMemo(() => {
    if (!mounted) return '';
    const params = buildWidgetParams(settings, deferredTwitch, deferredKick);
    params.append('mock', 'true');
    if (previewRateIndex > 0) params.append('mockRate', String(PREVIEW_RATES[previewRateIndex]));
    params.append('lang', locale);
    return `${window.location.origin}/widgets/chat-widget?${params.toString()}`;
  }, [mounted, settings, deferredTwitch, deferredKick, previewRateIndex, locale]);

  const applyWidgetUrl = (text: string) => {
    const parsed = parseWidgetUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  const platformDisplayOptions: SelectOption<PlatformDisplay>[] = [
    { value: 'name', label: t('chatWidget.platformName') },
    { value: 'icon', label: t('chatWidget.platformIcon') },
    { value: 'none', label: t('chatWidget.platformHidden') },
  ];
  const fontOptions: SelectOption<Font>[] = [
    { value: 'inter', label: 'Inter' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'nunito', label: 'Nunito' },
    { value: 'mono', label: 'JetBrains Mono' },
    { value: 'serif', label: 'Source Serif 4' },
    { value: 'system', label: t('chatWidget.fontSystem') },
  ];
  const orientationOptions: SegmentedOption<Orientation>[] = [
    { value: 'vertical', label: t('chatWidget.vertical') },
    { value: 'horizontal', label: t('chatWidget.horizontal') },
  ];
  const layoutOptions: SelectOption<Layout>[] = [
    { value: 'inline', label: t('chatWidget.layoutInline') },
    { value: 'stacked', label: t('chatWidget.layoutStacked') },
    { value: 'card', label: t('chatWidget.layoutCard') },
    { value: 'compact', label: t('chatWidget.layoutCompact') },
  ];
  const animationOptions: SelectOption<Animation>[] = [
    { value: 'slide', label: t('chatWidget.animSlide') },
    { value: 'smooth', label: t('chatWidget.animSmoothSlide') },
    { value: 'pop', label: t('chatWidget.animPop') },
    { value: 'bounce', label: t('chatWidget.animBounce') },
    { value: 'stagger', label: t('chatWidget.animStagger') },
    { value: 'fade', label: t('chatWidget.animFade') },
    { value: 'typing', label: t('chatWidget.animTyping') },
    { value: 'none', label: t('chatWidget.animNone') },
  ];

  const emoteOptions: MultiSelectOption<EmoteProvider>[] = [
    { value: 'sevenTv', label: '7TV', hint: 'Twitch, Kick' },
    { value: 'bttv', label: 'BTTV', hint: 'Twitch' },
    { value: 'ffz', label: 'FFZ', hint: 'Twitch' },
  ];
  const emoteValue = emoteOptions
    .map((option) => option.value)
    .filter((provider) => settings[provider]);
  const durationOptions: SelectOption<Duration>[] = DURATIONS.map((value) => ({
    value,
    label:
      value === 'keep'
        ? t('chatWidget.durationKeep')
        : Number(value) < 60
          ? t('chatWidget.durationSeconds', { count: value })
          : t('chatWidget.durationMinutes', { count: Number(value) / 60 }),
  }));

  const highlightOptions: MultiSelectOption<Highlight>[] = (
    [
      { value: 'mention', label: t('chatWidget.highlightMention') },
      { value: 'reply', label: t('chatWidget.highlightReply') },
      { value: 'firstMessage', label: t('chatWidget.highlightFirstMessage'), hint: 'Twitch' },
      { value: 'announcement', label: t('chatWidget.highlightAnnouncement'), hint: 'Twitch' },
      { value: 'highlighted', label: t('chatWidget.highlightHighlighted'), hint: 'Twitch' },
    ] as const
  ).map((option) => ({ ...option, color: getHighlightSwatch(option.value) }));
  const highlightsSummary =
    settings.highlights.length === 0
      ? t('chatWidget.highlightsNone')
      : settings.highlights.length === highlightOptions.length
        ? t('chatWidget.highlightsAll')
        : highlightOptions
            .filter((option) => settings.highlights.includes(option.value))
            .map((option) => option.label)
            .join(', ');

  const settingsPanel = (
    <>
      <SettingsGroup title={t('common.sectionChannel')}>
        <ChannelFields
          platforms={settings.platforms}
          onPlatformsChange={(value) => update('platforms', value)}
          platformsTip={t('chatWidget.platformsTip')}
          twitch={twitchChannel}
          onTwitchChange={setTwitchChannel}
          kick={kickChannel}
          onKickChange={setKickChannel}
          aside={
            <div>
              <FieldLabel id={`${id}-indicator`} tip={t('chatWidget.platformIndicatorTip')}>
                {t('chatWidget.platformIndicator')}
              </FieldLabel>
              <Select
                labelledBy={`${id}-indicator`}
                disabled={settings.platforms !== 'both'}
                value={settings.platformDisplay}
                onChange={(value) => update('platformDisplay', value)}
                options={platformDisplayOptions}
              />
            </div>
          }
        />
      </SettingsGroup>

      <SettingsGroup title={t('common.sectionAppearance')}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <FieldLabel id={`${id}-font`}>{t('chatWidget.font')}</FieldLabel>
            <Select
              labelledBy={`${id}-font`}
              value={settings.font}
              onChange={(value) => update('font', value)}
              options={fontOptions}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${id}-font-size`}>{t('chatWidget.fontSize')}</FieldLabel>
            <NumberField
              id={`${id}-font-size`}
              value={settings.fontSize}
              onChange={(value) => update('fontSize', value)}
              min={8}
              max={72}
              fallback={Number(DEFAULT_SETTINGS.fontSize)}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <FieldLabel id={`${id}-orientation`} tip={t('chatWidget.orientationTip')}>
              {t('chatWidget.orientation')}
            </FieldLabel>
            <SegmentedControl
              labelledBy={`${id}-orientation`}
              value={settings.orientation}
              onChange={(value) => update('orientation', value)}
              options={orientationOptions}
            />
          </div>
        </div>
        <div>
          <FieldLabel id={`${id}-layout`}>{t('chatWidget.messageLayout')}</FieldLabel>
          <Select
            labelledBy={`${id}-layout`}
            value={settings.layout}
            onChange={(value) => update('layout', value)}
            options={layoutOptions}
          />
        </div>
        <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          <Switch
            label={t('chatWidget.darkBackground')}
            tip={t('chatWidget.darkBackgroundTip')}
            checked={settings.background}
            onChange={(value) => update('background', value)}
          />
          <RangeField
            hideLabel
            label={t('chatWidget.backgroundOpacity')}
            min={0}
            max={1}
            step={0.1}
            disabled={!settings.background}
            value={settings.bgOpacity}
            onChange={(value) => update('bgOpacity', value)}
            format={(value) => `${Math.round(value * 100)}%`}
          />
          <Switch
            label={t('chatWidget.messageBackgroundBox')}
            tip={t('chatWidget.messageBackgroundHint')}
            checked={settings.itemBackground}
            onChange={(value) => update('itemBackground', value)}
          />
          <Switch
            label={t('chatWidget.platformAccent')}
            tip={t('chatWidget.platformAccentHint')}
            checked={settings.platformAccent}
            onChange={(value) => update('platformAccent', value)}
          />
          <Switch
            label={t('chatWidget.boldUsernames')}
            checked={settings.boldUsernames}
            onChange={(value) => update('boldUsernames', value)}
          />
          <Switch
            label={t('chatWidget.boldMessages')}
            checked={settings.boldMessages}
            onChange={(value) => update('boldMessages', value)}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('chatWidget.sectionMessages')}>
        {/* Highlights share the animation row: one more row would make the panel scroll
            at 1366×768. */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel id={`${id}-animation`} tip={t('chatWidget.animationTip')}>
              {t('chatWidget.newMessageAnimation')}
            </FieldLabel>
            <Select
              labelledBy={`${id}-animation`}
              value={settings.animation}
              onChange={(value) => update('animation', value)}
              options={animationOptions}
            />
          </div>
          <div>
            <FieldLabel id={`${id}-highlights`} tip={t('chatWidget.highlightsTip')}>
              {t('chatWidget.highlights')}
            </FieldLabel>
            <MultiSelect
              labelledBy={`${id}-highlights`}
              value={settings.highlights}
              onChange={(value) => update('highlights', value)}
              options={highlightOptions}
              summary={highlightsSummary}
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel id={`${id}-emotes`} tip={t('chatWidget.emotesTip')}>
              {t('chatWidget.emotes')}
            </FieldLabel>
            <MultiSelect
              labelledBy={`${id}-emotes`}
              value={emoteValue}
              onChange={(value) =>
                setSettings((current) => ({
                  ...current,
                  sevenTv: value.includes('sevenTv'),
                  bttv: value.includes('bttv'),
                  ffz: value.includes('ffz'),
                }))
              }
              options={emoteOptions}
              summary={
                emoteValue.length > 0
                  ? emoteOptions
                      .filter((option) => emoteValue.includes(option.value))
                      .map((option) => option.label)
                      .join(', ')
                  : t('chatWidget.emotesNone')
              }
            />
          </div>
          <div>
            <FieldLabel id={`${id}-duration`} tip={t('chatWidget.messageDurationTip')}>
              {t('chatWidget.messageDuration')}
            </FieldLabel>
            <Select
              labelledBy={`${id}-duration`}
              value={settings.duration}
              onChange={(value) => update('duration', value)}
              options={durationOptions}
            />
          </div>
        </div>
        <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          <Switch
            label={t('chatWidget.showBadges')}
            tip={t('chatWidget.badgesTip')}
            checked={settings.badges}
            onChange={(value) => update('badges', value)}
          />
          <Switch
            label={t('chatWidget.showMessageTime')}
            checked={settings.timestamp}
            onChange={(value) => update('timestamp', value)}
          />
          <Switch
            label={t('chatWidget.hideBots')}
            tip={t('chatWidget.hideBotsTip')}
            checked={settings.hideBots}
            onChange={(value) => update('hideBots', value)}
          />
          <Switch
            label={t('chatWidget.hideCommands')}
            tip={t('chatWidget.hideCommandsTip')}
            checked={settings.hideCommands}
            onChange={(value) => update('hideCommands', value)}
          />
        </div>
      </SettingsGroup>
    </>
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('chatWidget.title')}
      settings={settingsPanel}
      previewTitle={t('chatWidget.previewTitle')}
      previewTip={t('chatWidget.previewHint')}
      preview={<PreviewFrame src={previewUrl} title={t('chatWidget.previewIframeTitle')} />}
      previewFooter={
        <RangeField
          layout="inline"
          label={t('chatWidget.previewSpeed')}
          tip={t('chatWidget.previewSpeedHint')}
          min={0}
          max={PREVIEW_RATES.length - 1}
          value={previewRateIndex}
          onChange={(value) => setPreviewRateIndex(Number(value))}
          format={(index) => t('chatWidget.previewSpeedValue', { rate: PREVIEW_RATES[index] })}
          readoutClassName="w-20"
        />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('chatWidget.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('chatWidget.browserSourceHintSize')}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('chatWidget.widgetUrlPlaceholder')}
          invalidMessage={t('chatWidget.widgetUrlInvalid')}
        />
      }
      intro={t('chatWidget.intro')}
      guideTitle={t('chatWidget.guideTitle')}
      guideSteps={['chatWidget.guideStep1', 'chatWidget.guideStep2', 'chatWidget.guideStep3']}
      faq={FAQ}
    />
  );
}
