import { Breadcrumb } from "#/components/breadcrumb";
import { YoutubeTutorial } from "#/components/youtube-tutorial";
import { useRaffleChat } from "#/hooks/use-raffle-chat";
import { useRaffleState } from "#/hooks/use-raffle-state";
import { useT } from "#/lib/i18n";
import type { RaffleWinner } from "#/types/raffle";
import confetti from "canvas-confetti";
import { useCallback, useEffect, useRef, useState } from "react";

function triggerConfetti(rafRef: React.MutableRefObject<number | null>) {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      rafRef.current = requestAnimationFrame(frame);
    }
  };

  rafRef.current = requestAnimationFrame(frame);
}

export function RaffleWidget({
  initialChannel = "",
  platform = "twitch",
  onDrawWinner,
}: {
  initialChannel?: string;
  platform?: "twitch" | "kick";
  onDrawWinner?: (winner: RaffleWinner) => void;
}) {
  const t = useT();
  const {
    state,
    updateConfig,
    start,
    stop,
    drawWinner,
    removeParticipant,
    resetParticipants,
    resetWinners,
    resetAll,
    resetConfig,
    addParticipant,
    eligibleCount,
  } = useRaffleState({ initialChannel, platform });

  const [lastWinner, setLastWinner] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const confettiRafRef = useRef<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (confettiRafRef.current) {
        cancelAnimationFrame(confettiRafRef.current);
      }
    };
  }, []);

  const getWidgetUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/widgets/raffle-overlay`;
  }, []);

  const handleCopy = useCallback(async () => {
    const url = getWidgetUrl();
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [getWidgetUrl]);

  const minDurationRemainingMs =
    state.startedAt != null
      ? Math.max(
          0,
          state.config.minRaffleDurationSec * 1000 - (now - state.startedAt),
        )
      : 0;

  const canDraw =
    (state.status === "running" || state.status === "stopped") &&
    eligibleCount > 0 &&
    minDurationRemainingMs === 0;

  const isRunning = state.status === "running";
  const isStopped = state.status === "stopped";
  const isConfigLocked = isRunning || isStopped;
  const hasActiveState = state.participants.length > 0 || state.winners.length > 0 || state.status !== "idle";

  const drawLabel =
    (isRunning || isStopped) && minDurationRemainingMs > 0
      ? t("raffle.drawLocked", { seconds: Math.ceil(minDurationRemainingMs / 1000) })
      : t("raffle.drawWinner", { count: eligibleCount });

  useRaffleChat(state.config, addParticipant, state.status === "running");

  const handleDraw = useCallback(() => {
    const winner = drawWinner();
    if (winner) {
      setLastWinner(winner.displayName || winner.username);
      triggerConfetti(confettiRafRef);
      if (onDrawWinner) onDrawWinner(winner);
    }
  }, [drawWinner, onDrawWinner]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans p-4 sm:p-6 pt-12 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-8 mb-12">
          {/* Left: Configuration */}
          <div className="w-full max-w-md lg:shrink-0 rounded-xl bg-white p-4 sm:p-6 lg:p-8 shadow-xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="mb-4">
              <Breadcrumb
                items={[
                  { label: t("common.home"), href: "/" },
                  { label: t("raffle.breadcrumb") },
                ]}
              />
            </div>
            <div className="mb-6 flex justify-center">
              <a
                className="relative inline-flex select-none flex-col items-center gap-2 text-xl font-semibold tracking-wide text-zinc-900 transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:text-white"
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

            <div className="flex justify-center mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-0.5 text-xs font-medium text-green-700 border border-green-500/20 dark:text-green-400">
                {t("common.freeBadge")}
              </span>
            </div>

            <h1 className="mb-4 text-2xl font-bold text-center text-zinc-900 dark:text-white">
              {t("raffle.title")}
            </h1>

            {isConfigLocked && (
              <div
                role="status"
                className="mb-4 flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200">
                <span aria-hidden="true" className="select-none text-base leading-none">
                  🔒
                </span>
                <div className="space-y-0.5">
                  <p className="font-semibold uppercase tracking-wide text-xs">
                    {t("raffle.lockedTitle")}
                  </p>
                  <p className="text-xs text-amber-700/90 dark:text-amber-300/90">
                    {t("raffle.lockedDesc")}
                  </p>
                </div>
              </div>
            )}

            <div
              className="space-y-4"
              aria-disabled={isConfigLocked}>
              <p className="text-xs text-zinc-600 bg-zinc-100 p-3 rounded-md border border-zinc-200 leading-relaxed dark:text-zinc-400 dark:bg-zinc-800/40 dark:border-zinc-800">
                {t("raffle.intro")}
              </p>

              <YoutubeTutorial />

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Platform
                </label>
                <select
                  className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white disabled:cursor-not-allowed disabled:opacity-60 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={state.config.platform}
                  onChange={(e) =>
                    updateConfig({ platform: e.target.value as "twitch" | "kick" })
                  }
                  disabled={isConfigLocked}>
                  <option value="twitch">Twitch</option>
                  <option value="kick">Kick</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("raffle.channelName")}
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white placeholder-zinc-500 disabled:cursor-not-allowed disabled:opacity-60 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder={t("common.channelPlaceholder")}
                  value={state.config.channel}
                  onChange={(e) => updateConfig({ channel: e.target.value })}
                  disabled={isConfigLocked}
                />
                <p className="mt-1 text-xs text-zinc-500">
                  {t("raffle.channelHint")}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("raffle.entryKeyword")}
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white placeholder-zinc-500 disabled:cursor-not-allowed disabled:opacity-60 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="!join"
                  value={state.config.keyword}
                  onChange={(e) => updateConfig({ keyword: e.target.value })}
                  disabled={isConfigLocked}
                />
                <p className="mt-1 text-xs text-zinc-500">
                  {t("raffle.entryKeywordHint")}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-zinc-300 p-3 dark:border-zinc-700">
                <div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("raffle.subscribersOnly")}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {t("raffle.subscribersOnlyHint")}
                  </p>
                </div>
                <input
                  type="checkbox"
                  className={`size-5 disabled:cursor-not-allowed disabled:opacity-60 ${state.config.platform === "twitch" ? "accent-[#9146FF]" : "accent-[#53FC18]"}`}
                  checked={state.config.subscribersOnly}
                  onChange={(e) =>
                    updateConfig({ subscribersOnly: e.target.checked })
                  }
                  disabled={isConfigLocked}
                />
              </div>

              {state.config.subscribersOnly && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {t("raffle.minSubMonths")}
                  </label>
                  <input
                    type="number"
                    min={1}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white disabled:cursor-not-allowed disabled:opacity-60 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={state.config.minSubMonths}
                    onChange={(e) =>
                      updateConfig({
                        minSubMonths: Math.max(
                          1,
                          parseInt(e.target.value || "1", 10),
                        ),
                      })
                    }
                    disabled={isConfigLocked}
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    {t("raffle.minSubMonthsHint")}
                  </p>
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("raffle.maxWinsPerUser")}
                </label>
                <select
                  className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white disabled:cursor-not-allowed disabled:opacity-60 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={state.config.maxWinsPerUser}
                  onChange={(e) =>
                    updateConfig({ maxWinsPerUser: parseInt(e.target.value, 10) })
                  }
                  disabled={isConfigLocked}>
                  <option value={1}>{t("raffle.maxWins1")}</option>
                  <option value={2}>{t("raffle.maxWins2")}</option>
                  <option value={3}>{t("raffle.maxWins3")}</option>
                  <option value={4}>{t("raffle.maxWins4")}</option>
                  <option value={5}>{t("raffle.maxWins5")}</option>
                  <option value={0}>{t("raffle.maxWinsUnlimited")}</option>
                </select>
                <p className="mt-1 text-xs text-zinc-500">
                  {t("raffle.maxWinsHint")}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("raffle.minDuration")}
                </label>
                <input
                  type="number"
                  min={0}
                  max={300}
                  className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white disabled:cursor-not-allowed disabled:opacity-60 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={state.config.minRaffleDurationSec}
                  onChange={(e) =>
                    updateConfig({
                      minRaffleDurationSec: Math.max(
                        0,
                        Math.min(300, parseInt(e.target.value || "0", 10) || 0),
                      ),
                    })
                  }
                  disabled={isConfigLocked}
                />
                <p className="mt-1 text-xs text-zinc-500">
                  {t("raffle.minDurationHint")}
                </p>
              </div>

              <button
                className="w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm font-medium hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                onClick={resetConfig}
                disabled={isConfigLocked}>
                {t("raffle.resetConfig")}
              </button>
            </div>
          </div>

          {/* Right: Controls + Winners + Participants + Overlay URL + FAQs */}
          <div className="w-full max-w-md lg:max-w-2xl lg:shrink-0 flex flex-col gap-4">
            <div className="rounded-xl bg-white p-4 sm:p-6 lg:p-8 shadow-xl border border-zinc-200 flex flex-col min-h-[400px] lg:h-[700px] space-y-4 dark:bg-zinc-900 dark:border-zinc-800">
              {/* Controls */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    className={`flex-1 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 transition-colors ${
                      state.config.platform === "twitch"
                        ? "bg-[#5A189A] text-white hover:bg-[#4A0E8F]"
                        : "bg-[#53FC18] text-black hover:bg-[#45D115]"
                    }`}
                    onClick={start}
                    disabled={isRunning || !state.config.channel.trim()}>
                    {t("raffle.startRaffle")}
                  </button>
                  <button
                    className="flex-1 rounded-md bg-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-400 disabled:opacity-50 transition-colors dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                    onClick={stop}
                    disabled={!isRunning}>
                    {t("raffle.stopRaffle")}
                  </button>
                </div>

                <button
                  className="w-full rounded-md bg-emerald-800 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  onClick={handleDraw}
                  disabled={!canDraw}>
                  {drawLabel}
                </button>

                {lastWinner && (
                  <div className="rounded-lg border border-zinc-300 bg-zinc-100 p-4 text-center dark:border-zinc-700 dark:bg-zinc-800">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{t("raffle.lastWinner")}</p>
                    <p className="text-xl font-bold text-zinc-900 dark:text-white">{lastWinner}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    className="rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-xs font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                    onClick={resetParticipants}
                    disabled={state.participants.length === 0}>
                    {t("raffle.resetEntries")}
                  </button>
                  <button
                    className="rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-xs font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                    onClick={resetWinners}
                    disabled={state.winners.length === 0}>
                    {t("raffle.resetWinners")}
                  </button>
                  <button
                    className="rounded-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-xs font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                    onClick={resetAll}
                    disabled={!hasActiveState}>
                    {t("raffle.resetAll")}
                  </button>
                </div>
              </div>

              {/* Winners */}
              <div>
                <h2 className="mb-2 text-lg font-semibold text-center text-zinc-700 dark:text-zinc-300">
                  {t("raffle.winners", { count: state.winners.length })}
                </h2>
                <div className="max-h-40 overflow-y-auto rounded-lg bg-zinc-100 dark:bg-zinc-800/30">
                  {state.winners.length === 0 ? (
                    <div className="p-4 text-center text-sm text-zinc-500">
                      {t("raffle.noWinners")}
                    </div>
                  ) : (
                    <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {state.winners.map((w, idx) => (
                        <li
                          key={`${w.id}-${idx}`}
                          className="flex items-center justify-between px-4 py-2 text-sm">
                          <span className="font-medium text-zinc-800 dark:text-zinc-200">
                            {w.displayName || w.username}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {new Date(w.drawnAt).toLocaleTimeString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Participants with Disqualify Option */}
              <div className="flex-1 min-h-0 sm:mb-2 lg:mb-8">
                <h2 className="mb-2 text-lg font-semibold text-center text-zinc-700 dark:text-zinc-300">
                  {t("raffle.participants", { count: state.participants.length })}
                </h2>
                <div className="h-full overflow-y-auto rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800/30">
                  {state.participants.length === 0 ? (
                    <div className="text-center text-sm text-zinc-500">
                      {t("raffle.noParticipants", { keyword: state.config.keyword })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {state.participants.map((p) => (
                        <span
                          key={p.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 border border-zinc-300 px-2.5 py-1 text-xs text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
                        >
                          <span className="font-medium">{p.displayName || p.username}</span>
                          {p.subMonths > 0 && (
                            <span className="text-[10px] text-green-700 font-semibold bg-green-500/10 px-1 py-0.2 rounded dark:text-green-400">
                              {t("raffle.subMonthsShort", { months: p.subMonths })}
                            </span>
                          )}
                          <button
                            onClick={() => removeParticipant(p.id)}
                            title={t("raffle.disqualify")}
                            className="text-zinc-500 hover:text-red-400 transition-colors text-xs ml-0.5 leading-none"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Winner Overlay URL Card */}
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
              <label className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {t("raffle.overlayUrl")}
              </label>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={getWidgetUrl()}
                  className="w-full rounded-l-md border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 focus:outline-none text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="rounded-r-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors">
                  {copied ? t("common.copied") : t("common.copy")}
                </button>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {t("raffle.overlayUrlHint")}
              </p>
            </div>

            {/* Quick OBS Guide & FAQ (Placed under preview/controls) */}
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-200 bg-zinc-100/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                <h3 className="text-sm font-semibold text-zinc-900 mb-2 dark:text-white">{t("raffle.guideTitle")}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                  {t("raffle.guideBody")}
                </p>
              </div>

              <div className="space-y-3">
                <details className="group rounded-lg border border-zinc-200/80 bg-zinc-100/60 p-4 transition-colors open:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:open:bg-zinc-900">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white">
                    <span>{t("raffle.faq1Q")}</span>
                    <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">▼</span>
                  </summary>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                    {t("raffle.faq1A")}
                  </p>
                </details>

                <details className="group rounded-lg border border-zinc-200/80 bg-zinc-100/60 p-4 transition-colors open:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:open:bg-zinc-900">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white">
                    <span>{t("raffle.faq2Q")}</span>
                    <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">▼</span>
                  </summary>
                  <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                    {t("raffle.faq2A")}
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
