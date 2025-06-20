/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreatePatchRequest = /* GraphQL */ `subscription OnCreatePatchRequest(
  $filter: ModelSubscriptionPatchRequestFilterInput
) {
  onCreatePatchRequest(filter: $filter) {
    id
    email
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePatchRequestSubscriptionVariables,
  APITypes.OnCreatePatchRequestSubscription
>;
export const onUpdatePatchRequest = /* GraphQL */ `subscription OnUpdatePatchRequest(
  $filter: ModelSubscriptionPatchRequestFilterInput
) {
  onUpdatePatchRequest(filter: $filter) {
    id
    email
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePatchRequestSubscriptionVariables,
  APITypes.OnUpdatePatchRequestSubscription
>;
export const onDeletePatchRequest = /* GraphQL */ `subscription OnDeletePatchRequest(
  $filter: ModelSubscriptionPatchRequestFilterInput
) {
  onDeletePatchRequest(filter: $filter) {
    id
    email
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePatchRequestSubscriptionVariables,
  APITypes.OnDeletePatchRequestSubscription
>;
export const onCreatePatch = /* GraphQL */ `subscription OnCreatePatch(
  $filter: ModelSubscriptionPatchFilterInput
  $owner: String
) {
  onCreatePatch(filter: $filter, owner: $owner) {
    id
    name
    description
    howToGet
    imageUrl
    regions
    difficulty
    userPatches {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePatchSubscriptionVariables,
  APITypes.OnCreatePatchSubscription
>;
export const onUpdatePatch = /* GraphQL */ `subscription OnUpdatePatch(
  $filter: ModelSubscriptionPatchFilterInput
  $owner: String
) {
  onUpdatePatch(filter: $filter, owner: $owner) {
    id
    name
    description
    howToGet
    imageUrl
    regions
    difficulty
    userPatches {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePatchSubscriptionVariables,
  APITypes.OnUpdatePatchSubscription
>;
export const onDeletePatch = /* GraphQL */ `subscription OnDeletePatch(
  $filter: ModelSubscriptionPatchFilterInput
  $owner: String
) {
  onDeletePatch(filter: $filter, owner: $owner) {
    id
    name
    description
    howToGet
    imageUrl
    regions
    difficulty
    userPatches {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePatchSubscriptionVariables,
  APITypes.OnDeletePatchSubscription
>;
export const onCreateUserPatch = /* GraphQL */ `subscription OnCreateUserPatch(
  $filter: ModelSubscriptionUserPatchFilterInput
  $owner: String
) {
  onCreateUserPatch(filter: $filter, owner: $owner) {
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
      createdAt
      updatedAt
      owner
      __typename
    }
    userID
    dateCompleted
    notes
    difficulty
    imageUrl
    inProgress
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserPatchSubscriptionVariables,
  APITypes.OnCreateUserPatchSubscription
>;
export const onUpdateUserPatch = /* GraphQL */ `subscription OnUpdateUserPatch(
  $filter: ModelSubscriptionUserPatchFilterInput
  $owner: String
) {
  onUpdateUserPatch(filter: $filter, owner: $owner) {
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
      createdAt
      updatedAt
      owner
      __typename
    }
    userID
    dateCompleted
    notes
    difficulty
    imageUrl
    inProgress
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserPatchSubscriptionVariables,
  APITypes.OnUpdateUserPatchSubscription
>;
export const onDeleteUserPatch = /* GraphQL */ `subscription OnDeleteUserPatch(
  $filter: ModelSubscriptionUserPatchFilterInput
  $owner: String
) {
  onDeleteUserPatch(filter: $filter, owner: $owner) {
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
      createdAt
      updatedAt
      owner
      __typename
    }
    userID
    dateCompleted
    notes
    difficulty
    imageUrl
    inProgress
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserPatchSubscriptionVariables,
  APITypes.OnDeleteUserPatchSubscription
>;
