import confetti from 'canvas-confetti';
import { type RefObject, useCallback, useEffect, useId, useRef, useState } from 'react';
import { CopyUrlField } from '#/components/copy-url-field';
import { CloseIcon, RaffleIcon } from '#/components/icons';
import { SetupShell } from '#/components/setup-shell';
import { FieldLabel } from '#/components/ui/field-label';
import { NumberField } from '#/components/ui/number-field';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { Select, type SelectOption } from '#/components/ui/select';
import { SettingsGroup } from '#/components/ui/settings-group';
import { Switch } from '#/components/ui/switch';
import { TextField } from '#/components/ui/text-field';
import { useRaffleChat } from '#/hooks/use-raffle-chat';
import { useRaffleState } from '#/hooks/use-raffle-state';
import { useI18n } from '#/lib/i18n';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getWidget } from '#/lib/widgets';
import type { RafflePlatform } from '#/types/raffle';

export const RAFFLE_FAQ: FaqEntry[] = [
  ['raffle.faq1Q', 'raffle.faq1A'],
  ['raffle.faq2Q', 'raffle.faq2A'],
  ['raffle.faq3Q', 'raffle.faq3A'],
];

const WIDGET = getWidget('raffle');

const MAX_WINS = ['1', '2', '3', '4', '5', '0'] as const;

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-zinc-900';
const BUTTON_PRIMARY = `${BUTTON_BASE} bg-green-600 text-white enabled:hover:bg-green-700`;
const BUTTON_SECONDARY = `${BUTTON_BASE} border border-zinc-300 bg-white text-zinc-900 enabled:hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:enabled:hover:bg-zinc-800`;
const BUTTON_QUIET =
  'rounded px-1.5 py-0.5 text-xs font-medium text-zinc-500 transition-colors enabled:hover:bg-zinc-100 enabled:hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:enabled:hover:bg-zinc-800 dark:enabled:hover:text-white';
const LIST_BOX =
  'overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40';

function triggerConfetti(rafRef: RefObject<number | null>) {
  const end = Date.now() + 3000;
  const frame = () => {
    // canvas-confetti skips the animation itself when the viewer prefers reduced motion.
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      disableForReducedMotion: true,
    });
    if (Date.now() < end) rafRef.current = requestAnimationFrame(frame);
  };
  rafRef.current = requestAnimationFrame(frame);
}

/** Whole-number setting whose field may sit empty while typing; blur shows the saved value again. */
function IntegerField({
  id,
  value,
  onChange,
  min,
  max,
  disabled,
}: {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <NumberField
      id={id}
      value={draft ?? String(value)}
      onChange={(text) => {
        const next = Math.min(max, Math.max(min, Number.parseInt(text, 10) || min));
        setDraft(text === String(next) ? null : text);
        onChange(next);
      }}
      onBlur={() => setDraft(null)}
      min={min}
      max={max}
      fallback={value}
      disabled={disabled}
    />
  );
}

