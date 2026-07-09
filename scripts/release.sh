#!/usr/bin/env bash
#
# release.sh — Release workflow for mermaid-webapp.
#
# Usage: ./scripts/release.sh <major|minor|patch>
#
set -euo pipefail

BUMP_TYPE="${1:-}"

if [[ ! "$BUMP_TYPE" =~ ^(major|minor|patch)$ ]]; then
  echo "Usage: ./scripts/release.sh <major|minor|patch>"
  exit 1
fi

# Prerequisites
for cmd in git npm gh; do
  if ! command -v "$cmd" &> /dev/null; then
    echo "Error: '$cmd' is not installed."
    exit 1
  fi
done

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: Working tree is not clean. Commit or stash changes first."
  exit 1
fi

# Pull latest
echo "Pulling latest develop and main..."
git checkout develop && git pull
git checkout main && git pull
# --force lets mutable tags (e.g. lokalise-sync-develop, which the Lokalise
# workflow keeps moving) update in place instead of aborting with "would
# clobber existing tag". Annotated release tags (vX.Y.Z) never move, so this
# only affects sync tags.
git fetch --tags --force

# Verify package.json version matches the latest git tag.
# If they drift (e.g. someone tagged manually without bumping package.json),
# `npm version` can either fail ("tag already exists") or silently produce a
# version lower than an existing tag. Abort and let the user reconcile first.
PKG_VERSION=$(node -p "require('./package.json').version")
# Filter to semver release tags only. Without the grep, a non-version tag
# (e.g. lokalise-sync-develop) could sort to the top and break the comparison.
LATEST_TAG=$(git tag --sort=-v:refname | grep -E '^v?[0-9]+\.[0-9]+\.[0-9]+$' | head -n 1)
LATEST_TAG_VERSION="${LATEST_TAG#v}"
if [[ "$PKG_VERSION" != "$LATEST_TAG_VERSION" ]]; then
  echo "Error: package.json version ($PKG_VERSION) does not match latest tag ($LATEST_TAG)."
  echo "Reconcile before releasing. To sync package.json up to the tag:"
  echo "  npm version $LATEST_TAG_VERSION --no-git-tag-version"
  echo "  git commit -am \"chore: sync package.json with $LATEST_TAG tag\""
  echo "  git push origin main"
  exit 1
fi

# Merge develop into main
# --no-ff: forces a merge commit so releases are visible in history and individually revertable
echo "Merging develop into main..."
git merge develop --no-ff -m "Merge develop into main for release"

# Bump version — updates package.json, creates commit, creates annotated tag
echo "Bumping version ($BUMP_TYPE)..."
NEW_VERSION=$(npm version "$BUMP_TYPE")
echo "New version: $NEW_VERSION"

# Push main + tag in one go
# --follow-tags: pushes annotated tags reachable from pushed commits (not all local tags)
# Tag push triggers production deploy via .github/workflows/deployment.yml
# SKIP_BRANCH_WARNING bypasses the pre-push hook's protected branch prompt
echo "Pushing main and tag..."
SKIP_BRANCH_WARNING=1 git push origin main --follow-tags

# Back-merge version bump into develop
echo "Back-merging main into develop..."
git checkout develop
git merge main
SKIP_BRANCH_WARNING=1 git push origin develop

# Create GitHub release with auto-generated changelog
# --target main: ensures release creation works even if the tag hasn't propagated yet
echo "Creating GitHub release..."
gh release create "$NEW_VERSION" --generate-notes --target main

echo ""
echo "Release $NEW_VERSION complete!"
