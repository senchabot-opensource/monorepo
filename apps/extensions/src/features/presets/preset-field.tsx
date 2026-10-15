import { useId, useState } from 'react';
import { ChevronDownIcon, DiceIcon } from '#/components/icons';
import { LocaleLink } from '#/components/locale-link';
import { FieldLabel } from '#/components/ui/field-label';
import { Select, type SelectOption } from '#/components/ui/select';
import { Switch } from '#/components/ui/switch';
import { useT } from '#/lib/i18n';
import { SITE_FONT_NAMES, SITE_FONTS, type SiteFont } from '#/lib/site-fonts';
import type { PresetData } from './preset-schema';
import { PresetSwatch, SWATCH_FONT_HREF } from './preset-swatch';
import { randomPreset } from './random';
import { CLASSIC_PRESET, findPreset, isClassic, PRESETS, presetEffect } from './registry';
import { useSitePreset } from './site-preset';

const OPTIONS = [
  { id: CLASSIC_PRESET, data: null },
  ...PRESETS.map((entry) => ({ id: entry.data.id, data: entry.data })),
];

// The font box's first choice: the preset's own fonts, which writes no `font` at all.
const OWN_FONTS = 'preset';

// The bar naming the pick and the dice beside it.
const BOX_CLASS =
  'rounded-lg border border-zinc-200 bg-white transition-colors hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700';

/** The preset's name, or the classic look's translated name. */
export function usePresetName() {
  const t = useT();
  return (id: string) => findPreset(id)?.data.name ?? t('presets.classic');
}

/** The line under a preset's name: the game it's made for, "just for fun", or classic's own. */
export function usePresetTag() {
  const t = useT();
  return (data: PresetData | null | undefined) =>
    data ? (data.game ?? t('presets.funTag')) : t('presets.classicTag');
}

/**
 * Preset picker for a setup page's Appearance group: one swatch per preset, and a way to make
 * the picked one the preset every setup page starts with. The swatches fold away behind a bar
 * naming the pick, and start folded while the widget keeps its classic look, so the panel
 * doesn't open on a dozen of them. A dice beside the bar picks one at random. Underneath, a
 * preset with an effect gets a switch for it, and a font box can draw the widget in another font.
 */
