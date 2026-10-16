import { createFileRoute, useHydrated } from '@tanstack/react-router';
import { useId, useRef, useState } from 'react';
import { ChannelFields } from '#/components/channel-fields';
import { ChatCommandsCard } from '#/components/chat-commands-card';
import { CopyUrlField } from '#/components/copy-url-field';
import { FollowConnection, useLinkedFollowToken } from '#/components/follow-connection';
import { PreviewFrame } from '#/components/preview-frame';
import { SetupShell } from '#/components/setup-shell';
import { TestButtons } from '#/components/test-buttons';
import { CountField } from '#/components/ui/count-field';
import { FieldLabel } from '#/components/ui/field-label';
import { RangeField } from '#/components/ui/range-field';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { Select, type SelectOption } from '#/components/ui/select';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { Tabs } from '#/components/ui/tabs';
import { HINT_CLASS } from '#/components/ui/text-field';
import { TimeZoneSelect } from '#/components/ui/time-zone-select';
import { MAP_SUBCOMMAND } from '#/features/widgets/irl-hud/hud-map';
import { BUY_SUBCOMMAND } from '#/features/widgets/irl-hud/hud-market';
import { CASH_SUBCOMMAND, COMMAND, type HudEvent } from '#/features/widgets/irl-hud/hud-money';
import { MarketField } from '#/features/widgets/irl-hud/market-field';
import { PlacesField } from '#/features/widgets/irl-hud/place-field';
import { PREVIEW_CHANNEL, type PreviewMessage } from '#/features/widgets/irl-hud/use-irl-hud';
import type { SubathonEvent, SubathonPlatform } from '#/features/widgets/subathon/subathon-events';
import { usePreviewSender } from '#/hooks/use-preview-channel';
import { type TranslationKey, useI18n } from '#/lib/i18n';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import {
  buildHudPreviewUrl,
  buildHudUrl,
  DEFAULT_HUD_SETTINGS,
  HUD_CORNERS,
  HUD_MAPS,
  HUD_MOVES,
  HUD_STYLES,
  type HudCorner,
  type HudMap,
  type HudMoneyKey,
  type HudMove,
  type HudSettings,
  type HudStyle,
  MAX_EVENT_MONEY,
  MAX_MONEY,
  MAX_SIZE,
  MIN_SIZE,
  parseHudUrl,
} from '#/lib/irl-hud-url';
import { getSetupPageHead } from '#/lib/seo/pages';
import { getWidget } from '#/lib/widgets';

export const Route = createFileRoute('/{-$locale}/setup/irl-hud')({
  head: ({ params }) =>
    getSetupPageHead('irl-hud', getParamsLocale(params), {
      breadcrumb: 'irlHud.breadcrumb',
      faq: FAQ,
    }),
  component: IrlHudSetup,
});

const WIDGET = getWidget('irl-hud');
// sourceSize is only null for tools; the fallback just satisfies the type.
const CANVAS = WIDGET.sourceSize ?? { width: 1920, height: 1080 };
const SIZE_STEP = 5;

interface MoneyField {
  key: HudMoneyKey;
  label: TranslationKey;
  tip: TranslationKey;
}

const MONEY_FIELDS: Record<SubathonPlatform, MoneyField[]> = {
  twitch: [
    { key: 'tsub', label: 'irlHud.perSub', tip: 'irlHud.perSubTip' },
    { key: 'tgift', label: 'irlHud.perGift', tip: 'irlHud.perGiftTip' },
    { key: 'bits', label: 'irlHud.perBits', tip: 'irlHud.perBitsTip' },
    { key: 'traid', label: 'irlHud.perRaider', tip: 'irlHud.perRaiderTip' },
  ],
  kick: [
    { key: 'ksub', label: 'irlHud.perSub', tip: 'irlHud.perSubKickTip' },
    { key: 'kgift', label: 'irlHud.perGift', tip: 'irlHud.perGiftTip' },
    { key: 'kicks', label: 'irlHud.perKicks', tip: 'irlHud.perKicksTip' },
    { key: 'kraid', label: 'irlHud.perRaider', tip: 'irlHud.perRaiderTip' },
  ],
};

const PLATFORM_DOTS: Record<SubathonPlatform, string> = { twitch: '#9146FF', kick: '#53FC18' };

const STYLE_LABELS: Record<HudStyle, TranslationKey> = {
  retro: 'irlHud.styleRetro',
  modern: 'irlHud.styleModern',
  medieval: 'irlHud.styleMedieval',
  mmorpg: 'irlHud.styleMmorpg',
};

