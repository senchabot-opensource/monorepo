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
    playPreview: 'Play preview',
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
      faq: 'FAQ',
      senchabot: 'Senchabot',
      github: 'Source code on GitHub',
      switchWidget: 'Switch to another widget',
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
    heroBadge: '100% Free · No Login Required · Instant Browser Source Setup',
    heroTitle: 'Customizable Stream Overlays, Browser Sources & Tools',
    heroLead:
      'Configure customizable stream overlays, multi-chat widgets, subscriber goal plants, floating on-screen emotes, and streaming tools for Twitch & Kick. Zero login or download required.',
    sectionLabel: 'Available widgets',
    tagObsSource: 'OBS Browser Source',
    tagGiveaway: 'Giveaway Tool',
    tagControlTool: 'Stream Control Tool',
    cardSubSprout:
      'Interactive subscriber goal plants that grow with every new subscription on Twitch & Kick. Multiple plant varieties, watering animations, and customizable stream overlay effects.',
    cardChatBox:
      'A customizable multi-chat widget and stream chat box merging Twitch & Kick chat into one overlay. Supports 7TV emotes, sub badges, custom fonts, animations, and transparent backgrounds.',
    cardRaffle:
      'Run viewer giveaways via chat keyword (!join). Includes sub-only filter, anti-rigging timer, and a live OBS confetti celebration overlay.',
    cardObsBridge:
      'Control OBS from chat commands with custom trigger names. Let trusted mods switch to BRB/Main scenes, toggle recording, and manage your broadcast over local WebSocket.',
    cardAlerts:
      'Show Twitch and Kick follow, subscription, renewal, gift subscription, Cheer, and raid alerts in your stream.',
    cardEmoteWall:
      'Floating on-screen emotes for emote-only Twitch, Kick and 7TV chat messages. Calm mode drifts gently, Chaos mode zips across the screen.',
    openSetup: 'Open setup',
    noLoginHint: 'no login required',
    faqTitle: 'Frequently Asked Questions',
    faq1Q: 'Are these customizable stream overlays really 100% free?',
    faq1A:
      'Yes. There are no paywalls, watermarks, or premium accounts. All multi-chat widgets, subscriber goal plants, and stream overlays are completely free and open-source.',
    faq2Q: 'Do I need to sign in to use the multi-chat widget or chat box?',
    faq2A:
      'No sign-up or OAuth login required. Just type your channel name, copy the widget URL, and add it directly into OBS Studio.',
    faq3Q: 'Which streaming software is supported?',
    faq3A:
      'Works with OBS, Streamlabs Desktop, XSplit, vMix, Lightstream, or any software that supports browser sources.',
    faq4Q:
      'How do I add a chat widget or subscriber goal plant that supports multiple platforms to OBS Studio?',
    faq4A:
      'In OBS Studio, click + > Browser in your Sources panel, paste your generated widget URL, set your desired size (e.g. 800x600 for Sub Sprout or 400x600 for chat box), and click OK.',
    footerGithub: 'View on GitHub (Open Source)',
  },
  chatWidget: {
    breadcrumb: 'Chat Box Setup',
    title: 'Chat Box Setup',
    intro:
      'A customizable multi-chat widget and stream chat box overlay merging Twitch and Kick into a single feed with 7TV emotes and custom themes.',
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
      'Hides messages from common bots like Nightbot, StreamElements, Fossabot, BotRix and KickBot, plus Twitch accounts with the "Chat Bot" badge.',
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
    faq1Q: 'Do I need to sign in to Twitch or Kick to use the chat box?',
    faq1A:
      'No login is required. Chat Box listens anonymously to public chat streams for both platforms.',
    faq2Q: 'Does this multi-chat widget work with 7TV emotes?',
    faq2A:
      'Yes, 7TV channel and global emotes are fetched and rendered automatically in the chat box overlay for both Twitch and Kick.',
  },
  obsBridge: {
    breadcrumb: 'OBS Bridge Setup',
    title: 'OBS Bridge Setup',
    intro:
      'Control OBS Studio scenes and recording from chat commands issued by authorized users in your Twitch or Kick channel.',
    scenesNote:
      'Scenes are assigned on the tool page. After opening the tool, select your Main and BRB scenes, or switch to any scene anytime using !scene <name>.',
    twitchChannel: 'Twitch Channel (to listen in)',
    kickChannel: 'Kick Channel (to listen in)',
    authorizedUsers: 'Authorized Users',
    authorizedHint: 'Only these users can trigger OBS actions from chat, and only on the platform you picked for each.',
    userPlatform: 'Platform',
    customCommands: 'Custom Command Names',
    customCommandsHint:
      'Customize the chat trigger words for each action (e.g. change !scene to scene or !startstream to start).',
    cmdSceneLabel: 'Switch to Matching Scene',
    cmdBrbLabel: 'Switch to BRB Scene',
    cmdBackLabel: 'Switch to Main Scene',
    cmdStartStreamLabel: 'Start Streaming',
    cmdStopStreamLabel: 'Stop Streaming',
    cmdStartRecordLabel: 'Start Recording',
    cmdStopRecordLabel: 'Stop Recording',
    wsSettings: 'OBS WebSocket Settings',
    wsUrl: 'WebSocket URL',
    wsUrlHint:
      'Custom WebSocket URL if OBS is on a different machine. Defaults to ws://localhost:4455.',
    wsPassword: 'WebSocket Password',
    wsPasswordHint: 'Set in OBS → Tools → WebSocket Server Settings.',
    activeCommands: 'Active Chat Commands:',
    activeSceneCmd: '— Switch to matching scene (e.g. {cmd} Gaming)',
    activeBrbCmd: '— Switch to BRB scene',
    activeBackCmd: '— Switch to Main scene',
    activeStreamCmd: '— Toggle stream',
    activeRecordCmd: '— Toggle recording',
    previewTitle: 'Tool Preview',
    previewIframeTitle: 'OBS Bridge Preview',
    toolUrlHint:
      'Keep this URL open in a tab or add as a Browser Source / Custom Dock in OBS Studio or Streamlabs Desktop to keep the bridge active.',
    guideTitle: 'OBS Studio Setup',
    guideStep1: '1. Enable WebSocket Server under Tools > WebSocket Server Settings in OBS.',
    guideStep2:
      '2. Open your generated Tool URL in a browser tab or add as a Custom Browser Dock in OBS.',
    guideStep3:
      '3. Type !scene <name> in chat (e.g. !scene Gaming) to switch to any scene matching that name.',
    guideStep4: '4. You can also assign quick Main and BRB scenes in the tool interface.',
    faq1Q: 'How does the !scene chat command work?',
    faq1A:
      'When an authorized user sends !scene <name>, OBS Bridge searches your OBS scenes for an exact or partial case-insensitive name match and switches to that scene immediately.',
    faq2Q: 'Is my OBS WebSocket password secure?',
    faq2A:
      'Yes. The WebSocket connection runs directly between your browser and OBS Studio on your local machine. No credentials are sent to our servers.',
  },
  subSprout: {
    breadcrumb: 'Sub Sprout Setup',
    title: 'Sub Sprout — Subscriber Goal Plant Setup',
    intro:
      'A customizable subscriber goal plant overlay that levels up with every new subscription on Twitch or Kick.',
    platforms: 'Platforms',
    both: 'Both (Twitch & Kick)',
    twitch: 'Twitch',
    kick: 'Kick',
    twitchChannel: 'Twitch Channel',
    kickChannel: 'Kick Channel',
    growthOptions: 'Growth & Plant Options',
    plantVariety: 'Plant variety',
    stagesSuffix: '{stages} stages',
    selectionMode: 'Plant Changing',
    fixed: 'Same Plant',
    cycle: 'In Order',
    random: 'Random',
    fixedHint: 'Restarts the same plant after finishing.',
    cycleHint: 'Loops through plant varieties in order.',
    randomHint: 'Picks a random plant after each cycle.',
    wateringEffect: 'Watering effect',
    showSubCountEffect: 'Show sub count effect',
    subCountHint: '(e.g. {count} for gift bundles)',
    showPotLabel: 'Show stage label on the pot',
    potLabelHint: '(e.g. 3/10 for current stage and total stages)',
    advancedNotice: 'Advanced options enabled. Custom growth parameters enabled in widget URL.',
    previewTitle: 'Subscriber Goal Plant Preview',
    previewIframeTitle: 'Sub Sprout Preview',
    loadingPreview: 'Loading preview...',
    previewHintChannel: "Live preview — the plant grows with subs from {channel}'s chat.",
    previewHintNoChannel:
      'Enter a channel name to connect to live chat. Simulated subs shown in preview.',
    guideTitle: 'Streaming Software Setup (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      '1. Add a Browser Source in your streaming software (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: '2. Paste your copied subscriber goal plant URL.',
    guideStep3: '3. Set width to 800 and height to 600.',
    guideStep4: '4. Broadcasters & mods can type !grow in chat to trigger growth manually.',
    faq1Q: 'Do I need to sign in to use the subscriber goal plant?',
    faq1A:
      'No sign-up or OAuth login is needed. Sub Sprout connects anonymously via public chat event listeners.',
    faq2Q: 'What happens when the subscriber goal plant reaches full growth?',
    faq2A:
      'Once the plant finishes growing, the next subscription resets the plant according to your selection mode (restart the same plant, cycle to the next variety, or pick randomly).',
  },
  raffle: {
    breadcrumb: 'Raffle Setup',
    title: 'Raffle Setup',
    lockedTitle: 'Configuration locked',
    lockedDesc: 'Inputs locked while raffle is active. Click Reset All to start over.',
    intro:
      'Run chat giveaways with entry keywords (!join), sub-only mode, and live confetti winner celebrations.',
    platform: 'Platform',
    channelName: 'Channel Name',
    channelHint: 'Channel where the raffle chat command will be monitored.',
    entryKeyword: 'Entry Keyword',
    entryKeywordHint: 'Chat command viewers must type to enter the raffle.',
    subscribersOnly: 'Subscribers Only',
    subscribersOnlyHint: 'Only channel subscribers can enter.',
    minSubMonths: 'Minimum Sub Months',
    minSubMonthsHint: 'Require subscribers to have been subscribed for at least this many months.',
    maxWinsPerUser: 'Max Wins Per User',
    maxWins1: '1 win per user (prevent double win)',
    maxWins2: '2 wins per user',
    maxWins3: '3 wins per user',
    maxWins4: '4 wins per user',
    maxWins5: '5 wins per user',
    maxWinsUnlimited: 'Unlimited wins',
    maxWinsHint: 'Limit how many times a single user can win in this session.',
    minDuration: 'Minimum Duration (seconds)',
    minDurationHint:
      'Prevents ending the raffle too quickly. Countdown starts when the raffle starts.',
    resetConfig: 'Reset Configuration',
    startRaffle: 'Start Raffle',
    stopRaffle: 'Stop Raffle',
    drawWinner: 'Draw Winner ({count} eligible)',
    drawLocked: 'Draw Winner ({seconds}s lock)',
    lastWinner: 'Last Winner',
    resetEntries: 'Reset Entries',
    resetWinners: 'Reset Winners',
    resetAll: 'Reset All',
    winners: 'Winners ({count})',
    participants: 'Participants ({count})',
    noWinners: 'No winners yet.',
    noParticipants: 'No participants yet. Viewers type {keyword} in chat to enter.',
    disqualify: 'Disqualify/Remove entry',
    overlayUrl: 'Winner Celebration Overlay URL (OBS, Streamlabs, XSplit, etc.)',
    overlayUrlHint:
      'Paste this URL as a Browser Source in OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software that supports browser sources to display the confetti winner celebration on stream.',
    guideTitle: 'Streaming Software Winner Overlay Setup',
    guideBody:
      "Add /widgets/raffle-overlay as a Browser Source in OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software that supports browser sources. When you click Draw Winner, the overlay will trigger a confetti celebration with the winner's name on stream.",
    faq1Q: 'How is accidental double-winning prevented?',
    faq1A:
      'When a user is drawn as a winner, they are removed from the eligible pool and tracked in the winners list. If Max Wins Per User is set to 1, they cannot be drawn again in the same raffle session.',
    faq2Q: 'Can I disqualify suspicious entries or bots?',
    faq2A:
      "Known stream bots are automatically filtered out. Additionally, you can click the ✕ button next to any participant's name to disqualify them instantly.",
    winner: 'Winner!',
    subMonthsShort: '{months}mo',
  },
  tools: {
    title: 'OBS Bridge',
    connected: 'Connected',
    connecting: 'Connecting...',
    fetchingScenes: 'Fetching scene list...',
    notSelected: 'Not selected',
    obsWebSocket: 'OBS WebSocket',
    mainScene: 'Main Scene',
    brbScene: 'BRB Scene',
    obsScenes: 'OBS Scenes ({count})',
    assignMainBrbWarning:
      'Assign a Main and a BRB scene below so chat commands know which scenes to switch to.',
    assignMainWarning:
      'Assign a Main scene below so the back command knows which scene to switch to.',
    assignBrbWarning: 'Assign a BRB scene below so the brb command knows which scene to switch to.',
    main: 'Main',
    brb: 'BRB',
    assignHintClick: 'Click',
    assignHintOr: 'or',
    assignHintRest: 'next to a scene to assign it. Or switch to any scene using',
    commandUsers: 'Command Users ({count})',
    addUsername: 'Add username',
    userPlatform: 'Platform',
    pickPlatformWarning:
      "Twitch and Kick are both connected, so pick a platform for each yellow name. They can't run commands until you do.",
    add: 'Add',
    activeCommands: 'Active Chat Commands',
    cmdScene: 'Switch to Any Scene:',
    cmdBrb: 'Switch to BRB:',
    cmdBack: 'Switch to Main:',
    cmdStartStream: 'Start Stream:',
    cmdStopStream: 'Stop Stream:',
    cmdStartRecord: 'Start Record:',
    cmdStopRecord: 'Stop Record:',
    footer:
      'This page stays open to maintain the bridge connection. Any of the command users can control OBS via chat.',
  },
  alerts: {
    follow: 'New Follower!',
    sub: 'New Subscriber!',
    resub: 'Resubscription!',
    gift: 'Gift Subscription!',
    donate: 'Donation!',
    raid: 'Incoming Raid!',
    giftAmount: 'Gifted x{count} subscription{s}',
    resubMonths: '{months} months',
    raidViewers: '{viewers} viewers',
  },
  alertsSetup: {
    breadcrumb: 'Alerts Setup',
    title: 'Twitch & Kick Stream Alerts',
    intro:
      'Free customizable stream alerts for Twitch and Kick in a single unified overlay. Supports follows, new subscriptions, renewals, gift subscriptions, Cheers/bits, and raids.',
    addBotNotice:
      'To receive alerts, the Senchabot bot must be in your Twitch and Kick channel. Add it from senchabot.com.',
    platforms: 'Platforms',
    both: 'Both (Twitch & Kick)',
    twitch: 'Twitch',
    kick: 'Kick',
    twitchChannel: 'Twitch Channel',
    kickChannel: 'Kick Channel',
    glowEffect: 'Background Glow Effect',
    previewTitle: 'Alert Widget Preview',
    previewIframeTitle: 'Alerts Preview',
    previewHint: 'Live alert preview with animated notifications.',
    guideTitle: 'Streaming Software Alert Setup (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      '1. Add a Browser Source in your streaming software (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: '2. Paste your copied alerts widget URL.',
    guideStep3:
      '3. Set width and height (e.g. 1920×1080 for full canvas coverage, or 500×700 for a compact zone).',
    guideStep4:
      '4. Check "Shutdown source when not visible" and keep "Refresh browser when scene becomes active" unchecked.',
    browserSourceHintSize: ' (recommended size: 1920×1080 for full canvas or 500×700).',
    faq1Q: 'Can I use this widget for both Twitch and Kick at the same time?',
    faq1A:
      'Yes! Select "Both (Twitch & Kick)", enter your channels for each platform, and you will get a single browser source URL that handles alerts from both platforms simultaneously.',
    faq2Q: 'Do I need to log in or create an account?',
    faq2A:
      'No account or OAuth login is required. Senchabot connects directly via real-time events.',
    faq3Q: 'Which alert types are supported?',
    faq3A:
      'Follows, subscriptions (new & resub renewals), community/individual gift subscriptions, Cheers/bits donations, and incoming channel raids are all supported for both Twitch and Kick.',
  },
  emoteWallSetup: {
    breadcrumb: 'Emote Wall Setup',
    title: 'Emote Wall — Floating Emote Overlay',
    intro:
      'Show emote-only Twitch, Kick and 7TV chat messages as floating on-screen emotes. Pick Calm for emotes drifting at random spots, or Chaos for emotes zipping across the screen.',
    platforms: 'Platforms',
    both: 'Both (Twitch & Kick)',
    twitch: 'Twitch',
    kick: 'Kick',
    twitchChannel: 'Twitch Channel',
    kickChannel: 'Kick Channel',
    sevenTvEmotes: '7TV Emotes',
    subsOnly: 'Subscribers only',
    subsOnlyHint: 'Only emote messages from subscribers appear on screen.',
    subDurationX2: 'Subscriber emotes stay 2× longer',
    subDurationX2Hint: 'Emotes from subscribers stay visible twice as long.',
    showAllEmotes: 'Show emotes in messages too',
    showAllEmotesHint: 'Also show emotes found inside normal text messages, not just emote-only ones.',
    hypeMode: 'Hype mode only',
    hypeModeHint: 'Only show an emote after 2 or more users send it in different messages.',
    spamBlock: 'Block emote spam',
    spamBlockHint: 'Ignore emotes when one user floods the same emote or sends emote messages too rapidly.',
    mode: 'Animation Mode',
    modeCalm: 'Calm — pop up & drift',
    modeChaos: 'Chaos — zip across the screen',
    modeBounce: 'Bounce — ricochet off edges',
    modeCalmHint: 'Emotes pop up at random spots, drift gently, then fade out.',
    modeChaosHint:
      'Emotes zip in from random screen edges and vanish halfway or at the far side.',
    modeBounceHint:
      'Emotes bounce around like a screensaver and speed up with every edge hit.',
    emoteSize: 'Emote Size (px)',
    duration: 'Visible Duration (sec)',
    maxEmotes: 'Max Simultaneous Emotes',
    previewTitle: 'Emote Wall Preview',
    previewIframeTitle: 'Emote Wall Preview',
    previewHint: 'Live preview with floating on-screen emotes.',
    guideTitle: 'Streaming Software Setup (OBS, Streamlabs, XSplit, etc.)',
    guideStep1:
      '1. Add a Browser Source in your streaming software (OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, etc.).',
    guideStep2: '2. Paste your copied emote wall URL.',
    guideStep3:
      '3. Set width and height to your full canvas size (e.g. 1920×1080) and place it above your gameplay.',
    browserSourceHintSize: ' (recommended size: 1920×1080 full canvas).',
    faq1Q: 'Which messages trigger a floating emote?',
    faq1A:
      'Only messages containing nothing but emotes trigger a floating on-screen emote — e.g. a single Kappa, repeated emotes, or a mix of Twitch/Kick/7TV emotes. Normal text messages are ignored.',
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
      lead: "Each guide answers one question step by step: adding a widget to OBS, combining Twitch and Kick chat, running a chat raffle and switching scenes from chat. They all cover free tools that don't need a login.",
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
          raffle:
            "The winner overlay. Confetti bursts from both sides of the screen and the winner's name appears in the middle.",
          obsBridge: 'Not a visible overlay. Keep the tool open in a browser tab or an OBS dock.',
        },
        fontNote:
          "To make the Chat Box text bigger, don't stretch the source. Use the Font Size setting on the setup page: 8 to 72 pixels, 18 by default.",
      },
      transparent: {
        title: 'Do you need to do anything to make the background transparent?',
        p1: "No. Chat Box, Emote Wall, Sub Sprout and the Raffle overlay are drawn on a transparent background. You don't need a chroma key or a filter, and you can leave the Custom CSS field in OBS as it is.",
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
        p2: "With Chat Box you don't have to start over. Paste your current URL into the Widget URL field on the [setup page](/setup/chat-widget) and your channels and all your settings come back. Change what you want and copy the new URL.",
        p3: "For the other widgets, pick your settings again on the setup page and copy the new URL. Old URLs keep working, so you don't have to update them.",
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
          'Chat Box and Emote Wall stay completely empty and transparent until something happens in chat. Send a message in chat; for Emote Wall it has to be a message made only of emotes. The Raffle overlay also only appears when a winner is drawn and disappears after 10 seconds. Sub Sprout, on the other hand, shows the plant right away.',
        kickTitle: 'Kick channel not found?',
        kickBody:
          "When the widget opens, it looks up the Kick channel on kick.com. If that lookup fails (wrong name, the channel doesn't exist, or Kick doesn't respond), Kick messages won't come in. If the URL has no Twitch channel either, Chat Box and Emote Wall play sample content instead of real chat. If you see messages from names like Goku or Frieren in OBS, your Kick channel wasn't found. Type your Kick name exactly as it appears in the kick.com URL.",
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
        bots: 'Hide Bots removes messages from known bot accounts: Nightbot, StreamElements, Streamlabs, Moobot, Fossabot, Wizebot, Sery_Bot, SoundAlerts, StreamlootsBot, KofiStreamBot, PokemonCommunityGame, OWN3D, Blerp, BotRix, KickBot, Kicklet and Senchabot. Accounts with the "Chat Bot" badge on Twitch are hidden too. Kick has no bot badge, so there only this name list works.',
        commands:
          'Hide Commands hides every message that starts with "!", so commands like `!discord` or `!uptime` stay off your screen. To also hide what the bot replies to a command, turn on both settings.',
        highlights:
          "To do the opposite and make certain messages stand out, use Highlights. All five are on by default: messages that tag your channel or reply to you, the line above a reply that shows who's being replied to, first-time chatters, announcements, and messages sent with Highlight My Message. The last three are Twitch only, because Kick doesn't send that info.",
      },
      horizontal: {
        title: 'How do you put chat along the bottom of the screen as a bar?',
        p1: 'Set Orientation to Horizontal. Messages line up side by side, the newest one appears on the right, and older ones slide left out of the box.',
        p2: 'The 400 × 600 suggestion is for vertical use. For a horizontal bar, set the source width to the length of the bar and the height to a single line of messages, then place the source at the bottom of the screen.',
      },
      others: {
        title: 'Which other widgets listen to both platforms together?',
        p1: '[Emote Wall](/setup/emote-wall) and [Sub Sprout](/setup/sub-growing-plant) also take both channels in one URL. Emote Wall sends emote-only messages from both chats flying across the screen. Sub Sprout grows with subscriptions on both platforms, gifted subs on Kick included.',
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
        p1: "Settings lock when the raffle starts, so the rules can't change mid-raffle. To close entries, hit Stop Raffle; you can still draw a winner after stopping. Starting a new raffle clears the entry list, so the page asks you to confirm first.",
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
        maxWins: 'Max Wins Per User',
        maxWinsOptions: '1 to 5, or unlimited',
        maxWinsDefault: '1',
        minDuration: 'Minimum Duration',
        minDurationOptions: '0 to 300 seconds',
        minDurationDefault: '15 seconds',
        subsText:
          "With Subscribers Only on, anyone without a subscriber badge can't enter. The broadcaster counts as a subscriber too, so you can enter your own raffle. If Minimum Sub Months stays at 1, every subscriber can enter; set it to 6 and only people who have been subscribed for at least 6 months get in. On both Twitch and Kick, sub length is read from the viewer's subscriber badge.",
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
        p1: "`brb` and `back` are typed without an exclamation mark. Commands ignore case, but the whole message has to be the command: `brb` works, `brb 5 min` doesn't. You can rename any command under Custom Command Names on the setup page, for example `!switch` instead of `!scene`.",
        p2: 'The stop stream command really does end your stream. Keep the authorized list short.',
      },
      matching: {
        title: 'How does the !scene command find the right scene?',
        p1: 'It looks for an exact match first: `!scene game` switches to the scene named exactly "Game", ignoring case. Without an exact match, it picks the first scene with that word in its name: `!scene chatting` finds the "Just Chatting" scene. If no scene matches, nothing happens.',
        p2: 'If more than one scene contains the same word, the first match in the list OBS sends wins. With similarly named scenes, typing the full name is the safest bet. When you add or rename a scene, the list updates on its own.',
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
        p2: "OBS Bridge connects to OBS straight from your browser and doesn't store your password anywhere else.",
      },
      ctaTitle: 'Set up OBS Bridge',
      ctaText:
        'Enter your channel and authorized users, then open the tool URL. Scene commands start working right away.',
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
      "Yes. All five widgets and tools are free: Chat Box, Emote Wall, Sub Sprout, Raffle and OBS Bridge. There's no paid plan, watermark or premium account. The source code is open on GitHub under the GPL-3.0 license.",
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
      'All five support both platforms. Chat Box, Emote Wall and Sub Sprout listen to a Twitch and a Kick channel together in one URL. OBS Bridge listens for commands from both chats, and each authorized user is added with their own platform. Raffle runs on one platform at a time, Twitch or Kick. In Chat Box, 7TV emotes show on both platforms, while BTTV and FFZ emotes show on Twitch only.',
    editQ: 'How do I change a widget later?',
    editA:
      "Change the settings on the setup page, copy the new URL, and paste it over the old one in the source's URL field in OBS. With Chat Box, if you paste your old URL into the Widget URL field on the setup page, all your settings come back and you don't have to start over.",
    oldUrlsQ: 'Will my old widget URLs keep working?',
    oldUrlsA:
      "Yes. Updates are made so existing URLs don't break: parameter names, values and defaults stay the same. For example, the old keep=true in Chat Box still means Forever, and Sub Sprout still reads the old channel and platform parameters.",
    privacyQ: 'Where are my settings stored, and where does my data go?',
    privacyA:
      'Your settings live inside the widget URL; nothing is saved to an account or a server, and anyone who has the URL can open the same widget. The widgets read chat anonymously straight from Twitch and Kick, get emotes from 7TV, BetterTTV and FrankerFaceZ, and get Twitch channel info from ivr.fi. Raffle entries and winners stay in your own browser. The OBS Bridge URL contains your OBS WebSocket password, so treat it like a password.',
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
