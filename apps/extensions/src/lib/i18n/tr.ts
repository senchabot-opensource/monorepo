import type { en } from './en';

export const tr: typeof en = {
  common: {
    freeBadge: '%100 Ücretsiz · Giriş Gerektirmez',
    copy: 'Kopyala',
    copied: 'Kopyalandı!',
    home: 'Anasayfa',
    watchTutorial: 'Kurulum Videosunu İzle',
    widgetUrl: 'Widget URL',
    toolUrl: 'Araç URL',
    channelPlaceholder: 'örn. kanalın',
    previewNoChannel: 'Önizleme oluşturmak için en az bir kanal gir.',
    browserSourceHint:
      "Bu URL'yi OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio veya tarayıcı kaynağı destekleyen herhangi bir yazılımda Tarayıcı Kaynağı olarak yapıştır",
    themeToggle: 'Tema değiştir',
    languageToggle: 'Dil değiştir',
    moreInfo: 'Daha fazla bilgi',
    sectionChannel: 'Kanal',
    sectionAppearance: 'Görünüm',
    platforms: 'Platformlar',
    platformsTip:
      "Hangi platformu dinleyeceğini seç. Twitch ve Kick'te aynı anda yayın yapıyorsan ikisini birden seç.",
    platformBoth: 'İkisi',
    twitchChannel: 'Twitch Kanalı',
    kickChannel: 'Kick Kanalı',
    channelTip:
      'Tam linki değil, sadece kanal adını yaz. Örneğin twitch.tv/senchabot için senchabot.',
    previewLoading: 'Önizleme yükleniyor…',
    setupGuideTitle: 'Nasıl kurulur?',
    faqTitle: 'Sık sorulan sorular',
    moreWidgets: "Diğer widget'lar",
    nextSteps: {
      title: 'Şimdi yayın programına ekle',
      addSource:
        "OBS Studio'da ya da tarayıcı kaynağı destekleyen başka bir programda yeni bir Tarayıcı Kaynağı ekle.",
      paste: 'Kopyaladığın adresi URL alanına yapıştır.',
      size: 'Genişliği {width}, yüksekliği {height} yap.',
      test: 'Çalıştığını görmek için adresi yeni sekmede aç',
      dismiss: 'Gizle',
    },
    siteName: 'Senchabot Extensions',
    homeLink: 'Senchabot Extensions ana sayfası',
    skipToContent: 'İçeriğe geç',
    newTab: '(yeni sekmede açılır)',
    nav: {
      label: 'Ana menü',
      menu: 'Menü',
      openMenu: 'Menüyü aç',
      closeMenu: 'Menüyü kapat',
      widgets: "Widget'lar",
      guides: 'Rehberler',
      presets: "Preset'ler",
      faq: 'SSS',
      senchabot: 'Senchabot',
      github: "GitHub'daki kaynak kodu",
      switchWidget: "Başka bir widget'a geç",
      breadcrumb: 'Sayfa yolu',
    },
    notFound: {
      title: 'Sayfa bulunamadı',
      text: 'Aradığın sayfa yok ya da taşınmış. Aşağıdan bir widget seç ya da ana sayfaya dön.',
      home: 'Ana sayfaya dön',
    },
    footer: {
      about:
        "Twitch ve Kick için ücretsiz overlay'ler ve yayın araçları. Giriş yok, indirme yok, kaynak kodu herkese açık.",
      license: "GPL-3.0 lisanslı, kaynak kodu GitHub'da",
      social: 'Sosyal medyada Senchabot',
      guides: 'Rehberler',
      setupGuides: 'Kurulum rehberleri',
      presets: "Oyun preset'leri",
      faq: 'Sık sorulan sorular',
      changelog: 'Yenilikler',
      senchabotBot: 'Senchabot botu',
      docs: 'Dokümantasyon',
      discussions: 'GitHub Tartışmaları',
      reportBug: 'Hata bildir ya da widget iste',
      notAffiliated: 'Twitch veya Kick ile resmi bir bağlantımız yok.',
    },
  },
  widgets: {
    overlays: "Overlay'ler",
    tools: 'Araçlar',
    chatBox: {
      name: 'Sohbet Kutusu',
      tagline: "Twitch ve Kick sohbeti tek bir overlay'de, 7TV, BTTV ve FFZ emote'larıyla birlikte.",
    },
    emoteWall: {
      name: 'Emote Duvarı',
      tagline: "Sadece emote'tan oluşan sohbet mesajları ekranında uçuşur.",
    },
    subSprout: {
      name: 'Sub Sprout',
      tagline: 'Her yeni abonelikle biraz daha büyüyen bir yayın bitkisi.',
    },
    goal: {
      name: 'Abone Hedefi',
      tagline: 'Her abonelik ve hediye abonelikle dolan bir bar, hedefe ulaşınca üstüne kupa iner.',
    },
    frames: {
      name: 'Yayın Çerçeveleri',
      tagline: "Kameran, sohbetin ve yayın ekranın için preset'e göre çizilmiş hazır çerçeveler.",
    },
    subathon: {
      name: 'Subathon Timer',
      tagline:
        'Abonelik, hediye abonelik, Bits ve Kicks geldikçe uzayan bir geri sayım. Can barı, saat ya da halka.',
    },
    poll: {
      name: 'Sohbet Anketi',
      tagline: 'Sohbet numara yazarak oy verir, barlar canlı dolar, sonunda kazanan çıkar.',
    },
    streamAlerts: {
      name: 'Yayın Uyarıları',
      tagline:
        'Her abonelik, hediye abonelik, Bits, Kicks ve raid için sesli, animasyonlu bir uyarı.',
    },
    raffle: {
      name: 'Çekiliş',
      tagline: 'İzleyiciler !join gibi bir komutla katılır, kazananı sen çekersin.',
    },
    obsBridge: {
      name: 'OBS Bridge',
      tagline: "Sohbet komutlarıyla OBS'te sahne değiştir, yayını ve kaydı yönet.",
    },
  },
  home: {
    heroTitle: "Twitch ve Kick için ücretsiz yayın overlay'leri",
    heroLead:
      "Widget'ını canlı önizlemeyle ayarla, çıkan tek URL'yi OBS'e yapıştır. Hesap yok, filigran yok, kodu da açık kaynak.",
    browseWidgets: "Widget'lara göz at",
    viewOnGithub: "GitHub'da incele",
    trustLabel: 'Öne çıkanlar',
    trustFree: 'Ücretsiz',
    trustNoLogin: 'Giriş yok',
    trustOpenSource: 'Açık kaynak',
    trustPlatforms: 'Twitch + Kick',
    sceneLive: 'Canlı',
    sceneCaption: 'Örnek sohbetle çalışan canlı demo',
    demoTitle: '{name} demosu',
    worksWithTitle: 'Nerelerde çalışır',
    worksWithApps: 'Yayın programları',
    worksWithAppsText: 'OBS Studio ve tarayıcı kaynağı destekleyen diğer programlar',
    galleryTitle: 'Bir widget seç',
    galleryLead:
      'Her birinin canlı önizlemeli kendi ayar sayfası var. İndirmen gereken hiçbir şey yok.',
    overlaysLead: 'Sahneye ekledikten sonra kendi kendine çalışan tarayıcı kaynakları.',
    toolsLead: 'Yayın boyunca sayfadan ya da sohbetten senin yönettiğin araçlar.',
    setUp: 'Ayarla',
    toolFeatures: 'Özellikler',
    raffleFeatureKeyword: '!join gibi katılım komutu',
    raffleFeatureSubs: 'Sadece aboneler, minimum ay şartıyla',
    raffleFeatureDuration: 'Çekilişten önce minimum süre',
    obsFeatureScenes: 'Sohbetten sahne değiştir',
    obsFeatureCommands: 'Komut adlarını sen belirle',
    obsFeatureLocal: 'Yerel obs-websocket bağlantısı',
    subathonFeatureChat: 'Sohbetten !subathon ile yönet',
    subathonFeaturePlatforms: 'Twitch ve Kick için ayrı süreler',
    subathonFeatureSaved: 'OBS kapansa da kalan süre korunur',
    pollFeatureVote: 'İzleyiciler numara yazarak oy verir',
    pollFeatureBoth: 'Twitch ve Kick oyları tek ankette',
    pollFeatureLate: 'Son saniye oyları gecikmeye rağmen sayılır',
    pollSpotlight: {
      eyebrow: 'Yeni: Sohbet Anketi',
      title: 'Kararı sohbetin versin',
      lead: "Sohbetten !poll ile bir anket başlat, Twitch ve Kick'teki izleyiciler numara yazarak oy versin. Barlar yayında canlı dolar, süre bitince kazanan ekrana gelir.",
      pointVote:
        'İzleyiciler 2, !vote 2 ya da seçeneğin kendisini yazar. Her izleyici bir kez sayılır.',
      pointBoth: "Twitch ve Kick'ten gelen oylar aynı ankette toplanır.",
      pointLate:
        'İzleyiciler yayını biraz geriden izlese de son saniyelerde yazılan oylar sayılır.',
      pointMods: 'Anketi sen ve modların sohbetten yönetirsiniz. Bot yok, giriş yok.',
      setup: "Sohbet Anketi'ni kur",
      guide: 'Rehberi oku',
      chat: 'Sohbet',
      caption: 'Sahte izleyicilerin oy verdiği canlı demo',
    },
    visualScenes: 'Sahneler',
    howTitle: 'Nasıl çalışır?',
    howLead: 'Üç adım, hiçbirinde hesap açmak yok.',
    howStep1: 'Bir widget seç ve ayarlarını yap. Canlı önizleme her değişikliği anında gösterir.',
    howStep2: "Kanal adını yaz ve widget URL'sini kopyala.",
    howStep3:
      "OBS Studio'da bir Tarayıcı Kaynağı ekle, URL'yi yapıştır ve önerilen boyutu gir.",
    sizesTitle: 'Önerilen Tarayıcı Kaynağı boyutları',
    sizesNote: 'Genişlik × yükseklik, piksel olarak.',
    sizesWidget: 'Widget',
    sizesValue: 'Boyut',
    trustTitle: 'Hesap yok, sürpriz yok',
    noLoginTitle: 'Giriş yok',
    noLoginText:
      "Widget'lar kanalının herkese açık sohbetini, giriş yapmamış bir izleyici gibi okur. Twitch ya da Kick hesabını hiçbir yere bağlamazsın.",
    noWatermarkTitle: 'Filigran yok',
    noWatermarkText:
      "Overlay'lerine logo ya da yazı eklenmez. Önizlemede ne görüyorsan yayında da o çıkar.",
    openSourceTitle: 'Açık kaynak',
    openSourceText:
      "Kodun tamamı GPL-3.0 lisansıyla GitHub'da. İnceleyebilir, fork'layabilir ya da düzeltme gönderebilirsin.",
    urlSettingsTitle: "Ayarların URL'de saklı",
    urlSettingsText:
      "Widget ayarları doğrudan URL'nin içine yazılır, bu yüzden onları tutacak bir hesaba gerek yok. URL'yi sakla, widget'ın hep elinde olsun.",
    senchabotTitle: "Bir sohbet botu mu lazım? Senchabot'u dene",
    senchabotText:
      "Bu widget'ları yapan ekip Senchabot'u da geliştiriyor: Twitch'te özel sohbet komutları, zamanlayıcılar ve shoutout'lar, yayına başladığında da Discord sunucunda duyuru.",
    senchabotCta: "senchabot.com'a git",
    communityTitle: 'Sen de dahil ol',
    communityLead: 'Proje açık kaynak ve destek olmanın birkaç kolay yolu var.',
    starTitle: "GitHub'da yıldız ver",
    starText: 'Yıldızlar, projenin daha fazla yayıncıya ulaşmasını sağlıyor.',
    starCount: '{count} yıldız',
    requestTitle: 'Widget iste',
    requestText: 'Yayının için bir şey mi eksik? Bir issue aç, neye ihtiyacın olduğunu yaz.',
    discordTitle: "Discord'a katıl",
    discordText: 'Soru sor, kurulumunu diğer yayıncılarla paylaş.',
    faqMore: 'Cevabını bulamadın mı?',
    faq1Q: 'Gerçekten ücretsiz mi?',
    faq1A:
      "Evet. Tüm widget'lar ve araçlar ücretsiz. Ücretli bir paket yok, overlay'lerine filigran da eklenmez. Proje açık kaynak ve Senchabot ekibi tarafından geliştiriliyor.",
    faq2Q: '"Giriş yok" tam olarak ne demek?',
    faq2A:
      'Hiçbir yere giriş yapmaz, Twitch ya da Kick hesabını bağlamazsın. Sadece kanal adını yazarsın, widget da o kanalın herkese açık sohbetini giriş yapmamış bir izleyici gibi anonim olarak okur. Yani sohbette herkesin görebildiğini görür, fazlasını değil.',
    faq3Q: 'Hangi yayın programlarıyla çalışır?',
    faq3A:
      "OBS Studio ve tarayıcı kaynağı destekleyen diğer programlarla. Widget URL'sini Tarayıcı Kaynağı olarak ekle ve kurulum sayfasında yazan boyutu kullan.",
    faq4Q: "Twitch ve Kick'i birlikte kullanabilir miyim?",
    faq4A:
      "Evet. Sohbet Kutusu, Emote Duvarı, Sub Sprout, Subathon Timer, Yayın Uyarıları, Abone Hedefi ve Sohbet Anketi tek bir URL'de hem Twitch hem Kick kanalını alır. OBS Bridge da iki sohbeti aynı anda dinleyebilir. Çekiliş ise her seferinde tek bir platformda çalışır.",
    faq5Q: "Bir widget'ı sonradan nasıl değiştiririm?",
    faq5A:
      "Kurulum sayfasını aç, widget'ı istediğin gibi ayarla ve Tarayıcı Kaynağı'ndaki URL'yi yenisiyle değiştir. Sohbet Kutusu, Emote Duvarı, Sub Sprout, Subathon Timer, Yayın Uyarıları, Abone Hedefi, Sohbet Anketi ve Yayın Çerçeveleri mevcut bir URL'yi de açabilir: URL'yi kurulum sayfasına yapıştır, eski ayarların geri gelsin, sadece istediğini değiştir.",
    faq6Q: "Güncellemelerden sonra widget URL'm çalışmaya devam eder mi?",
    faq6A:
      'Evet. Güncellemelerde mevcut URL ayarları ve değerleri korunur, yani sahnendeki widget için yeni bir URL almana gerek kalmaz.',
  },
  chatWidget: {
    breadcrumb: 'Sohbet Kutusu Kurulumu',
    title: 'Sohbet Kutusu Kurulumu',
    intro:
      "Twitch ve Kick sohbetini tek bir kaplamada birleştiren çoklu sohbet widget'ı. 7TV emote'ları iki platformda da, BTTV ve FFZ emote'ları Twitch'te görünür, rozetler de gösterilir. Düzeni, yazı tipini ve animasyonu sen seçersin.",
    platformIndicator: 'Platform Göstergesi',
    platformName: 'Platform Adı',
    platformIcon: 'Platform Simgesi',
    platformHidden: 'Platformu Gizle',
    sectionMessages: 'Mesajlar',
    platformsTip:
      'Sohbeti hangi platformlardan alacağını seç. İkisini seçersen Twitch ve Kick mesajları tek akışta birleşir.',
    platformIndicatorTip:
      'İki platform birlikteyken her mesajın yanında nereden geldiğini gösterir: platform adı, simgesi ya da hiçbir şey.',
    orientationTip:
      'Dikeyde mesajlar alt alta dizilir, klasik sohbet kutusu gibi. Yatayda yan yana akar, ekranın altına şerit olarak koymak için ideal.',
    darkBackgroundTip:
      "Widget'ın arkasına yarı saydam siyah bir zemin koyar. Açık renkli sahnelerde yazıları okumayı kolaylaştırır.",
    emotesTip:
      "Seçtiğin sağlayıcıların emote'ları resim olarak görünür, seçmediklerin düz yazı kalır. 7TV hem Twitch hem Kick'te çalışır, BTTV ve FFZ sadece Twitch'te.",
    messageDurationTip:
      'Mesajlar bu süre dolunca kaybolur. "Süresiz" seçersen ekranda kalırlar, yeni gelenler eskileri yukarı iter.',
    hideBotsTip:
      'Nightbot, StreamElements, Fossabot, BotRix ve KickBot gibi bilinen botların, bir de Twitch\'te "Chat Bot", Kick\'te "Bot" rozeti olan hesapların mesajlarını gizler.',
    hideCommandsTip: '!discord veya !uptime gibi "!" ile başlayan mesajları gizler.',
    badgesTip: 'Kullanıcı adının yanında yayıncı, moderatör, VIP ve abone rozetlerini gösterir.',
    animationTip:
      'Yeni mesajın ekrana nasıl gireceğini belirler. Sohbet hızlandıkça animasyonlar otomatik olarak kısalır.',
    font: 'Yazı Tipi',
    fontSystem: 'Sistem Varsayılanı',
    messageLayout: 'Mesaj Düzeni',
    layoutInline: 'Satır içi — Kullanıcı adı: mesaj',
    layoutStacked: 'Üst üste — kullanıcı adı üstte',
    layoutCard: 'Kart / Balon',
    layoutCompact: 'Kompakt (Twitch benzeri)',
    newMessageAnimation: 'Yeni Mesaj Animasyonu',
    animSlide: 'Sağdan kayarak gir + solma',
    animSmoothSlide: 'Sağdan yumuşakça kayarak gir',
    animPop: 'Belirerek büyü / ölçeklen',
    animBounce: 'Zıplayarak gir',
    animStagger: 'Sıralı (önce bilgi, sonra mesaj)',
    animFade: 'Solayarak belir',
    animTyping: 'Daktilo gibi yaz',
    animNone: 'Animasyon yok',
    orientation: 'Yön',
    vertical: 'Dikey',
    horizontal: 'Yatay',
    fontSize: 'Yazı Boyutu (px)',
    darkBackground: 'Koyu Arka Plan',
    emotes: "Emote'lar",
    emotesNone: 'Kapalı',
    messageDuration: 'Mesaj Süresi',
    durationSeconds: '{count} sn',
    durationMinutes: '{count} dk',
    durationKeep: 'Süresiz',
    hideBots: 'Botları Gizle',
    hideCommands: 'Komutları Gizle',
    showBadges: 'Rozetleri Göster',
    showMessageTime: 'Mesaj Saatini Göster',
    backgroundOpacity: 'Arka Plan Saydamlığı',
    messageBackgroundBox: 'Mesaj Arka Plan Kutusu',
    messageBackgroundHint: 'Her mesaj kendi çerçeveli arka plan kutusunu alır.',
    platformAccent: 'Platform Renk Şeridi',
    platformAccentHint:
      'Her mesajın solundaki Twitch moru ya da Kick yeşili şerit, mesajın nereden geldiğini gösterir.',
    boldUsernames: 'Kalın Kullanıcı Adları',
    boldMessages: 'Kalın Mesajlar',
    highlights: 'Vurgular',
    highlightsTip:
      "Yayında ince renkli bir şeritle işaretlenecek mesajları seç. Yanıtların üstünde kime cevap verildiği görünür, Twitch etiketliler sadece Twitch'te var.",
    highlightMention: 'Seni etiketleyenler',
    highlightReply: 'Yanıtlanan mesaj',
    highlightFirstMessage: 'Sohbete ilk katılanlar',
    highlightAnnouncement: 'Duyurular',
    highlightHighlighted: 'Mesajınızı Vurgulayın',
    highlightsAll: 'Hepsi',
    highlightsNone: 'Kapalı',
    announcement: 'Duyuru',
    firstMessage: 'Sohbete İlk Katılan',
    previewTitle: 'Widget Önizleme (Sohbet Kutusu)',
    previewIframeTitle: 'Sohbet Widget Önizleme',
    previewSpeed: 'Önizleme Sohbet Hızı',
    previewSpeedValue: '{rate} mesaj/sn',
    previewSpeedHint: "Sadece önizlemeyi etkiler, widget URL'si değişmez.",
    previewHint: 'Animasyonlu mesaj akışıyla canlı sohbet önizlemesi.',
    guideTitle: 'Yayın Yazılımı Sohbet Kutusu Kurulumu (OBS, Streamlabs, XSplit vb.)',
    guideStep1:
      'Yayın yazılımında (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio vb.) bir Tarayıcı Kaynağı ekle.',
    guideStep2: "Kopyaladığın çoklu sohbet widget URL'sini yapıştır.",
    guideStep3:
      'Genişlik ve yüksekliği istediğin sohbet kutusu kaplama boyutlarına ayarla (örn. dikey için 400×600).',
    browserSourceHintSize: ' (önerilen boyut: sohbet kutusu için 400×600).',
    widgetUrlTip:
      "Daha önce bir widget oluşturduysan URL'sini buraya yapıştır. Ayarların geri yüklenir, istediğini değiştirebilirsin.",
    widgetUrlPlaceholder: "Düzenlemek için widget URL'sini yapıştır",
    widgetUrlInvalid: "Bu bir Sohbet Kutusu widget URL'si değil.",
    openReader: "Sohbet Okuyucu'yu Aç",
    openReaderHint:
      "Kendi sohbetini bir tarayıcı sekmesinde ya da OBS dock'unda oku. Bağlantı koparsa kendi kendine yeniden bağlanır, her kopmayı sohbete not düşer. Sayfayı yenilesen de geçmişin kaybolmaz.",
    faq1Q: "Sohbet kutusunu kullanmak için Twitch veya Kick'e giriş yapmam gerekiyor mu?",
    faq1A:
      'Giriş gerekmez. Sohbet Kutusu, her iki platformun herkese açık sohbet akışlarını anonim olarak dinler.',
    faq2Q: "Bu çoklu sohbet widget'ı 7TV emote'larıyla çalışıyor mu?",
    faq2A:
      "Evet. 7TV kanal ve global emote'ları hem Twitch hem Kick mesajlarında görünür, BTTV ve FFZ emote'ları ise sadece Twitch mesajlarında. Üçü de varsayılan olarak açık, istediğini Emote'lar menüsünden kapatabilirsin.",
  },
  chatReader: {
    title: 'Sohbet Okuyucu',
    listLabel: 'Sohbet mesajları',
    noChannel: "Bu linkte kanal yok. Sohbet Okuyucu'yu Sohbet Kutusu kurulum sayfasından aç.",
    empty: '{channels} sohbetinde mesaj bekleniyor…',
    statusConnecting: 'Bağlanıyor',
    statusConnected: 'Bağlı',
    statusReconnecting: 'Yeniden bağlanıyor',
    notFound: 'Kanal bulunamadı',
    networkOffline: 'İnternetin kesik. Bağlantı gelir gelmez sohbet kendi kendine yeniden bağlanır.',
    retryIn: '{platform} sohbet bağlantısı koptu. {seconds} sn sonra tekrar denenecek.',
    retrying: '{platform} sohbet bağlantısı koptu. Şimdi tekrar deneniyor…',
    retryNow: 'Şimdi dene',
    fontSmaller: 'Yazıyı küçült',
    fontLarger: 'Yazıyı büyüt',
    timestamps: 'Mesaj saatlerini göster',
    clear: 'Geçmişi temizle',
    clearConfirm: 'Temizlemek için tekrar tıkla',
    deleted: '(silindi)',
    backToLive: 'Canlı sohbete dön',
    newMessage: '{count} yeni mesaj',
    newMessages: '{count} yeni mesaj',
    eventConnected: '{platform} sohbetine bağlanıldı: {channel}',
    eventDisconnected: '{platform} sohbet bağlantısı koptu',
    eventReconnected: '{duration} sonra {platform} sohbetine tekrar bağlanıldı',
    eventNetworkLost: 'İnternet bağlantısı koptu',
    eventNetworkBack: 'İnternet bağlantısı geri geldi',
    eventChatCleared: 'Bir moderatör {platform} sohbetini temizledi',
    eventResumed: 'Son ziyaretinden kalan mesajlar, son kayıt: {time}',
    durationSeconds: '{seconds} sn',
    durationMinutes: '{minutes} dk {seconds} sn',
    durationHours: '{hours} sa {minutes} dk',
  },
  obsBridge: {
    breadcrumb: 'OBS Bridge Kurulumu',
    title: 'OBS Bridge Kurulumu',
    intro:
      "Güvendiğin kişiler Twitch ya da Kick sohbetinden OBS sahneni değiştirsin, yayını ve kaydı başlatıp durdursun. Köprü bir tarayıcı sekmesinde ya da OBS dock'unda çalışır ve OBS'ye doğrudan bağlanır.",
    sectionChannels: 'Kanallar',
    sectionUsers: 'Yetkili Kullanıcılar',
    usersLabel: 'Sohbetteki Kullanıcı Adları',
    usersTip:
      "Komutları sadece bu listedekiler çalıştırabilir. Liste boşsa kimse çalıştıramaz, sen bile. Twitch'te kanal URL'sinde geçen kullanıcı adıyla eşleştirilir.",
    usersEmpty: 'Henüz kimse yok, yani şu an kimse komut çalıştıramaz.',
    userPlatform: 'Platform',
    addUser: 'Ekle',
    userPlaceholder: 'kullanıcı adı',
    removeUser: 'Çıkar: {name}',
    assignUser: '{name} için {platform} seç',
    pickPlatformWarning:
      'Twitch ve Kick ikisi de bağlı, sarı görünen her isim için bir platform seç. Seçene kadar komut çalıştıramazlar.',
    sectionCommands: 'Komutlar',
    commandsHint:
      'Mesajın tamamı komutla aynı olmalı, büyük küçük harf fark etmez. Boş bıraktığın alan varsayılanı kullanır.',
    label: {
      cmdScene: 'Sahne Değiştir',
      cmdBrb: 'BRB Sahnesi',
      cmdBack: 'Ana Sahneye Dön',
      cmdStartStream: 'Yayını Başlat',
      cmdStopStream: 'Yayını Durdur',
      cmdStartRecord: 'Kaydı Başlat',
      cmdStopRecord: 'Kaydı Durdur',
    },
    action: {
      cmdScene: 'Adını yazdığın sahneye geçer, örneğin {example}',
      cmdBrb: 'BRB sahnene geçer',
      cmdBack: 'Ana sahnene geri döner',
      cmdStartStream: 'Yayını başlatır',
      cmdStopStream: 'Yayını bitirir',
      cmdStartRecord: 'Kaydı başlatır',
      cmdStopRecord: 'Kaydı durdurur',
    },
    sceneArg: '<ad>',
    sceneTip:
      'Komutu, bir boşluk ve sahne adını yaz, örneğin !scene Gaming. Adı birebir tutan sahne önce gelir, yoksa adında bu yazı geçen ilk sahneye geçer.',
    brbTip:
      'Araç sayfasında seçtiğin BRB sahnesine geçer. Varsayılanında ! yok, yani listedeki biri sadece brb yazsa bile sahne değişir.',
    backTip: 'Araç sayfasında seçtiğin Ana sahneye döner. brb gibi bunda da varsayılan olarak ! yok.',
    sectionConnection: 'OBS Bağlantısı',
    wsUrl: 'WebSocket URL',
    wsUrlTip:
      'Sadece OBS başka bir bilgisayardaysa ya da portu değiştirdiysen gerekir. Boş bırakırsan ws://127.0.0.1:4455 kullanılır.',
    wsUrlPlaceholder: 'ws://127.0.0.1:4455 (varsayılan)',
    wsPassword: 'WebSocket Şifresi',
    wsPasswordTip:
      "OBS'de Araçlar → WebSocket Sunucu Ayarları → Bağlantı Bilgilerini Göster yolunda bulursun. Şifre araç URL'sine yazılır, o linki de şifre gibi sakla.",
    wsPasswordPlaceholder: 'Şifre yoksa boş bırak',
    previewTitle: 'Araç Önizleme',
    previewIframeTitle: 'OBS Bridge Önizleme',
    summaryNotListening: '{platform} kanalı girilmediği için {names} şimdilik komut çalıştıramaz.',
    summaryNoChannel: 'Henüz kanal yok. Önce bir Twitch ya da Kick kanalı gir.',
    openTool: 'Aracı Aç',
    openToolHint: "Canlı köprüyü yeni sekmede açar. Açılır açılmaz OBS'ye ve sohbetine bağlanır.",
    toolUrlTip: 'İçinde OBS şifren var, onu da şifre gibi sakla. Kimseyle paylaşma, yayında gösterme.',
    toolUrlHint:
      "Bir tarayıcı sekmesinde ya da OBS'nin Özel Tarayıcı Dock'unda aç, yayın boyunca açık kalsın.",
    nextOpen: "Bir tarayıcı sekmesinde aç ya da OBS'de bir Özel Tarayıcı Dock'una yapıştır.",
    nextKeepOpen: 'Orada Ana ve BRB sahneni seç, yayın boyunca sayfayı açık tut.',
    guideStep1:
      "OBS'de Araçlar → WebSocket Sunucu Ayarları'nı aç, WebSocket sunucusunu etkinleştir ve Bağlantı Bilgilerini Göster'den şifreyi kopyala.",
    guideStep2:
      "Kanalını, komut çalıştırabilecek kişileri ve şifreyi gir, sonra araç URL'sini kopyala.",
    guideStep3:
      "URL'yi bir tarayıcı sekmesinde ya da OBS'nin Özel Tarayıcı Dock'unda aç, Ana ve BRB sahneni seç.",
    guideStep4:
      "Dock kullanıyorsan sahneleri seçtikten sonra Güncel URL'yi Kopyala'ya bas ve dock'a yapıştır. Dock, ilk eklendiği URL'yi açmaya devam eder.",
    faq1Q: '!scene sohbet komutu nasıl çalışır?',
    faq1A:
      'Listendeki biri komutu, bir boşluk ve sahne adını yazar, örneğin !scene Gaming. OBS Bridge önce adı birebir tutan sahneyi arar, büyük küçük harfe bakmaz. Bulamazsa adında o yazı geçen ilk sahneye geçer.',
    faq2Q: 'OBS WebSocket şifrem güvende mi?',
    faq2A:
      "OBS bağlantısı doğrudan tarayıcından OBS'ye gider. Ama şifre araç URL'sinde kayıtlı, bu URL'yi açtığında sayfa extensions.senchabot.com'dan yüklenir ve şifre de adresle birlikte oraya gider. O yüzden linki şifre gibi sakla. Kimseyle paylaşma, yayında gösterme.",
    faq3Q: "Seçtiğim sahneler OBS dock'unda neden kayboldu?",
    faq3A:
      "Sahne seçimleri ve kullanıcı değişiklikleri araç sayfasının URL'sine kaydedilir. Tarayıcı sekmesinde sayfayı yer imlerine eklersen kalırlar, ama OBS dock'u her zaman ilk eklendiği URL'yi açar. Araç sayfasındaki Güncel URL'yi Kopyala'ya bas ve yeni URL'yi dock'a yapıştır.",
    tool: {
      title: 'OBS Bridge',
      connectionsTitle: 'Bağlantılar',
      status: {
        connecting: 'Bağlanıyor',
        connected: 'Bağlı',
        failed: 'Bağlanamadı',
        disconnected: 'Bağlantı koptu',
      },
      obsConnecting: '{url} adresine bağlanılıyor…',
      obsConnected: '{url} · {time} itibarıyla bağlı',
      obsUnreachable:
        "{url} adresinden cevap gelmedi. OBS açık mı, Araçlar → WebSocket Sunucu Ayarları'nda sunucu etkin mi?",
      obsWrongPassword:
        "OBS şifreyi kabul etmedi. URL'deki şifre, OBS'nin WebSocket şifresiyle aynı olmalı.",
      obsNeedsPassword:
        "OBS bir şifre istiyor ama bu URL'de şifre yok. Kurulum sayfasında WebSocket şifresini girip yeni URL'yi kullan.",
      obsRefused: 'OBS bağlantıyı kabul etmedi: {reason}',
      obsClosed: 'OBS ile bağlantı koptu. OBS kapanmış ya da WebSocket sunucusu durmuş olabilir.',
      retryIn: '{seconds} sn sonra {attempt}. kez denenecek',
      retrying: 'Tekrar deneniyor…',
      retryNow: 'Şimdi dene',
      chat: {
        connecting: 'Bağlanıyor',
        connected: 'Dinleniyor',
        reconnecting: 'Bağlantı koptu',
      },
      chatRetryIn: '{seconds} sn sonra tekrar bağlanacak',
      chatNotFound: 'Bulunamadı',
      kickNotFound: 'Kick\'te "{channel}" adında bir kanal bulunamadı. Kanal adını kontrol et.',
      activityTitle: 'Son Komutlar',
      activityEmpty: 'Henüz komut gelmedi. Yetkili biri sohbete bir komut yazınca burada görünür.',
      activityScene: '{scene} sahnesine geçildi',
      activityStartStream: 'Yayın başlatıldı',
      activityStopStream: 'Yayın durduruldu',
      activityStartRecord: 'Kayıt başlatıldı',
      activityStopRecord: 'Kayıt durduruldu',
      activityNoScene: '"{query}" ile eşleşen bir sahne yok',
      activityOffline: 'OBS bağlı olmadığı için çalışmadı',
      activityFailed: 'OBS hata verdi: {message}',
      scenesTitle: 'Sahneler',
      scenes: 'Sahneler ({count})',
      fetchingScenes: 'Sahne listesi alınıyor…',
      scenesOffline: 'Sahne listesi OBS bağlanınca görünür.',
      mainScene: 'Ana Sahne',
      brbScene: 'BRB Sahnesi',
      notSelected: 'Seçilmedi',
      main: 'Ana',
      brb: 'BRB',
      setMain: '{scene} Ana sahne olsun',
      setBrb: '{scene} BRB sahnesi olsun',
      assignMainBrbWarning:
        'Aşağıdan bir Ana ve bir BRB sahnesi seç, yoksa {brb} ve {back} nereye geçeceğini bilemez.',
      assignMainWarning: 'Aşağıdan bir Ana sahne seç, yoksa {back} nereye döneceğini bilemez.',
      assignBrbWarning: 'Aşağıdan bir BRB sahnesi seç, yoksa {brb} nereye geçeceğini bilemez.',
      sceneHint:
        'Atamak için sahnenin yanındaki Ana ya da BRB düğmesine bas. Diğer sahnelere {command} ile geçilir.',
      usersCount: 'Yetkili Kullanıcılar ({count})',
      copyUrl: "Güncel URL'yi Kopyala",
      copyUrlHint:
        "Sahne seçimleri ve kullanıcı değişiklikleri bu sayfanın URL'sine kaydedilir. OBS dock'u ilk eklendiği URL'yi açmaya devam eder, kopyaladığın yeni URL'yi dock ayarlarına yapıştır.",
      copyUrlManual: "Kopyalanamadı. Aşağıdaki URL'yi seçip kendin kopyala.",
      commands: 'Sohbet Komutları',
      footer: 'Yayın boyunca bu sayfayı açık tut. Kapanınca köprü de durur.',
    },
  },
  subSprout: {
    breadcrumb: 'Sub Sprout Kurulumu',
    title: 'Sub Sprout Kurulumu',
    intro:
      "Twitch veya Kick'te her yeni abonelikle seviye atlayan özelleştirilebilir abone hedefi bitkisi kaplaması.",
    sectionPlant: 'Bitki',
    plantVariety: 'Bitki Çeşidi',
    plantVarietyTip:
      'Her abonelik bitkiyi bir aşama büyütür. Aşama sayısı arttıkça bitkinin tamamen büyümesi için daha çok abone gerekir.',
    stagesSuffix: '{stages} aşama',
    selectionMode: 'Bitki Değişimi',
    selectionModeTip:
      "Son aşamadan sonra bitki baştan başlar: aynı bitki, listedeki sıradaki ya da rastgele başka bir bitki. Sırayla ve Rastgele, Sarmaşık'ı hiç seçmez.",
    fixed: 'Aynı Bitki',
    cycle: 'Sırayla',
    random: 'Rastgele',
    wateringEffect: 'Sulama Efekti',
    wateringEffectTip:
      "Bitki her büyüdüğünde kısa bir yağmur ya da parıltı animasyonu oynar. Sarmaşık'ta görünmez.",
    showSubCountEffect: 'Abone Sayısını Göster',
    subCountTip: "Aynı anda kaç abonelik geldiğini gösterir, örneğin 5'li hediye paketinde x5.",
    showPotLabel: 'Aşamayı Saksıda Göster',
    potLabelTip: "Saksının üstüne aşamayı yazar, örneğin 3/10. Sarmaşık'ta görünmez.",
    previewTitle: 'Abone Hedefi Bitkisi Önizleme',
    previewIframeTitle: 'Sub Sprout Önizleme',
    previewSpeed: 'Önizleme Büyüme Hızı',
    previewSpeedValue: '{rate}×',
    previewHint:
      'Önizleme sahte aboneliklerle büyür. Yayında ise bitkin kanalına gelen abonelik, yenileme ve hediye aboneliklerle büyür.',
    widgetUrlTip:
      "Daha önce bir widget oluşturduysan URL'sini buraya yapıştır. Ayarların geri yüklenir, istediğini değiştirebilirsin.",
    widgetUrlPlaceholder: "Düzenlemek için widget URL'sini yapıştır",
    widgetUrlInvalid: "Bu bir Sub Sprout widget URL'si değil.",
    browserSourceHintSize: ' (önerilen boyut: 800×600).',
    guideTitle: 'Yayın Yazılımı Kurulumu (OBS, Streamlabs, XSplit vb.)',
    guideStep1:
      'Yayın yazılımında (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio vb.) bir Tarayıcı Kaynağı ekle.',
    guideStep2: "Kopyaladığın abone hedefi bitkisi URL'sini yapıştır.",
    guideStep3: 'Genişliği 800 ve yüksekliği 600 olarak ayarla.',
    guideStep4: 'Yayıncılar ve moderatörler büyümeyi elle tetiklemek için sohbette !grow yazabilir.',
    faq1Q: 'Abone hedefi bitkisini kullanmak için giriş yapmam gerekiyor mu?',
    faq1A:
      'Kayıt veya OAuth girişi gerekmez. Sub Sprout, herkese açık sohbet olay dinleyicileri aracılığıyla anonim olarak bağlanır.',
    faq2Q: 'Abone hedefi bitkisi tam büyüklüğe ulaştığında ne olur?',
    faq2A:
      'Bitki tamamen büyüdükten sonra gelen ilk abonelik, Bitki Değişimi ayarına göre bitkiyi baştan başlatır: aynı bitki, sıradaki çeşit ya da rastgele biri.',
  },
  subathon: {
    breadcrumb: 'Subathon Timer Kurulumu',
    title: 'Subathon Timer Kurulumu',
    intro:
      "Twitch ve Kick için subathon sayacı. Geriye doğru sayar, gelen her abonelik, hediye abonelik, Bits cheer'ı ya da Kicks hediyesi süreyi uzatır. Sayacı sıfıra doğru eriyen oyun tarzı bir can barı, büyük bir saat ya da halka olarak göster, hangisinin ne kadar süre ekleyeceğine de sen karar ver.",
    style: 'Stil',
    styleTip:
      "Can Barı, oyundaki bir karakterin canı gibi %100'den sıfıra iner. Saat süreyi büyük rakamlarla gösterir. Halka ise giderek boşalan bir çemberdir.",
    styleBar: 'Can Barı',
    styleClock: 'Saat',
    styleRing: 'Halka',
    color: 'Renk',
    colorTip:
      'Can, süre azaldıkça yeşilden sarıya, sonra kırmızıya döner. Diğer renkler hep aynı kalır.',
    colors: {
      hp: 'Can (yeşilden kırmızıya)',
      green: 'Yeşil',
      purple: 'Mor',
      red: 'Kırmızı',
      gold: 'Altın',
      cyan: 'Turkuaz',
      pink: 'Pembe',
    },
    titleLabel: 'Başlık',
    titleTip: 'Sayacın yanında görünür. Başlık istemiyorsan boş bırak.',
    titlePlaceholder: 'Başlık yok',
    showPercent: 'Yüzdeyi Göster',
    showPercentTip:
      "Sayacın ne kadar dolu olduğunu gösterir. %100, sayacın şimdiye kadar ulaştığı en uzun süre demek, yani yüzde hiçbir zaman 100'ü geçmez.",
    showPops: 'Eklenen Süreyi Göster',
    showPopsTip:
      'Her süre eklendiğinde izleyicinin adıyla birlikte +1:00 gibi bir yazı yukarı süzülür.',
    sectionTimer: 'Sayaç',
    startTime: 'Başlangıç Süresi',
    startTimeTip:
      "Sayacın başladığı süre. Sadece yeni bir subathon'da geçerli olur: yeni değerle baştan başlamak için sohbete !subathon reset yaz.",
    maxTime: 'Süre Sınırı',
    maxTimeTip: 'Sayaç bundan fazla süre tutmaz. Sınırı aşacak kısım eklenmez.',
    maxTimeOff: 'Sınırsız',
    startMode: 'Başlatma',
    startModeTip:
      "Komutla başlatırsan sayaç, sen ya da bir mod sohbete komutu yazana kadar duraklatılmış bekler. Hemen seçeneği sayacı overlay OBS'te yüklenir yüklenmez başlatır.",
    startCommand: '{command} ile',
    startAuto: 'Hemen',
    sectionValues: 'Eklenen Süre',
    valuesHint: 'Birini kapatmak için 0 yap.',
    perSub: 'Abonelik Başına',
    perSubTip: "Her yeni abonelik ve yenileme. Twitch'te bu Tier 1 ya da Prime abonelik demek.",
    perSubKickTip: 'Her yeni abonelik ve yenileme.',
    perGift: 'Hediye Abonelik Başına',
    perGiftTip:
      "Hediyedeki her abonelik ayrı sayılır, yani 5'li bir hediye bu süreyi beş kez ekler.",
    perBits: '500 Bits Başına',
    perBitsTip:
      'Yaklaşık bir abonelik fiyatı. Diğer miktarlar oranına göre ekler, yani 100 Bits bu sürenin beşte birini ekler.',
    perKicks: '500 Kicks Başına',
    perKicksTip: 'Diğer miktarlar oranına göre ekler, yani 100 Kicks bu sürenin beşte birini ekler.',
    showRates: 'Sayaçta Göster',
    showRatesTip:
      "Bir aboneliğin, hediye aboneliğin ve 500 Bits ya da Kicks'in ne kadar süre eklediğini sayaçta listeler, böylece izleyiciler aboneliklerinin kaç dakika eklediğini bilir. 0 yaptıkların gösterilmez. Twitch ve Kick değerleri farklıysa sırayla gösterilir.",
    ratesLanguage: 'Sayaç Dili',
    ratesLanguageTip:
      "Listedeki kelimelerin dili, örneğin \"Hediye Sub\" ve \"dk\". Bu seçim URL'de saklanır, OBS hangi dilde açılırsa açılsın değişmez.",
    rateSub: 'Sub',
    rateGift: 'Hediye Sub',
    rateBits: '{amount} Bits',
    rateKicks: '{amount} Kicks',
    rateBitsKicks: '{amount} Bits/Kicks',
    tiers: 'Tier 2 ve 3 Daha Çok Sayılır',
    tiersTip:
      "Twitch'te Tier 2 abonelik 2, Tier 3 abonelik 5 abonelik kadar süre ekler, fiyatlarıyla orantılı.",
    unitHours: 'sa',
    unitMinutes: 'dk',
    sectionCommands: 'Sohbet Komutları',
    commandsIntro: 'Sayacı sen ve modların Twitch ya da Kick sohbetinden yönetirsiniz.',
    cmdStart: 'Sayacı başlatır ya da devam ettirir',
    cmdPause: 'Sayacı duraklatır',
    cmdAdd: 'Süre ekler',
    cmdRemove: 'Süreden düşer',
    cmdSet: 'Kalan süreyi ayarlar',
    cmdReset: 'Başlangıç süresiyle baştan başlatır',
    commandsDurations:
      'Süreleri 10m, 1h30m, 45s ya da 1:30:00 gibi yaz. Sadece sayı yazarsan dakika sayılır.',
    previewTitle: 'Subathon Timer Önizleme',
    previewIframeTitle: 'Subathon Timer Önizleme',
    previewHint:
      "Önizlemede sahte abonelikler, hediyeler ve cheer'lar gelir. Yayında sayaç gerçek zamanlı işler, süreyi sadece kendi sohbetin ekler.",
    previewSpeed: 'Önizleme Hızı',
    previewSpeedTip: "1× gerçek zaman. 60×'te bir saatlik sayaç yaklaşık bir dakikada biter.",
    previewSpeedValue: '{rate}×',
    testTitle: 'Dene:',
    testViewer: 'Sen',
    testSub: '+1 Abone',
    testGift: '+5 Hediye',
    testBits: '+500 Bits/Kicks',
    testRemove: '−10 dk',
    testPause: 'Duraklat / Devam',
    testReset: 'Sıfırla',
    widgetUrlTip:
      "Daha önce bir widget oluşturduysan URL'sini buraya yapıştır. Ayarların geri yüklenir, istediğini değiştirebilirsin.",
    widgetUrlPlaceholder: "Düzenlemek için widget URL'sini yapıştır",
    widgetUrlInvalid: "Bu bir Subathon Timer URL'si değil.",
    browserSourceHintSize: ' (önerilen boyut: 800×300).',
    guideTitle: 'Yayın Yazılımı Kurulumu (OBS, Streamlabs, XSplit vb.)',
    guideStep1:
      'Yayın yazılımında (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio vb.) bir Tarayıcı Kaynağı ekle.',
    guideStep2: "Kopyaladığın subathon sayacı URL'sini yapıştır.",
    guideStep3: 'Genişliği 800 ve yüksekliği 300 olarak ayarla.',
    guideStep4:
      'Yayına geçince sohbete !subathon start yaz. Modlar da süre ekleyip çıkarabilir ya da sayacı duraklatabilir.',
    faq1Q: 'OBS kapanırsa ya da Tarayıcı Kaynağı yenilenirse ne olur?',
    faq1A:
      "Sayaç OBS'in içinde kayıtlı, bu yüzden kaldığı yerden geri gelir. OBS kapalıyken de geri sayım durmaz, gerçek bir saat gibi işlemeye devam eder. Kapalıyken gelen abonelikleri göremez, onları bir mod !subathon add ile ekleyebilir.",
    faq2Q: 'Sayaç sıfıra ulaşınca ne olur?',
    faq2A:
      'Sayaç sıfırda durur, can barında K.O. yazar. Yeni abonelikler artık süre eklemez. Bir mod !subathon add ya da !subathon set ile sayacı geri getirebilir, !subathon reset ile de yenisini başlatabilir.',
    faq3Q: "Yeni subathon'u nasıl başlatırım, başlangıç süresini nasıl değiştiririm?",
    faq3A:
      "Sohbete !subathon reset yaz. Sayaç, URL'sindeki başlangıç süresine döner. Sayaç henüz hiç başlamadıysa URL'deki yeni başlangıç süresi kendiliğinden uygulanır.",
    faq4Q: 'Giriş yapmam ya da hesabımı bağlamam gerekiyor mu?',
    faq4A:
      'Hayır. Sayaç abonelik, hediye, Bits, Kicks ve mod komutlarını herkese açık Twitch ve Kick sohbetinden okur, tıpkı giriş yapmamış bir izleyicinin gördüğü gibi.',
  },
  goal: {
    breadcrumb: 'Abone Hedefi Kurulumu',
    title: 'Abone Hedefi Kurulumu',
    intro:
      'Twitch ve Kick için abone hedefi barı. İki sohbetten gelen her yeni abonelik, yenileme ve hediye abonelik bara 1 ekler, hedefe ulaşınca barın üstüne bir kupa iner. Sayının nereden başlayacağını ve hedefi sen belirle, modların da sayıyı sohbetten düzeltebilir.',
    sectionGoal: 'Hedef',
    start: 'Başlangıç Sayısı',
    startTip:
      'Sayının başlayacağı yer: yayıncı panelindeki abone sayın ya da sadece bu yayını saymak için 0. Sonradan değiştirirsen sayı yeni değerden baştan başlar.',
    target: 'Hedef',
    targetTip: 'Bar bu sayıda dolar. Sayı hedefi geçince de artmaya devam eder.',
    countsHint:
      'Prime ya da hangi tier olursa olsun, her abonelik ve yenileme 1 ekler. Hediyede içindeki her abonelik için 1 eklenir.',
    color: 'Renk',
    titleLabel: 'Başlık',
    titleTip: 'Barın üstünde görünür. Başlık istemiyorsan boş bırak.',
    titlePlaceholder: 'Başlık yok',
    showPops: 'Yeni Aboneleri Göster',
    showPopsTip:
      "Her abonelikte izleyicinin adıyla birlikte +1, 5'li bir hediyede +5 yazısı yukarı süzülür.",
    sectionCommands: 'Sohbet Komutları',
    commandsIntro:
      'Sayıyı sen ve modların Twitch ya da Kick sohbetinden düzeltebilirsiniz, örneğin OBS kapalıyken gelen abonelikleri eklemek için.',
    cmdAdd: 'Sayıya abone ekler, miktarı yazmazsan 1 ekler',
    cmdRemove: 'Sayıdan abone düşer, miktarı yazmazsan 1 düşer',
    cmdSet: 'Sayıyı ayarlar',
    cmdReset: 'Başlangıç sayısına geri döner',
    previewTitle: 'Abone Hedefi Önizleme',
    previewIframeTitle: 'Abone Hedefi Önizleme',
    previewHint:
      'Önizlemede hedefe ulaşana kadar sahte abonelikler ve hediyeler gelir, sonra baştan başlar. Yayında sayıyı sadece kendi sohbetin artırır.',
    testTitle: 'Dene:',
    testViewer: 'Sen',
    testSub: '+1 Abone',
    testGift: '+5 Hediye',
    testReach: 'Hedefi Tamamla',
    testReset: 'Sıfırla',
    widgetUrlTip:
      "Daha önce bir widget oluşturduysan URL'sini buraya yapıştır. Ayarların geri yüklenir, istediğini değiştirebilirsin.",
    widgetUrlPlaceholder: "Düzenlemek için widget URL'sini yapıştır",
    widgetUrlInvalid: "Bu bir Abone Hedefi URL'si değil.",
    browserSourceHintSize: ' (önerilen boyut: 800×260).',
    guideTitle: 'Yayın Yazılımı Kurulumu (OBS, Streamlabs, XSplit vb.)',
    guideStep1:
      'Yayın yazılımında (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio vb.) bir Tarayıcı Kaynağı ekle.',
    guideStep2: "Kopyaladığın abone hedefi URL'sini yapıştır.",
    guideStep3: 'Genişliği 800 ve yüksekliği 260 olarak ayarla.',
    guideStep4: 'Sayı tutmazsa sen ya da bir mod sohbete !goal set yazarak düzeltebilirsiniz.',
    faq1Q: "Neden abone sayımı Twitch'ten ya da Kick'ten okumuyor?",
    faq1A:
      'İki platform da giriş yapılmamış bir sayfaya kanalın abone sayısını göstermiyor, bu hedef de senden hiç giriş yapmanı istemiyor. Bu yüzden başlangıç sayını bir kere yazıyorsun, sonrasında gelen her abonelik ve hediye bunun üstüne ekleniyor.',
    faq2Q: 'OBS kapanırsa ya da Tarayıcı Kaynağı yenilenirse ne olur?',
    faq2A:
      "Sayı OBS'in içinde kayıtlı, bu yüzden bir sonraki yayında bile kaldığı yerden geri gelir. OBS kapalıyken gelen abonelikleri göremez, onları bir mod !goal add ile ekleyebilir.",
    faq3Q: 'Yenilemeler ve hediye abonelikler sayılıyor mu?',
    faq3A:
      "Evet. Her yeni abonelik ve yenileme 1 ekler, hediyede ise içindeki her abonelik için 1 eklenir, yani 5'li bir hediye 5 ekler. Twitch'te yenileme, izleyici bunu sohbette paylaştığında sayılır, Kick'te ise abonelik yenilendiğinde.",
    faq4Q: 'Takipçi hedefi yapabilir miyim?',
    faq4A:
      'Şimdilik hayır. Twitch ve Kick, giriş yapılmamış bir sayfaya yeni takipçileri göstermiyor, bu yüzden hedef iki platformda da aynı şekilde abonelikleri sayıyor.',
  },
  frames: {
    breadcrumb: 'Yayın Çerçeveleri Kurulumu',
    title: 'Yayın Çerçeveleri Kurulumu',
    intro:
      "Kameran, sohbetin ya da bütün yayın ekranın için hazır çerçeveler. Seçtiğin preset çerçeveyi o oyunun havasında çizer, şekliyle, süsleriyle ve hareketiyle: Dynasty'de pagoda çatısı, sallanan püsküller ve süzülen çiçek yaprakları, Blocks'ta çimen blokları ve titreyen meşaleler. Kanal bağlamana gerek yok, URL'yi OBS'e ekle, kameranı ya da sohbetini çerçevenin altına yerleştir.",
    sectionPiece: 'Çerçeve',
    piece: 'Neyin çerçevesi?',
    pieceTip:
      'Her parça ayrı bir tarayıcı kaynağı. Üçünü de aynı preset ile eklersen ekrandaki her şey birbirine uyar.',
    pieces: {
      camera: 'Kamera',
      chat: 'Sohbet',
      screen: 'Ekran',
    },
    pieceHints: {
      camera: 'Webcam için 16:9 çerçeve. Kameranı ortadaki boşluğa sığdır.',
      chat: "Sohbet Kutusu için başlıklı, uzun bir çerçeve. Sohbet Kutusu'nu başlığın altına yerleştir.",
      screen: "Bütün yayının kenarına oturan ince bir çerçeve. Oyunun üstünü kapatmasın diye köşelerde süslenir.",
    },
    labelLabel: 'Yazı',
    labelTips: {
      camera: 'Kameranın üstündeki sekmede görünür, örneğin kanal adın. Boş bırakırsan sekme süslemeyle kalır.',
      chat: 'Sohbet çerçevesinin üstündeki sekmede görünür. Boş bırakırsan sekme süslemeyle kalır.',
      screen: 'Ekranın alt ortasındaki plakada görünür. Boş bırakırsan plaka çıkmaz.',
    },
    labelPlaceholder: 'Yazı yok',
    color: 'Renk',
    motion: 'Animasyonlar',
    motionTip:
      "Parlayan çizgiler, ışık geçişleri ve preset'e göre fener, meşale ya da kıvılcım gibi küçük hareketler. Kapatırsan çerçeve sabit durur.",
    previewTitle: 'Yayın Çerçevesi Önizleme',
    previewIframeTitle: 'Yayın Çerçevesi Önizleme',
    previewHint:
      'Önizlemedeki silüet ve sohbet satırları sadece yer tutucu. Yayında çerçevenin ortası şeffaftır, altındaki kameran ya da sohbetin görünür.',
    widgetUrlTip:
      "Daha önce bir çerçeve oluşturduysan URL'sini buraya yapıştır. Ayarların geri yüklenir, istediğini değiştirebilirsin.",
    widgetUrlPlaceholder: "Düzenlemek için çerçeve URL'sini yapıştır",
    widgetUrlInvalid: "Bu bir Yayın Çerçevesi URL'si değil.",
    browserSourceHintSize: ' (önerilen boyut: {width}×{height}).',
    guideTitle: 'Yayın Yazılımı Kurulumu (OBS, Streamlabs, XSplit vb.)',
    guideStep1:
      "Yayın yazılımında (OBS Studio, Streamlabs Desktop, XSplit, vMix vb.) bir Tarayıcı Kaynağı ekle ve çerçeve URL'sini yapıştır.",
    guideStep2:
      'Genişlik ve yüksekliği önerilen boyuta ayarla. Kare ya da dikey bir kamera için kendi ölçülerini yazabilirsin, çerçeve her boyuta uyar.',
    guideStep3:
      "Kaynaklar listesinde çerçeveyi kameranın ya da Sohbet Kutusu'nun üstüne taşı, sonra sahnede onların üstüne yerleştir.",
    guideStep4:
      'Kamerayı ortadaki boşluğu dolduracak kadar büyüt ama çerçevenin dış kenarından taşırma. 640 × 360 çerçevede 590 × 296 tam oturur.',
    faq1Q: 'Çerçeve kameramı ya da sohbetimi kendisi mi gösteriyor?',
    faq1A:
      "Hayır. Çerçevenin ortası şeffaf, sadece süsleme. Kameranı ve Sohbet Kutusu'nu OBS'e ayrı kaynak olarak ekleyip çerçevenin altına koyuyorsun.",
    faq2Q: 'Twitch ve Kick hesabımı bağlamam gerekiyor mu?',
    faq2A:
      'Hayır. Çerçeve sohbet okumaz, kanal adı da istemez. Twitch, Kick ya da başka bir platformda yayın yapsan da aynı çalışır.',
    faq3Q: 'Kamera çerçevesini farklı bir boyutta kullanabilir miyim?',
    faq3A:
      'Evet. Çerçeve tarayıcı kaynağının boyutuna göre çizilir. Kare ya da dikey bir kamera için genişlik ve yüksekliği ona göre ayarla, süslemeler de o boyuta göre ölçeklenir.',
    faq4Q: 'Çerçevelerdeki çizimler oyunlardan mı alındı?',
    faq4A:
      "Hayır. Pagoda çatısı, fenerler ya da piksel bloklar gibi her çizim sıfırdan çizildi, oyun logosu ya da görseli içermez. Preset'ler o oyunların havasını yakalayan hayran yapımı stiller.",
  },
  poll: {
    breadcrumb: 'Sohbet Anketi Kurulumu',
    title: 'Sohbet Anketi Kurulumu',
    intro:
      'Twitch ve Kick için sohbet anketi. Sen ya da bir mod sohbetten anket başlatırsınız, izleyiciler numara yazarak oy verir, barlar da yayında canlı dolar. İki sohbetten gelen oylar tek ankette toplanır, her izleyici bir kez sayılır, süre bitince de kazanan ekrana gelir.',
    sectionPoll: 'Hazır Anket',
    question: 'Soru',
    questionTip: 'Seçeneklerin üstünde görünür. Soruyu yayında sesli soracaksan boş bırak.',
    questionPlaceholder: 'Sırada ne oynayalım?',
    options: 'Seçenekler',
    optionsTip:
      'İzleyiciler bir seçeneğin yanındaki numarayı ya da seçeneğin kendisini yazarak oy verir. En fazla 6 seçenek.',
    optionLabel: 'Seçenek {n}',
    optionPlaceholder: 'Seçenek {n}',
    removeOption: '{n}. seçeneği kaldır',
    addOption: '+ Seçenek Ekle',
    pollHint:
      "URL'de saklanır. Sohbete {command} yazınca ekrana gelir. Modlar da istedikleri an sohbetten yeni bir anket yazabilir.",
    sectionVoting: 'Oylama',
    duration: 'Anket Süresi',
    durationTip:
      'Bir anketin ne kadar süre oy toplayacağı. Bir mod sohbetten tek bir ankete farklı süre verebilir, erken bitirebilir ya da süre ekleyebilir.',
    durationOff: 'Süre yok: anket, bir mod !poll end yazana kadar açık kalır.',
    hold: 'Sonuç Gösterim Süresi',
    holdTip:
      'Oylama bittikten sonra sonuçların ekranda ne kadar kalacağı. Sonra anket ekrandan çıkar.',
    holdOff: 'Sonuçlar, bir sonraki ankete ya da !poll cancel yazılana kadar ekranda kalır.',
    delay: 'Yayın Gecikmesi',
    delayTip:
      'İzleyiciler yayınını sohbetten birkaç saniye geriden izler, bu yüzden "1 saniye kaldı" anında yazılan oy sohbete geç düşer. Süre bittikten sonra oylar bu kadar saniye daha sayılır. Twitch ve Kick genelde 2 ile 10 saniye geriden gelir.',
    voters: 'Kimler Oy Verebilir',
    votersTip: 'Aboneler seçeneği, abone ya da kurucu (founder) rozeti olanlar ve sen demek.',
    votersAll: 'Herkes',
    votersSubs: 'Aboneler',
    subWeight: 'Abone Oyunun Değeri',
    subWeightTip: 'Bir abonenin oyu bu kadar sayılır. Anket bunu ekranda da yazar.',
    subWeightValue: '{n}×',
    change: 'İzleyiciler Oyunu Değiştirebilir',
    changeTip:
      'Açıkken başka bir numara yazan izleyicinin oyu oraya geçer. Kapalıyken ilk oy geçerli kalır. İki durumda da her izleyici bir kez sayılır.',
    blind: 'Sonuçları Sona Kadar Gizle',
    blindTip:
      'Oylama açıkken barlar gizli kalır, böylece ilk oylar diğerlerini etkilemez. Sadece oy sayısı görünür.',
    color: 'Renk',
    position: 'Konum',
    positionTip: "Anketin Tarayıcı Kaynağı'nda duracağı yer. Seçenek sayısına göre oradan uzar.",
    positionTop: 'Üst',
    positionBottom: 'Alt',
    language: 'Anket Dili',
    languageTip:
      'Anketteki kelimelerin dili, örneğin "Sonuçlar" ya da hızlı anketteki Evet ve Hayır.',
    unitMinutes: 'dk',
    unitSeconds: 'sn',
    sectionCommands: 'Sohbet Komutları',
    commandsIntro:
      'Anketleri sen ve modların Twitch ya da Kick sohbetinden yönetirsiniz. Yeni bir anketin parçalarını | ile ayır.',
    exampleQuestion: 'Soru',
    cmdNew: '2 ile 6 arası seçenekli yeni bir anket başlatır',
    cmdNewTime: 'Aynısı, kendi süresiyle: 90s, 2m ya da 1:30 gibi',
    cmdYesNo: 'Hızlı bir Evet ya da Hayır anketi başlatır',
    cmdStart: 'Bu sayfadaki hazır anketi başlatır',
    cmdExtend: 'Ankete süre ekler',
    cmdEnd: 'Oylamayı hemen bitirir ve sonuçları gösterir',
    cmdCancel: 'Anketi ekrandan kaldırır',
    votingIntro:
      "İzleyiciler sadece numarayı (2), !vote 2 ya da seçeneğin kendisini yazarak oy verir. \"2 olsun\" gibi fazladan bir şey içeren mesaj sayılmaz. Twitch'in /vote komutu Twitch'in kendi anketleri için, o yüzden sohbete numarayı yazmalarını söyle.",
    previewTitle: 'Sohbet Anketi Önizleme',
    previewIframeTitle: 'Sohbet Anketi Önizleme',
    previewHint:
      'Önizlemede sahte izleyicilerin oy verdiği bir anket gerçek zamandan hızlı oynar, bitince sıradaki başlar. Yayında anket sadece sen ya da bir mod başlattığında ekrana gelir.',
    testTitle: 'Dene:',
    testVotes: '+{count} Oy',
    testExtend: '+30 sn',
    testEnd: 'Hemen Bitir',
    testNew: 'Yeni Anket',
    widgetUrlTip:
      "Daha önce bir widget oluşturduysan URL'sini buraya yapıştır. Ayarların geri yüklenir, istediğini değiştirebilirsin.",
    widgetUrlPlaceholder: "Düzenlemek için widget URL'sini yapıştır",
    widgetUrlInvalid: "Bu bir Sohbet Anketi URL'si değil.",
    browserSourceHintSize: ' (önerilen boyut: 640×560).',
    guideTitle: 'Yayın Yazılımı Kurulumu (OBS, Streamlabs, XSplit vb.)',
    guideStep1:
      'Yayın yazılımında (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio vb.) bir Tarayıcı Kaynağı ekle.',
    guideStep2: "Kopyaladığın sohbet anketi URL'sini yapıştır.",
    guideStep3: 'Genişliği 640 ve yüksekliği 560 olarak ayarla.',
    guideStep4:
      'Anket başlayana kadar kaynak boş kalır. Sohbete !poll start ya da !poll Soru | A | B yaz.',
    faq1Q: 'İzleyiciler nasıl oy veriyor?',
    faq1A:
      'Sohbete seçeneğin numarasını yazarak, örneğin 2. !vote 2 ya da seçeneğin kendisini yazmak da olur. Büyük küçük harf fark etmez, Türkçe karakterli de karaktersiz de yazılabilir. Mesajın tamamı oy olmalı, yani "2 olsun" ya da 4Head sayılmaz.',
    faq2Q: 'Bir izleyici birden fazla oy verebilir mi?',
    faq2A:
      'Hayır. Her Twitch ya da Kick hesabı bir kez sayılır. Oy değiştirme açıksa yeni yazılan numara oyu taşır, asla ikinci bir oy eklemez. Anket açıkken bir mod bir hesabı susturursa ya da banlarsa o hesabın oyu düşer, bu da spam botlarına karşı işe yarar.',
    faq3Q: "Twitch'in ya da Kick'in kendi anketi varken neden bunu kullanayım?",
    faq3A:
      "Bu anket Twitch ve Kick'ten gelen oyları tek bir sonuçta toplar ve iki platformda da aynı çalışır. Twitch'in kendi anketleri giriş yapmadan okunamıyor, bu overlay ise senden hiçbir zaman giriş yapmanı istemiyor. Affiliate ya da Partner olman da gerekmiyor.",
    faq4Q: 'OBS kapanırsa ya da Tarayıcı Kaynağı yenilenirse ne olur?',
    faq4A:
      "Anket ve oylar OBS'in içinde kayıtlı, bu yüzden kaldığı yerden geri gelir. OBS kapalıyken de süre işlemeye devam eder ama o arada yazılan oyları göremez.",
    faq5Q: 'Süre sıfıra indikten sonra oylar neden hâlâ sayılıyor?',
    faq5A:
      'İzleyiciler yayınını sohbetin birkaç saniye gerisinden izler, yani onların ekranında 1 saniye kaldığında süre sohbette çoktan bitmiştir. Yayın Gecikmesi oyları birkaç saniye daha sayar (varsayılan 5 saniye), kazanan da bundan sonra çıkar.',
    overlay: {
      label: 'Anket',
      closing: 'Son oylar',
      results: 'Sonuçlar',
      tie: 'Berabere',
      tieHint: 'Berabere kaldı!',
      winner: 'Kazanan: {option}',
      noVotes: 'Oy gelmedi',
      hidden: 'Sonuçlar oylama bitince görünür',
      howTo: 'Sohbete 1 ile {last} arası yaz',
      howToTwo: 'Sohbete 1 ya da 2 yaz',
      subsOnly: 'Sadece aboneler',
      subBonus: 'Abone oyu ×{n}',
      votes: '{count} oy',
      voteOne: '1 oy',
      yes: 'Evet',
      no: 'Hayır',
      sampleQuestion: 'Sırada ne oynayalım?',
      sampleOption1: 'Korku oyunu',
      sampleOption2: 'Speedrun',
      sampleOption3: 'İzleyicilerle oyun',
    },
  },
  streamAlerts: {
    breadcrumb: 'Yayın Uyarıları Kurulumu',
    title: 'Yayın Uyarıları Kurulumu',
    intro:
      "Twitch ve Kick için animasyonlu yayın uyarıları. Yeni abonelik, hediye abonelik, Bits, Kicks ve raid'lerin her birinin kendi ikonu ve sesi var, uyarılar sırayla ekrana gelir. Rengi seç, başlıkları kendine göre değiştir ve uyarı çıkaracak en küçük hediyeyi, cheer'ı ya da raid'i belirle.",
    color: 'Renk',
    theme: 'Tema',
    themeTip:
      'Neon, köşeli ve bilim kurgu tarzı bir şerit, synth sesleriyle. Göksel ise yıldızların altında altın çizgili bir kart, çan sesleriyle.',
    themes: {
      neon: 'Neon',
      celestial: 'Göksel',
    },
    colorTip: 'Platform seçeneğinde Twitch uyarıları mor, Kick uyarıları yeşil görünür.',
    colors: {
      blue: 'Mavi',
      purple: 'Mor',
      pink: 'Pembe',
      red: 'Kırmızı',
      gold: 'Altın',
      green: 'Yeşil',
      platform: 'Platform (Twitch mor, Kick yeşil)',
    },
    language: 'Uyarı Dili',
    languageTip:
      "Uyarıda yazan kelimelerin dili. Bu seçim URL'de saklanır, OBS hangi dilde açılırsa açılsın değişmez.",
    sectionAlerts: 'Uyarılar',
    heading: 'Başlık',
    kindSub: 'Abonelikler',
    kindSubTip:
      'Her yeni abonelik ve yenileme, izleyicinin sohbette mesajıyla paylaştığı yenilemeler de dahil.',
    kindGift: 'Hediye Abonelikler',
    kindGiftTip: 'İçinde kaç abonelik olursa olsun, her hediye için tek uyarı.',
    kindBits: 'Bits ve Kicks',
    kindBitsTip: "Twitch'teki Bits cheer'ları ve Kick'te gönderilen Kicks.",
    kindRaid: "Raid'ler",
    kindRaidTip:
      'Başka bir kanal sana raid attığında çıkar, kaç izleyiciyle geldiğini de gösterir.',
    minGift: 'En Az Abonelik',
    minBits: 'En Az Miktar',
    minRaid: 'En Az İzleyici',
    sectionTiming: 'Süre ve Ses',
    duration: 'Ekranda Kalma Süresi',
    durationTip:
      'Her uyarının ekranda ne kadar kalacağı. Birkaç uyarı üst üste gelirse sırayla çıkar.',
    seconds: '{value} sn',
    volume: 'Ses Seviyesi',
    volumeTip: 'Her uyarı kendine ait kısa bir ses çalar. Sesi kapatmak için 0 yap.',
    volumeOff: 'Kapalı',
    showMessage: 'İzleyici Mesajını Göster',
    showMessageTip:
      'İzleyicinin aboneliğini yenilerken ya da Bits veya Kicks gönderirken yazdığı mesajı gösterir. Linkler gösterilmez, uzun mesajlar kısaltılır.',
    previewTitle: 'Yayın Uyarıları Önizleme',
    previewIframeTitle: 'Yayın Uyarıları Önizleme',
    previewHint:
      "Önizlemede sessiz örnek uyarılar gelir. Aşağıdaki düğmelerle bir uyarıyı sesiyle birlikte deneyebilirsin. Yayında sadece kendi kanalına gelen abonelik, hediye, cheer ve raid'ler görünür.",
    testTitle: 'Dene:',
    testSub: 'Abone',
    testGift: '{count} Hediye',
    testBits: '{amount} Bits/Kicks',
    testRaid: 'Raid',
    testViewer: 'TestIzleyici',
    testMessage: 'Efsane yayın!',
    widgetUrlTip:
      "Daha önce bir widget oluşturduysan URL'sini buraya yapıştır. Ayarların geri yüklenir, istediğini değiştirebilirsin.",
    widgetUrlPlaceholder: "Düzenlemek için widget URL'sini yapıştır",
    widgetUrlInvalid: "Bu bir Yayın Uyarıları URL'si değil.",
    browserSourceHintSize: ' (önerilen boyut: 800×450).',
    guideTitle: 'Yayın Yazılımı Kurulumu (OBS, Streamlabs, XSplit vb.)',
    guideStep1:
      'Yayın yazılımında (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio vb.) bir Tarayıcı Kaynağı ekle.',
    guideStep2: "Kopyaladığın yayın uyarıları URL'sini yapıştır.",
    guideStep3:
      'Genişliği 800 ve yüksekliği 450 olarak ayarla, sonra kaynağı uyarıların çıkacağı yere taşı.',
    guideStep4:
      'OBS\'te sesi duymak için kaynak ayarlarında "OBS ile sesi kontrol etme" (Control audio via OBS) seçeneğini aç. Sonra Gelişmiş Ses Özellikleri (Advanced Audio Properties) penceresinde kaynağın Ses İzleme ayarını "İzleme Aktif Edildi" (Monitor and Output) yap.',
    faq1Q: 'Neden takip ya da bağış uyarısı yok?',
    faq1A:
      'Twitch ve Kick, giriş yapılmamış bir sayfaya yeni takipçileri göstermiyor, iki platformun da kendine ait bir bağış sistemi yok. Uyarılar sadece iki platformun her izleyiciye gönderdiği bilgileri kullanır, bu yüzden ikisinde de aynı çalışır.',
    faq2Q: 'Abonelik uyarısında ay sayısı ve izleyicinin mesajı görünüyor mu?',
    faq2A:
      "Evet. İzleyici abonelik yenilemesini sohbette paylaşırsa, Twitch'te de Kick'te de ay sayısı ve yazdığı mesajla bir uyarı çıkar. Twitch'te her abonelik uyarısında ay sayısı görünür. Kick çoğu abonelikte ay sayısını gönderiyor ama bazı kanallarda hiç göndermiyor, o zaman uyarıda sadece abone olduğu yazar.",
    faq3Q: 'Aynı anda çok sayıda uyarı gelirse ne olur?',
    faq3A:
      "Geldikleri sırayla tek tek gösterilir. 50'li bir hediye abonelik 50 değil, tek bir uyarı olarak çıkar.",
    faq4Q: 'Giriş yapmam ya da hesabımı bağlamam gerekiyor mu?',
    faq4A:
      "Hayır. Uyarılar abonelik, hediye, Bits, Kicks ve raid'leri herkese açık Twitch ve Kick sohbetinden okur, tıpkı giriş yapmamış bir izleyicinin gördüğü gibi.",
    alert: {
      subHeading: 'Yeni Abone',
      subDetail: 'abone oldu',
      resubDetail: '{months} aydır abone',
      giftHeading: 'Hediye Abonelik',
      giftDetail: '{count} abonelik hediye etti',
      giftDetailOne: 'bir abonelik hediye etti',
      bitsHeading: 'Yeni Cheer',
      bitsDetail: '{amount} Bits gönderdi',
      kicksHeading: 'Kicks',
      kicksDetail: '{amount} Kicks gönderdi',
      raidHeading: 'Raid Geldi',
      raidDetail: '{viewers} izleyiciyle raid attı',
      raidDetailOne: '1 izleyiciyle raid attı',
      raidDetailNoCount: 'raid attı',
      anonymous: 'Anonim',
    },
  },
  raffle: {
    breadcrumb: 'Çekiliş Kurulumu',
    title: 'Çekiliş Kurulumu',
    intro:
      "Çekilişi sohbetten yap: izleyiciler !join gibi bir kelime yazarak katılır, kazananı tek tıkla çekersin. Twitch ve Kick'te çalışır. İstersen sadece abonelere açabilir, kazananı konfetiyle yayına taşıyabilirsin.",
    lockedTitle: 'Ayarlar kilitli',
    lockedDesc:
      "Çekiliş sürerken ya da çekim beklerken kurallar değişmez. Düzenlemek için Tümünü Sıfırla'ya bas.",
    platform: 'Platform',
    channelName: 'Kanal',
    sectionRules: 'Katılım Kuralları',
    entryKeyword: 'Katılım Kelimesi',
    keywordTip:
      'Mesaj tam olarak bu kelime olmalı ya da bu kelime ve bir boşlukla başlamalı. Büyük küçük harf fark etmez, bilinen botlar sayılmaz.',
    minDuration: 'En Kısa Süre (sn)',
    minDurationTip:
      "Başlat'a bastıktan sonra Kazanan Çek bu kadar saniye kilitli kalır, herkes yazmaya yetişsin.",
    subscribersOnly: 'Sadece Aboneler',
    subscribersOnlyTip:
      'Sadece abone ya da kurucu (founder) rozeti olanlar katılabilir. En az abonelik 1 ay olduğu sürece yayıncı olarak sen de katılabilirsin.',
    minSubMonths: 'En Az Abonelik (ay)',
    maxWinsPerUser: 'Kişi Başı Kazanma Sınırı',
    maxWinsTip:
      'Kazanan, katılımcı listesinden çıkar. Bu sınıra ulaşana kadar kelimeyi tekrar yazıp yeniden katılabilir.',
    maxWinsUnlimited: 'Sınırsız',
    resetConfig: 'Ayarları Sıfırla',
    controlTitle: 'Çekiliş Kontrolü',
    controlTip:
      "Çekiliş boyunca bu sayfa açık kalmalı. Sohbeti bu sayfa okur, kazananı overlay'e de bu sayfa gönderir.",
    statusIdle: 'Başlamadı',
    statusNeedsSetup: 'Başlatmak için kanal ve kelime gir.',
    statusRunning: 'Açık, {keyword} bekleniyor',
    statusStopped: 'Katılım kapandı',
    startRaffle: 'Çekilişi Başlat',
    stopRaffle: 'Katılımı Kapat',
    drawWinner: 'Kazanan Çek ({count} kişi)',
    drawLocked: 'Çekim {seconds} sn sonra açılır',
    lastWinner: 'Son kazanan',
    clear: 'Temizle',
    resetEntries: 'Katılımcıları temizle',
    resetWinners: 'Kazananları temizle',
    resetAll: 'Tümünü Sıfırla',
    winners: 'Kazananlar ({count})',
    participants: 'Katılımcılar ({count})',
    noWinners: 'Henüz kazanan yok.',
    noParticipants: 'Henüz katılan yok. İzleyiciler sohbete {keyword} yazarak katılır.',
    disqualify: 'Çıkar: {name}',
    confirmStart: 'Yeni çekiliş başlasın mı? Mevcut katılımcılar ve kazananlar silinecek.',
    confirmResetEntries: 'Katılımcı listesi temizlensin mi?',
    confirmResetWinners: 'Kazanan listesi temizlensin mi?',
    confirmResetAll:
      'Her şey sıfırlansın mı? Katılımcılar ve kazananlar silinir, kilit açılır. Ayarların olduğu gibi kalır.',
    overlayUrl: "Kazanan Overlay URL'si",
    overlayUrlTip:
      "Kazanan, tarayıcının BroadcastChannel özelliğiyle gönderilir ve çalıştığı tarayıcının dışına çıkamaz. Chrome'da açık bir çekiliş sayfası, OBS içindeki overlay'e ulaşamaz.",
    overlayUrlHint:
      "Kazanan, overlay'e sadece bu sayfa overlay ile aynı tarayıcıda ya da uygulamada açıksa ulaşır. Yayından önce bir deneme çekilişi yap.",
    overlayNextStep: 'Bu çekiliş sayfasını overlay ile aynı uygulamada çalıştır ve bir deneme çekilişi yap.',
    guideStep1: 'Platformu seç, kanal adını yaz, katılım kelimesini ve kuralları belirle.',
    guideStep2:
      "Kazananı yayında göstermek istiyorsan overlay URL'sini 1920×1080 tarayıcı kaynağı olarak ekle.",
    guideStep3:
      "Çekilişi Başlat'a bas. İzleyiciler sohbete kelimeyi yazarak katılır, istemediğin birini adının yanındaki ✕ ile çıkarırsın.",
    guideStep4:
      "Hazır olunca Kazanan Çek'e bas. Kazanan overlay'de sadece bu sayfa aynı tarayıcıda ya da uygulamada açıksa görünür, o yüzden yayından önce mutlaka dene.",
    faq1Q: 'Aynı kişinin iki kez kazanması nasıl engelleniyor?',
    faq1A:
      'Çekilen kazanan katılımcı listesinden çıkıp kazananlar listesine geçer. Kişi Başı Kazanma Sınırı 1 ise aynı çekilişte ne tekrar katılabilir ne de tekrar kazanabilir.',
    faq2Q: 'Şüpheli katılımcıları ya da botları çıkarabilir miyim?',
    faq2A:
      'Nightbot ve StreamElements gibi bilinen botlar zaten sayılmaz. Bunun dışında herhangi bir katılımcıyı adının yanındaki ✕ ile listeden çıkarabilirsin.',
    faq3Q: "Kazanan neden overlay'de görünmüyor?",
    faq3A:
      "Çekiliş sayfası kazananı BroadcastChannel ile gönderir, bu da sadece aynı tarayıcının içinde çalışır. Sayfa Chrome'da, overlay OBS'de açıksa mesaj hiç ulaşmaz. Çekiliş sayfasını overlay ile aynı uygulamada çalıştır ve yayından önce bir deneme çekilişi yap.",
    winner: 'Kazanan!',
    subMonthsShort: '{months} ay',
  },
  alerts: {
    follow: 'Yeni Takipçi Geldi!',
    sub: 'Yeni Abone Geldi!',
    donate: 'Bağış Yaptı!',
    raid: 'Baskın Vaar!',
  },
  emoteWallSetup: {
    breadcrumb: 'Emote Duvarı Kurulumu',
    title: 'Emote Duvarı Kurulumu',
    intro:
      "Sadece emote'tan oluşan mesajlar (Twitch, Kick ve Twitch kanalının 7TV emote'ları) ekranda emote olarak belirir. Normal yazılı mesajlar varsayılan olarak atlanır, Tüm Emote'ları Göster açıksa onların içindeki emote'lar da çıkar. Sakin modda emote'lar rastgele bir noktada belirip süzülür ve kaybolur, Kaos modunda ekranın kenarından girip karşıya fırlar, Sekme modunda ekranın kenarlarından seker.",
    sectionAnimation: 'Animasyon',
    sectionFilters: 'Filtreler',
    sevenTvEmotes: "7TV Emote'ları",
    sevenTvTip:
      "Twitch kanalındaki 7TV emote'larını gösterir, Kick sohbetinde de. Bunun için Twitch kanalını girmen gerekir.",
    mode: 'Animasyon Modu',
    modeCalm: 'Sakin',
    modeChaos: 'Kaos',
    modeBounce: 'Sekme',
    modeTip:
      'Sakin: emote rastgele bir yerde belirir, süzülür ve solar. Kaos: rastgele bir kenardan fırlar, ekranın ortasıyla karşı kenar arasında bir yerde kaybolur. Sekme: kenarlardan seker, her çarpışta biraz daha hızlanır.',
    emoteSize: 'Emote Boyutu',
    duration: 'Görünür Süre (sn)',
    durationTip:
      "Her emote'un ekranda kalma süresi. Kaos modunda emote'lar ekranı bu sürenin bir kısmında geçer, yani daha erken kaybolur.",
    maxEmotes: 'Aynı Anda Maks. Emote',
    maxEmotesTip: 'Ekrandaki emote sayısı bunu geçerse en eskiler silinir.',
    subsOnly: 'Sadece Aboneler',
    subsOnlyTip:
      "Sadece abone ya da kurucu rozeti olanların ve senin emote'ların çıkar. Önizlemeye yansımaz.",
    subDurationX2: "Abone Emote'ları 2× Uzun",
    subDurationX2Tip:
      "Abone ya da kurucu rozeti olanların ve senin emote'ların ekranda iki kat uzun kalır.",
    showAllEmotes: "Tüm Emote'ları Göster",
    showAllEmotesTip:
      "Sadece emote'tan oluşan mesajlar değil, yazının arasındaki emote'lar da çıkar. Mesaj başına en fazla 5 tane. Önizlemeye yansımaz.",
    hypeMode: 'Hype Modu',
    hypeModeTip:
      'Bir emote ancak 15 saniye içinde en az 2 farklı kişi gönderince çıkar, sonra da en fazla 15 saniyede bir. Önizlemeye yansımaz.',
    spamBlock: 'Emote Spamını Engelle',
    spamBlockTip:
      "Biri 10 saniyede 3'ten fazla emote mesajı atarsa fazlası atlanır. Aynı emote'u 10 saniyede 2'den fazla atarsa sadece o emote atlanır. Önizlemeye yansımaz.",
    previewTitle: 'Emote Duvarı Önizleme',
    previewIframeTitle: 'Emote Duvarı Önizleme',
    previewHint: "Önizlemede örnek emote'lar uçuşur. Yayında emote'lar kendi sohbetinden gelir.",
    widgetUrlTip:
      "Daha önce bir widget oluşturduysan URL'sini buraya yapıştır. Ayarların geri yüklenir, istediğini değiştirebilirsin.",
    widgetUrlPlaceholder: "Düzenlemek için widget URL'sini yapıştır",
    widgetUrlInvalid: "Bu bir Emote Duvarı widget URL'si değil.",
    guideTitle: 'Yayın Yazılımı Kurulumu (OBS, Streamlabs, XSplit vb.)',
    guideStep1:
      'Yayın yazılımında (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio vb.) bir Tarayıcı Kaynağı ekle.',
    guideStep2: "Kopyaladığın emote duvarı URL'sini yapıştır.",
    guideStep3:
      'Genişlik ve yüksekliği tam tuval boyutuna ayarla (örn. 1920×1080) ve oyun görüntünün üstüne yerleştir.',
    browserSourceHintSize: ' (önerilen boyut: 1920×1080 tam tuval).',
    faq1Q: 'Hangi mesajlar yüzen emote tetikler?',
    faq1A:
      "Sadece emote'tan oluşan mesajlar: tek bir Kappa, arka arkaya emote'lar ya da Twitch, Kick ve 7TV emote'larının karışımı. Normal yazı mesajları, Tüm Emote'ları Göster açık değilse yok sayılır.",
    faq2Q: 'Emote duvarını kullanmak için giriş yapmam gerekiyor mu?',
    faq2A:
      'Giriş gerekmez. Emote Duvarı, her iki platformun herkese açık sohbet akışlarını anonim olarak dinler.',
  },
  plants: {
    classic: 'Klasik Filiz',
    rose: 'Gül',
    sunflower: 'Ayçiçeği',
    cactus: 'Kaktüs',
    tulip: 'Lale',
    pine: 'Çam Ağacı',
    lotus: 'Lotus',
    lily: 'Zambak',
    palm: 'Palmiye Ağacı',
    vine: 'Sarmaşık',
    waterOff: 'Kapalı',
    waterRain: 'Yağmur',
    waterSparkle: 'Parıltı',
  },
  guides: {
    breadcrumb: 'Rehberler',
    eyebrow: 'Rehber',
    published: '{date} tarihinde yayınlandı',
    onThisPage: 'Bu sayfada',
    covers: 'Kapsadığı araçlar',
    relatedTitle: 'İlgili rehberler',
    readGuide: 'Rehberi oku',
    allGuides: 'Tüm rehberler',
    openSetup: 'Kurulum sayfasını aç',
    index: {
      title: 'Rehberler',
      lead: "Her rehber tek bir soruyu adım adım cevaplıyor: OBS'e widget eklemek, Twitch ve Kick sohbetini birleştirmek, sohbeti OBS dock'unda okumak, yayın uyarıları eklemek, subathon sayacı kurmak, sohbet anketi yapmak, kameraya ve sohbete çerçeve eklemek, sohbet çekilişi yapmak ve sohbetten sahne değiştirmek. Hepsi ücretsiz ve giriş istemeyen araçlar için.",
      listLabel: 'Tüm rehberler',
      moreText:
        'Genel sorular için [sık sorulan sorulara](/faq) bak. Nelerin değiştiğini [yenilikler](/changelog) sayfasında bulabilirsin.',
    },
    obs: {
      title: "Senchabot widget'ı OBS'e Tarayıcı Kaynağı olarak nasıl eklenir?",
      short: "OBS'e widget ekleme",
      summary:
        'Tarayıcı Kaynağı ekleme adımları, her widget için doğru boyut, kapalı kalması gereken iki ayar ve widget boş görünürse yapılacak kontroller.',
      lead: "Senchabot widget'ları OBS'e Tarayıcı Kaynağı olarak eklenir: Kaynaklar panelinde + düğmesine bas, Tarayıcı'yı seç, kurulum sayfasından kopyaladığın adresi URL alanına yapıştır ve genişlikle yüksekliği widget'ın önerilen boyutuna ayarla. Giriş yapman ya da bir şey indirmen gerekmez, arka plan zaten şeffaf.",
      add: {
        title: "OBS'e Tarayıcı Kaynağı nasıl eklenir?",
        intro:
          "Kurulum sayfasında kanal adını yazıp Kopyala düğmesine bastıktan sonra OBS Studio'da şu adımları izle:",
        step1: "Widget'ın görüneceği sahneyi seç.",
        step2: "Kaynaklar panelinde + düğmesine tıkla ve listeden Tarayıcı'yı (Browser) seç.",
        step3: 'Kaynağa bir ad ver, örneğin "Sohbet Kutusu", ve Tamam\'a bas.',
        step4:
          'Açılan özellikler penceresinde URL alanını temizle ve kopyaladığın widget adresini yapıştır.',
        step5: 'Genişlik ve Yükseklik alanlarına aşağıdaki tablodaki değerleri yaz.',
        step6: "Tamam'a bas ve kaynağı sahnede istediğin yere sürükle.",
        note: '[Sohbet Kutusu kurulum sayfası](/setup/chat-widget) adresi kopyaladığında bu adımları önerilen boyutla birlikte gösterir. Emin olmak istersen adresi önce normal bir tarayıcı sekmesinde açıp çalıştığını gör.',
      },
      size: {
        title: 'Hangi widget için hangi boyut kullanılmalı?',
        intro:
          "Her widget'ın önerilen bir kaynak boyutu var. Bu değerleri OBS'teki Genişlik ve Yükseklik alanlarına yaz.",
        caption: "Senchabot widget'ları için önerilen Tarayıcı Kaynağı boyutları",
        colWidget: 'Widget',
        colSize: 'Genişlik × Yükseklik',
        colNote: 'Not',
        notSource: 'Kaynak değil',
        notes: {
          chatBox: 'Dikey sohbet sütunu. Kaynak büyüdükçe yazı büyümez, daha çok mesaj sığar.',
          emoteWall: "Tam 1080p tuval. Emote'lar ekranın her yerinde belirir.",
          subSprout: 'Bitki ve saksı bu alanın içinde büyür.',
          frames:
            "Kamera için 640x360, sohbet için 420x720, ekran için 1920x1080. Çerçeve verdiğin her boyuta uyar.",
          goal: "Hedef barı için geniş bir şerit, üstünde +1'lerin süzüleceği boşluk da var.",
          subathon:
            'Can barı, saat ya da halka için geniş bir şerit. Kaynağı büyütürsen sayaç da büyür.',
          poll: 'En fazla 6 seçenekli bir anket için alan. Üstte ya da altta durur, seçenek arttıkça uzar.',
          streamAlerts:
            'Uyarılar bu alanın ortasında tek tek çıkar. Kaynağı büyütürsen uyarı da büyür.',
          raffle:
            "Kazanan overlay'i. Konfeti ekranın iki kenarından patlar, kazananın adı ortada çıkar.",
          obsBridge:
            "Görünür bir overlay değil. Aracı bir tarayıcı sekmesinde ya da OBS dock'unda açık tut.",
        },
        fontNote:
          "Sohbet Kutusu'nda yazıyı büyütmek için kaynağı germe, kurulum sayfasındaki Yazı Boyutu ayarını kullan: 8 ile 72 piksel arası, varsayılan 18.",
      },
      transparent: {
        title: 'Arka planı şeffaf yapmak için bir şey gerekiyor mu?',
        p1: "Hayır. Sohbet Kutusu, Emote Duvarı, Sub Sprout, Subathon Timer, Yayın Uyarıları, Abone Hedefi, Sohbet Anketi ve çekiliş overlay'i şeffaf bir arka planla çizilir. Renk anahtarı (chroma key) ya da filtre eklemen gerekmez, OBS'in Özel CSS alanını da olduğu gibi bırakabilirsin.",
        p2: "Sohbet Kutusu açık renkli bir sahnede zor okunuyorsa Koyu Arka Plan ayarını aç. Widget'ın arkasına yarı saydam siyah bir zemin gelir, saydamlığını %0 ile %100 arasında seçersin (varsayılan %50). Her mesajın ayrı bir kutuda durmasını istersen Mesaj Arka Plan Kutusu'nu aç.",
      },
      settings: {
        title:
          '"Görünür olmadığında kaynağı kapat" ve "Sahne etkinleştiğinde tarayıcıyı yenile" açık mı olmalı?',
        intro:
          'Senchabot widget\'larında ikisini de kapalı bırak. OBS\'te İngilizce adları "Shutdown source when not visible" ve "Refresh browser when scene becomes active". İkisi de sayfayı baştan yükler ve widget o ana kadar tuttuğu her şeyi unutur:',
        chatBox:
          'Sohbet Kutusu: mesajlar sadece kaynak açıkken gelir. Kaynak kapanıp açılırsa ekran boş başlar ve yalnızca yeni mesajları gösterir.',
        subSprout:
          'Sub Sprout: bitkinin büyümesi hiçbir yere kaydedilmez. Sayfa yeniden yüklenirse bitki ilk aşamaya döner.',
        goal: "Abone Hedefi: sayı OBS'in içinde kaydedilir, sayfa yeniden yüklenince kaybolmaz, ama kaynak kapalıyken gelen abonelikler sayılmaz.",
        poll: "Sohbet Anketi: anket ve oylar OBS'in içinde kaydedilir, sayfa yeniden yüklenince kaybolmaz, ama kaynak kapalıyken yazılan oylar sayılmaz.",
        subathon:
          "Subathon Timer: kalan süre OBS'in içinde kaydedilir, sayfa yeniden yüklenince kaybolmaz. Kaynak kapalıyken sayaç geri saymaya devam eder ama o arada gelen abonelikleri göremez.",
        streamAlerts:
          "Yayın Uyarıları: sadece kaynak açıkken gelen abonelik, hediye, cheer ve raid'ler için uyarı çıkar. Kaynak kapalıyken gelenler için uyarı çıkmaz, sonradan da gösterilmez.",
        raffle:
          "Çekiliş overlay'i: kazananı sadece o an açık olan overlay alır. Kaynak kapalıyken çekilen kazanan ekrana gelmez.",
        emoteWall:
          "Emote Duvarı: emote'lar varsayılan olarak 5 saniye kaldığı için yenilemek bir şey kaybettirmez ama bir faydası da yok.",
        refresh:
          'Bir widget takılırsa kaynağa çift tıkla ve özellikler penceresindeki "Refresh cache of current page" (geçerli sayfanın önbelleğini yenile) düğmesine bas. Bu, sayfayı bir kez yeniler.',
      },
      update: {
        title: "Widget'ı sonradan nasıl değiştiririm?",
        p1: "Ayarlar widget adresinin içinde durur, yani bir ayarı değiştirmek yeni bir adres demek. Kurulum sayfasında ayarı değiştir, yeni adresi kopyala, sonra OBS'te kaynağa çift tıklayıp URL alanındaki eski adresin yerine yapıştır.",
        p2: '[Sohbet Kutusu](/setup/chat-widget), [Emote Duvarı](/setup/emote-wall), [Sub Sprout](/setup/sub-growing-plant), [Subathon Timer](/setup/subathon-timer), [Yayın Uyarıları](/setup/stream-alerts), [Abone Hedefi](/setup/sub-goal), [Sohbet Anketi](/setup/chat-poll) ve [Yayın Çerçeveleri](/setup/stream-frames) için baştan başlaman gerekmez. Mevcut adresini kurulum sayfasındaki Widget URL alanına yapıştır, kanalların ve bütün ayarların geri yüklenir. Değiştirmek istediğini değiştir ve yeni adresi kopyala.',
        p3: "OBS Bridge'de yapıştırma alanı yok, ayarları kurulum sayfasında yeniden girip yeni araç adresini kopyalarsın. Sahne seçimlerini ve yetkili kullanıcıları araç sayfasında da değiştirebilir, yeni adresi oradaki Copy Updated URL düğmesiyle alabilirsin. Eski adresler çalışmaya devam eder, güncellemek zorunda değilsin.",
      },
      troubleshoot: {
        title: "Widget OBS'te görünmüyorsa ne yapmalıyım?",
        intro: 'Çoğu zaman sebep kanal adıdır. Şu kontrolleri sırayla yap.',
        linkTitle: 'Kanal adı yerine link mi yazdın?',
        linkBody:
          'Kanal alanına sadece adı yaz: twitch.tv/senchabot için `senchabot`. Linkin tamamını yapıştırırsan widget linki kanal adı sanar ve hiçbir sohbete bağlanamaz.',
        channelTitle: 'Kanal gerçekten var mı?',
        channelBody:
          "Adı yazım hatasına karşı kontrol et. Twitch'te olmayan bir kanal hata vermez, widget sadece boş kalır.",
        quietTitle: 'Sohbette henüz bir şey oldu mu?',
        quietBody:
          "Sohbet Kutusu ve Emote Duvarı sohbette bir şey olana kadar tamamen boş ve şeffaftır. Sohbete bir mesaj yaz; Emote Duvarı için varsayılan olarak sadece emote'tan oluşan bir mesaj gerekir, Tüm Emote'ları Göster açıksa normal mesajlardaki emote'lar da sayılır. Çekiliş overlay'i de sadece kazanan çekildiğinde görünür ve 10 saniye sonra kaybolur. Sub Sprout ise bitkiyi, Subathon Timer da sayacı hemen gösterir.",
        kickTitle: 'Kick kanalı bulunamadı mı?',
        kickBody:
          "Widget açılırken Kick kanalını kick.com üzerinden arar. Bu arama başarısız olursa, yani ad yanlışsa, kanal yoksa ya da Kick cevap vermezse, Kick mesajları gelmez. Kick adını kick.com adresinde göründüğü gibi yaz.",
        tabTitle: 'Adres tarayıcıda çalışıyor mu?',
        tabBody:
          "Adresi normal bir tarayıcı sekmesinde aç. Orada çalışıp OBS'te çalışmıyorsa kaynağın URL alanını ve boyutunu kontrol et.",
      },
      ctaTitle: "Widget'ını seç ve adresini al",
      ctaText: "Her kurulum sayfası sana OBS'e yapıştıracağın hazır bir adres verir.",
    },
    chat: {
      title: "OBS'te Twitch ve Kick sohbeti birlikte nasıl gösterilir?",
      short: 'Twitch ve Kick sohbeti bir arada',
      summary:
        "Tek bir Sohbet Kutusu adresiyle iki sohbeti birleştirme, mesajın nereden geldiğini gösterme, emote'lar, bot gizleme ve alt şerit için yatay mod.",
      lead: "Sohbet Kutusu, Twitch ve Kick sohbetini tek bir Tarayıcı Kaynağı'nda birleştirir. Kurulum sayfasında Platformlar'dan İkisi'ni seç, iki kanal adını yaz ve oluşan tek adresi OBS'e 400 × 600 boyutunda ekle. Giriş gerekmez, iki sohbet de anonim olarak okunur.",
      setup: {
        title: "Twitch ve Kick sohbeti tek bir overlay'de nasıl birleştirilir?",
        step1: '[Sohbet Kutusu kurulum sayfasını](/setup/chat-widget) aç.',
        step2: "Platformlar'da İkisi'ni seç. Varsayılan zaten bu.",
        step3: 'Twitch Kanalı ve Kick Kanalı alanlarına sadece kanal adlarını yaz.',
        step4: 'Görünümü ayarla. Önizleme her değişikliği anında gösterir.',
        step5: "Widget URL'sini kopyala ve OBS'e 400 × 600 boyutunda Tarayıcı Kaynağı olarak ekle.",
        p1: 'Oluşan adreste iki kanal da yer alır, örneğin `/widgets/chat-widget?twitch=kanalin&kick=kanalin`. İki platform için ayrı kaynak eklemen gerekmez.',
        p2: 'Önizleme her zaman örnek sohbet oynatır. Böylece kanalında kimse yazmadan da ayarlarının yayında nasıl duracağını görürsün.',
      },
      restream: {
        title: 'Sohbet Kutusu yayınımı iki platforma aktarır mı?',
        p1: "Hayır. Sohbet Kutusu sadece sohbeti okur ve ekranda gösterir. Yayınını Twitch'e ya da Kick'e göndermez ve sohbete mesaj yazamaz. İki platformda aynı anda yayın yapmak için ayrı bir çoklu yayın (multistream) kurulumu gerekir, Sohbet Kutusu o yayına iki sohbeti birlikte getirir.",
        p2: "Moderasyon da overlay'e yansır: silinen mesajlar ve susturulan ya da banlanan kullanıcıların mesajları ekrandan kalkar.",
      },
      platform: {
        title: "Mesajın Twitch'ten mi Kick'ten mi geldiği nasıl görünür?",
        intro:
          'İki platform birlikteyken Platform Göstergesi her mesajın başında kaynağını gösterir. Üç seçenek var:',
        icon: 'Platform Simgesi (varsayılan): Twitch ya da Kick logosu.',
        name: 'Platform Adı: logo yerine `[twitch]` ya da `[kick]` yazısı.',
        none: 'Platformu Gizle: hiçbir işaret yok.',
        stripe:
          "Platform Renk Şeridi'ni açarsan her mesajın solunda ince bir çizgi çıkar: Twitch için mor, Kick için yeşil. Şerit açıkken göstergeyi gizleyip daha sade bir görünüm elde edebilirsin. Vurgulanan bir mesajda şeridin yerini vurgu rengi alır.",
      },
      look: {
        title: 'Hangi düzen, animasyon ve yazı tipleri var?',
        layoutTitle: 'Mesaj düzeni',
        inline: 'Satır içi (varsayılan): kullanıcı adı ve mesaj aynı satırda.',
        stacked: 'Üst üste: kullanıcı adı üstte, mesaj altta.',
        card: 'Kart / Balon: her mesaj yarı saydam bir kartın içinde.',
        compact: "Kompakt: Twitch'e benzeyen sıkı satırlar, yazılar biraz daha küçük.",
        animationTitle: 'Yeni mesaj animasyonu',
        animations:
          'Sekiz seçenek var: Sağdan kayarak gir (varsayılan), Sağdan yumuşakça kayarak gir, Belirerek büyü, Zıplayarak gir, Sıralı, Solarak belir, Daktilo ve Animasyon yok. Sohbet hızlandığında varsayılan dışındaki animasyonlar kısalır. Mesajlar yarım saniyeden sık gelirse animasyon normal süresinin üçte birine kadar iner, böylece hiçbiri bir sonrakine yetişmekte zorlanmaz.',
        fontTitle: 'Yazı tipi ve boyutu',
        fonts:
          'Inter (varsayılan), Roboto, Nunito, JetBrains Mono, Source Serif 4 ve sistem yazı tipi. Yazı boyutu 8 ile 72 piksel arasında, varsayılan 18. Kalın Kullanıcı Adları ve Kalın Mesajlar ayrı ayrı açılır.',
      },
      duration: {
        title: 'Mesajlar ekranda ne kadar kalır?',
        p1: "Varsayılan olarak 30 saniye. Mesaj Süresi'nden 10 sn, 15 sn, 30 sn, 1 dk, 2 dk, 5 dk ya da Süresiz seçebilirsin.",
        p2: "Süresiz'de mesajlar kaybolmaz: yeni gelenler eskileri yukarı iter, kutuya sığmayanlar dışarıda kalır ve en fazla son 100 mesaj tutulur.",
      },
      emotes: {
        title: "Hangi emote'lar görünür?",
        intro:
          "Twitch'in ve Kick'in kendi emote'ları her zaman resim olarak görünür. Bunlara ek olarak üç sağlayıcıyı Emote'lar menüsünden açıp kapatabilirsin, üçü de varsayılan olarak açık.",
        caption: "Sohbet Kutusu'nda emote sağlayıcılarının desteklediği platformlar",
        colProvider: 'Sağlayıcı',
        colPlatforms: 'Çalıştığı platform',
        both: 'Twitch ve Kick',
        twitchOnly: 'Sadece Twitch',
        p1: "Kanal emote'ları ve global emote'lar birlikte yüklenir. Aynı isimde iki emote varsa kanal emote'u kazanır, sağlayıcılar arasındaki sıra 7TV, BTTV, FFZ. Kick mesajlarında 7TV, kanalın Kick hesabına bağlı emote setini kullanır. 7TV'de sadece Twitch hesabın bağlıysa Kick mesajları da o seti kullanır. Kapattığın sağlayıcının emote'ları düz yazı olarak kalır.",
      },
      filters: {
        title: 'Botlar ve komutlar nasıl gizlenir?',
        bots: 'Botları Gizle, bilinen bot hesaplarının mesajlarını ekrandan çıkarır: Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, Sery_Bot, SoundAlerts, StreamlootsBot, KofiStreamBot, PokemonCommunityGame, OWN3D, Blerp, BotRix, KickBot, Kicklet ve Senchabot. Twitch\'te "Chat Bot", Kick\'te "Bot" rozeti taşıyan hesaplar da gizlenir.',
        commands:
          'Komutları Gizle, "!" ile başlayan her mesajı gizler; `!discord` ya da `!uptime` gibi komutlar ekranı doldurmaz. Botun komuta verdiği cevabı da saklamak için iki ayarı birlikte aç.',
        highlights:
          "Bunun tersine bazı mesajları öne çıkarmak için Vurgular var. Varsayılan olarak beşi de kapalı, istediklerini açman yeterli: kanalını etiketleyen ya da sana yanıt veren mesajlar, yanıtların üstündeki kime cevap verildiğini gösteren satır, sohbete ilk kez yazanlar, duyurular ve Mesajınızı Vurgulayın ile gönderilen mesajlar. Son üçü sadece Twitch'te var, çünkü Kick bu bilgileri göndermiyor.",
      },
      horizontal: {
        title: 'Sohbet ekranın altına şerit olarak nasıl konur?',
        p1: 'Yön ayarını Yatay yap. Mesajlar yan yana dizilir, en yenisi sağda belirir ve eskiler sola kayarak kutudan çıkar.',
        p2: '400 × 600 önerisi dikey kullanım için. Yatay şeritte kaynağın genişliğini şeridin boyuna, yüksekliğini tek bir mesaj satırına göre ayarla, sonra kaynağı ekranın altına yerleştir.',
      },
      others: {
        title: "Başka hangi widget'lar iki platformu birlikte dinler?",
        p1: "[Emote Duvarı](/setup/emote-wall), [Sub Sprout](/setup/sub-growing-plant), [Subathon Timer](/setup/subathon-timer), [Yayın Uyarıları](/setup/stream-alerts), [Abone Hedefi](/setup/sub-goal) ve [Sohbet Anketi](/setup/chat-poll) de tek adreste iki kanalı birlikte alır. Emote Duvarı iki sohbetten gelen, sadece emote'tan oluşan mesajları ekranda uçurur. Sub Sprout iki platformdaki aboneliklerle büyür, Kick'teki hediye abonelikler de dahil. Subathon Timer iki sohbetten gelen abonelik, hediye abonelik, Bits ve Kicks için süre ekler. Yayın Uyarıları iki platformdan gelen abonelik, hediye abonelik, Bits, Kicks ve raid'ler için uyarı gösterir. Abone Hedefi iki sohbetten gelen abonelikleri ve hediye abonelikleri tek bir sayıda toplar. Sohbet Anketi iki sohbetten gelen oyları tek bir sonuçta toplar.",
        p2: '[Çekiliş](/setup/raffle) ise her seferinde tek platformda çalışır: Twitch ya da Kick.',
      },
      ctaTitle: "Sohbet Kutusu'nu kur",
      ctaText: "Kanal adlarını yaz, adresi kopyala, OBS'e ekle. Giriş yok, indirme yok.",
      ctaSecondary: "Emote Duvarı'na bak",
    },
    raffle: {
      title: "Twitch veya Kick'te sohbet çekilişi nasıl yapılır?",
      short: 'Sohbet çekilişi yapma',
      summary:
        'Çekiliş aracıyla !join ile katılım, abonelere özel çekiliş, kazanç sınırı, minimum süre ve kazananı yayında konfetiyle gösterme.',
      lead: 'Çekiliş aracında izleyiciler sohbete bir anahtar kelime yazarak katılır, sen de tek tıkla kazananı çekersin. Varsayılan kelime `!join`. Giriş gerekmez; katılımcılar ve kazananlar kendi tarayıcında saklanır.',
      start: {
        title: 'Çekiliş nasıl başlatılır?',
        step1:
          '[Çekiliş sayfasını](/setup/raffle) aç ve platformu seç: Twitch ya da Kick. Bir çekiliş tek platformda çalışır.',
        step2: 'Kanal adını yaz. Katılımlar bu kanalın sohbetinden okunur.',
        step3:
          'Giriş anahtar kelimesini belirle. Varsayılan `!join`, istediğin kelimeyle değiştirebilirsin.',
        step4:
          "Kuralları seç, sonra Çekilişi Başlat'a bas. Anahtar kelime boşken bu düğme kapalı kalır.",
        step5: "Katılanlar listede görünür. Yeterince katılım olunca Kazananı Çek'e bas.",
        p1: "Çekiliş başladığında ayarlar kilitlenir, çekiliş sürerken kurallar değişmez. Katılımları kapatmak için Katılımı Kapat'a bas; kapattıktan sonra da kazanan çekebilirsin. Yeni bir çekiliş başlatmak katılımcı listesini sildiği için sayfa önce onay ister.",
      },
      entry: {
        title: 'İzleyiciler çekilişe nasıl katılır?',
        p1: 'İzleyici sohbete anahtar kelimeyi yazar. Büyük küçük harf fark etmez ve mesaj kelimeyle başladığı sürece devam edebilir: `!join` ve `!join bol şans` sayılır, `hadi !join` sayılmaz.',
        p2: 'Her kişi bir kez girer. Komutu tekrar yazmak ikinci bir şans vermez.',
        p3: 'Bilinen botlar hiç katılamaz: Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, BotRix, SoundAlerts, Blerp, Kofi_Stream_Bot ve Senchabot. Listeden birini elle çıkarmak için adının yanındaki ✕ düğmesine bas.',
      },
      rules: {
        title: 'Hangi kurallar ayarlanabilir?',
        caption: 'Çekiliş kuralları, seçenekleri ve varsayılanları',
        colRule: 'Kural',
        colOptions: 'Seçenekler',
        colDefault: 'Varsayılan',
        subsOnly: 'Sadece Aboneler',
        subsOnlyOptions: 'Açık ya da kapalı',
        subsOnlyDefault: 'Kapalı',
        minMonths: 'En Az Abonelik (ay)',
        minMonthsOptions: '1 ve üstü, sadece Sadece Aboneler açıkken',
        minMonthsDefault: '1',
        maxWins: 'Kişi Başı Kazanma Sınırı',
        maxWinsOptions: '1 ile 5 arası ya da sınırsız',
        maxWinsDefault: '1',
        minDuration: 'En Kısa Süre',
        minDurationOptions: '0 ile 300 saniye',
        minDurationDefault: '15 saniye',
        subsText:
          "Sadece Aboneler açıkken abone rozeti olmayanlar katılamaz. Yayıncı da abone sayılır, En Az Abonelik 1 ay olduğu sürece kendi çekilişine girebilir. Bu alan 1'de kalırsa her abone katılır; 6 yaparsan sadece en az 6 aydır abone olanlar girer. Abonelik süresi Twitch'te ve Kick'te izleyicinin abone rozetinden okunur.",
        winsText:
          'Çekilen kazanan katılımcı listesinden çıkar ve kazananlar listesine eklenir. Sınır 1 ise aynı çekilişte bir daha kazanamaz. Sınır daha yüksekse ya da sınırsızsa, anahtar kelimeyi yeniden yazarak tekrar katılabilir.',
        durationText:
          'Kazananı Çek düğmesi, çekiliş başladıktan sonra bu süre dolana kadar kilitli kalır ve kalan saniyeyi gösterir. Geç gören izleyicilerin de katılmaya vakti olur.',
        fairText:
          'Kazanan, uygun katılımcılar arasından tarayıcının güvenli rastgele sayı üreticisiyle (`crypto.getRandomValues`) çekilir.',
      },
      storage: {
        title: 'Sayfayı yenilersem çekiliş kaybolur mu?',
        p1: 'Hayır. Ayarlar, katılımcılar ve kazananlar tarayıcının yerel depolamasında (localStorage) durur. Sayfayı yenilesen ya da kapatıp açsan da kaldığın yerden devam edersin.',
        p2: "Bu bilgiler sadece o tarayıcıda durur, başka bir bilgisayarda ya da tarayıcıda görünmez. Sayfa kapalıyken sohbet okunmaz, o arada yazılan komutlar sayılmaz. Baştan başlamak için Tümünü Sıfırla'yı kullan; sadece katılımları ya da sadece kazananları da ayrı ayrı temizleyebilirsin.",
      },
      overlay: {
        title: 'Kazanan yayında nasıl gösterilir?',
        p1: "Çekiliş sayfasındaki kazanan overlay adresini (`/widgets/raffle-overlay`) OBS'e 1920 × 1080 boyutunda Tarayıcı Kaynağı olarak ekle. Kazananı Çek'e bastığında overlay kazananın adını ekranın ortasında gösterir, iki kenardan 3 saniye boyunca konfeti patlar ve ad 10 saniye sonra kaybolur.",
        warnTitle: 'Yayından önce mutlaka dene',
        warn: "Kazanan overlay'e BroadcastChannel ile gider ve bu sadece aynı tarayıcının içinde çalışır. Çekiliş sayfasını Chrome gibi ayrı bir tarayıcıda açıp overlay'i OBS'e eklersen ikisi farklı uygulamalarda çalışır ve kazanan OBS'e ulaşmaz. Yayına çıkmadan önce bir deneme çekilişi yap ve kazananın OBS'te göründüğünü kontrol et.",
        p2: 'Overlay\'in bulunduğu sahne açık olsun ve kaynakta "Görünür olmadığında kaynağı kapat" kapalı kalsın; kapalı kaynak kazananı kaçırır. Ayrıntılar [OBS rehberinde](/guides/obs-browser-source). Kazanan her durumda çekiliş sayfasında da konfetiyle görünür, overlay çalışmasa bile adı oradan okuyabilirsin.',
      },
      ctaTitle: 'Çekilişini hazırla',
      ctaText:
        'Platformu seç, kanalını yaz, anahtar kelimeyi belirle. İlk çekilişe bir dakikada hazırsın.',
    },
    bridge: {
      title: 'Moderatörler sohbetten OBS sahnesini nasıl değiştirebilir?',
      short: 'Sohbetten sahne değiştirme',
      summary:
        "OBS Bridge ile WebSocket'i açma, sohbet komutları, !scene ile sahne bulma ve komutları kimlerin kullanabileceği.",
      lead: 'OBS Bridge, Twitch ya da Kick sohbetini dinler ve yetki verdiğin kişilerin komutlarını bilgisayarındaki OBS\'e iletir. OBS\'te WebSocket sunucusunu aç, kurulum sayfasında kanalını ve yetkili kullanıcıları gir, oluşan araç adresini açık tut. Bir moderatör `!scene oyun` yazdığında OBS, adında "oyun" geçen sahneye geçer.',
      websocket: {
        title: "OBS'te WebSocket nasıl açılır?",
        step1:
          "OBS'te üst menüden Araçlar → WebSocket Sunucu Ayarları'nı aç (Tools → WebSocket Server Settings).",
        step2: 'WebSocket sunucusunu etkinleştir kutusunu işaretle.',
        step3: "Kimlik doğrulama açıksa Bağlantı Bilgilerini Göster'e bas ve şifreyi kopyala.",
        step4: "Tamam'a bas.",
        p1: 'OBS Bridge, OBS Studio 28 ve sonrasında yerleşik gelen obs-websocket 5 ile konuşur. Varsayılan olarak `ws://127.0.0.1:4455` adresine bağlanır; OBS aynı bilgisayardaysa WebSocket URL alanını boş bırak. OBS başka bir bilgisayardaysa o bilgisayarın adresini ve portunu yaz, örneğin `ws://192.168.1.20:4455`. Bağlantı kurulamazsa araç 5 saniyede bir yeniden dener.',
      },
      setup: {
        title: 'OBS Bridge nasıl kurulur?',
        step1: '[OBS Bridge kurulum sayfasını](/setup/obs-bridge) aç.',
        step2: 'Dinlenecek Twitch kanalını, Kick kanalını ya da ikisini birden yaz.',
        step3: 'Yetkili kullanıcıları ekle. Kimleri ekleyeceğin aşağıda anlatılıyor.',
        step4: "OBS WebSocket şifreni gir, gerekiyorsa WebSocket URL'sini değiştir.",
        step5:
          "Araç URL'sini kopyala ve bir tarayıcı sekmesinde ya da OBS'te Özel Tarayıcı Dock'u olarak aç.",
        step6:
          'Araç sayfası OBS sahnelerini listeler. Ana ve BRB olarak kullanacağın sahnelerin yanındaki Ana ve BRB düğmelerine bas.',
        p1: 'Seçim yapmazsan Ana sahne olarak `Main Scene`, BRB sahnesi olarak `BRB Scene` adlı sahneler aranır. Seçimin araç sayfasının adresine yazılır, bu yüzden seçtikten sonra adresi yeniden kopyalayıp sakla. Bir dahaki açılışta aynı sahneler gelir.',
      },
      commands: {
        title: 'Hangi sohbet komutları var?',
        caption: "OBS Bridge'in varsayılan sohbet komutları",
        colCommand: 'Komut',
        colAction: 'Ne yapar',
        sceneArg: '<sahne adı>',
        scene: 'Adı eşleşen sahneye geçer',
        brb: 'BRB sahnesine geçer',
        back: 'Ana sahneye geçer',
        stream: 'Yayını başlatır / durdurur',
        record: 'Kaydı başlatır / durdurur',
        p1: "`brb` ve `back` ünlemsiz yazılır. Komutlar büyük küçük harfe bakmaz ama mesajın tamamı komut olmalı: `brb` çalışır, `brb 5 dk` çalışmaz. Kurulum sayfasındaki Komutlar bölümünden her komutun adını değiştirebilirsin, örneğin `!scene` yerine `!sahne`.",
        p2: 'Yayını durdurma komutu yayını gerçekten kapatır. Yetkili listesini kısa tut.',
      },
      matching: {
        title: '!scene komutu doğru sahneyi nasıl bulur?',
        p1: 'Önce tam eşleşme aranır: `!scene oyun`, adı tam olarak "Oyun" olan sahneye geçer, büyük küçük harf fark etmez. Tam eşleşme yoksa adında o kelime geçen ilk sahne seçilir: `!scene sohbet`, "Sadece Sohbet" sahnesini bulur. Hiçbir sahne eşleşmezse hiçbir şey olmaz.',
        p2: "Birden fazla sahne aynı kelimeyi içeriyorsa Sahneler listende en üstte olan kazanır. Benzer adlı sahnelerde tam adı yazmak en güvenlisi. Sahne eklediğinde ya da adını değiştirdiğinde liste kendiliğinden güncellenir.",
      },
      users: {
        title: 'Komutları kimler kullanabilir?',
        p1: 'Sadece Yetkili Kullanıcılar listesindekiler. Liste boşsa kimse komut kullanamaz, yayıncı da dahil; kendi hesabını da eklemen gerekir.',
        p2: "Her kullanıcı bir platformla birlikte eklenir ve adreste `commandUser=twitch:ahmet,kick:ayse` şeklinde durur. Bir mesaj ancak hem platformu hem adı eşleşirse komut sayılır. Böylece Kick'te biri Twitch moderatörünün adını alsa bile sahne değiştiremez.",
        p3: 'Platform eklenmeden kaydedilmiş eski isimler (sadece `ahmet`), adres tek bir platform kuruyorsa o platformda geçerli olur. İki platform birlikteyken bu isimler araç sayfasında sarıyla işaretlenir ve sen bir platform seçene kadar komut kullanamaz.',
      },
      open: {
        title: 'Araç sayfası açık kalmak zorunda mı?',
        p1: "Evet. Sohbeti okuyan ve komutları OBS'e ileten araç sayfasıdır. Sekmeyi kapatırsan komutlar çalışmaz. Aracı yayın boyunca açık bir sekmede ya da OBS'te dock olarak tut; OBS ile bağlantı koparsa araç 5 saniyede bir yeniden bağlanmayı dener.",
      },
      security: {
        title: 'Araç adresi neden şifre gibi saklanmalı?',
        p1: 'Çünkü OBS WebSocket şifren adresin içinde durur (`obsWebsocketPassword` parametresi). Adresi paylaşmak şifreni paylaşmak demek. Adresi yayında gösterme, sohbette paylaşma ve ekran paylaşırken adres çubuğunu gizle.',
        p2: "OBS bağlantısı doğrudan tarayıcından OBS'e gider. Araç sayfasının kendisi ise her site gibi extensions.senchabot.com'dan yüklenir, yani şifre dahil adresin tamamı bu istekle birlikte gider.",
      },
      ctaTitle: "OBS Bridge'i kur",
      ctaText:
        'Kanalını ve yetkili kullanıcıları gir, araç adresini aç. Sahne komutları hemen çalışmaya başlar.',
    },
    subathon: {
      title: "Twitch ve Kick'te subathon sayacı nasıl kurulur?",
      short: 'Subathon sayacı kurma',
      summary:
        "Her abonelik, hediye, Bits cheer'ı ve Kicks hediyesinin ne kadar süre eklediği, sayacı !subathon ile başlatma, mod komutları ve OBS kapanınca ya da süre bitince ne olduğu.",
      lead: "Subathon Timer, abonelik geldikçe uzayan bir geri sayım. Başlangıç süresini ve her abonelik, hediye abonelik, Bits cheer'ı ve Kicks hediyesinin ne kadar süre ekleyeceğini belirle, URL'yi OBS'e 800 × 300 boyutunda Tarayıcı Kaynağı olarak ekle ve yayına geçince sohbete `!subathon start` yaz. Giriş gerekmez, sayaç herkese açık Twitch ve Kick sohbetini okur.",
      setup: {
        title: 'Subathon sayacı nasıl ayarlanır?',
        step1: '[Subathon Timer kurulum sayfasını](/setup/subathon-timer) aç.',
        step2: "Twitch, Kick ya da İkisi'ni seç ve sadece kanal adlarını yaz.",
        step3: "Başlangıç Süresi'ni ayarla (varsayılan 1 saat), istersen bir Süre Sınırı da koy.",
        step4:
          "Abonelik, hediye abonelik, Bits ve Kicks'in ne kadar süre ekleyeceğini belirle. İkisi'ni seçtiysen Twitch ve Kick için ayrı sekmeler çıkar.",
        step5:
          "Bir stil ve renk seç, URL'yi kopyala ve OBS'e 800 × 300 boyutunda Tarayıcı Kaynağı olarak ekle.",
        p1: "Kurulum sayfasındaki önizleme sahte abonelik, hediye ve cheer'ları 60× hızda oynatır, yani bir saatlik sayaç yaklaşık bir dakikada biter. Hızı 1× ile 300× arasında ayarlayabilirsin. Dene düğmeleriyle bir abonelik, 5'li bir hediye ya da 500 Bits/Kicks ekleyebilir, 10 dakika düşebilir, sayacı duraklatıp sıfırlayabilirsin. Bu düğmeler sadece önizlemeyi değiştirir, OBS'teki sayaca hiç dokunmaz.",
      },
      values: {
        title: 'Her abonelik ne kadar süre ekler?',
        intro:
          "Süreyi 0 ile 60 arasında tam dakika olarak seçersin, 0 o olayı kapatır. Twitch ve Kick'in değerleri ayrı, hepsi varsayılan olarak 1 dakika. Varsayılan olarak açık gelen Sayaçta Göster, bu süreleri Sub +1 dk gibi sayaçta listeler, böylece izleyiciler aboneliklerinin ne kadar süre eklediğini bilir. Twitch ve Kick farklı süreler ekliyorsa ikisi sırayla gösterilir.",
        caption: 'Subathon sayacına her olayın eklediği süre',
        colEvent: 'Olay',
        colDefault: 'Varsayılan',
        colHow: 'Nasıl sayılır',
        oneMinute: '1 dk',
        sub: 'Abonelik',
        subHow: "Her yeni abonelik ve yenileme. Twitch'te Prime abonelik Tier 1 sayılır.",
        gift: 'Hediye abonelik',
        giftHow: "Hediyedeki her abonelik ayrı sayılır, yani 5'li bir hediye beş kat süre ekler.",
        bits: '500 Bits ya da 500 Kicks',
        bitsHow: 'Diğer miktarlar oranına göre ekler: değer 1 dakikaysa 100 Bits 12 saniye ekler.',
        tiers:
          "Tier 2 ve 3 Daha Çok Sayılır açıkken (varsayılan böyle), Twitch'te Tier 2 abonelik ya da hediye iki kat, Tier 3 beş kat süre ekler, fiyatlarıyla orantılı. Kick aboneliklerinde tier olmadığı için her biri bir kez sayılır.",
        cap: "Süre Sınırı, sayacın tutabileceği en uzun süre. Sınırı aşacak kısım eklenmez, onun için +süre yazısı da çıkmaz. Varsayılan olan Sınırsız'da sayaç, abonelik geldikçe uzamaya devam eder.",
      },
      start: {
        title: 'Subathon nasıl başlatılır?',
        p1: "Varsayılan olarak sayaç, sen ya da bir mod sohbete `!subathon start` yazana kadar duraklatılmış bekler. Böylece kaynağı yayından önce ekleyip saati yayına geçince başlatabilirsin. Başlatma'da Hemen'i seçersen sayaç, kaynak OBS'te yüklenir yüklenmez başlar.",
        p2: 'Başlamadan önce gelen abonelikler de süre ekler, sayaç duraklatılmışken gelenler de. Saat başladığında o süre zaten eklenmiş olur.',
      },
      commands: {
        title: 'Modlar hangi sohbet komutlarını kullanabilir?',
        caption: 'Subathon Timer sohbet komutları',
        colCommand: 'Komut',
        colAction: 'Ne yapar',
        start: 'Sayacı başlatır ya da duraklatıldıysa devam ettirir',
        pause: 'Sayacı duraklatır, kalan süre olduğu gibi kalır',
        add: "Süre ekler, en fazla Süre Sınırı'na kadar",
        remove: 'Süreden düşer, sıfırın altına inmez',
        set: 'Kalan süreyi ayarlar',
        reset: "Başlangıç Süresi'yle baştan başlatır",
        p1: "Twitch'te de Kick'te de bunları sadece yayıncı ve moderatörler kullanabilir. VIP'ler ve izleyiciler kullanamaz. Sayaç sohbette cevap vermez, sonucu doğrudan sayacın üstünde görürsün.",
        p2: 'Süreleri `10m`, `45s`, `1h30m` ya da `1:30:00` gibi yaz. Sadece sayı yazarsan dakika sayılır, yani `!subathon add 15` 15 dakika ekler. Birimler tek harf: `10min` çalışmaz, `10m` çalışır.',
      },
      look: {
        title: 'Hangi stiller ve renkler var?',
        bar: "Can Barı (varsayılan): %100'den sıfıra doğru eriyen, oyun tarzı bir bar.",
        clock: 'Saat: saat, dakika ve saniye olarak büyük rakamlar.',
        ring: 'Halka: süre azaldıkça boşalan bir çember.',
        p1: 'Varsayılan renk olan Can, süre azaldıkça yeşilden sarıya, sonra kırmızıya döner. İstersen sabit bir renk de seçebilirsin: yeşil, mor, kırmızı, altın, turkuaz ya da pembe. Sayacın yanındaki başlıkta varsayılan olarak SUBATHON yazar. Bunu en fazla 32 karakterlik istediğin bir yazıyla değiştirebilir ya da boş bırakıp gizleyebilirsin.',
        p2: "Yüzdeyi Göster, sayacın ne kadar dolu olduğunu gösterir. %100, sayacın şimdiye kadar tuttuğu en uzun süre demek, bu yüzden yüzde hiçbir zaman 100'ü geçmez: dolu bara süre eklenince bar dolu kalır ve yeni zirveden geri saymaya başlar. Eklenen Süreyi Göster açıksa her süre eklendiğinde sayacın üstünde izleyicinin adıyla birlikte +1:00 gibi bir yazı süzülür.",
      },
      saved: {
        title: 'OBS kapanırsa ya da kaynak yeniden yüklenirse ne olur?',
        p1: "Sayaç OBS'in içinde kaydedilir, bu yüzden kaynak yeniden yüklenince ya da OBS yeniden açılınca kaldığı yerden devam eder. OBS kapalıyken de geri sayım durmaz, gerçek bir saat gibi işlemeye devam eder.",
        p2: 'OBS ya da kaynak kapalıyken sohbetin okunmaz, bu yüzden o arada gelen abonelikler süre eklemez. Bir mod bunları sonradan `!subathon add` ile ekleyebilir. "Görünür olmadığında kaynağı kapat" seçeneğini de bu yüzden kapalı tut, nedenini [OBS rehberi](/guides/obs-browser-source) anlatıyor.',
        p3: "Kaydedilen sayaç o OBS'e ve o kanallara ait. URL'deki kanalları değiştirirsen, örneğin subathon'un ortasında Kick'i eklersen, ya da URL'yi başka bir OBS'te veya tarayıcı sekmesinde açarsan sıfırdan yeni bir sayaç başlar.",
      },
      zero: {
        title: 'Sayaç sıfıra ulaşınca ne olur?',
        p1: "00:00:00'da durur ve kırmızı yanıp söner, Can Barı ve Halka stillerinde K.O. yazar. Yeni abonelikler artık süre eklemez, yani subathon biter.",
        p2: 'Devam etmek için bir mod `!subathon add` ya da `!subathon set` komutunu bir süreyle yazar, sayaç hemen yeniden işlemeye başlar. Yeni bir subathon başlatmak için `!subathon reset` yaz.',
      },
      change: {
        title: 'Sayaç nasıl değiştirilir ya da yeni subathon nasıl başlatılır?',
        p1: "Mevcut URL'ni kurulum sayfasındaki Widget URL alanına yapıştır. Kanalların ve ayarların geri gelir. İstediğini değiştir, yeni URL'yi kopyala ve OBS'teki eskisinin yerine yapıştır. Yeni süre değerleri ve yeni Süre Sınırı, OBS yeni URL'yi yükler yüklemez geçerli olur, kalan süre de olduğu gibi kalır.",
        p2: "Yeni Başlangıç Süresi sadece sayaç ilk kez başlayana kadar kendiliğinden uygulanır. Ondan sonra yeni Başlangıç Süresi'yle baştan başlamak için sohbete `!subathon reset` yaz. Başlatma komuta ayarlıysa sayaç bundan sonra yine `!subathon start` gelene kadar duraklatılmış bekler.",
      },
      notCounted: {
        title: 'Neler süre eklemez?',
        follows:
          'Takipler ve bağışlar. Twitch ve Kick, giriş yapılmamış bir sayfaya yeni takipçileri göstermiyor, iki platformun da kendine ait bir bağış sistemi yok.',
        raids: "Raid'ler, iki platformda da.",
        resubs:
          'İzleyicinin paylaşmadığı Twitch yenilemeleri. Twitch bir yenilemeyi sohbete ancak izleyici paylaşırsa bildirir. Kick yenilemeleri abonelik olarak gönderdiği için onlar sayılır.',
        bits: "Power-up'lar gibi sohbet dışında harcanan Bits. Sadece sohbette cheer olarak gönderilen Bits sayılır.",
        sharedChat:
          "Twitch Shared Chat oturumunda sohbeti paylaştığın diğer kanala gelen abonelik ve cheer'lar. Sadece kendi kanalın sayılır.",
      },
      ctaTitle: 'Subathon sayacını kur',
      ctaText: "Başlangıç süresini ve her aboneliğin ne kadar ekleyeceğini belirle, URL'yi kopyala, OBS'e ekle.",
    },
    poll: {
      title: "Twitch ve Kick'te sohbet anketi nasıl yapılır?",
      short: 'Sohbet anketi yapma',
      summary:
        '!poll ile anket başlatma, izleyicilerin oy verme yolları, izleyici başına tek oy, yayın gecikmesi ve süre bitince ya da OBS kapanınca ne olduğu.',
      lead: "Sohbet Anketi, yayınına Twitch ve Kick sohbetinin numara yazarak oy verdiği bir anket koyar. URL'yi OBS'e 640 × 560 boyutunda Tarayıcı Kaynağı olarak ekle. Sen ya da bir mod sohbete `!poll Soru | A | B` yazınca anket ekrana gelir. Giriş de bot da gerekmez, anket herkese açık sohbetini okur.",
      setup: {
        title: 'Sohbet anketi nasıl ayarlanır?',
        step1: '[Sohbet Anketi kurulum sayfasını](/setup/chat-poll) aç.',
        step2: "Twitch, Kick ya da İkisi'ni seç ve sadece kanal adlarını yaz.",
        step3:
          'Yayından önce hazır bir anket istiyorsan Hazır Anket bölümüne bir soru ve 2 ile 6 arası seçenek yaz. Bu anket `!poll start` ile ekrana gelir.',
        step4:
          "Anket Süresi'ni (varsayılan 1 dakika), sonuçların ekranda ne kadar kalacağını ve kimlerin oy verebileceğini ayarla.",
        step5:
          "Bir renk, konum ve anket dili seç, URL'yi kopyala ve OBS'e 640 × 560 boyutunda Tarayıcı Kaynağı olarak ekle.",
        p1: "Kurulum sayfasındaki önizleme, sahte izleyicilerin oy verdiği bir anketi gerçek zamandan hızlı oynatır, bitince sıradakini başlatır. Dene düğmeleri 10 oy ekler, 30 saniye ekler, anketi bitirir ve yeni bir anket başlatır. Bu düğmeler sadece önizlemeyi değiştirir, OBS'teki ankete hiç dokunmaz.",
      },
      commands: {
        title: 'Sohbetten anket nasıl başlatılır?',
        intro:
          "Twitch'te de Kick'te de anketleri sadece yayıncı ve moderatörler yönetebilir. VIP'ler ve izleyiciler yönetemez: bir izleyici `!poll` yazarsa hiçbir şey değişmez.",
        caption: 'Sohbet Anketi sohbet komutları',
        colCommand: 'Komut',
        colAction: 'Ne yapar',
        question: 'Soru',
        new: "2 ile 6 arası seçenekli yeni bir anket başlatır, süresi URL'deki Anket Süresi kadar",
        newTime: 'Aynısı, kendi süresiyle: 90s, 2m, 1m30s ya da 1:30',
        yesNo: 'Seçenekleri Evet ve Hayır olan hızlı bir anket başlatır',
        start: "URL'de kayıtlı hazır anketi başlatır",
        extend: 'Süresi olan açık bir ankete süre ekler',
        end: "Oylamayı hemen bitirir, kazanan Yayın Gecikmesi'nden sonra çıkar",
        cancel: 'Anketi sonuçlarıyla birlikte ekrandan kaldırır',
        p1: 'Soruyu ve seçenekleri `|` ile ayır. Altıncıdan sonraki seçenekler atlanır. Aynı seçenek iki kez yazılırsa, büyük küçük harf farklı olsa da ikincisi atlanır. Soru en fazla 80, her seçenek en fazla 30 karakter olabilir. Yeni bir anket ekrandakinin yerini alır.',
        p2: 'Komut kelimeleri sadece doğru yazılınca çalışır: `!poll extend 30 seconds` hiçbir şey yapmaz, soru olarak da ekrana gelmez. Sorudan önce yazılan tek başına bir sayı süre sayılmaz, yani `!poll 3 oyun mu 4 oyun mu? | 3 | 4` yazınca soru olduğu gibi kalır. Anket sohbette cevap vermez, sonucu ekranda görürsün.',
      },
      voting: {
        title: 'İzleyiciler nasıl oy verir?',
        number: 'Tek başına seçeneğin numarası, örneğin `2`.',
        command: '`!vote 2` ya da `!2`, bot anketlerine alışkın izleyiciler için.',
        text: "Seçeneğin kendisi: `speedrun` yazmak Speedrun'a oy verir. Büyük küçük harf ve aksan fark etmez, Türkçe karakterli de karaktersiz de yazılabilir.",
        p1: 'Mesajın tamamı oy olmalı. `2 olsun`, `4Head` ya da `1 oyun daha` sayılmaz, böylece normal sohbet oya dönüşmez. Bir seçenek sayıdan oluşuyorsa numara yerine o seçenek sayılır: `3 | 4 | 5` anketinde 3 yazan üçüncü seçeneğe değil, 3 seçeneğine oy verir.',
        p2: "Twitch'in `/vote` komutu Twitch'in kendi anketleri için, o yüzden sohbete numarayı yazmalarını söyle. Anket, seçeneklerin altında \"Sohbete 1 ile 3 arası yaz\" gibi bir ipucu gösterir.",
      },
      rules: {
        title: 'Bir izleyici birden fazla oy verebilir mi?',
        p1: 'Hayır. Her Twitch ya da Kick hesabı bir kez sayılır. İzleyiciler Oyunu Değiştirebilir açıkken (varsayılan böyle) yeni yazılan numara oyu oraya taşır, kapatırsan ilk oy geçerli kalır. Olmayan bir seçeneğe yazılan oy, izleyicinin önceki oyunu hiçbir zaman silmez.',
        p2: "Kimler Oy Verebilir'i Aboneler yaparsan sadece abone ya da kurucu (founder) rozeti olanlar oy verebilir, bir de sen. Herkes oy verirken Abone Oyunun Değeri bir abonenin oyunu 2 ya da 3 kat saydırır. Anket bunu ekranda da yazar, yüzdeler de bu ağırlıklı oylarla hesaplanır.",
        p3: 'Anket oy toplarken bir mod bir hesabı susturur ya da banlarsa o hesabın oyu düşer. Bu da bir anda gelen spam botlarının oylarını temizlemeye yarar.',
      },
      timing: {
        title: 'Süre bitince ne olur?',
        p1: 'İzleyiciler yayınını sohbetin birkaç saniye gerisinden izler, yani onların ekranında 1 saniye kaldığında anket sohbette çoktan kapanmıştır. Süre bittikten sonra oylar Yayın Gecikmesi kadar daha sayılır (varsayılan 5 saniye), bu sırada ankette Son oylar yazar. Bunu izleyicilerinin ne kadar geriden izlediğine göre ayarla, Twitch ve Kick genelde 2 ile 10 saniye geriden gelir.',
        p2: 'Ardından kazanan taçla birlikte altın renginde parlar, diğer seçenekler soluklaşır. İki ya da daha fazla seçenek en çok oyda eşit kalırsa ankette Berabere yazar. Sonuçlar Sonuç Gösterim Süresi boyunca ekranda kalır (varsayılan 30 saniye), sonra anket yavaşça kaybolur. Sonuçların bir sonraki ankete ya da `!poll cancel` yazılana kadar kalması için 0 yap.',
        p3: 'Anket Süresi 0 olursa ankette süre olmaz, anket bir mod `!poll end` yazana kadar açık kalır. `!poll extend` sadece süresi olan bir ankete süre ekler.',
      },
      look: {
        title: 'Anketin görünümü nasıl değiştirilir?',
        blind:
          'Sonuçları Sona Kadar Gizle: oylama açıkken barlar gizli kalır ve sadece oy sayısı görünür, böylece ilk oylar diğerlerini etkilemez.',
        color: 'Renk: mor (varsayılan), yeşil, kırmızı, altın, turkuaz ya da pembe.',
        position:
          "Konum: anket Tarayıcı Kaynağı'nın üst ya da alt kısmında durur, seçenek sayısına göre oradan uzar.",
        language:
          'Anket Dili: anketteki kelimeler için İngilizce ya da Türkçe, örneğin Sonuçlar yazısı ve hızlı anketteki Evet ile Hayır.',
        p1: "İki platform da açıksa anket, toplamın yanında oyların kaçının Twitch'ten, kaçının Kick'ten geldiğini gösterir. Kaynak şeffaftır, yayında sadece anket kartı görünür.",
      },
      saved: {
        title: 'OBS kapanırsa ya da kaynak yeniden yüklenirse ne olur?',
        p1: "Anket ve oylar OBS'in içinde kaydedilir, bu yüzden kaynak yeniden yüklenince ya da OBS yeniden açılınca kaldığı yerden devam eder. OBS kapalıyken de süre işlemeye devam eder.",
        p2: 'OBS ya da kaynak kapalıyken sohbetin okunmaz, bu yüzden o arada yazılan oylar sayılmaz. "Görünür olmadığında kaynağı kapat" seçeneğini de bu yüzden kapalı tut, nedenini [OBS rehberi](/guides/obs-browser-source) anlatıyor. Kaydedilen anket o OBS\'e ve o kanallara ait.',
      },
      limits: {
        title: 'Sohbet Anketi neleri yapamaz?',
        chat: 'Sohbete yazamaz. Sadece sohbeti okur, bu yüzden anketi ya da kazananı orada duyurmaz, ikisini de yayındaki anket gösterir.',
        native:
          "Twitch'in ya da Kick'in kendi anketlerini gösteremez. Twitch'in anketleri giriş yapmadan okunamıyor, bu yüzden iki platformda da aynı çalışsın diye oylar sohbetten gelir.",
        points:
          'Kanal Puanları ya da Bits ile oy almaz. Her izleyicinin bir oyu var, bunu açarsan abonelerin 2 ya da 3 oyu olur.',
        multiple: 'Çoklu seçimli anket yapamaz. Her izleyici tek bir seçenek seçer.',
      },
      ctaTitle: 'Sohbet anketini kur',
      ctaText: "Hazır bir anketi ve oylama kurallarını tek URL'ye koy, OBS'e ekle ve sohbete !poll yaz.",
    },
    frames: {
      title: "OBS'te kameraya, sohbete ve ekrana çerçeve nasıl eklenir?",
      short: 'Yayın çerçevesi ekleme',
      summary:
        "Kamera, sohbet ve ekran çerçevesini OBS'e ekleme, kaynak sırası, kamerayı çerçeveye sığdırma, preset ve animasyon seçimi.",
      lead: "Yayın Çerçeveleri kameranın, sohbetinin ya da bütün yayın ekranının etrafına seçtiğin preset'in havasında hazır bir çerçeve koyar. Kurulum sayfasında parçayı ve preset'i seç, URL'yi OBS'e Tarayıcı Kaynağı olarak ekle ve kameranın ya da sohbetinin üstüne yerleştir. Çerçevenin ortası şeffaftır, kanal bağlaman ya da giriş yapman gerekmez.",
      setup: {
        title: 'Yayın çerçevesi nasıl ayarlanır?',
        step1: '[Yayın Çerçeveleri kurulum sayfasını](/setup/stream-frames) aç.',
        step2:
          'Neyin çerçevesi? kısmında Kamera, Sohbet ya da Ekran seç. Her parça ayrı bir Tarayıcı Kaynağı, istersen üçünü de ekle.',
        step3:
          "Bir preset seç. Klasik'te rengi sen seçersin, diğer preset'ler kendi renkleri, yazı tipi ve çizimleriyle gelir.",
        step4:
          'Yazı alanına kanal adını ya da istediğin bir kelimeyi yaz. Kamera ve sohbette çerçevenin üstündeki sekmede, ekranda alttaki plakada görünür.',
        step5:
          "URL'yi kopyala ve OBS'e Tarayıcı Kaynağı olarak ekle: kamera için 640 × 360, sohbet için 420 × 720, ekran için 1920 × 1080.",
        p1: 'Önizleme çerçeveyi bir kişi silüeti ya da örnek sohbet satırlarıyla gösterir. Bunlar sadece yer tutucu, yayında çerçevenin ortası boştur.',
      },
      layers: {
        title: 'Çerçeve neden kameramın arkasında kalıyor?',
        p1: "OBS'te Kaynaklar listesinde üstte olan kaynak sahnede önde durur. Çerçeve kaynağını kameranın (Video Yakalama Aygıtı) ya da Sohbet Kutusu'nun üstüne taşı. Kaynağa sağ tıklayıp Sırala → En Üste Taşı'nı da seçebilirsin.",
        p2: "Kamerayı ve çerçeveyi birlikte taşımak için ikisini seç, sağ tıkla ve Seçilen Ögeleri Grupla'yı seç. Grubu büyütüp küçültünce ikisi aynı oranda değişir.",
        p3: 'Ekran çerçevesi bütün sahnenin önünde durmalı. Onu listenin en üstüne koy, oyun ve diğer kaynaklar altında kalsın.',
      },
      fit: {
        title: 'Kamera çerçeveye nasıl sığdırılır?',
        intro:
          'Çerçevenin ortasındaki boşluk dış kenarından biraz küçüktür. Kameran boşluğu doldurmalı ama çerçevenin dış kenarından taşmamalı, taşan kısım çerçevenin etrafında görünür. Önerilen boyutlarda şu ölçüler iyi oturur:',
        caption: 'Önerilen çerçeve boyutları ve içine gelen kaynak',
        colPiece: 'Parça',
        colFrame: 'Çerçeve boyutu',
        colInside: 'İçine gelen kaynak',
        camera: 'Kamera',
        chat: 'Sohbet',
        screen: 'Ekran',
        cameraInside: 'Kamera 590 × 296, çerçeveyle ortalanmış',
        chatInside: 'Sohbet Kutusu 370 × 660, çerçeveyle ortalanmış',
        screenInside: 'Oyun ya da ekran yakalama bütün sahneyi kaplar',
        p1: "16:9 bir kamerayı 590 genişliğe getirince yüksekliği 332 olur, bu yüzden yükseklik 296 kalana kadar üstten ve alttan eşit kırp. Alt tuşunu (Mac'te Option) basılı tutup kaynağın üst ve alt kenarını sürükle, ya da kameraya sağ tıklayıp Dönüştür → Dönüştürmeyi Düzenle'deki Kırp alanlarını kullan.",
        p2: "Çerçeveyi daha büyük kullanırsan bu ölçüler de aynı oranda büyür: 1280 × 720 bir kamera çerçevesinde kamera 1180 × 592 olur. Kare ya da dikey bir kamera için Tarayıcı Kaynağı'nın genişlik ve yüksekliğini ona göre yaz, çerçeve o şekle göre çizilir.",
      },
      look: {
        title: 'Preset ve animasyonlar neyi değiştirir?',
        p1: "Preset çerçevenin şeklini, çizimlerini, renklerini ve yazı tipini belirler: Dynasty'de pagoda çatısı ve püsküller, Rift'te altın süslemeler ve turkuaz taşlar, Blocks'ta çimen blokları ve eşya çubuğu. Sohbet Kutusu'na, Yayın Uyarıları'na ve Abone Hedefi'ne de aynı preset'i verirsen ekrandaki her şey aynı stilde durur.",
        p2: "Animasyonlar açıkken çerçevenin etrafında ışıklar döner, çizgiler parlar, preset'e göre fenerler, meşaleler ya da kıvılcımlar hareket eder. Bunlar hafif tutuldu. Yine de oyunla birlikte bilgisayarın zorlanıyorsa Animasyonlar'ı kapat, URL'ye `motion=0` eklenir ve çerçeve sabit durur.",
        p3: 'Çizimlerin hepsi sıfırdan çizildi, oyun logosu ya da görseli içermez.',
      },
      change: {
        title: 'Çerçeveyi sonradan nasıl değiştiririm?',
        p1: "OBS'teki URL'yi kurulum sayfasındaki Widget URL alanına yapıştır, ayarların geri gelir. Preset'i, parçayı ya da yazıyı değiştir, yeni URL'yi kopyala ve Tarayıcı Kaynağı'ndaki eskisinin yerine yapıştır. Bütün widget'larının preset'ini birden değiştirmek için [Preset'ler sayfasını](/presets) kullanabilirsin.",
      },
      ctaTitle: 'Çerçeveni hazırla',
      ctaText: "Parçayı ve preset'i seç, önizlemede gör, URL'yi kopyala.",
    },
    alerts: {
      title: "OBS'e Twitch ve Kick için abonelik, cheer ve raid uyarıları nasıl eklenir?",
      short: 'Yayın uyarıları ekleme',
      summary:
        "Hangi platformda hangi uyarıların çıktığı, temalar ve renkler, en az miktarlar, sesi OBS'e alma ve neden takip uyarısı olmadığı.",
      lead: "Yayın Uyarıları, Twitch ve Kick'teki her abonelik, hediye abonelik, Bits cheer'ı, Kicks hediyesi ve raid için kendi sesiyle animasyonlu bir uyarı gösterir. Kurulum sayfasında kanal adlarını yaz, bir tema seç ve URL'yi OBS'e 800 × 450 boyutunda Tarayıcı Kaynağı olarak ekle. Giriş gerekmez, tek URL iki platformu da kapsar.",
      setup: {
        title: "Yayın uyarıları OBS'e nasıl eklenir?",
        step1: '[Yayın Uyarıları kurulum sayfasını](/setup/stream-alerts) aç.',
        step2: "Twitch, Kick ya da İkisi'ni seç ve sadece kanal adlarını yaz.",
        step3: 'Bir tema ve renk seç, istemediğin uyarıları kapat.',
        step4:
          "URL'yi kopyala, OBS'e 800 × 450 boyutunda Tarayıcı Kaynağı olarak ekle ve kaynağı uyarıların çıkacağı yere taşı.",
        step5:
          'Sesin yayına gitmesi için kaynak özelliklerinde "OBS ile sesi kontrol etme" (Control audio via OBS) seçeneğini aç. Ses konusu aşağıda ayrıca anlatılıyor.',
        p1: "Uyarılar arasında kaynak boş ve şeffaftır. URL'yi kontrol etmek için bir tarayıcı sekmesinde açarsan kanalında bir şey olana kadar boş bir sayfa görürsün.",
        p2: "Sonradan değiştirmek için mevcut URL'ni kurulum sayfasındaki Widget URL alanına yapıştır. Kanalların ve ayarların geri gelir, yeni URL'yi kopyalayıp OBS'teki eskisinin yerine yapıştır.",
      },
      kinds: {
        title: 'Hangi uyarılar var?',
        caption: "Yayın Uyarıları'nın Twitch ve Kick'te gösterdiği olaylar",
        colAlert: 'Uyarı',
        sub: 'Abonelikler',
        subTwitch: 'Yeni abonelikler ve paylaşılan yenilemeler, ay sayısı ve mesajla birlikte',
        subKick:
          'Yeni abonelikler ve yenilemeler, Kick gönderdiğinde ay sayısıyla, bir de sohbette paylaşılan yenilemeler',
        gift: 'Hediye Abonelikler',
        giftBoth: 'Her hediye için tek uyarı, hediye edenin adı ve abonelik sayısıyla',
        bits: 'Bits ve Kicks',
        bitsTwitch: "Bits cheer'ları, miktar ve mesajla birlikte",
        bitsKick: 'Kicks, miktar ve mesajla birlikte',
        raid: "Raid'ler",
        raidTwitch: 'Raid atan kanal ve kaç izleyiciyle geldiği',
        raidKick: 'Raid atan kanal, Kick gönderirse izleyici sayısı da',
        p1: "50'li bir hediye abonelik 50 değil, tek uyarı olarak çıkar, hediyeyi alanlar için de ayrıca uyarı çıkmaz. Anonim hediyede isim olarak Anonim yazar. Tier'lar gösterilmez: Prime, Tier 1, Tier 2 ya da Tier 3 abonelik aynı uyarıyı alır.",
        p2: "Kick çoğu abonelikte ay sayısını gönderir ama bazı kanallara hiç göndermez, o zaman uyarıda sadece abone olduğu yazar. Kick'te bir izleyici yenilemesini sonradan sohbette paylaşırsa bunun için ay sayısı ve mesajla ayrı bir uyarı çıkar, yani tek bir Kick yenilemesi iki kez görünebilir. Twitch'te yenileme sohbete ancak izleyici paylaşınca düşer, o yüzden bir kez görünür.",
        p3: "Twitch Shared Chat oturumunda sohbeti paylaştığın diğer kanallara gelen abonelik, hediye, cheer ve raid'ler görünmez. Uyarı sadece kendi kanalın için çıkar.",
      },
      follows: {
        title: 'Neden takip ya da bağış uyarısı yok?',
        p1: 'Twitch ve Kick, giriş yapılmamış bir sayfaya yeni takipçileri göstermiyor, iki platformun da kendine ait bir bağış sistemi yok. Yayın Uyarıları sadece iki platformun her izleyiciye gönderdiği bilgileri kullanır. Bu yüzden giriş istemeden ve iki platformda da aynı şekilde çalışır.',
      },
      look: {
        title: 'Hangi temalar ve renkler var?',
        neon: 'Neon (varsayılan): synth sesleriyle köşeli, bilim kurgu tarzı bir şerit. Giderken bir neon tabela gibi titreyip söner.',
        celestial: 'Göksel: yıldızların altında lacivert bir kart, ince bir çerçeve ve çan sesleriyle.',
        p1: "Renk, uyarının vurgu rengi. Varsayılan Platform seçeneğinde Twitch uyarıları mor, Kick uyarıları yeşil görünür. İstersen bütün uyarılar için tek bir renk de seçebilirsin: mavi, mor, pembe, kırmızı, altın ya da yeşil. URL'de iki kanal da varsa küçük bir TWITCH ya da KICK etiketi uyarının nereden geldiğini gösterir.",
        p2: "Her uyarının başlığını en fazla 24 karakter olacak şekilde değiştirebilir ya da boş bırakıp Yeni Abone gibi varsayılanı kullanabilirsin. Neon başlıkları büyük harfle yazar. Uyarı Dili, uyarıdaki kelimelerin dilini belirler: İngilizce ya da Türkçe. Bu seçim URL'de saklanır, OBS hangi dilde olursa olsun değişmez.",
      },
      min: {
        title: "Küçük hediye, cheer ve raid'ler nasıl atlanır?",
        caption: "Yayın Uyarıları'nda en az miktarlar",
        colSetting: 'Ayar',
        colDefault: 'Varsayılan',
        colRange: 'Aralık',
        gift: 'En Az Abonelik (hediye abonelik)',
        giftRange: '1 ile 100.000 arası',
        bits: 'En Az Miktar (Bits ya da Kicks)',
        bitsRange: '1 ile 100.000 arası',
        raid: "En Az İzleyici (raid'ler)",
        raidRange: '0 ile 100.000 arası',
        p1: "En az değerin altında kalanlar için uyarı çıkmaz. Tek bir En Az Miktar hem Bits hem Kicks için geçerli, aboneliklerde ise alt sınır yok. Kick bir raid'i izleyici sayısı olmadan gönderirse 0 izleyici sayılır, yani En Az İzleyici 1 ya da daha fazlaysa o raid atlanır.",
      },
      queue: {
        title: 'Aynı anda çok sayıda uyarı gelirse ne olur?',
        p1: 'Uyarılar sıralarını bekler ve geldikleri sırayla, aralarında kısa bir boşlukla tek tek gösterilir. Her birinin ne kadar kalacağını Ekranda Kalma Süresi belirler: 3 ile 20 saniye arası, varsayılan 7. Sırada en fazla 30 uyarı bekleyebilir, daha fazlası birikirse en yeni gelenler atlanır.',
        p2: "Varsayılan olarak açık olan İzleyici Mesajını Göster, izleyicinin yenilemesiyle, Bits'iyle ya da Kicks'iyle birlikte yazdığı mesajı gösterir. Linkler çıkarılır, uzun mesajlar kısaltılır, böylece kimse yayınına link koyamaz.",
      },
      sound: {
        title: "Uyarı sesi OBS'e nasıl alınır?",
        step1:
          'Yayın Uyarıları kaynağına çift tıkla, "OBS ile sesi kontrol etme" (Control audio via OBS) kutusunu işaretle ve Tamam\'a bas. Kaynak artık Ses Karıştırıcı\'da (Audio Mixer) görünür.',
        step2:
          "Üst menüden Düzenle → Gelişmiş Ses Özellikleri'ni aç (Edit → Advanced Audio Properties).",
        step3:
          'Uyarıları sen de duymak istiyorsan kaynağın Ses İzleme ayarını "İzleme Aktif Edildi" (Monitoring Enabled) yap. Eski OBS sürümlerinde bu seçeneğin adı Monitor and Output.',
        p1: "Ses Seviyesi 0 ile 100 arasında, varsayılan 50, 0 da sesi kapatır. Her uyarının temaya uyan kendi kısa sesi var: Neon'da synth, Göksel'de çan sesleri. OBS sesi kendiliğinden çalar, normal bir tarayıcı sekmesinde ise sayfaya bir kez tıklayana kadar ses çıkmaz.",
      },
      test: {
        title: 'Uyarılar yayından önce nasıl denenir?',
        p1: 'Kurulum sayfasındaki önizlemede sessiz örnek uyarılar gelir. Altındaki Dene düğmeleri abonelik, hediye, Bits/Kicks ve raid uyarısını seçtiğin ses seviyesinde, sesiyle birlikte oynatır. Böylece temayı seçmeden önce görüp duyabilirsin.',
        warnTitle: "Dene düğmeleri OBS'e ulaşmaz",
        warn: "Sadece kurulum sayfasındaki önizlemede çalışırlar. OBS'teki kaynak yalnızca kanalına gelen gerçek abonelik, hediye, cheer ve raid'leri gösterir, yani ona deneme uyarısı gönderemezsin.",
        p2: 'Kaynağın olduğu sahne açık kalsın ve "Görünür olmadığında kaynağı kapat" kapalı dursun. Kaynak kapalıyken gelen uyarılar kaçırılır, sonradan da gösterilmez.',
      },
      ctaTitle: "Yayın Uyarıları'nı kur",
      ctaText: "Kanallarını yaz, bir tema seç, URL'yi kopyala. Sıradaki abonen için uyarı hazır.",
    },
    reader: {
      title: "Twitch ve Kick sohbeti tek pencerede ya da OBS dock'unda nasıl okunur?",
      short: "Sohbeti OBS dock'unda okuma",
      summary:
        "Sohbet Okuyucu'yu açma, OBS'e dock olarak ekleme, bağlantı kopunca ne olduğu ve sayfayı yenileyince sohbetin nasıl korunduğu.",
      lead: "Sohbet Okuyucu, Twitch ve Kick sohbetini bir tarayıcı sekmesinde ya da OBS dock'unda tek listede gösterir, böylece yayın yaparken sohbeti okuyabilirsin. Sohbet Kutusu kurulum sayfasındaki Sohbet Okuyucu'yu Aç düğmesiyle açılır. Bağlantı koparsa kendi kendine yeniden bağlanır, her kopmayı listeye not düşer ve sayfayı yenilesen de sohbetin kaybolmaz.",
      open: {
        title: 'Sohbet Okuyucu nasıl açılır?',
        step1:
          '[Sohbet Kutusu kurulum sayfasını](/setup/chat-widget) aç ve Twitch kanalını, Kick kanalını ya da ikisini birden yaz.',
        step2: "Widget URL alanının altındaki Sohbet Okuyucu'yu Aç düğmesine tıkla. Okuyucu yeni bir sekmede açılır.",
        step3: 'Bir dahaki sefere aynı okuyucuyu açmak için sekmeyi yer imlerine ekle ya da adresini bir yere kaydet.',
        p1: "Okuyucu, kanalları ve birkaç Sohbet Kutusu ayarını da yanına alır: emote sağlayıcıları, rozetler, Botları Gizle, Komutları Gizle ve Vurgular. Yazı tipi, düzen, animasyon ve diğer görünüm ayarları overlay'de kalır, okuyucunun kendi yazı boyutu ve saat ayarı var. Aldığı ayarları değiştirmek için onları kurulum sayfasında değiştir ve okuyucuyu yeniden aç.",
      },
      dock: {
        title: "Sohbet Okuyucu OBS'e dock olarak nasıl eklenir?",
        step1: "Sohbet Okuyucu'yu aç ve adres çubuğundaki adresi kopyala.",
        step2:
          "OBS'te üst menüden Paneller → Özel Tarayıcı Yuvaları'nı aç (Docks → Custom Browser Docks). Eski sürümlerde bu menü Görünüm → Paneller (View → Docks) altında.",
        step3: "Yuva Adı sütununa Sohbet gibi bir ad yaz, adresi URL sütununa yapıştır ve Uygula'ya bas.",
        step4: "Yeni dock'u OBS penceresinde istediğin yere sürükle.",
        p1: "OBS'in kendi tarayıcı depolaması var, bu yüzden dock'un geçmişi ve ayarları normal tarayıcındakinden ayrı tutulur.",
      },
      shows: {
        title: 'Sohbet Okuyucu neler gösterir?',
        p1: "İki sohbetten gelen mesajları geldikleri sırayla tek listede gösterir. İki kanal da girildiyse her mesajın yanında nereden geldiğini gösteren bir Twitch ya da Kick simgesi olur. Emote'lar, rozetler ve kullanıcı adı renkleri Sohbet Kutusu'ndakiyle aynı görünür.",
        p2: 'Silinen mesajlar listede kalır, üstü çizilir ve yanına (silindi) yazılır, böylece neyin kaldırıldığını yine görürsün. Biri susturulur ya da banlanırsa önceki mesajları da aynı şekilde işaretlenir. Bir mod sohbeti temizlerse listeye bunu söyleyen bir satır düşer.',
        p3: 'A- ve A+ yazı boyutunu 12 ile 28 piksel arasında değiştirir, varsayılan 15. Saat düğmesi mesaj saatlerini gösterir ya da gizler, çöp kutusu düğmesi de ikinci tıklamada geçmişi temizler. Okuyucu yazı boyutunu ve saat ayarını hatırlar.',
        p4: 'Bir şey okumak için yukarı kaydırırsan liste akmayı bırakır. Alttaki düğme yeni mesajları sayar, ona tıklayınca canlı sohbete geri dönersin.',
      },
      drops: {
        title: 'Bağlantı koparsa ne olur?',
        p1: 'Her kanalın durumu en üstte yazar: Bağlanıyor, Bağlı ya da Yeniden bağlanıyor. Kick adı bulunamazsa Kanal bulunamadı yazar. Bir sohbet bağlantısı koptuğunda bir uyarı bir sonraki denemeye kalan süreyi sayar, Şimdi dene düğmesi de hemen tekrar dener. Denemeler 1 saniye arayla başlar, sonra yavaşlayıp 30 saniyede bire iner.',
        p2: 'Okuyucu, kapanmadan sessizce susan bağlantıları da yakalar. Bu, bir ağ kesintisinden sonra olabiliyor. 30 saniye boyunca hiçbir şey gelmezse sohbetin hâlâ orada olup olmadığını kontrol eder, cevap gelmezse yeniden bağlanır. Bilgisayarının internet bağlantısı giderse bunu sana söyler ve internet gelir gelmez yeniden bağlanır.',
        p3: 'Her kopma listeye yazılır, örneğin "Twitch sohbet bağlantısı koptu" ve "12 sn sonra Twitch sohbetine tekrar bağlanıldı". Böylece hangi aralıkta mesaj eksik olabileceğini tam olarak bilirsin.',
      },
      history: {
        title: 'Sayfayı yenileyince sohbet kaybolur mu?',
        p1: 'Hayır. Okuyucu son 1000 satırı tarayıcına kaydeder ve yeniden açtığında geri getirir. Ardından "Son ziyaretinden kalan mesajlar, son kayıt:" yazan ve saati gösteren bir satır gelir. 12 saatten eski satırlar silinir.',
        p2: 'Okuyucu kapalıyken yazılan mesajlar geri gelmez: o satırın üstündeki her şey son ziyaretinden, altındaki her şey yeni. Geçmiş, kanallara göre ayrı tutulur ve Geçmişi temizle o geçmişi siler.',
      },
      limits: {
        title: 'Sohbet Okuyucu neleri yapamaz?',
        send: 'Mesaj gönderemez, moderasyon yapamaz. Sohbeti giriş yapmamış bir izleyici gibi anonim olarak okur.',
        events:
          'Abonelik, hediye ya da raid bildirimlerini göstermez. Bunlar için yayınına [Yayın Uyarıları](/setup/stream-alerts) ekle.',
        missed: 'Kapalıyken yazılan mesajları iki platformda da geri getiremez.',
      },
      ctaTitle: "Sohbet Okuyucu'yu aç",
      ctaText: "Sohbet Kutusu kurulum sayfasında kanallarını yaz ve Sohbet Okuyucu'yu Aç'a tıkla.",
    },
  },
  presets: {
    classic: 'Klasik',
    classicTag: "Her widget'ın kendi görünümü",
    breadcrumb: "Preset'ler",
    eyebrow: "Preset'ler",
    title: "Yayın overlay'lerin için oyun preset'leri",
    lead: "Seçtiğin preset'le Sohbet Kutusu, Yayın Uyarıları, Abone Hedefi, Subathon Timer, Sohbet Anketi, Çekiliş kazanan overlay'i ve Yayın Çerçeveleri aynı çerçeveyi, yazı tiplerini ve renkleri alır. İstersen hepsinde aynısını kullan, istersen her birinde başka birini.",
    pickTitle: 'Bir preset seç',
    by: 'Hazırlayan: {author}',
    community: 'Topluluk',
    makeDefault: "{name} preset'ini her widget'ta kullan",
    isDefault: "{name} varsayılan preset'in",
    defaultHint:
      "Bu tarayıcıdaki her kurulum sayfası varsayılan preset'inle açılır. Yine de her widget'ta başka bir preset seçebilirsin.",
    previewTitle: "Her widget'ta {name}",
    setUp: '{widget} kurulumu',
    previewIframeTitle: "{name} preset'iyle {widget} önizlemesi",
    descriptions: {
      classic:
        "Widget'ların orijinal görünümü: neon Yayın Uyarıları, mor Abone Hedefi barı ve sade Sohbet Kutusu yazısı. Renkleri sen seçersin.",
      rift: 'Elmas süslemeli ince altın çerçeveler, koyu lacivert paneller, parlayan turkuaz barlar ve Cinzel başlıklar.',
      realm:
        'Perçinli bronz ve altın çerçeveler, koyu deri paneller, legendary turuncusu barlar ve Marcellus başlıklar.',
      dynasty:
        'Altın köşebentli kırmızı lake çerçeveler, koyu ahşap paneller, kan kırmızısı barlar ve Zen Antique başlıklar.',
      ancient: 'Bronz köşeli koyu demir çerçeveler, alt kenarda kırmızı bir parıltı ve keskin Grenze başlıklar.',
      agent: 'Koyu antrasit zeminde kesik köşeler, kırmızı bir kenar, eğik barlar ve uzun Teko rakamları.',
      defuse: 'HUD tarzı köşe işaretleri, kehribar rengi bir üst çizgi, barlarda ikaz şeritleri ve dar Saira yazı tipi.',
      blocks: 'Çimen ve toprak renginde piksel çerçeveler, bloklara bölünmüş yeşil barlar ve Jersey 10 piksel yazı tipi.',
    },
    existingTitle: "OBS'te zaten widget'ların var mı?",
    existingText:
      "URL'lerini buraya alt alta yapıştır, {name} preset'iyle güncellenmiş hallerini kopyala. Sonra her birini OBS'te kendi tarayıcı kaynağının URL alanına yapıştır. URL'deki diğer ayarlar olduğu gibi kalır.",
    existingLabel: "Widget URL'leri",
    existingResult: "{name} preset'iyle URL'lerin",
    existingUnsupported: 'Preset desteklemiyor, olduğu gibi bırakıldı',
    existingInvalid: "Senchabot widget URL'si değil",
    communityTitle: "Kendi preset'ini yap",
    communityText:
      "Bir preset tek bir küçük JSON dosyası: dokuz renk, iki Google Fonts yazı tipi ve bir çerçeve stili. Seninkini GitHub'da pull request olarak gönder. Kabul edilince burada ve bütün kurulum sayfalarında senin adınla görünür.",
    communityLink: 'Preset nasıl yapılır?',
    communityEmpty: "Henüz topluluk preset'i yok. İlki seninki olabilir.",
    disclaimer:
      "Oyun adları, sahiplerinin markalarıdır. Bu preset'ler oyun görseli içermeyen, hayran yapımı renk, yazı tipi ve çizim stilleridir. Oyun yapımcılarıyla bir bağlantıları yok, onlar tarafından onaylanmış da değiller.",
    faqTitle: "Preset'ler hakkında sorular",
    faq1Q: "Preset'ler OBS'e eklediğim widget'ları da değiştirir mi?",
    faq1A:
      "Hayır. Widget'ın görünümü URL'sinin bir parçası, yani OBS'teki widget yeni bir URL alana kadar aynı görünür. URL'lerini yukarıdaki kutuya yapıştır, preset eklenmiş hallerini al.",
    faq2Q: "Her widget'ta farklı bir preset kullanabilir miyim?",
    faq2A:
      "Evet. Varsayılan preset sadece kurulum sayfalarının hangi preset'le açılacağını belirler. Herhangi bir widget'ın kurulum sayfasında başka bir preset seçebilirsin, o preset de o widget'ın URL'sine yazılır.",
    faq3Q: "Hangi widget'lar preset destekliyor?",
    faq3A:
      "Sohbet Kutusu, Yayın Uyarıları, Abone Hedefi, Subathon Timer, Sohbet Anketi, Çekiliş kazanan overlay'i ve Yayın Çerçeveleri. Emote Duvarı sadece emote gösterdiği, Sub Sprout da kendi bitkilerini çizdiği için ikisi kendi görünümünde kalır.",
    faq4Q: 'Bunlar oyunların resmi görünümleri mi?',
    faq4A:
      'Hayır. Renklerden, ücretsiz Google Fonts yazı tiplerinden ve sıfırdan çizilmiş süslemelerden oluşan hayran yapımı stiller. Oyun logosu ya da görseli içermezler, oyun yapımcılarıyla da bir bağlantıları yok.',
    field: {
      label: 'Preset',
      tip: "Bu widget için hazır bir görünüm, yani çerçeve, yazı tipleri ve renkler. Widget'ların birbirine uysun istiyorsan hepsinde aynı preset'i seç.",
      browse: "Tüm preset'ler",
      owns: "Renkler ve yazı tipleri {name} preset'inden geliyor.",
      makeDefault: "{name} preset'ini varsayılan yap",
      makeDefaultTip: "Bu tarayıcıdaki bütün kurulum sayfaları bu preset'le açılır.",
      isDefault: "Varsayılan preset'in",
    },
  },
  faqPage: {
    breadcrumb: 'SSS',
    title: 'Sık sorulan sorular',
    lead: "Senchabot Extensions'ın ücreti, gizliliği, desteklenen platformlar ve widget adresleri hakkında kısa cevaplar. Belirli bir widget'ın kurulumu için [rehberlere](/guides) bak.",
    groups: {
      basics: 'Ücret ve hesap',
      platforms: 'Programlar ve platformlar',
      urls: 'Widget adresin ve gizlilik',
      help: 'Destek',
    },
    freeQ: 'Senchabot Extensions ücretsiz mi?',
    freeA:
      "Evet. Dokuz widget'ın ve aracın hepsi ücretsiz: Sohbet Kutusu, Emote Duvarı, Sub Sprout, Subathon Timer, Yayın Uyarıları, Abone Hedefi, Sohbet Anketi, Çekiliş ve OBS Bridge. Ücretli paket, filigran ya da premium hesap yok. Kaynak kodu GPL-3.0 lisansıyla GitHub'da açık.",
    loginQ: '"Giriş gerektirmez" ne demek?',
    loginA:
      "Bu sitede hesap açmazsın, Twitch ya da Kick ile giriş yapmazsın ve bir şey indirmezsin. Kanal adını yazarsın, kurulum sayfası sana bir adres verir. Widget'lar herkese açık sohbeti anonim olarak okur: Twitch'e isimsiz bir izleyici gibi bağlanır, Kick'te herkese açık sohbet akışını dinler. Bu yüzden sohbete yazamaz, moderasyon yapamaz ve hesabındaki özel bilgilere erişemez.",
    affiliatedQ: "Senchabot Extensions'ın Twitch ya da Kick ile bir bağı var mı?",
    affiliatedA:
      "Hayır. Senchabot Extensions'ı, Twitch, Discord, Kick ve YouTube için açık kaynak bir topluluk botu olan Senchabot geliştiriyor. Twitch ya da Kick ile resmi bir bağlantısı, ortaklığı ya da onayı yok.",
    appsQ: 'Hangi yayın programlarıyla çalışır?',
    appsA:
      'OBS Studio ve tarayıcı kaynağı (browser source) destekleyen diğer yayın programlarıyla. Her widget bir web adresi olarak çalışır, kaynağa bu adresi yapıştırırsın. Rehberlerimiz OBS Studio için yazıldı.',
    platformsQ: "Hangi widget'lar Twitch'i, hangileri Kick'i destekliyor?",
    platformsA:
      "Dokuzu da iki platformu destekliyor. Sohbet Kutusu, Emote Duvarı, Sub Sprout, Subathon Timer, Yayın Uyarıları, Abone Hedefi ve Sohbet Anketi tek adreste Twitch ve Kick kanalını birlikte dinler. OBS Bridge iki sohbetten gelen komutları dinler ve her yetkili kullanıcı kendi platformuyla eklenir. Çekiliş her seferinde tek platformda çalışır, Twitch ya da Kick. Sohbet Kutusu'nda 7TV emote'ları iki platformda, BTTV ve FFZ emote'ları sadece Twitch'te görünür.",
    editQ: "Widget'ı sonradan nasıl değiştiririm?",
    editA:
      "Kurulum sayfasında ayarları değiştir, yeni adresi kopyala ve OBS'te kaynağın URL alanındaki eski adresin yerine yapıştır. Sohbet Kutusu, Emote Duvarı, Sub Sprout, Subathon Timer, Yayın Uyarıları, Abone Hedefi, Sohbet Anketi ve Yayın Çerçeveleri'nde eski adresini kurulum sayfasındaki Widget URL alanına yapıştırırsan bütün ayarların geri yüklenir, baştan başlaman gerekmez.",
    oldUrlsQ: 'Eski widget adreslerim çalışmaya devam eder mi?',
    oldUrlsA:
      "Evet. Güncellemeler mevcut adresleri bozmayacak şekilde yapılır: parametre adları, değerleri ve varsayılanları değişmez. Örneğin Sohbet Kutusu'ndaki eski keep=true hâlâ Süresiz anlamına gelir ve Sub Sprout eski channel ve platform parametrelerini hâlâ okur.",
    privacyQ: 'Ayarlarım nerede duruyor, hangi veriler nereye gidiyor?',
    privacyA:
      "Ayarların bir hesapta ya da veritabanında değil, widget adresinin içinde durur. Bu yüzden adresi bilen herkes aynı widget'ı açabilir. Her sitede olduğu gibi açtığın sayfa adresi barındırma altyapımıza ulaşır ve istek kayıtlarında görünebilir. Widget'lar sohbeti doğrudan Twitch ve Kick'ten anonim olarak okur, emote'ları 7TV, BetterTTV ve FrankerFaceZ'den, Twitch kanal bilgisini ivr.fi'den alır. Çekiliş katılımcıları ve kazananları kendi tarayıcında kalır. OBS Bridge adresinde OBS WebSocket şifren bulunduğu için onu şifre gibi sakla.",
    emptyQ: "Widget'ım OBS'te neden boş görünüyor?",
    emptyA:
      'Sohbet Kutusu ve Emote Duvarı sohbette bir şey olana kadar şeffaf ve boştur, önce sohbete bir mesaj yaz. Hâlâ bir şey yoksa kanal alanına link değil sadece kanal adını yazdığından ve adın doğru olduğundan emin ol. Ayrıntılı kontrol listesi OBS rehberinde.',
    bugQ: 'Widget istemek ya da hata bildirmek için ne yapmalıyım?',
    bugA: "GitHub'daki senchabot-opensource/monorepo deposunda yeni bir issue aç. Hata bildirirken widget adresini (şifre içeriyorsa şifreyi silerek), kullandığın yayın programını ve ne gördüğünü yaz. Fikirler için GitHub Discussions'ı ya da Senchabot Discord sunucusunu da kullanabilirsin.",
    ctaTitle: 'Cevabını bulamadın mı?',
    ctaText:
      "Rehberlerde adım adım kurulum ve sorun giderme var. Hâlâ takıldıysan GitHub'da bize yaz.",
    ctaGuides: 'Rehberlere git',
    ctaIssue: "GitHub'da issue aç",
  },
  changelog: {
    breadcrumb: 'Yenilikler',
    title: 'Yenilikler',
    lead: "Senchabot Extensions'a eklenen özellikler ve düzeltilen hatalar, en yenisi en üstte. Liste projenin [GitHub'daki](https://github.com/senchabot-opensource/monorepo/commits/dev/apps/extensions) commit geçmişinden hazırlanıyor.",
    site: 'Site',
    entries: {
      frames:
        "Yeni Yayın Çerçeveleri: kameran, sohbetin ve bütün yayın ekranın için hazır çerçeveler. Her preset kendi çizimleriyle gelir, Dynasty'de pagoda çatısı ve fenerler, Blocks'ta piksel bloklar.",
      subathonRates:
        "Subathon Timer artık bir aboneliğin, hediye aboneliğin ve 500 Bits ya da Kicks'in ne kadar süre eklediğini sayaçta gösterebiliyor, böylece izleyiciler aboneliklerinin kaç dakika eklediğini biliyor.",
      presets:
        "Preset'ler geldi: tek bir preset seçip Sohbet Kutusu, Yayın Uyarıları, Abone Hedefi, Subathon Timer, Sohbet Anketi ve Çekiliş kazanan overlay'ine aynı görünümü veriyorsun. League of Legends, World of Warcraft, Metin2, Dota 2, Valorant, CS2 ve Minecraft için oyun preset'leri de hazır.",
      poll: "Sohbet Anketi geldi: sohbetten !poll ile anket başlatıyorsun, Twitch ve Kick'teki izleyiciler de numara yazarak oy veriyor. Canlı barlar, geri sayım, izleyici başına tek oy ve sonunda kazanan var.",
      goal: "Abone Hedefi geldi: Twitch ve Kick'teki her abonelik, yenileme ve hediye abonelik hedef barına 1 ekliyor, hedefe ulaşınca bara bir kupa iniyor. Modlar sayıyı !goal ile düzeltebiliyor.",
      streamAlerts:
        "Yayın Uyarıları geldi: Twitch ve Kick'teki her abonelik, hediye abonelik, Bits, Kicks ve raid için kendi sesiyle animasyonlu bir uyarı çıkıyor. Rengi seçebilir, başlıkları değiştirebilir ve en az miktarları belirleyebilirsin.",
      subathon:
        'Subathon Timer geldi: abonelik, hediye abonelik, Bits ve Kicks geldikçe uzayan geri sayımı can barı, saat ya da halka olarak gösteriyor. Hangisinin ne kadar süre ekleyeceğini sen seçiyorsun, modlar da sayacı !subathon ile yönetiyor.',
      chatReader:
        "Sohbet Okuyucu geldi: Twitch ve Kick sohbetini bir tarayıcı sekmesinde ya da OBS'te dock olarak okuyabiliyorsun. Bağlantı koparsa geri sayımla kendiliğinden yeniden bağlanıyor, her kopmayı sohbette işaretliyor ve sayfayı yenilesen de geçmişi kaybetmiyor.",
      chatSilentDrop:
        'Sohbet Kutusu, Emote Duvarı ve OBS Bridge, internet kesintisinden sonra sohbet bağlantısı sustuğunda bunu fark ediyor ve internet geri gelir gelmez kendiliğinden yeniden bağlanıyor. Önceden bu dakikalar sürebiliyor ya da sayfayı yenilemek gerekiyordu.',
      contentPages: 'Rehberler, sık sorulan sorular sayfası ve bu yenilikler listesi eklendi.',
      siteNav:
        'Her sayfada aynı üst menü ve alt bilgi var: widget menüsü, dil ve tema seçimi, rehber ve destek bağlantıları.',
      notFound: "Olmayan bir adrese gidersen her widget'a bağlantı veren bir 404 sayfası açılıyor.",
      geist:
        "Site sayfaları senchabot.com ile aynı yazı tipi olan Geist'i kullanıyor. Overlay'lerin yazı tipleri değişmedi.",
      chatNextSteps:
        "Sohbet Kutusu adresini kopyaladığında kurulum sayfası OBS'e ekleme adımlarını önerilen boyutla gösteriyor.",
      raffleMonthsInput:
        "Çekiliş'te Minimum Abonelik Ayı alanı yazarken silinebiliyor, 6 yazmak isterken 16 çıkmıyor.",
      raffleKeywordRequired:
        'Çekiliş, giriş anahtar kelimesi boşken başlatılamıyor. Önceden kimsenin katılamayacağı bir çekiliş açılabiliyordu.',
      raffleMonthsSubsOnly:
        'Minimum Abonelik Ayı sadece Sadece Aboneler açıkken uygulanıyor ve yayıncı kendi çekilişine girebiliyor.',
      sproutPreviewSimulate:
        'Sub Sprout kurulum önizlemesi kanal yazdıktan sonra da büyümeyi canlandırıyor, seçtiğin bitkiyi ve efektleri hemen görüyorsun.',
      sproutPreviewTint:
        'Sub Sprout önizleme alanı düz siyah yerine olması gereken hafif şeffaf zeminle görünüyor.',
      emoteWallUrl:
        'Emote Duvarı kurulumu, boş bırakılan Süre ve Maks. alanları için adrese yanlış değer yazmıyor ve kanalsız adres üretmiyor.',
      bridgePassword:
        "OBS Bridge, WebSocket URL'si boşken de şifreyi gönderiyor. OBS aynı bilgisayardayken şifreli bağlantı artık kuruluyor.",
      chatFilters:
        'Sohbet Kutusu botları ve ! ile başlayan komutları gizleyebiliyor, mesajları 10 saniyeden 5 dakikaya kadar ya da süresiz tutabiliyor, emote sağlayıcılarını tek tek seçebiliyorsun.',
      chatEmoteProviders:
        "Sohbet Kutusu Twitch mesajlarında 7TV, BTTV ve FFZ emote'larını, Kick mesajlarında 7TV emote'larını gösteriyor.",
      sproutKickGifts:
        "Sub Sprout Kick'teki hediye aboneliklerle büyüyor, hediye edilen her abonelik bir aşama sayılıyor.",
      bridgeUserPlatform:
        'OBS Bridge yetkili kullanıcıları platformuyla birlikte kaydediyor. Diğer platformda aynı adı alan biri artık komut kullanamıyor.',
      sevenTvActiveSet:
        "Sohbet Kutusu ve Emote Duvarı 7TV emote'larını kanalın kendi aktif setinden alıyor. Önceden benzer isimli başka bir hesabın emote'ları görünebiliyordu.",
      chatColorCrash:
        'Sohbet Kutusu, alışılmadık bir renk değeri taşıyan mesajlarda artık hata ekranına düşmüyor.',
      bridgeReconnect:
        'OBS Bridge, OBS kapalıyken ya da şifre yanlışken 5 saniyede bir tek deneme yapıyor. Bağlantı denemeleri artık katlanarak artmıyor.',
      raffleFakeEntries:
        'Çekiliş, abonelik mesajlarına gizlenmiş sahte satırları katılım saymıyor. Bu yolla Sadece Aboneler kuralı aşılamıyor.',
      chatIrcParsing:
        "Sohbete yazılan bir metin artık Sohbet Kutusu'nu temizleyemiyor. Bir susturma ya da ban sadece o kişinin mesajlarını kaldırıyor.",
      chatHighlights:
        'Sohbet Kutusu seni etiketleyen mesajları, yanıtları, sohbete ilk katılanları, duyuruları ve Mesajınızı Vurgulayın mesajlarını vurguluyor. Hangilerinin açık olacağını kurulumda seçiyorsun.',
      chatPasteUrl:
        'Sohbet Kutusu kurulumuna mevcut widget adresini yapıştırınca bütün ayarlar geri yükleniyor.',
      chatSingleScreen:
        'Sohbet Kutusu kurulum sayfası tek ekrana sığan yeni bir düzene geçti. Ayarlar Kanal, Görünüm ve Mesajlar başlıklarında toplandı.',
      chatIconAlign: "Sohbet Kutusu'ndaki Twitch ve Kick simgeleri aynı boyutta ve aynı hizada.",
      chatHideIndicator:
        "Sohbet Kutusu'nda platform göstergesi tamamen gizlenebiliyor, renk şeridi tek başına yeterliyse.",
      chatSmoothSpeed:
        "Sohbet Kutusu'na Sağdan yumuşakça kayarak gir animasyonu, kurulum önizlemesine de sohbet hızı ayarı eklendi.",
      chatAdaptiveAnimations:
        'Sohbet Kutusu animasyonları sohbet hızlandıkça kısalıyor. Varsayılan Sağdan kayarak gir eskisi gibi görünüyor.',
      chatTypewriter:
        "Sohbet Kutusu'na Daktilo animasyonu geldi. Yeni mesaj gelince eski mesajlar zıplamak yerine kayarak yer açıyor.",
      chatPlatformStripe:
        "Sohbet Kutusu'nda platform simgeleri büyüdü ve her mesajın soluna platform renginde bir şerit eklenebiliyor.",
      emoteWallModes:
        "Emote Duvarı'na kenarlardan seken Sekme modu, sadece hype modu ve emote spam engeli eklendi.",
      sproutPotLabel: 'Sub Sprout saksının üstünde 3/10 gibi bir aşama etiketi gösterebiliyor.',
      emoteWallLaunch:
        "Emote Duvarı geldi: sadece emote'tan oluşan Twitch ve Kick mesajları Sakin ya da Kaos modunda ekranda uçuşuyor.",
      sproutBothPlatforms:
        'Sub Sprout tek adreste Twitch ve Kick kanalını birlikte dinliyor. Eski channel ve platform adresleri çalışmaya devam ediyor.',
      chatPreviewMock:
        'Sohbet Kutusu önizlemesi kanal yazdıktan sonra da örnek sohbet oynatıyor, ayarlarını kimse yazmadan görebiliyorsun.',
      siteLanguages:
        'Site Türkçe ve İngilizce kullanılabiliyor, açık ve koyu tema arasında geçiş yapılabiliyor.',
      bridgeSceneCommand:
        "OBS Bridge'e !scene komutu geldi, adı eşleşen herhangi bir sahneye geçiliyor. Her komutun adı da değiştirilebiliyor.",
      raffleBots: 'Çekiliş bilinen botların katılımlarını otomatik olarak yok sayıyor.',
      chatReadableColors:
        'Sohbet Kutusu koyu zeminde okunması zor kullanıcı adı renklerini açıyor, mesaj gölgeleri de daha hafif.',
      chatBoldBadges:
        "Sohbet Kutusu'na Kalın Mesajlar ve rozetleri gizleme seçeneği eklendi. Rozetler yazı boyutuyla birlikte büyüyor.",
      sproutWatering: "Sub Sprout'a yağmur ve parıltı sulama efektleri eklendi.",
      chatItemBackground:
        "Sohbet Kutusu'na her mesaj için ayrı arka plan kutusu ve kalın kullanıcı adı seçenekleri eklendi. Bağlantı koparsa sohbete kendiliğinden yeniden bağlanıyor.",
      bridgeLaunch:
        'OBS Bridge geldi: yetkili kullanıcılar sohbet komutlarıyla BRB ve Ana sahneye geçebiliyor, yayını ve kaydı başlatıp durdurabiliyor.',
      chatFade: "Sohbet Kutusu'na Solarak belir animasyonu eklendi.",
      sproutVarieties:
        "Sub Sprout'a gül, ayçiçeği, kaktüs, lale ve lotus gibi yeni bitki çeşitleri eklendi.",
      chatFontsLayouts:
        "Sohbet Kutusu'na yazı tipi, mesaj düzeni ve animasyon seçimi geldi. Silinen mesajlar ve banlanan kullanıcıların mesajları overlay'den de kalkıyor.",
      raffleHardening:
        'Çekiliş kazananı güvenli bir rastgele seçimle çekiyor, çekiliş başlayınca kuralları kilitliyor ve Minimum Süre dolmadan kazanan çekilmesine izin vermiyor.',
      siteTutorial:
        'Kurulum sayfalarına video anlatım bağlantısı eklendi. Çekiliş sayfasında overlay adresi tek tıkla kopyalanıyor.',
      chatPlatformPick:
        "Sohbet Kutusu'nda sohbetin Twitch'ten, Kick'ten ya da ikisinden birden alınacağı seçilebiliyor.",
      chatSevenTv: "Sohbet Kutusu 7TV emote'larını gösteriyor.",
      chatTimestamp:
        "Sohbet Kutusu'nda platform adı ya da simgesi seçilebiliyor ve mesaj saati gösterilebiliyor.",
      siteSetupPages: "Yeni ana sayfa geldi ve her widget'ın artık kendi kurulum sayfası var.",
      raffleLaunch:
        'Çekiliş geldi: izleyiciler sohbete bir anahtar kelime yazarak katılıyor, kullanıcı başına kazanç sınırı konabiliyor ve kazanan yayında konfetiyle gösteriliyor.',
      chatBgOpacity: "Sohbet Kutusu'nun koyu arka planının saydamlığı ayarlanabiliyor.",
      chatEmotesBadges:
        "Sohbet Kutusu Twitch emote'larını ve Twitch ile Kick rozetlerini gösteriyor.",
      chatOrientation:
        'Sohbet Kutusu yatay da kullanılabiliyor, ekranın altına şerit olarak koymak için.',
      sitePreview: "Kurulum sayfası ayarların yanında widget'ın canlı önizlemesini gösteriyor.",
      sproutKick: 'Sub Sprout Kick aboneliklerini de sayıyor.',
      launch:
        'Senchabot Extensions yayında: Twitch ve Kick sohbetini birleştiren bir sohbet kutusu ve Twitch abonelikleriyle büyüyen Sub Sprout ile.',
    },
  },
};
