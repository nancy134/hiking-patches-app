/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getPatchProgressSummary = /* GraphQL */ `query GetPatchProgressSummary($patchId: ID!, $userId: ID!) {
  getPatchProgressSummary(patchId: $patchId, userId: $userId) {
    patchId
    userId
    completed
    denom
    percent
    note
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPatchProgressSummaryQueryVariables,
  APITypes.GetPatchProgressSummaryQuery
>;
export const listPatchProgress = /* GraphQL */ `query ListPatchProgress($patchIds: [ID!]!, $userId: ID!) {
  listPatchProgress(patchIds: $patchIds, userId: $userId) {
    patchId
    userId
    completed
    denom
    percent
    note
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPatchProgressQueryVariables,
  APITypes.ListPatchProgressQuery
>;
export const getPatch = /* GraphQL */ `query GetPatch($id: ID!) {
  getPatch(id: $id) {
    id
    name
    description
    howToGet
    imageUrl
    regions
    difficulty
    latitude
    longitude
    popularity
    hasPeaks
    hasTrails
    completionRule
    isPurchasable
    userPatches {
      nextToken
      __typename
    }
    patchMountains {
      nextToken
      __typename
    }
    patchTrails {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetPatchQueryVariables, APITypes.GetPatchQuery>;
export const listPatches = /* GraphQL */ `query ListPatches(
  $filter: ModelPatchFilterInput
  $limit: Int
  $nextToken: String
) {
  listPatches(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      howToGet
      imageUrl
      regions
      difficulty
      latitude
      longitude
      popularity
      hasPeaks
      hasTrails
      completionRule
      isPurchasable
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPatchesQueryVariables,
  APITypes.ListPatchesQuery
>;
export const getUserPatch = /* GraphQL */ `query GetUserPatch($id: ID!) {
  getUserPatch(id: $id) {
    id
    patchID
    patch {
      id
      name
      description
      howToGet
      imageUrl
      regions
      difficulty
      latitude
      longitude
      popularity
      hasPeaks
      hasTrails
      completionRule
      isPurchasable
      createdAt
      updatedAt
      __typename
    }
    userID
    dateCompleted
    notes
    difficulty
    imageUrl
    inProgress
    wishlisted
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserPatchQueryVariables,
  APITypes.GetUserPatchQuery
>;
export const listUserPatches = /* GraphQL */ `query ListUserPatches(
  $filter: ModelUserPatchFilterInput
  $limit: Int
  $nextToken: String
) {
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
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserPatchesQueryVariables,
  APITypes.ListUserPatchesQuery
>;
export const userPatchesByPatch = /* GraphQL */ `query UserPatchesByPatch(
  $patchID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserPatchFilterInput
  $limit: Int
  $nextToken: String
) {
  userPatchesByPatch(
    patchID: $patchID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserPatchesByPatchQueryVariables,
  APITypes.UserPatchesByPatchQuery
>;
export const userPatchesByUserByPatch = /* GraphQL */ `query UserPatchesByUserByPatch(
  $userID: String!
  $patchID: ModelIDKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelUserPatchFilterInput
  $limit: Int
  $nextToken: String
) {
  userPatchesByUserByPatch(
    userID: $userID
    patchID: $patchID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserPatchesByUserByPatchQueryVariables,
  APITypes.UserPatchesByUserByPatchQuery
>;
export const getPatchRequest = /* GraphQL */ `query GetPatchRequest($id: ID!) {
  getPatchRequest(id: $id) {
    id
    email
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPatchRequestQueryVariables,
  APITypes.GetPatchRequestQuery
>;
export const listPatchRequests = /* GraphQL */ `query ListPatchRequests(
  $filter: ModelPatchRequestFilterInput
  $limit: Int
  $nextToken: String
) {
  listPatchRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      email
      description
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPatchRequestsQueryVariables,
  APITypes.ListPatchRequestsQuery
>;
export const getMountain = /* GraphQL */ `query GetMountain($id: ID!) {
  getMountain(id: $id) {
    id
    name
    elevation
    latitude
    longitude
    city
    state
    patchMountains {
      nextToken
      __typename
    }
    userMountains {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMountainQueryVariables,
  APITypes.GetMountainQuery
>;
export const listMountains = /* GraphQL */ `query ListMountains(
  $filter: ModelMountainFilterInput
  $limit: Int
  $nextToken: String
) {
  listMountains(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      elevation
      latitude
      longitude
      city
      state
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMountainsQueryVariables,
  APITypes.ListMountainsQuery
>;
export const getPatchMountain = /* GraphQL */ `query GetPatchMountain($id: ID!) {
  getPatchMountain(id: $id) {
    id
    patchPatchMountainsId
    mountainPatchMountainsId
    patch {
      id
      name
      description
      howToGet
      imageUrl
      regions
      difficulty
      latitude
      longitude
      popularity
      hasPeaks
      hasTrails
      completionRule
      isPurchasable
      createdAt
      updatedAt
      __typename
    }
    mountain {
      id
      name
      elevation
      latitude
      longitude
      city
      state
      createdAt
      updatedAt
      __typename
    }
    delisted
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPatchMountainQueryVariables,
  APITypes.GetPatchMountainQuery
>;
export const listPatchMountains = /* GraphQL */ `query ListPatchMountains(
  $filter: ModelPatchMountainFilterInput
  $limit: Int
  $nextToken: String
) {
  listPatchMountains(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      patchPatchMountainsId
      mountainPatchMountainsId
      delisted
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPatchMountainsQueryVariables,
  APITypes.ListPatchMountainsQuery
>;
export const patchMountainsByPatch = /* GraphQL */ `query PatchMountainsByPatch(
  $patchPatchMountainsId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelPatchMountainFilterInput
  $limit: Int
  $nextToken: String
) {
  patchMountainsByPatch(
    patchPatchMountainsId: $patchPatchMountainsId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      patchPatchMountainsId
      mountainPatchMountainsId
      delisted
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PatchMountainsByPatchQueryVariables,
  APITypes.PatchMountainsByPatchQuery
>;
export const patchMountainsByMountain = /* GraphQL */ `query PatchMountainsByMountain(
  $mountainPatchMountainsId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelPatchMountainFilterInput
  $limit: Int
  $nextToken: String
) {
  patchMountainsByMountain(
    mountainPatchMountainsId: $mountainPatchMountainsId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      patchPatchMountainsId
      mountainPatchMountainsId
      delisted
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PatchMountainsByMountainQueryVariables,
  APITypes.PatchMountainsByMountainQuery
>;
export const getUserMountain = /* GraphQL */ `query GetUserMountain($id: ID!) {
  getUserMountain(id: $id) {
    id
    userID
    mountainID
    dateClimbed
    notes
    mountain {
      id
      name
      elevation
      latitude
      longitude
      city
      state
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserMountainQueryVariables,
  APITypes.GetUserMountainQuery
>;
export const listUserMountains = /* GraphQL */ `query ListUserMountains(
  $filter: ModelUserMountainFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserMountains(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userID
      mountainID
      dateClimbed
      notes
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserMountainsQueryVariables,
  APITypes.ListUserMountainsQuery
>;
export const userMountainsByUser = /* GraphQL */ `query UserMountainsByUser(
  $userID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserMountainFilterInput
  $limit: Int
  $nextToken: String
) {
  userMountainsByUser(
    userID: $userID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userID
      mountainID
      dateClimbed
      notes
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserMountainsByUserQueryVariables,
  APITypes.UserMountainsByUserQuery
>;
export const userMountainsByUserByMountain = /* GraphQL */ `query UserMountainsByUserByMountain(
  $userID: ID!
  $mountainID: ModelIDKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelUserMountainFilterInput
  $limit: Int
  $nextToken: String
) {
  userMountainsByUserByMountain(
    userID: $userID
    mountainID: $mountainID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userID
      mountainID
      dateClimbed
      notes
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserMountainsByUserByMountainQueryVariables,
  APITypes.UserMountainsByUserByMountainQuery
>;
export const userMountainsByUserByDate = /* GraphQL */ `query UserMountainsByUserByDate(
  $userID: ID!
  $dateClimbed: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelUserMountainFilterInput
  $limit: Int
  $nextToken: String
) {
  userMountainsByUserByDate(
    userID: $userID
    dateClimbed: $dateClimbed
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userID
      mountainID
      dateClimbed
      notes
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserMountainsByUserByDateQueryVariables,
  APITypes.UserMountainsByUserByDateQuery
>;
export const userMountainsByMountain = /* GraphQL */ `query UserMountainsByMountain(
  $mountainID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserMountainFilterInput
  $limit: Int
  $nextToken: String
) {
  userMountainsByMountain(
    mountainID: $mountainID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userID
      mountainID
      dateClimbed
      notes
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserMountainsByMountainQueryVariables,
  APITypes.UserMountainsByMountainQuery
>;
export const getTrail = /* GraphQL */ `query GetTrail($id: ID!) {
  getTrail(id: $id) {
    id
    name
    description
    lengthMiles
    patchTrails {
      nextToken
      __typename
    }
    userTrails {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetTrailQueryVariables, APITypes.GetTrailQuery>;
export const listTrails = /* GraphQL */ `query ListTrails(
  $filter: ModelTrailFilterInput
  $limit: Int
  $nextToken: String
) {
  listTrails(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      lengthMiles
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTrailsQueryVariables,
  APITypes.ListTrailsQuery
>;
export const getPatchTrail = /* GraphQL */ `query GetPatchTrail($id: ID!) {
  getPatchTrail(id: $id) {
    id
    patchPatchTrailsId
    trailPatchTrailsId
    patch {
      id
      name
      description
      howToGet
      imageUrl
      regions
      difficulty
      latitude
      longitude
      popularity
      hasPeaks
      hasTrails
      completionRule
      isPurchasable
      createdAt
      updatedAt
      __typename
    }
    trail {
      id
      name
      description
      lengthMiles
      createdAt
      updatedAt
      __typename
    }
    requiredMiles
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPatchTrailQueryVariables,
  APITypes.GetPatchTrailQuery
>;
export const listPatchTrails = /* GraphQL */ `query ListPatchTrails(
  $filter: ModelPatchTrailFilterInput
  $limit: Int
  $nextToken: String
) {
  listPatchTrails(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      patchPatchTrailsId
      trailPatchTrailsId
      requiredMiles
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPatchTrailsQueryVariables,
  APITypes.ListPatchTrailsQuery
>;
export const patchTrailsByPatch = /* GraphQL */ `query PatchTrailsByPatch(
  $patchPatchTrailsId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelPatchTrailFilterInput
  $limit: Int
  $nextToken: String
) {
  patchTrailsByPatch(
    patchPatchTrailsId: $patchPatchTrailsId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      patchPatchTrailsId
      trailPatchTrailsId
      requiredMiles
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PatchTrailsByPatchQueryVariables,
  APITypes.PatchTrailsByPatchQuery
>;
export const patchTrailsByTrail = /* GraphQL */ `query PatchTrailsByTrail(
  $trailPatchTrailsId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelPatchTrailFilterInput
  $limit: Int
  $nextToken: String
) {
  patchTrailsByTrail(
    trailPatchTrailsId: $trailPatchTrailsId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      patchPatchTrailsId
      trailPatchTrailsId
      requiredMiles
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PatchTrailsByTrailQueryVariables,
  APITypes.PatchTrailsByTrailQuery
>;
export const getUserTrail = /* GraphQL */ `query GetUserTrail($userID: ID!, $trailID: ID!) {
  getUserTrail(userID: $userID, trailID: $trailID) {
    userID
    trailID
    dateCompleted
    milesRemaining
    notes
    trail {
      id
      name
      description
      lengthMiles
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserTrailQueryVariables,
  APITypes.GetUserTrailQuery
>;
export const listUserTrails = /* GraphQL */ `query ListUserTrails(
  $userID: ID
  $trailID: ModelIDKeyConditionInput
  $filter: ModelUserTrailFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listUserTrails(
    userID: $userID
    trailID: $trailID
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      userID
      trailID
      dateCompleted
      milesRemaining
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserTrailsQueryVariables,
  APITypes.ListUserTrailsQuery
>;
export const userTrailsByUser = /* GraphQL */ `query UserTrailsByUser(
  $userID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserTrailFilterInput
  $limit: Int
  $nextToken: String
) {
  userTrailsByUser(
    userID: $userID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      userID
      trailID
      dateCompleted
      milesRemaining
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserTrailsByUserQueryVariables,
  APITypes.UserTrailsByUserQuery
>;
export const userTrailsByUserByDateCompleted = /* GraphQL */ `query UserTrailsByUserByDateCompleted(
  $userID: ID!
  $dateCompleted: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelUserTrailFilterInput
  $limit: Int
  $nextToken: String
) {
  userTrailsByUserByDateCompleted(
    userID: $userID
    dateCompleted: $dateCompleted
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      userID
      trailID
      dateCompleted
      milesRemaining
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserTrailsByUserByDateCompletedQueryVariables,
  APITypes.UserTrailsByUserByDateCompletedQuery
>;
export const userTrailsByTrail = /* GraphQL */ `query UserTrailsByTrail(
  $trailID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserTrailFilterInput
  $limit: Int
  $nextToken: String
) {
  userTrailsByTrail(
    trailID: $trailID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      userID
      trailID
      dateCompleted
      milesRemaining
      notes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserTrailsByTrailQueryVariables,
  APITypes.UserTrailsByTrailQuery
>;
export const getPatchPurchase = /* GraphQL */ `query GetPatchPurchase($id: ID!) {
  getPatchPurchase(id: $id) {
    id
    userId
    patchId
    stripeSessionId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPatchPurchaseQueryVariables,
  APITypes.GetPatchPurchaseQuery
>;
export const listPatchPurchases = /* GraphQL */ `query ListPatchPurchases(
  $filter: ModelPatchPurchaseFilterInput
  $limit: Int
  $nextToken: String
) {
  listPatchPurchases(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      patchId
      stripeSessionId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPatchPurchasesQueryVariables,
  APITypes.ListPatchPurchasesQuery
>;
