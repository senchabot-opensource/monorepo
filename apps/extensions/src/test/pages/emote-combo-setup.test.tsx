import { fireEvent, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW_CHANNEL } from '#/features/widgets/emote-combo/use-emote-combo';
import {
  buildEmoteComboUrl,
  DEFAULT_EMOTE_COMBO_SETTINGS,
  type EmoteComboSettings,
} from '#/lib/emote-combo-url';
import { FakeWebSocket, withLayout } from '#/test/browser';
import {
  button,
  en,
  retype,
  settingsTab,
  slider,
  textbox,
  toggle,
  toggleOptions,
} from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/emote-combo';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
const count = (label: string) =>
  screen.getByLabelText(label, { selector: 'input' }) as HTMLInputElement;
const color = (name: string) =>
  within(screen.getByLabelText(en('common.setup.color'), { selector: 'fieldset' })).getByLabelText(
    name,
  ) as HTMLInputElement;
const previewSrc = () =>
  new URL((screen.getByTitle(en('emoteCombo.previewIframeTitle')) as HTMLIFrameElement).src);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Emote Combo overlay route', () => {
  it('falls back to the defaults for garbage params and joins the channel', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await renderRoute('/widgets/emote-combo?twitch=%20Streamer%20&window=soon&min=x&color=plaid');
    expect(screen.getByTestId('emote-combo')).toBeTruthy();
    const twitch = FakeWebSocket.instances.find((ws) => ws.url.includes('twitch'));
    twitch?.open();
    expect(twitch?.sent).toContain('JOIN #streamer');
  });
});

describe('Emote Combo setup', () => {
  it('builds the widget URL from its controls', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    await toggleOptions(user, en('emoteCombo.emotes'), ['7TV', 'BTTV']);
    fireEvent.change(slider(en('emoteCombo.window')), { target: { value: '12' } });
    await retype(user, count(en('emoteCombo.min')), '5');
    await user.click(toggle(en('emoteCombo.best')));
    await user.click(settingsTab(en('common.sectionAppearance')));
    await user.click(color(en('subathon.colors.cyan')));
    fireEvent.change(slider(en('emoteCombo.size')), { target: { value: '130' } });
    const settings: EmoteComboSettings = {
      ...DEFAULT_EMOTE_COMBO_SETTINGS,
      sevenTv: false,
      bttv: true,
      window: 12,
      min: 5,
      best: false,
      color: 'cyan',
      size: 130,
    };
    expect(urlField().value).toBe(
      buildEmoteComboUrl(window.location.origin, settings, 'streamer', '', 'en'),
    );
  }, 30_000);

  it('reads a pasted URL back into its controls', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    const pasted = buildEmoteComboUrl(
      window.location.origin,
      {
        ...DEFAULT_EMOTE_COMBO_SETTINGS,
        ffz: true,
        window: 20,
        min: 4,
        best: false,
        color: 'pink',
        size: 70,
      },
      'streamer',
      'kicker',
      'en',
    );
    await user.click(urlField());
    await user.paste(pasted);
    expect(twitchField().value).toBe('streamer');
    expect(textbox(en('common.kickChannel')).value).toBe('kicker');
    expect(slider(en('emoteCombo.window')).value).toBe('20');
    expect(count(en('emoteCombo.min')).value).toBe('4');
    expect(toggle(en('emoteCombo.best')).getAttribute('aria-checked')).toBe('false');
    await user.click(settingsTab(en('common.sectionAppearance')));
    expect(color(en('subathon.colors.pink')).checked).toBe(true);
    expect(slider(en('emoteCombo.size')).value).toBe('70');
    await user.tab();
    expect(urlField().value).toBe(pasted);
  }, 30_000);

  it('pairs the preview with the page and sends it the test buttons', async () => {
    // The preview frame only mounts once its box has a size.
    withLayout(800, 350);
    const user = setupUser();
    const received: { type: string; preview: string }[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);

    const preview = previewSrc().searchParams.get('preview');
    expect(previewSrc().searchParams.get('simulate')).toBe('1');
    expect(previewSrc().searchParams.has('twitch')).toBe(false);
    expect(preview).toBeTruthy();

    await user.click(button(en('emoteCombo.testStart')));
    await user.click(button(en('emoteCombo.testChatter')));
    await user.click(button(en('emoteCombo.testReset')));
    await vi.waitFor(() => expect(received).toHaveLength(3));
    expect(received.map((message) => message.type)).toEqual(['start', 'chatter', 'reset']);
    expect(received.every((message) => message.preview === preview)).toBe(true);
    listener.close();
  });

  it('lists !combo reset among its chat commands', async () => {
    await renderRoute(PAGE);
    expect(screen.getByText('!combo reset')).toBeTruthy();
    expect(screen.getByText(en('emoteCombo.cmdReset'))).toBeTruthy();
  });
});
