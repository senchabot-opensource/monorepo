import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useId, useRef, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { BUTTON_TEST } from '#/components/ui/button-styles';
import { ColorSwatches } from '#/components/ui/color-swatches';
import { CountField } from '#/components/ui/count-field';
import { FieldLabel } from '#/components/ui/field-label';
import { RangeField } from '#/components/ui/range-field';
import { SegmentedControl } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { TextField } from '#/components/ui/text-field';
import type { StreamAlert } from '#/features/widgets/stream-alerts/stream-alert';
import { defaultHeadingKey, hueFor } from '#/features/widgets/stream-alerts/stream-alerts-widget';
import {
  PREVIEW_CHANNEL,
  type PreviewMessage,
} from '#/features/widgets/stream-alerts/use-stream-alerts';
import type { SubathonPlatform } from '#/features/widgets/subathon/subathon-events';
import { LOCALES, type Locale, type TranslationKey, translate, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import {
  ALERT_COLORS,
  ALERT_KINDS,
  ALERT_THEMES,
  type AlertColor,
  type AlertKind,
  buildStreamAlertsPreviewUrl,
  buildStreamAlertsUrl,
  DEFAULT_STREAM_ALERTS_SETTINGS,
  HEADING_MAX_LENGTH,
  MAX_DURATION,
  MAX_MIN_AMOUNT,
  MIN_DURATION,
  parseStreamAlertsUrl,
  type StreamAlertsSettings,
} from '#/lib/stream-alerts-url';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/stream-alerts')({
  head: ({ params }) =>
    getSetupPageHead('stream-alerts', getParamsLocale(params), {
      breadcrumb: 'streamAlerts.breadcrumb',
      faq: FAQ,
    }),
  component: StreamAlertsSetup,
});

const WIDGET = getWidget('stream-alerts');
// sourceSize is only null for tools; the fallback just satisfies the type.
const CANVAS = WIDGET.sourceSize ?? { width: 800, height: 450 };

const FAQ: FaqEntry[] = [
  ['streamAlerts.faq1Q', 'streamAlerts.faq1A'],
  ['streamAlerts.faq2Q', 'streamAlerts.faq2A'],
  ['streamAlerts.faq3Q', 'streamAlerts.faq3A'],
  ['streamAlerts.faq4Q', 'streamAlerts.faq4A'],
];

type MinKey = 'minGift' | 'minBits' | 'minRaid';

const KIND_FIELDS: Record<
  AlertKind,
  { label: TranslationKey; tip: TranslationKey; min?: { key: MinKey; label: TranslationKey } }
> = {
  sub: { label: 'streamAlerts.kindSub', tip: 'streamAlerts.kindSubTip' },
  gift: {
    label: 'streamAlerts.kindGift',
    tip: 'streamAlerts.kindGiftTip',
    min: { key: 'minGift', label: 'streamAlerts.minGift' },
  },
  bits: {
    label: 'streamAlerts.kindBits',
    tip: 'streamAlerts.kindBitsTip',
    min: { key: 'minBits', label: 'streamAlerts.minBits' },
  },
  raid: {
    label: 'streamAlerts.kindRaid',
    tip: 'streamAlerts.kindRaidTip',
    min: { key: 'minRaid', label: 'streamAlerts.minRaid' },
  },
};

// Each language in its own words, since it names the alerts' language, not the page's.
const LANGUAGE_NAMES: Record<Locale, string> = { en: 'English', tr: 'Türkçe' };

const TEST_LABELS: Record<AlertKind, TranslationKey> = {
  sub: 'streamAlerts.testSub',
  gift: 'streamAlerts.testGift',
  bits: 'streamAlerts.testBits',
  raid: 'streamAlerts.testRaid',
};

/** A swatch shows the accent; Platform shows Twitch purple and Kick green side by side. */
const swatchBackground = (color: AlertColor) =>
  color === 'platform'
    ? `linear-gradient(135deg, hsl(${hueFor(color, 'twitch')} 85% 60%) 50%, hsl(${hueFor(color, 'kick')} 85% 50%) 50%)`
    : `hsl(${hueFor(color, 'twitch')} 85% 55%)`;

