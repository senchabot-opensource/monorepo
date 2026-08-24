import { useId } from 'react';

const HostBadge = ({ className = 'h-[1em] w-[1em]' }: { className?: string } = {}) => {
  const g1 = useId();
  const g2 = useId();
  const g3 = useId();
  const g4 = useId();
  const g5 = useId();
  const g6 = useId();

  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id={g1}
          gradientUnits="userSpaceOnUse"
          x1="4"
          y1="180.5864"
          x2="4"
          y2="200.6666"
          gradientTransform="matrix(1 0 0 1 0 -182)"
        >
          <stop offset="0" stopColor="#FF1CD2" />
          <stop offset="0.99" stopColor="#B20DFF" />
        </linearGradient>
        <linearGradient
          id={g2}
          gradientUnits="userSpaceOnUse"
          x1="8"
          y1="180.5864"
          x2="8"
          y2="200.6666"
          gradientTransform="matrix(1 0 0 1 0 -182)"
        >
          <stop offset="0" stopColor="#FF1CD2" />
          <stop offset="0.99" stopColor="#B20DFF" />
        </linearGradient>
        <linearGradient
          id={g3}
          gradientUnits="userSpaceOnUse"
          x1="2.4"
          y1="180.5864"
          x2="2.4"
          y2="200.6666"
          gradientTransform="matrix(1 0 0 1 0 -182)"
        >
          <stop offset="0" stopColor="#FF1CD2" />
          <stop offset="0.99" stopColor="#B20DFF" />
        </linearGradient>
        <linearGradient
          id={g4}
          gradientUnits="userSpaceOnUse"
          x1="12"
          y1="180.5864"
          x2="12"
          y2="200.6666"
          gradientTransform="matrix(1 0 0 1 0 -182)"
        >
          <stop offset="0" stopColor="#FF1CD2" />
          <stop offset="0.99" stopColor="#B20DFF" />
        </linearGradient>
        <linearGradient
          id={g5}
          gradientUnits="userSpaceOnUse"
          x1="8"
          y1="180.5864"
          x2="8"
          y2="200.6666"
          gradientTransform="matrix(1 0 0 1 0 -182)"
        >
          <stop offset="0" stopColor="#FF1CD2" />
          <stop offset="0.99" stopColor="#B20DFF" />
        </linearGradient>
        <linearGradient
          id={g6}
          gradientUnits="userSpaceOnUse"
          x1="13.6"
          y1="180.5864"
          x2="13.6"
          y2="200.6666"
          gradientTransform="matrix(1 0 0 1 0 -182)"
        >
          <stop offset="0" stopColor="#FF1CD2" />
          <stop offset="0.99" stopColor="#B20DFF" />
        </linearGradient>
      </defs>
      <rect x="3.2" y="9.6" fill={`url(#${g1})`} width="1.6" height="1.6" />
      <polygon
        fill={`url(#${g2})`}
        points="6.4,9.6 9.6,9.6 9.6,8 11.2,8 11.2,1.6 9.6,1.6 9.6,0 6.4,0 6.4,1.6 4.8,1.6 4.8,8 6.4,8"
      />
      <rect x="1.6" y="6.4" fill={`url(#${g3})`} width="1.6" height="3.2" />
      <rect x="11.2" y="9.6" fill={`url(#${g4})`} width="1.6" height="1.6" />
      <polygon
        fill={`url(#${g5})`}
        points="4.8,12.8 6.4,12.8 6.4,14.4 4.8,14.4 4.8,16 11.2,16 11.2,14.4 9.6,14.4 9.6,12.8 11.2,12.8 11.2,11.2 4.8,11.2"
      />
      <rect x="12.8" y="6.4" fill={`url(#${g6})`} width="1.6" height="3.2" />
    </svg>
  );
};

const ModeratorBadge = ({ className = 'h-[1em] w-[1em]' }: { className?: string } = {}) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <path
      d="M11.7,1.3v1.5h-1.5v1.5 H8.7v1.5H7.3v1.5H5.8V5.8h-3v3h1.5v1.5H2.8v1.5H1.3v3h3v-1.5h1.5v-1.5h1.5v1.5h3v-3H8.7V8.7h1.5V7.3h1.5V5.8h1.5V4.3h1.5v-3 C14.7,1.3,11.7,1.3,11.7,1.3z"
      fill="#00C7FF"
    />
  </svg>
);

