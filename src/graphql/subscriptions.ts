/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateAdminNotification = /* GraphQL */ `subscription OnCreateAdminNotification(
  $filter: ModelSubscriptionAdminNotificationFilterInput
) {
  onCreateAdminNotification(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAdminNotificationSubscriptionVariables,
  APITypes.OnCreateAdminNotificationSubscription
>;
export const onCreateAppSetting = /* GraphQL */ `subscription OnCreateAppSetting(
  $filter: ModelSubscriptionAppSettingFilterInput
) {
  onCreateAppSetting(filter: $filter) {
    createdAt
    key
    updatedAt
    value
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateAppSettingSubscriptionVariables,
  APITypes.OnCreateAppSettingSubscription
>;
export const onCreateMountain = /* GraphQL */ `subscription OnCreateMountain($filter: ModelSubscriptionMountainFilterInput) {
  onCreateMountain(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMountainSubscriptionVariables,
  APITypes.OnCreateMountainSubscription
>;
export const onCreatePatch = /* GraphQL */ `subscription OnCreatePatch($filter: ModelSubscriptionPatchFilterInput) {
  onCreatePatch(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePatchSubscriptionVariables,
  APITypes.OnCreatePatchSubscription
>;
export const onCreatePatchMountain = /* GraphQL */ `subscription OnCreatePatchMountain(
  $filter: ModelSubscriptionPatchMountainFilterInput
) {
  onCreatePatchMountain(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePatchMountainSubscriptionVariables,
  APITypes.OnCreatePatchMountainSubscription
>;
export const onCreatePatchOwner = /* GraphQL */ `subscription OnCreatePatchOwner(
  $filter: ModelSubscriptionPatchOwnerFilterInput
) {
  onCreatePatchOwner(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePatchOwnerSubscriptionVariables,
  APITypes.OnCreatePatchOwnerSubscription
>;
export const onCreatePatchOwnerRequest = /* GraphQL */ `subscription OnCreatePatchOwnerRequest(
  $filter: ModelSubscriptionPatchOwnerRequestFilterInput
  $userID: String
) {
  onCreatePatchOwnerRequest(filter: $filter, userID: $userID) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePatchOwnerRequestSubscriptionVariables,
  APITypes.OnCreatePatchOwnerRequestSubscription
>;
export const onCreatePatchPurchase = /* GraphQL */ `subscription OnCreatePatchPurchase(
  $filter: ModelSubscriptionPatchPurchaseFilterInput
  $userId: String
) {
  onCreatePatchPurchase(filter: $filter, userId: $userId) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePatchPurchaseSubscriptionVariables,
  APITypes.OnCreatePatchPurchaseSubscription
>;
export const onCreatePatchRequest = /* GraphQL */ `subscription OnCreatePatchRequest(
  $filter: ModelSubscriptionPatchRequestFilterInput
) {
  onCreatePatchRequest(filter: $filter) {
    createdAt
    description
    email
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePatchRequestSubscriptionVariables,
  APITypes.OnCreatePatchRequestSubscription
>;
export const onCreatePatchTrail = /* GraphQL */ `subscription OnCreatePatchTrail(
  $filter: ModelSubscriptionPatchTrailFilterInput
) {
  onCreatePatchTrail(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePatchTrailSubscriptionVariables,
  APITypes.OnCreatePatchTrailSubscription
>;
export const onCreateTrail = /* GraphQL */ `subscription OnCreateTrail($filter: ModelSubscriptionTrailFilterInput) {
  onCreateTrail(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTrailSubscriptionVariables,
  APITypes.OnCreateTrailSubscription
>;
export const onCreateUserMountain = /* GraphQL */ `subscription OnCreateUserMountain(
  $filter: ModelSubscriptionUserMountainFilterInput
  $owner: String
) {
  onCreateUserMountain(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserMountainSubscriptionVariables,
  APITypes.OnCreateUserMountainSubscription
>;
export const onCreateUserPatch = /* GraphQL */ `subscription OnCreateUserPatch(
  $filter: ModelSubscriptionUserPatchFilterInput
  $userID: String
) {
  onCreateUserPatch(filter: $filter, userID: $userID) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserPatchSubscriptionVariables,
  APITypes.OnCreateUserPatchSubscription
>;
export const onCreateUserTrail = /* GraphQL */ `subscription OnCreateUserTrail(
  $filter: ModelSubscriptionUserTrailFilterInput
  $userID: String
) {
  onCreateUserTrail(filter: $filter, userID: $userID) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserTrailSubscriptionVariables,
  APITypes.OnCreateUserTrailSubscription
>;
export const onDeleteAdminNotification = /* GraphQL */ `subscription OnDeleteAdminNotification(
  $filter: ModelSubscriptionAdminNotificationFilterInput
) {
  onDeleteAdminNotification(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAdminNotificationSubscriptionVariables,
  APITypes.OnDeleteAdminNotificationSubscription
>;
export const onDeleteAppSetting = /* GraphQL */ `subscription OnDeleteAppSetting(
  $filter: ModelSubscriptionAppSettingFilterInput
) {
  onDeleteAppSetting(filter: $filter) {
    createdAt
    key
    updatedAt
    value
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteAppSettingSubscriptionVariables,
  APITypes.OnDeleteAppSettingSubscription
>;
export const onDeleteMountain = /* GraphQL */ `subscription OnDeleteMountain($filter: ModelSubscriptionMountainFilterInput) {
  onDeleteMountain(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMountainSubscriptionVariables,
  APITypes.OnDeleteMountainSubscription
>;
export const onDeletePatch = /* GraphQL */ `subscription OnDeletePatch($filter: ModelSubscriptionPatchFilterInput) {
  onDeletePatch(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePatchSubscriptionVariables,
  APITypes.OnDeletePatchSubscription
>;
export const onDeletePatchMountain = /* GraphQL */ `subscription OnDeletePatchMountain(
  $filter: ModelSubscriptionPatchMountainFilterInput
) {
  onDeletePatchMountain(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePatchMountainSubscriptionVariables,
  APITypes.OnDeletePatchMountainSubscription
>;
export const onDeletePatchOwner = /* GraphQL */ `subscription OnDeletePatchOwner(
  $filter: ModelSubscriptionPatchOwnerFilterInput
) {
  onDeletePatchOwner(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePatchOwnerSubscriptionVariables,
  APITypes.OnDeletePatchOwnerSubscription
>;
export const onDeletePatchOwnerRequest = /* GraphQL */ `subscription OnDeletePatchOwnerRequest(
  $filter: ModelSubscriptionPatchOwnerRequestFilterInput
  $userID: String
) {
  onDeletePatchOwnerRequest(filter: $filter, userID: $userID) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePatchOwnerRequestSubscriptionVariables,
  APITypes.OnDeletePatchOwnerRequestSubscription
>;
export const onDeletePatchPurchase = /* GraphQL */ `subscription OnDeletePatchPurchase(
  $filter: ModelSubscriptionPatchPurchaseFilterInput
  $userId: String
) {
  onDeletePatchPurchase(filter: $filter, userId: $userId) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePatchPurchaseSubscriptionVariables,
  APITypes.OnDeletePatchPurchaseSubscription
>;
export const onDeletePatchRequest = /* GraphQL */ `subscription OnDeletePatchRequest(
  $filter: ModelSubscriptionPatchRequestFilterInput
) {
  onDeletePatchRequest(filter: $filter) {
    createdAt
    description
    email
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePatchRequestSubscriptionVariables,
  APITypes.OnDeletePatchRequestSubscription
>;
export const onDeletePatchTrail = /* GraphQL */ `subscription OnDeletePatchTrail(
  $filter: ModelSubscriptionPatchTrailFilterInput
) {
  onDeletePatchTrail(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePatchTrailSubscriptionVariables,
  APITypes.OnDeletePatchTrailSubscription
>;
export const onDeleteTrail = /* GraphQL */ `subscription OnDeleteTrail($filter: ModelSubscriptionTrailFilterInput) {
  onDeleteTrail(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTrailSubscriptionVariables,
  APITypes.OnDeleteTrailSubscription
>;
export const onDeleteUserMountain = /* GraphQL */ `subscription OnDeleteUserMountain(
  $filter: ModelSubscriptionUserMountainFilterInput
  $owner: String
) {
  onDeleteUserMountain(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserMountainSubscriptionVariables,
  APITypes.OnDeleteUserMountainSubscription
>;
export const onDeleteUserPatch = /* GraphQL */ `subscription OnDeleteUserPatch(
  $filter: ModelSubscriptionUserPatchFilterInput
  $userID: String
) {
  onDeleteUserPatch(filter: $filter, userID: $userID) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserPatchSubscriptionVariables,
  APITypes.OnDeleteUserPatchSubscription
>;
export const onDeleteUserTrail = /* GraphQL */ `subscription OnDeleteUserTrail(
  $filter: ModelSubscriptionUserTrailFilterInput
  $userID: String
) {
  onDeleteUserTrail(filter: $filter, userID: $userID) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserTrailSubscriptionVariables,
  APITypes.OnDeleteUserTrailSubscription
>;
export const onUpdateAdminNotification = /* GraphQL */ `subscription OnUpdateAdminNotification(
  $filter: ModelSubscriptionAdminNotificationFilterInput
) {
  onUpdateAdminNotification(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAdminNotificationSubscriptionVariables,
  APITypes.OnUpdateAdminNotificationSubscription
>;
export const onUpdateAppSetting = /* GraphQL */ `subscription OnUpdateAppSetting(
  $filter: ModelSubscriptionAppSettingFilterInput
) {
  onUpdateAppSetting(filter: $filter) {
    createdAt
    key
    updatedAt
    value
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateAppSettingSubscriptionVariables,
  APITypes.OnUpdateAppSettingSubscription
>;
export const onUpdateMountain = /* GraphQL */ `subscription OnUpdateMountain($filter: ModelSubscriptionMountainFilterInput) {
  onUpdateMountain(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMountainSubscriptionVariables,
  APITypes.OnUpdateMountainSubscription
>;
export const onUpdatePatch = /* GraphQL */ `subscription OnUpdatePatch($filter: ModelSubscriptionPatchFilterInput) {
  onUpdatePatch(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePatchSubscriptionVariables,
  APITypes.OnUpdatePatchSubscription
>;
export const onUpdatePatchMountain = /* GraphQL */ `subscription OnUpdatePatchMountain(
  $filter: ModelSubscriptionPatchMountainFilterInput
) {
  onUpdatePatchMountain(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePatchMountainSubscriptionVariables,
  APITypes.OnUpdatePatchMountainSubscription
>;
export const onUpdatePatchOwner = /* GraphQL */ `subscription OnUpdatePatchOwner(
  $filter: ModelSubscriptionPatchOwnerFilterInput
) {
  onUpdatePatchOwner(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePatchOwnerSubscriptionVariables,
  APITypes.OnUpdatePatchOwnerSubscription
>;
export const onUpdatePatchOwnerRequest = /* GraphQL */ `subscription OnUpdatePatchOwnerRequest(
  $filter: ModelSubscriptionPatchOwnerRequestFilterInput
  $userID: String
) {
  onUpdatePatchOwnerRequest(filter: $filter, userID: $userID) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePatchOwnerRequestSubscriptionVariables,
  APITypes.OnUpdatePatchOwnerRequestSubscription
>;
export const onUpdatePatchPurchase = /* GraphQL */ `subscription OnUpdatePatchPurchase(
  $filter: ModelSubscriptionPatchPurchaseFilterInput
  $userId: String
) {
  onUpdatePatchPurchase(filter: $filter, userId: $userId) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePatchPurchaseSubscriptionVariables,
  APITypes.OnUpdatePatchPurchaseSubscription
>;
export const onUpdatePatchRequest = /* GraphQL */ `subscription OnUpdatePatchRequest(
  $filter: ModelSubscriptionPatchRequestFilterInput
) {
  onUpdatePatchRequest(filter: $filter) {
    createdAt
    description
    email
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePatchRequestSubscriptionVariables,
  APITypes.OnUpdatePatchRequestSubscription
>;
export const onUpdatePatchTrail = /* GraphQL */ `subscription OnUpdatePatchTrail(
  $filter: ModelSubscriptionPatchTrailFilterInput
) {
  onUpdatePatchTrail(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePatchTrailSubscriptionVariables,
  APITypes.OnUpdatePatchTrailSubscription
>;
export const onUpdateTrail = /* GraphQL */ `subscription OnUpdateTrail($filter: ModelSubscriptionTrailFilterInput) {
  onUpdateTrail(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTrailSubscriptionVariables,
  APITypes.OnUpdateTrailSubscription
>;
export const onUpdateUserMountain = /* GraphQL */ `subscription OnUpdateUserMountain(
  $filter: ModelSubscriptionUserMountainFilterInput
  $owner: String
) {
  onUpdateUserMountain(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserMountainSubscriptionVariables,
  APITypes.OnUpdateUserMountainSubscription
>;
export const onUpdateUserPatch = /* GraphQL */ `subscription OnUpdateUserPatch(
  $filter: ModelSubscriptionUserPatchFilterInput
  $userID: String
) {
  onUpdateUserPatch(filter: $filter, userID: $userID) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserPatchSubscriptionVariables,
  APITypes.OnUpdateUserPatchSubscription
>;
export const onUpdateUserTrail = /* GraphQL */ `subscription OnUpdateUserTrail(
  $filter: ModelSubscriptionUserTrailFilterInput
  $userID: String
) {
  onUpdateUserTrail(filter: $filter, userID: $userID) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserTrailSubscriptionVariables,
  APITypes.OnUpdateUserTrailSubscription
>;
