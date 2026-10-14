import { afterEach, describe, expect, it } from 'vitest';
import {
  buildTasksUrl,
  DEFAULT_TASKS_SETTINGS,
  parseTasksUrl,
  readTasksSettings,
  type TasksSettings,
} from '#/lib/tasks-url';
import type { ViewerMessage } from '../viewer-chat/viewer-chat';
import {
  applyChat,
  emptyTasks,
  loadTasks,
  MAX_TASKS_EACH,
  progressOf,
  shownMembers,
  storageKey,
  TASK_MAX_LENGTH,
  type TasksState,
} from './tasks-state';

const rules = DEFAULT_TASKS_SETTINGS;
const say = (
  name: string,
  text: string,
  overrides: Partial<ViewerMessage> = {},
): ViewerMessage => ({
  kind: 'message',
  platform: 'twitch',
  login: name.toLowerCase(),
  name,
  text,
  mod: false,
  broadcaster: false,
  sub: false,
  aside: false,
  bot: false,
  ...overrides,
});
const run = (state: TasksState, ...messages: ViewerMessage[]) =>
  messages.reduce((current, message) => applyChat(current, message, rules), state);
const tasksOf = (state: TasksState, name: string) =>
  state.members
    .find((member) => member.name === name)
    ?.tasks.map((task) => `${task.done ? 'x' : ' '} ${task.text}`);

describe('applyChat', () => {
  it('adds tasks per viewer and ticks off the first open one', () => {
    const state = run(
      emptyTasks(),
      say('A', '!task read chapter 3'),
      say('A', '!task write notes'),
      say('A', '!done'),
    );
    expect(tasksOf(state, 'A')).toEqual(['x read chapter 3', '  write notes']);
  });

  it('finds open tasks by number, edits and removes them', () => {
    let state = run(
      emptyTasks(),
      say('A', '!task one'),
      say('A', '!task two'),
      say('A', '!task three'),
    );
    state = run(state, say('A', '!done 2'));
    expect(tasksOf(state, 'A')).toEqual(['  one', 'x two', '  three']);
    state = run(state, say('A', '!edit first one'), say('A', '!remove 2'));
    expect(tasksOf(state, 'A')).toEqual(['  first one', 'x two']);
    state = run(state, say('A', '!done 5'), say('A', '!done two'));
    expect(tasksOf(state, 'A')).toEqual(['  first one', 'x two']);
  });

  it('caps open tasks and long text, and drops the oldest done ones first', () => {
    let state = run(emptyTasks(), say('A', `!task ${'x'.repeat(TASK_MAX_LENGTH + 20)}`));
    expect(state.members[0].tasks[0].text).toHaveLength(TASK_MAX_LENGTH);
    state = run(state, say('A', '!task b'), say('A', '!task c'), say('A', '!task d'));
    expect(state.members[0].tasks).toHaveLength(rules.max);
    for (let i = 0; i < MAX_TASKS_EACH + 2; i++)
      state = run(state, say('A', '!done'), say('A', `!task t${i}`));
    expect(state.members[0].tasks.length).toBeLessThanOrEqual(MAX_TASKS_EACH);
  });

  it('takes finished tasks off at once when they are not kept', () => {
    const quick = { ...rules, keepDone: false };
    let state = applyChat(emptyTasks(), say('A', '!task only'), quick);
    state = applyChat(state, say('A', '!done'), quick);
    expect(state.members).toEqual([]);
  });

  it('only lets each viewer change their own tasks, and mods clear and remove', () => {
    let state = run(emptyTasks(), say('A', '!task a1'), say('B', '!task b1'), say('B', '!done'));
    state = run(state, say('C', '!done'), say('C', '!tasks clear'));
    expect(state.members.map((member) => member.name)).toEqual(['A', 'B']);
    state = run(state, say('Mod', '!tasks cleardone', { mod: true }));
    expect(state.members.map((member) => member.name)).toEqual(['A']);
    state = run(state, say('B', '!task b2'), say('Mod', '!tasks remove @b', { mod: true }));
    expect(state.members.map((member) => member.name)).toEqual(['A']);
    state = run(state, say('Mod', '!tasks clear', { mod: true }));
    expect(state).toEqual(emptyTasks());
  });

  it('ignores bots and replies, and a ban takes the viewer off', () => {
    let state = run(
      emptyTasks(),
      say('Nightbot', '!task spam', { bot: true }),
      say('A', '!task reply', { aside: true }),
      say('B', '!task fine'),
    );
    expect(state.members.map((member) => member.name)).toEqual(['B']);
    state = applyChat(state, { kind: 'ban', platform: 'twitch', login: 'b' }, rules);
    expect(state.members).toEqual([]);
  });

  it('shows the broadcaster first and counts progress', () => {
    const state = run(
      emptyTasks(),
      say('A', '!task a'),
      say('Me', '!task mine', { broadcaster: true, mod: true }),
      say('A', '!done'),
    );
    expect(shownMembers(state).map((member) => member.name)).toEqual(['Me', 'A']);
    expect(progressOf(state)).toEqual({ done: 1, total: 2 });
  });
});

describe('task list URL and storage', () => {
  afterEach(() => localStorage.clear());

  it('reads back what it wrote', () => {
    const settings: TasksSettings = {
      ...DEFAULT_TASKS_SETTINGS,
      title: 'Focus & flow',
      max: 2,
      keepDone: false,
      speed: 40,
      color: 'cyan',
    };
    const url = buildTasksUrl('https://x.test', settings, 'Streamer', '', 'tr');
    expect(parseTasksUrl(url)).toEqual({
      settings: { ...settings, platforms: 'twitch' },
      twitchChannel: 'streamer',
      kickChannel: '',
      locale: 'tr',
    });
    expect(readTasksSettings(new URLSearchParams('max=9&speed=1')).max).toBe(5);
    expect(readTasksSettings(new URLSearchParams('max=9&speed=1')).speed).toBe(10);
  });

  it('reads back a saved list and drops garbage', () => {
    const key = storageKey('Streamer', '');
    const good = {
      platform: 'twitch',
      login: 'a',
      name: 'A',
      broadcaster: false,
      tasks: [{ text: 'x', done: true }],
    };
    localStorage.setItem(key, JSON.stringify({ members: [good, { name: 'bad' }] }));
    expect(loadTasks(key)).toEqual({ members: [good] });
    localStorage.setItem(key, 'nope');
    expect(loadTasks(key)).toEqual(emptyTasks());
  });
});
