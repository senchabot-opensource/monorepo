import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '#/features/widgets/chat-widget/widget-settings';
import { buildReaderUrl } from './reader-url';

const ORIGIN = 'https://extensions.senchabot.com';

describe('buildReaderUrl', () => {
  it('carries what decides which messages show, and none of the overlay look', () => {
    const url = buildReaderUrl(
      ORIGIN,
      {
        ...DEFAULT_SETTINGS,
        bttv: false,
        badges: false,
        hideBots: true,
        highlights: ['mention'],
        font: 'mono',
        fontSize: '30',
        layout: 'card',
        duration: 'keep',
        background: true,
      },
      'Streamer',
      'Streamer_TR',
    );
    expect(url).toBe(
      `${ORIGIN}/tools/chat-reader?twitch=streamer&kick=streamer_tr&bttv=false&badges=false&hideBots=true&highlights=mention`,
    );
  });

  it('follows the platform choice', () => {
    const url = buildReaderUrl(ORIGIN, { ...DEFAULT_SETTINGS, platforms: 'kick' }, 'a', 'b');
    expect(url).toBe(`${ORIGIN}/tools/chat-reader?kick=b`);
  });

  it('is empty until there is a channel', () => {
    expect(buildReaderUrl(ORIGIN, DEFAULT_SETTINGS, ' ', '')).toBe('');
  });
});
