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

  const scheduleRemoval = useCallback(
    (id: string) => {
      const timer = window.setTimeout(() => {
        removeAlert(id);
      }, DISPLAY_DURATION);
      timersRef.current.set(id, timer);
    },
    [removeAlert],
  );

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
          scheduleRemoval(newAlert.id);
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
    [scheduleRemoval],
  );

  return {
    visibleAlerts: state.visible,
    addAlert,
  };
}
