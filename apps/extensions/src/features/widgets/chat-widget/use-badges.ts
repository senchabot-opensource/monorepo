import React from "react";

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

let globalFetchPromise: Promise<Map<string, string>> | null = null;
const channelBadgeCaches = new Map<string, Promise<Map<string, string>>>();

export const useTwitchBadges = (channelName?: string | null) => {
  const [badgeMap, setBadgeMap] = React.useState<Map<string, string> | null>(
    null,
  );

  React.useEffect(() => {
    if (!globalFetchPromise) {
      globalFetchPromise = fetch("https://api.ivr.fi/v2/twitch/badges/global", {
        headers: { Accept: "application/json" },
      })
        .then(res => {
          if (!res.ok) throw new Error("API Error");
          return res.json();
        })
        .then((data: TwitchBadgeSet[]) => {
          const map = new Map<string, string>();
          for (const set of data) {
            for (const version of set.versions) {
              map.set(`${set.set_id}/${version.id}`, version.image_url_1x);
            }
          }
          return map;
        })
        .catch(err => {
          console.error("Failed to load Twitch global badges:", err);
          return new Map<string, string>();
        });
    }

    let channelPromise = Promise.resolve(new Map<string, string>());
    if (channelName) {
      const lowerChannel = channelName.toLowerCase();
      if (!channelBadgeCaches.has(lowerChannel)) {
        const p = fetch(
          `https://api.ivr.fi/v2/twitch/badges/channel?login=${encodeURIComponent(lowerChannel)}`,
          {
            headers: { Accept: "application/json" },
          },
        )
          .then(res => {
            if (!res.ok) throw new Error("API Error");
            return res.json();
          })
          .then((data: TwitchBadgeSet[]) => {
            const map = new Map<string, string>();
            for (const set of data) {
              for (const version of set.versions) {
                map.set(`${set.set_id}/${version.id}`, version.image_url_1x);
              }
            }
            return map;
          })
          .catch(err => {
            console.error("Failed to load Twitch channel badges:", err);
            return new Map<string, string>();
          });
        channelBadgeCaches.set(lowerChannel, p);
      }
      channelPromise = channelBadgeCaches.get(lowerChannel)!;
    }

    let isMounted = true;
    Promise.all([globalFetchPromise, channelPromise]).then(
      ([globalMap, channelMap]) => {
        if (!isMounted) return;
        const merged = new Map<string, string>([...globalMap, ...channelMap]);
        setBadgeMap(merged);
      },
    );

    return () => {
      isMounted = false;
    };
  }, [channelName]);

  return badgeMap;
};
