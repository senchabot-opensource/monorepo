# Senchabot Extensions

Free, open-source customizable stream overlays, multi-chat widgets, and streaming tools for Twitch and Kick. Configure and embed overlays and tools into OBS Studio, Streamlabs Desktop, XSplit Broadcaster, vMix, Lightstream, PRISM Live Studio, Twitch Studio, Meld Studio, Wirecast, Ecamm Live, or any software that supports browser sources in seconds. No account or login required.

## What It Does

Senchabot Extensions provides 100% free streaming widgets, customizable overlays, and interactive tools for Twitch and Kick streamers. Each tool and overlay runs as a browser source that you can add to OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software supporting browser sources in seconds.

- **Sub Sprout** — A visual plant widget and subscriber goal overlay that grows with each subscription, resub, or gift sub. Resets after reaching full growth.
- **Subathon Timer** — A subathon countdown that subs, gifted subs, Bits and Kicks add time to, shown as a game-style health bar, a clock or a ring. Mods control it from chat.
- **Stream Alerts** — Animated alerts with their own sound for subs, gifted subs, Bits, Kicks and raids, in a Neon or a Celestial theme.
- **Sub Goal** — A goal bar that every sub, resub and gifted sub on Twitch and Kick fills by one, with a trophy when the goal is reached. Mods fix the count from chat.
- **Stream Frames** — Ready-made webcam, chat and screen frames drawn in the picked preset's look, transparent in the middle.
- **Stream Countdown** — A countdown for the starting soon, back soon and stream ending scenes, counting down a length or aiming at a time of day, in the picked preset's look.
- **Chat Poll** — A poll that Twitch and Kick chat vote in by typing a number, with live bars, a timer and the winner at the end. Mods run it from chat.
- **Universal Chat** — A multi-chat widget and stream chat box overlay that combines Twitch and Kick chat into a single on-screen feed with 7TV emotes, badges, and platform indicators.
- **Raffle Picker** — A chat-based giveaway and raffle tool. Viewers type a keyword to enter; winners are drawn and announced on a live confetti celebration overlay.
- **OBS Bridge** — A chat-controlled scene switching and stream control tool connecting over local OBS WebSocket.
- **Emote Wall** — A floating emote overlay that turns emote-only Twitch, Kick, and 7TV chat messages into floating on-screen emotes with Calm, Chaos or Bounce animations.

## Live URLs

