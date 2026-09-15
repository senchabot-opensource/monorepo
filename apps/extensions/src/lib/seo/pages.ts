import { GUIDES_PATH, GUIDES_PUBLISHED, type GuideEntry } from '#/lib/guides';
import { type Locale, type TranslationKey, translate } from '#/lib/i18n';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getWidget, type WidgetId } from '#/lib/widgets';
import { getPageHead, type LocalizedMeta } from './head';
import {
  type GraphPage,
  getAppNode,
  getArticleNode,
  getPageGraph,
  type PageGraphOptions,
} from './structured-data';

/** Meta for the home page, the setup pages and the 404. Guides keep theirs in lib/guides. */
export const PAGE_META = {
  home: {
    en: {
      title: 'Free Twitch & Kick Overlays for OBS | Senchabot Extensions',
      description:
        'Five free tools for Twitch and Kick streamers: Chat Box, Emote Wall, Sub Sprout, Raffle and OBS Bridge. Set one up, copy its URL and add it to OBS. No login.',
    },
    tr: {
      title: "OBS için Ücretsiz Twitch ve Kick Overlay'leri | Senchabot",
      description:
        "Twitch ve Kick için beş ücretsiz araç: Sohbet Kutusu, Emote Duvarı, Sub Sprout, Çekiliş ve OBS Bridge. Birini ayarla, URL'sini kopyala, OBS'e ekle. Giriş yok.",
    },
  },
  'chat-box': {
    en: {
      title: 'Twitch + Kick Chat Overlay for OBS (Free) | Senchabot',
      description:
        'Merge Twitch and Kick chat into one OBS browser source (400×600). 7TV emotes on both platforms, BTTV and FFZ on Twitch, plus filters for bots and ! commands.',
    },
    tr: {
      title: "Ücretsiz Twitch + Kick Sohbet Overlay'i (OBS) | Senchabot",
      description:
        "Twitch ve Kick sohbetini tek bir OBS Tarayıcı Kaynağı'nda birleştir (400×600). İki platformda 7TV, Twitch'te BTTV ve FFZ emote'ları, bot ve ! komutu filtresi.",
    },
  },
  'emote-wall': {
    en: {
      title: 'Emote Wall Overlay for Twitch, Kick & 7TV | Senchabot',
      description:
        'Emote-only Twitch and Kick messages pop up on your stream in Calm, Chaos or Bounce mode, 7TV emotes from your Twitch channel included. Free, no login needed.',
    },
    tr: {
      title: "Twitch, Kick ve 7TV için Emote Duvarı Overlay'i | Senchabot",
      description:
        "Sadece emote'tan oluşan Twitch ve Kick mesajları yayında Sakin, Kaos ya da Sekme modunda uçuşur. Twitch kanalının 7TV emote'ları dahil. Ücretsiz, giriş yok.",
    },
  },
  'sub-sprout': {
    en: {
      title: 'Sub Sprout: Sub Goal Plant Overlay for Twitch & Kick',
      description:
        'A plant overlay that grows one stage with every new sub, resub or gifted sub on Twitch and Kick. Pick one of 10 plants and add rain or sparkles. Free, no login.',
    },
    tr: {
      title: 'Sub Sprout: Twitch ve Kick için Abone Hedefi Bitkisi',
      description:
        "Twitch ve Kick'te her yeni abonelik, yenileme ya da hediye abonelikle bir aşama büyüyen bitki overlay'i. 10 bitkiden birini seç, yağmur ya da parıltı ekle.",
    },
  },
  raffle: {
    en: {
      title: 'Twitch & Kick Chat Giveaway Picker (Free) | Senchabot',
      description:
        'Run a chat giveaway on Twitch or Kick: viewers type !join, you set subs-only rules and a win limit, then draw a winner with a secure random pick. No login.',
    },
    tr: {
      title: 'Twitch ve Kick Sohbet Çekilişi Aracı (Ücretsiz) | Senchabot',
      description:
        "Twitch ya da Kick'te sohbet çekilişi yap: izleyiciler !join yazar, sen abone şartını ve kazanma sınırını seçersin, kazanan güvenli rastgele seçimle çıkar.",
    },
  },
  'obs-bridge': {
    en: {
      title: 'Switch OBS Scenes from Twitch & Kick Chat | Senchabot',
      description:
        'Let mods switch OBS scenes from Twitch or Kick chat with !scene, brb and back, or start and stop the stream. Runs in a browser tab and talks to obs-websocket 5.',
    },
    tr: {
      title: 'Twitch ve Kick Sohbetinden OBS Sahnesi Değiştir | Senchabot',
      description:
        'Modlar Twitch ya da Kick sohbetinden !scene, brb ve back ile OBS sahnesini değiştirsin, yayını başlatıp durdursun. Tarayıcıda çalışır, obs-websocket 5 kullanır.',
    },
  },
  notFound: {
    en: {
      title: 'Page Not Found | Senchabot Extensions',
      description:
        "This page doesn't exist on Senchabot Extensions. Pick one of the free Twitch and Kick widgets, like Chat Box or Emote Wall, or go back to the home page.",
    },
    tr: {
      title: 'Sayfa Bulunamadı | Senchabot Extensions',
      description:
        "Aradığın sayfa Senchabot Extensions'ta yok. Sohbet Kutusu ya da Emote Duvarı gibi ücretsiz Twitch ve Kick widget'larından birini seç ya da ana sayfaya geri dön.",
    },
  },
} as const satisfies Record<WidgetId | 'home' | 'notFound', LocalizedMeta>;

