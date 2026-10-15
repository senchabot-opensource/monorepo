import { FxPulse } from '#/features/presets/fx/engine';
import { painter, skinCss, skinFor } from '#/features/presets/skin';
import { SkinProvider, useSkin } from '#/features/presets/skin-context';
import { type EmoteComboSettings, EMOTE_COMBO_STAGE as STAGE } from '#/lib/emote-combo-url';
import { useI18n } from '#/lib/i18n';
import { OVERLAY_FONT_FAMILY as FONT_FAMILY, hueFor } from '../overlay-style';
import { useFitScale } from '../use-fit-scale';
import { type BestCombo, FINALE_MS, type ShownCombo } from './emote-combo-state';
import { useEmoteCombo } from './use-emote-combo';

/** Sizes at 100%; the size setting scales the emote, the count and the label together. */
const EMOTE_SIZE = 128;
const COUNT_FONT = 104;
const LABEL_FONT = 30;
const GAP = 18;
const BEST_EMOTE = 30;

/** The count's font size: smaller from three digits on, so a big combo stays on the stage. */
export function countFontSize(count: number, scale: number): number {
  const digits = String(count).length;
  const shrink = digits <= 2 ? 1 : digits === 3 ? 0.84 : 0.7;
  return Math.round(COUNT_FONT * scale * shrink);
}

const SEVEN_TV_SMALL = /^(https:\/\/cdn\.7tv\.app\/emote\/[^/]+\/)[1-3]x\.webp$/;
const BTTV_SMALL = /^(https:\/\/cdn\.betterttv\.net\/emote\/[^/]+\/)[12]x\.webp$/;

/**
 * The emote at a size made for the big counter: the channel emote maps hold 7TV and BTTV emotes
 * at chat size (2x), blurry at 128px and up, and both always have a larger copy. Any other URL
 * (Twitch's 3.0, Kick's fullsize, FFZ, whose larger copies aren't always there) is kept.
 */
export function bigEmoteUrl(url: string): string {
  return url
    .replace(SEVEN_TV_SMALL, (_, base: string) => `${base}4x.webp`)
    .replace(BTTV_SMALL, (_, base: string) => `${base}3x.webp`);
}

// The emote's wiggle swaps between two copies of one animation, which restarts it on every new
// chatter without remounting the image (a new <img> can blink while it decodes).
const WIGGLE =
  '0%{transform:none}30%{transform:rotate(-12deg) scale(1.14)}65%{transform:rotate(7deg) scale(1.04)}100%{transform:none}';
const CSS = `
.ec-root{position:fixed;inset:0;overflow:hidden;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.ec-stage{position:absolute;left:50%;top:50%;width:${STAGE.width}px;height:${STAGE.height}px;transform-origin:center}
.ec-shadow{text-shadow:0 2px 0 rgba(0,0,0,.55),0 0 14px rgba(0,0,0,.5)}
.ec-title{font-weight:800;letter-spacing:.24em;font-style:italic}
.ec-combo{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px}
.ec-in{animation:ec-in .45s cubic-bezier(.2,.9,.3,1.25) both}
.ec-out{animation:ec-out ${FINALE_MS}ms ease-in both}
.ec-bump{display:inline-block;transform-origin:left center;animation:ec-bump .35s cubic-bezier(.2,.9,.3,1.2) both}
@keyframes ec-in{0%{transform:scale(.35) rotate(-10deg);opacity:0}60%{transform:scale(1.08) rotate(2deg);opacity:1}100%{transform:none;opacity:1}}
@keyframes ec-out{0%{transform:none;opacity:1}10%{transform:scale(1.14)}22%{transform:none}78%{transform:none;opacity:1}100%{transform:translateY(-16px) scale(.92);opacity:0}}
@keyframes ec-fade{0%,78%{opacity:1}100%{opacity:0}}
@keyframes ec-bump{0%{transform:scale(1.4)}100%{transform:none}}
@keyframes ec-wiggle-a{${WIGGLE}}
@keyframes ec-wiggle-b{${WIGGLE}}
@media (prefers-reduced-motion:reduce){
  .ec-in,.ec-bump,.ec-emote{animation:none!important}
  .ec-out{animation:ec-fade ${FINALE_MS}ms ease-in both}
}
`;

interface EmoteComboWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<EmoteComboSettings, 'platforms'>;
  simulate?: boolean;
  previewId?: string;
}

