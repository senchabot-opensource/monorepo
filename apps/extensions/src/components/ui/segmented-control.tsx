import { useId } from 'react';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  labelledBy?: string;
}

// Visually hidden native radios, so the browser provides the single tab stop and arrow keys.
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  labelledBy,
}: SegmentedControlProps<T>) {
  const name = useId();

  return (
    <fieldset
      aria-labelledby={labelledBy}
      className="flex h-9 min-w-0 gap-0.5 rounded-md border border-zinc-300 bg-zinc-100 p-0.5 dark:border-zinc-700 dark:bg-zinc-800"
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="flex min-w-0 flex-1 cursor-pointer items-center justify-center truncate rounded px-2 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 has-checked:bg-white has-checked:text-zinc-900 has-checked:shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-green-500 dark:text-zinc-400 dark:hover:text-zinc-100 dark:has-checked:bg-zinc-600 dark:has-checked:text-white"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
