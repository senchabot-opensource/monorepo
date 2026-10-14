import { createFileRoute, useLocation } from '@tanstack/react-router';
import { HUD_FONT_URL } from '#/features/widgets/irl-hud/hud-text';
import { WEATHER_FONT_URL, WeatherWidget } from '#/features/widgets/weather/weather-widget';
import { readFlag } from '#/lib/url-params';
import { readWeatherSettings } from '#/lib/weather-url';

export const Route = createFileRoute('/widgets/weather')({
  ssr: false,
  head: () => ({
    links: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: WEATHER_FONT_URL },
      // For the IRL HUD styles; a font file loads only once some text uses it.
      { rel: 'stylesheet', href: HUD_FONT_URL },
    ],
  }),
  component: RouteComponent,
});

// Read as text, like the setup page's paste-to-edit does: the router would turn "41.0082" into a
// number and a place called "true" into a boolean, and the readers take strings.
function RouteComponent() {
  const params = new URLSearchParams(useLocation({ select: (location) => location.searchStr }));
  return (
    <WeatherWidget
      settings={readWeatherSettings(params)}
      demo={readFlag(params.get('demo'), false)}
      previewId={params.get('preview')?.trim() || undefined}
      // Only for the mods' !h weather; the weather itself needs no channel.
      twitchChannel={params.get('twitch')?.trim() || undefined}
      kickChannel={params.get('kick')?.trim() || undefined}
    />
  );
}
