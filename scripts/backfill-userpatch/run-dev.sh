#!/bin/bash
# Backfill UserPatch records for the dev environment.
# Usage:
#   ./run-dev.sh           # dry run
#   ./run-dev.sh --execute # apply changes

APPSYNC_URL=https://ww3uup4jd5eaxdbdageb35qyem.appsync-api.us-east-1.amazonaws.com/graphql \
API_KEY=da2-6ecnq7ybpjc53dq3nhouzqve2u \
AMPLIFY_ENV=dev \
USER_MOUNTAIN_TABLE=UserMountain-frdyymxsgrhjbnilqjxbifaiwe-dev \
USER_TRAIL_TABLE=UserTrail-frdyymxsgrhjbnilqjxbifaiwe-dev \
USER_PATCH_TABLE=UserPatch-frdyymxsgrhjbnilqjxbifaiwe-dev \
node index.js "$@"
