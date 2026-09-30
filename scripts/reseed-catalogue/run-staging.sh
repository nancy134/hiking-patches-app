#!/bin/bash
# Replace the staging catalogue with a copy of prod's.
#   ./run-staging.sh            # dry run
#   ./run-staging.sh --execute  # apply
set -euo pipefail
if [[ " $* " == *" --execute "* ]]; then
  echo "This REPLACES staging's patches/mountains/trails with prod's and DELETES"
  echo "staging's user progress rows. A backup is written first."
  read -r -p "Type 'staging' to continue: " confirm
  [ "$confirm" = "staging" ] || { echo "Aborted."; exit 1; }
fi
SOURCE_ENV=prod TARGET_ENV=staging \
AWS_PROFILE="${AWS_PROFILE:-hiking-patches-app}" \
node "$(dirname "$0")/index.js" "$@"
