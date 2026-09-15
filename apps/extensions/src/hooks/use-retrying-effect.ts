import { type DependencyList, useEffect } from 'react';
import { retryDelay } from '#/lib/fetch-json';

/**
 * Runs `load` when `deps` change, and again with backoff for as long as it resolves to true (it
 * met a failure worth retrying). `isCurrent` turns false once the deps change or it unmounts.
 */
export function useRetryingEffect(
  load: (isCurrent: () => boolean) => Promise<boolean>,
  deps: DependencyList,
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: `load` is rebuilt each render; `deps` say when to reload.
  useEffect(() => {
    let current = true;
    let timer: number | undefined;
    const run = async (attempt: number) => {
      const retry = await load(() => current).catch(() => true);
      if (current && retry) timer = window.setTimeout(() => run(attempt + 1), retryDelay(attempt));
    };
    run(0);
    return () => {
      current = false;
      window.clearTimeout(timer);
    };
  }, deps);
}
