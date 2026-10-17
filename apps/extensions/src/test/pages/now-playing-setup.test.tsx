import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getLastfmAvailable,
  getLastfmRecentTracks,
} from '#/features/widgets/now-playing/lastfm-server';
import { PREVIEW_CHANNEL } from '#/features/widgets/now-playing/use-now-playing';
import { TYPING_PAUSE_MS } from '#/hooks/use-debounced-value';
import { buildNowPlayingUrl, DEFAULT_NOW_PLAYING_SETTINGS } from '#/lib/now-playing-url';
import { withLayout } from '#/test/browser';
import { button, en, segment, settingsTab, textbox, toggle } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/now-playing';

const urlField = () => textbox(en('common.widgetUrl'));
const userField = () => textbox(en('nowPlaying.user'));
const status = () => screen.getByTestId('now-playing-check').textContent;
const previewSrc = () =>
  new URL(screen.getByTitle(en('nowPlaying.previewIframeTitle')).getAttribute('src') ?? '');
const origin = () => window.location.origin;

// ListenBrainz is off for now, so the page reads Last.fm only.
// /** ListenBrainz's playing-now answer for a made-up song. */
// const LISTENING = {
//   payload: {
//     count: 1,
//     listens: [
//       {
//         playing_now: true,
//         track_metadata: { track_name: 'Velvet Orbit', artist_name: 'Kaito and the Comets' },
//       },
//     ],
//     playing_now: true,
//     user_id: 'mira',
//   },
// };
/** Last.fm's recent tracks, passed on by the site's server, with a made-up song playing now. */
const LISTENING = {
  status: 200,
  text: JSON.stringify({
    recenttracks: {
      track: [
        {
          artist: { '#text': 'Kaito and the Comets' },
          name: 'Velvet Orbit',
          '@attr': { nowplaying: 'true' },
        },
      ],
    },
  }),
};

/** Collects what the page sends its preview. */
function listen() {
  const received: Record<string, unknown>[] = [];
  const channel = new BroadcastChannel(PREVIEW_CHANNEL);
  channel.onmessage = ({ data }) => received.push(data);
  return { received, close: () => channel.close() };
}

