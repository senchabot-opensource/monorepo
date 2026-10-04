import { useId } from 'react';
import { useT } from '#/lib/i18n';
import { PLANT_IDS, PLANT_REGISTRY, type PlantId } from './plants/registry';

// Potted plants grow up from the soil at y=0; the tallest (sunflower) tops
// out near -300, so one shared viewBox keeps every variety at true scale on
// a common baseline. Bottom-anchored so shorter plants sit, not float.
const POTTED_VIEWBOX = '-100 -330 200 350';
// The vine is a full-screen overlay, not a potted plant: crop to the left
// stem so the card shows a miniature of it instead of two distant edges.
const VINE_VIEWBOX = '0 0 300 1080';

/** One variety's full-grown plant, the way the overlay draws its final stage. */
function PlantThumb({ id }: { id: PlantId }) {
  const plant = PLANT_REGISTRY[id];
  const PlantComponent = plant.Component;
  if (id === 'vine') {
    return (
      <svg
        viewBox={VINE_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        className="h-24 w-full"
        aria-hidden="true"
      >
        <PlantComponent stage={plant.stages - 1} progress={1} />
      </svg>
    );
  }
  return (
    <svg
      viewBox={POTTED_VIEWBOX}
      preserveAspectRatio="xMidYMax meet"
      className="h-24 w-full"
      aria-hidden="true"
    >
      <PlantComponent stage={plant.stages - 1} progress={1} />
    </svg>
  );
}

/**
 * Plant variety picker for the Sub Sprout setup page: one card radio per
 * variety showing its full-grown plant, in the preset field's card style.
 */
export function PlantVarietyField({
  value,
  onChange,
  labelledBy,
}: {
  value: PlantId;
  onChange: (id: PlantId) => void;
  labelledBy?: string;
}) {
  const t = useT();
  const id = useId();

  return (
    <fieldset aria-labelledby={labelledBy} className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {PLANT_IDS.map((plant) => {
        const name = t(`plants.${plant}`);
        return (
          <label
            key={plant}
            className="relative cursor-pointer rounded-lg border border-zinc-200 bg-white p-1.5 transition-colors hover:border-zinc-300 has-checked:border-transparent has-checked:ring-2 has-checked:ring-green-500 has-focus-visible:ring-2 has-focus-visible:ring-green-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            {/* Stretched over the label instead of sr-only: focusing a clipped
                1px input makes the browser scroll the page trying to reveal it. */}
            <input
              type="radio"
              name={id}
              value={plant}
              aria-label={name}
              checked={value === plant}
              onChange={() => onChange(plant)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <PlantThumb id={plant} />
            <span className="mt-1 block truncate px-0.5 text-xs font-semibold text-zinc-900 dark:text-white">
              {name}
            </span>
            <span className="block truncate px-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              {t('subSprout.stagesSuffix', { stages: PLANT_REGISTRY[plant].stages })}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
