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
	wishlisted
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
	  hasPeaks
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
      hasTrails
      completionRule
      isPurchasable
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

export const createUserPatchLite = /* GraphQL */ `
  mutation CreateUserPatchLite($input: CreateUserPatchInput!) {
    createUserPatch(input: $input) {
      id patchID userID wishlisted inProgress dateCompleted
    }
  }
`;

export const updateUserPatchLite = /* GraphQL */ `
  mutation UpdateUserPatchLite($input: UpdateUserPatchInput!) {
    updateUserPatch(input: $input) {
      id patchID userID wishlisted inProgress dateCompleted
    }
  }
`;

export const customCreateUserPatch = `
  mutation customCreateUserPatch($input: CreateUserPatchInput!) {
    createUserPatch(input: $input) {
      id
      patchID
      userID
      dateCompleted
      inProgress
      notes
      difficulty
      imageUrl
      wishlisted
      createdAt
      updatedAt
    }
  }
`;

export const customUpdateUserPatch = `
  mutation customUpdateUserPatch($input: UpdateUserPatchInput!) {
    updateUserPatch(input: $input) {
      id
      patchID
      userID
      dateCompleted
      inProgress
      notes
      difficulty
      imageUrl
      wishlisted
      createdAt
      updatedAt
    }
  }
`;

export const userPatchesByUserByPatchLite = /* GraphQL */ `
  query UserPatchesByUserByPatchLite($userID: String!, $patchID: ID!, $limit: Int) {
    userPatchesByUserByPatch(userID: $userID, patchID: { eq: $patchID }, limit: $limit) {
      items { id patchID userID wishlisted inProgress dateCompleted }
      nextToken
    }
  }
`;

export const listPatchTrailsWithPatch = /* GraphQL */ `
  query ListPatchTrailsWithPatch($limit: Int, $nextToken: String, $filter: ModelPatchTrailFilterInput) {
    listPatchTrails(limit: $limit, nextToken: $nextToken, filter: $filter) {
      items {
        id
        patchPatchTrailsId
        trailPatchTrailsId
        requiredMiles
        patch { id name description createdAt }
      }
      nextToken
    }
  }
`;

export const getPatchWithTrailsPaged = /* GraphQL */ `
  query GetPatchWithTrails($id: ID!, $limit: Int, $nextToken: String) {
    getPatch(id: $id) {
      id
      name
      patchTrails(limit: $limit, nextToken: $nextToken) {
        items {
          id
          requiredMiles
          trailPatchTrailsId
          trail {
            id
            name
            lengthMiles
          }
        }
        nextToken
      }
    }
  }
`;

export const listPatchTrailsWithTrail = /* GraphQL */ `
  query ListPatchTrailsWithTrail($filter: ModelPatchTrailFilterInput, $limit: Int, $nextToken: String) {
    listPatchTrails(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        requiredMiles
        patchPatchTrailsId
        trailPatchTrailsId
        trail {
          id
          name
          lengthMiles
        }
      }
      nextToken
    }
  }
`;

export const getTrailPublic = /* GraphQL */ `query GetTrailPublic($id: ID!) {
  getTrail(id: $id) {
    id
    name
    description
    lengthMiles
    createdAt
    updatedAt
    __typename
  }
}
`;

export const getMountainPublic = /* GraphQL */ `
  query GetMountainPublic($id: ID!) {
    getMountain(id: $id) {
      id
      name
      elevation
      latitude
      longitude
      city
      state
      createdAt
      updatedAt
    }
  }
`;
