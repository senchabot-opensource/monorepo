import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useRaffleState } from './use-raffle-state';
import type { RaffleParticipant } from '#/types/raffle';

function makeParticipant(
  overrides: Partial<RaffleParticipant> = {},
): RaffleParticipant {
  return {
    id: 'twitch-alice',
    username: 'alice',
    displayName: 'Alice',
    platform: 'twitch',
    subMonths: 0,
    timestamp: Date.now(),
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});

afterEach(() => {
  vi.restoreAllMocks();
});

function startWithZeroDuration(): ReturnType<typeof renderHook<ReturnType<typeof useRaffleState>, void>> {
  const { result } = renderHook(() => useRaffleState());
  act(() => {
    result.current.updateConfig({ minRaffleDurationSec: 0 });
  });
  act(() => {
    result.current.start();
  });
  return { result } as never;
}

describe('useRaffleState - addParticipant', () => {
  it('adds a participant when the raffle is running', () => {
    const { result } = startWithZeroDuration();
    act(() => {
      result.current.addParticipant(makeParticipant());
    });
    expect(result.current.state.participants).toHaveLength(1);
  });

  it('dedups by platform+username regardless of id (same user, different message id)', () => {
    const { result } = startWithZeroDuration();
    act(() => {
      result.current.addParticipant(
        makeParticipant({ id: 'twitch-msg-uuid-1' }),
      );
    });
    act(() => {
      result.current.addParticipant(
        makeParticipant({ id: 'twitch-msg-uuid-2' }),
      );
    });
    expect(result.current.state.participants).toHaveLength(1);
  });

  it('dedups case-insensitively', () => {
    const { result } = startWithZeroDuration();
    act(() => {
      result.current.addParticipant(
        makeParticipant({ username: 'Alice', id: 'twitch-alice' }),
      );
    });
    act(() => {
      result.current.addParticipant(
        makeParticipant({ username: 'ALICE', id: 'twitch-alice-2' }),
      );
    });
    expect(result.current.state.participants).toHaveLength(1);
  });

  it('ignores participants when raffle is not running', () => {
    const { result } = renderHook(() => useRaffleState());
    act(() => {
      result.current.addParticipant(makeParticipant());
    });
    expect(result.current.state.participants).toHaveLength(0);
  });

  it('rejects participants who have already won maxWinsPerUser times', () => {
    const { result } = startWithZeroDuration();
    act(() => {
      result.current.updateConfig({ maxWinsPerUser: 1 });
    });
    act(() => {
      result.current.addParticipant(makeParticipant());
    });
    act(() => {
      result.current.drawWinner();
    });
    act(() => {
      result.current.addParticipant(makeParticipant());
    });
    expect(result.current.state.participants).toHaveLength(0);
  });
});

