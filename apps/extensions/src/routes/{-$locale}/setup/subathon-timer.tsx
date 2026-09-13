import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useId, useRef, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { DurationField } from '#/components/ui/duration-field';
import { FieldLabel } from '#/components/ui/field-label';
import { RangeField } from '#/components/ui/range-field';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS, TextField } from '#/components/ui/text-field';
import { COMMAND } from '#/features/widgets/subathon/subathon-timer';
import { hueFor } from '#/features/widgets/subathon/subathon-widget';
import { PREVIEW_CHANNEL, type PreviewMessage } from '#/features/widgets/subathon/use-subathon';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import {
  buildSubathonPreviewUrl,
  buildSubathonUrl,
  DEFAULT_SUBATHON_SETTINGS,
  MAX_SECONDS,
  parseSubathonUrl,
  SUBATHON_COLORS,
  type SubathonColor,
  type SubathonSettings,
  type SubathonStyle,
  TITLE_MAX_LENGTH,
} from '#/lib/subathon-url';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/subathon-timer')({
  head: ({ params }) =>
    getSetupPageHead('subathon', getParamsLocale(params), {
      breadcrumb: 'subathon.breadcrumb',
      faq: FAQ,
    }),
  component: SubathonSetup,
});

const WIDGET = getWidget('subathon');
// sourceSize is only null for tools; the fallback just satisfies the type.
const CANVAS = WIDGET.sourceSize ?? { width: 800, height: 300 };

// 1x is real time; 60x drains a one hour timer in a minute.
const PREVIEW_SPEEDS = [1, 10, 60, 300];
const DEFAULT_SPEED_INDEX = 2;
// Per-event values past an hour would be a typo, not a setting.
const MAX_EVENT_SECONDS = 3600;

const FAQ: FaqEntry[] = [
  ['subathon.faq1Q', 'subathon.faq1A'],
  ['subathon.faq2Q', 'subathon.faq2A'],
  ['subathon.faq3Q', 'subathon.faq3A'],
  ['subathon.faq4Q', 'subathon.faq4A'],
];

const COMMANDS: { usage: string; action: TranslationKey }[] = [
  { usage: `${COMMAND} start`, action: 'subathon.cmdStart' },
  { usage: `${COMMAND} pause`, action: 'subathon.cmdPause' },
  { usage: `${COMMAND} add 10m`, action: 'subathon.cmdAdd' },
  { usage: `${COMMAND} remove 5m`, action: 'subathon.cmdRemove' },
  { usage: `${COMMAND} set 2h`, action: 'subathon.cmdSet' },
  { usage: `${COMMAND} reset`, action: 'subathon.cmdReset' },
];

const TEST_BUTTON_CLASS =
  'inline-flex h-8 items-center rounded-md border border-zinc-300 bg-white px-2.5 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700';

function ColorSwatches({
  value,
  onChange,
  labelledBy,
}: {
  value: SubathonColor;
  onChange: (color: SubathonColor) => void;
  labelledBy: string;
}) {
  const { t } = useI18n();
  const name = useId();
  return (
    <fieldset aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
      {SUBATHON_COLORS.map((color) => (
        <label
          key={color}
          title={t(`subathon.colors.${color}`)}
          className="relative flex size-8 cursor-pointer items-center justify-center rounded-full ring-offset-2 ring-offset-white has-checked:ring-2 has-checked:ring-zinc-900 has-focus-visible:ring-2 has-focus-visible:ring-green-500 dark:ring-offset-zinc-900 dark:has-checked:ring-white"
        >
          <input
            type="radio"
            name={name}
            value={color}
            checked={value === color}
            onChange={() => onChange(color)}
            aria-label={t(`subathon.colors.${color}`)}
            className="sr-only"
          />
          <span
            aria-hidden="true"
            className="size-7 rounded-full border border-black/10"
            style={{
              background:
                color === 'hp'
                  ? `conic-gradient(from 200deg, hsl(${hueFor('hp', 1)} 85% 50%), hsl(${hueFor('hp', 0.45)} 90% 52%), hsl(${hueFor('hp', 0)} 85% 52%), hsl(${hueFor('hp', 1)} 85% 50%))`
                  : `hsl(${hueFor(color, 1)} 85% 52%)`,
            }}
          />
        </label>
      ))}
    </fieldset>
  );
}

