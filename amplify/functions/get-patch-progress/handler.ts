// TODO (Phase 4): port the full completion-rule logic from
// amplify/backend/function/getPatchProgress/src/index.js.
// Update env-var references: Gen2 injects AMPLIFY_DATA_GRAPHQL_ENDPOINT
// instead of the Gen1 API_HIKINGPATCHESAPP_GRAPHQLAPIENDPOINTOUTPUT name.

import type { AppSyncResolverHandler } from 'aws-lambda';

type PatchProgressArgs =
  | { patchId: string; userId: string }
  | { patchIds: string[]; userId: string };

export const handler: AppSyncResolverHandler<PatchProgressArgs, unknown> = async (event) => {
  throw new Error('get-patch-progress handler not yet ported — see Phase 4');
};
