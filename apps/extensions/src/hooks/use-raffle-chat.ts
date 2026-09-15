import { useEffect, useRef } from "react";
import type { RaffleConfig, RaffleParticipant } from "#/types/raffle";
import { getKickChannelInfo } from "#/lib/kick";
import { parseIrcLine } from "#/lib/twitch";

type OnParticipant = (participant: RaffleParticipant) => void;

const KNOWN_BOTS = new Set([
  "nightbot",
  "streamelements",
  "streamlabs",
  "moobot",
  "fossabot",
  "wizebot",
  "botrix",
  "soundalerts",
  "blerp",
  "kofi_stream_bot",
  "senchabot",
]);

export function extractSubMonths(tags: Record<string, string>): number {
  const badgeInfo = tags["badge-info"] || "";
  const matchInfo = badgeInfo.match(/(?:subscriber|founder)\/(\d+)/);
  if (matchInfo) return parseInt(matchInfo[1], 10);

  const badges = tags.badges || "";
  const matchBadges = badges.match(/(?:subscriber|founder)\/(\d+)/);
  if (matchBadges) return parseInt(matchBadges[1], 10);

  if (badges.includes("subscriber") || badges.includes("founder") || tags.subscriber === "1") {
    return 1;
  }
  return -1;
}

export function isSubscriber(tags: Record<string, string>): boolean {
  if (tags.subscriber === "1") return true;
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
  const line = parseIrcLine(rawMessage);
  const messageText = line?.params[1];
  if (line?.command !== "PRIVMSG" || messageText === undefined) return null;
  return {
    tags: line.tags,
    username: line.source.split("!")[0].toLowerCase(),
    message: messageText.trim(),
  };
}

export function isKeywordMatch(messageText: string, keyword: string): boolean {
  const cleanMsg = messageText.trim().toLowerCase();
  const cleanKeyword = keyword.trim().toLowerCase();
  if (!cleanKeyword) return false;
  return cleanMsg === cleanKeyword || cleanMsg.startsWith(`${cleanKeyword} `);
}

// A gifted-sub badge (sub_gifter) doesn't make the gifter a subscriber: its `count` is subs given.
// Live payloads send a count-less founder badge ahead of the subscriber badge, so months come
// from the subscriber badge first.
export function getKickSubStatus(badges: { type: string; count?: number }[]): {
  isSub: boolean;
  subMonths: number;
} {
  const findBadge = (type: string) => badges.find((b) => b.type.toLowerCase() === type);
  const subBadge = findBadge("subscriber") ?? findBadge("founder");
  const isSub = Boolean(subBadge) || badges.some((b) => b.type === "broadcaster");
  return { isSub, subMonths: subBadge?.count ?? (isSub ? 1 : -1) };
}

export function shouldAcceptEntry(
  isSub: boolean,
  subMonths: number,
  config: Pick<RaffleConfig, "subscribersOnly" | "minSubMonths">,
): boolean {
  if (config.subscribersOnly && !isSub) return false;
  // The 1-month floor means "any subscriber", so a badge without tenure (0) and the broadcaster
  // (-1, can't sub to their own channel) still get in; only a higher minimum checks months.
  if (config.subscribersOnly && config.minSubMonths > 1) {
    const effectiveMonths = subMonths >= 0 ? subMonths : 0;
    if (effectiveMonths < config.minSubMonths) {
      return false;
    }
  }
  return true;
}

function makeUserId(platform: "twitch" | "kick", username: string): string {
  return `${platform}-${username.trim().toLowerCase()}`;
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

    let cancelled = false;
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

            const username = parsed.username.toLowerCase();
            if (KNOWN_BOTS.has(username)) continue;

            const currentConfig = configRef.current;
            const currentEnabled = enabledRef.current;
            if (!currentEnabled) continue;

            if (!isKeywordMatch(parsed.message, currentConfig.keyword)) continue;

            const subMonths = extractSubMonths(parsed.tags);
            const isSub = isSubscriber(parsed.tags);

            if (!shouldAcceptEntry(isSub, subMonths, currentConfig)) continue;

            const displayName = parsed.tags["display-name"] || parsed.username;
            const id = makeUserId("twitch", username);

            onParticipantRef.current({
              id,
              username,
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
      const rawChannel = config.channel.trim();

      const connectKick = async () => {
        let channelId = rawChannel;

        // If not purely numeric chatroom ID, resolve channel name to chatroomId
        if (!/^\d+$/.test(channelId)) {
          const info = await getKickChannelInfo(rawChannel);
          if (cancelled) return;
          if (!info.chatroomId) {
            console.warn(`[RaffleChat] Could not find Kick chatroom for ${rawChannel}`);
            return;
          }
          channelId = info.chatroomId;
        }

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

            const user = payload.sender.username.toLowerCase();
            if (KNOWN_BOTS.has(user)) return;

            const currentConfig = configRef.current;
            const currentEnabled = enabledRef.current;
            if (!currentEnabled) return;

            if (!isKeywordMatch(payload.content, currentConfig.keyword)) return;

            const { isSub, subMonths } = getKickSubStatus(
              payload.sender.identity?.badges || [],
            );

            if (!shouldAcceptEntry(isSub, subMonths, currentConfig)) return;

            const id = makeUserId("kick", user);

            onParticipantRef.current({
              id,
              username: user,
              displayName: payload.sender.username,
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
      };

      connectKick();
    }

    return () => {
      cancelled = true;
      for (const client of clients) {
        client.close();
      }
    };
  }, [enabled, config.channel, config.platform]);
}