- [extensions.senchabot.com](https://extensions.senchabot.com/) — Widget and tool hub
- [Sub Sprout](https://extensions.senchabot.com/setup/sub-growing-plant)
- [Subathon Timer](https://extensions.senchabot.com/setup/subathon-timer)
- [Stream Alerts](https://extensions.senchabot.com/setup/stream-alerts)
- [Sub Goal](https://extensions.senchabot.com/setup/sub-goal)
- [Stream Frames](https://extensions.senchabot.com/setup/stream-frames)
- [Stream Countdown](https://extensions.senchabot.com/setup/stream-countdown)
- [Chat Poll](https://extensions.senchabot.com/setup/chat-poll)
- [Universal Chat](https://extensions.senchabot.com/setup/chat-widget)
- [Raffle Picker](https://extensions.senchabot.com/setup/raffle)
- [OBS Bridge](https://extensions.senchabot.com/setup/obs-bridge)
- [Emote Wall](https://extensions.senchabot.com/setup/emote-wall)

## Widget & Tool Usage

### Sub Sprout (`/setup/sub-growing-plant`)

A visual SVG plant widget and subscriber goal overlay that grows in stages whenever a subscription event occurs.

**How it works:**
- Listens to Twitch subs/resubs/gift subs via tmi.js and Kick's Pusher WebSocket — supports both platforms simultaneously in a single browser source.
- 10 plant varieties (`classic`, `rose`, `sunflower`, `cactus`, `tulip`, `pine`, `lotus`, `lily`, `palm`, `vine`), each with multiple growth stages.
- When the plant reaches full growth, the next sub resets it according to the plant changing mode (`fixed`, `cycle`, `random`).
- Mods and the broadcaster can type `!grow` in chat to manually advance the plant, or `!grow reset` to start it over.
- The plant is saved in the browser source, so it survives an OBS reload and carries over to the next stream.

**Setup:**
1. Go to `/setup/sub-growing-plant`.
2. Select Twitch, Kick, or Both and enter your channel name(s).
3. Copy the generated widget URL.
4. Paste it into OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software supporting browser sources as a **Browser Source**.

You can also build the widget URL directly without the setup page:

```
https://extensions.senchabot.com/widgets/sub-sprout-widget?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&variety=classic&pick=fixed&water=off&countfx=1
```

**URL parameters:** `twitch`, `kick`, `variety`, `pick` (`fixed` | `cycle` | `random`), `water` (`off` | `rain` | `sparkle`), `countfx` (`0` | `1`), `potlabel` (`0` | `1`, stage text like `3/10` on the pot), `simulate` (`auto` | `1` | `0`). Older URLs using `channel` + `platform` still work.

---

### Subathon Timer (`/setup/subathon-timer`)

A subathon countdown overlay. It counts down in real time, and subs, gifted subs, Bits (Twitch) and Kicks (Kick) add time. At zero the subathon is over.

**How it works:**
- Listens to Twitch IRC anonymously and Kick's Pusher WebSocket, both in one browser source.
- Three styles (`bar` health bar, `clock`, `ring`) and health colors (green to red) or a fixed color.
- Separate times for Twitch and Kick: per sub, per gifted sub, and per 500 Bits or 500 Kicks. Any of them can be turned off. Twitch Tier 2 and 3 subs can count as 2 and 5 subs.
- The timer is saved in the browser source's `localStorage`, stored as its end time, so a reload or an OBS restart doesn't lose it.
- The broadcaster and mods control it from chat: `!subathon start`, `pause`, `add 10m`, `remove 5m`, `set 2h`, `reset`.

```
https://extensions.senchabot.com/widgets/subathon?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&style=bar&time=3600&tsub=60&ksub=60
```

**URL parameters** (times in seconds): `twitch`, `kick`, `style` (`bar` | `thin` | `clock` | `ring`), `color` (`hp` | `green` | `purple` | `red` | `gold` | `cyan` | `pink`), `title`, `time` (starting time), `cap` (0 = no limit), Twitch `tsub` (Tier 1 and Prime), `tgift`, `bits` (per 500), `tiers` (`0` | `1`), Kick `ksub`, `kgift`, `kicks` (per 500), `shift` (threshold for dynamic rates), `tsub2`, `tgift2`, `bits2`, `ksub2`, `kgift2`, `kicks2` (rates above threshold), `autostart` (`0` | `1`), `pct` (`0` | `1`), `pops` (`0` | `1`), `simulate` (`1` plays simulated subs), `simspeed`.

---

### Stream Alerts (`/setup/stream-alerts`)

An alert box overlay. A new sub, gifted subs, Bits (Twitch), Kicks (Kick) or a raid each get an animated alert with an icon and a short sound, one at a time.

**How it works:**
- Listens to Twitch IRC anonymously and Kick's Pusher WebSocket, both in one browser source.
- Two themes, each with its own look, animation and sounds: `neon` (an angular sci-fi banner, synth sounds) and `celestial` (a gold-line card under the stars, bell chimes). Colors follow the platform (Twitch purple, Kick green) or one fixed accent.
- Alerts queue up and show in order; a gift of many subs is a single alert. Every alert can be turned off, renamed, and gifts, cheers and raids can have a minimum.
- Resubs show their months, and a resub shared in chat shows the viewer's message (Twitch's resub message, Kick's chat celebration). Messages with Bits and Kicks can be shown too, always without links.
- On Kick the months come from a second sub event that can trail the first by a second, so a Kick sub without months waits 1.5 s for it. The sounds are made in the page with Web Audio, so there are no sound files.
- Follows and donations aren't included: neither platform shows them to a page that isn't logged in.

```
https://extensions.senchabot.com/widgets/stream-alerts?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&theme=neon&lang=en
```

**URL parameters:** `twitch`, `kick`, `theme` (`neon` | `celestial`), `color` (`platform` | `blue` | `purple` | `pink` | `red` | `gold` | `green`), `lang` (`en` | `tr`, the alert text), `sub`, `gift`, `bits`, `raid` (`0` turns an alert off), `hsub`, `hgift`, `hbits`, `hraid` (custom headings, up to 24 characters), `mingift`, `minbits`, `minraid` (minimum subs, Bits or Kicks, viewers), `dur` (seconds on screen, 3 to 20), `vol` (0 to 100), `msg` (`0` hides viewer messages), `simulate` (`1` plays sample alerts), `simplatform` (`twitch` | `kick`).

---

### Sub Goal (`/setup/sub-goal`)

A sub goal bar. Every new sub, resub and gifted sub from Twitch and Kick adds to one count, and a trophy lands on the bar when the goal is reached. The count keeps going past it.

**How it works:**
- Listens to Twitch IRC anonymously and Kick's Pusher WebSocket, both in one browser source.
- A sub or resub adds 1 (Prime and every tier alike) and a gift adds 1 per sub in it. Kick can't tell a new sub from a renewal on the client, so resubs count on both platforms. Twitch gift-sub continuations and Prime upgrades aren't counted: that person is already subscribed.
- Neither platform shows a channel's sub count to a page that isn't logged in, so the count starts at the number in the URL and is saved in the browser source's `localStorage`. A new starting count in the URL starts it over.
- The broadcaster and mods fix it from chat: `!goal add 3`, `remove 1` (the number defaults to 1), `set 25`, `reset`.

```
https://extensions.senchabot.com/widgets/goal?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&start=120&target=150
```

**URL parameters:** `twitch`, `kick`, `style` (`bar` | `thin`), `color` (`purple` | `green` | `red` | `gold` | `cyan` | `pink`), `title` (empty hides it), `start` (starting count), `target` (the goal, 1 or more), `pops` (`0` hides the rising +1s), `simulate` (`1` plays simulated subs), `simplatform` (`twitch` | `kick`).

---

### Stream Frames (`/setup/stream-frames`)

Ready-made frames for a webcam, a chat or the whole stream, drawn in the picked preset's look with its own shape, ornaments and small animations (a temple roof and swaying tassels in Dynasty, grass blocks and flickering torches in Blocks). The middle is transparent, so the webcam or Chat Box under it shows through.

**How it works:**
- Static SVG drawn for the browser source's size, so any webcam shape works; no chat connection.
- Each frame kind in `src/features/widgets/frame/art/` gives a silhouette (corners, tab, tray, wings; see `shape.ts`) and draws the plate, ornaments and animations on it. Colors come from the preset, so community presets on the same frame kind get the art too.
- Animations only move opacity and transform (no filters or masks), to stay light next to a game capture.

```
https://extensions.senchabot.com/widgets/frame?piece=camera&preset=dynasty&label=YOUR_NAME
```

**URL parameters:** `piece` (`camera` | `chat` | `screen`), `preset`, `color` (`purple` | `green` | `red` | `gold` | `cyan` | `pink`, classic only), `label` (tab or plate text, empty leaves it off), `motion` (`0` turns animations off), `demo` (`1` draws a stand-in webcam or chat).

---

### Stream Countdown (`/setup/stream-countdown`)

A countdown for the parts of a stream where nothing is happening yet: the minutes before going live, a break in the middle, and the last minutes before signing off.

**How it works:**
- Three scenes (`starting`, `break`, `ending`) that pick the default headline and icon. Your own headline, note and end message replace them.
- Counts down a length (`time`), or aims at a time of day (`at=21:00`) read from the clock of the computer running OBS. A time that has already passed today aims at tomorrow.
- The clock starts when the browser source loads, and nothing is saved. In OBS, tick "Refresh browser when scene becomes active" and the countdown starts over every time you switch to that scene.
- At zero it shows a message, holds 00:00, or hides itself (`end`).
- The look comes from the preset, with or without a panel (`look`), and an optional bar that empties with the time.
- No channel is needed. With one, the broadcaster and mods run `!countdown add 5m`, `remove 2m`, `set 10m`, `pause`, `start` and `reset` from Twitch or Kick chat. It shares the Subathon Timer's clock and duration parsing.

```
https://extensions.senchabot.com/widgets/countdown?scene=starting&time=600&preset=dynasty
```

**URL parameters:** `twitch`, `kick` (only for the chat commands), `scene` (`starting` | `break` | `ending`), `time` (seconds, 1 to 86400), `at` (a 24-hour time like `21:00`, replaces `time`), `title`, `done`, `note`, `end` (`text` | `hold` | `hide`), `look` (`card` | `plain`), `preset`, `color` (`purple` | `green` | `red` | `gold` | `cyan` | `pink`, classic only), `bar` (`0` hides it), `motion` (`0` turns animations off), `lang` (`en` | `tr`), `simulate` (`1` runs a fast countdown).

---

### Chat Poll (`/setup/chat-poll`)

A chat poll for Twitch and Kick. Mods put a poll up from chat, viewers vote by typing a number, and votes from both chats go into one result with live bars, a timer and the winner at the end.

**How it works:**
- Listens to Twitch IRC anonymously and Kick's Pusher WebSocket, both in one browser source. Twitch's and Kick's own polls aren't used: Twitch's can't be read without a login.
- The broadcaster and mods run it from chat: `!poll Question | A | B` (2 to 6 options), `!poll 2m Question | A | B` (its own length), `!poll Question?` (a Yes/No poll), `!poll start` (the ready-made poll from the URL), `!poll extend 30s`, `!poll end`, `!poll cancel`.
- A vote is the whole message: `2`, `!2`, `!vote 2` or an option's own text, in any case and with or without accents or Turkish letters. `4Head` or `2 please` don't count.
- One vote per account. With vote changing on, a new vote moves it; a vote for an option that doesn't exist keeps the old one. A timeout or ban while the poll is open takes the account's vote off.
- Viewers watch a few seconds behind chat, so votes keep counting for the stream delay (5 s by default) after the timer ends, then the winner shows.
- The poll and its votes are saved in the browser source's `localStorage` per channel pair, so a reload picks up where it was.

```
https://extensions.senchabot.com/widgets/poll?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&lang=en
```

**URL parameters:** `twitch`, `kick`, `q` (the ready-made poll's question), `o` (its options, split with `|`), `dur` (seconds a poll takes votes, `0` for no timer; default 60), `delay` (seconds late votes still count, 0 to 30; default 5), `hold` (seconds results stay up, `0` keeps them; default 30), `subs` (`1` lets only subscribers vote), `subx` (`2` or `3`: a sub's vote counts that many times), `change` (`0` makes the first vote final), `blind` (`1` hides the bars until voting ends), `color` (`purple` | `green` | `red` | `gold` | `cyan` | `pink`), `pos` (`top` | `bottom`), `lang` (`en` | `tr`), `simulate` (`1` plays simulated polls), `simplatform` (`twitch` | `kick`).

---

### Universal Chat (`/setup/chat-widget`)

A multi-chat widget and stream chat box overlay that combines Twitch and Kick chat into a single, cohesive on-screen overlay. Designed for streamers who multistream to both platforms.

**How it works:**
- Connects to Twitch IRC anonymously and Kick's Pusher WebSocket.
- Parses 7TV emotes, sub badges, and platform indicators for both services.
- Supports configurable font size, background opacity, themes, and vertical/horizontal layout.
- Messages auto-fade or stay pinned on-screen.

**Setup:**
1. Go to `/setup/chat-widget`.
2. Enter your Twitch channel and/or Kick channel.
3. Customize font size, background, opacity, and orientation.
4. Copy the generated URL into OBS Studio, Streamlabs Desktop, XSplit, or your preferred streaming software as a **Browser Source**.

---

### Raffle Picker (`/setup/raffle`)

A chat-based giveaway tool and raffle widget with a browser source overlay for winner announcements.

**How it works:**
- Monitors Twitch IRC or Kick Pusher for messages matching your configured keyword (default `!join`).
- Validates entry rules: sub-only mode, minimum sub months, max wins per user.
- When you draw a winner, a random participant is selected and broadcast to the overlay with `canvas-confetti` fireworks.
- The overlay shows the winner's name for 10 seconds, then hides.
- State persists in `localStorage` so you don't lose entries on refresh.

**Setup:**
1. Go to `/setup/raffle`.
2. Configure platform, channel, entry keyword, and restrictions.
3. Click **Start Raffle** to collect entries from chat.
4. Add `/widgets/raffle-overlay` to OBS Studio, Streamlabs Desktop, XSplit, or any software supporting browser sources as a **Browser Source** (usually centered or full-screen).
5. Click **Draw Winner** when ready.

---

### OBS Bridge (`/setup/obs-bridge`)

A local WebSocket bridge that lets streamers and moderators control OBS Studio scenes and recording directly from chat commands.

**How it works:**
- Connects directly to OBS Studio via WebSocket (`ws://localhost:4455`).
- Enables chat commands like `!scene <name>`, `brb`, `back`, `!startstream`, and `!startrecord`.
- Supports moderator/user whitelists and custom scene names.

**Setup:**
1. Go to `/setup/obs-bridge`.
2. Enter your channel and local OBS WebSocket port/password.
3. Keep the tool open in a tab or add as a Browser Source / Custom Dock in OBS Studio or Streamlabs Desktop.

---

### Emote Wall (`/setup/emote-wall`)

A floating emote overlay that turns emote-only Twitch, Kick, and 7TV chat messages into floating on-screen emotes. Normal text messages are ignored.

**How it works:**
- Connects to Twitch IRC anonymously and Kick's Pusher WebSocket — supports both platforms simultaneously in a single browser source.
- Detects emote-only messages: Twitch native emotes, Kick native `[emote:id:name]` tokens, 7TV channel emotes, and mixed messages.
- Three animation modes: `calm` (emotes pop up at random spots, drift, and fade out), `chaos` (emotes zip across the screen from random borders and vanish halfway or at the far side), and `bounce` (emotes ricochet off the screen edges and speed up with every hit).

**Setup:**
1. Go to `/setup/emote-wall`.
2. Enter your Twitch channel and/or Kick channel.
3. Pick Calm, Chaos or Bounce mode and customize size, duration, and max simultaneous emotes.
4. Copy the generated URL into OBS Studio, Streamlabs Desktop, XSplit, or your preferred streaming software as a full-canvas **Browser Source** (e.g. 1920×1080).

You can also build the widget URL directly without the setup page:

```
https://extensions.senchabot.com/widgets/emote-wall?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&mode=chaos
```

**URL parameters:** `twitch`, `kick`, `sevenTv` (`true` | `false`), `mode` (`calm` | `chaos` | `bounce`), `subsOnly` (`true` | `false`), `subDurationX2` (`true` | `false`, sub emotes stay 2x longer), `showAllEmotes` (`true` | `false`, also show emotes in normal messages), `hypeMode` (`true` | `false`, only show emotes doubled by 2+ users), `spamBlock` (`true` | `false`, default on, block same-user emote spam), `size` (32–256), `duration` (2–30 seconds), `max` (1–120), `mock` (`true` | `false`).

## Getting Started (Local Development)

```bash
npm install
npm run dev
```

The dev server runs on port 3000 by default.

## Building For Production

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/):

```bash
npm run test
```

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/):

```bash
npm run lint
npm run format
npm run check
```

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Project Structure

```
.
├── src/routes/
│   ├── index.tsx                   # Widget and tool hub landing page
│   ├── setup/
│   │   ├── sub-growing-plant.tsx   # Sub Sprout configuration
│   │   ├── subathon-timer.tsx      # Subathon Timer configuration
│   │   ├── stream-alerts.tsx       # Stream Alerts configuration
│   │   ├── sub-goal.tsx            # Sub Goal configuration
│   │   ├── stream-frames.tsx       # Stream Frames configuration
│   │   ├── stream-countdown.tsx    # Stream Countdown configuration
│   │   ├── chat-poll.tsx           # Chat Poll configuration
│   │   ├── chat-widget.tsx         # Universal Chat configuration
│   │   ├── raffle.tsx              # Raffle configuration
│   │   └── emote-wall.tsx          # Emote Wall configuration
│   └── widgets/
│       ├── sub-sprout-widget.tsx   # Sub Sprout overlay
│       ├── subathon.tsx            # Subathon Timer overlay
│       ├── stream-alerts.tsx       # Stream Alerts overlay
│       ├── goal.tsx                # Sub Goal overlay
│       ├── frame.tsx               # Stream Frames overlay
│       ├── countdown.tsx           # Stream Countdown overlay
│       ├── poll.tsx                # Chat Poll overlay
│       ├── chat-widget.tsx         # Universal Chat overlay
│       ├── raffle-overlay.tsx      # Raffle winner overlay
│       └── emote-wall.tsx          # Emote Wall overlay
├── src/features/widgets/           # Widget and tool logic and components
├── src/hooks/                      # Shared hooks (raffle state, chat connections)
├── src/styles.css                  # Tailwind CSS entry
└── vite.config.ts                  # Vite + TanStack Router config
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are auto-generated from files in `src/routes/`.

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md).
