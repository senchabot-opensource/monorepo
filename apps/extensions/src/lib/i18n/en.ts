export const en = {
  common: {
    freeBadge: '100% Free · No Login Required',
    copy: 'Copy',
    copied: 'Copied!',
    home: 'Home',
    watchTutorial: 'Watch Tutorial',
    widgetUrl: 'Widget URL',
    toolUrl: 'Tool URL',
    channelPlaceholder: 'e.g. yourchannel',
    previewNoChannel: 'Fill in at least one channel to generate preview.',
    browserSourceHint:
      'Paste this URL as a Browser Source in OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software that supports browser sources',
    themeToggle: 'Toggle color theme',
    languageToggle: 'Switch language',
    moreInfo: 'More info',
    sectionChannel: 'Channel',
    sectionAppearance: 'Appearance',
    platforms: 'Platforms',
    platformsTip:
      'Pick the platform to listen to. Streaming on Twitch and Kick at the same time? Pick Both.',
    platformBoth: 'Both',
    twitchChannel: 'Twitch Channel',
    kickChannel: 'Kick Channel',
    channelTip:
      "Just type the channel name, not the full link. For twitch.tv/senchabot, that's senchabot.",
    previewLoading: 'Loading preview…',
    setupGuideTitle: 'How to set it up',
    faqTitle: 'Frequently asked questions',
    moreWidgets: 'More widgets',
    nextSteps: {
      title: 'Now add it to your streaming app',
      addSource: 'Add a new Browser Source in OBS Studio or any app that supports browser sources.',
      paste: 'Paste the URL into its URL field.',
      size: 'Set the width to {width} and the height to {height}.',
      test: 'Open the URL in a new tab to check it works',
      dismiss: 'Hide',
    },
    siteName: 'Senchabot Extensions',
    homeLink: 'Senchabot Extensions home',
    skipToContent: 'Skip to content',
    newTab: '(opens in a new tab)',
    nav: {
      label: 'Main',
      menu: 'Menu',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      widgets: 'Widgets',
      guides: 'Guides',
      presets: 'Presets',
      faq: 'FAQ',
      senchabot: 'Senchabot',
      github: 'Source code on GitHub',
      switchWidget: 'Switch to another widget',
      breadcrumb: 'Breadcrumb',
    },
    notFound: {
      title: 'Page not found',
      text: "This page doesn't exist or has moved. Pick a widget below or head back to the home page.",
      home: 'Back to home',
    },
    footer: {
      about:
        'Free overlays and stream tools for Twitch and Kick. No login, nothing to download, and the code is open.',
      license: 'GPL-3.0, source code on GitHub',
      social: 'Senchabot on social media',
      guides: 'Guides',
      setupGuides: 'Setup guides',
      presets: 'Game presets',
      faq: 'FAQ',
      changelog: 'Changelog',
      senchabotBot: 'Senchabot bot',
      docs: 'Documentation',
      discussions: 'GitHub Discussions',
      reportBug: 'Report a bug or request a widget',
      notAffiliated: 'Not affiliated with Twitch or Kick.',
    },
  },
  widgets: {
    overlays: 'Overlays',
    tools: 'Tools',
    chatBox: {
      name: 'Chat Box',
      tagline: 'Twitch and Kick chat together in one overlay, with 7TV, BTTV and FFZ emotes.',
    },
    emoteWall: {
      name: 'Emote Wall',
      tagline: 'Emote-only chat messages float across your screen.',
    },
    subSprout: {
      name: 'Sub Sprout',
      tagline: 'A plant on your stream that grows a little with every new sub.',
    },
    goal: {
      name: 'Sub Goal',
      tagline: 'A goal bar that every sub and gifted sub fills, with a trophy when you reach it.',
    },
    frames: {
      name: 'Stream Frames',
      tagline:
        'Ready-made frames for your camera, chat and stream screen, drawn to match your preset.',
    },
    subathon: {
      name: 'Subathon Timer',
      tagline:
        'A countdown that subs, gifted subs, Bits and Kicks push back. Health bar, clock or ring.',
    },
    poll: {
      name: 'Chat Poll',
      tagline: 'A poll your chat votes in by typing a number, with live bars and a winner.',
    },
    streamAlerts: {
      name: 'Stream Alerts',
      tagline: 'An animated alert with a sound for every sub, gifted sub, Bits, Kicks and raid.',
    },
    raffle: {
      name: 'Raffle',
      tagline: 'Viewers join with a chat keyword like !join, and you draw the winner.',
    },
    obsBridge: {
      name: 'OBS Bridge',
      tagline: 'Switch OBS scenes and control streaming and recording from chat commands.',
    },
  },
  home: {
    heroTitle: 'Free stream overlays for Twitch and Kick',
    heroLead:
      'Set up a widget with a live preview, then paste one URL into OBS. No account, no watermark, and the code is open source.',
    browseWidgets: 'Browse widgets',
    viewOnGithub: 'View on GitHub',
    trustLabel: 'Highlights',
    trustFree: 'Free',
    trustNoLogin: 'No login',
    trustOpenSource: 'Open source',
    trustPlatforms: 'Twitch + Kick',
    sceneLive: 'Live',
    sceneCaption: 'Live demo running on sample chat',
    demoTitle: '{name} demo',
    worksWithTitle: 'Where it works',
    worksWithApps: 'Streaming apps',
    worksWithAppsText: 'OBS Studio and other apps that support browser sources',
    galleryTitle: 'Pick a widget',
    galleryLead: 'Each one has its own setup page with a live preview. Nothing to download.',
    overlaysLead: 'Browser sources that run on their own once they are in your scene.',
    toolsLead: 'Tools you run yourself during the stream, from a page or from chat.',
    setUp: 'Set up',
    toolFeatures: 'Features',
    raffleFeatureKeyword: 'Entry keyword like !join',
    raffleFeatureSubs: 'Subscribers only, with minimum months',
    raffleFeatureDuration: 'Minimum time before the draw',
    obsFeatureScenes: 'Switch scenes from chat',
    obsFeatureCommands: 'Custom command names',
    obsFeatureLocal: 'Local obs-websocket connection',
    subathonFeatureChat: 'Control it from chat with !subathon',
    subathonFeaturePlatforms: 'Separate time settings for Twitch and Kick',
    subathonFeatureSaved: 'Time left survives OBS restarts',
    pollFeatureVote: 'Viewers vote by typing a number',
    pollFeatureBoth: 'Twitch and Kick votes in one poll',
    pollFeatureLate: 'Last-second votes count despite stream delay',
    pollSpotlight: {
      eyebrow: 'New: Chat Poll',
      title: 'Let your chat decide',
      lead: 'Put a poll up from chat with !poll and viewers on Twitch and Kick vote by typing a number. The bars fill live on stream, and the winner shows when time is up.',
      pointVote: 'Viewers type 2, !vote 2 or the option itself. Every viewer counts once.',
      pointBoth: 'Votes from Twitch and Kick land in the same poll.',
      pointLate:
        'Votes typed in the last seconds still count, even though viewers watch a little behind.',
      pointMods: 'You and your mods run it from chat. No bot, no login.',
      setup: 'Set up Chat Poll',
      guide: 'Read the guide',
      chat: 'Chat',
      caption: 'Live demo with simulated voters',
    },
    visualScenes: 'Scenes',
    howTitle: 'How it works',
    howLead: 'Three steps, and none of them asks for an account.',
    howStep1:
      'Pick a widget and adjust its settings. The live preview shows every change right away.',
    howStep2: 'Type your channel name and copy the widget URL.',
    howStep3: 'In OBS Studio, add a Browser Source, paste the URL and set the recommended size.',
    sizesTitle: 'Recommended Browser Source sizes',
    sizesNote: 'Width × height, in pixels.',
    sizesWidget: 'Widget',
    sizesValue: 'Size',
    trustTitle: 'No account, no catch',
    noLoginTitle: 'No login',
    noLoginText:
      "Widgets read your channel's public chat the way a logged-out viewer does. You never connect your Twitch or Kick account.",
    noWatermarkTitle: 'No watermark',
    noWatermarkText:
      'Nothing gets stamped on your overlays. What you see in the preview is what shows up on stream.',
    openSourceTitle: 'Open source',
    openSourceText:
      'All the code is on GitHub under the GPL-3.0 license. Read it, fork it or send a fix.',
    urlSettingsTitle: 'Your settings live in the URL',
    urlSettingsText:
      "Widget settings are written into the URL itself, so there's no account needed to keep them. Save the URL and you always have your widget.",
    senchabotTitle: 'Need a chat bot too? Try Senchabot',
    senchabotText:
      'The team behind these widgets also makes Senchabot: custom chat commands, timers and shoutouts on Twitch, plus a go-live announcement in your Discord server.',
    senchabotCta: 'Visit senchabot.com',
    communityTitle: 'Get involved',
    communityLead: "It's open source, and there are a few easy ways to help.",
    starTitle: 'Star on GitHub',
    starText: 'Stars help more streamers find the project.',
    starCount: '{count} stars',
    requestTitle: 'Request a widget',
    requestText: 'Missing something for your stream? Open an issue and tell us what you need.',
    discordTitle: 'Join the Discord',
    discordText: 'Ask questions and share your setup with other streamers.',
    faqMore: "Didn't find your answer?",
    faq1Q: 'Is it really free?',
    faq1A:
      'Yes. Every widget and tool is free, with no paid plan and no watermark on your overlays. The project is open source and made by the Senchabot team.',
    faq2Q: 'What does "no login" actually mean?',
    faq2A:
      "You never sign in or connect your Twitch or Kick account. You type your channel name, and the widget reads that channel's public chat anonymously, like a viewer who isn't logged in. So it sees what anyone can see in chat, and nothing more.",
    faq3Q: 'Which streaming apps does it work with?',
    faq3A:
      'OBS Studio and other apps that support browser sources. Add the widget URL as a Browser Source and use the size shown on the setup page.',
    faq4Q: 'Can I use Twitch and Kick together?',
    faq4A:
      'Yes. Chat Box, Emote Wall, Sub Sprout, Subathon Timer, Stream Alerts, Sub Goal and Chat Poll take a Twitch and a Kick channel in the same URL. OBS Bridge can listen to both chats at once too. Raffle runs on one platform at a time.',
    faq5Q: 'How do I change a widget later?',
    faq5A:
      'Open its setup page, set it up the way you want and replace the URL in your Browser Source. Chat Box, Emote Wall, Sub Sprout, Subathon Timer, Stream Alerts, Sub Goal, Chat Poll and Stream Frames can also open an existing URL: paste it on the setup page, your settings come back, and you change only what you need.',
    faq6Q: 'Will my widget URL keep working after updates?',
    faq6A:
      "Yes. Updates keep existing URL settings and their values working, so a widget that's already in your scene doesn't need a new URL.",
  },
  chatWidget: {
    breadcrumb: 'Chat Box Setup',
    title: 'Chat Box Setup',
    intro:
      'A multi-chat widget that merges Twitch and Kick chat into one overlay. 7TV emotes work on both platforms, BTTV and FFZ on Twitch, and badges show up too. You pick the layout, font and animation.',
    platformIndicator: 'Platform Indicator',
    platformName: 'Platform Name',
    platformIcon: 'Platform Icon',
    platformHidden: 'Hide Platform',
    sectionMessages: 'Messages',
    platformsTip:
      'Pick which platforms to pull chat from. Select both to merge Twitch and Kick messages into a single feed.',
    platformIndicatorTip:
      'When both platforms are on, shows where each message came from: the platform name, its icon, or nothing.',
    orientationTip:
      'Vertical stacks messages on top of each other, like a classic chat box. Horizontal runs them side by side, great for a strip along the bottom of your screen.',
    darkBackgroundTip:
      'Adds a semi-transparent black background behind the widget. Makes text easier to read on bright scenes.',
    emotesTip:
      'Emotes from the providers you tick show as images, the rest show as plain text. 7TV works on Twitch and Kick, BTTV and FFZ only on Twitch.',
    messageDurationTip:
      'Messages fade out after this time. Pick "Forever" to keep them on screen, with new ones pushing older ones up.',
    hideBotsTip:
      'Hides messages from common bots like Nightbot, StreamElements, Fossabot, BotRix and KickBot, plus accounts with Twitch\'s "Chat Bot" badge or Kick\'s "Bot" badge.',
    hideCommandsTip: 'Hides messages that start with "!", like !discord or !uptime.',
    badgesTip: 'Shows broadcaster, moderator, VIP and subscriber badges next to usernames.',
    animationTip:
      'Sets how new messages enter the screen. Animations get shorter automatically as chat speeds up.',
    font: 'Font',
    fontSystem: 'System Default',
    messageLayout: 'Message Layout',
    layoutInline: 'Inline — Username: message',
    layoutStacked: 'Stacked — username above',
    layoutCard: 'Card / Bubble',
    layoutCompact: 'Compact (Twitch-like)',
    newMessageAnimation: 'New Message Animation',
    animSlide: 'Slide from right + fade',
    animSmoothSlide: 'Smooth slide from right',
    animPop: 'Pop / scale-in',
    animBounce: 'Bounce in',
    animStagger: 'Stagger (meta first, then message)',
    animFade: 'Fade in',
    animTyping: 'Typewriter',
    animNone: 'No animation',
    orientation: 'Orientation',
    vertical: 'Vertical',
    horizontal: 'Horizontal',
    fontSize: 'Font Size (px)',
    darkBackground: 'Dark Background',
    emotes: 'Emotes',
    emotesNone: 'Off',
    messageDuration: 'Message Duration',
    durationSeconds: '{count} sec',
    durationMinutes: '{count} min',
    durationKeep: 'Forever',
    hideBots: 'Hide Bots',
    hideCommands: 'Hide Commands',
    showBadges: 'Show Badges',
    showMessageTime: 'Show Message Time',
    backgroundOpacity: 'Background Opacity',
    messageBackgroundBox: 'Message Background Box',
    messageBackgroundHint: 'Each message gets its own bordered background box.',
    platformAccent: 'Platform Color Stripe',
    platformAccentHint: 'A Twitch purple or Kick green stripe on the left shows where each message came from.',
    boldUsernames: 'Bold Usernames',
    boldMessages: 'Bold Messages',
    highlights: 'Highlights',
    highlightsTip:
      "Pick which messages get a thin colored bar on stream. Replies show who they're answering, and the Twitch-tagged ones only exist on Twitch.",
    highlightMention: 'Mentions',
    highlightReply: 'Reply context',
    highlightFirstMessage: 'First-time chatters',
    highlightAnnouncement: 'Announcements',
    highlightHighlighted: 'Highlight My Message',
    highlightsAll: 'All',
    highlightsNone: 'Off',
    announcement: 'Announcement',
    firstMessage: 'First Time Chat',
    previewTitle: 'Widget Preview (Chat Box)',
    previewIframeTitle: 'Chat Widget Preview',
    previewSpeed: 'Preview Chat Speed',
    previewSpeedValue: '{rate} msg/s',
    previewSpeedHint: 'Only changes the preview. Your widget URL stays the same.',
    previewHint: 'Live chat preview with animated message stream.',
    guideTitle: 'Streaming Software Chat Box Setup (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Add a Browser Source in your streaming software (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Paste your copied multi-chat widget URL.',
    guideStep3:
      'Set width and height to match your desired chat box overlay dimensions (e.g. 400×600 for vertical).',
    browserSourceHintSize: ' (recommended size: 400×600 for chat box).',
    widgetUrlTip:
      'Already made a widget? Paste its URL here to load your settings and change what you need.',
    widgetUrlPlaceholder: 'Paste an existing widget URL to edit it',
    widgetUrlInvalid: "This isn't a Chat Box widget URL.",
    openReader: 'Open Chat Reader',
    openReaderHint:
      'Read your own chat in a browser tab or an OBS dock. It reconnects on its own, marks every drop, and keeps your history through a refresh.',
    faq1Q: 'Do I need to sign in to Twitch or Kick to use the chat box?',
    faq1A:
      'No login is required. Chat Box listens anonymously to public chat streams for both platforms.',
    faq2Q: 'Does this multi-chat widget work with 7TV emotes?',
    faq2A:
      'Yes. 7TV channel and global emotes show up in both Twitch and Kick messages, and BTTV and FFZ emotes show up in Twitch messages only. All three are on by default, and you can turn any of them off in the Emotes menu.',
  },
  chatReader: {
    title: 'Chat Reader',
    listLabel: 'Chat messages',
    noChannel: 'This link has no channel. Open the Chat Reader from the Chat Box setup page.',
    empty: 'Waiting for messages in {channels}…',
    statusConnecting: 'Connecting',
    statusConnected: 'Connected',
    statusReconnecting: 'Reconnecting',
    notFound: 'Channel not found',
    networkOffline: "You're offline. Chat reconnects on its own as soon as the internet is back.",
    retryIn: '{platform} chat connection lost. Trying again in {seconds}s.',
    retrying: '{platform} chat connection lost. Trying again now…',
    retryNow: 'Retry now',
    fontSmaller: 'Smaller text',
    fontLarger: 'Larger text',
    timestamps: 'Show message times',
    clear: 'Clear history',
    clearConfirm: 'Click again to clear',
    deleted: '(deleted)',
    backToLive: 'Back to live chat',
    newMessage: '{count} new message',
    newMessages: '{count} new messages',
    eventConnected: 'Connected to {platform} chat: {channel}',
    eventDisconnected: '{platform} chat connection lost',
    eventReconnected: 'Back on {platform} chat after {duration}',
    eventNetworkLost: 'Internet connection lost',
    eventNetworkBack: 'Internet connection is back',
    eventChatCleared: 'A moderator cleared {platform} chat',
    eventResumed: 'Saved from your last visit, until {time}',
    durationSeconds: '{seconds}s',
    durationMinutes: '{minutes}m {seconds}s',
    durationHours: '{hours}h {minutes}m',
  },
  obsBridge: {
    breadcrumb: 'OBS Bridge Setup',
    title: 'OBS Bridge Setup',
    intro:
      'Let the people you trust switch OBS scenes and start or stop your stream and recording from Twitch or Kick chat. The bridge runs in a browser tab or an OBS dock and talks to OBS directly.',
    sectionChannels: 'Channels',
    sectionUsers: 'Authorized Users',
    usersLabel: 'Chat Usernames',
    usersTip:
      "Only the people on this list can run commands. With an empty list nobody can, not even you. On Twitch the name is matched against the login, the name in the channel's URL.",
    usersEmpty: 'Nobody yet, so no one can run commands.',
    userPlatform: 'Platform',
    addUser: 'Add',
    userPlaceholder: 'username',
    removeUser: 'Remove {name}',
    assignUser: 'Make {name} a {platform} user',
    pickPlatformWarning:
      "Twitch and Kick are both connected, so pick a platform for each yellow name. They can't run commands until you do.",
    sectionCommands: 'Commands',
    commandsHint:
      "The whole message has to match the command, capital letters don't matter. Leave a field empty to keep the default.",
    label: {
      cmdScene: 'Switch Scene',
      cmdBrb: 'BRB Scene',
      cmdBack: 'Back to Main',
      cmdStartStream: 'Start Stream',
      cmdStopStream: 'Stop Stream',
      cmdStartRecord: 'Start Recording',
      cmdStopRecord: 'Stop Recording',
    },
    action: {
      cmdScene: 'Switches to the scene you name, like {example}',
      cmdBrb: 'Switches to your BRB scene',
      cmdBack: 'Switches back to your Main scene',
      cmdStartStream: 'Starts the stream',
      cmdStopStream: 'Ends the stream',
      cmdStartRecord: 'Starts recording',
      cmdStopRecord: 'Stops recording',
    },
    sceneArg: '<name>',
    sceneTip:
      'Type the command, a space and a scene name, like !scene Gaming. A scene with exactly that name wins, otherwise the first one whose name contains it.',
    brbTip:
      'Switches to the BRB scene you pick on the tool page. It has no ! by default, so anyone on the list typing just brb switches scenes.',
    backTip: 'Switches back to the Main scene you pick on the tool page. Like brb, it has no ! by default.',
    sectionConnection: 'OBS Connection',
    wsUrl: 'WebSocket URL',
    wsUrlTip:
      'Only needed if OBS runs on another computer or you changed the port. Leave it empty for ws://127.0.0.1:4455.',
    wsUrlPlaceholder: 'ws://127.0.0.1:4455 (default)',
    wsPassword: 'WebSocket Password',
    wsPasswordTip:
      'Find it in OBS under Tools → WebSocket Server Settings → Show Connect Info. It is saved in the tool URL, so treat that link like a password.',
    wsPasswordPlaceholder: 'Leave empty if none',
    previewTitle: 'Tool Preview',
    previewIframeTitle: 'OBS Bridge Preview',
    summaryNotListening: "No {platform} channel is set, so {names} can't run commands yet.",
    summaryNoChannel: 'No channel yet. Add a Twitch or Kick channel first.',
    openTool: 'Open the Tool',
    openToolHint: 'Opens the live bridge in a new tab. It connects to OBS and your chat right away.',
    toolUrlTip:
      "It contains your OBS password, so treat it like one: don't share it and don't show it on stream.",
    toolUrlHint:
      'Open it in a browser tab or an OBS Custom Browser Dock and keep it open while you stream.',
    nextOpen: 'Open it in a browser tab, or paste it into a Custom Browser Dock in OBS.',
    nextKeepOpen: 'Pick your Main and BRB scenes there and keep the page open while you stream.',
    guideStep1:
      'In OBS, open Tools → WebSocket Server Settings, turn on the WebSocket server and copy the password from Show Connect Info.',
    guideStep2:
      'Enter your channel, the people allowed to run commands and the password, then copy the tool URL.',
    guideStep3:
      'Open the URL in a browser tab or an OBS Custom Browser Dock and pick your Main and BRB scenes.',
    guideStep4:
      'Using a dock? After picking scenes, press Copy Updated URL and paste it into the dock, since a dock keeps opening the URL it was created with.',
    faq1Q: 'How does the !scene chat command work?',
    faq1A:
      "Someone on your list types the command, a space and a scene name, like !scene Gaming. OBS Bridge first looks for a scene with exactly that name, capital letters don't matter, then for the first scene whose name contains it, and switches to it.",
    faq2Q: 'Is my OBS WebSocket password safe?',
    faq2A:
      "The connection to OBS goes straight from your browser to OBS. But the password is saved in the tool URL, and opening that URL loads the page from extensions.senchabot.com with the password in it. So treat the link like a password: don't share it and don't show it on stream.",
    faq3Q: 'Why did my scene picks disappear in the OBS dock?',
    faq3A:
      "Scene picks and user changes are saved in the tool page's URL. A browser tab keeps them if you bookmark the page, but an OBS dock always opens the URL it was created with. Press Copy Updated URL on the tool page and paste the new URL into the dock.",
    tool: {
      title: 'OBS Bridge',
      connectionsTitle: 'Connections',
      status: {
        connecting: 'Connecting',
        connected: 'Connected',
        failed: "Couldn't connect",
        disconnected: 'Disconnected',
      },
      obsConnecting: 'Connecting to {url}…',
      obsConnected: '{url} · connected since {time}',
      obsUnreachable:
        'No response from {url}. Is OBS open, and is the server turned on in Tools → WebSocket Server Settings?',
      obsWrongPassword:
        "OBS didn't accept the password. The password in the URL has to match your OBS WebSocket password.",
      obsNeedsPassword:
        "OBS wants a password, but this URL doesn't have one. Enter your WebSocket password on the setup page and use the new URL.",
      obsRefused: 'OBS refused the connection: {reason}',
      obsClosed:
        'Lost the connection to OBS. OBS may have closed, or its WebSocket server stopped.',
      retryIn: 'Attempt {attempt} in {seconds}s',
      retrying: 'Retrying…',
      retryNow: 'Try now',
      chat: {
        connecting: 'Connecting',
        connected: 'Listening',
        reconnecting: 'Disconnected',
      },
      chatRetryIn: 'Reconnecting in {seconds}s',
      chatNotFound: 'Not found',
      kickNotFound: 'Couldn\'t find a Kick channel called "{channel}". Check the channel name.',
      activityTitle: 'Recent Commands',
      activityEmpty:
        'No commands yet. They show up here once an authorized user types one in chat.',
      activityScene: 'Switched to {scene}',
      activityStartStream: 'Stream started',
      activityStopStream: 'Stream stopped',
      activityStartRecord: 'Recording started',
      activityStopRecord: 'Recording stopped',
      activityNoScene: 'No scene matches "{query}"',
      activityOffline: "Didn't run because OBS wasn't connected",
      activityFailed: 'OBS returned an error: {message}',
      scenesTitle: 'Scenes',
      scenes: 'Scenes ({count})',
      fetchingScenes: 'Loading the scene list…',
      scenesOffline: 'The scene list shows up once OBS is connected.',
      mainScene: 'Main Scene',
      brbScene: 'BRB Scene',
      notSelected: 'Not picked',
      main: 'Main',
      brb: 'BRB',
      setMain: 'Use {scene} as the Main scene',
      setBrb: 'Use {scene} as the BRB scene',
      assignMainBrbWarning:
        'Pick a Main and a BRB scene below, otherwise {brb} and {back} have nowhere to go.',
      assignMainWarning: 'Pick a Main scene below, otherwise {back} has nowhere to go.',
      assignBrbWarning: 'Pick a BRB scene below, otherwise {brb} has nowhere to go.',
      sceneHint:
        'Press Main or BRB next to a scene to assign it. Any other scene works with {command}.',
      usersCount: 'Authorized Users ({count})',
      copyUrl: 'Copy Updated URL',
      copyUrlHint:
        "Scene picks and user changes are saved in this page's URL. An OBS dock keeps opening the URL it was created with, so paste the copied one into the dock's settings.",
      copyUrlManual: 'Copying failed. Select the URL below and copy it yourself.',
      commands: 'Chat Commands',
      footer: 'Keep this page open while you stream. The bridge stops when it closes.',
    },
  },
  subSprout: {
    breadcrumb: 'Sub Sprout Setup',
    title: 'Sub Sprout Setup',
    intro:
      'A customizable subscriber goal plant overlay that levels up with every new subscription on Twitch or Kick.',
    sectionPlant: 'Plant',
    plantVariety: 'Plant Variety',
    plantVarietyTip:
      'Each sub grows the plant one stage. The more stages it has, the more subs it takes to grow fully.',
    stagesSuffix: '{stages} stages',
    selectionMode: 'Plant Changing',
    selectionModeTip:
      'After the last stage the plant starts over: the same plant, the next one in the list, or a random other one. In Order and Random never pick Climbing Vine.',
    fixed: 'Same Plant',
    cycle: 'In Order',
    random: 'Random',
    wateringEffect: 'Watering Effect',
    wateringEffectTip:
      "Plays a short rain or sparkle animation each time the plant grows. Climbing Vine doesn't show it.",
    showSubCountEffect: 'Show Sub Count',
    subCountTip: 'Shows how many subs came in at once, like x5 for a gift bundle of 5.',
    showPotLabel: 'Show Stage on Pot',
    potLabelTip: "Writes the stage on the pot, like 3/10. Climbing Vine doesn't show it.",
    previewTitle: 'Subscriber Goal Plant Preview',
    previewIframeTitle: 'Sub Sprout Preview',
    previewSpeed: 'Preview Growth Speed',
    previewSpeedValue: '{rate}×',
    previewHint:
      'The preview grows with simulated subs. On stream, your plant grows with real subs, resubs and gifted subs in your channel.',
    widgetUrlTip:
      'Already made a widget? Paste its URL here to load your settings and change what you need.',
    widgetUrlPlaceholder: 'Paste an existing widget URL to edit it',
    widgetUrlInvalid: "This isn't a Sub Sprout widget URL.",
    browserSourceHintSize: ' (recommended size: 800×600).',
    guideTitle: 'Streaming Software Setup (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Add a Browser Source in your streaming software (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Paste your copied subscriber goal plant URL.',
    guideStep3: 'Set width to 800 and height to 600.',
    guideStep4: 'Broadcasters & mods can type !grow in chat to trigger growth manually.',
    faq1Q: 'Do I need to sign in to use the subscriber goal plant?',
    faq1A:
      'No sign-up or OAuth login is needed. Sub Sprout connects anonymously via public chat event listeners.',
    faq2Q: 'What happens when the subscriber goal plant reaches full growth?',
    faq2A:
      'Once the plant is fully grown, the next sub starts it over based on your Plant Changing setting: the same plant, the next variety, or a random one.',
  },
  subathon: {
    breadcrumb: 'Subathon Timer Setup',
    title: 'Subathon Timer Setup',
    intro:
      'A subathon timer for Twitch and Kick. It counts down, and every sub, gifted sub, Bits cheer or Kicks gift adds time. Show it as a game-style health bar that drains toward zero, a big clock or a ring, and you decide how much time each one adds.',
    style: 'Style',
    styleTip:
      'Health Bar drains from 100% toward zero like a game character. Clock shows big numbers. Ring shows a circle that empties.',
    styleBar: 'Health Bar',
    styleClock: 'Clock',
    styleRing: 'Ring',
    color: 'Color',
    colorTip:
      'Health goes from green to amber to red as the time runs out. The others stay one color.',
    colors: {
      hp: 'Health (green to red)',
      green: 'Green',
      purple: 'Purple',
      red: 'Red',
      gold: 'Gold',
      cyan: 'Cyan',
      pink: 'Pink',
    },
    titleLabel: 'Title',
    titleTip: 'Shown next to the timer. Leave it empty to show no title.',
    titlePlaceholder: 'No title',
    showPercent: 'Show Percentage',
    showPercentTip:
      'Shows how full the timer is. 100% is the most time it has held so far, so it never goes over.',
    showPops: 'Show Added Time',
    showPopsTip: "Floats up +1:00 with the viewer's name every time time is added.",
    sectionTimer: 'Timer',
    startTime: 'Starting Time',
    startTimeTip:
      'Where the timer starts. It only applies to a new subathon: to start over with a new value, type !subathon reset in chat.',
    maxTime: 'Time Limit',
    maxTimeTip: "The timer never holds more than this. Time that would go past it isn't added.",
    maxTimeOff: 'No limit',
    startMode: 'Start',
    startModeTip:
      'With the command, the timer waits paused until you or a mod types it in chat. Right Away starts it as soon as the overlay loads in OBS.',
    startCommand: 'With {command}',
    startAuto: 'Right Away',
    sectionValues: 'Time Added',
    valuesHint: 'Set any of these to 0 to turn it off.',
    perSub: 'Per Sub',
    perSubTip: 'Every new sub and resub. On Twitch this is a Tier 1 or Prime sub.',
    perSubKickTip: 'Every new sub and resub.',
    perGift: 'Per Gifted Sub',
    perGiftTip: 'Counted for every sub in a gift, so a gift of 5 adds this five times.',
    perBits: 'Per 500 Bits',
    perBitsTip: 'About the price of one sub. Other amounts add their share, so 100 Bits adds a fifth.',
    perKicks: 'Per 500 Kicks',
    perKicksTip: 'Other amounts add their share, so 100 Kicks adds a fifth.',
    showRates: 'Show on the Timer',
    showRatesTip:
      'Lists what a sub, a gifted sub and 500 Bits or Kicks add, so viewers know what their sub is worth. Values set to 0 are left out. When Twitch and Kick have different values, they take turns.',
    ratesLanguage: 'Timer Language',
    ratesLanguageTip:
      'The language of the listed words, like "Gift Sub" and "min". The OBS URL keeps it, whatever language OBS runs in.',
    rateSub: 'Sub',
    rateGift: 'Gift Sub',
    rateBits: '{amount} Bits',
    rateKicks: '{amount} Kicks',
    rateBitsKicks: '{amount} Bits/Kicks',
    tiers: 'Tier 2 and 3 Count More',
    tiersTip:
      'On Twitch a Tier 2 sub adds 2 subs worth of time and a Tier 3 sub 5, in line with their price.',
    unitHours: 'h',
    unitMinutes: 'min',
    sectionCommands: 'Chat Commands',
    commandsIntro: 'You and your mods control the timer from Twitch or Kick chat.',
    cmdStart: 'Starts or resumes the timer',
    cmdPause: 'Pauses it',
    cmdAdd: 'Adds time',
    cmdRemove: 'Takes time away',
    cmdSet: 'Sets the time left',
    cmdReset: 'Starts over from the starting time',
    commandsDurations: 'Write times like 10m, 1h30m, 45s or 1:30:00. A plain number means minutes.',
    previewTitle: 'Subathon Timer Preview',
    previewIframeTitle: 'Subathon Timer Preview',
    previewHint:
      'The preview plays simulated subs, gifts and cheers. On stream the timer runs in real time and only your chat adds time.',
    previewSpeed: 'Preview Speed',
    previewSpeedTip: '1× is real time. At 60× a one hour timer runs out in about a minute.',
    previewSpeedValue: '{rate}×',
    testTitle: 'Try it:',
    testViewer: 'You',
    testSub: '+1 Sub',
    testGift: '+5 Gifted',
    testBits: '+500 Bits/Kicks',
    testRemove: '−10 min',
    testPause: 'Pause / Resume',
    testReset: 'Reset',
    widgetUrlTip:
      'Already made a widget? Paste its URL here to load your settings and change what you need.',
    widgetUrlPlaceholder: 'Paste an existing widget URL to edit it',
    widgetUrlInvalid: "This isn't a Subathon Timer URL.",
    browserSourceHintSize: ' (recommended size: 800×300).',
    guideTitle: 'Streaming Software Setup (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Add a Browser Source in your streaming software (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Paste your copied subathon timer URL.',
    guideStep3: 'Set width to 800 and height to 300.',
    guideStep4:
      'When you go live, type !subathon start in chat. Mods can add, remove or pause time too.',
    faq1Q: 'What happens if OBS closes or the browser source reloads?',
    faq1A:
      "The timer is saved inside OBS, so it comes back where it was. While OBS is closed it keeps counting down, like a real deadline. Subs that come in while it's closed can't be seen, so a mod can add them with !subathon add.",
    faq2Q: 'What happens when the timer reaches zero?',
    faq2A:
      'The timer stops at zero and the health bar shows K.O. New subs no longer add time. A mod can bring it back with !subathon add or !subathon set, or start a new one with !subathon reset.',
    faq3Q: 'How do I start a new subathon or change the starting time?',
    faq3A:
      'Type !subathon reset in chat. The timer goes back to the starting time in its URL. Until the timer has started for the first time, a new starting time in the URL applies on its own.',
    faq4Q: 'Do I need to log in or connect my account?',
    faq4A:
      'No. The timer reads subs, gifts, Bits, Kicks and mod commands from your public Twitch and Kick chat, the way a logged-out viewer sees them.',
  },
  goal: {
    breadcrumb: 'Sub Goal Setup',
    title: 'Sub Goal Setup',
    intro:
      'A sub goal bar for Twitch and Kick. Every new sub, resub and gifted sub from both chats fills it by one, and a trophy lands on the bar when you reach the goal. Pick where the count starts and where the goal is, and your mods can fix the count from chat.',
    sectionGoal: 'Goal',
    start: 'Starting Count',
    startTip:
      'Where the count starts: the sub count on your dashboard, or 0 to count this stream only. Changing it later starts the count over from the new number.',
    target: 'Goal',
    targetTip: 'The bar is full at this count. The count keeps going past it.',
    countsHint:
      'Every sub and resub adds 1, Prime and every tier alike. A gift adds 1 for each sub in it.',
    color: 'Color',
    titleLabel: 'Title',
    titleTip: 'Shown above the bar. Leave it empty to show no title.',
    titlePlaceholder: 'No title',
    showPops: 'Show New Subs',
    showPopsTip: "Floats up +1 with the viewer's name for every sub, or +5 for a gift of 5.",
    sectionCommands: 'Chat Commands',
    commandsIntro:
      'You and your mods can fix the count from Twitch or Kick chat, for example to add subs that came in while OBS was closed.',
    cmdAdd: 'Adds subs to the count, 1 if you leave the number out',
    cmdRemove: 'Takes subs off the count, 1 if you leave the number out',
    cmdSet: 'Sets the count',
    cmdReset: 'Goes back to the starting count',
    previewTitle: 'Sub Goal Preview',
    previewIframeTitle: 'Sub Goal Preview',
    previewHint:
      'The preview plays simulated subs and gifts until the goal is reached, then starts over. On stream only your chat adds to the count.',
    testTitle: 'Try it:',
    testViewer: 'You',
    testSub: '+1 Sub',
    testGift: '+5 Gifted',
    testReach: 'Reach Goal',
    testReset: 'Reset',
    widgetUrlTip:
      'Already made a widget? Paste its URL here to load your settings and change what you need.',
    widgetUrlPlaceholder: 'Paste an existing widget URL to edit it',
    widgetUrlInvalid: "This isn't a Sub Goal URL.",
    browserSourceHintSize: ' (recommended size: 800×260).',
    guideTitle: 'Streaming Software Setup (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Add a Browser Source in your streaming software (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Paste your copied sub goal URL.',
    guideStep3: 'Set width to 800 and height to 260.',
    guideStep4: 'If the count is ever off, you or a mod can fix it with !goal set in chat.',
    faq1Q: "Why doesn't it read my sub count from Twitch or Kick?",
    faq1A:
      "Neither platform shows a channel's sub count to a page that isn't logged in, and this goal never asks you to log in. So you type your starting count once, and from then on every sub and gift that comes in adds to it.",
    faq2Q: 'What happens if OBS closes or the browser source reloads?',
    faq2A:
      "The count is saved inside OBS, so it comes back where it was, on your next stream too. Subs that come in while OBS is closed can't be seen, so a mod can add them with !goal add.",
    faq3Q: 'Do resubs and gifted subs count?',
    faq3A:
      'Yes. Every new sub and resub adds 1, and a gift adds 1 for each sub in it, so a gift of 5 adds 5. On Twitch a resub counts when the viewer shares it in chat, and on Kick when it renews.',
    faq4Q: 'Can I make a follower goal?',
    faq4A:
      "Not yet. Twitch and Kick don't show new follows to a page that isn't logged in, so the goal counts subs, the same way on both platforms.",
  },
  frames: {
    breadcrumb: 'Stream Frames Setup',
    title: 'Stream Frames Setup',
    intro:
      "Ready-made frames for your camera, your chat or your whole stream screen. The preset you pick draws the frame in that game's style, down to its shape, decorations and motion: a pagoda roof, swaying tassels and drifting petals in Dynasty, grass blocks and flickering torches in Blocks. No channel to connect. Add the URL to OBS and put your camera or chat under the frame.",
    sectionPiece: 'Frame',
    piece: 'What are you framing?',
    pieceTip:
      'Each piece is its own browser source. Add all three with the same preset and everything on screen matches.',
    pieces: {
      camera: 'Camera',
      chat: 'Chat',
      screen: 'Screen',
    },
    pieceHints: {
      camera: 'A 16:9 frame for your webcam. Fit your camera into the opening in the middle.',
      cameraPortrait:
        'A 9:16 frame for a phone camera or a webcam turned on its side. Fit your camera into the opening in the middle.',
      chat: 'A tall frame with a header for the Chat Box. Place the Chat Box under the header.',
      screen:
        "A thin frame along the edges of your whole stream. The decorations stay in the corners so they don't cover your game.",
    },
    orientation: 'Orientation',
    orientations: {
      landscape: 'Landscape',
      portrait: 'Portrait',
    },
    labelLabel: 'Label',
    labelTips: {
      camera:
        'Shows on the tab above your camera, like your channel name. Leave it empty and the tab keeps just its decoration.',
      chat:
        'Shows on the tab above the chat frame. Leave it empty and the tab keeps just its decoration.',
      screen:
        'Shows on the plate at the bottom center of the screen. Leave it empty to hide the plate.',
    },
    labelPlaceholder: 'No label',
    color: 'Color',
    motion: 'Animations',
    motionTip:
      'Glowing lines, light sweeps and small touches that depend on the preset, like lanterns, torches or sparks. Turn it off and the frame stays still.',
    previewTitle: 'Stream Frame Preview',
    previewIframeTitle: 'Stream Frame Preview',
    previewHint:
      'The silhouette and chat lines in the preview are just placeholders. On stream the middle of the frame is transparent, so your camera or chat shows through from underneath.',
    widgetUrlTip:
      'Already made a frame? Paste its URL here to load your settings and change what you need.',
    widgetUrlPlaceholder: 'Paste an existing frame URL to edit it',
    widgetUrlInvalid: "This isn't a Stream Frames URL.",
    browserSourceHintSize: ' (recommended size: {width}×{height}).',
    guideTitle: 'Streaming Software Setup (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Add a Browser Source in your streaming software (OBS Studio, Streamlabs Desktop, XSplit, vMix, etc.) and paste the frame URL.',
    guideStep2:
      'Set the width and height to the recommended size. For a square camera, type your own size. The frame fits any size.',
    guideStep3:
      'In the Sources list, move the frame above your camera or Chat Box, then place it over them in the scene.',
    guideStep4:
      "Make your camera big enough to fill the opening, but keep it inside the frame's outer edge. In a 640 × 360 frame, 590 × 296 fits exactly, and in a 360 × 640 portrait frame, 306 × 572 does.",
    faq1Q: 'Does the frame show my camera or chat by itself?',
    faq1A:
      "No. The middle of the frame is transparent, it's only decoration. You add your camera and Chat Box to OBS as separate sources and put them under the frame.",
    faq2Q: 'Do I need to connect my Twitch or Kick account?',
    faq2A:
      "No. The frame doesn't read chat and doesn't need a channel name. It works the same whether you stream on Twitch, Kick or anywhere else.",
    faq3Q: 'Can I use the camera frame at a different size?',
    faq3A:
      'Yes. For a vertical camera, set Orientation to Portrait and the recommended size becomes 360 × 640. The frame is drawn to fit its browser source, so for a square camera just set the width and height to match, and the decorations scale with it.',
    faq4Q: 'Is the art in the frames taken from the games?',
    faq4A:
      'No. Every drawing, like the pagoda roof, the lanterns or the pixel blocks, was made from scratch, with no game logos or art. The presets are fan-made styles that capture the feel of those games.',
  },
  poll: {
    breadcrumb: 'Chat Poll Setup',
    title: 'Chat Poll Setup',
    intro:
      'A chat poll for Twitch and Kick. You or a mod put a poll up from chat, viewers vote by typing a number, and the bars fill live on your stream. Votes from both chats go into one poll, every viewer counts once, and the winner shows when time runs out.',
    sectionPoll: 'Ready-Made Poll',
    question: 'Question',
    questionTip: 'Shown above the options. Leave it empty if you ask the question out loud.',
    questionPlaceholder: 'What should we play next?',
    options: 'Options',
    optionsTip:
      'Viewers vote with the number next to an option, or by typing the option itself. Up to 6 options.',
    optionLabel: 'Option {n}',
    optionPlaceholder: 'Option {n}',
    removeOption: 'Remove option {n}',
    addOption: '+ Add Option',
    pollHint:
      'Saved in the URL. Put it up with {command} in chat. Mods can also type a new poll in chat any time.',
    sectionVoting: 'Voting',
    duration: 'Poll Length',
    durationTip:
      'How long a poll takes votes. In chat a mod can give one poll another length, end it early or add time.',
    durationOff: 'No timer: the poll stays open until a mod types !poll end.',
    hold: 'Results On Screen',
    holdTip: 'How long the results stay up after voting ends. Then the poll leaves the screen.',
    holdOff: 'The results stay up until the next poll or !poll cancel.',
    delay: 'Stream Delay',
    delayTip:
      'Viewers see your stream a few seconds after chat does, so a vote typed at "1 second left" reaches chat late. Votes keep counting for this many seconds after the timer ends. Twitch and Kick are usually 2 to 10 seconds behind.',
    voters: 'Who Can Vote',
    votersTip: 'Subscribers means viewers with a sub or founder badge, plus you.',
    votersAll: 'Everyone',
    votersSubs: 'Subscribers',
    subWeight: 'A Sub Vote Counts',
    subWeightTip: "A subscriber's vote counts this many times. The poll says so on screen.",
    subWeightValue: '{n}×',
    change: 'Viewers Can Change Their Vote',
    changeTip:
      'On: typing another number moves the vote. Off: the first vote stands. Either way every viewer counts once.',
    blind: 'Hide Results Until the End',
    blindTip:
      "The bars stay hidden while voting is open, so early votes don't sway the rest. Only the vote count shows.",
    color: 'Color',
    position: 'Position',
    positionTip:
      'Where the poll sits in the browser source. It grows from there with the number of options.',
    positionTop: 'Top',
    positionBottom: 'Bottom',
    language: 'Poll Language',
    languageTip:
      'The language of the words on the poll, like "Results" and the Yes and No of a quick poll.',
    unitMinutes: 'min',
    unitSeconds: 'sec',
    sectionCommands: 'Chat Commands',
    commandsIntro:
      'You and your mods run polls from Twitch or Kick chat. The parts of a new poll are split with |.',
    exampleQuestion: 'Question',
    cmdNew: 'Puts up a new poll with 2 to 6 options',
    cmdNewTime: 'The same, with its own length, like 90s, 2m or 1:30',
    cmdYesNo: 'Puts up a quick Yes or No poll',
    cmdStart: 'Puts up the ready-made poll from this page',
    cmdExtend: 'Adds time to the poll',
    cmdEnd: 'Ends voting now and shows the results',
    cmdCancel: 'Takes the poll off the screen',
    votingIntro:
      "Viewers vote by typing just the number (2), !vote 2 or an option's own text. A message with more in it, like \"2 please\", doesn't count. Twitch's /vote command is for Twitch's own polls, so tell chat to type the number.",
    previewTitle: 'Chat Poll Preview',
    previewIframeTitle: 'Chat Poll Preview',
    previewHint:
      'The preview plays a poll with simulated voters, faster than real time, then starts the next one. On stream a poll only shows up when you or a mod puts one up.',
    testTitle: 'Try it:',
    testVotes: '+{count} Votes',
    testExtend: '+30 sec',
    testEnd: 'End Now',
    testNew: 'New Poll',
    widgetUrlTip:
      'Already made a widget? Paste its URL here to load your settings and change what you need.',
    widgetUrlPlaceholder: 'Paste an existing widget URL to edit it',
    widgetUrlInvalid: "This isn't a Chat Poll URL.",
    browserSourceHintSize: ' (recommended size: 640×560).',
    guideTitle: 'Streaming Software Setup (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Add a Browser Source in your streaming software (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Paste your copied chat poll URL.',
    guideStep3: 'Set width to 640 and height to 560.',
    guideStep4:
      'The source stays empty until a poll starts. Type !poll start, or !poll Question | A | B, in chat.',
    faq1Q: 'How do viewers vote?',
    faq1A:
      "By typing the option's number in chat, like 2. !vote 2 and the option's own text work too, in any case and with or without Turkish letters. The whole message has to be the vote, so \"2 please\" or 4Head don't count.",
    faq2Q: 'Can a viewer vote more than once?',
    faq2A:
      'No. Every Twitch or Kick account counts once. With vote changing on, a new number moves their vote and never adds a second one. If a mod times out or bans an account while the poll is open, its vote comes off, which helps against spam bots.',
    faq3Q: "Why not use Twitch's or Kick's own polls?",
    faq3A:
      "This poll takes votes from Twitch and Kick into one result and works the same on both. Twitch's own polls can't be read without logging in, and this overlay never asks you to log in. You also don't need to be an Affiliate or Partner.",
    faq4Q: 'What happens if OBS closes or the browser source reloads?',
    faq4A:
      "The poll and its votes are saved inside OBS, so it comes back where it was. The timer keeps running while OBS is closed, but votes typed in that time can't be seen.",
    faq5Q: 'Why do votes still count after the timer hits zero?',
    faq5A:
      'Viewers watch your stream a few seconds behind chat, so when their timer shows 1 second left, it has already ended in chat. Stream Delay keeps counting votes for a few more seconds, 5 by default, and the winner shows after that.',
    overlay: {
      label: 'Poll',
      closing: 'Last votes',
      results: 'Results',
      tie: 'Tie',
      tieHint: "It's a tie!",
      winner: 'Winner: {option}',
      noVotes: 'No votes',
      hidden: 'Results show when voting ends',
      howTo: 'Type 1 to {last} in chat',
      howToTwo: 'Type 1 or 2 in chat',
      subsOnly: 'Subs only',
      subBonus: 'Sub votes ×{n}',
      votes: '{count} votes',
      voteOne: '1 vote',
      yes: 'Yes',
      no: 'No',
      sampleQuestion: 'What should we play next?',
      sampleOption1: 'Horror game',
      sampleOption2: 'Speedrun',
      sampleOption3: 'Viewer games',
    },
  },
  streamAlerts: {
    breadcrumb: 'Stream Alerts Setup',
    title: 'Stream Alerts Setup',
    intro:
      'Animated stream alerts for Twitch and Kick. A new sub, gifted subs, Bits, Kicks or a raid each get an alert with their own icon and sound, one after another. Pick a color, rename the headings and set the smallest gift, cheer or raid worth an alert.',
    color: 'Color',
    theme: 'Theme',
    themeTip:
      'Neon is an angular sci-fi banner with synth sounds. Celestial is a gold-line card under the stars with bell chimes.',
    themes: {
      neon: 'Neon',
      celestial: 'Celestial',
    },
    colorTip: 'Platform shows Twitch alerts in purple and Kick alerts in green.',
    colors: {
      blue: 'Blue',
      purple: 'Purple',
      pink: 'Pink',
      red: 'Red',
      gold: 'Gold',
      green: 'Green',
      platform: 'Platform (Twitch purple, Kick green)',
    },
    language: 'Alert Language',
    languageTip:
      "The language of the alert's words. The OBS URL keeps it, whatever language OBS runs in.",
    sectionAlerts: 'Alerts',
    heading: 'Heading',
    kindSub: 'Subs',
    kindSubTip: 'Every new sub and resub, and a resub a viewer shares in chat with a message.',
    kindGift: 'Gifted Subs',
    kindGiftTip: 'One alert per gift, however many subs it has.',
    kindBits: 'Bits & Kicks',
    kindBitsTip: 'Bits cheered on Twitch and Kicks sent on Kick.',
    kindRaid: 'Raids',
    kindRaidTip: 'Another channel raiding yours, with how many viewers came along.',
    minGift: 'Min. Subs',
    minBits: 'Min. Amount',
    minRaid: 'Min. Viewers',
    sectionTiming: 'Timing & Sound',
    duration: 'Time on Screen',
    durationTip: 'How long each alert stays up. When several come in, they wait their turn.',
    seconds: '{value}s',
    volume: 'Volume',
    volumeTip: 'Each alert plays a short sound of its own. 0 turns the sound off.',
    volumeOff: 'Off',
    showMessage: 'Show Viewer Message',
    showMessageTip:
      'Shows what the viewer wrote with their resub, Bits or Kicks. Links are left out, and long messages are cut short.',
    previewTitle: 'Stream Alerts Preview',
    previewIframeTitle: 'Stream Alerts Preview',
    previewHint:
      "The preview plays silent sample alerts. The buttons below play one with its sound. On stream only your channel's subs, gifts, cheers and raids show up.",
    testTitle: 'Try it:',
    testSub: 'Sub',
    testGift: '{count} Gifted',
    testBits: '{amount} Bits/Kicks',
    testRaid: 'Raid',
    testViewer: 'TestViewer',
    testMessage: 'Great stream!',
    widgetUrlTip:
      'Already made a widget? Paste its URL here to load your settings and change what you need.',
    widgetUrlPlaceholder: 'Paste an existing widget URL to edit it',
    widgetUrlInvalid: "This isn't a Stream Alerts URL.",
    browserSourceHintSize: ' (recommended size: 800×450).',
    guideTitle: 'Streaming Software Setup (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Add a Browser Source in your streaming software (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Paste your copied stream alerts URL.',
    guideStep3: 'Set width to 800 and height to 450, then place it where alerts should appear.',
    guideStep4:
      'To hear the sound in OBS, turn on Control audio via OBS in the source settings and set the source to Monitor and Output in Advanced Audio Properties.',
    faq1Q: 'Why are there no follow or donation alerts?',
    faq1A:
      "Twitch and Kick don't show new follows to a page that isn't logged in, and neither platform has donations of its own. The alerts only use what both platforms send to every viewer, so they work the same on both.",
    faq2Q: "Does a sub alert show the months and the viewer's message?",
    faq2A:
      'Yes. When a viewer shares their resub in chat, on Twitch or on Kick, it gets an alert with the months and what they wrote. On Twitch every sub alert shows the months. Kick sends them with most subs, but some channels never get them, and then the alert just says they subscribed.',
    faq3Q: 'What happens when many alerts come in at once?',
    faq3A:
      'They show one at a time in the order they came in. A gift of 50 subs is a single alert, not 50.',
    faq4Q: 'Do I need to log in or connect my account?',
    faq4A:
      'No. The alerts read subs, gifts, Bits, Kicks and raids from your public Twitch and Kick chat, the way a logged-out viewer sees them.',
    alert: {
      subHeading: 'New Subscriber',
      subDetail: 'just subscribed',
      resubDetail: 'subscribed for {months} months',
      giftHeading: 'Gifted Subs',
      giftDetail: 'gifted {count} subs',
      giftDetailOne: 'gifted a sub',
      bitsHeading: 'New Cheer',
      bitsDetail: 'cheered {amount} Bits',
      kicksHeading: 'Kicks',
      kicksDetail: 'sent {amount} Kicks',
      raidHeading: 'Incoming Raid',
      raidDetail: 'is raiding with {viewers} viewers',
      raidDetailOne: 'is raiding with 1 viewer',
      raidDetailNoCount: 'is raiding',
      anonymous: 'Anonymous',
    },
  },
  raffle: {
    breadcrumb: 'Raffle Setup',
    title: 'Raffle Setup',
    intro:
      'Run giveaways right from chat: viewers join by typing a keyword like !join, and you draw the winner with one click. Works on Twitch and Kick, can be limited to subscribers, and puts the winner on stream with confetti if you want.',
    lockedTitle: 'Settings locked',
    lockedDesc:
      "Rules can't change while a raffle is running or waiting for a draw. Press Reset All to edit them.",
    platform: 'Platform',
    channelName: 'Channel',
    sectionRules: 'Entry Rules',
    entryKeyword: 'Entry Keyword',
    keywordTip:
      "The message has to be exactly this, or start with it followed by a space. Capital letters don't matter, and known bots are ignored.",
    minDuration: 'Minimum Duration (s)',
    minDurationTip:
      'Draw Winner stays locked for this many seconds after you press Start, so everyone has time to type.',
    subscribersOnly: 'Subscribers Only',
    subscribersOnlyTip:
      'Only viewers with a subscriber or founder badge can enter. You can join too as the broadcaster, as long as the minimum is 1 month.',
    minSubMonths: 'Minimum Sub Months',
    maxWinsPerUser: 'Max Wins Per Viewer',
    maxWinsTip:
      'A winner leaves the entry list. They can join again by typing the keyword, until they reach this limit.',
    maxWinsUnlimited: 'Unlimited',
    resetConfig: 'Reset Settings',
    controlTitle: 'Raffle Controls',
    controlTip:
      'Keep this page open during the raffle. It reads chat and sends the winner to the overlay.',
    statusIdle: 'Not started',
    statusNeedsSetup: 'Enter a channel and a keyword to start.',
    statusRunning: 'Open, waiting for {keyword}',
    statusStopped: 'Entries closed',
    startRaffle: 'Start Raffle',
    stopRaffle: 'Close Entries',
    drawWinner: 'Draw Winner ({count} eligible)',
    drawLocked: 'Draw unlocks in {seconds}s',
    lastWinner: 'Last winner',
    clear: 'Clear',
    resetEntries: 'Clear entries',
    resetWinners: 'Clear winners',
    resetAll: 'Reset All',
    winners: 'Winners ({count})',
    participants: 'Entries ({count})',
    noWinners: 'No winners yet.',
    noParticipants: 'No entries yet. Viewers join by typing {keyword} in chat.',
    disqualify: 'Remove {name}',
    confirmStart: 'Start a new raffle? The current entries and winners will be cleared.',
    confirmResetEntries: 'Clear the entry list?',
    confirmResetWinners: 'Clear the winners list?',
    confirmResetAll:
      'Reset everything? Entries and winners are cleared and the lock comes off. Your settings stay as they are.',
    overlayUrl: 'Winner Overlay URL',
    overlayUrlTip:
      "The winner is sent through the browser's BroadcastChannel, which can't leave the browser it runs in. A raffle page open in Chrome can't reach an overlay inside OBS.",
    overlayUrlHint:
      'The winner only reaches the overlay when this page runs in the same browser or app as the overlay. Do a test draw before you go live.',
    overlayNextStep: 'Run this raffle page in the same app as the overlay and do a test draw.',
    guideStep1: 'Pick the platform, type your channel name and set the entry keyword and rules.',
    guideStep2: 'Want the winner on stream? Add the overlay URL as a 1920×1080 browser source.',
    guideStep3:
      'Press Start Raffle. Viewers join by typing the keyword in chat, and you can drop anyone with the ✕ next to their name.',
    guideStep4:
      "When you're ready, press Draw Winner. The winner only shows up on the overlay if this page runs in the same browser or app, so try it before you go live.",
    faq1Q: 'How do you stop the same person winning twice?',
    faq1A:
      "A drawn winner leaves the entry list and moves to the winners list. With Max Wins Per Viewer at 1, they can't enter or win again in the same raffle.",
    faq2Q: 'Can I remove suspicious entries or bots?',
    faq2A:
      'Known bots like Nightbot and StreamElements are skipped automatically. You can also remove anyone with the ✕ next to their name.',
    faq3Q: "Why doesn't the winner show up on my overlay?",
    faq3A:
      'The raffle page sends the winner with BroadcastChannel, which only works inside one browser. If this page is open in Chrome and the overlay runs in OBS, the message never arrives. Run the raffle page in the same app as the overlay and do a test draw before you go live.',
    winner: 'Winner!',
    subMonthsShort: '{months}mo',
  },
  alerts: {
    follow: 'New Follower!',
    sub: 'New Subscriber!',
    donate: 'Donation!',
    raid: 'Incoming Raid!',
  },
  emoteWallSetup: {
    breadcrumb: 'Emote Wall Setup',
    title: 'Emote Wall Setup',
    intro:
      "Messages made only of emotes (Twitch, Kick and your Twitch channel's 7TV emotes) pop up as emotes on screen. Normal text messages are skipped by default, and Show All Emotes pulls the emotes out of those too. Calm pops them up at random spots to drift and fade, Chaos flies them in from an edge across the screen, and Bounce bounces them off the screen edges.",
    sectionAnimation: 'Animation',
    sectionFilters: 'Filters',
    sevenTvEmotes: '7TV Emotes',
    sevenTvTip:
      'Shows the 7TV emotes of your Twitch channel, in Kick chat too. Needs your Twitch channel.',
    mode: 'Animation Mode',
    modeCalm: 'Calm',
    modeChaos: 'Chaos',
    modeBounce: 'Bounce',
    modeTip:
      'Calm: pops up at a random spot, drifts and fades out. Chaos: flies in from a random edge and vanishes somewhere between halfway and the far side. Bounce: ricochets off the edges and speeds up on every hit.',
    emoteSize: 'Emote Size',
    duration: 'Visible Duration (sec)',
    durationTip:
      'How long each emote stays on screen. In Chaos, emotes cross the screen in part of this time and vanish sooner.',
    maxEmotes: 'Max Simultaneous Emotes',
    maxEmotesTip: 'When more emotes than this are on screen, the oldest ones are removed.',
    subsOnly: 'Subscribers Only',
    subsOnlyTip:
      'Only shows emotes from chatters with a subscriber or founder badge, and from you. The preview ignores this.',
    subDurationX2: 'Sub Emotes 2× Longer',
    subDurationX2Tip:
      'Emotes from chatters with a subscriber or founder badge, and from you, stay on screen twice as long.',
    showAllEmotes: 'Show All Emotes',
    showAllEmotesTip:
      'Also shows emotes inside normal text messages, up to 5 per message. The preview ignores this.',
    hypeMode: 'Hype Mode',
    hypeModeTip:
      'An emote only appears once 2 or more different chatters send it within 15 seconds, then at most once every 15 seconds. The preview ignores this.',
    spamBlock: 'Block Emote Spam',
    spamBlockTip:
      'If a chatter sends more than 3 emote messages in 10 seconds, the extra ones are skipped. The same emote more than twice in 10 seconds skips just that emote. The preview ignores this.',
    previewTitle: 'Emote Wall Preview',
    previewIframeTitle: 'Emote Wall Preview',
    previewHint: 'The preview shows sample emotes. On stream, the emotes come from your chat.',
    widgetUrlTip:
      'Already made a widget? Paste its URL here to load your settings and change what you need.',
    widgetUrlPlaceholder: 'Paste an existing widget URL to edit it',
    widgetUrlInvalid: "This isn't an Emote Wall widget URL.",
    guideTitle: 'Streaming Software Setup (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      'Add a Browser Source in your streaming software (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: 'Paste your copied emote wall URL.',
    guideStep3:
      'Set width and height to your full canvas size (e.g. 1920×1080) and place it above your gameplay.',
    browserSourceHintSize: ' (recommended size: 1920×1080 full canvas).',
    faq1Q: 'Which messages trigger a floating emote?',
    faq1A:
      'Messages made only of emotes, like a single Kappa, a row of emotes, or a mix of Twitch, Kick and 7TV emotes. Normal text messages are ignored unless Show All Emotes is on.',
    faq2Q: 'Do I need to sign in to use the emote wall?',
    faq2A:
      'No login is required. Emote Wall listens anonymously to public chat streams for both platforms.',
  },
  plants: {
    classic: 'Classic Sprout',
    rose: 'Rose',
    sunflower: 'Sunflower',
    cactus: 'Cactus',
    tulip: 'Tulip',
    pine: 'Pine Tree',
    lotus: 'Lotus',
    lily: 'Lily',
    palm: 'Palm Tree',
    vine: 'Climbing Vine',
    waterOff: 'Off',
    waterRain: 'Rain',
    waterSparkle: 'Sparkle',
  },
  guides: {
    breadcrumb: 'Guides',
    eyebrow: 'Guide',
    published: 'Published {date}',
    onThisPage: 'On this page',
    covers: 'Tools covered',
    relatedTitle: 'Related guides',
    readGuide: 'Read the guide',
    allGuides: 'All guides',
    openSetup: 'Open the setup page',
    index: {
      title: 'Guides',
      lead: "Each guide answers one question step by step: adding a widget to OBS, combining Twitch and Kick chat, reading chat in an OBS dock, adding stream alerts, running a subathon timer, running a chat poll, framing your camera and chat, running a chat raffle and switching scenes from chat. They all cover free tools that don't need a login.",
      listLabel: 'All guides',
      moreText:
        "For general questions, check the [FAQ](/faq). To see what's changed, head to the [changelog](/changelog).",
    },
    obs: {
      title: 'How to add a Senchabot widget to OBS as a Browser Source',
      short: 'Add a widget to OBS',
      summary:
        'The steps for adding a Browser Source, the right size for each widget, two settings to leave off, and what to check if the widget looks empty.',
      lead: "Senchabot widgets go into OBS as a Browser Source: click + in the Sources dock, pick Browser, paste the URL you copied from the setup page into the URL field, and set the width and height to the widget's recommended size. You don't need to log in or download anything, and the background is already transparent.",
      add: {
        title: 'How do you add a Browser Source in OBS?',
        intro:
          'Once you type your channel name on the setup page and hit Copy, follow these steps in OBS Studio:',
        step1: 'Select the scene the widget should appear in.',
        step2: 'In the Sources dock, click + and pick Browser from the list.',
        step3: 'Give the source a name, for example "Chat Box", and click OK.',
        step4:
          'In the properties window that opens, clear the URL field and paste the widget URL you copied.',
        step5: 'Enter the values from the table below in the Width and Height fields.',
        step6: 'Click OK and drag the source wherever you want it in the scene.',
        note: 'The [Chat Box setup page](/setup/chat-widget) shows these steps along with the recommended size when you copy the URL. If you want to be sure, open the URL in a regular browser tab first and check that it works.',
      },
      size: {
        title: 'What size should each widget be?',
        intro:
          'Every widget has a recommended source size. Enter these values in the Width and Height fields in OBS.',
        caption: 'Recommended Browser Source sizes for Senchabot widgets',
        colWidget: 'Widget',
        colSize: 'Width × Height',
        colNote: 'Note',
        notSource: 'Not a source',
        notes: {
          chatBox:
            'A vertical chat column. A bigger source fits more messages, the text stays the same size.',
          emoteWall: 'A full 1080p canvas. Emotes show up anywhere on the screen.',
          subSprout: 'The plant and pot grow inside this area.',
          frames:
            '640x360 for a camera, 420x720 for chat, 1920x1080 for the screen. The frame fits whatever size you give it.',
          goal: 'A wide strip for the goal bar, with room above it for the +1s to rise into.',
          subathon: 'A wide strip for the health bar, clock or ring. A bigger source scales it up.',
          poll: 'Room for a poll with up to 6 options. It sits at the top or bottom and grows with the options.',
          streamAlerts:
            'One alert at a time, in the middle of this area. A bigger source scales it up.',
          raffle:
            "The winner overlay. Confetti bursts from both sides of the screen and the winner's name appears in the middle.",
          obsBridge: 'Not a visible overlay. Keep the tool open in a browser tab or an OBS dock.',
        },
        fontNote:
          "To make the Chat Box text bigger, don't stretch the source. Use the Font Size setting on the setup page: 8 to 72 pixels, 18 by default.",
      },
      transparent: {
        title: 'Do you need to do anything to make the background transparent?',
        p1: "No. Chat Box, Emote Wall, Sub Sprout, Subathon Timer, Stream Alerts, Sub Goal, Chat Poll and the Raffle overlay are drawn on a transparent background. You don't need a chroma key or a filter, and you can leave the Custom CSS field in OBS as it is.",
        p2: 'If Chat Box is hard to read on a bright scene, turn on Dark Background. It puts a semi-transparent black layer behind the widget, and you can set its opacity anywhere from 0% to 100% (50% by default). If you want each message in its own box, turn on Message Background Box.',
      },
      settings: {
        title:
          'Should "Shutdown source when not visible" and "Refresh browser when scene becomes active" be on?',
        intro:
          'Leave both off for Senchabot widgets. Both reload the page from scratch, and the widget forgets everything it was holding up to that point:',
        chatBox:
          'Chat Box: messages only come in while the source is running. If the source shuts down and comes back, the screen starts empty and only shows new messages.',
        subSprout:
          "Sub Sprout: the plant's growth isn't saved anywhere. If the page reloads, the plant goes back to the first stage.",
        goal: "Sub Goal: the count is saved inside OBS, so a reload doesn't lose it, but subs that come in while the source is off aren't counted.",
        poll: "Chat Poll: the poll and its votes are saved inside OBS, so a reload doesn't lose them, but votes typed while the source is off aren't counted.",
        subathon:
          "Subathon Timer: the time left is saved inside OBS, so a reload doesn't lose it. The timer keeps counting down while the source is off, but it can't see subs that come in during that time.",
        streamAlerts:
          "Stream Alerts: only subs, gifts, cheers and raids that come in while the source is running get an alert. Anything that arrives while it's off is missed.",
        raffle:
          'Raffle overlay: only the overlay that is open at that moment gets the winner. A winner drawn while the source is off never shows up on screen.',
        emoteWall:
          "Emote Wall: emotes stay for 5 seconds by default, so a refresh doesn't cost you anything, but it doesn't help either.",
        refresh:
          'If a widget gets stuck, double-click the source and hit the "Refresh cache of current page" button in the properties window. That reloads the page once.',
      },
      update: {
        title: 'How do I change a widget later?',
        p1: 'Your settings live inside the widget URL, so changing a setting means a new URL. Change the setting on the setup page, copy the new URL, then double-click the source in OBS and paste it over the old URL in the URL field.',
        p2:
          "You don't have to start over with [Chat Box](/setup/chat-widget), [Emote Wall](/setup/emote-wall), [Sub Sprout](/setup/sub-growing-plant), [Subathon Timer](/setup/subathon-timer), [Stream Alerts](/setup/stream-alerts), [Sub Goal](/setup/sub-goal), [Chat Poll](/setup/chat-poll) or [Stream Frames](/setup/stream-frames). Paste your current URL into the Widget URL field on the setup page and your channels and all your settings come back. Change what you want and copy the new URL.",
        p3: "OBS Bridge has no paste field, so enter your settings again on its setup page and copy the new tool URL. You can also change scene picks and authorized users on the tool page itself and grab the new URL with its Copy Updated URL button. Old URLs keep working, so you don't have to update them.",
      },
      troubleshoot: {
        title: "What should I do if the widget doesn't show up in OBS?",
        intro:
          'Most of the time the channel name is the problem. Go through these checks in order.',
        linkTitle: 'Did you type a link instead of the channel name?',
        linkBody:
          "Only type the name in the channel field: `senchabot` for twitch.tv/senchabot. If you paste the full link, the widget treats the link as the channel name and can't connect to any chat.",
        channelTitle: 'Does the channel actually exist?',
        channelBody:
          "Check the name for typos. A channel that doesn't exist on Twitch doesn't throw an error. The widget just stays empty.",
        quietTitle: 'Has anything happened in chat yet?',
        quietBody:
          'Chat Box and Emote Wall stay completely empty and transparent until something happens in chat. Send a message in chat; for Emote Wall it has to be a message made only of emotes by default, but with Show All Emotes on, emotes inside normal messages count too. The Raffle overlay also only appears when a winner is drawn and disappears after 10 seconds. Sub Sprout and Subathon Timer, on the other hand, show up right away.',
        kickTitle: 'Kick channel not found?',
        kickBody:
          "When the widget opens, it looks up the Kick channel on kick.com. If that lookup fails (wrong name, the channel doesn't exist, or Kick doesn't respond), Kick messages won't come in. Type your Kick name exactly as it appears in the kick.com URL.",
        tabTitle: 'Does the URL work in a browser?',
        tabBody:
          "Open the URL in a regular browser tab. If it works there but not in OBS, check the source's URL field and size.",
      },
      ctaTitle: 'Pick your widget and get its URL',
      ctaText: 'Every setup page gives you a ready-made URL to paste into OBS.',
    },
    chat: {
      title: 'How to show Twitch and Kick chat together in OBS',
      short: 'Twitch and Kick chat together',
      summary:
        'Combining both chats with one Chat Box URL, showing where each message came from, emotes, hiding bots and horizontal mode for a bottom bar.',
      lead: 'Chat Box combines Twitch and Kick chat in a single Browser Source. On the setup page, pick Both under Platforms, type both channel names and add the one URL you get to OBS at 400 × 600. No login needed, both chats are read anonymously.',
      setup: {
        title: 'How do you combine Twitch and Kick chat in one overlay?',
        step1: 'Open the [Chat Box setup page](/setup/chat-widget).',
        step2: "Pick Both under Platforms. It's already the default.",
        step3: 'Type just the channel names in the Twitch Channel and Kick Channel fields.',
        step4: 'Adjust the look. The preview shows every change right away.',
        step5: 'Copy the Widget URL and add it to OBS as a Browser Source at 400 × 600.',
        p1: "The URL you get includes both channels, for example `/widgets/chat-widget?twitch=yourchannel&kick=yourchannel`. You don't need a separate source for each platform.",
        p2: 'The preview always plays sample chat. That way you can see how your settings will look on stream without anyone typing in your channel.',
      },
      restream: {
        title: 'Does Chat Box restream me to both platforms?',
        p1: "No. Chat Box only reads chat and shows it on screen. It doesn't send your stream to Twitch or Kick, and it can't post in chat. To stream on both platforms at once you need a separate multistreaming setup; Chat Box brings both chats together on that stream.",
        p2: 'Moderation carries over to the overlay too: deleted messages and messages from users who get a timeout or ban are removed from the screen.',
      },
      platform: {
        title: 'How can you tell if a message came from Twitch or Kick?',
        intro:
          'When both platforms are on, Platform Indicator shows where each message came from at the start of the message. There are three options:',
        icon: 'Platform Icon (default): the Twitch or Kick logo.',
        name: 'Platform Name: the text `[twitch]` or `[kick]` instead of a logo.',
        none: 'Hide Platform: no marker at all.',
        stripe:
          'Turn on Platform Color Stripe and a thin line appears to the left of each message: purple for Twitch, green for Kick. With the stripe on, you can hide the indicator for a cleaner look. On a highlighted message, the highlight color takes the place of the stripe.',
      },
      look: {
        title: 'What layouts, animations and fonts are there?',
        layoutTitle: 'Message Layout',
        inline: 'Inline (default): username and message on the same line.',
        stacked: 'Stacked: username on top, message below.',
        card: 'Card / Bubble: each message sits in a semi-transparent card.',
        compact: 'Compact: tight, Twitch-style lines with slightly smaller text.',
        animationTitle: 'New message animation',
        animations:
          'There are eight options: Slide from right (default), Smooth slide from right, Pop / scale-in, Bounce in, Stagger, Fade in, Typewriter and No animation. When chat speeds up, every animation except the default gets shorter. If messages come in faster than one every half second, the animation drops to as little as a third of its normal length, so none of them struggle to keep up with the next one.',
        fontTitle: 'Font and size',
        fonts:
          'Inter (default), Roboto, Nunito, JetBrains Mono, Source Serif 4 and the System Default font. Font size goes from 8 to 72 pixels, 18 by default. Bold Usernames and Bold Messages are separate toggles.',
      },
      duration: {
        title: 'How long do messages stay on screen?',
        p1: '30 seconds by default. Under Message Duration you can pick 10 sec, 15 sec, 30 sec, 1 min, 2 min, 5 min or Forever.',
        p2: "With Forever, messages don't disappear: new ones push the old ones up, anything that doesn't fit in the box gets cut off, and at most the last 100 messages are kept.",
      },
      emotes: {
        title: 'Which emotes show up?',
        intro:
          "Twitch's and Kick's own emotes always show as images. On top of those, you can turn three providers on or off from the Emotes menu, and all three are on by default.",
        caption: 'Platforms each emote provider supports in Chat Box',
        colProvider: 'Provider',
        colPlatforms: 'Works on',
        both: 'Twitch and Kick',
        twitchOnly: 'Twitch only',
        p1: "Channel emotes and global emotes load together. If two emotes share a name, the channel emote wins, and the order between providers is 7TV, BTTV, FFZ. On Kick messages, 7TV uses the emote set linked to the channel's Kick account. If only your Twitch account is linked on 7TV, Kick messages use that set too. Emotes from a provider you turn off stay as plain text.",
      },
      filters: {
        title: 'How do you hide bots and commands?',
        bots: 'Hide Bots removes messages from known bot accounts: Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, Sery_Bot, SoundAlerts, StreamlootsBot, KofiStreamBot, PokemonCommunityGame, OWN3D, Blerp, BotRix, KickBot, Kicklet and Senchabot. Accounts with the "Chat Bot" badge on Twitch or the "Bot" badge on Kick are hidden too.',
        commands:
          'Hide Commands hides every message that starts with "!", so commands like `!discord` or `!uptime` stay off your screen. To also hide what the bot replies to a command, turn on both settings.',
        highlights:
          "To do the opposite and make certain messages stand out, use Highlights. All five are off by default, so just turn on the ones you want: messages that tag your channel or reply to you, the line above a reply that shows who's being replied to, first-time chatters, announcements, and messages sent with Highlight My Message. The last three are Twitch only, because Kick doesn't send that info.",
      },
      horizontal: {
        title: 'How do you put chat along the bottom of the screen as a bar?',
        p1: 'Set Orientation to Horizontal. Messages line up side by side, the newest one appears on the right, and older ones slide left out of the box.',
        p2: 'The 400 × 600 suggestion is for vertical use. For a horizontal bar, set the source width to the length of the bar and the height to a single line of messages, then place the source at the bottom of the screen.',
      },
      others: {
        title: 'Which other widgets listen to both platforms together?',
        p1: '[Emote Wall](/setup/emote-wall), [Sub Sprout](/setup/sub-growing-plant), [Subathon Timer](/setup/subathon-timer), [Stream Alerts](/setup/stream-alerts), [Sub Goal](/setup/sub-goal) and [Chat Poll](/setup/chat-poll) also take both channels in one URL. Emote Wall sends emote-only messages from both chats flying across the screen. Sub Sprout grows with subscriptions on both platforms, gifted subs on Kick included. Subathon Timer adds time for subs, gifted subs, Bits and Kicks from both chats. Stream Alerts shows an alert for subs, gifted subs, Bits, Kicks and raids from both. Sub Goal adds subs and gifted subs from both chats into one count. Chat Poll puts votes from both chats into one result.',
        p2: '[Raffle](/setup/raffle), on the other hand, runs on one platform at a time: Twitch or Kick.',
      },
      ctaTitle: 'Set up Chat Box',
      ctaText: 'Type your channel names, copy the URL, add it to OBS. No login, no download.',
      ctaSecondary: 'Check out Emote Wall',
    },
    raffle: {
      title: 'How to run a chat giveaway on Twitch or Kick',
      short: 'Run a chat giveaway',
      summary:
        'Joining with !join, subscriber-only raffles, win limits, minimum duration and showing the winner on stream with confetti, all with the Raffle tool.',
      lead: 'With the Raffle tool, viewers join by typing a keyword in chat and you draw the winner in one click. The default keyword is `!join`. No login needed; entries and winners are saved in your own browser.',
      start: {
        title: 'How do you start a raffle?',
        step1:
          'Open the [Raffle page](/setup/raffle) and pick the platform: Twitch or Kick. A raffle runs on one platform.',
        step2: "Type the channel name. Entries are read from that channel's chat.",
        step3:
          'Set the Entry Keyword. The default is `!join`, and you can change it to any word you like.',
        step4:
          'Pick your rules, then hit Start Raffle. The button stays disabled while the keyword is empty.',
        step5:
          'People who join show up in the list. Once you have enough entries, hit Draw Winner.',
        p1: "Settings lock when the raffle starts, so the rules can't change mid-raffle. To close entries, hit Close Entries; you can still draw a winner after that. Starting a new raffle clears the entry list, so the page asks you to confirm first.",
      },
      entry: {
        title: 'How do viewers enter the raffle?',
        p1: "Viewers type the keyword in chat. Case doesn't matter, and the message can keep going as long as it starts with the keyword: `!join` and `!join good luck` count, `hey !join` doesn't.",
        p2: "Each person enters once. Typing the command again doesn't give them a second chance.",
        p3: "Known bots can't enter at all: Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, BotRix, SoundAlerts, Blerp, Kofi_Stream_Bot and Senchabot. To remove someone from the list by hand, click the ✕ button next to their name.",
      },
      rules: {
        title: 'Which rules can you set?',
        caption: 'Raffle rules, options and defaults',
        colRule: 'Rule',
        colOptions: 'Options',
        colDefault: 'Default',
        subsOnly: 'Subscribers Only',
        subsOnlyOptions: 'On or off',
        subsOnlyDefault: 'Off',
        minMonths: 'Minimum Sub Months',
        minMonthsOptions: '1 or more, only when Subscribers Only is on',
        minMonthsDefault: '1',
        maxWins: 'Max Wins Per Viewer',
        maxWinsOptions: '1 to 5, or unlimited',
        maxWinsDefault: '1',
        minDuration: 'Minimum Duration',
        minDurationOptions: '0 to 300 seconds',
        minDurationDefault: '15 seconds',
        subsText:
          "With Subscribers Only on, anyone without a subscriber badge can't enter. The broadcaster counts as a subscriber too, so you can enter your own raffle as long as Minimum Sub Months is 1. At 1, every subscriber can enter; set it to 6 and only people who have been subscribed for at least 6 months get in. On both Twitch and Kick, sub length is read from the viewer's subscriber badge.",
        winsText:
          "A drawn winner leaves the entry list and moves to the winners list. If the limit is 1, they can't win again in the same raffle. If the limit is higher or unlimited, they can enter again by typing the keyword again.",
        durationText:
          'The Draw Winner button stays locked until this much time has passed since the raffle started, and it shows the seconds left. That gives viewers who spot it late time to join too.',
        fairText:
          "The winner is drawn from eligible entries using the browser's secure random number generator (`crypto.getRandomValues`).",
      },
      storage: {
        title: 'Will I lose the raffle if I refresh the page?',
        p1: "No. Settings, entries and winners are stored in the browser's local storage (localStorage). Even if you refresh or close and reopen the page, you pick up right where you left off.",
        p2: "This data only lives in that browser, so it won't show up on another computer or browser. Chat isn't read while the page is closed, so commands typed in the meantime don't count. To start over, use Reset All; you can also clear just the entries or just the winners.",
      },
      overlay: {
        title: 'How do you show the winner on stream?',
        p1: "Add the winner overlay URL from the Raffle page (`/widgets/raffle-overlay`) to OBS as a 1920 × 1080 Browser Source. When you hit Draw Winner, the overlay shows the winner's name in the middle of the screen, confetti bursts from both sides for 3 seconds, and the name disappears after 10 seconds.",
        warnTitle: 'Always test it before you go live',
        warn: 'The winner reaches the overlay through BroadcastChannel, which only works inside the same browser. If you open the Raffle page in a separate browser like Chrome and add the overlay to OBS, the two run in different apps and the winner never reaches OBS. Before you go live, run a test raffle and check that the winner shows up in OBS.',
        p2: 'Keep the scene with the overlay active and leave "Shutdown source when not visible" off on the source; a source that\'s shut down misses the winner. Details are in the [OBS guide](/guides/obs-browser-source). The winner always shows up with confetti on the Raffle page too, so you can read the name there even if the overlay doesn\'t work.',
      },
      ctaTitle: 'Get your raffle ready',
      ctaText:
        "Pick the platform, type your channel, set the keyword. You're ready for your first raffle in a minute.",
    },
    bridge: {
      title: 'How to let mods switch OBS scenes from chat',
      short: 'Switch scenes from chat',
      summary:
        'Turning on WebSocket for OBS Bridge, chat commands, how !scene finds a scene, and who can use the commands.',
      lead: 'OBS Bridge listens to Twitch or Kick chat and passes commands from the people you authorize to OBS on your computer. Turn on the WebSocket server in OBS, enter your channel and authorized users on the setup page, and keep the tool URL you get open. When a mod types `!scene game`, OBS switches to a scene with "game" in its name.',
      websocket: {
        title: 'How do you turn on WebSocket in OBS?',
        step1: 'In OBS, open Tools → WebSocket Server Settings from the top menu.',
        step2: 'Check the Enable WebSocket server box.',
        step3: 'If authentication is on, click Show Connect Info and copy the password.',
        step4: 'Click OK.',
        p1: "OBS Bridge talks to obs-websocket 5, which comes built into OBS Studio 28 and later. By default it connects to `ws://127.0.0.1:4455`; if OBS is on the same computer, leave the WebSocket URL field empty. If OBS is on another computer, enter that computer's address and port, for example `ws://192.168.1.20:4455`. If it can't connect, the tool tries again every 5 seconds.",
      },
      setup: {
        title: 'How do you set up OBS Bridge?',
        step1: 'Open the [OBS Bridge setup page](/setup/obs-bridge).',
        step2: 'Type the Twitch channel, the Kick channel or both for it to listen to.',
        step3: 'Add Authorized Users. Who to add is explained below.',
        step4: 'Enter your OBS WebSocket password, and change the WebSocket URL if you need to.',
        step5: 'Copy the Tool URL and open it in a browser tab or as a Custom Browser Dock in OBS.',
        step6:
          'The tool page lists your OBS scenes. Click the Main and BRB buttons next to the scenes you want to use as Main and BRB.',
        p1: "If you don't pick any, it looks for scenes named `Main Scene` for Main and `BRB Scene` for BRB. Your picks are saved in the tool page's URL, so copy the URL again after choosing and keep it somewhere. Next time you open it, the same scenes load.",
      },
      commands: {
        title: 'Which chat commands are there?',
        caption: 'Default OBS Bridge chat commands',
        colCommand: 'Command',
        colAction: 'What it does',
        sceneArg: '<scene name>',
        scene: 'Switches to the scene whose name matches',
        brb: 'Switches to the BRB scene',
        back: 'Switches to the Main scene',
        stream: 'Starts / stops the stream',
        record: 'Starts / stops recording',
        p1: "`brb` and `back` are typed without an exclamation mark. Commands ignore case, but the whole message has to be the command: `brb` works, `brb 5 min` doesn't. You can rename any command under Commands on the setup page, for example `!switch` instead of `!scene`.",
        p2: 'The stop stream command really does end your stream. Keep the authorized list short.',
      },
      matching: {
        title: 'How does the !scene command find the right scene?',
        p1: 'It looks for an exact match first: `!scene game` switches to the scene named exactly "Game", ignoring case. Without an exact match, it picks the first scene with that word in its name: `!scene chatting` finds the "Just Chatting" scene. If no scene matches, nothing happens.',
        p2: 'If more than one scene contains the same word, the one highest in your Scenes list wins. With similarly named scenes, typing the full name is the safest bet. When you add or rename a scene, the list updates on its own.',
      },
      users: {
        title: 'Who can use the commands?',
        p1: 'Only the people on the Authorized Users list. If the list is empty, nobody can use commands, not even the broadcaster, so you need to add your own account too.',
        p2: "Each user is added with a platform and shows up in the URL as `commandUser=twitch:bob,kick:alice`. A message only counts as a command if both the platform and the name match. That way, even if someone on Kick grabs a Twitch mod's name, they can't switch scenes.",
        p3: "Old names saved without a platform (just `bob`) work on that platform if the URL sets up a single platform. When both platforms are on, these names are marked in yellow on the tool page and can't use commands until you pick a platform for them.",
      },
      open: {
        title: 'Does the tool page have to stay open?',
        p1: 'Yes. The tool page is what reads chat and passes commands to OBS. If you close the tab, commands stop working. Keep the tool open in a tab or as a dock in OBS for the whole stream; if the connection to OBS drops, the tool tries to reconnect every 5 seconds.',
      },
      security: {
        title: 'Why should you treat the tool URL like a password?',
        p1: "Because your OBS WebSocket password is inside the URL (the `obsWebsocketPassword` parameter). Sharing the URL means sharing your password. Don't show it on stream, don't post it in chat, and hide the address bar when you share your screen.",
        p2: 'The connection to OBS goes straight from your browser to OBS. The tool page itself loads from extensions.senchabot.com like any website, so the full address, password included, goes along with that request.',
      },
      ctaTitle: 'Set up OBS Bridge',
      ctaText:
        'Enter your channel and authorized users, then open the tool URL. Scene commands start working right away.',
    },
    subathon: {
      title: 'How to run a subathon timer on Twitch and Kick',
      short: 'Run a subathon timer',
      summary:
        'How much time each sub, gift, Bits cheer and Kicks gift adds, starting it with !subathon, mod commands, and what happens when OBS closes or time runs out.',
      lead: 'Subathon Timer is a countdown that subs push back. Set a starting time and how much each sub, gifted sub, Bits cheer and Kicks gift adds, add the URL to OBS as an 800 × 300 Browser Source, and type `!subathon start` in chat when you go live. No login needed; it reads your public Twitch and Kick chat.',
      setup: {
        title: 'How do you set up a subathon timer?',
        step1: 'Open the [Subathon Timer setup page](/setup/subathon-timer).',
        step2: 'Pick Twitch, Kick or Both and type just the channel names.',
        step3: 'Set the Starting Time, 1 hour by default, and a Time Limit if you want one.',
        step4:
          'Set how much time a sub, a gifted sub, Bits and Kicks add. With Both, Twitch and Kick each get their own tab.',
        step5:
          'Pick a style and a color, copy the URL and add it to OBS as a Browser Source at 800 × 300.',
        p1: 'The preview on the setup page plays simulated subs, gifts and cheers at 60× speed, so a one hour timer runs out in about a minute. You can set the speed from 1× to 300×. The Try it buttons add a sub, a gift of 5 or 500 Bits/Kicks, take 10 minutes away, pause and reset. They only change the preview, never the timer in OBS.',
      },
      values: {
        title: 'How much time does each sub add?',
        intro:
          'You pick the time in whole minutes, from 0 to 60, and 0 turns that event off. Twitch and Kick have separate values, all 1 minute by default. Show on the Timer, on by default, lists them on the timer, like Sub +1 min, so viewers know what their sub adds. When Twitch and Kick add different times, the two take turns.',
        caption: 'Time each event adds to the subathon timer',
        colEvent: 'Event',
        colDefault: 'Default',
        colHow: 'How it counts',
        oneMinute: '1 min',
        sub: 'Sub',
        subHow: 'Every new sub and resub. On Twitch a Prime sub counts as Tier 1.',
        gift: 'Gifted sub',
        giftHow: 'Every sub in the gift, so a gift of 5 adds five times as much.',
        bits: '500 Bits or 500 Kicks',
        bitsHow: 'Other amounts add their share: at 1 minute, 100 Bits adds 12 seconds.',
        tiers:
          'With Tier 2 and 3 Count More on, which is the default, a Twitch Tier 2 sub or gift adds twice the time and Tier 3 adds five times, in line with their price. Kick subs have no tiers, so each one counts once.',
        cap: "The Time Limit is the most time the timer can hold. Anything that would go past it isn't added, and no +time shows for it. With No limit, which is the default, the timer keeps growing as long as subs keep coming.",
      },
      start: {
        title: 'How do you start the subathon?',
        p1: "By default the timer waits, paused, until you or a mod types `!subathon start` in chat. That way you can add the source before the stream and start the clock when you're live. If you pick Right Away under Start, the timer starts as soon as the source loads in OBS.",
        p2: "Subs that come in before the start still add time, and so do subs while the timer is paused. The time is there waiting when the clock starts.",
      },
      commands: {
        title: 'Which chat commands can mods use?',
        caption: 'Subathon Timer chat commands',
        colCommand: 'Command',
        colAction: 'What it does',
        start: 'Starts the timer, or resumes it after a pause',
        pause: 'Pauses it; the time left stays where it is',
        add: 'Adds time, up to the Time Limit',
        remove: 'Takes time away, down to zero',
        set: 'Sets the time left',
        reset: 'Starts over from the Starting Time',
        p1: "Only the broadcaster and moderators can use them, on Twitch and on Kick. VIPs and viewers can't. The timer doesn't answer in chat; you see the result on the timer itself.",
        p2: "Write times like `10m`, `45s`, `1h30m` or `1:30:00`. A plain number means minutes, so `!subathon add 15` adds 15 minutes. Units are single letters: `10min` doesn't work, `10m` does.",
      },
      look: {
        title: 'Which styles and colors are there?',
        bar: 'Health Bar (default): a game-style bar that drains from 100% toward zero.',
        clock: 'Clock: big numbers in hours, minutes and seconds.',
        ring: 'Ring: a circle that empties as the time runs out.',
        p1: 'The default color, Health, goes from green to amber to red as the time runs low. You can also pick one fixed color: green, purple, red, gold, cyan or pink. The title next to the timer says SUBATHON by default; change it to anything up to 32 characters, or leave it empty to hide it.',
        p2: "Show Percentage shows how full the timer is. 100% is the most time the timer has held so far, so it never goes over 100%: when time is added to a full bar, the bar stays full and counts down from the new peak. Show Added Time floats a +1:00 with the viewer's name above the timer every time time is added.",
      },
      saved: {
        title: 'What happens if OBS closes or the source reloads?',
        p1: 'The timer is saved inside OBS, so after a reload or an OBS restart it comes back where it was. While OBS is closed it keeps counting down, like a real deadline.',
        p2: "Nothing reads your chat while OBS or the source is off, so subs in that time don't add anything. A mod can add them afterwards with `!subathon add`. That's also why \"Shutdown source when not visible\" should stay off; the [OBS guide](/guides/obs-browser-source) explains it.",
        p3: 'The saved timer belongs to that OBS and those channels. If you change the channels in the URL, for example by adding Kick mid-subathon, or open the URL in another OBS or a browser tab, it starts a fresh timer.',
      },
      zero: {
        title: 'What happens when the timer reaches zero?',
        p1: 'It stops at 00:00:00 and blinks red, and the Health Bar and Ring styles show K.O. New subs no longer add time, so the subathon is over.',
        p2: 'To keep going, a mod types `!subathon add` or `!subathon set` with a time, and the timer runs again right away. To start a new subathon, type `!subathon reset`.',
      },
      change: {
        title: 'How do you change the timer or start a new subathon?',
        p1: 'Paste your current URL into the Widget URL field on the setup page. Your channels and settings come back; change what you want, copy the new URL and paste it over the old one in OBS. New time values and a new Time Limit apply as soon as OBS loads the new URL, and the time left stays as it was.',
        p2: 'A new Starting Time applies on its own only until the timer has started for the first time. After that, type `!subathon reset` in chat to start over from the new Starting Time. If Start is set to the command, the timer then waits paused again until `!subathon start`.',
      },
      notCounted: {
        title: "What doesn't add time?",
        follows:
          "Follows and donations. Twitch and Kick don't show new follows to a page that isn't logged in, and neither platform has donations of its own.",
        raids: 'Raids, on either platform.',
        resubs:
          "Twitch resubs the viewer doesn't share. Twitch only tells chat about a resub when the viewer shares it. Kick sends renewals as subs, so those count.",
        bits: 'Bits spent outside chat, like Power-ups. Only Bits cheered in chat count.',
        sharedChat:
          'Subs and cheers in a partner channel during a Twitch Shared Chat session. Only your own channel counts.',
      },
      ctaTitle: 'Set up your subathon timer',
      ctaText: 'Set the starting time and what each sub adds, copy the URL, add it to OBS.',
    },
    poll: {
      title: 'How to run a chat poll on Twitch and Kick',
      short: 'Run a chat poll',
      summary:
        'Putting a poll up with !poll, the ways viewers vote, one vote per viewer, stream delay, and what happens when time runs out or OBS closes.',
      lead: 'Chat Poll puts a poll on your stream that Twitch and Kick chat vote in by typing a number. Add the URL to OBS as a 640 × 560 Browser Source, then you or a mod types `!poll Question | A | B` in chat. No login and no bot: it reads your public chat.',
      setup: {
        title: 'How do you set up a chat poll?',
        step1: 'Open the [Chat Poll setup page](/setup/chat-poll).',
        step2: 'Pick Twitch, Kick or Both and type just the channel names.',
        step3:
          'If you want a poll ready before the stream, type a question and 2 to 6 options under Ready-Made Poll. It goes up with `!poll start`.',
        step4:
          'Set the Poll Length (1 minute by default), how long the results stay on screen and who can vote.',
        step5:
          'Pick a color, a position and the poll language, copy the URL and add it to OBS as a Browser Source at 640 × 560.',
        p1: 'The preview on the setup page plays a poll with simulated voters, faster than real time, then starts the next one. The Try it buttons add 10 votes, add 30 seconds, end the poll and start a new one. They only change the preview, never the poll in OBS.',
      },
      commands: {
        title: 'How do you start a poll from chat?',
        intro:
          "Only the broadcaster and moderators can run polls, on Twitch and on Kick. VIPs and viewers can't: a viewer typing `!poll` changes nothing.",
        caption: 'Chat Poll chat commands',
        colCommand: 'Command',
        colAction: 'What it does',
        question: 'Question',
        new: 'Puts up a new poll with 2 to 6 options, for the Poll Length in the URL',
        newTime: 'The same, with its own length: 90s, 2m, 1m30s or 1:30',
        yesNo: 'Puts up a quick poll with Yes and No as its options',
        start: 'Puts up the ready-made poll saved in the URL',
        extend: 'Adds time to an open poll that has a timer',
        end: 'Ends voting now; the winner shows after the Stream Delay',
        cancel: 'Takes the poll off the screen, results and all',
        p1: 'Split the question and the options with `|`. Options past the sixth are left out, and so are repeats, even in a different case. The question can be up to 80 characters and each option up to 30. A new poll replaces the one on screen.',
        p2: "A command word needs the right arguments: `!poll extend 30 seconds` does nothing instead of putting that up as a question. A plain number before the question isn't read as a length, so `!poll 3 or 4 games? | 3 | 4` keeps its question. The poll doesn't answer in chat; you see the result on screen.",
      },
      voting: {
        title: 'How do viewers vote?',
        number: 'The number of the option on its own, like `2`.',
        command: '`!vote 2` or `!2`, for viewers used to bot polls.',
        text: 'The option itself: `speedrun` votes for Speedrun, in any case and with or without accents or Turkish letters.',
        p1: "The whole message has to be the vote. `2 please`, `4Head` or `1 more game` don't count, so normal chat never turns into votes. When an option is a number itself, its text wins: in a poll of `3 | 4 | 5`, typing 3 votes for the option 3, not the third option.",
        p2: "Twitch's own `/vote` command is for Twitch's native polls, so tell chat to type the number. The poll shows a hint like \"Type 1 to 3 in chat\" under its options.",
      },
      rules: {
        title: 'Can a viewer vote more than once?',
        p1: "No. Every Twitch or Kick account counts once. With Viewers Can Change Their Vote on, which is the default, a new number moves the vote; turn it off and the first vote is final. A vote for an option that doesn't exist never costs a viewer the vote they already had.",
        p2: "With Who Can Vote set to Subscribers, only viewers with a sub or founder badge can vote, plus you. With everyone voting, A Sub Vote Counts makes a sub's vote count 2 or 3 times. The poll says so on screen, and the percentages use those weighted votes.",
        p3: 'If a mod times out or bans an account while the poll takes votes, its vote comes off, which helps undo a wave of spam bots.',
      },
      timing: {
        title: 'What happens when the time runs out?',
        p1: 'Viewers watch your stream a few seconds behind chat, so when their screen shows 1 second left, the poll has already closed in chat. Votes keep counting for the Stream Delay after the timer ends, 5 seconds by default, while the poll shows Last votes. Set it to how far behind your viewers are; Twitch and Kick are usually 2 to 10 seconds behind.',
        p2: 'Then the winner lights up in gold with a crown and the other options dim. When two or more options share the most votes, the poll calls it a tie. The results stay up for Results On Screen, 30 seconds by default, then the poll fades out. Set it to 0 to keep them up until the next poll or `!poll cancel`.',
        p3: 'With Poll Length at 0 the poll has no timer and stays open until a mod types `!poll end`. `!poll extend` only adds time to a poll that has a timer.',
      },
      look: {
        title: 'How can you change the way it looks?',
        blind:
          "Hide Results Until the End: the bars stay hidden while voting is open and only the vote count shows, so early votes don't sway the rest.",
        color: 'Color: purple (default), green, red, gold, cyan or pink.',
        position:
          'Position: the poll sits at the top or the bottom of the browser source and grows from there with the number of options.',
        language:
          'Poll Language: English or Turkish for the words on the poll, like Results and the Yes and No of a quick poll.',
        p1: 'With both platforms on, the poll shows how many votes came from Twitch and from Kick next to the total. The source is transparent, so only the poll card shows on stream.',
      },
      saved: {
        title: 'What happens if OBS closes or the source reloads?',
        p1: 'The poll and its votes are saved inside OBS, so a reload or an OBS restart brings it back where it was. The timer keeps running while OBS is closed.',
        p2: "Nothing reads your chat while OBS or the source is off, so votes typed in that time aren't counted. That's why \"Shutdown source when not visible\" should stay off; the [OBS guide](/guides/obs-browser-source) explains it. The saved poll belongs to that OBS and those channels.",
      },
      limits: {
        title: "What can't Chat Poll do?",
        chat: "Post in chat. It only reads chat, so it never announces the poll or the winner there; the poll on stream shows both.",
        native:
          "Show Twitch's or Kick's own polls. Twitch's can't be read without logging in, so to work the same on both platforms the votes come from chat.",
        points:
          'Take Channel Points or Bits votes. Every viewer has one vote, or 2 or 3 as a sub when you turn that on.',
        multiple: 'Multiple choice. Each viewer picks one option.',
      },
      ctaTitle: 'Set up your chat poll',
      ctaText: 'Put a ready-made poll and the voting rules in one URL, add it to OBS and type !poll in chat.',
    },
    frames: {
      title: 'How to add a frame to your camera, chat and screen in OBS',
      short: 'Add stream frames',
      summary:
        'Adding camera, chat and screen frames to OBS, source order, fitting your camera into the frame, and picking a preset and animations.',
      lead:
        "Stream Frames puts a ready-made frame around your camera, your chat or your whole stream screen, in the style of the preset you pick. Pick the piece and the preset on the setup page, add the URL to OBS as a Browser Source and place it over your camera or chat. The middle of the frame is transparent, and there's no channel to connect and no login.",
      setup: {
        title: 'How do you set up a stream frame?',
        step1: 'Open the [Stream Frames setup page](/setup/stream-frames).',
        step2:
          'Under What are you framing?, pick Camera, Chat or Screen. If you picked Camera, set Orientation to Landscape or Portrait. Each piece is its own Browser Source, so add all three if you like.',
        step3:
          'Pick a preset. With Classic you choose the color. The other presets come with their own colors, font and art.',
        step4:
          'Type your channel name or any word you like in the Label field. On camera and chat it shows on the tab above the frame, and on screen it shows on the plate at the bottom.',
        step5:
          'Copy the URL and add it to OBS as a Browser Source: 640 × 360 for a camera (360 × 640 for a portrait camera), 420 × 720 for chat, 1920 × 1080 for the screen.',
        p1:
          "The preview shows the frame with a person's silhouette or sample chat lines. Those are just placeholders. On stream the middle of the frame is empty.",
      },
      layers: {
        title: 'Why is the frame behind my camera?',
        p1:
          'In OBS, whatever is higher in the Sources list sits in front in the scene. Move the frame source above your camera (Video Capture Device) or Chat Box. You can also right-click the source and pick Order → Move to Top.',
        p2:
          'To move your camera and frame together, select both, right-click and pick Group Selected Items. When you resize the group, both scale together.',
        p3:
          'The screen frame should sit in front of the whole scene. Put it at the very top of the list so your game and other sources stay under it.',
      },
      fit: {
        title: 'How do you fit your camera into the frame?',
        intro:
          'The opening in the middle of the frame is a little smaller than its outer edge. Your camera should fill the opening but stay inside the outer edge, or the extra shows around the frame. At the recommended sizes, these fit well:',
        caption: 'Recommended frame sizes and the source that goes inside',
        colPiece: 'Piece',
        colFrame: 'Frame size',
        colInside: 'Source inside',
        camera: 'Landscape camera',
        cameraPortrait: 'Portrait camera',
        chat: 'Chat',
        screen: 'Screen',
        cameraInside: 'Camera at 590 × 296, centered on the frame',
        cameraPortraitInside: 'Camera at 306 × 572, centered on the frame',
        chatInside: 'Chat Box at 370 × 660, centered on the frame',
        screenInside: 'Game or screen capture fills the whole scene',
        p1:
          "A 16:9 camera scaled to 590 wide is 332 tall, so crop the top and bottom evenly until it's 296. Hold Alt (Option on Mac) and drag the top and bottom edges of the source, or right-click the camera and use the Crop fields in Transform → Edit Transform. For a portrait camera it's the other way around: a 9:16 camera scaled to 572 tall is 322 wide, so crop the left and right evenly until it's 306.",
        p2:
          'If you use a bigger frame, these sizes scale with it: in a 1280 × 720 camera frame the camera is 1180 × 592. For a square camera, set the Browser Source width and height to match and the frame is drawn to that shape.',
      },
      look: {
        title: 'What do the preset and animations change?',
        p1:
          "The preset sets the frame's shape, art, colors and font: a pagoda roof and tassels in Dynasty, gold trim and turquoise gems in Rift, grass blocks and a hotbar in Blocks. Give your Chat Box, Stream Alerts and Sub Goal the same preset and everything on screen matches.",
        p2:
          "With Animations on, light sweeps around the frame, the lines glow, and lanterns, torches or sparks move depending on the preset. They're kept light. Still, if your PC struggles while you game, turn Animations off. That adds `motion=0` to the URL and the frame stays still.",
        p3: 'All the art was drawn from scratch, with no game logos or artwork.',
      },
      change: {
        title: 'How do I change the frame later?',
        p1:
          'Paste the URL from OBS into the Widget URL field on the setup page and your settings come back. Change the preset, piece or label, copy the new URL and paste it over the old one in the Browser Source. To change the preset on all your widgets at once, use the [Presets page](/presets).',
      },
      ctaTitle: 'Set up your frame',
      ctaText: 'Pick the piece and the preset, check the preview, copy the URL.',
    },
    alerts: {
      title: 'How to add sub, cheer and raid alerts for Twitch and Kick in OBS',
      short: 'Add stream alerts',
      summary:
        'Which alerts each platform gets, themes and colors, minimum amounts, getting the sound into OBS, and why there are no follow alerts.',
      lead: 'Stream Alerts shows an animated alert with its own sound for every sub, gifted sub, Bits cheer, Kicks gift and raid on Twitch and Kick. Type your channel names on the setup page, pick a theme and add the URL to OBS as an 800 × 450 Browser Source. No login needed, and one URL covers both platforms.',
      setup: {
        title: 'How do you add stream alerts to OBS?',
        step1: 'Open the [Stream Alerts setup page](/setup/stream-alerts).',
        step2: 'Pick Twitch, Kick or Both and type just the channel names.',
        step3: "Pick a theme and a color, and turn off any alert you don't want.",
        step4:
          'Copy the URL and add it to OBS as a Browser Source at 800 × 450, then place it where alerts should appear.',
        step5:
          'Turn on Control audio via OBS in the source properties so the sound goes out on your stream. More on sound below.',
        p1: "Between alerts the source is empty and transparent. If you open the URL in a browser tab to check it, you'll see a blank page until something happens in your channel.",
        p2: 'To change it later, paste your current URL into the Widget URL field on the setup page. Your channels and settings come back; copy the new URL and paste it over the old one in OBS.',
      },
      kinds: {
        title: 'Which alerts are there?',
        caption: 'Stream Alerts events on Twitch and Kick',
        colAlert: 'Alert',
        sub: 'Subs',
        subTwitch: 'New subs and shared resubs, with the months and the message',
        subKick:
          'New subs and renewals, with the months when Kick sends them, and resubs shared in chat',
        gift: 'Gifted subs',
        giftBoth: 'One alert per gift, with the gifter and how many subs',
        bits: 'Bits & Kicks',
        bitsTwitch: 'Bits cheers, with the amount and the message',
        bitsKick: 'Kicks, with the amount and the message',
        raid: 'Raids',
        raidTwitch: 'The raiding channel and how many viewers came',
        raidKick: 'The raiding channel, and the viewers when Kick sends them',
        p1: "A gift of 50 subs is one alert, not 50, and the people who get the subs don't get alerts of their own. An anonymous gift shows Anonymous as the name. Tiers aren't shown: a Prime, Tier 1, Tier 2 or Tier 3 sub gets the same alert.",
        p2: 'Kick sends the months with most subs, but some channels never get them, and then the alert just says they subscribed. When a Kick viewer later shares their resub in chat, it gets its own alert with the months and the message, so one Kick resub can show up twice. On Twitch a resub only reaches chat when the viewer shares it, so it shows up once.',
        p3: "During a Twitch Shared Chat session, subs, gifts, cheers and raids in the partner channels don't show up. Only your own channel gets alerts.",
      },
      follows: {
        title: 'Why are there no follow or donation alerts?',
        p1: "Twitch and Kick don't show new follows to a page that isn't logged in, and neither platform has donations of its own. Stream Alerts only uses what both platforms send to every viewer, which is why it works without a login and the same way on both.",
      },
      look: {
        title: 'Which themes and colors are there?',
        neon: 'Neon (default): an angular sci-fi banner with synth sounds. When it leaves, it flickers like a neon sign.',
        celestial: 'Celestial: a navy card under the stars with a thin frame and bell chimes.',
        p1: "Color is the alert's accent. The default, Platform, shows Twitch alerts in purple and Kick alerts in green. You can also pick one color for every alert: blue, purple, pink, red, gold or green. When both channels are in the URL, a small TWITCH or KICK tag shows where each alert came from.",
        p2: "You can rename each alert's heading, up to 24 characters, or leave it empty to keep the default, like New Subscriber. Neon writes headings in capital letters. Alert Language sets the language of the alert's words, English or Turkish, and it stays in the URL whatever language OBS is in.",
      },
      min: {
        title: 'How do you skip small gifts, cheers and raids?',
        caption: 'Stream Alerts minimum amounts',
        colSetting: 'Setting',
        colDefault: 'Default',
        colRange: 'Range',
        gift: 'Min. Subs (gifted subs)',
        giftRange: '1 to 100,000',
        bits: 'Min. Amount (Bits or Kicks)',
        bitsRange: '1 to 100,000',
        raid: 'Min. Viewers (raids)',
        raidRange: '0 to 100,000',
        p1: 'Anything below the minimum gets no alert. One Min. Amount covers both Bits and Kicks, and subs have no minimum. If Kick sends a raid without a viewer count, it counts as 0 viewers, so a Min. Viewers of 1 or more skips it.',
      },
      queue: {
        title: 'What happens when many alerts come in at once?',
        p1: 'They wait their turn and show one at a time, in the order they came in, with a short pause between them. Time on Screen sets how long each one stays: 3 to 20 seconds, 7 by default. Up to 30 alerts can wait in line; if more pile up, the newest ones are skipped.',
        p2: 'Show Viewer Message, on by default, shows what the viewer wrote with their resub, Bits or Kicks. Links are taken out and long messages are cut short, so nobody can put a link on your stream.',
      },
      sound: {
        title: 'How do you get the alert sound into OBS?',
        step1:
          'Double-click the Stream Alerts source, check Control audio via OBS and click OK. The source now shows up in the Audio Mixer.',
        step2: 'Open Edit → Advanced Audio Properties from the top menu.',
        step3:
          'To hear the alerts yourself too, set Audio Monitoring for the source to Monitoring Enabled, called Monitor and Output in older OBS versions.',
        p1: 'Volume goes from 0 to 100, 50 by default, and 0 turns the sound off. Each alert has its own short sound that matches the theme: synths in Neon, bells in Celestial. OBS plays the sound on its own; in a regular browser tab the page stays silent until you click it once.',
      },
      test: {
        title: 'How do you test the alerts before going live?',
        p1: 'The preview on the setup page plays silent sample alerts. The Try it buttons under it play a sub, a gift, Bits/Kicks and a raid with sound at your current volume, so you can see and hear the theme before you pick it.',
        warnTitle: "The test buttons don't reach OBS",
        warn: "They only play in the preview on the setup page. The source in OBS only shows real subs, gifts, cheers and raids from your channel, so you can't send it a test alert.",
        p2: 'Keep the scene with the source active and leave "Shutdown source when not visible" off. Alerts that come in while the source is off are missed, and they aren\'t played later.',
      },
      ctaTitle: 'Set up Stream Alerts',
      ctaText: 'Type your channels, pick a theme, copy the URL. Your next sub gets an alert.',
    },
    reader: {
      title: 'How to read Twitch and Kick chat in one window or an OBS dock',
      short: 'Read chat in an OBS dock',
      summary:
        'Opening the Chat Reader, adding it to OBS as a dock, what happens when the connection drops, and how your chat survives a refresh.',
      lead: 'Chat Reader shows your Twitch and Kick chat in one list, in a browser tab or an OBS dock, so you can read it while you stream. Open it with the Open Chat Reader button on the Chat Box setup page. It reconnects on its own, marks every drop in the list and keeps your chat through a refresh.',
      open: {
        title: 'How do you open the Chat Reader?',
        step1:
          'Open the [Chat Box setup page](/setup/chat-widget) and type your Twitch channel, your Kick channel or both.',
        step2: 'Click Open Chat Reader under the Widget URL. The reader opens in a new tab.',
        step3: 'Bookmark the tab, or keep its address, to open the same reader next time.',
        p1: 'The reader takes the channels and a few Chat Box settings with it: emote providers, badges, Hide Bots, Hide Commands and Highlights. Font, layout, animation and the other looks stay with the overlay, and the reader has its own text size and time settings. To change the settings it took, change them on the setup page and open the reader again.',
      },
      dock: {
        title: 'How do you add the Chat Reader to OBS as a dock?',
        step1: 'Open the Chat Reader and copy the address from the address bar.',
        step2:
          "In OBS, open Docks → Custom Browser Docks from the top menu. In older versions it's under View → Docks.",
        step3: 'Type a name like Chat, paste the address into the URL column and click Apply.',
        step4: 'Drag the new dock wherever you want it in the OBS window.',
        p1: 'OBS has its own browser storage, so the dock keeps its own history and settings, separate from your regular browser.',
      },
      shows: {
        title: 'What does the Chat Reader show?',
        p1: 'Messages from both chats in one list, in the order they come in. When both channels are set, a Twitch or Kick icon shows where each message came from. Emotes, badges and username colors show the same way as in Chat Box.',
        p2: 'Deleted messages stay in the list, struck through and marked (deleted), so you can still see what was removed. When someone gets a timeout or a ban, their earlier messages are marked the same way. When a mod clears the chat, a line in the list says so.',
        p3: 'A- and A+ change the text size from 12 to 28 pixels, 15 by default. The clock button shows or hides message times, and the trash button clears the history after a second click. The reader remembers your text size and time setting.',
        p4: 'If you scroll up to read something, the list stops moving. A button at the bottom counts the new messages; click it to jump back to live chat.',
      },
      drops: {
        title: 'What happens when the connection drops?',
        p1: "Each channel has a status at the top: Connecting, Connected or Reconnecting, or Channel not found when a Kick name can't be found. When a chat connection drops, a notice counts down to the next try, and Retry now tries right away. Tries start 1 second apart and slow down to one every 30 seconds.",
        p2: "The reader also catches a connection that goes quiet without closing, which can happen after a network drop. If nothing comes in for 30 seconds, it checks whether the chat is still there and reconnects if there's no answer. If your computer goes offline, it tells you and reconnects as soon as the internet is back.",
        p3: 'Every drop is written into the list, like "Twitch chat connection lost" and "Back on Twitch chat after 12s", so you know exactly where messages may be missing.',
      },
      history: {
        title: 'Do you lose your chat when you refresh?',
        p1: 'No. The reader saves the last 1000 lines in your browser and brings them back when you open it again, followed by a line that says "Saved from your last visit, until" and the time. Lines older than 12 hours are dropped.',
        p2: "Messages sent while the reader was closed don't come back: everything above that line is from your last visit, everything below it is new. Each set of channels keeps its own history, and Clear history deletes it.",
      },
      limits: {
        title: "What can't the Chat Reader do?",
        send: "It can't send messages or moderate. It reads chat anonymously, like a viewer who isn't logged in.",
        events:
          "It doesn't show sub, gift or raid notices. For those, add [Stream Alerts](/setup/stream-alerts) to your stream.",
        missed: "It can't bring back messages sent while it was closed, on either platform.",
      },
      ctaTitle: 'Open the Chat Reader',
      ctaText: 'Type your channels on the Chat Box setup page and click Open Chat Reader.',
    },
  },
  presets: {
    classic: 'Classic',
    classicTag: "Each widget's own look",
    breadcrumb: 'Presets',
    eyebrow: 'Presets',
    title: 'Game presets for your stream overlays',
    lead:
      'Pick a preset and your Chat Box, Stream Alerts, Sub Goal, Subathon Timer, Chat Poll, Raffle winner and Stream Frames get the same frame, fonts and colors. Use one on every widget, or a different one on each.',
    pickTitle: 'Pick a preset',
    by: 'by {author}',
    community: 'Community',
    makeDefault: 'Use {name} on every widget',
    isDefault: '{name} is your default',
    defaultHint:
      'Every setup page on this browser starts with your default. You can still pick another preset on any widget.',
    previewTitle: '{name} on every widget',
    setUp: 'Set up {widget}',
    previewIframeTitle: '{widget} preview with the {name} preset',
    descriptions: {
      classic:
        'The look each widget was made with: neon Stream Alerts, the purple Sub Goal bar and plain Chat Box text. You pick the colors.',
      rift: 'Thin gold frames with diamond studs, deep navy panels and glowing teal bars, with Cinzel titles.',
      realm:
        'Bronze and gold frames with rivets, dark leather panels and legendary orange bars, with Marcellus titles.',
      dynasty:
        'Red lacquer frames with gold corner brackets, dark wood panels and crimson bars, with Zen Antique titles.',
      ancient: 'Dark iron frames with bronze corners, a red glow along the bottom and sharp Grenze titles.',
      agent: 'Cut corners, a red edge, slanted bars and tall Teko numbers on dark slate.',
      defuse: 'HUD corner brackets, an amber top line, hazard stripes on the bars and condensed Saira type.',
      blocks:
        'Pixel frames in grass and dirt colors, green bars split into blocks and the Jersey 10 pixel font.',
    },
    existingTitle: 'Already have widgets in OBS?',
    existingText:
      "Paste their URLs here, one per line, and copy them back with {name}. Then paste each one into its browser source's URL field in OBS. The rest of each URL stays the same.",
    existingLabel: 'Widget URLs',
    existingResult: 'Your URLs with {name}',
    existingUnsupported: "Doesn't take a preset, left as it was",
    existingInvalid: 'Not a Senchabot widget URL',
    communityTitle: 'Make your own preset',
    communityText:
      "A preset is one small JSON file: nine colors, two Google Fonts and a frame style. Send yours as a pull request on GitHub. Once it's merged, it shows up here and on every setup page with your name on it.",
    communityLink: 'How to make a preset',
    communityEmpty: 'No community presets yet. Yours could be the first.',
    disclaimer:
      "Game names are trademarks of their owners. These presets are fan-made color, font and drawing styles with no game art, and they aren't affiliated with or endorsed by the game makers.",
    faqTitle: 'Questions about presets',
    faq1Q: 'Do presets change widgets that are already in OBS?',
    faq1A:
      "No. A widget's look is part of its URL, so a widget in OBS keeps its look until it gets a new URL. Paste your URLs in the box above to get them back with the preset.",
    faq2Q: 'Can each widget have a different preset?',
    faq2A:
      "Yes. Your default is only where every setup page starts. On any widget's setup page you can pick another preset, and that widget's URL carries it.",
    faq3Q: 'Which widgets take a preset?',
    faq3A:
      'Chat Box, Stream Alerts, Sub Goal, Subathon Timer, Chat Poll, the Raffle winner overlay and Stream Frames. Emote Wall only shows emotes and Sub Sprout draws its own plants, so they keep their look.',
    faq4Q: 'Are these official game themes?',
    faq4A:
      "No. They're fan-made styles built from colors, free Google Fonts and decorations drawn from scratch, with no game logos or art, and they aren't affiliated with the game makers.",
    field: {
      label: 'Preset',
      tip: 'A ready-made look for this widget: its frame, fonts and colors. Pick the same preset on every widget to make them match.',
      browse: 'All presets',
      owns: 'Colors and fonts come from {name}.',
      makeDefault: 'Make {name} my default',
      makeDefaultTip: 'Every setup page on this browser will start with it.',
      isDefault: 'Your default',
    },
  },
  faqPage: {
    breadcrumb: 'FAQ',
    title: 'Frequently asked questions',
    lead: 'Quick answers about pricing, privacy, supported platforms and widget URLs for Senchabot Extensions. To set up a specific widget, check the [guides](/guides).',
    groups: {
      basics: 'Pricing and account',
      platforms: 'Software and platforms',
      urls: 'Your widget URL and privacy',
      help: 'Support',
    },
    freeQ: 'Is Senchabot Extensions free?',
    freeA:
      "Yes. All nine widgets and tools are free: Chat Box, Emote Wall, Sub Sprout, Subathon Timer, Stream Alerts, Sub Goal, Chat Poll, Raffle and OBS Bridge. There's no paid plan, watermark or premium account. The source code is open on GitHub under the GPL-3.0 license.",
    loginQ: 'What does "no login required" mean?',
    loginA:
      "You don't create an account on this site, you don't log in with Twitch or Kick, and you don't download anything. You type your channel name and the setup page gives you a URL. The widgets read public chat anonymously: on Twitch they connect like an anonymous viewer, and on Kick they listen to the public chat feed. That's why they can't post in chat, moderate, or access private info on your account.",
    affiliatedQ: 'Is Senchabot Extensions affiliated with Twitch or Kick?',
    affiliatedA:
      'No. Senchabot Extensions is made by Senchabot, an open source community bot for Twitch, Discord, Kick and YouTube. It has no official connection to, partnership with or endorsement from Twitch or Kick.',
    appsQ: 'Which streaming software does it work with?',
    appsA:
      'OBS Studio and any other streaming software that supports a browser source. Each widget runs as a web URL, and you paste that URL into the source. Our guides are written for OBS Studio.',
    platformsQ: 'Which widgets support Twitch and which support Kick?',
    platformsA:
      'All nine support both platforms. Chat Box, Emote Wall, Sub Sprout, Subathon Timer, Stream Alerts, Sub Goal and Chat Poll listen to a Twitch and a Kick channel together in one URL. OBS Bridge listens for commands from both chats, and each authorized user is added with their own platform. Raffle runs on one platform at a time, Twitch or Kick. In Chat Box, 7TV emotes show on both platforms, while BTTV and FFZ emotes show on Twitch only.',
    editQ: 'How do I change a widget later?',
    editA:
      "Change the settings on the setup page, copy the new URL, and paste it over the old one in the source's URL field in OBS. With Chat Box, Emote Wall, Sub Sprout, Subathon Timer, Stream Alerts, Sub Goal, Chat Poll and Stream Frames, if you paste your old URL into the Widget URL field on the setup page, all your settings come back and you don't have to start over.",
    oldUrlsQ: 'Will my old widget URLs keep working?',
    oldUrlsA:
      "Yes. Updates are made so existing URLs don't break: parameter names, values and defaults stay the same. For example, the old keep=true in Chat Box still means Forever, and Sub Sprout still reads the old channel and platform parameters.",
    privacyQ: 'Where are my settings stored, and where does my data go?',
    privacyA:
      'Your settings live inside the widget URL, not in an account or a database, so anyone who has the URL can open the same widget. Like any website, the page address you open reaches our hosting, and can show up in its request logs. The widgets read chat anonymously straight from Twitch and Kick, get emotes from 7TV, BetterTTV and FrankerFaceZ, and get Twitch channel info from ivr.fi. Raffle entries and winners stay in your own browser. The OBS Bridge URL contains your OBS WebSocket password, so treat it like a password.',
    emptyQ: 'Why does my widget look empty in OBS?',
    emptyA:
      "Chat Box and Emote Wall stay transparent and empty until something happens in chat, so send a message in chat first. If there's still nothing, make sure you typed just the channel name, not a link, in the channel field, and that the name is spelled right. The full checklist is in the OBS guide.",
    bugQ: 'How do I request a widget or report a bug?',
    bugA: 'Open a new issue in the senchabot-opensource/monorepo repository on GitHub. When reporting a bug, include the widget URL (remove the password if it has one), the streaming software you use, and what you see. For ideas, you can also use GitHub Discussions or the Senchabot Discord server.',
    ctaTitle: "Didn't find your answer?",
    ctaText:
      'The guides cover step-by-step setup and troubleshooting. Still stuck? Reach out to us on GitHub.',
    ctaGuides: 'Go to the guides',
    ctaIssue: 'Open an issue on GitHub',
  },
  changelog: {
    breadcrumb: 'Changelog',
    title: 'Changelog',
    lead: "New features and bug fixes in Senchabot Extensions, newest first. The list is put together from the project's commit history on [GitHub](https://github.com/senchabot-opensource/monorepo/commits/dev/apps/extensions).",
    site: 'Site',
    entries: {
      frames:
        'New Stream Frames: ready-made frames for your camera, your chat and your whole stream screen. Every preset comes with its own art, like a pagoda roof and lanterns in Dynasty or pixel blocks in Blocks.',
      subathonRates:
        'Subathon Timer can now list what a sub, a gifted sub and 500 Bits or Kicks add, right on the timer, so viewers know what their sub is worth.',
      presets:
        'New presets: one look for Chat Box, Stream Alerts, Sub Goal, Subathon Timer, Chat Poll and the Raffle winner, with game presets for League of Legends, World of Warcraft, Metin2, Dota 2, Valorant, CS2 and Minecraft.',
      poll: 'New Chat Poll: put up a poll from chat with !poll, and viewers on Twitch and Kick vote by typing a number. Live bars, a timer, one vote per viewer and the winner at the end.',
      goal: 'New Sub Goal: a goal bar that every sub, resub and gifted sub on Twitch and Kick fills by one, with a trophy when you reach it. Mods can fix the count with !goal.',
      streamAlerts:
        'New Stream Alerts: an animated alert with its own sound for every sub, gifted sub, Bits, Kicks and raid on Twitch and Kick. Pick a color, rename the headings and set minimum amounts.',
      subathon:
        'New Subathon Timer: a countdown that subs, gifted subs, Bits and Kicks push back, shown as a health bar, a clock or a ring. You pick how much time each one adds, and mods control it with !subathon.',
      chatReader:
        'New Chat Reader: read your Twitch and Kick chat in a browser tab or an OBS dock. It reconnects on its own with a countdown, marks every drop in the chat and keeps your history through a refresh.',
      chatSilentDrop:
        'Chat Box, Emote Wall and OBS Bridge notice when the chat connection goes quiet after an internet drop and reconnect by themselves, right away once the internet is back. Before, this could take minutes or need a refresh.',
      contentPages: 'New guides, an FAQ page and this changelog.',
      siteNav:
        'Every page has the same header and footer: the widget menu, language and theme pickers, and links to guides and support.',
      notFound: "Going to a URL that doesn't exist opens a 404 page with links to every widget.",
      geist: 'Site pages use Geist, the same font as senchabot.com. Overlay fonts stay the same.',
      chatNextSteps:
        'When you copy the Chat Box URL, the setup page shows the steps for adding it to OBS along with the recommended size.',
      raffleMonthsInput:
        'You can clear the Minimum Sub Months field in Raffle while typing, so typing 6 no longer turns into 16.',
      raffleKeywordRequired:
        "Raffle can't be started with an empty entry keyword anymore. Before, you could open a raffle nobody could enter.",
      raffleMonthsSubsOnly:
        'Minimum Sub Months only applies when Subscribers Only is on, and the broadcaster can enter their own raffle.',
      sproutPreviewSimulate:
        'The Sub Sprout setup preview keeps animating growth after you type a channel, so you see your chosen plant and effects right away.',
      sproutPreviewTint:
        'The Sub Sprout preview area shows its intended slightly transparent background instead of solid black.',
      emoteWallUrl:
        "Emote Wall setup no longer writes wrong values into the URL when the Duration and Max. fields are left empty, and it doesn't create URLs without a channel.",
      bridgePassword:
        'OBS Bridge sends the password even when the WebSocket URL is empty. Password-protected connections now work when OBS is on the same computer.',
      chatFilters:
        'Chat Box can hide bots and commands starting with !, keep messages anywhere from 10 seconds to 5 minutes or forever, and lets you pick emote providers one by one.',
      chatEmoteProviders:
        'Chat Box shows 7TV, BTTV and FFZ emotes in Twitch messages and 7TV emotes in Kick messages.',
      sproutKickGifts:
        'Sub Sprout grows with gifted subs on Kick, and every gifted sub counts as one stage.',
      bridgeUserPlatform:
        "OBS Bridge saves authorized users together with their platform. Someone who takes the same name on the other platform can't use commands anymore.",
      sevenTvActiveSet:
        "Chat Box and Emote Wall get 7TV emotes from the channel's own active set. Before, emotes from another account with a similar name could show up.",
      chatColorCrash:
        'Chat Box no longer crashes to an error screen on messages with an unusual color value.',
      bridgeReconnect:
        'OBS Bridge makes a single attempt every 5 seconds while OBS is closed or the password is wrong. Connection attempts no longer multiply.',
      raffleFakeEntries:
        "Raffle doesn't count fake lines hidden inside subscription messages as entries, so nobody can use them to get around Subscribers Only.",
      chatIrcParsing:
        "Text typed in chat can no longer wipe the Chat Box. A timeout or ban only removes that person's messages.",
      chatHighlights:
        'Chat Box highlights messages that tag you, replies, first-time chatters, announcements and Highlight My Message messages. You pick which ones are on during setup.',
      chatPasteUrl:
        'Pasting an existing widget URL into Chat Box setup restores all your settings.',
      chatSingleScreen:
        'The Chat Box setup page has a new layout that fits on one screen. Settings are grouped under Channel, Appearance and Messages.',
      chatIconAlign:
        'The Twitch and Kick icons in Chat Box are the same size and line up with each other.',
      chatHideIndicator:
        'Chat Box can hide the platform indicator completely when the color stripe is enough on its own.',
      chatSmoothSpeed:
        'Chat Box gets a Smooth slide from right animation, and the setup preview gets a chat speed setting.',
      chatAdaptiveAnimations:
        'Chat Box animations get shorter as chat speeds up. The default Slide from right looks the same as before.',
      chatTypewriter:
        'Chat Box gets a Typewriter animation. When a new message comes in, older messages slide over to make room instead of jumping.',
      chatPlatformStripe:
        "Chat Box platform icons are bigger, and you can add a stripe in the platform's color to the left of each message.",
      emoteWallModes:
        'Emote Wall gets a Bounce mode that bounces emotes off the edges, a hype-only mode and emote spam protection.',
      sproutPotLabel: 'Sub Sprout can show a stage label like 3/10 above the pot.',
      emoteWallLaunch:
        'Emote Wall is here: emote-only Twitch and Kick messages fly across the screen in Calm or Chaos mode.',
      sproutBothPlatforms:
        'Sub Sprout listens to a Twitch and a Kick channel together in one URL. Old channel and platform URLs keep working.',
      chatPreviewMock:
        'The Chat Box preview keeps playing sample chat after you type a channel, so you can see your settings without anyone chatting.',
      siteLanguages:
        'The site is available in Turkish and English, and you can switch between light and dark themes.',
      bridgeSceneCommand:
        'OBS Bridge gets a !scene command that switches to any scene with a matching name. You can also rename every command.',
      raffleBots: 'Raffle automatically ignores entries from known bots.',
      chatReadableColors:
        'Chat Box brightens username colors that are hard to read on a dark background, and message shadows are lighter.',
      chatBoldBadges:
        'Chat Box gets Bold Messages and an option to hide badges. Badges scale with the font size.',
      sproutWatering: 'Sub Sprout gets rain and sparkle watering effects.',
      chatItemBackground:
        'Chat Box gets a background box for each message and a bold username option. If the connection drops, it reconnects to chat on its own.',
      bridgeLaunch:
        'OBS Bridge is here: authorized users can switch to the BRB and Main scenes with chat commands, and start or stop the stream and recording.',
      chatFade: 'Chat Box gets a Fade in animation.',
      sproutVarieties:
        'Sub Sprout gets new plant varieties like rose, sunflower, cactus, tulip and lotus.',
      chatFontsLayouts:
        'Chat Box lets you pick the font, message layout and animation. Deleted messages and messages from banned users are removed from the overlay too.',
      raffleHardening:
        "Raffle draws the winner with a secure random pick, locks the rules once the raffle starts, and won't let you draw a winner before the Minimum Duration is up.",
      siteTutorial:
        'Setup pages link to a video tutorial. On the Raffle page, you can copy the overlay URL in one click.',
      chatPlatformPick: 'Chat Box lets you choose whether chat comes from Twitch, Kick or both.',
      chatSevenTv: 'Chat Box shows 7TV emotes.',
      chatTimestamp:
        'Chat Box lets you pick the platform name or icon and can show message timestamps.',
      siteSetupPages: 'A new home page is live, and every widget now has its own setup page.',
      raffleLaunch:
        'Raffle is here: viewers join by typing a keyword in chat, you can set a win limit per user, and the winner shows up on stream with confetti.',
      chatBgOpacity: 'The opacity of the Chat Box dark background is adjustable.',
      chatEmotesBadges: 'Chat Box shows Twitch emotes and both Twitch and Kick badges.',
      chatOrientation:
        'Chat Box also works horizontally, so you can place it as a bar along the bottom of the screen.',
      sitePreview: 'The setup page shows a live preview of the widget next to the settings.',
      sproutKick: 'Sub Sprout counts Kick subscriptions too.',
      launch:
        'Senchabot Extensions is live, with a chat box that combines Twitch and Kick chat and Sub Sprout, a plant that grows with Twitch subscriptions.',
    },
  },
};
