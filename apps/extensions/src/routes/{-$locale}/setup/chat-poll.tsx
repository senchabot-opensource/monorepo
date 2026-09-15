import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useId, useRef, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { CopyUrlField } from '#/components/copy-url-field';
import { CloseIcon } from '#/components/icons';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { BUTTON_TEST } from '#/components/ui/button-styles';
import { ColorSwatches } from '#/components/ui/color-swatches';
import { CountField } from '#/components/ui/count-field';
import { DurationField } from '#/components/ui/duration-field';
import { FieldLabel } from '#/components/ui/field-label';
import { SegmentedControl } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS, INPUT_CLASS, TextField } from '#/components/ui/text-field';
import type { PollChatEvent } from '#/features/widgets/poll/poll-chat';
import { COMMAND } from '#/features/widgets/poll/poll-state';
import { PREVIEW_CHANNEL, type PreviewMessage } from '#/features/widgets/poll/use-poll';
import type { SubathonPlatform } from '#/features/widgets/subathon/subathon-events';
import { hueFor } from '#/features/widgets/overlay-style';
import { LOCALES, type Locale, type TranslationKey, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import {
  buildPollPreviewUrl,
  buildPollUrl,
  DEFAULT_POLL_SETTINGS,
  MAX_DELAY_SECONDS,
  MAX_DURATION_SECONDS,
  MAX_HOLD_SECONDS,
  MAX_OPTIONS,
  OPTION_MAX_LENGTH,
  POLL_COLORS,
  POLL_POSITIONS,
  type PollSettings,
  parsePollUrl,
  QUESTION_MAX_LENGTH,
  SUB_WEIGHTS,
  savedPoll,
} from '#/lib/poll-url';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/chat-poll')({
  head: ({ params }) =>
    getSetupPageHead('poll', getParamsLocale(params), {
      breadcrumb: 'poll.breadcrumb',
      faq: FAQ,
    }),
  component: PollSetup,
});

const WIDGET = getWidget('poll');
// sourceSize is only null for tools without a browser source; the fallback satisfies the type.
const CANVAS = WIDGET.sourceSize ?? { width: 640, height: 560 };

const FAQ: FaqEntry[] = [
  ['poll.faq1Q', 'poll.faq1A'],
  ['poll.faq2Q', 'poll.faq2A'],
  ['poll.faq3Q', 'poll.faq3A'],
  ['poll.faq4Q', 'poll.faq4A'],
  ['poll.faq5Q', 'poll.faq5A'],
];

// `question` is the word "Question" in the page's language.
const COMMANDS: { usage: (question: string) => string; action: TranslationKey }[] = [
  { usage: (question) => `${COMMAND} ${question} | A | B`, action: 'poll.cmdNew' },
  { usage: (question) => `${COMMAND} 2m ${question} | A | B`, action: 'poll.cmdNewTime' },
  { usage: (question) => `${COMMAND} ${question}?`, action: 'poll.cmdYesNo' },
  { usage: () => `${COMMAND} start`, action: 'poll.cmdStart' },
  { usage: () => `${COMMAND} extend 30s`, action: 'poll.cmdExtend' },
  { usage: () => `${COMMAND} end`, action: 'poll.cmdEnd' },
  { usage: () => `${COMMAND} cancel`, action: 'poll.cmdCancel' },
];

// Each language in its own words, since it names the poll's language, not the page's.
const LANGUAGE_NAMES: Record<Locale, string> = { en: 'English', tr: 'Türkçe' };
// The preview's sample poll has three options.
const SAMPLE_OPTIONS = 3;
const TEST_VOTES = 10;

const BUTTON_QUIET =
  'rounded-md p-1.5 text-zinc-500 transition-colors enabled:hover:bg-zinc-200 enabled:hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400 dark:enabled:hover:bg-zinc-800 dark:enabled:hover:text-white';

