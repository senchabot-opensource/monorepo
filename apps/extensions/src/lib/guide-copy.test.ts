import { describe, expect, it } from 'vitest';
import { shouldAcceptEntry } from '#/hooks/use-raffle-chat';
import { GUIDES, type GuideId } from './guides';
import { en } from './i18n/en';
import { type Locale, translate } from './i18n/index';
import { LOCALES } from './i18n/locales';
import { tr } from './i18n/tr';
import { WIDGETS, type WidgetEntry } from './widgets';

const DICTS = { en, tr } as const;

// Raffle runs on one platform and keeps its rules in the browser, and OBS Bridge ties each
// command user to a platform; every other widget reopens a pasted URL, and all of those but
// Stream Frames, which reads no chat, take both channels.
const PASTE_WIDGETS = WIDGETS.filter(
  (widget) => widget.id !== 'raffle' && widget.id !== 'obs-bridge',
);
const BOTH_CHANNEL_WIDGETS = PASTE_WIDGETS.filter((widget) => widget.id !== 'frames');

const missingIn = (widgets: readonly WidgetEntry[], text: string, locale: Locale) =>
  widgets
    .filter((widget) => !text.includes(translate(locale, widget.nameKey)))
    .map((widget) => widget.id);
const namesIn = (text: string, locale: Locale) => missingIn(BOTH_CHANNEL_WIDGETS, text, locale);
const pasteNamesIn = (text: string, locale: Locale) => missingIn(PASTE_WIDGETS, text, locale);

/** A field label without its unit, e.g. "Minimum Duration (s)" → "Minimum Duration". */
const withoutUnit = (label: string) => label.replace(/\s*\([^)]*\)$/, '');

describe.each(LOCALES)('guide and FAQ copy in %s', (locale) => {
  const dict = DICTS[locale];

  it('names every widget that takes a Twitch and a Kick channel in one URL', () => {
    expect(namesIn(dict.home.faq4A, locale)).toEqual([]);
    expect(namesIn(dict.faqPage.platformsA, locale)).toEqual([]);
  });

  it('names every widget whose setup page reopens a pasted URL', () => {
    expect(pasteNamesIn(dict.home.faq5A, locale)).toEqual([]);
    expect(pasteNamesIn(dict.faqPage.editA, locale)).toEqual([]);
    expect(pasteNamesIn(dict.guides.obs.update.p2, locale)).toEqual([]);
  });

  it('names the Raffle rules the way the setup page labels them', () => {
    const rules = dict.guides.raffle.rules;
    const setup = dict.raffle;
    expect(
      [rules.subsOnly, rules.minMonths, rules.maxWins, rules.minDuration].map(withoutUnit),
    ).toEqual(
      [setup.subscribersOnly, setup.minSubMonths, setup.maxWinsPerUser, setup.minDuration].map(
        withoutUnit,
      ),
    );
  });

  it('points at the buttons and sections by the names the setup pages show', () => {
    expect(dict.guides.raffle.start.p1).toContain(dict.raffle.stopRaffle);
    expect(dict.guides.raffle.rules.subsText).toContain(withoutUnit(dict.raffle.minSubMonths));
    expect(dict.guides.bridge.commands.p1).toContain(
      locale === 'en'
        ? `under ${dict.obsBridge.sectionCommands} on the setup page`
        : `${dict.obsBridge.sectionCommands} bölümünden`,
    );
  });

  it('lets the broadcaster into a subs-only raffle only at the 1-month minimum, and says so', () => {
    const broadcaster = { isSub: true, subMonths: -1 };
    const accepts = (minSubMonths: number) =>
      shouldAcceptEntry(broadcaster.isSub, broadcaster.subMonths, {
        subscribersOnly: true,
        minSubMonths,
      });
    expect([accepts(1), accepts(2)]).toEqual([true, false]);
    const sentence = dict.guides.raffle.rules.subsText
      .split('. ')
      .find((part) => /broadcaster|Yayıncı/.test(part));
    expect(sentence).toMatch(/\b1\b/);
  });

  it('never promises demo chat when a Kick channel is not found', () => {
    // A Kick lookup that fails leaves the overlay waiting for chat (see overlays.test.tsx).
    expect(dict.guides.obs.troubleshoot.kickBody).not.toMatch(/Goku|Frieren/);
  });
});

// A phrase from each guide's topic, as the guides index lead names it.
const INDEX_TOPICS: Record<GuideId, Record<Locale, string>> = {
  'obs-browser-source': { en: 'adding a widget to OBS', tr: "OBS'e widget eklemek" },
  'twitch-kick-chat-overlay': {
    en: 'combining Twitch and Kick chat',
    tr: 'Twitch ve Kick sohbetini birleştirmek',
  },
  'obs-chat-dock': { en: 'reading chat in an OBS dock', tr: "sohbeti OBS dock'unda okumak" },
  'stream-alerts': { en: 'adding stream alerts', tr: 'yayın uyarıları eklemek' },
  'subathon-timer': { en: 'running a subathon timer', tr: 'subathon sayacı kurmak' },
  'chat-poll': { en: 'running a chat poll', tr: 'sohbet anketi yapmak' },
  'stream-frames': {
    en: 'framing your camera and chat',
    tr: 'kameraya ve sohbete çerçeve eklemek',
  },
  'chat-giveaway': { en: 'running a chat raffle', tr: 'sohbet çekilişi yapmak' },
  'obs-scene-switcher': {
    en: 'switching scenes from chat',
    tr: 'sohbetten sahne değiştirmek',
  },
};

describe('guides index lead', () => {
  it('names the topic of every guide in every language', () => {
    expect(Object.keys(INDEX_TOPICS).sort()).toEqual(GUIDES.map((guide) => guide.id).sort());
    for (const locale of LOCALES) {
      const lead = DICTS[locale].guides.index.lead;
      const missing = GUIDES.filter((guide) => !lead.includes(INDEX_TOPICS[guide.id][locale]));
      expect(
        missing.map((guide) => guide.id),
        locale,
      ).toEqual([]);
    }
  });
});
