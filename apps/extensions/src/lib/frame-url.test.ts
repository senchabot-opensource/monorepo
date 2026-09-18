import { describe, expect, it } from 'vitest';
import {
  buildFramePreviewUrl,
  buildFrameUrl,
  DEFAULT_FRAME_SETTINGS,
  type FrameSettings,
  frameSizeFor,
  LABEL_MAX_LENGTH,
  parseFrameUrl,
  readFrameSettings,
} from './frame-url';

const ORIGIN = 'https://extensions.senchabot.com';

describe('buildFrameUrl', () => {
  it('needs no channel and always says which piece it frames', () => {
    expect(buildFrameUrl(ORIGIN, DEFAULT_FRAME_SETTINGS)).toBe(
      `${ORIGIN}/widgets/frame?piece=camera`,
    );
  });

  it('writes the preset and label, and drops the color a preset replaces', () => {
    const settings: FrameSettings = {
      preset: 'dynasty',
      piece: 'chat',
      orientation: 'landscape',
      color: 'gold',
      label: '  Sohbet ş ğ  ',
      motion: true,
    };
    const url = new URL(buildFrameUrl(ORIGIN, settings));
    expect(Object.fromEntries(url.searchParams)).toEqual({
      piece: 'chat',
      preset: 'dynasty',
      label: 'Sohbet ş ğ',
    });
    const classic = new URL(buildFrameUrl(ORIGIN, { ...settings, preset: 'classic' }));
    expect(classic.searchParams.get('color')).toBe('gold');
  });

  it('writes the animations only when they are off', () => {
    const url = new URL(buildFrameUrl(ORIGIN, { ...DEFAULT_FRAME_SETTINGS, motion: false }));
    expect(url.searchParams.get('motion')).toBe('0');
  });

  it('writes a portrait orientation only on a camera', () => {
    const portrait = { ...DEFAULT_FRAME_SETTINGS, orientation: 'portrait' } as const;
    expect(new URL(buildFrameUrl(ORIGIN, portrait)).searchParams.get('orientation')).toBe(
      'portrait',
    );
    const chat = new URL(buildFrameUrl(ORIGIN, { ...portrait, piece: 'chat' }));
    expect(chat.searchParams.has('orientation')).toBe(false);
  });

  it('previews the same frame with a stand-in inside', () => {
    const url = new URL(buildFramePreviewUrl(ORIGIN, DEFAULT_FRAME_SETTINGS));
    expect(Object.fromEntries(url.searchParams)).toEqual({ piece: 'camera', demo: '1' });
  });
});

describe('readFrameSettings', () => {
  it('falls back to the defaults for anything unknown', () => {
    const params = new URLSearchParams('piece=tv&color=teal&preset=nope');
    expect(readFrameSettings(params)).toEqual(DEFAULT_FRAME_SETTINGS);
  });

  it('cuts a long label', () => {
    const params = new URLSearchParams({ label: 'x'.repeat(LABEL_MAX_LENGTH + 10) });
    expect(readFrameSettings(params).label).toHaveLength(LABEL_MAX_LENGTH);
  });
});

describe('frameSizeFor', () => {
  it('turns only the camera upright', () => {
    expect(frameSizeFor({ piece: 'camera', orientation: 'portrait' })).toEqual({
      width: 360,
      height: 640,
    });
    expect(frameSizeFor({ piece: 'camera', orientation: 'landscape' })).toEqual({
      width: 640,
      height: 360,
    });
    expect(frameSizeFor({ piece: 'chat', orientation: 'portrait' })).toEqual({
      width: 420,
      height: 720,
    });
  });
});

describe('parseFrameUrl', () => {
  it('reads back what buildFrameUrl wrote', () => {
    const settings: FrameSettings = {
      preset: 'blocks',
      piece: 'screen',
      orientation: 'landscape',
      color: 'purple',
      label: 'LIVE',
      motion: false,
    };
    expect(parseFrameUrl(buildFrameUrl(ORIGIN, settings))).toEqual(settings);
  });

  it('reads back a portrait camera', () => {
    const settings: FrameSettings = { ...DEFAULT_FRAME_SETTINGS, orientation: 'portrait' };
    expect(parseFrameUrl(buildFrameUrl(ORIGIN, settings))).toEqual(settings);
  });

  it("is null for another widget's URL or text", () => {
    expect(parseFrameUrl(`${ORIGIN}/widgets/goal?twitch=me`)).toBeNull();
    expect(parseFrameUrl('not a url')).toBeNull();
  });
});
