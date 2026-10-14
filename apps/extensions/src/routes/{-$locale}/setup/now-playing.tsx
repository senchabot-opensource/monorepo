import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useId, useState } from 'react';
import { CopyUrlField } from '#/components/copy-url-field';
import { ExternalLink } from '#/components/external-link';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { TestButtons } from '#/components/test-buttons';
import { ColorSwatches } from '#/components/ui/color-swatches';
import { FieldLabel } from '#/components/ui/field-label';
import { RangeField } from '#/components/ui/range-field';
import { SegmentedControl } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS } from '#/components/ui/text-field';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import { hasLastfm } from '#/features/widgets/now-playing/lastfm';
import { SOURCE_NAMES } from '#/features/widgets/now-playing/now-playing-api';
import {
  PREVIEW_CHANNEL,
  type PreviewMessage,
} from '#/features/widgets/now-playing/use-now-playing';
import { UsernameField } from '#/features/widgets/now-playing/username-field';
import { hueFor } from '#/features/widgets/overlay-style';
import { TYPING_PAUSE_MS, useDebouncedValue } from '#/hooks/use-debounced-value';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import { useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import {
  buildNowPlayingPreviewUrl,
  buildNowPlayingUrl,
  cleanUsername,
  DEFAULT_NOW_PLAYING_SETTINGS,
  MAX_HIDE,
  NOW_PLAYING_COLORS,
  NOW_PLAYING_LAYOUTS,
  NOW_PLAYING_SOURCES,
  NOW_PLAYING_STAGE,
  type NowPlayingSettings,
  parseNowPlayingUrl,
} from '#/lib/now-playing-url';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/now-playing')({
  head: ({ params }) =>
    getSetupPageHead('now-playing', getParamsLocale(params), {
      breadcrumb: 'nowPlaying.breadcrumb',
      faq: FAQ,
    }),
  component: NowPlayingSetup,
});

const WIDGET = getWidget('now-playing');

const FAQ: FaqEntry[] = [
  ['nowPlaying.faq1Q', 'nowPlaying.faq1A'],
  ['nowPlaying.faq2Q', 'nowPlaying.faq2A'],
  ['nowPlaying.faq3Q', 'nowPlaying.faq3A'],
  ['nowPlaying.faq4Q', 'nowPlaying.faq4A'],
];

/** ListenBrainz's page for connecting Spotify; it asks to log in first. */
const LISTENBRAINZ_CONNECT_URL = 'https://listenbrainz.org/settings/music-services/details/';
/** Where Last.fm's "Hide recent listening" switch is. */
const LASTFM_PRIVACY_URL = 'https://www.last.fm/settings/privacy';
const MIN_HIDE = 5;
const HIDE_STEP = 5;

const LINK_CLASS = 'underline hover:text-zinc-700 dark:hover:text-zinc-300';

