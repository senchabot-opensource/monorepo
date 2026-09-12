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
  disabled?: boolean;
}

// Visually hidden native radios, so the browser provides the single tab stop and arrow keys.
// A disabled fieldset disables every radio inside it.
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  labelledBy,
  disabled,
}: SegmentedControlProps<T>) {
  const name = useId();

  return (
    <fieldset
      aria-labelledby={labelledBy}
      disabled={disabled}
      className="flex h-9 min-w-0 gap-0.5 rounded-md border border-zinc-300 bg-zinc-100 p-0.5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex min-w-0 flex-1 items-center justify-center truncate rounded px-2 text-xs font-medium text-zinc-500 transition-colors has-checked:bg-white has-checked:text-zinc-900 has-checked:shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-green-500 dark:text-zinc-400 dark:has-checked:bg-zinc-600 dark:has-checked:text-white ${
            disabled
              ? 'cursor-not-allowed'
              : 'cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
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
