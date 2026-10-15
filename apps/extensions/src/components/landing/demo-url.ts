import { isClassic, PRESET_PARAM } from '#/features/presets/registry';
import type { WidgetEntry, WidgetId } from '#/lib/widgets';

type DemoParams = Partial<Record<WidgetId, Record<string, string>>>;

// Landing previews are a fraction of a 1920×1080 scene, so text and emotes are sized down to
// look in proportion. Only existing widget params, so the demo stays a real widget URL.
const DEMO_PARAMS: DemoParams = {
  'chat-box': { fontSize: '12', mockRate: '0.5' },
  'emote-wall': { size: '48' },
  // The sub count badge has a 40px minimum, so in a small frame it dwarfs the plant.
  'sub-sprout': { countfx: '0' },
};

// The gallery's Chat Box card is a column about the size of the 400×600 source, so its text is
// near full size, and the chat runs faster to fill the column before the visitor scrolls past.
const CARD_PARAMS: DemoParams = {
  'chat-box': { fontSize: '15', mockRate: '1.5' },
  // The HUD is sized for the card's short side, so in a strip it runs at its biggest.
  'irl-hud': { size: '200' },
  // The one-line pill, the setup page's first look, drawn for a 1080p scene, so in a gallery
  // card it runs at its biggest; in the Modern HUD style, outlined text right on the scene.
  weather: { layout: 'pill', size: '200', style: 'modern' },
};

// "Better together" puts the IRL HUD and the Weather pill in one scene, both in the Modern HUD
// style so they match, drawn large enough to read in a half-width card.
const TOGETHER_PARAMS: DemoParams = {
  'irl-hud': { style: 'modern', size: '170' },
  weather: { layout: 'pill', style: 'modern', size: '170' },
};

const PLACE_PARAMS = { card: CARD_PARAMS, together: TOGETHER_PARAMS };

/**
 * The widget's self-running demo URL tuned for small previews; empty when it has no demo.
 * `card` is the gallery card, `scene` the hero's stream scene, `together` the scene that shows
 * widgets used side by side. A `preset` dresses the demo in it.
 */
export function getDemoSrc(
  widget: WidgetEntry,
  place: 'scene' | 'card' | 'together' = 'scene',
  preset?: string,
): string {
  if (!widget.demoUrl) return '';
  const [path, query = ''] = widget.demoUrl.split('?');
  const params = new URLSearchParams(query);
  const overrides = {
    ...DEMO_PARAMS[widget.id],
    ...(place === 'scene' ? undefined : PLACE_PARAMS[place][widget.id]),
  };
  for (const [key, value] of Object.entries(overrides)) params.set(key, value);
  if (preset && !isClassic(preset)) params.set(PRESET_PARAM, preset);
  return `${path}?${params.toString()}`;
}
