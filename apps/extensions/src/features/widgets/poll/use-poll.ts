import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type PollSettings, savedPoll } from '#/lib/poll-url';
import type { SubathonPlatform } from '../subathon/subathon-events';
import { useKickIds } from '../subathon/use-subathon';
import type { PollChatEvent } from './poll-chat';
import { KickPollSource, TwitchPollSource } from './poll-sources';
import {
  castVote,
  closedAt,
  createPoll,
  endPoll,
  extendPoll,
  fromSaved,
  type PollCommand,
  type PollPhase,
  type PollState,
  type PollTiming,
  parsePollCommand,
  parseVote,
  phaseOf,
  type Tally,
  takesVotes,
  tally,
  toSaved,
  voterKey,
} from './poll-state';

/** Storage key per channel pair, so every Chat Poll source for the channel shares one poll. */
export const storageKey = (twitch = '', kick = '') =>
  `senchabot.poll:${twitch.trim().toLowerCase()}:${kick.trim().toLowerCase()}`;

function loadPoll(key: string | null): PollState | null {
  if (!key) return null;
  try {
    return fromSaved(JSON.parse(window.localStorage.getItem(key) ?? 'null'));
  } catch {
    // Storage blocked or garbage: no poll.
    return null;
  }
}

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:poll-preview';
/** `preview` is the id in the preview's URL, so only the preview of the page that sent it acts. */
export type PreviewMessage = { type: 'event'; preview: string; event: PollChatEvent };

// A busy chat sends hundreds of votes a second: the bars redraw at most this often, and the poll
// is saved at most once a second.
const RENDER_EVERY_MS = 120;
const SAVE_EVERY_MS = 1000;
// A row glows on a new vote, at most this often, so a busy option glows instead of flickering.
const PULSE_EVERY_MS = 450;

// The preview squeezes a poll of any length into about this many seconds.
const SIM_POLL_SECONDS = 16;
// Results stay this long in the preview, whatever the setting, before the next poll starts.
const SIM_RESULTS_SECONDS = 7;
const SIM_NEXT_POLL_MS = 1200;
// After a test button, simulated votes hold off so the click's effect stands alone.
const SIM_QUIET_AFTER_TEST_MS = 6000;

export interface PollView {
  /** Tells one poll from the next. */
  id: number;
  question: string;
  options: string[];
  phase: Exclude<PollPhase, 'gone'>;
  tally: Tally;
  /** Timer left in ms; null for a poll without one. */
  left: number | null;
  /** Share of the timer left, 1 to 0; null without one. */
  timeShare: number | null;
}

type PollOptions = Omit<PollSettings, 'platforms'>;

interface UsePollOptions {
  twitch?: string;
  kick?: string;
  settings: PollOptions;
  /** Options of a "!poll Question" yes/no poll, in the overlay's language. */
  yesNo: readonly [string, string];
  /** What the preview plays when the settings hold no ready-made poll. */
  sample: { question: string; options: string[] };
  /** Preview mode: simulated votes on a fast clock, no chat and no saved poll. */
  simulate?: boolean;
  /** The only platform the preview simulates; both when unset. */
  simPlatform?: SubathonPlatform;
  /** Pairs the preview with its setup page's test buttons. */
  previewId?: string;
}

