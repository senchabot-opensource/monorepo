import { defaultParseSearch, defaultStringifySearch } from '@tanstack/react-router';

/**
 * Search params the routes validate as free text. The default parser turns "123456" into a
 * number and "true" into a boolean, so a digit-only OBS password or channel name failed the
 * route's string schema and the overlay or tool showed an error screen instead of loading.
 */
const TEXT_PARAMS = new Set([
  'twitch',
  'kick',
  'channel',
  'variety',
  'highlights',
  'lang',
  'obsWebsocketUrl',
  'obsWebsocketPassword',
  'commandUser',
  'mainScene',
  'brbScene',
  'cmdScene',
  'cmdBrb',
  'cmdBack',
  'cmdStartStream',
  'cmdStopStream',
  'cmdStartRecord',
  'cmdStopRecord',
]);

/** The default parser, except text params are kept exactly as written in the URL. */
export function parseSearch(searchStr: string): Record<string, unknown> {
  const search: Record<string, unknown> = defaultParseSearch(searchStr);
  const raw = new URLSearchParams(searchStr.startsWith('?') ? searchStr.slice(1) : searchStr);
  for (const key of TEXT_PARAMS) {
    const value = raw.get(key);
    if (value !== null) search[key] = value;
  }
  return search;
}

/**
 * The default serializer, except text params are written as-is. The default would quote a
 * string that looks like JSON ("123456" becomes %22123456%22) so it survives its own parser.
 */
export function stringifySearch(search: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined) continue;
    parts.push(
      TEXT_PARAMS.has(key) && typeof value === 'string'
        ? new URLSearchParams({ [key]: value }).toString()
        : defaultStringifySearch({ [key]: value }).slice(1),
    );
  }
  return parts.length > 0 ? `?${parts.join('&')}` : '';
}
