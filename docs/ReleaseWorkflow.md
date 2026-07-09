# Release Workflow

How to cut a production release of mermaid-webapp. Production ([app.datamermaid.org](https://app.datamermaid.org)) deploys when a semantically versioned tag (e.g. `v2.35.0`) is pushed - `scripts/release.sh` automates the whole flow that gets you there.

## Quick start

```bash
./scripts/release.sh <major|minor|patch>
```

That's it - the script handles branches, versioning, tagging, pushing, and the GitHub release. Pick the bump type first (see below).

## Choosing the bump

Look at what's shipped since the last release and apply [Conventional Commits](https://www.conventionalcommits.org/):

| Changes since last release contain… | Bump    | Example         |
| ------------------------------------ | ------- | --------------- |
| a `BREAKING CHANGE` / `feat!`        | `major` | `2.34.1` → `3.0.0` |
| any `feat:`                          | `minor` | `2.34.1` → `2.35.0` |
| only `fix:` / `chore:` / `docs:`     | `patch` | `2.34.1` → `2.34.2` |

Take the highest signal present (one `feat:` among many `fix:` still means `minor`). If it's unclear, **check with the dev team** - the bump is a judgement call, not just a script output.

To see what's shipped, use whichever is easiest:

- **GitHub** - the repo's [Releases](https://github.com/data-mermaid/mermaid-webapp/releases) page (compare against the last tag), or the commit history on `develop`.
- **Local git** - list commits since the latest release tag:
  ```bash
  git log $(git tag --sort=-v:refname | grep -E '^v?[0-9]+\.[0-9]+\.[0-9]+$' | head -1)..HEAD --oneline
  ```

## Prerequisites

- `git`, `npm`, and `gh` installed, and `gh` authenticated (`gh auth status`).
- A **clean working tree** - the script aborts otherwise. This includes untracked files (e.g. a local `.zed/` dir), so commit, stash, or gitignore them first.

## What the script does

1. Checks out and pulls the latest `develop` and `main`, and fetches tags.
2. Verifies `package.json`'s version matches the latest release tag (aborts on drift - see below).
3. Merges `develop` into `main` with a merge commit (`--no-ff`).
4. Bumps the version with `npm version`, creating the version commit and annotated tag.
5. Pushes `main` and the tag - **this is what triggers the production deploy** (`.github/workflows/deployment.yml`).
6. Back-merges `main` into `develop` so the version bump lands there too.
7. Creates a GitHub release with auto-generated notes.

## Troubleshooting

**`! [rejected] lokalise-sync-develop -> ... (would clobber existing tag)`**
The mutable Lokalise sync tag moved on the remote. Force-fetch to repoint your local copy, then re-run:

```bash
git fetch --tags --force
```

**`Error: package.json version (X) does not match latest tag (vY)`**
`package.json` and the latest tag have drifted (usually a manual tag without a matching bump). The script prints the exact reconcile commands - run them, then re-run the release.
