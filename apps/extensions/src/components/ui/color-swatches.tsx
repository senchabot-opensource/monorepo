import { useId } from 'react';

export interface SwatchOption<T extends string> {
  value: T;
  label: string;
  /** CSS background of the swatch. */
  background: string;
}

/** Round color swatches that work as one radio group. */
export function ColorSwatches<T extends string>({
  value,
  onChange,
  options,
  labelledBy,
}: {
  value: T;
  onChange: (value: T) => void;
  options: readonly SwatchOption<T>[];
  labelledBy: string;
}) {
  const name = useId();
  return (
    <fieldset aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <label
          key={option.value}
          title={option.label}
          className="relative flex size-8 cursor-pointer items-center justify-center rounded-full ring-offset-2 ring-offset-white has-checked:ring-2 has-checked:ring-zinc-900 has-focus-visible:ring-2 has-focus-visible:ring-green-500 dark:ring-offset-zinc-900 dark:has-checked:ring-white"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            aria-label={option.label}
            className="sr-only"
          />
          <span
            aria-hidden="true"
            className="size-7 rounded-full border border-black/10"
            style={{ background: option.background }}
          />
        </label>
      ))}
    </fieldset>
  );
}
