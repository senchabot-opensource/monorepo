// To get past Twitch's block on repeating your last message, Chatterino adds " U+034F" and 7TV
// " U+E0000". 27 of 228 messages on 10 busy channels carried one (2026-09-15). Left in, a mod's
// repeated "!poll end" or OBS Bridge "brb" matched nothing. A /me message keeps its closing \x01.
const BYPASS_SUFFIX = /\s*[͏\u{E0000}][\s͏\u{E0000}]*(?=\x01?$)/u;

/** Chat text without the invisible suffix chat clients add to a repeated message. */
export const withoutBypassSuffix = (text: string) => text.replace(BYPASS_SUFFIX, '');