export function usePoll({
  twitch,
  kick,
  settings,
  yesNo,
  sample,
  simulate = false,
  simPlatform,
  previewId,
}: UsePollOptions) {
  const key = simulate ? null : storageKey(twitch, kick);
  const kickIds = useKickIds(kick, !simulate);
  // The preview runs its clock faster, so a poll of any length plays out in a few seconds.
  const [speed] = useState(() =>
    simulate && settings.duration > 0 ? Math.max(1, settings.duration / SIM_POLL_SECONDS) : 1,
  );
  const [clock] = useState(() => {
    const origin = Date.now();
    return () => origin + (Date.now() - origin) * speed;
  });
  const timing: PollTiming = {
    graceMs: settings.delay * 1000,
    holdMs: simulate ? SIM_RESULTS_SECONDS * 1000 * speed : settings.hold * 1000,
  };
  const optionsRef = useRef({ settings, timing, yesNo, sample });
  optionsRef.current = { settings, timing, yesNo, sample };

  const [initial] = useState(() => loadPoll(key));
  const pollRef = useRef<PollState | null>(initial);
  const [version, setVersion] = useState(0);
  const [now, setNow] = useState(clock);
  const [pulses, setPulses] = useState<number[]>([]);
  const renderTimer = useRef<number | null>(null);
  const saveTimer = useRef<number | null>(null);
  const lastPulseAt = useRef<number[]>([]);
  const lastTestAt = useRef(0);

  const save = useCallback(() => {
    if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
    saveTimer.current = null;
    if (!key) return;
    try {
      const poll = pollRef.current;
      if (poll) window.localStorage.setItem(key, JSON.stringify(toSaved(poll)));
      else window.localStorage.removeItem(key);
    } catch {
      // Storage blocked: the poll still runs, it just won't survive a reload.
    }
  }, [key]);

  /** Redraws and saves soon, for a vote. */
  const changed = useCallback(() => {
    if (renderTimer.current === null) {
      renderTimer.current = window.setTimeout(() => {
        renderTimer.current = null;
        setVersion((value) => value + 1);
      }, RENDER_EVERY_MS);
    }
    if (key && saveTimer.current === null)
      saveTimer.current = window.setTimeout(save, SAVE_EVERY_MS);
  }, [key, save]);

  /** Makes `next` the poll and shows and saves it right away, for a mod's command. */
  const setPoll = useCallback(
    (next: PollState | null) => {
      if (next?.startedAt !== pollRef.current?.startedAt) {
        lastPulseAt.current = [];
        setPulses([]);
      }
      pollRef.current = next;
      setNow(clock());
      setVersion((value) => value + 1);
      save();
    },
    [clock, save],
  );

  const runCommand = useCallback(
    (command: PollCommand) => {
      const time = clock();
      const poll = pollRef.current;
      const { settings, sample } = optionsRef.current;
      const start = (question: string, options: string[], ms: number | null) =>
        setPoll(createPoll(question, options, ms ?? settings.duration * 1000, time));
      switch (command.action) {
        case 'new':
          start(command.question, command.options, command.ms);
          return;
        case 'start': {
          const ready = savedPoll(settings) ?? (simulate ? sample : null);
          if (ready) start(ready.question, ready.options, command.ms);
          return;
        }
        case 'end':
          if (poll) setPoll(endPoll(poll, time));
          return;
        case 'extend':
          if (poll) setPoll(extendPoll(poll, command.ms, time));
          return;
        case 'cancel':
          setPoll(null);
          return;
      }
    },
    [clock, setPoll, simulate],
  );

  const pulse = useCallback((option: number) => {
    const at = Date.now();
    if (at - (lastPulseAt.current[option] ?? 0) < PULSE_EVERY_MS) return;
    lastPulseAt.current[option] = at;
    setPulses((list) => {
      const next = [...list];
      next[option] = (next[option] ?? 0) + 1;
      return next;
    });
  }, []);

  const handleEvent = useCallback(
    (event: PollChatEvent) => {
      const time = clock();
      const poll = pollRef.current;
      const { settings, timing, yesNo } = optionsRef.current;
      if (event.kind === 'ban') {
        // A timed out or banned account's vote goes, so a wave of spam bots can be undone.
        if (poll && takesVotes(poll, time, timing)) {
          if (poll.votes.delete(voterKey(event.platform, event.login))) changed();
        }
        return;
      }
      if (event.mod) {
        const command = parsePollCommand(event.text, yesNo);
        if (command) {
          runCommand(command);
          return;
        }
      }
      if (!poll || !takesVotes(poll, time, timing)) return;
      const option = parseVote(event.text, poll.options);
      if (option === null || (settings.subsOnly && !event.sub)) return;
      const vote = { option, weight: event.sub ? settings.subWeight : 1, platform: event.platform };
      if (castVote(poll, voterKey(event.platform, event.login), vote, settings.change)) {
        pulse(option);
        changed();
      }
    },
    [clock, changed, pulse, runCommand],
  );

  // Timers and a pending save don't outlive the overlay; the save is written out first.
  useEffect(
    () => () => {
      if (renderTimer.current !== null) window.clearTimeout(renderTimer.current);
      if (saveTimer.current !== null) save();
    },
    [save],
  );

  const poll = pollRef.current;
  const phase = poll ? phaseOf(poll, now, timing) : 'gone';

  // The countdown ticks while a poll is up; results only need to notice when to leave.
  useEffect(() => {
    if (phase === 'gone') return;
    const every = phase === 'open' || phase === 'closing' ? 250 : 1000;
    const timer = window.setInterval(() => setNow(clock()), every);
    return () => window.clearInterval(timer);
  }, [phase, clock]);

  // One effect per platform: a Kick lookup that lands later must not restart the Twitch reader.
  useEffect(() => {
    if (simulate || !twitch) return;
    const source = new TwitchPollSource(twitch, handleEvent);
    return () => source.disconnect();
  }, [simulate, twitch, handleEvent]);

  const chatroomId = kickIds?.chatroomId;
  useEffect(() => {
    if (simulate || !chatroomId) return;
    const source = new KickPollSource(chatroomId, handleEvent);
    return () => source.disconnect();
  }, [simulate, chatroomId, handleEvent]);

  // Preview: a poll with a stream of viewers voting, its results, then the next poll.
  useEffect(() => {
    if (!simulate) return;
    let timer: number;
    let viewer = 0;
    let goneAt: number | null = null;
    let lean: number[] = [];
    let leanFor = -1;
    const step = () => {
      const time = clock();
      const current = pollRef.current;
      const phase = current ? phaseOf(current, time, optionsRef.current.timing) : 'gone';
      if (!current || phase === 'gone') {
        goneAt ??= Date.now();
        if (Date.now() - goneAt >= SIM_NEXT_POLL_MS) {
          goneAt = null;
          runCommand({ action: 'start', ms: null });
        }
        timer = window.setTimeout(step, 200);
        return;
      }
      // A poll without a timer waits for a mod; in the preview that's after the usual length.
      if (current.endsAt === null && closedAt(current, time) === null) {
        if (time - current.startedAt >= SIM_POLL_SECONDS * 1000) runCommand({ action: 'end' });
      }
      const quiet = Date.now() - lastTestAt.current < SIM_QUIET_AFTER_TEST_MS;
      if (!quiet && (phase === 'open' || phase === 'closing')) {
        // Each poll leans its own way, so a winner shows, and now and then it's close.
        if (leanFor !== current.startedAt) {
          leanFor = current.startedAt;
          lean = current.options.map(() => 0.4 + Math.random());
        }
        let roll = Math.random() * lean.reduce((sum, weight) => sum + weight, 0);
        let option = 0;
        while (option < lean.length - 1 && roll >= lean[option]) roll -= lean[option++];
        // Now and then an earlier voter switches.
        const switcher = viewer > 5 && Math.random() < 0.1;
        const login = `viewer${switcher ? Math.floor(Math.random() * viewer) : viewer++}`;
        handleEvent({
          kind: 'message',
          platform: simPlatform ?? (Math.random() < 0.55 ? 'twitch' : 'kick'),
          login,
          text: String(option + 1),
          mod: false,
          sub: Math.random() < 0.3,
        });
      }
      timer = window.setTimeout(step, 120 + Math.random() * 320);
    };
    timer = window.setTimeout(step, 300);
    return () => window.clearTimeout(timer);
  }, [simulate, simPlatform, clock, runCommand, handleEvent]);

  useEffect(() => {
    if (!simulate || !previewId || typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channel.onmessage = ({ data }: MessageEvent<PreviewMessage>) => {
      if (data?.type !== 'event' || data.preview !== previewId) return;
      lastTestAt.current = Date.now();
      handleEvent(data.event);
    };
    return () => channel.close();
  }, [simulate, previewId, handleEvent]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: votes change the poll in place, and `version` counts those changes.
  const counted = useMemo(() => (poll ? tally(poll) : null), [poll, version]);

  let view: PollView | null = null;
  if (poll && counted && phase !== 'gone') {
    const length = poll.endsAt === null ? null : poll.endsAt - poll.startedAt;
    const left =
      poll.endsAt === null ? null : phase === 'open' ? Math.max(0, poll.endsAt - now) : 0;
    view = {
      id: poll.startedAt,
      question: poll.question,
      options: poll.options,
      phase,
      tally: counted,
      left,
      timeShare: length && left !== null ? Math.min(1, left / length) : null,
    };
  }
  return { view, pulses };
}
