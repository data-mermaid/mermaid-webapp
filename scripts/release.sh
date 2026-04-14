#!/usr/bin/env bash
#
# release.sh — Release workflow for mermaid-webapp.
#
# Usage: ./scripts/release.sh <major|minor|patch>
#
# After completion, manually:
#   1. Merge the back-merge PR on GitHub
#   2. Run: git checkout develop && git pull && git branch -d merge-main-into-develop
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
echo "Pushing main and tag..."
git push origin main --follow-tags

# Back-merge into develop via PR (branch protection prevents direct push)
# Branch is reused each release — GitHub auto-deletes after merge
BACKMERGE_BRANCH="merge-main-into-develop"
echo "Creating back-merge PR..."
git checkout -b "$BACKMERGE_BRANCH"
git merge main
git push origin "$BACKMERGE_BRANCH"
gh pr create \
  --base develop \
  --title "chore: merge main back into develop ($NEW_VERSION)" \
  --body "Back-merge version bump and release tag from $NEW_VERSION."

# Create GitHub release with auto-generated changelog
echo "Creating GitHub release..."
gh release create "$NEW_VERSION" --generate-notes

echo ""
echo "Release $NEW_VERSION complete!"
echo ""
echo "Remaining manual steps:"
echo "  1. Merge the back-merge PR on GitHub"
echo "  2. Run:"
echo "     git checkout develop && git pull && git branch -d $BACKMERGE_BRANCH"
