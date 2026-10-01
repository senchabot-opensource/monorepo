import { screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildCountdownUrl,
  type CountdownSettings,
  DEFAULT_COUNTDOWN_SETTINGS,
} from '#/lib/countdown-url';
import { en, retype, segment, textbox } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/stream-countdown';

const urlField = () => textbox(en('common.widgetUrl'));
const iconBox = () => textbox(en('countdown.iconLabel'));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Stream Countdown setup', () => {
  it('saves the icon box under the picked scene', async () => {
    const user = setupUser();
    await renderRoute(PAGE);

    let settings: CountdownSettings = { ...DEFAULT_COUNTDOWN_SETTINGS };
    const expectUrl = (patch: Partial<CountdownSettings>) => {
      settings = { ...settings, ...patch };
      expect(urlField().value).toBe(
        buildCountdownUrl(window.location.origin, settings, '', '', 'en'),
      );
    };

    await retype(user, iconBox(), '🎬');
    expectUrl({ iconStarting: '🎬' });

    await user.click(segment(en('countdown.scene'), en('countdown.scenes.break.label')));
    expect(iconBox().value).toBe('');
    await retype(user, iconBox(), '☕');
    expectUrl({ scene: 'break', iconStarting: '🎬', iconBreak: '☕' });

    await user.click(segment(en('countdown.scene'), en('countdown.scenes.starting.label')));
    expect(iconBox().value).toBe('🎬');
  });

  it('keeps a separate icon box for the pomodoro scene', async () => {
    const user = setupUser();
    await renderRoute(PAGE);

    let settings: CountdownSettings = { ...DEFAULT_COUNTDOWN_SETTINGS };
    const expectUrl = (patch: Partial<CountdownSettings>) => {
      settings = { ...settings, ...patch };
      expect(urlField().value).toBe(
        buildCountdownUrl(window.location.origin, settings, '', '', 'en'),
      );
    };

    await user.click(segment(en('countdown.scene'), en('countdown.scenes.pomodoro.label')));
    expect(iconBox().value).toBe('');
    await retype(user, iconBox(), '🍅');
    expectUrl({ scene: 'pomodoro', iconPomodoro: '🍅' });
  });

  it('picks a channel emote for the picked scene', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.startsWith('https://api.ivr.fi/')) return Response.json([{ id: '1' }]);
        if (url === 'https://7tv.io/v3/users/twitch/1')
          return Response.json({ emote_set: { emotes: [{ id: 'e1', name: 'catJAM' }] } });
        return new Response('{}', { status: 404 });
      }),
    );
    const user = setupUser();
    await renderRoute(PAGE);
    await retype(user, textbox(en('common.twitchChannel')), 'streamer');

    const picker = await screen.findByRole(
      'button',
      { name: (name) => name.includes(en('countdown.emoteNone')) },
      { timeout: 5000 },
    );
    await user.click(picker);
    const tile = screen.getByRole('button', { name: (name) => name.startsWith('catJAM') });
    // The grid shows the small variant; the picked URL stays full-size.
    expect(tile.querySelector('img')?.getAttribute('src')).toContain('/1x.webp');
    await user.click(tile);
    await waitFor(() =>
      expect(urlField().value).toContain(
        `iconUrlStarting=${encodeURIComponent('https://cdn.7tv.app/emote/e1/2x.webp')}`,
      ),
    );
  });

  it('shows templates for pomodoro and fills in length and headline', async () => {
    const user = setupUser();
    await renderRoute(PAGE);

    let settings: CountdownSettings = { ...DEFAULT_COUNTDOWN_SETTINGS };
    const expectUrl = (patch: Partial<CountdownSettings>) => {
      settings = { ...settings, ...patch };
      expect(urlField().value).toBe(
        buildCountdownUrl(window.location.origin, settings, '', '', 'en'),
      );
    };
    const template = (name: 'pomodoro' | 'shortBreak' | 'longBreak', minutes: number) =>
      `${en(`countdown.templates.${name}`)} · ${minutes} ${en('countdown.durationUnit')}`;

    // Templates are pomodoro related, so other purposes hide them.
    expect(screen.queryByRole('button', { name: template('pomodoro', 25) })).toBeNull();

    await user.click(segment(en('countdown.scene'), en('countdown.scenes.pomodoro.label')));
    expectUrl({ scene: 'pomodoro' });

    await user.click(screen.getByRole('button', { name: template('pomodoro', 25) }));
    expect(textbox(en('countdown.duration')).value).toBe('25');
    expect(textbox(en('countdown.titleLabel')).value).toBe(en('countdown.templates.pomodoro'));
    expectUrl({ time: 1500, title: 'Pomodoro' });

    // A template switches back from a time of day to a length.
    await user.click(segment(en('countdown.mode'), en('countdown.modes.clock')));
    expect(textbox(en('countdown.atLabel')).value).toBe('21:00');
    expectUrl({ at: '21:00' });
    await user.click(screen.getByRole('button', { name: template('shortBreak', 5) }));
    expect(textbox(en('countdown.duration')).value).toBe('5');
    expect(textbox(en('countdown.titleLabel')).value).toBe(en('countdown.templates.shortBreak'));
    const params = new URL(urlField().value).searchParams;
    expect(params.get('time')).toBe('300');
    expect(params.get('title')).toBe('Short break');
    expect(params.get('at')).toBeNull();
    expectUrl({ time: 300, title: 'Short break', at: '' });
  });

  it('finds a channel emote through the picker search', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.startsWith('https://api.ivr.fi/')) return Response.json([{ id: '2' }]);
        if (url === 'https://7tv.io/v3/users/twitch/2')
          return Response.json({
            emote_set: {
              emotes: [
                { id: 'e1', name: 'catJAM' },
                { id: 'e2', name: 'dogJAM' },
              ],
            },
          });
        return new Response('{}', { status: 404 });
      }),
    );
    const user = setupUser();
    await renderRoute(PAGE);
    await retype(user, textbox(en('common.twitchChannel')), 'gamer');

    const picker = await screen.findByRole(
      'button',
      { name: (name) => name.includes(en('countdown.emoteNone')) },
      { timeout: 5000 },
    );
    await user.click(picker);
    await retype(user, textbox(en('countdown.emoteSearch')), 'dog');
    await waitFor(
      () =>
        expect(
          screen.queryByRole('button', { name: (name) => name.startsWith('catJAM') }),
        ).toBeNull(),
      { timeout: 5000 },
    );
    await user.click(screen.getByRole('button', { name: (name) => name.startsWith('dogJAM') }));
    await waitFor(() =>
      expect(urlField().value).toContain(
        `iconUrlStarting=${encodeURIComponent('https://cdn.7tv.app/emote/e2/2x.webp')}`,
      ),
    );
  });
});
