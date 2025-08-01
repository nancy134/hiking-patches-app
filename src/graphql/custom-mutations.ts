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

