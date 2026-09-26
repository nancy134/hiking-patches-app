#!/bin/bash
# Import reference links into PRODUCTION.
#
# The enriched CSVs were exported from prod, so this is the env where the ids
# actually match and the real import happens. Dry run first, read the summary,
# and only then pass --execute.
#
#   ./run-prod.sh              # dry run
#   ./run-prod.sh --execute    # apply
source "$(dirname "$0")/_common.sh"
read_outputs "$(dirname "$0")/../../.amplify/outputs-prod/amplify_outputs.json"

if [[ " $* " == *" --execute "* ]]; then
  echo "About to write reference links to PRODUCTION (Patch-hsodmdm5pvgnphz77odanhfwpy-NONE)."
  read -r -p "Type 'prod' to continue: " confirm
  [ "$confirm" = "prod" ] || { echo "Aborted."; exit 1; }
fi

TARGET_ENV=prod \
PATCH_TABLE=Patch-hsodmdm5pvgnphz77odanhfwpy-NONE \
TRAIL_TABLE=Trail-hsodmdm5pvgnphz77odanhfwpy-NONE \
AWS_PROFILE="${AWS_PROFILE:-hiking-patches-app}" \
node "$(dirname "$0")/index.js" "$@"
