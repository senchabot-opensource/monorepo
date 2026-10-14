import { screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW_CHANNEL } from '#/features/widgets/goal/use-goal';
import {
  buildGoalUrl,
  DEFAULT_BITS_GOAL_SETTINGS,
  DEFAULT_GOAL_SETTINGS,
  type GoalSettings,
} from '#/lib/goal-url';
import { FakeWebSocket, withLayout } from '#/test/browser';
import { button, en, headings, retype, segment, textbox, toggle, tr } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const PAGE = '/setup/bits-goal';
const ORIGIN = 'http://localhost:3000';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
const count = (label: string) =>
  screen.getByLabelText(label, { selector: 'input' }) as HTMLInputElement;
const color = (name: string) =>
  within(screen.getByLabelText(en('goal.color'), { selector: 'fieldset' })).getByLabelText(
    name,
  ) as HTMLInputElement;
const previewSrc = () =>
  new URL((screen.getByTitle(en('bitsGoal.previewIframeTitle')) as HTMLIFrameElement).src);

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Bits & Kicks Goal overlay route', () => {
  it('shows its own title and goal from a bare type=bits URL', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await renderRoute('/widgets/goal?twitch=streamer&type=bits&start=250');
    const goal = screen.getByTestId('goal');
    expect(goal.dataset.type).toBe('bits');
    expect(goal.textContent).toContain('BITS & KICKS GOAL250/ 1000');
    const twitch = FakeWebSocket.instances.find((ws) => ws.url.includes('twitch'));
    twitch?.open();
    expect(twitch?.sent).toContain('JOIN #streamer');
  });
});

