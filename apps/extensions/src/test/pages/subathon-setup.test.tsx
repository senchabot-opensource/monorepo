import { fireEvent, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW_CHANNEL } from '#/features/widgets/subathon/use-subathon';
import type { Locale } from '#/lib/i18n';
import {
  buildSubathonUrl,
  DEFAULT_SUBATHON_SETTINGS,
  type SubathonSettings,
} from '#/lib/subathon-url';
import { withLayout } from '#/test/browser';
import { button, en, retype, segment, slider, textbox, toggle } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/subathon-timer';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
/** One box of a DurationField, e.g. the minutes of Per Gifted Sub. */
const durationBox = (label: string, unit: string) =>
  within(screen.getByRole('group', { name: label })).getByLabelText(unit) as HTMLInputElement;
/** A time value's one box, in whole minutes. */
const minutes = (label: string) =>
  screen.getByLabelText(label, { selector: 'input' }) as HTMLInputElement;
const tab = (name: string) => screen.getByRole('tab', { name });
const color = (name: string) =>
  within(screen.getByLabelText(en('subathon.color'), { selector: 'fieldset' })).getByLabelText(
    name,
  ) as HTMLInputElement;
const previewSrc = () =>
  new URL((screen.getByTitle(en('subathon.previewIframeTitle')) as HTMLIFrameElement).src);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Subathon Timer setup', () => {
  it('builds the widget URL from every kind of control', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(urlField().value).toBe('');

    let settings: SubathonSettings = { ...DEFAULT_SUBATHON_SETTINGS, rates: true };
    let locale: Locale = 'en';
    const expectUrl = (patch: Partial<SubathonSettings>) => {
      settings = { ...settings, ...patch };
      expect(urlField().value).toBe(
        buildSubathonUrl(window.location.origin, settings, 'streamer', '', locale),
      );
    };

    await user.type(twitchField(), 'Streamer');
    // New timers list their rates, in the page's language.
    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/subathon?twitch=streamer&rates=1&lang=en',
    );

    await user.click(segment(en('subathon.style'), en('subathon.styleRing')));
    expectUrl({ style: 'ring' });
    await user.click(color(en('subathon.colors.purple')));
    expectUrl({ color: 'purple' });
    await retype(user, textbox(en('subathon.titleLabel')), 'Big Stream');
    expectUrl({ title: 'Big Stream' });

    await retype(user, durationBox(en('subathon.startTime'), en('subathon.unitHours')), '4');
    expectUrl({ start: 4 * 3600 });
    await retype(user, durationBox(en('subathon.maxTime'), en('subathon.unitHours')), '24');
    expectUrl({ cap: 24 * 3600 });
    await user.click(segment(en('subathon.startMode'), en('subathon.startAuto')));
    expectUrl({ autostart: true });

    // Twitch values show first; Kick's are one tab over.
    await retype(user, minutes(en('subathon.perBits')), '0');
    expectUrl({ bits: 0 });
    await user.click(toggle(en('subathon.tiers')));
    expectUrl({ tiers: false });
    await user.click(tab('Kick'));
    expect(tab('Kick').getAttribute('aria-selected')).toBe('true');
    expect(screen.queryByRole('switch', { name: en('subathon.tiers') })).toBeNull();
    await retype(user, minutes(en('subathon.perKicks')), '2');
    expectUrl({ kicks: 120 });

    await user.click(toggle(en('subathon.showPercent')));
    expectUrl({ percent: false });
    await user.click(toggle(en('subathon.showPops')));
    expectUrl({ pops: false });
    await user.click(segment(en('subathon.ratesLanguage'), 'Türkçe'));
    locale = 'tr';
    expectUrl({});
    await user.click(toggle(en('subathon.showRates')));
    expectUrl({ rates: false });
    expect(screen.queryByText(en('subathon.ratesLanguage'))).toBeNull();

    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/subathon?twitch=streamer&style=ring&color=purple' +
        '&title=Big+Stream&time=14400&cap=86400&bits=0&kicks=120&tiers=0&autostart=1&pct=0&pops=0',
    );
  }, 60_000);

  it('starts Adjust rates by time at 5 hours with lower rates, and clears them when off', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    const base = urlField().value;
    await user.click(toggle(en('subathon.dynamicRates')));
    const params = new URL(urlField().value).searchParams;
    expect(params.get('shift')).toBe('18000');
    expect(['tsub2', 'tgift2', 'bits2'].map((key) => params.get(key))).toEqual([
      '300',
      '600',
      '1200',
    ]);
    expect(['ksub2', 'kgift2', 'kicks2'].map((key) => params.get(key))).toEqual([
      '600',
      '600',
      '600',
    ]);
    await user.click(toggle(en('subathon.dynamicRates')));
    expect(urlField().value).toBe(base);
  });

  it('shows only the picked platform, without tabs', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.click(segment(en('common.platforms'), 'Kick'));
    expect(screen.queryByRole('tab')).toBeNull();
    expect(minutes(en('subathon.perKicks'))).toBeTruthy();
    expect(screen.queryByLabelText(en('subathon.perBits'))).toBeNull();
  });

  it('moves between the platform tabs with the arrow keys', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    tab('Twitch').focus();
    await user.keyboard('{ArrowRight}');
    expect(tab('Kick').getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tab('Kick'));
  });

  it('carries minutes over into hours, and starts at least a minute in', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    const start = (unit: string) => durationBox(en('subathon.startTime'), unit);
    await retype(user, start(en('subathon.unitMinutes')), '90');
    expect(start(en('subathon.unitHours')).value).toBe('2');
    expect(start(en('subathon.unitMinutes')).value).toBe('30');

    await retype(user, start(en('subathon.unitHours')), '0');
    await retype(user, start(en('subathon.unitMinutes')), '0');
    await user.click(twitchField());
    expect(start(en('subathon.unitMinutes')).value).toBe('1');
  }, 30_000);

  it('loads a pasted widget URL back into the controls', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.click(urlField());
    await user.paste(
      'https://extensions.senchabot.com/widgets/subathon?kick=kicker&style=clock&time=7200&kgift=120',
    );

    expect(textbox(en('common.kickChannel')).value).toBe('kicker');
    expect(segment(en('subathon.style'), en('subathon.styleClock')).checked).toBe(true);
    expect(durationBox(en('subathon.startTime'), en('subathon.unitHours')).value).toBe('2');
    expect(minutes(en('subathon.perGift')).value).toBe('2');
  }, 30_000);

  it('gives back the same URL for a pasted one with every setting changed', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    const pasted =
      'http://localhost:3000/widgets/subathon?twitch=streamer&kick=kicker&style=clock&color=gold' +
      '&title=Day+3&time=5430&cap=90000&tsub=120&tgift=0&bits=90&ksub=30&kgift=180&kicks=600' +
      '&tiers=0&autostart=1&pct=0&pops=0';
    await user.click(urlField());
    await user.paste(pasted);
    expect(urlField().value).toBe(pasted);
  });

  it("keeps a pasted timer's rates language", async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    const pasted = 'http://localhost:3000/widgets/subathon?twitch=streamer&rates=1&lang=tr';
    await user.click(urlField());
    await user.paste(pasted);
    expect(urlField().value).toBe(pasted);
    expect(segment(en('subathon.ratesLanguage'), 'Türkçe').checked).toBe(true);
  });

  it('sends the remove and reset commands the chat would', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const received: unknown[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);
    await user.click(button(en('subathon.testRemove')));
    await user.click(button(en('subathon.testReset')));
    await vi.waitFor(() => expect(received).toHaveLength(2));
    expect(received).toMatchObject([
      { type: 'event', event: { kind: 'mod', text: '!subathon remove 10m' } },
      { type: 'event', event: { kind: 'mod', text: '!subathon reset' } },
    ]);
    listener.close();
  });

  it('previews with the chosen speed and sends test events to the preview', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const received: unknown[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);

    expect(previewSrc().searchParams.get('simulate')).toBe('1');
    expect(previewSrc().searchParams.get('simspeed')).toBe('60');
    fireEvent.change(slider(en('subathon.previewSpeed')), { target: { value: '0' } });
    expect(previewSrc().searchParams.get('simspeed')).toBe('1');

    await user.click(button(en('subathon.testGift')));
    await user.click(button(en('subathon.testPause')));
    await vi.waitFor(() => expect(received).toHaveLength(2));
    // Tagged with the preview's id, so previews and demos in other tabs ignore them.
    const preview = previewSrc().searchParams.get('preview');
    expect(preview).toBeTruthy();
    expect(received[0]).toMatchObject({
      type: 'event',
      preview,
      event: { kind: 'gift', platform: 'kick', count: 5 },
    });
    expect(received[1]).toEqual({ type: 'toggle', preview });
    listener.close();
  });

  it('tests only the picked platform', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const received: { event?: { platform: string } }[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);
    await user.click(segment(en('common.platforms'), 'Twitch'));
    expect(previewSrc().searchParams.get('simplatform')).toBe('twitch');

    // The gift button prefers Kick, which is off now.
    await user.click(button(en('subathon.testGift')));
    await vi.waitFor(() => expect(received).toHaveLength(1));
    expect(received[0].event?.platform).toBe('twitch');

    // Twitch gifts off: the Kick value left behind doesn't keep the button on.
    await retype(user, minutes(en('subathon.perGift')), '0');
    expect(button(en('subathon.testGift')).disabled).toBe(true);
    listener.close();
  });

  it('turns a test button off only when both platforms turn that event off', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await retype(user, minutes(en('subathon.perSub')), '0');
    expect(button(en('subathon.testSub')).disabled).toBe(false);
    await user.click(tab('Kick'));
    await retype(user, minutes(en('subathon.perSub')), '0');
    expect(button(en('subathon.testSub')).disabled).toBe(true);
  });
});
