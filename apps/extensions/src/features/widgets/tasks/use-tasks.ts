import { useCallback, useEffect, useRef, useState } from 'react';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import type { TasksSettings } from '#/lib/tasks-url';
import type { SubathonPlatform } from '../subathon/subathon-events';
import {
  useViewerChat,
  type ViewerChatEvent,
  type ViewerMessage,
} from '../viewer-chat/viewer-chat';
import { applyChat, loadTasks, storageKey, type TasksState } from './tasks-state';

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:tasks-preview';
export type PreviewMessage = {
  type: 'chat';
  preview: string;
  text: string;
  name: string;
  mod: boolean;
};

const SIM_QUIET_AFTER_TEST_MS = 8000;
const SIM_VIEWERS = ['NightOwl', 'pixelpanda', 'lunaa', 'GG_Tobi', 'mochi', 'Rook'];
// What the preview's viewers work on, handed out in turn. 13 tasks among 6 viewers: each viewer
// gets every task once before one comes back, and by then it has left their list (MAX_TASKS_EACH).
const SIM_TASKS = [
  'Finish chapter 3 notes',
  'Practice scales for 30 min',
  'Reply to emails',
  'Fix the login bug',
  'Read 20 pages',
  'Sketch two thumbnails',
  'Outline the essay',
  'Review flashcards',
  'Clean up the desk',
  'Water the plants',
  'Plan tomorrow',
  'Stretch for 10 min',
  'Update my resume',
];

export const viewerMessage = (
  name: string,
  text: string,
  mod = false,
  platform: SubathonPlatform = 'twitch',
): ViewerMessage => ({
  kind: 'message',
  platform,
  login: name.toLowerCase(),
  name,
  text,
  mod,
  broadcaster: false,
  sub: false,
  aside: false,
  bot: false,
});

/** A message from the preview's `turn`th viewer; every third one chats on Kick. */
function simMessage(turn: number, text: string): ViewerMessage {
  const index = turn % SIM_VIEWERS.length;
  return viewerMessage(SIM_VIEWERS[index], text, false, index % 3 === 2 ? 'kick' : 'twitch');
}

type Rules = Pick<TasksSettings, 'max' | 'keepDone'>;

interface UseTasksOptions {
  twitch?: string;
  kick?: string;
  rules: Rules;
  simulate?: boolean;
  previewId?: string;
}

export function useTasks({ twitch, kick, rules, simulate = false, previewId }: UseTasksOptions) {
  const key = simulate ? null : storageKey(twitch, kick);
  const rulesRef = useRef(rules);
  rulesRef.current = rules;
  const [state, setState] = useState<TasksState>(() => {
    if (!simulate) return loadTasks(key);
    let sample: TasksState = { members: [] };
    SIM_VIEWERS.forEach((_, turn) => {
      sample = applyChat(sample, simMessage(turn, `!task ${SIM_TASKS[turn]}`), rules);
    });
    return applyChat(sample, simMessage(2, '!done'), rules);
  });
  const lastTestAt = useRef(0);

  const handleChat = useCallback((event: ViewerChatEvent) => {
    setState((current) => applyChat(current, event, rulesRef.current));
  }, []);

  useEffect(() => {
    if (!key) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage blocked: the list still works, it just won't survive a reload.
    }
  }, [key, state]);

  useViewerChat(twitch, kick, !simulate, handleChat);

  // Preview: viewers take turns finishing what they're on, then picking up their next task.
  useEffect(() => {
    if (!simulate) return;
    let step = 0;
    let timer: number;
    const tick = () => {
      if (Date.now() - lastTestAt.current >= SIM_QUIET_AFTER_TEST_MS) {
        const turn = Math.floor(step / 2);
        const task = SIM_TASKS[(SIM_VIEWERS.length + turn) % SIM_TASKS.length];
        handleChat(simMessage(turn, step % 2 ? `!task ${task}` : '!done'));
        step++;
      }
      timer = window.setTimeout(tick, 3000 + Math.random() * 1500);
    };
    timer = window.setTimeout(tick, 2500);
    return () => window.clearTimeout(timer);
  }, [simulate, handleChat]);

  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    if (message.type !== 'chat') return;
    lastTestAt.current = Date.now();
    handleChat(viewerMessage(message.name, message.text, message.mod));
  });

  return state;
}
