import { LocaleLink } from '#/components/locale-link';
import {
  PRESET_BADGE_CLASS,
  PRESET_BADGE_PRESSED,
  PRESET_NAME_FONT_HREF,
  PresetBadgeLabel,
} from '#/features/presets/preset-badge';
import { findPreset } from '#/features/presets/registry';
import { useI18n } from '#/lib/i18n';
import { ArrowRightIcon } from './landing-icons';

/** The presets the gallery's quick buttons dress every preview in (the user's picks). */
export const QUICK_PRESETS = [
  'pizza',
  'flower',
  'boost',
  'glitch',
  'operator',
  'starway',
  'aftermath',
  'army',
] as const;

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
      {/* No precedence: React would hold the page back until Google Fonts answers. */}
      <link rel="stylesheet" href={PRESET_NAME_FONT_HREF} />
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
              className={`${PRESET_BADGE_CLASS} ${PRESET_BADGE_PRESSED}`}
            >
              <PresetBadgeLabel preset={preset} name={preset.name} />
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
