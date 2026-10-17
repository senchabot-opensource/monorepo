import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_NOW_PLAYING_SETTINGS, type NowPlayingSettings } from '#/lib/now-playing-url';
import { en } from '#/test/queries';
import { renderWithProviders } from '#/test/render';
import { DEMO_TRACKS } from './demo-tracks';
import type { LastfmAnswer } from './lastfm';
import { getLastfmRecentTracks } from './lastfm-server';
import { NowPlayingWidget } from './now-playing-widget';
import { DEMO_MS, HIDDEN_POLL_MS, POLL_MS, PREVIEW_CHANNEL } from './use-now-playing';

// ListenBrainz is off for now, so every song comes from Last.fm through the site's server.
// const RELEASE = 'f1418001-7f1e-46af-bfdb-95faeded8841';
const COVER = 'https://lastfm.example/300.jpg';

// What the site's server passes on of Last.fm's answer, settled in microtasks, so a zero-length
// tick of the fake clock delivers it and the 12-second timing can be checked to the millisecond.
const reply = (body: unknown, status = 200): LastfmAnswer => ({
  status,
  text: JSON.stringify(body),
});
/** Last.fm's recent tracks with a made-up song playing now, or with only a past one. */
const playing = (title: string | null, artist = 'Juniper Vale') =>
  reply({
    recenttracks: {
      track: [
        {
          artist: { '#text': artist },
          name: title ?? 'Yesterday Song',
          album: { '#text': 'Signal Bloom' },
          image: [{ size: 'extralarge', '#text': COVER }],
          ...(title ? { '@attr': { nowplaying: 'true' } } : {}),
        },
      ],
    },
  });

const settings = (overrides: Partial<NowPlayingSettings> = {}): NowPlayingSettings => ({
  ...DEFAULT_NOW_PLAYING_SETTINGS,
  user: 'mira',
  ...overrides,
});
const render = (ui: React.ReactNode) => renderWithProviders(ui, '/widgets/now-playing?lang=en');
const root = () => screen.getByTestId('now-playing');
const title = () => screen.queryByTestId('now-playing-title')?.textContent ?? null;
const shown = () => root().dataset.visible === 'true';
const wait = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));

