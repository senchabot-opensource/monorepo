import React from "react";

type SevenTVEmote = {
  id: string;
  name: string;
  data?: { name?: string };
};

type SevenTVEmoteSet = {
  id: string;
  name: string;
  emotes?: SevenTVEmote[];
};

type SevenTVUser = {
  id: string;
  emote_sets?: SevenTVEmoteSet[];
};

type SevenTVResponse = {
  data?: {
    users?: SevenTVUser[];
  };
};

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

    const fetchEmotes = async () => {
      try {
        const query = `
          query SearchUsers {
            users(query: "${twitchChannel}", limit: 1) {
              id
              emote_sets {
                id
                name
                emotes {
                  id
                  name
                  data {
                    name
                  }
                }
              }
            }
          }
        `;

        const response = await fetch("https://7tv.io/v3/gql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) return;

        const json = (await response.json()) as SevenTVResponse;
        const users = json?.data?.users;
        if (!users || users.length === 0) return;

        const user = users[0];
        const map = new Map<string, string>();

        for (const emoteSet of user?.emote_sets || []) {
          for (const emote of emoteSet.emotes || []) {
            const name = emote.name || emote.data?.name;
            if (name && emote.id) {
              map.set(name, emote.id);
            }
          }
        }

        if (!cancelled) {
          setEmoteMap(map);
        }
      } catch {
        // Silently fail — 7tv emotes are optional
      }
    };

    fetchEmotes();

    return () => {
      cancelled = true;
    };
  }, [twitchChannel]);

  return emoteMap;
};
