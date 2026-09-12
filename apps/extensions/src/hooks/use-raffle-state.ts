import { useCallback, useEffect, useRef, useState } from "react";

import { type TranslationKey, translate } from "#/lib/i18n";
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

function isIdentityMatch(
  a: { platform: string; username: string },
  b: { platform: string; username: string },
): boolean {
  return (
    a.platform === b.platform &&
    a.username.trim().toLowerCase() === b.username.trim().toLowerCase()
  );
}

function isEligible(
  participant: { id: string; platform: string; username: string },
  winners: RaffleWinner[],
  maxWinsPerUser: number,
): boolean {
  if (maxWinsPerUser === 0) return true;
  const winCount = winners.filter(
    (w) => w.id === participant.id || isIdentityMatch(w, participant),
  ).length;
  return winCount < maxWinsPerUser;
}

function countEligible(
  participants: RaffleParticipant[],
  winners: RaffleWinner[],
  maxWinsPerUser: number,
): number {
  if (maxWinsPerUser === 0) return participants.length;
  return participants.filter((p) => isEligible(p, winners, maxWinsPerUser)).length;
}

function secureRandomIndex(length: number): number {
  if (length <= 0) return 0;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return Math.floor(((buf[0] ?? 0) / 0x1_0000_0000) * length);
}

function clampDuration(value: unknown): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 15;
  if (n < 0) return 0;
  if (n > 300) return 300;
  return Math.floor(n);
}

const emptyState: RaffleState = {
  status: "idle",
  config: defaultConfig,
  frozenConfig: null,
  startedAt: null,
  participants: [],
  winners: [],
};

