import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREVIEW_CHANNEL as CREDITS_CHANNEL } from '#/features/widgets/credits/use-credits';
import { PREVIEW_CHANNEL as LEADERBOARD_CHANNEL } from '#/features/widgets/leaderboard/use-leaderboard';
import { PREVIEW_CHANNEL as LOWER_THIRD_CHANNEL } from '#/features/widgets/lower-third/use-lower-third';
import { PREVIEW_CHANNEL as QUEUE_CHANNEL } from '#/features/widgets/queue/use-queue';
import { PREVIEW_CHANNEL as TASKS_CHANNEL } from '#/features/widgets/tasks/use-tasks';
import { buildCreditsUrl, DEFAULT_CREDITS_SETTINGS } from '#/lib/credits-url';
import { buildLeaderboardUrl, DEFAULT_LEADERBOARD_SETTINGS } from '#/lib/leaderboard-url';
import { buildLowerThirdUrl, DEFAULT_LOWER_THIRD_SETTINGS } from '#/lib/lower-third-url';
import { buildQueueUrl, DEFAULT_QUEUE_SETTINGS } from '#/lib/queue-url';
import { buildTasksUrl, DEFAULT_TASKS_SETTINGS } from '#/lib/tasks-url';
import { withLayout } from '#/test/browser';
import { button, en, retype, segment, settingsTab, textbox, toggle } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

const urlField = () => textbox(en('common.widgetUrl'));
const twitchField = () => textbox(en('common.twitchChannel'));
const count = (label: string) =>
  screen.getByLabelText(label, { selector: 'input' }) as HTMLInputElement;
const origin = () => window.location.origin;

/** Collects what a setup page sends its preview. */
function listen(name: string) {
  const received: Record<string, unknown>[] = [];
  const channel = new BroadcastChannel(name);
  channel.onmessage = ({ data }) => received.push(data);
  return { received, close: () => channel.close() };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('End Credits setup', () => {
  it('builds the URL from its controls and reads a pasted one back', async () => {
    const user = setupUser();
    await renderRoute('/setup/end-credits');
    await user.type(twitchField(), 'streamer');
    await retype(user, textbox(en('credits.outro')), 'See you!');
    await user.click(toggle(en('credits.sections.chatters')));
    await user.click(settingsTab(en('common.sectionAppearance')));
    await user.click(segment(en('credits.speed'), en('credits.speeds.fast')));
    await user.click(toggle(en('credits.loop')));
    const settings = {
      ...DEFAULT_CREDITS_SETTINGS,
      title: en('credits.defaultTitle'),
      outro: 'See you!',
      sections: { ...DEFAULT_CREDITS_SETTINGS.sections, chatters: false },
      speed: 'fast' as const,
      loop: false,
    };
    const url = buildCreditsUrl(origin(), settings, 'streamer', '', 'en');
    expect(urlField().value).toBe(url);

    await user.clear(twitchField());
    await user.click(urlField());
    await user.paste(url);
    await user.tab();
    expect(urlField().value).toBe(url);
  }, 30_000);

  it('rolls the preview again on its test button', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const { received, close } = listen(CREDITS_CHANNEL);
    await renderRoute('/setup/end-credits');
    await user.click(button(en('credits.testRoll')));
    await vi.waitFor(() => expect(received).toHaveLength(1));
    expect(received[0]).toMatchObject({ type: 'roll' });
    close();
  });
});

describe('Viewer Queue setup', () => {
  it('builds the URL from its controls, with a join word as viewers type it', async () => {
    const user = setupUser();
    await renderRoute('/setup/viewer-queue');
    await user.type(twitchField(), 'streamer');
    // One word: a space typed into the box is dropped.
    await retype(user, textbox(en('queue.join')), '!Play now');
    await user.click(toggle(en('queue.subsOnly')));
    await retype(user, count(en('queue.group')), '4');
    const settings = {
      ...DEFAULT_QUEUE_SETTINGS,
      title: en('queue.defaultTitle'),
      join: '!Playnow',
      subsOnly: true,
      group: 4,
    };
    expect(urlField().value).toBe(buildQueueUrl(origin(), settings, 'streamer', '', 'en'));
    expect(new URL(urlField().value).searchParams.get('join')).toBe('!playnow');
  }, 30_000);

  it('sends joins from numbered test viewers and mod commands', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const { received, close } = listen(QUEUE_CHANNEL);
    await renderRoute('/setup/viewer-queue');
    await user.click(button(en('queue.testJoin')));
    await user.click(button(en('queue.testJoin')));
    await user.click(button(en('queue.testNext')));
    await vi.waitFor(() => expect(received).toHaveLength(3));
    expect(received.map(({ text, mod }) => [text, mod])).toEqual([
      ['!join', false],
      ['!join', false],
      ['!next', true],
    ]);
    expect(received[0].name).not.toBe(received[1].name);
    close();
  });
});

