import { screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW_CHANNEL } from '#/features/widgets/goal/use-goal';
import { buildGoalUrl, DEFAULT_GOAL_SETTINGS, type GoalSettings } from '#/lib/goal-url';
import { withLayout } from '#/test/browser';
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
    await user.click(color(en('subathon.colors.gold')));
    expectUrl({ color: 'gold' });
    await retype(user, textbox(en('goal.titleLabel')), 'Road to 150');
    expectUrl({ title: 'Road to 150' });
    await user.click(toggle(en('goal.showPops')));
    expectUrl({ pops: false });

    expect(urlField().value).toBe(
      'http://localhost:3000/widgets/goal?twitch=streamer&color=gold&title=Road+to+150&start=120&target=150&pops=0',
    );
  });

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
});
