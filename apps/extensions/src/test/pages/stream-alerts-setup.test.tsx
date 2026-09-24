import { screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW_CHANNEL } from '#/features/widgets/stream-alerts/use-stream-alerts';
import { withLayout } from '#/test/browser';
import {
  button,
  combobox,
  en,
  pickOption,
  retype,
  segment,
  slider,
  textbox,
  toggle,
  tr,
} from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/stream-alerts';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
/** One alert's block: its switch, Heading box and minimum. */
const kind = (label: string) => within(screen.getByRole('group', { name: label }));
const headingBox = (label: string) =>
  kind(label).getByRole('textbox', { name: en('streamAlerts.heading') }) as HTMLInputElement;
const color = (name: string) =>
  within(screen.getByLabelText(en('streamAlerts.color'), { selector: 'fieldset' })).getByLabelText(
    name,
  ) as HTMLInputElement;
const previewSrc = () =>
  new URL((screen.getByTitle(en('streamAlerts.previewIframeTitle')) as HTMLIFrameElement).src);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Stream Alerts setup', () => {
  it('builds the widget URL from every kind of control', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(urlField().value).toBe('');

    await user.type(twitchField(), 'Streamer');
    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/stream-alerts?twitch=streamer&lang=en',
    );

    await user.click(color(en('streamAlerts.colors.gold')));
    await user.click(toggle(en('streamAlerts.kindRaid')));
    await retype(user, headingBox(en('streamAlerts.kindSub')), 'WELCOME');
    await retype(user, textbox(en('streamAlerts.minBits')), '250');
    await pickOption(user, en('streamAlerts.language'), 'Türkçe');
    await user.click(toggle(en('streamAlerts.showMessage')));

    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/stream-alerts?twitch=streamer&color=gold&hsub=WELCOME' +
        '&raid=0&minbits=250&msg=0&lang=tr',
    );
  });

  it('turns off the fields of an alert that is off', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.click(toggle(en('streamAlerts.kindGift')));
    expect(headingBox(en('streamAlerts.kindGift')).disabled).toBe(true);
    expect((textbox(en('streamAlerts.minGift')) as HTMLInputElement).disabled).toBe(true);
    expect(button(en('streamAlerts.testGift', { count: 5 })).disabled).toBe(true);
  });

  it('shows the default heading as the placeholder, in the alert language', async () => {
    withLayout(800, 350);
    const user = setupUser();
    await renderRoute(PAGE);
    const heading = () => headingBox(en('streamAlerts.kindRaid'));
    expect(heading().placeholder).toBe(en('streamAlerts.alert.raidHeading'));
    await pickOption(user, en('streamAlerts.language'), 'Türkçe');
    expect(heading().placeholder).toBe(tr('streamAlerts.alert.raidHeading'));
    expect(previewSrc().searchParams.get('lang')).toBe('tr');
  });

  it('loads a pasted widget URL back into the controls', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.click(urlField());
    await user.paste(
      'https://extensions.senchabot.com/widgets/stream-alerts?kick=kicker&gift=0&mingift=5&dur=12&lang=tr',
    );

    expect(textbox(en('common.kickChannel')).value).toBe('kicker');
    expect(toggle(en('streamAlerts.kindGift')).getAttribute('aria-checked')).toBe('false');
    expect(textbox(en('streamAlerts.minGift')).value).toBe('5');
    expect(slider(en('streamAlerts.duration')).value).toBe('12');
    expect(combobox(en('streamAlerts.language')).textContent).toBe('Türkçe');
  });

  it('previews the picked platform and sends test alerts to the preview', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const received: unknown[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);

    await user.click(segment(en('common.platforms'), 'Kick'));
    expect(previewSrc().searchParams.get('simplatform')).toBe('kick');
    await user.click(button(en('streamAlerts.testBits', { amount: 500 })));
    await vi.waitFor(() => expect(received).toHaveLength(1));
    expect(received[0]).toMatchObject({
      type: 'alert',
      preview: previewSrc().searchParams.get('preview'),
      alert: { kind: 'bits', platform: 'kick', amount: 500 },
    });
    listener.close();
  });

  it('round-trips a pasted URL with every setting back into the same URL', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    const pasted =
      'http://localhost:3000/widgets/stream-alerts?twitch=streamer&kick=kicker&theme=celestial' +
      '&color=pink&hsub=A%26B&gift=0&hbits=Cheer%21&minbits=250&minraid=10&dur=12&vol=0&msg=0&lang=tr';
    await user.click(urlField());
    await user.paste(pasted);
    await user.tab();
    expect(urlField().value).toBe(pasted);
    expect(headingBox(en('streamAlerts.kindSub')).value).toBe('A&B');
    expect(color(en('streamAlerts.colors.pink')).checked).toBe(true);
    expect(slider(en('streamAlerts.volume')).value).toBe('0');
  });

  it('loads a pasted URL with broken values as the defaults, without breaking the page', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.click(urlField());
    await user.paste(
      'https://extensions.senchabot.com/widgets/stream-alerts?twitch=streamer&theme=%3Cb%3E&dur=abc&vol=-9&mingift=0&lang=zz',
    );
    await user.tab();
    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/stream-alerts?twitch=streamer&vol=0&lang=en',
    );
  });

  it('carries the look and words into the preview, never the channels', async () => {
    withLayout(800, 350);
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    await user.click(segment(en('streamAlerts.theme'), en('streamAlerts.themes.celestial')));
    await retype(user, headingBox(en('streamAlerts.kindRaid')), 'Raid!');
    const params = previewSrc().searchParams;
    expect(params.get('theme')).toBe('celestial');
    expect(params.get('hraid')).toBe('Raid!');
    expect(params.has('twitch')).toBe(false);
    expect(params.get('simulate')).toBe('1');
  });

  it("sends test alerts that clear the page's own minimums", async () => {
    withLayout(800, 350);
    const user = setupUser();
    const received: {
      alert: { kind: string; count?: number; amount?: number; viewers?: number };
    }[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);
    await retype(user, textbox(en('streamAlerts.minGift')), '20');
    await retype(user, textbox(en('streamAlerts.minBits')), '9000');
    await retype(user, textbox(en('streamAlerts.minRaid')), '77');
    await user.click(button(en('streamAlerts.testGift', { count: 20 })));
    await user.click(button(en('streamAlerts.testBits', { amount: 9000 })));
    await user.click(button(en('streamAlerts.testRaid')));
    await vi.waitFor(() => expect(received).toHaveLength(3));
    expect(received.map((m) => m.alert)).toMatchObject([
      { kind: 'gift', count: 20 },
      { kind: 'bits', amount: 9000 },
      { kind: 'raid', viewers: 77 },
    ]);
    listener.close();
  });

  it('takes turns between the platforms for test alerts when both are on', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const received: { alert: { platform: string } }[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);
    for (let i = 0; i < 3; i++) await user.click(button(en('streamAlerts.testSub')));
    await vi.waitFor(() => expect(received).toHaveLength(3));
    expect(received.map((m) => m.alert.platform)).toEqual(['twitch', 'kick', 'twitch']);
    listener.close();
  });
});
