import { useEffect, useState } from 'react';

/** Long enough to fall between keystrokes, short enough to feel immediate once typing stops. */
export const TYPING_PAUSE_MS = 400;

/** `value`, once it has stopped changing for `ms`. */
export function useDebouncedValue<T>(value: T, ms: number): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);
  return settled;
}
