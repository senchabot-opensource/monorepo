import type { TasksSettings } from '#/lib/tasks-url';
import type { SubathonPlatform } from '../subathon/subathon-events';
import type { ViewerChatEvent } from '../viewer-chat/viewer-chat';

export interface Task {
  text: string;
  done: boolean;
}

/** Someone with tasks on the list. */
export interface Member {
  platform: SubathonPlatform;
  login: string;
  name: string;
  broadcaster: boolean;
  tasks: Task[];
}

export interface TasksState {
  /** In the order they added their first task; the broadcaster is shown first. */
  members: Member[];
}

export const TASK_MAX_LENGTH = 60;
/** Tasks one viewer keeps, open and done together: the oldest done ones go first. */
export const MAX_TASKS_EACH = 8;
export const MAX_MEMBERS = 100;

export const ADD_COMMAND = '!task';
export const DONE_COMMAND = '!done';
export const EDIT_COMMAND = '!edit';
export const REMOVE_COMMAND = '!remove';
export const MOD_COMMAND = '!tasks';

export const emptyTasks = (): TasksState => ({ members: [] });

const cut = (text: string) => Array.from(text.trim()).slice(0, TASK_MAX_LENGTH).join('');

type Rules = Pick<TasksSettings, 'max' | 'keepDone'>;

/**
 * Which of the member's open tasks a command means: `!done` the first one, `!done 2` the second
 * of their open ones. -1 when there's no such task.
 */
function openTaskAt(tasks: readonly Task[], number: string | undefined): number {
  const open = tasks.map((task, index) => ({ task, index })).filter(({ task }) => !task.done);
  if (number === undefined) return open[0]?.index ?? -1;
  if (!/^\d+$/.test(number)) return -1;
  return open[Number(number) - 1]?.index ?? -1;
}

/** The list after one chat event; a ban takes the viewer's tasks off. */
export function applyChat(state: TasksState, event: ViewerChatEvent, rules: Rules): TasksState {
  if (event.kind === 'ban') {
    return {
      members: state.members.filter(
        (member) => !(member.platform === event.platform && member.login === event.login),
      ),
    };
  }
  if (event.aside || event.bot) return state;
  const text = event.text.trim();
  const [word = '', ...rest] = text.split(/\s+/);
  const command = word.toLowerCase();
  const args = rest.join(' ');

  if (command === MOD_COMMAND) return event.mod ? modCommand(state, rest) : state;

  const index = state.members.findIndex(
    (member) => member.platform === event.platform && member.login === event.login,
  );
  const member = index >= 0 ? state.members[index] : null;
  const withMember = (tasks: Task[]): TasksState => {
    if (!member) return state;
    const members = state.members.map((entry, at) => (at === index ? { ...entry, tasks } : entry));
    return { members: members.filter((entry) => entry.tasks.length > 0) };
  };

  switch (command) {
    case ADD_COMMAND: {
      const task = cut(args);
      if (!task) return state;
      if (!member) {
        if (state.members.length >= MAX_MEMBERS) return state;
        const added: Member = {
          platform: event.platform,
          login: event.login,
          name: event.name,
          broadcaster: event.broadcaster,
          tasks: [{ text: task, done: false }],
        };
        return { members: [...state.members, added] };
      }
      if (member.tasks.filter((entry) => !entry.done).length >= rules.max) return state;
      let tasks = [...member.tasks, { text: task, done: false }];
      // Too many: the oldest finished ones make room.
      while (tasks.length > MAX_TASKS_EACH) {
        const doneAt = tasks.findIndex((entry) => entry.done);
        if (doneAt < 0) break;
        tasks = tasks.filter((_, at) => at !== doneAt);
      }
      return withMember(tasks);
    }
    case DONE_COMMAND: {
      if (!member || rest.length > 1) return state;
      const at = openTaskAt(member.tasks, rest[0]);
      if (at < 0) return state;
      const tasks = rules.keepDone
        ? member.tasks.map((task, i) => (i === at ? { ...task, done: true } : task))
        : member.tasks.filter((_, i) => i !== at);
      return withMember(tasks);
    }
    case EDIT_COMMAND: {
      const task = cut(args);
      if (!member || !task) return state;
      const at = openTaskAt(member.tasks, undefined);
      if (at < 0) return state;
      return withMember(
        member.tasks.map((entry, i) => (i === at ? { ...entry, text: task } : entry)),
      );
    }
    case REMOVE_COMMAND: {
      if (!member || rest.length > 1) return state;
      const at =
        rest.length === 0 ? openTaskAt(member.tasks, undefined) : openTaskAt(member.tasks, rest[0]);
      if (at < 0) return state;
      return withMember(member.tasks.filter((_, i) => i !== at));
    }
    default:
      return state;
  }
}

/** A mod's `!tasks clear`, `!tasks cleardone` or `!tasks remove @name`. */
function modCommand(state: TasksState, args: string[]): TasksState {
  const [action = '', name, ...more] = args;
  switch (action.toLowerCase()) {
    case 'clear':
      return args.length === 1 ? emptyTasks() : state;
    case 'cleardone':
      if (args.length !== 1) return state;
      return {
        members: state.members
          .map((member) => ({ ...member, tasks: member.tasks.filter((task) => !task.done) }))
          .filter((member) => member.tasks.length > 0),
      };
    case 'remove': {
      if (!name || more.length > 0) return state;
      const key = name.replace(/^@/, '').toLowerCase();
      return {
        members: state.members.filter(
          (member) => member.login !== key && member.name.toLowerCase() !== key,
        ),
      };
    }
    default:
      return state;
  }
}

/** The members in the order they show: the broadcaster first, then everyone as they came. */
export const shownMembers = (state: TasksState) => [
  ...state.members.filter((member) => member.broadcaster),
  ...state.members.filter((member) => !member.broadcaster),
];

/** Done and total tasks on the list. */
export function progressOf(state: TasksState) {
  const tasks = state.members.flatMap((member) => member.tasks);
  return { done: tasks.filter((task) => task.done).length, total: tasks.length };
}

/** Storage key per channel pair, so every Task List source for the channel shares one list. */
export const storageKey = (twitch = '', kick = '') =>
  `senchabot.tasks:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

const isTask = (value: unknown): value is Task =>
  Boolean(value) &&
  typeof (value as Task).text === 'string' &&
  typeof (value as Task).done === 'boolean';

const isMember = (value: unknown): value is Member => {
  if (!value || typeof value !== 'object') return false;
  const member = value as Record<string, unknown>;
  return (
    (member.platform === 'twitch' || member.platform === 'kick') &&
    typeof member.login === 'string' &&
    typeof member.name === 'string' &&
    typeof member.broadcaster === 'boolean' &&
    Array.isArray(member.tasks) &&
    member.tasks.every(isTask)
  );
};

/** The saved list, or an empty one when there's none or it's garbage. */
export function loadTasks(key: string | null): TasksState {
  if (!key) return emptyTasks();
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) ?? 'null') as {
      members?: unknown;
    } | null;
    if (!saved || !Array.isArray(saved.members)) return emptyTasks();
    return { members: saved.members.filter(isMember).slice(0, MAX_MEMBERS) };
  } catch {
    return emptyTasks();
  }
}
