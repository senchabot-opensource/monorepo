import { useEffect, useRef, useState } from 'react';
import { TextField } from '#/components/ui/text-field';
import { TYPING_PAUSE_MS } from '#/hooks/use-debounced-value';
import { type ChannelPlatform, channelFromInput, kickDashName } from '#/lib/channel-name';
import { useI18n } from '#/lib/i18n';

interface ChannelFieldProps {
  platform: ChannelPlatform;
  label: string;
  value: string;
  onChange: (channel: string) => void;
  disabled?: boolean;
}

/**
 * A Twitch or Kick channel field. A channel link typed, pasted or brought back from a pasted
 * widget URL becomes the channel's name, and a Kick name with _ that kick.com has no channel at
 * becomes its - spelling when that one is a channel. The widgets read the name in their URL as it
 * is.
 */
export function ChannelField({ platform, label, value, onChange, disabled }: ChannelFieldProps) {
  const { t } = useI18n();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Typing and pasting go through onChange below; this catches a link set from outside, e.g.
  // by a pasted widget URL made before the fields took links.
  useEffect(() => {
    const name = channelFromInput(platform, value);
    if (name !== value) onChangeRef.current(name);
  }, [platform, value]);

  const dashed = useKickDashName(value, onChangeRef, platform === 'kick' && !disabled);

  return (
    <TextField
      label={label}
      tip={t('common.channelTip')}
      hint={dashed ? <DashHint name={dashed} /> : undefined}
      value={value}
      onChange={(text) => onChange(channelFromInput(platform, text))}
      placeholder={t('common.channelPlaceholder')}
      disabled={disabled}
      autoComplete="off"
      spellCheck={false}
    />
  );
}

/** Why a Kick name changed, with its new link kept on one line. */
function DashHint({ name }: { name: string }) {
  const { t } = useI18n();
  const [before, after = ''] = t('common.kickDashName').split('{link}');
  return (
    <>
      {before}
      <span className="whitespace-nowrap">kick.com/{name}</span>
      {after}
    </>
  );
}

/**
 * Once typing pauses, switches a Kick name with _ to its - spelling when only that one is a
 * channel on kick.com. Returns the new name while the field still holds it, for the hint that
 * says why it changed.
 */
function useKickDashName(
  name: string,
  onChangeRef: { readonly current: (name: string) => void },
  enabled: boolean,
): string {
  const [dashed, setDashed] = useState('');

  useEffect(() => {
    if (!enabled || !name.includes('_')) return;
    let current = true;
    const timer = setTimeout(async () => {
      const found = await kickDashName(name);
      if (!current || !found) return;
      setDashed(found);
      onChangeRef.current(found);
    }, TYPING_PAUSE_MS);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [name, enabled, onChangeRef]);

  return enabled && dashed && dashed === name ? dashed : '';
}
