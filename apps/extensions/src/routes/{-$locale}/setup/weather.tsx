import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useId, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { ChatCommandsCard } from '#/components/chat-commands-card';
import { CopyUrlField } from '#/components/copy-url-field';
import { ExternalLink } from '#/components/external-link';
import { CORNER_FOCUS, PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { TestButtons } from '#/components/test-buttons';
import { FieldLabel } from '#/components/ui/field-label';
import { RangeField } from '#/components/ui/range-field';
import { SegmentedControl } from '#/components/ui/segmented-control';
import { Select } from '#/components/ui/select';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS, TextField } from '#/components/ui/text-field';
import { TimeZoneSelect } from '#/components/ui/time-zone-select';
import { COMMAND, SHORT_COMMAND } from '#/features/widgets/irl-hud/hud-money';
import { DEMO_SKIES, type DemoSky } from '#/features/widgets/weather/demo-forecast';
import { PlaceSearchField } from '#/features/widgets/weather/place-search-field';
import { PREVIEW_CHANNEL, type PreviewMessage } from '#/features/widgets/weather/use-weather';
import { WEATHER_PART } from '#/features/widgets/weather/use-weather-toggle';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import { LOCALE_NAMES, LOCALES, type Locale, type TranslationKey, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import {
  buildWeatherPreviewUrl,
  buildWeatherUrl,
  MAX_SIZE,
  MIN_SIZE,
  PLACE_MAX_LENGTH,
  parseWeatherUrl,
  WEATHER_CORNERS,
  WEATHER_FORECASTS,
  WEATHER_LAYOUTS,
  WEATHER_SETUP_SETTINGS,
  WEATHER_STYLES,
  WEATHER_THEMES,
  WEATHER_UNITS,
  type WeatherChannels,
  type WeatherSettings,
  weatherHudStyle,
} from '#/lib/weather-url';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/weather')({
  head: ({ params }) =>
    getSetupPageHead('weather', getParamsLocale(params), {
      breadcrumb: 'weather.breadcrumb',
      faq: FAQ,
    }),
  component: WeatherSetup,
});

const WIDGET = getWidget('weather');
// sourceSize is only null for tools; the fallback just satisfies the type.
const CANVAS = WIDGET.sourceSize ?? { width: 1920, height: 1080 };
const SIZE_STEP = 5;

const FAQ: FaqEntry[] = [
  ['weather.faq1Q', 'weather.faq1A'],
  ['weather.faq2Q', 'weather.faq2A'],
  ['weather.faq3Q', 'weather.faq3A'],
  ['weather.faq4Q', 'weather.faq4A'],
  ['weather.faq5Q', 'weather.faq5A'],
];

const TEST_LABELS: Record<DemoSky, TranslationKey> = {
  sun: 'weather.testSun',
  clouds: 'weather.testClouds',
  rain: 'weather.testRain',
  storm: 'weather.testStorm',
  snow: 'weather.testSnow',
  night: 'weather.testNight',
};

/** MET Norway's terms for its data: CC BY 4.0, credited on the overlay and here. */
const MET_TERMS_URL = 'https://api.met.no/doc/License';

