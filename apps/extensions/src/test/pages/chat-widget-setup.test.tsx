import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  buildWidgetParams,
  DEFAULT_SETTINGS,
  type Settings,
} from '#/features/widgets/chat-widget/widget-settings';
import {
  button,
  combobox,
  en,
  pickOption,
  retype,
  segment,
  slider,
  steppers,
  textbox,
  toggle,
  toggleOptions,
} from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/chat-widget';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
const kickField = () => textbox(en('common.kickChannel'));
const platforms = (option: string) => segment(en('common.platforms'), option);

function widgetUrl(settings: Settings, twitch: string, kick: string) {
  return `${window.location.origin}/widgets/chat-widget?${buildWidgetParams(settings, twitch, kick)}`;
}

describe('Chat Box setup', () => {
  it('builds the widget URL from every kind of control', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(urlField().value).toBe('');
    expect((button(en('common.copy')) as HTMLButtonElement).disabled).toBe(true);

    await user.type(twitchField(), 'Streamer');
    expect(urlField().value).toBe('http://localhost:3000/widgets/chat-widget?twitch=streamer');
    await user.type(kickField(), 'KickUser');
    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/chat-widget?twitch=streamer&kick=kickuser',
    );

    let settings: Settings = { ...DEFAULT_SETTINGS };
    const expectUrl = (patch: Partial<Settings>) => {
      settings = { ...settings, ...patch };
      expect(urlField().value).toBe(widgetUrl(settings, 'Streamer', 'KickUser'));
    };

    await pickOption(user, en('chatWidget.font'), 'Roboto');
    expectUrl({ font: 'roboto' });

    const fontSize = textbox(en('chatWidget.fontSize'));
    await user.click(steppers(fontSize).plus);
    expectUrl({ fontSize: '19' });
    await retype(user, fontSize, '24');
    expectUrl({ fontSize: '24' });

    await user.click(segment(en('chatWidget.orientation'), en('chatWidget.horizontal')));
    expectUrl({ orientation: 'horizontal' });

    await pickOption(user, en('chatWidget.messageLayout'), en('chatWidget.layoutCard'));
    expectUrl({ layout: 'card' });

    const opacity = slider(en('chatWidget.backgroundOpacity'));
    expect(opacity.disabled).toBe(true);
    await user.click(toggle(en('chatWidget.darkBackground')));
    expectUrl({ background: true });
    expect(opacity.disabled).toBe(false);
    fireEvent.change(opacity, { target: { value: '0.8' } });
    expectUrl({ bgOpacity: '0.8' });

    await user.click(toggle(en('chatWidget.boldUsernames')));
    expectUrl({ boldUsernames: true });

    await pickOption(user, en('chatWidget.newMessageAnimation'), en('chatWidget.animPop'));
    expectUrl({ animation: 'pop' });

    await toggleOptions(user, en('chatWidget.highlights'), [
      en('chatWidget.highlightMention'),
      en('chatWidget.highlightReply'),
    ]);
    expectUrl({ highlights: ['firstMessage', 'announcement', 'highlighted'] });

    await toggleOptions(user, en('chatWidget.emotes'), ['BTTV']);
    expectUrl({ bttv: false });
    expect(combobox(en('chatWidget.emotes')).textContent).toBe('7TV, FFZ');

    await pickOption(user, en('chatWidget.messageDuration'), en('chatWidget.durationKeep'));
    expectUrl({ duration: 'keep' });

    await user.click(toggle(en('chatWidget.hideBots')));
    expectUrl({ hideBots: true });

    await pickOption(user, en('chatWidget.platformIndicator'), en('chatWidget.platformName'));
    expectUrl({ platformDisplay: 'name' });

    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/chat-widget?twitch=streamer&kick=kickuser&bttv=false' +
        '&fontSize=24&background=true&bgOpacity=0.8&boldUsernames=true&orientation=horizontal' +
        '&platformDisplay=name&keep=true&hideBots=true' +
        '&highlights=firstMessage%2Cannouncement%2Chighlighted&font=roboto&layout=card&animation=pop',
    );
  });

  it('disables the settings that the chosen platforms rule out', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    await user.type(kickField(), 'kicker');
    const indicator = () => combobox(en('chatWidget.platformIndicator'));
    await pickOption(user, en('chatWidget.platformIndicator'), en('chatWidget.platformName'));
    expect(urlField().value).toContain('platformDisplay=name');

    await user.click(platforms('Twitch'));
    expect(kickField().disabled).toBe(true);
    expect(twitchField().disabled).toBe(false);
    expect(indicator().disabled).toBe(true);
    expect(urlField().value).toBe('http://localhost:3000/widgets/chat-widget?twitch=streamer');

    await user.click(platforms('Kick'));
    expect(twitchField().disabled).toBe(true);
    expect(kickField().disabled).toBe(false);
    expect(indicator().disabled).toBe(true);
    expect(urlField().value).toBe('http://localhost:3000/widgets/chat-widget?kick=kicker');

    await user.click(platforms(en('common.platformBoth')));
    expect(indicator().disabled).toBe(false);
    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/chat-widget?twitch=streamer&kick=kicker&platformDisplay=name',
    );
  });

  it('loads a pasted widget URL into the controls', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    const pasted = widgetUrl(
      {
        ...DEFAULT_SETTINGS,
        platforms: 'twitch',
        font: 'mono',
        fontSize: '30',
        orientation: 'horizontal',
        layout: 'compact',
        background: true,
        bgOpacity: '0.3',
        timestamp: true,
        sevenTv: false,
        ffz: false,
        duration: '120',
        highlights: [],
        hideCommands: true,
      },
      'Streamer',
      '',
    );

    await user.click(urlField());
    await user.paste(pasted);

    expect(urlField().value).toBe(pasted);
    expect(urlField().getAttribute('aria-invalid')).toBe('false');
    expect(twitchField().value).toBe('streamer');
    expect(kickField().value).toBe('');
    expect(platforms('Twitch').checked).toBe(true);
    expect(kickField().disabled).toBe(true);
    expect(combobox(en('chatWidget.font')).textContent).toBe('JetBrains Mono');
    expect(textbox(en('chatWidget.fontSize')).value).toBe('30');
    expect(segment(en('chatWidget.orientation'), en('chatWidget.horizontal')).checked).toBe(true);
    expect(combobox(en('chatWidget.messageLayout')).textContent).toBe(
      en('chatWidget.layoutCompact'),
    );
    expect(toggle(en('chatWidget.darkBackground')).getAttribute('aria-checked')).toBe('true');
    expect(slider(en('chatWidget.backgroundOpacity')).value).toBe('0.3');
    expect(toggle(en('chatWidget.showMessageTime')).getAttribute('aria-checked')).toBe('true');
    expect(toggle(en('chatWidget.hideCommands')).getAttribute('aria-checked')).toBe('true');
    expect(combobox(en('chatWidget.emotes')).textContent).toBe('BTTV');
    expect(combobox(en('chatWidget.highlights')).textContent).toBe(en('chatWidget.highlightsNone'));
    expect(combobox(en('chatWidget.messageDuration')).textContent).toBe(
      en('chatWidget.durationMinutes', { count: 2 }),
    );
  });

  it('rebuilds a pasted URL from another origin on this one', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.click(urlField());
    await user.paste('https://extensions.senchabot.com/widgets/chat-widget?kick=Kicker&font=serif');
    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/chat-widget?kick=kicker&font=serif',
    );
    expect(kickField().value).toBe('Kicker');
    expect(platforms('Kick').checked).toBe(true);
  });

  it('flags a pasted URL it does not understand and changes nothing', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    await user.click(toggle(en('chatWidget.boldMessages')));
    const before = urlField().value;

    await user.click(urlField());
    await user.paste('https://example.com/widgets/emote-wall?twitch=someone');

    expect(urlField().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText(en('chatWidget.widgetUrlInvalid'))).toBeTruthy();
    expect(twitchField().value).toBe('streamer');
    expect(toggle(en('chatWidget.boldMessages')).getAttribute('aria-checked')).toBe('true');

    await user.tab();
    expect(urlField().value).toBe(before);
    expect(screen.queryByText(en('chatWidget.widgetUrlInvalid'))).toBeNull();
  });
});
