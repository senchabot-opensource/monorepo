export type EmoteWallPlatforms = 'both' | 'twitch' | 'kick';
export type EmoteWallMode = 'calm' | 'chaos' | 'bounce';

export interface EmoteWallUrlOptions {
  twitch: string;
  kick: string;
  platforms: EmoteWallPlatforms;
  sevenTv: boolean;
  mode: EmoteWallMode;
  subsOnly: boolean;
  subDurationX2: boolean;
  showAllEmotes: boolean;
  hypeMode: boolean;
  spamBlock: boolean;
  /** Raw input values; empty or non-numeric means "use the widget default". */
  size: string;
  duration: string;
  max: string;
}

// Ranges and defaults mirror the widget's searchSchema (routes/widgets/emote-wall.tsx),
// so an omitted param and a default-valued one render the same widget.
const clampParam = (raw: string, min: number, max: number, fallback: number) => {
  const n = raw.trim() === '' ? Number.NaN : Number(raw);
  if (!Number.isFinite(n)) return String(fallback);
  return String(Math.min(max, Math.max(min, n)));
};

export function buildEmoteWallParams(options: EmoteWallUrlOptions): URLSearchParams {
  const params = new URLSearchParams();
  const twitch = options.twitch.trim().toLowerCase();
  const kick = options.kick.trim().toLowerCase();
  if (options.platforms !== 'kick' && twitch) params.append('twitch', twitch);
  if (options.platforms !== 'twitch' && kick) params.append('kick', kick);
  if (!options.sevenTv) params.append('sevenTv', 'false');
  if (options.mode !== 'calm') params.append('mode', options.mode);
  if (options.subsOnly) params.append('subsOnly', 'true');
  if (options.subDurationX2) params.append('subDurationX2', 'true');
  if (options.showAllEmotes) params.append('showAllEmotes', 'true');
  if (options.hypeMode) params.append('hypeMode', 'true');
  if (!options.spamBlock) params.append('spamBlock', 'false');
  const size = clampParam(options.size, 32, 256, 112);
  if (size !== '112') params.append('size', size);
  const duration = clampParam(options.duration, 2, 30, 5);
  if (duration !== '5') params.append('duration', duration);
  const max = clampParam(options.max, 1, 120, 25);
  if (max !== '25') params.append('max', max);
  return params;
}

/** Empty unless the URL names a channel on a selected platform. */
export function buildEmoteWallUrl(origin: string, options: EmoteWallUrlOptions): string {
  const params = buildEmoteWallParams(options);
  if (!params.has('twitch') && !params.has('kick')) return '';
  return `${origin}/widgets/emote-wall?${params.toString()}`;
}
