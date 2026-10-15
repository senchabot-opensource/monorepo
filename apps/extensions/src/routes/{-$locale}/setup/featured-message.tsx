import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useId, useRef, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { ChatCommandsCard } from '#/components/chat-commands-card';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { type TestButton, TestButtons } from '#/components/test-buttons';
import { ColorSwatches } from '#/components/ui/color-swatches';
import { DurationField } from '#/components/ui/duration-field';
import { FieldLabel } from '#/components/ui/field-label';
import { RangeField } from '#/components/ui/range-field';
import { SegmentedControl } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS } from '#/components/ui/text-field';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import { FEATURE_COMMAND, QUESTION_COMMAND } from '#/features/widgets/featured/featured-state';
import { PREVIEW_CHANNEL, type PreviewMessage } from '#/features/widgets/featured/use-featured';
import { hueFor } from '#/features/widgets/overlay-style';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import {
  buildFeaturedPreviewUrl,
  buildFeaturedUrl,
  DEFAULT_FEATURED_SETTINGS,
  FEATURED_COLORS,
  FEATURED_MODES,
  FEATURED_STAGE,
  type FeaturedSettings,
  MAX_HIDE_SECONDS,
  MAX_SIZE,
  MIN_SIZE,
  parseFeaturedUrl,
} from '#/lib/featured-url';
import { useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/featured-message')({
  head: ({ params }) =>
    getSetupPageHead('featured', getParamsLocale(params), {
      breadcrumb: 'featured.breadcrumb',
      faq: FAQ,
    }),
  component: FeaturedSetup,
});

const WIDGET = getWidget('featured');

const FAQ: FaqEntry[] = [
  ['featured.faq1Q', 'featured.faq1A'],
  ['featured.faq2Q', 'featured.faq2A'],
  ['featured.faq3Q', 'featured.faq3A'],
  ['featured.faq4Q', 'featured.faq4A'],
];

