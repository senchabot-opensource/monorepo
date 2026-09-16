import type { TranslationKey } from '#/lib/i18n';
import type { SitePath } from '#/lib/i18n/paths';
import type { LocalizedMeta } from '#/lib/seo/head';
import type { WidgetId } from '#/lib/widgets';

export type GuideId =
  | 'obs-browser-source'
  | 'twitch-kick-chat-overlay'
  | 'obs-chat-dock'
  | 'stream-alerts'
  | 'subathon-timer'
  | 'chat-poll'
  | 'stream-frames'
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
  /** ISO date, shown under the H1 and used as the Article's datePublished. */
  published: string;
  meta: LocalizedMeta;
}

export const GUIDES_PATH: SitePath = '/guides';

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
    published: '2026-09-12',
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
    related: ['obs-browser-source', 'obs-chat-dock'],
    published: '2026-09-12',
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
    id: 'obs-chat-dock',
    path: '/guides/obs-chat-dock',
    titleKey: 'guides.reader.title',
    shortKey: 'guides.reader.short',
    summaryKey: 'guides.reader.summary',
    leadKey: 'guides.reader.lead',
    // Chat Reader opens from the Chat Box setup page and has no setup page of its own.
    widgets: ['chat-box'],
    related: ['twitch-kick-chat-overlay', 'obs-scene-switcher'],
    published: '2026-09-15',
    meta: {
      en: {
        title: 'Read Twitch and Kick Chat in an OBS Dock | Senchabot',
        description:
          'Read Twitch and Kick chat together in a browser tab or an OBS dock. It reconnects on its own, marks every drop and keeps 1000 lines through a refresh.',
      },
      tr: {
        title: "Twitch ve Kick Sohbetini OBS Dock'unda Oku | Senchabot",
        description:
          "Twitch ve Kick sohbetini tarayıcıda ya da OBS dock'unda birlikte oku. Kendiliğinden yeniden bağlanır, her kopmayı işaretler, yenilesen de 1000 satır kalır.",
      },
    },
  },
  {
    id: 'stream-alerts',
    path: '/guides/stream-alerts',
    titleKey: 'guides.alerts.title',
    shortKey: 'guides.alerts.short',
    summaryKey: 'guides.alerts.summary',
    leadKey: 'guides.alerts.lead',
    widgets: ['stream-alerts'],
    related: ['subathon-timer', 'obs-browser-source'],
    published: '2026-09-15',
    meta: {
      en: {
        title: 'Sub, Cheer and Raid Alerts for Twitch and Kick | Senchabot',
        description:
          'Add free animated alerts for Twitch and Kick subs, gifted subs, Bits, Kicks and raids to OBS: one 800×450 URL, two themes and sound that plays in OBS.',
      },
      tr: {
        title: "Twitch ve Kick'te Abone, Cheer ve Raid Uyarıları | Senchabot",
        description:
          "Twitch ve Kick'te abonelik, hediye abonelik, Bits, Kicks ve raid için OBS'e ücretsiz animasyonlu uyarılar: tek 800×450 URL, iki tema ve OBS'te çalan ses.",
      },
    },
  },
  {
    id: 'subathon-timer',
    path: '/guides/subathon-timer',
    titleKey: 'guides.subathon.title',
    shortKey: 'guides.subathon.short',
    summaryKey: 'guides.subathon.summary',
    leadKey: 'guides.subathon.lead',
    widgets: ['subathon'],
    related: ['stream-alerts', 'obs-browser-source'],
    published: '2026-09-15',
    meta: {
      en: {
        title: 'Run a Subathon Timer on Twitch and Kick in OBS | Senchabot',
        description:
          'Run a free subathon timer on Twitch and Kick: subs, gifts, Bits and Kicks add time, mods use !subathon add or pause, and it survives an OBS restart.',
      },
      tr: {
        title: "OBS'te Twitch ve Kick için Subathon Sayacı Kur | Senchabot",
        description:
          'Twitch ve Kick için ücretsiz subathon sayacı: abonelik, hediye, Bits ve Kicks süre ekler, modlar !subathon add ya da pause yazar, OBS kapansa da süre korunur.',
      },
    },
  },
  {
    id: 'chat-poll',
    path: '/guides/chat-poll',
    titleKey: 'guides.poll.title',
    shortKey: 'guides.poll.short',
    summaryKey: 'guides.poll.summary',
    leadKey: 'guides.poll.lead',
    widgets: ['poll'],
    related: ['chat-giveaway', 'subathon-timer'],
    published: '2026-09-15',
    meta: {
      en: {
        title: 'Run a Chat Poll on Twitch and Kick in OBS | Senchabot',
        description:
          'Run a free chat poll on Twitch and Kick: mods type !poll Question | A | B, viewers vote with a number, and the bars and the winner show in OBS.',
      },
      tr: {
        title: "OBS'te Twitch ve Kick için Sohbet Anketi Yap | Senchabot",
        description:
          "Twitch ve Kick için ücretsiz sohbet anketi: modlar !poll Soru | A | B yazar, izleyiciler numarayla oy verir, barlar ve kazanan OBS'te görünür.",
      },
    },
  },
  {
    id: 'stream-frames',
    path: '/guides/stream-frames',
    titleKey: 'guides.frames.title',
    shortKey: 'guides.frames.short',
    summaryKey: 'guides.frames.summary',
    leadKey: 'guides.frames.lead',
    widgets: ['frames'],
    related: ['obs-browser-source', 'twitch-kick-chat-overlay'],
    published: '2026-09-16',
    meta: {
      en: {
        title: 'Add Camera, Chat and Screen Frames in OBS | Senchabot',
        description:
          "Free camera, chat and screen frames for Twitch and Kick, drawn in your preset's style with a transparent middle. One URL in OBS, animations optional.",
      },
      tr: {
        title: "OBS'te Kamera, Sohbet ve Ekran Çerçevesi Ekle | Senchabot",
        description:
          "Twitch ve Kick yayınına ücretsiz kamera, sohbet ve ekran çerçevesi ekle: preset'e göre çizilmiş, ortası şeffaf, tek URL ile OBS'te, animasyonu kapatılabilir.",
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
    published: '2026-09-12',
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
    published: '2026-09-12',
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
        "Step-by-step guides for Senchabot's free Twitch and Kick overlays: add a widget to OBS, merge two chats, add alerts, run a subathon or a !join giveaway.",
    },
    tr: {
      title: "Twitch ve Kick Overlay'leri için OBS Rehberleri | Senchabot",
      description:
        "Ücretsiz Twitch ve Kick overlay'leri için adım adım rehberler: OBS'e widget ekle, iki sohbeti birleştir, uyarı ekle, subathon ya da !join çekilişi yap.",
    },
  },
  faq: {
    en: {
      title: 'Senchabot Extensions FAQ: Free Twitch and Kick Overlays',
      description:
        'Answers about Senchabot Extensions: free with no login, which of the 10 widgets support Twitch and Kick, where your settings live and how to report a bug.',
    },
    tr: {
      title: "Senchabot Extensions SSS: Twitch ve Kick Overlay'leri",
      description:
        "Senchabot Extensions için kısa cevaplar: ücretsiz ve girişsiz, 10 widget'tan hangisi Twitch ve Kick'te çalışıyor, ayarlar nerede duruyor, hata nasıl bildirilir.",
    },
  },
  presets: {
    en: {
      title: 'Game Presets for Twitch and Kick Overlays | Senchabot',
      description:
        'Free game presets for Twitch and Kick overlays: League of Legends, WoW, Metin2, Dota 2, Valorant, CS2 and Minecraft looks for chat, alerts, goals and polls.',
    },
    tr: {
      title: "Twitch ve Kick için Oyun Overlay Preset'leri | Senchabot",
      description:
        "Twitch ve Kick için ücretsiz oyun preset'leri. Sohbet, uyarı, hedef ve anket overlay'lerine LoL, WoW, Metin2, Dota 2, Valorant, CS2 ya da Minecraft havası kat.",
    },
  },
  changelog: {
    en: {
      title: 'Changelog: New Features and Fixes | Senchabot Extensions',
      description:
        'Every feature and fix in Senchabot Extensions since the April 2026 launch, newest first, for all nine Twitch and Kick overlays and tools.',
    },
    tr: {
      title: 'Yenilikler: Eklenen Özellikler ve Düzeltmeler | Senchabot',
      description:
        "Senchabot Extensions'taki dokuz Twitch ve Kick overlay'ine ve aracına Nisan 2026'dan beri gelen her özellik ve düzeltme, en yenisi en üstte.",
    },
  },
} as const satisfies Record<string, LocalizedMeta>;
