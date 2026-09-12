import { useId } from 'react';
import { FieldLabel } from './field-label';
import { InfoTip } from './info-tip';

const RANGE_CLASS =
  'h-2 w-full min-w-0 cursor-pointer appearance-none rounded-lg bg-zinc-300 accent-green-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-700';

interface RangeFieldProps {
  label: string;
  value: string | number;
  /** Receives the native string value, so string settings round-trip unchanged. */
  onChange: (value: string) => void;
  min: number;
  max: number;
  step?: number;
  /** Readout text; defaults to the raw value. */
  format?: (value: number) => string;
  /** Fixed readout width so the slider doesn't shift as the text changes. */
  readoutClassName?: string;
  tip?: string;
  disabled?: boolean;
  /** `stacked`: label above. `inline`: label, slider and readout on one row. */
  layout?: 'stacked' | 'inline';
  /** Label for screen readers only, when a control beside the slider already names it. */
  hideLabel?: boolean;
}

export function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = String,
  readoutClassName = 'w-9',
  tip,
  disabled,
  layout = 'stacked',
  hideLabel,
}: RangeFieldProps) {
  const id = useId();
  const slider = (
    <>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-valuetext={format(Number(value))}
        aria-label={hideLabel ? label : undefined}
        title={hideLabel ? label : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={RANGE_CLASS}
      />
      <span
        aria-hidden="true"
        className={`shrink-0 whitespace-nowrap text-right text-xs tabular-nums text-zinc-500 ${readoutClassName} ${
          disabled ? 'opacity-40' : ''
        }`}
      >
        {format(Number(value))}
      </span>
    </>
  );

  if (hideLabel) return <div className="flex min-h-7 items-center gap-3">{slider}</div>;

  if (layout === 'inline') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex shrink-0 items-center gap-1">
          <label htmlFor={id} className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {label}
          </label>
          {tip && <InfoTip text={tip} />}
        </div>
        {slider}
      </div>
    );
  }

  return (
    <div>
      <FieldLabel htmlFor={id} tip={tip}>
        {label}
      </FieldLabel>
      <div className="flex min-h-7 items-center gap-3">{slider}</div>
    </div>
  );
}
