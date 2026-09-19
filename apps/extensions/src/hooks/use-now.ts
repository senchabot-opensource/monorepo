import { useEffect, useState } from 'react';

/** Date.now(), re-read every half second while `active`, for retry countdowns. */
export function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

/** Whole seconds until `retryAt`, never below 1 while the countdown shows. */
export const secondsLeft = (retryAt: number, now: number) =>
  Math.max(1, Math.ceil((retryAt - now) / 1000));
