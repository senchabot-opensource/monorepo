import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_NOW_PLAYING_SETTINGS, type NowPlayingSettings } from '#/lib/now-playing-url';
import { en } from '#/test/queries';
import { renderWithProviders } from '#/test/render';
import { DEMO_TRACKS } from './demo-tracks';
import { NowPlayingWidget } from './now-playing-widget';
import { DEMO_MS, HIDDEN_POLL_MS, POLL_MS, PREVIEW_CHANNEL } from './use-now-playing';

const RELEASE = 'f1418001-7f1e-46af-bfdb-95faeded8841';

/** ListenBrainz's playing-now answer for a made-up song, or for nothing playing. */
const playing = (title: string | null, artist = 'Juniper Vale') => ({
  payload: {
    count: title ? 1 : 0,
    listens: title
      ? [
          {
            playing_now: true,
            track_metadata: {
              track_name: title,
              artist_name: artist,
              release_name: 'Signal Bloom',
              additional_info: { release_mbid: RELEASE },
            },
          },
        ]
      : [],
    playing_now: true,
    user_id: 'mira',
  },
});
// What requestJson reads of a Response, settled in microtasks, so a zero-length tick of the fake
// clock delivers it and the 12-second timing can be checked to the millisecond.
const reply = (body: unknown, status = 200) =>
  ({ ok: status >= 200 && status < 300, status, json: async () => body }) as Response;

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

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'],
  });
  fetchMock = vi.fn().mockImplementation(async () => reply(playing('Paper Satellites')));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe('NowPlayingWidget', () => {
  it("shows the profile's song from ListenBrainz with its cover, artist and album", async () => {
    await render(<NowPlayingWidget settings={settings()} />);
    await vi.waitFor(() => expect(title()).toBe('Paper Satellites'));
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://api.listenbrainz.org/1/user/mira/playing-now',
    );
    expect(shown()).toBe(true);
    expect(screen.getByTestId('now-playing-artist').textContent).toBe('Juniper Vale');
    expect(screen.getByTestId('now-playing-album').textContent).toBe('Signal Bloom');
    expect(screen.getByText(en('nowPlaying.overlay.label'))).toBeTruthy();
    expect(screen.getByTestId('now-playing-cover').getAttribute('src')).toBe(
      `https://coverartarchive.org/release/${RELEASE}/front-250`,
    );
    expect(screen.queryByTestId('now-playing-credit')).toBeNull();
  });

  it('asks again every 12 seconds and moves on to the next song', async () => {
    await render(<NowPlayingWidget settings={settings()} />);
    await wait(0);
    expect(title()).toBe('Paper Satellites');
    fetchMock.mockImplementation(async () =>
      reply(playing('Low Tide Static', 'The Lantern Choir')),
    );
    await wait(POLL_MS - 1);
    expect(fetchMock).toHaveBeenCalledOnce();
    await wait(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(title()).toBe('Low Tide Static');
    expect(screen.getByTestId('now-playing-artist').textContent).toBe('The Lantern Choir');
  });

  it('slides away after the hide time once nothing plays, and comes back with the music', async () => {
    await render(<NowPlayingWidget settings={settings({ hide: 10 })} />);
    await vi.waitFor(() => expect(title()).toBe('Paper Satellites'));
    fetchMock.mockImplementation(async () => reply(playing(null)));
    await wait(POLL_MS);
    expect(root().dataset.playing).toBe('false');
    // The last song stays through a short pause, then goes.
    await wait(9_000);
    expect(shown()).toBe(true);
    await wait(1_000);
    expect(shown()).toBe(false);

    fetchMock.mockImplementation(async () => reply(playing('Velvet Orbit')));
    await wait(POLL_MS);
    await vi.waitFor(() => expect(shown()).toBe(true));
    expect(title()).toBe('Velvet Orbit');
  });

  it('keeps the last song up, dimmed, when hiding is off', async () => {
    await render(<NowPlayingWidget settings={settings({ hide: 0 })} />);
    await vi.waitFor(() => expect(title()).toBe('Paper Satellites'));
    fetchMock.mockImplementation(async () => reply(playing(null)));
    await wait(POLL_MS);
    await wait(60_000);
    expect(shown()).toBe(true);
    expect(root().dataset.playing).toBe('false');
    expect(root().classList.contains('np-paused')).toBe(true);
  });

  it('shows nothing until something plays', async () => {
    fetchMock.mockImplementation(async () => reply(playing(null)));
    await render(<NowPlayingWidget settings={settings()} />);
    await wait(0);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(title()).toBeNull();
    expect(shown()).toBe(false);
  });

  it('backs off when the service is busy or down, and keeps the song meanwhile', async () => {
    await render(<NowPlayingWidget settings={settings()} />);
    await wait(0);
    expect(title()).toBe('Paper Satellites');
    fetchMock
      .mockResolvedValueOnce(reply({}, 429))
      .mockResolvedValueOnce(reply({}, 503))
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await wait(POLL_MS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    // 12 s plus 5, 15 and 30 s of backoff, longer each time.
    await wait(POLL_MS + 5_000 - 1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await wait(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    await wait(POLL_MS + 15_000);
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(title()).toBe('Paper Satellites');
    expect(shown()).toBe(true);
    await wait(POLL_MS + 30_000);
    expect(fetchMock).toHaveBeenCalledTimes(5);
    // Answered again: back to the usual pace.
    await wait(POLL_MS);
    expect(fetchMock).toHaveBeenCalledTimes(6);
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
    expect(fetchMock).toHaveBeenCalledOnce();
    toggle(true);
    await wait(POLL_MS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await wait(HIDDEN_POLL_MS - 1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await wait(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    toggle(false);
    await wait(0);
    expect(fetchMock).toHaveBeenCalledTimes(4);
    await wait(POLL_MS);
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it('shows nothing for a profile that is not there, and keeps asking', async () => {
    fetchMock.mockImplementation(async () =>
      reply({ code: 404, error: 'Cannot find user: mira' }, 404),
    );
    await render(<NowPlayingWidget settings={settings()} />);
    await wait(POLL_MS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(title()).toBeNull();
  });

  it('reads Last.fm with the build key and credits it', async () => {
    vi.stubEnv('VITE_LASTFM_API_KEY', 'k3y');
    fetchMock.mockImplementation(async () =>
      reply({
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
    );
    await render(<NowPlayingWidget settings={settings({ source: 'lastfm' })} />);
    await vi.waitFor(() => expect(title()).toBe('Copper Skies'));
    expect(String(fetchMock.mock.calls[0][0])).toContain('ws.audioscrobbler.com');
    expect(screen.getByTestId('now-playing-credit').textContent).toBe('Last.fm');
  });

  it('asks nothing for Last.fm in a build without its key', async () => {
    vi.stubEnv('VITE_LASTFM_API_KEY', '');
    await render(<NowPlayingWidget settings={settings({ source: 'lastfm' })} />);
    await wait(POLL_MS * 2);
    expect(fetchMock).not.toHaveBeenCalled();
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
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(title()).toBe(DEMO_TRACKS[1].title);

    channel.postMessage({ type: 'stop', preview: 'p1' });
    await vi.waitFor(() => expect(root().dataset.playing).toBe('false'));
    await wait(5_000);
    expect(shown()).toBe(false);

    channel.postMessage({ type: 'live', preview: 'p1' });
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    await vi.waitFor(() => expect(title()).toBe('Paper Satellites'));
    expect(shown()).toBe(true);
    channel.close();
  });
});
