import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useId, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { ChatCommandsCard } from '#/components/chat-commands-card';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { TestButtons } from '#/components/test-buttons';
import { FieldLabel } from '#/components/ui/field-label';
import { NumberField } from '#/components/ui/number-field';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS, INPUT_CLASS } from '#/components/ui/text-field';
import { assignColors, shuffleLines } from '#/features/widgets/spin-wheel/spin-logic';
import {
  PREVIEW_CHANNEL,
  type PreviewMessage,
} from '#/features/widgets/spin-wheel/spin-wheel-overlay';
import { SpinWheelAdvancedPromo } from '#/features/widgets/spin-wheel/spin-wheel-promo';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import {
  buildSpinWheelPreviewUrl,
  buildSpinWheelUrl,
  cleanSpinOptions,
  DEFAULT_SPIN_WHEEL_SETTINGS,
  MAX_COOLDOWN_SECONDS,
  parseSpinWheelUrl,
  SPIN_COMMAND,
  type SpinPermission,
} from '#/lib/spin-wheel-url';
import type { ChannelPlatforms } from '#/lib/url-params';
import { getWidget } from '#/lib/widgets';

const WIDGET = getWidget('spin-wheel');
// sourceSize is only null for tools without a browser source; the fallback satisfies the type.
const CANVAS = WIDGET.sourceSize ?? { width: 800, height: 800 };

const FAQ: FaqEntry[] = [
  ['spinWheel.faq1Q', 'spinWheel.faq1A'],
  ['spinWheel.faq2Q', 'spinWheel.faq2A'],
  ['spinWheel.faq3Q', 'spinWheel.faq3A'],
  ['spinWheel.faq4Q', 'spinWheel.faq4A'],
];

const COMMANDS: { usage: string; action: TranslationKey }[] = [
  { usage: SPIN_COMMAND, action: 'spinWheel.cmdSpin' },
];

const SAMPLE_TEXT = ['Zelda', 'Mario Kart', 'Tetris', 'Minecraft'].join('\n');

const BUTTON_QUIET =
  'rounded px-1.5 py-0.5 text-xs font-medium text-zinc-500 transition-colors enabled:hover:bg-zinc-100 enabled:hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:enabled:hover:bg-zinc-800 dark:enabled:hover:text-white';

/** Whole-number setting whose field may sit empty while typing; blur shows the saved value again. */
function IntegerField({
  id,
  value,
  onChange,
  min,
  max,
}: {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <NumberField
      id={id}
      value={draft ?? String(value)}
      onChange={(text) => {
        const next = Math.min(max, Math.max(min, Number.parseInt(text, 10) || min));
        setDraft(text === String(next) ? null : text);
        onChange(next);
      }}
      onBlur={() => setDraft(null)}
      min={min}
      max={max}
      fallback={value}
    />
  );
}

