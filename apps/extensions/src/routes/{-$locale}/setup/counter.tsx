import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useEffect, useId, useState } from 'react';
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
import { FieldLabel } from '#/components/ui/field-label';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS, TextField } from '#/components/ui/text-field';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import {
  type ChannelEmote,
  loadChannelEmotes,
} from '#/features/widgets/countdown/countdown-emotes';
import { EmotePicker } from '#/features/widgets/countdown/emote-picker';
import { commandProblem } from '#/features/widgets/counter/counter-state';
import { PREVIEW_CHANNEL, type PreviewMessage } from '#/features/widgets/counter/use-counter';
import { hueFor } from '#/features/widgets/overlay-style';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import {
  buildCounterPreviewUrl,
  buildCounterUrl,
  COMMAND_MAX_LENGTH,
  COUNTER_COLORS,
  COUNTER_LAYOUTS,
  COUNTER_STAGES,
  type CounterLayout,
  type CounterSettings,
  type CounterSpec,
  DEFAULT_COUNTER,
  DEFAULT_COUNTER_SETTINGS,
  ICON_MAX_LENGTH,
  LABEL_MAX_LENGTH,
  MAX_COUNT,
  MAX_COUNTERS,
  normalizeCommand,
  parseCounterUrl,
  uniqueCommands,
} from '#/lib/counter-url';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/counter')({
  head: ({ params }) =>
    getSetupPageHead('counter', getParamsLocale(params), {
      breadcrumb: 'counter.breadcrumb',
      faq: FAQ,
    }),
  component: CounterSetup,
});

const WIDGET = getWidget('counter');

const FAQ: FaqEntry[] = [
  ['counter.faq1Q', 'counter.faq1A'],
  ['counter.faq2Q', 'counter.faq2A'],
  ['counter.faq3Q', 'counter.faq3A'],
  ['counter.faq4Q', 'counter.faq4A'],
];

/** The counters "Add Counter" offers in turn, after the Wins one every page starts with. */
const SUGGESTED = [
  { key: 'wins', icon: '🏆' },
  { key: 'losses', icon: '❌' },
  { key: 'draws', icon: '🤝' },
  { key: 'scares', icon: '😱' },
] as const;

const BUTTON_QUIET =
  'rounded-md p-1.5 text-zinc-500 transition-colors enabled:hover:bg-zinc-200 enabled:hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400 dark:enabled:hover:bg-zinc-800 dark:enabled:hover:text-white';

