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
    difficulty
    latitude
    longitude
    popularity
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
    difficulty
    latitude
    longitude
    popularity
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
    difficulty
    latitude
    longitude
    popularity
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
      latitude
      longitude
      popularity
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
      latitude
      longitude
      popularity
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
      latitude
      longitude
      popularity
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
export const onCreateMountain = /* GraphQL */ `subscription OnCreateMountain($filter: ModelSubscriptionMountainFilterInput) {
  onCreateMountain(filter: $filter) {
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
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateMountainSubscriptionVariables,
  APITypes.OnCreateMountainSubscription
>;
export const onUpdateMountain = /* GraphQL */ `subscription OnUpdateMountain($filter: ModelSubscriptionMountainFilterInput) {
  onUpdateMountain(filter: $filter) {
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
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateMountainSubscriptionVariables,
  APITypes.OnUpdateMountainSubscription
>;
export const onDeleteMountain = /* GraphQL */ `subscription OnDeleteMountain($filter: ModelSubscriptionMountainFilterInput) {
  onDeleteMountain(filter: $filter) {
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
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteMountainSubscriptionVariables,
  APITypes.OnDeleteMountainSubscription
>;
export const onCreatePatchMountain = /* GraphQL */ `subscription OnCreatePatchMountain(
  $filter: ModelSubscriptionPatchMountainFilterInput
) {
  onCreatePatchMountain(filter: $filter) {
    id
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
    createdAt
    updatedAt
    patchPatchMountainsId
    mountainPatchMountainsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePatchMountainSubscriptionVariables,
  APITypes.OnCreatePatchMountainSubscription
>;
export const onUpdatePatchMountain = /* GraphQL */ `subscription OnUpdatePatchMountain(
  $filter: ModelSubscriptionPatchMountainFilterInput
) {
  onUpdatePatchMountain(filter: $filter) {
    id
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
    createdAt
    updatedAt
    patchPatchMountainsId
    mountainPatchMountainsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePatchMountainSubscriptionVariables,
  APITypes.OnUpdatePatchMountainSubscription
>;
export const onDeletePatchMountain = /* GraphQL */ `subscription OnDeletePatchMountain(
  $filter: ModelSubscriptionPatchMountainFilterInput
) {
  onDeletePatchMountain(filter: $filter) {
    id
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
    createdAt
    updatedAt
    patchPatchMountainsId
    mountainPatchMountainsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePatchMountainSubscriptionVariables,
  APITypes.OnDeletePatchMountainSubscription
>;
