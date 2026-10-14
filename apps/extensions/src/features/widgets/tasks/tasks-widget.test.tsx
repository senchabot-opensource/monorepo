import { act, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_TASKS_SETTINGS, type TasksSettings } from '#/lib/tasks-url';
import { FakeWebSocket } from '#/test/browser';
import { renderWithProviders } from '#/test/render';
import { storageKey } from './tasks-state';
import { TasksWidget } from './tasks-widget';
import { PREVIEW_CHANNEL } from './use-tasks';

const kickLookup = vi.hoisted(() => vi.fn());
vi.mock('#/lib/kick', async (importOriginal) => ({
  ...(await importOriginal<typeof import('#/lib/kick')>()),
  getKickChannelInfo: kickLookup,
}));

const say = (name: string, text: string, tags = 'badges=') =>
  act(() => {
    const ws = [...FakeWebSocket.instances]
      .reverse()
      .find((socket) => socket.url.includes('twitch'));
    ws?.receive(
      `@display-name=${name};${tags};room-id=1 :${name.toLowerCase()}!x@x.tmi.twitch.tv PRIVMSG #streamer :${text}`,
    );
  });
const tasks = () =>
  screen
    .queryAllByTestId('tasks-task')
    .map((task) => `${task.dataset.done === 'true' ? 'x' : ' '} ${task.textContent}`);

const { platforms: _, ...DEFAULTS } = DEFAULT_TASKS_SETTINGS;
const settings = (overrides: Partial<Omit<TasksSettings, 'platforms'>> = {}) => ({
  ...DEFAULTS,
  ...overrides,
});
const render = (ui: React.ReactNode) => renderWithProviders(ui, '/widgets/tasks');

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  kickLookup.mockReset().mockResolvedValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('TasksWidget', () => {
  it('lists tasks from chat with progress, the broadcaster first', async () => {
    await render(<TasksWidget twitchChannel="streamer" settings={settings()} />);
    expect(screen.getByTestId('tasks-empty')).toBeTruthy();
    say('Viewer', '!task read chapter 3');
    say('Me', '!task edit the video', 'badges=broadcaster/1');
    say('Viewer', '!done');
    expect(tasks()).toEqual(['  edit the video', 'x ✓read chapter 3']);
    expect(screen.getByTestId('tasks-progress').textContent).toBe('1/2');
    expect(screen.getByTestId('tasks-title').textContent).toBe('Today’s Tasks');
  });

  it('keeps the list through a reload, and a mod clears it', async () => {
    const first = await render(<TasksWidget twitchChannel="streamer" settings={settings()} />);
    say('Viewer', '!task keep me');
    first.unmount();
    expect(JSON.parse(localStorage.getItem(storageKey('streamer')) ?? 'null').members).toHaveLength(
      1,
    );
    await render(<TasksWidget twitchChannel="streamer" settings={settings()} />);
    expect(tasks()).toEqual(['  keep me']);
    say('Mod', '!tasks clear', 'badges=moderator/1;mod=1');
    expect(tasks()).toEqual([]);
  });

  it('starts the preview with a list and plays its test commands', async () => {
    await render(<TasksWidget settings={settings()} simulate previewId="p1" />);
    expect(FakeWebSocket.instances).toHaveLength(0);
    expect(tasks().length).toBeGreaterThan(3);
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.postMessage({
      type: 'chat',
      preview: 'p1',
      text: '!task test task 1',
      name: 'You',
      mod: false,
    });
    await vi.waitFor(() => expect(tasks()).toContain('  test task 1'));
    channel.close();
  });

  it('lets the preview viewers take turns without repeating a task they still show', async () => {
    await render(<TasksWidget settings={settings()} simulate previewId="p1" />);
    // Every preview viewer through all of their tasks, three times over.
    act(() => vi.advanceTimersByTime(3 * 13 * 6 * 2 * 4500));
    const members = screen.getAllByTestId('tasks-member');
    const names = members.map(
      (member) => member.querySelector('span:not([aria-hidden])')?.textContent,
    );
    expect(new Set(names).size).toBe(6);
    expect(names).toHaveLength(6);
    for (const member of members) {
      const texts = within(member)
        .getAllByTestId('tasks-task')
        .map((task) => task.textContent?.replace(/^✓/, ''));
      expect(texts.length).toBeGreaterThan(1);
      expect(new Set(texts).size).toBe(texts.length);
    }
  });
});
