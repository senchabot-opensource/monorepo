import { getWidget, type SourceSize, type WidgetEntry, type WidgetId } from '#/lib/widgets';
import { isClassic, PRESET_PARAM } from './registry';

/** Widgets whose overlay reads a preset; Emote Wall and Sub Sprout keep their own art. */
export const PRESET_WIDGET_IDS = [
  'chat-box',
  'stream-alerts',
  'goal',
  'subathon',
  'poll',
  'raffle',
  'frames',
  'countdown',
] as const satisfies readonly WidgetId[];

export const PRESET_WIDGETS: readonly WidgetEntry[] = PRESET_WIDGET_IDS.map(getWidget);

const PRESET_PATHS = new Set<string>(PRESET_WIDGETS.map((widget) => widget.widgetPath));

// Chat Box and the raffle winner fill any size, and at their OBS size they'd be a speck in a
// 16:10 card, so the presets page gives them a card-shaped canvas instead.
const CARD_CANVAS: Partial<Record<WidgetId, SourceSize>> = {
  'chat-box': { width: 520, height: 325 },
  raffle: { width: 1120, height: 700 },
};

/** The size a preview card renders the widget at. */
export const presetCanvas = (widget: WidgetEntry): SourceSize | undefined =>
  CARD_CANVAS[widget.id] ?? widget.sourceSize ?? undefined;

/** A self-running demo of the widget in a preset. Raffle has no demo of its own, only this one. */
export function presetDemoUrl(widget: WidgetEntry, preset: string): string {
  const url = new URL(widget.demoUrl ?? `${widget.widgetPath}?demo=1`, 'http://demo.invalid');
  if (!isClassic(preset)) url.searchParams.set(PRESET_PARAM, preset);
  return `${url.pathname}${url.search}`;
}

export type RethemedUrl =
  | { status: 'ok'; url: string }
  | { status: 'unsupported' | 'invalid'; url: string };

/**
 * A widget URL already in OBS, given the preset: the param is set, or dropped for classic.
 * Every other param is kept byte for byte, since re-encoding the query would turn spaces into
 * "+", which the router reads back as a plus sign.
 */
export function applyPresetToUrl(text: string, preset: string): RethemedUrl {
  const input = text.trim();
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return { status: 'invalid', url: input };
  }
  const path = url.pathname.replace(/\/+$/, '');
  if (!PRESET_PATHS.has(path)) {
    const ours = path.startsWith('/widgets/') || path.startsWith('/tools/');
    return { status: ours ? 'unsupported' : 'invalid', url: input };
  }
  const kept = url.search
    .slice(1)
    .split('&')
    .filter((part) => part && part.split('=')[0] !== PRESET_PARAM);
  if (!isClassic(preset)) kept.push(`${PRESET_PARAM}=${encodeURIComponent(preset)}`);
  url.search = kept.length ? `?${kept.join('&')}` : '';
  return { status: 'ok', url: url.toString() };
}
