import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LOCALES, type TranslationKey } from '#/lib/i18n';
import { headings, inLocale, section } from '#/test/queries';
import { renderRoute } from '#/test/render';

vi.mock('obs-websocket-js', () => import('#/test/fake-obs-websocket'));

interface PageCase {
  /** English path; Turkish pages get the /tr prefix, the tool page ?lang=tr. */
  path: string;
  title: TranslationKey;
  /** The settings tabs in order, on a page too long for one screen; the rest have none. */
  tabs?: TranslationKey[];
  sections: TranslationKey[];
  faq: TranslationKey[];
}

const PAGES: PageCase[] = [
  {
    path: '/setup/chat-widget',
    title: 'chatWidget.title',
    tabs: ['common.sectionAppearance', 'chatWidget.sectionMessages'],
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
    tabs: ['common.sectionAppearance', 'subathon.sectionTimer', 'subathon.sectionValues'],
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
    path: '/setup/counter',
    title: 'counter.title',
    tabs: ['counter.sectionCounters', 'common.sectionAppearance'],
    sections: [
      'common.sectionChannel',
      'counter.sectionCounters',
      'common.sectionAppearance',
      'counter.sectionCommands',
      'counter.previewTitle',
      'counter.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['counter.faq1Q', 'counter.faq2Q', 'counter.faq3Q', 'counter.faq4Q'],
  },
  {
    path: '/setup/event-list',
    title: 'eventList.title',
    tabs: ['eventList.sectionEvents', 'common.sectionAppearance'],
    sections: [
      'common.sectionChannel',
      'eventList.sectionEvents',
      'common.sectionAppearance',
      'eventList.sectionCommands',
      'eventList.previewTitle',
      'common.setup.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['eventList.faq1Q', 'eventList.faq2Q', 'eventList.faq3Q', 'eventList.faq4Q'],
  },
  {
    path: '/setup/end-credits',
    title: 'credits.title',
    tabs: ['credits.sectionRoll', 'common.sectionAppearance'],
    sections: [
      'common.sectionChannel',
      'credits.sectionRoll',
      'common.sectionAppearance',
      'credits.sectionCommands',
      'credits.previewTitle',
      'common.setup.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['credits.faq1Q', 'credits.faq2Q', 'credits.faq3Q', 'credits.faq4Q'],
  },
  {
    path: '/setup/viewer-queue',
    title: 'queue.title',
    tabs: ['queue.sectionQueue', 'common.sectionAppearance'],
    sections: [
      'common.sectionChannel',
      'queue.sectionQueue',
      'common.sectionAppearance',
      'queue.sectionCommands',
      'queue.previewTitle',
      'common.setup.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['queue.faq1Q', 'queue.faq2Q', 'queue.faq3Q', 'queue.faq4Q'],
  },
  {
    path: '/setup/top-supporters',
    title: 'leaderboard.title',
    tabs: ['leaderboard.sectionBoard', 'common.sectionAppearance'],
    sections: [
      'common.sectionChannel',
      'leaderboard.sectionBoard',
      'common.sectionAppearance',
      'leaderboard.sectionCommands',
      'leaderboard.previewTitle',
      'common.setup.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['leaderboard.faq1Q', 'leaderboard.faq2Q', 'leaderboard.faq3Q', 'leaderboard.faq4Q'],
  },
  {
    path: '/setup/lower-thirds',
    title: 'lowerThird.title',
    tabs: ['lowerThird.sectionText', 'common.sectionAppearance'],
    sections: [
      'common.sectionChannel',
      'lowerThird.sectionText',
      'common.sectionAppearance',
      'lowerThird.sectionCommands',
      'lowerThird.previewTitle',
      'common.setup.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['lowerThird.faq1Q', 'lowerThird.faq2Q', 'lowerThird.faq3Q', 'lowerThird.faq4Q'],
  },
  {
    path: '/setup/task-list',
    title: 'tasks.title',
    tabs: ['tasks.sectionList', 'common.sectionAppearance'],
    sections: [
      'common.sectionChannel',
      'tasks.sectionList',
      'common.sectionAppearance',
      'tasks.sectionCommands',
      'tasks.previewTitle',
      'common.setup.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['tasks.faq1Q', 'tasks.faq2Q', 'tasks.faq3Q', 'tasks.faq4Q'],
  },
  {
    path: '/setup/irl-hud',
    title: 'irlHud.title',
    tabs: [
      'common.sectionAppearance',
      'irlHud.sectionMap',
      'irlHud.sectionMoney',
      'irlHud.sectionMarket',
    ],
    sections: [
      'common.sectionChannel',
      'common.sectionAppearance',
      'irlHud.sectionMap',
      'irlHud.sectionMoney',
      'irlHud.sectionMarket',
      'irlHud.sectionCommands',
      'irlHud.previewTitle',
      'irlHud.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: [
      'irlHud.faq1Q',
      'irlHud.faq2Q',
      'irlHud.faq3Q',
      'irlHud.faq4Q',
      'irlHud.faq5Q',
      'irlHud.faq6Q',
      'irlHud.faq7Q',
    ],
  },
  {
    path: '/setup/weather',
    title: 'weather.title',
    sections: [
      'weather.sectionPlace',
      'common.sectionAppearance',
      'weather.sectionForecast',
      'weather.previewTitle',
      'weather.guideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['weather.faq1Q', 'weather.faq2Q', 'weather.faq3Q', 'weather.faq4Q', 'weather.faq5Q'],
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
    tabs: ['countdown.sectionCountdown', 'countdown.sectionText', 'common.sectionAppearance'],
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
    tabs: ['poll.sectionPoll', 'poll.sectionVoting', 'common.sectionAppearance'],
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
    tabs: ['common.sectionAppearance', 'streamAlerts.sectionAlerts', 'streamAlerts.sectionTiming'],
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
  {
    path: '/setup/spin-wheel',
    title: 'spinWheel.title',
    tabs: ['spinWheel.sectionOptions', 'common.sectionAppearance', 'spinWheel.sectionChat'],
    sections: [
      'common.sectionChannel',
      'spinWheel.sectionOptions',
      'common.sectionAppearance',
      'spinWheel.sectionChat',
      'spinWheel.sectionSound',
      'spinWheel.sectionCommands',
      'spinWheel.previewTitle',
      'common.setupGuideTitle',
      'common.faqTitle',
      'common.moreWidgets',
    ],
    faq: ['spinWheel.faq1Q', 'spinWheel.faq2Q', 'spinWheel.faq3Q', 'spinWheel.faq4Q'],
  },
  {
    path: '/tools/spin-wheel',
    title: 'spinWheel.toolTitle',
    sections: ['spinWheel.sectionOptions'],
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

    const settingsTabs = [...document.querySelectorAll('[role="tablist"]')].find(
      (list) => list.getAttribute('aria-label') === t('common.settingsSections'),
    );
    if (page.tabs) {
      const labels = [...(settingsTabs?.querySelectorAll('[role="tab"]') ?? [])];
      expect(labels.map((tab) => tab.textContent)).toEqual(page.tabs.map((key) => t(key)));
      // The channel boxes sit above the tabs, shown with every one of them.
      const channel = screen.getByLabelText(t('common.twitchChannel'), { selector: 'input' });
      expect(channel.closest('[role="tabpanel"]')).toBeNull();
    } else {
      expect(settingsTabs).toBeUndefined();
    }

    // Settings use the house controls only.
    expect(document.querySelectorAll('select, input[type="checkbox"]')).toHaveLength(0);

    if (page.faq.length > 0) {
      const faq = section(t('common.faqTitle'));
      const questions = [...faq.querySelectorAll('details > summary')].map((q) => q.textContent);
      expect(questions).toEqual(page.faq.map((key) => t(key)));
    }
  });
});
