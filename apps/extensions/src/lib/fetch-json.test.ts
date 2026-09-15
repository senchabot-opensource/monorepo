import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchJson, RetryableFetchError, requestJson } from './fetch-json';

const answer = (status: number, body: unknown = {}) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status }));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('requestJson', () => {
  it('reads JSON, and treats a 4xx as an answer', async () => {
    vi.stubGlobal('fetch', answer(200, [1]));
    expect(await requestJson('https://api.test/a')).toEqual([1]);
    vi.stubGlobal('fetch', answer(404));
    expect(await requestJson('https://api.test/a')).toBeUndefined();
  });

  it('rejects to be retried on a server error, rate limiting or no network', async () => {
    vi.stubGlobal('fetch', answer(503));
    await expect(requestJson('https://api.test/a')).rejects.toBeInstanceOf(RetryableFetchError);
    vi.stubGlobal('fetch', answer(429));
    await expect(requestJson('https://api.test/a')).rejects.toBeInstanceOf(RetryableFetchError);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch');
      }),
    );
    await expect(requestJson('https://api.test/a')).rejects.toBeInstanceOf(RetryableFetchError);
  });
});

describe('fetchJson', () => {
  it('asks once per URL, but asks again after a failure', async () => {
    const failing = answer(503);
    vi.stubGlobal('fetch', failing);
    await expect(fetchJson('https://api.test/once')).rejects.toBeInstanceOf(RetryableFetchError);

    const working = answer(200, { ok: true });
    vi.stubGlobal('fetch', working);
    expect(await fetchJson('https://api.test/once')).toEqual({ ok: true });
    expect(await fetchJson('https://api.test/once')).toEqual({ ok: true });
    expect(working).toHaveBeenCalledTimes(1);
  });
});
