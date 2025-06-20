/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

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
export const getPatch = /* GraphQL */ `query GetPatch($id: ID!) {
  getPatch(id: $id) {
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
export const userPatchesByPatchID = /* GraphQL */ `query UserPatchesByPatchID(
  $patchID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserPatchFilterInput
  $limit: Int
  $nextToken: String
) {
  userPatchesByPatchID(
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
  APITypes.UserPatchesByPatchIDQueryVariables,
  APITypes.UserPatchesByPatchIDQuery
>;
