import { useCallback, useEffect, useRef, useState } from "react";

import type {
  RaffleConfig,
  RaffleParticipant,
  RaffleState,
  RaffleWinner,
} from "#/types/raffle";

const STORAGE_KEY = "senchabot-raffle-state-v3";

const defaultConfig: RaffleConfig = {
  platform: "twitch",
  channel: "",
  keyword: "!join",
  subscribersOnly: false,
  minSubMonths: 1,
  maxWinsPerUser: 1,
  minRaffleDurationSec: 15,
};

function isIdentityMatch(a: { platform: string; username: string }, b: { platform: string; username: string }): boolean {
  return a.platform === b.platform && a.username.toLowerCase() === b.username.toLowerCase();
}

function isEligible(
  participant: { id: string; platform: string; username: string },
  winners: RaffleWinner[],
  maxWinsPerUser: number,
): boolean {
  if (maxWinsPerUser === 0) return true;
  const winCount = winners.filter(
    (w) => w.id === participant.id || (w.platform === participant.platform && w.username.toLowerCase() === participant.username.toLowerCase()),
  ).length;
  return winCount < maxWinsPerUser;
}

function countEligible(participants: RaffleParticipant[], winners: RaffleWinner[], maxWinsPerUser: number): number {
  if (maxWinsPerUser === 0) return participants.length;
  return participants.filter((p) => isEligible(p, winners, maxWinsPerUser)).length;
}

//
// Residual-fairness note:
// A determined host with DevTools access can still patch React state, edit
// localStorage, or override `crypto.getRandomValues`. Client-only fairness
// cannot prevent that. The measures here (CSPRNG draw, frozen config snapshot,
// minimum raffle duration, reset confirms) raise the bar for *accidental* and
// *casual* rigging and make *deliberate* rigging leave visible traces (confirm
// dialogs in browser history), but they are not cryptographic guarantees.
//
function secureRandomIndex(length: number): number {
  if (length <= 0) return 0;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return Math.floor((buf[0] ?? 0) / 0x1_0000_0000 * length);
}

function clampDuration(value: unknown): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 15;
  if (n < 0) return 0;
  if (n > 300) return 300;
  return Math.floor(n);
}

function loadState(): RaffleState {
  const empty: RaffleState = {
    status: "idle",
    config: { ...defaultConfig },
    frozenConfig: null,
    startedAt: null,
    participants: [],
    winners: [],
  };
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as RaffleState;
      return {
        status: parsed.status ?? "idle",
        config: {
          ...defaultConfig,
          ...parsed.config,
          minRaffleDurationSec: clampDuration(parsed.config?.minRaffleDurationSec),
        },
        frozenConfig: parsed.frozenConfig
          ? { ...defaultConfig, ...parsed.frozenConfig, minRaffleDurationSec: clampDuration(parsed.frozenConfig.minRaffleDurationSec) }
          : null,
        startedAt: typeof parsed.startedAt === "number" ? parsed.startedAt : null,
        participants: parsed.participants ?? [],
        winners: parsed.winners ?? [],
      };
    }
  } catch {
    // ignore
  }
  return empty;
}

function saveState(state: RaffleState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota or serialization errors are non-fatal
  }
}

function confirmOrTrue(message: string): boolean {
  if (typeof window === "undefined") return true;
  return window.confirm(message);
}

