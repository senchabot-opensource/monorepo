import { useId } from 'react';
import { InfoTip } from './info-tip';

interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tip?: string;
  disabled?: boolean;
}

export function Switch({ label, checked, onChange, tip, disabled }: SwitchProps) {
  const id = useId();

  return (
    <div className="flex min-h-7 items-center justify-between gap-3">
      <div className={`flex min-w-0 items-center gap-1 ${disabled ? 'opacity-50' : ''}`}>
        <label
          htmlFor={id}
          className={`text-sm leading-tight text-zinc-800 dark:text-zinc-200 ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {label}
        </label>
        {tip && <InfoTip text={tip} />}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-zinc-900 ${
          checked ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'
        }`}
      >
        <span
          className={`size-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
