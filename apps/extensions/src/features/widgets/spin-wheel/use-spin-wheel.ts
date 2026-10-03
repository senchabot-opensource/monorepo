import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  assignColors,
  buildSpin,
  parseOptions,
  type SpinHistoryEntry,
  shuffleLines,
} from './spin-logic';
import type { StandaloneSpin } from './spin-wheel-canvas';

const STORAGE_KEY = 'senchabot-spin-wheel-v1';
const HISTORY_LIMIT = 20;

const DEFAULT_TEXT = ['Zelda', 'Mario Kart', 'Tetris', 'Minecraft'].join('\n');

interface StoredState {
  text: string;
  history: SpinHistoryEntry[];
}

function loadState(): StoredState {
  const empty: StoredState = { text: '', history: [] };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { text: '', history: [] };
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      text: typeof parsed.text === 'string' ? parsed.text : '',
      history: Array.isArray(parsed.history)
        ? parsed.history
            .filter(
              (entry): entry is SpinHistoryEntry =>
                !!entry &&
                typeof (entry as SpinHistoryEntry).label === 'string' &&
                typeof (entry as SpinHistoryEntry).color === 'string',
            )
            .map((entry, index) => ({
              id:
                typeof entry.id === 'string' && entry.id.length > 0
                  ? entry.id
                  : `hist-${entry.at}-${index}`,
              label: entry.label,
              color: entry.color,
              at: typeof entry.at === 'number' ? entry.at : Date.now(),
            }))
            .slice(0, HISTORY_LIMIT)
        : [],
    };
  } catch {
    return empty;
  }
}

export function useSpinWheel() {
  const [text, setText] = useState('');
  const [history, setHistory] = useState<SpinHistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [currentSpin, setCurrentSpin] = useState<StandaloneSpin | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  // Exact wheel angle after the last spin; the canvas ends exactly on the
  // target, so the next spin can build forward from here without going backwards.
  const angleRef = useRef(0);

  // The server renders empty so hydration matches; the saved list loads on mount.
  useEffect(() => {
    const stored = loadState();
    setText(stored.text || DEFAULT_TEXT);
    setHistory(stored.history);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ text, history }));
    } catch {
      // Quota errors are non-fatal.
    }
  }, [text, history, hydrated]);

  const labels = useMemo(() => parseOptions(text), [text]);
  const slices = useMemo(() => assignColors(labels), [labels]);
  const slicesRef = useRef(slices);
  slicesRef.current = slices;
  const canSpin = slices.length >= 2 && !spinning;

  const spin = useCallback(() => {
    const count = slicesRef.current.length;
    if (count < 2) return;
    const next = buildSpin(angleRef.current, count);
    if (!next) return;
    angleRef.current = next.targetAngle;
    setSpinning(true);
    setCurrentSpin({
      spinId: next.spinId,
      targetAngle: next.targetAngle,
      durationMs: next.durationMs,
      selectedIndex: next.selectedIndex,
    });
  }, []);

  const pushHistory = useCallback((entry: Omit<SpinHistoryEntry, 'id'>) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `hist-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
    setHistory((prev) => [{ ...entry, id }, ...prev].slice(0, HISTORY_LIMIT));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const shuffle = useCallback(() => {
    const filled = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    setText(shuffleLines(filled).join('\n'));
  }, [text]);

  const clear = useCallback(() => setText(''), []);

  return {
    text,
    setText,
    labels,
    slices,
    canSpin,
    spinning,
    setSpinning,
    currentSpin,
    spin,
    soundEnabled,
    setSoundEnabled,
    history,
    pushHistory,
    clearHistory,
    shuffle,
    clear,
    hydrated,
  };
}

export type SpinWheelState = ReturnType<typeof useSpinWheel>;
