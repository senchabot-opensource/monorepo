import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useKickChannel } from '#/hooks/use-kick-channel';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import { KickPusherReader, kickChatroomChannel, TwitchIrcReader } from '#/lib/chat-readers';
import { type EmoteProviders, useChannelEmotes } from '../chat-widget/use-channel-emotes';
import {
  bttvEmoteUrl,
  getMessageEmotes,
  type MessageEmote,
  twitchEmoteUrl,
} from '../emote-wall/emote-utils';
import { type EmoteChat, kickEmoteChat, twitchEmoteChat } from './emote-combo-chat';
import {
  applyComboChat,
  COMBO_COMMAND,
  type ComboChat,
  type ComboRules,
  type ComboState,
  emptyCombos,
  endAllCombos,
  expireCombos,
  FINALE_MS,
  loadCombos,
  RESET_WORD,
  shownCombo,
  storageKey,
} from './emote-combo-state';

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:emote-combo-preview';
export type PreviewMessage =
  /** A new combo of another sample emote, at the minimum straight away. */
  | { type: 'start'; preview: string }
  /** One more chatter joins the combo on screen. */
  | { type: 'chatter'; preview: string }
  /** A mod's `!combo reset`. */
  | { type: 'reset'; preview: string };

/** How often combos are checked for a window that ran out. */
const TICK_MS = 250;

type SampleEmote = MessageEmote & { source: 'twitch' | '7tv' | 'bttv' | 'ffz' };

/**
 * The preview's emotes, verified global ones that need no channel: Twitch's own and, with their
 * providers on, 7TV, BTTV and FFZ ones (the Emote Wall's mock emotes).
 */
export const SAMPLE_EMOTES: readonly SampleEmote[] = [
  { key: 'twitch:25', name: 'Kappa', url: twitchEmoteUrl('25'), source: 'twitch' },
  {
    key: 'name:PepePls',
    name: 'PepePls',
    url: 'https://cdn.7tv.app/emote/01GAFTZ9K80003DHH026MC7JW0/4x.webp',
    source: '7tv',
  },
  { key: 'twitch:1902', name: 'Keepo', url: twitchEmoteUrl('1902'), source: 'twitch' },
  {
    key: 'name:peepoHappy',
    name: 'peepoHappy',
    url: 'https://cdn.7tv.app/emote/01GAZ199Z8000FEWHS6AT5QZV0/4x.webp',
    source: '7tv',
  },
  { key: 'name::tf:', name: ':tf:', url: bttvEmoteUrl('54fa8f1401e468494b85b537'), source: 'bttv' },
  {
    key: 'name:PartyParrot',
    name: 'PartyParrot',
    url: 'https://cdn.7tv.app/emote/01FKSDK14G0008TM5NY9QEG0QV/4x.webp',
    source: '7tv',
  },
  { key: 'twitch:114836', name: 'Jebaited', url: twitchEmoteUrl('114836'), source: 'twitch' },
  {
    key: 'name:ZrehplaR',
    name: 'ZrehplaR',
    url: 'https://cdn.frankerfacez.com/emote/9/2',
    source: 'ffz',
  },
];

/** The sample emotes the preview plays with these providers. */
export function samplePool(providers: EmoteProviders): MessageEmote[] {
  return SAMPLE_EMOTES.filter(
    ({ source }) =>
      source === 'twitch' ||
      (source === '7tv' && providers.sevenTv) ||
      (source === 'bttv' && providers.bttv) ||
      (source === 'ffz' && providers.ffz),
  ).map(({ source: _, ...emote }) => emote);
}

/** The preview's `turn`th chatter posting `emotes`; every third one chats on Kick. */
export function simChat(turn: number, emotes: MessageEmote[], text?: string): ComboChat {
  return {
    platform: turn % 3 === 2 ? 'kick' : 'twitch',
    login: `viewer${turn}`,
    mod: false,
    bot: false,
    aside: false,
    text: text ?? emotes.map((emote) => emote.name).join(' '),
    emotes,
  };
}