const VipBadge = ({ className = 'h-[1em] w-[1em]' }: { className?: string } = {}) => {
  const g = useId();

  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id={g}
          gradientUnits="userSpaceOnUse"
          x1="8"
          y1="-163.4867"
          x2="8"
          y2="-181.56"
          gradientTransform="matrix(1 0 0 -1 0 -164)"
        >
          <stop offset="0" stopColor="#FFC900" />
          <stop offset="0.99" stopColor="#FF9500" />
        </linearGradient>
      </defs>
      <path
        d="M13.9,2.4v1.1h-1.2v2.3 h-1.1v1.1h-1.1V4.6H9.3V1.3H6.7v3.3H5.6v2.3H4.4V5.8H3.3V3.5H2.1V2.4H0v12.3h16V2.4H13.9z"
        fill={`url(#${g})`}
      />
    </svg>
  );
};

const VerifiedBadge = ({ className = 'h-[1em] w-[1em]' }: { className?: string } = {}) => {
  const g = useId();

  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id={g}
          x1="33.791%"
          y1="97.416%"
          x2="65.541%"
          y2="4.5%"
          gradientUnits="objectBoundingBox"
        >
          <stop stopColor="#1EFF00" />
          <stop offset="0.99" stopColor="#00FF8C" />
        </linearGradient>
      </defs>
      <path
        d="M16 6.83512L13.735 4.93512L13.22 2.02512H10.265L8 0.120117L5.735 2.02012H2.78L2.265 4.93012L0 6.83512L1.48 9.39512L0.965 12.3051L3.745 13.3151L5.225 15.8751L8.005 14.8651L10.785 15.8751L12.265 13.3151L15.045 12.3051L14.53 9.39512L16.01 6.83512H16ZM6.495 12.4051L2.79 8.69512L4.205 7.28012L6.495 9.57512L11.29 4.78012L12.705 6.19512L6.5 12.4001L6.495 12.4051Z"
        fill={`url(#${g})`}
      />
    </svg>
  );
};

const SubscriberBadge = ({ className = 'h-[1em] w-[1em]' }: { className?: string } = {}) => {
  const g1 = useId();
  const g2 = useId();
  const g3 = useId();
  const g4 = useId();
  const g5 = useId();
  const g6 = useId();
  const g7 = useId();

  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id={g1}
          gradientUnits="userSpaceOnUse"
          x1="-2.386"
          y1="-151.2764"
          x2="42.2073"
          y2="-240.4697"
          gradientTransform="matrix(1 0 0 -1 0 -164)"
        >
          <stop offset="0" stopColor="#E1FF00" />
          <stop offset="0.99" stopColor="#2AA300" />
        </linearGradient>
        <linearGradient
          id={g2}
          gradientUnits="userSpaceOnUse"
          x1="-5.3836"
          y1="-158.3055"
          x2="14.9276"
          y2="-189.0962"
          gradientTransform="matrix(1 0 0 -1 0 -164)"
        >
          <stop offset="0" stopColor="#E1FF00" />
          <stop offset="0.99" stopColor="#2AA300" />
        </linearGradient>
        <linearGradient
          id={g3}
          gradientUnits="userSpaceOnUse"
          x1="3.65"
          y1="-160.7004"
          x2="3.65"
          y2="-184.1244"
          gradientTransform="matrix(1 0 0 -1 0 -164)"
        >
          <stop offset="0" stopColor="#E1FF00" />
          <stop offset="0.99" stopColor="#2AA300" />
        </linearGradient>
        <linearGradient
          id={g4}
          gradientUnits="userSpaceOnUse"
          x1="22.9659"
          y1="-167.65"
          x2="-5.3142"
          y2="-167.65"
          gradientTransform="matrix(1 0 0 -1 0 -164)"
        >
          <stop offset="0" stopColor="#E1FF00" />
          <stop offset="0.99" stopColor="#2AA300" />
        </linearGradient>
        <linearGradient
          id={g5}
          gradientUnits="userSpaceOnUse"
          x1="12.35"
          y1="-187.6089"
          x2="12.35"
          y2="-161.5965"
          gradientTransform="matrix(1 0 0 -1 0 -164)"
        >
          <stop offset="0" stopColor="#E1FF00" />
          <stop offset="0.99" stopColor="#2AA300" />
        </linearGradient>
        <linearGradient
          id={g6}
          gradientUnits="userSpaceOnUse"
          x1="-6.5494"
          y1="-176.35"
          x2="21.3285"
          y2="-176.35"
          gradientTransform="matrix(1 0 0 -1 0 -164)"
        >
          <stop offset="0" stopColor="#E1FF00" />
          <stop offset="0.99" stopColor="#2AA300" />
        </linearGradient>
        <linearGradient
          id={g7}
          gradientUnits="userSpaceOnUse"
          x1="6.72"
          y1="-169.44"
          x2="12.2267"
          y2="-180.4533"
          gradientTransform="matrix(1 0 0 -1 0 -164)"
        >
          <stop offset="0" stopColor="#E1FF00" />
          <stop offset="0.99" stopColor="#2AA300" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${g1})`}
        d="M14.8,7.3V6.1h-2.4V4.9H11V3.7H9.9V1.2H8.7V0H7.3v1.2H6.1v2.5H5v1.2H3.7v1.3H1.2v1.2H0v1.4 h1.2V10h2.4v1.3H5v1.2h1.2V15h1.2v1h1.3v-1.2h1.2v-2.5H11v-1.2h1.3V9.9h2.4V8.7H16V7.3H14.8z"
      />
      <path fill={`url(#${g2})`} d="M7.3,7.3v7.5H6.1v-2.5H5v-1.2H3.7V9.9H1.2 V8.7H0V7.3H7.3z" />
      <path fill={`url(#${g3})`} d="M7.3,7.3v7.5H6.1v-2.5H5v-1.2H3.7V9.9H1.2 V8.7H0V7.3H7.3z" />
      <path fill={`url(#${g4})`} d="M8.7,0v7.3H1.2V6.1h2.4V4.9H5V3.7h1.2V1.2 h1.2V0H8.7z" />
      <path
        fill={`url(#${g5})`}
        d="M8.7,8.7V1.2h1.2v2.5H11v1.2h1.3v1.3h2.4 v1.2H16v1.4L8.7,8.7L8.7,8.7z"
      />
      <path fill={`url(#${g6})`} d="M7.3,16V8.7h7.4v1.2h-2.4v1.3H11v1.2H9.9 v2.5H8.7V16H7.3z" />
      <path fill={`url(#${g7})`} d="M8.7,7.3H7.3v1.4h1.3L8.7,7.3L8.7,7.3z" />
    </svg>
  );
};

