import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePreviewReceiver, usePreviewSender } from './use-preview-channel';

type Msg = { type: 'test'; n: number; preview: string };

describe('preview channel', () => {
  it('reaches only the preview its own setup page is paired with', async () => {
    const sender = renderHook(() => usePreviewSender<Msg>('chat-test'));
    const other = renderHook(() => usePreviewSender<Msg>('chat-test'));
    const mine = vi.fn();
    const theirs = vi.fn();
    renderHook(() =>
      usePreviewReceiver<Msg>('chat-test', sender.result.current.previewId, true, mine),
    );
    renderHook(() =>
      usePreviewReceiver<Msg>('chat-test', other.result.current.previewId, true, theirs),
    );

    act(() => {
      sender.result.current.send({ type: 'test', n: 1 });
    });
    await waitFor(() => expect(mine).toHaveBeenCalledOnce());
    expect(mine.mock.calls[0][0]).toMatchObject({ n: 1, preview: sender.result.current.previewId });
    expect(theirs).not.toHaveBeenCalled();
  });

  it('hears nothing while disabled or without a preview id', async () => {
    const sender = renderHook(() => usePreviewSender<Msg>('chat-test-2'));
    const onMessage = vi.fn();
    renderHook(() =>
      usePreviewReceiver<Msg>('chat-test-2', sender.result.current.previewId, false, onMessage),
    );
    renderHook(() => usePreviewReceiver<Msg>('chat-test-2', undefined, true, onMessage));
    act(() => {
      sender.result.current.send({ type: 'test', n: 1 });
    });
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(onMessage).not.toHaveBeenCalled();
  });

  it('keeps one previewId for the life of the page', () => {
    const { result, rerender } = renderHook(() => usePreviewSender<Msg>('chat-test-3'));
    const first = result.current.previewId;
    rerender();
    expect(result.current.previewId).toBe(first);
    expect(first).toMatch(/^[a-z0-9]{1,8}$/);
  });
});
