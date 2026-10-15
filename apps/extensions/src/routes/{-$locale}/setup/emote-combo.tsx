import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useId, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { ChatCommandsCard } from '#/components/chat-commands-card';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { TestButtons } from '#/components/test-buttons';
import { ColorSwatches } from '#/components/ui/color-swatches';
import { CountField } from '#/components/ui/count-field';
import { FieldLabel } from '#/components/ui/field-label';
import { MultiSelect, type MultiSelectOption } from '#/components/ui/multi-select';
import { RangeField } from '#/components/ui/range-field';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import { COMBO_COMMAND, RESET_WORD } from '#/features/widgets/emote-combo/emote-combo-state';
import {
  PREVIEW_CHANNEL,
  type PreviewMessage,
} from '#/features/widgets/emote-combo/use-emote-combo';
import { hueFor } from '#/features/widgets/overlay-style';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import {
  buildEmoteComboPreviewUrl,
  buildEmoteComboUrl,
  DEFAULT_EMOTE_COMBO_SETTINGS,
  EMOTE_COMBO_COLORS,
  EMOTE_COMBO_STAGE,
  type EmoteComboSettings,
  MAX_CHATTERS,
  MAX_SIZE,
  MAX_WINDOW,
  MIN_CHATTERS,
  MIN_SIZE,
  MIN_WINDOW,
  parseEmoteComboUrl,
} from '#/lib/emote-combo-url';
import { useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/emote-combo')({
  head: ({ params }) =>
    getSetupPageHead('emote-combo', getParamsLocale(params), {
      breadcrumb: 'emoteCombo.breadcrumb',
      faq: FAQ,
    }),
  component: EmoteComboSetup,
});

const WIDGET = getWidget('emote-combo');

const FAQ: FaqEntry[] = [
  ['emoteCombo.faq1Q', 'emoteCombo.faq1A'],
  ['emoteCombo.faq2Q', 'emoteCombo.faq2A'],
  ['emoteCombo.faq3Q', 'emoteCombo.faq3A'],
  ['emoteCombo.faq4Q', 'emoteCombo.faq4A'],
];

type EmoteProvider = 'sevenTv' | 'bttv' | 'ffz';

const PROVIDER_OPTIONS: MultiSelectOption<EmoteProvider>[] = [
  { value: 'sevenTv', label: '7TV', hint: 'Twitch, Kick' },
  { value: 'bttv', label: 'BTTV', hint: 'Twitch' },
  { value: 'ffz', label: 'FFZ', hint: 'Twitch' },
];

