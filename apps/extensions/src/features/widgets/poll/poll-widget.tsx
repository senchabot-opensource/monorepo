import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { useI18n } from '#/lib/i18n';
import type { PollSettings } from '#/lib/poll-url';
import type { SubathonPlatform } from '../subathon/subathon-events';
import { hueFor } from '../subathon/subathon-widget';
import { useFitScale } from '../use-fit-scale';
import { type PollView, usePoll } from './use-poll';

/** Design size; the overlay scales to fill whatever browser source size it gets. Fits 6 options. */
const STAGE = { width: 640, height: 560 };
const FONT_FAMILY = "'Oxanium', ui-sans-serif, system-ui, sans-serif";
const GOLD_HUE = 42;
const RED_HUE = 356;
// The timer turns red for its last seconds.
const HURRY_MS = 10_000;
const LEAVE_MS = 450;
const PLATFORM_COLORS: Record<SubathonPlatform, string> = { twitch: '#a970ff', kick: '#53fc18' };

const CSS = `
.cp-root{position:fixed;inset:0;overflow:hidden;font-family:${FONT_FAMILY};color:#fff;
  -webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.cp-stage{position:absolute;left:50%;top:50%;width:${STAGE.width}px;height:${STAGE.height}px;transform-origin:center}
.cp-shadow{text-shadow:0 2px 0 rgba(0,0,0,.5),0 0 14px rgba(0,0,0,.45)}
.cp-clamp{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.cp-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
@keyframes cp-in-top{0%{transform:translateY(-22px) scale(.97);opacity:0}100%{transform:none;opacity:1}}
@keyframes cp-in-bottom{0%{transform:translateY(22px) scale(.97);opacity:0}100%{transform:none;opacity:1}}
@keyframes cp-out{0%{opacity:1;transform:none}100%{opacity:0;transform:scale(.97)}}
@keyframes cp-row{0%{transform:translateX(-14px);opacity:0}100%{transform:none;opacity:1}}
@keyframes cp-flash{0%{opacity:.14}100%{opacity:0}}
@keyframes cp-bump{0%{transform:scale(1)}35%{transform:scale(1.16)}100%{transform:scale(1)}}
@keyframes cp-dot{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes cp-hurry{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes cp-win{0%,100%{box-shadow:0 0 0 2px hsl(${GOLD_HUE} 100% 62% / .9),0 0 14px hsl(${GOLD_HUE} 100% 55% / .45)}50%{box-shadow:0 0 0 2px hsl(${GOLD_HUE} 100% 70%),0 0 30px hsl(${GOLD_HUE} 100% 55% / .8)}}
@keyframes cp-crown{0%{transform:translateY(-10px) scale(.4) rotate(-20deg);opacity:0}60%{transform:translateY(0) scale(1.2) rotate(6deg);opacity:1}100%{transform:none;opacity:1}}
`;

const hsl = (hue: number, s: number, l: number, a = 1) => `hsl(${hue} ${s}% ${l}% / ${a})`;

interface PollWidgetProps {
  twitchChannel?: string;
  kickChannel?: string;
  settings: Omit<PollSettings, 'platforms'>;
  simulate?: boolean;
  simPlatform?: SubathonPlatform;
  previewId?: string;
}

