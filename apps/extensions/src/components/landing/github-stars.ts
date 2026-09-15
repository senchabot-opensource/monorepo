import { useEffect, useState } from 'react';
import type { Locale } from '#/lib/i18n';

export const REPO_URL = 'https://github.com/senchabot-opensource/monorepo';
const REPO_API = 'https://api.github.com/repos/senchabot-opensource/monorepo';

export const STARS_CACHE_KEY = 'senchabot-github-stars';
// Unauthenticated GitHub API calls are capped at 60 an hour per IP, and a star count barely moves.
export const STARS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

interface StarsCache {
  count: number;
  fetchedAt: number;
}

function isStarCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

/** The cached count, or null when the entry is missing, malformed or (unless `allowStale`) expired. */
export function readStarsCache(raw: string | null, now: number, allowStale = false): number | null {
  if (!raw) return null;
  try {
    const cache = JSON.parse(raw) as Partial<StarsCache>;
    if (!isStarCount(cache.count) || typeof cache.fetchedAt !== 'number') return null;
    const fresh = now - cache.fetchedAt < STARS_CACHE_TTL_MS && cache.fetchedAt <= now;
    return fresh || allowStale ? cache.count : null;
  } catch {
    return null;
  }
}

export function writeStarsCache(count: number, now: number): string {
  return JSON.stringify({ count, fetchedAt: now } satisfies StarsCache);
}

/** `stargazers_count` from a GitHub repo response, or null if it isn't there. */
export function parseStarsResponse(data: unknown): number | null {
  if (!data || typeof data !== 'object') return null;
  const count = (data as { stargazers_count?: unknown }).stargazers_count;
  return isStarCount(count) ? count : null;
}

/** "1,234" style below 10k, "12K" style above, in the page's language. */
export function formatStarCount(count: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    notation: count >= 10_000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(count);
}

function readStorage(): string | null {
  try {
    return window.localStorage.getItem(STARS_CACHE_KEY);
  } catch {
    return null;
  }
}

/**
 * Live star count of the repo, fetched in the browser and cached for a few hours. Null until it
 * loads, and stays null if GitHub can't be reached and nothing was cached before.
 */
export function useGithubStars(): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const cached = readStarsCache(readStorage(), Date.now());
    if (cached !== null) {
      setCount(cached);
      return;
    }
    const controller = new AbortController();
    fetch(REPO_API, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        const fetched = parseStarsResponse(data);
        if (fetched === null) throw new Error('No star count');
        setCount(fetched);
        try {
          window.localStorage.setItem(STARS_CACHE_KEY, writeStarsCache(fetched, Date.now()));
        } catch {
          // Storage full or blocked: the count still shows, it just isn't cached.
        }
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setCount(readStarsCache(readStorage(), Date.now(), true));
      });
    return () => controller.abort();
  }, []);

  return count;
}