function EmoteComboSetup() {
  const { t, locale } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  const [settings, setSettings] = useState<EmoteComboSettings>(DEFAULT_EMOTE_COMBO_SETTINGS);
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const id = useId();

  const update = <K extends keyof EmoteComboSettings>(key: K, value: EmoteComboSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));

  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted
    ? buildEmoteComboUrl(origin, settings, twitchChannel, kickChannel, locale)
    : '';
  const previewUrl = mounted ? buildEmoteComboPreviewUrl(origin, settings, locale, previewId) : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseEmoteComboUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  const providers = PROVIDER_OPTIONS.map((option) => option.value).filter(
    (provider) => settings[provider],
  );
  const providersSummary =
    providers.length > 0
      ? PROVIDER_OPTIONS.filter((option) => providers.includes(option.value))
          .map((option) => option.label)
          .join(', ')
      : t('emoteCombo.emotesNone');

  const channelGroup = (
    <SettingsGroup title={t('common.sectionChannel')}>
      <ChannelFields
        platforms={settings.platforms}
        onPlatformsChange={(value) => update('platforms', value)}
        twitch={twitchChannel}
        onTwitchChange={setTwitchChannel}
        kick={kickChannel}
        onKickChange={setKickChannel}
        aside={
          <div className="flex items-end sm:pb-1">
            <div className="w-full">
              <FieldLabel id={`${id}-emotes`} tip={t('emoteCombo.emotesTip')}>
                {t('emoteCombo.emotes')}
              </FieldLabel>
              <MultiSelect
                labelledBy={`${id}-emotes`}
                value={providers}
                onChange={(value) =>
                  setSettings((current) => ({
                    ...current,
                    sevenTv: value.includes('sevenTv'),
                    bttv: value.includes('bttv'),
                    ffz: value.includes('ffz'),
                  }))
                }
                options={PROVIDER_OPTIONS}
                summary={providersSummary}
              />
            </div>
          </div>
        }
      />
    </SettingsGroup>
  );

  const comboTab = (
    <SettingsGroup title={t('emoteCombo.sectionCombo')} hideTitle>
      <RangeField
        label={t('emoteCombo.window')}
        tip={t('emoteCombo.windowTip')}
        min={MIN_WINDOW}
        max={MAX_WINDOW}
        value={settings.window}
        onChange={(value) => update('window', Number(value))}
        format={(value) => t('emoteCombo.seconds', { n: value })}
        readoutClassName="w-12"
      />
      <div>
        <FieldLabel htmlFor={`${id}-min`} tip={t('emoteCombo.minTip')}>
          {t('emoteCombo.min')}
        </FieldLabel>
        <CountField
          id={`${id}-min`}
          value={settings.min}
          onChange={(value) => update('min', value)}
          min={MIN_CHATTERS}
          max={MAX_CHATTERS}
        />
      </div>
      <Switch
        label={t('emoteCombo.best')}
        tip={t('emoteCombo.bestTip')}
        checked={settings.best}
        onChange={(value) => update('best', value)}
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
            options={EMOTE_COMBO_COLORS.map((color) => ({
              value: color,
              label: t(`subathon.colors.${color}`),
              background: `hsl(${hueFor(color, 1)} 85% 52%)`,
            }))}
          />
        </div>
      )}
      <RangeField
        label={t('emoteCombo.size')}
        tip={t('emoteCombo.sizeTip')}
        min={MIN_SIZE}
        max={MAX_SIZE}
        step={10}
        value={settings.size}
        onChange={(value) => update('size', Number(value))}
        format={(value) => `${value}%`}
        readoutClassName="w-12"
      />
    </SettingsGroup>
  );

  const resetCommand = `${COMBO_COMMAND} ${RESET_WORD}`;
  const testButtons = [
    { label: t('emoteCombo.testStart'), onClick: () => send({ type: 'start' }) },
    { label: t('emoteCombo.testChatter'), onClick: () => send({ type: 'chatter' }) },
    { label: t('emoteCombo.testReset'), onClick: () => send({ type: 'reset' }) },
  ];

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('emoteCombo.title')}
      settingsPinned={channelGroup}
      settingsTabs={[
        { id: 'combo', label: t('emoteCombo.sectionCombo'), content: comboTab },
        { id: 'appearance', label: t('common.sectionAppearance'), content: appearanceTab },
      ]}
      previewTitle={t('emoteCombo.previewTitle')}
      previewTip={t('emoteCombo.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame
          src={previewUrl}
          title={t('emoteCombo.previewIframeTitle')}
          canvas={EMOTE_COMBO_STAGE}
        />
      }
      previewFooter={
        <TestButtons title={t('common.setup.testTitle')} layout="three" buttons={testButtons} />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('common.setup.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('common.setup.sizeHint', EMOTE_COMBO_STAGE)}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('common.setup.widgetUrlPlaceholder')}
          invalidMessage={t('common.setup.widgetUrlInvalid', { name: t(WIDGET.nameKey) })}
        />
      }
      intro={t('emoteCombo.intro')}
      aboutExtra={
        <ChatCommandsCard
          title={t('emoteCombo.sectionCommands')}
          intro={t('emoteCombo.commandsIntro')}
          commands={[{ usage: resetCommand, action: t('emoteCombo.cmdReset') }]}
        />
      }
      guideTitle={t('common.setup.guideTitle')}
      guideSteps={[
        'common.setup.guideAddSource',
        'common.setup.guidePaste',
        'emoteCombo.guideStep3',
        'emoteCombo.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
