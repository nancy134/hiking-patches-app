import { generateClient } from 'aws-amplify/api';
import { userPatchesByUserByPatchLite, createUserPatchLite, updateUserPatchLite } from '@/graphql/custom-queries';

const client = generateClient();

/**
 * Called after a user logs a mountain or trail belonging to a patch.
 * - Creates a UserPatch with inProgress=true if none exists yet.
 * - Upgrades an existing wishlisted-only record to also be inProgress.
 * - Leaves records that are already inProgress or completed untouched.
 */
export async function ensureUserPatchInProgress(userId: string, patchId: string) {
  const result = await client.graphql({
    query: userPatchesByUserByPatchLite,
    variables: { userID: userId, patchID: patchId, limit: 1 },
    authMode: 'userPool',
  });

  const existing = (result as any).data?.userPatchesByUserByPatch?.items?.[0];

  if (!existing) {
    await client.graphql({
      query: createUserPatchLite,
      variables: {
        input: { userID: userId, patchID: patchId, inProgress: true, wishlisted: false },
      },
      authMode: 'userPool',
    });
    return;
  }

  // Already tracking in some meaningful state — leave it alone.
  if (existing.inProgress || existing.dateCompleted) return;

  // Wishlisted but not yet in progress — upgrade it.
  await client.graphql({
    query: updateUserPatchLite,
    variables: { input: { id: existing.id, inProgress: true } },
    authMode: 'userPool',
  });
}
