import type { en } from './en';

export const pt: typeof en = {
  common: {
    freeBadge: '100% grátis · Sem login',
    copy: 'Copiar',
    copied: 'Copiado!',
    home: 'Início',
    watchTutorial: 'Ver tutorial',
    widgetUrl: 'URL do widget',
    toolUrl: 'URL da ferramenta',
    channelPlaceholder: 'ex.: seucanal',
    previewNoChannel: 'Preencha pelo menos um canal para gerar a prévia.',
    browserSourceHint:
      'Cole esta URL como fonte de navegador no OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio ou qualquer programa que aceite fontes de navegador',
    themeToggle: 'Trocar tema de cores',
    languageToggle: 'Trocar idioma',
    moreInfo: 'Mais informações',
    sectionChannel: 'Canal',
    sectionAppearance: 'Aparência',
    platforms: 'Plataformas',
    platformsTip:
      'Escolha a plataforma que o widget vai ouvir. Faz live na Twitch e na Kick ao mesmo tempo? Escolha Ambas.',
    platformBoth: 'Ambas',
    twitchChannel: 'Canal da Twitch',
    kickChannel: 'Canal da Kick',
    channelTip:
      'Digite só o nome do canal, não o link inteiro. Para twitch.tv/senchabot, é senchabot.',
    previewLoading: 'Carregando prévia…',
    scrollMore: 'Role para ver mais',
    scrollTop: 'Voltar ao topo',
    setupGuideTitle: 'Como configurar',
    faqTitle: 'Perguntas frequentes',
    moreWidgets: 'Mais widgets',
    nextSteps: {
      title: 'Agora adicione no seu programa de live',
      addSource:
        'Adicione uma nova fonte de navegador no OBS Studio ou em qualquer programa que aceite fontes de navegador.',
      paste: 'Cole a URL no campo URL.',
      size: 'Coloque a largura em {width} e a altura em {height}.',
      test: 'Abra a URL em uma nova aba para ver se funciona',
      dismiss: 'Ocultar',
    },
    siteName: 'Senchabot Extensions',
    homeLink: 'Início do Senchabot Extensions',
    skipToContent: 'Pular para o conteúdo',
    newTab: '(abre em uma nova aba)',
    nav: {
      label: 'Principal',
      menu: 'Menu',
      openMenu: 'Abrir menu',
      closeMenu: 'Fechar menu',
      widgets: 'Widgets',
      guides: 'Guias',
      presets: 'Presets',
      faq: 'FAQ',
      senchabot: 'Senchabot',
      github: 'Código-fonte no GitHub',
      switchWidget: 'Trocar para outro widget',
      breadcrumb: 'Navegação estrutural',
    },
    notFound: {
      title: 'Página não encontrada',
      text: 'Esta página não existe ou mudou de lugar. Escolha um widget abaixo ou volte para a página inicial.',
      home: 'Voltar ao início',
    },
    footer: {
      about:
        'Overlays e ferramentas de live grátis para Twitch e Kick. Sem login, nada para baixar, e o código é aberto.',
      license: 'GPL-3.0, código-fonte no GitHub',
      social: 'Senchabot nas redes sociais',
      guides: 'Guias',
      setupGuides: 'Guias de configuração',
      presets: 'Presets de jogos',
      faq: 'FAQ',
      changelog: 'Histórico de mudanças',
      senchabotBot: 'Bot Senchabot',
      docs: 'Documentação',
      discussions: 'GitHub Discussions',
      reportBug: 'Relatar um bug ou pedir um widget',
      notAffiliated: 'Sem vínculo com a Twitch ou a Kick.',
    },
  },
  widgets: {
    overlays: 'Overlays',
    tools: 'Ferramentas',
    chatBox: {
      name: 'Caixa de Chat',
      tagline: 'O chat da Twitch e da Kick juntos em um overlay, com emotes da 7TV, BTTV e FFZ.',
    },
    emoteWall: {
      name: 'Mural de Emotes',
      tagline: 'Mensagens do chat feitas só de emotes flutuam pela sua tela.',
    },
    subSprout: {
      name: 'Sub Sprout',
      tagline: 'Uma plantinha na sua live que cresce um pouco a cada novo sub.',
    },
    goal: {
      name: 'Meta de Subs',
      tagline:
        'Uma barra de meta que cada sub e sub de presente enche, com um troféu quando você bate a meta.',
    },
    frames: {
      name: 'Molduras de Live',
      tagline:
        'Molduras prontas para sua câmera, seu chat e a tela da live, desenhadas no estilo do seu preset.',
    },
    countdown: {
      name: 'Contagem Regressiva',
      tagline:
        'Uma contagem regressiva para as cenas de início, pausa e encerramento, por duração ou por horário.',
    },
    subathon: {
      name: 'Subathon Timer',
      tagline:
        'Uma contagem regressiva que subs, subs de presente, Bits e Kicks empurram para frente. Barra de vida, relógio ou anel.',
    },
    poll: {
      name: 'Enquete do Chat',
      tagline:
        'Uma enquete em que o chat vota digitando um número, com barras ao vivo e um vencedor.',
    },
    streamAlerts: {
      name: 'Alertas de Live',
      tagline: 'Um alerta animado com som para cada sub, sub de presente, Bits, Kicks e raid.',
    },
    raffle: {
      name: 'Sorteio',
      tagline:
        'Os espectadores entram com uma palavra no chat, tipo !join, e você sorteia o vencedor.',
    },
    obsBridge: {
      name: 'OBS Bridge',
      tagline: 'Troque cenas do OBS e controle a transmissão e a gravação com comandos no chat.',
    },
    socials: {
      name: 'Redes Sociais',
      tagline: 'Mostre suas redes sociais em rodízio com uma animação caprichada.',
    },
  },
  home: {
    heroTitle: 'Overlays grátis para lives na Twitch e na Kick',
    heroLead:
      'Configure um widget com prévia ao vivo e cole uma URL no OBS. Sem conta, sem marca d’água, e o código é aberto.',
    browseWidgets: 'Ver os widgets',
    viewOnGithub: 'Ver no GitHub',
    trustLabel: 'Destaques',
    trustFree: 'Grátis',
    trustNoLogin: 'Sem login',
    trustOpenSource: 'Código aberto',
    trustPlatforms: 'Twitch + Kick',
    sceneLive: 'Ao vivo',
    sceneCaption: 'Demo ao vivo rodando com um chat de exemplo',
    demoTitle: 'Demo: {name}',
    worksWithTitle: 'Onde funciona',
    worksWithApps: 'Programas de live',
    worksWithAppsText: 'OBS Studio e outros programas que aceitam fontes de navegador',
    galleryTitle: 'Escolha um widget',
    galleryLead:
      'Cada um tem sua própria página de configuração com prévia ao vivo. Nada para baixar.',
    overlaysLead: 'Fontes de navegador que funcionam sozinhas depois que entram na sua cena.',
    toolsLead: 'Ferramentas que você mesmo usa durante a live, por uma página ou pelo chat.',
    setUp: 'Configurar',
    toolFeatures: 'Recursos',
    raffleFeatureKeyword: 'Palavra de entrada, tipo !join',
    raffleFeatureSubs: 'Só inscritos, com mínimo de meses',
    raffleFeatureDuration: 'Tempo mínimo antes do sorteio',
    obsFeatureScenes: 'Troca de cena pelo chat',
    obsFeatureCommands: 'Nomes de comando personalizados',
    obsFeatureLocal: 'Conexão local com o obs-websocket',
    subathonFeatureChat: 'Controle pelo chat com !subathon',
    subathonFeaturePlatforms: 'Tempos separados para Twitch e Kick',
    subathonFeatureSaved: 'O tempo restante sobrevive a reinícios do OBS',
    pollFeatureVote: 'O chat vota digitando um número',
    pollFeatureBoth: 'Votos da Twitch e da Kick na mesma enquete',
    pollFeatureLate: 'Votos do último segundo contam, mesmo com o atraso da live',
    pollSpotlight: {
      eyebrow: 'Novo: Enquete do Chat',
      title: 'Deixe o chat decidir',
      lead: 'Abra uma enquete pelo chat com !poll e os espectadores na Twitch e na Kick votam digitando um número. As barras enchem ao vivo na live, e o vencedor aparece quando o tempo acaba.',
      pointVote: 'O pessoal digita 2, !vote 2 ou a própria opção. Cada espectador conta uma vez.',
      pointBoth: 'Os votos da Twitch e da Kick caem na mesma enquete.',
      pointLate:
        'Votos digitados nos últimos segundos ainda contam, mesmo com o pessoal assistindo com um pouco de atraso.',
      pointMods: 'Você e seus mods comandam pelo chat. Sem bot, sem login.',
      setup: 'Configurar a Enquete do Chat',
      guide: 'Ler o guia',
      chat: 'Chat',
      caption: 'Demo ao vivo com votos simulados',
    },
    visualScenes: 'Cenas',
    howTitle: 'Como funciona',
    howLead: 'Três passos, e nenhum pede conta.',
    howStep1:
      'Escolha um widget e ajuste as configurações. A prévia ao vivo mostra cada mudança na hora.',
    howStep2: 'Digite o nome do seu canal e copie a URL do widget.',
    howStep3:
      'No OBS Studio, adicione uma fonte de navegador, cole a URL e use o tamanho recomendado.',
    sizesTitle: 'Tamanhos recomendados da fonte de navegador',
    sizesNote: 'Largura × altura, em pixels.',
    sizesWidget: 'Widget',
    sizesValue: 'Tamanho',
    trustTitle: 'Sem conta, sem pegadinha',
    noLoginTitle: 'Sem login',
    noLoginText:
      'Os widgets leem o chat público do seu canal como um espectador deslogado. Você nunca conecta sua conta da Twitch ou da Kick.',
    noWatermarkTitle: 'Sem marca d’água',
    noWatermarkText:
      'Nada é carimbado nos seus overlays. O que você vê na prévia é o que aparece na live.',
    openSourceTitle: 'Código aberto',
    openSourceText:
      'Todo o código está no GitHub sob a licença GPL-3.0. Leia, faça um fork ou mande uma correção.',
    urlSettingsTitle: 'Suas configurações ficam na URL',
    urlSettingsText:
      'As configurações do widget ficam escritas na própria URL, então você não precisa de conta para guardá-las. Salve a URL e seu widget está sempre com você.',
    senchabotTitle: 'Precisa de um bot de chat também? Conheça o Senchabot',
    senchabotText:
      'O time por trás destes widgets também faz o Senchabot: comandos personalizados, timers e shoutouts na Twitch, e um aviso de live no seu servidor do Discord.',
    senchabotCta: 'Visitar senchabot.com',
    communityTitle: 'Participe',
    communityLead: 'É código aberto, e tem umas formas fáceis de ajudar.',
    starTitle: 'Dê uma estrela no GitHub',
    starText: 'As estrelas ajudam mais streamers a encontrar o projeto.',
    starCount: '{count} estrelas',
    requestTitle: 'Peça um widget',
    requestText: 'Sente falta de algo na sua live? Abra uma issue e conte o que você precisa.',
    discordTitle: 'Entre no Discord',
    discordText: 'Tire dúvidas e mostre seu setup para outros streamers.',
    faqMore: 'Não achou sua resposta?',
    faq1Q: 'É grátis mesmo?',
    faq1A:
      'Sim. Todos os widgets e ferramentas são grátis, sem plano pago e sem marca d’água nos seus overlays. O projeto é de código aberto e feito pelo time do Senchabot.',
    faq2Q: 'O que "sem login" quer dizer na prática?',
    faq2A:
      'Você nunca entra nem conecta sua conta da Twitch ou da Kick. Você digita o nome do canal, e o widget lê o chat público desse canal de forma anônima, como um espectador deslogado. Então ele vê o que qualquer pessoa vê no chat, e nada além disso.',
    faq3Q: 'Com quais programas de live funciona?',
    faq3A:
      'OBS Studio e outros programas que aceitam fontes de navegador. Adicione a URL do widget como fonte de navegador e use o tamanho mostrado na página de configuração.',
    faq4Q: 'Posso usar Twitch e Kick juntas?',
    faq4A:
      'Sim. Caixa de Chat, Mural de Emotes, Sub Sprout, Subathon Timer, Alertas de Live, Meta de Subs, Enquete do Chat e Contagem Regressiva aceitam um canal da Twitch e um da Kick na mesma URL. O OBS Bridge também consegue ouvir os dois chats ao mesmo tempo. O Sorteio roda em uma plataforma por vez.',
    faq5Q: 'Como mudo um widget depois?',
    faq5A:
      'Abra a página de configuração dele, deixe do jeito que você quer e troque a URL na sua fonte de navegador. Caixa de Chat, Mural de Emotes, Sub Sprout, Subathon Timer, Alertas de Live, Meta de Subs, Enquete do Chat, Molduras de Live, Redes Sociais e Contagem Regressiva também abrem uma URL que você já tem: cole na página de configuração, suas configurações voltam e você muda só o que precisa.',
    faq6Q: 'A URL do meu widget continua funcionando depois das atualizações?',
    faq6A:
      'Sim. As atualizações mantêm funcionando as configurações e os valores das URLs que já existem, então um widget que já está na sua cena não precisa de URL nova.',
  },
  chatWidget: {
    breadcrumb: 'Configurar Caixa de Chat',
    title: 'Configurar Caixa de Chat',
    intro:
      'Um widget multichat que junta o chat da Twitch e da Kick em um overlay só. Emotes da 7TV funcionam nas duas plataformas, BTTV e FFZ na Twitch, e os emblemas aparecem também. Você escolhe o layout, a fonte e a animação.',
    platformIndicator: 'Indicador de plataforma',
    platformName: 'Nome da plataforma',
    platformIcon: 'Ícone da plataforma',
    platformHidden: 'Ocultar plataforma',
    sectionMessages: 'Mensagens',
    platformsTip:
      'Escolha de quais plataformas puxar o chat. Marque as duas para juntar as mensagens da Twitch e da Kick em um feed só.',
    platformIndicatorTip:
      'Com as duas plataformas ligadas, mostra de onde veio cada mensagem: o nome da plataforma, o ícone dela ou nada.',
    orientationTip:
      'Vertical empilha as mensagens uma em cima da outra, como uma caixa de chat clássica. Horizontal coloca uma do lado da outra, ótimo para uma faixa na parte de baixo da tela.',
    darkBackgroundTip:
      'Coloca um fundo preto semitransparente atrás do widget. Deixa o texto mais fácil de ler em cenas claras.',
    emotesTip:
      'Os emotes dos provedores que você marcar aparecem como imagem, o resto aparece como texto. 7TV funciona na Twitch e na Kick, BTTV e FFZ só na Twitch.',
    messageDurationTip:
      'As mensagens somem depois desse tempo. Escolha "Para sempre" para mantê-las na tela, com as novas empurrando as antigas para cima.',
    hideBotsTip:
      'Oculta mensagens de bots comuns como Nightbot, StreamElements, Fossabot, BotRix e KickBot, e de contas com o emblema "Chat Bot" da Twitch ou "Bot" da Kick.',
    hideCommandsTip: 'Oculta mensagens que começam com "!", como !discord ou !uptime.',
    badgesTip: 'Mostra os emblemas de streamer, moderador, VIP e inscrito ao lado dos nomes.',
    animationTip:
      'Define como as mensagens novas entram na tela. As animações ficam mais curtas sozinhas quando o chat acelera.',
    usernameFont: 'Fonte do nome',
    messageFont: 'Fonte da mensagem',
    fontSystem: 'Padrão do sistema',
    textShadow: 'Sombra do texto',
    textShadowTip:
      'Uma borda escura atrás dos nomes e das mensagens. Forte contorna cada letra para o chat continuar legível em jogos claros; Nenhuma tira a sombra, até a do preset.',
    shadowNone: 'Nenhuma',
    shadowNormal: 'Normal',
    shadowStrong: 'Forte',
    messageLayout: 'Layout da mensagem',
    layoutInline: 'Em linha (nome: mensagem)',
    layoutStacked: 'Empilhado (nome em cima)',
    layoutCard: 'Cartão / Balão',
    layoutCompact: 'Compacto (estilo Twitch)',
    newMessageAnimation: 'Animação de nova mensagem',
    animSlide: 'Deslizar da direita + fade',
    animSmoothSlide: 'Deslizar suave da direita',
    animPop: 'Pop / crescer',
    animBounce: 'Quicar',
    animStagger: 'Escalonado (info primeiro, depois a mensagem)',
    animFade: 'Fade in',
    animTyping: 'Máquina de escrever',
    animNone: 'Sem animação',
    orientation: 'Orientação',
    vertical: 'Vertical',
    horizontal: 'Horizontal',
    fontSize: 'Tamanho da fonte (px)',
    darkBackground: 'Fundo escuro',
    emotes: 'Emotes',
    emotesNone: 'Desligado',
    messageDuration: 'Duração da mensagem',
    durationSeconds: '{count} s',
    durationMinutes: '{count} min',
    durationKeep: 'Para sempre',
    hideBots: 'Ocultar bots',
    hideCommands: 'Ocultar comandos',
    showBadges: 'Mostrar emblemas',
    showMessageTime: 'Mostrar horário',
    backgroundOpacity: 'Opacidade do fundo',
    messageBackgroundBox: 'Caixa de fundo da mensagem',
    messageBackgroundHint: 'Cada mensagem ganha sua própria caixa de fundo com borda.',
    platformAccent: 'Faixa com a cor da plataforma',
    platformAccentHint:
      'Uma faixa roxa da Twitch ou verde da Kick à esquerda mostra de onde veio cada mensagem.',
    boldUsernames: 'Nomes em negrito',
    boldMessages: 'Mensagens em negrito',
    highlights: 'Destaques',
    highlightsTip:
      'Escolha quais mensagens ganham uma barrinha colorida na live. As respostas mostram para quem estão respondendo, e as marcadas como Twitch só existem na Twitch.',
    highlightMention: 'Menções',
    highlightReply: 'Contexto da resposta',
    highlightFirstMessage: 'Primeira vez no chat',
    highlightAnnouncement: 'Anúncios',
    highlightHighlighted: 'Destacar minha mensagem',
    highlightsAll: 'Todos',
    highlightsNone: 'Desligado',
    announcement: 'Anúncio',
    firstMessage: 'Primeira vez no chat',
    previewTitle: 'Prévia do widget (Caixa de Chat)',
    previewIframeTitle: 'Prévia do widget de chat',
    previewSpeed: 'Velocidade do chat na prévia',
    previewSpeedValue: '{rate} msg/s',
    previewSpeedHint: 'Só muda a prévia. A URL do seu widget continua a mesma.',
    previewHint: 'Prévia do chat ao vivo com mensagens animadas.',
    guideTitle: 'Caixa de Chat no seu programa de live (OBS, Streamlabs, XSplit etc.)',
    guideStep1:
      'Adicione uma fonte de navegador no seu programa de live (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio etc.).',
    guideStep2: 'Cole a URL do widget multichat que você copiou.',
    guideStep3:
      'Ajuste a largura e a altura para o tamanho que você quer na caixa de chat (ex.: 400×600 na vertical).',
    browserSourceHintSize: ' (tamanho recomendado: 400×600 para a caixa de chat).',
    widgetUrlTip:
      'Já fez um widget? Cole a URL dele aqui para carregar suas configurações e mudar o que precisar.',
    widgetUrlPlaceholder: 'Cole a URL de um widget para editar',
    widgetUrlInvalid: 'Esta não é uma URL da Caixa de Chat.',
    openReader: 'Abrir Leitor de Chat',
    openReaderHint:
      'Leia seu próprio chat em uma aba do navegador ou em um painel do OBS. Ele reconecta sozinho, marca cada queda e guarda seu histórico quando você atualiza a página.',
    faq1Q: 'Preciso entrar na Twitch ou na Kick para usar a caixa de chat?',
    faq1A:
      'Não precisa de login. A Caixa de Chat ouve o chat público das duas plataformas de forma anônima.',
    faq2Q: 'Este widget multichat funciona com emotes da 7TV?',
    faq2A:
      'Sim. Os emotes de canal e globais da 7TV aparecem nas mensagens da Twitch e da Kick, e os emotes da BTTV e da FFZ só nas mensagens da Twitch. Os três vêm ligados por padrão, e você pode desligar qualquer um no menu Emotes.',
  },
  chatReader: {
    title: 'Leitor de Chat',
    listLabel: 'Mensagens do chat',
    noChannel:
      'Este link não tem canal. Abra o Leitor de Chat pela página de configuração da Caixa de Chat.',
    empty: 'Esperando mensagens em {channels}…',
    statusConnecting: 'Conectando',
    statusConnected: 'Conectado',
    statusReconnecting: 'Reconectando',
    notFound: 'Canal não encontrado',
    networkOffline: 'Você está sem internet. O chat reconecta sozinho assim que a conexão voltar.',
    retryIn: 'Conexão com o chat da {platform} caiu. Tentando de novo em {seconds}s.',
    retrying: 'Conexão com o chat da {platform} caiu. Tentando de novo agora…',
    retryNow: 'Tentar agora',
    fontSmaller: 'Texto menor',
    fontLarger: 'Texto maior',
    timestamps: 'Mostrar horário das mensagens',
    clear: 'Limpar histórico',
    clearConfirm: 'Clique de novo para limpar',
    deleted: '(apagada)',
    backToLive: 'Voltar ao chat ao vivo',
    newMessage: '{count} mensagem nova',
    newMessages: '{count} mensagens novas',
    eventConnected: 'Conectado ao chat da {platform}: {channel}',
    eventDisconnected: 'Conexão com o chat da {platform} caiu',
    eventReconnected: 'De volta ao chat da {platform} depois de {duration}',
    eventNetworkLost: 'Conexão com a internet caiu',
    eventNetworkBack: 'A internet voltou',
    eventChatCleared: 'Um moderador limpou o chat da {platform}',
    eventResumed: 'Salvo da sua última visita, até {time}',
    durationSeconds: '{seconds}s',
    durationMinutes: '{minutes}min {seconds}s',
    durationHours: '{hours}h {minutes}min',
  },
  obsBridge: {
    breadcrumb: 'Configurar OBS Bridge',
    title: 'Configurar OBS Bridge',
    intro:
      'Deixe as pessoas de confiança trocarem as cenas do OBS e iniciarem ou pararem sua transmissão e gravação pelo chat da Twitch ou da Kick. O bridge roda em uma aba do navegador ou em um painel do OBS e fala direto com o OBS.',
    sectionChannels: 'Canais',
    sectionUsers: 'Usuários autorizados',
    usersLabel: 'Nomes no chat',
    usersTip:
      'Só quem está nesta lista pode usar os comandos. Com a lista vazia, ninguém pode, nem você. Na Twitch, o nome é comparado com o login, o nome que aparece na URL do canal.',
    usersEmpty: 'Ninguém ainda, então ninguém pode usar comandos.',
    userPlatform: 'Plataforma',
    addUser: 'Adicionar',
    userPlaceholder: 'usuário',
    removeUser: 'Remover {name}',
    assignUser: 'Definir {name} como usuário da {platform}',
    pickPlatformWarning:
      'A Twitch e a Kick estão conectadas, então escolha uma plataforma para cada nome em amarelo. Eles não podem usar comandos até você escolher.',
    sectionCommands: 'Comandos',
    commandsHint:
      'A mensagem inteira precisa ser igual ao comando, maiúsculas não importam. Deixe um campo vazio para manter o padrão.',
    label: {
      cmdScene: 'Trocar cena',
      cmdBrb: 'Cena BRB',
      cmdBack: 'Voltar à principal',
      cmdStartStream: 'Iniciar transmissão',
      cmdStopStream: 'Parar transmissão',
      cmdStartRecord: 'Iniciar gravação',
      cmdStopRecord: 'Parar gravação',
    },
    action: {
      cmdScene: 'Troca para a cena que você digitar, tipo {example}',
      cmdBrb: 'Troca para a sua cena BRB',
      cmdBack: 'Volta para a sua cena principal',
      cmdStartStream: 'Inicia a transmissão',
      cmdStopStream: 'Encerra a transmissão',
      cmdStartRecord: 'Inicia a gravação',
      cmdStopRecord: 'Para a gravação',
    },
    sceneArg: '<nome>',
    sceneTip:
      'Digite o comando, um espaço e o nome de uma cena, tipo !scene Gaming. Uma cena com exatamente esse nome tem prioridade; se não houver, vale a primeira cujo nome contém o texto.',
    brbTip:
      'Troca para a cena BRB que você escolher na página da ferramenta. Por padrão não tem !, então qualquer pessoa da lista que digitar só brb troca a cena.',
    backTip:
      'Volta para a cena principal que você escolher na página da ferramenta. Igual ao brb, não tem ! por padrão.',
    sectionConnection: 'Conexão com o OBS',
    wsUrl: 'URL do WebSocket',
    wsUrlTip:
      'Só precisa se o OBS roda em outro computador ou se você mudou a porta. Deixe vazio para usar ws://127.0.0.1:4455.',
    wsUrlPlaceholder: 'ws://127.0.0.1:4455 (padrão)',
    wsPassword: 'Senha do WebSocket',
    wsPasswordTip:
      'Fica no OBS em Ferramentas → Configurações do servidor WebSocket → Mostrar informações da conexão. Ela fica salva na URL da ferramenta, então trate esse link como uma senha.',
    wsPasswordPlaceholder: 'Deixe vazio se não tiver',
    previewTitle: 'Prévia da ferramenta',
    previewIframeTitle: 'Prévia do OBS Bridge',
    summaryNotListening:
      'Nenhum canal da {platform} foi definido, então os comandos de {names} ainda não funcionam.',
    summaryNoChannel: 'Nenhum canal ainda. Adicione primeiro um canal da Twitch ou da Kick.',
    openTool: 'Abrir a ferramenta',
    openToolHint:
      'Abre o bridge ao vivo em uma nova aba. Ele conecta no OBS e no seu chat na hora.',
    toolUrlTip:
      'Ela contém a senha do seu OBS, então trate como uma: não compartilhe e não mostre na live.',
    toolUrlHint:
      'Abra em uma aba do navegador ou em um painel personalizável com URL do OBS e deixe aberta durante a live.',
    nextOpen: 'Abra em uma aba do navegador ou cole em um painel personalizável com URL do OBS.',
    nextKeepOpen: 'Escolha lá suas cenas principal e BRB e deixe a página aberta durante a live.',
    guideStep1:
      'No OBS, abra Ferramentas → Configurações do servidor WebSocket, ative o servidor WebSocket e copie a senha em Mostrar informações da conexão.',
    guideStep2:
      'Coloque seu canal, as pessoas que podem usar os comandos e a senha, depois copie a URL da ferramenta.',
    guideStep3:
      'Abra a URL em uma aba do navegador ou em um painel personalizável com URL do OBS e escolha suas cenas principal e BRB.',
    guideStep4:
      'Está usando um painel? Depois de escolher as cenas, clique em Copiar URL atualizada e cole no painel, porque o painel sempre abre a URL com que foi criado.',
    faq1Q: 'Como funciona o comando !scene no chat?',
    faq1A:
      'Alguém da sua lista digita o comando, um espaço e o nome de uma cena, tipo !scene Gaming. O OBS Bridge procura primeiro uma cena com exatamente esse nome, sem ligar para maiúsculas, depois a primeira cena cujo nome contém o texto, e troca para ela.',
    faq2Q: 'A senha do WebSocket do meu OBS fica segura?',
    faq2A:
      'A conexão com o OBS vai direto do seu navegador para o OBS. Mas a senha fica salva na URL da ferramenta, e abrir essa URL carrega a página de extensions.senchabot.com com a senha dentro. Então trate o link como uma senha: não compartilhe e não mostre na live.',
    faq3Q: 'Por que minhas cenas escolhidas sumiram no painel do OBS?',
    faq3A:
      'As cenas escolhidas e as mudanças de usuários ficam salvas na URL da página da ferramenta. Uma aba do navegador guarda isso se você salvar a página nos favoritos, mas um painel do OBS sempre abre a URL com que foi criado. Clique em Copiar URL atualizada na página da ferramenta e cole a nova URL no painel.',
    tool: {
      title: 'OBS Bridge',
      connectionsTitle: 'Conexões',
      status: {
        connecting: 'Conectando',
        connected: 'Conectado',
        failed: 'Não conectou',
        disconnected: 'Desconectado',
      },
      obsConnecting: 'Conectando a {url}…',
      obsConnected: '{url} · conectado desde {time}',
      obsUnreachable:
        'Sem resposta de {url}. O OBS está aberto e o servidor está ativado em Ferramentas → Configurações do servidor WebSocket?',
      obsWrongPassword:
        'O OBS não aceitou a senha. A senha da URL precisa ser igual à senha do WebSocket do seu OBS.',
      obsNeedsPassword:
        'O OBS pede uma senha, mas esta URL não tem nenhuma. Coloque a senha do WebSocket na página de configuração e use a URL nova.',
      obsRefused: 'O OBS recusou a conexão: {reason}',
      obsClosed:
        'A conexão com o OBS caiu. O OBS pode ter sido fechado ou o servidor WebSocket dele parou.',
      retryIn: 'Tentativa {attempt} em {seconds}s',
      retrying: 'Tentando de novo…',
      retryNow: 'Tentar agora',
      chat: {
        connecting: 'Conectando',
        connected: 'Ouvindo',
        reconnecting: 'Desconectado',
      },
      chatRetryIn: 'Reconectando em {seconds}s',
      chatNotFound: 'Não encontrado',
      kickNotFound: 'Não achei um canal da Kick chamado "{channel}". Confira o nome do canal.',
      activityTitle: 'Comandos recentes',
      activityEmpty:
        'Nenhum comando ainda. Eles aparecem aqui quando um usuário autorizado digita um no chat.',
      activityScene: 'Trocou para {scene}',
      activityStartStream: 'Transmissão iniciada',
      activityStopStream: 'Transmissão encerrada',
      activityStartRecord: 'Gravação iniciada',
      activityStopRecord: 'Gravação parada',
      activityNoScene: 'Nenhuma cena bate com "{query}"',
      activityOffline: 'Não rodou porque o OBS não estava conectado',
      activityFailed: 'O OBS devolveu um erro: {message}',
      scenesTitle: 'Cenas',
      scenes: 'Cenas ({count})',
      fetchingScenes: 'Carregando a lista de cenas…',
      scenesOffline: 'A lista de cenas aparece quando o OBS estiver conectado.',
      mainScene: 'Cena principal',
      brbScene: 'Cena BRB',
      notSelected: 'Não escolhida',
      main: 'Principal',
      brb: 'BRB',
      setMain: 'Usar {scene} como cena principal',
      setBrb: 'Usar {scene} como cena BRB',
      assignMainBrbWarning:
        'Escolha uma cena principal e uma BRB abaixo, senão {brb} e {back} não têm para onde ir.',
      assignMainWarning: 'Escolha uma cena principal abaixo, senão {back} não tem para onde ir.',
      assignBrbWarning: 'Escolha uma cena BRB abaixo, senão {brb} não tem para onde ir.',
      sceneHint:
        'Clique em Principal ou BRB ao lado de uma cena para definir. Qualquer outra cena funciona com {command}.',
      usersCount: 'Usuários autorizados ({count})',
      copyUrl: 'Copiar URL atualizada',
      copyUrlHint:
        'As cenas escolhidas e as mudanças de usuários ficam salvas na URL desta página. Um painel do OBS sempre abre a URL com que foi criado, então cole a URL copiada nas configurações do painel.',
      copyUrlManual: 'Não deu para copiar. Selecione a URL abaixo e copie você mesmo.',
      commands: 'Comandos do chat',
      footer: 'Deixe esta página aberta durante a live. O bridge para quando ela fecha.',
    },
  },
  subSprout: {
    breadcrumb: 'Configurar Sub Sprout',
    title: 'Configurar Sub Sprout',
    intro:
      'Um overlay de meta de subs em forma de planta, personalizável, que sobe de nível a cada nova inscrição na Twitch ou na Kick.',
    sectionPlant: 'Planta',
    plantVariety: 'Tipo de planta',
    plantVarietyTip:
      'Cada sub faz a planta crescer um estágio. Quanto mais estágios ela tem, mais subs precisa para crescer por completo.',
    stagesSuffix: '{stages} estágios',
    selectionMode: 'Troca de planta',
    selectionModeTip:
      'Depois do último estágio, a planta recomeça: a mesma planta, a próxima da lista ou outra aleatória. Em ordem e Aleatória nunca escolhem a Trepadeira.',
    fixed: 'Mesma planta',
    cycle: 'Em ordem',
    random: 'Aleatória',
    wateringEffect: 'Efeito de rega',
    wateringEffectTip:
      'Toca uma animação curta de chuva ou brilho toda vez que a planta cresce. A Trepadeira não mostra.',
    showSubCountEffect: 'Mostrar número de subs',
    subCountTip:
      'Mostra quantos subs chegaram de uma vez, tipo x5 para um pacote de 5 de presente.',
    showPotLabel: 'Mostrar estágio no vaso',
    potLabelTip: 'Escreve o estágio no vaso, tipo 3/10. A Trepadeira não mostra.',
    previewTitle: 'Prévia da planta de meta de subs',
    previewIframeTitle: 'Prévia do Sub Sprout',
    previewSpeed: 'Velocidade de crescimento na prévia',
    previewSpeedValue: '{rate}×',
    previewHint:
      'A prévia cresce com subs simulados. Na live, sua planta cresce com subs, resubs e subs de presente reais do seu canal.',
    widgetUrlTip:
      'Já fez um widget? Cole a URL dele aqui para carregar suas configurações e mudar o que precisar.',
    widgetUrlPlaceholder: 'Cole a URL de um widget para editar',
    widgetUrlInvalid: 'Esta não é uma URL do Sub Sprout.',
    browserSourceHintSize: ' (tamanho recomendado: 800×600).',
    guideTitle: 'Configuração no programa de live (OBS, Streamlabs, XSplit etc.)',
    guideStep1:
      'Adicione uma fonte de navegador no seu programa de live (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio etc.).',
    guideStep2: 'Cole a URL da planta de meta de subs que você copiou.',
    guideStep3: 'Coloque a largura em 800 e a altura em 600.',
    guideStep4:
      'O streamer e os mods podem digitar !grow no chat para fazer a planta crescer na mão, ou !grow reset para recomeçar a planta.',
    faq1Q: 'Preciso entrar em alguma conta para usar a planta de meta de subs?',
    faq1A:
      'Não precisa de cadastro nem de login OAuth. O Sub Sprout se conecta de forma anônima, ouvindo os eventos do chat público.',
    faq2Q: 'O que acontece quando a planta de meta de subs cresce por completo?',
    faq2A:
      'Quando a planta está totalmente crescida, o próximo sub faz ela recomeçar de acordo com a configuração Troca de planta: a mesma planta, o próximo tipo ou uma aleatória.',
    faq3Q: 'A planta recomeça quando a fonte de navegador recarrega?',
    faq3A:
      'Não. A planta fica salva dentro do OBS, então mantém o estágio que alcançou depois de um recarregamento, de uma troca de cena e na próxima live. Para recomeçar, peça para um mod digitar !grow reset no chat.',
  },
  subathon: {
    breadcrumb: 'Configurar Subathon Timer',
    title: 'Configurar Subathon Timer',
    intro:
      'Um timer de subathon para Twitch e Kick. Ele faz a contagem regressiva, e cada sub, sub de presente, cheer de Bits ou envio de Kicks adiciona tempo. Mostre como uma barra de vida estilo game que vai esvaziando até zero, um relógio grande ou um anel, e você decide quanto tempo cada um adiciona.',
    style: 'Estilo',
    styleTip:
      'Barra de vida esvazia de 100% até zero como um personagem de game. Barra fina coloca o título e o tempo dentro de uma barra mais estreita. Relógio mostra números grandes. Anel mostra um círculo que vai esvaziando.',
    styleBar: 'Barra de vida',
    styleThin: 'Barra fina',
    styleClock: 'Relógio',
    styleRing: 'Anel',
    color: 'Cor',
    colorTip:
      'Vida vai do verde ao amarelo e ao vermelho conforme o tempo acaba. As outras ficam em uma cor só.',
    colors: {
      hp: 'Vida (verde a vermelho)',
      green: 'Verde',
      purple: 'Roxo',
      red: 'Vermelho',
      gold: 'Dourado',
      cyan: 'Ciano',
      pink: 'Rosa',
    },
    titleLabel: 'Título',
    titleTip: 'Aparece ao lado do timer. Deixe vazio para não mostrar título.',
    titlePlaceholder: 'Sem título',
    showPercent: 'Mostrar porcentagem',
    showPercentTip:
      'Mostra o quanto o timer está cheio. 100% é o maior tempo que ele já teve até agora, então nunca passa disso.',
    showPops: 'Mostrar tempo adicionado',
    showPopsTip: 'Faz subir um +1:00 com o nome do espectador toda vez que entra tempo.',
    sectionTimer: 'Timer',
    startTime: 'Tempo inicial',
    startTimeTip:
      'De onde o timer começa. Só vale para um subathon novo: para recomeçar com outro valor, digite !subathon reset no chat.',
    maxTime: 'Limite de tempo',
    maxTimeTip:
      'O timer nunca guarda mais que isso. O tempo que passaria do limite não é adicionado.',
    maxTimeOff: 'Sem limite',
    startMode: 'Início',
    startModeTip:
      'Com o comando, o timer espera pausado até você ou um mod digitar no chat. Na hora faz ele começar assim que o overlay carrega no OBS.',
    startCommand: 'Com {command}',
    startAuto: 'Na hora',
    sectionValues: 'Tempo adicionado',
    valuesHint: 'Coloque qualquer um em 0 para desligar.',
    dynamicRates: 'Ajustar valores pelo tempo',
    dynamicRatesTip: 'Usa um segundo conjunto de valores quando o relógio já tem bastante tempo.',
    shiftAt: 'Limite de troca',
    shiftAtTip:
      'Enquanto o tempo restante estiver igual ou acima disso, vale o segundo conjunto de valores.',
    tier2Rates: 'Acima do limite de troca',
    perSub: 'Por sub',
    perSubTip: 'Cada sub novo e resub. Na Twitch, é um sub Tier 1 ou Prime.',
    perSubKickTip: 'Cada sub novo e resub.',
    perGift: 'Por sub de presente',
    perGiftTip: 'Conta cada sub do presente, então um presente de 5 adiciona isso cinco vezes.',
    perBits: 'A cada 500 Bits',
    perBitsTip:
      'Mais ou menos o preço de um sub. Outros valores adicionam a parte proporcional, então 100 Bits adicionam um quinto.',
    perKicks: 'A cada 500 Kicks',
    perKicksTip:
      'Outros valores adicionam a parte proporcional, então 100 Kicks adicionam um quinto.',
    showRates: 'Mostrar no timer',
    showRatesTip:
      'Lista quanto um sub, um sub de presente e 500 Bits ou Kicks adicionam, para o pessoal saber quanto vale o sub. Valores em 0 ficam de fora. Quando Twitch e Kick têm valores diferentes, eles se revezam.',
    ratesLanguage: 'Idioma do timer',
    ratesLanguageTip:
      'O idioma das palavras da lista, tipo "Sub de presente" e "min". A URL do OBS guarda isso, seja qual for o idioma do OBS.',
    rateSub: 'Sub',
    rateGift: 'Sub de presente',
    rateBits: '{amount} Bits',
    rateKicks: '{amount} Kicks',
    rateBitsKicks: '{amount} Bits/Kicks',
    tiers: 'Tier 2 e 3 valem mais',
    tiersTip:
      'Na Twitch, um sub Tier 2 adiciona o tempo de 2 subs e um Tier 3 o de 5, de acordo com o preço.',
    unitHours: 'h',
    unitMinutes: 'min',
    sectionCommands: 'Comandos do chat',
    commandsIntro: 'Você e seus mods controlam o timer pelo chat da Twitch ou da Kick.',
    cmdStart: 'Inicia ou retoma o timer',
    cmdPause: 'Pausa o timer',
    cmdAdd: 'Adiciona tempo',
    cmdRemove: 'Tira tempo',
    cmdSet: 'Define o tempo restante',
    cmdReset: 'Recomeça do tempo inicial',
    commandsDurations:
      'Escreva os tempos como 10m, 1h30m, 45s ou 1:30:00. Um número sozinho vale minutos.',
    previewTitle: 'Prévia do Subathon Timer',
    previewIframeTitle: 'Prévia do Subathon Timer',
    previewHint:
      'A prévia toca subs, presentes e cheers simulados. Na live, o timer corre em tempo real e só o seu chat adiciona tempo.',
    previewSpeed: 'Velocidade da prévia',
    previewSpeedTip:
      '1× é tempo real. Em 60×, um timer de uma hora acaba em mais ou menos um minuto.',
    previewSpeedValue: '{rate}×',
    testTitle: 'Teste:',
    testViewer: 'Você',
    testSub: '+1 sub',
    testGift: '+5 de presente',
    testBits: '+500 Bits/Kicks',
    testRemove: '−10 min',
    testPause: 'Pausar / Retomar',
    testReset: 'Zerar',
    widgetUrlTip:
      'Já fez um widget? Cole a URL dele aqui para carregar suas configurações e mudar o que precisar.',
    widgetUrlPlaceholder: 'Cole a URL de um widget para editar',
    widgetUrlInvalid: 'Esta não é uma URL do Subathon Timer.',
    browserSourceHintSize: ' (tamanho recomendado: 800×300).',
    guideTitle: 'Configuração no programa de live (OBS, Streamlabs, XSplit etc.)',
    guideStep1:
      'Adicione uma fonte de navegador no seu programa de live (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio etc.).',
    guideStep2: 'Cole a URL do timer de subathon que você copiou.',
    guideStep3: 'Coloque a largura em 800 e a altura em 300.',
    guideStep4:
      'Quando abrir a live, digite !subathon start no chat. Os mods também podem adicionar, tirar ou pausar o tempo.',
    faq1Q: 'O que acontece se o OBS fechar ou a fonte de navegador recarregar?',
    faq1A:
      'O timer fica salvo dentro do OBS, então volta de onde parou. Com o OBS fechado ele continua a contagem, como um prazo de verdade. Os subs que chegam com ele fechado não são vistos, então um mod pode adicioná-los com !subathon add.',
    faq2Q: 'O que acontece quando o timer chega a zero?',
    faq2A:
      'O timer para no zero e a barra de vida mostra K.O. Subs novos não adicionam mais tempo. Um mod pode trazer o timer de volta com !subathon add ou !subathon set, ou começar um novo com !subathon reset.',
    faq3Q: 'Como começo um subathon novo ou mudo o tempo inicial?',
    faq3A:
      'Digite !subathon reset no chat. O timer volta para o tempo inicial da URL. Enquanto o timer não tiver começado pela primeira vez, um novo tempo inicial na URL já vale sozinho.',
    faq4Q: 'Preciso fazer login ou conectar minha conta?',
    faq4A:
      'Não. O timer lê subs, presentes, Bits, Kicks e comandos dos mods no seu chat público da Twitch e da Kick, do jeito que um espectador deslogado vê.',
  },
  goal: {
    breadcrumb: 'Configurar Meta de Subs',
    title: 'Configurar Meta de Subs',
    intro:
      'Uma barra de meta de subs para Twitch e Kick. Cada sub novo, resub e sub de presente dos dois chats enche a barra em um, e um troféu cai na barra quando você bate a meta. Escolha de onde a contagem começa e onde fica a meta, e seus mods podem corrigir a contagem pelo chat.',
    sectionGoal: 'Meta',
    start: 'Contagem inicial',
    startTip:
      'De onde a contagem começa: o número de subs do seu painel, ou 0 para contar só esta live. Mudar isso depois recomeça a contagem a partir do novo número.',
    target: 'Meta',
    targetTip: 'A barra fica cheia nesse número. A contagem continua depois dele.',
    countsHint:
      'Cada sub e resub soma 1, seja Prime ou qualquer tier. Um presente soma 1 para cada sub dentro dele.',
    style: 'Estilo',
    styleTip:
      'Barra coloca o título da meta e a contagem acima da barra. Barra fina coloca o título e a contagem direto dentro de uma barra mais estreita.',
    styleBar: 'Barra',
    styleThin: 'Barra fina',
    color: 'Cor',
    titleLabel: 'Título',
    titleTip: 'Aparece acima da barra. Deixe vazio para não mostrar título.',
    titlePlaceholder: 'Sem título',
    showPops: 'Mostrar novos subs',
    showPopsTip:
      'Faz subir um +1 com o nome do espectador a cada sub, ou +5 para um presente de 5.',
    sectionCommands: 'Comandos do chat',
    commandsIntro:
      'Você e seus mods podem corrigir a contagem pelo chat da Twitch ou da Kick, por exemplo para somar subs que chegaram com o OBS fechado.',
    cmdAdd: 'Soma subs à contagem, 1 se você não colocar o número',
    cmdRemove: 'Tira subs da contagem, 1 se você não colocar o número',
    cmdSet: 'Define a contagem',
    cmdReset: 'Volta para a contagem inicial',
    previewTitle: 'Prévia da Meta de Subs',
    previewIframeTitle: 'Prévia da Meta de Subs',
    previewHint:
      'A prévia toca subs e presentes simulados até bater a meta, depois recomeça. Na live, só o seu chat soma na contagem.',
    testTitle: 'Teste:',
    testViewer: 'Você',
    testSub: '+1 sub',
    testGift: '+5 de presente',
    testReach: 'Bater a meta',
    testReset: 'Zerar',
    widgetUrlTip:
      'Já fez um widget? Cole a URL dele aqui para carregar suas configurações e mudar o que precisar.',
    widgetUrlPlaceholder: 'Cole a URL de um widget para editar',
    widgetUrlInvalid: 'Esta não é uma URL da Meta de Subs.',
    browserSourceHintSize: ' (tamanho recomendado: 800×260).',
    guideTitle: 'Configuração no programa de live (OBS, Streamlabs, XSplit etc.)',
    guideStep1:
      'Adicione uma fonte de navegador no seu programa de live (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio etc.).',
    guideStep2: 'Cole a URL da meta de subs que você copiou.',
    guideStep3: 'Coloque a largura em 800 e a altura em 260.',
    guideStep4: 'Se a contagem sair errada, você ou um mod pode corrigir com !goal set no chat.',
    faq1Q: 'Por que ela não lê meu número de subs da Twitch ou da Kick?',
    faq1A:
      'Nenhuma das plataformas mostra o número de subs de um canal para uma página sem login, e esta meta nunca pede login. Então você digita sua contagem inicial uma vez, e a partir daí cada sub e presente que chega soma nela.',
    faq2Q: 'O que acontece se o OBS fechar ou a fonte de navegador recarregar?',
    faq2A:
      'A contagem fica salva dentro do OBS, então volta de onde parou, inclusive na próxima live. Os subs que chegam com o OBS fechado não são vistos, então um mod pode somá-los com !goal add.',
    faq3Q: 'Resubs e subs de presente contam?',
    faq3A:
      'Sim. Cada sub novo e resub soma 1, e um presente soma 1 para cada sub dentro dele, então um presente de 5 soma 5. Na Twitch, o resub conta quando o espectador compartilha no chat, e na Kick, quando renova.',
    faq4Q: 'Dá para fazer uma meta de seguidores?',
    faq4A:
      'Ainda não. A Twitch e a Kick não mostram os novos follows para uma página sem login, então a meta conta subs, do mesmo jeito nas duas plataformas.',
  },
  frames: {
    breadcrumb: 'Configurar Molduras de Live',
    title: 'Configurar Molduras de Live',
    intro:
      'Molduras prontas para sua câmera, seu chat ou a tela inteira da live. O preset que você escolher desenha a moldura no estilo daquele jogo, até no formato, nos enfeites e no movimento: telhado de pagode, borlas balançando e pétalas voando no Dynasty, blocos de grama e tochas piscando no Blocks. Nenhum canal para conectar. Adicione a URL no OBS e coloque sua câmera ou seu chat embaixo da moldura.',
    sectionPiece: 'Moldura',
    piece: 'O que você vai emoldurar?',
    pieceTip:
      'Cada peça é uma fonte de navegador separada. Adicione as três com o mesmo preset e tudo na tela combina.',
    pieces: {
      camera: 'Câmera',
      chat: 'Chat',
      screen: 'Tela',
    },
    pieceHints: {
      camera: 'Uma moldura 16:9 para sua webcam. Encaixe a câmera na abertura do meio.',
      cameraPortrait:
        'Uma moldura 9:16 para a câmera do celular ou uma webcam de lado. Encaixe a câmera na abertura do meio.',
      chat: 'Uma moldura alta com cabeçalho para a Caixa de Chat. Coloque a Caixa de Chat embaixo do cabeçalho.',
      screen:
        'Uma moldura fina nas bordas da live inteira. Os enfeites ficam nos cantos para não cobrir seu jogo.',
    },
    orientation: 'Orientação',
    orientations: {
      landscape: 'Paisagem',
      portrait: 'Retrato',
    },
    labelLabel: 'Rótulo',
    labelTips: {
      camera:
        'Aparece na aba em cima da sua câmera, tipo o nome do seu canal. Deixe vazio e a aba fica só com o enfeite.',
      chat: 'Aparece na aba em cima da moldura do chat. Deixe vazio e a aba fica só com o enfeite.',
      screen:
        'Aparece na placa no centro da parte de baixo da tela. Deixe vazio para esconder a placa.',
    },
    labelPlaceholder: 'Sem rótulo',
    color: 'Cor',
    motion: 'Animações',
    motionTip:
      'Linhas brilhando, reflexos de luz e detalhes que dependem do preset, tipo lanternas, tochas ou faíscas. Desligue e a moldura fica parada.',
    previewTitle: 'Prévia da moldura',
    previewIframeTitle: 'Prévia da moldura',
    previewHint:
      'A silhueta e as linhas de chat da prévia são só exemplos. Na live, o meio da moldura é transparente, então sua câmera ou seu chat aparece por baixo.',
    widgetUrlTip:
      'Já fez uma moldura? Cole a URL dela aqui para carregar suas configurações e mudar o que precisar.',
    widgetUrlPlaceholder: 'Cole a URL de uma moldura para editar',
    widgetUrlInvalid: 'Esta não é uma URL das Molduras de Live.',
    browserSourceHintSize: ' (tamanho recomendado: {width}×{height}).',
    guideTitle: 'Configuração no programa de live (OBS, Streamlabs, XSplit etc.)',
    guideStep1:
      'Adicione uma fonte de navegador no seu programa de live (OBS Studio, Streamlabs Desktop, XSplit, vMix etc.) e cole a URL da moldura.',
    guideStep2:
      'Coloque a largura e a altura no tamanho recomendado. Para uma câmera quadrada, digite seu próprio tamanho. A moldura se ajusta a qualquer tamanho.',
    guideStep3:
      'Na lista de Fontes, coloque a moldura acima da sua câmera ou da Caixa de Chat e depois posicione por cima delas na cena.',
    guideStep4:
      'Deixe a câmera grande o bastante para preencher a abertura, mas dentro da borda externa da moldura. Numa moldura de 640 × 360, 590 × 296 encaixa certinho, e numa moldura retrato de 360 × 640, 306 × 572.',
    faq1Q: 'A moldura mostra minha câmera ou meu chat sozinha?',
    faq1A:
      'Não. O meio da moldura é transparente, ela é só enfeite. Você adiciona sua câmera e a Caixa de Chat no OBS como fontes separadas e coloca embaixo da moldura.',
    faq2Q: 'Preciso conectar minha conta da Twitch ou da Kick?',
    faq2A:
      'Não. A moldura não lê o chat e não precisa do nome do canal. Funciona igual se você faz live na Twitch, na Kick ou em qualquer outro lugar.',
    faq3Q: 'Posso usar a moldura da câmera em outro tamanho?',
    faq3A:
      'Sim. Para uma câmera vertical, coloque Orientação em Retrato e o tamanho recomendado vira 360 × 640. A moldura é desenhada para caber na fonte de navegador, então para uma câmera quadrada é só ajustar a largura e a altura, e os enfeites acompanham.',
    faq4Q: 'A arte das molduras foi tirada dos jogos?',
    faq4A:
      'Não. Todo desenho, como o telhado de pagode, as lanternas ou os blocos de pixel, foi feito do zero, sem logos nem arte dos jogos. Os presets são estilos feitos por fãs que capturam a vibe desses jogos.',
  },
  countdown: {
    breadcrumb: 'Configurar Contagem Regressiva',
    title: 'Configurar Contagem Regressiva',
    intro:
      'Uma contagem regressiva para as partes da live em que nada está rolando ainda: os minutos antes de você entrar ao vivo, uma pausa no meio e os últimos minutos antes de encerrar. Defina uma duração ou o horário em que você quer começar, e ela pega o visual do preset que você escolher. Não precisa de canal, mas com um canal seus mods podem adiar pelo chat.',
    scenes: {
      starting: {
        label: 'Início',
        title: 'Começando em breve',
        done: 'Estamos ao vivo!',
        hint: 'Para a cena em que você fica antes de entrar ao vivo.',
      },
      break: {
        label: 'Pausa',
        title: 'Já volto',
        done: 'Voltei!',
        hint: 'Para uma pausa no meio: comida, um descanso, uma saidinha rápida.',
      },
      ending: {
        label: 'Encerramento',
        title: 'Fim da live',
        done: 'Valeu por assistir!',
        hint: 'Para os últimos minutos, para o chat saber quanto falta.',
      },
    },
    sectionCountdown: 'Contagem',
    scene: 'Para que é?',
    sceneTip: 'Isso escolhe o texto e o ícone. Você pode escrever seu próprio texto mais abaixo.',
    mode: 'Contar até',
    modes: {
      duration: 'Uma duração',
      clock: 'Um horário',
    },
    modeTip:
      'Uma duração começa no momento em que a fonte de navegador carrega. Um horário sempre termina naquela hora, então você pode adicionar a fonte horas antes.',
    duration: 'Duração',
    durationUnit: 'min',
    durationTip: 'Quanto tempo a contagem dura, de 1 minuto a 24 horas.',
    atLabel: 'Horário',
    atTip:
      'Um horário de 24 horas tipo 21:00, lido do relógio do computador que roda o OBS. Se já passou hoje, a contagem mira no dia seguinte.',
    atPlaceholder: '21:00',
    atInvalid: 'Digite um horário de 24 horas, tipo 21:00.',
    ending: 'No zero',
    endings: {
      text: 'Mostrar mensagem',
      hold: 'Parar em 00:00',
      hide: 'Esconder',
    },
    endingTip: 'O que fica na tela depois que a contagem acaba, até você trocar de cena.',
    sectionText: 'Texto',
    titleLabel: 'Título',
    titleTip: 'Acima do relógio. Deixe vazio para usar o texto da cena que você escolheu.',
    titlePlaceholder: 'Texto da cena',
    noteLabel: 'Nota',
    noteTip: 'Uma linha embaixo do relógio, ex.: o motivo da pausa. Deixe vazio para esconder.',
    notePlaceholder: 'Sem nota',
    doneLabel: 'Mensagem no zero',
    doneTip: 'Substitui o relógio quando o tempo acaba. Deixe vazio para usar o texto da cena.',
    look: 'Fundo',
    looks: {
      card: 'Painel',
      plain: 'Sem painel',
    },
    lookTip: 'Um painel atrás do relógio, ou o texto direto na sua cena.',
    color: 'Cor',
    showBar: 'Barra de progresso',
    showBarTip: 'Uma barra embaixo do relógio que vai esvaziando conforme o tempo acaba.',
    motion: 'Animações',
    motionTip: 'O relógio pulsa no último minuto. Desligue e tudo fica parado.',
    channelsTip:
      'Só precisa para os comandos do chat. Sem canal, a contagem roda sozinha do mesmo jeito.',
    sectionCommands: 'Comandos do chat',
    commandsIntro:
      'Com um canal preenchido, você e seus mods podem mudar a contagem pelo chat da Twitch ou da Kick, por exemplo para adiar o início enquanto você está longe do teclado.',
    cmdAdd: 'Adiciona tempo: 5m, 90s ou 1h30m',
    cmdRemove: 'Tira tempo',
    cmdSet: 'Define o tempo restante',
    cmdPause: 'Pausa; start faz voltar a correr',
    cmdReset: 'Recomeça a contagem',
    previewTitle: 'Prévia da Contagem Regressiva',
    previewIframeTitle: 'Prévia da Contagem Regressiva',
    previewHint:
      'A prévia corre acelerada para você ver a contagem inteira, depois recomeça. Na live, ela conta em tempo real.',
    testTitle: 'Teste:',
    testAdd: '+1 min',
    testRemove: '-1 min',
    testPause: 'Pausar',
    testFinish: 'Pular pro zero',
    widgetUrlTip:
      'Já fez uma contagem? Cole a URL dela aqui para carregar suas configurações e mudar o que precisar.',
    widgetUrlPlaceholder: 'Cole a URL de uma contagem para editar',
    widgetUrlInvalid: 'Esta não é uma URL da Contagem Regressiva.',
    browserSourceHintSize: ' (tamanho recomendado: 1920×1080).',
    guideTitle: 'Configuração no programa de live (OBS, Streamlabs, XSplit etc.)',
    guideStep1:
      'Adicione uma fonte de navegador na sua cena de início, pausa ou encerramento e cole a URL da contagem.',
    guideStep2:
      'Coloque a largura em 1920 e a altura em 1080, para o relógio ficar no meio da cena.',
    guideStep3:
      'Marque "Atualizar o navegador quando a cena se tornar ativa", para a contagem recomeçar toda vez que você trocar para essa cena.',
    guideStep4:
      'Troque para a cena para começar. Com um canal preenchido, um mod pode adiar com !countdown add 5m enquanto você está fora.',
    faq1Q: 'Quando a contagem começa?',
    faq1A:
      'No momento em que a fonte de navegador carrega: quando o OBS abre, ou quando você troca para a cena com "Atualizar o navegador quando a cena se tornar ativa" marcado. Assim, uma contagem de pausa recomeça toda vez que você vai para a cena BRB, em vez de acabar enquanto você ainda está ao vivo.',
    faq2Q: 'Dá para contar até o horário que eu anunciei, tipo 21:00?',
    faq2A:
      'Sim. Coloque Contar até em Um horário e digite 21:00. Ela lê o relógio do computador que roda o OBS, então você pode adicionar a fonte horas antes e ela ainda termina às 21:00. Se 21:00 já passou hoje, ela mira no dia seguinte.',
    faq3Q: 'Preciso conectar minha conta da Twitch ou da Kick?',
    faq3A:
      'Não. A contagem roda sozinha, sem canal e sem login. Você só preenche um canal se quiser os comandos !countdown, e aí ela lê seu chat público do mesmo jeito que os outros widgets.',
    faq4Q: 'O que acontece quando chega a zero?',
    faq4A:
      'O que você escolher em No zero: uma mensagem tipo "Estamos ao vivo!", o relógio parado em 00:00, ou o overlay sumindo e deixando a cena limpa. Ela nunca troca de cena por você.',
  },
  poll: {
    breadcrumb: 'Configurar Enquete do Chat',
    title: 'Configurar Enquete do Chat',
    intro:
      'Uma enquete no chat para Twitch e Kick. Você ou um mod abre a enquete pelo chat, os espectadores votam digitando um número, e as barras enchem ao vivo na sua live. Os votos dos dois chats entram na mesma enquete, cada espectador conta uma vez, e o vencedor aparece quando o tempo acaba.',
    sectionPoll: 'Enquete pronta',
    question: 'Pergunta',
    questionTip: 'Aparece acima das opções. Deixe vazio se você fizer a pergunta em voz alta.',
    questionPlaceholder: 'O que a gente joga agora?',
    options: 'Opções',
    optionsTip:
      'O pessoal vota com o número ao lado da opção, ou digitando a própria opção. Até 6 opções.',
    optionLabel: 'Opção {n}',
    optionPlaceholder: 'Opção {n}',
    removeOption: 'Remover opção {n}',
    addOption: '+ Adicionar opção',
    pollHint:
      'Fica salva na URL. Abra com {command} no chat. Os mods também podem criar uma enquete nova no chat quando quiserem.',
    sectionVoting: 'Votação',
    duration: 'Duração da enquete',
    durationTip:
      'Por quanto tempo a enquete aceita votos. No chat, um mod pode dar outra duração a uma enquete, encerrar antes ou adicionar tempo.',
    durationOff: 'Sem timer: a enquete fica aberta até um mod digitar !poll end.',
    hold: 'Resultado na tela',
    holdTip:
      'Por quanto tempo o resultado fica na tela depois que a votação acaba. Depois a enquete sai da tela.',
    holdOff: 'O resultado fica na tela até a próxima enquete ou até !poll cancel.',
    delay: 'Atraso da live',
    delayTip:
      'O pessoal vê sua live alguns segundos depois do chat, então um voto digitado com "1 segundo restante" chega atrasado. Os votos continuam contando por essa quantidade de segundos depois que o timer acaba. Twitch e Kick costumam ter de 2 a 10 segundos de atraso.',
    voters: 'Quem pode votar',
    votersTip: 'Inscritos quer dizer espectadores com emblema de inscrito ou de fundador, e você.',
    votersAll: 'Todos',
    votersSubs: 'Inscritos',
    subWeight: 'Voto de sub vale',
    subWeightTip:
      'O voto de um inscrito conta essa quantidade de vezes. A enquete avisa isso na tela.',
    subWeightValue: '{n}×',
    change: 'Pode mudar o voto',
    changeTip:
      'Ligado: digitar outro número muda o voto. Desligado: vale o primeiro voto. De qualquer jeito, cada espectador conta uma vez.',
    blind: 'Esconder resultado até o fim',
    blindTip:
      'As barras ficam escondidas enquanto a votação está aberta, para os primeiros votos não influenciarem o resto. Só aparece o total de votos.',
    color: 'Cor',
    position: 'Posição',
    positionTip:
      'Onde a enquete fica na fonte de navegador. Ela cresce a partir dali conforme o número de opções.',
    positionTop: 'Em cima',
    positionBottom: 'Embaixo',
    language: 'Idioma da enquete',
    languageTip:
      'O idioma das palavras da enquete, tipo "Resultado" e o Sim e Não de uma enquete rápida.',
    unitMinutes: 'min',
    unitSeconds: 's',
    sectionCommands: 'Comandos do chat',
    commandsIntro:
      'Você e seus mods fazem enquetes pelo chat da Twitch ou da Kick. As partes de uma enquete nova são separadas com |.',
    exampleQuestion: 'Pergunta',
    cmdNew: 'Abre uma enquete nova com 2 a 6 opções',
    cmdNewTime: 'O mesmo, com duração própria, tipo 90s, 2m ou 1:30',
    cmdYesNo: 'Abre uma enquete rápida de Sim ou Não',
    cmdStart: 'Abre a enquete pronta desta página',
    cmdExtend: 'Adiciona tempo à enquete',
    cmdEnd: 'Encerra a votação agora e mostra o resultado',
    cmdCancel: 'Tira a enquete da tela',
    votingIntro:
      'O pessoal vota digitando só o número (2), !vote 2 ou o texto da opção. Uma mensagem com mais coisa, tipo "2 por favor", não conta. O comando /vote da Twitch é para as enquetes da própria Twitch, então peça para o chat digitar o número.',
    previewTitle: 'Prévia da Enquete do Chat',
    previewIframeTitle: 'Prévia da Enquete do Chat',
    previewHint:
      'A prévia toca uma enquete com votos simulados, mais rápido que o tempo real, e depois começa a próxima. Na live, a enquete só aparece quando você ou um mod abre uma.',
    testTitle: 'Teste:',
    testVotes: '+{count} votos',
    testExtend: '+30 s',
    testEnd: 'Encerrar agora',
    testNew: 'Nova enquete',
    widgetUrlTip:
      'Já fez um widget? Cole a URL dele aqui para carregar suas configurações e mudar o que precisar.',
    widgetUrlPlaceholder: 'Cole a URL de um widget para editar',
    widgetUrlInvalid: 'Esta não é uma URL da Enquete do Chat.',
    browserSourceHintSize: ' (tamanho recomendado: 640×560).',
    guideTitle: 'Configuração no programa de live (OBS, Streamlabs, XSplit etc.)',
    guideStep1:
      'Adicione uma fonte de navegador no seu programa de live (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio etc.).',
    guideStep2: 'Cole a URL da enquete do chat que você copiou.',
    guideStep3: 'Coloque a largura em 640 e a altura em 560.',
    guideStep4:
      'A fonte fica vazia até uma enquete começar. Digite !poll start, ou !poll Pergunta | A | B, no chat.',
    faq1Q: 'Como o pessoal vota?',
    faq1A:
      'Digitando o número da opção no chat, tipo 2. !vote 2 e o próprio texto da opção também funcionam, com maiúscula ou minúscula e com ou sem letras turcas. A mensagem inteira precisa ser o voto, então "2 por favor" ou 4Head não contam.',
    faq2Q: 'Um espectador pode votar mais de uma vez?',
    faq2A:
      'Não. Cada conta da Twitch ou da Kick conta uma vez. Com a troca de voto ligada, um número novo muda o voto e nunca soma um segundo. Se um mod der timeout ou ban em uma conta com a enquete aberta, o voto dela sai, o que ajuda contra bots de spam.',
    faq3Q: 'Por que não usar as enquetes da própria Twitch ou Kick?',
    faq3A:
      'Esta enquete junta os votos da Twitch e da Kick em um resultado só e funciona igual nas duas. As enquetes da Twitch não podem ser lidas sem login, e este overlay nunca pede login. Você também não precisa ser Afiliado nem Parceiro.',
    faq4Q: 'O que acontece se o OBS fechar ou a fonte de navegador recarregar?',
    faq4A:
      'A enquete e os votos ficam salvos dentro do OBS, então ela volta de onde parou. O timer continua correndo com o OBS fechado, mas os votos digitados nesse tempo não são vistos.',
    faq5Q: 'Por que os votos ainda contam depois que o timer zera?',
    faq5A:
      'O pessoal assiste sua live alguns segundos atrás do chat, então quando o timer deles mostra 1 segundo, no chat já acabou. O Atraso da live continua contando votos por mais alguns segundos, 5 por padrão, e o vencedor aparece depois disso.',
    overlay: {
      label: 'Enquete',
      closing: 'Últimos votos',
      results: 'Resultado',
      tie: 'Empate',
      tieHint: 'Deu empate!',
      winner: 'Vencedor: {option}',
      noVotes: 'Sem votos',
      hidden: 'O resultado aparece quando a votação acabar',
      howTo: 'Digite de 1 a {last} no chat',
      howToTwo: 'Digite 1 ou 2 no chat',
      subsOnly: 'Só inscritos',
      subBonus: 'Voto de sub ×{n}',
      votes: '{count} votos',
      voteOne: '1 voto',
      yes: 'Sim',
      no: 'Não',
      sampleQuestion: 'O que a gente joga agora?',
      sampleOption1: 'Jogo de terror',
      sampleOption2: 'Speedrun',
      sampleOption3: 'Jogar com o chat',
    },
  },
  streamAlerts: {
    breadcrumb: 'Configurar Alertas de Live',
    title: 'Configurar Alertas de Live',
    intro:
      'Alertas animados para lives na Twitch e na Kick. Um sub novo, subs de presente, Bits, Kicks ou um raid ganham cada um um alerta com ícone e som próprios, um depois do outro. Escolha uma cor, renomeie os títulos e defina o menor presente, cheer ou raid que merece um alerta.',
    color: 'Cor',
    theme: 'Tema',
    themeTip:
      'Neon é um banner sci-fi anguloso com sons de sintetizador. Celestial é um cartão com linhas douradas sob as estrelas, com som de sinos.',
    themes: {
      neon: 'Neon',
      celestial: 'Celestial',
    },
    colorTip: 'Plataforma mostra os alertas da Twitch em roxo e os da Kick em verde.',
    colors: {
      blue: 'Azul',
      purple: 'Roxo',
      pink: 'Rosa',
      red: 'Vermelho',
      gold: 'Dourado',
      green: 'Verde',
      platform: 'Plataforma (Twitch roxo, Kick verde)',
    },
    language: 'Idioma do alerta',
    languageTip:
      'O idioma das palavras do alerta. A URL do OBS guarda isso, seja qual for o idioma do OBS.',
    sectionAlerts: 'Alertas',
    heading: 'Título',
    kindSub: 'Subs',
    kindSubTip:
      'Cada sub novo e resub, e o resub que o espectador compartilha no chat com uma mensagem.',
    kindGift: 'Subs de presente',
    kindGiftTip: 'Um alerta por presente, não importa quantos subs ele tenha.',
    kindBits: 'Bits e Kicks',
    kindBitsTip: 'Bits enviados na Twitch e Kicks enviados na Kick.',
    kindRaid: 'Raids',
    kindRaidTip: 'Outro canal dando raid no seu, com quantos espectadores vieram junto.',
    minGift: 'Mín. de subs',
    minBits: 'Valor mín.',
    minRaid: 'Mín. de espectadores',
    sectionTiming: 'Tempo e som',
    duration: 'Tempo na tela',
    durationTip: 'Quanto tempo cada alerta fica na tela. Quando chegam vários, eles esperam a vez.',
    seconds: '{value}s',
    volume: 'Volume',
    volumeTip: 'Cada alerta toca um som curto próprio. 0 desliga o som.',
    volumeOff: 'Desligado',
    showMessage: 'Mostrar mensagem do espectador',
    showMessageTip:
      'Mostra o que o espectador escreveu com o resub, os Bits ou os Kicks. Links ficam de fora, e mensagens longas são cortadas.',
    previewTitle: 'Prévia dos Alertas de Live',
    previewIframeTitle: 'Prévia dos Alertas de Live',
    previewHint:
      'A prévia toca alertas de exemplo sem som. Os botões abaixo tocam um com o som. Na live, só aparecem os subs, presentes, Bits e raids do seu canal.',
    testTitle: 'Teste:',
    testSub: 'Sub',
    testGift: '{count} de presente',
    testBits: '{amount} Bits/Kicks',
    testRaid: 'Raid',
    testViewer: 'EspectadorTeste',
    testMessage: 'Live top demais!',
    widgetUrlTip:
      'Já fez um widget? Cole a URL dele aqui para carregar suas configurações e mudar o que precisar.',
    widgetUrlPlaceholder: 'Cole a URL de um widget para editar',
    widgetUrlInvalid: 'Esta não é uma URL dos Alertas de Live.',
    browserSourceHintSize: ' (tamanho recomendado: 800×450).',
    guideTitle: 'Configuração no programa de live (OBS, Streamlabs, XSplit etc.)',
    guideStep1:
      'Adicione uma fonte de navegador no seu programa de live (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio etc.).',
    guideStep2: 'Cole a URL dos alertas de live que você copiou.',
    guideStep3:
      'Coloque a largura em 800 e a altura em 450, depois posicione onde os alertas devem aparecer.',
    guideStep4:
      'Para ouvir o som no OBS, ative Controlar áudio via OBS nas propriedades da fonte e, em Propriedades de áudio avançadas, coloque a fonte em Monitoramento ativado.',
    faq1Q: 'Por que não tem alerta de follow ou de doação?',
    faq1A:
      'A Twitch e a Kick não mostram os novos follows para uma página sem login, e nenhuma das duas tem doação própria. Os alertas só usam o que as duas plataformas mandam para todo espectador, então funcionam igual nas duas.',
    faq2Q: 'O alerta de sub mostra os meses e a mensagem do espectador?',
    faq2A:
      'Sim. Quando um espectador compartilha o resub no chat, na Twitch ou na Kick, ganha um alerta com os meses e o que escreveu. Na Twitch, todo alerta de sub mostra os meses. A Kick manda os meses na maioria dos subs, mas alguns canais nunca recebem, e aí o alerta só diz que a pessoa se inscreveu.',
    faq3Q: 'O que acontece quando chegam muitos alertas de uma vez?',
    faq3A:
      'Eles aparecem um por vez, na ordem em que chegaram. Um presente de 50 subs é um alerta só, não 50.',
    faq4Q: 'Preciso fazer login ou conectar minha conta?',
    faq4A:
      'Não. Os alertas leem subs, presentes, Bits, Kicks e raids do seu chat público da Twitch e da Kick, do jeito que um espectador deslogado vê.',
    alert: {
      subHeading: 'Novo inscrito',
      subDetail: 'acabou de se inscrever',
      resubDetail: 'se inscreveu por {months} meses',
      giftHeading: 'Subs de presente',
      giftDetail: 'deu {count} subs de presente',
      giftDetailOne: 'deu um sub de presente',
      bitsHeading: 'Novos Bits',
      bitsDetail: 'mandou {amount} Bits',
      kicksHeading: 'Kicks',
      kicksDetail: 'mandou {amount} Kicks',
      raidHeading: 'Raid chegando',
      raidDetail: 'está dando raid com {viewers} espectadores',
      raidDetailOne: 'está dando raid com 1 espectador',
      raidDetailNoCount: 'está dando raid',
      anonymous: 'Anônimo',
    },
  },
  raffle: {
    breadcrumb: 'Configurar Sorteio',
    title: 'Configurar Sorteio',
    intro:
      'Faça sorteios direto pelo chat: o pessoal entra digitando uma palavra tipo !join, e você sorteia o vencedor com um clique. Funciona na Twitch e na Kick, pode ser só para inscritos e, se você quiser, coloca o vencedor na live com confete.',
    lockedTitle: 'Configurações travadas',
    lockedDesc:
      'As regras não podem mudar enquanto um sorteio está rolando ou esperando o resultado. Clique em Zerar tudo para editar.',
    platform: 'Plataforma',
    channelName: 'Canal',
    sectionRules: 'Regras de entrada',
    entryKeyword: 'Palavra-chave',
    keywordTip:
      'A mensagem precisa ser exatamente essa, ou começar com ela seguida de um espaço. Maiúsculas não importam, e bots conhecidos são ignorados.',
    minDuration: 'Duração mínima (s)',
    minDurationTip:
      'Sortear vencedor fica travado por essa quantidade de segundos depois que você clica em Iniciar, para todo mundo ter tempo de digitar.',
    subscribersOnly: 'Só inscritos',
    subscribersOnlyTip:
      'Só entra quem tem emblema de inscrito ou de fundador. Você também pode entrar como streamer, desde que o mínimo seja 1 mês.',
    minSubMonths: 'Mínimo de meses de sub',
    maxWinsPerUser: 'Máx. de vitórias por espectador',
    maxWinsTip:
      'Quem ganha sai da lista de participantes. A pessoa pode entrar de novo digitando a palavra-chave, até chegar a esse limite.',
    maxWinsUnlimited: 'Sem limite',
    resetConfig: 'Redefinir configurações',
    controlTitle: 'Controles do sorteio',
    controlTip:
      'Deixe esta página aberta durante o sorteio. Ela lê o chat e manda o vencedor para o overlay.',
    statusIdle: 'Não começou',
    statusNeedsSetup: 'Coloque um canal e uma palavra-chave para começar.',
    statusRunning: 'Aberto, esperando {keyword}',
    statusStopped: 'Entradas fechadas',
    startRaffle: 'Iniciar sorteio',
    stopRaffle: 'Fechar entradas',
    drawWinner: 'Sortear vencedor ({count} aptos)',
    drawLocked: 'O sorteio libera em {seconds}s',
    lastWinner: 'Último vencedor',
    clear: 'Limpar',
    resetEntries: 'Limpar participantes',
    resetWinners: 'Limpar vencedores',
    resetAll: 'Zerar tudo',
    winners: 'Vencedores ({count})',
    participants: 'Participantes ({count})',
    noWinners: 'Nenhum vencedor ainda.',
    noParticipants: 'Ninguém entrou ainda. O pessoal entra digitando {keyword} no chat.',
    disqualify: 'Remover {name}',
    confirmStart: 'Começar um sorteio novo? Os participantes e vencedores atuais serão apagados.',
    confirmResetEntries: 'Limpar a lista de participantes?',
    confirmResetWinners: 'Limpar a lista de vencedores?',
    confirmResetAll:
      'Zerar tudo? Participantes e vencedores são apagados e a trava sai. Suas configurações continuam como estão.',
    overlayUrl: 'URL do overlay do vencedor',
    overlayUrlTip:
      'O vencedor é enviado pelo BroadcastChannel do navegador, que não sai do navegador em que roda. Uma página de sorteio aberta no Chrome não alcança um overlay dentro do OBS.',
    overlayUrlHint:
      'O vencedor só chega no overlay quando esta página roda no mesmo navegador ou programa que o overlay. Faça um sorteio de teste antes de entrar ao vivo.',
    overlayNextStep:
      'Rode esta página de sorteio no mesmo programa que o overlay e faça um sorteio de teste.',
    guideStep1:
      'Escolha a plataforma, digite o nome do seu canal e defina a palavra-chave e as regras.',
    guideStep2:
      'Quer o vencedor na live? Adicione a URL do overlay como fonte de navegador de 1920×1080.',
    guideStep3:
      'Clique em Iniciar sorteio. O pessoal entra digitando a palavra-chave no chat, e você pode tirar qualquer um com o ✕ ao lado do nome.',
    guideStep4:
      'Quando estiver pronto, clique em Sortear vencedor. O vencedor só aparece no overlay se esta página rodar no mesmo navegador ou programa, então teste antes de entrar ao vivo.',
    faq1Q: 'Como evitar que a mesma pessoa ganhe duas vezes?',
    faq1A:
      'O vencedor sorteado sai da lista de participantes e vai para a lista de vencedores. Com Máx. de vitórias por espectador em 1, ele não pode entrar nem ganhar de novo no mesmo sorteio.',
    faq2Q: 'Posso tirar participantes suspeitos ou bots?',
    faq2A:
      'Bots conhecidos como Nightbot e StreamElements são ignorados automaticamente. Você também pode tirar qualquer pessoa com o ✕ ao lado do nome.',
    faq3Q: 'Por que o vencedor não aparece no meu overlay?',
    faq3A:
      'A página do sorteio manda o vencedor pelo BroadcastChannel, que só funciona dentro de um mesmo navegador. Se esta página está aberta no Chrome e o overlay roda no OBS, a mensagem nunca chega. Rode a página do sorteio no mesmo programa que o overlay e faça um sorteio de teste antes de entrar ao vivo.',
    winner: 'Vencedor!',
    subMonthsShort: '{months} m',
  },
  alerts: {
    follow: 'Novo seguidor!',
    sub: 'Novo inscrito!',
    donate: 'Doação!',
    raid: 'Chegou raid!',
  },
  emoteWallSetup: {
    breadcrumb: 'Configurar Mural de Emotes',
    title: 'Configurar Mural de Emotes',
    intro:
      'Mensagens feitas só de emotes (da Twitch, da Kick e os emotes da 7TV do seu canal da Twitch) aparecem como emotes na tela. Mensagens de texto normais são ignoradas por padrão, e Mostrar todos os emotes puxa os emotes delas também. Calmo faz os emotes surgirem em pontos aleatórios, flutuarem e sumirem, Caos faz eles voarem de uma borda pela tela, e Quicar faz eles quicarem nas bordas da tela.',
    sectionAnimation: 'Animação',
    sectionFilters: 'Filtros',
    sevenTvEmotes: 'Emotes da 7TV',
    sevenTvTip:
      'Mostra os emotes da 7TV do seu canal da Twitch, no chat da Kick também. Precisa do seu canal da Twitch.',
    mode: 'Modo de animação',
    modeCalm: 'Calmo',
    modeChaos: 'Caos',
    modeBounce: 'Quicar',
    modeTip:
      'Calmo: surge em um ponto aleatório, flutua e some. Caos: voa de uma borda aleatória e desaparece em algum ponto entre o meio e o outro lado. Quicar: ricocheteia nas bordas e acelera a cada batida.',
    emoteSize: 'Tamanho do emote',
    duration: 'Tempo na tela (s)',
    durationTip:
      'Quanto tempo cada emote fica na tela. No Caos, os emotes atravessam a tela em parte desse tempo e somem antes.',
    maxEmotes: 'Máx. de emotes ao mesmo tempo',
    maxEmotesTip: 'Quando há mais emotes que isso na tela, os mais antigos saem.',
    subsOnly: 'Só inscritos',
    subsOnlyTip:
      'Só mostra emotes de quem tem emblema de inscrito ou de fundador, e os seus. A prévia ignora isso.',
    subDurationX2: 'Emotes de sub 2× mais tempo',
    subDurationX2Tip:
      'Os emotes de quem tem emblema de inscrito ou de fundador, e os seus, ficam o dobro do tempo na tela.',
    showAllEmotes: 'Mostrar todos os emotes',
    showAllEmotesTip:
      'Também mostra os emotes dentro de mensagens de texto normais, até 5 por mensagem. A prévia ignora isso.',
    hypeMode: 'Modo hype',
    hypeModeTip:
      'Um emote só aparece quando 2 ou mais pessoas diferentes mandam ele em 15 segundos, e depois no máximo uma vez a cada 15 segundos. A prévia ignora isso.',
    spamBlock: 'Bloquear spam de emotes',
    spamBlockTip:
      'Se alguém manda mais de 3 mensagens de emote em 10 segundos, as extras são ignoradas. O mesmo emote mais de duas vezes em 10 segundos ignora só aquele emote. A prévia ignora isso.',
    previewTitle: 'Prévia do Mural de Emotes',
    previewIframeTitle: 'Prévia do Mural de Emotes',
    previewHint: 'A prévia mostra emotes de exemplo. Na live, os emotes vêm do seu chat.',
    widgetUrlTip:
      'Já fez um widget? Cole a URL dele aqui para carregar suas configurações e mudar o que precisar.',
    widgetUrlPlaceholder: 'Cole a URL de um widget para editar',
    widgetUrlInvalid: 'Esta não é uma URL do Mural de Emotes.',
    guideTitle: 'Configuração no programa de live (OBS, Streamlabs, XSplit etc.)',
    guideStep1:
      'Adicione uma fonte de navegador no seu programa de live (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio etc.).',
    guideStep2: 'Cole a URL do mural de emotes que você copiou.',
    guideStep3:
      'Coloque a largura e a altura no tamanho da sua tela inteira (ex.: 1920×1080) e posicione acima do seu gameplay.',
    browserSourceHintSize: ' (tamanho recomendado: 1920×1080, tela inteira).',
    faq1Q: 'Quais mensagens fazem um emote flutuar?',
    faq1A:
      'Mensagens feitas só de emotes, tipo um Kappa sozinho, uma fileira de emotes ou uma mistura de emotes da Twitch, da Kick e da 7TV. Mensagens de texto normais são ignoradas, a não ser que Mostrar todos os emotes esteja ligado.',
    faq2Q: 'Preciso entrar em alguma conta para usar o mural de emotes?',
    faq2A:
      'Não precisa de login. O Mural de Emotes ouve o chat público das duas plataformas de forma anônima.',
  },
  plants: {
    classic: 'Broto Clássico',
    rose: 'Rosa',
    sunflower: 'Girassol',
    cactus: 'Cacto',
    tulip: 'Tulipa',
    pine: 'Pinheiro',
    lotus: 'Lótus',
    lily: 'Lírio',
    palm: 'Palmeira',
    vine: 'Trepadeira',
    waterOff: 'Desligado',
    waterRain: 'Chuva',
    waterSparkle: 'Brilho',
  },
  guides: {
    breadcrumb: 'Guias',
    eyebrow: 'Guia',
    published: 'Publicado em {date}',
    onThisPage: 'Nesta página',
    covers: 'Ferramentas abordadas',
    relatedTitle: 'Guias relacionados',
    readGuide: 'Ler o guia',
    allGuides: 'Todos os guias',
    openSetup: 'Abrir a página de configuração',
    index: {
      title: 'Guias',
      lead: 'Cada guia responde uma pergunta, passo a passo: adicionar um widget ao OBS, juntar o chat da Twitch e da Kick, ler o chat em um painel do OBS, adicionar alertas de live, montar um subathon timer, fazer uma enquete no chat, colocar moldura na câmera e no chat, fazer a contagem regressiva da live, fazer um sorteio no chat e trocar de cena pelo chat. Todos falam de ferramentas grátis que não pedem login.',
      listLabel: 'Todos os guias',
      moreText:
        'Para dúvidas gerais, veja o [FAQ](/faq). Para saber o que mudou, confira o [histórico de mudanças](/changelog).',
    },
    obs: {
      title: 'Como adicionar um widget do Senchabot no OBS como fonte de navegador',
      short: 'Adicionar um widget ao OBS',
      summary:
        'Os passos para adicionar uma fonte de navegador, o tamanho certo de cada widget, duas opções para deixar desligadas e o que conferir se o widget aparecer vazio.',
      lead: 'Os widgets do Senchabot entram no OBS como fonte de navegador: clique no + do painel Fontes, escolha Navegador, cole no campo URL a URL que você copiou da página de configuração e coloque a largura e a altura no tamanho recomendado do widget. Você não precisa fazer login nem baixar nada, e o fundo já vem transparente.',
      add: {
        title: 'Como adicionar uma fonte de navegador no OBS?',
        intro:
          'Depois de digitar o nome do seu canal na página de configuração e clicar em Copiar, siga estes passos no OBS Studio:',
        step1: 'Selecione a cena em que o widget vai aparecer.',
        step2: 'No painel Fontes, clique no + e escolha Navegador na lista.',
        step3: 'Dê um nome para a fonte, por exemplo "Caixa de Chat", e clique em OK.',
        step4:
          'Na janela de propriedades que abrir, apague o campo URL e cole a URL do widget que você copiou.',
        step5: 'Coloque os valores da tabela abaixo nos campos Largura e Altura.',
        step6: 'Clique em OK e arraste a fonte para onde você quiser na cena.',
        note: 'A [página de configuração da Caixa de Chat](/setup/chat-widget) mostra estes passos junto com o tamanho recomendado quando você copia a URL. Se quiser ter certeza, abra a URL antes em uma aba normal do navegador e veja se funciona.',
      },
      size: {
        title: 'Qual tamanho usar em cada widget?',
        intro:
          'Todo widget tem um tamanho de fonte recomendado. Coloque esses valores nos campos Largura e Altura do OBS.',
        caption: 'Tamanhos recomendados da fonte de navegador para os widgets do Senchabot',
        colWidget: 'Widget',
        colSize: 'Largura × Altura',
        colNote: 'Observação',
        notSource: 'Não é uma fonte',
        notes: {
          chatBox:
            'Uma coluna de chat vertical. Uma fonte maior cabe mais mensagens, o texto continua do mesmo tamanho.',
          emoteWall: 'Uma tela 1080p inteira. Os emotes aparecem em qualquer lugar da tela.',
          subSprout: 'A planta e o vaso crescem dentro desta área.',
          frames:
            '640x360 para câmera, 420x720 para chat, 1920x1080 para a tela. A moldura se ajusta ao tamanho que você der.',
          goal: 'Uma faixa larga para a barra de meta, com espaço acima para os +1 subirem.',
          subathon:
            'Uma faixa larga para a barra de vida, o relógio ou o anel. Uma fonte maior aumenta tudo.',
          countdown:
            'Uma tela 1080p inteira, para o relógio cair no meio da sua cena de início ou BRB.',
          poll: 'Espaço para uma enquete com até 6 opções. Ela fica em cima ou embaixo e cresce com as opções.',
          streamAlerts: 'Um alerta por vez, no meio desta área. Uma fonte maior aumenta o alerta.',
          raffle:
            'O overlay do vencedor. Confete estoura dos dois lados da tela e o nome do vencedor aparece no meio.',
          obsBridge:
            'Não é um overlay visível. Deixe a ferramenta aberta em uma aba do navegador ou em um painel do OBS.',
          socials:
            'Um perfil por vez, no meio desta faixa. O texto não diminui, então um nome de usuário longo precisa de uma fonte mais larga.',
        },
        fontNote:
          'Para deixar o texto da Caixa de Chat maior, não estique a fonte. Use a opção Tamanho da fonte na página de configuração: de 8 a 72 pixels, 18 por padrão.',
      },
      transparent: {
        title: 'Precisa fazer alguma coisa para o fundo ficar transparente?',
        p1: 'Não. Caixa de Chat, Mural de Emotes, Sub Sprout, Subathon Timer, Alertas de Live, Meta de Subs, Enquete do Chat e o overlay do Sorteio são desenhados em fundo transparente. Você não precisa de chroma key nem de filtro, e pode deixar o campo CSS personalizado do OBS como está.',
        p2: 'Se a Caixa de Chat ficar difícil de ler numa cena clara, ligue Fundo escuro. Ele coloca uma camada preta semitransparente atrás do widget, e você pode ajustar a opacidade de 0% a 100% (50% por padrão). Se quiser cada mensagem na sua própria caixa, ligue Caixa de fundo da mensagem.',
      },
      settings: {
        title:
          '"Desativar fonte quando invisível" e "Atualizar o navegador quando a cena se tornar ativa" devem ficar ligados?',
        intro:
          'Deixe os dois desligados nos widgets do Senchabot. Os dois recarregam a página do zero, e o widget esquece tudo o que estava guardando até ali:',
        chatBox:
          'Caixa de Chat: as mensagens só chegam enquanto a fonte está rodando. Se a fonte desativa e volta, a tela começa vazia e só mostra as mensagens novas.',
        subSprout:
          'Sub Sprout: o crescimento da planta não fica salvo em lugar nenhum. Se a página recarregar, a planta volta para o primeiro estágio.',
        goal: 'Meta de Subs: a contagem fica salva dentro do OBS, então um recarregamento não perde ela, mas os subs que chegam com a fonte desligada não são contados.',
        poll: 'Enquete do Chat: a enquete e os votos ficam salvos dentro do OBS, então um recarregamento não perde nada, mas os votos digitados com a fonte desligada não são contados.',
        subathon:
          'Subathon Timer: o tempo restante fica salvo dentro do OBS, então um recarregamento não perde ele. O timer continua a contagem com a fonte desligada, mas não enxerga os subs que chegam nesse tempo.',
        streamAlerts:
          'Alertas de Live: só os subs, presentes, Bits e raids que chegam com a fonte rodando ganham alerta. O que chega com ela desligada se perde.',
        raffle:
          'Overlay do Sorteio: só o overlay que está aberto naquele momento recebe o vencedor. Um vencedor sorteado com a fonte desligada nunca aparece na tela.',
        emoteWall:
          'Mural de Emotes: os emotes ficam 5 segundos por padrão, então recarregar não te custa nada, mas também não ajuda.',
        refresh:
          'Se um widget travar, clique duas vezes na fonte e aperte o botão "Atualizar o cache da página atual" na janela de propriedades. Isso recarrega a página uma vez.',
      },
      update: {
        title: 'Como mudo um widget depois?',
        p1: 'Suas configurações ficam dentro da URL do widget, então mudar uma configuração quer dizer uma URL nova. Mude a configuração na página de configuração, copie a URL nova, depois clique duas vezes na fonte no OBS e cole por cima da URL antiga no campo URL.',
        p2: 'Você não precisa começar do zero com [Caixa de Chat](/setup/chat-widget), [Mural de Emotes](/setup/emote-wall), [Sub Sprout](/setup/sub-growing-plant), [Subathon Timer](/setup/subathon-timer), [Alertas de Live](/setup/stream-alerts), [Meta de Subs](/setup/sub-goal), [Enquete do Chat](/setup/chat-poll), [Molduras de Live](/setup/stream-frames), [Redes Sociais](/setup/socials) ou [Contagem Regressiva](/setup/stream-countdown). Cole sua URL atual no campo URL do widget da página de configuração e seus canais e todas as suas configurações voltam. Mude o que quiser e copie a URL nova.',
        p3: 'O OBS Bridge não tem campo para colar, então coloque suas configurações de novo na página de configuração dele e copie a nova URL da ferramenta. Você também pode mudar as cenas escolhidas e os usuários autorizados na própria página da ferramenta e pegar a URL nova com o botão Copiar URL atualizada. As URLs antigas continuam funcionando, então você não precisa atualizá-las.',
      },
      troubleshoot: {
        title: 'O que fazer se o widget não aparece no OBS?',
        intro:
          'Na maioria das vezes o problema é o nome do canal. Faça estas verificações na ordem.',
        linkTitle: 'Você digitou um link em vez do nome do canal?',
        linkBody:
          'No campo do canal, digite só o nome: `senchabot` para twitch.tv/senchabot. Se você colar o link inteiro, o widget trata o link como nome do canal e não consegue conectar em chat nenhum.',
        channelTitle: 'O canal existe mesmo?',
        channelBody:
          'Confira se o nome não tem erro de digitação. Um canal que não existe na Twitch não gera erro. O widget só fica vazio.',
        quietTitle: 'Já aconteceu alguma coisa no chat?',
        quietBody:
          'A Caixa de Chat e o Mural de Emotes ficam totalmente vazios e transparentes até algo acontecer no chat. Mande uma mensagem no chat; no Mural de Emotes, por padrão, precisa ser uma mensagem feita só de emotes, mas com Mostrar todos os emotes ligado, os emotes dentro de mensagens normais também contam. O overlay do Sorteio também só aparece quando um vencedor é sorteado e some depois de 10 segundos. Já o Sub Sprout e o Subathon Timer aparecem na hora.',
        kickTitle: 'Canal da Kick não encontrado?',
        kickBody:
          'Quando o widget abre, ele procura o canal da Kick no kick.com. Se essa busca falhar (nome errado, o canal não existe ou a Kick não responde), as mensagens da Kick não chegam. Digite seu nome da Kick exatamente como aparece na URL do kick.com.',
        tabTitle: 'A URL funciona no navegador?',
        tabBody:
          'Abra a URL em uma aba normal do navegador. Se funcionar lá mas não no OBS, confira o campo URL e o tamanho da fonte.',
      },
      ctaTitle: 'Escolha seu widget e pegue a URL',
      ctaText: 'Toda página de configuração te dá uma URL pronta para colar no OBS.',
    },
    chat: {
      title: 'Como mostrar o chat da Twitch e da Kick juntos no OBS',
      short: 'Chat da Twitch e da Kick juntos',
      summary:
        'Juntar os dois chats com uma URL da Caixa de Chat, mostrar de onde veio cada mensagem, emotes, esconder bots e o modo horizontal para uma barra embaixo.',
      lead: 'A Caixa de Chat junta o chat da Twitch e da Kick em uma fonte de navegador só. Na página de configuração, escolha Ambas em Plataformas, digite os dois nomes de canal e adicione no OBS a URL que você recebe, em 400 × 600. Não precisa de login, os dois chats são lidos de forma anônima.',
      setup: {
        title: 'Como juntar o chat da Twitch e da Kick em um overlay?',
        step1: 'Abra a [página de configuração da Caixa de Chat](/setup/chat-widget).',
        step2: 'Escolha Ambas em Plataformas. Já vem assim por padrão.',
        step3: 'Digite só os nomes dos canais nos campos Canal da Twitch e Canal da Kick.',
        step4: 'Ajuste o visual. A prévia mostra cada mudança na hora.',
        step5: 'Copie a URL do widget e adicione no OBS como fonte de navegador em 400 × 600.',
        p1: 'A URL que você recebe traz os dois canais, por exemplo `/widgets/chat-widget?twitch=yourchannel&kick=yourchannel`. Você não precisa de uma fonte separada para cada plataforma.',
        p2: 'A prévia sempre toca um chat de exemplo. Assim você vê como suas configurações vão ficar na live sem ninguém digitando no seu canal.',
      },
      restream: {
        title: 'A Caixa de Chat retransmite minha live para as duas plataformas?',
        p1: 'Não. A Caixa de Chat só lê o chat e mostra na tela. Ela não manda sua live para a Twitch nem para a Kick, e não consegue escrever no chat. Para fazer live nas duas plataformas ao mesmo tempo, você precisa de um esquema de multistream à parte; a Caixa de Chat junta os dois chats nessa live.',
        p2: 'A moderação também vale no overlay: mensagens apagadas e mensagens de usuários que levam timeout ou ban são removidas da tela.',
      },
      platform: {
        title: 'Como saber se uma mensagem veio da Twitch ou da Kick?',
        intro:
          'Com as duas plataformas ligadas, o Indicador de plataforma mostra no começo da mensagem de onde ela veio. Tem três opções:',
        icon: 'Ícone da plataforma (padrão): a logo da Twitch ou da Kick.',
        name: 'Nome da plataforma: o texto `[twitch]` ou `[kick]` no lugar da logo.',
        none: 'Ocultar plataforma: nenhuma marcação.',
        stripe:
          'Ligue Faixa com a cor da plataforma e aparece uma linha fina à esquerda de cada mensagem: roxa para a Twitch, verde para a Kick. Com a faixa ligada, você pode esconder o indicador para um visual mais limpo. Numa mensagem destacada, a cor do destaque fica no lugar da faixa.',
      },
      look: {
        title: 'Quais layouts, animações e fontes existem?',
        layoutTitle: 'Layout da mensagem',
        inline: 'Em linha (padrão): nome e mensagem na mesma linha.',
        stacked: 'Empilhado: nome em cima, mensagem embaixo.',
        card: 'Cartão / Balão: cada mensagem fica em um cartão semitransparente.',
        compact: 'Compacto: linhas apertadas, no estilo da Twitch, com texto um pouco menor.',
        animationTitle: 'Animação de nova mensagem',
        animations:
          'São oito opções: Deslizar da direita (padrão), Deslizar suave da direita, Pop / crescer, Quicar, Escalonado, Fade in, Máquina de escrever e Sem animação. Quando o chat acelera, toda animação menos a padrão fica mais curta. Se as mensagens chegam mais rápido que uma a cada meio segundo, a animação cai para até um terço da duração normal, para nenhuma se enrolar tentando acompanhar a próxima.',
        fontTitle: 'Fonte e tamanho',
        fonts:
          'Inter (padrão), Roboto, Nunito, JetBrains Mono, Source Serif 4 e a fonte Padrão do sistema. O tamanho da fonte vai de 8 a 72 pixels, 18 por padrão. Nomes em negrito e Mensagens em negrito são opções separadas.',
      },
      duration: {
        title: 'Quanto tempo as mensagens ficam na tela?',
        p1: '30 segundos por padrão. Em Duração da mensagem você pode escolher 10 s, 15 s, 30 s, 1 min, 2 min, 5 min ou Para sempre.',
        p2: 'Com Para sempre, as mensagens não somem: as novas empurram as antigas para cima, o que não cabe na caixa é cortado, e ficam guardadas no máximo as últimas 100 mensagens.',
      },
      emotes: {
        title: 'Quais emotes aparecem?',
        intro:
          'Os emotes da própria Twitch e da Kick sempre aparecem como imagem. Além deles, você pode ligar ou desligar três provedores no menu Emotes, e os três vêm ligados por padrão.',
        caption: 'Plataformas que cada provedor de emotes atende na Caixa de Chat',
        colProvider: 'Provedor',
        colPlatforms: 'Funciona em',
        both: 'Twitch e Kick',
        twitchOnly: 'Só Twitch',
        p1: 'Os emotes de canal e os globais carregam juntos. Se dois emotes têm o mesmo nome, vale o do canal, e a ordem entre os provedores é 7TV, BTTV, FFZ. Nas mensagens da Kick, a 7TV usa o conjunto de emotes ligado à conta da Kick do canal. Se só a sua conta da Twitch estiver ligada na 7TV, as mensagens da Kick usam esse conjunto também. Os emotes de um provedor que você desligar ficam como texto.',
      },
      filters: {
        title: 'Como esconder bots e comandos?',
        bots: 'Ocultar bots tira as mensagens de contas de bot conhecidas: Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, Sery_Bot, SoundAlerts, StreamlootsBot, KofiStreamBot, PokemonCommunityGame, OWN3D, Blerp, BotRix, KickBot, Kicklet e Senchabot. Contas com o emblema "Chat Bot" na Twitch ou "Bot" na Kick também são ocultadas.',
        commands:
          'Ocultar comandos esconde toda mensagem que começa com "!", então comandos como `!discord` ou `!uptime` ficam fora da sua tela. Para esconder também o que o bot responde a um comando, ligue as duas opções.',
        highlights:
          'Para fazer o contrário e deixar certas mensagens em evidência, use Destaques. Os cinco vêm desligados por padrão, então ligue só os que você quiser: mensagens que marcam seu canal ou respondem a você, a linha acima de uma resposta que mostra para quem é, quem fala pela primeira vez no chat, anúncios e mensagens enviadas com Destacar minha mensagem. Os três últimos são só da Twitch, porque a Kick não manda essa informação.',
      },
      horizontal: {
        title: 'Como colocar o chat como uma barra na parte de baixo da tela?',
        p1: 'Coloque Orientação em Horizontal. As mensagens ficam lado a lado, a mais nova aparece à direita e as antigas deslizam para a esquerda até sair da caixa.',
        p2: 'A sugestão de 400 × 600 é para o uso vertical. Para uma barra horizontal, coloque a largura da fonte no comprimento da barra e a altura em uma linha de mensagens, depois posicione a fonte na parte de baixo da tela.',
      },
      others: {
        title: 'Quais outros widgets ouvem as duas plataformas juntas?',
        p1: '[Mural de Emotes](/setup/emote-wall), [Sub Sprout](/setup/sub-growing-plant), [Subathon Timer](/setup/subathon-timer), [Alertas de Live](/setup/stream-alerts), [Meta de Subs](/setup/sub-goal) e [Enquete do Chat](/setup/chat-poll) também aceitam os dois canais em uma URL. O Mural de Emotes faz as mensagens só de emotes dos dois chats voarem pela tela. O Sub Sprout cresce com as inscrições nas duas plataformas, incluindo subs de presente na Kick. O Subathon Timer adiciona tempo para subs, subs de presente, Bits e Kicks dos dois chats. Os Alertas de Live mostram um alerta para subs, subs de presente, Bits, Kicks e raids das duas. A Meta de Subs soma os subs e subs de presente dos dois chats em uma contagem só. A Enquete do Chat junta os votos dos dois chats em um resultado só.',
        p2: 'Já o [Sorteio](/setup/raffle) roda em uma plataforma por vez: Twitch ou Kick.',
      },
      ctaTitle: 'Configurar a Caixa de Chat',
      ctaText:
        'Digite os nomes dos seus canais, copie a URL e adicione no OBS. Sem login, sem download.',
      ctaSecondary: 'Conhecer o Mural de Emotes',
    },
    raffle: {
      title: 'Como fazer um sorteio pelo chat na Twitch ou na Kick',
      short: 'Fazer um sorteio no chat',
      summary:
        'Entrar com !join, sorteios só para inscritos, limite de vitórias, duração mínima e mostrar o vencedor na live com confete, tudo com a ferramenta Sorteio.',
      lead: 'Com a ferramenta Sorteio, o pessoal entra digitando uma palavra no chat e você sorteia o vencedor com um clique. A palavra padrão é `!join`. Não precisa de login; participantes e vencedores ficam salvos no seu próprio navegador.',
      start: {
        title: 'Como começar um sorteio?',
        step1:
          'Abra a [página do Sorteio](/setup/raffle) e escolha a plataforma: Twitch ou Kick. Um sorteio roda em uma plataforma.',
        step2: 'Digite o nome do canal. As entradas são lidas do chat desse canal.',
        step3:
          'Defina a Palavra-chave. A padrão é `!join`, e você pode trocar por qualquer palavra.',
        step4:
          'Escolha suas regras e clique em Iniciar sorteio. O botão fica desativado enquanto a palavra-chave estiver vazia.',
        step5:
          'Quem entra aparece na lista. Quando tiver gente suficiente, clique em Sortear vencedor.',
        p1: 'As configurações travam quando o sorteio começa, então as regras não mudam no meio. Para parar de aceitar entradas, clique em Fechar entradas; dá para sortear um vencedor depois disso. Começar um sorteio novo limpa a lista de participantes, então a página pede confirmação antes.',
      },
      entry: {
        title: 'Como o pessoal entra no sorteio?',
        p1: 'O pessoal digita a palavra-chave no chat. Maiúsculas não importam, e a mensagem pode continuar desde que comece com a palavra-chave: `!join` e `!join good luck` contam, `hey !join` não.',
        p2: 'Cada pessoa entra uma vez. Digitar o comando de novo não dá uma segunda chance.',
        p3: 'Bots conhecidos não conseguem entrar: Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, BotRix, SoundAlerts, Blerp, Kofi_Stream_Bot e Senchabot. Para tirar alguém da lista na mão, clique no botão ✕ ao lado do nome.',
      },
      rules: {
        title: 'Quais regras dá para definir?',
        caption: 'Regras do sorteio, opções e padrões',
        colRule: 'Regra',
        colOptions: 'Opções',
        colDefault: 'Padrão',
        subsOnly: 'Só inscritos',
        subsOnlyOptions: 'Ligado ou desligado',
        subsOnlyDefault: 'Desligado',
        minMonths: 'Mínimo de meses de sub',
        minMonthsOptions: '1 ou mais, só com Só inscritos ligado',
        minMonthsDefault: '1',
        maxWins: 'Máx. de vitórias por espectador',
        maxWinsOptions: '1 a 5, ou sem limite',
        maxWinsDefault: '1',
        minDuration: 'Duração mínima',
        minDurationOptions: '0 a 300 segundos',
        minDurationDefault: '15 segundos',
        subsText:
          'Com Só inscritos ligado, quem não tem emblema de inscrito não entra. O streamer também conta como inscrito, então você pode entrar no seu próprio sorteio desde que o Mínimo de meses de sub seja 1. Em 1, todo inscrito pode entrar; coloque 6 e só entra quem é inscrito há pelo menos 6 meses. Na Twitch e na Kick, o tempo de sub é lido do emblema de inscrito do espectador.',
        winsText:
          'O vencedor sorteado sai da lista de participantes e vai para a lista de vencedores. Se o limite for 1, ele não pode ganhar de novo no mesmo sorteio. Se o limite for maior ou sem limite, ele pode entrar de novo digitando a palavra-chave outra vez.',
        durationText:
          'O botão Sortear vencedor fica travado até passar esse tempo desde o começo do sorteio, e mostra os segundos que faltam. Assim quem viu o sorteio atrasado também tem tempo de entrar.',
        fairText:
          'O vencedor é sorteado entre as entradas válidas usando o gerador seguro de números aleatórios do navegador (`crypto.getRandomValues`).',
      },
      storage: {
        title: 'Perco o sorteio se atualizar a página?',
        p1: 'Não. Configurações, participantes e vencedores ficam guardados no armazenamento local do navegador (localStorage). Mesmo se você atualizar ou fechar e abrir a página de novo, continua exatamente de onde parou.',
        p2: 'Esses dados só existem naquele navegador, então não aparecem em outro computador ou navegador. O chat não é lido com a página fechada, então comandos digitados nesse meio tempo não contam. Para recomeçar, use Zerar tudo; você também pode limpar só os participantes ou só os vencedores.',
      },
      overlay: {
        title: 'Como mostrar o vencedor na live?',
        p1: 'Adicione no OBS a URL do overlay do vencedor que está na página do Sorteio (`/widgets/raffle-overlay`) como fonte de navegador de 1920 × 1080. Quando você clica em Sortear vencedor, o overlay mostra o nome do vencedor no meio da tela, confete estoura dos dois lados por 3 segundos, e o nome some depois de 10 segundos.',
        warnTitle: 'Sempre teste antes de entrar ao vivo',
        warn: 'O vencedor chega no overlay pelo BroadcastChannel, que só funciona dentro do mesmo navegador. Se você abrir a página do Sorteio em um navegador separado, como o Chrome, e adicionar o overlay no OBS, os dois rodam em programas diferentes e o vencedor nunca chega no OBS. Antes de entrar ao vivo, faça um sorteio de teste e veja se o vencedor aparece no OBS.',
        p2: 'Deixe ativa a cena com o overlay e mantenha "Desativar fonte quando invisível" desligado na fonte; uma fonte desativada perde o vencedor. Os detalhes estão no [guia do OBS](/guides/obs-browser-source). O vencedor sempre aparece com confete na página do Sorteio também, então você consegue ler o nome lá mesmo se o overlay não funcionar.',
      },
      ctaTitle: 'Prepare seu sorteio',
      ctaText:
        'Escolha a plataforma, digite seu canal, defina a palavra-chave. Em um minuto você está pronto para o primeiro sorteio.',
    },
    bridge: {
      title: 'Como deixar os mods trocarem as cenas do OBS pelo chat',
      short: 'Trocar de cena pelo chat',
      summary:
        'Ativar o WebSocket para o OBS Bridge, os comandos do chat, como o !scene acha uma cena e quem pode usar os comandos.',
      lead: 'O OBS Bridge ouve o chat da Twitch ou da Kick e repassa os comandos das pessoas que você autorizar para o OBS no seu computador. Ative o servidor WebSocket no OBS, coloque seu canal e os usuários autorizados na página de configuração e deixe aberta a URL da ferramenta que você recebe. Quando um mod digita `!scene game`, o OBS troca para uma cena com "game" no nome.',
      websocket: {
        title: 'Como ativar o WebSocket no OBS?',
        step1: 'No OBS, abra Ferramentas → Configurações do servidor WebSocket no menu de cima.',
        step2: 'Marque a caixa Ativar servidor WebSocket.',
        step3:
          'Se a autenticação estiver ligada, clique em Mostrar informações da conexão e copie a senha.',
        step4: 'Clique em OK.',
        p1: 'O OBS Bridge fala com o obs-websocket 5, que já vem no OBS Studio 28 ou mais novo. Por padrão ele conecta em `ws://127.0.0.1:4455`; se o OBS está no mesmo computador, deixe o campo URL do WebSocket vazio. Se o OBS está em outro computador, coloque o endereço e a porta dele, por exemplo `ws://192.168.1.20:4455`. Se não conseguir conectar, a ferramenta tenta de novo a cada 5 segundos.',
      },
      setup: {
        title: 'Como configurar o OBS Bridge?',
        step1: 'Abra a [página de configuração do OBS Bridge](/setup/obs-bridge).',
        step2: 'Digite o canal da Twitch, o canal da Kick ou os dois para ele ouvir.',
        step3: 'Adicione os Usuários autorizados. Quem adicionar está explicado mais abaixo.',
        step4: 'Coloque a senha do WebSocket do seu OBS e mude a URL do WebSocket se precisar.',
        step5:
          'Copie a URL da ferramenta e abra em uma aba do navegador ou como painel personalizável com URL no OBS.',
        step6:
          'A página da ferramenta lista suas cenas do OBS. Clique nos botões Principal e BRB ao lado das cenas que você quer usar como principal e BRB.',
        p1: 'Se você não escolher nenhuma, ela procura cenas chamadas `Main Scene` para a principal e `BRB Scene` para a BRB. O que você escolher fica salvo na URL da página da ferramenta, então copie a URL de novo depois de escolher e guarde em algum lugar. Na próxima vez que abrir, as mesmas cenas carregam.',
      },
      commands: {
        title: 'Quais comandos de chat existem?',
        caption: 'Comandos padrão do OBS Bridge no chat',
        colCommand: 'Comando',
        colAction: 'O que faz',
        sceneArg: '<nome da cena>',
        scene: 'Troca para a cena cujo nome bate',
        brb: 'Troca para a cena BRB',
        back: 'Troca para a cena principal',
        stream: 'Inicia / para a transmissão',
        record: 'Inicia / para a gravação',
        p1: '`brb` e `back` são digitados sem ponto de exclamação. Os comandos ignoram maiúsculas, mas a mensagem inteira precisa ser o comando: `brb` funciona, `brb 5 min` não. Você pode renomear qualquer comando em Comandos na página de configuração, por exemplo `!switch` no lugar de `!scene`.',
        p2: 'O comando de parar transmissão encerra sua live de verdade. Mantenha a lista de autorizados curta.',
      },
      matching: {
        title: 'Como o comando !scene acha a cena certa?',
        p1: 'Ele procura primeiro um nome exato: `!scene game` troca para a cena chamada exatamente "Game", sem ligar para maiúsculas. Sem nome exato, ele pega a primeira cena que tem essa palavra no nome: `!scene chatting` acha a cena "Just Chatting". Se nenhuma cena bater, nada acontece.',
        p2: 'Se mais de uma cena tiver a mesma palavra, vale a que está mais alta na sua lista de Cenas. Com cenas de nomes parecidos, digitar o nome completo é o mais seguro. Quando você adiciona ou renomeia uma cena, a lista atualiza sozinha.',
      },
      users: {
        title: 'Quem pode usar os comandos?',
        p1: 'Só as pessoas da lista de Usuários autorizados. Se a lista estiver vazia, ninguém pode usar comandos, nem o streamer, então você precisa adicionar sua própria conta também.',
        p2: 'Cada usuário é adicionado com uma plataforma e aparece na URL como `commandUser=twitch:bob,kick:alice`. Uma mensagem só conta como comando se a plataforma e o nome baterem. Assim, mesmo que alguém na Kick pegue o nome de um mod da Twitch, não consegue trocar de cena.',
        p3: 'Nomes antigos salvos sem plataforma (só `bob`) funcionam naquela plataforma se a URL configurar uma plataforma só. Com as duas plataformas ligadas, esses nomes ficam marcados em amarelo na página da ferramenta e não podem usar comandos até você escolher uma plataforma para eles.',
      },
      open: {
        title: 'A página da ferramenta precisa ficar aberta?',
        p1: 'Sim. É a página da ferramenta que lê o chat e repassa os comandos para o OBS. Se você fechar a aba, os comandos param de funcionar. Deixe a ferramenta aberta em uma aba ou como painel no OBS durante a live inteira; se a conexão com o OBS cair, a ferramenta tenta reconectar a cada 5 segundos.',
      },
      security: {
        title: 'Por que tratar a URL da ferramenta como uma senha?',
        p1: 'Porque a senha do WebSocket do seu OBS está dentro da URL (o parâmetro `obsWebsocketPassword`). Compartilhar a URL é compartilhar sua senha. Não mostre na live, não mande no chat e esconda a barra de endereço quando compartilhar a tela.',
        p2: 'A conexão com o OBS vai direto do seu navegador para o OBS. A página da ferramenta em si carrega de extensions.senchabot.com como qualquer site, então o endereço completo, senha incluída, vai junto nessa requisição.',
      },
      ctaTitle: 'Configurar o OBS Bridge',
      ctaText:
        'Coloque seu canal e os usuários autorizados e abra a URL da ferramenta. Os comandos de cena já funcionam na hora.',
    },
    subathon: {
      title: 'Como fazer um subathon timer na Twitch e na Kick',
      short: 'Montar um subathon timer',
      summary:
        'Quanto tempo cada sub, presente, cheer de Bits e envio de Kicks adiciona, como começar com !subathon, comandos dos mods e o que acontece quando o OBS fecha ou o tempo acaba.',
      lead: 'O Subathon Timer é uma contagem regressiva que os subs empurram para frente. Defina um tempo inicial e quanto cada sub, sub de presente, cheer de Bits e envio de Kicks adiciona, coloque a URL no OBS como fonte de navegador de 800 × 300 e digite `!subathon start` no chat quando abrir a live. Não precisa de login; ele lê seu chat público da Twitch e da Kick.',
      setup: {
        title: 'Como configurar um subathon timer?',
        step1: 'Abra a [página de configuração do Subathon Timer](/setup/subathon-timer).',
        step2: 'Escolha Twitch, Kick ou Ambas e digite só os nomes dos canais.',
        step3: 'Defina o Tempo inicial, 1 hora por padrão, e um Limite de tempo se quiser.',
        step4:
          'Defina quanto tempo um sub, um sub de presente, Bits e Kicks adicionam. Com Ambas, Twitch e Kick ganham cada uma sua própria aba.',
        step5:
          'Escolha um estilo e uma cor, copie a URL e adicione no OBS como fonte de navegador em 800 × 300.',
        p1: 'A prévia na página de configuração toca subs, presentes e cheers simulados em velocidade 60×, então um timer de uma hora acaba em mais ou menos um minuto. Você pode ajustar a velocidade de 1× a 300×. Os botões de Teste adicionam um sub, um presente de 5 ou 500 Bits/Kicks, tiram 10 minutos, pausam e zeram. Eles só mudam a prévia, nunca o timer no OBS.',
      },
      values: {
        title: 'Quanto tempo cada sub adiciona?',
        intro:
          'Você escolhe o tempo em minutos inteiros, de 0 a 60, e 0 desliga aquele evento. Twitch e Kick têm valores separados, todos em 1 minuto por padrão. Mostrar no timer, ligado por padrão, lista os valores no timer, tipo Sub +1 min, para o pessoal saber quanto o sub adiciona. Quando Twitch e Kick adicionam tempos diferentes, os dois se revezam.',
        caption: 'Tempo que cada evento adiciona ao subathon timer',
        colEvent: 'Evento',
        colDefault: 'Padrão',
        colHow: 'Como conta',
        oneMinute: '1 min',
        sub: 'Sub',
        subHow: 'Cada sub novo e resub. Na Twitch, um sub Prime conta como Tier 1.',
        gift: 'Sub de presente',
        giftHow: 'Cada sub do presente, então um presente de 5 adiciona cinco vezes mais.',
        bits: '500 Bits ou 500 Kicks',
        bitsHow:
          'Outros valores adicionam a parte proporcional: com 1 minuto, 100 Bits adicionam 12 segundos.',
        tiers:
          'Com Tier 2 e 3 valem mais ligado, que é o padrão, um sub ou presente Tier 2 da Twitch adiciona o dobro do tempo e o Tier 3 adiciona cinco vezes, de acordo com o preço. Os subs da Kick não têm tier, então cada um conta uma vez.',
        cap: 'O Limite de tempo é o máximo que o timer pode guardar. O que passaria disso não é adicionado, e nenhum +tempo aparece. Com Sem limite, que é o padrão, o timer continua crescendo enquanto os subs continuarem chegando.',
      },
      start: {
        title: 'Como começar o subathon?',
        p1: 'Por padrão o timer espera, pausado, até você ou um mod digitar `!subathon start` no chat. Assim você pode adicionar a fonte antes da live e começar o relógio quando estiver ao vivo. Se você escolher Na hora em Início, o timer começa assim que a fonte carrega no OBS.',
        p2: 'Os subs que chegam antes do início também adicionam tempo, assim como os subs com o timer pausado. O tempo fica ali esperando quando o relógio começa.',
      },
      commands: {
        title: 'Quais comandos de chat os mods podem usar?',
        caption: 'Comandos de chat do Subathon Timer',
        colCommand: 'Comando',
        colAction: 'O que faz',
        start: 'Inicia o timer, ou retoma depois de uma pausa',
        pause: 'Pausa; o tempo restante fica onde está',
        add: 'Adiciona tempo, até o Limite de tempo',
        remove: 'Tira tempo, até chegar a zero',
        set: 'Define o tempo restante',
        reset: 'Recomeça do Tempo inicial',
        p1: 'Só o streamer e os moderadores podem usar, na Twitch e na Kick. VIPs e espectadores não. O timer não responde no chat; você vê o resultado no próprio timer.',
        p2: 'Escreva os tempos como `10m`, `45s`, `1h30m` ou `1:30:00`. Um número sozinho vale minutos, então `!subathon add 15` adiciona 15 minutos. As unidades são uma letra só: `10min` não funciona, `10m` funciona.',
      },
      look: {
        title: 'Quais estilos e cores existem?',
        bar: 'Barra de vida (padrão): uma barra estilo game que esvazia de 100% até zero.',
        clock: 'Relógio: números grandes em horas, minutos e segundos.',
        ring: 'Anel: um círculo que vai esvaziando conforme o tempo acaba.',
        p1: 'A cor padrão, Vida, vai do verde ao amarelo e ao vermelho conforme o tempo fica curto. Você também pode escolher uma cor fixa: verde, roxo, vermelho, dourado, ciano ou rosa. O título ao lado do timer diz SUBATHON por padrão; troque por qualquer coisa de até 32 caracteres, ou deixe vazio para esconder.',
        p2: 'Mostrar porcentagem mostra o quanto o timer está cheio. 100% é o maior tempo que o timer já teve até agora, então nunca passa de 100%: quando entra tempo numa barra cheia, a barra continua cheia e conta a partir do novo pico. Mostrar tempo adicionado faz subir um +1:00 com o nome do espectador acima do timer toda vez que entra tempo.',
      },
      saved: {
        title: 'O que acontece se o OBS fechar ou a fonte recarregar?',
        p1: 'O timer fica salvo dentro do OBS, então depois de um recarregamento ou de reiniciar o OBS ele volta de onde parou. Com o OBS fechado ele continua a contagem, como um prazo de verdade.',
        p2: 'Nada lê seu chat com o OBS ou a fonte desligados, então os subs nesse tempo não adicionam nada. Um mod pode adicioná-los depois com `!subathon add`. É por isso também que "Desativar fonte quando invisível" deve ficar desligado; o [guia do OBS](/guides/obs-browser-source) explica.',
        p3: 'O timer salvo pertence àquele OBS e àqueles canais. Se você mudar os canais na URL, por exemplo adicionando a Kick no meio do subathon, ou abrir a URL em outro OBS ou numa aba do navegador, começa um timer novo.',
      },
      zero: {
        title: 'O que acontece quando o timer chega a zero?',
        p1: 'Ele para em 00:00:00 e pisca em vermelho, e os estilos Barra de vida e Anel mostram K.O. Subs novos não adicionam mais tempo, então o subathon acabou.',
        p2: 'Para continuar, um mod digita `!subathon add` ou `!subathon set` com um tempo, e o timer volta a correr na hora. Para começar um subathon novo, digite `!subathon reset`.',
      },
      change: {
        title: 'Como mudar o timer ou começar um subathon novo?',
        p1: 'Cole sua URL atual no campo URL do widget na página de configuração. Seus canais e configurações voltam; mude o que quiser, copie a URL nova e cole por cima da antiga no OBS. Novos valores de tempo e um novo Limite de tempo valem assim que o OBS carrega a URL nova, e o tempo restante continua como estava.',
        p2: 'Um novo Tempo inicial só vale sozinho enquanto o timer não tiver começado pela primeira vez. Depois disso, digite `!subathon reset` no chat para recomeçar a partir do novo Tempo inicial. Se Início estiver no comando, o timer volta a esperar pausado até `!subathon start`.',
      },
      notCounted: {
        title: 'O que não adiciona tempo?',
        follows:
          'Follows e doações. A Twitch e a Kick não mostram os novos follows para uma página sem login, e nenhuma das duas tem doação própria.',
        raids: 'Raids, em nenhuma das plataformas.',
        resubs:
          'Resubs da Twitch que o espectador não compartilha. A Twitch só avisa o chat de um resub quando o espectador compartilha. A Kick manda as renovações como subs, então essas contam.',
        bits: 'Bits gastos fora do chat, como Power-ups. Só contam os Bits enviados no chat.',
        sharedChat:
          'Subs e Bits em um canal parceiro durante uma sessão de Chat compartilhado da Twitch. Só o seu próprio canal conta.',
      },
      ctaTitle: 'Configure seu subathon timer',
      ctaText: 'Defina o tempo inicial e quanto cada sub adiciona, copie a URL e adicione no OBS.',
    },
    poll: {
      title: 'Como fazer uma enquete no chat na Twitch e na Kick',
      short: 'Fazer uma enquete no chat',
      summary:
        'Abrir uma enquete com !poll, os jeitos de votar, um voto por espectador, o atraso da live e o que acontece quando o tempo acaba ou o OBS fecha.',
      lead: 'A Enquete do Chat coloca na sua live uma enquete em que o chat da Twitch e da Kick vota digitando um número. Adicione a URL no OBS como fonte de navegador de 640 × 560, depois você ou um mod digita `!poll Question | A | B` no chat. Sem login e sem bot: ela lê seu chat público.',
      setup: {
        title: 'Como configurar uma enquete no chat?',
        step1: 'Abra a [página de configuração da Enquete do Chat](/setup/chat-poll).',
        step2: 'Escolha Twitch, Kick ou Ambas e digite só os nomes dos canais.',
        step3:
          'Se quiser uma enquete pronta antes da live, digite uma pergunta e de 2 a 6 opções em Enquete pronta. Ela entra com `!poll start`.',
        step4:
          'Defina a Duração da enquete (1 minuto por padrão), quanto tempo o resultado fica na tela e quem pode votar.',
        step5:
          'Escolha uma cor, uma posição e o idioma da enquete, copie a URL e adicione no OBS como fonte de navegador em 640 × 560.',
        p1: 'A prévia na página de configuração toca uma enquete com votos simulados, mais rápido que o tempo real, e depois começa a próxima. Os botões de Teste adicionam 10 votos, adicionam 30 segundos, encerram a enquete e começam uma nova. Eles só mudam a prévia, nunca a enquete no OBS.',
      },
      commands: {
        title: 'Como abrir uma enquete pelo chat?',
        intro:
          'Só o streamer e os moderadores podem fazer enquetes, na Twitch e na Kick. VIPs e espectadores não: um espectador digitando `!poll` não muda nada.',
        caption: 'Comandos de chat da Enquete do Chat',
        colCommand: 'Comando',
        colAction: 'O que faz',
        question: 'Pergunta',
        new: 'Abre uma enquete nova com 2 a 6 opções, pela Duração da enquete da URL',
        newTime: 'O mesmo, com duração própria: 90s, 2m, 1m30s ou 1:30',
        yesNo: 'Abre uma enquete rápida com Sim e Não como opções',
        start: 'Abre a enquete pronta salva na URL',
        extend: 'Adiciona tempo a uma enquete aberta que tem timer',
        end: 'Encerra a votação agora; o vencedor aparece depois do Atraso da live',
        cancel: 'Tira a enquete da tela, com resultado e tudo',
        p1: 'Separe a pergunta e as opções com `|`. Opções depois da sexta ficam de fora, assim como as repetidas, mesmo com maiúsculas diferentes. A pergunta pode ter até 80 caracteres e cada opção até 30. Uma enquete nova substitui a que está na tela.',
        p2: 'Uma palavra de comando precisa dos argumentos certos: `!poll extend 30 seconds` não faz nada, em vez de virar uma pergunta. Um número sozinho antes da pergunta não é lido como duração, então `!poll 3 or 4 games? | 3 | 4` mantém a pergunta. A enquete não responde no chat; você vê o resultado na tela.',
      },
      voting: {
        title: 'Como o pessoal vota?',
        number: 'O número da opção sozinho, tipo `2`.',
        command: '`!vote 2` ou `!2`, para quem está acostumado com enquetes de bot.',
        text: 'A própria opção: `speedrun` vota em Speedrun, com maiúscula ou minúscula e com ou sem acentos ou letras turcas.',
        p1: 'A mensagem inteira precisa ser o voto. `2 please`, `4Head` ou `1 more game` não contam, então o papo normal do chat nunca vira voto. Quando uma opção é um número, vale o texto dela: numa enquete de `3 | 4 | 5`, digitar 3 vota na opção 3, não na terceira opção.',
        p2: 'O comando `/vote` da Twitch é para as enquetes nativas da Twitch, então peça para o chat digitar o número. A enquete mostra uma dica tipo "Digite de 1 a 3 no chat" embaixo das opções.',
      },
      rules: {
        title: 'Um espectador pode votar mais de uma vez?',
        p1: 'Não. Cada conta da Twitch ou da Kick conta uma vez. Com Pode mudar o voto ligado, que é o padrão, um número novo muda o voto; desligue e o primeiro voto é o final. Um voto numa opção que não existe nunca faz o espectador perder o voto que já tinha.',
        p2: 'Com Quem pode votar em Inscritos, só votam espectadores com emblema de inscrito ou de fundador, e você. Com todo mundo votando, Voto de sub vale faz o voto de um sub contar 2 ou 3 vezes. A enquete avisa isso na tela, e as porcentagens usam esses votos com peso.',
        p3: 'Se um mod der timeout ou ban em uma conta enquanto a enquete aceita votos, o voto dela sai, o que ajuda a desfazer uma onda de bots de spam.',
      },
      timing: {
        title: 'O que acontece quando o tempo acaba?',
        p1: 'O pessoal assiste sua live alguns segundos atrás do chat, então quando a tela deles mostra 1 segundo, a enquete já fechou no chat. Os votos continuam contando pelo Atraso da live depois que o timer acaba, 5 segundos por padrão, enquanto a enquete mostra Últimos votos. Ajuste para o atraso dos seus espectadores; Twitch e Kick costumam ter de 2 a 10 segundos de atraso.',
        p2: 'Aí o vencedor acende em dourado com uma coroa e as outras opções escurecem. Quando duas ou mais opções empatam com mais votos, a enquete declara empate. O resultado fica na tela pelo tempo de Resultado na tela, 30 segundos por padrão, depois a enquete some. Coloque 0 para deixar na tela até a próxima enquete ou `!poll cancel`.',
        p3: 'Com Duração da enquete em 0, a enquete não tem timer e fica aberta até um mod digitar `!poll end`. `!poll extend` só adiciona tempo a uma enquete que tem timer.',
      },
      look: {
        title: 'Como mudar o visual?',
        blind:
          'Esconder resultado até o fim: as barras ficam escondidas enquanto a votação está aberta e só aparece o total de votos, para os primeiros votos não influenciarem o resto.',
        color: 'Cor: roxo (padrão), verde, vermelho, dourado, ciano ou rosa.',
        position:
          'Posição: a enquete fica em cima ou embaixo da fonte de navegador e cresce a partir dali conforme o número de opções.',
        language:
          'Idioma da enquete: inglês, espanhol, francês, japonês, português ou turco para as palavras da enquete, tipo Resultado e o Sim e Não de uma enquete rápida.',
        p1: 'Com as duas plataformas ligadas, a enquete mostra quantos votos vieram da Twitch e quantos da Kick ao lado do total. A fonte é transparente, então só o cartão da enquete aparece na live.',
      },
      saved: {
        title: 'O que acontece se o OBS fechar ou a fonte recarregar?',
        p1: 'A enquete e os votos ficam salvos dentro do OBS, então um recarregamento ou um reinício do OBS traz tudo de volta de onde parou. O timer continua correndo com o OBS fechado.',
        p2: 'Nada lê seu chat com o OBS ou a fonte desligados, então os votos digitados nesse tempo não contam. Por isso "Desativar fonte quando invisível" deve ficar desligado; o [guia do OBS](/guides/obs-browser-source) explica. A enquete salva pertence àquele OBS e àqueles canais.',
      },
      limits: {
        title: 'O que a Enquete do Chat não faz?',
        chat: 'Escrever no chat. Ela só lê o chat, então nunca anuncia a enquete nem o vencedor por lá; a enquete na live mostra os dois.',
        native:
          'Mostrar as enquetes da própria Twitch ou Kick. As da Twitch não podem ser lidas sem login, então para funcionar igual nas duas plataformas os votos vêm do chat.',
        points:
          'Aceitar votos com Pontos do canal ou Bits. Cada espectador tem um voto, ou 2 ou 3 como sub quando você liga essa opção.',
        multiple: 'Múltipla escolha. Cada espectador escolhe uma opção.',
      },
      ctaTitle: 'Configure sua enquete do chat',
      ctaText:
        'Coloque uma enquete pronta e as regras de votação em uma URL, adicione no OBS e digite !poll no chat.',
    },
    frames: {
      title: 'Como colocar moldura na câmera, no chat e na tela no OBS',
      short: 'Adicionar molduras na live',
      summary:
        'Adicionar molduras de câmera, chat e tela no OBS, a ordem das fontes, encaixar a câmera na moldura e escolher um preset e as animações.',
      lead: 'As Molduras de Live colocam uma moldura pronta em volta da sua câmera, do seu chat ou da tela inteira da live, no estilo do preset que você escolher. Escolha a peça e o preset na página de configuração, adicione a URL no OBS como fonte de navegador e coloque por cima da sua câmera ou do seu chat. O meio da moldura é transparente, e não tem canal para conectar nem login.',
      setup: {
        title: 'Como configurar uma moldura?',
        step1: 'Abra a [página de configuração das Molduras de Live](/setup/stream-frames).',
        step2:
          'Em O que você vai emoldurar?, escolha Câmera, Chat ou Tela. Se escolheu Câmera, coloque Orientação em Paisagem ou Retrato. Cada peça é uma fonte de navegador separada, então adicione as três se quiser.',
        step3:
          'Escolha um preset. No Clássico você escolhe a cor. Os outros presets vêm com cores, fonte e arte próprias.',
        step4:
          'Digite o nome do seu canal ou qualquer palavra no campo Rótulo. Na câmera e no chat ele aparece na aba em cima da moldura, e na tela aparece na placa embaixo.',
        step5:
          'Copie a URL e adicione no OBS como fonte de navegador: 640 × 360 para câmera (360 × 640 para câmera em retrato), 420 × 720 para chat, 1920 × 1080 para a tela.',
        p1: 'A prévia mostra a moldura com a silhueta de uma pessoa ou linhas de chat de exemplo. São só exemplos. Na live, o meio da moldura fica vazio.',
      },
      layers: {
        title: 'Por que a moldura está atrás da minha câmera?',
        p1: 'No OBS, o que está mais alto na lista de Fontes fica na frente na cena. Coloque a fonte da moldura acima da sua câmera (Dispositivo de captura de vídeo) ou da Caixa de Chat. Você também pode clicar com o botão direito na fonte e escolher Ordenar → Mover para o topo.',
        p2: 'Para mover a câmera e a moldura juntas, selecione as duas, clique com o botão direito e escolha Agrupar itens selecionados. Quando você redimensiona o grupo, as duas mudam de tamanho juntas.',
        p3: 'A moldura da tela deve ficar na frente da cena inteira. Coloque ela no topo da lista para o seu jogo e as outras fontes ficarem embaixo.',
      },
      fit: {
        title: 'Como encaixar a câmera na moldura?',
        intro:
          'A abertura no meio da moldura é um pouco menor que a borda externa. Sua câmera deve preencher a abertura mas ficar dentro da borda externa, senão a sobra aparece em volta da moldura. Nos tamanhos recomendados, estes encaixam bem:',
        caption: 'Tamanhos recomendados de moldura e a fonte que vai dentro',
        colPiece: 'Peça',
        colFrame: 'Tamanho da moldura',
        colInside: 'Fonte dentro',
        camera: 'Câmera em paisagem',
        cameraPortrait: 'Câmera em retrato',
        chat: 'Chat',
        screen: 'Tela',
        cameraInside: 'Câmera em 590 × 296, centralizada na moldura',
        cameraPortraitInside: 'Câmera em 306 × 572, centralizada na moldura',
        chatInside: 'Caixa de Chat em 370 × 660, centralizada na moldura',
        screenInside: 'Captura de jogo ou de tela preenchendo a cena inteira',
        p1: 'Uma câmera 16:9 redimensionada para 590 de largura fica com 332 de altura, então corte em cima e embaixo por igual até chegar a 296. Segure Alt (Option no Mac) e arraste as bordas de cima e de baixo da fonte, ou clique com o botão direito na câmera e use os campos Cortar em Transformar → Editar transformação. Para uma câmera em retrato é o contrário: uma câmera 9:16 redimensionada para 572 de altura fica com 322 de largura, então corte a esquerda e a direita por igual até chegar a 306.',
        p2: 'Se você usar uma moldura maior, esses tamanhos acompanham: numa moldura de câmera de 1280 × 720, a câmera fica em 1180 × 592. Para uma câmera quadrada, coloque a largura e a altura da fonte de navegador iguais e a moldura é desenhada nesse formato.',
      },
      look: {
        title: 'O que o preset e as animações mudam?',
        p1: 'O preset define o formato, a arte, as cores e a fonte da moldura: telhado de pagode e borlas no Dynasty, acabamento dourado e gemas turquesa no Rift, blocos de grama e uma hotbar no Blocks. Coloque o mesmo preset na sua Caixa de Chat, nos Alertas de Live e na Meta de Subs e tudo na tela combina.',
        p2: 'Com Animações ligado, a luz percorre a moldura, as linhas brilham, e lanternas, tochas ou faíscas se mexem dependendo do preset. Elas são leves. Mesmo assim, se o seu PC sofre enquanto você joga, desligue Animações. Isso coloca `motion=0` na URL e a moldura fica parada.',
        p3: 'Toda a arte foi desenhada do zero, sem logos nem artes de jogos.',
      },
      change: {
        title: 'Como mudo a moldura depois?',
        p1: 'Cole a URL do OBS no campo URL do widget na página de configuração e suas configurações voltam. Mude o preset, a peça ou o rótulo, copie a URL nova e cole por cima da antiga na fonte de navegador. Para mudar o preset de todos os seus widgets de uma vez, use a [página de Presets](/presets).',
      },
      ctaTitle: 'Configure sua moldura',
      ctaText: 'Escolha a peça e o preset, confira a prévia e copie a URL.',
    },
    countdown: {
      title: 'Como colocar uma contagem de início, BRB e encerramento no OBS',
      short: 'Adicionar uma contagem regressiva',
      summary:
        'Configurar uma contagem regressiva para as cenas de início, pausa e encerramento, fazer ela recomeçar a cada troca de cena, contar até um horário e os comandos do chat.',
      lead: 'A Contagem Regressiva é um relógio para as três cenas em que nada está rolando ainda: começando em breve, já volto e fim da live. Escolha a cena e uma duração na página de configuração, adicione a URL no OBS como fonte de navegador de 1920 × 1080 e marque Atualizar o navegador quando a cena se tornar ativa, para ela recomeçar toda vez que você trocar para essa cena. Sem login, e sem canal, a não ser que você queira os comandos do chat.',
      setup: {
        title: 'Como configurar uma contagem regressiva?',
        step1: 'Abra a [página de configuração da Contagem Regressiva](/setup/stream-countdown).',
        step2:
          'Em Para que é?, escolha Início, Pausa ou Encerramento. Isso define o texto e o ícone, e cada um é uma fonte de navegador separada, então você pode adicionar os três.',
        step3:
          'Em Contar até, escolha Uma duração e defina os minutos, ou escolha Um horário e digite um horário de 24 horas tipo 21:00.',
        step4:
          'Escolha um preset e, em No zero, o que fica na tela quando o tempo acaba: uma mensagem, o relógio em 00:00 ou nada.',
        step5:
          'Copie a URL e adicione na cena do OBS como fonte de navegador de 1920 × 1080, para o relógio cair no meio da sua cena.',
        p1: 'A prévia na página de configuração corre acelerada para você ver a contagem inteira em poucos segundos. Na live, ela conta em tempo real.',
      },
      restart: {
        title: 'Por que minha contagem não recomeça?',
        p1: 'A contagem começa quando a fonte de navegador carrega. Se a fonte carregou quando o OBS abriu, ela está contando desde então, e quando você troca para a cena BRB ela já está no zero.',
        p2: 'Abra as propriedades da fonte de navegador e marque "Atualizar o navegador quando a cena se tornar ativa". O OBS recarrega a página toda vez que você troca para essa cena, então a contagem começa do início a cada pausa.',
        p3: 'Com um canal preenchido, você também pode digitar `!countdown reset` no chat, que recomeça a contagem sem mexer no OBS. É o jeito mais rápido quando você já saiu de perto do teclado.',
      },
      clock: {
        title: 'Como contar até um horário?',
        p1: 'Escolha Um horário e digite o horário que você anunciou, ex.: 21:00. A contagem lê o relógio do computador que roda o OBS, então não importa quando a fonte carrega: às 18:30 ela mostra 2:30:00, e às 20:55 mostra 05:00.',
        p2: 'Se o horário já passou hoje, ela mira no mesmo horário do dia seguinte. Então uma fonte que você deixa aberta de noite já está pronta para a próxima live, e `!countdown reset` faz ela mirar na próxima.',
        p3: 'Espectadores de outros países veem a sua contagem, não o relógio deles, e a ideia é essa: todo mundo vê os mesmos minutos restantes.',
      },
      commands: {
        title: 'Os mods podem mudar a contagem pelo chat?',
        p1: 'Sim, depois que você preenche seu canal da Twitch ou da Kick na página de configuração. Aí você e seus mods podem usar estes comandos em qualquer um dos chats:',
        caption: 'Os comandos !countdown',
        colCommand: 'Comando',
        colDoes: 'O que faz',
        addDoes: 'Adiciona 5 minutos; 90s e 1h30m também funcionam',
        removeDoes: 'Tira 2 minutos',
        setDoes: 'Define o tempo restante em 10 minutos',
        pauseDoes: 'Pausa o relógio onde está',
        startDoes: 'Volta a correr depois de uma pausa',
        resetDoes: 'Recomeça a contagem do início',
        sceneDoes:
          'Muda a cena para pausa (break), início (starting) ou encerramento (ending) e define a duração (10m se você não colocar)',
        p2: 'Só você e seus mods podem usar, nas duas plataformas, e uma resposta no chat nunca roda um comando. A contagem lê seu chat público do mesmo jeito que os outros widgets, sem login.',
      },
      scenes: {
        title: 'Qual contagem vai em qual cena?',
        p1: 'Início vai na cena em que você fica antes de entrar ao vivo, com uma duração tipo 10 minutos, ou o horário que você anunciou. Pausa vai na sua cena BRB com uma duração menor, normalmente 5 ou 10 minutos. Encerramento vai na última cena, para o chat ver quanto falta antes de você encerrar.',
        p2: 'Se você troca de cena pelo chat com o [OBS Bridge](/setup/obs-bridge), seus mods podem te mandar para a cena BRB e a contagem começa junto.',
      },
      ctaTitle: 'Configure sua contagem',
      ctaText: 'Escolha a cena e a duração, confira a prévia e cole a URL no OBS.',
    },
    alerts: {
      title: 'Como adicionar alertas de sub, Bits e raid da Twitch e da Kick no OBS',
      short: 'Adicionar alertas de live',
      summary:
        'Quais alertas cada plataforma tem, temas e cores, valores mínimos, como levar o som para o OBS e por que não tem alerta de follow.',
      lead: 'Os Alertas de Live mostram um alerta animado com som próprio para cada sub, sub de presente, cheer de Bits, envio de Kicks e raid na Twitch e na Kick. Digite os nomes dos seus canais na página de configuração, escolha um tema e adicione a URL no OBS como fonte de navegador de 800 × 450. Não precisa de login, e uma URL serve para as duas plataformas.',
      setup: {
        title: 'Como adicionar alertas de live no OBS?',
        step1: 'Abra a [página de configuração dos Alertas de Live](/setup/stream-alerts).',
        step2: 'Escolha Twitch, Kick ou Ambas e digite só os nomes dos canais.',
        step3: 'Escolha um tema e uma cor, e desligue os alertas que você não quiser.',
        step4:
          'Copie a URL e adicione no OBS como fonte de navegador em 800 × 450, depois posicione onde os alertas devem aparecer.',
        step5:
          'Ative Controlar áudio via OBS nas propriedades da fonte para o som sair na sua live. Mais sobre o som abaixo.',
        p1: 'Entre um alerta e outro, a fonte fica vazia e transparente. Se você abrir a URL em uma aba do navegador para testar, vai ver uma página em branco até algo acontecer no seu canal.',
        p2: 'Para mudar depois, cole sua URL atual no campo URL do widget na página de configuração. Seus canais e configurações voltam; copie a URL nova e cole por cima da antiga no OBS.',
      },
      kinds: {
        title: 'Quais alertas existem?',
        caption: 'Eventos dos Alertas de Live na Twitch e na Kick',
        colAlert: 'Alerta',
        sub: 'Subs',
        subTwitch: 'Subs novos e resubs compartilhados, com os meses e a mensagem',
        subKick:
          'Subs novos e renovações, com os meses quando a Kick manda, e resubs compartilhados no chat',
        gift: 'Subs de presente',
        giftBoth: 'Um alerta por presente, com quem deu e quantos subs',
        bits: 'Bits e Kicks',
        bitsTwitch: 'Cheers de Bits, com o valor e a mensagem',
        bitsKick: 'Kicks, com o valor e a mensagem',
        raid: 'Raids',
        raidTwitch: 'O canal que deu raid e quantos espectadores vieram',
        raidKick: 'O canal que deu raid, e os espectadores quando a Kick manda',
        p1: 'Um presente de 50 subs é um alerta só, não 50, e quem recebe os subs não ganha alerta próprio. Um presente anônimo mostra Anônimo como nome. Os tiers não aparecem: um sub Prime, Tier 1, Tier 2 ou Tier 3 ganha o mesmo alerta.',
        p2: 'A Kick manda os meses na maioria dos subs, mas alguns canais nunca recebem, e aí o alerta só diz que a pessoa se inscreveu. Quando um espectador da Kick depois compartilha o resub no chat, ganha um alerta próprio com os meses e a mensagem, então um resub da Kick pode aparecer duas vezes. Na Twitch, um resub só chega no chat quando o espectador compartilha, então aparece uma vez.',
        p3: 'Durante uma sessão de Chat compartilhado da Twitch, os subs, presentes, Bits e raids dos canais parceiros não aparecem. Só o seu próprio canal ganha alertas.',
      },
      follows: {
        title: 'Por que não tem alerta de follow ou de doação?',
        p1: 'A Twitch e a Kick não mostram os novos follows para uma página sem login, e nenhuma das duas tem doação própria. Os Alertas de Live só usam o que as duas plataformas mandam para todo espectador, e é por isso que funcionam sem login e do mesmo jeito nas duas.',
      },
      look: {
        title: 'Quais temas e cores existem?',
        neon: 'Neon (padrão): um banner sci-fi anguloso com sons de sintetizador. Quando sai, pisca como um letreiro de neon.',
        celestial:
          'Celestial: um cartão azul-marinho sob as estrelas, com moldura fina e som de sinos.',
        p1: 'A cor é o destaque do alerta. A padrão, Plataforma, mostra os alertas da Twitch em roxo e os da Kick em verde. Você também pode escolher uma cor para todos os alertas: azul, roxo, rosa, vermelho, dourado ou verde. Quando os dois canais estão na URL, uma etiquetinha TWITCH ou KICK mostra de onde veio cada alerta.',
        p2: 'Você pode renomear o título de cada alerta, com até 24 caracteres, ou deixar vazio para manter o padrão, tipo Novo inscrito. O Neon escreve os títulos em maiúsculas. Idioma do alerta define o idioma das palavras do alerta: inglês, espanhol, francês, japonês, português ou turco. Ele fica na URL seja qual for o idioma do OBS.',
      },
      min: {
        title: 'Como ignorar presentes, Bits e raids pequenos?',
        caption: 'Valores mínimos dos Alertas de Live',
        colSetting: 'Opção',
        colDefault: 'Padrão',
        colRange: 'Faixa',
        gift: 'Mín. de subs (subs de presente)',
        giftRange: '1 a 100.000',
        bits: 'Valor mín. (Bits ou Kicks)',
        bitsRange: '1 a 100.000',
        raid: 'Mín. de espectadores (raids)',
        raidRange: '0 a 100.000',
        p1: 'O que fica abaixo do mínimo não ganha alerta. Um Valor mín. vale para Bits e Kicks, e os subs não têm mínimo. Se a Kick mandar um raid sem número de espectadores, ele conta como 0 espectadores, então um Mín. de espectadores de 1 ou mais ignora esse raid.',
      },
      queue: {
        title: 'O que acontece quando chegam muitos alertas de uma vez?',
        p1: 'Eles esperam a vez e aparecem um por vez, na ordem em que chegaram, com uma pausa curta entre eles. Tempo na tela define quanto tempo cada um fica: de 3 a 20 segundos, 7 por padrão. Até 30 alertas podem esperar na fila; se acumularem mais, os mais novos são ignorados.',
        p2: 'Mostrar mensagem do espectador, ligado por padrão, mostra o que o espectador escreveu com o resub, os Bits ou os Kicks. Os links são tirados e as mensagens longas são cortadas, então ninguém consegue colocar um link na sua live.',
      },
      sound: {
        title: 'Como levar o som do alerta para o OBS?',
        step1:
          'Clique duas vezes na fonte dos Alertas de Live, marque Controlar áudio via OBS e clique em OK. A fonte agora aparece no Mixer de áudio.',
        step2: 'Abra Editar → Propriedades de áudio avançadas no menu de cima.',
        step3:
          'Para você também ouvir os alertas, coloque o Monitoramento de áudio da fonte em Monitoramento ativado, que nas versões mais antigas do OBS se chama Monitorar e enviar áudio.',
        p1: 'O volume vai de 0 a 100, 50 por padrão, e 0 desliga o som. Cada alerta tem seu próprio som curto que combina com o tema: sintetizador no Neon, sinos no Celestial. O OBS toca o som sozinho; numa aba normal do navegador a página fica muda até você clicar nela uma vez.',
      },
      test: {
        title: 'Como testar os alertas antes de entrar ao vivo?',
        p1: 'A prévia na página de configuração toca alertas de exemplo sem som. Os botões de Teste embaixo dela tocam um sub, um presente, Bits/Kicks e um raid com som no volume atual, para você ver e ouvir o tema antes de escolher.',
        warnTitle: 'Os botões de teste não chegam no OBS',
        warn: 'Eles só tocam na prévia da página de configuração. A fonte no OBS só mostra subs, presentes, Bits e raids reais do seu canal, então não dá para mandar um alerta de teste para ela.',
        p2: 'Deixe ativa a cena com a fonte e mantenha "Desativar fonte quando invisível" desligado. Os alertas que chegam com a fonte desligada se perdem e não tocam depois.',
      },
      ctaTitle: 'Configurar os Alertas de Live',
      ctaText:
        'Digite seus canais, escolha um tema e copie a URL. Seu próximo sub já ganha alerta.',
    },
    reader: {
      title: 'Como ler o chat da Twitch e da Kick numa janela só ou num painel do OBS',
      short: 'Ler o chat em um painel do OBS',
      summary:
        'Abrir o Leitor de Chat, adicionar no OBS como painel, o que acontece quando a conexão cai e como seu chat sobrevive a uma atualização da página.',
      lead: 'O Leitor de Chat mostra seu chat da Twitch e da Kick em uma lista só, numa aba do navegador ou num painel do OBS, para você ler enquanto faz live. Abra pelo botão Abrir Leitor de Chat na página de configuração da Caixa de Chat. Ele reconecta sozinho, marca cada queda na lista e guarda seu chat quando você atualiza a página.',
      open: {
        title: 'Como abrir o Leitor de Chat?',
        step1:
          'Abra a [página de configuração da Caixa de Chat](/setup/chat-widget) e digite seu canal da Twitch, seu canal da Kick ou os dois.',
        step2:
          'Clique em Abrir Leitor de Chat embaixo da URL do widget. O leitor abre em uma nova aba.',
        step3:
          'Salve a aba nos favoritos, ou guarde o endereço, para abrir o mesmo leitor da próxima vez.',
        p1: 'O leitor leva junto os canais e algumas configurações da Caixa de Chat: provedores de emotes, emblemas, Ocultar bots, Ocultar comandos e Destaques. Fonte, layout, animação e o resto do visual ficam com o overlay, e o leitor tem suas próprias opções de tamanho do texto e de horário. Para mudar as configurações que ele levou, mude na página de configuração e abra o leitor de novo.',
      },
      dock: {
        title: 'Como adicionar o Leitor de Chat no OBS como painel?',
        step1: 'Abra o Leitor de Chat e copie o endereço da barra de endereço.',
        step2:
          'No OBS, abra Painéis → Painéis personalizáveis com URL no menu de cima. Nas versões mais antigas fica em Visualizar → Painéis.',
        step3: 'Digite um nome tipo Chat, cole o endereço na coluna URL e clique em Aplicar.',
        step4: 'Arraste o painel novo para onde você quiser na janela do OBS.',
        p1: 'O OBS tem seu próprio armazenamento de navegador, então o painel guarda seu próprio histórico e suas configurações, separados do seu navegador normal.',
      },
      shows: {
        title: 'O que o Leitor de Chat mostra?',
        p1: 'As mensagens dos dois chats em uma lista só, na ordem em que chegam. Quando os dois canais estão definidos, um ícone da Twitch ou da Kick mostra de onde veio cada mensagem. Emotes, emblemas e cores dos nomes aparecem do mesmo jeito que na Caixa de Chat.',
        p2: 'As mensagens apagadas continuam na lista, riscadas e marcadas como (apagada), para você ainda ver o que foi removido. Quando alguém leva timeout ou ban, as mensagens anteriores dessa pessoa são marcadas do mesmo jeito. Quando um mod limpa o chat, uma linha na lista avisa.',
        p3: 'A- e A+ mudam o tamanho do texto de 12 a 28 pixels, 15 por padrão. O botão do relógio mostra ou esconde o horário das mensagens, e o botão da lixeira limpa o histórico depois de um segundo clique. O leitor lembra do tamanho do texto e da opção de horário.',
        p4: 'Se você rolar para cima para ler alguma coisa, a lista para de andar. Um botão embaixo conta as mensagens novas; clique nele para voltar ao chat ao vivo.',
      },
      drops: {
        title: 'O que acontece quando a conexão cai?',
        p1: 'Cada canal tem um status no topo: Conectando, Conectado ou Reconectando, ou Canal não encontrado quando um nome da Kick não é encontrado. Quando a conexão de um chat cai, um aviso faz a contagem até a próxima tentativa, e Tentar agora tenta na hora. As tentativas começam com 1 segundo de intervalo e vão desacelerando até uma a cada 30 segundos.',
        p2: 'O leitor também percebe uma conexão que fica em silêncio sem fechar, o que pode acontecer depois de uma queda de rede. Se nada chegar por 30 segundos, ele confere se o chat ainda está lá e reconecta se não tiver resposta. Se o seu computador ficar sem internet, ele avisa e reconecta assim que a internet voltar.',
        p3: 'Cada queda fica registrada na lista, tipo "Conexão com o chat da Twitch caiu" e "De volta ao chat da Twitch depois de 12s", para você saber exatamente onde podem faltar mensagens.',
      },
      history: {
        title: 'Você perde seu chat quando atualiza a página?',
        p1: 'Não. O leitor salva as últimas 1000 linhas no seu navegador e traz de volta quando você abre de novo, seguidas de uma linha que diz "Salvo da sua última visita, até" e o horário. Linhas com mais de 12 horas são descartadas.',
        p2: 'As mensagens enviadas com o leitor fechado não voltam: tudo acima dessa linha é da sua última visita, tudo abaixo é novo. Cada conjunto de canais tem seu próprio histórico, e Limpar histórico apaga ele.',
      },
      limits: {
        title: 'O que o Leitor de Chat não faz?',
        send: 'Ele não manda mensagens nem modera. Ele lê o chat de forma anônima, como um espectador deslogado.',
        events:
          'Ele não mostra avisos de sub, presente ou raid. Para isso, adicione os [Alertas de Live](/setup/stream-alerts) na sua live.',
        missed:
          'Ele não recupera as mensagens enviadas enquanto estava fechado, em nenhuma das plataformas.',
      },
      ctaTitle: 'Abrir o Leitor de Chat',
      ctaText:
        'Digite seus canais na página de configuração da Caixa de Chat e clique em Abrir Leitor de Chat.',
    },
  },
  presets: {
    classic: 'Clássico',
    classicTag: 'O visual próprio de cada widget',
    breadcrumb: 'Presets',
    eyebrow: 'Presets',
    title: 'Presets de jogos para os overlays da sua live',
    lead: 'Escolha um preset e sua Caixa de Chat, Alertas de Live, Meta de Subs, Subathon Timer, Enquete do Chat, vencedor do Sorteio e Molduras de Live ganham a mesma moldura, fontes e cores. Use um em todos os widgets, ou um diferente em cada.',
    pickTitle: 'Escolha um preset',
    by: 'por {author}',
    community: 'Comunidade',
    makeDefault: 'Usar {name} em todos os widgets',
    isDefault: '{name} é seu padrão',
    defaultHint:
      'Toda página de configuração neste navegador começa com o seu padrão. Você ainda pode escolher outro preset em qualquer widget.',
    previewTitle: '{name} em todos os widgets',
    setUp: 'Configurar {widget}',
    previewIframeTitle: 'Prévia de {widget} com o preset {name}',
    descriptions: {
      classic:
        'O visual com que cada widget foi feito: Alertas de Live em neon, a barra roxa da Meta de Subs e o texto simples da Caixa de Chat. Você escolhe as cores.',
      rift: 'Molduras douradas finas com tachas de diamante, painéis azul-marinho escuros e barras verde-azuladas brilhantes, com títulos em Cinzel.',
      realm:
        'Molduras de bronze e ouro com rebites, painéis de couro escuro e barras laranja lendárias, com títulos em Marcellus.',
      dynasty:
        'Molduras de laca vermelha com cantoneiras douradas, painéis de madeira escura e barras carmim, com títulos em Zen Antique.',
      ancient:
        'Molduras de ferro escuro com cantos de bronze, um brilho vermelho embaixo e títulos afiados em Grenze.',
      agent:
        'Cantos cortados, uma borda vermelha, barras inclinadas e números altos em Teko sobre ardósia escura.',
      defuse:
        'Cantoneiras de HUD, uma linha âmbar em cima, listras de perigo nas barras e a fonte condensada Saira.',
      blocks:
        'Molduras de pixel em cores de grama e terra, barras verdes divididas em blocos e a fonte pixelada Jersey 10.',
    },
    existingTitle: 'Já tem widgets no OBS?',
    existingText:
      'Cole as URLs deles aqui, uma por linha, e copie de volta com {name}. Depois cole cada uma no campo URL da fonte de navegador correspondente no OBS. O resto de cada URL continua igual.',
    existingLabel: 'URLs dos widgets',
    existingResult: 'Suas URLs com {name}',
    existingUnsupported: 'Não aceita preset, ficou como estava',
    existingInvalid: 'Não é uma URL de widget do Senchabot',
    communityTitle: 'Faça seu próprio preset',
    communityText:
      'Um preset é um arquivinho JSON: nove cores, duas Google Fonts e um estilo de moldura. Mande o seu como pull request no GitHub. Depois do merge, ele aparece aqui e em toda página de configuração com o seu nome.',
    communityLink: 'Como fazer um preset',
    communityEmpty: 'Ainda não tem presets da comunidade. O seu pode ser o primeiro.',
    disclaimer:
      'Os nomes dos jogos são marcas registradas dos seus donos. Estes presets são estilos de cor, fonte e desenho feitos por fãs, sem arte dos jogos, e não têm vínculo nem aval das empresas dos jogos.',
    faqTitle: 'Perguntas sobre presets',
    faq1Q: 'Os presets mudam os widgets que já estão no OBS?',
    faq1A:
      'Não. O visual de um widget faz parte da URL dele, então um widget no OBS mantém o visual até ganhar uma URL nova. Cole suas URLs na caixa acima para pegá-las de volta com o preset.',
    faq2Q: 'Cada widget pode ter um preset diferente?',
    faq2A:
      'Sim. Seu padrão é só o ponto de partida de cada página de configuração. Na página de configuração de qualquer widget você pode escolher outro preset, e a URL daquele widget leva ele junto.',
    faq3Q: 'Quais widgets aceitam preset?',
    faq3A:
      'Caixa de Chat, Alertas de Live, Meta de Subs, Subathon Timer, Enquete do Chat, o overlay do vencedor do Sorteio e Molduras de Live. O Mural de Emotes só mostra emotes e o Sub Sprout desenha suas próprias plantas, então os dois mantêm o visual deles.',
    faq4Q: 'Estes são temas oficiais dos jogos?',
    faq4A:
      'Não. São estilos feitos por fãs a partir de cores, Google Fonts gratuitas e enfeites desenhados do zero, sem logos nem arte dos jogos, e não têm vínculo com as empresas dos jogos.',
    field: {
      label: 'Preset',
      tip: 'Um visual pronto para este widget: moldura, fontes e cores. Escolha o mesmo preset em todos os widgets para eles combinarem.',
      browse: 'Todos os presets',
      owns: 'Cores e fontes vêm de {name}.',
      makeDefault: 'Deixar {name} como meu padrão',
      makeDefaultTip: 'Toda página de configuração neste navegador vai começar com ele.',
      isDefault: 'Seu padrão',
    },
  },
  faqPage: {
    breadcrumb: 'FAQ',
    title: 'Perguntas frequentes',
    lead: 'Respostas rápidas sobre preço, privacidade, plataformas e URLs dos widgets do Senchabot Extensions. Para configurar um widget específico, veja os [guias](/guides).',
    groups: {
      basics: 'Preço e conta',
      platforms: 'Programas e plataformas',
      urls: 'A URL do seu widget e privacidade',
      help: 'Suporte',
    },
    freeQ: 'O Senchabot Extensions é grátis?',
    freeA:
      'Sim. Os nove widgets e ferramentas são grátis: Caixa de Chat, Mural de Emotes, Sub Sprout, Subathon Timer, Alertas de Live, Meta de Subs, Enquete do Chat, Sorteio e OBS Bridge. Não tem plano pago, marca d’água nem conta premium. O código-fonte é aberto no GitHub sob a licença GPL-3.0.',
    loginQ: 'O que quer dizer "sem login"?',
    loginA:
      'Você não cria conta neste site, não entra com a Twitch nem com a Kick e não baixa nada. Você digita o nome do seu canal e a página de configuração te dá uma URL. Os widgets leem o chat público de forma anônima: na Twitch eles conectam como um espectador anônimo, e na Kick ouvem o feed público do chat. Por isso eles não conseguem escrever no chat, moderar nem acessar informações privadas da sua conta.',
    affiliatedQ: 'O Senchabot Extensions tem vínculo com a Twitch ou a Kick?',
    affiliatedA:
      'Não. O Senchabot Extensions é feito pelo Senchabot, um bot de comunidade de código aberto para Twitch, Discord, Kick e YouTube. Ele não tem nenhuma ligação oficial, parceria ou aval da Twitch ou da Kick.',
    appsQ: 'Com quais programas de live funciona?',
    appsA:
      'OBS Studio e qualquer outro programa de live que aceite fonte de navegador. Cada widget roda como uma URL da web, e você cola essa URL na fonte. Nossos guias são escritos para o OBS Studio.',
    platformsQ: 'Quais widgets funcionam na Twitch e quais funcionam na Kick?',
    platformsA:
      'Os onze funcionam nas duas plataformas. Caixa de Chat, Mural de Emotes, Sub Sprout, Subathon Timer, Alertas de Live, Meta de Subs, Enquete do Chat e Contagem Regressiva ouvem um canal da Twitch e um da Kick juntos em uma URL. O OBS Bridge ouve comandos dos dois chats, e cada usuário autorizado é adicionado com a sua própria plataforma. O Sorteio roda em uma plataforma por vez, Twitch ou Kick. Na Caixa de Chat, os emotes da 7TV aparecem nas duas plataformas, e os da BTTV e da FFZ só na Twitch.',
    editQ: 'Como mudo um widget depois?',
    editA:
      'Mude as configurações na página de configuração, copie a URL nova e cole por cima da antiga no campo URL da fonte no OBS. Com Caixa de Chat, Mural de Emotes, Sub Sprout, Subathon Timer, Alertas de Live, Meta de Subs, Enquete do Chat, Molduras de Live, Redes Sociais e Contagem Regressiva, se você colar sua URL antiga no campo URL do widget na página de configuração, todas as suas configurações voltam e você não precisa começar do zero.',
    oldUrlsQ: 'As URLs antigas dos meus widgets continuam funcionando?',
    oldUrlsA:
      'Sim. As atualizações são feitas para as URLs existentes não quebrarem: nomes de parâmetros, valores e padrões continuam os mesmos. Por exemplo, o antigo keep=true da Caixa de Chat ainda quer dizer Para sempre, e o Sub Sprout ainda lê os parâmetros antigos channel e platform.',
    privacyQ: 'Onde ficam minhas configurações e para onde vão meus dados?',
    privacyA:
      'Suas configurações ficam dentro da URL do widget, não em uma conta ou banco de dados, então qualquer pessoa que tenha a URL consegue abrir o mesmo widget. Como em qualquer site, o endereço da página que você abre chega na nossa hospedagem e pode aparecer nos logs de requisição dela. Os widgets leem o chat de forma anônima direto da Twitch e da Kick, pegam emotes da 7TV, BetterTTV e FrankerFaceZ, e pegam informações do canal da Twitch no ivr.fi. Os participantes e vencedores do Sorteio ficam no seu próprio navegador. A URL do OBS Bridge contém a senha do WebSocket do seu OBS, então trate ela como uma senha.',
    emptyQ: 'Por que meu widget aparece vazio no OBS?',
    emptyA:
      'A Caixa de Chat e o Mural de Emotes ficam transparentes e vazios até algo acontecer no chat, então mande uma mensagem no chat primeiro. Se ainda não aparecer nada, confira se você digitou só o nome do canal, não um link, no campo do canal, e se o nome está escrito certo. A lista completa de verificações está no guia do OBS.',
    bugQ: 'Como peço um widget ou relato um bug?',
    bugA: 'Abra uma issue nova no repositório senchabot-opensource/monorepo no GitHub. Ao relatar um bug, inclua a URL do widget (tire a senha se tiver uma), o programa de live que você usa e o que você está vendo. Para ideias, você também pode usar o GitHub Discussions ou o servidor do Senchabot no Discord.',
    ctaTitle: 'Não achou sua resposta?',
    ctaText:
      'Os guias explicam a configuração passo a passo e como resolver problemas. Ainda travado? Fale com a gente no GitHub.',
    ctaGuides: 'Ir para os guias',
    ctaIssue: 'Abrir uma issue no GitHub',
  },
  changelog: {
    breadcrumb: 'Histórico de mudanças',
    title: 'Histórico de mudanças',
    lead: 'Recursos novos e correções de bugs no Senchabot Extensions, dos mais novos para os mais antigos. A lista é montada a partir do histórico de commits do projeto no [GitHub](https://github.com/senchabot-opensource/monorepo/commits/dev/apps/extensions).',
    site: 'Site',
    entries: {
      moreLanguages:
        'O site agora também está em espanhol, francês, japonês e português, e Enquete do Chat, Alertas de Live e os valores do Subathon Timer também podem mostrar os textos nesses idiomas.',
      countdownSceneCommand:
        'Novo comando de chat `!countdown {scene} {duration}`. Os mods agora podem mudar a cena atual (início, pausa ou encerramento) e definir a duração dela com um comando só.',
      socialsLaunch:
        'Widget novo: Redes Sociais. Mostre suas redes sociais em rodízio com uma animação de deslizar caprichada.',
      thinBarReadable:
        'A Barra fina do Subathon Timer e da Meta de Subs tem texto maior e contornado, que continua legível em qualquer preenchimento, um brilho menor e espaço acima dos valores.',
      thinBars:
        'O Subathon Timer e a Meta de Subs agora têm o estilo Barra fina, que coloca o título e o tempo ou a contagem direto dentro de uma barra de progresso mais estreita.',
      subathonAdjustedDefaults:
        'Ajustar valores pelo tempo, no Subathon Timer, agora começa em 5 horas com valores menores já preenchidos: na Twitch 5 min por sub, 10 min por sub de presente e 20 min a cada 500 Bits, na Kick 10 min cada.',
      subathonDynamicRates:
        'O Subathon Timer agora tem valores ajustáveis: defina um limite de troca para diminuir quanto tempo um sub adiciona quando o relógio já está alto.',
      scrollHint:
        'Os painéis de configuração que não cabem na tela agora mostram uma setinha embaixo, para ficar claro que tem mais opções abaixo. Clique nela para descer, e quando você chega ao fim ela vira e te leva de volta ao topo.',
      chatTextShadow:
        'A Caixa de Chat tem a opção Sombra do texto: Nenhuma, Normal (como antes) ou Forte, um contorno escuro que mantém o chat legível em jogos claros.',
      chatFonts:
        'A Caixa de Chat agora tem uma caixa de fonte para os nomes e outra para as mensagens, e as duas continuam abertas com um preset: mantenha as duas fontes que vieram com o preset, use a fonte de título dele nas mensagens também, ou misture qualquer uma com Inter, Roboto, Nunito, JetBrains Mono, Source Serif 4 ou a fonte do seu sistema. Nomes em negrito e mensagens em negrito agora também funcionam em presets cuja fonte só tem um peso, como Realm, Dynasty e Blocks.',
      sproutSaved:
        'O Sub Sprout agora guarda a planta quando o OBS recarrega e leva ela para a próxima live, em vez de começar do primeiro estágio toda vez. Os mods podem recomeçar com !grow reset.',
      countdown:
        'Nova Contagem Regressiva: um relógio para as cenas de começando em breve, já volto e fim da live. Defina uma duração ou o horário em que você entra ao vivo, escolha um preset e deixe seus mods adiarem pelo chat com !countdown.',
      deviceTheme:
        'O site agora abre no tema claro ou escuro do seu dispositivo e acompanha quando ele muda. Depois que você clica no botão de tema no topo, sua escolha fica salva e o dispositivo para de mudar o tema.',
      frames:
        'Novas Molduras de Live: molduras prontas para sua câmera, seu chat e a tela inteira da live. Cada preset vem com arte própria, tipo telhado de pagode e lanternas no Dynasty ou blocos de pixel no Blocks.',
      subathonRates:
        'O Subathon Timer agora pode listar quanto um sub, um sub de presente e 500 Bits ou Kicks adicionam, direto no timer, para o pessoal saber quanto vale o sub.',
      presets:
        'Presets novos: um visual só para Caixa de Chat, Alertas de Live, Meta de Subs, Subathon Timer, Enquete do Chat e o vencedor do Sorteio, com presets de jogos para League of Legends, World of Warcraft, Metin2, Dota 2, Valorant, CS2 e Minecraft.',
      poll: 'Nova Enquete do Chat: abra uma enquete pelo chat com !poll, e os espectadores na Twitch e na Kick votam digitando um número. Barras ao vivo, timer, um voto por espectador e o vencedor no final.',
      goal: 'Nova Meta de Subs: uma barra de meta que cada sub, resub e sub de presente na Twitch e na Kick enche em um, com um troféu quando você bate a meta. Os mods podem corrigir a contagem com !goal.',
      streamAlerts:
        'Novos Alertas de Live: um alerta animado com som próprio para cada sub, sub de presente, Bits, Kicks e raid na Twitch e na Kick. Escolha uma cor, renomeie os títulos e defina valores mínimos.',
      subathon:
        'Novo Subathon Timer: uma contagem regressiva que subs, subs de presente, Bits e Kicks empurram para frente, em forma de barra de vida, relógio ou anel. Você escolhe quanto tempo cada um adiciona, e os mods controlam com !subathon.',
      chatReader:
        'Novo Leitor de Chat: leia seu chat da Twitch e da Kick numa aba do navegador ou num painel do OBS. Ele reconecta sozinho com uma contagem, marca cada queda no chat e guarda seu histórico quando você atualiza a página.',
      chatSilentDrop:
        'A Caixa de Chat, o Mural de Emotes e o OBS Bridge percebem quando a conexão com o chat fica em silêncio depois de uma queda de internet e reconectam sozinhos, na hora que a internet volta. Antes, isso podia levar minutos ou precisar de uma atualização.',
      contentPages: 'Guias novos, uma página de FAQ e este histórico de mudanças.',
      siteNav:
        'Toda página tem o mesmo cabeçalho e rodapé: o menu de widgets, a escolha de idioma e de tema, e links para os guias e o suporte.',
      notFound:
        'Entrar numa URL que não existe abre uma página 404 com links para todos os widgets.',
      geist:
        'As páginas do site usam a Geist, a mesma fonte do senchabot.com. As fontes dos overlays continuam as mesmas.',
      chatNextSteps:
        'Quando você copia a URL da Caixa de Chat, a página de configuração mostra os passos para adicionar no OBS junto com o tamanho recomendado.',
      raffleMonthsInput:
        'Dá para apagar o campo Mínimo de meses de sub no Sorteio enquanto digita, então digitar 6 não vira mais 16.',
      raffleKeywordRequired:
        'O Sorteio não pode mais começar com a palavra-chave vazia. Antes, dava para abrir um sorteio em que ninguém conseguia entrar.',
      raffleMonthsSubsOnly:
        'O Mínimo de meses de sub só vale com Só inscritos ligado, e o streamer pode entrar no próprio sorteio.',
      sproutPreviewSimulate:
        'A prévia de configuração do Sub Sprout continua animando o crescimento depois que você digita um canal, então você vê na hora a planta e os efeitos que escolheu.',
      sproutPreviewTint:
        'A área de prévia do Sub Sprout mostra o fundo levemente transparente que deveria ter, em vez de preto sólido.',
      emoteWallUrl:
        'A configuração do Mural de Emotes não escreve mais valores errados na URL quando os campos de duração e máximo ficam vazios, e não cria mais URLs sem canal.',
      bridgePassword:
        'O OBS Bridge manda a senha mesmo com a URL do WebSocket vazia. Conexões com senha agora funcionam quando o OBS está no mesmo computador.',
      chatFilters:
        'A Caixa de Chat pode esconder bots e comandos que começam com !, manter as mensagens de 10 segundos a 5 minutos ou para sempre, e deixa você escolher os provedores de emotes um por um.',
      chatEmoteProviders:
        'A Caixa de Chat mostra emotes da 7TV, BTTV e FFZ nas mensagens da Twitch e emotes da 7TV nas mensagens da Kick.',
      sproutKickGifts:
        'O Sub Sprout cresce com subs de presente na Kick, e cada sub de presente conta como um estágio.',
      bridgeUserPlatform:
        'O OBS Bridge salva os usuários autorizados junto com a plataforma deles. Quem pegar o mesmo nome na outra plataforma não consegue mais usar os comandos.',
      sevenTvActiveSet:
        'A Caixa de Chat e o Mural de Emotes pegam os emotes da 7TV do conjunto ativo do próprio canal. Antes, podiam aparecer emotes de outra conta com nome parecido.',
      chatColorCrash:
        'A Caixa de Chat não quebra mais numa tela de erro com mensagens que têm um valor de cor incomum.',
      bridgeReconnect:
        'O OBS Bridge faz uma tentativa só a cada 5 segundos enquanto o OBS está fechado ou a senha está errada. As tentativas de conexão não se multiplicam mais.',
      raffleFakeEntries:
        'O Sorteio não conta como entrada as linhas falsas escondidas dentro de mensagens de inscrição, então ninguém consegue usar isso para driblar o Só inscritos.',
      chatIrcParsing:
        'Um texto digitado no chat não consegue mais apagar a Caixa de Chat. Um timeout ou ban só remove as mensagens daquela pessoa.',
      chatHighlights:
        'A Caixa de Chat destaca mensagens que te marcam, respostas, quem fala pela primeira vez no chat, anúncios e mensagens de Destacar minha mensagem. Você escolhe quais ficam ligados na configuração.',
      chatPasteUrl:
        'Colar a URL de um widget na configuração da Caixa de Chat restaura todas as suas configurações.',
      chatSingleScreen:
        'A página de configuração da Caixa de Chat tem um layout novo que cabe em uma tela. As configurações ficam agrupadas em Canal, Aparência e Mensagens.',
      chatIconAlign:
        'Os ícones da Twitch e da Kick na Caixa de Chat têm o mesmo tamanho e ficam alinhados.',
      chatHideIndicator:
        'A Caixa de Chat pode esconder totalmente o indicador de plataforma quando a faixa de cor já basta.',
      chatSmoothSpeed:
        'A Caixa de Chat ganha a animação Deslizar suave da direita, e a prévia da configuração ganha uma opção de velocidade do chat.',
      chatAdaptiveAnimations:
        'As animações da Caixa de Chat ficam mais curtas quando o chat acelera. A padrão, Deslizar da direita, continua igual.',
      chatTypewriter:
        'A Caixa de Chat ganha a animação Máquina de escrever. Quando chega uma mensagem nova, as antigas deslizam para abrir espaço em vez de pular.',
      chatPlatformStripe:
        'Os ícones de plataforma da Caixa de Chat ficaram maiores, e você pode colocar uma faixa com a cor da plataforma à esquerda de cada mensagem.',
      emoteWallModes:
        'O Mural de Emotes ganha o modo Quicar, que faz os emotes quicarem nas bordas, um modo só de hype e proteção contra spam de emotes.',
      sproutPotLabel: 'O Sub Sprout pode mostrar um rótulo de estágio tipo 3/10 acima do vaso.',
      emoteWallLaunch:
        'Chegou o Mural de Emotes: mensagens só de emotes da Twitch e da Kick voam pela tela no modo Calmo ou Caos.',
      sproutBothPlatforms:
        'O Sub Sprout ouve um canal da Twitch e um da Kick juntos em uma URL. As URLs antigas com channel e platform continuam funcionando.',
      chatPreviewMock:
        'A prévia da Caixa de Chat continua tocando um chat de exemplo depois que você digita um canal, para você ver suas configurações sem ninguém conversando.',
      siteLanguages:
        'O site está disponível em turco e inglês, e você pode alternar entre os temas claro e escuro.',
      bridgeSceneCommand:
        'O OBS Bridge ganha o comando !scene, que troca para qualquer cena com nome correspondente. Você também pode renomear todos os comandos.',
      raffleBots: 'O Sorteio ignora automaticamente as entradas de bots conhecidos.',
      chatReadableColors:
        'A Caixa de Chat clareia as cores de nome difíceis de ler em fundo escuro, e as sombras das mensagens ficaram mais leves.',
      chatBoldBadges:
        'A Caixa de Chat ganha Mensagens em negrito e uma opção para esconder os emblemas. Os emblemas acompanham o tamanho da fonte.',
      sproutWatering: 'O Sub Sprout ganha os efeitos de rega de chuva e brilho.',
      chatItemBackground:
        'A Caixa de Chat ganha uma caixa de fundo para cada mensagem e a opção de nome em negrito. Se a conexão cair, ela reconecta ao chat sozinha.',
      bridgeLaunch:
        'Chegou o OBS Bridge: usuários autorizados podem trocar para as cenas BRB e principal com comandos no chat, e iniciar ou parar a transmissão e a gravação.',
      chatFade: 'A Caixa de Chat ganha a animação Fade in.',
      sproutVarieties:
        'O Sub Sprout ganha novos tipos de planta, como rosa, girassol, cacto, tulipa e lótus.',
      chatFontsLayouts:
        'A Caixa de Chat deixa você escolher a fonte, o layout da mensagem e a animação. Mensagens apagadas e mensagens de usuários banidos também saem do overlay.',
      raffleHardening:
        'O Sorteio escolhe o vencedor com um sorteio aleatório seguro, trava as regras quando o sorteio começa e não deixa sortear um vencedor antes de acabar a Duração mínima.',
      siteTutorial:
        'As páginas de configuração têm link para um vídeo tutorial. Na página do Sorteio, você copia a URL do overlay com um clique.',
      chatPlatformPick:
        'A Caixa de Chat deixa você escolher se o chat vem da Twitch, da Kick ou das duas.',
      chatSevenTv: 'A Caixa de Chat mostra emotes da 7TV.',
      chatTimestamp:
        'A Caixa de Chat deixa você escolher o nome ou o ícone da plataforma e pode mostrar o horário das mensagens.',
      siteSetupPages:
        'Uma página inicial nova está no ar, e cada widget agora tem sua própria página de configuração.',
      raffleLaunch:
        'Chegou o Sorteio: o pessoal entra digitando uma palavra-chave no chat, você pode definir um limite de vitórias por usuário, e o vencedor aparece na live com confete.',
      chatBgOpacity: 'A opacidade do fundo escuro da Caixa de Chat é ajustável.',
      chatEmotesBadges: 'A Caixa de Chat mostra emotes da Twitch e emblemas da Twitch e da Kick.',
      chatOrientation:
        'A Caixa de Chat também funciona na horizontal, então você pode colocar ela como uma barra na parte de baixo da tela.',
      sitePreview:
        'A página de configuração mostra uma prévia ao vivo do widget ao lado das configurações.',
      sproutKick: 'O Sub Sprout conta as inscrições da Kick também.',
      launch:
        'O Senchabot Extensions está no ar, com uma caixa de chat que junta o chat da Twitch e da Kick e o Sub Sprout, uma planta que cresce com as inscrições da Twitch.',
    },
  },
  socials: {
    breadcrumb: 'Configurar Redes Sociais',
    title: 'Configurar Redes Sociais',
    intro:
      'Mostre seus perfis nas redes sociais na live. O widget passa pelas plataformas que você preencher, mostrando uma por vez com uma animação de deslizar.',
    sectionPlatforms: 'Plataformas',
    platformsTip:
      'Digite seu nome de usuário em cada plataforma que você quer mostrar. Deixe o resto vazio.',
    sectionAppearance: 'Aparência',
    rotationInterval: 'Intervalo de troca',
    intervalSeconds: '{seconds} segundos',
    textColor: 'Cor do texto',
    animation: 'Animação',
    animSlideUp: 'Deslizar para cima',
    animSlideLeft: 'Deslizar para a esquerda',
    animScale: 'Crescer',
    animFade: 'Fade',
    pillColor: 'Cor de fundo da pílula',
    previewTitle: 'Prévia das Redes Sociais',
    previewIframeTitle: 'Prévia das Redes Sociais',
    previewHint: 'Prévia ao vivo do rodízio das suas redes sociais.',
    widgetUrlTip:
      'Já fez um widget? Cole a URL dele aqui para carregar suas configurações e mudar o que precisar.',
    widgetUrlPlaceholder: 'Cole a URL de um widget para editar',
    widgetUrlInvalid: 'Esta não é uma URL do widget Redes Sociais.',
    browserSourceHintSize: ' (tamanho recomendado: 600×120).',
    guideTitle: 'Configuração no programa de live (OBS, Streamlabs, XSplit etc.)',
    guideStep1:
      'Adicione uma fonte de navegador no seu programa de live (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio etc.).',
    guideStep2: 'Cole a URL das redes sociais que você copiou.',
    guideStep3: 'Coloque a largura em 600 e a altura em 120.',
    faq1Q: 'O widget atualiza se eu mudar meus nomes de usuário?',
    faq1A:
      'Você precisa atualizar sua URL. Volte a esta página, cole sua URL atual para carregar suas configurações, digite os novos nomes de usuário e copie a URL nova para o seu programa de live.',
  },
};
