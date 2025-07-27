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

export const getPatchWithMountains = /* GraphQL */ `
  query GetPatchWithMountains($id: ID!) {
    getPatch(id: $id) {
      id
      name
      patchMountains {
        items {
          id
          mountain {
            id
            name
            elevation
            latitude
            longitude
	    city
	    state
          }
        }
      }
    }
  }
`;
