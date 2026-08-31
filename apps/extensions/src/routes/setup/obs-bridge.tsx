import { Breadcrumb } from "#/components/breadcrumb";
import { YoutubeTutorial } from "#/components/youtube-tutorial";
import { createFileRoute } from "@tanstack/react-router";
import { useDeferredValue, useMemo, useState } from "react";

export const Route = createFileRoute("/setup/obs-bridge")({
  head: () => ({
    meta: [
      {
        title:
          "Free Chat-Controlled OBS Scene Switcher (No Login Required) — OBS Bridge | Senchabot",
      },
      {
        name: "description",
        content:
          "Control OBS Studio directly from Twitch and Kick chat commands. 100% Free, no login or account required. Switch scenes (BRB/Main/!scene) and trigger recording with chat commands.",
      },
      {
        name: "keywords",
        content:
          "free obs chat commands, chat controlled obs no login, obs scene switcher twitch kick, obs remote control chat free, obs bridge senchabot, obs !scene command",
      },
      {
        property: "og:title",
        content:
          "Free Chat-Controlled OBS Scene Switcher (No Login Required) — OBS Bridge | Senchabot",
      },
      {
        property: "og:description",
        content:
          "Control OBS Studio from Twitch or Kick chat. Switch to any scene with !scene, toggle recording, and manage your stream with chat commands. 100% Free & zero login required.",
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
        content:
          "Free Chat-Controlled OBS Scene Switcher (No Login Required)",
      },
      {
        name: "twitter:description",
        content:
          "Control OBS Studio scenes and recording directly from Twitch or Kick chat commands. 100% Free, zero login required.",
      },
      {
        name: "twitter:image",
        content: "https://extensions.senchabot.com/senchabot-logo.svg",
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "OBS Bridge - Free Chat-Controlled OBS Tool",
          description:
            "A free OBS control tool that lets you switch scenes with !scene commands, start/stop recording and streaming directly from Twitch or Kick chat commands with no account required.",
          url: "https://extensions.senchabot.com/setup/obs-bridge",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "All, OBS Studio, Streamlabs Desktop (OBS WebSocket), OBS.Live",
          isAccessibleForFree: true,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "100% Free, No Login Required",
          },
        },
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How does the !scene command work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Authorized command users can type '!scene <name>' in chat (e.g. '!scene Gaming' or '!scene Chatting') to immediately switch OBS Studio to any matching scene name.",
              },
            },
            {
              "@type": "Question",
              name: "Is OBS Bridge free and secure?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, OBS Bridge is 100% free and open-source. WebSocket connections run locally on your machine with zero credentials sent to external servers.",
              },
            },
          ],
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
        Authorized Users
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
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
  const [cmdScene, setCmdScene] = useState("!scene");
  const [cmdBrb, setCmdBrb] = useState("brb");
  const [cmdBack, setCmdBack] = useState("back");
  const [cmdStartStream, setCmdStartStream] = useState("!startstream");
  const [cmdStopStream, setCmdStopStream] = useState("!stopstream");
  const [cmdStartRecord, setCmdStartRecord] = useState("!startrecord");
  const [cmdStopRecord, setCmdStopRecord] = useState("!stoprecord");
  const [copied, setCopied] = useState(false);

  const deferredCommandUsers = useDeferredValue(commandUsers);
  const deferredObsUrl = useDeferredValue(obsWebsocketUrl);
  const deferredObsPass = useDeferredValue(obsWebsocketPassword);
  const deferredTwitch = useDeferredValue(twitchChannel);
  const deferredKick = useDeferredValue(kickChannel);
  const deferredCmdScene = useDeferredValue(cmdScene);
  const deferredCmdBrb = useDeferredValue(cmdBrb);
  const deferredCmdBack = useDeferredValue(cmdBack);
  const deferredCmdStartStream = useDeferredValue(cmdStartStream);
  const deferredCmdStopStream = useDeferredValue(cmdStopStream);
  const deferredCmdStartRecord = useDeferredValue(cmdStartRecord);
  const deferredCmdStopRecord = useDeferredValue(cmdStopRecord);

  const toolUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams();
    if (deferredCommandUsers.length > 0) {
      params.append("commandUser", deferredCommandUsers.join(","));
    }
    if (deferredObsUrl) params.append("obsWebsocketUrl", deferredObsUrl);
    if (deferredObsPass) params.append("obsWebsocketPassword", deferredObsPass);
    if (deferredTwitch) params.append("twitch", deferredTwitch);
    if (deferredKick) params.append("kick", deferredKick);
    if (deferredCmdScene && deferredCmdScene !== "!scene") params.append("cmdScene", deferredCmdScene.trim());
    if (deferredCmdBrb && deferredCmdBrb !== "brb") params.append("cmdBrb", deferredCmdBrb.trim());
    if (deferredCmdBack && deferredCmdBack !== "back") params.append("cmdBack", deferredCmdBack.trim());
    if (deferredCmdStartStream && deferredCmdStartStream !== "!startstream") params.append("cmdStartStream", deferredCmdStartStream.trim());
    if (deferredCmdStopStream && deferredCmdStopStream !== "!stopstream") params.append("cmdStopStream", deferredCmdStopStream.trim());
    if (deferredCmdStartRecord && deferredCmdStartRecord !== "!startrecord") params.append("cmdStartRecord", deferredCmdStartRecord.trim());
    if (deferredCmdStopRecord && deferredCmdStopRecord !== "!stoprecord") params.append("cmdStopRecord", deferredCmdStopRecord.trim());
    return `${window.location.origin}/tools/obs-bridge?${params.toString()}`;
  }, [
    deferredCommandUsers,
    deferredObsUrl,
    deferredObsPass,
    deferredTwitch,
    deferredKick,
    deferredCmdScene,
    deferredCmdBrb,
    deferredCmdBack,
    deferredCmdStartStream,
    deferredCmdStopStream,
    deferredCmdStartRecord,
    deferredCmdStopRecord,
  ]);

  const handleCopy = async () => {
    if (toolUrl) {
      await navigator.clipboard.writeText(toolUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFormValid = twitchChannel.length > 0 || kickChannel.length > 0;

  const activeScene = cmdScene.trim() || "!scene";
  const activeBrb = cmdBrb.trim() || "brb";
  const activeBack = cmdBack.trim() || "back";
  const activeStartStream = cmdStartStream.trim() || "!startstream";
  const activeStopStream = cmdStopStream.trim() || "!stopstream";
  const activeStartRecord = cmdStartRecord.trim() || "!startrecord";
  const activeStopRecord = cmdStopRecord.trim() || "!stoprecord";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 pt-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 mb-12">
          {/* Left: Configuration Panel */}
          <div className="w-full max-w-md lg:shrink-0 rounded-xl bg-zinc-900 p-6 md:p-8 shadow-xl border border-zinc-800">
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
                className="relative inline-flex select-none flex-col items-center gap-2 text-xl font-semibold tracking-wide text-white transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-0.5 text-xs font-medium text-green-400 border border-green-500/20">
                100% Free · No Login Required
              </span>
            </div>

            <h1 className="mb-4 text-2xl font-bold text-center text-white">
              OBS Bridge Setup
            </h1>

            <div className="space-y-4">
              <p className="text-xs text-zinc-400 bg-zinc-800/40 p-3 rounded-md border border-zinc-800 leading-relaxed">
                Control OBS Studio scenes and recording from chat commands issued by authorized users in your Twitch or Kick channel.
              </p>

              <YoutubeTutorial />

              <div className="text-xs text-zinc-500 bg-zinc-800/30 p-3 rounded-md border border-zinc-800/50">
                <p>
                  Scenes are assigned on the tool page. After opening the tool, select your <strong>Main</strong> and <strong>BRB</strong> scenes, or switch to any scene anytime using <code className="text-green-400 font-mono">!scene &lt;name&gt;</code>.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-400">
                  Twitch Channel (to listen in)
                </label>
                <input
                  type="text"
                  value={twitchChannel}
                  onChange={(e) => setTwitchChannel(e.target.value)}
                  placeholder="e.g. yourchannel"
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
                  onChange={(e) => setKickChannel(e.target.value)}
                  placeholder="e.g. yourchannel"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <CommandUserInput
                users={commandUsers}
                onChange={setCommandUsers}
              />

              {/* Custom Command Naming */}
              <details className="rounded-md border border-zinc-800 bg-zinc-900/40 open:bg-zinc-900/60 transition-colors">
                <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white">
                  Custom Command Names
                </summary>
                <div className="space-y-3 border-t border-zinc-800 p-3">
                  <p className="text-xs text-zinc-500">
                    Customize the chat trigger words for each action (e.g. change <code className="text-zinc-400">!scene</code> to <code className="text-zinc-400">scene</code> or <code className="text-zinc-400">!startstream</code> to <code className="text-zinc-400">start</code>).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-zinc-400">
                        Switch to Matching Scene (<code className="text-green-400 font-mono">{activeScene} &lt;name&gt;</code>)
                      </label>
                      <input
                        type="text"
                        value={cmdScene}
                        onChange={(e) => setCmdScene(e.target.value)}
                        placeholder="!scene (or scene)"
                        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-400">
                        Switch to BRB Scene
                      </label>
                      <input
                        type="text"
                        value={cmdBrb}
                        onChange={(e) => setCmdBrb(e.target.value)}
                        placeholder="brb"
                        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-400">
                        Switch to Main Scene
                      </label>
                      <input
                        type="text"
                        value={cmdBack}
                        onChange={(e) => setCmdBack(e.target.value)}
                        placeholder="back"
                        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-400">
                        Start Streaming
                      </label>
                      <input
                        type="text"
                        value={cmdStartStream}
                        onChange={(e) => setCmdStartStream(e.target.value)}
                        placeholder="!startstream (or start)"
                        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-400">
                        Stop Streaming
                      </label>
                      <input
                        type="text"
                        value={cmdStopStream}
                        onChange={(e) => setCmdStopStream(e.target.value)}
                        placeholder="!stopstream"
                        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-400">
                        Start Recording
                      </label>
                      <input
                        type="text"
                        value={cmdStartRecord}
                        onChange={(e) => setCmdStartRecord(e.target.value)}
                        placeholder="!startrecord"
                        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-400">
                        Stop Recording
                      </label>
                      <input
                        type="text"
                        value={cmdStopRecord}
                        onChange={(e) => setCmdStopRecord(e.target.value)}
                        placeholder="!stoprecord"
                        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </details>

              <details className="rounded-md border border-zinc-800 bg-zinc-900/40 open:bg-zinc-900/60 transition-colors">
                <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white">
                  OBS WebSocket Settings
                </summary>
                <div className="space-y-4 border-t border-zinc-800 p-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-400">
                      WebSocket URL
                    </label>
                    <input
                      type="text"
                      value={obsWebsocketUrl}
                      onChange={(e) => setObsWebsocketUrl(e.target.value)}
                      placeholder="ws://localhost:4455 (default)"
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                    <p className="mt-1 text-xs text-zinc-500">
                      Custom WebSocket URL if OBS is on a different machine. Defaults to <code className="text-zinc-300">ws://localhost:4455</code>.
                    </p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-400">
                      WebSocket Password
                    </label>
                    <input
                      type="password"
                      value={obsWebsocketPassword}
                      onChange={(e) =>
                        setObsWebsocketPassword(e.target.value)
                      }
                      placeholder="Leave empty if none"
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                    <p className="mt-1 text-xs text-zinc-500">
                      Set in OBS &rarr; Tools &rarr; WebSocket Server Settings.
                    </p>
                  </div>
                </div>
              </details>

              <div className="text-xs text-zinc-500 bg-zinc-800/30 p-3 rounded-md border border-zinc-800/50 space-y-1">
                <p className="font-medium text-zinc-400">
                  Active Chat Commands:
                </p>
                <p><code className="text-green-400">{activeScene} &lt;name&gt;</code> — Switch to matching scene (e.g. <code className="text-zinc-400">{activeScene} Gaming</code>)</p>
                <p><code className="text-green-400">{activeBrb}</code> — Switch to BRB scene</p>
                <p><code className="text-green-400">{activeBack}</code> — Switch to Main scene</p>
                <p><code className="text-green-400">{activeStartStream}</code> / <code className="text-green-400">{activeStopStream}</code> — Toggle stream</p>
                <p><code className="text-green-400">{activeStartRecord}</code> / <code className="text-green-400">{activeStopRecord}</code> — Toggle recording</p>
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
                    className="rounded-r-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Tool Preview & Guides/FAQ */}
          <div className="w-full max-w-md lg:max-w-2xl lg:shrink-0 flex flex-col gap-4">
            <div className="rounded-xl bg-zinc-900 p-6 md:p-8 shadow-xl border border-zinc-800 flex flex-col h-[700px]">
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
                    className="rounded-r-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  Keep this URL open in a tab or add as a Browser Source / Custom Dock in OBS Studio or Streamlabs Desktop to keep the bridge active.
                </p>
              </div>
            </div>

            {/* Quick OBS Guide & FAQ (Placed under preview) */}
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <h3 className="text-sm font-semibold text-white mb-2">OBS Studio Setup</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  1. Enable WebSocket Server under <strong>Tools &gt; WebSocket Server Settings</strong> in OBS.<br />
                  2. Open your generated Tool URL in a browser tab or add as a Custom Browser Dock in OBS.<br />
                  3. Type <code className="text-green-400 font-mono">!scene &lt;name&gt;</code> in chat (e.g. <code className="text-zinc-300 font-mono">!scene Gaming</code>) to switch to any scene matching that name.<br />
                  4. You can also assign quick <strong>Main</strong> and <strong>BRB</strong> scenes in the tool interface.
                </p>
              </div>

              <div className="space-y-3">
                <details className="group rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-4 transition-colors open:bg-zinc-900">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-200 group-hover:text-white">
                    <span>How does the !scene chat command work?</span>
                    <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">▼</span>
                  </summary>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    When an authorized user sends <code className="text-green-400 font-mono">!scene &lt;name&gt;</code>, OBS Bridge searches your OBS scenes for an exact or partial case-insensitive name match and switches to that scene immediately.
                  </p>
                </details>

                <details className="group rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-4 transition-colors open:bg-zinc-900">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-200 group-hover:text-white">
                    <span>Is my OBS WebSocket password secure?</span>
                    <span className="transition-transform group-open:rotate-180 text-zinc-500 text-xs">▼</span>
                  </summary>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    Yes. The WebSocket connection runs directly between your browser and OBS Studio on your local machine. No credentials are sent to our servers.
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
