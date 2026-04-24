import { useCallback, useEffect, useRef, useState } from "react";

import type {
  RaffleConfig,
  RaffleParticipant,
  RaffleState,
  RaffleWinner,
} from "#/types/raffle";

const STORAGE_KEY = "senchabot-raffle-state-v1";

const defaultConfig: RaffleConfig = {
  platform: "twitch",
  channel: "",
  keyword: "!join",
  subscribersOnly: false,
  minSubMonths: 0,
  allowMultipleWins: false,
};

function loadState(): RaffleState {
  if (typeof window === "undefined") {
    return {
      status: "idle",
      config: { ...defaultConfig },
      participants: [],
      winners: [],
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as RaffleState;
      return {
        status: parsed.status ?? "idle",
        config: { ...defaultConfig, ...parsed.config },
        participants: parsed.participants ?? [],
        winners: parsed.winners ?? [],
      };
    }
  } catch {
    // ignore
  }
  return {
    status: "idle",
    config: { ...defaultConfig },
    participants: [],
    winners: [],
  };
}

function saveState(state: RaffleState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useRaffleState() {
  const [state, setState] = useState<RaffleState>(loadState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
    saveState(state);
  }, [state]);

  const updateConfig = useCallback((partial: Partial<RaffleConfig>) => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, ...partial },
    }));
  }, []);

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, status: "running", participants: [] }));
  }, []);

  const stop = useCallback(() => {
    setState((prev) => ({ ...prev, status: "stopped" }));
  }, []);

  const addParticipant = useCallback(
    (participant: RaffleParticipant) => {
      setState((prev) => {
        if (prev.status !== "running") return prev;
        if (prev.participants.some((p) => p.id === participant.id)) return prev;
        if (
          !prev.config.allowMultipleWins &&
          prev.winners.some(
            (w) => w.id === participant.id || w.username === participant.username,
          )
        ) {
          return prev;
        }
        return {
          ...prev,
          participants: [...prev.participants, participant],
        };
      });
    },
    [],
  );

  const drawWinner = useCallback((): RaffleWinner | null => {
    const current = stateRef.current;
    if (current.participants.length === 0) return null;

    const eligible = current.config.allowMultipleWins
      ? current.participants
      : current.participants.filter(
          (p) =>
            !current.winners.some(
              (w) => w.id === p.id || w.username === p.username,
            ),
        );

    if (eligible.length === 0) return null;

    const winner = eligible[Math.floor(Math.random() * eligible.length)];
    const winnerRecord: RaffleWinner = {
      ...winner,
      drawnAt: Date.now(),
    };

    setState((prev) => {
      // Prevent duplicate winner entries
      if (prev.winners.some((w) => w.id === winnerRecord.id)) {
        return prev;
      }
      return {
        ...prev,
        participants: prev.participants.filter((p) => p.id !== winner.id),
        winners: [...prev.winners, winnerRecord],
      };
    });

    return winnerRecord;
  }, []);

  const resetParticipants = useCallback(() => {
    setState((prev) => ({ ...prev, participants: [] }));
  }, []);

  const resetWinners = useCallback(() => {
    setState((prev) => ({ ...prev, winners: [] }));
  }, []);

  const resetConfig = useCallback(() => {
    setState((prev) => ({ ...prev, config: { ...defaultConfig } }));
  }, []);

  const resetAll = useCallback(() => {
    setState({
      status: "idle",
      config: { ...defaultConfig },
      participants: [],
      winners: [],
    });
  }, []);

  return {
    state,
    updateConfig,
    start,
    stop,
    addParticipant,
    drawWinner,
    resetParticipants,
    resetWinners,
    resetConfig,
    resetAll,
  };
}