function FeaturedSetup() {
  const { t, locale } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  const [settings, setSettings] = useState<FeaturedSettings>(DEFAULT_FEATURED_SETTINGS);
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const testAskers = useRef(0);
  const id = useId();

  const update = <K extends keyof FeaturedSettings>(key: K, value: FeaturedSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));

  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted
    ? buildFeaturedUrl(origin, settings, twitchChannel, kickChannel, locale)
    : '';
  const previewUrl = mounted ? buildFeaturedPreviewUrl(origin, settings, locale, previewId) : '';
  const features = settings.mode !== 'qa';
  const questions = settings.mode !== 'feature';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseFeaturedUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  const messagesTab = (
    <SettingsGroup title={t('featured.sectionMessages')} hideTitle>
      <div>
        <FieldLabel id={`${id}-mode`} tip={t('featured.modeTip')}>
          {t('featured.mode')}
        </FieldLabel>
        <SegmentedControl
          labelledBy={`${id}-mode`}
          value={settings.mode}
          onChange={(value) => update('mode', value)}
          options={FEATURED_MODES.map((mode) => ({
            value: mode,
            label: t(`featured.modes.${mode}`),
          }))}
        />
      </div>
      <div>
        <FieldLabel id={`${id}-hide`} tip={t('featured.hideTip')}>
          {t('featured.hide')}
        </FieldLabel>
        <DurationField
          labelledBy={`${id}-hide`}
          value={settings.hide}
          onChange={(value) => update('hide', value)}
          units={['m', 's']}
          unitLabels={[t('goal.unitMinutes'), t('goal.unitSeconds')]}
          max={MAX_HIDE_SECONDS}
        />
        {settings.hide === 0 && <p className={HINT_CLASS}>{t('featured.hideOff')}</p>}
      </div>
      {questions && (
        <Switch
          label={t('featured.waiting')}
          tip={t('featured.waitingTip')}
          checked={settings.waiting}
          onChange={(value) => update('waiting', value)}
        />
      )}
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
            options={FEATURED_COLORS.map((color) => ({
              value: color,
              label: t(`subathon.colors.${color}`),
              background: `hsl(${hueFor(color, 1)} 85% 52%)`,
            }))}
          />
        </div>
      )}
      <RangeField
        label={t('irlHud.size')}
        tip={t('featured.sizeTip')}
        min={MIN_SIZE}
        max={MAX_SIZE}
        step={10}
        value={settings.size}
        onChange={(value) => update('size', Number(value))}
        format={(size) => t('irlHud.sizeValue', { size })}
        readoutClassName="w-12"
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

  const viewer = t('goal.testViewer');
  const modSays = (text: string) => send({ type: 'chat', text, name: 'Mod', mod: true });
  const testButtons: TestButton[] = [
    ...(features
      ? [
          {
            label: t('featured.testFeature'),
            // A viewer says something, then a mod puts it up.
            onClick: () => {
              send({ type: 'chat', text: t('featured.testMessage'), name: viewer, mod: false });
              modSays(`${FEATURE_COMMAND} @${viewer}`);
            },
          },
        ]
      : []),
    ...(questions
      ? [
          {
            label: t('featured.testAsk'),
            onClick: () => {
              testAskers.current += 1;
              send({
                type: 'chat',
                text: `${QUESTION_COMMAND} ${t('featured.testQuestion')}`,
                name: `${viewer}${testAskers.current}`,
                mod: false,
              });
            },
          },
          { label: t('featured.testNext'), onClick: () => modSays(`${QUESTION_COMMAND} next`) },
        ]
      : []),
    {
      label: t('featured.testHide'),
      onClick: () => modSays(features ? `${FEATURE_COMMAND} off` : `${QUESTION_COMMAND} off`),
    },
  ];

  const name = `@${t('featured.cmdNameExample')}`;
  const commands = [
    ...(features
      ? [
          { usage: `${FEATURE_COMMAND} ${name}`, action: t('featured.cmdFeature') },
          { usage: FEATURE_COMMAND, action: t('featured.cmdFeatureOff') },
        ]
      : []),
    ...(questions
      ? [
          {
            usage: `${QUESTION_COMMAND} ${t('featured.cmdQuestionExample')}`,
            action: t('featured.cmdAsk'),
          },
          { usage: `${QUESTION_COMMAND} next`, action: t('featured.cmdNext') },
          { usage: `${QUESTION_COMMAND} skip`, action: t('featured.cmdSkip') },
          { usage: `${QUESTION_COMMAND} clear`, action: t('featured.cmdClear') },
          { usage: `${QUESTION_COMMAND} off`, action: t('featured.cmdOff') },
        ]
      : []),
  ];

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('featured.title')}
      settingsPinned={channelGroup}
      settingsTabs={[
        { id: 'messages', label: t('featured.sectionMessages'), content: messagesTab },
        { id: 'appearance', label: t('common.sectionAppearance'), content: appearanceTab },
      ]}
      previewTitle={t('featured.previewTitle')}
      previewTip={t('featured.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame
          src={previewUrl}
          title={t('featured.previewIframeTitle')}
          canvas={FEATURED_STAGE}
        />
      }
      previewFooter={
        <TestButtons
          title={t('common.setup.testTitle')}
          layout={testButtons.length === 3 ? 'three' : 'two-four'}
          buttons={testButtons}
        />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('common.setup.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('common.setup.sizeHint', FEATURED_STAGE)}`}
          sourceSize={FEATURED_STAGE}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('common.setup.widgetUrlPlaceholder')}
          invalidMessage={t('common.setup.widgetUrlInvalid', { name: t(WIDGET.nameKey) })}
        />
      }
      intro={t('featured.intro')}
      aboutExtra={
        <ChatCommandsCard
          title={t('featured.sectionCommands')}
          intro={t('featured.commandsIntro')}
          commands={commands}
        />
      }
      guideTitle={t('common.setup.guideTitle')}
      guideSteps={[
        'common.setup.guideAddSource',
        'common.setup.guidePaste',
        'featured.guideStep3',
        'featured.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
