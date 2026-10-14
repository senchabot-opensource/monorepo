import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useId, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { ChatCommandsCard } from '#/components/chat-commands-card';
import { CopyUrlField } from '#/components/copy-url-field';
import { CloseIcon } from '#/components/icons';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { TestButtons } from '#/components/test-buttons';
import { BUTTON_TEST } from '#/components/ui/button-styles';
import { ColorSwatches } from '#/components/ui/color-swatches';
import { CountField } from '#/components/ui/count-field';
import { DurationField } from '#/components/ui/duration-field';
import { FieldLabel } from '#/components/ui/field-label';
import { RangeField } from '#/components/ui/range-field';
import { SegmentedControl } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { HINT_CLASS, INPUT_CLASS, TextField } from '#/components/ui/text-field';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import { COMMAND } from '#/features/widgets/lower-third/lower-third-state';
import {
  PREVIEW_CHANNEL,
  type PreviewMessage,
} from '#/features/widgets/lower-third/use-lower-third';
import { hueFor } from '#/features/widgets/overlay-style';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import { useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import {
  buildLowerThirdPreviewUrl,
  buildLowerThirdUrl,
  CORNERS,
  DEFAULT_LOWER_THIRD_SETTINGS,
  LINE_MAX_LENGTH,
  LOWER_THIRD_COLORS,
  LOWER_THIRD_STAGE,
  type LowerThirdSettings,
  MAX_HOLD,
  MAX_LINES,
  MAX_PAUSE,
  MAX_ROTATE,
  MAX_SIZE,
  MIN_PAUSE,
  MIN_ROTATE,
  MIN_SIZE,
  parseLowerThirdUrl,
  TITLE_MAX_LENGTH,
} from '#/lib/lower-third-url';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/lower-thirds')({
  head: ({ params }) =>
    getSetupPageHead('lower-third', getParamsLocale(params), {
      breadcrumb: 'lowerThird.breadcrumb',
      faq: FAQ,
    }),
  component: LowerThirdSetup,
});

const WIDGET = getWidget('lower-third');

const FAQ: FaqEntry[] = [
  ['lowerThird.faq1Q', 'lowerThird.faq1A'],
  ['lowerThird.faq2Q', 'lowerThird.faq2A'],
  ['lowerThird.faq3Q', 'lowerThird.faq3A'],
  ['lowerThird.faq4Q', 'lowerThird.faq4A'],
];

const BUTTON_QUIET =
  'rounded-md p-1.5 text-zinc-500 transition-colors enabled:hover:bg-zinc-200 enabled:hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400 dark:enabled:hover:bg-zinc-800 dark:enabled:hover:text-white';

