import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useId, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { ChatCommandsCard } from '#/components/chat-commands-card';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { TestButtons } from '#/components/test-buttons';
import { ColorSwatches } from '#/components/ui/color-swatches';
import { FieldLabel } from '#/components/ui/field-label';
import { SegmentedControl } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS, TextField } from '#/components/ui/text-field';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import { COMMAND } from '#/features/widgets/credits/credits-state';
import { PREVIEW_CHANNEL, type PreviewMessage } from '#/features/widgets/credits/use-credits';
import { hueFor } from '#/features/widgets/overlay-style';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import {
  buildCreditsPreviewUrl,
  buildCreditsUrl,
  CREDIT_SECTIONS,
  CREDITS_COLORS,
  CREDITS_SPEEDS,
  CREDITS_STAGE,
  type CreditsSettings,
  DEFAULT_CREDITS_SETTINGS,
  parseCreditsUrl,
  TITLE_MAX_LENGTH,
} from '#/lib/credits-url';
import { useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/end-credits')({
  head: ({ params }) =>
    getSetupPageHead('credits', getParamsLocale(params), {
      breadcrumb: 'credits.breadcrumb',
      faq: FAQ,
    }),
  component: CreditsSetup,
});

const WIDGET = getWidget('credits');

const FAQ: FaqEntry[] = [
  ['credits.faq1Q', 'credits.faq1A'],
  ['credits.faq2Q', 'credits.faq2A'],
  ['credits.faq3Q', 'credits.faq3A'],
  ['credits.faq4Q', 'credits.faq4A'],
];

function CreditsSetup() {
  const { t, locale } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  // The title starts in the page's language; it's always written to the URL.
  const [settings, setSettings] = useState<CreditsSettings>(() => ({
    ...DEFAULT_CREDITS_SETTINGS,
    title: t('credits.defaultTitle'),
  }));
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const id = useId();

  const update = <K extends keyof CreditsSettings>(key: K, value: CreditsSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));

  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted
    ? buildCreditsUrl(origin, settings, twitchChannel, kickChannel, locale)
    : '';
  const previewUrl = mounted ? buildCreditsPreviewUrl(origin, settings, locale, previewId) : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseCreditsUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  const rollTab = (
    <SettingsGroup title={t('credits.sectionRoll')} hideTitle>
      <TextField
        label={t('common.setup.titleLabel')}
        tip={t('credits.titleTip')}
        value={settings.title}
        onChange={(value) => update('title', value)}
        placeholder={t('goal.titlePlaceholder')}
        maxLength={TITLE_MAX_LENGTH}
        spellCheck={false}
      />
      <TextField
        label={t('credits.outro')}
        tip={t('credits.outroTip')}
        value={settings.outro}
        onChange={(value) => update('outro', value)}
        placeholder={t('credits.outroPlaceholder')}
        maxLength={TITLE_MAX_LENGTH}
        spellCheck={false}
      />
      <div>
        <FieldLabel id={`${id}-sections`} tip={t('credits.sectionsTip')}>
          {t('credits.sectionsLabel')}
        </FieldLabel>
        <fieldset className="space-y-2" aria-labelledby={`${id}-sections`}>
          {CREDIT_SECTIONS.map((section) => (
            <Switch
              key={section}
              label={t(`credits.sections.${section}`)}
              checked={settings.sections[section]}
              onChange={(value) => update('sections', { ...settings.sections, [section]: value })}
            />
          ))}
        </fieldset>
      </div>
      <p className={`${HINT_CLASS} mt-0`}>{t('credits.collectHint')}</p>
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
            options={CREDITS_COLORS.map((color) => ({
              value: color,
              label: t(`subathon.colors.${color}`),
              background: `hsl(${hueFor(color, 1)} 85% 52%)`,
            }))}
          />
        </div>
      )}
      <div>
        <FieldLabel id={`${id}-speed`} tip={t('credits.speedTip')}>
          {t('credits.speed')}
        </FieldLabel>
        <SegmentedControl
          labelledBy={`${id}-speed`}
          value={settings.speed}
          onChange={(value) => update('speed', value)}
          options={CREDITS_SPEEDS.map((speed) => ({
            value: speed,
            label: t(`credits.speeds.${speed}`),
          }))}
        />
      </div>
      <Switch
        label={t('credits.loop')}
        tip={t('credits.loopTip')}
        checked={settings.loop}
        onChange={(value) => update('loop', value)}
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

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('credits.title')}
      settingsPinned={channelGroup}
      settingsTabs={[
        { id: 'roll', label: t('credits.sectionRoll'), content: rollTab },
        { id: 'appearance', label: t('common.sectionAppearance'), content: appearanceTab },
      ]}
      previewTitle={t('credits.previewTitle')}
      previewTip={t('credits.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame
          src={previewUrl}
          title={t('credits.previewIframeTitle')}
          canvas={CREDITS_STAGE}
        />
      }
      previewFooter={
        <TestButtons
          title={t('common.setup.testTitle')}
          layout="three"
          buttons={[{ label: t('credits.testRoll'), onClick: () => send({ type: 'roll' }) }]}
        />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('common.setup.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('common.setup.sizeHint', CREDITS_STAGE)}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('common.setup.widgetUrlPlaceholder')}
          invalidMessage={t('common.setup.widgetUrlInvalid', { name: t(WIDGET.nameKey) })}
        />
      }
      intro={t('credits.intro')}
      aboutExtra={
        <ChatCommandsCard
          title={t('credits.sectionCommands')}
          intro={t('credits.commandsIntro')}
          commands={[
            { usage: COMMAND, action: t('credits.cmdRoll') },
            { usage: `${COMMAND} stop`, action: t('credits.cmdStop') },
            { usage: `${COMMAND} reset`, action: t('credits.cmdReset') },
          ]}
        />
      }
      guideTitle={t('common.setup.guideTitle')}
      guideSteps={[
        'common.setup.guideAddSource',
        'common.setup.guidePaste',
        'credits.guideStep3',
        'credits.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
