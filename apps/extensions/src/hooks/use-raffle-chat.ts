import { useEffect, useRef } from "react";
import type { RaffleConfig, RaffleParticipant } from "#/types/raffle";
import type { BaseChatClient } from "#/lib/basechat";
import { KickPusherReader, kickChatroomChannel, TwitchIrcReader } from "#/lib/chat-readers";
import { retryDelay } from "#/lib/fetch-json";
import { getKickChannelInfo } from "#/lib/kick";
import { type IrcLine, parseIrcLine } from "#/lib/twitch";

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

type Privmsg = { tags: Record<string, string>; username: string; message: string };

function privmsgOf(line: IrcLine | null): Privmsg | null {
  const messageText = line?.params[1];
  if (line?.command !== "PRIVMSG" || messageText === undefined) return null;
  return {
    tags: line.tags,
    username: line.source.split("!")[0].toLowerCase(),
    message: messageText.trim(),
  };
}

export function parsePrivmsg(rawMessage: string): Privmsg | null {
  return privmsgOf(parseIrcLine(rawMessage));
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

type KickChatMessage = {
  sender: { username: string; identity?: { badges?: { type: string; count?: number }[] } };
  content: string;
};

function kickChatMessage(name: string, data: unknown): KickChatMessage | null {
  if (name !== "App\\Events\\ChatMessageEvent") return null;
  const payload = data as Partial<KickChatMessage> | null;
  return typeof payload?.sender?.username === "string" && typeof payload.content === "string"
    ? (payload as KickChatMessage)
    : null;
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
    let lookupTimer: number | undefined;
    const clients: BaseChatClient[] = [];

    if (config.platform === "twitch") {
      const channel = config.channel.trim().toLowerCase();
      const client = new TwitchIrcReader(channel, privmsgOf, (parsed) => {
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
      }, "[RaffleChat] Twitch");
      clients.push(client);
    }

    if (config.platform === "kick") {
      const rawChannel = config.channel.trim();

      const connectKick = async (attempt: number) => {
        let channelId = rawChannel;

        // If not purely numeric chatroom ID, resolve channel name to chatroomId
        if (!/^\d+$/.test(channelId)) {
          const info = await getKickChannelInfo(rawChannel);
          if (cancelled) return;
          if (!info.chatroomId) {
            if (info.notFound) {
              console.warn(`[RaffleChat] Could not find Kick chatroom for ${rawChannel}`);
              return;
            }
            // kick.com answers 403/5xx at times: the raffle keeps trying instead of never
            // taking an entry.
            lookupTimer = window.setTimeout(() => connectKick(attempt + 1), retryDelay(attempt));
            return;
          }
          channelId = info.chatroomId;
        }

        const client = new KickPusherReader(
          [kickChatroomChannel(channelId)],
          kickChatMessage,
          (payload) => {
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
          "[RaffleChat] Kick",
        );
        clients.push(client);
      };

      connectKick(0);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(lookupTimer);
      for (const client of clients) {
        client.disconnect();
      }
    };
  }, [enabled, config.channel, config.platform]);
}
