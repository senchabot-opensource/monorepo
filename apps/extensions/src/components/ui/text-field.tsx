import { type HTMLAttributes, useId } from 'react';
import { FieldLabel } from './field-label';

/** The settings-panel input look; use it on any native input the fields below don't cover. */
export const INPUT_CLASS =
  'h-9 w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 text-sm text-zinc-900 placeholder-zinc-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white';

export const HINT_CLASS = 'mt-1 text-xs leading-relaxed text-zinc-500';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** "?" tooltip next to the label, for settings that aren't obvious. */
  tip?: string;
  /** Short help line under the input. */
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'password' | 'url';
  id?: string;
  autoComplete?: string;
  spellCheck?: boolean;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
}

export function TextField({
  label,
  value,
  onChange,
  tip,
  hint,
  id,
  type = 'text',
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;

  return (
    <div>
      <FieldLabel htmlFor={inputId} tip={tip}>
        {label}
      </FieldLabel>
      <input
        {...inputProps}
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={hint ? hintId : undefined}
        className={INPUT_CLASS}
      />
      {hint && (
        <p id={hintId} className={HINT_CLASS}>
          {hint}
        </p>
      )}
    </div>
  );
}
