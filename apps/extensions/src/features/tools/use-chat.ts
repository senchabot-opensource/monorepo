import { useEffect, useRef } from "react";
import { TwitchChat } from "#/lib/twitch";
import { KickChat } from "#/lib/kick";
import type { ChatMessagesType } from "../widgets/chat-widget/chat-messages";
import { commandUserKey } from "./command-users";
import { OBSWebSocket } from 'obs-websocket-js';

type Disconnectable = {
  disconnect: () => void;
};

export interface ObsBridgeCustomCommands {
  cmdBrb?: string;
  cmdBack?: string;
  cmdStartStream?: string;
  cmdStopStream?: string;
  cmdStartRecord?: string;
  cmdStopRecord?: string;
  cmdScene?: string;
}

export const DEFAULT_OBS_COMMANDS: Required<ObsBridgeCustomCommands> = {
  cmdBrb: "brb",
  cmdBack: "back",
  cmdStartStream: "!startstream",
  cmdStopStream: "!stopstream",
  cmdStartRecord: "!startrecord",
  cmdStopRecord: "!stoprecord",
  cmdScene: "!scene",
};

export const useChat = (
  mainScene: string,
  brbScene: string,
  twitchChannel?: string | null,
  kickChannelId?: string | null,
  obsWebsocketUrl?: string | null,
  obsWebsocketPassword?: string | undefined,
  // commandUserKey values, from resolveCommandUsers.
  commandUsers: ReadonlySet<string> = new Set(),
  onScenes?: (scenes: string[]) => void,
  onConnected?: (connected: boolean) => void,
  customCommands?: ObsBridgeCustomCommands,
) => {
  const onScenesRef = useRef(onScenes);
  onScenesRef.current = onScenes;
  const onConnectedRef = useRef(onConnected);
  onConnectedRef.current = onConnected;
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

  useEffect(() => {
    const obs = new OBSWebSocket();
    const statusElId = "obs-status";
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    const updateUI = (text: string, color: string) => {
      const el = document.getElementById(statusElId);
      if (el) {
        el.innerText = text;
        el.style.color = color;
      }
    };

    const fetchScenes = async () => {
      try {
        const data = await obs.call('GetSceneList');
        const items = data.scenes as Array<{ sceneName: string }>;
        const scenes = items.map(s => s.sceneName);
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
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectOBS();
      }, 5000);
    };

    const connectOBS = async () => {
      try {
        if (!obsWebsocketUrl) {
          await obs.connect();
        } else {
          await obs.connect(obsWebsocketUrl, obsWebsocketPassword);
        }
        updateUI("Connected", "green");
        onConnectedRef.current?.(true);
      } catch {
        if (disposed) return;
        updateUI("Connection Failed, Retrying...", "red");
        onConnectedRef.current?.(false);
        scheduleReconnect();
      }
    };

    obs.on('ConnectionClosed', () => {
      if (disposed) return;
      updateUI("Disconnected, Reconnecting...", "red");
      onConnectedRef.current?.(false);
      scheduleReconnect();
    });

    obs.on('Identified', async () => {
      await fetchScenes();
    });

    obs.on('SceneListChanged', async () => {
      await fetchScenes();
    });

    connectOBS();

    const pushToMessages = (payload: ChatMessagesType) => {
      if (!cmdUsersRef.current.has(commandUserKey(payload.platform, payload.user))) return;

      const rawMsg = payload.message.trim();
      const msg = rawMsg.toLowerCase();
      const cmds = customCommandsRef.current;

      const startRec = (cmds.cmdStartRecord || DEFAULT_OBS_COMMANDS.cmdStartRecord).trim().toLowerCase();
      const stopRec = (cmds.cmdStopRecord || DEFAULT_OBS_COMMANDS.cmdStopRecord).trim().toLowerCase();
      const startStr = (cmds.cmdStartStream || DEFAULT_OBS_COMMANDS.cmdStartStream).trim().toLowerCase();
      const stopStr = (cmds.cmdStopStream || DEFAULT_OBS_COMMANDS.cmdStopStream).trim().toLowerCase();
      const brb = (cmds.cmdBrb || DEFAULT_OBS_COMMANDS.cmdBrb).trim().toLowerCase();
      const back = (cmds.cmdBack || DEFAULT_OBS_COMMANDS.cmdBack).trim().toLowerCase();
      const scenePrefix = (cmds.cmdScene || DEFAULT_OBS_COMMANDS.cmdScene).trim().toLowerCase();

      if (startRec && msg === startRec) {
        obs.call('StartRecord').catch(console.error);
      } else if (stopRec && msg === stopRec) {
        obs.call('StopRecord').catch(console.error);
      } else if (startStr && msg === startStr) {
        obs.call('StartStream').catch(console.error);
      } else if (stopStr && msg === stopStr) {
        obs.call('StopStream').catch(console.error);
      } else if (brb && msg === brb) {
        obs.call('SetCurrentProgramScene', { sceneName: brbSceneRef.current }).catch(console.error);
      } else if (back && msg === back) {
        obs.call('SetCurrentProgramScene', { sceneName: mainSceneRef.current }).catch(console.error);
      } else if (scenePrefix && (msg === scenePrefix || msg.startsWith(scenePrefix + " "))) {
        const query = rawMsg.slice(scenePrefix.length).trim();
        if (query && scenesRef.current.length > 0) {
          const lowerQuery = query.toLowerCase();
          // 1. Try exact match (case-insensitive)
          let match = scenesRef.current.find(
            (s) => s.trim().toLowerCase() === lowerQuery
          );
          // 2. Try substring match (case-insensitive)
          if (!match) {
            match = scenesRef.current.find(
              (s) => s.trim().toLowerCase().includes(lowerQuery)
            );
          }
          if (match) {
            obs.call('SetCurrentProgramScene', { sceneName: match }).catch(console.error);
          }
        }
      }
    };

    const clients: Disconnectable[] = [];
    const normalizedTwitchChannel = twitchChannel?.trim();
    const normalizedKickChannelId = kickChannelId?.trim();

    if (normalizedTwitchChannel) {
      clients.push(new TwitchChat(normalizedTwitchChannel, pushToMessages));
    }

    if (normalizedKickChannelId) {
      clients.push(new KickChat(normalizedKickChannelId, pushToMessages));
    }

    return () => {
      // Set before disconnect(), whose ConnectionClosed would otherwise schedule a retry.
      disposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      for (const client of clients) {
        client.disconnect();
      }
      obs.disconnect().catch(console.error);
    };
  }, [twitchChannel, kickChannelId, obsWebsocketUrl, obsWebsocketPassword]);
};
