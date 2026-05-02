#!/bin/bash
# Backfill UserPatch records for the prod environment.
# Usage:
#   ./run-prod.sh           # dry run
#   ./run-prod.sh --execute # apply changes
#
# Fill in API_KEY from the prod aws-exports or AppSync console.

APPSYNC_URL=https://iyn36pcfevgqtmnbvi6jelsyaa.appsync-api.us-east-1.amazonaws.com/graphql \
API_KEY=da2-souo62vpjraj3bnibwv2rwb7ny \
AMPLIFY_ENV=prod \
USER_MOUNTAIN_TABLE=UserMountain-uewvdg4uevbyjfckupfvdc6nhe-prod \
USER_TRAIL_TABLE=UserTrail-uewvdg4uevbyjfckupfvdc6nhe-prod \
USER_PATCH_TABLE=UserPatch-uewvdg4uevbyjfckupfvdc6nhe-prod \
node index.js "$@"
