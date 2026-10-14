import { createFileRoute } from '@tanstack/react-router';
import { GoalSetup } from '#/features/widgets/goal/goal-setup';
import { getParamsLocale } from '#/lib/i18n/paths';
import type { FaqEntry } from '#/lib/i18n/seo';
import { getSetupPageHead } from '#/lib/seo/pages';

export const Route = createFileRoute('/{-$locale}/setup/bits-goal')({
  head: ({ params }) =>
    getSetupPageHead('bits-goal', getParamsLocale(params), {
      breadcrumb: 'bitsGoal.breadcrumb',
      faq: FAQ,
    }),
  component: BitsGoalSetup,
});

const FAQ: FaqEntry[] = [
  ['bitsGoal.faq1Q', 'bitsGoal.faq1A'],
  ['bitsGoal.faq2Q', 'bitsGoal.faq2A'],
  ['bitsGoal.faq3Q', 'bitsGoal.faq3A'],
  ['bitsGoal.faq4Q', 'bitsGoal.faq4A'],
];

// The Sub Goal's page and overlay, counting Bits and Kicks: every URL it builds has type=bits.
function BitsGoalSetup() {
  return <GoalSetup type="bits" faq={FAQ} />;
}