const OgBadge = ({ className = 'h-[1em] w-[1em]' }: { className?: string } = {}) => {
  const g1 = useId();
  const g2 = useId();

  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id={g1}
          gradientUnits="userSpaceOnUse"
          x1="12.2"
          y1="-180"
          x2="12.2"
          y2="-165.2556"
          gradientTransform="matrix(1 0 0 -1 0 -164)"
        >
          <stop offset="0" stopColor="#00FFF2" />
          <stop offset="0.99" stopColor="#006399" />
        </linearGradient>
        <linearGradient
          id={g2}
          gradientUnits="userSpaceOnUse"
          x1="3.7636"
          y1="-164.265"
          x2="4.0623"
          y2="-179.9352"
          gradientTransform="matrix(1 0 0 -1 0 -164)"
        >
          <stop offset="0" stopColor="#00FFF2" />
          <stop offset="0.99" stopColor="#006399" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${g1})`}
        d="M16,16H9.2v-0.8H8.4v-8h0.8V6.4H16v3.2h-4.5v4.8H13v-1.6h-0.8v-1.6H16V16z"
      />
      <path
        fill={`url(#${g2})`}
        d="M6.8,8.8v0.8h-6V8.8H0v-8h0.8V0h6.1v0.8 h0.8v8H6.8z M4.5,6.4V1.6H3v4.8H4.5z"
      />
      <path
        fill="#00FFF2"
        d="M6.8,15.2V16h-6v-0.8H0V8.8h0.8V8h6.1v0.8h0.8v6.4C7.7,15.2,6.8,15.2,6.8,15.2z M4.5,14.4V9.6H3v4.8 C3,14.4,4.5,14.4,4.5,14.4z"
      />
      <path fill="#00FFF2" d="M16,8H9.2V7.2H8.4V0.8h0.8V0H16v1.6h-4.5v4.8H13V4.8h-0.8V3.2H16V8z" />
    </svg>
  );
};

const FounderBadge = ({ className = 'h-[1em] w-[1em]' }: { className?: string } = {}) => {
  const g = useId();

  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id={g}
          gradientUnits="userSpaceOnUse"
          x1="7.874"
          y1="20.2333"
          x2="8.1274"
          y2="-0.3467"
          gradientTransform="matrix(1 0 0 -1 0 18)"
        >
          <stop offset="0" stopColor="#FFC900" />
          <stop offset="0.99" stopColor="#FF9500" />
        </linearGradient>
      </defs>
      <path
        d="M14.6,4V2.7h-1.3V1.4H12V0H4v1.4H2.7v1.3H1.3V4H0v8h1.3v1.3h1.4v1.3H4V16h8v-1.4h1.3v-1.3h1.3V12H16V4H14.6z M9.9,12.9H6.7V6.4H4.5 V5.2h1V4.1h1v-1h3.4V12.9z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={`url(#${g})`}
      />
    </svg>
  );
};

