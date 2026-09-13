import { createFileRoute } from '@tanstack/react-router';
import { SUBATHON_FONT, SubathonWidget } from '#/features/widgets/subathon/subathon-widget';
import { readFlag, readSubathonSettings, SUBATHON_PARAMS } from '#/lib/subathon-url';

const KEYS = ['twitch', 'kick', 'simulate', 'simspeed', ...SUBATHON_PARAMS] as const;

// The router writes whatever this returns back into the address bar, so the params stay under
// their own names and values; they are read into settings in the component.
const validateSearch = (search: Record<string, unknown>) =>
  Object.fromEntries(
    KEYS.filter((key) => search[key] !== undefined && search[key] !== null).map((key) => [
      key,
      search[key],
    ]),
  ) as Partial<Record<(typeof KEYS)[number], unknown>>;

export const Route = createFileRoute('/widgets/subathon')({
  ssr: false,
  validateSearch,
  head: () => ({
    links: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: SUBATHON_FONT },
    ],
  }),
  component: RouteComponent,
});

// The router parses "3600" into a number and "true" into a boolean; the readers take text.
function textOf(value: unknown): string | undefined {
  return value === undefined || value === null ? undefined : String(value).trim() || undefined;
}

function RouteComponent() {
  const search = Route.useSearch();
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    const text = textOf(value);
    if (text !== undefined) params.set(key, text);
  }
  // An empty title is a setting of its own (no title), not a missing param.
  if (search.title !== undefined) params.set('title', String(search.title));
  const simulate = readFlag(params.get('simulate'), false);
  const simSpeed = Number(params.get('simspeed')) || undefined;

  return (
    <SubathonWidget
      twitchChannel={simulate ? undefined : (params.get('twitch') ?? undefined)}
      kickChannel={simulate ? undefined : (params.get('kick') ?? undefined)}
      settings={readSubathonSettings(params)}
      simulate={simulate}
      simSpeed={simSpeed}
    />
  );
}
