import { Breadcrumb } from "#/components/breadcrumb";
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
    const updates: Partial<{ channel: string; platform: "twitch" | "kick" }> = {};
    if (initialChannel) {
      updates.channel = initialChannel;
    }
    if (platform) {
      updates.platform = platform;
    }
    if (Object.keys(updates).length > 0) {
      updateConfig(updates);
    }
  }, [initialChannel, platform, updateConfig]);

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
    <div className="flex min-h-screen flex-col lg:flex-row items-center lg:items-start justify-center bg-zinc-950 p-6 text-zinc-100 font-sans gap-8 pt-12">
      {/* Left: Configuration */}
      <div className="w-full max-w-md lg:shrink-0 rounded-xl bg-zinc-900 p-8 shadow-xl border border-zinc-800">
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Raffle Setup" },
            ]}
          />
        </div>
        <div className="mb-6 flex justify-center">
          <a
            className="relative inline-flex select-none flex-col items-center gap-2 text-xl font-semibold tracking-wide text-white transition-opacity hover:opacity-75 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            href="https://senchabot.com"
            target="_blank"
            rel="noreferrer">
            <div className="inline-flex size-10 shrink-0">
              <img
                src="/senchabot-logo.svg"
                alt="Senchabot"
                width={40}
                height={40}
              />
            </div>
          </a>
        </div>

        <h1 className="mb-6 text-2xl font-bold text-center text-white">
          Raffle Setup
        </h1>

        <div className="space-y-4">
          <div className="text-sm text-zinc-400 bg-zinc-800/50 p-3 rounded-md border border-zinc-800">
            <p>
              <strong className="text-zinc-300">Raffle:</strong> Run
              chat-based raffles with keyword entry, sub-only mode, and a live
              winner overlay with confetti celebration.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Platform
            </label>
            <select
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              value={state.config.platform}
              onChange={(e) =>
                updateConfig({ platform: e.target.value as "twitch" | "kick" })
              }
              disabled={isRunning}>
              <option value="twitch">Twitch</option>
              <option value="kick">Kick</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Channel Name / ID
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Enter channel name"
              value={state.config.channel}
              onChange={(e) => updateConfig({ channel: e.target.value })}
              disabled={isRunning}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Entry Keyword
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="!join"
              value={state.config.keyword}
              onChange={(e) => updateConfig({ keyword: e.target.value })}
              disabled={isRunning}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-zinc-700 p-3">
            <div>
              <p className="text-sm font-medium text-zinc-300">
                Subscribers Only
              </p>
              <p className="text-xs text-zinc-500">
                Only subscribers can enter.
              </p>
            </div>
            <input
              type="checkbox"
              className={`size-5 ${state.config.platform === "twitch" ? "accent-[#9146FF]" : "accent-[#53FC18]"}`}
              checked={state.config.subscribersOnly}
              onChange={(e) =>
                updateConfig({ subscribersOnly: e.target.checked })
              }
              disabled={isRunning}
            />
          </div>

          {state.config.subscribersOnly && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-400">
                Minimum Sub Months
              </label>
              <input
                type="number"
                min={1}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                value={state.config.minSubMonths}
                onChange={(e) =>
                  updateConfig({
                    minSubMonths: Math.max(
                      1,
                      parseInt(e.target.value || "1", 10),
                    ),
                  })
                }
                disabled={isRunning}
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Max Wins Per User
            </label>
            <select
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              value={state.config.maxWinsPerUser}
              onChange={(e) =>
                updateConfig({ maxWinsPerUser: parseInt(e.target.value, 10) })
              }
              disabled={isRunning}>
              <option value={1}>1 win per user</option>
              <option value={2}>2 wins per user</option>
              <option value={3}>3 wins per user</option>
              <option value={4}>4 wins per user</option>
              <option value={5}>5 wins per user</option>
              <option value={0}>Unlimited wins</option>
            </select>
          </div>

          <button
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium hover:bg-zinc-700 disabled:opacity-50"
            onClick={resetConfig}
            disabled={isRunning}>
            Reset Configuration
          </button>
        </div>
      </div>

      {/* Right: Controls + Winners + Participants */}
      <div className="w-full max-w-md lg:max-w-2xl lg:shrink-0 rounded-xl bg-zinc-900 p-8 shadow-xl border border-zinc-800 flex flex-col h-[700px] space-y-4">
        {/* Controls */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 ${
                state.config.platform === "twitch"
                  ? "bg-[#5A189A] text-white hover:bg-[#4A0E8F]"
                  : "bg-[#53FC18] text-black hover:bg-[#45D115]"
              }`}
              onClick={start}
              disabled={isRunning || !state.config.channel.trim()}>
              Start Raffle
            </button>
            <button
              className="flex-1 rounded-md bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-600 disabled:opacity-50"
              onClick={stop}
              disabled={!isRunning}>
              Stop Raffle
            </button>
          </div>

          <button
            className="w-full rounded-md bg-emerald-800 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            onClick={handleDraw}
            disabled={state.participants.length === 0}>
            Draw Winner
          </button>

          {lastWinner && (
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4 text-center">
              <p className="text-sm text-zinc-400">Last Winner</p>
              <p className="text-xl font-bold text-white">{lastWinner}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <button
              className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium hover:bg-zinc-700 disabled:opacity-50"
              onClick={resetParticipants}
              disabled={state.participants.length === 0}>
              Reset Entries
            </button>
            <button
              className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium hover:bg-zinc-700 disabled:opacity-50"
              onClick={resetWinners}
              disabled={state.winners.length === 0}>
              Reset Winners
            </button>
            <button
              className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium hover:bg-zinc-700"
              onClick={resetAll}>
              Reset All
            </button>
          </div>
        </div>

        {/* Winners */}
        <div>
          <h2 className="mb-2 text-lg font-semibold text-center text-zinc-300">
            Winners ({state.winners.length})
          </h2>
          <div className="max-h-40 overflow-y-auto rounded-lg border border-zinc-800">
            {state.winners.length === 0 ? (
              <div className="p-4 text-center text-sm text-zinc-500">
                No winners yet.
              </div>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {state.winners.map((w, idx) => (
                  <li
                    key={`${w.id}-${idx}`}
                    className="flex items-center justify-between px-4 py-2 text-sm">
                    <span className="font-medium">
                      {w.displayName || w.username}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {new Date(w.drawnAt).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Participants */}
        <div className="flex-1 min-h-0">
          <h2 className="mb-2 text-lg font-semibold text-center text-zinc-300">
            Participants ({state.participants.length})
          </h2>
          <div className="h-full overflow-y-auto rounded-lg border border-zinc-800 p-4">
            {state.participants.length === 0 ? (
              <div className="text-center text-sm text-zinc-500">
                No participants yet.
              </div>
            ) : (
              <p className="text-sm text-zinc-300 leading-relaxed">
                {state.participants.map((p, idx) => (
                  <span key={p.id}>
                    <span className="font-medium">
                      {p.displayName || p.username}
                    </span>
                    {p.subMonths > 0 && (
                      <span className="text-xs text-zinc-500 ml-0.5">
                        ({p.subMonths}mo)
                      </span>
                    )}
                    {idx < state.participants.length - 1 && (
                      <span className="text-zinc-500">, </span>
                    )}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
