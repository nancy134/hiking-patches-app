/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreatePatch = /* GraphQL */ `subscription OnCreatePatch($filter: ModelSubscriptionPatchFilterInput) {
  onCreatePatch(filter: $filter) {
    id
    name
    description
    howToGet
    imageUrl
    regions
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePatchSubscriptionVariables,
  APITypes.OnCreatePatchSubscription
>;
export const onUpdatePatch = /* GraphQL */ `subscription OnUpdatePatch($filter: ModelSubscriptionPatchFilterInput) {
  onUpdatePatch(filter: $filter) {
    id
    name
    description
    howToGet
    imageUrl
    regions
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePatchSubscriptionVariables,
  APITypes.OnUpdatePatchSubscription
>;
export const onDeletePatch = /* GraphQL */ `subscription OnDeletePatch($filter: ModelSubscriptionPatchFilterInput) {
  onDeletePatch(filter: $filter) {
    id
    name
    description
    howToGet
    imageUrl
    regions
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePatchSubscriptionVariables,
  APITypes.OnDeletePatchSubscription
>;
export const onCreateUserPatch = /* GraphQL */ `subscription OnCreateUserPatch($filter: ModelSubscriptionUserPatchFilterInput) {
  onCreateUserPatch(filter: $filter) {
    id
    patchID
    userID
    dateCompleted
    notes
    difficulty
    imageUrl
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
export const onUpdateUserPatch = /* GraphQL */ `subscription OnUpdateUserPatch($filter: ModelSubscriptionUserPatchFilterInput) {
  onUpdateUserPatch(filter: $filter) {
    id
    patchID
    userID
    dateCompleted
    notes
    difficulty
    imageUrl
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
export const onDeleteUserPatch = /* GraphQL */ `subscription OnDeleteUserPatch($filter: ModelSubscriptionUserPatchFilterInput) {
  onDeleteUserPatch(filter: $filter) {
    id
    patchID
    userID
    dateCompleted
    notes
    difficulty
    imageUrl
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
