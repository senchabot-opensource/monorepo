import { type RefObject, useCallback, useEffect, useRef } from "react";
import type { BaseChatClient, ChatConnectionStatus } from "#/lib/basechat";
import { TwitchChat } from "#/lib/twitch";
import { KickChat } from "#/lib/kick";
import type { ChatMessagesType } from "../widgets/chat-widget/chat-messages";
import { type ChatPlatform, commandUserKey } from "./command-users";
import { DEFAULT_OBS_COMMANDS, type ObsBridgeCustomCommands, obsSocketUrl } from "./obs-bridge-config";
import { OBSWebSocket } from 'obs-websocket-js';

type ObsStatus = "connecting" | "connected" | "failed" | "disconnected";

const OBS_RETRY_MS = 5000;

export type ObsState = {
  status: ObsStatus;
  /** Attempts since the last successful connect. */
  attempt: number;
  /** When the next attempt starts, while one is scheduled. */
  retryAt: number | null;
  /** Close code of the last failure: 4009 is a rejected or missing password, 1006 no answer. */
  code: number | null;
  reason: string;
  /** When the current connection was made. */
  since: number | null;
};

export type ObsAction =
  | "scene"
  | "brb"
  | "back"
  | "startStream"
  | "stopStream"
  | "startRecord"
  | "stopRecord";

/** A command from an authorized user and what came of it. */
export type ObsActivity = {
  id: number;
  at: number;
  platform: ChatPlatform;
  user: string;
  text: string;
  outcome:
    | { kind: "done"; action: ObsAction; scene?: string }
    | { kind: "noScene"; query: string }
    | { kind: "failed"; offline: boolean; message: string };
};

type UseChatOptions = {
  mainScene: string;
  brbScene: string;
  twitchChannel?: string | null;
  kickChannelId?: string | null;
  obsWebsocketUrl?: string | null;
  obsWebsocketPassword?: string;
  /** commandUserKey values, from resolveCommandUsers. */
  commandUsers?: ReadonlySet<string>;
  customCommands?: ObsBridgeCustomCommands;
  onScenes?: (scenes: string[]) => void;
  onStatus?: (state: ObsState) => void;
  onChatStatus?: (platform: ChatPlatform, status: ChatConnectionStatus) => void;
  onActivity?: (activity: ObsActivity) => void;
};

const NO_USERS: ReadonlySet<string> = new Set();

// JavaScript lowercases "İ" to "i̇", so "!scene istanbul" missed "İstanbul". Turkish dotted and
// dotless i count as one letter, as in Raffle keywords and Chat Poll votes.
const caseless = (text: string) => text.replace(/[İIı]/g, "i").toLowerCase();

/** Reports a chat client's status and returns its cleanup. */
function watchChat(
  platform: ChatPlatform,
  client: BaseChatClient,
  onChatStatus: RefObject<UseChatOptions["onChatStatus"]>,
) {
  onChatStatus.current?.(platform, { state: "connecting" });
  client.onStatus = (status) => onChatStatus.current?.(platform, status);
  return () => client.disconnect();
}

