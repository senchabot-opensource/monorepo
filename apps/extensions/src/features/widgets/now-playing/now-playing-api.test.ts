import { afterEach, describe, expect, it, vi } from 'vitest';
import { RetryableFetchError } from '#/lib/fetch-json';
import { lastfmBody, lastfmRecentTracksUrl } from './lastfm';
import { getLastfmRecentTracks } from './lastfm-server';
import {
  checkNowPlaying,
  coverArtUrl,
  listenbrainzRequestUrl,
  parseLastfm,
  parseListenBrainz,
  requestNowPlaying,
} from './now-playing-api';

const RELEASE = 'f1418001-7f1e-46af-bfdb-95faeded8841';
const CAA_RELEASE = '2c6b8a2e-3a0e-4bb4-9d8e-5b1a1c0a7f11';

/** ListenBrainz's playing-now answer, shaped like a captured one; the song is made up. */
const listenBrainzAnswer = (metadata: Record<string, unknown> | null) => ({
  payload: {
    count: metadata ? 1 : 0,
    listens: metadata ? [{ playing_now: true, track_metadata: metadata }] : [],
    playing_now: true,
    user_id: 'mira',
  },
});

/** A song posted by ListenBrainz's own Spotify reader: no MusicBrainz ids. */
const SPOTIFY_LISTEN = {
  artist_name: 'Juniper Vale',
  track_name: 'Paper Satellites',
  release_name: 'Signal Bloom',
  additional_info: {
    duration_ms: 222000,
    music_service: 'spotify.com',
    origin_url: 'https://open.spotify.com/track/0000000000000000000000',
    spotify_id: 'https://open.spotify.com/track/0000000000000000000000',
    submission_client: 'listenbrainz',
  },
};

/** Last.fm's user.getrecenttracks answer: the song playing now first, then the last scrobble. */
const lastfmAnswer = (nowPlaying: boolean) => ({
  recenttracks: {
    track: [
      {
        artist: { mbid: '', '#text': 'The Lantern Choir' },
        streamable: '0',
        image: [
          { size: 'small', '#text': 'https://lastfm.freetls.fastly.net/i/u/34s/abc.jpg' },
          { size: 'medium', '#text': 'https://lastfm.freetls.fastly.net/i/u/64s/abc.jpg' },
          { size: 'extralarge', '#text': 'https://lastfm.freetls.fastly.net/i/u/300x300/abc.jpg' },
          { size: 'large', '#text': 'https://lastfm.freetls.fastly.net/i/u/174s/abc.jpg' },
        ],
        mbid: '',
        album: { mbid: '', '#text': 'Coastline Radio' },
        name: 'Low Tide Static',
        ...(nowPlaying ? { '@attr': { nowplaying: 'true' } } : {}),
        url: 'https://www.last.fm/music/The+Lantern+Choir/_/Low+Tide+Static',
        ...(nowPlaying ? {} : { date: { uts: '1791970000', '#text': '14 Oct 2026, 09:46' } }),
      },
      {
        artist: { mbid: '', '#text': 'Nova Lindqvist' },
        image: [],
        album: { mbid: '', '#text': 'Summer Static' },
        name: 'Copper Skies',
        date: { uts: '1791969000', '#text': '14 Oct 2026, 09:30' },
      },
    ],
    '@attr': { user: 'mira', totalPages: '900', page: '1', perPage: '1', total: '900' },
  },
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('parseListenBrainz', () => {
  it('reads the song and the cover of the release the listen is matched to', () => {
    const track = parseListenBrainz(
      listenBrainzAnswer({
        ...SPOTIFY_LISTEN,
        additional_info: { release_mbid: RELEASE },
        mbid_mapping: { caa_id: 32916450708, caa_release_mbid: CAA_RELEASE, release_mbid: RELEASE },
      }),
    );
    expect(track).toEqual({
      title: 'Paper Satellites',
      artist: 'Juniper Vale',
      album: 'Signal Bloom',
      cover: `https://coverartarchive.org/release/${CAA_RELEASE}/front-250`,
    });
  });

  it('takes the release the player sent when there is no mapping', () => {
    const track = parseListenBrainz(
      listenBrainzAnswer({
        ...SPOTIFY_LISTEN,
        additional_info: { release_mbid: RELEASE.toUpperCase() },
      }),
    );
    expect(track?.cover).toBe(coverArtUrl(RELEASE));
  });

  it('has no cover for a Spotify song, which carries no release', () => {
    expect(parseListenBrainz(listenBrainzAnswer(SPOTIFY_LISTEN))?.cover).toBeNull();
  });

  it('ignores a release id that is not an MBID', () => {
    const track = parseListenBrainz(
      listenBrainzAnswer({ ...SPOTIFY_LISTEN, additional_info: { release_mbid: '../../x' } }),
    );
    expect(track?.cover).toBeNull();
  });

  it('is null when nothing is playing, and for garbage', () => {
    expect(parseListenBrainz(listenBrainzAnswer(null))).toBeNull();
    expect(parseListenBrainz(listenBrainzAnswer({ artist_name: 'No Title' }))).toBeNull();
    for (const garbage of [undefined, null, 'x', 42, [], { payload: { listens: 'x' } }]) {
      expect(parseListenBrainz(garbage)).toBeNull();
    }
  });

  it('tidies the text: no runs of spaces, no endless titles', () => {
    const track = parseListenBrainz(
      listenBrainzAnswer({ track_name: '  Long\n\nTitle  ', artist_name: 7, release_name: null }),
    );
    expect(track).toMatchObject({ title: 'Long Title', artist: '', album: '' });
    const long = parseListenBrainz(listenBrainzAnswer({ track_name: 'x'.repeat(500) }));
    expect(long?.title).toHaveLength(200);
  });
});

describe('parseLastfm', () => {
  it('reads the song playing now with its biggest cover', () => {
    expect(parseLastfm(lastfmAnswer(true))).toEqual({
      title: 'Low Tide Static',
      artist: 'The Lantern Choir',
      album: 'Coastline Radio',
      cover: 'https://lastfm.freetls.fastly.net/i/u/300x300/abc.jpg',
    });
  });

  it('is null when the latest song is a past scrobble', () => {
    expect(parseLastfm(lastfmAnswer(false))).toBeNull();
  });

  it('reads a lone track, which Last.fm sends as an object, and extended artists', () => {
    const [first] = lastfmAnswer(true).recenttracks.track;
    const answer = {
      recenttracks: { track: { ...first, artist: { name: 'The Lantern Choir', url: 'x' } } },
    };
    expect(parseLastfm(answer)?.artist).toBe('The Lantern Choir');
  });

  it('has no cover when Last.fm sends none or its grey star', () => {
    const [first] = lastfmAnswer(true).recenttracks.track;
    const star =
      'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png';
    const images = [
      { size: 'small', '#text': '' },
      { size: 'extralarge', '#text': star },
    ];
    expect(
      parseLastfm({ recenttracks: { track: [{ ...first, image: images }] } })?.cover,
    ).toBeNull();
    expect(parseLastfm({ recenttracks: { track: [{ ...first, image: 'x' }] } })?.cover).toBeNull();
  });

  it('is null for errors and garbage', () => {
    expect(parseLastfm({ error: 6, message: 'User not found' })).toBeNull();
    for (const garbage of [undefined, null, 'x', [], { recenttracks: { track: [] } }]) {
      expect(parseLastfm(garbage)).toBeNull();
    }
  });
});

describe('request URLs', () => {
  it('asks ListenBrainz for the user, encoded', () => {
    expect(listenbrainzRequestUrl(' night owl ')).toBe(
      'https://api.listenbrainz.org/1/user/night%20owl/playing-now',
    );
    expect(listenbrainzRequestUrl('')).toBeNull();
  });

  it("builds the server's Last.fm request with the key it's given", () => {
    const url = new URL(lastfmRecentTracksUrl('mira', 'k3y'));
    expect(url.origin + url.pathname).toBe('https://ws.audioscrobbler.com/2.0/');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      method: 'user.getrecenttracks',
      user: 'mira',
      api_key: 'k3y',
      format: 'json',
      limit: '1',
    });
  });
});

