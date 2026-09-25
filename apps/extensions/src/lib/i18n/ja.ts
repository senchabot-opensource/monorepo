import type { en } from './en';

export const ja: typeof en = {
  common: {
    freeBadge: '100%無料・ログイン不要',
    copy: 'コピー',
    copied: 'コピーしました！',
    home: 'ホーム',
    watchTutorial: 'チュートリアルを見る',
    widgetUrl: 'ウィジェットURL',
    toolUrl: 'ツールURL',
    channelPlaceholder: '例: yourchannel',
    previewNoChannel: 'プレビューを表示するには、チャンネルを1つ以上入力してください。',
    browserSourceHint:
      'このURLを、OBS Studio、Streamlabs Desktop、XSplit、vMix、Lightstream、PRISM Live Studioなど、ブラウザソースに対応したソフトにブラウザソースとして貼り付けてください',
    themeToggle: 'カラーテーマを切り替え',
    languageToggle: '言語を切り替え',
    moreInfo: '詳細',
    sectionChannel: 'チャンネル',
    sectionAppearance: '外観',
    platforms: 'プラットフォーム',
    platformsTip:
      '読み込むプラットフォームを選びます。TwitchとKickで同時配信しているなら「両方」を選んでください。',
    platformBoth: '両方',
    twitchChannel: 'Twitchチャンネル',
    kickChannel: 'Kickチャンネル',
    channelTip:
      'URL全体ではなく、チャンネル名だけを入力してください。twitch.tv/senchabot なら senchabot です。',
    previewLoading: 'プレビューを読み込み中…',
    scrollMore: '下にスクロールすると続きがあります',
    scrollTop: 'トップに戻る',
    setupGuideTitle: '設定方法',
    faqTitle: 'よくある質問',
    moreWidgets: 'ほかのウィジェット',
    nextSteps: {
      title: '配信ソフトに追加しましょう',
      addSource:
        'OBS Studioなど、ブラウザソースに対応したソフトで新しいブラウザソースを追加します。',
      paste: 'URL欄にURLを貼り付けます。',
      size: '幅を{width}、高さを{height}に設定します。',
      test: '新しいタブでURLを開くと動作を確認できます',
      dismiss: '閉じる',
    },
    siteName: 'Senchabot Extensions',
    homeLink: 'Senchabot Extensions ホーム',
    skipToContent: '本文へスキップ',
    newTab: '（新しいタブで開きます）',
    nav: {
      label: 'メイン',
      menu: 'メニュー',
      openMenu: 'メニューを開く',
      closeMenu: 'メニューを閉じる',
      widgets: 'ウィジェット',
      guides: 'ガイド',
      presets: 'プリセット',
      faq: 'FAQ',
      senchabot: 'Senchabot',
      github: 'GitHubのソースコード',
      switchWidget: 'ほかのウィジェットに切り替え',
      breadcrumb: 'パンくずリスト',
    },
    notFound: {
      title: 'ページが見つかりません',
      text: 'このページは存在しないか、移動しました。下からウィジェットを選ぶか、ホームに戻ってください。',
      home: 'ホームに戻る',
    },
    footer: {
      about:
        'TwitchとKick向けの無料オーバーレイと配信ツール。ログインもダウンロードも不要で、コードはオープンソースです。',
      license: 'GPL-3.0、ソースコードはGitHubで公開中',
      social: 'SenchabotのSNS',
      guides: 'ガイド',
      setupGuides: '設定ガイド',
      presets: 'ゲームプリセット',
      faq: 'FAQ',
      changelog: '更新履歴',
      senchabotBot: 'Senchabotボット',
      docs: 'ドキュメント',
      discussions: 'GitHub Discussions',
      reportBug: 'バグ報告・ウィジェットのリクエスト',
      notAffiliated: 'TwitchおよびKickとは提携していません。',
    },
  },
  widgets: {
    overlays: 'オーバーレイ',
    tools: 'ツール',
    chatBox: {
      name: 'チャットボックス',
      tagline: 'TwitchとKickのチャットをひとつのオーバーレイに。7TV、BTTV、FFZのエモートにも対応。',
    },
    emoteWall: {
      name: 'エモートウォール',
      tagline: 'エモートだけのチャットメッセージが画面の上を流れていきます。',
    },
    subSprout: {
      name: 'Sub Sprout',
      tagline: '新しいサブスクが入るたびに少しずつ育つ、配信画面の植物。',
    },
    goal: {
      name: 'サブスク目標',
      tagline:
        'サブスクとギフトサブのたびに埋まっていく目標バー。達成するとトロフィーが登場します。',
    },
    frames: {
      name: '配信フレーム',
      tagline:
        'カメラ、チャット、配信画面にそのまま使えるフレーム。選んだプリセットに合わせて描かれます。',
    },
    countdown: {
      name: '配信カウントダウン',
      tagline: '配信開始前、休憩、終了シーン用のカウントダウン。時間の長さか時刻で設定できます。',
    },
    subathon: {
      name: 'Subathon Timer',
      tagline:
        'サブスク、ギフトサブ、Bits、Kicksで時間が延びるカウントダウン。HPバー、時計、リングで表示。',
    },
    poll: {
      name: 'チャット投票',
      tagline: 'チャットで番号を打って投票。バーがリアルタイムで伸び、最後に勝者が決まります。',
    },
    streamAlerts: {
      name: '配信アラート',
      tagline:
        'サブスク、ギフトサブ、Bits、Kicks、レイドのたびに、効果音付きのアニメーションアラート。',
    },
    raffle: {
      name: '抽選',
      tagline:
        '視聴者は !join などのキーワードをチャットに打って参加。当選者はワンクリックで抽選。',
    },
    obsBridge: {
      name: 'OBS Bridge',
      tagline: 'チャットコマンドでOBSのシーンを切り替え、配信と録画を操作できます。',
    },
    socials: {
      name: 'SNSリンク',
      tagline: 'SNSのアカウントを、なめらかなアニメーションで順番に表示します。',
    },
  },
  home: {
    heroTitle: 'TwitchとKickで使える無料の配信オーバーレイ',
    heroLead:
      'ライブプレビューを見ながらウィジェットを設定して、URLをひとつOBSに貼るだけ。アカウント不要、透かしなしで、コードはオープンソースです。',
    browseWidgets: 'ウィジェットを見る',
    viewOnGithub: 'GitHubで見る',
    trustLabel: '特長',
    trustFree: '無料',
    trustNoLogin: 'ログイン不要',
    trustOpenSource: 'オープンソース',
    trustPlatforms: 'Twitch + Kick',
    sceneLive: 'ライブ',
    sceneCaption: 'サンプルチャットで動くライブデモ',
    demoTitle: '{name}のデモ',
    worksWithTitle: '対応ソフト',
    worksWithApps: '配信ソフト',
    worksWithAppsText: 'OBS Studioなど、ブラウザソースに対応したソフト',
    galleryTitle: 'ウィジェットを選ぶ',
    galleryLead: 'どれも専用の設定ページとライブプレビュー付き。ダウンロードは不要です。',
    overlaysLead: 'シーンに置けば、あとは自動で動くブラウザソースです。',
    toolsLead: '配信中にページやチャットから自分で操作するツールです。',
    setUp: '設定する',
    toolFeatures: '機能',
    raffleFeatureKeyword: '!join などの参加キーワード',
    raffleFeatureSubs: 'サブスク限定、最低月数も指定可能',
    raffleFeatureDuration: '抽選までの最短時間',
    obsFeatureScenes: 'チャットからシーンを切り替え',
    obsFeatureCommands: 'コマンド名を自由に変更',
    obsFeatureLocal: 'ローカルのobs-websocketに接続',
    subathonFeatureChat: '!subathon でチャットから操作',
    subathonFeaturePlatforms: 'TwitchとKickで別々の時間設定',
    subathonFeatureSaved: 'OBSを再起動しても残り時間を保持',
    pollFeatureVote: '視聴者は番号を打って投票',
    pollFeatureBoth: 'TwitchとKickの票をひとつの投票に',
    pollFeatureLate: '配信遅延があっても最後の数秒の票をカウント',
    pollSpotlight: {
      eyebrow: '新機能: チャット投票',
      title: 'チャットに決めてもらおう',
      lead: 'チャットで !poll と打てば投票スタート。TwitchとKickの視聴者は番号を打って投票します。バーは配信上でリアルタイムに伸び、時間切れになると勝者が表示されます。',
      pointVote: '視聴者は 2、!vote 2、または選択肢そのものを打つだけ。1人1票です。',
      pointBoth: 'TwitchとKickの票が同じ投票に集まります。',
      pointLate:
        '視聴者の画面は少し遅れて届くので、残り数秒で打たれた票もちゃんとカウントされます。',
      pointMods: '配信者とモデレーターがチャットから操作。ボットもログインも不要です。',
      setup: 'チャット投票を設定する',
      guide: 'ガイドを読む',
      chat: 'チャット',
      caption: '模擬投票者によるライブデモ',
    },
    visualScenes: 'シーン',
    howTitle: '使い方',
    howLead: 'たった3ステップ。どのステップでもアカウントは不要です。',
    howStep1: 'ウィジェットを選んで設定を調整します。変更はライブプレビューにすぐ反映されます。',
    howStep2: 'チャンネル名を入力して、ウィジェットURLをコピーします。',
    howStep3: 'OBS Studioでブラウザソースを追加し、URLを貼り付けて推奨サイズに設定します。',
    sizesTitle: 'ブラウザソースの推奨サイズ',
    sizesNote: '幅 × 高さ（ピクセル）',
    sizesWidget: 'ウィジェット',
    sizesValue: 'サイズ',
    trustTitle: 'アカウント不要、隠れた条件もなし',
    noLoginTitle: 'ログイン不要',
    noLoginText:
      'ウィジェットは、ログインしていない視聴者と同じようにチャンネルの公開チャットを読み取ります。TwitchやKickのアカウントを連携することはありません。',
    noWatermarkTitle: '透かしなし',
    noWatermarkText:
      'オーバーレイに余計なロゴは入りません。プレビューで見たとおりに配信に映ります。',
    openSourceTitle: 'オープンソース',
    openSourceText:
      'コードはすべてGPL-3.0ライセンスでGitHubに公開しています。読むのも、フォークするのも、修正を送るのも自由です。',
    urlSettingsTitle: '設定はURLの中に',
    urlSettingsText:
      'ウィジェットの設定はURLそのものに書き込まれるので、保存のためのアカウントは必要ありません。URLを取っておけば、いつでも同じウィジェットを使えます。',
    senchabotTitle: 'チャットボットもお探しなら、Senchabotをどうぞ',
    senchabotText:
      'これらのウィジェットを作っているチームは、Senchabotも開発しています。Twitchのカスタムチャットコマンド、タイマー、シャウトアウトに加えて、Discordサーバーへの配信開始のお知らせにも対応しています。',
    senchabotCta: 'senchabot.comへ',
    communityTitle: '参加しよう',
    communityLead: 'オープンソースなので、気軽に協力できる方法がいくつかあります。',
    starTitle: 'GitHubでスター',
    starText: 'スターが増えると、より多くの配信者がこのプロジェクトを見つけやすくなります。',
    starCount: '{count}スター',
    requestTitle: 'ウィジェットをリクエスト',
    requestText: '配信に足りないものはありますか？Issueを作成して、欲しいものを教えてください。',
    discordTitle: 'Discordに参加',
    discordText: '質問したり、ほかの配信者と設定を見せ合ったりできます。',
    faqMore: '答えが見つかりませんでしたか？',
    faq1Q: '本当に無料ですか？',
    faq1A:
      'はい。すべてのウィジェットとツールが無料で、有料プランもオーバーレイへの透かしもありません。プロジェクトはオープンソースで、Senchabotチームが作っています。',
    faq2Q: '「ログイン不要」とは具体的にどういう意味ですか？',
    faq2A:
      'TwitchやKickのアカウントでサインインしたり、連携したりすることは一切ありません。チャンネル名を入力すると、ウィジェットはそのチャンネルの公開チャットを、ログインしていない視聴者と同じく匿名で読み取ります。つまり、チャットで誰でも見られる内容だけが見え、それ以上のものは見えません。',
    faq3Q: 'どの配信ソフトで使えますか？',
    faq3A:
      'OBS Studioをはじめ、ブラウザソースに対応したソフトで使えます。ウィジェットURLをブラウザソースとして追加し、設定ページに表示されるサイズにしてください。',
    faq4Q: 'TwitchとKickを同時に使えますか？',
    faq4A:
      'はい。チャットボックス、エモートウォール、Sub Sprout、Subathon Timer、配信アラート、サブスク目標、チャット投票、配信カウントダウンは、ひとつのURLにTwitchとKickのチャンネルを両方指定できます。OBS Bridgeも両方のチャットを同時に聞き取れます。抽選は一度にひとつのプラットフォームで動きます。',
    faq5Q: 'あとからウィジェットを変更するには？',
    faq5A:
      '設定ページを開いて好きなように設定し、ブラウザソースのURLを差し替えてください。チャットボックス、エモートウォール、Sub Sprout、Subathon Timer、配信アラート、サブスク目標、チャット投票、配信フレーム、SNSリンク、配信カウントダウンは既存のURLも開けます。設定ページに貼り付ければ設定が戻ってくるので、変えたいところだけ変更できます。',
    faq6Q: 'アップデート後もウィジェットURLは使えますか？',
    faq6A:
      'はい。アップデートしても既存のURLの設定項目と値はそのまま使えるので、シーンに置いてあるウィジェットのURLを新しくする必要はありません。',
  },
  chatWidget: {
    breadcrumb: 'チャットボックスの設定',
    title: 'チャットボックスの設定',
    intro:
      'TwitchとKickのチャットをひとつのオーバーレイにまとめるマルチチャットウィジェット。7TVのエモートは両方のプラットフォームで、BTTVとFFZはTwitchで表示され、バッジも表示されます。レイアウト、フォント、アニメーションは自由に選べます。',
    platformIndicator: 'プラットフォーム表示',
    platformName: 'プラットフォーム名',
    platformIcon: 'プラットフォームアイコン',
    platformHidden: 'プラットフォームを隠す',
    sectionMessages: 'メッセージ',
    platformsTip:
      'チャットを取得するプラットフォームを選びます。両方選ぶと、TwitchとKickのメッセージがひとつの流れにまとまります。',
    platformIndicatorTip:
      '両方のプラットフォームがオンのとき、各メッセージの送信元を表示します。プラットフォーム名、アイコン、表示なしから選べます。',
    orientationTip:
      '縦は、定番のチャットボックスのようにメッセージを上下に積み重ねます。横はメッセージを横に並べるので、画面下部の帯にぴったりです。',
    darkBackgroundTip:
      'ウィジェットの後ろに半透明の黒い背景を敷きます。明るいシーンでも文字が読みやすくなります。',
    emotesTip:
      'チェックしたプロバイダーのエモートは画像で、それ以外はテキストのまま表示されます。7TVはTwitchとKickで、BTTVとFFZはTwitchでのみ使えます。',
    messageDurationTip:
      'メッセージはこの時間が経つとフェードアウトします。「ずっと表示」を選ぶと画面に残り続け、新しいメッセージが古いものを押し上げます。',
    hideBotsTip:
      'Nightbot、StreamElements、Fossabot、BotRix、KickBotなどのよく使われるボットに加え、Twitchの「チャットボット」バッジやKickの「Bot」バッジが付いたアカウントのメッセージを隠します。',
    hideCommandsTip: '!discord や !uptime のように「!」で始まるメッセージを隠します。',
    badgesTip: 'ユーザー名の横に配信者、モデレーター、VIP、サブスクのバッジを表示します。',
    animationTip:
      '新しいメッセージが画面に入ってくるときの動きです。チャットが速くなると、アニメーションは自動で短くなります。',
    usernameFont: 'ユーザー名のフォント',
    messageFont: 'メッセージのフォント',
    fontSystem: 'システムの既定',
    textShadow: '文字の影',
    textShadowTip:
      '名前とメッセージの後ろに付く暗い縁取りです。「強」は1文字ずつ縁取るので、明るいゲーム画面でもチャットが読みやすくなります。「なし」は影を消し、プリセット独自の影も消えます。',
    shadowNone: 'なし',
    shadowNormal: '標準',
    shadowStrong: '強',
    messageLayout: 'メッセージのレイアウト',
    layoutInline: 'インライン（ユーザー名: メッセージ）',
    layoutStacked: '2段（ユーザー名が上）',
    layoutCard: 'カード / 吹き出し',
    layoutCompact: 'コンパクト（Twitch風）',
    newMessageAnimation: '新着メッセージのアニメーション',
    animSlide: '右からスライド + フェード',
    animSmoothSlide: '右からなめらかにスライド',
    animPop: 'ポップ / 拡大',
    animBounce: 'バウンド',
    animStagger: '時間差（名前が先、次にメッセージ）',
    animFade: 'フェードイン',
    animTyping: 'タイプライター',
    animNone: 'アニメーションなし',
    orientation: '向き',
    vertical: '縦',
    horizontal: '横',
    fontSize: 'フォントサイズ (px)',
    darkBackground: '暗い背景',
    emotes: 'エモート',
    emotesNone: 'オフ',
    messageDuration: 'メッセージの表示時間',
    durationSeconds: '{count}秒',
    durationMinutes: '{count}分',
    durationKeep: 'ずっと表示',
    hideBots: 'ボットを隠す',
    hideCommands: 'コマンドを隠す',
    showBadges: 'バッジを表示',
    showMessageTime: 'メッセージの時刻を表示',
    backgroundOpacity: '背景の不透明度',
    messageBackgroundBox: 'メッセージごとの背景ボックス',
    messageBackgroundHint: 'メッセージごとに枠付きの背景ボックスが付きます。',
    platformAccent: 'プラットフォームカラーのライン',
    platformAccentHint:
      '左側にTwitchの紫かKickの緑のラインが付き、各メッセージの送信元がひと目でわかります。',
    boldUsernames: 'ユーザー名を太字に',
    boldMessages: 'メッセージを太字に',
    highlights: 'ハイライト',
    highlightsTip:
      '配信上で細い色付きバーを付けるメッセージを選びます。返信には誰への返信かが表示されます。Twitchと付いているものはTwitchにしかありません。',
    highlightMention: 'メンション',
    highlightReply: '返信先',
    highlightFirstMessage: '初めてのチャット',
    highlightAnnouncement: 'アナウンス',
    highlightHighlighted: 'メッセージをハイライト',
    highlightsAll: 'すべて',
    highlightsNone: 'オフ',
    announcement: 'アナウンス',
    firstMessage: '初めてのチャット',
    previewTitle: 'ウィジェットのプレビュー（チャットボックス）',
    previewIframeTitle: 'チャットウィジェットのプレビュー',
    previewSpeed: 'プレビューのチャット速度',
    previewSpeedValue: '{rate}件/秒',
    previewSpeedHint: 'プレビューにだけ反映されます。ウィジェットURLは変わりません。',
    previewHint: 'アニメーション付きで流れるチャットのライブプレビュー。',
    guideTitle: '配信ソフトでのチャットボックスの設定（OBS、Streamlabs、XSplitなど）',
    guideStep1:
      '配信ソフト（OBS Studio、Streamlabs Desktop、XSplit、vMix、Lightstream、PRISM Live Studioなど）でブラウザソースを追加します。',
    guideStep2: 'コピーしたマルチチャットウィジェットのURLを貼り付けます。',
    guideStep3:
      'チャットボックスを表示したい大きさに合わせて幅と高さを設定します（縦なら400×600など）。',
    browserSourceHintSize: '（チャットボックスの推奨サイズ: 400×600）。',
    widgetUrlTip:
      '作成済みのウィジェットがありますか？ここにURLを貼り付けると設定が読み込まれ、必要なところだけ変更できます。',
    widgetUrlPlaceholder: '既存のウィジェットURLを貼り付けて編集',
    widgetUrlInvalid: 'チャットボックスのウィジェットURLではありません。',
    openReader: 'チャットリーダーを開く',
    openReaderHint:
      '自分のチャットをブラウザのタブやOBSのドックで読めます。切断されても自動で再接続し、途切れた箇所をすべて記録して、ページを更新しても履歴が残ります。',
    faq1Q: 'チャットボックスを使うのに、TwitchやKickへのサインインは必要ですか？',
    faq1A:
      'ログインは不要です。チャットボックスは両プラットフォームの公開チャットを匿名で読み取ります。',
    faq2Q: 'このマルチチャットウィジェットは7TVのエモートに対応していますか？',
    faq2A:
      'はい。7TVのチャンネルエモートとグローバルエモートはTwitchとKickの両方のメッセージに、BTTVとFFZのエモートはTwitchのメッセージにだけ表示されます。3つとも初期状態でオンになっていて、「エモート」メニューからそれぞれオフにできます。',
  },
  chatReader: {
    title: 'チャットリーダー',
    listLabel: 'チャットメッセージ',
    noChannel:
      'このリンクにはチャンネルが含まれていません。チャットボックスの設定ページからチャットリーダーを開いてください。',
    empty: '{channels}のメッセージを待っています…',
    statusConnecting: '接続中',
    statusConnected: '接続済み',
    statusReconnecting: '再接続中',
    notFound: 'チャンネルが見つかりません',
    networkOffline: 'オフラインです。インターネットが戻り次第、チャットは自動で再接続します。',
    retryIn: '{platform}のチャット接続が切れました。{seconds}秒後に再試行します。',
    retrying: '{platform}のチャット接続が切れました。再試行しています…',
    retryNow: '今すぐ再試行',
    fontSmaller: '文字を小さく',
    fontLarger: '文字を大きく',
    timestamps: 'メッセージの時刻を表示',
    clear: '履歴を消去',
    clearConfirm: 'もう一度クリックで消去',
    deleted: '（削除済み）',
    backToLive: '最新のチャットに戻る',
    newMessage: '新着メッセージ{count}件',
    newMessages: '新着メッセージ{count}件',
    eventConnected: '{platform}のチャットに接続しました: {channel}',
    eventDisconnected: '{platform}のチャット接続が切れました',
    eventReconnected: '{duration}後に{platform}のチャットに復帰しました',
    eventNetworkLost: 'インターネット接続が切れました',
    eventNetworkBack: 'インターネット接続が戻りました',
    eventChatCleared: 'モデレーターが{platform}のチャットを消去しました',
    eventResumed: '前回の表示から保存された履歴: {time}まで',
    durationSeconds: '{seconds}秒',
    durationMinutes: '{minutes}分{seconds}秒',
    durationHours: '{hours}時間{minutes}分',
  },
  obsBridge: {
    breadcrumb: 'OBS Bridgeの設定',
    title: 'OBS Bridgeの設定',
    intro:
      '信頼できる人に、TwitchやKickのチャットからOBSのシーン切り替えや、配信・録画の開始と停止を任せられます。ブリッジはブラウザのタブかOBSのドックで動き、OBSと直接やり取りします。',
    sectionChannels: 'チャンネル',
    sectionUsers: '許可ユーザー',
    usersLabel: 'チャットのユーザー名',
    usersTip:
      'このリストに入っている人だけがコマンドを使えます。リストが空だと、あなた自身も含めて誰も使えません。Twitchでは、チャンネルURLに含まれるログイン名と照合されます。',
    usersEmpty: 'まだ誰もいないため、誰もコマンドを使えません。',
    userPlatform: 'プラットフォーム',
    addUser: '追加',
    userPlaceholder: 'ユーザー名',
    removeUser: '{name}を削除',
    assignUser: '{name}を{platform}のユーザーにする',
    pickPlatformWarning:
      'TwitchとKickの両方が接続されているので、黄色の名前それぞれにプラットフォームを選んでください。選ぶまではコマンドを使えません。',
    sectionCommands: 'コマンド',
    commandsHint:
      'メッセージ全体がコマンドと一致する必要があります。大文字・小文字は区別しません。空欄にすると初期設定のままになります。',
    label: {
      cmdScene: 'シーン切り替え',
      cmdBrb: 'BRBシーン',
      cmdBack: 'メインに戻る',
      cmdStartStream: '配信開始',
      cmdStopStream: '配信終了',
      cmdStartRecord: '録画開始',
      cmdStopRecord: '録画停止',
    },
    action: {
      cmdScene: '{example}のように、指定した名前のシーンに切り替えます',
      cmdBrb: 'BRBシーンに切り替えます',
      cmdBack: 'メインシーンに戻ります',
      cmdStartStream: '配信を開始します',
      cmdStopStream: '配信を終了します',
      cmdStartRecord: '録画を開始します',
      cmdStopRecord: '録画を停止します',
    },
    sceneArg: '<名前>',
    sceneTip:
      'コマンド、スペース、シーン名の順に打ちます（例: !scene Gaming）。名前が完全に一致するシーンが優先され、なければ名前にその語を含む最初のシーンに切り替わります。',
    brbTip:
      'ツールページで選んだBRBシーンに切り替えます。初期設定では「!」が付かないので、リストに入っている人が brb と打つだけでシーンが切り替わります。',
    backTip:
      'ツールページで選んだメインシーンに戻ります。brbと同じく、初期設定では「!」が付きません。',
    sectionConnection: 'OBSとの接続',
    wsUrl: 'WebSocket URL',
    wsUrlTip:
      'OBSを別のパソコンで動かしている場合や、ポートを変更した場合にだけ必要です。空欄なら ws://127.0.0.1:4455 を使います。',
    wsUrlPlaceholder: 'ws://127.0.0.1:4455（初期設定）',
    wsPassword: 'WebSocketパスワード',
    wsPasswordTip:
      'OBSの「ツール → WebSocket サーバー設定 → 接続情報を表示」で確認できます。パスワードはツールURLに保存されるので、そのリンクはパスワードと同じように扱ってください。',
    wsPasswordPlaceholder: 'なければ空欄のまま',
    previewTitle: 'ツールのプレビュー',
    previewIframeTitle: 'OBS Bridgeのプレビュー',
    summaryNotListening:
      '{platform}のチャンネルが設定されていないため、{names}はまだコマンドを使えません。',
    summaryNoChannel:
      'チャンネルがまだありません。先にTwitchかKickのチャンネルを追加してください。',
    openTool: 'ツールを開く',
    openToolHint: 'ライブのブリッジを新しいタブで開きます。すぐにOBSとチャットに接続します。',
    toolUrlTip:
      'OBSのパスワードが含まれているので、パスワードと同じように扱ってください。人に教えたり、配信に映したりしないでください。',
    toolUrlHint:
      'ブラウザのタブかOBSのカスタムブラウザドックで開き、配信中は開いたままにしてください。',
    nextOpen: 'ブラウザのタブで開くか、OBSのカスタムブラウザドックに貼り付けます。',
    nextKeepOpen: 'そこでメインとBRBのシーンを選び、配信中はページを開いたままにします。',
    guideStep1:
      'OBSで「ツール → WebSocket サーバー設定」を開き、WebSocketサーバーを有効にして、「接続情報を表示」からパスワードをコピーします。',
    guideStep2: 'チャンネル、コマンドを使える人、パスワードを入力して、ツールURLをコピーします。',
    guideStep3:
      'ブラウザのタブかOBSのカスタムブラウザドックでURLを開き、メインとBRBのシーンを選びます。',
    guideStep4:
      'ドックを使う場合は、シーンを選んだあと「更新済みURLをコピー」を押して、ドックに貼り付けてください。ドックは作成したときのURLを開き続けるためです。',
    faq1Q: '!scene チャットコマンドはどう動きますか？',
    faq1A:
      'リストに入っている人が、コマンド、スペース、シーン名の順に打ちます（例: !scene Gaming）。OBS Bridgeはまず名前が完全に一致するシーンを探し（大文字・小文字は区別しません）、なければ名前にその語を含む最初のシーンを探して切り替えます。',
    faq2Q: 'OBSのWebSocketパスワードは安全ですか？',
    faq2A:
      'OBSへの接続は、ブラウザからOBSへ直接つながります。ただし、パスワードはツールURLに保存されていて、そのURLを開くとパスワードを含んだ状態でextensions.senchabot.comからページが読み込まれます。リンクはパスワードと同じように扱い、人に教えたり配信に映したりしないでください。',
    faq3Q: 'OBSのドックで選んだシーンが消えてしまうのはなぜですか？',
    faq3A:
      'シーンの選択とユーザーの変更は、ツールページのURLに保存されます。ブラウザのタブならページをブックマークすれば残りますが、OBSのドックは常に作成したときのURLを開きます。ツールページで「更新済みURLをコピー」を押し、新しいURLをドックに貼り付けてください。',
    tool: {
      title: 'OBS Bridge',
      connectionsTitle: '接続',
      status: {
        connecting: '接続中',
        connected: '接続済み',
        failed: '接続できませんでした',
        disconnected: '切断',
      },
      obsConnecting: '{url}に接続中…',
      obsConnected: '{url} · {time}から接続中',
      obsUnreachable:
        '{url}から応答がありません。OBSは起動していますか？「ツール → WebSocket サーバー設定」でサーバーは有効になっていますか？',
      obsWrongPassword:
        'OBSがパスワードを受け付けませんでした。URLのパスワードは、OBSのWebSocketパスワードと一致している必要があります。',
      obsNeedsPassword:
        'OBSはパスワードを求めていますが、このURLにはパスワードがありません。設定ページでWebSocketパスワードを入力し、新しいURLを使ってください。',
      obsRefused: 'OBSが接続を拒否しました: {reason}',
      obsClosed:
        'OBSとの接続が切れました。OBSが終了したか、WebSocketサーバーが停止した可能性があります。',
      retryIn: '{seconds}秒後に{attempt}回目の試行',
      retrying: '再試行中…',
      retryNow: '今すぐ試す',
      chat: {
        connecting: '接続中',
        connected: '受信中',
        reconnecting: '切断',
      },
      chatRetryIn: '{seconds}秒後に再接続',
      chatNotFound: '見つかりません',
      kickNotFound:
        '「{channel}」というKickチャンネルが見つかりませんでした。チャンネル名を確認してください。',
      activityTitle: '最近のコマンド',
      activityEmpty:
        'まだコマンドはありません。許可ユーザーがチャットでコマンドを打つと、ここに表示されます。',
      activityScene: '{scene}に切り替えました',
      activityStartStream: '配信を開始しました',
      activityStopStream: '配信を終了しました',
      activityStartRecord: '録画を開始しました',
      activityStopRecord: '録画を停止しました',
      activityNoScene: '「{query}」に一致するシーンがありません',
      activityOffline: 'OBSが接続されていなかったため、実行されませんでした',
      activityFailed: 'OBSがエラーを返しました: {message}',
      scenesTitle: 'シーン',
      scenes: 'シーン（{count}）',
      fetchingScenes: 'シーン一覧を読み込み中…',
      scenesOffline: 'OBSに接続すると、シーン一覧が表示されます。',
      mainScene: 'メインシーン',
      brbScene: 'BRBシーン',
      notSelected: '未選択',
      main: 'メイン',
      brb: 'BRB',
      setMain: '{scene}をメインシーンにする',
      setBrb: '{scene}をBRBシーンにする',
      assignMainBrbWarning:
        '下でメインとBRBのシーンを選んでください。選ばないと、{brb}と{back}の切り替え先がありません。',
      assignMainWarning:
        '下でメインシーンを選んでください。選ばないと、{back}の切り替え先がありません。',
      assignBrbWarning:
        '下でBRBシーンを選んでください。選ばないと、{brb}の切り替え先がありません。',
      sceneHint:
        'シーンの横の「メイン」か「BRB」を押すと割り当てられます。ほかのシーンには{command}で切り替えられます。',
      usersCount: '許可ユーザー（{count}）',
      copyUrl: '更新済みURLをコピー',
      copyUrlHint:
        'シーンの選択とユーザーの変更は、このページのURLに保存されます。OBSのドックは作成したときのURLを開き続けるので、コピーしたURLをドックの設定に貼り付けてください。',
      copyUrlManual: 'コピーに失敗しました。下のURLを選択して、手動でコピーしてください。',
      commands: 'チャットコマンド',
      footer: '配信中はこのページを開いたままにしてください。閉じるとブリッジは止まります。',
    },
  },
  subSprout: {
    breadcrumb: 'Sub Sproutの設定',
    title: 'Sub Sproutの設定',
    intro:
      'TwitchやKickで新しいサブスクが入るたびに成長する、カスタマイズできるサブスク目標の植物オーバーレイ。',
    sectionPlant: '植物',
    plantVariety: '植物の種類',
    plantVarietyTip:
      'サブスク1件ごとに植物が1段階育ちます。段階が多いほど、育ちきるまでに多くのサブスクが必要です。',
    stagesSuffix: '{stages}段階',
    selectionMode: '植物の切り替え',
    selectionModeTip:
      '最後の段階のあと、植物は最初から育ち直します。同じ植物、リストの次の植物、ランダムな別の植物から選べます。「順番」と「ランダム」ではつる植物は選ばれません。',
    fixed: '同じ植物',
    cycle: '順番',
    random: 'ランダム',
    wateringEffect: '水やりエフェクト',
    wateringEffectTip:
      '植物が育つたびに、短い雨かキラキラのアニメーションが流れます。つる植物では表示されません。',
    showSubCountEffect: 'サブスク数を表示',
    subCountTip: '一度に入ったサブスクの数を表示します。5件のギフトなら x5 のように表示されます。',
    showPotLabel: '鉢に段階を表示',
    potLabelTip: '鉢に 3/10 のように段階を書きます。つる植物では表示されません。',
    previewTitle: 'サブスク目標の植物プレビュー',
    previewIframeTitle: 'Sub Sproutのプレビュー',
    previewSpeed: 'プレビューの成長速度',
    previewSpeedValue: '{rate}×',
    previewHint:
      'プレビューは模擬サブスクで育ちます。配信では、チャンネルに入った実際のサブスク、継続サブスク、ギフトサブで育ちます。',
    widgetUrlTip:
      '作成済みのウィジェットがありますか？ここにURLを貼り付けると設定が読み込まれ、必要なところだけ変更できます。',
    widgetUrlPlaceholder: '既存のウィジェットURLを貼り付けて編集',
    widgetUrlInvalid: 'Sub SproutのウィジェットURLではありません。',
    browserSourceHintSize: '（推奨サイズ: 800×600）。',
    guideTitle: '配信ソフトでの設定（OBS、Streamlabs、XSplitなど）',
    guideStep1:
      '配信ソフト（OBS Studio、Streamlabs Desktop、XSplit、vMix、Lightstream、PRISM Live Studioなど）でブラウザソースを追加します。',
    guideStep2: 'コピーしたサブスク目標の植物のURLを貼り付けます。',
    guideStep3: '幅を800、高さを600に設定します。',
    guideStep4:
      '配信者とモデレーターは、チャットで !grow と打つと手動で成長させられ、!grow reset で植物を最初からやり直せます。',
    faq1Q: 'サブスク目標の植物を使うのにサインインは必要ですか？',
    faq1A:
      '登録もOAuthログインも不要です。Sub Sproutは公開チャットのイベントを匿名で受け取ります。',
    faq2Q: 'サブスク目標の植物が育ちきるとどうなりますか？',
    faq2A:
      '植物が育ちきると、次のサブスクで「植物の切り替え」の設定に従って最初から育ち直します。同じ植物、次の種類、ランダムな植物のいずれかです。',
    faq3Q: 'ブラウザソースを再読み込みすると、植物は最初に戻りますか？',
    faq3A:
      'いいえ。植物はOBSの中に保存されるので、再読み込みしても、シーンを切り替えても、次の配信でも、到達した段階がそのまま残ります。最初からやり直すには、モデレーターにチャットで !grow reset と打ってもらってください。',
  },
  subathon: {
    breadcrumb: 'Subathon Timerの設定',
    title: 'Subathon Timerの設定',
    intro:
      'TwitchとKick向けのサブアソンタイマー。時間はカウントダウンしていき、サブスク、ギフトサブ、BitsのCheer、Kicksのギフトが入るたびに時間が追加されます。ゲーム風にゼロへ向かって減っていくHPバー、大きな時計、リングで表示でき、それぞれ何分追加するかも自分で決められます。',
    style: 'スタイル',
    styleTip:
      'HPバーはゲームのキャラクターのように100%からゼロへ減っていきます。細いバーはタイトルと時間をスリムなバーの中に収めます。時計は大きな数字で表示します。リングは円が少しずつ欠けていきます。',
    styleBar: 'HPバー',
    styleThin: '細いバー',
    styleClock: '時計',
    styleRing: 'リング',
    color: 'カラー',
    colorTip: 'HPは、時間が減るにつれて緑から黄、赤へと変わります。ほかは単色のままです。',
    colors: {
      hp: 'HP（緑から赤）',
      green: '緑',
      purple: '紫',
      red: '赤',
      gold: 'ゴールド',
      cyan: 'シアン',
      pink: 'ピンク',
    },
    titleLabel: 'タイトル',
    titleTip: 'タイマーの横に表示されます。空欄にするとタイトルは表示されません。',
    titlePlaceholder: 'タイトルなし',
    showPercent: 'パーセントを表示',
    showPercentTip:
      'タイマーがどれだけ埋まっているかを表示します。100%はこれまでで最も時間が多かった時点なので、100%を超えることはありません。',
    showPops: '追加時間を表示',
    showPopsTip: '時間が追加されるたびに、視聴者の名前と +1:00 が浮かび上がります。',
    sectionTimer: 'タイマー',
    startTime: '開始時間',
    startTimeTip:
      'タイマーの最初の時間です。新しいサブアソンにだけ適用されます。新しい値でやり直すには、チャットで !subathon reset と打ってください。',
    maxTime: '上限時間',
    maxTimeTip: 'タイマーはこれ以上の時間を持ちません。上限を超える分は追加されません。',
    maxTimeOff: '上限なし',
    startMode: '開始',
    startModeTip:
      'コマンドの場合、あなたかモデレーターがチャットで打つまで、タイマーは一時停止したまま待ちます。「すぐに」は、OBSでオーバーレイが読み込まれた時点で開始します。',
    startCommand: '{command}で開始',
    startAuto: 'すぐに',
    sectionValues: '追加時間',
    valuesHint: '0にするとその項目はオフになります。',
    dynamicRates: '残り時間でレートを変える',
    dynamicRatesTip: '残り時間が十分あるときは、2つ目のレートを使います。',
    shiftAt: 'しきい値',
    shiftAtTip: '残り時間がこの値以上のあいだは、2つ目のレートが使われます。',
    tier2Rates: 'しきい値以上のとき',
    perSub: 'サブスク1件',
    perSubTip: '新規サブスクと継続サブスクごと。TwitchではTier 1またはPrimeのサブスクです。',
    perSubKickTip: '新規サブスクと継続サブスクごと。',
    perGift: 'ギフトサブ1件',
    perGiftTip:
      'ギフトに含まれるサブスク1件ごとに加算されるので、5件のギフトならこの5倍になります。',
    perBits: '500 Bitsごと',
    perBitsTip:
      'サブスク1件分くらいの金額です。ほかの量は割合で加算されるので、100 Bitsなら5分の1です。',
    perKicks: '500 Kicksごと',
    perKicksTip: 'ほかの量は割合で加算されるので、100 Kicksなら5分の1です。',
    showRates: 'タイマーに表示',
    showRatesTip:
      'サブスク、ギフトサブ、500 BitsまたはKicksで何分増えるかを一覧で表示するので、視聴者は自分のサブスクの価値がわかります。0の項目は表示されません。TwitchとKickで値が違う場合は交互に表示されます。',
    ratesLanguage: 'タイマーの言語',
    ratesLanguageTip:
      '「ギフトサブ」や「分」など、一覧に表示される言葉の言語です。OBSが何語で動いていても、OBSに入れたURLがこの設定を保持します。',
    rateSub: 'サブスク',
    rateGift: 'ギフトサブ',
    rateBits: '{amount} Bits',
    rateKicks: '{amount} Kicks',
    rateBitsKicks: '{amount} Bits/Kicks',
    tiers: 'Tier 2と3を多めにカウント',
    tiersTip:
      'TwitchではTier 2のサブスクはサブスク2件分、Tier 3は5件分の時間を追加します。価格に合わせた比率です。',
    unitHours: '時間',
    unitMinutes: '分',
    sectionCommands: 'チャットコマンド',
    commandsIntro: '配信者とモデレーターは、TwitchやKickのチャットからタイマーを操作できます。',
    cmdStart: 'タイマーを開始・再開します',
    cmdPause: '一時停止します',
    cmdAdd: '時間を追加します',
    cmdRemove: '時間を減らします',
    cmdSet: '残り時間を設定します',
    cmdReset: '開始時間からやり直します',
    commandsDurations:
      '時間は 10m、1h30m、45s、1:30:00 のように書きます。数字だけなら分として扱われます。',
    previewTitle: 'Subathon Timerのプレビュー',
    previewIframeTitle: 'Subathon Timerのプレビュー',
    previewHint:
      'プレビューでは模擬のサブスク、ギフト、Cheerが流れます。配信ではタイマーはリアルタイムで進み、時間を追加するのはあなたのチャットだけです。',
    previewSpeed: 'プレビューの速度',
    previewSpeedTip: '1×はリアルタイムです。60×なら、1時間のタイマーが約1分で終わります。',
    previewSpeedValue: '{rate}×',
    testTitle: '試してみる:',
    testViewer: 'あなた',
    testSub: '+1 サブスク',
    testGift: '+5 ギフト',
    testBits: '+500 Bits/Kicks',
    testRemove: '−10分',
    testPause: '一時停止 / 再開',
    testReset: 'リセット',
    widgetUrlTip:
      '作成済みのウィジェットがありますか？ここにURLを貼り付けると設定が読み込まれ、必要なところだけ変更できます。',
    widgetUrlPlaceholder: '既存のウィジェットURLを貼り付けて編集',
    widgetUrlInvalid: 'Subathon TimerのURLではありません。',
    browserSourceHintSize: '（推奨サイズ: 800×300）。',
    guideTitle: '配信ソフトでの設定（OBS、Streamlabs、XSplitなど）',
    guideStep1:
      '配信ソフト（OBS Studio、Streamlabs Desktop、XSplit、vMix、Lightstream、PRISM Live Studioなど）でブラウザソースを追加します。',
    guideStep2: 'コピーしたサブアソンタイマーのURLを貼り付けます。',
    guideStep3: '幅を800、高さを300に設定します。',
    guideStep4:
      '配信を始めたら、チャットで !subathon start と打ちます。モデレーターも時間の追加、削除、一時停止ができます。',
    faq1Q: 'OBSを閉じたり、ブラウザソースを再読み込みしたりするとどうなりますか？',
    faq1A:
      'タイマーはOBSの中に保存されるので、元の状態に戻ります。OBSを閉じているあいだも、本物の締め切りのようにカウントダウンは続きます。閉じているあいだに入ったサブスクは検知できないので、モデレーターが !subathon add で追加できます。',
    faq2Q: 'タイマーがゼロになるとどうなりますか？',
    faq2A:
      'タイマーはゼロで止まり、HPバーには K.O. と表示されます。新しいサブスクが入っても時間は増えません。モデレーターは !subathon add か !subathon set で再開させるか、!subathon reset で新しく始められます。',
    faq3Q: '新しいサブアソンを始めたり、開始時間を変えたりするには？',
    faq3A:
      'チャットで !subathon reset と打ちます。タイマーはURLにある開始時間に戻ります。タイマーを初めて開始するまでは、URLの新しい開始時間が自動で適用されます。',
    faq4Q: 'ログインやアカウント連携は必要ですか？',
    faq4A:
      'いいえ。タイマーはサブスク、ギフト、Bits、Kicks、モデレーターのコマンドを、TwitchとKickの公開チャットから、ログインしていない視聴者と同じように読み取ります。',
  },
  goal: {
    breadcrumb: 'サブスク目標の設定',
    title: 'サブスク目標の設定',
    intro:
      'TwitchとKick向けのサブスク目標バー。両方のチャットの新規サブスク、継続サブスク、ギフトサブが1件ずつバーを埋め、目標を達成するとバーにトロフィーが降ってきます。カウントの開始値と目標値は自分で決められ、モデレーターはチャットからカウントを修正できます。',
    sectionGoal: '目標',
    start: '開始カウント',
    startTip:
      'カウントの開始値です。ダッシュボードのサブスク数を入れるか、この配信の分だけ数えるなら0にします。あとで変えると、新しい数からカウントし直します。',
    target: '目標',
    targetTip: 'このカウントでバーが満タンになります。カウントは目標を超えても続きます。',
    countsHint:
      'サブスクと継続サブスクは、Primeもどのティアも1件ずつ加算されます。ギフトは含まれるサブスク1件ごとに1加算されます。',
    style: 'スタイル',
    styleTip:
      '「バー」は目標のタイトルとカウントをバーの上に表示します。「細いバー」はタイトルとカウントをスリムなバーの中に直接収めます。',
    styleBar: 'バー',
    styleThin: '細いバー',
    color: 'カラー',
    titleLabel: 'タイトル',
    titleTip: 'バーの上に表示されます。空欄にするとタイトルは表示されません。',
    titlePlaceholder: 'タイトルなし',
    showPops: '新しいサブスクを表示',
    showPopsTip: 'サブスクのたびに視聴者の名前と +1 が、5件のギフトなら +5 が浮かび上がります。',
    sectionCommands: 'チャットコマンド',
    commandsIntro:
      '配信者とモデレーターは、TwitchやKickのチャットからカウントを修正できます。たとえば、OBSを閉じていたあいだに入ったサブスクを追加するときに使います。',
    cmdAdd: 'カウントにサブスクを追加します。数を省略すると1',
    cmdRemove: 'カウントからサブスクを減らします。数を省略すると1',
    cmdSet: 'カウントを設定します',
    cmdReset: '開始カウントに戻します',
    previewTitle: 'サブスク目標のプレビュー',
    previewIframeTitle: 'サブスク目標のプレビュー',
    previewHint:
      'プレビューでは目標に届くまで模擬のサブスクとギフトが流れ、達成すると最初からやり直します。配信では、カウントを増やすのはあなたのチャットだけです。',
    testTitle: '試してみる:',
    testViewer: 'あなた',
    testSub: '+1 サブスク',
    testGift: '+5 ギフト',
    testReach: '目標達成',
    testReset: 'リセット',
    widgetUrlTip:
      '作成済みのウィジェットがありますか？ここにURLを貼り付けると設定が読み込まれ、必要なところだけ変更できます。',
    widgetUrlPlaceholder: '既存のウィジェットURLを貼り付けて編集',
    widgetUrlInvalid: 'サブスク目標のURLではありません。',
    browserSourceHintSize: '（推奨サイズ: 800×260）。',
    guideTitle: '配信ソフトでの設定（OBS、Streamlabs、XSplitなど）',
    guideStep1:
      '配信ソフト（OBS Studio、Streamlabs Desktop、XSplit、vMix、Lightstream、PRISM Live Studioなど）でブラウザソースを追加します。',
    guideStep2: 'コピーしたサブスク目標のURLを貼り付けます。',
    guideStep3: '幅を800、高さを260に設定します。',
    guideStep4:
      'カウントがずれたときは、あなたかモデレーターがチャットで !goal set を使って直せます。',
    faq1Q: 'TwitchやKickからサブスク数を読み込まないのはなぜですか？',
    faq1A:
      'どちらのプラットフォームも、ログインしていないページにはチャンネルのサブスク数を見せません。この目標バーはログインを求めないので、開始カウントを一度だけ入力してもらい、そこから入ってくるサブスクとギフトをすべて加算していきます。',
    faq2Q: 'OBSを閉じたり、ブラウザソースを再読み込みしたりするとどうなりますか？',
    faq2A:
      'カウントはOBSの中に保存されるので、次の配信でも元の状態に戻ります。OBSを閉じているあいだに入ったサブスクは検知できないので、モデレーターが !goal add で追加できます。',
    faq3Q: '継続サブスクやギフトサブもカウントされますか？',
    faq3A:
      'はい。新規サブスクと継続サブスクは1件ずつ、ギフトは含まれるサブスク1件ごとに1加算されるので、5件のギフトなら5増えます。Twitchでは視聴者が継続サブスクをチャットでシェアしたとき、Kickでは更新されたときにカウントされます。',
    faq4Q: 'フォロワー目標は作れますか？',
    faq4A:
      'まだできません。TwitchもKickも、ログインしていないページには新しいフォローを見せないため、この目標はどちらのプラットフォームでも同じようにサブスクを数えます。',
  },
  frames: {
    breadcrumb: '配信フレームの設定',
    title: '配信フレームの設定',
    intro:
      'カメラ、チャット、配信画面全体にそのまま使えるフレーム。選んだプリセットが、形や装飾、動きまでそのゲームの雰囲気でフレームを描きます。Dynastyなら楼閣の屋根、揺れる房飾り、舞い散る花びら。Blocksなら草ブロックと揺らめく松明。チャンネルの接続は不要です。URLをOBSに追加して、カメラやチャットをフレームの下に置くだけです。',
    sectionPiece: 'フレーム',
    piece: '何にフレームを付けますか？',
    pieceTip:
      'パーツごとに別々のブラウザソースです。3つとも同じプリセットで追加すれば、画面全体の雰囲気がそろいます。',
    pieces: {
      camera: 'カメラ',
      chat: 'チャット',
      screen: '画面',
    },
    pieceHints: {
      camera: 'Webカメラ用の16:9フレーム。中央の開口部にカメラを合わせてください。',
      cameraPortrait:
        'スマホのカメラや縦置きのWebカメラ用の9:16フレーム。中央の開口部にカメラを合わせてください。',
      chat: 'チャットボックス用の、ヘッダー付きの縦長フレーム。ヘッダーの下にチャットボックスを置いてください。',
      screen:
        '配信画面全体の縁に沿った細いフレーム。装飾は四隅に収まるので、ゲーム画面を隠しません。',
    },
    orientation: '向き',
    orientations: {
      landscape: '横向き',
      portrait: '縦向き',
    },
    labelLabel: 'ラベル',
    labelTips: {
      camera:
        'カメラの上のタブに表示されます。チャンネル名などを入れましょう。空欄なら、タブには装飾だけが残ります。',
      chat: 'チャットフレームの上のタブに表示されます。空欄なら、タブには装飾だけが残ります。',
      screen: '画面下中央のプレートに表示されます。空欄にするとプレートは非表示になります。',
    },
    labelPlaceholder: 'ラベルなし',
    color: 'カラー',
    motion: 'アニメーション',
    motionTip:
      '光るライン、光のスイープ、提灯や松明、火花など、プリセットごとのちょっとした演出です。オフにするとフレームは静止します。',
    previewTitle: '配信フレームのプレビュー',
    previewIframeTitle: '配信フレームのプレビュー',
    previewHint:
      'プレビューの人物シルエットとチャットの行は、ただのダミーです。配信ではフレームの中央が透明なので、下にあるカメラやチャットが透けて見えます。',
    widgetUrlTip:
      '作成済みのフレームがありますか？ここにURLを貼り付けると設定が読み込まれ、必要なところだけ変更できます。',
    widgetUrlPlaceholder: '既存のフレームURLを貼り付けて編集',
    widgetUrlInvalid: '配信フレームのURLではありません。',
    browserSourceHintSize: '（推奨サイズ: {width}×{height}）。',
    guideTitle: '配信ソフトでの設定（OBS、Streamlabs、XSplitなど）',
    guideStep1:
      '配信ソフト（OBS Studio、Streamlabs Desktop、XSplit、vMixなど）でブラウザソースを追加し、フレームのURLを貼り付けます。',
    guideStep2:
      '幅と高さを推奨サイズに設定します。正方形のカメラなら、サイズを自分で入力してください。フレームはどんなサイズにも合わせて描かれます。',
    guideStep3:
      '「ソース」リストでフレームをカメラやチャットボックスより上に移動し、シーン上でそれらに重ねます。',
    guideStep4:
      'カメラは開口部を埋める大きさにしつつ、フレームの外枠からはみ出さないようにします。640 × 360 のフレームなら 590 × 296、360 × 640 の縦向きフレームなら 306 × 572 でぴったりです。',
    faq1Q: 'フレームだけでカメラやチャットが表示されますか？',
    faq1A:
      'いいえ。フレームの中央は透明で、あくまで装飾です。カメラとチャットボックスは別のソースとしてOBSに追加し、フレームの下に置いてください。',
    faq2Q: 'TwitchやKickのアカウント連携は必要ですか？',
    faq2A:
      'いいえ。フレームはチャットを読まず、チャンネル名も必要ありません。Twitch、Kick、ほかのどこで配信していても同じように使えます。',
    faq3Q: 'カメラフレームを別のサイズで使えますか？',
    faq3A:
      'はい。縦向きのカメラなら「向き」を「縦向き」にすると、推奨サイズが 360 × 640 になります。フレームはブラウザソースに合わせて描かれるので、正方形のカメラなら幅と高さをそろえるだけで、装飾も一緒に拡大縮小されます。',
    faq4Q: 'フレームのイラストはゲームから取ってきたものですか？',
    faq4A:
      'いいえ。楼閣の屋根、提灯、ピクセルブロックなど、イラストはすべてゼロから描いたもので、ゲームのロゴやアートは使っていません。プリセットは、それぞれのゲームの雰囲気を表現したファンメイドのスタイルです。',
  },
  countdown: {
    breadcrumb: '配信カウントダウンの設定',
    title: '配信カウントダウンの設定',
    intro:
      '配信の中で、まだ何も始まっていない時間のためのカウントダウン。配信開始前の数分、途中の休憩、配信を締める前の最後の数分に使えます。時間の長さか開始したい時刻を指定すると、選んだプリセットの見た目で表示されます。チャンネルは不要ですが、入力しておけばモデレーターがチャットから時間を延ばせます。',
    scenes: {
      starting: {
        label: '開始前',
        title: 'まもなく開始',
        done: '配信スタート！',
        hint: '配信開始前に表示しておくシーン用。',
      },
      break: {
        label: '休憩',
        title: 'すぐ戻ります',
        done: 'ただいま！',
        hint: '途中の休憩用。食事、小休止、ちょっとした用事などに。',
      },
      ending: {
        label: '終了',
        title: 'まもなく配信終了',
        done: 'ご視聴ありがとうございました！',
        hint: '最後の数分用。チャットに残り時間を知らせます。',
      },
    },
    sectionCountdown: 'カウントダウン',
    scene: '何に使いますか？',
    sceneTip: '文言とアイコンが決まります。テキストは下で自由に書き換えられます。',
    mode: 'カウント方式',
    modes: {
      duration: '時間の長さ',
      clock: '時刻',
    },
    modeTip:
      '時間の長さは、ブラウザソースが読み込まれた瞬間からスタートします。時刻は必ずその時刻に終わるので、何時間も前からソースを追加しておけます。',
    duration: '長さ',
    durationUnit: '分',
    durationTip: 'カウントダウンの長さです。1分から24時間まで設定できます。',
    atLabel: '時刻',
    atTip:
      '21:00 のような24時間表記の時刻で、OBSを動かしているパソコンの時計が基準です。今日すでに過ぎている時刻なら、翌日のその時刻に向けてカウントします。',
    atPlaceholder: '21:00',
    atInvalid: '21:00 のように24時間表記で入力してください。',
    ending: 'ゼロになったら',
    endings: {
      text: 'メッセージを表示',
      hold: '00:00 のまま',
      hide: '非表示にする',
    },
    endingTip: 'カウントダウンが終わってから、シーンを切り替えるまで画面に残すものです。',
    sectionText: 'テキスト',
    titleLabel: '見出し',
    titleTip: '時計の上に表示されます。空欄なら、選んだシーンの文言を使います。',
    titlePlaceholder: 'シーンの文言',
    noteLabel: 'メモ',
    noteTip: '時計の下に表示する一行です。休憩の理由などに。空欄なら表示されません。',
    notePlaceholder: 'メモなし',
    doneLabel: 'ゼロのときのメッセージ',
    doneTip: '時間切れになると時計の代わりに表示されます。空欄なら、シーンの文言を使います。',
    look: '背景',
    looks: {
      card: 'パネル',
      plain: 'パネルなし',
    },
    lookTip: '時計の後ろにパネルを敷くか、テキストをシーンに直接表示するかを選びます。',
    color: 'カラー',
    showBar: 'プログレスバー',
    showBarTip: '時計の下に、残り時間とともに減っていくバーを表示します。',
    motion: 'アニメーション',
    motionTip: '最後の1分間、時計が脈打つように動きます。オフにするとすべて静止します。',
    channelsTip:
      'チャットコマンドを使う場合にだけ必要です。チャンネルがなくても、カウントダウン自体は動きます。',
    sectionCommands: 'チャットコマンド',
    commandsIntro:
      'チャンネルを入力しておくと、配信者とモデレーターがTwitchやKickのチャットからカウントダウンを変更できます。たとえば、席を外しているあいだに開始を遅らせたいときに便利です。',
    cmdAdd: '時間を追加します: 5m、90s、1h30m',
    cmdRemove: '時間を減らします',
    cmdSet: '残り時間を設定します',
    cmdPause: '一時停止します。start で再開',
    cmdReset: 'カウントダウンを最初からやり直します',
    previewTitle: '配信カウントダウンのプレビュー',
    previewIframeTitle: '配信カウントダウンのプレビュー',
    previewHint:
      'プレビューは早送りで流れるので、カウントダウン全体を確認できます。終わると最初からやり直します。配信ではリアルタイムでカウントダウンします。',
    testTitle: '試してみる:',
    testAdd: '+1分',
    testRemove: '-1分',
    testPause: '一時停止',
    testFinish: 'ゼロまで飛ばす',
    widgetUrlTip:
      '作成済みのカウントダウンがありますか？ここにURLを貼り付けると設定が読み込まれ、必要なところだけ変更できます。',
    widgetUrlPlaceholder: '既存のカウントダウンURLを貼り付けて編集',
    widgetUrlInvalid: '配信カウントダウンのURLではありません。',
    browserSourceHintSize: '（推奨サイズ: 1920×1080）。',
    guideTitle: '配信ソフトでの設定（OBS、Streamlabs、XSplitなど）',
    guideStep1:
      '開始前、休憩、終了のシーンにブラウザソースを追加し、カウントダウンのURLを貼り付けます。',
    guideStep2: '時計がシーンの中央に来るように、幅を1920、高さを1080に設定します。',
    guideStep3:
      '「シーンがアクティブになったときにブラウザの表示を更新する」にチェックを入れます。そのシーンに切り替えるたびに、カウントダウンが最初から始まります。',
    guideStep4:
      'シーンに切り替えるとスタートします。チャンネルを入力しておけば、席を外しているあいだにモデレーターが !countdown add 5m で時間を延ばせます。',
    faq1Q: 'カウントダウンはいつ始まりますか？',
    faq1A:
      'ブラウザソースが読み込まれた瞬間です。OBSを起動したときか、「シーンがアクティブになったときにブラウザの表示を更新する」にチェックを入れたシーンに切り替えたときです。これで休憩のカウントダウンはBRBシーンに移るたびに最初から始まり、まだ配信中のうちに時間切れになることがありません。',
    faq2Q: '21:00 のように、告知した時刻までカウントダウンできますか？',
    faq2A:
      'はい。「カウント方式」を「時刻」にして 21:00 と入力します。OBSを動かしているパソコンの時計が基準なので、何時間も前からソースを追加しておいても 21:00 ちょうどに終わります。今日の 21:00 をすでに過ぎていれば、翌日の 21:00 に向けてカウントします。',
    faq3Q: 'TwitchやKickのアカウント連携は必要ですか？',
    faq3A:
      'いいえ。カウントダウンはチャンネルもログインもなしで動きます。!countdown コマンドを使いたい場合だけチャンネルを入力してください。その場合も、ほかのウィジェットと同じように公開チャットを読み取るだけです。',
    faq4Q: 'ゼロになるとどうなりますか？',
    faq4A:
      '「ゼロになったら」で選んだとおりになります。「配信スタート！」のようなメッセージ、00:00 で止まった時計、またはオーバーレイが消えて何もないシーンのいずれかです。シーンが勝手に切り替わることはありません。',
  },
  poll: {
    breadcrumb: 'チャット投票の設定',
    title: 'チャット投票の設定',
    intro:
      'TwitchとKick向けのチャット投票。あなたかモデレーターがチャットから投票を出すと、視聴者は番号を打って投票し、配信上のバーがリアルタイムで伸びていきます。両方のチャットの票がひとつの投票に集まり、1人1票でカウントされ、時間切れになると勝者が表示されます。',
    sectionPoll: '用意しておく投票',
    question: '質問',
    questionTip: '選択肢の上に表示されます。質問を声で伝えるなら空欄でかまいません。',
    questionPlaceholder: '次は何をプレイする？',
    options: '選択肢',
    optionsTip:
      '視聴者は選択肢の横の番号か、選択肢そのものを打って投票します。選択肢は最大6つです。',
    optionLabel: '選択肢{n}',
    optionPlaceholder: '選択肢{n}',
    removeOption: '選択肢{n}を削除',
    addOption: '+ 選択肢を追加',
    pollHint:
      'URLに保存されます。チャットで{command}と打つと表示されます。モデレーターは、いつでもチャットで新しい投票を出すこともできます。',
    sectionVoting: '投票',
    duration: '投票時間',
    durationTip:
      '投票を受け付ける時間です。チャットでは、モデレーターが投票ごとに別の長さを指定したり、早めに締め切ったり、時間を延ばしたりできます。',
    durationOff: 'タイマーなし: モデレーターが !poll end と打つまで投票を受け付けます。',
    hold: '結果の表示時間',
    holdTip: '投票終了後に結果を表示しておく時間です。その後、投票は画面から消えます。',
    holdOff: '次の投票か !poll cancel まで結果を表示し続けます。',
    delay: '配信遅延',
    delayTip:
      '視聴者の画面はチャットより数秒遅れているので、「残り1秒」で打たれた票はチャットに遅れて届きます。タイマー終了後もこの秒数だけ票をカウントし続けます。TwitchもKickも、ふつうは2秒から10秒ほど遅れています。',
    voters: '投票できる人',
    votersTip: '「サブスク」は、サブスクかファウンダーのバッジを持つ視聴者と、あなたです。',
    votersAll: '全員',
    votersSubs: 'サブスク',
    subWeight: 'サブスクの票の重み',
    subWeightTip: 'サブスクの1票がこの回数分カウントされます。投票画面にもそのことが表示されます。',
    subWeightValue: '{n}×',
    change: '投票の変更を許可',
    changeTip:
      'オン: 別の番号を打つと票が移ります。オフ: 最初の票で確定します。どちらでも1人1票です。',
    blind: '終了まで結果を隠す',
    blindTip:
      '投票中はバーを隠すので、序盤の票にほかの人が流されません。表示されるのは票数だけです。',
    color: 'カラー',
    position: '位置',
    positionTip:
      'ブラウザソース内で投票が置かれる位置です。選択肢の数に応じて、そこから伸びていきます。',
    positionTop: '上',
    positionBottom: '下',
    language: '投票の言語',
    languageTip:
      '「結果」や、クイック投票の「はい」「いいえ」など、投票に表示される言葉の言語です。',
    unitMinutes: '分',
    unitSeconds: '秒',
    sectionCommands: 'チャットコマンド',
    commandsIntro:
      '配信者とモデレーターは、TwitchやKickのチャットから投票を操作できます。新しい投票の各項目は | で区切ります。',
    exampleQuestion: '質問',
    cmdNew: '選択肢2個から6個で新しい投票を出します',
    cmdNewTime: '同じく、90s、2m、1:30 のように長さを指定して出します',
    cmdYesNo: '「はい」「いいえ」のクイック投票を出します',
    cmdStart: 'このページで用意した投票を出します',
    cmdExtend: '投票の時間を延ばします',
    cmdEnd: '今すぐ投票を締め切って結果を表示します',
    cmdCancel: '投票を画面から消します',
    votingIntro:
      '視聴者は、番号だけ（2）、!vote 2、または選択肢のテキストそのものを打って投票します。「2 お願い」のように余計な言葉が入ったメッセージはカウントされません。Twitchの /vote コマンドはTwitch純正の投票用なので、チャットには番号を打つよう伝えてください。',
    previewTitle: 'チャット投票のプレビュー',
    previewIframeTitle: 'チャット投票のプレビュー',
    previewHint:
      'プレビューでは模擬投票者による投票がリアルタイムより速く流れ、終わると次の投票が始まります。配信では、あなたかモデレーターが出したときだけ投票が表示されます。',
    testTitle: '試してみる:',
    testVotes: '+{count}票',
    testExtend: '+30秒',
    testEnd: '今すぐ締め切る',
    testNew: '新しい投票',
    widgetUrlTip:
      '作成済みのウィジェットがありますか？ここにURLを貼り付けると設定が読み込まれ、必要なところだけ変更できます。',
    widgetUrlPlaceholder: '既存のウィジェットURLを貼り付けて編集',
    widgetUrlInvalid: 'チャット投票のURLではありません。',
    browserSourceHintSize: '（推奨サイズ: 640×560）。',
    guideTitle: '配信ソフトでの設定（OBS、Streamlabs、XSplitなど）',
    guideStep1:
      '配信ソフト（OBS Studio、Streamlabs Desktop、XSplit、vMix、Lightstream、PRISM Live Studioなど）でブラウザソースを追加します。',
    guideStep2: 'コピーしたチャット投票のURLを貼り付けます。',
    guideStep3: '幅を640、高さを560に設定します。',
    guideStep4:
      '投票が始まるまで、ソースは空のままです。チャットで !poll start か !poll 質問 | A | B と打ってください。',
    faq1Q: '視聴者はどうやって投票しますか？',
    faq1A:
      'チャットで選択肢の番号（2など）を打ちます。!vote 2 や選択肢のテキストそのものでも投票でき、大文字・小文字やトルコ語の文字の有無は問いません。メッセージ全体が票である必要があるので、「2 お願い」や 4Head はカウントされません。',
    faq2Q: '1人の視聴者が複数回投票できますか？',
    faq2A:
      'いいえ。TwitchやKickのアカウントごとに1票です。投票の変更がオンなら、新しい番号を打つと票が移るだけで、2票目が増えることはありません。投票中にモデレーターがアカウントをタイムアウトやBANにすると、その票は取り消されるので、スパムボット対策にもなります。',
    faq3Q: 'TwitchやKick純正の投票機能を使わないのはなぜですか？',
    faq3A:
      'この投票はTwitchとKickの票をひとつの結果にまとめ、どちらでも同じように動きます。Twitchの純正投票はログインしないと読み取れませんが、このオーバーレイはログインを求めません。アフィリエイトやパートナーである必要もありません。',
    faq4Q: 'OBSを閉じたり、ブラウザソースを再読み込みしたりするとどうなりますか？',
    faq4A:
      '投票と票はOBSの中に保存されるので、元の状態に戻ります。OBSを閉じているあいだもタイマーは進みますが、そのあいだに打たれた票は検知できません。',
    faq5Q: 'タイマーがゼロになったあとも票がカウントされるのはなぜですか？',
    faq5A:
      '視聴者はチャットより数秒遅れて配信を見ているので、視聴者のタイマーが残り1秒のとき、チャットではすでに終わっています。「配信遅延」の設定で、さらに数秒（初期設定は5秒）票をカウントし続け、そのあとに勝者を表示します。',
    overlay: {
      label: '投票',
      closing: '最後の投票',
      results: '結果',
      tie: '引き分け',
      tieHint: '引き分け！',
      winner: '勝者: {option}',
      noVotes: '票なし',
      hidden: '結果は投票終了後に表示',
      howTo: 'チャットで 1 から {last} を入力',
      howToTwo: 'チャットで 1 か 2 を入力',
      subsOnly: 'サブスク限定',
      subBonus: 'サブスクの票 ×{n}',
      votes: '{count}票',
      voteOne: '1票',
      yes: 'はい',
      no: 'いいえ',
      sampleQuestion: '次は何をプレイする？',
      sampleOption1: 'ホラーゲーム',
      sampleOption2: 'RTA',
      sampleOption3: '視聴者参加型',
    },
  },
  streamAlerts: {
    breadcrumb: '配信アラートの設定',
    title: '配信アラートの設定',
    intro:
      'TwitchとKick向けのアニメーション付き配信アラート。新規サブスク、ギフトサブ、Bits、Kicks、レイドのそれぞれに専用のアイコンと効果音があり、順番に表示されます。カラーを選び、見出しを書き換え、アラートを出すギフト、Cheer、レイドの最小数を設定できます。',
    color: 'カラー',
    theme: 'テーマ',
    themeTip:
      'ネオンは、シンセ音が鳴る角ばったSF風のバナー。セレスティアルは、星空の下に浮かぶ金色のラインのカードで、ベルの音が鳴ります。',
    themes: {
      neon: 'ネオン',
      celestial: 'セレスティアル',
    },
    colorTip: '「プラットフォーム」は、Twitchのアラートを紫、Kickのアラートを緑で表示します。',
    colors: {
      blue: '青',
      purple: '紫',
      pink: 'ピンク',
      red: '赤',
      gold: 'ゴールド',
      green: '緑',
      platform: 'プラットフォーム（Twitchは紫、Kickは緑）',
    },
    language: 'アラートの言語',
    languageTip:
      'アラートに表示される言葉の言語です。OBSが何語で動いていても、OBSに入れたURLがこの設定を保持します。',
    sectionAlerts: 'アラート',
    heading: '見出し',
    kindSub: 'サブスク',
    kindSubTip:
      '新規サブスクと継続サブスクすべて。視聴者がメッセージ付きでチャットにシェアした継続サブスクも含みます。',
    kindGift: 'ギフトサブ',
    kindGiftTip: 'サブスクが何件含まれていても、ギフト1回につきアラート1回です。',
    kindBits: 'Bits & Kicks',
    kindBitsTip: 'TwitchでCheerされたBitsと、Kickで送られたKicks。',
    kindRaid: 'レイド',
    kindRaidTip: 'ほかのチャンネルからのレイドと、一緒に来た視聴者数。',
    minGift: '最小サブスク数',
    minBits: '最小量',
    minRaid: '最小視聴者数',
    sectionTiming: 'タイミングと音',
    duration: '表示時間',
    durationTip: '各アラートを表示しておく時間です。複数届いたときは順番待ちになります。',
    seconds: '{value}秒',
    volume: '音量',
    volumeTip: 'アラートごとに専用の短い効果音が鳴ります。0で音がオフになります。',
    volumeOff: 'オフ',
    showMessage: '視聴者のメッセージを表示',
    showMessageTip:
      '継続サブスク、Bits、Kicksと一緒に視聴者が書いたメッセージを表示します。リンクは除かれ、長いメッセージは途中で切られます。',
    previewTitle: '配信アラートのプレビュー',
    previewIframeTitle: '配信アラートのプレビュー',
    previewHint:
      'プレビューでは音なしのサンプルアラートが流れます。下のボタンを押すと、効果音付きで1つ再生されます。配信では、あなたのチャンネルのサブスク、ギフト、Cheer、レイドだけが表示されます。',
    testTitle: '試してみる:',
    testSub: 'サブスク',
    testGift: 'ギフト{count}件',
    testBits: '{amount} Bits/Kicks',
    testRaid: 'レイド',
    testViewer: 'TestViewer',
    testMessage: '最高の配信！',
    widgetUrlTip:
      '作成済みのウィジェットがありますか？ここにURLを貼り付けると設定が読み込まれ、必要なところだけ変更できます。',
    widgetUrlPlaceholder: '既存のウィジェットURLを貼り付けて編集',
    widgetUrlInvalid: '配信アラートのURLではありません。',
    browserSourceHintSize: '（推奨サイズ: 800×450）。',
    guideTitle: '配信ソフトでの設定（OBS、Streamlabs、XSplitなど）',
    guideStep1:
      '配信ソフト（OBS Studio、Streamlabs Desktop、XSplit、vMix、Lightstream、PRISM Live Studioなど）でブラウザソースを追加します。',
    guideStep2: 'コピーした配信アラートのURLを貼り付けます。',
    guideStep3: '幅を800、高さを450に設定し、アラートを表示したい位置に置きます。',
    guideStep4:
      'OBSで音を鳴らすには、ソースの設定で「OBSで音声を制御する」をオンにし、「オーディオの詳細プロパティ」でそのソースの音声モニタリングを「モニタリング有効」にします。',
    faq1Q: 'フォローや投げ銭のアラートがないのはなぜですか？',
    faq1A:
      'TwitchもKickも、ログインしていないページには新しいフォローを見せません。また、どちらのプラットフォームにも独自の投げ銭機能はありません。アラートは両プラットフォームがすべての視聴者に送る情報だけを使うので、どちらでも同じように動きます。',
    faq2Q: 'サブスクのアラートに月数や視聴者のメッセージは表示されますか？',
    faq2A:
      'はい。視聴者が継続サブスクをチャットでシェアすると、TwitchでもKickでも、月数と書いたメッセージ付きでアラートが出ます。Twitchではすべてのサブスクアラートに月数が表示されます。Kickはほとんどのサブスクで月数を送りますが、まったく届かないチャンネルもあり、その場合アラートには「サブスクしました」とだけ表示されます。',
    faq3Q: 'たくさんのアラートが同時に届くとどうなりますか？',
    faq3A: '届いた順に1つずつ表示されます。50件のギフトサブは、50回ではなく1回のアラートです。',
    faq4Q: 'ログインやアカウント連携は必要ですか？',
    faq4A:
      'いいえ。アラートはサブスク、ギフト、Bits、Kicks、レイドを、TwitchとKickの公開チャットから、ログインしていない視聴者と同じように読み取ります。',
    alert: {
      subHeading: '新規サブスク',
      subDetail: 'サブスクしました',
      resubDetail: '{months}か月サブスクしました',
      giftHeading: 'ギフトサブ',
      giftDetail: 'サブスクを{count}件ギフトしました',
      giftDetailOne: 'サブスクをギフトしました',
      bitsHeading: '新しいCheer',
      bitsDetail: '{amount} BitsでCheerしました',
      kicksHeading: 'Kicks',
      kicksDetail: '{amount} Kicksを送りました',
      raidHeading: 'レイド到着',
      raidDetail: '{viewers}人でレイドしてきました',
      raidDetailOne: '1人でレイドしてきました',
      raidDetailNoCount: 'レイドしてきました',
      anonymous: '匿名',
    },
  },
  raffle: {
    breadcrumb: '抽選の設定',
    title: '抽選の設定',
    intro:
      'チャットからそのままプレゼント企画ができます。視聴者は !join などのキーワードを打って参加し、当選者はワンクリックで抽選。TwitchとKickに対応し、サブスク限定にもでき、希望すれば当選者を紙吹雪と一緒に配信に表示できます。',
    lockedTitle: '設定はロック中',
    lockedDesc:
      '抽選の受付中や抽選待ちのあいだは、ルールを変更できません。編集するには「すべてリセット」を押してください。',
    platform: 'プラットフォーム',
    channelName: 'チャンネル',
    sectionRules: '参加ルール',
    entryKeyword: '参加キーワード',
    keywordTip:
      'メッセージがこのキーワードと完全に一致するか、キーワードとスペースで始まる必要があります。大文字・小文字は区別せず、既知のボットは無視されます。',
    minDuration: '最短時間 (秒)',
    minDurationTip:
      '「抽選を開始」を押してからこの秒数のあいだ、「当選者を抽選」はロックされます。全員が打ち込む時間を確保するためです。',
    subscribersOnly: 'サブスク限定',
    subscribersOnlyTip:
      'サブスクかファウンダーのバッジを持つ視聴者だけが参加できます。最低月数が1なら、配信者であるあなたも参加できます。',
    minSubMonths: '最低サブスク月数',
    maxWinsPerUser: '1人あたりの最大当選回数',
    maxWinsTip:
      '当選者は参加リストから外れます。この上限に達するまでは、キーワードを打てば再び参加できます。',
    maxWinsUnlimited: '無制限',
    resetConfig: '設定をリセット',
    controlTitle: '抽選の操作',
    controlTip:
      '抽選中はこのページを開いたままにしてください。このページがチャットを読み取り、当選者をオーバーレイに送ります。',
    statusIdle: '未開始',
    statusNeedsSetup: '開始するにはチャンネルとキーワードを入力してください。',
    statusRunning: '受付中: {keyword} を待っています',
    statusStopped: '受付終了',
    startRaffle: '抽選を開始',
    stopRaffle: '受付を締め切る',
    drawWinner: '当選者を抽選（対象{count}人）',
    drawLocked: '{seconds}秒後に抽選できます',
    lastWinner: '直近の当選者',
    clear: 'クリア',
    resetEntries: '参加者をクリア',
    resetWinners: '当選者をクリア',
    resetAll: 'すべてリセット',
    winners: '当選者（{count}）',
    participants: '参加者（{count}）',
    noWinners: 'まだ当選者はいません。',
    noParticipants: 'まだ参加者はいません。視聴者はチャットで {keyword} と打って参加します。',
    disqualify: '{name}を削除',
    confirmStart: '新しい抽選を始めますか？現在の参加者と当選者はクリアされます。',
    confirmResetEntries: '参加者リストをクリアしますか？',
    confirmResetWinners: '当選者リストをクリアしますか？',
    confirmResetAll:
      'すべてリセットしますか？参加者と当選者がクリアされ、ロックも解除されます。設定はそのまま残ります。',
    overlayUrl: '当選者オーバーレイのURL',
    overlayUrlTip:
      '当選者はブラウザのBroadcastChannelで送られるため、動いているブラウザの外には届きません。Chromeで開いた抽選ページから、OBS内のオーバーレイには届きません。',
    overlayUrlHint:
      '当選者がオーバーレイに届くのは、このページがオーバーレイと同じブラウザかアプリで動いているときだけです。配信前にテスト抽選をしてください。',
    overlayNextStep: 'この抽選ページをオーバーレイと同じアプリで開き、テスト抽選をしてください。',
    guideStep1:
      'プラットフォームを選び、チャンネル名を入力して、参加キーワードとルールを設定します。',
    guideStep2:
      '当選者を配信に表示したいなら、オーバーレイのURLを1920×1080のブラウザソースとして追加します。',
    guideStep3:
      '「抽選を開始」を押します。視聴者はチャットでキーワードを打って参加します。名前の横の ✕ で、誰でもリストから外せます。',
    guideStep4:
      '準備ができたら「当選者を抽選」を押します。当選者がオーバーレイに表示されるのは、このページが同じブラウザかアプリで動いているときだけなので、配信前に試しておきましょう。',
    faq1Q: '同じ人が2回当選しないようにするには？',
    faq1A:
      '当選者は参加リストから外れ、当選者リストに移ります。「1人あたりの最大当選回数」が1なら、同じ抽選で再び参加したり当選したりはできません。',
    faq2Q: '怪しい参加者やボットを削除できますか？',
    faq2A:
      'NightbotやStreamElementsなどの既知のボットは自動で除外されます。名前の横の ✕ で、誰でも手動で外すこともできます。',
    faq3Q: 'オーバーレイに当選者が表示されないのはなぜですか？',
    faq3A:
      '抽選ページはBroadcastChannelで当選者を送りますが、これはひとつのブラウザの中でしか機能しません。このページをChromeで開き、オーバーレイをOBSで動かしていると、メッセージは届きません。抽選ページをオーバーレイと同じアプリで開き、配信前にテスト抽選をしてください。',
    winner: '当選！',
    subMonthsShort: '{months}か月',
  },
  alerts: {
    follow: '新しいフォロワー！',
    sub: '新しいサブスク！',
    donate: '投げ銭！',
    raid: 'レイド到着！',
  },
  emoteWallSetup: {
    breadcrumb: 'エモートウォールの設定',
    title: 'エモートウォールの設定',
    intro:
      'エモートだけでできたメッセージ（Twitch、Kick、そしてTwitchチャンネルの7TVエモート）が、画面にエモートとして飛び出します。普通のテキストメッセージは初期設定では無視されますが、「すべてのエモートを表示」をオンにすると、そこからもエモートを拾います。「おだやか」はランダムな位置に現れて漂いながら消え、「カオス」は画面の端から反対側へ飛んでいき、「バウンス」は画面の端で跳ね返ります。',
    sectionAnimation: 'アニメーション',
    sectionFilters: 'フィルター',
    sevenTvEmotes: '7TVエモート',
    sevenTvTip:
      'Twitchチャンネルの7TVエモートを、Kickのチャットでも表示します。Twitchチャンネルが必要です。',
    mode: 'アニメーションモード',
    modeCalm: 'おだやか',
    modeChaos: 'カオス',
    modeBounce: 'バウンス',
    modeTip:
      'おだやか: ランダムな位置に現れ、漂いながらフェードアウトします。カオス: ランダムな端から飛び込み、画面の半分から反対側までのどこかで消えます。バウンス: 端で跳ね返り、当たるたびに速くなります。',
    emoteSize: 'エモートのサイズ',
    duration: '表示時間 (秒)',
    durationTip:
      '各エモートが画面に残る時間です。カオスでは、この時間の一部で画面を横切り、早めに消えます。',
    maxEmotes: '同時表示の上限',
    maxEmotesTip: '画面上のエモートがこの数を超えると、古いものから消えます。',
    subsOnly: 'サブスク限定',
    subsOnlyTip:
      'サブスクかファウンダーのバッジを持つ人と、あなたのエモートだけを表示します。プレビューには反映されません。',
    subDurationX2: 'サブスクのエモートを2倍長く',
    subDurationX2Tip:
      'サブスクかファウンダーのバッジを持つ人と、あなたのエモートが2倍長く画面に残ります。',
    showAllEmotes: 'すべてのエモートを表示',
    showAllEmotesTip:
      '普通のテキストメッセージに含まれるエモートも、1メッセージにつき5個まで表示します。プレビューには反映されません。',
    hypeMode: 'ハイプモード',
    hypeModeTip:
      '15秒以内に2人以上の別々の人が同じエモートを送ったときだけ表示され、その後も最大15秒に1回です。プレビューには反映されません。',
    spamBlock: 'エモートスパムをブロック',
    spamBlockTip:
      '1人が10秒間に3件を超えるエモートメッセージを送ると、超えた分はスキップされます。同じエモートを10秒間に2回を超えて送った場合は、そのエモートだけスキップされます。プレビューには反映されません。',
    previewTitle: 'エモートウォールのプレビュー',
    previewIframeTitle: 'エモートウォールのプレビュー',
    previewHint:
      'プレビューではサンプルのエモートを表示しています。配信では、あなたのチャットのエモートが表示されます。',
    widgetUrlTip:
      '作成済みのウィジェットがありますか？ここにURLを貼り付けると設定が読み込まれ、必要なところだけ変更できます。',
    widgetUrlPlaceholder: '既存のウィジェットURLを貼り付けて編集',
    widgetUrlInvalid: 'エモートウォールのウィジェットURLではありません。',
    guideTitle: '配信ソフトでの設定（OBS、Streamlabs、XSplitなど）',
    guideStep1:
      '配信ソフト（OBS Studio、Streamlabs Desktop、XSplit、vMix、Lightstream、PRISM Live Studioなど）でブラウザソースを追加します。',
    guideStep2: 'コピーしたエモートウォールのURLを貼り付けます。',
    guideStep3:
      '幅と高さをキャンバス全体のサイズ（1920×1080など）にして、ゲーム画面の上に配置します。',
    browserSourceHintSize: '（推奨サイズ: キャンバス全体の1920×1080）。',
    faq1Q: 'どんなメッセージでエモートが飛びますか？',
    faq1A:
      'エモートだけでできたメッセージです。Kappaひとつ、エモートの連打、Twitch、Kick、7TVのエモートの組み合わせなど。「すべてのエモートを表示」がオンでない限り、普通のテキストメッセージは無視されます。',
    faq2Q: 'エモートウォールを使うのにサインインは必要ですか？',
    faq2A:
      'ログインは不要です。エモートウォールは両プラットフォームの公開チャットを匿名で読み取ります。',
  },
  plants: {
    classic: 'クラシックな新芽',
    rose: 'バラ',
    sunflower: 'ヒマワリ',
    cactus: 'サボテン',
    tulip: 'チューリップ',
    pine: 'マツ',
    lotus: 'ハス',
    lily: 'ユリ',
    palm: 'ヤシの木',
    vine: 'つる植物',
    waterOff: 'オフ',
    waterRain: '雨',
    waterSparkle: 'キラキラ',
  },
  guides: {
    breadcrumb: 'ガイド',
    eyebrow: 'ガイド',
    published: '公開日: {date}',
    onThisPage: 'このページの内容',
    covers: '対象のツール',
    relatedTitle: '関連ガイド',
    readGuide: 'ガイドを読む',
    allGuides: 'すべてのガイド',
    openSetup: '設定ページを開く',
    index: {
      title: 'ガイド',
      lead: 'どのガイドも、ひとつの疑問にステップごとに答えます。OBSにウィジェットを追加する、TwitchとKickのチャットをまとめる、OBSのドックでチャットを読む、配信アラートを追加する、サブアソンタイマーを動かす、チャット投票を行う、カメラとチャットにフレームを付ける、配信開始までカウントダウンする、チャット抽選を行う、チャットからシーンを切り替える、といった内容です。どれもログイン不要の無料ツールを扱っています。',
      listLabel: 'すべてのガイド',
      moreText:
        '一般的な質問は[FAQ](/faq)をご覧ください。変更点は[更新履歴](/changelog)で確認できます。',
    },
    obs: {
      title: 'SenchabotのウィジェットをOBSのブラウザソースとして追加する方法',
      short: 'OBSにウィジェットを追加',
      summary:
        'ブラウザソースの追加手順、ウィジェットごとの適切なサイズ、オフにしておくべき2つの設定、ウィジェットが空に見えるときの確認ポイント。',
      lead: 'SenchabotのウィジェットはブラウザソースとしてOBSに追加します。「ソース」ドックの + をクリックして「ブラウザ」を選び、設定ページでコピーしたURLをURL欄に貼り付け、幅と高さをウィジェットの推奨サイズにするだけ。ログインもダウンロードも不要で、背景は最初から透明です。',
      add: {
        title: 'OBSでブラウザソースを追加するには？',
        intro:
          '設定ページでチャンネル名を入力して「コピー」を押したら、OBS Studioで次の手順を進めます。',
        step1: 'ウィジェットを表示したいシーンを選びます。',
        step2: '「ソース」ドックで + をクリックし、一覧から「ブラウザ」を選びます。',
        step3: 'ソースに「チャットボックス」などの名前を付けて、「OK」をクリックします。',
        step4:
          '開いたプロパティウィンドウでURL欄を空にし、コピーしたウィジェットURLを貼り付けます。',
        step5: '「幅」と「高さ」の欄に、下の表の値を入力します。',
        step6: '「OK」をクリックし、ソースをシーン内の好きな位置にドラッグします。',
        note: '[チャットボックスの設定ページ](/setup/chat-widget)では、URLをコピーするとこの手順と推奨サイズが表示されます。念のため、先に普通のブラウザのタブでURLを開いて、動くか確認しておくと安心です。',
      },
      size: {
        title: '各ウィジェットのサイズは？',
        intro:
          'どのウィジェットにも推奨のソースサイズがあります。OBSの「幅」と「高さ」の欄にこの値を入力してください。',
        caption: 'Senchabotウィジェットのブラウザソース推奨サイズ',
        colWidget: 'ウィジェット',
        colSize: '幅 × 高さ',
        colNote: '備考',
        notSource: 'ソースではありません',
        notes: {
          chatBox:
            '縦長のチャット欄。ソースを大きくすると表示できるメッセージが増え、文字サイズは変わりません。',
          emoteWall: '1080pのキャンバス全体。エモートは画面のどこにでも現れます。',
          subSprout: 'この範囲の中で植物と鉢が育ちます。',
          frames:
            'カメラは640x360、チャットは420x720、画面は1920x1080。フレームは指定したサイズに合わせて描かれます。',
          goal: '目標バー用の横長の帯。上には +1 が浮かび上がるスペースがあります。',
          subathon: 'HPバー、時計、リング用の横長の帯。ソースを大きくすると拡大されます。',
          countdown: '1080pのキャンバス全体なので、時計が開始前やBRBシーンの中央に来ます。',
          poll: '選択肢6つまでの投票が収まるサイズ。上か下に置かれ、選択肢の数に応じて伸びます。',
          streamAlerts:
            'この範囲の中央にアラートを1つずつ表示します。ソースを大きくすると拡大されます。',
          raffle:
            '当選者オーバーレイ。画面の両側から紙吹雪が飛び出し、中央に当選者の名前が表示されます。',
          obsBridge:
            '画面に表示するオーバーレイではありません。ツールをブラウザのタブかOBSのドックで開いたままにしてください。',
          socials:
            'この帯の中央にアカウントを1つずつ表示します。文字は縮小されないので、長いユーザー名にはソースの幅を広げてください。',
        },
        fontNote:
          'チャットボックスの文字を大きくしたいときは、ソースを引き伸ばさないでください。設定ページの「フォントサイズ」を使います。8から72ピクセルで、初期設定は18です。',
      },
      transparent: {
        title: '背景を透明にするために何か設定は必要ですか？',
        p1: 'いいえ。チャットボックス、エモートウォール、Sub Sprout、Subathon Timer、配信アラート、サブスク目標、配信フレーム、配信カウントダウン、チャット投票、SNSリンク、抽選のオーバーレイは、透明な背景に描かれています。クロマキーもフィルタも不要で、OBSの「カスタム CSS」欄もそのままでかまいません。',
        p2: '明るいシーンでチャットボックスが読みにくいときは、「暗い背景」をオンにします。ウィジェットの後ろに半透明の黒いレイヤーが敷かれ、不透明度は0%から100%まで（初期設定は50%）調整できます。メッセージごとにボックスを付けたいなら、「メッセージごとの背景ボックス」をオンにしてください。',
      },
      settings: {
        title:
          '「表示されていないときにソースをシャットダウンする」と「シーンがアクティブになったときにブラウザの表示を更新する」はオンにすべき？',
        intro:
          'Senchabotのウィジェットでは、どちらもオフのままにしてください。どちらもページを一から読み込み直すので、ウィジェットはそれまで保持していた内容を忘れてしまいます。',
        chatBox:
          'チャットボックス: メッセージはソースが動いているあいだしか届きません。ソースがシャットダウンして戻ると、画面は空の状態から始まり、新しいメッセージだけが表示されます。',
        subSprout:
          'Sub Sprout: 植物はOBSの中に保存されるので再読み込みしても育った段階のままですが、ソースがオフのあいだに入ったサブスクでは育ちません。',
        goal: 'サブスク目標: カウントはOBSの中に保存されるので再読み込みしても消えませんが、ソースがオフのあいだに入ったサブスクはカウントされません。',
        poll: 'チャット投票: 投票と票はOBSの中に保存されるので再読み込みしても消えませんが、ソースがオフのあいだに打たれた票はカウントされません。',
        subathon:
          'Subathon Timer: 残り時間はOBSの中に保存されるので、再読み込みしても消えません。ソースがオフのあいだもタイマーはカウントダウンを続けますが、そのあいだに入ったサブスクは検知できません。',
        streamAlerts:
          '配信アラート: アラートが出るのは、ソースが動いているあいだに入ったサブスク、ギフト、Cheer、レイドだけです。オフのあいだに届いたものは見逃します。',
        raffle:
          '抽選のオーバーレイ: 当選者を受け取れるのは、その瞬間に開いているオーバーレイだけです。ソースがオフのあいだに抽選された当選者は、画面に表示されません。',
        emoteWall:
          'エモートウォール: エモートは初期設定で5秒間表示されるので、更新しても失うものはありませんが、得るものもありません。',
        refresh:
          'ウィジェットが固まったときは、ソースをダブルクリックし、プロパティウィンドウの「現在のページのキャッシュを更新」ボタンを押してください。ページが1回だけ再読み込みされます。',
      },
      update: {
        title: 'あとからウィジェットを変更するには？',
        p1: '設定はウィジェットURLの中にあるので、設定を変えるとURLも新しくなります。設定ページで設定を変えて新しいURLをコピーしたら、OBSでソースをダブルクリックし、URL欄の古いURLに上書きして貼り付けてください。',
        p2: '[チャットボックス](/setup/chat-widget)、[エモートウォール](/setup/emote-wall)、[Sub Sprout](/setup/sub-growing-plant)、[Subathon Timer](/setup/subathon-timer)、[配信アラート](/setup/stream-alerts)、[サブスク目標](/setup/sub-goal)、[チャット投票](/setup/chat-poll)、[配信フレーム](/setup/stream-frames)、[SNSリンク](/setup/socials)、[配信カウントダウン](/setup/stream-countdown)なら、一からやり直す必要はありません。設定ページの「ウィジェットURL」欄に今のURLを貼り付ければ、チャンネルとすべての設定が戻ってきます。変えたいところを変えて、新しいURLをコピーしてください。',
        p3: 'OBS Bridgeには貼り付け欄がないので、設定ページで設定を入力し直して、新しいツールURLをコピーしてください。シーンの選択や許可ユーザーはツールページ上でも変更でき、「更新済みURLをコピー」ボタンで新しいURLを取得できます。古いURLもそのまま使えるので、更新は必須ではありません。',
      },
      troubleshoot: {
        title: 'OBSにウィジェットが表示されないときは？',
        intro: 'ほとんどの場合、原因はチャンネル名です。次の項目を順番に確認してください。',
        linkTitle: 'チャンネル名ではなくリンクを入力していませんか？',
        linkBody:
          'チャンネル欄には名前だけを入力します。twitch.tv/senchabot なら `senchabot` です。リンク全体を貼り付けると、ウィジェットはリンクをチャンネル名として扱うため、どのチャットにも接続できません。',
        channelTitle: 'そのチャンネルは本当に存在しますか？',
        channelBody:
          '名前に打ち間違いがないか確認してください。Twitchに存在しないチャンネルでもエラーは出ず、ウィジェットが空のままになるだけです。',
        quietTitle: 'チャットで何か起きましたか？',
        quietBody:
          'チャットボックスとエモートウォールは、チャットで何か起きるまで完全に空で透明なままです。チャットにメッセージを送ってみてください。エモートウォールの場合、初期設定ではエモートだけのメッセージである必要がありますが、「すべてのエモートを表示」がオンなら普通のメッセージ内のエモートもカウントされます。抽選のオーバーレイも、当選者が抽選されたときにだけ現れ、10秒後に消えます。一方、Sub SproutとSubathon Timerはすぐに表示されます。',
        kickTitle: 'Kickチャンネルが見つからない？',
        kickBody:
          'ウィジェットは開いたときに、kick.comでKickチャンネルを検索します。この検索に失敗すると（名前の間違い、チャンネルが存在しない、Kickが応答しないなど）、Kickのメッセージは届きません。Kickの名前は、kick.comのURLに表示されるとおりに入力してください。',
        tabTitle: 'ブラウザではURLが動きますか？',
        tabBody:
          '普通のブラウザのタブでURLを開いてみてください。ブラウザでは動くのにOBSでは動かない場合は、ソースのURL欄とサイズを確認してください。',
      },
      ctaTitle: 'ウィジェットを選んでURLを取得',
      ctaText: 'どの設定ページでも、OBSに貼り付けるだけのURLがすぐに手に入ります。',
    },
    chat: {
      title: 'OBSでTwitchとKickのチャットを一緒に表示する方法',
      short: 'TwitchとKickのチャットを一緒に表示',
      summary:
        'ひとつのチャットボックスURLで両方のチャットをまとめる方法、各メッセージの送信元の表示、エモート、ボットの非表示、画面下の帯にする横向きモード。',
      lead: 'チャットボックスは、TwitchとKickのチャットをひとつのブラウザソースにまとめます。設定ページの「プラットフォーム」で「両方」を選び、両方のチャンネル名を入力して、できたURLをひとつ、400 × 600 でOBSに追加するだけ。ログインは不要で、両方のチャットを匿名で読み取ります。',
      setup: {
        title: 'TwitchとKickのチャットをひとつのオーバーレイにまとめるには？',
        step1: '[チャットボックスの設定ページ](/setup/chat-widget)を開きます。',
        step2: '「プラットフォーム」で「両方」を選びます。初期設定ですでに選ばれています。',
        step3: '「Twitchチャンネル」と「Kickチャンネル」の欄に、チャンネル名だけを入力します。',
        step4: '見た目を調整します。変更はプレビューにすぐ反映されます。',
        step5: 'ウィジェットURLをコピーし、400 × 600 のブラウザソースとしてOBSに追加します。',
        p1: 'できたURLには両方のチャンネルが含まれます（例: `/widgets/chat-widget?twitch=yourchannel&kick=yourchannel`）。プラットフォームごとに別のソースを用意する必要はありません。',
        p2: 'プレビューでは常にサンプルのチャットが流れます。チャンネルで誰もチャットしていなくても、設定が配信でどう見えるかを確認できます。',
      },
      restream: {
        title: 'チャットボックスで両方のプラットフォームに同時配信できますか？',
        p1: 'いいえ。チャットボックスはチャットを読み取って画面に表示するだけです。配信をTwitchやKickに送ることも、チャットに書き込むこともできません。両方のプラットフォームで同時配信するには別途マルチ配信の環境が必要で、チャットボックスはその配信の上で両方のチャットをまとめる役割です。',
        p2: 'モデレーションもオーバーレイに反映されます。削除されたメッセージや、タイムアウトやBANされたユーザーのメッセージは画面から消えます。',
      },
      platform: {
        title: 'メッセージがTwitchとKickのどちらから来たか見分けるには？',
        intro:
          '両方のプラットフォームがオンのとき、「プラットフォーム表示」で各メッセージの先頭に送信元を表示できます。選択肢は3つです。',
        icon: 'プラットフォームアイコン（初期設定）: TwitchかKickのロゴ。',
        name: 'プラットフォーム名: ロゴの代わりに `[twitch]` か `[kick]` の文字。',
        none: 'プラットフォームを隠す: 何も表示しません。',
        stripe:
          '「プラットフォームカラーのライン」をオンにすると、各メッセージの左に細いラインが付きます。Twitchは紫、Kickは緑です。ラインがあれば、プラットフォーム表示を隠してすっきりさせることもできます。ハイライトされたメッセージでは、ラインの代わりにハイライトの色が付きます。',
      },
      look: {
        title: 'レイアウト、アニメーション、フォントの種類は？',
        layoutTitle: 'メッセージのレイアウト',
        inline: 'インライン（初期設定）: ユーザー名とメッセージが同じ行に並びます。',
        stacked: '2段: ユーザー名が上、メッセージが下。',
        card: 'カード / 吹き出し: 各メッセージが半透明のカードに入ります。',
        compact: 'コンパクト: Twitch風の詰まった行で、文字は少し小さめです。',
        animationTitle: '新着メッセージのアニメーション',
        animations:
          '選択肢は8つ。右からスライド（初期設定）、右からなめらかにスライド、ポップ / 拡大、バウンド、時間差、フェードイン、タイプライター、アニメーションなしです。チャットが速くなると、初期設定以外のアニメーションはすべて短くなります。メッセージが0.5秒に1件より速く届くと、アニメーションは通常の3分の1まで短くなるので、次のメッセージに追いつけなくなることはありません。',
        fontTitle: 'フォントとサイズ',
        fonts:
          'Inter（初期設定）、Roboto、Nunito、JetBrains Mono、Source Serif 4、システムの既定フォント。フォントサイズは8から72ピクセルで、初期設定は18です。「ユーザー名を太字に」と「メッセージを太字に」は別々に切り替えられます。',
      },
      duration: {
        title: 'メッセージはどのくらい画面に残りますか？',
        p1: '初期設定は30秒です。「メッセージの表示時間」で、10秒、15秒、30秒、1分、2分、5分、「ずっと表示」から選べます。',
        p2: '「ずっと表示」では、メッセージは消えません。新しいメッセージが古いものを押し上げ、ボックスに収まらない分は切れて、最大で直近100件が保持されます。',
      },
      emotes: {
        title: 'どのエモートが表示されますか？',
        intro:
          'TwitchとKick自身のエモートは常に画像で表示されます。それに加えて、「エモート」メニューから3つのプロバイダーをオン・オフでき、初期設定では3つともオンです。',
        caption: 'チャットボックスで各エモートプロバイダーが対応するプラットフォーム',
        colProvider: 'プロバイダー',
        colPlatforms: '対応',
        both: 'TwitchとKick',
        twitchOnly: 'Twitchのみ',
        p1: 'チャンネルエモートとグローバルエモートは一緒に読み込まれます。同じ名前のエモートがある場合はチャンネルエモートが優先され、プロバイダー間の優先順位は7TV、BTTV、FFZの順です。Kickのメッセージでは、7TVはチャンネルのKickアカウントに紐づいたエモートセットを使います。7TVでTwitchアカウントだけを連携している場合は、Kickのメッセージでもそのセットを使います。オフにしたプロバイダーのエモートはテキストのまま表示されます。',
      },
      filters: {
        title: 'ボットやコマンドを隠すには？',
        bots: '「ボットを隠す」は、既知のボットアカウントのメッセージを消します。Nightbot、StreamElements、Streamlabs、Moobot、Fossabot、Wizebot、Sery_Bot、SoundAlerts、StreamlootsBot、KofiStreamBot、PokemonCommunityGame、OWN3D、Blerp、BotRix、KickBot、Kicklet、Senchabotです。Twitchの「チャットボット」バッジやKickの「Bot」バッジが付いたアカウントも非表示になります。',
        commands:
          '「コマンドを隠す」は「!」で始まるメッセージをすべて隠すので、`!discord` や `!uptime` のようなコマンドは画面に出ません。コマンドへのボットの返信も隠したいなら、両方の設定をオンにしてください。',
        highlights:
          '逆に特定のメッセージを目立たせたいときは、「ハイライト」を使います。5つとも初期設定ではオフなので、使いたいものだけオンにしてください。チャンネルをメンションしたメッセージやあなたへの返信、誰への返信かを示す返信の上の行、初めてのチャット、アナウンス、「メッセージをハイライト」で送られたメッセージです。最後の3つは、Kickがその情報を送らないためTwitchのみです。',
      },
      horizontal: {
        title: 'チャットを画面下の帯として表示するには？',
        p1: '「向き」を「横」にします。メッセージが横に並び、最新のものが右に現れて、古いものは左へスライドしてボックスの外に出ていきます。',
        p2: '400 × 600 の推奨サイズは縦向き用です。横の帯にするなら、ソースの幅を帯の長さに、高さをメッセージ1行分にして、ソースを画面の下に配置してください。',
      },
      others: {
        title: 'ほかに両方のプラットフォームを同時に聞き取れるウィジェットは？',
        p1: '[エモートウォール](/setup/emote-wall)、[Sub Sprout](/setup/sub-growing-plant)、[Subathon Timer](/setup/subathon-timer)、[配信アラート](/setup/stream-alerts)、[サブスク目標](/setup/sub-goal)、[チャット投票](/setup/chat-poll)も、ひとつのURLで両方のチャンネルを受け付けます。エモートウォールは、両方のチャットのエモートだけのメッセージを画面に飛ばします。Sub Sproutは、Kickのギフトサブも含めて両方のプラットフォームのサブスクで育ちます。Subathon Timerは、両方のチャットのサブスク、ギフトサブ、Bits、Kicksで時間を追加します。配信アラートは、両方のサブスク、ギフトサブ、Bits、Kicks、レイドにアラートを出します。サブスク目標は、両方のチャットのサブスクとギフトサブをひとつのカウントにまとめます。チャット投票は、両方のチャットの票をひとつの結果にまとめます。',
        p2: '一方、[抽選](/setup/raffle)は一度にひとつのプラットフォーム（TwitchかKick）で動きます。',
      },
      ctaTitle: 'チャットボックスを設定する',
      ctaText:
        'チャンネル名を入力して、URLをコピーし、OBSに追加。ログインもダウンロードも不要です。',
      ctaSecondary: 'エモートウォールも見てみる',
    },
    raffle: {
      title: 'TwitchやKickでチャット抽選をする方法',
      short: 'チャット抽選をする',
      summary:
        '!join での参加、サブスク限定の抽選、当選回数の上限、最短時間、紙吹雪付きで当選者を配信に表示する方法。すべて抽選ツールで行えます。',
      lead: '抽選ツールを使えば、視聴者はチャットでキーワードを打って参加し、当選者はワンクリックで決まります。初期設定のキーワードは `!join` です。ログインは不要で、参加者と当選者はあなたのブラウザに保存されます。',
      start: {
        title: '抽選を始めるには？',
        step1:
          '[抽選ページ](/setup/raffle)を開き、TwitchかKickのプラットフォームを選びます。抽選はひとつのプラットフォームで行います。',
        step2: 'チャンネル名を入力します。参加はそのチャンネルのチャットから読み取られます。',
        step3: '「参加キーワード」を設定します。初期設定は `!join` で、好きな言葉に変えられます。',
        step4:
          'ルールを決めて「抽選を開始」を押します。キーワードが空のあいだはボタンを押せません。',
        step5: '参加した人がリストに表示されます。十分集まったら「当選者を抽選」を押します。',
        p1: '抽選を始めると設定がロックされるので、途中でルールが変わることはありません。受付を終えるには「受付を締め切る」を押します。締め切ったあとでも当選者を抽選できます。新しい抽選を始めると参加者リストがクリアされるので、ページが先に確認を求めます。',
      },
      entry: {
        title: '視聴者はどうやって参加しますか？',
        p1: '視聴者はチャットでキーワードを打ちます。大文字・小文字は区別せず、キーワードで始まっていれば後ろに言葉を続けてもかまいません。`!join` や `!join good luck` は参加になり、`hey !join` はなりません。',
        p2: '参加は1人1回です。コマンドをもう一度打っても、当選のチャンスは増えません。',
        p3: '既知のボットは参加できません。Nightbot、StreamElements、Streamlabs、Moobot、Fossabot、Wizebot、BotRix、SoundAlerts、Blerp、Kofi_Stream_Bot、Senchabotです。手動でリストから外すには、名前の横の ✕ ボタンをクリックします。',
      },
      rules: {
        title: '設定できるルールは？',
        caption: '抽選のルール、選択肢、初期設定',
        colRule: 'ルール',
        colOptions: '選択肢',
        colDefault: '初期設定',
        subsOnly: 'サブスク限定',
        subsOnlyOptions: 'オンまたはオフ',
        subsOnlyDefault: 'オフ',
        minMonths: '最低サブスク月数',
        minMonthsOptions: '1以上。サブスク限定がオンのときのみ',
        minMonthsDefault: '1',
        maxWins: '1人あたりの最大当選回数',
        maxWinsOptions: '1から5、または無制限',
        maxWinsDefault: '1',
        minDuration: '最短時間',
        minDurationOptions: '0から300秒',
        minDurationDefault: '15秒',
        subsText:
          'サブスク限定がオンのときは、サブスクのバッジがない人は参加できません。配信者もサブスクとして扱われるので、最低サブスク月数が1なら、自分の抽選に参加できます。1にすると、サブスクなら誰でも参加できます。6にすると、6か月以上サブスクしている人だけが参加できます。TwitchでもKickでも、サブスクの期間は視聴者のサブスクバッジから読み取ります。',
        winsText:
          '抽選された当選者は参加リストから外れ、当選者リストに移ります。上限が1なら、同じ抽選で再び当選することはありません。上限がそれより多いか無制限なら、もう一度キーワードを打てば再び参加できます。',
        durationText:
          '「当選者を抽選」ボタンは、抽選開始からこの時間が経つまでロックされ、残り秒数が表示されます。気づくのが遅れた視聴者にも参加する時間ができます。',
        fairText:
          '当選者は、ブラウザの安全な乱数生成器（`crypto.getRandomValues`）を使って、対象の参加者から選ばれます。',
      },
      storage: {
        title: 'ページを更新すると抽選は消えますか？',
        p1: 'いいえ。設定、参加者、当選者はブラウザのローカルストレージ（localStorage）に保存されます。ページを更新しても、閉じて開き直しても、中断したところから再開できます。',
        p2: 'このデータはそのブラウザの中にしかないので、別のパソコンやブラウザには表示されません。ページを閉じているあいだはチャットを読まないので、そのあいだに打たれたコマンドはカウントされません。最初からやり直すには「すべてリセット」を使います。参加者だけ、当選者だけをクリアすることもできます。',
      },
      overlay: {
        title: '当選者を配信に表示するには？',
        p1: '抽選ページにある当選者オーバーレイのURL（`/widgets/raffle-overlay`）を、1920 × 1080 のブラウザソースとしてOBSに追加します。「当選者を抽選」を押すと、オーバーレイの画面中央に当選者の名前が表示され、両側から3秒間紙吹雪が飛び出し、名前は10秒後に消えます。',
        warnTitle: '配信前に必ずテストしましょう',
        warn: '当選者はBroadcastChannelを通じてオーバーレイに届きますが、これは同じブラウザの中でしか機能しません。抽選ページをChromeなどの別のブラウザで開き、オーバーレイをOBSに追加すると、2つは別々のアプリで動くため、当選者はOBSに届きません。配信前にテスト抽選をして、当選者がOBSに表示されるか確認してください。',
        p2: 'オーバーレイのあるシーンはアクティブのままにし、ソースの「表示されていないときにソースをシャットダウンする」はオフにしておきます。シャットダウンしたソースは当選者を受け取れません。詳しくは[OBSガイド](/guides/obs-browser-source)をご覧ください。当選者は抽選ページにも必ず紙吹雪付きで表示されるので、オーバーレイが動かなくても名前はそこで確認できます。',
      },
      ctaTitle: '抽選の準備をしよう',
      ctaText:
        'プラットフォームを選んで、チャンネルを入力して、キーワードを設定。1分で最初の抽選の準備が整います。',
    },
    bridge: {
      title: 'チャットからモデレーターがOBSのシーンを切り替えられるようにする方法',
      short: 'チャットからシーンを切り替え',
      summary:
        'OBS Bridge用にWebSocketを有効にする方法、チャットコマンド、!scene がシーンを見つける仕組み、コマンドを使える人。',
      lead: 'OBS BridgeはTwitchやKickのチャットを聞き取り、許可した人のコマンドをあなたのパソコンのOBSに渡します。OBSでWebSocketサーバーを有効にし、設定ページでチャンネルと許可ユーザーを入力して、できたツールURLを開いたままにしておきます。モデレーターが `!scene game` と打つと、OBSは名前に「game」を含むシーンに切り替わります。',
      websocket: {
        title: 'OBSでWebSocketを有効にするには？',
        step1: 'OBSの上部メニューから「ツール → WebSocket サーバー設定」を開きます。',
        step2: '「WebSocketサーバーを有効にする」にチェックを入れます。',
        step3:
          '認証がオンになっている場合は、「接続情報を表示」をクリックしてパスワードをコピーします。',
        step4: '「OK」をクリックします。',
        p1: 'OBS Bridgeはobs-websocket 5と通信します。これはOBS Studio 28以降に最初から組み込まれています。初期設定では `ws://127.0.0.1:4455` に接続するので、OBSが同じパソコンにあるならWebSocket URLの欄は空のままでかまいません。OBSが別のパソコンにある場合は、そのパソコンのアドレスとポート（例: `ws://192.168.1.20:4455`）を入力します。接続できないときは、5秒ごとに再試行します。',
      },
      setup: {
        title: 'OBS Bridgeを設定するには？',
        step1: '[OBS Bridgeの設定ページ](/setup/obs-bridge)を開きます。',
        step2: '聞き取るTwitchチャンネル、Kickチャンネル、またはその両方を入力します。',
        step3: '許可ユーザーを追加します。誰を追加するかは下で説明します。',
        step4: 'OBSのWebSocketパスワードを入力し、必要ならWebSocket URLを変更します。',
        step5: 'ツールURLをコピーし、ブラウザのタブか、OBSのカスタムブラウザドックとして開きます。',
        step6:
          'ツールページにOBSのシーンが一覧表示されます。メインとBRBに使いたいシーンの横にある「メイン」「BRB」ボタンをクリックします。',
        p1: '何も選ばなかった場合は、メインには `Main Scene`、BRBには `BRB Scene` という名前のシーンを探します。選んだシーンはツールページのURLに保存されるので、選んだあとにURLをもう一度コピーして保管しておいてください。次に開いたときも同じシーンが読み込まれます。',
      },
      commands: {
        title: 'どんなチャットコマンドがありますか？',
        caption: 'OBS Bridgeの初期設定のチャットコマンド',
        colCommand: 'コマンド',
        colAction: '動作',
        sceneArg: '<シーン名>',
        scene: '名前が一致するシーンに切り替えます',
        brb: 'BRBシーンに切り替えます',
        back: 'メインシーンに切り替えます',
        stream: '配信を開始 / 終了します',
        record: '録画を開始 / 停止します',
        p1: '`brb` と `back` はビックリマークなしで打ちます。コマンドは大文字・小文字を区別しませんが、メッセージ全体がコマンドである必要があります。`brb` は動き、`brb 5 min` は動きません。設定ページの「コマンド」で、`!scene` の代わりに `!switch` にするなど、どのコマンドの名前も変更できます。',
        p2: '配信終了コマンドは、本当に配信を終了します。許可ユーザーのリストは短くしておきましょう。',
      },
      matching: {
        title: '!scene コマンドはどうやって正しいシーンを見つけますか？',
        p1: 'まず完全一致を探します。`!scene game` は、大文字・小文字を区別せず「Game」という名前のシーンに切り替えます。完全一致がなければ、名前にその語を含む最初のシーンを選びます。`!scene chatting` なら「Just Chatting」シーンが見つかります。一致するシーンがなければ何も起きません。',
        p2: '同じ語を含むシーンが複数ある場合は、「シーン」リストでいちばん上にあるものが選ばれます。似た名前のシーンがあるなら、フルネームで打つのが確実です。シーンを追加したり名前を変えたりすると、リストは自動で更新されます。',
      },
      users: {
        title: 'コマンドを使えるのは誰？',
        p1: '許可ユーザーのリストに入っている人だけです。リストが空だと、配信者も含めて誰もコマンドを使えないので、自分のアカウントも追加してください。',
        p2: '各ユーザーはプラットフォームと一緒に追加され、URLには `commandUser=twitch:bob,kick:alice` のように入ります。プラットフォームと名前の両方が一致したメッセージだけがコマンドとして扱われます。そのため、誰かがKickでTwitchのモデレーターと同じ名前を取っても、シーンは切り替えられません。',
        p3: 'プラットフォームなしで保存された古い名前（`bob` だけ）は、URLでプラットフォームがひとつだけ設定されていれば、そのプラットフォームで使えます。両方のプラットフォームがオンのときは、これらの名前はツールページで黄色く表示され、プラットフォームを選ぶまでコマンドを使えません。',
      },
      open: {
        title: 'ツールページは開いたままにする必要がありますか？',
        p1: 'はい。チャットを読み取ってOBSにコマンドを渡しているのはツールページです。タブを閉じるとコマンドは動かなくなります。配信中はずっと、ツールをタブかOBSのドックで開いておいてください。OBSとの接続が切れた場合は、5秒ごとに再接続を試みます。',
      },
      security: {
        title: 'ツールURLをパスワードのように扱うべき理由は？',
        p1: 'URLの中に、OBSのWebSocketパスワード（`obsWebsocketPassword` パラメータ）が含まれているからです。URLを共有することは、パスワードを共有することと同じです。配信に映さず、チャットに貼らず、画面共有のときはアドレスバーを隠してください。',
        p2: 'OBSへの接続は、ブラウザからOBSへ直接つながります。ツールページ自体は普通のウェブサイトと同じくextensions.senchabot.comから読み込まれるので、パスワードを含むアドレス全体がそのリクエストと一緒に送られます。',
      },
      ctaTitle: 'OBS Bridgeを設定する',
      ctaText:
        'チャンネルと許可ユーザーを入力して、ツールURLを開きましょう。シーンのコマンドがすぐに使えるようになります。',
    },
    subathon: {
      title: 'TwitchとKickでサブアソンタイマーを動かす方法',
      short: 'サブアソンタイマーを動かす',
      summary:
        'サブスク、ギフト、BitsのCheer、Kicksのギフトで何分増えるか、!subathon での開始、モデレーター用のコマンド、OBSを閉じたときや時間切れのときの動き。',
      lead: 'Subathon Timerは、サブスクが入るたびに時間が延びるカウントダウンです。開始時間と、サブスク、ギフトサブ、BitsのCheer、Kicksのギフトごとに追加する時間を決めて、URLを 800 × 300 のブラウザソースとしてOBSに追加し、配信を始めたらチャットで `!subathon start` と打ちます。ログインは不要で、TwitchとKickの公開チャットを読み取ります。',
      setup: {
        title: 'サブアソンタイマーを設定するには？',
        step1: '[Subathon Timerの設定ページ](/setup/subathon-timer)を開きます。',
        step2: 'Twitch、Kick、「両方」から選び、チャンネル名だけを入力します。',
        step3: '「開始時間」（初期設定は1時間）と、必要なら「上限時間」を設定します。',
        step4:
          'サブスク、ギフトサブ、Bits、Kicksで追加する時間を設定します。「両方」なら、TwitchとKickにそれぞれ専用のタブがあります。',
        step5:
          'スタイルとカラーを選び、URLをコピーして、800 × 300 のブラウザソースとしてOBSに追加します。',
        p1: '設定ページのプレビューでは、模擬のサブスク、ギフト、Cheerが60倍速で流れるので、1時間のタイマーが約1分で終わります。速度は1×から300×まで設定できます。「試してみる」のボタンで、サブスク、5件のギフト、500 Bits/Kicksの追加、10分の削除、一時停止、リセットができます。変わるのはプレビューだけで、OBSのタイマーには影響しません。',
      },
      values: {
        title: 'サブスク1件で何分増えますか？',
        intro:
          '時間は0から60までの分単位で決められ、0にするとそのイベントはオフになります。TwitchとKickで別々の値があり、初期設定はすべて1分です。初期設定でオンの「タイマーに表示」は、「サブスク +1分」のようにタイマー上に一覧を出すので、視聴者は自分のサブスクで何分増えるかがわかります。TwitchとKickで追加時間が違う場合は、交互に表示されます。',
        caption: '各イベントでサブアソンタイマーに追加される時間',
        colEvent: 'イベント',
        colDefault: '初期設定',
        colHow: 'カウント方法',
        oneMinute: '1分',
        sub: 'サブスク',
        subHow: '新規サブスクと継続サブスクごと。TwitchのPrimeサブスクはTier 1として扱います。',
        gift: 'ギフトサブ',
        giftHow: 'ギフトに含まれるサブスクごとなので、5件のギフトなら5倍になります。',
        bits: '500 Bitsまたは500 Kicks',
        bitsHow: 'ほかの量は割合で加算されます。1分の設定なら、100 Bitsで12秒です。',
        tiers:
          '初期設定でオンの「Tier 2と3を多めにカウント」では、TwitchのTier 2のサブスクやギフトは2倍、Tier 3は5倍の時間を追加します。価格に合わせた比率です。Kickのサブスクにはティアがないので、1件ずつカウントします。',
        cap: '「上限時間」は、タイマーが持てる最大の時間です。上限を超える分は追加されず、+時間の表示も出ません。初期設定の「上限なし」なら、サブスクが入り続けるかぎりタイマーは増え続けます。',
      },
      start: {
        title: 'サブアソンを開始するには？',
        p1: '初期設定では、あなたかモデレーターがチャットで `!subathon start` と打つまで、タイマーは一時停止したまま待ちます。そのため、配信前にソースを追加しておき、配信が始まってから時計を動かせます。「開始」で「すぐに」を選ぶと、OBSでソースが読み込まれた時点でタイマーが始まります。',
        p2: '開始前に入ったサブスクも、一時停止中のサブスクも、ちゃんと時間が追加されます。時計が動き出したときには、その時間が加算されています。',
      },
      commands: {
        title: 'モデレーターが使えるチャットコマンドは？',
        caption: 'Subathon Timerのチャットコマンド',
        colCommand: 'コマンド',
        colAction: '動作',
        start: 'タイマーを開始、または一時停止から再開します',
        pause: '一時停止します。残り時間はそのままです',
        add: '上限時間まで時間を追加します',
        remove: 'ゼロまで時間を減らします',
        set: '残り時間を設定します',
        reset: '開始時間からやり直します',
        p1: 'TwitchでもKickでも、使えるのは配信者とモデレーターだけです。VIPや視聴者は使えません。タイマーはチャットで返事をしないので、結果はタイマー上で確認してください。',
        p2: '時間は `10m`、`45s`、`1h30m`、`1:30:00` のように書きます。数字だけなら分として扱うので、`!subathon add 15` で15分追加されます。単位は1文字で、`10min` は動かず、`10m` なら動きます。',
      },
      look: {
        title: 'スタイルとカラーの種類は？',
        bar: 'HPバー（初期設定）: 100%からゼロへ減っていくゲーム風のバー。',
        thin: '細いバー: タイトルと残り時間が中に収まる、細めのバー。',
        clock: '時計: 時・分・秒の大きな数字。',
        ring: 'リング: 時間が減るにつれて欠けていく円。',
        p1: '初期設定のカラー「HP」は、時間が少なくなるにつれて緑から黄、赤へと変わります。緑、紫、赤、ゴールド、シアン、ピンクの単色も選べます。タイマーの横のタイトルは初期設定で SUBATHON です。32文字までの好きな文字に変えるか、空欄にして隠せます。',
        p2: '「パーセントを表示」は、タイマーがどれだけ埋まっているかを表示します。100%はこれまでで最も時間が多かった時点なので、100%を超えることはありません。満タンのバーに時間が追加されると、バーは満タンのまま新しい最大値からカウントダウンします。「追加時間を表示」は、時間が追加されるたびに視聴者の名前と +1:00 をタイマーの上に浮かび上がらせます。',
      },
      saved: {
        title: 'OBSを閉じたり、ソースを再読み込みしたりするとどうなりますか？',
        p1: 'タイマーはOBSの中に保存されるので、再読み込みやOBSの再起動のあとも元の状態に戻ります。OBSを閉じているあいだも、本物の締め切りのようにカウントダウンは続きます。',
        p2: 'OBSやソースがオフのあいだは誰もチャットを読まないので、そのあいだのサブスクで時間は増えません。モデレーターがあとから `!subathon add` で追加できます。「表示されていないときにソースをシャットダウンする」をオフにしておくべき理由もこれで、詳しくは[OBSガイド](/guides/obs-browser-source)で説明しています。',
        p3: '保存されたタイマーは、そのOBSとそのチャンネルのものです。サブアソンの途中でKickを追加するなどURLのチャンネルを変えたり、別のOBSやブラウザのタブでURLを開いたりすると、新しいタイマーが始まります。',
      },
      zero: {
        title: 'タイマーがゼロになるとどうなりますか？',
        p1: '00:00:00 で止まって赤く点滅し、HPバーとリングのスタイルでは K.O. と表示されます。新しいサブスクで時間は増えなくなり、サブアソンは終了です。',
        p2: '続けるには、モデレーターが時間を付けて `!subathon add` か `!subathon set` を打つと、タイマーはすぐに再び動き出します。新しいサブアソンを始めるには `!subathon reset` と打ちます。',
      },
      change: {
        title: 'タイマーを変更したり、新しいサブアソンを始めたりするには？',
        p1: '設定ページの「ウィジェットURL」欄に今のURLを貼り付けます。チャンネルと設定が戻ってくるので、変えたいところを変えて新しいURLをコピーし、OBSの古いURLに上書きして貼り付けます。新しい追加時間や上限時間は、OBSが新しいURLを読み込んだ時点で適用され、残り時間はそのままです。',
        p2: '新しい「開始時間」が自動で適用されるのは、タイマーを初めて開始するまでです。それ以降は、チャットで `!subathon reset` と打つと新しい開始時間からやり直せます。「開始」がコマンドの設定なら、タイマーはまた `!subathon start` まで一時停止して待ちます。',
      },
      notCounted: {
        title: '時間が増えないものは？',
        follows:
          'フォローと投げ銭。TwitchもKickも、ログインしていないページには新しいフォローを見せず、どちらのプラットフォームにも独自の投げ銭機能はありません。',
        raids: 'レイド（どちらのプラットフォームでも）。',
        resubs:
          '視聴者がシェアしないTwitchの継続サブスク。Twitchは、視聴者がシェアしたときにしか継続サブスクをチャットに知らせません。Kickは更新をサブスクとして送るので、カウントされます。',
        bits: 'パワーアップなど、チャット以外で使われたBits。チャットでCheerされたBitsだけがカウントされます。',
        sharedChat:
          'Twitchの共有チャット中に、パートナーチャンネルで入ったサブスクやCheer。カウントされるのは自分のチャンネルだけです。',
      },
      ctaTitle: 'サブアソンタイマーを設定する',
      ctaText: '開始時間とサブスクごとの追加時間を決めて、URLをコピーし、OBSに追加しましょう。',
    },
    poll: {
      title: 'TwitchとKickでチャット投票をする方法',
      short: 'チャット投票をする',
      summary:
        '!poll での投票の出し方、視聴者の投票方法、1人1票の仕組み、配信遅延、時間切れやOBSを閉じたときの動き。',
      lead: 'チャット投票は、TwitchとKickのチャットが番号を打って参加できる投票を配信に表示します。URLを 640 × 560 のブラウザソースとしてOBSに追加し、あなたかモデレーターがチャットで `!poll Question | A | B` と打つだけ。ログインもボットも不要で、公開チャットを読み取ります。',
      setup: {
        title: 'チャット投票を設定するには？',
        step1: '[チャット投票の設定ページ](/setup/chat-poll)を開きます。',
        step2: 'Twitch、Kick、「両方」から選び、チャンネル名だけを入力します。',
        step3:
          '配信前に投票を用意しておきたいなら、「用意しておく投票」に質問と2個から6個の選択肢を入力します。`!poll start` で表示されます。',
        step4: '「投票時間」（初期設定は1分）、結果の表示時間、投票できる人を設定します。',
        step5:
          'カラー、位置、投票の言語を選び、URLをコピーして、640 × 560 のブラウザソースとしてOBSに追加します。',
        p1: '設定ページのプレビューでは、模擬投票者による投票がリアルタイムより速く流れ、終わると次の投票が始まります。「試してみる」のボタンで、10票の追加、30秒の延長、投票の締め切り、新しい投票の開始ができます。変わるのはプレビューだけで、OBSの投票には影響しません。',
      },
      commands: {
        title: 'チャットから投票を始めるには？',
        intro:
          'TwitchでもKickでも、投票を操作できるのは配信者とモデレーターだけです。VIPや視聴者は使えず、視聴者が `!poll` と打っても何も変わりません。',
        caption: 'チャット投票のチャットコマンド',
        colCommand: 'コマンド',
        colAction: '動作',
        question: '質問',
        new: 'URLの「投票時間」で、選択肢2個から6個の新しい投票を出します',
        newTime: '同じく、長さを指定して出します: 90s、2m、1m30s、1:30',
        yesNo: '「はい」と「いいえ」を選択肢にしたクイック投票を出します',
        start: 'URLに保存された、用意しておいた投票を出します',
        extend: 'タイマー付きの投票中に時間を延ばします',
        end: '今すぐ投票を締め切ります。勝者は配信遅延のあとに表示されます',
        cancel: '結果も含めて投票を画面から消します',
        p1: '質問と選択肢は `|` で区切ります。6個目より後の選択肢は無視され、大文字・小文字が違うだけの重複も除かれます。質問は80文字まで、選択肢はそれぞれ30文字までです。新しい投票は、画面上の投票と置き換わります。',
        p2: 'コマンドの単語には正しい引数が必要です。`!poll extend 30 seconds` は、それを質問として出したりせず、何もしません。質問の前にある数字だけの部分は長さとして読まれないので、`!poll 3 or 4 games? | 3 | 4` は質問がそのまま残ります。投票はチャットで返事をしないので、結果は画面で確認してください。',
      },
      voting: {
        title: '視聴者はどうやって投票しますか？',
        number: '選択肢の番号だけを打つ（例: `2`）。',
        command: '`!vote 2` や `!2`。ボットの投票に慣れた視聴者向けです。',
        text: '選択肢そのもの: `speedrun` で Speedrun に投票。大文字・小文字、アクセント記号やトルコ語の文字の有無は問いません。',
        p1: 'メッセージ全体が票である必要があります。`2 please`、`4Head`、`1 more game` はカウントされないので、普通のチャットが票になってしまうことはありません。選択肢そのものが数字の場合は、そのテキストが優先されます。`3 | 4 | 5` の投票で 3 と打つと、3番目の選択肢ではなく「3」という選択肢に投票されます。',
        p2: 'Twitchの `/vote` コマンドはTwitch純正の投票用なので、チャットには番号を打つよう伝えてください。投票の選択肢の下には「チャットで 1 から 3 を入力」のようなヒントが表示されます。',
      },
      rules: {
        title: '1人の視聴者が複数回投票できますか？',
        p1: 'いいえ。TwitchやKickのアカウントごとに1票です。初期設定でオンの「投票の変更を許可」では、新しい番号を打つと票が移ります。オフにすると最初の票で確定します。存在しない選択肢に投票しても、すでに入れた票が消えることはありません。',
        p2: '「投票できる人」を「サブスク」にすると、サブスクかファウンダーのバッジを持つ視聴者と、あなただけが投票できます。全員が投票できる設定では、「サブスクの票の重み」でサブスクの票を2倍や3倍にできます。投票画面にもそのことが表示され、パーセントはこの重み付きの票で計算されます。',
        p3: '投票の受付中にモデレーターがアカウントをタイムアウトやBANにすると、その票は取り消されるので、スパムボットによる大量の票も打ち消せます。',
      },
      timing: {
        title: '時間切れになるとどうなりますか？',
        p1: '視聴者はチャットより数秒遅れて配信を見ているので、視聴者の画面で残り1秒のとき、チャットではすでに投票が締め切られています。タイマー終了後も「配信遅延」の秒数（初期設定は5秒）は票をカウントし続け、そのあいだ投票には「最後の投票」と表示されます。視聴者の遅れに合わせて設定してください。TwitchもKickも、ふつうは2秒から10秒ほど遅れています。',
        p2: 'そのあと勝者が王冠付きのゴールドで光り、ほかの選択肢は暗くなります。最多得票の選択肢が2つ以上あるときは、引き分けと表示されます。結果は「結果の表示時間」（初期設定は30秒）のあいだ表示され、その後フェードアウトします。0にすると、次の投票か `!poll cancel` まで表示し続けます。',
        p3: '「投票時間」を0にするとタイマーのない投票になり、モデレーターが `!poll end` と打つまで受け付けます。`!poll extend` で時間を延ばせるのは、タイマー付きの投票だけです。',
      },
      look: {
        title: '見た目を変えるには？',
        blind:
          '終了まで結果を隠す: 投票中はバーを隠して票数だけを表示するので、序盤の票にほかの人が流されません。',
        color: 'カラー: 紫（初期設定）、緑、赤、ゴールド、シアン、ピンク。',
        position:
          '位置: 投票はブラウザソースの上か下に置かれ、選択肢の数に応じてそこから伸びます。',
        language:
          '投票の言語: 「結果」やクイック投票の「はい」「いいえ」など、投票に表示される言葉を英語、スペイン語、フランス語、ドイツ語、日本語、ポルトガル語、トルコ語から選べます。',
        p1: '両方のプラットフォームがオンのときは、合計の横にTwitchとKickそれぞれの票数が表示されます。ソースは透明なので、配信には投票カードだけが映ります。',
      },
      saved: {
        title: 'OBSを閉じたり、ソースを再読み込みしたりするとどうなりますか？',
        p1: '投票と票はOBSの中に保存されるので、再読み込みやOBSの再起動のあとも元の状態に戻ります。OBSを閉じているあいだもタイマーは進みます。',
        p2: 'OBSやソースがオフのあいだは誰もチャットを読まないので、そのあいだに打たれた票はカウントされません。「表示されていないときにソースをシャットダウンする」をオフにしておくべき理由もこれで、詳しくは[OBSガイド](/guides/obs-browser-source)で説明しています。保存された投票は、そのOBSとそのチャンネルのものです。',
      },
      limits: {
        title: 'チャット投票にできないことは？',
        chat: 'チャットへの書き込み。チャットを読むだけなので、投票や勝者をチャットで告知することはありません。どちらも配信上の投票に表示されます。',
        native:
          'TwitchやKick純正の投票の表示。Twitchの投票はログインしないと読み取れないので、両方のプラットフォームで同じように動くよう、票はチャットから集めます。',
        points:
          'チャンネルポイントやBitsでの投票。視聴者は1人1票で、オンにした場合はサブスクなら2票か3票です。',
        multiple: '複数選択。視聴者が選べる選択肢はひとつだけです。',
      },
      ctaTitle: 'チャット投票を設定する',
      ctaText:
        '用意しておく投票と投票ルールをひとつのURLにまとめてOBSに追加し、チャットで !poll と打ちましょう。',
    },
    frames: {
      title: 'OBSでカメラ、チャット、画面にフレームを付ける方法',
      short: '配信フレームを追加',
      summary:
        'カメラ、チャット、画面のフレームをOBSに追加する方法、ソースの順番、カメラをフレームに合わせる方法、プリセットとアニメーションの選び方。',
      lead: '配信フレームは、カメラ、チャット、配信画面全体の周りに、選んだプリセットのスタイルでそのまま使えるフレームを付けます。設定ページでパーツとプリセットを選び、URLをブラウザソースとしてOBSに追加して、カメラやチャットの上に重ねるだけ。フレームの中央は透明で、チャンネルの接続もログインも不要です。',
      setup: {
        title: '配信フレームを設定するには？',
        step1: '[配信フレームの設定ページ](/setup/stream-frames)を開きます。',
        step2:
          '「何にフレームを付けますか？」で、カメラ、チャット、画面から選びます。カメラを選んだ場合は、「向き」を横向きか縦向きにします。パーツごとに別のブラウザソースなので、3つとも追加してもかまいません。',
        step3:
          'プリセットを選びます。クラシックではカラーを自分で選びます。ほかのプリセットには、専用のカラー、フォント、イラストが付いています。',
        step4:
          '「ラベル」欄にチャンネル名や好きな言葉を入力します。カメラとチャットではフレームの上のタブに、画面では下のプレートに表示されます。',
        step5:
          'URLをコピーし、ブラウザソースとしてOBSに追加します。カメラは 640 × 360（縦向きのカメラは 360 × 640）、チャットは 420 × 720、画面は 1920 × 1080 です。',
        p1: 'プレビューでは、人物のシルエットかサンプルのチャット行と一緒にフレームが表示されます。これはただのダミーです。配信では、フレームの中央は空っぽです。',
      },
      layers: {
        title: 'フレームがカメラの後ろに隠れてしまうのはなぜですか？',
        p1: 'OBSでは、「ソース」リストで上にあるものほどシーンの手前に表示されます。フレームのソースを、カメラ（映像キャプチャデバイス）やチャットボックスより上に移動してください。ソースを右クリックして「順序 → 最上部に移動」を選ぶこともできます。',
        p2: 'カメラとフレームを一緒に動かすには、両方を選択して右クリックし、「選択したアイテムをグループ化」を選びます。グループのサイズを変えると、両方が一緒に拡大縮小されます。',
        p3: '画面のフレームはシーン全体の手前に置きます。リストのいちばん上に置けば、ゲームやほかのソースはすべてその下に収まります。',
      },
      fit: {
        title: 'カメラをフレームに合わせるには？',
        intro:
          'フレーム中央の開口部は、外枠より少し小さくなっています。カメラは開口部を埋めつつ外枠の内側に収めないと、はみ出た部分がフレームの周りに見えてしまいます。推奨サイズなら、次のサイズでぴったり合います。',
        caption: 'フレームの推奨サイズと、中に入れるソース',
        colPiece: 'パーツ',
        colFrame: 'フレームのサイズ',
        colInside: '中に入れるソース',
        camera: '横向きのカメラ',
        cameraPortrait: '縦向きのカメラ',
        chat: 'チャット',
        screen: '画面',
        cameraInside: 'カメラを 590 × 296 にして、フレームの中央に',
        cameraPortraitInside: 'カメラを 306 × 572 にして、フレームの中央に',
        chatInside: 'チャットボックスを 370 × 660 にして、フレームの中央に',
        screenInside: 'ゲームや画面キャプチャでシーン全体を埋める',
        p1: '16:9のカメラを幅590にすると高さは332なので、上下を均等にクロップして296にします。Alt（MacではOption）を押しながらソースの上下の端をドラッグするか、カメラを右クリックして「変換 → 変換の編集」のクロップ欄を使います。縦向きのカメラはその逆です。9:16のカメラを高さ572にすると幅は322なので、左右を均等にクロップして306にします。',
        p2: 'もっと大きなフレームを使う場合は、これらのサイズも比例して大きくなります。1280 × 720 のカメラフレームなら、カメラは 1180 × 592 です。正方形のカメラなら、ブラウザソースの幅と高さをそろえるだけで、フレームがその形で描かれます。',
      },
      look: {
        title: 'プリセットとアニメーションで何が変わりますか？',
        p1: 'プリセットは、フレームの形、イラスト、カラー、フォントを決めます。Dynastyなら楼閣の屋根と房飾り、Riftなら金の縁取りとターコイズの宝石、Blocksなら草ブロックとホットバー。チャットボックス、配信アラート、サブスク目標にも同じプリセットを設定すれば、画面全体の雰囲気がそろいます。',
        p2: 'アニメーションをオンにすると、フレームの周りを光が走り、ラインが光り、プリセットによって提灯、松明、火花が動きます。軽く作ってありますが、ゲーム中にパソコンが重いと感じたら、アニメーションをオフにしてください。URLに `motion=0` が付き、フレームは静止します。',
        p3: 'イラストはすべてゼロから描いたもので、ゲームのロゴやアートワークは使っていません。',
      },
      change: {
        title: 'あとからフレームを変更するには？',
        p1: 'OBSのURLを設定ページの「ウィジェットURL」欄に貼り付けると、設定が戻ってきます。プリセット、パーツ、ラベルを変えて新しいURLをコピーし、ブラウザソースの古いURLに上書きして貼り付けます。すべてのウィジェットのプリセットをまとめて変えるなら、[プリセットページ](/presets)を使ってください。',
      },
      ctaTitle: 'フレームを設定する',
      ctaText: 'パーツとプリセットを選んで、プレビューを確認し、URLをコピーしましょう。',
    },
    countdown: {
      title: 'OBSに開始前、休憩、終了のカウントダウンを追加する方法',
      short: 'カウントダウンを追加',
      summary:
        '開始前、休憩、終了シーン用のカウントダウンの設定、シーンを切り替えるたびに最初から始める方法、時刻に向けたカウントダウン、チャットコマンド。',
      lead: '配信カウントダウンは、まだ何も始まっていない3つのシーン（まもなく開始、すぐ戻ります、まもなく配信終了）のための時計です。設定ページでシーンと長さを選び、URLを 1920 × 1080 のブラウザソースとしてOBSに追加して、「シーンがアクティブになったときにブラウザの表示を更新する」にチェックを入れれば、そのシーンに切り替えるたびに最初から始まります。ログインは不要で、チャットコマンドを使わないならチャンネルも不要です。',
      setup: {
        title: '配信カウントダウンを設定するには？',
        step1: '[配信カウントダウンの設定ページ](/setup/stream-countdown)を開きます。',
        step2:
          '「何に使いますか？」で、開始前、休憩、終了から選びます。これで文言とアイコンが決まります。それぞれ別のブラウザソースなので、3つとも追加できます。',
        step3:
          '「カウント方式」で「時間の長さ」を選んで分数を設定するか、「時刻」を選んで 21:00 のような24時間表記の時刻を入力します。',
        step4:
          'プリセットを選び、「ゼロになったら」で、時間切れのときに画面に残すもの（メッセージ、00:00 の時計、何もなし）を選びます。',
        step5:
          'URLをコピーし、時計がシーンの中央に来るように、1920 × 1080 のブラウザソースとしてOBSのシーンに追加します。',
        p1: '設定ページのプレビューは早送りで流れるので、カウントダウン全体を数秒で確認できます。配信ではリアルタイムでカウントダウンします。',
      },
      restart: {
        title: 'カウントダウンが最初から始まらないのはなぜですか？',
        p1: 'カウントダウンは、ブラウザソースが読み込まれたときに始まります。OBSを起動したときにソースが読み込まれていたら、そこからずっとカウントダウンしているので、BRBシーンに切り替えるころにはもうゼロになっています。',
        p2: 'ブラウザソースのプロパティを開いて、「シーンがアクティブになったときにブラウザの表示を更新する」にチェックを入れてください。そのシーンに切り替えるたびにOBSがページを再読み込みするので、休憩のたびにカウントダウンが最初から始まります。',
        p3: 'チャンネルを入力しておけば、チャットで `!countdown reset` と打って、OBSに触らずにやり直すこともできます。すでに席を外しているときは、これがいちばん手っ取り早い方法です。',
      },
      clock: {
        title: '時刻に向けてカウントダウンするには？',
        p1: '「時刻」を選んで、告知した時刻（例: 21:00）を入力します。カウントダウンはOBSを動かしているパソコンの時計が基準なので、ソースがいつ読み込まれても関係ありません。18:30 なら 2:30:00、20:55 なら 05:00 と表示されます。',
        p2: '今日すでに過ぎた時刻なら、翌日の同じ時刻に向けてカウントします。そのため、一晩開いたままのソースも次の配信に備えられ、`!countdown reset` で次の時刻に合わせ直せます。',
        p3: 'ほかの国の視聴者にも、自分の時計ではなくあなたのカウントダウンが表示されます。それが狙いで、全員が同じ残り時間を見られます。',
      },
      commands: {
        title: 'モデレーターはチャットからカウントダウンを変更できますか？',
        p1: 'はい。設定ページでTwitchかKickのチャンネルを入力すれば、あなたとモデレーターがどちらのチャットからでも次のコマンドを使えます。',
        caption: '!countdown コマンド',
        colCommand: 'コマンド',
        colDoes: '動作',
        addDoes: '5分追加します。90s や 1h30m も使えます',
        removeDoes: '2分減らします',
        setDoes: '残り時間を10分に設定します',
        pauseDoes: '時計をその場で一時停止します',
        startDoes: '一時停止から再開します',
        resetDoes: 'カウントダウンを最初からやり直します',
        sceneDoes: 'シーンを休憩、開始前、終了に切り替え、長さを設定します（省略すると10m）',
        p2: '使えるのはどちらのプラットフォームでもあなたとモデレーターだけで、チャットの返信でコマンドが実行されることはありません。カウントダウンは、ほかのウィジェットと同じようにログインなしで公開チャットを読み取ります。',
      },
      scenes: {
        title: 'どのカウントダウンをどのシーンに置けばいいですか？',
        p1: '開始前は、配信開始前に表示しておくシーンに置き、10分のような長さか告知した時刻を設定します。休憩はBRBシーンに置き、ふつうは5分か10分の短めの長さにします。終了は最後のシーンに置けば、配信を締めるまでの残り時間がチャットに伝わります。',
        p2: '[OBS Bridge](/setup/obs-bridge)でチャットからシーンを切り替えているなら、モデレーターがBRBシーンに切り替えると、カウントダウンも一緒に始まります。',
      },
      ctaTitle: 'カウントダウンを設定する',
      ctaText: 'シーンと長さを選んで、プレビューを見て、URLをOBSにコピーしましょう。',
    },
    alerts: {
      title: 'OBSにTwitchとKickのサブスク、Cheer、レイドのアラートを追加する方法',
      short: '配信アラートを追加',
      summary:
        '各プラットフォームで出せるアラート、テーマとカラー、最小数、OBSで音を鳴らす方法、フォローアラートがない理由。',
      lead: '配信アラートは、TwitchとKickのサブスク、ギフトサブ、BitsのCheer、Kicksのギフト、レイドのたびに、専用の効果音付きのアニメーションアラートを表示します。設定ページでチャンネル名を入力してテーマを選び、URLを 800 × 450 のブラウザソースとしてOBSに追加するだけ。ログインは不要で、ひとつのURLで両方のプラットフォームに対応します。',
      setup: {
        title: 'OBSに配信アラートを追加するには？',
        step1: '[配信アラートの設定ページ](/setup/stream-alerts)を開きます。',
        step2: 'Twitch、Kick、「両方」から選び、チャンネル名だけを入力します。',
        step3: 'テーマとカラーを選び、いらないアラートはオフにします。',
        step4:
          'URLをコピーし、800 × 450 のブラウザソースとしてOBSに追加して、アラートを表示したい位置に置きます。',
        step5:
          '音が配信に乗るように、ソースのプロパティで「OBSで音声を制御する」をオンにします。音については下で詳しく説明します。',
        p1: 'アラートとアラートのあいだ、ソースは空で透明です。確認のためにブラウザのタブでURLを開くと、チャンネルで何か起きるまで真っ白なページが表示されます。',
        p2: 'あとで変更するには、設定ページの「ウィジェットURL」欄に今のURLを貼り付けます。チャンネルと設定が戻ってくるので、新しいURLをコピーしてOBSの古いURLに上書きして貼り付けます。',
      },
      kinds: {
        title: 'どんなアラートがありますか？',
        caption: 'TwitchとKickの配信アラートのイベント',
        colAlert: 'アラート',
        sub: 'サブスク',
        subTwitch: '新規サブスクとシェアされた継続サブスク。月数とメッセージ付き',
        subKick:
          '新規サブスクと更新（Kickが送る場合は月数付き）、チャットでシェアされた継続サブスク',
        gift: 'ギフトサブ',
        giftBoth: 'ギフト1回につきアラート1回。贈った人とサブスクの件数付き',
        bits: 'Bits & Kicks',
        bitsTwitch: 'BitsのCheer。量とメッセージ付き',
        bitsKick: 'Kicks。量とメッセージ付き',
        raid: 'レイド',
        raidTwitch: 'レイドしてきたチャンネルと、来た視聴者数',
        raidKick: 'レイドしてきたチャンネルと、Kickが送る場合は視聴者数',
        p1: '50件のギフトサブは50回ではなく1回のアラートで、サブスクを受け取った人に個別のアラートは出ません。匿名のギフトでは名前が「匿名」と表示されます。ティアは表示されず、Prime、Tier 1、Tier 2、Tier 3のどのサブスクでも同じアラートです。',
        p2: 'Kickはほとんどのサブスクで月数を送りますが、まったく届かないチャンネルもあり、その場合アラートには「サブスクしました」とだけ表示されます。Kickの視聴者があとで継続サブスクをチャットでシェアすると、月数とメッセージ付きの別のアラートが出るので、Kickの継続サブスクは2回表示されることがあります。Twitchでは視聴者がシェアしたときだけ継続サブスクがチャットに届くので、表示は1回です。',
        p3: 'Twitchの共有チャット中は、パートナーチャンネルでのサブスク、ギフト、Cheer、レイドは表示されません。アラートが出るのは自分のチャンネルだけです。',
      },
      follows: {
        title: 'フォローや投げ銭のアラートがないのはなぜですか？',
        p1: 'TwitchもKickも、ログインしていないページには新しいフォローを見せず、どちらのプラットフォームにも独自の投げ銭機能はありません。配信アラートは両プラットフォームがすべての視聴者に送る情報だけを使うので、ログインなしで、どちらでも同じように動きます。',
      },
      look: {
        title: 'テーマとカラーの種類は？',
        neon: 'ネオン（初期設定）: シンセ音が鳴る角ばったSF風のバナー。消えるときはネオンサインのようにちらつきます。',
        celestial: 'セレスティアル: 星空の下のネイビーのカード。細いフレームとベルの音が特徴です。',
        p1: 'カラーはアラートのアクセントカラーです。初期設定の「プラットフォーム」は、Twitchのアラートを紫、Kickのアラートを緑で表示します。すべてのアラートを1色にすることもでき、青、紫、ピンク、赤、ゴールド、緑から選べます。URLに両方のチャンネルがあるときは、小さな TWITCH か KICK のタグで送信元がわかります。',
        p2: '各アラートの見出しは24文字まで書き換えられます。空欄にすると「新規サブスク」のような初期設定のままです。ネオンでは英字の見出しが大文字で表示されます。「アラートの言語」はアラートに表示される言葉の言語を決めます。英語、スペイン語、フランス語、ドイツ語、日本語、ポルトガル語、トルコ語から選べ、OBSが何語で動いていてもURLに保持されます。',
      },
      min: {
        title: '少額のギフト、Cheer、レイドを除外するには？',
        caption: '配信アラートの最小数',
        colSetting: '設定',
        colDefault: '初期設定',
        colRange: '範囲',
        gift: '最小サブスク数（ギフトサブ）',
        giftRange: '1から100,000',
        bits: '最小量（BitsまたはKicks）',
        bitsRange: '1から100,000',
        raid: '最小視聴者数（レイド）',
        raidRange: '0から100,000',
        p1: '最小数を下回るものにはアラートが出ません。「最小量」はBitsとKicksの両方に共通で、サブスクには最小数はありません。Kickが視聴者数なしでレイドを送った場合は0人として扱うので、「最小視聴者数」が1以上ならスキップされます。',
      },
      queue: {
        title: 'たくさんのアラートが同時に届くとどうなりますか？',
        p1: '届いた順に順番待ちをして、短い間を空けながら1つずつ表示されます。「表示時間」で、各アラートの表示時間を3秒から20秒（初期設定は7秒）で設定できます。順番待ちは30件までで、それ以上たまると新しいものがスキップされます。',
        p2: '初期設定でオンの「視聴者のメッセージを表示」は、継続サブスク、Bits、Kicksと一緒に視聴者が書いたメッセージを表示します。リンクは除かれ、長いメッセージは途中で切られるので、誰かが配信にリンクを載せることはできません。',
      },
      sound: {
        title: 'OBSでアラートの音を鳴らすには？',
        step1:
          '配信アラートのソースをダブルクリックし、「OBSで音声を制御する」にチェックを入れて「OK」をクリックします。これでソースが音声ミキサーに表示されます。',
        step2: '上部メニューから「編集 → オーディオの詳細プロパティ」を開きます。',
        step3:
          '自分でもアラートを聞きたいなら、そのソースの「音声モニタリング」を「モニタリング有効」にします。古いOBSでは「モニターと出力」という名前です。',
        p1: '音量は0から100（初期設定は50）で、0にすると音がオフになります。アラートごとに、テーマに合った専用の短い効果音があります。ネオンはシンセ、セレスティアルはベルです。OBSでは自動で音が鳴りますが、普通のブラウザのタブでは一度ページをクリックするまで音は出ません。',
      },
      test: {
        title: '配信前にアラートをテストするには？',
        p1: '設定ページのプレビューでは、音なしのサンプルアラートが流れます。その下の「試してみる」のボタンで、サブスク、ギフト、Bits/Kicks、レイドを今の音量で再生できるので、テーマを選ぶ前に見た目と音を確認できます。',
        warnTitle: 'テストボタンはOBSには届きません',
        warn: 'テストが再生されるのは設定ページのプレビューだけです。OBSのソースにはチャンネルの実際のサブスク、ギフト、Cheer、レイドしか表示されないので、テストアラートを送ることはできません。',
        p2: 'ソースのあるシーンはアクティブのままにし、「表示されていないときにソースをシャットダウンする」はオフにしておきます。ソースがオフのあいだに届いたアラートは見逃され、あとから再生されることもありません。',
      },
      ctaTitle: '配信アラートを設定する',
      ctaText:
        'チャンネルを入力して、テーマを選び、URLをコピー。次のサブスクからアラートが出ます。',
    },
    reader: {
      title: 'TwitchとKickのチャットをひとつのウィンドウやOBSのドックで読む方法',
      short: 'OBSのドックでチャットを読む',
      summary:
        'チャットリーダーの開き方、OBSにドックとして追加する方法、接続が切れたときの動き、更新してもチャットが残る仕組み。',
      lead: 'チャットリーダーは、TwitchとKickのチャットをひとつのリストにまとめて、ブラウザのタブやOBSのドックに表示します。配信しながらチャットを読むのにぴったりです。チャットボックスの設定ページにある「チャットリーダーを開く」ボタンから開けます。切断されても自動で再接続し、途切れた箇所をすべてリストに記録して、更新してもチャットが残ります。',
      open: {
        title: 'チャットリーダーを開くには？',
        step1:
          '[チャットボックスの設定ページ](/setup/chat-widget)を開き、Twitchチャンネル、Kickチャンネル、またはその両方を入力します。',
        step2:
          'ウィジェットURLの下にある「チャットリーダーを開く」をクリックします。新しいタブでリーダーが開きます。',
        step3:
          '次回も同じリーダーを開けるように、タブをブックマークするか、アドレスを保存しておきます。',
        p1: 'リーダーは、チャンネルとチャットボックスのいくつかの設定（エモートプロバイダー、バッジ、「ボットを隠す」、「コマンドを隠す」、「ハイライト」）を引き継ぎます。フォント、レイアウト、アニメーションなどの見た目はオーバーレイ側の設定で、リーダーには独自の文字サイズと時刻の設定があります。引き継いだ設定を変えるには、設定ページで変更してからリーダーを開き直してください。',
      },
      dock: {
        title: 'チャットリーダーをOBSのドックとして追加するには？',
        step1: 'チャットリーダーを開き、アドレスバーのアドレスをコピーします。',
        step2:
          'OBSの上部メニューから「ドック → カスタムブラウザドック」を開きます。古いバージョンでは「表示 → ドック」の中にあります。',
        step3:
          '「チャット」などの名前を入力し、URLの列にアドレスを貼り付けて「適用」をクリックします。',
        step4: '新しいドックを、OBSウィンドウの好きな位置にドラッグします。',
        p1: 'OBSには独自のブラウザストレージがあるので、ドックは普段のブラウザとは別に、独自の履歴と設定を保持します。',
      },
      shows: {
        title: 'チャットリーダーには何が表示されますか？',
        p1: '両方のチャットのメッセージが、届いた順にひとつのリストに表示されます。両方のチャンネルを設定していれば、TwitchかKickのアイコンで送信元がわかります。エモート、バッジ、ユーザー名の色は、チャットボックスと同じように表示されます。',
        p2: '削除されたメッセージは取り消し線と「（削除済み）」の表示付きでリストに残るので、何が消されたかも確認できます。誰かがタイムアウトやBANされると、その人の過去のメッセージにも同じ印が付きます。モデレーターがチャットを消去すると、リストにその旨の行が入ります。',
        p3: 'A- と A+ で、文字サイズを12から28ピクセル（初期設定は15）で変えられます。時計のボタンでメッセージの時刻の表示を切り替え、ゴミ箱のボタンを2回クリックすると履歴を消去します。文字サイズと時刻の設定はリーダーが覚えています。',
        p4: '何かを読もうと上にスクロールすると、リストの動きが止まります。下のボタンに新着メッセージの数が表示され、クリックすると最新のチャットに戻ります。',
      },
      drops: {
        title: '接続が切れるとどうなりますか？',
        p1: '各チャンネルの状態が上部に表示されます。接続中、接続済み、再接続中、またはKickの名前が見つからないときは「チャンネルが見つかりません」です。チャットの接続が切れると次の試行までのカウントダウンが表示され、「今すぐ再試行」ですぐに試せます。試行は1秒間隔から始まり、最大で30秒に1回まで間隔が空いていきます。',
        p2: 'リーダーは、接続が閉じないまま静かになってしまう状態も検知します。これはネットワークが途切れたあとに起こることがあります。30秒間何も届かなければ、チャットがまだつながっているか確認し、応答がなければ再接続します。パソコンがオフラインになったときはそれを知らせ、インターネットが戻り次第再接続します。',
        p3: '途切れた箇所は「Twitchのチャット接続が切れました」「12秒後にTwitchのチャットに復帰しました」のようにすべてリストに書き込まれるので、メッセージが抜けているかもしれない場所が正確にわかります。',
      },
      history: {
        title: 'ページを更新するとチャットは消えますか？',
        p1: 'いいえ。リーダーは直近の1000行をブラウザに保存し、次に開いたときに復元します。そのあとに「前回の表示から保存された履歴」と時刻が書かれた行が続きます。12時間より古い行は削除されます。',
        p2: 'リーダーを閉じていたあいだに送られたメッセージは戻りません。その行より上は前回の表示の分、下は新しいメッセージです。履歴はチャンネルの組み合わせごとに別々に保存され、「履歴を消去」で削除できます。',
      },
      limits: {
        title: 'チャットリーダーにできないことは？',
        send: 'メッセージの送信やモデレーションはできません。ログインしていない視聴者と同じように、チャットを匿名で読み取ります。',
        events:
          'サブスク、ギフト、レイドの通知は表示しません。それらを表示するには、[配信アラート](/setup/stream-alerts)を配信に追加してください。',
        missed:
          '閉じていたあいだに送られたメッセージは、どちらのプラットフォームでも復元できません。',
      },
      ctaTitle: 'チャットリーダーを開く',
      ctaText:
        'チャットボックスの設定ページでチャンネルを入力し、「チャットリーダーを開く」をクリックしましょう。',
    },
  },
  presets: {
    classic: 'クラシック',
    classicTag: 'ウィジェットごとの元の見た目',
    breadcrumb: 'プリセット',
    eyebrow: 'プリセット',
    title: '配信オーバーレイ用のゲームプリセット',
    lead: 'プリセットを選ぶと、チャットボックス、配信アラート、サブスク目標、Subathon Timer、チャット投票、抽選の当選者、配信フレームが、同じフレーム、フォント、カラーでそろいます。すべてのウィジェットに同じものを使っても、ウィジェットごとに変えてもかまいません。',
    pickTitle: 'プリセットを選ぶ',
    by: '作者: {author}',
    community: 'コミュニティ',
    makeDefault: 'すべてのウィジェットで{name}を使う',
    isDefault: '{name}がデフォルトです',
    defaultHint:
      'このブラウザでは、どの設定ページもデフォルトのプリセットで始まります。ウィジェットごとに別のプリセットを選ぶこともできます。',
    previewTitle: 'すべてのウィジェットに{name}を適用',
    setUp: '{widget}を設定する',
    previewIframeTitle: '{name}プリセットを適用した{widget}のプレビュー',
    descriptions: {
      classic:
        '各ウィジェットが最初から持っている見た目。ネオンの配信アラート、紫のサブスク目標バー、シンプルなチャットボックスの文字。カラーは自分で選べます。',
      rift: 'ダイヤ型の鋲をあしらった細い金のフレーム、深いネイビーのパネル、光るティールのバー。タイトルはCinzel。',
      realm:
        'リベット付きのブロンズと金のフレーム、ダークレザーのパネル、レジェンダリーなオレンジのバー。タイトルはMarcellus。',
      dynasty:
        '金の角金具が付いた朱塗りのフレーム、濃い木目のパネル、深紅のバー。タイトルはZen Antique。',
      ancient: 'ブロンズの角が付いた黒鉄のフレーム、下辺に沿った赤い光、鋭いGrenzeのタイトル。',
      agent: '切り欠いた角、赤いエッジ、斜めのバー、ダークスレートに映える縦長のTekoの数字。',
      defuse:
        'HUD風のコーナーブラケット、琥珀色のトップライン、バーの警告ストライプ、詰まったSairaの書体。',
      blocks:
        '草と土の色のピクセルフレーム、ブロックに分かれた緑のバー、ピクセルフォントのJersey 10。',
    },
    existingTitle: 'OBSにもうウィジェットがありますか？',
    existingText:
      'ここにURLを1行に1つずつ貼り付けると、{name}を適用したURLをコピーできます。それぞれをOBSのブラウザソースのURL欄に貼り付けてください。URLのほかの部分はそのままです。',
    existingLabel: 'ウィジェットURL',
    existingResult: '{name}を適用したURL',
    existingUnsupported: 'プリセット非対応のため、そのままにしました',
    existingInvalid: 'SenchabotのウィジェットURLではありません',
    communityTitle: '自分のプリセットを作る',
    communityText:
      'プリセットは小さなJSONファイル1つだけ。9つのカラー、2つのGoogle Fonts、フレームのスタイルでできています。GitHubでプルリクエストとして送ってください。マージされると、あなたの名前付きでここと各設定ページに表示されます。',
    communityLink: 'プリセットの作り方',
    communityEmpty:
      'コミュニティのプリセットはまだありません。あなたのプリセットが最初になるかもしれません。',
    disclaimer:
      'ゲーム名は各権利者の商標です。これらのプリセットは、ゲームのアートを使わずにカラー、フォント、イラストのスタイルを再現したファンメイドのもので、ゲームメーカーとの提携や公認はありません。',
    faqTitle: 'プリセットに関する質問',
    faq1Q: 'プリセットを変えると、OBSにすでにあるウィジェットも変わりますか？',
    faq1A:
      'いいえ。ウィジェットの見た目はURLの一部なので、OBSのウィジェットは新しいURLにするまで今の見た目のままです。上のボックスにURLを貼り付ければ、プリセットを適用したURLを取得できます。',
    faq2Q: 'ウィジェットごとに別のプリセットを使えますか？',
    faq2A:
      'はい。デフォルトは、各設定ページの最初の状態を決めるだけです。どのウィジェットの設定ページでも別のプリセットを選べ、そのウィジェットのURLに反映されます。',
    faq3Q: 'プリセットに対応しているウィジェットは？',
    faq3A:
      'チャットボックス、配信アラート、サブスク目標、Subathon Timer、チャット投票、抽選の当選者オーバーレイ、配信フレームです。エモートウォールはエモートを表示するだけで、Sub Sproutは独自の植物を描くので、見た目はそのままです。',
    faq4Q: 'これらは公式のゲームテーマですか？',
    faq4A:
      'いいえ。カラー、無料のGoogle Fonts、ゼロから描いた装飾で作ったファンメイドのスタイルで、ゲームのロゴやアートは使っておらず、ゲームメーカーとも提携していません。',
    field: {
      label: 'プリセット',
      tip: 'このウィジェット用のすぐ使える見た目です。フレーム、フォント、カラーが決まります。すべてのウィジェットで同じプリセットを選べば、見た目がそろいます。',
      browse: 'すべてのプリセット',
      owns: 'カラーとフォントは{name}のものを使います。',
      makeDefault: '{name}をデフォルトにする',
      makeDefaultTip: 'このブラウザでは、どの設定ページもこのプリセットで始まります。',
      isDefault: 'デフォルト',
    },
  },
  faqPage: {
    breadcrumb: 'よくある質問',
    title: 'よくある質問',
    lead: 'Senchabot Extensionsの料金、プライバシー、対応プラットフォーム、ウィジェットURLについての簡単な回答です。特定のウィジェットを設定するなら、[ガイド](/guides)をご覧ください。',
    groups: {
      basics: '料金とアカウント',
      platforms: 'ソフトとプラットフォーム',
      urls: 'ウィジェットURLとプライバシー',
      help: 'サポート',
    },
    freeQ: 'Senchabot Extensionsは無料ですか？',
    freeA:
      'はい。12個のウィジェットとツールはすべて無料です。チャットボックス、エモートウォール、Sub Sprout、Subathon Timer、配信アラート、サブスク目標、配信フレーム、配信カウントダウン、チャット投票、SNSリンク、抽選、OBS Bridge。有料プランも透かしもプレミアムアカウントもありません。ソースコードはGPL-3.0ライセンスでGitHubに公開しています。',
    loginQ: '「ログイン不要」とはどういう意味ですか？',
    loginA:
      'このサイトでアカウントを作ることも、TwitchやKickでログインすることも、何かをダウンロードすることもありません。チャンネル名を入力すれば、設定ページがURLを発行します。ウィジェットは公開チャットを匿名で読み取ります。Twitchでは匿名の視聴者として接続し、Kickでは公開チャットのフィードを受け取ります。そのため、チャットへの書き込み、モデレーション、アカウントの非公開情報へのアクセスはできません。',
    affiliatedQ: 'Senchabot ExtensionsはTwitchやKickと提携していますか？',
    affiliatedA:
      'いいえ。Senchabot Extensionsは、Twitch、Discord、Kick、YouTube向けのオープンソースのコミュニティボット、Senchabotが作っています。TwitchやKickとの公式なつながり、提携、公認はありません。',
    appsQ: 'どの配信ソフトで使えますか？',
    appsA:
      'OBS Studioをはじめ、ブラウザソースに対応した配信ソフトならどれでも使えます。各ウィジェットはウェブのURLとして動き、そのURLをソースに貼り付けるだけです。ガイドはOBS Studio向けに書いています。',
    platformsQ: 'どのウィジェットがTwitchに、どれがKickに対応していますか？',
    platformsA:
      '12個すべてが両方のプラットフォームに対応しています。チャットボックス、エモートウォール、Sub Sprout、Subathon Timer、配信アラート、サブスク目標、チャット投票、配信カウントダウンは、ひとつのURLでTwitchとKickのチャンネルを同時に聞き取ります。OBS Bridgeは両方のチャットからコマンドを受け取り、許可ユーザーはそれぞれのプラットフォームと一緒に追加します。抽選は一度にひとつのプラットフォーム（TwitchかKick）で動きます。配信フレームとSNSリンクはチャットを読まないので、どちらのプラットフォームでも同じように動きます。チャットボックスでは、7TVのエモートは両方のプラットフォームで、BTTVとFFZのエモートはTwitchでのみ表示されます。',
    editQ: 'あとからウィジェットを変更するには？',
    editA:
      '設定ページで設定を変えて新しいURLをコピーし、OBSのソースのURL欄にある古いURLに上書きして貼り付けます。チャットボックス、エモートウォール、Sub Sprout、Subathon Timer、配信アラート、サブスク目標、チャット投票、配信フレーム、SNSリンク、配信カウントダウンなら、古いURLを設定ページの「ウィジェットURL」欄に貼り付けると設定がすべて戻ってくるので、一からやり直す必要はありません。',
    oldUrlsQ: '古いウィジェットURLは使い続けられますか？',
    oldUrlsA:
      'はい。アップデートは既存のURLが壊れないように行っています。パラメータ名、値、初期設定は変わりません。たとえば、チャットボックスの古い keep=true は今も「ずっと表示」を意味し、Sub Sproutも古い channel と platform のパラメータを読み取ります。',
    privacyQ: '設定はどこに保存され、データはどこに送られますか？',
    privacyA:
      '設定はアカウントやデータベースではなくウィジェットURLの中にあるので、URLを持っている人なら誰でも同じウィジェットを開けます。ほかのウェブサイトと同じく、開いたページのアドレスは私たちのホスティングに届き、そのリクエストログに残ることがあります。ウィジェットはTwitchとKickから直接チャットを匿名で読み取り、7TV、BetterTTV、FrankerFaceZからエモートを、ivr.fiからTwitchのチャンネル情報を取得します。抽選の参加者と当選者は、あなたのブラウザの中に保存されます。OBS BridgeのURLにはOBSのWebSocketパスワードが含まれるので、パスワードと同じように扱ってください。',
    emptyQ: 'OBSでウィジェットが空に見えるのはなぜですか？',
    emptyA:
      'チャットボックスとエモートウォールは、チャットで何か起きるまで透明で空のままなので、まずチャットにメッセージを送ってみてください。それでも何も出ない場合は、チャンネル欄にリンクではなくチャンネル名だけを入力しているか、名前のつづりが正しいかを確認してください。確認項目の一覧はOBSガイドにあります。',
    bugQ: 'ウィジェットのリクエストやバグ報告はどうすればいいですか？',
    bugA: 'GitHubのsenchabot-opensource/monorepoリポジトリで新しいIssueを作成してください。バグを報告するときは、ウィジェットURL（パスワードがあれば削除してください）、使っている配信ソフト、表示される内容を書いてください。アイデアはGitHub DiscussionsやSenchabotのDiscordサーバーでも受け付けています。',
    ctaTitle: '答えが見つかりませんでしたか？',
    ctaText:
      'ガイドでは、設定とトラブルシューティングをステップごとに説明しています。それでも解決しないときは、GitHubでご連絡ください。',
    ctaGuides: 'ガイドを見る',
    ctaIssue: 'GitHubでIssueを作成',
  },
  changelog: {
    breadcrumb: '更新履歴',
    title: '更新履歴',
    lead: 'Senchabot Extensionsの新機能とバグ修正を、新しい順に並べています。このリストは[GitHub](https://github.com/senchabot-opensource/monorepo/commits/dev/apps/extensions)にあるプロジェクトのコミット履歴からまとめています。',
    site: 'サイト',
    entries: {
      moreLanguages:
        'サイトがスペイン語、フランス語、ドイツ語、日本語、ポルトガル語にも対応しました。チャット投票、配信アラート、Subathon Timerのレートも、これらの言語で表示できるようになりました。',
      countdownSceneCommand:
        '`!countdown {scene} {duration}` チャットコマンドを追加しました。モデレーターがひとつのコマンドで、現在のシーン（開始前、休憩、終了）を切り替えて長さを設定できます。',
      socialsLaunch:
        '新ウィジェット「SNSリンク」: SNSのリンクを、なめらかなスライドアニメーションで順番に表示します。',
      thinBarReadable:
        'Subathon Timerとサブスク目標の細いバーの文字が大きくなり、縁取りが付いて、どんな塗りの上でも読みやすくなりました。光は控えめになり、レートの上にスペースができました。',
      thinBars:
        'Subathon Timerとサブスク目標に「細いバー」スタイルが加わりました。タイトルと時間、またはカウントを、スリムなプログレスバーの中に直接収めます。',
      subathonAdjustedDefaults:
        'Subathon Timerの「残り時間でレートを変える」が、しきい値5時間と低めのレートが入った状態で始まるようになりました。Twitchではサブスク1件5分、ギフトサブ1件10分、500 Bitsごとに20分、Kickではそれぞれ10分です。',
      subathonDynamicRates:
        'Subathon Timerのレートを調整できるようになりました。しきい値を設定すると、残り時間がすでに多いときにサブスクで増える時間を減らせます。',
      scrollHint:
        '画面に収まらない長さの設定パネルでは、下に小さな矢印が表示されるようになり、まだ設定が続いていることがわかります。押すと下へ移動し、いちばん下まで来ると向きが変わってトップに戻れます。',
      chatTextShadow:
        'チャットボックスに「文字の影」の選択肢が加わりました。なし、標準（従来どおり）、強から選べます。強は暗い縁取りで、明るいゲーム画面でもチャットが読みやすくなります。',
      chatFonts:
        'チャットボックスに、ユーザー名用とメッセージ用のフォント欄ができ、プリセット使用中でもどちらも選べるようになりました。プリセットの2つのフォントをそのまま使う、見出し用のフォントをメッセージにも使う、Inter、Roboto、Nunito、JetBrains Mono、Source Serif 4、システムフォントと組み合わせる、といった使い方ができます。Realm、Dynasty、Blocksのように1つのウェイトしかないフォントのプリセットでも、ユーザー名とメッセージの太字が使えるようになりました。',
      sproutSaved:
        'Sub SproutがOBSの再読み込み後も植物を保持し、次の配信に引き継ぐようになりました。毎回最初の段階から始まることはありません。モデレーターは !grow reset でやり直せます。',
      countdown:
        '新機能「配信カウントダウン」: まもなく開始、すぐ戻ります、まもなく配信終了のシーン用の時計です。長さか配信開始の時刻を設定してプリセットを選べば、モデレーターが !countdown でチャットから時間を延ばせます。',
      deviceTheme:
        'サイトがデバイスのライトテーマ・ダークテーマで開き、デバイスの設定が変わると追従するようになりました。ヘッダーのテーマボタンを押すと選んだテーマが記憶され、デバイスの設定では変わらなくなります。',
      frames:
        '新機能「配信フレーム」: カメラ、チャット、配信画面全体用のすぐ使えるフレーム。Dynastyの楼閣の屋根と提灯、Blocksのピクセルブロックなど、プリセットごとに専用のイラストが付いています。',
      subathonRates:
        'Subathon Timerで、サブスク、ギフトサブ、500 BitsまたはKicksで何分増えるかをタイマー上に表示できるようになり、視聴者は自分のサブスクの価値がわかります。',
      presets:
        '新機能「プリセット」: チャットボックス、配信アラート、サブスク目標、Subathon Timer、チャット投票、抽選の当選者をひとつの見た目にそろえられます。League of Legends、World of Warcraft、Metin2、Dota 2、Valorant、CS2、Minecraftのゲームプリセットがあります。',
      poll: '新機能「チャット投票」: チャットで !poll と打って投票を出すと、TwitchとKickの視聴者が番号を打って投票します。リアルタイムのバー、タイマー、1人1票、最後に勝者を表示します。',
      goal: '新機能「サブスク目標」: TwitchとKickのサブスク、継続サブスク、ギフトサブが1件ずつ埋めていく目標バーで、達成するとトロフィーが登場します。モデレーターは !goal でカウントを修正できます。',
      streamAlerts:
        '新機能「配信アラート」: TwitchとKickのサブスク、ギフトサブ、Bits、Kicks、レイドのたびに、専用の効果音付きのアニメーションアラートを表示します。カラーを選び、見出しを書き換え、最小数を設定できます。',
      subathon:
        '新機能「Subathon Timer」: サブスク、ギフトサブ、Bits、Kicksで時間が延びるカウントダウンを、HPバー、時計、リングで表示します。それぞれの追加時間を自分で決められ、モデレーターは !subathon で操作できます。',
      chatReader:
        '新機能「チャットリーダー」: TwitchとKickのチャットをブラウザのタブやOBSのドックで読めます。カウントダウン付きで自動的に再接続し、途切れた箇所をすべてチャットに記録して、更新しても履歴が残ります。',
      chatSilentDrop:
        'チャットボックス、エモートウォール、OBS Bridgeが、インターネットが途切れたあとにチャット接続が静かになったことを検知し、自動で再接続するようになりました。インターネットが戻ればすぐにつながります。以前は数分かかったり、更新が必要だったりしました。',
      contentPages: '新しいガイド、FAQページ、この更新履歴を追加しました。',
      siteNav:
        'すべてのページに同じヘッダーとフッターが付きました。ウィジェットメニュー、言語とテーマの切り替え、ガイドとサポートへのリンクがあります。',
      notFound:
        '存在しないURLにアクセスすると、すべてのウィジェットへのリンク付きの404ページが開くようになりました。',
      geist:
        'サイトのページにsenchabot.comと同じGeistフォントを使うようになりました。オーバーレイのフォントは変わりません。',
      chatNextSteps:
        'チャットボックスのURLをコピーすると、設定ページにOBSへの追加手順と推奨サイズが表示されるようになりました。',
      raffleMonthsInput:
        '抽選の「最低サブスク月数」欄を入力中に空にできるようになり、6と打つと16になってしまう問題がなくなりました。',
      raffleKeywordRequired:
        '参加キーワードが空のままでは抽選を始められなくなりました。以前は、誰も参加できない抽選を始められました。',
      raffleMonthsSubsOnly:
        '「最低サブスク月数」はサブスク限定がオンのときだけ適用され、配信者が自分の抽選に参加できるようになりました。',
      sproutPreviewSimulate:
        'Sub Sproutの設定プレビューが、チャンネルを入力したあとも成長のアニメーションを続けるようになり、選んだ植物とエフェクトをすぐに確認できます。',
      sproutPreviewTint:
        'Sub Sproutのプレビュー領域が、真っ黒ではなく本来のやや透明な背景で表示されるようになりました。',
      emoteWallUrl:
        'エモートウォールの設定で、「表示時間」と「最大」の欄が空のときにURLへ誤った値を書き込まなくなり、チャンネルなしのURLも作らなくなりました。',
      bridgePassword:
        'OBS Bridgeが、WebSocket URLが空のときもパスワードを送るようになりました。OBSが同じパソコンにある場合でも、パスワード付きの接続が使えます。',
      chatFilters:
        'チャットボックスで、ボットや「!」で始まるコマンドを隠したり、メッセージを10秒から5分、またはずっと表示したりできるようになり、エモートプロバイダーも個別に選べるようになりました。',
      chatEmoteProviders:
        'チャットボックスが、Twitchのメッセージで7TV、BTTV、FFZのエモートを、Kickのメッセージで7TVのエモートを表示するようになりました。',
      sproutKickGifts:
        'Sub SproutがKickのギフトサブでも育つようになり、ギフトサブ1件ごとに1段階としてカウントします。',
      bridgeUserPlatform:
        'OBS Bridgeが許可ユーザーをプラットフォームと一緒に保存するようになりました。もう一方のプラットフォームで同じ名前を取った人は、コマンドを使えなくなりました。',
      sevenTvActiveSet:
        'チャットボックスとエモートウォールが、チャンネル自身のアクティブなセットから7TVエモートを取得するようになりました。以前は、似た名前の別アカウントのエモートが表示されることがありました。',
      chatColorCrash:
        'チャットボックスが、珍しい色の値を持つメッセージでエラー画面になって落ちることがなくなりました。',
      bridgeReconnect:
        'OBS Bridgeは、OBSが閉じているときやパスワードが違うとき、5秒ごとに1回だけ接続を試みるようになりました。接続の試行が増え続けることはありません。',
      raffleFakeEntries:
        '抽選が、サブスクのメッセージに隠された偽の行を参加としてカウントしなくなり、それを使ってサブスク限定をすり抜けることはできなくなりました。',
      chatIrcParsing:
        'チャットに打たれたテキストでチャットボックスが消されることはなくなりました。タイムアウトやBANでは、その人のメッセージだけが消えます。',
      chatHighlights:
        'チャットボックスが、あなたへのメンション、返信、初めてのチャット、アナウンス、「メッセージをハイライト」のメッセージを強調表示するようになりました。どれをオンにするかは設定で選べます。',
      chatPasteUrl:
        '既存のウィジェットURLをチャットボックスの設定に貼り付けると、設定がすべて復元されるようになりました。',
      chatSingleScreen:
        'チャットボックスの設定ページが、1画面に収まる新しいレイアウトになりました。設定は「チャンネル」「外観」「メッセージ」にまとめられています。',
      chatIconAlign:
        'チャットボックスのTwitchとKickのアイコンが同じサイズになり、きれいにそろうようになりました。',
      chatHideIndicator:
        'カラーのラインだけで十分なときは、チャットボックスのプラットフォーム表示を完全に隠せるようになりました。',
      chatSmoothSpeed:
        'チャットボックスに「右からなめらかにスライド」のアニメーションが加わり、設定プレビューにチャット速度の設定が付きました。',
      chatAdaptiveAnimations:
        'チャットボックスのアニメーションが、チャットが速くなると短くなるようになりました。初期設定の「右からスライド」の見た目は以前と同じです。',
      chatTypewriter:
        'チャットボックスに「タイプライター」アニメーションが加わりました。新しいメッセージが届くと、古いメッセージはジャンプせずにスライドして場所を空けます。',
      chatPlatformStripe:
        'チャットボックスのプラットフォームアイコンが大きくなり、各メッセージの左にプラットフォームのカラーのラインを付けられるようになりました。',
      emoteWallModes:
        'エモートウォールに、画面の端でエモートが跳ね返る「バウンス」モード、ハイプモード、エモートスパム対策が加わりました。',
      sproutPotLabel:
        'Sub Sproutが、鉢の上に 3/10 のような段階のラベルを表示できるようになりました。',
      emoteWallLaunch:
        'エモートウォールが登場しました。TwitchとKickのエモートだけのメッセージが、「おだやか」か「カオス」のモードで画面を飛び交います。',
      sproutBothPlatforms:
        'Sub Sproutが、ひとつのURLでTwitchとKickのチャンネルを同時に聞き取れるようになりました。古い channel と platform のURLもそのまま使えます。',
      chatPreviewMock:
        'チャットボックスのプレビューが、チャンネルを入力したあともサンプルのチャットを流し続けるようになり、誰もチャットしていなくても設定を確認できます。',
      siteLanguages:
        'サイトがトルコ語と英語に対応し、ライトテーマとダークテーマを切り替えられるようになりました。',
      bridgeSceneCommand:
        'OBS Bridgeに、名前が一致するシーンに切り替える !scene コマンドが加わりました。すべてのコマンドの名前も変更できます。',
      raffleBots: '抽選が、既知のボットからの参加を自動で無視するようになりました。',
      chatReadableColors:
        'チャットボックスが、暗い背景で読みにくいユーザー名の色を明るくするようになり、メッセージの影も軽くなりました。',
      chatBoldBadges:
        'チャットボックスに「メッセージを太字に」とバッジを隠すオプションが加わりました。バッジはフォントサイズに合わせて拡大縮小されます。',
      sproutWatering: 'Sub Sproutに、雨とキラキラの水やりエフェクトが加わりました。',
      chatItemBackground:
        'チャットボックスに、メッセージごとの背景ボックスとユーザー名を太字にするオプションが加わりました。接続が切れても、自動でチャットに再接続します。',
      bridgeLaunch:
        'OBS Bridgeが登場しました。許可ユーザーがチャットコマンドでBRBシーンとメインシーンを切り替えたり、配信と録画を開始・停止したりできます。',
      chatFade: 'チャットボックスに「フェードイン」アニメーションが加わりました。',
      sproutVarieties:
        'Sub Sproutに、バラ、ヒマワリ、サボテン、チューリップ、ハスなどの新しい植物が加わりました。',
      chatFontsLayouts:
        'チャットボックスで、フォント、メッセージのレイアウト、アニメーションを選べるようになりました。削除されたメッセージやBANされたユーザーのメッセージは、オーバーレイからも消えます。',
      raffleHardening:
        '抽選が、安全なランダム選択で当選者を選び、抽選開始後はルールをロックし、最短時間が過ぎるまで当選者を抽選できないようになりました。',
      siteTutorial:
        '設定ページに動画チュートリアルへのリンクが付きました。抽選ページでは、オーバーレイのURLをワンクリックでコピーできます。',
      chatPlatformPick:
        'チャットボックスで、チャットをTwitch、Kick、両方のどれから取得するかを選べるようになりました。',
      chatSevenTv: 'チャットボックスが7TVのエモートを表示するようになりました。',
      chatTimestamp:
        'チャットボックスで、プラットフォーム名かアイコンを選べるようになり、メッセージの時刻も表示できるようになりました。',
      siteSetupPages:
        '新しいホームページを公開し、すべてのウィジェットに専用の設定ページができました。',
      raffleLaunch:
        '抽選が登場しました。視聴者はチャットでキーワードを打って参加し、ユーザーごとの当選回数の上限を設定でき、当選者は紙吹雪付きで配信に表示されます。',
      chatBgOpacity: 'チャットボックスの暗い背景の不透明度を調整できるようになりました。',
      chatEmotesBadges:
        'チャットボックスが、Twitchのエモートと、TwitchとKickの両方のバッジを表示するようになりました。',
      chatOrientation:
        'チャットボックスが横向きにも対応し、画面下の帯として配置できるようになりました。',
      sitePreview:
        '設定ページで、設定の横にウィジェットのライブプレビューが表示されるようになりました。',
      sproutKick: 'Sub SproutがKickのサブスクもカウントするようになりました。',
      launch:
        'Senchabot Extensionsを公開しました。TwitchとKickのチャットをまとめるチャットボックスと、Twitchのサブスクで育つ植物のSub Sproutでスタートです。',
    },
  },
  socials: {
    breadcrumb: 'SNSリンクの設定',
    title: 'SNSリンクの設定',
    intro:
      '配信にSNSのアカウントを表示します。入力したプラットフォームを、スライドアニメーションで1つずつ順番に表示します。',
    sectionPlatforms: 'プラットフォーム',
    platformsTip:
      '表示したいプラットフォームごとにユーザー名を入力してください。ほかは空欄のままでかまいません。',
    sectionAppearance: '外観',
    rotationInterval: '切り替え間隔',
    intervalSeconds: '{seconds}秒',
    textColor: '文字の色',
    animation: 'アニメーション',
    animSlideUp: '上にスライド',
    animSlideLeft: '左にスライド',
    animScale: '拡大',
    animFade: 'フェード',
    pillColor: 'ピル型背景の色',
    previewTitle: 'SNSリンクのプレビュー',
    previewIframeTitle: 'SNSリンクのプレビュー',
    previewHint: 'SNSの切り替え表示のライブプレビュー。',
    widgetUrlTip:
      '作成済みのウィジェットがありますか？ここにURLを貼り付けると設定が読み込まれ、必要なところだけ変更できます。',
    widgetUrlPlaceholder: '既存のウィジェットURLを貼り付けて編集',
    widgetUrlInvalid: 'SNSリンクのウィジェットURLではありません。',
    browserSourceHintSize: '（推奨サイズ: 600×120）。',
    guideTitle: '配信ソフトでの設定（OBS、Streamlabs、XSplitなど）',
    guideStep1:
      '配信ソフト（OBS Studio、Streamlabs Desktop、XSplit、vMix、Lightstream、PRISM Live Studioなど）でブラウザソースを追加します。',
    guideStep2: 'コピーしたSNSリンクのURLを貼り付けます。',
    guideStep3: '幅を600、高さを120に設定します。',
    faq1Q: 'ユーザー名を変えると、ウィジェットも更新されますか？',
    faq1A:
      'URLを更新する必要があります。このページに戻って既存のURLを貼り付けて設定を読み込み、新しいユーザー名を入力して、新しいURLを配信ソフトにコピーしてください。',
  },
};
