# Contributing

Thanks for helping out. Found a bug or want a feature? Search the existing issues first, then open
a new one — yours may be a duplicate.

## Working on code

1. Fork the repository, clone your fork, and add the upstream remote:

   ```sh
   git clone https://github.com/<your-username>/monorepo.git
   cd monorepo
   git remote add upstream https://github.com/senchabot-opensource/monorepo.git
   ```

2. Create your branch from the current upstream `dev`, not from your last branch:

   ```sh
   git fetch upstream
   git switch -c feat/my-change upstream/dev
   ```

3. Set up the app you're changing — each one has a README, and [AGENTS.md](./AGENTS.md) lists the
   build, test and lint command of every app.

4. Commit with [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), in English:
   `fix(twitch-bot): stop a command timer from firing twice`.

5. Run the build, the tests and the linter for every app you touched. Pull requests are not gated
   by CI, so this is on you.

6. Open the pull request against `dev`, one per change, and describe what changed, why, and how you
   verified it.

Using an AI coding agent? Point it at [AGENTS.md](./AGENTS.md) — same rules, in the form agents
need.

Please be kind: [Code of Conduct](./CODE_OF_CONDUCT.md).
