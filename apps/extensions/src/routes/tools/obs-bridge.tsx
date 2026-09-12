import {
  type ChatPlatform,
  type CommandUser,
  formatCommandUsers,
  parseCommandUsers,
  resolveCommandUsers,
} from "#/features/tools/command-users";
import { SiteFooter } from "#/components/site-footer";
import { SiteHeader } from "#/components/site-header";
import { PlatformPicker, PlatformTag } from "#/features/tools/platform-picker";
import { DEFAULT_OBS_COMMANDS, type ObsBridgeCustomCommands } from "#/features/tools/obs-bridge-config";
import { useChat } from "#/features/tools/use-chat";
import { useT } from "#/lib/i18n";
import { getKickChannelInfo } from "#/lib/kick";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  mainScene: z.string().default("Main Scene"),
  brbScene: z.string().default("BRB Scene"),
  twitch: z.string().optional(),
  kick: z.string().optional(),
  obsWebsocketUrl: z.string().optional(),
  obsWebsocketPassword: z.string().optional(),
  commandUser: z.string().optional(),
  cmdBrb: z.string().optional(),
  cmdBack: z.string().optional(),
  cmdStartStream: z.string().optional(),
  cmdStopStream: z.string().optional(),
  cmdStartRecord: z.string().optional(),
  cmdStopRecord: z.string().optional(),
  cmdScene: z.string().optional(),
  lang: z.string().optional(),
});

export const Route = createFileRoute("/tools/obs-bridge")({
  ssr: false,
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    kick: search.kick,
  }),
  component: RouteComponent,
  loader: async ({ deps }) => {
    if (!deps.kick) {
      return { kick: null, kickSubBadges: [] };
    }
    const info = await getKickChannelInfo(deps.kick);
    return {
      kick: info.chatroomId,
      kickSubBadges: info.subscriberBadges || [],
    };
  },
});

function SceneList({
  scenes,
  mainScene,
  brbScene,
  onSetMain,
  onSetBrb,
}: {
  scenes: string[];
  mainScene: string;
  brbScene: string;
  onSetMain: (name: string) => void;
  onSetBrb: (name: string) => void;
}) {
  const t = useT();
  if (scenes.length === 0) return null;

  const mainInList = scenes.includes(mainScene);
  const brbInList = scenes.includes(brbScene);
  const needsMain = !mainInList;
  const needsBrb = !brbInList;

  return (
    <div className="mt-6">
      {(needsMain || needsBrb) && (
        <div className="mb-3 p-2 rounded-md border border-yellow-400 bg-yellow-50 text-xs text-yellow-800 dark:border-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300">
          {needsMain && needsBrb
            ? t("tools.assignMainBrbWarning")
            : needsMain
              ? t("tools.assignMainWarning")
              : t("tools.assignBrbWarning")}
        </div>
      )}
      <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-3">
        {t("tools.obsScenes", { count: scenes.length })}
      </h3>
      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {scenes.map((name) => {
          const isMain = name === mainScene;
          const isBrb = name === brbScene;
          return (
            <div
              key={name}
              className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors ${
                isMain
                  ? "border-green-600 bg-green-500/10"
                  : isBrb
                    ? "border-amber-600 bg-amber-500/10"
                    : "border-zinc-300 bg-zinc-100 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
              }`}
            >
              <span className="text-zinc-800 dark:text-zinc-200 font-mono text-xs truncate flex-1">
                {isMain && <span className="text-green-600 dark:text-green-400 mr-1">●</span>}
                {isBrb && <span className="text-amber-600 dark:text-amber-400 mr-1">●</span>}
                {name}
              </span>
              <div className="flex gap-1 shrink-0 ml-2">
                <button
                  onClick={() => onSetMain(name)}
                  disabled={isMain}
                  className="rounded px-2 py-0.5 text-[11px] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-green-600/20 text-green-700 hover:bg-green-600/40 dark:text-green-400"
                >
                  {t("tools.main")}
                </button>
                <button
                  onClick={() => onSetBrb(name)}
                  disabled={isBrb}
                  className="rounded px-2 py-0.5 text-[11px] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-amber-600/20 text-amber-700 hover:bg-amber-600/40 dark:text-amber-400"
                >
                  {t("tools.brb")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-zinc-500">
        {t("tools.assignHintClick")}{" "}
        <span className="text-green-600 dark:text-green-400">{t("tools.main")}</span>{" "}
        {t("tools.assignHintOr")}{" "}
        <span className="text-amber-600 dark:text-amber-400">{t("tools.brb")}</span>{" "}
        {t("tools.assignHintRest")}{" "}
        <code className="text-zinc-700 dark:text-zinc-300">!scene &lt;name&gt;</code>.
      </p>
    </div>
  );
}

function CommandUsers({
  users,
  platforms,
  onChange,
}: {
  users: CommandUser[];
  platforms: { twitch: boolean; kick: boolean };
  onChange: (users: CommandUser[]) => void;
}) {
  const t = useT();
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<ChatPlatform | null>(null);
  const bothPlatforms = platforms.twitch && platforms.kick;
  const onlyPlatform = bothPlatforms ? null : platforms.kick ? "kick" : platforms.twitch ? "twitch" : null;
  const platform = picked ?? onlyPlatform ?? "twitch";

  const has = (p: ChatPlatform | null, name: string) =>
    users.some((u) => u.platform === p && u.name === name);

  const handleAdd = () => {
    const name = input.trim().toLowerCase();
    if (name && !has(platform, name)) {
      onChange([...users, { platform, name }]);
      setInput("");
    }
  };

  const assign = (user: CommandUser, p: ChatPlatform) => {
    onChange(
      has(p, user.name)
        ? users.filter((u) => u !== user)
        : users.map((u) => (u === user ? { platform: p, name: u.name } : u)),
    );
  };

  const unassigned = users.some((u) => !u.platform) && bothPlatforms;

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
        {t("tools.commandUsers", { count: users.length })}
      </h3>
      {unassigned && (
        <p className="mb-2 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          {t("tools.pickPlatformWarning")}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {users.map((u) => {
          const shown = u.platform ?? onlyPlatform;
          const needsPlatform = !u.platform && bothPlatforms;
          return (
            <span
              key={`${u.platform}:${u.name}`}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs ${
                needsPlatform
                  ? "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/40 dark:text-amber-200"
                  : "bg-zinc-200 border-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
              }`}
            >
              {shown && <PlatformTag platform={shown} />}
              {u.name}
              {needsPlatform &&
                (["twitch", "kick"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => assign(u, p)}
                    className="rounded border border-amber-300 px-1 leading-4 hover:bg-amber-100 dark:border-amber-500/40 dark:hover:bg-amber-500/20"
                  >
                    <PlatformTag platform={p} />
                  </button>
                ))}
              <button
                onClick={() => onChange(users.filter((x) => x !== u))}
                className="text-zinc-500 hover:text-red-400 transition-colors leading-none"
              >
                ✕
              </button>
            </span>
          );
        })}
      </div>
      <div className="flex gap-1">
        <PlatformPicker value={platform} onChange={setPicked} label={t("tools.userPlatform")} />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          placeholder={t("tools.addUsername")}
          className="flex-1 rounded-md border border-zinc-300 bg-zinc-100 px-2.5 py-1.5 text-xs text-zinc-900 placeholder-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:focus:ring-offset-zinc-900"
        >
          {t("tools.add")}
        </button>
      </div>
    </div>
  );
}

