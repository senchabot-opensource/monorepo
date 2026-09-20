import { useId } from 'react';
import { LocaleLink } from '#/components/locale-link';
import { FieldLabel } from '#/components/ui/field-label';
import { useT } from '#/lib/i18n';
import { PresetSwatch, SWATCH_FONT_HREF } from './preset-swatch';
import { CLASSIC_PRESET, findPreset, isClassic, PRESETS } from './registry';
import { useSitePreset } from './site-preset';

const OPTIONS = [
  { id: CLASSIC_PRESET, data: null },
  ...PRESETS.map((entry) => ({ id: entry.data.id, data: entry.data })),
];

/** The preset's name, or the classic look's translated name. */
export function usePresetName() {
  const t = useT();
  return (id: string) => findPreset(id)?.data.name ?? t('presets.classic');
}

/**
 * Preset picker for a setup page's Appearance group: one swatch per preset, and a way to make
 * the picked one the preset every setup page starts with.
 */
export function PresetField({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const t = useT();
  const id = useId();
  const nameOf = usePresetName();
  const [sitePreset, setSitePreset] = useSitePreset();
  const name = nameOf(value);

  return (
    <div>
      {/* No precedence: React would hold the page back until Google Fonts answers. */}
      <link rel="stylesheet" href={SWATCH_FONT_HREF} />
      <div className="flex items-center justify-between gap-3">
        <FieldLabel id={`${id}-label`} tip={t('presets.field.tip')}>
          {t('presets.field.label')}
        </FieldLabel>
        <LocaleLink
          to="/presets"
          className="mb-1 rounded-sm text-xs font-medium text-green-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-green-400"
        >
          {t('presets.field.browse')}
        </LocaleLink>
      </div>
      <fieldset aria-labelledby={`${id}-label`} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {OPTIONS.map((option) => (
          <label
            key={option.id}
            className="cursor-pointer rounded-lg border border-zinc-200 bg-white p-1.5 transition-colors hover:border-zinc-300 has-checked:border-transparent has-checked:ring-2 has-checked:ring-green-500 has-focus-visible:ring-2 has-focus-visible:ring-green-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <input
              type="radio"
              name={id}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            <PresetSwatch preset={option.data} />
            <span className="mt-1.5 block truncate px-0.5 text-xs font-semibold text-zinc-900 dark:text-white">
              {option.data?.name ?? t('presets.classic')}
            </span>
            <span className="block truncate px-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              {option.data?.game ?? t('presets.classicTag')}
            </span>
          </label>
        ))}
      </fieldset>
      {(!isClassic(value) || value !== sitePreset) && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
          <span>{!isClassic(value) && t('presets.field.owns', { name })}</span>
          {value === sitePreset ? (
            <span className="font-medium text-green-700 dark:text-green-400">
              ✓ {t('presets.field.isDefault')}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setSitePreset(value)}
              title={t('presets.field.makeDefaultTip')}
              className="rounded-sm font-medium text-green-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-green-400"
            >
              {t('presets.field.makeDefault', { name })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
