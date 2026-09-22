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
  | 'stream-countdown'
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
      es: {
        title: 'Añadir un widget a OBS como fuente de navegador | Senchabot',
        description:
          'Añade un widget de Senchabot a OBS Studio como fuente de navegador: pega la URL, pon el tamaño (Caja de Chat es 400×600), fondo transparente y fuente vacía.',
      },
      fr: {
        title: 'Ajouter un widget à OBS en source navigateur | Senchabot',
        description:
          "Ajoute un widget Senchabot à OBS Studio en source Navigateur web : colle l'URL, règle la taille (400×600 pour la Boîte de chat) et répare une source vide.",
      },
      ja: {
        title: 'OBSにウィジェットをブラウザソースで追加 | Senchabot',
        description:
          'SenchabotのウィジェットをOBS Studioのブラウザソースとして追加する手順。URLの貼り付け、サイズ（チャットボックスは400×600）、透明な背景、空のソースの直し方を解説します。',
      },
      pt: {
        title: 'Widget de live no OBS como fonte de navegador | Senchabot',
        description:
          'Adicione um widget do Senchabot no OBS Studio como fonte de navegador: cole a URL, ajuste o tamanho (Caixa de Chat em 400×600) e resolva a fonte vazia.',
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
      es: {
        title: 'Chat de Twitch y Kick juntos en OBS | Senchabot',
        description:
          'Junta el chat de Twitch y Kick en un overlay de OBS con una sola URL de Caja de Chat: iconos de plataforma, emotes de 7TV, BTTV y FFZ, filtros y fuente 400×600.',
      },
      fr: {
        title: 'Les chats Twitch et Kick ensemble dans OBS | Senchabot',
        description:
          'Réunis les chats Twitch et Kick dans un seul overlay OBS avec une URL de Boîte de chat : icônes de plateforme, emotes 7TV, BTTV et FFZ, filtre de bots, 400×600.',
      },
      ja: {
        title: 'TwitchとKickのチャットをOBSで一緒に表示 | Senchabot',
        description:
          'チャットボックスのURLひとつで、TwitchとKickのチャットをOBSのオーバーレイにまとめる方法。プラットフォームアイコン、7TV・BTTV・FFZのエモート、ボットの非表示、400×600のソース。',
      },
      pt: {
        title: 'Chat da Twitch e da Kick juntos no OBS | Senchabot',
        description:
          'Junte o chat da Twitch e da Kick em um overlay no OBS com uma URL da Caixa de Chat: ícones de plataforma, emotes 7TV, BTTV e FFZ, filtro de bots e 400×600.',
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
      es: {
        title: 'Lee el chat de Twitch y Kick en un panel de OBS | Senchabot',
        description:
          'Lee el chat de Twitch y Kick juntos en una pestaña o en un panel de OBS. Se reconecta solo, marca cada corte y guarda 1000 líneas aunque recargues.',
      },
      fr: {
        title: 'Lire les chats Twitch et Kick dans un dock OBS | Senchabot',
        description:
          'Lis les chats Twitch et Kick ensemble dans un onglet ou un dock OBS. Il se reconnecte tout seul, signale chaque coupure et garde 1000 lignes après un refresh.',
      },
      ja: {
        title: 'TwitchとKickのチャットをOBSのドックで読む | Senchabot',
        description:
          'TwitchとKickのチャットを、ブラウザのタブやOBSのドックでまとめて読めます。自動で再接続し、途切れた箇所を記録して、ページを更新しても1000行の履歴が残ります。',
      },
      pt: {
        title: 'Ler o chat da Twitch e da Kick num painel do OBS | Senchabot',
        description:
          'Leia o chat da Twitch e da Kick juntos numa aba do navegador ou num painel do OBS. Reconecta sozinho, marca cada queda e guarda 1000 linhas ao atualizar.',
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
      es: {
        title: 'Alertas de subs, cheers y raids en Twitch y Kick | Senchabot',
        description:
          'Alertas animadas gratis en OBS para subs, subs regaladas, Bits, Kicks y raids de Twitch y Kick: una URL de 800×450, dos temas y sonido que suena en OBS.',
      },
      fr: {
        title: 'Alertes de sub, cheer et raid Twitch et Kick | Senchabot',
        description:
          'Ajoute à OBS des alertes animées gratuites pour les subs, subs offerts, Bits, Kicks et raids Twitch et Kick : une URL 800×450, deux thèmes et le son dans OBS.',
      },
      ja: {
        title: 'TwitchとKickのサブスク・Cheer・レイドアラート | Senchabot',
        description:
          'TwitchとKickのサブスク、ギフトサブ、Bits、Kicks、レイドの無料アニメーションアラートをOBSに追加。800×450のURLひとつ、2つのテーマ、OBSで鳴る効果音。',
      },
      pt: {
        title: 'Alertas de sub, Bits e raid na Twitch e Kick | Senchabot',
        description:
          'Alertas animados grátis no OBS para subs, subs de presente, Bits, Kicks e raids da Twitch e da Kick: uma URL de 800×450, dois temas e som tocando no OBS.',
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
      es: {
        title: 'Subathon timer para Twitch y Kick en OBS | Senchabot',
        description:
          'Monta un subathon timer gratis en Twitch y Kick: subs, regalos, Bits y Kicks suman tiempo, los mods usan !subathon add o pause y aguanta un reinicio de OBS.',
      },
      fr: {
        title: 'Un timer de subathon Twitch et Kick dans OBS | Senchabot',
        description:
          'Lance un timer de subathon gratuit sur Twitch et Kick : subs, cadeaux, Bits et Kicks ajoutent du temps, les modos font !subathon add ou pause, et OBS le garde.',
      },
      ja: {
        title: 'TwitchとKickでサブアソンタイマーを使う | Senchabot',
        description:
          'TwitchとKickで使える無料のサブアソンタイマー。サブスク、ギフト、Bits、Kicksで時間が増え、モデレーターは !subathon add や pause で操作でき、OBSを再起動しても残ります。',
      },
      pt: {
        title: 'Subathon timer na Twitch e na Kick pelo OBS | Senchabot',
        description:
          'Monte um subathon timer grátis na Twitch e na Kick: subs, presentes, Bits e Kicks somam tempo, mods usam !subathon add ou pause, e sobrevive ao OBS reiniciar.',
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
      es: {
        title: 'Encuesta de chat en Twitch y Kick con OBS | Senchabot',
        description:
          'Haz una encuesta de chat gratis en Twitch y Kick: los mods escriben !poll Pregunta | A | B, el chat vota con un número y las barras y el ganador salen en OBS.',
      },
      fr: {
        title: 'Un sondage du chat Twitch et Kick dans OBS | Senchabot',
        description:
          'Fais un sondage gratuit dans le chat Twitch et Kick : les modos tapent !poll Question | A | B, les viewers votent avec un numéro, barres et gagnant dans OBS.',
      },
      ja: {
        title: 'TwitchとKickのチャット投票をOBSで | Senchabot',
        description:
          'TwitchとKickで使える無料のチャット投票。モデレーターが !poll 質問 | A | B と打つと、視聴者は番号で投票し、バーと勝者がOBSに表示されます。',
      },
      pt: {
        title: 'Enquete no chat da Twitch e da Kick no OBS | Senchabot',
        description:
          'Enquete grátis no chat da Twitch e da Kick: mods digitam !poll Pergunta | A | B, o pessoal vota com um número, e as barras e o vencedor aparecem no OBS.',
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
      es: {
        title: 'Marcos para cámara, chat y pantalla en OBS | Senchabot',
        description:
          'Marcos gratis para cámara, chat y pantalla en Twitch y Kick, con el estilo de tu preset y el centro transparente. Una URL en OBS, animaciones opcionales.',
      },
      fr: {
        title: 'Cadres pour caméra, chat et écran dans OBS | Senchabot',
        description:
          'Des cadres gratuits pour ta caméra, ton chat et ton écran sur Twitch et Kick, dans le style de ton preset avec un centre transparent. Une URL dans OBS.',
      },
      ja: {
        title: 'OBSでカメラ・チャット・画面にフレームを追加 | Senchabot',
        description:
          'TwitchとKick向けの無料のカメラ、チャット、画面フレーム。プリセットのスタイルで描かれ、中央は透明です。OBSにURLをひとつ追加するだけで、アニメーションはオン・オフできます。',
      },
      pt: {
        title: 'Molduras de câmera, chat e tela no OBS | Senchabot',
        description:
          'Molduras grátis de câmera, chat e tela para Twitch e Kick, no estilo do seu preset e com o meio transparente. Uma URL no OBS, animações opcionais.',
      },
    },
  },
  {
    id: 'stream-countdown',
    path: '/guides/stream-countdown',
    titleKey: 'guides.countdown.title',
    shortKey: 'guides.countdown.short',
    summaryKey: 'guides.countdown.summary',
    leadKey: 'guides.countdown.lead',
    widgets: ['countdown'],
    related: ['obs-browser-source', 'obs-scene-switcher'],
    published: '2026-09-20',
    meta: {
      en: {
        title: 'Add a Starting Soon and BRB Countdown in OBS | Senchabot',
        description:
          'Add a free countdown to your Twitch or Kick stream: a length or a time of day like 21:00, starting over on every scene switch, and the !countdown commands.',
      },
      tr: {
        title: "OBS'te Başlangıç, Mola ve Bitiş Geri Sayımı Ekle | Senchabot",
        description:
          'Twitch ve Kick yayınına ücretsiz geri sayım ekle: süre ya da 21:00 gibi bir saat, her sahne geçişinde baştan başlar, modlar !countdown ile uzatır.',
      },
      es: {
        title: 'Cuenta regresiva de inicio y pausa en OBS | Senchabot',
        description:
          'Pon una cuenta regresiva gratis en tu stream de Twitch o Kick: por duración o hasta una hora como 21:00, se reinicia al cambiar de escena y va con !countdown.',
      },
      fr: {
        title: 'Compte à rebours de début et BRB dans OBS | Senchabot',
        description:
          'Un compte à rebours gratuit pour ton live Twitch ou Kick : une durée ou une heure comme 21:00, relancé à chaque changement de scène, et la commande !countdown.',
      },
      ja: {
        title: 'OBSに開始前・休憩のカウントダウンを追加 | Senchabot',
        description:
          'TwitchやKickの配信に無料のカウントダウンを追加。時間の長さか21:00のような時刻で設定でき、シーンを切り替えるたびに最初から始まり、!countdown コマンドにも対応。',
      },
      pt: {
        title: 'Contagem de início e BRB no OBS | Senchabot',
        description:
          'Contagem regressiva grátis na live da Twitch ou da Kick: por duração ou até um horário tipo 21:00, recomeçando a cada troca de cena, e os comandos !countdown.',
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
      es: {
        title: 'Sorteo en el chat de Twitch o Kick con !join | Senchabot',
        description:
          'Haz un sorteo gratis en el chat de Twitch o Kick: el chat escribe !join, tú pones reglas solo para subs, un límite de victorias y 15 s mínimos, y sacas ganador.',
      },
      fr: {
        title: 'Un giveaway Twitch ou Kick avec !join | Senchabot',
        description:
          'Un giveaway gratuit dans le chat Twitch ou Kick : les viewers tapent !join, tu fixes les règles abonnés, une limite de victoires et 15 s minimum, puis tu tires.',
      },
      ja: {
        title: 'TwitchやKickで !join のチャット抽選 | Senchabot',
        description:
          'TwitchやKickで無料のチャット抽選。視聴者は !join と打って参加し、サブスク限定のルール、当選回数の上限、15秒の最短時間を設定して、当選者を配信に表示できます。',
      },
      pt: {
        title: 'Sorteio no chat da Twitch ou da Kick com !join | Senchabot',
        description:
          'Sorteio grátis no chat da Twitch ou da Kick: o pessoal digita !join, você define só inscritos, limite de vitórias e 15 segundos mínimos, e sorteia na live.',
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
      es: {
        title: 'Tus mods cambian escenas de OBS desde el chat | Senchabot',
        description:
          'Deja que tus mods cambien escenas de OBS desde el chat de Twitch o Kick con !scene, brb y back. Activa OBS WebSocket (ws://127.0.0.1:4455) y elige quién puede.',
      },
      fr: {
        title: 'Tes modos changent de scène OBS depuis le chat | Senchabot',
        description:
          "Tes modos changent de scène OBS depuis le chat Twitch ou Kick avec !scene, brb et back. Active le WebSocket d'OBS (ws://127.0.0.1:4455) et choisis qui peut.",
      },
      ja: {
        title: 'チャットからOBSのシーンを切り替える | Senchabot',
        description:
          'TwitchやKickのチャットから、モデレーターが !scene、brb、back でOBSのシーンを切り替えられます。OBSのWebSocket（ws://127.0.0.1:4455）を有効にして、使える人を選ぶだけ。',
      },
      pt: {
        title: 'Deixe os mods trocarem cenas do OBS pelo chat | Senchabot',
        description:
          'Deixe os mods trocarem cenas do OBS pelo chat da Twitch ou da Kick com !scene, brb e back. Ative o WebSocket do OBS (ws://127.0.0.1:4455) e escolha quem usa.',
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
    es: {
      title: 'Guías de overlays de Twitch y Kick en OBS | Senchabot',
      description:
        'Guías paso a paso de los overlays gratis de Senchabot para Twitch y Kick: añade un widget a OBS, junta dos chats, pon alertas, un subathon o sorteos con !join.',
    },
    fr: {
      title: 'Guides pour overlays Twitch et Kick dans OBS | Senchabot',
      description:
        'Des guides pas à pas pour les overlays gratuits de Senchabot : ajouter un widget à OBS, réunir deux chats, des alertes, un subathon ou un giveaway !join.',
    },
    ja: {
      title: 'TwitchとKickオーバーレイのOBSガイド | Senchabot',
      description:
        'Senchabotの無料TwitchとKickオーバーレイのステップ別ガイド。OBSへのウィジェット追加、2つのチャットの統合、アラートの追加、サブアソンや !join 抽選のやり方。',
    },
    pt: {
      title: 'Guias de overlays da Twitch e da Kick no OBS | Senchabot',
      description:
        'Guias passo a passo dos overlays grátis do Senchabot para Twitch e Kick: widget no OBS, juntar dois chats, alertas, subathon ou um sorteio com !join.',
    },
  },
  faq: {
    en: {
      title: 'Senchabot Extensions FAQ: Free Twitch and Kick Overlays',
      description:
        'Answers about Senchabot Extensions: free with no login, which of the 12 widgets support Twitch and Kick, where your settings live and how to report a bug.',
    },
    tr: {
      title: "Senchabot Extensions SSS: Twitch ve Kick Overlay'leri",
      description:
        "Senchabot Extensions için kısa cevaplar: ücretsiz ve girişsiz, 12 widget'tan hangisi Twitch ve Kick'te çalışıyor, ayarlar nerede duruyor, hata nasıl bildirilir.",
    },
    es: {
      title: 'Preguntas frecuentes de Senchabot Extensions',
      description:
        'Respuestas sobre Senchabot Extensions: gratis y sin login, cuáles de los 12 widgets van con Twitch y Kick, dónde vive tu configuración y cómo reportar un error.',
    },
    fr: {
      title: 'FAQ Senchabot Extensions : overlays Twitch et Kick gratuits',
      description:
        'Tout sur Senchabot Extensions : gratuit et sans connexion, lesquels des 12 widgets gèrent Twitch et Kick, où sont tes réglages et comment signaler un bug.',
    },
    ja: {
      title: 'よくある質問: 無料のTwitch・Kickオーバーレイ | Senchabot',
      description:
        'Senchabot Extensionsについての回答。ログイン不要で無料、12個のウィジェットのどれがTwitchとKickに対応しているか、設定の保存場所、バグの報告方法。',
    },
    pt: {
      title: 'FAQ do Senchabot Extensions: overlays grátis Twitch e Kick',
      description:
        'Respostas sobre o Senchabot Extensions: grátis e sem login, quais dos 12 widgets funcionam na Twitch e na Kick, onde ficam as configurações e como relatar bugs.',
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
    es: {
      title: 'Presets de juegos para overlays de Twitch y Kick | Senchabot',
      description:
        'Presets de juegos gratis para overlays de Twitch y Kick: League of Legends, WoW, Metin2, Dota 2, Valorant, CS2 y Minecraft en chat, alertas, metas y encuestas.',
    },
    fr: {
      title: 'Presets de jeux pour overlays Twitch et Kick | Senchabot',
      description:
        'Des presets de jeux gratuits pour tes overlays : League of Legends, WoW, Metin2, Dota 2, Valorant, CS2 et Minecraft pour chat, alertes, objectifs et sondages.',
    },
    ja: {
      title: 'TwitchとKickオーバーレイのゲームプリセット | Senchabot',
      description:
        'TwitchとKickのオーバーレイ用の無料ゲームプリセット。League of Legends、WoW、Metin2、Dota 2、Valorant、CS2、Minecraft風の見た目を、チャット、アラート、目標、投票に。',
    },
    pt: {
      title: 'Presets de jogos para overlays da Twitch e Kick | Senchabot',
      description:
        'Presets de jogos grátis para overlays da Twitch e Kick: visuais de League of Legends, WoW, Metin2, Dota 2, Valorant, CS2 e Minecraft para chat, alertas e metas.',
    },
  },
  changelog: {
    en: {
      title: 'Changelog: New Features and Fixes | Senchabot Extensions',
      description:
        'Every feature and fix in Senchabot Extensions since the April 2026 launch, newest first, for all twelve Twitch and Kick overlays and tools.',
    },
    tr: {
      title: 'Yenilikler: Eklenen Özellikler ve Düzeltmeler | Senchabot',
      description:
        "Senchabot Extensions'taki on iki Twitch ve Kick overlay'ine ve aracına Nisan 2026'dan beri gelen her özellik ve düzeltme, en yenisi en üstte.",
    },
    es: {
      title: 'Novedades: funciones y arreglos | Senchabot Extensions',
      description:
        'Cada función y arreglo de Senchabot Extensions desde el lanzamiento en abril de 2026, de lo más nuevo a lo más viejo, para los doce overlays y herramientas.',
    },
    fr: {
      title: 'Nouveautés et correctifs | Senchabot Extensions',
      description:
        "Chaque fonctionnalité et correctif de Senchabot Extensions depuis le lancement d'avril 2026, du plus récent au plus ancien, pour les douze overlays et outils.",
    },
    ja: {
      title: '更新履歴: 新機能と修正 | Senchabot Extensions',
      description:
        '2026年4月の公開以来、Senchabot ExtensionsのTwitchとKick向けオーバーレイとツールに加わったすべての新機能と修正を、新しい順に掲載しています。',
    },
    pt: {
      title: 'Histórico de mudanças: novidades | Senchabot Extensions',
      description:
        'Cada recurso e correção do Senchabot Extensions desde o lançamento em abril de 2026, do mais novo ao mais antigo, nos overlays e ferramentas para Twitch e Kick.',
    },
  },
} as const satisfies Record<string, LocalizedMeta>;
