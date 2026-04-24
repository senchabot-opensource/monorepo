import { useEffect, useRef } from "react";

import type { RaffleConfig, RaffleParticipant } from "#/types/raffle";

type OnParticipant = (participant: RaffleParticipant) => void;

function parseTags(tagsStr?: string): Record<string, string> {
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

function extractSubMonths(tags: Record<string, string>): number {
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

function isSubscriber(tags: Record<string, string>): boolean {
  const badges = tags.badges || "";
  return (
    badges.includes("subscriber") ||
    badges.includes("founder") ||
    badges.includes("broadcaster")
  );
}

function parsePrivmsg(rawMessage: string): {
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

export function useRaffleChat(
  config: RaffleConfig,
  onParticipant: OnParticipant,
  enabled: boolean,
) {
  const wsRef = useRef<WebSocket | null>(null);
  const enabledRef = useRef(enabled);
  const configRef = useRef(config);
  const onParticipantRef = useRef(onParticipant);

  useEffect(() => {
    enabledRef.current = enabled;
    configRef.current = config;
    onParticipantRef.current = onParticipant;
  });

  useEffect(() => {
    if (!enabled || !config.channel.trim()) return;

    const clients: { disconnect: () => void }[] = [];

    if (config.platform === "twitch") {
      const channel = config.channel.trim().toLowerCase();
      const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
        ws.send("PASS SCHMOOPIIE");
        ws.send(`NICK justinfan${Math.floor(Math.random() * 1000)}`);
        ws.send(`JOIN #${channel}`);
      };

      ws.onmessage = (event) => {
        if (typeof event.data !== "string") return;
        for (const message of event.data.split("\r\n")) {
          if (!message) continue;
          if (message.startsWith("PING")) {
            ws.send("PONG");
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

          if (currentConfig.subscribersOnly && !isSub) continue;
          if (currentConfig.minSubMonths > 0) {
            if (subMonths < 0) continue;
            if (subMonths < currentConfig.minSubMonths) continue;
          }

          const displayName = parsed.tags["display-name"] || parsed.username;
          const id =
            parsed.tags.id ||
            `twitch-${parsed.username}-${Date.now()}-${Math.random()}`;

          onParticipantRef.current({
            id,
            username: parsed.username,
            displayName,
            platform: "twitch",
            subMonths: subMonths < 0 ? 0 : subMonths,
            timestamp: Date.now(),
          });
        }
      };

      ws.onerror = (err) => {
        console.error("[RaffleChat] Twitch WebSocket error:", err);
      };

      ws.onclose = () => {
        console.log("[RaffleChat] Twitch connection closed.");
      };

      clients.push({
        disconnect: () => {
          ws.onopen = null;
          ws.onmessage = null;
          ws.onerror = null;
          ws.onclose = null;
          ws.close();
        },
      });
    }

    if (config.platform === "kick") {
      const channelId = config.channel.trim();
      const ws = new WebSocket(
        "wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false",
      );

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            event: "pusher:subscribe",
            data: { channel: `chatrooms.${channelId}.v2` },
          }),
        );
      };

      ws.onmessage = (event) => {
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
        const isSub = Boolean(subBadge) || badges.some((b) => b.type === "broadcaster");
        const subMonths = subBadge?.count ?? 0;

        if (currentConfig.subscribersOnly && !isSub) return;
        if (currentConfig.minSubMonths > 0 && subMonths < currentConfig.minSubMonths) return;

        const user = payload.sender.username;
        const id =
          payload.id == null
            ? `kick-${user}-${Date.now()}-${Math.random()}`
            : String(payload.id);

        onParticipantRef.current({
          id,
          username: user,
          displayName: user,
          platform: "kick",
          subMonths,
          timestamp: Date.now(),
        });
      };

      ws.onerror = (err) => {
        console.error("[RaffleChat] Kick WebSocket error:", err);
      };

      ws.onclose = () => {
        console.log("[RaffleChat] Kick connection closed.");
      };

      clients.push({
        disconnect: () => {
          ws.onopen = null;
          ws.onmessage = null;
          ws.onerror = null;
          ws.onclose = null;
          ws.close();
        },
      });
    }

    return () => {
      for (const client of clients) {
        client.disconnect();
      }
      wsRef.current = null;
    };
  }, [enabled, config.channel, config.platform]);
}
