import type { JSX } from 'react';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '#/lib/i18n/locales';
import { getLocaleLinks, SITE_URL, siteUrl } from '#/lib/i18n/seo';

type MetaTag = JSX.IntrinsicElements['meta'];

export const SITE_NAME = 'Senchabot Extensions';
/** The X account the site footer links to. */
export const X_HANDLE = '@senchabot';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;
// Google cuts Japanese snippets near 120 characters, so Japanese descriptions run shorter.
export const JA_DESCRIPTION_MAX = 120;

/** `<title>` and meta description, in the page's language. */
export interface PageMeta {
  title: string;
  description: string;
}

/** A page's meta in every language, side by side so a change to one is easy to mirror. */
export type LocalizedMeta = Record<Locale, PageMeta>;

export const OG_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  ja: 'ja_JP',
  pt: 'pt_BR',
  tr: 'tr_TR',
};

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

// The images are in English on both versions of a page; only their alt text is translated.
export const OG_IMAGES = {
  home: {
    path: '/og/home.png',
    alt: {
      en: 'Senchabot Extensions, free Twitch and Kick overlays for OBS',
      tr: "Senchabot Extensions, OBS için ücretsiz Twitch ve Kick overlay'leri",
      es: 'Senchabot Extensions, overlays gratis de Twitch y Kick para OBS',
      fr: 'Senchabot Extensions, des overlays Twitch et Kick gratuits pour OBS',
      ja: 'Senchabot Extensions: OBS用の無料Twitch・Kickオーバーレイ',
      pt: 'Senchabot Extensions, overlays grátis da Twitch e da Kick para o OBS',
    },
  },
  'chat-box': {
    path: '/og/chat-box.png',
    alt: {
      en: 'Chat Box, a Twitch and Kick chat overlay',
      tr: "Sohbet Kutusu, Twitch ve Kick sohbet overlay'i",
      es: 'Caja de Chat, un overlay de chat para Twitch y Kick',
      fr: 'Boîte de chat, un overlay de chat Twitch et Kick',
      ja: 'チャットボックス: TwitchとKickのチャットオーバーレイ',
      pt: 'Caixa de Chat, um overlay de chat da Twitch e da Kick',
    },
  },
  'emote-wall': {
    path: '/og/emote-wall.png',
    alt: {
      en: 'Emote Wall, an emote overlay for Twitch and Kick',
      tr: "Emote Duvarı, Twitch ve Kick için emote overlay'i",
      es: 'Muro de Emotes, un overlay de emotes para Twitch y Kick',
      fr: "Mur d'emotes, un overlay d'emotes pour Twitch et Kick",
      ja: 'エモートウォール: TwitchとKick向けのエモートオーバーレイ',
      pt: 'Mural de Emotes, um overlay de emotes para Twitch e Kick',
    },
  },
  'sub-sprout': {
    path: '/og/sub-sprout.png',
    alt: {
      en: 'Sub Sprout, a plant overlay that grows with subs',
      tr: "Sub Sprout, aboneliklerle büyüyen bitki overlay'i",
      es: 'Sub Sprout, un overlay de planta que crece con las subs',
      fr: 'Sub Sprout, un overlay de plante qui pousse avec les subs',
      ja: 'Sub Sprout: サブスクで育つ植物のオーバーレイ',
      pt: 'Sub Sprout, um overlay de planta que cresce com os subs',
    },
  },
  subathon: {
    path: '/og/subathon.png',
    alt: {
      en: 'Subathon Timer, a countdown overlay that subs add time to',
      tr: "Subathon Timer, aboneliklerle süresi uzayan geri sayım overlay'i",
      es: 'Subathon Timer, un overlay de cuenta regresiva al que las subs le suman tiempo',
      fr: 'Subathon Timer, un overlay de compte à rebours auquel les subs ajoutent du temps',
      ja: 'Subathon Timer: サブスクで時間が増えるカウントダウンオーバーレイ',
      pt: 'Subathon Timer, um overlay de contagem regressiva que ganha tempo com os subs',
    },
  },
  goal: {
    path: '/og/goal.png',
    alt: {
      en: 'Sub Goal, a goal bar overlay that subs and gifted subs fill',
      tr: "Abone Hedefi, abonelik ve hediye aboneliklerle dolan hedef barı overlay'i",
      es: 'Meta de Subs, un overlay de barra de meta que llenan las subs y las subs regaladas',
      fr: "Objectif de subs, une barre d'objectif que remplissent les subs et subs offerts",
      ja: 'サブスク目標: サブスクとギフトサブで埋まる目標バーのオーバーレイ',
      pt: 'Meta de Subs, um overlay de barra de meta que subs e subs de presente enchem',
    },
  },
  frames: {
    path: '/og/frames.png',
    alt: {
      en: 'Stream Frames, frame overlays with presets for your camera, chat and screen',
      tr: "Yayın Çerçeveleri, kamera, sohbet ve ekran için preset'li çerçeve overlay'leri",
      es: 'Marcos de Stream, overlays de marco con presets para tu cámara, tu chat y tu pantalla',
      fr: 'Cadres de stream, des cadres avec presets pour ta caméra, ton chat et ton écran',
      ja: '配信フレーム: カメラ、チャット、画面用のプリセット付きフレームオーバーレイ',
      pt: 'Molduras de Live, overlays de moldura com presets para sua câmera, chat e tela',
    },
  },
  countdown: {
    path: '/og/countdown.png',
    alt: {
      en: 'Stream Countdown, a starting soon, break and ending countdown overlay',
      tr: "Yayın Geri Sayımı, başlangıç, mola ve bitiş için geri sayım overlay'i",
      es: 'Cuenta Regresiva, un overlay de cuenta regresiva para el inicio, la pausa y el cierre',
      fr: 'Compte à rebours de stream, pour tes scènes de début, de pause et de fin',
      ja: '配信カウントダウン: 開始前、休憩、終了用のカウントダウンオーバーレイ',
      pt: 'Contagem Regressiva, um overlay de contagem para início, pausa e encerramento',
    },
  },
  poll: {
    path: '/og/poll.png',
    alt: {
      en: 'Chat Poll, a poll overlay that Twitch and Kick chat vote in',
      tr: "Sohbet Anketi, Twitch ve Kick sohbetinin oy verdiği anket overlay'i",
      es: 'Encuesta de Chat, un overlay de encuesta en el que vota el chat de Twitch y Kick',
      fr: 'Sondage du chat, un overlay de sondage où votent les chats Twitch et Kick',
      ja: 'チャット投票: TwitchとKickのチャットで投票できるオーバーレイ',
      pt: 'Enquete do Chat, um overlay de enquete em que o chat da Twitch e da Kick vota',
    },
  },
  'stream-alerts': {
    path: '/og/stream-alerts.png',
    alt: {
      en: 'Stream Alerts, animated sub, gift, cheer and raid alerts for Twitch and Kick',
      tr: "Yayın Uyarıları, Twitch ve Kick'te abonelik, hediye, cheer ve raid için animasyonlu uyarı overlay'i",
      es: 'Alertas de Stream, alertas animadas de subs, regalos, cheers y raids para Twitch y Kick',
      fr: 'Alertes de stream, des alertes animées de sub, cadeau, cheer et raid pour Twitch et Kick',
      ja: '配信アラート: TwitchとKickのサブスク、ギフト、Cheer、レイドのアニメーションアラート',
      pt: 'Alertas de Live, alertas animados de sub, presente, Bits e raid para Twitch e Kick',
    },
  },
  raffle: {
    path: '/og/raffle.png',
    alt: {
      en: 'Raffle, a chat giveaway picker for Twitch and Kick',
      tr: 'Çekiliş, Twitch ve Kick için sohbet çekilişi aracı',
      es: 'Sorteo, una herramienta para sortear entre el chat de Twitch y Kick',
      fr: 'Tirage au sort, un outil de giveaway dans le chat pour Twitch et Kick',
      ja: '抽選: TwitchとKick向けのチャット抽選ツール',
      pt: 'Sorteio, uma ferramenta de sorteio no chat para Twitch e Kick',
    },
  },
  'obs-bridge': {
    path: '/og/obs-bridge.png',
    alt: {
      en: 'OBS Bridge, switch OBS scenes from chat',
      tr: 'OBS Bridge, sohbetten OBS sahnesi değiştirme aracı',
      es: 'OBS Bridge, cambia escenas de OBS desde el chat',
      fr: 'OBS Bridge, change de scène OBS depuis le chat',
      ja: 'OBS Bridge: チャットからOBSのシーンを切り替え',
      pt: 'OBS Bridge, troque as cenas do OBS pelo chat',
    },
  },
  guides: {
    path: '/og/guides.png',
    alt: {
      en: 'Senchabot Extensions guides for OBS overlays',
      tr: "OBS overlay'leri için Senchabot Extensions rehberleri",
      es: 'Guías de Senchabot Extensions para overlays de OBS',
      fr: 'Guides Senchabot Extensions pour les overlays OBS',
      ja: 'OBSオーバーレイのためのSenchabot Extensionsガイド',
      pt: 'Guias do Senchabot Extensions para overlays no OBS',
    },
  },
  socials: {
    path: '/og/socials.png',
    alt: {
      en: 'Socials, a social media rotation widget for Twitch and Kick',
      tr: 'Sosyal Medya, Twitch ve Kick için sosyal medya hesaplarını sırayla gösteren widget',
      es: 'Redes Sociales, un widget que rota tus redes sociales para Twitch y Kick',
      fr: 'Réseaux sociaux, un widget qui fait défiler tes réseaux pour Twitch et Kick',
      ja: 'SNSリンク: TwitchとKick向けのSNSローテーションウィジェット',
      pt: 'Redes Sociais, um widget de rodízio de redes sociais para Twitch e Kick',
    },
  },
} as const satisfies Record<string, { path: string; alt: Record<Locale, string> }>;

