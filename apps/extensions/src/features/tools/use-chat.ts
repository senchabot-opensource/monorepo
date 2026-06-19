import { useEffect, useRef } from "react";
import { TwitchChat } from "#/lib/twitch";
import { KickChat } from "#/lib/kick";
import type { ChatMessagesType } from "../widgets/chat-widget/chat-messages";
import { OBSWebSocket } from 'obs-websocket-js';

type Disconnectable = {
  disconnect: () => void;
};

function parseUsers(raw: string | null | undefined): Set<string> {
  return new Set(
    raw ? raw
      .split(",")
      .map(u => u.trim().toLowerCase())
      .filter(Boolean): [],
  );
}

export const useChat = (
  mainScene: string,
  brbScene: string,
  twitchChannel?: string | null,
  kickChannelId?: string | null,
  obsWebsocketUrl?: string | null,
  obsWebsocketPassword?: string | undefined,
  commandUser?: string | null,
  onScenes?: (scenes: string[]) => void,
  onConnected?: (connected: boolean) => void,
) => {
  const onScenesRef = useRef(onScenes);
  onScenesRef.current = onScenes;
  const onConnectedRef = useRef(onConnected);
  onConnectedRef.current = onConnected;
  const mainSceneRef = useRef(mainScene);
  mainSceneRef.current = mainScene;
  const brbSceneRef = useRef(brbScene);
  brbSceneRef.current = brbScene;
  const cmdUsersRef = useRef(parseUsers(commandUser));
  cmdUsersRef.current = parseUsers(commandUser);

  useEffect(() => {
    const obs = new OBSWebSocket();
    const statusElId = "obs-status";
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const updateUI = (text: string, color: string) => {
      const el = document.getElementById(statusElId);
      if (el) {
        el.innerText = text;
        el.style.color = color;
      }
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
        updateUI("Connection Failed, Retrying...", "red");
        onConnectedRef.current?.(false);
        reconnectTimer = setTimeout(connectOBS, 5000);
      }
    };

    obs.on('ConnectionClosed', () => {
      updateUI("Disconnected, Reconnecting...", "red");
      onConnectedRef.current?.(false);
      reconnectTimer = setTimeout(connectOBS, 5000);
    });

    obs.on('Identified', async () => {
      try {
        const data = await obs.call('GetSceneList');
        const items = data.scenes as Array<{ sceneName: string }>;
        const scenes = items.map(s => s.sceneName);
        onScenesRef.current?.(scenes);
      } catch {
        // scene list unavailable
      }
    });

    connectOBS();

    const pushToMessages = (payload: ChatMessagesType) => {
      if (!cmdUsersRef.current.has(payload.user.toLowerCase())) return;

      switch (payload.message) {
        case '!startrecord':
          obs.call('StartRecord').catch(console.error);
          break;
        case '!stoprecord':
          obs.call('StopRecord').catch(console.error);
          break;
        case '!startstream':
          obs.call('StartStream').catch(console.error);
          break;
        case '!stopstream':
          obs.call('StopStream').catch(console.error);
          break;
        case 'brb':
          obs.call('SetCurrentProgramScene', { sceneName: brbSceneRef.current }).catch(console.error);
          break;
        case 'back':
          obs.call('SetCurrentProgramScene', { sceneName: mainSceneRef.current }).catch(console.error);
          break;
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
      if (reconnectTimer) clearTimeout(reconnectTimer);
      for (const client of clients) {
        client.disconnect();
      }
      obs.disconnect().catch(console.error);
    };
  }, [twitchChannel, kickChannelId, obsWebsocketUrl, obsWebsocketPassword]);
};
