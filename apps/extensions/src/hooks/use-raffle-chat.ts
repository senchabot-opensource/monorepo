import { useEffect, useRef } from "react";
import type { RaffleConfig, RaffleParticipant } from "#/types/raffle";
import { BaseChatClient } from "#/lib/basechat";
import { getKickChannelInfo, KICK_PUSHER_URL } from "#/lib/kick";
import { anonymousJoin, parseIrcLine, TWITCH_IRC_URL } from "#/lib/twitch";

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

/** Anonymous Twitch IRC reader that passes each chat line on. */
class TwitchRaffleReader extends BaseChatClient {
  constructor(
    channel: string,
    private readonly onLine: (line: string) => void,
  ) {
    super("[RaffleChat] Twitch", () => {});
    this.connect(TWITCH_IRC_URL, {
      onOpen: () => {
        for (const line of anonymousJoin(channel)) this.send(line);
      },
      onMessage: (event) => this.handle(event),
    });
  }

  // Answered with "PONG tmi.twitch.tv :tmi.twitch.tv", which parsePrivmsg ignores.
  protected override pingFrame() {
    return "PING :tmi.twitch.tv";
  }

  private handle(event: MessageEvent) {
    if (typeof event.data !== "string") return;
    for (const raw of event.data.split("\r\n")) {
      if (!raw) continue;
      const command = parseIrcLine(raw)?.command;
      if (command === "PING") {
        this.send("PONG");
        continue;
      }
      // Sent before maintenance closes the connection; the rest of this frame belongs to it.
      if (command === "RECONNECT") {
        this.restart();
        return;
      }
      this.onLine(raw);
    }
  }
}

/** Kick Pusher reader that passes each chatroom frame on. */
class KickRaffleReader extends BaseChatClient {
  constructor(
    chatroomId: string,
    private readonly onFrame: (data: string) => void,
  ) {
    super("[RaffleChat] Kick", () => {});
    this.connect(KICK_PUSHER_URL, {
      onOpen: () => {
        this.send(
          JSON.stringify({
            event: "pusher:subscribe",
            data: { channel: `chatrooms.${chatroomId}.v2` },
          }),
        );
      },
      onMessage: (event) => {
        if (typeof event.data === "string") this.onFrame(event.data);
      },
    });
  }

  // Answered with pusher:pong. Pusher's own liveness pings are protocol frames the page never sees.
  protected override pingFrame() {
    return JSON.stringify({ event: "pusher:ping", data: {} });
  }
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
    const clients: BaseChatClient[] = [];

    if (config.platform === "twitch") {
      const channel = config.channel.trim().toLowerCase();
      const client = new TwitchRaffleReader(channel, (message) => {
        const parsed = parsePrivmsg(message);
        if (!parsed) return;

        const username = parsed.username.toLowerCase();
        if (KNOWN_BOTS.has(username)) return;

        const currentConfig = configRef.current;
        const currentEnabled = enabledRef.current;
        if (!currentEnabled) return;

        if (!isKeywordMatch(parsed.message, currentConfig.keyword)) return;

        const subMonths = extractSubMonths(parsed.tags);
        const isSub = isSubscriber(parsed.tags);

        if (!shouldAcceptEntry(isSub, subMonths, currentConfig)) return;

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
      });
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

        const client = new KickRaffleReader(channelId, (data) => {
          let responseData: unknown;
          try {
            responseData = JSON.parse(data);
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
        });
        clients.push(client);
      };

      connectKick();
    }

    return () => {
      cancelled = true;
      for (const client of clients) {
        client.disconnect();
      }
    };
  }, [enabled, config.channel, config.platform]);
}
