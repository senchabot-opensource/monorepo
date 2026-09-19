export type TwitchEmoteRange = { id: string; start: number; end: number };

/** The emotes in a Twitch message, from its IRC `emotes` tag ("25:0-4,12-16/1902:6-10"), in order. */
export const parseTwitchEmoteRanges = (emotesTag?: string): TwitchEmoteRange[] => {
  if (!emotesTag) return [];
  const ranges: TwitchEmoteRange[] = [];
  for (const part of emotesTag.split('/')) {
    const [id, positionsStr] = part.split(':');
    if (!id || !positionsStr) continue;
    for (const pos of positionsStr.split(',')) {
      const [startStr, endStr] = pos.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!Number.isNaN(start) && !Number.isNaN(end)) {
        ranges.push({ id, start, end });
      }
    }
  }
  return ranges.sort((a, b) => a.start - b.start);
};
