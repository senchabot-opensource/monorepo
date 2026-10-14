import { createFileRoute } from '@tanstack/react-router';
import { GoalSetup } from '#/features/widgets/goal/goal-setup';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';

export const Route = createFileRoute('/{-$locale}/setup/sub-goal')({
  head: ({ params }) =>
    getSetupPageHead('goal', getParamsLocale(params), {
      breadcrumb: 'goal.breadcrumb',
      faq: FAQ,
    }),
  component: SubGoalSetup,
});

const FAQ: FaqEntry[] = [
  ['goal.faq1Q', 'goal.faq1A'],
  ['goal.faq2Q', 'goal.faq2A'],
  ['goal.faq3Q', 'goal.faq3A'],
  ['goal.faq4Q', 'goal.faq4A'],
];

// The page is shared with the Bits & Kicks Goal, which runs on the same overlay.
function SubGoalSetup() {
  return <GoalSetup type="subs" faq={FAQ} />;
}
