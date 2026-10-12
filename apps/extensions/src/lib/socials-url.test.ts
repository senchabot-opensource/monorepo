import { describe, expect, it } from 'vitest';
import {
  buildSocialsUrl,
  DEFAULT_SOCIALS_SETTINGS,
  parseSocialsUrl,
  readSocialsAlign,
} from './socials-url';

const ORIGIN = 'https://extensions.senchabot.com';

describe('Socials URL', () => {
  it('reads a URL from before align and presets as centered and classic, and writes it back as it was', () => {
    const old = `${ORIGIN}/widgets/socials?twitter=me&animation=fade&textColor=%23ff0000`;
    const settings = parseSocialsUrl(old);
    expect(settings).toMatchObject({ align: 'center', preset: 'classic', textColor: '#ff0000' });
    expect(buildSocialsUrl(ORIGIN, settings ?? DEFAULT_SOCIALS_SETTINGS)).toBe(old);
  });

  it('writes left and right, and leaves the default center out', () => {
    for (const align of ['left', 'right'] as const) {
      const url = buildSocialsUrl(ORIGIN, { ...DEFAULT_SOCIALS_SETTINGS, twitter: 'me', align });
      expect(url).toBe(`${ORIGIN}/widgets/socials?twitter=me&align=${align}`);
      expect(parseSocialsUrl(url)?.align).toBe(align);
    }
    expect(buildSocialsUrl(ORIGIN, { ...DEFAULT_SOCIALS_SETTINGS, twitter: 'me' })).toBe(
      `${ORIGIN}/widgets/socials?twitter=me`,
    );
  });

  it('writes a preset without the color fields it replaces', () => {
    const settings = {
      ...DEFAULT_SOCIALS_SETTINGS,
      twitter: 'me',
      textColor: '#ff0000',
      pillColor: '#000000',
      preset: 'rift',
    };
    const url = buildSocialsUrl(ORIGIN, settings);
    expect(url).toBe(`${ORIGIN}/widgets/socials?twitter=me&preset=rift`);
    expect(parseSocialsUrl(url)?.preset).toBe('rift');
    expect(buildSocialsUrl(ORIGIN, { ...settings, preset: 'classic' })).toBe(
      `${ORIGIN}/widgets/socials?twitter=me&textColor=%23ff0000&pillColor=%23000000`,
    );
  });

  it('reads an unknown align as center and an unknown preset as classic', () => {
    expect(readSocialsAlign('top')).toBe('center');
    expect(readSocialsAlign(null)).toBe('center');
    const settings = parseSocialsUrl(`${ORIGIN}/widgets/socials?twitter=me&align=top&preset=gone`);
    expect(settings).toMatchObject({ align: 'center', preset: 'classic' });
    expect(buildSocialsUrl(ORIGIN, settings ?? DEFAULT_SOCIALS_SETTINGS)).toBe(
      `${ORIGIN}/widgets/socials?twitter=me`,
    );
  });
});