export function EmoteComboWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  previewId,
}: EmoteComboWidgetProps) {
  const scale = useFitScale(STAGE);
  const { state, shown } = useEmoteCombo({
    twitch: twitchChannel,
    kick: kickChannel,
    rules: { windowMs: settings.window * 1000, min: settings.min },
    providers: { sevenTv: settings.sevenTv, bttv: settings.bttv, ffz: settings.ffz },
    simulate,
    previewId,
  });
  const skin = skinFor(settings.preset, settings.fx, settings.font);
  const hue = hueFor(settings.color, 1);

  return (
    <SkinProvider skin={skin}>
      <div className="ec-root" data-testid="emote-combo" data-preset={skin?.id}>
        <style>{CSS + skinCss('ec', skin)}</style>
        <div className="ec-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          {shown && (
            <div
              // A new combo plays its entrance; the same one going to its finale keeps the node.
              key={`${shown.combo.emote.key}@${shown.combo.startedAt}`}
              className={`ec-combo ${shown.ended ? 'ec-out' : 'ec-in'}`}
              data-testid="combo"
              data-emote={shown.combo.emote.key}
              data-ended={shown.ended}
            >
              <ComboCounter shown={shown} hue={hue} size={settings.size / 100} />
              {settings.best && state.best && (
                <BestLine best={state.best} record={shown.record} hue={hue} />
              )}
            </div>
          )}
        </div>
      </div>
    </SkinProvider>
  );
}

/** The emote, its "×N" and the COMBO label under the number. */
function ComboCounter({ shown, hue, size }: { shown: ShownCombo; hue: number; size: number }) {
  const skin = useSkin();
  const { t } = useI18n();
  const hsl = painter(skin, hue);
  const { emote } = shown.combo;
  const emoteSize = Math.round(EMOTE_SIZE * size);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: GAP * size }}>
      <img
        className="ec-emote"
        data-testid="combo-emote"
        src={bigEmoteUrl(emote.url)}
        alt={emote.name}
        width={emoteSize}
        height={emoteSize}
        draggable={false}
        decoding="async"
        style={{
          objectFit: 'contain',
          flexShrink: 0,
          filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.45))',
          animation: `ec-wiggle-${shown.count % 2 ? 'a' : 'b'} .45s ease-out both`,
        }}
      />
      <div
        style={{
          // Holds the effect over the count; classic keeps its layout untouched.
          position: skin && skin.effect !== 'none' ? 'relative' : undefined,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          lineHeight: 1,
        }}
      >
        <span
          // A new key replays the bump on every new chatter.
          key={shown.count}
          className="ec-bump"
          data-testid="combo-count"
          style={{
            fontSize: countFontSize(shown.count, size),
            fontWeight: 800,
            whiteSpace: 'nowrap',
            color: hsl(95, 62),
            // Drawn under the fill, so a preset's thin display font keeps its light glyph.
            WebkitTextStroke: `${Math.max(2, Math.round(8 * size))}px ${hsl(70, 12)}`,
            paintOrder: 'stroke fill',
            textShadow: skin
              ? skin.textShadow
              : `0 0 28px ${hsl(90, 55, 0.55)}, 0 6px 0 rgba(0,0,0,.45)`,
          }}
        >
          ×{shown.count}
        </span>
        <FxPulse skin={skin} pulse={shown.count} win={shown.ended} />
        <span
          className="ec-title ec-shadow"
          data-testid="combo-label"
          style={{
            fontSize: Math.round(LABEL_FONT * size),
            marginTop: Math.round(4 * size),
            paddingLeft: Math.round(6 * size),
            whiteSpace: 'nowrap',
            color: skin?.text ?? '#fff',
            WebkitTextStroke: `${Math.max(1, Math.round(4 * size))}px rgba(0,0,0,.7)`,
            paintOrder: 'stroke fill',
          }}
        >
          {t('emoteCombo.overlay.combo')}
        </span>
      </div>
    </div>
  );
}

/**
 * The stream's best combo on a line of its own, or "New best!" while the combo on screen is it.
 * Bare text over the game, with no card behind it, in every look.
 */
function BestLine({ best, record, hue }: { best: BestCombo; record: boolean; hue: number }) {
  const skin = useSkin();
  const { t } = useI18n();
  const hsl = painter(skin, hue);
  return (
    <div
      data-testid="combo-best"
      data-record={record}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 44,
        padding: '4px 18px',
        fontSize: 22,
        fontWeight: 800,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {record ? (
        <span className="ec-title ec-shadow" style={{ color: hsl(95, 66), fontSize: 18 }}>
          {t('emoteCombo.overlay.newBest')}
        </span>
      ) : (
        <>
          <span
            className="ec-title ec-shadow"
            style={{ color: skin?.muted ?? 'rgba(255,255,255,.72)', fontSize: 16 }}
          >
            {t('emoteCombo.overlay.best')}
          </span>
          <img
            src={best.emote.url}
            alt={best.emote.name}
            width={BEST_EMOTE}
            height={BEST_EMOTE}
            draggable={false}
            decoding="async"
            style={{ objectFit: 'contain' }}
          />
          <span
            className="ec-shadow"
            data-testid="combo-best-count"
            style={{ color: skin?.text ?? '#fff' }}
          >
            ×{best.count}
          </span>
        </>
      )}
    </div>
  );
}
