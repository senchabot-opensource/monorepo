import React from "react";
import { useRetryingEffect } from "#/hooks/use-retrying-effect";
import { requestJson } from "#/lib/fetch-json";

type SevenTVEmote = {
  id: string;
  name: string;
  data?: { name?: string };
};

type SevenTVConnection = {
  emote_set?: {
    emotes?: SevenTVEmote[];
  } | null;
};

// 7TV's user search is fuzzy ("forsen" returns other accounts first), so the channel is looked up
// by its Twitch ID, and only the emote set active on that channel is read. Rejects with
// RetryableFetchError when a request should be tried again.
export async function fetch7tvEmotes(twitchChannel: string): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const users = await requestJson<{ id?: string }[]>(
    `https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(twitchChannel.trim().toLowerCase())}`,
  );
  const twitchId = Array.isArray(users) ? users[0]?.id : undefined;
  if (!twitchId) return map;

  // Undefined (a 404) when the channel has no 7TV account.
  const connection = await requestJson<SevenTVConnection>(
    `https://7tv.io/v3/users/twitch/${twitchId}`,
  );
  for (const emote of connection?.emote_set?.emotes || []) {
    const name = emote.name || emote.data?.name;
    if (name && emote.id) {
      map.set(name, emote.id);
    }
  }
  return map;
}

export const use7tvEmotes = (twitchChannel?: string | null) => {
  const [emoteMap, setEmoteMap] = React.useState<Map<string, string>>(
    new Map(),
  );

  // 7TV emotes are optional, but a failed lookup is tried again: OBS can load the source before
  // the network is up.
  useRetryingEffect(
    async (isCurrent) => {
      if (!twitchChannel) {
        setEmoteMap(new Map());
        return false;
      }
      try {
        const map = await fetch7tvEmotes(twitchChannel);
        if (isCurrent()) setEmoteMap(map);
        return false;
      } catch {
        return true;
      }
    },
    [twitchChannel],
  );

  return emoteMap;
};