function SpinWheelSetup() {
  const { t, locale } = useI18n();
  const id = useId();
  const [platforms, setPlatforms] = useState<ChannelPlatforms>(
    DEFAULT_SPIN_WHEEL_SETTINGS.platforms,
  );
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  const [text, setText] = useState(SAMPLE_TEXT);
  const [cooldownSec, setCooldownSec] = useState(DEFAULT_SPIN_WHEEL_SETTINGS.cooldownSec);
  const [permission, setPermission] = useState<SpinPermission>(
    DEFAULT_SPIN_WHEEL_SETTINGS.permission,
  );
  const [soundEnabled, setSoundEnabled] = useState(DEFAULT_SPIN_WHEEL_SETTINGS.sound);
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);

  const settings = {
    platforms,
    cooldownSec,
    permission,
    sound: soundEnabled,
    options: text.split('\n'),
  };
  // Slices on the wheel: a `2x Tetris` line counts twice.
  const optionCount = assignColors(cleanSpinOptions(settings.options)).length;

  // Gated on mount so the prerendered inputs and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted
    ? buildSpinWheelUrl(origin, settings, twitchChannel, kickChannel, locale)
    : '';
  const previewUrl = mounted ? buildSpinWheelPreviewUrl(origin, settings, locale, previewId) : '';

  const applyWidgetUrl = (pasted: string) => {
    const parsed = parseSpinWheelUrl(pasted);
    if (!parsed) return false;
    setPlatforms(parsed.settings.platforms);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    setText(parsed.settings.options.join('\n'));
    setCooldownSec(parsed.settings.cooldownSec);
    setPermission(parsed.settings.permission);
    setSoundEnabled(parsed.settings.sound);
    return true;
  };

  const permissionOptions: SegmentedOption<SpinPermission>[] = [
    { value: 'all', label: t('spinWheel.permAll') },
    { value: 'subs', label: t('spinWheel.permSubs') },
    { value: 'mods', label: t('spinWheel.permMods') },
  ];

  const settingsPanel = (
    <>
      <SettingsGroup title={t('common.sectionChannel')}>
        <ChannelFields
          platforms={platforms}
          onPlatformsChange={setPlatforms}
          twitch={twitchChannel}
          onTwitchChange={setTwitchChannel}
          kick={kickChannel}
          onKickChange={setKickChannel}
        />
      </SettingsGroup>

      <SettingsGroup title={t('spinWheel.sectionOptions')}>
        <div>
          <FieldLabel htmlFor={`${id}-options`} tip={t('spinWheel.optionsTip')}>
            {t('spinWheel.optionsLabel')}
          </FieldLabel>
          <textarea
            id={`${id}-options`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('spinWheel.optionsPlaceholder')}
            rows={8}
            spellCheck={false}
            aria-describedby={`${id}-count`}
            className={`${INPUT_CLASS} h-auto min-h-40 py-2 leading-relaxed`}
          />
          <div className="mt-1 flex items-center justify-between gap-2">
            <p id={`${id}-count`} className={HINT_CLASS}>
              {t('spinWheel.count', { count: optionCount })}
            </p>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() =>
                  setText(
                    shuffleLines(
                      text
                        .split('\n')
                        .map((line) => line.trim())
                        .filter((line) => line.length > 0),
                    ).join('\n'),
                  )
                }
                disabled={optionCount < 2}
                className={BUTTON_QUIET}
              >
                {t('spinWheel.shuffle')}
              </button>
              <button
                type="button"
                onClick={() => setText('')}
                disabled={optionCount === 0}
                className={BUTTON_QUIET}
              >
                {t('spinWheel.clear')}
              </button>
            </div>
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('spinWheel.sectionChat')}>
        <div>
          <FieldLabel id={`${id}-permission`} tip={t('spinWheel.permissionTip')}>
            {t('spinWheel.permissionLabel')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-permission`}
            value={permission}
            onChange={setPermission}
            options={permissionOptions}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`${id}-cooldown`} tip={t('spinWheel.cooldownTip')}>
            {t('spinWheel.cooldownLabel')}
          </FieldLabel>
          <div className="flex items-center gap-1.5">
            <div className="min-w-0 flex-1">
              <IntegerField
                id={`${id}-cooldown`}
                value={cooldownSec}
                onChange={setCooldownSec}
                min={0}
                max={MAX_COOLDOWN_SECONDS}
              />
            </div>
            <span className="shrink-0 text-xs text-zinc-500">{t('poll.unitSeconds')}</span>
          </div>
          {cooldownSec === 0 && <p className={HINT_CLASS}>{t('spinWheel.cooldownOff')}</p>}
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('spinWheel.sectionSound')}>
        <Switch
          label={soundEnabled ? t('spinWheel.soundOn') : t('spinWheel.soundOff')}
          tip={t('spinWheel.soundTip')}
          checked={soundEnabled}
          onChange={setSoundEnabled}
        />
      </SettingsGroup>
    </>
  );

  const commands = (
    <ChatCommandsCard
      title={t('spinWheel.sectionCommands')}
      intro={t('spinWheel.commandsIntro')}
      commands={COMMANDS.map((command) => ({ usage: command.usage, action: t(command.action) }))}
      footer={
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {t('spinWheel.commandsCooldownNote')}
        </p>
      }
    />
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('spinWheel.title')}
      settings={settingsPanel}
      previewTitle={t('spinWheel.previewTitle')}
      previewTip={t('spinWheel.previewTip')}
      previewAspect={CANVAS.width / CANVAS.height}
      preview={
        <PreviewFrame
          src={previewUrl}
          title={t('spinWheel.previewIframeTitle')}
          canvas={CANVAS}
          lang={locale}
        />
      }
      previewFooter={
        <TestButtons
          title={t('spinWheel.testTitle')}
          layout="three"
          buttons={[{ label: t('spinWheel.testSpin'), onClick: () => send({ type: 'spin' }) }]}
        />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          label={t('spinWheel.overlayUrl')}
          tip={t('spinWheel.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('spinWheel.browserSourceHintSize')}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('spinWheel.widgetUrlPlaceholder')}
          invalidMessage={t('spinWheel.widgetUrlInvalid')}
          nextSteps={[
            t('common.nextSteps.addSource'),
            t('common.nextSteps.paste'),
            ...(WIDGET.sourceSize ? [t('common.nextSteps.size', { ...WIDGET.sourceSize })] : []),
            t('spinWheel.overlayNextStep'),
          ]}
        />
      }
      intro={t('spinWheel.intro')}
      aboutExtra={
        <>
          {commands}
          <SpinWheelAdvancedPromo />
        </>
      }
      guideSteps={[
        'spinWheel.guideStep1',
        'spinWheel.guideStep2',
        'spinWheel.guideStep3',
        'spinWheel.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}

export const Route = createFileRoute('/{-$locale}/setup/spin-wheel')({
  head: ({ params }) =>
    getSetupPageHead('spin-wheel', getParamsLocale(params), {
      breadcrumb: 'spinWheel.breadcrumb',
      faq: FAQ,
    }),
  component: SpinWheelSetup,
});
