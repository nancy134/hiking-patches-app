/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createAdminNotification = /* GraphQL */ `mutation CreateAdminNotification(
  $condition: ModelAdminNotificationConditionInput
  $input: CreateAdminNotificationInput!
) {
  createAdminNotification(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateAdminNotificationMutationVariables,
  APITypes.CreateAdminNotificationMutation
>;
export const createAppSetting = /* GraphQL */ `mutation CreateAppSetting(
  $condition: ModelAppSettingConditionInput
  $input: CreateAppSettingInput!
) {
  createAppSetting(condition: $condition, input: $input) {
    createdAt
    key
    updatedAt
    value
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAppSettingMutationVariables,
  APITypes.CreateAppSettingMutation
>;
export const createMountain = /* GraphQL */ `mutation CreateMountain(
  $condition: ModelMountainConditionInput
  $input: CreateMountainInput!
) {
  createMountain(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMountainMutationVariables,
  APITypes.CreateMountainMutation
>;
export const createPatch = /* GraphQL */ `mutation CreatePatch(
  $condition: ModelPatchConditionInput
  $input: CreatePatchInput!
) {
  createPatch(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePatchMutationVariables,
  APITypes.CreatePatchMutation
>;
export const createPatchMountain = /* GraphQL */ `mutation CreatePatchMountain(
  $condition: ModelPatchMountainConditionInput
  $input: CreatePatchMountainInput!
) {
  createPatchMountain(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePatchMountainMutationVariables,
  APITypes.CreatePatchMountainMutation
>;
export const createPatchOwner = /* GraphQL */ `mutation CreatePatchOwner(
  $condition: ModelPatchOwnerConditionInput
  $input: CreatePatchOwnerInput!
) {
  createPatchOwner(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePatchOwnerMutationVariables,
  APITypes.CreatePatchOwnerMutation
>;
export const createPatchOwnerRequest = /* GraphQL */ `mutation CreatePatchOwnerRequest(
  $condition: ModelPatchOwnerRequestConditionInput
  $input: CreatePatchOwnerRequestInput!
) {
  createPatchOwnerRequest(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePatchOwnerRequestMutationVariables,
  APITypes.CreatePatchOwnerRequestMutation
>;
export const createPatchPurchase = /* GraphQL */ `mutation CreatePatchPurchase(
  $condition: ModelPatchPurchaseConditionInput
  $input: CreatePatchPurchaseInput!
) {
  createPatchPurchase(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePatchPurchaseMutationVariables,
  APITypes.CreatePatchPurchaseMutation
>;
export const createPatchRequest = /* GraphQL */ `mutation CreatePatchRequest(
  $condition: ModelPatchRequestConditionInput
  $input: CreatePatchRequestInput!
) {
  createPatchRequest(condition: $condition, input: $input) {
    createdAt
    description
    email
    id
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePatchRequestMutationVariables,
  APITypes.CreatePatchRequestMutation
>;
export const createPatchTrail = /* GraphQL */ `mutation CreatePatchTrail(
  $condition: ModelPatchTrailConditionInput
  $input: CreatePatchTrailInput!
) {
  createPatchTrail(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePatchTrailMutationVariables,
  APITypes.CreatePatchTrailMutation
>;
export const createTrail = /* GraphQL */ `mutation CreateTrail(
  $condition: ModelTrailConditionInput
  $input: CreateTrailInput!
) {
  createTrail(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTrailMutationVariables,
  APITypes.CreateTrailMutation
>;
export const createUserMountain = /* GraphQL */ `mutation CreateUserMountain(
  $condition: ModelUserMountainConditionInput
  $input: CreateUserMountainInput!
) {
  createUserMountain(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserMountainMutationVariables,
  APITypes.CreateUserMountainMutation
>;
export const createUserPatch = /* GraphQL */ `mutation CreateUserPatch(
  $condition: ModelUserPatchConditionInput
  $input: CreateUserPatchInput!
) {
  createUserPatch(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserPatchMutationVariables,
  APITypes.CreateUserPatchMutation
>;
export const createUserTrail = /* GraphQL */ `mutation CreateUserTrail(
  $condition: ModelUserTrailConditionInput
  $input: CreateUserTrailInput!
) {
  createUserTrail(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserTrailMutationVariables,
  APITypes.CreateUserTrailMutation
>;
export const deleteAdminNotification = /* GraphQL */ `mutation DeleteAdminNotification(
  $condition: ModelAdminNotificationConditionInput
  $input: DeleteAdminNotificationInput!
) {
  deleteAdminNotification(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteAdminNotificationMutationVariables,
  APITypes.DeleteAdminNotificationMutation
>;
export const deleteAppSetting = /* GraphQL */ `mutation DeleteAppSetting(
  $condition: ModelAppSettingConditionInput
  $input: DeleteAppSettingInput!
) {
  deleteAppSetting(condition: $condition, input: $input) {
    createdAt
    key
    updatedAt
    value
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAppSettingMutationVariables,
  APITypes.DeleteAppSettingMutation
>;
export const deleteMountain = /* GraphQL */ `mutation DeleteMountain(
  $condition: ModelMountainConditionInput
  $input: DeleteMountainInput!
) {
  deleteMountain(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMountainMutationVariables,
  APITypes.DeleteMountainMutation
>;
export const deletePatch = /* GraphQL */ `mutation DeletePatch(
  $condition: ModelPatchConditionInput
  $input: DeletePatchInput!
) {
  deletePatch(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePatchMutationVariables,
  APITypes.DeletePatchMutation
>;
export const deletePatchMountain = /* GraphQL */ `mutation DeletePatchMountain(
  $condition: ModelPatchMountainConditionInput
  $input: DeletePatchMountainInput!
) {
  deletePatchMountain(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePatchMountainMutationVariables,
  APITypes.DeletePatchMountainMutation
>;
export const deletePatchOwner = /* GraphQL */ `mutation DeletePatchOwner(
  $condition: ModelPatchOwnerConditionInput
  $input: DeletePatchOwnerInput!
) {
  deletePatchOwner(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePatchOwnerMutationVariables,
  APITypes.DeletePatchOwnerMutation
>;
export const deletePatchOwnerRequest = /* GraphQL */ `mutation DeletePatchOwnerRequest(
  $condition: ModelPatchOwnerRequestConditionInput
  $input: DeletePatchOwnerRequestInput!
) {
  deletePatchOwnerRequest(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePatchOwnerRequestMutationVariables,
  APITypes.DeletePatchOwnerRequestMutation
>;
export const deletePatchPurchase = /* GraphQL */ `mutation DeletePatchPurchase(
  $condition: ModelPatchPurchaseConditionInput
  $input: DeletePatchPurchaseInput!
) {
  deletePatchPurchase(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePatchPurchaseMutationVariables,
  APITypes.DeletePatchPurchaseMutation
>;
export const deletePatchRequest = /* GraphQL */ `mutation DeletePatchRequest(
  $condition: ModelPatchRequestConditionInput
  $input: DeletePatchRequestInput!
) {
  deletePatchRequest(condition: $condition, input: $input) {
    createdAt
    description
    email
    id
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePatchRequestMutationVariables,
  APITypes.DeletePatchRequestMutation
>;
export const deletePatchTrail = /* GraphQL */ `mutation DeletePatchTrail(
  $condition: ModelPatchTrailConditionInput
  $input: DeletePatchTrailInput!
) {
  deletePatchTrail(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePatchTrailMutationVariables,
  APITypes.DeletePatchTrailMutation
>;
export const deleteTrail = /* GraphQL */ `mutation DeleteTrail(
  $condition: ModelTrailConditionInput
  $input: DeleteTrailInput!
) {
  deleteTrail(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteTrailMutationVariables,
  APITypes.DeleteTrailMutation
>;
export const deleteUserMountain = /* GraphQL */ `mutation DeleteUserMountain(
  $condition: ModelUserMountainConditionInput
  $input: DeleteUserMountainInput!
) {
  deleteUserMountain(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMountainMutationVariables,
  APITypes.DeleteUserMountainMutation
>;
export const deleteUserPatch = /* GraphQL */ `mutation DeleteUserPatch(
  $condition: ModelUserPatchConditionInput
  $input: DeleteUserPatchInput!
) {
  deleteUserPatch(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserPatchMutationVariables,
  APITypes.DeleteUserPatchMutation
>;
export const deleteUserTrail = /* GraphQL */ `mutation DeleteUserTrail(
  $condition: ModelUserTrailConditionInput
  $input: DeleteUserTrailInput!
) {
  deleteUserTrail(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserTrailMutationVariables,
  APITypes.DeleteUserTrailMutation
>;
export const updateAdminNotification = /* GraphQL */ `mutation UpdateAdminNotification(
  $condition: ModelAdminNotificationConditionInput
  $input: UpdateAdminNotificationInput!
) {
  updateAdminNotification(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateAdminNotificationMutationVariables,
  APITypes.UpdateAdminNotificationMutation
>;
export const updateAppSetting = /* GraphQL */ `mutation UpdateAppSetting(
  $condition: ModelAppSettingConditionInput
  $input: UpdateAppSettingInput!
) {
  updateAppSetting(condition: $condition, input: $input) {
    createdAt
    key
    updatedAt
    value
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAppSettingMutationVariables,
  APITypes.UpdateAppSettingMutation
>;
export const updateMountain = /* GraphQL */ `mutation UpdateMountain(
  $condition: ModelMountainConditionInput
  $input: UpdateMountainInput!
) {
  updateMountain(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMountainMutationVariables,
  APITypes.UpdateMountainMutation
>;
export const updatePatch = /* GraphQL */ `mutation UpdatePatch(
  $condition: ModelPatchConditionInput
  $input: UpdatePatchInput!
) {
  updatePatch(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePatchMutationVariables,
  APITypes.UpdatePatchMutation
>;
export const updatePatchMountain = /* GraphQL */ `mutation UpdatePatchMountain(
  $condition: ModelPatchMountainConditionInput
  $input: UpdatePatchMountainInput!
) {
  updatePatchMountain(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePatchMountainMutationVariables,
  APITypes.UpdatePatchMountainMutation
>;
export const updatePatchOwner = /* GraphQL */ `mutation UpdatePatchOwner(
  $condition: ModelPatchOwnerConditionInput
  $input: UpdatePatchOwnerInput!
) {
  updatePatchOwner(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePatchOwnerMutationVariables,
  APITypes.UpdatePatchOwnerMutation
>;
export const updatePatchOwnerRequest = /* GraphQL */ `mutation UpdatePatchOwnerRequest(
  $condition: ModelPatchOwnerRequestConditionInput
  $input: UpdatePatchOwnerRequestInput!
) {
  updatePatchOwnerRequest(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePatchOwnerRequestMutationVariables,
  APITypes.UpdatePatchOwnerRequestMutation
>;
export const updatePatchPurchase = /* GraphQL */ `mutation UpdatePatchPurchase(
  $condition: ModelPatchPurchaseConditionInput
  $input: UpdatePatchPurchaseInput!
) {
  updatePatchPurchase(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePatchPurchaseMutationVariables,
  APITypes.UpdatePatchPurchaseMutation
>;
export const updatePatchRequest = /* GraphQL */ `mutation UpdatePatchRequest(
  $condition: ModelPatchRequestConditionInput
  $input: UpdatePatchRequestInput!
) {
  updatePatchRequest(condition: $condition, input: $input) {
    createdAt
    description
    email
    id
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePatchRequestMutationVariables,
  APITypes.UpdatePatchRequestMutation
>;
export const updatePatchTrail = /* GraphQL */ `mutation UpdatePatchTrail(
  $condition: ModelPatchTrailConditionInput
  $input: UpdatePatchTrailInput!
) {
  updatePatchTrail(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePatchTrailMutationVariables,
  APITypes.UpdatePatchTrailMutation
>;
export const updateTrail = /* GraphQL */ `mutation UpdateTrail(
  $condition: ModelTrailConditionInput
  $input: UpdateTrailInput!
) {
  updateTrail(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTrailMutationVariables,
  APITypes.UpdateTrailMutation
>;
export const updateUserMountain = /* GraphQL */ `mutation UpdateUserMountain(
  $condition: ModelUserMountainConditionInput
  $input: UpdateUserMountainInput!
) {
  updateUserMountain(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMountainMutationVariables,
  APITypes.UpdateUserMountainMutation
>;
export const updateUserPatch = /* GraphQL */ `mutation UpdateUserPatch(
  $condition: ModelUserPatchConditionInput
  $input: UpdateUserPatchInput!
) {
  updateUserPatch(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserPatchMutationVariables,
  APITypes.UpdateUserPatchMutation
>;
export const updateUserTrail = /* GraphQL */ `mutation UpdateUserTrail(
  $condition: ModelUserTrailConditionInput
  $input: UpdateUserTrailInput!
) {
  updateUserTrail(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserTrailMutationVariables,
  APITypes.UpdateUserTrailMutation
>;
