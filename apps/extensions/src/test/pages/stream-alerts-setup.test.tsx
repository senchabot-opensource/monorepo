import { screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW_CHANNEL } from '#/features/widgets/stream-alerts/use-stream-alerts';
import { withLayout } from '#/test/browser';
import { button, en, retype, segment, slider, textbox, toggle, tr } from '#/test/queries';
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
    await user.click(segment(en('streamAlerts.language'), 'Türkçe'));
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
    await user.click(segment(en('streamAlerts.language'), 'Türkçe'));
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
    expect(segment(en('streamAlerts.language'), 'Türkçe').checked).toBe(true);
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
});