describe('Top Supporters setup', () => {
  it('follows the board with the default title, and keeps a title of your own', async () => {
    const user = setupUser();
    await renderRoute('/setup/top-supporters');
    await user.type(twitchField(), 'streamer');
    await user.click(segment(en('leaderboard.board'), en('leaderboard.boards.cheers')));
    expect(textbox(en('common.setup.titleLabel')).value).toBe(
      en('leaderboard.defaultTitles.cheers'),
    );
    await retype(user, textbox(en('common.setup.titleLabel')), 'Hall of Fame');
    await user.click(segment(en('leaderboard.board'), en('leaderboard.boards.latest')));
    expect(textbox(en('common.setup.titleLabel')).value).toBe('Hall of Fame');
    const settings = {
      ...DEFAULT_LEADERBOARD_SETTINGS,
      board: 'latest' as const,
      title: 'Hall of Fame',
    };
    expect(urlField().value).toBe(buildLeaderboardUrl(origin(), settings, 'streamer', '', 'en'));
  }, 30_000);

  it('sends test support to its preview', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const { received, close } = listen(LEADERBOARD_CHANNEL);
    await renderRoute('/setup/top-supporters');
    await user.click(button(en('eventList.testGift')));
    await vi.waitFor(() => expect(received).toHaveLength(1));
    expect(received[0]).toMatchObject({ type: 'event', event: { kind: 'gift', count: 5 } });
    close();
  });
});

describe('Lower Thirds setup', () => {
  it('gives a URL with no channel, and builds it from its controls', async () => {
    const user = setupUser();
    await renderRoute('/setup/lower-thirds');
    const start = {
      ...DEFAULT_LOWER_THIRD_SETTINGS,
      title: en('lowerThird.defaultTitle'),
      lines: [en('lowerThird.defaultLine')],
    };
    expect(urlField().value).toBe(buildLowerThirdUrl(origin(), start, '', ''));
    await retype(user, textbox(en('common.setup.titleLabel')), 'Pika');
    await user.click(button(en('lowerThird.addLine')));
    await user.type(textbox(en('lowerThird.lineLabel', { n: 2 })), 'Second line');
    await user.click(button(en('lowerThird.removeLine', { n: 1 })));
    await user.click(settingsTab(en('common.sectionAppearance')));
    await user.click(segment(en('lowerThird.corner'), en('irlHud.corners.tr')));
    const settings = { ...start, title: 'Pika', lines: ['Second line'], corner: 'tr' as const };
    expect(urlField().value).toBe(buildLowerThirdUrl(origin(), settings, '', ''));
  }, 30_000);

  it('sends !lt commands to its preview', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const { received, close } = listen(LOWER_THIRD_CHANNEL);
    await renderRoute('/setup/lower-thirds');
    await user.click(button(en('lowerThird.testHide')));
    await vi.waitFor(() => expect(received).toHaveLength(1));
    expect(received[0]).toMatchObject({ type: 'command', text: '!lt hide' });
    close();
  });
});

describe('Task List setup', () => {
  it('builds the URL from its controls', async () => {
    const user = setupUser();
    await renderRoute('/setup/task-list');
    await user.type(twitchField(), 'streamer');
    await retype(user, count(en('tasks.max')), '2');
    await user.click(toggle(en('tasks.keepDone')));
    const settings = {
      ...DEFAULT_TASKS_SETTINGS,
      title: en('tasks.defaultTitle'),
      max: 2,
      keepDone: false,
    };
    expect(urlField().value).toBe(buildTasksUrl(origin(), settings, 'streamer', '', 'en'));
  }, 30_000);

  it('sends numbered test tasks to its preview', async () => {
    withLayout(800, 350);
    const user = setupUser();
    const { received, close } = listen(TASKS_CHANNEL);
    await renderRoute('/setup/task-list');
    await user.click(button(en('tasks.testAdd')));
    await user.click(button(en('tasks.testDone')));
    await vi.waitFor(() => expect(received).toHaveLength(2));
    expect(received.map(({ text }) => text)).toEqual([
      `!task ${en('tasks.testTask', { n: 1 })}`,
      '!done',
    ]);
    close();
  });
});
