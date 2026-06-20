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

// ─── Admin notifications ─────────────────────────────────────────────────────

// Producers (webhook / signup / request modal) record an event. Created via the
// API key — see src/lib/notify.ts.
export const createAdminNotificationCustom = /* GraphQL */ `
  mutation CreateAdminNotification($input: CreateAdminNotificationInput!) {
    createAdminNotification(input: $input) {
      id type title body link read createdAt
    }
  }
`;

// Admin marks a notification read/unread.
export const updateAdminNotificationRead = /* GraphQL */ `
  mutation UpdateAdminNotification($input: UpdateAdminNotificationInput!) {
    updateAdminNotification(input: $input) {
      id read
    }
  }
`;

// Admin dismisses a notification.
export const deleteAdminNotificationCustom = /* GraphQL */ `
  mutation DeleteAdminNotification($input: DeleteAdminNotificationInput!) {
    deleteAdminNotification(input: $input) {
      id
    }
  }
`;
