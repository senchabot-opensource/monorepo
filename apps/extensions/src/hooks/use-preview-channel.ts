import { useCallback, useEffect, useRef, useState } from 'react';

type Tagged = { preview: string };
/** A message without its preview id, which the sender adds. */
type Untagged<M> = M extends unknown ? Omit<M, 'preview'> : never;

/**
 * A setup page's end of its preview's BroadcastChannel. `previewId` goes in the preview's URL, so
 * what `send` sends reaches that preview only, not the previews and demos in other tabs.
 */
export function usePreviewSender<M extends Tagged>(name: string) {
  const [previewId] = useState(() => Math.random().toString(36).slice(2, 10));
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(name);
    channelRef.current = channel;
    return () => channel.close();
  }, [name]);

  const send = useCallback(
    (message: Untagged<M>) => channelRef.current?.postMessage({ ...message, preview: previewId }),
    [previewId],
  );
  return { previewId, send };
}

/** A preview's end: `onMessage` gets what its own setup page sends, while `enabled`. */
export function usePreviewReceiver<M extends Tagged>(
  name: string,
  previewId: string | undefined,
  enabled: boolean,
  onMessage: (message: M) => void,
) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!enabled || !previewId || typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(name);
    channel.onmessage = ({ data }: MessageEvent<M>) => {
      if (data?.preview === previewId) onMessageRef.current(data);
    };
    return () => channel.close();
  }, [name, previewId, enabled]);
}
