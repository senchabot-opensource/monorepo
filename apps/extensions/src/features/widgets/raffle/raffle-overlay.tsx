import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Frame, panelStyle } from '#/features/presets/frame';
import { shade, skinFor, titleStyle } from '#/features/presets/skin';
import { SkinProvider } from '#/features/presets/skin-context';
import { type BurstOptions, useConfettiBurst } from '#/hooks/use-confetti-burst';
import { useT } from '#/lib/i18n';
import type { RaffleWinner } from '#/types/raffle';

const CHANNEL_NAME = 'senchabot-raffle-broadcast';
const CONFETTI: BurstOptions = {
  particleCount: 4,
  colors: ['#9146FF', '#00D4AA', '#FFD700', '#FF4500'],
};

// Shown over and over by the demo, a moment after each one fades.
const DEMO_WINNER: RaffleWinner = {
  id: 'demo',
  username: 'senchabot',
  displayName: 'Senchabot',
  platform: 'twitch',
  subMonths: 0,
  drawnAt: 0,
};
const DEMO_REPEAT_MS = 11_000;

/**
 * `preset` comes from the URL; missing or unknown keeps the classic look. `demo` draws a sample
 * winner on repeat, for previews that have no raffle running.
 */
export function RaffleOverlay({ preset, demo }: { preset?: string | null; demo?: boolean }) {
  const t = useT();
  const skin = skinFor(preset);
  const [winner, setWinner] = useState<RaffleWinner | null>(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confettiOptions = useMemo<BurstOptions>(
    () =>
      skin
        ? {
            ...CONFETTI,
            colors: [skin.colors.accent, skin.colors.win, skin.colors.frame, skin.colors.text],
          }
        : CONFETTI,
    [skin],
  );
  const triggerConfetti = useConfettiBurst(confettiOptions);

  const showWinner = useCallback(
    (w: RaffleWinner) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setWinner(w);
      setVisible(true);
      triggerConfetti();
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, 10000);
    },
    [triggerConfetti],
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;

    const bc = new BroadcastChannel(CHANNEL_NAME);
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'raffle:winner' && event.data?.winner) {
        showWinner(event.data.winner as RaffleWinner);
      }
    };
    bc.addEventListener('message', handler);

    return () => {
      bc.removeEventListener('message', handler);
      bc.close();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showWinner]);

  useEffect(() => {
    if (!demo) return;
    const show = () => showWinner(DEMO_WINNER);
    const first = setTimeout(show, 400);
    const repeat = setInterval(show, DEMO_REPEAT_MS);
    return () => {
      clearTimeout(first);
      clearInterval(repeat);
    };
  }, [demo, showWinner]);

  if (skin) {
    return (
      <SkinProvider skin={skin}>
        <div
          className="relative flex size-full min-h-screen items-center justify-center overflow-hidden bg-transparent"
          data-preset={skin.id}
          style={{ fontFamily: skin.body, color: skin.text, fontSynthesis: 'none' }}
        >
          {visible && winner && (
            <div
              className="relative flex flex-col items-center gap-2 px-14 pt-7 pb-8"
              style={{
                ...panelStyle(skin, 16),
                minWidth: 420,
                animation: 'fadeInZoom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div
                className="text-2xl font-bold"
                style={{
                  ...titleStyle(skin),
                  fontFamily: skin.display,
                  color: shade(skin.win, 68),
                }}
              >
                {t('raffle.winner')}
              </div>
              <div
                lang="und"
                className="text-6xl font-extrabold"
                style={{ fontFamily: skin.display, textShadow: skin.textShadow }}
              >
                {winner.displayName || winner.username}
              </div>
              <Frame skin={skin} radius={16} />
            </div>
          )}
        </div>
      </SkinProvider>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen items-center justify-center overflow-hidden bg-transparent">
      {visible && winner && (
        <div
          className="flex flex-col items-center gap-4"
          style={{
            animation: 'fadeInZoom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div className="text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            {winner.displayName || winner.username}
          </div>
          <div className="text-2xl font-medium text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {t('raffle.winner')}
          </div>
        </div>
      )}
    </div>
  );
}
