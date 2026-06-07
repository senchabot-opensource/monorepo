import { useEffect, useRef } from "react";

import type { RaffleConfig, RaffleParticipant } from "#/types/raffle";

type OnParticipant = (participant: RaffleParticipant) => void;

export function parseTags(tagsStr?: string): Record<string, string> {
  if (!tagsStr) return {};
  const tags: Record<string, string> = {};
  for (const tag of tagsStr.split(";")) {
    const [key, value = ""] = tag.split("=");
    if (!key) continue;
    tags[key] = value
      .replace(/\\s/g, " ")
      .replace(/\\:/g, ";")
      .replace(/\\\\/g, "\\")
      .replace(/\\r/g, "\r")
      .replace(/\\n/g, "\n");
  }
  return tags;
}

export function extractSubMonths(tags: Record<string, string>): number {
  const badgeInfo = tags["badge-info"];
  if (badgeInfo) {
    const match = badgeInfo.match(/subscriber\/(\d+)/);
    if (match) return parseInt(match[1], 10);
  }
  const badges = tags.badges || "";
  if (badges.includes("subscriber") || badges.includes("founder")) {
    return 0;
  }
  return -1;
}

export function isSubscriber(tags: Record<string, string>): boolean {
  const badges = tags.badges || "";
  return (
    badges.includes("subscriber") ||
    badges.includes("founder") ||
    badges.includes("broadcaster")
  );
}

export function parsePrivmsg(rawMessage: string): {
  tags: Record<string, string>;
  username: string;
  message: string;
} | null {
  const match = rawMessage.match(
    /(?:@([^\s]+) )?:([^\s!]+)![^\s]+ PRIVMSG #[^\s]+ :(.+)/,
  );
  if (!match) return null;
  const [, tagsStr, username, messageText] = match;
  return {
    tags: parseTags(tagsStr),
    username,
    message: messageText.trim(),
  };
}

// Decides whether a chatter's entry should be accepted based on the raffle's
// subscription rules. `minSubMonths` only filters subscribers; non-subscribers
// (subMonths < 0) are governed solely by `subscribersOnly`.
export function shouldAcceptEntry(
  isSub: boolean,
  subMonths: number,
  config: Pick<RaffleConfig, "subscribersOnly" | "minSubMonths">,
): boolean {
  if (config.subscribersOnly && !isSub) return false;
  if (
    config.minSubMonths > 0 &&
    subMonths >= 0 &&
    subMonths < config.minSubMonths
  ) {
    return false;
  }
  return true;
}

function makeUserId(platform: "twitch" | "kick", username: string): string {
  return `${platform}-${username.toLowerCase()}`;
}

interface ReconnectingWS {
  send: (data: string) => void;
  close: () => void;
}

function createReconnectingWS(
  url: string,
  onOpen: (ws: WebSocket) => void,
  onMessage: (event: MessageEvent) => void,
  onError: (err: Event) => void,
  onStatus: (msg: string) => void,
): ReconnectingWS {
  let ws: WebSocket | null = null;
  let attempt = 0;
  let stopped = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  const maxAttempts = 10;
  const baseDelay = 1000;
  const maxDelay = 30000;

  const scheduleReconnect = () => {
    if (stopped) return;
    if (attempt >= maxAttempts) {
      onStatus("[RaffleChat] Reconnect attempts exhausted, giving up.");
      return;
    }
    const delay = Math.min(baseDelay * 2 ** attempt, maxDelay);
    attempt += 1;
    onStatus(`[RaffleChat] Reconnecting in ${delay}ms (attempt ${attempt}/${maxAttempts})...`);
    reconnectTimer = setTimeout(connect, delay);
  };

  const connect = () => {
    if (stopped) return;
    const socket = new WebSocket(url);
    ws = socket;
    socket.onopen = () => {
      attempt = 0;
      onOpen(socket);
    };
    socket.onmessage = onMessage;
    socket.onerror = onError;
    socket.onclose = () => {
      if (stopped) return;
      onStatus("[RaffleChat] Connection closed, will reconnect.");
      scheduleReconnect();
    };
  };

  connect();

  return {
    send: (data: string) => {
      if (ws && ws.readyState === WebSocket.OPEN) ws.send(data);
    },
    close: () => {
      stopped = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        ws.close();
        ws = null;
      }
    },
  };
}

