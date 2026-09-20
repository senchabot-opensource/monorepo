---
name: finish-extensions-feature
description: >-
  Use this skill when completing a new feature or making a user-facing change in the apps/extensions workspace to ensure no required files or configurations are forgotten.
---

# Finish Extensions Feature

When you are wrapping up a user-facing change or a new feature in `apps/extensions`, there are several files that must be updated. CI and tests will fail if these are forgotten.

Follow this checklist:

## 1. Translations (`en.ts` and `tr.ts`)
- **Action**: Any new UI copy, configuration labels, or settings must be added to both `src/lib/i18n/en.ts` and `src/lib/i18n/tr.ts`.
- **Reason**: The build tests require every string key to be present in both locales. Missing a translation in either file will fail `vitest`.

## 2. Changelog (`changelog.ts` and `i18n`)
- **Action**: Add an entry for every user-facing change to `src/lib/changelog.ts` at the top of the `CHANGELOG` array.
- **Action**: Define the translation key for the changelog entry in both `en.ts` and `tr.ts` under the `changelog.entries` object.
- **Reason**: Streamers rely on the changelog to know what's new. Tests will fail if the key is missing in either language.

## 3. README.md
- **Action**: If you added new URL parameters to a widget, update the parameter lists in `apps/extensions/README.md`.
- **Action**: If you created a whole new widget, add it to the widget list and detailed breakdown sections.

## 4. LLM Context Files (`llms.txt` and `llms-full.txt`)
- **Action**: Add any new URL parameters or commands to `public/llms-full.txt` in the Markdown table for the respective widget.
- **Action**: If you created a new widget or tool, add its summary and link to `public/llms.txt` and `public/llms-full.txt`.

## 5. New Widgets/Tools Only
If your change adds a completely new widget, check these files:
- `src/lib/widgets.ts` or `src/lib/guides.ts` (Title and description, en/tr metadata)
- `src/routes/{-$locale}/` (Setup route page)
- `vite.config.ts` (Add the English path and the `/tr` path to the prerender list)
- `public/sitemap.xml`

## 6. Run Tests
- Always run `npm test` inside `apps/extensions` after updating these files to ensure SEO and sitemap tests pass!
