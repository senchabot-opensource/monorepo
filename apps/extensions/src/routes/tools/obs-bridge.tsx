import { useChat } from "#/features/tools/use-chat";
import { getKickChannelInfo } from "#/lib/kick";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  mainScene: z.string().default("Main Scene"),
  brbScene: z.string().default("BRB Scene"),
  twitch: z.string().optional(),
  kick: z.string().optional(),
  obsWebsocketUrl: z.string().optional(),
  obsWebsocketPassword: z.string().optional(),
  commandUser: z.string().optional(),
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
  if (scenes.length === 0) return null;

  const mainInList = scenes.includes(mainScene);
  const brbInList = scenes.includes(brbScene);
  const needsMain = !mainInList;
  const needsBrb = !brbInList;

  return (
    <div className="mt-6">
      {(needsMain || needsBrb) && (
        <div className="mb-3 p-2 rounded-md border border-yellow-700 bg-yellow-500/10 text-xs text-yellow-300">
          {needsMain && needsBrb
            ? "Assign a Main and a BRB scene below so chat commands know which scenes to switch to."
            : needsMain
              ? "Assign a Main scene below so the back command knows which scene to switch to."
              : "Assign a BRB scene below so the brb command knows which scene to switch to."}
        </div>
      )}
      <h3 className="text-sm font-semibold text-zinc-400 mb-3">
        OBS Scenes ({scenes.length})
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
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
              }`}
            >
              <span className="text-zinc-200 font-mono text-xs truncate flex-1">
                {isMain && <span className="text-green-400 mr-1">●</span>}
                {isBrb && <span className="text-amber-400 mr-1">●</span>}
                {name}
              </span>
              <div className="flex gap-1 shrink-0 ml-2">
                <button
                  onClick={() => onSetMain(name)}
                  disabled={isMain}
                  className="rounded px-2 py-0.5 text-[11px] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-green-600/20 text-green-400 hover:bg-green-600/40"
                >
                  Main
                </button>
                <button
                  onClick={() => onSetBrb(name)}
                  disabled={isBrb}
                  className="rounded px-2 py-0.5 text-[11px] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-amber-600/20 text-amber-400 hover:bg-amber-600/40"
                >
                  BRB
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-zinc-500">
        Click <span className="text-green-400">Main</span> or{" "}
        <span className="text-amber-400">BRB</span> next to a scene to assign it. The
        URL updates automatically.
      </p>
    </div>
  );
}

function CommandUsers({
  users,
  onAdd,
  onRemove,
}: {
  users: string[];
  onAdd: (user: string) => void;
  onRemove: (user: string) => void;
}) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const name = input.trim().toLowerCase();
    if (name && !users.includes(name)) {
      onAdd(name);
      setInput("");
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-400 mb-2">
        Command Users ({users.length})
      </h3>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {users.map((u) => (
          <span
            key={u}
            className="inline-flex items-center gap-1 rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-200"
          >
            {u}
            <button
              onClick={() => onRemove(u)}
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
          placeholder="Add username"
          className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { kick } = Route.useLoaderData();

  const [scenes, setScenes] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  const mainSelected = scenes.length > 0 && scenes.includes(search.mainScene);
  const brbSelected = scenes.length > 0 && scenes.includes(search.brbScene);

  const commandUsers = search.commandUser ? search.commandUser
    .split(",")
    .map((u) => u.trim().toLowerCase())
    .filter(Boolean) : [];

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
    search.commandUser,
    onScenes,
    onConnected,
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

  const addUser = (user: string) => {
    const updated = [...new Set([...commandUsers, user])].join(",");
    navigate({ to: ".", search: { ...search, commandUser: updated }, replace: true });
  };

  const removeUser = (user: string) => {
    const updated = commandUsers.filter((u) => u !== user);
    const val = updated.length > 0 ? updated.join(",") : "";
    navigate({ to: ".", search: { ...search, commandUser: val }, replace: true });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex items-start justify-center py-12 px-4">
      <div className="rounded-xl bg-zinc-900 p-8 border border-zinc-800 shadow-xl max-w-lg w-full">
        <div className="flex justify-center mb-4">
          <img src="/senchabot-logo.svg" alt="Senchabot" width={40} height={40} />
        </div>
        <h1 className="text-xl font-bold text-center text-white mb-6">OBS Bridge</h1>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center bg-zinc-800/50 p-3 rounded-md border border-zinc-800">
            <span className="text-zinc-400">OBS WebSocket</span>
            <span id="obs-status" style={{ color: connected ? "lime" : "yellow" }}>
              {connected ? "Connected" : "Connecting..."}
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
            <div className="text-xs text-zinc-500 bg-zinc-800/30 p-3 rounded-md border border-zinc-800/50 text-center">
              Fetching scene list...
            </div>
          )}

          <div className="flex justify-between items-center bg-zinc-800/50 p-3 rounded-md border border-zinc-800">
            <span className="text-zinc-400">Main Scene</span>
            <span className={`font-mono text-xs font-medium ${mainSelected ? "text-green-400" : "text-red-400"}`}>
              {connected && scenes.length > 0 ? mainSelected ? search.mainScene : "Not selected" : search.mainScene}
            </span>
          </div>
          <div className="flex justify-between items-center bg-zinc-800/50 p-3 rounded-md border border-zinc-800">
            <span className="text-zinc-400">BRB Scene</span>
            <span className={`font-mono text-xs font-medium ${brbSelected ? "text-amber-400" : "text-red-400"}`}>
              {connected && scenes.length > 0 ? brbSelected ? search.brbScene : "Not selected" : search.brbScene}
            </span>
          </div>

          <div className="bg-zinc-800/50 p-3 rounded-md border border-zinc-800">
            <CommandUsers
              users={commandUsers}
              onAdd={addUser}
              onRemove={removeUser}
            />
          </div>

          {search.twitch && (
            <div className="flex justify-between items-center bg-zinc-800/50 p-3 rounded-md border border-zinc-800">
              <span className="text-zinc-400">Twitch</span>
              <span className="text-purple-400 font-medium">{search.twitch}</span>
            </div>
          )}
          {search.kick && (
            <div className="flex justify-between items-center bg-zinc-800/50 p-3 rounded-md border border-zinc-800">
              <span className="text-zinc-400">Kick</span>
              <span className="text-green-400 font-medium">{search.kick}</span>
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-zinc-500 text-center">
          This page stays open to maintain the bridge connection. Any of the command users can control OBS via chat.
        </p>
      </div>
    </div>
  );
}
