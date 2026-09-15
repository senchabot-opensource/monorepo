export type RichToken =
  | { type: 'text'; text: string }
  | { type: 'code'; text: string }
  | { type: 'link'; text: string; href: string };

// `code` or [label](href). Translated copy stays one string per sentence, so links and code can
// sit anywhere in it and move freely between languages.
const TOKEN = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseRichText(input: string): RichToken[] {
  const tokens: RichToken[] = [];
  let last = 0;
  for (const match of input.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ type: 'text', text: input.slice(last, index) });
    if (match[1] !== undefined) tokens.push({ type: 'code', text: match[1] });
    else tokens.push({ type: 'link', text: match[2], href: match[3] });
    last = index + match[0].length;
  }
  if (last < input.length) tokens.push({ type: 'text', text: input.slice(last) });
  return tokens;
}

/** The copy as plain text, e.g. for meta tags and JSON-LD. */
export function richTextToPlain(input: string): string {
  return parseRichText(input)
    .map((token) => token.text)
    .join('');
}

export const isExternalHref = (href: string) => /^https?:\/\//.test(href);
