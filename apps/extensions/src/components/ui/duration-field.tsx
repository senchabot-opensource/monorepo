import { NumberField } from './number-field';

const UNIT_SECONDS = { h: 3600, m: 60, s: 1 } as const;
type Unit = keyof typeof UNIT_SECONDS;

interface DurationFieldProps {
  /** Seconds. */
  value: number;
  onChange: (seconds: number) => void;
  /** The two boxes, biggest first: hours and minutes, or minutes and seconds. */
  units: readonly [Unit, Unit];
  /** Short label after each box, e.g. "h" and "min". */
  unitLabels: readonly [string, string];
  /** Most seconds allowed. */
  max: number;
  /** Labels both boxes, e.g. the id of the FieldLabel above. */
  labelledBy?: string;
  disabled?: boolean;
}

/**
 * A duration as two steppers. Typing past a unit carries over (90 minutes becomes 1 h 30 min),
 * so the two boxes always read as one normalized time.
 */
export function DurationField({
  value,
  onChange,
  units: [big, small],
  unitLabels,
  max,
  labelledBy,
  disabled,
}: DurationFieldProps) {
  const bigValue = Math.floor(value / UNIT_SECONDS[big]);
  const smallValue = Math.floor((value % UNIT_SECONDS[big]) / UNIT_SECONDS[small]);
  const set = (nextBig: number, nextSmall: number) =>
    onChange(
      Math.min(
        max,
        Math.max(
          0,
          Math.round(nextBig) * UNIT_SECONDS[big] + Math.round(nextSmall) * UNIT_SECONDS[small],
        ),
      ),
    );
  const smallMax = UNIT_SECONDS[big] / UNIT_SECONDS[small] - 1;

  return (
    <fieldset aria-labelledby={labelledBy} className="flex items-center gap-1.5">
      <div className="min-w-0 flex-1">
        <NumberField
          value={String(bigValue)}
          onChange={(text) => set(Number(text) || 0, smallValue)}
          min={0}
          max={Math.floor(max / UNIT_SECONDS[big])}
          fallback={0}
          disabled={disabled}
          ariaLabel={unitLabels[0]}
        />
      </div>
      <span className="shrink-0 text-xs text-zinc-500">{unitLabels[0]}</span>
      <div className="min-w-0 flex-1">
        <NumberField
          value={String(smallValue)}
          onChange={(text) => set(bigValue, Number(text) || 0)}
          min={-1}
          max={smallMax + 1}
          fallback={0}
          disabled={disabled}
          ariaLabel={unitLabels[1]}
        />
      </div>
      <span className="shrink-0 text-xs text-zinc-500">{unitLabels[1]}</span>
    </fieldset>
  );
}
