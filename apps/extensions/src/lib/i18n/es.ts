import type { en } from './en';

export const es: typeof en = {
  common: {
    freeBadge: '100% gratis · Sin iniciar sesión',
    copy: 'Copiar',
    copied: '¡Copiado!',
    home: 'Inicio',
    watchTutorial: 'Ver tutorial',
    widgetUrl: 'URL del widget',
    toolUrl: 'URL de la herramienta',
    channelPlaceholder: 'p. ej. tucanal',
    previewNoChannel: 'Escribe al menos un canal para generar la vista previa.',
    browserSourceHint:
      'Pega esta URL como fuente de navegador en OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio o cualquier programa que admita fuentes de navegador',
    themeToggle: 'Cambiar tema de color',
    languageToggle: 'Cambiar idioma',
    moreInfo: 'Más info',
    sectionChannel: 'Canal',
    sectionAppearance: 'Apariencia',
    platforms: 'Plataformas',
    platformsTip:
      '¿Qué plataforma quieres escuchar? Si haces stream en Twitch y Kick a la vez, elige Ambas.',
    platformBoth: 'Ambas',
    twitchChannel: 'Canal de Twitch',
    kickChannel: 'Canal de Kick',
    channelTip:
      'Escribe solo el nombre del canal, no el enlace completo. Para twitch.tv/senchabot, sería senchabot.',
    previewLoading: 'Cargando vista previa…',
    scrollMore: 'Desplázate para ver más',
    scrollTop: 'Volver arriba',
    setupGuideTitle: 'Cómo configurarlo',
    faqTitle: 'Preguntas frecuentes',
    moreWidgets: 'Más widgets',
    nextSteps: {
      title: 'Ahora añádelo a tu programa de streaming',
      addSource:
        'Añade una nueva fuente de navegador en OBS Studio o en cualquier programa que admita fuentes de navegador.',
      paste: 'Pega la URL en su campo URL.',
      size: 'Pon el ancho en {width} y el alto en {height}.',
      test: 'Abre la URL en una pestaña nueva para comprobar que funciona',
      dismiss: 'Ocultar',
    },
    siteName: 'Senchabot Extensions',
    homeLink: 'Inicio de Senchabot Extensions',
    skipToContent: 'Saltar al contenido',
    newTab: '(se abre en una pestaña nueva)',
    nav: {
      label: 'Principal',
      menu: 'Menú',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      widgets: 'Widgets',
      guides: 'Guías',
      presets: 'Presets',
      faq: 'Preguntas',
      senchabot: 'Senchabot',
      github: 'Código fuente en GitHub',
      switchWidget: 'Cambiar a otro widget',
      breadcrumb: 'Ruta de navegación',
    },
    notFound: {
      title: 'Página no encontrada',
      text: 'Esta página no existe o se ha movido. Elige un widget de abajo o vuelve al inicio.',
      home: 'Volver al inicio',
    },
    footer: {
      about:
        'Overlays y herramientas de stream gratis para Twitch y Kick. Sin iniciar sesión, sin descargas y con el código abierto.',
      license: 'GPL-3.0, código fuente en GitHub',
      social: 'Senchabot en redes sociales',
      guides: 'Guías',
      setupGuides: 'Guías de configuración',
      presets: 'Presets de juegos',
      faq: 'Preguntas frecuentes',
      changelog: 'Novedades',
      senchabotBot: 'Bot Senchabot',
      docs: 'Documentación',
      discussions: 'GitHub Discussions',
      reportBug: 'Reporta un error o pide un widget',
      notAffiliated: 'Sin relación oficial con Twitch ni Kick.',
    },
  },
  widgets: {
    overlays: 'Overlays',
    tools: 'Herramientas',
    chatBox: {
      name: 'Caja de Chat',
      tagline: 'El chat de Twitch y Kick juntos en un solo overlay, con emotes de 7TV, BTTV y FFZ.',
    },
    emoteWall: {
      name: 'Muro de Emotes',
      tagline: 'Los mensajes del chat que solo tienen emotes flotan por tu pantalla.',
    },
    subSprout: {
      name: 'Sub Sprout',
      tagline: 'Una planta en tu stream que crece un poco con cada nueva suscripción.',
    },
    goal: {
      name: 'Meta de Subs',
      tagline:
        'Una barra que se llena con cada sub y cada sub regalada, con un trofeo al llegar a la meta.',
    },
    frames: {
      name: 'Marcos de Stream',
      tagline:
        'Marcos listos para tu cámara, tu chat y tu pantalla de stream, dibujados según tu preset.',
    },
    countdown: {
      name: 'Cuenta Regresiva',
      tagline:
        'Una cuenta regresiva para tus escenas de inicio, pausa y cierre, por duración o por hora.',
    },
    subathon: {
      name: 'Subathon Timer',
      tagline:
        'Una cuenta regresiva a la que las subs, las subs regaladas, los Bits y los Kicks le suman tiempo. Barra de vida, reloj o anillo.',
    },
    poll: {
      name: 'Encuesta de Chat',
      tagline:
        'Una encuesta en la que tu chat vota escribiendo un número, con barras en vivo y un ganador.',
    },
    streamAlerts: {
      name: 'Alertas de Stream',
      tagline: 'Una alerta animada con sonido para cada sub, sub regalada, Bits, Kicks y raid.',
    },
    raffle: {
      name: 'Sorteo',
      tagline: 'Los espectadores entran con una palabra clave como !join, y tú sacas al ganador.',
    },
    obsBridge: {
      name: 'OBS Bridge',
      tagline: 'Cambia escenas de OBS y controla el stream y la grabación con comandos del chat.',
    },
    socials: {
      name: 'Redes Sociales',
      tagline: 'Muestra tus redes sociales una tras otra con una animación elegante.',
    },
  },
  home: {
    heroTitle: 'Overlays gratis para tu stream de Twitch y Kick',
    heroLead:
      'Configura un widget con vista previa en vivo y pega una sola URL en OBS. Sin cuenta, sin marca de agua y con el código abierto.',
    browseWidgets: 'Ver widgets',
    viewOnGithub: 'Ver en GitHub',
    trustLabel: 'Lo destacado',
    trustFree: 'Gratis',
    trustNoLogin: 'Sin login',
    trustOpenSource: 'Código abierto',
    trustPlatforms: 'Twitch + Kick',
    sceneLive: 'En directo',
    sceneCaption: 'Demo en vivo con un chat de ejemplo',
    demoTitle: 'Demo de {name}',
    worksWithTitle: 'Dónde funciona',
    worksWithApps: 'Programas de streaming',
    worksWithAppsText: 'OBS Studio y otros programas que admiten fuentes de navegador',
    galleryTitle: 'Elige un widget',
    galleryLead:
      'Cada uno tiene su propia página de configuración con vista previa en vivo. Nada que descargar.',
    overlaysLead: 'Fuentes de navegador que funcionan solas una vez que están en tu escena.',
    toolsLead: 'Herramientas que manejas tú durante el stream, desde una página o desde el chat.',
    setUp: 'Configurar',
    toolFeatures: 'Funciones',
    raffleFeatureKeyword: 'Palabra clave de entrada como !join',
    raffleFeatureSubs: 'Solo suscriptores, con meses mínimos',
    raffleFeatureDuration: 'Tiempo mínimo antes del sorteo',
    obsFeatureScenes: 'Cambia escenas desde el chat',
    obsFeatureCommands: 'Nombres de comandos a tu gusto',
    obsFeatureLocal: 'Conexión local con obs-websocket',
    subathonFeatureChat: 'Contrólalo desde el chat con !subathon',
    subathonFeaturePlatforms: 'Tiempos separados para Twitch y Kick',
    subathonFeatureSaved: 'El tiempo restante sobrevive a los reinicios de OBS',
    pollFeatureVote: 'Los espectadores votan escribiendo un número',
    pollFeatureBoth: 'Votos de Twitch y Kick en una sola encuesta',
    pollFeatureLate: 'Los votos de último segundo cuentan pese al retraso del stream',
    pollSpotlight: {
      eyebrow: 'Nuevo: Encuesta de Chat',
      title: 'Que decida tu chat',
      lead: 'Lanza una encuesta desde el chat con !poll y los espectadores de Twitch y Kick votan escribiendo un número. Las barras se llenan en directo y el ganador aparece cuando se acaba el tiempo.',
      pointVote:
        'Los espectadores escriben 2, !vote 2 o la opción misma. Cada espectador cuenta una vez.',
      pointBoth: 'Los votos de Twitch y Kick caen en la misma encuesta.',
      pointLate:
        'Los votos de los últimos segundos siguen contando, aunque los espectadores vean el stream con un poco de retraso.',
      pointMods: 'Tú y tus mods la manejan desde el chat. Sin bot y sin iniciar sesión.',
      setup: 'Configurar Encuesta de Chat',
      guide: 'Leer la guía',
      chat: 'Chat',
      caption: 'Demo en vivo con votantes simulados',
    },
    visualScenes: 'Escenas',
    howTitle: 'Cómo funciona',
    howLead: 'Tres pasos, y ninguno te pide una cuenta.',
    howStep1:
      'Elige un widget y ajusta su configuración. La vista previa en vivo muestra cada cambio al momento.',
    howStep2: 'Escribe el nombre de tu canal y copia la URL del widget.',
    howStep3:
      'En OBS Studio, añade una fuente de navegador, pega la URL y pon el tamaño recomendado.',
    sizesTitle: 'Tamaños recomendados para la fuente de navegador',
    sizesNote: 'Ancho × alto, en píxeles.',
    sizesWidget: 'Widget',
    sizesValue: 'Tamaño',
    trustTitle: 'Sin cuenta y sin trampa',
    noLoginTitle: 'Sin iniciar sesión',
    noLoginText:
      'Los widgets leen el chat público de tu canal como lo haría un espectador sin sesión iniciada. Nunca conectas tu cuenta de Twitch o Kick.',
    noWatermarkTitle: 'Sin marca de agua',
    noWatermarkText:
      'No se estampa nada en tus overlays. Lo que ves en la vista previa es lo que sale en el stream.',
    openSourceTitle: 'Código abierto',
    openSourceText:
      'Todo el código está en GitHub bajo la licencia GPL-3.0. Léelo, haz un fork o envía un arreglo.',
    urlSettingsTitle: 'Tu configuración vive en la URL',
    urlSettingsText:
      'La configuración del widget se guarda en la propia URL, así que no necesitas una cuenta para conservarla. Guarda la URL y siempre tendrás tu widget.',
    senchabotTitle: '¿También necesitas un bot de chat? Prueba Senchabot',
    senchabotText:
      'El equipo detrás de estos widgets también hace Senchabot: comandos de chat personalizados, temporizadores y shoutouts en Twitch, además de un aviso en tu servidor de Discord cuando empiezas el directo.',
    senchabotCta: 'Visita senchabot.com',
    communityTitle: 'Participa',
    communityLead: 'Es código abierto, y hay varias formas fáciles de ayudar.',
    starTitle: 'Dale una estrella en GitHub',
    starText: 'Las estrellas ayudan a que más streamers encuentren el proyecto.',
    starCount: '{count} estrellas',
    requestTitle: 'Pide un widget',
    requestText: '¿Te falta algo para tu stream? Abre un issue y cuéntanos qué necesitas.',
    discordTitle: 'Únete al Discord',
    discordText: 'Haz preguntas y comparte tu setup con otros streamers.',
    faqMore: '¿No encontraste tu respuesta?',
    faq1Q: '¿De verdad es gratis?',
    faq1A:
      'Sí. Todos los widgets y herramientas son gratis, sin plan de pago y sin marca de agua en tus overlays. El proyecto es de código abierto y lo hace el equipo de Senchabot.',
    faq2Q: '¿Qué significa exactamente "sin iniciar sesión"?',
    faq2A:
      'Nunca inicias sesión ni conectas tu cuenta de Twitch o Kick. Escribes el nombre de tu canal y el widget lee el chat público de ese canal de forma anónima, como un espectador sin sesión iniciada. Así que ve lo que cualquiera puede ver en el chat, y nada más.',
    faq3Q: '¿Con qué programas de streaming funciona?',
    faq3A:
      'Con OBS Studio y otros programas que admiten fuentes de navegador. Añade la URL del widget como fuente de navegador y usa el tamaño que aparece en la página de configuración.',
    faq4Q: '¿Puedo usar Twitch y Kick juntos?',
    faq4A:
      'Sí. Caja de Chat, Muro de Emotes, Sub Sprout, Subathon Timer, Alertas de Stream, Meta de Subs, Encuesta de Chat y Cuenta Regresiva aceptan un canal de Twitch y uno de Kick en la misma URL. OBS Bridge también puede escuchar los dos chats a la vez. Sorteo funciona en una sola plataforma a la vez.',
    faq5Q: '¿Cómo cambio un widget más adelante?',
    faq5A:
      'Abre su página de configuración, déjalo como quieras y reemplaza la URL en tu fuente de navegador. Caja de Chat, Muro de Emotes, Sub Sprout, Subathon Timer, Alertas de Stream, Meta de Subs, Encuesta de Chat, Marcos de Stream, Redes Sociales y Cuenta Regresiva también pueden abrir una URL existente: pégala en la página de configuración, tu configuración vuelve y cambias solo lo que necesites.',
    faq6Q: '¿La URL de mi widget seguirá funcionando después de las actualizaciones?',
    faq6A:
      'Sí. Las actualizaciones mantienen funcionando los ajustes y valores de las URL existentes, así que un widget que ya está en tu escena no necesita una URL nueva.',
  },
  chatWidget: {
    breadcrumb: 'Configurar Caja de Chat',
    title: 'Configurar Caja de Chat',
    intro:
      'Un widget multichat que junta el chat de Twitch y Kick en un solo overlay. Los emotes de 7TV funcionan en ambas plataformas, BTTV y FFZ en Twitch, y también se ven las insignias. Tú eliges el diseño, la fuente y la animación.',
    platformIndicator: 'Indicador de plataforma',
    platformName: 'Nombre de plataforma',
    platformIcon: 'Icono de plataforma',
    platformHidden: 'Ocultar plataforma',
    sectionMessages: 'Mensajes',
    platformsTip:
      'Elige de qué plataformas traer el chat. Marca ambas para juntar los mensajes de Twitch y Kick en un solo feed.',
    platformIndicatorTip:
      'Con las dos plataformas activas, muestra de dónde viene cada mensaje: el nombre de la plataforma, su icono o nada.',
    orientationTip:
      'Vertical apila los mensajes uno encima de otro, como una caja de chat clásica. Horizontal los pone uno al lado del otro, ideal para una franja en la parte de abajo de tu pantalla.',
    darkBackgroundTip:
      'Añade un fondo negro semitransparente detrás del widget. Facilita leer el texto en escenas claras.',
    emotesTip:
      'Los emotes de los proveedores que marques se ven como imágenes, el resto como texto. 7TV funciona en Twitch y Kick, BTTV y FFZ solo en Twitch.',
    messageDurationTip:
      'Los mensajes se desvanecen pasado este tiempo. Elige "Siempre" para dejarlos en pantalla, con los nuevos empujando a los viejos hacia arriba.',
    hideBotsTip:
      'Oculta los mensajes de bots comunes como Nightbot, StreamElements, Fossabot, BotRix y KickBot, además de las cuentas con la insignia "Bot de chat" de Twitch o "Bot" de Kick.',
    hideCommandsTip: 'Oculta los mensajes que empiezan con "!", como !discord o !uptime.',
    badgesTip:
      'Muestra las insignias de streamer, moderador, VIP y suscriptor junto a los nombres.',
    animationTip:
      'Define cómo entran los mensajes nuevos en pantalla. Las animaciones se acortan solas cuando el chat va más rápido.',
    usernameFont: 'Fuente del nombre',
    messageFont: 'Fuente del mensaje',
    fontSystem: 'Predeterminada del sistema',
    textShadow: 'Sombra del texto',
    textShadowTip:
      'Un borde oscuro detrás de nombres y mensajes. Fuerte contornea cada letra para que el chat se lea bien sobre juegos claros; Ninguna la quita, incluso la del preset.',
    shadowNone: 'Ninguna',
    shadowNormal: 'Normal',
    shadowStrong: 'Fuerte',
    messageLayout: 'Diseño del mensaje',
    layoutInline: 'En línea (usuario: mensaje)',
    layoutStacked: 'Apilado (usuario arriba)',
    layoutCard: 'Tarjeta / Burbuja',
    layoutCompact: 'Compacto (tipo Twitch)',
    newMessageAnimation: 'Animación de mensaje nuevo',
    animSlide: 'Deslizar desde la derecha + fundido',
    animSmoothSlide: 'Deslizado suave desde la derecha',
    animPop: 'Pop / escalado',
    animBounce: 'Rebote',
    animStagger: 'Escalonado (primero datos, luego mensaje)',
    animFade: 'Fundido',
    animTyping: 'Máquina de escribir',
    animNone: 'Sin animación',
    orientation: 'Orientación',
    vertical: 'Vertical',
    horizontal: 'Horizontal',
    fontSize: 'Tamaño de fuente (px)',
    darkBackground: 'Fondo oscuro',
    emotes: 'Emotes',
    emotesNone: 'Desactivado',
    messageDuration: 'Duración del mensaje',
    durationSeconds: '{count} s',
    durationMinutes: '{count} min',
    durationKeep: 'Siempre',
    hideBots: 'Ocultar bots',
    hideCommands: 'Ocultar comandos',
    showBadges: 'Mostrar insignias',
    showMessageTime: 'Mostrar hora del mensaje',
    backgroundOpacity: 'Opacidad del fondo',
    messageBackgroundBox: 'Fondo por mensaje',
    messageBackgroundHint: 'Cada mensaje tiene su propio recuadro de fondo con borde.',
    platformAccent: 'Franja de color de plataforma',
    platformAccentHint:
      'Una franja morada de Twitch o verde de Kick a la izquierda indica de dónde vino cada mensaje.',
    boldUsernames: 'Nombres en negrita',
    boldMessages: 'Mensajes en negrita',
    highlights: 'Resaltados',
    highlightsTip:
      'Elige qué mensajes llevan una barra fina de color en el stream. Las respuestas muestran a quién contestan, y las marcadas con Twitch solo existen en Twitch.',
    highlightMention: 'Menciones',
    highlightReply: 'Contexto de respuesta',
    highlightFirstMessage: 'Primeros mensajes',
    highlightAnnouncement: 'Anuncios',
    highlightHighlighted: 'Destacar mi mensaje',
    highlightsAll: 'Todos',
    highlightsNone: 'Desactivado',
    announcement: 'Anuncio',
    firstMessage: 'Primer mensaje',
    previewTitle: 'Vista previa del widget (Caja de Chat)',
    previewIframeTitle: 'Vista previa del widget de chat',
    previewSpeed: 'Velocidad del chat de prueba',
    previewSpeedValue: '{rate} msj/s',
    previewSpeedHint: 'Solo cambia la vista previa. La URL de tu widget no cambia.',
    previewHint: 'Vista previa del chat en vivo con mensajes animados.',
    guideTitle:
      'Configurar la Caja de Chat en tu programa de streaming (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Añade una fuente de navegador en tu programa de streaming (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Pega la URL del widget multichat que copiaste.',
    guideStep3:
      'Ajusta el ancho y el alto al tamaño que quieras para tu overlay de chat (p. ej. 400×600 en vertical).',
    browserSourceHintSize: ' (tamaño recomendado: 400×600 para la caja de chat).',
    widgetUrlTip:
      '¿Ya hiciste un widget? Pega su URL aquí para cargar tu configuración y cambiar lo que necesites.',
    widgetUrlPlaceholder: 'Pega la URL de un widget existente para editarlo',
    widgetUrlInvalid: 'Esta no es una URL de widget de Caja de Chat.',
    openReader: 'Abrir Lector de Chat',
    openReaderHint:
      'Lee tu propio chat en una pestaña del navegador o en un panel de OBS. Se reconecta solo, marca cada corte y conserva tu historial al recargar.',
    faq1Q: '¿Necesito iniciar sesión en Twitch o Kick para usar la caja de chat?',
    faq1A:
      'No hace falta iniciar sesión. Caja de Chat escucha de forma anónima el chat público de ambas plataformas.',
    faq2Q: '¿Este widget multichat funciona con emotes de 7TV?',
    faq2A:
      'Sí. Los emotes de canal y globales de 7TV aparecen en los mensajes de Twitch y de Kick, y los emotes de BTTV y FFZ solo en los mensajes de Twitch. Los tres vienen activados, y puedes desactivar cualquiera en el menú Emotes.',
  },
  chatReader: {
    title: 'Lector de Chat',
    listLabel: 'Mensajes del chat',
    noChannel:
      'Este enlace no tiene canal. Abre el Lector de Chat desde la página de configuración de Caja de Chat.',
    empty: 'Esperando mensajes en {channels}…',
    statusConnecting: 'Conectando',
    statusConnected: 'Conectado',
    statusReconnecting: 'Reconectando',
    notFound: 'Canal no encontrado',
    networkOffline: 'Estás sin conexión. El chat se reconecta solo en cuanto vuelva internet.',
    retryIn: 'Se perdió la conexión con el chat de {platform}. Reintentando en {seconds} s.',
    retrying: 'Se perdió la conexión con el chat de {platform}. Reintentando ahora…',
    retryNow: 'Reintentar ahora',
    fontSmaller: 'Texto más pequeño',
    fontLarger: 'Texto más grande',
    timestamps: 'Mostrar hora de los mensajes',
    clear: 'Borrar historial',
    clearConfirm: 'Haz clic otra vez para borrar',
    deleted: '(borrado)',
    backToLive: 'Volver al chat en vivo',
    newMessage: '{count} mensaje nuevo',
    newMessages: '{count} mensajes nuevos',
    eventConnected: 'Conectado al chat de {platform}: {channel}',
    eventDisconnected: 'Se perdió la conexión con el chat de {platform}',
    eventReconnected: 'De vuelta en el chat de {platform} tras {duration}',
    eventNetworkLost: 'Se perdió la conexión a internet',
    eventNetworkBack: 'Volvió la conexión a internet',
    eventChatCleared: 'Un moderador borró el chat de {platform}',
    eventResumed: 'Guardado de tu última visita, hasta las {time}',
    durationSeconds: '{seconds} s',
    durationMinutes: '{minutes} min {seconds} s',
    durationHours: '{hours} h {minutes} min',
  },
  obsBridge: {
    breadcrumb: 'Configurar OBS Bridge',
    title: 'Configurar OBS Bridge',
    intro:
      'Deja que la gente de confianza cambie escenas de OBS e inicie o detenga tu stream y tu grabación desde el chat de Twitch o Kick. El puente funciona en una pestaña del navegador o en un panel de OBS y habla directamente con OBS.',
    sectionChannels: 'Canales',
    sectionUsers: 'Usuarios autorizados',
    usersLabel: 'Nombres de usuario del chat',
    usersTip:
      'Solo las personas de esta lista pueden usar comandos. Con la lista vacía nadie puede, ni siquiera tú. En Twitch el nombre se compara con el login, el nombre que aparece en la URL del canal.',
    usersEmpty: 'Todavía nadie, así que nadie puede usar comandos.',
    userPlatform: 'Plataforma',
    addUser: 'Añadir',
    userPlaceholder: 'usuario',
    removeUser: 'Quitar a {name}',
    assignUser: 'Hacer a {name} usuario de {platform}',
    pickPlatformWarning:
      'Twitch y Kick están conectados, así que elige una plataforma para cada nombre en amarillo. No podrán usar comandos hasta que lo hagas.',
    sectionCommands: 'Comandos',
    commandsHint:
      'El mensaje entero tiene que coincidir con el comando, da igual si usas mayúsculas. Deja un campo vacío para usar el predeterminado.',
    label: {
      cmdScene: 'Cambiar escena',
      cmdBrb: 'Escena BRB',
      cmdBack: 'Volver a principal',
      cmdStartStream: 'Iniciar stream',
      cmdStopStream: 'Detener stream',
      cmdStartRecord: 'Iniciar grabación',
      cmdStopRecord: 'Detener grabación',
    },
    action: {
      cmdScene: 'Cambia a la escena que nombres, como {example}',
      cmdBrb: 'Cambia a tu escena BRB',
      cmdBack: 'Vuelve a tu escena principal',
      cmdStartStream: 'Inicia el stream',
      cmdStopStream: 'Termina el stream',
      cmdStartRecord: 'Inicia la grabación',
      cmdStopRecord: 'Detiene la grabación',
    },
    sceneArg: '<nombre>',
    sceneTip:
      'Escribe el comando, un espacio y el nombre de una escena, como !scene Gaming. Gana la escena con ese nombre exacto; si no hay, la primera cuyo nombre lo contenga.',
    brbTip:
      'Cambia a la escena BRB que elijas en la página de la herramienta. No lleva ! por defecto, así que cualquiera de la lista que escriba solo brb cambia la escena.',
    backTip:
      'Vuelve a la escena principal que elijas en la página de la herramienta. Igual que brb, no lleva ! por defecto.',
    sectionConnection: 'Conexión con OBS',
    wsUrl: 'URL de WebSocket',
    wsUrlTip:
      'Solo hace falta si OBS corre en otro equipo o cambiaste el puerto. Déjalo vacío para usar ws://127.0.0.1:4455.',
    wsUrlPlaceholder: 'ws://127.0.0.1:4455 (predeterminado)',
    wsPassword: 'Contraseña de WebSocket',
    wsPasswordTip:
      'La encuentras en OBS en Herramientas → Ajustes del servidor WebSocket → Mostrar información de conexión. Se guarda en la URL de la herramienta, así que trata ese enlace como una contraseña.',
    wsPasswordPlaceholder: 'Déjalo vacío si no hay',
    previewTitle: 'Vista previa de la herramienta',
    previewIframeTitle: 'Vista previa de OBS Bridge',
    summaryNotListening:
      'No hay un canal de {platform} configurado, así que {names} todavía no pueden usar comandos.',
    summaryNoChannel: 'Todavía no hay canal. Añade primero un canal de Twitch o Kick.',
    openTool: 'Abrir la herramienta',
    openToolHint: 'Abre el puente en una pestaña nueva. Se conecta a OBS y a tu chat al instante.',
    toolUrlTip:
      'Contiene tu contraseña de OBS, así que trátala como tal: no la compartas ni la muestres en el stream.',
    toolUrlHint:
      'Ábrela en una pestaña del navegador o en un panel de navegador personalizado de OBS y déjala abierta mientras haces stream.',
    nextOpen:
      'Ábrela en una pestaña del navegador o pégala en un panel de navegador personalizado de OBS.',
    nextKeepOpen:
      'Elige ahí tus escenas principal y BRB y deja la página abierta mientras haces stream.',
    guideStep1:
      'En OBS, abre Herramientas → Ajustes del servidor WebSocket, activa el servidor WebSocket y copia la contraseña desde Mostrar información de conexión.',
    guideStep2:
      'Escribe tu canal, las personas que pueden usar comandos y la contraseña, y copia la URL de la herramienta.',
    guideStep3:
      'Abre la URL en una pestaña del navegador o en un panel de navegador personalizado de OBS y elige tus escenas principal y BRB.',
    guideStep4:
      '¿Usas un panel? Después de elegir las escenas, pulsa Copiar URL actualizada y pégala en el panel, porque un panel siempre abre la URL con la que se creó.',
    faq1Q: '¿Cómo funciona el comando de chat !scene?',
    faq1A:
      'Alguien de tu lista escribe el comando, un espacio y el nombre de una escena, como !scene Gaming. OBS Bridge busca primero una escena con ese nombre exacto, sin importar mayúsculas, luego la primera escena cuyo nombre lo contenga, y cambia a ella.',
    faq2Q: '¿Está segura mi contraseña de OBS WebSocket?',
    faq2A:
      'La conexión con OBS va directa de tu navegador a OBS. Pero la contraseña se guarda en la URL de la herramienta, y al abrir esa URL la página se carga desde extensions.senchabot.com con la contraseña dentro. Así que trata el enlace como una contraseña: no lo compartas ni lo muestres en el stream.',
    faq3Q: '¿Por qué desaparecieron las escenas que elegí en el panel de OBS?',
    faq3A:
      'Las escenas elegidas y los cambios de usuarios se guardan en la URL de la página de la herramienta. Una pestaña del navegador los conserva si guardas la página en marcadores, pero un panel de OBS siempre abre la URL con la que se creó. Pulsa Copiar URL actualizada en la página de la herramienta y pega la URL nueva en el panel.',
    tool: {
      title: 'OBS Bridge',
      connectionsTitle: 'Conexiones',
      status: {
        connecting: 'Conectando',
        connected: 'Conectado',
        failed: 'No se pudo conectar',
        disconnected: 'Desconectado',
      },
      obsConnecting: 'Conectando a {url}…',
      obsConnected: '{url} · conectado desde las {time}',
      obsUnreachable:
        'No hay respuesta de {url}. ¿Está OBS abierto y el servidor activado en Herramientas → Ajustes del servidor WebSocket?',
      obsWrongPassword:
        'OBS no aceptó la contraseña. La contraseña de la URL tiene que coincidir con tu contraseña de OBS WebSocket.',
      obsNeedsPassword:
        'OBS pide una contraseña, pero esta URL no tiene. Escribe tu contraseña de WebSocket en la página de configuración y usa la URL nueva.',
      obsRefused: 'OBS rechazó la conexión: {reason}',
      obsClosed:
        'Se perdió la conexión con OBS. Puede que OBS se haya cerrado o que su servidor WebSocket se haya detenido.',
      retryIn: 'Intento {attempt} en {seconds} s',
      retrying: 'Reintentando…',
      retryNow: 'Probar ahora',
      chat: {
        connecting: 'Conectando',
        connected: 'Escuchando',
        reconnecting: 'Desconectado',
      },
      chatRetryIn: 'Reconectando en {seconds} s',
      chatNotFound: 'No encontrado',
      kickNotFound:
        'No se encontró ningún canal de Kick llamado "{channel}". Revisa el nombre del canal.',
      activityTitle: 'Comandos recientes',
      activityEmpty:
        'Todavía no hay comandos. Aparecerán aquí en cuanto un usuario autorizado escriba uno en el chat.',
      activityScene: 'Cambió a {scene}',
      activityStartStream: 'Stream iniciado',
      activityStopStream: 'Stream detenido',
      activityStartRecord: 'Grabación iniciada',
      activityStopRecord: 'Grabación detenida',
      activityNoScene: 'Ninguna escena coincide con "{query}"',
      activityOffline: 'No se ejecutó porque OBS no estaba conectado',
      activityFailed: 'OBS devolvió un error: {message}',
      scenesTitle: 'Escenas',
      scenes: 'Escenas ({count})',
      fetchingScenes: 'Cargando la lista de escenas…',
      scenesOffline: 'La lista de escenas aparece cuando OBS está conectado.',
      mainScene: 'Escena principal',
      brbScene: 'Escena BRB',
      notSelected: 'Sin elegir',
      main: 'Principal',
      brb: 'BRB',
      setMain: 'Usar {scene} como escena principal',
      setBrb: 'Usar {scene} como escena BRB',
      assignMainBrbWarning:
        'Elige abajo una escena principal y una BRB; si no, {brb} y {back} no tienen adónde ir.',
      assignMainWarning: 'Elige abajo una escena principal; si no, {back} no tiene adónde ir.',
      assignBrbWarning: 'Elige abajo una escena BRB; si no, {brb} no tiene adónde ir.',
      sceneHint:
        'Pulsa Principal o BRB junto a una escena para asignarla. Cualquier otra escena funciona con {command}.',
      usersCount: 'Usuarios autorizados ({count})',
      copyUrl: 'Copiar URL actualizada',
      copyUrlHint:
        'Las escenas elegidas y los cambios de usuarios se guardan en la URL de esta página. Un panel de OBS sigue abriendo la URL con la que se creó, así que pega la copiada en los ajustes del panel.',
      copyUrlManual: 'No se pudo copiar. Selecciona la URL de abajo y cópiala tú.',
      commands: 'Comandos del chat',
      footer: 'Deja esta página abierta mientras haces stream. El puente se detiene al cerrarla.',
    },
  },
  subSprout: {
    breadcrumb: 'Configurar Sub Sprout',
    title: 'Configurar Sub Sprout',
    intro:
      'Un overlay de planta personalizable para tu meta de suscriptores que sube de nivel con cada nueva suscripción en Twitch o Kick.',
    sectionPlant: 'Planta',
    plantVariety: 'Tipo de planta',
    plantVarietyTip:
      'Cada sub hace crecer la planta una etapa. Cuantas más etapas tenga, más subs necesita para crecer del todo.',
    stagesSuffix: '{stages} etapas',
    selectionMode: 'Cambio de planta',
    selectionModeTip:
      'Después de la última etapa la planta vuelve a empezar: la misma planta, la siguiente de la lista u otra al azar. En orden y Al azar nunca eligen la Enredadera.',
    fixed: 'Misma planta',
    cycle: 'En orden',
    random: 'Al azar',
    wateringEffect: 'Efecto de riego',
    wateringEffectTip:
      'Reproduce una animación corta de lluvia o destellos cada vez que la planta crece. La Enredadera no la muestra.',
    showSubCountEffect: 'Mostrar número de subs',
    subCountTip: 'Muestra cuántas subs llegaron a la vez, como x5 para un regalo de 5.',
    showPotLabel: 'Mostrar etapa en la maceta',
    potLabelTip: 'Escribe la etapa en la maceta, como 3/10. La Enredadera no la muestra.',
    previewTitle: 'Vista previa de la planta de meta de subs',
    previewIframeTitle: 'Vista previa de Sub Sprout',
    previewSpeed: 'Velocidad de crecimiento de prueba',
    previewSpeedValue: '{rate}×',
    previewHint:
      'La vista previa crece con subs simuladas. En el stream, tu planta crece con las subs, resubs y subs regaladas reales de tu canal.',
    widgetUrlTip:
      '¿Ya hiciste un widget? Pega su URL aquí para cargar tu configuración y cambiar lo que necesites.',
    widgetUrlPlaceholder: 'Pega la URL de un widget existente para editarlo',
    widgetUrlInvalid: 'Esta no es una URL de widget de Sub Sprout.',
    browserSourceHintSize: ' (tamaño recomendado: 800×600).',
    guideTitle: 'Configuración en tu programa de streaming (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Añade una fuente de navegador en tu programa de streaming (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Pega la URL de la planta de meta de subs que copiaste.',
    guideStep3: 'Pon el ancho en 800 y el alto en 600.',
    guideStep4:
      'El streamer y los mods pueden escribir !grow en el chat para hacerla crecer a mano, o !grow reset para que la planta vuelva a empezar.',
    faq1Q: '¿Necesito iniciar sesión para usar la planta de meta de subs?',
    faq1A:
      'No hace falta registrarse ni iniciar sesión con OAuth. Sub Sprout se conecta de forma anónima escuchando los eventos del chat público.',
    faq2Q: '¿Qué pasa cuando la planta de meta de subs termina de crecer?',
    faq2A:
      'Cuando la planta está completamente crecida, la siguiente sub la hace empezar de nuevo según tu ajuste de Cambio de planta: la misma planta, la siguiente variedad o una al azar.',
    faq3Q: '¿La planta vuelve a empezar cuando se recarga la fuente de navegador?',
    faq3A:
      'No. La planta se guarda dentro de OBS, así que conserva la etapa a la que llegó tras una recarga, un cambio de escena y el siguiente stream. Para que vuelva a empezar, pide a un mod que escriba !grow reset en el chat.',
  },
  subathon: {
    breadcrumb: 'Configurar Subathon Timer',
    title: 'Configurar Subathon Timer',
    intro:
      'Un subathon timer para Twitch y Kick. Cuenta hacia atrás, y cada sub, sub regalada, cheer de Bits o regalo de Kicks le suma tiempo. Muéstralo como una barra de vida de videojuego que se vacía hasta cero, un reloj grande o un anillo, y tú decides cuánto tiempo suma cada cosa.',
    style: 'Estilo',
    styleTip:
      'Barra de vida se vacía desde el 100% hasta cero como un personaje de videojuego. Barra fina mete el título y el tiempo dentro de una barra más delgada. Reloj muestra números grandes. Anillo muestra un círculo que se vacía.',
    styleBar: 'Barra de vida',
    styleThin: 'Barra fina',
    styleClock: 'Reloj',
    styleRing: 'Anillo',
    color: 'Color',
    colorTip:
      'Vida pasa de verde a ámbar y a rojo a medida que se acaba el tiempo. Los demás mantienen un solo color.',
    colors: {
      hp: 'Vida (de verde a rojo)',
      green: 'Verde',
      purple: 'Morado',
      red: 'Rojo',
      gold: 'Dorado',
      cyan: 'Cian',
      pink: 'Rosa',
    },
    titleLabel: 'Título',
    titleTip: 'Se muestra junto al timer. Déjalo vacío para no mostrar título.',
    titlePlaceholder: 'Sin título',
    showPercent: 'Mostrar porcentaje',
    showPercentTip:
      'Muestra qué tan lleno está el timer. El 100% es el máximo de tiempo que ha tenido hasta ahora, así que nunca se pasa.',
    showPops: 'Mostrar tiempo sumado',
    showPopsTip: 'Hace subir un +1:00 con el nombre del espectador cada vez que se suma tiempo.',
    sectionTimer: 'Timer',
    startTime: 'Tiempo inicial',
    startTimeTip:
      'Dónde empieza el timer. Solo se aplica a un subathon nuevo: para empezar de nuevo con otro valor, escribe !subathon reset en el chat.',
    maxTime: 'Límite de tiempo',
    maxTimeTip: 'El timer nunca tiene más que esto. El tiempo que lo superaría no se suma.',
    maxTimeOff: 'Sin límite',
    startMode: 'Inicio',
    startModeTip:
      'Con el comando, el timer espera en pausa hasta que tú o un mod lo escriban en el chat. De inmediato lo arranca en cuanto el overlay carga en OBS.',
    startCommand: 'Con {command}',
    startAuto: 'De inmediato',
    sectionValues: 'Tiempo sumado',
    valuesHint: 'Pon cualquiera de estos en 0 para desactivarlo.',
    dynamicRates: 'Ajustar valores según el tiempo',
    dynamicRatesTip:
      'Usa un segundo conjunto de valores cuando al reloj le quede suficiente tiempo.',
    shiftAt: 'Umbral',
    shiftAtTip:
      'Mientras el tiempo restante esté en este valor o por encima, se usa el segundo conjunto de valores.',
    tier2Rates: 'Por encima del umbral',
    perSub: 'Por sub',
    perSubTip: 'Cada sub nueva y cada resub. En Twitch es una sub de Nivel 1 o Prime.',
    perSubKickTip: 'Cada sub nueva y cada resub.',
    perGift: 'Por sub regalada',
    perGiftTip: 'Se cuenta por cada sub de un regalo, así que un regalo de 5 lo suma cinco veces.',
    perBits: 'Por 500 Bits',
    perBitsTip:
      'Más o menos el precio de una sub. Otras cantidades suman su parte, así que 100 Bits suman una quinta parte.',
    perKicks: 'Por 500 Kicks',
    perKicksTip: 'Otras cantidades suman su parte, así que 100 Kicks suman una quinta parte.',
    showRates: 'Mostrar en el timer',
    showRatesTip:
      'Muestra lo que suman una sub, una sub regalada y 500 Bits o Kicks, para que los espectadores sepan cuánto vale su sub. Los valores en 0 no aparecen. Cuando Twitch y Kick tienen valores distintos, se van turnando.',
    ratesLanguage: 'Idioma del timer',
    ratesLanguageTip:
      'El idioma de las palabras de la lista, como "Sub regalada" y "min". La URL de OBS lo conserva, esté OBS en el idioma que esté.',
    rateSub: 'Sub',
    rateGift: 'Sub regalada',
    rateBits: '{amount} Bits',
    rateKicks: '{amount} Kicks',
    rateBitsKicks: '{amount} Bits/Kicks',
    tiers: 'Nivel 2 y 3 cuentan más',
    tiersTip:
      'En Twitch una sub de Nivel 2 suma el tiempo de 2 subs y una de Nivel 3 el de 5, según su precio.',
    unitHours: 'h',
    unitMinutes: 'min',
    sectionCommands: 'Comandos del chat',
    commandsIntro: 'Tú y tus mods controlan el timer desde el chat de Twitch o Kick.',
    cmdStart: 'Inicia o reanuda el timer',
    cmdPause: 'Lo pausa',
    cmdAdd: 'Suma tiempo',
    cmdRemove: 'Quita tiempo',
    cmdSet: 'Fija el tiempo restante',
    cmdReset: 'Vuelve a empezar desde el tiempo inicial',
    commandsDurations:
      'Escribe los tiempos como 10m, 1h30m, 45s o 1:30:00. Un número solo son minutos.',
    previewTitle: 'Vista previa del Subathon Timer',
    previewIframeTitle: 'Vista previa del Subathon Timer',
    previewHint:
      'La vista previa reproduce subs, regalos y cheers simulados. En el stream el timer corre en tiempo real y solo tu chat suma tiempo.',
    previewSpeed: 'Velocidad de la vista previa',
    previewSpeedTip:
      '1× es tiempo real. A 60× un timer de una hora se acaba en más o menos un minuto.',
    previewSpeedValue: '{rate}×',
    testTitle: 'Pruébalo:',
    testViewer: 'Tú',
    testSub: '+1 sub',
    testGift: '+5 regaladas',
    testBits: '+500 Bits/Kicks',
    testRemove: '−10 min',
    testPause: 'Pausar / Reanudar',
    testReset: 'Reiniciar',
    widgetUrlTip:
      '¿Ya hiciste un widget? Pega su URL aquí para cargar tu configuración y cambiar lo que necesites.',
    widgetUrlPlaceholder: 'Pega la URL de un widget existente para editarlo',
    widgetUrlInvalid: 'Esta no es una URL de Subathon Timer.',
    browserSourceHintSize: ' (tamaño recomendado: 800×300).',
    guideTitle: 'Configuración en tu programa de streaming (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Añade una fuente de navegador en tu programa de streaming (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Pega la URL del subathon timer que copiaste.',
    guideStep3: 'Pon el ancho en 800 y el alto en 300.',
    guideStep4:
      'Cuando empieces el directo, escribe !subathon start en el chat. Los mods también pueden sumar, quitar o pausar tiempo.',
    faq1Q: '¿Qué pasa si OBS se cierra o la fuente de navegador se recarga?',
    faq1A:
      'El timer se guarda dentro de OBS, así que vuelve donde estaba. Mientras OBS está cerrado sigue contando hacia atrás, como una fecha límite real. Las subs que llegan con OBS cerrado no se pueden ver, así que un mod puede sumarlas con !subathon add.',
    faq2Q: '¿Qué pasa cuando el timer llega a cero?',
    faq2A:
      'El timer se detiene en cero y la barra de vida muestra K.O. Las subs nuevas ya no suman tiempo. Un mod puede revivirlo con !subathon add o !subathon set, o empezar uno nuevo con !subathon reset.',
    faq3Q: '¿Cómo empiezo un subathon nuevo o cambio el tiempo inicial?',
    faq3A:
      'Escribe !subathon reset en el chat. El timer vuelve al tiempo inicial de su URL. Hasta que el timer arranque por primera vez, un tiempo inicial nuevo en la URL se aplica solo.',
    faq4Q: '¿Necesito iniciar sesión o conectar mi cuenta?',
    faq4A:
      'No. El timer lee las subs, los regalos, los Bits, los Kicks y los comandos de los mods desde tu chat público de Twitch y Kick, como los ve un espectador sin sesión iniciada.',
  },
  goal: {
    breadcrumb: 'Configurar Meta de Subs',
    title: 'Configurar Meta de Subs',
    intro:
      'Una barra de meta de subs para Twitch y Kick. Cada sub nueva, resub y sub regalada de los dos chats la llena de a uno, y un trofeo cae sobre la barra cuando llegas a la meta. Elige dónde empieza el conteo y dónde está la meta, y tus mods pueden corregir el conteo desde el chat.',
    sectionGoal: 'Meta',
    start: 'Conteo inicial',
    startTip:
      'Dónde empieza el conteo: el número de subs de tu panel de control, o 0 para contar solo este stream. Si lo cambias después, el conteo vuelve a empezar desde el número nuevo.',
    target: 'Meta',
    targetTip: 'La barra se llena en este número. El conteo sigue subiendo después.',
    countsHint:
      'Cada sub y resub suma 1, sea Prime o de cualquier nivel. Un regalo suma 1 por cada sub que incluye.',
    style: 'Estilo',
    styleTip:
      'Barra pone el título de la meta y el conteo encima de la barra. Barra fina mete el título y el conteo directamente dentro de una barra más delgada.',
    styleBar: 'Barra',
    styleThin: 'Barra fina',
    color: 'Color',
    titleLabel: 'Título',
    titleTip: 'Se muestra encima de la barra. Déjalo vacío para no mostrar título.',
    titlePlaceholder: 'Sin título',
    showPops: 'Mostrar subs nuevas',
    showPopsTip:
      'Hace subir un +1 con el nombre del espectador por cada sub, o +5 por un regalo de 5.',
    sectionCommands: 'Comandos del chat',
    commandsIntro:
      'Tú y tus mods pueden corregir el conteo desde el chat de Twitch o Kick, por ejemplo para sumar subs que llegaron con OBS cerrado.',
    cmdAdd: 'Suma subs al conteo, 1 si no pones el número',
    cmdRemove: 'Quita subs del conteo, 1 si no pones el número',
    cmdSet: 'Fija el conteo',
    cmdReset: 'Vuelve al conteo inicial',
    previewTitle: 'Vista previa de Meta de Subs',
    previewIframeTitle: 'Vista previa de Meta de Subs',
    previewHint:
      'La vista previa reproduce subs y regalos simulados hasta llegar a la meta y luego vuelve a empezar. En el stream solo tu chat suma al conteo.',
    testTitle: 'Pruébalo:',
    testViewer: 'Tú',
    testSub: '+1 sub',
    testGift: '+5 regaladas',
    testReach: 'Llegar a la meta',
    testReset: 'Reiniciar',
    widgetUrlTip:
      '¿Ya hiciste un widget? Pega su URL aquí para cargar tu configuración y cambiar lo que necesites.',
    widgetUrlPlaceholder: 'Pega la URL de un widget existente para editarlo',
    widgetUrlInvalid: 'Esta no es una URL de Meta de Subs.',
    browserSourceHintSize: ' (tamaño recomendado: 800×260).',
    guideTitle: 'Configuración en tu programa de streaming (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Añade una fuente de navegador en tu programa de streaming (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Pega la URL de la meta de subs que copiaste.',
    guideStep3: 'Pon el ancho en 800 y el alto en 260.',
    guideStep4:
      'Si alguna vez el conteo no cuadra, tú o un mod pueden corregirlo con !goal set en el chat.',
    faq1Q: '¿Por qué no lee mi número de subs de Twitch o Kick?',
    faq1A:
      'Ninguna de las dos plataformas muestra el número de subs de un canal a una página sin sesión iniciada, y esta meta nunca te pide iniciar sesión. Así que escribes tu conteo inicial una vez, y a partir de ahí cada sub y cada regalo que llega se suma.',
    faq2Q: '¿Qué pasa si OBS se cierra o la fuente de navegador se recarga?',
    faq2A:
      'El conteo se guarda dentro de OBS, así que vuelve donde estaba, también en tu próximo stream. Las subs que llegan con OBS cerrado no se pueden ver, así que un mod puede sumarlas con !goal add.',
    faq3Q: '¿Cuentan las resubs y las subs regaladas?',
    faq3A:
      'Sí. Cada sub nueva y resub suma 1, y un regalo suma 1 por cada sub que incluye, así que un regalo de 5 suma 5. En Twitch una resub cuenta cuando el espectador la comparte en el chat, y en Kick cuando se renueva.',
    faq4Q: '¿Puedo hacer una meta de seguidores?',
    faq4A:
      'Todavía no. Twitch y Kick no muestran los follows nuevos a una página sin sesión iniciada, así que la meta cuenta subs, igual en las dos plataformas.',
  },
  frames: {
    breadcrumb: 'Configurar Marcos de Stream',
    title: 'Configurar Marcos de Stream',
    intro:
      'Marcos listos para tu cámara, tu chat o toda tu pantalla de stream. El preset que elijas dibuja el marco con el estilo de ese juego, hasta en la forma, los adornos y el movimiento: un tejado de pagoda, borlas que se balancean y pétalos que caen en Dynasty, bloques de césped y antorchas que parpadean en Blocks. No hay canal que conectar. Añade la URL a OBS y pon tu cámara o tu chat debajo del marco.',
    sectionPiece: 'Marco',
    piece: '¿Qué vas a enmarcar?',
    pieceTip:
      'Cada pieza es su propia fuente de navegador. Añade las tres con el mismo preset y todo en pantalla combina.',
    pieces: {
      camera: 'Cámara',
      chat: 'Chat',
      screen: 'Pantalla',
    },
    pieceHints: {
      camera: 'Un marco 16:9 para tu webcam. Encaja tu cámara en la abertura del centro.',
      cameraPortrait:
        'Un marco 9:16 para la cámara de un móvil o una webcam girada. Encaja tu cámara en la abertura del centro.',
      chat: 'Un marco alto con cabecera para la Caja de Chat. Pon la Caja de Chat debajo de la cabecera.',
      screen:
        'Un marco fino por los bordes de todo tu stream. Los adornos se quedan en las esquinas para no tapar tu juego.',
    },
    orientation: 'Orientación',
    orientations: {
      landscape: 'Horizontal',
      portrait: 'Vertical',
    },
    labelLabel: 'Etiqueta',
    labelTips: {
      camera:
        'Aparece en la pestaña encima de tu cámara, por ejemplo el nombre de tu canal. Si la dejas vacía, la pestaña se queda solo con su adorno.',
      chat: 'Aparece en la pestaña encima del marco del chat. Si la dejas vacía, la pestaña se queda solo con su adorno.',
      screen:
        'Aparece en la placa de abajo en el centro de la pantalla. Déjala vacía para ocultar la placa.',
    },
    labelPlaceholder: 'Sin etiqueta',
    color: 'Color',
    motion: 'Animaciones',
    motionTip:
      'Líneas que brillan, barridos de luz y pequeños detalles que dependen del preset, como farolillos, antorchas o chispas. Desactívalo y el marco se queda quieto.',
    previewTitle: 'Vista previa del marco',
    previewIframeTitle: 'Vista previa del marco',
    previewHint:
      'La silueta y las líneas de chat de la vista previa son solo de relleno. En el stream el centro del marco es transparente, así que tu cámara o tu chat se ven desde abajo.',
    widgetUrlTip:
      '¿Ya hiciste un marco? Pega su URL aquí para cargar tu configuración y cambiar lo que necesites.',
    widgetUrlPlaceholder: 'Pega la URL de un marco existente para editarlo',
    widgetUrlInvalid: 'Esta no es una URL de Marcos de Stream.',
    browserSourceHintSize: ' (tamaño recomendado: {width}×{height}).',
    guideTitle: 'Configuración en tu programa de streaming (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Añade una fuente de navegador en tu programa de streaming (OBS Studio, Streamlabs Desktop, XSplit, vMix, etc.) y pega la URL del marco.',
    guideStep2:
      'Pon el ancho y el alto en el tamaño recomendado. Para una cámara cuadrada, escribe tu propio tamaño. El marco se adapta a cualquier tamaño.',
    guideStep3:
      'En la lista de Fuentes, sube el marco por encima de tu cámara o de la Caja de Chat y luego colócalo sobre ellas en la escena.',
    guideStep4:
      'Haz tu cámara lo bastante grande para llenar la abertura, pero sin que pase del borde exterior del marco. En un marco de 640 × 360 encaja justo 590 × 296, y en un marco vertical de 360 × 640, 306 × 572.',
    faq1Q: '¿El marco muestra mi cámara o mi chat por sí solo?',
    faq1A:
      'No. El centro del marco es transparente, es solo decoración. Añades tu cámara y la Caja de Chat a OBS como fuentes aparte y las pones debajo del marco.',
    faq2Q: '¿Necesito conectar mi cuenta de Twitch o Kick?',
    faq2A:
      'No. El marco no lee el chat y no necesita un nombre de canal. Funciona igual si haces stream en Twitch, Kick o en cualquier otro sitio.',
    faq3Q: '¿Puedo usar el marco de cámara con otro tamaño?',
    faq3A:
      'Sí. Para una cámara vertical, pon Orientación en Vertical y el tamaño recomendado pasa a 360 × 640. El marco se dibuja para ajustarse a su fuente de navegador, así que para una cámara cuadrada solo tienes que poner el ancho y el alto que quieras, y los adornos se escalan con él.',
    faq4Q: '¿El arte de los marcos está sacado de los juegos?',
    faq4A:
      'No. Cada dibujo, como el tejado de pagoda, los farolillos o los bloques de píxeles, se hizo desde cero, sin logos ni arte de los juegos. Los presets son estilos hechos por fans que capturan la sensación de esos juegos.',
  },
  countdown: {
    breadcrumb: 'Configurar Cuenta Regresiva',
    title: 'Configurar Cuenta Regresiva',
    intro:
      'Una cuenta regresiva para las partes del stream en las que todavía no pasa nada: los minutos antes de empezar el directo, una pausa a mitad y los últimos minutos antes de despedirte. Dale una duración o la hora a la que quieres empezar, y toma el aspecto del preset que elijas. No necesita canal, pero con uno tus mods pueden retrasarla desde el chat.',
    scenes: {
      starting: {
        label: 'Inicio',
        title: 'Empezamos pronto',
        done: '¡Estamos en directo!',
        hint: 'Para la escena que tienes puesta antes de empezar el directo.',
      },
      break: {
        label: 'Pausa',
        title: 'Vuelvo pronto',
        done: '¡Ya volví!',
        hint: 'Para una pausa a mitad: comer, descansar, un recado rápido.',
      },
      ending: {
        label: 'Cierre',
        title: 'El stream termina',
        done: '¡Gracias por ver el stream!',
        hint: 'Para los últimos minutos, así el chat sabe cuánto queda.',
      },
    },
    sectionCountdown: 'Cuenta regresiva',
    scene: '¿Para qué es?',
    sceneTip: 'Esto elige el texto y el icono. Puedes escribir tu propio texto más abajo.',
    mode: 'Contar hasta',
    modes: {
      duration: 'Una duración',
      clock: 'Una hora del día',
    },
    modeTip:
      'Una duración empieza en cuanto se carga la fuente de navegador. Una hora del día siempre termina a esa hora, así que puedes añadir la fuente con horas de antelación.',
    duration: 'Duración',
    durationUnit: 'min',
    durationTip: 'Cuánto dura la cuenta regresiva, de 1 minuto a 24 horas.',
    atLabel: 'Hora del día',
    atTip:
      'Una hora en formato 24 h como 21:00, leída del reloj del equipo donde corre OBS. Si ya pasó hoy, la cuenta regresiva apunta a mañana.',
    atPlaceholder: '21:00',
    atInvalid: 'Escribe una hora en formato 24 h, como 21:00.',
    ending: 'Al llegar a cero',
    endings: {
      text: 'Mostrar un mensaje',
      hold: 'Quedarse en 00:00',
      hide: 'Ocultarla',
    },
    endingTip:
      'Lo que queda en pantalla cuando se acaba la cuenta regresiva, hasta que cambies de escena.',
    sectionText: 'Texto',
    titleLabel: 'Titular',
    titleTip: 'Encima del reloj. Déjalo vacío para usar el texto de la escena que elegiste.',
    titlePlaceholder: 'Texto de la escena',
    noteLabel: 'Nota',
    noteTip:
      'Una línea debajo del reloj, p. ej. para qué es la pausa. Déjala vacía para ocultarla.',
    notePlaceholder: 'Sin nota',
    doneLabel: 'Mensaje en cero',
    doneTip: 'Reemplaza al reloj cuando se acaba. Déjalo vacío para usar el texto de la escena.',
    look: 'Fondo',
    looks: {
      card: 'Panel',
      plain: 'Sin panel',
    },
    lookTip: 'Un panel detrás del reloj, o el texto directamente sobre tu escena.',
    color: 'Color',
    showBar: 'Barra de progreso',
    showBarTip: 'Una barra debajo del reloj que se vacía a medida que se acaba el tiempo.',
    motion: 'Animaciones',
    motionTip: 'El reloj late durante el último minuto. Desactívalo y todo se queda quieto.',
    channelsTip:
      'Solo hace falta para los comandos del chat. Sin canal, la cuenta regresiva funciona igual por su cuenta.',
    sectionCommands: 'Comandos del chat',
    commandsIntro:
      'Con un canal puesto, tú y tus mods pueden cambiar la cuenta regresiva desde el chat de Twitch o Kick, por ejemplo para retrasar el inicio mientras estás lejos del teclado.',
    cmdAdd: 'Suma tiempo: 5m, 90s o 1h30m',
    cmdRemove: 'Quita tiempo',
    cmdSet: 'Fija el tiempo restante',
    cmdPause: 'La pausa; start la vuelve a arrancar',
    cmdReset: 'Reinicia la cuenta regresiva',
    previewTitle: 'Vista previa de Cuenta Regresiva',
    previewIframeTitle: 'Vista previa de Cuenta Regresiva',
    previewHint:
      'La vista previa va rápido para que veas la cuenta regresiva entera, y luego vuelve a empezar. En el stream cuenta en tiempo real.',
    testTitle: 'Pruébalo:',
    testAdd: '+1 min',
    testRemove: '-1 min',
    testPause: 'Pausar',
    testFinish: 'Saltar a cero',
    widgetUrlTip:
      '¿Ya hiciste una cuenta regresiva? Pega su URL aquí para cargar tu configuración y cambiar lo que necesites.',
    widgetUrlPlaceholder: 'Pega la URL de una cuenta regresiva existente para editarla',
    widgetUrlInvalid: 'Esta no es una URL de Cuenta Regresiva.',
    browserSourceHintSize: ' (tamaño recomendado: 1920×1080).',
    guideTitle: 'Configuración en tu programa de streaming (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Añade una fuente de navegador a tu escena de inicio, pausa o cierre y pega la URL de la cuenta regresiva.',
    guideStep2:
      'Pon el ancho en 1920 y el alto en 1080, así el reloj queda en el centro de la escena.',
    guideStep3:
      'Marca "Actualizar el navegador cuando la escena se active", así la cuenta regresiva vuelve a empezar cada vez que cambias a esa escena.',
    guideStep4:
      'Cambia a la escena para arrancarla. Con un canal puesto, un mod puede retrasarla con !countdown add 5m mientras no estás.',
    faq1Q: '¿Cuándo empieza la cuenta regresiva?',
    faq1A:
      'En cuanto se carga la fuente de navegador: cuando se abre OBS, o cuando cambias a la escena con "Actualizar el navegador cuando la escena se active" marcado. Así una cuenta regresiva de pausa vuelve a empezar cada vez que vas a tu escena BRB, en lugar de agotarse mientras sigues en directo.',
    faq2Q: '¿Puede contar hasta la hora que anuncié, como las 21:00?',
    faq2A:
      'Sí. Pon Contar hasta en una hora del día y escribe 21:00. Lee el reloj del equipo donde corre OBS, así que puedes añadir la fuente con horas de antelación y aun así termina a las 21:00. Si las 21:00 ya pasaron hoy, apunta a mañana.',
    faq3Q: '¿Necesito conectar mi cuenta de Twitch o Kick?',
    faq3A:
      'No. La cuenta regresiva funciona sola, sin canal y sin iniciar sesión. Solo pones un canal si quieres los comandos !countdown, y entonces lee tu chat público igual que los otros widgets.',
    faq4Q: '¿Qué pasa cuando llega a cero?',
    faq4A:
      'Lo que elijas en Al llegar a cero: un mensaje como "¡Estamos en directo!", el reloj quieto en 00:00, o el overlay desapareciendo para dejar la escena limpia. Nunca cambia de escena por ti.',
  },
  poll: {
    breadcrumb: 'Configurar Encuesta de Chat',
    title: 'Configurar Encuesta de Chat',
    intro:
      'Una encuesta de chat para Twitch y Kick. Tú o un mod lanzan una encuesta desde el chat, los espectadores votan escribiendo un número y las barras se llenan en directo en tu stream. Los votos de los dos chats van a una sola encuesta, cada espectador cuenta una vez y el ganador aparece cuando se acaba el tiempo.',
    sectionPoll: 'Encuesta preparada',
    question: 'Pregunta',
    questionTip:
      'Se muestra encima de las opciones. Déjala vacía si haces la pregunta en voz alta.',
    questionPlaceholder: '¿A qué jugamos ahora?',
    options: 'Opciones',
    optionsTip:
      'Los espectadores votan con el número que hay junto a una opción, o escribiendo la opción misma. Hasta 6 opciones.',
    optionLabel: 'Opción {n}',
    optionPlaceholder: 'Opción {n}',
    removeOption: 'Quitar opción {n}',
    addOption: '+ Añadir opción',
    pollHint:
      'Se guarda en la URL. Lánzala con {command} en el chat. Los mods también pueden escribir una encuesta nueva en el chat cuando quieran.',
    sectionVoting: 'Votación',
    duration: 'Duración de la encuesta',
    durationTip:
      'Cuánto tiempo acepta votos una encuesta. En el chat un mod puede darle otra duración a una encuesta, terminarla antes o sumarle tiempo.',
    durationOff: 'Sin tiempo: la encuesta sigue abierta hasta que un mod escribe !poll end.',
    hold: 'Resultados en pantalla',
    holdTip:
      'Cuánto tiempo se quedan los resultados después de cerrar la votación. Luego la encuesta sale de la pantalla.',
    holdOff: 'Los resultados se quedan hasta la siguiente encuesta o hasta !poll cancel.',
    delay: 'Retraso del stream',
    delayTip:
      'Los espectadores ven tu stream unos segundos después que el chat, así que un voto escrito con "1 segundo restante" llega tarde al chat. Los votos siguen contando estos segundos después de que termina el tiempo. Twitch y Kick suelen ir de 2 a 10 segundos por detrás.',
    voters: 'Quién puede votar',
    votersTip: 'Suscriptores significa espectadores con insignia de sub o de fundador, y tú.',
    votersAll: 'Todos',
    votersSubs: 'Suscriptores',
    subWeight: 'Un voto de sub cuenta',
    subWeightTip:
      'El voto de un suscriptor cuenta esta cantidad de veces. La encuesta lo indica en pantalla.',
    subWeightValue: '{n}×',
    change: 'Se puede cambiar el voto',
    changeTip:
      'Activado: escribir otro número mueve el voto. Desactivado: vale el primer voto. En cualquier caso cada espectador cuenta una vez.',
    blind: 'Ocultar resultados hasta el final',
    blindTip:
      'Las barras se quedan ocultas mientras la votación está abierta, para que los primeros votos no influyan en el resto. Solo se ve el número de votos.',
    color: 'Color',
    position: 'Posición',
    positionTip:
      'Dónde se coloca la encuesta dentro de la fuente de navegador. Crece desde ahí según el número de opciones.',
    positionTop: 'Arriba',
    positionBottom: 'Abajo',
    language: 'Idioma de la encuesta',
    languageTip:
      'El idioma de las palabras de la encuesta, como "Resultados" y el Sí y No de una encuesta rápida.',
    unitMinutes: 'min',
    unitSeconds: 's',
    sectionCommands: 'Comandos del chat',
    commandsIntro:
      'Tú y tus mods manejan las encuestas desde el chat de Twitch o Kick. Las partes de una encuesta nueva se separan con |.',
    exampleQuestion: 'Pregunta',
    cmdNew: 'Lanza una encuesta nueva con 2 a 6 opciones',
    cmdNewTime: 'Lo mismo, con su propia duración, como 90s, 2m o 1:30',
    cmdYesNo: 'Lanza una encuesta rápida de Sí o No',
    cmdStart: 'Lanza la encuesta preparada de esta página',
    cmdExtend: 'Suma tiempo a la encuesta',
    cmdEnd: 'Cierra la votación ya y muestra los resultados',
    cmdCancel: 'Quita la encuesta de la pantalla',
    votingIntro:
      'Los espectadores votan escribiendo solo el número (2), !vote 2 o el texto de una opción. Un mensaje con algo más, como "2 porfa", no cuenta. El comando /vote de Twitch es para las encuestas propias de Twitch, así que dile al chat que escriba el número.',
    previewTitle: 'Vista previa de Encuesta de Chat',
    previewIframeTitle: 'Vista previa de Encuesta de Chat',
    previewHint:
      'La vista previa reproduce una encuesta con votantes simulados, más rápido que en tiempo real, y luego empieza la siguiente. En el stream una encuesta solo aparece cuando tú o un mod la lanzan.',
    testTitle: 'Pruébalo:',
    testVotes: '+{count} votos',
    testExtend: '+30 s',
    testEnd: 'Terminar ya',
    testNew: 'Nueva encuesta',
    widgetUrlTip:
      '¿Ya hiciste un widget? Pega su URL aquí para cargar tu configuración y cambiar lo que necesites.',
    widgetUrlPlaceholder: 'Pega la URL de un widget existente para editarlo',
    widgetUrlInvalid: 'Esta no es una URL de Encuesta de Chat.',
    browserSourceHintSize: ' (tamaño recomendado: 640×560).',
    guideTitle: 'Configuración en tu programa de streaming (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Añade una fuente de navegador en tu programa de streaming (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Pega la URL de la encuesta de chat que copiaste.',
    guideStep3: 'Pon el ancho en 640 y el alto en 560.',
    guideStep4:
      'La fuente se queda vacía hasta que empieza una encuesta. Escribe !poll start, o !poll Pregunta | A | B, en el chat.',
    faq1Q: '¿Cómo votan los espectadores?',
    faq1A:
      'Escribiendo el número de la opción en el chat, como 2. !vote 2 y el texto de la opción también funcionan, con mayúsculas o minúsculas y con o sin tildes. El mensaje entero tiene que ser el voto, así que "2 porfa" o 4Head no cuentan.',
    faq2Q: '¿Un espectador puede votar más de una vez?',
    faq2A:
      'No. Cada cuenta de Twitch o Kick cuenta una vez. Con el cambio de voto activado, un número nuevo mueve su voto y nunca suma un segundo. Si un mod le da timeout o banea a una cuenta mientras la encuesta está abierta, su voto se quita, lo que ayuda contra los bots de spam.',
    faq3Q: '¿Por qué no usar las encuestas propias de Twitch o Kick?',
    faq3A:
      'Esta encuesta junta los votos de Twitch y Kick en un solo resultado y funciona igual en las dos. Las encuestas propias de Twitch no se pueden leer sin iniciar sesión, y este overlay nunca te pide iniciar sesión. Además no necesitas ser Afiliado ni Partner.',
    faq4Q: '¿Qué pasa si OBS se cierra o la fuente de navegador se recarga?',
    faq4A:
      'La encuesta y sus votos se guardan dentro de OBS, así que vuelve donde estaba. El tiempo sigue corriendo mientras OBS está cerrado, pero los votos escritos en ese rato no se pueden ver.',
    faq5Q: '¿Por qué siguen contando votos después de que el tiempo llega a cero?',
    faq5A:
      'Los espectadores ven tu stream unos segundos por detrás del chat, así que cuando su contador marca 1 segundo, en el chat ya terminó. Retraso del stream sigue contando votos unos segundos más, 5 por defecto, y el ganador aparece después.',
    overlay: {
      label: 'Encuesta',
      closing: 'Últimos votos',
      results: 'Resultados',
      tie: 'Empate',
      tieHint: '¡Es un empate!',
      winner: 'Ganador: {option}',
      noVotes: 'Sin votos',
      hidden: 'Los resultados se ven al cerrar la votación',
      howTo: 'Escribe de 1 a {last} en el chat',
      howToTwo: 'Escribe 1 o 2 en el chat',
      subsOnly: 'Solo subs',
      subBonus: 'Votos de sub ×{n}',
      votes: '{count} votos',
      voteOne: '1 voto',
      yes: 'Sí',
      no: 'No',
      sampleQuestion: '¿A qué jugamos ahora?',
      sampleOption1: 'Juego de terror',
      sampleOption2: 'Speedrun',
      sampleOption3: 'Partidas con viewers',
    },
  },
  streamAlerts: {
    breadcrumb: 'Configurar Alertas de Stream',
    title: 'Configurar Alertas de Stream',
    intro:
      'Alertas animadas para tu stream de Twitch y Kick. Una sub nueva, subs regaladas, Bits, Kicks o un raid tienen cada uno su alerta con su propio icono y sonido, una tras otra. Elige un color, cambia los títulos y fija el regalo, cheer o raid mínimo que merece una alerta.',
    color: 'Color',
    theme: 'Tema',
    themeTip:
      'Neon es un banner anguloso de ciencia ficción con sonidos de sintetizador. Celestial es una tarjeta con líneas doradas bajo las estrellas con sonido de campanas.',
    themes: {
      neon: 'Neon',
      celestial: 'Celestial',
    },
    colorTip: 'Plataforma muestra las alertas de Twitch en morado y las de Kick en verde.',
    colors: {
      blue: 'Azul',
      purple: 'Morado',
      pink: 'Rosa',
      red: 'Rojo',
      gold: 'Dorado',
      green: 'Verde',
      platform: 'Plataforma (Twitch morado, Kick verde)',
    },
    language: 'Idioma de las alertas',
    languageTip:
      'El idioma de las palabras de la alerta. La URL de OBS lo conserva, esté OBS en el idioma que esté.',
    sectionAlerts: 'Alertas',
    heading: 'Título',
    kindSub: 'Subs',
    kindSubTip:
      'Cada sub nueva y cada resub, y la resub que un espectador comparte en el chat con un mensaje.',
    kindGift: 'Subs regaladas',
    kindGiftTip: 'Una alerta por regalo, tenga las subs que tenga.',
    kindBits: 'Bits y Kicks',
    kindBitsTip: 'Bits enviados como cheer en Twitch y Kicks enviados en Kick.',
    kindRaid: 'Raids',
    kindRaidTip: 'Otro canal haciendo raid al tuyo, con cuántos espectadores trajo.',
    minGift: 'Mín. de subs',
    minBits: 'Cantidad mín.',
    minRaid: 'Mín. de espectadores',
    sectionTiming: 'Tiempo y sonido',
    duration: 'Tiempo en pantalla',
    durationTip: 'Cuánto dura cada alerta en pantalla. Cuando llegan varias, esperan su turno.',
    seconds: '{value} s',
    volume: 'Volumen',
    volumeTip: 'Cada alerta reproduce un sonido corto propio. 0 quita el sonido.',
    volumeOff: 'Desactivado',
    showMessage: 'Mostrar mensaje del espectador',
    showMessageTip:
      'Muestra lo que escribió el espectador con su resub, Bits o Kicks. Los enlaces se quitan y los mensajes largos se recortan.',
    previewTitle: 'Vista previa de Alertas de Stream',
    previewIframeTitle: 'Vista previa de Alertas de Stream',
    previewHint:
      'La vista previa reproduce alertas de ejemplo sin sonido. Los botones de abajo reproducen una con su sonido. En el stream solo aparecen las subs, los regalos, los cheers y los raids de tu canal.',
    testTitle: 'Pruébalo:',
    testSub: 'Sub',
    testGift: '{count} regaladas',
    testBits: '{amount} Bits/Kicks',
    testRaid: 'Raid',
    testViewer: 'EspectadorPrueba',
    testMessage: '¡Qué buen stream!',
    widgetUrlTip:
      '¿Ya hiciste un widget? Pega su URL aquí para cargar tu configuración y cambiar lo que necesites.',
    widgetUrlPlaceholder: 'Pega la URL de un widget existente para editarlo',
    widgetUrlInvalid: 'Esta no es una URL de Alertas de Stream.',
    browserSourceHintSize: ' (tamaño recomendado: 800×450).',
    guideTitle: 'Configuración en tu programa de streaming (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Añade una fuente de navegador en tu programa de streaming (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Pega la URL de las alertas que copiaste.',
    guideStep3:
      'Pon el ancho en 800 y el alto en 450, y colócala donde quieras que salgan las alertas.',
    guideStep4:
      'Para oír el sonido en OBS, activa Controlar audio vía OBS en las propiedades de la fuente y pon la fuente en Monitorización y salida en Propiedades de audio avanzadas.',
    faq1Q: '¿Por qué no hay alertas de follows ni de donaciones?',
    faq1A:
      'Twitch y Kick no muestran los follows nuevos a una página sin sesión iniciada, y ninguna de las dos plataformas tiene donaciones propias. Las alertas solo usan lo que ambas plataformas envían a todos los espectadores, así que funcionan igual en las dos.',
    faq2Q: '¿Una alerta de sub muestra los meses y el mensaje del espectador?',
    faq2A:
      'Sí. Cuando un espectador comparte su resub en el chat, en Twitch o en Kick, recibe una alerta con los meses y lo que escribió. En Twitch toda alerta de sub muestra los meses. Kick los envía con la mayoría de las subs, pero algunos canales nunca los reciben, y entonces la alerta solo dice que se suscribió.',
    faq3Q: '¿Qué pasa cuando llegan muchas alertas a la vez?',
    faq3A:
      'Aparecen de una en una en el orden en que llegaron. Un regalo de 50 subs es una sola alerta, no 50.',
    faq4Q: '¿Necesito iniciar sesión o conectar mi cuenta?',
    faq4A:
      'No. Las alertas leen las subs, los regalos, los Bits, los Kicks y los raids de tu chat público de Twitch y Kick, como los ve un espectador sin sesión iniciada.',
    alert: {
      subHeading: 'Nuevo suscriptor',
      subDetail: 'se acaba de suscribir',
      resubDetail: 'lleva {months} meses suscrito',
      giftHeading: 'Subs regaladas',
      giftDetail: 'regaló {count} subs',
      giftDetailOne: 'regaló una sub',
      bitsHeading: 'Nuevo cheer',
      bitsDetail: 'envió {amount} Bits',
      kicksHeading: 'Kicks',
      kicksDetail: 'envió {amount} Kicks',
      raidHeading: '¡Llega un raid!',
      raidDetail: 'hace raid con {viewers} espectadores',
      raidDetailOne: 'hace raid con 1 espectador',
      raidDetailNoCount: 'hace raid',
      anonymous: 'Anónimo',
    },
  },
  raffle: {
    breadcrumb: 'Configurar Sorteo',
    title: 'Configurar Sorteo',
    intro:
      'Haz sorteos directamente desde el chat: los espectadores entran escribiendo una palabra clave como !join y tú sacas al ganador con un clic. Funciona en Twitch y Kick, se puede limitar a suscriptores y, si quieres, muestra al ganador en el stream con confeti.',
    lockedTitle: 'Configuración bloqueada',
    lockedDesc:
      'Las reglas no se pueden cambiar mientras un sorteo está en curso o esperando a que saques al ganador. Pulsa Reiniciar todo para editarlas.',
    platform: 'Plataforma',
    channelName: 'Canal',
    sectionRules: 'Reglas de entrada',
    entryKeyword: 'Palabra clave',
    keywordTip:
      'El mensaje tiene que ser exactamente esto, o empezar con esto seguido de un espacio. Da igual si usas mayúsculas, y los bots conocidos se ignoran.',
    minDuration: 'Duración mínima (s)',
    minDurationTip:
      'Sacar ganador se queda bloqueado estos segundos después de pulsar Iniciar sorteo, para que todos tengan tiempo de escribir.',
    subscribersOnly: 'Solo suscriptores',
    subscribersOnlyTip:
      'Solo pueden entrar los espectadores con insignia de suscriptor o de fundador. Tú también puedes entrar como streamer, siempre que el mínimo sea 1 mes.',
    minSubMonths: 'Meses mínimos de sub',
    maxWinsPerUser: 'Máx. de victorias por espectador',
    maxWinsTip:
      'Un ganador sale de la lista de participantes. Puede volver a entrar escribiendo la palabra clave, hasta llegar a este límite.',
    maxWinsUnlimited: 'Ilimitado',
    resetConfig: 'Restablecer configuración',
    controlTitle: 'Controles del sorteo',
    controlTip:
      'Deja esta página abierta durante el sorteo. Lee el chat y envía el ganador al overlay.',
    statusIdle: 'Sin empezar',
    statusNeedsSetup: 'Escribe un canal y una palabra clave para empezar.',
    statusRunning: 'Abierto, esperando {keyword}',
    statusStopped: 'Inscripciones cerradas',
    startRaffle: 'Iniciar sorteo',
    stopRaffle: 'Cerrar inscripciones',
    drawWinner: 'Sacar ganador ({count} válidos)',
    drawLocked: 'El sorteo se desbloquea en {seconds} s',
    lastWinner: 'Último ganador',
    clear: 'Borrar',
    resetEntries: 'Borrar participantes',
    resetWinners: 'Borrar ganadores',
    resetAll: 'Reiniciar todo',
    winners: 'Ganadores ({count})',
    participants: 'Participantes ({count})',
    noWinners: 'Todavía no hay ganadores.',
    noParticipants:
      'Todavía no hay participantes. Los espectadores entran escribiendo {keyword} en el chat.',
    disqualify: 'Quitar a {name}',
    confirmStart: '¿Empezar un sorteo nuevo? Se borrarán los participantes y ganadores actuales.',
    confirmResetEntries: '¿Borrar la lista de participantes?',
    confirmResetWinners: '¿Borrar la lista de ganadores?',
    confirmResetAll:
      '¿Reiniciar todo? Se borran los participantes y los ganadores y se quita el bloqueo. Tu configuración se queda como está.',
    overlayUrl: 'URL del overlay de ganador',
    overlayUrlTip:
      'El ganador se envía con BroadcastChannel del navegador, que no puede salir del navegador en el que funciona. Una página de sorteo abierta en Chrome no puede llegar a un overlay dentro de OBS.',
    overlayUrlHint:
      'El ganador solo llega al overlay cuando esta página funciona en el mismo navegador o programa que el overlay. Haz un sorteo de prueba antes de empezar el directo.',
    overlayNextStep:
      'Abre esta página de sorteo en el mismo programa que el overlay y haz un sorteo de prueba.',
    guideStep1:
      'Elige la plataforma, escribe el nombre de tu canal y define la palabra clave y las reglas.',
    guideStep2:
      '¿Quieres al ganador en el stream? Añade la URL del overlay como fuente de navegador de 1920×1080.',
    guideStep3:
      'Pulsa Iniciar sorteo. Los espectadores entran escribiendo la palabra clave en el chat, y puedes quitar a cualquiera con la ✕ junto a su nombre.',
    guideStep4:
      'Cuando estés listo, pulsa Sacar ganador. El ganador solo aparece en el overlay si esta página funciona en el mismo navegador o programa, así que pruébalo antes de empezar el directo.',
    faq1Q: '¿Cómo evitas que la misma persona gane dos veces?',
    faq1A:
      'Un ganador sale de la lista de participantes y pasa a la lista de ganadores. Con Máx. de victorias por espectador en 1, no puede volver a entrar ni ganar en el mismo sorteo.',
    faq2Q: '¿Puedo quitar participantes sospechosos o bots?',
    faq2A:
      'Los bots conocidos como Nightbot y StreamElements se saltan automáticamente. También puedes quitar a cualquiera con la ✕ junto a su nombre.',
    faq3Q: '¿Por qué el ganador no aparece en mi overlay?',
    faq3A:
      'La página de sorteo envía el ganador con BroadcastChannel, que solo funciona dentro de un mismo navegador. Si esta página está abierta en Chrome y el overlay funciona en OBS, el mensaje nunca llega. Abre la página de sorteo en el mismo programa que el overlay y haz un sorteo de prueba antes de empezar el directo.',
    winner: '¡Ganador!',
    subMonthsShort: '{months} m',
  },
  alerts: {
    follow: '¡Nuevo seguidor!',
    sub: '¡Nuevo suscriptor!',
    donate: '¡Donación!',
    raid: '¡Llega un raid!',
  },
  emoteWallSetup: {
    breadcrumb: 'Configurar Muro de Emotes',
    title: 'Configurar Muro de Emotes',
    intro:
      'Los mensajes hechos solo de emotes (de Twitch, de Kick y los emotes de 7TV de tu canal de Twitch) aparecen como emotes en pantalla. Los mensajes de texto normales se saltan por defecto, y Mostrar todos los emotes también saca los emotes de esos mensajes. Tranquilo los hace aparecer en puntos al azar para flotar y desvanecerse, Caos los lanza desde un borde a través de la pantalla y Rebote los hace rebotar en los bordes de la pantalla.',
    sectionAnimation: 'Animación',
    sectionFilters: 'Filtros',
    sevenTvEmotes: 'Emotes de 7TV',
    sevenTvTip:
      'Muestra los emotes de 7TV de tu canal de Twitch, también en el chat de Kick. Necesita tu canal de Twitch.',
    mode: 'Modo de animación',
    modeCalm: 'Tranquilo',
    modeChaos: 'Caos',
    modeBounce: 'Rebote',
    modeTip:
      'Tranquilo: aparece en un punto al azar, flota y se desvanece. Caos: entra volando desde un borde al azar y desaparece entre la mitad y el lado opuesto. Rebote: rebota en los bordes y acelera con cada golpe.',
    emoteSize: 'Tamaño de los emotes',
    duration: 'Tiempo visible (s)',
    durationTip:
      'Cuánto tiempo se queda cada emote en pantalla. En Caos, los emotes cruzan la pantalla en parte de ese tiempo y desaparecen antes.',
    maxEmotes: 'Máx. de emotes a la vez',
    maxEmotesTip: 'Cuando hay más emotes que este número en pantalla, se quitan los más viejos.',
    subsOnly: 'Solo suscriptores',
    subsOnlyTip:
      'Solo muestra emotes de quienes tienen insignia de suscriptor o de fundador, y los tuyos. La vista previa lo ignora.',
    subDurationX2: 'Emotes de subs el doble de tiempo',
    subDurationX2Tip:
      'Los emotes de quienes tienen insignia de suscriptor o de fundador, y los tuyos, se quedan en pantalla el doble de tiempo.',
    showAllEmotes: 'Mostrar todos los emotes',
    showAllEmotesTip:
      'También muestra los emotes dentro de mensajes de texto normales, hasta 5 por mensaje. La vista previa lo ignora.',
    hypeMode: 'Modo hype',
    hypeModeTip:
      'Un emote solo aparece cuando 2 o más personas distintas lo envían en 15 segundos, y luego como mucho una vez cada 15 segundos. La vista previa lo ignora.',
    spamBlock: 'Bloquear spam de emotes',
    spamBlockTip:
      'Si alguien envía más de 3 mensajes de emotes en 10 segundos, los que sobran se saltan. El mismo emote más de dos veces en 10 segundos salta solo ese emote. La vista previa lo ignora.',
    previewTitle: 'Vista previa del Muro de Emotes',
    previewIframeTitle: 'Vista previa del Muro de Emotes',
    previewHint:
      'La vista previa muestra emotes de ejemplo. En el stream, los emotes vienen de tu chat.',
    widgetUrlTip:
      '¿Ya hiciste un widget? Pega su URL aquí para cargar tu configuración y cambiar lo que necesites.',
    widgetUrlPlaceholder: 'Pega la URL de un widget existente para editarlo',
    widgetUrlInvalid: 'Esta no es una URL de widget de Muro de Emotes.',
    guideTitle: 'Configuración en tu programa de streaming (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Añade una fuente de navegador en tu programa de streaming (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Pega la URL del muro de emotes que copiaste.',
    guideStep3:
      'Pon el ancho y el alto al tamaño completo de tu lienzo (p. ej. 1920×1080) y colócala encima de tu gameplay.',
    browserSourceHintSize: ' (tamaño recomendado: 1920×1080, lienzo completo).',
    faq1Q: '¿Qué mensajes hacen aparecer un emote flotante?',
    faq1A:
      'Los mensajes hechos solo de emotes, como un solo Kappa, una fila de emotes o una mezcla de emotes de Twitch, Kick y 7TV. Los mensajes de texto normales se ignoran, salvo que Mostrar todos los emotes esté activado.',
    faq2Q: '¿Necesito iniciar sesión para usar el muro de emotes?',
    faq2A:
      'No hace falta iniciar sesión. Muro de Emotes escucha de forma anónima el chat público de ambas plataformas.',
  },
  plants: {
    classic: 'Brote clásico',
    rose: 'Rosa',
    sunflower: 'Girasol',
    cactus: 'Cactus',
    tulip: 'Tulipán',
    pine: 'Pino',
    lotus: 'Loto',
    lily: 'Lirio',
    palm: 'Palmera',
    vine: 'Enredadera',
    waterOff: 'Desactivado',
    waterRain: 'Lluvia',
    waterSparkle: 'Destellos',
  },
  guides: {
    breadcrumb: 'Guías',
    eyebrow: 'Guía',
    published: 'Publicada el {date}',
    onThisPage: 'En esta página',
    covers: 'Herramientas que cubre',
    relatedTitle: 'Guías relacionadas',
    readGuide: 'Leer la guía',
    allGuides: 'Todas las guías',
    openSetup: 'Abrir la página de configuración',
    index: {
      title: 'Guías',
      lead: 'Cada guía responde una pregunta paso a paso: añadir un widget a OBS, juntar el chat de Twitch y Kick, leer el chat en un panel de OBS, añadir alertas al stream, montar un subathon timer, hacer una encuesta en el chat, enmarcar tu cámara y tu chat, poner una cuenta regresiva para tu stream, hacer un sorteo en el chat y cambiar de escena desde el chat. Todas tratan de herramientas gratis que no piden iniciar sesión.',
      listLabel: 'Todas las guías',
      moreText:
        'Para preguntas generales, mira las [preguntas frecuentes](/faq). Para ver qué ha cambiado, entra en las [novedades](/changelog).',
    },
    obs: {
      title: 'Cómo añadir un widget de Senchabot a OBS como fuente de navegador',
      short: 'Añadir un widget a OBS',
      summary:
        'Los pasos para añadir una fuente de navegador, el tamaño correcto para cada widget, dos ajustes que conviene dejar desactivados y qué revisar si el widget se ve vacío.',
      lead: 'Los widgets de Senchabot entran en OBS como fuente de navegador: haz clic en + en el panel Fuentes, elige Navegador, pega en el campo URL la URL que copiaste de la página de configuración y pon el ancho y el alto en el tamaño recomendado del widget. No tienes que iniciar sesión ni descargar nada, y el fondo ya es transparente.',
      add: {
        title: '¿Cómo se añade una fuente de navegador en OBS?',
        intro:
          'Cuando escribas el nombre de tu canal en la página de configuración y pulses Copiar, sigue estos pasos en OBS Studio:',
        step1: 'Selecciona la escena donde debe aparecer el widget.',
        step2: 'En el panel Fuentes, haz clic en + y elige Navegador en la lista.',
        step3: 'Ponle un nombre a la fuente, por ejemplo "Caja de Chat", y haz clic en Aceptar.',
        step4:
          'En la ventana de propiedades que se abre, borra el campo URL y pega la URL del widget que copiaste.',
        step5: 'Escribe los valores de la tabla de abajo en los campos Ancho y Alto.',
        step6: 'Haz clic en Aceptar y arrastra la fuente adonde quieras dentro de la escena.',
        note: 'La [página de configuración de Caja de Chat](/setup/chat-widget) muestra estos pasos junto con el tamaño recomendado cuando copias la URL. Si quieres ir a lo seguro, abre primero la URL en una pestaña normal del navegador y comprueba que funciona.',
      },
      size: {
        title: '¿Qué tamaño debe tener cada widget?',
        intro:
          'Cada widget tiene un tamaño de fuente recomendado. Escribe estos valores en los campos Ancho y Alto de OBS.',
        caption: 'Tamaños recomendados de fuente de navegador para los widgets de Senchabot',
        colWidget: 'Widget',
        colSize: 'Ancho × Alto',
        colNote: 'Nota',
        notSource: 'No es una fuente',
        notes: {
          chatBox:
            'Una columna de chat vertical. Una fuente más grande muestra más mensajes, el texto mantiene su tamaño.',
          emoteWall:
            'Un lienzo 1080p completo. Los emotes aparecen en cualquier parte de la pantalla.',
          subSprout: 'La planta y la maceta crecen dentro de esta área.',
          frames:
            '640x360 para una cámara, 420x720 para el chat, 1920x1080 para la pantalla. El marco se adapta al tamaño que le des.',
          goal: 'Una franja ancha para la barra de meta, con espacio encima para que suban los +1.',
          subathon:
            'Una franja ancha para la barra de vida, el reloj o el anillo. Una fuente más grande lo agranda.',
          countdown:
            'Un lienzo 1080p completo, así el reloj queda en el centro de tu escena de inicio o BRB.',
          poll: 'Espacio para una encuesta de hasta 6 opciones. Se coloca arriba o abajo y crece con las opciones.',
          streamAlerts:
            'Una alerta a la vez, en el centro de esta área. Una fuente más grande la agranda.',
          raffle:
            'El overlay del ganador. El confeti sale de los dos lados de la pantalla y el nombre del ganador aparece en el centro.',
          obsBridge:
            'No es un overlay visible. Deja la herramienta abierta en una pestaña del navegador o en un panel de OBS.',
          socials:
            'Una cuenta a la vez, en el centro de esta franja. El texto no se achica, así que un nombre de usuario largo necesita una fuente más ancha.',
        },
        fontNote:
          'Para agrandar el texto de la Caja de Chat, no estires la fuente. Usa el ajuste Tamaño de fuente en la página de configuración: de 8 a 72 píxeles, 18 por defecto.',
      },
      transparent: {
        title: '¿Hay que hacer algo para que el fondo sea transparente?',
        p1: 'No. Caja de Chat, Muro de Emotes, Sub Sprout, Subathon Timer, Alertas de Stream, Meta de Subs, Encuesta de Chat y el overlay de Sorteo se dibujan sobre un fondo transparente. No necesitas chroma key ni ningún filtro, y puedes dejar el campo CSS personalizado de OBS como está.',
        p2: 'Si la Caja de Chat se lee mal sobre una escena clara, activa Fondo oscuro. Pone una capa negra semitransparente detrás del widget, y puedes ajustar su opacidad entre 0% y 100% (50% por defecto). Si quieres cada mensaje en su propio recuadro, activa Fondo por mensaje.',
      },
      settings: {
        title:
          '¿Hay que activar "Apagar fuente cuando no sea visible" y "Actualizar el navegador cuando la escena se active"?',
        intro:
          'Deja los dos desactivados para los widgets de Senchabot. Los dos recargan la página desde cero, y el widget olvida todo lo que tenía hasta ese momento:',
        chatBox:
          'Caja de Chat: los mensajes solo llegan mientras la fuente está funcionando. Si la fuente se apaga y vuelve, la pantalla empieza vacía y solo muestra mensajes nuevos.',
        subSprout:
          'Sub Sprout: el crecimiento de la planta no se guarda en ningún sitio. Si la página se recarga, la planta vuelve a la primera etapa.',
        goal: 'Meta de Subs: el conteo se guarda dentro de OBS, así que una recarga no lo pierde, pero las subs que llegan con la fuente apagada no se cuentan.',
        poll: 'Encuesta de Chat: la encuesta y sus votos se guardan dentro de OBS, así que una recarga no los pierde, pero los votos escritos con la fuente apagada no se cuentan.',
        subathon:
          'Subathon Timer: el tiempo restante se guarda dentro de OBS, así que una recarga no lo pierde. El timer sigue contando hacia atrás con la fuente apagada, pero no puede ver las subs que llegan en ese rato.',
        streamAlerts:
          'Alertas de Stream: solo las subs, los regalos, los cheers y los raids que llegan con la fuente funcionando tienen alerta. Lo que llegue con la fuente apagada se pierde.',
        raffle:
          'Overlay de Sorteo: solo el overlay que está abierto en ese momento recibe al ganador. Un ganador sacado con la fuente apagada nunca aparece en pantalla.',
        emoteWall:
          'Muro de Emotes: los emotes duran 5 segundos por defecto, así que una recarga no te cuesta nada, pero tampoco ayuda.',
        refresh:
          'Si un widget se queda trabado, haz doble clic en la fuente y pulsa el botón "Actualizar la caché de la página actual" en la ventana de propiedades. Eso recarga la página una vez.',
      },
      update: {
        title: '¿Cómo cambio un widget más adelante?',
        p1: 'Tu configuración vive dentro de la URL del widget, así que cambiar un ajuste significa una URL nueva. Cambia el ajuste en la página de configuración, copia la URL nueva, luego haz doble clic en la fuente en OBS y pégala encima de la URL vieja en el campo URL.',
        p2: 'No tienes que empezar de cero con [Caja de Chat](/setup/chat-widget), [Muro de Emotes](/setup/emote-wall), [Sub Sprout](/setup/sub-growing-plant), [Subathon Timer](/setup/subathon-timer), [Alertas de Stream](/setup/stream-alerts), [Meta de Subs](/setup/sub-goal), [Encuesta de Chat](/setup/chat-poll), [Marcos de Stream](/setup/stream-frames), [Redes Sociales](/setup/socials) ni [Cuenta Regresiva](/setup/stream-countdown). Pega tu URL actual en el campo URL del widget de la página de configuración y vuelven tus canales y toda tu configuración. Cambia lo que quieras y copia la URL nueva.',
        p3: 'OBS Bridge no tiene campo para pegar, así que vuelve a poner tu configuración en su página y copia la URL nueva de la herramienta. También puedes cambiar las escenas elegidas y los usuarios autorizados en la propia página de la herramienta y sacar la URL nueva con su botón Copiar URL actualizada. Las URL viejas siguen funcionando, así que no tienes que actualizarlas.',
      },
      troubleshoot: {
        title: '¿Qué hago si el widget no aparece en OBS?',
        intro:
          'La mayoría de las veces el problema es el nombre del canal. Revisa estos puntos en orden.',
        linkTitle: '¿Escribiste un enlace en vez del nombre del canal?',
        linkBody:
          'En el campo del canal escribe solo el nombre: `senchabot` para twitch.tv/senchabot. Si pegas el enlace completo, el widget toma el enlace como nombre del canal y no puede conectarse a ningún chat.',
        channelTitle: '¿El canal existe de verdad?',
        channelBody:
          'Revisa que el nombre no tenga errores. Un canal que no existe en Twitch no da ningún error. El widget simplemente se queda vacío.',
        quietTitle: '¿Ha pasado algo en el chat todavía?',
        quietBody:
          'Caja de Chat y Muro de Emotes se quedan completamente vacíos y transparentes hasta que pasa algo en el chat. Manda un mensaje en el chat; para Muro de Emotes tiene que ser, por defecto, un mensaje hecho solo de emotes, pero con Mostrar todos los emotes activado también cuentan los emotes dentro de mensajes normales. El overlay de Sorteo también aparece solo cuando se saca un ganador y desaparece a los 10 segundos. Sub Sprout y Subathon Timer, en cambio, aparecen de inmediato.',
        kickTitle: '¿No encuentra el canal de Kick?',
        kickBody:
          'Cuando el widget se abre, busca el canal de Kick en kick.com. Si esa búsqueda falla (nombre equivocado, el canal no existe o Kick no responde), los mensajes de Kick no llegan. Escribe tu nombre de Kick exactamente como aparece en la URL de kick.com.',
        tabTitle: '¿La URL funciona en un navegador?',
        tabBody:
          'Abre la URL en una pestaña normal del navegador. Si ahí funciona pero en OBS no, revisa el campo URL y el tamaño de la fuente.',
      },
      ctaTitle: 'Elige tu widget y consigue su URL',
      ctaText: 'Cada página de configuración te da una URL lista para pegar en OBS.',
    },
    chat: {
      title: 'Cómo mostrar el chat de Twitch y Kick juntos en OBS',
      short: 'Chat de Twitch y Kick juntos',
      summary:
        'Juntar los dos chats con una sola URL de Caja de Chat, mostrar de dónde viene cada mensaje, emotes, ocultar bots y el modo horizontal para una barra inferior.',
      lead: 'Caja de Chat junta el chat de Twitch y Kick en una sola fuente de navegador. En la página de configuración, elige Ambas en Plataformas, escribe los dos nombres de canal y añade a OBS la única URL que obtienes, a 400 × 600. Sin iniciar sesión: los dos chats se leen de forma anónima.',
      setup: {
        title: '¿Cómo se juntan el chat de Twitch y Kick en un solo overlay?',
        step1: 'Abre la [página de configuración de Caja de Chat](/setup/chat-widget).',
        step2: 'Elige Ambas en Plataformas. Ya viene así por defecto.',
        step3: 'Escribe solo los nombres de canal en los campos Canal de Twitch y Canal de Kick.',
        step4: 'Ajusta el aspecto. La vista previa muestra cada cambio al momento.',
        step5: 'Copia la URL del widget y añádela a OBS como fuente de navegador a 400 × 600.',
        p1: 'La URL que obtienes incluye los dos canales, por ejemplo `/widgets/chat-widget?twitch=yourchannel&kick=yourchannel`. No necesitas una fuente aparte para cada plataforma.',
        p2: 'La vista previa siempre reproduce un chat de ejemplo. Así puedes ver cómo se verá tu configuración en el stream sin que nadie escriba en tu canal.',
      },
      restream: {
        title: '¿Caja de Chat retransmite mi stream a las dos plataformas?',
        p1: 'No. Caja de Chat solo lee el chat y lo muestra en pantalla. No envía tu stream a Twitch ni a Kick, y no puede escribir en el chat. Para hacer stream en las dos plataformas a la vez necesitas un setup de multistreaming aparte; Caja de Chat junta los dos chats en ese stream.',
        p2: 'La moderación también pasa al overlay: los mensajes borrados y los de usuarios que reciben un timeout o un ban se quitan de la pantalla.',
      },
      platform: {
        title: '¿Cómo sabes si un mensaje vino de Twitch o de Kick?',
        intro:
          'Con las dos plataformas activas, Indicador de plataforma muestra de dónde vino cada mensaje al principio del mensaje. Hay tres opciones:',
        icon: 'Icono de plataforma (por defecto): el logo de Twitch o de Kick.',
        name: 'Nombre de plataforma: el texto `[twitch]` o `[kick]` en lugar de un logo.',
        none: 'Ocultar plataforma: ninguna marca.',
        stripe:
          'Activa Franja de color de plataforma y aparece una línea fina a la izquierda de cada mensaje: morada para Twitch, verde para Kick. Con la franja activada, puedes ocultar el indicador para un aspecto más limpio. En un mensaje resaltado, el color del resaltado ocupa el lugar de la franja.',
      },
      look: {
        title: '¿Qué diseños, animaciones y fuentes hay?',
        layoutTitle: 'Diseño del mensaje',
        inline: 'En línea (por defecto): usuario y mensaje en la misma línea.',
        stacked: 'Apilado: usuario arriba, mensaje debajo.',
        card: 'Tarjeta / Burbuja: cada mensaje va en una tarjeta semitransparente.',
        compact: 'Compacto: líneas ajustadas al estilo Twitch con el texto un poco más pequeño.',
        animationTitle: 'Animación de mensaje nuevo',
        animations:
          'Hay ocho opciones: Deslizar desde la derecha (por defecto), Deslizado suave desde la derecha, Pop / escalado, Rebote, Escalonado, Fundido, Máquina de escribir y Sin animación. Cuando el chat va más rápido, todas las animaciones menos la predeterminada se acortan. Si los mensajes llegan más rápido que uno cada medio segundo, la animación baja hasta un tercio de su duración normal, así ninguna se queda atrás frente a la siguiente.',
        fontTitle: 'Fuente y tamaño',
        fonts:
          'Inter (por defecto), Roboto, Nunito, JetBrains Mono, Source Serif 4 y la fuente Predeterminada del sistema. El tamaño de fuente va de 8 a 72 píxeles, 18 por defecto. Nombres en negrita y Mensajes en negrita son interruptores separados.',
      },
      duration: {
        title: '¿Cuánto tiempo se quedan los mensajes en pantalla?',
        p1: '30 segundos por defecto. En Duración del mensaje puedes elegir 10 s, 15 s, 30 s, 1 min, 2 min, 5 min o Siempre.',
        p2: 'Con Siempre, los mensajes no desaparecen: los nuevos empujan a los viejos hacia arriba, lo que no cabe en la caja se corta y se guardan como mucho los últimos 100 mensajes.',
      },
      emotes: {
        title: '¿Qué emotes aparecen?',
        intro:
          'Los emotes propios de Twitch y de Kick siempre se ven como imágenes. Además, puedes activar o desactivar tres proveedores desde el menú Emotes, y los tres vienen activados por defecto.',
        caption: 'Plataformas que admite cada proveedor de emotes en Caja de Chat',
        colProvider: 'Proveedor',
        colPlatforms: 'Funciona en',
        both: 'Twitch y Kick',
        twitchOnly: 'Solo Twitch',
        p1: 'Los emotes de canal y los globales se cargan juntos. Si dos emotes tienen el mismo nombre, gana el del canal, y el orden entre proveedores es 7TV, BTTV, FFZ. En los mensajes de Kick, 7TV usa el set de emotes vinculado a la cuenta de Kick del canal. Si en 7TV solo tienes vinculada tu cuenta de Twitch, los mensajes de Kick también usan ese set. Los emotes de un proveedor que desactives se quedan como texto.',
      },
      filters: {
        title: '¿Cómo se ocultan los bots y los comandos?',
        bots: 'Ocultar bots quita los mensajes de cuentas de bots conocidas: Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, Sery_Bot, SoundAlerts, StreamlootsBot, KofiStreamBot, PokemonCommunityGame, OWN3D, Blerp, BotRix, KickBot, Kicklet y Senchabot. También se ocultan las cuentas con la insignia "Bot de chat" en Twitch o "Bot" en Kick.',
        commands:
          'Ocultar comandos oculta todos los mensajes que empiezan con "!", así comandos como `!discord` o `!uptime` no salen en tu pantalla. Para ocultar también lo que responde el bot a un comando, activa los dos ajustes.',
        highlights:
          'Para hacer lo contrario y que ciertos mensajes destaquen, usa Resaltados. Los cinco vienen desactivados, así que activa solo los que quieras: mensajes que mencionan a tu canal o te responden, la línea encima de una respuesta que muestra a quién se responde, primeros mensajes en el chat, anuncios y mensajes enviados con Destacar mi mensaje. Los tres últimos son solo de Twitch, porque Kick no envía esa información.',
      },
      horizontal: {
        title: '¿Cómo se pone el chat como una barra en la parte de abajo de la pantalla?',
        p1: 'Pon Orientación en Horizontal. Los mensajes se alinean uno al lado del otro, el más nuevo aparece a la derecha y los más viejos se deslizan hacia la izquierda fuera de la caja.',
        p2: 'El tamaño sugerido de 400 × 600 es para uso vertical. Para una barra horizontal, pon el ancho de la fuente en el largo de la barra y el alto en una sola línea de mensajes, y coloca la fuente en la parte de abajo de la pantalla.',
      },
      others: {
        title: '¿Qué otros widgets escuchan las dos plataformas a la vez?',
        p1: '[Muro de Emotes](/setup/emote-wall), [Sub Sprout](/setup/sub-growing-plant), [Subathon Timer](/setup/subathon-timer), [Alertas de Stream](/setup/stream-alerts), [Meta de Subs](/setup/sub-goal) y [Encuesta de Chat](/setup/chat-poll) también aceptan los dos canales en una URL. Muro de Emotes hace volar por la pantalla los mensajes de solo emotes de los dos chats. Sub Sprout crece con las suscripciones de las dos plataformas, incluidas las subs regaladas en Kick. Subathon Timer suma tiempo por subs, subs regaladas, Bits y Kicks de los dos chats. Alertas de Stream muestra una alerta por subs, subs regaladas, Bits, Kicks y raids de las dos. Meta de Subs suma las subs y las subs regaladas de los dos chats en un solo conteo. Encuesta de Chat junta los votos de los dos chats en un solo resultado.',
        p2: '[Sorteo](/setup/raffle), en cambio, funciona en una plataforma a la vez: Twitch o Kick.',
      },
      ctaTitle: 'Configurar Caja de Chat',
      ctaText:
        'Escribe los nombres de tus canales, copia la URL y añádela a OBS. Sin iniciar sesión y sin descargas.',
      ctaSecondary: 'Echa un vistazo a Muro de Emotes',
    },
    raffle: {
      title: 'Cómo hacer un sorteo en el chat de Twitch o Kick',
      short: 'Hacer un sorteo en el chat',
      summary:
        'Entrar con !join, sorteos solo para suscriptores, límites de victorias, duración mínima y mostrar al ganador en el stream con confeti, todo con la herramienta Sorteo.',
      lead: 'Con la herramienta Sorteo, los espectadores entran escribiendo una palabra clave en el chat y tú sacas al ganador con un clic. La palabra clave por defecto es `!join`. Sin iniciar sesión; los participantes y los ganadores se guardan en tu propio navegador.',
      start: {
        title: '¿Cómo se empieza un sorteo?',
        step1:
          'Abre la [página de Sorteo](/setup/raffle) y elige la plataforma: Twitch o Kick. Un sorteo funciona en una sola plataforma.',
        step2: 'Escribe el nombre del canal. Los participantes se leen del chat de ese canal.',
        step3:
          'Define la Palabra clave. Por defecto es `!join`, y puedes cambiarla por la palabra que quieras.',
        step4:
          'Elige tus reglas y pulsa Iniciar sorteo. El botón se queda desactivado mientras la palabra clave esté vacía.',
        step5:
          'Quienes entran aparecen en la lista. Cuando tengas suficientes participantes, pulsa Sacar ganador.',
        p1: 'La configuración se bloquea al empezar el sorteo, para que las reglas no cambien a mitad. Para cerrar la entrada, pulsa Cerrar inscripciones; después todavía puedes sacar un ganador. Empezar un sorteo nuevo borra la lista de participantes, así que la página te pide confirmarlo antes.',
      },
      entry: {
        title: '¿Cómo entran los espectadores al sorteo?',
        p1: 'Los espectadores escriben la palabra clave en el chat. Da igual si usan mayúsculas, y el mensaje puede seguir siempre que empiece con la palabra clave: `!join` y `!join suerte` cuentan, `hola !join` no.',
        p2: 'Cada persona entra una vez. Escribir el comando otra vez no le da una segunda oportunidad.',
        p3: 'Los bots conocidos no pueden entrar: Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, BotRix, SoundAlerts, Blerp, Kofi_Stream_Bot y Senchabot. Para quitar a alguien de la lista a mano, haz clic en el botón ✕ junto a su nombre.',
      },
      rules: {
        title: '¿Qué reglas puedes poner?',
        caption: 'Reglas del sorteo, opciones y valores por defecto',
        colRule: 'Regla',
        colOptions: 'Opciones',
        colDefault: 'Por defecto',
        subsOnly: 'Solo suscriptores',
        subsOnlyOptions: 'Activado o desactivado',
        subsOnlyDefault: 'Desactivado',
        minMonths: 'Meses mínimos de sub',
        minMonthsOptions: '1 o más, solo con Solo suscriptores activado',
        minMonthsDefault: '1',
        maxWins: 'Máx. de victorias por espectador',
        maxWinsOptions: 'De 1 a 5, o ilimitado',
        maxWinsDefault: '1',
        minDuration: 'Duración mínima',
        minDurationOptions: 'De 0 a 300 segundos',
        minDurationDefault: '15 segundos',
        subsText:
          'Con Solo suscriptores activado, nadie sin insignia de suscriptor puede entrar. El streamer también cuenta como suscriptor, así que puedes entrar en tu propio sorteo siempre que Meses mínimos de sub esté en 1. Con 1, puede entrar cualquier suscriptor; si lo pones en 6, solo entran quienes llevan al menos 6 meses suscritos. Tanto en Twitch como en Kick, los meses de sub se leen de la insignia de suscriptor del espectador.',
        winsText:
          'Un ganador sale de la lista de participantes y pasa a la lista de ganadores. Si el límite es 1, no puede volver a ganar en el mismo sorteo. Si el límite es mayor o ilimitado, puede volver a entrar escribiendo otra vez la palabra clave.',
        durationText:
          'El botón Sacar ganador se queda bloqueado hasta que pasa este tiempo desde el inicio del sorteo, y muestra los segundos que faltan. Así los espectadores que llegan tarde también tienen tiempo de entrar.',
        fairText:
          'El ganador se saca entre los participantes válidos con el generador seguro de números aleatorios del navegador (`crypto.getRandomValues`).',
      },
      storage: {
        title: '¿Pierdo el sorteo si recargo la página?',
        p1: 'No. La configuración, los participantes y los ganadores se guardan en el almacenamiento local del navegador (localStorage). Aunque recargues o cierres y vuelvas a abrir la página, sigues justo donde lo dejaste.',
        p2: 'Estos datos solo viven en ese navegador, así que no aparecen en otro equipo ni en otro navegador. Con la página cerrada no se lee el chat, así que los comandos escritos mientras tanto no cuentan. Para empezar de cero, usa Reiniciar todo; también puedes borrar solo los participantes o solo los ganadores.',
      },
      overlay: {
        title: '¿Cómo se muestra al ganador en el stream?',
        p1: 'Añade a OBS la URL del overlay de ganador de la página de Sorteo (`/widgets/raffle-overlay`) como fuente de navegador de 1920 × 1080. Cuando pulsas Sacar ganador, el overlay muestra el nombre del ganador en el centro de la pantalla, sale confeti de los dos lados durante 3 segundos y el nombre desaparece a los 10 segundos.',
        warnTitle: 'Pruébalo siempre antes de empezar el directo',
        warn: 'El ganador llega al overlay a través de BroadcastChannel, que solo funciona dentro del mismo navegador. Si abres la página de Sorteo en un navegador aparte como Chrome y añades el overlay a OBS, los dos funcionan en programas distintos y el ganador nunca llega a OBS. Antes de empezar el directo, haz un sorteo de prueba y comprueba que el ganador aparece en OBS.',
        p2: 'Mantén activa la escena con el overlay y deja "Apagar fuente cuando no sea visible" desactivado en la fuente; una fuente apagada no recibe al ganador. Los detalles están en la [guía de OBS](/guides/obs-browser-source). El ganador siempre aparece con confeti también en la página de Sorteo, así que puedes leer el nombre ahí aunque el overlay no funcione.',
      },
      ctaTitle: 'Prepara tu sorteo',
      ctaText:
        'Elige la plataforma, escribe tu canal y define la palabra clave. En un minuto tienes listo tu primer sorteo.',
    },
    bridge: {
      title: 'Cómo dejar que tus mods cambien escenas de OBS desde el chat',
      short: 'Cambiar escenas desde el chat',
      summary:
        'Activar WebSocket para OBS Bridge, los comandos del chat, cómo encuentra !scene una escena y quién puede usar los comandos.',
      lead: 'OBS Bridge escucha el chat de Twitch o Kick y pasa a OBS, en tu equipo, los comandos de las personas que autorices. Activa el servidor WebSocket en OBS, escribe tu canal y los usuarios autorizados en la página de configuración y deja abierta la URL de la herramienta que obtienes. Cuando un mod escribe `!scene game`, OBS cambia a una escena que tenga "game" en el nombre.',
      websocket: {
        title: '¿Cómo se activa WebSocket en OBS?',
        step1: 'En OBS, abre Herramientas → Ajustes del servidor WebSocket en el menú de arriba.',
        step2: 'Marca la casilla Habilitar servidor WebSocket.',
        step3:
          'Si la autenticación está activada, haz clic en Mostrar información de conexión y copia la contraseña.',
        step4: 'Haz clic en Aceptar.',
        p1: 'OBS Bridge habla con obs-websocket 5, que viene integrado en OBS Studio 28 y posteriores. Por defecto se conecta a `ws://127.0.0.1:4455`; si OBS está en el mismo equipo, deja vacío el campo URL de WebSocket. Si OBS está en otro equipo, escribe la dirección y el puerto de ese equipo, por ejemplo `ws://192.168.1.20:4455`. Si no puede conectarse, la herramienta lo vuelve a intentar cada 5 segundos.',
      },
      setup: {
        title: '¿Cómo se configura OBS Bridge?',
        step1: 'Abre la [página de configuración de OBS Bridge](/setup/obs-bridge).',
        step2: 'Escribe el canal de Twitch, el de Kick o los dos que quieres que escuche.',
        step3: 'Añade Usuarios autorizados. Más abajo se explica a quién añadir.',
        step4: 'Escribe tu contraseña de OBS WebSocket y cambia la URL de WebSocket si hace falta.',
        step5:
          'Copia la URL de la herramienta y ábrela en una pestaña del navegador o como panel de navegador personalizado en OBS.',
        step6:
          'La página de la herramienta muestra tus escenas de OBS. Haz clic en los botones Principal y BRB junto a las escenas que quieras usar como principal y BRB.',
        p1: 'Si no eliges ninguna, busca escenas llamadas `Main Scene` para la principal y `BRB Scene` para BRB. Lo que eliges se guarda en la URL de la página de la herramienta, así que copia la URL otra vez después de elegir y guárdala en algún lado. La próxima vez que la abras, se cargan las mismas escenas.',
      },
      commands: {
        title: '¿Qué comandos de chat hay?',
        caption: 'Comandos de chat por defecto de OBS Bridge',
        colCommand: 'Comando',
        colAction: 'Qué hace',
        sceneArg: '<nombre de escena>',
        scene: 'Cambia a la escena cuyo nombre coincide',
        brb: 'Cambia a la escena BRB',
        back: 'Cambia a la escena principal',
        stream: 'Inicia / detiene el stream',
        record: 'Inicia / detiene la grabación',
        p1: '`brb` y `back` se escriben sin signo de exclamación. Los comandos ignoran las mayúsculas, pero el mensaje entero tiene que ser el comando: `brb` funciona, `brb 5 min` no. Puedes cambiar el nombre de cualquier comando en Comandos, en la página de configuración, por ejemplo `!switch` en lugar de `!scene`.',
        p2: 'El comando para detener el stream termina tu stream de verdad. Mantén corta la lista de autorizados.',
      },
      matching: {
        title: '¿Cómo encuentra el comando !scene la escena correcta?',
        p1: 'Primero busca una coincidencia exacta: `!scene game` cambia a la escena llamada exactamente "Game", sin importar mayúsculas. Si no hay coincidencia exacta, elige la primera escena que tenga esa palabra en el nombre: `!scene chatting` encuentra la escena "Just Chatting". Si ninguna escena coincide, no pasa nada.',
        p2: 'Si más de una escena contiene la misma palabra, gana la que esté más arriba en tu lista de Escenas. Con escenas de nombres parecidos, lo más seguro es escribir el nombre completo. Cuando añades o renombras una escena, la lista se actualiza sola.',
      },
      users: {
        title: '¿Quién puede usar los comandos?',
        p1: 'Solo las personas de la lista de Usuarios autorizados. Si la lista está vacía, nadie puede usar comandos, ni siquiera el streamer, así que también tienes que añadir tu propia cuenta.',
        p2: 'Cada usuario se añade con una plataforma y aparece en la URL como `commandUser=twitch:bob,kick:alice`. Un mensaje solo cuenta como comando si coinciden la plataforma y el nombre. Así, aunque alguien en Kick se quede con el nombre de un mod de Twitch, no puede cambiar escenas.',
        p3: 'Los nombres viejos guardados sin plataforma (solo `bob`) funcionan en esa plataforma si la URL tiene una sola plataforma. Con las dos plataformas activas, esos nombres se marcan en amarillo en la página de la herramienta y no pueden usar comandos hasta que les elijas una plataforma.',
      },
      open: {
        title: '¿La página de la herramienta tiene que quedarse abierta?',
        p1: 'Sí. La página de la herramienta es la que lee el chat y pasa los comandos a OBS. Si cierras la pestaña, los comandos dejan de funcionar. Deja la herramienta abierta en una pestaña o como panel en OBS durante todo el stream; si se cae la conexión con OBS, la herramienta intenta reconectarse cada 5 segundos.',
      },
      security: {
        title: '¿Por qué tienes que tratar la URL de la herramienta como una contraseña?',
        p1: 'Porque tu contraseña de OBS WebSocket va dentro de la URL (el parámetro `obsWebsocketPassword`). Compartir la URL es compartir tu contraseña. No la muestres en el stream, no la pongas en el chat y oculta la barra de direcciones cuando compartas pantalla.',
        p2: 'La conexión con OBS va directa de tu navegador a OBS. La página de la herramienta se carga desde extensions.senchabot.com como cualquier web, así que la dirección completa, contraseña incluida, viaja con esa petición.',
      },
      ctaTitle: 'Configurar OBS Bridge',
      ctaText:
        'Escribe tu canal y los usuarios autorizados y abre la URL de la herramienta. Los comandos de escena funcionan al momento.',
    },
    subathon: {
      title: 'Cómo montar un subathon timer en Twitch y Kick',
      short: 'Montar un subathon timer',
      summary:
        'Cuánto tiempo suma cada sub, regalo, cheer de Bits y regalo de Kicks, cómo arrancarlo con !subathon, los comandos de los mods y qué pasa cuando OBS se cierra o se acaba el tiempo.',
      lead: 'Subathon Timer es una cuenta regresiva que las subs van alargando. Pon un tiempo inicial y cuánto suma cada sub, sub regalada, cheer de Bits y regalo de Kicks, añade la URL a OBS como fuente de navegador de 800 × 300 y escribe `!subathon start` en el chat cuando empieces el directo. Sin iniciar sesión: lee tu chat público de Twitch y Kick.',
      setup: {
        title: '¿Cómo se configura un subathon timer?',
        step1: 'Abre la [página de configuración de Subathon Timer](/setup/subathon-timer).',
        step2: 'Elige Twitch, Kick o Ambas y escribe solo los nombres de canal.',
        step3: 'Pon el Tiempo inicial, 1 hora por defecto, y un Límite de tiempo si quieres.',
        step4:
          'Define cuánto tiempo suman una sub, una sub regalada, los Bits y los Kicks. Con Ambas, Twitch y Kick tienen cada uno su pestaña.',
        step5:
          'Elige un estilo y un color, copia la URL y añádela a OBS como fuente de navegador a 800 × 300.',
        p1: 'La vista previa de la página de configuración reproduce subs, regalos y cheers simulados a velocidad 60×, así que un timer de una hora se acaba en más o menos un minuto. Puedes poner la velocidad entre 1× y 300×. Los botones de Pruébalo suman una sub, un regalo de 5 o 500 Bits/Kicks, quitan 10 minutos, pausan y reinician. Solo cambian la vista previa, nunca el timer de OBS.',
      },
      values: {
        title: '¿Cuánto tiempo suma cada sub?',
        intro:
          'Tú eliges el tiempo en minutos enteros, de 0 a 60, y 0 desactiva ese evento. Twitch y Kick tienen valores separados, todos en 1 minuto por defecto. Mostrar en el timer, activado por defecto, los muestra en el timer, como Sub +1 min, para que los espectadores sepan cuánto suma su sub. Cuando Twitch y Kick suman tiempos distintos, se van turnando.',
        caption: 'Tiempo que suma cada evento al subathon timer',
        colEvent: 'Evento',
        colDefault: 'Por defecto',
        colHow: 'Cómo cuenta',
        oneMinute: '1 min',
        sub: 'Sub',
        subHow: 'Cada sub nueva y cada resub. En Twitch una sub de Prime cuenta como Nivel 1.',
        gift: 'Sub regalada',
        giftHow: 'Cada sub del regalo, así que un regalo de 5 suma cinco veces más.',
        bits: '500 Bits o 500 Kicks',
        bitsHow: 'Otras cantidades suman su parte: con 1 minuto, 100 Bits suman 12 segundos.',
        tiers:
          'Con Nivel 2 y 3 cuentan más activado, que es lo predeterminado, una sub o un regalo de Nivel 2 en Twitch suma el doble de tiempo y uno de Nivel 3 cinco veces, según su precio. Las subs de Kick no tienen niveles, así que cada una cuenta una vez.',
        cap: 'El Límite de tiempo es el máximo de tiempo que puede tener el timer. Lo que lo superaría no se suma, y no se muestra ningún +tiempo por ello. Con Sin límite, que es lo predeterminado, el timer sigue creciendo mientras sigan llegando subs.',
      },
      start: {
        title: '¿Cómo se arranca el subathon?',
        p1: 'Por defecto el timer espera en pausa hasta que tú o un mod escriben `!subathon start` en el chat. Así puedes añadir la fuente antes del stream y arrancar el reloj cuando ya estés en directo. Si eliges De inmediato en Inicio, el timer arranca en cuanto la fuente carga en OBS.',
        p2: 'Las subs que llegan antes del inicio también suman tiempo, y lo mismo las que llegan con el timer en pausa. El tiempo te espera ahí cuando arranca el reloj.',
      },
      commands: {
        title: '¿Qué comandos de chat pueden usar los mods?',
        caption: 'Comandos de chat de Subathon Timer',
        colCommand: 'Comando',
        colAction: 'Qué hace',
        start: 'Arranca el timer, o lo reanuda después de una pausa',
        pause: 'Lo pausa; el tiempo restante se queda como está',
        add: 'Suma tiempo, hasta el Límite de tiempo',
        remove: 'Quita tiempo, hasta llegar a cero',
        set: 'Fija el tiempo restante',
        reset: 'Vuelve a empezar desde el Tiempo inicial',
        p1: 'Solo el streamer y los moderadores pueden usarlos, en Twitch y en Kick. Los VIP y los espectadores no. El timer no responde en el chat; ves el resultado en el propio timer.',
        p2: 'Escribe los tiempos como `10m`, `45s`, `1h30m` o `1:30:00`. Un número solo son minutos, así que `!subathon add 15` suma 15 minutos. Las unidades son de una sola letra: `10min` no funciona, `10m` sí.',
      },
      look: {
        title: '¿Qué estilos y colores hay?',
        bar: 'Barra de vida (por defecto): una barra de videojuego que se vacía desde el 100% hasta cero.',
        clock: 'Reloj: números grandes en horas, minutos y segundos.',
        ring: 'Anillo: un círculo que se vacía a medida que se acaba el tiempo.',
        p1: 'El color por defecto, Vida, pasa de verde a ámbar y a rojo a medida que queda poco tiempo. También puedes elegir un color fijo: verde, morado, rojo, dorado, cian o rosa. El título junto al timer dice SUBATHON por defecto; cámbialo por lo que quieras de hasta 32 caracteres, o déjalo vacío para ocultarlo.',
        p2: 'Mostrar porcentaje muestra qué tan lleno está el timer. El 100% es el máximo de tiempo que ha tenido el timer hasta ahora, así que nunca pasa del 100%: cuando se suma tiempo a una barra llena, la barra sigue llena y cuenta hacia atrás desde el nuevo máximo. Mostrar tiempo sumado hace subir un +1:00 con el nombre del espectador encima del timer cada vez que se suma tiempo.',
      },
      saved: {
        title: '¿Qué pasa si OBS se cierra o la fuente se recarga?',
        p1: 'El timer se guarda dentro de OBS, así que después de una recarga o de reiniciar OBS vuelve donde estaba. Mientras OBS está cerrado sigue contando hacia atrás, como una fecha límite real.',
        p2: 'Nada lee tu chat mientras OBS o la fuente están apagados, así que las subs de ese rato no suman nada. Un mod puede sumarlas después con `!subathon add`. Por eso también "Apagar fuente cuando no sea visible" debe quedarse desactivado; la [guía de OBS](/guides/obs-browser-source) lo explica.',
        p3: 'El timer guardado pertenece a ese OBS y a esos canales. Si cambias los canales en la URL, por ejemplo añadiendo Kick a mitad del subathon, o abres la URL en otro OBS o en una pestaña del navegador, empieza un timer nuevo.',
      },
      zero: {
        title: '¿Qué pasa cuando el timer llega a cero?',
        p1: 'Se detiene en 00:00:00 y parpadea en rojo, y los estilos Barra de vida y Anillo muestran K.O. Las subs nuevas ya no suman tiempo, así que el subathon se acabó.',
        p2: 'Para seguir, un mod escribe `!subathon add` o `!subathon set` con un tiempo, y el timer vuelve a correr al momento. Para empezar un subathon nuevo, escribe `!subathon reset`.',
      },
      change: {
        title: '¿Cómo cambias el timer o empiezas un subathon nuevo?',
        p1: 'Pega tu URL actual en el campo URL del widget de la página de configuración. Vuelven tus canales y tu configuración; cambia lo que quieras, copia la URL nueva y pégala encima de la vieja en OBS. Los nuevos valores de tiempo y un nuevo Límite de tiempo se aplican en cuanto OBS carga la URL nueva, y el tiempo restante se queda como estaba.',
        p2: 'Un Tiempo inicial nuevo se aplica solo hasta que el timer arranca por primera vez. Después, escribe `!subathon reset` en el chat para empezar de nuevo desde el Tiempo inicial nuevo. Si Inicio está en el comando, el timer vuelve a esperar en pausa hasta `!subathon start`.',
      },
      notCounted: {
        title: '¿Qué no suma tiempo?',
        follows:
          'Los follows y las donaciones. Twitch y Kick no muestran los follows nuevos a una página sin sesión iniciada, y ninguna de las dos plataformas tiene donaciones propias.',
        raids: 'Los raids, en ninguna de las dos plataformas.',
        resubs:
          'Las resubs de Twitch que el espectador no comparte. Twitch solo avisa al chat de una resub cuando el espectador la comparte. Kick envía las renovaciones como subs, así que esas sí cuentan.',
        bits: 'Los Bits gastados fuera del chat, como los Power-ups. Solo cuentan los Bits enviados como cheer en el chat.',
        sharedChat:
          'Las subs y los cheers de un canal compañero durante una sesión de Chat compartido de Twitch. Solo cuenta tu propio canal.',
      },
      ctaTitle: 'Configura tu subathon timer',
      ctaText: 'Pon el tiempo inicial y lo que suma cada sub, copia la URL y añádela a OBS.',
    },
    poll: {
      title: 'Cómo hacer una encuesta en el chat de Twitch y Kick',
      short: 'Hacer una encuesta en el chat',
      summary:
        'Lanzar una encuesta con !poll, las formas de votar, un voto por espectador, el retraso del stream y qué pasa cuando se acaba el tiempo o se cierra OBS.',
      lead: 'Encuesta de Chat pone en tu stream una encuesta en la que el chat de Twitch y Kick vota escribiendo un número. Añade la URL a OBS como fuente de navegador de 640 × 560 y luego tú o un mod escriben `!poll Question | A | B` en el chat. Sin iniciar sesión y sin bot: lee tu chat público.',
      setup: {
        title: '¿Cómo se configura una encuesta de chat?',
        step1: 'Abre la [página de configuración de Encuesta de Chat](/setup/chat-poll).',
        step2: 'Elige Twitch, Kick o Ambas y escribe solo los nombres de canal.',
        step3:
          'Si quieres una encuesta lista antes del stream, escribe una pregunta y de 2 a 6 opciones en Encuesta preparada. Se lanza con `!poll start`.',
        step4:
          'Define la Duración de la encuesta (1 minuto por defecto), cuánto tiempo se quedan los resultados en pantalla y quién puede votar.',
        step5:
          'Elige un color, una posición y el idioma de la encuesta, copia la URL y añádela a OBS como fuente de navegador a 640 × 560.',
        p1: 'La vista previa de la página de configuración reproduce una encuesta con votantes simulados, más rápido que en tiempo real, y luego empieza la siguiente. Los botones de Pruébalo suman 10 votos, suman 30 segundos, terminan la encuesta y empiezan una nueva. Solo cambian la vista previa, nunca la encuesta de OBS.',
      },
      commands: {
        title: '¿Cómo se lanza una encuesta desde el chat?',
        intro:
          'Solo el streamer y los moderadores pueden lanzar encuestas, en Twitch y en Kick. Los VIP y los espectadores no: si un espectador escribe `!poll`, no cambia nada.',
        caption: 'Comandos de chat de Encuesta de Chat',
        colCommand: 'Comando',
        colAction: 'Qué hace',
        question: 'Pregunta',
        new: 'Lanza una encuesta nueva con 2 a 6 opciones, con la Duración de la encuesta de la URL',
        newTime: 'Lo mismo, con su propia duración: 90s, 2m, 1m30s o 1:30',
        yesNo: 'Lanza una encuesta rápida con Sí y No como opciones',
        start: 'Lanza la encuesta preparada que está guardada en la URL',
        extend: 'Suma tiempo a una encuesta abierta que tiene tiempo límite',
        end: 'Cierra la votación ya; el ganador aparece después del Retraso del stream',
        cancel: 'Quita la encuesta de la pantalla, resultados incluidos',
        p1: 'Separa la pregunta y las opciones con `|`. Las opciones a partir de la séptima se descartan, igual que las repetidas, aunque cambien las mayúsculas. La pregunta puede tener hasta 80 caracteres y cada opción hasta 30. Una encuesta nueva reemplaza a la que está en pantalla.',
        p2: 'Una palabra de comando necesita los argumentos correctos: `!poll extend 30 seconds` no hace nada en lugar de lanzarlo como pregunta. Un número solo antes de la pregunta no se lee como duración, así que `!poll 3 or 4 games? | 3 | 4` conserva su pregunta. La encuesta no responde en el chat; ves el resultado en pantalla.',
      },
      voting: {
        title: '¿Cómo votan los espectadores?',
        number: 'El número de la opción solo, como `2`.',
        command: '`!vote 2` o `!2`, para los espectadores acostumbrados a las encuestas de bots.',
        text: 'La opción misma: `speedrun` vota por Speedrun, con mayúsculas o minúsculas y con o sin tildes.',
        p1: 'El mensaje entero tiene que ser el voto. `2 porfa`, `4Head` o `1 partida más` no cuentan, así que el chat normal nunca se convierte en votos. Cuando una opción es en sí un número, gana su texto: en una encuesta de `3 | 4 | 5`, escribir 3 vota por la opción 3, no por la tercera opción.',
        p2: 'El comando `/vote` de Twitch es para las encuestas nativas de Twitch, así que dile al chat que escriba el número. La encuesta muestra una pista como "Escribe de 1 a 3 en el chat" debajo de sus opciones.',
      },
      rules: {
        title: '¿Un espectador puede votar más de una vez?',
        p1: 'No. Cada cuenta de Twitch o Kick cuenta una vez. Con Se puede cambiar el voto activado, que es lo predeterminado, un número nuevo mueve el voto; desactívalo y el primer voto es definitivo. Un voto por una opción que no existe nunca le quita a un espectador el voto que ya tenía.',
        p2: 'Con Quién puede votar en Suscriptores, solo pueden votar los espectadores con insignia de sub o de fundador, y tú. Si vota todo el mundo, Un voto de sub cuenta hace que el voto de un sub cuente 2 o 3 veces. La encuesta lo indica en pantalla, y los porcentajes usan esos votos ponderados.',
        p3: 'Si un mod le da timeout o banea a una cuenta mientras la encuesta acepta votos, su voto se quita, lo que ayuda a deshacer una oleada de bots de spam.',
      },
      timing: {
        title: '¿Qué pasa cuando se acaba el tiempo?',
        p1: 'Los espectadores ven tu stream unos segundos por detrás del chat, así que cuando su pantalla marca 1 segundo, la encuesta ya se cerró en el chat. Los votos siguen contando durante el Retraso del stream después de que termina el tiempo, 5 segundos por defecto, mientras la encuesta muestra Últimos votos. Ajústalo a lo retrasados que vayan tus espectadores; Twitch y Kick suelen ir de 2 a 10 segundos por detrás.',
        p2: 'Después el ganador se ilumina en dorado con una corona y las otras opciones se atenúan. Cuando dos o más opciones empatan con más votos, la encuesta lo marca como empate. Los resultados se quedan durante Resultados en pantalla, 30 segundos por defecto, y luego la encuesta se desvanece. Ponlo en 0 para dejarlos hasta la siguiente encuesta o hasta `!poll cancel`.',
        p3: 'Con Duración de la encuesta en 0 la encuesta no tiene tiempo límite y sigue abierta hasta que un mod escribe `!poll end`. `!poll extend` solo suma tiempo a una encuesta que tiene tiempo límite.',
      },
      look: {
        title: '¿Cómo puedes cambiar su aspecto?',
        blind:
          'Ocultar resultados hasta el final: las barras se quedan ocultas mientras la votación está abierta y solo se ve el número de votos, para que los primeros votos no influyan en el resto.',
        color: 'Color: morado (por defecto), verde, rojo, dorado, cian o rosa.',
        position:
          'Posición: la encuesta se coloca arriba o abajo de la fuente de navegador y crece desde ahí según el número de opciones.',
        language:
          'Idioma de la encuesta: inglés, español, francés, alemán, japonés, portugués o turco para las palabras de la encuesta, como Resultados y el Sí y No de una encuesta rápida.',
        p1: 'Con las dos plataformas activas, la encuesta muestra cuántos votos vinieron de Twitch y cuántos de Kick junto al total. La fuente es transparente, así que en el stream solo se ve la tarjeta de la encuesta.',
      },
      saved: {
        title: '¿Qué pasa si OBS se cierra o la fuente se recarga?',
        p1: 'La encuesta y sus votos se guardan dentro de OBS, así que una recarga o un reinicio de OBS la trae de vuelta donde estaba. El tiempo sigue corriendo mientras OBS está cerrado.',
        p2: 'Nada lee tu chat mientras OBS o la fuente están apagados, así que los votos escritos en ese rato no se cuentan. Por eso "Apagar fuente cuando no sea visible" debe quedarse desactivado; la [guía de OBS](/guides/obs-browser-source) lo explica. La encuesta guardada pertenece a ese OBS y a esos canales.',
      },
      limits: {
        title: '¿Qué no puede hacer Encuesta de Chat?',
        chat: 'Escribir en el chat. Solo lee el chat, así que nunca anuncia ahí la encuesta ni al ganador; la encuesta en el stream muestra las dos cosas.',
        native:
          'Mostrar las encuestas propias de Twitch o Kick. Las de Twitch no se pueden leer sin iniciar sesión, así que para funcionar igual en las dos plataformas los votos vienen del chat.',
        points:
          'Aceptar votos con Puntos de canal o Bits. Cada espectador tiene un voto, o 2 o 3 si es sub y lo activas.',
        multiple: 'Opción múltiple. Cada espectador elige una sola opción.',
      },
      ctaTitle: 'Configura tu encuesta de chat',
      ctaText:
        'Mete una encuesta preparada y las reglas de votación en una URL, añádela a OBS y escribe !poll en el chat.',
    },
    frames: {
      title: 'Cómo poner un marco a tu cámara, tu chat y tu pantalla en OBS',
      short: 'Añadir marcos al stream',
      summary:
        'Añadir marcos de cámara, chat y pantalla a OBS, el orden de las fuentes, encajar tu cámara en el marco y elegir un preset y las animaciones.',
      lead: 'Marcos de Stream pone un marco listo alrededor de tu cámara, tu chat o toda tu pantalla de stream, con el estilo del preset que elijas. Elige la pieza y el preset en la página de configuración, añade la URL a OBS como fuente de navegador y colócala sobre tu cámara o tu chat. El centro del marco es transparente, y no hay canal que conectar ni que iniciar sesión.',
      setup: {
        title: '¿Cómo se configura un marco para el stream?',
        step1: 'Abre la [página de configuración de Marcos de Stream](/setup/stream-frames).',
        step2:
          'En ¿Qué vas a enmarcar?, elige Cámara, Chat o Pantalla. Si elegiste Cámara, pon Orientación en Horizontal o Vertical. Cada pieza es su propia fuente de navegador, así que añade las tres si quieres.',
        step3:
          'Elige un preset. Con Clásico eliges tú el color. Los otros presets traen sus propios colores, fuente y arte.',
        step4:
          'Escribe el nombre de tu canal o la palabra que quieras en el campo Etiqueta. En la cámara y el chat aparece en la pestaña encima del marco, y en la pantalla aparece en la placa de abajo.',
        step5:
          'Copia la URL y añádela a OBS como fuente de navegador: 640 × 360 para una cámara (360 × 640 para una cámara vertical), 420 × 720 para el chat, 1920 × 1080 para la pantalla.',
        p1: 'La vista previa muestra el marco con la silueta de una persona o líneas de chat de ejemplo. Son solo de relleno. En el stream el centro del marco está vacío.',
      },
      layers: {
        title: '¿Por qué el marco queda detrás de mi cámara?',
        p1: 'En OBS, lo que está más arriba en la lista de Fuentes queda delante en la escena. Sube la fuente del marco por encima de tu cámara (Dispositivo de captura de video) o de la Caja de Chat. También puedes hacer clic derecho en la fuente y elegir Ordenar → Mover a la cima.',
        p2: 'Para mover la cámara y el marco juntos, selecciona los dos, haz clic derecho y elige Agrupar los elementos seleccionados. Cuando cambias el tamaño del grupo, los dos se escalan juntos.',
        p3: 'El marco de pantalla debe quedar delante de toda la escena. Ponlo arriba del todo en la lista para que tu juego y las demás fuentes queden debajo.',
      },
      fit: {
        title: '¿Cómo encajas tu cámara en el marco?',
        intro:
          'La abertura del centro del marco es un poco más pequeña que su borde exterior. Tu cámara debe llenar la abertura pero quedarse dentro del borde exterior, o lo que sobra se ve alrededor del marco. Con los tamaños recomendados, estos encajan bien:',
        caption: 'Tamaños de marco recomendados y la fuente que va dentro',
        colPiece: 'Pieza',
        colFrame: 'Tamaño del marco',
        colInside: 'Fuente dentro',
        camera: 'Cámara horizontal',
        cameraPortrait: 'Cámara vertical',
        chat: 'Chat',
        screen: 'Pantalla',
        cameraInside: 'Cámara a 590 × 296, centrada en el marco',
        cameraPortraitInside: 'Cámara a 306 × 572, centrada en el marco',
        chatInside: 'Caja de Chat a 370 × 660, centrada en el marco',
        screenInside: 'El juego o la captura de pantalla llena toda la escena',
        p1: 'Una cámara 16:9 escalada a 590 de ancho mide 332 de alto, así que recorta arriba y abajo por igual hasta que mida 296. Mantén pulsado Alt (Option en Mac) y arrastra los bordes de arriba y abajo de la fuente, o haz clic derecho en la cámara y usa los campos de Recorte en Transformar → Editar transformación. Con una cámara vertical es al revés: una cámara 9:16 escalada a 572 de alto mide 322 de ancho, así que recorta izquierda y derecha por igual hasta que mida 306.',
        p2: 'Si usas un marco más grande, estos tamaños se escalan con él: en un marco de cámara de 1280 × 720 la cámara mide 1180 × 592. Para una cámara cuadrada, pon el ancho y el alto de la fuente de navegador a juego y el marco se dibuja con esa forma.',
      },
      look: {
        title: '¿Qué cambian el preset y las animaciones?',
        p1: 'El preset define la forma, el arte, los colores y la fuente del marco: un tejado de pagoda y borlas en Dynasty, ribetes dorados y gemas turquesa en Rift, bloques de césped y una hotbar en Blocks. Dale a tu Caja de Chat, tus Alertas de Stream y tu Meta de Subs el mismo preset y todo en pantalla combina.',
        p2: 'Con Animaciones activado, la luz recorre el marco, las líneas brillan y los farolillos, las antorchas o las chispas se mueven según el preset. Son ligeras. Aun así, si tu PC sufre mientras juegas, desactiva Animaciones. Eso añade `motion=0` a la URL y el marco se queda quieto.',
        p3: 'Todo el arte se dibujó desde cero, sin logos ni artwork de juegos.',
      },
      change: {
        title: '¿Cómo cambio el marco más adelante?',
        p1: 'Pega la URL de OBS en el campo URL del widget de la página de configuración y vuelve tu configuración. Cambia el preset, la pieza o la etiqueta, copia la URL nueva y pégala encima de la vieja en la fuente de navegador. Para cambiar el preset de todos tus widgets a la vez, usa la [página de Presets](/presets).',
      },
      ctaTitle: 'Configura tu marco',
      ctaText: 'Elige la pieza y el preset, mira la vista previa y copia la URL.',
    },
    countdown: {
      title: 'Cómo añadir una cuenta regresiva de inicio, BRB y cierre en OBS',
      short: 'Añadir una cuenta regresiva',
      summary:
        'Configurar una cuenta regresiva para tus escenas de inicio, pausa y cierre, hacer que vuelva a empezar en cada cambio de escena, contar hasta una hora del día y los comandos del chat.',
      lead: 'Cuenta Regresiva es un reloj para las tres escenas en las que todavía no pasa nada: empezamos pronto, vuelvo pronto y fin del stream. Elige la escena y una duración en la página de configuración, añade la URL a OBS como fuente de navegador de 1920 × 1080 y marca Actualizar el navegador cuando la escena se active para que vuelva a empezar cada vez que cambias a esa escena. Sin iniciar sesión, y sin canal salvo que quieras los comandos del chat.',
      setup: {
        title: '¿Cómo se configura una cuenta regresiva para el stream?',
        step1: 'Abre la [página de configuración de Cuenta Regresiva](/setup/stream-countdown).',
        step2:
          'En ¿Para qué es?, elige Inicio, Pausa o Cierre. Eso define el texto y el icono, y cada una es su propia fuente de navegador, así que puedes añadir las tres.',
        step3:
          'En Contar hasta, elige Una duración y pon los minutos, o elige Una hora del día y escribe una hora en formato 24 h como 21:00.',
        step4:
          'Elige un preset y, en Al llegar a cero, decide qué queda en pantalla cuando se acaba el tiempo: un mensaje, el reloj en 00:00 o nada.',
        step5:
          'Copia la URL y añádela a la escena en OBS como fuente de navegador, 1920 × 1080, así el reloj queda en el centro de tu escena.',
        p1: 'La vista previa de la página de configuración va rápido para que veas la cuenta regresiva entera en unos segundos. En el stream cuenta en tiempo real.',
      },
      restart: {
        title: '¿Por qué mi cuenta regresiva no vuelve a empezar?',
        p1: 'La cuenta regresiva empieza cuando se carga la fuente de navegador. Si la fuente se cargó al abrir OBS, lleva contando desde entonces, así que cuando cambias a tu escena BRB ya está en cero.',
        p2: 'Abre las propiedades de la fuente de navegador y marca "Actualizar el navegador cuando la escena se active". OBS recarga la página cada vez que cambias a esa escena, así que la cuenta regresiva empieza desde arriba en cada pausa.',
        p3: 'Con un canal puesto también puedes escribir `!countdown reset` en el chat, que la reinicia sin tocar OBS. Es el arreglo más rápido cuando ya estás lejos del teclado.',
      },
      clock: {
        title: '¿Cómo se cuenta hasta una hora del día?',
        p1: 'Elige Una hora del día y escribe la hora que anunciaste, p. ej. 21:00. La cuenta regresiva lee el reloj del equipo donde corre OBS, así que da igual cuándo se cargue la fuente: a las 18:30 muestra 2:30:00, y a las 20:55 muestra 05:00.',
        p2: 'Si la hora ya pasó hoy, apunta a la misma hora de mañana. Así una fuente que dejas abierta toda la noche está lista para el siguiente stream, y `!countdown reset` la vuelve a apuntar al próximo.',
        p3: 'Los espectadores de otros países ven tu cuenta regresiva, no su propio reloj, y esa es la idea: todos ven los mismos minutos restantes.',
      },
      commands: {
        title: '¿Los mods pueden cambiar la cuenta regresiva desde el chat?',
        p1: 'Sí, una vez que pones tu canal de Twitch o Kick en la página de configuración. Entonces tú y tus mods pueden usar estos comandos en cualquiera de los dos chats:',
        caption: 'Los comandos !countdown',
        colCommand: 'Comando',
        colDoes: 'Qué hace',
        addDoes: 'Suma 5 minutos; 90s y 1h30m también funcionan',
        removeDoes: 'Quita 2 minutos',
        setDoes: 'Fija el tiempo restante en 10 minutos',
        pauseDoes: 'Pausa el reloj donde está',
        startDoes: 'Lo vuelve a arrancar después de una pausa',
        resetDoes: 'Reinicia la cuenta regresiva desde arriba',
        sceneDoes:
          'Cambia la escena a pausa, inicio o cierre y fija la duración (10m si no la pones)',
        p2: 'Solo tú y tus mods pueden usarlos, en las dos plataformas, y una respuesta en el chat nunca ejecuta un comando. La cuenta regresiva lee tu chat público igual que los otros widgets, sin iniciar sesión.',
      },
      scenes: {
        title: '¿Qué cuenta regresiva va en cada escena?',
        p1: 'Inicio va en la escena que tienes puesta antes de empezar el directo, con una duración como 10 minutos o la hora que anunciaste. Pausa va en tu escena BRB con una duración más corta, normalmente 5 o 10 minutos. Cierre va en la última escena, para que el chat vea cuánto queda antes de que te despidas.',
        p2: 'Si cambias de escena desde el chat con [OBS Bridge](/setup/obs-bridge), tus mods pueden mandarte a la escena BRB y la cuenta regresiva empieza con ella.',
      },
      ctaTitle: 'Configura tu cuenta regresiva',
      ctaText: 'Elige la escena y la duración, mira la vista previa y copia la URL en OBS.',
    },
    alerts: {
      title: 'Cómo añadir alertas de subs, cheers y raids de Twitch y Kick en OBS',
      short: 'Añadir alertas al stream',
      summary:
        'Qué alertas tiene cada plataforma, temas y colores, cantidades mínimas, cómo llevar el sonido a OBS y por qué no hay alertas de follows.',
      lead: 'Alertas de Stream muestra una alerta animada con su propio sonido por cada sub, sub regalada, cheer de Bits, regalo de Kicks y raid en Twitch y Kick. Escribe los nombres de tus canales en la página de configuración, elige un tema y añade la URL a OBS como fuente de navegador de 800 × 450. Sin iniciar sesión, y una sola URL cubre las dos plataformas.',
      setup: {
        title: '¿Cómo se añaden alertas del stream a OBS?',
        step1: 'Abre la [página de configuración de Alertas de Stream](/setup/stream-alerts).',
        step2: 'Elige Twitch, Kick o Ambas y escribe solo los nombres de canal.',
        step3: 'Elige un tema y un color, y desactiva las alertas que no quieras.',
        step4:
          'Copia la URL y añádela a OBS como fuente de navegador a 800 × 450, y colócala donde quieras que salgan las alertas.',
        step5:
          'Activa Controlar audio vía OBS en las propiedades de la fuente para que el sonido salga en tu stream. Más sobre el sonido abajo.',
        p1: 'Entre alertas la fuente está vacía y transparente. Si abres la URL en una pestaña del navegador para comprobarla, verás una página en blanco hasta que pase algo en tu canal.',
        p2: 'Para cambiarla más adelante, pega tu URL actual en el campo URL del widget de la página de configuración. Vuelven tus canales y tu configuración; copia la URL nueva y pégala encima de la vieja en OBS.',
      },
      kinds: {
        title: '¿Qué alertas hay?',
        caption: 'Eventos de Alertas de Stream en Twitch y Kick',
        colAlert: 'Alerta',
        sub: 'Subs',
        subTwitch: 'Subs nuevas y resubs compartidas, con los meses y el mensaje',
        subKick:
          'Subs nuevas y renovaciones, con los meses cuando Kick los envía, y resubs compartidas en el chat',
        gift: 'Subs regaladas',
        giftBoth: 'Una alerta por regalo, con quién regala y cuántas subs',
        bits: 'Bits y Kicks',
        bitsTwitch: 'Cheers de Bits, con la cantidad y el mensaje',
        bitsKick: 'Kicks, con la cantidad y el mensaje',
        raid: 'Raids',
        raidTwitch: 'El canal que hace el raid y cuántos espectadores vinieron',
        raidKick: 'El canal que hace el raid, y los espectadores cuando Kick los envía',
        p1: 'Un regalo de 50 subs es una sola alerta, no 50, y quienes reciben las subs no tienen alerta propia. Un regalo anónimo muestra Anónimo como nombre. Los niveles no se muestran: una sub de Prime, Nivel 1, Nivel 2 o Nivel 3 tiene la misma alerta.',
        p2: 'Kick envía los meses con la mayoría de las subs, pero algunos canales nunca los reciben, y entonces la alerta solo dice que se suscribió. Cuando un espectador de Kick comparte después su resub en el chat, tiene su propia alerta con los meses y el mensaje, así que una resub de Kick puede aparecer dos veces. En Twitch una resub solo llega al chat cuando el espectador la comparte, así que aparece una vez.',
        p3: 'Durante una sesión de Chat compartido de Twitch, las subs, los regalos, los cheers y los raids de los canales compañeros no aparecen. Solo tu propio canal tiene alertas.',
      },
      follows: {
        title: '¿Por qué no hay alertas de follows ni de donaciones?',
        p1: 'Twitch y Kick no muestran los follows nuevos a una página sin sesión iniciada, y ninguna de las dos plataformas tiene donaciones propias. Alertas de Stream solo usa lo que ambas plataformas envían a todos los espectadores, y por eso funciona sin iniciar sesión e igual en las dos.',
      },
      look: {
        title: '¿Qué temas y colores hay?',
        neon: 'Neon (por defecto): un banner anguloso de ciencia ficción con sonidos de sintetizador. Al irse, parpadea como un letrero de neón.',
        celestial:
          'Celestial: una tarjeta azul marino bajo las estrellas con un marco fino y sonido de campanas.',
        p1: 'Color es el acento de la alerta. El predeterminado, Plataforma, muestra las alertas de Twitch en morado y las de Kick en verde. También puedes elegir un color para todas las alertas: azul, morado, rosa, rojo, dorado o verde. Cuando los dos canales están en la URL, una pequeña etiqueta TWITCH o KICK muestra de dónde vino cada alerta.',
        p2: 'Puedes cambiar el título de cada alerta, hasta 24 caracteres, o dejarlo vacío para mantener el predeterminado, como Nuevo suscriptor. Neon escribe los títulos en mayúsculas. Idioma de las alertas define el idioma de las palabras de la alerta: inglés, español, francés, alemán, japonés, portugués o turco. Se queda en la URL esté OBS en el idioma que esté.',
      },
      min: {
        title: '¿Cómo te saltas los regalos, cheers y raids pequeños?',
        caption: 'Cantidades mínimas de Alertas de Stream',
        colSetting: 'Ajuste',
        colDefault: 'Por defecto',
        colRange: 'Rango',
        gift: 'Mín. de subs (subs regaladas)',
        giftRange: 'De 1 a 100.000',
        bits: 'Cantidad mín. (Bits o Kicks)',
        bitsRange: 'De 1 a 100.000',
        raid: 'Mín. de espectadores (raids)',
        raidRange: 'De 0 a 100.000',
        p1: 'Lo que esté por debajo del mínimo no tiene alerta. Una sola Cantidad mín. cubre Bits y Kicks, y las subs no tienen mínimo. Si Kick envía un raid sin número de espectadores, cuenta como 0 espectadores, así que un Mín. de espectadores de 1 o más lo salta.',
      },
      queue: {
        title: '¿Qué pasa cuando llegan muchas alertas a la vez?',
        p1: 'Esperan su turno y aparecen de una en una, en el orden en que llegaron, con una pausa corta entre ellas. Tiempo en pantalla define cuánto dura cada una: de 3 a 20 segundos, 7 por defecto. Hasta 30 alertas pueden esperar en la cola; si se acumulan más, se saltan las más nuevas.',
        p2: 'Mostrar mensaje del espectador, activado por defecto, muestra lo que escribió el espectador con su resub, Bits o Kicks. Los enlaces se quitan y los mensajes largos se recortan, así nadie puede poner un enlace en tu stream.',
      },
      sound: {
        title: '¿Cómo llevas el sonido de las alertas a OBS?',
        step1:
          'Haz doble clic en la fuente de Alertas de Stream, marca Controlar audio vía OBS y haz clic en Aceptar. La fuente ahora aparece en el Mezclador de audio.',
        step2: 'Abre Editar → Propiedades de audio avanzadas en el menú de arriba.',
        step3:
          'Para oír tú también las alertas, pon Monitorización de audio de la fuente en Monitoring Enabled, que en versiones antiguas de OBS se llama Monitorización y salida.',
        p1: 'El volumen va de 0 a 100, 50 por defecto, y 0 quita el sonido. Cada alerta tiene su propio sonido corto que combina con el tema: sintetizadores en Neon, campanas en Celestial. OBS reproduce el sonido solo; en una pestaña normal del navegador la página se queda en silencio hasta que haces clic en ella una vez.',
      },
      test: {
        title: '¿Cómo pruebas las alertas antes de empezar el directo?',
        p1: 'La vista previa de la página de configuración reproduce alertas de ejemplo sin sonido. Los botones de Pruébalo que hay debajo reproducen una sub, un regalo, Bits/Kicks y un raid con sonido a tu volumen actual, para que veas y oigas el tema antes de elegirlo.',
        warnTitle: 'Los botones de prueba no llegan a OBS',
        warn: 'Solo se reproducen en la vista previa de la página de configuración. La fuente de OBS solo muestra subs, regalos, cheers y raids reales de tu canal, así que no puedes enviarle una alerta de prueba.',
        p2: 'Mantén activa la escena con la fuente y deja "Apagar fuente cuando no sea visible" desactivado. Las alertas que llegan con la fuente apagada se pierden y no se reproducen después.',
      },
      ctaTitle: 'Configurar Alertas de Stream',
      ctaText:
        'Escribe tus canales, elige un tema y copia la URL. Tu próxima sub tendrá su alerta.',
    },
    reader: {
      title: 'Cómo leer el chat de Twitch y Kick en una ventana o un panel de OBS',
      short: 'Leer el chat en un panel de OBS',
      summary:
        'Abrir el Lector de Chat, añadirlo a OBS como panel, qué pasa cuando se corta la conexión y cómo tu chat sobrevive a una recarga.',
      lead: 'Lector de Chat muestra tu chat de Twitch y Kick en una sola lista, en una pestaña del navegador o en un panel de OBS, para que puedas leerlo mientras haces stream. Ábrelo con el botón Abrir Lector de Chat de la página de configuración de Caja de Chat. Se reconecta solo, marca cada corte en la lista y conserva tu chat al recargar.',
      open: {
        title: '¿Cómo se abre el Lector de Chat?',
        step1:
          'Abre la [página de configuración de Caja de Chat](/setup/chat-widget) y escribe tu canal de Twitch, tu canal de Kick o los dos.',
        step2:
          'Haz clic en Abrir Lector de Chat debajo de la URL del widget. El lector se abre en una pestaña nueva.',
        step3:
          'Guarda la pestaña en marcadores, o guarda su dirección, para abrir el mismo lector la próxima vez.',
        p1: 'El lector se lleva los canales y algunos ajustes de Caja de Chat: proveedores de emotes, insignias, Ocultar bots, Ocultar comandos y Resaltados. La fuente, el diseño, la animación y el resto del aspecto se quedan en el overlay, y el lector tiene sus propios ajustes de tamaño de texto y hora. Para cambiar los ajustes que se llevó, cámbialos en la página de configuración y vuelve a abrir el lector.',
      },
      dock: {
        title: '¿Cómo se añade el Lector de Chat a OBS como panel?',
        step1: 'Abre el Lector de Chat y copia la dirección de la barra de direcciones.',
        step2:
          'En OBS, abre Paneles → Paneles de navegador personalizados en el menú de arriba. En versiones antiguas está en Vista → Paneles.',
        step3:
          'Escribe un nombre como Chat, pega la dirección en la columna URL y haz clic en Aplicar.',
        step4: 'Arrastra el panel nuevo adonde quieras dentro de la ventana de OBS.',
        p1: 'OBS tiene su propio almacenamiento de navegador, así que el panel guarda su propio historial y su configuración, aparte de tu navegador normal.',
      },
      shows: {
        title: '¿Qué muestra el Lector de Chat?',
        p1: 'Los mensajes de los dos chats en una sola lista, en el orden en que llegan. Con los dos canales puestos, un icono de Twitch o Kick muestra de dónde vino cada mensaje. Los emotes, las insignias y los colores de los nombres se ven igual que en Caja de Chat.',
        p2: 'Los mensajes borrados se quedan en la lista, tachados y marcados como (borrado), así todavía puedes ver qué se quitó. Cuando alguien recibe un timeout o un ban, sus mensajes anteriores se marcan igual. Cuando un mod borra el chat, una línea en la lista lo indica.',
        p3: 'A- y A+ cambian el tamaño del texto de 12 a 28 píxeles, 15 por defecto. El botón del reloj muestra u oculta la hora de los mensajes, y el botón de la papelera borra el historial al segundo clic. El lector recuerda tu tamaño de texto y tu ajuste de hora.',
        p4: 'Si subes para leer algo, la lista deja de moverse. Un botón abajo cuenta los mensajes nuevos; haz clic en él para volver al chat en vivo.',
      },
      drops: {
        title: '¿Qué pasa cuando se corta la conexión?',
        p1: 'Cada canal tiene un estado arriba: Conectando, Conectado o Reconectando, o Canal no encontrado cuando no se encuentra un nombre de Kick. Cuando se corta la conexión con un chat, un aviso cuenta hasta el siguiente intento, y Reintentar ahora lo intenta al momento. Los intentos empiezan con 1 segundo de diferencia y se van espaciando hasta uno cada 30 segundos.',
        p2: 'El lector también detecta una conexión que se queda en silencio sin cerrarse, algo que puede pasar después de un corte de red. Si no llega nada en 30 segundos, comprueba si el chat sigue ahí y se reconecta si no hay respuesta. Si tu equipo se queda sin conexión, te avisa y se reconecta en cuanto vuelve internet.',
        p3: 'Cada corte queda escrito en la lista, como "Se perdió la conexión con el chat de Twitch" y "De vuelta en el chat de Twitch tras 12 s", así sabes exactamente dónde pueden faltar mensajes.',
      },
      history: {
        title: '¿Pierdes tu chat al recargar?',
        p1: 'No. El lector guarda las últimas 1000 líneas en tu navegador y las trae de vuelta cuando lo vuelves a abrir, seguidas de una línea que dice "Guardado de tu última visita, hasta las" y la hora. Las líneas de más de 12 horas se descartan.',
        p2: 'Los mensajes enviados mientras el lector estaba cerrado no vuelven: todo lo que está encima de esa línea es de tu última visita, todo lo de debajo es nuevo. Cada conjunto de canales tiene su propio historial, y Borrar historial lo elimina.',
      },
      limits: {
        title: '¿Qué no puede hacer el Lector de Chat?',
        send: 'No puede enviar mensajes ni moderar. Lee el chat de forma anónima, como un espectador sin sesión iniciada.',
        events:
          'No muestra avisos de subs, regalos ni raids. Para eso, añade [Alertas de Stream](/setup/stream-alerts) a tu stream.',
        missed:
          'No puede recuperar los mensajes enviados mientras estaba cerrado, en ninguna de las dos plataformas.',
      },
      ctaTitle: 'Abrir el Lector de Chat',
      ctaText:
        'Escribe tus canales en la página de configuración de Caja de Chat y haz clic en Abrir Lector de Chat.',
    },
  },
  presets: {
    classic: 'Clásico',
    classicTag: 'El aspecto propio de cada widget',
    breadcrumb: 'Presets',
    eyebrow: 'Presets',
    title: 'Presets de juegos para los overlays de tu stream',
    lead: 'Elige un preset y tu Caja de Chat, tus Alertas de Stream, tu Meta de Subs, tu Subathon Timer, tu Encuesta de Chat, el ganador del Sorteo y tus Marcos de Stream tendrán el mismo marco, las mismas fuentes y los mismos colores. Usa uno en todos los widgets o uno distinto en cada uno.',
    pickTitle: 'Elige un preset',
    by: 'por {author}',
    community: 'Comunidad',
    makeDefault: 'Usar {name} en todos los widgets',
    isDefault: '{name} es tu predeterminado',
    defaultHint:
      'Todas las páginas de configuración de este navegador empiezan con tu predeterminado. Aun así puedes elegir otro preset en cualquier widget.',
    previewTitle: '{name} en todos los widgets',
    setUp: 'Configurar {widget}',
    previewIframeTitle: 'Vista previa de {widget} con el preset {name}',
    descriptions: {
      classic:
        'El aspecto con el que se hizo cada widget: Alertas de Stream neón, la barra morada de Meta de Subs y el texto simple de Caja de Chat. Tú eliges los colores.',
      rift: 'Marcos dorados finos con remaches de diamante, paneles azul marino profundo y barras turquesa brillantes, con títulos en Cinzel.',
      realm:
        'Marcos de bronce y oro con remaches, paneles de cuero oscuro y barras naranja legendario, con títulos en Marcellus.',
      dynasty:
        'Marcos de laca roja con esquineras doradas, paneles de madera oscura y barras carmesí, con títulos en Zen Antique.',
      ancient:
        'Marcos de hierro oscuro con esquinas de bronce, un brillo rojo en la parte de abajo y títulos afilados en Grenze.',
      agent:
        'Esquinas cortadas, un borde rojo, barras inclinadas y números altos en Teko sobre pizarra oscura.',
      defuse:
        'Esquineras de HUD, una línea superior ámbar, franjas de peligro en las barras y letra condensada Saira.',
      blocks:
        'Marcos de píxeles en colores de césped y tierra, barras verdes divididas en bloques y la fuente pixelada Jersey 10.',
    },
    existingTitle: '¿Ya tienes widgets en OBS?',
    existingText:
      'Pega aquí sus URL, una por línea, y cópialas de vuelta con {name}. Luego pega cada una en el campo URL de su fuente de navegador en OBS. El resto de cada URL se queda igual.',
    existingLabel: 'URL de los widgets',
    existingResult: 'Tus URL con {name}',
    existingUnsupported: 'No admite preset, se queda como estaba',
    existingInvalid: 'No es una URL de widget de Senchabot',
    communityTitle: 'Haz tu propio preset',
    communityText:
      'Un preset es un pequeño archivo JSON: nueve colores, dos Google Fonts y un estilo de marco. Envía el tuyo como pull request en GitHub. Cuando se fusione, aparecerá aquí y en todas las páginas de configuración con tu nombre.',
    communityLink: 'Cómo hacer un preset',
    communityEmpty: 'Todavía no hay presets de la comunidad. El tuyo podría ser el primero.',
    disclaimer:
      'Los nombres de los juegos son marcas de sus dueños. Estos presets son estilos de color, fuente y dibujo hechos por fans, sin arte de los juegos, y no tienen relación ni cuentan con el respaldo de los creadores de los juegos.',
    faqTitle: 'Preguntas sobre los presets',
    faq1Q: '¿Los presets cambian los widgets que ya están en OBS?',
    faq1A:
      'No. El aspecto de un widget es parte de su URL, así que un widget en OBS mantiene su aspecto hasta que recibe una URL nueva. Pega tus URL en el cuadro de arriba para recuperarlas con el preset.',
    faq2Q: '¿Cada widget puede tener un preset distinto?',
    faq2A:
      'Sí. Tu predeterminado es solo el punto de partida de cada página de configuración. En la página de configuración de cualquier widget puedes elegir otro preset, y la URL de ese widget lo lleva.',
    faq3Q: '¿Qué widgets admiten preset?',
    faq3A:
      'Caja de Chat, Alertas de Stream, Meta de Subs, Subathon Timer, Encuesta de Chat, el overlay de ganador del Sorteo y Marcos de Stream. Muro de Emotes solo muestra emotes y Sub Sprout dibuja sus propias plantas, así que mantienen su aspecto.',
    faq4Q: '¿Son temas oficiales de los juegos?',
    faq4A:
      'No. Son estilos hechos por fans a partir de colores, Google Fonts gratuitas y adornos dibujados desde cero, sin logos ni arte de los juegos, y no tienen relación con los creadores de los juegos.',
    field: {
      label: 'Preset',
      tip: 'Un aspecto listo para este widget: su marco, sus fuentes y sus colores. Elige el mismo preset en todos los widgets para que combinen.',
      browse: 'Todos los presets',
      owns: 'Los colores y las fuentes vienen de {name}.',
      makeDefault: 'Hacer {name} mi predeterminado',
      makeDefaultTip: 'Todas las páginas de configuración de este navegador empezarán con él.',
      isDefault: 'Tu predeterminado',
    },
  },
  faqPage: {
    breadcrumb: 'Preguntas frecuentes',
    title: 'Preguntas frecuentes',
    lead: 'Respuestas rápidas sobre precio, privacidad, plataformas compatibles y URL de widgets de Senchabot Extensions. Para configurar un widget concreto, mira las [guías](/guides).',
    groups: {
      basics: 'Precio y cuenta',
      platforms: 'Programas y plataformas',
      urls: 'La URL de tu widget y la privacidad',
      help: 'Soporte',
    },
    freeQ: '¿Senchabot Extensions es gratis?',
    freeA:
      'Sí. Los nueve widgets y herramientas son gratis: Caja de Chat, Muro de Emotes, Sub Sprout, Subathon Timer, Alertas de Stream, Meta de Subs, Encuesta de Chat, Sorteo y OBS Bridge. No hay plan de pago, marca de agua ni cuenta premium. El código fuente está abierto en GitHub bajo la licencia GPL-3.0.',
    loginQ: '¿Qué significa "sin iniciar sesión"?',
    loginA:
      'No creas una cuenta en este sitio, no inicias sesión con Twitch ni con Kick y no descargas nada. Escribes el nombre de tu canal y la página de configuración te da una URL. Los widgets leen el chat público de forma anónima: en Twitch se conectan como un espectador anónimo y en Kick escuchan el feed público del chat. Por eso no pueden escribir en el chat, moderar ni acceder a información privada de tu cuenta.',
    affiliatedQ: '¿Senchabot Extensions tiene relación con Twitch o Kick?',
    affiliatedA:
      'No. Senchabot Extensions lo hace Senchabot, un bot comunitario de código abierto para Twitch, Discord, Kick y YouTube. No tiene ninguna relación oficial, alianza ni respaldo de Twitch o Kick.',
    appsQ: '¿Con qué programas de streaming funciona?',
    appsA:
      'Con OBS Studio y cualquier otro programa de streaming que admita una fuente de navegador. Cada widget funciona como una URL web, y pegas esa URL en la fuente. Nuestras guías están escritas para OBS Studio.',
    platformsQ: '¿Qué widgets funcionan con Twitch y cuáles con Kick?',
    platformsA:
      'Los once funcionan con las dos plataformas. Caja de Chat, Muro de Emotes, Sub Sprout, Subathon Timer, Alertas de Stream, Meta de Subs, Encuesta de Chat y Cuenta Regresiva escuchan un canal de Twitch y uno de Kick juntos en una sola URL. OBS Bridge escucha comandos de los dos chats, y cada usuario autorizado se añade con su propia plataforma. Sorteo funciona en una plataforma a la vez, Twitch o Kick. En Caja de Chat, los emotes de 7TV se ven en las dos plataformas, mientras que los de BTTV y FFZ solo en Twitch.',
    editQ: '¿Cómo cambio un widget más adelante?',
    editA:
      'Cambia la configuración en la página de configuración, copia la URL nueva y pégala encima de la vieja en el campo URL de la fuente en OBS. Con Caja de Chat, Muro de Emotes, Sub Sprout, Subathon Timer, Alertas de Stream, Meta de Subs, Encuesta de Chat, Marcos de Stream, Redes Sociales y Cuenta Regresiva, si pegas tu URL vieja en el campo URL del widget de la página de configuración, vuelve toda tu configuración y no tienes que empezar de cero.',
    oldUrlsQ: '¿Mis URL viejas de widgets seguirán funcionando?',
    oldUrlsA:
      'Sí. Las actualizaciones se hacen para que las URL existentes no se rompan: los nombres de los parámetros, los valores y los predeterminados se mantienen. Por ejemplo, el viejo keep=true de Caja de Chat sigue significando Siempre, y Sub Sprout sigue leyendo los viejos parámetros channel y platform.',
    privacyQ: '¿Dónde se guarda mi configuración y adónde van mis datos?',
    privacyA:
      'Tu configuración vive dentro de la URL del widget, no en una cuenta ni en una base de datos, así que cualquiera que tenga la URL puede abrir el mismo widget. Como en cualquier web, la dirección de la página que abres llega a nuestro hosting y puede aparecer en sus registros de peticiones. Los widgets leen el chat de forma anónima directamente de Twitch y Kick, obtienen los emotes de 7TV, BetterTTV y FrankerFaceZ, y la información de canales de Twitch de ivr.fi. Los participantes y ganadores del Sorteo se quedan en tu propio navegador. La URL de OBS Bridge contiene tu contraseña de OBS WebSocket, así que trátala como una contraseña.',
    emptyQ: '¿Por qué mi widget se ve vacío en OBS?',
    emptyA:
      'Caja de Chat y Muro de Emotes se quedan transparentes y vacíos hasta que pasa algo en el chat, así que primero manda un mensaje en el chat. Si sigue sin aparecer nada, asegúrate de haber escrito solo el nombre del canal, no un enlace, en el campo del canal, y de que el nombre esté bien escrito. La lista completa de comprobaciones está en la guía de OBS.',
    bugQ: '¿Cómo pido un widget o reporto un error?',
    bugA: 'Abre un issue nuevo en el repositorio senchabot-opensource/monorepo de GitHub. Si reportas un error, incluye la URL del widget (quita la contraseña si tiene), el programa de streaming que usas y lo que ves. Para ideas, también puedes usar GitHub Discussions o el servidor de Discord de Senchabot.',
    ctaTitle: '¿No encontraste tu respuesta?',
    ctaText:
      'Las guías cubren la configuración paso a paso y la solución de problemas. ¿Sigues atascado? Escríbenos en GitHub.',
    ctaGuides: 'Ir a las guías',
    ctaIssue: 'Abrir un issue en GitHub',
  },
  changelog: {
    breadcrumb: 'Novedades',
    title: 'Novedades',
    lead: 'Funciones nuevas y errores corregidos en Senchabot Extensions, de lo más nuevo a lo más viejo. La lista sale del historial de commits del proyecto en [GitHub](https://github.com/senchabot-opensource/monorepo/commits/dev/apps/extensions).',
    site: 'Sitio',
    entries: {
      moreLanguages:
        'El sitio ahora también está en español, francés, alemán, japonés y portugués, y Encuesta de Chat, Alertas de Stream y los valores del Subathon Timer también pueden mostrar sus textos en esos idiomas.',
      countdownSceneCommand:
        'Nuevo comando de chat `!countdown {scene} {duration}`. Ahora los mods pueden cambiar la escena actual (inicio, pausa o cierre) y fijar su duración con un solo comando.',
      socialsLaunch:
        'Nuevo widget: Redes Sociales. Muestra tus redes sociales una tras otra con una animación de deslizamiento elegante.',
      thinBarReadable:
        'La Barra fina de Subathon Timer y Meta de Subs tiene el texto más grande y con contorno, que se lee bien sobre cualquier relleno, un brillo más pequeño y espacio encima para los valores.',
      thinBars:
        'Subathon Timer y Meta de Subs ahora tienen un estilo Barra fina que mete el título y el tiempo o el conteo directamente dentro de una barra de progreso más delgada.',
      subathonAdjustedDefaults:
        'Ajustar valores según el tiempo en Subathon Timer ahora empieza en 5 horas con valores más bajos ya puestos: en Twitch 5 min por sub, 10 min por sub regalada y 20 min por cada 500 Bits, en Kick 10 min cada uno.',
      subathonDynamicRates:
        'Subathon Timer ahora tiene valores ajustables: pon un umbral para bajar cuánto tiempo suma una sub cuando el reloj ya va alto.',
      scrollHint:
        'Los paneles de configuración que no caben en la pantalla ahora muestran una pequeña flecha abajo, para que quede claro que hay más ajustes debajo. Púlsala para bajar, y cuando llegas al final se da la vuelta y te lleva arriba.',
      chatTextShadow:
        'Caja de Chat tiene la opción Sombra del texto: Ninguna, Normal (como antes) o Fuerte, un contorno oscuro que mantiene el chat legible sobre juegos claros.',
      chatFonts:
        'Caja de Chat ahora tiene un selector de fuente para los nombres y otro para los mensajes, y los dos siguen disponibles con un preset: mantén las dos fuentes que trae el preset, pon también su fuente de títulos en los mensajes, o combina cualquiera con Inter, Roboto, Nunito, JetBrains Mono, Source Serif 4 o la fuente de tu sistema. Los nombres y los mensajes en negrita ahora también funcionan con presets cuya fuente tiene un solo grosor, como Realm, Dynasty y Blocks.',
      sproutSaved:
        'Sub Sprout ahora conserva su planta tras recargar OBS y la lleva al siguiente stream, en lugar de empezar cada vez desde la primera etapa. Los mods pueden hacerla empezar de nuevo con !grow reset.',
      countdown:
        'Nueva Cuenta Regresiva: un reloj para tus escenas de empezamos pronto, vuelvo pronto y fin del stream. Pon una duración o la hora a la que empiezas el directo, elige un preset y deja que tus mods la retrasen desde el chat con !countdown.',
      deviceTheme:
        'El sitio ahora se abre con el tema claro u oscuro de tu dispositivo y lo sigue cuando cambia. Cuando pulsas el botón de tema del encabezado, se recuerda tu elección y el dispositivo deja de cambiarlo.',
      frames:
        'Nuevos Marcos de Stream: marcos listos para tu cámara, tu chat y toda tu pantalla de stream. Cada preset trae su propio arte, como un tejado de pagoda y farolillos en Dynasty o bloques de píxeles en Blocks.',
      subathonRates:
        'Subathon Timer ahora puede mostrar lo que suman una sub, una sub regalada y 500 Bits o Kicks, directamente en el timer, para que los espectadores sepan cuánto vale su sub.',
      presets:
        'Nuevos presets: un mismo aspecto para Caja de Chat, Alertas de Stream, Meta de Subs, Subathon Timer, Encuesta de Chat y el ganador del Sorteo, con presets de juegos para League of Legends, World of Warcraft, Metin2, Dota 2, Valorant, CS2 y Minecraft.',
      poll: 'Nueva Encuesta de Chat: lanza una encuesta desde el chat con !poll y los espectadores de Twitch y Kick votan escribiendo un número. Barras en vivo, un contador, un voto por espectador y el ganador al final.',
      goal: 'Nueva Meta de Subs: una barra que cada sub, resub y sub regalada de Twitch y Kick llena de a uno, con un trofeo al llegar a la meta. Los mods pueden corregir el conteo con !goal.',
      streamAlerts:
        'Nuevas Alertas de Stream: una alerta animada con su propio sonido para cada sub, sub regalada, Bits, Kicks y raid en Twitch y Kick. Elige un color, cambia los títulos y pon cantidades mínimas.',
      subathon:
        'Nuevo Subathon Timer: una cuenta regresiva que las subs, las subs regaladas, los Bits y los Kicks van alargando, en forma de barra de vida, reloj o anillo. Tú eliges cuánto tiempo suma cada uno, y los mods lo controlan con !subathon.',
      chatReader:
        'Nuevo Lector de Chat: lee tu chat de Twitch y Kick en una pestaña del navegador o en un panel de OBS. Se reconecta solo con una cuenta atrás, marca cada corte en el chat y conserva tu historial al recargar.',
      chatSilentDrop:
        'Caja de Chat, Muro de Emotes y OBS Bridge detectan cuando la conexión con el chat se queda en silencio tras un corte de internet y se reconectan solos, al momento en cuanto vuelve internet. Antes esto podía tardar minutos o necesitar una recarga.',
      contentPages: 'Nuevas guías, una página de preguntas frecuentes y esta página de novedades.',
      siteNav:
        'Todas las páginas tienen el mismo encabezado y pie: el menú de widgets, los selectores de idioma y tema, y enlaces a las guías y al soporte.',
      notFound: 'Ir a una URL que no existe abre una página 404 con enlaces a todos los widgets.',
      geist:
        'Las páginas del sitio usan Geist, la misma fuente que senchabot.com. Las fuentes de los overlays no cambian.',
      chatNextSteps:
        'Cuando copias la URL de Caja de Chat, la página de configuración muestra los pasos para añadirla a OBS junto con el tamaño recomendado.',
      raffleMonthsInput:
        'Ahora puedes vaciar el campo Meses mínimos de sub de Sorteo mientras escribes, así escribir 6 ya no se convierte en 16.',
      raffleKeywordRequired:
        'Sorteo ya no se puede iniciar con la palabra clave vacía. Antes podías abrir un sorteo en el que nadie podía entrar.',
      raffleMonthsSubsOnly:
        'Meses mínimos de sub solo se aplica con Solo suscriptores activado, y el streamer puede entrar en su propio sorteo.',
      sproutPreviewSimulate:
        'La vista previa de Sub Sprout sigue animando el crecimiento después de escribir un canal, así ves al momento la planta y los efectos que elegiste.',
      sproutPreviewTint:
        'El área de vista previa de Sub Sprout muestra el fondo ligeramente transparente que debe tener en lugar de negro sólido.',
      emoteWallUrl:
        'La configuración de Muro de Emotes ya no escribe valores erróneos en la URL cuando los campos Duración y Máx. se dejan vacíos, y no crea URL sin canal.',
      bridgePassword:
        'OBS Bridge envía la contraseña aunque la URL de WebSocket esté vacía. Las conexiones con contraseña ahora funcionan cuando OBS está en el mismo equipo.',
      chatFilters:
        'Caja de Chat puede ocultar bots y comandos que empiezan con !, mantener los mensajes de 10 segundos a 5 minutos o para siempre, y te deja elegir los proveedores de emotes uno por uno.',
      chatEmoteProviders:
        'Caja de Chat muestra emotes de 7TV, BTTV y FFZ en los mensajes de Twitch y emotes de 7TV en los mensajes de Kick.',
      sproutKickGifts:
        'Sub Sprout crece con las subs regaladas en Kick, y cada sub regalada cuenta como una etapa.',
      bridgeUserPlatform:
        'OBS Bridge guarda a los usuarios autorizados junto con su plataforma. Quien tome el mismo nombre en la otra plataforma ya no puede usar comandos.',
      sevenTvActiveSet:
        'Caja de Chat y Muro de Emotes obtienen los emotes de 7TV del set activo del propio canal. Antes podían aparecer emotes de otra cuenta con un nombre parecido.',
      chatColorCrash:
        'Caja de Chat ya no se cae a una pantalla de error con mensajes que tienen un valor de color raro.',
      bridgeReconnect:
        'OBS Bridge hace un solo intento cada 5 segundos mientras OBS está cerrado o la contraseña es incorrecta. Los intentos de conexión ya no se multiplican.',
      raffleFakeEntries:
        'Sorteo no cuenta como participantes las líneas falsas escondidas dentro de mensajes de suscripción, así nadie puede usarlas para saltarse Solo suscriptores.',
      chatIrcParsing:
        'El texto escrito en el chat ya no puede vaciar la Caja de Chat. Un timeout o un ban solo quita los mensajes de esa persona.',
      chatHighlights:
        'Caja de Chat resalta los mensajes que te mencionan, las respuestas, los primeros mensajes en el chat, los anuncios y los mensajes de Destacar mi mensaje. Tú eliges cuáles están activos durante la configuración.',
      chatPasteUrl:
        'Pegar la URL de un widget existente en la configuración de Caja de Chat restaura toda tu configuración.',
      chatSingleScreen:
        'La página de configuración de Caja de Chat tiene un diseño nuevo que cabe en una sola pantalla. Los ajustes se agrupan en Canal, Apariencia y Mensajes.',
      chatIconAlign:
        'Los iconos de Twitch y Kick en Caja de Chat tienen el mismo tamaño y quedan alineados.',
      chatHideIndicator:
        'Caja de Chat puede ocultar del todo el indicador de plataforma cuando la franja de color basta por sí sola.',
      chatSmoothSpeed:
        'Caja de Chat estrena la animación Deslizado suave desde la derecha, y la vista previa de la configuración tiene un ajuste de velocidad del chat.',
      chatAdaptiveAnimations:
        'Las animaciones de Caja de Chat se acortan cuando el chat va más rápido. La predeterminada, Deslizar desde la derecha, se ve igual que antes.',
      chatTypewriter:
        'Caja de Chat estrena la animación Máquina de escribir. Cuando llega un mensaje nuevo, los anteriores se deslizan para hacerle sitio en lugar de saltar.',
      chatPlatformStripe:
        'Los iconos de plataforma de Caja de Chat son más grandes, y puedes añadir una franja del color de la plataforma a la izquierda de cada mensaje.',
      emoteWallModes:
        'Muro de Emotes estrena un modo Rebote que hace rebotar los emotes en los bordes, un modo solo para hype y protección contra spam de emotes.',
      sproutPotLabel:
        'Sub Sprout puede mostrar una etiqueta de etapa como 3/10 encima de la maceta.',
      emoteWallLaunch:
        'Llega Muro de Emotes: los mensajes de solo emotes de Twitch y Kick vuelan por la pantalla en modo Tranquilo o Caos.',
      sproutBothPlatforms:
        'Sub Sprout escucha un canal de Twitch y uno de Kick juntos en una sola URL. Las URL viejas con channel y platform siguen funcionando.',
      chatPreviewMock:
        'La vista previa de Caja de Chat sigue reproduciendo el chat de ejemplo después de escribir un canal, así ves tu configuración sin que nadie escriba.',
      siteLanguages:
        'El sitio está disponible en turco e inglés, y puedes cambiar entre tema claro y oscuro.',
      bridgeSceneCommand:
        'OBS Bridge estrena el comando !scene, que cambia a cualquier escena con un nombre que coincida. También puedes cambiar el nombre de todos los comandos.',
      raffleBots: 'Sorteo ignora automáticamente a los bots conocidos.',
      chatReadableColors:
        'Caja de Chat aclara los colores de nombre que cuestan leer sobre fondo oscuro, y las sombras de los mensajes son más suaves.',
      chatBoldBadges:
        'Caja de Chat estrena Mensajes en negrita y una opción para ocultar las insignias. Las insignias se escalan con el tamaño de fuente.',
      sproutWatering: 'Sub Sprout estrena los efectos de riego de lluvia y destellos.',
      chatItemBackground:
        'Caja de Chat estrena un recuadro de fondo para cada mensaje y la opción de nombre en negrita. Si se cae la conexión, se reconecta al chat sola.',
      bridgeLaunch:
        'Llega OBS Bridge: los usuarios autorizados pueden cambiar a las escenas BRB y principal con comandos del chat, e iniciar o detener el stream y la grabación.',
      chatFade: 'Caja de Chat estrena la animación Fundido.',
      sproutVarieties:
        'Sub Sprout estrena nuevas variedades de plantas como rosa, girasol, cactus, tulipán y loto.',
      chatFontsLayouts:
        'Caja de Chat te deja elegir la fuente, el diseño del mensaje y la animación. Los mensajes borrados y los de usuarios baneados también se quitan del overlay.',
      raffleHardening:
        'Sorteo saca al ganador con una elección aleatoria segura, bloquea las reglas al empezar el sorteo y no te deja sacar un ganador antes de que se cumpla la Duración mínima.',
      siteTutorial:
        'Las páginas de configuración enlazan a un video tutorial. En la página de Sorteo puedes copiar la URL del overlay con un clic.',
      chatPlatformPick:
        'Caja de Chat te deja elegir si el chat viene de Twitch, de Kick o de los dos.',
      chatSevenTv: 'Caja de Chat muestra emotes de 7TV.',
      chatTimestamp:
        'Caja de Chat te deja elegir el nombre o el icono de la plataforma y puede mostrar la hora de los mensajes.',
      siteSetupPages:
        'Está disponible una nueva página de inicio, y cada widget tiene ahora su propia página de configuración.',
      raffleLaunch:
        'Llega Sorteo: los espectadores entran escribiendo una palabra clave en el chat, puedes poner un límite de victorias por usuario y el ganador aparece en el stream con confeti.',
      chatBgOpacity: 'La opacidad del fondo oscuro de Caja de Chat se puede ajustar.',
      chatEmotesBadges:
        'Caja de Chat muestra los emotes de Twitch y las insignias de Twitch y Kick.',
      chatOrientation:
        'Caja de Chat también funciona en horizontal, así que puedes ponerla como una barra en la parte de abajo de la pantalla.',
      sitePreview:
        'La página de configuración muestra una vista previa en vivo del widget junto a los ajustes.',
      sproutKick: 'Sub Sprout también cuenta las suscripciones de Kick.',
      launch:
        'Llega Senchabot Extensions, con una caja de chat que junta el chat de Twitch y Kick y Sub Sprout, una planta que crece con las suscripciones de Twitch.',
    },
  },
  socials: {
    breadcrumb: 'Configurar Redes Sociales',
    title: 'Configurar Redes Sociales',
    intro:
      'Muestra tus redes sociales en el stream. El widget va rotando por las plataformas que rellenes, mostrando una a la vez con una animación de deslizamiento.',
    sectionPlatforms: 'Plataformas',
    platformsTip:
      'Escribe tu nombre de usuario en cada plataforma que quieras mostrar. Deja el resto vacío.',
    sectionAppearance: 'Apariencia',
    rotationInterval: 'Intervalo de rotación',
    intervalSeconds: '{seconds} segundos',
    textColor: 'Color del texto',
    animation: 'Animación',
    animSlideUp: 'Deslizar hacia arriba',
    animSlideLeft: 'Deslizar a la izquierda',
    animScale: 'Escalar',
    animFade: 'Fundido',
    pillColor: 'Color de fondo de la píldora',
    previewTitle: 'Vista previa de Redes Sociales',
    previewIframeTitle: 'Vista previa de Redes Sociales',
    previewHint: 'Vista previa en vivo de la rotación de tus redes sociales.',
    widgetUrlTip:
      '¿Ya hiciste un widget? Pega su URL aquí para cargar tu configuración y cambiar lo que necesites.',
    widgetUrlPlaceholder: 'Pega la URL de un widget existente para editarlo',
    widgetUrlInvalid: 'Esta no es una URL de widget de Redes Sociales.',
    browserSourceHintSize: ' (tamaño recomendado: 600×120).',
    guideTitle: 'Configuración en tu programa de streaming (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Añade una fuente de navegador en tu programa de streaming (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Pega la URL de redes sociales que copiaste.',
    guideStep3: 'Pon el ancho en 600 y el alto en 120.',
    faq1Q: '¿El widget se actualiza si cambio mis nombres de usuario?',
    faq1A:
      'Tienes que actualizar tu URL. Vuelve a esta página, pega tu URL actual para cargar tu configuración, escribe tus nombres de usuario nuevos y copia la URL nueva en tu programa de streaming.',
  },
};