function SubathonSetup() {
  const { t } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  const [settings, setSettings] = useState(DEFAULT_SUBATHON_SETTINGS);
  const [speedIndex, setSpeedIndex] = useState(DEFAULT_SPEED_INDEX);
  const [mounted, setMounted] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const bitsPlatform = useRef<'twitch' | 'kick'>('twitch');
  const id = useId();

  useEffect(() => {
    setMounted(true);
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channelRef.current = channel;
    return () => channel.close();
  }, []);

  const update = <K extends keyof SubathonSettings>(key: K, value: SubathonSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const send = (message: PreviewMessage) => channelRef.current?.postMessage(message);
  const testName = t('subathon.testViewer');

  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted ? buildSubathonUrl(origin, settings, twitchChannel, kickChannel) : '';
  const previewUrl = mounted
    ? buildSubathonPreviewUrl(origin, settings, PREVIEW_SPEEDS[speedIndex])
    : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseSubathonUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  const styleOptions: SegmentedOption<SubathonStyle>[] = [
    { value: 'bar', label: t('subathon.styleBar') },
    { value: 'clock', label: t('subathon.styleClock') },
    { value: 'ring', label: t('subathon.styleRing') },
  ];
  const startOptions: SegmentedOption<'command' | 'auto'>[] = [
    { value: 'command', label: t('subathon.startCommand', { command: `${COMMAND} start` }) },
    { value: 'auto', label: t('subathon.startAuto') },
  ];
  const hm = [t('subathon.unitHours'), t('subathon.unitMinutes')] as const;
  const ms = [t('subathon.unitMinutes'), t('subathon.unitSeconds')] as const;

  const valueField = (key: 'sub' | 'gift' | 'bits', label: string, tip: string) => (
    <div>
      <FieldLabel id={`${id}-${key}`} tip={tip}>
        {label}
      </FieldLabel>
      <DurationField
        labelledBy={`${id}-${key}`}
        value={settings[key]}
        onChange={(value) => update(key, value)}
        units={['m', 's']}
        unitLabels={ms}
        max={MAX_EVENT_SECONDS}
      />
    </div>
  );

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
          <FieldLabel id={`${id}-style`} tip={t('subathon.styleTip')}>
            {t('subathon.style')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-style`}
            value={settings.style}
            onChange={(value) => update('style', value)}
            options={styleOptions}
          />
        </div>
        <div>
          <FieldLabel id={`${id}-color`} tip={t('subathon.colorTip')}>
            {t('subathon.color')}
          </FieldLabel>
          <ColorSwatches
            labelledBy={`${id}-color`}
            value={settings.color}
            onChange={(value) => update('color', value)}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label={t('subathon.titleLabel')}
            tip={t('subathon.titleTip')}
            value={settings.title}
            onChange={(value) => update('title', value)}
            placeholder={t('subathon.titlePlaceholder')}
            maxLength={TITLE_MAX_LENGTH}
            spellCheck={false}
          />
          <div className="flex flex-col justify-end gap-1">
            <Switch
              label={t('subathon.showPercent')}
              tip={t('subathon.showPercentTip')}
              checked={settings.percent}
              onChange={(value) => update('percent', value)}
            />
            <Switch
              label={t('subathon.showPops')}
              tip={t('subathon.showPopsTip')}
              checked={settings.pops}
              onChange={(value) => update('pops', value)}
            />
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('subathon.sectionTimer')}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel id={`${id}-start`} tip={t('subathon.startTimeTip')}>
              {t('subathon.startTime')}
            </FieldLabel>
            <DurationField
              labelledBy={`${id}-start`}
              value={settings.start}
              onChange={(value) => update('start', value)}
              units={['h', 'm']}
              unitLabels={hm}
              max={MAX_SECONDS}
            />
          </div>
          <div>
            <FieldLabel id={`${id}-cap`} tip={t('subathon.maxTimeTip')}>
              {t('subathon.maxTime')}
            </FieldLabel>
            <DurationField
              labelledBy={`${id}-cap`}
              value={settings.cap}
              onChange={(value) => update('cap', value)}
              units={['h', 'm']}
              unitLabels={hm}
              max={MAX_SECONDS}
            />
            {settings.cap === 0 && <p className={HINT_CLASS}>{t('subathon.maxTimeOff')}</p>}
          </div>
        </div>
        <div>
          <FieldLabel id={`${id}-autostart`} tip={t('subathon.startModeTip')}>
            {t('subathon.startMode')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-autostart`}
            value={settings.autostart ? 'auto' : 'command'}
            onChange={(value) => update('autostart', value === 'auto')}
            options={startOptions}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('subathon.sectionValues')}>
        <p className={`${HINT_CLASS} mt-0`}>{t('subathon.valuesHint')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {valueField('sub', t('subathon.perSub'), t('subathon.perSubTip'))}
          {valueField('gift', t('subathon.perGift'), t('subathon.perGiftTip'))}
          {valueField('bits', t('subathon.perBits'), t('subathon.perBitsTip'))}
          <div className="flex items-end pb-1">
            <div className="w-full">
              <Switch
                label={t('subathon.tiers')}
                tip={t('subathon.tiersTip')}
                checked={settings.tiers}
                disabled={settings.sub === 0 && settings.gift === 0}
                onChange={(value) => update('tiers', value)}
              />
            </div>
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('subathon.sectionCommands')}>
        <p className={`${HINT_CLASS} mt-0`}>{t('subathon.commandsIntro')}</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
          {COMMANDS.map((command) => (
            <div key={command.usage} className="contents">
              <dt>
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  {command.usage}
                </code>
              </dt>
              <dd className="self-center text-zinc-600 dark:text-zinc-400">{t(command.action)}</dd>
            </div>
          ))}
        </dl>
        <p className={HINT_CLASS}>{t('subathon.commandsDurations')}</p>
      </SettingsGroup>
    </>
  );

  const testButtons: { label: string; disabled?: boolean; message: () => PreviewMessage }[] = [
    {
      label: t('subathon.testSub'),
      disabled: settings.sub === 0,
      message: () => ({
        type: 'event',
        event: { kind: 'sub', platform: 'twitch', name: testName, tier: 1 },
      }),
    },
    {
      label: t('subathon.testGift'),
      disabled: settings.gift === 0,
      message: () => ({
        type: 'event',
        event: { kind: 'gift', platform: 'kick', name: testName, count: 5, tier: 1 },
      }),
    },
    {
      label: t('subathon.testBits'),
      disabled: settings.bits === 0,
      message: () => {
        // Alternates, so both platforms' pops get shown.
        const platform = bitsPlatform.current;
        bitsPlatform.current = platform === 'twitch' ? 'kick' : 'twitch';
        return { type: 'event', event: { kind: 'bits', platform, name: testName, amount: 500 } };
      },
    },
    {
      label: t('subathon.testRemove'),
      message: () => ({
        type: 'event',
        event: { kind: 'command', platform: 'twitch', command: { action: 'remove', ms: 600_000 } },
      }),
    },
    { label: t('subathon.testPause'), message: () => ({ type: 'toggle' }) },
    {
      label: t('subathon.testReset'),
      message: () => ({
        type: 'event',
        event: { kind: 'command', platform: 'twitch', command: { action: 'reset' } },
      }),
    },
  ];

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('subathon.title')}
      settings={settingsPanel}
      previewTitle={t('subathon.previewTitle')}
      previewTip={t('subathon.previewHint')}
      previewAspect={16 / 7}
      preview={
        <PreviewFrame
          src={previewUrl}
          title={t('subathon.previewIframeTitle')}
          canvas={CANVAS}
          motionSafe
        />
      }
      previewFooter={
        <div className="space-y-2.5">
          <fieldset
            aria-label={t('subathon.testTitle')}
            className="flex flex-wrap items-center gap-1.5"
          >
            <span className="mr-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {t('subathon.testTitle')}
            </span>
            {testButtons.map((button) => (
              <button
                key={button.label}
                type="button"
                disabled={button.disabled}
                onClick={() => send(button.message())}
                className={TEST_BUTTON_CLASS}
              >
                {button.label}
              </button>
            ))}
          </fieldset>
          <RangeField
            layout="inline"
            label={t('subathon.previewSpeed')}
            tip={t('subathon.previewSpeedTip')}
            min={0}
            max={PREVIEW_SPEEDS.length - 1}
            value={speedIndex}
            onChange={(value) => setSpeedIndex(Number(value))}
            format={(index) => t('subathon.previewSpeedValue', { rate: PREVIEW_SPEEDS[index] })}
            readoutClassName="w-10"
          />
        </div>
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('subathon.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('subathon.browserSourceHintSize')}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('subathon.widgetUrlPlaceholder')}
          invalidMessage={t('subathon.widgetUrlInvalid')}
        />
      }
      intro={t('subathon.intro')}
      guideTitle={t('subathon.guideTitle')}
      guideSteps={[
        'subathon.guideStep1',
        'subathon.guideStep2',
        'subathon.guideStep3',
        'subathon.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
