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
};

export function buildSocialsUrl(origin: string, settings: SocialsSettings): string {
  const url = new URL('/widgets/socials', origin);
  for (const [key, value] of Object.entries(settings)) {
    if (value && value !== DEFAULT_SOCIALS_SETTINGS[key as keyof SocialsSettings]) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

export function buildSocialsPreviewUrl(origin: string, settings: SocialsSettings, demo: boolean = true): string {
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
    return settings;
  } catch {
    return null;
  }
}