/** featureList of each setup page's WebApplication: facts the page itself shows. */
export const APP_FEATURES: Record<WidgetId, Record<Locale, readonly string[]>> = {
  'chat-box': {
    en: [
      'Twitch and Kick chat merged into one overlay',
      '7TV emotes on Twitch and Kick, BTTV and FFZ emotes on Twitch',
      'Hides known bots and messages that start with !',
      'Messages stay 10 seconds to 5 minutes, or forever',
      'Highlights for mentions, replies, first-time chatters, announcements and Highlight My Message',
      'Four message layouts, eight entry animations and six fonts',
      'Vertical or horizontal orientation',
      'Recommended browser source size: 400x600',
    ],
    tr: [
      "Twitch ve Kick sohbeti tek bir overlay'de birleşir",
      "Twitch ve Kick'te 7TV, Twitch'te BTTV ve FFZ emote'ları",
      'Bilinen botları ve ! ile başlayan mesajları gizler',
      'Mesajlar 10 saniye ile 5 dakika arası ya da süresiz kalır',
      'Etiketlemeler, yanıtlar, sohbete ilk katılanlar, duyurular ve Mesajınızı Vurgulayın için vurgular',
      'Dört mesaj düzeni, sekiz giriş animasyonu ve altı yazı tipi',
      'Dikey ya da yatay yerleşim',
      'Önerilen Tarayıcı Kaynağı boyutu: 400x600',
    ],
  },
  'emote-wall': {
    en: [
      'Emote-only Twitch and Kick messages appear as emotes on screen',
      'Show All Emotes also picks up to 5 emotes out of normal messages',
      "7TV emotes from the Twitch channel's active set, in Kick chat too",
      'Calm, Chaos and Bounce animation modes',
      'Emote size 32 to 256 px, 2 to 30 seconds on screen, up to 120 at once',
      'Subscribers only, longer sub emotes, Hype Mode and emote spam blocking',
      'Recommended browser source size: 1920x1080',
    ],
    tr: [
      "Sadece emote'tan oluşan Twitch ve Kick mesajları ekranda emote olarak belirir",
      "Tüm Emote'ları Göster, normal mesajlardan da en fazla 5 emote alır",
      "Twitch kanalının aktif 7TV setindeki emote'lar, Kick sohbetinde de",
      'Sakin, Kaos ve Sekme animasyon modları',
      '32 ile 256 px arası emote boyutu, ekranda 2 ile 30 saniye, aynı anda en fazla 120 emote',
      "Sadece aboneler, abone emote'larına uzun süre, Hype Modu ve emote spamı engelleme",
      'Önerilen Tarayıcı Kaynağı boyutu: 1920x1080',
    ],
  },
  'sub-sprout': {
    en: [
      'Grows one stage with every new sub, resub or gifted sub on Twitch and Kick',
      '10 plant varieties',
      'After full growth: the same plant, the next one in order, or a random one',
      'Rain or sparkle watering effect',
      'Optional sub count and stage label on the pot',
      'The broadcaster and mods can type !grow to grow it by hand',
      'Recommended browser source size: 800x600',
    ],
    tr: [
      "Twitch ve Kick'te her yeni abonelik, yenileme ya da hediye abonelikle bir aşama büyür",
      '10 bitki çeşidi',
      'Tamamen büyüyünce aynı bitki, sıradaki bitki ya da rastgele biri',
      'Yağmur ya da parıltı sulama efekti',
      'İsteğe bağlı abone sayısı ve saksıda aşama etiketi',
      'Yayıncı ve modlar !grow yazarak bitkiyi elle büyütebilir',
      'Önerilen Tarayıcı Kaynağı boyutu: 800x600',
    ],
  },
  raffle: {
    en: [
      'Viewers enter by typing a keyword in chat, !join by default',
      'Runs on Twitch or Kick, one platform per raffle',
      'Subscribers only, with a minimum number of sub months',
      'Max wins per viewer from 1 to 5, or unlimited',
      'Minimum time before the draw, 0 to 300 seconds',
      'Known bots are skipped',
      'Winner overlay with confetti, as a 1920x1080 browser source in the same browser or app',
    ],
    tr: [
      'İzleyiciler sohbete bir kelime yazarak katılır, varsayılanı !join',
      "Twitch ya da Kick'te çalışır, her çekiliş tek platformda",
      'Sadece aboneler, en az abonelik ayı şartıyla',
      'Kişi başı kazanma sınırı 1 ile 5 arası ya da sınırsız',
      'Çekimden önce en kısa süre, 0 ile 300 saniye',
      'Bilinen botlar sayılmaz',
      "Konfetili kazanan overlay'i, aynı tarayıcıda ya da uygulamada 1920x1080 Tarayıcı Kaynağı olarak",
    ],
  },
  'obs-bridge': {
    en: [
      'Switch OBS scenes from Twitch or Kick chat with !scene and a scene name',
      'brb and back switch to the BRB and Main scenes',
      'Start and stop the stream and the recording from chat',
      'Only authorized users, each tied to a platform, can run commands',
      'Every command can be renamed',
      'Connects to obs-websocket 5 (OBS Studio 28 and later), ws://127.0.0.1:4455 by default',
      'Runs in a browser tab or an OBS Custom Browser Dock',
    ],
    tr: [
      'Twitch ya da Kick sohbetinden !scene ve sahne adıyla OBS sahnesi değiştirir',
      'brb ve back, BRB ve Ana sahneye geçirir',
      'Sohbetten yayını ve kaydı başlatıp durdurur',
      'Komutları sadece her biri bir platforma bağlı yetkili kullanıcılar çalıştırabilir',
      'Her komutun adı değiştirilebilir',
      "obs-websocket 5'e bağlanır (OBS Studio 28 ve sonrası), varsayılan adres ws://127.0.0.1:4455",
      "Bir tarayıcı sekmesinde ya da OBS'nin Özel Tarayıcı Dock'unda çalışır",
    ],
  },
};

