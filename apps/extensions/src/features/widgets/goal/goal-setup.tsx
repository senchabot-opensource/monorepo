import { useHydrated } from '@tanstack/react-router';
import { useEffect, useId, useRef, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { ChatCommandsCard } from '#/components/chat-commands-card';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { TestButtons } from '#/components/test-buttons';
import { ColorSwatches } from '#/components/ui/color-swatches';
import { CountField } from '#/components/ui/count-field';
import { DurationField } from '#/components/ui/duration-field';
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
import { hueFor } from '#/features/widgets/overlay-style';
import type { SubathonEvent, SubathonPlatform } from '#/features/widgets/subathon/subathon-events';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import {
  buildGoalPreviewUrl,
  buildGoalUrl,
  DEFAULT_BITS_GOAL_SETTINGS,
  DEFAULT_GOAL_SETTINGS,
  GOAL_COLORS,
  GOAL_ENDS,
  type GoalEnd,
  type GoalSettings,
  type GoalStyle,
  type GoalType,
  goalUrlType,
  ICON_MAX_LENGTH,
  MAX_END_HOLD_SECONDS,
  MAX_GOAL_COUNT,
  parseGoalUrl,
  TITLE_MAX_LENGTH,
} from '#/lib/goal-url';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getWidget, type WidgetId } from '#/lib/widgets';
import { goalCommand } from './goal-count';
import { PREVIEW_CHANNEL, type PreviewMessage } from './use-goal';

/** What the Sub Goal's and the Bits & Kicks Goal's setup pages say and do differently. */
interface GoalVariant {
  widgetId: WidgetId;
  /** The amounts the chat commands card shows in its examples. */
  examples: { add: number; remove: number; set: number };
  copy: {
    title: TranslationKey;
    intro: TranslationKey;
    startTip: TranslationKey;
    countsHint: TranslationKey;
    iconTip: TranslationKey;
    iconPlaceholder: TranslationKey;
    showPops: TranslationKey;
    showPopsTip: TranslationKey;
    commandsIntro: TranslationKey;
    cmdAdd: TranslationKey;
    cmdRemove: TranslationKey;
    previewTitle: TranslationKey;
    previewIframeTitle: TranslationKey;
    previewHint: TranslationKey;
    widgetUrlInvalid: TranslationKey;
    /** For a pasted URL of the other goal type. */
    otherTypeUrl: TranslationKey;
    guideSteps: readonly TranslationKey[];
  };
}

const VARIANTS: Record<GoalType, GoalVariant> = {
  subs: {
    widgetId: 'goal',
    examples: { add: 3, remove: 1, set: 25 },
    copy: {
      title: 'goal.title',
      intro: 'goal.intro',
      startTip: 'goal.startTip',
      countsHint: 'goal.countsHint',
      iconTip: 'goal.iconTip',
      iconPlaceholder: 'goal.iconPlaceholder',
      showPops: 'goal.showPops',
      showPopsTip: 'goal.showPopsTip',
      commandsIntro: 'goal.commandsIntro',
      cmdAdd: 'goal.cmdAdd',
      cmdRemove: 'goal.cmdRemove',
      previewTitle: 'goal.previewTitle',
      previewIframeTitle: 'goal.previewIframeTitle',
      previewHint: 'goal.previewHint',
      widgetUrlInvalid: 'goal.widgetUrlInvalid',
      otherTypeUrl: 'bitsGoal.bitsGoalUrl',
      guideSteps: ['goal.guideStep1', 'goal.guideStep2', 'goal.guideStep3', 'goal.guideStep4'],
    },
  },
  bits: {
    widgetId: 'bits-goal',
    examples: { add: 500, remove: 100, set: 2500 },
    copy: {
      title: 'bitsGoal.title',
      intro: 'bitsGoal.intro',
      startTip: 'bitsGoal.startTip',
      countsHint: 'bitsGoal.countsHint',
      iconTip: 'bitsGoal.iconTip',
      iconPlaceholder: 'bitsGoal.iconPlaceholder',
      showPops: 'bitsGoal.showPops',
      showPopsTip: 'bitsGoal.showPopsTip',
      commandsIntro: 'bitsGoal.commandsIntro',
      cmdAdd: 'bitsGoal.cmdAdd',
      cmdRemove: 'bitsGoal.cmdRemove',
      previewTitle: 'bitsGoal.previewTitle',
      previewIframeTitle: 'bitsGoal.previewIframeTitle',
      previewHint: 'bitsGoal.previewHint',
      widgetUrlInvalid: 'bitsGoal.widgetUrlInvalid',
      otherTypeUrl: 'bitsGoal.subGoalUrl',
      guideSteps: [
        'goal.guideStep1',
        'bitsGoal.guideStep2',
        'goal.guideStep3',
        'bitsGoal.guideStep4',
      ],
    },
  },
};

/** The test cheers: 100 and 500, as Bits on Twitch and Kicks on Kick. */
const TEST_CHEERS = [100, 500] as const;

