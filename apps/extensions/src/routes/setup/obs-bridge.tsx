import { Breadcrumb } from "#/components/breadcrumb";
import { YoutubeTutorial } from "#/components/youtube-tutorial";
import { createFileRoute } from "@tanstack/react-router";
import { useDeferredValue, useMemo, useState } from "react";

export const Route = createFileRoute("/setup/obs-bridge")({
  head: () => ({
    meta: [
      { title: "OBS Bridge Setup — Chat-Controlled OBS Scene & Recording Tool for Twitch & Kick — Senchabot Extensions" },
      {
        name: "description",
        content:
          "Set up a free OBS Bridge that lets you control OBS Studio directly from Twitch or Kick chat. Switch scenes, start/stop recording and streaming with chat commands from trusted users. Browser source ready.",
      },
      {
        name: "keywords",
        content:
          "obs bridge, obs websocket, chat controlled obs, obs scene switcher, obs chat commands, twitch obs control, kick obs control, obs remote control, streamer tool, obs browser source, senchabot obs, obs recording control, obs stream control, scene switching, brb scene, obs automation",
      },
      {
        property: "og:title",
        content: "OBS Bridge Setup — Chat-Controlled OBS Scene & Recording Tool for Twitch & Kick — Senchabot Extensions",
      },
      {
        property: "og:description",
        content:
          "Control OBS Studio from Twitch or Kick chat. Switch scenes, toggle recording, and manage your stream with simple chat commands from trusted users.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://extensions.senchabot.com/setup/obs-bridge",
      },
      {
        property: "og:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "OBS Bridge Setup — Chat-Controlled OBS Scene & Recording Tool — Senchabot Extensions",
      },
      {
        name: "twitter:description",
        content:
          "Control OBS Studio from Twitch or Kick chat. Switch scenes, start/stop recording, and manage your stream with chat commands.",
      },
      {
        name: "twitter:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "OBS Bridge Widget & Tool",
          description:
            "A free OBS control tool that lets you switch scenes, start/stop recording and streaming directly from Twitch or Kick chat commands.",
          url: "https://extensions.senchabot.com/setup/obs-bridge",
          applicationCategory: "StreamingTool",
          operatingSystem: "All",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://extensions.senchabot.com/setup/obs-bridge",
      },
    ],
  }),
  component: ObsBridgeSetup,
});

