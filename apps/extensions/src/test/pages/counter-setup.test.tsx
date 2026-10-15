import { screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW_CHANNEL } from '#/features/widgets/counter/use-counter';
import {
  buildCounterUrl,
  type CounterSettings,
  DEFAULT_COUNTER,
  DEFAULT_COUNTER_SETTINGS,
} from '#/lib/counter-url';
import { FakeWebSocket, withLayout } from '#/test/browser';
import { button, en, retype, segment, settingsTab, textbox, toggle } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/counter';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
/** The field with this label in the nth counter (0-based). */
const field = (label: string, index: number) =>
  screen.getAllByLabelText(label, { selector: 'input' })[index] as HTMLInputElement;
const counterFields = () => screen.getAllByLabelText(en('counter.label'), { selector: 'input' });
const color = (name: string) =>
  within(screen.getByLabelText(en('counter.color'), { selector: 'fieldset' })).getByLabelText(
    name,
  ) as HTMLInputElement;
const previewSrc = () =>
  new URL((screen.getByTitle(en('counter.previewIframeTitle')) as HTMLIFrameElement).src);
const values = () => screen.getAllByTestId('counter-value').map((value) => value.textContent);

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Counter overlay route', () => {
  it('falls back to the defaults for garbage params instead of breaking', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await renderRoute(
      '/widgets/counter?twitch=%20Streamer%20&layout=grid&color=rainbow&pops=maybe&c1start=abc',
    );
    expect(screen.getByTestId('counter').dataset.layout).toBe('row');
    expect(screen.getByTestId('counter-label').textContent).toBe('Wins');
    expect(values()).toEqual(['0']);
    const twitch = FakeWebSocket.instances.find((ws) => ws.url.includes('twitch'));
    twitch?.open();
    expect(twitch?.sent).toContain('JOIN #streamer');
  });

  it('reads every counter from the URL', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await renderRoute('/widgets/counter?twitch=12345&c1=Wins&c1start=7&c2=Losses&c2start=3');
    expect(values()).toEqual(['7', '3']);
    const twitch = FakeWebSocket.instances.find((ws) => ws.url.includes('twitch'));
    twitch?.open();
    expect(twitch?.sent).toContain('JOIN #12345');
  });
});

