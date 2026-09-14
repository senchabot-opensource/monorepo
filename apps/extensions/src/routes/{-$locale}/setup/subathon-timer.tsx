import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useId, useRef, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { DurationField } from '#/components/ui/duration-field';
import { FieldLabel } from '#/components/ui/field-label';
import { MinutesField } from '#/components/ui/minutes-field';
import { RangeField } from '#/components/ui/range-field';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { Tabs } from '#/components/ui/tabs';
import { HINT_CLASS, TextField } from '#/components/ui/text-field';
import type { SubathonEvent, SubathonPlatform } from '#/features/widgets/subathon/subathon-events';
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
  type SubathonTimeKey,
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
// The widget starts at least one minute in, whatever the URL says.
const MIN_START_SECONDS = 60;

interface TimeField {
  key: SubathonTimeKey;
  label: TranslationKey;
  tip: TranslationKey;
}

const TIME_FIELDS: Record<SubathonPlatform, TimeField[]> = {
  twitch: [
    { key: 'tsub', label: 'subathon.perSub', tip: 'subathon.perSubTip' },
    { key: 'tgift', label: 'subathon.perGift', tip: 'subathon.perGiftTip' },
    { key: 'bits', label: 'subathon.perBits', tip: 'subathon.perBitsTip' },
  ],
  kick: [
    { key: 'ksub', label: 'subathon.perSub', tip: 'subathon.perSubKickTip' },
    { key: 'kgift', label: 'subathon.perGift', tip: 'subathon.perGiftTip' },
    { key: 'kicks', label: 'subathon.perKicks', tip: 'subathon.perKicksTip' },
  ],
};