function LowerThirdSetup() {
  const { t } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  // Starts with words in the page's language, so the preview and the URL show something at once.
  const [settings, setSettings] = useState<LowerThirdSettings>(() => ({
    ...DEFAULT_LOWER_THIRD_SETTINGS,
    title: t('lowerThird.defaultTitle'),
    lines: [t('lowerThird.defaultLine')],
  }));
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const id = useId();

  const update = <K extends keyof LowerThirdSettings>(key: K, value: LowerThirdSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));
  const setLines = (change: (lines: string[]) => string[]) =>
    setSettings((current) => ({ ...current, lines: change(current.lines) }));

  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted ? buildLowerThirdUrl(origin, settings, twitchChannel, kickChannel) : '';
  const previewUrl = mounted ? buildLowerThirdPreviewUrl(origin, settings, previewId) : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseLowerThirdUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  const linesEditor = (
    <div>
      <FieldLabel id={`${id}-lines`} tip={t('lowerThird.linesTip')}>
        {t('lowerThird.lines')}
      </FieldLabel>
      <ol aria-labelledby={`${id}-lines`} className="space-y-2">
        {settings.lines.map((line, index) => {
          const n = index + 1;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: a line's place is its turn on screen.
            <li key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={line}
                onChange={(event) => {
                  const value = event.target.value;
                  setLines((lines) => lines.map((old, at) => (at === index ? value : old)));
                }}
                aria-label={t('lowerThird.lineLabel', { n })}
                maxLength={LINE_MAX_LENGTH}
                spellCheck={false}
                className={INPUT_CLASS}
              />
              <button
                type="button"
                onClick={() => setLines((lines) => lines.filter((_, at) => at !== index))}
                aria-label={t('lowerThird.removeLine', { n })}
                title={t('lowerThird.removeLine', { n })}
                className={BUTTON_QUIET}
              >
                <CloseIcon className="size-4" />
              </button>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        onClick={() => setLines((lines) => [...lines, ''])}
        disabled={settings.lines.length >= MAX_LINES}
        className={`${BUTTON_TEST} mt-2`}
      >
        {t('lowerThird.addLine')}
      </button>
    </div>
  );

  const seconds = (
    key: 'hold' | 'pause',
    label: string,
    tip: string,
    max: number,
    off?: string,
  ) => (
    <div>
      <FieldLabel id={`${id}-${key}`} tip={tip}>
        {label}
      </FieldLabel>
      <DurationField
        labelledBy={`${id}-${key}`}
        value={settings[key]}
        onChange={(value) => update(key, key === 'pause' ? Math.max(MIN_PAUSE, value) : value)}
        units={['m', 's']}
        unitLabels={[t('goal.unitMinutes'), t('goal.unitSeconds')]}
        max={max}
      />
      {off && settings[key] === 0 && <p className={HINT_CLASS}>{off}</p>}
    </div>
  );

  const textTab = (
    <SettingsGroup title={t('lowerThird.sectionText')} hideTitle>
      <TextField
        label={t('common.setup.titleLabel')}
        tip={t('lowerThird.titleTip')}
        value={settings.title}
        onChange={(value) => update('title', value)}
        placeholder={t('lowerThird.defaultTitle')}
        maxLength={TITLE_MAX_LENGTH}
        spellCheck={false}
      />
      {linesEditor}
      {settings.lines.length > 1 && (
        <div>
          <FieldLabel htmlFor={`${id}-rotate`} tip={t('lowerThird.rotateTip')}>
            {t('lowerThird.rotate')}
          </FieldLabel>
          <CountField
            id={`${id}-rotate`}
            value={settings.rotate}
            onChange={(value) => update('rotate', value)}
            min={MIN_ROTATE}
            max={MAX_ROTATE}
          />
        </div>
      )}
      {seconds(
        'hold',
        t('lowerThird.hold'),
        t('lowerThird.holdTip'),
        MAX_HOLD,
        t('lowerThird.holdOff'),
      )}
      {settings.hold > 0 &&
        seconds('pause', t('lowerThird.pause'), t('lowerThird.pauseTip'), MAX_PAUSE)}
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
            options={LOWER_THIRD_COLORS.map((color) => ({
              value: color,
              label: t(`subathon.colors.${color}`),
              background: `hsl(${hueFor(color, 1)} 85% 52%)`,
            }))}
          />
        </div>
      )}
      <div>
        <FieldLabel id={`${id}-corner`} tip={t('lowerThird.cornerTip')}>
          {t('lowerThird.corner')}
        </FieldLabel>
        <SegmentedControl
          labelledBy={`${id}-corner`}
          value={settings.corner}
          onChange={(value) => update('corner', value)}
          options={CORNERS.map((corner) => ({
            value: corner,
            label: t(`irlHud.corners.${corner}`),
          }))}
        />
      </div>
      <RangeField
        label={t('irlHud.size')}
        tip={t('lowerThird.sizeTip')}
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
      <p className={`${HINT_CLASS} mt-0`}>{t('lowerThird.channelHint')}</p>
    </SettingsGroup>
  );

  const command = (text: string) => () => send({ type: 'command', text });
  const testButtons = [
    { label: t('lowerThird.testSay'), onClick: command(`${COMMAND} ${t('lowerThird.testLine')}`) },
    { label: t('lowerThird.testClear'), onClick: command(`${COMMAND} clear`) },
    { label: t('lowerThird.testHide'), onClick: command(`${COMMAND} hide`) },
    { label: t('lowerThird.testShow'), onClick: command(`${COMMAND} show`) },
  ];

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('lowerThird.title')}
      settingsPinned={channelGroup}
      settingsTabs={[
        { id: 'text', label: t('lowerThird.sectionText'), content: textTab },
        { id: 'appearance', label: t('common.sectionAppearance'), content: appearanceTab },
      ]}
      previewTitle={t('lowerThird.previewTitle')}
      previewTip={t('lowerThird.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame
          src={previewUrl}
          title={t('lowerThird.previewIframeTitle')}
          canvas={LOWER_THIRD_STAGE}
        />
      }
      previewFooter={
        <TestButtons title={t('common.setup.testTitle')} layout="two-four" buttons={testButtons} />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('common.setup.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('common.setup.sizeHint', LOWER_THIRD_STAGE)}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('common.setup.widgetUrlPlaceholder')}
          invalidMessage={t('common.setup.widgetUrlInvalid', { name: t(WIDGET.nameKey) })}
        />
      }
      intro={t('lowerThird.intro')}
      aboutExtra={
        <ChatCommandsCard
          title={t('lowerThird.sectionCommands')}
          intro={t('lowerThird.commandsIntro')}
          commands={[
            { usage: `${COMMAND} ${t('lowerThird.testLine')}`, action: t('lowerThird.cmdSay') },
            { usage: `${COMMAND} clear`, action: t('lowerThird.cmdClear') },
            { usage: `${COMMAND} hide`, action: t('lowerThird.cmdHide') },
            { usage: `${COMMAND} show`, action: t('lowerThird.cmdShow') },
          ]}
        />
      }
      guideTitle={t('common.setup.guideTitle')}
      guideSteps={[
        'common.setup.guideAddSource',
        'common.setup.guidePaste',
        'lowerThird.guideStep3',
        'lowerThird.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