describe('useRaffleState - drawWinner', () => {
  it('returns null when there are no participants', () => {
    const { result } = startWithZeroDuration();
    let winner: ReturnType<typeof result.current.drawWinner> = null;
    act(() => {
      winner = result.current.drawWinner();
    });
    expect(winner).toBeNull();
  });

  it('returns null when no eligible participants remain', () => {
    const { result } = startWithZeroDuration();
    act(() => {
      result.current.updateConfig({ maxWinsPerUser: 1 });
    });
    act(() => {
      result.current.addParticipant(makeParticipant());
    });
    act(() => {
      result.current.drawWinner();
    });
    let winner: ReturnType<typeof result.current.drawWinner> = null;
    act(() => {
      winner = result.current.drawWinner();
    });
    expect(winner).toBeNull();
  });

  it('does not return the same winner twice on rapid double-call', () => {
    const { result } = startWithZeroDuration();
    act(() => {
      result.current.addParticipant(makeParticipant({ username: 'alice' }));
    });
    let first: ReturnType<typeof result.current.drawWinner> = null;
    let second: ReturnType<typeof result.current.drawWinner> = null;
    act(() => {
      first = result.current.drawWinner();
    });
    act(() => {
      second = result.current.drawWinner();
    });
    expect(first).not.toBeNull();
    expect(second).toBeNull();
  });

  it('moves the drawn participant from participants to winners', () => {
    const { result } = startWithZeroDuration();
    act(() => {
      result.current.addParticipant(makeParticipant({ username: 'alice' }));
    });
    act(() => {
      result.current.drawWinner();
    });
    expect(result.current.state.participants).toHaveLength(0);
    expect(result.current.state.winners).toHaveLength(1);
    expect(result.current.state.winners[0]?.username).toBe('alice');
  });

  it('allows sequential draws after the raffle is stopped', () => {
    const { result } = startWithZeroDuration();
    act(() => {
      result.current.updateConfig({ maxWinsPerUser: 1 });
    });
    act(() => {
      result.current.addParticipant(
        makeParticipant({ id: 'twitch-alice', username: 'alice' }),
      );
      result.current.addParticipant(
        makeParticipant({ id: 'twitch-bob', username: 'bob' }),
      );
    });
    act(() => {
      result.current.stop();
    });
    expect(result.current.state.status).toBe('stopped');
    let first: ReturnType<typeof result.current.drawWinner> = null;
    act(() => {
      first = result.current.drawWinner();
    });
    expect(first).not.toBeNull();
    let second: ReturnType<typeof result.current.drawWinner> = null;
    act(() => {
      second = result.current.drawWinner();
    });
    expect(second).not.toBeNull();
    expect(result.current.state.winners).toHaveLength(2);
    expect(result.current.state.participants).toHaveLength(0);
  });
});

describe('useRaffleState - eligibleCount', () => {
  it('counts all participants when maxWinsPerUser is 0 (unlimited)', () => {
    const { result } = startWithZeroDuration();
    act(() => {
      result.current.updateConfig({ maxWinsPerUser: 0 });
    });
    act(() => {
      result.current.addParticipant(
        makeParticipant({ id: 'twitch-alice', username: 'alice' }),
      );
    });
    act(() => {
      result.current.addParticipant(
        makeParticipant({ id: 'twitch-bob', username: 'bob' }),
      );
    });
    expect(result.current.eligibleCount).toBe(2);
  });

  it('excludes participants who already won up to maxWinsPerUser', () => {
    const { result } = startWithZeroDuration();
    act(() => {
      result.current.updateConfig({ maxWinsPerUser: 1 });
    });
    act(() => {
      result.current.addParticipant(
        makeParticipant({ id: 'twitch-alice', username: 'alice' }),
      );
    });
    act(() => {
      result.current.addParticipant(
        makeParticipant({ id: 'twitch-bob', username: 'bob' }),
      );
    });
    act(() => {
      result.current.drawWinner();
    });
    expect(result.current.eligibleCount).toBe(1);
  });
});

describe('useRaffleState - start confirmation', () => {
  it('prompts to confirm when participants exist', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const { result } = startWithZeroDuration();
    act(() => {
      result.current.addParticipant(makeParticipant());
    });
    act(() => {
      result.current.start();
    });
    expect(confirmSpy).toHaveBeenCalled();
    expect(result.current.state.participants).toHaveLength(1);
  });

  it('clears participants when confirm is accepted', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { result } = startWithZeroDuration();
    act(() => {
      result.current.addParticipant(makeParticipant());
    });
    act(() => {
      result.current.start();
    });
    expect(result.current.state.participants).toHaveLength(0);
  });
});

