export const deleteUserMountainMinimal = /* GraphQL */ `
  mutation DeleteUserMountainMinimal($input: DeleteUserMountainInput!) {
    deleteUserMountain(input: $input) {
      id
    }
  }
`;

export const createUserMountainMinimal = /* GraphQL */ `
  mutation CreateUserMountainMinimal($input: CreateUserMountainInput!) {
    createUserMountain(input: $input) {
      id
      userID
      mountainID
      dateClimbed
      notes
      createdAt
      updatedAt
      owner
    }
  }
`;

export const createUserTrailMinimal = /* GraphQL */ `
  mutation CreateUserTrailMinimal($input: CreateUserTrailInput!) {
    createUserTrail(input: $input) {
      userID
      trailID
      dateCompleted
      milesRemaining
      notes
    }
  }
`;

export const updateUserTrailMinimal = /* GraphQL */ `
  mutation UpdateUserTrailMinimal($input: UpdateUserTrailInput!) {
    updateUserTrail(input: $input) {
      userID
      trailID
      dateCompleted
      milesRemaining
      notes
    }
  }
`;

export const deleteUserTrailMinimal = /* GraphQL */ `
  mutation DeleteUserTrailMinimal($input: DeleteUserTrailInput!) {
    deleteUserTrail(input: $input) {
      userID
      trailID
    }
  }
`;

// ─── Patch ownership ─────────────────────────────────────────────────────────

// A user submits an ownership request for a patch.
export const createPatchOwnerRequestCustom = /* GraphQL */ `
  mutation CreatePatchOwnerRequest($input: CreatePatchOwnerRequestInput!) {
    createPatchOwnerRequest(input: $input) {
      id patchID patchName userID userEmail message status createdAt
    }
  }
`;

// Admin approves a request → records the user as an owner of the patch.
export const createPatchOwnerCustom = /* GraphQL */ `
  mutation CreatePatchOwner($input: CreatePatchOwnerInput!) {
    createPatchOwner(input: $input) {
      id patchID userID userEmail patchName
    }
  }
`;

// Admin approves or rejects a request.
export const updatePatchOwnerRequestStatus = /* GraphQL */ `
  mutation UpdatePatchOwnerRequest($input: UpdatePatchOwnerRequestInput!) {
    updatePatchOwnerRequest(input: $input) {
      id status
    }
  }
`;