export type OgImage = keyof typeof OG_IMAGES;

export const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1';
export const ROBOTS_NOINDEX = 'noindex, follow';

/** Absolute URL of a site path, in English unless a locale is given. */
export const pageUrl = siteUrl;
export const ogImageUrl = (image: OgImage) => `${SITE_URL}${OG_IMAGES[image].path}`;

/** Tags every page shares; the root route sets them once. Pages replace og:locale with theirs. */
export const SITE_META: MetaTag[] = [
  { property: 'og:site_name', content: SITE_NAME },
  { property: 'og:locale', content: OG_LOCALES[DEFAULT_LOCALE] },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:site', content: X_HANDLE },
];

export interface PageHeadOptions {
  /** English site path; omit it for a page without a URL of its own, like the 404. */
  path?: string;
  /** The page's language: picks the localized URL, og:locale and image alt. */
  locale: Locale;
  meta: PageMeta;
  image: OgImage;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: readonly Record<string, unknown>[];
}

/**
 * Title, description, robots, Open Graph, Twitter and JSON-LD tags plus canonical and hreflang
 * links for one page. TanStack keeps the deepest route's tag per name/property, so these replace
 * the root route's fallbacks instead of adding a second copy. That also means one
 * og:locale:alternate per page, which is all two languages need.
 */
