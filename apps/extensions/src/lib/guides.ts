import type { TranslationKey } from '#/lib/i18n';
import type { SitePath } from '#/lib/i18n/paths';
import type { LocalizedMeta } from '#/lib/seo/head';
import type { WidgetId } from '#/lib/widgets';

export type GuideId =
  | 'obs-browser-source'
  | 'twitch-kick-chat-overlay'
  | 'chat-giveaway'
  | 'obs-scene-switcher';

export interface GuideEntry {
  id: GuideId;
  path: SitePath;
  /** The H1, a "How to ..." question; also the Article headline. */
  titleKey: TranslationKey;
  /** Short label for the breadcrumb. */
  shortKey: TranslationKey;
  /** One line on what the guide answers, for the guide cards. */
  summaryKey: TranslationKey;
  /** Answer-first intro under the H1. */
  leadKey: TranslationKey;
  /** The widgets it covers, shown as links under the H1. */
  widgets: readonly WidgetId[];
  related: readonly GuideId[];
  meta: LocalizedMeta;
}

export const GUIDES_PATH: SitePath = '/guides';
export const GUIDES_PUBLISHED = '2026-09-12';

export const GUIDES: readonly GuideEntry[] = [
  {
    id: 'obs-browser-source',
    path: '/guides/obs-browser-source',
    titleKey: 'guides.obs.title',
    shortKey: 'guides.obs.short',
    summaryKey: 'guides.obs.summary',
    leadKey: 'guides.obs.lead',
    widgets: ['chat-box', 'emote-wall', 'sub-sprout', 'raffle'],
    related: ['twitch-kick-chat-overlay', 'chat-giveaway'],
    meta: {
      en: {
        title: 'Add a Stream Widget to OBS as a Browser Source | Senchabot',
        description:
          'Add a Senchabot widget to OBS Studio as a Browser Source: paste the URL, set the size (Chat Box is 400×600), keep it transparent and fix an empty source.',
      },
      tr: {
        title: "OBS'e Tarayıcı Kaynağı Olarak Widget Ekleme | Senchabot",
        description:
          "Senchabot widget'ını OBS Studio'ya Tarayıcı Kaynağı olarak ekle: URL'yi yapıştır, boyutu ayarla (Sohbet Kutusu 400×600), şeffaf bırak, boş kaynağı düzelt.",
      },
    },
  },
  {
    id: 'twitch-kick-chat-overlay',
    path: '/guides/twitch-kick-chat-overlay',
    titleKey: 'guides.chat.title',
    shortKey: 'guides.chat.short',
    summaryKey: 'guides.chat.summary',
    leadKey: 'guides.chat.lead',
    widgets: ['chat-box', 'emote-wall', 'sub-sprout'],
    related: ['obs-browser-source', 'obs-scene-switcher'],
    meta: {
      en: {
        title: 'Show Twitch and Kick Chat Together in OBS | Senchabot',
        description:
          'Merge Twitch and Kick chat into one OBS overlay with a single Chat Box URL: platform icons, 7TV, BTTV and FFZ emotes, bot filters and a 400×600 source.',
      },
      tr: {
        title: "OBS'te Twitch ve Kick Sohbetini Birlikte Göster | Senchabot",
        description:
          "Twitch ve Kick sohbetini tek Sohbet Kutusu URL'siyle bir OBS overlay'inde birleştir: platform simgeleri, 7TV, BTTV ve FFZ emote'ları, bot filtresi, 400×600.",
      },
    },
  },
  {
    id: 'chat-giveaway',
    path: '/guides/chat-giveaway',
    titleKey: 'guides.raffle.title',
    shortKey: 'guides.raffle.short',
    summaryKey: 'guides.raffle.summary',
    leadKey: 'guides.raffle.lead',
    widgets: ['raffle'],
    related: ['obs-browser-source', 'twitch-kick-chat-overlay'],
    meta: {
      en: {
        title: 'Run a Twitch or Kick Chat Giveaway with !join | Senchabot',
        description:
          'Run a free chat giveaway on Twitch or Kick: viewers type !join, you set subs-only rules, a win limit and a 15 second minimum, then draw a winner on stream.',
      },
      tr: {
        title: '!join ile Twitch veya Kick Sohbet Çekilişi Yap | Senchabot',
        description:
          "Twitch ya da Kick'te ücretsiz sohbet çekilişi: izleyiciler !join yazar, sen abone şartını, kazanma sınırını ve en kısa süreyi seçer, kazananı yayında çekersin.",
      },
    },
  },
  {
    id: 'obs-scene-switcher',
    path: '/guides/obs-scene-switcher',
    titleKey: 'guides.bridge.title',
    shortKey: 'guides.bridge.short',
    summaryKey: 'guides.bridge.summary',
    leadKey: 'guides.bridge.lead',
    widgets: ['obs-bridge'],
    related: ['obs-browser-source', 'chat-giveaway'],
    meta: {
      en: {
        title: 'Let Mods Switch OBS Scenes from Chat | Senchabot',
        description:
          'Let mods switch OBS scenes from Twitch or Kick chat with !scene, brb and back. Turn on OBS WebSocket (ws://127.0.0.1:4455) and pick who can use them.',
      },
      tr: {
        title: 'Modlar Sohbetten OBS Sahnesini Değiştirsin | Senchabot',
        description:
          "Modlar Twitch ya da Kick sohbetinden !scene, brb ve back ile OBS sahnesini değiştirsin. OBS WebSocket'i aç (ws://127.0.0.1:4455), kimin kullanacağını seç.",
      },
    },
  },
];