describe('Last.fm through the server', () => {
  const lastfm = (answer: { status: number; text?: string }) =>
    vi.mocked(getLastfmRecentTracks).mockResolvedValueOnce(answer);

  it("reads the server's answer like a response: JSON, nothing for a 4xx, retry when busy", () => {
    expect(lastfmBody({ status: 200, text: '{"recenttracks":{}}' })).toEqual({ recenttracks: {} });
    expect(lastfmBody({ status: 404 })).toBeUndefined();
    for (const status of [429, 500, 502]) {
      expect(() => lastfmBody({ status })).toThrow(RetryableFetchError);
    }
    expect(() => lastfmBody({ status: 200, text: 'not json' })).toThrow(RetryableFetchError);
  });

  it('asks the server for the trimmed name, never Last.fm itself', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    lastfm({ status: 200, text: JSON.stringify(lastfmAnswer(true)) });
    expect(await requestNowPlaying('lastfm', ' mira ')).toEqual(lastfmAnswer(true));
    expect(getLastfmRecentTracks).toHaveBeenLastCalledWith({ data: { user: 'mira' } });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('asks nothing for no name or one too long to be a Last.fm user', async () => {
    vi.mocked(getLastfmRecentTracks).mockClear();
    expect(await requestNowPlaying('lastfm', '  ')).toBeUndefined();
    expect(await requestNowPlaying('lastfm', 'x'.repeat(65))).toBeUndefined();
    expect(getLastfmRecentTracks).not.toHaveBeenCalled();
  });

  it('retries when the server itself fails', async () => {
    vi.mocked(getLastfmRecentTracks).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(requestNowPlaying('lastfm', 'mira')).rejects.toBeInstanceOf(RetryableFetchError);
  });
});

describe('checkNowPlaying', () => {
  const answer = (status: number, body: unknown) =>
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })),
    );

  it('tells a song, nothing playing, and a profile that is not there apart', async () => {
    answer(200, listenBrainzAnswer(SPOTIFY_LISTEN));
    expect(await checkNowPlaying('listenbrainz', 'mira')).toMatchObject({
      title: 'Paper Satellites',
    });
    answer(200, listenBrainzAnswer(null));
    expect(await checkNowPlaying('listenbrainz', 'mira')).toBeNull();
    answer(404, { code: 404, error: 'Cannot find user: mira' });
    expect(await checkNowPlaying('listenbrainz', 'mira')).toBe('missing');
  });

  it("counts Last.fm's error answers, and a site without a key, as no profile", async () => {
    vi.mocked(getLastfmRecentTracks).mockResolvedValueOnce({
      status: 200,
      text: JSON.stringify({ error: 17, message: 'Login: User required to be logged in' }),
    });
    expect(await checkNowPlaying('lastfm', 'mira')).toBe('missing');
    // The server answers 404 when it has no key.
    expect(await checkNowPlaying('lastfm', 'mira')).toBe('missing');
  });

  it('rejects when the service is down, so the page can say so', async () => {
    answer(503, {});
    await expect(checkNowPlaying('listenbrainz', 'mira')).rejects.toBeInstanceOf(
      RetryableFetchError,
    );
  });
});
