import { createFileRoute, useLocation } from '@tanstack/react-router';
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import type { IconProps } from '#/components/icons';
import * as Icons from '#/components/social-icons';
import { OVERLAY_FONT_URL } from '#/features/widgets/overlay-style';

export const Route = createFileRoute('/widgets/socials')({
  ssr: false,
  head: () => ({
    links: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
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

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center font-[Inter,sans-serif]">
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
              className={`absolute flex items-center gap-4 px-6 py-4 rounded-full shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${animClass}`}
              style={{ backgroundColor: pillColor, color: textColor }}
            >
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: platform.color, color: platform.iconColor || '#fff' }}
              >
                <platform.Icon className="size-8" />
              </div>
              <span className="text-3xl font-bold tracking-tight drop-shadow-sm">
                {platform.username}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
