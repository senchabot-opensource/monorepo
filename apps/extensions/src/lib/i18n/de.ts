import type { en } from './en';

export const de: typeof en = {
  common: {
    freeBadge: '100 % kostenlos · Kein Login nötig',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    home: 'Start',
    watchTutorial: 'Tutorial ansehen',
    widgetUrl: 'Widget-URL',
    toolUrl: 'Tool-URL',
    channelPlaceholder: 'z. B. deinkanal',
    previewNoChannel: 'Gib mindestens einen Kanal ein, um die Vorschau zu sehen.',
    browserSourceHint:
      'Füge diese URL als Browser-Quelle in OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio oder einer anderen Software mit Browser-Quellen ein',
    themeToggle: 'Farbschema wechseln',
    languageToggle: 'Sprache wechseln',
    moreInfo: 'Mehr Infos',
    sectionChannel: 'Kanal',
    sectionAppearance: 'Aussehen',
    platforms: 'Plattformen',
    platformsTip:
      'Wähle die Plattform, auf die das Widget hören soll. Du streamst gleichzeitig auf Twitch und Kick? Dann nimm Beide.',
    platformBoth: 'Beide',
    twitchChannel: 'Twitch-Kanal',
    kickChannel: 'Kick-Kanal',
    channelTip:
      'Gib nur den Kanalnamen ein, nicht den ganzen Link. Bei twitch.tv/senchabot ist das senchabot.',
    previewLoading: 'Vorschau lädt…',
    scrollMore: 'Runterscrollen für mehr',
    scrollTop: 'Nach oben',
    setupGuideTitle: 'So richtest du es ein',
    faqTitle: 'Häufige Fragen',
    moreWidgets: 'Mehr Widgets',
    nextSteps: {
      title: 'Jetzt in deine Streaming-Software damit',
      addSource: 'Füge in OBS Studio oder einer anderen App mit Browser-Quellen eine neue Browser-Quelle hinzu.',
      paste: 'Füge die URL in das Feld URL ein.',
      size: 'Stell die Breite auf {width} und die Höhe auf {height}.',
      test: 'Öffne die URL in einem neuen Tab, um zu prüfen, ob sie läuft',
      dismiss: 'Ausblenden',
    },
    siteName: 'Senchabot Extensions',
    homeLink: 'Senchabot Extensions Startseite',
    skipToContent: 'Zum Inhalt springen',
    newTab: '(öffnet in neuem Tab)',
    nav: {
      label: 'Hauptmenü',
      menu: 'Menü',
      openMenu: 'Menü öffnen',
      closeMenu: 'Menü schließen',
      widgets: 'Widgets',
      guides: 'Anleitungen',
      presets: 'Presets',
      faq: 'FAQ',
      senchabot: 'Senchabot',
      github: 'Quellcode auf GitHub',
      switchWidget: 'Zu einem anderen Widget wechseln',
      breadcrumb: 'Brotkrümelnavigation',
    },
    notFound: {
      title: 'Seite nicht gefunden',
      text: 'Diese Seite gibt es nicht oder sie ist umgezogen. Such dir unten ein Widget aus oder geh zurück zur Startseite.',
      home: 'Zur Startseite',
    },
    footer: {
      about:
        'Kostenlose Overlays und Stream-Tools für Twitch und Kick. Kein Login, nichts zum Herunterladen, und der Code ist offen.',
      license: 'GPL-3.0, Quellcode auf GitHub',
      social: 'Senchabot auf Social Media',
      guides: 'Anleitungen',
      setupGuides: 'Setup-Anleitungen',
      presets: 'Game-Presets',
      faq: 'FAQ',
      changelog: 'Changelog',
      senchabotBot: 'Senchabot-Bot',
      docs: 'Dokumentation',
      discussions: 'GitHub Discussions',
      reportBug: 'Bug melden oder Widget wünschen',
      notAffiliated: 'Nicht mit Twitch oder Kick verbunden.',
    },
  },
  widgets: {
    overlays: 'Overlays',
    tools: 'Tools',
    chatBox: {
      name: 'Chat-Box',
      tagline: 'Twitch- und Kick-Chat zusammen in einem Overlay, mit 7TV-, BTTV- und FFZ-Emotes.',
    },
    emoteWall: {
      name: 'Emote-Wand',
      tagline: 'Chatnachrichten, die nur aus Emotes bestehen, fliegen über deinen Screen.',
    },
    subSprout: {
      name: 'Sub Sprout',
      tagline: 'Eine Pflanze auf deinem Stream, die mit jedem neuen Sub ein Stück wächst.',
    },
    goal: {
      name: 'Sub-Ziel',
      tagline: 'Ein Zielbalken, den jeder Sub und Gift-Sub füllt, mit Pokal, wenn du es schaffst.',
    },
    frames: {
      name: 'Stream-Rahmen',
      tagline:
        'Fertige Rahmen für Kamera, Chat und Stream-Screen, passend zu deinem Preset gezeichnet.',
    },
    countdown: {
      name: 'Stream-Countdown',
      tagline:
        'Ein Countdown für deine Start-, Pausen- und Endszene, nach Dauer oder bis zu einer Uhrzeit.',
    },
    subathon: {
      name: 'Subathon Timer',
      tagline:
        'Ein Countdown, den Subs, Gift-Subs, Bits und Kicks verlängern. Als Lebensbalken, Uhr oder Ring.',
    },
    poll: {
      name: 'Chat-Umfrage',
      tagline: 'Eine Umfrage, bei der dein Chat per Zahl abstimmt, mit Live-Balken und Gewinner.',
    },
    streamAlerts: {
      name: 'Stream-Alerts',
      tagline: 'Ein animierter Alert mit Sound für jeden Sub, Gift-Sub, Bits, Kicks und Raid.',
    },
    raffle: {
      name: 'Verlosung',
      tagline: 'Zuschauer machen mit einem Keyword wie !join mit, und du ziehst den Gewinner.',
    },
    obsBridge: {
      name: 'OBS Bridge',
      tagline: 'OBS-Szenen wechseln und Stream und Aufnahme per Chatbefehl steuern.',
    },
    socials: {
      name: 'Socials',
      tagline: 'Zeig deine Social-Media-Links abwechselnd mit einer schicken Animation.',
    },
  },
  home: {
    heroTitle: 'Kostenlose Stream-Overlays für Twitch und Kick',
    heroLead:
      'Stell dein Widget mit Live-Vorschau ein und füg eine einzige URL in OBS ein. Kein Account, kein Wasserzeichen, und der Code ist Open Source.',
    browseWidgets: 'Widgets ansehen',
    viewOnGithub: 'Auf GitHub ansehen',
    trustLabel: 'Highlights',
    trustFree: 'Kostenlos',
    trustNoLogin: 'Kein Login',
    trustOpenSource: 'Open Source',
    trustPlatforms: 'Twitch + Kick',
    sceneLive: 'Live',
    sceneCaption: 'Live-Demo mit Beispiel-Chat',
    demoTitle: '{name}-Demo',
    worksWithTitle: 'Wo es läuft',
    worksWithApps: 'Streaming-Apps',
    worksWithAppsText: 'OBS Studio und andere Apps mit Browser-Quellen',
    galleryTitle: 'Such dir ein Widget aus',
    galleryLead: 'Jedes hat seine eigene Setup-Seite mit Live-Vorschau. Nichts zum Herunterladen.',
    overlaysLead: 'Browser-Quellen, die von selbst laufen, sobald sie in deiner Szene sind.',
    toolsLead: 'Tools, die du während des Streams selbst bedienst, über eine Seite oder den Chat.',
    setUp: 'Einrichten',
    toolFeatures: 'Features',
    raffleFeatureKeyword: 'Teilnahme per Keyword wie !join',
    raffleFeatureSubs: 'Nur Subs, mit Mindestmonaten',
    raffleFeatureDuration: 'Mindestzeit bis zur Ziehung',
    obsFeatureScenes: 'Szenen aus dem Chat wechseln',
    obsFeatureCommands: 'Eigene Befehlsnamen',
    obsFeatureLocal: 'Lokale obs-websocket-Verbindung',
    subathonFeatureChat: 'Steuerung im Chat mit !subathon',
    subathonFeaturePlatforms: 'Eigene Zeitwerte für Twitch und Kick',
    subathonFeatureSaved: 'Restzeit übersteht OBS-Neustarts',
    pollFeatureVote: 'Zuschauer stimmen per Zahl ab',
    pollFeatureBoth: 'Twitch- und Kick-Stimmen in einer Umfrage',
    pollFeatureLate: 'Stimmen in letzter Sekunde zählen trotz Stream-Delay',
    pollSpotlight: {
      eyebrow: 'Neu: Chat-Umfrage',
      title: 'Lass deinen Chat entscheiden',
      lead: 'Starte eine Umfrage im Chat mit !poll, und deine Zuschauer auf Twitch und Kick stimmen per Zahl ab. Die Balken füllen sich live im Stream, und am Ende steht der Gewinner fest.',
      pointVote: 'Zuschauer schreiben 2, !vote 2 oder die Option selbst. Jeder zählt einmal.',
      pointBoth: 'Stimmen von Twitch und Kick landen in derselben Umfrage.',
      pointLate:
        'Stimmen aus den letzten Sekunden zählen noch, auch wenn deine Zuschauer etwas hinterher sind.',
      pointMods: 'Du und deine Mods steuern alles im Chat. Kein Bot, kein Login.',
      setup: 'Chat-Umfrage einrichten',
      guide: 'Zur Anleitung',
      chat: 'Chat',
      caption: 'Live-Demo mit simulierten Stimmen',
    },
    visualScenes: 'Szenen',
    howTitle: 'So funktioniert es',
    howLead: 'Drei Schritte, und für keinen brauchst du einen Account.',
    howStep1:
      'Such dir ein Widget aus und stell es ein. Die Live-Vorschau zeigt jede Änderung sofort.',
    howStep2: 'Gib deinen Kanalnamen ein und kopier die Widget-URL.',
    howStep3: 'Füge in OBS Studio eine Browser-Quelle hinzu, setz die URL ein und stell die empfohlene Größe ein.',
    sizesTitle: 'Empfohlene Größen für Browser-Quellen',
    sizesNote: 'Breite × Höhe, in Pixeln.',
    sizesWidget: 'Widget',
    sizesValue: 'Größe',
    trustTitle: 'Kein Account, kein Haken',
    noLoginTitle: 'Kein Login',
    noLoginText:
      'Die Widgets lesen den öffentlichen Chat deines Kanals so, wie ihn ein ausgeloggter Zuschauer sieht. Du verbindest nie deinen Twitch- oder Kick-Account.',
    noWatermarkTitle: 'Kein Wasserzeichen',
    noWatermarkText:
      'Auf deinen Overlays landet kein Stempel. Was du in der Vorschau siehst, kommt genau so in den Stream.',
    openSourceTitle: 'Open Source',
    openSourceText:
      'Der ganze Code liegt auf GitHub unter der GPL-3.0-Lizenz. Lies ihn, forke ihn oder schick einen Fix.',
    urlSettingsTitle: 'Deine Einstellungen stecken in der URL',
    urlSettingsText:
      'Die Widget-Einstellungen stehen direkt in der URL, du brauchst also keinen Account, um sie zu behalten. Speicher dir die URL und dein Widget ist immer da.',
    senchabotTitle: 'Brauchst du auch einen Chatbot? Probier Senchabot',
    senchabotText:
      'Das Team hinter diesen Widgets macht auch Senchabot: eigene Chatbefehle, Timer und Shoutouts auf Twitch, dazu eine Live-Benachrichtigung auf deinem Discord-Server.',
    senchabotCta: 'Zu senchabot.com',
    communityTitle: 'Mach mit',
    communityLead: 'Das Projekt ist Open Source, und es gibt ein paar einfache Wege zu helfen.',
    starTitle: 'Stern auf GitHub',
    starText: 'Sterne helfen, dass mehr Streamer das Projekt finden.',
    starCount: '{count} Sterne',
    requestTitle: 'Widget wünschen',
    requestText: 'Dir fehlt was für deinen Stream? Mach ein Issue auf und sag uns, was du brauchst.',
    discordTitle: 'Komm auf den Discord',
    discordText: 'Stell Fragen und zeig anderen Streamern dein Setup.',
    faqMore: 'Keine Antwort gefunden?',
    faq1Q: 'Ist das wirklich kostenlos?',
    faq1A:
      'Ja. Jedes Widget und jedes Tool ist kostenlos, ohne Bezahl-Abo und ohne Wasserzeichen auf deinen Overlays. Das Projekt ist Open Source und kommt vom Senchabot-Team.',
    faq2Q: 'Was heißt „kein Login“ genau?',
    faq2A:
      'Du meldest dich nie an und verbindest nie deinen Twitch- oder Kick-Account. Du gibst deinen Kanalnamen ein, und das Widget liest den öffentlichen Chat dieses Kanals anonym, wie ein Zuschauer, der nicht eingeloggt ist. Es sieht also genau das, was jeder im Chat sieht, und nichts darüber hinaus.',
    faq3Q: 'Mit welchen Streaming-Apps funktioniert es?',
    faq3A:
      'Mit OBS Studio und anderen Apps, die Browser-Quellen unterstützen. Füge die Widget-URL als Browser-Quelle hinzu und nimm die Größe, die auf der Setup-Seite steht.',
    faq4Q: 'Kann ich Twitch und Kick zusammen nutzen?',
    faq4A:
      'Ja. Chat-Box, Emote-Wand, Sub Sprout, Subathon Timer, Stream-Alerts, Sub-Ziel, Chat-Umfrage und Stream-Countdown nehmen einen Twitch- und einen Kick-Kanal in derselben URL. OBS Bridge kann auch beiden Chats gleichzeitig zuhören. Die Verlosung läuft immer auf einer Plattform.',
    faq5Q: 'Wie ändere ich ein Widget später?',
    faq5A:
      'Öffne seine Setup-Seite, stell alles so ein, wie du willst, und ersetz die URL in deiner Browser-Quelle. Chat-Box, Emote-Wand, Sub Sprout, Subathon Timer, Stream-Alerts, Sub-Ziel, Chat-Umfrage, Stream-Rahmen, Socials und Stream-Countdown können auch eine bestehende URL öffnen: Füg sie auf der Setup-Seite ein, deine Einstellungen sind wieder da, und du änderst nur, was du brauchst.',
    faq6Q: 'Funktioniert meine Widget-URL nach Updates weiter?',
    faq6A:
      'Ja. Updates lassen bestehende URL-Einstellungen und ihre Werte funktionieren, ein Widget, das schon in deiner Szene ist, braucht also keine neue URL.',
  },
  chatWidget: {
    breadcrumb: 'Chat-Box einrichten',
    title: 'Chat-Box einrichten',
    intro:
      'Ein Multi-Chat-Widget, das Twitch- und Kick-Chat in einem Overlay zusammenführt. 7TV-Emotes laufen auf beiden Plattformen, BTTV und FFZ auf Twitch, und Badges werden auch angezeigt. Layout, Schrift und Animation suchst du dir aus.',
    platformIndicator: 'Plattform-Anzeige',
    platformName: 'Plattformname',
    platformIcon: 'Plattform-Icon',
    platformHidden: 'Plattform ausblenden',
    sectionMessages: 'Nachrichten',
    platformsTip:
      'Wähle, aus welchen Plattformen der Chat kommen soll. Nimm beide, um Twitch- und Kick-Nachrichten in einem Feed zu mischen.',
    platformIndicatorTip:
      'Wenn beide Plattformen an sind, zeigt das, woher jede Nachricht kommt: der Plattformname, ihr Icon oder gar nichts.',
    orientationTip:
      'Vertikal stapelt die Nachrichten übereinander wie eine klassische Chat-Box. Horizontal reiht sie nebeneinander auf, ideal als Leiste unten am Screen.',
    darkBackgroundTip:
      'Legt einen halbtransparenten schwarzen Hintergrund hinter das Widget. So ist Text auf hellen Szenen besser lesbar.',
    emotesTip:
      'Emotes der Anbieter, die du anhakst, erscheinen als Bild, der Rest als normaler Text. 7TV läuft auf Twitch und Kick, BTTV und FFZ nur auf Twitch.',
    messageDurationTip:
      'Nachrichten blenden nach dieser Zeit aus. Mit „Für immer“ bleiben sie stehen, und neue schieben die älteren nach oben.',
    hideBotsTip:
      'Blendet Nachrichten von bekannten Bots wie Nightbot, StreamElements, Fossabot, BotRix und KickBot aus, dazu Accounts mit dem „Chat Bot“-Badge auf Twitch oder dem „Bot“-Badge auf Kick.',
    hideCommandsTip: 'Blendet Nachrichten aus, die mit „!“ anfangen, wie !discord oder !uptime.',
    badgesTip: 'Zeigt Broadcaster-, Mod-, VIP- und Sub-Badges neben den Namen.',
    animationTip:
      'Legt fest, wie neue Nachrichten reinkommen. Wird der Chat schneller, werden die Animationen automatisch kürzer.',
    usernameFont: 'Schrift für Namen',
    messageFont: 'Schrift für Nachrichten',
    fontSystem: 'Systemschrift',
    textShadow: 'Textschatten',
    textShadowTip:
      'Ein dunkler Rand hinter Namen und Nachrichten. Stark umrandet jeden Buchstaben, damit der Chat auf hellen Games lesbar bleibt. Keiner entfernt ihn, auch den eines Presets.',
    shadowNone: 'Keiner',
    shadowNormal: 'Normal',
    shadowStrong: 'Stark',
    messageLayout: 'Nachrichten-Layout',
    layoutInline: 'Inline (Name: Nachricht)',
    layoutStacked: 'Gestapelt (Name oben)',
    layoutCard: 'Karte / Blase',
    layoutCompact: 'Kompakt (wie Twitch)',
    newMessageAnimation: 'Animation für neue Nachrichten',
    animSlide: 'Von rechts gleiten + einblenden',
    animSmoothSlide: 'Weich von rechts gleiten',
    animPop: 'Aufploppen / Skalieren',
    animBounce: 'Reinhüpfen',
    animStagger: 'Versetzt (erst Name, dann Nachricht)',
    animFade: 'Einblenden',
    animTyping: 'Schreibmaschine',
    animNone: 'Keine Animation',
    orientation: 'Ausrichtung',
    vertical: 'Vertikal',
    horizontal: 'Horizontal',
    fontSize: 'Schriftgröße (px)',
    darkBackground: 'Dunkler Hintergrund',
    emotes: 'Emotes',
    emotesNone: 'Aus',
    messageDuration: 'Anzeigedauer',
    durationSeconds: '{count} Sek.',
    durationMinutes: '{count} Min.',
    durationKeep: 'Für immer',
    hideBots: 'Bots ausblenden',
    hideCommands: 'Befehle ausblenden',
    showBadges: 'Badges anzeigen',
    showMessageTime: 'Uhrzeit anzeigen',
    backgroundOpacity: 'Hintergrund-Deckkraft',
    messageBackgroundBox: 'Box pro Nachricht',
    messageBackgroundHint: 'Jede Nachricht bekommt ihre eigene Box mit Rahmen.',
    platformAccent: 'Plattform-Farbstreifen',
    platformAccentHint: 'Ein lila Twitch- oder grüner Kick-Streifen links zeigt, woher jede Nachricht kommt.',
    boldUsernames: 'Namen fett',
    boldMessages: 'Nachrichten fett',
    highlights: 'Hervorhebungen',
    highlightsTip:
      'Wähle, welche Nachrichten im Stream einen dünnen farbigen Balken bekommen. Antworten zeigen, wem geantwortet wird, und die mit Twitch markierten gibt es nur auf Twitch.',
    highlightMention: 'Erwähnungen',
    highlightReply: 'Antwort-Kontext',
    highlightFirstMessage: 'Neue Chatter',
    highlightAnnouncement: 'Ankündigungen',
    highlightHighlighted: 'Meine Nachricht hervorheben',
    highlightsAll: 'Alle',
    highlightsNone: 'Aus',
    announcement: 'Ankündigung',
    firstMessage: 'Erste Nachricht',
    previewTitle: 'Widget-Vorschau (Chat-Box)',
    previewIframeTitle: 'Vorschau des Chat-Widgets',
    previewSpeed: 'Chat-Tempo der Vorschau',
    previewSpeedValue: '{rate} Nachr./s',
    previewSpeedHint: 'Ändert nur die Vorschau. Deine Widget-URL bleibt gleich.',
    previewHint: 'Live-Chat-Vorschau mit animierten Nachrichten.',
    guideTitle: 'Chat-Box in der Streaming-Software einrichten (OBS, Streamlabs, XSplit usw.)',
    guideStep1:
      'Füge in deiner Streaming-Software eine Browser-Quelle hinzu (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio usw.).',
    guideStep2: 'Füge die kopierte Multi-Chat-Widget-URL ein.',
    guideStep3:
      'Stell Breite und Höhe auf die Maße, die deine Chat-Box haben soll (z. B. 400×600 für vertikal).',
    browserSourceHintSize: ' (empfohlene Größe: 400×600 für die Chat-Box).',
    widgetUrlTip:
      'Schon ein Widget gebaut? Füg seine URL hier ein, um deine Einstellungen zu laden und nur das zu ändern, was du brauchst.',
    widgetUrlPlaceholder: 'Bestehende Widget-URL zum Bearbeiten einfügen',
    widgetUrlInvalid: 'Das ist keine Chat-Box-URL.',
    openReader: 'Chat-Reader öffnen',
    openReaderHint:
      'Lies deinen eigenen Chat in einem Browser-Tab oder einem OBS-Dock. Er verbindet sich von selbst neu, markiert jeden Abbruch und behält deinen Verlauf nach einem Neuladen.',
    faq1Q: 'Muss ich mich für die Chat-Box bei Twitch oder Kick anmelden?',
    faq1A:
      'Nein, kein Login nötig. Die Chat-Box liest den öffentlichen Chat beider Plattformen anonym mit.',
    faq2Q: 'Funktioniert dieses Multi-Chat-Widget mit 7TV-Emotes?',
    faq2A:
      'Ja. 7TV-Kanal- und globale Emotes erscheinen in Twitch- und Kick-Nachrichten, BTTV- und FFZ-Emotes nur in Twitch-Nachrichten. Alle drei sind standardmäßig an, und du kannst jeden im Menü Emotes ausschalten.',
  },
  chatReader: {
    title: 'Chat-Reader',
    listLabel: 'Chatnachrichten',
    noChannel: 'Dieser Link hat keinen Kanal. Öffne den Chat-Reader über die Setup-Seite der Chat-Box.',
    empty: 'Warte auf Nachrichten in {channels}…',
    statusConnecting: 'Verbinde',
    statusConnected: 'Verbunden',
    statusReconnecting: 'Verbinde neu',
    notFound: 'Kanal nicht gefunden',
    networkOffline: 'Du bist offline. Der Chat verbindet sich von selbst neu, sobald das Internet wieder da ist.',
    retryIn: 'Verbindung zum {platform}-Chat verloren. Neuer Versuch in {seconds} s.',
    retrying: 'Verbindung zum {platform}-Chat verloren. Neuer Versuch läuft…',
    retryNow: 'Jetzt neu versuchen',
    fontSmaller: 'Kleinere Schrift',
    fontLarger: 'Größere Schrift',
    timestamps: 'Uhrzeit anzeigen',
    clear: 'Verlauf löschen',
    clearConfirm: 'Nochmal klicken zum Löschen',
    deleted: '(gelöscht)',
    backToLive: 'Zurück zum Live-Chat',
    newMessage: '{count} neue Nachricht',
    newMessages: '{count} neue Nachrichten',
    eventConnected: 'Mit {platform}-Chat verbunden: {channel}',
    eventDisconnected: 'Verbindung zum {platform}-Chat verloren',
    eventReconnected: 'Wieder im {platform}-Chat nach {duration}',
    eventNetworkLost: 'Internetverbindung weg',
    eventNetworkBack: 'Internetverbindung ist wieder da',
    eventChatCleared: 'Ein Mod hat den {platform}-Chat geleert',
    eventResumed: 'Gespeichert von deinem letzten Besuch, bis {time}',
    durationSeconds: '{seconds} s',
    durationMinutes: '{minutes} min {seconds} s',
    durationHours: '{hours} h {minutes} min',
  },
  obsBridge: {
    breadcrumb: 'OBS Bridge einrichten',
    title: 'OBS Bridge einrichten',
    intro:
      'Lass Leute, denen du vertraust, aus dem Twitch- oder Kick-Chat OBS-Szenen wechseln und Stream und Aufnahme starten oder stoppen. Die Bridge läuft in einem Browser-Tab oder einem OBS-Dock und spricht direkt mit OBS.',
    sectionChannels: 'Kanäle',
    sectionUsers: 'Berechtigte Nutzer',
    usersLabel: 'Chat-Namen',
    usersTip:
      'Nur Leute auf dieser Liste können Befehle nutzen. Ist die Liste leer, kann es niemand, nicht mal du. Auf Twitch wird der Login-Name verglichen, also der Name in der URL des Kanals.',
    usersEmpty: 'Noch niemand, also kann keiner Befehle nutzen.',
    userPlatform: 'Plattform',
    addUser: 'Hinzufügen',
    userPlaceholder: 'Nutzername',
    removeUser: '{name} entfernen',
    assignUser: '{name} als {platform}-Nutzer festlegen',
    pickPlatformWarning:
      'Twitch und Kick sind beide verbunden, also wähle für jeden gelben Namen eine Plattform. Bis dahin können sie keine Befehle nutzen.',
    sectionCommands: 'Befehle',
    commandsHint:
      'Die ganze Nachricht muss dem Befehl entsprechen, Groß- und Kleinschreibung ist egal. Lass ein Feld leer, um den Standard zu behalten.',
    label: {
      cmdScene: 'Szene wechseln',
      cmdBrb: 'BRB-Szene',
      cmdBack: 'Zurück zu Main',
      cmdStartStream: 'Stream starten',
      cmdStopStream: 'Stream beenden',
      cmdStartRecord: 'Aufnahme starten',
      cmdStopRecord: 'Aufnahme stoppen',
    },
    action: {
      cmdScene: 'Wechselt zur genannten Szene, z. B. {example}',
      cmdBrb: 'Wechselt zu deiner BRB-Szene',
      cmdBack: 'Wechselt zurück zu deiner Main-Szene',
      cmdStartStream: 'Startet den Stream',
      cmdStopStream: 'Beendet den Stream',
      cmdStartRecord: 'Startet die Aufnahme',
      cmdStopRecord: 'Stoppt die Aufnahme',
    },
    sceneArg: '<Name>',
    sceneTip:
      'Schreib den Befehl, ein Leerzeichen und einen Szenennamen, z. B. !scene Gaming. Eine Szene mit genau diesem Namen gewinnt, sonst die erste, deren Name ihn enthält.',
    brbTip:
      'Wechselt zu der BRB-Szene, die du auf der Tool-Seite wählst. Standardmäßig ohne !, also reicht es, wenn jemand von der Liste nur brb schreibt.',
    backTip: 'Wechselt zurück zu der Main-Szene, die du auf der Tool-Seite wählst. Wie brb standardmäßig ohne !.',
    sectionConnection: 'OBS-Verbindung',
    wsUrl: 'WebSocket-URL',
    wsUrlTip:
      'Brauchst du nur, wenn OBS auf einem anderen PC läuft oder du den Port geändert hast. Leer lassen für ws://127.0.0.1:4455.',
    wsUrlPlaceholder: 'ws://127.0.0.1:4455 (Standard)',
    wsPassword: 'WebSocket-Passwort',
    wsPasswordTip:
      'Findest du in OBS unter Werkzeuge → WebSocket-Servereinstellungen → Verbindungsinformationen anzeigen. Es wird in der Tool-URL gespeichert, behandle den Link also wie ein Passwort.',
    wsPasswordPlaceholder: 'Leer lassen, falls keins',
    previewTitle: 'Tool-Vorschau',
    previewIframeTitle: 'Vorschau von OBS Bridge',
    summaryNotListening: 'Kein {platform}-Kanal eingetragen, also können {names} noch keine Befehle nutzen.',
    summaryNoChannel: 'Noch kein Kanal. Trag zuerst einen Twitch- oder Kick-Kanal ein.',
    openTool: 'Tool öffnen',
    openToolHint: 'Öffnet die Live-Bridge in einem neuen Tab. Sie verbindet sich sofort mit OBS und deinem Chat.',
    toolUrlTip:
      'Sie enthält dein OBS-Passwort, behandle sie also genauso: nicht teilen und nicht im Stream zeigen.',
    toolUrlHint:
      'Öffne sie in einem Browser-Tab oder einem benutzerdefinierten Browser-Dock in OBS und lass sie offen, solange du streamst.',
    nextOpen: 'Öffne sie in einem Browser-Tab oder füge sie in OBS in ein benutzerdefiniertes Browser-Dock ein.',
    nextKeepOpen: 'Wähle dort deine Main- und BRB-Szene und lass die Seite offen, solange du streamst.',
    guideStep1:
      'Öffne in OBS Werkzeuge → WebSocket-Servereinstellungen, aktiviere den WebSocket-Server und kopier das Passwort unter Verbindungsinformationen anzeigen.',
    guideStep2:
      'Trag deinen Kanal, die Leute, die Befehle nutzen dürfen, und das Passwort ein, dann kopier die Tool-URL.',
    guideStep3:
      'Öffne die URL in einem Browser-Tab oder einem benutzerdefinierten Browser-Dock in OBS und wähle deine Main- und BRB-Szene.',
    guideStep4:
      'Du nutzt ein Dock? Klick nach der Szenenwahl auf Aktuelle URL kopieren und füg sie ins Dock ein, denn ein Dock öffnet immer die URL, mit der es erstellt wurde.',
    faq1Q: 'Wie funktioniert der Chatbefehl !scene?',
    faq1A:
      'Jemand von deiner Liste schreibt den Befehl, ein Leerzeichen und einen Szenennamen, z. B. !scene Gaming. OBS Bridge sucht zuerst eine Szene mit genau diesem Namen, Groß- und Kleinschreibung egal, dann die erste Szene, deren Name ihn enthält, und wechselt dorthin.',
    faq2Q: 'Ist mein OBS-WebSocket-Passwort sicher?',
    faq2A:
      'Die Verbindung zu OBS geht direkt von deinem Browser zu OBS. Aber das Passwort steht in der Tool-URL, und wer diese URL öffnet, lädt die Seite von extensions.senchabot.com mit dem Passwort darin. Behandle den Link also wie ein Passwort: nicht teilen und nicht im Stream zeigen.',
    faq3Q: 'Warum ist meine Szenenwahl im OBS-Dock weg?',
    faq3A:
      'Szenenwahl und Nutzeränderungen werden in der URL der Tool-Seite gespeichert. Ein Browser-Tab behält sie, wenn du ein Lesezeichen setzt, aber ein OBS-Dock öffnet immer die URL, mit der es erstellt wurde. Klick auf der Tool-Seite auf Aktuelle URL kopieren und füg die neue URL ins Dock ein.',
    tool: {
      title: 'OBS Bridge',
      connectionsTitle: 'Verbindungen',
      status: {
        connecting: 'Verbinde',
        connected: 'Verbunden',
        failed: 'Verbindung fehlgeschlagen',
        disconnected: 'Getrennt',
      },
      obsConnecting: 'Verbinde mit {url}…',
      obsConnected: '{url} · verbunden seit {time}',
      obsUnreachable:
        'Keine Antwort von {url}. Ist OBS offen und der Server unter Werkzeuge → WebSocket-Servereinstellungen aktiviert?',
      obsWrongPassword:
        'OBS hat das Passwort nicht angenommen. Das Passwort in der URL muss zu deinem OBS-WebSocket-Passwort passen.',
      obsNeedsPassword:
        'OBS will ein Passwort, aber diese URL hat keins. Gib dein WebSocket-Passwort auf der Setup-Seite ein und nimm die neue URL.',
      obsRefused: 'OBS hat die Verbindung abgelehnt: {reason}',
      obsClosed:
        'Verbindung zu OBS verloren. Vielleicht wurde OBS geschlossen oder der WebSocket-Server gestoppt.',
      retryIn: 'Versuch {attempt} in {seconds} s',
      retrying: 'Neuer Versuch…',
      retryNow: 'Jetzt versuchen',
      chat: {
        connecting: 'Verbinde',
        connected: 'Hört zu',
        reconnecting: 'Getrennt',
      },
      chatRetryIn: 'Neu verbinden in {seconds} s',
      chatNotFound: 'Nicht gefunden',
      kickNotFound: 'Kein Kick-Kanal namens „{channel}“ gefunden. Prüf den Kanalnamen.',
      activityTitle: 'Letzte Befehle',
      activityEmpty:
        'Noch keine Befehle. Sie tauchen hier auf, sobald ein berechtigter Nutzer einen in den Chat schreibt.',
      activityScene: 'Zu {scene} gewechselt',
      activityStartStream: 'Stream gestartet',
      activityStopStream: 'Stream beendet',
      activityStartRecord: 'Aufnahme gestartet',
      activityStopRecord: 'Aufnahme gestoppt',
      activityNoScene: 'Keine Szene passt zu „{query}“',
      activityOffline: 'Nicht ausgeführt, weil OBS nicht verbunden war',
      activityFailed: 'OBS hat einen Fehler gemeldet: {message}',
      scenesTitle: 'Szenen',
      scenes: 'Szenen ({count})',
      fetchingScenes: 'Szenenliste lädt…',
      scenesOffline: 'Die Szenenliste erscheint, sobald OBS verbunden ist.',
      mainScene: 'Main-Szene',
      brbScene: 'BRB-Szene',
      notSelected: 'Nicht gewählt',
      main: 'Main',
      brb: 'BRB',
      setMain: '{scene} als Main-Szene nutzen',
      setBrb: '{scene} als BRB-Szene nutzen',
      assignMainBrbWarning:
        'Wähle unten eine Main- und eine BRB-Szene, sonst wissen {brb} und {back} nicht, wohin.',
      assignMainWarning: 'Wähle unten eine Main-Szene, sonst weiß {back} nicht, wohin.',
      assignBrbWarning: 'Wähle unten eine BRB-Szene, sonst weiß {brb} nicht, wohin.',
      sceneHint:
        'Klick neben einer Szene auf Main oder BRB, um sie festzulegen. Jede andere Szene geht mit {command}.',
      usersCount: 'Berechtigte Nutzer ({count})',
      copyUrl: 'Aktuelle URL kopieren',
      copyUrlHint:
        'Szenenwahl und Nutzeränderungen werden in der URL dieser Seite gespeichert. Ein OBS-Dock öffnet immer die URL, mit der es erstellt wurde, also füg die kopierte URL in den Dock-Einstellungen ein.',
      copyUrlManual: 'Kopieren hat nicht geklappt. Markier die URL unten und kopier sie selbst.',
      commands: 'Chatbefehle',
      footer: 'Lass diese Seite offen, solange du streamst. Wird sie geschlossen, stoppt die Bridge.',
    },
  },
  subSprout: {
    breadcrumb: 'Sub Sprout einrichten',
    title: 'Sub Sprout einrichten',
    intro:
      'Ein anpassbares Sub-Ziel als Pflanzen-Overlay, das mit jedem neuen Abo auf Twitch oder Kick eine Stufe wächst.',
    sectionPlant: 'Pflanze',
    plantVariety: 'Pflanzensorte',
    plantVarietyTip:
      'Jeder Sub lässt die Pflanze eine Stufe wachsen. Je mehr Stufen sie hat, desto mehr Subs braucht sie, bis sie ausgewachsen ist.',
    stagesSuffix: '{stages} Stufen',
    selectionMode: 'Pflanzenwechsel',
    selectionModeTip:
      'Nach der letzten Stufe fängt die Pflanze von vorn an: dieselbe Pflanze, die nächste in der Liste oder zufällig eine andere. Der Reihe nach und Zufällig wählen nie die Kletterranke.',
    fixed: 'Gleiche Pflanze',
    cycle: 'Der Reihe nach',
    random: 'Zufällig',
    wateringEffect: 'Gieß-Effekt',
    wateringEffectTip:
      'Spielt jedes Mal, wenn die Pflanze wächst, eine kurze Regen- oder Glitzer-Animation ab. Die Kletterranke zeigt ihn nicht.',
    showSubCountEffect: 'Sub-Anzahl zeigen',
    subCountTip: 'Zeigt, wie viele Subs auf einmal reinkamen, z. B. x5 bei 5 Gift-Subs.',
    showPotLabel: 'Stufe auf dem Topf',
    potLabelTip: 'Schreibt die Stufe auf den Topf, z. B. 3/10. Die Kletterranke zeigt sie nicht.',
    previewTitle: 'Vorschau der Sub-Ziel-Pflanze',
    previewIframeTitle: 'Vorschau von Sub Sprout',
    previewSpeed: 'Wachstumstempo der Vorschau',
    previewSpeedValue: '{rate}×',
    previewHint:
      'Die Vorschau wächst mit simulierten Subs. Im Stream wächst deine Pflanze mit echten Subs, Resubs und Gift-Subs in deinem Kanal.',
    widgetUrlTip:
      'Schon ein Widget gebaut? Füg seine URL hier ein, um deine Einstellungen zu laden und nur das zu ändern, was du brauchst.',
    widgetUrlPlaceholder: 'Bestehende Widget-URL zum Bearbeiten einfügen',
    widgetUrlInvalid: 'Das ist keine Sub-Sprout-URL.',
    browserSourceHintSize: ' (empfohlene Größe: 800×600).',
    guideTitle: 'Einrichtung in der Streaming-Software (OBS, Streamlabs, XSplit usw.)',
    guideStep1:
      'Füge in deiner Streaming-Software eine Browser-Quelle hinzu (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio usw.).',
    guideStep2: 'Füge die kopierte URL der Sub-Ziel-Pflanze ein.',
    guideStep3: 'Stell die Breite auf 800 und die Höhe auf 600.',
    guideStep4:
      'Streamer und Mods können !grow in den Chat schreiben, um die Pflanze von Hand wachsen zu lassen, oder !grow reset, um sie neu zu starten.',
    faq1Q: 'Muss ich mich für die Sub-Ziel-Pflanze anmelden?',
    faq1A:
      'Keine Registrierung und kein OAuth-Login nötig. Sub Sprout liest anonym die Events im öffentlichen Chat mit.',
    faq2Q: 'Was passiert, wenn die Sub-Ziel-Pflanze ausgewachsen ist?',
    faq2A:
      'Ist die Pflanze ausgewachsen, startet der nächste Sub sie neu, je nach deiner Einstellung beim Pflanzenwechsel: dieselbe Pflanze, die nächste Sorte oder eine zufällige.',
    faq3Q: 'Fängt die Pflanze von vorn an, wenn die Browser-Quelle neu lädt?',
    faq3A:
      'Nein. Die Pflanze wird in OBS gespeichert, sie behält also ihre Stufe nach einem Neuladen, einem Szenenwechsel und bis zum nächsten Stream. Zum Neustarten schreibt ein Mod !grow reset in den Chat.',
  },
  subathon: {
    breadcrumb: 'Subathon Timer einrichten',
    title: 'Subathon Timer einrichten',
    intro:
      'Ein Subathon Timer für Twitch und Kick. Er zählt runter, und jeder Sub, Gift-Sub, Bits-Cheer oder Kicks-Gift gibt Zeit dazu. Zeig ihn als Lebensbalken wie im Game, der gegen null läuft, als große Uhr oder als Ring, und leg selbst fest, wie viel Zeit jedes Event bringt.',
    style: 'Stil',
    styleTip:
      'Lebensbalken leert sich von 100 % gegen null wie bei einer Spielfigur. Schmaler Balken packt Titel und Zeit in einen dünneren Balken. Uhr zeigt große Zahlen. Ring zeigt einen Kreis, der sich leert.',
    styleBar: 'Lebensbalken',
    styleThin: 'Schmaler Balken',
    styleClock: 'Uhr',
    styleRing: 'Ring',
    color: 'Farbe',
    colorTip:
      'Leben wechselt von Grün über Orange zu Rot, wenn die Zeit knapp wird. Die anderen bleiben einfarbig.',
    colors: {
      hp: 'Leben (grün bis rot)',
      green: 'Grün',
      purple: 'Lila',
      red: 'Rot',
      gold: 'Gold',
      cyan: 'Cyan',
      pink: 'Pink',
    },
    titleLabel: 'Titel',
    titleTip: 'Steht neben dem Timer. Leer lassen, wenn du keinen Titel willst.',
    titlePlaceholder: 'Kein Titel',
    showPercent: 'Prozent zeigen',
    showPercentTip:
      'Zeigt, wie voll der Timer ist. 100 % ist die meiste Zeit, die er bisher hatte, er geht also nie darüber.',
    showPops: 'Zeitbonus zeigen',
    showPopsTip: 'Lässt jedes Mal, wenn Zeit dazukommt, +1:00 mit dem Namen des Zuschauers aufsteigen.',
    sectionTimer: 'Timer',
    startTime: 'Startzeit',
    startTimeTip:
      'Hier startet der Timer. Gilt nur für einen neuen Subathon: Um mit einem neuen Wert von vorn anzufangen, schreib !subathon reset in den Chat.',
    maxTime: 'Zeitlimit',
    maxTimeTip: 'Mehr Zeit als das hat der Timer nie. Zeit, die darüber gehen würde, wird nicht addiert.',
    maxTimeOff: 'Kein Limit',
    startMode: 'Start',
    startModeTip:
      'Mit Befehl wartet der Timer pausiert, bis du oder ein Mod den Befehl in den Chat schreibt. Sofort startet ihn, sobald das Overlay in OBS lädt.',
    startCommand: 'Mit {command}',
    startAuto: 'Sofort',
    sectionValues: 'Zeit pro Event',
    valuesHint: 'Stell einen Wert auf 0, um ihn auszuschalten.',
    dynamicRates: 'Werte nach Restzeit anpassen',
    dynamicRatesTip: 'Nutzt einen zweiten Satz Werte, wenn noch genug Zeit auf der Uhr ist.',
    shiftAt: 'Schwelle',
    shiftAtTip: 'Solange die Restzeit bei oder über diesem Wert liegt, gilt der zweite Satz Werte.',
    tier2Rates: 'Über der Schwelle',
    perSub: 'Pro Sub',
    perSubTip: 'Jeder neue Sub und Resub. Auf Twitch ist das ein Tier-1- oder Prime-Sub.',
    perSubKickTip: 'Jeder neue Sub und Resub.',
    perGift: 'Pro Gift-Sub',
    perGiftTip: 'Zählt für jeden Sub in einem Gift, 5 Gift-Subs geben das also fünfmal.',
    perBits: 'Pro 500 Bits',
    perBitsTip: 'Etwa der Preis eines Subs. Andere Mengen zählen anteilig, 100 Bits geben also ein Fünftel.',
    perKicks: 'Pro 500 Kicks',
    perKicksTip: 'Andere Mengen zählen anteilig, 100 Kicks geben also ein Fünftel.',
    showRates: 'Auf dem Timer zeigen',
    showRatesTip:
      'Zeigt, was ein Sub, ein Gift-Sub und 500 Bits oder Kicks bringen, damit die Zuschauer wissen, was ihr Sub wert ist. Werte auf 0 fallen weg. Haben Twitch und Kick unterschiedliche Werte, wechseln sie sich ab.',
    ratesLanguage: 'Timer-Sprache',
    ratesLanguageTip:
      'Die Sprache der angezeigten Wörter, wie „Gift-Sub“ und „Min.“. Die OBS-URL behält sie, egal in welcher Sprache OBS läuft.',
    rateSub: 'Sub',
    rateGift: 'Gift-Sub',
    rateBits: '{amount} Bits',
    rateKicks: '{amount} Kicks',
    rateBitsKicks: '{amount} Bits/Kicks',
    tiers: 'Tier 2 und 3 zählen mehr',
    tiersTip:
      'Auf Twitch bringt ein Tier-2-Sub die Zeit von 2 Subs und ein Tier-3-Sub die von 5, passend zum Preis.',
    unitHours: 'Std.',
    unitMinutes: 'Min.',
    sectionCommands: 'Chatbefehle',
    commandsIntro: 'Du und deine Mods steuern den Timer aus dem Twitch- oder Kick-Chat.',
    cmdStart: 'Startet den Timer oder setzt ihn fort',
    cmdPause: 'Pausiert ihn',
    cmdAdd: 'Gibt Zeit dazu',
    cmdRemove: 'Zieht Zeit ab',
    cmdSet: 'Setzt die Restzeit',
    cmdReset: 'Fängt bei der Startzeit neu an',
    commandsDurations: 'Zeiten schreibst du wie 10m, 1h30m, 45s oder 1:30:00. Eine reine Zahl sind Minuten.',
    previewTitle: 'Vorschau des Subathon Timers',
    previewIframeTitle: 'Vorschau des Subathon Timers',
    previewHint:
      'Die Vorschau spielt simulierte Subs, Gifts und Cheers ab. Im Stream läuft der Timer in Echtzeit, und nur dein Chat gibt Zeit dazu.',
    previewSpeed: 'Tempo der Vorschau',
    previewSpeedTip: '1× ist Echtzeit. Bei 60× ist ein Timer von einer Stunde in etwa einer Minute durch.',
    previewSpeedValue: '{rate}×',
    testTitle: 'Probier es aus:',
    testViewer: 'Du',
    testSub: '+1 Sub',
    testGift: '+5 Gifts',
    testBits: '+500 Bits/Kicks',
    testRemove: '−10 Min.',
    testPause: 'Pause / Weiter',
    testReset: 'Reset',
    widgetUrlTip:
      'Schon ein Widget gebaut? Füg seine URL hier ein, um deine Einstellungen zu laden und nur das zu ändern, was du brauchst.',
    widgetUrlPlaceholder: 'Bestehende Widget-URL zum Bearbeiten einfügen',
    widgetUrlInvalid: 'Das ist keine Subathon-Timer-URL.',
    browserSourceHintSize: ' (empfohlene Größe: 800×300).',
    guideTitle: 'Einrichtung in der Streaming-Software (OBS, Streamlabs, XSplit usw.)',
    guideStep1:
      'Füge in deiner Streaming-Software eine Browser-Quelle hinzu (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio usw.).',
    guideStep2: 'Füge die kopierte Subathon-Timer-URL ein.',
    guideStep3: 'Stell die Breite auf 800 und die Höhe auf 300.',
    guideStep4:
      'Wenn du live gehst, schreib !subathon start in den Chat. Mods können auch Zeit dazugeben, abziehen oder pausieren.',
    faq1Q: 'Was passiert, wenn OBS schließt oder die Browser-Quelle neu lädt?',
    faq1A:
      'Der Timer wird in OBS gespeichert und macht da weiter, wo er war. Solange OBS zu ist, zählt er weiter runter, wie eine echte Deadline. Subs, die in der Zeit reinkommen, kann er nicht sehen, ein Mod kann sie also mit !subathon add nachtragen.',
    faq2Q: 'Was passiert, wenn der Timer bei null ist?',
    faq2A:
      'Der Timer bleibt bei null stehen und der Lebensbalken zeigt K.O. Neue Subs geben keine Zeit mehr. Ein Mod kann ihn mit !subathon add oder !subathon set zurückholen oder mit !subathon reset einen neuen starten.',
    faq3Q: 'Wie starte ich einen neuen Subathon oder ändere die Startzeit?',
    faq3A:
      'Schreib !subathon reset in den Chat. Der Timer springt auf die Startzeit aus seiner URL zurück. Solange der Timer noch nie gestartet wurde, gilt eine neue Startzeit in der URL von selbst.',
    faq4Q: 'Muss ich mich einloggen oder meinen Account verbinden?',
    faq4A:
      'Nein. Der Timer liest Subs, Gifts, Bits, Kicks und Mod-Befehle aus deinem öffentlichen Twitch- und Kick-Chat, so wie ein ausgeloggter Zuschauer sie sieht.',
  },
  goal: {
    breadcrumb: 'Sub-Ziel einrichten',
    title: 'Sub-Ziel einrichten',
    intro:
      'Ein Sub-Ziel-Balken für Twitch und Kick. Jeder neue Sub, Resub und Gift-Sub aus beiden Chats füllt ihn um eins, und wenn du das Ziel erreichst, landet ein Pokal auf dem Balken. Du legst fest, wo die Zählung startet und wo das Ziel liegt, und deine Mods können die Zahl im Chat korrigieren.',
    sectionGoal: 'Ziel',
    start: 'Startwert',
    startTip:
      'Hier startet die Zählung: die Sub-Zahl aus deinem Dashboard oder 0, um nur diesen Stream zu zählen. Änderst du den Wert später, fängt die Zählung beim neuen Wert neu an.',
    target: 'Ziel',
    targetTip: 'Bei dieser Zahl ist der Balken voll. Die Zählung läuft danach weiter.',
    countsHint:
      'Jeder Sub und Resub zählt 1, egal ob Prime oder welches Tier. Ein Gift zählt 1 für jeden Sub darin.',
    style: 'Stil',
    styleTip:
      'Balken zeigt Titel und Zahl über dem Balken. Schmaler Balken packt Titel und Zahl direkt in einen dünneren Balken.',
    styleBar: 'Balken',
    styleThin: 'Schmaler Balken',
    color: 'Farbe',
    titleLabel: 'Titel',
    titleTip: 'Steht über dem Balken. Leer lassen, wenn du keinen Titel willst.',
    titlePlaceholder: 'Kein Titel',
    showPops: 'Neue Subs zeigen',
    showPopsTip: 'Lässt bei jedem Sub +1 mit dem Namen des Zuschauers aufsteigen, oder +5 bei 5 Gift-Subs.',
    sectionCommands: 'Chatbefehle',
    commandsIntro:
      'Du und deine Mods können die Zahl im Twitch- oder Kick-Chat korrigieren, z. B. um Subs nachzutragen, die kamen, als OBS zu war.',
    cmdAdd: 'Addiert Subs, 1 wenn du die Zahl weglässt',
    cmdRemove: 'Zieht Subs ab, 1 wenn du die Zahl weglässt',
    cmdSet: 'Setzt die Zahl',
    cmdReset: 'Springt auf den Startwert zurück',
    previewTitle: 'Vorschau des Sub-Ziels',
    previewIframeTitle: 'Vorschau des Sub-Ziels',
    previewHint:
      'Die Vorschau spielt simulierte Subs und Gifts ab, bis das Ziel erreicht ist, und fängt dann von vorn an. Im Stream zählt nur dein Chat.',
    testTitle: 'Probier es aus:',
    testViewer: 'Du',
    testSub: '+1 Sub',
    testGift: '+5 Gifts',
    testReach: 'Ziel erreichen',
    testReset: 'Reset',
    widgetUrlTip:
      'Schon ein Widget gebaut? Füg seine URL hier ein, um deine Einstellungen zu laden und nur das zu ändern, was du brauchst.',
    widgetUrlPlaceholder: 'Bestehende Widget-URL zum Bearbeiten einfügen',
    widgetUrlInvalid: 'Das ist keine Sub-Ziel-URL.',
    browserSourceHintSize: ' (empfohlene Größe: 800×260).',
    guideTitle: 'Einrichtung in der Streaming-Software (OBS, Streamlabs, XSplit usw.)',
    guideStep1:
      'Füge in deiner Streaming-Software eine Browser-Quelle hinzu (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio usw.).',
    guideStep2: 'Füge die kopierte Sub-Ziel-URL ein.',
    guideStep3: 'Stell die Breite auf 800 und die Höhe auf 260.',
    guideStep4: 'Stimmt die Zahl mal nicht, können du oder ein Mod sie mit !goal set im Chat korrigieren.',
    faq1Q: 'Warum liest es meine Sub-Zahl nicht von Twitch oder Kick?',
    faq1A:
      'Keine der beiden Plattformen zeigt die Sub-Zahl eines Kanals einer Seite, die nicht eingeloggt ist, und dieses Ziel fragt dich nie nach einem Login. Also gibst du deinen Startwert einmal ein, und ab dann zählt jeder Sub und jedes Gift, das reinkommt, dazu.',
    faq2Q: 'Was passiert, wenn OBS schließt oder die Browser-Quelle neu lädt?',
    faq2A:
      'Die Zahl wird in OBS gespeichert und ist wieder da, wo sie war, auch beim nächsten Stream. Subs, die reinkommen, während OBS zu ist, kann es nicht sehen, ein Mod kann sie also mit !goal add nachtragen.',
    faq3Q: 'Zählen Resubs und Gift-Subs?',
    faq3A:
      'Ja. Jeder neue Sub und Resub zählt 1, und ein Gift zählt 1 für jeden Sub darin, 5 Gift-Subs zählen also 5. Auf Twitch zählt ein Resub, wenn der Zuschauer ihn im Chat teilt, und auf Kick, wenn er verlängert wird.',
    faq4Q: 'Kann ich ein Follower-Ziel machen?',
    faq4A:
      'Noch nicht. Twitch und Kick zeigen neue Follows keiner Seite, die nicht eingeloggt ist, also zählt das Ziel Subs, auf beiden Plattformen gleich.',
  },
  frames: {
    breadcrumb: 'Stream-Rahmen einrichten',
    title: 'Stream-Rahmen einrichten',
    intro:
      'Fertige Rahmen für deine Kamera, deinen Chat oder deinen ganzen Stream-Screen. Das Preset, das du wählst, zeichnet den Rahmen im Stil des Games, mit Form, Deko und Bewegung: ein Pagodendach, schwingende Quasten und fliegende Blüten bei Dynasty, Grasblöcke und flackernde Fackeln bei Blocks. Kein Kanal zu verbinden. Füg die URL in OBS ein und leg deine Kamera oder deinen Chat unter den Rahmen.',
    sectionPiece: 'Rahmen',
    piece: 'Was willst du einrahmen?',
    pieceTip:
      'Jedes Teil ist eine eigene Browser-Quelle. Füg alle drei mit demselben Preset hinzu, dann passt alles auf dem Screen zusammen.',
    pieces: {
      camera: 'Kamera',
      chat: 'Chat',
      screen: 'Screen',
    },
    pieceHints: {
      camera: 'Ein 16:9-Rahmen für deine Webcam. Setz deine Kamera in die Öffnung in der Mitte.',
      cameraPortrait:
        'Ein 9:16-Rahmen für eine Handykamera oder eine hochkant gedrehte Webcam. Setz deine Kamera in die Öffnung in der Mitte.',
      chat: 'Ein hoher Rahmen mit Kopfleiste für die Chat-Box. Setz die Chat-Box unter die Kopfleiste.',
      screen:
        'Ein dünner Rahmen am Rand deines ganzen Streams. Die Deko bleibt in den Ecken, damit sie dein Game nicht verdeckt.',
    },
    orientation: 'Ausrichtung',
    orientations: {
      landscape: 'Quer',
      portrait: 'Hochkant',
    },
    labelLabel: 'Beschriftung',
    labelTips: {
      camera:
        'Steht auf dem Reiter über deiner Kamera, z. B. dein Kanalname. Lässt du es leer, behält der Reiter nur seine Deko.',
      chat:
        'Steht auf dem Reiter über dem Chat-Rahmen. Lässt du es leer, behält der Reiter nur seine Deko.',
      screen:
        'Steht auf dem Schild unten in der Mitte des Screens. Leer lassen, um das Schild auszublenden.',
    },
    labelPlaceholder: 'Keine Beschriftung',
    color: 'Farbe',
    motion: 'Animationen',
    motionTip:
      'Leuchtende Linien, Lichtschweife und kleine Details je nach Preset, wie Laternen, Fackeln oder Funken. Schalt es aus, dann bleibt der Rahmen still.',
    previewTitle: 'Vorschau des Stream-Rahmens',
    previewIframeTitle: 'Vorschau des Stream-Rahmens',
    previewHint:
      'Silhouette und Chatzeilen in der Vorschau sind nur Platzhalter. Im Stream ist die Mitte des Rahmens transparent, deine Kamera oder dein Chat scheint also von unten durch.',
    widgetUrlTip:
      'Schon einen Rahmen gebaut? Füg seine URL hier ein, um deine Einstellungen zu laden und nur das zu ändern, was du brauchst.',
    widgetUrlPlaceholder: 'Bestehende Rahmen-URL zum Bearbeiten einfügen',
    widgetUrlInvalid: 'Das ist keine Stream-Rahmen-URL.',
    browserSourceHintSize: ' (empfohlene Größe: {width}×{height}).',
    guideTitle: 'Einrichtung in der Streaming-Software (OBS, Streamlabs, XSplit usw.)',
    guideStep1:
      'Füge in deiner Streaming-Software eine Browser-Quelle hinzu (OBS Studio, Streamlabs Desktop, XSplit, vMix usw.) und setz die Rahmen-URL ein.',
    guideStep2:
      'Stell Breite und Höhe auf die empfohlene Größe. Für eine quadratische Kamera gibst du deine eigene Größe ein. Der Rahmen passt sich jeder Größe an.',
    guideStep3:
      'Schieb den Rahmen in der Liste Quellen über deine Kamera oder Chat-Box und platzier ihn in der Szene darüber.',
    guideStep4:
      'Mach deine Kamera so groß, dass sie die Öffnung füllt, aber innerhalb des Außenrands bleibt. In einem 640 × 360-Rahmen passt 590 × 296 genau, in einem 360 × 640-Rahmen hochkant passt 306 × 572.',
    faq1Q: 'Zeigt der Rahmen meine Kamera oder meinen Chat von selbst?',
    faq1A:
      'Nein. Die Mitte des Rahmens ist transparent, er ist nur Deko. Kamera und Chat-Box fügst du in OBS als eigene Quellen hinzu und legst sie unter den Rahmen.',
    faq2Q: 'Muss ich meinen Twitch- oder Kick-Account verbinden?',
    faq2A:
      'Nein. Der Rahmen liest keinen Chat und braucht keinen Kanalnamen. Er funktioniert genauso, egal ob du auf Twitch, Kick oder woanders streamst.',
    faq3Q: 'Kann ich den Kamerarahmen in einer anderen Größe nutzen?',
    faq3A:
      'Ja. Für eine vertikale Kamera stellst du Ausrichtung auf Hochkant, dann ist die empfohlene Größe 360 × 640. Der Rahmen wird passend zu seiner Browser-Quelle gezeichnet, für eine quadratische Kamera stellst du also einfach Breite und Höhe passend ein, und die Deko skaliert mit.',
    faq4Q: 'Stammt die Grafik in den Rahmen aus den Games?',
    faq4A:
      'Nein. Jede Zeichnung, wie das Pagodendach, die Laternen oder die Pixelblöcke, ist selbst gemacht, ohne Game-Logos oder Grafiken. Die Presets sind Fan-Styles, die das Feeling dieser Games einfangen.',
  },
  countdown: {
    breadcrumb: 'Stream-Countdown einrichten',
    title: 'Stream-Countdown einrichten',
    intro:
      'Ein Countdown für die Teile deines Streams, in denen noch nichts passiert: die Minuten, bevor du live gehst, eine Pause mittendrin und die letzten Minuten vor dem Ende. Gib ihm eine Dauer oder die Uhrzeit, zu der du starten willst, und er übernimmt den Look des Presets, das du wählst. Kein Kanal nötig, aber mit Kanal können deine Mods ihn im Chat verlängern.',
    scenes: {
      starting: {
        label: 'Start',
        title: "Gleich geht's los",
        done: 'Wir sind live!',
        hint: 'Für die Szene, auf der du vor dem Livegang wartest.',
      },
      break: {
        label: 'Pause',
        title: 'Gleich zurück',
        done: 'Bin wieder da!',
        hint: 'Für eine Pause mittendrin: Essen, kurz durchatmen, schnell was erledigen.',
      },
      ending: {
        label: 'Ende',
        title: 'Stream endet',
        done: 'Danke fürs Zuschauen!',
        hint: 'Für die letzten Minuten, damit der Chat weiß, wie lange es noch geht.',
      },
    },
    sectionCountdown: 'Countdown',
    scene: 'Wofür ist er?',
    sceneTip: 'Das bestimmt Text und Icon. Weiter unten kannst du deinen eigenen Text schreiben.',
    mode: 'Countdown-Art',
    modes: {
      duration: 'Dauer',
      clock: 'Uhrzeit',
    },
    modeTip:
      'Eine Dauer startet, sobald die Browser-Quelle lädt. Eine Uhrzeit endet immer genau dann, du kannst die Quelle also Stunden vorher hinzufügen.',
    duration: 'Dauer',
    durationUnit: 'Min.',
    durationTip: 'Wie lange der Countdown läuft, von 1 Minute bis 24 Stunden.',
    atLabel: 'Uhrzeit',
    atTip:
      'Eine Uhrzeit im 24-Stunden-Format wie 21:00, nach der Uhr des PCs, auf dem OBS läuft. Ist sie heute schon vorbei, zielt der Countdown auf morgen.',
    atPlaceholder: '21:00',
    atInvalid: 'Gib eine Uhrzeit im 24-Stunden-Format ein, z. B. 21:00.',
    ending: 'Bei null',
    endings: {
      text: 'Nachricht zeigen',
      hold: 'Bei 00:00 bleiben',
      hide: 'Ausblenden',
    },
    endingTip: 'Was nach Ablauf des Countdowns auf dem Screen bleibt, bis du die Szene wechselst.',
    sectionText: 'Text',
    titleLabel: 'Überschrift',
    titleTip: 'Über der Uhr. Leer lassen, um den Text der gewählten Szene zu nutzen.',
    titlePlaceholder: 'Text der Szene',
    noteLabel: 'Notiz',
    noteTip: 'Eine Zeile unter der Uhr, z. B. wofür die Pause ist. Leer lassen, um sie auszublenden.',
    notePlaceholder: 'Keine Notiz',
    doneLabel: 'Nachricht bei null',
    doneTip: 'Ersetzt die Uhr, wenn sie abgelaufen ist. Leer lassen, um den Text der Szene zu nutzen.',
    look: 'Hintergrund',
    looks: {
      card: 'Panel',
      plain: 'Kein Panel',
    },
    lookTip: 'Ein Panel hinter der Uhr, oder der Text direkt auf deiner Szene.',
    color: 'Farbe',
    showBar: 'Fortschrittsbalken',
    showBarTip: 'Ein Balken unter der Uhr, der sich leert, während die Zeit abläuft.',
    motion: 'Animationen',
    motionTip: 'Die Uhr pulsiert in der letzten Minute. Schalt es aus, dann bleibt alles still.',
    channelsTip:
      'Nur für die Chatbefehle nötig. Ohne Kanal läuft der Countdown trotzdem von selbst.',
    sectionCommands: 'Chatbefehle',
    commandsIntro:
      'Mit eingetragenem Kanal können du und deine Mods den Countdown im Twitch- oder Kick-Chat ändern, z. B. um den Start zu verschieben, während du AFK bist.',
    cmdAdd: 'Gibt Zeit dazu: 5m, 90s oder 1h30m',
    cmdRemove: 'Zieht Zeit ab',
    cmdSet: 'Setzt die Restzeit',
    cmdPause: 'Pausiert ihn, start lässt ihn weiterlaufen',
    cmdReset: 'Startet den Countdown neu',
    previewTitle: 'Vorschau des Stream-Countdowns',
    previewIframeTitle: 'Vorschau des Stream-Countdowns',
    previewHint:
      'Die Vorschau läuft schnell, damit du den ganzen Countdown siehst, und fängt dann von vorn an. Im Stream zählt er in Echtzeit runter.',
    testTitle: 'Probier es aus:',
    testAdd: '+1 Min.',
    testRemove: '-1 Min.',
    testPause: 'Pause',
    testFinish: 'Auf null springen',
    widgetUrlTip:
      'Schon einen Countdown gebaut? Füg seine URL hier ein, um deine Einstellungen zu laden und nur das zu ändern, was du brauchst.',
    widgetUrlPlaceholder: 'Bestehende Countdown-URL zum Bearbeiten einfügen',
    widgetUrlInvalid: 'Das ist keine Stream-Countdown-URL.',
    browserSourceHintSize: ' (empfohlene Größe: 1920×1080).',
    guideTitle: 'Einrichtung in der Streaming-Software (OBS, Streamlabs, XSplit usw.)',
    guideStep1:
      'Füge deiner Start-, Pausen- oder Endszene eine Browser-Quelle hinzu und setz die Countdown-URL ein.',
    guideStep2: 'Stell die Breite auf 1920 und die Höhe auf 1080, damit die Uhr mittig in der Szene sitzt.',
    guideStep3:
      'Hak „Browser bei Szenenaktivierung aktualisieren“ an, damit der Countdown jedes Mal neu startet, wenn du zu dieser Szene wechselst.',
    guideStep4:
      'Wechsle zur Szene, um ihn zu starten. Mit eingetragenem Kanal kann ein Mod ihn mit !countdown add 5m verlängern, während du weg bist.',
    faq1Q: 'Wann startet der Countdown?',
    faq1A:
      'Sobald die Browser-Quelle lädt: wenn OBS startet oder wenn du zur Szene wechselst und „Browser bei Szenenaktivierung aktualisieren“ angehakt ist. So startet ein Pausen-Countdown jedes Mal neu, wenn du in deine BRB-Szene gehst, statt abzulaufen, während du noch live bist.',
    faq2Q: 'Kann er bis zur angekündigten Uhrzeit runterzählen, z. B. 21:00?',
    faq2A:
      'Ja. Stell Countdown-Art auf Uhrzeit und gib 21:00 ein. Er liest die Uhr des PCs, auf dem OBS läuft, du kannst die Quelle also Stunden vorher hinzufügen, und er endet trotzdem um 21:00. Ist 21:00 heute schon vorbei, zielt er auf morgen.',
    faq3Q: 'Muss ich meinen Twitch- oder Kick-Account verbinden?',
    faq3A:
      'Nein. Der Countdown läuft von selbst, ohne Kanal und ohne Login. Einen Kanal trägst du nur ein, wenn du die !countdown-Befehle willst, und dann liest er deinen öffentlichen Chat wie die anderen Widgets.',
    faq4Q: 'Was passiert, wenn er bei null ist?',
    faq4A:
      'Das, was du unter Bei null wählst: eine Nachricht wie „Wir sind live!“, die Uhr bleibt bei 00:00 stehen, oder das Overlay verschwindet und die Szene ist leer. Die Szene wechselt er nie für dich.',
  },
  poll: {
    breadcrumb: 'Chat-Umfrage einrichten',
    title: 'Chat-Umfrage einrichten',
    intro:
      'Eine Chat-Umfrage für Twitch und Kick. Du oder ein Mod startet eine Umfrage im Chat, die Zuschauer stimmen per Zahl ab, und die Balken füllen sich live im Stream. Stimmen aus beiden Chats landen in einer Umfrage, jeder Zuschauer zählt einmal, und wenn die Zeit um ist, steht der Gewinner fest.',
    sectionPoll: 'Fertige Umfrage',
    question: 'Frage',
    questionTip: 'Steht über den Optionen. Leer lassen, wenn du die Frage laut stellst.',
    questionPlaceholder: 'Was sollen wir als Nächstes spielen?',
    options: 'Optionen',
    optionsTip:
      'Zuschauer stimmen mit der Zahl neben einer Option ab oder schreiben die Option selbst. Bis zu 6 Optionen.',
    optionLabel: 'Option {n}',
    optionPlaceholder: 'Option {n}',
    removeOption: 'Option {n} entfernen',
    addOption: '+ Option hinzufügen',
    pollHint:
      'Wird in der URL gespeichert. Starte sie mit {command} im Chat. Mods können auch jederzeit eine neue Umfrage in den Chat schreiben.',
    sectionVoting: 'Abstimmung',
    duration: 'Umfragedauer',
    durationTip:
      'Wie lange eine Umfrage Stimmen annimmt. Im Chat kann ein Mod einer Umfrage eine andere Dauer geben, sie früher beenden oder Zeit dazugeben.',
    durationOff: 'Kein Timer: Die Umfrage bleibt offen, bis ein Mod !poll end schreibt.',
    hold: 'Ergebnisse sichtbar',
    holdTip: 'Wie lange die Ergebnisse nach der Abstimmung stehen bleiben. Danach verschwindet die Umfrage.',
    holdOff: 'Die Ergebnisse bleiben bis zur nächsten Umfrage oder bis !poll cancel stehen.',
    delay: 'Stream-Delay',
    delayTip:
      'Zuschauer sehen deinen Stream ein paar Sekunden nach dem Chat, eine Stimme bei „noch 1 Sekunde“ kommt also zu spät im Chat an. Stimmen zählen noch so viele Sekunden nach Ablauf des Timers. Twitch und Kick hängen meistens 2 bis 10 Sekunden hinterher.',
    voters: 'Wer darf abstimmen',
    votersTip: 'Subs heißt Zuschauer mit Sub- oder Founder-Badge, plus du.',
    votersAll: 'Alle',
    votersSubs: 'Subs',
    subWeight: 'Sub-Stimme zählt',
    subWeightTip: 'Die Stimme eines Subs zählt so oft. Die Umfrage zeigt das auf dem Screen an.',
    subWeightValue: '{n}×',
    change: 'Stimme ändern erlaubt',
    changeTip:
      'An: Eine andere Zahl verschiebt die Stimme. Aus: Die erste Stimme zählt. So oder so zählt jeder Zuschauer einmal.',
    blind: 'Ergebnisse bis zum Ende verbergen',
    blindTip:
      'Die Balken bleiben versteckt, solange abgestimmt wird, damit frühe Stimmen den Rest nicht beeinflussen. Nur die Zahl der Stimmen ist zu sehen.',
    color: 'Farbe',
    position: 'Position',
    positionTip:
      'Wo die Umfrage in der Browser-Quelle sitzt. Von dort wächst sie mit der Zahl der Optionen.',
    positionTop: 'Oben',
    positionBottom: 'Unten',
    language: 'Umfragesprache',
    languageTip:
      'Die Sprache der Wörter auf der Umfrage, wie „Ergebnisse“ und das Ja und Nein einer schnellen Umfrage.',
    unitMinutes: 'Min.',
    unitSeconds: 'Sek.',
    sectionCommands: 'Chatbefehle',
    commandsIntro:
      'Du und deine Mods starten Umfragen im Twitch- oder Kick-Chat. Die Teile einer neuen Umfrage trennst du mit |.',
    exampleQuestion: 'Frage',
    cmdNew: 'Startet eine neue Umfrage mit 2 bis 6 Optionen',
    cmdNewTime: 'Genauso, mit eigener Dauer wie 90s, 2m oder 1:30',
    cmdYesNo: 'Startet eine schnelle Ja-oder-Nein-Umfrage',
    cmdStart: 'Startet die fertige Umfrage von dieser Seite',
    cmdExtend: 'Gibt der Umfrage mehr Zeit',
    cmdEnd: 'Beendet die Abstimmung sofort und zeigt die Ergebnisse',
    cmdCancel: 'Nimmt die Umfrage vom Screen',
    votingIntro:
      'Zuschauer stimmen ab, indem sie nur die Zahl (2), !vote 2 oder den Text einer Option schreiben. Eine Nachricht mit mehr drin, wie „2 bitte“, zählt nicht. Der Twitch-Befehl /vote ist für Twitchs eigene Umfragen, sag deinem Chat also, dass er die Zahl schreiben soll.',
    previewTitle: 'Vorschau der Chat-Umfrage',
    previewIframeTitle: 'Vorschau der Chat-Umfrage',
    previewHint:
      'Die Vorschau spielt eine Umfrage mit simulierten Stimmen ab, schneller als in Echtzeit, und startet dann die nächste. Im Stream erscheint eine Umfrage nur, wenn du oder ein Mod eine startet.',
    testTitle: 'Probier es aus:',
    testVotes: '+{count} Stimmen',
    testExtend: '+30 Sek.',
    testEnd: 'Jetzt beenden',
    testNew: 'Neue Umfrage',
    widgetUrlTip:
      'Schon ein Widget gebaut? Füg seine URL hier ein, um deine Einstellungen zu laden und nur das zu ändern, was du brauchst.',
    widgetUrlPlaceholder: 'Bestehende Widget-URL zum Bearbeiten einfügen',
    widgetUrlInvalid: 'Das ist keine Chat-Umfrage-URL.',
    browserSourceHintSize: ' (empfohlene Größe: 640×560).',
    guideTitle: 'Einrichtung in der Streaming-Software (OBS, Streamlabs, XSplit usw.)',
    guideStep1:
      'Füge in deiner Streaming-Software eine Browser-Quelle hinzu (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio usw.).',
    guideStep2: 'Füge die kopierte Chat-Umfrage-URL ein.',
    guideStep3: 'Stell die Breite auf 640 und die Höhe auf 560.',
    guideStep4:
      'Die Quelle bleibt leer, bis eine Umfrage startet. Schreib !poll start oder !poll Frage | A | B in den Chat.',
    faq1Q: 'Wie stimmen die Zuschauer ab?',
    faq1A:
      'Sie schreiben die Zahl der Option in den Chat, z. B. 2. !vote 2 und der Text der Option gehen auch, egal ob groß oder klein, und Akzente oder Umlaute dürfen fehlen (ü geht auch als u). Die ganze Nachricht muss die Stimme sein, „2 bitte“ oder 4Head zählen also nicht.',
    faq2Q: 'Kann ein Zuschauer mehrmals abstimmen?',
    faq2A:
      'Nein. Jeder Twitch- oder Kick-Account zählt einmal. Wenn Stimme ändern erlaubt an ist, verschiebt eine neue Zahl die Stimme und fügt nie eine zweite hinzu. Bekommt ein Account einen Timeout oder Bann von einem Mod, während die Umfrage läuft, fällt seine Stimme weg. Das hilft gegen Spam-Bots.',
    faq3Q: 'Warum nicht die eigenen Umfragen von Twitch oder Kick?',
    faq3A:
      'Diese Umfrage packt Stimmen von Twitch und Kick in ein Ergebnis und läuft auf beiden gleich. Twitchs eigene Umfragen lassen sich ohne Login nicht lesen, und dieses Overlay fragt dich nie nach einem Login. Außerdem musst du kein Affiliate oder Partner sein.',
    faq4Q: 'Was passiert, wenn OBS schließt oder die Browser-Quelle neu lädt?',
    faq4A:
      'Die Umfrage und ihre Stimmen werden in OBS gespeichert und sind wieder da, wo sie waren. Der Timer läuft weiter, während OBS zu ist, aber Stimmen aus dieser Zeit kann sie nicht sehen.',
    faq5Q: 'Warum zählen Stimmen noch, wenn der Timer bei null ist?',
    faq5A:
      'Zuschauer sehen deinen Stream ein paar Sekunden hinter dem Chat, wenn ihr Timer also noch 1 Sekunde zeigt, ist er im Chat schon abgelaufen. Das Stream-Delay zählt Stimmen noch ein paar Sekunden weiter, standardmäßig 5, und danach steht der Gewinner fest.',
    overlay: {
      label: 'Umfrage',
      closing: 'Letzte Stimmen',
      results: 'Ergebnisse',
      tie: 'Gleichstand',
      tieHint: 'Gleichstand!',
      winner: 'Gewinner: {option}',
      noVotes: 'Keine Stimmen',
      hidden: 'Ergebnisse kommen am Ende',
      howTo: 'Schreib 1 bis {last} in den Chat',
      howToTwo: 'Schreib 1 oder 2 in den Chat',
      subsOnly: 'Nur Subs',
      subBonus: 'Sub-Stimmen ×{n}',
      votes: '{count} Stimmen',
      voteOne: '1 Stimme',
      yes: 'Ja',
      no: 'Nein',
      sampleQuestion: 'Was sollen wir als Nächstes spielen?',
      sampleOption1: 'Horrorgame',
      sampleOption2: 'Speedrun',
      sampleOption3: 'Zuschauerrunden',
    },
  },
  streamAlerts: {
    breadcrumb: 'Stream-Alerts einrichten',
    title: 'Stream-Alerts einrichten',
    intro:
      'Animierte Stream-Alerts für Twitch und Kick. Ein neuer Sub, Gift-Subs, Bits, Kicks oder ein Raid bekommen jeweils einen Alert mit eigenem Icon und Sound, einer nach dem anderen. Wähl eine Farbe, benenn die Überschriften um und leg fest, ab welchem Gift, Cheer oder Raid es einen Alert gibt.',
    color: 'Farbe',
    theme: 'Theme',
    themeTip:
      'Neon ist ein kantiges Sci-Fi-Banner mit Synth-Sounds. Sternenhimmel ist eine Karte mit Goldlinien unter Sternen und Glockenklängen.',
    themes: {
      neon: 'Neon',
      celestial: 'Sternenhimmel',
    },
    colorTip: 'Plattform zeigt Twitch-Alerts in Lila und Kick-Alerts in Grün.',
    colors: {
      blue: 'Blau',
      purple: 'Lila',
      pink: 'Pink',
      red: 'Rot',
      gold: 'Gold',
      green: 'Grün',
      platform: 'Plattform (Twitch lila, Kick grün)',
    },
    language: 'Alert-Sprache',
    languageTip:
      'Die Sprache der Wörter im Alert. Die OBS-URL behält sie, egal in welcher Sprache OBS läuft.',
    sectionAlerts: 'Alerts',
    heading: 'Überschrift',
    kindSub: 'Subs',
    kindSubTip: 'Jeder neue Sub und Resub, und ein Resub, den ein Zuschauer mit Nachricht im Chat teilt.',
    kindGift: 'Gift-Subs',
    kindGiftTip: 'Ein Alert pro Gift, egal wie viele Subs drin sind.',
    kindBits: 'Bits & Kicks',
    kindBitsTip: 'Gecheerte Bits auf Twitch und geschickte Kicks auf Kick.',
    kindRaid: 'Raids',
    kindRaidTip: 'Ein anderer Kanal raidet dich, mit der Zahl der mitgebrachten Zuschauer.',
    minGift: 'Min. Subs',
    minBits: 'Min. Menge',
    minRaid: 'Min. Zuschauer',
    sectionTiming: 'Timing & Sound',
    duration: 'Anzeigedauer',
    durationTip: 'Wie lange jeder Alert stehen bleibt. Kommen mehrere, warten sie, bis sie dran sind.',
    seconds: '{value} s',
    volume: 'Lautstärke',
    volumeTip: 'Jeder Alert spielt seinen eigenen kurzen Sound. 0 schaltet den Sound aus.',
    volumeOff: 'Aus',
    showMessage: 'Zuschauer-Nachricht zeigen',
    showMessageTip:
      'Zeigt, was der Zuschauer zu seinem Resub, seinen Bits oder Kicks geschrieben hat. Links fliegen raus, und lange Nachrichten werden gekürzt.',
    previewTitle: 'Vorschau der Stream-Alerts',
    previewIframeTitle: 'Vorschau der Stream-Alerts',
    previewHint:
      'Die Vorschau spielt stumme Beispiel-Alerts ab. Die Buttons unten spielen einen mit Sound. Im Stream erscheinen nur Subs, Gifts, Cheers und Raids aus deinem Kanal.',
    testTitle: 'Probier es aus:',
    testSub: 'Sub',
    testGift: '{count} Gifts',
    testBits: '{amount} Bits/Kicks',
    testRaid: 'Raid',
    testViewer: 'TestZuschauer',
    testMessage: 'Richtig guter Stream!',
    widgetUrlTip:
      'Schon ein Widget gebaut? Füg seine URL hier ein, um deine Einstellungen zu laden und nur das zu ändern, was du brauchst.',
    widgetUrlPlaceholder: 'Bestehende Widget-URL zum Bearbeiten einfügen',
    widgetUrlInvalid: 'Das ist keine Stream-Alerts-URL.',
    browserSourceHintSize: ' (empfohlene Größe: 800×450).',
    guideTitle: 'Einrichtung in der Streaming-Software (OBS, Streamlabs, XSplit usw.)',
    guideStep1:
      'Füge in deiner Streaming-Software eine Browser-Quelle hinzu (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio usw.).',
    guideStep2: 'Füge die kopierte Stream-Alerts-URL ein.',
    guideStep3: 'Stell die Breite auf 800 und die Höhe auf 450 und platzier sie dort, wo die Alerts erscheinen sollen.',
    guideStep4:
      'Damit du den Sound in OBS hörst, aktiviere in den Eigenschaften der Quelle Audio über OBS steuern und stell die Quelle unter Erweiterte Audioeigenschaften auf Monitoring aktiviert.',
    faq1Q: 'Warum gibt es keine Follow- oder Spenden-Alerts?',
    faq1A:
      'Twitch und Kick zeigen neue Follows keiner Seite, die nicht eingeloggt ist, und keine der beiden Plattformen hat eigene Spenden. Die Alerts nutzen nur, was beide Plattformen jedem Zuschauer schicken, deshalb laufen sie auf beiden gleich.',
    faq2Q: 'Zeigt ein Sub-Alert die Monate und die Nachricht des Zuschauers?',
    faq2A:
      'Ja. Teilt ein Zuschauer seinen Resub im Chat, auf Twitch oder auf Kick, gibt es einen Alert mit den Monaten und seiner Nachricht. Auf Twitch zeigt jeder Sub-Alert die Monate. Kick schickt sie bei den meisten Subs mit, aber manche Kanäle bekommen sie nie, und dann sagt der Alert nur, dass jemand abonniert hat.',
    faq3Q: 'Was passiert, wenn viele Alerts auf einmal kommen?',
    faq3A:
      'Sie erscheinen nacheinander in der Reihenfolge, in der sie reinkamen. 50 Gift-Subs auf einmal sind ein einziger Alert, nicht 50.',
    faq4Q: 'Muss ich mich einloggen oder meinen Account verbinden?',
    faq4A:
      'Nein. Die Alerts lesen Subs, Gifts, Bits, Kicks und Raids aus deinem öffentlichen Twitch- und Kick-Chat, so wie ein ausgeloggter Zuschauer sie sieht.',
    alert: {
      subHeading: 'Neuer Sub',
      subDetail: 'hat gerade abonniert',
      resubDetail: 'hat {months} Monate abonniert',
      giftHeading: 'Gift-Subs',
      giftDetail: 'hat {count} Subs verschenkt',
      giftDetailOne: 'hat einen Sub verschenkt',
      bitsHeading: 'Neuer Cheer',
      bitsDetail: 'hat {amount} Bits gecheert',
      kicksHeading: 'Kicks',
      kicksDetail: 'hat {amount} Kicks geschickt',
      raidHeading: 'Raid im Anflug',
      raidDetail: 'raidet mit {viewers} Zuschauern',
      raidDetailOne: 'raidet mit 1 Zuschauer',
      raidDetailNoCount: 'raidet',
      anonymous: 'Anonym',
    },
  },
  raffle: {
    breadcrumb: 'Verlosung einrichten',
    title: 'Verlosung einrichten',
    intro:
      'Mach Giveaways direkt im Chat: Zuschauer machen mit, indem sie ein Keyword wie !join schreiben, und du ziehst den Gewinner mit einem Klick. Läuft auf Twitch und Kick, lässt sich auf Subs beschränken und zeigt den Gewinner auf Wunsch mit Konfetti im Stream.',
    lockedTitle: 'Einstellungen gesperrt',
    lockedDesc:
      'Die Regeln lassen sich nicht ändern, solange eine Verlosung läuft oder auf die Ziehung wartet. Klick auf Alles zurücksetzen, um sie zu bearbeiten.',
    platform: 'Plattform',
    channelName: 'Kanal',
    sectionRules: 'Teilnahmeregeln',
    entryKeyword: 'Keyword',
    keywordTip:
      'Die Nachricht muss genau das sein oder damit anfangen, gefolgt von einem Leerzeichen. Groß- und Kleinschreibung ist egal, bekannte Bots werden ignoriert.',
    minDuration: 'Mindestdauer (s)',
    minDurationTip:
      'Gewinner ziehen bleibt nach dem Start so viele Sekunden gesperrt, damit alle Zeit zum Schreiben haben.',
    subscribersOnly: 'Nur Subs',
    subscribersOnlyTip:
      'Nur Zuschauer mit Sub- oder Founder-Badge können mitmachen. Als Streamer kannst du auch mitmachen, solange das Minimum 1 Monat ist.',
    minSubMonths: 'Mindest-Sub-Monate',
    maxWinsPerUser: 'Max. Gewinne pro Zuschauer',
    maxWinsTip:
      'Ein Gewinner fliegt aus der Teilnehmerliste. Mit dem Keyword kann er wieder mitmachen, bis er dieses Limit erreicht.',
    maxWinsUnlimited: 'Unbegrenzt',
    resetConfig: 'Einstellungen zurücksetzen',
    controlTitle: 'Steuerung',
    controlTip:
      'Lass diese Seite während der Verlosung offen. Sie liest den Chat und schickt den Gewinner ans Overlay.',
    statusIdle: 'Nicht gestartet',
    statusNeedsSetup: 'Gib einen Kanal und ein Keyword ein, um zu starten.',
    statusRunning: 'Offen, wartet auf {keyword}',
    statusStopped: 'Teilnahme geschlossen',
    startRaffle: 'Verlosung starten',
    stopRaffle: 'Teilnahme schließen',
    drawWinner: 'Gewinner ziehen ({count} dabei)',
    drawLocked: 'Ziehung in {seconds} s möglich',
    lastWinner: 'Letzter Gewinner',
    clear: 'Leeren',
    resetEntries: 'Teilnehmer leeren',
    resetWinners: 'Gewinner leeren',
    resetAll: 'Alles zurücksetzen',
    winners: 'Gewinner ({count})',
    participants: 'Teilnehmer ({count})',
    noWinners: 'Noch keine Gewinner.',
    noParticipants: 'Noch keine Teilnehmer. Zuschauer machen mit, indem sie {keyword} in den Chat schreiben.',
    disqualify: '{name} entfernen',
    confirmStart: 'Neue Verlosung starten? Die aktuellen Teilnehmer und Gewinner werden gelöscht.',
    confirmResetEntries: 'Teilnehmerliste leeren?',
    confirmResetWinners: 'Gewinnerliste leeren?',
    confirmResetAll:
      'Alles zurücksetzen? Teilnehmer und Gewinner werden gelöscht und die Sperre fällt weg. Deine Einstellungen bleiben, wie sie sind.',
    overlayUrl: 'Gewinner-Overlay-URL',
    overlayUrlTip:
      'Der Gewinner wird über den BroadcastChannel des Browsers geschickt, und der kommt nicht aus dem Browser raus, in dem er läuft. Eine Verlosungsseite in Chrome erreicht kein Overlay in OBS.',
    overlayUrlHint:
      'Der Gewinner kommt nur beim Overlay an, wenn diese Seite im selben Browser oder in derselben App läuft wie das Overlay. Mach vor dem Livegang eine Testziehung.',
    overlayNextStep: 'Lass diese Verlosungsseite in derselben App wie das Overlay laufen und mach eine Testziehung.',
    guideStep1: 'Wähl die Plattform, gib deinen Kanalnamen ein und leg Keyword und Regeln fest.',
    guideStep2: 'Willst du den Gewinner im Stream zeigen? Füg die Overlay-URL als 1920×1080-Browser-Quelle hinzu.',
    guideStep3:
      'Klick auf Verlosung starten. Zuschauer machen mit, indem sie das Keyword in den Chat schreiben, und du kannst jeden mit dem ✕ neben seinem Namen rauswerfen.',
    guideStep4:
      'Wenn du so weit bist, klick auf Gewinner ziehen. Der Gewinner erscheint nur dann im Overlay, wenn diese Seite im selben Browser oder in derselben App läuft, also teste das vor dem Livegang.',
    faq1Q: 'Wie verhindert man, dass dieselbe Person zweimal gewinnt?',
    faq1A:
      'Ein gezogener Gewinner fliegt aus der Teilnehmerliste und landet in der Gewinnerliste. Steht Max. Gewinne pro Zuschauer auf 1, kann er in derselben Verlosung weder nochmal mitmachen noch gewinnen.',
    faq2Q: 'Kann ich verdächtige Teilnehmer oder Bots entfernen?',
    faq2A:
      'Bekannte Bots wie Nightbot und StreamElements werden automatisch übersprungen. Außerdem kannst du jeden mit dem ✕ neben seinem Namen entfernen.',
    faq3Q: 'Warum erscheint der Gewinner nicht in meinem Overlay?',
    faq3A:
      'Die Verlosungsseite schickt den Gewinner per BroadcastChannel, und das funktioniert nur innerhalb eines Browsers. Ist diese Seite in Chrome offen und das Overlay läuft in OBS, kommt die Nachricht nie an. Lass die Verlosungsseite in derselben App wie das Overlay laufen und mach vor dem Livegang eine Testziehung.',
    winner: 'Gewinner!',
    subMonthsShort: '{months} Mon.',
  },
  alerts: {
    follow: 'Neuer Follower!',
    sub: 'Neuer Sub!',
    donate: 'Spende!',
    raid: 'Raid im Anflug!',
  },
  emoteWallSetup: {
    breadcrumb: 'Emote-Wand einrichten',
    title: 'Emote-Wand einrichten',
    intro:
      'Nachrichten, die nur aus Emotes bestehen (Twitch, Kick und die 7TV-Emotes deines Twitch-Kanals), tauchen als Emotes auf dem Screen auf. Normale Textnachrichten werden standardmäßig übersprungen, und Alle Emotes zeigen holt die Emotes auch da raus. Ruhig lässt sie an zufälligen Stellen aufploppen, treiben und verblassen, Chaos schießt sie vom Rand quer über den Screen, und Abprallen lässt sie von den Bildschirmrändern abprallen.',
    sectionAnimation: 'Animation',
    sectionFilters: 'Filter',
    sevenTvEmotes: '7TV-Emotes',
    sevenTvTip:
      'Zeigt die 7TV-Emotes deines Twitch-Kanals, auch im Kick-Chat. Braucht deinen Twitch-Kanal.',
    mode: 'Animationsmodus',
    modeCalm: 'Ruhig',
    modeChaos: 'Chaos',
    modeBounce: 'Abprallen',
    modeTip:
      'Ruhig: ploppt an einer zufälligen Stelle auf, treibt und blendet aus. Chaos: fliegt von einem zufälligen Rand rein und verschwindet irgendwo zwischen der Mitte und der anderen Seite. Abprallen: prallt von den Rändern ab und wird bei jedem Treffer schneller.',
    emoteSize: 'Emote-Größe',
    duration: 'Anzeigedauer (Sek.)',
    durationTip:
      'Wie lange jedes Emote auf dem Screen bleibt. Bei Chaos fliegen die Emotes in einem Teil dieser Zeit über den Screen und verschwinden früher.',
    maxEmotes: 'Max. Emotes gleichzeitig',
    maxEmotesTip: 'Sind mehr Emotes auf dem Screen, fliegen die ältesten raus.',
    subsOnly: 'Nur Subs',
    subsOnlyTip:
      'Zeigt nur Emotes von Chattern mit Sub- oder Founder-Badge und von dir. Die Vorschau ignoriert das.',
    subDurationX2: 'Sub-Emotes 2× länger',
    subDurationX2Tip:
      'Emotes von Chattern mit Sub- oder Founder-Badge und von dir bleiben doppelt so lange auf dem Screen.',
    showAllEmotes: 'Alle Emotes zeigen',
    showAllEmotesTip:
      'Zeigt auch Emotes aus normalen Textnachrichten, bis zu 5 pro Nachricht. Die Vorschau ignoriert das.',
    hypeMode: 'Hype-Modus',
    hypeModeTip:
      'Ein Emote erscheint erst, wenn es 2 oder mehr verschiedene Chatter innerhalb von 15 Sekunden schicken, und dann höchstens alle 15 Sekunden einmal. Die Vorschau ignoriert das.',
    spamBlock: 'Emote-Spam blocken',
    spamBlockTip:
      'Schickt ein Chatter mehr als 3 Emote-Nachrichten in 10 Sekunden, werden die zusätzlichen übersprungen. Dasselbe Emote mehr als zweimal in 10 Sekunden überspringt nur dieses Emote. Die Vorschau ignoriert das.',
    previewTitle: 'Vorschau der Emote-Wand',
    previewIframeTitle: 'Vorschau der Emote-Wand',
    previewHint: 'Die Vorschau zeigt Beispiel-Emotes. Im Stream kommen die Emotes aus deinem Chat.',
    widgetUrlTip:
      'Schon ein Widget gebaut? Füg seine URL hier ein, um deine Einstellungen zu laden und nur das zu ändern, was du brauchst.',
    widgetUrlPlaceholder: 'Bestehende Widget-URL zum Bearbeiten einfügen',
    widgetUrlInvalid: 'Das ist keine Emote-Wand-URL.',
    guideTitle: 'Einrichtung in der Streaming-Software (OBS, Streamlabs, XSplit usw.)',
    guideStep1:
      'Füge in deiner Streaming-Software eine Browser-Quelle hinzu (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio usw.).',
    guideStep2: 'Füge die kopierte Emote-Wand-URL ein.',
    guideStep3:
      'Stell Breite und Höhe auf deine volle Canvas-Größe (z. B. 1920×1080) und leg sie über dein Gameplay.',
    browserSourceHintSize: ' (empfohlene Größe: 1920×1080, volle Canvas).',
    faq1Q: 'Welche Nachrichten lösen ein fliegendes Emote aus?',
    faq1A:
      'Nachrichten, die nur aus Emotes bestehen, wie ein einzelnes Kappa, eine Reihe Emotes oder ein Mix aus Twitch-, Kick- und 7TV-Emotes. Normale Textnachrichten werden ignoriert, außer Alle Emotes zeigen ist an.',
    faq2Q: 'Muss ich mich für die Emote-Wand anmelden?',
    faq2A:
      'Nein, kein Login nötig. Die Emote-Wand liest den öffentlichen Chat beider Plattformen anonym mit.',
  },
  plants: {
    classic: 'Klassischer Spross',
    rose: 'Rose',
    sunflower: 'Sonnenblume',
    cactus: 'Kaktus',
    tulip: 'Tulpe',
    pine: 'Kiefer',
    lotus: 'Lotus',
    lily: 'Lilie',
    palm: 'Palme',
    vine: 'Kletterranke',
    waterOff: 'Aus',
    waterRain: 'Regen',
    waterSparkle: 'Glitzer',
  },
  guides: {
    breadcrumb: 'Anleitungen',
    eyebrow: 'Anleitung',
    published: 'Veröffentlicht am {date}',
    onThisPage: 'Auf dieser Seite',
    covers: 'Behandelte Tools',
    relatedTitle: 'Passende Anleitungen',
    readGuide: 'Zur Anleitung',
    allGuides: 'Alle Anleitungen',
    openSetup: 'Zur Setup-Seite',
    index: {
      title: 'Anleitungen',
      lead: 'Jede Anleitung beantwortet eine Frage Schritt für Schritt: ein Widget zu OBS hinzufügen, Twitch- und Kick-Chat zusammenführen, den Chat in einem OBS-Dock lesen, Stream-Alerts einrichten, einen Subathon Timer starten, eine Chat-Umfrage starten, Kamera und Chat einrahmen, bis zum Stream-Start herunterzählen, eine Verlosung im Chat starten und Szenen aus dem Chat wechseln. Alle drehen sich um kostenlose Tools ohne Login.',
      listLabel: 'Alle Anleitungen',
      moreText:
        'Allgemeine Fragen beantwortet die [FAQ](/faq). Was sich geändert hat, steht im [Changelog](/changelog).',
    },
    obs: {
      title: 'So fügst du ein Senchabot-Widget als Browser-Quelle in OBS hinzu',
      short: 'Widget zu OBS hinzufügen',
      summary:
        'Die Schritte für eine Browser-Quelle, die richtige Größe für jedes Widget, zwei Einstellungen, die aus bleiben sollten, und was du prüfst, wenn das Widget leer aussieht.',
      lead: 'Senchabot-Widgets kommen als Browser-Quelle in OBS: Klick im Dock Quellen auf +, wähl Browser, füg die URL von der Setup-Seite ins Feld URL ein und stell Breite und Höhe auf die empfohlene Größe des Widgets. Du musst dich nirgends einloggen und nichts herunterladen, und der Hintergrund ist schon transparent.',
      add: {
        title: 'Wie fügst du in OBS eine Browser-Quelle hinzu?',
        intro:
          'Wenn du auf der Setup-Seite deinen Kanalnamen eingegeben und auf Kopieren geklickt hast, geht es in OBS Studio so weiter:',
        step1: 'Wähl die Szene, in der das Widget erscheinen soll.',
        step2: 'Klick im Dock Quellen auf + und wähl Browser aus der Liste.',
        step3: 'Gib der Quelle einen Namen, z. B. „Chat-Box“, und klick auf OK.',
        step4:
          'Lösch im Eigenschaften-Fenster, das sich öffnet, den Inhalt im Feld URL und füg die kopierte Widget-URL ein.',
        step5: 'Trag die Werte aus der Tabelle unten in die Felder Breite und Höhe ein.',
        step6: 'Klick auf OK und zieh die Quelle in der Szene dorthin, wo du sie haben willst.',
        note: 'Die [Setup-Seite der Chat-Box](/setup/chat-widget) zeigt dir diese Schritte samt empfohlener Größe, wenn du die URL kopierst. Wenn du auf Nummer sicher gehen willst, öffne die URL vorher in einem normalen Browser-Tab und prüf, ob sie läuft.',
      },
      size: {
        title: 'Welche Größe sollte jedes Widget haben?',
        intro:
          'Jedes Widget hat eine empfohlene Quellengröße. Trag diese Werte in OBS in die Felder Breite und Höhe ein.',
        caption: 'Empfohlene Größen der Browser-Quelle für Senchabot-Widgets',
        colWidget: 'Widget',
        colSize: 'Breite × Höhe',
        colNote: 'Hinweis',
        notSource: 'Keine Quelle',
        notes: {
          chatBox:
            'Eine vertikale Chat-Spalte. In eine größere Quelle passen mehr Nachrichten, der Text bleibt gleich groß.',
          emoteWall: 'Eine volle 1080p-Canvas. Emotes tauchen überall auf dem Screen auf.',
          subSprout: 'Pflanze und Topf wachsen innerhalb dieser Fläche.',
          frames:
            '640x360 für eine Kamera, 420x720 für den Chat, 1920x1080 für den Screen. Der Rahmen passt sich jeder Größe an.',
          goal: 'Ein breiter Streifen für den Zielbalken, mit Platz darüber für die aufsteigenden +1.',
          subathon: 'Ein breiter Streifen für Lebensbalken, Uhr oder Ring. Eine größere Quelle skaliert ihn hoch.',
          countdown:
            'Eine volle 1080p-Canvas, damit die Uhr mittig in deiner Start- oder BRB-Szene landet.',
          poll: 'Platz für eine Umfrage mit bis zu 6 Optionen. Sie sitzt oben oder unten und wächst mit den Optionen.',
          streamAlerts:
            'Ein Alert nach dem anderen, in der Mitte dieser Fläche. Eine größere Quelle skaliert ihn hoch.',
          raffle:
            'Das Gewinner-Overlay. Konfetti schießt von beiden Seiten des Screens, und der Name des Gewinners erscheint in der Mitte.',
          obsBridge: 'Kein sichtbares Overlay. Lass das Tool in einem Browser-Tab oder einem OBS-Dock offen.',
        },
        fontNote:
          'Um den Text der Chat-Box größer zu machen, zieh nicht die Quelle größer. Nimm die Einstellung Schriftgröße auf der Setup-Seite: 8 bis 72 Pixel, standardmäßig 18.',
      },
      transparent: {
        title: 'Musst du etwas tun, damit der Hintergrund transparent ist?',
        p1: 'Nein. Chat-Box, Emote-Wand, Sub Sprout, Subathon Timer, Stream-Alerts, Sub-Ziel, Stream-Rahmen, Stream-Countdown, Chat-Umfrage, Socials und das Overlay der Verlosung werden auf transparentem Hintergrund gezeichnet. Du brauchst keinen Chroma Key und keinen Filter, und das Feld Benutzerdefiniertes CSS in OBS kannst du lassen, wie es ist.',
        p2: 'Ist die Chat-Box auf einer hellen Szene schwer lesbar, schalt Dunkler Hintergrund ein. Das legt eine halbtransparente schwarze Ebene hinter das Widget, und die Deckkraft stellst du irgendwo zwischen 0 % und 100 % ein (standardmäßig 50 %). Soll jede Nachricht ihre eigene Box haben, schalt Box pro Nachricht ein.',
      },
      settings: {
        title:
          'Sollen „Deaktivieren, wenn Quelle nicht sichtbar ist“ und „Browser bei Szenenaktivierung aktualisieren“ an sein?',
        intro:
          'Lass bei Senchabot-Widgets beide aus. Beide laden die Seite komplett neu, und das Widget vergisst alles, was es bis dahin angezeigt hat:',
        chatBox:
          'Chat-Box: Nachrichten kommen nur rein, solange die Quelle läuft. Wird die Quelle deaktiviert und kommt zurück, startet der Screen leer und zeigt nur neue Nachrichten.',
        subSprout:
          'Sub Sprout: Die Pflanze wird in OBS gespeichert, behält bei einem Neuladen also ihre erreichte Stufe, aber Subs, die reinkommen, während die Quelle aus ist, lassen sie nicht wachsen.',
        goal: 'Sub-Ziel: Die Zahl wird in OBS gespeichert, geht bei einem Neuladen also nicht verloren, aber Subs, die reinkommen, während die Quelle aus ist, werden nicht gezählt.',
        poll: 'Chat-Umfrage: Die Umfrage und ihre Stimmen werden in OBS gespeichert, gehen bei einem Neuladen also nicht verloren, aber Stimmen, die geschrieben werden, während die Quelle aus ist, zählen nicht.',
        subathon:
          'Subathon Timer: Die Restzeit wird in OBS gespeichert, geht bei einem Neuladen also nicht verloren. Der Timer zählt weiter runter, während die Quelle aus ist, sieht aber keine Subs, die in der Zeit reinkommen.',
        streamAlerts:
          'Stream-Alerts: Nur Subs, Gifts, Cheers und Raids, die reinkommen, während die Quelle läuft, bekommen einen Alert. Alles, was kommt, während sie aus ist, geht verloren.',
        raffle:
          'Overlay der Verlosung: Nur das Overlay, das in dem Moment offen ist, bekommt den Gewinner. Ein Gewinner, der gezogen wird, während die Quelle aus ist, erscheint nie auf dem Screen.',
        emoteWall:
          'Emote-Wand: Emotes bleiben standardmäßig 5 Sekunden, ein Neuladen kostet dich also nichts, bringt aber auch nichts.',
        refresh:
          'Hängt ein Widget, doppelklick die Quelle und klick im Eigenschaften-Fenster auf „Cache der aktuellen Seite aktualisieren“. Das lädt die Seite einmal neu.',
      },
      update: {
        title: 'Wie ändere ich ein Widget später?',
        p1: 'Deine Einstellungen stecken in der Widget-URL, eine geänderte Einstellung heißt also eine neue URL. Ändere die Einstellung auf der Setup-Seite, kopier die neue URL, doppelklick dann die Quelle in OBS und füg sie im Feld URL über der alten URL ein.',
        p2:
          'Bei [Chat-Box](/setup/chat-widget), [Emote-Wand](/setup/emote-wall), [Sub Sprout](/setup/sub-growing-plant), [Subathon Timer](/setup/subathon-timer), [Stream-Alerts](/setup/stream-alerts), [Sub-Ziel](/setup/sub-goal), [Chat-Umfrage](/setup/chat-poll), [Stream-Rahmen](/setup/stream-frames), [Socials](/setup/socials) und [Stream-Countdown](/setup/stream-countdown) musst du nicht von vorn anfangen. Füg deine aktuelle URL auf der Setup-Seite ins Feld Widget-URL ein, und deine Kanäle und alle Einstellungen sind wieder da. Ändere, was du willst, und kopier die neue URL.',
        p3: 'OBS Bridge hat kein Feld zum Einfügen, gib deine Einstellungen also auf der Setup-Seite nochmal ein und kopier die neue Tool-URL. Szenenwahl und berechtigte Nutzer kannst du auch direkt auf der Tool-Seite ändern und die neue URL mit dem Button Aktuelle URL kopieren holen. Alte URLs funktionieren weiter, du musst sie also nicht austauschen.',
      },
      troubleshoot: {
        title: 'Was tun, wenn das Widget in OBS nicht erscheint?',
        intro:
          'Meistens liegt es am Kanalnamen. Geh diese Punkte der Reihe nach durch.',
        linkTitle: 'Hast du einen Link statt des Kanalnamens eingegeben?',
        linkBody:
          'Gib ins Kanalfeld nur den Namen ein: `senchabot` für twitch.tv/senchabot. Fügst du den ganzen Link ein, hält das Widget den Link für den Kanalnamen und kann sich mit keinem Chat verbinden.',
        channelTitle: 'Gibt es den Kanal wirklich?',
        channelBody:
          'Prüf den Namen auf Tippfehler. Ein Kanal, den es auf Twitch nicht gibt, wirft keinen Fehler. Das Widget bleibt einfach leer.',
        quietTitle: 'Ist im Chat schon was passiert?',
        quietBody:
          'Chat-Box und Emote-Wand bleiben komplett leer und transparent, bis im Chat etwas passiert. Schreib eine Nachricht in den Chat. Für die Emote-Wand muss es standardmäßig eine Nachricht nur aus Emotes sein, aber mit Alle Emotes zeigen zählen auch Emotes in normalen Nachrichten. Das Overlay der Verlosung erscheint ebenfalls erst, wenn ein Gewinner gezogen wird, und verschwindet nach 10 Sekunden. Sub Sprout und Subathon Timer sind dagegen sofort zu sehen.',
        kickTitle: 'Kick-Kanal nicht gefunden?',
        kickBody:
          'Beim Öffnen sucht das Widget den Kick-Kanal auf kick.com. Klappt das nicht (falscher Name, den Kanal gibt es nicht oder Kick antwortet nicht), kommen keine Kick-Nachrichten rein. Gib deinen Kick-Namen genau so ein, wie er in der URL auf kick.com steht.',
        tabTitle: 'Läuft die URL im Browser?',
        tabBody:
          'Öffne die URL in einem normalen Browser-Tab. Läuft sie dort, aber nicht in OBS, prüf das Feld URL und die Größe der Quelle.',
      },
      ctaTitle: 'Such dir dein Widget aus und hol dir die URL',
      ctaText: 'Jede Setup-Seite gibt dir eine fertige URL, die du in OBS einfügst.',
    },
    chat: {
      title: 'So zeigst du Twitch- und Kick-Chat zusammen in OBS',
      short: 'Twitch- und Kick-Chat zusammen',
      summary:
        'Beide Chats mit einer Chat-Box-URL zusammenlegen, zeigen, woher jede Nachricht kommt, Emotes, Bots ausblenden und der horizontale Modus für eine Leiste unten.',
      lead: 'Die Chat-Box legt Twitch- und Kick-Chat in einer einzigen Browser-Quelle zusammen. Wähl auf der Setup-Seite unter Plattformen Beide, gib beide Kanalnamen ein und füg die eine URL, die du bekommst, mit 400 × 600 in OBS ein. Kein Login nötig, beide Chats werden anonym gelesen.',
      setup: {
        title: 'Wie legst du Twitch- und Kick-Chat in einem Overlay zusammen?',
        step1: 'Öffne die [Setup-Seite der Chat-Box](/setup/chat-widget).',
        step2: 'Wähl unter Plattformen Beide. Das ist schon der Standard.',
        step3: 'Gib nur die Kanalnamen in die Felder Twitch-Kanal und Kick-Kanal ein.',
        step4: 'Pass den Look an. Die Vorschau zeigt jede Änderung sofort.',
        step5: 'Kopier die Widget-URL und füg sie in OBS als Browser-Quelle mit 400 × 600 hinzu.',
        p1: 'Die URL enthält beide Kanäle, z. B. `/widgets/chat-widget?twitch=yourchannel&kick=yourchannel`. Du brauchst keine eigene Quelle pro Plattform.',
        p2: 'Die Vorschau spielt immer einen Beispiel-Chat ab. So siehst du, wie deine Einstellungen im Stream aussehen, ohne dass jemand in deinem Kanal schreibt.',
      },
      restream: {
        title: 'Streamt die Chat-Box mich auf beide Plattformen?',
        p1: 'Nein. Die Chat-Box liest nur den Chat und zeigt ihn auf dem Screen. Sie schickt deinen Stream nicht zu Twitch oder Kick und kann nicht in den Chat schreiben. Um auf beiden Plattformen gleichzeitig zu streamen, brauchst du ein eigenes Multistreaming-Setup. Die Chat-Box bringt in diesem Stream beide Chats zusammen.',
        p2: 'Moderation wirkt auch im Overlay: Gelöschte Nachrichten und Nachrichten von Nutzern, die einen Timeout oder Bann bekommen, verschwinden vom Screen.',
      },
      platform: {
        title: 'Woran erkennst du, ob eine Nachricht von Twitch oder Kick kommt?',
        intro:
          'Wenn beide Plattformen an sind, zeigt die Plattform-Anzeige am Anfang jeder Nachricht, woher sie kommt. Es gibt drei Optionen:',
        icon: 'Plattform-Icon (Standard): das Twitch- oder Kick-Logo.',
        name: 'Plattformname: der Text `[twitch]` oder `[kick]` statt eines Logos.',
        none: 'Plattform ausblenden: gar keine Markierung.',
        stripe:
          'Schalt den Plattform-Farbstreifen ein, dann erscheint links neben jeder Nachricht eine dünne Linie: Lila für Twitch, Grün für Kick. Mit Streifen kannst du die Anzeige für einen cleaneren Look ausblenden. Bei einer hervorgehobenen Nachricht ersetzt die Farbe der Hervorhebung den Streifen.',
      },
      look: {
        title: 'Welche Layouts, Animationen und Schriften gibt es?',
        layoutTitle: 'Nachrichten-Layout',
        inline: 'Inline (Standard): Name und Nachricht in derselben Zeile.',
        stacked: 'Gestapelt: Name oben, Nachricht darunter.',
        card: 'Karte / Blase: Jede Nachricht sitzt in einer halbtransparenten Karte.',
        compact: 'Kompakt: enge Zeilen wie bei Twitch mit etwas kleinerem Text.',
        animationTitle: 'Animation für neue Nachrichten',
        animations:
          'Es gibt acht Optionen: Von rechts gleiten (Standard), Weich von rechts gleiten, Aufploppen / Skalieren, Reinhüpfen, Versetzt, Einblenden, Schreibmaschine und Keine Animation. Wird der Chat schneller, werden alle Animationen außer dem Standard kürzer. Kommen Nachrichten schneller als eine pro halbe Sekunde, schrumpft die Animation auf bis zu ein Drittel ihrer normalen Länge, damit keine mit der nächsten ins Straucheln kommt.',
        fontTitle: 'Schrift und Größe',
        fonts:
          'Inter (Standard), Roboto, Nunito, JetBrains Mono, Source Serif 4 und die Systemschrift. Die Schriftgröße geht von 8 bis 72 Pixel, standardmäßig 18. Namen fett und Nachrichten fett sind getrennte Schalter.',
      },
      duration: {
        title: 'Wie lange bleiben Nachrichten auf dem Screen?',
        p1: 'Standardmäßig 30 Sekunden. Unter Anzeigedauer kannst du 10 Sek., 15 Sek., 30 Sek., 1 Min., 2 Min., 5 Min. oder Für immer wählen.',
        p2: 'Mit Für immer verschwinden Nachrichten nicht: Neue schieben die alten nach oben, was nicht mehr in die Box passt, wird abgeschnitten, und höchstens die letzten 100 Nachrichten bleiben erhalten.',
      },
      emotes: {
        title: 'Welche Emotes werden angezeigt?',
        intro:
          'Die eigenen Emotes von Twitch und Kick erscheinen immer als Bild. Dazu kannst du im Menü Emotes drei Anbieter an- oder ausschalten, und alle drei sind standardmäßig an.',
        caption: 'Plattformen, die jeder Emote-Anbieter in der Chat-Box unterstützt',
        colProvider: 'Anbieter',
        colPlatforms: 'Läuft auf',
        both: 'Twitch und Kick',
        twitchOnly: 'Nur Twitch',
        p1: 'Kanal-Emotes und globale Emotes laden zusammen. Haben zwei Emotes denselben Namen, gewinnt das Kanal-Emote, und die Reihenfolge zwischen den Anbietern ist 7TV, BTTV, FFZ. Bei Kick-Nachrichten nutzt 7TV das Emote-Set, das mit dem Kick-Account des Kanals verknüpft ist. Ist auf 7TV nur dein Twitch-Account verknüpft, nutzen Kick-Nachrichten auch dieses Set. Emotes von einem Anbieter, den du ausschaltest, bleiben normaler Text.',
      },
      filters: {
        title: 'Wie blendest du Bots und Befehle aus?',
        bots: 'Bots ausblenden entfernt Nachrichten von bekannten Bot-Accounts: Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, Sery_Bot, SoundAlerts, StreamlootsBot, KofiStreamBot, PokemonCommunityGame, OWN3D, Blerp, BotRix, KickBot, Kicklet und Senchabot. Accounts mit dem „Chat Bot“-Badge auf Twitch oder dem „Bot“-Badge auf Kick werden auch ausgeblendet.',
        commands:
          'Befehle ausblenden blendet jede Nachricht aus, die mit „!“ anfängt, damit Befehle wie `!discord` oder `!uptime` nicht auf deinem Screen landen. Um auch die Antwort des Bots auf einen Befehl auszublenden, schalt beide Einstellungen ein.',
        highlights:
          'Willst du das Gegenteil und bestimmte Nachrichten hervorheben, nimm Hervorhebungen. Alle fünf sind standardmäßig aus, schalt also einfach die ein, die du willst: Nachrichten, die deinen Kanal taggen oder dir antworten, die Zeile über einer Antwort, die zeigt, wem geantwortet wird, neue Chatter, Ankündigungen und Nachrichten mit Meine Nachricht hervorheben. Die letzten drei gibt es nur auf Twitch, weil Kick diese Infos nicht schickt.',
      },
      horizontal: {
        title: 'Wie legst du den Chat als Leiste unten an den Screen?',
        p1: 'Stell Ausrichtung auf Horizontal. Die Nachrichten reihen sich nebeneinander auf, die neueste erscheint rechts, und ältere rutschen nach links aus der Box.',
        p2: 'Die 400 × 600 sind für vertikal gedacht. Für eine horizontale Leiste stellst du die Breite der Quelle auf die Länge der Leiste und die Höhe auf eine Nachrichtenzeile und platzierst die Quelle unten am Screen.',
      },
      others: {
        title: 'Welche anderen Widgets hören auf beide Plattformen zusammen?',
        p1: '[Emote-Wand](/setup/emote-wall), [Sub Sprout](/setup/sub-growing-plant), [Subathon Timer](/setup/subathon-timer), [Stream-Alerts](/setup/stream-alerts), [Sub-Ziel](/setup/sub-goal) und [Chat-Umfrage](/setup/chat-poll) nehmen auch beide Kanäle in einer URL. Die Emote-Wand lässt Emote-Nachrichten aus beiden Chats über den Screen fliegen. Sub Sprout wächst mit Subs auf beiden Plattformen, Gift-Subs auf Kick inklusive. Der Subathon Timer gibt Zeit für Subs, Gift-Subs, Bits und Kicks aus beiden Chats. Die Stream-Alerts zeigen einen Alert für Subs, Gift-Subs, Bits, Kicks und Raids von beiden. Das Sub-Ziel zählt Subs und Gift-Subs aus beiden Chats zusammen. Die Chat-Umfrage packt Stimmen aus beiden Chats in ein Ergebnis.',
        p2: 'Die [Verlosung](/setup/raffle) läuft dagegen immer auf einer Plattform: Twitch oder Kick.',
      },
      ctaTitle: 'Chat-Box einrichten',
      ctaText: 'Kanalnamen eingeben, URL kopieren, in OBS einfügen. Kein Login, kein Download.',
      ctaSecondary: 'Emote-Wand ansehen',
    },
    raffle: {
      title: 'So machst du ein Chat-Giveaway auf Twitch oder Kick',
      short: 'Chat-Giveaway machen',
      summary:
        'Mitmachen mit !join, Verlosungen nur für Subs, Gewinnlimits, Mindestdauer und den Gewinner mit Konfetti im Stream zeigen, alles mit dem Verlosungs-Tool.',
      lead: 'Mit dem Verlosungs-Tool machen Zuschauer mit, indem sie ein Keyword in den Chat schreiben, und du ziehst den Gewinner mit einem Klick. Das Standard-Keyword ist `!join`. Kein Login nötig, Teilnehmer und Gewinner werden in deinem eigenen Browser gespeichert.',
      start: {
        title: 'Wie startest du eine Verlosung?',
        step1:
          'Öffne die [Verlosungsseite](/setup/raffle) und wähl die Plattform: Twitch oder Kick. Eine Verlosung läuft auf einer Plattform.',
        step2: 'Gib den Kanalnamen ein. Die Teilnehmer werden aus dem Chat dieses Kanals gelesen.',
        step3:
          'Leg das Keyword fest. Standard ist `!join`, und du kannst es in jedes Wort ändern, das du willst.',
        step4:
          'Wähl deine Regeln und klick auf Verlosung starten. Der Button bleibt gesperrt, solange das Keyword leer ist.',
        step5:
          'Wer mitmacht, erscheint in der Liste. Hast du genug Teilnehmer, klick auf Gewinner ziehen.',
        p1: 'Beim Start werden die Einstellungen gesperrt, damit sich die Regeln mittendrin nicht ändern. Um die Teilnahme zu beenden, klick auf Teilnahme schließen. Einen Gewinner kannst du danach trotzdem ziehen. Eine neue Verlosung leert die Teilnehmerliste, deshalb fragt die Seite vorher nach.',
      },
      entry: {
        title: 'Wie machen Zuschauer bei der Verlosung mit?',
        p1: 'Zuschauer schreiben das Keyword in den Chat. Groß- und Kleinschreibung ist egal, und die Nachricht darf weitergehen, solange sie mit dem Keyword anfängt: `!join` und `!join viel Glück` zählen, `hey !join` nicht.',
        p2: 'Jede Person macht einmal mit. Den Befehl nochmal zu schreiben, gibt keine zweite Chance.',
        p3: 'Bekannte Bots können gar nicht mitmachen: Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, BotRix, SoundAlerts, Blerp, Kofi_Stream_Bot und Senchabot. Um jemanden von Hand aus der Liste zu nehmen, klick auf das ✕ neben seinem Namen.',
      },
      rules: {
        title: 'Welche Regeln kannst du festlegen?',
        caption: 'Regeln, Optionen und Standardwerte der Verlosung',
        colRule: 'Regel',
        colOptions: 'Optionen',
        colDefault: 'Standard',
        subsOnly: 'Nur Subs',
        subsOnlyOptions: 'An oder aus',
        subsOnlyDefault: 'Aus',
        minMonths: 'Mindest-Sub-Monate',
        minMonthsOptions: '1 oder mehr, nur wenn Nur Subs an ist',
        minMonthsDefault: '1',
        maxWins: 'Max. Gewinne pro Zuschauer',
        maxWinsOptions: '1 bis 5 oder unbegrenzt',
        maxWinsDefault: '1',
        minDuration: 'Mindestdauer',
        minDurationOptions: '0 bis 300 Sekunden',
        minDurationDefault: '15 Sekunden',
        subsText:
          'Mit Nur Subs kann niemand ohne Sub-Badge mitmachen. Der Streamer zählt auch als Sub, du kannst also bei deiner eigenen Verlosung mitmachen, solange Mindest-Sub-Monate auf 1 steht. Bei 1 kann jeder Sub mitmachen. Stellst du es auf 6, kommen nur Leute rein, die seit mindestens 6 Monaten Sub sind. Auf Twitch und Kick wird die Sub-Dauer aus dem Sub-Badge des Zuschauers gelesen.',
        winsText:
          'Ein gezogener Gewinner fliegt aus der Teilnehmerliste und landet in der Gewinnerliste. Ist das Limit 1, kann er in derselben Verlosung nicht nochmal gewinnen. Ist das Limit höher oder unbegrenzt, kann er wieder mitmachen, indem er das Keyword nochmal schreibt.',
        durationText:
          'Der Button Gewinner ziehen bleibt gesperrt, bis seit dem Start so viel Zeit vergangen ist, und zeigt die restlichen Sekunden. So haben auch Zuschauer, die es spät sehen, Zeit mitzumachen.',
        fairText:
          'Der Gewinner wird aus den gültigen Teilnehmern mit dem sicheren Zufallszahlengenerator des Browsers (`crypto.getRandomValues`) gezogen.',
      },
      storage: {
        title: 'Verliere ich die Verlosung, wenn ich die Seite neu lade?',
        p1: 'Nein. Einstellungen, Teilnehmer und Gewinner werden im lokalen Speicher des Browsers (localStorage) gespeichert. Auch wenn du neu lädst oder die Seite schließt und wieder öffnest, machst du genau da weiter, wo du aufgehört hast.',
        p2: 'Diese Daten liegen nur in diesem Browser, auf einem anderen PC oder in einem anderen Browser tauchen sie also nicht auf. Solange die Seite zu ist, wird der Chat nicht gelesen, Befehle aus dieser Zeit zählen also nicht. Zum Neustart nimm Alles zurücksetzen. Du kannst auch nur die Teilnehmer oder nur die Gewinner leeren.',
      },
      overlay: {
        title: 'Wie zeigst du den Gewinner im Stream?',
        p1: 'Füg die Gewinner-Overlay-URL von der Verlosungsseite (`/widgets/raffle-overlay`) in OBS als 1920 × 1080-Browser-Quelle hinzu. Klickst du auf Gewinner ziehen, zeigt das Overlay den Namen des Gewinners in der Mitte des Screens, Konfetti schießt 3 Sekunden lang von beiden Seiten, und nach 10 Sekunden verschwindet der Name.',
        warnTitle: 'Teste es immer vor dem Livegang',
        warn: 'Der Gewinner kommt per BroadcastChannel zum Overlay, und das funktioniert nur innerhalb desselben Browsers. Öffnest du die Verlosungsseite in einem eigenen Browser wie Chrome und fügst das Overlay in OBS hinzu, laufen die beiden in verschiedenen Apps, und der Gewinner kommt nie in OBS an. Mach vor dem Livegang eine Testverlosung und prüf, ob der Gewinner in OBS erscheint.',
        p2: 'Lass die Szene mit dem Overlay aktiv und „Deaktivieren, wenn Quelle nicht sichtbar ist“ an der Quelle aus. Eine deaktivierte Quelle verpasst den Gewinner. Details stehen in der [OBS-Anleitung](/guides/obs-browser-source). Auf der Verlosungsseite erscheint der Gewinner außerdem immer mit Konfetti, du kannst den Namen also dort ablesen, selbst wenn das Overlay nicht klappt.',
      },
      ctaTitle: 'Mach deine Verlosung bereit',
      ctaText:
        'Plattform wählen, Kanal eingeben, Keyword festlegen. In einer Minute ist deine erste Verlosung startklar.',
    },
    bridge: {
      title: 'So lässt du Mods OBS-Szenen aus dem Chat wechseln',
      short: 'Szenen aus dem Chat wechseln',
      summary:
        'WebSocket für OBS Bridge aktivieren, Chatbefehle, wie !scene eine Szene findet und wer die Befehle nutzen darf.',
      lead: 'OBS Bridge hört dem Twitch- oder Kick-Chat zu und gibt Befehle von den Leuten, die du berechtigst, an OBS auf deinem PC weiter. Aktiviere in OBS den WebSocket-Server, trag auf der Setup-Seite deinen Kanal und die berechtigten Nutzer ein und lass die Tool-URL, die du bekommst, offen. Schreibt ein Mod `!scene game`, wechselt OBS zu einer Szene mit „game“ im Namen.',
      websocket: {
        title: 'Wie aktivierst du WebSocket in OBS?',
        step1: 'Öffne in OBS im oberen Menü Werkzeuge → WebSocket-Servereinstellungen.',
        step2: 'Hak das Kästchen WebSocket-Server aktivieren an.',
        step3: 'Ist Authentifizierung aktivieren an, klick auf Verbindungsinformationen anzeigen und kopier das Passwort.',
        step4: 'Klick auf OK.',
        p1: 'OBS Bridge spricht mit obs-websocket 5, das ab OBS Studio 28 schon eingebaut ist. Standardmäßig verbindet es sich mit `ws://127.0.0.1:4455`. Läuft OBS auf demselben PC, lass das Feld WebSocket-URL leer. Läuft OBS auf einem anderen PC, trag dessen Adresse und Port ein, z. B. `ws://192.168.1.20:4455`. Klappt die Verbindung nicht, versucht es das Tool alle 5 Sekunden nochmal.',
      },
      setup: {
        title: 'Wie richtest du OBS Bridge ein?',
        step1: 'Öffne die [Setup-Seite von OBS Bridge](/setup/obs-bridge).',
        step2: 'Gib den Twitch-Kanal, den Kick-Kanal oder beide ein, auf die es hören soll.',
        step3: 'Füg Berechtigte Nutzer hinzu. Wen du hinzufügen solltest, steht weiter unten.',
        step4: 'Gib dein OBS-WebSocket-Passwort ein und ändere die WebSocket-URL, falls nötig.',
        step5: 'Kopier die Tool-URL und öffne sie in einem Browser-Tab oder als benutzerdefiniertes Browser-Dock in OBS.',
        step6:
          'Die Tool-Seite listet deine OBS-Szenen auf. Klick auf die Buttons Main und BRB neben den Szenen, die du als Main und BRB nutzen willst.',
        p1: 'Wählst du keine, sucht es nach Szenen namens `Main Scene` für Main und `BRB Scene` für BRB. Deine Auswahl wird in der URL der Tool-Seite gespeichert, kopier die URL nach der Wahl also nochmal und heb sie irgendwo auf. Beim nächsten Öffnen laden dieselben Szenen.',
      },
      commands: {
        title: 'Welche Chatbefehle gibt es?',
        caption: 'Standard-Chatbefehle von OBS Bridge',
        colCommand: 'Befehl',
        colAction: 'Was er macht',
        sceneArg: '<Szenenname>',
        scene: 'Wechselt zur Szene mit passendem Namen',
        brb: 'Wechselt zur BRB-Szene',
        back: 'Wechselt zur Main-Szene',
        stream: 'Startet / beendet den Stream',
        record: 'Startet / stoppt die Aufnahme',
        p1: '`brb` und `back` schreibt man ohne Ausrufezeichen. Groß- und Kleinschreibung ist egal, aber die ganze Nachricht muss der Befehl sein: `brb` geht, `brb 5 min` nicht. Unter Befehle auf der Setup-Seite kannst du jeden Befehl umbenennen, z. B. `!switch` statt `!scene`.',
        p2: 'Der Befehl zum Beenden beendet deinen Stream wirklich. Halt die Liste der Berechtigten kurz.',
      },
      matching: {
        title: 'Wie findet der Befehl !scene die richtige Szene?',
        p1: 'Zuerst sucht er einen exakten Treffer: `!scene game` wechselt zur Szene, die genau „Game“ heißt, Groß- und Kleinschreibung egal. Ohne exakten Treffer nimmt er die erste Szene mit diesem Wort im Namen: `!scene chatting` findet die Szene „Just Chatting“. Passt keine Szene, passiert nichts.',
        p2: 'Enthalten mehrere Szenen dasselbe Wort, gewinnt die, die in deiner Liste Szenen am weitesten oben steht. Bei ähnlich benannten Szenen ist der volle Name die sicherste Wahl. Fügst du eine Szene hinzu oder benennst sie um, aktualisiert sich die Liste von selbst.',
      },
      users: {
        title: 'Wer darf die Befehle nutzen?',
        p1: 'Nur die Leute auf der Liste Berechtigte Nutzer. Ist die Liste leer, kann niemand Befehle nutzen, nicht mal der Streamer, du musst also auch deinen eigenen Account hinzufügen.',
        p2: 'Jeder Nutzer wird mit Plattform hinzugefügt und steht in der URL als `commandUser=twitch:bob,kick:alice`. Eine Nachricht zählt nur als Befehl, wenn Plattform und Name passen. So kann jemand, der sich auf Kick den Namen eines Twitch-Mods schnappt, trotzdem keine Szenen wechseln.',
        p3: 'Alte Namen ohne Plattform (nur `bob`) funktionieren auf dieser Plattform, wenn die URL nur eine Plattform einrichtet. Sind beide Plattformen an, werden diese Namen auf der Tool-Seite gelb markiert und können keine Befehle nutzen, bis du ihnen eine Plattform gibst.',
      },
      open: {
        title: 'Muss die Tool-Seite offen bleiben?',
        p1: 'Ja. Die Tool-Seite liest den Chat und gibt die Befehle an OBS weiter. Schließt du den Tab, funktionieren die Befehle nicht mehr. Lass das Tool den ganzen Stream über in einem Tab oder als Dock in OBS offen. Bricht die Verbindung zu OBS ab, versucht das Tool alle 5 Sekunden, sich neu zu verbinden.',
      },
      security: {
        title: 'Warum solltest du die Tool-URL wie ein Passwort behandeln?',
        p1: 'Weil dein OBS-WebSocket-Passwort in der URL steht (der Parameter `obsWebsocketPassword`). Wer die URL teilt, teilt sein Passwort. Zeig sie nicht im Stream, poste sie nicht im Chat und blende die Adressleiste aus, wenn du deinen Screen teilst.',
        p2: 'Die Verbindung zu OBS geht direkt von deinem Browser zu OBS. Die Tool-Seite selbst lädt wie jede Website von extensions.senchabot.com, die komplette Adresse samt Passwort geht also mit dieser Anfrage mit.',
      },
      ctaTitle: 'OBS Bridge einrichten',
      ctaText:
        'Trag deinen Kanal und die berechtigten Nutzer ein und öffne die Tool-URL. Die Szenenbefehle laufen sofort.',
    },
    subathon: {
      title: 'So machst du einen Subathon Timer für Twitch und Kick',
      short: 'Subathon Timer nutzen',
      summary:
        'Wie viel Zeit jeder Sub, jedes Gift, jeder Bits-Cheer und jedes Kicks-Gift bringt, der Start mit !subathon, Mod-Befehle und was passiert, wenn OBS schließt oder die Zeit abläuft.',
      lead: 'Der Subathon Timer ist ein Countdown, den Subs verlängern. Leg eine Startzeit fest und wie viel jeder Sub, Gift-Sub, Bits-Cheer und jedes Kicks-Gift bringt, füg die URL in OBS als 800 × 300-Browser-Quelle hinzu und schreib `!subathon start` in den Chat, wenn du live gehst. Kein Login nötig, er liest deinen öffentlichen Twitch- und Kick-Chat.',
      setup: {
        title: 'Wie richtest du einen Subathon Timer ein?',
        step1: 'Öffne die [Setup-Seite des Subathon Timers](/setup/subathon-timer).',
        step2: 'Wähl Twitch, Kick oder Beide und gib nur die Kanalnamen ein.',
        step3: 'Stell die Startzeit ein, standardmäßig 1 Stunde, und wenn du willst ein Zeitlimit.',
        step4:
          'Leg fest, wie viel Zeit ein Sub, ein Gift-Sub, Bits und Kicks bringen. Mit Beide bekommen Twitch und Kick jeweils einen eigenen Tab.',
        step5:
          'Wähl Stil und Farbe, kopier die URL und füg sie in OBS als Browser-Quelle mit 800 × 300 hinzu.',
        p1: 'Die Vorschau auf der Setup-Seite spielt simulierte Subs, Gifts und Cheers mit 60-facher Geschwindigkeit ab, ein Timer von einer Stunde ist also in etwa einer Minute durch. Das Tempo stellst du von 1× bis 300× ein. Die Buttons unter Probier es aus geben einen Sub, 5 Gift-Subs oder 500 Bits/Kicks dazu, ziehen 10 Minuten ab, pausieren und setzen zurück. Sie ändern nur die Vorschau, nie den Timer in OBS.',
      },
      values: {
        title: 'Wie viel Zeit bringt jeder Sub?',
        intro:
          'Du legst die Zeit in ganzen Minuten fest, von 0 bis 60, und 0 schaltet das Event aus. Twitch und Kick haben eigene Werte, standardmäßig alle 1 Minute. Auf dem Timer zeigen, standardmäßig an, listet sie auf dem Timer auf, z. B. Sub +1 Min., damit die Zuschauer wissen, was ihr Sub bringt. Geben Twitch und Kick unterschiedlich viel Zeit, wechseln sich die beiden ab.',
        caption: 'Zeit, die jedes Event zum Subathon Timer hinzufügt',
        colEvent: 'Event',
        colDefault: 'Standard',
        colHow: 'So zählt es',
        oneMinute: '1 Min.',
        sub: 'Sub',
        subHow: 'Jeder neue Sub und Resub. Auf Twitch zählt ein Prime-Sub als Tier 1.',
        gift: 'Gift-Sub',
        giftHow: 'Jeder Sub im Gift, 5 Gift-Subs bringen also fünfmal so viel.',
        bits: '500 Bits oder 500 Kicks',
        bitsHow: 'Andere Mengen zählen anteilig: Bei 1 Minute bringen 100 Bits 12 Sekunden.',
        tiers:
          'Mit Tier 2 und 3 zählen mehr, standardmäßig an, bringt ein Tier-2-Sub oder -Gift auf Twitch doppelt so viel Zeit und Tier 3 fünfmal so viel, passend zum Preis. Kick-Subs haben keine Tiers, jeder zählt also einmal.',
        cap: 'Das Zeitlimit ist die meiste Zeit, die der Timer haben kann. Was darüber hinausgehen würde, wird nicht addiert, und dafür erscheint auch kein +Zeit. Mit Kein Limit, dem Standard, wächst der Timer, solange Subs reinkommen.',
      },
      start: {
        title: 'Wie startest du den Subathon?',
        p1: 'Standardmäßig wartet der Timer pausiert, bis du oder ein Mod `!subathon start` in den Chat schreibt. So kannst du die Quelle vor dem Stream hinzufügen und die Uhr starten, wenn du live bist. Wählst du unter Start die Option Sofort, startet der Timer, sobald die Quelle in OBS lädt.',
        p2: 'Subs vor dem Start geben trotzdem Zeit, und Subs während einer Pause auch. Die Zeit wartet schon, wenn die Uhr losläuft.',
      },
      commands: {
        title: 'Welche Chatbefehle können Mods nutzen?',
        caption: 'Chatbefehle des Subathon Timers',
        colCommand: 'Befehl',
        colAction: 'Was er macht',
        start: 'Startet den Timer oder setzt ihn nach einer Pause fort',
        pause: 'Pausiert ihn, die Restzeit bleibt stehen',
        add: 'Gibt Zeit dazu, bis zum Zeitlimit',
        remove: 'Zieht Zeit ab, bis auf null',
        set: 'Setzt die Restzeit',
        reset: 'Fängt bei der Startzeit neu an',
        p1: 'Nur der Streamer und die Mods können sie nutzen, auf Twitch und auf Kick. VIPs und Zuschauer nicht. Der Timer antwortet nicht im Chat, das Ergebnis siehst du am Timer selbst.',
        p2: 'Zeiten schreibst du wie `10m`, `45s`, `1h30m` oder `1:30:00`. Eine reine Zahl sind Minuten, `!subathon add 15` gibt also 15 Minuten dazu. Einheiten sind einzelne Buchstaben: `10min` geht nicht, `10m` schon.',
      },
      look: {
        title: 'Welche Stile und Farben gibt es?',
        bar: 'Lebensbalken (Standard): ein Balken wie im Game, der sich von 100 % gegen null leert.',
        thin: 'Schmaler Balken: Titel und Restzeit sitzen in einem dünneren Balken.',
        clock: 'Uhr: große Zahlen in Stunden, Minuten und Sekunden.',
        ring: 'Ring: ein Kreis, der sich leert, während die Zeit abläuft.',
        p1: 'Die Standardfarbe Leben wechselt von Grün über Orange zu Rot, wenn die Zeit knapp wird. Du kannst auch eine feste Farbe wählen: Grün, Lila, Rot, Gold, Cyan oder Pink. Der Titel neben dem Timer lautet standardmäßig SUBATHON. Ändere ihn in alles bis 32 Zeichen, oder lass ihn leer, um ihn auszublenden.',
        p2: 'Prozent zeigen zeigt, wie voll der Timer ist. 100 % ist die meiste Zeit, die der Timer bisher hatte, er geht also nie über 100 %: Kommt Zeit zu einem vollen Balken dazu, bleibt er voll und zählt vom neuen Höchststand runter. Zeitbonus zeigen lässt jedes Mal, wenn Zeit dazukommt, ein +1:00 mit dem Namen des Zuschauers über dem Timer aufsteigen.',
      },
      saved: {
        title: 'Was passiert, wenn OBS schließt oder die Quelle neu lädt?',
        p1: 'Der Timer wird in OBS gespeichert, nach einem Neuladen oder OBS-Neustart ist er also wieder da, wo er war. Solange OBS zu ist, zählt er weiter runter, wie eine echte Deadline.',
        p2: 'Solange OBS oder die Quelle aus ist, liest niemand deinen Chat, Subs in dieser Zeit bringen also nichts. Ein Mod kann sie danach mit `!subathon add` nachtragen. Deshalb sollte auch „Deaktivieren, wenn Quelle nicht sichtbar ist“ aus bleiben. Die [OBS-Anleitung](/guides/obs-browser-source) erklärt, warum.',
        p3: 'Der gespeicherte Timer gehört zu diesem OBS und diesen Kanälen. Änderst du die Kanäle in der URL, z. B. indem du mitten im Subathon Kick dazunimmst, oder öffnest die URL in einem anderen OBS oder einem Browser-Tab, startet ein frischer Timer.',
      },
      zero: {
        title: 'Was passiert, wenn der Timer bei null ist?',
        p1: 'Er bleibt bei 00:00:00 stehen und blinkt rot, und die Stile Lebensbalken und Ring zeigen K.O. Neue Subs geben keine Zeit mehr, der Subathon ist also vorbei.',
        p2: 'Um weiterzumachen, schreibt ein Mod `!subathon add` oder `!subathon set` mit einer Zeit, und der Timer läuft sofort wieder. Für einen neuen Subathon schreib `!subathon reset`.',
      },
      change: {
        title: 'Wie änderst du den Timer oder startest einen neuen Subathon?',
        p1: 'Füg deine aktuelle URL auf der Setup-Seite ins Feld Widget-URL ein. Deine Kanäle und Einstellungen sind wieder da. Ändere, was du willst, kopier die neue URL und füg sie in OBS über der alten ein. Neue Zeitwerte und ein neues Zeitlimit gelten, sobald OBS die neue URL lädt, und die Restzeit bleibt, wie sie war.',
        p2: 'Eine neue Startzeit gilt nur von selbst, solange der Timer noch nie gestartet wurde. Danach schreib `!subathon reset` in den Chat, um mit der neuen Startzeit von vorn anzufangen. Steht Start auf dem Befehl, wartet der Timer dann wieder pausiert bis `!subathon start`.',
      },
      notCounted: {
        title: 'Was bringt keine Zeit?',
        follows:
          'Follows und Spenden. Twitch und Kick zeigen neue Follows keiner Seite, die nicht eingeloggt ist, und keine der beiden Plattformen hat eigene Spenden.',
        raids: 'Raids, auf keiner der beiden Plattformen.',
        resubs:
          'Twitch-Resubs, die der Zuschauer nicht teilt. Twitch meldet dem Chat einen Resub nur, wenn der Zuschauer ihn teilt. Kick schickt Verlängerungen als Subs, die zählen also.',
        bits: 'Bits, die außerhalb des Chats ausgegeben werden, z. B. für Power-ups. Nur im Chat gecheerte Bits zählen.',
        sharedChat:
          'Subs und Cheers in einem Partnerkanal während einer Twitch-Shared-Chat-Session. Nur dein eigener Kanal zählt.',
      },
      ctaTitle: 'Richte deinen Subathon Timer ein',
      ctaText: 'Startzeit und Zeit pro Sub festlegen, URL kopieren, in OBS einfügen.',
    },
    poll: {
      title: 'So machst du eine Chat-Umfrage auf Twitch und Kick',
      short: 'Chat-Umfrage starten',
      summary:
        'Eine Umfrage mit !poll starten, wie Zuschauer abstimmen, eine Stimme pro Zuschauer, Stream-Delay und was passiert, wenn die Zeit abläuft oder OBS schließt.',
      lead: 'Die Chat-Umfrage bringt eine Umfrage in deinen Stream, bei der Twitch- und Kick-Chat per Zahl abstimmen. Füg die URL in OBS als 640 × 560-Browser-Quelle hinzu, dann schreibst du oder ein Mod `!poll Frage | A | B` in den Chat. Kein Login und kein Bot: Sie liest deinen öffentlichen Chat.',
      setup: {
        title: 'Wie richtest du eine Chat-Umfrage ein?',
        step1: 'Öffne die [Setup-Seite der Chat-Umfrage](/setup/chat-poll).',
        step2: 'Wähl Twitch, Kick oder Beide und gib nur die Kanalnamen ein.',
        step3:
          'Willst du vor dem Stream schon eine Umfrage parat haben, gib unter Fertige Umfrage eine Frage und 2 bis 6 Optionen ein. Sie startet mit `!poll start`.',
        step4:
          'Stell die Umfragedauer ein (standardmäßig 1 Minute), wie lange die Ergebnisse stehen bleiben und wer abstimmen darf.',
        step5:
          'Wähl Farbe, Position und Umfragesprache, kopier die URL und füg sie in OBS als Browser-Quelle mit 640 × 560 hinzu.',
        p1: 'Die Vorschau auf der Setup-Seite spielt eine Umfrage mit simulierten Stimmen ab, schneller als in Echtzeit, und startet dann die nächste. Die Buttons unter Probier es aus geben 10 Stimmen und 30 Sekunden dazu, beenden die Umfrage und starten eine neue. Sie ändern nur die Vorschau, nie die Umfrage in OBS.',
      },
      commands: {
        title: 'Wie startest du eine Umfrage im Chat?',
        intro:
          'Nur der Streamer und die Mods können Umfragen starten, auf Twitch und auf Kick. VIPs und Zuschauer nicht: Schreibt ein Zuschauer `!poll`, ändert sich nichts.',
        caption: 'Chatbefehle der Chat-Umfrage',
        colCommand: 'Befehl',
        colAction: 'Was er macht',
        question: 'Frage',
        new: 'Startet eine neue Umfrage mit 2 bis 6 Optionen, für die Umfragedauer aus der URL',
        newTime: 'Genauso, mit eigener Dauer: 90s, 2m, 1m30s oder 1:30',
        yesNo: 'Startet eine schnelle Umfrage mit Ja und Nein als Optionen',
        start: 'Startet die fertige Umfrage, die in der URL gespeichert ist',
        extend: 'Gibt einer offenen Umfrage mit Timer mehr Zeit',
        end: 'Beendet die Abstimmung sofort, der Gewinner kommt nach dem Stream-Delay',
        cancel: 'Nimmt die Umfrage samt Ergebnissen vom Screen',
        p1: 'Trenn Frage und Optionen mit `|`. Optionen nach der sechsten fallen weg, genauso wie doppelte, auch in anderer Schreibweise. Die Frage darf bis zu 80 Zeichen lang sein, jede Option bis zu 30. Eine neue Umfrage ersetzt die auf dem Screen.',
        p2: 'Ein Befehlswort braucht die richtigen Argumente: `!poll extend 30 seconds` macht nichts, statt das als Frage zu starten. Eine reine Zahl vor der Frage wird nicht als Dauer gelesen, `!poll 3 oder 4 Games? | 3 | 4` behält also seine Frage. Die Umfrage antwortet nicht im Chat, das Ergebnis siehst du auf dem Screen.',
      },
      voting: {
        title: 'Wie stimmen die Zuschauer ab?',
        number: 'Nur die Zahl der Option, z. B. `2`.',
        command: '`!vote 2` oder `!2`, für Zuschauer, die Bot-Umfragen gewohnt sind.',
        text: 'Die Option selbst: `speedrun` stimmt für Speedrun, egal ob groß oder klein, und Akzente oder Umlaute dürfen fehlen (ü geht auch als u).',
        p1: 'Die ganze Nachricht muss die Stimme sein. `2 bitte`, `4Head` oder `1 Runde noch` zählen nicht, normaler Chat wird also nie zu Stimmen. Ist eine Option selbst eine Zahl, gewinnt ihr Text: Bei einer Umfrage mit `3 | 4 | 5` stimmt 3 für die Option 3, nicht für die dritte Option.',
        p2: 'Der Twitch-Befehl `/vote` ist für Twitchs eigene Umfragen, sag deinem Chat also, dass er die Zahl schreiben soll. Unter den Optionen zeigt die Umfrage einen Hinweis wie „Schreib 1 bis 3 in den Chat“.',
      },
      rules: {
        title: 'Kann ein Zuschauer mehrmals abstimmen?',
        p1: 'Nein. Jeder Twitch- oder Kick-Account zählt einmal. Mit Stimme ändern erlaubt, standardmäßig an, verschiebt eine neue Zahl die Stimme. Schaltest du es aus, zählt die erste Stimme. Eine Stimme für eine Option, die es nicht gibt, kostet einen Zuschauer nie die Stimme, die er schon hatte.',
        p2: 'Steht Wer darf abstimmen auf Subs, dürfen nur Zuschauer mit Sub- oder Founder-Badge abstimmen, plus du. Dürfen alle abstimmen, lässt Sub-Stimme zählt die Stimme eines Subs 2- oder 3-mal zählen. Die Umfrage zeigt das auf dem Screen an, und die Prozente rechnen mit diesen gewichteten Stimmen.',
        p3: 'Bekommt ein Account einen Timeout oder Bann von einem Mod, während die Umfrage Stimmen annimmt, fällt seine Stimme weg. Das hilft, eine Welle von Spam-Bots rückgängig zu machen.',
      },
      timing: {
        title: 'Was passiert, wenn die Zeit abläuft?',
        p1: 'Zuschauer sehen deinen Stream ein paar Sekunden hinter dem Chat, wenn ihr Screen also noch 1 Sekunde zeigt, ist die Umfrage im Chat schon zu. Stimmen zählen nach Ablauf des Timers noch für die Dauer des Stream-Delays weiter, standardmäßig 5 Sekunden, und die Umfrage zeigt so lange Letzte Stimmen. Stell es darauf ein, wie weit deine Zuschauer hinterher sind. Twitch und Kick hängen meistens 2 bis 10 Sekunden hinterher.',
        p2: 'Dann leuchtet der Gewinner mit Krone in Gold auf, und die anderen Optionen werden blasser. Haben zwei oder mehr Optionen gleich viele Stimmen, zeigt die Umfrage einen Gleichstand. Die Ergebnisse bleiben so lange stehen, wie Ergebnisse sichtbar festlegt, standardmäßig 30 Sekunden, dann blendet die Umfrage aus. Stell es auf 0, damit sie bis zur nächsten Umfrage oder bis `!poll cancel` stehen bleiben.',
        p3: 'Mit Umfragedauer auf 0 hat die Umfrage keinen Timer und bleibt offen, bis ein Mod `!poll end` schreibt. `!poll extend` gibt nur einer Umfrage mit Timer mehr Zeit.',
      },
      look: {
        title: 'Wie kannst du das Aussehen ändern?',
        blind:
          'Ergebnisse bis zum Ende verbergen: Die Balken bleiben versteckt, solange abgestimmt wird, und nur die Zahl der Stimmen ist zu sehen, damit frühe Stimmen den Rest nicht beeinflussen.',
        color: 'Farbe: Lila (Standard), Grün, Rot, Gold, Cyan oder Pink.',
        position:
          'Position: Die Umfrage sitzt oben oder unten in der Browser-Quelle und wächst von dort mit der Zahl der Optionen.',
        language:
          'Umfragesprache: Englisch, Spanisch, Französisch, Deutsch, Japanisch, Portugiesisch oder Türkisch für die Wörter auf der Umfrage, wie Ergebnisse und das Ja und Nein einer schnellen Umfrage.',
        p1: 'Sind beide Plattformen an, zeigt die Umfrage neben der Gesamtzahl, wie viele Stimmen von Twitch und wie viele von Kick kamen. Die Quelle ist transparent, im Stream siehst du also nur die Umfrage-Karte.',
      },
      saved: {
        title: 'Was passiert, wenn OBS schließt oder die Quelle neu lädt?',
        p1: 'Die Umfrage und ihre Stimmen werden in OBS gespeichert, nach einem Neuladen oder OBS-Neustart ist sie also wieder da, wo sie war. Der Timer läuft weiter, während OBS zu ist.',
        p2: 'Solange OBS oder die Quelle aus ist, liest niemand deinen Chat, Stimmen aus dieser Zeit zählen also nicht. Deshalb sollte „Deaktivieren, wenn Quelle nicht sichtbar ist“ aus bleiben. Die [OBS-Anleitung](/guides/obs-browser-source) erklärt, warum. Die gespeicherte Umfrage gehört zu diesem OBS und diesen Kanälen.',
      },
      limits: {
        title: 'Was kann die Chat-Umfrage nicht?',
        chat: 'In den Chat schreiben. Sie liest den Chat nur, kündigt dort also weder Umfrage noch Gewinner an. Die Umfrage im Stream zeigt beides.',
        native:
          'Die eigenen Umfragen von Twitch oder Kick zeigen. Die von Twitch lassen sich ohne Login nicht lesen, deshalb kommen die Stimmen aus dem Chat, damit es auf beiden Plattformen gleich läuft.',
        points:
          'Stimmen mit Kanalpunkten oder Bits. Jeder Zuschauer hat eine Stimme, oder 2 bzw. 3 als Sub, wenn du das einschaltest.',
        multiple: 'Mehrfachauswahl. Jeder Zuschauer wählt eine Option.',
      },
      ctaTitle: 'Richte deine Chat-Umfrage ein',
      ctaText: 'Fertige Umfrage und Abstimmungsregeln in eine URL packen, in OBS einfügen und !poll in den Chat schreiben.',
    },
    frames: {
      title: 'So rahmst du Kamera, Chat und Screen in OBS ein',
      short: 'Stream-Rahmen hinzufügen',
      summary:
        'Kamera-, Chat- und Screen-Rahmen in OBS einbauen, die Reihenfolge der Quellen, die Kamera in den Rahmen einpassen und Preset und Animationen wählen.',
      lead:
        'Stream-Rahmen legt einen fertigen Rahmen um deine Kamera, deinen Chat oder deinen ganzen Stream-Screen, im Stil des Presets, das du wählst. Wähl auf der Setup-Seite Teil und Preset, füg die URL in OBS als Browser-Quelle hinzu und leg sie über deine Kamera oder deinen Chat. Die Mitte des Rahmens ist transparent, und es gibt keinen Kanal zu verbinden und keinen Login.',
      setup: {
        title: 'Wie richtest du einen Stream-Rahmen ein?',
        step1: 'Öffne die [Setup-Seite der Stream-Rahmen](/setup/stream-frames).',
        step2:
          'Wähl unter Was willst du einrahmen? Kamera, Chat oder Screen. Hast du Kamera gewählt, stell die Ausrichtung auf Quer oder Hochkant. Jedes Teil ist eine eigene Browser-Quelle, du kannst also alle drei hinzufügen.',
        step3:
          'Wähl ein Preset. Bei Klassisch suchst du die Farbe aus. Die anderen Presets bringen ihre eigenen Farben, Schrift und Grafik mit.',
        step4:
          'Gib im Feld Beschriftung deinen Kanalnamen oder ein beliebiges Wort ein. Bei Kamera und Chat steht es auf dem Reiter über dem Rahmen, beim Screen auf dem Schild unten.',
        step5:
          'Kopier die URL und füg sie in OBS als Browser-Quelle hinzu: 640 × 360 für eine Kamera (360 × 640 für eine Kamera hochkant), 420 × 720 für den Chat, 1920 × 1080 für den Screen.',
        p1:
          'Die Vorschau zeigt den Rahmen mit der Silhouette einer Person oder Beispiel-Chatzeilen. Das sind nur Platzhalter. Im Stream ist die Mitte des Rahmens leer.',
      },
      layers: {
        title: 'Warum ist der Rahmen hinter meiner Kamera?',
        p1:
          'In OBS liegt in der Szene vorne, was in der Liste Quellen weiter oben steht. Schieb die Rahmen-Quelle über deine Kamera (Videoaufnahmegerät) oder Chat-Box. Du kannst die Quelle auch rechtsklicken und Anordnen → Ganz hoch wählen.',
        p2:
          'Um Kamera und Rahmen zusammen zu bewegen, markier beide, rechtsklick und wähl Ausgewählte Elemente gruppieren. Änderst du die Größe der Gruppe, skalieren beide zusammen.',
        p3:
          'Der Screen-Rahmen sollte vor der ganzen Szene liegen. Setz ihn ganz oben in die Liste, damit dein Game und die anderen Quellen darunter bleiben.',
      },
      fit: {
        title: 'Wie passt du deine Kamera in den Rahmen ein?',
        intro:
          'Die Öffnung in der Mitte des Rahmens ist etwas kleiner als sein Außenrand. Deine Kamera sollte die Öffnung füllen, aber innerhalb des Außenrands bleiben, sonst schaut der Überstand um den Rahmen herum raus. Bei den empfohlenen Größen passt das hier gut:',
        caption: 'Empfohlene Rahmengrößen und die Quelle, die hineinkommt',
        colPiece: 'Teil',
        colFrame: 'Rahmengröße',
        colInside: 'Quelle darin',
        camera: 'Kamera quer',
        cameraPortrait: 'Kamera hochkant',
        chat: 'Chat',
        screen: 'Screen',
        cameraInside: 'Kamera mit 590 × 296, mittig im Rahmen',
        cameraPortraitInside: 'Kamera mit 306 × 572, mittig im Rahmen',
        chatInside: 'Chat-Box mit 370 × 660, mittig im Rahmen',
        screenInside: 'Spiel- oder Bildschirmaufnahme füllt die ganze Szene',
        p1:
          'Eine 16:9-Kamera, auf 590 Breite skaliert, ist 332 hoch, schneide also oben und unten gleichmäßig ab, bis es 296 sind. Halt Alt (Option auf dem Mac) gedrückt und zieh die obere und untere Kante der Quelle, oder rechtsklick die Kamera und nutz die Felder unter Zuschneiden in Transformieren → Transformation bearbeiten. Bei einer Kamera hochkant ist es andersherum: Eine 9:16-Kamera, auf 572 Höhe skaliert, ist 322 breit, schneide also links und rechts gleichmäßig ab, bis es 306 sind.',
        p2:
          'Nimmst du einen größeren Rahmen, skalieren diese Größen mit: In einem 1280 × 720-Kamerarahmen ist die Kamera 1180 × 592. Für eine quadratische Kamera stellst du Breite und Höhe der Browser-Quelle passend ein, und der Rahmen wird in dieser Form gezeichnet.',
      },
      look: {
        title: 'Was ändern Preset und Animationen?',
        p1:
          'Das Preset bestimmt Form, Grafik, Farben und Schrift des Rahmens: ein Pagodendach und Quasten bei Dynasty, Goldverzierung und türkise Edelsteine bei Rift, Grasblöcke und eine Hotbar bei Blocks. Gib Chat-Box, Stream-Alerts und Sub-Ziel dasselbe Preset, und alles auf dem Screen passt zusammen.',
        p2:
          'Mit Animationen an wandert Licht um den Rahmen, die Linien leuchten, und je nach Preset bewegen sich Laternen, Fackeln oder Funken. Sie sind bewusst leicht gehalten. Kommt dein PC beim Zocken trotzdem ins Schwitzen, schalt Animationen aus. Das hängt `motion=0` an die URL, und der Rahmen bleibt still.',
        p3: 'Die ganze Grafik ist selbst gezeichnet, ohne Game-Logos oder Artwork.',
      },
      change: {
        title: 'Wie ändere ich den Rahmen später?',
        p1:
          'Füg die URL aus OBS auf der Setup-Seite ins Feld Widget-URL ein, und deine Einstellungen sind wieder da. Ändere Preset, Teil oder Beschriftung, kopier die neue URL und füg sie in der Browser-Quelle über der alten ein. Um das Preset bei all deinen Widgets auf einmal zu ändern, nimm die [Presets-Seite](/presets).',
      },
      ctaTitle: 'Richte deinen Rahmen ein',
      ctaText: 'Teil und Preset wählen, Vorschau checken, URL kopieren.',
    },
    countdown: {
      title: 'So baust du einen Countdown für Start, BRB und Ende in OBS ein',
      short: 'Countdown hinzufügen',
      summary:
        'Einen Countdown für deine Start-, Pausen- und Endszene einrichten, ihn bei jedem Szenenwechsel neu starten lassen, bis zu einer Uhrzeit runterzählen und die Chatbefehle.',
      lead:
        "Der Stream-Countdown ist eine Uhr für die drei Szenen, in denen noch nichts passiert: Gleich geht's los, Gleich zurück und Stream endet. Wähl auf der Setup-Seite Szene und Dauer, füg die URL in OBS als 1920 × 1080-Browser-Quelle hinzu und hak Browser bei Szenenaktivierung aktualisieren an, damit er jedes Mal neu startet, wenn du zu dieser Szene wechselst. Kein Login, und kein Kanal, außer du willst die Chatbefehle.",
      setup: {
        title: 'Wie richtest du einen Stream-Countdown ein?',
        step1: 'Öffne die [Setup-Seite des Stream-Countdowns](/setup/stream-countdown).',
        step2:
          'Wähl unter Wofür ist er? Start, Pause oder Ende. Das bestimmt Text und Icon, und jede ist eine eigene Browser-Quelle, du kannst also alle drei hinzufügen.',
        step3:
          'Wähl unter Countdown-Art die Option Dauer und stell die Minuten ein, oder wähl Uhrzeit und gib eine Uhrzeit im 24-Stunden-Format ein, z. B. 21:00.',
        step4:
          'Wähl ein Preset und leg unter Bei null fest, was nach Ablauf auf dem Screen bleibt: eine Nachricht, die Uhr bei 00:00 oder gar nichts.',
        step5:
          'Kopier die URL und füg sie in OBS der Szene als Browser-Quelle mit 1920 × 1080 hinzu, damit die Uhr mittig in deiner Szene landet.',
        p1:
          'Die Vorschau auf der Setup-Seite läuft schnell, damit du den ganzen Countdown in ein paar Sekunden siehst. Im Stream zählt er in Echtzeit runter.',
      },
      restart: {
        title: 'Warum startet mein Countdown nicht neu?',
        p1:
          'Der Countdown startet, wenn die Browser-Quelle lädt. Hat die Quelle beim Start von OBS geladen, zählt sie seitdem runter, und wenn du zu deiner BRB-Szene wechselst, steht sie schon auf null.',
        p2:
          'Öffne die Eigenschaften der Browser-Quelle und hak „Browser bei Szenenaktivierung aktualisieren“ an. OBS lädt die Seite dann jedes Mal neu, wenn du zu dieser Szene wechselst, und der Countdown startet in jeder Pause von vorn.',
        p3:
          'Mit eingetragenem Kanal kannst du auch `!countdown reset` in den Chat schreiben, das startet ihn neu, ohne OBS anzufassen. Das ist der schnellste Fix, wenn du schon AFK bist.',
      },
      clock: {
        title: 'Wie zählst du bis zu einer Uhrzeit runter?',
        p1:
          'Wähl Uhrzeit und gib die angekündigte Zeit ein, z. B. 21:00. Der Countdown liest die Uhr des PCs, auf dem OBS läuft, es ist also egal, wann die Quelle lädt: Um 18:30 zeigt er 2:30:00, um 20:55 zeigt er 05:00.',
        p2:
          'Ist die Uhrzeit heute schon vorbei, zielt er auf dieselbe Zeit morgen. Eine Quelle, die du über Nacht offen lässt, ist also für den nächsten Stream bereit, und `!countdown reset` richtet sie auf den nächsten Termin aus.',
        p3:
          'Zuschauer in anderen Ländern sehen deinen Countdown, nicht ihre eigene Uhr, und genau darum geht es: Alle sehen dieselbe Zahl an Minuten.',
      },
      commands: {
        title: 'Können Mods den Countdown im Chat ändern?',
        p1:
          'Ja, sobald du auf der Setup-Seite deinen Twitch- oder Kick-Kanal einträgst. Dann können du und deine Mods diese Befehle in beiden Chats nutzen:',
        caption: 'Die !countdown-Befehle',
        colCommand: 'Befehl',
        colDoes: 'Was er macht',
        addDoes: 'Gibt 5 Minuten dazu, 90s und 1h30m gehen auch',
        removeDoes: 'Zieht 2 Minuten ab',
        setDoes: 'Setzt die Restzeit auf 10 Minuten',
        pauseDoes: 'Hält die Uhr an, wo sie gerade ist',
        startDoes: 'Lässt sie nach einer Pause weiterlaufen',
        resetDoes: 'Startet den Countdown von vorn',
        sceneDoes: 'Wechselt die Szene auf break, starting oder ending und setzt die Dauer (ohne Angabe 10m)',
        p2:
          'Nur du und deine Mods können sie nutzen, auf beiden Plattformen, und eine Antwort im Chat löst nie einen Befehl aus. Der Countdown liest deinen öffentlichen Chat genauso wie die anderen Widgets, ohne Login.',
      },
      scenes: {
        title: 'Welcher Countdown kommt in welche Szene?',
        p1:
          'Start kommt in die Szene, auf der du vor dem Livegang wartest, mit einer Dauer wie 10 Minuten oder der angekündigten Uhrzeit. Pause kommt in deine BRB-Szene mit kürzerer Dauer, meistens 5 oder 10 Minuten. Ende kommt in die letzte Szene, damit der Chat sieht, wie lange es noch bis zum Schluss geht.',
        p2:
          'Wechselst du Szenen mit [OBS Bridge](/setup/obs-bridge) aus dem Chat, können deine Mods dich in die BRB-Szene schicken, und der Countdown startet gleich mit.',
      },
      ctaTitle: 'Richte deinen Countdown ein',
      ctaText: 'Szene und Dauer wählen, Vorschau ansehen, URL in OBS kopieren.',
    },
    alerts: {
      title: 'So baust du Sub-, Cheer- und Raid-Alerts für Twitch und Kick in OBS ein',
      short: 'Stream-Alerts hinzufügen',
      summary:
        'Welche Alerts jede Plattform bekommt, Themes und Farben, Mindestmengen, den Sound in OBS bringen und warum es keine Follow-Alerts gibt.',
      lead: 'Stream-Alerts zeigt einen animierten Alert mit eigenem Sound für jeden Sub, Gift-Sub, Bits-Cheer, jedes Kicks-Gift und jeden Raid auf Twitch und Kick. Gib auf der Setup-Seite deine Kanalnamen ein, wähl ein Theme und füg die URL in OBS als 800 × 450-Browser-Quelle hinzu. Kein Login nötig, und eine URL deckt beide Plattformen ab.',
      setup: {
        title: 'Wie fügst du Stream-Alerts in OBS hinzu?',
        step1: 'Öffne die [Setup-Seite der Stream-Alerts](/setup/stream-alerts).',
        step2: 'Wähl Twitch, Kick oder Beide und gib nur die Kanalnamen ein.',
        step3: 'Wähl Theme und Farbe und schalt jeden Alert aus, den du nicht willst.',
        step4:
          'Kopier die URL und füg sie in OBS als Browser-Quelle mit 800 × 450 hinzu, dann platzier sie dort, wo die Alerts erscheinen sollen.',
        step5:
          'Aktiviere in den Eigenschaften der Quelle Audio über OBS steuern, damit der Sound in deinen Stream geht. Mehr zum Sound weiter unten.',
        p1: 'Zwischen den Alerts ist die Quelle leer und transparent. Öffnest du die URL zum Testen in einem Browser-Tab, siehst du eine leere Seite, bis in deinem Kanal etwas passiert.',
        p2: 'Um sie später zu ändern, füg deine aktuelle URL auf der Setup-Seite ins Feld Widget-URL ein. Deine Kanäle und Einstellungen sind wieder da. Kopier die neue URL und füg sie in OBS über der alten ein.',
      },
      kinds: {
        title: 'Welche Alerts gibt es?',
        caption: 'Events der Stream-Alerts auf Twitch und Kick',
        colAlert: 'Alert',
        sub: 'Subs',
        subTwitch: 'Neue Subs und geteilte Resubs, mit Monaten und Nachricht',
        subKick:
          'Neue Subs und Verlängerungen, mit den Monaten, wenn Kick sie schickt, und im Chat geteilte Resubs',
        gift: 'Gift-Subs',
        giftBoth: 'Ein Alert pro Gift, mit Schenker und Anzahl der Subs',
        bits: 'Bits & Kicks',
        bitsTwitch: 'Bits-Cheers, mit Menge und Nachricht',
        bitsKick: 'Kicks, mit Menge und Nachricht',
        raid: 'Raids',
        raidTwitch: 'Der raidende Kanal und wie viele Zuschauer mitkamen',
        raidKick: 'Der raidende Kanal, und die Zuschauer, wenn Kick sie schickt',
        p1: '50 Gift-Subs auf einmal sind ein Alert, nicht 50, und die Leute, die die Subs bekommen, kriegen keinen eigenen Alert. Ein anonymes Gift zeigt Anonym als Namen. Tiers werden nicht angezeigt: Ein Prime-, Tier-1-, Tier-2- oder Tier-3-Sub bekommt denselben Alert.',
        p2: 'Kick schickt die Monate bei den meisten Subs mit, aber manche Kanäle bekommen sie nie, und dann sagt der Alert nur, dass jemand abonniert hat. Teilt ein Kick-Zuschauer seinen Resub später im Chat, bekommt das einen eigenen Alert mit Monaten und Nachricht, ein Kick-Resub kann also zweimal auftauchen. Auf Twitch kommt ein Resub nur im Chat an, wenn der Zuschauer ihn teilt, er taucht also einmal auf.',
        p3: 'Während einer Twitch-Shared-Chat-Session erscheinen Subs, Gifts, Cheers und Raids in den Partnerkanälen nicht. Nur dein eigener Kanal bekommt Alerts.',
      },
      follows: {
        title: 'Warum gibt es keine Follow- oder Spenden-Alerts?',
        p1: 'Twitch und Kick zeigen neue Follows keiner Seite, die nicht eingeloggt ist, und keine der beiden Plattformen hat eigene Spenden. Stream-Alerts nutzt nur, was beide Plattformen jedem Zuschauer schicken. Deshalb läuft es ohne Login und auf beiden gleich.',
      },
      look: {
        title: 'Welche Themes und Farben gibt es?',
        neon: 'Neon (Standard): ein kantiges Sci-Fi-Banner mit Synth-Sounds. Beim Verschwinden flackert es wie eine Leuchtreklame.',
        celestial: 'Sternenhimmel: eine dunkelblaue Karte unter Sternen mit dünnem Rahmen und Glockenklängen.',
        p1: 'Die Farbe ist der Akzent des Alerts. Der Standard, Plattform, zeigt Twitch-Alerts in Lila und Kick-Alerts in Grün. Du kannst auch eine Farbe für alle Alerts wählen: Blau, Lila, Pink, Rot, Gold oder Grün. Stehen beide Kanäle in der URL, zeigt ein kleines TWITCH- oder KICK-Tag, woher jeder Alert kommt.',
        p2: 'Du kannst die Überschrift jedes Alerts umbenennen, bis zu 24 Zeichen, oder sie leer lassen, um den Standard zu behalten, z. B. Neuer Sub. Neon schreibt Überschriften in Großbuchstaben. Alert-Sprache legt die Sprache der Wörter im Alert fest: Englisch, Spanisch, Französisch, Deutsch, Japanisch, Portugiesisch oder Türkisch. Sie bleibt in der URL, egal in welcher Sprache OBS läuft.',
      },
      min: {
        title: 'Wie überspringst du kleine Gifts, Cheers und Raids?',
        caption: 'Mindestmengen der Stream-Alerts',
        colSetting: 'Einstellung',
        colDefault: 'Standard',
        colRange: 'Bereich',
        gift: 'Min. Subs (Gift-Subs)',
        giftRange: '1 bis 100.000',
        bits: 'Min. Menge (Bits oder Kicks)',
        bitsRange: '1 bis 100.000',
        raid: 'Min. Zuschauer (Raids)',
        raidRange: '0 bis 100.000',
        p1: 'Alles unter dem Minimum bekommt keinen Alert. Eine Min. Menge gilt für Bits und Kicks zusammen, und Subs haben kein Minimum. Schickt Kick einen Raid ohne Zuschauerzahl, zählt er als 0 Zuschauer, eine Min. Zuschauer von 1 oder mehr überspringt ihn also.',
      },
      queue: {
        title: 'Was passiert, wenn viele Alerts auf einmal kommen?',
        p1: 'Sie warten, bis sie dran sind, und erscheinen nacheinander in der Reihenfolge, in der sie reinkamen, mit einer kurzen Pause dazwischen. Anzeigedauer legt fest, wie lange jeder bleibt: 3 bis 20 Sekunden, standardmäßig 7. Bis zu 30 Alerts können in der Warteschlange stehen. Stauen sich mehr, werden die neuesten übersprungen.',
        p2: 'Zuschauer-Nachricht zeigen, standardmäßig an, zeigt, was der Zuschauer zu seinem Resub, seinen Bits oder Kicks geschrieben hat. Links werden entfernt und lange Nachrichten gekürzt, damit niemand einen Link in deinen Stream bringt.',
      },
      sound: {
        title: 'Wie bekommst du den Alert-Sound in OBS?',
        step1:
          'Doppelklick die Quelle der Stream-Alerts, hak Audio über OBS steuern an und klick auf OK. Die Quelle erscheint jetzt im Audiomixer.',
        step2: 'Öffne im oberen Menü Bearbeiten → Erweiterte Audioeigenschaften.',
        step3:
          'Willst du die Alerts auch selbst hören, stell Audiomonitoring für die Quelle auf Monitoring aktiviert, in älteren OBS-Versionen heißt das Monitor und Ausgabe.',
        p1: 'Die Lautstärke geht von 0 bis 100, standardmäßig 50, und 0 schaltet den Sound aus. Jeder Alert hat seinen eigenen kurzen Sound passend zum Theme: Synths bei Neon, Glocken bei Sternenhimmel. OBS spielt den Sound von selbst ab. In einem normalen Browser-Tab bleibt die Seite stumm, bis du einmal hineinklickst.',
      },
      test: {
        title: 'Wie testest du die Alerts vor dem Livegang?',
        p1: 'Die Vorschau auf der Setup-Seite spielt stumme Beispiel-Alerts ab. Die Buttons unter Probier es aus spielen einen Sub, ein Gift, Bits/Kicks und einen Raid mit Sound in deiner aktuellen Lautstärke ab, damit du das Theme siehst und hörst, bevor du dich entscheidest.',
        warnTitle: 'Die Test-Buttons kommen nicht in OBS an',
        warn: 'Sie spielen nur in der Vorschau auf der Setup-Seite. Die Quelle in OBS zeigt nur echte Subs, Gifts, Cheers und Raids aus deinem Kanal, du kannst ihr also keinen Test-Alert schicken.',
        p2: 'Lass die Szene mit der Quelle aktiv und „Deaktivieren, wenn Quelle nicht sichtbar ist“ aus. Alerts, die reinkommen, während die Quelle aus ist, gehen verloren und werden nicht nachgeholt.',
      },
      ctaTitle: 'Stream-Alerts einrichten',
      ctaText: 'Kanäle eingeben, Theme wählen, URL kopieren. Dein nächster Sub bekommt einen Alert.',
    },
    reader: {
      title: 'So liest du Twitch- und Kick-Chat in einem Fenster oder einem OBS-Dock',
      short: 'Chat im OBS-Dock lesen',
      summary:
        'Den Chat-Reader öffnen, ihn in OBS als Dock hinzufügen, was passiert, wenn die Verbindung abbricht, und wie dein Chat ein Neuladen übersteht.',
      lead: 'Der Chat-Reader zeigt deinen Twitch- und Kick-Chat in einer Liste, in einem Browser-Tab oder einem OBS-Dock, damit du ihn beim Streamen lesen kannst. Öffne ihn mit dem Button Chat-Reader öffnen auf der Setup-Seite der Chat-Box. Er verbindet sich von selbst neu, markiert jeden Abbruch in der Liste und behält deinen Chat nach einem Neuladen.',
      open: {
        title: 'Wie öffnest du den Chat-Reader?',
        step1:
          'Öffne die [Setup-Seite der Chat-Box](/setup/chat-widget) und gib deinen Twitch-Kanal, deinen Kick-Kanal oder beide ein.',
        step2: 'Klick unter der Widget-URL auf Chat-Reader öffnen. Der Reader öffnet sich in einem neuen Tab.',
        step3: 'Setz ein Lesezeichen auf den Tab oder heb seine Adresse auf, um beim nächsten Mal denselben Reader zu öffnen.',
        p1: 'Der Reader übernimmt die Kanäle und ein paar Einstellungen der Chat-Box: Emote-Anbieter, Badges, Bots ausblenden, Befehle ausblenden und Hervorhebungen. Schrift, Layout, Animation und der restliche Look bleiben beim Overlay, und der Reader hat eigene Einstellungen für Textgröße und Uhrzeit. Um die übernommenen Einstellungen zu ändern, änderst du sie auf der Setup-Seite und öffnest den Reader neu.',
      },
      dock: {
        title: 'Wie fügst du den Chat-Reader in OBS als Dock hinzu?',
        step1: 'Öffne den Chat-Reader und kopier die Adresse aus der Adressleiste.',
        step2:
          'Öffne in OBS im oberen Menü Docks → Benutzerdefinierte Browser-Docks. In älteren Versionen findest du das unter Ansicht → Docks.',
        step3: 'Gib einen Namen wie Chat ein, füg die Adresse in die Spalte URL ein und klick auf Übernehmen.',
        step4: 'Zieh das neue Dock im OBS-Fenster dorthin, wo du es haben willst.',
        p1: 'OBS hat seinen eigenen Browser-Speicher, das Dock hat also seinen eigenen Verlauf und eigene Einstellungen, getrennt von deinem normalen Browser.',
      },
      shows: {
        title: 'Was zeigt der Chat-Reader?',
        p1: 'Nachrichten aus beiden Chats in einer Liste, in der Reihenfolge, in der sie reinkommen. Sind beide Kanäle eingetragen, zeigt ein Twitch- oder Kick-Icon, woher jede Nachricht kommt. Emotes, Badges und Namensfarben sehen genauso aus wie in der Chat-Box.',
        p2: 'Gelöschte Nachrichten bleiben in der Liste, durchgestrichen und mit (gelöscht) markiert, damit du noch siehst, was entfernt wurde. Bekommt jemand einen Timeout oder Bann, werden seine früheren Nachrichten genauso markiert. Leert ein Mod den Chat, steht das als Zeile in der Liste.',
        p3: 'A- und A+ ändern die Textgröße von 12 bis 28 Pixel, standardmäßig 15. Der Uhr-Button blendet die Uhrzeit der Nachrichten ein oder aus, und der Papierkorb-Button löscht den Verlauf nach einem zweiten Klick. Der Reader merkt sich deine Textgröße und die Uhrzeit-Einstellung.',
        p4: 'Scrollst du hoch, um etwas zu lesen, bleibt die Liste stehen. Ein Button unten zählt die neuen Nachrichten. Klick ihn, um zurück zum Live-Chat zu springen.',
      },
      drops: {
        title: 'Was passiert, wenn die Verbindung abbricht?',
        p1: 'Jeder Kanal hat oben einen Status: Verbinde, Verbunden oder Verbinde neu, oder Kanal nicht gefunden, wenn ein Kick-Name nicht gefunden wird. Bricht eine Chat-Verbindung ab, zählt ein Hinweis bis zum nächsten Versuch runter, und Jetzt neu versuchen probiert es sofort. Die Versuche starten im Abstand von 1 Sekunde und werden bis auf einen alle 30 Sekunden langsamer.',
        p2: 'Der Reader erkennt auch eine Verbindung, die still wird, ohne sich zu schließen, was nach einem Netzwerkabbruch passieren kann. Kommt 30 Sekunden lang nichts, prüft er, ob der Chat noch da ist, und verbindet sich neu, wenn keine Antwort kommt. Geht dein PC offline, sagt er dir Bescheid und verbindet sich neu, sobald das Internet wieder da ist.',
        p3: 'Jeder Abbruch wird in die Liste geschrieben, z. B. „Verbindung zum Twitch-Chat verloren“ und „Wieder im Twitch-Chat nach 12 s“, damit du genau weißt, wo Nachrichten fehlen könnten.',
      },
      history: {
        title: 'Verlierst du deinen Chat, wenn du neu lädst?',
        p1: 'Nein. Der Reader speichert die letzten 1000 Zeilen in deinem Browser und holt sie beim nächsten Öffnen zurück, gefolgt von einer Zeile mit „Gespeichert von deinem letzten Besuch, bis“ und der Uhrzeit. Zeilen, die älter als 12 Stunden sind, fliegen raus.',
        p2: 'Nachrichten, die geschickt wurden, während der Reader zu war, kommen nicht zurück: Alles über dieser Zeile stammt von deinem letzten Besuch, alles darunter ist neu. Jede Kanal-Kombination hat ihren eigenen Verlauf, und Verlauf löschen löscht ihn.',
      },
      limits: {
        title: 'Was kann der Chat-Reader nicht?',
        send: 'Er kann keine Nachrichten schicken und nicht moderieren. Er liest den Chat anonym, wie ein Zuschauer, der nicht eingeloggt ist.',
        events:
          'Er zeigt keine Sub-, Gift- oder Raid-Hinweise. Dafür bau [Stream-Alerts](/setup/stream-alerts) in deinen Stream ein.',
        missed: 'Er kann keine Nachrichten zurückholen, die geschickt wurden, während er zu war, auf keiner der beiden Plattformen.',
      },
      ctaTitle: 'Chat-Reader öffnen',
      ctaText: 'Gib auf der Setup-Seite der Chat-Box deine Kanäle ein und klick auf Chat-Reader öffnen.',
    },
  },
  presets: {
    classic: 'Klassisch',
    classicTag: 'Der eigene Look jedes Widgets',
    breadcrumb: 'Presets',
    eyebrow: 'Presets',
    title: 'Game-Presets für deine Stream-Overlays',
    lead:
      'Wähl ein Preset, und deine Chat-Box, Stream-Alerts, Sub-Ziel, Subathon Timer, Chat-Umfrage, der Gewinner der Verlosung und die Stream-Rahmen bekommen denselben Rahmen, dieselben Schriften und Farben. Nimm eins für alle Widgets oder für jedes ein anderes.',
    pickTitle: 'Such dir ein Preset aus',
    by: 'von {author}',
    community: 'Community',
    makeDefault: '{name} für alle Widgets nutzen',
    isDefault: '{name} ist dein Standard',
    defaultHint:
      'Jede Setup-Seite startet in diesem Browser mit deinem Standard. Du kannst trotzdem bei jedem Widget ein anderes Preset wählen.',
    previewTitle: '{name} auf allen Widgets',
    setUp: '{widget} einrichten',
    previewIframeTitle: 'Vorschau von {widget} mit dem Preset {name}',
    descriptions: {
      classic:
        'Der Look, mit dem jedes Widget gebaut wurde: Neon-Stream-Alerts, der lila Balken des Sub-Ziels und schlichter Text in der Chat-Box. Die Farben suchst du aus.',
      rift: 'Dünne Goldrahmen mit Rautennieten, tiefblaue Panels und leuchtende türkise Balken, mit Titeln in Cinzel.',
      realm:
        'Bronze- und Goldrahmen mit Nieten, dunkle Lederpanels und legendär orange Balken, mit Titeln in Marcellus.',
      dynasty:
        'Rote Lackrahmen mit goldenen Eckbeschlägen, dunkle Holzpanels und karminrote Balken, mit Titeln in Zen Antique.',
      ancient: 'Dunkle Eisenrahmen mit Bronzeecken, ein rotes Glühen am unteren Rand und kantige Titel in Grenze.',
      agent: 'Abgeschrägte Ecken, eine rote Kante, schräge Balken und hohe Teko-Zahlen auf dunklem Schiefer.',
      defuse: 'HUD-Eckklammern, eine bernsteinfarbene Linie oben, Warnstreifen auf den Balken und schmale Saira-Schrift.',
      blocks:
        'Pixelrahmen in Gras- und Erdfarben, grüne Balken in Blöcken und die Pixelschrift Jersey 10.',
    },
    existingTitle: 'Hast du schon Widgets in OBS?',
    existingText:
      'Füg ihre URLs hier ein, eine pro Zeile, und kopier sie mit {name} zurück. Dann füg jede in OBS ins Feld URL ihrer Browser-Quelle ein. Der Rest jeder URL bleibt gleich.',
    existingLabel: 'Widget-URLs',
    existingResult: 'Deine URLs mit {name}',
    existingUnsupported: 'Nimmt kein Preset, unverändert',
    existingInvalid: 'Keine Senchabot-Widget-URL',
    communityTitle: 'Bau dein eigenes Preset',
    communityText:
      'Ein Preset ist eine kleine JSON-Datei: neun Farben, zwei Google Fonts und ein Rahmenstil. Schick deins als Pull Request auf GitHub. Sobald es gemergt ist, taucht es hier und auf jeder Setup-Seite mit deinem Namen auf.',
    communityLink: 'So baust du ein Preset',
    communityEmpty: 'Noch keine Community-Presets. Deins könnte das erste sein.',
    disclaimer:
      'Spielenamen sind Marken ihrer Inhaber. Diese Presets sind Fan-Styles aus Farben, Schriften und Zeichnungen ohne Grafiken aus den Games, und sie sind weder mit den Spieleherstellern verbunden noch von ihnen unterstützt.',
    faqTitle: 'Fragen zu Presets',
    faq1Q: 'Ändern Presets Widgets, die schon in OBS sind?',
    faq1A:
      'Nein. Der Look eines Widgets ist Teil seiner URL, ein Widget in OBS behält seinen Look also, bis es eine neue URL bekommt. Füg deine URLs oben in die Box ein, um sie mit dem Preset zurückzubekommen.',
    faq2Q: 'Kann jedes Widget ein anderes Preset haben?',
    faq2A:
      'Ja. Dein Standard ist nur der Startpunkt jeder Setup-Seite. Auf der Setup-Seite jedes Widgets kannst du ein anderes Preset wählen, und die URL dieses Widgets trägt es.',
    faq3Q: 'Welche Widgets nehmen ein Preset?',
    faq3A:
      'Chat-Box, Stream-Alerts, Sub-Ziel, Subathon Timer, Chat-Umfrage, das Gewinner-Overlay der Verlosung und Stream-Rahmen. Die Emote-Wand zeigt nur Emotes und Sub Sprout zeichnet eigene Pflanzen, deshalb behalten die beiden ihren Look.',
    faq4Q: 'Sind das offizielle Game-Themes?',
    faq4A:
      'Nein. Es sind Fan-Styles aus Farben, kostenlosen Google Fonts und selbst gezeichneter Deko, ohne Game-Logos oder Grafiken, und sie sind nicht mit den Spieleherstellern verbunden.',
    field: {
      label: 'Preset',
      tip: 'Ein fertiger Look für dieses Widget: Rahmen, Schriften und Farben. Wähl bei jedem Widget dasselbe Preset, damit alles zusammenpasst.',
      browse: 'Alle Presets',
      owns: 'Farben und Schriften kommen von {name}.',
      makeDefault: '{name} als Standard',
      makeDefaultTip: 'Jede Setup-Seite in diesem Browser startet dann damit.',
      isDefault: 'Dein Standard',
    },
  },
  faqPage: {
    breadcrumb: 'FAQ',
    title: 'Häufige Fragen',
    lead: 'Schnelle Antworten zu Preisen, Datenschutz, unterstützten Plattformen und Widget-URLs bei Senchabot Extensions. Wie du ein bestimmtes Widget einrichtest, steht in den [Anleitungen](/guides).',
    groups: {
      basics: 'Preis und Account',
      platforms: 'Software und Plattformen',
      urls: 'Deine Widget-URL und Datenschutz',
      help: 'Support',
    },
    freeQ: 'Ist Senchabot Extensions kostenlos?',
    freeA:
      'Ja. Alle zwölf Widgets und Tools sind kostenlos: Chat-Box, Emote-Wand, Sub Sprout, Subathon Timer, Stream-Alerts, Sub-Ziel, Stream-Rahmen, Stream-Countdown, Chat-Umfrage, Socials, Verlosung und OBS Bridge. Es gibt kein Bezahl-Abo, kein Wasserzeichen und keinen Premium-Account. Der Quellcode liegt offen auf GitHub unter der GPL-3.0-Lizenz.',
    loginQ: 'Was heißt „kein Login nötig“?',
    loginA:
      'Du legst auf dieser Seite keinen Account an, du loggst dich nicht mit Twitch oder Kick ein, und du lädst nichts herunter. Du gibst deinen Kanalnamen ein, und die Setup-Seite gibt dir eine URL. Die Widgets lesen den öffentlichen Chat anonym: Auf Twitch verbinden sie sich wie ein anonymer Zuschauer, auf Kick hören sie den öffentlichen Chat-Feed mit. Deshalb können sie nicht in den Chat schreiben, nicht moderieren und nicht auf private Infos deines Accounts zugreifen.',
    affiliatedQ: 'Gehört Senchabot Extensions zu Twitch oder Kick?',
    affiliatedA:
      'Nein. Senchabot Extensions kommt von Senchabot, einem Open-Source-Community-Bot für Twitch, Discord, Kick und YouTube. Es gibt keine offizielle Verbindung, Partnerschaft oder Unterstützung durch Twitch oder Kick.',
    appsQ: 'Mit welcher Streaming-Software funktioniert es?',
    appsA:
      'Mit OBS Studio und jeder anderen Streaming-Software, die eine Browser-Quelle unterstützt. Jedes Widget läuft als Web-URL, und diese URL fügst du in die Quelle ein. Unsere Anleitungen sind für OBS Studio geschrieben.',
    platformsQ: 'Welche Widgets unterstützen Twitch und welche Kick?',
    platformsA:
      'Alle zwölf unterstützen beide Plattformen. Chat-Box, Emote-Wand, Sub Sprout, Subathon Timer, Stream-Alerts, Sub-Ziel, Chat-Umfrage und Stream-Countdown hören einem Twitch- und einem Kick-Kanal zusammen in einer URL zu. OBS Bridge hört auf Befehle aus beiden Chats, und jeder berechtigte Nutzer wird mit seiner eigenen Plattform hinzugefügt. Die Verlosung läuft immer auf einer Plattform, Twitch oder Kick. Stream-Rahmen und Socials lesen keinen Chat, sie funktionieren also auf beiden gleich. In der Chat-Box erscheinen 7TV-Emotes auf beiden Plattformen, BTTV- und FFZ-Emotes nur auf Twitch.',
    editQ: 'Wie ändere ich ein Widget später?',
    editA:
      'Ändere die Einstellungen auf der Setup-Seite, kopier die neue URL und füg sie in OBS im Feld URL der Quelle über der alten ein. Bei Chat-Box, Emote-Wand, Sub Sprout, Subathon Timer, Stream-Alerts, Sub-Ziel, Chat-Umfrage, Stream-Rahmen, Socials und Stream-Countdown kannst du deine alte URL auf der Setup-Seite ins Feld Widget-URL einfügen, dann sind alle Einstellungen wieder da, und du musst nicht von vorn anfangen.',
    oldUrlsQ: 'Funktionieren meine alten Widget-URLs weiter?',
    oldUrlsA:
      'Ja. Updates werden so gebaut, dass bestehende URLs nicht kaputtgehen: Parameternamen, Werte und Standards bleiben gleich. Das alte keep=true in der Chat-Box heißt z. B. immer noch Für immer, und Sub Sprout liest immer noch die alten Parameter channel und platform.',
    privacyQ: 'Wo werden meine Einstellungen gespeichert, und wohin gehen meine Daten?',
    privacyA:
      'Deine Einstellungen stecken in der Widget-URL, nicht in einem Account oder einer Datenbank. Wer die URL hat, kann also dasselbe Widget öffnen. Wie bei jeder Website landet die Adresse der Seite, die du öffnest, bei unserem Hosting und kann in dessen Request-Logs auftauchen. Die Widgets lesen den Chat anonym direkt von Twitch und Kick, holen Emotes von 7TV, BetterTTV und FrankerFaceZ und Twitch-Kanalinfos von ivr.fi. Teilnehmer und Gewinner der Verlosung bleiben in deinem eigenen Browser. Die URL von OBS Bridge enthält dein OBS-WebSocket-Passwort, behandle sie also wie ein Passwort.',
    emptyQ: 'Warum sieht mein Widget in OBS leer aus?',
    emptyA:
      'Chat-Box und Emote-Wand bleiben transparent und leer, bis im Chat etwas passiert, schreib also zuerst eine Nachricht in den Chat. Ist dann immer noch nichts da, prüf, ob du ins Kanalfeld nur den Kanalnamen und keinen Link eingegeben hast und ob der Name richtig geschrieben ist. Die komplette Checkliste steht in der OBS-Anleitung.',
    bugQ: 'Wie wünsche ich mir ein Widget oder melde einen Bug?',
    bugA: 'Mach im Repository senchabot-opensource/monorepo auf GitHub ein neues Issue auf. Wenn du einen Bug meldest, gib die Widget-URL an (entferne das Passwort, falls eins drin ist), deine Streaming-Software und was du siehst. Für Ideen kannst du auch GitHub Discussions oder den Senchabot-Discord nutzen.',
    ctaTitle: 'Keine Antwort gefunden?',
    ctaText:
      'Die Anleitungen erklären Einrichtung und Fehlersuche Schritt für Schritt. Kommst du trotzdem nicht weiter? Meld dich bei uns auf GitHub.',
    ctaGuides: 'Zu den Anleitungen',
    ctaIssue: 'Issue auf GitHub aufmachen',
  },
  changelog: {
    breadcrumb: 'Changelog',
    title: 'Changelog',
    lead: 'Neue Features und Bugfixes in Senchabot Extensions, das Neueste zuerst. Die Liste ist aus der Commit-Historie des Projekts auf [GitHub](https://github.com/senchabot-opensource/monorepo/commits/dev/apps/extensions) zusammengestellt.',
    site: 'Website',
    entries: {
      moreLanguages:
        'Die Website gibt es jetzt auch auf Spanisch, Französisch, Deutsch, Japanisch und Portugiesisch, und Chat-Umfrage, Stream-Alerts und die Werte des Subathon Timers können ihre Wörter auch in diesen Sprachen zeigen.',
      countdownSceneCommand:
        'Neuer Chatbefehl `!countdown {scene} {duration}`. Mods können jetzt mit einem einzigen Befehl die aktuelle Szene wechseln (starting, break oder ending) und ihre Dauer festlegen.',
      socialsLaunch:
        'Neues Widget: Socials. Zeig deine Social-Media-Links abwechselnd mit einer schicken Slide-Animation.',
      thinBarReadable:
        'Der schmale Balken bei Subathon Timer und Sub-Ziel hat größeren Text mit Kontur, der auf jeder Füllung lesbar bleibt, ein kleineres Glühen und Platz über den Werten.',
      thinBars:
        'Subathon Timer und Sub-Ziel haben jetzt den Stil Schmaler Balken, der Titel und Zeit bzw. Zahl direkt in einen dünneren Fortschrittsbalken packt.',
      subathonAdjustedDefaults:
        'Werte nach Restzeit anpassen beim Subathon Timer startet jetzt bei 5 Stunden mit niedrigeren vorausgefüllten Werten: auf Twitch 5 Min. pro Sub, 10 Min. pro Gift-Sub und 20 Min. pro 500 Bits, auf Kick jeweils 10 Min.',
      subathonDynamicRates:
        'Der Subathon Timer hat jetzt anpassbare Werte: Leg eine Schwelle fest, ab der ein Sub weniger Zeit bringt, wenn schon viel auf der Uhr ist.',
      scrollHint:
        'Setup-Panels, die zu lang für den Screen sind, zeigen jetzt unten einen kleinen Pfeil, damit klar ist, dass weiter unten noch Einstellungen kommen. Klick drauf, um runterzuspringen, und am Ende dreht er sich um und bringt dich zurück nach oben.',
      chatTextShadow:
        'Die Chat-Box hat die Option Textschatten: Keiner, Normal (wie bisher) oder Stark, eine dunkle Kontur, die den Chat auf hellen Games lesbar hält.',
      chatFonts:
        'Die Chat-Box hat jetzt ein Schriftfeld für Namen und eins für Nachrichten, und beide bleiben auch mit Preset offen: Behalte die zwei Schriften des Presets, nimm seine Überschriftenschrift auch für die Nachrichten oder kombinier eine davon mit Inter, Roboto, Nunito, JetBrains Mono, Source Serif 4 oder deiner Systemschrift. Fette Namen und fette Nachrichten funktionieren jetzt auch bei Presets, deren Schrift nur eine Stärke hat, wie Realm, Dynasty und Blocks.',
      sproutSaved:
        'Sub Sprout behält seine Pflanze jetzt nach einem OBS-Neuladen und nimmt sie in den nächsten Stream mit, statt jedes Mal bei der ersten Stufe anzufangen. Mods können sie mit !grow reset neu starten.',
      countdown:
        "Neuer Stream-Countdown: eine Uhr für deine Szenen Gleich geht's los, Gleich zurück und Stream endet. Leg eine Dauer oder die Uhrzeit fest, zu der du live gehst, wähl ein Preset, und lass deine Mods ihn mit !countdown im Chat verlängern.",
      deviceTheme:
        'Die Website öffnet sich jetzt im hellen oder dunklen Theme deines Geräts und folgt ihm, wenn es sich ändert. Sobald du den Theme-Button oben klickst, wird deine Wahl gespeichert und das Gerät ändert sie nicht mehr.',
      frames:
        'Neue Stream-Rahmen: fertige Rahmen für deine Kamera, deinen Chat und deinen ganzen Stream-Screen. Jedes Preset bringt seine eigene Grafik mit, z. B. ein Pagodendach und Laternen bei Dynasty oder Pixelblöcke bei Blocks.',
      subathonRates:
        'Der Subathon Timer kann jetzt direkt auf dem Timer zeigen, was ein Sub, ein Gift-Sub und 500 Bits oder Kicks bringen, damit die Zuschauer wissen, was ihr Sub wert ist.',
      presets:
        'Neue Presets: ein Look für Chat-Box, Stream-Alerts, Sub-Ziel, Subathon Timer, Chat-Umfrage und den Gewinner der Verlosung, mit Game-Presets für League of Legends, World of Warcraft, Metin2, Dota 2, Valorant, CS2 und Minecraft.',
      poll: 'Neue Chat-Umfrage: Starte eine Umfrage im Chat mit !poll, und Zuschauer auf Twitch und Kick stimmen per Zahl ab. Live-Balken, ein Timer, eine Stimme pro Zuschauer und am Ende der Gewinner.',
      goal: 'Neues Sub-Ziel: ein Zielbalken, den jeder Sub, Resub und Gift-Sub auf Twitch und Kick um eins füllt, mit Pokal, wenn du es schaffst. Mods können die Zahl mit !goal korrigieren.',
      streamAlerts:
        'Neue Stream-Alerts: ein animierter Alert mit eigenem Sound für jeden Sub, Gift-Sub, Bits, Kicks und Raid auf Twitch und Kick. Wähl eine Farbe, benenn die Überschriften um und leg Mindestmengen fest.',
      subathon:
        'Neuer Subathon Timer: ein Countdown, den Subs, Gift-Subs, Bits und Kicks verlängern, als Lebensbalken, Uhr oder Ring. Du legst fest, wie viel Zeit jedes Event bringt, und Mods steuern ihn mit !subathon.',
      chatReader:
        'Neuer Chat-Reader: Lies deinen Twitch- und Kick-Chat in einem Browser-Tab oder einem OBS-Dock. Er verbindet sich mit Countdown von selbst neu, markiert jeden Abbruch im Chat und behält deinen Verlauf nach einem Neuladen.',
      chatSilentDrop:
        'Chat-Box, Emote-Wand und OBS Bridge merken, wenn die Chat-Verbindung nach einem Internetabbruch still wird, und verbinden sich von selbst neu, sofort sobald das Internet wieder da ist. Vorher konnte das Minuten dauern oder ein Neuladen brauchen.',
      contentPages: 'Neue Anleitungen, eine FAQ-Seite und dieser Changelog.',
      siteNav:
        'Jede Seite hat denselben Header und Footer: das Widget-Menü, Sprach- und Theme-Auswahl und Links zu Anleitungen und Support.',
      notFound: 'Eine URL, die es nicht gibt, öffnet eine 404-Seite mit Links zu jedem Widget.',
      geist: 'Die Seiten der Website nutzen Geist, dieselbe Schrift wie senchabot.com. Die Schriften der Overlays bleiben gleich.',
      chatNextSteps:
        'Kopierst du die Chat-Box-URL, zeigt die Setup-Seite die Schritte, um sie in OBS hinzuzufügen, samt empfohlener Größe.',
      raffleMonthsInput:
        'Das Feld Mindest-Sub-Monate in der Verlosung lässt sich beim Tippen leeren, aus 6 wird also nicht mehr 16.',
      raffleKeywordRequired:
        'Die Verlosung lässt sich nicht mehr mit leerem Keyword starten. Vorher konntest du eine Verlosung öffnen, bei der niemand mitmachen konnte.',
      raffleMonthsSubsOnly:
        'Mindest-Sub-Monate gilt nur, wenn Nur Subs an ist, und der Streamer kann bei seiner eigenen Verlosung mitmachen.',
      sproutPreviewSimulate:
        'Die Setup-Vorschau von Sub Sprout animiert das Wachstum weiter, nachdem du einen Kanal eingegeben hast, du siehst also sofort deine Pflanze und die Effekte.',
      sproutPreviewTint:
        'Der Vorschaubereich von Sub Sprout zeigt den vorgesehenen leicht transparenten Hintergrund statt Schwarz.',
      emoteWallUrl:
        'Das Setup der Emote-Wand schreibt keine falschen Werte mehr in die URL, wenn die Felder Dauer und Max. leer bleiben, und erstellt keine URLs ohne Kanal.',
      bridgePassword:
        'OBS Bridge schickt das Passwort auch, wenn die WebSocket-URL leer ist. Passwortgeschützte Verbindungen funktionieren jetzt, wenn OBS auf demselben PC läuft.',
      chatFilters:
        'Die Chat-Box kann Bots und Befehle mit ! ausblenden, Nachrichten zwischen 10 Sekunden und 5 Minuten oder für immer anzeigen und lässt dich die Emote-Anbieter einzeln auswählen.',
      chatEmoteProviders:
        'Die Chat-Box zeigt 7TV-, BTTV- und FFZ-Emotes in Twitch-Nachrichten und 7TV-Emotes in Kick-Nachrichten.',
      sproutKickGifts:
        'Sub Sprout wächst mit Gift-Subs auf Kick, und jeder Gift-Sub zählt als eine Stufe.',
      bridgeUserPlatform:
        'OBS Bridge speichert berechtigte Nutzer zusammen mit ihrer Plattform. Wer sich auf der anderen Plattform denselben Namen holt, kann keine Befehle mehr nutzen.',
      sevenTvActiveSet:
        'Chat-Box und Emote-Wand holen 7TV-Emotes aus dem aktiven Set des Kanals selbst. Vorher konnten Emotes von einem anderen Account mit ähnlichem Namen auftauchen.',
      chatColorCrash:
        'Die Chat-Box stürzt bei Nachrichten mit ungewöhnlichem Farbwert nicht mehr auf einen Fehlerbildschirm ab.',
      bridgeReconnect:
        'OBS Bridge macht alle 5 Sekunden genau einen Versuch, solange OBS zu ist oder das Passwort falsch ist. Die Verbindungsversuche vervielfachen sich nicht mehr.',
      raffleFakeEntries:
        'Die Verlosung zählt keine gefälschten Zeilen mehr, die in Sub-Nachrichten versteckt sind, damit niemand damit Nur Subs umgehen kann.',
      chatIrcParsing:
        'Text im Chat kann die Chat-Box nicht mehr leeren. Ein Timeout oder Bann entfernt nur die Nachrichten dieser Person.',
      chatHighlights:
        'Die Chat-Box hebt Nachrichten hervor, die dich taggen, Antworten, neue Chatter, Ankündigungen und Nachrichten mit Meine Nachricht hervorheben. Welche an sind, wählst du im Setup.',
      chatPasteUrl:
        'Fügst du eine bestehende Widget-URL ins Setup der Chat-Box ein, sind alle deine Einstellungen wieder da.',
      chatSingleScreen:
        'Die Setup-Seite der Chat-Box hat ein neues Layout, das auf einen Screen passt. Die Einstellungen sind in Kanal, Aussehen und Nachrichten gruppiert.',
      chatIconAlign:
        'Die Twitch- und Kick-Icons in der Chat-Box sind gleich groß und stehen auf einer Linie.',
      chatHideIndicator:
        'Die Chat-Box kann die Plattform-Anzeige komplett ausblenden, wenn der Farbstreifen allein reicht.',
      chatSmoothSpeed:
        'Die Chat-Box bekommt die Animation Weich von rechts gleiten, und die Setup-Vorschau eine Einstellung für das Chat-Tempo.',
      chatAdaptiveAnimations:
        'Animationen der Chat-Box werden kürzer, wenn der Chat schneller wird. Der Standard Von rechts gleiten sieht aus wie vorher.',
      chatTypewriter:
        'Die Chat-Box bekommt eine Schreibmaschinen-Animation. Kommt eine neue Nachricht, rutschen ältere Nachrichten zur Seite, statt zu springen.',
      chatPlatformStripe:
        'Die Plattform-Icons der Chat-Box sind größer, und du kannst links neben jeder Nachricht einen Streifen in der Farbe der Plattform hinzufügen.',
      emoteWallModes:
        'Die Emote-Wand bekommt einen Abprallen-Modus, der Emotes von den Rändern abprallen lässt, einen Hype-Modus und Schutz gegen Emote-Spam.',
      sproutPotLabel: 'Sub Sprout kann über dem Topf die Stufe anzeigen, z. B. 3/10.',
      emoteWallLaunch:
        'Die Emote-Wand ist da: Twitch- und Kick-Nachrichten nur aus Emotes fliegen im Modus Ruhig oder Chaos über den Screen.',
      sproutBothPlatforms:
        'Sub Sprout hört einem Twitch- und einem Kick-Kanal zusammen in einer URL zu. Alte URLs mit channel und platform funktionieren weiter.',
      chatPreviewMock:
        'Die Vorschau der Chat-Box spielt weiter einen Beispiel-Chat ab, nachdem du einen Kanal eingegeben hast, du siehst deine Einstellungen also, ohne dass jemand chattet.',
      siteLanguages:
        'Die Website gibt es auf Türkisch und Englisch, und du kannst zwischen hellem und dunklem Theme wechseln.',
      bridgeSceneCommand:
        'OBS Bridge bekommt den Befehl !scene, der zu jeder Szene mit passendem Namen wechselt. Außerdem kannst du jeden Befehl umbenennen.',
      raffleBots: 'Die Verlosung ignoriert Teilnahmen von bekannten Bots automatisch.',
      chatReadableColors:
        'Die Chat-Box hellt Namensfarben auf, die auf dunklem Hintergrund schwer lesbar sind, und die Schatten der Nachrichten sind leichter.',
      chatBoldBadges:
        'Die Chat-Box bekommt Nachrichten fett und eine Option, Badges auszublenden. Badges skalieren mit der Schriftgröße.',
      sproutWatering: 'Sub Sprout bekommt Gieß-Effekte mit Regen und Glitzer.',
      chatItemBackground:
        'Die Chat-Box bekommt eine Hintergrundbox pro Nachricht und eine Option für fette Namen. Bricht die Verbindung ab, verbindet sie sich von selbst wieder mit dem Chat.',
      bridgeLaunch:
        'OBS Bridge ist da: Berechtigte Nutzer können per Chatbefehl zur BRB- und Main-Szene wechseln und Stream und Aufnahme starten oder stoppen.',
      chatFade: 'Die Chat-Box bekommt eine Einblenden-Animation.',
      sproutVarieties:
        'Sub Sprout bekommt neue Pflanzensorten wie Rose, Sonnenblume, Kaktus, Tulpe und Lotus.',
      chatFontsLayouts:
        'In der Chat-Box kannst du Schrift, Nachrichten-Layout und Animation wählen. Gelöschte Nachrichten und Nachrichten von gebannten Nutzern verschwinden auch aus dem Overlay.',
      raffleHardening:
        'Die Verlosung zieht den Gewinner mit sicherem Zufall, sperrt die Regeln nach dem Start und lässt dich keinen Gewinner ziehen, bevor die Mindestdauer um ist.',
      siteTutorial:
        'Setup-Seiten verlinken ein Video-Tutorial. Auf der Verlosungsseite kopierst du die Overlay-URL mit einem Klick.',
      chatPlatformPick: 'In der Chat-Box wählst du, ob der Chat von Twitch, Kick oder beiden kommt.',
      chatSevenTv: 'Die Chat-Box zeigt 7TV-Emotes.',
      chatTimestamp:
        'In der Chat-Box wählst du Plattformname oder Icon, und sie kann die Uhrzeit der Nachrichten zeigen.',
      siteSetupPages: 'Eine neue Startseite ist live, und jedes Widget hat jetzt seine eigene Setup-Seite.',
      raffleLaunch:
        'Die Verlosung ist da: Zuschauer machen mit, indem sie ein Keyword in den Chat schreiben, du kannst ein Gewinnlimit pro Nutzer festlegen, und der Gewinner erscheint mit Konfetti im Stream.',
      chatBgOpacity: 'Die Deckkraft des dunklen Hintergrunds der Chat-Box ist einstellbar.',
      chatEmotesBadges: 'Die Chat-Box zeigt Twitch-Emotes und die Badges von Twitch und Kick.',
      chatOrientation:
        'Die Chat-Box läuft auch horizontal, du kannst sie also als Leiste unten am Screen platzieren.',
      sitePreview: 'Die Setup-Seite zeigt neben den Einstellungen eine Live-Vorschau des Widgets.',
      sproutKick: 'Sub Sprout zählt auch Kick-Subs.',
      launch:
        'Senchabot Extensions ist live, mit einer Chat-Box, die Twitch- und Kick-Chat zusammenführt, und Sub Sprout, einer Pflanze, die mit Twitch-Subs wächst.',
    },
  },
  socials: {
    breadcrumb: 'Socials einrichten',
    title: 'Socials einrichten',
    intro: 'Zeig deine Social-Media-Namen im Stream. Das Widget wechselt durch die Plattformen, die du ausfüllst, und zeigt mit einer Slide-Animation immer eine auf einmal.',
    sectionPlatforms: 'Plattformen',
    platformsTip: 'Gib für jede Plattform, die du zeigen willst, deinen Nutzernamen ein. Den Rest lässt du leer.',
    sectionAppearance: 'Aussehen',
    rotationInterval: 'Wechselintervall',
    intervalSeconds: '{seconds} Sekunden',
    textColor: 'Textfarbe',
    animation: 'Animation',
    animSlideUp: 'Nach oben gleiten',
    animSlideLeft: 'Nach links gleiten',
    animScale: 'Skalieren',
    animFade: 'Einblenden',
    pillColor: 'Hintergrundfarbe der Pille',
    previewTitle: 'Vorschau der Socials',
    previewIframeTitle: 'Vorschau der Socials',
    previewHint: 'Live-Vorschau deiner wechselnden Social-Media-Links.',
    widgetUrlTip: 'Schon ein Widget gebaut? Füg seine URL hier ein, um deine Einstellungen zu laden und nur das zu ändern, was du brauchst.',
    widgetUrlPlaceholder: 'Bestehende Widget-URL zum Bearbeiten einfügen',
    widgetUrlInvalid: 'Das ist keine Socials-URL.',
    browserSourceHintSize: ' (empfohlene Größe: 600×120).',
    guideTitle: 'Einrichtung in der Streaming-Software (OBS, Streamlabs, XSplit usw.)',
    guideStep1: 'Füge in deiner Streaming-Software eine Browser-Quelle hinzu (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio usw.).',
    guideStep2: 'Füge die kopierte Socials-URL ein.',
    guideStep3: 'Stell die Breite auf 600 und die Höhe auf 120.',
    faq1Q: 'Aktualisiert sich das Widget, wenn ich meine Nutzernamen ändere?',
    faq1A: 'Du musst deine URL aktualisieren. Komm auf diese Seite zurück, füg deine bestehende URL ein, um deine Einstellungen zu laden, gib deine neuen Nutzernamen ein und kopier die neue URL in deine Streaming-Software.',
  },
};