function RouteComponent() {
  const t = useT();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { kick } = Route.useLoaderData();

  const [scenes, setScenes] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  const mainSelected = scenes.length > 0 && scenes.includes(search.mainScene);
  const brbSelected = scenes.length > 0 && scenes.includes(search.brbScene);

  const commandUsers = useMemo(() => parseCommandUsers(search.commandUser), [search.commandUser]);
  const hasTwitch = Boolean(search.twitch?.trim());
  const hasKick = Boolean(search.kick?.trim());
  const allowedCommandUsers = useMemo(
    () => resolveCommandUsers(commandUsers, { twitch: hasTwitch, kick: hasKick }).allowed,
    [commandUsers, hasTwitch, hasKick],
  );

  const customCommands: ObsBridgeCustomCommands = useMemo(() => ({
    cmdBrb: search.cmdBrb || DEFAULT_OBS_COMMANDS.cmdBrb,
    cmdBack: search.cmdBack || DEFAULT_OBS_COMMANDS.cmdBack,
    cmdStartStream: search.cmdStartStream || DEFAULT_OBS_COMMANDS.cmdStartStream,
    cmdStopStream: search.cmdStopStream || DEFAULT_OBS_COMMANDS.cmdStopStream,
    cmdStartRecord: search.cmdStartRecord || DEFAULT_OBS_COMMANDS.cmdStartRecord,
    cmdStopRecord: search.cmdStopRecord || DEFAULT_OBS_COMMANDS.cmdStopRecord,
    cmdScene: search.cmdScene || DEFAULT_OBS_COMMANDS.cmdScene,
  }), [
    search.cmdBrb,
    search.cmdBack,
    search.cmdStartStream,
    search.cmdStopStream,
    search.cmdStartRecord,
    search.cmdStopRecord,
    search.cmdScene,
  ]);

  const onScenes = useCallback((list: string[]) => {
    setScenes(list);
  }, []);

  const onConnected = useCallback((ok: boolean) => {
    setConnected(ok);
  }, []);

  useChat(
    search.mainScene,
    search.brbScene,
    search.twitch,
    kick,
    search.obsWebsocketUrl,
    search.obsWebsocketPassword,
    allowedCommandUsers,
    onScenes,
    onConnected,
    customCommands,
  );

  const setMain = (name: string) => {
    navigate({
      to: ".",
      search: { ...search, mainScene: name },
      replace: true,
    });
  };

  const setBrb = (name: string) => {
    navigate({
      to: ".",
      search: { ...search, brbScene: name },
      replace: true,
    });
  };

  const setCommandUsers = (users: CommandUser[]) => {
    navigate({ to: ".", search: { ...search, commandUser: formatCommandUsers(users) }, replace: true });
  };

  // The setup page previews this tool in an iframe; site chrome only belongs on the real page.
  const embedded = window.self !== window.top;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans dark:bg-zinc-950 dark:text-zinc-100">
      {!embedded && <SiteHeader variant="compact" title={t("tools.title")} widgetId="obs-bridge" />}
      <main
        id="main"
        tabIndex={-1}
        className={`flex items-start justify-center px-4 focus:outline-none ${embedded ? "py-12" : "pt-4 pb-12"}`}
      >
      <div className="rounded-xl bg-white p-8 border border-zinc-200 shadow-xl max-w-lg w-full dark:bg-zinc-900 dark:border-zinc-800">

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center bg-zinc-100 p-3 rounded-md border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800">
            <span className="text-zinc-600 dark:text-zinc-400">{t("tools.obsWebSocket")}</span>
            <span id="obs-status" style={{ color: connected ? "lime" : "yellow" }}>
              {connected ? t("tools.connected") : t("tools.connecting")}
            </span>
          </div>

          {connected && scenes.length > 0 && (
            <SceneList
              scenes={scenes}
              mainScene={search.mainScene}
              brbScene={search.brbScene}
              onSetMain={setMain}
              onSetBrb={setBrb}
            />
          )}

          {connected && scenes.length === 0 && (
            <div className="text-xs text-zinc-500 bg-zinc-100/60 p-3 rounded-md border border-zinc-200/60 text-center dark:bg-zinc-800/30 dark:border-zinc-800/50">
              {t("tools.fetchingScenes")}
            </div>
          )}

          <div className="flex justify-between items-center bg-zinc-100 p-3 rounded-md border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800">
            <span className="text-zinc-600 dark:text-zinc-400">{t("tools.mainScene")}</span>
            <span className={`font-mono text-xs font-medium ${mainSelected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {connected && scenes.length > 0 ? mainSelected ? search.mainScene : t("tools.notSelected") : search.mainScene}
            </span>
          </div>
          <div className="flex justify-between items-center bg-zinc-100 p-3 rounded-md border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800">
            <span className="text-zinc-600 dark:text-zinc-400">{t("tools.brbScene")}</span>
            <span className={`font-mono text-xs font-medium ${brbSelected ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
              {connected && scenes.length > 0 ? brbSelected ? search.brbScene : t("tools.notSelected") : search.brbScene}
            </span>
          </div>

          <div className="bg-zinc-100 p-3 rounded-md border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800">
            <CommandUsers
              users={commandUsers}
              platforms={{ twitch: hasTwitch, kick: hasKick }}
              onChange={setCommandUsers}
            />
          </div>

          {search.twitch && (
            <div className="flex justify-between items-center bg-zinc-100 p-3 rounded-md border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800">
              <span className="text-zinc-600 dark:text-zinc-400">Twitch</span>
              <span className="text-purple-600 font-medium dark:text-purple-400">{search.twitch}</span>
            </div>
          )}
          {search.kick && (
            <div className="flex justify-between items-center bg-zinc-100 p-3 rounded-md border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800">
              <span className="text-zinc-600 dark:text-zinc-400">Kick</span>
              <span className="text-green-600 font-medium dark:text-green-400">{search.kick}</span>
            </div>
          )}

          <div className="bg-zinc-100 p-3 rounded-md border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
              {t("tools.activeCommands")}
            </h3>
            <div className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300 font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("tools.cmdScene")}</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">{customCommands.cmdScene} &lt;name&gt;</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("tools.cmdBrb")}</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">{customCommands.cmdBrb}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("tools.cmdBack")}</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">{customCommands.cmdBack}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("tools.cmdStartStream")}</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">{customCommands.cmdStartStream}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("tools.cmdStopStream")}</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">{customCommands.cmdStopStream}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("tools.cmdStartRecord")}</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">{customCommands.cmdStartRecord}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("tools.cmdStopRecord")}</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">{customCommands.cmdStopRecord}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-zinc-500 text-center">
          {t("tools.footer")}
        </p>
      </div>
      </main>
      {!embedded && <SiteFooter />}
    </div>
  );
}
