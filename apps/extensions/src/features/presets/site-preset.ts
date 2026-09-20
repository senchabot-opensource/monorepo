import { useEffect, useRef, useSyncExternalStore } from 'react';
import { CLASSIC_PRESET, isClassic, normalizePresetId, PRESET_PARAM } from './registry';

// The preset every setup page starts with. It lives in this browser only: overlays read their
// preset from their own URL, since OBS runs them in a browser that never sees this storage.
const STORAGE_KEY = 'preset';
const CHANGE_EVENT = 'senchabot:preset';

export function readSitePreset(): string {
  if (typeof window === 'undefined') return CLASSIC_PRESET;
  try {
    return normalizePresetId(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return CLASSIC_PRESET;
  }
}

export function writeSitePreset(id: string) {
  try {
    if (isClassic(id)) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage blocked: the pick still applies to the page it was made on.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  // Another tab picked a default.
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** The default preset, classic while server rendering and until hydration. */
export function useSitePreset(): [string, (id: string) => void] {
  const preset = useSyncExternalStore(subscribe, readSitePreset, () => CLASSIC_PRESET);
  return [preset, writeSitePreset];
}

/**
 * Starts a setup page on the preset its link asks for (`?preset=`, from the presets page), else
 * the default, once it has mounted, so the prerendered page and the first client render agree.
 * Does nothing when that's classic.
 */
export function useStartOnSitePreset(apply: (id: string) => void) {
  const applyRef = useRef(apply);
  applyRef.current = apply;
  useEffect(() => {
    const linked = new URLSearchParams(window.location.search).get(PRESET_PARAM);
    const preset = linked === null ? readSitePreset() : normalizePresetId(linked);
    if (!isClassic(preset)) applyRef.current(preset);
  }, []);
}
