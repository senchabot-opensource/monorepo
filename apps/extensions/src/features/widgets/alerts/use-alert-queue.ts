import { useCallback, useEffect, useRef, useState } from 'react';
import type { AlertEvent, AlertType } from '#/lib/alert-config';
import { DISPLAY_DURATION, MAX_VISIBLE } from '#/lib/alert-config';

interface QueueState {
  visible: AlertEvent[];
  queue: AlertEvent[];
}

export function useAlertQueue() {
  const [state, setState] = useState<QueueState>({ visible: [], queue: [] });
  const timersRef = useRef<Map<string, number>>(new Map());

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      for (const timer of timersRef.current.values()) {
        window.clearTimeout(timer);
      }
      timersRef.current.clear();
    };
  }, []);

  const removeAlert = useCallback((id: string) => {
    setState((prev) => {
      const newVisible = prev.visible.filter((a) => a.id !== id);
      const nextFromQueue = prev.queue[0];

      if (nextFromQueue && newVisible.length < MAX_VISIBLE) {
        return {
          visible: [...newVisible, nextFromQueue],
          queue: prev.queue.slice(1),
        };
      }

      return {
        visible: newVisible,
        queue: prev.queue,
      };
    });

    timersRef.current.delete(id);
  }, []);

  // Timers follow what is on screen. Scheduling only in addAlert missed alerts promoted from the
  // queue, which then stayed forever; five of them filled the screen and stalled the queue.
  useEffect(() => {
    for (const alert of state.visible) {
      if (!timersRef.current.has(alert.id)) {
        const timer = window.setTimeout(() => {
          removeAlert(alert.id);
        }, DISPLAY_DURATION);
        timersRef.current.set(alert.id, timer);
      }
    }
  }, [state.visible, removeAlert]);

  const addAlert = useCallback(
    (type: AlertType, data: AlertEvent['data']) => {
      const newAlert: AlertEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        data,
        timestamp: new Date().toISOString(),
      };

      setState((prev) => {
        if (prev.visible.length < MAX_VISIBLE) {
          return {
            visible: [...prev.visible, newAlert],
            queue: prev.queue,
          };
        }
        return {
          visible: prev.visible,
          queue: [...prev.queue, newAlert],
        };
      });
    },
    [],
  );

  return {
    visibleAlerts: state.visible,
    addAlert,
  };
}
