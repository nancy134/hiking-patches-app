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

export const getPatchWithMountainsPaged = /* GraphQL */ `
  query GetPatchWithMountains($id: ID!, $limit: Int, $nextToken: String) {
    getPatch(id: $id) {
      id
      name
      description
      howToGet
      imageUrl
      regions
      difficulty
      popularity
      hasPeaks
      patchMountains(limit: $limit, nextToken: $nextToken) {
        items {
          id
	  delisted
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
        nextToken
      }
    }
  }
`;

export const listPatchMountainsWithMountain = /* GraphQL */ `
  query ListPatchMountainsWithMountain(
    $filter: ModelPatchMountainFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPatchMountains(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        updatedAt
	delisted
        patchPatchMountainsId
        mountainPatchMountainsId
        mountain {
          id
          name
          elevation
	  city
	  state
	  latitude
	  longitude
        }
      }
      nextToken
    }
  }
`;

export const listPatchMountainsWithPatch = /* GraphQL */ `
  query ListPatchMountainsWithPatch(
    $filter: ModelPatchMountainFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPatchMountains(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        updatedAt
        patchPatchMountainsId
        mountainPatchMountainsId
        patch {
          id
          name
        }
      }
      nextToken
    }
  }
`;

export const getPatchCompletionRule = /* GraphQL */ `
  query GetPatchCompletionRule($id: ID!) {
    getPatch(id: $id) {
      id
      name
      completionRule
    }
  }
`;
