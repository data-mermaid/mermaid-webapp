#!/usr/bin/env bash
#
# hotfix.sh — Hotfix release workflow for mermaid-webapp.
#
# Ships whatever is already on `main` as a new release, WITHOUT merging
# `develop`. Use this when a fix has landed directly on `main` (bypassing the
# normal develop -> main flow) and needs to go to production on its own.
#
# For a normal release (cutting everything on `develop`), use release.sh instead.
#
# Usage: ./scripts/hotfix.sh <major|minor|patch>   (almost always 'patch')
#
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_release-lib.sh"

BUMP_TYPE="${1:-}"
validate_bump_type "$BUMP_TYPE" "Usage: ./scripts/hotfix.sh <major|minor|patch>  (a hotfix is almost always 'patch')"

require_tools
require_clean_tree

# Deliberately do NOT touch develop yet — a hotfix ships what's on main, so
# develop's unreleased work must stay out of it.
echo "Pulling latest main..."
checkout_and_pull main
fetch_tags

verify_version_matches_tag

# Guard: there must be something on main to release. If main is not ahead of the
# latest tag, `npm version` would produce an empty release (a version bump with
# no actual changes) — almost certainly a mistake.
COMMIT_COUNT=$(git rev-list "$LATEST_TAG..HEAD" --count)
if [[ "$COMMIT_COUNT" -eq 0 ]]; then
  echo "Error: main is not ahead of $LATEST_TAG — nothing to hotfix."
  echo "A hotfix expects fix commits already on main. Did you forget to merge the fix?"
  exit 1
fi

# Show exactly what will ship and require confirmation. A hotfix skips the usual
# develop -> main review path, so this is the operator's last chance to sanity
# check that ONLY the intended fix is on main.
echo ""
echo "The following $COMMIT_COUNT commit(s) on main will be released (since $LATEST_TAG):"
echo ""
git log "$LATEST_TAG..HEAD" --oneline
echo ""
read -r -p "Hotfix-release these as a '$BUMP_TYPE' bump? [y/N] " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

# No `git merge develop` here — that's the key difference from release.sh.
bump_version "$BUMP_TYPE"
push_main_and_tag
backmerge_into_develop
create_github_release

echo ""
echo "Hotfix $NEW_VERSION complete!"
