import { type ReactNode, useId } from 'react';
import { FieldLabel } from '#/components/ui/field-label';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { TextField } from '#/components/ui/text-field';
import { useI18n } from '#/lib/i18n';

export type ChannelPlatforms = 'both' | 'twitch' | 'kick';

interface ChannelFieldsProps {
  platforms: ChannelPlatforms;
  onPlatformsChange: (platforms: ChannelPlatforms) => void;
  twitch: string;
  onTwitchChange: (channel: string) => void;
  kick: string;
  onKickChange: (channel: string) => void;
  /** Replaces the generic Platforms tip with a widget-specific one. */
  platformsTip?: string;
  /** Cell beside Platforms, e.g. Chat Box's Platform Indicator. Without it Platforms spans the row. */
  aside?: ReactNode;
  /** Disables everything, e.g. while a tool is running. */
  disabled?: boolean;
}

/**
 * Platforms picker plus the Twitch and Kick channel inputs. The input for a platform that
 * isn't picked is disabled, not hidden, so the layout never jumps.
 */
export function ChannelFields({
  platforms,
  onPlatformsChange,
  twitch,
  onTwitchChange,
  kick,
  onKickChange,
  platformsTip,
  aside,
  disabled,
}: ChannelFieldsProps) {
  const { t } = useI18n();
  const id = useId();
  const options: SegmentedOption<ChannelPlatforms>[] = [
    { value: 'both', label: t('common.platformBoth') },
    { value: 'twitch', label: 'Twitch' },
    { value: 'kick', label: 'Kick' },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className={aside ? undefined : 'sm:col-span-2'}>
        <FieldLabel id={`${id}-platforms`} tip={platformsTip ?? t('common.platformsTip')}>
          {t('common.platforms')}
        </FieldLabel>
        <SegmentedControl
          labelledBy={`${id}-platforms`}
          value={platforms}
          onChange={onPlatformsChange}
          options={options}
          disabled={disabled}
        />
      </div>
      {aside}
      <TextField
        label={t('common.twitchChannel')}
        tip={t('common.channelTip')}
        value={twitch}
        onChange={onTwitchChange}
        placeholder={t('common.channelPlaceholder')}
        disabled={disabled || platforms === 'kick'}
        autoComplete="off"
        spellCheck={false}
      />
      <TextField
        label={t('common.kickChannel')}
        tip={t('common.channelTip')}
        value={kick}
        onChange={onKickChange}
        placeholder={t('common.channelPlaceholder')}
        disabled={disabled || platforms === 'twitch'}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