export function useRaffleState() {
  const [state, setState] = useState<RaffleState>(loadState);
  const stateRef = useRef(state);
  const drawingRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
    saveState(state);
  }, [state]);

  const updateConfig = useCallback((partial: Partial<RaffleConfig>) => {
    setState((prev) => {
      if (prev.status === "running" || prev.status === "stopped") return prev;
      const next: Partial<RaffleConfig> = { ...partial };
      if (typeof partial.minRaffleDurationSec === "number") {
        next.minRaffleDurationSec = clampDuration(partial.minRaffleDurationSec);
      }
      return {
        ...prev,
        config: { ...prev.config, ...next },
      };
    });
  }, []);

  const start = useCallback(() => {
    setState((prev) => {
      if (prev.participants.length > 0) {
        const ok = confirmOrTrue(
          `Starting a new raffle will clear ${prev.participants.length} participant(s). Continue?`,
        );
        if (!ok) return prev;
      }
      return {
        ...prev,
        status: "running",
        config: { ...prev.config, minRaffleDurationSec: clampDuration(prev.config.minRaffleDurationSec) },
        frozenConfig: { ...prev.config, minRaffleDurationSec: clampDuration(prev.config.minRaffleDurationSec) },
        startedAt: Date.now(),
        participants: [],
        winners: [],
      };
    });
  }, []);

  const stop = useCallback(() => {
    setState((prev) => ({ ...prev, status: "stopped" }));
  }, []);

  const addParticipant = useCallback(
    (participant: RaffleParticipant) => {
      setState((prev) => {
        if (prev.status !== "running") return prev;
        const rules = prev.frozenConfig ?? prev.config;
        if (prev.participants.some((p) => isIdentityMatch(p, participant) || p.id === participant.id)) {
          return prev;
        }
        if (!isEligible(participant, prev.winners, rules.maxWinsPerUser)) {
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
    if (drawingRef.current) return null;
    const current = stateRef.current;
    if (current.status !== "running" && current.status !== "stopped") {
      return null;
    }
    if (current.participants.length === 0) return null;

    const rules = current.frozenConfig ?? current.config;
    const minMs = clampDuration(rules.minRaffleDurationSec) * 1000;
    const startedAt = current.startedAt ?? 0;
    if (Date.now() - startedAt < minMs) return null;

    const eligible = current.participants.filter((p) =>
      isEligible(p, current.winners, rules.maxWinsPerUser),
    );
    if (eligible.length === 0) return null;

    drawingRef.current = true;
    const winner = eligible[secureRandomIndex(eligible.length)];
    const winnerRecord: RaffleWinner = {
      ...winner,
      drawnAt: Date.now(),
    };

    setState((prev) => {
      drawingRef.current = false;
      if (prev.winners.some((w) => w.drawnAt === winnerRecord.drawnAt)) return prev;
      return {
        ...prev,
        participants: prev.participants.filter((p) => p.id !== winner.id),
        winners: [...prev.winners, winnerRecord],
      };
    });

    return winnerRecord;
  }, []);

  const resetParticipants = useCallback(() => {
    setState((prev) => {
      if (prev.participants.length === 0) return prev;
      const ok = confirmOrTrue(
        `Clear ${prev.participants.length} participant(s)?`,
      );
      if (!ok) return prev;
      return { ...prev, participants: [] };
    });
  }, []);

  const resetWinners = useCallback(() => {
    setState((prev) => {
      if (prev.winners.length === 0) return prev;
      const ok = confirmOrTrue(
        `Clear ${prev.winners.length} winner(s)?`,
      );
      if (!ok) return prev;
      return { ...prev, winners: [] };
    });
  }, []);

  const resetConfig = useCallback(() => {
    setState((prev) => {
      if (prev.status === "running" || prev.status === "stopped") return prev;
      return { ...prev, config: { ...defaultConfig } };
    });
  }, []);

  const resetAll = useCallback(() => {
    setState((prev) => {
      const total = prev.participants.length + prev.winners.length;
      if (total > 0 || prev.frozenConfig !== null) {
        const ok = confirmOrTrue("Reset everything and start over?");
        if (!ok) return prev;
      }
      drawingRef.current = false;
      return {
        ...prev,
        status: "idle",
        frozenConfig: null,
        startedAt: null,
        participants: [],
        winners: [],
      };
    });
  }, []);

  const rules = state.frozenConfig ?? state.config;
  const eligibleCount = countEligible(state.participants, state.winners, rules.maxWinsPerUser);
  const minMs = clampDuration(rules.minRaffleDurationSec) * 1000;
  const elapsedMs = state.startedAt != null ? Date.now() - state.startedAt : Number.POSITIVE_INFINITY;
  const remainingMs =
    state.status === "running" || state.status === "stopped"
      ? Math.max(0, minMs - elapsedMs)
      : 0;
  const canDraw =
    (state.status === "running" || state.status === "stopped") &&
    eligibleCount > 0 &&
    remainingMs === 0;

  return {
    state,
    updateConfig,
    start,
    stop,
    addParticipant,
    drawWinner,
    eligibleCount,
    canDraw,
    remainingMs,
    resetParticipants,
    resetWinners,
    resetConfig,
    resetAll,
  };
}
