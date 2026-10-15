/** A platform whose channel fields take a channel's name or its link. */
export type ChannelPlatform = 'twitch' | 'kick';

// What a channel's name can be made of in its link. Kick spells some links with - (see
// kickDashName); Twitch has no - in its names.
const NAME: Record<ChannelPlatform, RegExp> = {
  twitch: /^\w+$/,
  kick: /^[\w-]+$/,
};

// Pages of each site whose first path segment isn't a channel, e.g. twitch.tv/videos/123.
const NOT_CHANNELS: Record<ChannelPlatform, readonly string[]> = {
  twitch: [
    'directory',
    'downloads',
    'drops',
    'inventory',
    'jobs',
    'p',
    'search',
    'settings',
    'subscriptions',
    'turbo',
    'videos',
    'wallet',
  ],
  kick: [
    'browse',
    'categories',
    'category',
    'dashboard',
    'following',
    'search',
    'settings',
    'video',
  ],
};

// Paths with the channel second: popout chat, embedded chat and Twitch's mod view.
const CHANNEL_SECOND = ['popout', 'embed', 'moderator'];

/** The channel a Twitch or Kick link points at; null when the text isn't a channel link. */
function channelInLink(platform: ChannelPlatform, text: string): string | null {
  let url: URL;
  try {
    url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(?:www|m)\./, '');
  const [first = '', second = ''] = url.pathname.split('/').filter(Boolean);
  let name: string | null;
  if (platform === 'twitch' && host === 'player.twitch.tv') name = url.searchParams.get('channel');
  else if (platform === 'twitch' && host === 'dashboard.twitch.tv')
    name = first === 'u' ? second : null;
  else if (platform === 'kick' && host === 'player.kick.com') name = first;
  else if (host !== (platform === 'twitch' ? 'twitch.tv' : 'kick.com')) name = null;
  else if (CHANNEL_SECOND.includes(first.toLowerCase())) name = second;
  else name = NOT_CHANNELS[platform].includes(first.toLowerCase()) ? null : first;
  return name && NAME[platform].test(name) ? name : null;
}

/**
 * What a channel field holds for the text typed or pasted into it: a channel link becomes the
 * channel's name ("https://www.twitch.tv/senchabot/videos" is "senchabot"), and anything else
 * stays as it was.
 */
export function channelFromInput(platform: ChannelPlatform, text: string): string {
  return channelInLink(platform, text.trim()) ?? text;
}

// A lookup that hangs would keep the field waiting for good.
const KICK_LOOKUP_TIMEOUT_MS = 10_000;

/** Whether kick.com has a channel at this name; null when it didn't say (offline, 403, 5xx). */
async function isKickChannel(name: string): Promise<boolean | null> {
  try {
    const response = await fetch(`https://kick.com/api/v1/channels/${encodeURIComponent(name)}`, {
      signal: AbortSignal.timeout(KICK_LOOKUP_TIMEOUT_MS),
    });
    if (response.ok) return true;
    return response.status === 404 ? false : null;
  } catch {
    return null;
  }
}

/**
 * The spelling a Kick name typed with _ has in its kick.com link. Kick keeps the _ in some
 * channels' links and writes it as - in others', so the name is looked up as typed first, then
 * with -. Null when the name is a channel as typed, neither spelling is one, or kick.com didn't
 * answer.
 */
export async function kickDashName(name: string): Promise<string | null> {
  const typed = name.trim().toLowerCase();
  if (!typed.includes('_') || !NAME.kick.test(typed)) return null;
  if ((await isKickChannel(typed)) !== false) return null;
  const dashed = typed.replaceAll('_', '-');
  return (await isKickChannel(dashed)) ? dashed : null;
}