/**
 * The setup page of a goal: the Sub Goal's, or the Bits & Kicks Goal's on the same overlay. Both
 * pages are this one; the copy, commands and test buttons follow `type`.
 */
export function GoalSetup({ type, faq }: { type: GoalType; faq: readonly FaqEntry[] }) {
  const { t } = useI18n();
  const variant = VARIANTS[type];
  const { copy } = variant;
  const command = goalCommand(type);
  const widget = getWidget(variant.widgetId);
  // sourceSize is only null for tools; the fallback just satisfies the type.
  const canvas = widget.sourceSize ?? { width: 800, height: 260 };
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  // A Bits & Kicks Goal's title starts in the page's language; the Sub Goal keeps its own.
  const [settings, setSettings] = useState<GoalSettings>(() =>
    type === 'bits'
      ? { ...DEFAULT_BITS_GOAL_SETTINGS, title: t('bitsGoal.defaultTitle') }
      : DEFAULT_GOAL_SETTINGS,
  );
  // Whether the text pasted last is the other goal type's URL, which gets its own message.
  const [pastedOtherType, setPastedOtherType] = useState(false);
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const nextPlatform = useRef<SubathonPlatform>('twitch');
  const id = useId();

  const update = <K extends keyof GoalSettings>(key: K, value: GoalSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));

  // The channel's own emotes for the picker, reloaded a moment after the channel boxes settle.
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

  const sendEvent = (event: SubathonEvent) => send({ type: 'event', event });

  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted ? buildGoalUrl(origin, settings, twitchChannel, kickChannel) : '';
  const previewUrl = mounted ? buildGoalPreviewUrl(origin, settings, previewId) : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseGoalUrl(text, type);
    if (!parsed) {
      const pastedType = goalUrlType(text);
      setPastedOtherType(pastedType !== null && pastedType !== type);
      return false;
    }
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  const countField = (key: 'start' | 'target', label: TranslationKey, tip: TranslationKey) => (
    <div>
      <FieldLabel htmlFor={`${id}-${key}`} tip={t(tip)}>
        {t(label)}
      </FieldLabel>
      <CountField
        id={`${id}-${key}`}
        value={settings[key]}
        onChange={(value) => update(key, value)}
        min={key === 'target' ? 1 : 0}
        max={MAX_GOAL_COUNT}
      />
    </div>
  );

  const styleOptions: SegmentedOption<GoalStyle>[] = [
    { value: 'bar', label: t('goal.styleBar') },
    { value: 'thin', label: t('goal.styleThin') },
  ];

  const endOptions: SegmentedOption<GoalEnd>[] = GOAL_ENDS.map((end) => ({
    value: end,
    label: t(`goal.ends.${end}`),
  }));

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

      <SettingsGroup title={t('goal.sectionGoal')}>
        <div className="grid gap-3 sm:grid-cols-2">
          {countField('start', 'goal.start', copy.startTip)}
          {countField('target', 'goal.target', 'goal.targetTip')}
        </div>
        <p className={`${HINT_CLASS} mt-0`}>{t(copy.countsHint)}</p>
        <div>
          <FieldLabel id={`${id}-end`} tip={t('goal.endTip')}>
            {t('goal.end')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-end`}
            value={settings.end}
            onChange={(value) => update('end', value)}
            options={endOptions}
          />
        </div>
        {settings.end === 'hide' && (
          <div>
            <FieldLabel id={`${id}-endHold`} tip={t('goal.endHoldTip')}>
              {t('goal.endHold')}
            </FieldLabel>
            <DurationField
              labelledBy={`${id}-endHold`}
              value={settings.endHold}
              onChange={(value) => update('endHold', value)}
              units={['m', 's']}
              unitLabels={[t('goal.unitMinutes'), t('goal.unitSeconds')]}
              max={MAX_END_HOLD_SECONDS}
            />
            {settings.endHold === 0 && <p className={HINT_CLASS}>{t('goal.endHoldOff')}</p>}
          </div>
        )}
      </SettingsGroup>

      <SettingsGroup title={t('common.sectionAppearance')}>
        <PresetField value={settings.preset} onChange={(value) => update('preset', value)} />
        <div>
          <FieldLabel id={`${id}-style`} tip={t('goal.styleTip')}>
            {t('goal.style')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-style`}
            value={settings.style}
            onChange={(value) => update('style', value)}
            options={styleOptions}
          />
        </div>
        {isClassic(settings.preset) && (
          <div>
            <FieldLabel id={`${id}-color`}>{t('goal.color')}</FieldLabel>
            <ColorSwatches
              labelledBy={`${id}-color`}
              value={settings.color}
              onChange={(value) => update('color', value)}
              options={GOAL_COLORS.map((color) => ({
                value: color,
                label: t(`subathon.colors.${color}`),
                background: `hsl(${hueFor(color, 1)} 85% 52%)`,
              }))}
            />
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label={t('goal.titleLabel')}
            tip={t('goal.titleTip')}
            value={settings.title}
            onChange={(value) => update('title', value)}
            placeholder={t('goal.titlePlaceholder')}
            maxLength={TITLE_MAX_LENGTH}
            spellCheck={false}
          />
          <TextField
            label={t('goal.iconLabel')}
            tip={t(copy.iconTip)}
            value={settings.icon}
            onChange={(value) => update('icon', value)}
            placeholder={t(copy.iconPlaceholder)}
            maxLength={ICON_MAX_LENGTH}
          />
        </div>
        <div>
          <FieldLabel id={`${id}-emote`} tip={t('goal.emoteTip')}>
            {t('goal.emoteLabel')}
          </FieldLabel>
          {!twitchChannel.trim() && !kickChannel.trim() ? (
            <p className={HINT_CLASS}>{t('countdown.emoteNeedChannel')}</p>
          ) : emotesLoading || emotes === null ? (
            <EmotePicker
              labelledBy={`${id}-emote`}
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
              labelledBy={`${id}-emote`}
              emotes={emotes}
              value={emotes.some((emote) => emote.url === settings.iconUrl) ? settings.iconUrl : ''}
              onChange={(value) => update('iconUrl', value)}
            />
          )}
        </div>
        <div className="flex flex-col justify-end">
          <Switch
            label={t(copy.showPops)}
            tip={t(copy.showPopsTip)}
            checked={settings.pops}
            onChange={(value) => update('pops', value)}
          />
        </div>
      </SettingsGroup>
    </>
  );

  // With both platforms on, test subs take turns, so both platforms' pops get shown.
  const testPlatform = (): SubathonPlatform => {
    if (settings.platforms !== 'both') return settings.platforms === 'kick' ? 'kick' : 'twitch';
    const platform = nextPlatform.current;
    nextPlatform.current = platform === 'twitch' ? 'kick' : 'twitch';
    return platform;
  };
  const name = t('goal.testViewer');
  const mod = (text: string): SubathonEvent => ({ kind: 'mod', platform: 'twitch', text });
  // A cheer is Bits on Twitch and Kicks on Kick: with both platforms on, one of each.
  const cheerPlatforms: SubathonPlatform[] =
    settings.platforms === 'kick'
      ? ['kick', 'kick']
      : settings.platforms === 'both'
        ? ['twitch', 'kick']
        : ['twitch', 'twitch'];
  const supportButtons: { label: string; event: () => SubathonEvent }[] =
    type === 'bits'
      ? TEST_CHEERS.map((amount, index) => {
          const platform = cheerPlatforms[index];
          return {
            label: t(platform === 'kick' ? 'bitsGoal.testKicks' : 'bitsGoal.testCheer', {
              count: amount,
            }),
            event: () => ({ kind: 'bits', platform, name, amount }),
          };
        })
      : [
          {
            label: t('goal.testSub'),
            event: () => ({ kind: 'sub', platform: testPlatform(), name, tier: 1 }),
          },
          {
            label: t('goal.testGift'),
            event: () => ({ kind: 'gift', platform: testPlatform(), name, count: 5, tier: 1 }),
          },
        ];
  const testButtons: { label: string; event: () => SubathonEvent }[] = [
    ...supportButtons,
    { label: t('goal.testReach'), event: () => mod(`${command} set ${settings.target}`) },
    { label: t('goal.testReset'), event: () => mod(`${command} reset`) },
  ];

  const commands = (
    <ChatCommandsCard
      title={t('goal.sectionCommands')}
      intro={t(copy.commandsIntro)}
      commands={[
        { usage: `${command} add ${variant.examples.add}`, action: t(copy.cmdAdd) },
        { usage: `${command} remove ${variant.examples.remove}`, action: t(copy.cmdRemove) },
        { usage: `${command} set ${variant.examples.set}`, action: t('goal.cmdSet') },
        { usage: `${command} reset`, action: t('goal.cmdReset') },
      ]}
    />
  );

  return (
    <SetupShell
      widgetId={widget.id}
      title={t(copy.title)}
      settings={settingsPanel}
      previewTitle={t(copy.previewTitle)}
      previewTip={t(copy.previewHint)}
      // A 16:9 box, like a stream frame, so the band the +1 pops rise into shows too.
      previewAspect={16 / 9}
      preview={<PreviewFrame src={previewUrl} title={t(copy.previewIframeTitle)} canvas={canvas} />}
      previewFooter={
        <TestButtons
          title={t('goal.testTitle')}
          layout="two-four"
          buttons={testButtons.map(({ label, event }) => ({
            label,
            onClick: () => sendEvent(event()),
          }))}
        />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('goal.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('goal.browserSourceHintSize')}`}
          sourceSize={widget.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('goal.widgetUrlPlaceholder')}
          invalidMessage={t(pastedOtherType ? copy.otherTypeUrl : copy.widgetUrlInvalid)}
        />
      }
      intro={t(copy.intro)}
      aboutExtra={commands}
      guideTitle={t('goal.guideTitle')}
      guideSteps={copy.guideSteps}
      faq={faq}
    />
  );
}