describe('useRaffleState - fairness hardening', () => {
  describe('frozen config', () => {
    it('snapshots config at start', () => {
      const { result } = renderHook(() => useRaffleState());
      act(() => {
        result.current.updateConfig({ minRaffleDurationSec: 0 });
        result.current.updateConfig({ maxWinsPerUser: 2 });
      });
      act(() => {
        result.current.start();
      });
      expect(result.current.state.frozenConfig).not.toBeNull();
      expect(result.current.state.frozenConfig?.maxWinsPerUser).toBe(2);
      expect(result.current.state.frozenConfig?.minRaffleDurationSec).toBe(0);
    });

    it('uses frozen config for eligibility, not the live config', () => {
      const { result } = renderHook(() => useRaffleState());
      act(() => {
        result.current.updateConfig({ minRaffleDurationSec: 0 });
      });
      act(() => {
        result.current.start();
      });
      // Host tries to flip maxWinsPerUser to 0 mid-run to bring back a winner.
      act(() => {
        result.current.updateConfig({ maxWinsPerUser: 0 });
      });
      // Live config is 0, but frozen config is 1.
      act(() => {
        result.current.addParticipant(
          makeParticipant({ id: 'twitch-alice', username: 'alice' }),
        );
      });
      act(() => {
        result.current.drawWinner();
      });
      act(() => {
        result.current.addParticipant(
          makeParticipant({ id: 'twitch-alice', username: 'alice' }),
        );
      });
      // Alice already won once under the frozen rules; she should not be re-added.
      expect(result.current.state.participants).toHaveLength(0);
    });

    it('updateConfig is a no-op while running', () => {
      const { result } = startWithZeroDuration();
      act(() => {
        result.current.updateConfig({ keyword: '!enter' });
      });
      expect(result.current.state.config.keyword).toBe('!join');
    });

    it('updateConfig is a no-op while stopped', () => {
      const { result } = startWithZeroDuration();
      act(() => {
        result.current.stop();
      });
      act(() => {
        result.current.updateConfig({ keyword: '!enter' });
      });
      expect(result.current.state.config.keyword).toBe('!join');
    });
  });

  describe('minimum raffle duration', () => {
    it('blocks draw before the configured duration has elapsed', () => {
      const { result } = renderHook(() => useRaffleState());
      act(() => {
        result.current.updateConfig({ minRaffleDurationSec: 60 });
      });
      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.addParticipant(makeParticipant());
      });
      let winner: ReturnType<typeof result.current.drawWinner> = null;
      act(() => {
        winner = result.current.drawWinner();
      });
      expect(winner).toBeNull();
      expect(result.current.state.winners).toHaveLength(0);
    });

    it('allows draw after the configured duration has elapsed (vi.useFakeTimers)', () => {
      vi.useFakeTimers();
      try {
        const baseTime = new Date('2026-01-01T00:00:00Z').getTime();
        vi.setSystemTime(baseTime);
        const { result } = renderHook(() => useRaffleState());
        act(() => {
          result.current.updateConfig({ minRaffleDurationSec: 1 });
        });
        act(() => {
          result.current.start();
        });
        act(() => {
          vi.setSystemTime(baseTime + 500);
        });
        act(() => {
          result.current.addParticipant(makeParticipant());
        });
        let earlyWinner: ReturnType<typeof result.current.drawWinner> = null;
        act(() => {
          earlyWinner = result.current.drawWinner();
        });
        expect(earlyWinner).toBeNull();
        act(() => {
          vi.setSystemTime(baseTime + 1500);
        });
        let lateWinner: ReturnType<typeof result.current.drawWinner> = null;
        act(() => {
          lateWinner = result.current.drawWinner();
        });
        expect(lateWinner).not.toBeNull();
      } finally {
        vi.useRealTimers();
      }
    });

    it('canDraw is false until the duration elapses', () => {
      vi.useFakeTimers();
      try {
        const baseTime = new Date('2026-01-01T00:00:00Z').getTime();
        vi.setSystemTime(baseTime);
        const { result } = renderHook(() => useRaffleState());
        act(() => {
          result.current.updateConfig({ minRaffleDurationSec: 2 });
        });
        act(() => {
          result.current.start();
        });
        act(() => {
          result.current.addParticipant(makeParticipant());
        });
        expect(result.current.canDraw).toBe(false);
        expect(result.current.remainingMs).toBeGreaterThan(0);
      } finally {
        vi.useRealTimers();
      }
    });

    it('remainingMs is 0 once the duration elapses (via forced re-render)', () => {
      vi.useFakeTimers();
      try {
        const baseTime = new Date('2026-01-01T00:00:00Z').getTime();
        vi.setSystemTime(baseTime);
        const { result } = renderHook(() => useRaffleState());
        act(() => {
          result.current.updateConfig({ minRaffleDurationSec: 1 });
        });
        act(() => {
          result.current.start();
        });
        act(() => {
          result.current.addParticipant(
            makeParticipant({ id: 'twitch-alice', username: 'alice' }),
          );
          result.current.addParticipant(
            makeParticipant({ id: 'twitch-bob', username: 'bob' }),
          );
        });
        act(() => {
          vi.setSystemTime(baseTime + 1500);
        });
        // Force a re-render via a state-touching call. After this, one
        // participant is moved to winners but the other remains, so
        // eligibleCount > 0 and canDraw is evaluated purely on time.
        act(() => {
          result.current.drawWinner();
        });
        expect(result.current.canDraw).toBe(true);
        expect(result.current.remainingMs).toBe(0);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('CSPRNG draw', () => {
    it('uses crypto.getRandomValues for the index', () => {
      const spy = vi.spyOn(crypto, 'getRandomValues');
      const { result } = startWithZeroDuration();
      act(() => {
        result.current.addParticipant(makeParticipant());
      });
      act(() => {
        result.current.drawWinner();
      });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('reset confirms', () => {
    it('resetWinners prompts when non-empty', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const { result } = startWithZeroDuration();
      act(() => {
        result.current.addParticipant(makeParticipant());
      });
      act(() => {
        result.current.drawWinner();
      });
      act(() => {
        result.current.resetWinners();
      });
      expect(confirmSpy).toHaveBeenCalled();
      expect(result.current.state.winners).toHaveLength(1);
    });

    it('resetParticipants prompts when non-empty', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const { result } = startWithZeroDuration();
      act(() => {
        result.current.addParticipant(makeParticipant());
      });
      act(() => {
        result.current.resetParticipants();
      });
      expect(confirmSpy).toHaveBeenCalled();
      expect(result.current.state.participants).toHaveLength(1);
    });

    it('resetAll prompts when there is active state', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const { result } = startWithZeroDuration();
      act(() => {
        result.current.addParticipant(makeParticipant());
      });
      act(() => {
        result.current.resetAll();
      });
      expect(confirmSpy).toHaveBeenCalled();
      expect(result.current.state.participants).toHaveLength(1);
    });

    it('resetAll clears frozenConfig and startedAt when confirmed', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      const { result } = renderHook(() => useRaffleState());
      act(() => {
        result.current.updateConfig({
          minRaffleDurationSec: 0,
          channel: 'mystream',
          keyword: '!enter',
        });
      });
      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.addParticipant(
          makeParticipant({ id: 'twitch-alice', username: 'alice' }),
        );
      });
      act(() => {
        result.current.drawWinner();
      });
      act(() => {
        result.current.resetAll();
      });
      expect(result.current.state.frozenConfig).toBeNull();
      expect(result.current.state.startedAt).toBeNull();
      expect(result.current.state.status).toBe('idle');
      expect(result.current.state.participants).toHaveLength(0);
      expect(result.current.state.winners).toHaveLength(0);
      // Config (channel name, keyword, etc.) is preserved across resetAll.
      expect(result.current.state.config.channel).toBe('mystream');
      expect(result.current.state.config.keyword).toBe('!enter');
    });
  });

  describe('minRaffleDurationSec input validation', () => {
    it('clamps negative and out-of-range values to [0, 300]', () => {
      const { result } = renderHook(() => useRaffleState());
      act(() => {
        result.current.updateConfig({ minRaffleDurationSec: -5 });
      });
      expect(result.current.state.config.minRaffleDurationSec).toBe(0);
      act(() => {
        result.current.updateConfig({ minRaffleDurationSec: 9999 });
      });
      expect(result.current.state.config.minRaffleDurationSec).toBe(300);
    });
  });
});
