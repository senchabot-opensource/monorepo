import { useCallback, useEffect, useState } from "react";

import confetti from "canvas-confetti";

import { useRaffleChat } from "#/hooks/use-raffle-chat";
import { useRaffleState } from "#/hooks/use-raffle-state";
import type { RaffleWinner } from "#/types/raffle";

export interface RaffleWidgetProps {
  initialChannel?: string;
  platform?: "twitch" | "kick";
  onDrawWinner?: (winner: RaffleWinner) => void;
}

function triggerConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#9146FF", "#00D4AA", "#FFD700", "#FF4500"],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#9146FF", "#00D4AA", "#FFD700", "#FF4500"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

export function RaffleWidget({
  initialChannel = "",
  platform = "twitch",
  onDrawWinner,
}: RaffleWidgetProps) {
  const {
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
  } = useRaffleState();

  const [lastWinner, setLastWinner] = useState<string | null>(null);

  useEffect(() => {
    if (initialChannel && !state.config.channel) {
      updateConfig({ channel: initialChannel, platform });
    }
  }, [initialChannel, platform, state.config.channel, updateConfig]);

  useRaffleChat(state.config, addParticipant, state.status === "running");

  const handleDraw = useCallback(() => {
    const winner = drawWinner();
    if (winner) {
      setLastWinner(winner.displayName || winner.username);
      triggerConfetti();
      if (onDrawWinner) onDrawWinner(winner);
    }
  }, [drawWinner, onDrawWinner]);

  const isRunning = state.status === "running";

  return (
    <div className="min-h-screen w-full bg-neutral-900 text-white p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Raffle</h1>
        <p className="text-sm text-neutral-400">
          Run subscriber and keyword-based giveaways.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Configuration */}
        <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-5 space-y-4">
          <h2 className="text-lg font-medium">Configuration</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <select
              className="w-full rounded-md border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm"
              value={state.config.platform}
              onChange={(e) =>
                updateConfig({ platform: e.target.value as "twitch" | "kick" })
              }
              disabled={isRunning}
            >
              <option value="twitch">Twitch</option>
              <option value="kick">Kick</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Channel Name / ID</label>
            <input
              className="w-full rounded-md border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm"
              placeholder="Enter channel name"
              value={state.config.channel}
              onChange={(e) => updateConfig({ channel: e.target.value })}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Entry Keyword</label>
            <input
              className="w-full rounded-md border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm"
              placeholder="!join"
              value={state.config.keyword}
              onChange={(e) => updateConfig({ keyword: e.target.value })}
              disabled={isRunning}
            />
            <p className="text-xs text-neutral-500">
              Chatters must send this exact message to enter.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-neutral-700 p-3">
            <div>
              <p className="text-sm font-medium">Subscribers Only</p>
              <p className="text-xs text-neutral-500">
                Only subscribers can enter.
              </p>
            </div>
            <input
              type="checkbox"
              className="size-5 accent-purple-500"
              checked={state.config.subscribersOnly}
              onChange={(e) => updateConfig({ subscribersOnly: e.target.checked })}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Minimum Sub Months</label>
            <input
              className="w-full rounded-md border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm"
              type="number"
              min={0}
              value={state.config.minSubMonths}
              onChange={(e) =>
                updateConfig({
                  minSubMonths: Math.max(
                    0,
                    parseInt(e.target.value || "0", 10),
                  ),
                })
              }
              disabled={isRunning}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-neutral-700 p-3">
            <div>
              <p className="text-sm font-medium">Allow Multiple Wins</p>
              <p className="text-xs text-neutral-500">
                A chatter can win more than once.
              </p>
            </div>
            <input
              type="checkbox"
              className="size-5 accent-purple-500"
              checked={state.config.allowMultipleWins}
              onChange={(e) =>
                updateConfig({ allowMultipleWins: e.target.checked })
              }
              disabled={isRunning}
            />
          </div>

          <button
            className="w-full rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm font-medium hover:bg-neutral-700 disabled:opacity-50"
            onClick={resetConfig}
            disabled={isRunning}
          >
            Reset Configuration
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-5 space-y-4">
            <h2 className="text-lg font-medium">Controls</h2>

            <div className="flex gap-2">
              <button
                className="flex-1 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium hover:bg-purple-500 disabled:opacity-50"
                onClick={start}
                disabled={isRunning || !state.config.channel.trim()}
              >
                Start Raffle
              </button>
              <button
                className="flex-1 rounded-md bg-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-600 disabled:opacity-50"
                onClick={stop}
                disabled={!isRunning}
              >
                Stop Raffle
              </button>
            </div>

            <button
              className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
              onClick={handleDraw}
              disabled={state.participants.length === 0}
            >
              Draw Winner
            </button>

            {lastWinner && (
              <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-4 text-center">
                <p className="text-sm text-neutral-400">Last Winner</p>
                <p className="text-xl font-bold text-white">{lastWinner}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                className="rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm font-medium hover:bg-neutral-700 disabled:opacity-50"
                onClick={resetParticipants}
                disabled={state.participants.length === 0}
              >
                Reset Participants
              </button>
              <button
                className="rounded-md border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm font-medium hover:bg-neutral-700 disabled:opacity-50"
                onClick={resetWinners}
                disabled={state.winners.length === 0}
              >
                Reset Winners
              </button>
            </div>

            <button
              className="w-full rounded-md bg-red-900/60 px-3 py-2 text-sm font-medium text-red-200 hover:bg-red-900/80"
              onClick={resetAll}
            >
              Reset Everything
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Participants */}
        <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-5">
          <h2 className="text-lg font-medium mb-3">
            Participants ({state.participants.length})
          </h2>
          <div className="max-h-64 overflow-y-auto rounded-md border border-neutral-700">
            {state.participants.length === 0 ? (
              <div className="p-4 text-center text-sm text-neutral-500">
                No participants yet.
              </div>
            ) : (
              <ul className="divide-y divide-neutral-700">
                {state.participants.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between px-4 py-2 text-sm"
                  >
                    <span className="font-medium">
                      {p.displayName || p.username}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {p.subMonths > 0 ? `${p.subMonths}mo` : "sub"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Winners */}
        <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-5">
          <h2 className="text-lg font-medium mb-3">
            Winners ({state.winners.length})
          </h2>
          <div className="max-h-64 overflow-y-auto rounded-md border border-neutral-700">
            {state.winners.length === 0 ? (
              <div className="p-4 text-center text-sm text-neutral-500">
                No winners yet.
              </div>
            ) : (
              <ul className="divide-y divide-neutral-700">
                {state.winners.map((w, idx) => (
                  <li
                    key={`${w.id}-${idx}`}
                    className="flex items-center justify-between px-4 py-2 text-sm"
                  >
                    <span className="font-medium">
                      {w.displayName || w.username}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {new Date(w.drawnAt).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
