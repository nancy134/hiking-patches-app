/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getAdminNotification = /* GraphQL */ `query GetAdminNotification($id: ID!) {
  getAdminNotification(id: $id) {
    body
    createdAt
    id
    link
    read
    title
    type
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAdminNotificationQueryVariables,
  APITypes.GetAdminNotificationQuery
>;
export const getAppSetting = /* GraphQL */ `query GetAppSetting($key: String!) {
  getAppSetting(key: $key) {
    createdAt
    key
    updatedAt
    value
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAppSettingQueryVariables,
  APITypes.GetAppSettingQuery
>;
export const getMountain = /* GraphQL */ `query GetMountain($id: ID!) {
  getMountain(id: $id) {
    alltrailsUrl
    city
    createdAt
    elevation
    id
    latitude
    longitude
    name
    patchMountains {
      nextToken
      __typename
    }
    peakbaggerUrl
    state
    updatedAt
    userMountains {
      nextToken
      __typename
    }
    weatherUrl
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMountainQueryVariables,
  APITypes.GetMountainQuery
>;
export const getPatch = /* GraphQL */ `query GetPatch($id: ID!) {
  getPatch(id: $id) {
    alltrailsUrl
    completionRule
    createdAt
    description
    difficulty
    facebookUrl
    formUrl
    hasPeaks
    hasTrails
    howToGet
    id
    imageUrl
    isPurchasable
    latitude
    longitude
    name
    patchMountains {
      nextToken
      __typename
    }
    patchTrails {
      nextToken
      __typename
    }
    popularity
    purchaseUrl
    regions
    seasons
    status
    updatedAt
    userPatches {
      nextToken
      __typename
    }
    websiteUrl
    __typename
  }
}
` as GeneratedQuery<APITypes.GetPatchQueryVariables, APITypes.GetPatchQuery>;
export const getPatchMountain = /* GraphQL */ `query GetPatchMountain($id: ID!) {
  getPatchMountain(id: $id) {
    createdAt
    delisted
    id
    mountain {
      alltrailsUrl
      city
      createdAt
      elevation
      id
      latitude
      longitude
      name
      peakbaggerUrl
      state
      updatedAt
      weatherUrl
      __typename
    }
    mountainPatchMountainsId
    patch {
      alltrailsUrl
      completionRule
      createdAt
      description
      difficulty
      facebookUrl
      formUrl
      hasPeaks
      hasTrails
      howToGet
      id
      imageUrl
      isPurchasable
      latitude
      longitude
      name
      popularity
      purchaseUrl
      regions
      seasons
      status
      updatedAt
      websiteUrl
      __typename
    }
    patchPatchMountainsId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPatchMountainQueryVariables,
  APITypes.GetPatchMountainQuery
>;
export const getPatchOwner = /* GraphQL */ `query GetPatchOwner($id: ID!) {
  getPatchOwner(id: $id) {
    createdAt
    id
    patchID
    patchName
    updatedAt
    userEmail
    userID
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPatchOwnerQueryVariables,
  APITypes.GetPatchOwnerQuery
>;
export const getPatchOwnerRequest = /* GraphQL */ `query GetPatchOwnerRequest($id: ID!) {
  getPatchOwnerRequest(id: $id) {
    createdAt
    id
    message
    patchID
    patchName
    status
    updatedAt
    userEmail
    userID
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPatchOwnerRequestQueryVariables,
  APITypes.GetPatchOwnerRequestQuery
>;
export const getPatchProgressSummary = /* GraphQL */ `query GetPatchProgressSummary($patchId: ID!, $userId: ID!) {
  getPatchProgressSummary(patchId: $patchId, userId: $userId) {
    completed
    denom
    note
    patchId
    percent
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPatchProgressSummaryQueryVariables,
  APITypes.GetPatchProgressSummaryQuery
>;
export const getPatchPurchase = /* GraphQL */ `query GetPatchPurchase($id: ID!) {
  getPatchPurchase(id: $id) {
    amount
    createdAt
    currency
    id
    patchId
    stripeReceiptUrl
    stripeSessionId
    updatedAt
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPatchPurchaseQueryVariables,
  APITypes.GetPatchPurchaseQuery
>;
export const getPatchRequest = /* GraphQL */ `query GetPatchRequest($id: ID!) {
  getPatchRequest(id: $id) {
    createdAt
    description
    email
    id
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPatchRequestQueryVariables,
  APITypes.GetPatchRequestQuery
>;
export const getPatchTrail = /* GraphQL */ `query GetPatchTrail($id: ID!) {
  getPatchTrail(id: $id) {
    createdAt
    id
    patch {
      alltrailsUrl
      completionRule
      createdAt
      description
      difficulty
      facebookUrl
      formUrl
      hasPeaks
      hasTrails
      howToGet
      id
      imageUrl
      isPurchasable
      latitude
      longitude
      name
      popularity
      purchaseUrl
      regions
      seasons
      status
      updatedAt
      websiteUrl
      __typename
    }
    patchPatchTrailsId
    requiredMiles
    trail {
      alltrailsUrl
      createdAt
      description
      id
      lengthMiles
      name
      trailLinkUrl
      updatedAt
      __typename
    }
    trailPatchTrailsId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPatchTrailQueryVariables,
  APITypes.GetPatchTrailQuery
>;
export const getRelatedPatches = /* GraphQL */ `query GetRelatedPatches($limit: Int, $patchId: ID!) {
  getRelatedPatches(limit: $limit, patchId: $patchId) {
    description
    difficulty
    hasPeaks
    hasTrails
    id
    imageUrl
    isPurchasable
    matchScore
    name
    popularity
    regions
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetRelatedPatchesQueryVariables,
  APITypes.GetRelatedPatchesQuery
>;
export const getTrail = /* GraphQL */ `query GetTrail($id: ID!) {
  getTrail(id: $id) {
    alltrailsUrl
    createdAt
    description
    id
    lengthMiles
    name
    patchTrails {
      nextToken
      __typename
    }
    trailLinkUrl
    updatedAt
    userTrails {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<APITypes.GetTrailQueryVariables, APITypes.GetTrailQuery>;
export const getUserMountain = /* GraphQL */ `query GetUserMountain($id: ID!) {
  getUserMountain(id: $id) {
    createdAt
    dateClimbed
    id
    mountain {
      alltrailsUrl
      city
      createdAt
      elevation
      id
      latitude
      longitude
      name
      peakbaggerUrl
      state
      updatedAt
      weatherUrl
      __typename
    }
    mountainID
    notes
    owner
    updatedAt
    userID
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserMountainQueryVariables,
  APITypes.GetUserMountainQuery
>;
export const getUserPatch = /* GraphQL */ `query GetUserPatch($id: ID!) {
  getUserPatch(id: $id) {
    createdAt
    dateCompleted
    difficulty
    id
    imageUrl
    inProgress
    notes
    patch {
      alltrailsUrl
      completionRule
      createdAt
      description
      difficulty
      facebookUrl
      formUrl
      hasPeaks
      hasTrails
      howToGet
      id
      imageUrl
      isPurchasable
      latitude
      longitude
      name
      popularity
      purchaseUrl
      regions
      seasons
      status
      updatedAt
      websiteUrl
      __typename
    }
    patchID
    updatedAt
    userID
    wishlisted
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserPatchQueryVariables,
  APITypes.GetUserPatchQuery
>;
export const getUserTrail = /* GraphQL */ `query GetUserTrail($trailID: ID!, $userID: ID!) {
  getUserTrail(trailID: $trailID, userID: $userID) {
    createdAt
    dateCompleted
    milesRemaining
    notes
    trail {
      alltrailsUrl
      createdAt
      description
      id
      lengthMiles
      name
      trailLinkUrl
      updatedAt
      __typename
    }
    trailID
    updatedAt
    userID
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserTrailQueryVariables,
  APITypes.GetUserTrailQuery
>;
export const listAdminNotifications = /* GraphQL */ `query ListAdminNotifications(
  $filter: ModelAdminNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  listAdminNotifications(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      body
      createdAt
      id
      link
      read
      title
      type
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAdminNotificationsQueryVariables,
  APITypes.ListAdminNotificationsQuery
>;
export const listAppSettings = /* GraphQL */ `query ListAppSettings(
  $filter: ModelAppSettingFilterInput
  $key: String
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listAppSettings(
    filter: $filter
    key: $key
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      key
      updatedAt
      value
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAppSettingsQueryVariables,
  APITypes.ListAppSettingsQuery
>;
export const listMountains = /* GraphQL */ `query ListMountains(
  $filter: ModelMountainFilterInput
  $limit: Int
  $nextToken: String
) {
  listMountains(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      alltrailsUrl
      city
      createdAt
      elevation
      id
      latitude
      longitude
      name
      peakbaggerUrl
      state
      updatedAt
      weatherUrl
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
export const listPatchMountains = /* GraphQL */ `query ListPatchMountains(
  $filter: ModelPatchMountainFilterInput
  $limit: Int
  $nextToken: String
) {
  listPatchMountains(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      delisted
      id
      mountainPatchMountainsId
      patchPatchMountainsId
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
export const listPatchOwnerRequests = /* GraphQL */ `query ListPatchOwnerRequests(
  $filter: ModelPatchOwnerRequestFilterInput
  $limit: Int
  $nextToken: String
) {
  listPatchOwnerRequests(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      createdAt
      id
      message
      patchID
      patchName
      status
      updatedAt
      userEmail
      userID
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPatchOwnerRequestsQueryVariables,
  APITypes.ListPatchOwnerRequestsQuery
>;
export const listPatchOwners = /* GraphQL */ `query ListPatchOwners(
  $filter: ModelPatchOwnerFilterInput
  $limit: Int
  $nextToken: String
) {
  listPatchOwners(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      patchID
      patchName
      updatedAt
      userEmail
      userID
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPatchOwnersQueryVariables,
  APITypes.ListPatchOwnersQuery
>;
export const listPatchProgress = /* GraphQL */ `query ListPatchProgress($patchIds: [ID!]!, $userId: ID!) {
  listPatchProgress(patchIds: $patchIds, userId: $userId) {
    completed
    denom
    note
    patchId
    percent
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPatchProgressQueryVariables,
  APITypes.ListPatchProgressQuery
>;
export const listPatchPurchases = /* GraphQL */ `query ListPatchPurchases(
  $filter: ModelPatchPurchaseFilterInput
  $limit: Int
  $nextToken: String
) {
  listPatchPurchases(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      amount
      createdAt
      currency
      id
      patchId
      stripeReceiptUrl
      stripeSessionId
      updatedAt
      userId
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
export const listPatchRequests = /* GraphQL */ `query ListPatchRequests(
  $filter: ModelPatchRequestFilterInput
  $limit: Int
  $nextToken: String
) {
  listPatchRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      description
      email
      id
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
export const listPatchTrails = /* GraphQL */ `query ListPatchTrails(
  $filter: ModelPatchTrailFilterInput
  $limit: Int
  $nextToken: String
) {
  listPatchTrails(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      patchPatchTrailsId
      requiredMiles
      trailPatchTrailsId
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
export const listPatches = /* GraphQL */ `query ListPatches(
  $filter: ModelPatchFilterInput
  $limit: Int
  $nextToken: String
) {
  listPatches(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      alltrailsUrl
      completionRule
      createdAt
      description
      difficulty
      facebookUrl
      formUrl
      hasPeaks
      hasTrails
      howToGet
      id
      imageUrl
      isPurchasable
      latitude
      longitude
      name
      popularity
      purchaseUrl
      regions
      seasons
      status
      updatedAt
      websiteUrl
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
export const listTrails = /* GraphQL */ `query ListTrails(
  $filter: ModelTrailFilterInput
  $limit: Int
  $nextToken: String
) {
  listTrails(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      alltrailsUrl
      createdAt
      description
      id
      lengthMiles
      name
      trailLinkUrl
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
export const listUserMountains = /* GraphQL */ `query ListUserMountains(
  $filter: ModelUserMountainFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserMountains(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      dateClimbed
      id
      mountainID
      notes
      owner
      updatedAt
      userID
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
export const listUserPatches = /* GraphQL */ `query ListUserPatches(
  $filter: ModelUserPatchFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserPatches(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      dateCompleted
      difficulty
      id
      imageUrl
      inProgress
      notes
      patchID
      updatedAt
      userID
      wishlisted
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
export const listUserTrails = /* GraphQL */ `query ListUserTrails(
  $filter: ModelUserTrailFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $trailID: ModelIDKeyConditionInput
  $userID: ID
) {
  listUserTrails(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    trailID: $trailID
    userID: $userID
  ) {
    items {
      createdAt
      dateCompleted
      milesRemaining
      notes
      trailID
      updatedAt
      userID
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
export const patchMountainsByMountain = /* GraphQL */ `query PatchMountainsByMountain(
  $filter: ModelPatchMountainFilterInput
  $limit: Int
  $mountainPatchMountainsId: ID!
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  patchMountainsByMountain(
    filter: $filter
    limit: $limit
    mountainPatchMountainsId: $mountainPatchMountainsId
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      delisted
      id
      mountainPatchMountainsId
      patchPatchMountainsId
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
export const patchMountainsByPatch = /* GraphQL */ `query PatchMountainsByPatch(
  $filter: ModelPatchMountainFilterInput
  $limit: Int
  $nextToken: String
  $patchPatchMountainsId: ID!
  $sortDirection: ModelSortDirection
) {
  patchMountainsByPatch(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    patchPatchMountainsId: $patchPatchMountainsId
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      delisted
      id
      mountainPatchMountainsId
      patchPatchMountainsId
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
export const patchOwnersByPatch = /* GraphQL */ `query PatchOwnersByPatch(
  $filter: ModelPatchOwnerFilterInput
  $limit: Int
  $nextToken: String
  $patchID: ID!
  $sortDirection: ModelSortDirection
) {
  patchOwnersByPatch(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    patchID: $patchID
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      id
      patchID
      patchName
      updatedAt
      userEmail
      userID
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PatchOwnersByPatchQueryVariables,
  APITypes.PatchOwnersByPatchQuery
>;
export const patchOwnersByUser = /* GraphQL */ `query PatchOwnersByUser(
  $filter: ModelPatchOwnerFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $userID: String!
) {
  patchOwnersByUser(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    userID: $userID
  ) {
    items {
      createdAt
      id
      patchID
      patchName
      updatedAt
      userEmail
      userID
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PatchOwnersByUserQueryVariables,
  APITypes.PatchOwnersByUserQuery
>;
export const patchTrailsByPatch = /* GraphQL */ `query PatchTrailsByPatch(
  $filter: ModelPatchTrailFilterInput
  $limit: Int
  $nextToken: String
  $patchPatchTrailsId: ID!
  $sortDirection: ModelSortDirection
) {
  patchTrailsByPatch(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    patchPatchTrailsId: $patchPatchTrailsId
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      id
      patchPatchTrailsId
      requiredMiles
      trailPatchTrailsId
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
  $filter: ModelPatchTrailFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $trailPatchTrailsId: ID!
) {
  patchTrailsByTrail(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    trailPatchTrailsId: $trailPatchTrailsId
  ) {
    items {
      createdAt
      id
      patchPatchTrailsId
      requiredMiles
      trailPatchTrailsId
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
export const userMountainsByMountain = /* GraphQL */ `query UserMountainsByMountain(
  $filter: ModelUserMountainFilterInput
  $limit: Int
  $mountainID: ID!
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  userMountainsByMountain(
    filter: $filter
    limit: $limit
    mountainID: $mountainID
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      dateClimbed
      id
      mountainID
      notes
      owner
      updatedAt
      userID
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
export const userMountainsByUser = /* GraphQL */ `query UserMountainsByUser(
  $filter: ModelUserMountainFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $userID: ID!
) {
  userMountainsByUser(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    userID: $userID
  ) {
    items {
      createdAt
      dateClimbed
      id
      mountainID
      notes
      owner
      updatedAt
      userID
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
export const userMountainsByUserByDate = /* GraphQL */ `query UserMountainsByUserByDate(
  $dateClimbed: ModelStringKeyConditionInput
  $filter: ModelUserMountainFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $userID: ID!
) {
  userMountainsByUserByDate(
    dateClimbed: $dateClimbed
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    userID: $userID
  ) {
    items {
      createdAt
      dateClimbed
      id
      mountainID
      notes
      owner
      updatedAt
      userID
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
export const userMountainsByUserByMountain = /* GraphQL */ `query UserMountainsByUserByMountain(
  $filter: ModelUserMountainFilterInput
  $limit: Int
  $mountainID: ModelIDKeyConditionInput
  $nextToken: String
  $sortDirection: ModelSortDirection
  $userID: ID!
) {
  userMountainsByUserByMountain(
    filter: $filter
    limit: $limit
    mountainID: $mountainID
    nextToken: $nextToken
    sortDirection: $sortDirection
    userID: $userID
  ) {
    items {
      createdAt
      dateClimbed
      id
      mountainID
      notes
      owner
      updatedAt
      userID
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
export const userPatchesByPatch = /* GraphQL */ `query UserPatchesByPatch(
  $filter: ModelUserPatchFilterInput
  $limit: Int
  $nextToken: String
  $patchID: ID!
  $sortDirection: ModelSortDirection
) {
  userPatchesByPatch(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    patchID: $patchID
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      dateCompleted
      difficulty
      id
      imageUrl
      inProgress
      notes
      patchID
      updatedAt
      userID
      wishlisted
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
  $filter: ModelUserPatchFilterInput
  $limit: Int
  $nextToken: String
  $patchID: ModelIDKeyConditionInput
  $sortDirection: ModelSortDirection
  $userID: String!
) {
  userPatchesByUserByPatch(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    patchID: $patchID
    sortDirection: $sortDirection
    userID: $userID
  ) {
    items {
      createdAt
      dateCompleted
      difficulty
      id
      imageUrl
      inProgress
      notes
      patchID
      updatedAt
      userID
      wishlisted
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
export const userTrailsByTrail = /* GraphQL */ `query UserTrailsByTrail(
  $filter: ModelUserTrailFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $trailID: ID!
) {
  userTrailsByTrail(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    trailID: $trailID
  ) {
    items {
      createdAt
      dateCompleted
      milesRemaining
      notes
      trailID
      updatedAt
      userID
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
export const userTrailsByUser = /* GraphQL */ `query UserTrailsByUser(
  $filter: ModelUserTrailFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $userID: ID!
) {
  userTrailsByUser(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    userID: $userID
  ) {
    items {
      createdAt
      dateCompleted
      milesRemaining
      notes
      trailID
      updatedAt
      userID
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
  $dateCompleted: ModelStringKeyConditionInput
  $filter: ModelUserTrailFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $userID: ID!
) {
  userTrailsByUserByDateCompleted(
    dateCompleted: $dateCompleted
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    userID: $userID
  ) {
    items {
      createdAt
      dateCompleted
      milesRemaining
      notes
      trailID
      updatedAt
      userID
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
