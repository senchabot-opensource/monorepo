import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useId, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { CopyUrlField } from '#/components/copy-url-field';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { FieldLabel } from '#/components/ui/field-label';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { Select, type SelectOption } from '#/components/ui/select';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { YoutubeTutorial } from '#/components/youtube-tutorial';
import {
  PLANT_IDS,
  PLANT_REGISTRY,
  type PlantId,
} from '#/features/widgets/sub-sprout/plants/registry';
import type { WaterEffectType } from '#/features/widgets/sub-sprout/water/watering-fx';
import { useI18n } from '#/lib/i18n';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';
import {
  buildSubSproutPreviewUrl,
  buildSubSproutUrl,
  DEFAULT_SUB_SPROUT_SETTINGS,
  type PickMode,
  parseSubSproutUrl,
  type SubSproutSettings,
} from '#/lib/sub-sprout-url';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/sub-growing-plant')({
  head: () => getSetupPageHead('sub-sprout', { breadcrumb: 'subSprout.breadcrumb', faq: FAQ }),
  component: SubSproutSetup,
});

const WIDGET = getWidget('sub-sprout');
// sourceSize is only null for tools; the fallback just satisfies the type.
const CANVAS = WIDGET.sourceSize ?? { width: 800, height: 600 };

const FAQ: FaqEntry[] = [
  ['subSprout.faq1Q', 'subSprout.faq1A'],
  ['subSprout.faq2Q', 'subSprout.faq2A'],
];

function SubSproutSetup() {
  const { t } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  const [settings, setSettings] = useState(DEFAULT_SUB_SPROUT_SETTINGS);
  const [mounted, setMounted] = useState(false);
  const id = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const update = <K extends keyof SubSproutSettings>(key: K, value: SubSproutSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted ? buildSubSproutUrl(origin, settings, twitchChannel, kickChannel) : '';
  const previewUrl = mounted ? buildSubSproutPreviewUrl(origin, settings) : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseSubSproutUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    return true;
  };

  // The vine renders its own overlay without water or a pot. With In Order or Random the next
  // plant is never the vine, so both settings still apply there.
  const vineOnly = settings.variety === 'vine' && settings.pick === 'fixed';

  const varietyOptions: SelectOption<PlantId>[] = PLANT_IDS.map((plant) => ({
    value: plant,
    label: t(`plants.${plant}`),
    hint: t('subSprout.stagesSuffix', { stages: PLANT_REGISTRY[plant].stages }),
  }));
  const pickOptions: SegmentedOption<PickMode>[] = [
    { value: 'fixed', label: t('subSprout.fixed') },
    { value: 'cycle', label: t('subSprout.cycle') },
    { value: 'random', label: t('subSprout.random') },
  ];
  const waterOptions: SelectOption<WaterEffectType>[] = [
    { value: 'off', label: t('plants.waterOff') },
    { value: 'rain', label: t('plants.waterRain') },
    { value: 'sparkle', label: t('plants.waterSparkle') },
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

      <SettingsGroup title={t('subSprout.sectionPlant')}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel id={`${id}-variety`} tip={t('subSprout.plantVarietyTip')}>
              {t('subSprout.plantVariety')}
            </FieldLabel>
            <Select
              labelledBy={`${id}-variety`}
              value={settings.variety}
              onChange={(value) => update('variety', value)}
              options={varietyOptions}
            />
          </div>
          <div>
            <FieldLabel id={`${id}-water`} tip={t('subSprout.wateringEffectTip')}>
              {t('subSprout.wateringEffect')}
            </FieldLabel>
            <Select
              labelledBy={`${id}-water`}
              disabled={vineOnly}
              value={settings.water}
              onChange={(value) => update('water', value)}
              options={waterOptions}
            />
          </div>
        </div>
        <div>
          <FieldLabel id={`${id}-pick`} tip={t('subSprout.selectionModeTip')}>
            {t('subSprout.selectionMode')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-pick`}
            value={settings.pick}
            onChange={(value) => update('pick', value)}
            options={pickOptions}
          />
        </div>
        <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          <Switch
            label={t('subSprout.showSubCountEffect')}
            tip={t('subSprout.subCountTip')}
            checked={settings.countFx}
            onChange={(value) => update('countFx', value)}
          />
          <Switch
            label={t('subSprout.showPotLabel')}
            tip={t('subSprout.potLabelTip')}
            disabled={vineOnly}
            checked={settings.potLabel}
            onChange={(value) => update('potLabel', value)}
          />
        </div>
      </SettingsGroup>
    </>
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('subSprout.title')}
      settings={settingsPanel}
      previewTitle={t('subSprout.previewTitle')}
      previewAspect={CANVAS.width / CANVAS.height}
      preview={
        <PreviewFrame
          src={previewUrl}
          title={t('subSprout.previewIframeTitle')}
          canvas={CANVAS}
          motionSafe
        />
      }
      previewFooter={
        <p className="text-xs leading-relaxed text-zinc-500">{t('subSprout.previewHint')}</p>
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('subSprout.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('subSprout.browserSourceHintSize')}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('subSprout.widgetUrlPlaceholder')}
          invalidMessage={t('subSprout.widgetUrlInvalid')}
        />
      }
      intro={t('subSprout.intro')}
      aboutExtra={<YoutubeTutorial url="https://youtu.be/P0Btpez9Znw" />}
      guideTitle={t('subSprout.guideTitle')}
      guideSteps={[
        'subSprout.guideStep1',
        'subSprout.guideStep2',
        'subSprout.guideStep3',
        'subSprout.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
