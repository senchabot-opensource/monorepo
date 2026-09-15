/** A failure worth retrying: no network yet, a timeout, rate limiting or a server error. */
export class RetryableFetchError extends Error {}

// OBS can start a source before the network is up, and an API can have a bad minute.
const RETRY_MS = [5_000, 15_000, 30_000, 60_000];
const TIMEOUT_MS = 10_000;

/** How long to wait before the given retry (0 for the first). */
export const retryDelay = (attempt: number) => RETRY_MS[Math.min(attempt, RETRY_MS.length - 1)];

/**
 * JSON from `url`, or undefined for a 4xx, which is an answer (e.g. no 7TV account). Anything
 * worth retrying rejects with RetryableFetchError.
 */
export async function requestJson<T>(url: string): Promise<T | undefined> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.ok) return (await response.json()) as T;
  } catch (error) {
    throw new RetryableFetchError(`${url}: ${error}`);
  }
  if (response.status === 429 || response.status >= 500) {
    throw new RetryableFetchError(`${url}: ${response.status}`);
  }
  return undefined;
}

const requests = new Map<string, Promise<unknown>>();

/** requestJson, once per URL per page. A failure worth retrying is dropped, so the next call asks again. */
export function fetchJson<T>(url: string): Promise<T | undefined> {
  let request = requests.get(url);
  if (!request) {
    request = requestJson<T>(url).catch((error: unknown) => {
      requests.delete(url);
      throw error;
    });
    requests.set(url, request);
  }
  return request as Promise<T | undefined>;
}
