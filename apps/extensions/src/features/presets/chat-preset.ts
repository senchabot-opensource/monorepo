import { useEffect, useMemo, useState } from 'react';
import { onModCommand } from '#/lib/mod-commands';
import { readFlag } from '#/lib/url-params';
import { CLASSIC_PRESET, findPreset, PRESETS } from './registry';

/**
 * The chat command that redraws the overlays in another preset: "!preset blocks", by the
 * preset's id, its name or the game it's made for ("!preset minecraft"). "!preset reset" goes
 * back to each overlay's own.
 */
export const PRESET_COMMAND = '!preset';
export const PRESET_RESET = 'reset';

// Letters and digits only: "Counter-Strike 2", "counter strike 2" and "CounterStrike2" are one.
const squash = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

/** The preset some words name, by id, name or game: its id, `classic`, or null for none. */
export function presetNamed(words: string): string | null {
  const key = squash(words);
  if (!key) return null;
  if (key === CLASSIC_PRESET) return CLASSIC_PRESET;
  const named = PRESETS.find(({ data }) =>
    [data.id, data.name, data.game].some((value) => value !== undefined && squash(value) === key),
  );
  return named?.data.id ?? null;
}

export type PresetCommand = { kind: 'pick'; preset: string } | { kind: 'reset' };

/** What a chat message asks of the preset, or null when it's no !preset or names no preset. */
export function readPresetCommand(text: string): PresetCommand | null {
  const [typed = '', ...words] = text.trim().split(/\s+/);
  if (typed.toLowerCase() !== PRESET_COMMAND || words.length === 0) return null;
  if (words.length === 1 && words[0].toLowerCase() === PRESET_RESET) return { kind: 'reset' };
  const preset = presetNamed(words.join(' '));
  return preset ? { kind: 'pick', preset } : null;
}

/**
 * Storage key per channel pair and URL preset, like the Weather toggle's: a reload or an OBS
 * restart keeps the pick, and a URL set to another preset since starts on its own.
 */
export const chatPresetKey = (preset: string, twitch = '', kick = '') =>
  `senchabot.preset:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}:${preset}`;

function loadPick(key: string | null): string | null {
  if (!key) return null;
  try {
    const saved = window.localStorage.getItem(key);
    // A community preset removed since falls back to the URL's.
    return saved === CLASSIC_PRESET || findPreset(saved) ? saved : null;
  } catch {
    return null;
  }
}

function savePick(key: string, pick: string | null) {
  try {
    if (pick === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, pick);
  } catch {
    // Storage blocked: the pick holds until the overlay reloads.
  }
}

interface ChatPresetOptions {
  twitch?: string;
  kick?: string;
  /** False in setup previews and demos, which show the preset their page picks. */
  enabled?: boolean;
}

/**
 * The preset an overlay draws in: the one its URL names, until a mod picks another with !preset
 * in a chat the overlay reads. It needs no chat of its own: every chat reader of the page passes
 * on mod commands, so an overlay that reads no chat keeps its URL's preset.
 */
export function useChatPreset(
  preset: string,
  { twitch, kick, enabled = true }: ChatPresetOptions,
): string {
  const key =
    enabled && (twitch?.trim() || kick?.trim()) ? chatPresetKey(preset, twitch, kick) : null;
  const [state, setState] = useState(() => ({ key, pick: loadPick(key) }));
  // Another preset or channel in the URL starts on its own pick.
  let { pick } = state;
  if (state.key !== key) {
    pick = loadPick(key);
    setState({ key, pick });
  }

  useEffect(() => {
    if (!key) return;
    return onModCommand((command) => {
      const asked = readPresetCommand(command.text);
      if (!asked) return;
      // Its own preset is no pick: the URL draws it anyway, and a reset finds nothing to undo.
      const next = asked.kind === 'pick' && asked.preset !== preset ? asked.preset : null;
      savePick(key, next);
      setState({ key, pick: next });
    });
  }, [key, preset]);

  return pick ?? preset;
}

/**
 * An overlay's settings as its route read them from the URL, in the preset a mod picked from
 * chat; the same object until one does. Setup previews (`preview`) and demos stay on the URL's.
 */
export function useChatPresetSettings<S extends { preset: string }>(
  settings: S,
  params: URLSearchParams,
): S {
  const text = (name: string) => params.get(name)?.trim() || undefined;
  const preset = useChatPreset(settings.preset, {
    twitch: text('twitch'),
    kick: text('kick'),
    enabled:
      !text('preview') &&
      !readFlag(params.get('simulate'), false) &&
      !readFlag(params.get('demo'), false),
  });
  return useMemo(
    () => (preset === settings.preset ? settings : { ...settings, preset }),
    [settings, preset],
  );
}
