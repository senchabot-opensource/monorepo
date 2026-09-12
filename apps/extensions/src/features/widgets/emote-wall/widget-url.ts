import { isEmoteWallMode } from './emote-pops';

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
export const EMOTE_WALL_RANGES = {
  size: { min: 32, max: 256, fallback: 112 },
  duration: { min: 2, max: 30, fallback: 5 },
  max: { min: 1, max: 120, fallback: 25 },
} as const;

type RangeKey = keyof typeof EMOTE_WALL_RANGES;

export const DEFAULT_EMOTE_WALL_OPTIONS: EmoteWallUrlOptions = {
  twitch: '',
  kick: '',
  platforms: 'both',
  sevenTv: true,
  mode: 'calm',
  subsOnly: false,
  subDurationX2: false,
  showAllEmotes: false,
  hypeMode: false,
  spamBlock: true,
  size: String(EMOTE_WALL_RANGES.size.fallback),
  duration: String(EMOTE_WALL_RANGES.duration.fallback),
  max: String(EMOTE_WALL_RANGES.max.fallback),
};

const clampParam = (raw: string, key: RangeKey) => {
  const { min, max, fallback } = EMOTE_WALL_RANGES[key];
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
  for (const key of ['size', 'duration', 'max'] as const) {
    const value = clampParam(options[key], key);
    if (value !== String(EMOTE_WALL_RANGES[key].fallback)) params.append(key, value);
  }
  return params;
}

/** Empty unless the URL names a channel on a selected platform. */
export function buildEmoteWallUrl(origin: string, options: EmoteWallUrlOptions): string {
  const params = buildEmoteWallParams(options);
  if (!params.has('twitch') && !params.has('kick')) return '';
  return `${origin}/widgets/emote-wall?${params.toString()}`;
}

// The router JSON-parses search values before zod's coerce.boolean, so "false", "0", "null"
// and an empty value all switch a flag off.
const FALSY_FLAGS = ['false', '0', 'null', ''];

/**
 * Reverse of buildEmoteWallParams: null for anything that isn't an Emote Wall URL, the widget
 * default for any value it wouldn't accept, and unknown params (`mock`, `lang`) ignored.
 */
export function parseEmoteWallUrl(text: string): EmoteWallUrlOptions | null {
  let url: URL;
  try {
    url = new URL(text.trim());
  } catch {
    return null;
  }
  if (!url.pathname.replace(/\/+$/, '').endsWith('/widgets/emote-wall')) return null;

  const params = url.searchParams;
  const flag = (key: string, fallback: boolean) => {
    const value = params.get(key);
    return value === null ? fallback : !FALSY_FLAGS.includes(value.trim().toLowerCase());
  };
  const mode = params.get('mode');
  const twitch = params.get('twitch')?.trim() ?? '';
  const kick = params.get('kick')?.trim() ?? '';
  const defaults = DEFAULT_EMOTE_WALL_OPTIONS;

  return {
    twitch,
    kick,
    platforms: twitch && !kick ? 'twitch' : kick && !twitch ? 'kick' : 'both',
    sevenTv: flag('sevenTv', defaults.sevenTv),
    mode: isEmoteWallMode(mode) ? mode : defaults.mode,
    subsOnly: flag('subsOnly', defaults.subsOnly),
    subDurationX2: flag('subDurationX2', defaults.subDurationX2),
    showAllEmotes: flag('showAllEmotes', defaults.showAllEmotes),
    hypeMode: flag('hypeMode', defaults.hypeMode),
    spamBlock: flag('spamBlock', defaults.spamBlock),
    size: clampParam(params.get('size') ?? '', 'size'),
    duration: clampParam(params.get('duration') ?? '', 'duration'),
    max: clampParam(params.get('max') ?? '', 'max'),
  };
}