export function getPageHead({
  path,
  locale,
  meta,
  image,
  ogType = 'website',
  noindex = false,
  jsonLd = [],
}: PageHeadOptions) {
  const imageUrl = ogImageUrl(image);
  const alt = OG_IMAGES[image].alt[locale];
  const tags: MetaTag[] = [
    { title: meta.title },
    { name: 'description', content: meta.description },
    { name: 'robots', content: noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX },
    { property: 'og:type', content: ogType },
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    ...(path === undefined ? [] : [{ property: 'og:url', content: pageUrl(path, locale) }]),
    { property: 'og:locale', content: OG_LOCALES[locale] },
    ...LOCALES.filter((other) => other !== locale).map((other) => ({
      property: 'og:locale:alternate',
      content: OG_LOCALES[other],
    })),
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:width', content: String(OG_IMAGE_SIZE.width) },
    { property: 'og:image:height', content: String(OG_IMAGE_SIZE.height) },
    { property: 'og:image:alt', content: alt },
    { name: 'twitter:title', content: meta.title },
    { name: 'twitter:description', content: meta.description },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:image:alt', content: alt },
    // TanStack renders `script:ld+json` entries as JSON-LD scripts; React's meta type doesn't know
    // the key, so it goes in through a cast.
    ...jsonLd.map((data) => ({ 'script:ld+json': data }) as unknown as MetaTag),
  ];
  return { meta: tags, links: path === undefined || noindex ? [] : getLocaleLinks(path, locale) };
}
