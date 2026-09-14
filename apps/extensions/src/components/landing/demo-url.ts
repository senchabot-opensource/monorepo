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
};

/**
 * The widget's self-running demo URL tuned for small previews; empty when it has no demo.
 * `card` is the gallery card, `scene` the hero's stream scene.
 */
export function getDemoSrc(widget: WidgetEntry, place: 'scene' | 'card' = 'scene'): string {
  if (!widget.demoUrl) return '';
  const [path, query = ''] = widget.demoUrl.split('?');
  const params = new URLSearchParams(query);
  const overrides = {
    ...DEMO_PARAMS[widget.id],
    ...(place === 'card' ? CARD_PARAMS[widget.id] : undefined),
  };
  for (const [key, value] of Object.entries(overrides)) params.set(key, value);
  return `${path}?${params.toString()}`;
}
