import type { ChatMessagesType } from './chat-messages';

// Common chat bots on Twitch and Kick, for bot accounts without a bot badge.
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

// The platforms' own bot badges: Twitch's "Chat Bot", and Kick's "Bot", which Kick's @Kicklet and
// @StreamElements carry (seen live 2026-09-15).
const BOT_BADGES: Record<ChatMessagesType['platform'], string> = {
  twitch: 'bot-badge',
  kick: 'bot',
};

export interface MessageFilters {
  hideBots: boolean;
  hideCommands: boolean;
}

export function isHiddenMessage(msg: ChatMessagesType, filters: MessageFilters): boolean {
  if (filters.hideCommands && msg.message.trimStart().startsWith('!')) return true;
  if (!filters.hideBots) return false;
  return (
    // Kick sends its bot accounts with an "@" in the name, and @Streamlabs without a badge.
    BOT_NAMES.has(msg.user.toLowerCase().replace(/^@/, '')) ||
    (msg.badges ?? []).some((badge) => badge.split('/')[0] === BOT_BADGES[msg.platform])
  );
}
