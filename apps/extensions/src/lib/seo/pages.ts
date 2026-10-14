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
        'Thirteen free overlays and tools for Twitch and Kick streamers: chat box, emote wall, alerts, sub goal, subathon, frames, countdown, poll, raffle and wheel.',
    },
    de: {
      title: 'Kostenlose Twitch- und Kick-Overlays für OBS | Senchabot',
      description:
        'Dreizehn Overlays und Tools für Twitch- und Kick-Streamer: Chat-Box, Emote-Wand, Alerts, Sub-Ziel, Subathon, Rahmen, Countdown, Umfrage, Verlosung, Glücksrad.',
    },
    tr: {
      title: "OBS için Ücretsiz Twitch ve Kick Overlay'leri | Senchabot",
      description:
        'Twitch ve Kick yayıncıları için 13 ücretsiz overlay ve araç: sohbet, emote duvarı, uyarılar, abone hedefi, subathon, geri sayım, anket, çekiliş ve çark.',
    },
    es: {
      title: 'Overlays gratis de Twitch y Kick para OBS | Senchabot',
      description:
        'Trece overlays y herramientas gratis para streamers de Twitch y Kick: chat, emotes, alertas, meta de subs, subathon, marcos, encuestas, sorteos y ruleta.',
    },
    fr: {
      title: 'Overlays Twitch et Kick gratuits pour OBS | Senchabot',
      description:
        "Treize overlays et outils pour streamers Twitch et Kick : boîte de chat, mur d'emotes, alertes, objectif de subs, subathon, cadres, sondage, tirage et roue.",
    },
    ja: {
      title: 'OBS用の無料Twitch・Kickオーバーレイ | Senchabot Extensions',
      description:
        'TwitchとKickの配信者向けの無料オーバーレイとツールが13種類。チャットボックス、エモートウォール、アラート、目標、サブアソン、フレーム、投票、抽選、ルーレット。',
    },
    pt: {
      title: 'Overlays grátis Twitch e Kick no OBS | Senchabot Extensions',
      description:
        'Treze overlays e ferramentas grátis para streamers Twitch e Kick: chat, emotes, alertas, meta de subs, subathon, molduras, contagem, enquete, sorteio e roleta.',
    },
  },
  'chat-box': {
    en: {
      title: 'Twitch + Kick Chat Overlay for OBS (Free) | Senchabot',
      description:
        'Merge Twitch and Kick chat into one OBS browser source (400×600). 7TV emotes on both platforms, BTTV and FFZ on Twitch, plus filters for bots and ! commands.',
    },
    de: {
      title: 'Twitch + Kick Chat-Overlay für OBS (kostenlos) | Senchabot',
      description:
        'Vereine Twitch- und Kick-Chat in einer OBS-Browserquelle (400×600). 7TV-Emotes auf beiden Plattformen, BTTV und FFZ auf Twitch, Filter für Bots und !-Befehle.',
    },
    tr: {
      title: "Ücretsiz Twitch + Kick Sohbet Overlay'i (OBS) | Senchabot",
      description:
        "Twitch ve Kick sohbetini tek bir OBS Tarayıcı Kaynağı'nda birleştir (400×600). İki platformda 7TV, Twitch'te BTTV ve FFZ emote'ları, bot ve ! komutu filtresi.",
    },
    es: {
      title: 'Overlay de chat Twitch + Kick para OBS (gratis) | Senchabot',
      description:
        'Junta el chat de Twitch y Kick en una fuente de navegador de OBS (400×600). Emotes de 7TV en ambas, BTTV y FFZ en Twitch, y filtros para bots y comandos con !.',
    },
    fr: {
      title: 'Overlay de chat Twitch + Kick pour OBS (gratuit) | Senchabot',
      description:
        'Réunis les chats Twitch et Kick dans une source navigateur OBS (400×600). Emotes 7TV sur les deux, BTTV et FFZ sur Twitch, et filtres pour bots et commandes !.',
    },
    ja: {
      title: 'TwitchとKickのチャットオーバーレイ（無料） | Senchabot',
      description:
        'TwitchとKickのチャットを、OBSのブラウザソースひとつ（400×600）にまとめます。7TVのエモートは両方で、BTTVとFFZはTwitchで表示。ボットや「!」コマンドも隠せます。',
    },
    pt: {
      title: 'Overlay de chat Twitch + Kick para OBS (grátis) | Senchabot',
      description:
        'Junte o chat da Twitch e da Kick em uma fonte de navegador do OBS (400×600). Emotes 7TV nas duas plataformas, BTTV e FFZ na Twitch, e filtro de bots e comandos.',
    },
  },
  'emote-wall': {
    en: {
      title: 'Emote Wall Overlay for Twitch, Kick & 7TV | Senchabot',
      description:
        'Emote-only Twitch and Kick messages pop up on stream in Calm, Chaos, Bounce, Glide, Spin, Burst or Random mode, with 7TV emotes included. Free, no login.',
    },
    de: {
      title: 'Emote-Wand-Overlay für Twitch, Kick und 7TV | Senchabot',
      description:
        'Nachrichten aus Twitch und Kick laufen im Modus Ruhig, Chaos, Abprallen, Gleiten, Drehung, Explosion oder Zufällig, mit 7TV-Emotes. Gratis, ohne Login.',
    },
    tr: {
      title: "Twitch, Kick ve 7TV için Emote Duvarı Overlay'i | Senchabot",
      description:
        "Sadece emote'tan oluşan Twitch ve Kick mesajları Sakin, Kaos, Sekme, Süzülme, Dönme, Patlama ya da Rastgele modunda uçuşur. 7TV emote'ları dahil. Ücretsiz.",
    },
    es: {
      title: 'Muro de Emotes para Twitch, Kick y 7TV | Senchabot',
      description:
        'Emotes solo de Twitch y Kick en stream en modo Tranquilo, Caos, Rebote, Planeo, Giro, Estallido o Aleatorio, con los emotes 7TV del canal. Gratis, sin login.',
    },
    fr: {
      title: "Mur d'emotes pour Twitch, Kick et 7TV | Senchabot",
      description:
        'Emotes Twitch et Kick passent sur le stream en mode Calme, Chaos, Rebond, Glissade, Rotation, Explosion ou Aléatoire, 7TV incluses. Gratuit, sans login.',
    },
    ja: {
      title: 'Twitch・Kick・7TV対応のエモートウォール | Senchabot',
      description:
        'TwitchとKickのエモートだけのメッセージが、おだやか、カオス、バウンス、グライド、スピン、バースト、ランダムのモードで配信画面に飛び出します。Twitchチャンネルの7TVエモートにも対応。無料でログイン不要。',
    },
    pt: {
      title: 'Mural de Emotes para Twitch, Kick e 7TV | Senchabot',
      description:
        'Emotes de Twitch e Kick aparecem na live no modo Calmo, Caos, Quicar, Deslize, Giro, Explosão ou Aleatório, com os emotes 7TV do seu canal. Grátis, sem login.',
    },
  },
  'sub-sprout': {
    en: {
      title: 'Sub Sprout: Sub Goal Plant Overlay for Twitch & Kick',
      description:
        'A plant overlay that grows one stage with every new sub, resub or gifted sub on Twitch and Kick. Pick one of 10 plants and add rain or sparkles. Free, no login.',
    },
    de: {
      title: 'Sub Sprout: Sub-Ziel-Pflanze für Twitch und Kick',
      description:
        'Ein Pflanzen-Overlay, das mit jedem neuen Sub, Resub oder Gift-Sub auf Twitch und Kick eine Stufe wächst. Wähl aus 10 Pflanzen, mit Regen oder Glitzer. Gratis.',
    },
    tr: {
      title: 'Sub Sprout: Twitch ve Kick için Abone Hedefi Bitkisi',
      description:
        "Twitch ve Kick'te her yeni abonelik, yenileme ya da hediye abonelikle bir aşama büyüyen bitki overlay'i. 10 bitkiden birini seç, yağmur ya da parıltı ekle.",
    },
    es: {
      title: 'Sub Sprout: planta de meta de subs para Twitch y Kick',
      description:
        'Un overlay de planta que crece una etapa con cada sub, resub o sub regalada en Twitch y Kick. Elige entre 10 plantas, con lluvia o destellos. Gratis, sin login.',
    },
    fr: {
      title: "Sub Sprout : plante d'objectif de subs Twitch et Kick",
      description:
        "Une plante qui grandit d'un stade à chaque sub, resub ou sub offert sur Twitch et Kick. Choisis parmi 10 plantes, avec pluie ou étincelles. Gratuit, sans login.",
    },
    ja: {
      title: 'Sub Sprout: TwitchとKickのサブスク目標の植物',
      description:
        'TwitchとKickで新規サブスク、継続サブスク、ギフトサブが入るたびに1段階育つ植物のオーバーレイ。10種類の植物から選べ、雨やキラキラの演出も。無料でログイン不要。',
    },
    pt: {
      title: 'Sub Sprout: planta de meta de subs para Twitch e Kick',
      description:
        'Um overlay de planta que cresce um estágio a cada sub, resub ou sub de presente na Twitch e na Kick. Escolha entre 10 plantas e coloque chuva ou brilho. Grátis.',
    },
  },
  subathon: {
    en: {
      title: 'Subathon Timer for Twitch & Kick (Free) | Senchabot',
      description:
        'A free subathon timer overlay for OBS. Subs, gifted subs, Bits and Kicks add time. Show it as a health bar, a clock or a ring. Mods control it from chat.',
    },
    de: {
      title: 'Subathon Timer für Twitch und Kick (kostenlos) | Senchabot',
      description:
        'Ein kostenloser Subathon Timer für OBS. Subs, Gift-Subs, Bits und Kicks geben Zeit dazu. Als Lebensbalken, Uhr oder Ring. Deine Mods steuern ihn aus dem Chat.',
    },
    tr: {
      title: 'Twitch ve Kick için Subathon Timer (Ücretsiz) | Senchabot',
      description:
        "OBS için ücretsiz subathon sayacı overlay'i. Abonelik, hediye abonelik, Bits ve Kicks süre ekler. Can barı, saat ya da halka seç, modlar sohbetten yönetsin.",
    },
    es: {
      title: 'Subathon Timer para Twitch y Kick (gratis) | Senchabot',
      description:
        'Un subathon timer gratis para OBS. Subs, subs regaladas, Bits y Kicks suman tiempo. Barra de vida, reloj o anillo. Tus mods lo controlan desde el chat.',
    },
    fr: {
      title: 'Subathon Timer pour Twitch et Kick (gratuit) | Senchabot',
      description:
        'Un timer de subathon gratuit pour OBS. Subs, subs offerts, Bits et Kicks ajoutent du temps. En barre de vie, horloge ou anneau. Les modos le pilotent du chat.',
    },
    ja: {
      title: 'TwitchとKickのSubathon Timer（無料） | Senchabot',
      description:
        'OBS用の無料サブアソンタイマー。サブスク、ギフトサブ、Bits、Kicksで時間が増えます。HPバー、時計、リングで表示でき、モデレーターがチャットから操作できます。',
    },
    pt: {
      title: 'Subathon Timer para Twitch e Kick (grátis) | Senchabot',
      description:
        'Subathon timer grátis para o OBS. Subs, subs de presente, Bits e Kicks somam tempo. Mostre como barra de vida, relógio ou anel. Os mods controlam pelo chat.',
    },
  },
  'stream-alerts': {
    en: {
      title: 'Animated Stream Alerts for Twitch & Kick (Free) | Senchabot',
      description:
        'Free animated stream alerts for OBS. Subs, gifted subs, Bits, Kicks and raids on Twitch and Kick each get an alert with a sound. No login, no download.',
    },
    de: {
      title: 'Animierte Stream-Alerts für Twitch und Kick | Senchabot',
      description:
        'Kostenlose animierte Stream-Alerts für OBS. Subs, Gift-Subs, Bits, Kicks und Raids auf Twitch und Kick lösen je einen Alert mit Sound aus. Kein Login nötig.',
    },
    tr: {
      title: 'Twitch ve Kick için Yayın Uyarıları (Ücretsiz) | Senchabot',
      description:
        "OBS için ücretsiz animasyonlu yayın uyarıları. Twitch ve Kick'te her abonelik, hediye abonelik, Bits, Kicks ve raid için sesli uyarı. Giriş yok, indirme yok.",
    },
    es: {
      title: 'Alertas animadas para Twitch y Kick (gratis) | Senchabot',
      description:
        'Alertas animadas gratis para OBS. Subs, subs regaladas, Bits, Kicks y raids de Twitch y Kick tienen cada uno su alerta con sonido. Sin login y sin descargas.',
    },
    fr: {
      title: 'Alertes de stream animées Twitch et Kick | Senchabot',
      description:
        'Des alertes de stream animées et gratuites pour OBS. Subs, subs offerts, Bits, Kicks et raids sur Twitch et Kick ont chacun leur alerte sonore. Sans connexion.',
    },
    ja: {
      title: 'TwitchとKickの配信アラート（無料） | Senchabot',
      description:
        'OBS用の無料アニメーション配信アラート。TwitchとKickのサブスク、ギフトサブ、Bits、Kicks、レイドに、それぞれ効果音付きのアラートを表示。ログインもダウンロードも不要。',
    },
    pt: {
      title: 'Alertas animados para Twitch e Kick (grátis) | Senchabot',
      description:
        'Alertas animados grátis para o OBS. Subs, subs de presente, Bits, Kicks e raids na Twitch e na Kick ganham cada um um alerta com som. Sem login, sem download.',
    },
  },
  goal: {
    en: {
      title: 'Free Sub Goal Overlay for Twitch & Kick | Senchabot',
      description:
        'A free sub goal overlay for OBS. Every sub, resub and gifted sub on Twitch and Kick fills the bar, with a trophy when you hit the goal. Mods fix it from chat.',
    },
    de: {
      title: 'Kostenloses Sub-Ziel-Overlay für Twitch und Kick | Senchabot',
      description:
        'Ein kostenloses Sub-Ziel für OBS. Jeder Sub, Resub und Gift-Sub auf Twitch und Kick füllt den Balken, am Ziel gibt es einen Pokal. Mods korrigieren im Chat.',
    },
    tr: {
      title: 'Twitch ve Kick için Abone Hedefi Barı (Ücretsiz) | Senchabot',
      description:
        "OBS için ücretsiz abone hedefi barı. Twitch ve Kick'te her abonelik, yenileme ve hediye abonelik 1 ekler, hedefe ulaşınca kupa iner. Modlar sohbetten düzeltir.",
    },
    es: {
      title: 'Meta de subs gratis para Twitch y Kick | Senchabot',
      description:
        'Una meta de subs gratis para OBS. Cada sub, resub y sub regalada de Twitch y Kick llena la barra, con un trofeo al llegar. Los mods la corrigen desde el chat.',
    },
    fr: {
      title: 'Objectif de subs gratuit pour Twitch et Kick | Senchabot',
      description:
        'Un objectif de subs gratuit pour OBS. Chaque sub, resub et sub offert sur Twitch et Kick remplit la barre, avec un trophée au but. Tes modos le règlent en chat.',
    },
    ja: {
      title: 'TwitchとKickの無料サブスク目標オーバーレイ | Senchabot',
      description:
        'OBS用の無料サブスク目標オーバーレイ。TwitchとKickのサブスク、継続サブスク、ギフトサブでバーが埋まり、達成するとトロフィーが登場。モデレーターはチャットから修正できます。',
    },
    pt: {
      title: 'Meta de subs grátis para Twitch e Kick | Senchabot',
      description:
        'Meta de subs grátis no OBS. Todo sub, resub e sub de presente na Twitch e na Kick enche a barra, com um troféu quando você bate a meta. Os mods ajustam no chat.',
    },
  },
  'follower-goal': {
    en: {
      title: 'Free Follower Goal Overlay for Twitch & Kick | Senchabot',
      description:
        'A free follower goal overlay for OBS with real-time updates. Every new follow on Twitch and Kick fills the bar live on stream, with a celebratory trophy when you hit the goal.',
    },
    de: {
      title: 'Kostenloses Follower-Ziel-Overlay für Twitch und Kick | Senchabot',
      description:
        'Ein kostenloses Follower-Ziel für OBS mit Echtzeit-Updates. Jeder neue Follower auf Twitch und Kick füllt den Balken live im Stream, am Ziel gibt es einen Pokal.',
    },
    tr: {
      title: 'Twitch ve Kick için Takipçi Hedefi Barı (Ücretsiz) | Senchabot',
      description:
        "OBS için gerçek zamanlı güncellemelerle çalışan ücretsiz takipçi hedefi barı. Twitch ve Kick'te her yeni takipçi yayında canlı olarak 1 ekler, hedefe ulaşınca kupa iner.",
    },
    es: {
      title: 'Meta de seguidores gratis para Twitch y Kick | Senchabot',
      description:
        'Una meta de seguidores gratis para OBS con actualizaciones en tiempo real. Cada nuevo seguidor de Twitch y Kick llena la barra en directo, con un trofeo al llegar a la meta.',
    },
    fr: {
      title: 'Objectif de followers gratuit pour Twitch et Kick | Senchabot',
      description:
        'Un objectif de followers gratuit pour OBS avec mises à jour en temps réel. Chaque nouveau follow sur Twitch et Kick remplit la barre en direct, avec un trophée au but.',
    },
    ja: {
      title: 'TwitchとKickの無料フォロワー目標オーバーレイ | Senchabot',
      description:
        'OBS用のリアルタイム更新対応無料フォロワー目標オーバーレイ。TwitchとKickの新しいフォローでバーが埋まり、達成するとトロフィーが登場します。',
    },
    pt: {
      title: 'Meta de seguidores grátis para Twitch e Kick | Senchabot',
      description:
        'Meta de seguidores grátis no OBS com atualizações em tempo real. Cada novo seguidor na Twitch e na Kick enche a barra ao vivo, com um troféu quando você bate a meta.',
    },
  },
  frames: {
    en: {
      title: 'Free Stream Frame Overlays for Twitch & Kick | Senchabot',
      description:
        'Free camera, chat and screen frames for OBS. Presets with the feel of Metin2, LoL, WoW, Valorant and Minecraft, with the art included. No login, no download.',
    },
    de: {
      title: 'Kostenlose Stream-Rahmen für Twitch und Kick | Senchabot',
      description:
        'Kostenlose Rahmen für Kamera, Chat und Bildschirm in OBS. Presets im Stil von Metin2, LoL, WoW, Valorant und Minecraft, Grafiken inklusive. Ohne Login.',
    },
    tr: {
      title: 'Twitch ve Kick için Yayın Çerçeveleri (Ücretsiz) | Senchabot',
      description:
        "OBS için ücretsiz kamera, sohbet ve ekran çerçeveleri. Metin2, LoL, WoW, Valorant ve Minecraft havasında preset'ler, hazır çizimlerle. Giriş yok, indirme yok.",
    },
    es: {
      title: 'Marcos gratis para tu stream de Twitch y Kick | Senchabot',
      description:
        'Marcos gratis de cámara, chat y pantalla para OBS. Presets al estilo de Metin2, LoL, WoW, Valorant y Minecraft, con el arte incluido. Sin login y sin descargas.',
    },
    fr: {
      title: 'Cadres de stream gratuits pour Twitch et Kick | Senchabot',
      description:
        "Des cadres gratuits pour caméra, chat et écran dans OBS. Des presets dans l'esprit de Metin2, LoL, WoW, Valorant et Minecraft, dessins inclus. Sans connexion.",
    },
    ja: {
      title: 'TwitchとKickの無料配信フレーム | Senchabot',
      description:
        'OBS用の無料のカメラ、チャット、画面フレーム。Metin2、LoL、WoW、Valorant、Minecraftの雰囲気のプリセットで、イラストも付いています。ログインもダウンロードも不要。',
    },
    pt: {
      title: 'Molduras de live grátis para Twitch e Kick | Senchabot',
      description:
        'Molduras grátis de câmera, chat e tela para o OBS. Presets com a vibe de Metin2, LoL, WoW, Valorant e Minecraft, com a arte incluída. Sem login, sem download.',
    },
  },
  'irl-hud': {
    en: {
      title: 'Free IRL HUD Overlay: Cash Counter & Mini-Map | Senchabot',
      description:
        'A free IRL HUD Overlay for OBS. Subs, gifted subs, Bits, Kicks and raids add cash on Twitch and Kick, with a clock in your time zone and a mini-map radar.',
    },
    de: {
      title: 'Gratis IRL-HUD-Overlay: Geldzähler & Minikarte | Senchabot',
      description:
        'Ein kostenloses IRL-HUD-Overlay für OBS. Subs, Gift-Subs, Bits, Kicks und Raids bringen Geld auf Twitch und Kick, mit Uhr in deiner Zeitzone und Minikarte.',
    },
    tr: {
      title: 'Ücretsiz IRL HUD Overlay: Para ve Mini Harita | Senchabot',
      description:
        "OBS için ücretsiz IRL HUD Overlay. Twitch ve Kick'te abonelik, hediye abonelik, Bits, Kicks ve raid'ler para ekler; saat diliminde saat ve mini harita da var.",
    },
    es: {
      title: 'Overlay HUD IRL con contador y minimapa (gratis) | Senchabot',
      description:
        'Un Overlay HUD IRL gratis para OBS. Subs, subs regaladas, Bits, Kicks y raids suman dinero en Twitch y Kick, con un reloj en tu zona horaria y un minimapa.',
    },
    fr: {
      title: "Overlay HUD IRL, compteur d'argent et mini-carte | Senchabot",
      description:
        "Un Overlay HUD IRL gratuit pour OBS. Subs, subs offerts, Bits, Kicks et raids ajoutent de l'argent sur Twitch et Kick, avec une horloge et une mini-carte.",
    },
    ja: {
      title: 'IRL HUDオーバーレイ: 所持金カウンターとミニマップ（無料） | Senchabot',
      description:
        'OBS用の無料IRL HUDオーバーレイ。TwitchとKickのサブスク、ギフトサブ、Bits、Kicks、レイドで所持金が増えます。自分のタイムゾーンの時計とミニマップも表示できます。',
    },
    pt: {
      title: 'Overlay HUD IRL com contador e minimapa (grátis) | Senchabot',
      description:
        'Um Overlay HUD IRL grátis para o OBS. Subs, subs de presente, Bits, Kicks e raids somam dinheiro na Twitch e na Kick, com relógio no seu fuso e um minimapa.',
    },
  },
  counter: {
    en: {
      title: 'Free Win Counter Overlay for Twitch & Kick | Senchabot',
      description:
        'A free win counter for OBS: show wins, losses or any count on Twitch and Kick, up to four at once. You and your mods change them from chat. No login needed.',
    },
    de: {
      title: 'Kostenloser Siegzähler für Twitch und Kick | Senchabot',
      description:
        'Ein kostenloser Siegzähler für OBS: Siege, Niederlagen oder jede andere Zahl auf Twitch und Kick, bis zu vier auf einmal. Du und deine Mods ändert sie im Chat.',
    },
    tr: {
      title: 'Twitch ve Kick için Galibiyet Sayacı (Ücretsiz) | Senchabot',
      description:
        "OBS için ücretsiz galibiyet sayacı: Twitch ve Kick'te galibiyetleri, mağlubiyetleri ya da her sayıyı dörde kadar göster. Modların sohbetten değiştirir.",
    },
    es: {
      title: 'Contador de victorias gratis para Twitch y Kick | Senchabot',
      description:
        'Un contador de victorias gratis para OBS: victorias, derrotas o cualquier número en Twitch y Kick, hasta cuatro a la vez. Tus mods lo cambian en el chat.',
    },
    fr: {
      title: 'Compteur de victoires pour Twitch et Kick | Senchabot',
      description:
        "Compteur de victoires gratuit pour OBS : victoires, défaites ou tout autre nombre sur Twitch et Kick, jusqu'à quatre à la fois. Tes modos le règlent en chat.",
    },
    ja: {
      title: 'TwitchとKickの無料勝敗カウンターオーバーレイ | Senchabot',
      description:
        'OBS用の無料カウンター。TwitchとKickで勝ち、負けなど好きな数を最大4つまで同時に表示。配信者とモデレーターはチャットのコマンドで数を変更できます。ログイン不要。',
    },
    pt: {
      title: 'Contador de vitórias grátis para Twitch e Kick | Senchabot',
      description:
        'Um contador de vitórias grátis no OBS: vitórias, derrotas ou qualquer número na Twitch e na Kick, até quatro de uma vez. Os mods mudam pelo chat. Sem login.',
    },
  },
  tasks: {
    en: {
      title: 'Free Co-working Task List for Twitch & Kick | Senchabot',
      description:
        'A free co-working task list for OBS: viewers add tasks from Twitch or Kick chat with !task and tick them off with !done. Made for study streams. No login.',
    },
    de: {
      title: 'Co-Working-Aufgabenliste für Twitch und Kick | Senchabot',
      description:
        'Kostenlose Co-Working-Aufgabenliste für OBS: Zuschauer tragen Aufgaben mit !task im Twitch- oder Kick-Chat ein und haken sie mit !done ab. Für Lern-Streams.',
    },
    tr: {
      title: 'Twitch ve Kick için Co-working Görev Listesi | Senchabot',
      description:
        'OBS için ücretsiz co-working görev listesi: izleyiciler Twitch ya da Kick sohbetinden !task ile görev ekler, !done ile tamamlar. Ders çalışma yayınları için.',
    },
    es: {
      title: 'Lista de tareas de coworking para Twitch y Kick | Senchabot',
      description:
        'Una lista de tareas de coworking gratis para OBS: los espectadores añaden tareas desde el chat de Twitch o Kick con !task y las tachan con !done. Sin login.',
    },
    fr: {
      title: 'Liste de tâches coworking pour Twitch et Kick | Senchabot',
      description:
        'Une liste de tâches de coworking gratuite pour OBS : les viewers ajoutent leurs tâches depuis le chat Twitch ou Kick avec !task et les cochent avec !done.',
    },
    ja: {
      title: '作業配信向けの無料タスクリスト（Twitch・Kick） | Senchabot',
      description:
        'OBS用の無料タスクリスト。視聴者はTwitchやKickのチャットで !task と打ってタスクを追加し、!done でチェックを付けます。作業配信や勉強配信に。ログイン不要。',
    },
    pt: {
      title: 'Lista de tarefas de coworking na Twitch e Kick | Senchabot',
      description:
        'Uma lista de tarefas de coworking grátis no OBS: o pessoal adiciona tarefas pelo chat da Twitch ou da Kick com !task e risca com !done. Para lives de estudo.',
    },
  },
  'lower-third': {
    en: {
      title: 'Free Lower Thirds Overlay for Twitch & Kick | Senchabot',
      description:
        'Free animated lower thirds for OBS: your name or show title with lines that take turns, in a preset’s look, always on or on a timer. Mods change it with !lt.',
    },
    de: {
      title: 'Kostenlose Bauchbinde für Twitch und Kick | Senchabot',
      description:
        'Kostenlose animierte Bauchbinden für OBS: dein Name oder Showtitel mit wechselnden Zeilen im Preset-Look, immer an oder per Timer. Mods ändern sie mit !lt.',
    },
    tr: {
      title: 'Twitch ve Kick için Alt Bant (Ücretsiz) | Senchabot',
      description:
        'OBS için ücretsiz animasyonlu alt bant: adın ya da programın, sırayla değişen satırlarla, preset görünümüyle. Sürekli ya da süreli; modlar !lt ile değiştirir.',
    },
    es: {
      title: 'Rótulos animados gratis para Twitch y Kick | Senchabot',
      description:
        'Rótulos animados gratis para OBS (lower thirds): tu nombre o programa con líneas que rotan, al estilo de un preset, fijos o temporizados. Tus mods usan !lt.',
    },
    fr: {
      title: 'Bandeau animé gratuit pour Twitch et Kick | Senchabot',
      description:
        "Bandeau animé gratuit pour OBS (lower third) : ton nom avec des lignes qui se relaient, au look d'un preset, fixe ou minuté. Tes modos le changent avec !lt.",
    },
    ja: {
      title: 'TwitchとKickの無料テロップオーバーレイ | Senchabot',
      description:
        'OBS用の無料テロップ（ローワーサード）。名前や番組タイトルと順番に切り替わる行を、プリセットの見た目で表示します。常時表示もタイマー表示もでき、モデレーターは !lt で変更できます。',
    },
    pt: {
      title: 'Tarjas animadas grátis para Twitch e Kick | Senchabot',
      description:
        'Tarjas animadas grátis no OBS (lower thirds): seu nome ou programa com linhas que se revezam, no visual do preset, fixas ou num timer. Os mods mudam com !lt.',
    },
  },
  leaderboard: {
    en: {
      title: 'Free Top Gifters Leaderboard for Twitch & Kick | Senchabot',
      description:
        'A free leaderboard for OBS: your top gifters or top Bits and Kicks givers from Twitch and Kick, or labels for the latest sub, gift, cheer and raid. No login.',
    },
    de: {
      title: 'Gratis Top-Gifter-Rangliste für Twitch und Kick | Senchabot',
      description:
        'Kostenlose Rangliste für OBS: Top-Gifter oder Top-Cheerer mit Bits und Kicks von Twitch und Kick, oder Labels für den letzten Sub, Gift-Sub, Cheer und Raid.',
    },
    tr: {
      title: 'Twitch ve Kick için Hediye Sıralaması (Ücretsiz) | Senchabot',
      description:
        "OBS için ücretsiz liderlik tablosu: Twitch ve Kick'te en çok abonelik hediye edenler ya da Bits ve Kicks gönderenler, veya son abonelik, hediye, cheer ve raid.",
    },
    es: {
      title: 'Top regaladores de subs para Twitch y Kick | Senchabot',
      description:
        'Un ranking gratis para OBS: quienes más subs regalan o más Bits y Kicks envían en Twitch y Kick, o lo último en subs, regalos, cheers y raids. Sin login.',
    },
    fr: {
      title: 'Classement des subs offerts pour Twitch et Kick | Senchabot',
      description:
        'Classement gratuit pour OBS : ceux qui offrent le plus de subs ou de Bits et Kicks sur Twitch et Kick, ou des labels pour le dernier sub, cadeau, cheer et raid.',
    },
    ja: {
      title: 'TwitchとKickのギフトサブランキング（無料） | Senchabot',
      description:
        'OBS用の無料ランキング。TwitchとKickでギフトサブやBits、Kicksを多く贈った人を順位で表示し、最新のサブスク、ギフト、Cheer、レイドのラベルにもなります。ログイン不要。',
    },
    pt: {
      title: 'Ranking de subs de presente para Twitch e Kick | Senchabot',
      description:
        'Ranking grátis no OBS: quem mais dá subs de presente ou manda Bits e Kicks na Twitch e na Kick, ou rótulos com o último sub, presente, cheer e raid. Sem login.',
    },
  },
  queue: {
    en: {
      title: 'Free Viewer Queue for Twitch & Kick Streams | Senchabot',
      description:
        'A free viewer queue for OBS: viewers type !join in Twitch or Kick chat to play with you, and mods call them up with !next. The queue shows on stream. No login.',
    },
    de: {
      title: 'Zuschauer-Warteschlange für Twitch und Kick | Senchabot',
      description:
        'Eine kostenlose Zuschauer-Warteschlange für OBS: Zuschauer tippen !join im Twitch- oder Kick-Chat zum Mitspielen, und Mods rufen sie mit !next auf. Ohne Login.',
    },
    tr: {
      title: 'Twitch ve Kick için İzleyici Sırası (Ücretsiz) | Senchabot',
      description:
        'OBS için ücretsiz izleyici sırası: izleyiciler seninle oynamak için Twitch ya da Kick sohbetine !join yazar, modlar !next ile çağırır. Sıra yayında görünür.',
    },
    es: {
      title: 'Fila de espectadores para Twitch y Kick (gratis) | Senchabot',
      description:
        'Fila de espera gratis para OBS: los espectadores escriben !join en el chat de Twitch o Kick para jugar contigo, y tus mods los llaman con !next. Sin login.',
    },
    fr: {
      title: "File d'attente de viewers pour Twitch et Kick | Senchabot",
      description:
        "File d'attente gratuite pour OBS : les viewers tapent !join dans le chat Twitch ou Kick pour jouer avec toi, et tes modos les appellent avec !next. Sans login.",
    },
    ja: {
      title: 'TwitchとKickの参加型配信で使える参加待ちリスト | Senchabot',
      description:
        'OBS用の無料の参加待ちリスト。視聴者はTwitchやKickのチャットで !join と打って並び、モデレーターが !next で一緒に遊ぶ人を呼び出します。リストは配信画面に表示。ログイン不要。',
    },
    pt: {
      title: 'Fila de espectadores para Twitch e Kick (grátis) | Senchabot',
      description:
        'Uma fila de espectadores grátis para o OBS: o pessoal digita !join no chat da Twitch ou da Kick para jogar com você, e os mods chamam com !next. Sem login.',
    },
  },
  credits: {
    en: {
      title: 'Free End Credits Overlay for Twitch & Kick | Senchabot',
      description:
        'Free end credits for OBS: subs, gifted subs, Bits, Kicks, raiders, mods and chatters from Twitch and Kick roll like a movie when your ending scene goes live.',
    },
    de: {
      title: 'Kostenloses Abspann-Overlay für Twitch und Kick | Senchabot',
      description:
        'Ein kostenloser Abspann für OBS: Subs, Gift-Subs, Bits, Kicks, Raider, Mods und Chatter von Twitch und Kick laufen wie im Kino, sobald deine Endszene live geht.',
    },
    tr: {
      title: 'Twitch ve Kick için Kapanış Jeneriği (Ücretsiz) | Senchabot',
      description:
        "OBS için ücretsiz kapanış jeneriği: Twitch ve Kick'ten aboneler, hediyeler, Bits, Kicks, raid'ler, modlar ve sohbet edenler bitiş sahnende film gibi akar.",
    },
    es: {
      title: 'Créditos finales gratis para Twitch y Kick | Senchabot',
      description:
        'Créditos finales gratis para OBS: subs, subs regaladas, Bits, Kicks, raids, mods y tu chat de Twitch y Kick desfilan como en el cine en tu escena de cierre.',
    },
    fr: {
      title: 'Générique de fin gratuit pour Twitch et Kick | Senchabot',
      description:
        'Un générique de fin gratuit pour OBS : subs, subs offerts, Bits, Kicks, raids, modos et viewers de Twitch et Kick défilent comme au cinéma sur ta scène de fin.',
    },
    ja: {
      title: 'TwitchとKickの無料エンドロールオーバーレイ | Senchabot',
      description:
        'OBS用の無料エンドロール。TwitchとKickのサブスク、ギフトサブ、Bits、Kicks、レイド、モデレーター、チャットした人の名前が、終了シーンに切り替えると映画のように流れます。',
    },
    pt: {
      title: 'Créditos finais grátis para Twitch e Kick | Senchabot',
      description:
        'Créditos finais grátis no OBS: subs, subs de presente, Bits, Kicks, raids, mods e quem conversou no chat da Twitch e da Kick rolam como no cinema na cena final.',
    },
  },
  'event-list': {
    en: {
      title: 'Free Event List Overlay for Twitch & Kick | Senchabot',
      description:
        'A free recent events list for OBS: subs, resubs, gifted subs, Bits, Kicks and raids from Twitch and Kick in one list, newest first. No login, no download.',
    },
    de: {
      title: 'Kostenlose Event-Liste für Twitch und Kick | Senchabot',
      description:
        'Kostenlose Liste der letzten Events für OBS: Subs, Resubs, Gift-Subs, Bits, Kicks und Raids von Twitch und Kick in einer Liste, das Neueste zuerst. Ohne Login.',
    },
    tr: {
      title: 'Twitch ve Kick için Etkinlik Listesi (Ücretsiz) | Senchabot',
      description:
        "OBS için ücretsiz son etkinlikler listesi: Twitch ve Kick'ten abonelik, yenileme, hediye abonelik, Bits, Kicks ve raid'ler tek listede. Giriş yok, indirme yok.",
    },
    es: {
      title: 'Lista de eventos gratis para Twitch y Kick | Senchabot',
      description:
        'Una lista gratis de eventos recientes para OBS: subs, resubs, subs regaladas, Bits, Kicks y raids de Twitch y Kick juntos, lo más nuevo primero. Sin login.',
    },
    fr: {
      title: "Liste d'événements gratuite pour Twitch et Kick | Senchabot",
      description:
        'Une liste gratuite des derniers événements pour OBS : subs, resubs, subs offerts, Bits, Kicks et raids de Twitch et Kick dans une seule liste. Sans connexion.',
    },
    ja: {
      title: 'TwitchとKickの無料イベントリストオーバーレイ | Senchabot',
      description:
        'OBS用の無料イベントリスト。TwitchとKickのサブスク、継続サブスク、ギフトサブ、Bits、Kicks、レイドを新しい順にひとつのリストで表示。ログインもダウンロードも不要。',
    },
    pt: {
      title: 'Lista de eventos grátis para Twitch e Kick | Senchabot',
      description:
        'Uma lista de eventos recentes grátis no OBS: subs, resubs, subs de presente, Bits, Kicks e raids da Twitch e da Kick juntos, os mais novos primeiro. Sem login.',
    },
  },
  weather: {
    en: {
      title: 'Free Weather Overlay for OBS, Twitch & Kick | Senchabot',
      description:
        'A free live weather overlay for OBS. Pick any place and show its temperature, an icon and a forecast on Twitch, Kick or anywhere. No login or API key needed.',
    },
    de: {
      title: 'Kostenloses Wetter-Overlay für OBS, Twitch, Kick | Senchabot',
      description:
        'Ein kostenloses Live-Wetter-Overlay für OBS. Wähl einen Ort und zeig Temperatur, Symbol und Vorhersage auf Twitch, Kick und überall. Ohne Login und API-Key.',
    },
    tr: {
      title: "OBS için Ücretsiz Hava Durumu Overlay'i | Senchabot",
      description:
        "OBS için ücretsiz canlı hava durumu overlay'i. Bir yer seç; sıcaklığı, simgeyi ve tahmini Twitch, Kick ya da her yerde göster. Giriş, API anahtarı gerekmez.",
    },
    es: {
      title: 'Overlay de clima gratis para OBS, Twitch y Kick | Senchabot',
      description:
        'Un overlay de clima en vivo gratis para OBS. Elige cualquier lugar y muestra su temperatura, un ícono y el pronóstico en Twitch, Kick o donde sea. Sin login.',
    },
    fr: {
      title: 'Overlay météo gratuit pour OBS, Twitch et Kick | Senchabot',
      description:
        'Un overlay météo en direct gratuit pour OBS. Choisis un lieu et affiche sa température, une icône et les prévisions sur Twitch, Kick ou ailleurs. Sans compte.',
    },
    ja: {
      title: 'OBS用の無料天気オーバーレイ（Twitch・Kick） | Senchabot',
      description:
        'OBS用の無料の天気オーバーレイ。好きな場所を選んで、気温、天気のアイコン、風、予報をTwitchやKickの配信に表示できます。ログインもAPIキーも不要です。',
    },
    pt: {
      title: 'Overlay de clima grátis para OBS, Twitch e Kick | Senchabot',
      description:
        'Um overlay de clima ao vivo grátis para o OBS. Escolha qualquer lugar e mostre a temperatura, um ícone e a previsão na Twitch, na Kick ou onde for. Sem login.',
    },
  },
  countdown: {
    en: {
      title: 'Free Starting Soon & BRB Countdown for OBS | Senchabot',
      description:
        'A free countdown for OBS. Set a length, or the time of day you go live, for your starting, break, ending and pomodoro scenes. Your mods change it from chat.',
    },
    de: {
      title: 'Kostenloser Starting-Soon- und BRB-Countdown | Senchabot',
      description:
        'Ein kostenloser Countdown für OBS. Stell eine Dauer oder die Uhrzeit deines Streams ein, für Start-, Pausen-, End- und Pomodoro-Szene. Mods ändern ihn im Chat.',
    },
    tr: {
      title: 'Twitch ve Kick için Yayın Geri Sayımı | Senchabot',
      description:
        "OBS için ücretsiz geri sayım overlay'i. Başlangıç, mola, bitiş ve pomodoro sahnelerin için bir süre ya da 21:00 gibi bir saat belirle, modların uzatsın.",
    },
    es: {
      title: 'Cuenta regresiva gratis para OBS | Senchabot',
      description:
        'Cuenta regresiva gratis para OBS. Pon una duración, o la hora a la que empiezas, en tus escenas de inicio, pausa, cierre y pomodoro. Tus mods la cambian.',
    },
    fr: {
      title: 'Compte à rebours de début et BRB pour OBS | Senchabot',
      description:
        "Compte à rebours gratuit pour OBS. Règle une durée, ou l'heure de ton live, pour tes scènes de début, de pause, de fin et de pomodoro. Tes modos le changent.",
    },
    ja: {
      title: 'OBS用の無料の開始前・BRBカウントダウン | Senchabot',
      description:
        'OBS用の無料カウントダウンオーバーレイ。開始前、休憩、終了、ポモドーロのシーンに、時間の長さか配信を始める時刻を設定できます。モデレーターはチャットから時間を変更できます。',
    },
    pt: {
      title: 'Contagem de início e BRB grátis para OBS | Senchabot',
      description:
        'Contagem regressiva grátis para o OBS. Defina uma duração, ou o horário em que você entra ao vivo, nas cenas de início, pausa, fim e pomodoro. Os mods mudam.',
    },
  },
  poll: {
    en: {
      title: 'Free Chat Poll Overlay for Twitch & Kick | Senchabot',
      description:
        'A free chat poll overlay for OBS. Viewers on Twitch and Kick vote by typing a number, the bars fill live and the winner shows at the end. Mods run it from chat.',
    },
    de: {
      title: 'Kostenlose Chat-Umfrage für Twitch und Kick | Senchabot',
      description:
        'Kostenlose Chat-Umfrage für OBS. Twitch- und Kick-Zuschauer stimmen per Zahl ab, Balken füllen sich live, am Ende steht der Gewinner. Mods starten sie im Chat.',
    },
    tr: {
      title: 'Twitch ve Kick için Sohbet Anketi (Ücretsiz) | Senchabot',
      description:
        "OBS için ücretsiz sohbet anketi. Twitch ve Kick'te izleyiciler numara yazarak oy verir, barlar canlı dolar, sonunda kazanan çıkar. Modlar sohbetten yönetir.",
    },
    es: {
      title: 'Encuesta de chat gratis para Twitch y Kick | Senchabot',
      description:
        'Una encuesta de chat gratis para OBS. Twitch y Kick votan escribiendo un número, las barras se llenan en vivo y sale el ganador. Tus mods la lanzan en el chat.',
    },
    fr: {
      title: 'Sondage du chat gratuit pour Twitch et Kick | Senchabot',
      description:
        'Un sondage gratuit pour OBS. Les viewers Twitch et Kick votent en tapant un numéro, les barres montent en direct, puis le gagnant apparaît. Tes modos le gèrent.',
    },
    ja: {
      title: 'TwitchとKickの無料チャット投票オーバーレイ | Senchabot',
      description:
        'OBS用の無料チャット投票オーバーレイ。TwitchとKickの視聴者が番号を打って投票し、バーがリアルタイムで伸びて、最後に勝者を表示。モデレーターがチャットから操作します。',
    },
    pt: {
      title: 'Enquete no chat grátis para Twitch e Kick | Senchabot',
      description:
        'Enquete grátis para o OBS. O pessoal na Twitch e na Kick vota digitando um número, as barras enchem ao vivo e o vencedor aparece no fim. Mods comandam no chat.',
    },
  },
  raffle: {
    en: {
      title: 'Twitch & Kick Chat Giveaway Picker (Free) | Senchabot',
      description:
        'Run a chat giveaway on Twitch or Kick: viewers type !join, you set subs-only rules and a win limit, then draw a winner with a secure random pick. No login.',
    },
    de: {
      title: 'Verlosung im Twitch- und Kick-Chat (kostenlos) | Senchabot',
      description:
        'Verlosung im Twitch- oder Kick-Chat: Zuschauer tippen !join, du setzt Sub-Regeln und ein Gewinnlimit und ziehst per sicherem Zufall den Gewinner. Ohne Login.',
    },
    tr: {
      title: 'Twitch ve Kick Sohbet Çekilişi Aracı (Ücretsiz) | Senchabot',
      description:
        "Twitch ya da Kick'te sohbet çekilişi yap: izleyiciler !join yazar, sen abone şartını ve kazanma sınırını seçersin, kazanan güvenli rastgele seçimle çıkar.",
    },
    es: {
      title: 'Sorteos en el chat de Twitch y Kick (gratis) | Senchabot',
      description:
        'Sortea en el chat de Twitch o Kick: el chat escribe !join, pones reglas solo para subs y un límite de victorias, y sacas un ganador al azar seguro. Sin login.',
    },
    fr: {
      title: 'Giveaway Twitch et Kick dans le chat (gratuit) | Senchabot',
      description:
        'Un giveaway dans le chat Twitch ou Kick : les viewers tapent !join, tu fixes les règles abonnés et une limite de victoires, puis tu tires au sort. Sans login.',
    },
    ja: {
      title: 'TwitchとKickのチャット抽選ツール（無料） | Senchabot',
      description:
        'TwitchやKickでチャット抽選。視聴者は !join と打って参加し、サブスク限定のルールや当選回数の上限を設定して、安全なランダム選択で当選者を決めます。ログイン不要。',
    },
    pt: {
      title: 'Sorteio no chat da Twitch e da Kick (grátis) | Senchabot',
      description:
        'Sorteio no chat da Twitch ou da Kick: o pessoal digita !join, você define só inscritos e limite de vitórias, e sorteia o vencedor de forma segura. Sem login.',
    },
  },
  'obs-bridge': {
    en: {
      title: 'Switch OBS Scenes from Twitch & Kick Chat | Senchabot',
      description:
        'Let mods switch OBS scenes from Twitch or Kick chat with !scene, brb and back, or start and stop the stream. Runs in a browser tab and talks to obs-websocket 5.',
    },
    de: {
      title: 'OBS-Szenen per Twitch- und Kick-Chat wechseln | Senchabot',
      description:
        'Lass Mods OBS-Szenen im Twitch- oder Kick-Chat mit !scene, brb und back wechseln oder den Stream starten und stoppen. Läuft im Browser-Tab mit obs-websocket 5.',
    },
    tr: {
      title: 'Twitch ve Kick Sohbetinden OBS Sahnesi Değiştir | Senchabot',
      description:
        'Modlar Twitch ya da Kick sohbetinden !scene, brb ve back ile OBS sahnesini değiştirsin, yayını başlatıp durdursun. Tarayıcıda çalışır, obs-websocket 5 kullanır.',
    },
    es: {
      title: 'Cambia escenas de OBS desde el chat de Twitch y Kick',
      description:
        'Tus mods cambian escenas de OBS desde el chat de Twitch o Kick con !scene, brb y back, o inician y detienen el stream. Va en una pestaña y usa obs-websocket 5.',
    },
    fr: {
      title: 'Change de scène OBS depuis le chat Twitch et Kick',
      description:
        'Tes modos changent de scène OBS depuis le chat Twitch ou Kick avec !scene, brb et back, ou lancent et coupent le stream. Tourne en onglet, via obs-websocket 5.',
    },
    ja: {
      title: 'TwitchとKickのチャットでOBSのシーン切り替え | Senchabot',
      description:
        'TwitchやKickのチャットから !scene、brb、back でモデレーターがOBSのシーンを切り替えたり、配信を開始・終了したりできます。ブラウザのタブで動き、obs-websocket 5と通信します。',
    },
    pt: {
      title: 'Troque cenas do OBS pelo chat da Twitch e Kick | Senchabot',
      description:
        'Deixe os mods trocarem cenas do OBS pelo chat da Twitch ou da Kick com !scene, brb e back, ou iniciar e parar a live. Roda numa aba e usa o obs-websocket 5.',
    },
  },
  socials: {
    en: {
      title: 'Free Social Media Rotation Widget for OBS | Senchabot',
      description:
        'Display your social media handles (Twitter, YouTube, TikTok, Instagram) on your Twitch or Kick stream. Rotates through your links with a slick slide animation.',
    },
    de: {
      title: 'Kostenloses Social-Media-Widget für OBS | Senchabot',
      description:
        'Zeig deine Social-Media-Profile (Twitter, YouTube, TikTok, Instagram) im Twitch- oder Kick-Stream. Deine Links wechseln sich mit einer Slide-Animation ab.',
    },
    tr: {
      title: "OBS için Ücretsiz Sosyal Medya Widget'ı | Senchabot",
      description:
        'Sosyal medya hesaplarını (Twitter, YouTube, TikTok, Instagram) Twitch ya da Kick yayınında göster. Linklerin şık bir kaydırma animasyonuyla sırayla görünür.',
    },
    es: {
      title: 'Widget de redes sociales gratis para OBS | Senchabot',
      description:
        'Muestra tus redes sociales (Twitter, YouTube, TikTok, Instagram) en tu stream de Twitch o Kick. Rota por tus enlaces con una animación de deslizamiento.',
    },
    fr: {
      title: 'Widget réseaux sociaux gratuit pour OBS | Senchabot',
      description:
        'Affiche tes pseudos (Twitter, YouTube, TikTok, Instagram) sur ton stream Twitch ou Kick. Tes liens défilent un par un avec une animation de glissement soignée.',
    },
    ja: {
      title: 'OBS用の無料SNSローテーションウィジェット | Senchabot',
      description:
        'TwitchやKickの配信に、SNSのアカウント（Twitter、YouTube、TikTok、Instagram）を表示。なめらかなスライドアニメーションで、リンクを順番に切り替えます。',
    },
    pt: {
      title: 'Widget grátis de redes sociais para OBS | Senchabot',
      description:
        'Mostre seus perfis (Twitter, YouTube, TikTok, Instagram) na sua live da Twitch ou da Kick. Os links se revezam na tela com uma animação caprichada de deslizar.',
    },
  },
  'spin-wheel': {
    en: {
      title: 'Free Spin Wheel Tool for Streamers | Senchabot',
      description:
        'Viewers type !spin in Twitch or Kick chat and the wheel spins live in your OBS overlay at 800x800, behind one global cooldown for everyone. No login needed.',
    },
    de: {
      title: 'Glücksrad Tool für Streamer (kostenlos) | Senchabot',
      description:
        'Zuschauer tippen !spin in den Twitch- oder Kick-Chat und das Rad dreht live in deinem OBS-Overlay bei 800x800, mit einem globalen Cooldown für alle. Ohne Login.',
    },
    tr: {
      title: 'Yayıncılar için Ücretsiz Çark Aracı | Senchabot',
      description:
        'İzleyiciler Twitch ya da Kick sohbetine !spin yazar, çark OBS overlay’inde 800x800 canlı döner; herkes için tek bir bekleme süresi vardır. Giriş gerekmez.',
    },
    es: {
      title: 'Ruleta gratis para streamers | Senchabot',
      description:
        'Tus espectadores escriben !spin en el chat de Twitch o Kick y la ruleta gira en vivo en tu overlay de OBS a 800x800, con un enfriamiento global. Sin login.',
    },
    fr: {
      title: 'Roue gratuite pour streamers | Senchabot',
      description:
        'Tes viewers tapent !spin dans le chat Twitch ou Kick et la roue tourne en direct dans ton overlay OBS en 800x800, avec un seul cooldown global. Sans connexion.',
    },
    ja: {
      title: '無料の配信ルーレットツール | Senchabot',
      description:
        '視聴者がTwitchやKickのチャットで!spinと入力すると、800x800のOBSオーバーレイでルーレットが回ります。共通クールダウン付きでログイン不要です。',
    },
    pt: {
      title: 'Roleta grátis para streamers | Senchabot',
      description:
        'Seus espectadores digitam !spin no chat da Twitch ou da Kick e a roleta gira ao vivo no seu overlay do OBS em 800x800, com um cooldown global. Sem login.',
    },
  },
  notFound: {
    en: {
      title: 'Page Not Found | Senchabot Extensions',
      description:
        "This page doesn't exist on Senchabot Extensions. Pick one of the free Twitch and Kick widgets, like Chat Box or Emote Wall, or go back to the home page.",
    },
    de: {
      title: 'Seite nicht gefunden | Senchabot Extensions',
      description:
        'Diese Seite gibt es auf Senchabot Extensions nicht. Wähl ein kostenloses Twitch- und Kick-Widget wie die Chat-Box oder Emote-Wand oder geh zur Startseite.',
    },
    tr: {
      title: 'Sayfa Bulunamadı | Senchabot Extensions',
      description:
        "Aradığın sayfa Senchabot Extensions'ta yok. Sohbet Kutusu ya da Emote Duvarı gibi ücretsiz Twitch ve Kick widget'larından birini seç ya da ana sayfaya geri dön.",
    },
    es: {
      title: 'Página no encontrada | Senchabot Extensions',
      description:
        'Esta página no existe en Senchabot Extensions. Elige uno de los widgets gratis para Twitch y Kick, como Caja de Chat o Muro de Emotes, o vuelve al inicio.',
    },
    fr: {
      title: 'Page introuvable | Senchabot Extensions',
      description:
        "Cette page n'existe pas sur Senchabot Extensions. Choisis un des widgets gratuits pour Twitch et Kick, comme la Boîte de chat, ou retourne à l'accueil.",
    },
    ja: {
      title: 'ページが見つかりません | Senchabot Extensions',
      description:
        'Senchabot Extensionsにこのページは存在しません。チャットボックスやエモートウォールなど、TwitchとKick向けの無料ウィジェットを選ぶか、ホームに戻ってください。',
    },
    pt: {
      title: 'Página não encontrada | Senchabot Extensions',
      description:
        'Esta página não existe no Senchabot Extensions. Escolha um dos widgets grátis para Twitch e Kick, como a Caixa de Chat ou o Mural de Emotes, ou volte ao início.',
    },
  },
  'now-playing': {
    en: {
      title: 'Free Now Playing Overlay for Spotify and OBS | Senchabot',
      description:
        'A free now playing overlay for OBS: the song you’re listening to, with its cover art, from Spotify and more through ListenBrainz or Last.fm. Twitch or Kick.',
    },
    de: {
      title: 'Kostenloses Song-Overlay für Spotify und OBS | Senchabot',
      description:
        'Ein kostenloses Now-Playing-Overlay für OBS: der Song, den du gerade hörst, mit Cover, von Spotify und mehr über ListenBrainz oder Last.fm. Für Twitch und Kick.',
    },
    tr: {
      title: "Spotify ve OBS için Şimdi Çalıyor Overlay'i | Senchabot",
      description:
        "OBS için ücretsiz şimdi çalıyor overlay'i: dinlediğin şarkı kapak görseliyle. Spotify ve dahası ListenBrainz veya Last.fm üzerinden; Twitch ve Kick'te çalışır.",
    },
    es: {
      title: 'Overlay de canción actual para Spotify y OBS | Senchabot',
      description:
        'Un overlay gratis para OBS con la canción que estás escuchando y su portada, de Spotify y más a través de ListenBrainz o Last.fm. Para Twitch y Kick. Sin login.',
    },
    fr: {
      title: 'Overlay du titre en cours pour Spotify et OBS | Senchabot',
      description:
        "Un overlay gratuit pour OBS avec le morceau que tu écoutes et sa pochette, depuis Spotify et d'autres via ListenBrainz ou Last.fm. Twitch, Kick, sans connexion.",
    },
    ja: {
      title: '再生中の曲を表示するOBSオーバーレイ（Spotify対応） | Senchabot',
      description:
        'OBS用の無料オーバーレイ。今聴いている曲をジャケット画像つきで配信画面に表示します。SpotifyなどにListenBrainzやLast.fm経由で対応。TwitchとKickで使え、ログイン不要です。',
    },
    pt: {
      title: 'Overlay da música atual para Spotify e OBS | Senchabot',
      description:
        'Um overlay grátis no OBS com a música que você está ouvindo e a capa, do Spotify e outros pelo ListenBrainz ou Last.fm. Para a Twitch e a Kick. Sem login.',
    },
  },
  'emote-combo': {
    en: {
      title: 'Emote Combo Counter for Twitch & Kick | Senchabot',
      description:
        'A free emote combo counter for OBS: when Twitch and Kick chat spam the same emote, it shows big on stream and counts every chatter. 7TV included. No login.',
    },
    de: {
      title: 'Emote-Combo-Zähler für Twitch und Kick | Senchabot',
      description:
        'Kostenloser Emote-Combo-Zähler für OBS: Spammt der Twitch- oder Kick-Chat dasselbe Emote, zeigt er es groß im Stream und zählt jeden Zuschauer. Mit 7TV.',
    },
    tr: {
      title: 'Twitch ve Kick için Emote Kombo Sayacı | Senchabot',
      description:
        "OBS için ücretsiz emote kombo sayacı: Twitch ya da Kick sohbeti aynı emote'u art arda atınca yayında büyükçe belirir, her izleyiciyle sayı artar. 7TV dahil.",
    },
    es: {
      title: 'Contador de combos de emotes para Twitch y Kick | Senchabot',
      description:
        'Un contador de combos de emotes gratis para OBS: cuando el chat de Twitch o Kick manda el mismo emote, sale en grande y suma a cada espectador. Con 7TV.',
    },
    fr: {
      title: "Compteur de combos d'emotes Twitch et Kick | Senchabot",
      description:
        "Compteur de combos d'emotes gratuit pour OBS : quand le chat Twitch ou Kick enchaîne la même emote, elle apparaît en grand et compte chaque viewer. 7TV inclus.",
    },
    ja: {
      title: 'Twitch・Kick対応のエモートコンボカウンター | Senchabot',
      description:
        'OBS用の無料エモートコンボカウンター。TwitchやKickのチャットで同じエモートが連打されると、配信画面に大きく表示して1人ずつ数えます。7TVにも対応。ログイン不要。',
    },
    pt: {
      title: 'Contador de combo de emotes na Twitch e Kick | Senchabot',
      description:
        'Um contador de combo de emotes grátis no OBS: quando o chat da Twitch ou da Kick manda o mesmo emote, ele aparece grandão na live e conta cada pessoa. Com 7TV.',
    },
  },
  featured: {
    en: {
      title: 'Featured Chat Message & Q&A for Twitch and Kick | Senchabot',
      description:
        'A free OBS overlay: mods type !feature in Twitch or Kick chat to put a viewer’s message on stream with its emotes, and viewers ask questions with !q. No login.',
    },
    de: {
      title: 'Chat-Highlights & Fragerunde für Twitch und Kick | Senchabot',
      description:
        'Kostenloses OBS-Overlay: Mods tippen !feature im Twitch- oder Kick-Chat und blenden die Nachricht eines Zuschauers mit Emotes ein. Fragen per !q. Ohne Login.',
    },
    tr: {
      title: 'Twitch ve Kick için Öne Çıkan Mesaj, Soru-Cevap | Senchabot',
      description:
        "OBS için ücretsiz overlay: modlar Twitch ya da Kick sohbetine !feature yazıp bir izleyicinin mesajını emote'larıyla ekrana çıkarır, izleyiciler !q ile sorar.",
    },
    es: {
      title: 'Mensaje destacado y preguntas para Twitch y Kick | Senchabot',
      description:
        'Overlay gratis para OBS: los mods escriben !feature en el chat de Twitch o Kick para mostrar el mensaje de un espectador con emotes, y el chat pregunta con !q.',
    },
    fr: {
      title: 'Message mis en avant et questions Twitch et Kick | Senchabot',
      description:
        "Overlay OBS gratuit : tes modos tapent !feature sur Twitch ou Kick pour afficher le message d'un viewer et ses emotes, et le chat pose ses questions avec !q.",
    },
    ja: {
      title: 'TwitchとKickのコメント表示とQ&Aオーバーレイ | Senchabot',
      description:
        'OBS用の無料オーバーレイ。モデレーターがTwitchやKickのチャットで !feature と打つと、視聴者のメッセージをエモートつきで配信画面に表示。視聴者は !q で質問でき、Q&Aにも使えます。ログイン不要。',
    },
    pt: {
      title: 'Mensagem em destaque e Q&A para Twitch e Kick | Senchabot',
      description:
        'Overlay grátis para o OBS: os mods digitam !feature no chat da Twitch ou da Kick para mostrar a mensagem de um espectador com emotes, e o chat pergunta com !q.',
    },
  },
  'bits-goal': {
    en: {
      title: 'Free Bits & Kicks Goal Overlay for Twitch & Kick | Senchabot',
      description:
        'A free Bits and Kicks goal overlay for OBS. Twitch cheers and Kick gifts fill one bar by their amount, and a trophy names who hit the goal. Mods fix it in chat.',
    },
    de: {
      title: 'Bits- und Kicks-Ziel für Twitch und Kick, gratis | Senchabot',
      description:
        'Ein kostenloses Bits- und Kicks-Ziel für OBS. Cheers auf Twitch und Kicks auf Kick füllen einen Balken um ihren Betrag, ein Pokal nennt, wer das Ziel erreicht.',
    },
    tr: {
      title: 'Twitch ve Kick için Ücretsiz Bits & Kicks Hedefi | Senchabot',
      description:
        "OBS için ücretsiz Bits ve Kicks hedefi. Twitch cheer'ları ve Kick hediyeleri barı miktarı kadar doldurur, hedefi tamamlayanın adı kupada yazar. Modlar düzeltir.",
    },
    es: {
      title: 'Meta de Bits y Kicks gratis para Twitch y Kick | Senchabot',
      description:
        'Una meta de Bits y Kicks gratis para OBS. Los cheers de Twitch y los regalos de Kick llenan la barra según su cantidad, y un trofeo nombra a quien la completó.',
    },
    fr: {
      title: 'Objectif de Bits et Kicks gratuit, Twitch & Kick | Senchabot',
      description:
        "Un objectif de Bits et Kicks gratuit pour OBS. Les cheers Twitch et les cadeaux Kick remplissent la barre de leur montant, et un trophée nomme qui l'a atteint.",
    },
    ja: {
      title: 'TwitchとKickの無料Bits・Kicks目標オーバーレイ | Senchabot',
      description:
        'OBS用の無料Bits・Kicks目標オーバーレイ。TwitchのCheerとKickのギフトがその数だけバーを埋め、達成させた視聴者の名前をトロフィーに表示。モデレーターはチャットから修正できます。',
    },
    pt: {
      title: 'Meta de Bits e Kicks grátis para Twitch e Kick | Senchabot',
      description:
        'Meta de Bits e Kicks grátis no OBS. Cheers da Twitch e presentes da Kick enchem a barra pela sua quantidade, e um troféu mostra quem bateu a meta. Mods ajustam.',
    },
  },
} as const satisfies Record<WidgetId | 'home' | 'notFound', LocalizedMeta>;

