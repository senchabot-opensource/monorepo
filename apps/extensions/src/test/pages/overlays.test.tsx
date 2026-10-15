import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { findPreset } from '#/features/presets/registry';
import { applyTheme } from '#/lib/theme';
import { setReducedMotion, withLayout } from '#/test/browser';
import { en, inLocale, textbox } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const OVERLAYS = [
  '/widgets/chat-widget?mock=true',
  '/widgets/emote-wall?mock=true',
  '/widgets/sub-sprout-widget?simulate=true',
  '/widgets/subathon?simulate=1',
  '/widgets/stream-alerts?simulate=1',
  '/widgets/goal?simulate=1',
  '/widgets/counter?simulate=1',
  '/widgets/event-list?simulate=1',
  '/widgets/credits?simulate=1',
  '/widgets/queue?simulate=1',
  '/widgets/leaderboard?simulate=1',
  '/widgets/lower-third?simulate=1&title=E2E',
  '/widgets/tasks?simulate=1',
  '/widgets/now-playing?demo=1',
  '/widgets/emote-combo?simulate=1',
  '/widgets/featured?simulate=1',
  '/widgets/goal?simulate=1&type=bits',
  '/widgets/frame?demo=1&preset=flower',
  '/widgets/countdown?simulate=1',
  '/widgets/poll?simulate=1',
  '/widgets/weather?demo=1',
  '/widgets/raffle-overlay',
  // Presets with an effect, and one with it switched off.
  '/widgets/goal?simulate=1&preset=banner',
  '/widgets/stream-alerts?simulate=1&preset=glitch',
  '/widgets/poll?simulate=1&preset=glitch&fx=0',
  '/widgets/frame?demo=1&preset=banner',
  '/widgets/socials?demo=1&preset=glitch',
  // Drawn in a site font instead of the preset's, one loaded from Google Fonts and one not.
  '/widgets/goal?simulate=1&preset=banner&font=mono',
  '/widgets/socials?demo=1&preset=blocks&font=system',
  '/widgets/raffle-overlay?demo=1&preset=flower&font=nunito',
];

beforeEach(() => {
  // The overlays log their demo and connection activity.
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('overlay routes', () => {
  it.each(OVERLAYS)('%s renders without the site chrome or theme', async (url) => {
    localStorage.setItem('theme', 'dark');
    await renderRoute(url);

    expect(screen.queryAllByRole('banner')).toHaveLength(0);
    expect(screen.queryByRole('contentinfo')).toBeNull();
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.queryByRole('link', { name: en('common.skipToContent') })).toBeNull();
    const html = document.documentElement;
    expect(html.classList.contains('dark')).toBe(false);
    expect(html.style.colorScheme).toBe('');
    expect(document.body.classList.contains('font-widget')).toBe(true);
  });
});

describe("a preset's effect in Chat Box", () => {
  it('comes in with each line', async () => {
    await renderRoute('/widgets/chat-widget?mock=true&preset=glitch');
    await screen.findByText(/MonkeyDLuffy/, {}, { timeout: 8000 });
    expect(document.querySelector('[data-fx="glitch"][data-fx-part="pulse"]')).toBeTruthy();
  });

  it('plays nothing with fx=0', async () => {
    await renderRoute('/widgets/chat-widget?mock=true&preset=glitch&fx=0');
    await screen.findByText(/MonkeyDLuffy/, {}, { timeout: 8000 });
    expect(document.querySelector('[data-fx]')).toBeNull();
  });
});

describe("Chat Box's own font param under a preset", () => {
  // Chat Box had `font` before presets could take a site font, so it keeps its own meaning there:
  // the message font, with the preset's two fonts still loaded for the rest.
  it("draws the messages in it and leaves the preset's fonts alone", async () => {
    await renderRoute('/widgets/chat-widget?mock=true&preset=glitch&font=mono');
    await screen.findByText(/MonkeyDLuffy/, {}, { timeout: 8000 });
    const families = [...document.querySelectorAll<HTMLElement>('[style*="font-family"]')].map(
      (element) => element.style.fontFamily,
    );
    expect(families.some((family) => family.includes('JetBrains Mono'))).toBe(true);
    // The names keep the preset's own display font, which a preset `font` would have replaced.
    const display = findPreset('glitch')?.data.fonts.display.family ?? '';
    expect(families.some((family) => family.includes(display))).toBe(true);
  });
});

describe('a Kick-only overlay whose channel lookup fails', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('never shows demo chat in Chat Box', async () => {
    await renderRoute('/widgets/chat-widget?kick=streamer');
    await act(async () => vi.advanceTimersByTime(10_000));
    expect(document.body.textContent).not.toContain('MonkeyDLuffy');
  });

  it('never shows demo emotes in Emote Wall', async () => {
    await renderRoute('/widgets/emote-wall?kick=streamer');
    await act(async () => vi.advanceTimersByTime(10_000));
    expect(document.querySelectorAll('img')).toHaveLength(0);
  });
});