describe('Bits & Kicks Goal setup', () => {
  it('renders its own outline and FAQ', async () => {
    await renderRoute(PAGE);
    expect(headings(1)).toEqual([en('bitsGoal.title')]);
    for (const key of ['faq1Q', 'faq2Q', 'faq3Q', 'faq4Q'] as const) {
      expect(screen.getByText(en(`bitsGoal.${key}`))).toBeTruthy();
    }
    expect(document.body.textContent).toContain('!bitsgoal add 500');
    expect(document.body.textContent).toContain('!bitsgoal reset');
    expect(document.body.textContent).not.toContain('!goal add');
  });

  it('builds the widget URL from every control, always with type=bits', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    expect(urlField().value).toBe('');
    expect(textbox(en('goal.titleLabel')).value).toBe('BITS & KICKS GOAL');
    expect(count(en('goal.target')).value).toBe('1000');

    let settings: GoalSettings = { ...DEFAULT_BITS_GOAL_SETTINGS };
    const expectUrl = (patch: Partial<GoalSettings>) => {
      settings = { ...settings, ...patch };
      expect(urlField().value).toBe(buildGoalUrl(window.location.origin, settings, 'streamer', ''));
    };

    await user.type(twitchField(), 'Streamer');
    expect(urlField().value).toBe(`${ORIGIN}/widgets/goal?twitch=streamer&type=bits`);

    await retype(user, count(en('goal.start')), '1200');
    expectUrl({ start: 1200 });
    await retype(user, count(en('goal.target')), '5000');
    expectUrl({ target: 5000 });
    await user.click(segment(en('goal.style'), en('goal.styleThin')));
    expectUrl({ style: 'thin' });
    await user.click(color(en('subathon.colors.gold')));
    expectUrl({ color: 'gold' });
    await retype(user, textbox(en('goal.titleLabel')), 'Road to 5k');
    expectUrl({ title: 'Road to 5k' });
    await user.click(toggle(en('bitsGoal.showPops')));
    expectUrl({ pops: false });

    expect(urlField().value).toBe(
      `${ORIGIN}/widgets/goal?twitch=streamer&type=bits&style=thin&color=gold&title=Road+to+5k&start=1200&target=5000&pops=0`,
    );
  }, 30_000);

  it('starts the title in the page language, and writes it since the overlay has no language', async () => {
    const user = setupUser();
    await renderRoute(`/tr${PAGE}`);
    expect(textbox(tr('goal.titleLabel')).value).toBe(tr('bitsGoal.defaultTitle'));
    await user.type(textbox(tr('common.twitchChannel')), 'yayinci');
    const url = new URL(textbox(tr('common.widgetUrl')).value);
    expect(url.searchParams.get('type')).toBe('bits');
    expect(url.searchParams.get('title')).toBe(tr('bitsGoal.defaultTitle'));
  });

  it('loads every setting of a pasted Bits & Kicks Goal URL, and rebuilds the same URL', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    const pasted = buildGoalUrl(
      window.location.origin,
      {
        ...DEFAULT_BITS_GOAL_SETTINGS,
        style: 'thin',
        color: 'cyan',
        title: 'Road & 100% 🎉',
        start: 431,
        target: 25_000,
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
    expect(toggle(en('bitsGoal.showPops')).getAttribute('aria-checked')).toBe('false');
    expect(count(en('goal.start')).value).toBe('431');
    expect(count(en('goal.target')).value).toBe('25000');
    expect(textbox(en('common.kickChannel')).value).toBe('kicker');
    await user.tab();
    expect(urlField().value).toBe(pasted);
  });

  it('reads a pasted URL without title or goal as its own defaults', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await retype(user, textbox(en('goal.titleLabel')), 'Something else');
    await user.click(urlField());
    await user.paste('https://extensions.senchabot.com/widgets/goal?kick=kicker&type=bits');
    expect(textbox(en('goal.titleLabel')).value).toBe('BITS & KICKS GOAL');
    expect(count(en('goal.target')).value).toBe('1000');
    expect(segment(en('common.platforms'), 'Kick').checked).toBe(true);
  });

  it('turns down a Sub Goal URL and says where it belongs', async () => {
    const user = setupUser();
    await renderRoute(PAGE);
    await user.click(urlField());
    await user.paste('https://extensions.senchabot.com/widgets/goal?twitch=streamer&target=75');
    expect(urlField().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText(en('bitsGoal.subGoalUrl'))).toBeTruthy();
    expect(count(en('goal.target')).value).toBe('1000');
    expect(twitchField().value).toBe('');

    await user.clear(urlField());
    await user.paste('not a url');
    expect(screen.getByText(en('bitsGoal.widgetUrlInvalid'))).toBeTruthy();
  });

  it('pairs the preview with the page and sends a Bits cheer and a Kicks gift to it', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const received: unknown[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);

    const preview = previewSrc().searchParams.get('preview');
    expect(previewSrc().searchParams.get('simulate')).toBe('1');
    expect(previewSrc().searchParams.get('type')).toBe('bits');
    expect(preview).toBeTruthy();

    await user.click(button(en('bitsGoal.testCheer', { count: 100 })));
    await user.click(button(en('bitsGoal.testKicks', { count: 500 })));
    await user.click(button(en('goal.testReach')));
    await user.click(button(en('goal.testReset')));
    await vi.waitFor(() => expect(received).toHaveLength(4));
    expect(received[0]).toMatchObject({
      type: 'event',
      preview,
      event: { kind: 'bits', platform: 'twitch', amount: 100, name: en('goal.testViewer') },
    });
    expect(received[1]).toMatchObject({ event: { kind: 'bits', platform: 'kick', amount: 500 } });
    expect(received[2]).toMatchObject({ event: { kind: 'mod', text: '!bitsgoal set 1000' } });
    expect(received[3]).toMatchObject({ event: { kind: 'mod', text: '!bitsgoal reset' } });
    listener.close();
  });

  it('sends only the picked platform’s currency, and a reach at the current goal', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const received: { event: { platform: string; amount?: number; text?: string } }[] = [];
    const listener = new BroadcastChannel(PREVIEW_CHANNEL);
    listener.onmessage = ({ data }) => received.push(data);
    await renderRoute(PAGE);

    await user.click(segment(en('common.platforms'), 'Kick'));
    expect(previewSrc().searchParams.get('simplatform')).toBe('kick');
    expect(screen.queryByText(en('bitsGoal.testCheer', { count: 100 }))).toBeNull();
    await retype(user, count(en('goal.target')), '4200');
    await user.click(button(en('bitsGoal.testKicks', { count: 100 })));
    await user.click(button(en('bitsGoal.testKicks', { count: 500 })));
    await user.click(button(en('goal.testReach')));
    await vi.waitFor(() => expect(received).toHaveLength(3));
    expect(received.slice(0, 2).map((m) => [m.event.platform, m.event.amount])).toEqual([
      ['kick', 100],
      ['kick', 500],
    ]);
    expect(received[2].event.text).toBe('!bitsgoal set 4200');
    listener.close();
  });
});

describe('Sub Goal setup with a Bits & Kicks Goal URL', () => {
  it('turns it down, says what it is, and keeps its own settings', async () => {
    const user = setupUser();
    await renderRoute('/setup/sub-goal');
    const bitsUrl = buildGoalUrl(
      window.location.origin,
      { ...DEFAULT_BITS_GOAL_SETTINGS, target: 5000 },
      'streamer',
      '',
    );
    await user.click(urlField());
    await user.paste(bitsUrl);
    expect(urlField().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText(en('bitsGoal.bitsGoalUrl'))).toBeTruthy();
    expect(count(en('goal.target')).value).toBe(String(DEFAULT_GOAL_SETTINGS.target));
    expect(textbox(en('goal.titleLabel')).value).toBe('SUB GOAL');

    await user.clear(urlField());
    await user.paste('not a url');
    expect(screen.getByText(en('goal.widgetUrlInvalid'))).toBeTruthy();
  });
});