export function PresetField({
  value,
  onChange,
  fx,
  onFxChange,
  font,
  onFontChange,
}: {
  value: string;
  onChange: (id: string) => void;
  /** The widget's effect switch; only `false` is off, so a URL without `fx` plays the effect. */
  fx: boolean | undefined;
  onFxChange: (on: boolean) => void;
  /**
   * The font the widget is drawn in instead of the preset's; undefined keeps the preset's own.
   * Without `onFontChange` there is no font box: Chat Box picks its fonts in its own two boxes.
   */
  font?: SiteFont;
  onFontChange?: (font: SiteFont | undefined) => void;
}) {
  const t = useT();
  const id = useId();
  const nameOf = usePresetName();
  const tagOf = usePresetTag();
  const [sitePreset, setSitePreset] = useSitePreset();
  const name = nameOf(value);
  // Null until the bar is clicked or a swatch picked: until then the grid is open for a preset
  // (one from a pasted URL or the site default) and folded for classic. A pick keeps it open,
  // so choosing Classic doesn't fold the grid away under the pointer.
  const [unfolded, setUnfolded] = useState<boolean | null>(null);
  const open = unfolded ?? !isClassic(value);
  const preset = findPreset(value)?.data;
  const fontOptions: SelectOption<SiteFont | typeof OWN_FONTS>[] = preset
    ? [
        {
          value: OWN_FONTS,
          label: t('presets.field.presetFonts', { name }),
          // Blocks draws both roles in one family, and "Jersey 10 + Jersey 10" would look odd.
          hint: [...new Set([preset.fonts.display.family, preset.fonts.body.family])].join(' + '),
        },
        ...SITE_FONTS.map((choice) => ({
          value: choice,
          label: choice === 'system' ? t('chatWidget.fontSystem') : SITE_FONT_NAMES[choice],
        })),
      ]
    : [];
  // Drawn in another font, the preset only brings its colors.
  const ownFonts = !(font && onFontChange);

  return (
    <div>
      {/* No precedence: React would hold the page back until Google Fonts answers. */}
      {open && <link rel="stylesheet" href={SWATCH_FONT_HREF} />}
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
      <div className="flex gap-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-grid`}
          aria-describedby={`${id}-label`}
          onClick={() => setUnfolded(!open)}
          className={`flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left ${BOX_CLASS}`}
        >
          <span className="min-w-0">
            <span className="block truncate text-xs font-semibold text-zinc-900 dark:text-white">
              {name}
            </span>
            <span className="block truncate text-[11px] text-zinc-500 dark:text-zinc-400">
              {tagOf(preset)}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400">
            {open ? t('presets.field.hide') : t('presets.field.show', { count: PRESETS.length })}
            <ChevronDownIcon
              className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </span>
        </button>
        {/* Keeps the swatches as they are, open or folded, so trying one after another doesn't
            move the page each time. */}
        <button
          type="button"
          aria-label={t('presets.field.random')}
          title={t('presets.field.random')}
          onClick={() => {
            setUnfolded(open);
            onChange(randomPreset(value));
          }}
          className={`flex w-11 shrink-0 cursor-pointer items-center justify-center text-green-700 dark:text-green-400 ${BOX_CLASS}`}
        >
          <DiceIcon className="size-5" />
        </button>
      </div>
      {/* Stays mounted, so the bar's aria-controls always resolves. */}
      <fieldset
        id={`${id}-grid`}
        aria-labelledby={`${id}-label`}
        hidden={!open}
        className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {OPTIONS.map((option) => (
          <label
            key={option.id}
            className="relative cursor-pointer rounded-lg border border-zinc-200 bg-white p-1.5 transition-colors hover:border-zinc-300 has-checked:border-transparent has-checked:ring-2 has-checked:ring-green-500 has-focus-visible:ring-2 has-focus-visible:ring-green-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            {/* Stretched over the label instead of sr-only: focusing a clipped
                1px input makes the browser scroll the page trying to reveal it. */}
            <input
              type="radio"
              name={id}
              value={option.id}
              checked={value === option.id}
              onChange={() => {
                setUnfolded(true);
                onChange(option.id);
              }}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <PresetSwatch preset={option.data} />
            <span className="mt-1.5 block truncate px-0.5 text-xs font-semibold text-zinc-900 dark:text-white">
              {option.data?.name ?? t('presets.classic')}
            </span>
            <span className="block truncate px-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              {tagOf(option.data)}
            </span>
          </label>
        ))}
      </fieldset>
      {/* Outside the grid, so it stays in reach while the swatches are folded away. */}
      {presetEffect(value) !== 'none' && (
        <div className="mt-2">
          <Switch
            label={t('presets.field.effects')}
            tip={t('presets.field.effectsTip', { name })}
            checked={fx !== false}
            onChange={onFxChange}
          />
        </div>
      )}
      {preset && onFontChange && (
        <div className="mt-2">
          <FieldLabel id={`${id}-font`} tip={t('presets.field.fontTip', { name })}>
            {t('presets.field.font')}
          </FieldLabel>
          <Select
            labelledBy={`${id}-font`}
            value={font ?? OWN_FONTS}
            onChange={(choice) => onFontChange(choice === OWN_FONTS ? undefined : choice)}
            options={fontOptions}
          />
        </div>
      )}
      {(!isClassic(value) || value !== sitePreset) && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
          <span>
            {!isClassic(value) &&
              t(ownFonts ? 'presets.field.owns' : 'presets.field.ownsColors', { name })}
          </span>
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
