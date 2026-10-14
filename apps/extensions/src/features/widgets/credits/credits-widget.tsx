import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import { painter, skinCss, skinFor } from '#/features/presets/skin';
import { SkinProvider, useSkin } from '#/features/presets/skin-context';
import {
  CREDIT_SECTIONS,
  type CreditSection,
  type CreditsSettings,
  SPEED_PX,
  CREDITS_STAGE as STAGE,
} from '#/lib/credits-url';
import { useI18n } from '#/lib/i18n';
import { OVERLAY_FONT_FAMILY as FONT_FAMILY, hueFor, PLATFORM_COLORS } from '../overlay-style';
import { useFitScale } from '../use-fit-scale';
import { type Credit, sortedCredits } from './credits-state';
import { useCredits } from './use-credits';

const COLUMN_WIDTH = 1100;

const CSS = `
.cr-root{position:fixed;inset:0;overflow:hidden;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.cr-stage{position:absolute;left:50%;top:50%;width:${STAGE.width}px;height:${STAGE.height}px;transform-origin:center;overflow:hidden}
.cr-shadow{text-shadow:0 3px 0 rgba(0,0,0,.6),0 0 24px rgba(0,0,0,.6)}
.cr-title{font-weight:800;letter-spacing:.1em;text-transform:uppercase;font-style:italic}
@keyframes cr-roll{from{transform:translate(-50%,var(--from))}to{transform:translate(-50%,var(--to))}}
`;

interface CreditsWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<CreditsSettings, 'platforms'>;
  simulate?: boolean;
  previewId?: string;
}

export function CreditsWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  previewId,
}: CreditsWidgetProps) {
  const scale = useFitScale(STAGE);
  const { data, roll, ended } = useCredits({
    twitch: twitchChannel,
    kick: kickChannel,
    loop: settings.loop,
    simulate,
    previewId,
  });
  const skin = skinFor(settings.preset);
  const lists = sortedCredits(data);
  const sections = CREDIT_SECTIONS.filter(
    (section) => settings.sections[section] && lists[section].length > 0,
  );

  return (
    <SkinProvider skin={skin}>
      <div
        className="cr-root"
        data-testid="credits"
        data-rolling={roll !== null}
        data-preset={skin?.id}
      >
        <style>{CSS + skinCss('cr', skin)}</style>
        <div className="cr-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          {roll !== null && (
            <Roll key={roll} settings={settings} sections={sections} lists={lists} onEnd={ended} />
          )}
        </div>
      </div>
    </SkinProvider>
  );
}

function Roll({
  settings,
  sections,
  lists,
  onEnd,
}: {
  settings: CreditsWidgetProps['settings'];
  sections: CreditSection[];
  lists: Record<CreditSection, Credit[]>;
  onEnd: () => void;
}) {
  const skin = useSkin();
  const hsl = painter(skin, hueFor(settings.color, 1));
  const ref = useRef<HTMLDivElement>(null);
  // The names as the roll starts: someone chatting mid-roll joins the next one, so the measured
  // height stays right.
  const [frozen] = useState(() => ({ sections, lists }));
  // Measured once the names are in: the roll runs from below the stage until it's all gone.
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    setHeight(ref.current?.offsetHeight ?? 0);
  }, []);
  const distance = STAGE.height + height;
  const duration = Math.max(4, distance / SPEED_PX[settings.speed]);

  return (
    <div
      ref={ref}
      data-testid="credits-roll"
      onAnimationEnd={onEnd}
      style={
        {
          position: 'absolute',
          left: '50%',
          top: 0,
          width: COLUMN_WIDTH,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 64,
          textAlign: 'center',
          transform: `translate(-50%, ${STAGE.height}px)`,
          '--from': `${STAGE.height}px`,
          '--to': `${-height}px`,
          animation: height ? `cr-roll ${duration}s linear forwards` : undefined,
        } as CSSProperties
      }
    >
      {settings.title && (
        <div
          className="cr-title cr-shadow"
          data-testid="credits-title"
          style={{
            fontSize: 84,
            lineHeight: 1.1,
            color: skin?.text ?? '#fff',
            textShadow: `0 0 40px ${hsl(90, 55, 0.5)}, 0 4px 0 rgba(0,0,0,.6)`,
          }}
        >
          {settings.title}
        </div>
      )}
      {frozen.sections.map((section) => (
        <Section key={section} section={section} credits={frozen.lists[section]} hsl={hsl} />
      ))}
      {settings.outro && (
        <div
          className="cr-shadow"
          data-testid="credits-outro"
          style={{ fontSize: 52, fontWeight: 700, color: skin?.text ?? '#fff' }}
        >
          {settings.outro}
        </div>
      )}
    </div>
  );
}

function Section({
  section,
  credits,
  hsl,
}: {
  section: CreditSection;
  credits: Credit[];
  hsl: ReturnType<typeof painter>;
}) {
  const skin = useSkin();
  const { t, locale } = useI18n();
  // A long list goes into columns, a short one stays one centered column.
  const columns = credits.length > 12 ? 3 : credits.length > 4 ? 2 : 1;
  return (
    <section data-testid="credits-section" data-section={section} style={{ width: '100%' }}>
      <h2
        className="cr-title cr-shadow"
        style={{ margin: '0 0 24px', fontSize: 44, color: hsl(90, 68) }}
      >
        {t(`credits.sections.${section}`)}
      </h2>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: '14px 40px',
        }}
      >
        {credits.map((entry) => (
          <li
            key={`${entry.platform}:${entry.name}`}
            className="cr-shadow"
            data-testid="credits-name"
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: 12,
              fontSize: 36,
              fontWeight: 700,
              color: skin?.text ?? '#fff',
              minWidth: 0,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                flexShrink: 0,
                alignSelf: 'center',
                background: PLATFORM_COLORS[entry.platform],
              }}
            />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.name}
            </span>
            {amountShown(section, entry.amount) && (
              <span style={{ fontSize: 28, opacity: 0.7 }}>
                {section === 'gifts'
                  ? `×${entry.amount.toLocaleString(locale)}`
                  : entry.amount.toLocaleString(locale)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Gifts, cheers and raids show how much; subs, mods and chatters only names. */
const amountShown = (section: CreditSection, amount: number) =>
  (section === 'gifts' || section === 'cheers' || section === 'raids') && amount > 0;
