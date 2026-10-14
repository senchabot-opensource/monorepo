import { useCallback, useEffect, useState } from 'react';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import { isHudCommand } from '../irl-hud/hud-money';
import type { SubathonEvent } from '../subathon/subathon-events';
import { useSubEvents } from '../subathon/use-sub-events';
import { PREVIEW_CHANNEL, type PreviewMessage } from './use-weather';

/** The word after the IRL HUD's command that means the weather beside it. */
export const WEATHER_PART = 'weather';

/**
 * A plain "!hud weather" or "!h weather": the IRL HUD's own command, so one set of commands runs
 * the whole IRL scene. With anything after it, it's not this one.
 */
export function isWeatherToggle(message: string): boolean {
  const [typed, word = '', ...rest] = message.trim().split(/\s+/);
  return isHudCommand(typed) && word.toLowerCase() === WEATHER_PART && rest.length === 0;
}

/** Storage key per channel pair, so a reload or a restart of OBS keeps it hidden. */
export const toggleStorageKey = (twitch = '', kick = '') =>
  `senchabot.weather:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

function loadHidden(key: string | null): boolean {
  if (!key) return false;
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) ?? 'null') as {
      hidden?: unknown;
    } | null;
    return saved?.hidden === true;
  } catch {
    return false;
  }
}

interface UseWeatherToggleOptions {
  twitch?: string;
  kick?: string;
  previewId?: string;
}

/**
 * Whether you or your mods hid the weather with !h weather. Chat is read only when the URL
 * names a channel; without one the weather always shows, as before channels.
 */
export function useWeatherToggle({ twitch, kick, previewId }: UseWeatherToggleOptions): boolean {
  const listening = Boolean(twitch?.trim() || kick?.trim());
  const key = listening ? toggleStorageKey(twitch, kick) : null;
  const [hidden, setHidden] = useState(() => loadHidden(key));

  useEffect(() => {
    if (!key) return;
    try {
      window.localStorage.setItem(key, JSON.stringify({ hidden }));
    } catch {
      // Storage blocked: the toggle still works, it just won't survive a reload.
    }
  }, [key, hidden]);

  const handleEvent = useCallback((event: SubathonEvent) => {
    if (event.kind === 'mod' && isWeatherToggle(event.text)) setHidden((value) => !value);
  }, []);
  useSubEvents(twitch, kick, listening, handleEvent);

  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, true, (message) => {
    if (message.type === 'toggle') setHidden((value) => !value);
  });

  return hidden;
}