type SeoPage = Omit<GraphPage, 'meta'> & { meta: LocalizedMeta; ogType?: 'website' | 'article' };

/** getPageHead plus the page's JSON-LD graph in the page's language, for every indexable page. */
export function getSeoHead({ meta, ...page }: SeoPage, graph: PageGraphOptions = {}) {
  const localized = { ...page, meta: meta[page.locale] };
  return getPageHead({ ...localized, jsonLd: [getPageGraph(localized, graph)] });
}

/** A setup page: its app as the main entity, Home > setup page, and the FAQ it shows. */
export function getSetupPageHead(
  id: WidgetId,
  locale: Locale,
  { breadcrumb, faq }: { breadcrumb: TranslationKey; faq: readonly FaqEntry[] },
) {
  const widget = getWidget(id);
  return getSeoHead(
    { path: widget.setupPath, locale, meta: PAGE_META[id], image: id },
    {
      breadcrumbs: [{ name: translate(locale, breadcrumb) }],
      faq,
      mainEntity: getAppNode({
        path: widget.setupPath,
        locale,
        name: translate(locale, widget.nameKey),
        description: translate(locale, widget.taglineKey),
        image: id,
        features: APP_FEATURES[id][locale],
      }),
    },
  );
}

/** A guide: an Article under Home > Guides > guide. */
export function getGuideHead(guide: GuideEntry, locale: Locale) {
  return getSeoHead(
    { path: guide.path, locale, meta: guide.meta, image: 'guides', ogType: 'article' },
    {
      breadcrumbs: [
        { name: translate(locale, 'guides.breadcrumb'), path: GUIDES_PATH },
        { name: translate(locale, guide.shortKey) },
      ],
      mainEntity: getArticleNode({
        path: guide.path,
        locale,
        headline: translate(locale, guide.titleKey),
        description: guide.meta[locale].description,
        datePublished: GUIDES_PUBLISHED,
      }),
    },
  );
}
