# Extension Feature Checklist

When wrapping up a user-facing change or new feature in the `apps/extensions` workspace, ensure the following steps are completed before declaring the task done:

1. **Translations**: Add any new UI copy and configuration labels to both `src/lib/i18n/en.ts` and `src/lib/i18n/tr.ts`. Missing translations fail CI tests.
2. **Changelog**: Add an entry for every user-facing change to `src/lib/changelog.ts` at the top of the `CHANGELOG` array, and define its translation key in `en.ts` and `tr.ts` under `changelog.entries`.
3. **README.md**: If you added new URL parameters to a widget, update the parameter list in `apps/extensions/README.md`.
4. **LLM Context Files**: Add any new URL parameters or commands to `public/llms-full.txt`. If you created a new widget, add it to `public/llms.txt` and `public/llms-full.txt`.
5. **New Widgets**: For entirely new widgets, ensure you update `src/lib/widgets.ts`, `vite.config.ts` (prerender list), and `public/sitemap.xml`.
6. **Tests**: Always run `npm test` inside `apps/extensions` to ensure the SEO, sitemap, and translation tests still pass.
