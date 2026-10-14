import { useCallback, useEffect, useRef, useState } from 'react';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import type { SubathonEvent, SubathonPlatform } from '../subathon/subathon-events';
import { useSubEvents } from '../subathon/use-sub-events';
import {
  applySupport,
  emptyBoard,
  isResetCommand,
  type LeaderboardData,
  loadBoard,
  storageKey,
} from './leaderboard-state';

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:leaderboard-preview';
export type PreviewMessage = { type: 'event'; preview: string; event: SubathonEvent };

const SIM_QUIET_AFTER_TEST_MS = 8000;
const SIM_NAMES = ['NightOwl', 'pixelpanda', 'ChatGremlin', 'lunaa', 'GG_Tobi', 'mochi', 'Rook'];
const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

function simulatedEvent(only?: SubathonPlatform): SubathonEvent {
  const platform = only ?? pick<SubathonPlatform>(['twitch', 'kick']);
  const name = pick(SIM_NAMES);
  const roll = Math.random();
  if (roll < 0.35) return { kind: 'gift', platform, name, tier: 1, count: pick([1, 1, 5, 10]) };
  if (roll < 0.7) return { kind: 'bits', platform, name, amount: pick([100, 250, 500, 1000]) };
  if (roll < 0.9) return { kind: 'sub', platform, name, tier: 1, months: pick([1, 3, 12]) };
  return { kind: 'raid', platform, name, viewers: pick([15, 64, 210]) };
}

/** A board that's already been running a while, so the preview shows full places at once. */
function sampleBoard(only?: SubathonPlatform): LeaderboardData {
  let data = emptyBoard();
  for (let i = 0; i < 24; i++) data = applySupport(data, simulatedEvent(only));
  return data;
}

interface UseLeaderboardOptions {
  twitch?: string;
  kick?: string;
  simulate?: boolean;
  simPlatform?: SubathonPlatform;
  previewId?: string;
}

export function useLeaderboard({
  twitch,
  kick,
  simulate = false,
  simPlatform,
  previewId,
}: UseLeaderboardOptions) {
  const key = simulate ? null : storageKey(twitch, kick);
  const [data, setData] = useState<LeaderboardData>(() =>
    simulate ? sampleBoard(simPlatform) : loadBoard(key),
  );
  const lastTestAt = useRef(0);

  const handleEvent = useCallback((event: SubathonEvent) => {
    if (event.kind === 'mod') {
      if (isResetCommand(event.text)) setData(emptyBoard());
      return;
    }
    setData((current) => applySupport(current, event));
  }, []);

  useEffect(() => {
    if (!key) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // Storage blocked: the board still works, it just won't survive a reload.
    }
  }, [key, data]);

  useSubEvents(twitch, kick, !simulate, handleEvent);

  useEffect(() => {
    if (!simulate) return;
    let timer: number;
    const step = () => {
      if (Date.now() - lastTestAt.current >= SIM_QUIET_AFTER_TEST_MS) {
        handleEvent(simulatedEvent(simPlatform));
      }
      timer = window.setTimeout(step, 2500 + Math.random() * 1500);
    };
    timer = window.setTimeout(step, 1500);
    return () => window.clearTimeout(timer);
  }, [simulate, simPlatform, handleEvent]);

  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    if (message.type !== 'event') return;
    lastTestAt.current = Date.now();
    handleEvent(message.event);
  });

  return data;
}
