/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createPatch = /* GraphQL */ `mutation CreatePatch(
  $input: CreatePatchInput!
  $condition: ModelPatchConditionInput
) {
  createPatch(input: $input, condition: $condition) {
    id
    name
    description
    imageUrl
    createdAt
    updatedAt
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
    imageUrl
    createdAt
    updatedAt
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
    imageUrl
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePatchMutationVariables,
  APITypes.DeletePatchMutation
>;
