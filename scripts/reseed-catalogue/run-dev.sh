#!/bin/bash
# Replace the dev sandbox catalogue with a copy of prod's.
#   ./run-dev.sh            # dry run
#   ./run-dev.sh --execute  # apply
set -euo pipefail
SOURCE_ENV=prod TARGET_ENV=dev \
AWS_PROFILE="${AWS_PROFILE:-hiking-patches-app}" \
node "$(dirname "$0")/index.js" "$@"