export function getGuide(id: GuideId): GuideEntry {
  const guide = GUIDES.find((entry) => entry.id === id);
  if (!guide) throw new Error(`Unknown guide: ${id}`);
  return guide;
}

/** Meta for the content pages that aren't guides. */
export const CONTENT_META = {
  guides: {
    en: {
      title: 'Guides for Twitch and Kick Overlays in OBS | Senchabot',
      description:
        "Step-by-step guides for Senchabot's free Twitch and Kick overlays: add a widget to OBS, merge two chats, run a !join giveaway, switch scenes from chat.",
    },
    tr: {
      title: "Twitch ve Kick Overlay'leri için OBS Rehberleri | Senchabot",
      description:
        "Ücretsiz Twitch ve Kick overlay'leri için adım adım rehberler: OBS'e widget ekle, iki sohbeti birleştir, !join çekilişi yap, sohbetten sahne değiştir.",
    },
  },
  faq: {
    en: {
      title: 'Senchabot Extensions FAQ: Free Twitch and Kick Overlays',
      description:
        'Answers about Senchabot Extensions: free with no login, which of the 5 widgets support Twitch and Kick, where your settings live and how to report a bug.',
    },
    tr: {
      title: "Senchabot Extensions SSS: Twitch ve Kick Overlay'leri",
      description:
        "Senchabot Extensions için kısa cevaplar: ücretsiz ve girişsiz, 5 widget'tan hangisi Twitch ve Kick'te çalışıyor, ayarlar nerede duruyor, hata nasıl bildirilir.",
    },
  },
  changelog: {
    en: {
      title: 'Changelog: New Features and Fixes | Senchabot Extensions',
      description:
        'Every feature and fix in Senchabot Extensions since the April 2026 launch, newest first, for Chat Box, Emote Wall, Sub Sprout, Raffle and OBS Bridge.',
    },
    tr: {
      title: 'Yenilikler: Eklenen Özellikler ve Düzeltmeler | Senchabot',
      description:
        "Senchabot Extensions'a Nisan 2026'dan beri gelen her özellik ve düzeltme, en yenisi en üstte: Sohbet Kutusu, Emote Duvarı, Sub Sprout, Çekiliş ve OBS Bridge.",
    },
  },
} as const satisfies Record<string, LocalizedMeta>;
