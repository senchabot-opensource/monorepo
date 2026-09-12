import type { ChatMessagesType } from './chat-messages';

// Common chat bots on Twitch and Kick. Kick has no bot badge, so names are the only signal there.
const BOT_NAMES = new Set([
  'nightbot',
  'streamelements',
  'streamlabs',
  'moobot',
  'fossabot',
  'wizebot',
  'sery_bot',
  'soundalerts',
  'streamlootsbot',
  'kofistreambot',
  'pokemoncommunitygame',
  'own3d',
  'blerp',
  'botrix',
  'kickbot',
  'kicklet',
  'senchabot',
]);

// Twitch's own "Chat Bot" badge, given to accounts registered as chatbots.
const TWITCH_BOT_BADGE = 'bot-badge';

export interface MessageFilters {
  hideBots: boolean;
  hideCommands: boolean;
}

export function isHiddenMessage(msg: ChatMessagesType, filters: MessageFilters): boolean {
  if (filters.hideCommands && msg.message.trimStart().startsWith('!')) return true;
  if (!filters.hideBots) return false;
  return (
    BOT_NAMES.has(msg.user.toLowerCase()) ||
    (msg.badges ?? []).some((badge) => badge.split('/')[0] === TWITCH_BOT_BADGE)
  );
}
