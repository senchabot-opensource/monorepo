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
  const [backgroundOpacity, setBackgroundOpacity] = useState("0.5");
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
    "vertical",
  );
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
      if (hasBackground && backgroundOpacity)
        params.append("bgOpacity", backgroundOpacity);
      if (orientation && orientation !== "vertical")
        params.append("orientation", orientation);

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
    <div className="flex min-h-screen flex-col lg:flex-row items-center lg:items-start justify-center bg-zinc-950 p-6 text-zinc-100 font-sans gap-8 pt-12">
      <div className="w-full max-w-md lg:shrink-0 rounded-xl bg-zinc-900 p-8 shadow-xl border border-zinc-800">
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

          <div className="text-sm text-zinc-400 bg-zinc-800/50 p-3 rounded-md border border-zinc-800">
            {widgetType === "sub-sprout" ? (
              <p>
                <strong className="text-zinc-300">Sub Sprout:</strong> A lively
                plant that grows with every new subscription. Perfect for
                visualizing your community's support on stream.
              </p>
            ) : (
              <p>
                <strong className="text-zinc-300">Universal Chat:</strong> A
                combined chat overlay that seamlessly merges messages from
                Twitch and Kick into a single, cohesive feed.
              </p>
            )}
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
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                  <option value="twitch">Twitch</option>
                  <option value="kick">Kick</option>
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
                <div className="flex-1 max-w-[150px]">
                  <label className="mb-1 block text-sm font-medium text-zinc-400">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={e =>
                      setOrientation(
                        e.target.value as "vertical" | "horizontal",
                      )
                    }
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="vertical">Vertical</option>
                    <option value="horizontal">Horizontal</option>
                  </select>
                </div>

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

              {hasBackground && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-400">
                    Background Opacity
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={backgroundOpacity}
                    onChange={e => setBackgroundOpacity(e.target.value)}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="text-right text-xs text-zinc-500 mt-1">
                    {backgroundOpacity}
                  </div>
                </div>
              )}
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

      <div className="w-full max-w-md lg:max-w-2xl lg:shrink-0 rounded-xl bg-zinc-900 p-8 shadow-xl border border-zinc-800 flex flex-col h-[700px]">
        <h2 className="mb-4 text-xl font-semibold text-center text-zinc-300">
          Widget Preview
        </h2>
        <div className="flex-1 w-full bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 relative shadow-inner flex items-center justify-center relative bg-opacity-20">
          {isFormValid ? (
            <iframe
              src={getWidgetUrl()}
              className="absolute inset-0 w-full h-full border-0"
              title="Widget Preview"
            />
          ) : (
            <div className="text-center text-zinc-500">
              <p>Fill in the required fields to generate preview.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
