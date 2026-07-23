#!/usr/bin/env bash
#
# _release-lib.sh — Shared helpers for release.sh and hotfix.sh.
#
# Not executable on its own. Source it from a release script:
#   source "$(dirname "${BASH_SOURCE[0]}")/_release-lib.sh"
#
# Functions communicate results via two globals, set as a side effect:
#   LATEST_TAG   — set by verify_version_matches_tag (e.g. "v2.35.0")
#   NEW_VERSION  — set by bump_version              (e.g. "v2.35.1")
#
# Callers should run `set -euo pipefail` themselves.

# Abort unless the bump type is major/minor/patch. $2 is the caller's usage line.
validate_bump_type() {
  local bump_type="$1" usage="$2"
  if [[ ! "$bump_type" =~ ^(major|minor|patch)$ ]]; then
    echo "$usage"
    exit 1
  fi
}

# Abort unless git, npm and gh are all installed.
require_tools() {
  local cmd
  for cmd in git npm gh; do
    if ! command -v "$cmd" &> /dev/null; then
      echo "Error: '$cmd' is not installed."
      exit 1
    fi
  done
}

# Abort unless the working tree is clean (including untracked files).
require_clean_tree() {
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "Error: Working tree is not clean. Commit or stash changes first."
    exit 1
  fi
}

# Check out a branch and pull the latest.
checkout_and_pull() {
  git checkout "$1" && git pull
}

# Fetch tags, force-updating mutable ones.
# --force lets mutable tags (e.g. lokalise-sync-develop, which the Lokalise
# workflow keeps moving) update in place instead of aborting with "would
# clobber existing tag". Annotated release tags (vX.Y.Z) never move, so this
# only affects sync tags.
fetch_tags() {
  git fetch --tags --force
}

# Verify package.json's version matches the latest semver release tag, and
# set LATEST_TAG. If they drift (e.g. someone tagged manually without bumping
# package.json), `npm version` can either fail ("tag already exists") or
# silently produce a version lower than an existing tag. Abort and let the
# user reconcile first.
verify_version_matches_tag() {
  local pkg_version latest_tag_version
  pkg_version=$(node -p "require('./package.json').version")
  # Filter to semver release tags only. Without the grep, a non-version tag
  # (e.g. lokalise-sync-develop) could sort to the top and break the comparison.
  LATEST_TAG=$(git tag --sort=-v:refname | grep -E '^v?[0-9]+\.[0-9]+\.[0-9]+$' | head -n 1)
  latest_tag_version="${LATEST_TAG#v}"
  if [[ "$pkg_version" != "$latest_tag_version" ]]; then
    echo "Error: package.json version ($pkg_version) does not match latest tag ($LATEST_TAG)."
    echo "Reconcile before releasing. To sync package.json up to the tag:"
    echo "  npm version $latest_tag_version --no-git-tag-version"
    echo "  git commit -am \"chore: sync package.json with $LATEST_TAG tag\""
    echo "  git push origin main"
    exit 1
  fi
}

# Bump the version and set NEW_VERSION.
# `npm version` updates package.json, creates the version commit, and creates
# the annotated tag.
bump_version() {
  echo "Bumping version ($1)..."
  NEW_VERSION=$(npm version "$1")
  echo "New version: $NEW_VERSION"
}

# Push main + the new tag in one go.
# --follow-tags: pushes annotated tags reachable from pushed commits (not all local tags)
# Tag push triggers production deploy via .github/workflows/deployment.yml
# SKIP_BRANCH_WARNING bypasses the pre-push hook's protected branch prompt
push_main_and_tag() {
  echo "Pushing main and tag..."
  SKIP_BRANCH_WARNING=1 git push origin main --follow-tags
}

# Merge main back into develop so the version bump (and any main-only commits)
# don't regress there.
backmerge_into_develop() {
  echo "Back-merging main into develop..."
  git checkout develop && git pull
  git merge main
  SKIP_BRANCH_WARNING=1 git push origin develop
}

# Create the GitHub release with auto-generated changelog.
# --target main: ensures release creation works even if the tag hasn't propagated yet
create_github_release() {
  echo "Creating GitHub release..."
  gh release create "$NEW_VERSION" --generate-notes --target main
}
