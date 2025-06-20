/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createPatchRequest = /* GraphQL */ `mutation CreatePatchRequest(
  $input: CreatePatchRequestInput!
  $condition: ModelPatchRequestConditionInput
) {
  createPatchRequest(input: $input, condition: $condition) {
    id
    email
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePatchRequestMutationVariables,
  APITypes.CreatePatchRequestMutation
>;
export const updatePatchRequest = /* GraphQL */ `mutation UpdatePatchRequest(
  $input: UpdatePatchRequestInput!
  $condition: ModelPatchRequestConditionInput
) {
  updatePatchRequest(input: $input, condition: $condition) {
    id
    email
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePatchRequestMutationVariables,
  APITypes.UpdatePatchRequestMutation
>;
export const deletePatchRequest = /* GraphQL */ `mutation DeletePatchRequest(
  $input: DeletePatchRequestInput!
  $condition: ModelPatchRequestConditionInput
) {
  deletePatchRequest(input: $input, condition: $condition) {
    id
    email
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePatchRequestMutationVariables,
  APITypes.DeletePatchRequestMutation
>;
export const createPatch = /* GraphQL */ `mutation CreatePatch(
  $input: CreatePatchInput!
  $condition: ModelPatchConditionInput
) {
  createPatch(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreatePatchMutationVariables,
  APITypes.CreatePatchMutation
>;
export const updatePatch = /* GraphQL */ `mutation UpdatePatch(
  $input: UpdatePatchInput!
  $condition: ModelPatchConditionInput
) {
  updatePatch(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdatePatchMutationVariables,
  APITypes.UpdatePatchMutation
>;
export const deletePatch = /* GraphQL */ `mutation DeletePatch(
  $input: DeletePatchInput!
  $condition: ModelPatchConditionInput
) {
  deletePatch(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeletePatchMutationVariables,
  APITypes.DeletePatchMutation
>;
export const createUserPatch = /* GraphQL */ `mutation CreateUserPatch(
  $input: CreateUserPatchInput!
  $condition: ModelUserPatchConditionInput
) {
  createUserPatch(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserPatchMutationVariables,
  APITypes.CreateUserPatchMutation
>;
export const updateUserPatch = /* GraphQL */ `mutation UpdateUserPatch(
  $input: UpdateUserPatchInput!
  $condition: ModelUserPatchConditionInput
) {
  updateUserPatch(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserPatchMutationVariables,
  APITypes.UpdateUserPatchMutation
>;
export const deleteUserPatch = /* GraphQL */ `mutation DeleteUserPatch(
  $input: DeleteUserPatchInput!
  $condition: ModelUserPatchConditionInput
) {
  deleteUserPatch(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserPatchMutationVariables,
  APITypes.DeleteUserPatchMutation
>;
