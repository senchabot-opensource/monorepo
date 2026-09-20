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
import { MinutesField } from '#/components/ui/minutes-field';
import { SegmentedControl } from '#/components/ui/segmented-control';
import { Select } from '#/components/ui/select';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS, TextField } from '#/components/ui/text-field';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import {
  COMMAND,
  PREVIEW_CHANNEL,
  type PreviewMessage,
} from '#/features/widgets/countdown/use-countdown';
import { hueFor } from '#/features/widgets/overlay-style';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import {
  buildCountdownPreviewUrl,
  buildCountdownUrl,
  COUNTDOWN_COLORS,
  COUNTDOWN_ENDINGS,
  COUNTDOWN_LOOKS,
  COUNTDOWN_SCENES,
  type CountdownSettings,
  DEFAULT_COUNTDOWN_SETTINGS,
  MAX_COUNTDOWN_TIME,
  NOTE_MAX_LENGTH,
  parseCountdownUrl,
  readAtTime,
  TITLE_MAX_LENGTH,
} from '#/lib/countdown-url';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/stream-countdown')({
  head: ({ params }) =>
    getSetupPageHead('countdown', getParamsLocale(params), {
      breadcrumb: 'countdown.breadcrumb',
      faq: FAQ,
    }),
  component: CountdownSetup,
});

const WIDGET = getWidget('countdown');
// sourceSize is only null for tools; the fallback just satisfies the type.
const CANVAS = WIDGET.sourceSize ?? { width: 1920, height: 1080 };

const FAQ: FaqEntry[] = [
  ['countdown.faq1Q', 'countdown.faq1A'],
  ['countdown.faq2Q', 'countdown.faq2A'],
  ['countdown.faq3Q', 'countdown.faq3A'],
  ['countdown.faq4Q', 'countdown.faq4A'],
];

const COMMANDS: { usage: string; action: TranslationKey }[] = [
  { usage: `${COMMAND} add 5m`, action: 'countdown.cmdAdd' },
  { usage: `${COMMAND} remove 2m`, action: 'countdown.cmdRemove' },
  { usage: `${COMMAND} set 10m`, action: 'countdown.cmdSet' },
  { usage: `${COMMAND} pause`, action: 'countdown.cmdPause' },
  { usage: `${COMMAND} reset`, action: 'countdown.cmdReset' },
];

/** The default the clock field starts on, so picking "a time of day" shows a real time. */
const DEFAULT_AT = '21:00';