const FAQ: FaqEntry[] = [
  ['irlHud.faq1Q', 'irlHud.faq1A'],
  ['irlHud.faq2Q', 'irlHud.faq2A'],
  ['irlHud.faq3Q', 'irlHud.faq3A'],
  ['irlHud.faq4Q', 'irlHud.faq4A'],
  ['irlHud.faq5Q', 'irlHud.faq5A'],
  ['irlHud.faq6Q', 'irlHud.faq6A'],
  ['irlHud.faq7Q', 'irlHud.faq7A'],
];

const CASH = `${COMMAND} ${CASH_SUBCOMMAND}`;
const MAP = `${COMMAND} ${MAP_SUBCOMMAND}`;
const BUY = `${COMMAND} ${BUY_SUBCOMMAND}`;

const COMMANDS: { usage: string; action: TranslationKey }[] = [
  { usage: `${CASH} +500`, action: 'irlHud.cmdAdd' },
  { usage: `${CASH} -200`, action: 'irlHud.cmdRemove' },
  { usage: `${CASH} 10000`, action: 'irlHud.cmdSet' },
  { usage: `${CASH} reset`, action: 'irlHud.cmdReset' },
  { usage: `${MAP} park1`, action: 'irlHud.cmdMapPlace' },
  { usage: `${MAP} urban`, action: 'irlHud.cmdMapMadeUp' },
  { usage: `${MAP} reset`, action: 'irlHud.cmdMapReset' },
  { usage: `${COMMAND} walk`, action: 'irlHud.cmdWalk' },
  { usage: `${COMMAND} stay`, action: 'irlHud.cmdStay' },
  { usage: `${COMMAND} indoor`, action: 'irlHud.cmdIndoor' },
  { usage: `${COMMAND} outdoor`, action: 'irlHud.cmdOutdoor' },
  { usage: `${BUY} water`, action: 'irlHud.cmdBuy' },
  { usage: `${BUY} water 3`, action: 'irlHud.cmdBuyMany' },
  { usage: `${COMMAND} map`, action: 'irlHud.cmdToggleMap' },
  { usage: `${COMMAND} cash`, action: 'irlHud.cmdToggleCash' },
  { usage: `${COMMAND} time`, action: 'irlHud.cmdToggleTime' },
  { usage: `${COMMAND} weather`, action: 'irlHud.cmdToggleWeather' },
];

