import type { StreamAlertsSettings } from '#/lib/stream-alerts-url';
import type { RaidEvent, TimedEvent } from '../subathon/subathon-events';

/** Something that gets an alert. Its `kind` matches the AlertKind of its settings. */
export type StreamAlert = TimedEvent | RaidEvent;

// What each platform puts in the name field of an anonymous gift (Twitch's is its login).
const ANONYMOUS_GIFTER = { twitch: 'ananonymousgifter', kick: 'anonymous' } as const;

export const isAnonymous = (alert: StreamAlert) =>
  alert.kind === 'gift' && alert.name.toLowerCase() === ANONYMOUS_GIFTER[alert.platform];

/** Whether the settings let this alert show: its kind is on and it meets its minimum. */
export function passesFilters(
  alert: StreamAlert,
  settings: Pick<StreamAlertsSettings, 'enabled' | 'minGift' | 'minBits' | 'minRaid'>,
): boolean {
  if (!settings.enabled[alert.kind]) return false;
  switch (alert.kind) {
    case 'sub':
      return true;
    case 'gift':
      return alert.count >= settings.minGift;
    case 'bits':
      return alert.amount >= settings.minBits;
    case 'raid':
      return alert.viewers >= settings.minRaid;
  }
}

export const MESSAGE_MAX_LENGTH = 120;

// A Twitch cheermote is a prefix and an amount in one word: Cheer100, uni5, 4Head25.
const CHEERMOTE = /^[a-z0-9]*[a-z](\d+)$/i;
const KICK_EMOTE = /\[emote:\d+:([^\]]*)\]/g;
// Links don't go on stream: anything shaped like a URL or a bare domain.
const LINK = /^(https?:\/\/|www\.)|^[\w-]+(\.[\w-]+)*\.[a-z]{2,}(\/\S*)?$/i;

/**
 * The viewer's message with a resub, Bits or Kicks as it should read on stream: no cheermotes
 * (the amount is shown anyway), Kick emotes as their names, no links, cut to MESSAGE_MAX_LENGTH.
 */
export function cleanMessage(alert: StreamAlert): string {
  if ((alert.kind !== 'bits' && alert.kind !== 'sub') || !alert.message) return '';
  let words = alert.message
    .replace(KICK_EMOTE, ' $1 ')
    .split(/\s+/)
    .filter((word) => word && !LINK.test(word));
  if (alert.kind === 'bits' && alert.platform === 'twitch')
    words = withoutCheermotes(words, alert.amount);
  // By code point, so an emoji at the cut isn't split in half.
  const chars = Array.from(words.join(' '));
  return chars.length > MESSAGE_MAX_LENGTH
    ? `${chars.slice(0, MESSAGE_MAX_LENGTH - 1).join('')}…`
    : chars.join('');
}

/**
 * The words without the cheer's cheermotes. They add up to the Bits, so when the cheermote-looking
 * words do too they all go; otherwise only ones with "cheer" in the name do, keeping words like ps5.
 */
function withoutCheermotes(words: string[], bits: number): string[] {
  const amountOf = (word: string) => Number(CHEERMOTE.exec(word)?.[1] ?? 0);
  const total = words.reduce((sum, word) => sum + amountOf(word), 0);
  return words.filter((word) => !CHEERMOTE.test(word) || (total !== bits && !/cheer/i.test(word)));
}
