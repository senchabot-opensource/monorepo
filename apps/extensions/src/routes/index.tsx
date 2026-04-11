import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [widgetType, setWidgetType] = useState<"sub-sprout" | "chat">(
    "sub-sprout",
  );
  const [channel, setChannel] = useState("");
  const [platform, setPlatform] = useState<"twitch" | "kick">("twitch");
  const [twitchChannel, setTwitchChannel] = useState("");
  const [kickChannel, setKickChannel] = useState("");
  const [fontSize, setFontSize] = useState("18");
  const [hasBackground, setHasBackground] = useState(false);
  const [copied, setCopied] = useState(false);

  const getWidgetUrl = () => {
    if (typeof window === "undefined") return "";
    const baseUrl = window.location.origin;
    if (widgetType === "sub-sprout") {
      if (!channel) return "";
      return `${baseUrl}/widgets/sub-sprout-widget?channel=${encodeURIComponent(channel)}&platform=${platform}`;
    } else {
      const params = new URLSearchParams();
      if (twitchChannel) params.append("twitch", twitchChannel);
      if (kickChannel) params.append("kick", kickChannel);
      if (fontSize && fontSize !== "18") params.append("fontSize", fontSize);
      if (hasBackground) params.append("background", "true");

      if (!twitchChannel && !kickChannel) return "";
      return `${baseUrl}/widgets/chat-widget?${params.toString()}`;
    }
  };

  const handleCopy = async () => {
    const url = getWidgetUrl();
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFormValid =
    widgetType === "sub-sprout"
      ? channel.length > 0
      : twitchChannel.length > 0 || kickChannel.length > 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-100 font-sans">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-8 shadow-xl border border-zinc-800">
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
          Senchabot Extensions
        </h1>
        <h2 className="mb-6 text-xl font-semibold text-center text-zinc-300">
          Widget Configuration
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Select Widget
            </label>
            <select
              value={widgetType}
              onChange={e =>
                setWidgetType(e.target.value as "sub-sprout" | "chat")
              }
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
              <option value="sub-sprout">Sub Sprout</option>
              <option value="chat">Universal Chat (Multi-platform)</option>
            </select>
          </div>

          {widgetType === "sub-sprout" && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-400">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={channel}
                  onChange={e => setChannel(e.target.value)}
                  placeholder="e.g. senchabot"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-400">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={e =>
                    setPlatform(e.target.value as "twitch" | "kick")
                  }
                  disabled
                  className="w-full cursor-not-allowed rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                  <option value="twitch">Twitch</option>
                </select>
              </div>
            </>
          )}

          {widgetType === "chat" && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-400">
                  Twitch Channel (optional)
                </label>
                <input
                  type="text"
                  value={twitchChannel}
                  onChange={e => setTwitchChannel(e.target.value)}
                  placeholder="e.g. senchabot"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-400">
                  Kick Channel (optional)
                </label>
                <input
                  type="text"
                  value={kickChannel}
                  onChange={e => setKickChannel(e.target.value)}
                  placeholder="e.g. xqc"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium text-zinc-400">
                    Font Size (px)
                  </label>
                  <input
                    type="number"
                    value={fontSize}
                    onChange={e => setFontSize(e.target.value)}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-end pb-2">
                  <label className="flex items-center space-x-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasBackground}
                      onChange={e => setHasBackground(e.target.checked)}
                      className="rounded border-zinc-700 bg-zinc-800 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-sm">Dark Background</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="pt-4 mt-6 border-t border-zinc-800">
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Widget URL
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={getWidgetUrl()}
                className="w-full rounded-l-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-300 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                disabled={!isFormValid}
                className="rounded-r-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
