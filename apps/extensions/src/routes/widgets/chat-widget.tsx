import { chatMessagesCollection } from "#/features/widgets/chat-widget/chat-messages";
import { KickBadge } from "#/features/widgets/chat-widget/kick-badges";
import { useTwitchBadges } from "#/features/widgets/chat-widget/use-badges";
import { use7tvEmotes } from "#/features/widgets/chat-widget/use-7tv-emotes";
import { useUnifiedChat } from "#/features/widgets/chat-widget/use-unified-chat";
import { getKickChannelInfo } from "#/lib/kick";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { z } from "zod";

const TTL_MS = 30_000;

type TwitchEmoteRange = { id: string; start: number; end: number };

const parseTwitchEmoteRanges = (emotesTag?: string): TwitchEmoteRange[] => {
  if (!emotesTag) return [];
  const ranges: TwitchEmoteRange[] = [];
  for (const part of emotesTag.split("/")) {
    const [id, positionsStr] = part.split(":");
    if (!id || !positionsStr) continue;
    for (const pos of positionsStr.split(",")) {
      const [startStr, endStr] = pos.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!Number.isNaN(start) && !Number.isNaN(end)) {
        ranges.push({ id, start, end });
      }
    }
  }
  return ranges.sort((a, b) => a.start - b.start);
};

const renderTwitchEmotes = (text: string, emotesTag?: string) => {
  const ranges = parseTwitchEmoteRanges(emotesTag);
  if (ranges.length === 0) return text;

  const chars = [...text];
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const range of ranges) {
    if (range.start > lastIndex) {
      elements.push(chars.slice(lastIndex, range.start).join(""));
    }
    elements.push(
      <img
        key={`${range.id}-${range.start}`}
        src={`https://static-cdn.jtvnw.net/emoticons/v2/${range.id}/default/dark/1.0`}
        alt="emote"
        className="inline-block h-8 w-auto mx-0.5 align-middle object-contain"
      />,
    );
    lastIndex = range.end + 1;
  }

  if (lastIndex < chars.length) {
    elements.push(chars.slice(lastIndex).join(""));
  }

  return elements;
};

export const parseEmotes = (text: string, platform: "twitch" | "kick", emotes?: string) => {
  if (platform === "kick") {
    const kickEmoteRegex = /\[emote:(\d+):([\w\d\-_]+)\]/g;

    return text.split(kickEmoteRegex).map((part, index) => {
      if (index % 3 === 1) {
        const id = part;
        return (
          <img
            key={`${id}-${index.toString()}`}
            src={`https://files.kick.com/emotes/${id}/fullsize`}
            alt="emote"
            className="inline-block h-8 w-8 mx-1 align-middle object-contain"
          />
        );
      }
      if (index % 3 === 2) return null;
      return part;
    });
  }

  if (platform === "twitch") {
    return renderTwitchEmotes(text, emotes);
  }

  return text;
};

const render7tvEmotes = (
  nodes: React.ReactNode,
  emoteMap: Map<string, string>,
): React.ReactNode[] => {
  if (emoteMap.size === 0) {
    return Array.isArray(nodes) ? nodes : [nodes];
  }

  const names = Array.from(emoteMap.keys());
  names.sort((a, b) => b.length - a.length);

  const pattern = names
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  if (!pattern) return Array.isArray(nodes) ? nodes : [nodes];

  const regex = new RegExp(`\\b(${pattern})\\b`, "g");

  const result: React.ReactNode[] = [];
  const input = Array.isArray(nodes) ? nodes : [nodes];
  let keyIndex = 0;

  for (const node of input) {
    if (typeof node !== "string") {
      result.push(node);
      continue;
    }

    const parts = node.split(regex);

    for (const part of parts) {
      if (part === "") continue;
      const emoteId = emoteMap.get(part);
      if (emoteId) {
        result.push(
          <img
            key={`7tv-${emoteId}-${keyIndex++}`}
            src={`https://cdn.7tv.app/emote/${emoteId}/2x.webp`}
            alt={part}
            className="inline-block h-8 w-auto mx-0.5 align-middle object-contain"
          />,
        );
      } else {
        result.push(part);
      }
    }
  }

  return result;
};

const searchSchema = z.object({
  twitch: z.string().optional(),
  kick: z.string().optional(),
  fontSize: z.coerce.number().optional().default(18),
  background: z.boolean().optional(),
  bgOpacity: z.coerce.number().min(0).max(1).optional().default(0.5),
  orientation: z
    .enum(["vertical", "horizontal"])
    .optional()
    .default("vertical"),
  platformDisplay: z
    .enum(["name", "icon"])
    .optional()
    .default("name"),
  timestamp: z.boolean().optional(),
  keep: z.boolean().optional(),
});

export const getBadgeEmoji = (badgeId: string) => {
  const norm = badgeId.toLowerCase().split("/")[0];
  if (norm === "broadcaster") return "🎥";
  if (norm === "moderator") return "🛡️";
  if (norm === "subscriber") return "⭐";
  if (norm === "vip") return "💎";
  if (norm === "premium") return "👑";
  if (norm === "founder") return "🥇";
  if (norm === "staff" || norm === "admin") return "🛠️";
  return null;
};

