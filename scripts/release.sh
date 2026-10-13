#!/usr/bin/env bash
#
# release.sh — Release workflow for mermaid-webapp.
#
# Cuts a production release of everything on `develop`: merges develop into
# main, bumps the version, tags, pushes (which triggers the deploy), back-merges
# into develop, and creates the GitHub release.
#
# For shipping a fix that's already on `main` on its own, use hotfix.sh instead.
#
# Usage: ./scripts/release.sh <major|minor|patch>
#
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/_release-lib.sh"

BUMP_TYPE="${1:-}"
validate_bump_type "$BUMP_TYPE" "Usage: ./scripts/release.sh <major|minor|patch>"

require_tools
require_clean_tree

echo "Pulling latest develop and main..."
checkout_and_pull develop
checkout_and_pull main
fetch_tags

verify_version_matches_tag

# Merge develop into main
# --no-ff: forces a merge commit so releases are visible in history and individually revertable
echo "Merging develop into main..."
git merge develop --no-ff -m "Merge develop into main for release"

bump_version "$BUMP_TYPE"
push_main_and_tag
backmerge_into_develop
create_github_release

echo ""
echo "Release $NEW_VERSION complete!"