/** Runs the bridge. Returns a function that skips the wait before the next OBS attempt. */
export const useChat = ({
  mainScene,
  brbScene,
  twitchChannel,
  kickChannelId,
  obsWebsocketUrl,
  obsWebsocketPassword,
  commandUsers = NO_USERS,
  customCommands,
  onScenes,
  onStatus,
  onChatStatus,
  onActivity,
}: UseChatOptions) => {
  const onScenesRef = useRef(onScenes);
  onScenesRef.current = onScenes;
  const onStatusRef = useRef(onStatus);
  onStatusRef.current = onStatus;
  const onChatStatusRef = useRef(onChatStatus);
  onChatStatusRef.current = onChatStatus;
  const onActivityRef = useRef(onActivity);
  onActivityRef.current = onActivity;
  const mainSceneRef = useRef(mainScene);
  mainSceneRef.current = mainScene;
  const brbSceneRef = useRef(brbScene);
  brbSceneRef.current = brbScene;
  const cmdUsersRef = useRef(commandUsers);
  cmdUsersRef.current = commandUsers;
  const scenesRef = useRef<string[]>([]);
  const customCommandsRef = useRef({
    ...DEFAULT_OBS_COMMANDS,
    ...customCommands,
  });
  customCommandsRef.current = {
    ...DEFAULT_OBS_COMMANDS,
    ...customCommands,
  };
  const retryNowRef = useRef(() => {});
  const obsRef = useRef<OBSWebSocket | null>(null);
  const obsStatusRef = useRef<ObsStatus>("connecting");
  const activityIdRef = useRef(0);

  // OBS, Twitch and Kick each get their own effect, so one reconnecting (or a Kick lookup that
  // answers late) never drops the others.
  useEffect(() => {
    const obs = new OBSWebSocket();
    obsRef.current = obs;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;
    let state: ObsState = {
      status: "connecting",
      attempt: 0,
      retryAt: null,
      code: null,
      reason: "",
      since: null,
    };
    const setState = (patch: Partial<ObsState>) => {
      state = { ...state, ...patch };
      obsStatusRef.current = state.status;
      onStatusRef.current?.(state);
    };
    setState({});

    const fetchScenes = async () => {
      try {
        const data = await obs.call('GetSceneList');
        const items = data.scenes as Array<{ sceneName: string }>;
        // obs-websocket lists them bottom to top; OBS's Scenes dock shows them top to bottom.
        const scenes = items.map(s => s.sceneName).reverse();
        scenesRef.current = scenes;
        onScenesRef.current?.(scenes);
      } catch {
        // scene list unavailable
      }
    };

    // A failed connect both rejects and fires ConnectionClosed. Each used to start its own retry,
    // doubling the attempts every round; now they share one pending retry.
    const scheduleReconnect = () => {
      if (disposed || reconnectTimer) return;
      setState({ retryAt: Date.now() + OBS_RETRY_MS });
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectOBS();
      }, OBS_RETRY_MS);
    };

    const connectOBS = async () => {
      // A retry keeps showing the last failure (with no countdown) instead of flashing
      // "connecting" for the few milliseconds a refused local connection takes.
      setState({ attempt: state.attempt + 1, retryAt: null });
      try {
        // An empty URL must still send the password; undefined (not null) picks the library's default URL.
        await obs.connect(obsSocketUrl(obsWebsocketUrl), obsWebsocketPassword);
        setState({ status: "connected", attempt: 0, code: null, reason: "", since: Date.now() });
      } catch (error) {
        if (disposed) return;
        const { code, message } = error as { code?: number; message?: string };
        setState({ status: "failed", code: code ?? null, reason: message ?? "" });
        scheduleReconnect();
      }
    };

    retryNowRef.current = () => {
      if (!reconnectTimer) return;
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
      connectOBS();
    };

    // Only a drop of a live connection lands here; a failed attempt is handled by its catch.
    obs.on('ConnectionClosed', (error) => {
      if (disposed || state.status !== "connected") return;
      setState({
        status: "disconnected",
        code: error?.code ?? null,
        reason: error?.message ?? "",
        since: null,
      });
      scheduleReconnect();
    });

    obs.on('Identified', async () => {
      await fetchScenes();
    });

    obs.on('SceneListChanged', async () => {
      await fetchScenes();
    });

    connectOBS();

    return () => {
      // Set before disconnect(), whose ConnectionClosed would otherwise schedule a retry.
      disposed = true;
      retryNowRef.current = () => {};
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (obsRef.current === obs) obsRef.current = null;
      obs.disconnect().catch(console.error);
    };
  }, [obsWebsocketUrl, obsWebsocketPassword]);

  // Reads everything through refs, so settings changes never restart the chat connections.
  const pushToMessages = useCallback((payload: ChatMessagesType) => {
    const obs = obsRef.current;
    if (!obs) return;
    // A reply on either platform answers someone, e.g. teaches them "brb", so it runs nothing.
    if (payload.replyTo) return;
    // By login only: a Twitch display-name can be a localized name that says nothing about who it is.
    const login = payload.userLower ?? payload.user;
    if (!cmdUsersRef.current.has(commandUserKey(payload.platform, login))) return;

    const rawMsg = payload.message.trim();
    const msg = caseless(rawMsg);
    const cmds = customCommandsRef.current;

    // Numbered on arrival: OBS answers asynchronously, so outcomes can come back out of order.
    const id = ++activityIdRef.current;
    const at = Date.now();
    const report = (outcome: ObsActivity["outcome"]) =>
      onActivityRef.current?.({
        id,
        at,
        platform: payload.platform,
        user: payload.user,
        text: rawMsg,
        outcome,
      });
    const settle = (request: Promise<unknown>, action: ObsAction, scene?: string) => {
      // obs-websocket-js drops its pending requests when the socket closes, so a request still
      // waiting on OBS would never settle and the command would vanish from the activity list.
      let onClosed = () => {};
      const closed = new Promise<never>((_, reject) => {
        onClosed = () => reject(new Error("OBS connection closed"));
        obs.once("ConnectionClosed", onClosed);
      });
      Promise.race([request, closed])
        .then(
          () => report({ kind: "done", action, scene }),
          (error: unknown) => {
            console.error(error);
            report({
              kind: "failed",
              offline: obsStatusRef.current !== "connected",
              message: (error as { message?: string })?.message ?? String(error),
            });
          },
        )
        .finally(() => obs.off("ConnectionClosed", onClosed));
    };

    const startRec = caseless((cmds.cmdStartRecord || DEFAULT_OBS_COMMANDS.cmdStartRecord).trim());
    const stopRec = caseless((cmds.cmdStopRecord || DEFAULT_OBS_COMMANDS.cmdStopRecord).trim());
    const startStr = caseless((cmds.cmdStartStream || DEFAULT_OBS_COMMANDS.cmdStartStream).trim());
    const stopStr = caseless((cmds.cmdStopStream || DEFAULT_OBS_COMMANDS.cmdStopStream).trim());
    const brb = caseless((cmds.cmdBrb || DEFAULT_OBS_COMMANDS.cmdBrb).trim());
    const back = caseless((cmds.cmdBack || DEFAULT_OBS_COMMANDS.cmdBack).trim());
    const scenePrefix = caseless((cmds.cmdScene || DEFAULT_OBS_COMMANDS.cmdScene).trim());

    if (startRec && msg === startRec) {
      settle(obs.call('StartRecord'), "startRecord");
    } else if (stopRec && msg === stopRec) {
      settle(obs.call('StopRecord'), "stopRecord");
    } else if (startStr && msg === startStr) {
      settle(obs.call('StartStream'), "startStream");
    } else if (stopStr && msg === stopStr) {
      settle(obs.call('StopStream'), "stopStream");
    } else if (brb && msg === brb) {
      const sceneName = brbSceneRef.current;
      settle(obs.call('SetCurrentProgramScene', { sceneName }), "brb", sceneName);
    } else if (back && msg === back) {
      const sceneName = mainSceneRef.current;
      settle(obs.call('SetCurrentProgramScene', { sceneName }), "back", sceneName);
    } else if (scenePrefix && (msg === scenePrefix || msg.startsWith(scenePrefix + " "))) {
      const query = rawMsg.slice(scenePrefix.length).trim();
      if (!query) return;
      if (scenesRef.current.length === 0) {
        // Scenes arrive once OBS is connected; before that there's nothing to match against.
        report({ kind: "failed", offline: true, message: "" });
        return;
      }
      const lowerQuery = caseless(query);
      // 1. Try exact match (case-insensitive)
      let match = scenesRef.current.find(
        (s) => caseless(s.trim()) === lowerQuery
      );
      // 2. Try substring match (case-insensitive)
      if (!match) {
        match = scenesRef.current.find(
          (s) => caseless(s.trim()).includes(lowerQuery)
        );
      }
      if (match) {
        settle(obs.call('SetCurrentProgramScene', { sceneName: match }), "scene", match);
      } else {
        report({ kind: "noScene", query });
      }
    }
  }, []);

  useEffect(() => {
    const channel = twitchChannel?.trim();
    if (!channel) return;
    return watchChat("twitch", new TwitchChat(channel, pushToMessages), onChatStatusRef);
  }, [twitchChannel, pushToMessages]);

  useEffect(() => {
    const chatroomId = kickChannelId?.trim();
    if (!chatroomId) return;
    return watchChat("kick", new KickChat(chatroomId, pushToMessages), onChatStatusRef);
  }, [kickChannelId, pushToMessages]);

  return useCallback(() => retryNowRef.current(), []);
};
