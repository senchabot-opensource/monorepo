import { useCallback, useEffect, useRef, useState } from 'react';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import type { LowerThirdSettings } from '#/lib/lower-third-url';
import type { SubathonEvent } from '../subathon/subathon-events';
import { useSubEvents } from '../subathon/use-sub-events';
import { lineIndexAt, parseLowerThirdCommand, phaseAt } from './lower-third-state';

/** Setup page buttons talk to the preview on this channel; both pages share the site's origin. */
export const PREVIEW_CHANNEL = 'senchabot:lower-third-preview';
export type PreviewMessage = { type: 'command'; preview: string; text: string };

/** How often the bar checks whether to show, hide or turn to the next line. */
const TICK_MS = 250;
// The preview runs a timed bar's cycle short, so a change shows without waiting minutes.
const PREVIEW_HOLD_MAX = 8;
const PREVIEW_PAUSE = 3;

type Timing = Pick<LowerThirdSettings, 'lines' | 'rotate' | 'hold' | 'pause'>;

interface UseLowerThirdOptions {
  twitch?: string;
  kick?: string;
  timing: Timing;
  simulate?: boolean;
  previewId?: string;
}

export function useLowerThird({
  twitch,
  kick,
  timing,
  simulate = false,
  previewId,
}: UseLowerThirdOptions) {
  const hold = simulate && timing.hold > 0 ? Math.min(timing.hold, PREVIEW_HOLD_MAX) : timing.hold;
  const pause = simulate ? PREVIEW_PAUSE : timing.pause;
  const [cycleStart, setCycleStart] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [pinned, setPinned] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  const handleText = useCallback((text: string) => {
    const command = parseLowerThirdCommand(text);
    if (!command) return;
    switch (command.action) {
      case 'show':
        setHidden(false);
        setCycleStart(Date.now());
        setNow(Date.now());
        break;
      case 'hide':
        setHidden(true);
        break;
      case 'clear':
        setPinned(null);
        break;
      case 'say':
        // A line of your own shows at once, even on a timed bar that's away.
        setPinned(command.text);
        setHidden(false);
        setCycleStart(Date.now());
        setNow(Date.now());
        break;
    }
  }, []);

  const handleEvent = useCallback(
    (event: SubathonEvent) => {
      if (event.kind === 'mod') handleText(event.text);
    },
    [handleText],
  );
  useSubEvents(twitch, kick, !simulate, handleEvent);

  const handleRef = useRef(handleText);
  handleRef.current = handleText;
  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    if (message.type === 'command') handleRef.current(message.text);
  });

  const { visible, shownFor } = phaseAt(Math.max(0, now - cycleStart), hold, pause);
  const index = lineIndexAt(shownFor, timing.lines.length, timing.rotate);
  return {
    visible: visible && !hidden,
    line: pinned ?? (index >= 0 ? timing.lines[index] : ''),
    /** Changes whenever a new line comes up, so it can animate in. */
    lineKey: pinned !== null ? `pin:${cycleStart}` : `line:${index}`,
  };
}
