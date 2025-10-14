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
