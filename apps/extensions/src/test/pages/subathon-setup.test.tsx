import { fireEvent, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW_CHANNEL } from '#/features/widgets/subathon/use-subathon';
import {
  buildSubathonUrl,
  DEFAULT_SUBATHON_SETTINGS,
  type SubathonSettings,
} from '#/lib/subathon-url';
import { button, en, retype, segment, slider, textbox, toggle } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/subathon-timer';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
/** One box of a DurationField, e.g. the minutes of Per Sub. */
const durationBox = (label: string, unit: string) =>
  within(screen.getByRole('group', { name: label })).getByLabelText(unit) as HTMLInputElement;
const color = (name: string) =>
  within(screen.getByLabelText(en('subathon.color'), { selector: 'fieldset' })).getByLabelText(
    name,
  ) as HTMLInputElement;
const previewSrc = () =>
  new URL((screen.getByTitle(en('subathon.previewIframeTitle')) as HTMLIFrameElement).src);

// jsdom lays nothing out, and the preview only mounts once it has a size to scale into.
function withLayout(width: number, height: number) {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(width);
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(height);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Subathon Timer setup', () => {
  it('builds the widget URL from every kind of control', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(urlField().value).toBe('');

    let settings: SubathonSettings = { ...DEFAULT_SUBATHON_SETTINGS, platforms: 'both' };
    const expectUrl = (patch: Partial<SubathonSettings>) => {
      settings = { ...settings, ...patch };
      expect(urlField().value).toBe(
        buildSubathonUrl(window.location.origin, settings, 'streamer', ''),
      );
    };

    await user.type(twitchField(), 'Streamer');
    expect(urlField().value).toBe('http://localhost:3000/widgets/subathon?twitch=streamer');

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

    await retype(user, durationBox(en('subathon.perSub'), en('subathon.unitMinutes')), '5');
    expectUrl({ sub: 300 });
    await retype(user, durationBox(en('subathon.perBits'), en('subathon.unitSeconds')), '0');
    expectUrl({ bits: 0 });
    await user.click(toggle(en('subathon.tiers')));
    expectUrl({ tiers: false });
    await user.click(toggle(en('subathon.showPercent')));
    expectUrl({ percent: false });
    await user.click(toggle(en('subathon.showPops')));
    expectUrl({ pops: false });

    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/subathon?twitch=streamer&style=ring&color=purple' +
        '&title=Big+Stream&time=14400&cap=86400&sub=300&bits=0&tiers=0&autostart=1&pct=0&pops=0',
    );
  });

  it('carries minutes over into hours', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await retype(user, durationBox(en('subathon.startTime'), en('subathon.unitMinutes')), '90');
    expect(durationBox(en('subathon.startTime'), en('subathon.unitHours')).value).toBe('2');
    expect(durationBox(en('subathon.startTime'), en('subathon.unitMinutes')).value).toBe('30');
  });

  it('loads a pasted widget URL back into the controls', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.click(urlField());
    await user.paste(
      'https://extensions.senchabot.com/widgets/subathon?kick=kicker&style=clock&time=7200&gift=30',
    );

    expect(textbox(en('common.kickChannel')).value).toBe('kicker');
    expect(segment(en('subathon.style'), en('subathon.styleClock')).checked).toBe(true);
    expect(durationBox(en('subathon.startTime'), en('subathon.unitHours')).value).toBe('2');
    expect(durationBox(en('subathon.perGift'), en('subathon.unitSeconds')).value).toBe('30');
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
    expect(received[0]).toMatchObject({ type: 'event', event: { kind: 'gift', count: 5 } });
    expect(received[1]).toEqual({ type: 'toggle' });
    listener.close();
  });

  it('disables a test button whose value is turned off', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await retype(user, durationBox(en('subathon.perSub'), en('subathon.unitMinutes')), '0');
    expect(button(en('subathon.testSub')).disabled).toBe(true);
  });
});
