import { describe, expect, it } from 'vitest';
import { LEADERBOARD_STAGE, leaderboardStage } from './leaderboard-url';
import { QUEUE_STAGE, queueStage } from './queue-url';
import { getWidget } from './widgets';

describe('stages that grow with their rows', () => {
  it('gives a top board room for every place, and the latest board its default size', () => {
    expect(leaderboardStage({ board: 'gifts', rows: 5 })).toEqual(LEADERBOARD_STAGE);
    expect(leaderboardStage({ board: 'cheers', rows: 10 })).toEqual({ width: 440, height: 556 });
    expect(leaderboardStage({ board: 'latest', rows: 10 })).toEqual(LEADERBOARD_STAGE);
  });

  it('gives the queue room for every name shown', () => {
    expect(queueStage(8)).toEqual(QUEUE_STAGE);
    expect(queueStage(15)).toEqual({ width: 440, height: 850 });
  });

  it('registers the default sizes as the browser source sizes', () => {
    expect(getWidget('leaderboard').sourceSize).toEqual(LEADERBOARD_STAGE);
    expect(getWidget('queue').sourceSize).toEqual(QUEUE_STAGE);
  });
});
