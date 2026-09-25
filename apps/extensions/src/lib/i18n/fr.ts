import type { en } from './en';

export const fr: typeof en = {
  common: {
    freeBadge: '100 % gratuit · Sans connexion',
    copy: 'Copier',
    copied: 'Copié !',
    home: 'Accueil',
    watchTutorial: 'Voir le tuto',
    widgetUrl: 'URL du widget',
    toolUrl: "URL de l'outil",
    channelPlaceholder: 'ex. tachaine',
    previewNoChannel: "Renseigne au moins une chaîne pour générer l'aperçu.",
    browserSourceHint:
      'Colle cette URL comme source Navigateur web dans OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio ou tout logiciel qui gère les sources navigateur',
    themeToggle: 'Changer de thème',
    languageToggle: 'Changer de langue',
    moreInfo: "Plus d'infos",
    sectionChannel: 'Chaîne',
    sectionAppearance: 'Apparence',
    platforms: 'Plateformes',
    platformsTip:
      'Choisis la plateforme à écouter. Tu streames sur Twitch et Kick en même temps ? Choisis Les deux.',
    platformBoth: 'Les deux',
    twitchChannel: 'Chaîne Twitch',
    kickChannel: 'Chaîne Kick',
    channelTip:
      "Tape juste le nom de la chaîne, pas le lien complet. Pour twitch.tv/senchabot, c'est senchabot.",
    previewLoading: "Chargement de l'aperçu…",
    scrollMore: 'Fais défiler pour voir la suite',
    scrollTop: 'Retour en haut',
    setupGuideTitle: "Comment l'installer",
    faqTitle: 'Questions fréquentes',
    moreWidgets: 'Plus de widgets',
    nextSteps: {
      title: 'Ajoute-le maintenant à ton logiciel de stream',
      addSource:
        'Ajoute une nouvelle source Navigateur web dans OBS Studio ou toute appli qui gère les sources navigateur.',
      paste: "Colle l'URL dans le champ URL.",
      size: 'Règle la largeur sur {width} et la hauteur sur {height}.',
      test: "Ouvre l'URL dans un nouvel onglet pour vérifier qu'elle marche",
      dismiss: 'Masquer',
    },
    siteName: 'Senchabot Extensions',
    homeLink: 'Accueil de Senchabot Extensions',
    skipToContent: 'Aller au contenu',
    newTab: "(s'ouvre dans un nouvel onglet)",
    nav: {
      label: 'Principal',
      menu: 'Menu',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      widgets: 'Widgets',
      guides: 'Guides',
      presets: 'Presets',
      faq: 'FAQ',
      senchabot: 'Senchabot',
      github: 'Code source sur GitHub',
      switchWidget: 'Passer à un autre widget',
      breadcrumb: "Fil d'Ariane",
    },
    notFound: {
      title: 'Page introuvable',
      text: "Cette page n'existe pas ou a été déplacée. Choisis un widget ci-dessous ou retourne à l'accueil.",
      home: "Retour à l'accueil",
    },
    footer: {
      about:
        'Des overlays et outils de stream gratuits pour Twitch et Kick. Sans connexion, rien à télécharger, et le code est ouvert.',
      license: 'GPL-3.0, code source sur GitHub',
      social: 'Senchabot sur les réseaux sociaux',
      guides: 'Guides',
      setupGuides: "Guides d'installation",
      presets: 'Presets de jeux',
      faq: 'FAQ',
      changelog: 'Nouveautés',
      senchabotBot: 'Le bot Senchabot',
      docs: 'Documentation',
      discussions: 'GitHub Discussions',
      reportBug: 'Signaler un bug ou demander un widget',
      notAffiliated: 'Non affilié à Twitch ni à Kick.',
    },
  },
  widgets: {
    overlays: 'Overlays',
    tools: 'Outils',
    chatBox: {
      name: 'Boîte de chat',
      tagline:
        'Les chats Twitch et Kick réunis dans un seul overlay, avec les emotes 7TV, BTTV et FFZ.',
    },
    emoteWall: {
      name: "Mur d'emotes",
      tagline: "Les messages du chat faits uniquement d'emotes s'envolent sur ton écran.",
    },
    subSprout: {
      name: 'Sub Sprout',
      tagline: 'Une plante sur ton stream qui pousse un peu à chaque nouveau sub.',
    },
    goal: {
      name: 'Objectif de subs',
      tagline:
        "Une barre d'objectif que chaque sub et sub offert remplit, avec un trophée quand tu l'atteins.",
    },
    frames: {
      name: 'Cadres de stream',
      tagline:
        "Des cadres prêts à l'emploi pour ta caméra, ton chat et ton écran de stream, dessinés selon ton preset.",
    },
    countdown: {
      name: 'Compte à rebours de stream',
      tagline:
        'Un compte à rebours pour tes scènes de début, de pause et de fin, réglé par durée ou par heure.',
    },
    subathon: {
      name: 'Subathon Timer',
      tagline:
        'Un compte à rebours que les subs, subs offerts, Bits et Kicks repoussent. Barre de vie, horloge ou anneau.',
    },
    poll: {
      name: 'Sondage du chat',
      tagline:
        'Un sondage où ton chat vote en tapant un numéro, avec des barres en direct et un gagnant.',
    },
    streamAlerts: {
      name: 'Alertes de stream',
      tagline: 'Une alerte animée avec un son pour chaque sub, sub offert, Bits, Kicks et raid.',
    },
    raffle: {
      name: 'Tirage au sort',
      tagline:
        'Les viewers participent avec un mot-clé comme !join dans le chat, et tu tires le gagnant.',
    },
    obsBridge: {
      name: 'OBS Bridge',
      tagline:
        "Change de scène OBS et gère le stream et l'enregistrement avec des commandes du chat.",
    },
    socials: {
      name: 'Réseaux sociaux',
      tagline: 'Fais défiler tes liens de réseaux sociaux avec une animation soignée.',
    },
  },
  home: {
    heroTitle: 'Des overlays de stream gratuits pour Twitch et Kick',
    heroLead:
      'Configure un widget avec un aperçu en direct, puis colle une seule URL dans OBS. Pas de compte, pas de filigrane, et le code est open source.',
    browseWidgets: 'Voir les widgets',
    viewOnGithub: 'Voir sur GitHub',
    trustLabel: 'Points forts',
    trustFree: 'Gratuit',
    trustNoLogin: 'Sans connexion',
    trustOpenSource: 'Open source',
    trustPlatforms: 'Twitch + Kick',
    sceneLive: 'Live',
    sceneCaption: 'Démo en direct sur un chat de test',
    demoTitle: 'Démo : {name}',
    worksWithTitle: 'Où ça marche',
    worksWithApps: 'Logiciels de stream',
    worksWithAppsText: 'OBS Studio et les autres logiciels qui gèrent les sources navigateur',
    galleryTitle: 'Choisis un widget',
    galleryLead:
      'Chacun a sa propre page de configuration avec un aperçu en direct. Rien à télécharger.',
    overlaysLead: 'Des sources navigateur qui tournent toutes seules une fois dans ta scène.',
    toolsLead:
      'Des outils que tu pilotes toi-même pendant le stream, depuis une page ou depuis le chat.',
    setUp: 'Configurer',
    toolFeatures: 'Fonctionnalités',
    raffleFeatureKeyword: 'Mot-clé de participation comme !join',
    raffleFeatureSubs: 'Abonnés uniquement, avec un minimum de mois',
    raffleFeatureDuration: 'Durée minimale avant le tirage',
    obsFeatureScenes: 'Change de scène depuis le chat',
    obsFeatureCommands: 'Noms de commandes personnalisés',
    obsFeatureLocal: 'Connexion obs-websocket locale',
    subathonFeatureChat: 'Pilote-le depuis le chat avec !subathon',
    subathonFeaturePlatforms: 'Réglages de temps séparés pour Twitch et Kick',
    subathonFeatureSaved: "Le temps restant survit aux redémarrages d'OBS",
    pollFeatureVote: 'Les viewers votent en tapant un numéro',
    pollFeatureBoth: 'Les votes Twitch et Kick dans un seul sondage',
    pollFeatureLate: 'Les votes de dernière seconde comptent malgré le délai du stream',
    pollSpotlight: {
      eyebrow: 'Nouveau : Sondage du chat',
      title: 'Laisse ton chat décider',
      lead: "Lance un sondage depuis le chat avec !poll, et les viewers sur Twitch et Kick votent en tapant un numéro. Les barres se remplissent en direct sur le stream, et le gagnant s'affiche à la fin du temps.",
      pointVote:
        "Les viewers tapent 2, !vote 2 ou l'option elle-même. Chaque viewer compte une fois.",
      pointBoth: 'Les votes de Twitch et de Kick arrivent dans le même sondage.',
      pointLate:
        'Les votes tapés dans les dernières secondes comptent quand même, même si les viewers regardent avec un léger retard.',
      pointMods: 'Toi et tes modos le gérez depuis le chat. Pas de bot, pas de connexion.',
      setup: 'Configurer le Sondage du chat',
      guide: 'Lire le guide',
      chat: 'Chat',
      caption: 'Démo en direct avec des votants simulés',
    },
    visualScenes: 'Scènes',
    howTitle: 'Comment ça marche',
    howLead: 'Trois étapes, et aucune ne demande de compte.',
    howStep1:
      "Choisis un widget et ajuste ses réglages. L'aperçu en direct montre chaque changement tout de suite.",
    howStep2: "Tape le nom de ta chaîne et copie l'URL du widget.",
    howStep3:
      "Dans OBS Studio, ajoute une source Navigateur web, colle l'URL et règle la taille recommandée.",
    sizesTitle: 'Tailles recommandées pour la source navigateur',
    sizesNote: 'Largeur × hauteur, en pixels.',
    sizesWidget: 'Widget',
    sizesValue: 'Taille',
    trustTitle: 'Pas de compte, pas de piège',
    noLoginTitle: 'Sans connexion',
    noLoginText:
      'Les widgets lisent le chat public de ta chaîne comme un viewer non connecté. Tu ne connectes jamais ton compte Twitch ou Kick.',
    noWatermarkTitle: 'Pas de filigrane',
    noWatermarkText:
      "Rien n'est ajouté sur tes overlays. Ce que tu vois dans l'aperçu, c'est ce qui s'affiche sur le stream.",
    openSourceTitle: 'Open source',
    openSourceText:
      'Tout le code est sur GitHub sous licence GPL-3.0. Lis-le, forke-le ou propose un correctif.',
    urlSettingsTitle: "Tes réglages sont dans l'URL",
    urlSettingsText:
      "Les réglages du widget sont écrits dans l'URL elle-même, donc pas besoin de compte pour les garder. Garde l'URL et tu as toujours ton widget.",
    senchabotTitle: "Besoin d'un bot de chat aussi ? Essaie Senchabot",
    senchabotText:
      "L'équipe derrière ces widgets fait aussi Senchabot : commandes de chat personnalisées, timers et shoutouts sur Twitch, plus une annonce de live sur ton serveur Discord.",
    senchabotCta: 'Aller sur senchabot.com',
    communityTitle: 'Participe',
    communityLead: "C'est open source, et il y a quelques façons simples d'aider.",
    starTitle: 'Mets une étoile sur GitHub',
    starText: 'Les étoiles aident plus de streamers à trouver le projet.',
    starCount: '{count} étoiles',
    requestTitle: 'Demande un widget',
    requestText:
      "Il te manque quelque chose pour ton stream ? Ouvre une issue et dis-nous ce qu'il te faut.",
    discordTitle: 'Rejoins le Discord',
    discordText: "Pose tes questions et partage ton setup avec d'autres streamers.",
    faqMore: "Tu n'as pas trouvé ta réponse ?",
    faq1Q: "C'est vraiment gratuit ?",
    faq1A:
      "Oui. Tous les widgets et outils sont gratuits, sans offre payante et sans filigrane sur tes overlays. Le projet est open source et fait par l'équipe Senchabot.",
    faq2Q: 'Que veut dire "sans connexion" concrètement ?',
    faq2A:
      'Tu ne te connectes jamais et tu ne relies jamais ton compte Twitch ou Kick. Tu tapes le nom de ta chaîne, et le widget lit le chat public de cette chaîne de façon anonyme, comme un viewer non connecté. Il voit donc ce que tout le monde peut voir dans le chat, et rien de plus.',
    faq3Q: 'Avec quels logiciels de stream ça marche ?',
    faq3A:
      "OBS Studio et les autres logiciels qui gèrent les sources navigateur. Ajoute l'URL du widget comme source Navigateur web et utilise la taille indiquée sur la page de configuration.",
    faq4Q: 'Je peux utiliser Twitch et Kick ensemble ?',
    faq4A:
      "Oui. Boîte de chat, Mur d'emotes, Sub Sprout, Subathon Timer, Alertes de stream, Objectif de subs, Sondage du chat et Compte à rebours de stream prennent une chaîne Twitch et une chaîne Kick dans la même URL. OBS Bridge peut aussi écouter les deux chats à la fois. Le Tirage au sort fonctionne sur une seule plateforme à la fois.",
    faq5Q: 'Comment modifier un widget plus tard ?',
    faq5A:
      "Ouvre sa page de configuration, règle-le comme tu veux et remplace l'URL dans ta source Navigateur web. Boîte de chat, Mur d'emotes, Sub Sprout, Subathon Timer, Alertes de stream, Objectif de subs, Sondage du chat, Cadres de stream, Réseaux sociaux et Compte à rebours de stream peuvent aussi ouvrir une URL existante : colle-la sur la page de configuration, tes réglages reviennent, et tu ne changes que ce dont tu as besoin.",
    faq6Q: 'Mon URL de widget marchera toujours après les mises à jour ?',
    faq6A:
      "Oui. Les mises à jour gardent les réglages d'URL existants et leurs valeurs, donc un widget déjà dans ta scène n'a pas besoin d'une nouvelle URL.",
  },
  chatWidget: {
    breadcrumb: 'Configuration de la Boîte de chat',
    title: 'Configuration de la Boîte de chat',
    intro:
      "Un widget multi-chat qui réunit les chats Twitch et Kick dans un seul overlay. Les emotes 7TV marchent sur les deux plateformes, BTTV et FFZ sur Twitch, et les badges s'affichent aussi. Tu choisis la mise en page, la police et l'animation.",
    platformIndicator: 'Indicateur de plateforme',
    platformName: 'Nom de la plateforme',
    platformIcon: 'Icône de la plateforme',
    platformHidden: 'Masquer la plateforme',
    sectionMessages: 'Messages',
    platformsTip:
      'Choisis les plateformes dont tu veux le chat. Sélectionne les deux pour réunir les messages Twitch et Kick dans un seul flux.',
    platformIndicatorTip:
      "Quand les deux plateformes sont actives, montre d'où vient chaque message : le nom de la plateforme, son icône, ou rien.",
    orientationTip:
      "Vertical empile les messages les uns sur les autres, comme une boîte de chat classique. Horizontal les aligne côte à côte, parfait pour une bande en bas de l'écran.",
    darkBackgroundTip:
      'Ajoute un fond noir semi-transparent derrière le widget. Le texte se lit mieux sur les scènes claires.',
    emotesTip:
      "Les emotes des fournisseurs cochés s'affichent en images, les autres en texte brut. 7TV marche sur Twitch et Kick, BTTV et FFZ seulement sur Twitch.",
    messageDurationTip:
      'Les messages disparaissent après ce délai. Choisis "Pour toujours" pour les garder à l\'écran, les nouveaux poussant les anciens vers le haut.',
    hideBotsTip:
      'Masque les messages des bots courants comme Nightbot, StreamElements, Fossabot, BotRix et KickBot, ainsi que les comptes avec le badge "Chat Bot" de Twitch ou le badge "Bot" de Kick.',
    hideCommandsTip: 'Masque les messages qui commencent par "!", comme !discord ou !uptime.',
    badgesTip: 'Affiche les badges diffuseur, modérateur, VIP et abonné à côté des pseudos.',
    animationTip:
      "Définit comment les nouveaux messages entrent à l'écran. Les animations raccourcissent toutes seules quand le chat s'accélère.",
    usernameFont: 'Police des pseudos',
    messageFont: 'Police des messages',
    fontSystem: 'Police du système',
    textShadow: 'Ombre du texte',
    textShadowTip:
      "Un contour sombre derrière les pseudos et les messages. Forte souligne chaque lettre pour que le chat reste lisible sur les jeux clairs ; Aucune l'enlève, même celle d'un preset.",
    shadowNone: 'Aucune',
    shadowNormal: 'Normale',
    shadowStrong: 'Forte',
    messageLayout: 'Mise en page des messages',
    layoutInline: 'En ligne (pseudo : message)',
    layoutStacked: 'Empilée (pseudo au-dessus)',
    layoutCard: 'Carte / Bulle',
    layoutCompact: 'Compacte (style Twitch)',
    newMessageAnimation: 'Animation des nouveaux messages',
    animSlide: 'Glissement depuis la droite + fondu',
    animSmoothSlide: 'Glissement doux depuis la droite',
    animPop: 'Pop / zoom',
    animBounce: 'Rebond',
    animStagger: 'Décalé (infos puis message)',
    animFade: 'Fondu',
    animTyping: 'Machine à écrire',
    animNone: 'Aucune animation',
    orientation: 'Orientation',
    vertical: 'Vertical',
    horizontal: 'Horizontal',
    fontSize: 'Taille de police (px)',
    darkBackground: 'Fond sombre',
    emotes: 'Emotes',
    emotesNone: 'Désactivées',
    messageDuration: 'Durée des messages',
    durationSeconds: '{count} s',
    durationMinutes: '{count} min',
    durationKeep: 'Pour toujours',
    hideBots: 'Masquer les bots',
    hideCommands: 'Masquer les commandes',
    showBadges: 'Afficher les badges',
    showMessageTime: "Afficher l'heure des messages",
    backgroundOpacity: 'Opacité du fond',
    messageBackgroundBox: 'Fond par message',
    messageBackgroundHint: 'Chaque message a son propre fond avec une bordure.',
    platformAccent: 'Bande de couleur de la plateforme',
    platformAccentHint:
      "Une bande violette Twitch ou verte Kick à gauche montre d'où vient chaque message.",
    boldUsernames: 'Pseudos en gras',
    boldMessages: 'Messages en gras',
    highlights: 'Mises en avant',
    highlightsTip:
      "Choisis quels messages ont une fine barre de couleur sur le stream. Les réponses montrent à qui elles répondent, et celles marquées Twitch n'existent que sur Twitch.",
    highlightMention: 'Mentions',
    highlightReply: 'Contexte des réponses',
    highlightFirstMessage: 'Premiers messages',
    highlightAnnouncement: 'Annonces',
    highlightHighlighted: 'Mettre mon message en évidence',
    highlightsAll: 'Tout',
    highlightsNone: 'Désactivé',
    announcement: 'Annonce',
    firstMessage: 'Premier message',
    previewTitle: 'Aperçu du widget (Boîte de chat)',
    previewIframeTitle: 'Aperçu du widget de chat',
    previewSpeed: "Vitesse du chat dans l'aperçu",
    previewSpeedValue: '{rate} msg/s',
    previewSpeedHint: "Ne change que l'aperçu. L'URL de ton widget reste la même.",
    previewHint: 'Aperçu du chat en direct avec un flux de messages animé.',
    guideTitle:
      'Installer la Boîte de chat dans ton logiciel de stream (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Ajoute une source Navigateur web dans ton logiciel de stream (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: "Colle l'URL du widget multi-chat que tu as copiée.",
    guideStep3:
      'Règle la largeur et la hauteur selon la taille voulue pour ta boîte de chat (ex. 400×600 en vertical).',
    browserSourceHintSize: ' (taille recommandée : 400×600 pour la boîte de chat).',
    widgetUrlTip:
      'Tu as déjà un widget ? Colle son URL ici pour charger tes réglages et changer ce dont tu as besoin.',
    widgetUrlPlaceholder: 'Colle une URL de widget existante pour la modifier',
    widgetUrlInvalid: "Ce n'est pas une URL de Boîte de chat.",
    openReader: 'Ouvrir le Lecteur de chat',
    openReaderHint:
      'Lis ton propre chat dans un onglet du navigateur ou un dock OBS. Il se reconnecte tout seul, signale chaque coupure et garde ton historique après un rafraîchissement.',
    faq1Q: 'Faut-il se connecter à Twitch ou Kick pour utiliser la boîte de chat ?',
    faq1A:
      "Aucune connexion n'est nécessaire. La Boîte de chat écoute anonymement le chat public des deux plateformes.",
    faq2Q: 'Ce widget multi-chat gère-t-il les emotes 7TV ?',
    faq2A:
      "Oui. Les emotes 7TV de la chaîne et globales s'affichent dans les messages Twitch et Kick, et les emotes BTTV et FFZ seulement dans les messages Twitch. Les trois sont activés par défaut, et tu peux désactiver chacun dans le menu Emotes.",
  },
  chatReader: {
    title: 'Lecteur de chat',
    listLabel: 'Messages du chat',
    noChannel:
      "Ce lien n'a pas de chaîne. Ouvre le Lecteur de chat depuis la page de configuration de la Boîte de chat.",
    empty: 'En attente de messages dans {channels}…',
    statusConnecting: 'Connexion',
    statusConnected: 'Connecté',
    statusReconnecting: 'Reconnexion',
    notFound: 'Chaîne introuvable',
    networkOffline: "Tu es hors ligne. Le chat se reconnecte tout seul dès qu'Internet revient.",
    retryIn: 'Connexion au chat {platform} perdue. Nouvel essai dans {seconds} s.',
    retrying: 'Connexion au chat {platform} perdue. Nouvel essai en cours…',
    retryNow: 'Réessayer',
    fontSmaller: 'Texte plus petit',
    fontLarger: 'Texte plus grand',
    timestamps: "Afficher l'heure des messages",
    clear: "Effacer l'historique",
    clearConfirm: 'Clique encore pour effacer',
    deleted: '(supprimé)',
    backToLive: 'Revenir au chat en direct',
    newMessage: '{count} nouveau message',
    newMessages: '{count} nouveaux messages',
    eventConnected: 'Connecté au chat {platform} : {channel}',
    eventDisconnected: 'Connexion au chat {platform} perdue',
    eventReconnected: 'De retour sur le chat {platform} après {duration}',
    eventNetworkLost: 'Connexion Internet perdue',
    eventNetworkBack: 'Connexion Internet rétablie',
    eventChatCleared: 'Un modérateur a vidé le chat {platform}',
    eventResumed: "Sauvegardé depuis ta dernière visite, jusqu'à {time}",
    durationSeconds: '{seconds} s',
    durationMinutes: '{minutes} min {seconds} s',
    durationHours: '{hours} h {minutes} min',
  },
  obsBridge: {
    breadcrumb: "Configuration d'OBS Bridge",
    title: "Configuration d'OBS Bridge",
    intro:
      'Laisse les personnes de confiance changer de scène OBS et lancer ou arrêter ton stream et ton enregistrement depuis le chat Twitch ou Kick. Le bridge tourne dans un onglet du navigateur ou un dock OBS et parle directement à OBS.',
    sectionChannels: 'Chaînes',
    sectionUsers: 'Utilisateurs autorisés',
    usersLabel: 'Pseudos du chat',
    usersTip:
      "Seules les personnes de cette liste peuvent lancer des commandes. Avec une liste vide, personne ne peut, même pas toi. Sur Twitch, le nom est comparé au login, le nom dans l'URL de la chaîne.",
    usersEmpty: "Personne pour l'instant, donc personne ne peut lancer de commandes.",
    userPlatform: 'Plateforme',
    addUser: 'Ajouter',
    userPlaceholder: 'pseudo',
    removeUser: 'Retirer {name}',
    assignUser: 'Faire de {name} un utilisateur {platform}',
    pickPlatformWarning:
      "Twitch et Kick sont tous les deux connectés, alors choisis une plateforme pour chaque nom en jaune. Ils ne peuvent pas lancer de commandes tant que ce n'est pas fait.",
    sectionCommands: 'Commandes',
    commandsHint:
      'Le message entier doit correspondre à la commande, les majuscules ne comptent pas. Laisse un champ vide pour garder la valeur par défaut.',
    label: {
      cmdScene: 'Changer de scène',
      cmdBrb: 'Scène BRB',
      cmdBack: 'Retour à la principale',
      cmdStartStream: 'Lancer le stream',
      cmdStopStream: 'Arrêter le stream',
      cmdStartRecord: "Lancer l'enregistrement",
      cmdStopRecord: "Arrêter l'enregistrement",
    },
    action: {
      cmdScene: 'Passe à la scène que tu nommes, comme {example}',
      cmdBrb: 'Passe à ta scène BRB',
      cmdBack: 'Revient à ta scène principale',
      cmdStartStream: 'Lance le stream',
      cmdStopStream: 'Termine le stream',
      cmdStartRecord: "Lance l'enregistrement",
      cmdStopRecord: "Arrête l'enregistrement",
    },
    sceneArg: '<nom>',
    sceneTip:
      "Tape la commande, un espace et un nom de scène, comme !scene Gaming. Une scène avec exactement ce nom passe en premier, sinon c'est la première dont le nom le contient.",
    brbTip:
      "Passe à la scène BRB que tu choisis sur la page de l'outil. Elle n'a pas de ! par défaut, donc n'importe qui dans la liste qui tape juste brb change de scène.",
    backTip:
      "Revient à la scène principale que tu choisis sur la page de l'outil. Comme brb, elle n'a pas de ! par défaut.",
    sectionConnection: 'Connexion à OBS',
    wsUrl: 'URL WebSocket',
    wsUrlTip:
      'Utile seulement si OBS tourne sur un autre ordinateur ou si tu as changé le port. Laisse vide pour ws://127.0.0.1:4455.',
    wsUrlPlaceholder: 'ws://127.0.0.1:4455 (par défaut)',
    wsPassword: 'Mot de passe WebSocket',
    wsPasswordTip:
      "Tu le trouves dans OBS sous Outils → Paramètres du serveur WebSocket → Afficher les informations de connexion. Il est enregistré dans l'URL de l'outil, alors traite ce lien comme un mot de passe.",
    wsPasswordPlaceholder: "Laisse vide s'il n'y en a pas",
    previewTitle: "Aperçu de l'outil",
    previewIframeTitle: "Aperçu d'OBS Bridge",
    summaryNotListening:
      "Aucune chaîne {platform} n'est définie, donc {names} ne peut pas encore lancer de commandes.",
    summaryNoChannel: "Pas encore de chaîne. Ajoute d'abord une chaîne Twitch ou Kick.",
    openTool: "Ouvrir l'outil",
    openToolHint:
      'Ouvre le bridge en direct dans un nouvel onglet. Il se connecte à OBS et à ton chat tout de suite.',
    toolUrlTip:
      'Elle contient ton mot de passe OBS, alors traite-la comme tel : ne la partage pas et ne la montre pas en stream.',
    toolUrlHint:
      "Ouvre-la dans un onglet du navigateur ou un dock Internet personnalisé d'OBS et garde-la ouverte pendant ton stream.",
    nextOpen:
      'Ouvre-la dans un onglet du navigateur, ou colle-la dans un dock Internet personnalisé dans OBS.',
    nextKeepOpen:
      'Choisis tes scènes principale et BRB là-bas et garde la page ouverte pendant ton stream.',
    guideStep1:
      'Dans OBS, ouvre Outils → Paramètres du serveur WebSocket, active le serveur WebSocket et copie le mot de passe depuis Afficher les informations de connexion.',
    guideStep2:
      "Renseigne ta chaîne, les personnes autorisées à lancer des commandes et le mot de passe, puis copie l'URL de l'outil.",
    guideStep3:
      "Ouvre l'URL dans un onglet du navigateur ou un dock Internet personnalisé d'OBS et choisis tes scènes principale et BRB.",
    guideStep4:
      "Tu utilises un dock ? Après avoir choisi les scènes, clique sur Copier l'URL à jour et colle-la dans le dock, car un dock ouvre toujours l'URL avec laquelle il a été créé.",
    faq1Q: 'Comment marche la commande de chat !scene ?',
    faq1A:
      "Quelqu'un de ta liste tape la commande, un espace et un nom de scène, comme !scene Gaming. OBS Bridge cherche d'abord une scène avec exactement ce nom, sans tenir compte des majuscules, puis la première scène dont le nom le contient, et bascule dessus.",
    faq2Q: 'Mon mot de passe WebSocket OBS est-il en sécurité ?',
    faq2A:
      "La connexion à OBS va directement de ton navigateur à OBS. Mais le mot de passe est enregistré dans l'URL de l'outil, et ouvrir cette URL charge la page depuis extensions.senchabot.com avec le mot de passe dedans. Traite donc le lien comme un mot de passe : ne le partage pas et ne le montre pas en stream.",
    faq3Q: 'Pourquoi mes choix de scènes ont disparu dans le dock OBS ?',
    faq3A:
      "Les choix de scènes et les changements d'utilisateurs sont enregistrés dans l'URL de la page de l'outil. Un onglet du navigateur les garde si tu mets la page en favori, mais un dock OBS ouvre toujours l'URL avec laquelle il a été créé. Clique sur Copier l'URL à jour sur la page de l'outil et colle la nouvelle URL dans le dock.",
    tool: {
      title: 'OBS Bridge',
      connectionsTitle: 'Connexions',
      status: {
        connecting: 'Connexion',
        connected: 'Connecté',
        failed: 'Connexion impossible',
        disconnected: 'Déconnecté',
      },
      obsConnecting: 'Connexion à {url}…',
      obsConnected: '{url} · connecté depuis {time}',
      obsUnreachable:
        'Pas de réponse de {url}. OBS est-il ouvert, et le serveur est-il activé dans Outils → Paramètres du serveur WebSocket ?',
      obsWrongPassword:
        "OBS n'a pas accepté le mot de passe. Le mot de passe dans l'URL doit correspondre à ton mot de passe WebSocket OBS.",
      obsNeedsPassword:
        "OBS demande un mot de passe, mais cette URL n'en a pas. Saisis ton mot de passe WebSocket sur la page de configuration et utilise la nouvelle URL.",
      obsRefused: 'OBS a refusé la connexion : {reason}',
      obsClosed:
        "Connexion à OBS perdue. OBS a peut-être été fermé, ou son serveur WebSocket s'est arrêté.",
      retryIn: 'Tentative {attempt} dans {seconds} s',
      retrying: 'Nouvelle tentative…',
      retryNow: 'Réessayer',
      chat: {
        connecting: 'Connexion',
        connected: "À l'écoute",
        reconnecting: 'Déconnecté',
      },
      chatRetryIn: 'Reconnexion dans {seconds} s',
      chatNotFound: 'Introuvable',
      kickNotFound:
        'Impossible de trouver une chaîne Kick nommée "{channel}". Vérifie le nom de la chaîne.',
      activityTitle: 'Commandes récentes',
      activityEmpty:
        "Aucune commande pour l'instant. Elles s'affichent ici dès qu'un utilisateur autorisé en tape une dans le chat.",
      activityScene: 'Passé sur {scene}',
      activityStartStream: 'Stream lancé',
      activityStopStream: 'Stream arrêté',
      activityStartRecord: 'Enregistrement lancé',
      activityStopRecord: 'Enregistrement arrêté',
      activityNoScene: 'Aucune scène ne correspond à "{query}"',
      activityOffline: "Non exécutée car OBS n'était pas connecté",
      activityFailed: 'OBS a renvoyé une erreur : {message}',
      scenesTitle: 'Scènes',
      scenes: 'Scènes ({count})',
      fetchingScenes: 'Chargement de la liste des scènes…',
      scenesOffline: "La liste des scènes s'affiche une fois OBS connecté.",
      mainScene: 'Scène principale',
      brbScene: 'Scène BRB',
      notSelected: 'Non choisie',
      main: 'Principale',
      brb: 'BRB',
      setMain: 'Utiliser {scene} comme scène principale',
      setBrb: 'Utiliser {scene} comme scène BRB',
      assignMainBrbWarning:
        "Choisis une scène principale et une scène BRB ci-dessous, sinon {brb} et {back} n'ont nulle part où aller.",
      assignMainWarning:
        "Choisis une scène principale ci-dessous, sinon {back} n'a nulle part où aller.",
      assignBrbWarning: "Choisis une scène BRB ci-dessous, sinon {brb} n'a nulle part où aller.",
      sceneHint:
        "Clique sur Principale ou BRB à côté d'une scène pour l'assigner. Toute autre scène marche avec {command}.",
      usersCount: 'Utilisateurs autorisés ({count})',
      copyUrl: "Copier l'URL à jour",
      copyUrlHint:
        "Les choix de scènes et les changements d'utilisateurs sont enregistrés dans l'URL de cette page. Un dock OBS ouvre toujours l'URL avec laquelle il a été créé, alors colle celle que tu as copiée dans les réglages du dock.",
      copyUrlManual: "La copie a échoué. Sélectionne l'URL ci-dessous et copie-la toi-même.",
      commands: 'Commandes du chat',
      footer:
        "Garde cette page ouverte pendant ton stream. Le bridge s'arrête quand elle se ferme.",
    },
  },
  subSprout: {
    breadcrumb: 'Configuration de Sub Sprout',
    title: 'Configuration de Sub Sprout',
    intro:
      "Un overlay de plante d'objectif d'abonnés personnalisable qui monte de niveau à chaque nouvel abonnement sur Twitch ou Kick.",
    sectionPlant: 'Plante',
    plantVariety: 'Variété de plante',
    plantVarietyTip:
      "Chaque sub fait pousser la plante d'un stade. Plus elle a de stades, plus il faut de subs pour qu'elle pousse entièrement.",
    stagesSuffix: '{stages} stades',
    selectionMode: 'Changement de plante',
    selectionModeTip:
      "Après le dernier stade, la plante recommence : la même plante, la suivante dans la liste, ou une autre au hasard. Dans l'ordre et Au hasard ne choisissent jamais la Vigne grimpante.",
    fixed: 'Même plante',
    cycle: "Dans l'ordre",
    random: 'Au hasard',
    wateringEffect: "Effet d'arrosage",
    wateringEffectTip:
      "Joue une courte animation de pluie ou d'étincelles à chaque fois que la plante pousse. La Vigne grimpante ne l'affiche pas.",
    showSubCountEffect: 'Afficher le nombre de subs',
    subCountTip:
      "Montre combien de subs sont arrivés d'un coup, comme x5 pour un pack de 5 subs offerts.",
    showPotLabel: 'Afficher le stade sur le pot',
    potLabelTip: "Écrit le stade sur le pot, comme 3/10. La Vigne grimpante ne l'affiche pas.",
    previewTitle: "Aperçu de la plante d'objectif d'abonnés",
    previewIframeTitle: 'Aperçu de Sub Sprout',
    previewSpeed: "Vitesse de pousse dans l'aperçu",
    previewSpeedValue: '{rate}×',
    previewHint:
      "L'aperçu pousse avec des subs simulés. En stream, ta plante pousse avec les vrais subs, resubs et subs offerts de ta chaîne.",
    widgetUrlTip:
      'Tu as déjà un widget ? Colle son URL ici pour charger tes réglages et changer ce dont tu as besoin.',
    widgetUrlPlaceholder: 'Colle une URL de widget existante pour la modifier',
    widgetUrlInvalid: "Ce n'est pas une URL de widget Sub Sprout.",
    browserSourceHintSize: ' (taille recommandée : 800×600).',
    guideTitle: 'Installation dans ton logiciel de stream (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Ajoute une source Navigateur web dans ton logiciel de stream (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: "Colle l'URL de la plante d'objectif d'abonnés que tu as copiée.",
    guideStep3: 'Règle la largeur sur 800 et la hauteur sur 600.',
    guideStep4:
      'Le streamer et les modos peuvent taper !grow dans le chat pour la faire pousser à la main, ou !grow reset pour faire recommencer la plante.',
    faq1Q: "Faut-il se connecter pour utiliser la plante d'objectif d'abonnés ?",
    faq1A:
      "Pas d'inscription ni de connexion OAuth. Sub Sprout se connecte anonymement en écoutant les événements du chat public.",
    faq2Q: "Que se passe-t-il quand la plante d'objectif d'abonnés a fini de pousser ?",
    faq2A:
      'Une fois la plante adulte, le sub suivant la fait recommencer selon ton réglage Changement de plante : la même plante, la variété suivante, ou une au hasard.',
    faq3Q: 'La plante recommence-t-elle quand la source navigateur se recharge ?',
    faq3A:
      "Non. La plante est enregistrée dans OBS, donc elle garde son stade après un rechargement, un changement de scène et jusqu'au stream suivant. Pour la faire recommencer, demande à un modo de taper !grow reset dans le chat.",
  },
  subathon: {
    breadcrumb: 'Configuration du Subathon Timer',
    title: 'Configuration du Subathon Timer',
    intro:
      "Un timer de subathon pour Twitch et Kick. Il compte à rebours, et chaque sub, sub offert, cheer de Bits ou envoi de Kicks ajoute du temps. Affiche-le comme une barre de vie façon jeu vidéo qui se vide jusqu'à zéro, une grande horloge ou un anneau, et tu décides combien de temps chacun ajoute.",
    style: 'Style',
    styleTip:
      'Barre de vie se vide de 100 % vers zéro comme un personnage de jeu. Barre fine met le titre et le temps dans une barre plus mince. Horloge affiche de grands chiffres. Anneau affiche un cercle qui se vide.',
    styleBar: 'Barre de vie',
    styleThin: 'Barre fine',
    styleClock: 'Horloge',
    styleRing: 'Anneau',
    color: 'Couleur',
    colorTip:
      "Vie passe du vert à l'orange puis au rouge à mesure que le temps s'écoule. Les autres gardent une seule couleur.",
    colors: {
      hp: 'Vie (vert à rouge)',
      green: 'Vert',
      purple: 'Violet',
      red: 'Rouge',
      gold: 'Or',
      cyan: 'Cyan',
      pink: 'Rose',
    },
    titleLabel: 'Titre',
    titleTip: 'Affiché à côté du timer. Laisse vide pour ne pas afficher de titre.',
    titlePlaceholder: 'Pas de titre',
    showPercent: 'Afficher le pourcentage',
    showPercentTip:
      "Montre à quel point le timer est rempli. 100 % correspond au temps le plus haut atteint jusqu'ici, donc il ne dépasse jamais.",
    showPops: 'Afficher le temps ajouté',
    showPopsTip: 'Fait monter un +1:00 avec le pseudo du viewer à chaque ajout de temps.',
    sectionTimer: 'Timer',
    startTime: 'Temps de départ',
    startTimeTip:
      "Le point de départ du timer. Il ne s'applique qu'à un nouveau subathon : pour recommencer avec une nouvelle valeur, tape !subathon reset dans le chat.",
    maxTime: 'Temps maximum',
    maxTimeTip:
      "Le timer ne dépasse jamais cette valeur. Le temps qui irait au-delà n'est pas ajouté.",
    maxTimeOff: 'Pas de limite',
    startMode: 'Démarrage',
    startModeTip:
      "Avec la commande, le timer attend en pause jusqu'à ce que toi ou un modo la tapiez dans le chat. Tout de suite le lance dès que l'overlay se charge dans OBS.",
    startCommand: 'Avec {command}',
    startAuto: 'Tout de suite',
    sectionValues: 'Temps ajouté',
    valuesHint: "Mets l'un d'eux à 0 pour le désactiver.",
    dynamicRates: 'Ajuster selon le temps',
    dynamicRatesTip:
      'Utilise une deuxième série de valeurs quand il reste assez de temps au compteur.',
    shiftAt: 'Seuil',
    shiftAtTip:
      "Tant que le temps restant est égal ou supérieur à ce seuil, la deuxième série de valeurs s'applique.",
    tier2Rates: 'Au-dessus du seuil',
    perSub: 'Par sub',
    perSubTip: "Chaque nouveau sub et resub. Sur Twitch, c'est un sub Niveau 1 ou Prime.",
    perSubKickTip: 'Chaque nouveau sub et resub.',
    perGift: 'Par sub offert',
    perGiftTip:
      'Compté pour chaque sub du cadeau, donc 5 subs offerts ajoutent cette valeur cinq fois.',
    perBits: 'Par 500 Bits',
    perBitsTip:
      "À peu près le prix d'un sub. Les autres montants ajoutent leur part, donc 100 Bits ajoutent un cinquième.",
    perKicks: 'Par 500 Kicks',
    perKicksTip: 'Les autres montants ajoutent leur part, donc 100 Kicks ajoutent un cinquième.',
    showRates: 'Afficher sur le timer',
    showRatesTip:
      "Liste ce qu'ajoutent un sub, un sub offert et 500 Bits ou Kicks, pour que les viewers sachent ce que vaut leur sub. Les valeurs à 0 ne sont pas affichées. Quand Twitch et Kick ont des valeurs différentes, elles s'affichent à tour de rôle.",
    ratesLanguage: 'Langue du timer',
    ratesLanguageTip:
      'La langue des mots affichés, comme "Sub offert" et "min". L\'URL OBS la garde, quelle que soit la langue d\'OBS.',
    rateSub: 'Sub',
    rateGift: 'Sub offert',
    rateBits: '{amount} Bits',
    rateKicks: '{amount} Kicks',
    rateBitsKicks: '{amount} Bits/Kicks',
    tiers: 'Niveaux 2 et 3 comptent plus',
    tiersTip:
      'Sur Twitch, un sub Niveau 2 ajoute le temps de 2 subs et un sub Niveau 3 celui de 5, en fonction de leur prix.',
    unitHours: 'h',
    unitMinutes: 'min',
    sectionCommands: 'Commandes du chat',
    commandsIntro: 'Toi et tes modos pilotez le timer depuis le chat Twitch ou Kick.',
    cmdStart: 'Lance ou relance le timer',
    cmdPause: 'Le met en pause',
    cmdAdd: 'Ajoute du temps',
    cmdRemove: 'Retire du temps',
    cmdSet: 'Définit le temps restant',
    cmdReset: 'Recommence depuis le temps de départ',
    commandsDurations:
      'Écris les durées comme 10m, 1h30m, 45s ou 1:30:00. Un nombre seul compte en minutes.',
    previewTitle: 'Aperçu du Subathon Timer',
    previewIframeTitle: 'Aperçu du Subathon Timer',
    previewHint:
      "L'aperçu joue des subs, des subs offerts et des cheers simulés. En stream, le timer tourne en temps réel et seul ton chat ajoute du temps.",
    previewSpeed: "Vitesse de l'aperçu",
    previewSpeedTip:
      "1× c'est le temps réel. À 60×, un timer d'une heure se termine en une minute environ.",
    previewSpeedValue: '{rate}×',
    testTitle: 'Teste :',
    testViewer: 'Toi',
    testSub: '+1 sub',
    testGift: '+5 offerts',
    testBits: '+500 Bits/Kicks',
    testRemove: '−10 min',
    testPause: 'Pause / Reprise',
    testReset: 'Réinitialiser',
    widgetUrlTip:
      'Tu as déjà un widget ? Colle son URL ici pour charger tes réglages et changer ce dont tu as besoin.',
    widgetUrlPlaceholder: 'Colle une URL de widget existante pour la modifier',
    widgetUrlInvalid: "Ce n'est pas une URL de Subathon Timer.",
    browserSourceHintSize: ' (taille recommandée : 800×300).',
    guideTitle: 'Installation dans ton logiciel de stream (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Ajoute une source Navigateur web dans ton logiciel de stream (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: "Colle l'URL du timer de subathon que tu as copiée.",
    guideStep3: 'Règle la largeur sur 800 et la hauteur sur 300.',
    guideStep4:
      'Quand tu lances ton live, tape !subathon start dans le chat. Les modos peuvent aussi ajouter, retirer ou mettre le temps en pause.',
    faq1Q: 'Que se passe-t-il si OBS se ferme ou si la source navigateur se recharge ?',
    faq1A:
      "Le timer est enregistré dans OBS, donc il revient là où il en était. Pendant qu'OBS est fermé, il continue de décompter, comme une vraie échéance. Les subs qui arrivent pendant ce temps ne sont pas visibles, alors un modo peut les ajouter avec !subathon add.",
    faq2Q: 'Que se passe-t-il quand le timer arrive à zéro ?',
    faq2A:
      "Le timer s'arrête à zéro et la barre de vie affiche K.O. Les nouveaux subs n'ajoutent plus de temps. Un modo peut le relancer avec !subathon add ou !subathon set, ou en démarrer un nouveau avec !subathon reset.",
    faq3Q: 'Comment lancer un nouveau subathon ou changer le temps de départ ?',
    faq3A:
      "Tape !subathon reset dans le chat. Le timer revient au temps de départ indiqué dans son URL. Tant que le timer n'a jamais démarré, un nouveau temps de départ dans l'URL s'applique tout seul.",
    faq4Q: 'Faut-il me connecter ou relier mon compte ?',
    faq4A:
      'Non. Le timer lit les subs, les subs offerts, les Bits, les Kicks et les commandes des modos dans ton chat public Twitch et Kick, comme les voit un viewer non connecté.',
  },
  goal: {
    breadcrumb: "Configuration de l'Objectif de subs",
    title: "Configuration de l'Objectif de subs",
    intro:
      "Une barre d'objectif de subs pour Twitch et Kick. Chaque nouveau sub, resub et sub offert des deux chats la remplit d'un cran, et un trophée atterrit sur la barre quand tu atteins l'objectif. Choisis où le compteur démarre et où est l'objectif, et tes modos peuvent corriger le compteur depuis le chat.",
    sectionGoal: 'Objectif',
    start: 'Compteur de départ',
    startTip:
      'Le point de départ du compteur : le nombre de subs de ton tableau de bord, ou 0 pour compter seulement ce stream. Le changer plus tard fait repartir le compteur du nouveau nombre.',
    target: 'Objectif',
    targetTip: 'La barre est pleine à ce nombre. Le compteur continue au-delà.',
    countsHint:
      "Chaque sub et resub ajoute 1, Prime et tous les niveaux pareil. Un cadeau ajoute 1 pour chaque sub qu'il contient.",
    style: 'Style',
    styleTip:
      "Barre place le titre de l'objectif et le compteur au-dessus de la barre. Barre fine met le titre et le compteur directement dans une barre plus mince.",
    styleBar: 'Barre',
    styleThin: 'Barre fine',
    color: 'Couleur',
    titleLabel: 'Titre',
    titleTip: 'Affiché au-dessus de la barre. Laisse vide pour ne pas afficher de titre.',
    titlePlaceholder: 'Pas de titre',
    showPops: 'Afficher les nouveaux subs',
    showPopsTip:
      'Fait monter un +1 avec le pseudo du viewer pour chaque sub, ou +5 pour 5 subs offerts.',
    sectionCommands: 'Commandes du chat',
    commandsIntro:
      "Toi et tes modos pouvez corriger le compteur depuis le chat Twitch ou Kick, par exemple pour ajouter les subs arrivés pendant qu'OBS était fermé.",
    cmdAdd: 'Ajoute des subs au compteur, 1 si tu ne mets pas de nombre',
    cmdRemove: 'Retire des subs du compteur, 1 si tu ne mets pas de nombre',
    cmdSet: 'Définit le compteur',
    cmdReset: 'Revient au compteur de départ',
    previewTitle: "Aperçu de l'Objectif de subs",
    previewIframeTitle: "Aperçu de l'Objectif de subs",
    previewHint:
      "L'aperçu joue des subs et des subs offerts simulés jusqu'à atteindre l'objectif, puis recommence. En stream, seul ton chat fait monter le compteur.",
    testTitle: 'Teste :',
    testViewer: 'Toi',
    testSub: '+1 sub',
    testGift: '+5 offerts',
    testReach: "Atteindre l'objectif",
    testReset: 'Réinitialiser',
    widgetUrlTip:
      'Tu as déjà un widget ? Colle son URL ici pour charger tes réglages et changer ce dont tu as besoin.',
    widgetUrlPlaceholder: 'Colle une URL de widget existante pour la modifier',
    widgetUrlInvalid: "Ce n'est pas une URL d'Objectif de subs.",
    browserSourceHintSize: ' (taille recommandée : 800×260).',
    guideTitle: 'Installation dans ton logiciel de stream (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Ajoute une source Navigateur web dans ton logiciel de stream (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: "Colle l'URL de l'objectif de subs que tu as copiée.",
    guideStep3: 'Règle la largeur sur 800 et la hauteur sur 260.',
    guideStep4:
      'Si le compteur est faux, toi ou un modo pouvez le corriger avec !goal set dans le chat.',
    faq1Q: 'Pourquoi il ne lit pas mon nombre de subs sur Twitch ou Kick ?',
    faq1A:
      "Aucune des deux plateformes ne montre le nombre de subs d'une chaîne à une page non connectée, et cet objectif ne te demande jamais de te connecter. Tu tapes donc ton nombre de départ une fois, et ensuite chaque sub et sub offert qui arrive s'y ajoute.",
    faq2Q: 'Que se passe-t-il si OBS se ferme ou si la source navigateur se recharge ?',
    faq2A:
      "Le compteur est enregistré dans OBS, donc il revient là où il en était, même au stream suivant. Les subs qui arrivent pendant qu'OBS est fermé ne sont pas visibles, alors un modo peut les ajouter avec !goal add.",
    faq3Q: 'Les resubs et les subs offerts comptent-ils ?',
    faq3A:
      "Oui. Chaque nouveau sub et resub ajoute 1, et un cadeau ajoute 1 pour chaque sub qu'il contient, donc 5 subs offerts ajoutent 5. Sur Twitch, un resub compte quand le viewer le partage dans le chat, et sur Kick quand il se renouvelle.",
    faq4Q: 'Je peux faire un objectif de followers ?',
    faq4A:
      "Pas encore. Twitch et Kick ne montrent pas les nouveaux follows à une page non connectée, donc l'objectif compte les subs, de la même façon sur les deux plateformes.",
  },
  frames: {
    breadcrumb: 'Configuration des Cadres de stream',
    title: 'Configuration des Cadres de stream',
    intro:
      "Des cadres prêts à l'emploi pour ta caméra, ton chat ou tout ton écran de stream. Le preset choisi dessine le cadre dans le style de ce jeu, jusqu'à sa forme, ses décorations et ses animations : un toit de pagode, des pompons qui se balancent et des pétales qui volent dans Dynasty, des blocs d'herbe et des torches qui vacillent dans Blocks. Aucune chaîne à connecter. Ajoute l'URL à OBS et place ta caméra ou ton chat sous le cadre.",
    sectionPiece: 'Cadre',
    piece: 'Tu encadres quoi ?',
    pieceTip:
      "Chaque pièce est sa propre source navigateur. Ajoute les trois avec le même preset et tout ce qui est à l'écran est assorti.",
    pieces: {
      camera: 'Caméra',
      chat: 'Chat',
      screen: 'Écran',
    },
    pieceHints: {
      camera: "Un cadre 16:9 pour ta webcam. Place ta caméra dans l'ouverture au centre.",
      cameraPortrait:
        "Un cadre 9:16 pour une caméra de téléphone ou une webcam tournée sur le côté. Place ta caméra dans l'ouverture au centre.",
      chat: "Un cadre haut avec un en-tête pour la Boîte de chat. Place la Boîte de chat sous l'en-tête.",
      screen:
        'Un cadre fin le long des bords de tout ton stream. Les décorations restent dans les coins pour ne pas cacher ton jeu.',
    },
    orientation: 'Orientation',
    orientations: {
      landscape: 'Paysage',
      portrait: 'Portrait',
    },
    labelLabel: 'Étiquette',
    labelTips: {
      camera:
        "S'affiche sur l'onglet au-dessus de ta caméra, comme le nom de ta chaîne. Laisse vide et l'onglet garde juste sa décoration.",
      chat: "S'affiche sur l'onglet au-dessus du cadre du chat. Laisse vide et l'onglet garde juste sa décoration.",
      screen:
        "S'affiche sur la plaque en bas au centre de l'écran. Laisse vide pour masquer la plaque.",
    },
    labelPlaceholder: "Pas d'étiquette",
    color: 'Couleur',
    motion: 'Animations',
    motionTip:
      'Lignes lumineuses, reflets et petites touches selon le preset, comme des lanternes, des torches ou des étincelles. Désactive-les et le cadre reste immobile.',
    previewTitle: 'Aperçu du cadre de stream',
    previewIframeTitle: 'Aperçu du cadre de stream',
    previewHint:
      "La silhouette et les lignes de chat de l'aperçu ne sont que des exemples. En stream, le centre du cadre est transparent, donc ta caméra ou ton chat apparaît en dessous.",
    widgetUrlTip:
      'Tu as déjà un cadre ? Colle son URL ici pour charger tes réglages et changer ce dont tu as besoin.',
    widgetUrlPlaceholder: 'Colle une URL de cadre existante pour la modifier',
    widgetUrlInvalid: "Ce n'est pas une URL de Cadres de stream.",
    browserSourceHintSize: ' (taille recommandée : {width}×{height}).',
    guideTitle: 'Installation dans ton logiciel de stream (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      "Ajoute une source Navigateur web dans ton logiciel de stream (OBS Studio, Streamlabs Desktop, XSplit, vMix, etc.) et colle l'URL du cadre.",
    guideStep2:
      "Règle la largeur et la hauteur sur la taille recommandée. Pour une caméra carrée, tape ta propre taille. Le cadre s'adapte à toutes les tailles.",
    guideStep3:
      'Dans la liste Sources, place le cadre au-dessus de ta caméra ou de ta Boîte de chat, puis positionne-le par-dessus dans la scène.',
    guideStep4:
      "Agrandis ta caméra pour remplir l'ouverture, mais garde-la dans le bord extérieur du cadre. Dans un cadre 640 × 360, 590 × 296 tombe pile, et dans un cadre portrait 360 × 640, c'est 306 × 572.",
    faq1Q: 'Le cadre affiche-t-il ma caméra ou mon chat tout seul ?',
    faq1A:
      "Non. Le centre du cadre est transparent, c'est juste de la décoration. Tu ajoutes ta caméra et ta Boîte de chat à OBS comme sources séparées et tu les places sous le cadre.",
    faq2Q: 'Faut-il relier mon compte Twitch ou Kick ?',
    faq2A:
      "Non. Le cadre ne lit pas le chat et n'a pas besoin de nom de chaîne. Il marche pareil que tu streames sur Twitch, Kick ou ailleurs.",
    faq3Q: 'Je peux utiliser le cadre de caméra dans une autre taille ?',
    faq3A:
      'Oui. Pour une caméra verticale, règle Orientation sur Portrait et la taille recommandée passe à 360 × 640. Le cadre est dessiné pour remplir sa source navigateur, donc pour une caméra carrée règle simplement la largeur et la hauteur pareil, et les décorations suivent.',
    faq4Q: 'Les dessins des cadres viennent-ils des jeux ?',
    faq4A:
      "Non. Chaque dessin, comme le toit de pagode, les lanternes ou les blocs en pixels, a été fait de zéro, sans logo ni visuel de jeu. Les presets sont des styles faits par des fans qui retrouvent l'ambiance de ces jeux.",
  },
  countdown: {
    breadcrumb: 'Configuration du Compte à rebours de stream',
    title: 'Configuration du Compte à rebours de stream',
    intro:
      "Un compte à rebours pour les moments du stream où il ne se passe encore rien : les minutes avant ton live, une pause au milieu, et les dernières minutes avant de couper. Donne-lui une durée ou l'heure à laquelle tu veux commencer, et il prend le style du preset choisi. Pas besoin de chaîne, mais avec une, tes modos peuvent le repousser depuis le chat.",
    scenes: {
      starting: {
        label: 'Début',
        title: 'Ça commence bientôt',
        done: 'On est en live !',
        hint: 'Pour la scène sur laquelle tu restes avant de lancer le live.',
      },
      break: {
        label: 'Pause',
        title: 'Je reviens vite',
        done: 'Je suis de retour !',
        hint: 'Pour une pause au milieu : manger, souffler, une course rapide.',
      },
      ending: {
        label: 'Fin',
        title: 'Fin du stream',
        done: "Merci d'avoir regardé !",
        hint: 'Pour les dernières minutes, pour que le chat sache combien de temps il reste.',
      },
    },
    sectionCountdown: 'Compte à rebours',
    scene: "C'est pour quoi ?",
    sceneTip: "Ça choisit le texte et l'icône. Tu peux écrire ton propre texte plus bas.",
    mode: 'Décompter',
    modes: {
      duration: 'Une durée',
      clock: 'Une heure précise',
    },
    modeTip:
      "Une durée démarre dès que la source navigateur se charge. Une heure précise finit toujours à cette heure-là, donc tu peux ajouter la source des heures à l'avance.",
    duration: 'Durée',
    durationUnit: 'min',
    durationTip: 'Combien de temps dure le compte à rebours, de 1 minute à 24 heures.',
    atLabel: 'Heure',
    atTip:
      "Une heure au format 24 h comme 21:00, lue sur l'horloge de l'ordinateur qui fait tourner OBS. Si elle est déjà passée aujourd'hui, le compte à rebours vise demain.",
    atPlaceholder: '21:00',
    atInvalid: 'Tape une heure au format 24 h, comme 21:00.',
    ending: 'À zéro',
    endings: {
      text: 'Afficher un message',
      hold: 'Rester à 00:00',
      hide: 'Le masquer',
    },
    endingTip:
      "Ce qui reste à l'écran une fois le compte à rebours terminé, jusqu'à ce que tu changes de scène.",
    sectionText: 'Texte',
    titleLabel: 'Titre',
    titleTip: "Au-dessus de l'horloge. Laisse vide pour utiliser le texte de la scène choisie.",
    titlePlaceholder: 'Texte de la scène',
    noteLabel: 'Note',
    noteTip: "Une ligne sous l'horloge, ex. la raison de la pause. Laisse vide pour la masquer.",
    notePlaceholder: 'Pas de note',
    doneLabel: 'Message à zéro',
    doneTip:
      "Remplace l'horloge quand elle arrive à zéro. Laisse vide pour utiliser le texte de la scène.",
    look: 'Fond',
    looks: {
      card: 'Panneau',
      plain: 'Sans panneau',
    },
    lookTip: "Un panneau derrière l'horloge, ou le texte directement sur ta scène.",
    color: 'Couleur',
    showBar: 'Barre de progression',
    showBarTip: "Une barre sous l'horloge qui se vide à mesure que le temps s'écoule.",
    motion: 'Animations',
    motionTip: "L'horloge pulse pendant la dernière minute. Désactive-les et tout reste immobile.",
    channelsTip:
      'Utile seulement pour les commandes du chat. Sans chaîne, le compte à rebours tourne quand même tout seul.',
    sectionCommands: 'Commandes du chat',
    commandsIntro:
      'Avec une chaîne renseignée, toi et tes modos pouvez modifier le compte à rebours depuis le chat Twitch ou Kick, par exemple pour repousser le début pendant que tu es AFK.',
    cmdAdd: 'Ajoute du temps : 5m, 90s ou 1h30m',
    cmdRemove: 'Retire du temps',
    cmdSet: 'Définit le temps restant',
    cmdPause: 'Le met en pause ; start le relance',
    cmdReset: 'Relance le compte à rebours depuis le début',
    previewTitle: 'Aperçu du Compte à rebours de stream',
    previewIframeTitle: 'Aperçu du Compte à rebours de stream',
    previewHint:
      "L'aperçu tourne en accéléré pour que tu voies tout le compte à rebours, puis recommence. En stream, il décompte en temps réel.",
    testTitle: 'Teste :',
    testAdd: '+1 min',
    testRemove: '-1 min',
    testPause: 'Pause',
    testFinish: 'Aller à zéro',
    widgetUrlTip:
      'Tu as déjà un compte à rebours ? Colle son URL ici pour charger tes réglages et changer ce dont tu as besoin.',
    widgetUrlPlaceholder: 'Colle une URL de compte à rebours existante pour la modifier',
    widgetUrlInvalid: "Ce n'est pas une URL de Compte à rebours de stream.",
    browserSourceHintSize: ' (taille recommandée : 1920×1080).',
    guideTitle: 'Installation dans ton logiciel de stream (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      "Ajoute une source Navigateur web à ta scène de début, de pause ou de fin et colle l'URL du compte à rebours.",
    guideStep2:
      "Règle la largeur sur 1920 et la hauteur sur 1080, pour que l'horloge soit au centre de la scène.",
    guideStep3:
      'Coche "Rafraîchir le navigateur lorsque la scène devient active", pour que le compte à rebours recommence à chaque fois que tu passes sur cette scène.',
    guideStep4:
      'Passe sur la scène pour le lancer. Avec une chaîne renseignée, un modo peut le repousser avec !countdown add 5m pendant ton absence.',
    faq1Q: 'Quand le compte à rebours démarre-t-il ?',
    faq1A:
      'Dès que la source navigateur se charge : à l\'ouverture d\'OBS, ou quand tu passes sur la scène avec "Rafraîchir le navigateur lorsque la scène devient active" coché. Comme ça, un compte à rebours de pause recommence chaque fois que tu vas sur ta scène BRB au lieu de se terminer pendant que tu es encore en live.',
    faq2Q: "Il peut décompter jusqu'à l'heure que j'ai annoncée, comme 21:00 ?",
    faq2A:
      "Oui. Règle Décompter sur Une heure précise et tape 21:00. Il lit l'horloge de l'ordinateur qui fait tourner OBS, donc tu peux ajouter la source des heures à l'avance et il finira quand même à 21:00. Si 21:00 est déjà passé aujourd'hui, il vise demain.",
    faq3Q: 'Faut-il relier mon compte Twitch ou Kick ?',
    faq3A:
      'Non. Le compte à rebours tourne tout seul, sans chaîne et sans connexion. Tu ne renseignes une chaîne que si tu veux les commandes !countdown, et il lit alors ton chat public comme les autres widgets.',
    faq4Q: 'Que se passe-t-il quand il arrive à zéro ?',
    faq4A:
      'Ce que tu choisis sous À zéro : un message comme "On est en live !", l\'horloge qui reste à 00:00, ou l\'overlay qui disparaît pour laisser la scène nue. Il ne change jamais de scène à ta place.',
  },
  poll: {
    breadcrumb: 'Configuration du Sondage du chat',
    title: 'Configuration du Sondage du chat',
    intro:
      "Un sondage du chat pour Twitch et Kick. Toi ou un modo lancez un sondage depuis le chat, les viewers votent en tapant un numéro, et les barres se remplissent en direct sur ton stream. Les votes des deux chats vont dans un seul sondage, chaque viewer compte une fois, et le gagnant s'affiche à la fin du temps.",
    sectionPoll: 'Sondage prêt',
    question: 'Question',
    questionTip:
      'Affichée au-dessus des options. Laisse vide si tu poses la question à voix haute.',
    questionPlaceholder: 'On joue à quoi ensuite ?',
    options: 'Options',
    optionsTip:
      "Les viewers votent avec le numéro à côté d'une option, ou en tapant l'option elle-même. Jusqu'à 6 options.",
    optionLabel: 'Option {n}',
    optionPlaceholder: 'Option {n}',
    removeOption: "Retirer l'option {n}",
    addOption: '+ Ajouter une option',
    pollHint:
      "Enregistré dans l'URL. Lance-le avec {command} dans le chat. Les modos peuvent aussi taper un nouveau sondage dans le chat à tout moment.",
    sectionVoting: 'Vote',
    duration: 'Durée du sondage',
    durationTip:
      'Combien de temps un sondage prend des votes. Dans le chat, un modo peut donner une autre durée à un sondage, le terminer plus tôt ou ajouter du temps.',
    durationOff: "Pas de timer : le sondage reste ouvert jusqu'à ce qu'un modo tape !poll end.",
    hold: "Résultats à l'écran",
    holdTip:
      "Combien de temps les résultats restent affichés après la fin du vote. Ensuite le sondage quitte l'écran.",
    holdOff: "Les résultats restent affichés jusqu'au sondage suivant ou !poll cancel.",
    delay: 'Délai du stream',
    delayTip:
      'Les viewers voient ton stream quelques secondes après le chat, donc un vote tapé à "1 seconde restante" arrive en retard dans le chat. Les votes continuent de compter pendant ce nombre de secondes après la fin du timer. Twitch et Kick ont en général 2 à 10 secondes de retard.',
    voters: 'Qui peut voter',
    votersTip: "Abonnés veut dire les viewers avec un badge d'abonné ou de fondateur, plus toi.",
    votersAll: 'Tout le monde',
    votersSubs: 'Abonnés',
    subWeight: "Poids d'un vote de sub",
    subWeightTip: "Le vote d'un abonné compte autant de fois. Le sondage l'indique à l'écran.",
    subWeightValue: '{n}×',
    change: 'Les viewers peuvent changer de vote',
    changeTip:
      'Activé : taper un autre numéro déplace le vote. Désactivé : le premier vote reste. Dans les deux cas, chaque viewer compte une fois.',
    blind: "Masquer les résultats jusqu'à la fin",
    blindTip:
      "Les barres restent cachées pendant le vote, pour que les premiers votes n'influencent pas les autres. Seul le nombre de votes s'affiche.",
    color: 'Couleur',
    position: 'Position',
    positionTip:
      "Où se place le sondage dans la source navigateur. Il grandit à partir de là selon le nombre d'options.",
    positionTop: 'En haut',
    positionBottom: 'En bas',
    language: 'Langue du sondage',
    languageTip:
      'La langue des mots du sondage, comme "Résultats" et le Oui et le Non d\'un sondage rapide.',
    unitMinutes: 'min',
    unitSeconds: 's',
    sectionCommands: 'Commandes du chat',
    commandsIntro:
      "Toi et tes modos gérez les sondages depuis le chat Twitch ou Kick. Les parties d'un nouveau sondage sont séparées par |.",
    exampleQuestion: 'Question',
    cmdNew: 'Lance un nouveau sondage avec 2 à 6 options',
    cmdNewTime: 'Pareil, avec sa propre durée, comme 90s, 2m ou 1:30',
    cmdYesNo: 'Lance un sondage rapide Oui ou Non',
    cmdStart: 'Lance le sondage prêt de cette page',
    cmdExtend: 'Ajoute du temps au sondage',
    cmdEnd: 'Termine le vote tout de suite et affiche les résultats',
    cmdCancel: "Retire le sondage de l'écran",
    votingIntro:
      'Les viewers votent en tapant juste le numéro (2), !vote 2 ou le texte d\'une option. Un message avec autre chose, comme "2 stp", ne compte pas. La commande /vote de Twitch sert aux sondages de Twitch, alors dis au chat de taper le numéro.',
    previewTitle: 'Aperçu du Sondage du chat',
    previewIframeTitle: 'Aperçu du Sondage du chat',
    previewHint:
      "L'aperçu joue un sondage avec des votants simulés, plus vite qu'en vrai, puis lance le suivant. En stream, un sondage n'apparaît que quand toi ou un modo en lancez un.",
    testTitle: 'Teste :',
    testVotes: '+{count} votes',
    testExtend: '+30 s',
    testEnd: 'Terminer',
    testNew: 'Nouveau sondage',
    widgetUrlTip:
      'Tu as déjà un widget ? Colle son URL ici pour charger tes réglages et changer ce dont tu as besoin.',
    widgetUrlPlaceholder: 'Colle une URL de widget existante pour la modifier',
    widgetUrlInvalid: "Ce n'est pas une URL de Sondage du chat.",
    browserSourceHintSize: ' (taille recommandée : 640×560).',
    guideTitle: 'Installation dans ton logiciel de stream (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Ajoute une source Navigateur web dans ton logiciel de stream (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: "Colle l'URL du sondage du chat que tu as copiée.",
    guideStep3: 'Règle la largeur sur 640 et la hauteur sur 560.',
    guideStep4:
      "La source reste vide tant qu'aucun sondage n'est lancé. Tape !poll start, ou !poll Question | A | B, dans le chat.",
    faq1Q: 'Comment les viewers votent-ils ?',
    faq1A:
      'En tapant le numéro de l\'option dans le chat, comme 2. !vote 2 et le texte de l\'option marchent aussi, en majuscules ou minuscules et avec ou sans accents. Le message entier doit être le vote, donc "2 stp" ou 4Head ne comptent pas.',
    faq2Q: 'Un viewer peut-il voter plusieurs fois ?',
    faq2A:
      'Non. Chaque compte Twitch ou Kick compte une fois. Avec le changement de vote activé, un nouveau numéro déplace son vote sans jamais en ajouter un deuxième. Si un modo met en timeout ou bannit un compte pendant que le sondage est ouvert, son vote est retiré, ce qui aide contre les bots de spam.',
    faq3Q: 'Pourquoi ne pas utiliser les sondages de Twitch ou de Kick ?',
    faq3A:
      "Ce sondage réunit les votes de Twitch et de Kick dans un seul résultat et marche pareil sur les deux. Les sondages de Twitch ne peuvent pas être lus sans connexion, et cet overlay ne te demande jamais de te connecter. Tu n'as pas non plus besoin d'être Affilié ou Partenaire.",
    faq4Q: 'Que se passe-t-il si OBS se ferme ou si la source navigateur se recharge ?',
    faq4A:
      "Le sondage et ses votes sont enregistrés dans OBS, donc il revient là où il en était. Le timer continue de tourner pendant qu'OBS est fermé, mais les votes tapés pendant ce temps ne sont pas visibles.",
    faq5Q: 'Pourquoi des votes comptent encore après que le timer est à zéro ?',
    faq5A:
      "Les viewers regardent ton stream avec quelques secondes de retard sur le chat, donc quand leur timer affiche 1 seconde restante, c'est déjà fini dans le chat. Délai du stream continue de compter les votes quelques secondes de plus, 5 par défaut, et le gagnant s'affiche après.",
    overlay: {
      label: 'Sondage',
      closing: 'Derniers votes',
      results: 'Résultats',
      tie: 'Égalité',
      tieHint: 'Égalité !',
      winner: 'Gagnant : {option}',
      noVotes: 'Aucun vote',
      hidden: 'Résultats à la fin du vote',
      howTo: 'Tape de 1 à {last} dans le chat',
      howToTwo: 'Tape 1 ou 2 dans le chat',
      subsOnly: 'Subs uniquement',
      subBonus: 'Votes des subs ×{n}',
      votes: '{count} votes',
      voteOne: '1 vote',
      yes: 'Oui',
      no: 'Non',
      sampleQuestion: 'On joue à quoi ensuite ?',
      sampleOption1: "Jeu d'horreur",
      sampleOption2: 'Speedrun',
      sampleOption3: 'Parties avec les viewers',
    },
  },
  streamAlerts: {
    breadcrumb: 'Configuration des Alertes de stream',
    title: 'Configuration des Alertes de stream',
    intro:
      "Des alertes de stream animées pour Twitch et Kick. Un nouveau sub, des subs offerts, des Bits, des Kicks ou un raid ont chacun une alerte avec leur propre icône et leur propre son, l'une après l'autre. Choisis une couleur, renomme les titres et fixe le plus petit cadeau, cheer ou raid qui mérite une alerte.",
    color: 'Couleur',
    theme: 'Thème',
    themeTip:
      'Neon est une bannière sci-fi anguleuse avec des sons de synthé. Céleste est une carte à liseré doré sous les étoiles, avec des carillons.',
    themes: {
      neon: 'Neon',
      celestial: 'Céleste',
    },
    colorTip: 'Plateforme affiche les alertes Twitch en violet et les alertes Kick en vert.',
    colors: {
      blue: 'Bleu',
      purple: 'Violet',
      pink: 'Rose',
      red: 'Rouge',
      gold: 'Or',
      green: 'Vert',
      platform: 'Plateforme (Twitch violet, Kick vert)',
    },
    language: 'Langue des alertes',
    languageTip:
      "La langue des mots de l'alerte. L'URL OBS la garde, quelle que soit la langue d'OBS.",
    sectionAlerts: 'Alertes',
    heading: 'Titre',
    kindSub: 'Subs',
    kindSubTip:
      'Chaque nouveau sub et resub, et un resub que le viewer partage dans le chat avec un message.',
    kindGift: 'Subs offerts',
    kindGiftTip: 'Une alerte par cadeau, quel que soit le nombre de subs.',
    kindBits: 'Bits et Kicks',
    kindBitsTip: 'Les Bits envoyés en cheer sur Twitch et les Kicks envoyés sur Kick.',
    kindRaid: 'Raids',
    kindRaidTip: 'Une autre chaîne qui te raid, avec le nombre de viewers venus avec.',
    minGift: 'Subs min.',
    minBits: 'Montant min.',
    minRaid: 'Viewers min.',
    sectionTiming: 'Durée et son',
    duration: "Durée à l'écran",
    durationTip:
      'Combien de temps chaque alerte reste affichée. Quand plusieurs arrivent, elles attendent leur tour.',
    seconds: '{value} s',
    volume: 'Volume',
    volumeTip: 'Chaque alerte joue un petit son à elle. 0 coupe le son.',
    volumeOff: 'Coupé',
    showMessage: 'Afficher le message du viewer',
    showMessageTip:
      'Affiche ce que le viewer a écrit avec son resub, ses Bits ou ses Kicks. Les liens sont retirés, et les longs messages sont coupés.',
    previewTitle: 'Aperçu des Alertes de stream',
    previewIframeTitle: 'Aperçu des Alertes de stream',
    previewHint:
      "L'aperçu joue des exemples d'alertes sans son. Les boutons ci-dessous en jouent une avec son son. En stream, seuls les subs, cadeaux, cheers et raids de ta chaîne s'affichent.",
    testTitle: 'Teste :',
    testSub: 'Sub',
    testGift: '{count} offerts',
    testBits: '{amount} Bits/Kicks',
    testRaid: 'Raid',
    testViewer: 'ViewerTest',
    testMessage: 'Super stream !',
    widgetUrlTip:
      'Tu as déjà un widget ? Colle son URL ici pour charger tes réglages et changer ce dont tu as besoin.',
    widgetUrlPlaceholder: 'Colle une URL de widget existante pour la modifier',
    widgetUrlInvalid: "Ce n'est pas une URL d'Alertes de stream.",
    browserSourceHintSize: ' (taille recommandée : 800×450).',
    guideTitle: 'Installation dans ton logiciel de stream (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Ajoute une source Navigateur web dans ton logiciel de stream (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: "Colle l'URL des alertes de stream que tu as copiée.",
    guideStep3:
      'Règle la largeur sur 800 et la hauteur sur 450, puis place-la là où les alertes doivent apparaître.',
    guideStep4:
      "Pour entendre le son dans OBS, active Contrôler l'audio via OBS dans les réglages de la source et règle le monitoring de la source sur Surveillance activée dans Propriétés audio avancées.",
    faq1Q: "Pourquoi il n'y a pas d'alertes de follow ou de don ?",
    faq1A:
      "Twitch et Kick ne montrent pas les nouveaux follows à une page non connectée, et aucune des deux plateformes n'a de système de dons à elle. Les alertes n'utilisent que ce que les deux plateformes envoient à chaque viewer, donc elles marchent pareil sur les deux.",
    faq2Q: 'Une alerte de sub affiche-t-elle les mois et le message du viewer ?',
    faq2A:
      "Oui. Quand un viewer partage son resub dans le chat, sur Twitch ou sur Kick, il a une alerte avec les mois et ce qu'il a écrit. Sur Twitch, chaque alerte de sub affiche les mois. Kick les envoie avec la plupart des subs, mais certaines chaînes ne les reçoivent jamais, et l'alerte dit alors juste qu'il s'est abonné.",
    faq3Q: "Que se passe-t-il quand beaucoup d'alertes arrivent en même temps ?",
    faq3A:
      "Elles s'affichent une par une, dans l'ordre d'arrivée. 50 subs offerts d'un coup font une seule alerte, pas 50.",
    faq4Q: 'Faut-il me connecter ou relier mon compte ?',
    faq4A:
      'Non. Les alertes lisent les subs, subs offerts, Bits, Kicks et raids dans ton chat public Twitch et Kick, comme les voit un viewer non connecté.',
    alert: {
      subHeading: 'Nouvel abonné',
      subDetail: "vient de s'abonner",
      resubDetail: 'est abonné depuis {months} mois',
      giftHeading: 'Subs offerts',
      giftDetail: 'a offert {count} subs',
      giftDetailOne: 'a offert un sub',
      bitsHeading: 'Nouveau cheer',
      bitsDetail: 'a envoyé {amount} Bits',
      kicksHeading: 'Kicks',
      kicksDetail: 'a envoyé {amount} Kicks',
      raidHeading: 'Raid en approche',
      raidDetail: 'arrive en raid avec {viewers} viewers',
      raidDetailOne: 'arrive en raid avec 1 viewer',
      raidDetailNoCount: 'arrive en raid',
      anonymous: 'Anonyme',
    },
  },
  raffle: {
    breadcrumb: 'Configuration du Tirage au sort',
    title: 'Configuration du Tirage au sort',
    intro:
      'Organise des giveaways directement depuis le chat : les viewers participent en tapant un mot-clé comme !join, et tu tires le gagnant en un clic. Marche sur Twitch et Kick, peut être réservé aux abonnés, et affiche le gagnant sur le stream avec des confettis si tu veux.',
    lockedTitle: 'Réglages verrouillés',
    lockedDesc:
      'Les règles ne peuvent pas changer pendant un tirage en cours ou en attente. Clique sur Tout réinitialiser pour les modifier.',
    platform: 'Plateforme',
    channelName: 'Chaîne',
    sectionRules: 'Règles de participation',
    entryKeyword: 'Mot-clé de participation',
    keywordTip:
      "Le message doit être exactement ce mot-clé, ou commencer par lui suivi d'un espace. Les majuscules ne comptent pas, et les bots connus sont ignorés.",
    minDuration: 'Durée minimale (s)',
    minDurationTip:
      'Tirer le gagnant reste bloqué pendant ce nombre de secondes après que tu as cliqué sur Lancer, pour que tout le monde ait le temps de taper.',
    subscribersOnly: 'Abonnés uniquement',
    subscribersOnlyTip:
      "Seuls les viewers avec un badge d'abonné ou de fondateur peuvent participer. Toi aussi tu peux participer en tant que streamer, tant que le minimum est de 1 mois.",
    minSubMonths: 'Mois de sub minimum',
    maxWinsPerUser: 'Victoires max par viewer',
    maxWinsTip:
      "Un gagnant sort de la liste des participants. Il peut revenir en retapant le mot-clé, jusqu'à atteindre cette limite.",
    maxWinsUnlimited: 'Illimité',
    resetConfig: 'Réinitialiser les réglages',
    controlTitle: 'Contrôles du tirage',
    controlTip:
      "Garde cette page ouverte pendant le tirage. Elle lit le chat et envoie le gagnant à l'overlay.",
    statusIdle: 'Pas lancé',
    statusNeedsSetup: 'Renseigne une chaîne et un mot-clé pour lancer.',
    statusRunning: 'Ouvert, en attente de {keyword}',
    statusStopped: 'Participations fermées',
    startRaffle: 'Lancer le tirage',
    stopRaffle: 'Fermer les participations',
    drawWinner: 'Tirer le gagnant ({count} éligibles)',
    drawLocked: 'Tirage possible dans {seconds} s',
    lastWinner: 'Dernier gagnant',
    clear: 'Effacer',
    resetEntries: 'Effacer les participants',
    resetWinners: 'Effacer les gagnants',
    resetAll: 'Tout réinitialiser',
    winners: 'Gagnants ({count})',
    participants: 'Participants ({count})',
    noWinners: 'Pas encore de gagnant.',
    noParticipants:
      'Pas encore de participant. Les viewers participent en tapant {keyword} dans le chat.',
    disqualify: 'Retirer {name}',
    confirmStart: 'Lancer un nouveau tirage ? Les participants et gagnants actuels seront effacés.',
    confirmResetEntries: 'Effacer la liste des participants ?',
    confirmResetWinners: 'Effacer la liste des gagnants ?',
    confirmResetAll:
      'Tout réinitialiser ? Les participants et les gagnants sont effacés et le verrou saute. Tes réglages restent tels quels.',
    overlayUrl: "URL de l'overlay du gagnant",
    overlayUrlTip:
      'Le gagnant est envoyé via le BroadcastChannel du navigateur, qui ne peut pas sortir du navigateur où il tourne. Une page de tirage ouverte dans Chrome ne peut pas joindre un overlay dans OBS.',
    overlayUrlHint:
      "Le gagnant n'arrive sur l'overlay que si cette page tourne dans le même navigateur ou la même appli que l'overlay. Fais un tirage de test avant ton live.",
    overlayNextStep:
      "Fais tourner cette page de tirage dans la même appli que l'overlay et fais un tirage de test.",
    guideStep1:
      'Choisis la plateforme, tape le nom de ta chaîne et règle le mot-clé de participation et les règles.',
    guideStep2:
      "Tu veux le gagnant sur le stream ? Ajoute l'URL de l'overlay comme source navigateur en 1920×1080.",
    guideStep3:
      "Clique sur Lancer le tirage. Les viewers participent en tapant le mot-clé dans le chat, et tu peux retirer n'importe qui avec le ✕ à côté de son nom.",
    guideStep4:
      "Quand tu es prêt, clique sur Tirer le gagnant. Le gagnant n'apparaît sur l'overlay que si cette page tourne dans le même navigateur ou la même appli, alors teste avant ton live.",
    faq1Q: 'Comment éviter que la même personne gagne deux fois ?',
    faq1A:
      'Un gagnant tiré sort de la liste des participants et passe dans la liste des gagnants. Avec Victoires max par viewer à 1, il ne peut ni participer ni regagner dans le même tirage.',
    faq2Q: 'Je peux retirer des participations suspectes ou des bots ?',
    faq2A:
      "Les bots connus comme Nightbot et StreamElements sont ignorés automatiquement. Tu peux aussi retirer n'importe qui avec le ✕ à côté de son nom.",
    faq3Q: "Pourquoi le gagnant ne s'affiche pas sur mon overlay ?",
    faq3A:
      "La page de tirage envoie le gagnant via BroadcastChannel, qui ne marche qu'à l'intérieur d'un même navigateur. Si cette page est ouverte dans Chrome et que l'overlay tourne dans OBS, le message n'arrive jamais. Fais tourner la page de tirage dans la même appli que l'overlay et fais un tirage de test avant ton live.",
    winner: 'Gagnant !',
    subMonthsShort: '{months} mois',
  },
  alerts: {
    follow: 'Nouveau follower !',
    sub: 'Nouvel abonné !',
    donate: 'Don !',
    raid: 'Raid en approche !',
  },
  emoteWallSetup: {
    breadcrumb: "Configuration du Mur d'emotes",
    title: "Configuration du Mur d'emotes",
    intro:
      "Les messages faits uniquement d'emotes (Twitch, Kick et les emotes 7TV de ta chaîne Twitch) apparaissent en emotes à l'écran. Les messages texte normaux sont ignorés par défaut, et Toutes les emotes récupère aussi les emotes qu'ils contiennent. Calme les fait apparaître à des endroits au hasard où elles dérivent et s'effacent, Chaos les fait traverser l'écran depuis un bord, et Rebond les fait rebondir sur les bords de l'écran.",
    sectionAnimation: 'Animation',
    sectionFilters: 'Filtres',
    sevenTvEmotes: 'Emotes 7TV',
    sevenTvTip:
      'Affiche les emotes 7TV de ta chaîne Twitch, dans le chat Kick aussi. Nécessite ta chaîne Twitch.',
    mode: "Mode d'animation",
    modeCalm: 'Calme',
    modeChaos: 'Chaos',
    modeBounce: 'Rebond',
    modeTip:
      "Calme : apparaît à un endroit au hasard, dérive et s'efface. Chaos : arrive d'un bord au hasard et disparaît quelque part entre le milieu et le côté opposé. Rebond : ricoche sur les bords et accélère à chaque choc.",
    emoteSize: 'Taille des emotes',
    duration: "Durée d'affichage (s)",
    durationTip:
      "Combien de temps chaque emote reste à l'écran. En Chaos, les emotes traversent l'écran en une partie de ce temps et disparaissent plus tôt.",
    maxEmotes: 'Emotes simultanées max',
    maxEmotesTip: "Quand il y a plus d'emotes que ça à l'écran, les plus anciennes sont retirées.",
    subsOnly: 'Abonnés uniquement',
    subsOnlyTip:
      "N'affiche que les emotes des viewers avec un badge d'abonné ou de fondateur, et les tiennes. L'aperçu l'ignore.",
    subDurationX2: 'Emotes des subs 2× plus longues',
    subDurationX2Tip:
      "Les emotes des viewers avec un badge d'abonné ou de fondateur, et les tiennes, restent deux fois plus longtemps à l'écran.",
    showAllEmotes: 'Toutes les emotes',
    showAllEmotesTip:
      "Affiche aussi les emotes dans les messages texte normaux, jusqu'à 5 par message. L'aperçu l'ignore.",
    hypeMode: 'Mode hype',
    hypeModeTip:
      "Une emote n'apparaît que si 2 viewers différents ou plus l'envoient en 15 secondes, puis au plus une fois toutes les 15 secondes. L'aperçu l'ignore.",
    spamBlock: "Bloquer le spam d'emotes",
    spamBlockTip:
      "Si un viewer envoie plus de 3 messages d'emotes en 10 secondes, les suivants sont ignorés. La même emote plus de deux fois en 10 secondes n'ignore que cette emote. L'aperçu l'ignore.",
    previewTitle: "Aperçu du Mur d'emotes",
    previewIframeTitle: "Aperçu du Mur d'emotes",
    previewHint:
      "L'aperçu montre des exemples d'emotes. En stream, les emotes viennent de ton chat.",
    widgetUrlTip:
      'Tu as déjà un widget ? Colle son URL ici pour charger tes réglages et changer ce dont tu as besoin.',
    widgetUrlPlaceholder: 'Colle une URL de widget existante pour la modifier',
    widgetUrlInvalid: "Ce n'est pas une URL de Mur d'emotes.",
    guideTitle: 'Installation dans ton logiciel de stream (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Ajoute une source Navigateur web dans ton logiciel de stream (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: "Colle l'URL du mur d'emotes que tu as copiée.",
    guideStep3:
      'Règle la largeur et la hauteur sur la taille complète de ton canevas (ex. 1920×1080) et place-la au-dessus de ton gameplay.',
    browserSourceHintSize: ' (taille recommandée : 1920×1080, canevas complet).',
    faq1Q: 'Quels messages déclenchent une emote volante ?',
    faq1A:
      "Les messages faits uniquement d'emotes, comme un seul Kappa, une rangée d'emotes, ou un mélange d'emotes Twitch, Kick et 7TV. Les messages texte normaux sont ignorés sauf si Toutes les emotes est activé.",
    faq2Q: "Faut-il se connecter pour utiliser le mur d'emotes ?",
    faq2A:
      "Aucune connexion n'est nécessaire. Le Mur d'emotes écoute anonymement le chat public des deux plateformes.",
  },
  plants: {
    classic: 'Pousse classique',
    rose: 'Rose',
    sunflower: 'Tournesol',
    cactus: 'Cactus',
    tulip: 'Tulipe',
    pine: 'Pin',
    lotus: 'Lotus',
    lily: 'Lys',
    palm: 'Palmier',
    vine: 'Vigne grimpante',
    waterOff: 'Désactivé',
    waterRain: 'Pluie',
    waterSparkle: 'Étincelles',
  },
  guides: {
    breadcrumb: 'Guides',
    eyebrow: 'Guide',
    published: 'Publié le {date}',
    onThisPage: 'Sur cette page',
    covers: 'Outils abordés',
    relatedTitle: 'Guides liés',
    readGuide: 'Lire le guide',
    allGuides: 'Tous les guides',
    openSetup: 'Ouvrir la page de configuration',
    index: {
      title: 'Guides',
      lead: "Chaque guide répond à une question, étape par étape : ajouter un widget à OBS, réunir les chats Twitch et Kick, lire le chat dans un dock OBS, ajouter des alertes de stream, lancer un timer de subathon, faire un sondage dans le chat, encadrer ta caméra et ton chat, lancer un compte à rebours avant ton live, organiser un tirage au sort dans le chat et changer de scène depuis le chat. Ils parlent tous d'outils gratuits qui ne demandent aucune connexion.",
      listLabel: 'Tous les guides',
      moreText:
        'Pour les questions générales, va voir la [FAQ](/faq). Pour voir ce qui a changé, direction les [nouveautés](/changelog).',
    },
    obs: {
      title: 'Ajouter un widget Senchabot à OBS comme source Navigateur web',
      short: 'Ajouter un widget à OBS',
      summary:
        'Les étapes pour ajouter une source Navigateur web, la bonne taille pour chaque widget, deux réglages à laisser désactivés, et quoi vérifier si le widget semble vide.',
      lead: "Les widgets Senchabot s'ajoutent à OBS comme source Navigateur web : clique sur + dans le dock Sources, choisis Navigateur web, colle dans le champ URL l'URL copiée depuis la page de configuration, et règle la largeur et la hauteur sur la taille recommandée du widget. Pas besoin de te connecter ni de télécharger quoi que ce soit, et le fond est déjà transparent.",
      add: {
        title: 'Comment ajouter une source Navigateur web dans OBS ?',
        intro:
          'Une fois le nom de ta chaîne tapé sur la page de configuration et Copier cliqué, suis ces étapes dans OBS Studio :',
        step1: 'Sélectionne la scène où le widget doit apparaître.',
        step2: 'Dans le dock Sources, clique sur + et choisis Navigateur web dans la liste.',
        step3: 'Donne un nom à la source, par exemple "Boîte de chat", et clique sur OK.',
        step4:
          "Dans la fenêtre des propriétés qui s'ouvre, vide le champ URL et colle l'URL du widget que tu as copiée.",
        step5: 'Saisis les valeurs du tableau ci-dessous dans les champs Largeur et Hauteur.',
        step6: 'Clique sur OK et fais glisser la source où tu veux dans la scène.',
        note: "La [page de configuration de la Boîte de chat](/setup/chat-widget) affiche ces étapes avec la taille recommandée quand tu copies l'URL. Si tu veux être sûr, ouvre d'abord l'URL dans un onglet normal du navigateur et vérifie qu'elle marche.",
      },
      size: {
        title: 'Quelle taille pour chaque widget ?',
        intro:
          'Chaque widget a une taille de source recommandée. Saisis ces valeurs dans les champs Largeur et Hauteur dans OBS.',
        caption: 'Tailles de source Navigateur web recommandées pour les widgets Senchabot',
        colWidget: 'Widget',
        colSize: 'Largeur × Hauteur',
        colNote: 'Note',
        notSource: 'Pas une source',
        notes: {
          chatBox:
            'Une colonne de chat verticale. Une source plus grande affiche plus de messages, le texte garde la même taille.',
          emoteWall: "Un canevas 1080p complet. Les emotes apparaissent n'importe où sur l'écran.",
          subSprout: 'La plante et le pot poussent dans cette zone.',
          frames:
            "640x360 pour une caméra, 420x720 pour le chat, 1920x1080 pour l'écran. Le cadre s'adapte à la taille que tu lui donnes.",
          goal: "Une bande large pour la barre d'objectif, avec de la place au-dessus pour que les +1 montent.",
          subathon:
            "Une bande large pour la barre de vie, l'horloge ou l'anneau. Une source plus grande l'agrandit.",
          countdown:
            "Un canevas 1080p complet, pour que l'horloge tombe au centre de ta scène de début ou BRB.",
          poll: "De la place pour un sondage jusqu'à 6 options. Il se place en haut ou en bas et grandit avec les options.",
          streamAlerts:
            "Une alerte à la fois, au centre de cette zone. Une source plus grande l'agrandit.",
          raffle:
            "L'overlay du gagnant. Des confettis jaillissent des deux côtés de l'écran et le nom du gagnant apparaît au centre.",
          obsBridge:
            "Pas un overlay visible. Garde l'outil ouvert dans un onglet du navigateur ou un dock OBS.",
          socials:
            'Un pseudo à la fois, au centre de cette bande. Le texte garde sa taille, donc un long pseudo demande une source plus large.',
        },
        fontNote:
          "Pour agrandir le texte de la Boîte de chat, n'étire pas la source. Utilise le réglage Taille de police sur la page de configuration : de 8 à 72 pixels, 18 par défaut.",
      },
      transparent: {
        title: 'Faut-il faire quelque chose pour rendre le fond transparent ?',
        p1: "Non. Boîte de chat, Mur d'emotes, Sub Sprout, Subathon Timer, Alertes de stream, Objectif de subs, Sondage du chat et l'overlay du Tirage au sort sont dessinés sur un fond transparent. Pas besoin de chroma key ni de filtre, et tu peux laisser le champ CSS personnalisé d'OBS tel quel.",
        p2: 'Si la Boîte de chat est difficile à lire sur une scène claire, active Fond sombre. Ça ajoute une couche noire semi-transparente derrière le widget, et tu peux régler son opacité de 0 % à 100 % (50 % par défaut). Si tu veux chaque message dans sa propre boîte, active Fond par message.',
      },
      settings: {
        title:
          'Faut-il activer "Désactiver la source quand elle n\'est pas visible" et "Rafraîchir le navigateur lorsque la scène devient active" ?',
        intro:
          "Laisse les deux désactivés pour les widgets Senchabot. Les deux rechargent la page de zéro, et le widget oublie tout ce qu'il gardait jusque-là :",
        chatBox:
          "Boîte de chat : les messages n'arrivent que pendant que la source tourne. Si la source se coupe puis revient, l'écran repart vide et n'affiche que les nouveaux messages.",
        subSprout:
          "Sub Sprout : la pousse de la plante n'est enregistrée nulle part. Si la page se recharge, la plante revient au premier stade.",
        goal: 'Objectif de subs : le compteur est enregistré dans OBS, donc un rechargement ne le perd pas, mais les subs qui arrivent pendant que la source est coupée ne sont pas comptés.',
        poll: 'Sondage du chat : le sondage et ses votes sont enregistrés dans OBS, donc un rechargement ne les perd pas, mais les votes tapés pendant que la source est coupée ne sont pas comptés.',
        subathon:
          'Subathon Timer : le temps restant est enregistré dans OBS, donc un rechargement ne le perd pas. Le timer continue de décompter pendant que la source est coupée, mais il ne voit pas les subs qui arrivent pendant ce temps.',
        streamAlerts:
          "Alertes de stream : seuls les subs, cadeaux, cheers et raids qui arrivent pendant que la source tourne ont une alerte. Tout ce qui arrive pendant qu'elle est coupée est perdu.",
        raffle:
          "Overlay du Tirage au sort : seul l'overlay ouvert à ce moment-là reçoit le gagnant. Un gagnant tiré pendant que la source est coupée n'apparaît jamais à l'écran.",
        emoteWall:
          "Mur d'emotes : les emotes restent 5 secondes par défaut, donc un rafraîchissement ne te coûte rien, mais il n'aide pas non plus.",
        refresh:
          'Si un widget bloque, double-clique sur la source et clique sur le bouton "Rafraîchir le cache de cette page" dans la fenêtre des propriétés. Ça recharge la page une fois.',
      },
      update: {
        title: 'Comment modifier un widget plus tard ?',
        p1: "Tes réglages sont dans l'URL du widget, donc changer un réglage veut dire une nouvelle URL. Change le réglage sur la page de configuration, copie la nouvelle URL, puis double-clique sur la source dans OBS et colle-la à la place de l'ancienne dans le champ URL.",
        p2: "Pas besoin de tout recommencer avec [Boîte de chat](/setup/chat-widget), [Mur d'emotes](/setup/emote-wall), [Sub Sprout](/setup/sub-growing-plant), [Subathon Timer](/setup/subathon-timer), [Alertes de stream](/setup/stream-alerts), [Objectif de subs](/setup/sub-goal), [Sondage du chat](/setup/chat-poll), [Cadres de stream](/setup/stream-frames), [Réseaux sociaux](/setup/socials) ou [Compte à rebours de stream](/setup/stream-countdown). Colle ton URL actuelle dans le champ URL du widget sur la page de configuration et tes chaînes et tous tes réglages reviennent. Change ce que tu veux et copie la nouvelle URL.",
        p3: "OBS Bridge n'a pas de champ pour coller une URL, donc saisis à nouveau tes réglages sur sa page de configuration et copie la nouvelle URL de l'outil. Tu peux aussi changer les choix de scènes et les utilisateurs autorisés directement sur la page de l'outil et récupérer la nouvelle URL avec son bouton Copier l'URL à jour. Les anciennes URL continuent de marcher, donc pas besoin de les mettre à jour.",
      },
      troubleshoot: {
        title: "Que faire si le widget n'apparaît pas dans OBS ?",
        intro:
          "La plupart du temps, c'est le nom de la chaîne qui pose problème. Fais ces vérifications dans l'ordre.",
        linkTitle: 'Tu as tapé un lien au lieu du nom de la chaîne ?',
        linkBody:
          'Tape seulement le nom dans le champ de la chaîne : `senchabot` pour twitch.tv/senchabot. Si tu colles le lien complet, le widget prend le lien pour le nom de la chaîne et ne peut se connecter à aucun chat.',
        channelTitle: 'La chaîne existe-t-elle vraiment ?',
        channelBody:
          "Vérifie qu'il n'y a pas de faute dans le nom. Une chaîne qui n'existe pas sur Twitch ne renvoie pas d'erreur. Le widget reste juste vide.",
        quietTitle: "Il s'est déjà passé quelque chose dans le chat ?",
        quietBody:
          "La Boîte de chat et le Mur d'emotes restent complètement vides et transparents tant qu'il ne se passe rien dans le chat. Envoie un message dans le chat ; pour le Mur d'emotes, il doit par défaut être fait uniquement d'emotes, mais avec Toutes les emotes activé, les emotes dans les messages normaux comptent aussi. L'overlay du Tirage au sort n'apparaît lui aussi que quand un gagnant est tiré, et disparaît après 10 secondes. Sub Sprout et le Subathon Timer, eux, s'affichent tout de suite.",
        kickTitle: 'Chaîne Kick introuvable ?',
        kickBody:
          "Quand le widget s'ouvre, il cherche la chaîne Kick sur kick.com. Si cette recherche échoue (mauvais nom, chaîne inexistante, ou Kick qui ne répond pas), les messages Kick n'arrivent pas. Tape ton nom Kick exactement comme il apparaît dans l'URL kick.com.",
        tabTitle: "L'URL marche-t-elle dans un navigateur ?",
        tabBody:
          "Ouvre l'URL dans un onglet normal du navigateur. Si elle marche là mais pas dans OBS, vérifie le champ URL et la taille de la source.",
      },
      ctaTitle: 'Choisis ton widget et récupère son URL',
      ctaText: 'Chaque page de configuration te donne une URL prête à coller dans OBS.',
    },
    chat: {
      title: 'Afficher les chats Twitch et Kick ensemble dans OBS',
      short: 'Chats Twitch et Kick ensemble',
      summary:
        "Réunir les deux chats avec une seule URL de Boîte de chat, montrer d'où vient chaque message, les emotes, masquer les bots et le mode horizontal pour une barre en bas.",
      lead: "La Boîte de chat réunit les chats Twitch et Kick dans une seule source Navigateur web. Sur la page de configuration, choisis Les deux sous Plateformes, tape les deux noms de chaîne et ajoute l'unique URL obtenue à OBS en 400 × 600. Pas de connexion, les deux chats sont lus anonymement.",
      setup: {
        title: 'Comment réunir les chats Twitch et Kick dans un seul overlay ?',
        step1: 'Ouvre la [page de configuration de la Boîte de chat](/setup/chat-widget).',
        step2: "Choisis Les deux sous Plateformes. C'est déjà la valeur par défaut.",
        step3: 'Tape juste les noms de chaîne dans les champs Chaîne Twitch et Chaîne Kick.',
        step4: "Ajuste le style. L'aperçu montre chaque changement tout de suite.",
        step5: "Copie l'URL du widget et ajoute-la à OBS comme source Navigateur web en 400 × 600.",
        p1: "L'URL obtenue contient les deux chaînes, par exemple `/widgets/chat-widget?twitch=yourchannel&kick=yourchannel`. Pas besoin d'une source séparée pour chaque plateforme.",
        p2: "L'aperçu joue toujours un chat de test. Comme ça, tu vois à quoi ressembleront tes réglages en stream sans que personne n'écrive sur ta chaîne.",
      },
      restream: {
        title: 'La Boîte de chat me diffuse-t-elle sur les deux plateformes ?',
        p1: "Non. La Boîte de chat lit seulement le chat et l'affiche à l'écran. Elle n'envoie pas ton stream sur Twitch ou Kick, et elle ne peut pas écrire dans le chat. Pour streamer sur les deux plateformes à la fois, il te faut une solution de multistream à part ; la Boîte de chat réunit les deux chats sur ce stream.",
        p2: "La modération s'applique aussi à l'overlay : les messages supprimés et ceux des utilisateurs qui prennent un timeout ou un ban sont retirés de l'écran.",
      },
      platform: {
        title: 'Comment savoir si un message vient de Twitch ou de Kick ?',
        intro:
          "Quand les deux plateformes sont actives, Indicateur de plateforme montre d'où vient chaque message, au début du message. Il y a trois options :",
        icon: 'Icône de la plateforme (par défaut) : le logo Twitch ou Kick.',
        name: "Nom de la plateforme : le texte `[twitch]` ou `[kick]` au lieu d'un logo.",
        none: 'Masquer la plateforme : aucun marqueur.',
        stripe:
          "Active Bande de couleur de la plateforme et une fine ligne apparaît à gauche de chaque message : violette pour Twitch, verte pour Kick. Avec la bande activée, tu peux masquer l'indicateur pour un rendu plus épuré. Sur un message mis en avant, la couleur de mise en avant remplace la bande.",
      },
      look: {
        title: 'Quelles mises en page, animations et polices ?',
        layoutTitle: 'Mise en page des messages',
        inline: 'En ligne (par défaut) : pseudo et message sur la même ligne.',
        stacked: 'Empilée : pseudo au-dessus, message en dessous.',
        card: 'Carte / Bulle : chaque message est dans une carte semi-transparente.',
        compact: 'Compacte : des lignes serrées, style Twitch, avec un texte un peu plus petit.',
        animationTitle: 'Animation des nouveaux messages',
        animations:
          "Il y a huit options : Glissement depuis la droite (par défaut), Glissement doux depuis la droite, Pop / zoom, Rebond, Décalé, Fondu, Machine à écrire et Aucune animation. Quand le chat s'accélère, toutes les animations sauf celle par défaut raccourcissent. Si les messages arrivent plus vite qu'un toutes les demi-secondes, l'animation descend jusqu'à un tiers de sa durée normale, pour qu'aucune ne peine à suivre la suivante.",
        fontTitle: 'Police et taille',
        fonts:
          'Inter (par défaut), Roboto, Nunito, JetBrains Mono, Source Serif 4 et la Police du système. La taille de police va de 8 à 72 pixels, 18 par défaut. Pseudos en gras et Messages en gras sont deux options séparées.',
      },
      duration: {
        title: "Combien de temps les messages restent-ils à l'écran ?",
        p1: '30 secondes par défaut. Sous Durée des messages, tu peux choisir 10 s, 15 s, 30 s, 1 min, 2 min, 5 min ou Pour toujours.',
        p2: 'Avec Pour toujours, les messages ne disparaissent pas : les nouveaux poussent les anciens vers le haut, ce qui ne rentre pas dans la boîte est coupé, et au maximum les 100 derniers messages sont gardés.',
      },
      emotes: {
        title: "Quelles emotes s'affichent ?",
        intro:
          "Les emotes propres à Twitch et Kick s'affichent toujours en images. En plus, tu peux activer ou désactiver trois fournisseurs dans le menu Emotes, et les trois sont activés par défaut.",
        caption: "Plateformes gérées par chaque fournisseur d'emotes dans la Boîte de chat",
        colProvider: 'Fournisseur',
        colPlatforms: 'Marche sur',
        both: 'Twitch et Kick',
        twitchOnly: 'Twitch uniquement',
        p1: "Les emotes de la chaîne et les emotes globales se chargent ensemble. Si deux emotes ont le même nom, celle de la chaîne gagne, et l'ordre entre fournisseurs est 7TV, BTTV, FFZ. Sur les messages Kick, 7TV utilise le set d'emotes lié au compte Kick de la chaîne. Si seul ton compte Twitch est lié sur 7TV, les messages Kick utilisent aussi ce set. Les emotes d'un fournisseur désactivé restent en texte brut.",
      },
      filters: {
        title: 'Comment masquer les bots et les commandes ?',
        bots: 'Masquer les bots retire les messages des comptes de bots connus : Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, Sery_Bot, SoundAlerts, StreamlootsBot, KofiStreamBot, PokemonCommunityGame, OWN3D, Blerp, BotRix, KickBot, Kicklet et Senchabot. Les comptes avec le badge "Chat Bot" sur Twitch ou le badge "Bot" sur Kick sont aussi masqués.',
        commands:
          'Masquer les commandes masque chaque message qui commence par "!", donc les commandes comme `!discord` ou `!uptime` restent hors de ton écran. Pour masquer aussi ce que le bot répond à une commande, active les deux réglages.',
        highlights:
          "Pour faire l'inverse et faire ressortir certains messages, utilise Mises en avant. Les cinq sont désactivées par défaut, donc active juste celles que tu veux : les messages qui mentionnent ta chaîne ou te répondent, la ligne au-dessus d'une réponse qui montre à qui on répond, les premiers messages, les annonces, et les messages envoyés avec Mettre mon message en évidence. Les trois dernières sont réservées à Twitch, car Kick n'envoie pas cette info.",
      },
      horizontal: {
        title: "Comment mettre le chat en barre en bas de l'écran ?",
        p1: "Règle Orientation sur Horizontal. Les messages s'alignent côte à côte, le plus récent apparaît à droite, et les plus anciens glissent vers la gauche hors de la boîte.",
        p2: "La suggestion 400 × 600 est pour un usage vertical. Pour une barre horizontale, règle la largeur de la source sur la longueur de la barre et la hauteur sur une seule ligne de messages, puis place la source en bas de l'écran.",
      },
      others: {
        title: 'Quels autres widgets écoutent les deux plateformes ensemble ?',
        p1: "[Mur d'emotes](/setup/emote-wall), [Sub Sprout](/setup/sub-growing-plant), [Subathon Timer](/setup/subathon-timer), [Alertes de stream](/setup/stream-alerts), [Objectif de subs](/setup/sub-goal) et [Sondage du chat](/setup/chat-poll) prennent aussi les deux chaînes dans une seule URL. Le Mur d'emotes fait voler à travers l'écran les messages d'emotes des deux chats. Sub Sprout pousse avec les abonnements des deux plateformes, subs offerts sur Kick compris. Le Subathon Timer ajoute du temps pour les subs, subs offerts, Bits et Kicks des deux chats. Alertes de stream affiche une alerte pour les subs, subs offerts, Bits, Kicks et raids des deux. L'Objectif de subs additionne les subs et subs offerts des deux chats dans un seul compteur. Le Sondage du chat met les votes des deux chats dans un seul résultat.",
        p2: 'Le [Tirage au sort](/setup/raffle), lui, fonctionne sur une seule plateforme à la fois : Twitch ou Kick.',
      },
      ctaTitle: 'Configurer la Boîte de chat',
      ctaText:
        "Tape tes noms de chaîne, copie l'URL, ajoute-la à OBS. Sans connexion, sans téléchargement.",
      ctaSecondary: "Découvrir le Mur d'emotes",
    },
    raffle: {
      title: 'Organiser un giveaway dans le chat sur Twitch ou Kick',
      short: 'Organiser un giveaway dans le chat',
      summary:
        "Participer avec !join, tirages réservés aux abonnés, limites de victoires, durée minimale et gagnant affiché sur le stream avec des confettis, le tout avec l'outil Tirage au sort.",
      lead: "Avec l'outil Tirage au sort, les viewers participent en tapant un mot-clé dans le chat et tu tires le gagnant en un clic. Le mot-clé par défaut est `!join`. Pas de connexion ; les participants et les gagnants sont enregistrés dans ton propre navigateur.",
      start: {
        title: 'Comment lancer un tirage ?',
        step1:
          'Ouvre la [page du Tirage au sort](/setup/raffle) et choisis la plateforme : Twitch ou Kick. Un tirage fonctionne sur une seule plateforme.',
        step2:
          'Tape le nom de la chaîne. Les participations sont lues dans le chat de cette chaîne.',
        step3:
          "Règle le Mot-clé de participation. Par défaut c'est `!join`, et tu peux le remplacer par le mot de ton choix.",
        step4:
          'Choisis tes règles, puis clique sur Lancer le tirage. Le bouton reste désactivé tant que le mot-clé est vide.',
        step5:
          "Les participants s'affichent dans la liste. Une fois qu'il y en a assez, clique sur Tirer le gagnant.",
        p1: "Les réglages se verrouillent au lancement du tirage, pour que les règles ne changent pas en cours de route. Pour clore les inscriptions, clique sur Fermer les participations ; tu peux encore tirer un gagnant après. Lancer un nouveau tirage vide la liste des participants, donc la page te demande de confirmer d'abord.",
      },
      entry: {
        title: 'Comment les viewers participent-ils au tirage ?',
        p1: "Les viewers tapent le mot-clé dans le chat. Les majuscules ne comptent pas, et le message peut continuer tant qu'il commence par le mot-clé : `!join` et `!join good luck` comptent, `hey !join` non.",
        p2: 'Chaque personne participe une fois. Retaper la commande ne donne pas de deuxième chance.',
        p3: "Les bots connus ne peuvent pas participer du tout : Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, BotRix, SoundAlerts, Blerp, Kofi_Stream_Bot et Senchabot. Pour retirer quelqu'un de la liste à la main, clique sur le bouton ✕ à côté de son nom.",
      },
      rules: {
        title: 'Quelles règles peux-tu fixer ?',
        caption: 'Règles du tirage, options et valeurs par défaut',
        colRule: 'Règle',
        colOptions: 'Options',
        colDefault: 'Par défaut',
        subsOnly: 'Abonnés uniquement',
        subsOnlyOptions: 'Activé ou désactivé',
        subsOnlyDefault: 'Désactivé',
        minMonths: 'Mois de sub minimum',
        minMonthsOptions: '1 ou plus, seulement si Abonnés uniquement est activé',
        minMonthsDefault: '1',
        maxWins: 'Victoires max par viewer',
        maxWinsOptions: '1 à 5, ou illimité',
        maxWinsDefault: '1',
        minDuration: 'Durée minimale',
        minDurationOptions: '0 à 300 secondes',
        minDurationDefault: '15 secondes',
        subsText:
          "Avec Abonnés uniquement activé, quiconque n'a pas de badge d'abonné ne peut pas participer. Le streamer compte aussi comme abonné, donc tu peux participer à ton propre tirage tant que Mois de sub minimum est à 1. À 1, tous les abonnés peuvent participer ; mets-le à 6 et seuls ceux abonnés depuis au moins 6 mois entrent. Sur Twitch comme sur Kick, l'ancienneté du sub est lue sur le badge d'abonné du viewer.",
        winsText:
          'Un gagnant tiré sort de la liste des participants et passe dans la liste des gagnants. Si la limite est 1, il ne peut pas regagner dans le même tirage. Si la limite est plus haute ou illimitée, il peut revenir en retapant le mot-clé.',
        durationText:
          "Le bouton Tirer le gagnant reste bloqué tant que ce temps n'est pas écoulé depuis le lancement du tirage, et il affiche les secondes restantes. Ça laisse le temps de participer aux viewers qui arrivent en retard.",
        fairText:
          'Le gagnant est tiré parmi les participants éligibles avec le générateur de nombres aléatoires sécurisé du navigateur (`crypto.getRandomValues`).',
      },
      storage: {
        title: 'Je perds le tirage si je rafraîchis la page ?',
        p1: "Non. Les réglages, les participants et les gagnants sont stockés dans le stockage local du navigateur (localStorage). Même si tu rafraîchis ou fermes puis rouvres la page, tu reprends exactement là où tu t'étais arrêté.",
        p2: "Ces données ne vivent que dans ce navigateur, donc elles n'apparaîtront pas sur un autre ordinateur ou navigateur. Le chat n'est pas lu pendant que la page est fermée, donc les commandes tapées entre-temps ne comptent pas. Pour tout recommencer, utilise Tout réinitialiser ; tu peux aussi effacer seulement les participants ou seulement les gagnants.",
      },
      overlay: {
        title: 'Comment afficher le gagnant sur le stream ?',
        p1: "Ajoute l'URL de l'overlay du gagnant depuis la page du Tirage au sort (`/widgets/raffle-overlay`) à OBS comme source Navigateur web en 1920 × 1080. Quand tu cliques sur Tirer le gagnant, l'overlay affiche le nom du gagnant au centre de l'écran, des confettis jaillissent des deux côtés pendant 3 secondes, et le nom disparaît après 10 secondes.",
        warnTitle: 'Teste toujours avant ton live',
        warn: "Le gagnant arrive sur l'overlay via BroadcastChannel, qui ne marche qu'à l'intérieur d'un même navigateur. Si tu ouvres la page du Tirage au sort dans un navigateur séparé comme Chrome et que tu ajoutes l'overlay à OBS, les deux tournent dans des applis différentes et le gagnant n'arrive jamais dans OBS. Avant ton live, fais un tirage de test et vérifie que le gagnant s'affiche dans OBS.",
        p2: "Garde la scène avec l'overlay active et laisse \"Désactiver la source quand elle n'est pas visible\" décoché sur la source ; une source coupée rate le gagnant. Les détails sont dans le [guide OBS](/guides/obs-browser-source). Le gagnant s'affiche toujours avec des confettis sur la page du Tirage au sort aussi, donc tu peux y lire le nom même si l'overlay ne marche pas.",
      },
      ctaTitle: 'Prépare ton tirage',
      ctaText:
        'Choisis la plateforme, tape ta chaîne, règle le mot-clé. Ton premier tirage est prêt en une minute.',
    },
    bridge: {
      title: 'Laisser tes modos changer de scène OBS depuis le chat',
      short: 'Changer de scène depuis le chat',
      summary:
        'Activer le WebSocket pour OBS Bridge, les commandes du chat, comment !scene trouve une scène, et qui peut utiliser les commandes.',
      lead: 'OBS Bridge écoute le chat Twitch ou Kick et transmet à OBS, sur ton ordinateur, les commandes des personnes que tu autorises. Active le serveur WebSocket dans OBS, renseigne ta chaîne et les utilisateurs autorisés sur la page de configuration, et garde ouverte l\'URL de l\'outil obtenue. Quand un modo tape `!scene game`, OBS passe sur une scène dont le nom contient "game".',
      websocket: {
        title: 'Comment activer le WebSocket dans OBS ?',
        step1: 'Dans OBS, ouvre Outils → Paramètres du serveur WebSocket dans le menu du haut.',
        step2: 'Coche la case Activer le serveur WebSocket.',
        step3:
          "Si l'authentification est activée, clique sur Afficher les informations de connexion et copie le mot de passe.",
        step4: 'Clique sur OK.',
        p1: "OBS Bridge parle à obs-websocket 5, intégré à OBS Studio 28 et plus. Par défaut, il se connecte à `ws://127.0.0.1:4455` ; si OBS est sur le même ordinateur, laisse le champ URL WebSocket vide. Si OBS est sur un autre ordinateur, saisis l'adresse et le port de cet ordinateur, par exemple `ws://192.168.1.20:4455`. S'il ne peut pas se connecter, l'outil réessaie toutes les 5 secondes.",
      },
      setup: {
        title: 'Comment configurer OBS Bridge ?',
        step1: "Ouvre la [page de configuration d'OBS Bridge](/setup/obs-bridge).",
        step2: 'Tape la chaîne Twitch, la chaîne Kick ou les deux à écouter.',
        step3: 'Ajoute les Utilisateurs autorisés. Qui ajouter est expliqué plus bas.',
        step4: "Saisis ton mot de passe WebSocket OBS, et change l'URL WebSocket si besoin.",
        step5:
          "Copie l'URL de l'outil et ouvre-la dans un onglet du navigateur ou comme dock Internet personnalisé dans OBS.",
        step6:
          "La page de l'outil liste tes scènes OBS. Clique sur les boutons Principale et BRB à côté des scènes que tu veux utiliser comme principale et BRB.",
        p1: "Si tu n'en choisis aucune, il cherche les scènes nommées `Main Scene` pour la principale et `BRB Scene` pour la BRB. Tes choix sont enregistrés dans l'URL de la page de l'outil, alors recopie l'URL après avoir choisi et garde-la quelque part. La prochaine fois que tu l'ouvres, les mêmes scènes se chargent.",
      },
      commands: {
        title: 'Quelles commandes du chat existent ?',
        caption: "Commandes du chat par défaut d'OBS Bridge",
        colCommand: 'Commande',
        colAction: "Ce qu'elle fait",
        sceneArg: '<nom de scène>',
        scene: 'Passe à la scène dont le nom correspond',
        brb: 'Passe à la scène BRB',
        back: 'Passe à la scène principale',
        stream: 'Lance / arrête le stream',
        record: "Lance / arrête l'enregistrement",
        p1: "`brb` et `back` se tapent sans point d'exclamation. Les commandes ignorent les majuscules, mais le message entier doit être la commande : `brb` marche, `brb 5 min` non. Tu peux renommer chaque commande sous Commandes sur la page de configuration, par exemple `!switch` au lieu de `!scene`.",
        p2: "La commande d'arrêt du stream termine vraiment ton stream. Garde la liste des autorisés courte.",
      },
      matching: {
        title: 'Comment la commande !scene trouve-t-elle la bonne scène ?',
        p1: 'Elle cherche d\'abord une correspondance exacte : `!scene game` passe sur la scène nommée exactement "Game", sans tenir compte des majuscules. Sans correspondance exacte, elle prend la première scène dont le nom contient ce mot : `!scene chatting` trouve la scène "Just Chatting". Si aucune scène ne correspond, rien ne se passe.',
        p2: 'Si plusieurs scènes contiennent le même mot, celle qui est la plus haute dans ta liste Scènes gagne. Avec des scènes aux noms proches, taper le nom complet est le plus sûr. Quand tu ajoutes ou renommes une scène, la liste se met à jour toute seule.',
      },
      users: {
        title: 'Qui peut utiliser les commandes ?',
        p1: 'Seulement les personnes de la liste Utilisateurs autorisés. Si la liste est vide, personne ne peut utiliser les commandes, même pas le streamer, donc tu dois aussi ajouter ton propre compte.',
        p2: "Chaque utilisateur est ajouté avec une plateforme et apparaît dans l'URL sous la forme `commandUser=twitch:bob,kick:alice`. Un message ne compte comme commande que si la plateforme et le nom correspondent tous les deux. Comme ça, même si quelqu'un sur Kick prend le pseudo d'un modo Twitch, il ne peut pas changer de scène.",
        p3: "Les anciens noms enregistrés sans plateforme (juste `bob`) marchent sur cette plateforme si l'URL n'en configure qu'une. Quand les deux plateformes sont actives, ces noms sont marqués en jaune sur la page de l'outil et ne peuvent pas utiliser les commandes tant que tu ne leur as pas choisi de plateforme.",
      },
      open: {
        title: "La page de l'outil doit-elle rester ouverte ?",
        p1: "Oui. C'est la page de l'outil qui lit le chat et transmet les commandes à OBS. Si tu fermes l'onglet, les commandes ne marchent plus. Garde l'outil ouvert dans un onglet ou comme dock dans OBS pendant tout le stream ; si la connexion à OBS saute, l'outil essaie de se reconnecter toutes les 5 secondes.",
      },
      security: {
        title: "Pourquoi traiter l'URL de l'outil comme un mot de passe ?",
        p1: "Parce que ton mot de passe WebSocket OBS est dans l'URL (le paramètre `obsWebsocketPassword`). Partager l'URL, c'est partager ton mot de passe. Ne la montre pas en stream, ne la poste pas dans le chat, et cache la barre d'adresse quand tu partages ton écran.",
        p2: "La connexion à OBS va directement de ton navigateur à OBS. La page de l'outil elle-même se charge depuis extensions.senchabot.com comme n'importe quel site, donc l'adresse complète, mot de passe compris, part avec cette requête.",
      },
      ctaTitle: 'Configurer OBS Bridge',
      ctaText:
        "Renseigne ta chaîne et les utilisateurs autorisés, puis ouvre l'URL de l'outil. Les commandes de scène marchent tout de suite.",
    },
    subathon: {
      title: 'Lancer un timer de subathon sur Twitch et Kick',
      short: 'Lancer un timer de subathon',
      summary:
        'Combien de temps ajoutent chaque sub, sub offert, cheer de Bits et envoi de Kicks, le lancement avec !subathon, les commandes des modos, et ce qui se passe quand OBS se ferme ou que le temps est écoulé.',
      lead: "Le Subathon Timer est un compte à rebours que les subs repoussent. Règle un temps de départ et combien ajoutent chaque sub, sub offert, cheer de Bits et envoi de Kicks, ajoute l'URL à OBS comme source Navigateur web en 800 × 300, et tape `!subathon start` dans le chat quand tu lances ton live. Pas de connexion ; il lit ton chat public Twitch et Kick.",
      setup: {
        title: 'Comment configurer un timer de subathon ?',
        step1: 'Ouvre la [page de configuration du Subathon Timer](/setup/subathon-timer).',
        step2: 'Choisis Twitch, Kick ou Les deux et tape juste les noms de chaîne.',
        step3:
          'Règle le Temps de départ, 1 heure par défaut, et un Temps maximum si tu en veux un.',
        step4:
          'Règle combien de temps ajoutent un sub, un sub offert, les Bits et les Kicks. Avec Les deux, Twitch et Kick ont chacun leur onglet.',
        step5:
          "Choisis un style et une couleur, copie l'URL et ajoute-la à OBS comme source Navigateur web en 800 × 300.",
        p1: "L'aperçu sur la page de configuration joue des subs, des subs offerts et des cheers simulés en vitesse 60×, donc un timer d'une heure se termine en une minute environ. Tu peux régler la vitesse de 1× à 300×. Les boutons Teste ajoutent un sub, 5 subs offerts ou 500 Bits/Kicks, retirent 10 minutes, mettent en pause et réinitialisent. Ils ne changent que l'aperçu, jamais le timer dans OBS.",
      },
      values: {
        title: 'Combien de temps ajoute chaque sub ?',
        intro:
          "Tu choisis le temps en minutes entières, de 0 à 60, et 0 désactive cet événement. Twitch et Kick ont des valeurs séparées, toutes à 1 minute par défaut. Afficher sur le timer, activé par défaut, les liste sur le timer, comme Sub +1 min, pour que les viewers sachent ce qu'ajoute leur sub. Quand Twitch et Kick ajoutent des temps différents, les deux s'affichent à tour de rôle.",
        caption: 'Temps ajouté par chaque événement au timer de subathon',
        colEvent: 'Événement',
        colDefault: 'Par défaut',
        colHow: 'Comment ça compte',
        oneMinute: '1 min',
        sub: 'Sub',
        subHow: 'Chaque nouveau sub et resub. Sur Twitch, un sub Prime compte comme un Niveau 1.',
        gift: 'Sub offert',
        giftHow: 'Chaque sub du cadeau, donc 5 subs offerts ajoutent cinq fois plus.',
        bits: '500 Bits ou 500 Kicks',
        bitsHow:
          'Les autres montants ajoutent leur part : à 1 minute, 100 Bits ajoutent 12 secondes.',
        tiers:
          "Avec Niveaux 2 et 3 comptent plus activé, ce qui est le cas par défaut, un sub ou sub offert Twitch Niveau 2 ajoute deux fois plus de temps et un Niveau 3 cinq fois plus, en fonction de leur prix. Les subs Kick n'ont pas de niveaux, donc chacun compte une fois.",
        cap: "Le Temps maximum est le plus de temps que le timer peut contenir. Ce qui irait au-delà n'est pas ajouté, et aucun +temps ne s'affiche. Avec Pas de limite, la valeur par défaut, le timer continue de grimper tant que les subs arrivent.",
      },
      start: {
        title: 'Comment lancer le subathon ?',
        p1: "Par défaut, le timer attend en pause jusqu'à ce que toi ou un modo tapiez `!subathon start` dans le chat. Comme ça, tu peux ajouter la source avant le stream et lancer le compteur une fois en live. Si tu choisis Tout de suite sous Démarrage, le timer démarre dès que la source se charge dans OBS.",
        p2: "Les subs qui arrivent avant le lancement ajoutent quand même du temps, tout comme ceux pendant que le timer est en pause. Le temps t'attend quand le compteur démarre.",
      },
      commands: {
        title: 'Quelles commandes du chat les modos peuvent-ils utiliser ?',
        caption: 'Commandes du chat du Subathon Timer',
        colCommand: 'Commande',
        colAction: "Ce qu'elle fait",
        start: 'Lance le timer, ou le relance après une pause',
        pause: 'Le met en pause ; le temps restant ne bouge pas',
        add: "Ajoute du temps, jusqu'au Temps maximum",
        remove: "Retire du temps, jusqu'à zéro",
        set: 'Définit le temps restant',
        reset: 'Recommence depuis le Temps de départ',
        p1: 'Seuls le streamer et les modérateurs peuvent les utiliser, sur Twitch et sur Kick. Les VIP et les viewers ne peuvent pas. Le timer ne répond pas dans le chat ; tu vois le résultat sur le timer lui-même.',
        p2: 'Écris les durées comme `10m`, `45s`, `1h30m` ou `1:30:00`. Un nombre seul compte en minutes, donc `!subathon add 15` ajoute 15 minutes. Les unités sont des lettres seules : `10min` ne marche pas, `10m` oui.',
      },
      look: {
        title: 'Quels styles et couleurs ?',
        bar: 'Barre de vie (par défaut) : une barre façon jeu vidéo qui se vide de 100 % vers zéro.',
        clock: 'Horloge : de grands chiffres en heures, minutes et secondes.',
        ring: "Anneau : un cercle qui se vide à mesure que le temps s'écoule.",
        p1: "La couleur par défaut, Vie, passe du vert à l'orange puis au rouge quand le temps baisse. Tu peux aussi choisir une couleur fixe : vert, violet, rouge, or, cyan ou rose. Le titre à côté du timer affiche SUBATHON par défaut ; change-le pour ce que tu veux jusqu'à 32 caractères, ou laisse-le vide pour le masquer.",
        p2: "Afficher le pourcentage montre à quel point le timer est rempli. 100 % correspond au temps le plus haut atteint jusqu'ici, donc il ne dépasse jamais 100 % : quand du temps s'ajoute à une barre pleine, elle reste pleine et décompte depuis le nouveau sommet. Afficher le temps ajouté fait monter un +1:00 avec le pseudo du viewer au-dessus du timer à chaque ajout de temps.",
      },
      saved: {
        title: 'Que se passe-t-il si OBS se ferme ou si la source se recharge ?',
        p1: "Le timer est enregistré dans OBS, donc après un rechargement ou un redémarrage d'OBS, il revient là où il en était. Pendant qu'OBS est fermé, il continue de décompter, comme une vraie échéance.",
        p2: "Rien ne lit ton chat pendant qu'OBS ou la source est coupé, donc les subs pendant ce temps n'ajoutent rien. Un modo peut les ajouter ensuite avec `!subathon add`. C'est aussi pour ça que \"Désactiver la source quand elle n'est pas visible\" doit rester décoché ; le [guide OBS](/guides/obs-browser-source) explique pourquoi.",
        p3: "Le timer enregistré appartient à cet OBS et à ces chaînes. Si tu changes les chaînes dans l'URL, par exemple en ajoutant Kick en plein subathon, ou si tu ouvres l'URL dans un autre OBS ou un onglet du navigateur, un nouveau timer démarre.",
      },
      zero: {
        title: 'Que se passe-t-il quand le timer arrive à zéro ?',
        p1: "Il s'arrête à 00:00:00 et clignote en rouge, et les styles Barre de vie et Anneau affichent K.O. Les nouveaux subs n'ajoutent plus de temps, donc le subathon est terminé.",
        p2: 'Pour continuer, un modo tape `!subathon add` ou `!subathon set` avec une durée, et le timer repart tout de suite. Pour lancer un nouveau subathon, tape `!subathon reset`.',
      },
      change: {
        title: 'Comment modifier le timer ou lancer un nouveau subathon ?',
        p1: "Colle ton URL actuelle dans le champ URL du widget sur la page de configuration. Tes chaînes et tes réglages reviennent ; change ce que tu veux, copie la nouvelle URL et colle-la à la place de l'ancienne dans OBS. Les nouvelles valeurs de temps et un nouveau Temps maximum s'appliquent dès qu'OBS charge la nouvelle URL, et le temps restant ne change pas.",
        p2: "Un nouveau Temps de départ ne s'applique tout seul que tant que le timer n'a jamais démarré. Après, tape `!subathon reset` dans le chat pour recommencer depuis le nouveau Temps de départ. Si Démarrage est réglé sur la commande, le timer attend ensuite à nouveau en pause jusqu'à `!subathon start`.",
      },
      notCounted: {
        title: "Qu'est-ce qui n'ajoute pas de temps ?",
        follows:
          "Les follows et les dons. Twitch et Kick ne montrent pas les nouveaux follows à une page non connectée, et aucune des deux plateformes n'a de système de dons à elle.",
        raids: 'Les raids, sur les deux plateformes.',
        resubs:
          'Les resubs Twitch que le viewer ne partage pas. Twitch ne signale un resub au chat que quand le viewer le partage. Kick envoie les renouvellements comme des subs, donc ils comptent.',
        bits: 'Les Bits dépensés hors du chat, comme les Power-ups. Seuls les Bits envoyés en cheer dans le chat comptent.',
        sharedChat:
          'Les subs et cheers dans une chaîne partenaire pendant une session de Chat partagé sur Twitch. Seule ta propre chaîne compte.',
      },
      ctaTitle: 'Configure ton timer de subathon',
      ctaText: "Règle le temps de départ et ce qu'ajoute chaque sub, copie l'URL, ajoute-la à OBS.",
    },
    poll: {
      title: 'Faire un sondage dans le chat sur Twitch et Kick',
      short: 'Faire un sondage dans le chat',
      summary:
        "Lancer un sondage avec !poll, les façons de voter, un vote par viewer, le délai du stream, et ce qui se passe quand le temps est écoulé ou qu'OBS se ferme.",
      lead: "Le Sondage du chat affiche sur ton stream un sondage où les chats Twitch et Kick votent en tapant un numéro. Ajoute l'URL à OBS comme source Navigateur web en 640 × 560, puis toi ou un modo tapez `!poll Question | A | B` dans le chat. Pas de connexion ni de bot : il lit ton chat public.",
      setup: {
        title: 'Comment configurer un sondage du chat ?',
        step1: 'Ouvre la [page de configuration du Sondage du chat](/setup/chat-poll).',
        step2: 'Choisis Twitch, Kick ou Les deux et tape juste les noms de chaîne.',
        step3:
          'Si tu veux un sondage prêt avant le stream, tape une question et 2 à 6 options sous Sondage prêt. Il se lance avec `!poll start`.',
        step4:
          "Règle la Durée du sondage (1 minute par défaut), combien de temps les résultats restent à l'écran et qui peut voter.",
        step5:
          "Choisis une couleur, une position et la langue du sondage, copie l'URL et ajoute-la à OBS comme source Navigateur web en 640 × 560.",
        p1: "L'aperçu sur la page de configuration joue un sondage avec des votants simulés, plus vite qu'en vrai, puis lance le suivant. Les boutons Teste ajoutent 10 votes, ajoutent 30 secondes, terminent le sondage et en lancent un nouveau. Ils ne changent que l'aperçu, jamais le sondage dans OBS.",
      },
      commands: {
        title: 'Comment lancer un sondage depuis le chat ?',
        intro:
          'Seuls le streamer et les modérateurs peuvent gérer les sondages, sur Twitch et sur Kick. Les VIP et les viewers ne peuvent pas : un viewer qui tape `!poll` ne change rien.',
        caption: 'Commandes du chat du Sondage du chat',
        colCommand: 'Commande',
        colAction: "Ce qu'elle fait",
        question: 'Question',
        new: "Lance un nouveau sondage avec 2 à 6 options, pour la Durée du sondage de l'URL",
        newTime: 'Pareil, avec sa propre durée : 90s, 2m, 1m30s ou 1:30',
        yesNo: 'Lance un sondage rapide avec Oui et Non comme options',
        start: "Lance le sondage prêt enregistré dans l'URL",
        extend: 'Ajoute du temps à un sondage ouvert qui a un timer',
        end: "Termine le vote tout de suite ; le gagnant s'affiche après le Délai du stream",
        cancel: "Retire le sondage de l'écran, résultats compris",
        p1: "Sépare la question et les options avec `|`. Les options au-delà de la sixième sont ignorées, tout comme les doublons, même avec une casse différente. La question peut faire jusqu'à 80 caractères et chaque option jusqu'à 30. Un nouveau sondage remplace celui à l'écran.",
        p2: "Un mot de commande a besoin des bons arguments : `!poll extend 30 seconds` ne fait rien au lieu d'en faire une question. Un nombre seul avant la question n'est pas lu comme une durée, donc `!poll 3 or 4 games? | 3 | 4` garde sa question. Le sondage ne répond pas dans le chat ; tu vois le résultat à l'écran.",
      },
      voting: {
        title: 'Comment les viewers votent-ils ?',
        number: "Le numéro de l'option tout seul, comme `2`.",
        command: '`!vote 2` ou `!2`, pour les viewers habitués aux sondages de bots.',
        text: "L'option elle-même : `speedrun` vote pour Speedrun, en majuscules ou minuscules et avec ou sans accents ou lettres turques.",
        p1: "Le message entier doit être le vote. `2 please`, `4Head` ou `1 more game` ne comptent pas, donc le chat normal ne se transforme jamais en votes. Quand une option est elle-même un nombre, son texte gagne : dans un sondage `3 | 4 | 5`, taper 3 vote pour l'option 3, pas pour la troisième option.",
        p2: 'La commande `/vote` de Twitch sert aux sondages natifs de Twitch, alors dis au chat de taper le numéro. Le sondage affiche un indice comme "Tape de 1 à 3 dans le chat" sous ses options.',
      },
      rules: {
        title: 'Un viewer peut-il voter plusieurs fois ?',
        p1: "Non. Chaque compte Twitch ou Kick compte une fois. Avec Les viewers peuvent changer de vote activé, ce qui est le cas par défaut, un nouveau numéro déplace le vote ; désactive-le et le premier vote est définitif. Un vote pour une option qui n'existe pas ne fait jamais perdre à un viewer le vote qu'il avait déjà.",
        p2: "Avec Qui peut voter réglé sur Abonnés, seuls les viewers avec un badge d'abonné ou de fondateur peuvent voter, plus toi. Quand tout le monde vote, Poids d'un vote de sub fait compter le vote d'un sub 2 ou 3 fois. Le sondage l'indique à l'écran, et les pourcentages utilisent ces votes pondérés.",
        p3: 'Si un modo met en timeout ou bannit un compte pendant que le sondage prend des votes, son vote est retiré, ce qui aide à annuler une vague de bots de spam.',
      },
      timing: {
        title: 'Que se passe-t-il quand le temps est écoulé ?',
        p1: 'Les viewers regardent ton stream avec quelques secondes de retard sur le chat, donc quand leur écran affiche 1 seconde restante, le sondage est déjà fermé dans le chat. Les votes continuent de compter pendant le Délai du stream après la fin du timer, 5 secondes par défaut, pendant que le sondage affiche Derniers votes. Règle-le selon le retard de tes viewers ; Twitch et Kick ont en général 2 à 10 secondes de retard.',
        p2: "Ensuite, le gagnant s'allume en doré avec une couronne et les autres options s'assombrissent. Quand deux options ou plus ont le plus de votes, le sondage annonce une égalité. Les résultats restent affichés pendant Résultats à l'écran, 30 secondes par défaut, puis le sondage s'efface. Mets 0 pour les garder jusqu'au sondage suivant ou `!poll cancel`.",
        p3: "Avec Durée du sondage à 0, le sondage n'a pas de timer et reste ouvert jusqu'à ce qu'un modo tape `!poll end`. `!poll extend` n'ajoute du temps qu'à un sondage qui a un timer.",
      },
      look: {
        title: 'Comment changer son apparence ?',
        blind:
          "Masquer les résultats jusqu'à la fin : les barres restent cachées pendant le vote et seul le nombre de votes s'affiche, pour que les premiers votes n'influencent pas les autres.",
        color: 'Couleur : violet (par défaut), vert, rouge, or, cyan ou rose.',
        position:
          "Position : le sondage se place en haut ou en bas de la source navigateur et grandit à partir de là selon le nombre d'options.",
        language:
          "Langue du sondage : anglais, espagnol, français, allemand, japonais, portugais ou turc pour les mots du sondage, comme Résultats et le Oui et le Non d'un sondage rapide.",
        p1: 'Avec les deux plateformes actives, le sondage affiche combien de votes viennent de Twitch et de Kick à côté du total. La source est transparente, donc seule la carte du sondage apparaît sur le stream.',
      },
      saved: {
        title: 'Que se passe-t-il si OBS se ferme ou si la source se recharge ?',
        p1: "Le sondage et ses votes sont enregistrés dans OBS, donc un rechargement ou un redémarrage d'OBS le ramène là où il en était. Le timer continue de tourner pendant qu'OBS est fermé.",
        p2: "Rien ne lit ton chat pendant qu'OBS ou la source est coupé, donc les votes tapés pendant ce temps ne sont pas comptés. C'est pour ça que \"Désactiver la source quand elle n'est pas visible\" doit rester décoché ; le [guide OBS](/guides/obs-browser-source) explique pourquoi. Le sondage enregistré appartient à cet OBS et à ces chaînes.",
      },
      limits: {
        title: 'Ce que le Sondage du chat ne fait pas',
        chat: "Écrire dans le chat. Il lit seulement le chat, donc il n'y annonce jamais le sondage ni le gagnant ; le sondage sur le stream montre les deux.",
        native:
          'Afficher les sondages de Twitch ou de Kick. Ceux de Twitch ne peuvent pas être lus sans connexion, donc pour marcher pareil sur les deux plateformes, les votes viennent du chat.',
        points:
          'Prendre des votes en Points de chaîne ou en Bits. Chaque viewer a un vote, ou 2 ou 3 en tant que sub si tu actives cette option.',
        multiple: 'Le choix multiple. Chaque viewer choisit une seule option.',
      },
      ctaTitle: 'Configure ton sondage du chat',
      ctaText:
        'Mets un sondage prêt et les règles de vote dans une seule URL, ajoute-la à OBS et tape !poll dans le chat.',
    },
    frames: {
      title: 'Encadrer ta caméra, ton chat et ton écran dans OBS',
      short: 'Ajouter des cadres de stream',
      summary:
        "Ajouter des cadres de caméra, de chat et d'écran à OBS, l'ordre des sources, caler ta caméra dans le cadre, et choisir un preset et les animations.",
      lead: "Les Cadres de stream placent un cadre prêt à l'emploi autour de ta caméra, de ton chat ou de tout ton écran de stream, dans le style du preset choisi. Choisis la pièce et le preset sur la page de configuration, ajoute l'URL à OBS comme source Navigateur web et place-la par-dessus ta caméra ou ton chat. Le centre du cadre est transparent, et il n'y a ni chaîne à connecter ni connexion.",
      setup: {
        title: 'Comment configurer un cadre de stream ?',
        step1: 'Ouvre la [page de configuration des Cadres de stream](/setup/stream-frames).',
        step2:
          'Sous Tu encadres quoi ?, choisis Caméra, Chat ou Écran. Si tu as choisi Caméra, règle Orientation sur Paysage ou Portrait. Chaque pièce est sa propre source Navigateur web, donc ajoute les trois si tu veux.',
        step3:
          'Choisis un preset. Avec Classique, tu choisis la couleur. Les autres presets ont leurs propres couleurs, police et dessins.',
        step4:
          "Tape le nom de ta chaîne ou n'importe quel mot dans le champ Étiquette. Sur la caméra et le chat, il s'affiche sur l'onglet au-dessus du cadre, et sur l'écran sur la plaque en bas.",
        step5:
          "Copie l'URL et ajoute-la à OBS comme source Navigateur web : 640 × 360 pour une caméra (360 × 640 pour une caméra en portrait), 420 × 720 pour le chat, 1920 × 1080 pour l'écran.",
        p1: "L'aperçu montre le cadre avec la silhouette d'une personne ou des lignes de chat d'exemple. Ce ne sont que des exemples. En stream, le centre du cadre est vide.",
      },
      layers: {
        title: 'Pourquoi le cadre est derrière ma caméra ?',
        p1: 'Dans OBS, ce qui est plus haut dans la liste Sources passe devant dans la scène. Place la source du cadre au-dessus de ta caméra (Périphérique de capture vidéo) ou de ta Boîte de chat. Tu peux aussi faire un clic droit sur la source et choisir Ordonner → Déplacer tout en haut.',
        p2: 'Pour déplacer ta caméra et le cadre ensemble, sélectionne les deux, fais un clic droit et choisis Grouper les éléments sélectionnés. Quand tu redimensionnes le groupe, les deux suivent.',
        p3: "Le cadre d'écran doit passer devant toute la scène. Mets-le tout en haut de la liste pour que ton jeu et tes autres sources restent en dessous.",
      },
      fit: {
        title: 'Comment caler ta caméra dans le cadre ?',
        intro:
          "L'ouverture au centre du cadre est un peu plus petite que son bord extérieur. Ta caméra doit remplir l'ouverture mais rester dans le bord extérieur, sinon le surplus dépasse autour du cadre. Aux tailles recommandées, ces valeurs tombent bien :",
        caption: "Tailles de cadre recommandées et la source qui va à l'intérieur",
        colPiece: 'Pièce',
        colFrame: 'Taille du cadre',
        colInside: "Source à l'intérieur",
        camera: 'Caméra en paysage',
        cameraPortrait: 'Caméra en portrait',
        chat: 'Chat',
        screen: 'Écran',
        cameraInside: 'Caméra en 590 × 296, centrée sur le cadre',
        cameraPortraitInside: 'Caméra en 306 × 572, centrée sur le cadre',
        chatInside: 'Boîte de chat en 370 × 660, centrée sur le cadre',
        screenInside: "La capture de jeu ou d'écran remplit toute la scène",
        p1: "Une caméra 16:9 mise à 590 de large fait 332 de haut, donc rogne le haut et le bas de façon égale jusqu'à 296. Maintiens Alt (Option sur Mac) et fais glisser les bords haut et bas de la source, ou fais un clic droit sur la caméra et utilise les champs Rogner dans Transformer → Éditer la transformation. Pour une caméra en portrait, c'est l'inverse : une caméra 9:16 mise à 572 de haut fait 322 de large, donc rogne la gauche et la droite de façon égale jusqu'à 306.",
        p2: 'Si tu utilises un cadre plus grand, ces tailles suivent : dans un cadre de caméra 1280 × 720, la caméra fait 1180 × 592. Pour une caméra carrée, règle la largeur et la hauteur de la source Navigateur web pareil et le cadre est dessiné à cette forme.',
      },
      look: {
        title: 'Que changent le preset et les animations ?',
        p1: "Le preset définit la forme, les dessins, les couleurs et la police du cadre : un toit de pagode et des pompons dans Dynasty, des liserés dorés et des gemmes turquoise dans Rift, des blocs d'herbe et une barre d'inventaire dans Blocks. Donne le même preset à ta Boîte de chat, tes Alertes de stream et ton Objectif de subs et tout ce qui est à l'écran est assorti.",
        p2: "Avec Animations activé, un reflet fait le tour du cadre, les lignes brillent, et des lanternes, des torches ou des étincelles bougent selon le preset. Elles restent légères. Mais si ton PC rame pendant que tu joues, désactive Animations. Ça ajoute `motion=0` à l'URL et le cadre reste immobile.",
        p3: 'Tous les dessins ont été faits de zéro, sans logo ni visuel de jeu.',
      },
      change: {
        title: 'Comment modifier le cadre plus tard ?',
        p1: "Colle l'URL depuis OBS dans le champ URL du widget sur la page de configuration et tes réglages reviennent. Change le preset, la pièce ou l'étiquette, copie la nouvelle URL et colle-la à la place de l'ancienne dans la source Navigateur web. Pour changer le preset de tous tes widgets d'un coup, utilise la [page Presets](/presets).",
      },
      ctaTitle: 'Configure ton cadre',
      ctaText: "Choisis la pièce et le preset, vérifie l'aperçu, copie l'URL.",
    },
    countdown: {
      title: 'Ajouter un compte à rebours de début, de pause et de fin dans OBS',
      short: 'Ajouter un compte à rebours',
      summary:
        "Configurer un compte à rebours pour tes scènes de début, de pause et de fin, le faire recommencer à chaque changement de scène, décompter jusqu'à une heure précise, et les commandes du chat.",
      lead: "Le Compte à rebours de stream est une horloge pour les trois scènes où il ne se passe encore rien : ça commence bientôt, je reviens vite et fin du stream. Choisis la scène et une durée sur la page de configuration, ajoute l'URL à OBS comme source Navigateur web en 1920 × 1080, et coche Rafraîchir le navigateur lorsque la scène devient active pour qu'il recommence chaque fois que tu passes sur cette scène. Pas de connexion, et pas de chaîne sauf si tu veux les commandes du chat.",
      setup: {
        title: 'Comment configurer un compte à rebours de stream ?',
        step1:
          'Ouvre la [page de configuration du Compte à rebours de stream](/setup/stream-countdown).',
        step2:
          "Sous C'est pour quoi ?, choisis Début, Pause ou Fin. Ça définit le texte et l'icône, et chacun est sa propre source Navigateur web, donc tu peux ajouter les trois.",
        step3:
          'Sous Décompter, choisis Une durée et règle les minutes, ou choisis Une heure précise et tape une heure au format 24 h comme 21:00.',
        step4:
          "Choisis un preset, et sous À zéro, choisis ce qui reste à l'écran quand le temps est écoulé : un message, l'horloge à 00:00, ou rien du tout.",
        step5:
          "Copie l'URL et ajoute-la à la scène dans OBS comme source Navigateur web, en 1920 × 1080, pour que l'horloge tombe au centre de ta scène.",
        p1: "L'aperçu sur la page de configuration tourne en accéléré pour que tu voies tout le compte à rebours en quelques secondes. En stream, il décompte en temps réel.",
      },
      restart: {
        title: 'Pourquoi mon compte à rebours ne recommence pas ?',
        p1: "Le compte à rebours démarre quand la source navigateur se charge. Si la source s'est chargée à l'ouverture d'OBS, elle décompte depuis, donc quand tu passes sur ta scène BRB, elle est déjà à zéro.",
        p2: 'Ouvre les propriétés de la source Navigateur web et coche "Rafraîchir le navigateur lorsque la scène devient active". OBS recharge la page chaque fois que tu passes sur cette scène, donc le compte à rebours repart du début à chaque pause.',
        p3: "Avec une chaîne renseignée, tu peux aussi taper `!countdown reset` dans le chat, ce qui le relance sans toucher à OBS. C'est la solution la plus rapide quand tu es déjà AFK.",
      },
      clock: {
        title: "Comment décompter jusqu'à une heure précise ?",
        p1: "Choisis Une heure précise et tape l'heure que tu as annoncée, ex. 21:00. Le compte à rebours lit l'horloge de l'ordinateur qui fait tourner OBS, donc peu importe quand la source se charge : à 18:30 il affiche 2:30:00, et à 20:55 il affiche 05:00.",
        p2: "Si l'heure est déjà passée aujourd'hui, il vise la même heure demain. Une source laissée ouverte toute la nuit est donc prête pour le stream suivant, et `!countdown reset` la recale sur la prochaine.",
        p3: "Les viewers dans d'autres pays voient ton compte à rebours, pas leur propre horloge, et c'est voulu : tout le monde voit le même nombre de minutes restantes.",
      },
      commands: {
        title: 'Les modos peuvent-ils modifier le compte à rebours depuis le chat ?',
        p1: "Oui, une fois ta chaîne Twitch ou Kick renseignée sur la page de configuration. Toi et tes modos pouvez alors lancer ces commandes dans l'un ou l'autre chat :",
        caption: 'Les commandes !countdown',
        colCommand: 'Commande',
        colDoes: "Ce qu'elle fait",
        addDoes: 'Ajoute 5 minutes ; 90s et 1h30m marchent aussi',
        removeDoes: 'Retire 2 minutes',
        setDoes: 'Règle le temps restant sur 10 minutes',
        pauseDoes: "Met l'horloge en pause là où elle est",
        startDoes: 'La relance après une pause',
        resetDoes: 'Relance le compte à rebours depuis le début',
        sceneDoes:
          'Change la scène en pause, début ou fin, et règle la durée (10m par défaut si elle est omise)',
        p2: 'Seuls toi et tes modos pouvez les lancer, sur les deux plateformes, et une réponse dans le chat ne lance jamais de commande. Le compte à rebours lit ton chat public comme les autres widgets, sans connexion.',
      },
      scenes: {
        title: 'Quel compte à rebours sur quelle scène ?',
        p1: "Début va sur la scène où tu restes avant ton live, avec une durée comme 10 minutes, ou l'heure que tu as annoncée. Pause va sur ta scène BRB avec une durée plus courte, en général 5 ou 10 minutes. Fin va sur la dernière scène, pour que le chat voie combien de temps il reste avant que tu coupes.",
        p2: "Si tu changes de scène depuis le chat avec [OBS Bridge](/setup/obs-bridge), tes modos peuvent t'envoyer sur la scène BRB et le compte à rebours démarre avec.",
      },
      ctaTitle: 'Configure ton compte à rebours',
      ctaText: "Choisis la scène et la durée, regarde l'aperçu, copie l'URL dans OBS.",
    },
    alerts: {
      title: 'Ajouter des alertes de sub, cheer et raid Twitch et Kick dans OBS',
      short: 'Ajouter des alertes de stream',
      summary:
        "Les alertes de chaque plateforme, thèmes et couleurs, montants minimum, faire passer le son dans OBS, et pourquoi il n'y a pas d'alertes de follow.",
      lead: "Alertes de stream affiche une alerte animée avec son propre son pour chaque sub, sub offert, cheer de Bits, envoi de Kicks et raid sur Twitch et Kick. Tape tes noms de chaîne sur la page de configuration, choisis un thème et ajoute l'URL à OBS comme source Navigateur web en 800 × 450. Pas de connexion, et une seule URL couvre les deux plateformes.",
      setup: {
        title: 'Comment ajouter des alertes de stream à OBS ?',
        step1: 'Ouvre la [page de configuration des Alertes de stream](/setup/stream-alerts).',
        step2: 'Choisis Twitch, Kick ou Les deux et tape juste les noms de chaîne.',
        step3: 'Choisis un thème et une couleur, et désactive les alertes que tu ne veux pas.',
        step4:
          "Copie l'URL et ajoute-la à OBS comme source Navigateur web en 800 × 450, puis place-la là où les alertes doivent apparaître.",
        step5:
          "Active Contrôler l'audio via OBS dans les propriétés de la source pour que le son parte sur ton stream. Plus de détails sur le son plus bas.",
        p1: "Entre les alertes, la source est vide et transparente. Si tu ouvres l'URL dans un onglet du navigateur pour la vérifier, tu verras une page blanche tant qu'il ne se passe rien sur ta chaîne.",
        p2: "Pour la modifier plus tard, colle ton URL actuelle dans le champ URL du widget sur la page de configuration. Tes chaînes et tes réglages reviennent ; copie la nouvelle URL et colle-la à la place de l'ancienne dans OBS.",
      },
      kinds: {
        title: 'Quelles alertes existent ?',
        caption: 'Événements des Alertes de stream sur Twitch et Kick',
        colAlert: 'Alerte',
        sub: 'Subs',
        subTwitch: 'Nouveaux subs et resubs partagés, avec les mois et le message',
        subKick:
          'Nouveaux subs et renouvellements, avec les mois quand Kick les envoie, et resubs partagés dans le chat',
        gift: 'Subs offerts',
        giftBoth: 'Une alerte par cadeau, avec celui qui offre et le nombre de subs',
        bits: 'Bits et Kicks',
        bitsTwitch: 'Cheers de Bits, avec le montant et le message',
        bitsKick: 'Kicks, avec le montant et le message',
        raid: 'Raids',
        raidTwitch: 'La chaîne qui raid et le nombre de viewers venus',
        raidKick: 'La chaîne qui raid, et les viewers quand Kick les envoie',
        p1: "50 subs offerts d'un coup font une seule alerte, pas 50, et ceux qui reçoivent les subs n'ont pas d'alerte à eux. Un cadeau anonyme affiche Anonyme comme nom. Les niveaux ne sont pas affichés : un sub Prime, Niveau 1, Niveau 2 ou Niveau 3 a la même alerte.",
        p2: "Kick envoie les mois avec la plupart des subs, mais certaines chaînes ne les reçoivent jamais, et l'alerte dit alors juste qu'il s'est abonné. Quand un viewer Kick partage plus tard son resub dans le chat, il a sa propre alerte avec les mois et le message, donc un resub Kick peut apparaître deux fois. Sur Twitch, un resub n'arrive dans le chat que quand le viewer le partage, donc il apparaît une fois.",
        p3: "Pendant une session de Chat partagé sur Twitch, les subs, subs offerts, cheers et raids des chaînes partenaires ne s'affichent pas. Seule ta propre chaîne a des alertes.",
      },
      follows: {
        title: "Pourquoi il n'y a pas d'alertes de follow ou de don ?",
        p1: "Twitch et Kick ne montrent pas les nouveaux follows à une page non connectée, et aucune des deux plateformes n'a de système de dons à elle. Alertes de stream n'utilise que ce que les deux plateformes envoient à chaque viewer, c'est pour ça que le widget marche sans connexion et de la même façon sur les deux.",
      },
      look: {
        title: 'Quels thèmes et couleurs ?',
        neon: 'Neon (par défaut) : une bannière sci-fi anguleuse avec des sons de synthé. Quand elle part, elle grésille comme une enseigne au néon.',
        celestial:
          'Céleste : une carte bleu nuit sous les étoiles, avec un cadre fin et des carillons.',
        p1: "Couleur est l'accent de l'alerte. La valeur par défaut, Plateforme, affiche les alertes Twitch en violet et les alertes Kick en vert. Tu peux aussi choisir une seule couleur pour toutes les alertes : bleu, violet, rose, rouge, or ou vert. Quand les deux chaînes sont dans l'URL, une petite étiquette TWITCH ou KICK montre d'où vient chaque alerte.",
        p2: "Tu peux renommer le titre de chaque alerte, jusqu'à 24 caractères, ou le laisser vide pour garder celui par défaut, comme Nouvel abonné. Neon écrit les titres en majuscules. Langue des alertes définit la langue des mots de l'alerte : anglais, espagnol, français, allemand, japonais, portugais ou turc. Elle reste dans l'URL quelle que soit la langue d'OBS.",
      },
      min: {
        title: 'Comment ignorer les petits cadeaux, cheers et raids ?',
        caption: 'Montants minimum des Alertes de stream',
        colSetting: 'Réglage',
        colDefault: 'Par défaut',
        colRange: 'Plage',
        gift: 'Subs min. (subs offerts)',
        giftRange: '1 à 100 000',
        bits: 'Montant min. (Bits ou Kicks)',
        bitsRange: '1 à 100 000',
        raid: 'Viewers min. (raids)',
        raidRange: '0 à 100 000',
        p1: "Tout ce qui est sous le minimum n'a pas d'alerte. Un seul Montant min. couvre les Bits et les Kicks, et les subs n'ont pas de minimum. Si Kick envoie un raid sans nombre de viewers, il compte comme 0 viewer, donc un Viewers min. de 1 ou plus l'ignore.",
      },
      queue: {
        title: "Que se passe-t-il quand beaucoup d'alertes arrivent en même temps ?",
        p1: "Elles attendent leur tour et s'affichent une par une, dans l'ordre d'arrivée, avec une courte pause entre chacune. Durée à l'écran règle combien de temps chacune reste : de 3 à 20 secondes, 7 par défaut. Jusqu'à 30 alertes peuvent attendre dans la file ; s'il y en a plus, les plus récentes sont ignorées.",
        p2: 'Afficher le message du viewer, activé par défaut, affiche ce que le viewer a écrit avec son resub, ses Bits ou ses Kicks. Les liens sont retirés et les longs messages coupés, donc personne ne peut mettre un lien sur ton stream.',
      },
      sound: {
        title: 'Comment faire passer le son des alertes dans OBS ?',
        step1:
          "Double-clique sur la source Alertes de stream, coche Contrôler l'audio via OBS et clique sur OK. La source apparaît maintenant dans le Mélangeur audio.",
        step2: 'Ouvre Editer → Propriétés audio avancées dans le menu du haut.',
        step3:
          "Pour entendre toi aussi les alertes, règle Monitoring audio de la source sur Surveillance activée, appelé Monitoring et Sortie dans les anciennes versions d'OBS.",
        p1: "Le volume va de 0 à 100, 50 par défaut, et 0 coupe le son. Chaque alerte a son propre petit son assorti au thème : du synthé dans Neon, des cloches dans Céleste. OBS joue le son tout seul ; dans un onglet normal du navigateur, la page reste muette tant que tu n'as pas cliqué dessus une fois.",
      },
      test: {
        title: 'Comment tester les alertes avant ton live ?',
        p1: "L'aperçu sur la page de configuration joue des exemples d'alertes sans son. Les boutons Teste en dessous jouent un sub, un cadeau, des Bits/Kicks et un raid avec le son à ton volume actuel, pour que tu voies et entendes le thème avant de le choisir.",
        warnTitle: "Les boutons de test n'arrivent pas dans OBS",
        warn: "Ils ne jouent que dans l'aperçu de la page de configuration. La source dans OBS n'affiche que les vrais subs, cadeaux, cheers et raids de ta chaîne, donc tu ne peux pas lui envoyer d'alerte de test.",
        p2: 'Garde la scène avec la source active et laisse "Désactiver la source quand elle n\'est pas visible" décoché. Les alertes qui arrivent pendant que la source est coupée sont perdues, et elles ne sont pas jouées plus tard.',
      },
      ctaTitle: 'Configurer les Alertes de stream',
      ctaText: "Tape tes chaînes, choisis un thème, copie l'URL. Ton prochain sub aura son alerte.",
    },
    reader: {
      title: 'Lire les chats Twitch et Kick dans une seule fenêtre ou un dock OBS',
      short: 'Lire le chat dans un dock OBS',
      summary:
        "Ouvrir le Lecteur de chat, l'ajouter à OBS comme dock, ce qui se passe quand la connexion saute, et comment ton chat survit à un rafraîchissement.",
      lead: 'Le Lecteur de chat affiche tes chats Twitch et Kick dans une seule liste, dans un onglet du navigateur ou un dock OBS, pour que tu puisses le lire pendant ton stream. Ouvre-le avec le bouton Ouvrir le Lecteur de chat sur la page de configuration de la Boîte de chat. Il se reconnecte tout seul, signale chaque coupure dans la liste et garde ton chat après un rafraîchissement.',
      open: {
        title: 'Comment ouvrir le Lecteur de chat ?',
        step1:
          'Ouvre la [page de configuration de la Boîte de chat](/setup/chat-widget) et tape ta chaîne Twitch, ta chaîne Kick ou les deux.',
        step2:
          "Clique sur Ouvrir le Lecteur de chat sous l'URL du widget. Le lecteur s'ouvre dans un nouvel onglet.",
        step3:
          "Mets l'onglet en favori, ou garde son adresse, pour ouvrir le même lecteur la prochaine fois.",
        p1: "Le lecteur emporte les chaînes et quelques réglages de la Boîte de chat : fournisseurs d'emotes, badges, Masquer les bots, Masquer les commandes et Mises en avant. La police, la mise en page, l'animation et le reste du style restent avec l'overlay, et le lecteur a ses propres réglages de taille de texte et d'heure. Pour changer les réglages qu'il a emportés, change-les sur la page de configuration et rouvre le lecteur.",
      },
      dock: {
        title: 'Comment ajouter le Lecteur de chat à OBS comme dock ?',
        step1: "Ouvre le Lecteur de chat et copie l'adresse dans la barre d'adresse.",
        step2:
          "Dans OBS, ouvre Docks → Docks Internet personnalisés dans le menu du haut. Dans les anciennes versions, c'est sous Afficher → Docks.",
        step3:
          "Tape un nom comme Chat, colle l'adresse dans la colonne URL et clique sur Appliquer.",
        step4: "Fais glisser le nouveau dock où tu veux dans la fenêtre d'OBS.",
        p1: 'OBS a son propre stockage de navigateur, donc le dock garde son propre historique et ses réglages, séparés de ton navigateur habituel.',
      },
      shows: {
        title: 'Que montre le Lecteur de chat ?',
        p1: "Les messages des deux chats dans une seule liste, dans l'ordre d'arrivée. Quand les deux chaînes sont définies, une icône Twitch ou Kick montre d'où vient chaque message. Les emotes, les badges et les couleurs de pseudo s'affichent comme dans la Boîte de chat.",
        p2: "Les messages supprimés restent dans la liste, barrés et marqués (supprimé), pour que tu voies encore ce qui a été retiré. Quand quelqu'un prend un timeout ou un ban, ses messages précédents sont marqués de la même façon. Quand un modo vide le chat, une ligne dans la liste l'indique.",
        p3: "A- et A+ changent la taille du texte de 12 à 28 pixels, 15 par défaut. Le bouton horloge affiche ou masque l'heure des messages, et le bouton corbeille efface l'historique après un second clic. Le lecteur retient ta taille de texte et ton réglage d'heure.",
        p4: 'Si tu remontes pour lire quelque chose, la liste arrête de défiler. Un bouton en bas compte les nouveaux messages ; clique dessus pour revenir au chat en direct.',
      },
      drops: {
        title: 'Que se passe-t-il quand la connexion saute ?',
        p1: "Chaque chaîne a un statut en haut : Connexion, Connecté ou Reconnexion, ou Chaîne introuvable quand un nom Kick est introuvable. Quand une connexion au chat saute, un avis décompte jusqu'au prochain essai, et Réessayer tente tout de suite. Les essais commencent à 1 seconde d'écart et ralentissent jusqu'à un toutes les 30 secondes.",
        p2: "Le lecteur repère aussi une connexion qui devient muette sans se fermer, ce qui peut arriver après une coupure réseau. Si rien n'arrive pendant 30 secondes, il vérifie que le chat est toujours là et se reconnecte s'il n'y a pas de réponse. Si ton ordinateur passe hors ligne, il te le dit et se reconnecte dès qu'Internet revient.",
        p3: 'Chaque coupure est écrite dans la liste, comme "Connexion au chat Twitch perdue" et "De retour sur le chat Twitch après 12 s", pour que tu saches exactement où des messages peuvent manquer.',
      },
      history: {
        title: 'Tu perds ton chat quand tu rafraîchis ?',
        p1: "Non. Le lecteur enregistre les 1000 dernières lignes dans ton navigateur et les ramène quand tu le rouvres, suivies d'une ligne qui dit \"Sauvegardé depuis ta dernière visite, jusqu'à\" et l'heure. Les lignes de plus de 12 heures sont supprimées.",
        p2: "Les messages envoyés pendant que le lecteur était fermé ne reviennent pas : tout ce qui est au-dessus de cette ligne vient de ta dernière visite, tout ce qui est en dessous est nouveau. Chaque ensemble de chaînes garde son propre historique, et Effacer l'historique le supprime.",
      },
      limits: {
        title: 'Ce que le Lecteur de chat ne fait pas',
        send: 'Il ne peut pas envoyer de messages ni modérer. Il lit le chat anonymement, comme un viewer non connecté.',
        events:
          "Il n'affiche pas les notifications de sub, de sub offert ou de raid. Pour ça, ajoute les [Alertes de stream](/setup/stream-alerts) à ton stream.",
        missed:
          "Il ne peut pas ramener les messages envoyés pendant qu'il était fermé, sur aucune des deux plateformes.",
      },
      ctaTitle: 'Ouvrir le Lecteur de chat',
      ctaText:
        'Tape tes chaînes sur la page de configuration de la Boîte de chat et clique sur Ouvrir le Lecteur de chat.',
    },
  },
  presets: {
    classic: 'Classique',
    classicTag: 'Le style propre à chaque widget',
    breadcrumb: 'Presets',
    eyebrow: 'Presets',
    title: 'Des presets de jeux pour tes overlays de stream',
    lead: 'Choisis un preset et ta Boîte de chat, tes Alertes de stream, ton Objectif de subs, ton Subathon Timer, ton Sondage du chat, le gagnant du Tirage au sort et tes Cadres de stream ont le même cadre, les mêmes polices et les mêmes couleurs. Mets-en un sur tous les widgets, ou un différent sur chacun.',
    pickTitle: 'Choisis un preset',
    by: 'par {author}',
    community: 'Communauté',
    makeDefault: 'Utiliser {name} sur tous les widgets',
    isDefault: '{name} est ton preset par défaut',
    defaultHint:
      "Chaque page de configuration de ce navigateur démarre avec ton preset par défaut. Tu peux toujours choisir un autre preset sur n'importe quel widget.",
    previewTitle: '{name} sur tous les widgets',
    setUp: 'Configurer {widget}',
    previewIframeTitle: 'Aperçu de {widget} avec le preset {name}',
    descriptions: {
      classic:
        "Le style d'origine de chaque widget : les Alertes de stream en néon, la barre violette de l'Objectif de subs et le texte simple de la Boîte de chat. Tu choisis les couleurs.",
      rift: 'De fins cadres dorés avec des clous en diamant, des panneaux bleu nuit profond et des barres turquoise lumineuses, avec des titres en Cinzel.',
      realm:
        'Des cadres bronze et or à rivets, des panneaux de cuir sombre et des barres orange légendaire, avec des titres en Marcellus.',
      dynasty:
        'Des cadres en laque rouge avec des coins dorés, des panneaux de bois sombre et des barres pourpres, avec des titres en Zen Antique.',
      ancient:
        'Des cadres en fer sombre avec des coins en bronze, une lueur rouge en bas et des titres anguleux en Grenze.',
      agent:
        'Des coins coupés, un bord rouge, des barres inclinées et de grands chiffres en Teko sur ardoise sombre.',
      defuse:
        'Des coins de HUD, une ligne orangée en haut, des bandes de danger sur les barres et la police condensée Saira.',
      blocks:
        'Des cadres en pixels couleur herbe et terre, des barres vertes découpées en blocs et la police pixel Jersey 10.',
    },
    existingTitle: 'Tu as déjà des widgets dans OBS ?',
    existingText:
      'Colle leurs URL ici, une par ligne, et récupère-les avec {name}. Colle ensuite chacune dans le champ URL de sa source navigateur dans OBS. Le reste de chaque URL ne change pas.',
    existingLabel: 'URL des widgets',
    existingResult: 'Tes URL avec {name}',
    existingUnsupported: 'Ne prend pas de preset, laissée telle quelle',
    existingInvalid: "Ce n'est pas une URL de widget Senchabot",
    communityTitle: 'Crée ton propre preset',
    communityText:
      "Un preset, c'est un petit fichier JSON : neuf couleurs, deux Google Fonts et un style de cadre. Envoie le tien en pull request sur GitHub. Une fois fusionné, il apparaît ici et sur chaque page de configuration, avec ton nom.",
    communityLink: 'Comment créer un preset',
    communityEmpty: 'Pas encore de preset de la communauté. Le tien pourrait être le premier.',
    disclaimer:
      'Les noms de jeux sont des marques de leurs propriétaires. Ces presets sont des styles de couleurs, de polices et de dessins faits par des fans, sans visuel de jeu, et ils ne sont ni affiliés aux éditeurs des jeux ni approuvés par eux.',
    faqTitle: 'Questions sur les presets',
    faq1Q: 'Les presets changent-ils les widgets déjà dans OBS ?',
    faq1A:
      "Non. Le style d'un widget fait partie de son URL, donc un widget dans OBS garde son style tant qu'il n'a pas de nouvelle URL. Colle tes URL dans la zone ci-dessus pour les récupérer avec le preset.",
    faq2Q: 'Chaque widget peut-il avoir un preset différent ?',
    faq2A:
      "Oui. Ton preset par défaut, c'est seulement là où démarre chaque page de configuration. Sur la page de configuration de n'importe quel widget, tu peux choisir un autre preset, et l'URL de ce widget le garde.",
    faq3Q: 'Quels widgets prennent un preset ?',
    faq3A:
      "Boîte de chat, Alertes de stream, Objectif de subs, Subathon Timer, Sondage du chat, l'overlay du gagnant du Tirage au sort et Cadres de stream. Le Mur d'emotes n'affiche que des emotes et Sub Sprout dessine ses propres plantes, donc ils gardent leur style.",
    faq4Q: 'Ce sont des thèmes officiels des jeux ?',
    faq4A:
      'Non. Ce sont des styles faits par des fans, à partir de couleurs, de Google Fonts gratuites et de décorations dessinées de zéro, sans logo ni visuel de jeu, et ils ne sont pas affiliés aux éditeurs des jeux.',
    field: {
      label: 'Preset',
      tip: "Un style prêt à l'emploi pour ce widget : son cadre, ses polices et ses couleurs. Choisis le même preset sur chaque widget pour les assortir.",
      browse: 'Tous les presets',
      owns: 'Les couleurs et les polices viennent de {name}.',
      makeDefault: 'Mettre {name} par défaut',
      makeDefaultTip: 'Chaque page de configuration de ce navigateur démarrera avec.',
      isDefault: 'Ton preset par défaut',
    },
  },
  faqPage: {
    breadcrumb: 'FAQ',
    title: 'Questions fréquentes',
    lead: 'Des réponses rapides sur le prix, la confidentialité, les plateformes prises en charge et les URL de widgets de Senchabot Extensions. Pour configurer un widget précis, va voir les [guides](/guides).',
    groups: {
      basics: 'Prix et compte',
      platforms: 'Logiciels et plateformes',
      urls: 'Ton URL de widget et ta vie privée',
      help: 'Aide',
    },
    freeQ: 'Senchabot Extensions est-il gratuit ?',
    freeA:
      "Oui. Les neuf widgets et outils sont gratuits : Boîte de chat, Mur d'emotes, Sub Sprout, Subathon Timer, Alertes de stream, Objectif de subs, Sondage du chat, Tirage au sort et OBS Bridge. Pas d'offre payante, pas de filigrane, pas de compte premium. Le code source est ouvert sur GitHub sous licence GPL-3.0.",
    loginQ: 'Que veut dire "sans connexion" ?',
    loginA:
      "Tu ne crées pas de compte sur ce site, tu ne te connectes pas avec Twitch ou Kick, et tu ne télécharges rien. Tu tapes le nom de ta chaîne et la page de configuration te donne une URL. Les widgets lisent le chat public anonymement : sur Twitch, ils se connectent comme un viewer anonyme, et sur Kick, ils écoutent le flux public du chat. C'est pour ça qu'ils ne peuvent pas écrire dans le chat, modérer, ni accéder aux infos privées de ton compte.",
    affiliatedQ: 'Senchabot Extensions est-il affilié à Twitch ou à Kick ?',
    affiliatedA:
      "Non. Senchabot Extensions est fait par Senchabot, un bot communautaire open source pour Twitch, Discord, Kick et YouTube. Il n'a aucun lien officiel, partenariat ou soutien de Twitch ou de Kick.",
    appsQ: 'Avec quels logiciels de stream ça marche ?',
    appsA:
      'OBS Studio et tout autre logiciel de stream qui gère une source navigateur. Chaque widget tourne comme une URL web, et tu colles cette URL dans la source. Nos guides sont écrits pour OBS Studio.',
    platformsQ: 'Quels widgets gèrent Twitch et lesquels gèrent Kick ?',
    platformsA:
      "Les onze gèrent les deux plateformes. Boîte de chat, Mur d'emotes, Sub Sprout, Subathon Timer, Alertes de stream, Objectif de subs, Sondage du chat et Compte à rebours de stream écoutent une chaîne Twitch et une chaîne Kick ensemble dans une seule URL. OBS Bridge écoute les commandes des deux chats, et chaque utilisateur autorisé est ajouté avec sa propre plateforme. Le Tirage au sort fonctionne sur une seule plateforme à la fois, Twitch ou Kick. Dans la Boîte de chat, les emotes 7TV s'affichent sur les deux plateformes, et les emotes BTTV et FFZ seulement sur Twitch.",
    editQ: 'Comment modifier un widget plus tard ?',
    editA:
      "Change les réglages sur la page de configuration, copie la nouvelle URL, et colle-la à la place de l'ancienne dans le champ URL de la source dans OBS. Avec Boîte de chat, Mur d'emotes, Sub Sprout, Subathon Timer, Alertes de stream, Objectif de subs, Sondage du chat, Cadres de stream, Réseaux sociaux et Compte à rebours de stream, si tu colles ton ancienne URL dans le champ URL du widget sur la page de configuration, tous tes réglages reviennent et tu n'as pas à tout recommencer.",
    oldUrlsQ: 'Mes anciennes URL de widgets vont-elles continuer de marcher ?',
    oldUrlsA:
      "Oui. Les mises à jour sont faites pour ne pas casser les URL existantes : les noms de paramètres, les valeurs et les valeurs par défaut restent les mêmes. Par exemple, l'ancien keep=true de la Boîte de chat veut toujours dire Pour toujours, et Sub Sprout lit toujours les anciens paramètres channel et platform.",
    privacyQ: 'Où sont stockés mes réglages, et où vont mes données ?',
    privacyA:
      "Tes réglages sont dans l'URL du widget, pas dans un compte ni une base de données, donc toute personne qui a l'URL peut ouvrir le même widget. Comme pour n'importe quel site, l'adresse de la page que tu ouvres arrive chez notre hébergeur, et peut apparaître dans ses journaux de requêtes. Les widgets lisent le chat anonymement directement depuis Twitch et Kick, récupèrent les emotes depuis 7TV, BetterTTV et FrankerFaceZ, et les infos de chaîne Twitch depuis ivr.fi. Les participants et gagnants du Tirage au sort restent dans ton propre navigateur. L'URL d'OBS Bridge contient ton mot de passe WebSocket OBS, alors traite-la comme un mot de passe.",
    emptyQ: 'Pourquoi mon widget semble vide dans OBS ?',
    emptyA:
      "La Boîte de chat et le Mur d'emotes restent transparents et vides tant qu'il ne se passe rien dans le chat, donc envoie d'abord un message dans le chat. S'il n'y a toujours rien, vérifie que tu as tapé juste le nom de la chaîne, pas un lien, dans le champ de la chaîne, et que le nom est bien écrit. La liste complète des vérifications est dans le guide OBS.",
    bugQ: 'Comment demander un widget ou signaler un bug ?',
    bugA: "Ouvre une nouvelle issue dans le dépôt senchabot-opensource/monorepo sur GitHub. Pour signaler un bug, indique l'URL du widget (retire le mot de passe s'il y en a un), le logiciel de stream que tu utilises, et ce que tu vois. Pour les idées, tu peux aussi passer par GitHub Discussions ou le serveur Discord de Senchabot.",
    ctaTitle: "Tu n'as pas trouvé ta réponse ?",
    ctaText:
      "Les guides couvrent l'installation étape par étape et le dépannage. Toujours bloqué ? Contacte-nous sur GitHub.",
    ctaGuides: 'Voir les guides',
    ctaIssue: 'Ouvrir une issue sur GitHub',
  },
  changelog: {
    breadcrumb: 'Nouveautés',
    title: 'Nouveautés',
    lead: "Les nouvelles fonctionnalités et corrections de bugs de Senchabot Extensions, des plus récentes aux plus anciennes. La liste est tirée de l'historique des commits du projet sur [GitHub](https://github.com/senchabot-opensource/monorepo/commits/dev/apps/extensions).",
    site: 'Site',
    entries: {
      moreLanguages:
        'Le site est maintenant aussi disponible en espagnol, français, allemand, japonais et portugais, et Sondage du chat, Alertes de stream et les valeurs du Subathon Timer peuvent aussi afficher leurs textes dans ces langues.',
      countdownSceneCommand:
        'Ajout de la commande de chat `!countdown {scene} {duration}`. Les modos peuvent maintenant changer la scène actuelle (début, pause ou fin) et régler sa durée en une seule commande.',
      socialsLaunch:
        'Nouveau widget : Réseaux sociaux. Fais défiler tes liens de réseaux sociaux avec une animation de glissement soignée.',
      thinBarReadable:
        "La Barre fine du Subathon Timer et de l'Objectif de subs a un texte plus grand et détouré qui reste lisible sur n'importe quel remplissage, une lueur plus discrète, et de la place au-dessus des valeurs.",
      thinBars:
        "Le Subathon Timer et l'Objectif de subs ont maintenant un style Barre fine qui met le titre et le temps ou le compteur directement dans une barre de progression plus mince.",
      subathonAdjustedDefaults:
        'Ajuster selon le temps, sur le Subathon Timer, démarre maintenant à 5 heures avec des valeurs plus basses déjà remplies : sur Twitch 5 min par sub, 10 min par sub offert et 20 min par 500 Bits, sur Kick 10 min chacun.',
      subathonDynamicRates:
        "Le Subathon Timer a maintenant des valeurs ajustables : fixe un seuil pour réduire le temps qu'ajoute un sub quand le compteur est déjà haut.",
      scrollHint:
        "Les panneaux de configuration trop longs pour l'écran affichent maintenant une petite flèche en bas, pour montrer qu'il y a d'autres réglages plus bas. Clique dessus pour descendre, et une fois en bas, elle se retourne et te ramène en haut.",
      chatTextShadow:
        'La Boîte de chat a un choix Ombre du texte : Aucune, Normale (comme avant) ou Forte, un contour sombre qui garde le chat lisible sur les jeux clairs.',
      chatFonts:
        "La Boîte de chat a maintenant une police pour les pseudos et une autre pour les messages, et les deux restent disponibles avec un preset : garde les deux polices du preset, mets aussi sa police de titre sur les messages, ou mélange l'une ou l'autre avec Inter, Roboto, Nunito, JetBrains Mono, Source Serif 4 ou ta police système. Les pseudos et messages en gras marchent aussi maintenant avec les presets dont la police n'a qu'une seule graisse, comme Realm, Dynasty et Blocks.",
      sproutSaved:
        "Sub Sprout garde maintenant sa plante après un rechargement d'OBS et la reprend au stream suivant, au lieu de repartir du premier stade à chaque fois. Les modos peuvent la faire recommencer avec !grow reset.",
      countdown:
        "Nouveau Compte à rebours de stream : une horloge pour tes scènes ça commence bientôt, je reviens vite et fin du stream. Règle une durée ou l'heure de ton live, choisis un preset, et laisse tes modos le repousser depuis le chat avec !countdown.",
      deviceTheme:
        "Le site s'ouvre maintenant avec le thème clair ou sombre de ton appareil et le suit quand il change. Dès que tu cliques sur le bouton de thème dans l'en-tête, ton choix est retenu et l'appareil ne le change plus.",
      frames:
        "Nouveaux Cadres de stream : des cadres prêts à l'emploi pour ta caméra, ton chat et tout ton écran de stream. Chaque preset a ses propres dessins, comme un toit de pagode et des lanternes dans Dynasty ou des blocs en pixels dans Blocks.",
      subathonRates:
        "Le Subathon Timer peut maintenant lister ce qu'ajoutent un sub, un sub offert et 500 Bits ou Kicks, directement sur le timer, pour que les viewers sachent ce que vaut leur sub.",
      presets:
        "Nouveaux presets : un seul style pour la Boîte de chat, les Alertes de stream, l'Objectif de subs, le Subathon Timer, le Sondage du chat et le gagnant du Tirage au sort, avec des presets de jeux pour League of Legends, World of Warcraft, Metin2, Dota 2, Valorant, CS2 et Minecraft.",
      poll: 'Nouveau Sondage du chat : lance un sondage depuis le chat avec !poll, et les viewers sur Twitch et Kick votent en tapant un numéro. Barres en direct, un timer, un vote par viewer et le gagnant à la fin.',
      goal: "Nouvel Objectif de subs : une barre d'objectif que chaque sub, resub et sub offert sur Twitch et Kick remplit d'un cran, avec un trophée quand tu l'atteins. Les modos peuvent corriger le compteur avec !goal.",
      streamAlerts:
        'Nouvelles Alertes de stream : une alerte animée avec son propre son pour chaque sub, sub offert, Bits, Kicks et raid sur Twitch et Kick. Choisis une couleur, renomme les titres et fixe des montants minimum.',
      subathon:
        'Nouveau Subathon Timer : un compte à rebours que les subs, subs offerts, Bits et Kicks repoussent, affiché en barre de vie, en horloge ou en anneau. Tu choisis combien de temps chacun ajoute, et les modos le pilotent avec !subathon.',
      chatReader:
        'Nouveau Lecteur de chat : lis tes chats Twitch et Kick dans un onglet du navigateur ou un dock OBS. Il se reconnecte tout seul avec un compte à rebours, signale chaque coupure dans le chat et garde ton historique après un rafraîchissement.',
      chatSilentDrop:
        "La Boîte de chat, le Mur d'emotes et OBS Bridge remarquent quand la connexion au chat devient muette après une coupure Internet et se reconnectent tout seuls, tout de suite dès qu'Internet revient. Avant, ça pouvait prendre des minutes ou demander un rafraîchissement.",
      contentPages: 'Nouveaux guides, une page FAQ et cette page de nouveautés.',
      siteNav:
        "Chaque page a le même en-tête et le même pied de page : le menu des widgets, les choix de langue et de thème, et des liens vers les guides et l'aide.",
      notFound:
        "Aller sur une URL qui n'existe pas ouvre une page 404 avec des liens vers chaque widget.",
      geist:
        'Les pages du site utilisent Geist, la même police que senchabot.com. Les polices des overlays ne changent pas.',
      chatNextSteps:
        "Quand tu copies l'URL de la Boîte de chat, la page de configuration affiche les étapes pour l'ajouter à OBS avec la taille recommandée.",
      raffleMonthsInput:
        'Tu peux vider le champ Mois de sub minimum du Tirage au sort pendant la saisie, donc taper 6 ne donne plus 16.',
      raffleKeywordRequired:
        'Le Tirage au sort ne peut plus être lancé avec un mot-clé de participation vide. Avant, tu pouvais ouvrir un tirage auquel personne ne pouvait participer.',
      raffleMonthsSubsOnly:
        "Mois de sub minimum ne s'applique que quand Abonnés uniquement est activé, et le streamer peut participer à son propre tirage.",
      sproutPreviewSimulate:
        "L'aperçu de configuration de Sub Sprout continue d'animer la pousse après que tu as tapé une chaîne, pour que tu voies tout de suite la plante et les effets choisis.",
      sproutPreviewTint:
        "La zone d'aperçu de Sub Sprout affiche le fond légèrement transparent prévu au lieu d'un noir plein.",
      emoteWallUrl:
        "La configuration du Mur d'emotes n'écrit plus de valeurs fausses dans l'URL quand les champs Durée et Max. sont laissés vides, et ne crée plus d'URL sans chaîne.",
      bridgePassword:
        "OBS Bridge envoie le mot de passe même quand l'URL WebSocket est vide. Les connexions protégées par mot de passe marchent maintenant quand OBS est sur le même ordinateur.",
      chatFilters:
        "La Boîte de chat peut masquer les bots et les commandes qui commencent par !, garder les messages de 10 secondes à 5 minutes ou pour toujours, et te laisse choisir les fournisseurs d'emotes un par un.",
      chatEmoteProviders:
        'La Boîte de chat affiche les emotes 7TV, BTTV et FFZ dans les messages Twitch et les emotes 7TV dans les messages Kick.',
      sproutKickGifts:
        'Sub Sprout pousse avec les subs offerts sur Kick, et chaque sub offert compte comme un stade.',
      bridgeUserPlatform:
        "OBS Bridge enregistre les utilisateurs autorisés avec leur plateforme. Quelqu'un qui prend le même pseudo sur l'autre plateforme ne peut plus utiliser les commandes.",
      sevenTvActiveSet:
        "La Boîte de chat et le Mur d'emotes récupèrent les emotes 7TV depuis le set actif de la chaîne. Avant, des emotes d'un autre compte au nom proche pouvaient s'afficher.",
      chatColorCrash:
        "La Boîte de chat ne plante plus sur un écran d'erreur avec les messages qui ont une valeur de couleur inhabituelle.",
      bridgeReconnect:
        'OBS Bridge fait une seule tentative toutes les 5 secondes quand OBS est fermé ou que le mot de passe est faux. Les tentatives de connexion ne se multiplient plus.',
      raffleFakeEntries:
        "Le Tirage au sort ne compte plus comme participations les fausses lignes cachées dans les messages d'abonnement, donc personne ne peut s'en servir pour contourner Abonnés uniquement.",
      chatIrcParsing:
        'Le texte tapé dans le chat ne peut plus vider la Boîte de chat. Un timeout ou un ban ne retire que les messages de cette personne.',
      chatHighlights:
        'La Boîte de chat met en avant les messages qui te mentionnent, les réponses, les premiers messages, les annonces et les messages Mettre mon message en évidence. Tu choisis lesquels sont actifs pendant la configuration.',
      chatPasteUrl:
        'Coller une URL de widget existante dans la configuration de la Boîte de chat restaure tous tes réglages.',
      chatSingleScreen:
        'La page de configuration de la Boîte de chat a une nouvelle mise en page qui tient sur un seul écran. Les réglages sont regroupés sous Chaîne, Apparence et Messages.',
      chatIconAlign:
        'Les icônes Twitch et Kick de la Boîte de chat ont la même taille et sont alignées.',
      chatHideIndicator:
        "La Boîte de chat peut masquer complètement l'indicateur de plateforme quand la bande de couleur suffit.",
      chatSmoothSpeed:
        "La Boîte de chat a une animation Glissement doux depuis la droite, et l'aperçu de configuration a un réglage de vitesse du chat.",
      chatAdaptiveAnimations:
        "Les animations de la Boîte de chat raccourcissent quand le chat s'accélère. Le Glissement depuis la droite par défaut reste le même qu'avant.",
      chatTypewriter:
        'La Boîte de chat a une animation Machine à écrire. Quand un nouveau message arrive, les anciens glissent pour faire de la place au lieu de sauter.',
      chatPlatformStripe:
        'Les icônes de plateforme de la Boîte de chat sont plus grandes, et tu peux ajouter une bande de la couleur de la plateforme à gauche de chaque message.',
      emoteWallModes:
        "Le Mur d'emotes a un mode Rebond qui fait rebondir les emotes sur les bords, un mode hype et une protection contre le spam d'emotes.",
      sproutPotLabel:
        'Sub Sprout peut afficher une étiquette de stade comme 3/10 au-dessus du pot.',
      emoteWallLaunch:
        "Le Mur d'emotes est là : les messages Twitch et Kick faits uniquement d'emotes traversent l'écran en mode Calme ou Chaos.",
      sproutBothPlatforms:
        'Sub Sprout écoute une chaîne Twitch et une chaîne Kick ensemble dans une seule URL. Les anciennes URL avec channel et platform continuent de marcher.',
      chatPreviewMock:
        "L'aperçu de la Boîte de chat continue de jouer un chat de test après que tu as tapé une chaîne, pour que tu voies tes réglages sans que personne n'écrive.",
      siteLanguages:
        'Le site est disponible en turc et en anglais, et tu peux passer du thème clair au thème sombre.',
      bridgeSceneCommand:
        "OBS Bridge a une commande !scene qui passe sur n'importe quelle scène au nom correspondant. Tu peux aussi renommer chaque commande.",
      raffleBots: 'Le Tirage au sort ignore automatiquement les participations des bots connus.',
      chatReadableColors:
        'La Boîte de chat éclaircit les couleurs de pseudo difficiles à lire sur un fond sombre, et les ombres des messages sont plus légères.',
      chatBoldBadges:
        'La Boîte de chat a Messages en gras et une option pour masquer les badges. Les badges suivent la taille de police.',
      sproutWatering: "Sub Sprout a des effets d'arrosage pluie et étincelles.",
      chatItemBackground:
        'La Boîte de chat a un fond pour chaque message et une option de pseudo en gras. Si la connexion saute, elle se reconnecte toute seule au chat.',
      bridgeLaunch:
        "OBS Bridge est là : les utilisateurs autorisés peuvent passer sur les scènes BRB et principale avec des commandes du chat, et lancer ou arrêter le stream et l'enregistrement.",
      chatFade: 'La Boîte de chat a une animation Fondu.',
      sproutVarieties:
        'Sub Sprout a de nouvelles variétés de plantes comme la rose, le tournesol, le cactus, la tulipe et le lotus.',
      chatFontsLayouts:
        "La Boîte de chat te laisse choisir la police, la mise en page des messages et l'animation. Les messages supprimés et ceux des utilisateurs bannis sont aussi retirés de l'overlay.",
      raffleHardening:
        'Le Tirage au sort tire le gagnant avec un tirage aléatoire sécurisé, verrouille les règles une fois le tirage lancé, et ne te laisse pas tirer de gagnant avant la fin de la Durée minimale.',
      siteTutorial:
        "Les pages de configuration renvoient vers un tuto vidéo. Sur la page du Tirage au sort, tu peux copier l'URL de l'overlay en un clic.",
      chatPlatformPick:
        'La Boîte de chat te laisse choisir si le chat vient de Twitch, de Kick ou des deux.',
      chatSevenTv: 'La Boîte de chat affiche les emotes 7TV.',
      chatTimestamp:
        "La Boîte de chat te laisse choisir le nom ou l'icône de la plateforme et peut afficher l'heure des messages.",
      siteSetupPages:
        "Une nouvelle page d'accueil est en ligne, et chaque widget a maintenant sa propre page de configuration.",
      raffleLaunch:
        "Le Tirage au sort est là : les viewers participent en tapant un mot-clé dans le chat, tu peux fixer une limite de victoires par utilisateur, et le gagnant s'affiche sur le stream avec des confettis.",
      chatBgOpacity: "L'opacité du fond sombre de la Boîte de chat est réglable.",
      chatEmotesBadges: 'La Boîte de chat affiche les emotes Twitch et les badges Twitch et Kick.',
      chatOrientation:
        "La Boîte de chat marche aussi à l'horizontale, pour la placer en barre en bas de l'écran.",
      sitePreview:
        'La page de configuration affiche un aperçu en direct du widget à côté des réglages.',
      sproutKick: 'Sub Sprout compte aussi les abonnements Kick.',
      launch:
        'Senchabot Extensions est en ligne, avec une boîte de chat qui réunit les chats Twitch et Kick et Sub Sprout, une plante qui pousse avec les abonnements Twitch.',
    },
  },
  socials: {
    breadcrumb: 'Configuration des Réseaux sociaux',
    title: 'Configuration des Réseaux sociaux',
    intro:
      'Affiche tes pseudos de réseaux sociaux en stream. Le widget fait défiler les plateformes que tu remplis, une à la fois, avec une animation de glissement.',
    sectionPlatforms: 'Plateformes',
    platformsTip:
      'Tape ton pseudo pour chaque plateforme que tu veux afficher. Laisse les autres vides.',
    sectionAppearance: 'Apparence',
    rotationInterval: 'Intervalle de rotation',
    intervalSeconds: '{seconds} secondes',
    textColor: 'Couleur du texte',
    animation: 'Animation',
    animSlideUp: 'Glisser vers le haut',
    animSlideLeft: 'Glisser vers la gauche',
    animScale: 'Zoom',
    animFade: 'Fondu',
    pillColor: 'Couleur de fond de la pastille',
    previewTitle: 'Aperçu des Réseaux sociaux',
    previewIframeTitle: 'Aperçu des Réseaux sociaux',
    previewHint: 'Aperçu en direct de la rotation de tes réseaux sociaux.',
    widgetUrlTip:
      'Tu as déjà un widget ? Colle son URL ici pour charger tes réglages et changer ce dont tu as besoin.',
    widgetUrlPlaceholder: 'Colle une URL de widget existante pour la modifier',
    widgetUrlInvalid: "Ce n'est pas une URL de widget Réseaux sociaux.",
    browserSourceHintSize: ' (taille recommandée : 600×120).',
    guideTitle: 'Installation dans ton logiciel de stream (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Ajoute une source Navigateur web dans ton logiciel de stream (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: "Colle l'URL des réseaux sociaux que tu as copiée.",
    guideStep3: 'Règle la largeur sur 600 et la hauteur sur 120.',
    faq1Q: 'Le widget se met-il à jour si je change mes pseudos ?',
    faq1A:
      'Tu dois mettre ton URL à jour. Reviens sur cette page, colle ton URL existante pour charger tes réglages, tape tes nouveaux pseudos, et copie la nouvelle URL dans ton logiciel de stream.',
  },
};