function PollSetup() {
  const { t, locale } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  const [settings, setSettings] = useState(DEFAULT_POLL_SETTINGS);
  // The poll's own language: the page's until one is picked. The OBS URL always carries it.
  const [pickedLocale, setPickedLocale] = useState<Locale | null>(null);
  const pollLocale = pickedLocale ?? locale;
  const [mounted, setMounted] = useState(false);
  // Pairs this page with its own preview, not the ones in other tabs.
  const [previewId] = useState(() => Math.random().toString(36).slice(2, 10));
  const channelRef = useRef<BroadcastChannel | null>(null);
  const testVoter = useRef(0);
  const id = useId();

  useEffect(() => {
    setMounted(true);
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channelRef.current = channel;
    return () => channel.close();
  }, []);

  const update = <K extends keyof PollSettings>(key: K, value: PollSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  const setOptions = (change: (options: string[]) => string[]) =>
    setSettings((current) => ({ ...current, options: change(current.options) }));

  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted
    ? buildPollUrl(origin, settings, twitchChannel, kickChannel, pollLocale)
    : '';
  const previewUrl = mounted ? buildPollPreviewUrl(origin, settings, pollLocale, previewId) : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parsePollUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    if (parsed.locale) setPickedLocale(parsed.locale);
    return true;
  };

  const seconds = t('poll.unitSeconds');
  const minutesSeconds = [t('poll.unitMinutes'), seconds] as const;
  const durationField = (
    key: 'duration' | 'hold',
    label: TranslationKey,
    tip: TranslationKey,
    max: number,
    off: TranslationKey,
  ) => (
    <div>
      <FieldLabel id={`${id}-${key}`} tip={t(tip)}>
        {t(label)}
      </FieldLabel>
      <DurationField
        labelledBy={`${id}-${key}`}
        value={settings[key]}
        onChange={(value) => update(key, value)}
        units={['m', 's']}
        unitLabels={minutesSeconds}
        max={max}
      />
      {settings[key] === 0 && <p className={HINT_CLASS}>{t(off)}</p>}
    </div>
  );

  const optionsEditor = (
    <div>
      <FieldLabel id={`${id}-options`} tip={t('poll.optionsTip')}>
        {t('poll.options')}
      </FieldLabel>
      <ol aria-labelledby={`${id}-options`} className="space-y-2">
        {settings.options.map((option, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: an option's place is its number in chat.
          <li key={index} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-md bg-zinc-200 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {index + 1}
            </span>
            <input
              type="text"
              value={option}
              onChange={(event) => {
                const value = event.target.value;
                setOptions((options) => options.map((old, at) => (at === index ? value : old)));
              }}
              aria-label={t('poll.optionLabel', { n: index + 1 })}
              placeholder={t('poll.optionPlaceholder', { n: index + 1 })}
              maxLength={OPTION_MAX_LENGTH}
              spellCheck={false}
              className={INPUT_CLASS}
            />
            <button
              type="button"
              onClick={() => setOptions((options) => options.filter((_, at) => at !== index))}
              disabled={settings.options.length <= 2}
              aria-label={t('poll.removeOption', { n: index + 1 })}
              title={t('poll.removeOption', { n: index + 1 })}
              className={BUTTON_QUIET}
            >
              <CloseIcon className="size-4" />
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => setOptions((options) => [...options, ''])}
        disabled={settings.options.length >= MAX_OPTIONS}
        className={`${BUTTON_TEST} mt-2`}
      >
        {t('poll.addOption')}
      </button>
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

      <SettingsGroup title={t('poll.sectionPoll')}>
        <TextField
          label={t('poll.question')}
          tip={t('poll.questionTip')}
          value={settings.question}
          onChange={(value) => update('question', value)}
          placeholder={t('poll.questionPlaceholder')}
          maxLength={QUESTION_MAX_LENGTH}
          spellCheck={false}
        />
        {optionsEditor}
        <p className={`${HINT_CLASS} mt-0`}>
          {t('poll.pollHint', { command: `${COMMAND} start` })}
        </p>
      </SettingsGroup>

      <SettingsGroup title={t('poll.sectionVoting')}>
        <div className="grid gap-3 sm:grid-cols-2">
          {durationField(
            'duration',
            'poll.duration',
            'poll.durationTip',
            MAX_DURATION_SECONDS,
            'poll.durationOff',
          )}
          {durationField('hold', 'poll.hold', 'poll.holdTip', MAX_HOLD_SECONDS, 'poll.holdOff')}
          <div>
            <FieldLabel htmlFor={`${id}-delay`} tip={t('poll.delayTip')}>
              {t('poll.delay')}
            </FieldLabel>
            <div className="flex items-center gap-1.5">
              <div className="min-w-0 flex-1">
                <CountField
                  id={`${id}-delay`}
                  value={settings.delay}
                  onChange={(value) => update('delay', value)}
                  min={0}
                  max={MAX_DELAY_SECONDS}
                />
              </div>
              <span className="shrink-0 text-xs text-zinc-500">{seconds}</span>
            </div>
          </div>
          <div>
            <FieldLabel id={`${id}-voters`} tip={t('poll.votersTip')}>
              {t('poll.voters')}
            </FieldLabel>
            <SegmentedControl
              labelledBy={`${id}-voters`}
              value={settings.subsOnly ? 'subs' : 'all'}
              onChange={(value) => update('subsOnly', value === 'subs')}
              options={[
                { value: 'all', label: t('poll.votersAll') },
                { value: 'subs', label: t('poll.votersSubs') },
              ]}
            />
          </div>
          <div>
            <FieldLabel id={`${id}-weight`} tip={t('poll.subWeightTip')}>
              {t('poll.subWeight')}
            </FieldLabel>
            <SegmentedControl
              labelledBy={`${id}-weight`}
              value={String(settings.subWeight)}
              onChange={(value) => update('subWeight', Number(value))}
              options={SUB_WEIGHTS.map((weight) => ({
                value: String(weight),
                label: t('poll.subWeightValue', { n: weight }),
              }))}
              disabled={settings.subsOnly}
            />
          </div>
        </div>
        <Switch
          label={t('poll.change')}
          tip={t('poll.changeTip')}
          checked={settings.change}
          onChange={(value) => update('change', value)}
        />
        <Switch
          label={t('poll.blind')}
          tip={t('poll.blindTip')}
          checked={settings.blind}
          onChange={(value) => update('blind', value)}
        />
      </SettingsGroup>

      <SettingsGroup title={t('common.sectionAppearance')}>
        <div>
          <FieldLabel id={`${id}-color`}>{t('poll.color')}</FieldLabel>
          <ColorSwatches
            labelledBy={`${id}-color`}
            value={settings.color}
            onChange={(value) => update('color', value)}
            options={POLL_COLORS.map((color) => ({
              value: color,
              label: t(`subathon.colors.${color}`),
              background: `hsl(${hueFor(color, 1)} 85% 52%)`,
            }))}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel id={`${id}-position`} tip={t('poll.positionTip')}>
              {t('poll.position')}
            </FieldLabel>
            <SegmentedControl
              labelledBy={`${id}-position`}
              value={settings.position}
              onChange={(value) => update('position', value)}
              options={POLL_POSITIONS.map((value) => ({
                value,
                label: t(value === 'top' ? 'poll.positionTop' : 'poll.positionBottom'),
              }))}
            />
          </div>
          <div>
            <FieldLabel id={`${id}-lang`} tip={t('poll.languageTip')}>
              {t('poll.language')}
            </FieldLabel>
            <SegmentedControl
              labelledBy={`${id}-lang`}
              value={pollLocale}
              onChange={setPickedLocale}
              options={LOCALES.map((value) => ({ value, label: LANGUAGE_NAMES[value] }))}
            />
          </div>
        </div>
      </SettingsGroup>
    </>
  );

  const send = (event: PollChatEvent) => {
    const message: PreviewMessage = { type: 'event', preview: previewId, event };
    channelRef.current?.postMessage(message);
  };
  const mod = (text: string) =>
    send({ kind: 'message', platform: 'twitch', login: 'you', text, mod: true, sub: true });
  const optionCount = savedPoll(settings)?.options.length ?? SAMPLE_OPTIONS;
  const testPlatform = (): SubathonPlatform =>
    settings.platforms === 'both' ? (Math.random() < 0.5 ? 'twitch' : 'kick') : settings.platforms;
  const testButtons: { label: string; run: () => void }[] = [
    {
      label: t('poll.testVotes', { count: TEST_VOTES }),
      run: () => {
        for (let i = 0; i < TEST_VOTES; i++) {
          send({
            kind: 'message',
            platform: testPlatform(),
            login: `tester${testVoter.current++}`,
            text: String(1 + Math.floor(Math.random() * optionCount)),
            mod: false,
            // A subs-only poll turns everyone else's votes away.
            sub: settings.subsOnly,
          });
        }
      },
    },
    { label: t('poll.testExtend'), run: () => mod(`${COMMAND} extend 30s`) },
    { label: t('poll.testEnd'), run: () => mod(`${COMMAND} end`) },
    { label: t('poll.testNew'), run: () => mod(`${COMMAND} start`) },
  ];

  const commands = (
    <section
      aria-labelledby={`${id}-commands`}
      className="rounded-xl border border-zinc-200 bg-zinc-100/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50"
    >
      <h2
        id={`${id}-commands`}
        className="mb-2 text-base font-semibold text-zinc-900 dark:text-white"
      >
        {t('poll.sectionCommands')}
      </h2>
      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">{t('poll.commandsIntro')}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {COMMANDS.map((command) => (
          <div key={command.action} className="contents">
            <dt>
              <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                {command.usage(t('poll.exampleQuestion'))}
              </code>
            </dt>
            <dd className="self-center text-zinc-600 dark:text-zinc-400">{t(command.action)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{t('poll.votingIntro')}</p>
    </section>
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('poll.title')}
      settings={settingsPanel}
      previewTitle={t('poll.previewTitle')}
      previewTip={t('poll.previewHint')}
      previewAspect={CANVAS.width / CANVAS.height}
      preview={
        <PreviewFrame
          src={previewUrl}
          title={t('poll.previewIframeTitle')}
          canvas={CANVAS}
          lang={pollLocale}
        />
      }
      previewFooter={
        <fieldset
          aria-labelledby={`${id}-test`}
          className="grid grid-cols-2 gap-1.5 sm:grid-cols-4"
        >
          <span
            id={`${id}-test`}
            className="col-span-2 text-xs font-medium text-zinc-600 sm:col-span-4 dark:text-zinc-400"
          >
            {t('poll.testTitle')}
          </span>
          {testButtons.map((button) => (
            <button key={button.label} type="button" onClick={button.run} className={BUTTON_TEST}>
              {button.label}
            </button>
          ))}
        </fieldset>
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('poll.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('poll.browserSourceHintSize')}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('poll.widgetUrlPlaceholder')}
          invalidMessage={t('poll.widgetUrlInvalid')}
        />
      }
      intro={t('poll.intro')}
      aboutExtra={commands}
      guideTitle={t('poll.guideTitle')}
      guideSteps={['poll.guideStep1', 'poll.guideStep2', 'poll.guideStep3', 'poll.guideStep4']}
      faq={FAQ}
    />
  );
}
