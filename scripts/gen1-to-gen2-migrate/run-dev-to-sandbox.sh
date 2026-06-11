#!/usr/bin/env bash
set -euo pipefail

# Copies Gen1 dev DynamoDB table contents into the personal Gen2 sandbox
# tables. Run with no args for a dry run; pass --execute to apply.
cd "$(dirname "$0")"

AWS_PROFILE=hiking-patches-app \
SRC_SUFFIX=frdyymxsgrhjbnilqjxbifaiwe-dev \
DEST_SUFFIX=bywflw3vpnebreoxth7mpk2rie-NONE \
node index.js "$@"
