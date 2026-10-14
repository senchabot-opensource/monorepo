# Senchabot Extensions

Free, open-source customizable stream overlays, multi-chat widgets, and streaming tools for Twitch and Kick. Configure and embed overlays and tools into OBS Studio, Streamlabs Desktop, XSplit Broadcaster, vMix, Lightstream, PRISM Live Studio, Twitch Studio, Meld Studio, Wirecast, Ecamm Live, or any software that supports browser sources in seconds. No account or login required.

## What It Does

Senchabot Extensions provides 100% free streaming widgets, customizable overlays, and interactive tools for Twitch and Kick streamers. Each tool and overlay runs as a browser source that you can add to OBS Studio, Streamlabs Desktop, XSplit, vMix, Lightstream, PRISM Live Studio, or any software supporting browser sources in seconds.

- **Sub Sprout** — A visual plant widget and subscriber goal overlay that grows with each subscription, resub, or gift sub. Resets after reaching full growth.
- **Subathon Timer** — A subathon countdown that subs, gifted subs, Bits and Kicks add time to, shown as a game-style health bar, a clock or a ring. Mods control it from chat.
- **Stream Alerts** — Animated alerts with their own sound for subs, gifted subs, Bits, Kicks and raids, in a Neon or a Celestial theme.
- **Sub Goal** — A goal bar that every sub, resub and gifted sub on Twitch and Kick fills by one, with a trophy when the goal is reached. Mods fix the count from chat.
- **Counter** — A count of wins, losses, jump scares or anything else, with up to four on screen. Mods change them from chat with commands like `!wins +1`.
- **Event List** — Your latest subs, resubs, gifted subs, Bits, Kicks and raids from Twitch and Kick in one list, newest on top or at the bottom, each row marked with its platform.
- **End Credits** — Movie-style end credits: everyone who subbed, gifted subs, cheered Bits or Kicks, raided, moderated or chatted on Twitch and Kick, rolling when the ending scene goes live.
- **Viewer Queue** — A play-with-viewers queue: viewers type !join in Twitch or Kick chat to get in line, and mods call the next ones up with !next.
- **Top Supporters** — A leaderboard of your top gifters or top Bits and Kicks givers from Twitch and Kick, or labels for the latest sub, gift, cheer and raid.
- **Lower Thirds** — An animated name and topic bar for a corner of the scene, with lines that take turns, always up or on a timer. Mods change it with !lt.
- **Task List** — A co-working task list: you and your viewers add tasks from Twitch or Kick chat with !task and tick them off with !done.
- **Featured Message** — Mods put a viewer's last message on screen with `!feature @name`, and viewers ask questions with `!q` that mods bring up one at a time.
- **Emote Combo** — When chatters on Twitch and Kick post the same emote, a big combo counter shows how many joined in.
- **Bits & Kicks Goal** — A goal bar that every Bits cheer and Kicks gift fills, with its own `!bitsgoal` command and count.
- **Now Playing** — The song you're listening to, with its cover art, from ListenBrainz (Spotify works through it) or Last.fm.
- **Stream Frames** — Ready-made webcam, chat and screen frames drawn in the picked preset's look, transparent in the middle.
- **Stream Countdown** — A countdown for the starting soon, back soon and stream ending scenes, counting down a length or aiming at a time of day, in the picked preset's look.
- **IRL HUD Overlay** — A game-style HUD for IRL streams: subs, gifted subs, Bits, Kicks and raids add cash to a Retro or Modern cash counter, under a clock in your time zone, next to a mini-map where an arrow walks a made-up city or park, or the real streets around a place you pick.
- **Weather** — Live weather for any place you pick, with an icon, the temperature, wind, humidity and a forecast for the coming hours or days. The data comes free from MET Norway, with no account or API key.
- **Chat Poll** — A poll that Twitch and Kick chat vote in by typing a number, with live bars, a timer and the winner at the end. Mods run it from chat.
- **Universal Chat** — A multi-chat widget and stream chat box overlay that combines Twitch and Kick chat into a single on-screen feed with 7TV emotes, badges, and platform indicators.
- **Raffle Picker** — A chat-based giveaway and raffle tool. Viewers type a keyword to enter; winners are drawn and announced on a live confetti celebration overlay.
- **OBS Bridge** — A chat-controlled scene switching and stream control tool connecting over local OBS WebSocket.
- **Spin Wheel** — A chat-driven spinning wheel. Viewers type !spin in Twitch or Kick chat and the wheel spins live in the OBS overlay, behind one global cooldown shown on screen.
- **Emote Wall** — A floating emote overlay that turns emote-only Twitch, Kick, and 7TV chat messages into floating on-screen emotes with Calm, Chaos, Bounce, Glide, Spin, Burst or Random animations.

## Live URLs

