// To get past Twitch's block on repeating your last message, Chatterino adds " U+034F" and 7TV
// " U+E0000". 27 of 228 messages on 10 busy channels carried one (2026-09-15). Left in, a mod's
// repeated "!poll end" or OBS Bridge "brb" matched nothing. A /me message keeps its closing \x01.
const BYPASS_SUFFIX = /\s*[͏\u{E0000}][\s͏\u{E0000}]*(?=\x01?$)/u;

/** Chat text without the invisible suffix chat clients add to a repeated message. */
export const withoutBypassSuffix = (text: string) => text.replace(BYPASS_SUFFIX, '');

const ACTION = '\x01ACTION ';

/** A Twitch /me message's text without its "\x01ACTION ...\x01" wrapper; other text as is. */
export function withoutAction(text: string): string {
  if (!text.startsWith(ACTION)) return text;
  const inner = text.slice(ACTION.length);
  // Some clients leave out the closing \x01.
  return inner.endsWith('\x01') ? inner.slice(0, -1) : inner;
}