let fetchMock: ReturnType<typeof vi.fn>;
const lastfm = vi.mocked(getLastfmRecentTracks);

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'],
  });
  lastfm.mockImplementation(async () => playing('Paper Satellites'));
  // The page itself never fetches: Last.fm is asked through the site's server.
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.mocked(getLastfmRecentTracks).mockReset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe('NowPlayingWidget', () => {
  it("shows the profile's song from Last.fm with its cover, artist and album", async () => {
    await render(<NowPlayingWidget settings={settings()} />);
    await vi.waitFor(() => expect(title()).toBe('Paper Satellites'));
    expect(lastfm).toHaveBeenCalledWith({ data: { user: 'mira' } });
    expect(shown()).toBe(true);
    expect(screen.getByTestId('now-playing-artist').textContent).toBe('Juniper Vale');
    expect(screen.getByTestId('now-playing-album').textContent).toBe('Signal Bloom');
    expect(screen.getByText(en('nowPlaying.overlay.label'))).toBeTruthy();
    expect(screen.getByTestId('now-playing-cover').getAttribute('src')).toBe(COVER);
    expect(screen.getByTestId('now-playing-credit').textContent).toBe('Last.fm');
  });

  it('asks again every 12 seconds and moves on to the next song', async () => {
    await render(<NowPlayingWidget settings={settings()} />);
    await wait(0);
    expect(title()).toBe('Paper Satellites');
    lastfm.mockImplementation(async () => playing('Low Tide Static', 'The Lantern Choir'));
    await wait(POLL_MS - 1);
    expect(lastfm).toHaveBeenCalledOnce();
    await wait(1);
    expect(lastfm).toHaveBeenCalledTimes(2);
    expect(title()).toBe('Low Tide Static');
    expect(screen.getByTestId('now-playing-artist').textContent).toBe('The Lantern Choir');
  });

  it('slides away after the hide time once nothing plays, and comes back with the music', async () => {
    await render(<NowPlayingWidget settings={settings({ hide: 10 })} />);
    await vi.waitFor(() => expect(title()).toBe('Paper Satellites'));
    lastfm.mockImplementation(async () => playing(null));
    await wait(POLL_MS);
    expect(root().dataset.playing).toBe('false');
    // The last song stays through a short pause, then goes.
    await wait(9_000);
    expect(shown()).toBe(true);
    await wait(1_000);
    expect(shown()).toBe(false);

    lastfm.mockImplementation(async () => playing('Velvet Orbit'));
    await wait(POLL_MS);
    await vi.waitFor(() => expect(shown()).toBe(true));
    expect(title()).toBe('Velvet Orbit');
  });

  it('keeps the last song up, dimmed, when hiding is off', async () => {
    await render(<NowPlayingWidget settings={settings({ hide: 0 })} />);
    await vi.waitFor(() => expect(title()).toBe('Paper Satellites'));
    lastfm.mockImplementation(async () => playing(null));
    await wait(POLL_MS);
    await wait(60_000);
    expect(shown()).toBe(true);
    expect(root().dataset.playing).toBe('false');
    expect(root().classList.contains('np-paused')).toBe(true);
  });

  it('shows nothing until something plays', async () => {
    lastfm.mockImplementation(async () => playing(null));
    await render(<NowPlayingWidget settings={settings()} />);
    await wait(0);
    expect(lastfm).toHaveBeenCalledOnce();
    expect(title()).toBeNull();
    expect(shown()).toBe(false);
  });

  it('backs off when the service is busy or down, and keeps the song meanwhile', async () => {
    await render(<NowPlayingWidget settings={settings()} />);
    await wait(0);
    expect(title()).toBe('Paper Satellites');
    lastfm
      .mockResolvedValueOnce({ status: 429 })
      .mockResolvedValueOnce({ status: 503 })
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await wait(POLL_MS);
    expect(lastfm).toHaveBeenCalledTimes(2);
    // 12 s plus 5, 15 and 30 s of backoff, longer each time.
    await wait(POLL_MS + 5_000 - 1);
    expect(lastfm).toHaveBeenCalledTimes(2);
    await wait(1);
    expect(lastfm).toHaveBeenCalledTimes(3);
    await wait(POLL_MS + 15_000);
    expect(lastfm).toHaveBeenCalledTimes(4);
    expect(title()).toBe('Paper Satellites');
    expect(shown()).toBe(true);
    await wait(POLL_MS + 30_000);
    expect(lastfm).toHaveBeenCalledTimes(5);
    // Answered again: back to the usual pace.
    await wait(POLL_MS);
    expect(lastfm).toHaveBeenCalledTimes(6);
  });

  it('asks once a minute while its scene is off, and at once when it is back', async () => {
    let hidden = false;
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
    const toggle = (value: boolean) =>
      act(() => {
        hidden = value;
        document.dispatchEvent(new Event('visibilitychange'));
      });
    await render(<NowPlayingWidget settings={settings()} />);
    await wait(0);
    expect(lastfm).toHaveBeenCalledOnce();
    toggle(true);
    await wait(POLL_MS);
    expect(lastfm).toHaveBeenCalledTimes(2);
    await wait(HIDDEN_POLL_MS - 1);
    expect(lastfm).toHaveBeenCalledTimes(2);
    await wait(1);
    expect(lastfm).toHaveBeenCalledTimes(3);
    toggle(false);
    await wait(0);
    expect(lastfm).toHaveBeenCalledTimes(4);
    await wait(POLL_MS);
    expect(lastfm).toHaveBeenCalledTimes(5);
  });

  it('shows nothing for a profile that is not there, and keeps asking', async () => {
    lastfm.mockImplementation(async () => ({ status: 404 }));
    await render(<NowPlayingWidget settings={settings()} />);
    await wait(POLL_MS);
    expect(lastfm).toHaveBeenCalledTimes(2);
    expect(title()).toBeNull();
  });

  it("reads Last.fm through the site's server, never with a key of its own, and credits it", async () => {
    vi.mocked(getLastfmRecentTracks).mockResolvedValue({
      status: 200,
      text: JSON.stringify({
        recenttracks: {
          track: [
            {
              artist: { '#text': 'Nova Lindqvist' },
              name: 'Copper Skies',
              album: { '#text': 'Summer Static' },
              image: [{ size: 'extralarge', '#text': 'https://lastfm.example/300.jpg' }],
              '@attr': { nowplaying: 'true' },
            },
          ],
        },
      }),
    });
    await render(<NowPlayingWidget settings={settings({ source: 'lastfm' })} />);
    await vi.waitFor(() => expect(title()).toBe('Copper Skies'));
    expect(getLastfmRecentTracks).toHaveBeenCalledWith({ data: { user: 'mira' } });
    // The page itself never calls Last.fm: only the server holds the key.
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('now-playing-credit').textContent).toBe('Last.fm');
  });

  it('shows nothing for Last.fm on a site without a key', async () => {
    // The server answers 404 when it has no key.
    lastfm.mockImplementation(async () => ({ status: 404 }));
    await render(<NowPlayingWidget settings={settings({ source: 'lastfm' })} />);
    await wait(POLL_MS * 2);
    expect(title()).toBeNull();
  });

  it('fits one line as a pill, with no album, and leaves the cover out when asked', async () => {
    await render(<NowPlayingWidget settings={settings({ layout: 'pill', art: false })} />);
    await vi.waitFor(() => expect(title()).toBe('Paper Satellites'));
    expect(screen.getByTestId('now-playing-artist').textContent).toBe('Juniper Vale');
    expect(screen.queryByTestId('now-playing-album')).toBeNull();
    expect(screen.queryByText(en('nowPlaying.overlay.label'))).toBeNull();
    expect(screen.queryByTestId('now-playing-cover')).toBeNull();
  });

  it('shows a music note when the cover does not load', async () => {
    await render(<NowPlayingWidget settings={settings()} />);
    const cover = await vi.waitFor(() => screen.getByTestId('now-playing-cover'));
    fireEvent.error(cover);
    expect(screen.queryByTestId('now-playing-cover')).toBeNull();
    expect(screen.getByTestId('now-playing-note')).toBeTruthy();
  });

  it("takes a preset's look", async () => {
    await render(<NowPlayingWidget settings={settings({ preset: 'rift' })} />);
    await vi.waitFor(() => expect(title()).toBe('Paper Satellites'));
    expect(root().dataset.preset).toBe('rift');
  });

  it('plays sample songs in demos, one after another, without asking anyone', async () => {
    await render(<NowPlayingWidget settings={DEFAULT_NOW_PLAYING_SETTINGS} demo />);
    expect(title()).toBe(DEMO_TRACKS[0].title);
    expect(screen.getByTestId('now-playing-tile')).toBeTruthy();
    await wait(DEMO_MS);
    expect(title()).toBe(DEMO_TRACKS[1].title);
    await wait(DEMO_MS * 10);
    expect(lastfm).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("plays its setup page's test buttons: next song, music stops, and back to the profile", async () => {
    await render(<NowPlayingWidget settings={settings({ hide: 5 })} previewId="p1" />);
    await vi.waitFor(() => expect(title()).toBe('Paper Satellites'));
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);

    channel.postMessage({ type: 'next', preview: 'p2' });
    channel.postMessage({ type: 'next', preview: 'p1' });
    await vi.waitFor(() => expect(title()).toBe(DEMO_TRACKS[1].title));
    // Sample songs stop the real one, and don't cycle on their own.
    await wait(POLL_MS * 2);
    expect(lastfm).toHaveBeenCalledOnce();
    expect(title()).toBe(DEMO_TRACKS[1].title);

    channel.postMessage({ type: 'stop', preview: 'p1' });
    await vi.waitFor(() => expect(root().dataset.playing).toBe('false'));
    await wait(5_000);
    expect(shown()).toBe(false);

    channel.postMessage({ type: 'live', preview: 'p1' });
    await vi.waitFor(() => expect(lastfm).toHaveBeenCalledTimes(2));
    await vi.waitFor(() => expect(title()).toBe('Paper Satellites'));
    expect(shown()).toBe(true);
    channel.close();
  });
});