function NowPlayingSetup() {
  const { t, locale } = useI18n();
  const [settings, setSettings] = useState<NowPlayingSettings>(DEFAULT_NOW_PLAYING_SETTINGS);
  // The preview plays sample songs until Your Music asks for the real one.
  const [liveView, setLiveView] = useState(false);
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const id = useId();

  const update = <K extends keyof NowPlayingSettings>(key: K, value: NowPlayingSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));

  // A build without a Last.fm key reads ListenBrainz only, so the choice isn't offered.
  const lastfm = hasLastfm();
  const source = lastfm ? settings.source : 'listenbrainz';
  const chosen = { ...settings, source };
  const user = cleanUsername(settings.user);
  // The preview only needs the name when it shows the real song, and then not per keystroke.
  const typedUser = useDebouncedValue(user, TYPING_PAUSE_MS);
  const previewUser = liveView ? typedUser : '';

  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted ? buildNowPlayingUrl(origin, chosen, locale) : '';
  const previewUrl = mounted
    ? buildNowPlayingPreviewUrl(
        origin,
        { ...chosen, user: previewUser },
        locale,
        previewId,
        liveView,
      )
    : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseNowPlayingUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    return true;
  };

  const sourceGroup = (
    <SettingsGroup title={t('nowPlaying.sectionSource')}>
      {lastfm && (
        <div>
          <FieldLabel id={`${id}-source`} tip={t('nowPlaying.sourceTip')}>
            {t('nowPlaying.source')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-source`}
            value={source}
            onChange={(value) => update('source', value)}
            options={NOW_PLAYING_SOURCES.map((value) => ({
              value,
              label: SOURCE_NAMES[value],
            }))}
          />
        </div>
      )}
      <UsernameField
        source={source}
        value={settings.user}
        onChange={(value) => update('user', value)}
      />
      {source === 'listenbrainz' ? (
        <p className={`${HINT_CLASS} mt-0`}>
          {t('nowPlaying.listenbrainzHint')}{' '}
          <ExternalLink className={LINK_CLASS} href={LISTENBRAINZ_CONNECT_URL}>
            {t('nowPlaying.listenbrainzConnect')}
          </ExternalLink>
        </p>
      ) : (
        <p className={`${HINT_CLASS} mt-0`}>
          {t('nowPlaying.lastfmHint')}{' '}
          <ExternalLink className={LINK_CLASS} href={LASTFM_PRIVACY_URL}>
            {t('nowPlaying.lastfmPrivacy')}
          </ExternalLink>
        </p>
      )}
    </SettingsGroup>
  );

  const card = settings.layout === 'card';
  const hides = settings.hide > 0;
  const displayTab = (
    <SettingsGroup title={t('nowPlaying.sectionDisplay')} hideTitle>
      <div>
        <FieldLabel id={`${id}-layout`} tip={t('nowPlaying.layoutTip')}>
          {t('nowPlaying.layout')}
        </FieldLabel>
        <SegmentedControl
          labelledBy={`${id}-layout`}
          value={settings.layout}
          onChange={(value) => update('layout', value)}
          options={NOW_PLAYING_LAYOUTS.map((layout) => ({
            value: layout,
            label: t(`nowPlaying.layouts.${layout}`),
          }))}
        />
      </div>
      <Switch
        label={t('nowPlaying.art')}
        tip={t('nowPlaying.artTip')}
        checked={settings.art}
        onChange={(value) => update('art', value)}
      />
      {/* The pill is one line, with no room for the album. */}
      {card && (
        <Switch
          label={t('nowPlaying.album')}
          tip={t('nowPlaying.albumTip')}
          checked={settings.album}
          onChange={(value) => update('album', value)}
        />
      )}
      <Switch
        label={t('nowPlaying.hideStopped')}
        tip={t('nowPlaying.hideStoppedTip')}
        checked={hides}
        onChange={(value) => update('hide', value ? DEFAULT_NOW_PLAYING_SETTINGS.hide : 0)}
      />
      {hides && (
        <RangeField
          label={t('nowPlaying.hideAfter')}
          tip={t('nowPlaying.hideAfterTip')}
          min={MIN_HIDE}
          max={MAX_HIDE}
          step={HIDE_STEP}
          value={settings.hide}
          onChange={(value) => update('hide', Number(value))}
          format={(value) => t('streamAlerts.seconds', { value })}
          readoutClassName="w-12"
        />
      )}
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
            options={NOW_PLAYING_COLORS.map((color) => ({
              value: color,
              label: t(`subathon.colors.${color}`),
              background: `hsl(${hueFor(color, 1)} 85% 52%)`,
            }))}
          />
        </div>
      )}
    </SettingsGroup>
  );

  const testButtons = [
    {
      label: t('nowPlaying.testNext'),
      onClick: () => {
        // From the real song, the preview reloads on sample songs, which is the next one.
        setLiveView(false);
        send({ type: 'next' });
      },
    },
    { label: t('nowPlaying.testStop'), onClick: () => send({ type: 'stop' }) },
    {
      label: t('nowPlaying.testLive'),
      disabled: !user,
      onClick: () => {
        setLiveView(true);
        send({ type: 'live' });
      },
    },
  ];

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('nowPlaying.title')}
      settingsPinned={sourceGroup}
      settingsTabs={[
        { id: 'display', label: t('nowPlaying.sectionDisplay'), content: displayTab },
        { id: 'appearance', label: t('common.sectionAppearance'), content: appearanceTab },
      ]}
      previewTitle={t('nowPlaying.previewTitle')}
      previewTip={t('nowPlaying.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame
          src={previewUrl}
          title={t('nowPlaying.previewIframeTitle')}
          canvas={NOW_PLAYING_STAGE}
        />
      }
      previewFooter={
        <TestButtons title={t('common.setup.testTitle')} layout="three" buttons={testButtons} />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('common.setup.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('common.setup.sizeHint', NOW_PLAYING_STAGE)}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('common.setup.widgetUrlPlaceholder')}
          invalidMessage={t('common.setup.widgetUrlInvalid', { name: t(WIDGET.nameKey) })}
        />
      }
      intro={t('nowPlaying.intro')}
      guideTitle={t('common.setup.guideTitle')}
      guideSteps={[
        'common.setup.guideAddSource',
        'common.setup.guidePaste',
        'nowPlaying.guideStep3',
        'nowPlaying.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
