import type { AnnouncementColor, ChatMessagesType } from './chat-messages';
import type { Highlight } from './widget-settings';

// Reply context is shown as a line above the message rather than as a row highlight.
export type HighlightKind = Exclude<Highlight, 'reply'>;

// Kick slugs swap a username's underscores for hyphens (SALAH_ABDULLAH -> salah-abdullah).
const normalizeName = (name: string) => name.toLowerCase().replace(/_/g, '-');

export function mentionsAny(msg: ChatMessagesType, channels: string[]): boolean {
  const targets = new Set(channels.map(normalizeName));
  if (targets.size === 0) return false;
  if (msg.replyTo && targets.has(normalizeName(msg.replyTo.user))) return true;
  for (const [, name] of msg.message.matchAll(/@(\w+)/g)) {
    if (targets.has(normalizeName(name))) return true;
  }
  return false;
}

// One highlight per row, most deliberate first: a moderator's announcement and a paid highlight
// outrank a mention, which outranks a first-time chatter.
export function getHighlightKind(
  msg: ChatMessagesType,
  channels: string[],
  enabled: ReadonlySet<Highlight>,
): HighlightKind | null {
  if (msg.variant && enabled.has(msg.variant)) return msg.variant;
  if (enabled.has('mention') && mentionsAny(msg, channels)) return 'mention';
  if (enabled.has('firstMessage') && msg.firstMessage) return 'firstMessage';
  return null;
}

const HIGHLIGHT_COLORS: Record<Exclude<HighlightKind, 'announcement'>, string> = {
  mention: '#FBBF24',
  highlighted: '#F472B6',
  firstMessage: '#38BDF8',
};

// PRIMARY is the channel's own accent color, which anonymous chat doesn't expose.
const ANNOUNCEMENT_GRADIENTS: Record<AnnouncementColor, [string, string]> = {
  PRIMARY: ['#9146FF', '#FF75E6'],
  BLUE: ['#00D6D6', '#9146FF'],
  GREEN: ['#00DB84', '#57BEE6'],
  ORANGE: ['#FFB31A', '#E0E000'],
  PURPLE: ['#9146FF', '#FF75E6'],
};

export function getHighlightColors(
  kind: HighlightKind,
  announcementColor: AnnouncementColor = 'PRIMARY',
): [string, string] {
  if (kind === 'announcement') return ANNOUNCEMENT_GRADIENTS[announcementColor];
  return [HIGHLIGHT_COLORS[kind], HIGHLIGHT_COLORS[kind]];
}

// CSS background for the setup checkboxes, so each one matches what it turns on. Reply context is
// the muted gray line above a reply.
export function getHighlightSwatch(highlight: Highlight): string {
  if (highlight === 'reply') return '#A1A1AA';
  const [from, to] = getHighlightColors(highlight);
  return from === to ? from : `linear-gradient(135deg, ${from}, ${to})`;
}