/** featureList of each setup page's WebApplication: facts the page itself shows. */
export const APP_FEATURES: Record<WidgetId, Record<Locale, readonly string[]>> = {
  'now-playing': {
    en: [
      'The song you’re listening to now, with its title, artist, album and cover art',
      'Reads it from ListenBrainz or Last.fm, so Spotify and most music players work',
      'A card or a one-line pill, in a preset’s look or a color you pick',
      'New songs slide in on their own, with bars that bounce while the music plays',
      'Slides away when the music stops, or stays up dimmed',
      'Works the same on Twitch, Kick or any other platform, with no chat to read',
      'No login and no API key: just your ListenBrainz or Last.fm username',
      'Recommended browser source size: 640x160',
    ],
    de: [
      'Der Song, den du gerade hörst, mit Titel, Künstler, Album und Cover',
      'Liest ihn aus ListenBrainz oder Last.fm, also klappt es mit Spotify und den meisten Musikplayern',
      'Eine Karte oder eine einzeilige Leiste, im Look eines Presets oder in einer Farbe deiner Wahl',
      'Neue Songs gleiten von selbst herein, mit Balken, die zur laufenden Musik hüpfen',
      'Gleitet hinaus, wenn die Musik stoppt, oder bleibt abgedunkelt stehen',
      'Funktioniert auf Twitch, Kick und jeder anderen Plattform gleich, ganz ohne Chat',
      'Ohne Login und ohne API-Key: nur dein Benutzername bei ListenBrainz oder Last.fm',
      'Empfohlene Größe der Browserquelle: 640x160',
    ],
    tr: [
      'Şu an dinlediğin şarkı; adı, sanatçısı, albümü ve kapak görseliyle',
      "Şarkıyı ListenBrainz ya da Last.fm'den okur; Spotify ve çoğu müzik çalar çalışır",
      "Bir kart ya da tek satır; bir preset'in görünümünde ya da seçtiğin renkte",
      'Yeni şarkılar kendiliğinden kayarak gelir, müzik çalarken çubuklar zıplar',
      'Müzik durunca kayarak çekilir ya da soluk halde ekranda kalır',
      'Sohbet okumadığı için Twitch, Kick ve diğer platformlarda aynı şekilde çalışır',
      'Giriş ya da API anahtarı yok: sadece ListenBrainz veya Last.fm kullanıcı adın',
      'Önerilen Tarayıcı Kaynağı boyutu: 640x160',
    ],
    es: [
      'La canción que estás escuchando ahora, con título, artista, álbum y portada',
      'La lee de ListenBrainz o Last.fm, así que funciona con Spotify y la mayoría de reproductores',
      'Una tarjeta o una barra de una línea, con el aspecto de un preset o el color que elijas',
      'Las canciones nuevas entran deslizándose solas, con barras que se mueven mientras suena la música',
      'Se va cuando para la música, o se queda atenuada',
      'Funciona igual en Twitch, Kick o cualquier otra plataforma, sin leer el chat',
      'Sin login ni clave de API: solo tu usuario de ListenBrainz o Last.fm',
      'Tamaño recomendado de la fuente de navegador: 640x160',
    ],
    fr: [
      'Le morceau que tu écoutes en ce moment, avec son titre, son artiste, son album et sa pochette',
      'Lu depuis ListenBrainz ou Last.fm, donc ça marche avec Spotify et la plupart des lecteurs',
      "Une carte ou un bandeau d'une ligne, au look d'un preset ou dans la couleur de ton choix",
      "Les nouveaux morceaux glissent à l'écran tout seuls, avec des barres qui bougent pendant la musique",
      "S'en va quand la musique s'arrête, ou reste affiché, assombri",
      'Fonctionne pareil sur Twitch, Kick ou toute autre plateforme, sans lire le chat',
      "Sans connexion ni clé d'API : juste ton nom d'utilisateur ListenBrainz ou Last.fm",
      'Taille de source navigateur recommandée : 640x160',
    ],
    ja: [
      '今聴いている曲を、曲名、アーティスト、アルバム、ジャケット画像つきで表示',
      'ListenBrainzやLast.fmから読み込むので、Spotifyやほとんどの音楽プレーヤーに対応',
      'カードか1行のバーを、プリセットの見た目か好きな色で表示',
      '新しい曲は自動でスライドして表示され、再生中はバーが動く',
      '音楽が止まるとスライドして消えるか、暗くなったまま残る',
      'チャットを読まないので、Twitch、Kick、そのほかのプラットフォームで同じように動作',
      'ログインもAPIキーも不要。ListenBrainzかLast.fmのユーザー名だけでOK',
      'ブラウザソースの推奨サイズ: 640x160',
    ],
    pt: [
      'A música que você está ouvindo agora, com título, artista, álbum e capa',
      'Lê a música do ListenBrainz ou do Last.fm, então funciona com o Spotify e a maioria dos players',
      'Um cartão ou uma barra de uma linha, no visual de um preset ou na cor que você escolher',
      'Músicas novas entram deslizando sozinhas, com barras que se mexem enquanto a música toca',
      'Sai quando a música para, ou fica na tela escurecido',
      'Funciona igual na Twitch, na Kick ou em qualquer outra plataforma, sem ler o chat',
      'Sem login nem chave de API: só o seu usuário do ListenBrainz ou do Last.fm',
      'Tamanho recomendado da fonte de navegador: 640x160',
    ],
  },
  'emote-combo': {
    en: [
      'Counts everyone who posts the same emote, in Twitch and Kick chat together',
      'Each chatter counts once per combo, and bots never count',
      '7TV, BTTV and FFZ emotes count, and the same 7TV emote in both chats is one combo',
      'A combo window of 3 to 30 seconds and 2 to 20 chatters before it shows',
      "The stream's best combo under the counter, saved in OBS; mods reset it with !combo reset",
      'The picked preset’s fonts and colors, or one of six colors, at 50 to 150% size',
      'Recommended browser source size: 600x400',
    ],
    de: [
      'Zählt alle, die dasselbe Emote schicken, im Twitch- und Kick-Chat zusammen',
      'Jeder Zuschauer zählt pro Combo einmal, Bots zählen nie',
      '7TV-, BTTV- und FFZ-Emotes zählen, und dasselbe 7TV-Emote in beiden Chats ist eine Combo',
      'Combo-Fenster von 3 bis 30 Sekunden und 2 bis 20 Zuschauer bis zur Anzeige',
      'Die beste Combo des Streams unter dem Zähler, in OBS gespeichert; Mods setzen sie mit !combo reset zurück',
      'Schriften und Farben des gewählten Presets oder eine von sechs Farben, in 50 bis 150 % Größe',
      'Empfohlene Größe der Browserquelle: 600x400',
    ],
    tr: [
      "Aynı emote'u atan herkesi Twitch ve Kick sohbetinde birlikte sayar",
      'Her izleyici bir komboda bir kez sayılır, botlar hiç sayılmaz',
      "7TV, BTTV ve FFZ emote'ları da sayılır; aynı 7TV emote'u iki sohbette tek kombodur",
      '3 ile 30 saniye arası kombo süresi, görünmesi için 2 ile 20 arası izleyici',
      "Yayının en iyi kombosu sayacın altında, OBS'te kayıtlı; modlar !combo reset ile sıfırlar",
      "Seçilen preset'in yazı tipleri ve renkleri ya da altı renkten biri, %50 ile %150 arası boyutta",
      'Önerilen Tarayıcı Kaynağı boyutu: 600x400',
    ],
    es: [
      'Cuenta a todos los que mandan el mismo emote, en los chats de Twitch y Kick a la vez',
      'Cada espectador cuenta una vez por combo y los bots nunca cuentan',
      'Los emotes de 7TV, BTTV y FFZ cuentan, y el mismo emote de 7TV en los dos chats es un solo combo',
      'Ventana del combo de 3 a 30 segundos y de 2 a 20 espectadores para mostrarlo',
      'El mejor combo del stream debajo del contador, guardado en OBS; los mods lo borran con !combo reset',
      'Las fuentes y los colores del preset elegido, o uno de seis colores, a un tamaño del 50 al 150 %',
      'Tamaño recomendado de la fuente de navegador: 600x400',
    ],
    fr: [
      'Compte tous ceux qui envoient la même emote, dans les chats Twitch et Kick ensemble',
      'Chaque viewer compte une fois par combo, et les bots ne comptent jamais',
      'Les emotes 7TV, BTTV et FFZ comptent, et la même emote 7TV dans les deux chats fait un seul combo',
      "Fenêtre du combo de 3 à 30 secondes et de 2 à 20 viewers avant l'affichage",
      "Le meilleur combo du stream sous le compteur, enregistré dans OBS ; les modos l'effacent avec !combo reset",
      'Les polices et les couleurs du preset choisi, ou une de six couleurs, de 50 à 150 % de taille',
      'Taille de source navigateur recommandée : 600x400',
    ],
    ja: [
      '同じエモートを送った人を、TwitchとKickのチャットで合算してカウント',
      '1つのコンボで数えるのは1人1回、ボットは数えない',
      '7TV、BTTV、FFZのエモートも対象。両方のチャットの同じ7TVエモートは1つのコンボに',
      'コンボの受付時間は3から30秒、表示までの人数は2から20人',
      '配信のベストコンボをカウンターの下に表示し、OBSに保存。モデレーターは !combo reset でリセット',
      '選んだプリセットのフォントと色、または6色から1色を使い、サイズは50から150%',
      'ブラウザソースの推奨サイズ: 600x400',
    ],
    pt: [
      'Conta todo mundo que manda o mesmo emote, no chat da Twitch e da Kick juntos',
      'Cada pessoa conta uma vez por combo, e bots nunca contam',
      'Emotes da 7TV, BTTV e FFZ contam, e o mesmo emote da 7TV nos dois chats é um combo só',
      'Janela do combo de 3 a 30 segundos e de 2 a 20 pessoas para aparecer',
      'O melhor combo da live embaixo do contador, salvo no OBS; os mods zeram com !combo reset',
      'As fontes e as cores do preset escolhido, ou uma de seis cores, em tamanho de 50 a 150%',
      'Tamanho recomendado da fonte de navegador: 600x400',
    ],
  },
  featured: {
    en: [
      'Mods put any chatter’s last message on screen with !feature @name',
      'Reads Twitch and Kick chat, with name colors, badges and emotes',
      '7TV, BTTV and FFZ emotes as well as Twitch and Kick ones',
      'Viewers ask questions with !q, one open question each',
      'Mods show the next question with !q next, or skip and clear them',
      'An optional hide timer and a questions waiting badge',
      'Questions are saved in OBS and survive reloads',
      'Recommended browser source size: 720x240',
    ],
    de: [
      'Mods blenden mit !feature @name die letzte Nachricht jedes Chatters ein',
      'Liest den Twitch- und Kick-Chat, mit Namensfarben, Badges und Emotes',
      '7TV-, BTTV- und FFZ-Emotes, dazu die von Twitch und Kick',
      'Zuschauer stellen mit !q Fragen, jeder eine offene Frage',
      'Mods zeigen mit !q next die nächste Frage, überspringen und leeren sie',
      'Optionaler Ausblende-Timer und ein Badge für wartende Fragen',
      'Die Fragen werden in OBS gespeichert und überstehen ein Neuladen',
      'Empfohlene Größe der Browserquelle: 720x240',
    ],
    tr: [
      'Modlar !feature @isim ile herhangi birinin son mesajını ekrana çıkarır',
      "Twitch ve Kick sohbetini okur; isim renkleri, rozetler ve emote'larla",
      "Twitch ve Kick emote'larının yanında 7TV, BTTV ve FFZ emote'ları",
      'İzleyiciler !q ile soru sorar, herkesin tek bir açık sorusu olur',
      'Modlar !q next ile sıradaki soruyu gösterir, soruları atlar ya da temizler',
      'İsteğe bağlı gizleme süresi ve bekleyen soru rozeti',
      "Sorular OBS'te kaydedilir, sayfa yenilense de kaybolmaz",
      'Önerilen Tarayıcı Kaynağı boyutu: 720x240',
    ],
    es: [
      'Los mods muestran el último mensaje de cualquiera con !feature @nombre',
      'Lee el chat de Twitch y Kick, con colores de nombre, insignias y emotes',
      'Emotes de 7TV, BTTV y FFZ, además de los de Twitch y Kick',
      'Los espectadores preguntan con !q, una pregunta abierta cada uno',
      'Los mods muestran la siguiente pregunta con !q next, o las descartan y vacían',
      'Temporizador opcional para ocultar y una insignia de preguntas en espera',
      'Las preguntas se guardan en OBS y aguantan las recargas',
      'Tamaño recomendado de la fuente de navegador: 720x240',
    ],
    fr: [
      "Les modos affichent le dernier message de n'importe qui avec !feature @pseudo",
      'Lit le chat Twitch et Kick, avec les couleurs de pseudo, les badges et les emotes',
      'Les emotes 7TV, BTTV et FFZ en plus de celles de Twitch et Kick',
      'Les viewers posent leurs questions avec !q, une question ouverte chacun',
      'Les modos affichent la question suivante avec !q next, ou les écartent et vident la file',
      'Un minuteur de masquage en option et un badge des questions en attente',
      'Les questions sont enregistrées dans OBS et survivent aux rechargements',
      'Taille de source navigateur recommandée : 720x240',
    ],
    ja: [
      'モデレーターは !feature @名前 でチャットした人の最新のメッセージを表示',
      'TwitchとKickのチャットを読み、名前の色、バッジ、エモートも表示',
      'TwitchとKickのエモートに加えて、7TV、BTTV、FFZのエモートにも対応',
      '視聴者は !q で質問。待っている質問はひとり1つ',
      'モデレーターは !q next で次の質問を表示。飛ばす、すべて消すことも可能',
      '自動で消すタイマーと質問待ちバッジ（任意）',
      '質問はOBSに保存され、再読み込みしても保持',
      'ブラウザソースの推奨サイズ: 720x240',
    ],
    pt: [
      'Os mods mostram a última mensagem de qualquer pessoa com !feature @nome',
      'Lê o chat da Twitch e da Kick, com cores de nome, emblemas e emotes',
      'Emotes do 7TV, BTTV e FFZ, além dos da Twitch e da Kick',
      'O pessoal pergunta com !q, uma pergunta em aberto por pessoa',
      'Os mods mostram a próxima pergunta com !q next, ou descartam e limpam a fila',
      'Um timer opcional para esconder e um selo de perguntas na fila',
      'As perguntas ficam salvas no OBS e sobrevivem a recarregamentos',
      'Tamanho recomendado da fonte de navegador: 720x240',
    ],
  },
  'bits-goal': {
    en: [
      'A goal bar that every Bits cheer on Twitch and Kicks gift on Kick fills by its amount',
      'Bits and Kicks count one for one, as each is worth about a US cent',
      'Both platforms add into one count',
      'Start from 0, or from what has already come in toward the goal',
      'A trophy celebration naming who reached the goal, and the count keeps going past it',
      'The broadcaster and mods can add, remove, set and reset the count with !bitsgoal',
      'Runs next to a Sub Goal, with its own count and its own command',
      'The count is saved in OBS and survives reloads',
      'Recommended browser source size: 800x260',
    ],
    de: [
      'Ein Zielbalken, den jeder Bits-Cheer auf Twitch und jedes Kicks-Geschenk auf Kick um seinen Betrag füllt',
      'Bits und Kicks zählen eins zu eins, beide sind etwa einen US-Cent wert',
      'Beide Plattformen zählen in einen gemeinsamen Stand',
      'Start bei 0 oder bei dem, was schon für das Ziel reingekommen ist',
      'Eine Pokal-Feier mit dem Namen dessen, der das Ziel erreicht hat, und der Zähler läuft danach weiter',
      'Streamer und Mods können den Stand mit !bitsgoal erhöhen, senken, setzen und zurücksetzen',
      'Läuft neben einem Sub-Ziel, mit eigenem Stand und eigenem Befehl',
      'Der Stand wird in OBS gespeichert und übersteht ein Neuladen',
      'Empfohlene Größe der Browserquelle: 800x260',
    ],
    tr: [
      "Twitch'te her Bits cheer'ı ve Kick'te her Kicks hediyesiyle miktarı kadar dolan hedef barı",
      'Bits ve Kicks bire bir sayılır, ikisi de yaklaşık birer ABD senti değerindedir',
      'İki platformdan gelenler tek bir sayıda toplanır',
      "0'dan ya da bu hedefe şimdiye kadar gelen miktardan başlar",
      'Hedefe ulaşınca tamamlayanın adını yazan kupa kutlaması, sayı hedefi geçince de artmaya devam eder',
      'Yayıncı ve modlar !bitsgoal ile miktar ekleyip çıkarabilir, sayıyı ayarlayıp sıfırlayabilir',
      'Kendi sayısı ve kendi komutuyla bir Abone Hedefi yanında çalışır',
      "Sayı OBS'te kaydedilir, sayfa yenilense de kaybolmaz",
      'Önerilen Tarayıcı Kaynağı boyutu: 800x260',
    ],
    es: [
      'Una barra de meta que cada cheer de Bits en Twitch y cada regalo de Kicks en Kick llena según su cantidad',
      'Los Bits y los Kicks cuentan uno por uno, ya que cada uno vale cerca de un centavo de dólar',
      'Las dos plataformas suman en un solo conteo',
      'Empieza desde 0, o desde lo que ya llevas para la meta',
      'Celebración con trofeo que nombra a quien llegó a la meta, y el conteo sigue después',
      'El streamer y los mods pueden sumar, quitar, fijar y reiniciar el conteo con !bitsgoal',
      'Funciona al lado de una Meta de Subs, con su propio conteo y su propio comando',
      'El conteo se guarda en OBS y aguanta las recargas',
      'Tamaño recomendado de la fuente de navegador: 800x260',
    ],
    fr: [
      "Une barre d'objectif que chaque cheer de Bits sur Twitch et chaque cadeau de Kicks sur Kick remplit de son montant",
      'Les Bits et les Kicks comptent un pour un, chacun valant environ un cent américain',
      "Les deux plateformes s'additionnent dans un seul compteur",
      "Démarre de 0, ou de ce qui est déjà arrivé pour l'objectif",
      "Un trophée qui nomme qui a atteint l'objectif, et le compteur continue au-delà",
      'Le streamer et les modos peuvent ajouter, retirer, définir et réinitialiser le compteur avec !bitsgoal',
      "Tourne à côté d'un Objectif de subs, avec son propre compteur et sa propre commande",
      'Le compteur est enregistré dans OBS et survit aux rechargements',
      'Taille de source navigateur recommandée : 800x260',
    ],
    ja: [
      'TwitchのBitsのCheerとKickのKicksのギフトが、その数だけ埋めていく目標バー',
      'BitsとKicksはどちらも約1米セントの価値なので1対1でカウント',
      '両方のプラットフォームの数をひとつのカウントに合算',
      '0から、またはこの目標にすでに集まった数からスタート',
      '目標を達成させた視聴者の名前を表示するトロフィーの演出。達成後もカウントは継続',
      '配信者とモデレーターは !bitsgoal でカウントを追加、削除、設定、リセット',
      '専用のカウントとコマンドで、サブスク目標と並べて使える',
      'カウントはOBSに保存され、再読み込みしても保持',
      'ブラウザソースの推奨サイズ: 800x260',
    ],
    pt: [
      'Uma barra de meta que cada cheer de Bits na Twitch e cada presente de Kicks na Kick enche pela sua quantidade',
      'Bits e Kicks contam um para um, já que cada um vale mais ou menos um centavo de dólar',
      'As duas plataformas somam na mesma contagem',
      'Começa do 0, ou do que já entrou para a meta',
      'Comemoração com troféu mostrando quem bateu a meta, e a contagem continua depois',
      'O streamer e os mods podem somar, tirar, definir e reiniciar a contagem com !bitsgoal',
      'Roda ao lado de uma Meta de Subs, com contagem e comando próprios',
      'A contagem fica salva no OBS e aguenta recarregamentos',
      'Tamanho recomendado da fonte de navegador: 800x260',
    ],
  },
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
    de: [
      'Twitch- und Kick-Chat in einem Overlay vereint',
      '7TV-Emotes auf Twitch und Kick, BTTV- und FFZ-Emotes auf Twitch',
      'Blendet bekannte Bots und Nachrichten aus, die mit ! beginnen',
      'Nachrichten bleiben 10 Sekunden bis 5 Minuten oder für immer',
      'Hervorhebung von Erwähnungen, Antworten, ersten Nachrichten, Ankündigungen und „Meine Nachricht hervorheben“',
      'Vier Nachrichten-Layouts, acht Einblend-Animationen und sechs Schriftarten',
      'Vertikale oder horizontale Ausrichtung',
      'Empfohlene Größe der Browserquelle: 400x600',
    ],
    tr: [
      "Twitch ve Kick sohbeti tek bir overlay'de birleşir",
      "Twitch ve Kick'te 7TV, Twitch'te BTTV ve FFZ emote'ları",
      'Bilinen botları ve ! ile başlayan mesajları gizler',
      'Mesajlar 10 saniye ile 5 dakika arası ya da süresiz kalır',
      'Etiketlemeler, yanıtlar, sohbete ilk katılanlar, duyurular ve Mesajımı Vurgula için vurgular',
      'Dört mesaj düzeni, sekiz giriş animasyonu ve altı yazı tipi',
      'Dikey ya da yatay yerleşim',
      'Önerilen Tarayıcı Kaynağı boyutu: 400x600',
    ],
    es: [
      'El chat de Twitch y Kick juntos en un solo overlay',
      'Emotes de 7TV en Twitch y Kick, emotes de BTTV y FFZ en Twitch',
      'Oculta los bots conocidos y los mensajes que empiezan con !',
      'Los mensajes duran de 10 segundos a 5 minutos, o para siempre',
      'Resaltados para menciones, respuestas, primeros mensajes, anuncios y Destacar mi mensaje',
      'Cuatro diseños de mensaje, ocho animaciones de entrada y seis fuentes',
      'Orientación vertical u horizontal',
      'Tamaño recomendado de la fuente de navegador: 400x600',
    ],
    fr: [
      'Les chats Twitch et Kick réunis dans un seul overlay',
      'Emotes 7TV sur Twitch et Kick, emotes BTTV et FFZ sur Twitch',
      'Masque les bots connus et les messages qui commencent par !',
      'Les messages restent de 10 secondes à 5 minutes, ou pour toujours',
      'Mises en avant pour les mentions, réponses, premiers messages, annonces et Mettre mon message en évidence',
      "Quatre mises en page, huit animations d'entrée et six polices",
      'Orientation verticale ou horizontale',
      'Taille de source navigateur recommandée : 400x600',
    ],
    ja: [
      'TwitchとKickのチャットをひとつのオーバーレイにまとめて表示',
      '7TVのエモートはTwitchとKickで、BTTVとFFZのエモートはTwitchで表示',
      '既知のボットと「!」で始まるメッセージを非表示',
      'メッセージの表示時間は10秒から5分、またはずっと表示',
      'メンション、返信、初めてのチャット、アナウンス、「メッセージをハイライト」を強調表示',
      '4つのメッセージレイアウト、8つの表示アニメーション、6つのフォント',
      '縦向きまたは横向き',
      'ブラウザソースの推奨サイズ: 400x600',
    ],
    pt: [
      'Chat da Twitch e da Kick juntos em um overlay',
      'Emotes da 7TV na Twitch e na Kick, emotes da BTTV e da FFZ na Twitch',
      'Oculta bots conhecidos e mensagens que começam com !',
      'Mensagens ficam de 10 segundos a 5 minutos, ou para sempre',
      'Destaques para menções, respostas, primeira vez no chat, anúncios e Destacar minha mensagem',
      'Quatro layouts de mensagem, oito animações de entrada e seis fontes',
      'Orientação vertical ou horizontal',
      'Tamanho recomendado da fonte de navegador: 400x600',
    ],
  },
  'emote-wall': {
    en: [
      'Emote-only Twitch and Kick messages appear as emotes on screen',
      'Show All Emotes also picks up to 5 emotes out of normal messages',
      "7TV emotes from the Twitch channel's active set, in Kick chat too",
      'Calm, Chaos, Bounce, Glide, Spin, Burst and Random animation modes',
      'Emote size 32 to 256 px, 2 to 30 seconds on screen, up to 120 at once',
      'Subscribers only, sub emotes only, longer sub emotes, Hype Mode and emote spam blocking',
      'Recommended browser source size: 1920x1080',
    ],
    de: [
      'Reine Emote-Nachrichten aus Twitch und Kick erscheinen als Emotes auf dem Bildschirm',
      'Auf Wunsch kommen auch bis zu 5 Emotes aus normalen Nachrichten dazu',
      '7TV-Emotes aus dem aktiven Set des Twitch-Kanals, auch im Kick-Chat',
      'Animationsmodi Ruhig, Chaos, Abprallen, Gleiten, Drehung, Explosion und Zufällig',
      'Emote-Größe 32 bis 256 px, 2 bis 30 Sekunden sichtbar, bis zu 120 gleichzeitig',
      'Nur Subs, nur Sub-Emotes, längere Sub-Emotes, Hype-Modus und Schutz vor Emote-Spam',
      'Empfohlene Größe der Browserquelle: 1920x1080',
    ],
    tr: [
      "Sadece emote'tan oluşan Twitch ve Kick mesajları ekranda emote olarak belirir",
      "Tüm Emote'ları Göster, normal mesajlardan da en fazla 5 emote alır",
      "Twitch kanalının aktif 7TV setindeki emote'lar, Kick sohbetinde de",
      'Sakin, Kaos, Sekme, Süzülme, Dönme, Patlama ve Rastgele animasyon modları',
      '32 ile 256 px arası emote boyutu, ekranda 2 ile 30 saniye, aynı anda en fazla 120 emote',
      "Sadece aboneler, sadece abone emote'ları, abone emote'larına uzun süre, Hype Modu ve emote spamı engelleme",
      'Önerilen Tarayıcı Kaynağı boyutu: 1920x1080',
    ],
    es: [
      'Los mensajes de solo emotes de Twitch y Kick aparecen como emotes en pantalla',
      'Mostrar todos los emotes también saca hasta 5 emotes de los mensajes normales',
      'Emotes de 7TV del set activo del canal de Twitch, también en el chat de Kick',
      'Modos de animación Tranquilo, Caos, Rebote, Planeo, Giro, Estallido y Aleatorio',
      'Emotes de 32 a 256 px, de 2 a 30 segundos en pantalla, hasta 120 a la vez',
      'Solo suscriptores, solo emotes de subs, emotes de subs más largos, modo hype y bloqueo de spam de emotes',
      'Tamaño recomendado de la fuente de navegador: 1920x1080',
    ],
    fr: [
      "Les messages d'emotes Twitch et Kick s'affichent en emotes à l'écran",
      "Toutes les emotes récupère aussi jusqu'à 5 emotes dans les messages normaux",
      'Emotes 7TV du set actif de la chaîne Twitch, dans le chat Kick aussi',
      "Modes d'animation Calme, Chaos, Rebond, Glissade, Rotation, Explosion et Aléatoire",
      "Emotes de 32 à 256 px, de 2 à 30 secondes à l'écran, jusqu'à 120 à la fois",
      "Abonnés uniquement, emotes de subs uniquement, emotes des subs plus longues, Mode hype et blocage du spam d'emotes",
      'Taille de source navigateur recommandée : 1920x1080',
    ],
    ja: [
      'TwitchとKickのエモートだけのメッセージが、画面にエモートとして表示',
      '「すべてのエモートを表示」で、普通のメッセージからもエモートを5個まで表示',
      'Twitchチャンネルのアクティブなセットの7TVエモートを、Kickのチャットでも表示',
      'おだやか、カオス、バウンス、グライド、スピン、バースト、ランダムの7つのアニメーションモード',
      'エモートのサイズは32から256px、表示時間は2から30秒、同時表示は最大120個',
      'サブスク限定、サブスクのエモートのみ、サブスクのエモートを長く表示、ハイプモード、エモートスパムのブロック',
      'ブラウザソースの推奨サイズ: 1920x1080',
    ],
    pt: [
      'Mensagens só de emotes da Twitch e da Kick aparecem como emotes na tela',
      'Mostrar todos os emotes também pega até 5 emotes de mensagens normais',
      'Emotes da 7TV do conjunto ativo do canal da Twitch, no chat da Kick também',
      'Modos de animação Calmo, Caos, Quicar, Deslize, Giro, Explosão e Aleatório',
      'Emotes de 32 a 256 px, de 2 a 30 segundos na tela, até 120 ao mesmo tempo',
      'Só inscritos, só emotes de subs, emotes de sub por mais tempo, Modo hype e bloqueio de spam de emotes',
      'Tamanho recomendado da fonte de navegador: 1920x1080',
    ],
  },
  'sub-sprout': {
    en: [
      'Grows one stage with every new sub, resub or gifted sub on Twitch and Kick',
      '10 plant varieties',
      'After full growth: the same plant, the next one in order, or a random one',
      'Rain or sparkle watering effect',
      'Optional sub count and stage label on the pot',
      'The broadcaster and mods can type !grow to grow it by hand, or !grow reset to start over',
      'The plant is saved in OBS and carries over to the next stream',
      'Recommended browser source size: 800x600',
    ],
    de: [
      'Wächst mit jedem neuen Sub, Resub oder Gift-Sub auf Twitch und Kick um eine Stufe',
      '10 Pflanzensorten',
      'Nach dem vollen Wachstum: dieselbe Pflanze, die nächste in der Reihe oder eine zufällige',
      'Gießeffekt mit Regen oder Glitzer',
      'Optional Sub-Zahl und Stufe auf dem Topf',
      'Streamer und Mods lassen sie mit !grow von Hand wachsen oder starten mit !grow reset neu',
      'Die Pflanze wird in OBS gespeichert und wächst im nächsten Stream weiter',
      'Empfohlene Größe der Browserquelle: 800x600',
    ],
    tr: [
      "Twitch ve Kick'te her yeni abonelik, yenileme ya da hediye abonelikle bir aşama büyür",
      '10 bitki çeşidi',
      'Tamamen büyüyünce aynı bitki, sıradaki bitki ya da rastgele biri',
      'Yağmur ya da parıltı sulama efekti',
      'İsteğe bağlı abone sayısı ve saksıda aşama etiketi',
      'Yayıncı ve modlar !grow yazarak bitkiyi elle büyütebilir, !grow reset ile baştan başlatabilir',
      "Bitki OBS'te kayıtlı kalır, sonraki yayına da taşınır",
      'Önerilen Tarayıcı Kaynağı boyutu: 800x600',
    ],
    es: [
      'Crece una etapa con cada sub nueva, resub o sub regalada en Twitch y Kick',
      '10 tipos de planta',
      'Al crecer del todo: la misma planta, la siguiente en orden o una al azar',
      'Efecto de riego de lluvia o destellos',
      'Número de subs y etiqueta de etapa en la maceta, opcionales',
      'El streamer y los mods pueden escribir !grow para hacerla crecer a mano, o !grow reset para empezar de nuevo',
      'La planta se guarda en OBS y pasa al siguiente stream',
      'Tamaño recomendado de la fuente de navegador: 800x600',
    ],
    fr: [
      "Pousse d'un stade à chaque sub, resub ou sub offert sur Twitch et Kick",
      '10 variétés de plantes',
      "Après la pousse complète : la même plante, la suivante dans l'ordre, ou une au hasard",
      "Effet d'arrosage pluie ou étincelles",
      'Nombre de subs et stade sur le pot en option',
      'Le streamer et les modos peuvent taper !grow pour la faire pousser à la main, ou !grow reset pour recommencer',
      'La plante est enregistrée dans OBS et passe au stream suivant',
      'Taille de source navigateur recommandée : 800x600',
    ],
    ja: [
      'TwitchとKickの新規サブスク、継続サブスク、ギフトサブのたびに1段階成長',
      '10種類の植物',
      '育ちきったあとは、同じ植物、順番に次の植物、またはランダムな植物',
      '雨またはキラキラの水やりエフェクト',
      'サブスク数と鉢の段階ラベルを表示可能',
      '配信者とモデレーターは !grow で手動で育て、!grow reset でやり直し',
      '植物はOBSに保存され、次の配信に引き継ぎ',
      'ブラウザソースの推奨サイズ: 800x600',
    ],
    pt: [
      'Cresce um estágio a cada sub, resub ou sub de presente na Twitch e na Kick',
      '10 tipos de planta',
      'Depois de crescer por completo: a mesma planta, a próxima da lista ou uma aleatória',
      'Efeito de rega de chuva ou brilho',
      'Número de subs e estágio no vaso, opcionais',
      'O streamer e os mods podem digitar !grow para fazer crescer na mão, ou !grow reset para recomeçar',
      'A planta fica salva no OBS e passa para a próxima live',
      'Tamanho recomendado da fonte de navegador: 800x600',
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
    de: [
      'Ein Countdown, dem Subs, Gift-Subs, Bits und Kicks auf Twitch und Kick Zeit hinzufügen',
      'Als Lebensbalken, Uhr oder Ring, mit Lebensfarben oder einer festen Farbe',
      'Eigene Zeiten für Twitch und Kick: Subs, Gift-Subs und Bits oder Kicks',
      'Twitch-Subs der Stufe 2 und 3 können als 2 und 5 Subs zählen',
      'Optionales Zeitlimit und eigener Titel',
      'Streamer und Mods steuern ihn mit !subathon: starten, pausieren, Zeit hinzufügen, abziehen, setzen und zurücksetzen',
      'Der Timer wird in OBS gespeichert und übersteht ein Neuladen',
      'Empfohlene Größe der Browserquelle: 800x300',
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
    es: [
      'Una cuenta regresiva a la que las subs, las subs regaladas, los Bits y los Kicks suman tiempo, en Twitch y Kick',
      'Estilo barra de vida, reloj o anillo, con colores de vida o un color fijo',
      'Tiempos separados para Twitch y Kick: subs, subs regaladas y Bits o Kicks',
      'Las subs de Nivel 2 y Nivel 3 de Twitch pueden contar como 2 y 5 subs',
      'Límite de tiempo opcional y un título a tu gusto',
      'El streamer y los mods pueden iniciar, pausar, sumar, quitar, fijar y reiniciar el tiempo con !subathon',
      'El timer se guarda en OBS y aguanta las recargas',
      'Tamaño recomendado de la fuente de navegador: 800x300',
    ],
    fr: [
      'Un compte à rebours auquel les subs, subs offerts, Bits et Kicks ajoutent du temps, sur Twitch et Kick',
      'Style barre de vie, horloge ou anneau, avec les couleurs de vie ou une couleur fixe',
      'Temps séparés pour Twitch et Kick : subs, subs offerts, et Bits ou Kicks',
      'Les subs Twitch Niveau 2 et Niveau 3 peuvent compter comme 2 et 5 subs',
      'Temps maximum en option et titre personnalisé',
      'Le streamer et les modos peuvent lancer, mettre en pause, ajouter, retirer, définir et réinitialiser le temps avec !subathon',
      'Le timer est enregistré dans OBS et survit aux rechargements',
      'Taille de source navigateur recommandée : 800x300',
    ],
    ja: [
      'TwitchとKickのサブスク、ギフトサブ、Bits、Kicksで時間が増えるカウントダウン',
      'HPバー、時計、リングのスタイル。HPカラーか単色を選択',
      'サブスク、ギフトサブ、BitsまたはKicksの時間をTwitchとKickで別々に設定',
      'TwitchのTier 2とTier 3のサブスクを、サブスク2件分と5件分としてカウント可能',
      '上限時間とカスタムタイトルを設定可能',
      '配信者とモデレーターは !subathon で開始、一時停止、追加、削除、設定、リセット',
      'タイマーはOBSに保存され、再読み込みしても保持',
      'ブラウザソースの推奨サイズ: 800x300',
    ],
    pt: [
      'Uma contagem regressiva que ganha tempo com subs, subs de presente, Bits e Kicks, na Twitch e na Kick',
      'Estilo barra de vida, relógio ou anel, com cores de vida ou uma cor fixa',
      'Tempos separados para Twitch e Kick: subs, subs de presente, e Bits ou Kicks',
      'Subs Tier 2 e Tier 3 da Twitch podem valer 2 e 5 subs',
      'Limite de tempo opcional e título personalizado',
      'O streamer e os mods podem iniciar, pausar, adicionar, tirar, definir e zerar o tempo com !subathon',
      'O timer fica salvo no OBS e sobrevive a recarregamentos',
      'Tamanho recomendado da fonte de navegador: 800x300',
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
      'Alert text in English, Spanish, French, German, Japanese, Portuguese or Turkish',
      'Recommended browser source size: 800x450',
    ],
    de: [
      'Alerts für Subs, Gift-Subs, Bits, Kicks und Raids auf Twitch und Kick',
      'Zwei Themes: Neon mit Synth-Sounds und Sternenhimmel mit Glockenklängen, jeweils mit eigenem Icon pro Alert',
      'Sieben Farben, darunter eine, die Twitch und Kick unterscheidet',
      'Eigene Überschriften und Mindestwerte für Gift-Subs, Cheers und Raids',
      'Resub-Monate und die Nachricht des Zuschauers zu Resub, Bits oder Kicks, ohne Links',
      'Alerts warten, bis sie dran sind, und viele verschenkte Subs auf einmal ergeben einen einzigen Alert',
      'Alert-Text auf Englisch, Spanisch, Französisch, Deutsch, Japanisch, Portugiesisch oder Türkisch',
      'Empfohlene Größe der Browserquelle: 800x450',
    ],
    tr: [
      "Twitch ve Kick'te abonelik, hediye abonelik, Bits, Kicks ve raid uyarıları",
      'İki tema: synth sesli Neon ve çan sesli Göksel, ikisinde de her uyarıya özel ikon',
      "Yedi renk seçeneği, biri Twitch ile Kick'i farklı renkte gösterir",
      'Özel başlıklar, hediye, cheer ve raid için en az miktar ayarı',
      'Yenilemelerde ay sayısı ve yenileme, Bits ya da Kicks ile gelen izleyici mesajı, linkler olmadan',
      'Uyarılar sırayla çıkar, çoklu hediye abonelik tek bir uyarı olur',
      'İngilizce, İspanyolca, Fransızca, Almanca, Japonca, Portekizce ya da Türkçe uyarı metni',
      'Önerilen Tarayıcı Kaynağı boyutu: 800x450',
    ],
    es: [
      'Alertas para subs, subs regaladas, Bits, Kicks y raids en Twitch y Kick',
      'Dos temas: Neon con sonidos de sintetizador y Celestial con campanas, cada uno con un icono por alerta',
      'Siete colores, incluido uno que distingue Twitch de Kick',
      'Títulos a tu gusto y cantidades mínimas para regalos, cheers y raids',
      'Meses de resub, y el mensaje del espectador con una resub, Bits o Kicks, sin enlaces',
      'Las alertas esperan su turno y un regalo de muchas subs es una sola alerta',
      'Texto de las alertas en inglés, español, francés, alemán, japonés, portugués o turco',
      'Tamaño recomendado de la fuente de navegador: 800x450',
    ],
    fr: [
      'Alertes pour les subs, subs offerts, Bits, Kicks et raids sur Twitch et Kick',
      'Deux thèmes : Neon avec des sons de synthé et Céleste avec des carillons, chacun avec une icône par alerte',
      'Sept couleurs, dont une qui distingue Twitch et Kick',
      'Titres personnalisés et montants minimum pour les cadeaux, cheers et raids',
      'Mois de resub, et le message du viewer avec un resub, des Bits ou des Kicks, sans liens',
      "Les alertes attendent leur tour et beaucoup de subs offerts d'un coup font une seule alerte",
      'Texte des alertes en anglais, espagnol, français, allemand, japonais, portugais ou turc',
      'Taille de source navigateur recommandée : 800x450',
    ],
    ja: [
      'TwitchとKickのサブスク、ギフトサブ、Bits、Kicks、レイドのアラート',
      '2つのテーマ: シンセ音のネオンとベルの音のセレスティアル。アラートごとに専用アイコン',
      'TwitchとKickを色分けするカラーを含む7色',
      '見出しのカスタマイズと、ギフト、Cheer、レイドの最小数の設定',
      '継続サブスクの月数と、継続サブスク、Bits、Kicksに添えられた視聴者のメッセージ（リンクは除外）',
      'アラートは順番待ちで表示し、大量のギフトサブも1回のアラートに',
      'アラートの文言は英語、スペイン語、フランス語、ドイツ語、日本語、ポルトガル語、トルコ語に対応',
      'ブラウザソースの推奨サイズ: 800x450',
    ],
    pt: [
      'Alertas de subs, subs de presente, Bits, Kicks e raids na Twitch e na Kick',
      'Dois temas: Neon com sons de sintetizador e Celestial com sinos, cada um com um ícone por alerta',
      'Sete cores, incluindo uma que diferencia Twitch e Kick',
      'Títulos personalizados e valores mínimos para presentes, Bits e raids',
      'Meses de resub e a mensagem do espectador com resub, Bits ou Kicks, sem links',
      'Os alertas esperam a vez e um presente de vários subs vira um alerta só',
      'Texto do alerta em inglês, espanhol, francês, alemão, japonês, português ou turco',
      'Tamanho recomendado da fonte de navegador: 800x450',
    ],
  },
  goal: {
    en: [
      'A goal bar that every sub, resub and gifted sub on Twitch and Kick fills by one',
      'Both platforms add into one count',
      'Prime and every tier count as one sub, a gift counts every sub in it',
      'Start from your current sub count, or from 0 for this stream',
      'A trophy celebration naming who filled it when the goal is reached, and the count keeps going past it',
      'The completed goal stays up, or hides itself after a hold time you set',
      'The broadcaster and mods can add, remove, set and reset the count with !goal',
      'The count is saved in OBS and survives reloads',
      'Recommended browser source size: 800x260',
    ],
    de: [
      'Ein Zielbalken, den jeder Sub, Resub und Gift-Sub auf Twitch und Kick um eins füllt',
      'Beide Plattformen zählen in einen gemeinsamen Stand',
      'Prime und jede Stufe zählen als ein Sub, ein Gift zählt jeden Sub darin',
      'Start bei deiner aktuellen Sub-Zahl oder bei 0 für diesen Stream',
      'Eine Pokal-Feier, wenn das Ziel erreicht ist, und der Zähler läuft danach weiter',
      'Streamer und Mods können den Stand mit !goal erhöhen, senken, setzen und zurücksetzen',
      'Der Stand wird in OBS gespeichert und übersteht ein Neuladen',
      'Empfohlene Größe der Browserquelle: 800x260',
    ],
    tr: [
      "Twitch ve Kick'te her abonelik, yenileme ve hediye abonelikle birer birer dolan hedef barı",
      'İki platformdan gelenler tek bir sayıda toplanır',
      "Prime ve bütün tier'lar tek abonelik sayılır, hediyede içindeki her abonelik sayılır",
      "Mevcut abone sayısından ya da sadece bu yayın için 0'dan başlar",
      'Hedefe ulaşınca dolduranın adını yazan kupa kutlaması, sayı hedefi geçince de artmaya devam eder',
      'Tamamlanan hedef ekranda kalır ya da ayarladığın süre sonunda gizlenir',
      'Yayıncı ve modlar !goal ile abone ekleyip çıkarabilir, sayıyı ayarlayıp sıfırlayabilir',
      "Sayı OBS'te kaydedilir, sayfa yenilense de kaybolmaz",
      'Önerilen Tarayıcı Kaynağı boyutu: 800x260',
    ],
    es: [
      'Una barra de meta que cada sub, resub y sub regalada de Twitch y Kick llena de a uno',
      'Las dos plataformas suman en un solo conteo',
      'Prime y todos los niveles cuentan como una sub, un regalo cuenta cada sub que incluye',
      'Empieza desde tu número actual de subs, o desde 0 para este stream',
      'Celebración con trofeo al llegar a la meta, y el conteo sigue después',
      'El streamer y los mods pueden sumar, quitar, fijar y reiniciar el conteo con !goal',
      'El conteo se guarda en OBS y aguanta las recargas',
      'Tamaño recomendado de la fuente de navegador: 800x260',
    ],
    fr: [
      "Une barre d'objectif que chaque sub, resub et sub offert sur Twitch et Kick remplit d'un cran",
      "Les deux plateformes s'additionnent dans un seul compteur",
      "Prime et tous les niveaux comptent pour un sub, un cadeau compte chaque sub qu'il contient",
      'Démarre de ton nombre de subs actuel, ou de 0 pour ce stream',
      "Un trophée quand l'objectif est atteint, et le compteur continue au-delà",
      'Le streamer et les modos peuvent ajouter, retirer, définir et réinitialiser le compteur avec !goal',
      'Le compteur est enregistré dans OBS et survit aux rechargements',
      'Taille de source navigateur recommandée : 800x260',
    ],
    ja: [
      'TwitchとKickのサブスク、継続サブスク、ギフトサブが1件ずつ埋めていく目標バー',
      '両方のプラットフォームの数をひとつのカウントに合算',
      'Primeもどのティアもサブスク1件としてカウントし、ギフトは含まれるサブスクをすべてカウント',
      '今のサブスク数から、またはこの配信の0からスタート',
      '目標達成でトロフィーの演出。達成後もカウントは継続',
      '配信者とモデレーターは !goal でカウントを追加、削除、設定、リセット',
      'カウントはOBSに保存され、再読み込みしても保持',
      'ブラウザソースの推奨サイズ: 800x260',
    ],
    pt: [
      'Uma barra de meta que cada sub, resub e sub de presente na Twitch e na Kick enche em um',
      'As duas plataformas somam na mesma contagem',
      'Prime e qualquer tier contam como um sub, um presente conta cada sub dentro dele',
      'Comece do seu número de subs atual, ou do 0 para esta live',
      'Um troféu de comemoração quando a meta é batida, e a contagem continua depois',
      'O streamer e os mods podem somar, tirar, definir e zerar a contagem com !goal',
      'A contagem fica salva no OBS e sobrevive a recarregamentos',
      'Tamanho recomendado da fonte de navegador: 800x260',
    ],
  },
  'follower-goal': {
    en: [
      'A follower goal bar that every new follow on Twitch and Kick fills by one in real time',
      'Connected live to Senchabot for automatic real-time follow tracking',
      'Both platforms add into one shared count',
      'Start from your current follower count, or from 0 for this stream',
      'A trophy celebration naming who filled it when the goal is reached, and the count keeps going past it',
      'The completed goal stays up, or hides itself after a hold time you set',
      'Floating +1 pops with viewer names and platform badges',
      'The count is saved in OBS and survives reloads',
      'Recommended browser source size: 800x260',
    ],
    de: [
      'Ein Follower-Zielbalken, den jeder neue Follower auf Twitch und Kick in Echtzeit füllt',
      'Live mit Senchabot verbunden für automatische Echtzeit-Follow-Erfassung',
      'Beide Plattformen zählen in einen gemeinsamen Stand',
      'Start bei deiner aktuellen Follower-Zahl oder bei 0 für diesen Stream',
      'Eine Pokal-Feier, wenn das Ziel erreicht ist, und der Zähler läuft danach weiter',
      'Der Stand wird in OBS gespeichert und übersteht ein Neuladen',
      'Empfohlene Größe der Browserquelle: 800x260',
    ],
    tr: [
      "Twitch ve Kick'te her yeni takipçiyle gerçek zamanlı dolan takipçi hedef barı",
      'Otomatik ve canlı takipçi takibi için Senchabot ile entegre çalışır',
      'İki platformdan gelen takipçiler tek bir sayıda toplanır',
      "Mevcut takipçi sayısından ya da sadece bu yayın için 0'dan başlar",
      'Hedefe ulaşınca dolduranın adını yazan kupa kutlaması, sayı hedefi geçince de artmaya devam eder',
      'Tamamlanan hedef ekranda kalır ya da ayarladığın süre sonunda gizlenir',
      "Takipçinin adı ve platform simgesiyle süzülen +1 animasyonları",
      "Sayı OBS'te kaydedilir, sayfa yenilense de kaybolmaz",
      'Önerilen Tarayıcı Kaynağı boyutu: 800x260',
    ],
    es: [
      'Una barra de meta de seguidores que cada nuevo seguidor de Twitch y Kick llena en tiempo real',
      'Conectado en directo a Senchabot para seguimiento automático de seguidores',
      'Las dos plataformas suman en un solo conteo',
      'Empieza desde tu número actual de seguidores, o desde 0 para este stream',
      'Celebración con trofeo al llegar a la meta, y el conteo sigue después',
      'El conteo se guarda en OBS y aguanta las recargas',
      'Tamaño recomendado de la fuente de navegador: 800x260',
    ],
    fr: [
      "Une barre d'objectif que chaque nouveau follow sur Twitch et Kick remplit en temps réel",
      'Connecté en direct à Senchabot pour un suivi automatique des followers',
      "Les deux plateformes s'additionnent dans un seul compteur",
      'Démarre de ton nombre de followers actuel, ou de 0 pour ce stream',
      "Un trophée quand l'objectif est atteint, et le compteur continue au-delà",
      'Le compteur est enregistré dans OBS et survit aux rechargements',
      'Taille de source navigateur recommandée : 800x260',
    ],
    ja: [
      'TwitchとKickの新しいフォローがリアルタイムに1件ずつ埋めていく目標バー',
      'Senchabotとの連携により新しいフォローを自動でリアルタイム検出',
      '両方のプラットフォームの数をひとつのカウントに合算',
      '今のフォロワー数から、またはこの配信の0からスタート',
      '目標達成でトロフィーの演出。達成後もカウントは継続',
      'カウントはOBSに保存され、再読み込みしても保持',
      'ブラウザソースの推奨サイズ: 800x260',
    ],
    pt: [
      'Uma barra de meta que cada novo seguidor na Twitch e na Kick enche em tempo real',
      'Conectado ao vivo com o Senchabot para detecção automática de novos seguidores',
      'As duas plataformas somam na mesma contagem',
      'Comece do seu número de seguidores atual, ou do 0 para esta live',
      'Um troféu de comemoração quando a meta é batida, e a contagem continua depois',
      'A contagem fica salva no OBS e sobrevive a recarregamentos',
      'Tamanho recomendado da fonte de navegador: 800x260',
    ],
  },
  frames: {
    en: [
      'Three ready-made frames for your camera, chat and whole stream screen',
      'Every preset has its own art: a pagoda roof and lanterns, gold ornaments, riveted shields, pixel blocks',
      'The middle is transparent, so your camera or Chat Box shows through',
      'Light animations like glowing lines, swaying tassels and flickering torches, and you can turn them off',
      'A tab for your channel name or any text you like',
      'Fits any source size, square or vertical cameras included',
      'Works on Twitch, Kick and other platforms without connecting a channel',
    ],
    de: [
      'Drei fertige Rahmen für Kamera, Chat und den ganzen Stream-Bildschirm',
      'Jedes Preset hat eigene Grafiken: ein Pagodendach mit Laternen, goldene Ornamente, genietete Schilde, Pixelblöcke',
      'Die Mitte ist transparent, damit deine Kamera oder Chat-Box durchscheint',
      'Leichte Animationen wie leuchtende Linien, schwingende Quasten und flackernde Fackeln, die du abschalten kannst',
      'Ein Schild für deinen Kanalnamen oder einen beliebigen Text',
      'Passt zu jeder Quellgröße, auch zu quadratischen oder vertikalen Kameras',
      'Läuft auf Twitch, Kick und anderen Plattformen, ohne einen Kanal zu verbinden',
    ],
    tr: [
      'Kamera, sohbet ve bütün yayın ekranı için üç hazır çerçeve',
      "Her preset'in kendi çizimleri: pagoda çatısı ve fenerler, altın süslemeler, perçinli kalkanlar, piksel bloklar",
      'Ortası şeffaf, kameran ya da Sohbet Kutusu altında görünür',
      'Parlayan çizgiler, sallanan püsküller, titreyen meşaleler gibi hafif animasyonlar, istersen kapatılır',
      'Kanal adın ya da istediğin bir yazı için sekme',
      'Kaynağın her boyutuna uyar, kare ya da dikey kamera da olur',
      'Kanal bağlamadan Twitch, Kick ve diğer platformlarda çalışır',
    ],
    es: [
      'Tres marcos listos para tu cámara, tu chat y toda tu pantalla de stream',
      'Cada preset tiene su propio arte: un tejado de pagoda y farolillos, adornos dorados, escudos con remaches, bloques de píxeles',
      'El centro es transparente, así se ve tu cámara o tu Caja de Chat',
      'Animaciones suaves como líneas que brillan, borlas que se balancean y antorchas que parpadean, y puedes desactivarlas',
      'Una pestaña para el nombre de tu canal o el texto que quieras',
      'Se adapta a cualquier tamaño de fuente, cámaras cuadradas o verticales incluidas',
      'Funciona en Twitch, Kick y otras plataformas sin conectar un canal',
    ],
    fr: [
      "Trois cadres prêts à l'emploi pour ta caméra, ton chat et tout ton écran de stream",
      'Chaque preset a ses propres dessins : un toit de pagode et des lanternes, des ornements dorés, des boucliers à rivets, des blocs en pixels',
      'Le centre est transparent, donc ta caméra ou ta Boîte de chat apparaît à travers',
      'Des animations légères comme des lignes lumineuses, des pompons qui se balancent et des torches qui vacillent, désactivables',
      'Un onglet pour le nom de ta chaîne ou le texte de ton choix',
      "S'adapte à toutes les tailles de source, caméras carrées ou verticales comprises",
      "Marche sur Twitch, Kick et d'autres plateformes sans connecter de chaîne",
    ],
    ja: [
      'カメラ、チャット、配信画面全体のための3つのフレーム',
      'プリセットごとに専用のイラスト: 楼閣の屋根と提灯、金の装飾、リベット付きの盾、ピクセルブロック',
      '中央は透明なので、カメラやチャットボックスが透けて見える',
      '光るライン、揺れる房飾り、揺らめく松明などの軽いアニメーション。オフにも可能',
      'チャンネル名や好きな文字を入れられるタブ',
      '正方形や縦向きのカメラを含め、どんなソースサイズにも対応',
      'チャンネルの接続なしで、Twitch、Kick、ほかのプラットフォームで使用可能',
    ],
    pt: [
      'Três molduras prontas para sua câmera, seu chat e a tela inteira da live',
      'Cada preset tem arte própria: telhado de pagode e lanternas, ornamentos dourados, escudos com rebites, blocos de pixel',
      'O meio é transparente, então sua câmera ou a Caixa de Chat aparece por baixo',
      'Animações leves, como linhas brilhando, borlas balançando e tochas piscando, e dá para desligar',
      'Uma aba para o nome do seu canal ou qualquer texto',
      'Se ajusta a qualquer tamanho de fonte, incluindo câmeras quadradas ou verticais',
      'Funciona na Twitch, na Kick e em outras plataformas sem conectar um canal',
    ],
  },
  'irl-hud': {
    en: [
      'A game-style cash counter that subs, gifted subs, Bits, Kicks and raids add to, on Twitch and Kick',
      'A mini-map where an arrow walks a made-up city or park, or the real streets of places you save from OpenStreetMap, switched from chat with !hud map',
      'Retro or Modern look, with the cash and the mini-map in any corner and at any size',
      'Separate dollar amounts for Twitch and Kick: subs, gifted subs, Bits or Kicks, and every raider',
      'Twitch Tier 2 and Tier 3 subs can count as 2 and 5 subs',
      'A clock in your own time zone for IRL streams, as 24 or 12 hours',
      'The broadcaster and mods change the cash with !hud cash +100, -100, a new amount or reset',
      'A market of items with prices that !hud buy takes off the cash, and an arrow that walks, runs or stays put on command',
      'The cash is saved in OBS and survives reloads',
      'Recommended browser source size: 1920x1080',
    ],
    de: [
      'Ein Geldzähler im Game-Stil, dem Subs, Gift-Subs, Bits, Kicks und Raids auf Twitch und Kick Geld bringen',
      'Eine Minikarte, auf der ein Pfeil durch eine erfundene Stadt, einen Park oder die echten Straßen gespeicherter Orte aus OpenStreetMap läuft, per !hud map im Chat gewechselt',
      'Retro- oder Modern-Look, Geld und Minikarte in jeder Ecke und in jeder Größe',
      'Eigene Dollarbeträge für Twitch und Kick: Subs, Gift-Subs, Bits oder Kicks und jeder Raider',
      'Twitch-Subs der Stufe 2 und 3 können als 2 und 5 Subs zählen',
      'Eine Uhr in deiner eigenen Zeitzone für IRL-Streams, mit 24 oder 12 Stunden',
      'Streamer und Mods ändern das Geld mit !hud cash +100, -100, einem neuen Betrag oder reset',
      'Ein Markt mit Artikeln und Preisen, die !hud buy vom Geld abzieht, und ein Pfeil, der auf Befehl geht, rennt oder stehen bleibt',
      'Das Geld wird in OBS gespeichert und übersteht ein Neuladen',
      'Empfohlene Größe der Browserquelle: 1920x1080',
    ],
    tr: [
      "Twitch ve Kick'te abonelik, hediye abonelik, Bits, Kicks ve raid geldikçe para eklenen oyun tarzı sayaç",
      "Okun hayali bir şehirde, parkta ya da OpenStreetMap'ten kaydettiğin yerlerin gerçek sokaklarında yürüdüğü, sohbetten !hud map ile değişen mini harita",
      'Retro ya da Modern görünüm, para ve mini harita istediğin köşede ve istediğin boyutta',
      'Twitch ve Kick için ayrı dolar miktarları: abonelik, hediye abonelik, Bits ya da Kicks ve her raid izleyicisi',
      "Twitch'te Tier 2 ve Tier 3 abonelikler 2 ve 5 abonelik sayılabilir",
      'IRL yayınlar için kendi saat diliminde, 24 ya da 12 saatlik saat',
      'Yayıncı ve modlar parayı !hud cash +100, -100, yeni bir miktar ya da reset ile değiştirir',
      '!hud buy ile fiyatı paradan düşen ürünlerin olduğu bir market ve komutla yürüyen, koşan ya da duran bir ok',
      "Para OBS'te kaydedilir, sayfa yenilense de kaybolmaz",
      'Önerilen Tarayıcı Kaynağı boyutu: 1920x1080',
    ],
    es: [
      'Un contador de dinero estilo videojuego al que las subs, las subs regaladas, los Bits, los Kicks y las raids suman dinero, en Twitch y Kick',
      'Un minimapa donde una flecha recorre una ciudad o un parque inventados, o las calles reales de lugares guardados de OpenStreetMap, que cambias desde el chat con !hud map',
      'Estilo Retro o Moderno, con el dinero y el minimapa en cualquier esquina y del tamaño que quieras',
      'Cantidades separadas para Twitch y Kick: subs, subs regaladas, Bits o Kicks, y cada espectador de una raid',
      'Las subs de Nivel 2 y Nivel 3 de Twitch pueden contar como 2 y 5 subs',
      'Un reloj en tu propia zona horaria para streams IRL, de 24 o 12 horas',
      'El streamer y los mods cambian el dinero con !hud cash +100, -100, una cantidad nueva o reset',
      'Un mercado de artículos con precio que !hud buy descuenta del dinero, y una flecha que camina, corre o se queda quieta a tu orden',
      'El dinero se guarda en OBS y aguanta las recargas',
      'Tamaño recomendado de la fuente de navegador: 1920x1080',
    ],
    fr: [
      "Un compteur d'argent façon jeu vidéo auquel les subs, subs offerts, Bits, Kicks et raids ajoutent de l'argent, sur Twitch et Kick",
      'Une mini-carte où une flèche parcourt une ville ou un parc inventés, ou les vraies rues de lieux enregistrés depuis OpenStreetMap, à changer depuis le chat avec !hud map',
      "Look Rétro ou Moderne, avec l'argent et la mini-carte dans le coin et à la taille de ton choix",
      'Montants séparés pour Twitch et Kick : subs, subs offerts, Bits ou Kicks, et chaque viewer de raid',
      'Les subs Twitch Niveau 2 et Niveau 3 peuvent compter comme 2 et 5 subs',
      'Une horloge dans ton propre fuseau horaire pour les streams IRL, sur 24 ou 12 heures',
      "Le streamer et les modos changent l'argent avec !hud cash +100, -100, un nouveau montant ou reset",
      "Un marché d'articles avec leur prix, que !hud buy retire de l'argent, et une flèche qui marche, court ou s'arrête sur commande",
      "L'argent est enregistré dans OBS et survit aux rechargements",
      'Taille de source navigateur recommandée : 1920x1080',
    ],
    ja: [
      'TwitchとKickのサブスク、ギフトサブ、Bits、Kicks、レイドで所持金が増えるゲーム風カウンター',
      '矢印が架空の街や公園、またはOpenStreetMapから保存した場所の実際の道を歩くミニマップ。チャットの !hud map で切り替え',
      'レトロかモダンの見た目。所持金とミニマップをシーンの好きな角に好きなサイズで配置',
      'サブスク、ギフトサブ、BitsまたはKicks、レイド参加者1人あたりの金額をTwitchとKickで別々に設定',
      'TwitchのTier 2とTier 3のサブスクを、サブスク2件分と5件分としてカウント可能',
      'IRL配信向けに自分のタイムゾーンで表示できる24時間・12時間の時計',
      '配信者とモデレーターは !hud cash +100、-100、新しい金額、reset で所持金を変更',
      '!hud buy で所持金から価格が引かれるアイテムのマーケットと、コマンドで歩く・走る・止まる矢印',
      '所持金はOBSに保存され、再読み込みしても保持',
      'ブラウザソースの推奨サイズ: 1920x1080',
    ],
    pt: [
      'Um contador de dinheiro estilo videogame que ganha dinheiro com subs, subs de presente, Bits, Kicks e raids, na Twitch e na Kick',
      'Um minimapa onde uma seta anda por uma cidade ou um parque inventados, ou pelas ruas reais de lugares salvos do OpenStreetMap, trocados pelo chat com !hud map',
      'Visual Retrô ou Moderno, com o dinheiro e o minimapa em qualquer canto e do tamanho que quiser',
      'Valores separados para Twitch e Kick: subs, subs de presente, Bits ou Kicks, e cada espectador de raid',
      'Subs Tier 2 e Tier 3 da Twitch podem valer 2 e 5 subs',
      'Um relógio no seu próprio fuso horário para lives IRL, em 24 ou 12 horas',
      'O streamer e os mods mudam o dinheiro com !hud cash +100, -100, um valor novo ou reset',
      'Um mercado de itens com preço que o !hud buy desconta do dinheiro, e uma seta que anda, corre ou para sob comando',
      'O dinheiro fica salvo no OBS e sobrevive a recarregamentos',
      'Tamanho recomendado da fonte de navegador: 1920x1080',
    ],
  },
  counter: {
    en: [
      'A win and loss record, or any other count you keep on stream',
      'Up to four counters in one browser source, side by side or stacked',
      'Each counter has its own label, icon or channel emote, starting count and chat command',
      'The broadcaster and mods change them from Twitch or Kick chat: add, remove, set and reset',
      'Viewers typing the commands change nothing',
      "A rising +1 or −1 on every change, in the picked preset's look",
      'Every count is saved in OBS and survives reloads',
      'Recommended browser source size: 800x260, or 440x400 stacked',
    ],
    de: [
      'Eine Bilanz aus Siegen und Niederlagen oder jede andere Zahl im Stream',
      'Bis zu vier Zähler in einer Browser-Quelle, nebeneinander oder untereinander',
      'Jeder Zähler hat eigene Beschriftung, eigenes Icon oder Kanal-Emote, Startwert und Chatbefehl',
      'Streamer und Mods ändern sie im Twitch- oder Kick-Chat: hinzufügen, abziehen, setzen und zurücksetzen',
      'Tippen Zuschauer die Befehle, ändert sich nichts',
      'Ein aufsteigendes +1 oder −1 bei jeder Änderung, im Look des gewählten Presets',
      'Jeder Stand wird in OBS gespeichert und übersteht ein Neuladen',
      'Empfohlene Größe der Browserquelle: 800x260, untereinander 440x400',
    ],
    tr: [
      'Galibiyet ve mağlubiyet sayısı ya da yayında tuttuğun başka her sayı',
      'Tek bir tarayıcı kaynağında dört sayaca kadar, yan yana ya da alt alta',
      "Her sayacın kendi etiketi, simgesi ya da kanal emote'u, başlangıç sayısı ve sohbet komutu var",
      'Yayıncı ve modlar Twitch ya da Kick sohbetinden ekler, çıkarır, ayarlar ve sıfırlar',
      'İzleyiciler komutları yazarsa hiçbir şey değişmez',
      "Her değişiklikte yükselen bir +1 ya da −1, seçilen preset'in görünümüyle",
      "Her sayı OBS'te kaydedilir, sayfa yenilense de kaybolmaz",
      'Önerilen Tarayıcı Kaynağı boyutu: 800x260, alt alta için 440x400',
    ],
    es: [
      'Un récord de victorias y derrotas o cualquier otro número de tu stream',
      'Hasta cuatro contadores en una fuente de navegador, en fila o apilados',
      'Cada contador tiene su etiqueta, icono o emote del canal, conteo inicial y comando del chat',
      'El streamer y los mods los cambian desde el chat de Twitch o Kick: sumar, restar, fijar y reiniciar',
      'Si los espectadores escriben los comandos, no cambia nada',
      'Un +1 o −1 que sube con cada cambio, con el aspecto del preset elegido',
      'Cada conteo se guarda en OBS y aguanta las recargas',
      'Tamaño recomendado de la fuente de navegador: 800x260, o 440x400 apilados',
    ],
    fr: [
      'Un bilan de victoires et de défaites ou tout autre nombre de ton stream',
      "Jusqu'à quatre compteurs dans une source navigateur, côte à côte ou empilés",
      'Chaque compteur a son libellé, son icône ou une emote de la chaîne, son compte de départ et sa commande',
      'Le streamer et les modos les changent depuis le chat Twitch ou Kick : ajouter, retirer, définir et réinitialiser',
      'Si les viewers tapent les commandes, rien ne change',
      'Un +1 ou −1 qui monte à chaque changement, avec le look du preset choisi',
      'Chaque compte est enregistré dans OBS et survit aux rechargements',
      'Taille de source navigateur recommandée : 800x260, ou 440x400 empilés',
    ],
    ja: [
      '勝敗の記録や、そのほか配信で数えたいものに',
      'ひとつのブラウザソースに最大4つのカウンター。横並びか縦並び',
      'カウンターごとにラベル、アイコンまたはチャンネルエモート、開始カウント、チャットコマンドを設定',
      '配信者とモデレーターはTwitchやKickのチャットから追加、削除、設定、リセット',
      '視聴者がコマンドを入力しても何も変わりません',
      '変化のたびに +1 や −1 が浮かび上がり、選んだプリセットの見た目で表示',
      'カウントはOBSに保存され、再読み込みしても保持',
      'ブラウザソースの推奨サイズ: 800x260（縦並びは440x400）',
    ],
    pt: [
      'Um placar de vitórias e derrotas ou qualquer outro número da sua live',
      'Até quatro contadores em uma fonte de navegador, lado a lado ou empilhados',
      'Cada contador tem o próprio rótulo, ícone ou emote do canal, contagem inicial e comando do chat',
      'O streamer e os mods mudam pelo chat da Twitch ou da Kick: somar, tirar, definir e zerar',
      'Se os espectadores digitarem os comandos, nada muda',
      'Um +1 ou −1 que sobe a cada mudança, com o visual do preset escolhido',
      'A contagem fica salva no OBS e sobrevive a recarregamentos',
      'Tamanho recomendado da fonte de navegador: 800x260, ou 440x400 empilhados',
    ],
  },
  tasks: {
    en: [
      'Viewers add tasks from Twitch or Kick chat with !task',
      '!done ticks a task off, !edit changes it and !remove takes it off',
      'The broadcaster’s own tasks come first',
      'Shows how many tasks everyone has done at a glance',
      'A long list scrolls by itself, at a speed you pick',
      'Mods clear finished tasks or the whole list from chat',
      'The list is saved in OBS and survives reloads',
      'Recommended browser source size: 480x720',
    ],
    de: [
      'Zuschauer tragen Aufgaben mit !task im Twitch- oder Kick-Chat ein',
      '!done hakt eine Aufgabe ab, !edit ändert sie und !remove nimmt sie von der Liste',
      'Die eigenen Aufgaben des Streamers stehen oben',
      'Zeigt auf einen Blick, wie viele Aufgaben alle erledigt haben',
      'Eine lange Liste scrollt von selbst, in einem Tempo deiner Wahl',
      'Mods leeren erledigte Aufgaben oder die ganze Liste im Chat',
      'Die Liste wird in OBS gespeichert und übersteht ein Neuladen',
      'Empfohlene Größe der Browserquelle: 480x720',
    ],
    tr: [
      'İzleyiciler Twitch ya da Kick sohbetinden !task ile görev ekler',
      '!done görevi tamamlar, !edit değiştirir, !remove siler',
      'Yayıncının kendi görevleri en başta durur',
      'Herkesin kaç görev bitirdiği bir bakışta görünür',
      'Uzun bir liste, seçtiğin hızda kendiliğinden kayar',
      'Modlar biten görevleri ya da bütün listeyi sohbetten temizler',
      "Liste OBS'te kaydedilir, sayfa yenilense de kaybolmaz",
      'Önerilen Tarayıcı Kaynağı boyutu: 480x720',
    ],
    es: [
      'Los espectadores añaden tareas desde el chat de Twitch o Kick con !task',
      '!done tacha una tarea, !edit la cambia y !remove la quita',
      'Las tareas del streamer van primero',
      'Muestra de un vistazo cuántas tareas ha terminado cada uno',
      'Una lista larga se desplaza sola, a la velocidad que elijas',
      'Los mods quitan las tareas terminadas o vacían la lista desde el chat',
      'La lista se guarda en OBS y aguanta las recargas',
      'Tamaño recomendado de la fuente de navegador: 480x720',
    ],
    fr: [
      'Les viewers ajoutent des tâches depuis le chat Twitch ou Kick avec !task',
      '!done coche une tâche, !edit la modifie et !remove la retire',
      'Les tâches du streamer passent en premier',
      "Montre d'un coup d'œil combien de tâches chacun a terminées",
      'Une longue liste défile toute seule, à la vitesse de ton choix',
      'Les modos retirent les tâches terminées ou vident toute la liste depuis le chat',
      'La liste est enregistrée dans OBS et survit aux rechargements',
      'Taille de source navigateur recommandée : 480x720',
    ],
    ja: [
      '視聴者はTwitchやKickのチャットから !task でタスクを追加',
      '!done でチェック、!edit で書き換え、!remove で削除',
      '配信者自身のタスクが一番上に表示',
      '全員が完了したタスクの数がひと目でわかる',
      '長いリストは選んだ速さで自動スクロール',
      'モデレーターは完了したタスクやリスト全体をチャットから消去',
      'リストはOBSに保存され、再読み込みしても保持',
      'ブラウザソースの推奨サイズ: 480x720',
    ],
    pt: [
      'Os espectadores adicionam tarefas pelo chat da Twitch ou da Kick com !task',
      '!done risca uma tarefa, !edit muda e !remove tira da lista',
      'As tarefas do streamer vêm primeiro',
      'Mostra num relance quantas tarefas cada um já terminou',
      'Uma lista longa rola sozinha, na velocidade que você escolher',
      'Os mods limpam as tarefas feitas ou a lista inteira pelo chat',
      'A lista fica salva no OBS e sobrevive a recarregamentos',
      'Tamanho recomendado da fonte de navegador: 480x720',
    ],
  },
  'lower-third': {
    en: [
      'An animated bar with a title and up to 6 lines that take turns',
      'Stays up, or slides in and out on a timer you set',
      'Any corner of the scene, at 50 to 200 percent of its size',
      'Takes the picked preset’s frame, fonts and colors',
      'Needs no channel; with one, mods put up a line of their own with !lt',
      'Mods hide it and bring it back from Twitch or Kick chat',
      'All settings live in the URL, nothing to install',
      'Recommended browser source size: 1920x1080',
    ],
    de: [
      'Eine animierte Leiste mit Titel und bis zu 6 Zeilen, die sich abwechseln',
      'Bleibt stehen oder gleitet per Timer herein und hinaus',
      'In jeder Ecke der Szene, mit 50 bis 200 Prozent ihrer Größe',
      'Übernimmt Rahmen, Schriften und Farben des gewählten Presets',
      'Braucht keinen Kanal; mit Kanal blenden Mods mit !lt eine eigene Zeile ein',
      'Mods blenden sie im Twitch- oder Kick-Chat aus und wieder ein',
      'Alle Einstellungen stecken in der URL, nichts zu installieren',
      'Empfohlene Größe der Browserquelle: 1920x1080',
    ],
    tr: [
      'Bir başlık ve sırayla değişen en fazla 6 satırla animasyonlu bir bant',
      'Sürekli ekranda kalır ya da belirlediğin sürelerle kayarak girip çıkar',
      'Sahnenin istediğin köşesinde, %50 ile %200 arası boyutta',
      "Seçilen preset'in çerçevesini, yazı tiplerini ve renklerini alır",
      'Kanal gerekmez; kanal yazılırsa modlar !lt ile kendi satırlarını gösterir',
      'Modlar Twitch ya da Kick sohbetinden gizleyip geri getirir',
      "Bütün ayarlar URL'de, kurulacak bir şey yok",
      'Önerilen Tarayıcı Kaynağı boyutu: 1920x1080',
    ],
    es: [
      'Una barra animada con un título y hasta 6 líneas que van rotando',
      'Se queda fijo, o entra y sale deslizándose con el temporizador que elijas',
      'En cualquier esquina de la escena, del 50 al 200 por ciento de su tamaño',
      'Toma el marco, las fuentes y los colores del preset elegido',
      'No necesita canal; con uno, los mods muestran una línea propia con !lt',
      'Los mods lo ocultan y lo vuelven a mostrar desde el chat de Twitch o Kick',
      'Toda la configuración va en la URL, no hay nada que instalar',
      'Tamaño recomendado de la fuente de navegador: 1920x1080',
    ],
    fr: [
      "Une barre animée avec un titre et jusqu'à 6 lignes qui se relaient",
      'Reste affiché, ou entre et sort en glissant avec un minuteur que tu règles',
      "Dans n'importe quel coin de la scène, de 50 à 200 % de sa taille",
      'Prend le cadre, les polices et les couleurs du preset choisi',
      'Aucune chaîne requise ; avec une chaîne, les modos affichent leur propre ligne avec !lt',
      'Les modos le masquent et le réaffichent depuis le chat Twitch ou Kick',
      "Tous les réglages sont dans l'URL, rien à installer",
      'Taille de source navigateur recommandée : 1920x1080',
    ],
    ja: [
      'タイトルと、順番に切り替わる最大6行を表示するアニメーション付きのバー',
      'ずっと表示、または設定したタイマーでスライドして出入り',
      'シーンのどの隅にも、50%から200%のサイズで配置',
      '選んだプリセットのフレーム、フォント、色を使用',
      'チャンネルは不要。入力すればモデレーターが !lt で自分の行を表示',
      'モデレーターはTwitchやKickのチャットから非表示と再表示が可能',
      '設定はすべてURLに入っていて、インストール不要',
      'ブラウザソースの推奨サイズ: 1920x1080',
    ],
    pt: [
      'Uma barra animada com um título e até 6 linhas que se revezam',
      'Fica fixa, ou entra e sai deslizando num timer que você define',
      'Em qualquer canto da cena, de 50 a 200 por cento do tamanho',
      'Pega a moldura, as fontes e as cores do preset escolhido',
      'Não precisa de canal; com um, os mods colocam uma linha própria com !lt',
      'Os mods escondem e trazem de volta pelo chat da Twitch ou da Kick',
      'Todas as configurações ficam na URL, nada para instalar',
      'Tamanho recomendado da fonte de navegador: 1920x1080',
    ],
  },
  leaderboard: {
    en: [
      'Ranks top gifters or top Bits and Kicks givers from Twitch and Kick',
      'Stream labels for the latest sub, gifted sub, cheer and raid',
      'Shows 3 to 10 places, with gold, silver and bronze for the top three',
      'Each name marked with its platform color',
      'Totals keep counting from stream to stream until you reset them',
      'The broadcaster and mods reset the board with !top reset',
      'Saved in OBS, so a reload keeps every total',
      'Recommended browser source size: 440x380',
    ],
    de: [
      'Rangliste der Top-Gifter oder der meisten Bits und Kicks von Twitch und Kick',
      'Stream-Labels für den letzten Sub, Gift-Sub, Cheer und Raid',
      'Zeigt 3 bis 10 Plätze, mit Gold, Silber und Bronze für die ersten drei',
      'Jeder Name in der Farbe seiner Plattform markiert',
      'Die Summen zählen von Stream zu Stream weiter, bis du sie zurücksetzt',
      'Streamer und Mods setzen die Rangliste mit !top reset zurück',
      'In OBS gespeichert, ein Neuladen behält also jede Summe',
      'Empfohlene Größe der Browserquelle: 440x380',
    ],
    tr: [
      "Twitch ve Kick'te en çok abonelik hediye edenleri ya da en çok Bits ve Kicks gönderenleri sıralar",
      'Son abonelik, hediye abonelik, cheer ve raid için yayın etiketleri',
      '3 ile 10 arası sıra gösterir, ilk üç altın, gümüş ve bronz renkte',
      'Her isim kendi platformunun rengiyle işaretli',
      'Toplamlar sen sıfırlayana kadar yayından yayına saymaya devam eder',
      'Yayıncı ve modlar tabloyu !top reset ile sıfırlar',
      "OBS'te kaydedilir, sayfa yenilense de hiçbir toplam kaybolmaz",
      'Önerilen Tarayıcı Kaynağı boyutu: 440x380',
    ],
    es: [
      'Ordena a quienes más subs regalan o más Bits y Kicks envían en Twitch y Kick',
      'Etiquetas para el stream con lo último en subs, subs regaladas, cheers y raids',
      'Muestra de 3 a 10 puestos, con oro, plata y bronce para los tres primeros',
      'Cada nombre lleva el color de su plataforma',
      'Los totales siguen sumando de un stream a otro hasta que los reinicies',
      'El streamer y los mods reinician la tabla con !top reset',
      'Se guarda en OBS, así que una recarga conserva todos los totales',
      'Tamaño recomendado de la fuente de navegador: 440x380',
    ],
    fr: [
      'Classe ceux qui offrent le plus de subs ou envoient le plus de Bits et de Kicks sur Twitch et Kick',
      'Des labels de stream pour le dernier sub, sub offert, cheer et raid',
      "Affiche de 3 à 10 places, avec l'or, l'argent et le bronze pour les trois premiers",
      'Chaque pseudo marqué de la couleur de sa plateforme',
      "Les totaux continuent d'un stream à l'autre jusqu'à ce que tu les réinitialises",
      'Le streamer et les modos réinitialisent le classement avec !top reset',
      'Enregistré dans OBS, donc un rechargement garde chaque total',
      'Taille de source navigateur recommandée : 440x380',
    ],
    ja: [
      'TwitchとKickでギフトサブ、またはBitsとKicksを多く贈った人をランキング表示',
      '最新のサブスク、ギフトサブ、Cheer、レイドを配信用のラベルとして表示',
      '表示する順位は3〜10位。上位3人は金・銀・銅',
      '各名前にプラットフォームの色',
      '合計はリセットするまで配信をまたいで加算',
      '配信者とモデレーターは !top reset でランキングをリセット',
      'OBSに保存され、再読み込みしてもすべての合計を保持',
      'ブラウザソースの推奨サイズ: 440x380',
    ],
    pt: [
      'Ranking de quem mais dá subs de presente ou manda Bits e Kicks na Twitch e na Kick',
      'Rótulos para a live com o último sub, sub de presente, cheer e raid',
      'Mostra de 3 a 10 posições, com ouro, prata e bronze para os três primeiros',
      'Cada nome marcado com a cor da sua plataforma',
      'Os totais continuam somando de uma live para outra até você zerar',
      'O streamer e os mods zeram o ranking com !top reset',
      'Fica salvo no OBS, então uma recarga mantém todos os totais',
      'Tamanho recomendado da fonte de navegador: 440x380',
    ],
  },
  queue: {
    en: [
      'Viewers join from Twitch or Kick chat with !join, or a join word you pick',
      'A note after the join word, like an in-game name, shows next to the name',
      'Mods call viewers up with !next, one or more at a time',
      'Mods open, close and clear the queue and take viewers out from chat',
      'A subscribers-only mode and an optional queue limit',
      'Shows who is playing now, who is next and how many are waiting',
      'The queue is saved in OBS and survives reloads',
      'Recommended browser source size: 440x600',
    ],
    de: [
      'Zuschauer stellen sich im Twitch- oder Kick-Chat mit !join an, oder mit einem Keyword deiner Wahl',
      'Eine Notiz nach dem Keyword, etwa ein Ingame-Name, steht neben dem Namen',
      'Mods rufen Zuschauer mit !next auf, einzeln oder mehrere auf einmal',
      'Mods öffnen, schließen und leeren die Warteschlange und nehmen Zuschauer im Chat raus',
      'Ein Nur-Subs-Modus und ein optionales Limit für die Warteschlange',
      'Zeigt, wer gerade spielt, wer als Nächstes dran ist und wie viele warten',
      'Die Warteschlange wird in OBS gespeichert und übersteht ein Neuladen',
      'Empfohlene Größe der Browserquelle: 440x600',
    ],
    tr: [
      'İzleyiciler Twitch ya da Kick sohbetinden !join ya da senin seçtiğin bir kelimeyle sıraya girer',
      'Katılım kelimesinden sonra yazılan not, örneğin oyun içi ad, ismin yanında görünür',
      'Modlar !next ile izleyicileri tek tek ya da birkaç kişi birden çağırır',
      'Modlar sohbetten sırayı açar, kapatır, temizler ve izleyicileri sıradan çıkarır',
      'Sadece aboneler modu ve isteğe bağlı sıra sınırı',
      'Şu an kimin oynadığını, sırada kimin olduğunu ve kaç kişinin beklediğini gösterir',
      "Sıra OBS'te kaydedilir, sayfa yenilense de kaybolmaz",
      'Önerilen Tarayıcı Kaynağı boyutu: 440x600',
    ],
    es: [
      'Los espectadores entran desde el chat de Twitch o Kick con !join, o con la palabra clave que elijas',
      'Una nota tras la palabra clave, como el nombre en el juego, aparece junto al nombre',
      'Los mods llaman espectadores con !next, de uno en uno o varios a la vez',
      'Los mods abren, cierran y vacían la fila y sacan espectadores desde el chat',
      'Modo solo suscriptores y un límite opcional para la fila',
      'Muestra quién juega ahora, quién sigue y cuántos esperan',
      'La fila se guarda en OBS y aguanta las recargas',
      'Tamaño recomendado de la fuente de navegador: 440x600',
    ],
    fr: [
      'Les viewers rejoignent la file depuis le chat Twitch ou Kick avec !join, ou un mot-clé de ton choix',
      "Une note après le mot-clé, comme un pseudo en jeu, s'affiche à côté du nom",
      'Les modos appellent les viewers avec !next, un par un ou plusieurs à la fois',
      'Les modos ouvrent, ferment et vident la file et retirent des viewers depuis le chat',
      'Un mode abonnés uniquement et une limite de file en option',
      'Affiche qui joue en ce moment, qui passe ensuite et combien attendent',
      'La file est enregistrée dans OBS et survit aux rechargements',
      'Taille de source navigateur recommandée : 440x600',
    ],
    ja: [
      '視聴者はTwitchやKickのチャットで !join か、好きな参加キーワードを打って参加',
      '参加キーワードのあとのメモ（ゲーム内の名前など）を名前の横に表示',
      'モデレーターは !next で視聴者を呼び出し。1人ずつでも複数人まとめてでも',
      'モデレーターはチャットから受付の開始と締め切り、リストのクリア、視聴者の削除',
      'サブスク限定モードと、任意のリスト上限',
      'プレイ中の人、次の順番、待っている人数を表示',
      'リストはOBSに保存され、再読み込みしても保持',
      'ブラウザソースの推奨サイズ: 440x600',
    ],
    pt: [
      'O pessoal entra pelo chat da Twitch ou da Kick com !join, ou com uma palavra-chave que você escolher',
      'Uma nota depois da palavra-chave, tipo o nick no jogo, aparece ao lado do nome',
      'Os mods chamam espectadores com !next, um de cada vez ou vários juntos',
      'Os mods abrem, fecham e limpam a fila e tiram espectadores pelo chat',
      'Modo só inscritos e um limite de fila opcional',
      'Mostra quem está jogando agora, quem é o próximo e quantos estão esperando',
      'A fila fica salva no OBS e sobrevive a recarregamentos',
      'Tamanho recomendado da fonte de navegador: 440x600',
    ],
  },
  credits: {
    en: [
      'Movie-style credits that roll when the ending scene goes live in OBS',
      'Subscribers, gifted subs, Bits and Kicks, raiders, moderators and chatters from Twitch and Kick',
      'Biggest gifters and cheerers first, each name marked with its platform',
      'Bots and the broadcaster are left out of the chat list',
      'Your own first and last lines, three speeds and an optional loop',
      'The broadcaster and mods roll, stop and reset them with !credits',
      'The names are saved in OBS, and a new stream starts fresh',
      'Recommended browser source size: 1920x1080',
    ],
    de: [
      'Ein Abspann wie im Kino, der beim Wechsel zur Endszene in OBS läuft',
      'Abonnenten, Gift-Subs, Bits und Kicks, Raider, Moderatoren und Chatter von Twitch und Kick',
      'Die größten Gifts und Cheers zuerst, jeder Name mit seiner Plattform markiert',
      'Bots und der Streamer bleiben aus der Chat-Liste raus',
      'Eigene erste und letzte Zeile, drei Tempostufen und optionale Wiederholung',
      'Streamer und Mods starten, stoppen und leeren ihn mit !credits',
      'Die Namen werden in OBS gespeichert, ein neuer Stream startet leer',
      'Empfohlene Größe der Browserquelle: 1920x1080',
    ],
    tr: [
      "OBS'te bitiş sahnesine geçince akan film tarzı bir jenerik",
      "Twitch ve Kick'ten aboneler, hediye abonelikler, Bits ve Kicks, raid atanlar, moderatörler ve sohbet edenler",
      'En çok hediye ve cheer gönderenler önce gelir, her isim platformuyla işaretlenir',
      'Botlar ve yayıncı sohbet listesine girmez',
      'Kendi ilk ve son satırın, üç hız ve isteğe bağlı tekrar',
      'Yayıncı ve modlar !credits ile jeneriği başlatır, durdurur ve sıfırlar',
      "İsimler OBS'te kaydedilir, yeni bir yayın boş bir jenerikle başlar",
      'Önerilen Tarayıcı Kaynağı boyutu: 1920x1080',
    ],
    es: [
      'Créditos de película que desfilan al cambiar a la escena de cierre en OBS',
      'Suscriptores, subs regaladas, Bits y Kicks, raids, moderadores y chat de Twitch y Kick',
      'Los mayores regalos y cheers primero, cada nombre marcado con su plataforma',
      'Los bots y el streamer quedan fuera de la lista del chat',
      'Tu propia primera y última línea, tres velocidades y repetición opcional',
      'El streamer y los mods los lanzan, detienen y reinician con !credits',
      'Los nombres se guardan en OBS, y un nuevo stream empieza de cero',
      'Tamaño recomendado de la fuente de navegador: 1920x1080',
    ],
    fr: [
      'Un générique façon film qui défile quand tu passes sur la scène de fin dans OBS',
      'Abonnés, subs offerts, Bits et Kicks, raids, modérateurs et viewers du chat de Twitch et Kick',
      'Les plus gros cadeaux et cheers en premier, chaque nom marqué de sa plateforme',
      'Les bots et le streamer sont exclus de la liste du chat',
      'Ta propre première et dernière ligne, trois vitesses et une boucle en option',
      "Le streamer et les modos le lancent, l'arrêtent et le vident avec !credits",
      'Les noms sont enregistrés dans OBS, et un nouveau stream repart de zéro',
      'Taille de source navigateur recommandée : 1920x1080',
    ],
    ja: [
      'OBSで終了シーンに切り替えると流れる、映画のようなエンドロール',
      'TwitchとKickのサブスクライバー、ギフトサブ、Bits & Kicks、レイド、モデレーター、チャット参加者',
      'ギフトやCheerの多い人から順に並び、各名前にプラットフォームの目印を表示',
      'ボットと配信者自身はチャットのリストから除外',
      '最初と最後の行を自由に設定でき、速度は3段階、繰り返しも選択可能',
      '配信者とモデレーターは !credits で再生、停止、リセット',
      '名前はOBSに保存され、新しい配信は空の状態から開始',
      'ブラウザソースの推奨サイズ: 1920x1080',
    ],
    pt: [
      'Créditos estilo filme que rolam quando você troca para a cena de encerramento no OBS',
      'Inscritos, subs de presente, Bits e Kicks, raids, moderadores e quem conversou no chat da Twitch e da Kick',
      'Os maiores presentes, Bits e Kicks primeiro, cada nome marcado com a sua plataforma',
      'Os bots e o streamer ficam de fora da lista do chat',
      'Sua própria primeira e última linha, três velocidades e repetição opcional',
      'O streamer e os mods rolam, param e zeram os créditos com !credits',
      'Os nomes ficam salvos no OBS, e uma nova live começa do zero',
      'Tamanho recomendado da fonte de navegador: 1920x1080',
    ],
  },
  'event-list': {
    en: [
      'Subs, resubs, gifted subs, Bits, Kicks and raids from Twitch and Kick in one list',
      'Each row marked with its platform color',
      'Shows 3 to 10 events, newest on top or at the bottom',
      'Turn kinds of events off, and set the smallest cheer and raid that count',
      'Rows can fade out after a time you set',
      'The broadcaster and mods clear the list with !events clear',
      'The list is saved in OBS and survives reloads',
      'Recommended browser source size: 420x520',
    ],
    de: [
      'Subs, Resubs, Gift-Subs, Bits, Kicks und Raids von Twitch und Kick in einer Liste',
      'Jede Zeile in der Farbe ihrer Plattform markiert',
      'Zeigt 3 bis 10 Events, das neueste oben oder unten',
      'Event-Arten abschalten und festlegen, ab welchem Cheer und Raid sie zählen',
      'Zeilen können nach einer Zeit, die du festlegst, ausgeblendet werden',
      'Streamer und Mods leeren die Liste mit !events clear',
      'Die Liste wird in OBS gespeichert und übersteht ein Neuladen',
      'Empfohlene Größe der Browserquelle: 420x520',
    ],
    tr: [
      "Twitch ve Kick'ten abonelik, yenileme, hediye abonelik, Bits, Kicks ve raid'ler tek bir listede",
      'Her satır kendi platformunun rengiyle işaretli',
      '3 ile 10 arası etkinlik gösterir, en yenisi üstte ya da altta',
      "Etkinlik türlerini kapatabilir, sayılacak en küçük cheer ve raid'i belirleyebilirsin",
      'Satırlar ayarladığın süre sonunda kaybolabilir',
      'Yayıncı ve modlar listeyi !events clear ile temizler',
      "Liste OBS'te kaydedilir, sayfa yenilense de kaybolmaz",
      'Önerilen Tarayıcı Kaynağı boyutu: 420x520',
    ],
    es: [
      'Subs, resubs, subs regaladas, Bits, Kicks y raids de Twitch y Kick en una sola lista',
      'Cada fila lleva el color de su plataforma',
      'Muestra de 3 a 10 eventos, los nuevos arriba o abajo',
      'Desactiva tipos de eventos y fija el cheer y el raid mínimos que cuentan',
      'Las filas pueden desvanecerse tras el tiempo que elijas',
      'El streamer y los mods vacían la lista con !events clear',
      'La lista se guarda en OBS y aguanta las recargas',
      'Tamaño recomendado de la fuente de navegador: 420x520',
    ],
    fr: [
      'Subs, resubs, subs offerts, Bits, Kicks et raids de Twitch et Kick dans une seule liste',
      'Chaque ligne marquée de la couleur de sa plateforme',
      'Affiche de 3 à 10 événements, les plus récents en haut ou en bas',
      "Désactive des types d'événements et fixe le plus petit cheer et raid qui comptent",
      "Les lignes peuvent s'effacer après un délai que tu choisis",
      'Le streamer et les modos vident la liste avec !events clear',
      'La liste est enregistrée dans OBS et survit aux rechargements',
      'Taille de source navigateur recommandée : 420x520',
    ],
    ja: [
      'TwitchとKickのサブスク、継続サブスク、ギフトサブ、Bits、Kicks、レイドをひとつのリストに',
      '各行にプラットフォームの色',
      '表示するイベントは3〜10件。新しいイベントは上か下に',
      'イベントの種類ごとのオンオフと、カウントするCheerとレイドの最小値の設定',
      '設定した時間が過ぎると行がフェードアウト',
      '配信者とモデレーターは !events clear でリストを消去',
      'リストはOBSに保存され、再読み込みしても保持',
      'ブラウザソースの推奨サイズ: 420x520',
    ],
    pt: [
      'Subs, resubs, subs de presente, Bits, Kicks e raids da Twitch e da Kick numa lista só',
      'Cada linha marcada com a cor da sua plataforma',
      'Mostra de 3 a 10 eventos, os mais novos em cima ou embaixo',
      'Desligue tipos de eventos e defina o menor cheer e raid que contam',
      'As linhas podem sumir depois de um tempo que você define',
      'O streamer e os mods limpam a lista com !events clear',
      'A lista fica salva no OBS e sobrevive a recarregamentos',
      'Tamanho recomendado da fonte de navegador: 420x520',
    ],
  },
  weather: {
    en: [
      'The live weather for any place you pick, found by name or pasted as coordinates',
      'An icon, the temperature and the weather in words, with wind and humidity',
      'A forecast row for the next hours or the next days, with highs and lows',
      'A card or a one-line pill on a dark, light or no background, in any corner and at any size',
      '°C and km/h or °F and mph, with forecast times in your own time zone',
      'Weather data from MET Norway, free, with no account or API key',
      'Updates on its own and is saved in OBS, so it shows at once after a reload',
      'Recommended browser source size: 1920x1080',
    ],
    de: [
      'Das Live-Wetter für jeden Ort, den du wählst, per Suche oder als eingefügte Koordinaten',
      'Ein Symbol, die Temperatur und das Wetter in Worten, dazu Wind und Luftfeuchtigkeit',
      'Eine Vorhersagezeile für die nächsten Stunden oder Tage, mit Höchst- und Tiefstwerten',
      'Eine Karte oder eine einzeilige Leiste auf dunklem, hellem oder ohne Hintergrund, in jeder Ecke und jeder Größe',
      '°C und km/h oder °F und mph, mit Vorhersagezeiten in deiner eigenen Zeitzone',
      'Wetterdaten von MET Norway, kostenlos, ohne Konto und API-Schlüssel',
      'Aktualisiert sich von selbst und wird in OBS gespeichert, daher nach einem Neuladen sofort da',
      'Empfohlene Größe der Browserquelle: 1920x1080',
    ],
    tr: [
      'Seçtiğin her yerin canlı hava durumu; adıyla bulunur ya da koordinatla yapıştırılır',
      'Simge, sıcaklık ve havanın yazıyla anlatımı, yanında rüzgâr ve nem',
      'Önümüzdeki saatler ya da günler için en yüksek ve en düşük sıcaklıklarla tahmin satırı',
      'Koyu, açık ya da arka plansız bir kart veya tek satır; istediğin köşede ve istediğin boyutta',
      '°C ve km/sa ya da °F ve mph; tahmin saatleri kendi saat diliminde',
      "MET Norway'den ücretsiz hava durumu verisi; hesap ya da API anahtarı gerekmez",
      "Kendi kendine güncellenir ve OBS'te kaydedilir, sayfa yenilense de hemen görünür",
      'Önerilen Tarayıcı Kaynağı boyutu: 1920x1080',
    ],
    es: [
      'El clima en vivo de cualquier lugar que elijas, buscado por nombre o pegado como coordenadas',
      'Un ícono, la temperatura y el clima en palabras, con viento y humedad',
      'Una fila de pronóstico para las próximas horas o días, con máximas y mínimas',
      'Una tarjeta o una barra de una línea con fondo oscuro, claro o sin fondo, en cualquier esquina y del tamaño que quieras',
      '°C y km/h o °F y mph, con las horas del pronóstico en tu propia zona horaria',
      'Datos del clima de MET Norway, gratis, sin cuenta ni clave de API',
      'Se actualiza solo y se guarda en OBS, así que aparece al instante tras recargar',
      'Tamaño recomendado de la fuente de navegador: 1920x1080',
    ],
    fr: [
      'La météo en direct du lieu de ton choix, trouvé par son nom ou collé en coordonnées',
      "Une icône, la température et le temps en toutes lettres, avec le vent et l'humidité",
      'Une ligne de prévisions pour les prochaines heures ou les prochains jours, avec maximales et minimales',
      "Une carte ou un bandeau d'une ligne sur fond sombre, clair ou sans fond, dans le coin et à la taille de ton choix",
      '°C et km/h ou °F et mph, avec les heures des prévisions dans ton propre fuseau horaire',
      "Données météo de MET Norway, gratuites, sans compte ni clé d'API",
      "Se met à jour toute seule et est enregistrée dans OBS, donc s'affiche tout de suite après un rechargement",
      'Taille de source navigateur recommandée : 1920x1080',
    ],
    ja: [
      '選んだ場所のリアルタイムの天気。名前で検索するか座標を貼り付けて指定',
      'アイコン、気温、天気の説明に加えて風と湿度も表示',
      'この先の時間帯または数日間の予報を最高気温と最低気温つきで表示',
      'カードか1行のバーを、ダーク、ライト、背景なしで、好きな隅に好きなサイズで配置',
      '°Cとkm/hまたは°Fとmph。予報の時刻は自分のタイムゾーンで表示',
      'MET Norwayの天気データを無料で使用。アカウントやAPIキーは不要',
      '自動で更新され、OBSに保存されるので再読み込みしてもすぐに表示',
      'ブラウザソースの推奨サイズ: 1920x1080',
    ],
    pt: [
      'O clima ao vivo de qualquer lugar que você escolher, buscado pelo nome ou colado como coordenadas',
      'Um ícone, a temperatura e o tempo por extenso, com vento e umidade',
      'Uma linha de previsão para as próximas horas ou dias, com máximas e mínimas',
      'Um cartão ou uma barra de uma linha com fundo escuro, claro ou sem fundo, em qualquer canto e do tamanho que quiser',
      '°C e km/h ou °F e mph, com os horários da previsão no seu próprio fuso horário',
      'Dados do clima do MET Norway, grátis, sem conta nem chave de API',
      'Atualiza sozinho e fica salvo no OBS, então aparece na hora depois de recarregar',
      'Tamanho recomendado da fonte de navegador: 1920x1080',
    ],
  },
  countdown: {
    en: [
      'A countdown for your starting soon, back soon and stream ending scenes',
      'Counts down a length you set, or to a time of day like 21:00',
      'At zero: a message that hides itself after a hold time you set, the clock at 00:00, or the overlay hides itself',
      'Your own headline, note, end message and per-scene icon or channel emote, or the wording of the scene',
      'Preset looks, with or without a panel, and an optional progress bar',
      'The broadcaster and mods can switch scenes, add, remove, set, pause and reset the time, and set the headline and note with !countdown from Twitch or Kick chat',
      'No channel and no login needed unless you want the chat commands',
      'Recommended browser source size: 1920x1080',
    ],
    de: [
      'Ein Countdown für deine Szenen vor dem Start, in der Pause und am Stream-Ende',
      'Zählt eine eingestellte Dauer herunter oder bis zu einer Uhrzeit wie 21:00',
      'Bei null: eine Nachricht, die Uhr auf 00:00 oder das Overlay blendet sich aus',
      'Eigene Überschrift, Notiz und Endnachricht oder die Texte der Szene',
      'Preset-Looks mit oder ohne Panel und ein optionaler Fortschrittsbalken',
      'Streamer und Mods können die Zeit mit !countdown aus dem Twitch- oder Kick-Chat erhöhen, senken, setzen, pausieren und zurücksetzen',
      'Kein Kanal und kein Login nötig, außer du willst die Chat-Befehle',
      'Empfohlene Größe der Browserquelle: 1920x1080',
    ],
    tr: [
      'Başlangıç, mola ve bitiş sahnelerin için geri sayım',
      'Verdiğin süreyi ya da 21:00 gibi bir saati geri sayar',
      "Sıfıra gelince: ayarladığın süre sonunda gizlenen bir mesaj, 00:00'da duran saat ya da gizlenen overlay",
      'Kendi başlığın, notun, bitiş mesajın, sahne ikonun ya da kanal emoten, veya sahnenin hazır yazısı',
      'Preset görünümleri, panelli ya da panelsiz, isteğe bağlı ilerleme barı',
      'Yayıncı ve modlar Twitch ya da Kick sohbetinden !countdown ile sahne değiştirip süre ekleyip çıkarabilir, ayarlayabilir, duraklatıp sıfırlayabilir, başlık ve notu değiştirebilir',
      'Sohbet komutlarını istemiyorsan ne kanal ne de giriş gerekir',
      'Önerilen Tarayıcı Kaynağı boyutu: 1920x1080',
    ],
    es: [
      'Una cuenta regresiva para tus escenas de empezamos pronto, vuelvo pronto y fin del stream',
      'Cuenta una duración que eliges, o hasta una hora del día como 21:00',
      'Al llegar a cero: un mensaje, el reloj en 00:00 o el overlay se oculta solo',
      'Tu propio titular, nota y mensaje final, o el texto de la escena',
      'Aspecto de preset, con o sin panel, y una barra de progreso opcional',
      'El streamer y los mods pueden sumar, quitar, fijar, pausar y reiniciar el tiempo con !countdown desde el chat de Twitch o Kick',
      'No hace falta canal ni iniciar sesión, salvo que quieras los comandos del chat',
      'Tamaño recomendado de la fuente de navegador: 1920x1080',
    ],
    fr: [
      'Un compte à rebours pour tes scènes ça commence bientôt, je reviens vite et fin du stream',
      "Décompte une durée choisie, ou jusqu'à une heure précise comme 21:00",
      "À zéro : un message, l'horloge à 00:00, ou l'overlay qui se masque",
      'Ton propre titre, ta note et ton message de fin, ou le texte de la scène',
      'Styles des presets, avec ou sans panneau, et une barre de progression en option',
      'Le streamer et les modos peuvent ajouter, retirer, définir, mettre en pause et réinitialiser le temps avec !countdown depuis le chat Twitch ou Kick',
      'Pas besoin de chaîne ni de connexion, sauf pour les commandes du chat',
      'Taille de source navigateur recommandée : 1920x1080',
    ],
    ja: [
      'まもなく開始、すぐ戻ります、まもなく配信終了のシーン用のカウントダウン',
      '設定した長さ、または21:00のような時刻に向けてカウントダウン',
      'ゼロになったら、メッセージ、00:00 の時計、またはオーバーレイを非表示',
      '見出し、メモ、終了メッセージを自由に設定、またはシーンの文言を使用',
      'プリセットの見た目、パネルの有無、プログレスバーの表示を選択可能',
      '配信者とモデレーターは、TwitchやKickのチャットから !countdown で追加、削除、設定、一時停止、リセット',
      'チャットコマンドを使わなければ、チャンネルもログインも不要',
      'ブラウザソースの推奨サイズ: 1920x1080',
    ],
    pt: [
      'Uma contagem regressiva para as cenas de começando em breve, já volto e fim da live',
      'Conta uma duração que você define, ou até um horário tipo 21:00',
      'No zero: uma mensagem, o relógio em 00:00, ou o overlay se esconde',
      'Seu próprio título, nota e mensagem final, ou o texto da cena',
      'Visuais de preset, com ou sem painel, e uma barra de progresso opcional',
      'O streamer e os mods podem adicionar, tirar, definir, pausar e zerar o tempo com !countdown pelo chat da Twitch ou da Kick',
      'Não precisa de canal nem de login, a não ser que você queira os comandos do chat',
      'Tamanho recomendado da fonte de navegador: 1920x1080',
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
    de: [
      'Zuschauer stimmen im Chat mit einer Zahl, mit !vote und einer Zahl oder mit der Option selbst ab',
      'Stimmen aus Twitch und Kick landen in einer Umfrage, und jeder Zuschauer zählt einmal',
      'Streamer und Mods starten Umfragen mit !poll, verlängern, beenden und brechen sie ab',
      'Eine fertige Umfrage von der Setup-Seite startet mit !poll start',
      'Live-Balken, ein Countdown und am Ende der Gewinner oder ein Gleichstand',
      'Optional: nur Subs, Sub-Stimmen zählen 2× oder 3×, Ergebnisse bleiben bis zum Ende verborgen',
      'Späte Stimmen von Zuschauern mit Stream-Verzögerung zählen noch ein paar Sekunden',
      'Accounts mit Timeout oder Bann verlieren ihre Stimme',
      'Empfohlene Größe der Browserquelle: 640x560',
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
    es: [
      'Los espectadores votan escribiendo un número, !vote y un número, o la opción misma en el chat',
      'Los votos de Twitch y Kick van a una sola encuesta, y cada espectador cuenta una vez',
      'El streamer y los mods lanzan encuestas, suman tiempo, las cierran y las cancelan con !poll',
      'Una encuesta preparada en la página de configuración se lanza con !poll start',
      'Barras en vivo, un contador, y el ganador o un empate al final',
      'Opcional: solo suscriptores, votos de subs que cuentan 2× o 3×, resultados ocultos hasta el final',
      'Los votos tardíos de quienes ven el stream con retraso siguen contando unos segundos',
      'Las cuentas con timeout o baneadas pierden su voto',
      'Tamaño recomendado de la fuente de navegador: 640x560',
    ],
    fr: [
      "Les viewers votent en tapant un numéro, !vote et un numéro, ou l'option elle-même dans le chat",
      'Les votes de Twitch et Kick vont dans un seul sondage, et chaque viewer compte une fois',
      'Le streamer et les modos lancent les sondages, ajoutent du temps, les terminent et les annulent avec !poll',
      'Un sondage prêt depuis la page de configuration se lance avec !poll start',
      'Barres en direct, un compte à rebours, et le gagnant ou une égalité à la fin',
      "En option : abonnés uniquement, votes des subs qui comptent 2× ou 3×, résultats masqués jusqu'à la fin",
      'Les votes tardifs des viewers qui regardent en différé comptent encore quelques secondes',
      'Les comptes en timeout ou bannis perdent leur vote',
      'Taille de source navigateur recommandée : 640x560',
    ],
    ja: [
      '視聴者はチャットで番号、!vote と番号、または選択肢そのものを打って投票',
      'TwitchとKickの票をひとつの投票にまとめ、1人1票でカウント',
      '配信者とモデレーターは !poll で投票の開始、延長、締め切り、取り消し',
      '設定ページで用意した投票を !poll start で開始',
      'リアルタイムのバー、カウントダウン、最後に勝者か引き分けを表示',
      'オプション: サブスク限定、サブスクの票を2倍か3倍、終了まで結果を非表示',
      '配信の遅れで遅れて届いた票も、数秒間はカウント',
      'タイムアウトやBANされたアカウントの票は取り消し',
      'ブラウザソースの推奨サイズ: 640x560',
    ],
    pt: [
      'O pessoal vota digitando um número, !vote e um número, ou a própria opção no chat',
      'Os votos da Twitch e da Kick vão para a mesma enquete, e cada espectador conta uma vez',
      'O streamer e os mods abrem enquetes, adicionam tempo, encerram e cancelam com !poll',
      'Uma enquete pronta da página de configuração começa com !poll start',
      'Barras ao vivo, contagem regressiva, e o vencedor ou um empate no final',
      'Opcional: só inscritos, voto de sub valendo 2× ou 3×, resultado escondido até o fim',
      'Votos atrasados de quem assiste com delay ainda contam por alguns segundos',
      'Contas com timeout ou ban perdem o voto',
      'Tamanho recomendado da fonte de navegador: 640x560',
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
    de: [
      'Zuschauer machen mit, indem sie ein Stichwort in den Chat schreiben, standardmäßig !join',
      'Läuft auf Twitch oder Kick, eine Plattform pro Verlosung',
      'Nur Subs, mit einer Mindestzahl an Sub-Monaten',
      'Maximal 1 bis 5 Gewinne pro Zuschauer oder unbegrenzt',
      'Mindestzeit vor der Ziehung, 0 bis 300 Sekunden',
      'Bekannte Bots werden übersprungen',
      'Gewinner-Overlay mit Konfetti, als 1920x1080-Browserquelle im selben Browser oder in derselben App',
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
    es: [
      'Los espectadores entran escribiendo una palabra clave en el chat, !join por defecto',
      'Funciona en Twitch o Kick, una plataforma por sorteo',
      'Solo suscriptores, con un mínimo de meses de sub',
      'Máximo de victorias por espectador de 1 a 5, o ilimitado',
      'Tiempo mínimo antes del sorteo, de 0 a 300 segundos',
      'Los bots conocidos se saltan',
      'Overlay del ganador con confeti, como fuente de navegador de 1920x1080 en el mismo navegador o programa',
    ],
    fr: [
      'Les viewers participent en tapant un mot-clé dans le chat, !join par défaut',
      'Fonctionne sur Twitch ou Kick, une plateforme par tirage',
      'Abonnés uniquement, avec un nombre minimum de mois de sub',
      'Victoires max par viewer de 1 à 5, ou illimité',
      'Durée minimale avant le tirage, de 0 à 300 secondes',
      'Les bots connus sont ignorés',
      'Overlay du gagnant avec confettis, en source navigateur 1920x1080 dans le même navigateur ou la même appli',
    ],
    ja: [
      '視聴者はチャットでキーワードを打って参加。初期設定は !join',
      'TwitchかKickで動作。抽選ごとにひとつのプラットフォーム',
      'サブスク限定。最低サブスク月数も設定可能',
      '1人あたりの最大当選回数は1から5、または無制限',
      '抽選までの最短時間は0から300秒',
      '既知のボットは除外',
      '紙吹雪付きの当選者オーバーレイ。同じブラウザかアプリで1920x1080のブラウザソースとして使用',
    ],
    pt: [
      'O pessoal entra digitando uma palavra-chave no chat, !join por padrão',
      'Roda na Twitch ou na Kick, uma plataforma por sorteio',
      'Só inscritos, com um mínimo de meses de sub',
      'Máximo de vitórias por espectador de 1 a 5, ou sem limite',
      'Tempo mínimo antes do sorteio, de 0 a 300 segundos',
      'Bots conhecidos são ignorados',
      'Overlay do vencedor com confete, como fonte de navegador de 1920x1080 no mesmo navegador ou programa',
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
    de: [
      'OBS-Szenen aus dem Twitch- oder Kick-Chat mit !scene und einem Szenennamen wechseln',
      'brb und back wechseln zu den Szenen BRB und Main',
      'Stream und Aufnahme aus dem Chat starten und stoppen',
      'Nur freigegebene Nutzer, jeweils an eine Plattform gebunden, können Befehle ausführen',
      'Jeder Befehl lässt sich umbenennen',
      'Verbindet sich mit obs-websocket 5 (OBS Studio 28 und neuer), standardmäßig ws://127.0.0.1:4455',
      'Läuft in einem Browser-Tab oder einem benutzerdefinierten Browser-Dock in OBS',
    ],
    tr: [
      'Twitch ya da Kick sohbetinden !scene ve sahne adıyla OBS sahnesi değiştirir',
      'brb ve back, BRB ve Ana sahneye geçirir',
      'Sohbetten yayını ve kaydı başlatıp durdurur',
      'Komutları sadece her biri bir platforma bağlı yetkili kullanıcılar çalıştırabilir',
      'Her komutun adı değiştirilebilir',
      "obs-websocket 5'e bağlanır (OBS Studio 28 ve sonrası), varsayılan adres ws://127.0.0.1:4455",
      "Bir tarayıcı sekmesinde ya da OBS'teki bir Özel Tarayıcı Yuvası'nda çalışır",
    ],
    es: [
      'Cambia escenas de OBS desde el chat de Twitch o Kick con !scene y el nombre de una escena',
      'brb y back cambian a las escenas BRB y principal',
      'Inicia y detén el stream y la grabación desde el chat',
      'Solo los usuarios autorizados, cada uno ligado a una plataforma, pueden usar comandos',
      'Puedes cambiar el nombre de cada comando',
      'Se conecta a obs-websocket 5 (OBS Studio 28 y posteriores), ws://127.0.0.1:4455 por defecto',
      'Funciona en una pestaña del navegador o en un panel de navegador personalizado de OBS',
    ],
    fr: [
      'Change de scène OBS depuis le chat Twitch ou Kick avec !scene et un nom de scène',
      'brb et back passent sur les scènes BRB et principale',
      "Lance et arrête le stream et l'enregistrement depuis le chat",
      'Seuls les utilisateurs autorisés, chacun lié à une plateforme, peuvent lancer des commandes',
      'Chaque commande peut être renommée',
      'Se connecte à obs-websocket 5 (OBS Studio 28 et plus), ws://127.0.0.1:4455 par défaut',
      "Tourne dans un onglet du navigateur ou un dock Internet personnalisé d'OBS",
    ],
    ja: [
      'TwitchやKickのチャットから !scene とシーン名でOBSのシーンを切り替え',
      'brb と back でBRBシーンとメインシーンに切り替え',
      'チャットから配信と録画を開始・停止',
      'コマンドを使えるのは、プラットフォームごとに登録した許可ユーザーだけ',
      'すべてのコマンドの名前を変更可能',
      'obs-websocket 5（OBS Studio 28以降）に接続。初期設定は ws://127.0.0.1:4455',
      'ブラウザのタブかOBSのカスタムブラウザドックで動作',
    ],
    pt: [
      'Troque as cenas do OBS pelo chat da Twitch ou da Kick com !scene e o nome da cena',
      'brb e back trocam para as cenas BRB e principal',
      'Inicie e pare a transmissão e a gravação pelo chat',
      'Só usuários autorizados, cada um ligado a uma plataforma, podem usar os comandos',
      'Todo comando pode ser renomeado',
      'Conecta no obs-websocket 5 (OBS Studio 28 ou mais novo), ws://127.0.0.1:4455 por padrão',
      'Roda numa aba do navegador ou num painel personalizável com URL do OBS',
    ],
  },
  socials: {
    en: [
      'Display your social media handles (Twitter, YouTube, TikTok, Instagram, etc.) on stream',
      'Rotates through your links with a slick slide-up animation',
      'Configurable rotation interval',
      'Adjust text color and pill background color to match your brand',
      'Recommended browser source size: 600x120',
    ],
    de: [
      'Zeig deine Social-Media-Profile (Twitter, YouTube, TikTok, Instagram usw.) im Stream',
      'Deine Links wechseln sich mit einer sauberen Slide-up-Animation ab',
      'Einstellbares Wechselintervall',
      'Passe Textfarbe und Hintergrundfarbe der Pille an deine Marke an',
      'Empfohlene Größe der Browserquelle: 600x120',
    ],
    tr: [
      'Sosyal medya hesaplarını (Twitter, YouTube, TikTok, Instagram vb.) yayında göster',
      'Linklerin şık bir kaydırma animasyonuyla sırayla görünür',
      'Ayarlanabilir geçiş aralığı',
      'Yazı rengini ve kutu arka plan rengini markana uygun ayarla',
      'Önerilen Tarayıcı Kaynağı boyutu: 600x120',
    ],
    es: [
      'Muestra tus redes sociales (Twitter, YouTube, TikTok, Instagram, etc.) en el stream',
      'Rota por tus enlaces con una animación elegante de deslizamiento hacia arriba',
      'Intervalo de rotación configurable',
      'Ajusta el color del texto y el fondo de la píldora a tu marca',
      'Tamaño recomendado de la fuente de navegador: 600x120',
    ],
    fr: [
      'Affiche tes pseudos de réseaux sociaux (Twitter, YouTube, TikTok, Instagram, etc.) en stream',
      'Fait défiler tes liens avec une animation de glissement vers le haut soignée',
      'Intervalle de rotation réglable',
      'Règle la couleur du texte et du fond de la pastille selon ton identité visuelle',
      'Taille de source navigateur recommandée : 600x120',
    ],
    ja: [
      '配信にSNSのアカウント（Twitter、YouTube、TikTok、Instagramなど）を表示',
      'なめらかな上スライドのアニメーションでリンクを順番に切り替え',
      '切り替え間隔を設定可能',
      '文字の色とピル型背景の色を、ブランドに合わせて調整可能',
      'ブラウザソースの推奨サイズ: 600x120',
    ],
    pt: [
      'Mostre seus perfis nas redes sociais (Twitter, YouTube, TikTok, Instagram etc.) na live',
      'Seus links se revezam com uma animação caprichada de deslizar para cima',
      'Intervalo de troca configurável',
      'Ajuste a cor do texto e a cor de fundo da pílula para combinar com a sua marca',
      'Tamanho recomendado da fonte de navegador: 600x120',
    ],
  },
  'spin-wheel': {
    en: [
      'One option per line, the wheel updates as you type',
      'Viewers spin it from Twitch and Kick chat with !spin',
      'Everyone, subs-only or mods-only spinning',
      'One global cooldown, counted down on screen',
      'OBS overlay with sound, confetti and a winner card',
      'Secure random pick with a live spinning animation',
    ],
    de: [
      'Eine Option pro Zeile, das Rad folgt beim Tippen',
      'Zuschauer drehen es per !spin aus Twitch- und Kick-Chat',
      'Alle, nur Subs oder nur Mods dürfen drehen',
      'Ein globaler Cooldown, auf dem Bildschirm heruntergezählt',
      'OBS-Overlay mit Sound, Konfetti und Gewinner-Karte',
      'Sichere Zufallsziehung mit Live-Dreh-Animation',
    ],
    tr: [
      'Her satıra bir seçenek, çark yazarken güncellenir',
      'İzleyiciler Twitch ve Kick sohbetinden !spin ile çevirir',
      'Herkes, sadece aboneler ya da sadece modlar çevirebilir',
      'Ekranda geri sayılan tek bir genel bekleme süresi',
      'Ses, konfeti ve kazanan kartıyla OBS overlay’i',
      'Canlı dönüş animasyonuyla güvenli rastgele seçim',
    ],
    es: [
      'Una opción por línea, la ruleta se actualiza al escribir',
      'Tus espectadores la giran con !spin desde Twitch y Kick',
      'Giros para todos, solo subs o solo mods',
      'Un enfriamiento global contado en pantalla',
      'Overlay para OBS con sonido, confeti y tarjeta de ganador',
      'Sorteo aleatorio seguro con animación de giro en vivo',
    ],
    fr: [
      'Une option par ligne, la roue suit pendant la frappe',
      'Tes viewers la tournent avec !spin depuis Twitch et Kick',
      'Tout le monde, subs seuls ou modos seuls',
      'Un seul cooldown global, décompté à l’écran',
      'Overlay OBS avec son, confettis et carte de gagnant',
      'Tirage aléatoire sécurisé avec animation en direct',
    ],
    ja: [
      '1行に1つずつ入力、入力に合わせて更新',
      '視聴者はTwitchやKickのチャットで!spinと入力して回す',
      '全員・サブスク限定・モデレーター限定を選べる',
      '画面にカウント表示される共通クールダウン',
      '効果音・紙吹雪・当選カード付きのOBSオーバーレイ',
      'ライブアニメーション付きの安全なランダム抽選',
    ],
    pt: [
      'Uma opção por linha, a roleta atualiza ao digitar',
      'Seus espectadores giram com !spin pela Twitch e Kick',
      'Giros para todos, só subs ou só mods',
      'Um cooldown global contado na tela',
      'Overlay para OBS com som, confete e cartão de vencedor',
      'Sorteio aleatório seguro com animação ao vivo',
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
