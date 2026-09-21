import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useId, useRef, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { ChatCommandsCard } from '#/components/chat-commands-card';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { TestButtons } from '#/components/test-buttons';
import { ColorSwatches } from '#/components/ui/color-swatches';
import { CountField } from '#/components/ui/count-field';
import { FieldLabel } from '#/components/ui/field-label';
import {
  SegmentedControl,
  type SegmentedOption,
} from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS, TextField } from '#/components/ui/text-field';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import { COMMAND } from '#/features/widgets/goal/goal-count';
import { PREVIEW_CHANNEL, type PreviewMessage } from '#/features/widgets/goal/use-goal';
import type { SubathonEvent, SubathonPlatform } from '#/features/widgets/subathon/subathon-events';
import { hueFor } from '#/features/widgets/overlay-style';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import {
  buildGoalPreviewUrl,
  buildGoalUrl,
  DEFAULT_GOAL_SETTINGS,
  GOAL_COLORS,
  type GoalSettings,
  type GoalStyle,
  MAX_GOAL_COUNT,
  parseGoalUrl,
  TITLE_MAX_LENGTH,
} from '#/lib/goal-url';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/sub-goal')({
  head: ({ params }) =>
    getSetupPageHead('goal', getParamsLocale(params), {
      breadcrumb: 'goal.breadcrumb',
      faq: FAQ,
    }),
  component: GoalSetup,
});

const WIDGET = getWidget('goal');
// sourceSize is only null for tools; the fallback just satisfies the type.
const CANVAS = WIDGET.sourceSize ?? { width: 800, height: 260 };

const FAQ: FaqEntry[] = [
  ['goal.faq1Q', 'goal.faq1A'],
  ['goal.faq2Q', 'goal.faq2A'],
  ['goal.faq3Q', 'goal.faq3A'],
  ['goal.faq4Q', 'goal.faq4A'],
];

const COMMANDS: { usage: string; action: TranslationKey }[] = [
  { usage: `${COMMAND} add 3`, action: 'goal.cmdAdd' },
  { usage: `${COMMAND} remove 1`, action: 'goal.cmdRemove' },
  { usage: `${COMMAND} set 25`, action: 'goal.cmdSet' },
  { usage: `${COMMAND} reset`, action: 'goal.cmdReset' },
];

function GoalSetup() {
  const { t } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  const [settings, setSettings] = useState(DEFAULT_GOAL_SETTINGS);
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const nextPlatform = useRef<SubathonPlatform>('twitch');
  const id = useId();

  const update = <K extends keyof GoalSettings>(key: K, value: GoalSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));

  const sendEvent = (event: SubathonEvent) => send({ type: 'event', event });

  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted ? buildGoalUrl(origin, settings, twitchChannel, kickChannel) : '';
  const previewUrl = mounted ? buildGoalPreviewUrl(origin, settings, previewId) : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseGoalUrl(text);
    if (!parsed) return false;
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
          {countField('start', 'goal.start', 'goal.startTip')}
          {countField('target', 'goal.target', 'goal.targetTip')}
        </div>
        <p className={`${HINT_CLASS} mt-0`}>{t('goal.countsHint')}</p>
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
          <div className="flex flex-col justify-end">
            <Switch
              label={t('goal.showPops')}
              tip={t('goal.showPopsTip')}
              checked={settings.pops}
              onChange={(value) => update('pops', value)}
            />
          </div>
        </div>
      </SettingsGroup>
    </>
  );

  // With both platforms on, test subs take turns, so both platforms' pops get shown.
  const testPlatform = (): SubathonPlatform => {
    if (settings.platforms !== 'both') return settings.platforms;
    const platform = nextPlatform.current;
    nextPlatform.current = platform === 'twitch' ? 'kick' : 'twitch';
    return platform;
  };
  const name = t('goal.testViewer');
  const mod = (text: string): SubathonEvent => ({ kind: 'mod', platform: 'twitch', text });
  const testButtons: { label: string; event: () => SubathonEvent }[] = [
    {
      label: t('goal.testSub'),
      event: () => ({ kind: 'sub', platform: testPlatform(), name, tier: 1 }),
    },
    {
      label: t('goal.testGift'),
      event: () => ({ kind: 'gift', platform: testPlatform(), name, count: 5, tier: 1 }),
    },
    { label: t('goal.testReach'), event: () => mod(`${COMMAND} set ${settings.target}`) },
    { label: t('goal.testReset'), event: () => mod(`${COMMAND} reset`) },
  ];

  const commands = (
    <ChatCommandsCard
      title={t('goal.sectionCommands')}
      intro={t('goal.commandsIntro')}
      commands={COMMANDS.map((command) => ({ usage: command.usage, action: t(command.action) }))}
    />
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('goal.title')}
      settings={settingsPanel}
      previewTitle={t('goal.previewTitle')}
      previewTip={t('goal.previewHint')}
      // A 16:9 box, like a stream frame, so the band the +1 pops rise into shows too.
      previewAspect={16 / 9}
      preview={
        <PreviewFrame src={previewUrl} title={t('goal.previewIframeTitle')} canvas={CANVAS} />
      }
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
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('goal.widgetUrlPlaceholder')}
          invalidMessage={t('goal.widgetUrlInvalid')}
        />
      }
      intro={t('goal.intro')}
      aboutExtra={commands}
      guideTitle={t('goal.guideTitle')}
      guideSteps={['goal.guideStep1', 'goal.guideStep2', 'goal.guideStep3', 'goal.guideStep4']}
      faq={FAQ}
    />
  );
}
