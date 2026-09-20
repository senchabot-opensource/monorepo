import { describe, expect, it, vi } from 'vitest';
import { LOCALES, type TranslationKey } from '#/lib/i18n';
import { headings, inLocale, section } from '#/test/queries';
import { renderRoute } from '#/test/render';

vi.mock('obs-websocket-js', () => import('#/test/fake-obs-websocket'));

interface PageCase {
  /** English path; Turkish pages get the /tr prefix, the tool page ?lang=tr. */
  path: string;
  title: TranslationKey;
  sections: TranslationKey[];
  faq: TranslationKey[];
}

const PAGES: PageCase[] = [
  {
    path: '/setup/chat-widget',
    title: 'chatWidget.title',
    sections: [
      'common.sectionChannel',
      'common.sectionAppearance',
      'chatWidget.sectionMessages',
      'chatWidget.previewTitle',
      'chatWidget.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['chatWidget.faq1Q', 'chatWidget.faq2Q'],
  },
  {
    path: '/setup/emote-wall',
    title: 'emoteWallSetup.title',
    sections: [
      'common.sectionChannel',
      'emoteWallSetup.sectionAnimation',
      'emoteWallSetup.sectionFilters',
      'emoteWallSetup.previewTitle',
      'emoteWallSetup.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['emoteWallSetup.faq1Q', 'emoteWallSetup.faq2Q'],
  },
  {
    path: '/setup/sub-growing-plant',
    title: 'subSprout.title',
    sections: [
      'common.sectionChannel',
      'subSprout.sectionPlant',
      'subSprout.previewTitle',
      'subSprout.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['subSprout.faq1Q', 'subSprout.faq2Q', 'subSprout.faq3Q'],
  },
  {
    path: '/setup/subathon-timer',
    title: 'subathon.title',
    sections: [
      'common.sectionChannel',
      'common.sectionAppearance',
      'subathon.sectionTimer',
      'subathon.sectionValues',
      'subathon.sectionCommands',
      'subathon.previewTitle',
      'subathon.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['subathon.faq1Q', 'subathon.faq2Q', 'subathon.faq3Q', 'subathon.faq4Q'],
  },
  {
    path: '/setup/sub-goal',
    title: 'goal.title',
    sections: [
      'common.sectionChannel',
      'goal.sectionGoal',
      'common.sectionAppearance',
      'goal.sectionCommands',
      'goal.previewTitle',
      'goal.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['goal.faq1Q', 'goal.faq2Q', 'goal.faq3Q', 'goal.faq4Q'],
  },
  {
    path: '/setup/stream-frames',
    title: 'frames.title',
    sections: [
      'frames.sectionPiece',
      'common.sectionAppearance',
      'frames.previewTitle',
      'frames.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['frames.faq1Q', 'frames.faq2Q', 'frames.faq3Q', 'frames.faq4Q'],
  },
  {
    path: '/setup/stream-countdown',
    title: 'countdown.title',
    sections: [
      'countdown.sectionCountdown',
      'common.sectionChannel',
      'common.sectionAppearance',
      'countdown.sectionText',
      'countdown.sectionCommands',
      'countdown.previewTitle',
      'countdown.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['countdown.faq1Q', 'countdown.faq2Q', 'countdown.faq3Q', 'countdown.faq4Q'],
  },
  {
    path: '/setup/chat-poll',
    title: 'poll.title',
    sections: [
      'common.sectionChannel',
      'poll.sectionPoll',
      'poll.sectionVoting',
      'common.sectionAppearance',
      'poll.sectionCommands',
      'poll.previewTitle',
      'poll.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['poll.faq1Q', 'poll.faq2Q', 'poll.faq3Q', 'poll.faq4Q', 'poll.faq5Q'],
  },
  {
    path: '/setup/stream-alerts',
    title: 'streamAlerts.title',
    sections: [
      'common.sectionChannel',
      'common.sectionAppearance',
      'streamAlerts.sectionAlerts',
      'streamAlerts.sectionTiming',
      'streamAlerts.previewTitle',
      'streamAlerts.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['streamAlerts.faq1Q', 'streamAlerts.faq2Q', 'streamAlerts.faq3Q', 'streamAlerts.faq4Q'],
  },
  {
    path: '/setup/raffle',
    title: 'raffle.title',
    sections: [
      'common.sectionChannel',
      'raffle.sectionRules',
      'raffle.controlTitle',
      'common.setupGuideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['raffle.faq1Q', 'raffle.faq2Q', 'raffle.faq3Q'],
  },
  {
    path: '/setup/obs-bridge',
    title: 'obsBridge.title',
    sections: [
      'obsBridge.sectionChannels',
      'obsBridge.sectionUsers',
      'obsBridge.sectionCommands',
      'obsBridge.sectionConnection',
      'obsBridge.previewTitle',
      'common.setupGuideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['obsBridge.faq1Q', 'obsBridge.faq2Q', 'obsBridge.faq3Q'],
  },
  {
    path: '/tools/obs-bridge',
    title: 'obsBridge.tool.title',
    sections: ['obsBridge.tool.scenesTitle', 'obsBridge.tool.commands'],
    faq: [],
  },
];

const urlFor = (path: string, locale: string) =>
  path.startsWith('/tools/')
    ? `${path}?lang=${locale}`
    : locale === 'en'
      ? path
      : `/${locale}${path}`;

describe.each(LOCALES)('setup and tool pages in %s', (locale) => {
  const t = inLocale(locale);

  it.each(PAGES)('$path renders its outline in the page language', async (page) => {
    await renderRoute(urlFor(page.path, locale));

    expect(headings(1)).toEqual([t(page.title)]);
    expect(document.documentElement.lang).toBe(locale);

    const h2s = headings(2);
    for (const key of page.sections) expect(h2s).toContain(t(key));

    // Settings use the house controls only.
    expect(document.querySelectorAll('select, input[type="checkbox"]')).toHaveLength(0);

    if (page.faq.length > 0) {
      const faq = section(t('common.faqTitle'));
      const questions = [...faq.querySelectorAll('details > summary')].map((q) => q.textContent);
      expect(questions).toEqual(page.faq.map((key) => t(key)));
    }
  });
});
