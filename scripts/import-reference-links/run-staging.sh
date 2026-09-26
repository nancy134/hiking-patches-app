#!/bin/bash
# Import reference links into staging.
#   ./run-staging.sh           # dry run
#   ./run-staging.sh --execute # apply
source "$(dirname "$0")/_common.sh"
read_outputs "$(dirname "$0")/../../.amplify/outputs-staging/amplify_outputs.json"

TARGET_ENV=staging \
PATCH_TABLE=Patch-ib3bqslbhncstg7i4ascxdpun4-NONE \
TRAIL_TABLE=Trail-ib3bqslbhncstg7i4ascxdpun4-NONE \
AWS_PROFILE="${AWS_PROFILE:-hiking-patches-app}" \
node "$(dirname "$0")/index.js" "$@"