export function PollWidget({
  twitchChannel,
  kickChannel,
  settings,
  simulate,
  simPlatform,
  previewId,
}: PollWidgetProps) {
  const { t } = useI18n();
  const scale = useFitScale(STAGE);
  const { view, pulses } = usePoll({
    twitch: twitchChannel,
    kick: kickChannel,
    settings,
    yesNo: [t('poll.overlay.yes'), t('poll.overlay.no')],
    sample: {
      question: t('poll.overlay.sampleQuestion'),
      options: [
        t('poll.overlay.sampleOption1'),
        t('poll.overlay.sampleOption2'),
        t('poll.overlay.sampleOption3'),
      ],
    },
    simulate,
    simPlatform,
    previewId,
  });
  const shown = useLeaving(view);
  const bothPlatforms = simulate ? !simPlatform : Boolean(twitchChannel && kickChannel);

  return (
    <div className="cp-root" data-testid="poll" data-phase={view?.phase ?? 'none'}>
      <style>{CSS}</style>
      <div className="cp-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div
          style={{
            position: 'absolute',
            inset: 16,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: settings.position === 'top' ? 'flex-start' : 'flex-end',
          }}
        >
          {shown && (
            <Card
              key={shown.view.id}
              view={shown.view}
              leaving={shown.leaving}
              pulses={pulses}
              settings={settings}
              bothPlatforms={bothPlatforms}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/** The poll to draw: the live one, or the last one for a moment while it fades out. */
function useLeaving(view: PollView | null) {
  const last = useRef<PollView | null>(null);
  const [faded, setFaded] = useState(true);
  if (view) last.current = view;
  const hidden = view === null;
  useEffect(() => {
    if (!hidden) {
      setFaded(false);
      return;
    }
    const timer = window.setTimeout(() => setFaded(true), LEAVE_MS);
    return () => window.clearTimeout(timer);
  }, [hidden]);
  if (view) return { view, leaving: false };
  return last.current && !faded ? { view: last.current, leaving: true } : null;
}

function Card({
  view,
  leaving,
  pulses,
  settings,
  bothPlatforms,
}: {
  view: PollView;
  leaving: boolean;
  pulses: number[];
  settings: Omit<PollSettings, 'platforms'>;
  bothPlatforms: boolean;
}) {
  const { t, locale } = useI18n();
  const hue = hueFor(settings.color, 1);
  const { tally, phase } = view;
  const final = phase === 'results';
  const hideBars = settings.blind && !final;
  const tie = final && tally.leaders.length > 1;
  const number = (n: number) => n.toLocaleString(locale);
  const votes = (n: number) =>
    n === 1 ? t('poll.overlay.voteOne') : t('poll.overlay.votes', { count: number(n) });

  const status =
    phase === 'open'
      ? t('poll.overlay.label')
      : phase === 'closing'
        ? t('poll.overlay.closing')
        : tie
          ? t('poll.overlay.tie')
          : t('poll.overlay.results');
  const statusHue = final ? GOLD_HUE : hue;

  let footer: string;
  if (final) {
    footer =
      tally.total === 0
        ? t('poll.overlay.noVotes')
        : tie
          ? t('poll.overlay.tieHint')
          : t('poll.overlay.winner', { option: view.options[tally.leaders[0]] });
  } else if (hideBars) {
    footer = t('poll.overlay.hidden');
  } else {
    footer =
      view.options.length === 2
        ? t('poll.overlay.howToTwo')
        : t('poll.overlay.howTo', { last: view.options.length });
  }
  const rules = [
    settings.subsOnly && t('poll.overlay.subsOnly'),
    !settings.subsOnly &&
      settings.subWeight > 1 &&
      t('poll.overlay.subBonus', { n: settings.subWeight }),
  ].filter(Boolean);

  return (
    <div
      data-testid="poll-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 18,
        padding: '18px 20px 16px',
        background: 'linear-gradient(180deg, rgba(22,22,30,.93) 0%, rgba(9,9,13,.93) 100%)',
        border: `1px solid ${hsl(hue, 80, 62, 0.35)}`,
        boxShadow: `0 14px 40px rgba(0,0,0,.45), 0 0 0 1px rgba(0,0,0,.6), 0 0 32px ${hsl(hue, 90, 55, 0.16)}`,
        animation: leaving
          ? `cp-out ${LEAVE_MS}ms ease-in forwards`
          : `cp-in-${settings.position} .5s cubic-bezier(.2,.9,.3,1.15) both`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '0 0 auto',
          height: 3,
          background: `linear-gradient(90deg, transparent, ${hsl(statusHue, 95, 62)}, transparent)`,
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          height: 26,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '3px 10px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: hsl(statusHue, 100, 80),
            background: hsl(statusHue, 90, 50, 0.16),
            border: `1px solid ${hsl(statusHue, 90, 60, 0.35)}`,
          }}
        >
          {final ? (
            <CrownIcon size={14} />
          ) : (
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: phase === 'open' ? '#ef4444' : hsl(hue, 90, 65),
                animation: 'cp-dot 1.2s ease-in-out infinite',
              }}
            />
          )}
          {status}
        </span>
        {view.left !== null && !final && <Clock left={view.left} />}
      </div>
      {view.question && (
        <div
          className="cp-clamp cp-shadow"
          style={{ marginTop: 10, fontSize: 26, fontWeight: 700, lineHeight: '32px' }}
        >
          {view.question}
        </div>
      )}
      {view.timeShare !== null && !final && (
        <TimeTrack share={view.timeShare} hue={hue} hurry={(view.left ?? 0) <= HURRY_MS} />
      )}
      <ol style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'grid', gap: 7 }}>
        {view.options.map((option, index) => (
          <Row
            // biome-ignore lint/suspicious/noArrayIndexKey: an option's place is its number, and it never moves.
            key={index}
            index={index}
            label={option}
            count={tally.counts[index]}
            total={tally.total}
            hue={hue}
            hideBars={hideBars}
            lead={!hideBars && tally.leaders.includes(index)}
            final={final}
            pulse={pulses[index] ?? 0}
            number={number}
          />
        ))}
      </ol>
      <div
        className="cp-shadow"
        style={{
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          fontSize: 15,
          fontWeight: 600,
          color: 'rgba(255,255,255,.78)',
        }}
      >
        <span className="cp-ellipsis" style={{ minWidth: 0 }}>
          {footer}
          {!final && rules.length > 0 && (
            <span style={{ color: hsl(hue, 100, 78) }}> · {rules.join(' · ')}</span>
          )}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {bothPlatforms && tally.total > 0 && (
            <>
              <PlatformCount platform="twitch" count={number(tally.byPlatform.twitch)} />
              <PlatformCount platform="kick" count={number(tally.byPlatform.kick)} />
            </>
          )}
          <span style={{ color: '#fff', fontWeight: 800 }}>{votes(tally.total)}</span>
        </span>
      </div>
    </div>
  );
}

