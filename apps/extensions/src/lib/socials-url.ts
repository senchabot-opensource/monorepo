import { CLASSIC_PRESET, isClassic, normalizePresetId } from '#/features/presets/registry';

/**
 * Where the bubble sits in the browser source. `center` floats it, as before; `left` and `right`
 * put it against that edge with square corners there, for a source placed at the scene's edge.
 */
export const SOCIALS_ALIGNS = ['center', 'left', 'right'] as const;
export type SocialsAlign = (typeof SOCIALS_ALIGNS)[number];

export interface SocialsSettings {
  twitter: string;
  youtube: string;
  instagram: string;
  tiktok: string;
  twitch: string;
  kick: string;
  discord: string;
  github: string;
  reddit: string;
  bluesky: string;
  threads: string;
  linkedin: string;
  animation: string;
  interval: string;
  textColor: string;
  pillColor: string;
  align: SocialsAlign;
  /** Preset id; any preset but classic brings its own colors, fonts and frame. */
  preset: string;
}

export const DEFAULT_SOCIALS_SETTINGS: SocialsSettings = {
  twitter: '',
  youtube: '',
  instagram: '',
  tiktok: '',
  twitch: '',
  kick: '',
  discord: '',
  github: '',
  reddit: '',
  bluesky: '',
  threads: '',
  linkedin: '',
  animation: 'slideUp',
  interval: '10',
  textColor: '#ffffff',
  pillColor: 'rgba(0, 0, 0, 0.5)',
  align: 'center',
  preset: CLASSIC_PRESET,
};

/** The align a URL asks for; missing or unknown is center, so older URLs look the same. */
export function readSocialsAlign(value: string | null | undefined): SocialsAlign {
  return SOCIALS_ALIGNS.find((align) => align === value) ?? DEFAULT_SOCIALS_SETTINGS.align;
}

// A preset brings its own colors, so the color fields stay out of its URL.
const COLOR_KEYS = new Set<string>(['textColor', 'pillColor']);

export function buildSocialsUrl(origin: string, settings: SocialsSettings): string {
  const url = new URL('/widgets/socials', origin);
  const preset = normalizePresetId(settings.preset);
  for (const [key, value] of Object.entries({ ...settings, preset })) {
    if (!isClassic(preset) && COLOR_KEYS.has(key)) continue;
    if (value && value !== DEFAULT_SOCIALS_SETTINGS[key as keyof SocialsSettings]) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

export function buildSocialsPreviewUrl(
  origin: string,
  settings: SocialsSettings,
  demo: boolean = true,
): string {
  const url = new URL(buildSocialsUrl(origin, settings));
  if (demo) {
    url.searchParams.set('demo', '1');
  }
  return url.toString();
}

export function parseSocialsUrl(urlStr: string): SocialsSettings | null {
  try {
    const url = new URL(urlStr);
    if (!url.pathname.includes('/widgets/socials')) return null;

    const settings: SocialsSettings = { ...DEFAULT_SOCIALS_SETTINGS };
    for (const key of Object.keys(settings)) {
      const val = url.searchParams.get(key);
      if (val !== null) {
        (settings as any)[key] = val;
      }
    }
    settings.align = readSocialsAlign(settings.align);
    settings.preset = normalizePresetId(settings.preset);
    return settings;
  } catch {
    return null;
  }
}
