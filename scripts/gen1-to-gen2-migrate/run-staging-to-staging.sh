#!/usr/bin/env bash
set -euo pipefail

# Copies Gen1 staging DynamoDB table contents into the Gen2 staging
# (branch-deploy) tables. Run with no args for a dry run; pass --execute to apply.
cd "$(dirname "$0")"

AWS_PROFILE=hiking-patches-app \
SRC_SUFFIX=gprnvhwa3fehjjoibgvscvcsxa-staging \
DEST_SUFFIX=ib3bqslbhncstg7i4ascxdpun4-NONE \
node index.js "$@"