function Clock({ left }: { left: number }) {
  const seconds = Math.ceil(left / 1000);
  const hurry = left <= HURRY_MS && left > 0;
  return (
    <span
      className="cp-shadow"
      style={{
        fontSize: 22,
        fontWeight: 800,
        color: hurry ? hsl(RED_HUE, 100, 70) : '#fff',
        animation: hurry ? 'cp-hurry 1s ease-in-out infinite' : undefined,
      }}
    >
      {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
    </span>
  );
}

function TimeTrack({ share, hue, hurry }: { share: number; hue: number; hurry: boolean }) {
  const fill = hurry ? RED_HUE : hue;
  return (
    <div
      style={{
        marginTop: 12,
        height: 5,
        borderRadius: 3,
        overflow: 'hidden',
        background: 'rgba(255,255,255,.1)',
      }}
    >
      <div
        style={{
          height: '100%',
          transformOrigin: 'left',
          transform: `scaleX(${share})`,
          background: `linear-gradient(90deg, ${hsl(fill, 90, 48)}, ${hsl(fill, 100, 66)})`,
          transition: 'transform .25s linear, background .4s',
        }}
      />
    </div>
  );
}

function Row({
  index,
  label,
  count,
  total,
  hue,
  hideBars,
  lead,
  final,
  pulse,
  number,
}: {
  index: number;
  label: string;
  count: number;
  total: number;
  hue: number;
  hideBars: boolean;
  lead: boolean;
  final: boolean;
  pulse: number;
  number: (n: number) => string;
}) {
  const share = total > 0 ? count / total : 0;
  const won = final && lead;
  const dim = final && !lead && total > 0;
  const fillHue = won ? GOLD_HUE : hue;
  const style: CSSProperties = {
    position: 'relative',
    height: 46,
    borderRadius: 10,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 14px 0 8px',
    background: 'rgba(255,255,255,.07)',
    boxShadow: won ? undefined : 'inset 0 0 0 1px rgba(255,255,255,.07)',
    opacity: dim ? 0.5 : 1,
    transition: 'opacity .5s',
    animation: `cp-row .4s ease-out ${index * 60}ms both${won ? ', cp-win 1.4s ease-in-out .2s 3 both' : ''}`,
  };
  return (
    <li style={style} data-lead={lead || undefined}>
      {!hideBars && (
        // Scaled, not resized, so the fill's move stays on the compositor.
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'left',
            transform: `scaleX(${share})`,
            background: `linear-gradient(90deg, ${hsl(fillHue, 85, 42, lead ? 0.95 : 0.6)}, ${hsl(fillHue, 90, 56, lead ? 0.95 : 0.6)})`,
            transition: 'transform .6s cubic-bezier(.2,.9,.3,1), background .5s',
          }}
        />
      )}
      {pulse > 0 && (
        <div
          key={pulse}
          style={{
            position: 'absolute',
            inset: 0,
            background: '#fff',
            opacity: 0,
            animation: 'cp-flash .45s ease-out',
          }}
        />
      )}
      <span
        style={{
          position: 'relative',
          flexShrink: 0,
          width: 30,
          height: 30,
          borderRadius: 8,
          display: 'grid',
          placeItems: 'center',
          fontSize: 18,
          fontWeight: 800,
          color: '#0b0b10',
          background: hsl(fillHue, 95, won ? 60 : 72),
          boxShadow: 'inset 0 -2px 0 rgba(0,0,0,.25)',
        }}
      >
        {index + 1}
      </span>
      <span
        className="cp-ellipsis cp-shadow"
        style={{ position: 'relative', flex: 1, minWidth: 0, fontSize: 20, fontWeight: 700 }}
      >
        {label}
      </span>
      {won && (
        <span style={{ position: 'relative', animation: 'cp-crown .6s ease-out .15s both' }}>
          <CrownIcon size={22} />
        </span>
      )}
      {!hideBars && (
        <span
          className="cp-shadow"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, opacity: 0.75 }}>{number(count)}</span>
          <span
            key={pulse}
            style={{
              minWidth: 52,
              textAlign: 'right',
              fontSize: 22,
              fontWeight: 800,
              animation: pulse > 0 ? 'cp-bump .35s ease-out' : undefined,
            }}
          >
            {Math.round(share * 100)}%
          </span>
        </span>
      )}
    </li>
  );
}

function PlatformCount({ platform, count }: { platform: SubathonPlatform; count: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span
        style={{ width: 8, height: 8, borderRadius: '50%', background: PLATFORM_COLORS[platform] }}
      />
      {count}
    </span>
  );
}

function CrownIcon({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path
        d="M3 8.5 7.5 12 12 5l4.5 7L21 8.5 19 18H5Z"
        fill={hsl(GOLD_HUE, 95, 60)}
        stroke={hsl(GOLD_HUE, 70, 22)}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
