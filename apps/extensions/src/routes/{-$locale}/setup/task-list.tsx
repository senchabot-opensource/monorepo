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
import { RangeField } from '#/components/ui/range-field';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { TextField } from '#/components/ui/text-field';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import { hueFor } from '#/features/widgets/overlay-style';
import {
  ADD_COMMAND,
  DONE_COMMAND,
  EDIT_COMMAND,
  MOD_COMMAND,
  REMOVE_COMMAND,
} from '#/features/widgets/tasks/tasks-state';
import { PREVIEW_CHANNEL, type PreviewMessage } from '#/features/widgets/tasks/use-tasks';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import { useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import {
  buildTasksPreviewUrl,
  buildTasksUrl,
  DEFAULT_TASKS_SETTINGS,
  MAX_OPEN,
  MAX_SPEED,
  MIN_SPEED,
  parseTasksUrl,
  TASKS_COLORS,
  TASKS_STAGE,
  type TasksSettings,
  TITLE_MAX_LENGTH,
} from '#/lib/tasks-url';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/task-list')({
  head: ({ params }) =>
    getSetupPageHead('tasks', getParamsLocale(params), {
      breadcrumb: 'tasks.breadcrumb',
      faq: FAQ,
    }),
  component: TasksSetup,
});

const WIDGET = getWidget('tasks');

const FAQ: FaqEntry[] = [
  ['tasks.faq1Q', 'tasks.faq1A'],
  ['tasks.faq2Q', 'tasks.faq2A'],
  ['tasks.faq3Q', 'tasks.faq3A'],
  ['tasks.faq4Q', 'tasks.faq4A'],
];

function TasksSetup() {
  const { t, locale } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  // The title starts in the page's language; it's always written to the URL.
  const [settings, setSettings] = useState<TasksSettings>(() => ({
    ...DEFAULT_TASKS_SETTINGS,
    title: t('tasks.defaultTitle'),
  }));
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const testTasks = useRef(0);
  const id = useId();

  const update = <K extends keyof TasksSettings>(key: K, value: TasksSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));

  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted
    ? buildTasksUrl(origin, settings, twitchChannel, kickChannel, locale)
    : '';
  const previewUrl = mounted ? buildTasksPreviewUrl(origin, settings, locale, previewId) : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseTasksUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  const listTab = (
    <SettingsGroup title={t('tasks.sectionList')} hideTitle>
      <TextField
        label={t('common.setup.titleLabel')}
        tip={t('tasks.titleTip')}
        value={settings.title}
        onChange={(value) => update('title', value)}
        placeholder={t('goal.titlePlaceholder')}
        maxLength={TITLE_MAX_LENGTH}
        spellCheck={false}
      />
      <div>
        <FieldLabel htmlFor={`${id}-max`} tip={t('tasks.maxTip')}>
          {t('tasks.max')}
        </FieldLabel>
        <CountField
          id={`${id}-max`}
          value={settings.max}
          onChange={(value) => update('max', value)}
          min={1}
          max={MAX_OPEN}
        />
      </div>
      <Switch
        label={t('tasks.keepDone')}
        tip={t('tasks.keepDoneTip')}
        checked={settings.keepDone}
        onChange={(value) => update('keepDone', value)}
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
            options={TASKS_COLORS.map((color) => ({
              value: color,
              label: t(`subathon.colors.${color}`),
              background: `hsl(${hueFor(color, 1)} 85% 52%)`,
            }))}
          />
        </div>
      )}
      <RangeField
        label={t('tasks.speed')}
        tip={t('tasks.speedTip')}
        min={MIN_SPEED}
        max={MAX_SPEED}
        step={5}
        value={settings.speed}
        onChange={(value) => update('speed', Number(value))}
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
    </SettingsGroup>
  );

  const viewer = t('goal.testViewer');
  const chat =
    (text: string, mod = false) =>
    () =>
      send({ type: 'chat', text, name: viewer, mod });
  const testButtons = [
    {
      label: t('tasks.testAdd'),
      onClick: () => {
        testTasks.current += 1;
        chat(`${ADD_COMMAND} ${t('tasks.testTask', { n: testTasks.current })}`)();
      },
    },
    { label: t('tasks.testDone'), onClick: chat(DONE_COMMAND) },
    { label: t('tasks.testRemove'), onClick: chat(REMOVE_COMMAND) },
    { label: t('tasks.testClear'), onClick: chat(`${MOD_COMMAND} clear`, true) },
  ];

  const example = t('tasks.cmdExample');
  const commands = [
    { usage: `${ADD_COMMAND} ${example}`, action: t('tasks.cmdAdd') },
    { usage: DONE_COMMAND, action: t('tasks.cmdDone') },
    { usage: `${DONE_COMMAND} 2`, action: t('tasks.cmdDoneNumber') },
    { usage: `${EDIT_COMMAND} ${example}`, action: t('tasks.cmdEdit') },
    { usage: REMOVE_COMMAND, action: t('tasks.cmdRemove') },
    { usage: `${MOD_COMMAND} cleardone`, action: t('tasks.cmdClearDone') },
    { usage: `${MOD_COMMAND} remove name`, action: t('tasks.cmdRemoveViewer') },
    { usage: `${MOD_COMMAND} clear`, action: t('tasks.cmdClear') },
  ];

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('tasks.title')}
      settingsPinned={channelGroup}
      settingsTabs={[
        { id: 'list', label: t('tasks.sectionList'), content: listTab },
        { id: 'appearance', label: t('common.sectionAppearance'), content: appearanceTab },
      ]}
      previewTitle={t('tasks.previewTitle')}
      previewTip={t('tasks.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame src={previewUrl} title={t('tasks.previewIframeTitle')} canvas={TASKS_STAGE} />
      }
      previewFooter={
        <TestButtons title={t('common.setup.testTitle')} layout="two-four" buttons={testButtons} />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('common.setup.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('common.setup.sizeHint', TASKS_STAGE)}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('common.setup.widgetUrlPlaceholder')}
          invalidMessage={t('common.setup.widgetUrlInvalid', { name: t(WIDGET.nameKey) })}
        />
      }
      intro={t('tasks.intro')}
      aboutExtra={
        <ChatCommandsCard
          title={t('tasks.sectionCommands')}
          intro={t('tasks.commandsIntro')}
          commands={commands}
        />
      }
      guideTitle={t('common.setup.guideTitle')}
      guideSteps={[
        'common.setup.guideAddSource',
        'common.setup.guidePaste',
        'tasks.guideStep3',
        'tasks.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