export function RaffleWidget({
  initialChannel = '',
  platform = 'twitch',
}: {
  initialChannel?: string;
  platform?: RafflePlatform;
}) {
  const { locale, t } = useI18n();
  const id = useId();
  const {
    state,
    updateConfig,
    start,
    stop,
    drawWinner,
    removeParticipant,
    resetParticipants,
    resetWinners,
    resetAll,
    resetConfig,
    addParticipant,
    eligibleCount,
    canDraw,
    remainingMs,
  } = useRaffleState({ initialChannel, platform, t });
  const { config } = state;

  const [overlayUrl, setOverlayUrl] = useState('');
  const confettiRafRef = useRef<number | null>(null);
  // remainingMs is read from the clock on render, so re-render every second while it counts down.
  const [, setTick] = useState(0);
  const countingDown = remainingMs > 0;

  useEffect(() => {
    setOverlayUrl(`${window.location.origin}${WIDGET.widgetPath}`);
    return () => {
      if (confettiRafRef.current) cancelAnimationFrame(confettiRafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!countingDown) return;
    const timer = setInterval(() => setTick((tick) => tick + 1), 1000);
    return () => clearInterval(timer);
  }, [countingDown]);

  useRaffleChat(config, addParticipant, state.status === 'running');

  const handleDraw = useCallback(() => {
    if (drawWinner()) triggerConfetti(confettiRafRef);
  }, [drawWinner]);

  const isRunning = state.status === 'running';
  const locked = state.status !== 'idle';
  const canStart = !isRunning && Boolean(config.channel.trim()) && Boolean(config.keyword.trim());
  const hasActiveState =
    state.participants.length > 0 || state.winners.length > 0 || state.status !== 'idle';
  const lastWinner = state.winners.at(-1);
  const keyword = config.keyword.trim();

  const platformOptions: SegmentedOption<RafflePlatform>[] = [
    { value: 'twitch', label: 'Twitch' },
    { value: 'kick', label: 'Kick' },
  ];
  const maxWinsOptions: SelectOption<(typeof MAX_WINS)[number]>[] = MAX_WINS.map((value) => ({
    value,
    label: value === '0' ? t('raffle.maxWinsUnlimited') : value,
  }));

  const statusText =
    state.status === 'running'
      ? t('raffle.statusRunning', { keyword })
      : state.status === 'stopped'
        ? t('raffle.statusStopped')
        : canStart
          ? t('raffle.statusIdle')
          : t('raffle.statusNeedsSetup');

  const lockBanner = locked && (
    <div
      role="status"
      className="flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
    >
      <svg
        className="mt-0.5 size-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      <div>
        <p className="text-sm font-semibold">{t('raffle.lockedTitle')}</p>
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300/90">
          {t('raffle.lockedDesc')}
        </p>
      </div>
    </div>
  );

  const settingsPanel = (
    <>
      <SettingsGroup title={t('common.sectionChannel')}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel id={`${id}-platform`}>{t('raffle.platform')}</FieldLabel>
            <SegmentedControl
              labelledBy={`${id}-platform`}
              value={config.platform}
              onChange={(value) => updateConfig({ platform: value })}
              options={platformOptions}
              disabled={locked}
            />
          </div>
          <TextField
            label={t('raffle.channelName')}
            tip={t('common.channelTip')}
            value={config.channel}
            onChange={(value) => updateConfig({ channel: value })}
            placeholder={t('common.channelPlaceholder')}
            disabled={locked}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('raffle.sectionRules')}>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label={t('raffle.entryKeyword')}
            tip={t('raffle.keywordTip')}
            value={config.keyword}
            onChange={(value) => updateConfig({ keyword: value })}
            placeholder="!join"
            disabled={locked}
            autoComplete="off"
            spellCheck={false}
          />
          <div>
            <FieldLabel htmlFor={`${id}-duration`} tip={t('raffle.minDurationTip')}>
              {t('raffle.minDuration')}
            </FieldLabel>
            <IntegerField
              id={`${id}-duration`}
              value={config.minRaffleDurationSec}
              onChange={(value) => updateConfig({ minRaffleDurationSec: value })}
              min={0}
              max={300}
              disabled={locked}
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Nudged down to sit level with the number input beside it. */}
          <div className="sm:self-end sm:pb-1">
            <Switch
              label={t('raffle.subscribersOnly')}
              tip={t('raffle.subscribersOnlyTip')}
              checked={config.subscribersOnly}
              onChange={(value) => updateConfig({ subscribersOnly: value })}
              disabled={locked}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${id}-months`}>{t('raffle.minSubMonths')}</FieldLabel>
            <IntegerField
              id={`${id}-months`}
              value={config.minSubMonths}
              onChange={(value) => updateConfig({ minSubMonths: value })}
              min={1}
              max={999}
              disabled={locked || !config.subscribersOnly}
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel id={`${id}-max-wins`} tip={t('raffle.maxWinsTip')}>
              {t('raffle.maxWinsPerUser')}
            </FieldLabel>
            <Select
              labelledBy={`${id}-max-wins`}
              value={String(config.maxWinsPerUser) as (typeof MAX_WINS)[number]}
              onChange={(value) => updateConfig({ maxWinsPerUser: Number(value) })}
              options={maxWinsOptions}
              disabled={locked}
            />
          </div>
        </div>
      </SettingsGroup>

      <div className="flex justify-end border-t border-zinc-200 pt-3 dark:border-zinc-800">
        <button type="button" onClick={resetConfig} disabled={locked} className={BUTTON_QUIET}>
          {t('raffle.resetConfig')}
        </button>
      </div>
    </>
  );

  const controls = (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="flex min-w-0 items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
          <span
            aria-hidden="true"
            className={`size-2 shrink-0 rounded-full ${
              state.status === 'running'
                ? 'bg-green-500 motion-safe:animate-pulse'
                : state.status === 'stopped'
                  ? 'bg-amber-500'
                  : 'bg-zinc-400 dark:bg-zinc-600'
            }`}
          />
          <span className="truncate">{statusText}</span>
        </p>
        <button
          type="button"
          onClick={resetAll}
          disabled={!hasActiveState}
          className={BUTTON_QUIET}
        >
          {t('raffle.resetAll')}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={start}
          disabled={!canStart}
          className={`${BUTTON_PRIMARY} h-9`}
        >
          {t('raffle.startRaffle')}
        </button>
        <button
          type="button"
          onClick={stop}
          disabled={!isRunning}
          className={`${BUTTON_SECONDARY} h-9`}
        >
          {t('raffle.stopRaffle')}
        </button>
      </div>

      <button
        type="button"
        onClick={handleDraw}
        disabled={!canDraw}
        className={`${BUTTON_PRIMARY} h-11 text-base`}
      >
        <RaffleIcon className="size-5" />
        {countingDown
          ? t('raffle.drawLocked', { seconds: Math.ceil(remainingMs / 1000) })
          : t('raffle.drawWinner', { count: eligibleCount })}
      </button>

      <div aria-live="polite">
        {lastWinner && (
          <div className="flex items-baseline justify-between gap-3 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2">
            <span className="shrink-0 text-xs font-medium text-green-800 dark:text-green-300">
              {t('raffle.lastWinner')}
            </span>
            <span className="truncate text-lg font-bold text-zinc-900 dark:text-white">
              {lastWinner.displayName || lastWinner.username}
            </span>
          </div>
        )}
      </div>

      <section aria-labelledby={`${id}-winners`}>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <h3
            id={`${id}-winners`}
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            {t('raffle.winners', { count: state.winners.length })}
          </h3>
          <button
            type="button"
            onClick={resetWinners}
            disabled={state.winners.length === 0}
            aria-label={t('raffle.resetWinners')}
            className={BUTTON_QUIET}
          >
            {t('raffle.clear')}
          </button>
        </div>
        <div className={`${LIST_BOX} max-h-24`}>
          {state.winners.length === 0 ? (
            <p className="px-3 py-2 text-xs text-zinc-500">{t('raffle.noWinners')}</p>
          ) : (
            <ol className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {state.winners.map((winner) => (
                <li
                  key={`${winner.id}-${winner.drawnAt}`}
                  className="flex items-center justify-between gap-3 px-3 py-1.5 text-sm"
                >
                  <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                    {winner.displayName || winner.username}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-zinc-500">
                    {new Date(winner.drawnAt).toLocaleTimeString(locale)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section aria-labelledby={`${id}-entries`} className="flex min-h-0 flex-1 flex-col">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <h3
            id={`${id}-entries`}
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            {t('raffle.participants', { count: state.participants.length })}
          </h3>
          <button
            type="button"
            onClick={resetParticipants}
            disabled={state.participants.length === 0}
            aria-label={t('raffle.resetEntries')}
            className={BUTTON_QUIET}
          >
            {t('raffle.clear')}
          </button>
        </div>
        <div className={`${LIST_BOX} min-h-16 flex-1 p-2`}>
          {state.participants.length === 0 ? (
            <p className="p-1 text-xs text-zinc-500">
              {t('raffle.noParticipants', { keyword: keyword || '!join' })}
            </p>
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {state.participants.map((participant) => {
                const name = participant.displayName || participant.username;
                return (
                  <li
                    key={participant.id}
                    className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-zinc-300 bg-white py-0.5 pr-1 pl-2.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    <span className="truncate font-medium">{name}</span>
                    {participant.subMonths > 0 && (
                      <span className="rounded bg-green-500/10 px-1 text-[10px] font-semibold text-green-700 dark:text-green-400">
                        {t('raffle.subMonthsShort', { months: participant.subMonths })}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeParticipant(participant.id)}
                      aria-label={t('raffle.disqualify', { name })}
                      title={t('raffle.disqualify', { name })}
                      className="rounded-full p-0.5 text-zinc-500 transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:hover:text-red-400"
                    >
                      <CloseIcon className="size-3" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );

  return (
    <SetupShell
      widgetId={WIDGET.id}
      title={t('raffle.title')}
      breadcrumbLabel={t('raffle.breadcrumb')}
      settingsTop={lockBanner}
      settings={settingsPanel}
      previewTitle={t('raffle.controlTitle')}
      previewTip={t('raffle.controlTip')}
      preview={controls}
      urlField={
        <CopyUrlField
          url={overlayUrl}
          label={t('raffle.overlayUrl')}
          tip={t('raffle.overlayUrlTip')}
          hint={t('raffle.overlayUrlHint')}
          sourceSize={WIDGET.sourceSize}
          nextSteps={[
            t('common.nextSteps.addSource'),
            t('common.nextSteps.paste'),
            ...(WIDGET.sourceSize ? [t('common.nextSteps.size', { ...WIDGET.sourceSize })] : []),
            t('raffle.overlayNextStep'),
          ]}
        />
      }
      intro={t('raffle.intro')}
      guideSteps={[
        'raffle.guideStep1',
        'raffle.guideStep2',
        'raffle.guideStep3',
        'raffle.guideStep4',
      ]}
      faq={RAFFLE_FAQ}
    />
  );
}
