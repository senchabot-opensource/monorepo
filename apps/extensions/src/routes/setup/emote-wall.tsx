import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useId, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { FieldLabel } from '#/components/ui/field-label';
import { NumberField } from '#/components/ui/number-field';
import { RangeField } from '#/components/ui/range-field';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import {
  buildEmoteWallParams,
  buildEmoteWallUrl,
  DEFAULT_EMOTE_WALL_OPTIONS,
  EMOTE_WALL_RANGES,
  type EmoteWallMode,
  type EmoteWallUrlOptions,
  parseEmoteWallUrl,
} from '#/features/widgets/emote-wall/widget-url';
import { useI18n } from '#/lib/i18n';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/setup/emote-wall')({
  head: () => getSetupPageHead('emote-wall', { breadcrumb: 'emoteWallSetup.breadcrumb', faq: FAQ }),
  component: EmoteWallSetup,
});

const WIDGET = getWidget('emote-wall');
// sourceSize is only null for tools; the fallback just satisfies the type.
const CANVAS = WIDGET.sourceSize ?? { width: 1920, height: 1080 };

const FAQ: FaqEntry[] = [
  ['emoteWallSetup.faq1Q', 'emoteWallSetup.faq1A'],
  ['emoteWallSetup.faq2Q', 'emoteWallSetup.faq2A'],
];

function EmoteWallSetup() {
  const { t } = useI18n();
  const [options, setOptions] = useState(DEFAULT_EMOTE_WALL_OPTIONS);
  const [mounted, setMounted] = useState(false);
  const id = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const update = <K extends keyof EmoteWallUrlOptions>(key: K, value: EmoteWallUrlOptions[K]) =>
    setOptions((current) => ({ ...current, [key]: value }));

  // Gated on mount so the prerendered input and the first client render agree.
  const widgetUrl = mounted ? buildEmoteWallUrl(window.location.origin, options) : '';
  // The mock preview never reads the channels, so leaving them out keeps typing from reloading it.
  const previewParams = buildEmoteWallParams({ ...options, twitch: '', kick: '' });
  previewParams.append('mock', 'true');
  const previewUrl = mounted ? `${window.location.origin}/widgets/emote-wall?${previewParams}` : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseEmoteWallUrl(text);
    if (!parsed) return false;
    setOptions(parsed);
    return true;
  };

  const modeOptions: SegmentedOption<EmoteWallMode>[] = [
    { value: 'calm', label: t('emoteWallSetup.modeCalm') },
    { value: 'chaos', label: t('emoteWallSetup.modeChaos') },
    { value: 'bounce', label: t('emoteWallSetup.modeBounce') },
  ];

  const settingsPanel = (
    <>
      <SettingsGroup title={t('common.sectionChannel')}>
        <ChannelFields
          platforms={options.platforms}
          onPlatformsChange={(value) => update('platforms', value)}
          twitch={options.twitch}
          onTwitchChange={(value) => update('twitch', value)}
          kick={options.kick}
          onKickChange={(value) => update('kick', value)}
          aside={
            // The widget loads 7TV from the Twitch channel only, so Kick alone has none.
            <div className="flex items-end sm:pb-1">
              <div className="w-full">
                <Switch
                  label={t('emoteWallSetup.sevenTvEmotes')}
                  tip={t('emoteWallSetup.sevenTvTip')}
                  checked={options.sevenTv}
                  onChange={(value) => update('sevenTv', value)}
                  disabled={options.platforms === 'kick'}
                />
              </div>
            </div>
          }
        />
      </SettingsGroup>

      <SettingsGroup title={t('emoteWallSetup.sectionAnimation')}>
        <div>
          <FieldLabel id={`${id}-mode`} tip={t('emoteWallSetup.modeTip')}>
            {t('emoteWallSetup.mode')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-mode`}
            value={options.mode}
            onChange={(value) => update('mode', value)}
            options={modeOptions}
          />
        </div>
        <RangeField
          label={t('emoteWallSetup.emoteSize')}
          min={EMOTE_WALL_RANGES.size.min}
          max={EMOTE_WALL_RANGES.size.max}
          step={8}
          value={options.size}
          onChange={(value) => update('size', value)}
          format={(value) => `${value}px`}
          readoutClassName="w-12"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel htmlFor={`${id}-duration`} tip={t('emoteWallSetup.durationTip')}>
              {t('emoteWallSetup.duration')}
            </FieldLabel>
            <NumberField
              id={`${id}-duration`}
              value={options.duration}
              onChange={(value) => update('duration', value)}
              min={EMOTE_WALL_RANGES.duration.min}
              max={EMOTE_WALL_RANGES.duration.max}
              fallback={EMOTE_WALL_RANGES.duration.fallback}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${id}-max`} tip={t('emoteWallSetup.maxEmotesTip')}>
              {t('emoteWallSetup.maxEmotes')}
            </FieldLabel>
            <NumberField
              id={`${id}-max`}
              value={options.max}
              onChange={(value) => update('max', value)}
              min={EMOTE_WALL_RANGES.max.min}
              max={EMOTE_WALL_RANGES.max.max}
              fallback={EMOTE_WALL_RANGES.max.fallback}
            />
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('emoteWallSetup.sectionFilters')}>
        <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          <Switch
            label={t('emoteWallSetup.subsOnly')}
            tip={t('emoteWallSetup.subsOnlyTip')}
            checked={options.subsOnly}
            onChange={(value) => update('subsOnly', value)}
          />
          <Switch
            label={t('emoteWallSetup.subDurationX2')}
            tip={t('emoteWallSetup.subDurationX2Tip')}
            checked={options.subDurationX2}
            onChange={(value) => update('subDurationX2', value)}
          />
          <Switch
            label={t('emoteWallSetup.showAllEmotes')}
            tip={t('emoteWallSetup.showAllEmotesTip')}
            checked={options.showAllEmotes}
            onChange={(value) => update('showAllEmotes', value)}
          />
          <Switch
            label={t('emoteWallSetup.hypeMode')}
            tip={t('emoteWallSetup.hypeModeTip')}
            checked={options.hypeMode}
            onChange={(value) => update('hypeMode', value)}
          />
          <Switch
            label={t('emoteWallSetup.spamBlock')}
            tip={t('emoteWallSetup.spamBlockTip')}
            checked={options.spamBlock}
            onChange={(value) => update('spamBlock', value)}
          />
        </div>
      </SettingsGroup>
    </>
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('emoteWallSetup.title')}
      settings={settingsPanel}
      previewTitle={t('emoteWallSetup.previewTitle')}
      previewAspect={CANVAS.width / CANVAS.height}
      preview={
        <PreviewFrame
          src={previewUrl}
          title={t('emoteWallSetup.previewIframeTitle')}
          canvas={CANVAS}
          motionSafe
        />
      }
      previewFooter={
        <p className="text-xs leading-relaxed text-zinc-500">{t('emoteWallSetup.previewHint')}</p>
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('emoteWallSetup.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('emoteWallSetup.browserSourceHintSize')}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('emoteWallSetup.widgetUrlPlaceholder')}
          invalidMessage={t('emoteWallSetup.widgetUrlInvalid')}
        />
      }
      intro={t('emoteWallSetup.intro')}
      guideTitle={t('emoteWallSetup.guideTitle')}
      guideSteps={[
        'emoteWallSetup.guideStep1',
        'emoteWallSetup.guideStep2',
        'emoteWallSetup.guideStep3',
      ]}
      faq={FAQ}
    />
  );
}