function IrlHudSetup() {
  const { t } = useI18n();
  const [twitchChannel, setTwitchChannel] = useState('');
  const [kickChannel, setKickChannel] = useState('');
  // The Senchabot connection that brings follows in: from a Dashboard link, or pasted.
  const [token, setToken] = useState('');
  useLinkedFollowToken(setToken);
  const [settings, setSettings] = useState(DEFAULT_HUD_SETTINGS);
  const [valuesTab, setValuesTab] = useState<SubathonPlatform>('twitch');
  const mounted = useHydrated();
  const { previewId, send } = usePreviewSender<PreviewMessage>(PREVIEW_CHANNEL);
  const nextPlatform = useRef<SubathonPlatform>('twitch');
  const previewWalking = useRef(true);
  const previewIndoor = useRef(false);
  const id = useId();

  const update = <K extends keyof HudSettings>(key: K, value: HudSettings[K]) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const sendEvent = (event: HudEvent) => send({ type: 'event', event });

  // Gated on mount so the prerendered input and the first client render agree.
  const origin = mounted ? window.location.origin : '';
  const widgetUrl = mounted ? buildHudUrl(origin, settings, twitchChannel, kickChannel, token) : '';
  // Without a connection no follow ever comes, so the preview doesn't play any either.
  const previewSettings = token ? settings : { ...settings, follow: 0 };
  const previewUrl = mounted ? buildHudPreviewUrl(origin, previewSettings, previewId) : '';

  const applyWidgetUrl = (text: string) => {
    const parsed = parseHudUrl(text);
    if (!parsed) return false;
    setSettings(parsed.settings);
    setTwitchChannel(parsed.twitchChannel);
    setKickChannel(parsed.kickChannel);
    setToken(parsed.token);
    return true;
  };

  // Four of them don't fit side by side on a phone, so they're a dropdown.
  const styleOptions: SelectOption<HudStyle>[] = HUD_STYLES.map((style) => ({
    value: style,
    label: t(STYLE_LABELS[style]),
  }));
  const cornerOptions: SegmentedOption<HudCorner>[] = HUD_CORNERS.map((corner) => ({
    value: corner,
    label: t(`irlHud.corners.${corner}`),
  }));
  const moveOptions: SegmentedOption<HudMove>[] = HUD_MOVES.map((move) => ({
    value: move,
    label: t(`irlHud.moves.${move}`),
  }));
  const mapOptions: SegmentedOption<HudMap>[] = HUD_MAPS.map((map) => ({
    value: map,
    label: t(`irlHud.maps.${map}`),
  }));

  const moneyFields = (platform: SubathonPlatform) => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {MONEY_FIELDS[platform].map(({ key, label, tip }) => (
          <div key={key}>
            <FieldLabel htmlFor={`${id}-${key}`} tip={t(tip)}>
              {t(label)}
            </FieldLabel>
            <CountField
              id={`${id}-${key}`}
              value={settings[key]}
              onChange={(value) => update(key, value)}
              min={0}
              max={MAX_EVENT_MONEY}
            />
          </div>
        ))}
      </div>
      {platform === 'twitch' && (
        <Switch
          label={t('irlHud.tiers')}
          tip={t('irlHud.tiersTip')}
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

  // The map's corner warning shows under both corner pickers, which sit in different tabs.
  const sameCorner = settings.radar && settings.radarCorner === settings.corner && (
    <p className={HINT_CLASS}>{t('irlHud.radarSameCorner')}</p>
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

  const appearanceTab = (
    <SettingsGroup title={t('common.sectionAppearance')} hideTitle>
      <div>
        <FieldLabel id={`${id}-style`} tip={t('irlHud.styleTip')}>
          {t('irlHud.style')}
        </FieldLabel>
        <Select
          labelledBy={`${id}-style`}
          value={settings.style}
          onChange={(value) => update('style', value)}
          options={styleOptions}
        />
      </div>
      <div>
        <FieldLabel id={`${id}-corner`} tip={t('irlHud.cornerTip')}>
          {t('irlHud.corner')}
        </FieldLabel>
        <SegmentedControl
          labelledBy={`${id}-corner`}
          value={settings.corner}
          onChange={(value) => update('corner', value)}
          options={cornerOptions}
        />
        {sameCorner}
      </div>
      <RangeField
        label={t('irlHud.size')}
        tip={t('irlHud.sizeTip')}
        min={MIN_SIZE}
        max={MAX_SIZE}
        step={SIZE_STEP}
        value={settings.size}
        onChange={(value) => update('size', Number(value))}
        format={(size) => t('irlHud.sizeValue', { size })}
        readoutClassName="w-12"
      />
      <div className="flex flex-col gap-1">
        <Switch
          label={t('irlHud.showClock')}
          tip={t('irlHud.showClockTip')}
          checked={settings.clock}
          onChange={(value) => update('clock', value)}
        />
        {settings.clock && (
          <Switch
            label={t('irlHud.clock12')}
            tip={t('irlHud.clock12Tip')}
            checked={settings.h12}
            onChange={(value) => update('h12', value)}
          />
        )}
      </div>
      {settings.clock && (
        <div>
          <FieldLabel id={`${id}-tz`} tip={t('irlHud.timeZoneTip')}>
            {t('irlHud.timeZone')}
          </FieldLabel>
          <TimeZoneSelect
            labelledBy={`${id}-tz`}
            value={settings.tz}
            onChange={(value) => update('tz', value)}
            localLabel={t('irlHud.timeZoneLocal')}
          />
        </div>
      )}
      <Switch
        label={t('irlHud.showPops')}
        tip={t('irlHud.showPopsTip')}
        checked={settings.pops}
        onChange={(value) => update('pops', value)}
      />
    </SettingsGroup>
  );

  const mapTab = (
    <SettingsGroup title={t('irlHud.sectionMap')} hideTitle>
      <Switch
        label={t('irlHud.showRadar')}
        tip={t('irlHud.showRadarTip')}
        checked={settings.radar}
        onChange={(value) => update('radar', value)}
      />
      {settings.radar && (
        <div>
          <FieldLabel id={`${id}-radarCorner`} tip={t('irlHud.radarCornerTip')}>
            {t('irlHud.radarCorner')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-radarCorner`}
            value={settings.radarCorner}
            onChange={(value) => update('radarCorner', value)}
            options={cornerOptions}
          />
          {sameCorner}
        </div>
      )}
      {settings.radar && (
        <div>
          <FieldLabel id={`${id}-map`} tip={t('irlHud.mapTip')}>
            {t('irlHud.map')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-map`}
            value={settings.map}
            onChange={(value) => update('map', value)}
            options={mapOptions}
          />
        </div>
      )}
      {settings.radar && (
        <PlacesField
          places={settings.places}
          onChange={(places) => update('places', places)}
          startsAtFirst={settings.map === 'real'}
          onPreview={(name) => sendEvent(mod(`${MAP} ${name}`))}
        />
      )}
      {settings.radar && (
        <div>
          <FieldLabel id={`${id}-move`} tip={t('irlHud.moveTip')}>
            {t('irlHud.move')}
          </FieldLabel>
          <SegmentedControl
            labelledBy={`${id}-move`}
            value={settings.move}
            onChange={(value) => update('move', value)}
            options={moveOptions}
          />
        </div>
      )}
    </SettingsGroup>
  );

  const cashTab = (
    <SettingsGroup title={t('irlHud.sectionMoney')} hideTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor={`${id}-start`} tip={t('irlHud.startTip')}>
            {t('irlHud.start')}
          </FieldLabel>
          <CountField
            id={`${id}-start`}
            value={settings.start}
            onChange={(value) => update('start', value)}
            min={0}
            max={MAX_MONEY}
          />
        </div>
      </div>
      <p className={`${HINT_CLASS} mt-0`}>{t('irlHud.valuesHint')}</p>
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
          {moneyFields(valuesTab)}
        </Tabs>
      ) : (
        moneyFields(settings.platforms === 'kick' ? 'kick' : 'twitch')
      )}
    </SettingsGroup>
  );

  const marketTab = (
    <SettingsGroup title={t('irlHud.sectionMarket')} hideTitle>
      <p className={`${HINT_CLASS} mt-0`}>{t('irlHud.marketHint')}</p>
      <MarketField
        items={settings.items}
        onChange={(items) => update('items', items)}
        onTry={(name) => sendEvent(mod(`${BUY} ${name}`))}
      />
    </SettingsGroup>
  );

  const integrationsTab = (
    <SettingsGroup title={t('irlHud.sectionIntegrations')} hideTitle>
      <p className={`${HINT_CLASS} mt-0`}>{t('irlHud.integrationsHint')}</p>
      <FollowConnection token={token} onTokenChange={setToken} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor={`${id}-follow`} tip={t('irlHud.perFollowTip')}>
            {t('irlHud.perFollow')}
          </FieldLabel>
          <CountField
            id={`${id}-follow`}
            value={settings.follow}
            onChange={(value) => update('follow', value)}
            min={0}
            max={MAX_EVENT_MONEY}
          />
        </div>
      </div>
    </SettingsGroup>
  );

  // The test buttons use a picked platform whose value is on, so a click always shows something.
  const onPlatform = (twitch: number, kick: number): SubathonPlatform | null => {
    const on: Record<SubathonPlatform, boolean> = {
      twitch: settings.platforms !== 'kick' && twitch > 0,
      kick: settings.platforms !== 'twitch' && kick > 0,
    };
    // With both on, test events take turns, so both platforms get shown.
    const preferred = nextPlatform.current;
    const other = preferred === 'twitch' ? 'kick' : 'twitch';
    const platform = on[preferred] ? preferred : on[other] ? other : null;
    if (platform) nextPlatform.current = platform === 'twitch' ? 'kick' : 'twitch';
    return platform;
  };
  const canPay = (twitch: number, kick: number) =>
    (settings.platforms !== 'kick' && twitch > 0) || (settings.platforms !== 'twitch' && kick > 0);
  const name = t('irlHud.testViewer');
  const mod = (text: string): SubathonEvent => ({ kind: 'mod', platform: 'twitch', text });
  const testButtons: { label: string; event: () => HudEvent | null; disabled?: boolean }[] = [
    {
      label: t('irlHud.testSub'),
      disabled: !canPay(settings.tsub, settings.ksub),
      event: () => {
        const platform = onPlatform(settings.tsub, settings.ksub);
        return platform && { kind: 'sub', platform, name, tier: 1 };
      },
    },
    {
      label: t('irlHud.testGift'),
      disabled: !canPay(settings.tgift, settings.kgift),
      event: () => {
        const platform = onPlatform(settings.tgift, settings.kgift);
        return platform && { kind: 'gift', platform, name, count: 5, tier: 1 };
      },
    },
    {
      label: t('irlHud.testBits'),
      disabled: !canPay(settings.bits, settings.kicks),
      event: () => {
        const platform = onPlatform(settings.bits, settings.kicks);
        return platform && { kind: 'bits', platform, name, amount: 500 };
      },
    },
    {
      label: t('irlHud.testRaid'),
      disabled: !canPay(settings.traid, settings.kraid),
      event: () => {
        const platform = onPlatform(settings.traid, settings.kraid);
        return platform && { kind: 'raid', platform, name, viewers: 25 };
      },
    },
    {
      label: t('irlHud.testFollow'),
      // Follows come only through Senchabot, so the preview takes them only when connected.
      disabled: !token || !canPay(settings.follow, settings.follow),
      event: () => {
        const platform = onPlatform(settings.follow, settings.follow);
        return platform && { kind: 'follow', platform, name };
      },
    },
    { label: t('irlHud.testAdd'), event: () => mod(`${CASH} +1000`) },
    { label: t('irlHud.testRemove'), event: () => mod(`${CASH} -500`) },
    {
      label: t('irlHud.testMove'),
      // Takes turns: the preview's arrow stops, then walks again.
      event: () => {
        const stop = previewWalking.current;
        previewWalking.current = !stop;
        return mod(`${COMMAND} ${stop ? 'stay' : 'walk'}`);
      },
    },
    {
      label: t('irlHud.testIndoor'),
      // A real place stays outdoors.
      disabled: settings.map === 'real',
      // Takes turns too: into the nearest building, then back out.
      event: () => {
        const enter = !previewIndoor.current;
        previewIndoor.current = enter;
        return mod(`${COMMAND} ${enter ? 'indoor' : 'outdoor'}`);
      },
    },
    { label: t('irlHud.testReset'), event: () => mod(`${CASH} reset`) },
    {
      label: t('irlHud.testToggleMap'),
      disabled: !settings.radar,
      event: () => mod(`${COMMAND} map`),
    },
    { label: t('irlHud.testToggleCash'), event: () => mod(`${COMMAND} cash`) },
    {
      label: t('irlHud.testToggleTime'),
      disabled: !settings.clock,
      event: () => mod(`${COMMAND} time`),
    },
  ];

  const commands = (
    <ChatCommandsCard
      title={t('irlHud.sectionCommands')}
      intro={t('irlHud.commandsIntro')}
      commands={COMMANDS.map((command) => ({ usage: command.usage, action: t(command.action) }))}
      footer={
        <>
          <p className={`${HINT_CLASS} mt-3`}>{t('irlHud.commandsAmounts')}</p>
          <p className={`${HINT_CLASS} mt-2`}>{t('irlHud.commandsShort')}</p>
        </>
      }
    />
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('irlHud.title')}
      settingsPinned={channelGroup}
      settingsTabs={[
        { id: 'appearance', label: t('common.sectionAppearance'), content: appearanceTab },
        { id: 'map', label: t('irlHud.sectionMap'), content: mapTab },
        { id: 'cash', label: t('irlHud.sectionMoney'), content: cashTab },
        { id: 'market', label: t('irlHud.sectionMarket'), content: marketTab },
        { id: 'integrations', label: t('irlHud.sectionIntegrations'), content: integrationsTab },
      ]}
      previewTitle={t('irlHud.previewTitle')}
      previewTip={t('irlHud.previewHint')}
      previewAspect={16 / 9}
      preview={
        <PreviewFrame src={previewUrl} title={t('irlHud.previewIframeTitle')} canvas={CANVAS} />
      }
      previewFooter={
        <TestButtons
          title={t('irlHud.testTitle')}
          layout="three"
          buttons={testButtons.map((button) => ({
            label: button.label,
            disabled: button.disabled,
            onClick: () => {
              const event = button.event();
              if (event) sendEvent(event);
            },
          }))}
        />
      }
      urlField={
        <CopyUrlField
          url={widgetUrl}
          tip={t('irlHud.widgetUrlTip')}
          hint={`${t('common.browserSourceHint')}${t('irlHud.browserSourceHintSize')}`}
          sourceSize={WIDGET.sourceSize}
          onEdit={applyWidgetUrl}
          editPlaceholder={t('irlHud.widgetUrlPlaceholder')}
          invalidMessage={t('irlHud.widgetUrlInvalid')}
        />
      }
      intro={t('irlHud.intro')}
      aboutExtra={commands}
      guideTitle={t('irlHud.guideTitle')}
      guideSteps={[
        'irlHud.guideStep1',
        'irlHud.guideStep2',
        'irlHud.guideStep3',
        'irlHud.guideStep4',
      ]}
      faq={FAQ}
    />
  );
}
