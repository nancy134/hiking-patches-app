#!/usr/bin/env bash
set -euo pipefail

# Copies Gen1 prod DynamoDB table contents into the Gen2 prod (branch-deploy)
# tables. Run with no args for a dry run; pass --execute to apply.
cd "$(dirname "$0")"

AWS_PROFILE=hiking-patches-app \
SRC_SUFFIX=uewvdg4uevbyjfckupfvdc6nhe-prod \
DEST_SUFFIX=hsodmdm5pvgnphz77odanhfwpy-NONE \
node index.js "$@"
