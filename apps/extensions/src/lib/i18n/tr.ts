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
    playPreview: 'Önizlemeyi oynat',
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
      faq: 'SSS',
      senchabot: 'Senchabot',
      github: "GitHub'daki kaynak kodu",
      switchWidget: "Başka bir widget'a geç",
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
    toolsLead: 'Yayın sırasında senin kullandığın sayfalar.',
    setUp: 'Ayarla',
    toolFeatures: 'Özellikler',
    raffleFeatureKeyword: '!join gibi katılım komutu',
    raffleFeatureSubs: 'Sadece aboneler, minimum ay şartıyla',
    raffleFeatureDuration: 'Çekilişten önce minimum süre',
    obsFeatureScenes: 'Sohbetten sahne değiştir',
    obsFeatureCommands: 'Komut adlarını sen belirle',
    obsFeatureLocal: 'Yerel obs-websocket bağlantısı',
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
      "Evet. Sohbet Kutusu, Emote Duvarı ve Sub Sprout tek bir URL'de hem Twitch hem Kick kanalını alır. OBS Bridge da iki sohbeti aynı anda dinleyebilir. Çekiliş ise her seferinde tek bir platformda çalışır.",
    faq5Q: "Bir widget'ı sonradan nasıl değiştiririm?",
    faq5A:
      "Kurulum sayfasını aç, widget'ı istediğin gibi ayarla ve Tarayıcı Kaynağı'ndaki URL'yi yenisiyle değiştir. Sohbet Kutusu, Emote Duvarı ve Sub Sprout mevcut bir URL'yi de açabilir: URL'yi kurulum sayfasına yapıştır, eski ayarların geri gelsin, sadece istediğini değiştir.",
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
      'Nightbot, StreamElements, Fossabot, BotRix ve KickBot gibi bilinen botların, bir de Twitch\'te "Chat Bot" rozeti olan hesapların mesajlarını gizler.',
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
    faq1Q: "Sohbet kutusunu kullanmak için Twitch veya Kick'e giriş yapmam gerekiyor mu?",
    faq1A:
      'Giriş gerekmez. Sohbet Kutusu, her iki platformun herkese açık sohbet akışlarını anonim olarak dinler.',
    faq2Q: "Bu çoklu sohbet widget'ı 7TV emote'larıyla çalışıyor mu?",
    faq2A:
      "Evet. 7TV kanal ve global emote'ları hem Twitch hem Kick mesajlarında görünür, BTTV ve FFZ emote'ları ise sadece Twitch mesajlarında. Üçü de varsayılan olarak açık, istediğini Emote'lar menüsünden kapatabilirsin.",
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
      "Komutları sadece bu listedekiler çalıştırabilir. Liste boşsa kimse çalıştıramaz, sen bile. Twitch'te sohbette görünen adla eşleştirilir.",
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
    summaryChannels: 'Dinlenen kanallar',
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
      connection: 'OBS bağlantısı',
      status: {
        connecting: 'Bağlanıyor…',
        connected: 'Bağlandı',
        failed: "OBS'ye ulaşılamıyor, yeniden deneniyor…",
        disconnected: 'Bağlantı koptu, yeniden bağlanıyor…',
      },
      failedHint:
        "OBS'nin açık, WebSocket sunucusunun etkin ve bu URL'deki şifrenin doğru olduğundan emin ol.",
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
    resub: 'Abonelik Yeniledi!',
    gift: 'Hediye Abonelik Geldi!',
    donate: 'Bağış Yaptı!',
    raid: 'Baskın Vaar!',
    giftAmount: 'x{count} hediye abonelik',
    resubMonths: '{months} aydır abone',
    raidViewers: '{viewers} izleyici ile',
  },
  alertsSetup: {
    breadcrumb: 'Uyarılar Kurulumu',
    title: 'Twitch & Kick Yayın Uyarıları',
    intro:
      'Tek bir birleşik kaplamada Twitch ve Kick için ücretsiz özelleştirilebilir yayın uyarıları. Takip, yeni abonelik, yenileme, hediye abonelik, Cheer/bit ve raid uyarılarını destekler.',
    addBotNotice:
      'Uyarıları alabilmek için Senchabot botunun Twitch ve Kick kanalınızda bulunması gerekir. Botu senchabot.com adresinden ekleyebilirsiniz.',
    platforms: 'Platformlar',
    both: 'İkisi (Twitch & Kick)',
    twitch: 'Twitch',
    kick: 'Kick',
    twitchChannel: 'Twitch Kanalı',
    kickChannel: 'Kick Kanalı',
    glowEffect: 'Arka Plan Parlama Efekti',
    previewTitle: 'Uyarı Widget Önizleme',
    previewIframeTitle: 'Uyarılar Önizleme',
    previewHint: 'Animasyonlu bildirimlerle canlı uyarı önizlemesi.',
    guideTitle: 'Yayın Yazılımı Uyarı Kurulumu (OBS, Streamlabs, XSplit vb.)',
    guideStep1:
      '1. Yayın yazılımında (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio vb.) bir Tarayıcı Kaynağı ekle.',
    guideStep2: "2. Kopyaladığın uyarı widget URL'sini yapıştır.",
    guideStep3:
      '3. Genişlik ve yüksekliği ayarla (tam tuval kaplaması için örn. 1920×1080 veya kompakt alan için 500×700).',
    guideStep4:
      '4. "Görünür olmadığında kaynağı kapat" seçeneğini işaretle ve "Sahne etkinleştiğinde tarayıcıyı yenile" seçeneğini kapalı tut.',
    browserSourceHintSize: ' (önerilen boyut: tam ekran için 1920×1080 veya 500×700).',
    faq1Q: 'Bu widget\'ı hem Twitch hem Kick için aynı anda kullanabilir miyim?',
    faq1A:
      'Evet! "İkisi (Twitch & Kick)" seçeneğini seçin, her iki platform için kanal adlarınızı girin ve her iki platformun uyarılarını aynı anda işleyen tek bir tarayıcı kaynağı URL\'si elde edin.',
    faq2Q: 'Giriş yapmam veya hesap oluşturmam gerekiyor mu?',
    faq2A:
      'Hesap veya OAuth girişi gerekmez. Senchabot, gerçek zamanlı olaylar üzerinden doğrudan bağlanır.',
    faq3Q: 'Hangi uyarı türleri destekleniyor?',
    faq3A:
      'Hem Twitch hem Kick için takipçiler, abonelikler (yeni ve yenilemeler), topluluk/bireysel hediye abonelikler, Cheer/bit bağışları ve gelen kanal raid\'leri desteklenir.',
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
      lead: "Her rehber tek bir soruyu adım adım cevaplıyor: OBS'e widget eklemek, Twitch ve Kick sohbetini birleştirmek, sohbet çekilişi yapmak ve sohbetten sahne değiştirmek. Hepsi ücretsiz ve giriş istemeyen araçlar için.",
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
        p1: "Hayır. Sohbet Kutusu, Emote Duvarı, Sub Sprout ve çekiliş overlay'i şeffaf bir arka planla çizilir. Renk anahtarı (chroma key) ya da filtre eklemen gerekmez, OBS'in Özel CSS alanını da olduğu gibi bırakabilirsin.",
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
        p2: "[Sohbet Kutusu](/setup/chat-widget), [Emote Duvarı](/setup/emote-wall) ve [Sub Sprout](/setup/sub-growing-plant) için baştan başlaman gerekmez. Mevcut adresini kurulum sayfasındaki Widget URL alanına yapıştır, kanalların ve bütün ayarların geri yüklenir. Değiştirmek istediğini değiştir ve yeni adresi kopyala.",
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
          "Sohbet Kutusu ve Emote Duvarı sohbette bir şey olana kadar tamamen boş ve şeffaftır. Sohbete bir mesaj yaz; Emote Duvarı için varsayılan olarak sadece emote'tan oluşan bir mesaj gerekir, Tüm Emote'ları Göster açıksa normal mesajlardaki emote'lar da sayılır. Çekiliş overlay'i de sadece kazanan çekildiğinde görünür ve 10 saniye sonra kaybolur. Sub Sprout ise bitkiyi hemen gösterir.",
        kickTitle: 'Kick kanalı bulunamadı mı?',
        kickBody:
          "Widget açılırken Kick kanalını kick.com üzerinden arar. Bu arama başarısız olursa, yani ad yanlışsa, kanal yoksa ya da Kick cevap vermezse, Kick mesajları gelmez. Adreste Twitch kanalı da yoksa Sohbet Kutusu ve Emote Duvarı gerçek sohbet yerine örnek içerik oynatır. OBS'te Goku ya da Frieren gibi isimlerden mesajlar görüyorsan Kick kanalın bulunamamış demektir. Kick adını kick.com adresinde göründüğü gibi yaz.",
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
        bots: 'Botları Gizle, bilinen bot hesaplarının mesajlarını ekrandan çıkarır: Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, Sery_Bot, SoundAlerts, StreamlootsBot, KofiStreamBot, PokemonCommunityGame, OWN3D, Blerp, BotRix, KickBot, Kicklet ve Senchabot. Twitch\'te "Chat Bot" rozeti taşıyan hesaplar da gizlenir. Kick\'te bot rozeti olmadığı için orada sadece bu isim listesi işe yarar.',
        commands:
          'Komutları Gizle, "!" ile başlayan her mesajı gizler; `!discord` ya da `!uptime` gibi komutlar ekranı doldurmaz. Botun komuta verdiği cevabı da saklamak için iki ayarı birlikte aç.',
        highlights:
          "Bunun tersine bazı mesajları öne çıkarmak için Vurgular var. Varsayılan olarak beşi de açık: kanalını etiketleyen ya da sana yanıt veren mesajlar, yanıtların üstündeki kime cevap verildiğini gösteren satır, sohbete ilk kez yazanlar, duyurular ve Mesajınızı Vurgulayın ile gönderilen mesajlar. Son üçü sadece Twitch'te var, çünkü Kick bu bilgileri göndermiyor.",
      },
      horizontal: {
        title: 'Sohbet ekranın altına şerit olarak nasıl konur?',
        p1: 'Yön ayarını Yatay yap. Mesajlar yan yana dizilir, en yenisi sağda belirir ve eskiler sola kayarak kutudan çıkar.',
        p2: '400 × 600 önerisi dikey kullanım için. Yatay şeritte kaynağın genişliğini şeridin boyuna, yüksekliğini tek bir mesaj satırına göre ayarla, sonra kaynağı ekranın altına yerleştir.',
      },
      others: {
        title: "Başka hangi widget'lar iki platformu birlikte dinler?",
        p1: "[Emote Duvarı](/setup/emote-wall) ve [Sub Sprout](/setup/sub-growing-plant) de tek adreste iki kanalı birlikte alır. Emote Duvarı iki sohbetten gelen, sadece emote'tan oluşan mesajları ekranda uçurur. Sub Sprout iki platformdaki aboneliklerle büyür, Kick'teki hediye abonelikler de dahil.",
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
        p1: "Çekiliş başladığında ayarlar kilitlenir, çekiliş sürerken kurallar değişmez. Katılımı kapatmak için Çekilişi Durdur'a bas; durdurduktan sonra da kazanan çekebilirsin. Yeni bir çekiliş başlatmak katılımcı listesini sildiği için sayfa önce onay ister.",
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
        minMonths: 'Minimum Abonelik Ayı',
        minMonthsOptions: '1 ve üstü, sadece Sadece Aboneler açıkken',
        minMonthsDefault: '1',
        maxWins: 'Kullanıcı Başına Maksimum Kazanç',
        maxWinsOptions: '1 ile 5 arası ya da sınırsız',
        maxWinsDefault: '1',
        minDuration: 'Minimum Süre',
        minDurationOptions: '0 ile 300 saniye',
        minDurationDefault: '15 saniye',
        subsText:
          "Sadece Aboneler açıkken abone rozeti olmayanlar katılamaz. Yayıncı da abone sayılır, kendi çekilişine girebilir. Minimum Abonelik Ayı 1'de kalırsa her abone katılır; 6 yaparsan sadece en az 6 aydır abone olanlar girer. Abonelik süresi Twitch'te ve Kick'te izleyicinin abone rozetinden okunur.",
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
        p1: "`brb` ve `back` ünlemsiz yazılır. Komutlar büyük küçük harfe bakmaz ama mesajın tamamı komut olmalı: `brb` çalışır, `brb 5 dk` çalışmaz. Kurulum sayfasındaki Özel Komut Adları'ndan her komutun adını değiştirebilirsin, örneğin `!scene` yerine `!sahne`.",
        p2: 'Yayını durdurma komutu yayını gerçekten kapatır. Yetkili listesini kısa tut.',
      },
      matching: {
        title: '!scene komutu doğru sahneyi nasıl bulur?',
        p1: 'Önce tam eşleşme aranır: `!scene oyun`, adı tam olarak "Oyun" olan sahneye geçer, büyük küçük harf fark etmez. Tam eşleşme yoksa adında o kelime geçen ilk sahne seçilir: `!scene sohbet`, "Sadece Sohbet" sahnesini bulur. Hiçbir sahne eşleşmezse hiçbir şey olmaz.',
        p2: "Birden fazla sahne aynı kelimeyi içeriyorsa OBS'in gönderdiği listedeki ilk eşleşme kazanır. Benzer adlı sahnelerde tam adı yazmak en güvenlisi. Sahne ekleyip adını değiştirdiğinde liste kendiliğinden güncellenir.",
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
      "Evet. Beş widget'ın ve aracın hepsi ücretsiz: Sohbet Kutusu, Emote Duvarı, Sub Sprout, Çekiliş ve OBS Bridge. Ücretli paket, filigran ya da premium hesap yok. Kaynak kodu GPL-3.0 lisansıyla GitHub'da açık.",
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
      "Beşi de iki platformu destekliyor. Sohbet Kutusu, Emote Duvarı ve Sub Sprout tek adreste Twitch ve Kick kanalını birlikte dinler. OBS Bridge iki sohbetten gelen komutları dinler ve her yetkili kullanıcı kendi platformuyla eklenir. Çekiliş her seferinde tek platformda çalışır, Twitch ya da Kick. Sohbet Kutusu'nda 7TV emote'ları iki platformda, BTTV ve FFZ emote'ları sadece Twitch'te görünür.",
    editQ: "Widget'ı sonradan nasıl değiştiririm?",
    editA:
      "Kurulum sayfasında ayarları değiştir, yeni adresi kopyala ve OBS'te kaynağın URL alanındaki eski adresin yerine yapıştır. Sohbet Kutusu, Emote Duvarı ve Sub Sprout'ta eski adresini kurulum sayfasındaki Widget URL alanına yapıştırırsan bütün ayarların geri yüklenir, baştan başlaman gerekmez.",
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
