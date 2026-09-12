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
    heroBadge: '%100 Ücretsiz · Giriş Gerektirmez · Anında Tarayıcı Kaynağı Kurulumu',
    heroTitle: 'Özelleştirilebilir Yayın Ekranı Kaplamaları, Tarayıcı Kaynakları ve Araçlar',
    heroLead:
      "Twitch ve Kick için özelleştirilebilir yayın kaplamalarını, çoklu sohbet widget'larını, abone hedefi bitkilerini, ekrandaki yüzen emote'ları ve yayın araçlarını yapılandır. Giriş veya indirme gerekmez.",
    sectionLabel: "Mevcut widget'lar",
    tagObsSource: 'OBS Tarayıcı Kaynağı',
    tagGiveaway: 'Çekiliş Aracı',
    tagControlTool: 'Yayın Kontrol Aracı',
    cardSubSprout:
      "Twitch ve Kick'te her yeni abonelikle büyüyen etkileşimli abone hedefi bitkileri. Birden fazla bitki çeşidi, sulama animasyonları ve özelleştirilebilir yayın kaplama efektleri.",
    cardChatBox:
      "Twitch ve Kick sohbetlerini tek bir kaplamada birleştiren özelleştirilebilir çoklu sohbet widget'ı ve yayın sohbet kutusu. 7TV emote'ları, abone rozetleri, özel yazı tipleri, animasyonlar ve şeffaf arka planlar destekler.",
    cardRaffle:
      'Sohbet anahtar kelimesi (!join) ile izleyici çekilişleri düzenle. Yalnızca aboneler filtresi, hile önleyici zamanlayıcı ve canlı OBS konfeti kutlama kaplaması içerir.',
    cardObsBridge:
      "Özel tetikleyici adlarıyla sohbet komutlarından OBS'yi kontrol et. Güvendiğin moderatörlere BRB/Ana sahnelerine geçirme, kayıt açıp kapatma ve yayını yerel WebSocket üzerinden yönetme imkanı ver.",
    cardAlerts:
      'Twitch ve Kick takip, abonelik, yenileme, hediye abonelik, Cheer ve raid uyarılarını yayınında göster.',
    cardEmoteWall:
      "Yalnızca emote içeren Twitch, Kick ve 7TV sohbet mesajları için ekrandaki yüzen emote'lar. Sakin modda süzülür, Kaos modunda ekranı boydan boya geçer.",
    openSetup: 'Kurulumu Aç',
    noLoginHint: 'giriş gerekmez',
    faqTitle: 'Sıkça Sorulan Sorular',
    faq1Q: 'Bu özelleştirilebilir yayın kaplamaları gerçekten %100 ücretsiz mi?',
    faq1A:
      "Evet. Ödeme duvarı, filigran veya premium hesap yok. Tüm çoklu sohbet widget'ları, abone hedefi bitkileri ve yayın kaplamaları tamamen ücretsiz ve açık kaynaklıdır.",
    faq2Q: "Çoklu sohbet widget'ını veya sohbet kutusunu kullanmak için giriş yapmam gerekiyor mu?",
    faq2A:
      "Kayıt veya OAuth girişi gerekmez. Sadece kanal adını yaz, widget URL'sini kopyala ve doğrudan OBS Studio'ya ekle.",
    faq3Q: 'Hangi yayın yazılımları destekleniyor?',
    faq3A:
      'OBS, Streamlabs Desktop, XSplit, vMix, Lightstream veya tarayıcı kaynağı destekleyen herhangi bir yazılımla çalışır.',
    faq4Q:
      "Birden fazla platformu destekleyen bir sohbet widget'ını veya abone hedefi bitkisini OBS Studio'ya nasıl eklerim?",
    faq4A:
      "OBS Studio'da Kaynaklar panelinde + > Tarayıcı'ya tıkla, oluşturduğun widget URL'sini yapıştır, istediğin boyutu ayarla (örn. Sub Sprout için 800x600, sohbet kutusu için 400x600) ve Tamam'a bas.",
    footerGithub: "GitHub'da Görüntüle (Açık Kaynak)",
  },
  chatWidget: {
    breadcrumb: 'Sohbet Kutusu Kurulumu',
    title: 'Sohbet Kutusu Kurulumu',
    intro:
      "Twitch ve Kick'i 7TV emote'ları ve özel temalarla tek bir akışta birleştiren özelleştirilebilir çoklu sohbet widget'ı ve yayın sohbet kutusu kaplaması.",
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
      "Evet, 7TV kanal ve global emote'ları hem Twitch hem Kick için sohbet kutusu kaplamasında otomatik olarak alınır ve gösterilir.",
  },
  obsBridge: {
    breadcrumb: 'OBS Bridge Kurulumu',
    title: 'OBS Bridge Kurulumu',
    intro:
      'Twitch veya Kick kanalında yetkili kullanıcıların gönderdiği sohbet komutlarıyla OBS Studio sahnelerini ve kaydını kontrol et.',
    scenesNote:
      'Sahneler araç sayfasında atanır. Aracı açtıktan sonra Ana ve BRB sahnelerini seç ya da istediğin an !scene <ad> komutuyla herhangi bir sahneye geç.',
    twitchChannel: 'Twitch Kanalı (dinlenecek)',
    kickChannel: 'Kick Kanalı (dinlenecek)',
    authorizedUsers: 'Yetkili Kullanıcılar',
    authorizedHint: 'Sohbetten OBS eylemlerini sadece bu kullanıcılar tetikleyebilir, o da her biri için seçtiğin platformda.',
    userPlatform: 'Platform',
    customCommands: 'Özel Komut Adları',
    customCommandsHint:
      'Her eylem için sohbet tetikleyici kelimelerini özelleştir (örn. !scene yerine scene, !startstream yerine start kullan).',
    cmdSceneLabel: 'Eşleşen Sahneye Geç',
    cmdBrbLabel: 'BRB Sahnesine Geç',
    cmdBackLabel: 'Ana Sahneye Geç',
    cmdStartStreamLabel: 'Yayınlamayı Başlat',
    cmdStopStreamLabel: 'Yayınlamayı Durdur',
    cmdStartRecordLabel: 'Kaydı Başlat',
    cmdStopRecordLabel: 'Kaydı Durdur',
    wsSettings: 'OBS WebSocket Ayarları',
    wsUrl: 'WebSocket URL',
    wsUrlHint: "OBS farklı bir makinedeyse özel WebSocket URL'si. Varsayılan: ws://localhost:4455.",
    wsPassword: 'WebSocket Şifresi',
    wsPasswordHint: 'OBS → Araçlar → WebSocket Sunucu Ayarları bölümünden ayarlanır.',
    activeCommands: 'Aktif Sohbet Komutları:',
    activeSceneCmd: '— Eşleşen sahneye geçer (örn. {cmd} Gaming)',
    activeBrbCmd: '— BRB sahnesine geçer',
    activeBackCmd: '— Ana sahneye geçer',
    activeStreamCmd: '— Yayını açar/kapatır',
    activeRecordCmd: '— Kaydı açar/kapatır',
    previewTitle: 'Araç Önizleme',
    previewIframeTitle: 'OBS Bridge Önizleme',
    toolUrlHint:
      "Köprüyü aktif tutmak için bu URL'yi bir sekmede açık tut veya OBS Studio ya da Streamlabs Desktop'a Tarayıcı Kaynağı / Özel Dock olarak ekle.",
    guideTitle: 'OBS Studio Kurulumu',
    guideStep1:
      "1. OBS'de Araçlar > WebSocket Sunucu Ayarları altından WebSocket Sunucusu'nu etkinleştir.",
    guideStep2:
      "2. Oluşturduğun Araç URL'sini bir tarayıcı sekmesinde aç veya OBS'ye Özel Tarayıcı Dock'u olarak ekle.",
    guideStep3:
      '3. Adı eşleşen herhangi bir sahneye geçmek için sohbette !scene <ad> yaz (örn. !scene Gaming).',
    guideStep4: '4. Araç arayüzünden hızlı Ana ve BRB sahneleri de atayabilirsin.',
    faq1Q: '!scene sohbet komutu nasıl çalışır?',
    faq1A:
      'Yetkili bir kullanıcı !scene <ad> gönderdiğinde OBS Bridge, OBS sahnelerinde tam veya kısmi, büyük/küçük harf duyarsız bir ad eşleşmesi arar ve anında o sahneye geçer.',
    faq2Q: 'OBS WebSocket şifrem güvende mi?',
    faq2A:
      'Evet. WebSocket bağlantısı doğrudan tarayıcın ile yerel makinendeki OBS Studio arasında çalışır. Sunucularımıza hiçbir kimlik bilgisi gönderilmez.',
  },
  subSprout: {
    breadcrumb: 'Sub Sprout Kurulumu',
    title: 'Sub Sprout — Abone Hedefi Bitkisi Kurulumu',
    intro:
      "Twitch veya Kick'te her yeni abonelikle seviye atlayan özelleştirilebilir abone hedefi bitkisi kaplaması.",
    platforms: 'Platformlar',
    both: 'İkisi (Twitch & Kick)',
    twitch: 'Twitch',
    kick: 'Kick',
    twitchChannel: 'Twitch Kanalı',
    kickChannel: 'Kick Kanalı',
    growthOptions: 'Büyüme ve Bitki Seçenekleri',
    plantVariety: 'Bitki çeşidi',
    stagesSuffix: '{stages} aşama',
    selectionMode: 'Bitki Değişimi',
    fixed: 'Aynı Bitki',
    cycle: 'Sırayla',
    random: 'Rastgele',
    fixedHint: 'Bitirdikten sonra aynı bitkiyi yeniden başlatır.',
    cycleHint: 'Bitki çeşitlerini sırayla döngüler.',
    randomHint: 'Her döngüden sonra rastgele bir bitki seçer.',
    wateringEffect: 'Sulama efekti',
    showSubCountEffect: 'Abone sayısı efektini göster',
    subCountHint: '(hediye paketleri için örn. {count})',
    showPotLabel: 'Saksıda aşama etiketi göster',
    potLabelHint: '(örn. mevcut aşama ve toplam aşama için 3/10)',
    advancedNotice: "Gelişmiş seçenekler etkin. Widget URL'sine özel büyüme parametreleri eklendi.",
    previewTitle: 'Abone Hedefi Bitkisi Önizleme',
    previewIframeTitle: 'Sub Sprout Önizleme',
    loadingPreview: 'Önizleme yükleniyor...',
    previewHintChannel: 'Canlı önizleme — bitki {channel} sohbetindeki abonelerle büyür.',
    previewHintNoChannel:
      'Canlı sohbete bağlanmak için bir kanal adı gir. Önizlemede simüle aboneler gösterilir.',
    guideTitle: 'Yayın Yazılımı Kurulumu (OBS, Streamlabs, XSplit vb.)',
    guideStep1:
      '1. Yayın yazılımında (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio vb.) bir Tarayıcı Kaynağı ekle.',
    guideStep2: "2. Kopyaladığın abone hedefi bitkisi URL'sini yapıştır.",
    guideStep3: '3. Genişliği 800 ve yüksekliği 600 olarak ayarla.',
    guideStep4:
      '4. Yayıncılar ve moderatörler büyümeyi elle tetiklemek için sohbette !grow yazabilir.',
    faq1Q: 'Abone hedefi bitkisini kullanmak için giriş yapmam gerekiyor mu?',
    faq1A:
      'Kayıt veya OAuth girişi gerekmez. Sub Sprout, herkese açık sohbet olay dinleyicileri aracılığıyla anonim olarak bağlanır.',
    faq2Q: 'Abone hedefi bitkisi tam büyüklüğe ulaştığında ne olur?',
    faq2A:
      'Bitki büyümeyi tamamladığında bir sonraki abonelik, seçim moduna göre bitkiyi sıfırlar (aynı bitkiyi yeniden başlat, sıradaki çeşide geç veya rastgele seç).',
  },
  raffle: {
    breadcrumb: 'Çekiliş Kurulumu',
    title: 'Çekiliş Kurulumu',
    lockedTitle: 'Yapılandırma kilitli',
    lockedDesc:
      "Çekiliş aktifken girişler kilitlidir. Baştan başlamak için Tümünü Sıfırla'ya tıkla.",
    intro:
      'Giriş anahtar kelimeleri (!join), yalnızca aboneler modu ve canlı konfeti kazanan kutlamalarıyla sohbet çekilişleri düzenle.',
    platform: 'Platform',
    channelName: 'Kanal Adı',
    channelHint: 'Çekiliş sohbet komutunun izleneceği kanal.',
    entryKeyword: 'Giriş Anahtar Kelimesi',
    entryKeywordHint: 'İzleyicilerin çekilişe girmek için yazması gereken sohbet komutu.',
    subscribersOnly: 'Sadece Aboneler',
    subscribersOnlyHint: 'Sadece kanal aboneleri girebilir.',
    minSubMonths: 'Minimum Abonelik Ayı',
    minSubMonthsHint: 'Abonelerin en az bu kadar aydır abone olmasını gerektirir.',
    maxWinsPerUser: 'Kullanıcı Başına Maksimum Kazanç',
    maxWins1: 'Kullanıcı başına 1 kazanç (çift kazancı engelle)',
    maxWins2: 'Kullanıcı başına 2 kazanç',
    maxWins3: 'Kullanıcı başına 3 kazanç',
    maxWins4: 'Kullanıcı başına 4 kazanç',
    maxWins5: 'Kullanıcı başına 5 kazanç',
    maxWinsUnlimited: 'Sınırsız kazanç',
    maxWinsHint: 'Bir kullanıcının bu oturumda kaç kez kazanabileceğini sınırlar.',
    minDuration: 'Minimum Süre (saniye)',
    minDurationHint:
      'Çekilişin çok hızlı bitirilmesini engeller. Geri sayım çekiliş başladığında başlar.',
    resetConfig: 'Yapılandırmayı Sıfırla',
    startRaffle: 'Çekilişi Başlat',
    stopRaffle: 'Çekilişi Durdur',
    drawWinner: 'Kazananı Çek ({count} uygun)',
    drawLocked: 'Kazananı Çek ({seconds} sn kilit)',
    lastWinner: 'Son Kazanan',
    resetEntries: 'Katılımları Sıfırla',
    resetWinners: 'Kazananları Sıfırla',
    resetAll: 'Tümünü Sıfırla',
    winners: 'Kazananlar ({count})',
    participants: 'Katılımcılar ({count})',
    noWinners: 'Henüz kazanan yok.',
    noParticipants:
      'Henüz katılım yok. İzleyiciler çekilişe girmek için sohbette {keyword} yazabilir.',
    disqualify: 'Diskalifiye et / Katılımı kaldır',
    overlayUrl: "Kazanan Kutlama Kaplama URL'si (OBS, Streamlabs, XSplit vb.)",
    overlayUrlHint:
      "Yayında konfeti kazanan kutlamasını göstermek için bu URL'yi OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio veya tarayıcı kaynağı destekleyen herhangi bir yazılımda Tarayıcı Kaynağı olarak yapıştır.",
    guideTitle: 'Yayın Yazılımı Kazanan Kaplaması Kurulumu',
    guideBody:
      "OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio veya tarayıcı kaynağı destekleyen herhangi bir yazılımda /widgets/raffle-overlay adresini Tarayıcı Kaynağı olarak ekle. Kazananı Çek'e tıkladığında kaplama, yayında kazananın adıyla konfeti kutlaması tetikler.",
    faq1Q: 'Kazara çift kazanç nasıl engellenir?',
    faq1A:
      'Bir kullanıcı kazanan olarak çekildiğinde uygun havuzdan çıkarılır ve kazananlar listesinde takip edilir. Kullanıcı Başına Maksimum Kazanç 1 olarak ayarlandıysa aynı çekiliş oturumunda tekrar çekilemez.',
    faq2Q: 'Şüpheli katılımları veya botları diskalifiye edebilir miyim?',
    faq2A:
      'Bilinen yayın botları otomatik olarak filtrelenir. Ayrıca herhangi bir katılımcının adının yanındaki ✕ düğmesine tıklayarak anında diskalifiye edebilirsin.',
    winner: 'Kazanan!',
    subMonthsShort: '{months}ay',
  },
  tools: {
    title: 'OBS Bridge',
    connected: 'Bağlandı',
    connecting: 'Bağlanıyor...',
    fetchingScenes: 'Sahne listesi alınıyor...',
    notSelected: 'Seçilmedi',
    obsWebSocket: 'OBS WebSocket',
    mainScene: 'Ana Sahne',
    brbScene: 'BRB Sahnesi',
    obsScenes: 'OBS Sahneleri ({count})',
    assignMainBrbWarning:
      'Sohbet komutlarının hangi sahnelerine geçeceğini bilmesi için aşağıda bir Ana ve bir BRB sahnesi ata.',
    assignMainWarning:
      'Geri dönme komutunun hangi sahneye geçeceğini bilmesi için aşağıda bir Ana sahne ata.',
    assignBrbWarning:
      'BRB komutunun hangi sahneye geçeceğini bilmesi için aşağıda bir BRB sahnesi ata.',
    main: 'Ana',
    brb: 'BRB',
    assignHintClick: 'Bir sahneyi atamak için yanındaki',
    assignHintOr: 'veya',
    assignHintRest: 'düğmesine tıkla. Ya da !scene <ad> komutuyla herhangi bir sahneye geç.',
    commandUsers: 'Komut Kullanıcıları ({count})',
    addUsername: 'Kullanıcı adı ekle',
    userPlatform: 'Platform',
    pickPlatformWarning:
      'Twitch ve Kick ikisi de bağlı, sarı görünen her isim için bir platform seç. Seçene kadar komut kullanamazlar.',
    add: 'Ekle',
    activeCommands: 'Aktif Sohbet Komutları',
    cmdScene: 'Herhangi Bir Sahneye Geç:',
    cmdBrb: "BRB'ye Geç:",
    cmdBack: 'Ana Sahneye Geç:',
    cmdStartStream: 'Yayını Başlat:',
    cmdStopStream: 'Yayını Durdur:',
    cmdStartRecord: 'Kaydı Başlat:',
    cmdStopRecord: 'Kaydı Durdur:',
    footer:
      "Köprü bağlantısını sürdürmek için bu sayfa açık kalmalı. Komut kullanıcılarının herhangi biri sohbet üzerinden OBS'yi kontrol edebilir.",
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
    title: 'Emote Duvarı — Yüzen Emote Kaplaması',
    intro:
      "Yalnızca emote içeren Twitch, Kick ve 7TV sohbet mesajlarını ekrandaki yüzen emote'lar olarak göster. Sakin modda emote'lar rastgele noktalarda süzülür, Kaos modunda ekranın bir ucundan diğerine fırlar.",
    platforms: 'Platformlar',
    both: 'İkisi (Twitch & Kick)',
    twitch: 'Twitch',
    kick: 'Kick',
    twitchChannel: 'Twitch Kanalı',
    kickChannel: 'Kick Kanalı',
    sevenTvEmotes: "7TV Emote'ları",
    subsOnly: 'Sadece aboneler',
    subsOnlyHint: 'Ekranda yalnızca abonelerin emote mesajları görünür.',
    subDurationX2: "Abone emote'ları 2× uzun kalır",
    subDurationX2Hint: "Abonelerden gelen emote'lar iki kat uzun süre görünür.",
    showAllEmotes: "Mesajlardaki emote'ları da göster",
    showAllEmotesHint: "Yalnızca emote içeren mesajlar değil, normal mesajların içindeki emote'lar da gösterilir.",
    hypeMode: 'Sadece hype modu',
    hypeModeHint: "Bir emote yalnızca 2 veya daha fazla kullanıcı farklı mesajlarda gönderirse gösterilir.",
    spamBlock: 'Emote spamını engelle',
    spamBlockHint: "Aynı kullanıcı aynı emote'u üst üste gönderirse veya art arda emote mesajları atarsa yok sayılır.",
    mode: 'Animasyon Modu',
    modeCalm: 'Sakin — belirir ve süzülür',
    modeChaos: 'Kaos — ekranı boydan boya hızlıca geçer',
    modeBounce: 'Sekme — kenarlardan yansır',
    modeCalmHint:
      "Emote'lar rastgele noktalarda belirir, hafifçe süzülür ve solar.",
    modeChaosHint:
      "Emote'lar rastgele ekran kenarlarından fırlar ve yarı yolda ya da karşı tarafta kaybolur.",
    modeBounceHint:
      "Emote'lar ekran koruyucu gibi seker ve her kenar çarpışında hızlanır.",
    emoteSize: 'Emote Boyutu (px)',
    duration: 'Görünür Süre (sn)',
    maxEmotes: 'Aynı Anda Maks. Emote',
    previewTitle: 'Emote Duvarı Önizleme',
    previewIframeTitle: 'Emote Duvarı Önizleme',
    previewHint: "Ekrandaki yüzen emote'larla canlı önizleme.",
    guideTitle: 'Yayın Yazılımı Kurulumu (OBS, Streamlabs, XSplit vb.)',
    guideStep1:
      '1. Yayın yazılımında (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio vb.) bir Tarayıcı Kaynağı ekle.',
    guideStep2: "2. Kopyaladığın emote duvarı URL'sini yapıştır.",
    guideStep3:
      '3. Genişlik ve yüksekliği tam tuval boyutuna ayarla (örn. 1920×1080) ve oyun görüntünün üstüne yerleştir.',
    browserSourceHintSize: ' (önerilen boyut: 1920×1080 tam tuval).',
    faq1Q: 'Hangi mesajlar yüzen emote tetikler?',
    faq1A:
      "Yalnızca emote içeren mesajlar ekranda yüzen bir emote tetikler — örn. tek bir Kappa, tekrarlanan emote'lar veya Twitch/Kick/7TV emote karışımı. Normal metin mesajlar yok sayılır.",
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
        p2: "Sohbet Kutusu'nda baştan başlaman gerekmez. Mevcut adresini [kurulum sayfasındaki](/setup/chat-widget) Widget URL alanına yapıştır, kanalların ve bütün ayarların geri yüklenir. Değiştirmek istediğini değiştir ve yeni adresi kopyala.",
        p3: "Diğer widget'larda ayarları kurulum sayfasında yeniden seçip yeni adresi kopyalarsın. Eski adresler çalışmaya devam eder, güncellemek zorunda değilsin.",
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
          "Sohbet Kutusu ve Emote Duvarı sohbette bir şey olana kadar tamamen boş ve şeffaftır. Sohbete bir mesaj yaz; Emote Duvarı için sadece emote'tan oluşan bir mesaj gerekir. Çekiliş overlay'i de sadece kazanan çekildiğinde görünür ve 10 saniye sonra kaybolur. Sub Sprout ise bitkiyi hemen gösterir.",
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
        p2: "OBS Bridge, OBS'e doğrudan tarayıcından bağlanır ve şifreni başka bir yerde saklamaz.",
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
      "Kurulum sayfasında ayarları değiştir, yeni adresi kopyala ve OBS'te kaynağın URL alanındaki eski adresin yerine yapıştır. Sohbet Kutusu'nda eski adresini kurulum sayfasındaki Widget URL alanına yapıştırırsan bütün ayarların geri yüklenir, baştan başlaman gerekmez.",
    oldUrlsQ: 'Eski widget adreslerim çalışmaya devam eder mi?',
    oldUrlsA:
      "Evet. Güncellemeler mevcut adresleri bozmayacak şekilde yapılır: parametre adları, değerleri ve varsayılanları değişmez. Örneğin Sohbet Kutusu'ndaki eski keep=true hâlâ Süresiz anlamına gelir ve Sub Sprout eski channel ve platform parametrelerini hâlâ okur.",
    privacyQ: 'Ayarlarım nerede duruyor, hangi veriler nereye gidiyor?',
    privacyA:
      "Ayarların widget adresinin içinde durur; hesap ya da sunucuda kayıtlı bir ayar yok, adresi bilen herkes aynı widget'ı açabilir. Widget'lar sohbeti doğrudan Twitch ve Kick'ten anonim olarak okur, emote'ları 7TV, BetterTTV ve FrankerFaceZ'den, Twitch kanal bilgisini ivr.fi'den alır. Çekiliş katılımcıları ve kazananları kendi tarayıcında kalır. OBS Bridge adresinde OBS WebSocket şifren bulunduğu için onu şifre gibi sakla.",
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
