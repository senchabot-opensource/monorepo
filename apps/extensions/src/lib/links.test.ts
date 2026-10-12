import { describe, expect, it } from 'vitest';
import { LINKS, resolveDashboardChatWidgetUrl, resolveDashboardFollowerGoalUrl } from './links';

describe('dashboard links', () => {
  it('render the production URL until hydrated, as the server did', () => {
    expect(window.location.hostname).toBe('localhost');
    expect(resolveDashboardChatWidgetUrl(false)).toBe(LINKS.dashboardChatWidget);
    expect(resolveDashboardFollowerGoalUrl(false)).toBe(LINKS.dashboardFollowerGoal);
  });

  it('point at the local dashboard on localhost once hydrated', () => {
    expect(resolveDashboardChatWidgetUrl(true)).toBe('http://localhost:3000/dashboard/tools');
    expect(resolveDashboardFollowerGoalUrl(true)).toBe(
      'http://localhost:3000/dashboard/tools/follower-goal',
    );
  });
});
