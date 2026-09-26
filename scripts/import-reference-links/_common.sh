# Shared by the run-*.sh wrappers. Pulls the AppSync endpoint and API key out of
# the generated outputs file for the target env rather than hardcoding them, so
# no API key ends up committed. Table names are the Gen2 "<Model>-<stackhash>-NONE"
# form and were confirmed against the amplify:branch-name / amplify:deployment-type
# tags on the tables themselves — do not guess these, the -NONE suffix is used by
# every env including prod.
set -euo pipefail

read_outputs() {
  local file="$1"
  if [ ! -f "$file" ]; then
    echo "ERROR: $file not found. Run the deploy for this env first (see CLAUDE.md)." >&2
    exit 1
  fi
  APPSYNC_URL=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['data']['url'])" "$file")
  API_KEY=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['data']['api_key'])" "$file")
  export APPSYNC_URL API_KEY
}
