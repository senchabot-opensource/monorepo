import { useCallback, useEffect, useRef, useState } from 'react';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import type { CountdownSettings } from '#/lib/countdown-url';
import {
  applyCommand,
  type ClockOptions,
  healthOf,
  isEnded,
  timeLeft,
} from '../subathon/subathon-timer';
import { useSubEvents } from '../subathon/use-sub-events';
import {
  COMMAND,
  type CountdownState,
  countdownOptions,
  parseCountdownCommand,
  startCountdown,
} from './countdown-clock';

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:countdown-preview';
/** `preview` is the id in the preview's URL, so only the preview of the page that sent it plays it. */
export type PreviewMessage =
  | { type: 'command'; preview: string; text: string }
  | { type: 'toggle'; preview: string };

const LIVE_TICK_MS = 250;
const SIM_TICK_MS = 100;
/** The preview runs the countdown out in about this long, whatever time it is set to. */
const SIM_DRAIN_MS = 20_000;
/** How long the preview holds the end before counting down again. */
const SIM_RESTART_MS = 3500;

type CountdownValues = Pick<CountdownSettings, 'time' | 'at'>;

interface UseCountdownOptions {
  twitch?: string;
  kick?: string;
  values: CountdownValues;
  /** Preview mode: a fast clock that starts over at the end, and no chat. */
  simulate?: boolean;
  /** Pairs the preview with its setup page's test buttons. */
  previewId?: string;
}

export interface Countdown {
  /** Milliseconds left. */
  left: number;
  /** Time left as a share of what the clock started with, 0 to 1, for the bar. */
  progress: number;
  paused: boolean;
  ended: boolean;
}

export function useCountdown({
  twitch,
  kick,
  values,
  simulate = false,
  previewId,
}: UseCountdownOptions): Countdown {
  const [options, setOptions] = useState<ClockOptions>(() =>
    countdownOptions(values.time, values.at, Date.now()),
  );
  const optionsRef = useRef(options);
  optionsRef.current = options;
  // The preview's clock runs fast, so a 30 minute countdown is watchable in the panel.
  const rate = simulate ? Math.max(1, options.base / SIM_DRAIN_MS) : 1;
  const originRef = useRef(Date.now());
  const clock = useCallback(
    () => originRef.current + (Date.now() - originRef.current) * rate,
    [rate],
  );

  const [state, setState] = useState<CountdownState>(() => startCountdown(options, clock()));
  const stateRef = useRef(state);
  const [now, setNow] = useState(clock);

  const commit = useCallback(
    (next: CountdownState) => {
      stateRef.current = next;
      setState(next);
      setNow(clock());
    },
    [clock],
  );

  // A changed length or target starts the countdown over, so the preview follows the settings
  // panel. In OBS the URL doesn't change while the source runs.
  const { time, at } = values;
  useEffect(() => {
    const next = countdownOptions(time, at, Date.now());
    setOptions(next);
    commit(startCountdown(next, clock()));
  }, [time, at, clock, commit]);

  const runCommand = useCallback(
    (text: string) => {
      const command = parseCountdownCommand(text);
      if (!command) return;
      // Reset re-reads the time of day, so !countdown reset the next day aims at the next one.
      const options = at ? countdownOptions(time, at, Date.now()) : optionsRef.current;
      commit(applyCommand(stateRef.current, command, clock(), options));
    },
    [at, time, clock, commit],
  );

  useSubEvents(
    twitch,
    kick,
    !simulate,
    useCallback(
      (event) => {
        if (event.kind === 'mod') runCommand(event.text);
      },
      [runCommand],
    ),
  );

  const running = state.endsAt !== null && !isEnded(state, now);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setNow(clock()), simulate ? SIM_TICK_MS : LIVE_TICK_MS);
    return () => window.clearInterval(timer);
  }, [running, clock, simulate]);

  // Preview: once it runs out, hold the end for a moment, then count down again. A paused
  // preview stays paused, so the pause test button shows what it does.
  const ended = isEnded(state, now);
  useEffect(() => {
    if (!simulate || !ended) return;
    const timer = window.setTimeout(
      () => commit(startCountdown(optionsRef.current, clock())),
      SIM_RESTART_MS,
    );
    return () => window.clearTimeout(timer);
  }, [simulate, ended, clock, commit]);

  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    if (message.type !== 'toggle') return runCommand(message.text);
    runCommand(`${COMMAND} ${stateRef.current.endsAt === null ? 'start' : 'pause'}`);
  });

  return {
    left: timeLeft(state, now),
    progress: healthOf(state, now),
    paused: state.endsAt === null,
    ended,
  };
}

export { COMMAND };