/** The best combo the preview starts with, so the line under the counter shows. */
export const SIM_BEST_COUNT = 42;
/** Chatters already in the combo the preview opens with. */
const SIM_SEED = 4;
const SIM_FIRST_MS = 700;
const SIM_JOIN_MS = 320;
const SIM_JOIN_SPREAD_MS = 520;
/** A round's first chatters come quickly, so the stage isn't empty for long between combos. */
const SIM_OPENING_MS = 160;
/** Quiet stage between the preview's rounds, after the finale. */
const SIM_GAP_MS = 1200;
const SIM_RIVAL_CHANCE = 0.12;
/** Chatters in one round of the preview: always past the minimum, so every round shows. */
const simTarget = (min: number) => min + 5 + Math.floor(Math.random() * 20);

/** The preview's opening: a combo of the first sample emote on screen and a best to beat. */
function simStart(pool: readonly MessageEmote[], rules: ComboRules, now: number): ComboState {
  const state = emptyCombos(now);
  if (pool.length === 0) return state;
  let chats = Math.max(rules.min, SIM_SEED);
  let next: ComboState = {
    ...state,
    best: { emote: pool[1 % pool.length], count: SIM_BEST_COUNT, startedAt: now - 60_000 },
  };
  for (let turn = 0; chats > 0; turn++, chats--) {
    next = applyComboChat(next, simChat(turn, [pool[0]]), rules, now);
  }
  return next;
}

interface UseEmoteComboOptions {
  twitch?: string;
  kick?: string;
  rules: ComboRules;
  providers: EmoteProviders;
  simulate?: boolean;
  previewId?: string;
}

const NO_PROVIDERS: EmoteProviders = { sevenTv: false, bttv: false, ffz: false };

