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
  /** Fewest seconds allowed, applied when a box loses focus so typing isn't fought. */
  min?: number;
  /** Most seconds allowed. */
  max: number;
  /** Labels both boxes, e.g. the id of the FieldLabel above. */
  labelledBy?: string;
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
  min = 0,
  max,
  labelledBy,
}: DurationFieldProps) {
  const bigSize = UNIT_SECONDS[big];
  const smallSize = UNIT_SECONDS[small];
  const bigValue = Math.floor(value / bigSize);
  const smallValue = Math.floor((value % bigSize) / smallSize);
  // Seconds finer than the small box (e.g. from a pasted URL) stay as they are.
  const rest = value % smallSize;
  const set = (nextBig: number, nextSmall: number) => {
    const seconds = Math.round(nextBig) * bigSize + Math.round(nextSmall) * smallSize + rest;
    onChange(Math.min(max, Math.max(0, seconds)));
  };
  return (
    <fieldset
      aria-labelledby={labelledBy}
      className="flex items-center gap-1.5"
      // Only once focus leaves both boxes, so tabbing from hours to minutes isn't interrupted.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && value < min) onChange(min);
      }}
    >
      <div className="min-w-0 flex-1">
        <NumberField
          value={String(bigValue)}
          onChange={(text) => set(Number(text) || 0, smallValue)}
          min={0}
          max={Math.floor(max / bigSize)}
          fallback={0}
          ariaLabel={unitLabels[0]}
        />
      </div>
      <span className="shrink-0 text-xs text-zinc-500">{unitLabels[0]}</span>
      <div className="min-w-0 flex-1">
        {/* One step past either end, so − at 0 borrows from the big box and + at 59 carries. */}
        <NumberField
          value={String(smallValue)}
          onChange={(text) => set(bigValue, Number(text) || 0)}
          min={-1}
          max={bigSize / smallSize}
          fallback={0}
          ariaLabel={unitLabels[1]}
        />
      </div>
      <span className="shrink-0 text-xs text-zinc-500">{unitLabels[1]}</span>
    </fieldset>
  );
}
