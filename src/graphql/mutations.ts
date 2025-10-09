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
    howToGet
    imageUrl
    regions
    difficulty
    latitude
    longitude
    popularity
    hasPeaks
    completionRule
    userPatches {
      nextToken
      __typename
    }
    patchMountains {
      nextToken
      __typename
    }
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
    howToGet
    imageUrl
    regions
    difficulty
    latitude
    longitude
    popularity
    hasPeaks
    completionRule
    userPatches {
      nextToken
      __typename
    }
    patchMountains {
      nextToken
      __typename
    }
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
    howToGet
    imageUrl
    regions
    difficulty
    latitude
    longitude
    popularity
    hasPeaks
    completionRule
    userPatches {
      nextToken
      __typename
    }
    patchMountains {
      nextToken
      __typename
    }
    createdAt
    updatedAt
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
      latitude
      longitude
      popularity
      hasPeaks
      completionRule
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
      latitude
      longitude
      popularity
      hasPeaks
      completionRule
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
      latitude
      longitude
      popularity
      hasPeaks
      completionRule
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
` as GeneratedMutation<
  APITypes.DeleteUserPatchMutationVariables,
  APITypes.DeleteUserPatchMutation
>;
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
export const createMountain = /* GraphQL */ `mutation CreateMountain(
  $input: CreateMountainInput!
  $condition: ModelMountainConditionInput
) {
  createMountain(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateMountainMutationVariables,
  APITypes.CreateMountainMutation
>;
export const updateMountain = /* GraphQL */ `mutation UpdateMountain(
  $input: UpdateMountainInput!
  $condition: ModelMountainConditionInput
) {
  updateMountain(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateMountainMutationVariables,
  APITypes.UpdateMountainMutation
>;
export const deleteMountain = /* GraphQL */ `mutation DeleteMountain(
  $input: DeleteMountainInput!
  $condition: ModelMountainConditionInput
) {
  deleteMountain(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteMountainMutationVariables,
  APITypes.DeleteMountainMutation
>;
export const createPatchMountain = /* GraphQL */ `mutation CreatePatchMountain(
  $input: CreatePatchMountainInput!
  $condition: ModelPatchMountainConditionInput
) {
  createPatchMountain(input: $input, condition: $condition) {
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
      completionRule
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
` as GeneratedMutation<
  APITypes.CreatePatchMountainMutationVariables,
  APITypes.CreatePatchMountainMutation
>;
export const updatePatchMountain = /* GraphQL */ `mutation UpdatePatchMountain(
  $input: UpdatePatchMountainInput!
  $condition: ModelPatchMountainConditionInput
) {
  updatePatchMountain(input: $input, condition: $condition) {
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
      completionRule
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
` as GeneratedMutation<
  APITypes.UpdatePatchMountainMutationVariables,
  APITypes.UpdatePatchMountainMutation
>;
export const deletePatchMountain = /* GraphQL */ `mutation DeletePatchMountain(
  $input: DeletePatchMountainInput!
  $condition: ModelPatchMountainConditionInput
) {
  deletePatchMountain(input: $input, condition: $condition) {
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
      completionRule
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
` as GeneratedMutation<
  APITypes.DeletePatchMountainMutationVariables,
  APITypes.DeletePatchMountainMutation
>;
export const createUserMountain = /* GraphQL */ `mutation CreateUserMountain(
  $input: CreateUserMountainInput!
  $condition: ModelUserMountainConditionInput
) {
  createUserMountain(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserMountainMutationVariables,
  APITypes.CreateUserMountainMutation
>;
export const updateUserMountain = /* GraphQL */ `mutation UpdateUserMountain(
  $input: UpdateUserMountainInput!
  $condition: ModelUserMountainConditionInput
) {
  updateUserMountain(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMountainMutationVariables,
  APITypes.UpdateUserMountainMutation
>;
export const deleteUserMountain = /* GraphQL */ `mutation DeleteUserMountain(
  $input: DeleteUserMountainInput!
  $condition: ModelUserMountainConditionInput
) {
  deleteUserMountain(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMountainMutationVariables,
  APITypes.DeleteUserMountainMutation
>;
