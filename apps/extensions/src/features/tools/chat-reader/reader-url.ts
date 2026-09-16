import { buildWidgetParams, type Settings } from '#/features/widgets/chat-widget/widget-settings';

// What decides which messages show and how they read; the rest of the widget's URL is overlay look.
const READER_PARAMS = new Set([
  'twitch',
  'kick',
  'sevenTv',
  'bttv',
  'ffz',
  'badges',
  'hideBots',
  'hideCommands',
  'highlights',
]);

/** Chat Reader link for the Chat Box setup; empty until a channel is entered. */
export function buildReaderUrl(
  origin: string,
  settings: Settings,
  twitchChannel: string,
  kickChannel: string,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of buildWidgetParams(settings, twitchChannel, kickChannel)) {
    if (READER_PARAMS.has(key)) params.append(key, value);
  }
  if (!params.has('twitch') && !params.has('kick')) return '';
  return `${origin}/tools/chat-reader?${params.toString()}`;
}
