# Release Workflow

How to cut a production release of mermaid-webapp. Production ([app.datamermaid.org](https://app.datamermaid.org)) deploys when a semantically versioned tag (e.g. `v2.35.0`) is pushed - `scripts/release.sh` automates the whole flow that gets you there.

## Quick start

```bash
./scripts/release.sh <major|minor|patch>
```

That's it - the script handles branches, versioning, tagging, pushing, and the GitHub release. Pick the bump type first (see below).

Shipping a fix that already landed directly on `main`? Use the hotfix flow instead - see [Hotfix release](#hotfix-release).

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

`release.sh` and `hotfix.sh` share their common steps (checks, version verification, bump, push, back-merge, release) via `scripts/_release-lib.sh`, so fixes to that plumbing apply to both.

## Hotfix release

Occasionally a fix is committed **directly to `main`** (bypassing `develop`) and needs to ship on its own, without dragging in unreleased `develop` work. That's a hotfix.

```bash
./scripts/hotfix.sh <major|minor|patch>   # almost always patch
```

Same bump rules as above (a `fix:` on its own means `patch`).

### How it differs from a normal release

A hotfix is the normal release flow **minus the develop→main merge**, plus a safety check:

- It only pulls and operates on `main`; it never merges `develop` into `main`.
- It aborts if `main` isn't ahead of the latest tag (nothing to ship).
- It prints the exact commits that will be released and asks for confirmation before tagging - your last chance to check that *only* the intended fix is on `main`.

Everything else matches `release.sh`: it verifies `package.json` vs the latest tag, bumps the version, pushes `main` + tag (triggering the deploy), back-merges `main` into `develop` so the fix and version bump land there, and creates the GitHub release.

### Doing it manually

If you'd rather run it by hand (e.g. `v2.35.0` → `v2.35.1`):

```bash
git checkout main && git pull
git fetch --tags --force

# Sanity check what's on main since the last tag
git log $(git tag --sort=-v:refname | grep -E '^v?[0-9]+\.[0-9]+\.[0-9]+$' | head -1)..HEAD --oneline

npm version patch                                        # creates the bump commit + tag
SKIP_BRANCH_WARNING=1 git push origin main --follow-tags # triggers the deploy

git checkout develop && git pull                         # back-merge into develop
git merge main
SKIP_BRANCH_WARNING=1 git push origin develop

gh release create v2.35.1 --generate-notes --target main
```

Note the absence of any `git merge develop` step - that's what keeps unreleased work out of the hotfix.

## Troubleshooting

**`! [rejected] lokalise-sync-develop -> ... (would clobber existing tag)`**
The mutable Lokalise sync tag moved on the remote. Force-fetch to repoint your local copy, then re-run:

```bash
git fetch --tags --force
```

**`Error: package.json version (X) does not match latest tag (vY)`**
`package.json` and the latest tag have drifted (usually a manual tag without a matching bump). The script prints the exact reconcile commands - run them, then re-run the release.
