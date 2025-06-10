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