describe('Counter setup', () => {
  it('opens on the preset its link names, as the landing card that showed it sends', async () => {
    withLayout(800, 350);
    await renderRoute(`${PAGE}?preset=pizza`);
    await waitFor(() => expect(previewSrc().searchParams.get('preset')).toBe('pizza'));
    expect(screen.getByText(en('presets.field.hide')).closest('button')?.textContent).toContain(
      'Pizza',
    );
  });

  it('builds the widget URL from every control', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(urlField().value).toBe('');

    await user.type(twitchField(), 'Streamer');
    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/counter?twitch=streamer&c1=Wins&c1cmd=wins&c1icon=%F0%9F%8F%86',
    );

    await retype(user, field(en('counter.label'), 0), 'Ranked Wins');
    await retype(user, field(en('counter.command'), 0), '!RANKED');
    expect(field(en('counter.command'), 0).value).toBe('ranked');
    await retype(user, field(en('counter.icon'), 0), '⭐');
    await retype(user, field(en('counter.start'), 0), '5');
    await user.click(button(en('counter.addCounter')));
    // Its command changed, so Wins is free for the next counter.
    expect(field(en('counter.label'), 1).value).toBe(en('counter.defaults.wins'));

    await user.click(settingsTab(en('common.sectionAppearance')));
    await user.click(segment(en('counter.layout'), en('counter.layouts.stack')));
    await user.click(color(en('subathon.colors.gold')));
    await user.click(toggle(en('counter.showPops')));

    const settings: CounterSettings = {
      ...DEFAULT_COUNTER_SETTINGS,
      color: 'gold',
      layout: 'stack',
      pops: false,
      counters: [
        { label: 'Ranked Wins', command: 'ranked', icon: '⭐', iconUrl: '', start: 5 },
        { label: 'Wins', command: 'wins', icon: '🏆', iconUrl: '', start: 0 },
      ],
    };
    expect(urlField().value).toBe(
      buildCounterUrl(window.location.origin, settings, 'streamer', ''),
    );
  }, 30_000);

  it('adds up to four counters and keeps at least one', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    const add = button(en('counter.addCounter'));
    for (let i = 0; i < 3; i++) await user.click(add);
    expect(counterFields().map((input) => (input as HTMLInputElement).value)).toEqual([
      'Wins',
      'Losses',
      'Draws',
      'Scares',
    ]);
    expect(add.disabled).toBe(true);

    await user.click(button(en('counter.removeCounter', { n: 2 })));
    expect(counterFields()).toHaveLength(3);
    expect(add.disabled).toBe(false);
    // Losses is free again, so it comes back first.
    await user.click(add);
    expect(field(en('counter.command'), 3).value).toBe('losses');

    for (const n of [4, 3, 2]) await user.click(button(en('counter.removeCounter', { n })));
    expect(button(en('counter.removeCounter', { n: 1 })).disabled).toBe(true);
  });

  it('warns about a command another widget or counter already uses', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    await retype(user, field(en('counter.command'), 0), 'goal');
    expect(screen.getByText(en('counter.commandReserved', { command: '!goal' }))).toBeTruthy();

    await retype(user, field(en('counter.command'), 0), 'score');
    await user.click(button(en('counter.addCounter')));
    await retype(user, field(en('counter.command'), 1), 'score');
    expect(
      screen.getByText(en('counter.commandTaken', { command: '!score', fallback: '!count2' })),
    ).toBeTruthy();
  });

  it('loads every setting of a pasted URL, and rebuilds the same URL', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    const pasted = buildCounterUrl(
      window.location.origin,
      {
        platforms: 'both',
        preset: 'classic',
        color: 'cyan',
        layout: 'stack',
        pops: false,
        counters: [
          { label: 'Gülüş & 100% 🎉', command: 'gülüş', icon: '😂', iconUrl: '', start: 431 },
          { ...DEFAULT_COUNTER, label: 'Wins', command: 'w', icon: '' },
        ],
      },
      'streamer',
      'kicker',
    );
    await user.click(urlField());
    await user.paste(pasted);

    expect(textbox(en('common.kickChannel')).value).toBe('kicker');
    expect(field(en('counter.label'), 0).value).toBe('Gülüş & 100% 🎉');
    expect(field(en('counter.command'), 1).value).toBe('w');
    expect(field(en('counter.start'), 0).value).toBe('431');
    await user.click(settingsTab(en('common.sectionAppearance')));
    expect(segment(en('counter.layout'), en('counter.layouts.stack')).checked).toBe(true);
    expect(color(en('subathon.colors.cyan')).checked).toBe(true);
    expect(toggle(en('counter.showPops')).getAttribute('aria-checked')).toBe('false');
    await user.tab();
    expect(urlField().value).toBe(pasted);
  });

  it('pairs the preview with the page and sends test commands to it', async () => {
    // The preview frame only mounts once its box has a size.
    withLayout(800, 350);
    const user = setupUser();
    const received: { type: string; preview: string; text: string }[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);

    const preview = previewSrc().searchParams.get('preview');
    expect(previewSrc().searchParams.get('simulate')).toBe('1');
    expect(preview).toBeTruthy();

    await user.click(button(en('counter.addCounter')));
    await user.click(button('!losses'));
    await user.click(button('!wins -1'));
    await user.click(button(en('counter.testReset')));
    await vi.waitFor(() => expect(received).toHaveLength(4));
    expect(received.map((message) => message.text)).toEqual([
      '!losses',
      '!wins -1',
      '!wins reset',
      '!losses reset',
    ]);
    expect(received.every((message) => message.preview === preview)).toBe(true);
    listener.close();
  });

  it('sizes the preview and the browser source hint for the stacked layout', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    expect(
      screen.getByText((text) =>
        text.includes(en('counter.browserSourceHintSize', { width: 800, height: 260 }).trim()),
      ),
    ).toBeTruthy();
    await user.click(settingsTab(en('common.sectionAppearance')));
    await user.click(segment(en('counter.layout'), en('counter.layouts.stack')));
    expect(
      screen.getByText((text) =>
        text.includes(en('counter.browserSourceHintSize', { width: 440, height: 400 }).trim()),
      ),
    ).toBeTruthy();
  });

  it('saves a channel emote for a counter', async () => {
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
    await user.type(twitchField(), 'streamer');

    const picker = await screen.findByRole(
      'button',
      { name: (name) => name.includes(en('countdown.emoteNone')) },
      { timeout: 5000 },
    );
    await user.click(picker);
    await user.click(screen.getByRole('button', { name: (name) => name.startsWith('catJAM') }));
    await waitFor(() =>
      expect(new URL(urlField().value).searchParams.get('c1iconUrl')).toBe(
        'https://cdn.7tv.app/emote/e1/2x.webp',
      ),
    );
  });
});
