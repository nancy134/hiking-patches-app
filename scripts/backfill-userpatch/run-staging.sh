#!/bin/bash
# Backfill UserPatch records for the staging environment.
# Usage:
#   ./run-staging.sh           # dry run
#   ./run-staging.sh --execute # apply changes
#
# Fill in APPSYNC_URL and API_KEY from the staging aws-exports or AppSync console.

APPSYNC_URL=https://xw7hpa7ve5hkxi4lj5ekcg46ue.appsync-api.us-east-1.amazonaws.com/graphql \
API_KEY=da2-fcf3pmlgzbfuho3uq6egj62a5e \
AMPLIFY_ENV=staging \
USER_MOUNTAIN_TABLE=UserMountain-gprnvhwa3fehjjoibgvscvcsxa-staging \
USER_TRAIL_TABLE=UserTrail-gprnvhwa3fehjjoibgvscvcsxa-staging \
USER_PATCH_TABLE=UserPatch-gprnvhwa3fehjjoibgvscvcsxa-staging \
node index.js "$@"
