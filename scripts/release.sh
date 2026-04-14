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

# Merge develop into main
# --no-ff: forces a merge commit so releases are visible in history and individually revertable
echo "Merging develop into main..."
git merge develop --no-ff -m "Merge develop into main for release"

# Bump version — updates package.json, creates commit, creates annotated tag
echo "Bumping version ($BUMP_TYPE)..."
npm version "$BUMP_TYPE"
NEW_VERSION="v$(node -p "require('./package.json').version")"
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
