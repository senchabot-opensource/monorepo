import { useId, useState } from 'react';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { TagInput, type TagItem } from '#/components/ui/tag-input';
import { useI18n } from '#/lib/i18n';
import { type ChatPlatform, type CommandUser, formatCommandUsers } from './command-users';

export const PLATFORM_LABELS: Record<ChatPlatform, string> = { twitch: 'Twitch', kick: 'Kick' };
const PLATFORM_COLORS: Record<ChatPlatform, string> = { twitch: '#9146FF', kick: '#53FC18' };
const PLATFORM_OPTIONS: SegmentedOption<ChatPlatform>[] = [
  { value: 'twitch', label: PLATFORM_LABELS.twitch },
  { value: 'kick', label: PLATFORM_LABELS.kick },
];

/** Brand-coloured dot for a platform; the name is there for screen readers and on hover. */
export function PlatformDot({ platform }: { platform: ChatPlatform }) {
  return (
    <span title={PLATFORM_LABELS[platform]} className="inline-flex shrink-0">
      <span
        aria-hidden="true"
        className="size-2 rounded-full"
        style={{ background: PLATFORM_COLORS[platform] }}
      />
      <span className="sr-only">{PLATFORM_LABELS[platform]}:</span>
    </span>
  );
}

const userId = (user: CommandUser) => formatCommandUsers([user]);

interface CommandUsersFieldProps {
  users: CommandUser[];
  onChange: (users: CommandUser[]) => void;
  /** Platforms the link listens to: picks the default platform and flags untagged old names. */
  platforms: { twitch: boolean; kick: boolean };
  label: string;
  tip?: string;
}

/** Chip list of the people allowed to run OBS commands, each saved with a platform. */
export function CommandUsersField({
  users,
  onChange,
  platforms,
  label,
  tip,
}: CommandUsersFieldProps) {
  const { t } = useI18n();
  const id = useId();
  const [picked, setPicked] = useState<ChatPlatform | null>(null);
  const bothPlatforms = platforms.twitch && platforms.kick;
  const onlyPlatform: ChatPlatform | null = bothPlatforms
    ? null
    : platforms.kick
      ? 'kick'
      : platforms.twitch
        ? 'twitch'
        : null;
  const platform = picked ?? onlyPlatform ?? 'twitch';

  const has = (p: ChatPlatform, name: string) =>
    users.some((u) => u.platform === p && u.name === name);

  const add = (text: string) => {
    // Chat shows mentions with an @, so people paste names that way.
    const name = text.replace(/^@/, '').trim().toLowerCase();
    if (name && !has(platform, name)) onChange([...users, { platform, name }]);
  };

  const assign = (user: CommandUser, p: ChatPlatform) =>
    onChange(
      has(p, user.name)
        ? users.filter((u) => u !== user)
        : users.map((u) => (u === user ? { platform: p, name: u.name } : u)),
    );

  const items: TagItem[] = users.map((user) => {
    const shown = user.platform ?? onlyPlatform;
    const needsPlatform = !user.platform && bothPlatforms;
    return {
      id: userId(user),
      content: (
        <>
          {shown && <PlatformDot platform={shown} />}
          <span className="truncate font-medium">{user.name}</span>
        </>
      ),
      removeLabel: t('obsBridge.removeUser', { name: user.name }),
      warning: needsPlatform,
      actions: needsPlatform
        ? PLATFORM_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => assign(user, option.value)}
              aria-label={t('obsBridge.assignUser', { name: user.name, platform: option.label })}
              className="rounded border border-amber-300 px-1 text-[10px] font-semibold leading-4 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:border-amber-500/40 dark:hover:bg-amber-500/20"
            >
              {option.label}
            </button>
          ))
        : undefined,
    };
  });

  return (
    <div className="space-y-2">
      <TagInput
        label={label}
        tip={tip}
        items={items}
        onAdd={add}
        onRemove={(removed) => onChange(users.filter((u) => userId(u) !== removed))}
        addLabel={t('obsBridge.addUser')}
        placeholder={t('obsBridge.userPlaceholder')}
        emptyText={t('obsBridge.usersEmpty')}
        before={
          <div className="w-28 shrink-0">
            <span id={`${id}-platform`} className="sr-only">
              {t('obsBridge.userPlatform')}
            </span>
            <SegmentedControl
              labelledBy={`${id}-platform`}
              value={platform}
              onChange={setPicked}
              options={PLATFORM_OPTIONS}
            />
          </div>
        }
      />
      {bothPlatforms && users.some((u) => !u.platform) && (
        <p className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs leading-relaxed text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          {t('obsBridge.pickPlatformWarning')}
        </p>
      )}
    </div>
  );
}
