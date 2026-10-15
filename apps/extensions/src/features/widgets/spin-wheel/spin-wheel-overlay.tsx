import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Frame, panelStyle } from '#/features/presets/frame';
import { skinFor } from '#/features/presets/skin';
import { SkinProvider } from '#/features/presets/skin-context';
import { type BurstOptions, useConfettiBurst } from '#/hooks/use-confetti-burst';
import { usePreviewReceiver } from '#/hooks/use-preview-channel';
import { useI18n } from '#/lib/i18n';
import type { SpinWheelSettings } from '#/lib/spin-wheel-url';
import { buildSpin, wheelSlices } from './spin-logic';
import { SpinWheelCanvas, type StandaloneSpin } from './spin-wheel-canvas';
import { useSpinChat } from './use-spin-chat';

/** Setup page test buttons talk to the preview on this channel. */
export const PREVIEW_CHANNEL = 'senchabot:spin-wheel-preview';
/** `preview` is the id in the preview's URL, so only that page's preview spins. */
export type PreviewMessage = { type: 'spin'; preview: string };

/** Demo spins about this far apart, a moment after each winner fades. */
const SIM_REPEAT_MS = 11_000;

const CONFETTI: BurstOptions = { particleCount: 3, disableForReducedMotion: true };

/** Height of the cooldown pill, so a preset's corners round it into a pill too. */
const PILL_RADIUS = 18;

interface SpinWheelOverlayProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<SpinWheelSettings, 'platforms'>;
  /** Demo mode: spins on repeat, no chat. */
  simulate?: boolean;
  /** Pairs the preview with its setup page's test buttons. */
  previewId?: string;
}

/**
 * The OBS browser source: the wheel, spinning on `!spin` from either chat
 * behind one global cooldown, with the wait shown on screen while it runs.
 */
export function SpinWheelOverlay({
  twitchChannel,
  kickChannel,
  settings,
  simulate = false,
  previewId,
}: SpinWheelOverlayProps) {
  const { t } = useI18n();
  const [currentSpin, setCurrentSpin] = useState<StandaloneSpin | null>(null);
  const [spinning, setSpinning] = useState(false);
  const angleRef = useRef(0);
  // Unknown ids fall back to the classic look in skinFor.
  const skin = skinFor(settings.preset, settings.fx, settings.font);
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
  const fireConfetti = useConfettiBurst(confettiOptions);

  const slices = useMemo(
    () => wheelSlices(settings.options, { preset: skin?.colors, twoColors: settings.twoColors }),
    [settings.options, settings.twoColors, skin],
  );

  const triggerSpin = useCallback(() => {
    if (slices.length < 2) return;
    const next = buildSpin(angleRef.current, slices.length);
    if (!next) return;
    angleRef.current = next.targetAngle;
    setSpinning(true);
    setCurrentSpin({
      spinId: next.spinId,
      targetAngle: next.targetAngle,
      durationMs: next.durationMs,
      selectedIndex: next.selectedIndex,
    });
  }, [slices.length]);
  const triggerSpinRef = useRef(triggerSpin);
  triggerSpinRef.current = triggerSpin;
  const spinningRef = useRef(spinning);
  spinningRef.current = spinning;

  const { cooldownMs } = useSpinChat({
    twitch: twitchChannel,
    kick: kickChannel,
    permission: settings.permission,
    cooldownSec: settings.cooldownSec,
    busy: spinning,
    enabled: !simulate,
    onSpin: () => triggerSpinRef.current(),
  });

  // Demo: keep spinning on repeat while the preview has options.
  useEffect(() => {
    if (!simulate || slices.length < 2) return;
    const first = window.setTimeout(() => triggerSpinRef.current(), 800);
    const repeat = window.setInterval(() => {
      if (!spinningRef.current) triggerSpinRef.current();
    }, SIM_REPEAT_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(repeat);
    };
  }, [simulate, slices.length]);

  usePreviewReceiver<PreviewMessage>(PREVIEW_CHANNEL, previewId, simulate, (message) => {
    if (message.type === 'spin') triggerSpinRef.current();
  });

  const cooldownSecLeft = Math.ceil(cooldownMs / 1000);

  const cooldownText = t('spinWheel.cooldownWait', { seconds: cooldownSecLeft });

  return (
    <SkinProvider skin={skin}>
      <div
        className="relative flex min-h-screen flex-col items-center justify-center gap-3 bg-transparent p-4"
        data-testid="spin-wheel"
        data-preset={skin?.id}
        style={skin ? { fontFamily: skin.body, fontSynthesis: 'none' } : undefined}
      >
        <div aria-live="polite" className="flex min-h-9 items-center">
          {cooldownMs > 0 &&
            !spinning &&
            (skin ? (
              <p
                className="relative px-4 py-1.5 text-sm font-semibold tabular-nums"
                style={{ ...panelStyle(skin, PILL_RADIUS), color: skin.text }}
              >
                {cooldownText}
                <Frame skin={skin} radius={PILL_RADIUS} studs={false} />
              </p>
            ) : (
              <p className="rounded-full border border-amber-300/40 bg-zinc-950/80 px-4 py-1.5 text-sm font-semibold text-amber-200 tabular-nums">
                {cooldownText}
              </p>
            ))}
        </div>
        <SpinWheelCanvas
          slices={slices}
          size={560}
          currentSpin={currentSpin}
          onSpinComplete={() => {
            setSpinning(false);
            fireConfetti();
          }}
          soundEnabled={settings.sound}
          winnerTitle={t('spinWheel.winnerTitle')}
          skin={skin}
        />
        {slices.length < 2 && (
          <p className="max-w-md text-center text-sm text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {t('spinWheel.overlayNeedTwo')}
          </p>
        )}
      </div>
    </SkinProvider>
  );
}
