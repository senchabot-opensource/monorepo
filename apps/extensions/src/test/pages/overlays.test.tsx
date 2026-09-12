import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applyTheme } from '#/lib/theme';
import { setReducedMotion } from '#/test/browser';
import { button, en, inLocale, textbox } from '#/test/queries';
import { renderRoute, setupUser } from '#/test/render';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const OVERLAYS = [
  '/widgets/chat-widget?mock=true',
  '/widgets/emote-wall?mock=true',
  '/widgets/sub-sprout-widget?simulate=true',
  '/widgets/raffle-overlay',
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

/** jsdom has no layout; give the preview box a size so scaled canvases mount. */
function withLayout(width: number, height: number) {
  const width_ = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
  const height_ = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => width,
  });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get: () => height,
  });
  return () => {
    if (width_) Object.defineProperty(HTMLElement.prototype, 'clientWidth', width_);
    if (height_) Object.defineProperty(HTMLElement.prototype, 'clientHeight', height_);
  };
}

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
    expect(new URL(frame.src).searchParams.get('twitch')).toBe('streamer');
  });

  it('scales the Emote Wall demo down from its 1920×1080 canvas', async () => {
    const restore = withLayout(960, 540);
    try {
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
    } finally {
      restore();
    }
  });

  it('waits for a Play click before running the Sub Sprout demo with reduced motion', async () => {
    const restore = withLayout(800, 600);
    try {
      setReducedMotion(true);
      const user = setupUser();
      await renderRoute('/setup/sub-growing-plant');
      expect(screen.queryByTitle(en('subSprout.previewIframeTitle'))).toBeNull();

      await user.click(button(en('common.playPreview')));
      const frame = screen.getByTitle(en('subSprout.previewIframeTitle')) as HTMLIFrameElement;
      const src = new URL(frame.src);
      expect(src.pathname).toBe('/widgets/sub-sprout-widget');
      expect(src.searchParams.get('simulate')).toBe('1');
      expect(src.searchParams.get('lang')).toBe('en');
    } finally {
      restore();
    }
  });
});
