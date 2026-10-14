import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW_CHANNEL } from '#/features/widgets/event-list/use-event-list';
import {
  buildEventListUrl,
  DEFAULT_EVENT_LIST_SETTINGS,
  type EventListSettings,
} from '#/lib/event-list-url';
import { FakeWebSocket, withLayout } from '#/test/browser';
import { button, en, retype, segment, settingsTab, textbox, toggle } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/event-list';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
const count = (label: string) =>
  screen.getByLabelText(label, { selector: 'input' }) as HTMLInputElement;
const previewSrc = () =>
  new URL((screen.getByTitle(en('eventList.previewIframeTitle')) as HTMLIFrameElement).src);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Event List overlay route', () => {
  it('falls back to the defaults for garbage params instead of breaking', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await renderRoute('/widgets/event-list?twitch=%20Streamer%20&rows=abc&newest=sideways');
    expect(screen.getByTestId('event-list').dataset.newest).toBe('top');
    const twitch = FakeWebSocket.instances.find((ws) => ws.url.includes('twitch'));
    twitch?.open();
    expect(twitch?.sent).toContain('JOIN #streamer');
  });
});

describe('Event List setup', () => {
  it('builds the widget URL from every control', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(urlField().value).toBe('');
    await user.type(twitchField(), 'Streamer');
    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/event-list?twitch=streamer&lang=en',
    );

    await user.click(toggle(en('eventList.kinds.gift')));
    await retype(user, count(en('eventList.minBits')), '100');
    await user.click(settingsTab(en('common.sectionAppearance')));
    await retype(user, count(en('eventList.rows')), '7');
    await user.click(segment(en('eventList.newest'), en('eventList.newestOptions.bottom')));
    await retype(user, textbox(en('common.setup.titleLabel')), 'Recent');

    const settings: EventListSettings = {
      ...DEFAULT_EVENT_LIST_SETTINGS,
      kinds: { ...DEFAULT_EVENT_LIST_SETTINGS.kinds, gift: false },
      minBits: 100,
      rows: 7,
      newest: 'bottom',
      title: 'Recent',
    };
    expect(urlField().value).toBe(
      buildEventListUrl(window.location.origin, settings, 'streamer', '', 'en'),
    );
  }, 30_000);

  it('loads every setting of a pasted URL, and rebuilds the same URL', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    const pasted = buildEventListUrl(
      window.location.origin,
      {
        ...DEFAULT_EVENT_LIST_SETTINGS,
        color: 'cyan',
        kinds: { sub: true, gift: true, bits: false, raid: true },
        fade: 45,
        minRaid: 20,
        title: 'Thanks & 100%',
      },
      'streamer',
      'kicker',
      'en',
    );
    await user.click(urlField());
    await user.paste(pasted);
    expect(textbox(en('common.kickChannel')).value).toBe('kicker');
    expect(toggle(en('eventList.kinds.bits')).getAttribute('aria-checked')).toBe('false');
    expect(count(en('eventList.minRaid')).value).toBe('20');
    await user.tab();
    expect(urlField().value).toBe(pasted);
  });

  it('pairs the preview with the page and sends test events to it', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const received: { event: { kind: string; platform: string } }[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);
    expect(previewSrc().searchParams.get('simulate')).toBe('1');

    await user.click(button(en('eventList.testGift')));
    await user.click(button(en('eventList.testRaid')));
    await vi.waitFor(() => expect(received).toHaveLength(2));
    expect(received.map((message) => message.event.kind)).toEqual(['gift', 'raid']);
    // Both platforms take turns.
    expect(received.map((message) => message.event.platform)).toEqual(['twitch', 'kick']);
    listener.close();
  });
});
