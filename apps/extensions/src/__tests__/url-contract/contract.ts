import { defaultParseSearch } from '@tanstack/react-router';

export interface FixtureCase<Input> {
  group: 'channels' | 'single' | 'pairwise';
  input: Input;
  expectedUrl: string;
}

export interface Fixture<Input, Defaults = undefined> {
  origin: string;
  defaults: Defaults;
  cases: FixtureCase<Input>[];
}

/** Types an imported fixture file, written by scripts/url-contract/generate.ts. */
export const asFixture = <Input, Defaults = undefined>(json: unknown) =>
  json as Fixture<Input, Defaults>;

export const GROUPS = ['channels', 'single', 'pairwise'] as const;

/** Every non-empty expected URL, i.e. every URL a setup page hands out. */
export const fixtureUrls = (fixture: Fixture<unknown, unknown>) =>
  fixture.cases.map((c) => c.expectedUrl).filter(Boolean);

/**
 * What a widget route receives for a URL: the router's own search parsing (which turns `false`,
 * `0` and other JSON-looking values into non-strings) followed by the route's validateSearch.
 */
export function readWidgetSearch(
  route: { options: { validateSearch?: unknown } },
  url: string,
): Record<string, unknown> {
  const validate = route.options.validateSearch as (search: Record<string, unknown>) => unknown;
  return validate(defaultParseSearch(new URL(url).search)) as Record<string, unknown>;
}

/** Inputs that must never make a paste-to-edit parser throw. */
export const GARBAGE = [
  '',
  '   ',
  'not a url',
  'extensions.senchabot.com/widgets/chat-widget?twitch=foo',
  'https://',
  'http://[::1',
  '%E0%A4%A',
  'javascript:alert(1)',
  'https://extensions.senchabot.com/',
  'https://extensions.senchabot.com/widgets/unknown?twitch=foo',
  `https://extensions.senchabot.com/?${'a=1&'.repeat(5000)}`,
];
