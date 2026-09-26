#!/bin/bash
# Import reference links into the personal dev sandbox.
#
# NOTE: the enriched CSVs were exported from PROD, and the sandbox holds a
# different, smaller dataset with different ids — matching by id finds nothing
# here. Pass --match=name for a smoke test against the ~10 patches whose names
# overlap. This env is for proving the script works, not for the real import.
#
#   ./run-dev.sh --match=name             # dry run
#   ./run-dev.sh --match=name --execute   # apply
source "$(dirname "$0")/_common.sh"
read_outputs "$(dirname "$0")/../../amplify_outputs.json"

TARGET_ENV=dev \
PATCH_TABLE=Patch-bywflw3vpnebreoxth7mpk2rie-NONE \
TRAIL_TABLE=Trail-bywflw3vpnebreoxth7mpk2rie-NONE \
AWS_PROFILE="${AWS_PROFILE:-hiking-patches-app}" \
node "$(dirname "$0")/index.js" "$@"
