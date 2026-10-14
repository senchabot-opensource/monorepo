import { useCallback, useEffect, useRef, useState } from 'react';
import type { KickChannel } from '#/hooks/use-kick-channel';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import type { FeaturedMode } from '#/lib/featured-url';
import type { SubathonPlatform } from '../subathon/subathon-events';
import { useFeaturedChat } from './featured-chat';
import {
  applyChat,
  type ChatLine,
  expire,
  FEATURE_COMMAND,
  type FeaturedChatEvent,
  type FeaturedMessage,
  type FeaturedState,
  loadState,
  QUESTION_COMMAND,
  type ShownLine,
  savedState,
  serializeEmoteRanges,
  storageKey,
} from './featured-state';

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:featured-preview';
/** A chat line to play in the preview, from a viewer or from a mod. */
export type PreviewMessage = {
  type: 'chat';
  preview: string;
  text: string;
  name: string;
  mod: boolean;
};

// After a test button, simulated changes hold off so the click's effect stands alone.
const SIM_QUIET_AFTER_TEST_MS = 8000;
const SIM_STEP_MS = 3500;

interface SimChatter {
  name: string;
  platform: SubathonPlatform;
  color: string;
  badges: string[];
}

const SIM_CHATTERS: SimChatter[] = [
  { name: 'NightOwl', platform: 'twitch', color: '#8A2BE2', badges: ['subscriber/12'] },
  { name: 'pixelpanda', platform: 'kick', color: '#FF69B4', badges: ['subscriber/3'] },
  { name: 'lunaa', platform: 'twitch', color: '#1E90FF', badges: ['vip/1', 'subscriber/6'] },
  { name: 'GG_Tobi', platform: 'kick', color: '#38BDF8', badges: ['og'] },
  { name: 'mochi', platform: 'twitch', color: '#F59E0B', badges: [] },
  { name: 'Rook', platform: 'twitch', color: '#22C55E', badges: ['moderator/1', 'subscriber/24'] },
  { name: 'moonlit', platform: 'kick', color: '#E0E7FF', badges: ['vip'] },
  { name: 'kappa_kid', platform: 'twitch', color: '#FF4500', badges: ['subscriber/1'] },
];

// "{e}" is the platform's emote: Kappa on Twitch, LULW on Kick. The 7TV names come from the
// sample emote map, so the preview shows all three kinds.
const SIM_LINES = [
  'that clutch was unreal PepePls',
  'chat is this the best run so far? {e}',
  'the music on this stream is always so good peepoHappy',
  'first time catching the stream live, hi everyone!',
  'that jump was frame perfect, no way {e}',
  'GG! what a comeback',
  'cozy stream tonight RainTime',
  'saving this one for the highlight reel {e}',
];
const SIM_QUESTIONS = [
  'What got you into speedrunning?',
  'Which game are you playing next week? peepoHappy',
  'Any tips for someone starting their first stream?',
  'What keyboard are you using?',
  'Coffee or tea while streaming? {e}',
  'How long did it take to learn this route?',
];

/** 7TV emotes for the preview, which has no channel to load them from. */
export const SIM_EMOTES = new Map([
  ['RainTime', 'https://cdn.7tv.app/emote/01FCY771D800007PQ2DF3GDTN6/2x.webp'],
  ['PepePls', 'https://cdn.7tv.app/emote/01GAFTZ9K80003DHH026MC7JW0/2x.webp'],
  ['peepoHappy', 'https://cdn.7tv.app/emote/01GAZ199Z8000FEWHS6AT5QZV0/2x.webp'],
]);
const SIM_TWITCH_EMOTES: Record<string, string> = { Kappa: '25', Keepo: '1902' };
const SIM_KICK_EMOTE = '[emote:37227:LULW]';

/** The IRC emotes tag Twitch would send with `text`, for the Twitch emotes it names. */
function twitchEmotesTag(text: string): string | undefined {
  const ranges = [];
  let at = 0;
  for (const word of text.split(' ')) {
    const length = [...word].length;
    const id = SIM_TWITCH_EMOTES[word];
    if (id) ranges.push({ id, start: at, end: at + length - 1 });
    at += length + 1;
  }
  return serializeEmoteRanges(ranges);
}

let simId = 0;

/** A chat message as the preview plays it. */
export function previewChat(
  name: string,
  text: string,
  mod: boolean,
  chatter: Partial<SimChatter> = {},
): FeaturedMessage {
  const platform = chatter.platform ?? 'twitch';
  const display =
    platform === 'kick' ? text.replaceAll('{e}', SIM_KICK_EMOTE) : text.replaceAll('{e}', 'Kappa');
  simId += 1;
  return {
    kind: 'message',
    platform,
    login: name.toLowerCase(),
    name,
    text: display.replace(/\[emote:\d+:([\w-]+)\]/g, '$1'),
    mod,
    broadcaster: false,
    sub: true,
    aside: false,
    bot: false,
    id: `preview-${simId}`,
    ...(chatter.color ? { color: chatter.color } : {}),
    badges: chatter.badges ?? (mod ? ['moderator/1'] : []),
    display,
    ...(platform === 'twitch' ? { emotes: twitchEmotesTag(display) } : {}),
  };
}

const simSay = (chatter: SimChatter, text: string) =>
  previewChat(chatter.name, text, false, chatter);
const simMod = (text: string) => previewChat('Mod', text, true);

/** The preview's chatters: one platform's, when the setup page picked one. */
const simChatters = (platform?: SubathonPlatform) =>
  platform ? SIM_CHATTERS.filter((chatter) => chatter.platform === platform) : SIM_CHATTERS;

