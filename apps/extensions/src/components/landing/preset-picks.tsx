import { LocaleLink } from '#/components/locale-link';
import type { PresetData } from '#/features/presets/preset-schema';
import { findPreset } from '#/features/presets/registry';
import { useI18n } from '#/lib/i18n';
import { ArrowRightIcon } from './landing-icons';

/** The presets the gallery's quick buttons dress every preview in (the user's picks). */
export const QUICK_PRESETS = ['pizza', 'flower', 'boost', 'glitch', 'operator'] as const;

/** A dot in the preset's accent and panel colors, ringed in its frame color. */
function Dot({ preset }: { preset: PresetData }) {
  const { accent, panel, frame } = preset.colors;
  return (
    <span
      aria-hidden="true"
      className="size-3.5 shrink-0 rounded-full"
      style={{
        background: `linear-gradient(135deg, ${accent} 0 50%, ${panel} 50% 100%)`,
        boxShadow: `inset 0 0 0 1px ${frame}`,
      }}
    />
  );
}

interface PresetPicksProps {
  /** The preset every preview is shown in; null leaves each one its own. */
  value: string | null;
  onChange: (preset: string | null) => void;
  className?: string;
}

/**
 * Buttons that show every preview in the gallery in one preset at once, pressed again to go back
 * to the mixed ones, and a link to the presets page for the rest.
 */
export function PresetPicks({ value, onChange, className = '' }: PresetPicksProps) {
  const { t } = useI18n();
  return (
    <fieldset className={`min-w-0 ${className}`}>
      <legend className="sr-only">{t('home.presetPicks.label')}</legend>
      <div className="flex flex-wrap items-center gap-2">
        {QUICK_PRESETS.map((id) => {
          const preset = findPreset(id)?.data;
          if (!preset) return null;
          const pressed = value === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={pressed}
              onClick={() => onChange(pressed ? null : id)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors select-none hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 aria-pressed:border-green-600 aria-pressed:bg-green-600 aria-pressed:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white dark:focus-visible:ring-offset-zinc-950 dark:aria-pressed:border-green-500 dark:aria-pressed:bg-green-500 dark:aria-pressed:text-zinc-950"
            >
              <Dot preset={preset} />
              {preset.name}
            </button>
          );
        })}
        <LocaleLink
          to="/presets"
          className="ml-1 inline-flex items-center gap-1 rounded text-sm font-semibold text-green-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-green-400"
        >
          {t('home.presetPicks.more')}
          <ArrowRightIcon className="size-4" />
        </LocaleLink>
      </div>
    </fieldset>
  );
}