function CommandUserInput({
  users,
  onChange,
}: {
  users: string[];
  onChange: (users: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const name = input.trim().toLowerCase();
    if (name && !users.includes(name)) {
      onChange([...users, name]);
      setInput("");
    }
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-400">
        Command Users
      </label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {users.map((u) => (
          <span
            key={u}
            className="inline-flex items-center gap-1 rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-200"
          >
            {u}
            <button
              onClick={() => onChange(users.filter((x) => x !== u))}
              className="text-zinc-500 hover:text-red-400 transition-colors leading-none"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          placeholder="e.g. yourchannelname"
          className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        Only these users' chat messages will trigger OBS actions.
      </p>
    </div>
  );
}

function ObsBridgeSetup() {
  const [commandUsers, setCommandUsers] = useState<string[]>([]);
  const [obsWebsocketUrl, setObsWebsocketUrl] = useState("");
  const [obsWebsocketPassword, setObsWebsocketPassword] = useState("");
  const [twitchChannel, setTwitchChannel] = useState("");
  const [kickChannel, setKickChannel] = useState("");
  const [copied, setCopied] = useState(false);

  const deferredCommandUsers = useDeferredValue(commandUsers);
  const deferredObsUrl = useDeferredValue(obsWebsocketUrl);
  const deferredObsPass = useDeferredValue(obsWebsocketPassword);
  const deferredTwitch = useDeferredValue(twitchChannel);
  const deferredKick = useDeferredValue(kickChannel);

  const toolUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams();
    params.append("commandUser", deferredCommandUsers.join(","));
    if (deferredObsUrl) params.append("obsWebsocketUrl", deferredObsUrl);
    if (deferredObsPass) params.append("obsWebsocketPassword", deferredObsPass);
    if (deferredTwitch) params.append("twitch", deferredTwitch);
    if (deferredKick) params.append("kick", deferredKick);
    return `${window.location.origin}/tools/obs-bridge?${params.toString()}`;
  }, [deferredCommandUsers, deferredObsUrl, deferredObsPass, deferredTwitch, deferredKick]);

  const handleCopy = async () => {
    if (toolUrl) {
      await navigator.clipboard.writeText(toolUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFormValid = twitchChannel.length > 0 || kickChannel.length > 0;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row items-center lg:items-start justify-center bg-zinc-950 p-6 text-zinc-100 font-sans gap-8 pt-12">
      <div className="w-full max-w-md lg:shrink-0 rounded-xl bg-zinc-900 p-8 shadow-xl border border-zinc-800">
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "OBS Bridge Setup" },
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
          OBS Bridge Setup
        </h1>

        <div className="space-y-4">
          <div className="text-sm text-zinc-400 bg-zinc-800/50 p-3 rounded-md border border-zinc-800">
            <p>
              <strong className="text-zinc-300">OBS Bridge:</strong> A
              chat-controlled OBS tool that listens for commands from
              designated users in your Twitch or Kick chat and executes them
              in OBS Studio. Switch scenes, start/stop recording, and
              control your stream — all from chat.
            </p>
          </div>

          <YoutubeTutorial />

          <div className="text-xs text-zinc-500 bg-zinc-800/30 p-3 rounded-md border border-zinc-800/50">
            <p>Scenes are assigned on the tool page. After opening the tool, select your <strong className="text-zinc-300">Main</strong> and <strong className="text-zinc-300">BRB</strong> scenes from the OBS scene list.</p>
          </div>

          <div className="pt-2">
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Twitch Channel (to listen in)
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
              Kick Channel (to listen in)
            </label>
            <input
              type="text"
              value={kickChannel}
              onChange={e => setKickChannel(e.target.value)}
              placeholder="e.g. xqc"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <CommandUserInput
            users={commandUsers}
            onChange={setCommandUsers}
          />

          <details className="rounded-md border border-zinc-800 bg-zinc-900/40 open:bg-zinc-900/60 transition-colors">
            <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white">
              OBS WebSocket Connection
            </summary>
            <div className="space-y-4 border-t border-zinc-800 p-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-400">
                  OBS WebSocket URL
                </label>
                <input
                  type="text"
                  value={obsWebsocketUrl}
                  onChange={e => setObsWebsocketUrl(e.target.value)}
                  placeholder="Leave empty for default (ws://localhost:4455)"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Custom WebSocket URL if OBS is on a different machine. Defaults to <code className="text-zinc-300">ws://localhost:4455</code>.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-400">
                  OBS WebSocket Password
                </label>
                <input
                  type="password"
                  value={obsWebsocketPassword}
                  onChange={e => setObsWebsocketPassword(e.target.value)}
                  placeholder="Leave empty if no password set"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Set in OBS → Tools → WebSocket Server Settings.
                </p>
              </div>
            </div>
          </details>

          

          <div className="text-xs text-zinc-500 bg-zinc-800/30 p-3 rounded-md border border-zinc-800/50 space-y-1">
            <p className="font-medium text-zinc-400">Available Commands:</p>
            <p><code className="text-green-400">brb</code> — Switch to assigned BRB scene</p>
            <p><code className="text-green-400">back</code> — Switch to assigned Main scene</p>
            <p><code className="text-green-400">!startrecord</code> — Start recording</p>
            <p><code className="text-green-400">!stoprecord</code> — Stop recording</p>
            <p><code className="text-green-400">!startstream</code> — Start stream</p>
            <p><code className="text-green-400">!stopstream</code> — Stop stream</p>
          </div>

          <div className="pt-4 mt-6 border-t border-zinc-800 lg:hidden">
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Tool URL
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={toolUrl}
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
          Tool Preview
        </h2>
        <div className="flex-1 w-full bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 relative shadow-inner flex items-center justify-center">
          {isFormValid ? (
            <iframe
              src={toolUrl}
              className="absolute inset-0 w-full h-full border-0"
              title="OBS Bridge Preview"
            />
          ) : (
            <div className="text-center text-zinc-500">
              <p>Fill in at least one channel to generate preview.</p>
            </div>
          )}
        </div>

        <div className="mt-4 hidden lg:block">
          <label className="mb-1 block text-sm font-medium text-zinc-400">
            Tool URL
          </label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={toolUrl}
              className="w-full rounded-l-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-300 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              disabled={!isFormValid}
              className="rounded-r-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Open this URL in a browser or add it as a browser source in OBS to keep the bridge connection active.
          </p>
        </div>
      </div>
    </div>
  );
}