function WeatherSetup() {
  const { t, locale } = useI18n();
  const [settings, setSettings] = useState(WEATHER_SETUP_SETTINGS);
  // Optional: a channel only lets you and your mods hide and show the weather from chat.
  const [channels, setChannels] = useState<WeatherChannels>({
    platforms: 'both',
    twitch: '',
    kick: '',
  });
  // The overlay's own language: the page's until one is picked. The OBS URL always carries it.
  const [pickedLocale, setPickedLocale] = useState<Locale | null>(null);
  const overlayLocale = pickedLocale ?? locale;
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const id = useId();

  const update = <K extends keyof WeatherSettings>(key: K, value: WeatherSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted ? buildWeatherUrl(origin, settings, overlayLocale, channels) : '';
  const previewUrl = mounted
    ? buildWeatherPreviewUrl(origin, settings, overlayLocale, previewId)
    : '';
  const hasPlace = settings.lat !== null && settings.lon !== null;

  const applyWidgetUrl = (text: string) => {
    const parsed = parseWeatherUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setChannels(parsed.channels);
    if (parsed.locale) setPickedLocale(parsed.locale);
    return true;
  };

  const card = settings.layout === 'card';
  // The HUD styles draw outlined text right on the scene, with no background to pick.
  const hud = weatherHudStyle(settings) !== null;

  const settingsPanel = (
    <>
      <SettingsGroup title={t('weather.sectionPlace')}>
        <PlaceSearchField
          lat={settings.lat}
          lon={settings.lon}
          onPick={({ lat, lon, name }) =>
            setSettings((current) => ({ ...current, lat, lon, place: name ?? current.place }))
          }
        />
        <TextField
          label={t('weather.placeName')}
          tip={t('weather.placeNameTip')}
          value={settings.place}
          onChange={(value) => update('place', value)}
          placeholder={t('weather.placeNamePlaceholder')}
          maxLength={PLACE_MAX_LENGTH}
          spellCheck={false}
        />
        <div>
          <p className={`${HINT_CLASS} mt-0`}>{t('weather.placePrivacy')}</p>
          <p className={HINT_CLASS}>
            <ExternalLink
              className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
              href="https://www.openstreetmap.org/copyright"
            >
              {t('irlHud.placeCredit')}
            </ExternalLink>
          </p>
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('common.sectionAppearance')}>
        <div>
          <FieldLabel id={`${id}-layout`} tip={t('weather.layoutTip')}>
            {t('weather.layout')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-layout`}
            value={settings.layout}
            onChange={(value) => update('layout', value)}
            options={WEATHER_LAYOUTS.map((layout) => ({
              value: layout,
              label: t(`weather.layouts.${layout}`),
            }))}
          />
        </div>
        {/* The card always looks like a weather app; the pill can take the IRL HUD's styles. */}
        {!card && (
          <div>
            <FieldLabel id={`${id}-style`} tip={t('weather.styleTip')}>
              {t('weather.style')}
            </FieldLabel>
            {/* The weather app and four HUD styles don't fit side by side on a phone. */}
            <Select
              labelledBy={`${id}-style`}
              value={settings.style}
              onChange={(value) => update('style', value)}
              options={WEATHER_STYLES.map((style) => ({
                value: style,
                label: t(`weather.styles.${style}`),
              }))}
            />
          </div>
        )}
        {!hud && (
          <div>
            <FieldLabel id={`${id}-theme`} tip={t('weather.themeTip')}>
              {t('weather.theme')}
            </FieldLabel>
            <SegmentedControl
              labelledBy={`${id}-theme`}
              value={settings.theme}
              onChange={(value) => update('theme', value)}
              options={WEATHER_THEMES.map((theme) => ({
                value: theme,
                label: t(`weather.themes.${theme}`),
              }))}
            />
          </div>
        )}
        <div>
          <FieldLabel id={`${id}-corner`} tip={t('weather.cornerTip')}>
            {t('weather.corner')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-corner`}
            value={settings.corner}
            onChange={(value) => update('corner', value)}
            options={WEATHER_CORNERS.map((corner) => ({
              value: corner,
              label: t(`irlHud.corners.${corner}`),
            }))}
          />
        </div>
        <RangeField
          label={t('weather.size')}
          tip={t('weather.sizeTip')}
          min={MIN_SIZE}
          max={MAX_SIZE}
          step={SIZE_STEP}
          value={settings.size}
          onChange={(value) => update('size', Number(value))}
          format={(size) => t('irlHud.sizeValue', { size })}
          readoutClassName="w-12"
        />
        <div>
          <FieldLabel id={`${id}-lang`} tip={t('weather.languageTip')}>
            {t('weather.language')}
          </FieldLabel>
          <Select
            labelledBy={`${id}-lang`}
            value={overlayLocale}
            onChange={setPickedLocale}
            options={LOCALES.map((value) => ({ value, label: LOCALE_NAMES[value] }))}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('weather.sectionForecast')}>
        <div>
          <FieldLabel id={`${id}-units`} tip={t('weather.unitsTip')}>
            {t('weather.units')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-units`}
            value={settings.units}
            onChange={(value) => update('units', value)}
            options={WEATHER_UNITS.map((units) => ({
              value: units,
              label: t(`weather.unitOptions.${units}`),
            }))}
          />
        </div>
        {card && (
          <Switch
            label={t('weather.details')}
            tip={t('weather.detailsTip')}
            checked={settings.details}
            onChange={(value) => update('details', value)}
          />
        )}
        {card && (
          <div>
            <FieldLabel id={`${id}-forecast`} tip={t('weather.forecastTip')}>
              {t('weather.forecast')}
            </FieldLabel>
            <SegmentedControl
              labelledBy={`${id}-forecast`}
              value={settings.forecast}
              onChange={(value) => update('forecast', value)}
              options={WEATHER_FORECASTS.map((forecast) => ({
                value: forecast,
                label: t(`weather.forecasts.${forecast}`),
              }))}
            />
          </div>
        )}
        {card && settings.forecast === 'hours' && (
          <Switch
            label={t('weather.clock12')}
            tip={t('weather.clock12Tip')}
            checked={settings.h12}
            onChange={(value) => update('h12', value)}
          />
        )}
        {card && settings.forecast !== 'off' && (
          <div>
            <FieldLabel id={`${id}-tz`} tip={t('weather.timeZoneTip')}>
              {t('weather.timeZone')}
            </FieldLabel>
            <TimeZoneSelect
              labelledBy={`${id}-tz`}
              value={settings.tz}
              onChange={(value) => update('tz', value)}
              localLabel={t('irlHud.timeZoneLocal')}
            />
          </div>
        )}
        <p className={`${HINT_CLASS} mt-0`}>
          {t('weather.dataCredit')}{' '}
          <ExternalLink
            className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
            href={MET_TERMS_URL}
          >
            {t('weather.dataLicense')}
          </ExternalLink>
        </p>
      </SettingsGroup>
    </>
  );

  const testButtons = [
    ...DEMO_SKIES.map((sky) => ({
      label: t(TEST_LABELS[sky]),
      onClick: () => send({ type: 'sky', sky }),
    })),
    // With a place picked the preview shows its real weather; this brings it back.
    ...(hasPlace
      ? [{ label: t('weather.testLive'), onClick: () => send({ type: 'sky', sky: null }) }]
      : []),
    // What a mod's !h weather does.
    { label: t('weather.testToggle'), onClick: () => send({ type: 'toggle' }) },
  ];

  const channelGroup = (
    <SettingsGroup title={t('weather.sectionChat')}>
      <ChannelFields
        platforms={channels.platforms}
        onPlatformsChange={(platforms) => setChannels((current) => ({ ...current, platforms }))}
        twitch={channels.twitch}
        onTwitchChange={(twitch) => setChannels((current) => ({ ...current, twitch }))}
        kick={channels.kick}
        onKickChange={(kick) => setChannels((current) => ({ ...current, kick }))}
      />
      <p className={`${HINT_CLASS} mt-0`}>{t('weather.channelHint')}</p>
    </SettingsGroup>
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('weather.title')}
      settings={
        <>
          {settingsPanel}
          {channelGroup}
        </>
      }
      previewTitle={t('weather.previewTitle')}
      previewTip={t('weather.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame
          src={previewUrl}
          title={t('weather.previewIframeTitle')}
          canvas={CANVAS}
          lang={overlayLocale}
          // The overlay is small in a corner of a 1080p scene; at 1× it is hard to read.
          zoomFocus={CORNER_FOCUS[settings.corner]}
          zoomStart={3}
        />
      }
      previewFooter={
        <TestButtons title={t('weather.testTitle')} layout="two-four" buttons={testButtons} />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('weather.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('weather.browserSourceHintSize')}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('weather.widgetUrlPlaceholder')}
          invalidMessage={t('weather.widgetUrlInvalid')}
        />
      }
      intro={t('weather.intro')}
      aboutExtra={
        <ChatCommandsCard
          title={t('weather.sectionCommands')}
          intro={t('weather.commandsIntro')}
          commands={[
            { usage: `${SHORT_COMMAND} ${WEATHER_PART}`, action: t('weather.cmdToggle') },
            { usage: `${COMMAND} ${WEATHER_PART}`, action: t('weather.cmdToggleLong') },
          ]}
        />
      }
      guideTitle={t('weather.guideTitle')}
      guideSteps={[
        'weather.guideStep1',
        'weather.guideStep2',
        'weather.guideStep3',
        'weather.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