export function useEmoteCombo({
  twitch,
  kick,
  rules,
  providers,
  simulate = false,
  previewId,
}: UseEmoteComboOptions) {
  const key = simulate ? null : storageKey(twitch, kick);
  const rulesRef = useRef(rules);
  rulesRef.current = rules;
  const { sevenTv, bttv, ffz } = providers;
  const pool = useMemo(() => samplePool({ sevenTv, bttv, ffz }), [sevenTv, bttv, ffz]);
  const [state, setState] = useState<ComboState>(() =>
    simulate ? simStart(pool, rules, Date.now()) : loadCombos(key, Date.now()),
  );
  const stateRef = useRef(state);
  stateRef.current = state;
  const lastTestAt = useRef(Number.NEGATIVE_INFINITY);
  const simTurn = useRef(Math.max(rules.min, SIM_SEED));

  const count = useCallback((chat: ComboChat) => {
    setState((current) => applyComboChat(current, chat, rulesRef.current, Date.now()));
  }, []);

  // Windows run out between messages too.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setState((current) => expireCombos(current, rulesRef.current, Date.now()));
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  const { best, updatedAt } = state;
  useEffect(() => {
    if (!key) return;
    try {
      window.localStorage.setItem(key, JSON.stringify({ best, updatedAt }));
    } catch {
      // Storage blocked: combos still count, the best just won't survive a reload.
    }
  }, [key, best, updatedAt]);

  // Same emote maps as the Emote Wall: 7TV, BTTV and FFZ on Twitch, 7TV on Kick (the set linked
  // to the Kick account, else the Twitch one, else the global one).
  const kickChannel = useKickChannel(kick, !simulate).channel;
  const emoteMaps = useChannelEmotes(
    simulate ? null : twitch,
    simulate ? null : kickChannel?.userId,
    simulate ? NO_PROVIDERS : providers,
  );
  const mapsRef = useRef(emoteMaps);
  mapsRef.current = emoteMaps;

  const handleChat = useCallback(
    ({ viewer, input }: EmoteChat) => {
      count({
        platform: viewer.platform,
        login: viewer.login,
        mod: viewer.mod,
        bot: viewer.bot,
        aside: viewer.aside,
        text: viewer.text,
        emotes: getMessageEmotes(input, mapsRef.current[viewer.platform]),
      });
    },
    [count],
  );

  // One reader per platform, so a Kick lookup that lands later leaves Twitch connected.
  useEffect(() => {
    if (simulate || !twitch) return;
    const reader = new TwitchIrcReader(twitch, twitchEmoteChat, handleChat);
    return () => reader.disconnect();
  }, [simulate, twitch, handleChat]);

  const chatroomId = kickChannel?.chatroomId;
  useEffect(() => {
    if (simulate || !chatroomId) return;
    const reader = new KickPusherReader(
      [kickChatroomChannel(chatroomId)],
      kickEmoteChat,
      handleChat,
    );
    return () => reader.disconnect();
  }, [simulate, chatroomId, handleChat]);

  // Preview: chatters pile into one sample emote after another, now and then starting a rival
  // combo that doesn't catch up. Each round ends at once, as if the window had run out.
  useEffect(() => {
    if (!simulate || pool.length === 0) return;
    let timer: number;
    let round = 0;
    let joined = Math.max(rulesRef.current.min, SIM_SEED);
    let target = Math.max(simTarget(rulesRef.current.min), joined + 3);
    const tick = () => {
      const { min, windowMs } = rulesRef.current;
      let delay = joined < min ? SIM_OPENING_MS : SIM_JOIN_MS + Math.random() * SIM_JOIN_SPREAD_MS;
      if (Date.now() - lastTestAt.current < windowMs + FINALE_MS + SIM_GAP_MS) {
        // The test buttons have the stage; a fresh round starts once they're done.
        if (joined > 0) {
          round++;
          joined = 0;
          target = simTarget(min);
        }
        delay = 1000;
      } else if (joined < target) {
        count(simChat(simTurn.current++, [pool[round % pool.length]]));
        joined++;
        if (pool.length > 1 && Math.random() < SIM_RIVAL_CHANCE) {
          count(simChat(simTurn.current++, [pool[(round + 1) % pool.length]]));
        }
      } else {
        setState((current) => endAllCombos(current, rulesRef.current, Date.now()));
        round++;
        joined = 0;
        target = simTarget(min);
        delay = FINALE_MS + SIM_GAP_MS;
      }
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, SIM_FIRST_MS);
    return () => window.clearTimeout(timer);
  }, [simulate, pool, count]);

  const testEmote = useRef(0);
  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    if (pool.length === 0) return;
    lastTestAt.current = Date.now();
    const { min } = rulesRef.current;
    const onScreen = shownCombo(stateRef.current, min);
    if (message.type === 'reset') {
      count({
        ...simChat(simTurn.current++, [], `${COMBO_COMMAND} ${RESET_WORD}`),
        mod: true,
      });
    } else if (message.type === 'start') {
      // The next sample emote that isn't the one on screen, with the minimum straight away.
      let emote = pool[testEmote.current++ % pool.length];
      if (pool.length > 1 && emote.key === onScreen?.combo.emote.key) {
        emote = pool[testEmote.current++ % pool.length];
      }
      const chats = Array.from({ length: min }, () => simChat(simTurn.current++, [emote]));
      const now = Date.now();
      setState((current) =>
        chats.reduce((next, chat) => applyComboChat(next, chat, rulesRef.current, now), {
          ...current,
          running: [],
          finale: null,
        } as ComboState),
      );
    } else if (message.type === 'chatter') {
      const emote =
        (onScreen && !onScreen.ended ? onScreen.combo.emote : undefined) ??
        stateRef.current.running.at(-1)?.emote ??
        pool[0];
      count(simChat(simTurn.current++, [emote]));
    }
  });

  return { state, shown: shownCombo(state, rules.min) };
}
