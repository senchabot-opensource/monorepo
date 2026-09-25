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
        'Twelve free overlays and tools for Twitch and Kick streamers: chat box, emote wall, alerts, sub goal, subathon timer, frames, countdown, poll and raffle.',
    },
    de: {
      title: 'Kostenlose Twitch- und Kick-Overlays für OBS | Senchabot',
      description:
        'Zwölf kostenlose Overlays und Tools für Twitch- und Kick-Streamer: Chat-Box, Emote-Wand, Alerts, Sub-Ziel, Subathon, Rahmen, Countdown, Umfrage, Verlosung.',
    },
    tr: {
      title: "OBS için Ücretsiz Twitch ve Kick Overlay'leri | Senchabot",
      description:
        'Twitch ve Kick yayıncıları için 12 ücretsiz overlay ve araç: sohbet kutusu, emote duvarı, uyarılar, abone hedefi, subathon, çerçeve, geri sayım, anket, çekiliş.',
    },
    es: {
      title: 'Overlays gratis de Twitch y Kick para OBS | Senchabot',
      description:
        'Doce overlays y herramientas gratis para streamers de Twitch y Kick: caja de chat, muro de emotes, alertas, meta de subs, subathon, marcos, encuestas y sorteos.',
    },
    fr: {
      title: 'Overlays Twitch et Kick gratuits pour OBS | Senchabot',
      description:
        "Douze overlays et outils gratuits pour streamers Twitch et Kick : boîte de chat, mur d'emotes, alertes, objectif de subs, subathon, cadres, sondage et tirage.",
    },
    ja: {
      title: 'OBS用の無料Twitch・Kickオーバーレイ | Senchabot Extensions',
      description:
        'TwitchとKickの配信者向けの無料オーバーレイとツールが12種類。チャットボックス、エモートウォール、アラート、サブスク目標、サブアソンタイマー、フレーム、カウントダウン、投票、抽選。',
    },
    pt: {
      title: 'Overlays grátis Twitch e Kick no OBS | Senchabot Extensions',
      description:
        'Doze overlays e ferramentas grátis para streamers da Twitch e da Kick: chat, emotes, alertas, meta de subs, subathon, molduras, contagem, enquete e sorteio.',
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
        'Emote-only Twitch and Kick messages pop up on your stream in Calm, Chaos or Bounce mode, 7TV emotes from your Twitch channel included. Free, no login needed.',
    },
    de: {
      title: 'Emote-Wand-Overlay für Twitch, Kick und 7TV | Senchabot',
      description:
        'Reine Emote-Nachrichten aus Twitch und Kick erscheinen im Stream, im Modus Ruhig, Chaos oder Abprallen, mit 7TV-Emotes deines Twitch-Kanals. Gratis, ohne Login.',
    },
    tr: {
      title: "Twitch, Kick ve 7TV için Emote Duvarı Overlay'i | Senchabot",
      description:
        "Sadece emote'tan oluşan Twitch ve Kick mesajları yayında Sakin, Kaos ya da Sekme modunda uçuşur. Twitch kanalının 7TV emote'ları dahil. Ücretsiz, giriş yok.",
    },
    es: {
      title: 'Muro de Emotes para Twitch, Kick y 7TV | Senchabot',
      description:
        'Los mensajes de solo emotes de Twitch y Kick salen en tu stream en modo Tranquilo, Caos o Rebote, con los emotes 7TV de tu canal de Twitch. Gratis y sin login.',
    },
    fr: {
      title: "Mur d'emotes pour Twitch, Kick et 7TV | Senchabot",
      description:
        "Les messages d'emotes Twitch et Kick s'affichent sur ton stream en mode Calme, Chaos ou Rebond, emotes 7TV de ta chaîne Twitch incluses. Gratuit, sans login.",
    },
    ja: {
      title: 'Twitch・Kick・7TV対応のエモートウォール | Senchabot',
      description:
        'TwitchとKickのエモートだけのメッセージが、おだやか、カオス、バウンスのモードで配信画面に飛び出します。Twitchチャンネルの7TVエモートにも対応。無料でログイン不要。',
    },
    pt: {
      title: 'Mural de Emotes para Twitch, Kick e 7TV | Senchabot',
      description:
        'Mensagens só de emotes da Twitch e da Kick aparecem na sua live no modo Calmo, Caos ou Quicar, com os emotes 7TV do seu canal da Twitch. Grátis e sem login.',
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
  countdown: {
    en: {
      title: 'Free Starting Soon & BRB Countdown for OBS | Senchabot',
      description:
        'A free countdown overlay for OBS. Set a length, or the time of day you go live, for your starting, break and ending scenes. Your mods change it from chat.',
    },
    de: {
      title: 'Kostenloser Starting-Soon- und BRB-Countdown | Senchabot',
      description:
        'Ein kostenloser Countdown für OBS. Stell eine Dauer oder die Uhrzeit ein, zu der du live gehst, für Start-, Pausen- und Endszene. Deine Mods ändern ihn im Chat.',
    },
    tr: {
      title: 'Twitch ve Kick için Yayın Geri Sayımı | Senchabot',
      description:
        "OBS için ücretsiz geri sayım overlay'i. Başlangıç, mola ve bitiş sahnelerin için bir süre ya da 21:00 gibi bir saat belirle, modların sohbetten uzatsın.",
    },
    es: {
      title: 'Cuenta regresiva gratis para OBS | Senchabot',
      description:
        'Una cuenta regresiva gratis para OBS. Pon una duración, o la hora a la que empiezas, en tus escenas de inicio, pausa y cierre. Tus mods la cambian en el chat.',
    },
    fr: {
      title: 'Compte à rebours de début et BRB pour OBS | Senchabot',
      description:
        "Un compte à rebours gratuit pour OBS. Règle une durée, ou l'heure de ton live, pour tes scènes de début, de pause et de fin. Tes modos le changent en chat.",
    },
    ja: {
      title: 'OBS用の無料の開始前・BRBカウントダウン | Senchabot',
      description:
        'OBS用の無料カウントダウンオーバーレイ。開始前、休憩、終了のシーンに、時間の長さか配信を始める時刻を設定できます。モデレーターはチャットから時間を変更できます。',
    },
    pt: {
      title: 'Contagem de início e BRB grátis para OBS | Senchabot',
      description:
        'Contagem regressiva grátis para o OBS. Defina uma duração, ou o horário em que você entra ao vivo, nas cenas de início, pausa e fim. Os mods mudam pelo chat.',
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
      'Calm, Chaos and Bounce animation modes',
      'Emote size 32 to 256 px, 2 to 30 seconds on screen, up to 120 at once',
      'Subscribers only, longer sub emotes, Hype Mode and emote spam blocking',
      'Recommended browser source size: 1920x1080',
    ],
    de: [
      'Reine Emote-Nachrichten aus Twitch und Kick erscheinen als Emotes auf dem Bildschirm',
      'Auf Wunsch kommen auch bis zu 5 Emotes aus normalen Nachrichten dazu',
      '7TV-Emotes aus dem aktiven Set des Twitch-Kanals, auch im Kick-Chat',
      'Animationsmodi Ruhig, Chaos und Abprallen',
      'Emote-Größe 32 bis 256 px, 2 bis 30 Sekunden sichtbar, bis zu 120 gleichzeitig',
      'Nur Subs, längere Sub-Emotes, Hype-Modus und Schutz vor Emote-Spam',
      'Empfohlene Größe der Browserquelle: 1920x1080',
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
    es: [
      'Los mensajes de solo emotes de Twitch y Kick aparecen como emotes en pantalla',
      'Mostrar todos los emotes también saca hasta 5 emotes de los mensajes normales',
      'Emotes de 7TV del set activo del canal de Twitch, también en el chat de Kick',
      'Modos de animación Tranquilo, Caos y Rebote',
      'Emotes de 32 a 256 px, de 2 a 30 segundos en pantalla, hasta 120 a la vez',
      'Solo suscriptores, emotes de subs más largos, modo hype y bloqueo de spam de emotes',
      'Tamaño recomendado de la fuente de navegador: 1920x1080',
    ],
    fr: [
      "Les messages d'emotes Twitch et Kick s'affichent en emotes à l'écran",
      "Toutes les emotes récupère aussi jusqu'à 5 emotes dans les messages normaux",
      'Emotes 7TV du set actif de la chaîne Twitch, dans le chat Kick aussi',
      "Modes d'animation Calme, Chaos et Rebond",
      "Emotes de 32 à 256 px, de 2 à 30 secondes à l'écran, jusqu'à 120 à la fois",
      "Abonnés uniquement, emotes des subs plus longues, Mode hype et blocage du spam d'emotes",
      'Taille de source navigateur recommandée : 1920x1080',
    ],
    ja: [
      'TwitchとKickのエモートだけのメッセージが、画面にエモートとして表示',
      '「すべてのエモートを表示」で、普通のメッセージからもエモートを5個まで表示',
      'Twitchチャンネルのアクティブなセットの7TVエモートを、Kickのチャットでも表示',
      'おだやか、カオス、バウンスの3つのアニメーションモード',
      'エモートのサイズは32から256px、表示時間は2から30秒、同時表示は最大120個',
      'サブスク限定、サブスクのエモートを長く表示、ハイプモード、エモートスパムのブロック',
      'ブラウザソースの推奨サイズ: 1920x1080',
    ],
    pt: [
      'Mensagens só de emotes da Twitch e da Kick aparecem como emotes na tela',
      'Mostrar todos os emotes também pega até 5 emotes de mensagens normais',
      'Emotes da 7TV do conjunto ativo do canal da Twitch, no chat da Kick também',
      'Modos de animação Calmo, Caos e Quicar',
      'Emotes de 32 a 256 px, de 2 a 30 segundos na tela, até 120 ao mesmo tempo',
      'Só inscritos, emotes de sub por mais tempo, Modo hype e bloqueio de spam de emotes',
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
      'A trophy celebration when the goal is reached, and the count keeps going past it',
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
      'Hedefe ulaşınca kupa kutlaması, sayı hedefi geçince de artmaya devam eder',
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
  countdown: {
    en: [
      'A countdown for your starting soon, back soon and stream ending scenes',
      'Counts down a length you set, or to a time of day like 21:00',
      'At zero: a message that hides itself after a hold time you set, the clock at 00:00, or the overlay hides itself',
      'Your own headline, note, end message and per-scene icon, or the wording of the scene',
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
      'Kendi başlığın, notun, bitiş mesajın ve sahne ikonların ya da sahnenin hazır yazısı',
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
