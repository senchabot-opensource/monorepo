import { createFileRoute, useLocation } from '@tanstack/react-router';
import type { ComponentType, CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import type { IconProps } from '#/components/icons';
import * as Icons from '#/components/social-icons';
import { Frame, panelStyle } from '#/features/presets/frame';
import { type Skin, skinFor } from '#/features/presets/skin';
import { OVERLAY_FONT_URL } from '#/features/widgets/overlay-style';
import { readSocialsAlign, type SocialsAlign } from '#/lib/socials-url';

export const Route = createFileRoute('/widgets/socials')({
  ssr: false,
  head: () => ({
    links: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      // The classic look's font, shared with the other classic overlays. A preset loads its own.
      { rel: 'stylesheet', href: OVERLAY_FONT_URL },
    ],
  }),
  component: SocialsWidget,
});

interface PlatformConfig {
  id: string;
  name: string;
  Icon: ComponentType<IconProps>;
  color: string;
  iconColor?: string;
}

const PLATFORMS: PlatformConfig[] = [
  { id: 'twitter', name: 'X / Twitter', Icon: Icons.XTwitterIcon, color: '#0f1419' },
  { id: 'youtube', name: 'YouTube', Icon: Icons.YoutubeIcon, color: '#ff0000' },
  { id: 'instagram', name: 'Instagram', Icon: Icons.InstagramIcon, color: '#e1306c' },
  { id: 'tiktok', name: 'TikTok', Icon: Icons.TiktokIcon, color: '#000000' },
  { id: 'twitch', name: 'Twitch', Icon: Icons.TwitchIcon, color: '#9146ff' },
  { id: 'kick', name: 'Kick', Icon: Icons.KickIcon, color: '#53fc18', iconColor: '#000' },
  { id: 'discord', name: 'Discord', Icon: Icons.DiscordIcon, color: '#5865F2' },
  { id: 'github', name: 'GitHub', Icon: Icons.GithubIcon, color: '#181717' },
  { id: 'reddit', name: 'Reddit', Icon: Icons.RedditIcon, color: '#ff4500' },
  { id: 'bluesky', name: 'Bluesky', Icon: Icons.BlueskyIcon, color: '#0285FF' },
  { id: 'threads', name: 'Threads', Icon: Icons.ThreadsIcon, color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', Icon: Icons.LinkedinIcon, color: '#0077B5' },
];

/** Half the bubble's height: a full pill in the classic look, scaled by a preset's radius. */
const PILL_RADIUS = 40;

// A bubble against an edge is pinned to it, grows out of it, and drops its round corners there.
const ALIGN_CLASSES: Record<SocialsAlign, { position: string; radius: string }> = {
  center: { position: '', radius: 'rounded-full' },
  left: { position: 'left-0 origin-left', radius: 'rounded-r-full' },
  right: { position: 'right-0 origin-right', radius: 'rounded-l-full' },
};

/** Cuts the bubble off at the edge it's against; shadows and ornaments spill out elsewhere. */
const EDGE_CLIP: Record<SocialsAlign, string | undefined> = {
  center: undefined,
  left: 'inset(-64px -64px -64px 0)',
  right: 'inset(-64px 0 -64px -64px)',
};

/**
 * A preset's panel and frame behind the bubble. Against an edge, the panel runs past it by more
 * than its corner and corner ornaments, and the bubble's clip cuts it there, so every frame
 * meets the edge straight.
 */
function PresetPanel({ skin, align }: { skin: Skin; align: SocialsAlign }) {
  const overhang = Math.ceil(PILL_RADIUS * skin.radius) + 24;
  return (
    <span
      aria-hidden="true"
      style={{
        ...panelStyle(skin, PILL_RADIUS),
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: align === 'left' ? -overhang : 0,
        right: align === 'right' ? -overhang : 0,
      }}
    >
      <Frame skin={skin} radius={PILL_RADIUS} studs={false} />
    </span>
  );
}

function SocialsWidget() {
  const params = new URLSearchParams(useLocation({ select: (location) => location.searchStr }));
  const isDemo = params.get('demo') === '1';

  const activePlatforms = PLATFORMS.map((p) => ({
    ...p,
    username: isDemo ? `senchabot_${p.id}` : params.get(p.id)?.trim(),
  })).filter((p) => !!p.username);

  const animation = params.get('animation') || 'slideUp';
  const interval = parseInt(params.get('interval') || '10', 10) * 1000;
  const textColor = params.get('textColor') || '#ffffff';
  const pillColor = params.get('pillColor') || 'rgba(0, 0, 0, 0.5)';
  const align = readSocialsAlign(params.get('align'));
  // Unknown ids fall back to the classic look in skinFor.
  const skin = skinFor(params.get('preset'));
  const alignClasses = ALIGN_CLASSES[align];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activePlatforms.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activePlatforms.length);
    }, interval);

    return () => clearInterval(timer);
  }, [activePlatforms.length, interval]);

  if (activePlatforms.length === 0) {
    return null;
  }

  // A preset paints the bubble itself; its text and colors replace the classic ones.
  const pillStyle: CSSProperties = skin
    ? {
        color: skin.text,
        fontFamily: skin.display,
        fontSynthesis: 'none',
        clipPath: EDGE_CLIP[align],
      }
    : { backgroundColor: pillColor, color: textColor };

  return (
    <div
      className="w-screen h-screen overflow-hidden flex items-center justify-center font-[Inter,sans-serif]"
      data-testid="socials"
      data-align={align}
      data-preset={skin?.id}
    >
      {skin && <link rel="stylesheet" href={skin.fontHref} precedence="default" />}
      <div className="relative w-full h-full flex items-center justify-center">
        {activePlatforms.map((platform, index) => {
          const isActive = index === currentIndex;
          const isPrev =
            index === (currentIndex - 1 + activePlatforms.length) % activePlatforms.length;

          let animClass = 'opacity-0';
          if (animation === 'slideLeft') {
            if (isActive) animClass = 'translate-x-0 opacity-100';
            else if (isPrev && activePlatforms.length > 1) animClass = '-translate-x-16 opacity-0';
            else animClass = 'translate-x-16 opacity-0';
          } else if (animation === 'scale') {
            if (isActive) animClass = 'scale-100 opacity-100';
            else if (isPrev && activePlatforms.length > 1) animClass = 'scale-125 opacity-0';
            else animClass = 'scale-75 opacity-0';
          } else if (animation === 'fade') {
            if (isActive) animClass = 'opacity-100';
            else animClass = 'opacity-0';
          } else {
            // default slideUp
            if (isActive) animClass = 'translate-y-0 opacity-100';
            else if (isPrev && activePlatforms.length > 1) animClass = '-translate-y-16 opacity-0';
            else animClass = 'translate-y-16 opacity-0';
          }

          return (
            <div
              key={platform.id}
              data-testid="socials-pill"
              className={`absolute flex items-center gap-4 px-6 py-4 ${skin ? '' : `${alignClasses.radius} shadow-lg`} ${alignClasses.position} transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${animClass}`}
              style={pillStyle}
            >
              {skin && <PresetPanel skin={skin} align={align} />}
              <div
                className="relative p-2 rounded-full"
                style={{
                  backgroundColor: platform.color,
                  color: platform.iconColor || '#fff',
                  // The preset's corners and a ring in its frame color tie the badge to the panel.
                  ...(skin && {
                    borderRadius: (PILL_RADIUS / 2) * skin.radius,
                    boxShadow: `0 0 0 2px ${skin.frame}`,
                  }),
                }}
              >
                <platform.Icon className="size-8" />
              </div>
              <span
                className={`relative text-3xl font-bold tracking-tight ${skin ? '' : 'drop-shadow-sm'}`}
                style={skin ? { textShadow: skin.textShadow } : undefined}
              >
                {platform.username}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
