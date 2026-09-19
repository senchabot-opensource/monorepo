import React from "react";
import { useRetryingEffect } from "#/hooks/use-retrying-effect";
import { fetchJson } from "#/lib/fetch-json";

type TwitchBadgeVersion = {
  id: string;
  image_url_1x: string;
  image_url_2x: string;
  image_url_4x: string;
  title: string;
};

type TwitchBadgeSet = {
  set_id: string;
  versions: TwitchBadgeVersion[];
};

const GLOBAL_BADGES_URL = "https://api.ivr.fi/v2/twitch/badges/global";
const channelBadgesUrl = (login: string) =>
  `https://api.ivr.fi/v2/twitch/badges/channel?login=${encodeURIComponent(login)}`;

const toBadgeMap = (sets: TwitchBadgeSet[] | undefined) => {
  const map = new Map<string, string>();
  for (const set of Array.isArray(sets) ? sets : []) {
    for (const version of set.versions ?? []) {
      map.set(`${set.set_id}/${version.id}`, version.image_url_1x);
    }
  }
  return map;
};

export const useTwitchBadges = (channelName?: string | null) => {
  const [badgeMap, setBadgeMap] = React.useState<Map<string, string> | null>(null);

  // Requests that failed are tried again, since OBS can load the source before the network is up.
  useRetryingEffect(
    async (isCurrent) => {
      let failed = false;
      const get = (url: string) =>
        fetchJson<TwitchBadgeSet[]>(url).catch(() => {
          failed = true;
          return undefined;
        });
      const login = channelName?.toLowerCase();
      const [global, channel] = await Promise.all([
        get(GLOBAL_BADGES_URL),
        login ? get(channelBadgesUrl(login)) : undefined,
      ]);
      if (isCurrent()) setBadgeMap(new Map([...toBadgeMap(global), ...toBadgeMap(channel)]));
      return failed;
    },
    [channelName],
  );

  return badgeMap;
};
