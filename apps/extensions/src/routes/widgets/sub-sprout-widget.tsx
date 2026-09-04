import { SubSproutWidget } from "#/features/widgets/sub-sprout/sub-sprout-widget";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const parseBoolFlag = (v: unknown): boolean => {
  if (v === undefined || v === null) return true;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  const s = String(v).toLowerCase();
  return !(s === "0" || s === "false" || s === "off" || s === "no");
};

const parseSimulateFlag = (v: unknown): boolean | "auto" => {
  if (v === undefined || v === null) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  const s = String(v).toLowerCase();
  if (s === "auto") return "auto";
  return s === "1" || s === "true" || s === "on" || s === "yes";
};

const searchSchema = z.object({
  channel: z.string().optional(),
  platform: z
    .enum(["twitch", "kick"])
    .catch("twitch")
    .default("twitch"),
  twitch: z.string().optional(),
  kick: z.string().optional(),
  variety: z.string().optional(),
  pick: z
    .enum(["fixed", "cycle", "random"])
    .optional()
    .catch("fixed"),
  water: z
    .enum(["off", "rain", "sparkle"])
    .optional()
    .catch("off"),
  countfx: z
    .unknown()
    .optional()
    .transform(v => (v === undefined ? undefined : parseBoolFlag(v)))
    .catch(true),
  potlabel: z
    .unknown()
    .optional()
    .transform(v => (v === undefined ? undefined : parseBoolFlag(v)))
    .catch(false),
  simulate: z
    .unknown()
    .optional()
    .transform(v => (v === undefined ? undefined : parseSimulateFlag(v)))
    .catch(false),
});

export const Route = createFileRoute("/widgets/sub-sprout-widget")({
  ssr: false,
  validateSearch: search => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    kickChannel:
      search.kick || (search.platform === "kick" ? search.channel : undefined),
    simulate: search.simulate,
  }),
  loader: async ({ deps }) => {
    if (deps.simulate !== true && deps.kickChannel) {
      try {
        const { getKickChannelInfo } = await import("#/lib/kick");
        const kickInfo = await getKickChannelInfo(deps.kickChannel);
        return {
          kickId: kickInfo.chatroomId,
          kickChannelId: kickInfo.channelId,
        };
      } catch {
        return { kickId: null, kickChannelId: null };
      }
    }
    return { kickId: null, kickChannelId: null };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const {
    channel,
    platform,
    twitch,
    kick,
    variety,
    pick,
    water,
    countfx,
    potlabel,
    simulate,
  } = Route.useSearch();
  const { kickId, kickChannelId } = Route.useLoaderData();

  const twitchChannel =
    twitch || (platform === "twitch" ? channel : undefined);
  const kickChannel =
    kick || (platform === "kick" ? channel : undefined);

  if (countfx === false) {
    console.info("[SubSprout] sub count effect disabled (countfx=0)");
  }

  return (
    <div className="size-full min-h-screen bg-transparent">
      <SubSproutWidget
        twitchChannel={twitchChannel}
        kickChannel={kickChannel}
        kickId={kickId ?? undefined}
        kickChannelId={kickChannelId ?? undefined}
        variety={variety}
        pick={pick}
        water={water}
        countFx={countfx}
        potLabel={potlabel}
        simulate={simulate}
      />
    </div>
  );
}