/** The preview starts with chat, questions waiting and something on screen, so it shows at once. */
function simStart(mode: FeaturedMode, platform?: SubathonPlatform): FeaturedState {
  const chatters = simChatters(platform);
  const now = Date.now();
  let state: FeaturedState = { recent: [], questions: [], shown: null };
  const play = (event: FeaturedChatEvent) => {
    state = applyChat(state, event, mode, now);
  };
  chatters.forEach((chatter, index) => {
    play(simSay(chatter, SIM_LINES[index % SIM_LINES.length]));
  });
  if (mode !== 'feature') {
    chatters.slice(0, 3).forEach((chatter, index) => {
      play(simSay(chatter, `${QUESTION_COMMAND} ${SIM_QUESTIONS[index]}`));
    });
  }
  play(
    mode === 'qa'
      ? simMod(`${QUESTION_COMMAND} next`)
      : simMod(`${FEATURE_COMMAND} @${chatters[0].name}`),
  );
  return state;
}

// Every other step changes the screen, so something new goes up every SIM_STEP_MS × 2.
type SimStep = 'chat' | 'ask' | 'next' | 'feature';
const SIM_SCRIPT: Record<FeaturedMode, SimStep[]> = {
  both: ['ask', 'next', 'chat', 'feature'],
  feature: ['chat', 'feature'],
  qa: ['ask', 'next'],
};

/** What is on screen and what waits; the remembered chat stays out, so chat alone never redraws. */
export interface FeaturedView {
  questions: ChatLine[];
  shown: ShownLine | null;
}

interface UseFeaturedOptions {
  twitch?: string;
  kick?: string;
  mode: FeaturedMode;
  /** Seconds the shown message stays; 0 keeps it. */
  hide: number;
  simulate?: boolean;
  simPlatform?: SubathonPlatform;
  previewId?: string;
}

export function useFeatured({
  twitch,
  kick,
  mode,
  hide,
  simulate = false,
  simPlatform,
  previewId,
}: UseFeaturedOptions): { view: FeaturedView; kickChannel: KickChannel | null } {
  const key = simulate ? null : storageKey(twitch, kick);
  const [initial] = useState(() => (simulate ? simStart(mode, simPlatform) : loadState(key)));
  const stateRef = useRef(initial);
  const [view, setView] = useState<FeaturedView>({
    questions: initial.questions,
    shown: initial.shown,
  });
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const lastTestAt = useRef(0);

  const update = useCallback((next: (state: FeaturedState) => FeaturedState) => {
    const before = stateRef.current;
    const after = next(before);
    stateRef.current = after;
    if (after.questions !== before.questions || after.shown !== before.shown) {
      setView({ questions: after.questions, shown: after.shown });
    }
  }, []);

  const handleChat = useCallback(
    (event: FeaturedChatEvent) =>
      update((state) => applyChat(state, event, modeRef.current, Date.now())),
    [update],
  );

  useEffect(() => {
    if (!key) return;
    try {
      window.localStorage.setItem(key, savedState({ ...stateRef.current, ...view }));
    } catch {
      // Storage blocked: it all still works, it just won't survive a reload.
    }
  }, [key, view]);

  // The hide timer counts from when the message went up, so a reload doesn't restart it.
  const { shown } = view;
  useEffect(() => {
    if (!shown || hide <= 0) return;
    const timer = window.setTimeout(
      () => update((state) => expire(state, shown)),
      Math.max(0, shown.at + hide * 1000 - Date.now()),
    );
    return () => window.clearTimeout(timer);
  }, [shown, hide, update]);

  const kickChannel = useFeaturedChat(twitch, kick, !simulate, handleChat);

  // Preview: chatters chat and ask, and a mod features a message or calls the next question up.
  useEffect(() => {
    if (!simulate) return;
    const chatters = simChatters(simPlatform);
    const script = SIM_SCRIPT[mode];
    let step = 0;
    let turn = chatters.length;
    let timer: number;
    const tick = () => {
      if (Date.now() - lastTestAt.current >= SIM_QUIET_AFTER_TEST_MS) {
        const waiting = stateRef.current.questions.length;
        let move = script[step % script.length];
        if (move === 'next' && waiting === 0) move = 'ask';
        else if (move === 'ask' && waiting >= 4) move = 'next';
        const chatter = chatters[turn % chatters.length];
        if (move === 'chat') {
          handleChat(simSay(chatter, SIM_LINES[turn % SIM_LINES.length]));
        } else if (move === 'ask') {
          handleChat(
            simSay(chatter, `${QUESTION_COMMAND} ${SIM_QUESTIONS[turn % SIM_QUESTIONS.length]}`),
          );
        } else if (move === 'next') {
          handleChat(simMod(`${QUESTION_COMMAND} next`));
        } else {
          // Someone other than who is up now.
          const up = stateRef.current.shown?.login;
          const pick = chatters.filter((other) => other.name.toLowerCase() !== up);
          const target = pick[turn % pick.length] ?? chatter;
          handleChat(simMod(`${FEATURE_COMMAND} @${target.name}`));
        }
        step++;
        turn++;
      }
      timer = window.setTimeout(tick, SIM_STEP_MS);
    };
    timer = window.setTimeout(tick, SIM_STEP_MS);
    return () => window.clearTimeout(timer);
  }, [simulate, simPlatform, mode, handleChat]);

  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    if (message.type !== 'chat') return;
    lastTestAt.current = Date.now();
    handleChat(previewChat(message.name, message.text, message.mod));
  });

  return { view, kickChannel };
}