- [extensions.senchabot.com](https://extensions.senchabot.com/) — Widget and tool hub
- [Sub Sprout](https://extensions.senchabot.com/setup/sub-growing-plant)
- [Subathon Timer](https://extensions.senchabot.com/setup/subathon-timer)
- [Stream Alerts](https://extensions.senchabot.com/setup/stream-alerts)
- [Sub Goal](https://extensions.senchabot.com/setup/sub-goal)
- [Counter](https://extensions.senchabot.com/setup/counter)
- [Event List](https://extensions.senchabot.com/setup/event-list)
- [End Credits](https://extensions.senchabot.com/setup/end-credits)
- [Viewer Queue](https://extensions.senchabot.com/setup/viewer-queue)
- [Top Supporters](https://extensions.senchabot.com/setup/top-supporters)
- [Lower Thirds](https://extensions.senchabot.com/setup/lower-thirds)
- [Task List](https://extensions.senchabot.com/setup/task-list)
- [Featured Message](https://extensions.senchabot.com/setup/featured-message)
- [Emote Combo](https://extensions.senchabot.com/setup/emote-combo)
- [Bits & Kicks Goal](https://extensions.senchabot.com/setup/bits-goal)
- [Now Playing](https://extensions.senchabot.com/setup/now-playing)
- [Stream Frames](https://extensions.senchabot.com/setup/stream-frames)
- [Stream Countdown](https://extensions.senchabot.com/setup/stream-countdown)
- [IRL HUD Overlay](https://extensions.senchabot.com/setup/irl-hud)
- [Weather](https://extensions.senchabot.com/setup/weather)
- [Chat Poll](https://extensions.senchabot.com/setup/chat-poll)
- [Universal Chat](https://extensions.senchabot.com/setup/chat-widget)
- [Raffle Picker](https://extensions.senchabot.com/setup/raffle)
- [OBS Bridge](https://extensions.senchabot.com/setup/obs-bridge)
- [Spin Wheel](https://extensions.senchabot.com/setup/spin-wheel)
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
- On every heal, the heart — or the picked emoji or emote — flies from its spot to the bar's fill edge (bar and thin styles).

```
https://extensions.senchabot.com/widgets/subathon?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&style=bar&time=3600&tsub=60&ksub=60
```

**URL parameters** (times in seconds): `twitch`, `kick`, `style` (`bar` | `thin` | `clock` | `ring`), `color` (`hp` | `green` | `purple` | `red` | `gold` | `cyan` | `pink`), `title`, `icon` (an emoji instead of the heart), `iconUrl` (a channel emote image instead of the heart, picked on the setup page), `time` (starting time), `cap` (0 = no limit), Twitch `tsub` (Tier 1 and Prime), `tgift`, `bits` (per 500), `tiers` (`0` | `1`), Kick `ksub`, `kgift`, `kicks` (per 500), `shift` (threshold for dynamic rates), `tsub2`, `tgift2`, `bits2`, `ksub2`, `kgift2`, `kicks2` (rates above threshold), `autostart` (`0` | `1`), `pct` (`0` | `1`), `pops` (`0` | `1`), `simulate` (`1` plays simulated subs), `simspeed`.

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
 - When the goal is reached it stays up by default; `end` (`hide`) hides it after `endHold` seconds (0 hides it right away).
 - When one sub or gift completes the goal, the trophy names who filled it.
 - On every sub, the star — or the picked emoji or emote — flies from its spot to the bar's fill edge.

```
https://extensions.senchabot.com/widgets/goal?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&start=120&target=150
```

**URL parameters:** `twitch`, `kick`, `style` (`bar` | `thin`), `color` (`purple` | `green` | `red` | `gold` | `cyan` | `pink`), `title` (empty hides it), `icon` (an emoji instead of the star), `iconUrl` (a channel emote image instead of the star, picked on the setup page; it flies to the bar on every sub), `start` (starting count), `target` (the goal, 1 or more), `end` (`stay` | `hide`: what stays on screen once the goal is reached), `endHold` (seconds the completed goal stays up, 0 hides it right away), `pops` (`0` hides the rising +1s), `simulate` (`1` plays simulated subs), `simplatform` (`twitch` | `kick`).

---

### Counter (`/setup/counter`)

A count of wins, losses, jump scares or anything else a streamer keeps score of. One browser source shows up to four counters, side by side or stacked, and the broadcaster and mods change them from Twitch or Kick chat.

**How it works:**
- Listens to Twitch IRC anonymously and Kick's Pusher WebSocket, both in one browser source, and reads only the broadcaster's and mods' `!` messages. Viewers typing a command change nothing.
- Each counter has a label, an icon (an emoji, or a channel emote picked on the setup page), a starting count and its own chat command, `!wins` by default.
- The commands, for a counter on `!wins`: `!wins` or `!wins +` adds 1, `!wins +3` (`add 3`) adds 3, `!wins -` / `!wins -2` (`remove 2`) takes off, `!wins set 10` sets it and `!wins reset` goes back to the starting count. A bare number (`!wins 5`) does nothing, so a typo can't wipe the count. Counts never go below 0.
- Every count is saved in the browser source's `localStorage`, keyed by the channels and the command, so a reload or an OBS restart keeps it and other counters can be added or removed without losing it. A new starting count in the URL starts that counter over.
- A duplicate or empty command falls back to `count2`, `count3` and so on, so one command never moves two counters. The setup page warns when a command is also used by another widget (`!goal`, `!poll`, `!spin`, …).
- Takes a preset; `row` (800×260) puts the counters side by side, `stack` (440×400) one under another.

```
https://extensions.senchabot.com/widgets/counter?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&c1=Wins&c1cmd=wins&c1icon=%F0%9F%8F%86
```

**URL parameters:** `twitch`, `kick`, `c1` to `c4` (a counter's label, up to 24 characters, may be empty; no `c1` to `c4` at all shows a Wins counter), `c1cmd` to `c4cmd` (its command without the `!`: letters, digits and `_`, up to 20; the label when left out), `c1icon` to `c4icon` (an emoji or a few characters), `c1iconUrl` to `c4iconUrl` (a channel emote image instead of the icon, picked on the setup page), `c1start` to `c4start` (starting count, 0 by default), `layout` (`row` | `stack`), `pops` (`0` hides the rising +1 and −1), `preset`, `color` (`purple` | `green` | `red` | `gold` | `cyan` | `pink`, classic only), `simulate` (`1` counts on its own and saves nothing).

---

### Event List (`/setup/event-list`)

Your latest subs, resubs, gifted subs, Bits, Kicks and raids from Twitch and Kick in one list, newest on top or at the bottom, each row marked with its platform.

**How it works:**
- Listens to Twitch IRC anonymously and Kick's Pusher WebSocket, both in one browser source, through the same event readers as Stream Alerts.
- A row per sub (months on a resub), gift (subs in it), Bits on Twitch or Kicks on Kick, and raid (viewers). Kick's second sub event fills in the months of the row already shown.
- Follows and donations aren't included: neither platform shows them to a page that isn't logged in.
- The list is saved in the browser source's `localStorage`, so a reload keeps it. Mods clear it with `!events clear`.

```
https://extensions.senchabot.com/widgets/event-list?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&lang=en
```

**URL parameters:** `twitch`, `kick`, `sub`, `gift`, `bits`, `raid` (`0` hides that kind), `minbits` (fewest Bits or Kicks, 1 by default), `minraid` (fewest raid viewers), `rows` (3 to 10, 5 by default), `newest` (`top` | `bottom`), `fade` (seconds a row stays, 0 keeps it), `title` (above the list, none by default), `preset`, `color` (`platform` | `purple` | `green` | `red` | `gold` | `cyan` | `pink`, classic only), `lang`, `simulate`.

---

### End Credits (`/setup/end-credits`)

Movie-style end credits: everyone who subbed, gifted subs, cheered Bits or Kicks, raided, moderated or chatted on Twitch and Kick, rolling when the ending scene goes live.

**How it works:**
- Collects names while the browser source runs: subs, gifts, Bits and Kicks (biggest first), raiders, moderators and chatters from both chats. Bots and the broadcaster are left out of the chat list; a ban takes a viewer out.
- In OBS the roll starts when its scene goes live (OBS's `obsSourceActiveChanged` event) and stops when it leaves; in a browser tab it rolls at once. Keep "Shutdown source when not visible" off so it collects all stream.
- The names are saved in `localStorage`; after 12 hours without anything new the next stream starts empty. Mods use `!credits` (roll now), `!credits stop` and `!credits reset`.

```
https://extensions.senchabot.com/widgets/credits?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&title=Thanks%20for%20watching!&lang=en
```

**URL parameters:** `twitch`, `kick`, `title` (first line), `outro` (last line, none by default), `subs`, `gifts`, `cheers`, `raids`, `mods`, `chatters` (`0` leaves that section out), `speed` (`slow` | `normal` | `fast`), `loop` (`0` rolls once), `preset`, `color` (`gold` | `purple` | `green` | `red` | `cyan` | `pink`, classic only), `lang`, `simulate`.

---

### Viewer Queue (`/setup/viewer-queue`)

A play-with-viewers queue: viewers type !join in Twitch or Kick chat to get in line, and mods call the next ones up with !next.

**How it works:**
- Reads every message from both chats. Viewers join with the join word (`!join` by default) and an optional note, and leave with `!leave`; a ban takes them out.
- Mods: `!next` (calls up the group size) or `!next 3`, `!queue open`, `!queue close`, `!queue clear`, `!queue remove name`.
- Shows who's playing now, the numbered line and how many more are waiting. The queue is saved in `localStorage`.

```
https://extensions.senchabot.com/widgets/queue?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&title=Viewer%20Queue&lang=en
```

**URL parameters:** `twitch`, `kick`, `title`, `join` (the join word, `!join` by default), `subs` (`1` lets only subscribers join), `max` (most waiting, 0 for no limit), `rows` (names shown, 3 to 15), `group` (viewers per `!next`, 1 to 10), `preset`, `color` (`purple` | `green` | `red` | `gold` | `cyan` | `pink`, classic only), `lang`, `simulate`.

---

### Top Supporters (`/setup/top-supporters`)

A leaderboard of your top gifters or top Bits and Kicks givers from Twitch and Kick, or labels for the latest sub, gift, cheer and raid.

**How it works:**
- Counts gifted subs and Bits or Kicks per viewer from both chats (one Bit and one Kick count the same) and keeps the latest sub, gift, cheer and raid.
- Three boards: `gifts`, `cheers` and `latest`. The totals are saved in `localStorage` and keep counting from stream to stream until `!top reset`.

```
https://extensions.senchabot.com/widgets/leaderboard?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&board=gifts&title=Top%20Gifters&lang=en
```

**URL parameters:** `twitch`, `kick`, `board` (`gifts` | `cheers` | `latest`), `rows` (3 to 10 places), `title` (empty shows none), `preset`, `color` (`gold` | `purple` | `green` | `red` | `cyan` | `pink`, classic only), `lang`, `simulate`.

---

### Lower Thirds (`/setup/lower-thirds`)

An animated name and topic bar for a corner of the scene, with lines that take turns, always up or on a timer. Mods change it with !lt.

**How it works:**
- A title and up to 6 lines that take turns every few seconds. With a hold time the bar slides in and out on a timer; 0 keeps it up.
- No channel needed. With one, the broadcaster and mods use `!lt <text>` (a line of their own), `!lt clear`, `!lt hide` and `!lt show`.

```
https://extensions.senchabot.com/widgets/lower-third?title=YOUR_NAME&lines=Welcome%20to%20the%20stream!
```

**URL parameters:** `twitch`, `kick` (only for the chat commands), `title`, `lines` (joined with `|`, up to 6), `rotate` (seconds per line, 3 to 120), `hold` (seconds on screen, 0 keeps it up), `pause` (seconds away, 5 to 3600), `corner` (`bl` | `br` | `tl` | `tr`), `size` (50 to 200, percent), `preset`, `color` (`purple` | `green` | `red` | `gold` | `cyan` | `pink`, classic only), `simulate`.

---

### Task List (`/setup/task-list`)

A co-working task list: you and your viewers add tasks from Twitch or Kick chat with !task and tick them off with !done.

**How it works:**
- Everyone changes only their own tasks: `!task <text>`, `!done` (or `!done 2`), `!edit <text>`, `!remove`. Mods: `!tasks cleardone`, `!tasks remove name`, `!tasks clear`.
- The broadcaster's tasks come first; the panel shows done and total tasks, and a long list scrolls down and back up. The list is saved in `localStorage`.

```
https://extensions.senchabot.com/widgets/tasks?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&title=Today%27s%20Tasks&lang=en
```

**URL parameters:** `twitch`, `kick`, `title`, `max` (open tasks per viewer, 1 to 5), `done` (`0` takes finished tasks off at once), `speed` (scroll speed, 10 to 80 px a second), `preset`, `color` (`green` | `purple` | `red` | `gold` | `cyan` | `pink`, classic only), `lang`, `simulate`.

---

### Featured Message (`/setup/featured-message`)

Put a viewer's words on screen from Twitch or Kick chat: a featured message, or questions waiting in line for a Q&A.

**How it works:**
- `!feature @name` (mods and the broadcaster) shows that viewer's last message from either chat, with name color, badges and emotes, 7TV, BTTV and FFZ included. `!feature` or `!feature off` hides it. The last message of up to 500 chatters is kept in memory; bots, replies and commands aren't.
- Viewers ask with `!q <question>` (up to 200 characters, one open question each; asking again replaces it). Mods: `!q next` shows the oldest, `!q skip` drops it, `!q clear` empties the line, `!q off` hides what's on screen.
- A ban, a timeout or a deleted message takes that viewer's message and questions off. The line and what's on screen are saved in `localStorage`.

```
https://extensions.senchabot.com/widgets/featured?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&lang=en
```

**URL parameters:** `twitch`, `kick`, `mode` (`both` | `feature` | `qa`), `hide` (seconds on screen, 0 keeps it up, up to 600), `waiting` (`0` hides the questions-waiting badge), `size` (50 to 150, percent), `preset`, `color` (`purple` | `green` | `red` | `gold` | `cyan` | `pink`, classic only), `lang`, `simulate`.

---

### Emote Combo (`/setup/emote-combo`)

When chatters post the same emote, a big combo counter shows the emote and how many joined in, Twitch and Kick together.

**How it works:**
- Each chatter counts once per combo, in any message with the emote. The combo shows from `min` chatters and keeps going while new chatters join within `window` seconds; then the final count stays up a moment and fades.
- Native Twitch and Kick emotes count per platform; 7TV, BTTV and FFZ emotes count by name, so the same 7TV emote in both chats makes one combo. Known bots don't count.
- The stream's best combo shows under the counter and is saved in `localStorage` for 12 hours. Mods clear it with `!combo reset`.

```
https://extensions.senchabot.com/widgets/emote-combo?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&lang=en
```

**URL parameters:** `twitch`, `kick`, `window` (3 to 30 seconds), `min` (2 to 20 chatters), `size` (50 to 150, percent), `best` (`0` hides the best combo), `sevenTv`, `bttv`, `ffz` (`0` | `1`, which emote sets count; 7TV is on by default), `preset`, `color` (`gold` | `purple` | `green` | `red` | `cyan` | `pink`, classic only), `lang`, `simulate`.

---

### Bits & Kicks Goal (`/setup/bits-goal`)

A goal bar that every Twitch Bits cheer and Kick Kicks gift fills, with a trophy when the target lands.

**How it works:**
- The Sub Goal overlay with `type=bits`: Bits and Kicks add their amount 1:1 (both are about a US cent each); subs, gift subs and raids add nothing. Pops show the amount, and the trophy names whoever crossed the target.
- Its own count, saved in `localStorage` apart from the Sub Goal's, and its own command: `!bitsgoal`, with the same actions as the Sub Goal's `!goal`. A Sub Goal and a Bits & Kicks Goal run side by side on the same channels.

```
https://extensions.senchabot.com/widgets/goal?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&type=bits
```

**URL parameters:** the Sub Goal's, plus `type` (`bits`). The target starts at 1000 and the title at BITS & KICKS GOAL.

---

### Now Playing (`/setup/now-playing`)

The song you're listening to right now, with its cover art, title and artist. It reads no chat, so it works the same for Twitch and Kick streamers.

**How it works:**
- `source=listenbrainz` (the default) asks ListenBrainz's public playing-now API, which needs no key. Connect Spotify in ListenBrainz, or use any scrobbler that sends playing-now. Covers come from the Cover Art Archive when the song has a release ID.
- `source=lastfm` asks Last.fm for the recent tracks, which update almost at once. It needs a Last.fm API key built into the site (`VITE_LASTFM_API_KEY` at build time); without one, the setup page offers ListenBrainz only.
- The overlay asks every 12 seconds and backs off while a service is busy. When the music stops, the card dims, then slides out after `hide` seconds.

```
https://extensions.senchabot.com/widgets/now-playing?user=YOUR_LISTENBRAINZ_USERNAME&lang=en
```

**URL parameters:** `source` (`listenbrainz` | `lastfm`), `user`, `layout` (`card` | `pill`), `art` (`0` hides the cover), `album` (`0` hides the album line), `hide` (seconds before it slides out when nothing plays, 0 keeps it up dimmed, up to 60), `preset`, `color` (`green` | `purple` | `red` | `gold` | `cyan` | `pink`, classic only), `lang`, `demo`.

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
- Four purposes (`starting`, `break`, `ending`, `pomodoro`) that pick the default headline and icon. Your own headline, note, end message and a custom icon per scene (an emoji, a few characters, or one of the channels' subscriber emotes from the setup page picker) replace them.
- Counts down a length (`time`), or aims at a time of day (`at=21:00`) read from the clock of the computer running OBS. A time that has already passed today aims at tomorrow.
- The clock starts when the browser source loads, and nothing is saved. In OBS, tick "Refresh browser when scene becomes active" and the countdown starts over every time you switch to that scene.
- At zero it shows a message, holds 00:00, or hides itself (`end`). The message hides itself after `doneHold` seconds (10 by default, 0 keeps it up).
- The look comes from the preset, with or without a panel (`look`), and an optional bar that empties with the time.
- No channel is needed. With one, the broadcaster and mods run `!countdown {scene} [duration] [headline] [| note]` (defaults to 10m), `add 5m`, `remove 2m`, `set 10m`, `pause`, `start`, `reset`, `cancel` (stops and hides it until the next command), `title <headline>` and `note <note>` from Twitch or Kick chat (`!cd` works wherever `!countdown` does). It shares the Subathon Timer's clock and duration parsing.

```
https://extensions.senchabot.com/widgets/countdown?scene=starting&time=600&preset=dynasty
```

**URL parameters:** `twitch`, `kick` (only for the chat commands), `scene` (`starting` | `break` | `ending` | `pomodoro`), `time` (seconds, 1 to 86400), `at` (a 24-hour time like `21:00`, replaces `time`), `title`, `done`, `doneHold` (seconds the message at zero stays up, 10 by default, 0 keeps it up), `note`, `iconStarting`, `iconBreak`, `iconEnding`, `iconPomodoro` (an emoji or a few characters instead of that scene's icon), `iconUrlStarting`, `iconUrlBreak`, `iconUrlEnding`, `iconUrlPomodoro` (a channel emote image instead of that scene's icon, picked on the setup page), `end` (`text` | `hold` | `hide`), `look` (`card` | `plain`), `preset`, `color` (`purple` | `green` | `red` | `gold` | `cyan` | `pink`, classic only), `bar` (`0` hides it), `motion` (`0` turns animations off), `lang` (`en` | `tr`), `simulate` (`1` runs a fast countdown).

---

### IRL HUD Overlay (`/setup/irl-hud`)

A game-style HUD overlay made for IRL streams. Subs, gifted subs, Bits (Twitch), Kicks (Kick) and raids add the dollar amounts you set, and the cash counter rolls up to the new amount.

**How it works:**
- Listens to Twitch IRC anonymously and Kick's Pusher WebSocket, both in one browser source, through the same event readers as the Subathon Timer.
- Two styles: `retro` (green `$00000350` under a grey clock in a thick outline, round mini-map) and `modern` (white `$1,250` with a soft shadow, gains in green, rounded square mini-map). The font is Anton from Google Fonts.
- Separate dollar amounts for Twitch and Kick: per sub, per gifted sub, per 100 Bits or 100 Kicks, and per raider. Any of them can be turned off. Twitch Tier 2 and 3 subs can count as 2 and 5 subs.
- The clock shows the OBS computer's time, or a picked IANA time zone for OBS running on a cloud server or at home.
- The mini-map shows an arrow walking streets or paths and turning at the corners, with the map turning under it. It draws a made-up city (`urban`) or park (`park`), seeded by the channel name, or the real streets, paths, buildings, parks and water within about 350 m of a saved place (`real`, starting at the first one), from OpenStreetMap data (© OpenStreetMap contributors). On a real place the walk prefers footpaths and stays within about 140 m of it. The overlay asks the Overpass API once per place and keeps the result in `localStorage` for 14 days, with a radar sweep turning on the mini-map while it loads; the setup page finds places with Nominatim, on an explicit search only, or takes pasted coordinates.
- The cash is saved in the browser source's `localStorage`, keyed by channel, so a reload or an OBS restart doesn't lose it.
- The broadcaster and mods change the cash from chat: `!hud cash +500` (`add 500`), `-200` (`remove 200`, can go into a red debt), `10000` (`set 10000`) and `reset`. `!hud money` works the same. They switch the mini-map with `!hud map <name>` for a saved place, `!hud map urban` or `!hud map park` for the made-up maps, and `!hud map reset` for the one in the URL; the choice is saved in OBS until the URL's starting map changes. `!hud walk`, `!hud run` and `!hud stay` (or `stop`) set how the arrow moves. On the made-up maps, `!hud indoor` (or `inside`) takes the arrow into the building nearest it (a stand-in one in the park), where it walks around within the walls while the map zooms in on the building and dims the rest; `!hud outdoor` (or `outside`) walks it back to the nearest street. Indoors is saved in OBS too. A real place stays outdoors while the arrow walks around a picked spot, since which real building it walks into isn't the streamer's to pick: there the command does nothing, and switching to one leaves the building. The real building outlines are kept for a GPS feed (`arrowSource="gps"` on the widget): with the arrow at a real position it goes into the real building there, and stays outdoors where there's none, with no stand-in.
- A market: items with prices set on the setup page. `!hud buy water` (or `!hud buy water 3`) takes the price off the cash and shows it with the item's name; without enough cash nothing is bought and the price shows with a cross.
- Every command also works in short, `!h` in place of `!hud`: `!h cash +500`, `!h map park1`, `!h walk`.
- A plain `!h map`, `!h cash` (or `money`) and `!h time` (or `clock`) hide that part of the HUD, and the same command shows it again; the part fades out where it stands, and the choice is saved in OBS. `!h weather` does the same for the Weather overlay when it has the channel.
- The cash and the mini-map are sized for the browser source's short side and anchored to their corners, so a vertical IRL canvas works too.

```
https://extensions.senchabot.com/widgets/irl-hud?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&style=retro&tz=Europe/Istanbul
```

**URL parameters:** `twitch`, `kick`, `style` (`retro` | `modern`), `corner` (`tr` | `tl` | `br` | `bl`), `size` (50 to 200, percent), `start` (starting cash), Twitch `tsub` (Tier 1 and Prime), `tgift`, `bits` (per 100), `traid` (per raider), `tiers` (`0` | `1`), Kick `ksub`, `kgift`, `kicks` (per 100), `kraid` (per raider), `clock` (`0` | `1`), `h12` (`0` | `1`), `tz` (IANA time zone), `radar` (`0` | `1`), `radarCorner` (`tr` | `tl` | `br` | `bl`), `map` (`urban` | `park` | `real`), `places` (saved places as `name:lat,lon` joined by `;`, up to 10; older URLs with `lat` and `lon` read as one place named `place1`), `move` (`walk` | `run` | `stay`), `items` (market items as `name:price` joined by `;`, up to 20), `pops` (`0` | `1`), `simulate` (`1` plays simulated subs).

---

### Weather (`/setup/weather`)

Live weather for any place you pick: an icon, the temperature and the weather in words, with wind, humidity and a forecast for the coming hours or days. It needs no channel. With one (`twitch`, `kick`), you and your mods hide it and show it again from chat with `!h weather` (or `!hud weather`, the IRL HUD Overlay's command), saved in OBS.

**How it works:**
- The data is MET Norway's [Locationforecast](https://api.met.no/weatherapi/locationforecast/2.0/documentation) (the Norwegian Meteorological Institute): free, no key, under CC BY 4.0, so the overlay credits MET Norway in small print. The browser source asks MET straight from the page with a plain GET (no custom headers, so no CORS preflight), which MET's terms allow for low-volume sites; the page's `Origin` identifies it.
- It asks again when MET's `Expires` header says, kept between 10 minutes and an hour, and saves the forecast in `localStorage`, so a reload or a scene switch shows the weather at once without asking early. Network errors and 5xx/429 retry with backoff; a refusal (4xx) waits half an hour. A forecast older than a day isn't shown as "now".
- MET's 41 weather symbols are read into 14 conditions with their own words in every language, and drawn as one SVG icon built from parts: the sun or moon, clouds, rain, sleet, snow, lightning and fog.
- The forecast row shows every third hour on the local clock, or today and the next three days with highs and lows and the 6-hour symbol closest to noon. Hours and days follow a picked IANA time zone, or the OBS computer's.
- The setup page finds the place with OpenStreetMap's Nominatim, on an explicit search only (the IRL HUD Overlay's search), or takes pasted coordinates. Coordinates are written with at most 4 decimals, as MET asks. The overlay shows only the name you give the place.
- A card or a one-line pill on a dark, light or no panel, in a corner of a 1920x1080 scene, sized for the source's short side so a vertical canvas works too. The font is Outfit from Google Fonts.

```
https://extensions.senchabot.com/widgets/weather?lat=41.0082&lon=28.9784&place=Istanbul&lang=en
```

**URL parameters:** `twitch`, `kick` (optional, only for `!h weather`), `lat`, `lon` (the place; nothing shows without them), `place` (the name shown, up to 40 characters), `units` (`metric` | `imperial`), `layout` (`card` | `pill`), `theme` (`dark` | `light` | `clear`), `corner` (`tr` | `tl` | `br` | `bl`, `tl` by default), `size` (50 to 200, percent), `details` (`0` hides wind and humidity), `forecast` (`hours` | `days` | `off`), `h12` (`1` shows 3 PM instead of 15:00), `tz` (IANA time zone), `lang` (`en` | `de` | `es` | `fr` | `ja` | `pt` | `tr`), `demo` (`1` shows sample weather without asking MET).

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

### Spin Wheel (`/setup/spin-wheel`)

A chat-driven spinning wheel for game names, challenges or any list of choices. Viewers type `!spin` in Twitch or Kick chat; the wheel spins live in the OBS overlay at 800×800.

**How it works:**
- Type one option per line. The wheel updates as you type, up to 100 slices.
- Start a line with `2x`, `3x`, … for extra slices: `2x Tetris` wins twice as often.
- Connects to Twitch IRC anonymously and Kick's Pusher WebSocket — supports both platforms simultaneously in a single browser source.
- `!spin` spins the wheel. Who may spin is a setting: everyone, subs only, or mods only (mods and the broadcaster can always spin).
- One global cooldown for the whole chat (30 seconds by default, 0 turns it off). While it runs, the overlay counts the wait down on screen and new `!spin` messages are skipped.
- The winner is picked with the browser's secure random number generator and lands with a spinning animation, tick sounds, a victory jingle and confetti.
- Options, channels, permission and cooldown all live in the overlay URL. Paste it back on the setup page to edit it.
- With a preset (`preset` in the URL), the wheel's rim, slices and labels, the winner card and the cooldown note take the preset's colors, fonts and frame.
- **Two colors** paints the slices in two colors, taking turns: the classic orange and purple, or the preset's accent and panel color. It's on by default with a preset; `colors=2` turns it on in the classic look and `colors=all` turns it off with a preset.
- The quick tool at `/tools/spin-wheel` still spins a separate browser-only list with no channel.

**Setup:**
1. Go to `/setup/spin-wheel`.
2. Enter your Twitch and/or Kick channel.
3. Type your options, one per line.
4. Pick who can spin and the cooldown between spins.
5. Copy the overlay URL and add it as a **Browser Source** in OBS Studio, Streamlabs Desktop, XSplit, or your preferred streaming software (800×800).

---

### Emote Wall (`/setup/emote-wall`)

A floating emote overlay that turns emote-only Twitch, Kick, and 7TV chat messages into floating on-screen emotes. Normal text messages are ignored.

**How it works:**
- Connects to Twitch IRC anonymously and Kick's Pusher WebSocket — supports both platforms simultaneously in a single browser source.
- Detects emote-only messages: Twitch native emotes, Kick native `[emote:id:name]` tokens, 7TV channel emotes, and mixed messages.
- Seven animation modes: `calm` (emotes pop up at random spots, drift, and fade out), `chaos` (emotes zip across the screen from random borders and vanish halfway or at the far side), `bounce` (emotes ricochet off the screen edges and speed up with every hit), `glide` (emotes drift down from the top of the screen, swaying side to side, and fade out near the bottom), `spin` (emotes fade in at a random spot, spin around once or twice, then fade out), `burst` (emotes appear and pop into fragments and sparks before their time ends), and `random` (every emote gets a random animation).

**Setup:**
1. Go to `/setup/emote-wall`.
2. Enter your Twitch channel and/or Kick channel.
3. Pick Calm, Chaos, Bounce, Glide, Spin, Burst or Random mode and customize size, duration, and max simultaneous emotes.
4. Copy the generated URL into OBS Studio, Streamlabs Desktop, XSplit, or your preferred streaming software as a full-canvas **Browser Source** (e.g. 1920×1080).

You can also build the widget URL directly without the setup page:

```
https://extensions.senchabot.com/widgets/emote-wall?twitch=YOUR_TWITCH_CHANNEL&kick=YOUR_KICK_CHANNEL&mode=chaos
```

**URL parameters:** `twitch`, `kick`, `sevenTv` (`true` | `false`), `mode` (`calm` | `chaos` | `bounce` | `glide` | `spin` | `burst` | `random`), `subsOnly` (`true` | `false`), `subDurationX2` (`true` | `false`, sub emotes stay 2x longer), `showAllEmotes` (`true` | `false`, also show emotes in normal messages), `hypeMode` (`true` | `false`, only show emotes doubled by 2+ users), `spamBlock` (`true` | `false`, default on, block same-user emote spam), `subEmotes` (`true` | `false`, only the channels' subscriber emotes), `size` (32–256), `duration` (2–30 seconds), `max` (1–120), `mock` (`true` | `false`).

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
│   │   ├── counter.tsx             # Counter configuration
│   │   ├── event-list.tsx          # Event List configuration
│   │   ├── end-credits.tsx         # End Credits configuration
│   │   ├── viewer-queue.tsx        # Viewer Queue configuration
│   │   ├── top-supporters.tsx      # Top Supporters configuration
│   │   ├── lower-thirds.tsx        # Lower Thirds configuration
│   │   ├── task-list.tsx           # Task List configuration
│   │   ├── featured-message.tsx    # Featured Message configuration
│   │   ├── emote-combo.tsx         # Emote Combo configuration
│   │   ├── bits-goal.tsx           # Bits & Kicks Goal configuration
│   │   ├── now-playing.tsx         # Now Playing configuration
│   │   ├── stream-frames.tsx       # Stream Frames configuration
│   │   ├── stream-countdown.tsx    # Stream Countdown configuration
│   │   ├── irl-hud.tsx             # IRL HUD Overlay configuration
│   │   ├── weather.tsx             # Weather configuration
│   │   ├── chat-poll.tsx           # Chat Poll configuration
│   │   ├── chat-widget.tsx         # Universal Chat configuration
│   │   ├── raffle.tsx              # Raffle configuration
│   │   └── emote-wall.tsx          # Emote Wall configuration
│   └── widgets/
│       ├── sub-sprout-widget.tsx   # Sub Sprout overlay
│       ├── subathon.tsx            # Subathon Timer overlay
│       ├── stream-alerts.tsx       # Stream Alerts overlay
│       ├── goal.tsx                # Sub Goal overlay
│       ├── counter.tsx             # Counter overlay
│       ├── event-list.tsx          # Event List overlay
│       ├── credits.tsx             # End Credits overlay
│       ├── queue.tsx               # Viewer Queue overlay
│       ├── leaderboard.tsx         # Top Supporters overlay
│       ├── lower-third.tsx         # Lower Thirds overlay
│       ├── tasks.tsx               # Task List overlay
│       ├── featured.tsx            # Featured Message overlay
│       ├── emote-combo.tsx         # Emote Combo overlay
│       ├── now-playing.tsx         # Now Playing overlay
│       ├── frame.tsx               # Stream Frames overlay
│       ├── countdown.tsx           # Stream Countdown overlay
│       ├── irl-hud.tsx             # IRL HUD Overlay
│       ├── weather.tsx             # Weather overlay
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