afterEach(() => {
  vi.mocked(getLastfmAvailable).mockReset();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('Now Playing setup', () => {
  it('builds the URL once a username is in, from its controls, and reads a pasted one back', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(urlField().value).toBe('');
    expect(status()).toBe(en('nowPlaying.userNeeded'));

    // await user.type(userField(), 'https://listenbrainz.org/user/mira');
    await user.type(userField(), 'https://www.last.fm/user/mira');
    expect(urlField().value).toBe(
      buildNowPlayingUrl(origin(), { ...DEFAULT_NOW_PLAYING_SETTINGS, user: 'mira' }, 'en'),
    );

    await user.click(segment(en('nowPlaying.layout'), en('nowPlaying.layouts.pill')));
    // The pill is one line: no album to pick.
    expect(screen.queryByText(en('nowPlaying.album'))).toBeNull();
    await user.click(toggle(en('nowPlaying.art')));
    await user.click(toggle(en('nowPlaying.hideStopped')));
    expect(screen.queryByText(en('nowPlaying.hideAfter'))).toBeNull();
    await user.click(settingsTab(en('common.sectionAppearance')));
    await user.click(screen.getByLabelText(en('subathon.colors.gold'), { selector: 'input' }));
    const settings = {
      ...DEFAULT_NOW_PLAYING_SETTINGS,
      user: 'mira',
      layout: 'pill' as const,
      art: false,
      hide: 0,
      color: 'gold' as const,
    };
    const url = buildNowPlayingUrl(origin(), settings, 'en');
    expect(urlField().value).toBe(url);
    expect(Object.fromEntries(new URL(url).searchParams)).toEqual({
      user: 'mira',
      layout: 'pill',
      art: '0',
      hide: '0',
      color: 'gold',
      lang: 'en',
    });

    await user.clear(userField());
    expect(urlField().value).toBe('');
    await user.click(urlField());
    await user.paste(url);
    await user.tab();
    expect(urlField().value).toBe(url);
    expect(userField().value).toBe('mira');
  }, 30_000);

  it('brings the hide time back with hiding, and writes a changed one', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(userField(), 'mira');
    await user.click(toggle(en('nowPlaying.hideStopped')));
    await user.click(toggle(en('nowPlaying.hideStopped')));
    expect(new URL(urlField().value).searchParams.has('hide')).toBe(false);
    await user.click(urlField());
    await user.paste(`${origin()}/widgets/now-playing?user=mira&hide=30&lang=en`);
    await user.tab();
    expect(new URL(urlField().value).searchParams.get('hide')).toBe('30');
    expect(toggle(en('nowPlaying.hideStopped')).getAttribute('aria-checked')).toBe('true');
  });

  // it('reads ListenBrainz only on a site without a Last.fm key', async () => {
  //   await renderRoute(PAGE);
  //   expect(screen.queryByText(en('nowPlaying.source'))).toBeNull();
  //   expect(screen.getByText(en('nowPlaying.listenbrainzHint'), { exact: false })).toBeTruthy();
  // });
  //
  // it("offers Last.fm once the site's server says it has a key", async () => {
  //   vi.mocked(getLastfmAvailable).mockResolvedValue(true);
  //   const user = setupUser();
  //   await renderRoute(PAGE);
  //   await user.type(userField(), 'mira');
  //   await vi.waitFor(() => segment(en('nowPlaying.source'), 'Last.fm'));
  //   await user.click(segment(en('nowPlaying.source'), 'Last.fm'));
  //   expect(new URL(urlField().value).searchParams.get('source')).toBe('lastfm');
  //   expect(screen.getByText(en('nowPlaying.lastfmHint'), { exact: false })).toBeTruthy();
  // });

  it('reads Last.fm only, with no source to pick, even when the site has a key', async () => {
    vi.mocked(getLastfmAvailable).mockResolvedValue(true);
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(userField(), 'mira');
    // No source picker, and nothing about ListenBrainz anywhere on the page.
    expect(screen.queryByRole('radio', { name: 'Last.fm' })).toBeNull();
    expect(screen.queryByText(/ListenBrainz/)).toBeNull();
    expect(screen.getByText(en('nowPlaying.lastfmHint'), { exact: false })).toBeTruthy();
    // Last.fm is the default, so the URL needn't name it.
    expect(new URL(urlField().value).searchParams.has('source')).toBe(false);
  });

  it('checks what the profile plays now, and says when there is no such profile', async () => {
    const lastfm = vi
      .mocked(getLastfmRecentTracks)
      .mockResolvedValueOnce(LISTENING)
      .mockResolvedValueOnce({ status: 404 });
    lastfm.mockClear();
    const user = setupUser();
    await renderRoute(PAGE);
    // Nothing is asked while typing.
    await user.type(userField(), 'mira');
    expect(lastfm).not.toHaveBeenCalled();

    await user.click(button(en('nowPlaying.check')));
    await vi.waitFor(() =>
      expect(status()).toBe(
        en('nowPlaying.checkPlaying', { title: 'Velvet Orbit', artist: 'Kaito and the Comets' }),
      ),
    );
    expect(lastfm).toHaveBeenCalledWith({ data: { user: 'mira' } });

    await user.clear(userField());
    await user.type(userField(), 'nobody{Enter}');
    await vi.waitFor(() =>
      expect(status()).toBe(en('nowPlaying.checkMissing', { user: 'nobody', service: 'Last.fm' })),
    );
  });

  it('plays sample songs in the preview, and the real one on Your Music', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const { received, close } = listen();
    await renderRoute(PAGE);
    expect(previewSrc().searchParams.get('demo')).toBe('1');
    expect(button(en('nowPlaying.testLive')).disabled).toBe(true);

    await user.click(button(en('nowPlaying.testNext')));
    await user.click(button(en('nowPlaying.testStop')));
    await user.type(userField(), 'mira');
    // Typing doesn't reload a preview that plays sample songs.
    expect(previewSrc().searchParams.has('user')).toBe(false);

    await user.click(button(en('nowPlaying.testLive')));
    await vi.waitFor(() => expect(received).toHaveLength(3));
    expect(received.map(({ type }) => type)).toEqual(['next', 'stop', 'live']);
    await vi.waitFor(() => expect(previewSrc().searchParams.get('user')).toBe('mira'), {
      timeout: TYPING_PAUSE_MS * 4,
    });
    expect(previewSrc().searchParams.has('demo')).toBe(false);

    await user.click(button(en('nowPlaying.testNext')));
    expect(previewSrc().searchParams.get('demo')).toBe('1');
    close();
  });
});