describe('applyTheme', () => {
  const html = document.documentElement;

  it('leaves overlays alone', () => {
    window.history.replaceState(null, '', '/widgets/emote-wall?mock=true');
    applyTheme('dark');
    expect(html.classList.contains('dark')).toBe(false);
    expect(html.style.colorScheme).toBe('');
    applyTheme('light');
    expect(html.style.colorScheme).toBe('');
  });

  it.each(['/setup/emote-wall', '/tr/faq', '/tools/obs-bridge'])('themes %s', (path) => {
    window.history.replaceState(null, '', path);
    applyTheme('dark');
    expect(html.classList.contains('dark')).toBe(true);
    expect(html.style.colorScheme).toBe('dark');
    applyTheme('light');
    expect(html.classList.contains('dark')).toBe(false);
    expect(html.style.colorScheme).toBe('light');
  });
});

describe('setup page previews', () => {
  it.each([
    'en',
    'tr',
  ] as const)('frame the Chat Box demo theme-neutral, without scrollbars, in the page language (%s)', async (locale) => {
    const t = inLocale(locale);
    const user = setupUser();
    await renderRoute(locale === 'en' ? '/setup/chat-widget' : '/tr/setup/chat-widget');

    const frame = screen.getByTitle(t('chatWidget.previewIframeTitle')) as HTMLIFrameElement;
    expect(frame.tagName).toBe('IFRAME');
    expect(frame.style.colorScheme).toBe('normal');
    expect(frame.getAttribute('scrolling')).toBe('no');
    const src = new URL(frame.src);
    expect(src.pathname).toBe('/widgets/chat-widget');
    expect(src.searchParams.get('mock')).toBe('true');
    expect(src.searchParams.getAll('lang')).toEqual([locale]);

    // The URL for OBS never carries the page language.
    await user.type(textbox(t('common.twitchChannel')), 'streamer');
    expect(textbox(t('common.widgetUrl')).value).toBe(
      'http://localhost:3000/widgets/chat-widget?twitch=streamer',
    );
    // The preview joins the channel it names, so it waits for typing to pause.
    expect(new URL(frame.src).searchParams.has('twitch')).toBe(false);
    await vi.waitFor(() => expect(new URL(frame.src).searchParams.get('twitch')).toBe('streamer'));
  });

  it('scales the Emote Wall demo down from its 1920×1080 canvas', async () => {
    withLayout(960, 540);
    await renderRoute('/tr/setup/emote-wall');
    const frame = screen.getByTitle(inLocale('tr')('emoteWallSetup.previewIframeTitle'));
    const src = new URL((frame as HTMLIFrameElement).src);
    expect(src.searchParams.get('mock')).toBe('true');
    expect(src.searchParams.get('lang')).toBe('tr');
    expect(frame.style.width).toBe('1920px');
    expect(frame.style.height).toBe('1080px');
    expect(frame.style.transform).toBe('translate(-50%, -50%) scale(0.5)');
    expect(frame.style.colorScheme).toBe('normal');
    expect(frame.getAttribute('scrolling')).toBe('no');
  });

  it('runs the Sub Sprout demo right away, even with reduced motion', async () => {
    withLayout(800, 600);
    setReducedMotion(true);
    await renderRoute('/setup/sub-growing-plant');
    const frame = screen.getByTitle(en('subSprout.previewIframeTitle')) as HTMLIFrameElement;
    const src = new URL(frame.src);
    expect(src.pathname).toBe('/widgets/sub-sprout-widget');
    expect(src.searchParams.get('simulate')).toBe('1');
    expect(src.searchParams.get('lang')).toBe('en');
  });
});
