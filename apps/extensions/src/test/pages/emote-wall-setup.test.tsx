import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  buildEmoteWallUrl,
  DEFAULT_EMOTE_WALL_OPTIONS,
  type EmoteWallUrlOptions,
} from '#/features/widgets/emote-wall/widget-url';
import { en, retype, segment, slider, steppers, textbox, toggle } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/emote-wall';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
const kickField = () => textbox(en('common.kickChannel'));
const platforms = (option: string) => segment(en('common.platforms'), option);
const mode = (option: string) => segment(en('emoteWallSetup.mode'), option);
const sevenTv = () => toggle(en('emoteWallSetup.sevenTvEmotes'));

describe('Emote Wall setup', () => {
  it('builds the widget URL from every kind of control', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(urlField().value).toBe('');

    let options: EmoteWallUrlOptions = { ...DEFAULT_EMOTE_WALL_OPTIONS };
    const expectUrl = (patch: Partial<EmoteWallUrlOptions>) => {
      options = { ...options, ...patch };
      expect(urlField().value).toBe(buildEmoteWallUrl(window.location.origin, options));
    };

    await user.type(twitchField(), 'Streamer');
    expect(urlField().value).toBe('http://localhost:3000/widgets/emote-wall?twitch=streamer');
    await user.type(kickField(), 'kicker');
    expectUrl({ twitch: 'Streamer', kick: 'kicker' });

    await user.click(mode(en('emoteWallSetup.modeChaos')));
    expectUrl({ mode: 'chaos' });

    fireEvent.change(slider(en('emoteWallSetup.emoteSize')), { target: { value: '160' } });
    expectUrl({ size: '160' });

    const duration = textbox(en('emoteWallSetup.duration'));
    await user.click(steppers(duration).plus);
    expectUrl({ duration: '6' });
    await retype(user, duration, '12');
    expectUrl({ duration: '12' });

    const max = textbox(en('emoteWallSetup.maxEmotes'));
    await retype(user, max, '');
    // An emptied field falls back to the widget default instead of writing max=0.
    expectUrl({ max: '' });
    await user.click(steppers(max).minus);
    expectUrl({ max: '24' });

    await user.click(sevenTv());
    expectUrl({ sevenTv: false });
    await user.click(toggle(en('emoteWallSetup.subsOnly')));
    expectUrl({ subsOnly: true });
    await user.click(toggle(en('emoteWallSetup.hypeMode')));
    expectUrl({ hypeMode: true });
    await user.click(toggle(en('emoteWallSetup.spamBlock')));
    expectUrl({ spamBlock: false });

    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/emote-wall?twitch=streamer&kick=kicker&sevenTv=false' +
        '&mode=chaos&subsOnly=true&hypeMode=true&spamBlock=false&size=160&duration=12&max=24',
    );
  });

  it('turns 7TV off for Kick alone, since 7TV comes from the Twitch channel', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    await user.type(kickField(), 'kicker');

    await user.click(platforms('Kick'));
    expect(sevenTv().disabled).toBe(true);
    expect(twitchField().disabled).toBe(true);
    expect(urlField().value).toBe('http://localhost:3000/widgets/emote-wall?kick=kicker');

    await user.click(platforms('Twitch'));
    expect(sevenTv().disabled).toBe(false);
    expect(kickField().disabled).toBe(true);
    expect(urlField().value).toBe('http://localhost:3000/widgets/emote-wall?twitch=streamer');
  });

  it('loads a pasted widget URL into the controls', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    const pasted = buildEmoteWallUrl(window.location.origin, {
      ...DEFAULT_EMOTE_WALL_OPTIONS,
      kick: 'kicker',
      platforms: 'kick',
      mode: 'bounce',
      subDurationX2: true,
      showAllEmotes: true,
      size: '64',
      duration: '30',
      max: '100',
    });

    await user.click(urlField());
    await user.paste(pasted);

    expect(urlField().value).toBe(pasted);
    expect(kickField().value).toBe('kicker');
    expect(twitchField().value).toBe('');
    expect(platforms('Kick').checked).toBe(true);
    expect(sevenTv().disabled).toBe(true);
    expect(mode(en('emoteWallSetup.modeBounce')).checked).toBe(true);
    expect(slider(en('emoteWallSetup.emoteSize')).value).toBe('64');
    expect(textbox(en('emoteWallSetup.duration')).value).toBe('30');
    expect(textbox(en('emoteWallSetup.maxEmotes')).value).toBe('100');
    expect(toggle(en('emoteWallSetup.subDurationX2')).getAttribute('aria-checked')).toBe('true');
    expect(toggle(en('emoteWallSetup.showAllEmotes')).getAttribute('aria-checked')).toBe('true');
    expect(toggle(en('emoteWallSetup.spamBlock')).getAttribute('aria-checked')).toBe('true');
  });

  it('flags a pasted URL it does not understand and changes nothing', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    await user.click(mode(en('emoteWallSetup.modeChaos')));
    const before = urlField().value;

    await user.click(urlField());
    await user.paste('http://localhost:3000/widgets/chat-widget?twitch=streamer');

    expect(urlField().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText(en('emoteWallSetup.widgetUrlInvalid'))).toBeTruthy();
    expect(mode(en('emoteWallSetup.modeChaos')).checked).toBe(true);
    await user.tab();
    expect(urlField().value).toBe(before);
  });
});