export function useRaffleChat(
  config: RaffleConfig,
  onParticipant: OnParticipant,
  enabled: boolean,
) {
  const enabledRef = useRef(enabled);
  const configRef = useRef(config);
  const onParticipantRef = useRef(onParticipant);

  useEffect(() => {
    enabledRef.current = enabled;
    configRef.current = config;
    onParticipantRef.current = onParticipant;
  }, [enabled, config, onParticipant]);

  useEffect(() => {
    if (!enabled || !config.channel.trim()) return;

    const clients: ReconnectingWS[] = [];

    if (config.platform === "twitch") {
      const channel = config.channel.trim().toLowerCase();
      const client = createReconnectingWS(
        "wss://irc-ws.chat.twitch.tv:443",
        (ws) => {
          ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
          ws.send("PASS SCHMOOPIIE");
          ws.send(`NICK justinfan${Date.now() % 1_000_000}`);
          ws.send(`JOIN #${channel}`);
        },
        (event) => {
          if (typeof event.data !== "string") return;
          for (const message of event.data.split("\r\n")) {
            if (!message) continue;
            if (message.startsWith("PING")) {
              client.send("PONG");
              continue;
            }

          const parsed = parsePrivmsg(message);
          if (!parsed) continue;

          const currentConfig = configRef.current;
          const currentEnabled = enabledRef.current;
          if (!currentEnabled) continue;

          const msgLower = parsed.message.toLowerCase();
          const keywordLower = currentConfig.keyword.toLowerCase();
          if (msgLower !== keywordLower) continue;

          const subMonths = extractSubMonths(parsed.tags);
          const isSub = isSubscriber(parsed.tags);

          if (!shouldAcceptEntry(isSub, subMonths, currentConfig)) continue;

          const displayName = parsed.tags["display-name"] || parsed.username;
          const id = makeUserId("twitch", parsed.username);

          onParticipantRef.current({
            id,
            username: parsed.username,
            displayName,
            platform: "twitch",
            subMonths,
            timestamp: Date.now(),
          });
          }
        },
        (err) => {
          console.error("[RaffleChat] Twitch WebSocket error:", err);
        },
        (msg) => {
          console.log(msg);
        },
      );
      clients.push(client);
    }

    if (config.platform === "kick") {
      const channelId = config.channel.trim();
      const client = createReconnectingWS(
        "wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false",
        (ws) => {
          ws.send(
            JSON.stringify({
              event: "pusher:subscribe",
              data: { channel: `chatrooms.${channelId}.v2` },
            }),
          );
        },
        (event) => {
          if (typeof event.data !== "string") return;

          let responseData: unknown;
          try {
            responseData = JSON.parse(event.data);
          } catch {
            return;
          }

          const response = responseData as { event?: unknown; data?: unknown };
          if (
            response.event !== "App\\Events\\ChatMessageEvent" ||
            typeof response.data !== "string"
          ) {
            return;
          }

          let payloadData: unknown;
          try {
            payloadData = JSON.parse(response.data);
          } catch {
            return;
          }

          const payload = payloadData as {
            id?: unknown;
            sender: {
              username: string;
              identity?: {
                color?: string;
                badges?: { type: string; count?: number }[];
              };
            };
            content: string;
            created_at: string;
          };

          const currentConfig = configRef.current;
          const currentEnabled = enabledRef.current;
          if (!currentEnabled) return;

          const msgLower = payload.content.toLowerCase().trim();
          const keywordLower = currentConfig.keyword.toLowerCase();
          if (msgLower !== keywordLower) return;

          const badges = payload.sender.identity?.badges || [];
          const subBadge = badges.find((b) =>
            b.type.toLowerCase().startsWith("sub"),
          );
          const isSub =
            Boolean(subBadge) ||
            badges.some((b) => b.type === "broadcaster");
          const subMonths = subBadge?.count ?? -1;

          if (!shouldAcceptEntry(isSub, subMonths, currentConfig)) return;

          const user = payload.sender.username;
          const id = makeUserId("kick", user);

          onParticipantRef.current({
            id,
            username: user,
            displayName: user,
            platform: "kick",
            subMonths,
            timestamp: Date.now(),
          });
        },
        (err) => {
          console.error("[RaffleChat] Kick WebSocket error:", err);
        },
        (msg) => {
          console.log(msg);
        },
      );
      clients.push(client);
    }

    return () => {
      for (const client of clients) {
        client.close();
      }
    };
  }, [enabled, config.channel, config.platform]);
}
