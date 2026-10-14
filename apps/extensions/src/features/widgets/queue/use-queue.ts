import { useCallback, useEffect, useRef, useState } from 'react';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import type { QueueSettings } from '#/lib/queue-url';
import type { SubathonPlatform } from '../subathon/subathon-events';
import {
  useViewerChat,
  type ViewerChatEvent,
  type ViewerMessage,
} from '../viewer-chat/viewer-chat';
import { applyChat, loadQueue, NEXT_COMMAND, type QueueState, storageKey } from './queue-state';

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:queue-preview';
/** A chat line to play in the preview, from a viewer or from a mod. */
export type PreviewMessage = {
  type: 'chat';
  preview: string;
  text: string;
  mod: boolean;
  name: string;
};

// After a test button, simulated changes hold off so the click's effect stands alone.
const SIM_QUIET_AFTER_TEST_MS = 8000;
const SIM_NAMES = [
  'NightOwl',
  'pixelpanda',
  'ChatGremlin',
  'lunaa',
  'GG_Tobi',
  'mochi',
  'Rook',
  'Saitama',
  'Frieren',
  'moonlit',
  'kappa_kid',
  'pixelfox',
];

/** A chat message as the preview plays it. */
export const previewChat = (
  name: string,
  text: string,
  mod: boolean,
  platform: SubathonPlatform = 'twitch',
): ViewerMessage => ({
  kind: 'message',
  platform,
  login: name.toLowerCase(),
  name,
  text,
  mod,
  broadcaster: false,
  sub: true,
  aside: false,
  bot: false,
});

type Rules = Pick<QueueSettings, 'join' | 'subsOnly' | 'max' | 'group'>;

interface UseQueueOptions {
  twitch?: string;
  kick?: string;
  rules: Rules;
  simulate?: boolean;
  previewId?: string;
}

export function useQueue({ twitch, kick, rules, simulate = false, previewId }: UseQueueOptions) {
  const key = simulate ? null : storageKey(twitch, kick);
  const rulesRef = useRef(rules);
  rulesRef.current = rules;
  const [state, setState] = useState<QueueState>(() => {
    if (!simulate) return loadQueue(key);
    // The preview starts with a line, so it shows something at once.
    const waiting = SIM_NAMES.slice(0, 6).map((name, index) => ({
      platform: index % 3 === 1 ? ('kick' as const) : ('twitch' as const),
      login: name.toLowerCase(),
      name,
      note: '',
    }));
    return { open: true, waiting, playing: [] };
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
      // Storage blocked: the queue still works, it just won't survive a reload.
    }
  }, [key, state]);

  useViewerChat(twitch, kick, !simulate, handleChat);

  // Preview: viewers join now and then, and a mod calls the next one up.
  useEffect(() => {
    if (!simulate) return;
    let joined = 6;
    let timer: number;
    const step = () => {
      if (Date.now() - lastTestAt.current >= SIM_QUIET_AFTER_TEST_MS) {
        if (Math.random() < 0.6) {
          const name = SIM_NAMES[joined % SIM_NAMES.length];
          joined++;
          handleChat(
            previewChat(name, rulesRef.current.join, false, joined % 3 ? 'twitch' : 'kick'),
          );
        } else {
          handleChat(previewChat('Mod', NEXT_COMMAND, true));
        }
      }
      timer = window.setTimeout(step, 2500 + Math.random() * 1500);
    };
    timer = window.setTimeout(step, 1500);
    return () => window.clearTimeout(timer);
  }, [simulate, handleChat]);

  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    if (message.type !== 'chat') return;
    lastTestAt.current = Date.now();
    handleChat(previewChat(message.name, message.text, message.mod));
  });

  return state;
}
