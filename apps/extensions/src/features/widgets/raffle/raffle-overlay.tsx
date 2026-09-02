import confetti from 'canvas-confetti';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useT } from '#/lib/i18n';
import type { RaffleWinner } from '#/types/raffle';

const CHANNEL_NAME = 'senchabot-raffle-broadcast';

export function RaffleOverlay() {
  const t = useT();
  const [winner, setWinner] = useState<RaffleWinner | null>(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confettiRafRef = useRef<number | null>(null);

  const cancelConfetti = useCallback(() => {
    if (confettiRafRef.current !== null) {
      cancelAnimationFrame(confettiRafRef.current);
      confettiRafRef.current = null;
    }
  }, []);

  const triggerConfetti = useCallback(() => {
    cancelConfetti();
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#9146FF', '#00D4AA', '#FFD700', '#FF4500'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#9146FF', '#00D4AA', '#FFD700', '#FF4500'],
      });

      if (Date.now() < end) {
        confettiRafRef.current = requestAnimationFrame(frame);
      } else {
        confettiRafRef.current = null;
      }
    };

    confettiRafRef.current = requestAnimationFrame(frame);
  }, [cancelConfetti]);

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
      cancelConfetti();
    };
  }, [showWinner, cancelConfetti]);

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
