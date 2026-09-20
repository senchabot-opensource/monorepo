# AGENTS.md

How to work in this repository: layout, commands, and the git rules. Written for AI coding
agents; humans should start with [CONTRIBUTING.md](./CONTRIBUTING.md), which points back here.

`apps/extensions` has [its own AGENTS.md](./apps/extensions/AGENTS.md). Read it before changing
that app.

## Layout

| Path | What | Stack |
| --- | --- | --- |
| `apps/discord-bot` | Discord bot | Go |
| `apps/twitch-bot` | Twitch chat bot | Go |
| `apps/command-server` | gRPC bot-command server | Go |
| `apps/web` | Dashboard | Next.js, Prisma, Tailwind |
| `apps/extensions` | OBS browser-source widgets and tools | TanStack Start + Vite, React, Tailwind |
| `command/` `config/` `db/` `grpc/` `helper/` `model/` `platform/` `twitchapi/` | Shared Go packages | Go |

Every app has a README with its own setup and feature reference.

## Commands

Go, from the repo root:

```sh
go build ./...
go test ./...
go run ./cmd/main   # from apps/discord-bot or apps/twitch-bot
```

`apps/web`:

```sh
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

`apps/extensions`:

```sh
npm install
npm run build && npm run preview   # not `npm run dev` — see that app's AGENTS.md
npm test
npx tsc --noEmit
```

All of it at once: `docker-compose up -d` from the root starts Postgres, pgAdmin, the web app and
both bots. Copy each app's `env.example` to `.env` first.

There is no CI that gates pull requests, so these commands are the only thing standing between a
change and `dev`. Run the ones for every app you touched.

## Branching and pull requests

Work lands through forks. `dev` is the base branch for every pull request.

1. **Branch from the upstream `dev` as it is right now.**

   ```sh
   git fetch upstream
   git switch -c feat/my-change upstream/dev
   ```

   Not from whatever happens to be checked out, and not from your previous branch. Branching off
   your last PR pulls its commits into the new one and the diff stops being reviewable.

2. **Stack on an open pull request only when the work needs it** — when you must edit files an
   open, unmerged PR has already changed. Check first:

   ```sh
   git diff upstream/dev origin/<other-branch> -- <files you will touch>
   ```

   Empty output means branch from `upstream/dev`. If you do stack, branch from that PR's head and
   open the body with `**Stacked on #N.**`, then say which commits are new.

3. **One pull request per concern.** A fix and a feature do not travel together.

4. Title = the main commit message. Body: what changed, why, how you verified it (the commands and
   their results), and anything you left out on purpose.

5. Rewriting a pushed branch: `git push --force-with-lease`, never a plain `--force`.

Branch names: `feat/…`, `fix/…`, `docs/…`, `refactor/…`, `chore/…`.

## Commits

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), in English, imperative:
  `feat(extensions): add a Stream Countdown widget`. The scope is the app or package you touched.
- One concern per commit. If a single file carries two concerns, commit the whole file once —
  don't split a file across commits.
- Stage explicit paths (`git add apps/web/src/thing.tsx`), never `git add -A` or `git add .`, and
  read `git status` before committing. Someone else — a teammate, or another agent session — may
  have uncommitted work in the same checkout.
- Never `git reset --hard`, `git checkout .`, `git clean -fd` or `git stash` to clean up: they
  throw away work that isn't yours. Undo your own changes by path.
- Don't commit or push unless you were asked to.

## Changelog

`apps/extensions` is the only app with a user-facing changelog. It lives in
`src/lib/changelog.ts` — an entry per change, newest first, each pointing at a translated
`changelog.entries.*` key — and it is published at
[extensions.senchabot.com/changelog](https://extensions.senchabot.com/changelog). Add an entry for
every change streamers would notice; skip refactors and internal fixes.

The Go bots and `apps/web` have no changelog. Don't start one without asking.

## Never commit

- `node_modules/`, `dist/`, `.next/`, other build output, `.env` files, agent scratch dirs.
- Generated files you didn't mean to change. `apps/extensions/src/routeTree.gen.ts` is rewritten
  by the dev server and by `vite build`; include it only when your change really adds or removes a
  route, otherwise restore it with `git checkout -- <that file>`.
- Formatting churn in files you didn't edit — run formatters on your own files, by path.
- Real tokens, credentials or account data, including in tests and fixtures.

Before you call the work done, run the checks above and read `git status` for files you didn't mean
to touch.
