import { type ReactNode, useId } from 'react';
import { FieldLabel } from '#/components/ui/field-label';
import { SegmentedControl, type SegmentedOption } from '#/components/ui/segmented-control';
import { TextField } from '#/components/ui/text-field';
import { useI18n } from '#/lib/i18n';
import type { ChannelPlatforms } from '#/lib/url-params';

export type { ChannelPlatforms };

interface ChannelFieldsProps {
  platforms: ChannelPlatforms;
  onPlatformsChange: (platforms: ChannelPlatforms) => void;
  twitch: string;
  onTwitchChange: (channel: string) => void;
  kick: string;
  onKickChange: (channel: string) => void;
  youtube?: string;
  onYoutubeChange?: (channel: string) => void;
  /** Whether a valid YouTube channel is present/detected. When false, YouTube input is disabled. */
  hasYoutubeChannel?: boolean;
  /** Legacy alias for hasYoutubeChannel. */
  hasYoutubeToken?: boolean;
  /** Optional notice shown beneath the YouTube field when authorization or connection is required. */
  youtubeNotice?: ReactNode;
  /** Replaces the generic Platforms tip with a widget-specific one. */
  platformsTip?: string;
  /** Cell beside Platforms, e.g. Chat Box's Platform Indicator. Without it Platforms spans the row. */
  aside?: ReactNode;
  /** Disables everything, e.g. while a tool is running. */
  disabled?: boolean;
}

/**
 * Platforms picker plus the Twitch, Kick, and optional YouTube channel inputs. The input for a platform that
 * isn't picked is disabled, not hidden, so the layout never jumps.
 */
export function ChannelFields({
  platforms,
  onPlatformsChange,
  twitch,
  onTwitchChange,
  kick,
  onKickChange,
  youtube,
  onYoutubeChange,
  hasYoutubeChannel,
  hasYoutubeToken,
  youtubeNotice,
  platformsTip,
  aside,
  disabled,
}: ChannelFieldsProps) {
  const hasValidChannel = hasYoutubeChannel ?? hasYoutubeToken ?? true;
  const { t } = useI18n();
  const id = useId();
  const options: SegmentedOption<ChannelPlatforms>[] = onYoutubeChange
    ? [
        { value: 'both', label: t('common.platformAll') },
        { value: 'twitch', label: 'Twitch' },
        { value: 'kick', label: 'Kick' },
        { value: 'youtube', label: 'YouTube' },
      ]
    : [
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
        disabled={disabled || platforms === 'kick' || platforms === 'youtube'}
        autoComplete="off"
        spellCheck={false}
      />
      <TextField
        label={t('common.kickChannel')}
        tip={t('common.channelTip')}
        value={kick}
        onChange={onKickChange}
        placeholder={t('common.channelPlaceholder')}
        disabled={disabled || platforms === 'twitch' || platforms === 'youtube'}
        autoComplete="off"
        spellCheck={false}
      />
      {onYoutubeChange && (
        <div className="sm:col-span-2">
          <TextField
            label="YouTube Channel"
            tip={
              hasValidChannel
                ? 'Connected YouTube channel from Senchabot Dashboard'
                : 'Connected YouTube channel required from Senchabot Dashboard Tools'
            }
            value={hasValidChannel ? (youtube ?? '') : ''}
            onChange={() => {}}
            placeholder={
              hasValidChannel
                ? 'Connected via Senchabot'
                : 'Connect YouTube in Senchabot Dashboard to enable'
            }
            disabled={true}
            autoComplete="off"
            spellCheck={false}
          />
          {youtubeNotice}
        </div>
      )}
    </div>
  );
}