const PLATFORM_DOTS: Record<SubathonPlatform, string> = { twitch: '#9146FF', kick: '#53FC18' };

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
  'inline-flex h-8 items-center justify-center truncate rounded-md border border-zinc-300 bg-white px-2.5 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700';

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
  const [valuesTab, setValuesTab] = useState<SubathonPlatform>('twitch');
  const [speedIndex, setSpeedIndex] = useState(DEFAULT_SPEED_INDEX);
  const [mounted, setMounted] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const bitsPlatform = useRef<SubathonPlatform>('twitch');
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
  const hoursMinutes = [t('subathon.unitHours'), t('subathon.unitMinutes')] as const;

  const timerField = (key: 'start' | 'cap', label: TranslationKey, tip: TranslationKey) => (
    <div>
      <FieldLabel id={`${id}-${key}`} tip={t(tip)}>
        {t(label)}
      </FieldLabel>
      <DurationField
        labelledBy={`${id}-${key}`}
        value={settings[key]}
        onChange={(value) => update(key, value)}
        units={['h', 'm']}
        unitLabels={hoursMinutes}
        min={key === 'start' ? MIN_START_SECONDS : 0}
        max={MAX_SECONDS}
      />
      {key === 'cap' && settings.cap === 0 && (
        <p className={HINT_CLASS}>{t('subathon.maxTimeOff')}</p>
      )}
    </div>
  );

  const valueFields = (platform: SubathonPlatform) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TIME_FIELDS[platform].map(({ key, label, tip }) => (
          <div key={key}>
            <FieldLabel htmlFor={`${id}-${key}`} tip={t(tip)}>
              {t(label)}
            </FieldLabel>
            <MinutesField
              id={`${id}-${key}`}
              value={settings[key]}
              onChange={(value) => update(key, value)}
              max={MAX_EVENT_SECONDS}
              unitLabel={t('subathon.unitMinutes')}
            />
          </div>
        ))}
      </div>
      {platform === 'twitch' && (
        <Switch
          label={t('subathon.tiers')}
          tip={t('subathon.tiersTip')}
          checked={settings.tiers}
          disabled={settings.tsub === 0 && settings.tgift === 0}
          onChange={(value) => update('tiers', value)}
        />
      )}
    </div>
  );
  const platformLabel = (platform: SubathonPlatform) => (
    <>
      <span
        aria-hidden="true"
        className="size-2 rounded-full"
        style={{ background: PLATFORM_DOTS[platform] }}
      />
      {platform === 'twitch' ? 'Twitch' : 'Kick'}
    </>
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
          {timerField('start', 'subathon.startTime', 'subathon.startTimeTip')}
          {timerField('cap', 'subathon.maxTime', 'subathon.maxTimeTip')}
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
        {settings.platforms === 'both' ? (
          <Tabs
            label={t('common.platforms')}
            value={valuesTab}
            onChange={setValuesTab}
            tabs={(['twitch', 'kick'] as const).map((platform) => ({
              value: platform,
              label: platformLabel(platform),
            }))}
          >
            {valueFields(valuesTab)}
          </Tabs>
        ) : (
          valueFields(settings.platforms)
        )}
      </SettingsGroup>
    </>
  );

  // The test buttons use a platform whose value is on, so a click always shows something.
  const onPlatform = (twitch: number, kick: number, preferred: SubathonPlatform) =>
    preferred === 'twitch'
      ? twitch
        ? 'twitch'
        : kick
          ? 'kick'
          : null
      : kick
        ? 'kick'
        : twitch
          ? 'twitch'
          : null;
  const name = t('subathon.testViewer');
  const subPlatform = onPlatform(settings.tsub, settings.ksub, 'twitch');
  const giftPlatform = onPlatform(settings.tgift, settings.kgift, 'kick');
  const bitsOn = onPlatform(settings.bits, settings.kicks, 'twitch');
  const testButtons: { label: string; event?: () => SubathonEvent | null }[] = [
    {
      label: t('subathon.testSub'),
      event: () => subPlatform && { kind: 'sub', platform: subPlatform, name, tier: 1 },
    },
    {
      label: t('subathon.testGift'),
      event: () =>
        giftPlatform && { kind: 'gift', platform: giftPlatform, name, count: 5, tier: 1 },
    },
    {
      label: t('subathon.testBits'),
      event: () => {
        // Alternates when both are on, so both platforms' pops get shown.
        const platform = onPlatform(settings.bits, settings.kicks, bitsPlatform.current);
        bitsPlatform.current = platform === 'twitch' ? 'kick' : 'twitch';
        return platform && { kind: 'bits', platform, name, amount: 500 };
      },
    },
    {
      label: t('subathon.testRemove'),
      event: () => ({
        kind: 'command',
        platform: 'twitch',
        command: { action: 'remove', ms: 600_000 },
      }),
    },
    { label: t('subathon.testPause') },
    {
      label: t('subathon.testReset'),
      event: () => ({ kind: 'command', platform: 'twitch', command: { action: 'reset' } }),
    },
  ];
  const disabled = [!subPlatform, !giftPlatform, !bitsOn, false, false, false];

  const commands = (
    <section
      aria-labelledby={`${id}-commands`}
      className="rounded-xl border border-zinc-200 bg-zinc-100/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50"
    >
      <h2
        id={`${id}-commands`}
        className="mb-2 text-base font-semibold text-zinc-900 dark:text-white"
      >
        {t('subathon.sectionCommands')}
      </h2>
      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">{t('subathon.commandsIntro')}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {COMMANDS.map((command) => (
          <div key={command.usage} className="contents">
            <dt>
              <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                {command.usage}
              </code>
            </dt>
            <dd className="self-center text-zinc-600 dark:text-zinc-400">{t(command.action)}</dd>
          </div>
        ))}
      </dl>
      <p className={`${HINT_CLASS} mt-3`}>{t('subathon.commandsDurations')}</p>
    </section>
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('subathon.title')}
      settings={settingsPanel}
      previewTitle={t('subathon.previewTitle')}
      previewTip={t('subathon.previewHint')}
      // A 16:9 box, like a stream frame, so the band the +time pops rise into shows too.
      previewAspect={16 / 9}
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
          {/* Three events on the first row, three controls on the second. */}
          <fieldset aria-labelledby={`${id}-test`} className="grid grid-cols-3 gap-1.5">
            <span
              id={`${id}-test`}
              className="col-span-3 text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              {t('subathon.testTitle')}
            </span>
            {testButtons.map((button, index) => (
              <button
                key={button.label}
                type="button"
                disabled={disabled[index]}
                onClick={() => {
                  if (!button.event) return send({ type: 'toggle' });
                  const event = button.event();
                  if (event) send({ type: 'event', event });
                }}
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
      aboutExtra={commands}
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
