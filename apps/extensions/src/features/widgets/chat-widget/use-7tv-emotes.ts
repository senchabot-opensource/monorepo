import React from "react";

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
// by its Twitch ID, and only the emote set active on that channel is read.
export async function fetch7tvEmotes(twitchChannel: string): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const userResponse = await fetch(
      `https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(twitchChannel.trim().toLowerCase())}`,
      { headers: { Accept: "application/json" } },
    );
    if (!userResponse.ok) return map;
    const [twitchUser] = (await userResponse.json()) as { id?: string }[];
    if (!twitchUser?.id) return map;

    // 404 when the channel has no 7TV account.
    const response = await fetch(`https://7tv.io/v3/users/twitch/${twitchUser.id}`);
    if (!response.ok) return map;

    const connection = (await response.json()) as SevenTVConnection;
    for (const emote of connection.emote_set?.emotes || []) {
      const name = emote.name || emote.data?.name;
      if (name && emote.id) {
        map.set(name, emote.id);
      }
    }
  } catch {
    // Silently fail — 7tv emotes are optional
  }
  return map;
}

export const use7tvEmotes = (twitchChannel?: string | null) => {
  const [emoteMap, setEmoteMap] = React.useState<Map<string, string>>(
    new Map(),
  );

  React.useEffect(() => {
    if (!twitchChannel) {
      setEmoteMap(new Map());
      return;
    }

    let cancelled = false;
    fetch7tvEmotes(twitchChannel).then((map) => {
      if (!cancelled) {
        setEmoteMap(map);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [twitchChannel]);

  return emoteMap;
};