function StreamAlertsSetup() {
  const { t, locale } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  const [settings, setSettings] = useState(DEFAULT_STREAM_ALERTS_SETTINGS);
  // The alerts' own language: the page's until one is picked. The OBS URL always carries it.
  const [pickedLocale, setPickedLocale] = useState<Locale | null>(null);
  const alertLocale = pickedLocale ?? locale;
  const [mounted, setMounted] = useState(false);
  // Pairs this page with its own preview, not the ones in other tabs.
  const [previewId] = useState(() => Math.random().toString(36).slice(2, 10));
  const channelRef = useRef<BroadcastChannel | null>(null);
  const nextPlatform = useRef<SubathonPlatform>('twitch');
  const id = useId();

  useEffect(() => {
    setMounted(true);
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channelRef.current = channel;
    return () => channel.close();
  }, []);

  const update = <K extends keyof StreamAlertsSettings>(key: K, value: StreamAlertsSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  const updateKind = <K extends 'enabled' | 'headings'>(
    key: K,
    kind: AlertKind,
    value: StreamAlertsSettings[K][AlertKind],
  ) => setSettings((current) => ({ ...current, [key]: { ...current[key], [kind]: value } }));

  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted
    ? buildStreamAlertsUrl(origin, settings, twitchChannel, kickChannel, alertLocale)
    : '';
  const previewUrl = mounted
    ? buildStreamAlertsPreviewUrl(origin, settings, alertLocale, previewId)
    : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseStreamAlertsUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    if (parsed.locale) setPickedLocale(parsed.locale);
    return true;
  };

  // Placeholders show the heading the alert uses when the box is left empty, in its language.
  const defaultHeading = (kind: AlertKind) => {
    const sample = (platform: SubathonPlatform) =>
      translate(alertLocale, defaultHeadingKey(kind, platform));
    if (kind !== 'bits' || settings.platforms !== 'both') {
      return sample(settings.platforms === 'kick' ? 'kick' : 'twitch');
    }
    return `${sample('twitch')} / ${sample('kick')}`;
  };

  const kindFields = (kind: AlertKind) => {
    const { label, tip, min } = KIND_FIELDS[kind];
    const on = settings.enabled[kind];
    return (
      // Named after its alert, so its Heading box has a name of its own.
      <fieldset key={kind} aria-label={t(label)} className="space-y-2">
        <Switch
          label={t(label)}
          tip={t(tip)}
          checked={on}
          onChange={(value) => updateKind('enabled', kind, value)}
        />
        <div className="grid grid-cols-[1fr_7.5rem] gap-3">
          <div className={min ? undefined : 'col-span-2'}>
            <TextField
              label={t('streamAlerts.heading')}
              value={settings.headings[kind]}
              onChange={(value) => updateKind('headings', kind, value)}
              placeholder={defaultHeading(kind)}
              maxLength={HEADING_MAX_LENGTH}
              disabled={!on}
              spellCheck={false}
            />
          </div>
          {min && (
            <div>
              <FieldLabel htmlFor={`${id}-${min.key}`}>{t(min.label)}</FieldLabel>
              <CountField
                id={`${id}-${min.key}`}
                value={settings[min.key]}
                onChange={(value) => update(min.key, value)}
                min={min.key === 'minRaid' ? 0 : 1}
                max={MAX_MIN_AMOUNT}
                disabled={!on}
              />
            </div>
          )}
        </div>
      </fieldset>
    );
  };

  const settingsPanel = (
    <>
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

      <SettingsGroup title={t('common.sectionAppearance')}>
        <div>
          <FieldLabel id={`${id}-theme`} tip={t('streamAlerts.themeTip')}>
            {t('streamAlerts.theme')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-theme`}
            value={settings.theme}
            onChange={(value) => update('theme', value)}
            options={ALERT_THEMES.map((value) => ({
              value,
              label: t(`streamAlerts.themes.${value}`),
            }))}
          />
        </div>
        <div>
          <FieldLabel id={`${id}-color`} tip={t('streamAlerts.colorTip')}>
            {t('streamAlerts.color')}
          </FieldLabel>
          <ColorSwatches
            labelledBy={`${id}-color`}
            value={settings.color}
            onChange={(value) => update('color', value)}
            options={ALERT_COLORS.map((color) => ({
              value: color,
              label: t(`streamAlerts.colors.${color}`),
              background: swatchBackground(color),
            }))}
          />
        </div>
        <div>
          <FieldLabel id={`${id}-lang`} tip={t('streamAlerts.languageTip')}>
            {t('streamAlerts.language')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-lang`}
            value={alertLocale}
            onChange={setPickedLocale}
            options={LOCALES.map((value) => ({ value, label: LANGUAGE_NAMES[value] }))}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('streamAlerts.sectionAlerts')}>
        <div className="space-y-4">{ALERT_KINDS.map(kindFields)}</div>
      </SettingsGroup>

      <SettingsGroup title={t('streamAlerts.sectionTiming')}>
        <RangeField
          label={t('streamAlerts.duration')}
          tip={t('streamAlerts.durationTip')}
          min={MIN_DURATION}
          max={MAX_DURATION}
          value={settings.duration}
          onChange={(value) => update('duration', Number(value))}
          format={(value) => t('streamAlerts.seconds', { value })}
          readoutClassName="w-10"
        />
        <RangeField
          label={t('streamAlerts.volume')}
          tip={t('streamAlerts.volumeTip')}
          min={0}
          max={100}
          step={5}
          value={settings.volume}
          onChange={(value) => update('volume', Number(value))}
          format={(value) => (value === 0 ? t('streamAlerts.volumeOff') : `${value}%`)}
          readoutClassName="w-10"
        />
        <Switch
          label={t('streamAlerts.showMessage')}
          tip={t('streamAlerts.showMessageTip')}
          checked={settings.message}
          disabled={!settings.enabled.sub && !settings.enabled.bits}
          onChange={(value) => update('message', value)}
        />
      </SettingsGroup>
    </>
  );

  // With both platforms, each click takes turns so both platforms' words get shown.
  const testPlatform = (): SubathonPlatform => {
    if (settings.platforms !== 'both') return settings.platforms;
    const platform = nextPlatform.current;
    nextPlatform.current = platform === 'twitch' ? 'kick' : 'twitch';
    return platform;
  };
  const name = translate(alertLocale, 'streamAlerts.testViewer');
  // Test amounts never fall under the minimums, so every button's alert shows.
  const testGift = Math.max(5, settings.minGift);
  const testBits = Math.max(500, settings.minBits);
  const testAlerts: Record<AlertKind, (platform: SubathonPlatform) => StreamAlert> = {
    sub: (platform) => ({
      kind: 'sub',
      platform,
      name,
      tier: 1,
      months: 12,
      message: translate(alertLocale, 'streamAlerts.testMessage'),
    }),
    gift: (platform) => ({
      kind: 'gift',
      platform,
      name,
      tier: 1,
      count: testGift,
    }),
    bits: (platform) => ({
      kind: 'bits',
      platform,
      name,
      amount: testBits,
      message: translate(alertLocale, 'streamAlerts.testMessage'),
    }),
    raid: (platform) => ({
      kind: 'raid',
      platform,
      name,
      viewers: Math.max(42, settings.minRaid),
    }),
  };
  const send = (message: PreviewMessage) => channelRef.current?.postMessage(message);

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('streamAlerts.title')}
      settings={settingsPanel}
      previewTitle={t('streamAlerts.previewTitle')}
      previewTip={t('streamAlerts.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame
          src={previewUrl}
          title={t('streamAlerts.previewIframeTitle')}
          canvas={CANVAS}
          lang={alertLocale}
          allow="autoplay"
        />
      }
      previewFooter={
        <fieldset aria-labelledby={`${id}-test`} className="grid grid-cols-4 gap-1.5">
          <span
            id={`${id}-test`}
            className="col-span-4 text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            {t('streamAlerts.testTitle')}
          </span>
          {ALERT_KINDS.map((kind) => (
            <button
              key={kind}
              type="button"
              disabled={!settings.enabled[kind]}
              onClick={() =>
                send({ type: 'alert', preview: previewId, alert: testAlerts[kind](testPlatform()) })
              }
              className={BUTTON_TEST}
            >
              {t(TEST_LABELS[kind], { count: testGift, amount: testBits })}
            </button>
          ))}
        </fieldset>
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('streamAlerts.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('streamAlerts.browserSourceHintSize')}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('streamAlerts.widgetUrlPlaceholder')}
          invalidMessage={t('streamAlerts.widgetUrlInvalid')}
        />
      }
      intro={t('streamAlerts.intro')}
      guideTitle={t('streamAlerts.guideTitle')}
      guideSteps={[
        'streamAlerts.guideStep1',
        'streamAlerts.guideStep2',
        'streamAlerts.guideStep3',
        'streamAlerts.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
