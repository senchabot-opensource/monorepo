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
});