const SubGifterBadge = ({ className = 'h-[1em] w-[1em]' }: { className?: string } = {}) => {
  const clip = useId();

  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <g clipPath={`url(#${clip})`}>
        <path
          d="M7.99999 9.14999V6.62499L0.484985 3.35999V6.34499L1.15499 6.63499V12.73L7.99999 15.995V9.14999Z"
          fill="#0269D4"
        />
        <path d="M8.00003 10.735V9.61501L1.15503 6.63501V7.70501L8.00003 10.735Z" fill="#0269D4" />
        <path
          d="M15.515 3.355V6.345L14.85 6.64V12.73L12.705 13.755L11.185 14.48L8.00499 15.995V6.715L4.81999 5.295H4.81499L3.29499 4.61L0.484985 3.355L3.66999 1.935L3.67999 1.93L5.09499 1.3L8.00499 0L10.905 1.3L12.32 1.925L12.33 1.935L15.515 3.355Z"
          fill="#04D0FF"
        />
        <path d="M14.845 6.63501V7.70501L8 10.735V9.61501L14.845 6.63501Z" fill="#0269D4" />
      </g>
      <defs>
        <clipPath id={clip}>
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const StaffBadge = ({ className = 'h-[1em] w-[1em]' }: { className?: string } = {}) => {
  const g = useId();

  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id={g}
          x1="33.791%"
          y1="97.416%"
          x2="65.541%"
          y2="4.5%"
          gradientUnits="objectBoundingBox"
        >
          <stop stopColor="#1EFF00" />
          <stop offset="0.99" stopColor="#00FF8C" />
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={`url(#${g})`}
        d="M2.07324 1.33331H6.51991V4.29331H7.99991V2.81331H9.47991V1.33331H13.9266V5.77998H12.4466V7.25998H10.9599V8.73998H12.4466V10.22H13.9266V14.6666H9.47991V13.1866H7.99991V11.7066H6.51991V14.6666H2.07324V1.33331Z"
      />
    </svg>
  );
};

const SidekickBadge = ({ className = 'h-[1em] w-[1em]' }: { className?: string } = {}) => {
  const g = useId();

  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        fill={`url(#${g})`}
        d="M0 5.5v11.3h2.3V20h2.3v3.2h2.2v3.2h6.9v-3.2h4.6v3.2H25v-3.2h2.3V20h2.3v-3.2H32V5.5h-9.2v3.2h-4.6V12h-4.5V8.7H9V5.5H0Zm13.7 13.7H7V16H4.6V9.6h2.3v3.2h4.5V16h2.3v3.2ZM27.4 16h-2.2v3.2h-6.9V16h2.3v-3.2h4.6V9.6h2.2V16Z"
      />
      <defs>
        <linearGradient
          id={g}
          x1="18.8"
          x2="11.7"
          y1="-2.7"
          y2="32.7"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6A4A" />
          <stop offset="1" stopColor="#C70C00" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const KickBadge = ({
  type,
  subBadges,
  className = 'h-[1em] w-[1em]',
}: {
  type: string;
  className?: string;
  subBadges?: {
    months?: number;
    badge_image?: { src?: string };
  }[];
}) => {
  const parts = type.toLowerCase().split('/');
  const t = parts[0] === 'sub' ? 'subscriber' : parts[0];
  const count = parseInt(parts[1] || '0', 10);

  if (t === 'subscriber' && subBadges && subBadges.length > 0) {
    const sorted = [...subBadges].sort((a, b) => (b.months ?? 0) - (a.months ?? 0));
    const badge = sorted.find((b) => count >= (b.months ?? 0)) || sorted[sorted.length - 1];

    if (badge?.badge_image?.src) {
      return (
        <img
          src={badge.badge_image.src}
          alt={`${count}-Month Subscriber`}
          title={type}
          className={`${className} object-contain inline-block`}
        />
      );
    }
  }

  switch (t) {
    case 'broadcaster':
      return <HostBadge className={className} />;
    case 'moderator':
      return <ModeratorBadge className={className} />;
    case 'vip':
      return <VipBadge className={className} />;
    case 'founder':
      return <FounderBadge className={className} />;
    case 'sub_gifter':
    case 'sub-gifter':
    case 'gifter':
      return <SubGifterBadge className={className} />;
    case 'og':
      return <OgBadge className={className} />;
    case 'staff':
    case 'admin':
      return <StaffBadge className={className} />;
    case 'verified':
      return <VerifiedBadge className={className} />;
    case 'subscriber':
      return <SubscriberBadge className={className} />;
    case 'sidekick':
    case 'tool':
    case 'bot':
      return <SidekickBadge className={className} />;
    default:
      return <span className="text-xs uppercase px-1 rounded">{type}</span>;
  }
};
