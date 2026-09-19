import { GUIDES_PATH, type GuideEntry } from '#/lib/guides';
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
        'Nine free tools for Twitch and Kick streamers: Chat Box, Emote Wall, Sub Sprout, Subathon Timer, Stream Alerts, Sub Goal, Chat Poll, Raffle and OBS Bridge.',
    },
    tr: {
      title: "OBS için Ücretsiz Twitch ve Kick Overlay'leri | Senchabot",
      description:
        '9 ücretsiz Twitch ve Kick aracı: Sohbet Kutusu, Emote Duvarı, Sub Sprout, Subathon Timer, Yayın Uyarıları, Abone Hedefi, Sohbet Anketi, Çekiliş ve OBS Bridge.',
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
  subathon: {
    en: {
      title: 'Subathon Timer for Twitch & Kick (Free) | Senchabot',
      description:
        'A free subathon timer overlay for OBS. Subs, gifted subs, Bits and Kicks add time. Show it as a health bar, a clock or a ring. Mods control it from chat.',
    },
    tr: {
      title: 'Twitch ve Kick için Subathon Timer (Ücretsiz) | Senchabot',
      description:
        "OBS için ücretsiz subathon sayacı overlay'i. Abonelik, hediye abonelik, Bits ve Kicks süre ekler. Can barı, saat ya da halka seç, modlar sohbetten yönetsin.",
    },
  },
  'stream-alerts': {
    en: {
      title: 'Animated Stream Alerts for Twitch & Kick (Free) | Senchabot',
      description:
        'Free animated stream alerts for OBS. Subs, gifted subs, Bits, Kicks and raids on Twitch and Kick each get an alert with a sound. No login, no download.',
    },
    tr: {
      title: 'Twitch ve Kick için Yayın Uyarıları (Ücretsiz) | Senchabot',
      description:
        "OBS için ücretsiz animasyonlu yayın uyarıları. Twitch ve Kick'te her abonelik, hediye abonelik, Bits, Kicks ve raid için sesli uyarı. Giriş yok, indirme yok.",
    },
  },
  goal: {
    en: {
      title: 'Free Sub Goal Overlay for Twitch & Kick | Senchabot',
      description:
        'A free sub goal overlay for OBS. Every sub, resub and gifted sub on Twitch and Kick fills the bar, with a trophy when you hit the goal. Mods fix it from chat.',
    },
    tr: {
      title: 'Twitch ve Kick için Abone Hedefi Barı (Ücretsiz) | Senchabot',
      description:
        "OBS için ücretsiz abone hedefi barı. Twitch ve Kick'te her abonelik, yenileme ve hediye abonelik 1 ekler, hedefe ulaşınca kupa iner. Modlar sohbetten düzeltir.",
    },
  },
  poll: {
    en: {
      title: 'Free Chat Poll Overlay for Twitch & Kick | Senchabot',
      description:
        'A free chat poll overlay for OBS. Viewers on Twitch and Kick vote by typing a number, the bars fill live and the winner shows at the end. Mods run it from chat.',
    },
    tr: {
      title: 'Twitch ve Kick için Sohbet Anketi (Ücretsiz) | Senchabot',
      description:
        "OBS için ücretsiz sohbet anketi. Twitch ve Kick'te izleyiciler numara yazarak oy verir, barlar canlı dolar, sonunda kazanan çıkar. Modlar sohbetten yönetir.",
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
  subathon: {
    en: [
      'A countdown that subs, gifted subs, Bits and Kicks add time to, on Twitch and Kick',
      'Health bar, clock or ring style, with health colors or a fixed color',
      'Separate times for Twitch and Kick: subs, gifted subs, and Bits or Kicks',
      'Twitch Tier 2 and Tier 3 subs can count as 2 and 5 subs',
      'Optional time limit and a custom title',
      'The broadcaster and mods can start, pause, add, remove, set and reset time with !subathon',
      'The timer is saved in OBS and survives reloads',
      'Recommended browser source size: 800x300',
    ],
    tr: [
      "Twitch ve Kick'te abonelik, hediye abonelik, Bits ve Kicks geldikçe uzayan geri sayım",
      'Can barı, saat ya da halka stili, can renkleriyle ya da sabit bir renkle',
      'Twitch ve Kick için ayrı süreler: abonelik, hediye abonelik, Bits ya da Kicks',
      "Twitch'te Tier 2 ve Tier 3 abonelikler 2 ve 5 abonelik sayılabilir",
      'İsteğe bağlı süre sınırı ve özel başlık',
      'Yayıncı ve modlar !subathon ile sayacı başlatıp duraklatabilir, süre ekleyip çıkarabilir, ayarlayıp sıfırlayabilir',
      "Sayaç OBS'te kaydedilir, sayfa yenilense de kaybolmaz",
      'Önerilen Tarayıcı Kaynağı boyutu: 800x300',
    ],
  },
  'stream-alerts': {
    en: [
      'Alerts for subs, gifted subs, Bits, Kicks and raids on Twitch and Kick',
      'Two themes: Neon with synth sounds and Celestial with bell chimes, each with an icon per alert',
      'Seven colors, including one that tells Twitch and Kick apart',
      'Custom headings and minimum amounts for gifts, cheers and raids',
      "Resub months, and the viewer's message with a resub, Bits or Kicks, without links",
      'Alerts wait their turn and a gift of many subs is a single alert',
      'English or Turkish alert text',
      'Recommended browser source size: 800x450',
    ],
    tr: [
      "Twitch ve Kick'te abonelik, hediye abonelik, Bits, Kicks ve raid uyarıları",
      'İki tema: synth sesli Neon ve çan sesli Göksel, ikisinde de her uyarıya özel ikon',
      "Yedi renk seçeneği, biri Twitch ile Kick'i farklı renkte gösterir",
      'Özel başlıklar, hediye, cheer ve raid için en az miktar ayarı',
      'Yenilemelerde ay sayısı ve yenileme, Bits ya da Kicks ile gelen izleyici mesajı, linkler olmadan',
      'Uyarılar sırayla çıkar, çoklu hediye abonelik tek bir uyarı olur',
      'İngilizce ya da Türkçe uyarı metni',
      'Önerilen Tarayıcı Kaynağı boyutu: 800x450',
    ],
  },
  goal: {
    en: [
      'A goal bar that every sub, resub and gifted sub on Twitch and Kick fills by one',
      'Both platforms add into one count',
      'Prime and every tier count as one sub, a gift counts every sub in it',
      'Start from your current sub count, or from 0 for this stream',
      'A trophy celebration when the goal is reached, and the count keeps going past it',
      'The broadcaster and mods can add, remove, set and reset the count with !goal',
      'The count is saved in OBS and survives reloads',
      'Recommended browser source size: 800x260',
    ],
    tr: [
      "Twitch ve Kick'te her abonelik, yenileme ve hediye abonelikle birer birer dolan hedef barı",
      'İki platformdan gelenler tek bir sayıda toplanır',
      "Prime ve bütün tier'lar tek abonelik sayılır, hediyede içindeki her abonelik sayılır",
      "Mevcut abone sayısından ya da sadece bu yayın için 0'dan başlar",
      'Hedefe ulaşınca kupa kutlaması, sayı hedefi geçince de artmaya devam eder',
      'Yayıncı ve modlar !goal ile abone ekleyip çıkarabilir, sayıyı ayarlayıp sıfırlayabilir',
      "Sayı OBS'te kaydedilir, sayfa yenilense de kaybolmaz",
      'Önerilen Tarayıcı Kaynağı boyutu: 800x260',
    ],
  },
  poll: {
    en: [
      'Viewers vote by typing a number, !vote and a number, or the option itself in chat',
      'Votes from Twitch and Kick go into one poll, and every viewer counts once',
      'The broadcaster and mods put polls up, add time, end and cancel them with !poll',
      'A ready-made poll from the setup page starts with !poll start',
      'Live bars, a countdown, and the winner or a tie at the end',
      'Optional: subscribers only, sub votes that count 2× or 3×, results hidden until the end',
      'Late votes from viewers watching behind live still count for a few seconds',
      'Timed out and banned accounts lose their vote',
      'Recommended browser source size: 640x560',
    ],
    tr: [
      'İzleyiciler sohbete bir numara, !vote ve numara ya da seçeneğin kendisini yazarak oy verir',
      "Twitch ve Kick'ten gelen oylar tek ankette toplanır, her izleyici bir kez sayılır",
      'Yayıncı ve modlar !poll ile anket başlatır, süre ekler, anketi bitirir ya da iptal eder',
      'Kurulum sayfasındaki hazır anket !poll start ile başlar',
      'Canlı barlar, geri sayım ve sonunda kazanan ya da beraberlik',
      'İsteğe bağlı: sadece aboneler, 2× ya da 3× sayılan abone oyları, sona kadar gizli sonuçlar',
      'Yayını geriden izleyenlerin geç gelen oyları birkaç saniye daha sayılır',
      'Susturulan ve banlanan hesapların oyu silinir',
      'Önerilen Tarayıcı Kaynağı boyutu: 640x560',
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
        datePublished: guide.published,
      }),
    },
  );
}
