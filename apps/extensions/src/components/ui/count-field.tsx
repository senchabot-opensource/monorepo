import { useState } from 'react';
import { NumberField } from './number-field';

interface CountFieldProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
}

/** A whole number in a box that may sit empty while typing. */
export function CountField({ id, value, onChange, min, max, disabled }: CountFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <NumberField
      id={id}
      value={draft ?? String(value)}
      onChange={(text) => {
        setDraft(text.includes('.') ? null : text);
        const n = Math.round(Number(text));
        if (text !== '' && Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
      }}
      onBlur={() => setDraft(null)}
      min={min}
      max={max}
      fallback={min}
      disabled={disabled}
    />
  );
}