export const Route = createFileRoute("/widgets/chat-widget")({
  ssr: false,
  validateSearch: search => searchSchema.parse(search),
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

function TwitchIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block h-4 w-4 ${className ?? ""}`}
      viewBox="0 0 24 24"
      {...props}>
      <path
        fill="currentColor"
        d="M4.265 3L3 6.236v13.223h4.502V21l2.531.85l2.392-2.391h3.658l4.923-4.924V3zm15.052 10.691l-2.813 2.814h-4.502l-2.391 2.391v-2.391H5.813V4.688h13.504zm-2.812-5.767v4.923h-1.688V7.924zm-4.502 0v4.923h-1.688V7.924z"
      />
    </svg>
  );
}

function KickIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`inline-block h-4 w-4 ${className ?? ""}`}
      {...props}>
      <title>Kick</title>
      <path d="M1.333 0h8v5.333H12V2.667h2.667V0h8v8H20v2.667h-2.667v2.666H20V16h2.667v8h-8v-2.667H12v-2.666H9.333V24h-8Z" />
    </svg>
  );
}

function PlatformIcon({ platform }: { platform: "twitch" | "kick" }) {
  if (platform === "twitch") {
    return <TwitchIcon />;
  }

  return <KickIcon />;
}

function RouteComponent() {
  const search = Route.useSearch();
  const { kick, kickSubBadges } = Route.useLoaderData();
  const twitchBadgeMap = useTwitchBadges(search.twitch);

  const showPlatformIndicator = Boolean(search.twitch && search.kick);

  const sevenTvEmoteMap = use7tvEmotes(search.twitch);

  useUnifiedChat(search.twitch, kick);

  const [now, setNow] = React.useState(() => Date.now());
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { data: messages } = useLiveQuery(q =>
    q
      .from({ collection: chatMessagesCollection })
      .orderBy(({ collection }) => collection.timestamp),
  );

  const visibleMessages = search.keep
    ? messages
    : messages.filter(msg => {
        const receivedAtMs = msg.receivedAt?.getTime() ?? msg.timestamp.getTime();
        return now - receivedAtMs < TTL_MS;
      });

  const hasVisibleMessages = visibleMessages.length > 0;

  React.useEffect(() => {
    if (search.keep || !hasVisibleMessages) {
      return;
    }

    setNow(Date.now());
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasVisibleMessages, search.keep]);

  React.useEffect(() => {
    if (!containerRef.current) return;

    if (search.orientation === "horizontal") {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    } else {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleMessages, search.orientation]);

  return (
    <div
      ref={containerRef}
      className={`flex ${search.orientation === "horizontal" ? "flex-row justify-end items-center overflow-hidden min-w-full h-screen p-2 space-x-4" : "flex-col justify-end h-screen w-full overflow-y-auto overflow-x-hidden p-2.5 space-y-2"} text-white font-sans rounded-md`}
      style={{
        fontSize: `${search.fontSize}px`,
        backgroundColor: search.background
          ? `rgba(0, 0, 0, ${search.bgOpacity})`
          : "transparent",
      }}>
      {visibleMessages.map(msg => (
        <div
          key={msg.id}
          className={`leading-tight whitespace-pre-wrap wrap-break-word text-left animate-in fade-in ${search.orientation === "horizontal" ? "slide-in-from-right-2 flex-shrink-0" : "slide-in-from-left-2"} duration-200`}>
          {search.timestamp && (
            <span className="mr-1.5 text-zinc-400 text-xs align-middle">
              {msg.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          {showPlatformIndicator && (
            <span
              className="mr-2 inline-flex items-center align-middle data-[platform=twitch]:text-purple-500 data-[platform=kick]:text-green-500"
              data-platform={msg.platform}>
              {search.platformDisplay === "icon" ? (
                <PlatformIcon platform={msg.platform} />
              ) : (
                `[${msg.platform}]`
              )}
            </span>
          )}
          {msg.badges && msg.badges.length > 0 && (
            <span className="mr-1 inline-flex items-center space-x-0.5 align-middle">
              {msg.badges.map((badge, idx) => {
                const isTwitch = msg.platform === "twitch";

                if (!isTwitch) {
                  return (
                    <span
                      key={`${msg.id}-badge-${idx}`}
                      title={badge}
                      className="inline-flex items-center justify-center bg-black/40 p-[2px] rounded-md border border-white/10 mx-0.5 shadow-sm">
                      <KickBadge type={badge} subBadges={kickSubBadges} />
                    </span>
                  );
                }

                const imageUrl = twitchBadgeMap?.get(badge);
                const emoji = getBadgeEmoji(badge);

                if (imageUrl) {
                  return (
                    <img
                      key={`${msg.id}-badge-${idx}`}
                      src={imageUrl}
                      alt={badge}
                      title={badge}
                      className="inline-block h-4 w-4"
                    />
                  );
                }

                if (!emoji) return null;
                return (
                  <span
                    key={`${msg.id}-badge-${idx}`}
                    title={badge}
                    className="text-sm border border-gray-400/50 rounded-sm leading-none bg-black/20">
                    {emoji}
                  </span>
                );
              })}
            </span>
          )}
          <span style={{ color: msg.color || "unset" }}>{msg.user}:</span>{" "}
          <span>
            {render7tvEmotes(
              parseEmotes(msg.message, msg.platform, msg.emotes),
              sevenTvEmoteMap,
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
