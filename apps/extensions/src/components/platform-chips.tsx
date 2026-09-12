import type { WidgetPlatform } from '#/lib/widgets';

const PLATFORM_MARKS: Record<WidgetPlatform, { label: string; color: string }> = {
  twitch: { label: 'Twitch', color: '#9146FF' },
  kick: { label: 'Kick', color: '#53FC18' },
};

/** Small "Twitch" / "Kick" chips; the brand colour is only the dot, so text stays readable. */
export function PlatformChips({
  platforms,
  className = '',
}: {
  platforms: readonly WidgetPlatform[];
  className?: string;
}) {
  return (
    <span className={`flex flex-wrap gap-1 ${className}`}>
      {platforms.map((platform) => (
        <span
          key={platform}
          className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-1.5 py-px text-[10px] font-medium leading-4 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full"
            style={{ background: PLATFORM_MARKS[platform].color }}
          />
          {PLATFORM_MARKS[platform].label}
        </span>
      ))}
    </span>
  );
}
