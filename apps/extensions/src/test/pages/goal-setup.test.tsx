import { screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW_CHANNEL } from '#/features/widgets/goal/use-goal';
import { buildGoalUrl, DEFAULT_GOAL_SETTINGS, type GoalSettings } from '#/lib/goal-url';
import { FakeWebSocket, withLayout } from '#/test/browser';
import { button, en, retype, segment, textbox, toggle } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/sub-goal';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
const count = (label: string) =>
  screen.getByLabelText(label, { selector: 'input' }) as HTMLInputElement;
const color = (name: string) =>
  within(screen.getByLabelText(en('goal.color'), { selector: 'fieldset' })).getByLabelText(
    name,
  ) as HTMLInputElement;
const previewSrc = () =>
  new URL((screen.getByTitle(en('goal.previewIframeTitle')) as HTMLIFrameElement).src);

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Sub Goal overlay route', () => {
  it('falls back to the defaults for garbage params instead of breaking', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const title = 'A'.repeat(40);
    await renderRoute(
      `/widgets/goal?twitch=%20Streamer%20&start=abc&target=-3&color=rainbow&pops=maybe&simplatform=youtube&title=${title}`,
    );
    const goal = screen.getByTestId('goal');
    expect(goal.textContent).toContain(`${'A'.repeat(32)}0/ 10`);
    const twitch = FakeWebSocket.instances.find((ws) => ws.url.includes('twitch'));
    twitch?.open();
    expect(twitch?.sent).toContain('JOIN #streamer');
  });

  it('reads a digit-only channel and a starting count as text', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await renderRoute('/widgets/goal?twitch=12345&start=120&target=150');
    expect(screen.getByTestId('goal').textContent).toContain('120/ 150');
    const twitch = FakeWebSocket.instances.find((ws) => ws.url.includes('twitch'));
    twitch?.open();
    expect(twitch?.sent).toContain('JOIN #12345');
  });
});

describe('Sub Goal setup', () => {
  it('builds the widget URL from every control', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(urlField().value).toBe('');

    let settings: GoalSettings = { ...DEFAULT_GOAL_SETTINGS };
    const expectUrl = (patch: Partial<GoalSettings>) => {
      settings = { ...settings, ...patch };
      expect(urlField().value).toBe(buildGoalUrl(window.location.origin, settings, 'streamer', ''));
    };

    await user.type(twitchField(), 'Streamer');
    expect(urlField().value).toBe('http://localhost:3000/widgets/goal?twitch=streamer');

    await retype(user, count(en('goal.start')), '120');
    expectUrl({ start: 120 });
    await retype(user, count(en('goal.target')), '150');
    expectUrl({ target: 150 });
    await user.click(segment(en('goal.style'), en('goal.styleThin')));
    expectUrl({ style: 'thin' });
    await user.click(color(en('subathon.colors.gold')));
    expectUrl({ color: 'gold' });
    await retype(user, textbox(en('goal.titleLabel')), 'Road to 150');
    expectUrl({ title: 'Road to 150' });
    await user.click(toggle(en('goal.showPops')));
    expectUrl({ pops: false });

    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/goal?twitch=streamer&style=thin&color=gold&title=Road+to+150&start=120&target=150&pops=0',
    );
  }, 30_000);

  it('keeps the goal at 1 or more', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await retype(user, count(en('goal.target')), '0');
    await user.click(twitchField());
    expect(count(en('goal.target')).value).toBe('1');
  });

  it('loads a pasted widget URL back into the controls', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.click(urlField());
    await user.paste(
      'https://extensions.senchabot.com/widgets/goal?kick=kicker&start=40&target=75',
    );

    expect(textbox(en('common.kickChannel')).value).toBe('kicker');
    expect(segment(en('common.platforms'), 'Kick').checked).toBe(true);
    expect(count(en('goal.start')).value).toBe('40');
    expect(count(en('goal.target')).value).toBe('75');
  });

  it('pairs the preview with the page and sends test events to it', async () => {
    // The preview frame only mounts once its box has a size.
    withLayout(800, 350);
    const user = setupUser();
    const received: unknown[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);

    const preview = previewSrc().searchParams.get('preview');
    expect(previewSrc().searchParams.get('simulate')).toBe('1');
    expect(preview).toBeTruthy();

    await user.click(button(en('goal.testGift')));
    await user.click(button(en('goal.testReach')));
    await vi.waitFor(() => expect(received).toHaveLength(2));
    expect(received[0]).toMatchObject({
      type: 'event',
      preview,
      event: { kind: 'gift', count: 5 },
    });
    expect(received[1]).toMatchObject({ event: { kind: 'mod', text: '!goal set 10' } });
    listener.close();
  });

  it('loads every setting of a pasted URL, and rebuilds the same URL', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    const pasted = buildGoalUrl(
      window.location.origin,
      {
        platforms: 'both',
        preset: 'classic',
        style: 'thin',
        color: 'cyan',
        title: 'Road & 100% 🎉',
        start: 431,
        target: 500,
        end: 'stay',
        endHold: 0,
        icon: '',
        iconUrl: '',
        pops: false,
      },
      'streamer',
      'kicker',
    );
    await user.click(urlField());
    await user.paste(pasted);

    expect(segment(en('goal.style'), en('goal.styleThin')).checked).toBe(true);
    expect(color(en('subathon.colors.cyan')).checked).toBe(true);
    expect(textbox(en('goal.titleLabel')).value).toBe('Road & 100% 🎉');
    expect(toggle(en('goal.showPops')).getAttribute('aria-checked')).toBe('false');
    expect(count(en('goal.start')).value).toBe('431');
    await user.tab();
    expect(urlField().value).toBe(pasted);
  });

  it('keeps an emptied title in the URL, so the overlay shows none', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    await user.clear(textbox(en('goal.titleLabel')));
    expect(new URL(urlField().value).searchParams.get('title')).toBe('');
  });

  it('holds the starting count to the top of the scale', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.type(twitchField(), 'streamer');
    await retype(user, count(en('goal.start')), '99999999');
    await user.click(twitchField());
    expect(count(en('goal.start')).value).toBe('1000000');
    expect(new URL(urlField().value).searchParams.get('start')).toBe('1000000');
  });

  it('sends test subs from the one picked platform, and a reach at the current goal', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const received: { event: { platform: string; text?: string } }[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);

    await user.click(segment(en('common.platforms'), 'Kick'));
    expect(previewSrc().searchParams.get('simplatform')).toBe('kick');
    await retype(user, count(en('goal.target')), '42');
    await user.click(button(en('goal.testSub')));
    await user.click(button(en('goal.testSub')));
    await user.click(button(en('goal.testReach')));
    await vi.waitFor(() => expect(received).toHaveLength(3));
    expect(received.slice(0, 2).map((m) => m.event.platform)).toEqual(['kick', 'kick']);
    expect(received[2].event.text).toBe('!goal set 42');
    listener.close();
  });

  it('saves the icon box and a channel emote', async () => {
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

    await retype(user, textbox(en('goal.iconLabel')), '⭐');
    expect(new URL(urlField().value).searchParams.get('icon')).toBe('⭐');

    const picker = await screen.findByRole(
      'button',
      { name: (name) => name.includes(en('countdown.emoteNone')) },
      { timeout: 5000 },
    );
    await user.click(picker);
    await user.click(screen.getByRole('button', { name: (name) => name.startsWith('catJAM') }));
    await waitFor(() =>
      expect(new URL(urlField().value).searchParams.get('iconUrl')).toBe(
        'https://cdn.7tv.app/emote/e1/2x.webp',
      ),
    );
  });
});
