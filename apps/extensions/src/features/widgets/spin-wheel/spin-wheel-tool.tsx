import { useId } from 'react';
import { FieldLabel } from '#/components/ui/field-label';
import { ScrollHint } from '#/components/ui/scroll-hint';
import { SettingsGroup } from '#/components/ui/settings-group';
import { HINT_CLASS, INPUT_CLASS } from '#/components/ui/text-field';
import { useConfettiBurst } from '#/hooks/use-confetti-burst';
import { useI18n } from '#/lib/i18n';
import { SpinWheelCanvas } from './spin-wheel-canvas';
import type { SpinWheelState } from './use-spin-wheel';

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-zinc-900';
const BUTTON_PRIMARY = `${BUTTON_BASE} bg-green-600 text-white enabled:hover:bg-green-700`;
const BUTTON_SECONDARY = `${BUTTON_BASE} border border-zinc-300 bg-white text-zinc-900 enabled:hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:enabled:hover:bg-zinc-800`;
const BUTTON_QUIET =
  'rounded px-1.5 py-0.5 text-xs font-medium text-zinc-500 transition-colors enabled:hover:bg-zinc-100 enabled:hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:enabled:hover:bg-zinc-800 dark:enabled:hover:text-white';
const LIST_BOX =
  'flex flex-col rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40';
const LIST_SCROLL = 'min-h-0 flex-1 overflow-y-auto';

/** Left panel: the option list, one per line. Updates the wheel as you type. */
export function SpinOptionsEditor({ wheel }: { wheel: SpinWheelState }) {
  const { t } = useI18n();
  const id = useId();
  const count = wheel.slices.length;

  return (
    <SettingsGroup title={t('spinWheel.sectionOptions')}>
      <div>
        <FieldLabel htmlFor={`${id}-options`} tip={t('spinWheel.optionsTip')}>
          {t('spinWheel.optionsLabel')}
        </FieldLabel>
        <textarea
          id={`${id}-options`}
          value={wheel.text}
          onChange={(e) => wheel.setText(e.target.value)}
          placeholder={t('spinWheel.optionsPlaceholder')}
          rows={8}
          spellCheck={false}
          aria-describedby={`${id}-count`}
          className={`${INPUT_CLASS} h-auto min-h-40 py-2 leading-relaxed`}
        />
        <div className="mt-1 flex items-center justify-between gap-2">
          <p id={`${id}-count`} className={HINT_CLASS}>
            {t('spinWheel.count', { count })}
          </p>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={wheel.shuffle}
              disabled={count < 2}
              className={BUTTON_QUIET}
            >
              {t('spinWheel.shuffle')}
            </button>
            <button
              type="button"
              onClick={wheel.clear}
              disabled={count === 0}
              className={BUTTON_QUIET}
            >
              {t('spinWheel.clear')}
            </button>
          </div>
        </div>
      </div>
    </SettingsGroup>
  );
}

/** Right panel: the wheel, the spin button and the sound toggle. */
export function SpinWheelPreview({ wheel }: { wheel: SpinWheelState }) {
  const { t } = useI18n();
  const fireConfetti = useConfettiBurst({ particleCount: 3, disableForReducedMotion: true });

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center gap-3">
      <SpinWheelCanvas
        slices={wheel.slices}
        size={360}
        currentSpin={wheel.currentSpin}
        onSpinComplete={(winner) => {
          wheel.setSpinning(false);
          wheel.pushHistory({ label: winner.label, color: winner.color, at: Date.now() });
          fireConfetti();
        }}
        soundEnabled={wheel.soundEnabled}
        winnerTitle={t('spinWheel.winnerTitle')}
      />
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={wheel.spin}
          disabled={!wheel.canSpin}
          className={`${BUTTON_PRIMARY} h-11 min-w-44 text-base`}
        >
          {wheel.spinning ? t('spinWheel.spinning') : t('spinWheel.spin')}
        </button>
        <button
          type="button"
          onClick={() => wheel.setSoundEnabled(!wheel.soundEnabled)}
          aria-pressed={wheel.soundEnabled}
          className={`${BUTTON_SECONDARY} h-11`}
        >
          {wheel.soundEnabled ? t('spinWheel.soundOn') : t('spinWheel.soundOff')}
        </button>
      </div>
      {!wheel.canSpin && !wheel.spinning && (
        <p className="text-center text-xs text-zinc-500">{t('spinWheel.needTwo')}</p>
      )}
    </div>
  );
}

/** Winner history, newest first. The list never removes slices from the wheel. */
export function SpinHistoryList({ wheel }: { wheel: SpinWheelState }) {
  const { t } = useI18n();
  const id = useId();

  return (
    <section aria-labelledby={`${id}-history`}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <h3 id={`${id}-history`} className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {t('spinWheel.history', { count: wheel.history.length })}
        </h3>
        <button
          type="button"
          onClick={wheel.clearHistory}
          disabled={wheel.history.length === 0}
          className={BUTTON_QUIET}
        >
          {t('spinWheel.clearHistory')}
        </button>
      </div>
      <ScrollHint className={`${LIST_BOX} max-h-36`} scrollClassName={LIST_SCROLL}>
        {wheel.history.length === 0 ? (
          <p className="px-3 py-2 text-xs text-zinc-500">{t('spinWheel.noHistory')}</p>
        ) : (
          <ol className="divide-y divide-zinc-200 dark:divide-zinc-800" aria-live="polite">
            {wheel.history.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-3 px-3 py-1.5 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                    {entry.label}
                  </span>
                </span>
                <span className="shrink-0 text-xs tabular-nums text-zinc-500">
                  {new Date(entry.at).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ol>
        )}
      </ScrollHint>
    </section>
  );
}

/** The whole live tool: editor, wheel and history. Used by the /tools page. */
export function SpinWheelTool({ wheel }: { wheel: SpinWheelState }) {
  return (
    <div className="grid content-start gap-4 lg:grid-cols-2 lg:items-start">
      <div className="space-y-4">
        <SpinOptionsEditor wheel={wheel} />
        <SpinHistoryList wheel={wheel} />
      </div>
      <SpinWheelPreview wheel={wheel} />
    </div>
  );
}