function CountdownSetup() {
  const { t, locale } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  const [settings, setSettings] = useState(DEFAULT_COUNTDOWN_SETTINGS);
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const id = useId();

  const update = <K extends keyof CountdownSettings>(key: K, value: CountdownSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));

  // The mode follows the clock time: with one set, the countdown ends at it instead of running
  // for a length. The field keeps what was typed, so a half-typed time isn't thrown away.
  const mode = settings.at ? 'clock' : 'duration';
  const atValid = readAtTime(settings.at) !== '';

  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted
    ? buildCountdownUrl(origin, settings, twitchChannel, kickChannel, locale)
    : '';
  const previewUrl = mounted ? buildCountdownPreviewUrl(origin, settings, previewId, locale) : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseCountdownUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  const settingsPanel = (
    <>
      <SettingsGroup title={t('countdown.sectionCountdown')}>
        <div>
          <FieldLabel id={`${id}-scene`} tip={t('countdown.sceneTip')}>
            {t('countdown.scene')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-scene`}
            value={settings.scene}
            onChange={(value) => update('scene', value)}
            options={COUNTDOWN_SCENES.map((scene) => ({
              value: scene,
              label: t(`countdown.scenes.${scene}.label`),
            }))}
          />
          <p className={HINT_CLASS}>{t(`countdown.scenes.${settings.scene}.hint`)}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel id={`${id}-mode`} tip={t('countdown.modeTip')}>
              {t('countdown.mode')}
            </FieldLabel>
            <SegmentedControl
              labelledBy={`${id}-mode`}
              value={mode}
              onChange={(value) => update('at', value === 'clock' ? DEFAULT_AT : '')}
              options={[
                { value: 'duration', label: t('countdown.modes.duration') },
                { value: 'clock', label: t('countdown.modes.clock') },
              ]}
            />
          </div>
          {mode === 'duration' ? (
            <div>
              <FieldLabel htmlFor={`${id}-time`} tip={t('countdown.durationTip')}>
                {t('countdown.duration')}
              </FieldLabel>
              <MinutesField
                id={`${id}-time`}
                value={settings.time}
                onChange={(seconds) => update('time', Math.max(60, seconds))}
                max={MAX_COUNTDOWN_TIME}
                unitLabel={t('countdown.durationUnit')}
              />
            </div>
          ) : (
            <TextField
              id={`${id}-at`}
              label={t('countdown.atLabel')}
              tip={t('countdown.atTip')}
              value={settings.at}
              onChange={(value) => update('at', value)}
              placeholder={t('countdown.atPlaceholder')}
              hint={atValid ? undefined : t('countdown.atInvalid')}
              maxLength={5}
              inputMode="numeric"
              autoComplete="off"
              spellCheck={false}
            />
          )}
        </div>

        <div>
          <FieldLabel id={`${id}-ending`} tip={t('countdown.endingTip')}>
            {t('countdown.ending')}
          </FieldLabel>
          <Select
            labelledBy={`${id}-ending`}
            value={settings.ending}
            onChange={(value) => update('ending', value)}
            options={COUNTDOWN_ENDINGS.map((ending) => ({
              value: ending,
              label: t(`countdown.endings.${ending}`),
            }))}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('common.sectionChannel')}>
        <ChannelFields
          platforms={settings.platforms}
          onPlatformsChange={(value) => update('platforms', value)}
          platformsTip={t('countdown.channelsTip')}
          twitch={twitchChannel}
          onTwitchChange={setTwitchChannel}
          kick={kickChannel}
          onKickChange={setKickChannel}
        />
        <p className={`${HINT_CLASS} mt-0`}>{t('countdown.channelsTip')}</p>
      </SettingsGroup>

      <SettingsGroup title={t('common.sectionAppearance')}>
        <PresetField value={settings.preset} onChange={(value) => update('preset', value)} />
        {isClassic(settings.preset) && (
          <div>
            <FieldLabel id={`${id}-color`}>{t('countdown.color')}</FieldLabel>
            <ColorSwatches
              labelledBy={`${id}-color`}
              value={settings.color}
              onChange={(value) => update('color', value)}
              options={COUNTDOWN_COLORS.map((color) => ({
                value: color,
                label: t(`subathon.colors.${color}`),
                background: `hsl(${hueFor(color, 1)} 85% 52%)`,
              }))}
            />
          </div>
        )}
        <div>
          <FieldLabel id={`${id}-look`} tip={t('countdown.lookTip')}>
            {t('countdown.look')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-look`}
            value={settings.look}
            onChange={(value) => update('look', value)}
            options={COUNTDOWN_LOOKS.map((look) => ({
              value: look,
              label: t(`countdown.looks.${look}`),
            }))}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Switch
            label={t('countdown.showBar')}
            tip={t('countdown.showBarTip')}
            checked={settings.bar}
            onChange={(value) => update('bar', value)}
          />
          <Switch
            label={t('countdown.motion')}
            tip={t('countdown.motionTip')}
            checked={settings.motion}
            onChange={(value) => update('motion', value)}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('countdown.sectionText')}>
        <TextField
          label={t('countdown.titleLabel')}
          tip={t('countdown.titleTip')}
          value={settings.title}
          onChange={(value) => update('title', value)}
          placeholder={t(`countdown.scenes.${settings.scene}.title`)}
          maxLength={TITLE_MAX_LENGTH}
        />
        <TextField
          label={t('countdown.doneLabel')}
          tip={t('countdown.doneTip')}
          value={settings.done}
          onChange={(value) => update('done', value)}
          placeholder={t(`countdown.scenes.${settings.scene}.done`)}
          maxLength={TITLE_MAX_LENGTH}
        />
        <TextField
          label={t('countdown.noteLabel')}
          tip={t('countdown.noteTip')}
          value={settings.note}
          onChange={(value) => update('note', value)}
          placeholder={t('countdown.notePlaceholder')}
          maxLength={NOTE_MAX_LENGTH}
        />
      </SettingsGroup>
    </>
  );

  const command = (text: string) => () => send({ type: 'command', text });
  const testButtons = [
    { label: t('countdown.testAdd'), onClick: command(`${COMMAND} add 1m`) },
    { label: t('countdown.testRemove'), onClick: command(`${COMMAND} remove 1m`) },
    { label: t('countdown.testPause'), onClick: () => send({ type: 'toggle' }) },
    { label: t('countdown.testFinish'), onClick: command(`${COMMAND} set 0`) },
  ];

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('countdown.title')}
      settings={settingsPanel}
      previewTitle={t('countdown.previewTitle')}
      previewTip={t('countdown.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame src={previewUrl} title={t('countdown.previewIframeTitle')} canvas={CANVAS} />
      }
      previewFooter={
        <TestButtons title={t('countdown.testTitle')} layout="two-four" buttons={testButtons} />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('countdown.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('countdown.browserSourceHintSize')}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('countdown.widgetUrlPlaceholder')}
          invalidMessage={t('countdown.widgetUrlInvalid')}
        />
      }
      intro={t('countdown.intro')}
      aboutExtra={
        <ChatCommandsCard
          title={t('countdown.sectionCommands')}
          intro={t('countdown.commandsIntro')}
          commands={COMMANDS.map((entry) => ({ usage: entry.usage, action: t(entry.action) }))}
        />
      }
      guideTitle={t('countdown.guideTitle')}
      guideSteps={[
        'countdown.guideStep1',
        'countdown.guideStep2',
        'countdown.guideStep3',
        'countdown.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
