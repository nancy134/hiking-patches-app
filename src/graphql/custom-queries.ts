export const listUserPatchesWithPatch = /* GraphQL */ `
  query ListUserPatchesWithPatch($filter: ModelUserPatchFilterInput, $limit: Int, $nextToken: String) {
    listUserPatches(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        patchID
        userID
        dateCompleted
        notes
        difficulty
        imageUrl
        inProgress
        createdAt
        updatedAt
        patch {
          id
          name
          description
          howToGet
          imageUrl
          regions
          difficulty
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;

