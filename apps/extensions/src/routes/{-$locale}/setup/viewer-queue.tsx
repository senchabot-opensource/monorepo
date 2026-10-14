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
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { HINT_CLASS, TextField } from '#/components/ui/text-field';
import { PresetField } from '#/features/presets/preset-field';
import { isClassic } from '#/features/presets/registry';
import { useStartOnSitePreset } from '#/features/presets/site-preset';
import { hueFor } from '#/features/widgets/overlay-style';
import { COMMAND, LEAVE_COMMAND, NEXT_COMMAND } from '#/features/widgets/queue/queue-state';
import { PREVIEW_CHANNEL, type PreviewMessage } from '#/features/widgets/queue/use-queue';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import { useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import {
  buildQueuePreviewUrl,
  buildQueueUrl,
  DEFAULT_QUEUE_SETTINGS,
  JOIN_MAX_LENGTH,
  MAX_GROUP,
  MAX_QUEUE,
  MAX_ROWS,
  MIN_ROWS,
  normalizeJoin,
  parseQueueUrl,
  QUEUE_COLORS,
  type QueueSettings,
  queueStage,
  TITLE_MAX_LENGTH,
} from '#/lib/queue-url';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/viewer-queue')({
  head: ({ params }) =>
    getSetupPageHead('queue', getParamsLocale(params), {
      breadcrumb: 'queue.breadcrumb',
      faq: FAQ,
    }),
  component: QueueSetup,
});

const WIDGET = getWidget('queue');

const FAQ: FaqEntry[] = [
  ['queue.faq1Q', 'queue.faq1A'],
  ['queue.faq2Q', 'queue.faq2A'],
  ['queue.faq3Q', 'queue.faq3A'],
  ['queue.faq4Q', 'queue.faq4A'],
];

function QueueSetup() {
  const { t, locale } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  // The title starts in the page's language; it's always written to the URL.
  const [settings, setSettings] = useState<QueueSettings>(() => ({
    ...DEFAULT_QUEUE_SETTINGS,
    title: t('queue.defaultTitle'),
  }));
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const testViewers = useRef(0);
  const id = useId();

  const update = <K extends keyof QueueSettings>(key: K, value: QueueSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));
  useStartOnSitePreset((preset) => update('preset', preset));

  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted
    ? buildQueueUrl(origin, settings, twitchChannel, kickChannel, locale)
    : '';
  const previewUrl = mounted ? buildQueuePreviewUrl(origin, settings, locale, previewId) : '';
  const join = normalizeJoin(settings.join) || DEFAULT_QUEUE_SETTINGS.join;

  const stage = queueStage(settings.rows);

  const applyWidgetUrl = (text: string) => {
    const parsed = parseQueueUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  const countField = (
    key: 'max' | 'group' | 'rows',
    label: string,
    tip: string,
    min: number,
    max: number,
  ) => (
    <div>
      <FieldLabel htmlFor={`${id}-${key}`} tip={tip}>
        {label}
      </FieldLabel>
      <CountField
        id={`${id}-${key}`}
        value={settings[key]}
        onChange={(value) => update(key, value)}
        min={min}
        max={max}
      />
    </div>
  );

  const queueTab = (
    <SettingsGroup title={t('queue.sectionQueue')} hideTitle>
      <TextField
        label={t('common.setup.titleLabel')}
        tip={t('queue.titleTip')}
        value={settings.title}
        onChange={(value) => update('title', value)}
        placeholder={t('goal.titlePlaceholder')}
        maxLength={TITLE_MAX_LENGTH}
        spellCheck={false}
      />
      <TextField
        label={t('queue.join')}
        tip={t('queue.joinTip')}
        hint={t('queue.joinHint', { join })}
        value={settings.join}
        onChange={(value) => update('join', value.trim().split(/\s+/)[0] ?? '')}
        placeholder={DEFAULT_QUEUE_SETTINGS.join}
        maxLength={JOIN_MAX_LENGTH}
        autoComplete="off"
        spellCheck={false}
      />
      <Switch
        label={t('queue.subsOnly')}
        tip={t('queue.subsOnlyTip')}
        checked={settings.subsOnly}
        onChange={(value) => update('subsOnly', value)}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {countField('group', t('queue.group'), t('queue.groupTip'), 1, MAX_GROUP)}
        {countField('max', t('queue.max'), t('queue.maxTip'), 0, MAX_QUEUE)}
      </div>
      {settings.max === 0 && <p className={`${HINT_CLASS} mt-0`}>{t('queue.maxOff')}</p>}
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
            options={QUEUE_COLORS.map((color) => ({
              value: color,
              label: t(`subathon.colors.${color}`),
              background: `hsl(${hueFor(color, 1)} 85% 52%)`,
            }))}
          />
        </div>
      )}
      {countField('rows', t('queue.rows'), t('queue.rowsTip'), MIN_ROWS, MAX_ROWS)}
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

  const chat =
    (text: string, mod: boolean, name = 'Mod') =>
    () =>
      send({ type: 'chat', text, mod, name });
  const testButtons = [
    {
      label: t('queue.testJoin'),
      onClick: () => {
        testViewers.current += 1;
        send({
          type: 'chat',
          text: join,
          mod: false,
          name: `${t('goal.testViewer')}${testViewers.current}`,
        });
      },
    },
    { label: t('queue.testNext'), onClick: chat(NEXT_COMMAND, true) },
    { label: t('queue.testOpen'), onClick: chat(`${COMMAND} open`, true) },
    { label: t('queue.testClose'), onClick: chat(`${COMMAND} close`, true) },
    { label: t('queue.testClear'), onClick: chat(`${COMMAND} clear`, true) },
  ];

  const commands = [
    { usage: `${join} ${t('queue.cmdNoteExample')}`, action: t('queue.cmdJoin') },
    { usage: LEAVE_COMMAND, action: t('queue.cmdLeave') },
    { usage: NEXT_COMMAND, action: t('queue.cmdNext') },
    { usage: `${NEXT_COMMAND} 3`, action: t('queue.cmdNextMany') },
    { usage: `${COMMAND} open`, action: t('queue.cmdOpen') },
    { usage: `${COMMAND} close`, action: t('queue.cmdClose') },
    { usage: `${COMMAND} remove name`, action: t('queue.cmdRemove') },
    { usage: `${COMMAND} clear`, action: t('queue.cmdClear') },
  ];

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('queue.title')}
      settingsPinned={channelGroup}
      settingsTabs={[
        { id: 'queue', label: t('queue.sectionQueue'), content: queueTab },
        { id: 'appearance', label: t('common.sectionAppearance'), content: appearanceTab },
      ]}
      previewTitle={t('queue.previewTitle')}
      previewTip={t('queue.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame src={previewUrl} title={t('queue.previewIframeTitle')} canvas={stage} />
      }
      previewFooter={
        <TestButtons title={t('common.setup.testTitle')} layout="two-four" buttons={testButtons} />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('common.setup.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('common.setup.sizeHint', stage)}`}
          sourceSize={stage}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('common.setup.widgetUrlPlaceholder')}
          invalidMessage={t('common.setup.widgetUrlInvalid', { name: t(WIDGET.nameKey) })}
        />
      }
      intro={t('queue.intro')}
      aboutExtra={
        <ChatCommandsCard
          title={t('queue.sectionCommands')}
          intro={t('queue.commandsIntro')}
          commands={commands}
        />
      }
      guideTitle={t('common.setup.guideTitle')}
      guideSteps={[
        'common.setup.guideAddSource',
        'common.setup.guidePaste',
        'queue.guideStep3',
        'queue.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
