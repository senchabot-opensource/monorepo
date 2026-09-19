import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeWebSocket } from '#/test/browser';
import { renderRoute } from '#/test/render';

vi.mock('./alert-sound', () => ({ playAlertSound: vi.fn() }));

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('/widgets/stream-alerts', () => {
  it.each([
    'simulate=1&theme=%3Cscript%3E&color=__proto__&dur=abc&vol=NaN&mingift=-1&simplatform=xx',
    'simulate=1&sub=0&gift=0&bits=0&raid=zzz&hsub=%E2%80%AE&dur=1e9',
    'simulate=true&dur=&vol=&minraid=[1]&msg={}',
  ])('plays sample alerts with garbage params: %s', async (query) => {
    await renderRoute(`/widgets/stream-alerts?${query}`);
    await act(async () => vi.advanceTimersByTime(2000));
    expect(document.body.textContent).not.toContain('Something went wrong');
    expect(screen.getByTestId('stream-alert')).toBeTruthy();
  });

  it('connects to a digits-only Twitch channel', async () => {
    await renderRoute('/widgets/stream-alerts?twitch=123456&lang=en');
    const twitch = FakeWebSocket.instances.find((ws) => ws.url.includes('twitch'));
    expect(twitch).toBeTruthy();
    act(() => twitch?.open());
    expect(twitch?.sent.some((line) => line === 'JOIN #123456')).toBe(true);
  });

  it('shows a custom heading from the URL as text', async () => {
    await renderRoute(
      '/widgets/stream-alerts?simulate=1&hsub=%3Cb%3Ehi%3C%2Fb%3E&hgift=%3Cb%3Ehi%3C%2Fb%3E&hbits=%3Cb%3Ehi%3C%2Fb%3E&hraid=%3Cb%3Ehi%3C%2Fb%3E',
    );
    await act(async () => vi.advanceTimersByTime(2000));
    expect(screen.getByTestId('stream-alert').textContent).toContain('<b>hi</b>');
    expect(screen.getByTestId('stream-alert').querySelector('b')).toBeNull();
  });
});
