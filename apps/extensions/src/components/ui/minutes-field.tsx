import { useState } from 'react';
import { NumberField } from './number-field';

interface MinutesFieldProps {
  id?: string;
  /** Seconds. */
  value: number;
  onChange: (seconds: number) => void;
  /** Most seconds allowed. */
  max: number;
  /** Short label after the box, e.g. "min". */
  unitLabel: string;
}

/**
 * A time in whole minutes in one box, stored as seconds. The box may sit empty while typing; an
 * odd number of seconds from a hand-edited URL shows as it is (1.5) until the box is changed.
 */
export function MinutesField({ id, value, onChange, max, unitLabel }: MinutesFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-1.5">
      <div className="min-w-0 flex-1">
        <NumberField
          id={id}
          value={draft ?? String(Number((value / 60).toFixed(2)))}
          onChange={(text) => {
            // Whole minutes: a typed point is dropped, and −/+ on 1.5 lands on a whole number.
            setDraft(text.includes('.') ? null : text);
            const minutes = Math.round(Number(text));
            if (text !== '' && Number.isFinite(minutes)) onChange(Math.min(max, minutes * 60));
          }}
          onBlur={() => setDraft(null)}
          min={0}
          max={Math.floor(max / 60)}
          fallback={0}
        />
      </div>
      <span className="shrink-0 text-xs text-zinc-500">{unitLabel}</span>
    </div>
  );
}
