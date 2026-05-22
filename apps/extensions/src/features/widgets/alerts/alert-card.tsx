import { useEffect, useState } from 'react';
import type { AlertEvent } from '#/lib/alert-config';
import { ALERT_CONFIG } from '#/lib/alert-config';

interface AlertCardProps {
  alert: AlertEvent;
  glow?: boolean;
}

type AnimationPhase = 'entering' | 'visible' | 'exiting';

// Inline SVG icons
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function AlertIcon({ type }: { type: AlertEvent['type'] }) {
  const config = ALERT_CONFIG[type];
  switch (config.iconType) {
    case 'user':
      return <UserIcon />;
    case 'star':
      return <StarIcon />;
    case 'heart':
      return <HeartIcon />;
    default:
      return <UserIcon />;
  }
}

export function AlertCard({ alert, glow = true }: AlertCardProps) {
  const [phase, setPhase] = useState<AnimationPhase>('entering');
  const config = ALERT_CONFIG[alert.type];

  useEffect(() => {
    // Entering -> Visible (after enter animation)
    const enterTimer = setTimeout(() => {
      setPhase('visible');
    }, 300);

    // Visible -> Exiting (after display duration minus enter time)
    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, 3000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  const getPhaseClasses = () => {
    switch (phase) {
      case 'entering':
        return 'opacity-0 translate-y-5 scale-95';
      case 'visible':
        return 'opacity-100 translate-y-0 scale-100';
      case 'exiting':
        return 'opacity-0 -translate-y-2.5 scale-95';
      default:
        return '';
    }
  };

  return (
    <div
      className={`relative flex items-center gap-3 px-5 py-3 rounded-lg backdrop-blur-md
        transition-all duration-300 ease-out overflow-hidden
        ${getPhaseClasses()}`}
      style={{
        backgroundColor: 'rgba(10, 10, 10, 0.85)',
        border: `1px solid ${glow ? config.borderColor : 'rgba(255,255,255,0.1)'}`,
        boxShadow: glow ? `0 0 20px ${config.glowColor}, inset 0 0 20px rgba(0,0,0,0.5)` : 'none',
        minWidth: '280px',
      }}
    >
      {/* Animated background glow */}
      {glow && (
        <div
          className="absolute inset-0 opacity-20 animate-pulse"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${config.color}, transparent 70%)`,
          }}
        />
      )}

      {/* Icon */}
      <div
        className="relative z-10 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full"
        style={{
          backgroundColor: `${config.color}20`,
          color: config.color,
          border: `1px solid ${config.borderColor}`,
        }}
      >
        <AlertIcon type={alert.type} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-w-0">
        <span
          className="text-[10px] font-bold uppercase tracking-widest font-display"
          style={{ color: config.color }}
        >
          {config.label}
        </span>
        <span className="text-white font-display text-sm font-bold truncate">
          {alert.data.name}
        </span>
        {alert.data.amount && (
          <span className="text-[10px] text-white/60 font-display">
            {alert.data.amount}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-white/10">
        <div
          className="h-full origin-left animate-shrink-width"
          style={{
            backgroundColor: config.color,
            animationDuration: '3000ms',
          }}
        />
      </div>
    </div>
  );
}