function CounterSetup() {
  const { t } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  // The first counter's label is in the page's language; its command stays !wins.
  const [settings, setSettings] = useState<CounterSettings>(() => ({
    ...DEFAULT_COUNTER_SETTINGS,
    counters: [{ ...DEFAULT_COUNTER, label: t('counter.defaults.wins') }],
  }));
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const id = useId();

  const update = <K extends keyof CounterSettings>(key: K, value: CounterSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));
  const setCounters = (change: (counters: CounterSpec[]) => CounterSpec[]) =>
    setSettings((current) => ({ ...current, counters: change(current.counters) }));
  const updateCounter = <K extends keyof CounterSpec>(
    index: number,
    key: K,
    value: CounterSpec[K],
  ) =>
    setCounters((counters) =>
      counters.map((counter, at) => (at === index ? { ...counter, [key]: value } : counter)),
    );

  const addCounter = () =>
    setCounters((counters) => {
      const used = new Set(counters.map((counter) => counter.command));
      const next = SUGGESTED.find((suggestion) => !used.has(suggestion.key));
      const counter: CounterSpec = next
        ? {
            ...DEFAULT_COUNTER,
            label: t(`counter.defaults.${next.key}`),
            command: next.key,
            icon: next.icon,
          }
        : { ...DEFAULT_COUNTER, label: '', command: `count${counters.length + 1}`, icon: '' };
      return [...counters, counter];
    });

  // The channel's own emotes for the pickers, reloaded a moment after the channel boxes settle.
  const [emotes, setEmotes] = useState<ChannelEmote[] | null>(null);
  const [emotesLoading, setEmotesLoading] = useState(false);
  useEffect(() => {
    const twitch = twitchChannel.trim();
    const kick = kickChannel.trim();
    if (!twitch && !kick) {
      setEmotes(null);
      setEmotesLoading(false);
      return;
    }
    let live = true;
    setEmotesLoading(true);
    const timer = window.setTimeout(() => {
      loadChannelEmotes(twitch, kick).then((list) => {
        if (!live) return;
        setEmotes(list);
        setEmotesLoading(false);
      });
    }, 500);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [twitchChannel, kickChannel]);

  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted ? buildCounterUrl(origin, settings, twitchChannel, kickChannel) : '';
  const previewUrl = mounted ? buildCounterPreviewUrl(origin, settings, previewId) : '';
  const stage = COUNTER_STAGES[settings.layout];

  const applyWidgetUrl = (text: string) => {
    const parsed = parseCounterUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  // The commands the overlay will answer to: a repeated or empty one gets its fallback there.
  const effective = uniqueCommands(
    settings.counters.map((counter) => ({
      ...counter,
      command: normalizeCommand(counter.command),
    })),
  );
  const commands = settings.counters.map((counter) => normalizeCommand(counter.command));
  const hasChannel = Boolean(twitchChannel.trim() || kickChannel.trim());

  const emoteField = (counter: CounterSpec, index: number) => {
    const labelId = `${id}-emote-${index}`;
    return (
      <div>
        <FieldLabel id={labelId} tip={t('counter.emoteTip')}>
          {t('counter.emote')}
        </FieldLabel>
        {!hasChannel ? (
          <p className={HINT_CLASS}>{t('countdown.emoteNeedChannel')}</p>
        ) : emotesLoading || emotes === null ? (
          <EmotePicker
            labelledBy={labelId}
            emotes={[]}
            value=""
            onChange={() => {}}
            disabled
            disabledLabel={t('countdown.emoteLoading')}
          />
        ) : emotes.length === 0 ? (
          <p className={HINT_CLASS}>{t('countdown.emoteEmpty')}</p>
        ) : (
          <EmotePicker
            labelledBy={labelId}
            emotes={emotes}
            value={emotes.some((emote) => emote.url === counter.iconUrl) ? counter.iconUrl : ''}
            onChange={(value) => updateCounter(index, 'iconUrl', value)}
          />
        )}
      </div>
    );
  };

  const commandHint = (index: number) => {
    const command = commands[index];
    const shown = `!${effective[index].command}`;
    const problem = commandProblem(command, index, commands);
    if (problem === 'taken')
      return t('counter.commandTaken', { command: `!${command}`, fallback: shown });
    if (problem === 'reserved') return t('counter.commandReserved', { command: shown });
    return t('counter.commandHint', { command: shown });
  };

  const countersTab = (
    <SettingsGroup title={t('counter.sectionCounters')} hideTitle>
      <ol className="space-y-3">
        {settings.counters.map((counter, index) => {
          const n = index + 1;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: a counter's place is its number in the URL.
            <li key={index}>
              <fieldset
                aria-labelledby={`${id}-counter-${index}`}
                className="space-y-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    id={`${id}-counter-${index}`}
                    className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                  >
                    {t('counter.counterHeading', { n })}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCounters((counters) => counters.filter((_, at) => at !== index))
                    }
                    disabled={settings.counters.length <= 1}
                    aria-label={t('counter.removeCounter', { n })}
                    title={t('counter.removeCounter', { n })}
                    className={BUTTON_QUIET}
                  >
                    <CloseIcon className="size-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField
                    label={t('counter.label')}
                    tip={t('counter.labelTip')}
                    value={counter.label}
                    onChange={(value) => updateCounter(index, 'label', value)}
                    placeholder={t('counter.labelPlaceholder')}
                    maxLength={LABEL_MAX_LENGTH}
                    spellCheck={false}
                  />
                  <TextField
                    label={t('counter.command')}
                    tip={t('counter.commandTip')}
                    hint={commandHint(index)}
                    value={counter.command}
                    onChange={(value) => updateCounter(index, 'command', normalizeCommand(value))}
                    placeholder={`count${n}`}
                    maxLength={COMMAND_MAX_LENGTH}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <TextField
                    label={t('counter.icon')}
                    tip={t('counter.iconTip')}
                    value={counter.icon}
                    onChange={(value) => updateCounter(index, 'icon', value)}
                    placeholder={t('counter.iconPlaceholder')}
                    maxLength={ICON_MAX_LENGTH}
                  />
                  <div>
                    <FieldLabel htmlFor={`${id}-start-${index}`} tip={t('counter.startTip')}>
                      {t('counter.start')}
                    </FieldLabel>
                    <CountField
                      id={`${id}-start-${index}`}
                      value={counter.start}
                      onChange={(value) => updateCounter(index, 'start', value)}
                      min={0}
                      max={MAX_COUNT}
                    />
                  </div>
                </div>
                {emoteField(counter, index)}
              </fieldset>
            </li>
          );
        })}
      </ol>
      <div>
        <button
          type="button"
          onClick={addCounter}
          disabled={settings.counters.length >= MAX_COUNTERS}
          className={BUTTON_TEST}
        >
          {t('counter.addCounter')}
        </button>
        <p className={HINT_CLASS}>{t('counter.countsHint', { max: MAX_COUNTERS })}</p>
      </div>
    </SettingsGroup>
  );

  const layoutOptions: SegmentedOption<CounterLayout>[] = COUNTER_LAYOUTS.map((layout) => ({
    value: layout,
    label: t(`counter.layouts.${layout}`),
  }));

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
      <div>
        <FieldLabel id={`${id}-layout`} tip={t('counter.layoutTip')}>
          {t('counter.layout')}
        </FieldLabel>
        <SegmentedControl
          labelledBy={`${id}-layout`}
          value={settings.layout}
          onChange={(value) => update('layout', value)}
          options={layoutOptions}
        />
      </div>
      {isClassic(settings.preset) && (
        <div>
          <FieldLabel id={`${id}-color`}>{t('counter.color')}</FieldLabel>
          <ColorSwatches
            labelledBy={`${id}-color`}
            value={settings.color}
            onChange={(value) => update('color', value)}
            options={COUNTER_COLORS.map((color) => ({
              value: color,
              label: t(`subathon.colors.${color}`),
              background: `hsl(${hueFor(color, 1)} 85% 52%)`,
            }))}
          />
        </div>
      )}
      <Switch
        label={t('counter.showPops')}
        tip={t('counter.showPopsTip')}
        checked={settings.pops}
        onChange={(value) => update('pops', value)}
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

  const command = (text: string) => () => send({ type: 'command', text });
  const first = `!${effective[0].command}`;
  const testButtons = [
    ...effective.map((counter) => ({
      label: `!${counter.command}`,
      onClick: command(`!${counter.command}`),
    })),
    { label: `${first} -1`, onClick: command(`${first} -1`) },
    {
      label: t('counter.testReset'),
      onClick: () => {
        for (const counter of effective)
          send({ type: 'command', text: `!${counter.command} reset` });
      },
    },
  ];

  const usage: { usage: string; action: TranslationKey }[] = [
    { usage: first, action: 'counter.cmdOne' },
    { usage: `${first} +3`, action: 'counter.cmdAdd' },
    { usage: `${first} -1`, action: 'counter.cmdRemove' },
    { usage: `${first} set 10`, action: 'counter.cmdSet' },
    { usage: `${first} reset`, action: 'counter.cmdReset' },
  ];

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('counter.title')}
      settingsPinned={channelGroup}
      settingsTabs={[
        { id: 'counters', label: t('counter.sectionCounters'), content: countersTab },
        { id: 'appearance', label: t('common.sectionAppearance'), content: appearanceTab },
      ]}
      previewTitle={t('counter.previewTitle')}
      previewTip={t('counter.previewHint')}
      // A 16:9 box, like a stream frame, so the band the pops rise into shows too.
      previewAspect={16 / 9}
      preview={
        <PreviewFrame src={previewUrl} title={t('counter.previewIframeTitle')} canvas={stage} />
      }
      previewFooter={
        <TestButtons title={t('counter.testTitle')} layout="two-four" buttons={testButtons} />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('counter.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('counter.browserSourceHintSize', stage)}`}
          sourceSize={stage}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('counter.widgetUrlPlaceholder')}
          invalidMessage={t('counter.widgetUrlInvalid')}
        />
      }
      intro={t('counter.intro')}
      aboutExtra={
        <ChatCommandsCard
          title={t('counter.sectionCommands')}
          intro={t('counter.commandsIntro')}
          commands={usage.map((entry) => ({ usage: entry.usage, action: t(entry.action) }))}
        />
      }
      guideTitle={t('counter.guideTitle')}
      guideSteps={[
        'counter.guideStep1',
        'counter.guideStep2',
        'counter.guideStep3',
        'counter.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
