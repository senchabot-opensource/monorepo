import { describe, expect, it } from 'vitest';
import { shouldAcceptEntry } from '#/hooks/use-raffle-chat';
import { GUIDES, type GuideId } from './guides';
import { dictionaries, type Locale, translate } from './i18n/index';
import { LOCALES } from './i18n/locales';
import { WIDGETS, type WidgetEntry } from './widgets';

// Raffle runs on one platform and keeps its rules in the browser, and OBS Bridge ties each
// command user to a platform; every other widget reopens a pasted URL, and all of those but
// Stream Frames, which reads no chat, take both channels.
const PASTE_WIDGETS = WIDGETS.filter(
  (widget) => widget.id !== 'raffle' && widget.id !== 'obs-bridge',
);
const BOTH_CHANNEL_WIDGETS = PASTE_WIDGETS.filter(
  (widget) => widget.id !== 'frames' && widget.id !== 'socials',
);

const missingIn = (widgets: readonly WidgetEntry[], text: string, locale: Locale) =>
  widgets
    .filter((widget) => !text.includes(translate(locale, widget.nameKey)))
    .map((widget) => widget.id);
const namesIn = (text: string, locale: Locale) => missingIn(BOTH_CHANNEL_WIDGETS, text, locale);
const pasteNamesIn = (text: string, locale: Locale) => missingIn(PASTE_WIDGETS, text, locale);

/** A field label without its unit, e.g. "Minimum Duration (s)" → "Minimum Duration". */
const withoutUnit = (label: string) => label.replace(/\s*\([^)]*\)$/, '');

describe.each(LOCALES)('guide and FAQ copy in %s', (locale) => {
  const dict = dictionaries[locale];

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
    expect(dict.guides.bridge.commands.p1).toContain(dict.obsBridge.sectionCommands);
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
      .find((part) => part.toLowerCase().includes(BROADCASTER[locale]));
    expect(sentence).toMatch(/\b1\b/);
  });

  it('never promises demo chat when a Kick channel is not found', () => {
    // A Kick lookup that fails leaves the overlay waiting for chat (see overlays.test.tsx).
    expect(dict.guides.obs.troubleshoot.kickBody).not.toMatch(/Goku|Frieren/);
  });
});

// The word for the broadcaster in each language's raffle rules, lower-cased.
const BROADCASTER: Record<Locale, string> = {
  en: 'broadcaster',
  de: 'streamer',
  tr: 'yayıncı',
  es: 'streamer',
  fr: 'streamer',
  ja: '配信者',
  pt: 'streamer',
};

// A phrase from each guide's topic, as the guides index lead names it.
const INDEX_TOPICS: Record<GuideId, Record<Locale, string>> = {
  'obs-browser-source': {
    en: 'adding a widget to OBS',
    de: 'ein Widget zu OBS hinzufügen',
    tr: "OBS'e widget eklemek",
    es: 'añadir un widget a OBS',
    fr: 'ajouter un widget à OBS',
    ja: 'OBSにウィジェットを追加する',
    pt: 'adicionar um widget ao OBS',
  },
  'twitch-kick-chat-overlay': {
    en: 'combining Twitch and Kick chat',
    de: 'Twitch- und Kick-Chat zusammenführen',
    tr: 'Twitch ve Kick sohbetini birleştirmek',
    es: 'juntar el chat de Twitch y Kick',
    fr: 'réunir les chats Twitch et Kick',
    ja: 'TwitchとKickのチャットをまとめる',
    pt: 'juntar o chat da Twitch e da Kick',
  },
  'obs-chat-dock': {
    en: 'reading chat in an OBS dock',
    de: 'den Chat in einem OBS-Dock lesen',
    tr: "sohbeti OBS dock'unda okumak",
    es: 'leer el chat en un panel de OBS',
    fr: 'lire le chat dans un dock OBS',
    ja: 'OBSのドックでチャットを読む',
    pt: 'ler o chat em um painel do OBS',
  },
  'stream-alerts': {
    en: 'adding stream alerts',
    de: 'Stream-Alerts einrichten',
    tr: 'yayın uyarıları eklemek',
    es: 'añadir alertas al stream',
    fr: 'ajouter des alertes de stream',
    ja: '配信アラートを追加する',
    pt: 'adicionar alertas de live',
  },
  'subathon-timer': {
    en: 'running a subathon timer',
    de: 'einen Subathon Timer starten',
    tr: 'subathon sayacı kurmak',
    es: 'montar un subathon timer',
    fr: 'lancer un timer de subathon',
    ja: 'サブアソンタイマーを動かす',
    pt: 'montar um subathon timer',
  },
  'chat-poll': {
    en: 'running a chat poll',
    de: 'eine Chat-Umfrage starten',
    tr: 'sohbet anketi yapmak',
    es: 'hacer una encuesta en el chat',
    fr: 'faire un sondage dans le chat',
    ja: 'チャット投票を行う',
    pt: 'fazer uma enquete no chat',
  },
  'stream-frames': {
    en: 'framing your camera and chat',
    de: 'Kamera und Chat einrahmen',
    tr: 'kameraya ve sohbete çerçeve eklemek',
    es: 'enmarcar tu cámara y tu chat',
    fr: 'encadrer ta caméra et ton chat',
    ja: 'カメラとチャットにフレームを付ける',
    pt: 'colocar moldura na câmera e no chat',
  },
  'stream-countdown': {
    en: 'counting down to your stream',
    de: 'bis zum Stream-Start herunterzählen',
    tr: 'yayın için geri sayım koymak',
    es: 'poner una cuenta regresiva para tu stream',
    fr: 'lancer un compte à rebours avant ton live',
    ja: '配信開始までカウントダウンする',
    pt: 'fazer a contagem regressiva da live',
  },
  'chat-giveaway': {
    en: 'running a chat raffle',
    de: 'eine Verlosung im Chat starten',
    tr: 'sohbet çekilişi yapmak',
    es: 'hacer un sorteo en el chat',
    fr: 'organiser un tirage au sort dans le chat',
    ja: 'チャット抽選を行う',
    pt: 'fazer um sorteio no chat',
  },
  'obs-scene-switcher': {
    en: 'switching scenes from chat',
    de: 'Szenen aus dem Chat wechseln',
    tr: 'sohbetten sahne değiştirmek',
    es: 'cambiar de escena desde el chat',
    fr: 'changer de scène depuis le chat',
    ja: 'チャットからシーンを切り替える',
    pt: 'trocar de cena pelo chat',
  },
};

describe('guides index lead', () => {
  it('names the topic of every guide in every language', () => {
    expect(Object.keys(INDEX_TOPICS).sort()).toEqual(GUIDES.map((guide) => guide.id).sort());
    for (const locale of LOCALES) {
      const lead = dictionaries[locale].guides.index.lead;
      const missing = GUIDES.filter((guide) => !lead.includes(INDEX_TOPICS[guide.id][locale]));
      expect(
        missing.map((guide) => guide.id),
        locale,
      ).toEqual([]);
    }
  });
});