function loadState(): RaffleState {
  const empty: RaffleState = { ...emptyState, config: { ...defaultConfig } };
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
          ? {
              ...defaultConfig,
              ...parsed.frozenConfig,
              minRaffleDurationSec: clampDuration(
                parsed.frozenConfig.minRaffleDurationSec,
              ),
            }
          : null,
        startedAt:
          typeof parsed.startedAt === "number" ? parsed.startedAt : null,
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

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

const englishT: Translate = (key, vars) => translate("en", key, vars);

export function useRaffleState({
  initialChannel = "",
  platform = "twitch",
  t = englishT,
}: {
  initialChannel?: string;
  platform?: "twitch" | "kick";
  /** Translates the confirm prompts; English when omitted. */
  t?: Translate;
} = {}) {
  const [state, setState] = useState<RaffleState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  const stateRef = useRef(state);
  const drawingRef = useRef(false);

  // The server renders the empty state, so the saved one loads after mount instead of in the
  // first render, where it would break hydration.
  useEffect(() => {
    const loaded = loadState();
    setState(
      initialChannel && !loaded.config.channel
        ? { ...loaded, config: { ...loaded.config, channel: initialChannel, platform } }
        : loaded,
    );
    setHydrated(true);
  }, [initialChannel, platform]);

  useEffect(() => {
    stateRef.current = state;
    // Saving before the load would overwrite the stored raffle with the empty one.
    if (hydrated) saveState(state);
  }, [state, hydrated]);

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

  // Confirms run before setState: updaters must stay pure, React may call them twice.
  const start = useCallback(() => {
    const current = stateRef.current;
    if (
      (current.participants.length > 0 || current.winners.length > 0) &&
      !confirmOrTrue(t("raffle.confirmStart"))
    ) {
      return;
    }
    setState((prev) => {
      const initialRules = {
        ...prev.config,
        minRaffleDurationSec: clampDuration(prev.config.minRaffleDurationSec),
      };
      return {
        ...prev,
        status: "running",
        config: initialRules,
        frozenConfig: initialRules,
        startedAt: Date.now(),
        participants: [],
        winners: [],
      };
    });
  }, [t]);

  const stop = useCallback(() => {
    setState((prev) => ({ ...prev, status: "stopped" }));
  }, []);

  const addParticipant = useCallback((participant: RaffleParticipant) => {
    setState((prev) => {
      if (prev.status !== "running") return prev;
      const rules = prev.frozenConfig ?? prev.config;
      // Prevent duplicate entry by ID or username
      if (
        prev.participants.some(
          (p) => isIdentityMatch(p, participant) || p.id === participant.id,
        )
      ) {
        return prev;
      }
      // Check eligibility (maxWinsPerUser)
      if (!isEligible(participant, prev.winners, rules.maxWinsPerUser)) {
        return prev;
      }
      return {
        ...prev,
        participants: [...prev.participants, participant],
      };
    });
  }, []);

  const removeParticipant = useCallback((idOrUsername: string) => {
    setState((prev) => {
      const filtered = prev.participants.filter(
        (p) =>
          p.id !== idOrUsername &&
          p.username.toLowerCase() !== idOrUsername.toLowerCase(),
      );
      stateRef.current = {
        ...prev,
        participants: filtered,
      };
      return {
        ...prev,
        participants: filtered,
      };
    });
  }, []);

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

    // Filter strictly eligible participants (strictly prevents accidental double-wins)
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

    // Calculate next state
    const nextWinners = [...current.winners, winnerRecord];
    const nextParticipants = current.participants.filter(
      (p) => !isIdentityMatch(p, winner) && p.id !== winner.id,
    );

    // Synchronously update stateRef to prevent race conditions on rapid clicks
    stateRef.current = {
      ...current,
      participants: nextParticipants,
      winners: nextWinners,
    };

    setState((prev) => {
      drawingRef.current = false;
      // Prevent duplicate insertion
      if (
        prev.winners.some(
          (w) =>
            isIdentityMatch(w, winnerRecord) &&
            w.drawnAt === winnerRecord.drawnAt,
        )
      ) {
        return prev;
      }
      return {
        ...prev,
        participants: prev.participants.filter(
          (p) => !isIdentityMatch(p, winner) && p.id !== winner.id,
        ),
        winners: [...prev.winners, winnerRecord],
      };
    });

    // Broadcast winner to overlay
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const bc = new BroadcastChannel("senchabot-raffle-broadcast");
        bc.postMessage({ type: "raffle:winner", winner: winnerRecord });
        bc.close();
      } catch {
        // broadcast failed
      }
    }

    return winnerRecord;
  }, []);

  const resetParticipants = useCallback(() => {
    if (stateRef.current.participants.length === 0) return;
    if (!confirmOrTrue(t("raffle.confirmResetEntries"))) return;
    setState((prev) => ({ ...prev, participants: [] }));
  }, [t]);

  const resetWinners = useCallback(() => {
    if (stateRef.current.winners.length === 0) return;
    if (!confirmOrTrue(t("raffle.confirmResetWinners"))) return;
    setState((prev) => ({ ...prev, winners: [] }));
  }, [t]);

  const resetConfig = useCallback(() => {
    setState((prev) => {
      if (prev.status === "running" || prev.status === "stopped") return prev;
      return { ...prev, config: { ...defaultConfig } };
    });
  }, []);

  const resetAll = useCallback(() => {
    const current = stateRef.current;
    const total = current.participants.length + current.winners.length;
    if ((total > 0 || current.frozenConfig !== null) && !confirmOrTrue(t("raffle.confirmResetAll"))) {
      return;
    }
    drawingRef.current = false;
    setState((prev) => ({
      ...prev,
      status: "idle",
      frozenConfig: null,
      startedAt: null,
      participants: [],
      winners: [],
    }));
  }, [t]);

  const rules = state.frozenConfig ?? state.config;
  const eligibleCount = countEligible(
    state.participants,
    state.winners,
    rules.maxWinsPerUser,
  );
  const minMs = clampDuration(rules.minRaffleDurationSec) * 1000;
  const elapsedMs =
    state.startedAt != null
      ? Date.now() - state.startedAt
      : Number.POSITIVE_INFINITY;
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
    removeParticipant,
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
