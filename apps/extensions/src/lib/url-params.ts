import { z } from 'zod';

/**
 * A number param for a route's search schema that never throws: garbage falls back and anything
 * else is clamped into range. A mistyped URL must degrade gracefully, never white-screen OBS.
 */
export const clampedNumber = <F extends number | undefined>(min: number, max: number, fallback: F) =>
  z.coerce
    .number()
    .catch(Number.NaN)
    .transform((v): number | F => (Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback));

// Chat Box and Emote Wall read flags as the router parses them (JSON first) through
// z.coerce.boolean, so these are the values that come out false.
const COERCED_OFF = ['false', '0', 'null', ''];

/** Reads a Chat Box or Emote Wall on/off param the way the widget does. */
export function readCoercedFlag(value: string | null, fallback: boolean): boolean {
  return value === null ? fallback : !COERCED_OFF.includes(value.trim().toLowerCase());
}

/** Which chats a widget reads. */
export type ChannelPlatforms = 'both' | 'twitch' | 'kick';

/** Writes the channels of the picked platforms, trimmed and lowercased, before any other param. */
export function setChannels(
  params: URLSearchParams,
  platforms: ChannelPlatforms,
  twitchChannel: string,
  kickChannel: string,
) {
  const twitch = twitchChannel.trim().toLowerCase();
  const kick = kickChannel.trim().toLowerCase();
  if (platforms !== 'kick' && twitch) params.set('twitch', twitch);
  if (platforms !== 'twitch' && kick) params.set('kick', kick);
}

/** The widget URL for OBS. Empty until a channel on a picked platform is filled in. */
export function channelWidgetUrl(origin: string, path: string, params: URLSearchParams): string {
  if (!params.has('twitch') && !params.has('kick')) return '';
  return `${origin}${path}?${params.toString()}`;
}

/**
 * Makes `params` a setup page's preview: simulated, never touching a channel. `previewId` pairs it
 * with that page, whose test buttons would otherwise reach every preview and demo open on the
 * site, and with one platform picked it only simulates that one.
 */
export function setPreview(params: URLSearchParams, platforms: ChannelPlatforms, previewId: string) {
  params.set('simulate', '1');
  params.set('preview', previewId);
  if (platforms !== 'both') params.set('simplatform', platforms);
}

/** One channel means one platform. */
export const platformsOf = (twitchChannel: string, kickChannel: string): ChannelPlatforms =>
  twitchChannel && !kickChannel ? 'twitch' : kickChannel && !twitchChannel ? 'kick' : 'both';

/** A pasted URL of the widget at `path`, with its channels; null for anything else. */
export function readWidgetUrl(text: string, path: string) {
  let url: URL;
  try {
    url = new URL(text.trim());
  } catch {
    return null;
  }
  if (!url.pathname.replace(/\/+$/, '').endsWith(path)) return null;
  const twitchChannel = url.searchParams.get('twitch')?.trim() ?? '';
  const kickChannel = url.searchParams.get('kick')?.trim() ?? '';
  return {
    params: url.searchParams,
    twitchChannel,
    kickChannel,
    platforms: platformsOf(twitchChannel, kickChannel),
  };
}

const OFF_FLAGS = ['0', 'false', 'off', 'no'];

/** Reads one on/off param the way the widgets that take text do: anything but an "off" word is on. */
export function readFlag(value: string | null | undefined, fallback: boolean): boolean {
  if (value === null || value === undefined) return fallback;
  return !OFF_FLAGS.includes(value.trim().toLowerCase());
}

/**
 * A whole number up to `max`, or `fallback` when missing or not a number. Below `min` it is
 * `fallback` too, or `min` with `below: 'clamp'`.
 */
export function readWhole(
  value: string | null,
  fallback: number,
  { min = 0, max, below = 'fallback' }: { min?: number; max: number; below?: 'fallback' | 'clamp' },
): number {
  if (value === null || value.trim() === '') return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  if (below === 'clamp') return Math.min(max, Math.max(min, Math.round(n)));
  return n >= min ? Math.min(max, Math.round(n)) : fallback;
}
