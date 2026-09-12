interface NumberFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  /** Fires when the text input loses focus, e.g. to drop a half-typed draft. */
  onBlur?: () => void;
  min: number;
  max: number;
  fallback: number;
  disabled?: boolean;
}

const STEP_BUTTON_CLASS =
  'w-8 shrink-0 text-base text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 focus-visible:bg-zinc-200 focus-visible:outline-none dark:hover:bg-zinc-700 dark:hover:text-white dark:focus-visible:bg-zinc-700';

// Digits and one decimal point, like the old type="number" inputs: an emote wall duration of 2.5s
// is valid, and dropping the dot would silently make it 25.
const toNumberText = (text: string) => {
  const [whole, ...fraction] = text.replace(/[^\d.]/g, '').split('.');
  return fraction.length > 0 ? `${whole}.${fraction.join('')}` : whole;
};

// Typing stays free-form like the old input; only the −/+ buttons clamp to min/max.
export function NumberField({
  id,
  value,
  onChange,
  onBlur,
  min,
  max,
  fallback,
  disabled,
}: NumberFieldProps) {
  const step = (delta: number) => {
    const current = Number(value) || fallback;
    onChange(String(Math.min(max, Math.max(min, current + delta))));
  };

  return (
    <div
      className={`flex h-9 overflow-hidden rounded-md border border-zinc-300 bg-zinc-100 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800 ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => step(-1)}
        className={STEP_BUTTON_CLASS}
      >
        −
      </button>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(toNumberText(e.target.value))}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            step(e.key === 'ArrowUp' ? 1 : -1);
          }
        }}
        className="w-full min-w-0 bg-transparent text-center text-sm text-zinc-900 focus:outline-none disabled:cursor-not-allowed dark:text-white"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => step(1)}
        className={STEP_BUTTON_CLASS}
      >
        +
      </button>
    </div>
  );
}
