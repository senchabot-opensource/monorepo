import type { WidgetEntry, WidgetId } from '#/lib/widgets';

// Landing previews are a fraction of a 1920×1080 scene, so text and emotes are sized down to
// look in proportion. Only existing widget params, so the demo stays a real widget URL.
const DEMO_PARAMS: Partial<Record<WidgetId, Record<string, string>>> = {
  'chat-box': { fontSize: '14', mockRate: '0.5' },
  'emote-wall': { size: '56' },
  // The sub count badge has a 40px minimum, so in a small frame it dwarfs the plant.
  'sub-sprout': { countfx: '0' },
};

/** The widget's self-running demo URL tuned for small previews; empty when it has no demo. */
export function getDemoSrc(widget: WidgetEntry): string {
  if (!widget.demoUrl) return '';
  const [path, query = ''] = widget.demoUrl.split('?');
  const params = new URLSearchParams(query);
  for (const [key, value] of Object.entries(DEMO_PARAMS[widget.id] ?? {})) params.set(key, value);
  return `${path}?${params.toString()}`;
}
